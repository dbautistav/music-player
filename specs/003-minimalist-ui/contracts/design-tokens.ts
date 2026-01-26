/**
 * Design Tokens Contract
 * Minimalist UI/UX Design System
 * Feature: 003-minimalist-ui
 */

/**
 * Color Palette Types
 */
export interface ColorPalette {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary?: string;
  secondary: string;
  border: string;
  accent: string;
  semantic: SemanticColors;
}

export interface SemanticColors {
  success: string;
  warning: string;
  error: string;
  info?: string;
}

/**
 * Color Palettes (Three Curated Themes)
 */
export const JAPANDI_PALETTE: ColorPalette = {
  background: '#FAFAFA',
  surface: '#FFFFFF',
  textPrimary: '#333333',
  secondary: '#D1C7B7',
  border: '#D1C7B7',
  accent: '#6B7E66',
  semantic: {
    success: '#5A7D5A',
    warning: '#FF9F1C',
    error: '#EF4444',
  },
};

export const DIGITAL_SLATE_PALETTE: ColorPalette = {
  background: '#F4F7F9',
  surface: '#FFFFFF',
  textPrimary: '#1A202C',
  secondary: '#CBD5E0',
  border: '#CBD5E0',
  accent: '#3182CE',
  semantic: {
    success: '#5A7D5A',
    warning: '#DD6B20',
    error: '#E53E3E',
  },
};

export const MINIMALIST_DARK_PALETTE: ColorPalette = {
  background: '#121212',
  surface: '#1E1E1E',
  textPrimary: '#E0E0E0',
  secondary: '#424242',
  border: '#424242',
  accent: '#BB86FC',
  semantic: {
    success: '#5A7D5A',
    warning: '#FFC107',
    error: '#CF6679',
    info: '#03DAC6',
  },
};

/**
 * Typography Weights (4 Weights)
 */
export type FontWeight =
  | 'light'      // 300 - Subtle, decorative
  | 'regular'    // 400 - Body text, labels
  | 'medium'     // 500 - Emphasis, subheadings
  | 'bold';       // 700 - Headings, CTAs

/**
 * Typography Scale (Modular 1.25 Ratio)
 */
export interface TypographyScale {
  display: string;     // 2.5rem (40px) - Page titles
  heading1: string;    // 2rem (32px) - Section headings
  heading2: string;    // 1.5rem (24px) - Subheadings
  heading3: string;    // 1.25rem (20px) - Small headings
  heading4: string;    // 1.125rem (18px) - Large text
  body: string;         // 1rem (16px) - Default body
  bodySmall: string;    // 0.875rem (14px) - Secondary text
  caption: string;       // 0.75rem (12px) - Captions
}

export const TYPOGRAPHY_SCALE: TypographyScale = {
  display: '2.5rem',
  heading1: '2rem',
  heading2: '1.5rem',
  heading3: '1.25rem',
  heading4: '1.125rem',
  body: '1rem',
  bodySmall: '0.875rem',
  caption: '0.75rem',
};

/**
 * Line Heights (Optimal Readability)
 */
export interface LineHeights {
  heading: string;   // 1.1 to 1.3
  body: string;      // 1.5 to 1.6
  caption: string;   // 1.3 to 1.4
}

export const LINE_HEIGHTS: LineHeights = {
  heading: '1.2',
  body: '1.55',
  caption: '1.35',
};

/**
 * Spacing Scale (4px Base, Modular)
 */
export interface SpacingScale {
  none: string;      // 0px
  hairline: string;   // 4px
  compact: string;   // 8px
  cozy: string;      // 12px
  comfortable: string; // 16px - Default spacing
  generous: string;  // 20px
  spacious: string;   // 24px
  expansive: string; // 32px
  veryLarge: string;  // 40px
  maximum: string;   // 48px
  page: string;       // 64px
}

export const SPACING_SCALE: SpacingScale = {
  none: '0px',
  hairline: '4px',
  compact: '8px',
  cozy: '12px',
  comfortable: '16px',
  generous: '20px',
  spacious: '24px',
  expansive: '32px',
  veryLarge: '40px',
  maximum: '48px',
  page: '64px',
};

/**
 * Shadow Scale (Subtle, Minimal)
 */
export interface ShadowScale {
  none: string;
  subtle: string;
  default: string;
  medium: string;
  strong: string;
}

export const SHADOW_SCALE: ShadowScale = {
  none: 'none',
  subtle: '0 1px 2px rgba(0, 0, 0, 0.04)',
  default: '0 2px 4px rgba(0, 0, 0, 0.08)',
  medium: '0 4px 8px rgba(0, 0, 0, 0.12)',
  strong: '0 8px 16px rgba(0, 0, 0, 0.16)',
};

/**
 * Border Radius (Subtle Roundness)
 */
export interface BorderRadiusScale {
  none: string;
  small: string;      // 4px - Buttons, inputs
  medium: string;    // 8px - Cards, containers
  large: string;      // 12px - Modals, large cards
  full: string;       // 9999px - Fully round
}

export const BORDER_RADIUS_SCALE: BorderRadiusScale = {
  none: '0px',
  small: '4px',
  medium: '8px',
  large: '12px',
  full: '9999px',
};

/**
 * Theme Types
 */
export type ThemeId =
  | 'japandi-light'
  | 'digital-slate-light'
  | 'minimalist-dark';

export type ThemeType = 'light' | 'dark';

/**
 * Theme Configuration
 */
export interface Theme {
  id: ThemeId;
  name: string;
  type: ThemeType;
  palette: ColorPalette;
  isDefault?: boolean;
}

export const THEMES: Theme[] = [
  {
    id: 'japandi-light',
    name: 'Japandi Light',
    type: 'light',
    palette: JAPANDI_PALETTE,
    isDefault: true,
  },
  {
    id: 'digital-slate-light',
    name: 'Digital Slate Light',
    type: 'light',
    palette: DIGITAL_SLATE_PALETTE,
  },
  {
    id: 'minimalist-dark',
    name: 'Minimalist Dark',
    type: 'dark',
    palette: MINIMALIST_DARK_PALETTE,
  },
];

/**
 * Component States
 */
export type ComponentState =
  | 'default'
  | 'hover'
  | 'focus'
  | 'active'
  | 'pressed'
  | 'disabled'
  | 'error'
  | 'success'
  | 'loading';

/**
 * Component State Props
 */
export interface ComponentStateProps {
  state?: ComponentState;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
}

/**
 * Breakpoint Sizes (Responsive Design)
 */
export interface Breakpoints {
  mobile: string;    // < 768px
  tablet: string;    // 768px - 1024px
  desktop: string;   // > 1024px
}

export const BREAKPOINTS: Breakpoints = {
  mobile: '767px',
  tablet: '1023px',
  desktop: '1024px',
};

/**
 * Animation Timing (Micro-interactions)
 */
export interface AnimationTiming {
  hover: string;      // 100-200ms
  pressed: string;    // 150-300ms
  focus: string;      // 150-300ms
  transition: string; // 200-400ms
}

export const ANIMATION_TIMING: AnimationTiming = {
  hover: '150ms ease-out',
  pressed: '200ms ease-in',
  focus: '200ms ease-out',
  transition: '300ms ease-in-out',
};

/**
 * Easing Functions (Natural Feel)
 */
export type EasingFunction =
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'ease-in-out-back'
  | 'cubic-bezier(0.4, 0, 0.2, 1)';

/**
 * Design Token Validation
 */
export interface DesignTokenValidation {
  wcagContrast: boolean;
  sixtyThirtyTenRule: boolean;
  touchTargetSize: boolean;
}

/**
 * Utility: Check WCAG Contrast Ratio
 */
export function checkWCAGContrast(
  foreground: string,
  background: string,
): boolean {
  // Implementation should calculate luminance ratio
  // Returns true if >= 4.5:1 for normal text
  throw new Error('Not implemented');
}

/**
 * Utility: Check 60-30-10 Rule
 */
export function checkSixtyThirtyTenRule(
  backgroundColor: string,
  secondaryColor: string,
  accentColor: string,
): boolean {
  // Implementation should verify color distribution
  // 60% background, 30% secondary, 10% accent
  throw new Error('Not implemented');
}

/**
 * Utility: Check Touch Target Size
 */
export function checkTouchTargetSize(size: number): boolean {
  // Returns true if >= 44px
  return size >= 44;
}

/**
 * CSS Custom Property Names
 */
export const CSS_CUSTOM_PROPERTIES = {
  // Colors
  '--color-background': 'background',
  '--color-surface': 'surface',
  '--color-text-primary': 'textPrimary',
  '--color-secondary': 'secondary',
  '--color-border': 'border',
  '--color-accent': 'accent',
  '--color-success': 'semantic.success',
  '--color-warning': 'semantic.warning',
  '--color-error': 'semantic.error',

  // Typography
  '--font-display': 'display',
  '--font-heading1': 'heading1',
  '--font-heading2': 'heading2',
  '--font-heading3': 'heading3',
  '--font-heading4': 'heading4',
  '--font-body': 'body',
  '--font-body-small': 'bodySmall',
  '--font-caption': 'caption',

  // Line Heights
  '--line-height-heading': 'heading',
  '--line-height-body': 'body',
  '--line-height-caption': 'caption',

  // Spacing
  '--spacing-none': 'none',
  '--spacing-hairline': 'hairline',
  '--spacing-compact': 'compact',
  '--spacing-cozy': 'cozy',
  '--spacing-comfortable': 'comfortable',
  '--spacing-generous': 'generous',
  '--spacing-spacious': 'spacious',
  '--spacing-expansive': 'expansive',
  '--spacing-very-large': 'veryLarge',
  '--spacing-maximum': 'maximum',
  '--spacing-page': 'page',

  // Shadows
  '--shadow-none': 'none',
  '--shadow-subtle': 'subtle',
  '--shadow-default': 'default',
  '--shadow-medium': 'medium',
  '--shadow-strong': 'strong',

  // Border Radius
  '--radius-none': 'none',
  '--radius-small': 'small',
  '--radius-medium': 'medium',
  '--radius-large': 'large',
  '--radius-full': 'full',

  // Animation Timing
  '--timing-hover': 'hover',
  '--timing-pressed': 'pressed',
  '--timing-focus': 'focus',
  '--timing-transition': 'transition',
} as const;
