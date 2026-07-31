import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 1000));
    login({ name: form.name, email: form.email });
    navigate('/app');
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--paper)',
      fontFamily: 'var(--font-body)',
    }}>
      {/* ── Left branding panel ── */}
      <div
        className="auth-brand-panel"
        style={{
          flex: 1,
          background: '#F3F8F7',
          borderRight: '1px solid #D9E9E6',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px clamp(32px, 6vw, 88px)',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.png" alt="Eloquate" style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #A9D8D1', objectFit: 'contain', background: 'white' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--ink)', lineHeight: 1.1 }}>ELOQUATE</div>
            <div style={{ fontSize: '0.6rem', color: '#5E7774', fontWeight: 500, letterSpacing: '0.04em' }}>See the sound. Hear the error. Fix it.</div>
          </div>
        </Link>

        {/* Hero text */}
        <div>
          <div style={{ width: 42, height: 4, borderRadius: 99, background: 'var(--signal)', marginBottom: 20 }} />
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(2rem, 3vw, 2.8rem)', color: 'var(--ink)', lineHeight: 1.15, marginBottom: 20 }}>
            Start your journey<br />to clearer speech.
          </h1>
          <p style={{ fontSize: '1rem', color: '#5E7774', maxWidth: 360, lineHeight: 1.65, marginBottom: 36 }}>
            Join thousands of users improving their communication with the power of AI.
          </p>
          {[
            'Free to get started',
            'Personalised AI feedback',
            'Track progress over time',
            'No credit card required',
          ].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#D4EEEA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--signal)" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <span style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>{f}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '0.8rem', color: '#78918E', fontStyle: 'italic' }}>
          "Communication is the key to unlock any door."
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-form-panel" style={{
        width: '100%',
        maxWidth: 500,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 52px',
        background: 'white',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.85rem', color: 'var(--ink)', marginBottom: 6 }}>
              Create your account
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Free forever. No credit card needed.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#fff5f5', border: '1px solid #fca5a5',
              borderRadius: 10, padding: '10px 14px',
              fontSize: '0.85rem', color: '#dc2626', marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Full name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
                Full name
              </label>
              <input
                id="signup-name"
                type="text"
                placeholder="Jane Smith"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#0E9F8E'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
                Email address
              </label>
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#0E9F8E'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => e.target.style.borderColor = '#0E9F8E'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#94a3b8' }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>

            </div>

            {/* Confirm password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
                Confirm password
              </label>
              <input
                id="signup-confirm"
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                required
                style={{
                  ...inputStyle,
                  borderColor: form.confirm && form.confirm !== form.password ? '#fca5a5' : '#e2e8f0',
                }}
                onFocus={e => e.target.style.borderColor = '#0E9F8E'}
                onBlur={e => e.target.style.borderColor = (form.confirm && form.confirm !== form.password) ? '#fca5a5' : '#e2e8f0'}
              />
              {form.confirm && form.confirm !== form.password && (
                <p style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: 4 }}>Passwords don't match</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="signup-submit-btn"
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px',
                background: loading ? '#7dcfc8' : '#0E9F8E',
                color: 'white', border: 'none',
                borderRadius: 10, fontSize: '0.95rem',
                fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-body)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.2s',
                marginTop: 4,
              }}
              onMouseEnter={e => { if (!loading) e.target.style.background = '#0b8a7a'; }}
              onMouseLeave={e => { if (!loading) e.target.style.background = '#0E9F8E'; }}
            >
              {loading
                ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg> Creating account…</>
                : 'Create Account'
              }
            </button>

            <p style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
              By creating an account you agree to our{' '}
              <a href="#" style={{ color: '#0E9F8E', textDecoration: 'none' }}>Terms</a>{' '}and{' '}
              <a href="#" style={{ color: '#0E9F8E', textDecoration: 'none' }}>Privacy Policy</a>.
            </p>
          </form>

          {/* Footer link */}
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#0E9F8E', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .auth-brand-panel { display: none !important; } }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '11px 14px',
  border: '1.5px solid #e2e8f0',
  borderRadius: 10, fontSize: '0.9rem',
  color: '#16233A', outline: 'none',
  fontFamily: 'Inter, system-ui, sans-serif',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
  background: '#fafafa',
};
