import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';

export default function Landing() {
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleStart() {
    login();
    navigate('/app');
  }

  return (
    <div style={{ background: 'white' }}>
      <Navbar />
      <Hero />
      <FeatureCard />
      <HowItWorks />
      <Benefits />
      <CTASection onStart={handleStart} />
    </div>
  );
}

/* ─── How It Works ─────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Choose a Lesson',
      desc: 'Browse our library of phoneme exercises and select a sound to practice at your own pace.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
    },
    {
      num: '02',
      title: 'Record Your Speech',
      desc: 'Speak directly into your microphone. Our system captures clear, high-quality audio instantly.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" x2="12" y1="19" y2="22"/>
        </svg>
      ),
    },
    {
      num: '03',
      title: 'Receive AI Feedback',
      desc: 'Get detailed pronunciation analysis, phoneme scores, and personalized tips — instantly.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          <path d="m9 10 2 2 4-4"/>
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" style={{ background: 'white', padding: '100px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--blue-light)', color: 'var(--blue-primary)',
            padding: '5px 14px', borderRadius: 999,
            fontSize: '0.8rem', fontWeight: 600, marginBottom: 16,
            border: '1px solid var(--blue-mid)',
          }}>
            Simple Process
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: 'var(--text-primary)', marginBottom: 16 }}>
            How Eloquate works
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--ink)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Three simple steps to measurably better speech.
          </p>
        </div>

        <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, position: 'relative' }}>
          {/* Connector lines */}
          <div className="connector" style={{
            position: 'absolute',
            top: 44,
            left: '16.5%',
            right: '16.5%',
            height: 2,
            background: 'linear-gradient(90deg, var(--signal-mid), var(--signal), var(--signal-mid))',
            zIndex: 0,
          }} />

          {steps.map((step, i) => (
            <div key={step.num} style={{ padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                <div style={{
                  width: 88, height: 88,
                  borderRadius: '50%',
                  background: i === 1 ? 'linear-gradient(135deg, var(--signal), var(--signal))' : 'white',
                  border: i === 1 ? 'none' : '2px solid var(--signal-mid)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: i === 1 ? '0 8px 30px rgba(14,159,142,.3)' : '0 2px 12px rgba(0,0,0,.06)',
                  color: i === 1 ? 'white' : 'var(--signal)',
                  transition: 'transform 0.3s',
                  cursor: 'default',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {step.icon}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.75rem', color: 'var(--signal-mid)', letterSpacing: '0.1em', marginBottom: 8 }}>
                STEP {step.num}
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: 12 }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--ink)', lineHeight: 1.65, maxWidth: 260, margin: '0 auto' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #how-it-works .steps-grid { grid-template-columns: 1fr !important; }
          #how-it-works .connector { display: none; }
        }
      `}</style>
    </section>
  );
}

/* ─── Benefits ─────────────────────────────────────────────── */
function Benefits() {
  const benefits = [
    { icon: '⚡', title: 'Real-time Articulation Analysis', desc: 'Phoneme-level scoring delivered in under two seconds.' },
    { icon: '🎯', title: 'Personalized AI Feedback', desc: 'Suggestions tailored to your unique speech patterns.' },
    { icon: '📈', title: 'Progress Tracking', desc: 'Visual charts and streaks to keep you motivated.' },
    { icon: '🔒', title: 'Secure Cloud Storage', desc: 'Your sessions are encrypted and private — always.' },
    { icon: '📱', title: 'Cross-device Compatibility', desc: 'Seamless experience on desktop, tablet, and mobile.' },
    { icon: '✨', title: 'Simple & Intuitive', desc: 'Designed so you focus on speaking, not the software.' },
  ];

  return (
    <section id="about" style={{ background: 'var(--paper)', padding: '100px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

        {/* Left text */}
        <div style={{ maxWidth: 700 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--blue-light)', color: 'var(--blue-primary)',
            padding: '5px 14px', borderRadius: 999,
            fontSize: '0.8rem', fontWeight: 600, marginBottom: 20,
            border: '1px solid var(--blue-mid)',
          }}>
            Why Eloquate
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: 'var(--text-primary)', marginBottom: 20 }}>
            Speech therapy, reimagined for the modern world
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.75, marginBottom: 32 }}>
            Traditional speech therapy is expensive, inaccessible, and slow. Eloquate brings the power of AI to your fingertips — delivering expert-level feedback, anytime, anywhere.
          </p>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
        }
      `}</style>
    </section>
  );
}

/* ─── CTA Section ──────────────────────────────────────────── */
function CTASection({ onStart }) {
  return (
    <section style={{ background: 'white', padding: '100px 24px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--paper) 0%, var(--signal-light) 50%, var(--paper) 100%)',
          borderRadius: 24,
          border: '1px solid var(--signal-mid)',
          padding: '72px 48px',
        }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--text-primary)', marginBottom: 16 }}>
            Start Improving Your Speech Today
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.7, marginBottom: 36, maxWidth: 460, margin: '0 auto 36px' }}>
            Join thousands of learners who've transformed their communication with Eloquate's AI-powered platform.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onStart} className="btn-primary" style={{ padding: '13px 32px', fontSize: '1rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Start Practice
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
