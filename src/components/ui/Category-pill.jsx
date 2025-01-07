import React from "react";
import { Pressable, Text, StyleSheet, Animated } from "react-native";
import { COLORS, SPACING } from "../../constants/theme";
import { Feather } from "@expo/vector-icons";

export default function CategoryPill({ icon, label, isSelected, onPress }) {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
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
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.container,
          isSelected && styles.selected,
          { transform: [{ scale }] },
        ]}
      >
        <Feather
          name={icon}
          size={20}
          color={isSelected ? COLORS.white : COLORS.text}
        />
        <Text style={[styles.label, isSelected && styles.selectedLabel]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  label: {
    marginLeft: SPACING.xs,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  selectedLabel: {
    color: COLORS.white,
  },
});
