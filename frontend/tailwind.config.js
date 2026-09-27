/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // colors: {
      //   ink: '#18332f',
      //   cream: '#f5f1e8',
      //   paper: '#fffdf8',
      //   coral: '#e86d52',
      //   moss: '#789b68',
      //   gold: '#d9a441',
      // },
      colors: {
        ink:   '#1F1235',   // deep purple-black (hero, dark sections, hover states)
        cream: '#F7F4F0',   // warm off-white backgrounds & inputs
        paper: '#FFFFFF',   // clean white cards
        coral: '#5C2D91',   // official FUT Minna purple (main accent / CTAs / links)
        moss:  '#1E4D8C',   // logo blue (secondary accent)
        gold:  '#E8B923',   // logo gold / yellow ring & ribbon
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
