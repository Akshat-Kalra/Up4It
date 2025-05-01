/**
 * Spacing and layout measurements for the Up4It app
 * Based on the design system documentation
 */

// Base spacing unit (4px)
const BASE_UNIT = 4;

// Spacing scale
export const SPACING = {
  xs: BASE_UNIT, // 4px
  sm: BASE_UNIT * 2, // 8px
  md: BASE_UNIT * 4, // 16px
  lg: BASE_UNIT * 6, // 24px
  xl: BASE_UNIT * 8, // 32px
  xxl: BASE_UNIT * 12, // 48px
  xxxl: BASE_UNIT * 16, // 64px
};

// Border radius scale
export const BORDER_RADIUS = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999, // Fully rounded (e.g., for circular buttons)
  // Specific component radii based on design system
  card: 15,
  button: 12,
  input: 10,
  tag: 8,
};

// Shadow styles for different elevations
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  // Specific component shadows
  glassCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 6,
  },
};

// Blur intensities for glassmorphism
export const BLUR = {
  light: 10,
  medium: 20,
  heavy: 30,
};

// Grid settings for Bento layout
export const GRID = {
  gutter: SPACING.md, // 16px gap between grid items
  columns: {
    mobile: 4,
    tablet: 8,
    desktop: 12,
  },
};

// Responsive breakpoints
export const BREAKPOINTS = {
  smallPhone: 0,
  phone: 375,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1440,
}; 