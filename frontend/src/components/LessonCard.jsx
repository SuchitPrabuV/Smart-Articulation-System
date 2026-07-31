import { Link } from 'react-router-dom';

export default function LessonCard({ target, info }) {
  const { id, phoneme, levels } = target;
  const wordCount     = levels?.word?.length     || 0;
  const sentenceCount = levels?.sentence?.length || 0;
  const soundCount    = levels?.sound?.length    || 1;

  return (
    <Link
      to={`/app/practice/${id}`}
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: 16,
          padding: '22px 22px 20px',
          cursor: 'pointer',
          transition: 'all 0.22s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--card-shadow)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--signal-mid)';
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 8px 28px rgba(14,159,142,.12)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--line)';
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = 'var(--card-shadow)';
        }}
      >
        {/* Phoneme symbol */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: 14,
            background: 'linear-gradient(135deg, var(--paper), var(--signal-light))',
            border: '1px solid var(--signal-mid)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.4rem', color: 'var(--signal)' }}>
              {info?.label || phoneme}
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--ink)', fontFamily: 'monospace', marginTop: 4 }}>
            {info?.ipa || ''}
          </span>
        </div>

        {/* Cue */}
        {info?.cue && (
          <p style={{ fontSize: '0.85rem', color: 'var(--ink)', lineHeight: 1.55, marginBottom: 16, flex: 1 }}>
            {info.cue}
          </p>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
          {[
            { label: 'Sounds', val: soundCount },
            { label: 'Words', val: wordCount },
            { label: 'Sentences', val: sentenceCount },
          ].map((s) => (
            <div key={s.label} style={{
              flex: 1, textAlign: 'center',
              background: 'var(--paper)',
              borderRadius: 8, padding: '6px 4px',
            }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{s.val}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--ink)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
