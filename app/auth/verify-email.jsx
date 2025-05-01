import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../../src/components/common/theme/ThemeProvider";
import GlassCard from "../../src/components/common/ui/GlassCard";
import NeumorphicButton from "../../src/components/common/ui/NeumorphicButton";
import { auth } from "../../src/lib/appwrite";

/**
 * Email Verification screen for the Up4It app
 * Handles the email verification process after registration
 */
export default function VerifyEmail() {
  const router = useRouter();
  const { theme } = useTheme();
  const params = useLocalSearchParams();

  // Get verification parameters from URL
  const userId = params.userId;
  const secret = params.secret;

  // Component state
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  // Process verification when component mounts if params are present
  useEffect(() => {
    if (userId && secret) {
      verifyEmail();
    }
  }, [userId, secret]);

  // Verify email with Appwrite
  const verifyEmail = async () => {
    if (!userId || !secret) {
      setError("Invalid verification link. Please check your email again.");
      return;
    }

    setVerifying(true);

    try {
      await auth.verifyEmail(userId, secret);
      setVerified(true);
      setError("");
    } catch (err) {
      console.error("Verification error:", err);
      setError("Email verification failed. The link may have expired.");
    } finally {
      setVerifying(false);
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
          {verifying ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text
                style={[
                  styles.subtitle,
                  { color: theme.colors.text, marginTop: 24 },
                ]}
              >
                Verifying your email...
              </Text>
            </View>
          ) : verified ? (
            <>
              <Text style={[styles.title, { color: theme.colors.success }]}>
                Verification Successful!
              </Text>

              <Text
                style={[styles.subtitle, { color: theme.colors.secondaryText }]}
              >
                Your email has been verified. You can now sign in to your
                account.
              </Text>

              <NeumorphicButton
                label="Go to Login"
                onPress={() => router.replace("/auth/login")}
                style={styles.button}
              />
            </>
          ) : (
            <>
              <Text
                style={[
                  styles.title,
                  { color: error ? theme.colors.error : theme.colors.text },
                ]}
              >
                {error ? "Verification Failed" : "Verify Your Email"}
              </Text>

              <Text
                style={[styles.subtitle, { color: theme.colors.secondaryText }]}
              >
                {error
                  ? error
                  : userId && secret
                  ? "Processing your verification..."
                  : "Please check your email and click the verification link we sent you."}
              </Text>

              {!userId && !secret && !error && (
                <Text
                  style={[
                    styles.instructions,
                    { color: theme.colors.secondaryText },
                  ]}
                >
                  If you haven't received the email, please check your spam
                  folder or request a new verification email.
                </Text>
              )}

              {error && (
                <NeumorphicButton
                  label="Back to Login"
                  onPress={() => router.replace("/auth/login")}
                  style={styles.button}
                />
              )}
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
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  instructions: {
    fontSize: 14,
    marginBottom: 32,
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  button: {
    marginTop: 8,
  },
});
