# Implementation Plan: Dark Theme & Alpha Tester Access

**Branch**: `001-dark-theme-alpha-access` | **Date**: 2025-02-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-dark-theme-alpha-access/spec.md`

## Summary

Implement a dark theme for the music player using a soft dark color palette (#242424 background, #e8e8e8 text, #42a5f5 accent, #3a3a3a borders) while maintaining 4.5:1 WCAG 2.1 AA contrast ratios. Deploy to GitHub Pages (main branch, /src directory) to enable alpha tester access without requiring development tools or local servers. Audio files remain in the same repository to avoid CORS issues.

## Technical Context

**Language/Version**: JavaScript ES6+ (Chrome/Edge 90+, Firefox 88+, Safari 14+, iOS Safari 14+)
**Primary Dependencies**: None (vanilla JavaScript, zero dependencies per constitution)
**Storage**: No new storage requirements (uses existing IndexedDB for cached songs, Cache API for app shell)
**Testing**: Manual testing with browser DevTools, Lighthouse for accessibility audits
**Target Platform**: Web (desktop and mobile browsers), GitHub Pages for deployment
**Project Type**: Single web application (PWA with Service Worker)
**Performance Goals**: <3s load time on 3G, 60fps UI animations, 4.5:1 minimum contrast ratio
**Constraints**: No build tools, no new dependencies, maintain existing PWA functionality, no authentication
**Scale/Scope**: Single feature (theme change) + deployment configuration; estimated <200 lines of CSS changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Framework/Dependencies Check
**Requirement**: Zero dependencies for Phase 1-3 (validated through Phase 3)
**Status**: ✅ PASS
**Evidence**: Feature only requires CSS changes and GitHub Pages configuration - no new dependencies needed

### Build Tools Check
**Requirement**: No build tools for Phase 1-3 (validated through Phase 3)
**Status**: ✅ PASS
**Evidence**: GitHub Pages serves static files directly; no bundling or transpilation required

### Code Organization Check
**Requirement**: File structure: src/ with .html, .css, .js files; ES6 modules only when needed
**Status**: ✅ PASS
**Evidence**: Only src/styles.css needs modification; no new files or modules needed

### Testing Check
**Requirement**: Manual testing for Phase 1-3 (validated through Phase 1-3)
**Status**: ✅ PASS
**Evidence**: Visual theme changes best tested manually with browser DevTools and Lighthouse accessibility audits

### Browser Compatibility Check
**Requirement**: Chrome/Edge 90+, Firefox 88+, Safari 14+, iOS Safari 14+
**Status**: ✅ PASS
**Evidence**: CSS color changes use standard properties supported by all target browsers

### Performance Check
**Requirement**: TTI <3s on 3G, total bundle <200KB
**Status**: ✅ PASS
**Evidence**: CSS-only changes add minimal size (~1-2KB); no new JavaScript or assets

### Accessibility Check
**Requirement**: WCAG 2.1 AA compliance (4.5:1 contrast ratio)
**Status**: ✅ PASS
**Evidence**: FR-002 and SC-001 explicitly require 4.5:1 contrast; chosen palette meets this requirement

### Security Check
**Requirement**: HTTPS for Service Workers, no third-party scripts
**Status**: ✅ PASS
**Evidence**: GitHub Pages provides HTTPS; no new scripts or external resources added

### PWA Requirements Check
**Requirement**: No changes to PWA features (manifest, Service Worker, offline capability)
**Status**: ✅ PASS
**Evidence**: Out of scope - only visual theme changes and deployment configuration

**Overall Gate Status**: ✅ ALL PASS - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-dark-theme-alpha-access/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── index.html          # Existing HTML (no changes)
├── styles.css          # MODIFY: Update color variables and values for dark theme
├── app.js              # Existing JS (no changes)
├── db.js               # Existing JS (no changes)
├── cache-manager.js    # Existing JS (no changes)
├── sw.js               # Existing JS (no changes)
├── manifest.json       # UPDATE: Theme color for PWA
├── catalog.json        # Existing JSON (no changes)
└── songs/              # Existing audio files (no changes)

.github/workflows/
├── deploy.yml          # CREATE: GitHub Actions workflow for GitHub Pages deployment
```

**Structure Decision**: Single project structure (web application) - modifies existing src/ directory for theme changes, adds GitHub Pages deployment workflow. No backend or mobile app components needed. This aligns with the constitution's validated structure for Phase 3 PWA.

## Post-Design Constitution Check

*GATE: Re-checked after Phase 1 design - Must pass before Phase 2 tasks.*

### Design Compliance Review

**Framework/Dependencies**: ✅ PASS
- Design uses CSS variables only (vanilla CSS)
- No new dependencies introduced
- GitHub Actions uses official GitHub actions (not third-party)

**Build Tools**: ✅ PASS
- No build step required
- GitHub Pages serves static files directly
- Deployment workflow has zero build complexity

**Code Organization**: ✅ PASS
- Single CSS file modified (`src/styles.css`)
- Single workflow file added (`.github/workflows/deploy.yml`)
- Single manifest file updated (`src/manifest.json`)
- No new modules or complex structures

**Testing**: ✅ PASS
- Manual testing with Lighthouse and WebAIM
- Visual inspection sufficient for theme changes
- No automated testing framework needed

**Browser Compatibility**: ✅ PASS
- CSS variables supported by all target browsers (Chrome 90+, Firefox 88+, Safari 14+)
- No new browser features required
- Gradients and animations widely supported

**Performance**: ✅ PASS
- CSS-only changes: +2KB bundle size impact
- No new JavaScript or assets
- Load time impact: <0.1s on 3G
- Animations at 60fps (CSS transitions)

**Accessibility**: ✅ PASS
- All contrast ratios verified ≥ 4.5:1
- Focus states preserved
- Semantic HTML unchanged
- ARIA labels unchanged

**Security**: ✅ PASS
- No new external resources
- GitHub Pages provides HTTPS
- Content Security Policy unchanged
- No user data collection

**PWA Requirements**: ✅ PASS
- Only manifest colors updated
- Service Worker unchanged
- Offline functionality preserved
- No changes to core PWA features

### Design Decision Summary

| Design Element | Approach | Constitution Compliance |
|--------------|----------|------------------------|
| Theme Implementation | CSS custom properties | ✅ Vanilla CSS, no dependencies |
| Color Palette | Soft dark (#242424, #e8e8e8, #42a5f5) | ✅ Meets WCAG 2.1 AA (4.5:1+) |
| Deployment | GitHub Pages via GitHub Actions | ✅ No build tools, uses official actions |
| Testing | Manual (Lighthouse + WebAIM) | ✅ Matches Phase 1-3 validated approach |
| PWA Changes | Manifest colors only | ✅ No core PWA functionality changes |

### Post-Design Gate Status

**Overall Status**: ✅ ALL PASS - Ready for Phase 2 (Task Generation)

**No Revisions Required**: Design aligns perfectly with constitution and research decisions.

## Complexity Tracking

> No constitution violations - justification not required
