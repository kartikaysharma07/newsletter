/** @type {import('tailwindcss').Config} */
    module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
   extend: {
      colors: {
        'neutral-100': '#F5F5F5',
        'neutral-900': '#171717',
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};