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
        sans:    ["var(--font-montserrat)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        cursive: ["Dancing Script", "cursive"],
      },
      colors: {
        brand: {
          bg:      "#ffffff",
          soft:    "#f8fdf9",
          paper:   "#fff7ed",
          ink:     "#111827",
          mid:     "#374151",
          muted:   "#6b7280",
          primary: "#16a34a",
          forest:  "#15803d",
          deep:    "#14532d",
          border:  "#e5e7eb",
        },
        /* ── Canopy: dark forest sections (Keemala-style dark) ── */
        canopy: {
          DEFAULT: "#052e16",
          mid:     "#073d1e",
          light:   "#0a5228",
          text:    "rgba(255,255,255,0.82)",
        },
        /* ── Override emerald → Son Kieu forest green ── */
        emerald: {
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
      /* ── Wave/blob clip paths ── */
      backgroundImage: {
        "canopy-gradient": "linear-gradient(180deg, #052e16 0%, #073d1e 100%)",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)"    },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)"    },
          "50%":      { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0"  },
        },
      },
      animation: {
        "fade-up":   "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in":   "fadeIn 0.5s ease-out both",
        float:       "float 5s ease-in-out infinite",
        shimmer:     "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
