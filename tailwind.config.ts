import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-outfit)", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "#0a0a0f",
          secondary: "#12121a",
        },
        accent: {
          violet: "#8b5cf6",
          cyan: "#06b6d4",
          gold: "#fbbf24",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease forwards",
        "hero-pulse": "heroPulse 4s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite",
        marquee: "marquee 30s linear infinite",
        "slide-up": "slideUp 0.3s ease forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        heroPulse: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(100%)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
