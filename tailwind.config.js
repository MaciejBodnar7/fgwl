/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "fg-50": "#f0fdfb",
        "fg-100": "#cdfaf3",
        "fg-200": "#9cf3e7",
        "fg-300": "#62e6d9",
        "fg-400": "#32cfc5",
        "fg-500": "#18ada6",
        "fg-600": "#11908d",
        "fg-700": "#127371",
        "fg-800": "#135c5c",
        "fg-900": "#154c4b",
        "fg-950": "#052c2e",
        "fg-bg-dark": "#121212",
      },
    },
  },
  plugins: [],
}
