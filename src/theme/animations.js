/**
 * Animation constants for the Up4It app
 * Based on the design system documentation
 */

import { Easing } from 'react-native';

// Duration constants (in ms)
export const DURATION = {
  extraFast: 100,
  fast: 150,
  normal: 250,
  slow: 400,
  extraSlow: 500,
};

// Timing functions matching the design system
export const EASING = {
  // Standard ease - default most transitions
  standard: Easing.bezier(0.4, 0.0, 0.2, 1),
  
  // Enter ease - elements entering the screen
  enter: Easing.bezier(0.0, 0.0, 0.2, 1),
  
  // Exit ease - elements leaving the screen
  exit: Easing.bezier(0.4, 0.0, 1, 1),
  
  // Emphasis - for attention-grabbing animations
  emphasis: Easing.bezier(0.4, 0.0, 0.6, 1),
  
  // Additional easing functions for specific cases
  elastic: Easing.elastic(0.7),
  bounce: Easing.bounce,
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
};

// Animation presets for common use cases
export const ANIMATION_PRESETS = {
  // Page transitions
  pageTransition: {
    duration: DURATION.normal,
    easing: EASING.standard,
    useNativeDriver: true,
    properties: {
      opacity: { from: 0, to: 1 },
      translateY: { from: 20, to: 0 },
    },
  },
  
  // Modal transitions
  modalEnter: {
    duration: DURATION.normal,
    easing: EASING.enter,
    useNativeDriver: true,
    properties: {
      opacity: { from: 0, to: 1 },
      scale: { from: 0.95, to: 1 },
    },
  },
  
  modalExit: {
    duration: DURATION.fast,
    easing: EASING.exit,
    useNativeDriver: true,
    properties: {
      opacity: { from: 1, to: 0 },
      scale: { from: 1, to: 0.95 },
    },
  },
  
  // Element transitions
  fadeIn: {
    duration: DURATION.normal,
    easing: EASING.enter,
    useNativeDriver: true,
    properties: {
      opacity: { from: 0, to: 1 },
    },
  },
  
  fadeOut: {
    duration: DURATION.fast,
    easing: EASING.exit,
    useNativeDriver: true,
    properties: {
      opacity: { from: 1, to: 0 },
    },
  },
  
  // Button press feedback
  buttonPress: {
    duration: DURATION.fast,
    easing: EASING.standard,
    useNativeDriver: true,
    properties: {
      scale: { from: 1, to: 0.95 },
    },
  },
  
  // Success animation
  success: {
    duration: DURATION.slow,
    easing: EASING.elastic,
    useNativeDriver: true,
    properties: {
      scale: { from: 0.8, to: 1 },
    },
  },
  
  // Error animation
  error: {
    duration: DURATION.normal,
    easing: EASING.bounce,
    useNativeDriver: true,
    properties: {
      translateX: { sequence: [0, -10, 10, -5, 5, 0] },
    },
  },
  
  // List item stagger delay
  staggerDelay: 50, // ms between each item animation
};

// Helper for staggered animations
export const getStaggeredDelay = (index, baseDelay = 0) => {
  return baseDelay + (index * ANIMATION_PRESETS.staggerDelay);
}; 