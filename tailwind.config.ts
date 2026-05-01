import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "var(--paper)",
          deep: "var(--paper-deep)",
          edge: "var(--paper-edge)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          strong: "var(--ink-strong)",
          muted: "var(--ink-muted)",
          faint: "var(--ink-faint)",
        },
        rule: {
          DEFAULT: "var(--rule)",
          soft: "var(--rule-soft)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          deep: "var(--accent-deep)",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Newsreader", "Source Serif 4", "Iowan Old Style", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Geist", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Geist Mono", "ui-monospace", "SF Mono", "Menlo", "monospace"],
      },
      maxWidth: {
        measure: "38rem",
        "measure-wide": "64rem",
      },
      fontSize: {
        display: ["clamp(2.4rem, 4.6vw, 3.6rem)", { lineHeight: "1.05", letterSpacing: "-0.018em" }],
        h1: ["clamp(1.9rem, 3vw, 2.4rem)", { lineHeight: "1.12", letterSpacing: "-0.014em" }],
        h2: ["1.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        h3: ["1.18rem", { lineHeight: "1.3" }],
        body: ["1.05rem", { lineHeight: "1.62" }],
        small: ["0.86rem", { lineHeight: "1.45" }],
        meta: ["0.74rem", { lineHeight: "1.4", letterSpacing: "0.01em" }],
      },
    },
  },
  plugins: [],
} satisfies Config;
