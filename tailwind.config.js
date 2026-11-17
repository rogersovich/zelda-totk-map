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
        totk: {
          bg: '#0a0d13',
          card: '#121824',
          hover: '#1b2334',
          border: '#233044',
          zonai: '#00f0ff',
          zonaiDark: '#08838a',
          gold: '#e5c158',
          goldDark: '#967b2c',
          gloom: '#ff2a4b',
          surface: '#3b82f6',
          sky: '#38bdf8',
          depths: '#ec4899',
        }
      },
      fontFamily: {
        hylian: ['Cinzel', 'Trajan Pro', 'serif', 'system-ui']
      }
    },
  },
  plugins: [],
}
