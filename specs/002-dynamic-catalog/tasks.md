# Tasks: Dynamic Catalog & Search

**Input**: Design documents from `/specs/002-dynamic-catalog/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Manual testing only - no automated tests for Phase 2 per constitution

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root
- Paths shown below use this structure per plan.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and data source creation

- [X] T001 Create catalog.json file with sample songs in src/catalog.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core HTML structure, global state, and utility functions that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Add global state variables (catalogData, songs, currentSongIndex, isPlaying, searchQuery, filteredSongs) to src/app.js
- [X] T003 [P] Implement debounce utility function in src/app.js
- [X] T004 [P] Implement formatDuration utility function in src/app.js
- [X] T005 [P] Get DOM element references (audioPlayer, searchInput, clearBtn, songList, loadingSkeleton, errorState, errorMessage, retryBtn) in src/app.js
- [X] T006 [P] Add search input HTML structure with clear button in src/index.html
- [X] T007 [P] Add loading skeleton HTML structure in src/index.html
- [X] T008 [P] Add error state HTML structure with message and retry button in src/index.html
- [X] T009 [P] Add song list container HTML structure in src/index.html
- [X] T010 [P] Add base CSS styles for search section in src/styles.css
- [X] T011 [P] Add base CSS styles for loading skeleton in src/styles.css
- [X] T012 [P] Add base CSS styles for error state in src/styles.css
- [X] T013 [P] Add base CSS styles for song list container in src/styles.css

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Load Songs from Catalog (Priority: P1) 🎯 MVP

**Goal**: Load and display songs dynamically from catalog.json file with loading and error states

**Independent Test**: Open application in browser and verify all songs from catalog.json are displayed with metadata visible. Verify loading skeleton appears during fetch and error message with retry button appears if fetch fails.

### Implementation for User Story 1

- [X] T014 [US1] Implement showLoadingState function to display skeleton and hide song list in src/app.js
- [X] T015 [US1] Implement hideLoadingState function to hide skeleton and show song list in src/app.js
- [X] T016 [US1] Implement showErrorState function to display error message in src/app.js
- [X] T017 [US1] Implement loadCatalog async function to fetch and validate catalog.json in src/app.js
- [X] T018 [US1] Add catalog.json validation logic (check for version, songs array, required fields) in src/app.js
- [X] T019 [US1] Implement renderSongList function to display songs with DocumentFragment in src/app.js
- [X] T020 [US1] Integrate loadCatalog call on DOMContentLoaded in src/app.js
- [X] T021 [US1] Attach retry button click event listener to loadCatalog in src/app.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Songs load from catalog.json and display correctly.

---

## Phase 4: User Story 2 - Search and Filter Songs (Priority: P1)

**Goal**: Real-time search functionality with case-insensitive filtering by title or artist, debounced input, and clear button

**Independent Test**: Type search terms in search input and verify only matching songs are displayed. Verify clear button resets to show all songs and "no results" message appears when no matches found.

### Implementation for User Story 2

- [X] T022 [US2] Implement showClearButton and hideClearButton utility functions in src/app.js
- [X] T023 [US2] Add search input event listener with debounced search handler in src/app.js
- [X] T024 [US2] Implement filterSongs function with case-insensitive title and artist matching in src/app.js
- [X] T025 [US2] Implement showNoResultsMessage function to display when no songs match in src/app.js
- [X] T026 [US2] Attach clear button click event listener to reset search in src/app.js
- [X] T027 [US2] Add CSS styles for search input focus state and clear button visibility in src/styles.css
- [X] T028 [US2] Add CSS styles for no results message in src/styles.css

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Songs load and search filters correctly.

---

## Phase 5: User Story 3 - View Visual Playback Indicators (Priority: P2)

**Goal**: Visual feedback showing which song is currently playing with distinction between playing and paused states

**Independent Test**: Play a song and verify it is visually highlighted in the song list. Pause the song and verify the visual state changes. Start a new song and verify the indicator moves to the new song immediately.

### Implementation for User Story 3

- [X] T029 [US3] Add CSS styles for .playing class on song cards in src/styles.css
- [X] T030 [US3] Add CSS styles for paused state distinction in src/styles.css
- [X] T031 [US3] Implement updatePlayingState function to manage playing class on song cards in src/app.js
- [X] T032 [US3] Implement updatePlayButtonIcons function to change play/pause icons in src/app.js
- [X] T033 [US3] Update renderSongList to add 'playing' class to current song card in src/app.js
- [X] T034 [US3] Integrate updatePlayingState call when playSong is triggered in src/app.js

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently. Visual playback indicators function correctly.

---

## Phase 6: User Story 4 - View Song Metadata (Priority: P2)

**Goal**: Display detailed song information including title, artist, duration, and album art with graceful handling of missing data

**Independent Test**: View song list and verify each song displays title, artist, duration (MM:SS), and album art when provided. Verify placeholder appears for missing album art and text is readable on mobile (375px).

### Implementation for User Story 4

- [X] T035 [US4] Implement createSongCard function to build song card HTML with metadata in src/app.js
- [X] T036 [US4] Add album art image element with lazy loading to song card in src/app.js
- [X] T037 [US4] Add album art placeholder div for songs without album art URL in src/app.js
- [X] T038 [US4] Integrate formatDuration call to display duration in MM:SS format in src/app.js
- [X] T039 [US4] Update renderSongList to use createSongCard function in src/app.js
- [X] T040 [US4] Add CSS styles for song card layout using Flexbox in src/styles.css
- [X] T041 [US4] Add CSS styles for album art and placeholder in src/styles.css
- [X] T042 [US4] Add CSS styles for song metadata (title, artist, duration) in src/styles.css
- [X] T043 [US4] Add responsive CSS for song list grid layout (single/multi-column) in src/styles.css
- [X] T044 [US4] Add CSS styles for song card hover effects and touch targets (44px minimum) in src/styles.css

**Checkpoint**: All user stories should now be independently functional. Song metadata displays correctly with album art.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [X] T045 [P] Verify color contrast ratio is 4.5:1 or higher in src/styles.css
- [X] T046 [P] Add keyboard navigation support for search input and song cards in src/index.html
- [X] T047 [P] Add ARIA labels to search input and clear button in src/index.html
- [X] T048 [P] Add ARIA live region for search results updates in src/index.html
- [X] T049 Test catalog loading on slow network (throttle to 3G) in browser DevTools
- [X] T050 Test search performance with 100+ songs in browser DevTools
- [X] T051 Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [X] T052 Test responsive design on mobile (375px), tablet (768px), and desktop (1440px)
- [X] T053 Test album art lazy loading prevents page render blocking
- [X] T054 Test error handling with invalid JSON, network errors, and empty catalog
- [X] T055 Verify all Phase 1 features still work (playback, pause/resume, next/previous)
- [X] T056 Cross-browser validation and bug fixes in src/

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (Load Songs) can start after Foundational - No dependencies on other stories
  - US2 (Search) can start after Foundational - Integrates with US1 renderSongList but independently testable
  - US3 (Playback Indicators) can start after Foundational - Integrates with US1 playSong but independently testable
  - US4 (Song Metadata) can start after Foundational - Integrates with US1 renderSongList but independently testable
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Uses renderSongList from US1 but filterSongs is independent
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Integrates with playSong from Phase 1 but independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Integrates with renderSongList from US1 but independently testable

### Within Each User Story

- Core implementation functions before integration
- Integration before validation
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1**: T001 (single task, no parallelization)
- **Phase 2**: T003, T004 can run in parallel (different utility functions)
- **Phase 2**: T005 can run in parallel with T006-T009 (DOM refs vs HTML structure)
- **Phase 2**: T006, T007, T008, T009 can run in parallel (different HTML sections)
- **Phase 2**: T010, T011, T012, T013 can run in parallel (different CSS sections)
- **Phase 3**: T014, T015, T016 can run in parallel (different state management functions)
- **Phase 4**: T022, T024, T025 can run in parallel (different utility functions)
- **Phase 5**: T029, T030 can run in parallel (CSS for different states)
- **Phase 6**: T040-T044 can run in parallel (different CSS sections)
- **Phase 7**: T045-T048 can run in parallel (different accessibility improvements)
- **Phase 7**: T049-T052 can run in parallel (different testing scenarios)
- **Phase 7**: T053-T054 can run in parallel (different edge case testing)

---

## Parallel Example: User Story 1

```bash
# Launch state management functions together:
Task: "Implement showLoadingState function to display skeleton and hide song list in src/app.js"
Task: "Implement hideLoadingState function to hide skeleton and show song list in src/app.js"
Task: "Implement showErrorState function to display error message in src/app.js"

# Then implement core catalog loading:
Task: "Implement loadCatalog async function to fetch and validate catalog.json in src/app.js"
Task: "Add catalog.json validation logic (check for version, songs array, required fields) in src/app.js"

# Then implement rendering:
Task: "Implement renderSongList function to display songs with DocumentFragment in src/app.js"
```

---

## Parallel Example: User Story 4

```bash
# Launch CSS styling tasks together:
Task: "Add CSS styles for song card layout using Flexbox in src/styles.css"
Task: "Add CSS styles for album art and placeholder in src/styles.css"
Task: "Add CSS styles for song metadata (title, artist, duration) in src/styles.css"
Task: "Add responsive CSS for song list grid layout (single/multi-column) in src/styles.css"
Task: "Add CSS styles for song card hover effects and touch targets (44px minimum) in src/styles.css"

# Then implement JavaScript logic:
Task: "Implement createSongCard function to build song card HTML with metadata in src/app.js"
Task: "Add album art image element with lazy loading to song card in src/app.js"
Task: "Add album art placeholder div for songs without album art URL in src/app.js"
Task: "Integrate formatDuration call to display duration in MM:SS format in src/app.js"
Task: "Update renderSongList to use createSongCard function in src/app.js"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only - P1 Features)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002-T013) - CRITICAL
3. Complete Phase 3: User Story 1 (T014-T021)
4. Complete Phase 4: User Story 2 (T022-T028)
5. **STOP and VALIDATE**: Test catalog loading and search functionality independently
6. Deploy/demo if ready - Dynamic catalog with search is functional!

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Load Songs) → Test independently → **MVP 1** (Catalog loads and displays)
3. Add User Story 2 (Search) → Test independently → **MVP 2** (Search works)
4. Add User Story 3 (Playback Indicators) → Test independently → Enhanced MVP
5. Add User Story 4 (Song Metadata) → Test independently → Complete Phase 2
6. Polish & cross-cutting concerns → Final delivery

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup (T001) + Foundational (T002-T013) together
2. Once Foundational is done:
   - Developer A: User Story 1 (T014-T021)
   - Developer B: User Story 2 (T022-T028)
3. Stories complete and integrate independently
4. Developer C: User Story 3 (T029-T034) and User Story 4 (T035-T044) in parallel
5. All developers contribute to Polish phase (T045-T056)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Manual testing approach per constitution - no automated test tasks included
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Performance targets: < 1s catalog load, < 100ms search, 60fps UI
- Constitution compliance: Zero dependencies, vanilla JavaScript ES6+, mobile-first design
