import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#0b0d12",
        panel: "#11151d",
        panelSoft: "#171c25",
        borderSoft: "#2a3140",
        accent: "#4dd2c0",
        accentWarm: "#f2b84b",
        danger: "#ff6b6b",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(0, 0, 0, 0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
