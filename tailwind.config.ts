import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#071C35",
        mint: "#16DFA5",
        "off-white": "#FDFDFF",
      },
      fontFamily: {
        heading: ["var(--font-ibm-plex-sans)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        pill: "32px",
      },
    },
  },
  plugins: [],
};
export default config;
