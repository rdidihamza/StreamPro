import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#7C3AED',
          blue:   '#2563EB',
          cyan:   '#06B6D4',
          pink:   '#EC4899',
          glow:   '#A855F7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient':
          'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        'card-gradient':
          'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(37,99,235,0.15) 100%)',
      },
      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':        'float 6s ease-in-out infinite',
        'glow':         'glow 2s ease-in-out infinite alternate',
        'shimmer':      'shimmer 2s linear infinite',
        'logo-scroll':  'logo-scroll 40s linear infinite',
        // left-to-right ticker: starts shifted left (-50%) and slides back to 0
        'marquee':      'marquee 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-20px)' },
        },
        glow: {
          from: { boxShadow: '0 0 20px rgba(124,58,237,0.5)' },
          to:   { boxShadow: '0 0 40px rgba(124,58,237,0.9), 0 0 80px rgba(124,58,237,0.3)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'logo-scroll': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        // Direction: left → right.  Track is 2× wide (2 copies).
        // -50% of own width = exactly one copy width → seamless on wrap.
        'marquee': {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
      boxShadow: {
        'glow-purple': '0 0 30px rgba(124,58,237,0.6)',
        'glow-blue':   '0 0 30px rgba(37,99,235,0.6)',
        'glow-cyan':   '0 0 30px rgba(6,182,212,0.6)',
        'glow-pink':   '0 0 30px rgba(236,72,153,0.6)',
      },
    },
  },
  plugins: [],
};

export default config;
