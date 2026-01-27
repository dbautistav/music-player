# Tasks: Service Worker and Caching

**Input**: Design documents from `/specs/005-phase3-caching/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/js-modules.md
**Tests**: Manual testing only - no automated tests specified in feature specification
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3...)
- Include exact file paths in descriptions

## Path Conventions

- **Single web application**: `src/` at repository root
- All JavaScript files: `src/*.js`
- PWA icons: `src/icons/`
- Paths shown below match plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create new files and directories for Phase 3 functionality

- [X] T001 Create src/icons directory for PWA icons
- [X] T002 [P] Create PWA icon 192x192 in src/icons/icon-192x192.png
- [X] T003 [P] Create PWA icon 512x512 in src/icons/icon-512x512.png
- [X] T004 Create src/db.js file with MusicPlayerDB class structure
- [X] T005 [P] Create src/cache-manager.js file with cache strategy functions
- [X] T006 [P] Create src/sw.js file with Service Worker lifecycle structure
- [X] T007 [P] Create src/manifest.json file with PWA metadata

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Implement MusicPlayerDB.init() method in src/db.js (open IndexedDB, create object store and indexes)
- [X] T009 [P] Implement MusicPlayerDB.saveSong() in src/db.js (save song metadata and audio blob)
- [X] T010 [P] Implement MusicPlayerDB.getSong() in src/db.js (retrieve cached song by ID)
- [X] T011 [P] Implement MusicPlayerDB.deleteSong() in src/db.js (remove song from IndexedDB)
- [X] T012 [P] Implement MusicPlayerDB.getAllSongs() in src/db.js (get all cached songs sorted by cachedAt)
- [X] T013 [P] Implement MusicPlayerDB.getStorageUsage() in src/db.js (calculate total storage size)
- [X] T014 [P] Implement MusicPlayerDB.getLRUSongs() in src/db.js (get least recently used songs for eviction)
- [X] T015 [P] Implement MusicPlayerDB.clearAll() in src/db.js (delete all cached songs)
- [X] T016 [P] Add error handling and try-catch blocks to all MusicPlayerDB methods in src/db.js
- [X] T017 [P] Implement cacheFirst() function in src/cache-manager.js (cache-first strategy for app shell)
- [X] T018 [P] Implement networkFirst() function in src/cache-manager.js (network-first strategy for catalog)
- [X] T019 [P] Implement precacheAssets() function in src/cache-manager.js (cache app shell on install)
- [X] T020 [P] Implement cleanupOldCaches() function in src/cache-manager.js (remove old caches on activate)
- [X] T021 Add Service Worker install event listener in src/sw.js (precache app shell, skipWaiting)
- [X] T022 [P] Add Service Worker activate event listener in src/sw.js (cleanup old caches, claim clients)
- [X] T023 [P] Add Service Worker fetch event listener in src/sw.js (intercept requests, apply caching strategies)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Load Application Offline (Priority: P1) 🎯 MVP

**Goal**: Enable app to load and display interface without network connection after first online visit

**Independent Test**: Can be fully tested by opening app online, disconnecting network, reloading page, and verifying app interface loads and displays cached content

### Implementation for User Story 1

- [X] T024 [US1] Configure PRECACHE_URLS constant in src/cache-manager.js (list app shell files)
- [X] T025 [US1] Configure CACHE_VERSION and CACHE_NAME constants in src/cache-manager.js (versioned cache names)
- [X] T026 [US1] Integrate precacheAssets() call in src/sw.js install event listener
- [X] T027 [US1] Integrate cleanupOldCaches() call in src/sw.js activate event listener
- [X] T028 [US1] Configure fetch event to use cacheFirst() for app shell assets in src/sw.js
- [X] T029 [US1] Configure fetch event to pass through songs and other requests in src/sw.js
- [X] T030 [US1] Add Service Worker registration code in src/app.js (check for SW support, register /sw.js)
- [X] T031 [US1] Add Service Worker message listener for update notifications in src/app.js
- [X] T032 [US1] Add offline status indicator UI element in src/index.html
- [X] T033 [US1] Implement offline detection logic in src/app.js (check navigator.onLine, update indicator)
- [X] T034 [US1] Add error handling for first-time offline load in src/app.js (show message if app not cached)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Play Cached Songs Offline (Priority: P1) 🎯 MVP

**Goal**: Enable users to play previously cached songs without network connection

**Independent Test**: Can be fully tested by playing a song online, disconnecting network, playing same song again, and verifying it plays without errors

### Implementation for User Story 2

- [X] T035 [US2] Update playSong() function in src/app.js to check IndexedDB first
- [X] T036 [US2] Add logic to play from IndexedDB cache in src/app.js (URL.createObjectURL with audioBlob)
- [X] T037 [US2] Add logic to fetch from network and cache in src/app.js (fetch, blob, db.saveSong)
- [X] T038 [US2] Add error handling for non-cached song offline playback in src/app.js (show error message)
- [X] T039 [US2] Add error handling for fetch failures during playback in src/app.js (show user-friendly error)
- [ ] T040 [US2] Test cached song playback in offline mode (Chrome DevTools Offline checkbox)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Cache Songs On-Demand (Priority: P1) 🎯 MVP

**Goal**: Automatically cache songs when played for offline use without manual user intervention

**Independent Test**: Can be fully tested by playing a song for first time and verifying it becomes available for offline playback immediately

### Implementation for User Story 3

- [X] T041 [US3] Add QuotaExceededError handling in MusicPlayerDB.saveSong() in src/db.js
- [X] T042 [US3] Add storage quota check before caching in src/app.js (navigator.storage.estimate)
- [X] T043 [US3] Implement LRU eviction logic in src/app.js (call getLRUSongs(), delete until space available)
- [X] T044 [US3] Add visual indicator for cached songs in src/app.js (icon or badge on song cards)
- [X] T045 [US3] Add loading indicator for songs being cached in src/app.js (show during fetch/save)
- [X] T046 [US3] Add logic to use cached version on subsequent plays in src/app.js (skip network fetch if cached)
- [ ] T047 [US3] Test on-demand song caching with DevTools IndexedDB inspection

**Checkpoint**: All P1 user stories (1, 2, 3) should now be independently functional

---

## Phase 6: User Story 4 - View Cache Status (Priority: P2)

**Goal**: Enable users to see which songs are cached and total storage usage

**Independent Test**: Can be fully tested by checking cache status indicators and viewing storage summary in UI

### Implementation for User Story 4

- [X] T048 [US4] Add storage usage display UI element in src/index.html (show total cached content size)
- [X] T049 [US4] Implement updateStorageDisplay() function in src/app.js (call getStorageUsage, update UI)
- [X] T050 [US4] Calculate storage percentage in src/app.js (usage / quota * 100)
- [X] T051 [US4] Add storage warning UI element in src/index.html (show when >80% quota)
- [X] T052 [US4] Implement showStorageWarning() function in src/app.js (display warning banner)
- [X] T053 [US4] Update storage display after cache operations in src/app.js (call after save/delete)
- [ ] T054 [US4] Test storage display accuracy with DevTools Application → Storage

**Checkpoint**: At this point, User Stories 1-4 should all work independently

---

## Phase 7: User Story 5 - Manage Cached Content (Priority: P2)

**Goal**: Enable users to clear individual songs or all cache data to free storage

**Independent Test**: Can be fully tested by clearing songs and verifying storage is freed and indicators update

### Implementation for User Story 5

- [X] T055 [US5] Add clear cache button for individual songs in src/app.js (show on song cards)
- [X] T056 [US5] Add clear all cache button in src/app.js (show in cache management section)
- [X] T057 [US5] Implement clearCache(songId) function in src/app.js (call db.deleteSong or db.clearAll)
- [X] T058 [US5] Add loading indicator for cache clearing in src/app.js (show during operation)
- [X] T059 [US5] Add confirmation dialog before clearing all cache in src/app.js (confirm() call)
- [X] T060 [US5] Add success message after cache clearing in src/app.js (show toast or banner)
- [X] T061 [US5] Update cache status indicators after clearing in src/app.js (remove cached indicators)
- [ ] T062 [US5] Test cache clearing with DevTools IndexedDB and Cache Storage inspection

**Checkpoint**: At this point, User Stories 1-5 should all work independently

---

## Phase 8: User Story 6 - Install as PWA (Priority: P3)

**Goal**: Enable users to install app as standalone application on home screen

**Independent Test**: Can be fully tested by installing app from browser and verifying it appears on home screen and launches standalone

### Implementation for User Story 6

- [X] T063 [P] [US6] Configure manifest.json PWA fields in src/manifest.json (name, short_name, description, start_url, display, background_color, theme_color, orientation, scope)
- [X] T064 [P] [US6] Configure icons array in src/manifest.json (192x192, 512x512 icon objects)
- [X] T065 [US6] Add manifest link to src/index.html (<link rel="manifest" href="/manifest.json">)
- [X] T066 [US6] Add theme_color meta tag to src/index.html (<meta name="theme-color" content="#4a90e2">)
- [ ] T067 [US6] Test PWA installability on Chrome/Edge (check install prompt)
- [ ] T068 [US6] Test PWA installability on mobile (Add to Home Screen)
- [ ] T069 [US6] Test standalone mode launch (verify no browser chrome)
- [ ] T070 [US6] Test offline load from installed app (verify works without network)

**Checkpoint**: All user stories (1-6) should now be independently functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T071 [P] Add Service Worker update detection in src/sw.js (notify clients of new version)
- [X] T072 Implement update banner UI in src/index.html (show "New version available" message)
- [X] T073 Add refresh functionality to update banner in src/app.js (reload page to activate new SW)
- [X] T074 [P] Add CSP headers to src/index.html (Content-Security-Policy meta tag)
- [ ] T075 [P] Run manual testing checklist from quickstart.md (8 test scenarios)
- [ ] T076 [P] Test on Chrome/Edge (Service Worker panel, Offline mode)
- [ ] T077 [P] Test on Firefox (Service Worker panel, IndexedDB inspection)
- [ ] T078 [P] Test on Safari (Developer menu, 50MB limit handling)
- [ ] T079 [P] Test Service Worker update flow (deploy new version, prompt user)
- [ ] T080 [P] Test storage quota handling (fill cache, trigger LRU eviction)
- [ ] T081 [P] Verify bundle size stays under 200KB (exclude songs)
- [ ] T082 [P] Test PWA installation on mobile devices (iOS Safari, Chrome Android)
- [ ] T083 [P] Verify offline app shell load time <3 seconds (Lighthouse or DevTools)
- [ ] T084 [P] Verify cached song playback start time <2 seconds (DevTools Performance)
- [X] T085 Code cleanup and refactoring (remove console.logs, optimize performance)
- [X] T086 Add inline comments to Service Worker lifecycle methods in src/sw.js (explain install/activate/fetch)
- [X] T087 Add inline comments to IndexedDB wrapper methods in src/db.js (explain data flow)
- [ ] T088 Update README.md with Phase 3 PWA setup instructions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User Story 1 (P1): Must complete first (enables offline app shell)
  - User Story 2 (P1): Must complete second (enables offline playback)
  - User Story 3 (P1): Must complete third (enables on-demand caching)
  - User Story 4 (P2): Can be done after US3 (cache status display)
  - User Story 5 (P2): Can be done after US3 or US4 (cache management)
  - User Story 6 (P3): Can be done in parallel with US4/US5 (PWA installation)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Depends on Foundational (Phase 2) + US1 (requires offline app shell)
- **User Story 3 (P1)**: Depends on Foundational (Phase 2) + US2 (requires playback logic)
- **User Story 4 (P2)**: Depends on Foundational (Phase 2) + US3 (requires cached songs)
- **User Story 5 (P2)**: Depends on Foundational (Phase 2) + US3 (requires cached songs)
- **User Story 6 (P3)**: Depends on Setup (Phase 1) only - independent of other stories

### Within Each User Story

- All implementation tasks in story order as listed
- All tasks marked [P] can be done in parallel within the same story
- Cross-file tasks (marked [P]) can be done in parallel
- Same-file tasks must be done sequentially (not marked [P])

### Parallel Opportunities

- **Setup (Phase 1)**: All tasks marked [P] can run in parallel (T002, T003, T004, T005, T006, T007)
- **Foundational (Phase 2)**: All tasks marked [P] can run in parallel (T009-T020)
- **User Story 6 (Phase 8)**: All tasks marked [P] can run in parallel (T063, T064)
- **Polish (Phase 9)**: All tasks marked [P] can run in parallel (T074, T075-T084)
- After Foundational (Phase 2) completes: User Story 6 can proceed in parallel with US4 and US5

---

## Parallel Example: User Story 1

```bash
# Launch parallel tasks for User Story 1 (marked [P]):
Task: "T024 Configure PRECACHE_URLS constant in src/cache-manager.js"
Task: "T025 Configure CACHE_VERSION and CACHE_NAME constants in src/cache-manager.js"
Task: "T027 Integrate cleanupOldCaches() call in src/sw.js activate event listener"
Task: "T029 Configure fetch event to pass through songs and other requests in src/sw.js"
Task: "T031 Add Service Worker message listener for update notifications in src/app.js"

# These work on different files and have no dependencies
```

---

## Parallel Example: Foundational Phase

```bash
# Launch all MusicPlayerDB methods in parallel (marked [P]):
Task: "T009 Implement MusicPlayerDB.saveSong() in src/db.js"
Task: "T010 Implement MusicPlayerDB.getSong() in src/db.js"
Task: "T011 Implement MusicPlayerDB.deleteSong() in src/db.js"
Task: "T012 Implement MusicPlayerDB.getAllSongs() in src/db.js"
Task: "T013 Implement MusicPlayerDB.getStorageUsage() in src/db.js"
Task: "T014 Implement MusicPlayerDB.getLRUSongs() in src/db.js"
Task: "T015 Implement MusicPlayerDB.clearAll() in src/db.js"

# Launch all cache-manager.js functions in parallel (marked [P]):
Task: "T017 Implement cacheFirst() function in src/cache-manager.js"
Task: "T018 Implement networkFirst() function in src/cache-manager.js"
Task: "T019 Implement precacheAssets() function in src/cache-manager.js"
Task: "T020 Implement cleanupOldCaches() function in src/cache-manager.js"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T023) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T024-T034)
4. **STOP and VALIDATE**: Test User Story 1 independently (offline app shell load)
5. Complete Phase 4: User Story 2 (T035-T040)
6. **STOP and VALIDATE**: Test User Story 2 independently (offline song playback)
7. Complete Phase 5: User Story 3 (T041-T047)
8. **STOP and VALIDATE**: Test all P1 stories together (MVP!)
9. Deploy/demo if ready

**MVP delivers**: Offline app shell, offline song playback, on-demand song caching

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Offline app shell)
3. Add User Story 2 → Test independently → Deploy/Demo (Offline playback)
4. Add User Story 3 → Test independently → Deploy/Demo (Auto-caching)
5. Add User Story 4 → Test independently → Deploy/Demo (Cache status)
6. Add User Story 5 → Test independently → Deploy/Demo (Cache management)
7. Add User Story 6 → Test independently → Deploy/Demo (PWA install)
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T023)
2. Once Foundational is done:
   - Developer A: User Stories 1-3 (P1 features)
   - Developer B: User Story 6 (PWA installation - can start in parallel)
3. After P1 stories complete:
   - Developer A: User Stories 4-5 (P2 features)
   - Developer B: Polish and cross-cutting concerns
4. Integrate and test all stories together

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Manual testing approach per constitution - no automated tests specified
- Stop at any checkpoint to validate story independently
- All tasks follow strict format: checkbox, Task ID, [P] marker (if parallelizable), [Story] label, description with file path
- Commit after each task or logical group of related tasks
- Phase 2 (Foundational) is CRITICAL - must complete before any user story work
- User Stories 1-3 are P1 (MVP priority)
- User Story 6 can proceed in parallel with US4 and US5 after Foundational phase
- Vanilla JavaScript approach per Phase 0 research decision - no Workbox dependency
