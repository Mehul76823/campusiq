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
        // Deep premium dark palette
        navy: {
          950: "#030712",
          900: "#070B16",
          800: "#0D1424",
          700: "#151F35",
          600: "#202D49",
          500: "#2B3A5C",
        },

        // Primary indigo / electric blue
        indigo: {
          600: "#3B5BDB",
          500: "#6366F1",
          400: "#818CF8",
          300: "#A5B4FC",
          200: "#C7D2FE",
        },

        // Cyan accent
        cyan: {
          500: "#06B6D4",
          400: "#22D3EE",
          300: "#67E8F9",
          200: "#A5F3FC",
        },

        // Violet accent
        violet: {
          600: "#7C3AED",
          500: "#8B5CF6",
          400: "#A78BFA",
          300: "#C4B5FD",
        },

        // Amber highlight
        amber: {
          500: "#F59E0B",
          400: "#FBBF24",
          300: "#FCD34D",
          200: "#FDE68A",
        },

        // Modern slate scale
        slate: {
          500: "#64748B",
          400: "#94A3B8",
          300: "#CBD5E1",
          200: "#E2E8F0",
          100: "#F1F5F9",
        },

        // Success / status colors
        emerald: {
          500: "#10B981",
          400: "#34D399",
          300: "#6EE7B7",
        },

        rose: {
          500: "#F43F5E",
          400: "#FB7185",
          300: "#FDA4AF",
        },
      },

      fontFamily: {
        syne: ["Syne", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      fontSize: {
        "display-xl": [
          "4.5rem",
          {
            lineHeight: "1",
            letterSpacing: "-0.04em",
            fontWeight: "800",
          },
        ],

        "display-lg": [
          "3.75rem",
          {
            lineHeight: "1.05",
            letterSpacing: "-0.035em",
            fontWeight: "800",
          },
        ],

        "display-md": [
          "3rem",
          {
            lineHeight: "1.1",
            letterSpacing: "-0.03em",
            fontWeight: "700",
          },
        ],
      },

      backgroundImage: {
        // Subtle grid
        "grid-pattern":
          "linear-gradient(rgba(99,102,241,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.055) 1px, transparent 1px)",

        // Hero glow
        "hero-gradient":
          "radial-gradient(ellipse 80% 70% at 50% -20%, rgba(99,102,241,0.28) 0%, rgba(79,70,229,0.12) 35%, transparent 70%)",

        // Blue + violet glow
        "aurora-gradient":
          "radial-gradient(circle at 20% 20%, rgba(34,211,238,0.12), transparent 35%), radial-gradient(circle at 80% 10%, rgba(139,92,246,0.18), transparent 40%), radial-gradient(circle at 50% 80%, rgba(99,102,241,0.12), transparent 40%)",

        // Premium card background
        "card-gradient":
          "linear-gradient(135deg, rgba(21,31,53,0.82) 0%, rgba(7,11,22,0.96) 100%)",

        // Glass effect
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",

        // Border gradient
        "border-gradient":
          "linear-gradient(135deg, rgba(129,140,248,0.5), rgba(34,211,238,0.15), rgba(139,92,246,0.4))",

        // Text gradient
        "text-gradient":
          "linear-gradient(90deg, #818CF8 0%, #22D3EE 50%, #A78BFA 100%)",

        // Shimmer
        "shimmer-gradient":
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
      },

      backgroundSize: {
        grid: "40px 40px",
        "grid-small": "24px 24px",
        "grid-large": "64px 64px",
        "300%": "300% 300%",
      },

      boxShadow: {
        glow: "0 0 40px rgba(99,102,241,0.18)",
        "glow-sm": "0 0 20px rgba(99,102,241,0.15)",
        "glow-cyan": "0 0 40px rgba(34,211,238,0.18)",
        "glow-violet": "0 0 40px rgba(139,92,246,0.18)",

        card: "0 20px 60px rgba(0,0,0,0.35)",

        "card-hover":
          "0 25px 80px rgba(0,0,0,0.45), 0 0 40px rgba(99,102,241,0.12)",

        inner:
          "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.25)",
      },

      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-slow": "fadeIn 0.9s ease-out",

        "slide-up": "slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-down": "slideDown 0.5s cubic-bezier(0.22, 1, 0.36, 1)",

        "scale-in": "scaleIn 0.4s cubic-bezier(0.22, 1, 0.36, 1)",

        shimmer: "shimmer 2.5s linear infinite",

        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",

        "pulse-slow": "pulseSlow 4s ease-in-out infinite",

        float: "float 5s ease-in-out infinite",

        "float-slow": "float 8s ease-in-out infinite",

        glow: "glow 3s ease-in-out infinite",

        "gradient-x": "gradientX 6s ease infinite",

        spin-slow: "spin 12s linear infinite",
      },

      keyframes: {
        fadeIn: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },

        slideUp: {
          from: {
            opacity: "0",
            transform: "translateY(24px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        slideDown: {
          from: {
            opacity: "0",
            transform: "translateY(-24px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        scaleIn: {
          from: {
            opacity: "0",
            transform: "scale(0.94)",
          },
          to: {
            opacity: "1",
            transform: "scale(1)",
          },
        },

        shimmer: {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },

        pulseSlow: {
          "0%, 100%": {
            opacity: "0.5",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.04)",
          },
        },

        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },

        glow: {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(99,102,241,0.12)",
          },
          "50%": {
            boxShadow: "0 0 45px rgba(99,102,241,0.28)",
          },
        },

        gradientX: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },

      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
      },
    },
  },

  plugins: [],
};

export default config;