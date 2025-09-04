/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#ffb74d',
          DEFAULT: '#ff9800',
          dark: '#f57c00',
        },
        secondary: '#424242',
        background: '#fffbf2',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        serif: ['"Lora"', 'serif'],
      },
    },
  },
  plugins: [],
};