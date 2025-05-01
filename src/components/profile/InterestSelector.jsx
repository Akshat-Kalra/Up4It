import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "../common/theme/ThemeProvider";
import InterestTag from "./InterestTag";

// Maximum number of interests a user can select
const MAX_INTERESTS = 8;

// Predefined interest categories
const INTEREST_CATEGORIES = [
  {
    title: "Sports",
    items: [
      "Basketball",
      "Soccer",
      "Tennis",
      "Volleyball",
      "Swimming",
      "Running",
      "Cycling",
      "Hiking",
      "Yoga",
      "Gym",
      "Baseball",
    ],
  },
  {
    title: "Academics",
    items: [
      "Study Group",
      "Research",
      "Library",
      "Science",
      "Math",
      "Literature",
      "Engineering",
      "Computer Science",
      "Business",
    ],
  },
  {
    title: "Entertainment",
    items: [
      "Movies",
      "Music",
      "Gaming",
      "Board Games",
      "Concerts",
      "Karaoke",
      "Trivia Night",
      "Comedy Shows",
      "Theatre",
    ],
  },
  {
    title: "Food & Drinks",
    items: [
      "Café Hopping",
      "Restaurants",
      "Cooking",
      "Baking",
      "Coffee",
      "Brunch",
      "Happy Hour",
      "Food Trucks",
      "Bubble Tea",
    ],
  },
  {
    title: "Arts & Culture",
    items: [
      "Museums",
      "Art Galleries",
      "Photography",
      "Drawing",
      "Painting",
      "Dancing",
      "Poetry",
      "Crafts",
      "Cultural Events",
    ],
  },
  {
    title: "Social",
    items: [
      "Campus Events",
      "Parties",
      "Volunteering",
      "Activism",
      "Networking",
      "Language Exchange",
      "Club Activities",
      "Student Government",
    ],
  },
];

/**
 * InterestSelector component
 * Allows selecting interests from predefined categories
 */
const InterestSelector = ({
  selectedInterests = [],
  onInterestsChange,
  maxInterests = MAX_INTERESTS,
  style,
}) => {
  const { theme } = useTheme();
  const [searchText, setSearchText] = useState("");

  // Toggle interest selection
  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      // Remove interest
      onInterestsChange(selectedInterests.filter((item) => item !== interest));
    } else {
      // Add interest if not at max
      if (selectedInterests.length < maxInterests) {
        onInterestsChange([...selectedInterests, interest]);
      }
    }
  };

  // Filter interests based on search
  const getFilteredCategories = () => {
    if (!searchText.trim()) {
      return INTEREST_CATEGORIES;
    }

    const searchLower = searchText.toLowerCase().trim();

    return INTEREST_CATEGORIES.map((category) => {
      const filteredItems = category.items.filter((item) =>
        item.toLowerCase().includes(searchLower)
      );

      // Only return categories that have matching items
      return filteredItems.length > 0
        ? { ...category, items: filteredItems }
        : null;
    }).filter(Boolean);
  };

  const filteredCategories = getFilteredCategories();

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Interests ({selectedInterests.length}/{maxInterests})
      </Text>

      <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>
        Select interests to help find activities you'll enjoy
      </Text>

      {/* Search input */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: theme.colors.neumorphicBackground },
        ]}
      >
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search interests..."
          placeholderTextColor={theme.colors.secondaryText}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Selected interests */}
      {selectedInterests.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Selected
          </Text>
          <View style={styles.tagsContainer}>
            {selectedInterests.map((interest, index) => (
              <InterestTag
                key={`selected-${index}`}
                label={interest}
                selected={true}
                onPress={() => toggleInterest(interest)}
                variant="primary"
              />
            ))}
          </View>
        </View>
      )}

      {/* Available interests by category */}
      <ScrollView
        style={styles.categoriesContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, catIndex) => (
            <View key={`category-${catIndex}`} style={styles.categoryContainer}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {category.title}
              </Text>
              <View style={styles.tagsContainer}>
                {category.items.map((interest, index) => (
                  <InterestTag
                    key={`${category.title}-${index}`}
                    label={interest}
                    selected={selectedInterests.includes(interest)}
                    onPress={() => toggleInterest(interest)}
                    variant="primary"
                    disabled={
                      !selectedInterests.includes(interest) &&
                      selectedInterests.length >= maxInterests
                    }
                  />
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={{ color: theme.colors.secondaryText }}>
              No matching interests found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  searchContainer: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
  },
  searchInput: {
    fontSize: 16,
  },
  selectedContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  categoriesContainer: {
    flex: 1,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
});

export default InterestSelector;
