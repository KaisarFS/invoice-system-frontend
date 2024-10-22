const { nextui } = require('@nextui-org/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(autocomplete|avatar|button|date-picker|input|link|navbar|pagination|ripple|spinner|listbox|divider|popover|scroll-shadow|calendar|date-input).js"
  ],
  theme: {
    extend: {},
  },
  plugins: [nextui()],
};
