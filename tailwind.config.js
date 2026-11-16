/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4fa',
          100: '#d9e2f1',
          200: '#b3c5e3',
          300: '#8da7d4',
          400: '#6889c6',
          500: '#426bb7',
          600: '#35569a',
          700: '#1f3a6e',
          800: '#15274f',
          900: '#0d1a36',
          950: '#070f23',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(13, 26, 54, 0.08), 0 1px 2px -1px rgba(13, 26, 54, 0.06)',
        'card-hover': '0 10px 30px -10px rgba(13, 26, 54, 0.20)',
      },
    },
  },
  plugins: [],
};
