# Phase 1: Static Music Player Foundation

**Branch**: `001-phase1-foundation`
**Duration**: 1-2 days
**Goal**: Create a minimal, working web-based music player that plays 3 hardcoded songs

---

## User Stories

### Story 1: View Available Songs
**As a** user  
**I want to** see a list of available songs with their titles and artists  
**So that** I know what music is available to play

**Acceptance Criteria**:
- Page displays exactly 3 songs
- Each song shows: title, artist name
- List is visible immediately on page load
- Layout works on mobile (320px width) and desktop (1920px width)

---

### Story 2: Play a Song
**As a** user  
**I want to** click on a song to start playing it  
**So that** I can listen to music

**Acceptance Criteria**:
- Clicking any song starts audio playback within 1 second
- Only one song plays at a time (clicking a new song stops the current one)
- Audio plays through device speakers/headphones
- Visual feedback shows which song is currently playing

---

### Story 3: Control Playback
**As a** user  
**I want to** pause and resume the currently playing song  
**So that** I can control when I listen

**Acceptance Criteria**:
- Play/Pause button is visible when a song is playing
- Clicking pause stops audio immediately
- Clicking play resumes from where it paused
- Button icon/text changes to reflect current state (play vs pause)

---

### Story 4: Navigate Between Songs
**As a** user  
**I want to** skip to the next or previous song  
**So that** I can navigate the playlist without clicking each song manually

**Acceptance Criteria**:
- "Next" button skips to the following song in the list
- "Previous" button goes back to the prior song
- At the last song, "Next" loops to the first song
- At the first song, "Previous" loops to the last song
- Skipping automatically starts playing the new song

---

## Technical Requirements

### Tech Stack
- **HTML5**: Semantic markup, audio element
- **CSS3**: Flexbox/Grid for layout, CSS variables for theming
- **Vanilla JavaScript**: ES6+ (no frameworks, no build tools)
- **Web Audio API**: For playback control

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile: iOS Safari 14+, Chrome Mobile 90+

### File Structure
```
src/
├── index.html          # Main page
├── styles.css          # All styles
├── app.js              # Playback logic
└── songs/              # Audio files (or use external URLs)
    ├── song1.mp3
    ├── song2.mp3
    └── song3.mp3
```

### Data Model
```javascript
// Hardcoded in app.js
const songs = [
  {
    id: 1,
    title: "Example Song 1",
    artist: "Artist Name",
    url: "./songs/song1.mp3"  // or external URL
  },
  {
    id: 2,
    title: "Example Song 2",
    artist: "Another Artist",
    url: "./songs/song2.mp3"
  },
  {
    id: 3,
    title: "Example Song 3",
    artist: "Third Artist",
    url: "./songs/song3.mp3"
  }
];
```

### Code Constraints
- Use `const` and `let` (no `var`)
- Use arrow functions where appropriate
- Use template literals for dynamic HTML
- Add event listeners via `addEventListener` (no inline `onclick`)
- Store audio element reference in a variable
- Use CSS classes for state changes (e.g., `.playing`, `.paused`)

### UI Requirements
- **Mobile-first**: Design for 375px width first, then scale up
- **Responsive**: Single-column on mobile, flexible on desktop
- **Accessible**: 
  - Buttons have clear labels
  - Focus states visible
  - Color contrast ratio ≥ 4.5:1
- **Minimalist**: 
  - White/light background
  - Single accent color
  - Clean typography (system fonts OK)
  - Generous whitespace

### Performance
- Page loads in <3 seconds on 3G connection
- No layout shift on load
- Smooth animations (60fps)

---

## Out of Scope (Phase 1)

❌ Song caching/offline playback  
❌ Service Workers or PWA features  
❌ Volume control  
❌ Seek/scrub within a song  
❌ Playlist management  
❌ Visualizer  
❌ Dynamic catalog loading  
❌ User preferences/settings  

(These come in later phases)

---

## Success Criteria

### Functional
- [ ] 3 songs display on page load
- [ ] Clicking a song plays audio
- [ ] Play/pause button works correctly
- [ ] Next/previous buttons cycle through songs
- [ ] Only one song plays at a time

### Technical
- [ ] No JavaScript errors in console
- [ ] No CSS layout issues on mobile (375px) or desktop (1440px)
- [ ] Page validates as HTML5
- [ ] Works in Chrome, Firefox, Safari

### User Experience
- [ ] User can complete "browse → play → pause → next" flow in <10 seconds
- [ ] Visual feedback is clear (user knows what's playing)
- [ ] Interface feels responsive (no laggy interactions)

---

## Sample Audio Files

You can use these public domain/CC0 songs for testing:

1. **Bensound - Ukulele**  
   URL: `https://www.bensound.com/bensound-music/bensound-ukulele.mp3`  
   (Check license, may require attribution)

2. **Free Music Archive** (CC0 tracks)  
   URL: https://freemusicarchive.org/  
   Filter by CC0 license

3. **Incompetech** (Royalty-free with attribution)  
   URL: https://incompetech.com/music/royalty-free/

Or use any MP3 files you own.

---

## Implementation Notes for AI

**Suggested HTML structure**:
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
      <!-- Song list here -->
      <div id="song-list"></div>
      
      <!-- Playback controls here -->
      <div id="player-controls">
        <button id="prev-btn">Previous</button>
        <button id="play-pause-btn">Play</button>
        <button id="next-btn">Next</button>
      </div>
    </main>
  </div>
  
  <script src="app.js"></script>
</body>
</html>
```

**Suggested JS structure**:
```javascript
// State
let currentSongIndex = 0;
let isPlaying = false;
const audioElement = new Audio();

// Data
const songs = [ /* ... */ ];

// Functions
function renderSongList() { /* ... */ }
function playSong(index) { /* ... */ }
function togglePlayPause() { /* ... */ }
function nextSong() { /* ... */ }
function previousSong() { /* ... */ }

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  renderSongList();
  // Attach button listeners
});
```

**Suggested CSS approach**:
- Use CSS Grid for overall layout
- Use Flexbox for controls
- Mobile breakpoint: `@media (min-width: 768px)`
- CSS variables for colors/spacing

---

## Deliverables

1. `index.html` - Semantic markup
2. `styles.css` - Responsive styling
3. `app.js` - Playback logic
4. `README.md` - How to run (just open index.html)
5. Optional: 3 sample MP3 files in `songs/` folder

---

## Testing Checklist

Before considering Phase 1 complete:

- [ ] Open `index.html` in Chrome - works?
- [ ] Open in Firefox - works?
- [ ] Open in Safari (or iOS Safari) - works?
- [ ] Resize browser to 375px width - layout OK?
- [ ] Click each song - plays correctly?
- [ ] Pause works?
- [ ] Next/previous cycle through all songs?
- [ ] Clicking new song while one is playing - old song stops?
- [ ] No console errors?

---

## Next Phase Preview

**Phase 2** will add:
- Load songs from `catalog.json` instead of hardcoding
- Search/filter functionality
- Album art display
- Improved UI polish

But that's later. For now, just get these 3 songs playing! 🎵
