import React, { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

/**
 * NeumorphicButton - A button with neumorphic styling
 * Implements the neumorphism design from the Up4It design system
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Button label text
 * @param {function} props.onPress - Press handler
 * @param {Object} [props.style] - Additional styles for the button
 * @param {Object} [props.textStyle] - Additional styles for the label text
 * @param {boolean} [props.disabled] - Whether the button is disabled
 * @param {string} [props.variant='primary'] - Button variant: 'primary', 'secondary', or 'ghost'
 * @param {string} [props.size='medium'] - Button size: 'small', 'medium', or 'large'
 * @returns {ReactNode}
 */
const NeumorphicButton = ({
  label,
  onPress,
  style,
  textStyle,
  disabled = false,
  variant = "primary",
  size = "medium",
}) => {
  // Get theme values
  const { theme, isDark } = useTheme();
  const { colors, typography, borderRadius, spacing } = theme;

  // State for pressed status
  const [isPressed, setIsPressed] = useState(false);

  // Get button size styles
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          ...typography.small,
        };
      case "large":
        return {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          ...typography.h4,
        };
      case "medium":
      default:
        return {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          ...typography.body,
        };
    }
  };

  // Get variant specific styles
  const getVariantStyles = (pressed) => {
    const base = {
      backgroundColor: colors.neumorphicBackground,
      color: colors.text,
    };

    // Shadow style based on pressed state
    const shadowStyle = pressed
      ? {
          shadowColor: isDark ? "#000000" : "#FFFFFF",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
          // Inner shadow effect
          borderWidth: 1,
          borderColor: colors.neumorphicBackground,
        }
      : {
          shadowColor: colors.neumorphicShadowDark,
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 0.6,
          shadowRadius: 8,
          elevation: 6,
        };

    // Add light shadow for pressed state
    if (pressed) {
      shadowStyle.backgroundColor = isDark
        ? "rgba(0, 0, 0, 0.3)"
        : "rgba(235, 235, 235, 1)";
    }

    switch (variant) {
      case "secondary":
        return {
          ...base,
          ...shadowStyle,
          backgroundColor: isDark
            ? colors.secondaryBackground
            : colors.offWhite,
          borderColor: isDark
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.03)",
          color: colors.secondaryText,
        };
      case "ghost":
        return {
          ...shadowStyle,
          backgroundColor: "transparent",
          borderWidth: 0,
          color: colors.primary,
        };
      case "primary":
      default:
        return {
          ...base,
          ...shadowStyle,
          backgroundColor: colors.primary,
          color: "#FFFFFF",
        };
    }
  };

  // Get styles for disabled state
  const getDisabledStyles = () => ({
    backgroundColor: isDark ? colors.darkGray : colors.lightGray,
    color: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  });

  // Combined styles
  const buttonStyles = [
    styles.button,
    { borderRadius: borderRadius.button },
    getSizeStyles(),
    getVariantStyles(isPressed),
    disabled && getDisabledStyles(),
    style,
  ];

  // Text styles
  const buttonTextStyles = [
    styles.text,
    {
      color: getVariantStyles(isPressed).color,
      ...typography.button,
    },
    disabled && {
      color: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
    },
    textStyle,
  ];

  return (
    <Pressable
      style={buttonStyles}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled}
    >
      <Text style={buttonTextStyles}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
});

export default NeumorphicButton;
