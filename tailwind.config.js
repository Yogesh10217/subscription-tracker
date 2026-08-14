/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#13131b',
        surface: {
          DEFAULT: '#13131b',
          bright: '#393841',
          lowest: '#0d0d15',
          low: '#1b1b23',
          card: '#1f1f27',
          high: '#292932',
          highest: '#34343d',
        },
        primary: {
          DEFAULT: '#8083ff',
          light: '#c0c1ff',
          dark: '#494bd6',
        },
        secondary: {
          DEFAULT: '#03b5d3',
          light: '#4cd7f6',
          dark: '#00424e',
        },
        tertiary: {
          DEFAULT: '#d97721',
          light: '#ffb783',
        },
        border: {
          DEFAULT: '#292932',
          subtle: '#34343d',
        },
        status: {
          active: '#10B981',
          trial: '#F59E0B',
          expired: '#EF4444',
          pending: '#6366F1',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
