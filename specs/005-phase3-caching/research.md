# Research: Service Worker and Caching

**Feature**: Phase 3 - Service Worker and Caching
**Date**: 2026-01-26
**Phase**: 0 - Research & Decision Points
**Status**: Complete

## Overview

This document captures research findings and decisions for implementing Service Worker, IndexedDB, and Cache API functionality for the music player PWA. All decisions align with the constitution's Phase 3 guidance: attempt vanilla implementation first, evaluate dependencies only when complexity justifies the cost.

---

## Research Questions & Decisions

### R1: Vanilla Service Worker vs Workbox

**Question**: Should we implement Service Worker with vanilla JavaScript or use Workbox library?

**Context**: Constitution recommends attempting vanilla SW first, pivot to Workbox only if complexity becomes unmanageable (>200 LOC). Phase 2 completion notes state "Service Workers are complex - strongly consider Workbox."

**Research Findings**:
- Vanilla SW requires implementing: cache strategies, versioning, cleanup, update detection, lifecycle management
- Workbox provides: precaching manifest, runtime caching strategies, cache expiration, navigation preload, update checks
- Typical vanilla SW for this feature would be ~250-300 LOC (cache management alone)
- Workbox bundle size: ~20KB gzipped (reasonable per constitution's <20KB target)
- Workbox requires build step (constitution notes this as a decision point)

**Decision**: **Vanilla Service Worker with helper functions**

**Rationale**:
1. Learning value: Understanding SW fundamentals aligns with constitution's "learning over shipping" principle
2. Constitution Phase 3 preparation guide explicitly recommends Option A (Vanilla SW first) for learning
3. Can write modular helper functions to reduce complexity (e.g., `cacheFirst()`, `networkFirst()`, `cleanupCache()`)
4. Avoids first dependency and build step at this stage
5. If SW code exceeds 250 LOC during implementation, pivot to Workbox (document in Constitution)

**Implementation Approach**:
- Create sw.js with modular helper functions for caching strategies
- Implement versioned cache names (`music-player-v1`, `music-player-v2`)
- Use `self.skipWaiting()` and `self.clients.claim()` for immediate control
- Implement cache cleanup in `activate` event
- Handle update detection in `fetch` event

**Alternatives Considered**:
- **Workbox from start**: Rejected because it would be the first dependency and requires build step. Better to learn SW fundamentals first.
- **Use idb library**: Rejected for same reason - IndexedDB is manageable with vanilla JS.

---

### R2: IndexedDB Wrapper Pattern

**Question**: What's the best pattern for wrapping IndexedDB in vanilla JavaScript?

**Context**: Need to store song audio blobs with metadata (title, artist, duration, URL, cached timestamp, file size, cache status). Must handle CRUD operations, transactions, and error handling.

**Research Findings**:
- IndexedDB is transactional, requires opening database, creating object stores, and using request-based API
- Common pattern: Promisify IndexedDB operations with async/await
- Libraries like idb or Dexie simplify this but add dependencies
- Constitution advises vanilla JS for <50 LOC simplicity, but IndexedDB wrapper will exceed this

**Decision**: **Custom IndexedDB wrapper with async/await**

**Rationale**:
1. Constitution permits exceeding 50 LOC for complex storage (IndexedDB qualifies)
2. Custom wrapper gives full control without dependency overhead
3. Async/await pattern is straightforward and modern
4. Reusable across songs and future features

**Implementation Approach**:
```javascript
// db.js structure
class MusicPlayerDB {
  constructor() { /* open DB, create object stores */ }
  async saveSong(songData, audioBlob) { /* store in 'songs' store */ }
  async getSong(songId) { /* retrieve from 'songs' store */ }
  async deleteSong(songId) { /* remove from 'songs' store */ }
  async getAllSongs() { /* get all cached songs */ }
  async getStorageUsage() { /* calculate total size */ }
  async clearAll() { /* wipe all stores */ }
}
```

**Object Store Schema**:
- Store name: `songs`
- Key path: `id` (song ID from catalog)
- Auto-increment: No (use catalog song IDs)
- Indexes: `cachedAt` (for LRU eviction), `fileSize` (for storage calculation)

**Error Handling**:
- Wrap all IndexedDB operations in try-catch
- Handle quota exceeded errors gracefully
- Provide user-friendly error messages

**Alternatives Considered**:
- **idb library**: Rejected to avoid dependency; vanilla JS is manageable for our use case
- **LocalStorage for blobs**: Not possible (5MB limit, doesn't support binary data)

---

### R3: Service Worker Lifecycle & Update Strategy

**Question**: How should we handle Service Worker install, activate, and update lifecycle?

**Context**: Constitution mentions SW lifecycle is tricky. Need to ensure updates don't break app and prompt users appropriately.

**Research Findings**:
- SW lifecycle: Installing → Waiting → Activating → Activated
- New SW enters "waiting" state if old SW has active clients
- `skipWaiting()` forces activation (can cause issues if not handled carefully)
- Common pattern: Check for updates in `fetch` event, prompt user with "Refresh available"
- PWA best practice: Show update UI, let user choose when to refresh

**Decision**: **Graceful update with user prompt**

**Rationale**:
1. Avoids jarring refreshes during user interaction
2. Aligns with PWA best practices
3. Constitution spec (FR-024) requires "prompt user to refresh when new version available"

**Implementation Approach**:
1. In `install` event: Cache app shell files using versioned cache name
2. In `activate` event: Clean up old caches, use `self.clients.claim()` for immediate control
3. In `fetch` event: For app shell, use `cacheFirst()`; for catalog, use `networkFirst()`; for songs, check IndexedDB first
4. Update detection: Compare cache version, notify client via `postMessage()`
5. In app.js: Listen for SW update message, show "New version available" banner, refresh on user action

**Cache Versioning**:
```javascript
const CACHE_VERSION = 'v1';
const CACHE_NAME = `music-player-${CACHE_VERSION}`;
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/db.js',
  '/cache-manager.js',
  '/sw.js'
];
```

**Update Flow**:
1. New SW detected → Enters waiting state
2. SW sends message "waiting" to client
3. App shows "Update available" button/banner
4. User clicks → Calls `self.skipWaiting()` in SW
5. SW activates, new cache ready
6. Page reloads to use new SW

**Alternatives Considered**:
- **Immediate activation with skipWaiting()**: Rejected - can break in-progress actions
- **Silent background updates**: Rejected - doesn't align with PWA best practices

---

### R4: Storage Quota Management

**Question**: How should we handle storage quota limits and implement LRU eviction?

**Context**: Different browsers have different limits:
- Chrome/Edge: ~6% of available disk space
- Firefox: ~10% with user prompt
- Safari: 50MB without prompt (most restrictive)
- Constitution spec (FR-011) requires LRU eviction

**Research Findings**:
- `navigator.storage.estimate()` provides usage/quota information
- Need to track `cachedAt` timestamp for each song
- LRU: Remove least recently used songs first
- Should warn user when storage is nearly full (>80% usage)

**Decision**: **Quota-aware LRU eviction with warnings**

**Rationale**:
1. Ensures app works on Safari (50MB limit)
2. Provides good UX with proactive warnings
3. Aligns with spec requirement (FR-011: remove LRU when insufficient space)

**Implementation Approach**:
1. Before caching new song:
   - Call `navigator.storage.estimate()` to check available space
   - Calculate total cached size via IndexedDB query
   - If >80% quota, show "Storage nearly full" warning
   - If quota would be exceeded, remove LRU songs until space is available

2. LRU Implementation:
   - Query `songs` store sorted by `cachedAt` ascending
   - Remove oldest entries until sufficient space
   - Update UI to reflect cache removal

3. Storage Usage Display:
   - Show total cached size in MB/GB
   - Show percentage of quota used
   - Show "Low storage" warning when >80%

**Error Handling**:
- If `QuotaExceededError`: Trigger LRU eviction and retry
- If still fails after LRU: Show "Storage full" error, disable caching

**Alternatives Considered**:
- **Fixed limit of 100 songs**: Rejected - doesn't account for variable file sizes
- **No quota checking**: Rejected - would cause hard failures on Safari

---

### R5: PWA Manifest Configuration

**Question**: What should the PWA manifest contain for a music player?

**Context**: Spec requires installable app (FR-016), standalone display mode, icons.

**Research Findings**:
- Required fields: name, short_name, start_url, display, background_color, theme_color, icons
- Recommended: description, orientation, scope
- Icons: 192x192 (adaptive), 512x512 (high-res)
- Music player specific: orientation="portrait" (mobile-first), theme_color matches app accent

**Decision**: **Standard PWA manifest with music player customization**

**Rationale**:
1. Ensures installability on all supported platforms
2. Provides native app feel (standalone mode)
3. Aligns with constitution PWA requirements

**Implementation Approach**:

```json
{
  "name": "Music Player",
  "short_name": "MusicPlayer",
  "description": "A simple, offline-capable music player PWA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4a90e2",
  "orientation": "portrait",
  "scope": "/",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    }
  ]
}
```

**Icon Generation**:
- Use simple music note icon (SVG → PNG conversion)
- Both icons required for installability
- Can use online tools or manual creation

**Alternatives Considered**:
- **Full screen display**: Rejected - hides status bar, not appropriate for music player
- **Minimal UI (browser UI)**: Rejected - user expects native app feel

---

### R6: Cache Strategy for Different Resource Types

**Question**: What caching strategy should we use for app shell, catalog, and songs?

**Context**: Constitution specifies:
- App shell caching (cache-first)
- Catalog caching (network-first with fallback)
- Song caching (on-demand only)

**Research Findings**:
- Cache-first: Fastest, good for static assets
- Network-first: Fresh content, good for dynamic data
- On-demand: Cache only when user interacts (play song)

**Decision**: **Mixed strategy per resource type**

**Rationale**:
1. Aligns with constitution guidance
2. Optimizes for performance (app shell) and freshness (catalog)
3. Minimizes storage usage (songs only on-demand)

**Implementation Approach**:

1. **App Shell (cache-first)**:
   - On install: Precache HTML, CSS, JS files
   - On fetch: Check cache first, network only if cache miss
   - Update: On SW activation, re-cache app shell

2. **Catalog (network-first with fallback)**:
   - On fetch: Try network first
   - If network fails: Fall back to cached version
   - If no cache: Show error
   - Update: Always fetch fresh catalog, update cache

3. **Songs (on-demand + IndexedDB)**:
   - On play: Fetch from network, store in IndexedDB
   - On subsequent play: Check IndexedDB first, then network
   - Cache API not used for songs (blobs stored in IndexedDB)

**Helper Functions**:
```javascript
async function cacheFirst(request) {
  // Check cache, then network
}

async function networkFirst(request) {
  // Check network, then cache
}
```

**Alternatives Considered**:
- **Stale-while-revalidate**: Rejected - more complex, not needed for this use case
- **Network-only for everything**: Rejected - doesn't meet offline requirement

---

### R7: Service Worker Testing Approach

**Question**: How should we test Service Worker functionality?

**Context**: Constitution specifies manual testing via DevTools. SW complexity makes testing critical.

**Research Findings**:
- Chrome DevTools: Service Worker panel, Cache Storage, IndexedDB
- Firefox: Similar DevTools but with some UI differences
- Safari: Develop menu → Service Workers
- Offline mode: Chrome DevTools Network tab → Offline checkbox

**Decision**: **Comprehensive manual testing checklist**

**Rationale**:
1. Constitution mandates manual testing for Phase 3
2. Automated SW testing is complex and requires specialized tools
3. Manual testing is sufficient for this feature scope

**Implementation Approach**: Create testing checklist covering:
- SW installation and activation
- App shell caching and offline load
- Catalog loading (online and offline)
- Song caching and playback
- Cache management UI
- SW update flow
- Cross-browser testing (Chrome, Firefox, Safari)
- Storage quota handling
- Error states (network failure, storage full)

**Test Scenarios**:
1. First visit: SW installs, caches app shell
2. Offline load: Reload without network, app loads from cache
3. Play song: Song cached in IndexedDB, plays successfully
4. Offline playback: Disconnect network, play cached song
5. Storage management: View storage usage, clear cache
6. SW update: Deploy new SW version, user prompted to refresh

**Alternatives Considered**:
- **Automated E2E with Playwright**: Rejected - constitution says manual first, automated only if pain point emerges
- **Service Worker testing libraries**: Rejected - would add complexity and dependency

---

## Summary of Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Vanilla SW vs Workbox | Vanilla SW with helper functions | Learning value, avoids first dependency |
| IndexedDB wrapper | Custom async/await wrapper | Full control, no dependency needed |
| SW lifecycle | Graceful update with user prompt | PWA best practice, avoids jarring refreshes |
| Storage quota | LRU eviction with warnings | Works on Safari (50MB limit) |
| PWA manifest | Standard config with music player customization | Installability, native app feel |
| Cache strategies | Mixed (cache-first, network-first, on-demand) | Performance vs freshness optimization |
| Testing approach | Manual testing via DevTools | Constitution requirement, sufficient for scope |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| SW complexity exceeds 250 LOC | High - may pivot to Workbox | Monitor LOC during implementation, document pivot decision |
| IndexedDB quota exceeded on Safari | High - songs won't cache | LRU eviction, proactive warnings, user error messages |
| SW update breaks app | Medium - user confusion | Graceful update flow, user prompts, thorough testing |
| Cross-browser inconsistencies | Medium - Safari limitations | Test on Safari, document known limitations, graceful degradation |
| Storage calculation errors | Low - incorrect UI display | Use `navigator.storage.estimate()`, verify with DevTools |

---

## Next Steps

1. **Phase 1: Design**
   - Create data-model.md (IndexedDB schema, cache structure)
   - Create contracts/ (SW event handlers, DB API)
   - Create quickstart.md (setup instructions)

2. **Phase 2: Implementation Tasks**
   - Generate tasks.md with actionable work items
   - Implement in order: db.js → cache-manager.js → sw.js → app.js integration → manifest.json

3. **Phase 3: Testing & Refinement**
   - Execute manual testing checklist
   - Iterate on bugs and edge cases
   - Update constitution with learnings

---

## References

- [Service Worker API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [IndexedDB API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Cache API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [Web App Manifest - MDN](https://developer.mozilla.org/en-US/docs/Manifest)
- [PWA Best Practices - web.dev](https://web.dev/pwa/)
- [Storage Quota - web.dev](https://web.dev/storage-for-the-web/)

---

## Bug Fix Research (2026-01-28)

**Context**: User testing revealed critical bugs in Phase 3 implementation preventing the app from functioning. This section documents the issues found and research for fixes.

### Bug 1: MusicPlayerDB Not Defined

**Error**: `app.js:8` throws `Uncaught ReferenceError: MusicPlayerDB is not defined`

**Root Cause**: `db.js` contains the `MusicPlayerDB` class but is not loaded in `index.html`

**Research**:
- Script loading order in vanilla JavaScript: Scripts execute in order they appear in DOM
- app.js line 8: `const db = new MusicPlayerDB();` executes before MusicPlayerDB is defined
- db.js must be loaded before app.js

**Decision**: Add `<script src="db.js"></script>` before `<script src="app.js"></script>` in index.html

**Rationale**: Vanilla JS doesn't have ES modules in this phase, so script order matters. Loading db.js first ensures class is available when app.js references it.

**Alternatives Considered**:
- Move MusicPlayerDB to app.js: Rejected - violates separation of concerns, makes app.js too large
- Use ES modules: Rejected - Constitution specifies no build tools/ES modules for Phase 1-3
- Dynamic import: Rejected - Adds complexity, not needed for this simple app

---

### Bug 2: CSP Violation - Inline Script

**Error**: Browser console shows CSP error blocking inline script
```
Content-Security-Policy: The page's settings blocked an inline script
```

**Root Cause**: Lines 69-77 in `index.html` contain inline script for Service Worker registration

**Research**:
- CSP directive `script-src 'self'` only allows external scripts from same origin
- Inline scripts require adding 'unsafe-inline' or specific nonce/hash
- Constitution requires strict CSP without 'unsafe-inline'

**Decision**: Move Service Worker registration code to `app.js` inside DOMContentLoaded handler

**Rationale**:
- Complies with strict CSP (`script-src 'self'`)
- Keeps all JS in external files
- Maintains zero inline scripts requirement
- SW can still be registered early enough (in DOMContentLoaded before main app logic)

**Implementation**:
```javascript
document.addEventListener('DOMContentLoaded', async () => {
  // Register Service Worker first
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('SW registration failed:', error);
    });
  }

  // Rest of app initialization...
  await db.init();
  // ...
});
```

**Alternatives Considered**:
- Add 'unsafe-inline' to CSP: Rejected - violates security best practices
- Add specific nonce/hash: Rejected - unnecessary complexity for simple app
- Create separate sw-registration.js: Rejected - adds unnecessary file, app.js is appropriate place

---

### Bug 3: Duplicate Fetch Handlers in Service Worker

**Problem**: `sw.js` has two identical `self.addEventListener('fetch', ...)` handlers (lines 66-82 and 84-100)

**Root Cause**: Likely copy-paste error during code generation

**Research**:
- Service Workers can have multiple event listeners but they execute in order
- Duplicate handlers cause unpredictable behavior and potential race conditions
- Last registered handler may override first, or both may execute

**Decision**: Remove the second duplicate handler (lines 84-100)

**Rationale**:
- Both handlers are identical, so removing one has no functional impact
- Reduces code complexity
- Prevents potential conflicts or double-handling

**Alternatives Considered**:
- Keep both handlers: Rejected - adds complexity, no benefit
- Refactor to single handler with different logic: Not needed - both handlers do same thing

---

### Bug 4: catalog.json Not Loading

**Problem**: No network request for `catalog.json` is made; app shows empty song list

**Root Cause**: Unclear from initial inspection - needs debugging

**Research**:
- Service Worker intercepts fetch requests for catalog.json (line 76-78 in sw.js)
- networkFirst strategy should fetch from network and cache the response
- If fetch fails, it falls back to cache
- However, app.js `loadCatalog()` function should still make the fetch call

**Hypothesis**: The `loadCatalog()` function might be failing silently or not being called

**Investigation Steps**:
1. Verify `loadCatalog()` is called after db.init() in DOMContentLoaded
2. Check if error handling in `loadCatalog()` is too broad
3. Verify network-first strategy in SW is not blocking the request
4. Check if Service Worker is intercepting and caching incorrectly

**Current State**: Needs runtime debugging - add console.log statements to trace execution flow

**Decision**: Add debugging logs to trace execution:
- In `loadCatalog()`: log entry, success, error
- In SW fetch handler: log requests for catalog.json
- In DOMContentLoaded: log initialization steps

---

### Bug 5: Missing cache-manager.js Reference

**Problem**: `sw.js` line 10 lists `/cache-manager.js` in PRECACHE_URLS but file may not exist

**Research**:
- Service Worker precaches all files in PRECACHE_URLS array
- If file doesn't exist, cache.addAll() will fail and reject
- This causes Service Worker installation to fail

**Decision**: Verify if cache-manager.js exists; if not, remove from PRECACHE_URLS

**Rationale**: Service Worker must install successfully for offline functionality. Non-existent files in cache list prevent installation.

**Alternatives Considered**:
- Create cache-manager.js: Not needed if all cache logic is in db.js
- Keep in array with optional flag: Not supported - cache.all() requires all files to exist

---

## Bug Fix Implementation Order

1. Fix CSP violation (remove inline script from index.html)
2. Add db.js script tag to index.html (before app.js)
3. Remove duplicate fetch handler from sw.js
4. Add debugging logs to trace catalog.json loading
5. Verify cache-manager.js existence (remove from PRECACHE_URLS if missing)
6. Test fixes locally with http.server
7. Verify offline functionality works

---

## Bug Fix Success Criteria

- [ ] No CSP errors in browser console
- [ ] MusicPlayerDB is defined when app.js executes
- [ ] catalog.json loads successfully (200 OK)
- [ ] Song list displays correctly
- [ ] Service Worker installs successfully
- [ ] App shell loads offline after first visit
- [ ] Cached songs play offline
