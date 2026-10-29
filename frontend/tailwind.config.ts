/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        bg2: 'var(--bg2)',
        tx: 'var(--tx)',
        mu: 'var(--mu)',
        clay: 'var(--ac)',
        teal: 'var(--ac2)',
        ok: 'var(--status-ok)',
        warn: 'var(--status-warn)',
        bad: 'var(--status-bad)',
        cardBorder: 'var(--card-border)',
        cardBg: 'var(--card-bg)',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card: '22px',
      },
      boxShadow: {
        glow: '0 0 25px -5px var(--glow-color)',
        subtle: '0 4px 20px -2px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}
