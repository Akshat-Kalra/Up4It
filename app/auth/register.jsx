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
 * Registration screen for the Up4It app
 * Handles user registration with university email validation
 */
export default function Register() {
  const router = useRouter();
  const { theme } = useTheme();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    } else if (!auth.validateUniversityEmail(email)) {
      newErrors.email =
        "Please use your university email (@student.ubc.ca or @alumni.ubc.ca)";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and numbers";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle registration
  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await auth.createAccount(email, password, name);

      Alert.alert(
        "Registration Successful",
        "Please check your email to verify your account before logging in.",
        [
          {
            text: "Go to Login",
            onPress: () => router.replace("/auth/login"),
          },
        ]
      );
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";

      if (error.message.includes("already exists")) {
        errorMessage = "This email is already registered";
      }

      Alert.alert("Registration Error", errorMessage);
      console.error("Registration error:", error);
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
            Create Account
          </Text>

          <Text
            style={[styles.subtitle, { color: theme.colors.secondaryText }]}
          >
            Sign up with your university email
          </Text>

          <View style={styles.form}>
            <TextField
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              autoCapitalize="words"
              error={errors.name}
            />

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
              placeholder="Create a strong password"
              error={errors.password}
            />

            <TextField
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Repeat your password"
              error={errors.confirmPassword}
            />

            <NeumorphicButton
              label={isLoading ? "Creating Account..." : "Create Account"}
              onPress={handleRegister}
              disabled={isLoading}
              style={styles.registerButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={{ color: theme.colors.secondaryText }}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/auth/login")}>
              <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
                {" Sign In"}
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
  registerButton: {
    marginTop: 16,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
