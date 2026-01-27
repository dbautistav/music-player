# Research: Dynamic Catalog & Search

**Feature**: `002-dynamic-catalog`
**Date**: 2026-01-26
**Status**: Complete

## Executive Summary

All technical decisions for this phase are clearly defined in the Phase 2 specification (`specs/phase2-dynamic-catalog.md`) and the constitution (`.specify/memory/constitution.md`). No additional research is required as the specification provides complete implementation details including data models, code patterns, performance targets, and edge cases.

## Technical Decisions

### Catalog Loading

**Decision**: Use Fetch API with async/await pattern
**Rationale**: Native browser API, no dependencies required, handles network errors gracefully
**Alternatives Considered**: XMLHttpRequest (legacy), Axios (unnecessary dependency)

**Decision**: Show loading skeleton during fetch
**Rationale**: Provides better UX than spinner, matches layout of song items
**Alternatives Considered**: Spinner only, blank screen

### Search Implementation

**Decision**: Debounce search input with 300ms delay
**Rationale**: Balances responsiveness with performance, prevents excessive filtering
**Alternatives Considered**: No debounce (too many DOM updates), 500ms (too slow feeling)

**Decision**: Case-insensitive partial string matching
**Rationale**: User-friendly, matches common search expectations
**Alternatives Considered**: Exact match (too strict), regex (overkill)

### Rendering Performance

**Decision**: Use DocumentFragment for batch DOM updates
**Rationale**: Reduces reflows, improves performance with many songs
**Alternatives Considered**: Individual append operations (slower), innerHTML replacement (loses event listeners)

**Decision**: Lazy load album art images with loading="lazy"
**Rationale**: Prevents blocking page render, saves bandwidth for off-screen images
**Alternatives Considered**: Eager loading (blocks render), manual IntersectionObserver (more complex)

### Error Handling

**Decision**: Try-catch around fetch with user-friendly error messages
**Rationale**: Graceful degradation, clear communication to users
**Alternatives Considered**: Silent failures (bad UX), alert() (disruptive)

**Decision**: Validate JSON structure before rendering
**Rationale**: Prevents crashes from malformed data, provides specific error feedback
**Alternatives Considered**: Assume valid JSON (unsafe)

### State Management

**Decision**: In-memory array for loaded songs
**Rationale**: Simple, sufficient for Phase 2 scope, no persistence needed
**Alternatives Considered**: LocalStorage (not needed for this phase), IndexedDB (Phase 3)

**Decision**: Global variables for state (catalogData, currentSongIndex, isPlaying)
**Rationale**: Simple pattern from Phase 1, no complexity needed yet
**Alternatives Considered**: State object (overkill), Redux/library (violates constitution)

## Technology Choices

### JavaScript Features

- **ES6+**: Arrow functions, const/let, template literals, async/await
- **Fetch API**: For catalog.json loading
- **Array.filter()**: For search filtering
- **DocumentFragment**: For efficient DOM batch operations
- **addEventListener()**: For event handling (no inline onclick)

### CSS Features

- **CSS Grid**: For responsive layout (single column on mobile, multi-column on desktop)
- **Flexbox**: For song card layout and controls
- **CSS Variables**: For theming and consistency
- **CSS Animations**: For loading skeleton and playing indicators
- **Media Queries**: Breakpoints at 768px and 1024px

### Browser APIs

- **Web Audio API**: Playback control (from Phase 1)
- **Fetch API**: Catalog loading (new for Phase 2)

## Performance Considerations

### Catalog Loading

- Target: < 1 second for 50 songs
- Approach: Single fetch request, cache in memory, lazy load images
- Optimization: Use skeleton loader to hide network latency

### Search Performance

- Target: < 100ms filtering time for 100+ songs
- Approach: Array.filter() on in-memory data, debounce input
- Optimization: Don't re-render entire list, hide/show elements

### Image Loading

- Target: No blocking of page render
- Approach: Native lazy loading with loading="lazy" attribute
- Optimization: Provide placeholder for missing album art

## Edge Cases

### Catalog Errors

- **Empty catalog**: Show friendly message, not error
- **Malformed JSON**: Catch parse error, show error with retry button
- **Missing required fields**: Skip invalid songs with console warning
- **Network timeout**: Set 5-second timeout, show retry option

### Search Edge Cases

- **Empty search**: Show all songs
- **Special characters**: Handle safely in filter logic
- **Unicode characters**: Support in string matching
- **No results**: Show "no results" message with clear action

### Large Catalogs

- **100+ songs**: Maintain performance with efficient filtering
- **Memory usage**: Lazy load images, don't preload all assets

## Migration from Phase 1

The following changes are needed to migrate from Phase 1 to Phase 2:

1. Remove hardcoded song array from app.js
2. Add catalog.json with sample songs
3. Implement loadCatalog() async function
4. Update renderSongList() to work with dynamic data
5. Add search input and debounce handler
6. Implement filterSongs() function
7. Add loading state management (show/hide skeleton)
8. Add error state handling
9. Update CSS for song cards with album art
10. Add visual indicators for playing state

## Conclusion

No gaps or unknowns identified. The Phase 2 specification is comprehensive and provides all necessary technical details for implementation. All choices align with the constitution's principles of simplicity, vanilla JavaScript, and modern web standards. Ready to proceed to Phase 1 design.
