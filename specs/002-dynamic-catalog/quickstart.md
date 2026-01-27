# Quickstart: Dynamic Catalog & Search

**Feature**: `002-dynamic-catalog`
**Date**: 2026-01-26
**Status**: Final

## Prerequisites

- Complete Phase 1 (static playback with 3 hardcoded songs)
- Node.js installed (for local development server)
- Git repository initialized
- Browser with DevTools (Chrome, Firefox, Safari, or Edge)

## Project Setup

### 1. Branch Checkout

```bash
git checkout 002-dynamic-catalog
```

### 2. Directory Structure

Ensure your project structure looks like this:

```text
music-player/
├── src/
│   ├── index.html          # HTML structure
│   ├── styles.css          # All styles
│   ├── app.js              # Application logic
│   └── catalog.json        # NEW: Song catalog
├── specs/
│   ├── phase2-dynamic-catalog.md
│   └── 002-dynamic-catalog/
│       ├── spec.md
│       ├── plan.md
│       ├── research.md
│       ├── data-model.md
│       ├── quickstart.md
│       └── contracts/
└── .specify/
```

## Implementation Steps

### Step 1: Create catalog.json

Create `src/catalog.json` with sample songs:

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

**Note**: These are Bensound URLs. Check their license requirements if using in production.

### Step 2: Update index.html

Add search input and container for song list:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Music Player</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Music Player</h1>
  </header>

  <main>
    <!-- NEW: Search input -->
    <section class="search-section">
      <input type="text" id="search-input" placeholder="Search songs or artists..." aria-label="Search songs">
      <button id="clear-search" class="clear-btn" aria-label="Clear search">✕</button>
    </section>

    <!-- NEW: Loading skeleton -->
    <div id="loading-skeleton" class="loading-skeleton" hidden>
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
    </div>

    <!-- NEW: Error state -->
    <div id="error-state" class="error-state" hidden>
      <p id="error-message">Unable to load song catalog. Please try again later.</p>
      <button id="retry-btn">Retry</button>
    </div>

    <!-- NEW: Song list -->
    <section id="song-list" class="song-list">
      <!-- Songs will be rendered here -->
    </section>
  </main>

  <!-- Existing audio element and controls -->
  <audio id="audio-player"></audio>
  <section class="controls">
    <!-- Playback controls from Phase 1 -->
  </section>

  <script src="app.js"></script>
</body>
</html>
```

### Step 3: Update styles.css

Add styles for search, loading skeleton, and song cards:

```css
/* Search Section */
.search-section {
  position: relative;
  margin: 1rem 0;
  padding: 0 1rem;
}

#search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

#search-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.clear-btn {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #999;
  display: none; /* Hidden by default */
}

.clear-btn.visible {
  display: block;
}

/* Loading Skeleton */
.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.skeleton-item {
  height: 80px;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Error State */
.error-state {
  text-align: center;
  padding: 2rem;
}

.error-state p {
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-state button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

/* Song List */
.song-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem;
}

@media (min-width: 768px) {
  .song-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .song-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Song Card */
.song-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.song-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Playing State */
.song-card.playing {
  background: #f0f9ff;
  border-left: 4px solid #3b82f6;
}

.song-card.playing::after {
  content: '🔊';
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.2rem;
}

/* Album Art */
.album-art {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.album-art-placeholder {
  width: 80px;
  height: 80px;
  background: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

/* Song Info */
.song-info {
  flex: 1;
}

.song-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #1f2937;
}

.song-artist {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.song-duration {
  font-size: 0.85rem;
  color: #9ca3af;
}

/* Play Button */
.play-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: background 0.2s;
}

.play-btn:hover {
  background: #2563eb;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}
```

### Step 4: Update app.js

Add catalog loading, search functionality, and song rendering:

```javascript
// Global state
let catalogData = null;
let songs = [];
let currentSongIndex = null;
let isPlaying = false;

// DOM elements
const audioPlayer = document.getElementById('audio-player');
const searchInput = document.getElementById('search-input');
const clearBtn = document.getElementById('clear-search');
const songList = document.getElementById('song-list');
const loadingSkeleton = document.getElementById('loading-skeleton');
const errorState = document.getElementById('error-state');
const errorMessage = document.getElementById('error-message');
const retryBtn = document.getElementById('retry-btn');

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Load catalog
async function loadCatalog() {
  try {
    showLoadingState();

    const response = await fetch('./catalog.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Validate data structure
    if (!data.songs || !Array.isArray(data.songs)) {
      throw new Error('Invalid catalog format');
    }

    catalogData = data;
    songs = data.songs;
    renderSongList(songs);
    hideLoadingState();

  } catch (error) {
    console.error('Failed to load catalog:', error);
    showErrorState('Unable to load song catalog. Please try again later.');
  }
}

// Show loading state
function showLoadingState() {
  loadingSkeleton.hidden = false;
  songList.hidden = true;
  errorState.hidden = true;
}

// Hide loading state
function hideLoadingState() {
  loadingSkeleton.hidden = true;
  songList.hidden = false;
  errorState.hidden = true;
}

// Show error state
function showErrorState(message) {
  loadingSkeleton.hidden = true;
  songList.hidden = true;
  errorState.hidden = false;
  errorMessage.textContent = message;
}

// Render song list
function renderSongList(songsToRender) {
  songList.innerHTML = '';

  if (songsToRender.length === 0) {
    songList.innerHTML = `
      <div class="no-results">
        <p>No songs found for "${searchInput.value}"</p>
      </div>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();

  songsToRender.forEach((song, index) => {
    const songCard = createSongCard(song, index);
    fragment.appendChild(songCard);
  });

  songList.appendChild(fragment);
}

// Create song card
function createSongCard(song, index) {
  const card = document.createElement('div');
  card.className = 'song-card';
  card.dataset.songId = song.id;

  // Add 'playing' class if this is the current song
  if (currentSongIndex === index) {
    card.classList.add('playing');
  }

  const albumArt = song.albumArt
    ? `<img src="${song.albumArt}" alt="${song.title}" loading="lazy" class="album-art">`
    : `<div class="album-art-placeholder">🎵</div>`;

  const duration = song.duration
    ? formatDuration(song.duration)
    : '';

  card.innerHTML = `
    ${albumArt}
    <div class="song-info">
      <h3 class="song-title">${song.title}</h3>
      <p class="song-artist">${song.artist}</p>
      ${duration ? `<span class="song-duration">${duration}</span>` : ''}
    </div>
    <button class="play-btn" data-index="${index}">
      <span class="play-icon">▶️</span>
    </button>
  `;

  // Add click handler
  const playBtn = card.querySelector('.play-btn');
  playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playSong(index);
  });

  card.addEventListener('click', () => playSong(index));

  return card;
}

// Format duration
function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Debounced search
const debouncedSearch = debounce((query) => {
  filterSongs(query);
}, 300);

// Search handler
searchInput.addEventListener('input', (e) => {
  const query = e.target.value;

  if (query.length > 0) {
    clearBtn.classList.add('visible');
  } else {
    clearBtn.classList.remove('visible');
  }

  debouncedSearch(query);
});

// Clear search
clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  clearBtn.classList.remove('visible');
  filterSongs('');
});

// Filter songs
function filterSongs(query) {
  if (!catalogData) return;

  const lowerQuery = query.toLowerCase().trim();

  if (lowerQuery === '') {
    renderSongList(songs);
    return;
  }

  const filtered = songs.filter(song => {
    const titleMatch = song.title.toLowerCase().includes(lowerQuery);
    const artistMatch = song.artist.toLowerCase().includes(lowerQuery);
    return titleMatch || artistMatch;
  });

  renderSongList(filtered);
}

// Play song (from Phase 1, update to work with filtered results)
function playSong(index) {
  const song = songs[index];
  if (!song) return;

  audioPlayer.src = song.url;
  audioPlayer.play();
  currentSongIndex = index;
  isPlaying = true;

  updatePlayingState();
}

// Update playing state
function updatePlayingState() {
  document.querySelectorAll('.song-card').forEach(card => {
    card.classList.remove('playing');
  });

  const currentCard = document.querySelector(`[data-song-id="${songs[currentSongIndex].id}"]`);
  if (currentCard) {
    currentCard.classList.add('playing');
  }

  updatePlayButtonIcons();
}

// Update play button icons
function updatePlayButtonIcons() {
  document.querySelectorAll('.play-btn').forEach((btn, index) => {
    const icon = btn.querySelector('.play-icon');
    if (index === currentSongIndex && isPlaying) {
      icon.textContent = '⏸️';
    } else {
      icon.textContent = '▶️';
    }
  });
}

// Retry button
retryBtn.addEventListener('click', loadCatalog);

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  loadCatalog();

  // Rest of Phase 1 initialization...
});
```

### Step 5: Test Locally

Start a local server:

```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js (if you have http-server)
npx http-server

# Option 3: PHP
php -S localhost:8000
```

Open `http://localhost:8000/src/` in your browser.

## Testing Checklist

### Catalog Loading
- [ ] Catalog loads from catalog.json on page load
- [ ] Loading skeleton displays during fetch
- [ ] Error message appears if fetch fails
- [ ] Retry button re-attempts fetch

### Display
- [ ] All songs render correctly
- [ ] Album art displays (when provided)
- [ ] Missing album art shows placeholder
- [ ] Song metadata (title, artist, duration) is readable

### Search
- [ ] Search filters by title
- [ ] Search filters by artist
- [ ] Search is case-insensitive
- [ ] Clear button resets search
- [ ] "No results" message shows when appropriate
- [ ] Debounce prevents excessive filtering

### Playback Integration
- [ ] Clicking a song from catalog plays it
- [ ] Currently playing song is highlighted
- [ ] Play/pause button updates correctly
- [ ] Works with filtered results

### Performance
- [ ] Catalog of 50 songs loads in < 2 seconds
- [ ] Search feels instant (< 100ms)
- [ ] No layout shift when images load
- [ ] Smooth scrolling with many songs

### Responsive
- [ ] Works on mobile (375px)
- [ ] Works on tablet (768px)
- [ ] Works on desktop (1440px+)
- [ ] Touch targets are adequate (44px minimum)

## Common Issues

### Catalog Not Loading

**Problem**: Blank screen or no songs displayed

**Solution**:
1. Open DevTools Console (F12)
2. Check for CORS errors or 404s
3. Ensure catalog.json is in src/ directory
4. Verify JSON format with a validator

### Search Not Working

**Problem**: Typing in search doesn't filter songs

**Solution**:
1. Ensure search input has correct ID: `#search-input`
2. Check that debounce function is defined
3. Verify filterSongs() is being called
4. Check for JavaScript errors in console

### Images Not Loading

**Problem**: Album art images show broken icon

**Solution**:
1. Verify image URLs are accessible
2. Check for CORS issues with external images
3. Ensure loading="lazy" is working
4. Verify placeholder displays correctly

### Performance Issues

**Problem**: Page loads slowly, search feels sluggish

**Solution**:
1. Check that DocumentFragment is used for batch rendering
2. Verify debounce is working (300ms)
3. Ensure images use loading="lazy"
4. Check for memory leaks with DevTools

## Next Steps

After completing Phase 2:

1. Review the testing checklist above
2. Test on multiple browsers (Chrome, Firefox, Safari)
3. Test on mobile devices
4. Verify all Phase 1 features still work
5. Ready to proceed to Phase 3 (caching/offline playback)

## Additional Resources

- **Specification**: `specs/phase2-dynamic-catalog.md`
- **Data Model**: `specs/002-dynamic-catalog/data-model.md`
- **Catalog Schema**: `specs/002-dynamic-catalog/contracts/catalog-schema.json`
- **Constitution**: `.specify/memory/constitution.md`
- **Bensound License**: https://www.bensound.com/licensing
