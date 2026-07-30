import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800)); // simulate network
    login();
    navigate('/app');
  }

  function handleGoogle() {
    login();
    navigate('/app');
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(160deg, var(--paper), var(--paper))',
    }}>
      {/* Left panel — branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 64px',
        background: 'linear-gradient(160deg, var(--signal), var(--signal) 50%, var(--signal))',
        color: 'white',
      }} className="login-brand-panel">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 60 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" x2="12" y1="19" y2="22"/>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', color: 'white', lineHeight: 1.1 }}>ELOQUATE</span>
            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500, letterSpacing: '0.02em' }}>
              See the sound. Hear the error. Fix it.
            </span>
          </div>
        </Link>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: 'white', marginBottom: 20, lineHeight: 1.15 }}>
          Speak clearly.<br/>Sound confident.
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.75)', lineHeight: 1.75, maxWidth: 380, marginBottom: 48 }}>
          Join over 50,000 learners who've transformed their pronunciation with AI-powered speech therapy.
        </p>

        {[
          'Real-time AI pronunciation analysis',
          'Personalized exercise library',
          'Visual progress tracking',
          'Accessible on all devices',
        ].map((feat) => (
          <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,.85)' }}>{feat}</span>
          </div>
        ))}
      </div>

      {/* Right panel — form */}
      <div style={{
        width: '100%',
        maxWidth: 480,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 48px',
        background: 'white',
        flexShrink: 0,
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: 8 }}>Welcome back</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>Sign in to continue your speech journey</p>
          </div>

          {/* Google SSO */}
          <button
            onClick={handleGoogle}
            className="btn-primary"
            style={{
              width: '100%', padding: '11px', borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              fontSize: '0.9rem', fontWeight: 600,
              marginBottom: 20, fontFamily: 'var(--font-body)',
            }}
            id="login-google-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#0E9F8E" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#0E9F8E" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#0E9F8E" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#0E9F8E" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--paper)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--ink)', fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--paper)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && (
              <div style={{ background: '#FFFFFF', border: '1px solid var(--signal)', borderRadius: 10, padding: '10px 14px', fontSize: '0.85rem', color: 'var(--signal)' }}>
                {error}
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                id="login-email"
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1.5px solid var(--paper)',
                  borderRadius: 10, fontSize: '0.9rem',
                  color: 'var(--text-primary)', outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'var(--font-body)',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--blue-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--paper)'}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Password</label>
                <a href="#" style={{ fontSize: '0.82rem', color: 'var(--blue-primary)', textDecoration: 'none', fontWeight: 500 }}>Forgot?</a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                id="login-password"
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1.5px solid var(--paper)',
                  borderRadius: 10, fontSize: '0.9rem',
                  color: 'var(--text-primary)', outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'var(--font-body)',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--blue-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--paper)'}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ justifyContent: 'center', padding: '12px', fontSize: '0.95rem', marginTop: 4 }}
              id="login-submit-btn"
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: 'var(--ink)' }}>
            Don't have an account?{' '}
            <button onClick={() => { login(); navigate('/app'); }} style={{ color: 'var(--blue-primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}>
              Start free
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .login-brand-panel { display: none !important; } }
      `}</style>
    </div>
  );
}
