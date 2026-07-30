export default function RecordButton({ state, onStart, onStop, disabled }) {
  const recording = state === 'recording';
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={recording ? onStop : onStart}
      className="w-full h-14 rounded-[10px] font-display font-bold text-base
                 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      style={{
        background: recording ? 'var(--signal)' : 'var(--ink)',
        color: '#fff',
      }}
    >
      {recording ? 'Stop and score' : 'Record attempt'}
    </button>
  );
}
