import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Features', href: '/#features' },
    { label: 'About', href: '/#about' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0)',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(229,231,235,0.8)' : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,.05)' : 'none',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src="/logo.png" alt="Eloquate logo" style={{ height: 54, width: 54, objectFit: 'contain', borderRadius: '50%', border: '2.5px solid #0E9F8E' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              ELOQUATE
            </span>
            <span style={{ fontSize: '0.55rem', color: 'var(--ink)', fontWeight: 500, letterSpacing: '0.02em', marginTop: -2 }}>
              See the sound. Hear the error. Fix it.
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="hidden-mobile">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'var(--ink)',
                transition: 'color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--paper)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.background = 'transparent'; }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {isAuthenticated ? (
            <Link to="/app" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.875rem' }}>
              Go to App
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost" style={{ fontSize: '0.875rem' }}>
                Sign In
              </Link>
              <Link to="/signup" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.875rem' }}>
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--text-primary)', marginLeft: 4 }}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'white',
          borderTop: '1px solid var(--paper)',
          padding: '12px 24px 20px',
        }}>
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '10px 0', color: 'var(--ink)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, borderBottom: '1px solid var(--paper)' }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
      `}</style>
    </header>
  );
}
