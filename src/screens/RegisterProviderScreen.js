import React, { useState, useCallback, useRef, useReducer } from "react";
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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

const RegisterProviderScreen = ({ navigation }) => {
  const formRef = useRef({
    nomEntreprise: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
    description: "",
    categorie: "",
    siret: "",
    tarifHoraire: "",
    accepteCaution: false,
    heureOuverture: "06:00",
    heureFermeture: "17:00",
    moyensPaiement: {
      carte: false,
      especes: false,
      cheque: false,
    },
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

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

  const validateField = useCallback((fieldName, value) => {
    let error = "";
    switch (fieldName) {
      case "nomEntreprise":
        if (value.length < 2)
          error = "Le nom doit contenir au moins 2 caractères";
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) error = "Email invalide";
        break;
      case "telephone":
        if (!/^\d{10}$/.test(value)) error = "Numéro de téléphone invalide";
        break;
      case "password":
        if (value.length < 8)
          error = "Le mot de passe doit contenir au moins 8 caractères";
        break;
      case "confirmPassword":
        if (value !== formRef.current.password)
          error = "Les mots de passe ne correspondent pas";
        break;
      case "siret":
        if (!/^\d{14}$/.test(value)) error = "Numéro SIRET invalide";
        break;
    }
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
    return !error;
  }, []);

  const handleInputChange = useCallback((fieldName, value) => {
    formRef.current[fieldName] = value;
    forceUpdate({});
  }, []);

  const handleRegister = useCallback(async () => {
    setIsLoading(true);
    let isValid = true;

    Object.keys(formRef.current).forEach((key) => {
      if (!validateField(key, formRef.current[key])) {
        isValid = false;
      }
    });

    if (!isValid) {
      setIsLoading(false);
      Alert.alert(
        "Erreur",
        "Veuillez corriger les erreurs dans le formulaire."
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:8002/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "prestataire",
          ...formRef.current,
          motDePasse: formRef.current.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert(
          "Succès",
          "Votre compte a été créé ! Notre équipe va vérifier vos informations et valider votre profil sous peu.",
          [{ text: "OK", onPress: () => navigation?.navigate("Login") }]
        );
      } else {
        Alert.alert("Erreur", data.error || "Une erreur est survenue.");
      }
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Impossible de vous inscrire. Veuillez réessayer plus tard."
      );
    } finally {
      setIsLoading(false);
    }
  }, [navigation, validateField]);

  const FormInput = useCallback(
    ({
      label,
      placeholder,
      fieldName,
      keyboardType = "default",
      secureTextEntry = false,
      multiline = false,
      required = false,
      icon,
      showPasswordToggle = false,
      showPassword = false,
      onTogglePassword,
    }) => {
      const handleChangeText = useCallback(
        (text) => {
          handleInputChange(fieldName, text);
        },
        [fieldName]
      );

      const handleBlur = useCallback(() => {
        validateField(fieldName, formRef.current[fieldName]);
      }, [fieldName]);

      return (
        <View className="mb-6">
          <Text className="text-gray-200 text-base font-medium mb-2">
            {label} {required && <Text className="text-teal-400">*</Text>}
          </Text>
          <View className="relative">
            {icon && (
              <View className="absolute left-4 top-3 z-10">
                <Feather name={icon} size={20} color="#9CA3AF" />
              </View>
            )}
            <TextInput
              className={`w-full h-12 px-4 ${
                icon ? "pl-12" : ""
              } bg-gray-800 border border-gray-700 rounded-lg text-gray-200 text-base ${
                multiline ? "h-24 py-2" : ""
              } ${errors[fieldName] ? "border-red-500" : ""}`}
              placeholder={placeholder}
              placeholderTextColor="#6B7280"
              value={formRef.current[fieldName]}
              onChangeText={handleChangeText}
              onBlur={handleBlur}
              keyboardType={keyboardType}
              secureTextEntry={secureTextEntry && !showPassword}
              multiline={multiline}
              autoCapitalize="none"
              aria-label={label}
              aria-required={required}
              aria-invalid={!!errors[fieldName]}
            />
            {showPasswordToggle && (
              <TouchableOpacity
                className="absolute right-4 top-3"
                onPress={onTogglePassword}
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            )}
          </View>
          {errors[fieldName] && (
            <Text className="text-red-500 text-sm mt-1">
              {errors[fieldName]}
            </Text>
          )}
        </View>
      );
    },
    [errors, handleInputChange, validateField]
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <FormInput
              label="Nom de l'entreprise"
              placeholder="Nom de votre entreprise"
              fieldName="nomEntreprise"
              icon="briefcase"
              required
            />
            <FormInput
              label="Email"
              placeholder="votre@email.com"
              fieldName="email"
              keyboardType="email-address"
              icon="mail"
              required
            />
            <FormInput
              label="Téléphone"
              placeholder="Votre numéro de téléphone"
              fieldName="telephone"
              keyboardType="phone-pad"
              icon="phone"
              required
            />
          </>
        );
      case 2:
        return (
          <>
            <FormInput
              label="Mot de passe"
              placeholder="Votre mot de passe"
              fieldName="password"
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
              fieldName="confirmPassword"
              secureTextEntry
              icon="lock"
              required
              showPasswordToggle
              showPassword={showConfirmPassword}
              onTogglePassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />
            <View className="mb-6">
              <Text className="text-gray-200 text-base font-medium mb-2">
                Force du mot de passe
              </Text>
              <View className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <View
                  className="h-full bg-teal-500"
                  style={{
                    width: `${Math.min(
                      100,
                      formRef.current.password.length * 10
                    )}%`,
                  }}
                />
              </View>
            </View>
          </>
        );
      case 3:
        return (
          <>
            <View className="mb-8">
              <Text className="text-gray-200 text-base font-medium mb-4">
                Catégorie de service <Text className="text-teal-400">*</Text>
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.value}
                    className={`flex-row items-center px-4 py-2 rounded-full border ${
                      formRef.current.categorie === category.value
                        ? "bg-teal-500 border-teal-500"
                        : "bg-gray-800 border-gray-700"
                    }`}
                    onPress={() =>
                      handleInputChange("categorie", category.value)
                    }
                  >
                    <Feather
                      name={category.icon}
                      size={16}
                      color={
                        formRef.current.categorie === category.value
                          ? "#1F2937"
                          : "#D1D5DB"
                      }
                      className="mr-2"
                    />
                    <Text
                      className={`text-sm ${
                        formRef.current.categorie === category.value
                          ? "text-gray-900 font-medium"
                          : "text-gray-300"
                      }`}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <FormInput
              label="Numéro SIRET"
              placeholder="Votre numéro SIRET"
              fieldName="siret"
              keyboardType="numeric"
              icon="hash"
              required
            />
            <FormInput
              label="Description"
              placeholder="Décrivez votre activité..."
              fieldName="description"
              multiline
              icon="file-text"
            />
          </>
        );
      case 4:
        return (
          <>
            <View className="mb-8">
              <Text className="text-gray-200 text-base font-medium mb-4">
                Horaires d'ouverture
              </Text>
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-gray-400 text-sm mb-2">Ouverture</Text>
                  <View className="bg-gray-800 border border-gray-700 rounded-lg h-12 px-4 justify-center">
                    <TextInput
                      className="text-gray-200 text-base"
                      value={formRef.current.heureOuverture}
                      onChangeText={(value) =>
                        handleInputChange("heureOuverture", value)
                      }
                      placeholder="06:00"
                      placeholderTextColor="#6B7280"
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-400 text-sm mb-2">Fermeture</Text>
                  <View className="bg-gray-800 border border-gray-700 rounded-lg h-12 px-4 justify-center">
                    <TextInput
                      className="text-gray-200 text-base"
                      value={formRef.current.heureFermeture}
                      onChangeText={(value) =>
                        handleInputChange("heureFermeture", value)
                      }
                      placeholder="17:00"
                      placeholderTextColor="#6B7280"
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>
                </View>
              </View>
            </View>
            <FormInput
              label="Tarif horaire"
              placeholder="Votre tarif horaire (€)"
              fieldName="tarifHoraire"
              keyboardType="numeric"
              icon="dollar-sign"
            />
            <View className="flex-row items-center justify-between bg-gray-800 p-4 rounded-lg mb-8 border border-gray-700">
              <View className="flex-1 mr-4">
                <Text className="text-gray-200 text-base font-medium mb-1">
                  Accepter les cautions
                </Text>
                <Text className="text-gray-400 text-sm">
                  Permettre aux clients de verser une caution pour les services
                </Text>
              </View>
              <Switch
                value={formRef.current.accepteCaution}
                onValueChange={(value) =>
                  handleInputChange("accepteCaution", value)
                }
                trackColor={{ false: "#374151", true: "#0D9488" }}
                thumbColor={
                  formRef.current.accepteCaution ? "#F3F4F6" : "#9CA3AF"
                }
              />
            </View>
            <View className="mb-8">
              <Text className="text-gray-200 text-base font-medium mb-4">
                Moyens de paiement acceptés
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    className={`flex-1 flex-row items-center justify-center p-4 rounded-lg border ${
                      formRef.current.moyensPaiement[method.id]
                        ? "bg-teal-600 border-teal-500"
                        : "bg-gray-800 border-gray-700"
                    }`}
                    onPress={() =>
                      handleInputChange("moyensPaiement", {
                        ...formRef.current.moyensPaiement,
                        [method.id]: !formRef.current.moyensPaiement[method.id],
                      })
                    }
                  >
                    <Feather
                      name={method.icon}
                      size={24}
                      color={
                        formRef.current.moyensPaiement[method.id]
                          ? "#F3F4F6"
                          : "#9CA3AF"
                      }
                    />
                    <Text
                      className={`ml-2 text-sm ${
                        formRef.current.moyensPaiement[method.id]
                          ? "text-gray-100 font-medium"
                          : "text-gray-300"
                      }`}
                    >
                      {method.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-gray-900">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ padding: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-gray-100 text-center text-3xl font-bold mb-8">
              Inscription Prestataire
            </Text>
            <View className="flex-row justify-between mb-6">
              {[1, 2, 3, 4].map((step) => (
                <View
                  key={step}
                  className={`h-2 flex-1 mx-1 rounded-full ${
                    step <= currentStep ? "bg-teal-500" : "bg-gray-700"
                  }`}
                />
              ))}
            </View>
            {renderStep()}
            <View className="flex-row justify-between mt-6">
              {currentStep > 1 && (
                <TouchableOpacity
                  className="bg-gray-700 rounded-lg p-4 flex-1 mr-2"
                  onPress={() => setCurrentStep(currentStep - 1)}
                >
                  <Text className="text-gray-100 text-center text-lg font-semibold">
                    Précédent
                  </Text>
                </TouchableOpacity>
              )}
              {currentStep < 4 && (
                <TouchableOpacity
                  className="bg-teal-600 rounded-lg p-4 flex-1 ml-2"
                  onPress={() => setCurrentStep(currentStep + 1)}
                >
                  <Text className="text-gray-100 text-center text-lg font-semibold">
                    Suivant
                  </Text>
                </TouchableOpacity>
              )}
              {currentStep === 4 && (
                <TouchableOpacity
                  className="bg-teal-600 rounded-lg p-4 flex-1 ml-2"
                  onPress={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#F3F4F6" />
                  ) : (
                    <Text className="text-gray-100 text-center text-lg font-semibold">
                      S'inscrire
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
            <Text className="text-gray-400 text-center text-xs px-8 leading-5 mt-6">
              En vous inscrivant, vous acceptez nos conditions d'utilisation et
              notre politique de confidentialité.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default RegisterProviderScreen;
