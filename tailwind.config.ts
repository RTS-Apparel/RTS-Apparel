import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF", // Pure white — main page bg
        surface: "#F5F5F5", // Light gray — cards on white bg
        "surface-dark": "#1A1A1A", // Near black — dark boxes, navbar
        "surface-red": "#E63946", // Red — accent boxes, badges, CTA
        border: "#E0E0E0", // Light border
        "border-dark": "#333333", // Dark border
        red: {
          DEFAULT: "#E63946",
          dark: "#C1121F",
          light: "#FF6B6B",
          muted: "rgba(230,57,70,0.10)",
        },
        text: {
          onwhite: "#1A1A1A", // Black text on white/light bg
          ondark: "#FFFFFF", // White text on black/dark bg
          onred: "#FFFFFF", // White text on red bg
          muted: "#666666", // Gray text for secondary info
          red: "#E63946", // Red text on white bg
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
