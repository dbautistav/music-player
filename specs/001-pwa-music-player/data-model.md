# Data Model: Offline-First PWA Music Player

**Date**: 2025-01-25  
**Purpose**: Define entities, relationships, validation rules, and state transitions

## Core Entities

### 1. Song

**Purpose**: Represents an individual music track in the catalog

**Fields**:
| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Primary identifier (audio file URL) | Must be valid URL |
| title | string | Song title | Non-empty, max 255 chars |
| artist | string | Artist name | Non-empty, max 255 chars |
| duration | number | Duration in seconds | Positive number, >= 0 |
| audioUrl | string | URL to audio file | Must be valid URL, accessible |
| fileSize | number | File size in bytes | Positive number, >= 0 |
| availability | enum | 'available' \| 'unavailable' | One of enum values |
| cacheState | enum | 'uncached' \| 'downloading' \| 'cached' \| 'failed' | One of enum values |
| downloadProgress | number | Download progress (0-100) | 0-100, null if not downloading |
| downloadedSize | number | Bytes downloaded | 0 to fileSize, null if not downloading |
| cachedAt | timestamp | When song was cached | null if not cached |
| lastPlayedAt | timestamp | Last time song was played | null if never played |
| playCount | number | Number of times played | Non-negative integer |

**Relationships**:
- Belongs to Catalog (0..*)
- Can be in PlaybackQueue (0..*)
- Can be in Cache (0..1)

**Constraints**:
- id is unique within catalog
- cacheState transitions follow defined state machine (see below)
- fileSize and duration required for cache operations

---

### 2. Catalog

**Purpose**: Collection of available songs

**Fields**:
| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Catalog identifier | Non-empty |
| version | string | Catalog version | Format: "MAJOR.MINOR.PATCH" |
| lastUpdated | timestamp | When catalog was last updated | Must be valid timestamp |
| isAvailable | boolean | Whether catalog service is available | Boolean |
| songs | array | Array of Song objects | See Song entity |

**Relationships**:
- Contains 0..* Songs

**Constraints**:
- Version follows semantic versioning
- lastUpdated tracks last successful fetch

---

### 3. Cache

**Purpose**: Manages offline song storage

**Fields**:
| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| songs | array | Array of cached Song objects | See Song entity |
| totalSize | number | Total bytes used by cache | Non-negative number |
| maxCapacity | number | Maximum cache size in bytes | Positive number, device-dependent |

**Relationships**:
- Contains 0..* Songs (cached only)

**Constraints**:
- totalSize = sum(songs[].downloadedSize)
- totalSize <= maxCapacity
- Only songs with cacheState = 'cached' included

**Storage**: IndexedDB database named 'MusicPlayerCache' with object store 'songs'

---

### 4. PlaybackQueue

**Purpose**: Manages sequence of songs to play

**Fields**:
| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| songs | array | Array of Song objects in queue order | See Song entity |
| currentIndex | number | Index of currently playing song | 0 to songs.length - 1, or null if empty |
| isPlaying | boolean | Whether playback is active | Boolean |
| currentTime | number | Current playback position in seconds | 0 to currentSong.duration |
| isRepeatEnabled | boolean | Whether to repeat current song | Boolean |
| isShuffleEnabled | boolean | Whether to shuffle queue | Boolean |

**Relationships**:
- Contains 0..* Songs

**Constraints**:
- currentIndex must be within songs array bounds
- currentTime must be <= currentSong.duration
- Only one song active at a time

**State Transitions** (based on user actions):
- play → isPlaying = true
- pause → isPlaying = false, currentTime saved
- next → currentIndex = (currentIndex + 1) % songs.length
- previous → currentIndex = (currentIndex - 1 + songs.length) % songs.length
- seek → currentTime = new position
- songTap → currentIndex = tapped index, isPlaying = true

---

### 5. UserPreferences

**Purpose**: User-configurable settings

**Fields**:
| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| visualizerEnabled | boolean | Whether visualizer is enabled | Boolean |
| volume | number | Playback volume (0-1) | 0.0 to 1.0 |
| autoCacheEnabled | boolean | Whether to cache songs automatically | Boolean |
| downloadQuality | enum | Audio quality preference | 'low' \| 'medium' \| 'high' |
| lastUpdated | timestamp | When preferences were last updated | Valid timestamp |

**Constraints**:
- volume must be between 0.0 and 1.0 inclusive
- Auto-cache respects maxCapacity constraint

**Storage**: localStorage with key 'musicPlayerPreferences'

---

## State Machines

### Song Caching State Machine

```
uncached → downloading → cached
   ↓              ↓
   └─────────→ failed
   ↑              ↓
   └──────────────┘ (retry)
```

**Transitions**:
- uncached → downloading: User initiates cache or auto-cache enabled
- downloading → cached: Download completes successfully
- downloading → failed: Download fails (network error, storage full, etc.)
- failed → downloading: User retries caching
- cached → uncached: User removes from cache

**Transition Triggers**:
- User action (tap cache icon, remove from cache)
- Auto-cache (if enabled)
- Network events (disconnect, reconnect)
- Storage events (full, freed)

### Playback State Machine

```
stopped → playing ↔ paused
          ↓
       stopped
          ↓ (queue empty)
       stopped
```

**Transitions**:
- stopped → playing: User taps play on song
- playing → paused: User taps pause
- paused → playing: User taps play
- playing/paused → stopped: Song ends, user stops, or queue empty

---

## Data Flows

### Cache Song Flow

```
User Action (tap cache icon)
  ↓
Validate storage availability (totalSize + song.fileSize <= maxCapacity?)
  ↓ NO → Show insufficient storage error
  ↓ YES
Update song.cacheState = 'downloading'
  ↓
Start IndexedDB transaction
  ↓
Fetch audio file (HTTP GET with range support)
  ↓
Write chunks to IndexedDB (progressive)
  ↓
Update song.downloadProgress, song.downloadedSize (real-time)
  ↓
Download complete?
  ↓ NO → Handle error, set cacheState = 'failed', show retry UI
  ↓ YES
Update song.cacheState = 'cached', song.cachedAt = now
  ↓
Update Cache.totalSize
```

### Playback Flow

```
User Action (tap song)
  ↓
Validate song availability (song.availability == 'available' OR song.cacheState == 'cached')
  ↓ NO → Show unavailable error
  ↓ YES
Add song to PlaybackQueue
  ↓
Check if cached (song.cacheState == 'cached')
  ↓ YES → Load from IndexedDB
  ↓ NO → Stream from audioUrl
  ↓
Initialize Audio element
  ↓
Update PlaybackQueue: currentIndex, isPlaying = true
  ↓
Enable playback controls (play/pause/seek/volume)
  ↓
Update song.lastPlayedAt, song.playCount
```

### Visualizer Flow

```
Song playing (isPlaying = true)
  ↓
Create Web Audio Context
  ↓
Connect Audio element to AnalyserNode (createMediaElementSource)
  ↓
Connect AnalyserNode to Canvas renderer
  ↓
Get frequency data (getByteFrequencyData)
  ↓
Render visualization (Canvas API, requestAnimationFrame loop)
  ↓
User toggles off → Disconnect and stop rendering
```

---

## Validation Rules

### Song Entity Validation

```typescript
const validateSong = (song: Song): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Required fields
  if (!song.id) errors.push({ field: 'id', message: 'Required' });
  if (!song.title) errors.push({ field: 'title', message: 'Required' });
  if (!song.artist) errors.push({ field: 'artist', message: 'Required' });
  
  // Format validation
  if (song.audioUrl && !isValidUrl(song.audioUrl)) {
    errors.push({ field: 'audioUrl', message: 'Invalid URL' });
  }
  
  // Value constraints
  if (song.duration !== undefined && song.duration < 0) {
    errors.push({ field: 'duration', message: 'Must be >= 0' });
  }
  
  if (song.downloadProgress !== null && (song.downloadProgress < 0 || song.downloadProgress > 100)) {
    errors.push({ field: 'downloadProgress', message: 'Must be 0-100' });
  }
  
  // Cache state consistency
  if (song.cacheState === 'cached' && !song.cachedAt) {
    errors.push({ field: 'cachedAt', message: 'Required when cached' });
  }
  
  return errors;
};
```

### Cache Validation

```typescript
const validateCache = (cache: Cache): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Calculate total size
  const calculatedTotal = cache.songs.reduce((sum, song) => sum + (song.downloadedSize || 0), 0);
  
  if (Math.abs(cache.totalSize - calculatedTotal) > 1000) { // Allow 1KB tolerance
    errors.push({ field: 'totalSize', message: 'Inconsistent with songs' });
  }
  
  if (cache.totalSize > cache.maxCapacity) {
    errors.push({ field: 'totalSize', message: 'Exceeds max capacity' });
  }
  
  // Only cached songs included
  const uncachedSongs = cache.songs.filter(s => s.cacheState !== 'cached');
  if (uncachedSongs.length > 0) {
    errors.push({ field: 'songs', message: 'Contains uncached songs' });
  }
  
  return errors;
};
```

---

## Indexing Strategy (IndexedDB)

### Object Store: 'songs'

**Indexes**:
| Index Name | Key Path | Unique | Purpose |
|------------|----------|--------|---------|
| byAudioUrl | audioUrl | Yes | Primary lookup by URL |
| byTitle | title | No | Search by song title |
| byArtist | artist | No | Filter by artist |
| byCacheState | cacheState | No | Filter by cache status |
| byCachedAt | cachedAt | No | Sort by cache date |

### Query Patterns

```typescript
// Get all cached songs
const getCachedSongs = async (): Promise<Song[]> => {
  const tx = db.transaction('songs', 'readonly');
  const index = tx.store.index('byCacheState');
  return index.getAll('cached');
};

// Get song by URL
const getSongByUrl = async (url: string): Promise<Song | undefined> => {
  const tx = db.transaction('songs', 'readonly');
  const index = tx.store.index('byAudioUrl');
  return index.get(url);
};

// Search songs by title
const searchSongsByTitle = async (query: string): Promise<Song[]> => {
  const tx = db.transaction('songs', 'readonly');
  const index = tx.store.index('byTitle');
  return index.getAll(IDBKeyRange.lowerBound(query));
};
```

---

## Migration Strategy

### Version 1 to Version 2 (Future)

If schema changes, use IndexedDB versioning:

```typescript
const upgradeDB = (db: IDBDatabase, oldVersion: number, newVersion: number) => {
  if (oldVersion < 2) {
    const store = db.createObjectStore('songs', { keyPath: 'id' });
    store.createIndex('byAudioUrl', 'audioUrl', { unique: true });
    store.createIndex('byTitle', 'title');
    store.createIndex('byArtist', 'artist');
    store.createIndex('byCacheState', 'cacheState');
    store.createIndex('byCachedAt', 'cachedAt');
  }
  
  // Future migrations can add/migrate data here
};
```

---

## Summary

This data model provides:
1. **Clear entity boundaries** (Song, Catalog, Cache, PlaybackQueue, UserPreferences)
2. **Explicit state machines** for caching and playback flows
3. **Comprehensive validation** rules at entity and cache levels
4. **Efficient indexing** for common query patterns
5. **Migration strategy** for future schema changes
6. **Type safety** through TypeScript interfaces

The model supports all functional requirements while maintaining flexibility for future enhancements (additional data sources, user authentication, playlists).
