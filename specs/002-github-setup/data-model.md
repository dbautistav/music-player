# Data Model: GitHub Setup and CI/CD

**Feature**: `002-github-setup`
**Date**: 2026-01-26

## Overview

This feature is infrastructure-focused and does not involve traditional data models (databases, entities with relationships). Instead, it defines configuration files and CI/CD pipeline structures that govern the development and deployment workflow.

## Configuration Entities

### Entity 1: .gitignore File

**Description**: Git ignore rules that control which files and directories are excluded from version control.

**Structure**: Text file with glob patterns, one per line.

**Key Rules**:
- `node_modules/` - Excludes Node.js dependency directory
- `dist/` - Excludes Vite build output
- `.vite/` - Excludes Vite cache directory
- `*.log` - Excludes log files
- `.vscode/`, `.idea/` - Excludes IDE configuration
- `.DS_Store`, `Thumbs.db` - Excludes OS-specific files
- `coverage/` - Excludes test coverage reports
- `playwright-report/`, `test-results/` - Excludes E2E test artifacts

**Validation**: No runtime validation. Git automatically applies rules.

**Lifecycle**: Static file created once, updated as needed when new artifacts should be ignored.

---

### Entity 2: .nvmrc File

**Description**: Node.js version manager configuration specifying the required Node.js version for the project.

**Structure**: Single-line text file containing Node.js version number.

**Content**: `22` (Node.js 22 LTS - Jellyfish)

**Validation**: 
- Version must be a valid Node.js version (semver format)
- Should correspond to an LTS version for production stability
- Must be available on GitHub Actions runners

**Lifecycle**: Updated only when upgrading Node.js LTS version (typically annually).

---

### Entity 3: GitHub Actions Workflow

**Description**: CI/CD pipeline definition for GitHub Actions that automates build, test, and deployment processes.

**Structure**: YAML file located at `.github/workflows/ci-cd.yml`

**Key Components**:

**Triggers**:
- `push` to `main` branch
- `pull_request` to `main` branch (for validation)

**Jobs**:

1. **Install**: Setup Node.js, cache dependencies, install packages
2. **Lint**: Run TypeScript compiler and linter
3. **Test**: Run unit tests (Vitest) and component tests (React Testing Library)
4. **Build**: Build production bundle using Vite with swc plugin
5. **Deploy**: Deploy to GitHub Pages (only on main branch, only after successful build)

**Environment Variables**:
- `NODE_VERSION`: Read from `.nvmrc` (22)
- `BASE_PATH`: Automatically detected from repository context

**Artifacts**:
- `dist/` directory (build output)
- Test reports (coverage, E2E results)

**Caching Strategy**:
- `node_modules` cache key: `node-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}`
- Vite build cache (if applicable)

**Validation**:
- YAML must be valid
- Job dependencies must form a DAG (Directed Acyclic Graph)
- All required actions must exist and be accessible

**Lifecycle**: Updated when CI/CD process changes (e.g., new test types, deployment targets).

---

## Workflow State Machine

### GitHub Actions Workflow States

```
[Triggered]
    ↓
[Install Dependencies] → (failure) → [Failed]
    ↓ (success)
[Lint & Type Check] → (failure) → [Failed]
    ↓ (success)
[Run Tests] → (failure) → [Failed]
    ↓ (success)
[Build Production Bundle] → (failure) → [Failed]
    ↓ (success)
[Deploy to GitHub Pages] (main branch only)
    ↓ (success)
[Success]
    ↓
[Deployed on GitHub Pages]
```

**States**:
- **Triggered**: Workflow started by push/PR
- **Install Dependencies**: Setting up Node.js, caching, installing packages
- **Lint & Type Check**: Running `npm run lint` and `npm run typecheck`
- **Run Tests**: Running `npm test` (Vitest) and component tests
- **Build Production Bundle**: Running `npm run build`
- **Deploy to GitHub Pages**: Deploying `dist/` directory
- **Success**: All jobs completed successfully
- **Failed**: One or more jobs failed (with failure reason)
- **Deployed on GitHub Pages**: Application is live on GitHub Pages

**Transitions**:
- Any job failure → Failed state (workflow stops)
- All jobs success → Deploy to GitHub Pages (if main branch) or Success (if PR)
- Deploy success → Deployed on GitHub Pages state

**Error Handling**:
- Fail-fast: Stop workflow on first job failure
- Preserve last deployment: Deploy job only runs if build succeeds
- Failure notifications: GitHub Actions sends notifications on failure

---

## GitHub Pages Deployment State

### Deployment States

1. **Pending**: Deployment in progress
2. **Success**: Application is live and accessible
3. **Failed**: Deployment failed (last successful version remains live)

**Recovery**:
- On deployment failure, the last successful version remains live
- Fix the issue and push new commit to trigger new deployment
- GitHub Pages maintains a history of deployments

---

## Relationships

```
.gitignore ──┐
             ├── GitHub Actions Workflow (uses these files)
.nvmrc ──────┘

GitHub Actions Workflow ──→ GitHub Pages (deploys to)
```

**Explanation**:
- `.gitignore` and `.nvmrc` are configuration files used by the GitHub Actions workflow
- GitHub Actions workflow reads `.nvmrc` to determine Node.js version
- GitHub Actions workflow builds the application and deploys it to GitHub Pages
- GitHub Pages serves the built application

---

## Constraints

### Platform Constraints
- GitHub Actions runners: Ubuntu (latest) with Node.js pre-installed
- GitHub Pages: Static site hosting with HTTPS
- Node.js 22 LTS minimum requirement

### Performance Constraints
- Build time < 5 minutes (SC-003, SC-006)
- Deployment available within 2 minutes of workflow completion (SC-004)
- 95% of builds must meet time targets (SC-006)

### Security Constraints
- Deploy only from `main` branch (prevent unauthorized deployments)
- No secrets in repository (use GitHub Secrets if needed)
- Validate `.nvmrc` version to prevent injection

### Reliability Constraints
- Preserve last successful deployment on failure (FR-010, SC-005)
- Clear error messages on failure (FR-006)
- Workflow must be idempotent (re-running same commit should produce same result)

---

## No Data Persistence

This feature does not require data persistence. All configuration is stored in version control (`.gitignore`, `.nvmrc`, workflow YAML files). GitHub Pages stores the deployed static files, but this is managed by GitHub's infrastructure, not by the application.

---

## Summary

| Entity | Type | Storage | Purpose |
|--------|------|---------|---------|
| `.gitignore` | Configuration File | Git repository | Exclude files from version control |
| `.nvmrc` | Configuration File | Git repository | Specify Node.js version |
| GitHub Actions Workflow | CI/CD Pipeline | Git repository (.github/workflows/) | Automate build, test, deploy |
| GitHub Pages Site | Static Files | GitHub Pages hosting | Serve built application |

**Note**: No traditional database or data model is required for this infrastructure feature. The "data" consists of configuration files and build artifacts managed by Git and GitHub services.
