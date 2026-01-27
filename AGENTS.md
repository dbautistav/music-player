# AGENTS.md

This file contains guidelines for AI agents working on this codebase.

## Tech Stack

**HTML5**: Semantic markup, audio element
**CSS3**: Flexbox/Grid for layout, CSS variables for theming
**Vanilla JavaScript**: ES6+ (no frameworks, no build tools, no npm)
**Web Audio API**: For playback control
**Service Worker API**: For offline functionality (Phase 3)
**IndexedDB**: For caching songs (Phase 3)
**Cache API**: For storing app assets (Phase 3)

## Project Structure

```
src/
├── index.html          # Main page
├── styles.css          # All styles
├── app.js              # Playback logic
├── catalog.json        # Song catalog (Phase 2)
├── sw.js               # Service Worker (Phase 3)
├── db.js               # IndexedDB wrapper (Phase 3)
├── cache-manager.js    # Cache logic (Phase 3)
└── manifest.json       # PWA manifest (Phase 3)
```

## Code Style Guidelines

### JavaScript
Use `const` and `let` (never `var`), arrow functions where appropriate, template literals for dynamic HTML, `addEventListener` (no inline `onclick`), store audio element reference, CSS classes for state changes (`.playing`, `.paused`), `async/await` for async operations, add listeners only after `DOMContentLoaded`

### HTML
Semantic HTML5 elements (`<header>`, `<main>`, `<section>`), meta viewport: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`, proper ARIA labels, color contrast ratio ≥ 4.5:1

### CSS
Mobile-first (375px base), CSS Grid for layout, Flexbox for controls, CSS variables for colors/spacing, breakpoint `@media (min-width: 768px)`, responsive: mobile (< 768px) single column, tablet (768-1024px) two columns, desktop (> 1024px) three columns

### Imports
No build tools or npm. Direct imports: `<link rel="stylesheet" href="styles.css">`, `<script src="app.js"></script>`. No ES modules in early phases (use global scope)

### Formatting
2 space indentation (not tabs), consistent whitespace, blank line between functions, max line length 120 chars

### Naming Conventions
Variables: camelCase (`currentSongIndex`, `isPlaying`), Functions: camelCase (`playSong()`), Constants: UPPER_SNAKE_CASE (`CACHE_VERSION`), CSS Classes: kebab-case (`song-card`), HTML IDs: kebab-case (`song-list`), Files: lowercase with dashes (`cache-manager.js`)

### Data Model
**catalog.json**: `{ "version": "1.0", "songs": [{ "id": "song-001", "title": "Song Title", "artist": "Artist Name", "url": "https://example.com/song.mp3", "duration": 180, "albumArt": "./images/album.jpg" }] }`

**IndexedDB (Phase 3)**: `{ id: "unique-song-id", title: "Song Title", artist: "Artist Name", url: "https://example.com/song.mp3", audioBlob: Blob, fileSize: 5242880, cachedAt: 1706198400000, cacheStatus: "cached" }`

### Error Handling
Wrap `fetch()` in try-catch, validate response.ok and JSON structure, show user-friendly error messages, provide retry buttons, validate required fields (id, title, artist, url), skip invalid songs with console warning

### Performance
Page loads <3s on 3G, catalog of 50 songs loads in <1s (Phase 2), search filters 100+ songs in <100ms (Phase 2), smooth 60fps animations, use `DocumentFragment` for batch DOM, lazy load images with `loading="lazy"`, debounce search input (300ms)

### Browser Support
Chrome/Edge 90+, Firefox 88+, Safari 14+, Mobile: iOS Safari 14+, Chrome Mobile 90+

### Service Worker (Phase 3)
Versioned cache names (`music-player-v1`), cache app shell on install, network-first for catalog.json with cache fallback, cache-on-demand for songs, clean old caches on activate, use `self.skipWaiting()` and `self.clients.claim()`

### Accessibility
Clear button labels, visible focus states, color contrast ≥ 4.5:1, touch targets minimum 44px, ARIA labels where needed

## Running the Application

No build tools. Open `index.html` in browser or serve:
```bash
python -m http.server 8000
npx http-server
open src/index.html
```

## Testing

Manual testing on Chrome/Edge, Firefox, Safari, Mobile. Checklist for each phase in `specs/phase*.md`

## Implementation Order

**Phase 1** (`001-phase1-foundation`): Static playback with 3 hardcoded songs
**Phase 2** (`002-phase2-dynamic-catalog`): Dynamic catalog from JSON, search
**Phase 3** (`003-phase3-caching`): Service Worker, IndexedDB, offline playback

## Code Examples

**Fetch with Error Handling**:
```javascript
async function loadCatalog() {
  try {
    const response = await fetch('./catalog.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (!data.songs || !Array.isArray(data.songs)) throw new Error('Invalid catalog format');
    return data;
  } catch (error) {
    console.error('Failed to load catalog:', error);
    showErrorState('Unable to load song catalog. Please try again later.');
  }
}
```

**Debounce**:
```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => { clearTimeout(timeout); func(...args); };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
```

**Format Duration**:
```javascript
function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

## Key Principles

1. **Minimalist Design**: Clean, simple, no unnecessary features
2. **Mobile-First**: Design for mobile first, then scale up
3. **Performance First**: Fast load times, smooth interactions
4. **Accessibility**: Usable for everyone
5. **No Dependencies**: Vanilla, no frameworks
6. **Progressive Enhancement**: Basic works everywhere, enhanced features for capable browsers
