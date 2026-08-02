import { useEffect, useState } from 'react';

/**
 * Playful full-screen greeter shown between "Start Practice" and the app.
 * A friendly character bounces in, waves, and after a beat calls onDone()
 * (which navigates to /app). A "Let's go!" button skips the wait.
 */
export default function Mascot({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  function finish() {
    setLeaving(true);
    window.setTimeout(() => onDone && onDone(), 450); // let the exit fade play
  }

  useEffect(() => {
    const t = window.setTimeout(finish, 3000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sparkles = [
    { left: '18%', top: '24%', size: 22, delay: 0 },
    { left: '78%', top: '20%', size: 16, delay: 0.4 },
    { left: '30%', top: '70%', size: 18, delay: 0.8 },
    { left: '70%', top: '66%', size: 24, delay: 0.2 },
    { left: '50%', top: '14%', size: 14, delay: 0.6 },
  ];

  return (
    <div
      role="dialog"
      aria-label="Welcome"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 22,
        background: 'linear-gradient(160deg, #14B8A5 0%, #0E9F8E 55%, #0C8578 100%)',
        opacity: leaving ? 0 : 1,
        transition: 'opacity 0.45s ease',
      }}
    >
      <style>{`
        @keyframes mascotBounce { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-16px) } }
        @keyframes mascotPop { 0%{ transform: scale(0.3); opacity:0 } 60%{ transform: scale(1.12); opacity:1 } 100%{ transform: scale(1) } }
        @keyframes mascotWave { 0%,100%{ transform: rotate(-18deg) } 50%{ transform: rotate(22deg) } }
        @keyframes bubblePop { 0%{ transform: scale(0.4); opacity:0 } 100%{ transform: scale(1); opacity:1 } }
        @keyframes sparkleFloat { 0%,100%{ transform: translateY(0) scale(1); opacity:.5 } 50%{ transform: translateY(-14px) scale(1.25); opacity:1 } }
        @media (prefers-reduced-motion: reduce) {
          .mascot-bob, .mascot-arm, .mascot-spark { animation: none !important; }
        }
      `}</style>

      {sparkles.map((s, i) => (
        <span
          key={i}
          className="mascot-spark"
          style={{
            position: 'absolute', left: s.left, top: s.top,
            fontSize: s.size, color: '#FFE27A',
            animation: `sparkleFloat ${1.6 + i * 0.2}s ease-in-out ${s.delay}s infinite`,
            pointerEvents: 'none',
          }}
        >
          ✦
        </span>
      ))}

      {/* Character */}
      <div style={{ animation: 'mascotPop 0.5s cubic-bezier(.18,.89,.32,1.28) both' }}>
        <div className="mascot-bob" style={{ animation: 'mascotBounce 1.4s ease-in-out infinite' }}>
          <svg width="180" height="190" viewBox="0 0 180 190" role="img" aria-label="Friendly mascot">
            {/* feet */}
            <ellipse cx="66" cy="176" rx="18" ry="10" fill="#0B7568" />
            <ellipse cx="114" cy="176" rx="18" ry="10" fill="#0B7568" />
            {/* body */}
            <ellipse cx="90" cy="104" rx="66" ry="70" fill="#FFFFFF" />
            <ellipse cx="90" cy="112" rx="46" ry="48" fill="#EAFBF7" />
            {/* waving arm */}
            <g className="mascot-arm" style={{ transformOrigin: '30px 108px', animation: 'mascotWave 0.7s ease-in-out infinite' }}>
              <rect x="6" y="86" width="34" height="16" rx="8" fill="#FFFFFF" />
              <circle cx="10" cy="82" r="12" fill="#FFFFFF" />
            </g>
            {/* right arm */}
            <rect x="140" y="104" width="34" height="16" rx="8" fill="#FFFFFF" />
            {/* cheeks */}
            <circle cx="58" cy="112" r="11" fill="#FFB6A8" opacity="0.8" />
            <circle cx="122" cy="112" r="11" fill="#FFB6A8" opacity="0.8" />
            {/* eyes */}
            <circle cx="70" cy="92" r="14" fill="#16233A" />
            <circle cx="110" cy="92" r="14" fill="#16233A" />
            <circle cx="74" cy="88" r="4.5" fill="#FFFFFF" />
            <circle cx="114" cy="88" r="4.5" fill="#FFFFFF" />
            {/* smile */}
            <path d="M70 118 Q90 138 110 118" fill="none" stroke="#16233A" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Speech bubble */}
      <div
        style={{
          position: 'relative',
          background: '#FFFFFF',
          color: 'var(--text-primary, #16233A)',
          padding: '16px 26px',
          borderRadius: 20,
          fontFamily: 'var(--font-heading, sans-serif)',
          fontWeight: 800,
          fontSize: '1.35rem',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,.18)',
          animation: 'bubblePop 0.4s ease 0.35s both',
        }}
      >
        Hi there! 👋 Let&apos;s practise our sounds!
        <span style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: 20, height: 20, background: '#fff', borderRadius: 4 }} />
      </div>

      <button
        onClick={finish}
        style={{
          marginTop: 4,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#FFFFFF',
          color: 'var(--signal, #0E9F8E)',
          fontFamily: 'var(--font-body, sans-serif)',
          fontWeight: 800,
          fontSize: '1.05rem',
          padding: '12px 30px',
          border: 'none',
          borderRadius: 999,
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0,0,0,.2)',
          animation: 'bubblePop 0.4s ease 0.6s both',
        }}
      >
        Let&apos;s go!
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </button>
    </div>
  );
}
