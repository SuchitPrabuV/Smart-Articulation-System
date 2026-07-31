const DEFAULT_ACTIVITY = [];

export default function ActivityTimeline({ items }) {
  const activities = items || DEFAULT_ACTIVITY;

  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--line)',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: 'var(--card-shadow)',
    }}>
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--line)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 2 }}>Recent Activity</h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--ink)' }}>Your latest sessions and achievements</p>
      </div>

      <div style={{ padding: '8px 20px 16px' }}>
        {activities.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--ink)' }}>
            <p style={{ fontSize: '0.9rem', marginBottom: 8 }}>No recent activity</p>
            <p style={{ fontSize: '0.75rem' }}>Your completed exercises will appear here.</p>
          </div>
        ) : (
          activities.map((item, i) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                gap: 14,
                padding: '12px 0',
                borderBottom: i < activities.length - 1 ? '1px solid var(--line)' : 'none',
                position: 'relative',
              }}
            >
              {/* Timeline dot + line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: 2 }}>
                <div style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: item.color + '18',
                  color: item.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                {i < activities.length - 1 && (
                  <div style={{
                    width: 1, flex: 1, background: 'var(--line)',
                    margin: '4px 0', minHeight: 16,
                  }} />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: 2 }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--ink)', marginBottom: 4, lineHeight: 1.4 }}>
                  {item.detail}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--ink)', fontWeight: 500 }}>
                  {item.time}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
