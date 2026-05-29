/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      width:  { popup: '400px' },
      height: { popup: '600px' },
      fontFamily: {
        sans: ['Inter Variable', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eef2ff',
          500: '#6366f1',
          900: '#1e1b4b',
        }
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'   },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0'  },
        }
      },
      animation: {
        'fade-up': 'fade-up .35s ease both',
        'shimmer': 'shimmer 1.5s linear infinite',
      }
    },
  },
  plugins: [],
}