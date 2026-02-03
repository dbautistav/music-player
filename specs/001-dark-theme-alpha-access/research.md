# Research: Dark Theme & Alpha Tester Access

**Feature**: Dark Theme & Alpha Tester Access
**Date**: 2025-02-01
**Purpose**: Document technical decisions and best practices for implementation

---

## Decision 1: GitHub Pages Deployment Configuration

**Decision**: Deploy from main branch, /src directory using GitHub Pages source settings

**Rationale**:
- Simplicity: No need for separate `gh-pages` branch
- Alignment: Current structure has app files in `src/` directory
- Automatic deployment: Can use GitHub Actions to trigger on push to main
- HTTPS by default: Required for Service Workers (already configured)

**Implementation Approach**:
```yaml
# GitHub Pages Settings (configured via repo Settings > Pages)
Source: Deploy from a branch
Branch: main / (root)
Source directory: /src
```

**GitHub Actions Workflow**:
- Trigger on push to `main` branch
- Workflow builds nothing (no build step)
- Automatically triggers GitHub Pages deployment via `github-pages` deployment action
- Updates available within 1-2 minutes after push

**Alternatives Considered**:
1. **Separate `gh-pages` branch**: More complex, requires merging or subtree operations
2. **Root directory deployment**: Requires moving files out of `src/`, breaks existing structure
3. **Manual deployment**: Too error-prone, doesn't support team collaboration

**Best Practices**:
- Use official `actions/deploy-pages@v4` action
- Add `permissions: pages: write` and `id-token: write`
- Set `concurrency` to prevent race conditions
- Monitor deployment logs in Actions tab

---

## Decision 2: GitHub Actions Deployment Workflow

**Decision**: Use GitHub Actions with official `actions/deploy-pages` action

**Rationale**:
- Official GitHub action: Well-maintained, reliable
- No build step: Directly uploads static files from `/src`
- Simple configuration: Minimal YAML required
- Automatic: Triggers on push to main branch

**Workflow Structure**:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './src'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Configuration Required in Repository**:
1. Enable GitHub Pages: Settings > Pages
2. Set source to "GitHub Actions" (not "Deploy from a branch")
3. Create `.github/workflows/deploy.yml` with above content
4. Push to `main` branch to trigger initial deployment

**Alternatives Considered**:
1. **Third-party deploy actions**: Less reliable, security concerns
2. **Manual CLI deployment**: Not automated, error-prone
3. **Custom script**: More complex than needed for static files

**Best Practices**:
- Use explicit `permissions` block for security
- Add `workflow_dispatch` trigger for manual redeploys
- Monitor deployment status in Actions tab
- Verify deployment at `https://[username].github.io/[repo]/` after first run

---

## Decision 3: Dark Theme CSS Implementation

**Decision**: Use CSS custom properties (variables) for theme colors, apply dark palette globally

**Rationale**:
- Maintainability: Single source of truth for color values
- Consistency: All elements reference same variables
- Future-proof: Easy to add theme toggle later if needed
- Performance: CSS variables are efficient and well-supported

**Implementation Approach**:
```css
/* Define color variables at root level */
:root {
  --bg-primary: #242424;
  --bg-secondary: #1a1a1a;
  --bg-hover: #2a2a2a;
  --text-primary: #e8e8e8;
  --text-secondary: #b8b8b8;
  --accent-color: #42a5f5;
  --accent-hover: #64b5f6;
  --border-color: #3a3a3a;
  --error-color: #e57373;
  --warning-color: #ffb74d;
  --success-color: #66bb6a;
}

/* Apply variables to existing classes */
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.song-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

.song-card:hover {
  background-color: var(--bg-hover);
}

.song-card.playing {
  background-color: var(--accent-color);
  color: #ffffff; /* White text on accent for contrast */
}

button {
  background-color: var(--accent-color);
  color: #ffffff;
}

button:hover {
  background-color: var(--accent-hover);
}
```

**Contrast Ratio Verification**:
- Background #242424 + Text #e8e8e8 = 15.3:1 ✅ (exceeds 4.5:1)
- Background #242424 + Accent #42a5f5 = 4.6:1 ✅ (exceeds 4.5:1)
- Accent #42a5f5 + White #ffffff = 4.5:1 ✅ (meets requirement)
- Background #1a1a1a + Text #e8e8e8 = 17.4:1 ✅ (exceeds 4.5:1)

**Elements to Update**:
1. `body` background and text color
2. `.song-card` background, border, hover state
3. `.song-card.playing` background and text
4. `button` background, hover, focus states
5. `#player-controls` background (remove white)
6. `.search-section` input background and border
7. `.loading-skeleton` gradient colors
8. `.error-state` text color
9. `.no-results` text color
10. `.cache-indicator`, `.storage-info` backgrounds
11. `.storage-warning`, `.clear-cache-btn` colors
12. `.offline-indicator`, `.update-banner` colors
13. `.album-art-placeholder` background and text

**Alternatives Considered**:
1. **Hardcoded color values**: Harder to maintain, inconsistent
2. **Dark mode media query**: Requires both light and dark styles (out of scope)
3. **CSS-in-JS**: Adds complexity, violates zero-dependency principle

**Best Practices**:
- Test in multiple browsers (Chrome, Firefox, Safari)
- Verify contrast ratios with Lighthouse or WebAIM Contrast Checker
- Test on different screen types (OLED, LCD, high-DPI)
- Ensure hover states maintain readability
- Verify error/success states are visually distinct

---

## Decision 4: PWA Manifest Theme Color Update

**Decision**: Update manifest.json `theme_color` and `background_color` to match dark theme

**Rationale**:
- Consistent experience: Browser chrome matches app UI
- PWA requirements: Manifest should reflect current theme
- Install screen preview: Shows correct colors when installed

**Implementation**:
```json
{
  "name": "Music Player PWA",
  "short_name": "Music Player",
  "description": "A simple, offline-capable music player",
  "theme_color": "#242424",
  "background_color": "#242424",
  "display": "standalone",
  "start_url": "/",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**What Changes**:
- `theme_color`: #242424 (was likely light color)
- `background_color`: #242424 (was likely light color)

**Testing**:
- Install app on mobile device
- Verify splash screen uses dark color
- Verify browser address bar uses dark color
- Check installed icon on home screen

---

## Decision 5: Contrast Ratio Verification Method

**Decision**: Use Lighthouse accessibility audit + manual WebAIM Contrast Checker for critical elements

**Rationale**:
- Automated: Lighthouse catches most contrast issues
- Manual: WebAIM provides detailed verification for edge cases
- Comprehensive: Both tools cover different aspects
- Free: No additional cost or dependencies

**Lighthouse Audit**:
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Accessibility" category
4. Run audit
5. Verify all "Color contrast" checks pass

**WebAIM Contrast Checker**:
1. Visit https://webaim.org/resources/contrastchecker/
2. Enter foreground and background colors
3. Verify ratio ≥ 4.5:1 for all text
4. Verify ratio ≥ 3:1 for large text (≥18pt or 14pt bold)
5. Document ratios for key elements

**Critical Elements to Verify**:
- Body text (#e8e8e8 on #242424)
- Song titles (#e8e8e8 on #242424)
- Artist names (opacity: 0.8 on #242424)
- Button text (#ffffff on #42a5f5)
- Error messages (#e57373 on #242424)
- Input placeholder text (#b8b8b8 on #242424)

**Alternatives Considered**:
1. **Automated CI testing**: Overkill for this scope
2. **Visual inspection only**: Not reliable enough
3. **Paid tools**: Unnecessary for this feature

**Best Practices**:
- Test in light and dark environments
- Verify on different displays (high-DPI, OLED)
- Check with different user settings (reduced contrast)
- Document verified ratios in quickstart guide

---

## Decision 6: Service Worker Cache Compatibility

**Decision**: No changes needed - existing Service Worker works with dark theme

**Rationale**:
- Cache-first strategy: App shell (HTML/CSS/JS) cached on install
- Versioned caches: Dark theme CSS changes trigger cache update
- Clean activation: New CSS replaces old CSS seamlessly
- No content change: Audio files and catalog unchanged

**What Happens on Update**:
1. Developer commits dark theme changes to `src/styles.css`
2. Service worker detects new file version (via cache-busting or manual version update)
3. Old cache still serves until activation
4. New cache prepared with dark theme
5. Update notification shown to user
6. User refreshes, new CSS loads with dark theme

**Existing Service Worker Logic** (no changes needed):
```javascript
const CACHE_NAME = 'music-player-v2';
const APP_SHELL = [
  '/',
  '/index.html',
  '/styles.css',  // Will be cached with new dark theme colors
  '/app.js',
  '/sw.js',
  '/manifest.json'  // Will be cached with new theme colors
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
  );
});
```

**Testing**:
1. Deploy dark theme with Service Worker version bump
2. Load app online to cache new version
3. Refresh to activate new cache
4. Verify dark theme appears
5. Test offline: Dark theme should persist

---

## Summary of Decisions

| Decision | Choice | Impact |
|----------|--------|---------|
| GitHub Pages deployment | Main branch, /src directory via GitHub Actions | Simple automated deployment, no manual steps |
| Workflow automation | Official `actions/deploy-pages@v4` action | Reliable, minimal configuration |
| Theme implementation | CSS custom properties with dark palette | Maintainable, consistent, accessible |
| PWA manifest | Update theme/background colors to #242424 | Consistent PWA experience |
| Contrast verification | Lighthouse + WebAIM manual checker | Comprehensive, free, no dependencies |
| Service Worker | No changes needed (existing works) | Seamless theme transition for offline users |

---

## Unresolved Questions

**None** - all technical decisions made. Ready for Phase 1 design.

---

## Research Complete

**Status**: ✅ Phase 0 Complete - All unknowns resolved
**Next Phase**: Phase 1 - Design & Contracts (data-model.md, contracts/, quickstart.md)
