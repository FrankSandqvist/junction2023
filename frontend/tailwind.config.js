/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        unbounded: "Unbounded",
      },
      animation: {
        run: "run 0.4s ease infinite",
        rock: "rock 0.5s ease infinite",
        wave: "wave 2s ease infinite",
      },
      keyframes: {
        run: {
          "0%, 100%": { transform: "translateY(-3%) scale(1.4)" },
          "50%": { transform: "translateY(3%) scale(1.4)" },
        },
        rock: {
          "0€": { transform: "scale(1)" },
          "10%": { transform: "scale(1.07)" },
          "30%": { transform: "scale(0.98)" },
          "50%": { transform: "scale(1)" },
        },
        wave: {
          "0%, 100%": { transform: "translateY(-3%) scale(1.4)" },
          "50%": { transform: "translateY(3%) scale(1.4)" },
        },
      },
    },
  },
  plugins: [],
};
