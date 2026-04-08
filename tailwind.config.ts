import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background-rgb) / <alpha-value>)",
        surface: "rgb(var(--color-surface-rgb) / <alpha-value>)",
        surfaceSoft: "var(--color-surface-soft)",
        panel: "rgb(var(--color-panel-rgb) / <alpha-value>)",
        muted: "rgb(var(--color-muted-rgb) / <alpha-value>)",
        line: "rgb(var(--color-line-rgb) / <alpha-value>)",
        text: "rgb(var(--color-text-rgb) / <alpha-value>)",
        accent: "rgb(var(--color-accent-rgb) / <alpha-value>)",
        accentStrong: "rgb(var(--color-accent-strong-rgb) / <alpha-value>)",
        accentSoft: "var(--color-accent-soft)",
        spot: "rgb(var(--color-spot-rgb) / <alpha-value>)",
        spotSoft: "var(--color-spot-soft)",
        success: "rgb(var(--color-success-rgb) / <alpha-value>)",
        danger: "rgb(var(--color-danger-rgb) / <alpha-value>)",
        warning: "rgb(var(--color-warning-rgb) / <alpha-value>)"
      },
      boxShadow: {
        glow: "0 22px 52px rgba(35, 210, 177, 0.24)",
        card: "0 22px 58px rgba(2, 6, 23, 0.42)",
        shell: "0 28px 90px rgba(2, 6, 23, 0.48)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" }
        }
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        pulseSoft: "pulseSoft 2.4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
