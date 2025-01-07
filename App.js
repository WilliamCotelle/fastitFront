import "./global.css";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

// Importation des écrans
import SplashScreen from "./src/screens/SplashScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen"; // Nouvelle screen
import LoginScreen from "./src/screens/LoginScreen";
import RegisterRoleSelection from "./src/screens/RegisterRoleSelection";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import IntroCarousel from "./src/screens/IntroCarousel";
import { COLORS } from "./src/constants/theme";
import ServiceDetailScreen from "./src/screens/ServiceDetailScreen";
import RegisterClientScreen from "./src/screens/RegisterClientScreen";
import RegisterProviderScreen from "./src/screens/RegisterProviderScreen";

// Création des navigateurs Stack et Tab
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Fonction pour les onglets principaux (AppTabs)
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
      }}
    >
      {/* Home Tab */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.iconContainer}>
              <MaterialIcons name="home" size={28} color={color} />
            </View>
          ),
        }}
      />

      {/* Placeholder Tab (for demo) */}
      <Tab.Screen
        name="Placeholder"
        component={() => null} // Placeholder screen
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.iconContainer}>
              <Feather name="upload" size={28} color={color} />
            </View>
          ),
        }}
      />

      {/* Chat Tab */}
      <Tab.Screen
        name="Chat"
        component={() => null} // Placeholder screen
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.iconContainer}>
              <Feather name="message-circle" size={28} color={color} />
            </View>
          ),
        }}
      />

      {/* Profile Tab */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.iconContainer}>
              <MaterialIcons name="settings" size={28} color={color} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Fonction principale de l'application
export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("hasSeenIntro").then((value) => {
      if (value === null) {
        setIsFirstLaunch(true);
        AsyncStorage.setItem("hasSeenIntro", "true");
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  if (isFirstLaunch === null) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Splash Screen */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        {/* Intro Carousel - Affiché uniquement au premier lancement */}
        {isFirstLaunch && (
          <Stack.Screen
            name="IntroCarousel"
            component={IntroCarousel}
            options={{ headerShown: false }}
          />
        )}

        {/* Écran de Bienvenue */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />

        {/* Écran de Connexion */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        {/* Écran de Sélection de Rôle pour l'Inscription */}
        <Stack.Screen
          name="RegisterRoleSelection"
          component={RegisterRoleSelection}
          options={{ headerShown: false }}
        />

        {/* Écran d'Inscription client */}
        <Stack.Screen
          name="RegisterClientScreen"
          component={RegisterClientScreen}
          options={{ headerShown: false }}
        />

        {/* Écran d'Inscription prestataire */}
        <Stack.Screen
          name="RegisterProviderScreen"
          component={RegisterProviderScreen}
          options={{ headerShown: false }}
        />

        {/* Navigation principale */}
        <Stack.Screen
          name="AppTabs"
          component={AppTabs}
          options={{ headerShown: false }}
        />
        {/* Écran ServiceDetail */}
        <Stack.Screen
          name="ServiceDetail"
          component={ServiceDetailScreen}
          options={{ title: "Détails du service" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 10,
    left: 15,
    right: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Légèrement translucide
    borderRadius: 30, // Forme plus arrondie
    height: 70,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10, // Ombre plus marquée pour Android
    paddingHorizontal: 10, // Ajout d'espace intérieur
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  activeIcon: {
    backgroundColor: COLORS.primary, // Fond pour l'icône active
    padding: 10,
    borderRadius: 20,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 6,
  },
  indicator: {
    position: "absolute",
    width: "25%", // Adapté au nombre d'onglets
    height: 5,
    backgroundColor: COLORS.primary,
    bottom: 5,
    borderRadius: 3,
  },
});
