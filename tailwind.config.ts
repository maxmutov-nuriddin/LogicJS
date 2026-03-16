import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b1020",
        surface: "#111827",
        "surface-2": "#1a2235",
        "surface-3": "#1e2d45",
        border: "#1e3a5f",
        primary: {
          DEFAULT: "#3b82f6",
          dark: "#2563eb",
          light: "#60a5fa",
        },
        accent: {
          DEFAULT: "#a855f7",
          dark: "#9333ea",
          light: "#c084fc",
        },
        success: {
          DEFAULT: "#22c55e",
          dark: "#16a34a",
          light: "#4ade80",
        },
        error: {
          DEFAULT: "#ef4444",
          dark: "#dc2626",
          light: "#f87171",
        },
        warning: {
          DEFAULT: "#f59e0b",
          light: "#fcd34d",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(59, 130, 246, 0.15)",
        "glow-accent": "0 0 20px rgba(168, 85, 247, 0.15)",
        "glow-success": "0 0 20px rgba(34, 197, 94, 0.15)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
