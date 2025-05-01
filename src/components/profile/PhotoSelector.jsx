import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../common/theme/ThemeProvider";

const MAX_PHOTOS = 5;

/**
 * PhotoSelector component
 * Allows selecting, displaying, and managing multiple profile photos
 */
const PhotoSelector = ({
  photos = [],
  onPhotosChange,
  primaryPhotoIndex = 0,
  onPrimaryPhotoChange,
  maxPhotos = MAX_PHOTOS,
  style,
}) => {
  const { theme, isDark } = useTheme();
  const [loading, setLoading] = useState(false);

  // Request permissions and open image picker
  const handleSelectPhoto = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert(
        "Maximum Photos Reached",
        `You can only upload up to ${maxPhotos} photos. Please delete some photos before adding more.`,
        [{ text: "OK" }]
      );
      return;
    }

    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library to select images.",
        [{ text: "OK" }]
      );
      return;
    }

    setLoading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPhoto = result.assets[0].uri;
        onPhotosChange([...photos, newPhoto]);
      }
    } catch (error) {
      console.error("Error selecting photo:", error);
      Alert.alert("Error", "Failed to select photo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle making a photo the primary one
  const handleSetPrimary = (index) => {
    if (index !== primaryPhotoIndex) {
      onPrimaryPhotoChange(index);
    }
  };

  // Handle removing a photo
  const handleRemovePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);

    let newPrimaryIndex = primaryPhotoIndex;

    // If we removed the primary photo, set the first remaining photo as primary
    if (index === primaryPhotoIndex) {
      newPrimaryIndex = newPhotos.length > 0 ? 0 : -1;
    }
    // If we removed a photo before the primary, adjust the index
    else if (index < primaryPhotoIndex) {
      newPrimaryIndex--;
    }

    onPhotosChange(newPhotos);
    onPrimaryPhotoChange(newPrimaryIndex);
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Profile Photos ({photos.length}/{maxPhotos})
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.photosContainer}
      >
        {/* Photo items */}
        {photos.map((photo, index) => (
          <View
            key={`photo-${index}`}
            style={[
              styles.photoItem,
              index === primaryPhotoIndex && {
                borderColor: theme.colors.primary,
                borderWidth: 2,
              },
            ]}
          >
            <Image source={{ uri: photo }} style={styles.photo} />

            <View style={styles.photoActions}>
              {index !== primaryPhotoIndex && (
                <TouchableOpacity
                  style={[
                    styles.photoAction,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={() => handleSetPrimary(index)}
                >
                  <MaterialIcons name="star" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.photoAction,
                  { backgroundColor: theme.colors.error },
                ]}
                onPress={() => handleRemovePhoto(index)}
              >
                <MaterialIcons name="delete" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {index === primaryPhotoIndex && (
              <View
                style={[
                  styles.primaryBadge,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <Text style={styles.primaryText}>Primary</Text>
              </View>
            )}
          </View>
        ))}

        {/* Add photo button */}
        {photos.length < maxPhotos && (
          <TouchableOpacity
            style={[
              styles.addPhotoButton,
              {
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
                borderColor: isDark
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(0, 0, 0, 0.1)",
              },
            ]}
            onPress={handleSelectPhoto}
            disabled={loading}
          >
            <MaterialIcons
              name="add-photo-alternate"
              size={30}
              color={isDark ? "#FFFFFF" : "#000000"}
              style={{ opacity: 0.6 }}
            />
            <Text
              style={[
                styles.addPhotoText,
                { color: theme.colors.secondaryText },
              ]}
            >
              {loading ? "Loading..." : "Add Photo"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Text style={[styles.hint, { color: theme.colors.secondaryText }]}>
        Tap on ⭐ to set a photo as your primary profile photo.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  photosContainer: {
    paddingVertical: 8,
  },
  photoItem: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  photoActions: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "column",
    gap: 6,
  },
  photoAction: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  addPhotoButton: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addPhotoText: {
    fontSize: 12,
    marginTop: 4,
  },
  hint: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: "italic",
  },
});

export default PhotoSelector;
