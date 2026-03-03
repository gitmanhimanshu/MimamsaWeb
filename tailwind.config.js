/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF7700',
        secondary: '#FF9933',
        dark: '#FFFFFF',
        darker: '#FFF5E6',
      },
    },
  },
  plugins: [],
}
