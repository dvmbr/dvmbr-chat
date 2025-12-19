import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{vue,ts}"],
  theme: {
    extend: {
      colors: {
        // core brand
        primary: "#FF3131",
        secondary: "#67FFF0",
        tertiary: "#F0FF42",

        // background
        "bg-deep": "#0D0D0E",
        "bg-surface": "#1A1B1E",
        "bg-elevate": "#2D2E33",

        // text & ui
        "text-main": "#FFFFFF",
        "text-muted": "#A0A0AB",
        border: "#3F3F46",

        // semantic states
        error: "#FF3131",
        success: "#67FFF0",
        warning: "#F0FF42",
      },

      borderRadius: {
        lg: "16px",
        md: "12px",
      },
      transitionTimingFunction: {
        "ease-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
