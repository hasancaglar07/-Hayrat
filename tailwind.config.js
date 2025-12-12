/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        ui: ["InterVariable", "ui-sans-serif", "system-ui"],
        arabic: ["ScheherazadeNew-Regular", "serif"],
      },
      fontSize: {
        body: ["17px", { lineHeight: "26px" }],
        subtitle: ["20px", { lineHeight: "28px" }],
        title: ["28px", { lineHeight: "34px" }],
      },
    },
  },
  plugins: [],
};
