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
      keyframes: {
        bump: {
          '0%, 100%': { transform: 'scaleY(1);' },
          '50%': { transform: 'scaleY(1.2);' },
        }
      },
      animation: {
        bump: 'bump 0.25s ease-in-out',
      }
    },
  },
  plugins: [],
}