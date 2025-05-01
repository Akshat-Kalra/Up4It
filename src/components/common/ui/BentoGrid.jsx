import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

/**
 * BentoGrid - A responsive grid layout with varied item sizes
 * Implements the bento grid layout from the Up4It design system
 *
 * @param {Object} props - Component props
 * @param {ReactNode[]} props.children - Grid items (must be BentoGridItem components)
 * @param {Object} [props.style] - Additional styles to apply
 * @param {number} [props.gap] - Custom gap between grid items
 * @param {number} [props.columns=4] - Number of columns on larger screens
 * @returns {ReactNode}
 */
const BentoGrid = ({ children, style, gap, columns = 4 }) => {
  // Get theme values and screen width
  const { theme } = useTheme();
  const { spacing, breakpoints } = theme;
  const { width } = useWindowDimensions();

  // Determine number of columns based on screen width
  const getResponsiveColumns = () => {
    if (width < breakpoints.phone) return 1;
    if (width < breakpoints.tablet) return 2;
    if (width < breakpoints.desktop) return 3;
    return columns;
  };

  // Calculate grid gap
  const gridGap = gap !== undefined ? gap : spacing.md;
  const actualColumns = getResponsiveColumns();

  return (
    <View style={[styles.container, { gap: gridGap }, style]}>
      {React.Children.map(children, (child, index) => {
        // Ensure child is valid
        if (!React.isValidElement(child)) return null;

        // Pass grid props to each child
        return React.cloneElement(child, {
          ...child.props,
          gridColumns: actualColumns,
          gap: gridGap,
          key: `bento-item-${index}`,
        });
      })}
    </View>
  );
};

/**
 * BentoGridItem - Individual item in the bento grid
 *
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Item content
 * @param {Object} [props.style] - Additional styles to apply
 * @param {number} [props.span=1] - How many columns this item spans
 * @param {number} [props.height] - Custom height (in pixels or "auto")
 * @param {number} [props.minHeight] - Minimum height (in pixels)
 * @param {number} [props.gridColumns=4] - Number of grid columns (passed by BentoGrid)
 * @param {number} [props.gap=16] - Grid gap (passed by BentoGrid)
 * @returns {ReactNode}
 */
export const BentoGridItem = ({
  children,
  style,
  span = 1,
  height,
  minHeight,
  gridColumns = 4,
  gap = 16,
  ...props
}) => {
  // Get theme values
  const { theme } = useTheme();
  const { borderRadius, shadows } = theme;

  // Calculate the width based on span and grid columns
  const getWidth = () => {
    // Normalize span to not exceed gridColumns
    const normalizedSpan = Math.min(span, gridColumns);

    // Calculate percentage width based on grid columns and gaps
    const itemWidth = `${(100 / gridColumns) * normalizedSpan}%`;
    const gapWidth = gap * (normalizedSpan - 1);

    return {
      width: itemWidth,
      // Adjust for gaps between items
      maxWidth: `calc(${itemWidth} - ${gapWidth}px)`,
    };
  };

  return (
    <View
      style={[
        styles.item,
        {
          borderRadius: borderRadius.card,
          ...shadows.sm,
          ...(height && { height }),
          ...(minHeight && { minHeight }),
          ...getWidth(),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  item: {
    overflow: "hidden",
    backgroundColor: "#fff",
    minHeight: 150,
    marginBottom: 16,
  },
});

export default BentoGrid;
