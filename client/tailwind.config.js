/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#ffc107',
          DEFAULT: '#f0a500', // Warm Gold (from logo)
          dark: '#c58a00',
        },
        secondary: {
          light: '#2d3f61',
          DEFAULT: '#1a2a4a', // Deep Blue (from logo)
          dark: '#0e1a2f',
        },
        background: '#fdfaf2', // A softer, warmer off-white for body
        'text-main': '#1a2a4a', // Use the deep blue for main text
        'text-light': '#f5f5f5', // Cream/off-white for text on dark backgrounds
      },
      fontFamily: {
        sans: ['Campton', 'sans-serif'],
      },
    },
  },
  plugins: [],
};