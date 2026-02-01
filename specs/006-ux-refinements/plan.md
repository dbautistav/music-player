# Implementation Plan: UX Refinements - Layout Reorganization and Content Expansion

**Branch**: `006-ux-refinements` | **Date**: 2026-02-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-ux-refinements/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add 5 new ambient audio tracks to the music player catalog and reorganize the UI layout: move playback controls to bottom with sticky positioning for mobile-first accessibility, reposition cache management elements to bottom, and fix the update notification banner to display only when updates are actually available. This is a UX refinement feature that expands content library and improves control accessibility without adding new backend or data storage capabilities.

## Technical Context

**Language/Version**: JavaScript ES6+ (Chrome/Edge 90+, Firefox 88+, Safari 14+, iOS Safari 14+)
**Primary Dependencies**: None (vanilla JavaScript, zero dependencies per constitution)
**Storage**: IndexedDB for audio blobs (Phase 3), Cache API for app shell (Phase 3), catalog.json for song metadata
**Testing**: Manual testing with browser DevTools, cross-browser validation
**Target Platform**: Web application (PWA) - desktop and mobile browsers
**Project Type**: Single web application (PWA)
**Performance Goals**: TTI < 3s on 3G, FCP < 1.5s, Playback latency < 1s, 60fps UI interactions
**Constraints**: < 200KB initial bundle (excluding songs), offline-capable, mobile-first (375px base), no build tools
**Scale/Scope**: ~100 songs catalog, 5 new ambient tracks added, single-page application

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Phase Validation**: Phase 3 complete ✓
**Constitution Version**: 1.3 (validated for Phase 3)

**Gates to verify**:

1. **Zero Dependencies Gate** ✅ PASS
   - Requirement: No new dependencies for Phase 1-3
   - Status: Feature requires only vanilla JavaScript for UI repositioning and catalog updates
   - No new libraries needed for sticky positioning, Unicode icons, or update banner logic

2. **Build Tools Gate** ✅ PASS
   - Requirement: No build tools for Phase 1-3
   - Status: All changes are HTML/CSS/JavaScript with no bundling or transpilation required

3. **Browser Support Gate** ✅ PASS
   - Requirement: Chrome/Edge 90+, Firefox 88+, Safari 14+, iOS Safari 14+
   - Status: Sticky positioning (position: sticky), Unicode icons, and all features are supported in target browsers

4. **Performance Gate** ✅ PASS
   - Requirement: < 200KB bundle, < 3s TTI, 60fps UI
   - Status: 5 new audio files (~55MB total) do not affect initial bundle; UI repositioning is CSS-only; catalog update adds < 1KB to JSON

5. **Mobile-First Gate** ✅ PASS
   - Requirement: Design for 375px width, scale up
   - Status: Bottom sticky controls align with mobile-first approach; touch targets minimum 44px per constitution

**Result**: All gates PASSED ✓ - proceed to Phase 0 research

---

## Constitution Check (Post-Design)

*GATE: Re-evaluated after Phase 1 design to ensure no violations introduced*

**Design Summary**:
- 5 new ambient songs added to catalog.json with `isAmbient` flag
- Playback controls repositioned to bottom with CSS `position: sticky`
- Cache management moved to bottom via HTML reordering
- Update banner visibility fixed via Service Worker controllerchange event
- All changes use vanilla JavaScript, CSS, and HTML (no new dependencies)

**Gates Re-verification**:

1. **Zero Dependencies Gate** ✅ PASS (unchanged)
   - No new libraries or frameworks added
   - All UI repositioning uses native CSS (sticky positioning)
   - Unicode icons require no external assets
   - Service Worker logic uses existing browser APIs

2. **Build Tools Gate** ✅ PASS (unchanged)
   - No bundling or transpilation required
   - Direct file serving works for all changes
   - Catalog.json is simple JSON file

3. **Browser Support Gate** ✅ PASS (validated during research)
   - CSS `position: sticky` supported in all target browsers
   - Unicode musical note characters display correctly in all browsers
   - Service Worker controllerchange event is standard API

4. **Performance Gate** ✅ PASS (validated)
   - 5 new audio files (~55MB) do not affect initial bundle (loaded on-demand)
   - Sticky positioning is CSS-only (zero JavaScript overhead)
   - Update banner logic uses existing Service Worker lifecycle (no polling)
   - Catalog.json adds < 1KB to initial load

5. **Mobile-First Gate** ✅ PASS (validated)
   - Bottom sticky controls optimize for mobile touch interaction
   - Touch targets maintain minimum 44px per constitution
   - Layout reorganization follows mobile-first pattern

6. **Code Style Gate** ✅ PASS (validated)
   - 2-space indentation maintained
   - CamelCase naming conventions followed
   - Const/let used, no var
   - Arrow functions and template literals used

7. **Accessibility Gate** ✅ PASS (validated)
   - Semantic HTML structure maintained
   - ARIA labels preserved on all interactive elements
   - Keyboard navigation not affected by UI repositioning
   - Color contrast ratio ≥ 4.5:1 maintained

**Result**: All gates PASSED ✓ - design approved for implementation

**No Complexities to Track**: No violations requiring justification in Complexity Tracking section

---

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*None - all gates passed in both pre-design and post-design checks*

## Project Structure

### Documentation (this feature)

```text
specs/006-ux-refinements/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
├── checklists/
│   └── requirements.md  # Requirements quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── index.html          # Main HTML page (UI repositioning)
├── styles.css          # Styles (sticky positioning, layout adjustments)
├── app.js              # Main application logic (update banner fix, catalog update)
├── catalog.json        # Song catalog (add 5 new ambient tracks)
├── songs/              # Audio files (add a1.mp3 through a5.mp3)
│   ├── bensound-acousticbreeze.mp3
│   ├── bensound-sunny.mp3
│   ├── bensound-ukulele.mp3
│   ├── a1.mp3          # NEW: Waterfall in a forest
│   ├── a2.mp3          # NEW: Thunderstorm & Rain
│   ├── a3.mp3          # NEW: Cafe Music
│   ├── a4.mp3          # NEW: Brown Noise
│   └── a5.mp3          # NEW: Rainy Day
├── icons/              # Icon assets (may not need modification for Unicode icons)
├── db.js               # IndexedDB wrapper (no changes needed)
├── cache-manager.js    # Cache logic (no changes needed)
├── sw.js               # Service Worker (update banner logic fix)
└── manifest.json       # PWA manifest (no changes needed)

tests/                  # Manual testing (per constitution)
```

**Structure Decision**: Single web application (PWA) structure as validated in Phase 3. All changes are contained within the existing `src/` directory with no new files or folders required beyond adding the 5 audio files to `src/songs/`. This maintains the zero-build-tool, single-page application architecture established in Phases 1-3.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
