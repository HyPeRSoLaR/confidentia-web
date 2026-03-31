import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Confidentia brand palette — derived from logo gradient
        cyan:   "#45D8D4",
        violet: "#9B6FE8",
        pink:   "#E879BC",
        coral:  "#FF8C6B",
        bg:     "#07090F",
        surface:"#0F1120",
        panel:  "#151830",
        border: "#1E2240",
        text:   "#F0F2FF",
        muted:  "#8A8FAD",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        // The logo's full gradient — use on buttons, badges, accents
        brand: "linear-gradient(135deg, #45D8D4 0%, #9B6FE8 45%, #E879BC 75%, #FF8C6B 100%)",
        "brand-reverse": "linear-gradient(315deg, #45D8D4 0%, #9B6FE8 45%, #E879BC 75%, #FF8C6B 100%)",
        "surface-glow": "radial-gradient(ellipse at top, #1a1535 0%, #07090F 70%)",
      },
      boxShadow: {
        brand: "0 0 24px -4px rgba(155, 111, 232, 0.4)",
        glow: "0 0 40px -8px rgba(69, 216, 212, 0.3)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.5s ease forwards",
        shimmer: "shimmer 2s linear infinite",
        pulse2: "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
