/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mana: {
          white: '#f8f5e4',
          blue: '#3a6ea5',
          black: '#1b1a1f',
          red: '#8c1c13',
          green: '#2d6a4f',
          gold: '#bfa76f',
          purple: '#4B3172',
        },
      },
      borderColor: {
        mana: {
          gold: '#bfa76f',
        },
      },
      fontFamily: {
        magic: ['"Cinzel Decorative"', 'serif'],
      },
      boxShadow: {
        magic: '0 4px 15px rgba(255, 215, 0, 0.4)',
      },
    },
  },
  plugins: [],
}

