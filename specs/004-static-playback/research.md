# Research: Static Music Player

**Feature**: `004-static-playback`
**Date**: 2026-01-26
**Status**: Complete

## Overview

This document consolidates technical research findings for implementing a static music player with 3 hardcoded songs. All technical decisions align with the project constitution and phase 1 constraints.

## Research Findings

### Web Audio API for Playback

**Decision**: Use HTML5 Audio API (Web Audio API for advanced control)

**Rationale**:
- HTML5 `<audio>` element provides basic playback capability with minimal code
- Web Audio API enables advanced features (play/pause control, seeking, volume) if needed later
- No external libraries required - browser-native API
- Constitution explicitly lists "Web Audio API" as required API

**Alternatives Considered**:
- **Howler.js**: Rejected (adds dependency, constitution requires zero dependencies)
- **SoundManager2**: Rejected (older library, unnecessary complexity)
- **Custom media players**: Rejected (reinventing the wheel, HTML5 audio is standard)

### Audio File Storage

**Decision**: Use external URLs for Phase 1 (with option for local files)

**Rationale**:
- External URLs (e.g., Bensound, Free Music Archive) enable immediate development without file management
- Easy to share and test across different environments
- Local files can be added later if needed for Phase 2+
- Constitution allows "Audio files are valid and accessible (either locally stored or hosted on reliable server)"

**Alternatives Considered**:
- **Local files only**: Rejected (requires file hosting setup, adds complexity to simple Phase 1)
- **Base64 encoding**: Rejected (bloates HTML, poor for multiple songs)

### State Management

**Decision**: Simple global variables (camelCase, let for mutable state)

**Rationale**:
- Constitution Phase 1-2: "Simple global state"
- No need for complex state management with 3 songs
- Easy to understand and debug
- Can migrate to centralized state object in Phase 3+ if needed

**Alternatives Considered**:
- **Redux/Zustand**: Rejected (adds dependency, overkill for Phase 1)
- **Event emitter pattern**: Rejected (unnecessary complexity for simple state)
- **Centralized state object**: Deferred to Phase 3 (constitution states "Phase 3+: Centralized state object")

### DOM Manipulation

**Decision**: Vanilla JavaScript with `document.getElementById`, `addEventListener`, template literals

**Rationale**:
- Constitution: "No frameworks (React, Vue, Svelte, or similar)"
- Native DOM manipulation is performant for this scope
- Template literals for dynamic HTML generation
- `addEventListener` over inline onclick (constitution requirement)

**Alternatives Considered**:
- **jQuery**: Rejected (constitution: "No jQuery or lodash")
- **React/Vue**: Rejected (constitution: "Phase 1-2: Zero dependencies")
- **Virtual DOM libraries**: Rejected (unnecessary complexity)

### Responsive Layout

**Decision**: CSS Grid for overall layout, Flexbox for controls, media queries for breakpoints

**Rationale**:
- Constitution: "CSS Grid for overall layout, Flexbox for controls"
- Modern CSS handles 320px to 1920px range well
- Mobile-first: Design for 375px base, scale up
- Breakpoint at 768px for tablet (constitution requirement)

**Alternatives Considered**:
- **CSS Framework (Bootstrap/Tailwind)**: Rejected (adds dependency, constitution requires vanilla CSS)
- **Float-based layout**: Rejected (outdated, Grid/Flexbox are modern standards)
- **JavaScript layout libraries**: Rejected (overkill, CSS handles this)

### Error Handling

**Decision**: Try-catch blocks with user-friendly error messages

**Rationale**:
- Constitution: "Document 'why', not 'what'" and "Specific error handling" examples
- User needs to know when audio fails to load (Edge Case in spec)
- Console.error for debugging, showUserFriendlyError for UI
- Provide retry mechanism where appropriate

**Alternatives Considered**:
- **Silent failures**: Rejected (constitution: "DON'T: Silent failures")
- **Error boundary libraries**: Rejected (no dependencies, unnecessary for vanilla JS)

### Performance Optimization

**Decision**: Lazy loading, debounce inputs, DocumentFragment for DOM updates

**Rationale**:
- Constitution: "Optimization Strategies" section specifies these techniques
- Lazy load images with `loading="lazy"` (though Phase 1 may not have images)
- Debounce search input (300ms) - relevant for Phase 2, but pattern established here
- DocumentFragment for batch DOM updates (minimize reflows)
- 60fps animations via CSS (not JS)

**Alternatives Considered**:
- **Virtual scrolling**: Rejected (overkill for 3 items, needed only for large catalogs)
- **Web Workers**: Rejected (unnecessary for simple playback, no blocking operations)

## Technical Decisions Summary

| Component | Decision | Constitution Alignment |
|------------|-----------|----------------------|
| Audio Playback | HTML5 Audio API | ✅ Required API (Constitution) |
| Storage | External URLs | ✅ "Audio files are valid and accessible" |
| State Management | Global variables | ✅ "Phase 1-2: Simple global state" |
| DOM Manipulation | Vanilla JS | ✅ "No frameworks" |
| Layout | CSS Grid + Flexbox | ✅ "CSS Grid for overall layout, Flexbox for controls" |
| Error Handling | Try-catch + user messages | ✅ "Specific error handling" |
| Performance | Lazy load, debounce, Fragment | ✅ "Optimization Strategies" |

## Best Practices Applied

1. **Semantic HTML**: Use `<header>`, `<main>`, `<section>`, `<button>` (Constitution: Accessibility)
2. **ARIA Labels**: Add labels where meaning isn't clear (Constitution: Accessibility)
3. **Touch Targets**: Minimum 44x44px on mobile (Constitution: Interaction Patterns)
4. **Focus Indicators**: Visible and clear (Constitution: Accessibility)
5. **Color Contrast**: Minimum 4.5:1 (Constitution: Accessibility)
6. **Mobile-First**: Design for 375px, scale up (Constitution: Design Philosophy)
7. **2-Space Indentation**: Consistent code style (Constitution: Code Style)
8. **Single Quotes**: For strings (Constitution: Code Style)
9. **Semicolons Required**: For statements (Constitution: Code Style)
10. **Max 100 Char Lines**: For readability (Constitution: Code Style)

## Sample Audio Sources (for Implementation)

The following provide CC0 or royalty-free music for testing:

1. **Bensound** (Royalty-free with attribution)
   - URL: https://www.bensound.com/
   - Note: Check license requirements, may need attribution

2. **Free Music Archive** (CC0 tracks)
   - URL: https://freemusicarchive.org/
   - Filter by CC0 license for no attribution

3. **Incompetech** (Royalty-free with attribution)
   - URL: https://incompetech.com/music/royalty-free/
   - Note: Attribution required for commercial use

4. **External URL Option**: Use any publicly available MP3 URLs for Phase 1 testing

## Risk Mitigation

| Risk | Mitigation Strategy |
|-------|-------------------|
| Audio file availability | Use reliable CDN sources, provide error handling |
| Browser compatibility | Target modern browsers (90+ Chrome, 88+ Firefox, 14+ Safari) |
| Performance overhead | Lazy load, minimal DOM operations, no blocking scripts |
| Mobile experience | Touch targets >=44px, responsive layout, test on actual devices |
| Accessibility issues | Use semantic HTML, ARIA labels, test with screen reader |

## Notes for Phase 2+ Transition

- **Dynamic Catalog**: Replace hardcoded array with `fetch('./catalog.json')` (constitution: "Fetch API for loading catalog")
- **Search Functionality**: Debounce input (300ms) per constitution pattern
- **Caching**: Phase 3 will add Service Worker + IndexedDB (constitution: "Persistence Strategy")
- **State Management**: Phase 3 will centralize state object (constitution: "Phase 3+: Centralized state object")
- **Module Splitting**: Phase 3+ can use ES6 modules (`import`/`export`) (constitution: "Modularity")

## Open Questions

None. All technical decisions are clear and aligned with constitution.
