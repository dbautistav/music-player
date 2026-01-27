# API Contracts

**Feature**: `004-static-playback`
**Phase**: 1 (Static Playback)

## Overview

This directory contains API contracts for external interfaces. In Phase 1 (Static Playback), there are no external APIs, backend services, or data contracts required.

## Why Empty?

Phase 1 implementation uses:
- **In-memory data**: 3 songs hardcoded in JavaScript array
- **No external APIs**: All data is local/static
- **No backend**: No server-side components
- **No data persistence**: No database or storage APIs

## Future Phases

### Phase 2: Dynamic Catalog

Will add:
- **HTTP Contract**: Fetch API calls to `catalog.json`
- **Data Contract**: JSON schema for catalog structure
- **Error Contract**: Network failure handling

### Phase 3: Caching

Will add:
- **Service Worker Contract**: Cache API interactions
- **IndexedDB Contract**: Database schema and operations
- **Storage Contract**: Blob storage for audio files

### Phase 4+: Framework Integration

Will add:
- **Component Contracts**: React/Vue component interfaces
- **State Management Contracts**: Redux/Zustand actions/selectors
- **Routing Contracts**: Navigation patterns (if routing added)

## Internal API Design

Although no external contracts, Phase 1 defines internal JavaScript functions:

### Public Functions (App Interface)

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `playSong(index)` | Play specific song | `index` (number, 0-2) | `void` |
| `pauseSong()` | Pause current playback | none | `void` |
| `resumeSong()` | Resume paused playback | none | `void` |
| `nextSong()` | Skip to next song | none | `void` |
| `previousSong()` | Go to previous song | none | `void` |
| `togglePlayPause()` | Toggle play/pause state | none | `void` |
| `renderSongList()` | Render song list to DOM | none | `void` |
| `updatePlayButton()` | Update play/pause button UI | none | `void` |
| `showErrorState(message)` | Display error to user | `message` (string) | `void` |

### Event Handlers

| Event | Handler | Triggered By |
|-------|---------|--------------|
| `DOMContentLoaded` | `init()` | Page load complete |
| `click` on song card | `playSong(index)` | User clicks song |
| `click` on play/pause | `togglePlayPause()` | User clicks play/pause |
| `click` on next | `nextSong()` | User clicks next |
| `click` on previous | `previousSong()` | User clicks previous |
| `error` on audioElement | Error handler | Audio load failure |
| `ended` on audioElement | Playback complete handler | Song finishes |

## Data Contracts (Internal)

### Song Data Structure

```typescript
interface Song {
  id: number;           // Unique identifier
  title: string;        // Display name
  artist: string;       // Artist name
  url: string;          // Audio file URL
  duration?: number;     // Length in seconds (optional)
}
```

### State Structure

```typescript
interface AppState {
  currentSongIndex: number;  // Currently selected song (0-2)
  isPlaying: boolean;       // Playback state
  audioElement: HTMLAudioElement;  // Audio element instance
}
```

## Browser API Contracts

### HTMLAudioElement Methods Used

| Method | Purpose | Frequency |
|---------|----------|-----------|
| `play()` | Start audio playback | On user action |
| `pause()` | Pause audio playback | On user action |
| `load()` | Reload audio source | Rarely needed (automatic) |

### HTMLAudioElement Events Listened To

| Event | Purpose | Handler |
|-------|----------|----------|
| `error` | Audio load/playback failure | Show error UI |
| `ended` | Playback completed | Update UI state |

### DOM API Methods Used

| Method | Purpose |
|---------|----------|
| `document.getElementById()` | Get DOM element by ID |
| `document.createElement()` | Create new DOM element |
| `document.addEventListener()` | Attach event listener |
| `element.innerHTML` | Set HTML content |
| `element.classList.add()` | Add CSS class |
| `element.dataset.songId` | Store data attribute |
| `element.appendChild()` | Add child element |

## Validation Requirements

Although no external contracts, internal data must be validated:

### Song Validation

- `id`: Must be non-zero number, unique
- `title`: Must be non-empty string, max 100 chars
- `artist`: Must be non-empty string, max 100 chars
- `url`: Must be valid URL format, accessible
- `duration` (optional): Must be positive number if present

### State Validation

- `currentSongIndex`: Must be within `0` to `songs.length - 1`
- `isPlaying`: Must be boolean
- `audioElement`: Must be HTMLAudioElement instance

## Error Contract

### Error Types

| Error Type | Trigger | Response |
|-------------|----------|------------|
| `NetworkError` | Audio URL unreachable | Show error UI, retry option |
| `TypeError` | Invalid song data | Skip song, console warning |
| `RangeError` | Invalid song index | Reset to 0 |
| `MediaError` | Unsupported audio format | Show error UI |

### Error Message Format

```javascript
// User-facing errors (show in UI)
showErrorState('Unable to play song. Please try again.');
showErrorState('Failed to load audio file. Check if URL is accessible.');

// Developer errors (console only)
console.error('Failed to play song:', error);
console.warn('Invalid song index, resetting to 0');
```

## Testing Contracts

### Manual Testing Protocol

1. **Functional Tests**:
   - Play each of 3 songs
   - Pause and resume playback
   - Navigate next/previous
   - Test loop navigation (last→first, first→last)

2. **Edge Case Tests**:
   - Click already-playing song
   - Navigate while paused
   - Trigger audio load failure (use invalid URL)

3. **Cross-Browser Tests**:
   - Chrome (90+)
   - Firefox (88+)
   - Safari (14+)
   - Mobile browsers

4. **Responsive Tests**:
   - Mobile (375px width)
   - Tablet (768px width)
   - Desktop (1920px width)

5. **Accessibility Tests**:
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast
   - Touch target size (44x44px minimum)

## Documentation

- Quickstart Guide: [quickstart.md](../quickstart.md)
- Data Model: [data-model.md](../data-model.md)
- Research: [research.md](../research.md)
- Feature Spec: [spec.md](../spec.md)
- Implementation Plan: [plan.md](../plan.md)
