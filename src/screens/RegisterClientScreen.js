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
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const RegisterClientScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    let newErrors = {};

    if (!form.name) newErrors.name = "Le nom est requis";
    if (!form.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "L'email est invalide";
    if (!form.phone) newErrors.phone = "Le numéro de téléphone est requis";
    if (!form.password) newErrors.password = "Le mot de passe est requis";
    else if (form.password.length < 6)
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:8002/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: "client",
            nom: form.name,
            email: form.email,
            telephone: form.phone,
            motDePasse: form.password,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          Alert.alert("Succès", "Votre compte a été créé !", [
            { text: "OK", onPress: () => navigation.navigate("Login") },
          ]);
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
    }
  };

  const FormInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType,
    icon,
    error,
    showPasswordToggle,
    onTogglePassword,
  }) => (
    <View className="mb-4">
      <Text className="text-gray-700 text-sm font-medium mb-1">{label}</Text>
      <View className="flex-row items-center border border-gray-300 rounded-lg bg-white">
        {icon && (
          <Feather name={icon} size={20} className="ml-3 text-gray-500" />
        )}
        <TextInput
          className="flex-1 h-12 px-4 text-gray-800 text-base"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF" // Gray-400
          secureTextEntry={secureTextEntry && !showPasswordToggle}
          keyboardType={keyboardType}
        />
        {showPasswordToggle && (
          <TouchableOpacity onPress={onTogglePassword} className="p-2">
            <Feather
              name={showPasswordToggle ? "eye" : "eye-off"}
              size={20}
              className="text-gray-500"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-2xl font-bold text-gray-800 text-center mb-6">
            Inscription Client
          </Text>

          <FormInput
            label="Nom"
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
            placeholder="Votre nom complet"
            icon="user"
            error={errors.name}
          />

          <FormInput
            label="Email"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            placeholder="votre@email.com"
            keyboardType="email-address"
            icon="mail"
            error={errors.email}
          />

          <FormInput
            label="Téléphone"
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
            placeholder="Votre numéro de téléphone"
            keyboardType="phone-pad"
            icon="phone"
            error={errors.phone}
          />

          <FormInput
            label="Mot de passe"
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
            placeholder="Votre mot de passe"
            secureTextEntry
            icon="lock"
            error={errors.password}
            showPasswordToggle={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <FormInput
            label="Confirmer le mot de passe"
            value={form.confirmPassword}
            onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
            placeholder="Confirmez votre mot de passe"
            secureTextEntry
            icon="lock"
            error={errors.confirmPassword}
            showPasswordToggle={showConfirmPassword}
            onTogglePassword={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          />

          <TouchableOpacity
            className="bg-indigo-500 rounded-lg py-3 mt-6"
            onPress={handleRegister}
          >
            <Text className="text-center text-white text-lg font-bold">
              S'inscrire
            </Text>
          </TouchableOpacity>

          <Text className="text-center text-gray-500 text-sm mt-4">
            En vous inscrivant, vous acceptez nos conditions d'utilisation et
            notre politique de confidentialité.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterClientScreen;
