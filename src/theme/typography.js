/**
 * Typography settings for the Up4It app
 * Based on the design system documentation
 */

import { Platform } from 'react-native';

// Font families
export const FONTS = {
  primary: Platform.select({
    ios: 'Inter',
    android: 'Inter',
    web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }),
  secondary: Platform.select({
    ios: 'Montserrat',
    android: 'Montserrat',
    web: 'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }),
  monospace: Platform.select({
    ios: 'JetBrains Mono',
    android: 'JetBrains Mono',
    web: '"JetBrains Mono", "Courier New", monospace',
  }),
};

// Font sizes
export const FONT_SIZES = {
  display: 48,  // 3rem
  h1: 36,       // 2.25rem
  h2: 28,       // 1.75rem
  h3: 24,       // 1.5rem
  h4: 20,       // 1.25rem
  body: 16,     // 1rem (base)
  small: 14,    // 0.875rem
  tiny: 12,     // 0.75rem
};

// Font weights
export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// Line heights
export const LINE_HEIGHTS = {
  display: 1.2,
  h1: 1.2,
  h2: 1.25,
  h3: 1.3,
  h4: 1.4,
  body: 1.5,
  small: 1.5,
  tiny: 1.5,
};

// Ready-to-use text styles with all properties
export const TEXT_STYLES = {
  display: {
    fontFamily: FONTS.secondary,
    fontSize: FONT_SIZES.display,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES.display * LINE_HEIGHTS.display,
  },
  h1: {
    fontFamily: FONTS.secondary,
    fontSize: FONT_SIZES.h1,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES.h1 * LINE_HEIGHTS.h1,
  },
  h2: {
    fontFamily: FONTS.secondary,
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: FONT_SIZES.h2 * LINE_HEIGHTS.h2,
  },
  h3: {
    fontFamily: FONTS.secondary,
    fontSize: FONT_SIZES.h3,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: FONT_SIZES.h3 * LINE_HEIGHTS.h3,
  },
  h4: {
    fontFamily: FONTS.secondary,
    fontSize: FONT_SIZES.h4,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: FONT_SIZES.h4 * LINE_HEIGHTS.h4,
  },
  body: {
    fontFamily: FONTS.primary,
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: FONT_SIZES.body * LINE_HEIGHTS.body,
  },
  small: {
    fontFamily: FONTS.primary,
    fontSize: FONT_SIZES.small,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: FONT_SIZES.small * LINE_HEIGHTS.small,
  },
  tiny: {
    fontFamily: FONTS.primary,
    fontSize: FONT_SIZES.tiny,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: FONT_SIZES.tiny * LINE_HEIGHTS.tiny,
  },
  monospace: {
    fontFamily: FONTS.monospace,
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: FONT_SIZES.body * LINE_HEIGHTS.body,
  },
  button: {
    fontFamily: FONTS.primary,
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: FONT_SIZES.body * LINE_HEIGHTS.body,
  },
}; 