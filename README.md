# Music Player PWA

A simple, offline-capable music player built with vanilla JavaScript. No frameworks, no build tools - just the browser.

## Features

- **8 songs** available (3 acoustic + 5 ambient tracks)
- **Search** by title or artist
- **Offline playback** - cache songs for offline use
- **Sticky playback controls** at bottom of screen (mobile-friendly)
- **Cache management** - view and clear storage
- **PWA** - installable on mobile and desktop

## Quick Start

```bash
cd src
python -m http.server 8000
```

Open: http://localhost:8000

## Tech Stack

- **HTML5**, **CSS3**, **Vanilla JavaScript ES6+**
- **Service Worker API** for offline capability
- **IndexedDB** for caching audio
- **Cache API** for app shell
- **No dependencies**, no build tools

## Browser Support

Chrome/Edge 90+, Firefox 88+, Safari 14+, iOS Safari 14+

## Development

```bash
# Start dev server
cd src && python -m http.server 8000

# Or with Node.js
npx http-server src -p 8000
```

## Offline Testing

1. Load app online first
2. Play songs to cache them
3. Disconnect network
4. Cached songs still play

## Project Structure

```
src/
├── index.html       # Main page
├── styles.css       # All styles
├── app.js           # Application logic
├── catalog.json     # Song catalog
├── sw.js            # Service Worker
├── db.js            # IndexedDB wrapper
├── cache-manager.js # Cache logic
├── manifest.json     # PWA manifest
└── songs/           # Audio files
```

## License

See LICENSE file for details.
