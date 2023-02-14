/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    fontFamily: {
      primary: ['Poppins', 'sans-serif'],
    },
    extend: {
      colors: {
        content: {
          primary: '#FAFAFA',
        },
        card: {
          primary: '#262229',
        },
        gray: {
          100: '#f7fafc',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',
        },
        blue: {
          100: '#ebf8ff',
          200: '#bee3f8',
          300: '#90cdf4',
          400: '#63b3ed',
          500: '#4299e1',
          600: '#3182ce',
          700: '#2b6cb0',
          800: '#2c5282',
          900: '#2a4365',
        },
      },
    },
  },
  // add daisyUI plugin
  // disable esline because it will give Error: Unexpected require()
  /* eslint-disable */
  plugins: [require('daisyui')],

  // daisyUI config (optional)
  daisyui: {
    styled: true,
    themes: [ {
      genesis: {
          "primary": "#FFCF27",
          'primary-focus': '#D2A820',
          'primary-content': '#1E1B21',
          "secondary": "#FF7A00",
          'secondary-focus': '#D26400',
          'secondary-content': '#1E1B21',
          "accent": "#A3E635",
          'accent-focus': '#87BB2B',
          'accent-content': '#1E1B21',
          'neutral': '#FAFAFA',
          'neutral-focus': '#BABABA',
          'neutral-content': '#FAFAFA',
          'base-50': '#37323D',
          "base-100": "#1E1B21",
          'base-200': '#16141A',
          'base-300': '#1E1B21',
          'base-content': '#FAFAFA',
          "info": "#22D3EE",
          'info-content': '#083B43',
          "success": "#34D399",
          'success-content': '#0E3B2B',
          "warning": "#F472B6",
          'warning-content': '#44182F',
          "error": "#E11D48",
          'error-content': '#3F0814'
        }
      },
      'night'
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: '',
    darkTheme: 'genesis',
  },
};
