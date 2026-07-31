import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Hero() {
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleStart() {
    login();
    navigate('/app');
  }

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(160deg, #FFFFFF 0%, var(--paper) 50%, var(--paper) 100%)',
        paddingTop: 68,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background decorations */}
      <div style={{
        position: 'absolute', top: '10%', right: '5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14,159,142,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '0%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14,159,142,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="hero-inner" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

        {/* Left: Text */}
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 900 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--blue-light)', color: 'var(--blue-primary)',
            padding: '6px 14px', borderRadius: 999,
            fontSize: '0.8rem', fontWeight: 600, marginBottom: 28,
            border: '1px solid var(--blue-mid)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue-primary)', display: 'inline-block' }} />
            AI-Powered Speech Therapy
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.035em',
            color: 'var(--text-primary)',
            marginBottom: 24,
            textAlign: 'center',
          }}>
            {'Speak Clearly.'}
            <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--signal), var(--signal))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {'Communicate Confidently.'}
            </span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--ink)',
            lineHeight: 1.75,
            marginBottom: 40,
            maxWidth: 480,
          }}>
            Eloquate uses advanced AI to analyze your speech patterns, deliver real-time pronunciation feedback, and build personalized exercises — helping you communicate with clarity and confidence.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={handleStart} className="btn-primary" style={{ padding: '13px 28px', fontSize: '1rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Start Practice
            </button>
            <a href="#how-it-works" className="btn-secondary" style={{ padding: '13px 28px', fontSize: '1rem' }}>
              Learn More
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </a>
          </div>


        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}


