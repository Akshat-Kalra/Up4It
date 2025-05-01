/**
 * Color palette for the Up4It app
 * Based on the design system documentation
 */

// Primary brand colors
export const PRIMARY = {
  blue: '#4F46E5',
  purple: '#9F7AEA',
  teal: '#38B2AC',
};

// Neutral colors for light and dark modes
export const NEUTRALS = {
  white: '#FFFFFF',
  offWhite: '#F7FAFC',
  lightGray: '#E2E8F0',
  mediumGray: '#718096',
  darkGray: '#2D3748',
  charcoal: '#1A202C',
  black: '#171923',
};

// Semantic colors for notifications, alerts, etc.
export const SEMANTIC = {
  success: '#48BB78',
  warning: '#ECC94B',
  error: '#F56565',
  info: '#4299E1',
};

// Gradient definitions
export const GRADIENTS = {
  blueGradient: ['#4F46E5', '#38B2AC'],
  purpleGradient: ['#9F7AEA', '#F687B3'],
  darkGradient: ['#1A202C', '#2D3748'],
};

// Theme-specific color schemes
export const LIGHT_THEME = {
  background: NEUTRALS.white,
  secondaryBackground: NEUTRALS.offWhite,
  text: NEUTRALS.darkGray,
  secondaryText: NEUTRALS.mediumGray,
  border: NEUTRALS.lightGray,
  card: NEUTRALS.white,
  primary: PRIMARY.blue,
  secondary: PRIMARY.purple,
  accent: PRIMARY.teal,
  // Semantic colors are the same in both themes
  ...SEMANTIC,
  // Glass effect background for light mode
  glass: 'rgba(255, 255, 255, 0.15)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  // Neumorphic colors for light mode
  neumorphicBackground: '#f0f0f3',
  neumorphicShadowDark: 'rgba(174, 174, 192, 0.4)',
  neumorphicShadowLight: 'rgba(255, 255, 255, 1)',
};

export const DARK_THEME = {
  background: NEUTRALS.black,
  secondaryBackground: NEUTRALS.charcoal,
  text: NEUTRALS.white,
  secondaryText: NEUTRALS.lightGray,
  border: NEUTRALS.darkGray,
  card: NEUTRALS.charcoal,
  primary: PRIMARY.blue,
  secondary: PRIMARY.purple,
  accent: PRIMARY.teal,
  // Semantic colors are the same in both themes
  ...SEMANTIC,
  // Glass effect background for dark mode
  glass: 'rgba(26, 32, 44, 0.75)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  // Neumorphic colors for dark mode
  neumorphicBackground: '#1A202C',
  neumorphicShadowDark: 'rgba(0, 0, 0, 0.5)',
  neumorphicShadowLight: 'rgba(60, 60, 70, 0.3)',
}; 