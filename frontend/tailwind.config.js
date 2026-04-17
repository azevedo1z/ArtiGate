const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        snow: '#FFFFFF',
        primary: {
          50: '#EEF1FE',
          100: '#DCE3FD',
          200: '#B9C8FB',
          300: '#8FA4F7',
          400: '#6683F3',
          500: '#4361EE',
          600: '#3651D4',
          700: '#2B42AE',
          800: '#223488',
          900: '#192862',
          DEFAULT: '#4361EE',
        },
        accent: {
          50: '#E8F8FD',
          100: '#D1F1FB',
          200: '#A3E4F7',
          300: '#75D6F3',
          400: '#4CC9F0',
          500: '#1BB0E0',
          600: '#1691B8',
          700: '#117390',
          DEFAULT: '#4CC9F0',
        },
        ink: {
          50: '#F5F5F7',
          100: '#E8E9ED',
          200: '#C7C9D2',
          300: '#A5A8B6',
          400: '#6B6E7F',
          500: '#4A4D63',
          600: '#3E415A',
          700: '#2B2D42',
          800: '#1B1D2C',
          900: '#0D0E18',
          DEFAULT: '#2B2D42',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        serif: ['"Source Serif Pro"', 'Georgia', 'serif'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgb(43 45 66 / 0.04)',
        card: '0 1px 3px 0 rgb(43 45 66 / 0.06), 0 1px 2px -1px rgb(43 45 66 / 0.04)',
      },
    },
  },
  plugins: [],
};
