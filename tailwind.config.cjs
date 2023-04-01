/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wordle-correct-color': '#65a30d',
        'wordle-misplaced-color': '#eab308',
        'wordle-wrong-color': '#6b7280',
        'wordle-unchecked-color': '#ffffff',
        'wordle-unused-color': '#D6D3D1',
      },
    },
  },
  plugins: [],
}