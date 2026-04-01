/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        surface: '#141414',
        surface2: '#1C1C1C',
        border: '#2A2A2A',
        primary: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
        'primary-dim': 'rgb(var(--color-primary-rgb) / 0.125)',
        'text-primary': '#FFFFFF',
        'text-secondary': '#888888',
        success: '#00FF87',
        danger: '#FF4444',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        pbPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' }
        },
        flash: {
          '0%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: '#00FF8720' },
          '100%': { backgroundColor: 'transparent' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        scaleIn: 'scaleIn 0.2s ease-out',
        slideUp: 'slideUp 0.3s ease-out',
        shimmer: 'shimmer 1.5s infinite linear',
        pbPulse: 'pbPulse 0.4s ease-in-out',
        flash: 'flash 0.6s ease-in-out'
      }
    },
  },
  plugins: [],
}