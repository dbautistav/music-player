# Tasks: UX Refinements - Layout Reorganization and Content Expansion

**Input**: Design documents from `/specs/006-ux-refinements/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/
**Tests**: Manual testing per constitution (Phase 1-3 validated)
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify feature branch 006-ux-refinements is active in git
- [x] T002 Verify 5 audio files (a1.mp3 through a5.mp3) exist in src/songs/ directory

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

*Note: This feature is a UI refinement with no new backend or data storage capabilities. All foundational infrastructure exists from Phase 3 completion. No blocking prerequisites needed beyond verifying audio files in Phase 1.*

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Access New Audio Content (Priority: P1) 🎯 MVP

**Goal**: Add 5 new ambient audio tracks to the music player catalog with proper metadata display ("∞" for duration, "♫" for icon, "Ambient Sounds" as artist)

**Independent Test**: Open application and verify all 5 ambient songs appear in song list with correct titles, display "∞" for duration, "♫" for icon, and play correctly when clicked. Search for "waterfall", "rain", etc. and verify results show ambient songs with proper metadata.

### Implementation for User Story 1

- [x] T003 [P] [US1] Add "Waterfall in a forest" song entry to src/catalog.json with id "song-004", artist "Ambient Sounds", url "songs/a1.mp3", duration 0, isAmbient true, albumArt "♫", genre "Ambient"
- [x] T004 [P] [US1] Add "Thunderstorm & Rain" song entry to src/catalog.json with id "song-005", artist "Ambient Sounds", url "songs/a2.mp3", duration 0, isAmbient true, albumArt "♫", genre "Ambient"
- [x] T005 [P] [US1] Add "Cafe Music" song entry to src/catalog.json with id "song-006", artist "Ambient Sounds", url "songs/a3.mp3", duration 0, isAmbient true, albumArt "♫", genre "Ambient"
- [x] T006 [P] [US1] Add "Brown Noise" song entry to src/catalog.json with id "song-007", artist "Ambient Sounds", url "songs/a4.mp3", duration 0, isAmbient true, albumArt "♫", genre "Ambient"
- [x] T007 [P] [US1] Add "Rainy Day" song entry to src/catalog.json with id "song-008", artist "Ambient Sounds", url "songs/a5.mp3", duration 0, isAmbient true, albumArt "♫", genre "Ambient"
- [x] T008 [US1] Update src/catalog.json lastUpdated field to "2026-02-01" and verify songs array contains 8 total entries (3 existing + 5 new)
- [x] T009 [US1] Modify song list rendering logic in src/app.js to check for isAmbient flag and display "∞" (infinity symbol) for duration when song.isAmbient is true
- [x] T010 [US1] Modify song list rendering logic in src/app.js to display Unicode musical note character "♫" for albumArt when song.albumArt contains Unicode character (instead of loading as image URL)
- [ ] T011 [US1] Test all 5 ambient songs play correctly when clicked and verify metadata displays properly in song list and search results

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Intuitive Playback Control Placement (Priority: P2)

**Goal**: Reposition playback controls (Previous, Play/Pause, Next) to bottom of screen with sticky positioning so they remain visible while scrolling

**Independent Test**: Load application and verify playback controls appear at bottom of screen. Scroll through song list and verify controls remain visible at bottom (sticky positioning). Click play/pause and prev/next buttons while scrolled and verify they work correctly.

### Implementation for User Story 2

- [x] T012 [US2] Move playback controls HTML element (div id="player-controls") in src/index.html from current position to bottom of <main> element, after all other content
- [x] T013 [US2] Add CSS rule to src/styles.css for #player-controls with position: sticky, bottom: 0, z-index: 100, and background-color set to var(--bg-color) or appropriate color
- [ ] T014 [US2] Test playback controls remain visible at bottom of screen while scrolling through song list and verify play/pause/prev/next buttons work correctly from new position

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Non-Intrusive Cache Management (Priority: P3)

**Goal**: Reposition cache management elements (storage usage bar and clear cache button) to very bottom of page to declutter main interface

**Independent Test**: Scroll to very bottom of page and verify storage usage bar and "Clear All Cached Songs" button appear at bottom. Play a few songs to cache them, verify storage bar shows usage, then click clear cache button and verify storage bar updates to 0.

### Implementation for User Story 3

- [x] T015 [US3] Move storage-info section HTML element in src/index.html to end of <main> element, ensuring it appears after all other content including playback controls
- [x] T016 [US3] Move cache-management section HTML element in src/index.html to end of <main> element, after storage-info section
- [ ] T017 [US3] Test cache management elements appear at very bottom of page (scroll down to see) and verify storage bar and clear cache button work correctly from new position

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Contextual Update Notifications (Priority: P3)

**Goal**: Fix "new version available" banner to display only when updates are actually available (currently shows unconditionally)

**Independent Test**: Reload application and verify "new version available" banner is hidden by default. Use browser DevTools Service Workers panel to simulate update (check "Update on reload"), reload page, verify banner appears, then click refresh button and verify page reloads and banner disappears.

### Implementation for User Story 4

- [x] T018 [US4] Verify update-banner HTML element in src/index.html has hidden attribute by default (e.g., <div id="update-banner" class="update-banner" hidden>)
- [x] T019 [US4] Modify src/sw.js to only send UPDATE_AVAILABLE message when new Service Worker version is detected (ensure controllerchange event listener properly handles update detection)
- [x] T020 [US4] Modify src/app.js message event listener for Service Worker to show update banner only when receiving UPDATE_AVAILABLE message type (ensure banner.hidden is removed only when this message is received)
- [ ] T021 [US4] Test update banner behavior: hidden by default on page load, appears when Service Worker detects new version, and disappears after user refreshes

**Checkpoint**: At this point, all user stories should be complete and functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T022 [P] Manual testing in Chrome 90+ with quickstart.md verification checklist
- [ ] T023 [P] Manual testing in Firefox 88+ with quickstart.md verification checklist
- [ ] T024 [P] Manual testing in Safari 14+ with quickstart.md verification checklist
- [ ] T025 [P] Manual testing in Edge 90+ with quickstart.md verification checklist
- [ ] T026 Verify performance targets: page loads in <3s on 3G, playback latency <1s, 60fps scrolling with DevTools
- [ ] T027 Verify accessibility: keyboard navigation works, focus indicators visible, screen reader announces song metadata correctly
- [ ] T028 Verify no console errors on page load or during playback in any browser

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on US1, can be implemented independently
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - No dependencies on US1/US2, can be implemented independently
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - No dependencies on US1/US2/US3, can be implemented independently

### Within Each User Story

- **User Story 1**: Tasks T003-T007 (add 5 songs to catalog) can run in parallel [P], but must complete before T008 (update metadata) which must complete before T009-T010 (display logic) which must complete before T011 (testing)
- **User Story 2**: T012 (HTML reposition) and T013 (CSS sticky) can run in parallel [P], but both must complete before T014 (testing)
- **User Story 3**: T015 and T016 (HTML reordering) can run in parallel [P], but both must complete before T017 (testing)
- **User Story 4**: T018 (HTML verification) and T019 (Service Worker fix) can run in parallel [P], but T019 must complete before T020 (app.js fix) which must complete before T021 (testing)

### Parallel Opportunities

- **Phase 1**: T001 and T002 can run in parallel [P]
- **Phase 3 (User Story 1)**: T003-T007 (add 5 ambient songs) can all run in parallel [P]
- **Phase 4 (User Story 2)**: T012 and T013 can run in parallel [P]
- **Phase 5 (User Story 3)**: T015 and T016 can run in parallel [P]
- **Phase 6 (User Story 4)**: T018 and T019 can run in parallel [P]
- **Phase 7 (Polish)**: T022-T025 (browser testing) can all run in parallel [P]
- **Different user stories can be worked on in parallel by different team members** after Foundational phase completes

---

## Parallel Example: User Story 1

```bash
# Launch all 5 ambient song additions to catalog together:
Task: "Add Waterfall in a forest song entry to src/catalog.json..."
Task: "Add Thunderstorm & Rain song entry to src/catalog.json..."
Task: "Add Cafe Music song entry to src/catalog.json..."
Task: "Add Brown Noise song entry to src/catalog.json..."
Task: "Add Rainy Day song entry to src/catalog.json..."
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (already done - no blocking prerequisites)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently (5 ambient songs play correctly)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (P1)
   - Developer B: User Story 2 (P2)
   - Developer C: User Story 3 (P3)
   - Developer D: User Story 4 (P3)
3. Stories complete and integrate independently
4. Team collaborates on Phase 7 Polish (cross-browser testing)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Manual testing per constitution (Phase 1-3 validated manual testing approach)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
