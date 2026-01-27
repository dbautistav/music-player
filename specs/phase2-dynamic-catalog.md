# Phase 2: Dynamic Catalog & UI Enhancement

**Branch**: `002-phase2-dynamic-catalog`
**Duration**: 1-2 days
**Prerequisites**: Phase 1 (static playback) must be complete
**Goal**: Load songs from a JSON catalog and improve the user interface

---

## User Stories

### Story 1: Load Songs from Catalog
**As a** user  
**I want to** see all available songs loaded dynamically from a catalog  
**So that** new songs can be added without changing the code

**Acceptance Criteria**:
- Songs are loaded from `catalog.json` file
- Catalog displays all songs from the JSON data
- Loading happens automatically on page load
- If catalog fails to load, user sees a helpful error message
- Page shows loading indicator while fetching catalog

---

### Story 2: See Song Metadata
**As a** user  
**I want to** see detailed information about each song (title, artist, duration)  
**So that** I can make informed choices about what to play

**Acceptance Criteria**:
- Each song displays: title, artist, duration (if available)
- Album art thumbnail displays (if URL provided in catalog)
- Metadata is clearly visible and readable on mobile
- Missing metadata (e.g., no album art) degrades gracefully

---

### Story 3: Search/Filter Songs
**As a** user  
**I want to** search for songs by title or artist  
**So that** I can quickly find specific music in a large catalog

**Acceptance Criteria**:
- Search box is prominently displayed
- Typing filters the song list in real-time (no submit button needed)
- Search matches both title and artist (case-insensitive)
- Clear button empties search and shows full catalog
- Search works smoothly with no lag

---

### Story 4: Visual Playback Indicator
**As a** user  
**I want to** clearly see which song is currently playing  
**So that** I always know the app's current state

**Acceptance Criteria**:
- Currently playing song is visually distinct (highlighted, icon, animation)
- Paused state is visually different from playing state
- Song progress indicator shows elapsed/total time
- Visual feedback is immediate when state changes

---

## Technical Requirements

### Tech Stack
- **Same as Phase 1**: Vanilla JS, HTML5, CSS3
- **New**: JSON for data storage
- **New**: Fetch API for loading catalog

### File Structure
```
src/
├── index.html
├── styles.css
├── app.js
├── catalog.json              # NEW: Song catalog
└── images/                   # NEW: Album art (optional)
    ├── album1.jpg
    └── album2.jpg
```

### Data Model

**catalog.json structure**:
```json
{
  "version": "1.0",
  "songs": [
    {
      "id": "song-001",
      "title": "Example Song 1",
      "artist": "Artist Name",
      "url": "https://example.com/song1.mp3",
      "duration": 180,
      "albumArt": "./images/album1.jpg",
      "fileSize": 5242880
    },
    {
      "id": "song-002",
      "title": "Another Song",
      "artist": "Different Artist",
      "url": "https://example.com/song2.mp3",
      "duration": 240,
      "albumArt": "./images/album2.jpg",
      "fileSize": 7340032
    }
  ]
}
```

**Required fields**: `id`, `title`, `artist`, `url`  
**Optional fields**: `duration`, `albumArt`, `fileSize`, `album`, `year`, `genre`

### Code Constraints

**Catalog Loading**:
- Use `fetch()` API to load `catalog.json`
- Handle both success and error cases
- Show loading skeleton/spinner during fetch
- Cache catalog in memory after first load (don't refetch on every render)

**Search Implementation**:
- Debounce search input (wait 300ms after user stops typing before filtering)
- Use `Array.filter()` for search logic
- Search should be case-insensitive
- Match partial strings (e.g., "beat" matches "The Beatles")

**Performance**:
- Render songs efficiently (use DocumentFragment or similar)
- Don't re-render entire list on search (hide/show existing elements)
- Lazy load album art images (use `loading="lazy"`)

**Error Handling**:
- Catch fetch errors and display user-friendly message
- Handle malformed JSON gracefully
- Validate required fields exist
- Provide fallback if song URL is invalid

### UI Requirements

**Loading State**:
- Show skeleton loader or spinner while catalog loads
- Skeleton should match the layout of song items
- Don't show empty state or errors prematurely

**Song Card Design**:
```
┌─────────────────────────────────┐
│ [Album Art] Title               │
│             Artist              │
│             Duration  [▶️]       │
└─────────────────────────────────┘
```

**Search Bar**:
- Fixed at top or prominently placed
- Placeholder text: "Search songs or artists..."
- Clear button (X) appears when text is entered
- Focus state is clearly visible

**Playing State Indicators**:
- Option 1: Equalizer animation next to playing song
- Option 2: Different background color for active song
- Option 3: Pulsing play icon
- Choose one that fits the minimalist aesthetic

**Responsive Behavior**:
- Mobile (< 768px): Single column, larger touch targets
- Tablet (768-1024px): Two columns
- Desktop (> 1024px): Three columns or list view with more details

### Performance Targets

- Catalog of 50 songs loads and renders in < 1 second
- Search filters 100+ songs with < 100ms delay
- Album art images don't block rendering (lazy load)
- Smooth scrolling through large catalogs (no jank)

---

## Out of Scope (Phase 2)

❌ Caching/offline playback (that's Phase 3)  
❌ Playlist creation  
❌ Sorting (by title, artist, duration)  
❌ Multiple catalog sources  
❌ User-uploaded songs  
❌ Sharing songs  
❌ Song ratings/favorites  

---

## Success Criteria

### Functional
- [ ] Catalog loads from JSON on page load
- [ ] All songs from catalog display correctly
- [ ] Search filters songs by title and artist
- [ ] Playing song is visually distinct
- [ ] Album art displays (when provided)
- [ ] Error message appears if catalog fails to load

### Technical
- [ ] Fetch request completes in < 2 seconds on 3G
- [ ] Search responds within 100ms
- [ ] No JavaScript errors with valid or invalid JSON
- [ ] Works with 5 songs or 100 songs equally well
- [ ] Album art lazy loads (doesn't block page render)

### User Experience
- [ ] Loading state provides feedback (no blank screen)
- [ ] Search feels instant (no perceivable lag)
- [ ] Currently playing song is obvious at a glance
- [ ] Interface remains clean and minimalist
- [ ] Works great on mobile and desktop

---

## Implementation Notes for AI

### Catalog Loading Pattern

```javascript
// app.js

let catalogData = null;

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
    renderSongList(catalogData.songs);
    hideLoadingState();
    
  } catch (error) {
    console.error('Failed to load catalog:', error);
    showErrorState('Unable to load song catalog. Please try again later.');
  }
}

function showLoadingState() {
  const container = document.getElementById('song-list');
  container.innerHTML = `
    <div class="loading-skeleton">
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
    </div>
  `;
}

function hideLoadingState() {
  // Clear loading skeleton
}

function showErrorState(message) {
  const container = document.getElementById('song-list');
  container.innerHTML = `
    <div class="error-message">
      <p>${message}</p>
      <button onclick="loadCatalog()">Retry</button>
    </div>
  `;
}
```

### Search Implementation

```javascript
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

// Search handler
const searchInput = document.getElementById('search-input');
const debouncedSearch = debounce((query) => {
  filterSongs(query);
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

function filterSongs(query) {
  if (!catalogData) return;
  
  const lowerQuery = query.toLowerCase().trim();
  
  if (lowerQuery === '') {
    // Show all songs
    renderSongList(catalogData.songs);
    return;
  }
  
  const filtered = catalogData.songs.filter(song => {
    const titleMatch = song.title.toLowerCase().includes(lowerQuery);
    const artistMatch = song.artist.toLowerCase().includes(lowerQuery);
    return titleMatch || artistMatch;
  });
  
  renderSongList(filtered);
  
  // Show "no results" if needed
  if (filtered.length === 0) {
    showNoResultsMessage(query);
  }
}

function showNoResultsMessage(query) {
  const container = document.getElementById('song-list');
  container.innerHTML = `
    <div class="no-results">
      <p>No songs found for "${query}"</p>
      <button onclick="clearSearch()">Clear search</button>
    </div>
  `;
}

function clearSearch() {
  searchInput.value = '';
  filterSongs('');
}
```

### Song Card Rendering

```javascript
function renderSongList(songs) {
  const container = document.getElementById('song-list');
  container.innerHTML = ''; // Clear existing
  
  const fragment = document.createDocumentFragment();
  
  songs.forEach((song, index) => {
    const songCard = createSongCard(song, index);
    fragment.appendChild(songCard);
  });
  
  container.appendChild(fragment);
}

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
  playBtn.addEventListener('click', () => playSong(index));
  
  return card;
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

### Playing State Management

```javascript
function updatePlayingState(index) {
  // Remove 'playing' class from all cards
  document.querySelectorAll('.song-card').forEach(card => {
    card.classList.remove('playing');
  });
  
  // Add 'playing' class to current card
  const currentCard = document.querySelector(`[data-song-id="${songs[index].id}"]`);
  if (currentCard) {
    currentCard.classList.add('playing');
  }
  
  // Update play button icon
  updatePlayButtonIcons();
}

function updatePlayButtonIcons() {
  document.querySelectorAll('.play-btn').forEach((btn, index) => {
    const icon = btn.querySelector('.play-icon');
    if (index === currentSongIndex && isPlaying) {
      icon.textContent = '⏸️'; // Pause icon
    } else {
      icon.textContent = '▶️'; // Play icon
    }
  });
}
```

### CSS for Loading Skeleton

```css
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
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Playing state indicator */
.song-card.playing {
  background-color: #f0f9ff;
  border-left: 4px solid #3b82f6;
}

.song-card.playing::after {
  content: '🔊';
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.2rem;
}
```

---

## Sample catalog.json

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

**Note**: These are sample Bensound URLs. Check their license requirements. You may need attribution.

---

## Edge Cases to Handle

1. **Empty Catalog**:
   - Show message: "No songs available yet. Check back soon!"
   - Don't show error state (it's not an error)

2. **Malformed JSON**:
   - Catch parse error
   - Show user-friendly message
   - Provide retry button

3. **Missing Required Fields**:
   - Validate each song has `id`, `title`, `artist`, `url`
   - Skip invalid songs with console warning
   - Don't crash the entire app

4. **Large Catalogs (100+ songs)**:
   - Consider virtualization for very large lists (future enhancement)
   - For now, ensure search works smoothly
   - Lazy load images to avoid memory issues

5. **Network Timeout**:
   - Set reasonable timeout (5 seconds)
   - Show retry option
   - Cache last successful load (future enhancement)

6. **Search Edge Cases**:
   - Empty search shows all songs
   - Special characters in search (', ", &) don't break
   - Unicode characters in song titles work correctly

---

## Testing Checklist

Before considering Phase 2 complete:

**Catalog Loading**:
- [ ] Catalog loads successfully from JSON
- [ ] Loading skeleton displays during fetch
- [ ] Error message appears if fetch fails
- [ ] Retry button re-attempts fetch

**Display**:
- [ ] All songs render correctly
- [ ] Album art displays (when provided)
- [ ] Missing album art shows placeholder
- [ ] Song metadata (title, artist, duration) is readable

**Search**:
- [ ] Search filters by title
- [ ] Search filters by artist
- [ ] Search is case-insensitive
- [ ] Clear button resets search
- [ ] "No results" message shows when appropriate

**Playback Integration**:
- [ ] Clicking a song from catalog plays it
- [ ] Currently playing song is highlighted
- [ ] Play/pause button updates correctly
- [ ] Next/previous work with filtered results

**Performance**:
- [ ] Catalog of 50 songs loads in < 2 seconds
- [ ] Search feels instant (< 100ms)
- [ ] No layout shift when images load
- [ ] Smooth scrolling with many songs

**Responsive**:
- [ ] Works on mobile (375px)
- [ ] Works on tablet (768px)
- [ ] Works on desktop (1440px+)
- [ ] Touch targets are adequate (44px minimum)

---

## Migration from Phase 1

Since Phase 1 had hardcoded songs, you'll need to:

1. **Remove hardcoded song array** from app.js
2. **Add catalog loading** on page load
3. **Update renderSongList()** to work with dynamic data
4. **Test backward compatibility** - ensure all Phase 1 features still work

**Suggested approach**:
```javascript
// Phase 1 (remove this):
const songs = [
  { id: 1, title: "Song 1", ... },
  // ...
];

// Phase 2 (add this):
let songs = []; // Will be populated from catalog

async function init() {
  await loadCatalog();
  // Continue with Phase 1 initialization
  renderSongList(songs);
  attachEventListeners();
}

document.addEventListener('DOMContentLoaded', init);
```

---

## Next Phase Preview

**Phase 3** will add:
- Service Worker for offline functionality
- IndexedDB for caching songs
- Cache management UI
- Download progress indicators
- Full offline playback

But first, get that dynamic catalog working! 📂
