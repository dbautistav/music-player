# Data Model: Minimalist UI/UX Design System

**Feature**: `003-minimalist-ui`
**Date**: 2026-01-26

## Overview

This feature defines design tokens, typography scales, spacing systems, and component states that govern the visual appearance and behavior of the PWA music player application. The data model includes design entities (colors, typography, spacing), theme configuration, and component state definitions.

## Design Entities

### Entity 1: Color Tokens

**Description**: Design tokens representing color values for three curated palettes (Japandi, Digital Slate, Minimalist Dark Mode) with semantic roles.

**Structure**: TypeScript interfaces + CSS custom properties

**Color Palettes**:

#### Japandi Palette (Warm & Inviting)

- **Background**: #FAFAFA (Off-White) - 60% usage
- **Surface/Card**: #FFFFFF (White) - Part of secondary 30%
- **Text/Primary**: #333333 (Charcoal) - Part of secondary 30%
- **Secondary/Border**: #D1C7B7 (Warm Grey/Beige) - Part of secondary 30%
- **Accent (CTA)**: #6B7E66 (Sage Green) - 10% usage
- **Semantic (Success)**: #5A7D5A (Olive Green)
- **Semantic (Warning)**: #FF9F1C (Warm Orange)
- **Semantic (Error)**: #EF4444 (Red)

#### Digital Slate Palette (Modern & Professional)

- **Background**: #F4F7F9 (Cool Light Grey) - 60% usage
- **Surface/Card**: #FFFFFF (White) - Part of secondary 30%
- **Text/Primary**: #1A202C (Dark Navy Slate) - Part of secondary 30%
- **Secondary/Border**: #CBD5E0 (Light Slate) - Part of secondary 30%
- **Accent (CTA)**: #3182CE (Accessible Blue) - 10% usage
- **Semantic (Warning)**: #DD6B20 (Orange)
- **Semantic (Error)**: #E53E3E (Red)

#### Minimalist Dark Mode Palette (Elegant & Dramatic)

- **Background**: #121212 (True Dark) - 60% usage
- **Surface/Card**: #1E1E1E (Dark Grey) - Part of secondary 30%
- **Text/Primary**: #E0E0E0 (Light Gray/White) - Part of secondary 30%
- **Secondary/Border**: #424242 (Medium Grey) - Part of secondary 30%
- **Accent (CTA)**: #BB86FC (Soft Purple) - 10% usage
- **Semantic (Info)**: #03DAC6 (Teal)
- **Semantic (Warning)**: #FFC107 (Amber)
- **Semantic (Error)**: #CF6679 (Red)

**Semantic Roles**:
- **Background**: Main page background (60% of screen)
- **Surface/Card**: Component backgrounds, cards, modals (part of secondary 30%)
- **Text/Primary**: Headings, body text, labels (part of secondary 30%)
- **Secondary/Border**: Dividers, borders, subtle UI elements (part of secondary 30%)
- **Accent (CTA)**: Call-to-action buttons, links (10% only)
- **Semantic (Success)**: Success messages, confirmation states
- **Semantic (Warning)**: Warning messages, alert states
- **Semantic (Error)**: Error messages, failure states

**Validation**:
- WCAG 2.1 AA contrast ratio: 4.5:1 for normal text, 3:1 for large text (18pt+)
- Automated contrast verification in tests
- 60-30-10 rule enforced via design system utilities

**Lifecycle**: Static tokens defined in design system, applied via CSS custom properties. Updated only when palette changes (rare).

---

### Entity 2: Typography Scale

**Description**: Hierarchical text sizes and weights using variable fonts with modular scale (1.25 ratio).

**Structure**: CSS `font-variation-settings` + responsive font sizes

**Typography Weights** (4 weights from clarification):

- **Light**: 300 (subtle, decorative)
- **Regular**: 400 (body text, labels)
- **Medium**: 500 (emphasis, subheadings)
- **Bold**: 700 (headings, CTAs)

**Typography Scale** (modular 1.25 ratio):

- **Display/Heading 1**: 2.5rem (40px) - Page titles, main headings
- **Heading 2**: 2rem (32px) - Section headings
- **Heading 3**: 1.5rem (24px) - Subheadings, card titles
- **Heading 4**: 1.25rem (20px) - Small headings, card subtitles
- **Heading 5**: 1.125rem (18px) - Large text, emphasis
- **Body**: 1rem (16px) - Default body text
- **Body Small**: 0.875rem (14px) - Secondary text, captions
- **Caption**: 0.75rem (12px) - Captions, labels

**Line Heights** (optimal readability):
- Headings: 1.1 to 1.3
- Body text: 1.5 to 1.6
- Captions: 1.3 to 1.4

**Validation**:
- Variable fonts support (CSS `font-variation-settings`)
- Fallback fonts for older browsers
- Responsive scaling (use `rem` units for accessibility with user's font scaling)
- WCAG contrast ratio maintained at all sizes

**Lifecycle**: Static scale defined in design system. Updated rarely (typography refresh). Responsive via CSS media queries.

---

### Entity 3: Spacing Scale

**Description**: Consistent spacing values using 4px base scale for margins, padding, gaps, and layout distances.

**Structure**: CSS custom properties + utility classes

**Spacing Scale** (4px base, modular):

- **0**: 0px (no spacing)
- **1**: 4px (hairline, tight)
- **2**: 8px (compact, elements within component)
- **3**: 12px (cozy, related elements)
- **4**: 16px (comfortable, default spacing)
- **5**: 20px (generous, component separation)
- **6**: 24px (spacious, section separation)
- **7**: 32px (expansive, major sections)
- **8**: 40px (very large, page-level spacing)
- **9**: 48px (maximum, rare use)
- **10**: 64px (page margins, large sections)

**Usage Patterns**:
- **Margins**: `spacing-4` to `spacing-6` for component spacing
- **Padding**: `spacing-3` to `spacing-5` for internal component padding
- **Gaps**: `spacing-2` to `spacing-4` for grid/flex gaps
- **Touch Target Spacing**: 8px minimum between interactive elements (44px targets + spacing)

**Validation**:
- Consistent across all components
- Responsive (adjust on mobile for tighter layouts)
- Maintains breathing room (minimalist principle)

**Lifecycle**: Static scale defined in design system. Updated rarely (spacing refresh).

---

### Entity 4: Shadows & Effects

**Description**: Subtle shadows and effects for depth (deep minimalism) without clutter.

**Structure**: CSS `box-shadow` values

**Shadow Scale** (subtle, minimal):

- **None**: No shadow (flat, minimal)
- **Subtle**: `0 1px 2px rgba(0,0,0,0.04)` (barely visible)
- **Default**: `0 2px 4px rgba(0,0,0,0.08)` (cards, elevated elements)
- **Medium**: `0 4px 8px rgba(0,0,0,0.12)` (modals, dropdowns)
- **Strong**: `0 8px 16px rgba(0,0,0,0.16)` (focus states, important elements)

**Effects** (limited, purposeful):

- **Hover**: Slight shadow increase (one level up)
- **Focus**: Medium shadow + outline for keyboard navigation
- **Active**: Medium shadow + slight scale (99%) for feedback
- **Modal**: Strong shadow with backdrop filter (blur)

**Validation**:
- Subtle and purposeful (not decorative)
- GPU-accelerated (use `transform` or `will-change` if animating)
- Respects `prefers-reduced-motion` (disable effects if preferred)

**Lifecycle**: Static scale defined in design system. Updated rarely (design refresh).

---

### Entity 5: Border Radius (Roundness)

**Description**: Subtle roundness on UI elements (not sharp, not fully round).

**Structure**: CSS `border-radius` values

**Radius Scale** (subtle, gentle):

- **None**: 0px (sharp corners, minimal)
- **Small**: 4px (buttons, inputs)
- **Medium**: 8px (cards, containers)
- **Large**: 12px (modals, large cards)
- **Full**: 9999px (fully round, rare use)

**Usage Patterns**:
- **Buttons/Inputs**: 4px (small radius)
- **Cards**: 8px (medium radius)
- **Modals**: 12px (large radius)
- **Avatars/Badges**: Full (fully round)

**Validation**:
- Consistent with "subtle roundness" design principle
- Maintains professional feel (not cartoonish)
- Responsive (may reduce on very small screens)

**Lifecycle**: Static scale defined in design system. Updated rarely.

---

### Entity 6: Theme Configuration

**Description**: User's theme preference (light/dark mode) and palette selection.

**Structure**: localStorage + system preference detection

**Theme Types**:

1. **Japandi Light Mode**: Warm & inviting palette (#FAFAFA background, #6B7E66 accent)
2. **Digital Slate Light Mode**: Modern & professional palette (#F4F7F9 background, #3182CE accent)
3. **Minimalist Dark Mode**: Elegant & dramatic palette (#121212 background, #BB86FC accent)

**Theme Properties**:

- **ID**: Unique identifier ( japandi-light, digital-slate-light, minimalist-dark)
- **Name**: Display name (e.g., "Japandi Light", "Digital Slate Light", "Minimalist Dark")
- **Type**: Light or Dark
- **Palette**: Color palette object (all color tokens)
- **IsDefault**: Boolean (true for default theme)

**User Preference Storage**:

- **Key**: `user-theme-preference` in localStorage
- **Value**: Theme ID (string)
- **Fallback**: System preference detection (`prefers-color-scheme`)
- **Default**: Japandi Light Mode

**State Machine**:

```
[No Preference Set]
    ↓
[Check System Preference]
    ↓ (prefers-color-scheme: light)
[Japandi Light Mode]
    ↓ (prefers-color-scheme: dark)
[Minimalist Dark Mode]
    ↓
[User Manually Selects Theme]
    ↓
[Store in localStorage]
    ↓
[Apply Custom Theme]
```

**States**:
- **System Light**: User's system preference is light mode
- **System Dark**: User's system preference is dark mode
- **Custom Light**: User manually selected light theme
- **Custom Dark**: User manually selected dark theme

**Transitions**:
- Apply CSS custom properties for smooth theme switch
- Preserve user state (scroll position, form data)
- Transition duration: 300ms with natural easing

**Validation**:
- Respects `prefers-color-scheme` media query
- Stores preference in localStorage (works offline)
- Smooth transitions (300ms, natural easing)
- WCAG contrast maintained in all themes

**Lifecycle**:
- Created: On first app load (detect system preference)
- Updated: When user manually selects theme in settings
- Persisted: In localStorage until user clears cache
- Deleted: When user clears browser data

---

### Entity 7: Component States

**Description**: Visual representations of component states (default, hover, active, disabled, focus, error, success).

**Structure**: CSS state classes + props

**Component States**:

1. **Default**: Base appearance, no interaction
2. **Hover**: Mouse pointer over element (desktop)
3. **Active/Focus**: Keyboard focus or tap active
4. **Pressed**: Click/tap in progress (momentary)
5. **Disabled**: Component is disabled (lower contrast, no interaction)
6. **Error**: Validation error or failure state
7. **Success**: Validation success or completion state
8. **Loading**: Content is loading (skeleton or spinner)

**State Attributes**:

- **Background Color**: Varies by state (accent for active/focus)
- **Border Color/Width**: Subtle increase for focus state
- **Box Shadow**: Slight increase for hover/focus
- **Opacity**: Reduced for disabled (0.5 or 0.6)
- **Transform**: Slight scale (99%) for pressed state
- **Cursor**: Pointer for interactive states, default for non-interactive
- **Icon**: Icon changes (e.g., checkmark for success)

**Validation**:
- Subtle differences between states (not jarring)
- Accessible: Focus state distinct for keyboard navigation
- Descriptive: Icons + color (not just color alone)
- GPU-accelerated for smooth transitions

**Lifecycle**: Defined in design system, applied per component. Updated rarely (state refresh).

---

## Relationships

```
Color Tokens ──┬──> Theme Configuration (uses specific palette)
Typography Scale ──┘
Spacing Scale ───> Component States (applies spacing/radius)
Shadows & Effects ─┘
Border Radius ───> Component States (applies roundness)
Theme Configuration ──> Component States (applies colors based on theme)
```

**Explanation**:
- Color tokens, typography, spacing, shadows, and border radius are independent design entities
- Theme configuration selects specific color palette
- All design entities (tokens) apply to component states
- Component states use design tokens (colors, spacing, shadows, radii) to render appearance
- Theme switching updates color tokens globally, all components react via CSS custom properties

---

## Constraints

### Platform Constraints
- Modern browser support (iOS Safari 15+, Chrome 90+, Firefox 88+, Samsung Internet 15+)
- CSS Custom Properties support (96%+ browser support)
- Variable fonts support (Chrome 102+, Safari 11+, Edge 102+, Firefox 93+)
- CSS Flexbox and Grid support (universal)

### Design Constraints
- 60-30-10 color distribution rule enforced
- WCAG 2.1 AA compliance (4.5:1 contrast ratio)
- 44px minimum touch targets for mobile
- Subtle effects (not decorative)
- Purposeful whitespace for hierarchy

### Performance Constraints
- Load time <2s (design tokens minimal impact)
- Render time <100ms (CSS transitions optimized)
- 60fps animations (GPU-accelerated)
- Initial bundle <50MB (gzipped)

### Accessibility Constraints
- WCAG 2.1 AA contrast ratio (4.5:1 normal, 3:1 large)
- Screen reader compatible (semantic HTML, ARIA labels)
- Keyboard navigable (clear focus indicators)
- Respects `prefers-reduced-motion` (disables animations)
- Color independence (icons + text, not color alone)

### Reliability Constraints
- Theme switching preserves user state (scroll, form data)
- Design tokens work offline (CSS custom properties)
- Fallback for older browsers (non-variable fonts, non-custom properties)
- Graceful degradation if features not supported

---

## State Transitions

### Theme Switching State Machine

```
[Initial Load]
    ↓
[Check localStorage for theme preference]
    ├─→ (found) → Apply Stored Theme
    └─→ (not found) → Check System Preference
        ├─→ (light) → Apply Japandi Light Mode
        └─→ (dark) → Apply Minimalist Dark Mode
            ↓
[Apply Theme via CSS Custom Properties]
    ↓
[Theme Active]
    ↓
[User Changes Theme]
    ↓
[Update localStorage]
    ↓
[Apply New Theme]
```

**Transitions**:
- Theme changes: 300ms with `ease-in-out` natural easing
- Apply to all CSS custom properties (colors, backgrounds)
- Preserve scroll position, form data, user state
- Trigger component re-renders for theme-aware components

### Component State Transitions

```
[Default State]
    ↓
[User Hovers] → [Hover State] (200ms)
    ↓
[User Clicks] → [Pressed State] (150ms)
    ↓
[Action Triggers] → [Active/Focus State]
    ↓
[Action Completes] → [Success State] OR [Default State]
```

**Transitions**:
- Hover: 100-200ms with `ease-out` easing
- Pressed: 150-300ms with `ease-in` easing
- Focus: 150-300ms with `ease-out` easing (smooth appearance)
- Success/Failure: 200-400ms with `ease-in-out` easing
- Disabled: No transition (instant)

---

## Data Persistence

### localStorage

**Purpose**: Store user's theme preference offline.

**Data Structure**:
```typescript
interface ThemePreference {
  themeId: 'japandi-light' | 'digital-slate-light' | 'minimalist-dark';
  lastUpdated: string; // ISO 8601 timestamp
}
```

**Key**: `user-theme-preference`

**Lifecycle**:
- Created: On first app load (if user selects theme)
- Updated: When user changes theme in settings
- Read: On every app load (apply stored preference)
- Deleted: When user clears browser data

### No Database Persistence

Design tokens and component states are static (defined in code), not stored in database.

---

## Summary

| Entity | Type | Storage | Purpose |
|--------|------|---------|---------|
| Color Tokens | CSS Custom Properties | Theme colors, semantic roles |
| Typography Scale | CSS font-variation-settings | Font weights, responsive sizes |
| Spacing Scale | CSS Custom Properties | Margins, padding, gaps |
| Shadows & Effects | CSS box-shadow | Depth, layering (deep minimalism) |
| Border Radius | CSS border-radius | Subtle roundness |
| Theme Configuration | localStorage + System Preference | User's theme choice |
| Component States | CSS Classes + Props | Visual states (hover, active, etc.) |

**Note**: All design entities are static (defined in code) except theme configuration (user preference). Theme switching uses CSS custom properties for efficient runtime updates without recompilation.
