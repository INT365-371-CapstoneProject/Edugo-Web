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
        dmSans: ['DM Sans', 'sans-serif'],
      },
      keyframes: {
        'custom-popup': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        'custom-popup': 'custom-popup 0.3s ease-out forwards'
      }
    },
  },
  plugins: [
    daisyui,
  ],
  corePlugins: {
    // ...existing corePlugins
  },
}