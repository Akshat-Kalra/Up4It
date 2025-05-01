import { BlurView } from "expo-blur";
import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

/**
 * GlassCard - A glassmorphic card component with blur effect
 * Implements the glassmorphism design from the Up4It design system
 *
 * @param {Object} props - Component props
 * @param {string} [props.title] - Optional card title
 * @param {function} [props.onPress] - Optional press handler
 * @param {Object} [props.style] - Additional styles to apply
 * @param {Object} [props.titleStyle] - Additional title styles
 * @param {Object} [props.contentStyle] - Additional content styles
 * @param {ReactNode} props.children - Card content
 * @returns {ReactNode}
 */
const GlassCard = ({
  title,
  onPress,
  style,
  titleStyle,
  contentStyle,
  children,
}) => {
  // Get theme values
  const { theme, isDark } = useTheme();
  const { colors, spacing, borderRadius, shadows } = theme;

  // Animation value for press feedback
  const scale = useRef(new Animated.Value(1)).current;

  // Animate scale on press
  const animateScale = (targetValue) => {
    Animated.spring(scale, {
      toValue: targetValue,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Card content with optional title
  const cardContent = (
    <>
      {title && (
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              marginBottom: spacing.md,
              ...theme.typography.h4,
            },
            titleStyle,
          ]}
        >
          {title}
        </Text>
      )}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </>
  );

  // If no onPress handler, render without Pressable
  if (!onPress) {
    return (
      <View
        style={[
          styles.container,
          {
            borderRadius: borderRadius.card,
            ...shadows.glassCard,
          },
          style,
        ]}
      >
        <BlurView
          intensity={isDark ? 40 : 80}
          tint={isDark ? "dark" : "light"}
          style={[
            styles.blurView,
            {
              borderRadius: borderRadius.card,
              borderColor: colors.glassBorder,
              backgroundColor: colors.glass,
            },
          ]}
        >
          {cardContent}
        </BlurView>
      </View>
    );
  }

  // With onPress handler, render with animation
  return (
    <Pressable
      onPressIn={() => animateScale(0.98)}
      onPressOut={() => animateScale(1)}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.container,
          {
            borderRadius: borderRadius.card,
            ...shadows.glassCard,
            transform: [{ scale }],
          },
          style,
        ]}
      >
        <BlurView
          intensity={isDark ? 40 : 80}
          tint={isDark ? "dark" : "light"}
          style={[
            styles.blurView,
            {
              borderRadius: borderRadius.card,
              borderColor: colors.glassBorder,
              backgroundColor: colors.glass,
            },
          ]}
        >
          {cardContent}
        </BlurView>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    margin: 8,
  },
  blurView: {
    padding: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
  title: {
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
});

export default GlassCard;
