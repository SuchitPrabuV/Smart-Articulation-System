import { TARGETS, phonemeInfo } from '../data/loadContent';
import LessonCard from '../components/LessonCard';

export default function Lessons() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: 4 }}>
          Practice Library
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>
          Choose a target sound to begin practicing
        </p>
      </div>

      {/* Search / filter bar */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="search"
            placeholder="Search sounds…"
            style={{
              width: '100%', padding: '9px 14px 9px 38px',
              background: 'var(--card)', border: '1px solid var(--line)',
              borderRadius: 10, fontSize: '0.875rem',
              color: 'var(--text-primary)', outline: 'none',
              fontFamily: 'var(--font-body)', boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--blue-primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--line)'}
          />
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--ink)', fontWeight: 500, whiteSpace: 'nowrap' }}>
          {TARGETS.length} exercises available
        </span>
      </div>

      {/* Lesson grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
        {TARGETS.map((target) => (
          <LessonCard
            key={target.id}
            target={target}
            info={phonemeInfo(target.phoneme)}
          />
        ))}
      </div>
    </div>
  );
}
