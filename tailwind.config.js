/** @return {import('tailwindcss').Config} */
module.exports = {
  important: true,
  corePlugins: {
    container: false,
  },
  theme: { 
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
