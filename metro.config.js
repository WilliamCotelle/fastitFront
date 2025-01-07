const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname, {
  // Ajoutez cette configuration
  resolver: {
    sourceExts: ["js", "jsx", "json", "ts", "tsx"],
  },
});

module.exports = withNativeWind(config, {
  input: "./global.css", // Ajoutez votre fichier CSS global
});
