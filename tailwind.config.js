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
          50: '#f0f4ff',
          100: '#e0e9fe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a6f6',
          500: '#0c87e8',
          600: '#006bc8',
          700: '#0055a4',
          800: '#054887',
          900: '#0a3c70',
          950: '#07264a',
        },
        ai: {
          purple: '#8b5cf6',
          pink: '#ec4899',
          indigo: '#6366f1',
          cyan: '#06b6d4',
          emerald: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(12, 135, 232, 0.3)',
        'glow-purple': '0 0 20px -5px rgba(139, 92, 246, 0.3)',
      }
    },
  },
  plugins: [],
}
