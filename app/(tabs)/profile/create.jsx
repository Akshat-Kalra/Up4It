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
 * ProfileCreationScreen
 * Allows users to create their profile with photos, bio, and interests
 */
export default function ProfileCreationScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  // Profile form state
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photos, setPhotos] = useState([]);
  const [primaryPhotoIndex, setPrimaryPhotoIndex] = useState(0);
  const [interests, setInterests] = useState([]);

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Basic Info, 2: Photos, 3: Interests
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch user data on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await auth.getCurrentUser();

        if (!user) {
          // If not logged in, redirect to login
          router.replace("/auth/login");
          return;
        }

        // Check if user already has a profile
        const existingProfile = await profile.getCurrentProfile();
        if (existingProfile) {
          // If already has profile, redirect to profile view
          router.replace("/profile");
          return;
        }

        // Pre-fill name from user account if available
        if (user.name) {
          setName(user.name);
        }

        setLoadingUser(false);
      } catch (error) {
        console.error("Error loading user:", error);
        setLoadingUser(false);
      }
    };

    checkUser();
  }, []);

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

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsLoading(true);

    try {
      // Upload photos first if there are any
      const photoUrls = [];
      let uploadErrors = [];

      // First do a test log to see what photos we're working with
      console.log("Starting photo upload process with photos:", photos);

      // Process each photo
      for (let i = 0; i < photos.length; i++) {
        const photoUri = photos[i];
        try {
          console.log(
            `Processing photo ${i + 1}/${photos.length}: ${photoUri}`
          );

          // Get file from URI
          const response = await fetch(photoUri);
          const blob = await response.blob();

          // Determine the correct file extension based on the MIME type
          let extension = "jpg"; // Default
          if (blob.type) {
            const mimeToExt = {
              "image/jpeg": "jpg",
              "image/jpg": "jpg",
              "image/png": "png",
              "image/gif": "gif",
              "image/webp": "webp",
            };
            extension = mimeToExt[blob.type] || "jpg";
          }

          // Create a unique filename with timestamp and index
          const filename = `profile_photo_${Date.now()}_${i}.${extension}`;

          // Debug log
          console.log(
            `Preparing to upload file: ${filename}, type: ${
              blob.type || "image/jpeg"
            }, size: ${blob.size}`
          );

          // Create a new File instance with the proper name and type
          const file = new File([blob], filename, {
            type: blob.type || "image/jpeg",
          });

          // Verify the file object is valid
          console.log(
            `Created File object: name=${file.name}, type=${file.type}, size=${file.size}`
          );

          // Upload to Appwrite
          console.log(
            `Uploading file ${i + 1}/${photos.length} to Appwrite...`
          );
          const fileUrl = await profile.uploadProfilePhoto(file);
          console.log(
            `File ${i + 1}/${photos.length} uploaded successfully, URL:`,
            fileUrl
          );

          // Add the URL to our array
          photoUrls.push(fileUrl);
          console.log(
            `Added URL to photoUrls array. Current count: ${photoUrls.length}`
          );
        } catch (uploadError) {
          console.error(
            `Error uploading photo ${i + 1}/${photos.length}:`,
            uploadError
          );
          uploadErrors.push(uploadError.message);
          // Continue with other photos
        }
      }

      // Check if we have any valid photo URLs
      console.log(`Final photoUrls array:`, photoUrls);
      if (photos.length > 0 && photoUrls.length === 0) {
        throw new Error(
          `No photos could be uploaded. Errors: ${uploadErrors.join("; ")}`
        );
      }

      // Create profile with available photos, even if some failed to upload
      const profileData = {
        name,
        bio,
        interests,
        photoUrls,
        primaryPhotoIndex:
          photoUrls.length > 0
            ? Math.min(primaryPhotoIndex, photoUrls.length - 1)
            : 0,
      };

      console.log(
        "Creating profile with data:",
        JSON.stringify(profileData, null, 2)
      );

      // Create profile
      const createdProfile = await profile.createProfile(profileData);
      console.log("Profile created successfully:", createdProfile.$id);

      // If some photos failed to upload but others succeeded, show a warning
      if (photos.length > photoUrls.length && photoUrls.length > 0) {
        Alert.alert(
          "Profile Created",
          `Your profile was created, but ${
            photos.length - photoUrls.length
          } of ${
            photos.length
          } photos failed to upload. You can add more photos later.`,
          [
            {
              text: "OK",
              onPress: () => {
                console.log("Redirecting to profile page");
                router.replace("/(tabs)/profile");
              },
            },
          ]
        );
      } else {
        // All photos uploaded successfully
        Alert.alert("Success", "Your profile has been created!", [
          {
            text: "OK",
            onPress: () => {
              console.log("Redirecting to profile page");
              router.replace("/(tabs)/profile");
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      Alert.alert(
        "Error",
        `Failed to create profile: ${error.message || "Please try again."}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (loadingUser) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading...
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
            Create Your Profile
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
                  label={isLoading ? "Creating Profile..." : "Create Profile"}
                  onPress={handleSubmit}
                  style={styles.button}
                  disabled={isLoading}
                />
              )}
            </View>
          </GlassCard>
        </ScrollView>
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
});
