# Implementation Plan: Service Worker and Caching Bug Fixes

**Branch**: `005-phase3-caching` | **Date**: 2026-01-28 | **Spec**: /specs/005-phase3-caching/spec.md
**Input**: User feedback on Phase 3 implementation issues

## Summary

Fix critical bugs in Phase 3 Service Worker and caching implementation that prevent the app from loading catalog.json and playing songs. Issues include: missing db.js script tag, inline script violating CSP, duplicate fetch handlers in SW, and improper initialization order.

## Technical Context

**Language/Version**: JavaScript ES6+ (Chrome/Edge 90+, Firefox 88+, Safari 14+, iOS Safari 14+)
**Primary Dependencies**: None (vanilla JavaScript)
**Storage**: IndexedDB (cached songs), Cache API (app shell), LocalStorage (preferences - future)
**Testing**: Manual browser testing, DevTools console/network inspection
**Target Platform**: Web (mobile-first PWA)
**Project Type**: Single web application (no build tools)
**Performance Goals**: <3s load time, 60fps UI, offline-capable
**Constraints**: HTTPS required for SW, no inline scripts, vanilla JS only
**Scale/Scope**: ~100 songs, ~50MB cached content

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Technology Stack Compliance
✅ **JavaScript ES6+** - Using const/let, arrow functions, async/await - COMPLIANT
✅ **Zero Dependencies (Phase 1-2)** - Vanilla JavaScript only - COMPLIANT
✅ **No Build Tools** - Direct file serving - COMPLIANT
✅ **Browser APIs** - Service Worker, IndexedDB, Cache API - COMPLIANT

### Code Style Compliance
✅ **2-space indentation** - All files use 2 spaces - COMPLIANT
✅ **camelCase naming** - Variables and functions follow convention - COMPLIANT
✅ **UPPER_SNAKE_CASE constants** - CACHE_VERSION used - COMPLIANT
✅ **Max line length 120 chars** - Within limits - COMPLIANT
✅ **No inline event handlers** - Using addEventListener - COMPLIANT

### CSP Violation Identified
❌ **Inline script in index.html** (lines 69-77) violates `script-src 'self'` - **MUST FIX**
- Impact: Service Worker registration code runs in inline script
- Solution: Move to external file or app.js
- Constitution requirement: "No inline scripts" from CSP section

### Security & Privacy
✅ **HTTPS** - Required for SW (localhost for dev) - COMPLIANT
✅ **CSP Policy** - Present but needs fix for inline scripts - NEEDS FIX
✅ **No analytics/tracking** - Not implemented - COMPLIANT

### PWA Requirements
⚠️ **App shell caching** - Implemented but catalog.json not loading - NEEDS FIX
⚠️ **Service Worker lifecycle** - Duplicate fetch handlers - NEEDS FIX
✅ **Manifest** - Linked but needs verification - TO CHECK

### Browser Support
✅ **Chrome/Edge 90+, Firefox 88+, Safari 14+** - Target browsers - COMPLIANT
✅ **Mobile support** - iOS Safari 14+, Chrome Mobile 90+ - COMPLIANT

### GATE RESULT: BLOCKED - Fix CSP violation before proceeding

**POST-DESIGN RE-EVALUATION** (after Phase 0 research):

✅ All constitution violations identified and have fix plans
✅ CSP violation will be resolved by moving inline script to app.js
✅ All technical decisions align with constitution
✅ Zero dependencies maintained (vanilla JS only)
✅ Code style will be maintained (2-space indent, camelCase, etc.)

**READY TO PROCEED**

## Project Structure

### Documentation (this feature)

```text
specs/005-phase3-caching/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output
```

### Source Code (repository root)

```text
src/
├── index.html          # Main page (FIX: Remove inline script)
├── styles.css          # All styles
├── app.js              # Main app logic (FIX: Load after db.js)
├── db.js               # IndexedDB wrapper (ADD: Script tag in HTML)
├── sw.js               # Service Worker (FIX: Remove duplicate fetch handler)
├── cache-manager.js    # Cache logic
├── manifest.json       # PWA manifest
└── catalog.json        # Song catalog
```

**Structure Decision**: Single project structure (Option 1) with all source files in src/ directory. This is a vanilla JavaScript web application with no build tools or framework separation.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Inline script for SW registration | Service Worker must be registered after page load but before DOMContentLoaded completes for optimal caching. Cannot move to app.js without risking race condition with SW intercepting app.js fetch. | Moving SW registration to app.js creates dependency on app.js loading first, which the SW would then intercept and potentially cache incorrectly. External script file adds unnecessary file. Will move inline script to app.js and handle timing carefully with async/await. |
