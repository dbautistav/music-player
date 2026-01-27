# Quick Start Guide: Service Worker and Caching

**Feature**: Phase 3 - Service Worker and Caching
**Date**: 2026-01-26
**Purpose**: Setup and testing guide for offline functionality

---

## Prerequisites

### Required

- **HTTPS**: Service Workers only work over HTTPS (or localhost)
  - Use GitHub Pages, Netlify, Vercel, or similar
  - Or use `http://localhost` for development
- **Browser Support**:
  - Chrome/Edge 90+
  - Firefox 88+
  - Safari 14+
  - iOS Safari 14+
  - Chrome Android 90+
- **Existing Phase 2 Code**: Working music player with catalog.json

### Optional

- **DevTools**: Chrome DevTools for Service Worker debugging
- **Local Server**: For testing without HTTPS (localhost only)

---

## Setup Instructions

### Step 1: Create Service Worker File

Create `src/sw.js` with Service Worker lifecycle:

```javascript
// src/sw.js

const CACHE_VERSION = 'v1';
const CACHE_NAME = `music-player-${CACHE_VERSION}`;
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/db.js',
  '/cache-manager.js',
  '/sw.js'
];

// Install event: Precache app shell
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching app shell');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('[SW] Install complete');
        self.skipWaiting();
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activate complete');
        self.clients.claim();
      })
  );
});

// Fetch event: Serve from cache or network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // App shell: Cache first
  if (PRECACHE_URLS.includes(url.pathname) || url.pathname === '/') {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Catalog: Network first
  if (url.pathname.includes('catalog.json')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Songs: Pass through (handled by IndexedDB in app.js)
  event.respondWith(fetch(event.request));
});

// Cache-first strategy
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  cache.put(request, response.clone());
  return response;
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
}
```

---

### Step 2: Create IndexedDB Wrapper

Create `src/db.js` with database operations:

```javascript
// src/db.js

class MusicPlayerDB {
  constructor(dbName = 'music-player-db', version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('songs')) {
          const store = db.createObjectStore('songs', { keyPath: 'id' });
          store.createIndex('cachedAt', 'cachedAt', { unique: false });
          store.createIndex('fileSize', 'fileSize', { unique: false });
        }
      };
    });
  }

  async saveSong(songData, audioBlob) {
    const song = {
      ...songData,
      audioBlob,
      fileSize: audioBlob.size,
      cachedAt: Date.now(),
      cacheStatus: 'cached'
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['songs'], 'readwrite');
      const store = transaction.objectStore('songs');
      const request = store.put(song);

      request.onsuccess = () => resolve(song);
      request.onerror = () => reject(request.error);
    });
  }

  async getSong(songId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['songs'], 'readonly');
      const store = transaction.objectStore('songs');
      const request = store.get(songId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteSong(songId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['songs'], 'readwrite');
      const store = transaction.objectStore('songs');
      const request = store.delete(songId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllSongs() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['songs'], 'readonly');
      const store = transaction.objectStore('songs');
      const index = store.index('cachedAt');
      const request = index.getAll();

      request.onsuccess = () => {
        const songs = request.result || [];
        const cachedSongs = songs.filter(s => s.cacheStatus === 'cached');
        resolve(cachedSongs.sort((a, b) => b.cachedAt - a.cachedAt));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getStorageUsage() {
    const songs = await this.getAllSongs();
    return songs.reduce((total, song) => total + song.fileSize, 0);
  }

  async clearAll() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['songs'], 'readwrite');
      const store = transaction.objectStore('songs');
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
```

---

### Step 3: Create Cache Manager

Create `src/cache-manager.js` with cache utilities:

```javascript
// src/cache-manager.js

const CACHE_VERSION = 'v1';
const CACHE_NAME = `music-player-${CACHE_VERSION}`;

export async function clearCache() {
  return caches.delete(CACHE_NAME);
}

export async function getCacheSize() {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  let size = 0;

  for (const request of keys) {
    const response = await cache.match(request);
    if (response) {
      const blob = await response.blob();
      size += blob.size;
    }
  }

  return size;
}
```

---

### Step 4: Update index.html

Add Service Worker registration and PWA manifest link:

```html
<!-- Add in <head> -->
<link rel="manifest" href="/manifest.json">

<!-- Add before closing </body> -->
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.error('SW registration failed:', error);
      });
  });
}
</script>
```

---

### Step 5: Create PWA Manifest

Create `src/manifest.json`:

```json
{
  "name": "Music Player",
  "short_name": "MusicPlayer",
  "description": "A simple, offline-capable music player PWA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4a90e2",
  "orientation": "portrait",
  "scope": "/",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    }
  ]
}
```

---

### Step 6: Update app.js

Integrate cache functionality:

```javascript
// Initialize database
const db = new MusicPlayerDB();

async function initApp() {
  try {
    await db.init();
    console.log('IndexedDB initialized');

    // Load catalog
    await loadCatalog();

    // Update storage display
    updateStorageDisplay();
  } catch (error) {
    console.error('Initialization failed:', error);
    showError('Failed to initialize app');
  }
}

// Modified playSong function
async function playSong(songId) {
  const song = songs.find(s => s.id === songId);
  if (!song) return;

  // Try cached version first
  const cached = await db.getSong(songId);
  if (cached) {
    console.log('Playing from cache');
    audio.src = URL.createObjectURL(cached.audioBlob);
    audio.play();
    return;
  }

  // Fetch and cache
  try {
    const response = await fetch(song.url);
    if (!response.ok) throw new Error('Download failed');

    const blob = await response.blob();
    await db.saveSong(song, blob);

    console.log('Song cached');
    audio.src = URL.createObjectURL(blob);
    audio.play();

    updateStorageDisplay();
  } catch (error) {
    console.error('Failed to cache song:', error);
    showError('Failed to load song');
  }
}

// Storage display
async function updateStorageDisplay() {
  const usage = await db.getStorageUsage();
  const mb = (usage / 1024 / 1024).toFixed(2);
  storageDisplay.textContent = `${mb} MB`;
}

// Clear cache
async function clearCache() {
  if (confirm('Clear all cached songs?')) {
    await db.clearAll();
    updateStorageDisplay();
    console.log('Cache cleared');
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initApp);
```

---

### Step 7: Create Icons

Create icons directory and add PWA icons:

```bash
mkdir src/icons
# Add icon-192x192.png (192x192 pixels)
# Add icon-512x512.png (512x512 pixels)
```

Use a simple music note icon. You can generate icons online or use image editing tools.

---

## Testing

### 1. Test Service Worker Installation

**Steps**:
1. Open app in Chrome
2. Open DevTools (F12)
3. Go to Application tab
4. Click Service Workers in left sidebar
5. Verify "Status: Activated"
6. Verify "Running: Yes"

**Expected**: Service Worker is installed and activated

---

### 2. Test Offline App Shell

**Steps**:
1. Open app with network connection
2. Reload page (Service Worker caches app shell)
3. Open DevTools → Network tab
4. Check "Offline" checkbox
5. Reload page

**Expected**: App loads and displays without network

---

### 3. Test Song Caching

**Steps**:
1. Play a song
2. Open DevTools → Application → IndexedDB
3. Expand `music-player-db` → `songs`
4. Verify song is stored

**Expected**: Song appears in IndexedDB with audio blob

---

### 4. Test Offline Playback

**Steps**:
1. Play a song (it caches)
2. Check "Offline" checkbox in DevTools Network tab
3. Play the same song again

**Expected**: Song plays without network

---

### 5. Test Storage Display

**Steps**:
1. Play multiple songs
2. Check storage display in UI

**Expected**: Storage usage updates in real-time

---

### 6. Test Cache Clear

**Steps**:
1. Play multiple songs
2. Clear cache
3. Check IndexedDB in DevTools

**Expected**: All songs removed from IndexedDB

---

### 7. Test Service Worker Update

**Steps**:
1. Modify `src/sw.js` (e.g., change CACHE_VERSION to 'v2')
2. Save and reload page
3. Check Service Workers tab
4. Verify new SW is "Waiting"
5. Click "SkipWaiting" or reload

**Expected**: Old cache deleted, new SW activated

---

### 8. Test PWA Installation

**Steps**:
1. Open app in Chrome (desktop or mobile)
2. Look for install icon in address bar
3. Click install button

**Expected**: App installs, appears on home screen, launches standalone

---

## Troubleshooting

### Service Worker Not Installing

**Symptoms**: SW shows "Redundant" status or doesn't appear in DevTools

**Solutions**:
1. Check HTTPS (required for SW except localhost)
2. Check console for errors
3. Verify `sw.js` path is correct (should be `/sw.js`)
4. Clear all caches and reload (DevTools → Clear storage)

### Songs Not Caching

**Symptoms**: Songs play but don't appear in IndexedDB

**Solutions**:
1. Check console for IndexedDB errors
2. Verify database initialization (`db.init()` is called)
3. Check storage quota (DevTools → Application → Storage)
4. Verify blob is valid (check response from fetch)

### Offline Mode Not Working

**Symptoms**: App doesn't load when offline

**Solutions**:
1. Verify app shell is cached (DevTools → Application → Cache Storage)
2. Check Service Worker status (must be "Activated")
3. Reload page with network to ensure SW caches app shell
4. Check `PRECACHE_URLS` matches actual file paths

### Storage Quota Exceeded

**Symptoms**: `QuotaExceededError` in console

**Solutions**:
1. Clear old cache (DevTools → Clear storage)
2. Delete unused songs
3. Check browser storage limits (Safari: 50MB, others: ~6% disk)
4. Implement LRU eviction (not in quickstart, see full implementation)

### PWA Install Not Prompting

**Symptoms**: Install button doesn't appear

**Solutions**:
1. Verify manifest.json is valid (check for JSON errors)
2. Check manifest.json path in HTML
3. Verify icons exist and are correct size
4. Ensure app is served over HTTPS
5. Check browser supports PWA installation

### Cross-Browser Issues

**Firefox**:
- Service Workers work but DevTools UI is different
- IndexedDB works similarly
- PWA installation not supported on desktop

**Safari**:
- Service Worker support requires iOS 14+ or Safari 14+
- IndexedDB works but has 50MB limit
- PWA installation via "Add to Home Screen"

---

## Next Steps

After completing quickstart:

1. **Implement LRU Eviction**: Add `getLRUSongs()` method and call when quota is exceeded
2. **Add Storage Warnings**: Show warnings when storage >80%
3. **Implement Cache Management UI**: Add buttons to clear individual songs
4. **Add Offline Indicator**: Show banner when app is working offline
5. **Test on Real Devices**: Test on mobile devices for PWA installation

---

## Deployment

### GitHub Pages

1. Push code to GitHub
2. Enable GitHub Pages in repository settings
3. Select source branch (usually `main` or `gh-pages`)
4. App is available at `https://username.github.io/repo/`
5. HTTPS is enabled automatically

### Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Deploy automatically on push
4. HTTPS enabled automatically

### Local Testing

For local testing without HTTPS:

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# Then open http://localhost:8000
```

---

## Summary

| Step | File | Purpose |
|------|------|---------|
| 1 | `src/sw.js` | Service Worker lifecycle and caching |
| 2 | `src/db.js` | IndexedDB wrapper for song storage |
| 3 | `src/cache-manager.js` | Cache API utilities |
| 4 | `src/index.html` | SW registration and manifest link |
| 5 | `src/manifest.json` | PWA manifest |
| 6 | `src/app.js` | Cache integration in main app |
| 7 | `src/icons/` | PWA icons |

**Estimated Setup Time**: 30-60 minutes
**Testing Time**: 15-30 minutes

For full implementation details, see [data-model.md](data-model.md) and [contracts/js-modules.md](contracts/js-modules.md).
