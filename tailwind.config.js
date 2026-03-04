/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './App.tsx'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#2D6A4F',
        accent: '#E9C46A',
        background: '#FAFAF5',
        surface: '#FFFFFF',
        error: '#DC2626',
      },
      fontFamily: {
        heading: ['DMSerifDisplay_400Regular'],
        body: ['DMSans_400Regular'],
        bodyMedium: ['DMSans_500Medium'],
        bodyBold: ['DMSans_700Bold'],
      },
    },
  },
  plugins: [],
};
