# Tasks: Static Music Player

**Input**: Design documents from `/specs/004-static-playback/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md, quickstart.md
**Tests**: Manual testing only (no automated tests - per constitution Phase 1-2)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root
- Paths shown below assume single project structure from plan.md

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Create project structure and empty files

- [X] T001 Create project directory structure at src/ and src/songs/
- [X] T002 Create empty index.html in src/index.html
- [X] T003 [P] Create empty styles.css in src/styles.css
- [X] T004 [P] Create empty app.js in src/app.js

**Checkpoint**: Project structure ready - ready for foundational tasks

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data structures and state that all user stories depend on

**⚠️ CRITICAL**: No user story implementation can begin until this phase is complete

- [X] T005 Define songs array data structure with 3 song objects in src/app.js
- [X] T006 [P] Define state variables (currentSongIndex, isPlaying) in src/app.js
- [X] T007 [P] Initialize audioElement instance in src/app.js
- [X] T008 Define renderSongList() function placeholder in src/app.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Available Songs (Priority: P1) 🎯 MVP

**Goal**: Display exactly three songs with titles and artists, immediately visible on page load, responsive layout from 320px to 1920px

**Independent Test**: Open application and verify exactly three songs are displayed with titles and artists visible on screen. Test responsiveness at 375px (mobile), 768px (tablet), and 1920px (desktop). Verify layout is readable and properly formatted.

### Implementation for User Story 1

- [X] T009 [US1] Create HTML structure with semantic header, main, and song-list div in src/index.html
- [X] T010 [US1] Create CSS reset and base styles (body, container, header) in src/styles.css
- [X] T011 [US1] Implement song-list CSS grid layout in src/styles.css
- [X] T012 [US1] Create song-card CSS styling (flexbox, padding, hover, playing state) in src/styles.css
- [X] T013 [US1] Implement responsive breakpoints for mobile (768px) and desktop (1024px) in src/styles.css
- [X] T014 [US1] Implement renderSongList() function to generate song cards dynamically in src/app.js
- [X] T015 [US1] Add meta viewport tag in src/index.html for mobile responsiveness
- [X] T016 [US1] Link styles.css in src/index.html
- [X] T017 [US1] Link app.js in src/index.html

**Checkpoint**: At this point, User Story 1 should be fully functional and independently testable. Three songs display with titles and artists, layout is responsive across all screen widths.

---

## Phase 4: User Story 2 - Play a Song (Priority: P1)

**Goal**: Allow users to click on any song to start playback within one second, ensure only one song plays at a time, provide visual feedback for currently playing song

**Independent Test**: Click on any song and verify audio begins playing within one second. Click on a different song and verify the previous song stops. Verify visual feedback (highlighting, background color change) shows which song is currently playing.

### Implementation for User Story 2

- [X] T018 [US2] Implement playSong(index) function in src/app.js
- [X] T019 [US2] Set audioElement.src to song URL in playSong() function in src/app.js
- [X] T020 [US2] Call audioElement.play() in playSong() function in src/app.js
- [X] T021 [US2] Update currentSongIndex state in playSong() function in src/app.js
- [X] T022 [US2] Update isPlaying state to true in playSong() function in src/app.js
- [X] T023 [US2] Add visual feedback (playing CSS class) to current song card in playSong() function in src/app.js
- [X] T024 [US2] Add try-catch error handling around audio playback in playSong() function in src/app.js
- [X] T025 [US2] Re-render song list after playback starts in playSong() function in src/app.js
- [X] T026 [US2] Add click event listeners to song cards in renderSongList() function in src/app.js
- [X] T027 [US2] Add audio error event listener to display user-friendly error message in src/app.js

**Checkpoint**: At this point, User Story 1 AND 2 should both work independently. Users can view songs and click to play them with visual feedback.

---

## Phase 5: User Story 3 - Control Playback (Priority: P2)

**Goal**: Provide visible play/pause button, allow users to pause audio immediately, resume from exact point where paused, update button icon/text to reflect current state

**Independent Test**: Play a song, then click pause button and verify audio stops immediately. Click play button and verify audio resumes from exact point where it paused. Verify button text/icon toggles between "Play" and "Pause".

### Implementation for User Story 3

- [X] T028 [P] [US3] Add HTML playback controls section with play/pause button in src/index.html
- [X] T029 [US3] Create button CSS styling (touch targets 44x44px, hover states) in src/styles.css
- [X] T030 [US3] Implement togglePlayPause() function in src/app.js
- [X] T031 [US3] Implement pauseSong() function that calls audioElement.pause() in src/app.js
- [X] T032 [US3] Implement resumeSong() function that calls audioElement.play() in src/app.js
- [X] T033 [US3] Update isPlaying state to false in pauseSong() function in src/app.js
- [X] T034 [US3] Update isPlaying state to true in resumeSong() function in src/app.js
- [X] T035 [US3] Add ARIA labels to play/pause button in src/index.html
- [X] T036 [US3] Add click event listener to play/pause button in src/app.js
- [X] T037 [US3] Add audio ended event listener to update button state when song finishes in src/app.js

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently. Users can view, play, and control playback of songs.

---

## Phase 6: User Story 4 - Navigate Between Songs (Priority: P3)

**Goal**: Provide next and previous navigation buttons, implement loop navigation (last→first, first→last), automatically play newly navigated song

**Independent Test**: Use next button to cycle through all songs, verify it loops from last back to first. Use previous button to cycle through all songs, verify it loops from first to last. Verify each navigation automatically plays the new song.

### Implementation for User Story 4

- [X] T038 [P] [US4] Add next and previous buttons to playback controls HTML in src/index.html
- [X] T039 [P] [US4] Add CSS styling for playback controls container (flexbox, gap) in src/styles.css
- [X] T040 [US4] Implement nextSong() function using modulo arithmetic in src/app.js
- [X] T041 [US4] Implement previousSong() function using modulo arithmetic in src/app.js
- [X] T042 [US4] Call playSong() from nextSong() and previousSong() functions in src/app.js
- [X] T043 [US4] Add ARIA labels to next and previous buttons in src/index.html
- [X] T044 [US4] Add click event listeners to next and previous buttons in src/app.js

**Checkpoint**: All user stories should now be independently functional. Users can view, play, control, and navigate through all songs with loop behavior.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T045 Add error state UI function showErrorState(message) in src/app.js
- [X] T046 [P] Add duration formatting helper function (seconds to MM:SS) in src/app.js
- [X] T047 [P] Integrate duration display in song cards using helper function in src/app.js
- [X] T048 Add console.error() statements for debugging audio failures in src/app.js
- [X] T049 [P] Add accessibility improvements (focus states, color contrast verification) in src/styles.css
- [X] T050 [P] Test and validate all user stories against spec acceptance scenarios
- [X] T051 [P] Run quickstart.md validation checklist from /specs/004-static-playback/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion (files must exist) - BLOCKS all user stories
- **User Stories (Phases 3-6)**: All depend on Foundational phase completion (data structures must exist)
  - User stories can proceed sequentially in priority order (P1 → P2 → P3)
  - Some tasks marked [P] can run in parallel within stories
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1 - View Songs)**: Can start after Foundational - No dependencies on other stories. Independently testable after Phase 3.
- **User Story 2 (P1 - Play Song)**: Can start after Foundational - Integrates with US1 song list but should be independently testable. Independently testable after Phase 4.
- **User Story 3 (P2 - Control Playback)**: Can start after US1 and US2 complete - Builds on playback infrastructure from US2. Independently testable after Phase 5.
- **User Story 4 (P3 - Navigate Songs)**: Can start after US1, US2, US3 complete - Uses playback functions from US2 and US3. Independently testable after Phase 6.

### Within Each User Story

- Core implementation before UI integration
- Event listeners attached in DOMContentLoaded
- Error handling around critical operations
- State updates trigger UI re-renders
- Story complete before moving to next priority

### Parallel Opportunities

- Phase 1: T003 and T004 can run in parallel (different files)
- Phase 2: T006 and T007 can run in parallel (independent initializations)
- Phase 3: T012 and T013 can run in parallel (different CSS sections)
- Phase 5: T028 and T029 can run in parallel (HTML and CSS)
- Phase 6: T038 and T039 can run in parallel (HTML and CSS)
- Phase 7: T046 and T049 can run in parallel (different functions)

---

## Parallel Example: User Story 1

```bash
# Launch parallel CSS tasks for User Story 1:
Task: "Create CSS reset and base styles in src/styles.css"
Task: "Implement song-list CSS grid layout in src/styles.css"
Task: "Create song-card CSS styling in src/styles.css"
Task: "Implement responsive breakpoints for mobile and desktop in src/styles.css"

# These can run in parallel by different developers or in different IDE tabs
```

```bash
# Launch parallel HTML structure tasks for User Story 1:
Task: "Create HTML structure with semantic header, main, and song-list div in src/index.html"
Task: "Add meta viewport tag in src/index.html"
Task: "Link styles.css and app.js in src/index.html"

# These can run in parallel with CSS tasks (different file)
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 Only)

1. Complete Phase 1: Setup (create empty files)
2. Complete Phase 2: Foundational (define data structures)
3. Complete Phase 3: User Story 1 (view songs)
4. Complete Phase 4: User Story 2 (play songs)
5. **STOP and VALIDATE**: Test User Stories 1 and 2 independently
6. Deploy/demo if ready

**MVP Value**: Users can view songs and play them - core music player functionality works

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Displays songs
3. Add User Story 2 → Test independently → Plays songs (MVP!)
4. Add User Story 3 → Test independently → Controls playback
5. Add User Story 4 → Test independently → Navigate songs
6. Complete Polish phase → Full feature ready
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Phase 3)
   - Developer B: User Story 2 (Phase 4) - Can start once US1 HTML structure exists
   - Developer C: User Story 3 (Phase 5) - Can start once US2 playback functions exist
3. Stories complete and integrate in priority order (P1 → P2 → P3)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Testing is manual (no automated tests for Phase 1 per constitution)
- Commit after each phase or logical task group
- Stop at each checkpoint to validate story independently
- All code follows constitution: Vanilla JS ES6+, 2-space indentation, single quotes, semicolons
- Follow quickstart.md for detailed implementation guidance and code examples

---

## Total Task Count: 51

**Breakdown by User Story**:
- Setup (Phase 1): 4 tasks
- Foundational (Phase 2): 4 tasks
- User Story 1 (Phase 3): 9 tasks
- User Story 2 (Phase 4): 10 tasks
- User Story 3 (Phase 5): 10 tasks
- User Story 4 (Phase 6): 7 tasks
- Polish (Phase 7): 7 tasks

**Parallel Opportunities Identified**: 13 tasks marked with [P] can run in parallel

---

## Suggested MVP Scope

**Minimum Viable Product**: User Story 1 + User Story 2

Complete Phases 1-4 to deliver core functionality:
- Users can view song list (US1)
- Users can click songs to play them (US2)
- Basic visual feedback for currently playing song

This provides immediate value and demonstrates core music player functionality before adding playback controls (US3) and navigation (US4).

---

## Testing Approach

Per feature specification and constitution, Phase 1 uses **manual testing only**:

**No automated test tasks** - Tests section removed from this task list

**Manual Testing Protocol** (execute at each checkpoint):
1. Open in browser: Chrome, Firefox, Safari
2. Verify no console errors
3. Test acceptance scenarios from spec.md for each user story
4. Test responsive design: 375px, 768px, 1920px
5. Test accessibility: keyboard navigation, screen reader
6. Run validation checklist from quickstart.md

---

## Format Validation

✓ **ALL tasks follow checklist format**:
- All start with `- [ ]` (checkbox)
- All have Task ID (T001-T051)
- [P] markers used where appropriate (parallelizable tasks)
- [Story] labels present for all user story phases ([US1]-[US4])
- All descriptions include exact file paths (src/index.html, src/styles.css, src/app.js)

No validation errors found.
