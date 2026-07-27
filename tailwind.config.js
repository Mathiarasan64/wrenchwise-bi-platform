/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#08C565',
          'green-hover': '#059669',
          blue: '#0B9BC5',
          'blue-hover': '#0284C7',
          main: '#F8FAFC',
          border: '#E5E7EB',
        },
        heading: {
          primary: '#111827',
          secondary: '#1F2937',
        },
        body: {
          text: '#374151',
          desc: '#4B5563',
          muted: '#6B7280',
          disabled: '#9CA3AF',
        },
        card: {
          criticalBg: '#FEF2F2',
          criticalBorder: '#DC2626',
          criticalTitle: '#991B1B',
          warningBg: '#FFFBEB',
          warningBorder: '#F59E0B',
          warningTitle: '#92400E',
          successBg: '#F0FDF4',
          successBorder: '#16A34A',
          successTitle: '#166534',
          infoBg: '#EFF6FF',
          infoBorder: '#2563EB',
          infoTitle: '#1D4ED8',
        },
        status: {
          successBg: '#DCFCE7',
          successText: '#166534',
          warningBg: '#FEF3C7',
          warningText: '#92400E',
          dangerBg: '#FEE2E2',
          dangerText: '#991B1B',
          infoBg: '#DBEAFE',
          infoText: '#1D4ED8',
        },
      },
      fontSize: {
        'page-title': ['32px', { lineHeight: '1.3', letterSpacing: '0em', fontWeight: '700' }],
        'section-heading': ['24px', { lineHeight: '1.3', letterSpacing: '0em', fontWeight: '600' }],
        'card-title': ['18px', { lineHeight: '1.3', letterSpacing: '0em', fontWeight: '600' }],
        'body-text': ['15px', { lineHeight: '1.6', letterSpacing: '0em', fontWeight: '500' }],
        'desc-text': ['14px', { lineHeight: '1.6', letterSpacing: '0em', fontWeight: '400' }],
        'table-header': ['15px', { lineHeight: '1.3', letterSpacing: '0em', fontWeight: '600' }],
        'table-text': ['14px', { lineHeight: '1.5', letterSpacing: '0em', fontWeight: '500' }],
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 12px rgba(15,23,42,0.06)',
        'card-hover': '0 8px 24px rgba(15,23,42,0.1)',
      },
      borderRadius: {
        '2xl': '16px',
        xl: '12px',
      },
      lineHeight: {
        heading: '1.3',
        body: '1.6',
      },
      animation: {
        'stagger-1': 'staggerIn 0.4s ease-out 0.05s forwards',
        'stagger-2': 'staggerIn 0.4s ease-out 0.1s forwards',
        'stagger-3': 'staggerIn 0.4s ease-out 0.15s forwards',
        'stagger-4': 'staggerIn 0.4s ease-out 0.2s forwards',
        'stagger-5': 'staggerIn 0.4s ease-out 0.25s forwards',
        'stagger-6': 'staggerIn 0.4s ease-out 0.3s forwards',
        'stagger-7': 'staggerIn 0.4s ease-out 0.35s forwards',
        'stagger-8': 'staggerIn 0.4s ease-out 0.4s forwards',
        'slide-up': 'slideInUp 0.35s ease-out forwards',
        'slide-right': 'slideInRight 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        staggerIn: {
          from: { opacity: '0', transform: 'translateY(12px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideInUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(8, 197, 101, 0.4)' },
          '50%': { boxShadow: '0 0 0 6px rgba(8, 197, 101, 0)' },
        },
      },
    },
  },
  plugins: [],
}
