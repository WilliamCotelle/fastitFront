import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { COLORS, SPACING } from "../constants/theme";

// Les données pour le carrousel
const SLIDES = [
  {
    title: "Bienvenue sur Fastit",
    description: "Trouvez rapidement des prestataires proches de chez vous.",
    image: "https://source.unsplash.com/featured/?people,work",
  },
  {
    title: "Gérez vos besoins",
    description: "Réservez des services en toute simplicité.",
    image: "https://source.unsplash.com/featured/?calendar,time",
  },
  {
    title: "Commencez maintenant",
    description: "Prêt à vous simplifier la vie ?",
    image: "https://source.unsplash.com/featured/?success,team",
  },
];

const { width, height } = Dimensions.get("window");

const IntroCarousel = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Le carrousel principal */}
      <Carousel
        loop={false} // Pas de boucle sur les slides
        width={width}
        height={height}
        data={SLIDES}
        scrollAnimationDuration={1000}
        renderItem={({ item, index }) => (
          <View style={styles.slide}>
            {/* Image pour chaque slide */}
            <Image source={{ uri: item.image }} style={styles.image} />
            {/* Titre et description */}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            {/* Bouton visible uniquement sur la dernière slide */}
            {index === SLIDES.length - 1 && (
              <TouchableOpacity
                style={styles.button}
                // Utilisez navigate au lieu de replace
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.buttonText}>Commencer</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      {/* Pagination visuelle */}
      <View style={styles.pagination}>
        {SLIDES.map((_, index) => (
          <View key={index} style={styles.dot} />
        ))}
      </View>
    </View>
  );
};

// Styles pour le composant
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.md,
  },
  image: {
    width: "80%",
    height: "50%",
    resizeMode: "contain",
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  pagination: {
    position: "absolute",
    bottom: SPACING.lg,
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.textLight,
    marginHorizontal: 5,
  },
});

export default IntroCarousel;
