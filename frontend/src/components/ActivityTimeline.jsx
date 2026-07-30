const DEFAULT_ACTIVITY = [
  {
    id: 1,
    type: 'completed',
    title: 'Completed /S/ Exercise',
    detail: 'Scored 92 — Excellent',
    time: '2 minutes ago',
    color: 'var(--signal)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
  {
    id: 2,
    type: 'practice',
    title: 'Practice Session',
    detail: '/R/ · Word level · 5 exercises',
    time: '1 hour ago',
    color: 'var(--signal)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      </svg>
    ),
  },
  {
    id: 3,
    type: 'achievement',
    title: 'Achievement Unlocked',
    detail: '7-Day Streak — Keep it up!',
    time: '3 hours ago',
    color: 'var(--signal)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
  {
    id: 4,
    type: 'completed',
    title: 'Completed /TH/ Exercise',
    detail: 'Scored 88 — Good',
    time: 'Yesterday',
    color: 'var(--signal)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
  {
    id: 5,
    type: 'lesson',
    title: 'Started Advanced /R/ Lesson',
    detail: 'Sentence level · 8 exercises',
    time: 'Yesterday',
    color: '#0E9F8E',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
];

export default function ActivityTimeline({ items }) {
  const activities = items || DEFAULT_ACTIVITY;

  return (
    <div style={{
      background: 'white',
      border: '1px solid var(--paper)',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: 'var(--card-shadow)',
    }}>
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--paper)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 2 }}>Recent Activity</h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--ink)' }}>Your latest sessions and achievements</p>
      </div>

      <div style={{ padding: '8px 20px 16px' }}>
        {activities.map((item, i) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              gap: 14,
              padding: '12px 0',
              borderBottom: i < activities.length - 1 ? '1px solid var(--paper)' : 'none',
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
                  width: 1, flex: 1, background: 'var(--paper)',
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
        ))}
      </div>
    </div>
  );
}
