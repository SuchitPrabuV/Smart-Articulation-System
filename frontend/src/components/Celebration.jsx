import { useEffect, useMemo } from 'react';
import { playApplause } from '../audio/sfx';

const COLORS = ['#0E9F8E', '#FFC93C', '#FF6B6B', '#4D96FF', '#F79D65', '#9B5DE5', '#00BBF9'];

// Full-screen, non-blocking confetti + "tada" badge shown when a young learner
// scores high. Plays applause on mount as positive reinforcement.
export default function Celebration({ score }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.8 + Math.random() * 1.6,
        color: COLORS[i % COLORS.length],
        size: 7 + Math.random() * 7,
        rounded: Math.random() > 0.6,
      })),
    []
  );

  useEffect(() => {
    playApplause();
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 9999,
      }}
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            top: -24,
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.6,
            background: p.color,
            borderRadius: p.rounded ? '50%' : 2,
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s forwards`,
          }}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          top: '32%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          animation: 'celebrate-pop 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards',
        }}
      >
        <div style={{ fontSize: '4.5rem', lineHeight: 1 }}>🎉</div>
        <div
          style={{
            marginTop: 10,
            display: 'inline-block',
            background: 'var(--signal)',
            color: 'var(--text-on-signal, #fff)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: '1.5rem',
            padding: '10px 26px',
            borderRadius: 999,
            boxShadow: '0 8px 30px rgba(14,159,142,.35)',
          }}
        >
          Great job! {typeof score === 'number' ? score : ''}
        </div>
      </div>
    </div>
  );
}
