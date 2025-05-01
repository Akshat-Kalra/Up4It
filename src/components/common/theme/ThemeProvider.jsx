import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import theme from "../../../theme";

// Create the theme context
export const ThemeContext = createContext({
  theme: theme.light,
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

// Theme preference storage key
const THEME_PREFERENCE_KEY = "@up4it/theme_preference";

/**
 * Theme provider component for the Up4It app
 * Handles theme switching and persistence
 */
export const ThemeProvider = ({ children }) => {
  // Get device color scheme
  const deviceColorScheme = useColorScheme();

  // State for current theme mode
  const [themeMode, setThemeMode] = useState("system");

  // Determine if dark mode is active
  const isDark =
    themeMode === "system"
      ? deviceColorScheme === "dark"
      : themeMode === "dark";

  // Get the appropriate theme object
  const currentTheme = isDark ? theme.dark : theme.light;

  // Load saved theme preference from storage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (savedTheme) {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference to storage
  const saveThemePreference = async (mode) => {
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, mode);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newMode = isDark ? "light" : "dark";
    setThemeMode(newMode);
    saveThemePreference(newMode);
  };

  // Set a specific theme mode
  const setTheme = (mode) => {
    if (["light", "dark", "system"].includes(mode)) {
      setThemeMode(mode);
      saveThemePreference(mode);
    }
  };

  // Create context value
  const contextValue = {
    theme: currentTheme,
    isDark,
    themeMode,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the theme
 * @returns {Object} Theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeProvider;
