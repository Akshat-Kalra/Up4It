import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../src/components/common/theme/ThemeProvider";
import GlassCard from "../../src/components/common/ui/GlassCard";
import GradientBackground from "../../src/components/common/ui/GradientBackground";
import NeumorphicButton from "../../src/components/common/ui/NeumorphicButton";

/**
 * Welcome screen for the Up4It app
 * First screen users see with app logo and sign-in/sign-up options
 */
export default function Welcome() {
  const router = useRouter();
  const { theme, isDark } = useTheme();

  return (
    <GradientBackground
      colors={isDark ? ["#1A202C", "#2D3748"] : ["#4F46E5", "#38B2AC"]}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: "white" }]}>Up4It</Text>
          <Text style={[styles.tagline, { color: "rgba(255, 255, 255, 0.9)" }]}>
            Spontaneous Friend Finder
          </Text>
        </View>

        <GlassCard style={styles.card}>
          <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
            Connect with university students for spontaneous activities
          </Text>

          <View style={styles.buttonContainer}>
            <NeumorphicButton
              label="Sign In"
              variant="primary"
              style={styles.button}
              onPress={() => router.push("/auth/login")}
            />

            <NeumorphicButton
              label="Create Account"
              variant="secondary"
              style={styles.button}
              onPress={() => router.push("/auth/register")}
            />
          </View>

          <Text
            style={[styles.termsText, { color: theme.colors.secondaryText }]}
          >
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </GlassCard>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  appName: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  card: {
    padding: 24,
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 32,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 24,
  },
  button: {
    marginVertical: 0,
  },
  termsText: {
    fontSize: 12,
    textAlign: "center",
  },
});
