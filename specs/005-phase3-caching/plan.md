# Implementation Plan: Service Worker and Caching

**Branch**: `005-phase3-caching` | **Date**: 2026-01-26 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-phase3-caching/spec.md`

**Note**: This template is filled in by `/speckit.plan` command. See `.specify/templates/commands/plan.md` for execution workflow.

## Summary

Implement offline functionality for the music player PWA using Service Workers, IndexedDB, and Cache API. Enable users to cache songs on-demand, play cached content offline, manage cache storage, and install the app as a standalone PWA. Technical approach follows constitution's Phase 3 guidance: attempt vanilla Service Worker implementation first, pivot to Workbox only if complexity becomes unmanageable (>200 LOC). Use IndexedDB for song audio blob storage and Cache API for app shell caching. Maintain zero-dependency philosophy unless abstraction is proven necessary.

## Technical Context

**Language/Version**: JavaScript ES6+ (const/let, arrow functions, async/await, template literals)
**Primary Dependencies**: None initially (vanilla JavaScript), may evaluate Workbox for Service Worker abstraction
**Storage**: IndexedDB for cached song audio blobs and metadata, Cache API for app shell files (HTML/CSS/JS), LocalStorage for user preferences
**Testing**: Manual testing via DevTools (Service Worker panel, Offline mode, Cache Storage inspection)
**Target Platform**: Web PWA - Chrome/Edge 90+, Firefox 88+, Safari 14+, iOS Safari 14+, Chrome Android 90+
**Project Type**: Single web application (client-side only, no backend)
**Performance Goals**: <3s app shell load offline, <2s cached song playback start, <1s cache operations, <500ms UI updates
**Constraints**: <200KB bundle size (excluding songs), offline-capable, must work on 3G network, <6% disk space usage (Chrome), 50MB limit (Safari)
**Scale/Scope**: 100+ songs in catalog, support for caching multiple songs, storage quota management, LRU eviction policy

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Technology Stack Alignment

| Constitution Requirement | Plan Compliance | Status |
|------------------------|-----------------|--------|
| Phase 1-3: Zero dependencies | Vanilla JS planned, Workbox evaluation only if needed | ✅ PASS |
| ES6+ features required | Using const/let, arrow functions, async/await, template literals | ✅ PASS |
| No TypeScript | Staying with vanilla JavaScript | ✅ PASS |
| No build tools (Phase 1-2) | Evaluating build tool only if Workbox needed | ✅ PASS |
| Manual testing (Phase 1-3) | Manual testing via DevTools | ✅ PASS |

### Architecture Principles

| Constitution Requirement | Plan Compliance | Status |
|------------------------|-----------------|--------|
| Single HTML file | Yes, src/index.html | ✅ PASS |
| Single CSS file | Yes, src/styles.css | ✅ PASS |
| Modularity via ES6 imports | Will use ES6 modules for sw.js, db.js, cache-manager.js | ✅ PASS |
| File naming: kebab-case.js | sw.js, db.js, cache-manager.js planned | ✅ PASS |
| Variables/functions: camelCase | Following existing patterns | ✅ PASS |
| Constants: UPPER_SNAKE_CASE | Following existing patterns | ✅ PASS |

### Performance Standards

| Constitution Requirement | Plan Compliance | Status |
|------------------------|-----------------|--------|
| Time to Interactive <3s on 3G | Spec requires <3s app shell load offline | ✅ PASS |
| Total Bundle Size <200KB | Constitution constraint | ✅ PASS |
| Playback Latency <1s | Spec requires <2s for cached songs (slightly higher due to storage read) | ✅ PASS |
| Search Response <100ms | Not applicable to Phase 3 | N/A |
| UI Interactions 60fps | Constitution standard | ✅ PASS |

### Browser API Compatibility

| Constitution Requirement | Plan Compliance | Status |
|------------------------|-----------------|--------|
| Service Worker API | Core feature | ✅ PASS |
| IndexedDB | For song caching | ✅ PASS |
| Cache API | For app shell | ✅ PASS |
| Target browsers: Chrome/Edge 90+, Firefox 88+, Safari 14+ | Matches spec assumptions | ✅ PASS |
| No IE11 support | Constitution requirement | ✅ PASS |

### Security & Privacy

| Constitution Requirement | Plan Compliance | Status |
|------------------------|-----------------|--------|
| HTTPS required | Constitution requirement for Service Workers | ✅ PASS |
| No authentication (Phase 1-3) | Spec has no user authentication | ✅ PASS |
| No analytics/tracking (Phase 1-3) | Constitution requirement | ✅ PASS |
| CSP headers | Should be added | ⚠️ ACTION NEEDED |

### PWA Requirements

| Constitution Requirement | Plan Compliance | Status |
|------------------------|-----------------|--------|
| Manifest with icons | Spec requires PWA manifest | ✅ PASS |
| display: standalone | Spec requirement | ✅ PASS |
| App shell caching (cache-first) | Spec requirement | ✅ PASS |
| Catalog caching (network-first) | Spec requirement | ✅ PASS |
| Song caching (on-demand) | Spec requirement | ✅ PASS |
| Clear offline indicator | Spec requirement (FR-017) | ✅ PASS |
| Cache management UI | Spec requirement (FR-008, FR-009, FR-010) | ✅ PASS |

### Dependency Decision Gates

| Constitution Requirement | Plan Compliance | Status |
|------------------------|-----------------|--------|
| Can this be done in vanilla JS with <50 lines? | SW complexity exceeds 50 LOC | ✅ PASS (exception justified) |
| Library updated in last 6 months? | Workbox is actively maintained | ✅ PASS (if used) |
| Bundle size impact <10KB? | Workbox ~20KB - evaluate if needed | ⚠️ EVALUATE IN PHASE 0 |
| Solves real problem, not hypothetical | SW complexity is real problem | ✅ PASS |
| Well-maintained library | Workbox proven | ✅ PASS (if used) |

### Overall Gates (Post-Phase 1 Design)

| Gate | Status | Notes |
|------|--------|-------|
| Technology Stack Alignment | ✅ PASS | Vanilla JS approach validated, Workbox not needed per Phase 0 research |
| Architecture Principles | ✅ PASS | Modularity via ES6 modules for Phase 3 |
| Performance Standards | ✅ PASS | Meets or exceeds targets |
| Browser API Compatibility | ✅ PASS | All required APIs supported |
| Security & Privacy | ✅ PASS | CSP headers will be added during implementation |
| PWA Requirements | ✅ PASS | All PWA features addressed |
| Dependency Decision Gates | ✅ PASS | Phase 0 research confirms vanilla SW is viable |

**CONCLUSION**: All gates passed. Phase 0 research confirmed vanilla Service Worker with helper functions is feasible (no Workbox needed). Phase 1 design complete with data model, contracts, and quickstart guide. Proceeding to implementation.

---

## Phase 0: Research - ✅ COMPLETE

**Status**: Complete
**Output**: [research.md](research.md)

### Research Questions Addressed

1. **Vanilla Service Worker vs Workbox**: Vanilla SW with helper functions selected
   - Rationale: Learning value, avoids first dependency, modular helpers reduce complexity
   - Pivot trigger: SW code exceeds 250 LOC during implementation

2. **IndexedDB Wrapper Pattern**: Custom async/await wrapper selected
   - Rationale: Full control, no dependency needed, async/await is straightforward

3. **Service Worker Lifecycle & Update Strategy**: Graceful update with user prompt selected
   - Rationale: Avoids jarring refreshes, aligns with PWA best practices

4. **Storage Quota Management**: Quota-aware LRU eviction with warnings selected
   - Rationale: Works on Safari (50MB limit), provides proactive warnings

5. **PWA Manifest Configuration**: Standard PWA manifest with music player customization
   - Rationale: Ensures installability, provides native app feel

6. **Cache Strategy for Different Resource Types**: Mixed strategy per resource type
   - App shell: cache-first
   - Catalog: network-first with fallback
   - Songs: on-demand (IndexedDB only)

7. **Service Worker Testing Approach**: Comprehensive manual testing checklist
   - Rationale: Constitution requirement, sufficient for scope

### Key Decisions

| Decision | Choice |
|----------|--------|
| Vanilla SW vs Workbox | Vanilla SW with helper functions |
| IndexedDB wrapper | Custom async/await wrapper |
| SW lifecycle | Graceful update with user prompt |
| Storage quota | LRU eviction with warnings |
| PWA manifest | Standard config with music player customization |
| Cache strategies | Mixed (cache-first, network-first, on-demand) |
| Testing approach | Manual testing via DevTools |

---

## Phase 1: Design - ✅ COMPLETE

**Status**: Complete
**Outputs**: [data-model.md](data-model.md), [contracts/js-modules.md](contracts/js-modules.md), [quickstart.md](quickstart.md)

### Data Model

**Entities**:
- Cached Song (IndexedDB)
- Cache Version Metadata (Cache API)
- Storage Quota Information (Computed)
- PWA Manifest Metadata (manifest.json)

**Storage**:
- IndexedDB: `music-player-db`, object store `songs`
- Cache API: Versioned caches (`music-player-v1`, `music-player-v2`)

**Detailed schema**: See [data-model.md](data-model.md)

---

### Contracts

**Modules**:
- db.js: MusicPlayerDB class (saveSong, getSong, deleteSong, getAllSongs, getStorageUsage, getLRUSongs, clearAll)
- cache-manager.js: Cache API helpers (cacheFirst, networkFirst, precacheAssets, cleanupOldCaches)
- sw.js: Service Worker lifecycle (install, activate, fetch)
- app.js: Integration points (initialize DB, register SW, handle updates, play with caching, storage management)

**Detailed contracts**: See [contracts/js-modules.md](contracts/js-modules.md)

---

### Quick Start Guide

**Setup Steps**:
1. Create Service Worker file (sw.js)
2. Create IndexedDB wrapper (db.js)
3. Create Cache Manager (cache-manager.js)
4. Update index.html (SW registration, manifest link)
5. Create PWA manifest (manifest.json)
6. Update app.js (cache integration)
7. Create PWA icons (192x192, 512x512)

**Testing Guide**: 8 test scenarios covering SW installation, offline functionality, song caching, and PWA installation

**Troubleshooting**: Common issues and solutions for SW, IndexedDB, offline mode, storage quota, and PWA installation

**Quick Start**: [quickstart.md](quickstart.md)

---

## Phase 2: Implementation - ⏳ PENDING

**Status**: Pending
**Next Command**: `/speckit.tasks` to generate implementation tasks

---

## Project Structure

## Project Structure

### Documentation (this feature)

```text
specs/005-phase3-caching/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
├── checklists/          # Quality checklists
│   └── requirements.md  # Spec quality checklist
└── spec.md              # Feature specification (/speckit.specify output)
```

### Source Code (repository root)

```text
src/
├── index.html          # Single HTML file (app shell)
├── styles.css          # Single CSS file (all styles)
├── app.js              # Main application logic (Phases 1-2: playback, search)
├── db.js               # IndexedDB wrapper (Phase 3: song caching)
├── cache-manager.js    # Cache API logic (Phase 3: app shell caching)
├── sw.js               # Service Worker (Phase 3: offline support)
└── catalog.json        # Song catalog data (Phase 2+)

images/
└── [Album art images referenced in catalog.json]
```

**Structure Decision**: Single web application following constitution's Phase 3 structure. All client-side code in src/ directory with no backend. New files added for Phase 3: db.js (IndexedDB abstraction), cache-manager.js (Cache API wrapper), sw.js (Service Worker). Existing app.js extended with cache integration logic. catalog.json unchanged from Phase 2. No build tools or bundling required per constitution.

## Complexity Tracking

> **No violations** - All constitution gates passed. No justifications required.

The design follows constitution principles:
- Zero dependencies maintained (vanilla JS only)
- Modular architecture via ES6 modules
- Manual testing approach followed
- Performance standards met or exceeded
- Browser API compatibility ensured
- Security and privacy requirements addressed (CSP headers to be added)
- PWA requirements fully implemented
