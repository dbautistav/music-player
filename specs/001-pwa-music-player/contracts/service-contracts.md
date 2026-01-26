# Service Contracts: Offline-First PWA Music Player

**Date**: 2025-01-25  
**Purpose**: Define internal service interfaces and contracts for TypeScript types

## Audio Service Contract

```typescript
/**
 * Audio Service - Manages audio playback operations
 */
interface IAudioService {
  /**
   * Load and play a song
   * @param song - Song to play
   * @returns Promise that resolves when playback starts
   */
  play(song: Song): Promise<void>;
  
  /**
   * Pause current playback
   * @returns Current playback position in seconds
   */
  pause(): number;
  
  /**
   * Resume paused playback
   * @returns Promise that resolves when playback resumes
   */
  resume(): Promise<void>;
  
  /**
   * Skip to next song in queue
   * @returns Next song if available, null otherwise
   */
  next(): Song | null;
  
  /**
   * Skip to previous song in queue
   * @returns Previous song if available, null otherwise
   */
  previous(): Song | null;
  
  /**
   * Seek to specific position in current song
   * @param position - Position in seconds
   */
  seek(position: number): void;
  
  /**
   * Set volume
   * @param volume - Volume level (0.0 to 1.0)
   */
  setVolume(volume: number): void;
  
  /**
   * Get current playback state
   */
  getState(): PlaybackState;
}

interface PlaybackState {
  isPlaying: boolean;
  currentSong: Song | null;
  currentTime: number;
  duration: number;
  volume: number;
}

/**
 * Audio Service Events
 */
type AudioServiceEvent = 
  | { type: 'playback-started'; song: Song }
  | { type: 'playback-paused'; song: Song; position: number }
  | { type: 'playback-ended'; song: Song }
  | { type: 'error'; error: AudioError; song?: Song };

interface AudioError {
  code: 'network' | 'decode' | 'not-found' | 'other';
  message: string;
}
```

---

## Cache Service Contract

```typescript
/**
 * Cache Service - Manages offline song storage
 */
interface ICacheService {
  /**
   * Get all cached songs
   */
  getCachedSongs(): Promise<Song[]>;
  
  /**
   * Get song by URL
   */
  getSongByUrl(url: string): Promise<Song | undefined>;
  
  /**
   * Start caching a song
   * @param song - Song to cache
   * @param onProgress - Callback for download progress (0-100)
   * @returns Promise that resolves when caching completes or rejects on error
   */
  cacheSong(song: Song, onProgress?: (progress: number) => void): Promise<void>;
  
  /**
   * Remove song from cache
   */
  removeSong(song: Song): Promise<void>;
  
  /**
   * Remove multiple songs from cache
   */
  removeSongs(songs: Song[]): Promise<void>;
  
  /**
   * Get cache statistics
   */
  getCacheStats(): Promise<CacheStats>;
  
  /**
   * Clear all cached songs
   */
  clearCache(): Promise<void>;
}

interface CacheStats {
  totalSize: number;        // Total bytes used
  maxCapacity: number;      // Maximum bytes available
  songCount: number;        // Number of cached songs
  availableSpace: number;    // Available bytes
}

/**
 * Cache Service Events
 */
type CacheServiceEvent = 
  | { type: 'cache-started'; song: Song }
  | { type: 'cache-progress'; song: Song; progress: number }
  | { type: 'cache-completed'; song: Song; size: number }
  | { type: 'cache-failed'; song: Song; error: CacheError }
  | { type: 'cache-removed'; song: Song; freedSpace: number };

interface CacheError {
  code: 'network' | 'storage-full' | 'quota-exceeded' | 'other';
  message: string;
}
```

---

## Catalog Service Contract

```typescript
/**
 * Catalog Service - Manages song catalog data
 */
interface ICatalogService {
  /**
   * Fetch catalog from external source
   * @param forceRefresh - Force fetch even if cached version exists
   * @returns Catalog data
   */
  fetchCatalog(forceRefresh?: boolean): Promise<Catalog>;
  
  /**
   * Get cached catalog
   */
  getCachedCatalog(): Promise<Catalog | null>;
  
  /**
   * Search catalog by query
   * @param query - Search string
   * @param filters - Optional filters (artist, cache status, etc.)
   * @returns Matching songs
   */
  searchCatalog(query: string, filters?: CatalogFilters): Promise<Song[]>;
  
  /**
   * Get song by ID
   */
  getSongById(id: string): Promise<Song | undefined>;
  
  /**
   * Get catalog availability status
   */
  getAvailability(): Promise<CatalogAvailability>;
}

interface CatalogFilters {
  artist?: string;
  cacheState?: Song['cacheState'];
  availability?: Song['availability'];
  minDuration?: number;
  maxDuration?: number;
}

interface CatalogAvailability {
  isOnline: boolean;
  isServiceAvailable: boolean;
  lastChecked: Date;
}

/**
 * Catalog Service Events
 */
type CatalogServiceEvent = 
  | { type: 'catalog-fetched'; version: string; songCount: number }
  | { type: 'catalog-unavailable'; error: CatalogError }
  | { type: 'catalog-updated'; oldVersion: string; newVersion: string };

interface CatalogError {
  code: 'network' | 'service-unavailable' | 'other';
  message: string;
}
```

---

## Metrics Service Contract

```typescript
/**
 * Metrics Service - Manages observability (logging, metrics)
 */
interface IMetricsService {
  /**
   * Log an error
   */
  logError(error: Error, context?: Record<string, unknown>): void;
  
  /**
   * Track a user action
   */
  trackAction(action: UserAction): void;
  
  /**
   * Flush metrics to remote service (if available)
   */
  flushMetrics(): Promise<void>;
  
  /**
   * Get aggregated metrics
   */
  getMetrics(): Promise<Metrics>;
}

interface UserAction {
  type: 'cache-start' | 'cache-complete' | 'playback-start' | 'search' | 'pref-change';
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

interface Metrics {
  errors: ErrorMetric[];
  actions: ActionMetric[];
  generatedAt: Date;
}

interface ErrorMetric {
  message: string;
  code: string;
  count: number;
  lastOccurred: Date;
}

interface ActionMetric {
  type: UserAction['type'];
  count: number;
  lastOccurred: Date;
  metadata?: Record<string, unknown>;
}
```

---

## Shared Type Definitions

```typescript
/**
 * Song Entity
 */
interface Song {
  id: string;                    // Audio file URL (unique identifier)
  title: string;
  artist: string;
  duration: number;               // Seconds
  audioUrl: string;
  fileSize: number;               // Bytes
  availability: 'available' | 'unavailable';
  cacheState: 'uncached' | 'downloading' | 'cached' | 'failed';
  downloadProgress: number | null; // 0-100
  downloadedSize: number | null;    // Bytes
  cachedAt: Date | null;
  lastPlayedAt: Date | null;
  playCount: number;
}

/**
 * Catalog Entity
 */
interface Catalog {
  id: string;
  version: string;
  lastUpdated: Date;
  isAvailable: boolean;
  songs: Song[];
}

/**
 * User Preferences
 */
interface UserPreferences {
  visualizerEnabled: boolean;
  volume: number;                 // 0.0 to 1.0
  autoCacheEnabled: boolean;
  downloadQuality: 'low' | 'medium' | 'high';
  lastUpdated: Date;
}

/**
 * Playback Queue
 */
interface PlaybackQueue {
  songs: Song[];
  currentIndex: number | null;
  isPlaying: boolean;
  currentTime: number;
  isRepeatEnabled: boolean;
  isShuffleEnabled: boolean;
}
```

---

## Service Composition

```typescript
/**
 * Service Manager - Coordinates all services
 */
interface IServiceManager {
  audio: IAudioService;
  cache: ICacheService;
  catalog: ICatalogService;
  metrics: IMetricsService;
  
  /**
   * Initialize all services
   */
  initialize(): Promise<void>;
  
  /**
   * Shutdown all services
   */
  shutdown(): Promise<void>;
}
```

---

## Usage Examples

### Playing a Song

```typescript
// Get song from catalog
const song = await serviceManager.catalog.getSongById('song-id');

// Play the song (auto-caches if enabled)
await serviceManager.audio.play(song);

// Handle playback events
serviceManager.audio.on('playback-started', (event) => {
  serviceManager.metrics.trackAction({
    type: 'playback-start',
    timestamp: new Date(),
    metadata: { songId: song.id }
  });
});
```

### Caching a Song

```typescript
// Cache a song with progress tracking
const song = await serviceManager.catalog.getSongById('song-id');

try {
  await serviceManager.cache.cacheSong(song, (progress) => {
    console.log(`Download progress: ${progress}%`);
  });
  
  serviceManager.metrics.trackAction({
    type: 'cache-complete',
    timestamp: new Date(),
    metadata: { songId: song.id, size: song.fileSize }
  });
} catch (error) {
  serviceManager.metrics.logError(error);
}
```

### Searching Catalog

```typescript
// Search for songs
const results = await serviceManager.catalog.searchCatalog('rock', {
  cacheState: 'cached'
});

console.log(`Found ${results.length} cached rock songs`);
```

---

## Error Handling

All services throw typed errors:

```typescript
interface ServiceError {
  service: 'audio' | 'cache' | 'catalog' | 'metrics';
  code: string;
  message: string;
  originalError?: Error;
}
```

Error codes by service:
- **audio**: 'network', 'decode', 'not-found', 'not-supported', 'other'
- **cache**: 'network', 'storage-full', 'quota-exceeded', 'not-found', 'other'
- **catalog**: 'network', 'service-unavailable', 'not-found', 'other'
- **metrics**: 'quota-exceeded', 'network', 'other'

---

## Testing Contracts

Each service contract can be mocked for testing:

```typescript
// Mock audio service for testing
class MockAudioService implements IAudioService {
  async play(song: Song): Promise<void> { /* ... */ }
  pause(): number { /* ... */ }
  // ... other methods
}

// Use in tests
const mockAudio = new MockAudioService();
await mockAudio.play(testSong);
expect(mockAudio.getState().isPlaying).toBe(true);
```
