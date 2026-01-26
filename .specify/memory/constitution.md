<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0 (MINOR: Added two new principles)
- List of modified principles:
  * Performance Standards (clarified metrics and added domain-specific benchmarks)
  * Added Principle IX: Accessibility Standards
  * Added Principle X: Design System Adherence
- Added sections: Two new core principles (IX and X)
- Removed sections: None
- Templates requiring updates:
  ✅ .specify/templates/plan-template.md (reviewed, aligns with new principles)
  ✅ .specify/templates/spec-template.md (reviewed, aligns with new principles)
  ✅ .specify/templates/tasks-template.md (reviewed, includes accessibility and design system task categories)
- Follow-up TODOs: None - all placeholders filled
-->

# Music Player Constitution

**Purpose**: Define core principles, constraints, and governance for music-player project to ensure consistency, quality, and maintainability.

## Core Principles

### I. Offline-First Architecture

Every feature must work offline when appropriate:
- Core functionality (playback, cache management, visualizer) must function without network
- Progressive enhancement: Online features enhance but never block offline capability
- Service Workers and IndexedDB for offline data persistence
- Network operations are optimistic; UI remains responsive during fetch/cache

**Rationale**: Offline capability is primary differentiator and core value proposition.

### II. Mobile-First Responsive Design

All UI/UX starts mobile-first, then adapts to larger screens:
- Design for touch interaction first (44px minimum tap targets)
- Ensure text readability on small screens without zooming
- Responsive breakpoints: Mobile (<768px), Tablet (768px-1024px), Desktop (>1024px)
- Test on real mobile devices or emulators
- Use design system components for responsive behavior

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

**Domain-Specific Metrics** (Music Player):
- Cached playback starts within 1 second
- Streaming playback starts within 3 seconds
- Catalog loads within 3 seconds on typical mobile connection
- Visualizer maintains 60fps during playback
- UI controls respond within 100ms

**General Performance Requirements**:
- Initial bundle size <50MB (gzipped)
- Time to Interactive <5s on 3G
- First Contentful Paint <1s
- Animations maintain 60fps (use GPU acceleration)
- Optimize critical rendering path (inline critical CSS)

**Performance Validation**:
- Measure actual load times on target devices
- Profile animations for jank and stutter
- Use Lighthouse for performance audits (score >= 90)
- Monitor bundle size impact per feature

**Rationale**: Performance is explicitly required and impacts user experience significantly. Domain-specific metrics reflect music player priorities, while general requirements ensure baseline performance across all features.

### V. Test-Driven Development (NON-NEGOTIABLE)

All production code requires tests before implementation:
- Write tests first, make them fail, then implement (Red-Green-Refactor)
- Unit tests for services and utilities (Vitest)
- Component tests for UI components (React Testing Library)
- Integration tests for service interactions
- E2E tests for critical user journeys (Playwright)
- Accessibility tests (axe-core) for all UI features

**Rationale**: Ensures code quality, maintainability, and "highest standards" requirement.

### VI. Progressive Web App Standards

All code must follow PWA best practices:
- Installable with Web App Manifest
- Service Worker registered and active
- Lighthouse PWA audit score >= 90
- HTTPS-only (except localhost)
- Workbox for Service Worker caching strategies
- Offline fallback pages for all routes

**Rationale**: PWA capability is core to architecture and enables iOS app wrapping.

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

**Rationale**: Reduces dependencies, leverages browser optimizations, future-proofs codebase.

### IX. Accessibility Standards (NON-NEGOTIABLE)

All UI/UX must meet WCAG 2.1 AA standards:
- **Contrast Ratio**: Minimum 4.5:1 for normal text, 3:1 for large text (18pt+)
- **Keyboard Navigation**: All interactive elements must be keyboard accessible (Tab, Enter, Space, Escape)
- **Screen Reader Support**: Semantic HTML5 elements, proper ARIA labels, heading hierarchy
- **Focus Indicators**: Clear, visible focus states for keyboard navigation (outline, background change, border)
- **Touch Targets**: Minimum 44px × 44px for all interactive elements (8px minimum spacing)
- **Motion Preferences**: Respect `prefers-reduced-motion` media query (disable animations if preferred)
- **Color Independence**: Information not conveyed by color alone (use icons, text, patterns)

**Validation Requirements**:
- Automated accessibility tests (axe-core, Lighthouse) on all UI components
- Manual keyboard navigation testing (no mouse) for critical flows
- Screen reader testing (VoiceOver, NVDA) for user journeys
- Lighthouse accessibility score >= 90

**Rationale**: Ensures inclusive design, legal compliance in many jurisdictions, and better user experience for all users. WCAG 2.1 AA is the industry standard and required for many public-facing applications.

### X. Design System Adherence

All features must use the established design system:
- Use design tokens for colors, typography, spacing, shadows, and border radius
- Prefer component library components (atoms, molecules, organisms) over custom implementations
- Follow design system patterns (60-30-10 color distribution, purposeful whitespace)
- Respect design system constraints (subtle effects, minimalist principles)
- Custom components or patterns require team approval and design system integration

**When Design System is Insufficient**:
- Create new design tokens following established patterns
- Add new components to the component library with proper variants and states
- Document rationale for custom design decisions in PR
- Update design system documentation to include new patterns

**Validation Requirements**:
- Design tokens imported from `src/design-system/tokens/`, not hardcoded values
- Components use `@/components/` imports, not inline styling
- Design system utility functions used for common patterns (contrast checks, spacing)
- No arbitrary color values or inline styles unless explicitly justified

**Rationale**: Ensures visual consistency, reduces design debt, and accelerates development. Following established patterns prevents "reinventing the wheel" and maintains cohesive user experience across the application.

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
- axe-core for accessibility tests

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
- Animations 60fps (GPU-accelerated)

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
    - Validate against constitution (including new Accessibility and Design System principles)

4. **Task Breakdown** (`/speckit.tasks`)
    - Create implementation tasks
    - Prioritize dependencies
    - Assign to team members

5. **Implementation Phase**
    - Write tests first (TDD)
    - Implement feature using design system components and tokens
    - Run tests: `npm test`
    - Type check: `npm run typecheck`
    - Lint: `npm run lint`
    - Accessibility test: `npm run test:a11y` (if applicable)

6. **Review & Merge**
    - Code review required for all changes
    - Reviewer checks: test coverage, type safety, performance, accessibility compliance
    - No merge without passing tests

### Quality Gates

**Before Merge**:
- [ ] All tests pass (`npm test`)
- [ ] Type check passes (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] Accessibility tests pass (axe-core score >= 90)
- [ ] Design system adherence verified (tokens used, components from library)
- [ ] Lighthouse PWA score >= 90
- [ ] Performance benchmarks met
- [ ] No console errors/warnings

**Before Release**:
- [ ] All P1 features complete
- [ ] E2E tests pass on target browsers
- [ ] Manual testing on real mobile device
- [ ] Accessibility testing with keyboard and screen reader
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
- Use design system components for consistent styling

### Design System Usage Guidelines

```typescript
// ✅ Correct: Use design tokens
import { SPACING_SCALE, TYPOGRAPHY_SCALE } from '@/design-system/tokens';

const Component = () => (
  <div style={{ padding: SPACING_SCALE.comfortable }}>
    <h1 style={{ fontSize: TYPOGRAPHY_SCALE.display }}>
      Title
    </h1>
  </div>
);

// ❌ Wrong: Hardcoded values
const Component = () => (
  <div style={{ padding: '16px' }}>
    <h1 style={{ fontSize: '40px' }}>
      Title
    </h1>
  </div>
);

// ✅ Correct: Use component library
import { Button, Card, Typography } from '@/components';

const Component = () => (
  <Card>
    <Typography variant="heading2">Title</Typography>
    <Button variant="primary">Action</Button>
  </Card>
);

// ❌ Wrong: Custom styling
const Component = () => (
  <div style={{ padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
    <h2>Title</h2>
    <button style={{ padding: '16px', borderRadius: '4px', backgroundColor: '#3182CE' }}>
      Action
    </button>
  </div>
);
```

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

  it('should be accessible (keyboard navigation, screen reader)', () => {
    const { container } = render(<SongCard song={testSong} />);
    const results = axe(container);
    expect(results).toHaveNoViolations();
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
- Inline critical CSS for First Contentful Paint

### Runtime Performance

- Debounce/throttle event handlers
- Virtualization for long lists
- Memoize expensive computations
- Avoid layout thrashing
- Use GPU acceleration for animations (transform, opacity only)

## Accessibility Standards

### Color & Contrast

- Minimum 4.5:1 contrast ratio for normal text against background
- Minimum 3:1 contrast ratio for large text (18pt+) against background
- Use design system color tokens with validated contrast ratios
- Validate color combinations with automated tools (axe-core, Lighthouse)

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Logical tab order (DOM order reflects visual order)
- Focus indicators clearly visible (outline, background change, border)
- No keyboard traps (except modals with focus management)
- Support Tab, Enter, Space, Escape for common interactions

### Screen Reader Support

- Use semantic HTML5 elements (button, nav, main, etc.)
- Provide ARIA labels where text is not descriptive
- Announce dynamic content changes (live regions)
- Proper heading hierarchy (h1-h6, one h1 per page)
- Alt text for all meaningful images

### Motion & Animation

- Respect `prefers-reduced-motion` media query
- Provide option to disable non-essential animations
- Keep animations under 300ms for micro-interactions
- Use natural easing (ease-in, ease-out, ease-in-out)
- No flashing or strobing content (photosensitive users)

### Touch Targets

- Minimum 44px × 44px for all interactive elements
- 8px minimum spacing between touch targets
- Place primary actions in thumb zone (bottom 1/3 on mobile)
- Adequate padding around touch targets

## Design System Integration

### Design Token Usage

- Import colors from `src/design-system/tokens/color-tokens.ts`
- Import typography from `src/design-system/tokens/typography-tokens.ts`
- Import spacing from `src/design-system/tokens/spacing-tokens.ts`
- No hardcoded color values (use semantic roles: `--color-accent`, not `#3182CE`)
- Use responsive typography scale (rem units, modular scale)

### Component Library Usage

- Use Button component for CTAs (not custom buttons)
- Use Input component for forms (not native inputs)
- Use Typography component for text (not bare h1, p, etc.)
- Use Card component for containers (not custom divs with styles)
- Use Navigation component for navigation (not custom nav bars)

### Pattern Adherence

- Follow 60-30-10 color distribution rule (60% background, 30% secondary, 10% accent)
- Use purposeful whitespace (spacing scale for breathing room)
- Apply subtle effects (shadow scale, border radius scale)
- Maintain content-first hierarchy (typography scale for organization)

### Extending the Design System

- Create new tokens following established patterns (add to respective token files)
- Add new components to appropriate category (atoms, molecules, organisms)
- Document new tokens and components in quickstart.md
- Test new components for accessibility (axe-core) and responsiveness
- Submit PR with clear rationale for additions

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

- All PRs must pass constitution check (including Accessibility and Design System adherence)
- CI/CD runs automated checks (tests, typecheck, lint, Lighthouse, axe-core)
- Manual review for subjective requirements (design consistency, usability)
- Accessibility audit on every UI change (automated + manual keyboard testing)

### Versioning

Constitution follows semantic versioning:
- **Major**: Breaking changes to core principles
- **Minor**: Additions or non-breaking changes
- **Patch**: Corrections or clarifications

---

**Version**: 1.1.0 | **Ratified**: 2025-01-25 | **Last Amended**: 2026-01-26
