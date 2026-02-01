# Phase 1: Data Model - UX Refinements

**Feature**: UX Refinements - Layout Reorganization and Content Expansion
**Date**: 2026-02-01
**Status**: Complete

## Overview

This data model documents the structure of data entities used in the music player, with updates for the 5 new ambient songs. The feature expands the existing catalog.json structure to support ambient tracks with special display requirements (infinity symbol for duration, Unicode icons).

## Entities

### 1. Audio Track

Represents a playable audio file in the music catalog. Updated to support ambient track type with special display behavior.

**Field Details**:

| Field | Type | Required | Description | Notes |
|-------|------|----------|-------------|-------|
| id | string | Yes | Unique identifier for the song | Format: "song-XXX" |
| title | string | Yes | Display name of the song | Must match user-provided titles exactly |
| artist | string | Yes | Artist or category name | "Ambient Sounds" for ambient tracks |
| url | string | Yes | Relative path to audio file | "songs/filename.mp3" |
| duration | number | Yes | Track duration in seconds | 0 for ambient tracks (display as ∞) |
| isAmbient | boolean | No | Flag indicating ambient track type | NEW field for Phase 6 |
| albumArt | string | No | Album art URL or icon | Unicode (♫) for ambient tracks |
| genre | string | No | Music genre/category | "Ambient" for ambient tracks |
| fileSize | number | No | File size in bytes | Optional, for storage management |

**Validation Rules**:
- `id` must be unique across all songs in catalog
- `url` must point to existing file in `src/songs/` directory
- `duration` must be non-negative integer; 0 indicates ambient track (display ∞)
- `isAmbient` defaults to `false` if not present (backward compatibility)
- `albumArt` can be URL string or Unicode character

**Examples**:

```json
// Standard song (existing)
{
  "id": "song-001",
  "title": "Acoustic Breeze",
  "artist": "Benjamin Tissot",
  "url": "songs/bensound-acousticbreeze.mp3",
  "duration": 157,
  "albumArt": "https://www.bensound.com/bensound-img/acousticbreeze.jpg",
  "genre": "Acoustic",
  "fileSize": 2200868
}

// Ambient song (NEW)
{
  "id": "song-004",
  "title": "Waterfall in a forest",
  "artist": "Ambient Sounds",
  "url": "songs/a1.mp3",
  "duration": 0,
  "isAmbient": true,
  "albumArt": "♫",
  "genre": "Ambient"
}
```

---

### 2. Catalog Metadata

Top-level metadata for the song catalog.json file.

**Field Details**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| version | string | Yes | Catalog version number | Format: "X.Y" |
| lastUpdated | string | Yes | ISO date of last update | Format: "YYYY-MM-DD" |
| songs | array | Yes | Array of Audio Track objects | Can be empty |

**Example**:

```json
{
  "version": "1.0",
  "lastUpdated": "2026-02-01",
  "songs": [...]
}
```

---

### 3. Storage Usage (Runtime State)

Represents current IndexedDB storage usage displayed in the cache management UI. This is runtime state, not persisted to catalog.

**Field Details**:

| Field | Type | Description |
|-------|------|-------------|
| used | number | Bytes currently used in IndexedDB |
| quota | number | Total bytes available for IndexedDB |
| percentage | number | Percentage of quota used (0-100) |

**Display Logic**:
- Format `used` and `quota` as MB with 2 decimal places
- Update dynamically as songs are cached/removed
- Show warning when `percentage > 80`

**Example**:

```javascript
{
  used: 58720256,     // ~56 MB
  quota: 52428800,    // ~50 MB (Safari limit)
  percentage: 112     // Over quota
}
```

---

### 4. Playback State (Runtime State)

Application state for current playback. This is runtime state stored in app.js global variables.

**Field Details**:

| Field | Type | Description | Notes |
|-------|------|-------------|-------|
| currentSongIndex | number | Index of currently playing song in songs array | 0-based |
| isPlaying | boolean | Whether audio is currently playing | true/false |
| audioElement | HTMLAudioElement | Reference to HTML5 audio element | Controlled via Web Audio API |
| playlist | array | Array of Audio Track objects | Loaded from catalog.json |

**Update Behavior**:
- `currentSongIndex` updates when user selects song or uses prev/next controls
- `isPlaying` toggles with play/pause button
- Repositioned controls at bottom of screen still update this state

---

### 5. Update Notification State (Runtime State)

State for controlling the visibility of the "new version available" banner.

**Field Details**:

| Field | Type | Description |
|-------|------|-------------|
| isUpdateAvailable | boolean | Whether new Service Worker version is detected |
| isBannerVisible | boolean | Whether update banner is currently shown to user |

**Display Logic**:
- Banner hidden by default (`isBannerVisible = false`)
- Set `isBannerVisible = true` only when Service Worker sends `UPDATE_AVAILABLE` message
- Set `isBannerVisible = false` after user refreshes or dismisses

---

## Relationships

```
Catalog Metadata
    └── contains ──→ [Array of Audio Track objects]

Audio Track
    ├── refers to ──→ Audio File (a1.mp3, etc.)
    └── displayed in ──→ UI Components (song list, player controls)

Runtime State (in app.js)
    ├── Playback State (currentSongIndex, isPlaying, audioElement)
    ├── Storage Usage (used, quota, percentage)
    └── Update Notification State (isUpdateAvailable, isBannerVisible)

UI Components
    ├── Song List ──→ displays Audio Track array
    ├── Player Controls (bottom, sticky) ──→ modifies Playback State
    ├── Cache Management UI (bottom) ──→ displays Storage Usage
    └── Update Banner (top, static) ──→ displays Update Notification State
```

## State Transitions

### Audio Track Lifecycle

```
Loaded from catalog.json
    ├── Standard song → Display duration normally
    └── Ambient song (isAmbient: true) → Display "∞" as duration
         ↓
User selects song
    ↓
Update currentSongIndex
    ↓
Load audio file via audioElement
    ↓
User clicks play/pause
    ↓
Toggle isPlaying state
    ↓
Song completes (standard) OR loops (ambient)
    ↓
Advance to next song (currentSongIndex + 1)
```

### Update Notification Lifecycle

```
Service Worker detects new version
    ↓
Send 'UPDATE_AVAILABLE' message to app.js
    ↓
Set isUpdateAvailable = true
    ↓
Set isBannerVisible = true (show banner at top)
    ↓
User clicks refresh button
    ↓
Reload page to activate new Service Worker
    ↓
Set isBannerVisible = false (banner hidden)
```

### Storage Management Lifecycle

```
User plays song
    ↓
Song cached to IndexedDB (on-demand)
    ↓
Update storage usage (used += fileSize)
    ↓
Update storage bar UI
    ↓
User clicks "Clear All Cached Songs"
    ↓
Delete all cached songs from IndexedDB
    ↓
Set used = 0, percentage = 0
    ↓
Update storage bar UI
```

## Data Persistence

### Persisted Data
- **catalog.json**: Song catalog (file in src/)
- **IndexedDB**: Cached audio blobs and metadata (Phase 3 implementation)

### Runtime Data (not persisted)
- **Playback State**: Lost on page refresh (intentional)
- **Storage Usage State**: Recalculated from IndexedDB on load
- **Update Notification State**: Lost on page refresh (checked on each load)

## Schema Evolution

### Version 1.0 (Phase 2)
- Initial catalog structure with 3 songs
- Standard songs only (no ambient type)

### Version 1.0 (Phase 6 - This Feature)
- **NEW**: `isAmbient` boolean field (defaults to false)
- **NEW**: Ambient songs with `duration: 0` (display as ∞)
- **NEW**: Unicode icon support (albumArt: "♫")
- **UNCHANGED**: All existing fields maintain backward compatibility

### Backward Compatibility
- Existing catalog entries without `isAmbient` field default to false
- Existing song display logic unchanged for standard songs
- No breaking changes to app.js state management

## Testing Data

**Test Catalog**: Use the following catalog for manual testing:

```json
{
  "version": "1.0",
  "lastUpdated": "2026-02-01",
  "songs": [
    {
      "id": "song-001",
      "title": "Acoustic Breeze",
      "artist": "Benjamin Tissot",
      "url": "songs/bensound-acousticbreeze.mp3",
      "duration": 157,
      "albumArt": "https://www.bensound.com/bensound-img/acousticbreeze.jpg",
      "genre": "Acoustic"
    },
    {
      "id": "song-004",
      "title": "Waterfall in a forest",
      "artist": "Ambient Sounds",
      "url": "songs/a1.mp3",
      "duration": 0,
      "isAmbient": true,
      "albumArt": "♫",
      "genre": "Ambient"
    },
    {
      "id": "song-005",
      "title": "Thunderstorm & Rain",
      "artist": "Ambient Sounds",
      "url": "songs/a2.mp3",
      "duration": 0,
      "isAmbient": true,
      "albumArt": "♫",
      "genre": "Ambient"
    },
    {
      "id": "song-006",
      "title": "Cafe Music",
      "artist": "Ambient Sounds",
      "url": "songs/a3.mp3",
      "duration": 0,
      "isAmbient": true,
      "albumArt": "♫",
      "genre": "Ambient"
    },
    {
      "id": "song-007",
      "title": "Brown Noise",
      "artist": "Ambient Sounds",
      "url": "songs/a4.mp3",
      "duration": 0,
      "isAmbient": true,
      "albumArt": "♫",
      "genre": "Ambient"
    },
    {
      "id": "song-008",
      "title": "Rainy Day",
      "artist": "Ambient Sounds",
      "url": "songs/a5.mp3",
      "duration": 0,
      "isAmbient": true,
      "albumArt": "♫",
      "genre": "Ambient"
    }
  ]
}
```

## Constraints & Validation

### Catalog.json Constraints
- Minimum: 1 song in catalog (for testing)
- Maximum: ~100 songs (performance target from constitution)
- All songs must have unique IDs
- All song URLs must resolve to existing files

### IndexedDB Constraints (from Phase 3)
- Safari: ~50 MB quota
- Chrome/Firefox: ~1-2 GB quota
- LRU eviction when quota exceeded
- Graceful error handling for QuotaExceededError

### UI Constraints
- Song list: Search/filter in <100ms
- Playback start: <1 second latency
- Scroll performance: 60fps
- Touch targets: Minimum 44x44px

## Next Steps

1. Update `src/catalog.json` with 5 new ambient songs
2. Modify `src/app.js` to handle `isAmbient` flag and display "∞" for duration
3. Reposition UI elements in `src/index.html` (controls to bottom, cache to bottom)
4. Add sticky positioning CSS to `src/styles.css`
5. Fix update banner logic in `src/sw.js` and `src/app.js`
6. Manual testing across browsers (Chrome, Firefox, Safari)
