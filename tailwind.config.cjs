/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Material Design inspired colors
        primary: '#6200EE', // A vibrant purple
        'primary-variant': '#3700B3',
        secondary: '#03DAC6', // A teal color
        'secondary-variant': '#018786',

        background: '#FFFFFF',
        surface: {
          1: '#FFFFFF',
          2: '#F5F5F5',
          3: '#E0E0E0',
        },

        error: '#B00020',

        'on-primary': '#FFFFFF',
        'on-secondary': '#000000',
        'on-background': '#000000',
        'on-surface': '#000000',
        'on-surface-variant': '#424242',
        'on-error': '#FFFFFF',
      },
    },
  },
  plugins: [],
};