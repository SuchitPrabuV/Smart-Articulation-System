export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Original palette
        paper:  '#FBF9F4',
        card:   '#FFFFFF',
        ink:    '#16233A',
        muted:  '#6E7A8C',
        line:   '#E3E0D8',
        signal: '#0E9F8E',
        alert:  '#E0803C',
        wrong:  '#C4553D',
        // Derived tints
        'signal-hover':  '#0A8A7A',
        'signal-light':  '#EDF7F6',
        'signal-mid':    '#C0E8E4',
        section:         '#F3F1EB',
        // Legacy aliases so no JSX needs updating
        primary:         '#0E9F8E',
        'primary-hover': '#0A8A7A',
        'blue-soft':     '#3DB8A7',
        'blue-light':    '#EDF7F6',
        'blue-mid':      '#C0E8E4',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
        // Legacy
        display: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
      },
      boxShadow: {
        card:    '0 1px 3px rgba(22,35,58,.05), 0 4px 16px rgba(22,35,58,.04)',
        'card-lg': '0 4px 24px rgba(14,159,142,.08), 0 1px 4px rgba(22,35,58,.06)',
        'signal-glow': '0 4px 20px rgba(14,159,142,.22)',
      },
    },
  },
  plugins: [],
};
