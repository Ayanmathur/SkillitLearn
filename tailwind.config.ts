import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Typography ──────────────────────────────────────────
      fontFamily: {
        sans: ["var(--font-montserrat)", ...defaultTheme.fontFamily.sans],
      },

      // ── Colors ──────────────────────────────────────────────
      // Hard palette values for explicit use; semantic tokens
      // (surface, text-primary, etc.) come from CSS variables
      // so they respond to light/dark theme automatically.
      colors: {
        navy: {
          DEFAULT: "#1a1a2e",
          header: "#1a1a2e",
          heading: "#1a1a2e",
          body: "#1a1a2e",
          button: "#1a1a2e",
          50: "#e8e8ed",
          100: "#c5c5d4",
          200: "#9e9eb8",
          300: "#76769c",
          400: "#565685",
          500: "#3d3d5c",
          600: "#2d2d4a",
          700: "#1a1a2e",
          800: "#141422",
          900: "#0d0d17",
          950: "#06060b",
        },
        accent: {
          DEFAULT: "#5bbd72",
          hover: "#4caf50",
          light: "#a5d6a7",
          50: "#ecf8ee",
          100: "#d4efd8",
          200: "#a5d6a7",
          300: "#81c784",
          400: "#66bb6a",
          500: "#5bbd72",
          600: "#4caf50",
          700: "#388e3c",
          800: "#2e7d32",
          900: "#1b5e20",
          950: "#0d3a12",
        },

        // Semantic tokens (CSS variable–driven for light/dark)
        surface: {
          DEFAULT: "var(--bg-surface)",
          raised: "var(--bg-surface-raised)",
          overlay: "var(--bg-surface-overlay)",
        },
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        border: "var(--border-color)",
      },

      // ── Spacing & Layout ─────────────────────────────────────
      borderRadius: {
        pill: "9999px",
      },

      // ── Shadows ──────────────────────────────────────────────
      // Deliberate elevation system: cards float slightly,
      // modals float higher, hover lifts further.
      boxShadow: {
        card: "0 2px 12px rgba(26, 26, 46, 0.06), 0 1px 4px rgba(26, 26, 46, 0.04)",
        "card-hover":
          "0 8px 28px rgba(26, 26, 46, 0.10), 0 2px 8px rgba(26, 26, 46, 0.06)",
        button:
          "0 2px 8px rgba(91, 189, 114, 0.25), 0 1px 3px rgba(26, 26, 46, 0.08)",
        "button-hover":
          "0 4px 16px rgba(91, 189, 114, 0.35), 0 2px 6px rgba(26, 26, 46, 0.10)",
        modal:
          "0 16px 48px rgba(26, 26, 46, 0.16), 0 4px 16px rgba(26, 26, 46, 0.08)",
      },

      // ── Animations ───────────────────────────────────────────
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
