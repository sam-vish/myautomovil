import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // "serif" key is kept so existing `font-serif` heading classes keep
        // working; it now loads the Bricolage Grotesque display font.
        serif: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      // Brand palette is defined as CSS custom properties in app/globals.css
      // (:root) and surfaced here as semantic design tokens. Stored as
      // space-separated RGB channels so Tailwind opacity modifiers (e.g.
      // bg-surface/85, from-ink/85) keep working.
      colors: {
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-hover": "rgb(var(--primary-hover) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(245, 197, 24, 0.5)" },
          "50%": { boxShadow: "0 0 0 14px rgba(245, 197, 24, 0)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "fade-in-up": "fade-in-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "pulse-glow": "pulse-glow 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
