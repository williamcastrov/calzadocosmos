/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}",
            './pages/**/*.{js,ts,jsx,tsx}',
            './components/**/*.{js,ts,jsx,tsx}',
  ],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#00040f",
        textcolorcomos: "#CB8576",
        secondary: "#00f6ff",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",
        cosmocolor: "rgba(246, 196, 159)",
        basecosmos: "rgba(204, 134, 121)",
        blue: "rgba(93, 173, 226)",
        sidebar: "rgba(241, 245, 249)",
        redhdr: "rgba(248, 161, 164)",
        orange: "rgba(211, 84, 0)",
        violet: "rgba(163, 73, 164)",
        green: "rgba(82, 190, 128)",
        yellow: "rgba(244, 208, 83)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};