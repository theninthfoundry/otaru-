import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        otaru: {
          ink: 'var(--color-ink)',
          'ink-muted': 'var(--color-ink-muted)',
          'ink-subtle': 'var(--color-ink-subtle)',
          chalk: 'var(--color-chalk)',
          'chalk-warm': 'var(--color-chalk-warm)',
          cream: 'var(--color-cream)',
          stone: 'var(--color-stone)',
          'stone-light': 'var(--color-stone-light)',
          'stone-dark': 'var(--color-stone-dark)',
          accent: 'var(--color-chapter-accent)',
          error: 'var(--color-error)',
          success: 'var(--color-success)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'display-xl': [
          'var(--text-display-xl)',
          { lineHeight: 'var(--leading-display-xl)' },
        ],
        'display-lg': [
          'var(--text-display-lg)',
          { lineHeight: 'var(--leading-display-lg)' },
        ],
        'display-md': [
          'var(--text-display-md)',
          { lineHeight: 'var(--leading-display-md)' },
        ],
        'heading-lg': [
          'var(--text-heading-lg)',
          { lineHeight: 'var(--leading-heading-lg)' },
        ],
        'heading-md': [
          'var(--text-heading-md)',
          { lineHeight: 'var(--leading-heading-md)' },
        ],
        'heading-sm': [
          'var(--text-heading-sm)',
          { lineHeight: 'var(--leading-heading-sm)' },
        ],
        'body-lg': [
          'var(--text-body-lg)',
          { lineHeight: 'var(--leading-body-lg)' },
        ],
        'body-md': [
          'var(--text-body-md)',
          { lineHeight: 'var(--leading-body-md)' },
        ],
        'body-sm': [
          'var(--text-body-sm)',
          { lineHeight: 'var(--leading-body-sm)' },
        ],
        caption: [
          'var(--text-caption)',
          { lineHeight: 'var(--leading-caption)' },
        ],
        overline: [
          'var(--text-overline)',
          { lineHeight: 'var(--leading-overline)' },
        ],
      },
      spacing: {
        'grid-margin': 'var(--grid-margin)',
        'grid-gutter': 'var(--grid-gutter)',
      },
      maxWidth: {
        grid: 'var(--grid-max-width)',
      },
      transitionDuration: {
        instant: 'var(--motion-duration-instant)',
        subtle: 'var(--motion-duration-subtle)',
        editorial: 'var(--motion-duration-editorial)',
      },
      transitionTimingFunction: {
        settle: 'var(--motion-easing-settle)',
        editorial: 'var(--motion-easing-editorial)',
        spring: 'var(--motion-easing-spring)',
      },
      boxShadow: {
        'otaru-sm': 'var(--elevation-sm)',
        'otaru-md': 'var(--elevation-md)',
        'otaru-lg': 'var(--elevation-lg)',
      },
      letterSpacing: {
        editorial: 'var(--tracking-editorial)',
        overline: 'var(--tracking-overline)',
      },
    },
  },
  plugins: [],
};

export default config;
