/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Deep Teal + Champagne/Sand palette */
        teal: {
          50:  "oklch(0.97 0.012 195)",
          100: "oklch(0.93 0.025 193)",
          200: "oklch(0.85 0.05 192)",
          300: "oklch(0.72 0.075 191)",
          400: "oklch(0.58 0.09 192)",
          500: "oklch(0.46 0.095 193)",
          600: "oklch(0.38 0.09 195)",
          700: "oklch(0.30 0.075 196)",
          800: "oklch(0.22 0.055 197)",
          900: "oklch(0.16 0.038 198)",
          950: "oklch(0.11 0.025 200)",
        },
        champagne: {
          50:  "oklch(0.99 0.005 80)",
          100: "oklch(0.97 0.012 78)",
          200: "oklch(0.93 0.025 76)",
          300: "oklch(0.88 0.04 75)",
          400: "oklch(0.82 0.06 74)",
          500: "oklch(0.78 0.08 75)",
          600: "oklch(0.70 0.085 73)",
          700: "oklch(0.60 0.08 72)",
          800: "oklch(0.48 0.065 70)",
          900: "oklch(0.35 0.045 68)",
          950: "oklch(0.22 0.028 66)",
        },
        sand: {
          50:  "oklch(0.99 0.004 85)",
          100: "oklch(0.97 0.01 83)",
          200: "oklch(0.94 0.018 82)",
          300: "oklch(0.90 0.028 80)",
          400: "oklch(0.85 0.038 79)",
          500: "oklch(0.78 0.045 78)",
          600: "oklch(0.68 0.042 77)",
          700: "oklch(0.56 0.035 76)",
          800: "oklch(0.42 0.025 75)",
          900: "oklch(0.28 0.018 74)",
          950: "oklch(0.18 0.012 73)",
        },
        /* Semantic tokens mapped to CSS variables */
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Lato'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};
