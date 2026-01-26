---

description: "Task list for offline-first PWA music player implementation"
---

# Tasks: Offline-First PWA Music Player

**Input**: Design documents from `/specs/001-pwa-music-player/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: This feature includes unit tests (Vitest), component tests (React Testing Library), and E2E tests (Playwright) as specified in the plan.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single web/PWA project:
- `src/` - Source code at repository root
- `public/` - Public assets and service worker at repository root
- `tests/` - Tests at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Vite + React + TypeScript project with PWA plugin in package.json
- [X] T002 [P] Create project directory structure: src/components/{catalog,player,visualizer,common}, src/services/{audio,cache,catalog,metrics}, src/hooks, src/models, src/utils, src/workers, tests/{unit,integration,e2e}
- [X] T003 [P] Configure TypeScript with strict mode in tsconfig.json
- [X] T004 [P] Configure Vite for PWA with Service Worker support in vite.config.ts
- [X] T005 [P] Create package.json scripts: dev, build, preview, test, lint, typecheck
- [X] T006 [P] Install dependencies: react, react-dom, @vitejs/plugin-react, vite-plugin-pwa, workbox-window
- [X] T007 [P] Install testing dependencies: vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, @playwright/test
- [X] T008 [P] Install ESLint and Prettier with configuration files
- [X] T009 Create PWA manifest.json with app metadata, icons, theme_color in public/manifest.json
- [X] T010 Create Service Worker registration stub in public/service-worker.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T011 Create TypeScript models for Song, Catalog, Cache, PlaybackQueue, UserPreferences in src/models/types.ts
- [X] T012 [P] Create Service Manager interface in src/services/ServiceManager.ts
- [X] T013 [P] Create Metrics Service for error logging and action tracking in src/services/metrics/MetricsService.ts
- [X] T014 [P] Create React Context for global state (AudioContext) in src/contexts/AudioContext.tsx
- [X] T015 Create root App component with state management in src/App.tsx
- [X] T016 Create main entry point with React 18 root rendering in src/main.tsx
- [X] T017 [P] Create base CSS styles for mobile-first layout in src/index.css
- [X] T018 [P] Initialize IndexedDB database schema for song cache in src/utils/indexedDB.ts
- [X] T019 Create Web Audio Context wrapper for visualizer support in src/utils/audioContext.ts
- [X] T020 Configure Workbox for Service Worker caching in vite.config.ts
- [X] T021 Create initial catalog data JSON file in public/catalog/songs.json

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Browse and Play Music (Priority: P1) 🎯 MVP

**Goal**: Implement catalog browsing and audio playback functionality to allow users to discover and start playing songs quickly.

**Independent Test**: Access the catalog, select a song, and verify playback starts within 3 seconds. Verify catalog displays with responsive scrolling on mobile.

### Tests for User Story 1

- [X] T022 [P] [US1] Write Catalog Service unit tests (fetch, search, get by ID) in tests/unit/services/CatalogService.test.ts
- [X] T023 [P] [US1] Write Audio Service unit tests (play, pause, state) in tests/unit/services/AudioService.test.ts
- [X] T024 [P] [US1] Write Catalog Component tests (render, list display) in tests/unit/components/Catalog.test.tsx
- [X] T025 [P] [US1] Write Audio Player Component tests (play button, state) in tests/unit/components/AudioPlayer.test.tsx
- [ ] T026 [P] [US1] Write E2E test for catalog browse and playback in tests/e2e/catalog-browse.spec.ts

### Implementation for User Story 1

- [X] T027 [US1] Implement Catalog Service (fetch from JSON, search, get by ID) in src/services/catalog/CatalogService.ts
- [X] T028 [US1] Implement Audio Service (play, pause, state, HTML5 Audio) in src/services/audio/AudioService.ts
- [X] T029 [US1] Create Catalog Component with song list display in src/components/catalog/Catalog.tsx
- [X] T030 [US1] Create Audio Player Component with play/pause controls in src/components/player/AudioPlayer.tsx
- [X] T031 [US1] Create Song Item Component for catalog list items in src/components/catalog/SongItem.tsx
- [X] T032 [US1] Connect Catalog to Audio Service for playback in src/components/catalog/Catalog.tsx
- [X] T033 [US1] Integrate Catalog and Player into App component in src/App.tsx
- [X] T034 [US1] Create loading skeleton components for catalog in src/components/common/LoadingSkeleton.tsx
- [X] T035 [US1] Add error banner component for catalog fetch failures in src/components/common/ErrorBanner.tsx
- [X] T036 [US1] Apply mobile-first responsive styles to catalog in src/components/catalog/Catalog.css
- [X] T037 [US1] Apply mobile-first responsive styles to audio player in src/components/player/AudioPlayer.css

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - users can browse catalog and play songs.

---

## Phase 4: User Story 2 - Cache Songs for Offline Playback (Priority: P1) 🎯 MVP

**Goal**: Implement song caching with IndexedDB storage to enable offline playback without internet connection.

**Independent Test**: Select songs for download, disconnect from internet, and verify that cached songs play without any connection. Verify download progress displays correctly.

### Tests for User Story 2

- [X] T038 [P] [US2] Write Cache Service unit tests (cache, remove, progress) in tests/unit/services/CacheService.test.ts
- [X] T039 [P] [US2] Write IndexedDB wrapper tests (open, transaction, CRUD) in tests/unit/utils/indexedDB.test.ts
- [X] T040 [P] [US2] Write Cache Icon Component tests (click, state display) in tests/unit/components/CacheIcon.test.tsx
- [X] T041 [P] [US2] Write Cache Progress Component tests (percentage display) in tests/unit/components/CacheProgress.test.tsx
- [X] T042 [P] [US2] Write E2E test for cache song and offline playback in tests/e2e/cache-offline.spec.ts

### Implementation for User Story 2

- [X] T043 [US2] Implement Cache Service (IndexedDB wrapper, cache song with progress) in src/services/cache/CacheService.ts
- [X] T044 [US2] Implement IndexedDB wrapper with transaction support in src/utils/indexedDB.ts
- [X] T045 [US2] Create Cache Icon Component (tap to cache, state indicators) in src/components/catalog/CacheIcon.tsx
- [X] T046 [US2] Create Cache Progress Component (download percentage display) in src/components/catalog/CacheProgress.tsx
- [X] T047 [US2] Update Song Item Component to display cache status in src/components/catalog/SongItem.tsx
- [X] T048 [US2] Connect Cache Icon to Cache Service in src/components/catalog/CacheIcon.tsx
- [X] T049 [US2] Integrate caching into Catalog Component in src/components/catalog/Catalog.tsx
- [X] T050 [US2] Update Audio Service to load from IndexedDB when cached in src/services/audio/AudioService.ts
- [X] T051 [US2] Implement offline fallback when external catalog unavailable in src/services/catalog/CatalogService.ts
- [X] T052 [US2] Add cache state management to global state in src/contexts/AudioContext.tsx
- [X] T053 [US2] Apply responsive styles to cache icon and progress in src/components/catalog/Catalog.css

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - complete MVP with online catalog browsing and offline caching/playback.

---

## Phase 5: User Story 3 - Playback Controls (Priority: P2)

**Goal**: Implement playback controls (play, pause, next, previous, seek, volume) for complete listening experience.

**Independent Test**: Play a song and use all controls, verifying each responds correctly. Test seek operation and volume changes.

### Tests for User Story 3

- [ ] T054 [P] [US3] Write Playback Controls Component tests (all buttons, seek, volume) in tests/unit/components/PlayerControls.test.tsx
- [ ] T055 [P] [US3] Write seek slider component tests (drag, input) in tests/unit/components/SeekSlider.test.tsx
- [ ] T056 [P] [US3] Write volume slider component tests (drag, input) in tests/unit/components/VolumeSlider.test.tsx
- [ ] T057 [P] [US3] Write E2E test for playback controls in tests/e2e/playback-controls.spec.ts

### Implementation for User Story 3

- [ ] T058 [US3] Create Playback Controls Component (play/pause, next/previous) in src/components/player/PlayerControls.tsx
- [ ] T059 [US3] Create Seek Slider Component for song position in src/components/player/SeekSlider.tsx
- [ ] T060 [US3] Create Volume Slider Component for audio volume in src/components/player/VolumeSlider.tsx
- [ ] T061 [US3] Add playback queue state management to Audio Service in src/services/audio/AudioService.ts
- [ ] T062 [US3] Implement next/previous song navigation in Audio Service in src/services/audio/AudioService.ts
- [ ] T063 [US3] Implement seek functionality in Audio Service in src/services/audio/AudioService.ts
- [ ] T064 [US3] Implement volume control in Audio Service in src/services/audio/AudioService.ts
- [ ] T065 [US3] Integrate all playback controls into Player Controls in src/components/player/PlayerControls.tsx
- [ ] T066 [US3] Apply responsive styles to playback controls in src/components/player/PlayerControls.css

**Checkpoint**: User Stories 1-3 should be independently functional - complete playback controls for music listening.

---

## Phase 6: User Story 4 - Manage Cached Songs (Priority: P2)

**Goal**: Implement cache management screen to view and remove cached songs to control device storage usage.

**Independent Test**: View cached songs, remove songs, and verify storage is freed. Check storage usage displays correctly.

### Tests for User Story 4

- [ ] T067 [P] [US4] Write Cache Management Component tests (list, remove) in tests/unit/components/CacheManagement.test.tsx
- [ ] T068 [P] [US4] Write Storage Usage Component tests (display total, capacity) in tests/unit/components/StorageUsage.test.tsx
- [ ] T069 [P] [US4] Write E2E test for cache management in tests/e2e/cache-management.spec.ts

### Implementation for User Story 4

- [ ] T070 [US4] Create Cache Management Component (list cached songs, remove buttons) in src/components/catalog/CacheManagement.tsx
- [ ] T071 [US4] Create Storage Usage Component (display total bytes, capacity) in src/components/catalog/StorageUsage.tsx
- [ ] T072 [US4] Add batch remove functionality to Cache Service in src/services/cache/CacheService.ts
- [ ] T073 [US4] Implement cache statistics in Cache Service (total size, capacity) in src/services/cache/CacheService.ts
- [ ] T074 [US4] Create navigation to Cache Management in App component in src/App.tsx
- [ ] T075 [US4] Apply responsive styles to cache management in src/components/catalog/CacheManagement.css

**Checkpoint**: User Stories 1-4 should be independently functional - complete cache management for storage control.

---

## Phase 7: User Story 5 - Music Visualizer (Priority: P3)

**Goal**: Implement audio visualization using Web Audio API and Canvas for engaging listening experience.

**Independent Test**: Play a song and observe visualizer responds to audio frequency. Toggle visualizer on/off.

### Tests for User Story 5

- [ ] T076 [P] [US5] Write Visualizer Component tests (render, toggle, 60fps) in tests/unit/components/Visualizer.test.tsx
- [ ] T077 [P] [US5] Write Canvas renderer tests (frequency data, performance) in tests/unit/utils/canvasRenderer.test.ts
- [ ] T078 [P] [US5] Write E2E test for visualizer in tests/e2e/visualizer.spec.ts

### Implementation for User Story 5

- [ ] T079 [US5] Create Visualizer Component using Web Audio API in src/components/visualizer/Visualizer.tsx
- [ ] T080 [US5] Create Canvas renderer utility (frequency data, requestAnimationFrame) in src/utils/canvasRenderer.ts
- [ ] T081 [US5] Connect Audio Element to Web Audio AnalyserNode in src/services/audio/AudioService.ts
- [ ] T082 [US5] Add visualizer toggle preference to User Preferences in src/services/metrics/MetricsService.ts
- [ ] T083 [US5] Integrate visualizer into Audio Player Component in src/components/player/AudioPlayer.tsx
- [ ] T084 [US5] Apply responsive styles to visualizer in src/components/visualizer/Visualizer.css
- [ ] T085 [US5] Add visualizer toggle control to Player Controls in src/components/player/PlayerControls.tsx

**Checkpoint**: All user stories should be independently functional - complete music player with visualizer.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T086 [P] Run Lighthouse PWA audit and fix all violations
- [ ] T087 [P] Run Lighthouse performance audit and optimize (load <3s, render <100ms)
- [ ] T088 [P] Run Lighthouse accessibility audit and fix all violations
- [ ] T089 [P] Test offline capability thoroughly (Service Worker caching, IndexedDB)
- [ ] T090 [P] Optimize bundle size (code splitting, lazy loading)
- [ ] T091 [P] Implement background sync for metrics in Service Worker
- [ ] T092 [P] Add proper error boundaries for React components
- [ ] T093 [P] Add loading states for all async operations
- [ ] T094 Code cleanup and refactoring across all services
- [ ] T095 Add JSDoc comments to all service methods
- [ ] T096 Run all tests and fix failures (Vitest, Playwright, React Testing Library)
- [ ] T097 Run linting (ESLint) and fix all warnings
- [ ] T098 Run typecheck (tsc) and fix all type errors
- [ ] T099 Update AGENTS.md with music player conventions (if applicable)
- [ ] T100 Run quickstart.md validation (all examples work correctly)
- [ ] T101 Create music player documentation in docs/ (if needed)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User Story 1 (P1) and 2 (P2) can proceed in parallel after Foundational
  - User Story 3 depends on User Story 1 (Audio Service)
  - User Story 4 depends on User Story 2 (Cache Service)
  - User Story 5 depends on User Story 1 (Audio Service with Web Audio)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1 - MVP)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P2 - MVP)**: Can start after Foundational - Independent of US1, but integrates with Catalog
- **User Story 3 (P2)**: Depends on US1 Audio Service - Requires playback infrastructure
- **User Story 4 (P2)**: Depends on US2 Cache Service - Requires caching infrastructure
- **User Story 5 (P3)**: Depends on US1 Audio Service - Requires Web Audio API integration

### Within Each User Story

- Tests (T022-T026, T038-T042, etc.) MUST be written and FAIL before implementation
- Services before components (Audio/Catalog Service before UI)
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] (T002-T008) can run in parallel
- All Foundational tasks marked [P] (T012-T014, T017-T018, T020) can run in parallel (within Phase 2)
- Once Foundational phase completes, user stories can start in priority order
  - Tests for each user story marked [P] can run in parallel (T022-T026, T038-T042, etc.)
  - Component implementations marked [P] can run in parallel (T029-T031, T045-T047, etc.)
- All Polish tasks marked [P] (T086-T091, T096-T097) can run in parallel

---

## Parallel Example: User Story 1 (MVP)

```bash
# Launch all tests for User Story 1 together:
Task: "Write Catalog Service unit tests (fetch, search, get by ID) in tests/unit/services/CatalogService.test.ts"
Task: "Write Audio Service unit tests (play, pause, state) in tests/unit/services/AudioService.test.ts"
Task: "Write Catalog Component tests (render, list display) in tests/unit/components/Catalog.test.tsx"
Task: "Write Audio Player Component tests (play button, state) in tests/unit/components/AudioPlayer.test.tsx"
Task: "Write E2E test for catalog browse and playback in tests/e2e/catalog-browse.spec.ts"

# Launch all component implementations together:
Task: "Create Catalog Component with song list display in src/components/catalog/Catalog.tsx"
Task: "Create Audio Player Component with play/pause controls in src/components/player/AudioPlayer.tsx"
Task: "Create Song Item Component for catalog list items in src/components/catalog/SongItem.tsx"
Task: "Create loading skeleton components for catalog in src/components/common/LoadingSkeleton.tsx"
Task: "Add error banner component for catalog fetch failures in src/components/common/ErrorBanner.tsx"
```

---

## Parallel Example: User Story 2 (MVP)

```bash
# Launch all tests for User Story 2 together:
Task: "Write Cache Service unit tests (cache, remove, progress) in tests/unit/services/CacheService.test.ts"
Task: "Write IndexedDB wrapper tests (open, transaction, CRUD) in tests/unit/utils/indexedDB.test.ts"
Task: "Write Cache Icon Component tests (click, state display) in tests/unit/components/CacheIcon.test.tsx"
Task: "Write Cache Progress Component tests (percentage display) in tests/unit/components/CacheProgress.test.tsx"
Task: "Write E2E test for cache song and offline playback in tests/e2e/cache-offline.spec.ts"

# Launch all caching component implementations together:
Task: "Create Cache Icon Component (tap to cache, state indicators) in src/components/catalog/CacheIcon.tsx"
Task: "Create Cache Progress Component (download percentage display) in src/components/catalog/CacheProgress.tsx"
Task: "Update Song Item Component to display cache status in src/components/catalog/SongItem.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup (T001-T010)
2. Complete Phase 2: Foundational (T011-T021) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T022-T037)
4. Complete Phase 4: User Story 2 (T038-T053)
5. **STOP and VALIDATE**: Run all tests, verify PWA functionality, test offline mode
6. Deploy/demo MVP as working offline-first PWA music player

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Browse and Play) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (Cache Songs) → Test independently → Deploy/Demo (Complete MVP!)
4. Add User Story 3 (Playback Controls) → Test independently → Deploy/Demo
5. Add User Story 4 (Manage Cache) → Test independently → Deploy/Demo
6. Add User Story 5 (Music Visualizer) → Test independently → Deploy/Demo
7. Complete Polish & Cross-Cutting Concerns → Final release
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T021)
2. Once Foundational is done:
   - Developer A: User Story 1 - Browse and Play (T022-T037)
   - Developer B: User Story 2 - Cache Songs (T038-T053) - can work in parallel
3. After US1 complete:
   - Developer A: User Story 3 - Playback Controls (T054-T066)
   - Developer B: User Story 4 - Manage Cache (T067-T075)
4. Developer C: User Story 5 - Music Visualizer (T076-T085)
5. Team completes Polish phase together (T086-T101)

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story (US1-US5) for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD approach)
- Run `npm test && npm run lint && npm run typecheck` after each task or logical group
- Stop at any checkpoint to validate story independently
- All PWA requirements must pass (Service Worker, offline capability, installable)
- Performance targets must be met (playback <3s streaming, <1s cached, catalog load <3s)
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Success Criteria Validation

Per spec.md success criteria, verify:

- **SC-001**: Users can discover and start playing a song within 10 seconds ✓ (catalog browse + playback tests)
- **SC-002**: Cached songs start playback within 1 second ✓ (IndexedDB loading tests)
- **SC-003**: Users can successfully cache a 5MB song within 30 seconds ✓ (cache progress tests)
- **SC-004**: 95% of users successfully complete their first song cache on first attempt ✓ (cache error handling tests)
- **SC-005**: Playback controls respond to user input within 100 milliseconds ✓ (playback control tests)
- **SC-006**: The app functions fully offline once at least one song is cached ✓ (offline E2E tests)
- **SC-007**: Visualizer updates in real-time during playback with no visible lag ✓ (visualizer performance tests)
- **SC-008**: Users can navigate the entire app interface using touch gestures on mobile devices ✓ (mobile-first responsive tests)
- **SC-009**: The app loads and displays the catalog within 3 seconds on a typical mobile connection ✓ (performance tests)
- **SC-010**: Storage management operations (view, remove songs) complete within 1 second ✓ (cache management tests)

---

## Summary

**Total Task Count**: 101 tasks

**Task Count per User Story**:
- Setup (Phase 1): 10 tasks
- Foundational (Phase 2): 11 tasks
- User Story 1 (Browse and Play): 16 tasks (5 tests + 11 implementation)
- User Story 2 (Cache Songs): 16 tasks (5 tests + 11 implementation)
- User Story 3 (Playback Controls): 13 tasks (4 tests + 9 implementation)
- User Story 4 (Manage Cache): 9 tasks (3 tests + 6 implementation)
- User Story 5 (Music Visualizer): 10 tasks (3 tests + 7 implementation)
- Polish (Final Phase): 16 tasks

**Parallel Opportunities Identified**:
- Setup phase: 7 parallel tasks (T002-T008)
- Foundational phase: 5 parallel tasks (T012-T014, T017-T018, T020)
- User Story 1: 5 parallel tests, 5 parallel components
- User Story 2: 5 parallel tests, 3 parallel components
- User Story 3: 3 parallel tests
- User Story 4: 3 parallel tests
- User Story 5: 3 parallel tests
- Polish phase: 6 parallel tasks

**Suggested MVP Scope**: User Stories 1 & 2 (Browse and Play + Cache Songs) - Complete catalog browsing, audio playback, and offline caching. This provides immediate value as a working offline-first PWA music player.

**Independent Test Criteria for Each Story**:
- **US1**: Access catalog, select song, verify playback starts within 3 seconds
- **US2**: Select songs for download, disconnect internet, verify cached songs play offline
- **US3**: Play song, test all controls (play/pause/next/previous/seek/volume)
- **US4**: View cached songs, remove songs, verify storage freed
- **US5**: Play song, observe visualizer responds to audio, toggle on/off

**Format Validation**: ✅ ALL tasks follow the checklist format (checkbox, ID, labels, file paths)
