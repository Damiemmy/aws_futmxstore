/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1F1235',
        cream: '#F7F4F0',
        paper: '#FFFFFF',
        coral: '#5C2D91',
        moss: '#E8B923',
        gold: '#d9a441',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['DM Sans', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 50px rgba(24, 51, 47, 0.08)',
      },
    },
  },
  plugins: [],
}
