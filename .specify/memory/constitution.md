# Music Player PWA - Technical Constitution

**Version**: 1.0  
**Last Updated**: 2026-01-26  
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

**Phase 3**: Evaluate targeted additions
- ⚠️ Consider Workbox if vanilla Service Worker becomes unmanageable
- ⚠️ May use lightweight utilities if they solve real problems (< 10KB each)
- ✅ Each dependency must be justified in this document (see "Dependency Decision Log" below)

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

**Phase 1-2**: None
- No build step required
- Direct file serving (Python http.server, Live Server, etc.)

**Phase 3+**: Lightweight options preferred
- Vite (if bundling needed) - Rust-powered, blazing fast
- esbuild (alternative) - Also Rust-powered
- Avoid Webpack (too heavy for this project)
- No Babel (use native ES6+, browser support is good enough)

### Testing

**Phase 1-2**: Manual testing
- Browser DevTools console
- Manual cross-browser checks
- Lighthouse for performance/PWA audits

**Phase 3+**: Consider lightweight testing
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
└── catalog.json        # Data (Phase 2+)
```

**Modularity**:
- ES6 modules (`import`/`export`) - but only when needed
- Phase 1-2: Single file scripts are fine
- Phase 3+: Split into modules for SW, DB, etc.

**Naming Conventions**:
- Files: `kebab-case.js`
- Variables/functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Classes: `PascalCase`

### State Management

**Phase 1-2**: Simple global state
```javascript
let currentSongIndex = 0;
let isPlaying = false;
let songs = [];
```

**Phase 3+**: Centralized state object
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
**Phase 3**: Fetch from JSON → Memory → IndexedDB (cache)
**Future**: May add external API integration

**Persistence Strategy**:
- IndexedDB for audio blobs and metadata
- LocalStorage for small user preferences (< 5MB total)
- No cookies (not needed for this app)

---

## Browser APIs & Features

### Required APIs
- **Web Audio API**: For playback control
- **Fetch API**: For loading catalog
- **Service Worker API**: For offline functionality (Phase 3)
- **IndexedDB**: For caching songs (Phase 3)
- **Cache API**: For app shell (Phase 3)

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
**Phase 1-2**: Manual review
**Phase 3+**: Add ESLint + Prettier
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

## PWA Requirements (Phase 3+)

### Manifest
- App name, short name, description
- Icons (192x192, 512x512)
- `display: standalone`
- Theme color

### Service Worker
- App shell caching (cache-first)
- Catalog caching (network-first with fallback)
- Song caching (on-demand only)
- Update strategy: Prompt user for refresh

### Offline Strategy
- Graceful degradation: Show which features are unavailable
- Clear offline indicator (banner or icon)
- Cache management UI for users

### Installation
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
- Complex Service Worker logic → Workbox ✅
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

### AI-Assisted Debugging (Added Phase 2)
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

## Phase 3 Preparation Guide

**Before starting Phase 3, consider these recommendations based on Phases 1-2 success:**

### Recommended Approach for Service Workers

**Option A: Vanilla SW First (Recommended for Learning)** ⭐
```bash
# Attempt vanilla Service Worker implementation
# If it becomes unmanageable (>200 LOC or too complex), pivot to Workbox
# This validates whether abstraction is needed
```

**Pros**: 
- ✅ Learn SW fundamentals deeply
- ✅ Keep zero-dependency streak
- ✅ Understand exactly what Workbox would abstract

**Cons**:
- ⚠️ SW lifecycle is tricky (install, activate, update)
- ⚠️ Cache strategies require careful thought
- ⚠️ More code to maintain

**Option B: Workbox from Start**
```bash
npm install workbox-build --save-dev
# Use Workbox CLI or webpack plugin
```

**Pros**:
- ✅ Battle-tested SW abstraction
- ✅ Less code to write
- ✅ Handles edge cases automatically

**Cons**:
- ❌ First dependency (breaks learning pattern)
- ❌ Requires build step
- ❌ Abstracts away SW fundamentals

**My Recommendation**: Try Option A first. If vanilla SW becomes painful (you'll know within 2-3 hours), switch to Workbox. Document the decision in the Dependency Decision Log.

---

### Build Tool Decision

**When to add a build step**:
- ✅ If you add Workbox (requires build integration)
- ✅ If bundle size exceeds 150KB unminified
- ✅ If you want code splitting for better performance
- ❌ Not needed if staying vanilla (Service Workers can be written without build)

**Recommended tool if needed**: 
- **Vite** - Modern, fast, great DX, minimal config
- Alternative: **esbuild** - Even faster, more manual

---

### Testing Strategy for Phase 3

**Manual Testing Focus**:
- Service Worker install/activate/update lifecycle
- Offline mode (Chrome DevTools → Network → Offline)
- Cache storage inspection (DevTools → Application → Cache Storage)
- IndexedDB inspection (DevTools → Application → IndexedDB)

**Consider automated testing if**:
- You find yourself manually testing the same scenario 5+ times
- SW updates break existing functionality
- Cache invalidation becomes complex

**Tool recommendation**: Vitest + Playwright (only if you hit the pain threshold)

---

### Storage Quota Considerations

Different browsers have different storage limits:
- Chrome/Edge: ~6% of available disk space
- Firefox: ~10% with user prompt
- Safari: 50MB without prompt (⚠️ most restrictive)

**Strategy**:
- Start with 5-10 songs cached (safe for all browsers)
- Implement quota checking before downloads
- Provide clear feedback when storage is low
- Allow users to manage cached content

---

### Phase 3 Completion Criteria

You'll know Phase 3 is done when:
- [ ] App loads offline (after first online visit)
- [ ] User can cache songs with download button
- [ ] Cached songs play without network
- [ ] Cache management UI shows storage usage
- [ ] Service Worker updates don't break app
- [ ] Works in Chrome, Firefox, Safari (with known limitations)

---

## Pre-Phase 3 Checklist

Before generating Phase 3 code:

**Code Readiness**:
- [ ] Phase 2 code is clean and working
- [ ] No known bugs in catalog loading or playback
- [ ] catalog.json has song URLs that will remain stable

**Context Preparation**:
- [ ] Add constitution.md to context (for technical guidelines)
- [ ] Add phase3-caching.md spec to context
- [ ] Add src/app.js to context (to build on existing patterns)
- [ ] Consider adding successful Phase 2 patterns as examples

**Decision Points**:
- [ ] Vanilla SW or Workbox? (Start vanilla, pivot if needed)
- [ ] Build tool? (Defer until needed)
- [ ] Testing? (Manual first, automated if pain point emerges)

**Mental Preparation**:
- Service Workers are the most complex part of this project
- Expect 2-3 iterations to get it right
- AI may struggle with SW lifecycle - be ready to debug or manual implement
- This phase typically takes 2-3x longer than Phase 1 or 2

---

## Measurement & Success Criteria

### Key Metrics (Track These)
- **Lighthouse Score**: Aim for 90+ in all categories
- **Bundle Size**: Monitor with each deploy
- **Build Time**: Keep under 30 seconds
- **Test Coverage**: Aim for 80%+ (once tests are added)

### User Experience Metrics
- **Load time**: < 3s on 3G
- **Time to first interaction**: < 5s
- **Song playback latency**: < 1s
- **Search response time**: < 100ms

### Code Quality Metrics
- **Linter warnings**: Zero
- **Console errors in production**: Zero
- **Accessibility violations**: Zero (use axe DevTools)

---

## Non-Goals (What This Project Is NOT)

❌ Production music streaming service  
❌ Spotify competitor  
❌ Monetized app  
❌ Enterprise-scale application  
❌ Comprehensive music management suite  

✅ Learning project for AI-assisted development  
✅ PWA proof-of-concept  
✅ Modern web development showcase  
✅ Portfolio piece  

---

## Dependency Decision Log

**Purpose**: Track all dependencies added, with rationale and impact assessment.

### Current Dependencies (Phase 1-3)

**None** - Pure vanilla JavaScript, HTML, CSS

### Decisions Made

| Phase | Decision | Rationale | Status |
|-------|----------|-----------|--------|
| Phase 1 | No frameworks | Learn fundamentals, minimize bundle size | ✅ Validated - worked perfectly |
| Phase 1 | Vanilla JS only | Web Audio API + DOM manipulation sufficient | ✅ Validated - no complexity issues |
| Phase 2 | No build tools | Fetch + JSON simple enough without bundling | ✅ Validated - no performance issues |
| Phase 2 | No search library | Native Array.filter() + debounce sufficient | ✅ Validated - smooth with 100+ songs |
| Phase 3 | TBD: Workbox? | Service Workers are complex - may need abstraction | ⏳ Pending evaluation |
| Phase 3 | TBD: Build step? | May need for SW optimization and code splitting | ⏳ Pending evaluation |

### Future Considerations

| Candidate | Use Case | Approved? | Notes |
|-----------|----------|-----------|-------|
| Workbox | Service Worker abstraction | 🟡 Maybe | Evaluate after attempting vanilla SW |
| Vite | Build tooling for production | 🟡 Maybe | Only if we need bundling/minification |
| Vitest | Testing framework | 🟡 Maybe | Add when codebase reaches 500+ LOC |
| Svelte | UI framework | 🟡 Maybe | Only if state management becomes painful |
| TypeScript | Type safety | 🔴 No (for now) | Use JSDoc instead; revisit if type errors become frequent |

**Decision Criteria** (all must be true to add a dependency):
1. Solves a real problem you've encountered (not hypothetical)
2. Vanilla JS solution would be >50 LOC or significantly complex
3. Bundle size impact is < 20KB (or justified by major functionality)
4. Library is actively maintained (updated within last 6 months)
5. Adds no transitive dependencies (or very few)

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

### Phase 3: Offline & Caching ⏳ IN PROGRESS
**Target Completion**: TBD  
**Status**: Ready to start - Phases 1-2 foundation is solid

**Key Questions to Answer**:
- Can we manage Service Workers without Workbox? (Vanilla SW is 200+ LOC typically)
- Is IndexedDB complexity manageable with vanilla JS?
- Do we need a build step for SW optimization?
- How do we handle SW lifecycle (install, activate, update)?
- Storage quota management - how to handle gracefully?

**Expected Constitution Updates**:
- Likely: Add Workbox to approved dependencies (SW abstraction)
- Likely: Introduce build step (Vite or esbuild for production optimization)
- Possible: Add testing framework (Vitest) if complexity increases significantly
- Monitor: Bundle size (must stay under 200KB for app shell)

**Pre-Phase 3 Checklist**:
- ✅ Phase 1-2 code is working and stable
- ✅ Constitution updated with learnings
- ✅ catalog.json is well-structured (Phase 2)
- ⏳ Review Phase 3 spec thoroughly
- ⏳ Decide: Vanilla SW or Workbox? (recommend attempting vanilla first, then evaluate)
- ⏳ Set up testing approach (manual initially, automated if needed)

---

## Revision History

- **v1.0** (2026-01-26): Initial constitution based on project kickoff discussion
- **v1.1** (2026-01-26): Added progressive enhancement philosophy, Dependency Decision Log, and Phase Completion Checklist after Phase 1 success
- **v1.2** (2026-01-26): Updated with Phase 1 & 2 completion learnings; added AI-Assisted Debugging workflow; prepared for Phase 3 with informed expectations

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
