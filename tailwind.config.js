/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Keep dark mode config for future toggle optionality — no dark styles authored
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Serif Canvas ──────────────────────────────────────────
        background: '#FAFAF8', // warm ivory — primary canvas
        foreground: '#1A1A1A', // rich black — primary text
        card:       '#FFFFFF', // pure white — lifts off ivory background

        // ── Surfaces ──────────────────────────────────────────────
        muted: {
          DEFAULT:    '#F5F3F0', // secondary surfaces, hover tints
          foreground: '#6B6B6B', // secondary text, warm gray
        },

        // ── Accent (Burnished Gold) ────────────────────────────────
        accent: {
          DEFAULT:    '#B8860B', // primary gold — links, CTAs, highlights
          secondary:  '#D4A84B', // lighter gold — hover states, gradients
          foreground: '#FFFFFF', // text on accent backgrounds
          muted:      'rgba(184,134,11,0.06)', // featured card background tint
        },

        // ── Borders ────────────────────────────────────────────────
        border: {
          DEFAULT: '#E8E4DF', // warm gray — all rules, dividers, card borders
          hover:   '#D4CFC9', // slightly deeper on hover
        },

        // ── Form ───────────────────────────────────────────────────
        input: '#E8E4DF',
        ring:  '#B8860B', // focus rings match accent gold

        // ── Semantic Status (preserved, softened for warmth) ───────
        status: {
          active:  '#16A34A', // green-700 equivalent
          trial:   '#D97706', // amber-600
          expired: '#DC2626', // red-600
          pending: '#7C3AED', // violet-600
        },
      },

      fontFamily: {
        // Display / headlines — Playfair Display (soul of the design)
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        // Body / UI — Source Sans 3 (clean, legible, complements serif)
        sans:  ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        // Labels / small-caps — IBM Plex Mono (editorial tracking)
        mono:  ['"IBM Plex Mono"', 'monospace'],
      },

      boxShadow: {
        'serif-sm':     '0 1px 2px rgba(26,26,26,0.04)',
        'serif-md':     '0 4px 12px rgba(26,26,26,0.06)',
        'serif-lg':     '0 8px 24px rgba(26,26,26,0.08)',
        'serif-accent': '0 4px 16px rgba(184,134,11,0.18)',
      },

      letterSpacing: {
        'small-caps': '0.15em',
        'editorial':  '0.08em',
      },
    },
  },
  plugins: [],
};
