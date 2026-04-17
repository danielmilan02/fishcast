/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0a1628',
          mid: '#0f2044',
          light: '#1a3560',
        },
        ocean: '#0e4f7a',
        water: '#1a7aad',
        foam: '#4fb0d9',
        sand: '#e8d5a3',
        go: '#2ec08c',
        caution: '#f0a83a',
        stop: '#e24b4a',
      },
      fontFamily: {
        sans: ['Barlow', 'sans-serif'],
        condensed: ['Barlow Condensed', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
