/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      letterSpacing: {
        '0.5': '0.5px', // Add letter-spacing of 0.5px
      },
    },
  },
  plugins: [],
}
