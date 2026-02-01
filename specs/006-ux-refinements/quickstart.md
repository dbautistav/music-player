# Quickstart Guide: UX Refinements

**Feature**: UX Refinements - Layout Reorganization and Content Expansion
**Branch**: `006-ux-refinements`
**Estimated Time**: 15-20 minutes

## Prerequisites

- Git repository cloned
- Node.js LTS 20.x or 22.x (for dev server, optional)
- Modern browser (Chrome/Edge 90+, Firefox 88+, Safari 14+)
- 5 audio files already present in `src/songs/` (a1.mp3 through a5.mp3)

## Quick Setup (5 minutes)

### 1. Verify Branch

```bash
git branch
# Should show * 006-ux-refinements
```

### 2. Verify Audio Files

```bash
ls -lh src/songs/a*.mp3
# Should show 5 files (a1.mp3 through a5.mp3)
```

If files are missing, copy them from the source location:
```bash
cp /path/to/source/a*.mp3 src/songs/
```

### 3. Start Dev Server

Option 1: Python (recommended)
```bash
cd src
python -m http.server 8000
```

Option 2: Node.js http-server
```bash
npx http-server src -p 8000
```

Option 3: Live Server (VS Code extension)
- Install "Live Server" extension
- Right-click on `src/index.html`
- Select "Open with Live Server"

### 4. Open Application

Open browser to: `http://localhost:8000`

## Verification Checklist

### New Ambient Songs (Priority 1)

- [ ] 5 new songs appear in the song list:
  - [ ] Waterfall in a forest
  - [ ] Thunderstorm & Rain
  - [ ] Cafe Music
  - [ ] Brown Noise
  - [ ] Rainy Day
- [ ] All 5 songs display "Ambient Sounds" as artist
- [ ] All 5 songs display "∞" (infinity symbol) for duration
- [ ] All 5 songs display "♫" (Unicode musical note) as icon
- [ ] Clicking any ambient song plays it
- [ ] Ambient songs work with search (search for "waterfall", "rain", etc.)
- [ ] Ambient songs persist after page refresh

### Playback Controls Positioning (Priority 2)

- [ ] Playback controls (Previous, Play/Pause, Next) appear at bottom of screen
- [ ] Controls remain visible while scrolling through song list (sticky positioning)
- [ ] Play/Pause button toggles between "Play" and "Pause" states
- [ ] Previous/Next buttons navigate between songs correctly
- [ ] Controls update to show current song when selecting from list

### Cache Management Positioning (Priority 3)

- [ ] Storage usage bar appears at very bottom of page (scroll down to see)
- [ ] "Clear All Cached Songs" button appears at bottom of page
- [ ] Storage bar shows current usage and quota accurately
- [ ] Clear cache button removes all cached songs and updates storage bar to 0

### Update Banner Fix (Priority 3)

- [ ] "New version available" banner is hidden by default on page load
- [ ] Banner only appears when Service Worker detects new version
- [ ] Tapping refresh button reloads the page
- [ ] Banner disappears after reload (no false positives)

## Manual Testing Steps

### Test 1: Ambient Song Playback

1. Load application
2. Scroll to find "Waterfall in a forest"
3. Verify duration shows "∞"
4. Verify artist shows "Ambient Sounds"
5. Verify icon shows "♫"
6. Click to play
7. Verify audio starts within 1 second
8. Verify play/pause button updates to "Pause"
9. Pause, then resume
10. Verify audio continues correctly

**Expected**: All 5 ambient songs play correctly with proper metadata display.

### Test 2: Sticky Playback Controls

1. Load application
2. Scroll to bottom of song list
3. Verify playback controls remain visible at bottom
4. Click play/pause button while scrolled
5. Verify button works correctly
6. Scroll back to top
7. Verify controls still at bottom

**Expected**: Controls stay visible at bottom regardless of scroll position.

### Test 3: Search Ambient Songs

1. Load application
2. Type "rain" in search box
3. Verify results show "Rainy Day" and "Thunderstorm & Rain"
4. Verify "∞" symbol displays correctly in search results
5. Clear search
6. Type "waterfall"
7. Verify results show "Waterfall in a forest"

**Expected**: Search filters ambient songs correctly.

### Test 4: Cache Management at Bottom

1. Load application
2. Play a few songs (to cache them)
3. Scroll to very bottom of page
4. Verify storage bar shows usage
5. Verify clear cache button visible
6. Click clear cache button
7. Verify storage bar updates to 0

**Expected**: Cache management works correctly from bottom position.

### Test 5: Update Banner Behavior

1. Open browser DevTools (F12)
2. Go to Application tab → Service Workers
3. Check "Update on reload" (to simulate new version)
4. Reload page
5. Verify "New version available" banner appears
6. Click refresh button
7. Verify page reloads and banner is hidden

**Expected**: Banner only appears when update is detected, not unconditionally.

## Browser Testing Matrix

Test in each browser and mark pass/fail:

| Browser | New Songs | Sticky Controls | Cache Management | Update Banner | Overall |
|---------|-----------|-----------------|------------------|----------------|---------|
| Chrome 90+ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Firefox 88+ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Safari 14+ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Edge 90+ | ☐ | ☐ | ☐ | ☐ | ☐ |

## Common Issues & Solutions

### Issue: Ambient songs don't play

**Possible causes**:
- Audio files not found (check console for 404 errors)
- File paths incorrect in catalog.json
- Audio files corrupted

**Solution**:
```bash
# Verify files exist
ls -lh src/songs/a*.mp3

# Check catalog.json URLs
cat src/catalog.json | grep "url"
```

### Issue: Sticky controls not working

**Possible causes**:
- CSS not loaded
- Sticky positioning not supported (unlikely in modern browsers)
- Z-index conflict

**Solution**:
```bash
# Check CSS is loaded
curl http://localhost:8000/styles.css | head

# Verify sticky rule present
grep -n "position: sticky" src/styles.css
```

### Issue: Update banner always visible

**Possible causes**:
- Banner HTML doesn't have `hidden` attribute by default
- Service Worker update logic not checking before showing

**Solution**:
```bash
# Check banner HTML
grep -A 2 'update-banner' src/index.html

# Should show: <div id="update-banner" ... hidden>
```

### Issue: Storage bar at wrong position

**Possible causes**:
- HTML order not updated
- Previous implementation had sticky positioning

**Solution**:
- Verify storage-info and cache-management sections are at end of `<main>` in index.html

## Performance Verification

### Load Performance

1. Open DevTools → Network tab
2. Refresh page (Cmd+R / Ctrl+R)
3. Check initial load time (including catalog.json)

**Expected**: Page loads in <3 seconds on 3G connection

### Scroll Performance

1. Load application with ~100 songs
2. Open DevTools → Performance tab
3. Scroll through song list
4. Check for dropped frames

**Expected**: Smooth 60fps scrolling, no jank

### Playback Latency

1. Open DevTools → Performance tab
2. Click play on ambient song
3. Check time to audio start

**Expected**: Audio starts in <1 second from click

## Accessibility Testing

### Keyboard Navigation

1. Tab through page elements
2. Verify all interactive elements are reachable
3. Verify focus indicators are visible
4. Test play/pause with Enter key

**Expected**: All features accessible via keyboard

### Screen Reader

1. Enable screen reader (VoiceOver on macOS, NVDA on Windows)
2. Navigate through song list
3. Verify song titles and icons are announced
4. Test playback controls

**Expected**: All features usable with screen reader

### Color Contrast

1. Check text contrast on background
2. Verify icons are visible
3. Test in dark mode if applicable

**Expected**: WCAG 2.1 AA compliance (4.5:1 contrast ratio)

## Code Review Checklist

Before submitting for review:

- [ ] All 5 ambient songs added to catalog.json with correct metadata
- [ ] index.html updated with new UI element positions
- [ ] styles.css includes sticky positioning for playback controls
- [ ] app.js handles isAmbient flag and displays "∞" for duration
- [ ] sw.js and app.js fix update banner visibility
- [ ] No console errors on page load
- [ ] No console errors during playback
- [ ] Manual testing completed in at least 2 browsers
- [ ] Performance targets met (load <3s, playback <1s, 60fps)
- [ ] Accessibility verified (keyboard, screen reader)

## Next Steps

After successful testing:

1. Run final cross-browser checks (Chrome, Firefox, Safari)
2. Verify Service Worker updates work correctly
3. Test offline mode with cached ambient songs
4. Document any edge cases or limitations
5. Proceed to `/speckit.tasks` to generate implementation tasks

## Support

- Review spec.md for detailed requirements
- Check research.md for technical decisions
- Refer to data-model.md for data structure
- Review constitution.md for project principles
