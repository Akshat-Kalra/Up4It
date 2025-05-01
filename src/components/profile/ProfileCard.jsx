import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../common/theme/ThemeProvider";
import GlassCard from "../common/ui/GlassCard";

/**
 * ProfileCard component
 * Displays user profile information in a glass card layout
 */
const ProfileCard = ({
  user,
  profileImage,
  interests = [],
  onPress,
  style,
}) => {
  const { theme } = useTheme();

  // Extract user data or use placeholder
  const name = user?.name || "Anonymous";
  const bio = user?.bio || "No bio yet";

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <GlassCard
          style={[
            styles.card,
            style,
            { transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.imageContainer}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View
                  style={[
                    styles.profileImage,
                    styles.placeholderImage,
                    { backgroundColor: theme.colors.neumorphicBackground },
                  ]}
                >
                  <Text
                    style={[
                      styles.placeholderText,
                      { color: theme.colors.text },
                    ]}
                  >
                    {name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.headerContent}>
              <Text
                style={[styles.name, { color: theme.colors.text }]}
                numberOfLines={1}
              >
                {name}
              </Text>
              <Text
                style={[styles.bio, { color: theme.colors.secondaryText }]}
                numberOfLines={2}
              >
                {bio}
              </Text>
            </View>
          </View>

          {interests.length > 0 && (
            <View style={styles.interestsContainer}>
              {interests.slice(0, 3).map((interest, index) => (
                <View
                  key={`interest-${index}`}
                  style={[
                    styles.interestTag,
                    { backgroundColor: theme.colors.primaryTransparent },
                  ]}
                >
                  <Text
                    style={[
                      styles.interestText,
                      { color: theme.colors.primary },
                    ]}
                  >
                    {interest}
                  </Text>
                </View>
              ))}

              {interests.length > 3 && (
                <View
                  style={[
                    styles.interestTag,
                    { backgroundColor: theme.colors.secondaryTransparent },
                  ]}
                >
                  <Text
                    style={[
                      styles.interestText,
                      { color: theme.colors.secondary },
                    ]}
                  >
                    +{interests.length - 3}
                  </Text>
                </View>
              )}
            </View>
          )}
        </GlassCard>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  placeholderImage: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default ProfileCard;
