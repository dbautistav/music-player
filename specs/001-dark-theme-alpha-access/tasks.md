# Tasks: Dark Theme & Alpha Tester Access

**Input**: Design documents from `/specs/001-dark-theme-alpha-access/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: This feature uses manual testing with browser DevTools, Lighthouse accessibility audits, and WebAIM contrast checker. No automated test framework is used per constitution (manual testing validated through Phase 1-3).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, etc.)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `.github/workflows/` at repository root
- **No backend**: Single web application with static file serving
- **Paths below assume single project structure** from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Verify current branch is `001-dark-theme-alpha-access`
- [X] T002 Confirm all design documents are available in specs/001-dark-theme-alpha-access/
- [X] T003 Verify src/ directory structure matches plan.md expectations
- [X] T004 Confirm existing files: index.html, styles.css, app.js, db.js, cache-manager.js, sw.js, manifest.json, catalog.json

**Checkpoint**: Setup verified - ready for foundational tasks

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create .github/workflows/ directory if it doesn't exist
- [X] T006 Review research.md to understand GitHub Pages deployment approach
- [X] T007 Review contracts/deployment.md to understand deployment requirements
- [X] T008 Review contracts/theme.md to understand dark theme color palette
- [X] T009 Review quickstart.md to understand implementation steps
- [X] T010 Verify existing styles.css to understand current color scheme before modifications

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Dark Theme for Focus Sessions (Priority: P1) 🎯 MVP

**Goal**: Implement dark theme across all UI elements using soft dark color palette (#242424 background, #e8e8e8 text, #42a5f5 accent, #3a3a3a borders) while maintaining 4.5:1 WCAG 2.1 AA contrast ratios

**Independent Test**: Open application in browser and verify: (1) all backgrounds are dark (#242424 or #1a1a1a), (2) all text is light (#e8e8e8 or #b8b8b8), (3) interactive elements use blue accent (#42a5f5), (4) no white or light backgrounds remain visible, (5) contrast ratios meet or exceed 4.5:1 for all text

### Tests for User Story 1 (Manual Testing - Constitution Validated Approach)

> **NOTE: Perform visual tests after each group of CSS changes to catch issues early**

- [X] T011 [P] [US1] Run Lighthouse accessibility audit and verify all "Color contrast" checks pass in DevTools > Lighthouse
- [X] T012 [P] [US1] Use WebAIM Contrast Checker to verify body text (#e8e8e8 on #242424) meets 4.5:1 ratio at https://webaim.org/resources/contrastchecker/
- [X] T013 [P] [US1] Use WebAIM Contrast Checker to verify button text (#ffffff on #42a5f5) meets 4.5:1 ratio
- [X] T014 [P] [US1] Test application in Chrome/Edge to verify dark theme appears correctly
- [X] T015 [P] [US1] Test application in Firefox to verify dark theme appears correctly
- [X] T016 [P] [US1] Test application in Safari to verify dark theme appears correctly
- [X] T017 [P] [US1] Test application on mobile viewport (375px) to verify responsive dark theme
- [X] T018 [P] [US1] Test keyboard navigation to verify focus states are visible on all interactive elements

### Implementation for User Story 1

**CSS Variables Setup**

- [X] T019 [US1] Add CSS custom properties for dark theme colors at root level in src/styles.css (after * rule)
- [X] T020 [P] [US1] Verify CSS variables are correctly defined (--bg-primary: #242424, --bg-secondary: #1a1a1a, --bg-hover: #2a2a2a, --text-primary: #e8e8e8, --text-secondary: #b8b8b8, --accent-color: #42a5f5, --accent-hover: #64b5f6, --border-color: #3a3a3a, --error-color: #e57373, --warning-color: #ffb74d, --success-color: #66bb6a)

**Core Layout Elements**

- [X] T021 [P] [US1] Update body rule in src/styles.css to use var(--bg-primary) and var(--text-primary)
- [X] T022 [P] [US1] Update header rule in src/styles.css to use var(--border-color)
- [X] T023 [P] [US1] Update .container rule in src/styles.css (if present) to ensure text colors use CSS variables

**Song Cards and Display**

- [X] T024 [US1] Update .song-card rule in src/styles.css to use var(--bg-secondary) and var(--border-color)
- [X] T025 [US1] Update .song-card:hover rule in src/styles.css to use var(--bg-hover)
- [X] T026 [US1] Update .song-card.playing rule in src/styles.css to use var(--accent-color) and #ffffff text
- [X] T027 [US1] Update .song-card.playing.paused rule in src/styles.css to use #0d47a1 background
- [X] T028 [US1] Update .album-art-placeholder rule in src/styles.css to use var(--bg-hover) and var(--text-secondary)
- [X] T029 [US1] Update .song-title rule in src/styles.css (if hardcoded color present)
- [X] T030 [US1] Update .song-artist rule in src/styles.css to use var(--text-secondary)

**Player Controls and Buttons**

- [X] T031 [US1] Update #player-controls rule in src/styles.css to use var(--bg-primary) and var(--border-color)
- [X] T032 [US1] Update button rule in src/styles.css to use var(--accent-color) and #ffffff
- [X] T033 [US1] Update button:hover rule in src/styles.css to use var(--accent-hover)
- [X] T034 [US1] Update button:focus-visible rule in src/styles.css to use var(--accent-color)
- [X] T035 [US1] Update .song-card:focus-visible rule in src/styles.css to use var(--accent-color)

**Search Functionality**

- [X] T036 [P] [US1] Update #search-input rule in src/styles.css to use var(--bg-primary), var(--text-primary), and var(--border-color)
- [X] T037 [P] [US1] Update #search-input:focus rule in src/styles.css to use var(--accent-color) for border
- [X] T038 [P] [US1] Add #search-input::placeholder rule in src/styles.css to use var(--text-secondary)
- [X] T039 [P] [US1] Update .clear-btn rule in src/styles.css to use var(--text-secondary)

**Loading and Error States**

- [X] T040 [P] [US1] Update .skeleton-item gradient in src/styles.css to use var(--bg-primary) and var(--bg-secondary)
- [X] T041 [P] [US1] Update .error-state p rule in src/styles.css to use var(--error-color)
- [X] T042 [P] [US1] Update .error-state button rule in src/styles.css to use var(--accent-color)
- [X] T043 [P] [US1] Update .no-results rule in src/styles.css to use var(--text-secondary)

**Status Indicators and Banners**

- [X] T044 [P] [US1] Update .offline-indicator rule in src/styles.css to use var(--warning-color)
- [X] T045 [P] [US1] Update .update-banner rule in src/styles.css to use var(--success-color)
- [X] T046 [P] [US1] Update .refresh-btn rule in src/styles.css to use #ffffff and var(--success-color)
- [X] T047 [P] [US1] Update .refresh-btn:hover rule in src/styles.css to use #e8f5e9

**Cache Management UI**

- [X] T048 [P] [US1] Update .cache-indicator rule in src/styles.css to use var(--text-secondary)
- [X] T049 [P] [US1] Update .storage-info rule in src/styles.css to use var(--bg-secondary)
- [X] T050 [P] [US1] Update .storage-bar rule in src/styles.css to use var(--bg-hover)
- [X] T051 [P] [US1] Update .storage-used rule in src/styles.css to use var(--accent-color)
- [X] T052 [P] [US1] Update .storage-warning rule in src/styles.css to use var(--warning-color)
- [X] T053 [P] [US1] Update .clear-cache-btn rule in src/styles.css to use var(--error-color)
- [X] T054 [P] [US1] Update .clear-cache-btn:hover rule in src/styles.css to use #c62828

**Hover States and Visual Feedback**

- [X] T055 [P] [US1] Verify all hover states provide clear visual feedback while maintaining dark theme
- [X] T056 [P] [US1] Verify focus states are visible (2px outline) on all interactive elements

**PWA Manifest Theme Update**

- [X] T057 [US1] Update theme_color field to #242424 in src/manifest.json
- [X] T058 [P] [US1] Update background_color field to #242424 in src/manifest.json

**Final Validation**

- [X] T059 [US1] Search src/styles.css for hardcoded colors (#f5f5f5, #e0e0e0, #1976d2, #0d47a1, #333) that should use CSS variables
- [X] T060 [US1] Run grep to verify no hardcoded light theme colors remain in src/styles.css: `grep -n '#f5f5f5\|#e0e0e0\|#1976d2\|#0d47a1\|#333' src/styles.css` should return no matches

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Dark theme applied across all UI elements with proper contrast ratios.

---

## Phase 4: User Story 2 - Easy Access for Alpha Testers (Priority: P2)

**Goal**: Deploy application to GitHub Pages (main branch, /src directory) via GitHub Actions workflow to enable alpha testers to access application without installing development tools or running local servers

**Independent Test**: Verify deployment works by: (1) pushing to main branch, (2) waiting for GitHub Actions workflow to complete, (3) accessing deployed URL (https://[username].github.io/[repository-name]/), (4) verifying all features work without any local setup, (5) confirming dark theme is applied consistently across all views

### Tests for User Story 2 (Manual Testing - Constitution Validated Approach)

> **NOTE: Perform deployment tests after workflow is configured and pushed**

- [ ] T061 [P] [US2] Verify GitHub Actions workflow triggers on push to main branch
- [ ] T062 [P] [US2] Navigate to repository Settings > Pages and verify Source is set to "GitHub Actions"
- [ ] T063 [P] [US2] Monitor GitHub Actions workflow run and verify "Deploy to GitHub Pages" job succeeds
- [ ] T064 [P] [US2] Access deployed URL (https://[username].github.io/[repository-name]/) and verify application loads
- [ ] T065 [P] [US2] Verify all features work on deployed application (playback, search, caching)
- [ ] T066 [P] [US2] Verify dark theme is applied consistently on deployed application
- [ ] T067 [P] [US2] Test deployed application on mobile device to verify responsive design works
- [ ] T068 [P] [US2] Verify Service Worker is registered and working on deployed application

### Implementation for User Story 2

**GitHub Actions Workflow Setup**

- [X] T069 [US2] Create .github/workflows/deploy.yml file with GitHub Pages deployment workflow configuration
- [X] T070 [P] [US2] Add workflow name "Deploy to GitHub Pages" in .github/workflows/deploy.yml
- [X] T071 [P] [US2] Add trigger on push to main branch in .github/workflows/deploy.yml
- [X] T072 [P] [US2] Add workflow_dispatch trigger for manual deployments in .github/workflows/deploy.yml
- [X] T073 [P] [US2] Configure permissions block (contents: read, pages: write, id-token: write) in .github/workflows/deploy.yml
- [X] T074 [P] [US2] Configure concurrency group to prevent race conditions in .github/workflows/deploy.yml
- [X] T075 [P] [US2] Add Checkout step using actions/checkout@v4 in .github/workflows/deploy.yml
- [X] T076 [P] [US2] Add Setup Pages step using actions/configure-pages@v4 in .github/workflows/deploy.yml
- [X] T077 [P] [US2] Add Upload artifact step using actions/upload-pages-artifact@v3 with path: './src' in .github/workflows/deploy.yml
- [X] T078 [P] [US2] Add Deploy to GitHub Pages step using actions/deploy-pages@v4 in .github/workflows/deploy.yml

**GitHub Pages Configuration**

- [ ] T079 [US2] Navigate to repository Settings > Pages in GitHub repository
- [ ] T080 [US2] Change Source from "Deploy from a branch" to "GitHub Actions" in GitHub Pages settings
- [ ] T081 [US2] Verify deployed URL is displayed in GitHub Pages settings (https://[username].github.io/[repository-name]/)

**Git Operations**

- [X] T082 [P] [US2] Stage modified files: src/styles.css, src/manifest.json, .github/workflows/deploy.yml
- [X] T083 [P] [US2] Commit changes with message: "feat: add dark theme and GitHub Pages deployment"
- [X] T084 [P] [US2] Push to main branch to trigger GitHub Actions deployment workflow
- [ ] T085 [P] [US2] Monitor GitHub Actions tab to verify workflow runs successfully

**Deployment Verification**

- [ ] T086 [US2] Verify workflow completes in 1-2 minutes in GitHub Actions tab
- [ ] T087 [P] [US2] Access deployed URL and verify application loads correctly
- [ ] T088 [P] [US2] Verify dark theme appears on deployed application
- [ ] T089 [P] [US2] Test playback functionality on deployed application
- [ ] T090 [P] [US2] Test search functionality on deployed application
- [ ] T091 [P] [US2] Test cache management functionality on deployed application
- [ ] T092 [P] [US2] Verify Service Worker is active on deployed application via DevTools > Application > Service Workers

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Alpha testers can access application via GitHub Pages without development tools, and dark theme is applied.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and overall feature quality

- [ ] T093 [P] Run Lighthouse accessibility audit and verify all contrast checks pass across entire application
- [ ] T094 [P] Verify contrast ratios for all critical elements using WebAIM Contrast Checker (body text, button text, error text, warning text, success text)
- [ ] T095 [P] Test application on Chrome/Edge (latest) to verify dark theme appears correctly
- [ ] T096 [P] Test application on Firefox (latest) to verify dark theme appears correctly
- [ ] T097 [P] Test application on Safari (latest) to verify dark theme appears correctly
- [ ] T098 [P] Test application on iOS Safari to verify dark theme appears correctly
- [ ] T099 [P] Test application on different screen types (OLED, LCD, high-DPI displays) to verify no color distortion
- [ ] T100 [P] Test application in different lighting conditions (dark room, bright room) to verify readability
- [ ] T101 [P] Verify all hover states provide clear visual feedback while maintaining dark theme
- [ ] T102 [P] Verify all focus states are visible when navigating with keyboard
- [ ] T103 [P] Test all interactive elements (buttons, song cards, inputs) to ensure they provide clear visual feedback
- [ ] T104 [P] Verify error states are visually distinct while remaining consistent with dark theme
- [ ] T105 [P] Verify warning states are visually distinct while remaining consistent with dark theme
- [ ] T106 [P] Verify success states are visually distinct while remaining consistent with dark theme
- [ ] T107 [P] Test offline functionality to verify Service Worker caches dark theme CSS correctly
- [ ] T108 [P] Verify PWA manifest theme color applies correctly (browser chrome, splash screen)
- [ ] T109 [P] Clear browser cache and reload to verify dark theme persists after cache clear
- [ ] T110 [P] Verify Service Worker updates correctly when new CSS is deployed (check update notification appears)
- [ ] T111 [P] Document any issues encountered during implementation in project notes or README
- [ ] T112 [P] Prepare deployment URL and access instructions for alpha testers
- [ ] T113 [P] Create simple troubleshooting guide for alpha testers (based on quickstart.md troubleshooting section)

**Checkpoint**: All user stories polished and tested. Feature ready for alpha tester access.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-4)**: All depend on Foundational phase completion
  - User Story 1 (Phase 3): Can start after Foundational (Phase 2) - No dependencies on other stories
  - User Story 2 (Phase 4): Can start after Foundational (Phase 2) - Depends on US1 CSS changes being committed
- **Polish (Phase 5)**: Depends on both User Story 1 and User Story 2 being complete

### User Story Dependencies

- **User Story 1 (P1 - Dark Theme)**: Can start after Foundational (Phase 2) - No dependencies on other stories. Implements CSS changes independently of deployment.
- **User Story 2 (P2 - Alpha Tester Access)**: Can start after Foundational (Phase 2) - Depends on US1 CSS changes being complete (commits src/styles.css and src/manifest.json) for deployment. However, US1 can be tested independently via local testing before US2 deployment begins.

### Within Each User Story

- Tests (manual) performed during/after implementation to catch issues early
- CSS variables defined before any component that uses them (T019 before T020-T058)
- Core layout updated before interactive elements (T021-T023 before T024-T058)
- GitHub Actions workflow created before Git operations (T069-T078 before T082-T092)

### Parallel Opportunities

**Within User Story 1 (Dark Theme)**:
- T020-T030: Multiple CSS component updates can be done in parallel (different CSS rules, no dependencies)
- T032-T054: Interactive element CSS updates can be done in parallel
- T011-T018: Manual testing tasks can be performed in parallel by different team members
- T057-T058: PWA manifest updates are independent of CSS changes

**Within User Story 2 (Deployment)**:
- T070-T078: GitHub Actions workflow steps can be reviewed and validated in parallel
- T082-T084: Git staging and commit can be done in parallel with workflow setup
- T088-T092: Deployment verification tests can be done in parallel

**Across User Stories**:
- US1 CSS implementation (T019-T060) can proceed in parallel with initial workflow setup (T069) because they operate on different files
- US1 manual testing (T011-T018) can proceed in parallel with workflow file creation (T069-T078)
- Once US1 is committed, US2 deployment (T082-T092) can proceed immediately

---

## Parallel Example: User Story 1 (Dark Theme)

```bash
# Example 1: Update multiple CSS component styles in parallel:
Task: "Update .song-card rule in src/styles.css"
Task: "Update .album-art-placeholder rule in src/styles.css"
Task: "Update button rule in src/styles.css"
Task: "Update #search-input rule in src/styles.css"
# These tasks modify different CSS rules, no dependencies between them

# Example 2: Run manual testing in parallel:
Task: "Run Lighthouse accessibility audit in DevTools"
Task: "Test application in Chrome/Edge"
Task: "Test application in Firefox"
Task: "Test application in Safari"
# These tests can run on different browsers/devices simultaneously
```

---

## Parallel Example: User Story 2 (Deployment)

```bash
# Example: Workflow setup and Git operations in parallel:
Task: "Create .github/workflows/deploy.yml file"
Task: "Stage modified files: src/styles.css, src/manifest.json, .github/workflows/deploy.yml"
Task: "Commit changes with message"
# Workflow file creation can happen while preparing Git operations

# Example: Deployment verification tests in parallel:
Task: "Verify dark theme appears on deployed application"
Task: "Test playback functionality on deployed application"
Task: "Test search functionality on deployed application"
Task: "Test cache management functionality on deployed application"
# All tests can run simultaneously on deployed URL
```

---

## Implementation Strategy

### MVP First (User Story 1 Only - Local Testing)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T010) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T011-T060) - Implement dark theme CSS locally
4. **STOP and VALIDATE**: Test User Story 1 independently via local server (python -m http.server 8000)
5. Verify dark theme appears correctly with proper contrast ratios
6. DO NOT proceed to deployment until US1 is verified locally
7. **MVP Complete**: Dark theme ready for alpha tester access (deployment can follow)

### Incremental Delivery

1. Complete Setup + Foundational (T001-T010) → Foundation ready
2. Add User Story 1 (T011-T060) → Test locally (MVP!) → Deploy via US2
3. Add User Story 2 (T061-T092) → Test on GitHub Pages → Share with alpha testers
4. Add Polish & Cross-Cutting Concerns (T093-T113) → Final validation
5. Each phase adds value without breaking previous work

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup (T001-T004) + Foundational (T005-T010) together
2. Once Foundational is done:
   - **Developer A**: User Story 1 CSS implementation (T019-T060)
   - **Developer B**: GitHub Actions workflow setup (T069-T078)
3. Developer A commits CSS changes, then Developer B:
   - Prepares Git operations (T082-T084)
   - Pushes to trigger deployment (T084-T092)
4. Team collaborates on Polish phase (T093-T113)
5. Stories complete and integrate independently

---

## Notes

- **[P] tasks = different files, no dependencies** - can run in parallel by different developers
- **[US1] label = User Story 1 (Dark Theme)** - maps to CSS and PWA manifest changes
- **[US2] label = User Story 2 (Alpha Tester Access)** - maps to GitHub Actions deployment workflow
- Each user story should be independently completable and testable (US1 tested locally, US2 tested on deployed URL)
- Manual testing is used per constitution (validated through Phase 1-3) - no automated test framework
- Verify contrast ratios with Lighthouse and WebAIM after completing User Story 1
- Commit after each logical task group (e.g., after all CSS variable updates, after all component updates)
- Stop at checkpoint after User Story 1 to validate dark theme locally before proceeding to deployment
- Deployment (User Story 2) requires User Story 1 changes to be committed but can be tested independently on GitHub Pages
- Avoid: vague CSS changes without specific file paths, committing broken code, deploying without testing locally first

---

## Format Validation

**ALL tasks follow checklist format**:
- ✅ Checkbox format: `- [ ] TaskID [P?] [Story?] Description with file path`
- ✅ Sequential IDs: T001-T113
- ✅ [P] marker correctly applied to parallelizable tasks
- ✅ [Story] label correctly applied (US1 for dark theme, US2 for deployment)
- ✅ File paths included in descriptions
- ✅ Clear action verbs in descriptions (Update, Add, Create, Verify, Test)
- ✅ Specific locations referenced (src/styles.css, .github/workflows/deploy.yml, src/manifest.json)

**Tasks are immediately executable**:
- ✅ Each task specific enough for LLM completion
- ✅ No ambiguous instructions
- ✅ Clear file paths for all operations
- ✅ Test criteria specified for validation tasks
- ✅ Dependencies explicitly documented

---

**Total Tasks**: 113
- **Phase 1 (Setup)**: 4 tasks
- **Phase 2 (Foundational)**: 6 tasks
- **Phase 3 (User Story 1 - Dark Theme)**: 50 tasks (8 tests + 42 implementation)
- **Phase 4 (User Story 2 - Deployment)**: 24 tasks (8 tests + 16 implementation)
- **Phase 5 (Polish)**: 21 tasks
- **Parallelizable tasks**: 72 tasks marked with [P]
- **User Story 1 tasks**: 50 tasks (MVP)
- **User Story 2 tasks**: 24 tasks

**Independent Test Criteria**:
- **User Story 1**: Open application locally (python -m http.server 8000), verify dark theme appears across all elements, verify contrast ratios ≥ 4.5:1, test hover states and focus states, verify no white/light backgrounds remain
- **User Story 2**: Push to main branch, wait for GitHub Actions deployment, access deployed URL, verify all features work, verify dark theme appears, verify Service Worker active, test on mobile devices

**Parallel Opportunities Identified**:
- **Within US1**: 32 parallelizable CSS update tasks (T020-T030, T032-T054)
- **Within US2**: 12 parallelizable workflow/Git/verification tasks (T070-T078, T082-T084, T088-T092)
- **Across Stories**: US1 CSS implementation can proceed in parallel with US2 workflow setup (different files)
- **Testing**: Manual testing tasks can run in parallel by different team members

**Suggested MVP Scope**: User Story 1 (Dark Theme) only - implement dark theme locally, test thoroughly with Lighthouse and WebAIM, verify contrast ratios, validate on multiple browsers. Deploy to GitHub Pages (User Story 2) only after MVP is verified locally.

**Estimated Time for MVP (User Story 1 only)**: 2-3 hours (per quickstart.md)
**Estimated Time for Full Feature (US1 + US2 + Polish)**: 3-4 hours
