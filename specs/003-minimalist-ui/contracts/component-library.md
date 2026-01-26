# Component Library Contract

**Feature**: `003-minimalist-ui`
**Date**: 2026-01-26
**Version**: 1.0.0

## Overview

This contract defines the API, props, states, and behavior for all UI components in the minimalist component library. Components follow minimalist design principles: purposeful whitespace, deep minimalism, content-first hierarchy, and "invisible" UI.

## Component Categories

### Atoms (Basic Components)

Atomic-level components that cannot be broken down further.

#### Button

**Purpose**: Call-to-action (CTA) and interactive triggers.

**Props**:
```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  state?: 'default' | 'hover' | 'active' | 'pressed' | 'disabled';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  href?: string; // If provided, renders as anchor
  testId?: string; // For E2E testing
}
```

**Variants**:
- **Primary**: Accent background color, white text, rounded corners (4px)
- **Secondary**: Border only, text color, subtle background on hover
- **Tertiary**: Ghost button, text only, no border or background

**Sizes**:
- **Small**: 32px height, 12px padding (compact)
- **Medium**: 40px height, 16px padding (default, 44px touch target)
- **Large**: 48px height, 20px padding (emphasized)

**States**:
- **Default**: Base appearance, no interaction
- **Hover**: Subtle shadow increase, slight color shift (200ms)
- **Active/Focus**: Accent background, white text, medium shadow, outline for keyboard navigation
- **Pressed**: Slight scale (99%), shadow increase (150ms)
- **Disabled**: 0.6 opacity, no interaction, grayed text
- **Loading**: Spinner or progress indicator, no interaction

**Accessibility**:
- Keyboard navigable (Tab key)
- Focus indicator (outline or background change)
- ARIA label (if icon only)
- Touch target: 44px minimum (medium and large sizes)
- Screen reader announces button label

**Design Tokens Used**:
- Colors: `accent`, `textPrimary`, `background`, `surface`
- Spacing: `comfortable` (padding), `hairline` (gap between icon and text)
- Border Radius: `small` (4px)
- Shadows: `default` (default), `subtle` (hover), `medium` (active)
- Typography: `body` (medium), `bodySmall` (small)

---

#### Input

**Purpose**: Text input fields for forms and data entry.

**Props**:
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  state?: 'default' | 'focus' | 'error' | 'disabled';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  onValueChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  errorMessage?: string;
  required?: boolean;
  testId?: string;
}
```

**Sizes**:
- **Small**: 32px height, 8px padding
- **Medium**: 40px height, 12px padding (default)
- **Large**: 48px height, 16px padding

**States**:
- **Default**: Border, no background
- **Focus**: Accent border color, subtle shadow, outline for keyboard navigation
- **Error**: Error border color, error icon, error message visible
- **Disabled**: 0.6 opacity, no interaction, grayed background

**Validation**:
- HTML5 validation types (email, number, url, etc.)
- Required field indicator (asterisk)
- Error state on validation failure
- Clear error messages below input

**Accessibility**:
- Label linked to input (HTML `for` attribute)
- ARIA required indicator
- Keyboard navigable
- Focus indicator (accent border, outline)
- Error announcement for screen readers
- Touch target: 44px minimum (medium and large sizes)

**Design Tokens Used**:
- Colors: `textPrimary`, `border`, `accent` (focus), `error` (error state)
- Spacing: `comfortable` (padding), `cozy` (label to input gap)
- Border Radius: `small` (4px)
- Shadows: `default` (focus)
- Typography: `body` (input text), `caption` (label, placeholder)
- Transitions: `focus` (200ms), `pressed` (not applicable)

---

#### Typography

**Purpose**: Text display with hierarchical sizing and weights.

**Props**:
```typescript
interface TypographyProps {
  variant?: 'display' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'heading5' | 'body' | 'bodySmall' | 'caption';
  weight?: 'light' | 'regular' | 'medium' | 'bold';
  color?: 'primary' | 'secondary' | 'accent' | 'error' | 'success' | 'warning';
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
  ellipsis?: boolean; // Truncate with ellipsis
  lines?: number; // Clamp to N lines
  testId?: string;
}
```

**Variants**:
- **Display**: 2.5rem (40px), bold weight, primary text color
- **Heading1**: 2rem (32px), bold weight, primary text color
- **Heading2**: 1.5rem (24px), medium weight, primary text color
- **Heading3**: 1.25rem (20px), medium weight, primary text color
- **Heading4**: 1.125rem (18px), regular weight, primary text color
- **Heading5**: 1rem (16px), regular weight, primary text color
- **Body**: 1rem (16px), regular weight, primary text color
- **BodySmall**: 0.875rem (14px), regular weight, secondary text color
- **Caption**: 0.75rem (12px), regular weight, secondary text color

**Colors**:
- **Primary**: Default text color (from theme)
- **Secondary**: Subtle text, reduced opacity
- **Accent**: Accent color (for emphasis, CTAs)
- **Error**: Error color
- **Success**: Success color
- **Warning**: Warning color

**Accessibility**:
- Semantic HTML tags (`h1`-`h6`, `p`, `span`, etc.)
- Proper heading hierarchy
- Color independence (icons + text, not color alone)
- WCAG contrast ratio (4.5:1 minimum)

**Design Tokens Used**:
- Colors: `textPrimary`, `textSecondary`, `accent`, `semantic.error/success/warning`
- Typography: `display`, `heading1-5`, `body`, `bodySmall`, `caption`
- Line Heights: `heading`, `body`, `caption`

---

### Molecules (Composite Components)

Components composed of multiple atoms.

#### Card

**Purpose**: Container for content with subtle shadow and whitespace.

**Props**:
```typescript
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered';
  size?: 'small' | 'medium' | 'large';
  padding?: 'compact' | 'comfortable' | 'generous';
  interactive?: boolean; // Adds hover state and click handler
  onClick?: () => void;
  testId?: string;
}
```

**Variants**:
- **Default**: White background, subtle shadow, 16px padding
- **Elevated**: White background, medium shadow, 20px padding
- **Bordered**: White background, border only, no shadow, 16px padding

**Sizes**:
- **Small**: Reduced padding (12px), smaller shadow
- **Medium**: Default padding (16px), medium shadow
- **Large**: Increased padding (24px), larger shadow

**Padding**:
- **Compact**: 12px padding
- **Comfortable**: 16px padding (default)
- **Generous**: 24px padding

**States**:
- **Default**: Base appearance
- **Hover** (if interactive): Subtle shadow increase, slight scale (100%), cursor pointer
- **Focus**: Medium shadow, outline for keyboard navigation

**Accessibility**:
- Interactive cards announce role (`button` or `link`)
- Keyboard navigable (if interactive)
- Focus indicator (outline or shadow)
- Touch target: 44px minimum (entire card if interactive)

**Design Tokens Used**:
- Colors: `surface`, `background` (if elevated on dark background)
- Spacing: `compact`, `comfortable`, `generous`
- Border Radius: `medium` (8px)
- Shadows: `subtle` (default), `default` (elevated), `medium` (hover/focus)
- Transitions: `hover` (200ms)

---

#### FormField

**Purpose**: Input with label, error message, and optional icon.

**Props**:
```typescript
interface FormFieldProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  state?: 'default' | 'focus' | 'error' | 'disabled';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  errorMessage?: string;
  required?: boolean;
  onValueChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  testId?: string;
}
```

**Composition**:
- **Label** (Typography variant="caption", required indicator)
- **Input** (Input component)
- **Error Message** (Typography variant="caption", color="error")
- **Icon** (if provided)

**Layout**:
- Label above input (12px gap)
- Icon left of input (8px gap)
- Error message below input (4px gap)
- Required indicator (*) after label text

**States**:
- **Default**: Label, input, no error
- **Focus**: Accent border on input
- **Error**: Error border on input, error icon (if provided), error message visible
- **Disabled**: Grayed label, disabled input, no interaction

**Accessibility**:
- Label linked to input (HTML `for` attribute)
- ARIA required indicator
- ARIA error state
- Error announcement for screen readers
- Keyboard navigable

**Design Tokens Used**:
- Colors: `textPrimary`, `textSecondary`, `border`, `accent`, `error`
- Spacing: `cozy` (label to input), `hairline` (input to error)
- Typography: `caption` (label, error)
- Border Radius: `small` (4px)

---

### Organisms (Complex Components)

Complex components composed of multiple molecules and atoms.

#### Navigation

**Purpose**: Primary navigation for app (e.g., bottom nav on mobile, top nav on desktop).

**Props**:
```typescript
interface NavigationProps {
  items: NavigationItem[];
  variant?: 'bottom' | 'top';
  position?: 'fixed' | 'sticky' | 'static';
  testId?: string;
}

interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  badge?: number | string; // Notification count
}
```

**Variants**:
- **Bottom**: Fixed to bottom of screen, 3-5 items, icon + label, 56px height
- **Top**: Fixed or sticky to top, full-width menu, 56px height, hamburger menu on mobile

**States**:
- **Default**: Secondary background, primary text
- **Active**: Accent background (icon only) or accent text, accent border
- **Hover**: Subtle background change, accent text
- **Focus**: Outline for keyboard navigation

**Layout**:
- **Bottom**: Flex row, even spacing, icon above label (desktop) or side by side (mobile)
- **Top**: Flex row, even spacing, logo left, items center/right

**Accessibility**:
- `nav` HTML element
- `ul` and `li` structure
- `a` or `button` for items
- ARIA `current` for active item
- ARIA label for badge (e.g., "3 notifications")
- Keyboard navigable (Tab through items)
- Touch targets: 44px minimum (56px height ensures this)

**Design Tokens Used**:
- Colors: `surface`, `textPrimary`, `textSecondary`, `accent`, `background` (for transparent navs)
- Spacing: `generous` (horizontal padding)
- Shadows: `subtle` (if elevated)
- Border Radius: `medium` (8px, top corners only for bottom nav)
- Typography: `caption` (label), `heading5` (badge)

---

## Component State Contract

All components must support these states:

```typescript
interface ComponentState {
  default: boolean;   // Base appearance
  hover: boolean;     // Mouse over or tap
  focus: boolean;     // Keyboard navigation focus
  active: boolean;    // Currently active or pressed
  pressed: boolean;   // Momentarily pressed
  disabled: boolean;  // Disabled state
  error: boolean;     // Validation error or failure
  success: boolean;   // Success state
  loading: boolean;   // Loading state
}
```

**State Transitions**:
- Hover → Default: Revert with 150ms ease-out
- Focus → Default: Revert with 200ms ease-out
- Pressed → Active: Transition to active with 150ms ease-in
- Default → Active: 150ms ease-in
- Active → Default: 200ms ease-out
- Loading → Default: Instant (no transition)

---

## Accessibility Contract

All components must meet WCAG 2.1 AA requirements:

### Mandatory ARIA

- **Labels**: All inputs must have associated labels
- **Roles**: Use semantic HTML roles (button, navigation, link, etc.)
- **States**: Announce state changes (loading, error, success)
- **Focus**: Visible, distinct focus indicators
- **Landmarks**: Use HTML5 landmarks (header, nav, main, footer)

### Keyboard Navigation

- **Tab Order**: Logical tab order through interactive elements
- **Focus Traps**: No focus traps (unless modals)
- **Focus Indicators**: Clear visual feedback on focus
- **Enter/Space**: Activate focused buttons/links

### Screen Reader

- **Semantic HTML**: Use proper HTML5 elements
- **ARIA Labels**: Provide labels where not obvious from text
- **ARIA Descriptions**: Provide additional context where needed
- **Live Regions**: Announce dynamic content changes

### Touch Targets

- **Minimum Size**: 44px × 44px for all interactive elements
- **Spacing**: 8px minimum between touch targets
- **Thumb Zone**: Place primary actions in bottom 1/3 of screen (mobile)

### Color Independence

- **Icons + Text**: Don't rely on color alone
- **Patterns**: Use patterns (stripes, shapes) where needed
- **Contrast**: Ensure 4.5:1 minimum contrast ratio

---

## Responsive Contract

All components must adapt to breakpoints:

| Breakpoint | Description | Component Behavior |
|------------|-------------|-------------------|
| Mobile (<768px) | Single column, simplified layouts | Reduce padding, hide non-essential elements |
| Tablet (768-1024px) | Multi-column where appropriate | Adjust spacing for larger screens |
| Desktop (>1024px) | Full layout, horizontal space | Use generous spacing, show all elements |

---

## Performance Contract

All components must meet performance targets:

- **Render Time**: <100ms for initial render
- **Re-render Time**: <50ms for prop changes
- **Animation Performance**: 60fps maintained during transitions
- **Bundle Impact**: Component library should not significantly increase bundle size (use code splitting)

---

## Testing Contract

### Unit Tests (Vitest)

- Test all props and props combinations
- Test state transitions
- Test accessibility props (testId, ARIA attributes)
- Test responsive behavior (if applicable)

### Component Tests (React Testing Library)

- Test component renders correctly
- Test user interactions (click, hover, focus)
- Test accessibility (keyboard navigation, screen reader)
- Test visual regression (screenshot comparison)

### E2E Tests (Playwright)

- Test components in real browser
- Test responsive behavior across breakpoints
- Test accessibility with screen readers
- Test user flows involving components

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-26 | Initial component library contract |

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design Guidelines](https://material.io/design)
