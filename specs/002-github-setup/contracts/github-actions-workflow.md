# GitHub Actions CI/CD Workflow Contract

**Feature**: `002-github-setup`
**Date**: 2026-01-26
**Version**: 1.0.0

## Overview

This contract defines the GitHub Actions workflow for continuous integration and deployment of the PWA music player application. The workflow automates linting, testing, building, and deployment processes.

## Workflow Specification

### Name
`CI/CD Pipeline - Build, Test, and Deploy`

### File Location
`.github/workflows/ci-cd.yml`

### Triggers

| Event | Condition | Behavior |
|-------|-----------|----------|
| `push` | `branches: [main]` | Full CI/CD pipeline (lint, test, build, deploy) |
| `pull_request` | `branches: [main]` | CI pipeline only (lint, test, build, no deploy) |

**Cancel in-progress runs**: Yes (only for same workflow, branch, and event type)

### Permissions

```yaml
permissions:
  contents: read      # Read repository contents
  pages: write        # Deploy to GitHub Pages
  id-token: write     # OIDC token for deployment
```

### Jobs

#### Job 1: Setup & Install

**Name**: `setup`

**Runs-on**: `ubuntu-latest`

**Steps**:
1. Checkout repository (actions/checkout@v4)
2. Setup Node.js 22 LTS (actions/setup-node@v4)
   - Read version from `.nvmrc` file
3. Cache dependencies (actions/cache@v4)
   - Cache key: `node-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}`
   - Restore cache if key exists
   - Cache path: `node_modules/`
4. Install dependencies
   - Run: `npm ci` (clean install for reproducibility)

**Outputs**:
- `node-version`: Node.js version used

**Status**: Must succeed before next job

---

#### Job 2: Lint & Type Check

**Name**: `lint`

**Runs-on**: `ubuntu-latest`

**Needs**: `setup`

**Steps**:
1. Checkout repository (actions/checkout@v4)
2. Restore node_modules cache
3. Restore setup job node-version
4. Run type check: `npm run typecheck`
5. Run linter: `npm run lint`

**Validation**:
- TypeScript compiler must report no errors
- Linter must report no errors or warnings (configurable)

**Status**: Must succeed before next job

---

#### Job 3: Test

**Name**: `test`

**Runs-on**: `ubuntu-latest`

**Needs**: `setup`

**Steps**:
1. Checkout repository (actions/checkout@v4)
2. Restore node_modules cache
3. Restore setup job node-version
4. Run unit tests: `npm test` (Vitest)
   - Run with coverage: `--coverage`
   - Upload coverage report (codecov or GitHub Actions artifact)
5. Run component tests: `npm run test:component` (React Testing Library)

**Validation**:
- All unit tests must pass
- All component tests must pass
- Coverage threshold: 80% minimum (configurable)

**Artifacts**:
- Test coverage report (HTML + LCOV)
- Test results XML (for GitHub Actions UI)

**Status**: Must succeed before next job

---

#### Job 4: Build

**Name**: `build`

**Runs-on**: `ubuntu-latest`

**Needs**: `setup`

**Steps**:
1. Checkout repository (actions/checkout@v4)
2. Restore node_modules cache
3. Restore setup job node-version
4. Build production bundle: `npm run build`
   - Uses Vite with @vitejs/plugin-react-swc
   - Outputs to `dist/` directory
5. Upload build artifact (for deployment job)
   - Artifact name: `dist`
   - Artifact path: `dist/`

**Validation**:
- Build must complete without errors
- Output `dist/` directory must exist
- Bundle size must be < 50MB (gzipped)

**Artifacts**:
- `dist/` directory (production build)

**Status**: Must succeed before next job

---

#### Job 5: Deploy

**Name**: `deploy`

**Runs-on**: `ubuntu-latest`

**Needs**: `build`, `test`

**Conditions**:
- `github.event_name == 'push' && github.ref == 'refs/heads/main'`
- Only runs on main branch pushes (not on PRs)

**Environment**: `github-pages`

**Steps**:
1. Download build artifact from `build` job
2. Deploy to GitHub Pages: `peaceiris/actions-gh-pages@v3`
   - Source directory: `dist/`
   - Destination branch: `gh-pages` (or use default branch if configured)
   - Force overwrite: Yes (replaces previous deployment)

**Validation**:
- Deployment must complete without errors
- GitHub Pages status must show "Active"

**Post-Deployment**:
- Wait up to 2 minutes for GitHub Pages to propagate
- Verify deployment (optional: curl or health check)

**Status**: Final job (no downstream jobs)

---

## Environment Variables

| Variable | Source | Purpose |
|----------|--------|---------|
| `NODE_VERSION` | `.nvmrc` file | Node.js version to install |
| `CI` | GitHub Actions | Set to `true` by GitHub Actions |
| `BASE_PATH` | Repository context | Base path for Vite build (if subdirectory) |

## Secrets

No secrets required for basic deployment. If needed in future:

| Secret | Purpose | Required |
|--------|---------|----------|
| `NPM_TOKEN` | For private npm packages | Optional |
| `CODECOV_TOKEN` | For coverage reports | Optional |

## Caching Strategy

### node_modules Cache
- **Key**: `node-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}`
- **Path**: `node_modules/`
- **Restore**: Always attempt restore on job start
- **Save**: Only on successful dependency installation
- **Fallback**: If cache miss, run `npm ci` and save new cache

### Build Cache (Future Enhancement)
- **Key**: `vite-${{ runner.os }}-${{ hashFiles('src/**', 'public/**', 'vite.config.ts') }}`
- **Path**: `node_modules/.vite/`
- **Benefit**: Faster incremental builds

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Total workflow time | < 5 minutes | GitHub Actions duration |
| Install time | < 1 minute | Setup job duration |
| Lint + Type check | < 1 minute | Lint job duration |
| Test time | < 2 minutes | Test job duration |
| Build time | < 1 minute | Build job duration |
| Deployment time | < 1 minute | Deploy job duration |

## Error Handling

### On Job Failure
- Stop workflow immediately (fail-fast)
- Mark workflow as failed in GitHub Actions UI
- Send notification to repository owner
- Do not deploy if any job fails

### On Deployment Failure
- Preserve last successful deployment on GitHub Pages
- Log detailed error message from `peaceiris/actions-gh-pages`
- Retry automatically (up to 2 retries) with exponential backoff
- Send notification on final failure

### On Node.js Version Mismatch
- Check if `.nvmrc` version exists
- If version not available, fail workflow with clear error
- Recommend updating `.nvmrc` to available LTS version

## Notifications

### Success
- No notification (to reduce noise)

### Failure
- Email to repository owner
- GitHub Actions status badge update
- Pull request checks failed (if triggered by PR)

## Security Considerations

- Read-only access to repository contents by default
- Write access to GitHub Pages only (via `pages: write` permission)
- Use OIDC tokens (no long-lived credentials)
- No secrets in workflow YAML (use GitHub Secrets if needed)
- Validate `.nvmrc` content before setting Node.js version
- Run on GitHub-hosted runners (no self-hosted runner risks)

## Compliance with Constitution

| Constitutional Requirement | Implementation |
|---------------------------|----------------|
| Test-Driven Development | Workflow enforces tests before merge |
| Type Safety | TypeScript type check required |
| Performance Standards | Build time targets enforced |
| PWA Standards | Deploy to GitHub Pages with HTTPS |
| Observability | Build logs and test reports available |

## Maintenance

### Updating Node.js Version
1. Update `.nvmrc` file with new LTS version
2. Commit and push to main branch
3. Workflow automatically uses new version
4. Verify all tests pass with new version

### Adding New Test Types
1. Add test script to `package.json`
2. Add new job to workflow or extend `test` job
3. Ensure proper job dependencies
4. Test workflow on feature branch before merging

### Changing Deployment Target
1. Update `deploy` job configuration
2. Update GitHub Pages settings in repository
3. Update BASE_PATH in `vite.config.ts` if needed
4. Test on feature branch

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-26 | Initial contract definition |

## References

- GitHub Actions Documentation: https://docs.github.com/en/actions
- Vite Documentation: https://vitejs.dev/
- GitHub Pages Documentation: https://docs.github.com/en/pages
- Node.js LTS Schedule: https://github.com/nodejs/release
