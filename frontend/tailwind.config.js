/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sc: {
          blue: {
            dark: "#131921",
            light: "#232f3e",
            highlight: "#37475a",
          },
          yellow: {
            DEFAULT: "#febd69",
            hover: "#f3a847",
            dark: "#f0c14b",
            button: "#f7ca00",
          },
          orange: "#ff9900",
          gray: {
            light: "#eaeded",
            medium: "#d5dbdb",
            dark: "#565959",
          },
          link: "#007185",
          danger: "#b12704",
          success: "#067D62",
        },
      },
      boxShadow: {
        'sc': '0 2px 5px 0 rgba(213,217,217,.5)',
        'sc-focus': '0 0 3px 2px rgba(228,121,17,.5)',
      }
    },
  },
  plugins: [],
};

