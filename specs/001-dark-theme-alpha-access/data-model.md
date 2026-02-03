# Data Model: Dark Theme & Alpha Tester Access

**Feature**: Dark Theme & Alpha Tester Access
**Date**: 2025-02-01
**Status**: No new data structures - only CSS changes and deployment config

---

## Overview

This feature involves visual theme changes (CSS) and deployment configuration (GitHub Actions). No new data structures, database schemas, or application state are required. The application's existing data model (songs, cached audio, user preferences) remains unchanged.

---

## Data Entities

**Note**: No new entities. This section documents what remains unchanged.

### Existing Entities (Unchanged)

#### 1. Song Catalog (catalog.json)

```json
{
  "version": "1.0",
  "songs": [
    {
      "id": "song-001",
      "title": "Song Title",
      "artist": "Artist Name",
      "url": "./songs/song-001.mp3",
      "duration": 180,
      "albumArt": "./images/album.jpg"
    }
  ]
}
```

**Fields**:
- `version`: String - Catalog version for cache invalidation
- `songs`: Array of song objects
- `songs[].id`: String - Unique song identifier
- `songs[].title`: String - Song title
- `songs[].artist`: String - Artist name
- `songs[].url`: String - Audio file URL (relative path)
- `songs[].duration`: Number - Duration in seconds
- `songs[].albumArt`: String - Album art image URL

**Changes**: None

---

#### 2. Cached Song Metadata (IndexedDB)

Stored in `songs` object store in IndexedDB:

```javascript
{
  id: "song-001",
  title: "Song Title",
  artist: "Artist Name",
  url: "./songs/song-001.mp3",
  audioBlob: Blob,  // Cached audio data
  fileSize: 5242880,  // Size in bytes
  cachedAt: 1706198400000,  // Timestamp
  cacheStatus: "cached"
}
```

**Fields**:
- `id`: String - Unique song identifier (key path)
- `title`: String - Song title
- `artist`: String - Artist name
- `url`: String - Audio file URL
- `audioBlob`: Blob - Cached audio data (large binary)
- `fileSize`: Number - File size in bytes for quota management
- `cachedAt`: Number - Cache timestamp for LRU eviction
- `cacheStatus`: String - "cached", "cached-but-purged", or "not-cached"

**Changes**: None

---

#### 3. Application State (Global Variables)

```javascript
// src/app.js
let currentSongIndex = 0;
let isPlaying = false;
let songs = [];  // Loaded from catalog.json
let cachedSongIds = new Set();  // Track cached songs
```

**Fields**:
- `currentSongIndex`: Number - Index of currently playing song
- `isPlaying`: Boolean - Playback state
- `songs`: Array - Array of song objects from catalog
- `cachedSongIds`: Set - Set of cached song IDs

**Changes**: None

---

## Configuration Data

### 1. Theme Configuration (CSS Custom Properties)

**Note**: These are CSS variables, not runtime data structures. Defined in `src/styles.css`.

```css
:root {
  /* Backgrounds */
  --bg-primary: #242424;
  --bg-secondary: #1a1a1a;
  --bg-hover: #2a2a2a;

  /* Text */
  --text-primary: #e8e8e8;
  --text-secondary: #b8b8b8;

  /* Accents */
  --accent-color: #42a5f5;
  --accent-hover: #64b5f6;

  /* Borders */
  --border-color: #3a3a3a;

  /* Status */
  --error-color: #e57373;
  --warning-color: #ffb74d;
  --success-color: #66bb6a;
}
```

**Usage**: Referenced throughout CSS via `var(--variable-name)`

**Persistence**: Not persisted - always applied on load

---

### 2. Deployment Configuration (GitHub Actions)

**Note**: These are CI/CD configuration, not runtime data. Defined in `.github/workflows/deploy.yml`.

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './src'
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

**Configuration Values**:
- Trigger: Push to `main` branch
- Source directory: `./src`
- Concurrency: Prevents race conditions
- Permissions: Required for Pages deployment

---

### 3. PWA Manifest Configuration

**Note**: This file defines PWA metadata. Updated in `src/manifest.json`.

```json
{
  "name": "Music Player PWA",
  "short_name": "Music Player",
  "description": "A simple, offline-capable music player",
  "theme_color": "#242424",
  "background_color": "#242424",
  "display": "standalone",
  "start_url": "/",
  "icons": [...]
}
```

**Fields**:
- `theme_color`: String - Browser chrome color (updated to dark)
- `background_color`: String - Splash screen color (updated to dark)

**Changes**: `theme_color` and `background_color` updated to `#242424`

---

## Data Flow Diagrams

### No New Data Flows

The dark theme feature does not introduce new data flows. Existing flows remain:

1. **Catalog Load**:
   ```
   catalog.json → fetch() → songs array → render song cards
   ```

2. **Audio Playback**:
   ```
   Click song card → load audio → play → update UI state
   ```

3. **Song Caching**:
   ```
   Play song → fetch audio → store in IndexedDB → update cachedSongIds
   ```

### Deployment Flow (New)

```
Push to main → GitHub Actions → Upload src/ → Deploy to GitHub Pages
```

**Stakeholders**:
- Developer: Pushes code to `main` branch
- GitHub Actions: Runs deployment workflow
- GitHub Pages: Serves static files at `https://[username].github.io/[repo]/`
- Alpha Tester: Accesses URL to test dark theme

---

## Validation Rules

### No New Validation Rules

Existing validation rules remain in place:

1. **Catalog Validation** (in `app.js`):
   - Check `response.ok` when fetching catalog.json
   - Verify `data.songs` exists and is array
   - Skip invalid songs (missing required fields)

2. **Audio File Validation** (in `app.js`):
   - Check audio file loads successfully
   - Handle errors gracefully

3. **IndexedDB Validation** (in `db.js`):
   - Check if database exists on open
   - Handle `QuotaExceededError`
   - Validate song object structure before storing

### New Validation: Contrast Ratios

**Note**: This is a manual/testing validation, not runtime validation.

- **Automated**: Lighthouse accessibility audit verifies 4.5:1+ contrast
- **Manual**: WebAIM Contrast Checker for critical elements
- **Documented**: Ratios recorded in quickstart guide

---

## State Transitions

### No New State Transitions

Existing state transitions remain:

1. **Playback State**:
   ```
   stopped → playing → paused → playing → stopped
   ```

2. **Song Selection**:
   ```
   Song A selected → Song B selected → update currentSongIndex
   ```

3. **Cache State** (per song):
   ```
   not-cached → caching → cached
   cached → cached-but-purged (quota exceeded)
   ```

### Theme State (No Transitions)

Theme is not a runtime state - it's always dark. No transitions.

---

## Storage Requirements

### No New Storage

Existing storage requirements unchanged:

1. **IndexedDB**:
   - Used for: Cached song audio blobs
   - Quota: Browser-dependent (Safari ~50MB, others ~unlimited)
   - Strategy: LRU eviction when quota exceeded

2. **Cache API** (Service Worker):
   - Used for: App shell (HTML, CSS, JS, manifest)
   - Version: `music-player-v2` (will include updated CSS)
   - Size: ~30KB (unchanged by dark theme)

3. **LocalStorage**:
   - Not used in current implementation

**Dark Theme Impact**: CSS changes add ~2KB to styles.css, no storage impact

---

## Performance Considerations

### CSS Variables Performance

- **Efficient**: CSS variables are cached by browser and perform well
- **No runtime overhead**: Variables resolved at style calculation time
- **Reflow minimal**: Theme change only happens once (app loads)
- **Bundle size**: ~2KB increase from CSS variables and updated values

### Deployment Performance

- **Build time**: None (no build step)
- **Upload time**: <30 seconds for ~50KB of files
- **Propagation time**: 1-2 minutes for GitHub Pages to deploy
- **CDN caching**: GitHub Pages uses Cloudflare CDN automatically

---

## Security Considerations

### No New Security Concerns

- No new external resources or scripts
- GitHub Actions uses official, vetted actions
- No user data collection or transmission
- HTTPS enforced by GitHub Pages (required for Service Workers)

---

## Data Model Summary

| Aspect | Status | Details |
|--------|--------|---------|
| New Entities | None | Only CSS changes and deployment config |
| Existing Entities | Unchanged | Song catalog, cached songs, app state |
| Data Flows | No new flows | Deployment flow added (not data flow) |
| Validation | Manual only | Contrast ratio verification (Lighthouse + WebAIM) |
| State Management | No changes | Global state unchanged |
| Storage | No changes | IndexedDB, Cache API unchanged |
| Performance | Minimal impact | +2KB CSS, no runtime overhead |
| Security | No concerns | No new external resources |

---

## Conclusion

The dark theme feature is purely visual and operational - it does not introduce new data structures, runtime state, or data persistence. The only "data model" changes are:
1. CSS custom properties (not runtime data)
2. PWA manifest colors (metadata, not user data)
3. GitHub Actions config (CI/CD, not runtime data)

All application data models remain unchanged. Implementation focuses on `src/styles.css` modifications and deployment workflow creation.
