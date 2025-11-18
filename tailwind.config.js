/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#FF3131",
          mint: "#67FFF0",
        },
        bg: {
          primary: "#0A0E17",
          secondary: "#101522",
          tertiary: "#161C2A",
        },
        surface: {
          DEFAULT: "#1C2433",
          hover: "#232D40",
          border: "#2F3A4F",
        },
        text: {
          primary: "#E6ECF3",
          secondary: "#A8B3C2",
          muted: "#6C7280",
        },
      },
    },
  },
};

export default config;
