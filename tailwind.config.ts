import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx,css}", // ✅ This will pick up everything inside src/
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2C543F",
        leaf: "#A3C19F",
        lightgreen: "#E5F0E4",
        beige: "#F8F7F2",
        yellow: "#FCDDA1",
        red: "#D75C3B",
        charcoal: "#2D2E2C",
      },
    },
  },
  plugins: [],
};

export default config;
