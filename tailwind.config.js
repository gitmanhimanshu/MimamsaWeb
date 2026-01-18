/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4299e1',
        secondary: '#2d3748',
        dark: '#1a1a1a',
        darker: '#0f0f0f',
      },
    },
  },
  plugins: [],
}
