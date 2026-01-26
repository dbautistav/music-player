# Quickstart Guide: GitHub Setup and CI/CD

**Feature**: `002-github-setup`
**Date**: 2026-01-26
**Audience**: New Contributors, Maintainers

## Overview

This guide explains how to use the GitHub setup for the PWA music player project, including the `.gitignore`, `.nvmrc`, and GitHub Actions CI/CD workflow.

## Prerequisites

- Git installed
- GitHub account
- Node.js version manager (nvm or equivalent)
- GitHub repository with Actions and Pages enabled

## Setting Up Your Development Environment

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/music-player.git
cd music-player
```

### Step 2: Install the Correct Node.js Version

The project uses Node.js 22 LTS (Jellyfish) as specified in the `.nvmrc` file.

#### Using nvm (Node Version Manager):

```bash
nvm install 22
nvm use 22
```

Or automatically use the version from `.nvmrc`:

```bash
nvm use
```

#### Using other version managers:

- **volta**: `volta install node@22`
- **asdf**: `asdf install nodejs 22.0.0 && asdf local nodejs 22.0.0`

#### Verify Node.js Version:

```bash
node --version
# Should output: v22.x.x
```

### Step 3: Install Dependencies

```bash
npm ci
```

**Why `npm ci` instead of `npm install`?**
- `npm ci` performs a clean install based on `package-lock.json`
- Faster and more reproducible than `npm install`
- Required for CI/CD consistency
- Deletes existing `node_modules` directory first

### Step 4: Verify Setup

Run the following commands to verify your environment:

```bash
# Check Node.js version matches .nvmrc
node --version

# Verify dependencies installed
ls node_modules/

# Check that .gitignore is working (should not show node_modules)
git status
```

**Expected Result**: `node_modules` and `dist` directories should NOT appear in `git status` output.

## Understanding the Configuration Files

### `.gitignore`

This file controls which files and directories are excluded from Git.

**What's Ignored:**
- `node_modules/` - Dependencies
- `dist/` - Build output
- `.vite/` - Vite cache
- `*.log` - Log files
- `.vscode/`, `.idea/` - IDE configurations
- `.DS_Store`, `Thumbs.db` - OS-specific files
- `coverage/` - Test coverage reports

**Why**: Keeps repository size small and avoids committing generated files.

### `.nvmrc`

This file specifies the required Node.js version.

**Content**: `22` (Node.js 22 LTS)

**Why**: Ensures all contributors use the same Node.js version, preventing "works on my machine" issues.

### `.github/workflows/ci-cd.yml`

This is the GitHub Actions workflow that automates CI/CD.

**What It Does**:
1. **Setup**: Installs Node.js 22 and dependencies
2. **Lint**: Runs TypeScript type check and linter
3. **Test**: Runs unit tests and component tests
4. **Build**: Builds production bundle with Vite
5. **Deploy**: Deploys to GitHub Pages (main branch only)

**When It Runs**:
- On every push to `main` branch (full pipeline)
- On every pull request to `main` branch (CI only, no deploy)

## Development Workflow

### 1. Make Changes

Edit code in the `src/` directory.

### 2. Run Tests Locally

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run component tests
npm run test:component

# Run all tests
npm run test:all
```

### 3. Type Check and Lint

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

### 4. Build Locally

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

### 5. Commit and Push

```bash
# Stage changes
git add .

# Commit
git commit -m "Add feature: description"

# Push to feature branch
git push origin feature/my-feature

# Or push to main (triggers CI/CD)
git push origin main
```

## Working with GitHub Actions

### Viewing Workflow Runs

1. Go to your repository on GitHub
2. Click the "Actions" tab
3. Select a workflow run to view details

### Understanding Workflow Status

- **Blue**: In progress
- **Green**: Success
- **Red**: Failure (click to see logs)

### Debugging Failed Runs

1. Click the failed workflow run
2. Click the failed job (e.g., "Lint and Type Check")
3. Expand the step that failed
4. Read the error message in the logs
5. Fix the issue locally
6. Commit and push the fix

### Re-running Workflows

1. Go to the failed workflow run
2. Click "Re-run jobs" → "Re-run all jobs"
3. Or use GitHub CLI: `gh run rerun <run-id>`

## Deployment to GitHub Pages

### Automatic Deployment

Deployment happens automatically when:
- You push to the `main` branch
- All CI checks pass (lint, test, build)

### Manual Deployment (Not Recommended)

If you need to deploy manually (e.g., emergency fix):

1. Go to the Actions tab
2. Find the latest successful workflow run
3. Click the "deploy" job
4. Copy the deployment URL

### Viewing Deployed Application

The deployed application is available at:
```
https://<your-username>.github.io/music-player/
```

If you're using a custom domain, it will be:
```
https://<your-custom-domain>/
```

## Common Issues and Solutions

### Issue: "Node version mismatch"

**Error**: Workflow fails with "Node version not found"

**Solution**:
- Check `.nvmrc` file content
- Ensure the version is a valid Node.js LTS version
- Update to a supported LTS version if needed

### Issue: "Build failed"

**Error**: Build job fails with compilation errors

**Solution**:
- Run `npm run typecheck` locally
- Fix TypeScript errors
- Run `npm run build` locally to reproduce

### Issue: "Tests failed"

**Error**: Test job fails

**Solution**:
- Run `npm test` locally to reproduce
- Fix failing tests
- Ensure tests are deterministic (no flaky tests)

### Issue: "Deployment failed"

**Error**: Deploy job fails

**Solution**:
- Check GitHub Pages settings are enabled
- Verify the `gh-pages` branch exists (if using it)
- Check deployment logs in GitHub Actions
- Verify repository has `pages: write` permission

### Issue: ".gitignore not working"

**Error**: Files that should be ignored appear in `git status`

**Solution**:
- Check that `.gitignore` file exists
- Ensure file patterns are correct
- If files are already tracked, untrack them:
  ```bash
  git rm --cached -r node_modules/
  git commit -m "Remove node_modules from version control"
  ```

## Best Practices

### Before Committing

1. **Run tests**: `npm test`
2. **Type check**: `npm run typecheck`
3. **Lint**: `npm run lint`
4. **Build**: `npm run build`

### Before Pushing

1. **Review changes**: `git diff`
2. **Ensure all tests pass locally**
3. **Check for sensitive data**: Don't commit API keys or secrets

### Commit Messages

Follow conventional commit format:
```
type(scope): description

Examples:
feat(player): add pause button
fix(cache): handle storage quota exceeded
docs(readme): update installation instructions
test(player): add playback unit tests
chore(deps): upgrade vite to 5.0.0
```

### Branch Naming

Use descriptive branch names:
```
feature/your-feature-name
bugfix/issue-description
hotfix/critical-fix
docs/update-documentation
```

### Pull Requests

1. Create pull request from feature branch to `main`
2. Include description of changes
3. Reference any related issues
4. Ensure all CI checks pass
5. Request review from team members

## Performance Tips

### Faster Local Development

- Use `npm run dev` for development with hot module replacement
- Use `npm run preview` to test production build locally
- Keep `node_modules` cached (don't delete and reinstall frequently)

### Faster CI/CD

- Use `npm ci` instead of `npm install` (faster, reproducible)
- GitHub Actions caches `node_modules` automatically
- Avoid running unnecessary steps in CI

### Optimizing Builds

- The CI/CD uses `@vitejs/plugin-react-swc` for fast builds
- Bundle size is automatically checked in CI
- Consider code splitting for large applications

## Additional Resources

- **GitHub Actions Documentation**: https://docs.github.com/en/actions
- **Vite Documentation**: https://vitejs.dev/
- **Node.js Version Managers**:
  - nvm: https://github.com/nvm-sh/nvm
  - volta: https://volta.sh/
  - asdf: https://asdf-vm.com/
- **GitHub Pages Documentation**: https://docs.github.com/en/pages
- **Conventional Commits**: https://www.conventionalcommits.org/

## Getting Help

If you encounter issues:

1. Check this quickstart guide
2. Search existing GitHub issues
3. Ask in the project's discussions
4. Contact maintainers via email or Slack (if applicable)

## Summary

- Use Node.js 22 LTS (from `.nvmrc`)
- Run `npm ci` for clean dependency installation
- Test, type check, and lint before committing
- Push to `main` triggers automatic CI/CD and deployment
- Deployed app is available on GitHub Pages
- Monitor workflow runs in the Actions tab

Happy contributing! 🎉
