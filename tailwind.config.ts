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
        navy: {
          950: "#050A15",
          900: "#0A0F1E",
          800: "#111827",
          700: "#1A2340",
          600: "#243050",
        },
        indigo: {
          500: "#4F6EF7",
          400: "#7B93F9",
          300: "#A8B8FB",
        },
        amber: {
          400: "#F7A84F",
          300: "#FAC07A",
        },
        slate: {
          400: "#8B9CC7",
          300: "#B0BDD9",
          200: "#D1D9EB",
        },
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(79,110,247,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(79,110,247,0.05) 1px, transparent 1px)",
        "hero-gradient":
          "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(79,110,247,0.25) 0%, transparent 70%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(26,35,64,0.8) 0%, rgba(10,15,30,0.95) 100%)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        shimmer: "shimmer 2s infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
