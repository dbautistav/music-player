# GitHub Pages Deployment Contract

**Feature**: Dark Theme & Alpha Tester Access
**Version**: 1.0
**Date**: 2025-02-01

---

## Overview

This contract defines the deployment interface for the music player application to GitHub Pages, enabling alpha tester access without requiring development tools or local servers.

---

## Deployment Endpoint

### Production URL

```
https://[username].github.io/[repository-name]/
```

**Examples**:
- `https://johndoe.github.io/music-player/`
- `https://janedoe.github.io/music-pwa/`

**Access Requirements**:
- Modern web browser (Chrome/Edge 90+, Firefox 88+, Safari 14+, iOS Safari 14+)
- Internet connection (HTTPS required for Service Workers)
- No authentication required (public repository)
- No client-side setup required

**Response Times** (SLAs):
- Initial deployment after push: 1-2 minutes
- Subsequent deployments (CSS-only): <30 seconds
- File serving: <100ms to serve static files (via CDN)
- Cache hit: <50ms from Cloudflare edge

---

## Deployment Protocol

### Trigger Mechanism

**Primary Trigger**: Git push to `main` branch

```bash
git add src/styles.css src/manifest.json .github/workflows/deploy.yml
git commit -m "feat: add dark theme and GitHub Pages deployment"
git push origin main
```

**Manual Trigger**: GitHub Actions workflow_dispatch

1. Navigate to repository > Actions
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow" button
4. Select branch: `main`
5. Click "Run workflow"

**Automatic Behavior**:
- Workflow runs automatically on every push to `main`
- Concurrency group prevents simultaneous deployments
- Previous in-progress deployments are cancelled

---

### Deployment Process

**Step 1: Checkout**

```yaml
- uses: actions/checkout@v4
```
- Retrieves latest code from repository
- Access to full git history

**Step 2: Setup Pages**

```yaml
- uses: actions/configure-pages@v4
```
- Configures GitHub Pages metadata
- Sets up required environment variables

**Step 3: Upload Artifact**

```yaml
- uses: actions/upload-pages-artifact@v3
  with:
    path: './src'
```
- Uploads `src/` directory contents
- Creates deployment artifact
- Includes: index.html, styles.css, app.js, manifest.json, etc.

**Step 4: Deploy**

```yaml
- uses: actions/deploy-pages@v4
```
- Deploys artifact to GitHub Pages
- Activates new deployment
- Updates CDN (Cloudflare)

---

### Deployment Status Codes

| Status | Meaning | Resolution |
|--------|---------|------------|
| `success` | Deployment completed successfully | Application live at production URL |
| `in_progress` | Deployment currently running | Wait for completion (1-2 minutes) |
| `pending` | Deployment queued | Wait for workflow to start |
| `failure` | Deployment failed | Check Actions logs for errors |
| `cancelled` | Deployment cancelled by user | Re-run workflow manually |

---

## Request/Response Format

### HTTP Request

Alpha tester access:

```http
GET https://[username].github.io/[repository-name]/ HTTP/1.1
Host: [username].github.io
User-Agent: Mozilla/5.0 (Browser identifier)
Accept: text/html,application/xhtml+xml
```

### HTTP Response

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 2883
Last-Modified: [Deployment timestamp]
Cache-Control: max-age=3600, public

<!DOCTYPE html>
<html lang="en">
<head>
  <!-- HTML with dark theme styles -->
</head>
<body>
  <!-- App content with dark theme -->
</body>
</html>
```

### Error Responses

**404 Not Found** (invalid URL):

```http
HTTP/1.1 404 Not Found
Content-Type: text/html
Content-Length: 162

<html>
<head><title>404 Not Found</title></head>
<body>
<center><h1>404 Not Found</h1></center>
<hr><center>nginx</center>
</body>
</html>
```

**503 Service Unavailable** (deployment in progress):

```http
HTTP/1.1 503 Service Unavailable
Retry-After: 60
```

---

## Authentication & Authorization

**No Authentication Required**

- Repository is public
- No user accounts or login
- No API keys or tokens required
- No rate limiting (within GitHub Pages limits)

**Access Control**:
- Read-only access to static files
- No write access or POST endpoints
- Service Worker scope limited to origin
- HTTPS required (enforced by GitHub Pages)

---

## Security Requirements

### HTTPS Enforcement

**Requirement**: HTTPS required for Service Workers

```javascript
// Service Worker installation checks
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  console.error('Service Workers require HTTPS');
  return;
}
```

**GitHub Pages**: Automatically provides HTTPS

### Content Security Policy

**Current CSP** (in index.html):

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self';
               style-src 'self' 'unsafe-inline';
               media-src 'self';">
```

**No Changes Required**: Dark theme uses only self-hosted resources

### Trusted Origins

**Allowed Origins**:
- `https://[username].github.io` (same origin)
- `https://[username].github.io/[repository-name]/` (same origin)

**Blocked Origins**:
- External CDNs (not used)
- Third-party scripts (not used)
- Analytics (not used)

---

## Rate Limiting

### GitHub Pages Limits

**Bandwidth**: 100GB/month (free tier)
- Sufficient for alpha testing (estimated <1GB for 10 testers)
- Includes audio file downloads
- Monitors at: https://github.com/[username]/[repository-name]/settings/pages

**Concurrent Connections**: No strict limit
- Serves via Cloudflare CDN
- Handles 1000+ concurrent connections
- Scales automatically

**GitHub Actions Limits**:
- 2000 free minutes/month (public repository)
- Estimated usage: ~2 minutes per deployment
- Sufficient for frequent updates during development

---

## Monitoring & Observability

### Deployment Logs

**Location**: GitHub Actions tab

**View Logs**:
1. Navigate to repository > Actions
2. Click on "Deploy to GitHub Pages" workflow run
3. View step-by-step logs

**Log Examples**:

```
Checkout: HEAD is now at abc123f
Setup Pages: Configuration complete
Upload artifact: Uploaded artifact successfully (48KB)
Deploy to GitHub Pages: Deployment complete
  URL: https://johndoe.github.io/music-player/
  Duration: 45s
```

### Access Logs

**Not Available**: GitHub Pages does not provide access logs for free tier

**Alternatives**:
- GitHub Insights (repository traffic)
- No individual user tracking (privacy-focused)
- No analytics (out of scope)

---

## Rollback Procedure

### Automatic Rollback (Git Revert)

```bash
# View deployment history
git log --oneline

# Revert to previous commit
git revert HEAD
git push origin main

# Deployment automatically triggered
# Rollback completes in 1-2 minutes
```

### Manual Rollback (Branch Switch)

```bash
# Create rollback branch
git checkout -b rollback-before-dark-theme

# Push to main
git push origin rollback-before-dark-theme:main --force
```

**Warning**: Force push may disrupt other collaborators

### Cache Rollback

If Service Worker caches old version:

1. Clear browser cache (DevTools > Application > Clear storage)
2. Or wait 24 hours for cache expiration
3. Or bump CACHE_VERSION in sw.js to force update

---

## Versioning

### Deployment Versioning

**Version Indicator**: Git commit SHA

```
https://[username].github.io/[repository-name]/
Deployed from commit: abc123f (2025-02-01 14:30:00)
```

**Version Strategy**:
- Each deployment creates new version
- GitHub Actions displays commit SHA
- No semantic versioning for deployments

### Cache Versioning

**Service Worker Cache**:

```javascript
const CACHE_VERSION = 'music-player-v2-dark-theme';
```

**Update Protocol**:
1. Increment version number when CSS changes
2. Old cache invalidated after activation
3. Users prompted to refresh

---

## Testing Protocol

### Pre-Deployment Testing

**Local Testing** (before push):

```bash
# Serve locally to verify changes
cd src
python -m http.server 8000

# Open http://localhost:8000
# Verify dark theme appears
# Verify contrast ratios
# Test all interactive elements
```

**Lighthouse Audit**:

```bash
# Open DevTools > Lighthouse
# Run Accessibility audit
# Verify all color contrast checks pass
```

### Post-Deployment Testing

**Manual Testing** (after deployment):

1. **Access**: Navigate to production URL
2. **Visual**: Verify dark theme loads
3. **Functionality**: Test play/pause, search, caching
4. **Responsiveness**: Test on mobile and desktop
5. **Offline**: Test Service Worker offline functionality

**Automated Testing**:

```bash
# Run Lighthouse CI (if configured)
npm run lighthouse
```

---

## Support & Troubleshooting

### Common Issues

**Issue**: Dark theme not appearing

**Resolution**:
1. Clear browser cache (DevTools > Application > Clear storage)
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Verify deployment succeeded (check Actions tab)
4. Check Service Worker status (DevTools > Application > Service Workers)

**Issue**: 404 errors

**Resolution**:
1. Verify URL is correct
2. Check file structure in repository
3. Ensure files are in `src/` directory
4. Verify GitHub Pages source is set to `/src`

**Issue**: Service Worker not updating

**Resolution**:
1. Update CACHE_VERSION in sw.js
2. Unregister old Service Worker (DevTools > Application > Service Workers)
3. Reload page to install new Service Worker

**Issue**: Deployment failed

**Resolution**:
1. Check Actions logs for error details
2. Verify workflow file syntax (YAML)
3. Check permissions (pages: write, id-token: write)
4. Ensure `src/` directory exists

---

## Contact & Support

**For Alpha Testers**:
- Access URL: Provided via email/chat
- Report issues: Via existing communication channel (no in-app feedback)
- Expected response time: Best-effort (alpha testing phase)

**For Developers**:
- GitHub Issues: https://github.com/[username]/[repository-name]/issues
- Documentation: See quickstart.md in spec directory
- Code review: Required for all changes

---

## Contract Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-02-01 | Initial deployment contract for dark theme feature |

---

## Compliance & Governance

### Compliance

**WCAG 2.1 AA Compliance**:
- Color contrast ratios verified ≥ 4.5:1
- Keyboard navigation maintained
- Screen reader compatibility maintained
- ARIA labels preserved

**PWA Compliance**:
- Manifest theme color updated
- Service Worker scope maintained
- Offline functionality preserved

### Governance

**Change Process**:
- All changes require pull request review
- Deployments tracked via git history
- No direct production edits

**Audit Trail**:
- Git commit history records all changes
- GitHub Actions logs record all deployments
- No direct database modifications (no database)

---

## Appendices

### Appendix A: GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
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

### Appendix B: GitHub Pages Settings

**Settings Location**:
Repository Settings > Pages

**Required Settings**:
- Source: GitHub Actions (not "Deploy from a branch")
- Custom domain: None (uses default github.io)

**Optional Settings**:
- Enforce HTTPS: Enabled (default, cannot be disabled)
- Custom 404: Out of scope
- Jekyll processing: Disabled (no .jekyll-config)

---

**End of Contract**
