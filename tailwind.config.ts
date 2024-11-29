/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        base: "1000px",
      },
      colors: {
        top: {
          primary: "#0099FF",
          secondary: "#DEF2FF",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        button: "linear-gradient(to bottom, #3152DF95, #1E254595)",
      },
    },
  },
  plugins: [
    require("tailwindcss-textshadow"),
    require("@midudev/tailwind-animations"),
  ],
};
export default config;
