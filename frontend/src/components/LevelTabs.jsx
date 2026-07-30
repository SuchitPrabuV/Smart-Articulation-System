const LEVELS = [
  { id: 'sound', label: 'Sound' },
  { id: 'word', label: 'Word' },
  { id: 'sentence', label: 'Sentence' },
];

export default function LevelTabs({ value, onChange }) {
  return (
    <div className="inline-flex border border-line rounded-[10px] overflow-hidden">
      {LEVELS.map((l, i) => (
        <button
          key={l.id}
          onClick={() => onChange(l.id)}
          className={`px-5 h-10 text-sm font-medium ${i > 0 ? 'border-l border-line' : ''}`}
          style={{
            background: value === l.id ? 'var(--ink)' : 'transparent',
            color: value === l.id ? '#fff' : 'var(--ink)',
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
