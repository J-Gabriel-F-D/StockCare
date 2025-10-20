// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        "custom-green": {
          50: "#eefff7",
          100: "#d9ffe9",
          200: "#aaffd1",
          300: "#77feba",
          400: "#4dfea1",
          500: "#21d37f",
          600: "#16a862",
          700: "#148250",
          800: "#075832",
          900: "#031f10",
        },
      },
    },
  },
  plugins: [],
};
