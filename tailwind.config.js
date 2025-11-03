module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#FFF5F9',
          100: '#FDE6EE',
          200: '#F9BFD3',
          300: '#F292B4',
          400: '#E2608E',
          500: '#C93D6F',
          600: '#A81D54',
          700: '#7F033E', // base color
          800: '#640234',
          900: '#3D0120',
        },
        vistablue: {
          50:  '#F3F5FB',
          100: '#E7EBF6',
          200: '#C9D2EA',
          300: '#AAB9DE',
          400: '#8EA3D5',
          500: '#98A6D4', // base color
          600: '#7A89C1',
          700: '#5E6CA7',
          800: '#424F8C',
          900: '#283373',
          950: '#161B4D',
        },
        'nav-grey': '#343a40',
        
      },
    },
  },
  plugins: [],
};
