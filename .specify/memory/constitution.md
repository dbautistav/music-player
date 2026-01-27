# Music Player PWA - Technical Constitution

**Version**: 1.0  
**Last Updated**: 2026-01-26  
**Purpose**: Define technical principles, constraints, and architectural decisions that guide all implementation phases

---

## Core Philosophy

This project prioritizes:
1. **Incremental progress** - Small, working iterations over big-bang releases
2. **Modern standards** - Use current best practices, not legacy approaches
3. **Simplicity first** - Start minimal, add complexity only when needed

---

## Technology Stack

### Language & Runtime
- **JavaScript**: ES6+ features required (const/let, arrow functions, template literals, async/await)
- **No TypeScript**: Keep it simple for Phase 1-3; may introduce later
- **Node.js version**: LTS (22.x) - specified in `.nvmrc`

### Frameworks & Libraries

**Phase 1-2**: Zero dependencies
- Vanilla JavaScript only
- No React, Vue, Svelte, or similar frameworks
- No jQuery or lodash
- Rationale: Understand web fundamentals before adding abstractions

**Phase 3**: Minimal, targeted additions
- Consider Workbox for Service Worker complexity
- May use lightweight utilities if they solve real problems
- Each dependency must be justified

**Phase 4+**: Framework consideration
- If complexity warrants it, evaluate modern options (Svelte, Preact, Lit)
- Decision should be data-driven (bundle size, learning curve, ecosystem)

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

## Revision History

- **v1.0** (2026-01-26): Initial constitution based on project kickoff discussion

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
