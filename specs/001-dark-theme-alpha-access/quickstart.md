# Quickstart: Dark Theme & Alpha Tester Access

**Feature**: Dark Theme & Alpha Tester Access
**Audience**: Developers implementing this feature
**Prerequisites**: GitHub account, basic CSS knowledge

---

## Overview

This quickstart guide provides step-by-step instructions for implementing the dark theme and GitHub Pages deployment for the music player application.

**Time Estimate**: 2-3 hours (including testing)

**What You'll Do**:
1. Update CSS with dark theme colors
2. Update PWA manifest with theme colors
3. Set up GitHub Actions for deployment
4. Configure GitHub Pages
5. Test and verify deployment

---

## Prerequisites

### Tools Required

- **Git**: Installed and configured
  ```bash
  git --version  # Should be 2.x or higher
  ```

- **GitHub Account**: Free account with repository access
  - Repository must be public
  - Write access to repository settings

- **Browser**: For testing
  - Chrome/Edge 90+ or Firefox 88+ or Safari 14+
  - DevTools for Lighthouse audits

- **Text Editor**: VS Code, Sublime Text, or similar

### Knowledge Required

- Basic CSS familiarity
- Git workflow (add, commit, push)
- GitHub repository navigation
- Reading color hex codes

---

## Phase 1: Update CSS with Dark Theme

### Step 1.1: Open styles.css

Navigate to `src/styles.css` in your repository.

### Step 1.2: Add CSS Variables

Add the following at the top of `src/styles.css` (after any existing `*` rules):

```css
:root {
  /* Backgrounds */
  --bg-primary: #242424;
  --bg-secondary: #1a1a1a;
  --bg-hover: #2a2a2a;

  /* Text */
  --text-primary: #e8e8e8;
  --text-secondary: #b8b8b8;

  /* Accents */
  --accent-color: #42a5f5;
  --accent-hover: #64b5f6;

  /* Borders */
  --border-color: #3a3a3a;

  /* Status */
  --error-color: #e57373;
  --warning-color: #ffb74d;
  --success-color: #66bb6a;
}
```

### Step 1.3: Update Body Styles

Find and replace the `body` rule:

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.5;
  color: var(--text-primary);
  background-color: var(--bg-primary);
}
```

**Changes**: Added `var(--text-primary)` and `var(--bg-primary)`

### Step 1.4: Update Header

Find and replace the `header` rule:

```css
header {
  text-align: center;
  padding: 2rem 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 2rem;
}
```

**Change**: Replaced hardcoded border color with `var(--border-color)`

### Step 1.5: Update Song Cards

Find and replace the `.song-card` rule:

```css
.song-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.song-card:hover {
  background-color: var(--bg-hover);
}

.song-card.playing {
  background-color: var(--accent-color);
  color: #ffffff;
}

.song-card.playing.paused {
  background-color: #0d47a1;
  color: #ffffff;
}
```

**Changes**: Replaced hardcoded colors with CSS variables

### Step 1.6: Update Album Art Placeholder

Find and replace the `.album-art-placeholder` rule:

```css
.album-art-placeholder {
  width: 80px;
  height: 80px;
  background: var(--bg-hover);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
  color: var(--text-secondary);
}
```

**Changes**: Updated background and text colors

### Step 1.7: Update Song Info Text

Find the `.song-title` and `.song-artist` rules:

```css
.song-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.song-artist {
  font-size: 0.875rem;
  color: var(--text-secondary);
}
```

**Change**: Added `color: var(--text-secondary)` to `.song-artist`

### Step 1.8: Update Player Controls

Find and replace the `#player-controls` rule:

```css
#player-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 0;
  border-top: 1px solid var(--border-color);
  position: sticky;
  bottom: 0;
  z-index: 100;
  background-color: var(--bg-primary);
}
```

**Changes**: Added border and background colors

### Step 1.9: Update Buttons

Find and replace the `button` rule:

```css
button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  background-color: var(--accent-color);
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 44px;
  min-height: 44px;
}

button:hover {
  background-color: var(--accent-hover);
}

button:active {
  transform: scale(0.98);
}

button:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}
```

**Changes**: Replaced hardcoded colors with CSS variables

### Step 1.10: Update Search Input

Find and replace the `#search-input` rule:

```css
#search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: border-color 0.2s;
}

#search-input:focus {
  outline: none;
  border-color: var(--accent-color);
}
```

**Changes**: Added background, text, and border colors

Add placeholder color (new rule):

```css
#search-input::placeholder {
  color: var(--text-secondary);
}
```

### Step 1.11: Update Clear Button

Find and replace the `.clear-btn` rule:

```css
.clear-btn {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--text-secondary);
  display: none;
  padding: 0.5rem;
}
```

**Change**: Updated text color

### Step 1.12: Update Loading Skeleton

Find and replace the `.skeleton-item` rule:

```css
.skeleton-item {
  height: 80px;
  background: linear-gradient(
    90deg,
    var(--bg-primary) 25%,
    var(--bg-secondary) 50%,
    var(--bg-primary) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}
```

**Changes**: Updated gradient colors

### Step 1.13: Update Error State

Find and replace the `.error-state p` rule:

```css
.error-state p {
  color: var(--error-color);
  margin-bottom: 1rem;
}
```

**Change**: Updated text color

### Step 1.14: Update No Results

Find and replace the `.no-results` rule:

```css
.no-results {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}
```

**Change**: Updated text color

### Step 1.15: Update Offline Indicator

Find and replace the `.offline-indicator` rule:

```css
.offline-indicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--warning-color);
  color: #ffffff;
  text-align: center;
  padding: 0.5rem;
  font-weight: 500;
  z-index: 1000;
}
```

**Change**: Updated background color (already had white text)

### Step 1.16: Update Update Banner

Find and replace the `.update-banner` rule:

```css
.update-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--success-color);
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  z-index: 1000;
}
```

**Change**: Updated background color

### Step 1.17: Update Refresh Button

Find and replace the `.refresh-btn` rule:

```css
.refresh-btn {
  background-color: #ffffff;
  color: var(--success-color);
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  min-width: auto;
  min-height: auto;
}

.refresh-btn:hover {
  background-color: #e8f5e9;
}
```

**Changes**: Updated colors

### Step 1.18: Update Cache Indicator

Find and replace the `.cache-indicator` rule:

```css
.cache-indicator {
  font-size: 1.2rem;
  color: var(--text-secondary);
  opacity: 0.5;
  transition: opacity 0.2s;
}

.cache-indicator.cached {
  opacity: 1;
}
```

**Change**: Updated text color

### Step 1.19: Update Storage Info

Find and replace the `.storage-info` rule:

```css
.storage-info {
  padding: 1rem;
  background-color: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 1rem;
}
```

**Change**: Updated background color

### Step 1.20: Update Storage Bar

Find and replace the `.storage-bar` rule:

```css
.storage-bar {
  height: 8px;
  background-color: var(--bg-hover);
  border-radius: 4px;
  overflow: hidden;
}
```

**Change**: Updated background color

### Step 1.21: Update Storage Used

Find and replace the `.storage-used` rule:

```css
.storage-used {
  height: 100%;
  background-color: var(--accent-color);
  transition: width 0.3s;
}
```

**Change**: Updated background color

### Step 1.22: Update Storage Warning

Find and replace the `.storage-warning` rule:

```css
.storage-warning {
  background-color: var(--warning-color);
  color: #ffffff;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
}
```

**Change**: Updated background color (already had white text)

### Step 1.23: Update Clear Cache Button

Find and replace the `.clear-cache-btn` rule:

```css
.clear-cache-btn {
  background-color: var(--error-color);
}

.clear-cache-btn:hover {
  background-color: #c62828;
}
```

**Changes**: Updated background color

### Step 1.24: Verify CSS Changes

Open `src/styles.css` and verify:

```bash
# Search for hardcoded colors that should be variables
grep -n '#f5f5f5\|#e0e0e0\|#1976d2\|#0d47a1\|#333' src/styles.css
```

**Expected**: No matches (all colors should use CSS variables)

---

## Phase 2: Update PWA Manifest

### Step 2.1: Open manifest.json

Navigate to `src/manifest.json` in your repository.

### Step 2.2: Update Theme Colors

Find and replace the `theme_color` and `background_color` fields:

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

**Changes**: Updated `theme_color` and `background_color` to `#242424`

### Step 2.3: Verify Manifest

Open `src/manifest.json` and verify colors are updated.

---

## Phase 3: Set Up GitHub Actions

### Step 3.1: Create Workflows Directory

Create the directory structure:

```bash
mkdir -p .github/workflows
```

### Step 3.2: Create Deployment Workflow

Create `.github/workflows/deploy.yml` with the following content:

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

### Step 3.3: Verify Workflow

Open `.github/workflows/deploy.yml` and verify YAML syntax is correct.

**Tip**: Use a YAML validator or GitHub's syntax checking

---

## Phase 4: Configure GitHub Pages

### Step 4.1: Navigate to Repository Settings

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Click on "Pages" in the left sidebar

### Step 4.2: Set Source to GitHub Actions

1. Under "Build and deployment", find "Source"
2. Change from "Deploy from a branch" to "GitHub Actions"
3. Save settings

**Note**: This is crucial - the workflow won't trigger without this setting.

### Step 4.3: Verify Settings

Settings should show:
- Source: GitHub Actions
- URL: `https://[username].github.io/[repository-name]/`

---

## Phase 5: Commit and Push

### Step 5.1: Stage Changes

```bash
git add src/styles.css src/manifest.json .github/workflows/deploy.yml
```

### Step 5.2: Commit Changes

```bash
git commit -m "feat: add dark theme and GitHub Pages deployment"
```

### Step 5.3: Push to Main Branch

```bash
git push origin main
```

### Step 5.4: Monitor Deployment

1. Go to your repository on GitHub
2. Click on "Actions" tab
3. Wait for "Deploy to GitHub Pages" workflow to complete
4. Click on workflow run to see logs

**Expected**: Deployment completes in 1-2 minutes

---

## Phase 6: Test Deployment

### Step 6.1: Access Deployed URL

Open your browser and navigate to:
```
https://[username].github.io/[repository-name]/
```

**Example**: `https://johndoe.github.io/music-player/`

### Step 6.2: Verify Dark Theme

**Visual Checks**:
- [ ] Page background is dark (#242424)
- [ ] Text is light (#e8e8e8)
- [ ] Song cards have dark background (#1a1a1a)
- [ ] Buttons are blue (#42a5f5)
- [ ] No white or light backgrounds remain

**Interactive Checks**:
- [ ] Hover states work (buttons darken)
- [ ] Focus states visible (outline appears)
- [ ] Playing state shows blue background
- [ ] Paused state shows darker blue

### Step 6.3: Verify Functionality

**Core Features**:
- [ ] Songs load from catalog
- [ ] Play/pause works
- [ ] Search/filter works
- [ ] Cache management works
- [ ] Offline indicator appears
- [ ] Update banner appears

### Step 6.4: Run Lighthouse Audit

1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Accessibility" category
4. Run audit
5. Verify all "Color contrast" checks pass

**Expected**: All contrast checks pass (4.5:1+ ratios)

### Step 6.5: Test on Mobile

1. Open DevTools (F12)
2. Click on device toolbar (phone icon)
3. Select mobile device (e.g., iPhone 12)
4. Verify dark theme appears
5. Test touch interactions

---

## Phase 7: Verify Contrast Ratios

### Step 7.1: Use WebAIM Contrast Checker

1. Visit https://webaim.org/resources/contrastchecker/
2. Enter foreground color: `e8e8e8` (text)
3. Enter background color: `242424` (background)
4. Verify ratio ≥ 4.5:1

**Expected**: 15.3:1 (passes)

### Step 7.2: Verify Critical Elements

Check these combinations:

| Element | Foreground | Background | Expected Ratio |
|---------|-----------|-------------|---------------|
| Body text | #e8e8e8 | #242424 | 15.3:1 |
| Button text | #ffffff | #42a5f5 | 4.5:1 |
| Error text | #e57373 | #242424 | 5.2:1 |
| Warning text | #ffb74d | #242424 | 7.8:1 |

### Step 7.3: Document Results

Record verified ratios in your test notes or documentation.

---

## Phase 8: Cross-Browser Testing

### Step 8.1: Test in Chrome/Edge

1. Open Chrome or Edge
2. Navigate to deployed URL
3. Verify dark theme appears
4. Test all features

### Step 8.2: Test in Firefox

1. Open Firefox
2. Navigate to deployed URL
3. Verify dark theme appears
4. Test all features

### Step 8.3: Test in Safari

1. Open Safari (macOS or iOS)
2. Navigate to deployed URL
3. Verify dark theme appears
4. Test all features

---

## Troubleshooting

### Issue: Dark theme not appearing

**Cause**: Browser cache serving old CSS

**Solution**:
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache: DevTools > Application > Clear storage
3. Verify deployment succeeded (check Actions tab)
4. Check Service Worker: DevTools > Application > Service Workers

---

### Issue: 404 errors on deployed URL

**Cause**: Incorrect GitHub Pages settings

**Solution**:
1. Verify Source is set to "GitHub Actions" (not "Deploy from a branch")
2. Verify files are in `src/` directory
3. Check repository structure
4. Re-run workflow manually

---

### Issue: Deployment failed in Actions

**Cause**: Workflow error or permission issue

**Solution**:
1. Click on failed workflow run
2. Check error logs
3. Verify workflow YAML syntax
4. Check permissions (pages: write, id-token: write)
5. Verify `src/` directory exists

---

### Issue: Service Worker not updating

**Cause**: Old cache version

**Solution**:
1. Update CACHE_VERSION in `src/sw.js`
2. Clear Service Worker: DevTools > Application > Service Workers > Unregister
3. Reload page to install new Service Worker

---

### Issue: Lighthouse contrast check fails

**Cause**: Incorrect color values

**Solution**:
1. Verify CSS variables are correct
2. Check for hardcoded colors that override variables
3. Verify element specificity (variables applied)
4. Re-run Lighthouse after clearing cache

---

### Issue: GitHub Pages not deploying

**Cause**: Workflow not triggering

**Solution**:
1. Verify Source is set to "GitHub Actions"
2. Verify workflow file is in `.github/workflows/`
3. Check workflow YAML syntax
4. Re-push to main branch

---

## Testing Checklist

Before marking feature complete, verify:

**Visual Checks**:
- [ ] Dark theme loads on all pages
- [ ] No white/light backgrounds remain
- [ ] All text is readable
- [ ] Colors match specification

**Functional Checks**:
- [ ] All buttons work
- [ ] Play/pause works
- [ ] Search/filter works
- [ ] Cache management works
- [ ] Offline mode works

**Accessibility Checks**:
- [ ] Lighthouse accessibility audit passes
- [ ] Contrast ratios ≥ 4.5:1 verified
- [ ] Focus states visible
- [ ] Keyboard navigation works

**Cross-Browser Checks**:
- [ ] Chrome/Edge: Working
- [ ] Firefox: Working
- [ ] Safari: Working
- [ ] Mobile: Working

**Deployment Checks**:
- [ ] URL accessible
- [ ] Deployment successful
- [ ] No 404 errors
- [ ] No deployment failures

---

## Next Steps

After completing this quickstart:

1. **Notify Alpha Testers**: Share deployed URL via email/chat
2. **Gather Feedback**: Collect feedback on dark theme usability
3. **Monitor Deployment**: Watch Actions tab for any issues
4. **Document Learnings**: Note any issues encountered

---

## Resources

- [Theme Contract](./contracts/theme.md) - Detailed theme specification
- [Deployment Contract](./contracts/deployment.md) - GitHub Pages deployment details
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Accessibility audit tool
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - Contrast verification
- [GitHub Pages Documentation](https://docs.github.com/en/pages) - GitHub Pages setup guide

---

## Support

For issues or questions:
- Check [Troubleshooting](#troubleshooting) section above
- Review [Theme Contract](./contracts/theme.md) for detailed specifications
- Review [Deployment Contract](./contracts/deployment.md) for deployment details
- Check GitHub Actions logs for deployment errors

---

**Estimated Time**: 2-3 hours

**Good luck with your implementation!** 🎵
