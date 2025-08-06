import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Zen Kaku Gothic New"', "sans-serif"],
      },
      colors: {
        // Base scale (light UI layers)
        base: {
          "100": "#fefcfa",
          "200": "#fdf8f3",
          "300": "#fbf4ec",
          "400": "#f9ecdf", // main base
          "500": "#f5e4d2",
          "600": "#f0dbc5",
          "700": "#ebd2b8",
          "800": "#e6c9ab",
          "900": "#e1c09e",
        },
        // Accent scale (dark UI and interaction)
        accent: {
          "100": "#f4f1f1",
          "200": "#e8e0e1",
          "300": "#dccfd1",
          "400": "#d0bec1",
          "500": "#c4adb1",
          "600": "#b89ca1",
          "700": "#ac8b91",
          "800": "#a07a81",
          "900": "#946971",
          "950": "#5d3136", // main accent
        },
        // Semantic color roles
        primary: {
          DEFAULT: "#5d3136",
          hover: "#4a272b",
          focus: "#6b3a40",
        },
        background: "#f9ecdf",
        surface: "#fefcfa",
        card: "#fdf8f3",
        muted: {
          DEFAULT: "#f0dbc5",
          foreground: "#946971",
        },
        foreground: "#5d3136",
        border: {
          DEFAULT: "#ebd2b8",
          muted: "#f5e4d2",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      boxShadow: {
        soft: "0 2px 8px 0 rgba(93, 49, 54, 0.08)",
        medium: "0 4px 16px 0 rgba(93, 49, 54, 0.12)",
        strong: "0 8px 32px 0 rgba(93, 49, 54, 0.16)",
      },
    },
  },
  plugins: [animate],
};

export default config;
