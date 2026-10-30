import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        surface: "#FAFAFA",
        "surface-elevated": "#F5F4F0",
        border: "#E8E0D0",
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E2C07A",
          dark: "#9B7B2F",
          muted: "rgba(201,168,76,0.08)",
        },
        text: {
          primary: "#1A1A1A",
          secondary: "#4A4A4A",
          muted: "#9A9A9A",
          gold: "#C9A84C",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Playfair Display", "serif"],
        urdu: ["Noto Nastaliq Urdu", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
