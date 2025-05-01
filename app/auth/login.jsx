import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../src/components/common/theme/ThemeProvider";
import GlassCard from "../../src/components/common/ui/GlassCard";
import NeumorphicButton from "../../src/components/common/ui/NeumorphicButton";
import TextField from "../../src/components/common/ui/TextField";
import { auth } from "../../src/lib/appwrite";

/**
 * Login screen for the Up4It app
 * Handles user authentication with university email validation
 */
export default function Login() {
  const router = useRouter();
  const { theme } = useTheme();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    } else if (!auth.validateUniversityEmail(email)) {
      newErrors.email = "Please use your university email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login
  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await auth.login(email, password);
      router.replace("/");
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";

      if (error.message.includes("Invalid credentials")) {
        errorMessage = "Invalid email or password";
      } else if (error.message.includes("not verified")) {
        errorMessage = "Please verify your email before logging in";
      }

      Alert.alert("Login Error", errorMessage);
      console.error("Login error:", error);
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
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Welcome Back
          </Text>

          <Text
            style={[styles.subtitle, { color: theme.colors.secondaryText }]}
          >
            Sign in with your university email
          </Text>

          <View style={styles.form}>
            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="your.name@student.ubc.ca"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <TextField
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Your password"
              error={errors.password}
            />

            <TouchableOpacity
              onPress={() => router.push("/auth/forgot-password")}
              style={styles.forgotPassword}
            >
              <Text style={{ color: theme.colors.primary }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <NeumorphicButton
              label={isLoading ? "Signing In..." : "Sign In"}
              onPress={handleLogin}
              disabled={isLoading}
              style={styles.loginButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={{ color: theme.colors.secondaryText }}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/auth/register")}>
              <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
                {" Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 4,
    marginBottom: 24,
  },
  loginButton: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
