import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { COLORS, SPACING, TYPOGRAPHY, EFFECTS } from "../constants/theme";
import Layout from "../components/ui/Layout";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const STATS = [
  { label: "Réservations", value: "28" },
  { label: "Favoris", value: "12" },
  { label: "Avis", value: "15" },
];

const MENU_ITEMS = [
  {
    id: "appointments",
    icon: "calendar",
    title: "Mes réservations",
    subtitle: "Gérez vos rendez-vous",
    color: "#FF6B6B",
  },
  {
    id: "favorites",
    icon: "heart",
    title: "Mes favoris",
    subtitle: "Prestataires enregistrés",
    color: "#4ECDC4",
  },
  {
    id: "payments",
    icon: "credit-card",
    title: "Paiements",
    subtitle: "Historique et méthodes",
    color: "#45B7D1",
  },
  {
    id: "settings",
    icon: "settings",
    title: "Paramètres",
    subtitle: "Préférences du compte",
    color: "#96CEB4",
  },
  {
    id: "help",
    icon: "help-circle",
    title: "Aide",
    subtitle: "Centre d'assistance",
    color: "#D4A5A5",
  },
];

export default function ProfileScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState("upcoming");

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [300, 200],
    extrapolate: "clamp",
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [1.2, 1, 0.8],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const renderMenuItem = ({ id, icon, title, subtitle, color }) => (
    <Pressable
      key={id}
      style={({ pressed }) => [
        styles.menuItem,
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
      android_ripple={{ color: "rgba(0,0,0,0.1)" }}
    >
      <LinearGradient
        colors={[color, color + "80"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.menuIcon}
      >
        <Feather name={icon} size={22} color="white" />
      </LinearGradient>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={20} color={COLORS.textLight} />
    </Pressable>
  );

  return (
    <Layout style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Image
          source={{ uri: "https://picsum.photos/800/600" }}
          style={styles.coverImage}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={StyleSheet.absoluteFillObject}
        />
        <Animated.View
          style={[styles.headerContent, { opacity: headerOpacity }]}
        >
          <View style={styles.profileInfo}>
            <Animated.Image
              source={{ uri: "https://picsum.photos/200" }}
              style={[
                styles.profileImage,
                { transform: [{ scale: imageScale }] },
              ]}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.name}>Thomas Durant</Text>
              <View style={styles.locationContainer}>
                <Feather name="map-pin" size={14} color={COLORS.primary} />
                <Text style={styles.location}>Paris, France</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            {STATS.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.content}>
          {/* Section Réservations */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Prochains rendez-vous</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3].map((_, index) => (
                <View key={index} style={styles.appointment}>
                  <View style={styles.appointmentLeft}>
                    <Text style={styles.appointmentDate}>24</Text>
                    <Text style={styles.appointmentMonth}>JUN</Text>
                  </View>
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.appointmentTitle}>
                      Coiffure avec Marie
                    </Text>
                    <Text style={styles.appointmentTime}>14:30 - 15:30</Text>
                  </View>
                  <View style={styles.appointmentStatus}>
                    <Text style={styles.statusText}>Confirmé</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {MENU_ITEMS.map(renderMenuItem)}
          </View>

          {/* Version et Déconnexion */}
          <View style={styles.footer}>
            <Text style={styles.version}>Version 1.0.0</Text>
            <TouchableOpacity style={styles.logoutButton}>
              <Feather name="log-out" size={18} color={COLORS.error} />
              <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    zIndex: 1,
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  headerContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: SPACING.md,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  nameContainer: {
    marginLeft: SPACING.md,
  },
  name: {
    ...TYPOGRAPHY.h2,
    color: COLORS.white,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: SPACING.md,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    ...TYPOGRAPHY.h3,
    color: COLORS.white,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 300,
  },
  content: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  seeAll: {
    ...TYPOGRAPHY.button,
    color: COLORS.primary,
  },
  appointment: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    marginRight: SPACING.md,
    width: width * 0.8,
    ...EFFECTS.softShadow,
  },
  appointmentLeft: {
    alignItems: "center",
    paddingRight: SPACING.md,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  appointmentDate: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  appointmentMonth: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    textTransform: "uppercase",
  },
  appointmentInfo: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  appointmentTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    marginBottom: 4,
  },
  appointmentTime: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
  },
  appointmentStatus: {
    backgroundColor: COLORS.success + "20",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
    fontWeight: "600",
  },
  menuContainer: {
    paddingHorizontal: SPACING.md,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    ...EFFECTS.softShadow,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  menuContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  menuTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
  footer: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
    alignItems: "center",
  },
  version: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    marginLeft: SPACING.xs,
    ...TYPOGRAPHY.button,
    color: COLORS.error,
  },
});
