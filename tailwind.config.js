/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          tricolor: {
            saffron: '#FF9933',
            white: '#FFFFFF',
            green: '#138808',
            navy: '#000080'
          },
          primary: '#0B6623',       // Gov Agriculture Green
          primaryDark: '#084819',
          primaryLight: '#E8F5E9',
          secondary: '#1A365D',     // Deep Gov Navy
          secondaryLight: '#EBF8FF',
          accent: '#D97706',        // Amber/Harvest Gold
          accentLight: '#FEF3C7',
          surface: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          darkText: '#0F172A',
          mutedText: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
