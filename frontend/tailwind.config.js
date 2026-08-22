/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#18332f',
        cream: '#f5f1e8',
        paper: '#fffdf8',
        coral: '#e86d52',
        moss: '#789b68',
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
