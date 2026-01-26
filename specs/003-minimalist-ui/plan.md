# Implementation Plan: Minimalist UI/UX Design System

**Branch**: `003-minimalist-ui` | **Date**: 2026-01-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-minimalist-ui/spec.md`

## Summary

Implement a comprehensive minimalist UI/UX design system with three curated color palettes (Japandi, Digital Slate, Minimalist Dark Mode), variable typography scales (4 weights, 1.25 ratio), spacing systems, and accessible component library. Design follows modern minimalist principles: purposeful whitespace, deep minimalism, content-first hierarchy, and "invisible" UI with micro-interactions. System supports light/dark mode 2.0, mobile-first responsive design, WCAG 2.1 AA accessibility, and performance targets (load <2s, render <100ms, 60fps animations, interactions <300ms).

## Technical Context

**Language/Version**: TypeScript 5.x + React 18+
**Primary Dependencies**: React 18+, Vite 5.x, CSS Custom Properties, Variable Fonts
**Storage**: localStorage (theme preferences), optional: IndexedDB (future: user settings)
**Testing**: Vitest (unit), Playwright (E2E), React Testing Library (component), axe-core (accessibility), Lighthouse (PWA/Performance)
**Target Platform**: Web browsers (iOS Safari 15+, Chrome/Edge 90+, Firefox 88+, Samsung Internet 15+)
**Project Type**: Single web/PWA project (builds upon 001-pwa-music-player and 002-github-setup)
**Performance Goals**: Load time <2s, render time <100ms, 60fps animations, micro-interactions <300ms, initial bundle <50MB (gzipped)
**Constraints**: WCAG 2.1 AA compliance (4.5:1 contrast ratio), mobile-first (44px minimum touch targets), responsive breakpoints (mobile <768px, tablet 768-1024px, desktop >1024px), offline-capable (PWA requirements)
**Scale/Scope**: Design tokens for entire application, component library for all UI elements, theme switching for 3 palettes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Offline-First Architecture (Section I)
- PASS: Design system doesn't affect offline capability
- UI components work without network (already cached by PWA)
- Theme switching uses localStorage (works offline)
- Photography assets cached by Service Worker

### ✅ Mobile-First Responsive Design (Section II)
- PASS: Design system explicitly enforces mobile-first approach
- 44px minimum touch targets built into all components
- Responsive breakpoints defined (mobile <768px, tablet 768-1024px, desktop >1024px)
- Gesture-friendly sizing for mobile users

### ✅ Type Safety & Modern Standards (Section III)
- PASS: TypeScript 5.x with strict mode for all design tokens and components
- Design tokens use TypeScript interfaces for type safety
- Component library typed with TypeScript
- No `any` types in design system

### ✅ Performance Standards (Section IV)
- PASS: Comprehensive performance targets specified (load <2s, render <100ms, 60fps, <300ms)
- Bundle optimization through design token efficiency
- Micro-interactions optimized for smooth performance
- Aligns with constitution's <50MB bundle and <5s Time to Interactive

### ✅ Test-Driven Development (Section V)
- PASS: Component tests (React Testing Library) for all UI components
- Accessibility tests (axe-core) for design tokens
- Visual regression tests for component library
- E2E tests for responsive behavior across breakpoints

### ✅ Progressive Web App Standards (Section VI)
- PASS: Design system builds upon PWA foundation from Feature 001
- Theme switching works offline (localStorage)
- Service Worker caches photography assets
- Lighthouse PWA score maintained (>=90)

### ✅ Observability (Section VII)
- PASS: Design system metrics tracked (theme usage, component usage)
- Performance metrics logged (load times, render times)
- Accessibility metrics monitored (WCAG compliance)
- Structured logging for design system issues

### ✅ Modern Web APIs (Section VIII)
- PASS: Uses CSS Custom Properties (native browser support)
- Variable Fonts (CSS font-variation-settings)
- CSS Grid/Flexbox for layouts
- Media queries for responsive breakpoints
- MatchMedia API for theme detection

### Technology Stack Alignment
- ✅ React 18+ with TypeScript 5.x: Component library and design tokens
- ✅ Vite 5.x: CSS processing and HMR
- ✅ Testing: Vitest, Playwright, React Testing Library, axe-core, Lighthouse
- ✅ PWA: Service Worker, localStorage, offline support
- ✅ Browser Support: iOS Safari 15+, Chrome/Edge 90+, Firefox 88+, Samsung Internet 15+

### Quality Gates (from Constitution)
- ✅ All tests pass (`npm test`): Component, accessibility, E2E tests
- ✅ Type check passes (`npm run typecheck`): Strict TypeScript for all tokens/components
- ✅ Linting passes (`npm run lint`): Code quality standards
- ✅ Lighthouse PWA score >= 90: PWA standards maintained
- ✅ Performance benchmarks met: Load <2s, render <100ms, 60fps, <300ms
- ✅ No console errors/warnings: Clean design system implementation

**Result**: ✅ PASSED - All constitutional requirements satisfied. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/003-minimalist-ui/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── design-tokens.ts
│   ├── component-library.md
│   └── theme-switching.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Single web/PWA project (building on existing structure)
src/
├── components/          # UI component library
│   ├── atoms/          # Basic components (Button, Input, Typography)
│   ├── molecules/        # Composite components (Card, FormField)
│   └── organisms/        # Complex components (Navigation, Layout)
├── design-system/        # Design system implementation
│   ├── tokens/          # Design tokens (colors, typography, spacing)
│   ├── themes/           # Theme definitions (light, dark modes)
│   └── utils/           # Design utilities (contrast checkers, accessible color)
├── hooks/               # Custom React hooks for design system
│   ├── useTheme.ts      # Theme switching hook
│   └── useBreakpoint.ts # Responsive breakpoint hook
├── styles/              # Global styles and CSS variables
│   ├── variables.css    # CSS custom properties (design tokens)
│   └── global.css       # Global application styles
└── utils/               # General utilities

public/
├── manifest.json
├── service-worker.js
└── assets/             # Photography and static assets
    └── photography/     # Real-life photography assets

tests/
├── design-system/       # Design system tests
│   ├── tokens/          # Design token tests (contrast, color usage)
│   ├── components/      # Component tests (React Testing Library)
│   └── accessibility/   # Accessibility tests (axe-core)
├── unit/               # Unit tests (Vitest)
├── component/          # Component tests (React Testing Library)
└── e2e/                # E2E tests (Playwright)
    └── responsive/       # Responsive behavior tests
```

**Structure Decision**: Single web/PWA project with design system integrated into existing structure. Design tokens stored in `src/design-system/tokens/`, component library in `src/components/`, and global styles in `src/styles/`. Photography assets in `public/assets/photography/`. This structure aligns with constitution's single project approach and PWA requirements.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       | N/A        | N/A - No constitutional violations  |

---

## Phase 0: Research & Decision Log

*Purpose: Resolve all technical unknowns and document technology decisions*

**Status**: ✅ Complete

**Output**: [research.md](./research.md)

**Decisions Made**:
- Design Token Architecture: CSS Custom Properties with TypeScript interfaces
- Variable Fonts: Variable font with CSS font-variation-settings + fallback files
- Accessibility: Automated (axe-core, Lighthouse) + Manual testing + Design token validation
- Theme Switching Pattern: CSS custom properties + system preference detection + localStorage persistence
- Micro-interactions: CSS transitions with natural easing, 100-400ms timing, respects prefers-reduced-motion
- Responsive Design: Mobile-first CSS with flexbox/grid, relative units, 44px touch targets, 3 breakpoints
- Performance Optimization: Critical CSS inlining + PurgeCSS + GPU acceleration + Content Visibility API
- Design Token Validation: Automated tests (contrast) + Lighthouse + CI/CD integration

---

## Phase 1: Design & Contracts

*Purpose: Define data models, API contracts, and integration points*

**Status**: ✅ Complete

**Outputs**:
- [data-model.md](./data-model.md) - Design token entities and theme state machine
- [contracts/design-tokens.ts](./contracts/design-tokens.ts) - TypeScript interfaces for design tokens
- [contracts/component-library.md](./contracts/component-library.md) - Component API contracts
- [contracts/theme-switching.md](./contracts/theme-switching.md) - Theme switching API
- [quickstart.md](./quickstart.md) - Developer guide for using design system

**Contracts Defined**:
- Design token structure (colors, typography, spacing, shadows, borders)
- Component APIs (props, states, variants, accessibility)
- Theme switching API (getTheme, setTheme, subscribe)
- Responsive breakpoint system (mobile, tablet, desktop)

---

## Phase 2: Implementation Tasks

*Purpose: Define concrete implementation tasks (generated by `/speckit.tasks` command)*

**Status**: ⏳ Pending (run `/speckit.tasks` to generate)
