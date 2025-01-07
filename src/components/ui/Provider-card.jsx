import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, SPACING } from "../../constants/theme";

export default function ProviderCard({ provider, onPress }) {
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
    <Pressable
      onPress={() => {
        if (onPress) {
          onPress(provider.id); // Appelle la fonction onPress avec l'ID du fournisseur
        }
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      android_ripple={{ color: "rgba(0,0,0,0.1)" }}
    >
      <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
        <Image
          source={{ uri: provider.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{provider.name}</Text>
            <View style={styles.ratingContainer}>
              <Feather name="star" size={16} color={COLORS.primary} />
              <Text style={styles.rating}>{provider.rating}</Text>
              <Text style={styles.reviews}>({provider.reviews})</Text>
            </View>
          </View>

          <View style={styles.services}>
            {provider.services.map((service, index) => (
              <View key={index} style={styles.serviceTag}>
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <View style={styles.availability}>
              <Feather name="clock" size={14} color={COLORS.success} />
              <Text style={styles.availabilityText}>
                {provider.availability}
              </Text>
            </View>
            <View style={styles.distance}>
              <Feather name="map-pin" size={14} color={COLORS.textLight} />
              <Text style={styles.distanceText}>
                {provider.distance || "2.5 km"}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: SPACING.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  reviews: {
    marginLeft: 2,
    fontSize: 14,
    color: COLORS.textLight,
  },
  services: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: SPACING.sm,
  },
  serviceTag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  serviceText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.xs,
  },
  availability: {
    flexDirection: "row",
    alignItems: "center",
  },
  availabilityText: {
    marginLeft: 4,
    fontSize: 14,
    color: COLORS.success,
    fontWeight: "500",
  },
  distance: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    marginLeft: 4,
    fontSize: 14,
    color: COLORS.textLight,
  },
});
