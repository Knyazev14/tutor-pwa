/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3e9ff',
          100: '#e7d3ff',
          200: '#d0a7ff',
          300: '#b87aff',
          400: '#a14eff',
          500: '#8936FF',
          600: '#6e2bcc',
          700: '#522099',
          800: '#371666',
          900: '#1b0b33',
        },
        secondary: {
          500: '#2EC6FE',
        },
        success: '#2ecc71',
        danger: '#ff4444',
        warning: '#ffbb33',
        info: '#3498db',
      },
    },
  },
  plugins: [],
}