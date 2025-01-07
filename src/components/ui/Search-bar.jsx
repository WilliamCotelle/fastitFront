import React from "react";
import { View, TextInput, StyleSheet, Pressable, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, SPACING } from "../../constants/theme";

export default function SearchBar({ onSearch, onLocationPress }) {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
      <Pressable
        style={styles.searchContainer}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Feather
          name="search"
          size={20}
          color={COLORS.textLight}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Quel service recherchez-vous ?"
          placeholderTextColor={COLORS.textLight}
          onChangeText={onSearch}
        />
      </Pressable>
      <Pressable
        onPress={onLocationPress}
        style={styles.locationButton}
        android_ripple={{ color: "rgba(0,0,0,0.1)" }}
      >
        <Feather name="map-pin" size={20} color={COLORS.primary} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.md,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    height: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  locationButton: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
});
