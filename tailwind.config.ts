import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx,mdx}', './content/**/*.{md,mdx}'],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1.25rem',
        screens: {
          '2xl': '1180px'
        }
      },
      fontFamily: {
        /* Everything is JetBrains Mono */
        sans:    ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
        mono:    ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace']
      },
      colors: {
        bg:      'hsl(var(--bg))',
        fg:      'hsl(var(--fg))',
        muted:   'hsl(var(--muted))',
        border:  'hsl(var(--border))',
        card:    'hsl(var(--card))',
        accent:  'hsl(var(--accent))',
        success: 'hsl(var(--success))'
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0' }
        },
        'crt-flicker': {
          '0%, 94%, 100%': { opacity: '1' },
          '95%':            { opacity: '0.97' },
          '97%':            { opacity: '0.95' },
          '98%':            { opacity: '0.98' }
        },
        'type-cursor': {
          '0%, 100%': { borderRightColor: '#00ff41' },
          '50%':       { borderRightColor: 'transparent' }
        }
      },
      animation: {
        blink:       'blink 1s step-end infinite',
        flicker:     'crt-flicker 8s infinite',
        'type-cursor': 'type-cursor 0.75s step-end infinite'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};

export default config;
