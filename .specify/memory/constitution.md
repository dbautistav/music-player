<!--
SYNC IMPACT REPORT
==================
Version Change: 1.2 → 1.3
Reason: MINOR bump - Added Phase 3 completion learnings which materially expand guidance

Modified Principles:
- None (principles remain the same)

Added Sections:
- Phase 3: Offline & Caching completion details in "Phase Completion Checklist"

Removed Sections:
- None

Templates Requiring Updates:
✅ plan-template.md - Already aligned with constitution (no changes needed)
✅ spec-template.md - Already aligned with constitution (no changes needed)
✅ tasks-template.md - Already aligned with constitution (no changes needed)
✅ All command files - No constitution references that need updating

Follow-up TODOs:
- None (all placeholders replaced with concrete values)
-->

# Music Player PWA - Technical Constitution

**Version**: 1.3
**Last Updated**: 2026-02-01
**Purpose**: Define technical principles, constraints, and architectural decisions that guide all implementation phases

---

## Core Philosophy

This project prioritizes:
1. **Learning over shipping** - Focus on understanding AI-assisted development patterns
2. **Incremental progress** - Small, working iterations over big-bang releases
3. **Modern standards** - Use current best practices, not legacy approaches
4. **Simplicity first** - Start minimal, add complexity only when needed

---

## Technology Stack

### Language & Runtime
- **JavaScript**: ES6+ features required (const/let, arrow functions, template literals, async/await)
- **No TypeScript**: Keep it simple for Phase 1-3; may introduce later
- **Node.js version**: LTS (20.x or 22.x) - specified in `.nvmrc`

### Frameworks & Libraries

**Progressive Enhancement Philosophy**: Start with zero dependencies, add only when complexity justifies the cost.

**Phase 1-2**: Zero dependencies ✓ COMPLETED
- ✅ Vanilla JavaScript proved sufficient for static playback and dynamic catalog
- ✅ Validated that web fundamentals can handle core features
- 🎓 Learning outcome: Modern browser APIs are powerful enough for basic apps

**Phase 3**: Zero dependencies ✓ COMPLETED
- ✅ Vanilla Service Worker (82 lines) proved manageable
- ✅ Vanilla IndexedDB wrapper (173 lines) worked well
- ✅ No build step needed - direct file serving
- ✅ Cache API used for app shell caching
- 🎓 Learning outcome: Native browser APIs are sufficient for offline PWA features

**Phase 4+**: Framework decision point
- 🔍 If codebase exceeds 1000 LOC and state management becomes complex, evaluate:
  - Svelte (compiler-based, small bundle)
  - Preact (React-compatible, 3KB)
  - Lit (web components, 5KB)
- ❌ Avoid: React (too heavy), Vue (unnecessary for this scale), Angular (overkill)
- ✅ Decision criteria: bundle size impact, learning curve, ecosystem maturity

**TypeScript**: Not needed for Phase 1-3
- May introduce in Phase 4+ if codebase complexity warrants
- Use JSDoc type comments as intermediate step
- Decision should be based on real pain points (e.g., frequent runtime type errors)

### Build Tools

**Phase 1-3**: None ✓ VALIDATED
- No build step required
- Direct file serving (Python http.server, Live Server, etc.)
- Validated through Phase 3: No performance issues without build step

**Phase 4+**: Lightweight options preferred (only if needed)
- Vite (if bundling needed) - Rust-powered, blazing fast
- esbuild (alternative) - Also Rust-powered
- Avoid Webpack (too heavy for this project)
- No Babel (use native ES6+, browser support is good enough)

### Testing

**Phase 1-3**: Manual testing ✓ VALIDATED
- Browser DevTools console
- Manual cross-browser checks
- Lighthouse for performance/PWA audits
- Validated: Manual testing was sufficient for this scope

**Phase 4+**: Consider lightweight testing
- Vitest (fast, modern, Vite-powered)
- Playwright for E2E (if warranted)
- No Jest (slower, older)

---

## Architecture Principles

### Code Organization

**File Structure**:
```
src/
├── index.html          # Single HTML file (no templates)
├── styles.css          # Single CSS file (may split later)
├── app.js              # Main application logic
├── db.js               # Database abstraction (Phase 3+)
├── cache-manager.js    # Cache logic (Phase 3+)
├── sw.js               # Service Worker (Phase 3+)
├── manifest.json       # PWA manifest (Phase 3+)
└── catalog.json        # Data (Phase 2+)
```

**Modularity**:
- ES6 modules (`import`/`export`) - but only when needed
- Phase 1-3: Single file scripts are fine
- Phase 4+: Split into modules if needed for better organization

**Naming Conventions**:
- Files: `kebab-case.js`
- Variables/functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Classes: `PascalCase`

### State Management

**Phase 1-3**: Simple global state ✓ WORKING
```javascript
let currentSongIndex = 0;
let isPlaying = false;
let songs = [];
```

**Phase 4+**: Centralized state object (if needed)
```javascript
const appState = {
  currentSong: null,
  isPlaying: false,
  songs: [],
  cachedSongIds: []
};
```

**No state management libraries** (Redux, Zustand, etc.) unless app grows significantly

### Data Flow

**Phase 1**: In-memory only
**Phase 2**: Fetch from JSON → Memory
**Phase 3**: Fetch from JSON → Memory → IndexedDB (cache) ✓ IMPLEMENTED
**Future**: May add external API integration

**Persistence Strategy**:
- IndexedDB for audio blobs and metadata ✓ IMPLEMENTED
- Cache API for app shell (HTML/CSS/JS) ✓ IMPLEMENTED
- LocalStorage for small user preferences (< 5MB total) - future
- No cookies (not needed for this app)

---

## Browser APIs & Features

### Required APIs
- **Web Audio API**: For playback control
- **Fetch API**: For loading catalog
- **Service Worker API**: For offline functionality (Phase 3) ✓ IMPLEMENTED
- **IndexedDB**: For caching songs (Phase 3) ✓ IMPLEMENTED
- **Cache API**: For app shell (Phase 3) ✓ IMPLEMENTED

### Optional/Future APIs
- **MediaSession API**: For lock screen controls
- **Background Sync API**: For resilient downloads (Safari doesn't support)
- **Web Share API**: For sharing songs
- **File System Access API**: For local file imports

### Browser Compatibility Targets

**Minimum Supported**:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Chrome Android 90+

**Rationale**: These versions support all required APIs (Service Worker, IndexedDB, ES6+)

**No IE11 support**: Not worth the polyfill complexity

**Progressive Enhancement**:
- Core features work on all modern browsers
- Enhanced features (Background Sync) degrade gracefully
- Clear messaging when features unavailable

---

## Performance Standards

### Loading Performance
- **Time to Interactive (TTI)**: < 3 seconds on 3G
- **First Contentful Paint (FCP)**: < 1.5 seconds
- **Total Bundle Size**: < 200 KB (initial load, excluding songs)
- **Service Worker Cache**: < 2 seconds to cache app shell

### Runtime Performance
- **Playback Latency**: < 1 second from click to audio start
- **Search Response**: < 100ms filter time
- **UI Interactions**: 60fps (no jank)
- **Memory**: No leaks (use Chrome DevTools to verify)

### Optimization Strategies
- Lazy load images (`loading="lazy"`)
- Debounce search input (300ms)
- Use DocumentFragment for batch DOM updates
- Minimize repaints/reflows

---

## Security & Privacy

### Content Security Policy (CSP)
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self';
               style-src 'self' 'unsafe-inline';
               media-src 'self' https://trusted-cdn.com;">
```

### HTTPS Required
- Service Workers only work over HTTPS (or localhost)
- Use GitHub Pages (HTTPS by default) or similar

### No User Authentication
- Phase 1-3: No login, no user accounts
- Phase 4+: If added, use OAuth (Google/GitHub), not custom auth

### Data Privacy
- No analytics/tracking in Phase 1-3
- No third-party scripts
- If added later: Privacy-focused (Plausible, not Google Analytics)

---

## Code Quality Standards

### Linting & Formatting
**Phase 1-3**: Manual review ✓ VALIDATED
**Phase 4+**: Add ESLint + Prettier (if codebase grows)
- ESLint config: `eslint:recommended`
- Prettier for auto-formatting
- Run on pre-commit hook (Husky)

### Code Style
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Max line length**: 100 characters
- **Max function length**: 50 lines (guideline, not hard rule)

### Comments
- Document "why", not "what"
- JSDoc for public functions (Phase 3+)
- No commented-out code in production

### Error Handling
```javascript
// DO: Specific error handling
try {
  const data = await fetch('/catalog.json');
} catch (error) {
  console.error('Failed to load catalog:', error);
  showUserFriendlyError('Unable to load songs. Please try again.');
}

// DON'T: Silent failures
try {
  const data = await fetch('/catalog.json');
} catch (error) {
  // Nothing - user left confused
}
```

---

## UI/UX Principles

### Design Philosophy
- **Minimalist**: Less is more, generous whitespace
- **Mobile-first**: Design for 375px width, scale up
- **Accessible**: WCAG 2.1 AA compliance
- **Fast**: Perceived performance matters (show loading states)

### Visual Design
- **Color palette**: Maximum 3 colors (background, text, accent)
- **Typography**: System fonts (no web fonts in Phase 1-2)
  - Fallback stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Icons**: Unicode emoji or inline SVG (no icon fonts)
- **Animations**: CSS only, 60fps, respect `prefers-reduced-motion`

### Interaction Patterns
- **Touch targets**: Minimum 44x44px on mobile
- **Feedback**: Immediate visual response to all interactions
- **Loading states**: Always show progress (spinners, skeletons)
- **Error states**: Clear, actionable error messages

### Accessibility
- **Semantic HTML**: Use `<button>`, `<nav>`, `<main>`, etc.
- **Keyboard navigation**: All features accessible via keyboard
- **Screen readers**: ARIA labels where needed
- **Color contrast**: Minimum 4.5:1 for text
- **Focus indicators**: Visible and clear

---

## PWA Requirements (Phase 3+) ✓ IMPLEMENTED

### Manifest ✓ IMPLEMENTED
- App name, short name, description
- Icons (192x192, 512x512)
- `display: standalone`
- Theme color

### Service Worker ✓ IMPLEMENTED (Vanilla, 82 lines)
- App shell caching (cache-first)
- Catalog caching (network-first with fallback)
- Song caching (on-demand only, in IndexedDB)
- Update strategy: Prompt user for refresh

### Offline Strategy ✓ IMPLEMENTED
- Graceful degradation: Show which features are unavailable
- Clear offline indicator (banner or icon)
- Cache management UI for users

### Installation ✓ IMPLEMENTED
- Installable on mobile (Add to Home Screen)
- Desktop install prompt (optional, don't nag)
- Works in standalone mode without browser chrome

---

## Deployment & CI/CD (Phase 2-3)

### Version Control
- **Git**: Feature branch workflow
- **Branch naming**: `<phase>-<feature>` (e.g., `003-service-worker`)
- **Commits**: Conventional Commits format
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `refactor:` for code improvements

### GitHub Setup
- `.gitignore`: Exclude `node_modules/`, `dist/`, `.DS_Store`, etc.
- `.nvmrc`: Specify Node.js version (20 or 22)
- `README.md`: Clear setup instructions

### GitHub Actions (Phase 2+)
- **Trigger**: On push to `main`
- **Steps**:
  1. Checkout code
  2. Setup Node.js (use `.nvmrc` version)
  3. Install dependencies (if any)
  4. Run linter (if configured)
  5. Build (if build step exists)
  6. Deploy to GitHub Pages
- **Use fast tools**: Vite, esbuild (Rust-powered where possible)

### GitHub Pages
- Deploy built assets to `gh-pages` branch
- Custom domain (optional)
- HTTPS enabled (required for Service Workers)

---

## Dependencies Philosophy

### Adding Dependencies
**Before adding any dependency, ask**:
1. Can this be done in vanilla JS with < 50 lines of code?
2. Is this a well-maintained library (updated in last 6 months)?
3. Does this add < 10KB to bundle size?
4. Does this solve a real problem, or am I just avoiding writing code?

**Approved use cases**:
- Complex Service Worker logic → Workbox ✅ (Phase 3: NOT NEEDED - vanilla SW was sufficient)
- Complex state management → Zustand (maybe, Phase 4+) ✅
- Complex testing → Vitest ✅

**Not approved**:
- Date formatting → Use Intl.DateTimeFormat ❌
- DOM manipulation → Vanilla JS is fine ❌
- HTTP requests → Fetch API built-in ❌

### Dependency Auditing
- Run `npm audit` regularly
- Update dependencies monthly
- Remove unused dependencies

---

## AI-Assisted Development Guidelines

### Context Management
- Feed specs incrementally (Phase 1, then Phase 2, etc.)
- Don't overload context with entire codebase
- Use `context-harness` to manage context efficiently

### Prompt Engineering
- Be specific about constraints
- Reference existing code patterns
- Ask for explanations when needed

### AI Code Review
- **Always review generated code** before running
- **Test immediately** after generation
- **Iterate quickly** - if it's wrong, regenerate with better constraints

### When AI Struggles
- Break task into smaller pieces
- Provide example code to follow
- Consider manual implementation for complex pieces (e.g., Service Worker)

### AI-Assisted Debugging (Validated in Phase 2)
**Proven workflow from Phase 2 loading skeleton bug fix**:

```bash
# Step 1: Add buggy file to context
context-harness add src/app.js
context-harness bundle > context.txt

# Step 2: Describe bug with specifics
opencode generate \
  --context context.txt \
  --prompt "Bug: [Observed behavior] happens, but [Expected behavior] should happen.
           [What works correctly]. [What doesn't work].
           Debug and fix [specific function/area]." \
  --output src/

# Step 3: Test immediately

# Step 4: If it fails, add more constraints
opencode generate \
  --context context.txt \
  --constraint "Ensure [specific implementation detail]" \
  --constraint "Verify [specific condition]" \
  --prompt "Fix [specific bug]" \
  --output src/
```

**Debugging Prompt Formula**:
- ✅ State observed behavior clearly
- ✅ State expected behavior clearly
- ✅ Mention what IS working (narrows problem space)
- ✅ Be specific about which function/component is suspect
- ❌ Don't say "fix my code" (too vague)
- ❌ Don't include entire codebase (too much context)

**Key Learning**: AI debugging works best when you can articulate the gap between expected and observed behavior, even if you don't know the cause.

---

## Future Considerations (Not Now, But Keep in Mind)

### Phase 4+ Possibilities
- Music visualizer (Canvas API + Web Audio API)
- Playlist management
- User preferences/settings
- Social sharing
- External catalog sources (Spotify API, SoundCloud, etc.)
- Lyrics display
- Equalizer controls

### Long-term Goals
- Wrap as iOS app (Capacitor or similar)
- Publish to App Store
- Multi-language support (i18n)
- Dark mode
- Themes/customization

### Technical Debt to Avoid
- Don't over-engineer for future features
- Don't add abstractions until you need them (YAGNI principle)
- Don't optimize prematurely
- Don't skip documentation "for now"

---

## Phase 3 Reflection Guide

**Lessons learned from Phase 3 completion (2026-02-01):**

### What Worked Well

**Vanilla Service Worker** ✅
- Only 82 lines of code
- Clear and understandable logic
- Easy to debug and modify
- No build step required
- Proved abstraction (Workbox) was unnecessary for this scope

**Vanilla IndexedDB Wrapper** ✅
- 173 lines of wrapper code
- Promise-based API (much cleaner than callbacks)
- Storage quota management with LRU eviction
- Successfully handles all edge cases (QuotaExceededError, etc.)

**Zero Build Tools** ✅
- Direct file serving works perfectly
- No complexity overhead
- Fast iteration cycle
- No bundle size concerns

**Cache Strategy** ✅
- Cache-first for app shell (HTML/CSS/JS)
- Network-first for catalog.json (updates when online)
- On-demand caching for songs in IndexedDB
- Clean versioning with old cache cleanup

### Challenges Encountered

**Service Worker Lifecycle** ⚠️
- Tricky to understand install/activate/update flow
- Required careful handling of `skipWaiting()` and `clients.claim()`
- Update notification to users needed for smooth transitions
- Lesson: SW lifecycle is the hardest part of vanilla SW, but still manageable

**Storage Quota Management** ⚠️
- Different browsers have different limits (Safari: 50MB, others: more)
- Needed LRU eviction strategy to handle quota exceeded
- Required user-friendly error messages and cache management UI
- Lesson: Quota handling is more complex than expected but necessary

**IndexedDB Complexity** ⚠️
- Callback-based API requires careful Promise wrapping
- Schema upgrades (onupgradeneeded) must be handled gracefully
- Error handling for corrupted data or missing database
- Lesson: Wrapper class is essential for usability

### Decisions Validated

**No Workbox** ✅
- Vanilla SW at 82 lines was completely manageable
- Full control over cache strategies and lifecycle
- No build step required
- Better understanding of SW fundamentals for future work

**No Build Tools** ✅
- Direct file serving works well for PWA of this size
- Service Workers work without bundling
- No performance issues observed
- Faster development iteration

**Zero Dependencies** ✅
- All functionality achieved with vanilla JS
- No transitive dependencies or security concerns
- Bundle size remains minimal
- Proved the learning-focused approach

### Recommended Approach for Future Phases

**If considering dependencies in Phase 4+**, ask these questions:

1. **Is the vanilla implementation > 200 LOC?**
   - Yes: Consider library
   - No: Stay vanilla

2. **Does the complexity cause bugs or delays?**
   - Yes: Consider abstraction
   - No: Keep control

3. **Is there a well-maintained library < 20KB?**
   - Yes: Evaluate seriously
   - No: Build it yourself

4. **Will the library teach you something valuable?**
   - Yes: Consider for learning
   - No: Only add if it solves a real problem

---

## Phase Completion Checklist

**After completing each phase, update this section:**

### Phase 1: Foundation ✅ COMPLETE
**Completed**: 2026-01-26
**Key Learnings**:
- ✅ Vanilla JS was sufficient for basic playback
- ✅ Web Audio API is straightforward and well-supported
- ✅ No framework needed for simple UI (buttons, event listeners)
- ✅ ES6+ features (const/let, arrow functions, template literals) worked perfectly across target browsers
- ✅ Mobile-first CSS with flexbox handled responsive layout without issues
- ✅ GLM-4.7 (via opencode/spec-kit) successfully generated working code from clear specs

**Constitution Updates**:
- None needed - initial assumptions held true
- Validated: Zero-dependency approach is viable for Phases 1-2

**Recommended Changes for Phase 2**:
- Continue with current approach (vanilla JS, no build tools)

---

### Phase 2: Dynamic Catalog ✅ COMPLETE
**Completed**: 2026-01-26
**Key Learnings**:
- ✅ Fetch API + JSON worked smoothly for catalog loading
- ✅ Search/filter with ~100 songs had no performance issues (no framework needed)
- ✅ Debouncing at 300ms felt natural and responsive
- ✅ Loading skeleton pattern improved perceived performance
- ✅ AI-assisted debugging worked well: loading skeleton bug fixed via opencode with specific prompt
- ✅ Lazy loading images (`loading="lazy"`) prevented layout issues
- ✅ DocumentFragment for batch rendering was efficient

**Bug Fixes Applied**:
- Loading skeleton persisted after catalog load → Fixed via AI-generated code with clear bug description
- Debugging approach: Added buggy file to context, described observed vs expected behavior, AI generated fix

**Constitution Updates**:
- Validated: No build tools needed yet (fetch/JSON is simple enough)
- Confirmed: Debounce timing (300ms) is optimal
- Proven: AI debugging workflow is effective with specific prompts

**Recommended Changes for Phase 3**:
- ⚠️ Service Workers are complex - strongly consider Workbox
- ⚠️ May need build step for production optimization (minification, bundling)
- ✅ Continue with vanilla JS for UI logic (still manageable)

---

### Phase 3: Offline & Caching ✅ COMPLETE
**Completed**: 2026-02-01
**Key Learnings**:
- ✅ Vanilla Service Worker (82 lines) proved manageable - no Workbox needed
- ✅ Service Worker lifecycle (install/activate/update) is tricky but solvable
- ✅ IndexedDB wrapper (173 lines) successfully handles audio blob storage
- ✅ Storage quota management with LRU eviction works effectively
- ✅ Cache API works well for app shell (HTML/CSS/JS) caching
- ✅ No build step needed - Service Workers work without bundling
- ✅ Zero-dependency approach validated through Phase 3
- ✅ PWA features (manifest, installability, offline mode) all working

**Implementation Details**:
- **Service Worker**: Vanilla JS with cache-first for app shell, network-first for catalog
- **IndexedDB**: Wrapper class with Promise-based API, LRU eviction, quota handling
- **Cache Strategy**: App shell cached on install, songs cached on-demand in IndexedDB
- **Offline Experience**: Clear indicators, graceful degradation, error handling
- **Storage Management**: UI shows storage usage, allows individual or bulk deletion

**Challenges Overcome**:
- Service Worker update lifecycle required careful user notification handling
- Storage quota exceeded needed LRU eviction and user-friendly error messages
- IndexedDB callback complexity solved with Promise wrapper class
- Cross-browser differences (Safari vs others) handled with graceful degradation

**Constitution Updates**:
- Validated: Vanilla Service Worker is sufficient for this scope (Workbox NOT needed)
- Validated: No build tools needed even for PWA with Service Worker
- Validated: Zero-dependency approach works through Phase 3
- Added: Phase 3 Reflection Guide documenting lessons learned
- Updated: Dependency Decision Log with Phase 3 decisions

**Recommended Changes for Phase 4+**:
- ✅ Continue with vanilla JS approach (working well so far)
- ✅ Only consider dependencies if vanilla implementation exceeds 200 LOC
- ✅ Consider framework (Svelte/Preact/Lit) only if state management becomes painful
- ✅ Consider testing framework (Vitest) if codebase exceeds 500 LOC

**Phase 3 Completion Criteria Met**:
- ✅ App loads offline (after first online visit)
- ✅ User can cache songs with download (automatic on play)
- ✅ Cached songs play without network
- ✅ Cache management UI shows storage usage
- ✅ Service Worker updates don't break app
- ✅ Works in Chrome, Firefox, Safari (with known Safari limitations)

---

## Revision History

- **v1.0** (2026-01-26): Initial constitution based on project kickoff discussion
- **v1.1** (2026-01-26): Added progressive enhancement philosophy, Dependency Decision Log, and Phase Completion Checklist after Phase 1 success
- **v1.2** (2026-01-26): Updated with Phase 1 & 2 completion learnings; added AI-Assisted Debugging workflow; prepared for Phase 3 with informed expectations
- **v1.3** (2026-02-01): Updated with Phase 3 completion learnings; validated vanilla SW approach; added Phase 3 Reflection Guide; confirmed zero-dependency approach through Phase 3

---

## How to Use This Document

**For AI agents**:
- Use this as context when generating code
- Follow these principles unless explicitly overridden
- Cite this document when making architectural decisions

**For developers**:
- Reference when making technical decisions
- Update when principles change (with rationale)
- Use as checklist during code review

**For project planning**:
- Ensure new features align with these principles
- Challenge assumptions that conflict with this document
- Evolve gradually, don't rewrite from scratch

---

