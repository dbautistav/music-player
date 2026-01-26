# Quickstart Guide: Minimalist UI/UX Design System

**Feature**: `003-minimalist-ui`
**Date**: 2026-01-26
**Audience**: Designers, Developers

## Overview

This guide explains how to use the minimalist UI/UX design system, including design tokens, component library, theme switching, and accessibility standards. The design system follows modern minimalist principles: purposeful whitespace, deep minimalism, content-first hierarchy, and "invisible" UI.

## Prerequisites

- React 18+ with TypeScript 5.x
- Modern browser (iOS Safari 15+, Chrome/Edge 90+, Firefox 88+, Samsung Internet 15+)
- CSS Custom Properties support (96%+ browser support)
- Variable fonts support (Chrome 102+, Safari 11+, Edge 102+, Firefox 93+)

## Design System Setup

### Step 1: Import Design Tokens

```typescript
// Import design token types and values
import {
  THEMES,
  JAPANDI_PALETTE,
  DIGITAL_SLATE_PALETTE,
  MINIMALIST_DARK_PALETTE,
  TYPOGRAPHY_SCALE,
  SPACING_SCALE,
  SHADOW_SCALE,
  BORDER_RADIUS_SCALE,
} from '@/design-system/tokens/design-tokens';
```

### Step 2: Apply Theme to Document

```typescript
import { getTheme, applyThemeCSSVariables } from '@/design-system/themes/theme-manager';

// Apply theme on app mount
const theme = getTheme();
document.documentElement.setAttribute('data-theme', theme.id);
applyThemeCSSVariables(theme.palette);
```

### Step 3: Wrap App in Theme Provider

```typescript
import { ThemeProvider } from '@/design-system/components/ThemeProvider';

function App() {
  return (
    <ThemeProvider defaultTheme="japandi-light">
      <YourApp />
    </ThemeProvider>
  );
}
```

## Using Design Tokens

### Color Tokens

```typescript
import { CSS_CUSTOM_PROPERTIES } from '@/design-system/tokens/design-tokens';

// Access color token
const backgroundColor = `var(${CSS_CUSTOM_PROPERTIES['--color-background']})`;
const accentColor = `var(${CSS_CUSTOM_PROPERTIES['--color-accent']})`;
const textColor = `var(${CSS_CUSTOM_PROPERTIES['--color-text-primary']})`;
```

**Best Practices**:
- Use semantic roles (`--color-success`, `--color-error`) instead of hard colors
- Reserve accent color for CTAs only (10% usage per 60-30-10 rule)
- Check WCAG contrast ratio before using color combinations

### Typography Tokens

```typescript
import { TYPOGRAPHY_SCALE } from '@/design-system/tokens/design-tokens';
import { CSS_CUSTOM_PROPERTIES } from '@/design-system/tokens/design-tokens';

// Access typography scale
const displaySize = TYPOGRAPHY_SCALE.display; // '2.5rem'
const heading1Size = TYPOGRAPHY_SCALE.heading1; // '2rem'
const bodySize = TYPOGRAPHY_SCALE.body; // '1rem'

// Use in styled components
const Display = styled.h1`
  font-size: ${TYPOGRAPHY_SCALE.display};
  font-weight: 700;
  line-height: 1.2;
`;
```

**Best Practices**:
- Use modular scale (1.25 ratio) for consistent sizing
- Apply appropriate line heights (heading: 1.1-1.3, body: 1.5-1.6, caption: 1.3-1.4)
- Use relative units (`rem`) for accessibility (respects user's font scaling)

### Spacing Tokens

```typescript
import { SPACING_SCALE } from '@/design-system/tokens/design-tokens';
import { CSS_CUSTOM_PROPERTIES } from '@/design-system/tokens/design-tokens';

// Access spacing scale
const comfortablePadding = SPACING_SCALE.comfortable; // '16px'
const generousMargin = SPACING_SCALE.generous; // '20px'
const spaciousGap = SPACING_SCALE.spacious; // '24px'
```

**Best Practices**:
- Use consistent spacing for breathing room (minimalist principle)
- Ensure 8px minimum spacing between touch targets (44px + 8px)
- Use generous whitespace for content hierarchy

### Shadow & Border Radius Tokens

```typescript
import { SHADOW_SCALE, BORDER_RADIUS_SCALE } from '@/design-system/tokens/design-tokens';
import { CSS_CUSTOM_PROPERTIES } from '@/design-system/tokens/design-tokens';

// Access shadow and radius
const defaultShadow = SHADOW_SCALE.default; // '0 2px 4px rgba(0,0,0,0.08)'
const mediumRadius = BORDER_RADIUS_SCALE.medium; // '8px'
```

**Best Practices**:
- Use subtle shadows for depth (deep minimalism)
- Keep radius subtle (4-8px, not fully round)
- Apply `will-change: transform` for GPU acceleration if animating

## Using Component Library

### Button Component

```typescript
import { Button } from '@/design-system/components/atoms/Button';

// Primary button (CTA)
<Button variant="primary" size="medium" onClick={handleClick}>
  Play Song
</Button>

// Secondary button
<Button variant="secondary" size="medium" onClick={handleClick}>
  Cancel
</Button>

// Loading state
<Button variant="primary" loading disabled>
  Loading...
</Button>

// With icon
<Button variant="primary" icon={<PlayIcon />} iconPosition="left">
  Play
</Button>
```

**Props**:
- `variant`: 'primary' | 'secondary' | 'tertiary'
- `size`: 'small' | 'medium' | 'large'
- `state`: 'default' | 'hover' | 'active' | 'pressed' | 'disabled' (auto-managed)
- `loading`: boolean
- `icon`: React.ReactNode
- `iconPosition`: 'left' | 'right'
- `onClick`: () => void
- `href`: string (renders as anchor)
- `testId`: string

### Input Component

```typescript
import { Input } from '@/design-system/components/atoms/Input';

// Basic input
<Input
  type="text"
  placeholder="Enter song name"
  value={songName}
  onValueChange={setSongName}
/>

// With label and validation
<Input
  type="email"
  label="Email Address"
  placeholder="you@example.com"
  value={email}
  onValueChange={setEmail}
  required
  errorMessage={emailError}
/>

// Disabled state
<Input
  type="text"
  label="Username"
  value={username}
  onValueChange={setUsername}
  disabled
/>
```

**Props**:
- `type`: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
- `label`: string
- `placeholder`: string
- `value` | `defaultValue`: string
- `state`: 'default' | 'focus' | 'error' | 'disabled' (auto-managed)
- `size`: 'small' | 'medium' | 'large'
- `icon`: React.ReactNode
- `errorMessage`: string
- `required`: boolean

### Typography Component

```typescript
import { Typography } from '@/design-system/components/atoms/Typography';

// Display heading
<Typography variant="display">
  Your Music Library
</Typography>

// Heading
<Typography variant="heading1">
  Recently Played
</Typography>

// Body text
<Typography variant="body">
  This is your music library with all your favorite songs.
</Typography>

// With custom color
<Typography variant="heading2" color="accent">
  New Playlist
</Typography>
```

**Props**:
- `variant`: 'display' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'heading5' | 'body' | 'bodySmall' | 'caption'
- `weight`: 'light' | 'regular' | 'medium' | 'bold'
- `color`: 'primary' | 'secondary' | 'accent' | 'error' | 'success' | 'warning'
- `align`: 'left' | 'center' | 'right'
- `ellipsis`: boolean
- `lines`: number

### Card Component

```typescript
import { Card } from '@/design-system/components/molecules/Card';

// Default card
<Card padding="comfortable">
  <Typography variant="heading3">Song Title</Typography>
  <Typography variant="body">Artist Name</Typography>
</Card>

// Elevated card (for emphasis)
<Card variant="elevated" padding="generous">
  <Typography variant="heading2">Featured Playlist</Typography>
  <Typography variant="body">Top 10 trending songs</Typography>
</Card>

// Interactive card
<Card interactive onClick={handleCardClick} padding="comfortable">
  <Typography variant="heading3">Album Art</Typography>
  <Typography variant="bodySmall">12 songs</Typography>
</Card>
```

**Props**:
- `variant`: 'default' | 'elevated' | 'bordered'
- `size`: 'small' | 'medium' | 'large'
- `padding`: 'compact' | 'comfortable' | 'generous'
- `interactive`: boolean
- `onClick`: () => void

### FormField Component

```typescript
import { FormField } from '@/design-system/components/molecules/FormField';

// Complete form field with label and validation
<FormField
  type="email"
  label="Email Address"
  placeholder="you@example.com"
  value={email}
  onValueChange={setEmail}
  required
  errorMessage={emailError}
/>
```

**Composition**: Includes label, input, and error message (if provided).

### Navigation Component

```typescript
import { Navigation } from '@/design-system/components/organisms/Navigation';

const navigationItems = [
  { id: 'library', label: 'Library', icon: <LibraryIcon />, href: '/library' },
  { id: 'playlists', label: 'Playlists', icon: <PlaylistIcon />, href: '/playlists' },
  { id: 'search', label: 'Search', icon: <SearchIcon />, href: '/search' },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon />, href: '/settings' },
];

// Bottom navigation (mobile)
<Navigation
  items={navigationItems}
  variant="bottom"
  position="fixed"
/>

// Top navigation (desktop/tablet)
<Navigation
  items={navigationItems}
  variant="top"
  position="sticky"
/>
```

**Props**:
- `items`: NavigationItem[]
- `variant`: 'bottom' | 'top'
- `position`: 'fixed' | 'sticky' | 'static'
- `testId`: string

## Theme Switching

### Using Theme Hook

```typescript
import { useTheme, useThemeActions } from '@/design-system/hooks/useTheme';

function ThemeSettings() {
  const theme = useTheme();
  const { setTheme, resetToSystem } = useThemeActions();

  return (
    <Card padding="generous">
      <Typography variant="heading2">Theme</Typography>

      <Typography variant="body" color="secondary">
        Current theme: {theme.name}
      </Typography>

      <Button
        variant="secondary"
        size="medium"
        onClick={() => setTheme('japandi-light')}
      >
        Japandi Light
      </Button>

      <Button
        variant="secondary"
        size="medium"
        onClick={() => setTheme('digital-slate-light')}
      >
        Digital Slate Light
      </Button>

      <Button
        variant="secondary"
        size="medium"
        onClick={() => setTheme('minimalist-dark')}
      >
        Minimalist Dark
      </Button>

      <Button
        variant="tertiary"
        size="medium"
        onClick={resetToSystem}
      >
        Reset to System Preference
      </Button>
    </Card>
  );
}
```

### Accessing Current Theme

```typescript
import { useTheme } from '@/design-system/hooks/useTheme';

function MyComponent() {
  const theme = useTheme();

  return (
    <Card>
      <Typography variant="heading3">
        Theme: {theme.name}
      </Typography>
      <Typography variant="bodySmall" color="secondary">
        Type: {theme.type}
      </Typography>
    </Card>
  );
}
```

## Accessibility Best Practices

### Keyboard Navigation

All interactive elements must be keyboard navigable:

```typescript
// Button component handles Tab key automatically
<Button onClick={handleClick}>Click Me</Button>

// Use semantic HTML for forms
<FormField
  label="Email"
  type="email"
  value={email}
  onValueChange={setEmail}
/>
```

### Focus Indicators

Components automatically provide clear focus indicators (accent border, outline):

```typescript
// Input component shows accent border on focus
<FormField
  type="text"
  label="Username"
  state="focus" // Auto-managed, but can be set for testing
/>
```

### Screen Reader Support

Use semantic HTML and ARIA labels:

```typescript
// Button with icon only
<Button
  icon={<PlayIcon />}
  aria-label="Play song"
  onClick={handlePlay}
/>

// Navigation with active state
const items = [
  { id: 'library', label: 'Library', active: true },
];
```

### Touch Targets

Ensure 44px minimum touch targets:

```typescript
// Button size="medium" or "large" ensures 44px minimum
<Button size="medium">Click Me</Button> // 40px height + 16px padding = 72px height
```

## Responsive Design

### Mobile-First Approach

Write base CSS for mobile (<768px), then use media queries for larger screens:

```css
/* Base styles (mobile) */
.container {
  padding: 16px; /* SPACING_SCALE.comfortable */
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container {
    padding: 24px; /* SPACING_SCALE.generous */
    max-width: 1024px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container {
    padding: 32px; /* SPACING_SCALE.expansive */
    max-width: 1200px;
  }
}
```

### Breakpoints

| Breakpoint | Description | Component Behavior |
|------------|-------------|-------------------|
| Mobile (<768px) | Single column, simplified layouts | Use smaller padding, hide non-essential |
| Tablet (768-1024px) | Multi-column where appropriate | Adjust spacing for larger screens |
| Desktop (>1024px) | Full layout, horizontal space | Use generous spacing, show all elements |

## Performance Tips

### Efficient Rendering

- Use CSS custom properties for theme switching (no recompilation)
- Avoid inline styles (use styled-components or CSS modules)
- Use `will-change: transform` for animations (GPU acceleration)
- Animate only `transform` and `opacity` (not width, height)

### Bundle Optimization

- Code split components (lazy load where appropriate)
- Tree shake unused design tokens
- Use variable fonts (single file, smaller download size)

### Smooth Animations

- Keep animations <300ms (micro-interactions)
- Use natural easing (ease-in, ease-out, ease-in-out)
- Respect `prefers-reduced-motion` media query

## Common Issues and Solutions

### Issue: "Theme not applying"

**Solution**: Ensure ThemeProvider wraps your app and theme is applied on mount:

```typescript
function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Issue: "Design tokens returning undefined"

**Solution**: Ensure theme is loaded before using tokens:

```typescript
const theme = useTheme();
const backgroundColor = `var(${CSS_CUSTOM_PROPERTIES['--color-background']})`;
```

### Issue: "Accessibility tests failing"

**Solution**:
- Check contrast ratios (use `axe-core` to validate)
- Ensure keyboard navigability (Tab through all interactive elements)
- Test with screen reader (VoiceOver, NVDA)
- Add ARIA labels where needed

### Issue: "Animations too slow/janky"

**Solution**:
- Check if element is animating (use `will-change: transform`)
- Reduce animation duration (<300ms for micro-interactions)
- Test with browser DevTools Performance tab (maintain 60fps)

## Best Practices

### Design Token Usage

- Use semantic roles (`--color-success`, not `#5A7D5A`)
- Reserve accent color for CTAs only (10% usage per 60-30-10 rule)
- Check WCAG contrast ratio before using color combinations
- Use relative units (`rem`) for accessibility

### Component Usage

- Prefer composition over custom implementations
- Use component library atoms/molecules/organisms
- Maintain consistent spacing (use spacing scale)
- Apply state variants consistently (hover, focus, disabled, error)

### Theme Implementation

- Wrap app in ThemeProvider
- Use `useTheme()` hook to access current theme
- Use `useThemeActions()` hook to change themes
- Respect `prefers-color-scheme` media query (system preference)
- Store user's manual preference in localStorage

### Accessibility

- Test with keyboard only (no mouse)
- Test with screen reader (VoiceOver, NVDA, JAWS)
- Use semantic HTML (`button`, `nav`, `h1`-`h6`)
- Provide ARIA labels where not obvious from text
- Ensure 4.5:1 minimum contrast ratio

### Performance

- Keep animations <300ms (micro-interactions)
- Use CSS transitions (GPU-accelerated)
- Test with browser DevTools Performance tab (maintain 60fps)
- Optimize bundle size (use variable fonts, code splitting)

## Additional Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Variable Fonts Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Fonts/Variable_Fonts_Guide)
- [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse/)

## Getting Help

If you encounter issues:

1. Check this quickstart guide
2. Search existing GitHub issues
3. Ask in the project's discussions
4. Contact maintainers via email or Slack (if applicable)

## Summary

- Use CSS custom properties for design tokens
- Wrap app in ThemeProvider for theme switching
- Use component library for consistent UI
- Follow accessibility best practices (WCAG 2.1 AA)
- Maintain 60-30-10 color distribution rule
- Keep animations <300ms (micro-interactions)
- Ensure 44px minimum touch targets (mobile)
- Test on real devices and screen readers

Happy designing and developing! 🎨
