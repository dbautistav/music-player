# Data Model: Service Worker and Caching

**Feature**: Phase 3 - Service Worker and Caching
**Date**: 2026-01-26
**Phase**: 1 - Design & Contracts
**Status**: Complete

## Overview

This document defines the data entities, storage schemas, and data flow for Service Worker, IndexedDB, and Cache API integration. The data model supports offline playback, cache management, and PWA installation.

---

## Entity Catalog

### 1. Cached Song

**Purpose**: Represents a song stored locally in IndexedDB for offline playback.

**Storage**: IndexedDB, object store `songs`

**Primary Key**: `id` (song ID from catalog.json)

**Fields**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|-------------|
| `id` | string | Yes | Unique song identifier from catalog.json | Non-empty, matches catalog ID |
| `title` | string | Yes | Song title | Non-empty |
| `artist` | string | Yes | Artist name | Non-empty |
| `duration` | number | No | Duration in seconds | Positive integer |
| `url` | string | Yes | Audio file URL | Valid URL string |
| `audioBlob` | Blob | Yes | Audio file binary data | Non-null, valid Blob |
| `fileSize` | number | Yes | Size in bytes | Positive integer |
| `cachedAt` | timestamp | Yes | When song was cached | Valid timestamp (milliseconds) |
| `cacheStatus` | string | Yes | Status of cache | Enum: 'cached', 'corrupted', 'pending' |

**Indexes**:
- `cachedAt` (for LRU eviction)
- `fileSize` (for storage calculation)

**State Transitions**:
```
pending → cached
cached → corrupted (error detected)
corrupted → pending (re-download attempt)
corrupted → removed (user action)
cached → removed (user action or LRU eviction)
```

**Constraints**:
- Only one record per song ID (unique primary key)
- `audioBlob` cannot be null for 'cached' status
- `fileSize` must match `audioBlob.size`
- `cachedAt` is set automatically on save

---

### 2. Cache Version Metadata

**Purpose**: Tracks cache version for Service Worker management and cleanup.

**Storage**: Cache API (implicitly managed by SW)

**Fields**:
- `CACHE_VERSION` (constant): Version string (e.g., 'v1', 'v2')
- `CACHE_NAME` (computed): `music-player-${CACHE_VERSION}`
- `PRECACHE_URLS` (array): List of URLs to cache on install

**App Shell Files**:
```javascript
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

**Cache Lifecycle**:
- Created on SW `install` event
- Activated on SW `activate` event
- Cleaned up when new version detected (old caches deleted)

**Constraints**:
- Cache names must follow versioned pattern
- Old caches must be cleaned up on activation
- New cache must be fully populated before activation

---

### 3. Storage Quota Information

**Purpose**: Tracks storage usage and quota limits for UI display and LRU eviction.

**Storage**: Computed from `navigator.storage.estimate()` and IndexedDB queries

**Fields**:

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| `usage` | number | `navigator.storage.estimate().usage` | Total storage used in bytes |
| `quota` | number | `navigator.storage.estimate().quota` | Total storage quota in bytes |
| `cachedSongsSize` | number | Sum of `fileSize` from all cached songs | Size of cached songs in bytes |
| `appShellSize` | number | Cache API query | Size of app shell cache in bytes |
| `percentageUsed` | number | Computed | Usage percentage (0-100) |

**Computed Fields**:
```javascript
percentageUsed = (usage / quota) * 100
```

**Thresholds**:
- Warning threshold: >80%
- Critical threshold: >95%
- Full threshold: 100% (quota exceeded)

**Constraints**:
- Must be recalculated after any cache operation
- Must account for both IndexedDB and Cache API storage
- Must handle cases where `quota` is undefined (some browsers)

---

### 4. PWA Manifest Metadata

**Purpose**: Defines PWA installation metadata for browser manifest.

**Storage**: manifest.json file

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Full app name |
| `short_name` | string | Yes | Short app name (max 12 chars) |
| `description` | string | Yes | App description |
| `start_url` | string | Yes | Launch URL (usually '/') |
| `display` | string | Yes | Display mode ('standalone') |
| `background_color` | string | Yes | Background color (hex) |
| `theme_color` | string | Yes | Theme color (hex) |
| `orientation` | string | Yes | Screen orientation ('portrait') |
| `scope` | string | Yes | Navigation scope ('/') |
| `icons` | array | Yes | Array of icon objects |

**Icon Object Schema**:
```javascript
{
  "src": "/icons/icon-192x192.png",
  "sizes": "192x192",
  "type": "image/png",
  "purpose": "any maskable"
}
```

**Constraints**:
- At least one icon required
- Icons must be PNG or SVG
- `short_name` must fit on home screen
- `theme_color` should match app's accent color

---

## Storage Architecture

### IndexedDB Structure

**Database Name**: `music-player-db`

**Object Stores**:

1. **songs**
   - Key path: `id`
   - Auto-increment: No
   - Indexes: `cachedAt`, `fileSize`

**Version**: 1

**Operations**:
```javascript
// CRUD operations
saveSong(songData, audioBlob)
getSong(songId)
deleteSong(songId)
getAllSongs()
clearAllSongs()

// Utility operations
getStorageUsage()
getLRUSongs(count)
```

### Cache API Structure

**Cache Names** (versioned):
- `music-player-v1` (current)
- `music-player-v2` (next version)
- etc.

**Cached Resources**:
- App shell files (HTML, CSS, JS)
- Static assets (icons, images)

**Cache Strategies**:
- App shell: cache-first
- Catalog: network-first with cache fallback
- Songs: Not cached (stored in IndexedDB)

---

## Data Flow

### Song Caching Flow

```
1. User plays song
   ↓
2. app.js checks IndexedDB for cached song
   ↓
3. If found: Play from IndexedDB
   If not found:
   ↓
4. Fetch audio from network
   ↓
5. Store audio Blob + metadata in IndexedDB
   ↓
6. Update UI to show "cached" status
   ↓
7. Play audio
```

### Offline Playback Flow

```
1. User plays song
   ↓
2. Check IndexedDB for cached song
   ↓
3. If found: Play from IndexedDB
   If not found:
   ↓
4. Show error: "Song not cached. Must play online first."
```

### Storage Management Flow

```
1. Before caching new song:
   ↓
2. Calculate current storage usage
   ↓
3. Check quota availability
   ↓
4. If >80% quota: Show warning
   ↓
5. If quota exceeded:
   ↓
6. Remove LRU songs until space available
   ↓
7. Cache new song
```

### Service Worker Update Flow

```
1. New SW code detected
   ↓
2. New SW installs, enters "waiting" state
   ↓
3. SW sends "waiting" message to client
   ↓
4. App shows "Update available" banner
   ↓
5. User clicks "Refresh"
   ↓
6. SW calls skipWaiting()
   ↓
7. SW activates, new cache ready
   ↓
8. Page reloads to use new SW
```

---

## Validation Rules

### IndexedDB Validation

1. **Song ID Validation**:
   - Must match catalog.json song ID
   - Cannot be empty or null

2. **Blob Validation**:
   - Must be valid Blob object
   - Must have size > 0

3. **Timestamp Validation**:
   - `cachedAt` must be valid timestamp (>= 0)
   - Must be set automatically on save

4. **Cache Status Validation**:
   - Must be one of: 'cached', 'corrupted', 'pending'
   - Transitions must follow state machine

### Cache API Validation

1. **URL Validation**:
   - Must be valid URL string
   - Must be relative to app origin

2. **Version Validation**:
   - Must follow pattern `v1`, `v2`, etc.
   - Must be incremented on updates

3. **Cache Cleanup Validation**:
   - All old caches must be deleted on activation
   - Current cache must exist before activation

### PWA Manifest Validation

1. **Icon Validation**:
   - Icons must be PNG or SVG
   - Sizes must be correct (192x192, 512x512)
   - Must exist at specified paths

2. **Color Validation**:
   - Must be valid hex color code
   - Must be readable (contrast ratio >= 4.5:1)

3. **Name Validation**:
   - `short_name` must be <=12 characters
   - `name` must be descriptive

---

## Error Handling

### IndexedDB Errors

| Error | Cause | Handling |
|-------|--------|----------|
| `QuotaExceededError` | Storage full | Trigger LRU eviction, retry |
| `ConstraintError` | Duplicate song ID | Overwrite existing |
| `TransactionInactiveError` | Transaction aborted | Retry operation |
| `InvalidStateError` | Database closed | Reopen database |

### Cache API Errors

| Error | Cause | Handling |
|-------|--------|----------|
| `SecurityError` | Invalid origin | Show error, disable caching |
| `TypeError` | Invalid URL | Show error, skip resource |
| `NetworkError` | Network failure | Fall back to cache |

### Storage Quota Errors

| Error | Cause | Handling |
|-------|--------|----------|
| Quota exceeded | No space available | LRU eviction, warn user |
| Quota undefined | Browser doesn't support | Use fallback (count songs) |

---

## Migration Strategy

### IndexedDB Version 1

**Initial schema**:
- Object store: `songs`
- Key path: `id`
- Indexes: `cachedAt`, `fileSize`

**Future migrations**:
- Add new object stores
- Add new indexes
- Convert existing data if needed

**Migration process**:
1. Open database with new version number
2. Create new object stores or indexes
3. Copy/convert existing data if needed
4. Delete old object stores if deprecated
5. Activate new version

### Cache Version Migration

**Process**:
1. Increment `CACHE_VERSION` constant
2. New cache name: `music-player-v2`
3. On SW `activate`: Delete old caches
4. Precache app shell to new cache

---

## Performance Considerations

### IndexedDB Optimization

- Use transactions for batch operations
- Create indexes for frequently queried fields
- Use `getAll()` with key ranges for pagination
- Implement cursor-based queries for large datasets

### Cache API Optimization

- Cache app shell on install (blocking)
- Use stale-while-revalidate for critical assets
- Limit cache size (remove old entries)

### Storage Calculation Optimization

- Cache `cachedSongsSize` calculation (don't sum every query)
- Update on every cache operation
- Use `navigator.storage.estimate()` sparingly

---

## Security & Privacy

### IndexedDB Security

- Same-origin policy applies
- No cross-origin data access
- Clear on user request

### Cache API Security

- Same-origin policy applies
- HTTPS required for Service Workers
- Sensitive data not cached

### PWA Manifest Security

- Icons must be same-origin
- No external tracking scripts
- Secure manifest URL (HTTPS)

---

## Testing Strategy

### IndexedDB Testing

- Test CRUD operations
- Test error handling (quota exceeded, duplicate IDs)
- Test LRU eviction
- Test storage calculation

### Cache API Testing

- Test cache strategies (cache-first, network-first)
- Test cache cleanup on version update
- Test offline functionality
- Test update flow

### PWA Manifest Testing

- Test installability on different browsers
- Test icon display
- Test standalone mode
- Test theme color application

---

## Summary

| Entity | Storage | Key Fields | Operations |
|--------|----------|------------|------------|
| Cached Song | IndexedDB | id, audioBlob, cachedAt, fileSize | save, get, delete, getAll |
| Cache Version | Cache API | CACHE_VERSION, CACHE_NAME, PRECACHE_URLS | precache, cleanup |
| Storage Quota | Computed | usage, quota, cachedSongsSize | calculate, check thresholds |
| PWA Manifest | manifest.json | name, icons, display | install, update |

**Total Object Stores**: 1 (`songs`)
**Total Cache Names**: Versioned (one per app version)
**Total Database Version**: 1 (initial)
