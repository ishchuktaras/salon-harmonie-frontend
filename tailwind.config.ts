// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#3C3633', // Tmavé dřevo/antracit
        'brand-secondary': '#A4907C', // Béžová/kamenná
        'brand-accent': '#E1D7C6', // Teplá lomená bílá
        'brand-muted': '#6A5F5A', // Tlumená šedá
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-lora)'],
      },
    },
  },
  plugins: [],
};
export default config;