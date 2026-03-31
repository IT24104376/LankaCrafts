
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: '#C65D3B',
          light: '#D4745A',
          dark: '#A84D2E',
        },
        forest: {
          DEFAULT: '#2F5D50',
          light: '#3D7A69',
          dark: '#1E3D35',
        },
        mustard: {
          DEFAULT: '#C9A227',
          light: '#D9B84A',
          dark: '#A8871F',
        },
        offwhite: {
          DEFAULT: '#F6F3EE',
          dark: '#EDE8E0',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
