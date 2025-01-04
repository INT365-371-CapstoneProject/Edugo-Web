/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        redcolor: '#BE3C7E',
      },
      fontFamily: {
        'DM': ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [
    daisyui,
  ],
}