import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TopBar({ onMenuOpen }) {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();

  const notifs = [
    { id: 1, text: 'You completed the /S/ exercise with 92%!', time: '2m ago', unread: true },
    { id: 2, text: 'New lesson available: Advanced /R/ sounds', time: '1h ago', unread: true },
    { id: 3, text: 'Your 7-day streak continues!', time: '3h ago', unread: false },
  ];
  const unreadCount = notifs.filter(n => n.unread).length;

  return (
    <header style={{
      height: 'var(--topbar-height)',
      background: 'white',
      borderBottom: '1px solid var(--paper)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuOpen}
        className="btn-ghost"
        style={{ padding: 8, flexShrink: 0 }}
        aria-label="Open sidebar"
        id="topbar-menu-btn"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 420, position: 'relative' }}>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="var(--ink)" strokeWidth="2" strokeLinecap="round"
          style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
        >
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          type="search"
          placeholder="Search exercises, sounds…"
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          style={{
            width: '100%',
            padding: '9px 14px 9px 38px',
            background: 'var(--paper)',
            border: '1px solid transparent',
            borderRadius: 10,
            fontSize: '0.875rem',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'border-color 0.2s, background 0.2s',
            fontFamily: 'var(--font-body)',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--blue-primary)'; e.target.style.background = 'white'; }}
          onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'var(--paper)'; }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="btn-ghost"
            style={{ padding: 8, position: 'relative' }}
            aria-label="Notifications"
            id="topbar-notif-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 6, right: 6,
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--signal)', border: '2px solid white',
              }} />
            )}
          </button>

          {notifOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              width: 320, background: 'white',
              border: '1px solid var(--paper)',
              borderRadius: 14,
              boxShadow: '0 8px 32px rgba(0,0,0,.12)',
              zIndex: 100,
              overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.9rem' }}>Notifications</span>
                <span className="badge badge-blue">{unreadCount} new</span>
              </div>
              {notifs.map(n => (
                <div key={n.id} style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--paper)',
                  background: n.unread ? '#FFFFFF' : 'white',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--paper)'}
                  onMouseLeave={e => e.currentTarget.style.background = n.unread ? '#FFFFFF' : 'white'}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    {n.unread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--blue-primary)', flexShrink: 0, marginTop: 5 }} />}
                    <div style={{ paddingLeft: n.unread ? 0 : 17 }}>
                      <p style={{ fontSize: '0.83rem', color: 'var(--text-primary)', lineHeight: 1.45, marginBottom: 3 }}>{n.text}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--ink)' }}>{n.time}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ padding: '10px 16px', textAlign: 'center' }}>
                <button className="btn-ghost" style={{ fontSize: '0.8rem', color: 'var(--blue-primary)' }}>
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <button
          onClick={() => navigate('/app/profile')}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--signal), var(--signal))',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '0.9rem',
            transition: 'transform 0.2s, box-shadow 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(14,159,142,.35)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
          aria-label="Profile"
          id="topbar-avatar-btn"
        >
          {user.name.charAt(0)}
        </button>
      </div>

      <style>{`
        @media (min-width: 769px) { #topbar-menu-btn { display: none !important; } }
      `}</style>
    </header>
  );
}
