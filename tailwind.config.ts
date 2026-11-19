import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
    './content/**/*.{md,mdx}'
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
        screens: {
          '2xl': '920px'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: [
          'var(--font-sans)',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ],
        mono: [
          'var(--font-mono)',
          'ui-monospace',
          'SFMono-Regular',
          'monospace'
        ]
      },
      colors: {
        bg: 'hsl(var(--bg) / <alpha-value>)',
        fg: 'hsl(var(--fg) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        subtle: 'hsl(var(--subtle) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        card: 'hsl(var(--card) / <alpha-value>)',
        accent: 'hsl(var(--accent) / <alpha-value>)',
        success: 'hsl(var(--success) / <alpha-value>)'
      },
      borderRadius: {
        card: '1.75rem'
      },
      boxShadow: {
        card: '0 1px 2px rgba(17,17,17,0.04), 0 12px 32px -16px rgba(17,17,17,0.12)',
        chip: '0 1px 2px rgba(17,17,17,0.06), 0 4px 12px -4px rgba(17,17,17,0.10)'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};

export default config;
