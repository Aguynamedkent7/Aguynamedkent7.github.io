import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#000000',
        slate: '#0A0A0F',
        panel: 'rgba(255,255,255,0.03)',
        accent: '#00D4FF',
        'accent-dim': 'rgba(0,212,255,0.2)',
        'accent-glow': 'rgba(0,212,255,0.4)',
        muted: '#9CA3AF',
        'border-glass': 'rgba(255,255,255,0.1)',
      },
      fontFamily: {
        display: ['var(--font-titillium)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: {
        glass: '12px',
      },
      boxShadow: {
        'accent-glow': '0 0 20px rgba(0,212,255,0.3)',
        'accent-glow-sm': '0 0 8px rgba(0,212,255,0.2)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'line-expand-h': 'line-expand-h 0.4s ease-out forwards',
        'line-expand-v': 'line-expand-v 0.4s ease-out forwards',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0,212,255,0.15)' },
          '50%': { boxShadow: '0 0 20px rgba(0,212,255,0.35)' },
        },
        'line-expand-h': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        'line-expand-v': {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
