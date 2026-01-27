# Data Model: Dynamic Catalog & Search

**Feature**: `002-dynamic-catalog`
**Date**: 2026-01-26
**Status**: Final

## Overview

This document defines the data entities and structures used in the Phase 2 dynamic catalog feature. The primary data source is a JSON file (`catalog.json`) that contains an array of song objects. The application loads this catalog into memory and provides search/filtering functionality.

## Core Entities

### Song Catalog

**Description**: Top-level container for the song collection loaded from catalog.json

**Structure**:
```json
{
  "version": "string (required)",
  "lastUpdated": "string (optional, ISO 8601 date)",
  "songs": [Song] (required, non-empty array)
}
```

**Validation Rules**:
- `version` must be present and a string (format: "1.0", "2.0", etc.)
- `songs` must be an array with at least one song
- Array order determines display order in UI

**Usage**: Loaded once at startup and cached in memory

---

### Song

**Description**: Represents a single audio track with associated metadata

**Structure**:
```json
{
  "id": "string (required, unique)",
  "title": "string (required, non-empty)",
  "artist": "string (required, non-empty)",
  "url": "string (required, valid URL)",
  "duration": "number (optional, integer seconds)",
  "albumArt": "string (optional, valid URL)",
  "fileSize": "number (optional, bytes)",
  "album": "string (optional)",
  "year": "number (optional)",
  "genre": "string (optional)"
}
```

**Validation Rules**:
- **Required fields**: `id`, `title`, `artist`, `url` (all others optional)
- `id` must be unique across all songs in the catalog
- `title` and `artist` must be non-empty strings
- `url` must be a valid HTTP/HTTPS URL to audio file
- `duration` must be a positive integer (seconds)
- `albumArt` must be a valid HTTP/HTTPS URL to image file
- `fileSize` must be a positive integer (bytes)
- `year` must be a valid 4-digit year (e.g., 2024)
- Optional fields that are missing should be handled gracefully

**Usage**: Displayed in song list, used for filtering, selected for playback

---

### Search Query

**Description**: Represents the user's current search input

**Structure**:
```javascript
{
  query: "string (case-sensitive user input)",
  timestamp: number (milliseconds since epoch, for debounce)
}
```

**Validation Rules**:
- Can be empty string (shows all songs)
- No length limit (but typically < 100 characters)
- Supports all Unicode characters
- No special validation needed (user input)

**Usage**: Passed to filter function to subset the song catalog

---

## In-Memory State

### Application State

**Description**: Runtime state of the music player application

**Structure**:
```javascript
{
  catalogData: SongCatalog | null,  // Loaded catalog or null if not loaded
  songs: Song[],                     // Flattened array for easy access
  currentSongIndex: number | null,   // Index of currently playing song
  isPlaying: boolean,                // Playback state
  searchQuery: string,               // Current search text
  filteredSongs: Song[]              // Currently filtered songs (for display)
}
```

**Validation Rules**:
- `catalogData` and `songs` are null during loading
- `currentSongIndex` is null when no song is selected
- `isPlaying` defaults to false
- `searchQuery` defaults to empty string
- `filteredSongs` defaults to full song array

**State Transitions**:

1. **Application Start**:
   - `catalogData`: null
   - `songs`: []
   - `currentSongIndex`: null
   - `isPlaying`: false
   - `searchQuery`: ""
   - `filteredSongs`: []

2. **Catalog Load Success**:
   - `catalogData`: Loaded from catalog.json
   - `songs`: Array from catalogData.songs
   - `currentSongIndex`: null (or 0 if auto-play)
   - `filteredSongs`: songs (full array)

3. **Catalog Load Failure**:
   - `catalogData`: null
   - `songs`: []
   - Error state shown in UI

4. **Search Input** (after debounce):
   - `searchQuery`: Updated with user input
   - `filteredSongs`: Filtered subset matching query

5. **Clear Search**:
   - `searchQuery`: ""
   - `filteredSongs`: songs (full array)

6. **Play Song**:
   - `currentSongIndex`: Index of selected song
   - `isPlaying`: true

7. **Pause Song**:
   - `currentSongIndex`: Unchanged
   - `isPlaying`: false

8. **Next/Previous**:
   - `currentSongIndex`: Updated (with wraparound)
   - `isPlaying`: true (unless playing was false)

---

## Data Relationships

```
SongCatalog (1)
    ├── contains (1..n) Song
    └── version tracks catalog format

Search Query (1)
    └── filters (0..n) Song (via title or artist match)

Application State (1)
    ├── references (0..1) SongCatalog
    ├── contains (1..n) Song (cached array)
    └── tracks (0..1) current Song (by index)
```

---

## API Contracts

### catalog.json Schema

**File**: `src/catalog.json`

**Format**: JSON

**Required Fields**:
```json
{
  "version": "1.0",
  "songs": [...]
}
```

**Song Object**:
```json
{
  "id": "string (unique)",
  "title": "string",
  "artist": "string",
  "url": "string (URL)"
}
```

**Optional Fields** (song level):
- `duration`: number (seconds)
- `albumArt`: string (URL)
- `fileSize`: number (bytes)
- `album`: string
- `year`: number
- `genre`: string

**Optional Fields** (catalog level):
- `lastUpdated`: string (ISO 8601 date)

---

## Error States

### Invalid JSON

**Condition**: catalog.json is not valid JSON
**Action**: Display error message with retry button
**State**: `catalogData` remains null

### Missing Required Fields

**Condition**: Song missing id, title, artist, or url
**Action**: Skip invalid song, log warning to console
**State**: Valid songs still loaded, invalid songs excluded

### Duplicate Song IDs

**Condition**: Multiple songs with same id
**Action**: Last occurrence wins, log warning to console
**State**: Catalog loaded with duplicate removed

### Network Error

**Condition**: Fetch fails (404, 500, timeout)
**Action**: Display error message with retry button
**State**: `catalogData` remains null

### Empty Catalog

**Condition**: songs array is empty
**Action**: Display "No songs available" message (not an error)
**State**: `songs` is empty array, UI shows empty state

---

## Example Data

### Sample catalog.json

```json
{
  "version": "1.0",
  "lastUpdated": "2026-01-26",
  "songs": [
    {
      "id": "song-001",
      "title": "Acoustic Breeze",
      "artist": "Benjamin Tissot",
      "url": "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3",
      "duration": 157,
      "albumArt": "https://www.bensound.com/bensound-img/acousticbreeze.jpg",
      "genre": "Acoustic",
      "fileSize": 3774873
    },
    {
      "id": "song-002",
      "title": "Sunny",
      "artist": "Benjamin Tissot",
      "url": "https://www.bensound.com/bensound-music/bensound-sunny.mp3",
      "duration": 142,
      "albumArt": "https://www.bensound.com/bensound-img/sunny.jpg",
      "genre": "Acoustic",
      "fileSize": 3423258
    },
    {
      "id": "song-003",
      "title": "Ukulele",
      "artist": "Benjamin Tissot",
      "url": "https://www.bensound.com/bensound-music/bensound-ukulele.mp3",
      "duration": 146,
      "albumArt": "https://www.bensound.com/bensound-img/ukulele.jpg",
      "genre": "Folk",
      "fileSize": 3521642
    }
  ]
}
```

---

## Performance Considerations

### Memory Usage

- **Catalog size**: ~500 bytes per song (average)
- **100 songs**: ~50KB in memory
- **1000 songs**: ~500KB in memory (within acceptable limits)

### Search Performance

- **Filter time**: O(n) where n = number of songs
- **100 songs**: < 10ms
- **1000 songs**: < 100ms (within target)

### Loading Performance

- **Fetch time**: Network-dependent (target < 1 second for 50 songs)
- **Parse time**: < 10ms for 100 songs
- **Render time**: < 50ms for 100 songs using DocumentFragment
