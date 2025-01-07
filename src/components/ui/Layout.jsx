import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

const Layout = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.layout, style]}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: "#fff", // Couleur de fond par défaut
  },
  container: {
    flex: 1,
  },
});

export default Layout;
