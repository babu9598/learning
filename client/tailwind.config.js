/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7fb',
          100: '#e1eff6',
          200: '#cbdde9', // Cloudy Sky
          300: '#99c0da',
          400: '#5f9ec5',
          500: '#2872a1', // Ocean Blue
          600: '#205d86',
          700: '#1c4c6e',
          800: '#1a405c',
          900: '#19364e',
          950: '#0e2233',
        },
        cloudy: {
          50: '#F8FBFC',
          100: '#EDF4F8',
          200: '#CBDDE9',
          300: '#B3CDDF',
          400: '#86ABC5',
          500: '#5A8BAE',
        },
        darkbg: {
          950: '#090f1d',
          900: '#0e182a',
          800: '#15233c',
          700: '#1e3252',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(40, 114, 161, 0.08)',
        'elevated': '0 10px 30px -5px rgba(14, 34, 51, 0.15)',
        'glow': '0 0 25px -5px rgba(40, 114, 161, 0.35)',
      }
    },
  },
  plugins: [],
}
