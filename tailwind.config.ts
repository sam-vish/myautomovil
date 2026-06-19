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
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      colors: {
        cream: "#FAF7F2",
        ink: "#1C1917",
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
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(234, 88, 12, 0.45)" },
          "50%": { boxShadow: "0 0 0 14px rgba(234, 88, 12, 0)" },
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
