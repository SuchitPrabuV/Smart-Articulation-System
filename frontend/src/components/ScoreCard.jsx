export default function ScoreCard({ scores }) {
  const defaultScores = scores || [
    { exercise: '/S/', score: 89, status: 'Excellent' },
    { exercise: '/R/', score: 84, status: 'Good' },
    { exercise: '/TH/', score: 92, status: 'Excellent' },
    { exercise: '/L/', score: 88, status: 'Good' },
    { exercise: '/CH/', score: 76, status: 'Fair' },
  ];

  const statusConfig = {
    Excellent: { bg: '#FFFFFF', color: 'var(--signal)' },
    Good:      { bg: 'var(--signal-light)', color: 'var(--signal)' },
    Fair:      { bg: '#FFFFFF', color: '#0E9F8E' },
    Poor:      { bg: '#FFFFFF', color: 'var(--signal)' },
  };

  return (
    <div style={{
      background: 'white',
      border: '1px solid var(--paper)',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: 'var(--card-shadow)',
    }}>
      <div style={{
        padding: '18px 20px 14px',
        borderBottom: '1px solid var(--paper)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 2 }}>Recent Scores</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--ink)' }}>Latest exercise results</p>
        </div>
        <span className="badge badge-blue">{defaultScores.length} exercises</span>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--paper)' }}>
            {['Exercise', 'Score', 'Rating', 'Progress'].map((h) => (
              <th
                key={h}
                style={{
                  padding: '10px 20px',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--ink)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {defaultScores.map((row, i) => {
            const cfg = statusConfig[row.status] || statusConfig.Fair;
            return (
              <tr
                key={i}
                style={{
                  borderBottom: i < defaultScores.length - 1 ? '1px solid var(--paper)' : 'none',
                  transition: 'background 0.15s',
                  cursor: 'default',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--paper)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 20px' }}>
                  <span style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                  }}>
                    {row.exercise}
                  </span>
                </td>
                <td style={{ padding: '12px 20px' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    {row.score}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ink)', marginLeft: 2 }}>/100</span>
                </td>
                <td style={{ padding: '12px 20px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '3px 10px', borderRadius: 999,
                    fontSize: '0.78rem', fontWeight: 600,
                    background: cfg.bg, color: cfg.color,
                  }}>
                    {row.status}
                  </span>
                </td>
                <td style={{ padding: '12px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: '#FBF9F4', borderRadius: 999, overflow: 'hidden', maxWidth: 80 }}>
                      <div style={{
                        height: '100%',
                        width: `${row.score}%`,
                        background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}99)`,
                        borderRadius: 999,
                        transition: 'width 0.8s ease',
                      }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: cfg.color, minWidth: 28 }}>{row.score}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
