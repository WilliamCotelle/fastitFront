import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  SafeAreaView,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
// import { Picker } from "@react-native-picker/picker";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  BORDER_RADIUS,
  EFFECTS,
} from "../constants/theme";

const CATEGORIES = [
  { label: "Coiffure", value: "coiffure", icon: "scissors" },
  { label: "Ménage", value: "menage", icon: "home" },
  { label: "Cuisine", value: "cuisine", icon: "coffee" },
  { label: "Bricolage", value: "bricolage", icon: "tool" },
  { label: "Jardinage", value: "jardinage", icon: "sun" },
  { label: "Électricité", value: "electricite", icon: "zap" },
  { label: "Plomberie", value: "plomberie", icon: "droplet" },
  { label: "Autre", value: "autre", icon: "more-horizontal" },
];

const PAYMENT_METHODS = [
  { id: "carte", label: "Carte bancaire", icon: "credit-card" },
  { id: "especes", label: "Espèces", icon: "dollar-sign" },
  { id: "cheque", label: "Chèque", icon: "file-text" },
];

const RegisterProviderScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    nomEntreprise: "",
    adresse: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
    description: "",
    categorie: "",
    siret: "",
    horaires: "",
    accepteCaution: false,
    tarifHoraire: "",
    moyensPaiement: {
      carte: false,
      especes: false,
      cheque: false,
    },
    statut: "",
    heureOuverture: "06:00",
    heureFermeture: "17:00",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (
      !form.nomEntreprise ||
      !form.adresse ||
      !form.email ||
      !form.telephone ||
      !form.password ||
      !form.confirmPassword ||
      !form.categorie ||
      !form.statut
    ) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8002/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "prestataire",
          ...form,
          motDePasse: form.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert(
          "Succès",
          "Votre compte a été créé ! Notre équipe va vérifier vos informations et valider votre profil sous peu.",
          [{ text: "OK", onPress: () => navigation.navigate("Login") }]
        );
      } else {
        Alert.alert("Erreur", data.error || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erreur",
        "Impossible de vous inscrire. Veuillez réessayer plus tard."
      );
    }
  };

  const CategoryPicker = ({ selectedValue, onValueChange }) => (
    <View style={styles.inputSection}>
      <Text style={styles.inputLabel}>
        Catégorie de service <Text style={styles.requiredStar}>*</Text>
      </Text>
      <TouchableOpacity
        style={styles.categorySelect}
        onPress={() => {
          // Here you would typically open your picker modal
        }}
      >
        <Text
          style={[
            styles.categorySelectText,
            !selectedValue && styles.categorySelectPlaceholder,
          ]}
        >
          {selectedValue
            ? CATEGORIES.find((cat) => cat.value === selectedValue)?.label
            : "Sélectionnez une catégorie"}
        </Text>
        <Feather name="chevron-down" size={20} color={COLORS.textLight} />
      </TouchableOpacity>
    </View>
  );

  const StatusPicker = ({ selectedValue, onValueChange }) => (
    <View style={styles.statusSection}>
      <Text style={styles.sectionLabel}>Statut professionnel *</Text>
      <View style={styles.statusContainer}>
        {[
          { label: "Professionnel", value: "professionnel", icon: "briefcase" },
          { label: "Particulier", value: "particulier", icon: "user" },
        ].map((status) => (
          <TouchableOpacity
            key={status.value}
            style={[
              styles.statusButton,
              selectedValue === status.value && styles.statusButtonSelected,
            ]}
            onPress={() => onValueChange(status.value)}
          >
            <Feather
              name={status.icon}
              size={20}
              color={
                selectedValue === status.value ? COLORS.white : COLORS.primary
              }
              style={styles.statusIcon}
            />
            <Text
              style={[
                styles.statusButtonText,
                selectedValue === status.value &&
                  styles.statusButtonTextSelected,
              ]}
            >
              {status.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const FormInput = ({
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType = "default",
    secureTextEntry = false,
    multiline = false,
    required = false,
    icon,
    showPasswordToggle = false,
    showPassword = false,
    onTogglePassword,
  }) => (
    <View style={styles.inputSection}>
      <Text style={styles.inputLabel}>
        {label} {required && <Text style={styles.requiredStar}>*</Text>}
      </Text>
      <View style={styles.inputWrapper}>
        {icon && (
          <Feather
            name={icon}
            size={20}
            color={COLORS.textLight}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            multiline && styles.multilineInput,
          ]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !showPassword}
          multiline={multiline}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={onTogglePassword}
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Inscription Prestataire</Text>

          <FormInput
            label="Nom de l'entreprise"
            placeholder="Nom de votre entreprise"
            value={form.nomEntreprise}
            onChangeText={(text) => setForm({ ...form, nomEntreprise: text })}
            icon="briefcase"
            required
          />

          <FormInput
            label="Adresse"
            placeholder="Votre adresse complète"
            value={form.adresse}
            onChangeText={(text) => setForm({ ...form, adresse: text })}
            icon="map-pin"
            required
          />

          <FormInput
            label="Email"
            placeholder="votre@email.com"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            keyboardType="email-address"
            icon="mail"
            required
          />

          <FormInput
            label="Téléphone"
            placeholder="Votre numéro de téléphone"
            value={form.telephone}
            onChangeText={(text) => setForm({ ...form, telephone: text })}
            keyboardType="phone-pad"
            icon="phone"
            required
          />

          <FormInput
            label="Mot de passe"
            placeholder="Votre mot de passe"
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
            secureTextEntry
            icon="lock"
            required
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <FormInput
            label="Confirmer le mot de passe"
            placeholder="Confirmez votre mot de passe"
            value={form.confirmPassword}
            onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
            secureTextEntry
            icon="lock"
            required
            showPasswordToggle
            showPassword={showConfirmPassword}
            onTogglePassword={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          />

          <CategoryPicker
            selectedValue={form.categorie}
            onValueChange={(value) => setForm({ ...form, categorie: value })}
          />

          <StatusPicker
            selectedValue={form.statut}
            onValueChange={(value) => setForm({ ...form, statut: value })}
          />

          {form.statut === "professionnel" && (
            <FormInput
              label="Numéro SIRET"
              placeholder="Votre numéro SIRET"
              value={form.siret}
              onChangeText={(text) => setForm({ ...form, siret: text })}
              keyboardType="numeric"
              icon="hash"
            />
          )}

          <FormInput
            label="Description"
            placeholder="Décrivez votre activité..."
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
            multiline
            icon="file-text"
          />

          {/* Updated hours picker section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionLabel}>Horaires d'ouverture</Text>
            <View style={styles.hoursContainer}>
              <View style={styles.hourInputWrapper}>
                <Text style={styles.hoursLabel}>Ouverture</Text>
                <View style={styles.timeInputContainer}>
                  <TextInput
                    style={styles.timeInput}
                    value={form.heureOuverture}
                    onChangeText={(text) =>
                      setForm({ ...form, heureOuverture: text })
                    }
                    placeholder="06:00"
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
              </View>
              <View style={styles.hourInputWrapper}>
                <Text style={styles.hoursLabel}>Fermeture</Text>
                <View style={styles.timeInputContainer}>
                  <TextInput
                    style={styles.timeInput}
                    value={form.heureFermeture}
                    onChangeText={(text) =>
                      setForm({ ...form, heureFermeture: text })
                    }
                    placeholder="17:00"
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
              </View>
            </View>
          </View>
          {/* End of updated hours picker section */}

          <FormInput
            label="Tarif horaire"
            placeholder="Votre tarif horaire (€)"
            value={form.tarifHoraire}
            onChangeText={(text) => setForm({ ...form, tarifHoraire: text })}
            keyboardType="numeric"
            icon="dollar-sign"
          />

          <View style={styles.switchContainer}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Accepter les cautions</Text>
              <Text style={styles.switchDescription}>
                Permettre aux clients de verser une caution pour les services
              </Text>
            </View>
            <Switch
              value={form.accepteCaution}
              onValueChange={(value) =>
                setForm({ ...form, accepteCaution: value })
              }
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
              ios_backgroundColor={COLORS.border}
            />
          </View>

          <View style={styles.paymentMethodsSection}>
            <Text style={styles.sectionLabel}>Moyens de paiement acceptés</Text>
            <View style={styles.paymentMethodsGrid}>
              {PAYMENT_METHODS.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethodButton,
                    form.moyensPaiement[method.id] &&
                      styles.paymentMethodButtonSelected,
                  ]}
                  onPress={() =>
                    setForm({
                      ...form,
                      moyensPaiement: {
                        ...form.moyensPaiement,
                        [method.id]: !form.moyensPaiement[method.id],
                      },
                    })
                  }
                >
                  <Feather
                    name={method.icon}
                    size={24}
                    color={
                      form.moyensPaiement[method.id]
                        ? COLORS.white
                        : COLORS.textLight
                    }
                  />
                  <Text
                    style={[
                      styles.paymentMethodText,
                      form.moyensPaiement[method.id] &&
                        styles.paymentMethodTextSelected,
                    ]}
                  >
                    {method.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>S'inscrire</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            En vous inscrivant, vous acceptez nos conditions d'utilisation et
            notre politique de confidentialité.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
    marginBottom: SPACING.xl,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
  },
  categorySection: {
    marginBottom: SPACING.xl,
  },
  sectionLabel: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    marginBottom: SPACING.md,
    fontSize: 16,
    fontWeight: "600",
  },
  categoriesContainer: {
    paddingVertical: SPACING.xs,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 100,
    backgroundColor: COLORS.background,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryPillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryIcon: {
    marginRight: SPACING.xs,
  },
  categoryPillText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    fontSize: 14,
  },
  categoryPillTextSelected: {
    color: COLORS.white,
    fontWeight: "500",
  },
  statusSection: {
    marginBottom: SPACING.xl,
  },
  statusContainer: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  statusButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...EFFECTS.softShadow,
  },
  statusButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  statusIcon: {
    marginRight: SPACING.xs,
  },
  statusButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  statusButtonTextSelected: {
    color: COLORS.white,
  },
  inputSection: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontSize: 14,
    fontWeight: "500",
  },
  requiredStar: {
    color: COLORS.primary,
  },
  inputWrapper: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    color: COLORS.text,
    ...TYPOGRAPHY.body,
    fontSize: 15,
  },
  inputWithIcon: {
    paddingLeft: 48,
  },
  inputIcon: {
    position: "absolute",
    left: SPACING.md,
    zIndex: 1,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  passwordToggle: {
    position: "absolute",
    right: SPACING.md,
    padding: SPACING.xs,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  switchTextContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  switchLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  switchDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    fontSize: 12,
  },
  paymentMethodsSection: {
    marginBottom: SPACING.xl,
  },
  paymentMethodsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  paymentMethodButton: {
    flex: 1,
    minWidth: "45%",
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...EFFECTS.softShadow,
  },
  paymentMethodButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  paymentMethodText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    fontSize: 14,
  },
  paymentMethodTextSelected: {
    color: COLORS.white,
    fontWeight: "500",
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...EFFECTS.softShadow,
    marginTop: SPACING.xl,
  },
  buttonText: {
    color: COLORS.white,
    textAlign: "center",
    ...TYPOGRAPHY.button,
    fontSize: 16,
    fontWeight: "600",
  },
  disclaimer: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.xl,
    lineHeight: 18,
  },
  selectWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.white,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  selectIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  hoursContainer: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  hourInputWrapper: {
    flex: 1,
  },
  timeInputContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.white,
    height: 50,
    paddingHorizontal: SPACING.md,
    justifyContent: "center",
  },
  timeInput: {
    ...TYPOGRAPHY.body,
    fontSize: 15,
    color: COLORS.text,
  },
  hoursLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
    fontSize: 14,
  },
  categorySelect: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.white,
    height: 50,
    paddingHorizontal: SPACING.md,
  },
  categorySelectText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontSize: 15,
  },
  categorySelectPlaceholder: {
    color: COLORS.textLight,
  },
};

export default RegisterProviderScreen;
