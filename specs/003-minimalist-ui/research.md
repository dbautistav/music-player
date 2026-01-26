# Research & Decision Log: Minimalist UI/UX Design System

**Feature**: `003-minimalist-ui`
**Date**: 2026-01-26
**Status**: Complete

## Research Tasks

### Task 1: Design Token Architecture

**Question**: How should design tokens (colors, typography, spacing, shadows, borders) be structured and managed?

**Options Considered**:
- Hardcoded values in components
- CSS Custom Properties (variables)
- JavaScript/CSS-in-JS token system
- Design token tools (Style Dictionary, Theo)

**Research Findings**:
- CSS Custom Properties are native browser feature (modern browser support: 96%+)
- Enables runtime theme switching without recompilation
- Automatic updates to all consuming components
- Can be accessed in JavaScript for computed values
- TypeScript types can be generated from CSS custom properties
- Performance: Native browser feature, minimal overhead
- Accessibility: Can be overridden by user's system preferences

**Decision**: **CSS Custom Properties with TypeScript interface definitions**

**Rationale**:
- Native browser support eliminates build complexity
- Enables seamless theme switching (critical for User Story 3)
- TypeScript interfaces ensure type safety for design tokens
- Easy to maintain and extend
- Aligns with PWA requirements (offline-capable)
- Supports user's system theme preferences (CSS media queries)

**Alternatives Considered**: JavaScript token systems (more complex, requires build), Design token tools (overkill for single project), Hardcoded values (unmaintainable, violates DRY)

---

### Task 2: Variable Fonts Implementation

**Question**: How should variable fonts with multiple weights be implemented?

**Options Considered**:
- Multiple font files (one per weight)
- Variable font file (single file with multiple axes)
- Font subset per weight
- System fonts with variable weights

**Research Findings**:
- Variable fonts reduce HTTP requests (single file vs 4-5 separate files)
- CSS `font-variation-settings` controls weight, width, slant axes
- Modern browsers support variable fonts (Chrome 102+, Safari 11+, Edge 102+, Firefox 93+)
- Better performance: Smaller download size, faster load times
- Typography scale can use granular weights (e.g., 350, 500, 650 instead of just 400, 700)
- Fallback: Can provide separate font files for older browsers

**Decision**: **Variable font with CSS font-variation-settings and fallback files**

**Rationale**:
- Single file reduces network requests (aligns with PWA offline capability)
- Granular weight control enables better typography hierarchy
- Modern browser support covers target audience (iOS Safari 15+, Chrome 90+)
- Fallback files ensure compatibility with older browsers
- Performance benefit: Smaller download size, faster initial load

**Alternatives Considered**: Multiple font files (more HTTP requests, slower), Font subsets (limited granularity), System fonts (limited control, inconsistent across devices)

---

### Task 3: WCAG 2.1 AA Accessibility Implementation

**Question**: How to ensure all interfaces meet WCAG 2.1 AA standards (4.5:1 contrast ratio, keyboard navigation, screen reader compatibility)?

**Options Considered**:
- Manual visual inspection and testing
- Automated accessibility testing tools (axe-core, Lighthouse)
- Accessibility overlays (WAVE, axe DevTools)
- Screen reader testing (NVDA, VoiceOver, JAWS)

**Research Findings**:
- **Contrast**: 4.5:1 ratio for normal text, 3:1 for large text (18pt+)
- **Keyboard**: All interactive elements must be keyboard accessible
- **Screen Reader**: Semantic HTML, ARIA labels where needed, proper heading hierarchy
- **Focus Indicators**: Visible, distinct focus states (outline or background change)
- **Color Independence**: Information not conveyed by color alone (use icons, text, patterns)
- **Motion**: Respect `prefers-reduced-motion` media query
- **Testing Tools**:
  - axe-core: Automated accessibility testing
  - Lighthouse: Includes accessibility audit
  - WAVE: WebAIM Evaluation Tool (browser extension)
  - Screen reader testing: VoiceOver (macOS), NVDA (Windows)
- **Best Practices**:
  - Use semantic HTML5 elements
  - Provide `alt` text for images
  - Label all form inputs
  - Ensure sufficient spacing around interactive elements
  - Test with keyboard only (no mouse)

**Decision**: **Automated testing (axe-core, Lighthouse) + Manual testing (screen reader, keyboard) + Design token validation**

**Rationale**:
- Automated tools catch 60-70% of issues (axe-core, Lighthouse)
- Manual testing ensures real-world usability (screen reader, keyboard)
- Design token validation enforces contrast at design system level
- CI/CD integration possible (axe-core in tests, Lighthouse in CI)
- Aligns with constitution's accessibility requirements
- Catches issues early in development lifecycle

**Alternatives Considered**: Manual visual inspection only (inconsistent, misses issues), Automated testing only (misses real-world usability), No testing (violates WCAG requirements)

---

### Task 4: Theme Switching Pattern

**Question**: How should light/dark mode switching be implemented with modern dark mode 2.0 (desaturated colors, subtle grey tones)?

**Options Considered**:
- CSS class-based toggling (`.theme-dark`, `.theme-light`)
- CSS custom property-based switching
- JavaScript-driven theme application
- System preference detection only

**Research Findings**:
- **CSS Custom Properties**: Native support, best for runtime switching
- **System Preference**: `prefers-color-scheme` media query detects user's system setting
- **Modern Dark Mode 2.0**:
  - Not simple color inversion
  - Desaturated colors (reduce eye strain)
  - Subtle grey tones (not pure black backgrounds)
  - Accent colors adjusted for dark backgrounds (same hue, different saturation/lightness)
- **State Persistence**: localStorage to remember user's manual choice
- **Smooth Transitions**: CSS transitions on color properties (`transition: background-color 0.3s ease`)
- **Content Preservation**: Scroll position, form data must be preserved during theme switch
- **Hybrid Approach**:
  1. Detect system preference on first load
  2. Allow manual override in settings
  3. Store preference in localStorage
  4. Apply theme via CSS custom properties

**Decision**: **CSS custom properties with system preference detection + localStorage persistence + smooth transitions**

**Rationale**:
- CSS custom properties enable efficient runtime switching (no recompilation)
- System preference detection provides optimal default (respects user's choice)
- localStorage persistence remembers manual override
- Smooth transitions provide polished UX (aligns with micro-interactions story)
- Supports 3 curated palettes (Japandi, Digital Slate, Minimalist Dark Mode)
- Aligns with PWA requirements (works offline)

**Alternatives Considered**: CSS class toggling (requires multiple stylesheets, harder to maintain), JavaScript-only (slower, less performant), System-only (no manual override)

---

### Task 5: Micro-interaction Best Practices

**Question**: How to implement subtle, purposeful animations for micro-interactions (hover, click, transitions) that are feedback-focused, not decorative?

**Options Considered**:
- CSS transitions on all states
- JavaScript animation libraries (Framer Motion, React Spring)
- Web Animations API
- No animations (static UI)

**Research Findings**:
- **Purpose**: Provide feedback (user action confirmed), not decoration
- **Timing Guidelines**:
  - Hover: 100-200ms (subtle, responsive)
  - Click/Tap: 150-300ms (feedback confirmation)
  - Page transitions: 200-400ms (context change)
  - Modal/card open: 150-300ms (smooth appearance)
- **Easing**: Natural curves (ease-out, ease-in-out) not linear (jarring)
- **Properties to Animate**:
  - Color: Background, text, border
  - Transform: Scale (slight), translateY (slight), opacity
  - Box-shadow: Subtle changes for depth
- **Avoid**: Rotation, scale >1.1, large translations (distracting)
- **Performance**: `prefers-reduced-motion` media query disables animations
- **CSS vs JS**: CSS transitions preferred (GPU-accelerated, performant)
- **Testing**: 60fps maintenance (use browser DevTools Performance tab)

**Decision**: **CSS transitions with natural easing, specific timing (100-400ms range), respects prefers-reduced-motion**

**Rationale**:
- CSS transitions are GPU-accelerated (smooth performance)
- Specific timing aligns with success criteria (<300ms for micro-interactions)
- Natural easing provides polished, professional feel
- `prefers-reduced-motion` respects accessibility (constitution requirement)
- JavaScript animations only for complex interactions (page transitions)
- Aligns with "invisible" UI principle (feedback-focused, not decorative)

**Alternatives Considered**: JavaScript animation libraries (overkill, larger bundle), No animations (violates spec requirement), Excessive animations (distracting, violates minimalist principle)

---

### Task 6: Responsive Design Patterns

**Question**: How to implement mobile-first responsive design with breakpoints (<768px, 768-1024px, >1024px) and gesture-friendly targets?

**Options Considered**:
- Mobile-first CSS (base styles = mobile, min-width media queries for larger screens)
- Desktop-first CSS (base styles = desktop, max-width media queries for mobile)
- Container queries (experimental browser support)
- Component-level responsive props

**Research Findings**:
- **Mobile-First Approach**:
  - Write base CSS for mobile (<768px)
  - Use `@media (min-width: 768px)` for tablet
  - Use `@media (min-width: 1024px)` for desktop
  - Progressive enhancement: Add features for larger screens
- **Touch Targets**: 44px minimum (Apple HIG, Material Design)
  - 44px × 44px minimum tap area
  - 8px minimum spacing between touch targets
  - Thumb zone: Place primary actions in bottom 1/3 of screen
- **Breakpoints**:
  - Mobile: <768px (single column, simplified nav)
  - Tablet: 768-1024px (multi-column, adapted nav)
  - Desktop: >1024px (full layout, horizontal space)
- **CSS Techniques**:
  - Flexbox and Grid for layouts
  - Relative units (%, rem, vh/vw) instead of fixed px
  - `clamp()` for fluid typography
  - `max-width` containers
  - Responsive images: `srcset`, `picture` element
- **Testing**: Test on real devices, not just browser resize

**Decision**: **Mobile-first CSS with flexbox/grid, relative units, 44px touch targets, 3 breakpoints**

**Rationale**:
- Mobile-first aligns with constitution and user story requirements
- Progressive enhancement ensures mobile users get optimized experience
- 44px touch targets meet Apple HIG and Material Design guidelines
- Flexbox/Grid provides modern, flexible layouts
- Relative units enable fluid scaling across all screen sizes
- Aligns with "gesture-friendly targets" requirement (FR-006, FR-031)

**Alternatives Considered**: Desktop-first (requires more code, mobile often an afterthought), Container queries (limited browser support), Fixed breakpoints (not fluid, breaks on unusual screen sizes)

---

### Task 7: Performance Optimization for CSS

**Question**: How to ensure fast rendering (<100ms render time) and smooth animations (60fps) with design system?

**Options Considered**:
- Optimized CSS (minified, purged, critical CSS inline)
- GPU acceleration (will-change, transform, opacity)
- Reducing repaints/reflows
- Content visibility API for lazy loading

**Research Findings**:
- **Critical CSS**: Inline critical CSS above the fold for faster First Contentful Paint
- **Minification**: Remove whitespace, comments, unused CSS
- **PurgeCSS**: Remove unused CSS classes (tree shaking for CSS)
- **GPU Acceleration**:
  - `will-change: transform` for elements that will animate
  - `transform: translate3d(0,0,0)` for layer creation
  - Animate `transform`, `opacity` only (avoid width, height, margin)
- **Reduce Repaints/Reflows**:
  - Use `contain: layout` or `contain: paint`
  - Batch DOM reads/writes
  - Avoid forced synchronous layouts (offsetWidth, scrollTop)
- **Content Visibility**: Lazy load images below the fold
- **Bundle Size**: Design tokens increase bundle size, but reusable components reduce overall size

**Decision**: **Critical CSS inlining + PurgeCSS for unused styles + GPU acceleration for animations + Content Visibility API for lazy loading**

**Rationale**:
- Aligns with performance targets (render <100ms, load <2s)
- Critical CSS improves First Contentful Paint (<1s constitution requirement)
- PurgeCSS removes unused design tokens (reduces bundle size)
- GPU acceleration ensures 60fps animations
- Content Visibility API reduces initial load (lazy load non-critical images)
- Aligns with constitution's bundle optimization requirements

**Alternatives Considered**: No optimization (violates performance targets), Inline all CSS (increases bundle size), No GPU acceleration (stutters on animations)

---

### Task 8: Design Token Validation

**Question**: How to validate that color usage follows 60-30-10 rule and WCAG contrast ratios across all components?

**Options Considered**:
- Manual visual inspection
- Automated design token tests
- Lighthouse color contrast audit
- CI/CD integration for design token validation

**Research Findings**:
- **60-30-10 Rule**:
  - 60% background (neutral base)
  - 30% secondary (text, borders, surfaces)
  - 10% accent (CTAs only)
- **Validation Approaches**:
  - Automated: Color contrast calculation in tests (axe-core, color-contrast-ratio package)
  - Visual: Design reviews with color checker tools (Adobe Color, WebAIM Contrast Checker)
  - Lighthouse: Includes accessibility audit with contrast checks
  - CI/CD: Integrate axe-core into test suite, run Lighthouse in CI
- **Best Practices**:
  - Define color tokens with WCAG ratios verified
  - Enforce 60-30-10 rule in design system (CSS variables or JavaScript validation)
  - Test components with screen readers (not just visual)
  - Document color usage patterns for designers and developers

**Decision**: **Automated design token tests (contrast ratios) + Lighthouse audit + CI/CD integration**

**Rationale**:
- Automated tests catch violations early (before code review)
- Lighthouse audit provides comprehensive accessibility check
- CI/CD integration ensures all changes are validated (constitution requirement)
- WCAG contrast ratio calculation is automatable (not subjective)
- Aligns with "Design System Foundation" success criteria (SC-002, SC-010)
- Reduces manual testing overhead

**Alternatives Considered**: Manual inspection only (inconsistent, misses issues), No validation (violates WCAG and spec requirements), Visual tools only (no CI/CD integration)

---

## Summary of Technical Decisions

| Decision | Choice | Impact |
|----------|--------|--------|
| Design Token Architecture | CSS Custom Properties with TypeScript interfaces | Native browser support, seamless theme switching, type safety |
| Variable Fonts | Variable font with CSS font-variation-settings + fallback files | Single file reduces requests, granular weight control, better performance |
| Accessibility Implementation | Automated (axe-core, Lighthouse) + Manual testing + Design token validation | Catches 70%+ issues early, CI/CD integration, real-world usability |
| Theme Switching Pattern | CSS custom properties + system preference detection + localStorage persistence | Efficient runtime switching, respects user's choice, smooth transitions |
| Micro-interactions | CSS transitions with natural easing, 100-400ms timing, respects prefers-reduced-motion | GPU-accelerated, performant, feedback-focused |
| Responsive Design | Mobile-first CSS with flexbox/grid, relative units, 44px touch targets, 3 breakpoints | Progressive enhancement, gesture-friendly, fluid scaling |
| Performance Optimization | Critical CSS inlining + PurgeCSS + GPU acceleration + Content Visibility API | Fast rendering (<100ms), 60fps animations, reduced bundle size |
| Design Token Validation | Automated tests (contrast) + Lighthouse + CI/CD integration | Early violation detection, WCAG compliance, 60-30-10 rule enforcement |

## Alignment with Constitution

All decisions align with music-player constitution:

- ✅ **Offline-First**: CSS custom properties work offline, localStorage for theme persistence
- ✅ **Mobile-First**: Mobile-first CSS, 44px touch targets, responsive breakpoints
- ✅ **Type Safety**: TypeScript interfaces for design tokens, strict mode enabled
- ✅ **Performance Standards**: Load <2s, render <100ms, 60fps animations, <50MB bundle
- ✅ **Test-Driven**: Automated accessibility tests (axe-core), component tests
- ✅ **PWA Standards**: Service Worker caches photography, manifest installable
- ✅ **Observability**: Design token metrics, performance metrics logged
- ✅ **Modern Web APIs**: CSS custom properties, variable fonts, flexbox/grid, media queries

## Open Questions

None. All technical decisions resolved.
