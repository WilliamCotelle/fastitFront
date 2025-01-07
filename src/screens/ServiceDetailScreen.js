import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { COLORS, SPACING, TYPOGRAPHY, EFFECTS } from "../constants/theme";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_HEIGHT = Platform.OS === "ios" ? 88 : 64;

export default function ServiceDetailScreen({ route }) {
  const { provider } = route.params;
  const navigation = useNavigation();
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleServiceSelection = (service) => {
    setSelectedService(service);
  };

  const handleDateSelection = (date) => {
    setSelectedDate(date.dateString);
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
  };

  const handleBooking = () => {
    if (selectedService && selectedDate && selectedTime) {
      console.log(
        `Booking ${selectedService.name} on ${selectedDate} at ${selectedTime}`
      );
      // Implement booking logic here
    } else {
      console.log("Please complete all selections");
    }
  };

  const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: provider.image }}
            style={styles.providerImage}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.imageGradient}
          />
          <View style={styles.imageContent}>
            <Text style={styles.title}>{provider.name}</Text>
            <View style={styles.ratingContainer}>
              <Feather name="star" size={16} color={COLORS.primary} />
              <Text style={styles.ratingText}>
                {provider.rating} ({provider.reviews} avis)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.infoContainer}>
            <InfoItem icon="map-pin" text={`${provider.distance}`} />
            <InfoItem icon="clock" text={provider.availability} />
          </View>

          <Text style={styles.sectionTitle}>Services proposés</Text>
          {provider.services.map((service, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.serviceItem,
                selectedService === service && styles.selectedServiceItem,
              ]}
              onPress={() => handleServiceSelection(service)}
            >
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDetails}>
                  {service.duration} • {service.price}€
                </Text>
              </View>
              <Feather
                name={selectedService === service ? "check-circle" : "circle"}
                size={24}
                color={
                  selectedService === service
                    ? COLORS.primary
                    : COLORS.textLight
                }
              />
            </TouchableOpacity>
          ))}

          {selectedService && (
            <>
              <Text style={styles.sectionTitle}>Sélectionnez une date</Text>
              <View style={styles.calendarContainer}>
                <Calendar
                  onDayPress={handleDateSelection}
                  markedDates={{
                    [selectedDate]: {
                      selected: true,
                      selectedColor: COLORS.primary,
                    },
                  }}
                  theme={{
                    backgroundColor: COLORS.white,
                    calendarBackground: COLORS.white,
                    textSectionTitleColor: COLORS.primary,
                    selectedDayBackgroundColor: COLORS.primary,
                    selectedDayTextColor: COLORS.white,
                    todayTextColor: COLORS.primary,
                    dayTextColor: COLORS.text,
                    textDisabledColor: COLORS.textLight,
                    arrowColor: COLORS.primary,
                    monthTextColor: COLORS.text,
                    textMonthFontFamily: TYPOGRAPHY.fontFamily,
                    textDayFontFamily: TYPOGRAPHY.fontFamily,
                    textDayHeaderFontFamily: TYPOGRAPHY.fontFamily,
                  }}
                />
              </View>

              {selectedDate && (
                <View style={styles.timeSlotContainer}>
                  <Text style={styles.sectionTitle}>Horaires disponibles</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {timeSlots.map((time) => (
                      <TouchableOpacity
                        key={time}
                        style={[
                          styles.timeSlot,
                          selectedTime === time && styles.selectedTimeSlot,
                        ]}
                        onPress={() => handleTimeSelection(time)}
                      >
                        <Text
                          style={[
                            styles.timeSlotText,
                            selectedTime === time &&
                              styles.selectedTimeSlotText,
                          ]}
                        >
                          {time}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.bookButton,
          (!selectedService || !selectedDate || !selectedTime) &&
            styles.bookButtonDisabled,
        ]}
        onPress={handleBooking}
        disabled={!selectedService || !selectedDate || !selectedTime}
      >
        <Text style={styles.bookButtonText}>
          {selectedService
            ? `Réserver pour ${selectedService.price}€`
            : "Sélectionner un service"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const InfoItem = ({ icon, text }) => (
  <View style={styles.infoItem}>
    <Feather name={icon} size={16} color={COLORS.primary} />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    height: SCREEN_HEIGHT * 0.3,
    width: SCREEN_WIDTH,
  },
  providerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  imageContent: {
    position: "absolute",
    bottom: SPACING.lg,
    left: SPACING.lg,
    right: SPACING.lg,
  },
  contentContainer: {
    padding: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    marginLeft: SPACING.xs,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    ...EFFECTS.softShadow,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  selectedServiceItem: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + "10",
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
  },
  serviceDetails: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
  calendarContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.sm,
    ...EFFECTS.softShadow,
  },
  timeSlotContainer: {
    marginTop: SPACING.md,
  },
  timeSlot: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  selectedTimeSlot: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeSlotText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  selectedTimeSlotText: {
    color: COLORS.white,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  bookButton: {
    position: "absolute",
    bottom: SPACING.lg,
    left: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: "center",
    ...EFFECTS.softShadow,
  },
  bookButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  bookButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.white,
  },
});
