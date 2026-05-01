import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      colors: {
        /* Override emerald → green thuần (khớp logo Sơn Kiều) */
        emerald: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",   /* vivid green — màu sáng trên logo */
          600: "#16a34a",
          700: "#15803d",   /* dark forest green — màu tối trên logo */
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        forest: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)"    },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)"   },
          "50%":      { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0"  },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.2" },
          "50%":      { opacity: "0.6" },
        },
      },
      animation: {
        "fade-up":      "fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "fade-up-slow": "fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s both",
        "fade-in":      "fadeIn 0.5s ease-out both",
        float:          "float 5s ease-in-out infinite",
        "float-slow":   "float 7s ease-in-out 1.5s infinite",
        shimmer:        "shimmer 2.5s linear infinite",
        "pulse-slow":   "pulseSlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
