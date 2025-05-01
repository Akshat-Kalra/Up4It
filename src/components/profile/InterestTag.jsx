import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../common/theme/ThemeProvider";

/**
 * InterestTag component
 * Displays an interest or activity tag that can be selectable
 */
const InterestTag = ({
  label,
  onPress,
  selected = false,
  disabled = false,
  variant = "default",
  style,
}) => {
  const { theme } = useTheme();

  // Get colors based on variant and state
  const getBackgroundColor = () => {
    if (disabled) return theme.colors.disabled;

    if (selected) {
      switch (variant) {
        case "primary":
          return theme.colors.primary;
        case "secondary":
          return theme.colors.secondary;
        case "success":
          return theme.colors.success;
        default:
          return theme.colors.primary;
      }
    } else {
      switch (variant) {
        case "primary":
          return theme.colors.primaryTransparent;
        case "secondary":
          return theme.colors.secondaryTransparent;
        case "success":
          return theme.colors.successTransparent;
        default:
          return theme.colors.primaryTransparent;
      }
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.secondaryText;

    if (selected) {
      return "#FFFFFF";
    } else {
      switch (variant) {
        case "primary":
          return theme.colors.primary;
        case "secondary":
          return theme.colors.secondary;
        case "success":
          return theme.colors.success;
        default:
          return theme.colors.primary;
      }
    }
  };

  // If no onPress is provided, render as a View instead of Pressable
  if (!onPress || disabled) {
    return (
      <View
        style={[styles.tag, { backgroundColor: getBackgroundColor() }, style]}
      >
        <Text style={[styles.label, { color: getTextColor() }]}>{label}</Text>
      </View>
    );
  }

  // With onPress, render as Pressable with animation
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tag,
        {
          backgroundColor: getBackgroundColor(),
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
        style,
      ]}
    >
      <Text style={[styles.label, { color: getTextColor() }]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
});

export default InterestTag;
