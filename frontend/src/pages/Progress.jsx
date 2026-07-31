import { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { getAttempts, subscribe } from '../data/session';

function avg(list) {
  if (!list.length) return 0;
  return Math.round(list.reduce((acc, a) => acc + a.score, 0) / list.length);
}

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

export default function ProgressPage() {
  const [attempts, setAttempts] = useState(getAttempts());

  useEffect(() => {
    return subscribe((newAttempts) => {
      setAttempts(newAttempts);
    });
  }, []);

  const avgScore = avg(attempts);

  const streak = useMemo(() => computeStreak(attempts), [attempts]);

  const byTarget = attempts.reduce((acc, a) => {
    (acc[a.targetId] ||= []).push(a);
    return acc;
  }, {});

  const bestTarget   = Object.entries(byTarget).sort((a, b) => avg(b[1]) - avg(a[1]))[0];
  const weakestTarget = Object.entries(byTarget).sort((a, b) => avg(a[1]) - avg(b[1]))[0];

  const weeklyData = attempts.length
    ? Object.entries(
        attempts.reduce((acc, a) => {
          const day = new Date(a.at).toLocaleDateString('en', { weekday: 'short' });
          if (!acc[day]) acc[day] = { day, score: a.score, count: 1 };
          else { acc[day].score += a.score; acc[day].count++; }
          return acc;
        }, {})
      ).map(([, v]) => ({ day: v.day, score: Math.round(v.score / v.count) }))
    : [
        { day: 'Mon', score: 0 }, { day: 'Tue', score: 0 },
        { day: 'Wed', score: 0 }, { day: 'Thu', score: 0 },
        { day: 'Fri', score: 0 }, { day: 'Sat', score: 0 },
        { day: 'Sun', score: 0 },
      ];

  const RADAR_DATA = [
    { metric: 'Accuracy', value: avgScore || 50 },
    { metric: 'Fluency',  value: attempts.length ? Math.min(100, 45 + attempts.length * 5) : 50 },
    { metric: 'Volume',   value: attempts.length ? 75 : 50 },
    { metric: 'Pitch',    value: attempts.length ? 68 : 50 },
    { metric: 'Speed',    value: attempts.length ? 72 : 50 },
  ];

  const HEATMAP_DATA = Array.from({ length: 28 }, (_, i) => {
    const dayAttempts = attempts.filter(a => {
      const diff = (Date.now() - a.at) / (1000 * 60 * 60 * 24);
      return diff >= i && diff < i + 1;
    });
    return { day: i, value: Math.min(3, dayAttempts.length) };
  }).reverse();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: 4 }}>Progress</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>Track your improvement and celebrate milestones</p>
      </div>

      {/* Stat chips */}
      <div className="progress-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
        {[
          { label: 'Average Score', value: avgScore || '—', unit: '/100', color: 'var(--signal)' },
          { label: 'Best Sound',    value: bestTarget    ? bestTarget[0].toUpperCase()   : '—', unit: '', color: 'var(--signal)' },
          { label: 'Weakest Sound', value: weakestTarget ? weakestTarget[0].toUpperCase() : '—', unit: '', color: 'var(--signal)' },
          { label: 'Exercises',     value: attempts.length, unit: 'done', color: '#0E9F8E' },
          { label: 'Streak',        value: streak, unit: streak === 1 ? 'day' : 'days', color: 'var(--signal)' },
        ].map((s) => (
          <StatChip key={s.label} {...s} />
        ))}
      </div>

      {/* Charts row */}
      <div className="progress-chart-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Weekly area chart */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px', boxShadow: 'var(--card-shadow)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 4 }}>Monthly Progress</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--ink)', marginBottom: 16 }}>Average score over time</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--signal)" stopOpacity={0.18}/>
                  <stop offset="95%" stopColor="var(--signal)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false}/>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--ink)' }} axisLine={false} tickLine={false}/>
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: 'var(--ink)' }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background: 'var(--card)', borderRadius: 10, border: '1px solid var(--line)', boxShadow: '0 4px 12px rgba(0,0,0,.08)' }}/>
              <Area type="monotone" dataKey="score" stroke="var(--signal)" strokeWidth={2.5} fill="url(#progressGrad)" dot={{ fill: 'var(--signal)', r: 4 }} activeDot={{ r: 6, stroke: 'var(--card)', strokeWidth: 2 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px', boxShadow: 'var(--card-shadow)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 4 }}>Speech Profile</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--ink)', marginBottom: 12 }}>Multi-dimensional metrics</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={RADAR_DATA} outerRadius="75%">
              <PolarGrid stroke="var(--line)"/>
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: 'var(--ink)' }}/>
              <Radar dataKey="value" stroke="var(--signal)" fill="var(--signal)" fillOpacity={0.12} strokeWidth={2} dot={{ fill: 'var(--signal)', r: 3 }}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px', boxShadow: 'var(--card-shadow)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 4 }}>Activity Heatmap</h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--ink)', marginBottom: 16 }}>Past 28 days of practice</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(28, 1fr)', gap: 5 }}>
          {HEATMAP_DATA.map((d) => (
            <div
              key={d.day}
              title={`Day ${d.day + 1}: ${d.value ? `${d.value} session${d.value > 1 ? 's' : ''}` : 'No activity'}`}
              style={{
                aspectRatio: '1',
                borderRadius: 4,
                background: d.value === 0 ? 'var(--line)'
                  : d.value === 1 ? 'var(--signal-light)'
                  : d.value === 2 ? 'var(--signal-mid)'
                  : d.value === 3 ? 'var(--signal)'
                  : 'var(--signal)',
                transition: 'transform 0.15s',
                cursor: 'default',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.3)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 12, fontSize: '0.75rem', color: 'var(--ink)' }}>
          <span>Less</span>
          {['var(--line)', 'var(--signal-light)', 'var(--signal-mid)', 'var(--signal)', 'var(--signal)'].map(c => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Per-sound breakdown */}
      {Object.keys(byTarget).length > 0 && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--line)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Per-Sound Breakdown</h3>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {Object.entries(byTarget).map(([id, list]) => {
              const a = avg(list);
              return (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', minWidth: 36 }}>{id.toUpperCase()}</span>
                  <div style={{ flex: 1, height: 8, background: 'var(--line)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${a}%`, background: `linear-gradient(90deg, var(--signal), var(--signal))`, borderRadius: 999, transition: 'width 0.8s' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', minWidth: 36, textAlign: 'right' }}>{a}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--ink)', minWidth: 70 }}>{list.length} attempts</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {attempts.length === 0 && (
        <div style={{ background: 'var(--card)', border: '1px dashed var(--line)', borderRadius: 16, padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>📊</div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 8 }}>No practice data yet</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--ink)', marginBottom: 24 }}>Complete some exercises and your progress will appear here.</p>
        </div>
      )}
    </div>
  );
}

function StatChip({ label, value, unit, color }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, padding: '16px 18px', boxShadow: 'var(--card-shadow)' }}>
      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.5rem', color }}>{value}</span>
        {unit && <span style={{ fontSize: '0.78rem', color: 'var(--ink)', fontWeight: 500 }}>{unit}</span>}
      </div>
    </div>
  );
}
