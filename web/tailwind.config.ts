import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "oklch(from var(--background) l c h / <alpha-value>)",
        foreground: "oklch(from var(--foreground) l c h / <alpha-value>)",
        card: "oklch(from var(--card) l c h / <alpha-value>)",
        "card-foreground": "oklch(from var(--card-foreground) l c h / <alpha-value>)",
        popover: "oklch(from var(--popover) l c h / <alpha-value>)",
        "popover-foreground": "oklch(from var(--popover-foreground) l c h / <alpha-value>)",
        border: "oklch(from var(--border) l c h / <alpha-value>)",
        input: "oklch(from var(--input) l c h / <alpha-value>)",
        ring: "oklch(from var(--ring) l c h / <alpha-value>)",
        secondary: "oklch(from var(--secondary) l c h / <alpha-value>)",
        "secondary-foreground": "oklch(from var(--secondary-foreground) l c h / <alpha-value>)",
        muted: "oklch(from var(--muted) l c h / <alpha-value>)",
        "muted-foreground": "oklch(from var(--muted-foreground) l c h / <alpha-value>)",
        accent: "oklch(from var(--accent) l c h / <alpha-value>)",
        "accent-foreground": "oklch(from var(--accent-foreground) l c h / <alpha-value>)",
        destructive: "oklch(from var(--destructive) l c h / <alpha-value>)",
        "destructive-foreground": "oklch(from var(--destructive-foreground, var(--primary-foreground)) l c h / <alpha-value>)",
        "primary-foreground": "oklch(from var(--primary-foreground) l c h / <alpha-value>)",
        primary: "rgb(var(--primary-rgb) / <alpha-value>)",
        "primary-dark": "rgb(var(--primary-rgb) / 0.85)",
        "primary-light": "color-mix(in oklch, var(--primary) 12%, white)",
        "background-light": "var(--background)",
        "background-offwhite": "var(--secondary)",
        "background-dark": "var(--card)",
        "text-dark": "var(--foreground)",
        "text-medium": "var(--muted-foreground)",
        "text-light": "color-mix(in oklch, var(--muted-foreground) 80%, white)",
        "border-light": "oklch(from var(--border) l c h / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"],
        arabic: ["'Noto Naskh Arabic'", "serif"],
      },
      fontSize: {
        micro: ["0.75rem", { lineHeight: "1rem" }],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        glow: "0 0 15px rgba(0, 166, 156, 0.2)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1.25rem",
        "2xl": "1.75rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries"), require("tailwindcss-animate")],
};

export default config;
