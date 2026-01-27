# Data Model: Static Music Player

**Feature**: `004-static-playback`
**Date**: 2026-01-26
**Phase**: 1 (Static Playback)

## Overview

This document defines the data model for the static music player feature. Phase 1 uses in-memory data structures with no persistence.

## Entity: Song

The Song entity represents a piece of audio content in the music player catalog.

### Attributes

| Attribute | Type | Required | Description | Validation Rules |
|-----------|--------|-----------|-------------|----------------|
| `id` | number | Yes | Unique identifier for the song | Must be unique, non-zero |
| `title` | string | Yes | Display name of the song | Non-empty string, max 100 chars |
| `artist` | string | Yes | Name of the artist or band | Non-empty string, max 100 chars |
| `url` | string | Yes | URL pointing to audio file (MP3) | Valid URL format, accessible |
| `duration` | number (optional) | No | Length of song in seconds | Positive integer if provided |
| `albumArt` | string (optional) | No | URL to album artwork image | Valid URL format if provided |

### Relationships

- **None** - Song is a standalone entity in Phase 1
- **Phase 2+**: May relate to Album, Playlist, or User entities (future scope)

### State Transitions

Song itself is immutable (static data), but playback state transitions:

**Play States** (managed by app state, not Song entity):
1. `stopped` → `playing`: When user clicks on a song
2. `playing` → `paused`: When user clicks pause button
3. `paused` → `playing`: When user clicks play button
4. `paused` → `stopped`: When user clicks a different song

**Navigation State** (managed by app state):
1. Current song index (0, 1, or 2)
2. Navigation wraps around (last → first, first → last)

### Example Data

```javascript
const songs = [
  {
    id: 1,
    title: "Acoustic Breeze",
    artist: "Benjamin Tissot",
    url: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3",
    duration: 157,
    albumArt: "https://www.bensound.com/bensound-img/acousticbreeze.jpg"
  },
  {
    id: 2,
    title: "Sunny",
    artist: "Benjamin Tissot",
    url: "https://www.bensound.com/bensound-music/bensound-sunny.mp3",
    duration: 142,
    albumArt: "https://www.bensound.com/bensound-img/sunny.jpg"
  },
  {
    id: 3,
    title: "Ukulele",
    artist: "Benjamin Tissot",
    url: "https://www.bensound.com/bensound-music/bensound-ukulele.mp3",
    duration: 146,
    albumArt: "https://www.bensound.com/bensound-img/ukulele.jpg"
  }
];
```

## Application State

### Global State Variables (Phase 1-2)

Per constitution "State Management" section:

```javascript
// Track which song is currently selected
let currentSongIndex = 0;

// Track playback state
let isPlaying = false;

// Store the audio element reference
const audioElement = new Audio();
```

### State Schema

| Variable | Type | Initial Value | Description | Mutability |
|----------|------|---------------|-------------|-------------|
| `currentSongIndex` | number | 0 | Index of currently selected song in `songs` array | Mutable (0-2) |
| `isPlaying` | boolean | false | Whether audio is currently playing or paused | Mutable |
| `audioElement` | Audio | new Audio() | HTML5 Audio element for playback control | Mutable (methods called on it) |

### State Update Operations

1. **playSong(index)**:
   - Set `currentSongIndex = index`
   - Update `audioElement.src = songs[index].url`
   - Call `audioElement.play()`
   - Set `isPlaying = true`

2. **pauseSong()**:
   - Call `audioElement.pause()`
   - Set `isPlaying = false`

3. **resumeSong()**:
   - Call `audioElement.play()`
   - Set `isPlaying = true`

4. **nextSong()**:
   - Set `currentSongIndex = (currentSongIndex + 1) % songs.length`
   - Call `playSong(currentSongIndex)`

5. **previousSong()**:
   - Set `currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length`
   - Call `playSong(currentSongIndex)`

## Validation Rules

### Song Data Validation

```javascript
function validateSong(song) {
  // Required fields
  if (!song.id || typeof song.id !== 'number') {
    throw new Error('Song must have a valid numeric id');
  }
  if (!song.title || typeof song.title !== 'string' || song.title.trim() === '') {
    throw new Error('Song must have a non-empty title');
  }
  if (!song.artist || typeof song.artist !== 'string' || song.artist.trim() === '') {
    throw new Error('Song must have a non-empty artist name');
  }
  if (!song.url || typeof song.url !== 'string' || !isValidUrl(song.url)) {
    throw new Error('Song must have a valid URL');
  }

  // Optional fields
  if (song.duration !== undefined) {
    if (typeof song.duration !== 'number' || song.duration <= 0) {
      console.warn('Invalid duration, ignoring:', song.duration);
      delete song.duration;
    }
  }

  if (song.albumArt !== undefined) {
    if (typeof song.albumArt !== 'string' || !isValidUrl(song.albumArt)) {
      console.warn('Invalid album art URL, ignoring:', song.albumArt);
      delete song.albumArt;
    }
  }

  return true;
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
```

### State Validation

```javascript
function validateState() {
  // Ensure currentSongIndex is within bounds
  if (currentSongIndex < 0 || currentSongIndex >= songs.length) {
    currentSongIndex = 0;
    console.warn('Invalid song index, resetting to 0');
  }

  // Ensure isPlaying is boolean
  if (typeof isPlaying !== 'boolean') {
    isPlaying = false;
    console.warn('Invalid isPlaying state, resetting to false');
  }
}
```

## Data Flow

### Load Flow (Initialization)

```
app.js loads
  ↓
songs array initialized (hardcoded)
  ↓
State variables initialized (currentSongIndex=0, isPlaying=false, audioElement=new Audio())
  ↓
renderSongList() displays songs
  ↓
Event listeners attached to DOM elements
```

### Playback Flow

```
User clicks song / next / previous / play button
  ↓
playSong(index) called
  ↓
currentSongIndex updated
  ↓
audioElement.src = songs[index].url
  ↓
audioElement.play() called
  ↓
isPlaying = true
  ↓
UI updates (visual feedback on current song)
```

### Pause Flow

```
User clicks pause button
  ↓
pauseSong() called
  ↓
audioElement.pause() called
  ↓
isPlaying = false
  ↓
UI updates (button icon changes)
```

## Edge Cases & Constraints

### Constraint: Fixed Number of Songs

- Phase 1: Exactly 3 songs (hardcoded)
- Validation: Array length should be 3
- Error handling: Show error if fewer than 3 songs available

### Constraint: Single Song Playback

- Requirement: Only one song plays at a time
- Implementation: Audio element is a singleton (global variable)
- Behavior: New song selection automatically stops current song

### Constraint: Loop Navigation

- Requirement: Next on last song goes to first, previous on first goes to last
- Implementation: Modulo arithmetic on index
- Formula: `next = (current + 1) % length`, `prev = (current - 1 + length) % length`

### Edge Case: Audio Load Failure

- Scenario: URL is unreachable or file is corrupted
- Handling: Catch `error` event on audioElement
- Action: Display user-friendly error message, prevent playback attempt
- Recovery: User can retry or select different song

### Edge Case: Invalid Song Data

- Scenario: Song missing required fields or invalid data types
- Handling: Validate each song on initialization
- Action: Skip invalid songs with console warning
- Recovery: Continue with valid songs only

## Data Integrity

### Immutability

- **Songs Array**: Immutable after initialization (Phase 1)
- **Song Objects**: Immutable (no modification after creation)
- **State Variables**: Mutable only through defined state update operations

### Consistency Rules

1. `currentSongIndex` always points to valid song in `songs` array
2. `isPlaying` reflects actual playback state of `audioElement`
3. `audioElement.src` always matches `songs[currentSongIndex].url` when song is loaded
4. Visual feedback always matches actual playback state

### Cleanup

- No cleanup needed for Phase 1 (in-memory only)
- Phase 3+: IndexedDB will need cleanup for cached blobs

## Transition Notes for Phase 2+

### Phase 2: Dynamic Catalog

**Changes to Data Model**:
- `songs` array populated from `catalog.json` instead of hardcoded
- Validation on load from external source
- Error handling for network failures

**New Attributes** (from catalog.json structure):
- `fileSize` (optional): Size in bytes
- `album` (optional): Album name
- `year` (optional): Release year
- `genre` (optional): Music genre

### Phase 3: Caching

**New Entities**:
- `CachedSong`: Song with `audioBlob` (Binary Large Object)
- `CacheMetadata`: Total cache size, cached song IDs

**State Changes**:
- Add `cachedSongIds` to track which songs are offline
- Add `isOffline` flag for UI state

### Phase 4+: Framework Integration

If state management library added (Zustand, etc.):
- Centralized state object replaces global variables
- Actions for state updates
- Selectors for computed state
- Persistence layer abstraction
