import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

/**
 * Gradient background component
 * Creates a beautiful gradient background that adapts to theme
 */
const GradientBackground = ({
  children,
  style,
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
}) => {
  const { theme, isDark } = useTheme();

  // Use provided colors or default to theme colors
  const gradientColors =
    colors || (isDark ? theme.colors.darkGradient : theme.colors.blueGradient);

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={gradientColors}
        start={start}
        end={end}
        style={styles.gradient}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

export default GradientBackground;
