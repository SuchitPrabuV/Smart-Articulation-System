import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardStats() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [goalPct] = useState(90); // 18/20 minutes

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top row: Welcome + Daily Goal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'stretch' }}>
        <WelcomeCard user={user} onStart={() => navigate('/app/practice')} />
        <GoalRing pct={goalPct} current={18} total={20} />
      </div>

      {/* Stat chips */}
      <StatRow />
    </div>
  );
}

function WelcomeCard({ user, onStart }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--signal) 0%, var(--signal) 50%, var(--signal) 100%)',
      borderRadius: 16,
      padding: '28px 32px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', right: -40, top: -40,
        width: 200, height: 200, borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 40, bottom: -60,
        width: 160, height: 160, borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,.7)', marginBottom: 6, fontWeight: 500 }}>
          Welcome back,
        </p>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.6rem', color: 'white', marginBottom: 10, letterSpacing: '-0.02em' }}>
          {user.name.split(' ')[0]}
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,.75)', marginBottom: 24 }}>
          Ready for today's speech practice?
        </p>
        <button
          onClick={onStart}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 22px',
            background: 'white',
            color: 'var(--signal)',
            fontWeight: 700,
            fontSize: '0.9rem',
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            fontFamily: 'var(--font-body)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
          id="welcome-start-session"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Start Session
        </button>
      </div>

      {/* Waveform decoration */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {[18, 32, 48, 38, 55, 42, 60, 45, 38, 28, 42, 35].map((h, i) => (
          <div key={i} style={{
            width: 4, height: h,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.4)',
            animation: `waveBar ${0.6 + i * 0.08}s ease-in-out infinite alternate`,
          }} />
        ))}
      </div>
    </div>
  );
}

function GoalRing({ pct, current, total }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const ringRef = useRef(null);

  useEffect(() => {
    if (ringRef.current) {
      ringRef.current.style.strokeDashoffset = `${offset}`;
    }
  }, [offset]);

  return (
    <div style={{
      background: 'white',
      border: '1px solid var(--paper)',
      borderRadius: 16,
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      minWidth: 180,
      boxShadow: 'var(--card-shadow)',
    }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)', textAlign: 'center' }}>Today's Goal</div>
      <div style={{ position: 'relative', width: 124, height: 124 }}>
        <svg width="124" height="124" viewBox="0 0 124 124">
          <circle cx="62" cy="62" r={r} fill="none" stroke="var(--paper)" strokeWidth="10"/>
          <circle
            ref={ringRef}
            cx="62" cy="62" r={r}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '62px 62px',
              transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)',
            }}
          />
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--signal)"/>
              <stop offset="100%" stopColor="var(--signal)"/>
            </linearGradient>
          </defs>
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--blue-primary)', lineHeight: 1 }}>{pct}%</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--ink)', marginTop: 2, fontWeight: 500 }}>complete</span>
        </div>
      </div>
      <div style={{ fontSize: '0.82rem', color: 'var(--ink)', textAlign: 'center', lineHeight: 1.4 }}>
        Practice Time<br />
        <strong style={{ color: 'var(--text-primary)' }}>{current} / {total} min</strong>
      </div>
    </div>
  );
}

function StatRow() {
  const stats = [
    {
      label: 'Avg Score',
      value: '88',
      unit: '/100',
      change: '+4 this week',
      positive: true,
      color: 'var(--signal)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
        </svg>
      ),
    },
    {
      label: 'Current Streak',
      value: '7',
      unit: 'days',
      change: 'Personal best!',
      positive: true,
      color: 'var(--signal)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      ),
    },
    {
      label: 'Exercises Done',
      value: '142',
      unit: 'total',
      change: '+12 today',
      positive: true,
      color: 'var(--signal)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
    {
      label: 'Best Sound',
      value: '/S/',
      unit: '92%',
      change: 'Excellent rating',
      positive: true,
      color: '#0E9F8E',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: 'white',
            border: '1px solid var(--paper)',
            borderRadius: 14,
            padding: '18px 20px',
            boxShadow: 'var(--card-shadow)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'default',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 24px ${s.color}18`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--card-shadow)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)' }}>{s.label}</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: s.color + '15', color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {s.icon}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-primary)' }}>{s.value}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--ink)', fontWeight: 500 }}>{s.unit}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: s.positive ? 'var(--signal)' : 'var(--signal)', fontWeight: 500 }}>
            {s.positive ? '↑ ' : '↓ '}{s.change}
          </div>
        </div>
      ))}
    </div>
  );
}
