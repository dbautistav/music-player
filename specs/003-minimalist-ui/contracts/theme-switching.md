# Theme Switching Contract

**Feature**: `003-minimalist-ui`
**Date**: 2026-01-26
**Version**: 1.0.0

## Overview

This contract defines the API for theme switching between light and dark modes with modern dark mode 2.0 (desaturated colors, subtle grey tones, not simple inversion). Theme switching supports system preference detection, manual selection, and seamless transitions.

## Theme Types

```typescript
export type ThemeId =
  | 'japandi-light'
  | 'digital-slate-light'
  | 'minimalist-dark';

export type ThemeType = 'light' | 'dark';

export interface Theme {
  id: ThemeId;
  name: string;
  type: ThemeType;
  palette: ColorPalette;
}
```

## Theme Definitions

### Japandi Light Mode

**ID**: `japandi-light`
**Type**: Light
**Name**: Japandi Light
**Palette**: Japandi Palette (Warm & Inviting)
- Background: #FAFAFA (Off-White)
- Surface: #FFFFFF (White)
- Text Primary: #333333 (Charcoal)
- Text Secondary: #666666 (Grey)
- Border: #D1C7B7 (Warm Grey/Beige)
- Accent: #6B7E66 (Sage Green)
- Success: #5A7D5A (Olive Green)
- Warning: #FF9F1C (Warm Orange)
- Error: #EF4444 (Red)

**Use Case**: High-end brands, portfolios, lifestyle applications

---

### Digital Slate Light Mode

**ID**: `digital-slate-light`
**Type**: Light
**Name**: Digital Slate Light
**Palette**: Digital Slate Palette (Modern & Professional)
- Background: #F4F7F9 (Cool Light Grey)
- Surface: #FFFFFF (White)
- Text Primary: #1A202C (Dark Navy Slate)
- Text Secondary: #4A5568 (Slate Grey)
- Border: #CBD5E0 (Light Slate)
- Accent: #3182CE (Accessible Blue)
- Success: #5A7D5A (Olive Green)
- Warning: #DD6B20 (Orange)
- Error: #E53E3E (Red)

**Use Case**: SaaS, tech, financial applications

---

### Minimalist Dark Mode

**ID**: `minimalist-dark`
**Type**: Dark
**Name**: Minimalist Dark
**Palette**: Minimalist Dark Palette (Elegant & Dramatic)
- Background: #121212 (True Dark)
- Surface: #1E1E1E (Dark Grey)
- Text Primary: #E0E0E0 (Light Gray/White)
- Text Secondary: #B0B0B0 (Medium Grey)
- Border: #424242 (Medium Grey)
- Accent: #BB86FC (Soft Purple)
- Success: #5A7D5A (Olive Green)
- Warning: #FFC107 (Amber)
- Error: #CF6679 (Red)
- Info: #03DAC6 (Teal)

**Use Case**: Creative portfolios, luxury brands, nighttime usage

## Theme Switching API

### Get Current Theme

```typescript
function getTheme(): Theme {
  // 1. Check localStorage for stored preference
  const storedTheme = localStorage.getItem('user-theme-preference');
  if (storedTheme) {
    return THEMES.find(theme => theme.id === storedTheme) || THEMES[0];
  }

  // 2. Fall back to system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return THEMES.find(theme => theme.type === 'dark') || THEMES[2];
  }

  // 3. Fall back to default theme (Japandi Light)
  return THEMES[0];
}
```

**Returns**: Current theme object
**Priority**: localStorage > system preference > default

---

### Set Theme

```typescript
function setTheme(themeId: ThemeId): void {
  // 1. Validate theme ID
  const theme = THEMES.find(t => t.id === themeId);
  if (!theme) {
    throw new Error(`Theme not found: ${themeId}`);
  }

  // 2. Store in localStorage
  localStorage.setItem('user-theme-preference', themeId);

  // 3. Apply theme to document
  document.documentElement.setAttribute('data-theme', themeId);

  // 4. Update CSS custom properties
  applyThemeCSSVariables(theme.palette);

  // 5. Dispatch event for components to react
  window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
}
```

**Parameters**:
- `themeId`: Theme ID to apply

**Behavior**:
1. Validates theme ID
2. Stores preference in localStorage
3. Applies theme to document (`data-theme` attribute)
4. Updates CSS custom properties (colors, typography, etc.)
5. Dispatches `themechange` event for React components

---

### Reset to System Preference

```typescript
function resetToSystemPreference(): void {
  // 1. Remove stored preference
  localStorage.removeItem('user-theme-preference');

  // 2. Detect system preference
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const systemTheme = systemPrefersDark
    ? THEMES.find(theme => theme.type === 'dark')
    : THEMES.find(theme => theme.type === 'light');

  // 3. Apply system theme
  const theme = systemTheme || THEMES[0];
  document.documentElement.setAttribute('data-theme', theme.id);
  applyThemeCSSVariables(theme.palette);

  // 4. Dispatch event
  window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
}
```

**Behavior**:
1. Removes manual override
2. Detects system preference
3. Applies appropriate system theme
4. Updates CSS custom properties
5. Dispatches `themechange` event

---

### Theme Subscription Hook

```typescript
function useTheme(): Theme {
  const [theme, setThemeState] = useState<Theme>(getTheme());

  useEffect(() => {
    // Listen for theme change events
    const handleThemeChange = (event: CustomEvent) => {
      const newTheme = (event as CustomEventInit<Theme>).detail;
      setThemeState(newTheme);
    };

    window.addEventListener('themechange', handleThemeChange);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (event: MediaQueryListEvent) => {
      // Only if no manual preference set
      if (!localStorage.getItem('user-theme-preference')) {
        const systemPrefersDark = event.matches;
        const systemTheme = systemPrefersDark
          ? THEMES.find(theme => theme.type === 'dark')
          : THEMES.find(theme => theme.type === 'light');
        const theme = systemTheme || THEMES[0];
        setThemeState(theme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);

    return () => {
      window.removeEventListener('themechange', handleThemeChange);
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, []);

  return theme;
}
```

**Returns**: Current theme object
**Behavior**:
- Initial theme from localStorage, system preference, or default
- Re-renders on theme change events
- Listens for system preference changes (if no manual override)
- Cleans up event listeners on unmount

---

## CSS Custom Properties

### Color Properties

```css
[data-theme="japandi-light"] {
  --color-background: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-text-primary: #333333;
  --color-text-secondary: #666666;
  --color-border: #D1C7B7;
  --color-accent: #6B7E66;
  --color-success: #5A7D5A;
  --color-warning: #FF9F1C;
  --color-error: #EF4444;
}

[data-theme="digital-slate-light"] {
  --color-background: #F4F7F9;
  --color-surface: #FFFFFF;
  --color-text-primary: #1A202C;
  --color-text-secondary: #4A5568;
  --color-border: #CBD5E0;
  --color-accent: #3182CE;
  --color-success: #5A7D5A;
  --color-warning: #DD6B20;
  --color-error: #E53E3E;
}

[data-theme="minimalist-dark"] {
  --color-background: #121212;
  --color-surface: #1E1E1E;
  --color-text-primary: #E0E0E0;
  --color-text-secondary: #B0B0B0;
  --color-border: #424242;
  --color-accent: #BB86FC;
  --color-success: #5A7D5A;
  --color-warning: #FFC107;
  --color-error: #CF6679;
  --color-info: #03DAC6;
}
```

### Transition Properties

```css
html {
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}
```

**Duration**: 300ms
**Easing**: ease-in-out (natural feel)
**Note**: Only transition background and color properties (preserves scroll position, form data)

---

## Theme State Machine

```
[Initial Load]
    ↓
[Check localStorage]
    ├─→ (found) → Apply Stored Theme
    └─→ (not found) → Check System Preference
            ├─→ (light) → Apply Japandi Light Mode
            └─→ (dark) → Apply Minimalist Dark Mode
                ↓
[Apply Theme via CSS Custom Properties]
    ↓
[Theme Active]
    ↓
[User Manually Selects Theme]
    ↓
[Update localStorage]
    ↓
[Apply New Theme]
    ↓
[Theme Active]
```

**States**:
- **Initial Load**: First app load, determining initial theme
- **System Light**: User's system preference is light mode
- **System Dark**: User's system preference is dark mode
- **Custom Light**: User manually selected light theme
- **Custom Dark**: User manually selected dark theme

**Transitions**:
- System preference → Custom preference: User manual override
- Custom preference → Reset to system: Remove manual override
- Theme A → Theme B: Smooth transition (300ms) with natural easing

---

## User Preferences Storage

### localStorage Key

**Key**: `user-theme-preference`
**Value**: Theme ID (string)
**Example Values**:
- `japandi-light`
- `digital-slate-light`
- `minimalist-dark`

**Lifecycle**:
- **Created**: When user manually selects theme
- **Read**: On every app load (if not reset to system)
- **Updated**: When user changes theme
- **Deleted**: When user resets to system preference

### Fallback Strategy

1. **Check localStorage**: If stored preference exists, use it
2. **Check system preference**: If no localStorage, use `prefers-color-scheme` media query
3. **Default theme**: If both fail, use Japandi Light Mode (default)

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance

- **Contrast Ratio**: All themes must meet 4.5:1 minimum contrast ratio
- **Color Independence**: Information not conveyed by color alone (use icons, text, patterns)
- **Focus Indicators**: Clear, visible focus indicators in all themes
- **Keyboard Navigation**: Theme switching must be keyboard accessible
- **Screen Reader**: Theme change must be announced to screen readers

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  html {
    transition: none !important;
  }
}
```

**Behavior**: Disables theme transition animations if user prefers reduced motion

---

## Theme Switching Best Practices

### Performance

- **CSS Custom Properties**: Efficient runtime switching (no recompilation)
- **Minimal DOM Manipulation**: Only update `data-theme` attribute and CSS properties
- **Smooth Transitions**: 300ms with natural easing (not jarring)
- **Preserve State**: Scroll position, form data, user state during switch

### User Experience

- **System Preference**: Respect user's OS theme preference by default
- **Manual Override**: Allow users to override system preference
- **Smooth Transition**: Not jarring or instant
- **Immediate Feedback**: Theme change visible immediately (300ms transition)
- **Persisted Choice**: Remember user's selection between sessions

### Implementation

- **Theme Provider**: Wrap app in theme provider component
- **Theme Hook**: Provide `useTheme()` hook for component access
- **Theme Listener**: Dispatch `themechange` events for updates
- **System Detection**: Use `prefers-color-scheme` media query
- **localStorage**: Persist user's manual selection

---

## React Integration

### Theme Provider Component

```typescript
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeId;
}

function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    defaultTheme ? THEMES.find(t => t.id === defaultTheme) : getTheme()
  );

  const setThemeHandler = (themeId: ThemeId) => {
    setTheme(themeId);
  };

  useEffect(() => {
    // Apply theme on mount
    const initialTheme = defaultTheme
      ? THEMES.find(t => t.id === defaultTheme) || getTheme()
      : getTheme();
    setThemeState(initialTheme);
  }, [defaultTheme]);

  const themeValue = useMemo(() => ({
    theme,
    setTheme: setThemeHandler,
    resetToSystem: () => {
      resetToSystemPreference();
      const newTheme = getTheme();
      setThemeState(newTheme);
    },
  }), [theme]);

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**Behavior**:
- Provides theme context to entire app
- Applies theme on mount
- Updates theme via `setTheme()` function
- Resets to system preference via `resetToSystem()` function

### Use Theme Hook

```typescript
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context.theme;
}

function useThemeActions() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeActions must be used within ThemeProvider');
  }
  return {
    setTheme: context.setTheme,
    resetToSystem: context.resetToSystem,
  };
}
```

**Usage**:
- `useTheme()`: Access current theme
- `useThemeActions()`: Access theme switching functions

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-26 | Initial theme switching contract |

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Media Query: prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Media Query: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
