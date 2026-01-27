# Quickstart Guide: Static Music Player

**Feature**: `004-static-playback`
**Phase**: 1 (Static Playback)
**Time to First Working Feature**: ~2 hours

## Prerequisites

1. **Modern Web Browser**: Chrome 90+, Firefox 88+, Safari 14+, or iOS Safari 14+
2. **Local Web Server**: One of:
   - Python 3: `python -m http.server 8000`
   - Node.js: `npx http-server`
   - VS Code: Live Server extension
3. **Text Editor**: VS Code, Sublime, or similar with syntax highlighting
4. **Browser DevTools**: For debugging (F12 or Cmd+Option+I)

## Project Setup (5 minutes)

### 1. Create Project Structure

```bash
# Navigate to project root
cd /path/to/music-player

# Create src directory
mkdir -p src/songs

# Create files
touch src/index.html
touch src/styles.css
touch src/app.js
```

### 2. Download Sample Audio Files (Optional)

Download 3 royalty-free MP3 files to `src/songs/` directory:

1. **Bensound** (royalty-free with attribution):
   - https://www.bensound.com/royalty-free-music/
   - Recommended: Acoustic Breeze, Sunny, Ukulele

2. **Or use external URLs** directly in code (no download needed)

### 3. Open in Browser

```bash
# Serve the project
python -m http.server 8000

# Open browser
# Navigate to: http://localhost:8000/src/
```

## Implementation Steps

### Step 1: Create HTML Structure (15 minutes)

**File**: `src/index.html`

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
  <div class="container">
    <header>
      <h1>Music Player</h1>
    </header>

    <main>
      <!-- Song list will be rendered here -->
      <div id="song-list"></div>

      <!-- Playback controls -->
      <div id="player-controls">
        <button id="prev-btn" aria-label="Previous song">Previous</button>
        <button id="play-pause-btn" aria-label="Play or pause">Play</button>
        <button id="next-btn" aria-label="Next song">Next</button>
      </div>
    </main>
  </div>

  <script src="app.js"></script>
</body>
</html>
```

**Key Points**:
- Semantic HTML (`header`, `main`, `button`)
- Meta viewport for mobile responsiveness
- ARIA labels for accessibility
- No inline JavaScript or CSS

### Step 2: Create CSS Styling (30 minutes)

**File**: `src/styles.css`

```css
/* Reset and base styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.5;
  color: #333;
  background-color: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

header {
  text-align: center;
  padding: 2rem 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  font-weight: 600;
}

/* Song list styling */
#song-list {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.song-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.song-card:hover {
  background-color: #e0e0e0;
}

.song-card.playing {
  background-color: #e3f2fd;
  color: #fff;
}

.song-info {
  display: flex;
  flex-direction: column;
}

.song-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.song-artist {
  font-size: 0.875rem;
  opacity: 0.8;
}

/* Player controls */
#player-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 0;
  border-top: 1px solid #e0e0e0;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  background-color: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 44px;
  min-height: 44px;
}

button:hover {
  background-color: #1565c0;
}

button:active {
  transform: scale(0.98);
}

/* Responsive design */
@media (min-width: 768px) {
  #song-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  #song-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Key Points**:
- Mobile-first design (single column on mobile)
- CSS Grid for song list, Flexbox for controls
- Minimum 44x44px touch targets for accessibility
- Responsive breakpoints at 768px and 1024px
- CSS transitions for smooth interactions

### Step 3: Implement JavaScript Logic (60 minutes)

**File**: `src/app.js`

```javascript
// State variables (Phase 1-2: Simple global state)
let currentSongIndex = 0;
let isPlaying = false;
const audioElement = new Audio();

// Hardcoded songs array (Phase 1)
const songs = [
  {
    id: 1,
    title: "Acoustic Breeze",
    artist: "Benjamin Tissot",
    url: "./songs/song1.mp3",
    duration: 157
  },
  {
    id: 2,
    title: "Sunny",
    artist: "Benjamin Tissot",
    url: "./songs/song2.mp3",
    duration: 142
  },
  {
    id: 3,
    title: "Ukulele",
    artist: "Benjamin Tissot",
    url: "./songs/song3.mp3",
    duration: 146
  }
];

// Render song list
function renderSongList() {
  const container = document.getElementById('song-list');
  container.innerHTML = '';

  songs.forEach((song, index) => {
    const songCard = document.createElement('div');
    songCard.className = 'song-card';
    songCard.dataset.songId = song.id;

    if (index === currentSongIndex && isPlaying) {
      songCard.classList.add('playing');
    }

    const duration = song.duration
      ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}`
      : '';

    songCard.innerHTML = `
      <div class="song-info">
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist}${duration ? ` • ${duration}` : ''}</div>
      </div>
    `;

    songCard.addEventListener('click', () => playSong(index));
    container.appendChild(songCard);
  });
}

// Play song
function playSong(index) {
  currentSongIndex = index;
  const song = songs[index];

  try {
    audioElement.src = song.url;
    audioElement.play();
    isPlaying = true;
    updatePlayButton();
    renderSongList();
  } catch (error) {
    console.error('Failed to play song:', error);
    showErrorState('Unable to play song. Please try again.');
  }
}

// Toggle play/pause
function togglePlayPause() {
  if (isPlaying) {
    pauseSong();
  } else {
    resumeSong();
  }
}

// Pause song
function pauseSong() {
  audioElement.pause();
  isPlaying = false;
  updatePlayButton();
  renderSongList();
}

// Resume song
function resumeSong() {
  audioElement.play();
  isPlaying = true;
  updatePlayButton();
  renderSongList();
}

// Next song
function nextSong() {
  const nextIndex = (currentSongIndex + 1) % songs.length;
  playSong(nextIndex);
}

// Previous song
function previousSong() {
  const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  playSong(prevIndex);
}

// Update play/pause button
function updatePlayButton() {
  const button = document.getElementById('play-pause-btn');
  if (isPlaying) {
    button.textContent = 'Pause';
  } else {
    button.textContent = 'Play';
  }
}

// Show error state
function showErrorState(message) {
  const container = document.getElementById('song-list');
  container.innerHTML = `
    <div style="padding: 2rem; text-align: center; color: #d32f2f;">
      <p style="font-size: 1.25rem; margin-bottom: 1rem;">⚠️ Error</p>
      <p>${message}</p>
      <button onclick="location.reload()" style="margin-top: 1rem;">Retry</button>
    </div>
  `;
}

// Initialize app
function init() {
  renderSongList();
  updatePlayButton();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  init();

  document.getElementById('play-pause-btn').addEventListener('click', togglePlayPause);
  document.getElementById('next-btn').addEventListener('click', nextSong);
  document.getElementById('prev-btn').addEventListener('click', previousSong);

  // Handle audio errors
  audioElement.addEventListener('error', (e) => {
    console.error('Audio error:', e);
    showErrorState('Failed to load audio file. Check if URL is accessible.');
  });

  // Handle audio end
  audioElement.addEventListener('ended', () => {
    isPlaying = false;
    updatePlayButton();
    renderSongList();
  });
});
```

**Key Points**:
- const/let (no var), arrow functions, template literals
- addEventListener (no inline onclick)
- CSS classes for state changes (`.playing`)
- Error handling with try-catch
- User-friendly error messages

### Step 4: Replace Sample URLs (10 minutes)

If using external URLs instead of local files:

```javascript
// Replace urls in songs array with actual URLs
const songs = [
  {
    id: 1,
    title: "Acoustic Breeze",
    artist: "Benjamin Tissot",
    url: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3",
    duration: 157
  },
  // ... etc
];
```

### Step 5: Test and Debug (15 minutes)

**Open DevTools** (F12 or Cmd+Option+I):

1. **Check Console**:
   - No red errors
   - Audio loading success
   - Event listeners attached

2. **Test Playback**:
   - Click a song → plays within 1 second
   - Play/pause button toggles correctly
   - Next/previous buttons cycle through songs

3. **Test Responsive**:
   - Resize browser to 375px (mobile)
   - Resize to 768px (tablet)
   - Resize to 1920px (desktop)

4. **Test Accessibility**:
   - Tab through controls
   - Use screen reader (VoiceOver/NVDA)
   - Check color contrast

**Common Issues and Fixes**:

| Issue | Solution |
|-------|----------|
| Songs don't play | Check browser console for CORS errors, use HTTPS or localhost |
| Audio not loading | Verify URL is accessible, check network tab in DevTools |
| Layout broken on mobile | Verify viewport meta tag in HTML, check CSS media queries |
| Can't click buttons | Check z-index, ensure no overlay elements |

## Validation Checklist

Before marking Phase 1 complete:

### Functional
- [ ] 3 songs display on page load
- [ ] Clicking a song plays audio
- [ ] Play/pause button works correctly
- [ ] Next/previous buttons cycle through songs
- [ ] Only one song plays at a time
- [ ] Visual feedback shows currently playing song

### Technical
- [ ] No JavaScript errors in console
- [ ] No CSS layout issues on mobile (375px) or desktop (1920px)
- [ ] Page validates as HTML5 (W3C validator)
- [ ] Works in Chrome, Firefox, Safari

### Performance
- [ ] Page loads in <3 seconds
- [ ] Playback starts <1 second after click
- [ ] Smooth animations (60fps)

### Accessibility
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] Color contrast ≥4.5:1
- [ ] Touch targets ≥44x44px

## Next Steps

### After Phase 1 Completion

1. **Commit Changes**:
   ```bash
   git add .
   git commit -m "feat: implement static music player with 3 songs"
   ```

2. **Merge to Main**:
   ```bash
   git checkout main
   git merge 004-static-playback
   ```

3. **Proceed to Phase 2**: Dynamic catalog from JSON, search functionality
   - Feature: `002-phase2-dynamic-catalog`
   - Load songs from `catalog.json`
   - Implement search with debounce
   - Add album art display

## Troubleshooting

### Audio Won't Play

**Symptoms**: No sound, console shows "ERR_CONNECTION_REFUSED" or similar

**Solutions**:
1. Use HTTPS or localhost (browsers block mixed content)
2. Check if URL is accessible in separate tab
3. Verify audio file format (MP3, WAV, OGG supported)
4. Check browser audio permissions (system settings)

### Page Won't Load

**Symptoms**: Blank page, 404 errors

**Solutions**:
1. Verify web server is running (`python -m http.server 8000`)
2. Check file paths in HTML (`<link>`, `<script>` tags)
3. Ensure you're accessing correct URL (`http://localhost:8000/src/`)

### Styles Not Applying

**Symptoms**: Unstyled page, default browser styles

**Solutions**:
1. Check CSS file path matches HTML link
2. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
3. Verify CSS syntax (no missing braces or semicolons)

## Additional Resources

### Documentation

- [MDN Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)
- [MDN CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Constitution Reference

- Constitution: Section "Technology Stack" - Zero dependencies
- Constitution: Section "Performance Standards" - <1s playback latency
- Constitution: Section "Code Style" - 2-space indentation, semicolons required
- Constitution: Section "UI/UX Principles" - Mobile-first, accessible

### Project Context

- Feature Spec: [spec.md](./spec.md)
- Data Model: [data-model.md](./data-model.md)
- Research: [research.md](./research.md)
- Implementation Plan: [plan.md](./plan.md)

## Estimated Timeline

| Task | Time | Cumulative |
|------|------|------------|
| Create project structure | 5 min | 5 min |
| Write HTML | 15 min | 20 min |
| Write CSS | 30 min | 50 min |
| Write JavaScript | 60 min | 1h 50min |
| Replace sample URLs | 10 min | 2h |
| Test and debug | 15 min | 2h 15min |

**Total Estimated Time**: ~2 hours

## Support

If you encounter issues not covered in this guide:

1. Check browser console for specific error messages
2. Verify constitution compliance (no dependencies, vanilla JS only)
3. Review functional requirements in spec.md
4. Test with sample URLs provided in research.md

Happy coding! 🎵
