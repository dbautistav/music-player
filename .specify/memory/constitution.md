# Music Player Constitution

**Purpose**: Define core principles, constraints, and governance for the music-player project to ensure consistency, quality, and maintainability.

## Core Principles

### I. Offline-First Architecture

Every feature must work offline when appropriate:
- Core functionality (playback, cache management, visualizer) must function without network
- Progressive enhancement: Online features enhance but never block offline capability
- Service Workers and IndexedDB for offline data persistence
- Network operations are optimistic; UI remains responsive during fetch/cache

**Rationale**: Offline capability is the primary differentiator and core value proposition.

### II. Mobile-First Responsive Design

All UI/UX starts mobile-first, then adapts to larger screens:
- Design for touch interaction first (44px minimum tap targets)
- Ensure text readability on small screens without zooming
- Responsive breakpoints: Mobile (<768px), Tablet (768px-1024px), Desktop (>1024px)
- Test on real mobile devices or emulators

**Rationale**: Short-term goal is mobile-first; long-term goal includes iOS app wrapping.

### III. Type Safety & Modern Standards

All code must use TypeScript with strict type checking:
- Strict mode enabled (`strict: true` in tsconfig)
- No `any` types unless explicitly justified in code review
- Use modern JavaScript/TypeScript features (ES2022+)
- Web platform APIs over libraries when native equivalents exist

**Rationale**: Meets "code quality, maintainability" requirement and catches errors early.

### IV. Performance Standards

All features must meet performance benchmarks:
- Cached playback starts within 1 second
- Streaming playback starts within 3 seconds
- Catalog loads within 3 seconds on typical mobile connection
- Visualizer maintains 60fps during playback
- UI controls respond within 100ms
- Initial bundle size <50MB (gzipped)

**Rationale**: Performance is explicitly required and impacts user experience significantly.

### V. Test-Driven Development (NON-NEGOTIABLE)

All production code requires tests before implementation:
- Write tests first, make them fail, then implement (Red-Green-Refactor)
- Unit tests for services and utilities (Vitest)
- Component tests for UI components (React Testing Library)
- Integration tests for service interactions
- E2E tests for critical user journeys (Playwright)

**Rationale**: Ensures code quality, maintainability, and "highest standards" requirement.

### VI. Progressive Web App Standards

All code must follow PWA best practices:
- Installable with Web App Manifest
- Service Worker registered and active
- Lighthouse PWA audit score >= 90
- HTTPS-only (except localhost)
- Workbox for Service Worker caching strategies
- Offline fallback pages for all routes

**Rationale**: PWA capability is core to the architecture and enables iOS app wrapping.

### VII. Observability

All features must emit observable signals:
- Error logging with timestamps and context
- User action metrics (cache operations, playback starts)
- Performance metrics (load times, operation duration)
- Structured logging format for easy parsing

**Rationale**: Required by spec (FR-023, FR-024) and essential for production debugging.

### VIII. Modern Web APIs

Prefer native web platform APIs over libraries when equivalent:
- Web Audio API for playback and visualization
- IndexedDB for large data storage
- Service Workers for offline capability
- Web App Manifest for installability
- Libraries only when they provide significant value over native APIs

**Rationale**: Reduces dependencies, leverages browser optimizations, future-proofs the codebase.

## Technology Stack

### Required Technologies

**Frontend Framework**: React 18+ with TypeScript 5.x
- Component-based architecture
- Hooks for state management
- React Testing Library for component tests

**Build Tool**: Vite 5.x
- Fast HMR for development
- Native ES modules
- PWA plugin support

**Storage**: IndexedDB (song cache) + localStorage (preferences)
- IndexedDB for large binary data
- localStorage for simple key-value pairs

**Testing**:
- Vitest for unit tests
- Playwright for E2E tests
- React Testing Library for component tests

**PWA**:
- Service Worker with Workbox
- Web App Manifest
- HTTPS deployment

### Constraints

**Browser Support**:
- iOS Safari 15+ (PWA support)
- Chrome/Edge 90+
- Firefox 88+
- Samsung Internet 15+

**Performance**:
- Bundle size <50MB (gzipped)
- Time to Interactive <5s on 3G
- First Contentful Paint <1s

**Security**:
- Content Security Policy enabled
- HTTPS-only (except localhost)
- Input sanitization
- No inline scripts
- File type validation before storage

## Development Workflow

### Feature Development

1. **Specification Phase** (`/speckit.specify`)
   - Write user stories with acceptance criteria
   - Define success criteria (measurable, technology-agnostic)
   - Complete before implementation starts

2. **Clarification Phase** (`/speckit.clarify`)
   - Resolve ambiguities in specification
   - Document decisions in spec
   - Maximum 5 clarification questions per feature

3. **Planning Phase** (`/speckit.plan`)
   - Generate research, data model, contracts, quickstart
   - Define technology stack and architecture
   - Validate against constitution

4. **Task Breakdown** (`/speckit.tasks`)
   - Create implementation tasks
   - Prioritize dependencies
   - Assign to team members

5. **Implementation Phase**
   - Write tests first (TDD)
   - Implement feature
   - Run tests: `npm test`
   - Type check: `npm run typecheck`
   - Lint: `npm run lint`

6. **Review & Merge**
   - Code review required for all changes
   - Reviewer checks: test coverage, type safety, performance
   - No merge without passing tests

### Quality Gates

**Before Merge**:
- [ ] All tests pass (`npm test`)
- [ ] Type check passes (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] Lighthouse PWA score >= 90
- [ ] Performance benchmarks met
- [ ] No console errors/warnings

**Before Release**:
- [ ] All P1 features complete
- [ ] E2E tests pass on target browsers
- [ ] Manual testing on real mobile device
- [ ] Documentation updated

## Code Quality Standards

### TypeScript Guidelines

```typescript
// Strict mode configuration
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### React Guidelines

- Use functional components with hooks
- Prefer composition over inheritance
- Custom hooks for reusable logic
- Context API for global state (if needed)
- Avoid prop drilling beyond 2 levels

### Testing Guidelines

```typescript
// Unit test example
describe('CacheService', () => {
  it('should cache song successfully', async () => {
    const service = new CacheService();
    await service.cacheSong(testSong);
    const cached = await service.getCachedSongs();
    expect(cached).toContain(testSong);
  });
});

// Component test example
describe('SongCard', () => {
  it('should display song title and artist', () => {
    render(<SongCard song={testSong} />);
    expect(screen.getByText(testSong.title)).toBeInTheDocument();
  });
});

// E2E test example
test('user can play cached song offline', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="song-1"]');
  await expect(page.locator('[data-testid="playback-active"]')).toBeVisible();
  // Simulate offline
  await page.context.setOffline(true);
  await expect(page.locator('[data-testid="playback-active"]')).toBeVisible();
});
```

### Service Layer Guidelines

- All services implement interface contracts
- Event-driven architecture for async operations
- Error handling with typed errors
- Logging for all external operations

```typescript
interface ICacheService {
  cacheSong(song: Song, onProgress?: (p: number) => void): Promise<void>;
  removeSong(song: Song): Promise<void>;
  getCacheStats(): Promise<CacheStats>;
}
```

## Security Requirements

### Input Validation

- Validate all user inputs (file types, URLs, text)
- Sanitize data before rendering
- Use Content Security Policy headers

### Data Protection

- No sensitive data in localStorage
- Encrypted IndexedDB for sensitive data (future: user auth)
- Secure storage for API keys (future)

### Network Security

- HTTPS-only (except localhost)
- Validate and sanitize external catalog data
- No mixed content (HTTP/HTTPS)

## Performance Standards

### Bundle Optimization

- Code splitting for routes
- Lazy load components
- Tree shaking for unused code
- Modern image formats (WebP with fallback)

### Loading Performance

- Preload critical resources
- Progressive rendering
- Skeleton screens during loading
- Debounce search/filter operations

### Runtime Performance

- Debounce/throttle event handlers
- Virtualization for long lists
- Memoize expensive computations
- Avoid layout thrashing

## Governance

### Amendment Process

1. **Proposal**: Create issue describing proposed change
2. **Review**: Team reviews impact on existing code
3. **Approval**: Project owner approves amendment
4. **Documentation**: Update this constitution with rationale
5. **Migration**: Update existing code to comply (with deprecation period)

### Violation Handling

- **Minor violations**: Document in PR, justify, schedule fix
- **Major violations**: Block PR until resolved
- **Critical violations**: Rollback changes immediately

### Compliance Verification

- All PRs must pass constitution check
- CI/CD runs automated checks
- Manual review for subjective requirements

### Versioning

Constitution follows semantic versioning:
- **Major**: Breaking changes to core principles
- **Minor**: Additions or non-breaking changes
- **Patch**: Corrections or clarifications

---

**Version**: 1.0.0 | **Ratified**: 2025-01-25 | **Last Amended**: 2025-01-25
