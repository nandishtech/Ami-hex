import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        resq: {
          navy: "#071A2F",
          "navy-dark": "#040F1D",
          "navy-light": "#0C2540",
          blue: "#1769FF",
          "blue-hover": "#0D57E0",
          "blue-light": "#EBF2FF",
          green: "#18A66A",
          "green-hover": "#138856",
          "green-bright": "#25C982",
          "green-light": "#E8F8F1",
          orange: "#FF9F43",
          "orange-light": "#FFF5EB",
          red: "#EF4444",
          "red-light": "#FEF2F2",
          bg: "#F6F8FB",
          surface: "#FFFFFF",
          text: "#101828",
          secondary: "#667085",
          muted: "#98A2B3",
          border: "#E4E7EC",
          "border-dark": "#1E3A5F",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(16, 24, 40, 0.05), 0 1px 2px rgba(16, 24, 40, 0.03)",
        floating: "0 12px 32px -4px rgba(7, 26, 47, 0.12), 0 4px 12px -2px rgba(7, 26, 47, 0.08)",
        glow: "0 0 24px rgba(23, 105, 255, 0.25)",
        "glow-green": "0 0 24px rgba(37, 201, 130, 0.3)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ripple": "ripple 2s linear infinite",
      },
      keyframes: {
        ripple: {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
