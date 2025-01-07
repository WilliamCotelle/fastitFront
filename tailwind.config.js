/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#4C5D9E",
        secondary: "#7A93DF",
        background: "#DBE8FF",
        white: "#FFFFFF",
        text: "#2C3A55",
        textLight: "#667391",
        border: "#E5E5E5",
        cardBackground: "rgba(255, 255, 255, 0.7)",
        success: "#4CAF50",
        error: "#F44336",
        warning: "#FFC107",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        md: "16px",
        lg: "18px",
        xl: "20px",
        xxl: "24px",
        xxxl: "32px",
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        round: "9999px",
      },
      boxShadow: {
        shadow: "0 8px 16px rgba(0, 0, 0, 0.1)", // Pour shadow
        softShadow: "0 4px 8px rgba(0, 0, 0, 0.05)", // Pour softShadow
      },
    },
  },
  plugins: [],
};
