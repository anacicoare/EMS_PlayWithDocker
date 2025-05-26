/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./contents/components/**/*.{js,ts,jsx,tsx}",
    "./contents/layout/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scrollBehavior: ['smooth'],
      colors: {
        "gray-bg": "#dee2e6",
        black: "#000",
        white: "#fff"
      },
      rotate: {
        'y-180': '180deg',
      },
      boxShadow: {
        'box1': '1px 2px 6px rgba(0, 0, 0, 0.4)',
        'box2': '0px 1px 4px 1px rgba(0, 0, 0, 0.15)',
        'box3': '1px 3px 4px 0px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.perspective-1000': {
          'perspective': '1000px',
        },
        '.transform-style-preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.rotate-y-180': {
          'transform': 'rotateY(180deg)',
        },
      });
    },
  ],
}