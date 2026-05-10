import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        sage: "#6F806A",
        rose: "#C98282",
        sand: "#D8BE93",
        cream: "#FAF6EF",
        ink: "#3F3A35"
      },
      fontFamily: {
        serif: ["var(--font-display)", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(63, 58, 53, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
