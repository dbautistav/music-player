# Quickstart Guide: Offline-First PWA Music Player

**Date**: 2025-01-25  
**Prerequisites**: Node.js 18+, npm/pnpm/yarn, Git

## Installation

```bash
# Clone repository
git clone <repository-url>
cd music-player

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Project Structure

```
music-player/
├── src/
│   ├── components/      # React components
│   │   ├── catalog/   # Catalog display
│   │   ├── player/    # Playback controls
│   │   ├── visualizer/ # Audio visualization
│   │   └── common/    # Shared components (skeletons, error banners)
│   ├── services/       # Business logic
│   │   ├── audio/      # Audio playback
│   │   ├── cache/      # Caching operations
│   │   ├── catalog/    # Catalog data
│   │   └── metrics/    # Observability
│   ├── hooks/          # React hooks
│   ├── models/         # TypeScript types
│   ├── utils/          # Utilities
│   ├── workers/         # Service workers
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
├── public/
│   ├── manifest.json    # PWA manifest
│   ├── service-worker.js # Service worker registration
│   └── catalog/         # Initial catalog data
├── tests/
│   ├── unit/            # Unit tests (Vitest)
│   ├── integration/      # Integration tests
│   └── e2e/             # E2E tests (Playwright)
└── package.json
```

---

## Development Workflow

### 1. Running the App

```bash
# Development mode with HMR
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### 2. Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

### 3. Linting & Type Checking

```bash
# Run ESLint
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Run TypeScript type checking
npm run typecheck
```

---

## Adding a New Feature

### Example: Add a "Skip to Next" Button

1. **Create component** (`src/components/player/SkipNextButton.tsx`):

```typescript
import { useAudio } from '../../hooks/useAudio';

export function SkipNextButton() {
  const { nextSong } = useAudio();
  
  return (
    <button onClick={nextSong} aria-label="Skip to next song">
      ⏭
    </button>
  );
}
```

2. **Create hook** (`src/hooks/useAudio.ts`):

```typescript
import { useContext } from 'react';
import { AudioContext } from '../contexts/AudioContext';

export function useAudio() {
  const audioService = useContext(AudioContext);
  
  return {
    play: (song) => audioService.play(song),
    pause: () => audioService.pause(),
    resume: () => audioService.resume(),
    nextSong: () => audioService.next(),
    previousSong: () => audioService.previous(),
    seek: (position) => audioService.seek(position),
    setVolume: (volume) => audioService.setVolume(volume),
    getState: () => audioService.getState(),
  };
}
```

3. **Add tests** (`tests/unit/hooks/useAudio.test.ts`):

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAudio } from '../../../src/hooks/useAudio';
import { AudioProvider } from '../../../src/contexts/AudioContext';

describe('useAudio', () => {
  it('should play song', async () => {
    const mockAudioService = {
      play: vi.fn(),
      // ... other methods
    };
    
    const { result } = renderHook(() => useAudio(), {
      wrapper: ({ children }) => (
        <AudioProvider service={mockAudioService}>
          {children}
        </AudioProvider>
      ),
    });
    
    await result.current.play(testSong);
    expect(mockAudioService.play).toHaveBeenCalledWith(testSong);
  });
});
```

4. **Add to component** (`src/components/player/PlayerControls.tsx`):

```typescript
import { SkipNextButton } from './SkipNextButton';

export function PlayerControls() {
  return (
    <div className="player-controls">
      <SkipPreviousButton />
      <PlayPauseButton />
      <SkipNextButton />
    </div>
  );
}
```

5. **Run tests**:

```bash
npm run test:watch
```

6. **Type check and lint**:

```bash
npm run typecheck
npm run lint
```

---

## Working with Services

### Audio Service

```typescript
import { AudioService } from '../services/audio/AudioService';

const audioService = new AudioService();

// Play a song
await audioService.play(song);

// Pause
const currentPosition = audioService.pause();

// Resume
await audioService.resume();

// Seek
audioService.seek(30); // Seek to 30 seconds

// Set volume
audioService.setVolume(0.5); // 50% volume

// Get state
const state = audioService.getState();
console.log(state.isPlaying, state.currentTime);
```

### Cache Service

```typescript
import { CacheService } from '../services/cache/CacheService';

const cacheService = new CacheService();

// Get cached songs
const cachedSongs = await cacheService.getCachedSongs();

// Cache a song with progress
await cacheService.cacheSong(song, (progress) => {
  console.log(`Progress: ${progress}%`);
});

// Remove from cache
await cacheService.removeSong(song);

// Get cache stats
const stats = await cacheService.getCacheStats();
console.log(`Used: ${stats.totalSize} / ${stats.maxCapacity}`);
```

### Catalog Service

```typescript
import { CatalogService } from '../services/catalog/CatalogService';

const catalogService = new CatalogService();

// Fetch catalog
const catalog = await catalogService.fetchCatalog();

// Search songs
const results = await catalogService.searchCatalog('rock', {
  cacheState: 'cached'
});

// Get song by ID
const song = await catalogService.getSongById('song-id');
```

---

## PWA Development

### Testing Offline Capability

```bash
# Build production version
npm run build

# Serve with static file server
npx serve dist

# Open DevTools, go to Network tab, select "Offline"
# App should still work with cached content
```

### Updating Service Worker

```bash
# Edit public/service-worker.js

# Build and test
npm run build
npm run preview
```

Service worker version automatically increments on build.

### Testing PWA Installability

```bash
# Build production version
npm run build

# Open in Chrome/Edge:
# - Should see install icon in address bar
# - Click "Install" to test PWA installation

# On iOS:
# - Add to Home Screen via Share menu
# - Launch from home screen
# - Should launch as full-screen app
```

---

## Debugging

### Console Logging

```typescript
import { MetricsService } from '../services/metrics/MetricsService';

const metrics = new MetricsService();

// Log error
try {
  await riskyOperation();
} catch (error) {
  metrics.logError(error, { context: 'cache-operation' });
}
```

### Debugging IndexedDB

```bash
# Open Chrome DevTools
# Go to Application tab
# Expand IndexedDB
# Select "MusicPlayerCache"
# Inspect stored songs and data
```

### Debugging Service Worker

```bash
# Open Chrome DevTools
# Go to Application tab
# Expand Service Workers
# Click "inspect" on current service worker
# View console logs and network activity
```

---

## Performance Monitoring

### Lighthouse CI

```bash
# Run Lighthouse locally
npx lighthouse http://localhost:5173 --view

# Check PWA criteria:
# - Progressive Web App: 100
# - Performance: 90+
# - Accessibility: 90+
```

### Performance Metrics

```typescript
import { MetricsService } from '../services/metrics/MetricsService';

const metrics = new MetricsService();

// Track cache operations
metrics.trackAction({
  type: 'cache-start',
  timestamp: new Date(),
  metadata: { songId: song.id, fileSize: song.fileSize }
});

// Get aggregated metrics
const aggregated = await metrics.getMetrics();
console.log(aggregated.actions, aggregated.errors);
```

---

## Common Tasks

### Add New Audio Format Support

1. Update `Song` type in `src/models/Song.ts`
2. Update catalog data in `public/catalog/`
3. Test format support across browsers

### Change Visualizer Style

1. Edit `src/components/visualizer/Visualizer.tsx`
2. Modify Canvas rendering logic
3. Test performance at 60fps

### Add New Error Type

1. Update error codes in `contracts/service-contracts.md`
2. Update error handling in relevant service
3. Add tests for new error scenario

### Deploy to Static Hosting

```bash
# Build
npm run build

# Deploy to Netlify
npx netlify-cli deploy --prod --dir=dist

# Or deploy to Vercel
npx vercel --prod
```

---

## Troubleshooting

### Issue: Songs Not Playing

**Checklist**:
- [ ] Is audioUrl accessible?
- [ ] Is audio format supported by browser?
- [ ] Is volume > 0?
- [ ] Any errors in console?
- [ ] Is AudioContext resumed (browser autoplay policy)?

### Issue: Cache Not Working

**Checklist**:
- [ ] Is IndexedDB quota exceeded?
- [ ] Is Service Worker registered?
- [ ] Check IndexedDB in DevTools
- [ ] Check storage permission in browser settings

### Issue: PWA Not Installable

**Checklist**:
- [ ] Is app served over HTTPS?
- [ ] Is manifest.json valid?
- [ ] Are all icons referenced correctly?
- [ ] Is service worker registered?
- [ ] Does Lighthouse PWA audit pass?

### Issue: Visualizer Not Showing

**Checklist**:
- [ ] Is Web Audio API supported?
- [ ] Is visualizer enabled in preferences?
- [ ] Check console for Web Audio errors
- [ ] Verify Audio element connected to AnalyserNode

---

## Getting Help

- **Documentation**: See `docs/` directory for detailed guides
- **Contracts**: See `specs/001-pwa-music-player/contracts/` for service interfaces
- **Data Model**: See `specs/001-pwa-music-player/data-model.md` for entity definitions
- **Research**: See `specs/001-pwa-music-player/research.md` for technology decisions

---

## Next Steps

1. ✅ Install dependencies (`npm install`)
2. ✅ Start dev server (`npm run dev`)
3. ✅ Explore catalog and play songs
4. ✅ Test caching functionality
5. ✅ Test offline mode
6. ✅ Read service contracts to understand architecture
7. ✅ Start building features!

Happy coding! 🎵
