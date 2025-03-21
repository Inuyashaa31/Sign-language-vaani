/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "primary":"#6a7bff",
        "secondary": "#ffe1fa",
        "tertiary": "#a8d6f3",
        "font": "#d6d3d6",
      },
    },
  },
  plugins: [],
}

