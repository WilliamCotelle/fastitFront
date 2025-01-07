import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Animated,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Layout from "../components/ui/Layout";
import SearchBar from "../components/ui/Search-bar";
import ProviderCard from "../components/ui/Provider-card";
import { COLORS, SPACING, TYPOGRAPHY, EFFECTS } from "../constants/theme";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import data from "../../data/providers.json";

const CATEGORIES = [
  { id: "all", icon: "home", label: "Tout" },
  { id: "electricity", icon: "zap", label: "Électricité" },
  { id: "handcraft", icon: "tool", label: "Bricolage" },
  { id: "plumbing", icon: "droplet", label: "Plomberie" },
  { id: "cleaning", icon: "sun", label: "Nettoyage" },
  { id: "painting", icon: "grid", label: "Peinture" },
  { id: "gardening", icon: "grid", label: "Jardinage" },
  { id: "construction", icon: "tool", label: "Construction" },
  { id: "delivery", icon: "truck", label: "Livraison" },
  { id: "cooking", icon: "coffee", label: "Cuisine" },
  { id: "education", icon: "book", label: "Éducation" },
  { id: "health", icon: "heart", label: "Santé" },
  { id: "repair", icon: "settings", label: "Réparations" },
  { id: "transport", icon: "map", label: "Transport" },
];

const HEADER_MAX_HEIGHT = 90;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const headerContentOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const searchBarTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE / 2],
    extrapolate: "clamp",
  });

  return (
    <Layout style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Animated.View
        style={{
          height: 150,
          backgroundColor: COLORS.background,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
          justifyContent: "flex-end",
          paddingHorizontal: SPACING.md,
          ...EFFECTS.softShadow,
        }}
      >
        <Animated.View
          style={{
            opacity: headerContentOpacity,
            marginBottom: 5, // Réduction ici
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: SPACING.xs, // Réduction de l'espace
            }}
          >
            <View>
              <Text
                style={{
                  color: COLORS.textLight,
                  fontSize: TYPOGRAPHY.caption.fontSize,
                  fontWeight: TYPOGRAPHY.caption.fontWeight,
                }}
              >
                Ma localisation
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Feather name="map-pin" size={16} color={COLORS.primary} />
                <Text
                  style={{
                    color: COLORS.text,
                    marginLeft: 5,
                    fontSize: TYPOGRAPHY.body.fontSize,
                    fontWeight: TYPOGRAPHY.body.fontWeight,
                  }}
                >
                  Paris, FR
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Notifications")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: COLORS.white,
                justifyContent: "center",
                alignItems: "center",
                ...EFFECTS.softShadow,
              }}
            >
              <Feather name="bell" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View
          style={{
            transform: [{ translateY: searchBarTranslateY }],
          }}
        >
          <SearchBar
            placeholder="Quel service recherchez-vous ?"
            onSearch={() => {}}
          />
        </Animated.View>
      </Animated.View>

      {/* Content */}
      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: HEADER_MAX_HEIGHT - 20, // Ajustement ici pour rapprocher les filtres
          paddingBottom: SPACING.xl,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            flexDirection: "row",
            paddingHorizontal: SPACING.md,
            paddingVertical: 5, // Suppression de l'espace vertical
          }}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={{
                alignItems: "center",
                marginRight: SPACING.md,
              }}
            >
              <Feather
                name={category.icon}
                size={24}
                color={
                  selectedCategory === category.id
                    ? COLORS.primary
                    : COLORS.textLight
                }
              />
              <Text
                style={{
                  color:
                    selectedCategory === category.id
                      ? COLORS.primary
                      : COLORS.textLight,
                  fontSize: TYPOGRAPHY.caption.fontSize,
                  marginTop: 5,
                }}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Providers */}
        <View style={{ paddingHorizontal: SPACING.md }}>
          <Text
            style={{
              fontSize: TYPOGRAPHY.h3.fontSize,
              fontWeight: TYPOGRAPHY.h3.fontWeight,
              color: COLORS.text,
              marginBottom: SPACING.sm,
            }}
          >
            À proximité
          </Text>
          {data.providers?.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onPress={() => navigation.navigate("ServiceDetail", { provider })}
            />
          ))}
        </View>
      </Animated.ScrollView>
    </Layout>
  );
}
