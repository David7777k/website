/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Base Dark Theme
        base: '#0F172A',
        surface: {
          DEFAULT: '#0B1220',
          light: '#111827',
        },
        // Text Colors
        text: {
          DEFAULT: '#E5E7EB',
          muted: '#94A3B8',
          dim: '#64748B',
        },
        // Bamboo Green Accent (PANDA DNA)
        accent: {
          DEFAULT: '#10B981',
          hover: '#34D399',
          dark: '#059669',
          light: '#6EE7B7',
        },
        // Utility Colors
        warn: '#F59E0B',
        danger: '#EF4444',
        success: '#22C55E',
        info: '#3B82F6',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0,0,0,.35)',
        'sm': '0 4px 10px rgba(0,0,0,.35)',
        'card': '0 10px 30px rgba(0,0,0,.35)',
        'glow': '0 0 0 1px rgba(16,185,129,.25), 0 8px 30px rgba(16,185,129,.12)',
        'glow-strong': '0 0 0 2px rgba(16,185,129,.4), 0 12px 40px rgba(16,185,129,.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            opacity: '1',
            boxShadow: '0 0 0 1px rgba(16,185,129,.25), 0 8px 30px rgba(16,185,129,.12)'
          },
          '50%': { 
            opacity: '.9',
            boxShadow: '0 0 0 2px rgba(16,185,129,.4), 0 12px 40px rgba(16,185,129,.25)'
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}