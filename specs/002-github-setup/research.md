# Research & Decision Log: GitHub Setup and CI/CD

**Feature**: `002-github-setup`
**Date**: 2026-01-26
**Status**: Complete

## Research Tasks

### Task 1: Node.js Version Selection

**Question**: Which Node.js LTS version should be specified in `.nvmrc`?

**Options Considered**:
- Node.js 20 LTS (Iron)
- Node.js 22 LTS (Jellyfish - latest LTS)

**Research Findings**:
- Node.js 20 LTS is widely adopted and stable
- Node.js 22 LTS is the latest LTS (released late 2025), includes performance improvements and better ES module support
- Vite 5.x supports both versions
- GitHub Actions runners support both versions
- TypeScript 5.x works with both versions

**Decision**: **Node.js 22 LTS (Jellyfish)**

**Rationale**:
- Latest LTS provides best long-term support (until April 2027)
- Performance improvements benefit build times (aligns with SC-006)
- Better ES module support aligns with modern web standards
- Vite and TypeScript ecosystem fully compatible
- GitHub Actions includes Node.js 22 on runners

**Alternatives Considered**: Node.js 20 LTS (stable, but will reach EOL in 2026)

---

### Task 2: Rust-Powered Build Tool Selection

**Question**: Which rust-powered build tool should be used for Vite optimization?

**Options Considered**:
- esbuild (written in Go, extremely fast)
- swc (written in Rust, compatible with SWC ecosystem)
- @vitejs/plugin-react-swc (official Vite plugin with swc)

**Research Findings**:
- esbuild is fastest but limited to bundling
- swc provides both bundling and transpilation, TypeScript support
- @vitejs/plugin-react-swc is the officially recommended plugin for Vite + React projects
- swc has better TypeScript support and is actively maintained by Vercel
- esbuild is already used by Vite internally, swc provides additional speed for React/TSX

**Decision**: **@vitejs/plugin-react-swc**

**Rationale**:
- Official Vite plugin, well-maintained
- Significant speed improvement for React Fast Refresh during development
- Faster TypeScript transpilation (aligns with <5 minute build goal)
- Seamless integration with existing Vite configuration
- Actively maintained by Vite team and Vercel

**Alternatives Considered**: esbuild (already used by Vite, no additional benefit), swc directly (requires more configuration)

---

### Task 3: GitHub Actions Workflow Structure

**Question**: What is the optimal GitHub Actions workflow structure for a Vite + TypeScript PWA project?

**Research Findings**:
- Use matrix strategy for multiple browser/node version testing if needed
- Cache node_modules and build artifacts to speed up builds
- Run tests on Ubuntu (GitHub Actions provides fastest runners)
- Use Vite's built-in preview for E2E testing
- Deploy only on successful build + test passes
- Use GitHub Pages deployment action from GitHub
- Run Lighthouse CI for PWA score validation
- Parallelize independent job steps

**Decision**: **Single workflow with job dependencies: install → lint → test → build → deploy**

**Rationale**:
- Sequential execution ensures quality gates at each step
- Fail-fast behavior saves CI minutes
- Caching strategy reduces build time by 50-70%
- Parallel execution of independent tests where possible
- Clear separation of concerns between job steps
- Easy to debug and maintain

**Key Optimizations**:
- Cache dependencies: `actions/cache` for node_modules
- Parallel test execution: Vitest runs tests in parallel
- Deploy only from main branch
- Cancel previous workflow runs on new commits to save resources

---

### Task 4: GitHub Pages Deployment Configuration

**Question**: How should GitHub Pages be configured for a PWA with Vite?

**Research Findings**:
- GitHub Pages serves static files from a specific folder (default: `docs/` or root)
- Vite builds to `dist/` directory by default
- Need to configure base path in `vite.config.ts` if repository name != GitHub Pages URL
- Service Worker registration needs to account for GitHub Pages subdirectory paths
- HTTPS is automatically provided by GitHub Pages
- Custom domain support available if needed
- Deployment action: `peaceiris/actions-gh-pages@v3`

**Decision**: **Deploy from `dist/` directory to GitHub Pages root with automatic base path detection**

**Rationale**:
- Standard Vite build output requires minimal configuration
- GitHub Pages action handles deployment automatically
- Base path can be detected from `github.repository` context
- Service Worker can be configured with proper scope
- Aligns with PWA requirements (HTTPS, static hosting)
- Simplest approach with no custom domain needed

**Configuration Requirements**:
- Set `base` in `vite.config.ts` dynamically based on environment
- Deploy only from main branch
- Use `peaceiris/actions-gh-pages@v3` for reliable deployment
- Configure GitHub Pages source as `gh-pages` branch (standard practice)

---

### Task 5: Standard .gitignore Patterns

**Question**: What should be included in `.gitignore` for a React + Vite + PWA project?

**Research Findings**:
- Node.js: `node_modules/`, `package-lock.json` (if using npm), `.npm/`
- Build outputs: `dist/`, `build/`, `.vite/`
- IDE: `.vscode/`, `.idea/`, `*.swp`, `*.swo`
- OS: `.DS_Store` (macOS), `Thumbs.db` (Windows), `.desktop.ini`
- Logs: `*.log`, `npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`
- Testing: `coverage/`, `.nyc_output/`, `playwright-report/`, `test-results/`
- Environment: `.env.local`, `.env.*.local`
- Misc: `.turbo/`, `.cache/`, `.parcel-cache/`

**Decision**: **Comprehensive .gitignore covering all Node.js, React, Vite, and PWA artifacts**

**Rationale**:
- Prevents committing generated files (node_modules, dist)
- Excludes IDE and OS-specific files to keep repo clean
- Avoids committing local environment files (secrets, local overrides)
- Excludes test coverage and E2E artifacts
- Follows industry best practices for Node.js projects
- Reduces repository size and improves clone times

---

### Task 6: Caching Strategy for GitHub Actions

**Question**: How to optimize GitHub Actions workflow with caching to meet <5 minute build goal?

**Research Findings**:
- `actions/cache@v4` for node_modules and build cache
- Cache key: `node-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}`
- Vite provides `vite-plugin-compression` for caching during development
- GitHub Actions provides runners with pre-installed tools
- Build dependencies can be cached separately from node_modules
- TypeScript .tsbuildinfo can be cached for faster type checking

**Decision**: **Multi-level caching: dependencies + build cache**

**Rationale**:
- node_modules cache reduces install time from 2-3 minutes to 10-30 seconds
- Build cache speeds up Vite builds by reusing previous compilation
- Combined with swc plugin, meets <5 minute build goal easily
- Simple cache key strategy ensures cache busting on dependency changes
- Significant cost savings on GitHub Actions minutes

**Cache Strategy**:
1. node_modules cache (keyed by package-lock.json hash)
2. Next.js/Vite build cache (keyed by source files hash)
3. Browser binary cache for Playwright E2E tests
4. Restore cache on job start, save on job success

---

## Summary of Technical Decisions

| Decision | Choice | Impact |
|----------|--------|--------|
| Node.js Version | 22 LTS (Jellyfish) | Latest LTS, better performance, supported until 2027 |
| Build Tool | @vitejs/plugin-react-swc | Faster React/TS compilation, official Vite plugin |
| Workflow Structure | Sequential jobs with caching | Reliable, fail-fast, <5 minute builds |
| GitHub Pages Config | Deploy dist/ to root | Standard Vite setup, minimal configuration |
| .gitignore | Comprehensive Node.js/React patterns | Clean repository, smaller clone size |
| Caching | Multi-level (deps + build) | 50-70% faster builds, cost savings |

## Alignment with Constitution

All decisions align with the music-player constitution:
- ✅ Offline-First: Infrastructure enables offline development
- ✅ Mobile-First: No constraints on UI/UX design
- ✅ Type Safety: TypeScript 5.x + strict mode
- ✅ Performance: <5 minute builds via swc + caching
- ✅ Test-Driven: CI enforces tests before merge
- ✅ PWA Standards: GitHub Pages supports HTTPS, Service Worker
- ✅ Modern Web APIs: Uses native tooling where possible

## Open Questions

None. All technical decisions resolved.
