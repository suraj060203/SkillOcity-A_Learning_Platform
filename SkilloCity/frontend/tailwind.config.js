/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Vibrant Tech Palette (Indigo base)
        primary: {
          DEFAULT: '#4F46E5',   // indigo-600
          dark: '#4338CA',      // indigo-700
          light: '#EEF2FF',     // indigo-50
        },
        accent: {
          DEFAULT: '#8B5CF6',   // violet-500
          light: '#F5F3FF',     // violet-50
        },
        bg: '#F8FAFC',          // slate-50
        surface: '#FFFFFF',
        text: '#0F172A',        // slate-900
        muted: '#64748B',       // slate-500
        border: '#E2E8F0',      // slate-200
        success: {
          DEFAULT: '#10B981',
          light: '#ECFDF5',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FFFBEB',
          dark: '#D97706',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#FEF2F2',
          dark: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'], // Keep it uniform
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',     // Strict rounded-md
        lg: '12px',    // Cards
        xl: '16px',    // Overlays/Modals
        full: '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        'focus': '0 0 0 2px #FFFFFF, 0 0 0 4px #09090B',
      },
      fontSize: {
        'display-xl': ['4rem', { lineHeight: '1', letterSpacing: '-0.05em', fontWeight: '800' }],
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.04em', fontWeight: '700' }],
        'display': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.03em', fontWeight: '700' }],
        'heading': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '700' }],
        'body': ['0.875rem', { lineHeight: '1.5', letterSpacing: '-0.01em', fontWeight: '400' }],
      },
      animation: {
        'fade-up': 'fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)', // Snappy Apple-like bezier curve
      },
    },
  },
  plugins: [],
}
