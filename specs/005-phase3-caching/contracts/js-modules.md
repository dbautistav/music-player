# JavaScript Module Contracts

**Feature**: Phase 3 - Service Worker and Caching
**Date**: 2026-01-26
**Purpose**: Define interfaces and contracts for JavaScript modules

---

## db.js - IndexedDB Wrapper Contract

### Purpose

Encapsulate IndexedDB operations for song caching with async/await interface.

### Class: MusicPlayerDB

#### Constructor

```javascript
constructor(dbName = 'music-player-db', version = 1)
```

**Parameters**:
- `dbName` (string): Database name, default 'music-player-db'
- `version` (number): Database version, default 1

**Behavior**:
- Opens IndexedDB database
- Creates object stores if they don't exist
- Creates indexes on `cachedAt` and `fileSize`

**Returns**: Promise that resolves when database is ready

**Throws**: `Error` if database cannot be opened

---

#### Method: saveSong

```javascript
async saveSong(songData, audioBlob)
```

**Purpose**: Save song metadata and audio blob to IndexedDB

**Parameters**:
- `songData` (object):
  - `id` (string, required): Unique song ID
  - `title` (string, required): Song title
  - `artist` (string, required): Artist name
  - `duration` (number, optional): Duration in seconds
  - `url` (string, required): Audio file URL
- `audioBlob` (Blob, required): Audio file binary data

**Behavior**:
- Calculates file size from blob
- Sets `cachedAt` timestamp automatically
- Sets `cacheStatus` to 'cached'
- Updates existing record if song ID exists
- Returns complete song data including generated fields

**Returns**: Promise resolving to saved song object

**Throws**:
- `QuotaExceededError` if storage is full
- `Error` if blob is invalid

**Example**:
```javascript
const song = {
  id: 'song-001',
  title: 'My Song',
  artist: 'Artist Name',
  duration: 180,
  url: 'https://example.com/song.mp3'
};
const blob = await fetch(url).then(r => r.blob());
await db.saveSong(song, blob);
```

---

#### Method: getSong

```javascript
async getSong(songId)
```

**Purpose**: Retrieve cached song by ID

**Parameters**:
- `songId` (string): Song ID to retrieve

**Behavior**:
- Queries IndexedDB for song with matching ID
- Returns null if song not found
- Does not check cache status (returns even if corrupted)

**Returns**: Promise resolving to song object or null

**Throws**: `Error` if database query fails

**Example**:
```javascript
const song = await db.getSong('song-001');
if (song) {
  console.log('Song found:', song.title);
}
```

---

#### Method: deleteSong

```javascript
async deleteSong(songId)
```

**Purpose**: Delete cached song from IndexedDB

**Parameters**:
- `songId` (string): Song ID to delete

**Behavior**:
- Removes song from IndexedDB
- Does not throw if song doesn't exist

**Returns**: Promise resolving when deletion is complete

**Throws**: `Error` if deletion fails

**Example**:
```javascript
await db.deleteSong('song-001');
```

---

#### Method: getAllSongs

```javascript
async getAllSongs()
```

**Purpose**: Retrieve all cached songs

**Parameters**: None

**Behavior**:
- Returns array of all songs in database
- Sorted by `cachedAt` descending (most recent first)
- Includes only songs with 'cached' status

**Returns**: Promise resolving to array of song objects

**Throws**: `Error` if query fails

**Example**:
```javascript
const songs = await db.getAllSongs();
console.log(`Found ${songs.length} cached songs`);
```

---

#### Method: getStorageUsage

```javascript
async getStorageUsage()
```

**Purpose**: Calculate total storage usage for cached songs

**Parameters**: None

**Behavior**:
- Sums `fileSize` of all cached songs
- Returns size in bytes

**Returns**: Promise resolving to number (bytes)

**Throws**: `Error` if query fails

**Example**:
```javascript
const usage = await db.getStorageUsage();
const mb = (usage / 1024 / 1024).toFixed(2);
console.log(`Storage used: ${mb} MB`);
```

---

#### Method: getLRUSongs

```javascript
async getLRUSongs(count = 5)
```

**Purpose**: Get least recently used songs for eviction

**Parameters**:
- `count` (number): Number of songs to return, default 5

**Behavior**:
- Queries songs sorted by `cachedAt` ascending
- Returns only 'cached' status songs
- Limited to `count` results

**Returns**: Promise resolving to array of song objects

**Throws**: `Error` if query fails

**Example**:
```javascript
const lruSongs = await db.getLRUSongs(3);
for (const song of lruSongs) {
  await db.deleteSong(song.id);
}
```

---

#### Method: clearAll

```javascript
async clearAll()
```

**Purpose**: Delete all cached songs from database

**Parameters**: None

**Behavior**:
- Removes all records from `songs` object store
- Does not affect database structure

**Returns**: Promise resolving when clear is complete

**Throws**: `Error` if clear fails

**Example**:
```javascript
await db.clearAll();
console.log('All songs cleared');
```

---

## cache-manager.js - Cache API Contract

### Purpose

Manage Cache API operations for app shell and catalog caching.

### Constants

```javascript
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
```

---

#### Function: cacheFirst

```javascript
async function cacheFirst(request)
```

**Purpose**: Cache-first strategy for app shell resources

**Parameters**:
- `request` (Request|string): Request object or URL string

**Behavior**:
1. Check cache for matching response
2. If found: Return cached response
3. If not found: Fetch from network, cache it, return

**Returns**: Promise resolving to Response object

**Throws**: `Error` if both cache and network fail

**Example**:
```javascript
event.respondWith(cacheFirst(event.request));
```

---

#### Function: networkFirst

```javascript
async function networkFirst(request)
```

**Purpose**: Network-first strategy for catalog and dynamic content

**Parameters**:
- `request` (Request|string): Request object or URL string

**Behavior**:
1. Try fetching from network
2. If network succeeds: Cache response, return
3. If network fails: Fall back to cache
4. If cache fails: Throw error

**Returns**: Promise resolving to Response object

**Throws**: `Error` if both network and cache fail

**Example**:
```javascript
event.respondWith(networkFirst('/catalog.json'));
```

---

#### Function: precacheAssets

```javascript
async function precacheAssets()
```

**Purpose**: Precache app shell assets on Service Worker install

**Parameters**: None

**Behavior**:
- Opens cache
- Adds all URLs from `PRECACHE_URLS`
- Returns when all assets are cached

**Returns**: Promise resolving when caching is complete

**Throws**: `Error` if any asset fails to cache

**Example**:
```javascript
self.addEventListener('install', (event) => {
  event.waitUntil(precacheAssets());
});
```

---

#### Function: cleanupOldCaches

```javascript
async function cleanupOldCaches()
```

**Purpose**: Delete old caches when Service Worker updates

**Parameters**: None

**Behavior**:
- Lists all caches
- Identifies caches that don't match `CACHE_NAME`
- Deletes old caches
- Returns when cleanup is complete

**Returns**: Promise resolving when cleanup is complete

**Throws**: `Error` if cleanup fails

**Example**:
```javascript
self.addEventListener('activate', (event) => {
  event.waitUntil(cleanupOldCaches());
});
```

---

## sw.js - Service Worker Contract

### Purpose

Implement Service Worker lifecycle and fetch interception for offline functionality.

### Event Listeners

#### install

```javascript
self.addEventListener('install', (event) => {
  // Precache app shell assets
  // Skip waiting for immediate activation
});
```

**Behavior**:
- Calls `precacheAssets()` to cache app shell
- Calls `self.skipWaiting()` for immediate activation
- Wait until promise resolves before completing

---

#### activate

```javascript
self.addEventListener('activate', (event) => {
  // Clean up old caches
  // Claim control of all clients
});
```

**Behavior**:
- Calls `cleanupOldCaches()` to remove old versions
- Calls `self.clients.claim()` to control all pages
- Wait until promise resolves before completing

---

#### fetch

```javascript
self.addEventListener('fetch', (event) => {
  // Intercept requests and apply caching strategy
});
```

**Behavior**:
- For app shell assets: Use `cacheFirst()`
- For catalog: Use `networkFirst()`
- For songs: Pass through (handled by IndexedDB in app.js)
- For other requests: Pass through to network

---

## app.js Integration Contract

### Purpose

Define integration points for cache functionality in main app.

### Integration Points

#### Initialize Database

```javascript
const db = new MusicPlayerDB('music-player-db', 1);
await db.init();
```

**Location**: Top of app.js after DOMContentLoaded

**Behavior**: Initialize IndexedDB for song caching

---

#### Register Service Worker

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

**Location**: After database initialization

**Behavior**: Register Service Worker for offline support

---

#### Handle SW Update Messages

```javascript
navigator.serviceWorker.addEventListener('message', (event) => {
  if (event.data === 'waiting') {
    showUpdateBanner();
  }
});
```

**Location**: After SW registration

**Behavior**: Listen for SW update notifications, show UI

---

#### Song Play Function

```javascript
async function playSong(songId) {
  // Check IndexedDB first
  const cached = await db.getSong(songId);
  if (cached) {
    audio.src = URL.createObjectURL(cached.audioBlob);
    audio.play();
  } else {
    // Fetch from network
    const response = await fetch(song.url);
    const blob = await response.blob();
    // Cache for next time
    await db.saveSong(song, blob);
    audio.src = URL.createObjectURL(blob);
    audio.play();
  }
}
```

**Location**: In playSong function

**Behavior**: Play from cache if available, otherwise fetch and cache

---

#### Storage Display Function

```javascript
async function updateStorageDisplay() {
  const usage = await db.getStorageUsage();
  const quota = (await navigator.storage.estimate()).quota;
  const percentage = (usage / quota * 100).toFixed(1);

  // Update UI
  storageElement.textContent = `${(usage / 1024 / 1024).toFixed(2)} MB / ${percentage}%`;

  // Show warning if >80%
  if (percentage > 80) {
    showStorageWarning();
  }
}
```

**Location**: In cache management UI function

**Behavior**: Display storage usage and warnings

---

#### Clear Cache Function

```javascript
async function clearCache(songId = null) {
  if (songId) {
    await db.deleteSong(songId);
  } else {
    await db.clearAll();
  }
  updateStorageDisplay();
}
```

**Location**: In cache management UI function

**Behavior**: Clear specific song or all songs, update UI

---

## Implementation Notes

### Error Handling

All async functions must be wrapped in try-catch blocks:

```javascript
try {
  await db.saveSong(song, blob);
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    showStorageError();
  } else {
    console.error('Error caching song:', error);
  }
}
```

### Browser Compatibility

- Service Workers: Chrome/Edge 40+, Firefox 44+, Safari 11.1+
- IndexedDB: Chrome/Edge 12+, Firefox 4+, Safari 10+
- Cache API: Chrome/Edge 43+, Firefox 39+, Safari 11.1+

### Testing

- Test all CRUD operations in db.js
- Test cache strategies in sw.js (use Chrome DevTools Offline mode)
- Test Service Worker lifecycle (install, activate, update)
- Test storage quota handling

---

## Summary

| Module | Purpose | Key Functions |
|--------|----------|---------------|
| db.js | IndexedDB wrapper | saveSong, getSong, deleteSong, getAllSongs, getStorageUsage, getLRUSongs, clearAll |
| cache-manager.js | Cache API helper | cacheFirst, networkFirst, precacheAssets, cleanupOldCaches |
| sw.js | Service Worker lifecycle | install, activate, fetch event handlers |
| app.js | Integration | Initialize DB, register SW, handle updates, play with caching, storage management |

All contracts must be implemented with async/await, proper error handling, and browser compatibility checks.
