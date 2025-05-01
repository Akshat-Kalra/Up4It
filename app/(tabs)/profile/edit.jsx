import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../../../src/components/common/theme/ThemeProvider";
import GlassCard from "../../../src/components/common/ui/GlassCard";
import NeumorphicButton from "../../../src/components/common/ui/NeumorphicButton";
import TextField from "../../../src/components/common/ui/TextField";
import InterestSelector from "../../../src/components/profile/InterestSelector";
import PhotoSelector from "../../../src/components/profile/PhotoSelector";
import { auth, profile } from "../../../src/lib/appwrite";

/**
 * ProfileEditScreen
 * Allows users to edit their existing profile
 */
export default function ProfileEditScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  // Profile state
  const [profileData, setProfileData] = useState(null);
  const [profileId, setProfileId] = useState(null);

  // Form state
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photos, setPhotos] = useState([]);
  const [primaryPhotoIndex, setPrimaryPhotoIndex] = useState(0);
  const [interests, setInterests] = useState([]);
  const [originalPhotoUrls, setOriginalPhotoUrls] = useState([]);

  // Form validation errors
  const [errors, setErrors] = useState({});

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [currentStep, setCurrentStep] = useState(1); // 1: Basic Info, 2: Photos, 3: Interests

  // Load profile data on mount
  useEffect(() => {
    loadProfileData();
  }, []);

  // Load existing profile data
  const loadProfileData = async () => {
    setLoadingProfile(true);

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

      // Set profile data
      setProfileData(userProfile);
      setProfileId(userProfile.$id);

      // Set form values
      setName(userProfile.name || "");
      setBio(userProfile.bio || "");
      setInterests(userProfile.interests || []);

      if (userProfile.photoUrls?.length > 0) {
        setPhotos(userProfile.photoUrls);
        setOriginalPhotoUrls(userProfile.photoUrls);
        setPrimaryPhotoIndex(userProfile.primaryPhotoIndex || 0);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile. Please try again.");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Validate the current step
  const validateStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 1:
        // Basic info validation
        if (!name.trim()) {
          newErrors.name = "Name is required";
        }

        if (!bio.trim()) {
          newErrors.bio = "Please write a short bio";
        } else if (bio.length < 10) {
          newErrors.bio = "Bio must be at least 10 characters";
        } else if (bio.length > 150) {
          newErrors.bio = "Bio must be less than 150 characters";
        }
        break;

      case 2:
        // Photo validation
        if (photos.length === 0) {
          newErrors.photos = "Please add at least one photo";
        }
        break;

      case 3:
        // Interest validation
        if (interests.length === 0) {
          newErrors.interests = "Please select at least one interest";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Find which photos were removed
  const getRemovedPhotos = () => {
    return originalPhotoUrls.filter((url) => !photos.includes(url));
  };

  // Find which photos were added
  const getNewPhotos = () => {
    return photos.filter((url) => !originalPhotoUrls.includes(url));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsLoading(true);

    try {
      // Find which photos were removed and delete them
      const removedPhotos = getRemovedPhotos();

      for (const photoUrl of removedPhotos) {
        await profile.deleteProfilePhoto(photoUrl);
      }

      // Upload new photos
      const newPhotoUris = getNewPhotos();
      const updatedPhotos = [
        ...photos.filter((url) => originalPhotoUrls.includes(url)),
      ];

      for (const photoUri of newPhotoUris) {
        try {
          // Get file from URI
          const response = await fetch(photoUri);
          const blob = await response.blob();

          // Ensure blob has proper file properties
          const fileType = blob.type || "image/jpeg";
          const fileName = `profile_${Date.now()}.${
            fileType.split("/")[1] || "jpg"
          }`;
          const file = new File([blob], fileName, { type: fileType });

          // Upload to Appwrite
          const fileUrl = await profile.uploadProfilePhoto(file);
          updatedPhotos.push(fileUrl);
        } catch (error) {
          console.error("Error uploading photo:", error);
          Alert.alert(
            "Upload Error",
            "Failed to upload one of your photos. Try again or select a different image."
          );
        }
      }

      // Adjust primary photo index if needed
      let newPrimaryIndex = primaryPhotoIndex;
      if (updatedPhotos.length > 0 && newPrimaryIndex >= updatedPhotos.length) {
        newPrimaryIndex = 0;
      }

      // Update profile
      await profile.updateProfile(profileId, {
        name,
        bio,
        interests,
        photoUrls: updatedPhotos,
        primaryPhotoIndex: newPrimaryIndex,
      });

      Alert.alert("Success", "Your profile has been updated!", [
        {
          text: "OK",
          onPress: () => router.replace("/profile"),
        },
      ]);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile deletion
  const handleDeleteProfile = () => {
    Alert.alert(
      "Delete Profile",
      "Are you sure you want to delete your profile? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDeleteProfile,
        },
      ]
    );
  };

  // Confirm and execute profile deletion
  const confirmDeleteProfile = async () => {
    setIsLoading(true);

    try {
      await profile.deleteProfile();
      Alert.alert("Success", "Your profile has been deleted.", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)"),
        },
      ]);
    } catch (error) {
      console.error("Error deleting profile:", error);
      Alert.alert("Error", `Failed to delete your profile: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (loadingProfile) {
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Edit Profile
          </Text>
          <Text style={[styles.stepIndicator, { color: theme.colors.primary }]}>
            Step {currentStep} of 3
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <GlassCard style={styles.card}>
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <View style={styles.stepContainer}>
                <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
                  Basic Information
                </Text>

                <TextField
                  label="Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Your full name"
                  error={errors.name}
                  style={styles.input}
                />

                <TextField
                  label="Bio"
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Write a short bio about yourself"
                  error={errors.bio}
                  style={styles.input}
                  maxLength={150}
                  multiline
                />

                <Text
                  style={[
                    styles.characterCount,
                    { color: theme.colors.secondaryText },
                  ]}
                >
                  {bio.length}/150 characters
                </Text>
              </View>
            )}

            {/* Step 2: Photos */}
            {currentStep === 2 && (
              <View style={styles.stepContainer}>
                <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
                  Profile Photos
                </Text>

                <Text
                  style={[
                    styles.stepDescription,
                    { color: theme.colors.secondaryText },
                  ]}
                >
                  Add up to 5 photos to showcase yourself. Your first photo will
                  be your main profile picture.
                </Text>

                <PhotoSelector
                  photos={photos}
                  onPhotosChange={setPhotos}
                  primaryPhotoIndex={primaryPhotoIndex}
                  onPrimaryPhotoChange={setPrimaryPhotoIndex}
                  style={styles.photoSelector}
                />

                {errors.photos && (
                  <Text
                    style={[styles.errorText, { color: theme.colors.error }]}
                  >
                    {errors.photos}
                  </Text>
                )}
              </View>
            )}

            {/* Step 3: Interests */}
            {currentStep === 3 && (
              <View style={styles.stepContainer}>
                <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
                  Your Interests
                </Text>

                <Text
                  style={[
                    styles.stepDescription,
                    { color: theme.colors.secondaryText },
                  ]}
                >
                  Select interests to help us match you with activities and
                  people.
                </Text>

                <InterestSelector
                  selectedInterests={interests}
                  onInterestsChange={setInterests}
                  style={styles.interestSelector}
                />

                {errors.interests && (
                  <Text
                    style={[styles.errorText, { color: theme.colors.error }]}
                  >
                    {errors.interests}
                  </Text>
                )}
              </View>
            )}

            {/* Navigation buttons */}
            <View style={styles.buttonsContainer}>
              {currentStep > 1 && (
                <NeumorphicButton
                  label="Back"
                  variant="secondary"
                  onPress={handlePrevStep}
                  style={styles.button}
                  disabled={isLoading}
                />
              )}

              {currentStep < 3 ? (
                <NeumorphicButton
                  label="Continue"
                  onPress={handleNextStep}
                  style={[
                    styles.button,
                    currentStep === 1 && styles.fullWidthButton,
                  ]}
                />
              ) : (
                <NeumorphicButton
                  label={isLoading ? "Updating..." : "Update Profile"}
                  onPress={handleSubmit}
                  style={styles.button}
                  disabled={isLoading}
                />
              )}
            </View>
          </GlassCard>
        </ScrollView>

        {/* Delete Profile Button */}
        <View style={styles.deleteContainer}>
          <NeumorphicButton
            label="Delete Profile"
            variant="danger"
            onPress={handleDeleteProfile}
            style={styles.deleteButton}
            disabled={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  stepIndicator: {
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    padding: 20,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 14,
    marginBottom: 20,
  },
  input: {
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 12,
    textAlign: "right",
    marginBottom: 16,
  },
  photoSelector: {
    marginBottom: 16,
  },
  interestSelector: {
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
  },
  fullWidthButton: {
    flex: 1,
    marginHorizontal: 0,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
  },
  deleteContainer: {
    padding: 20,
    paddingTop: 0,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "#ff4c4c",
    marginHorizontal: 0,
  },
});
