/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6EE7F9',
          dark: '#22D3EE'
        }
      },
      boxShadow: {
        glass: '0 8px 30px rgba(0,0,0,0.25)'
      }
    },
  },
  plugins: [],
}

