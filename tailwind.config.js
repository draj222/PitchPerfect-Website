/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "pitch-red": {
          50: "#fdf2f4",
          100: "#fce8eb",
          200: "#f9d0d8",
          300: "#f4a8b7",
          400: "#ed758e",
          500: "#e14968",
          600: "#C41E3A", // Main brand color
          700: "#a01930",
          800: "#85152a",
          900: "#701727",
          950: "#400712",
        },
        "pitch-dark": {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#0f0f0f",
          950: "#000000", // Main background
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}