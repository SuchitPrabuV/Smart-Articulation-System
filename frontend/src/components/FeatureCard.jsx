import { useState } from 'react';

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" x2="12" y1="19" y2="22"/>
        <line x1="8" x2="16" y1="22" y2="22"/>
      </svg>
    ),
    title: 'Record Speech',
    description: 'Capture your voice directly in the browser with one click — no downloads, no setup required.',
    color: 'var(--signal)',
    bg: 'var(--paper)',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
    title: 'Instant Feedback',
    description: 'Receive AI-powered pronunciation analysis within seconds, with detailed phoneme-level scoring.',
    color: '#0E9F8E',
    bg: '#FFFFFF',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    title: 'Practice Exercises',
    description: 'Work through structured articulation exercises targeting specific sounds, words, and sentences.',
    color: '#0E9F8E',
    bg: '#FFFFFF',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" x2="18" y1="20" y2="10"/>
        <line x1="12" x2="12" y1="20" y2="4"/>
        <line x1="6" x2="6" y1="20" y2="14"/>
        <polyline points="2 20 22 20"/>
      </svg>
    ),
    title: 'Track Progress',
    description: 'Visualize your improvement over time with beautiful analytics, streaks, and achievement milestones.',
    color: '#0E9F8E',
    bg: '#FFFFFF',
  },
];

export default function FeatureCard() {
  return (
    <section id="features" style={{ background: 'var(--paper)', padding: '100px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--blue-light)', color: 'var(--blue-primary)',
            padding: '5px 14px', borderRadius: 999,
            fontSize: '0.8rem', fontWeight: 600, marginBottom: 16,
            border: '1px solid var(--blue-mid)',
          }}>
            Core Features
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: 'var(--text-primary)', marginBottom: 16 }}>
            Everything you need to speak better
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--ink)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            A complete suite of AI speech tools designed for effective, measurable improvement.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {FEATURES.map((f) => (
            <Card key={f.title} feature={f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ feature: f }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white',
        borderRadius: 16,
        border: `1px solid ${hovered ? f.color + '30' : 'var(--paper)'}`,
        padding: '28px 28px 32px',
        cursor: 'default',
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 12px 40px ${f.color}18, 0 4px 12px rgba(0,0,0,.06)`
          : '0 1px 4px rgba(0,0,0,.04)',
      }}
    >
      <div style={{
        width: 48, height: 48,
        borderRadius: 12,
        background: f.bg,
        color: f.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
        transition: 'transform 0.25s ease',
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
      }}>
        {f.icon}
      </div>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 10 }}>
        {f.title}
      </h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--ink)', lineHeight: 1.65 }}>
        {f.description}
      </p>

      <div style={{
        marginTop: 20,
        display: 'flex', alignItems: 'center', gap: 6,
        color: f.color,
        fontSize: '0.85rem', fontWeight: 600,
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateX(0)' : 'translateX(-8px)',
        transition: 'all 0.25s ease',
      }}>
        Learn more
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
        </svg>
      </div>
    </div>
  );
}
