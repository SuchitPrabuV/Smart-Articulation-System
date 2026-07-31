import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAttempts } from '../data/session';

function computeStreak(attempts) {
  if (!attempts || attempts.length === 0) return 0;
  const dates = Array.from(new Set(attempts.map(a => new Date(a.at).toDateString()))).map(d => new Date(d));
  dates.sort((a, b) => b - a);

  let currentStreak = 0;
  let today = new Date();
  today.setHours(0,0,0,0);

  const diffTime = today - dates[0];
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 1) return 0;

  let current = dates[0];
  currentStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = dates[i];
    const diff = (current - prev) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      currentStreak++;
      current = prev;
    } else if (diff > 1) {
      break;
    }
  }
  return currentStreak;
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    dailyGoal: user.dailyGoal || '20',
    language: user.language || 'en-US',
    notifications: user.notifications !== false,
  });
  const [saved, setSaved] = useState(false);

  const attempts = useMemo(() => getAttempts(), []);
  const avgScore = useMemo(() => {
    if (!attempts.length) return 0;
    return Math.round(attempts.reduce((acc, a) => acc + a.score, 0) / attempts.length);
  }, [attempts]);

  const streak = useMemo(() => computeStreak(attempts), [attempts]);

  function handleSave(e) {
    e.preventDefault();
    updateUser(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 720 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: 4 }}>Profile</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>Manage your personal information and preferences</p>
      </div>

      {/* Avatar section */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '28px', boxShadow: 'var(--card-shadow)', display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--signal), var(--signal))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem',
          }}>
            {user.name.charAt(0)}
          </div>
          <button style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 26, height: 26, borderRadius: '50%',
            background: 'var(--card)', border: '2px solid var(--line)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--paper)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--card)'}
            aria-label="Change avatar"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/>
            </svg>
          </button>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 4 }}>{user.name}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--ink)', marginBottom: 8 }}>{user.email}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="badge badge-blue">{streak} {streak === 1 ? 'day' : 'days'} streak</span>
            <span className="badge badge-success">{avgScore} avg score</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '28px', boxShadow: 'var(--card-shadow)', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 24 }}>Personal Information</h2>

          <div className="profile-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <Field label="Full Name" id="profile-name">
              <input id="profile-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} onFocus={onFocus} onBlur={onBlur}/>
            </Field>
            <Field label="Email Address" id="profile-email">
              <input id="profile-email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} onFocus={onFocus} onBlur={onBlur}/>
            </Field>
          </div>

          <div className="profile-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <Field label="Daily Goal (minutes)" id="profile-goal">
              <input id="profile-goal" type="number" min="5" max="60" value={form.dailyGoal} onChange={e => setForm(f => ({ ...f, dailyGoal: e.target.value }))} style={inputStyle} onFocus={onFocus} onBlur={onBlur}/>
            </Field>
            <Field label="Language" id="profile-lang">
              <select id="profile-lang" value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="en-AU">English (AU)</option>
              </select>
            </Field>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
            <Field label="Notifications" id="profile-notif">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 42 }}>
                <Toggle checked={form.notifications} onChange={v => setForm(f => ({ ...f, notifications: v }))} id="profile-notif-toggle"/>
                <span style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>{form.notifications ? 'Enabled' : 'Disabled'}</span>
              </div>
            </Field>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', paddingTop: 4, borderTop: '1px solid var(--line)' }}>
            <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }} id="profile-save-btn">
              {saved ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Saved!
                </>
              ) : 'Save Changes'}
            </button>
            {saved && <span style={{ fontSize: '0.85rem', color: 'var(--signal)', fontWeight: 500 }}>Changes saved successfully</span>}
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({ label, id, children }) {
  return (
    <div>
      <label htmlFor={id} style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, id }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      id={id}
      role="switch"
      aria-checked={checked}
      style={{
        width: 44, height: 24, borderRadius: 999,
        background: checked ? 'var(--blue-primary)' : 'var(--line)',
        border: 'none', cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: checked ? 22 : 2,
        width: 20, height: 20, borderRadius: '50%',
        background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,.2)',
        transition: 'left 0.2s',
      }} />
    </button>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 14px',
  border: '1.5px solid var(--line)',
  borderRadius: 10, fontSize: '0.875rem',
  color: 'var(--text-primary)', outline: 'none',
  fontFamily: 'var(--font-body)',
  background: 'var(--card)', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};
const onFocus = e => e.target.style.borderColor = 'var(--blue-primary)';
const onBlur  = e => e.target.style.borderColor = 'var(--line)';
