/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        hand: ["'Nanum Pen Script'", "cursive"],
      },
    },
  },
  plugins: [],
};