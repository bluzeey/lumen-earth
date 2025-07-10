import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx,css}", // ✅ This will pick up everything inside src/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
