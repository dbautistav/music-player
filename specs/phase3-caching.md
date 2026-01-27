# Phase 3: Service Worker & Offline Caching

**Branch**: `003-phase3-caching`
**Duration**: 2-3 days
**Prerequisites**: Phase 1 (playback) and Phase 2 (dynamic catalog) must be complete
**Goal**: Make the app work offline by caching songs and app assets

---

## User Stories

### Story 1: Download Songs for Offline Use
**As a** user  
**I want to** download specific songs to my device  
**So that** I can listen to them without an internet connection

**Acceptance Criteria**:
- Each song in the catalog has a "Download" button/icon
- Clicking "Download" caches the song locally
- Download shows progress (0-100%)
- Once complete, button changes to "Downloaded" with checkmark
- Downloaded songs remain available after closing the app

---

### Story 2: Play Cached Songs Offline
**As a** user  
**I want to** play downloaded songs when I'm offline  
**So that** I'm not dependent on internet connectivity

**Acceptance Criteria**:
- Downloaded songs play without internet connection
- Playback starts within 1 second (no buffering)
- All playback controls (play/pause/skip) work offline
- User can see which songs are available offline

---

### Story 3: Manage Cached Songs
**As a** user  
**I want to** see how much storage my downloaded songs use  
**So that** I can manage my device storage effectively

**Acceptance Criteria**:
- Settings/cache page shows list of downloaded songs
- Each song displays its file size
- Total storage used is displayed
- User can delete individual songs from cache
- Deleting a song frees up storage immediately

---

### Story 4: App Works Offline
**As a** user  
**I want to** use the app when I have no internet  
**So that** I can access my music anytime, anywhere

**Acceptance Criteria**:
- App loads instantly when offline (if previously visited)
- Catalog displays previously loaded data
- Banner indicates "Offline Mode"
- Only cached songs are playable (uncached songs are disabled)
- No broken images or missing resources

---

## Technical Requirements

### Tech Stack
- **Service Worker API**: For offline functionality
- **Cache API**: For storing app assets
- **IndexedDB**: For storing song metadata and audio blobs
- **Background Sync API** (optional): For retry logic

### Browser Support
- Chrome/Edge 90+ ✅ Full support
- Firefox 88+ ✅ Full support
- Safari 14+ ⚠️ Partial (no Background Sync)
- iOS Safari 14+ ⚠️ Limited storage quotas

### Updated File Structure
```
src/
├── index.html
├── styles.css
├── app.js
├── sw.js                    # NEW: Service Worker
├── db.js                    # NEW: IndexedDB wrapper
├── cache-manager.js         # NEW: Cache logic
├── manifest.json            # NEW: PWA manifest
└── icons/                   # NEW: App icons
    ├── icon-192.png
    └── icon-512.png
```

### Service Worker Strategy

**App Shell Caching** (Cache First):
- `index.html`
- `styles.css`
- `app.js`
- `db.js`
- `cache-manager.js`
- Icons

**Catalog Data** (Network First, fallback to Cache):
- `catalog.json`
- Updates when online, serves cached when offline

**Song Files** (Cache on Demand):
- Only cache when user explicitly downloads
- Store in IndexedDB as blobs (Cache API has size limits)

### Data Model

**IndexedDB Schema**:
```javascript
// Database: 'MusicPlayerDB', version 1
// Object Store: 'songs'
{
  id: "unique-song-id",           // Primary key
  title: "Song Title",
  artist: "Artist Name",
  url: "https://example.com/song.mp3",
  audioBlob: Blob,                 // The actual audio file
  fileSize: 5242880,               // Size in bytes
  cachedAt: 1706198400000,         // Timestamp
  cacheStatus: "cached"            // "uncached" | "downloading" | "cached" | "failed"
}

// Object Store: 'metadata'
{
  key: "totalCacheSize",
  value: 15728640                  // Total bytes cached
}
```

**Cache Status States**:
1. **uncached**: Not downloaded yet
2. **downloading**: Download in progress (0-100%)
3. **cached**: Successfully cached and available offline
4. **failed**: Download failed (show retry option)

### Code Constraints

**Service Worker** (`sw.js`):
- Use `workbox` library for simplicity (or vanilla if you prefer control)
- Implement proper versioning (cache names include version number)
- Handle update notifications (tell user when new version available)
- Use `skipWaiting()` and `clients.claim()` carefully

**IndexedDB** (`db.js`):
- Wrap in Promises (native API is callback-based)
- Handle version upgrades gracefully
- Implement proper error handling
- Close connections when done

**Cache Manager** (`cache-manager.js`):
- Provide clean API: `downloadSong(songId)`, `deleteSong(songId)`, `getCacheSize()`
- Emit progress events during download
- Handle concurrent downloads (queue if needed)
- Validate cached files (check integrity)

### UI Requirements

**Cache Indicators**:
- Download button states:
  - Uncached: "Download" icon (cloud with down arrow)
  - Downloading: Progress ring (0-100%)
  - Cached: "Downloaded" checkmark
  - Failed: "Retry" icon with error color

**Offline Banner**:
- Top of screen: "You're offline. Only downloaded songs available."
- Dismissible or auto-hide when online
- Don't show if user has never been online

**Cache Management Screen**:
- List of downloaded songs
- File size next to each
- Total: "5 songs, 23.4 MB"
- "Delete All" button (with confirmation)

### Performance

- Service Worker registration doesn't block page load
- App shell caches in <2 seconds on first visit
- Downloading a 5MB song completes in <30 seconds on 4G
- IndexedDB operations complete in <500ms
- Switching online/offline doesn't cause UI jank

---

## Out of Scope (Phase 3)

❌ Background download (downloads continue when app is closed)  
❌ Smart caching (pre-cache popular songs)  
❌ Sync across devices  
❌ Compression (store as-is)  
❌ Partial downloads (all or nothing)  

---

## Success Criteria

### Functional
- [ ] User can download a song and play it offline
- [ ] Downloaded songs survive browser restart
- [ ] App loads offline (after first online visit)
- [ ] Cache management shows accurate storage usage
- [ ] Deleting a song frees storage and updates UI

### Technical
- [ ] Service Worker installs and activates correctly
- [ ] IndexedDB stores and retrieves audio blobs without corruption
- [ ] Cache versioning works (old caches cleared on update)
- [ ] No quota errors on typical usage (10-20 songs cached)
- [ ] Works in Chrome, Firefox, Safari (with known limitations)

### User Experience
- [ ] Download progress is visible and accurate
- [ ] Offline state is clearly communicated
- [ ] No "broken" experience when offline
- [ ] User can complete "download → go offline → play" in <30 seconds

---

## Implementation Notes for AI

### Service Worker Registration

In `index.html` or `app.js`:
```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', registration.scope);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            showUpdateNotification();
          }
        });
      });
    } catch (error) {
      console.error('SW registration failed:', error);
    }
  });
}
```

### Service Worker Template

```javascript
// sw.js
const CACHE_VERSION = 'v1';
const CACHE_NAME = `music-player-${CACHE_VERSION}`;

const APP_SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/db.js',
  '/cache-manager.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install: Cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('music-player-') && name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Cache-first for app shell, network-first for data
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // App shell: Cache first
  if (APP_SHELL.includes(new URL(request.url).pathname)) {
    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request))
    );
    return;
  }
  
  // Catalog: Network first, fallback to cache
  if (request.url.includes('catalog.json')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }
  
  // Everything else: Network only
  event.respondWith(fetch(request));
});
```

### IndexedDB Wrapper

```javascript
// db.js
class MusicDB {
  constructor() {
    this.dbName = 'MusicPlayerDB';
    this.version = 1;
    this.db = null;
  }

  async open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create songs store
        if (!db.objectStoreNames.contains('songs')) {
          const songStore = db.createObjectStore('songs', { keyPath: 'id' });
          songStore.createIndex('cacheStatus', 'cacheStatus', { unique: false });
        }
        
        // Create metadata store
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };
    });
  }

  async saveSong(songData) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['songs'], 'readwrite');
      const store = transaction.objectStore('songs');
      const request = store.put(songData);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getSong(id) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['songs'], 'readonly');
      const store = transaction.objectStore('songs');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllCachedSongs() {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['songs'], 'readonly');
      const store = transaction.objectStore('songs');
      const index = store.index('cacheStatus');
      const request = index.getAll('cached');

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteSong(id) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['songs'], 'readwrite');
      const store = transaction.objectStore('songs');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export default new MusicDB();
```

### Cache Manager API

```javascript
// cache-manager.js
import db from './db.js';

class CacheManager {
  async downloadSong(song, onProgress) {
    try {
      // Update status to downloading
      await db.saveSong({
        ...song,
        cacheStatus: 'downloading',
        progress: 0
      });

      // Fetch the audio file
      const response = await fetch(song.url);
      const contentLength = response.headers.get('content-length');
      const total = parseInt(contentLength, 10);
      let loaded = 0;

      const reader = response.body.getReader();
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        loaded += value.length;

        // Report progress
        const progress = Math.round((loaded / total) * 100);
        if (onProgress) onProgress(progress);

        // Update DB with progress
        await db.saveSong({
          ...song,
          cacheStatus: 'downloading',
          progress
        });
      }

      // Create blob from chunks
      const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });

      // Save to IndexedDB
      await db.saveSong({
        ...song,
        audioBlob,
        fileSize: audioBlob.size,
        cachedAt: Date.now(),
        cacheStatus: 'cached',
        progress: 100
      });

      return { success: true };
    } catch (error) {
      console.error('Download failed:', error);
      
      // Mark as failed
      await db.saveSong({
        ...song,
        cacheStatus: 'failed',
        error: error.message
      });

      return { success: false, error };
    }
  }

  async getCachedSong(songId) {
    const song = await db.getSong(songId);
    if (song && song.cacheStatus === 'cached') {
      return URL.createObjectURL(song.audioBlob);
    }
    return null;
  }

  async deleteCachedSong(songId) {
    await db.deleteSong(songId);
  }

  async getTotalCacheSize() {
    const songs = await db.getAllCachedSongs();
    return songs.reduce((total, song) => total + (song.fileSize || 0), 0);
  }

  async getAllCachedSongs() {
    return db.getAllCachedSongs();
  }
}

export default new CacheManager();
```

### PWA Manifest

```json
// manifest.json
{
  "name": "Music Player",
  "short_name": "Music",
  "description": "Offline-first music player",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1e293b",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

Add to `index.html`:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#1e293b">
```

---

## Edge Cases to Handle

1. **Quota Exceeded**:
   - Catch `QuotaExceededError`
   - Show user storage management screen
   - Suggest deleting songs

2. **Corrupted Download**:
   - Verify blob size matches `content-length`
   - If mismatch, mark as failed and allow retry

3. **Service Worker Update During Download**:
   - Don't interrupt active downloads
   - Queue downloads if SW is updating

4. **User Clears Browser Data**:
   - Detect missing cache on app load
   - Reset UI state (all songs uncached)
   - Gracefully handle missing IndexedDB

5. **Network Interruption Mid-Download**:
   - Catch fetch error
   - Mark as failed
   - Clean up partial data
   - Allow retry

6. **Multiple Tabs Open**:
   - Use BroadcastChannel API to sync state
   - Or rely on IndexedDB as single source of truth

---

## Testing Checklist

Before considering Phase 3 complete:

**Service Worker**:
- [ ] SW installs on first visit
- [ ] App shell loads from cache when offline
- [ ] SW updates when new version deployed

**Caching**:
- [ ] Can download a song successfully
- [ ] Downloaded song plays offline
- [ ] Progress indicator shows during download
- [ ] Can download multiple songs concurrently
- [ ] Failed downloads can be retried

**Storage**:
- [ ] Total cache size calculated correctly
- [ ] Deleting a song reduces total size
- [ ] Storage survives browser restart
- [ ] Quota errors handled gracefully

**Offline Mode**:
- [ ] App loads when offline (after first visit)
- [ ] Catalog shows cached data when offline
- [ ] Offline banner appears
- [ ] Uncached songs are disabled/grayed out

**Cross-Browser**:
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari (with limitations noted)
- [ ] Works on iOS Safari

---

## Known Limitations

**Safari/iOS**:
- Storage quotas are more restrictive (~50MB)
- Background Sync not supported
- Users may need to "Add to Home Screen" for best experience

**Storage Limits**:
- Chrome/Edge: ~6% of available disk space
- Firefox: ~10% with user prompt for more
- Safari: 50MB without prompt

**Workarounds**:
- Warn users about storage limits upfront
- Provide "Download All" with storage check
- Allow selective deletion to free space

---

## Next Phase Preview

**Phase 4** will add:
- Music visualizer (Canvas API + Web Audio API)
- Improved UI/UX polish
- Album art support
- Search/filter functionality
- GitHub Actions deployment

But first, make this baby work offline! 📲
