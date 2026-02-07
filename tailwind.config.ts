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
        tarmac: '#0d0d0d',  // Background
        carbon: '#1a1a1a',  // Card Background
        ferrari: '#ff3b3b', // Accent (Red)
        textMain: '#f0f0f0' // Text
      },
      fontFamily: {
        racing: ['var(--font-russo)', 'sans-serif'],
        body: ['var(--font-exo)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;