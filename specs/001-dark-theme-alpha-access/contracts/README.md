# Contracts: Dark Theme & Alpha Tester Access

This directory contains the implementation contracts for the dark theme and alpha tester access feature.

## Contracts

| Contract | Description |
|----------|-------------|
| [deployment.md](./deployment.md) | GitHub Pages deployment specification and SLAs |
| [theme.md](./theme.md) | Dark theme color palette, contrast ratios, and accessibility requirements |

## Contract Purpose

These contracts define:
- **Behavioral expectations**: How deployment and theme should behave
- **Technical specifications**: Color values, URLs, protocols
- **Testing requirements**: Contrast ratios, accessibility checks
- **Deployment protocols**: GitHub Actions workflow, rollout procedures

## Usage

For implementers:
1. Review deployment.md for GitHub Pages setup instructions
2. Review theme.md for color palette and CSS variables
3. Implement according to specifications
4. Verify all testing checklists pass

For testers:
1. Verify deployment URL is accessible
2. Verify dark theme loads with correct colors
3. Verify contrast ratios meet WCAG 2.1 AA
4. Report issues via existing communication channel

## Version History

- **1.0** (2025-02-01): Initial contracts for dark theme and GitHub Pages deployment
