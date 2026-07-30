export default function Waveform({ isRecording = false, heights }) {
  const BAR_COUNT = 32;
  const defaultHeights = heights || Array.from({ length: BAR_COUNT }, (_, i) => {
    const x = i / (BAR_COUNT - 1);
    return 0.15 + 0.7 * Math.sin(Math.PI * x) * (0.6 + 0.4 * Math.sin(4 * Math.PI * x));
  });

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      height: 80,
      padding: '0 8px',
    }}>
      {defaultHeights.map((h, i) => (
        <div
          key={i}
          className={isRecording ? 'wave-bar' : 'wave-bar wave-bar-idle'}
          style={{
            height: `${Math.max(6, Math.round(h * 72))}px`,
            animationDelay: isRecording ? `${(i % 8) * 0.1}s` : '0s',
            background: isRecording
              ? `linear-gradient(to top, var(--signal), var(--signal))`
              : '#FBF9F4',
            transition: 'background 0.3s',
          }}
        />
      ))}
    </div>
  );
}
