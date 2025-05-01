import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../../src/components/common/theme/ThemeProvider";
import GlassCard from "../../src/components/common/ui/GlassCard";
import NeumorphicButton from "../../src/components/common/ui/NeumorphicButton";
import TextField from "../../src/components/common/ui/TextField";
import { auth } from "../../src/lib/appwrite";

/**
 * Forgot Password screen for the Up4It app
 * Allows users to request a password reset email
 */
export default function ForgotPassword() {
  const router = useRouter();
  const { theme } = useTheme();

  // Form state
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validate email
  const validateEmail = () => {
    if (!email) {
      setError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return false;
    } else if (!auth.validateUniversityEmail(email)) {
      setError("Please use your university email");
      return false;
    }

    setError("");
    return true;
  };

  // Handle reset password request
  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);

    try {
      await auth.resetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      let errorMessage = "Failed to send reset email. Please try again.";

      if (error.message.includes("not found")) {
        errorMessage = "Email not found. Please check your email address.";
      }

      Alert.alert("Reset Error", errorMessage);
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <GlassCard style={styles.card}>
          {!isSubmitted ? (
            <>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Reset Password
              </Text>

              <Text
                style={[styles.subtitle, { color: theme.colors.secondaryText }]}
              >
                Enter your email address and we'll send you a link to reset your
                password
              </Text>

              <View style={styles.form}>
                <TextField
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your.name@student.ubc.ca"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={error}
                />

                <NeumorphicButton
                  label={isLoading ? "Sending..." : "Send Reset Link"}
                  onPress={handleResetPassword}
                  disabled={isLoading}
                  style={styles.submitButton}
                />

                <NeumorphicButton
                  label="Back to Login"
                  variant="secondary"
                  onPress={() => router.back()}
                  style={styles.backButton}
                />
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.title, { color: theme.colors.success }]}>
                Email Sent!
              </Text>

              <Text
                style={[styles.subtitle, { color: theme.colors.secondaryText }]}
              >
                We've sent a password reset link to {email}. Please check your
                email to continue.
              </Text>

              <View style={styles.form}>
                <NeumorphicButton
                  label="Back to Login"
                  onPress={() => router.replace("/auth/login")}
                  style={styles.backButton}
                />
              </View>
            </>
          )}
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
  },
  form: {
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 16,
  },
  backButton: {
    marginBottom: 0,
  },
});
