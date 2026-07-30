import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name:         user.name,
    email:        user.email,
    dailyGoal:    '20',
    language:     'en-US',
    theme:        'light',
    notifications: true,
  });
  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 720 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: 4 }}>Profile</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>Manage your personal information and preferences</p>
      </div>

      {/* Avatar section */}
      <div style={{ background: 'white', border: '1px solid var(--paper)', borderRadius: 16, padding: '28px', boxShadow: 'var(--card-shadow)', display: 'flex', alignItems: 'center', gap: 24 }}>
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
            background: 'white', border: '2px solid var(--paper)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--paper)'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
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
            <span className="badge badge-blue">7-day streak</span>
            <span className="badge badge-success">88 avg score</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave}>
        <div style={{ background: 'white', border: '1px solid var(--paper)', borderRadius: 16, padding: '28px', boxShadow: 'var(--card-shadow)', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 24 }}>Personal Information</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <Field label="Full Name" id="profile-name">
              <input id="profile-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} onFocus={onFocus} onBlur={onBlur}/>
            </Field>
            <Field label="Email Address" id="profile-email">
              <input id="profile-email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} onFocus={onFocus} onBlur={onBlur}/>
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <Field label="Theme" id="profile-theme">
              <select id="profile-theme" value={form.theme} onChange={e => setForm(f => ({ ...f, theme: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="light">Light</option>
                <option value="dark">Dark (coming soon)</option>
                <option value="system">System default</option>
              </select>
            </Field>
            <Field label="Notifications" id="profile-notif">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 42 }}>
                <Toggle checked={form.notifications} onChange={v => setForm(f => ({ ...f, notifications: v }))} id="profile-notif-toggle"/>
                <span style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>{form.notifications ? 'Enabled' : 'Disabled'}</span>
              </div>
            </Field>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', paddingTop: 4, borderTop: '1px solid var(--paper)' }}>
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
        background: checked ? 'var(--blue-primary)' : '#FBF9F4',
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
  border: '1.5px solid var(--paper)',
  borderRadius: 10, fontSize: '0.875rem',
  color: 'var(--text-primary)', outline: 'none',
  fontFamily: 'var(--font-body)',
  background: 'white', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};
const onFocus = e => e.target.style.borderColor = 'var(--blue-primary)';
const onBlur  = e => e.target.style.borderColor = 'var(--paper)';
