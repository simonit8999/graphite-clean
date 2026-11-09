/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050505',
        surface: '#121212',
        zincsoft: '#A1A1AA',
        accent: 'rgb(var(--accent) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Montserrat', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(var(--accent), 0.35)',
        glowlg: '0 0 40px rgba(var(--accent), 0.45)',
      },
      backgroundImage: {
        'glass': 'linear-gradient(140deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
      },
      keyframes: {
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      },
      animation: { floaty: 'floaty 4s ease-in-out infinite' },
    },
  },
  plugins: [],
}