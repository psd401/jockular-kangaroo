const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#25424C',
        secondary: '#6CA18A',
        background: '#D7CDBE',
        accent: '#346780',
        'accent-hover': '#7396A9',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} 