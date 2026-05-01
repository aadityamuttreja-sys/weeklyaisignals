import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAF8F4",
        ink: "#1A1A1A",
        muted: "#6B6B6B",
        rule: "#E5E2DB",
        accent: "#8B2635",
      },
      fontFamily: {
        serif: ['"Source Serif 4"', '"Source Serif Pro"', "Charter", "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "680px",
      },
      fontSize: {
        body: ["19px", { lineHeight: "1.7" }],
      },
      letterSpacing: {
        smallcaps: "0.08em",
      },
    },
  },
  plugins: [],
};

export default config;
