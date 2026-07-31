export default function PracticeCard({ exercise, difficulty, estimatedTime, onStart }) {
  const diffColor = {
    Easy:   { bg: 'var(--paper)', color: 'var(--signal)' },
    Medium: { bg: 'var(--paper)', color: '#0E9F8E' },
    Hard:   { bg: 'var(--paper)', color: 'var(--signal)' },
  }[difficulty] || { bg: 'var(--line)', color: 'var(--ink)' };

  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        transition: 'box-shadow 0.2s, transform 0.2s',
        cursor: 'default',
        boxShadow: 'var(--card-shadow)',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(14,159,142,.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--card-shadow)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 12,
          background: 'var(--blue-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.1rem', color: 'var(--blue-primary)' }}>
            {exercise}
          </span>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 4 }}>
            Practice {exercise}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 600,
              padding: '2px 8px', borderRadius: 999,
              background: diffColor.bg, color: diffColor.color,
            }}>
              {difficulty}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {estimatedTime}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="btn-primary"
        style={{ padding: '8px 18px', fontSize: '0.85rem', flexShrink: 0 }}
        id={`practice-card-start-${exercise.replace(/[^a-zA-Z]/g, '')}`}
      >
        Start
      </button>
    </div>
  );
}
