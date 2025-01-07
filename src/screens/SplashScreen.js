import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { COLORS, SPACING, TYPOGRAPHY, EFFECTS } from "../constants/theme";

const { width } = Dimensions.get("window");

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.navigate("Welcome");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
      </Animated.View>
      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        Services à portée de main
      </Animated.Text>
      <View style={styles.backgroundDecoration} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    ...EFFECTS.softShadow,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.lg,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: "contain",
  },
  subtitle: {
    ...TYPOGRAPHY.h3,
    marginTop: SPACING.xl,
    color: COLORS.primary,
  },
  backgroundDecoration: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.secondary,
    opacity: 0.1,
  },
});
