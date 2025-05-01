import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../src/components/common/theme/ThemeProvider";
import GlassCard from "../../../src/components/common/ui/GlassCard";
import NeumorphicButton from "../../../src/components/common/ui/NeumorphicButton";
import InterestTag from "../../../src/components/profile/InterestTag";
import { auth, profile } from "../../../src/lib/appwrite";

/**
 * ProfileScreen
 * Displays the user's profile information
 */
export default function ProfileScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  // State
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Load profile data
  useEffect(() => {
    loadProfile();
  }, []);

  // Load profile function
  const loadProfile = async () => {
    setLoading(true);

    try {
      // Check if user is logged in
      const user = await auth.getCurrentUser();

      if (!user) {
        // Redirect to login if not logged in
        router.replace("/auth/login");
        return;
      }

      // Get user profile
      const userProfile = await profile.getCurrentProfile();

      if (!userProfile) {
        // Redirect to profile creation if no profile exists
        router.replace("/profile/create");
        return;
      }

      setProfileData(userProfile);

      // Set initial photo to primary photo if it exists
      if (userProfile.photoUrls && userProfile.photoUrls.length > 0) {
        setCurrentPhotoIndex(userProfile.primaryPhotoIndex || 0);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await auth.logout();
      router.replace("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  // Handle edit profile
  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  // Navigate to next photo
  const handleNextPhoto = () => {
    if (profileData?.photoUrls?.length > 0) {
      setCurrentPhotoIndex(
        (currentPhotoIndex + 1) % profileData.photoUrls.length
      );
    }
  };

  // Navigate to previous photo
  const handlePrevPhoto = () => {
    if (profileData?.photoUrls?.length > 0) {
      setCurrentPhotoIndex(
        (currentPhotoIndex - 1 + profileData.photoUrls.length) %
          profileData.photoUrls.length
      );
    }
  };

  // Show loading state
  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading profile...
        </Text>
      </View>
    );
  }

  // If we have profile data, show profile
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header section */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Your Profile
          </Text>

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Profile content */}
        <GlassCard style={styles.profileCard}>
          {/* Profile photos */}
          {profileData?.photoUrls?.length > 0 ? (
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: profileData.photoUrls[currentPhotoIndex] }}
                style={styles.profilePhoto}
                resizeMode="cover"
              />

              {/* Photo navigation */}
              {profileData.photoUrls.length > 1 && (
                <View style={styles.photoNavigation}>
                  <TouchableOpacity
                    style={styles.photoNavButton}
                    onPress={handlePrevPhoto}
                  >
                    <MaterialIcons
                      name="chevron-left"
                      size={32}
                      color="white"
                    />
                  </TouchableOpacity>

                  <Text style={styles.photoCounter}>
                    {currentPhotoIndex + 1}/{profileData.photoUrls.length}
                  </Text>

                  <TouchableOpacity
                    style={styles.photoNavButton}
                    onPress={handleNextPhoto}
                  >
                    <MaterialIcons
                      name="chevron-right"
                      size={32}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View
              style={[
                styles.profilePhoto,
                styles.photoPlaceholder,
                { backgroundColor: theme.colors.neumorphicBackground },
              ]}
            >
              <MaterialIcons
                name="person"
                size={80}
                color={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}
              />
              <Text
                style={[
                  styles.photoPlaceholderText,
                  { color: theme.colors.secondaryText },
                ]}
              >
                No photos added
              </Text>
            </View>
          )}

          {/* Profile info */}
          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: theme.colors.text }]}>
              {profileData?.name || "Anonymous"}
            </Text>

            <Text style={[styles.bio, { color: theme.colors.secondaryText }]}>
              {profileData?.bio || "No bio available"}
            </Text>
          </View>

          {/* Interests */}
          {profileData?.interests?.length > 0 && (
            <View style={styles.interestsContainer}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Interests
              </Text>

              <View style={styles.interestTags}>
                {profileData.interests.map((interest, index) => (
                  <InterestTag
                    key={`interest-${index}`}
                    label={interest}
                    variant="primary"
                  />
                ))}
              </View>
            </View>
          )}

          {/* Edit button */}
          <NeumorphicButton
            label="Edit Profile"
            onPress={handleEditProfile}
            style={styles.editButton}
            icon={
              <MaterialIcons
                name="edit"
                size={18}
                color={theme.colors.buttonText}
              />
            }
          />
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 8,
  },
  profileCard: {
    padding: 0,
    overflow: "hidden",
  },
  photoContainer: {
    position: "relative",
    width: "100%",
    height: 300,
  },
  profilePhoto: {
    width: "100%",
    height: 300,
  },
  photoPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  photoPlaceholderText: {
    marginTop: 16,
    fontSize: 16,
  },
  photoNavigation: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingVertical: 8,
  },
  photoNavButton: {
    padding: 8,
  },
  photoCounter: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  profileInfo: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
  },
  interestsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  interestTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  editButton: {
    margin: 20,
    marginTop: 10,
  },
});
