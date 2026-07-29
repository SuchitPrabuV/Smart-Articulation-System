export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)', card: 'var(--card)', ink: 'var(--ink)',
        muted: 'var(--muted)', line: 'var(--line)',
        signal: 'var(--signal)', alert: 'var(--alert)', wrong: 'var(--wrong)',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
