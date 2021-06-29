const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');
const typographyPlugin = require('@tailwindcss/typography');

const typography = typographyPlugin();

module.exports = plugin(
  ({ addComponents, theme, variants }) => {
    typography.handler({ addComponents, theme, variants });
  },
  {
    theme: {
      backgroundSize:{
        'half': '50%',
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: colors.black,
        white: colors.white,
        gray: colors.warmGray,
        green: {
          500: '#00A99D',
        },
        pink: {
          500: '#C35484',
        },
        red: {
          500: '#F97373',
        },
        amber: {
          500: '#FFB53D',
        },
        cyan: {
          500: '#2D8CAE',
        },
      },
    },
    plugins: [typography],
  }
);
