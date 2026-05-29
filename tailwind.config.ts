import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // MintPrompt uses CSS custom properties as the primary design system.
  // Tailwind provides utility classes for layout and spacing helpers.
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        dm: ['var(--font-dm-sans)', 'sans-serif'],
      },
      colors: {
        bg:      'var(--bg)',
        bg2:     'var(--bg2)',
        bg3:     'var(--bg3)',
        bg4:     'var(--bg4)',
        accent:  'var(--accent)',
        accent2: 'var(--accent2)',
        muted:   'var(--muted)',
        muted2:  'var(--muted2)',
      },
      borderRadius: {
        card: 'var(--r)',
        box:  'var(--r2)',
        pill: 'var(--r3)',
      },
      // Custom animations (prefixed 'mp-' to avoid collision with Tailwind defaults)
      animation: {
        'mp-shimmer': 'mp-shimmer 1.4s ease-in-out infinite',
        'mp-pulse':   'mp-pulse 1.2s ease-in-out infinite',
      },
      keyframes: {
        'mp-shimmer': {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'mp-pulse': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%':      { opacity: '1',   transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
