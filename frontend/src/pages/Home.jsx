import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardStats from '../components/DashboardStats';
import ProgressChart from '../components/ProgressChart';
import ScoreCard from '../components/ScoreCard';
import ActivityTimeline from '../components/ActivityTimeline';
import PracticeCard from '../components/PracticeCard';
import { TARGETS } from '../data/loadContent';
import { getAttempts, getPracticeTime, subscribe } from '../data/session';

const RECOMMENDED = [
  { id: 's', exercise: '"S"',  difficulty: 'Medium', estimatedTime: '5 min' },
  { id: 'r', exercise: '"R"',  difficulty: 'Medium', estimatedTime: '5 min' },
  { id: 'th', exercise: '"TH"', difficulty: 'Hard',   estimatedTime: '7 min' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState(getAttempts());
  const [practiceTime, setPracticeTime] = useState(getPracticeTime());

  useEffect(() => {
    return subscribe((newAttempts, newTime) => {
      setAttempts(newAttempts);
      setPracticeTime(newTime);
    });
  }, []);

  const attemptsCount = attempts.length;

  const avgScore = useMemo(() => {
    if (attempts.length === 0) return 0;
    return Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length);
  }, [attempts]);

  const streak = useMemo(() => {
    if (attempts.length === 0) return 0;
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
  }, [attempts]);

  const bestSound = useMemo(() => {
    if (attempts.length === 0) return '—';
    const groups = {};
    attempts.forEach(a => {
      if (!groups[a.targetId]) groups[a.targetId] = { sum: 0, count: 0 };
      groups[a.targetId].sum += a.score;
      groups[a.targetId].count++;
    });
    let best = '—';
    let maxAvg = -1;
    Object.keys(groups).forEach(id => {
      const avg = groups[id].sum / groups[id].count;
      if (avg > maxAvg) {
        maxAvg = avg;
        best = id.toUpperCase();
      }
    });
    return best;
  }, [attempts]);

  const totalMinutes = 20;
  const goalPct = Math.min(100, Math.round((practiceTime / (totalMinutes * 60)) * 100));

  const recentScores = useMemo(() => {
    return [...attempts]
      .sort((a, b) => b.at - a.at)
      .slice(0, 5)
      .map((a) => ({
        exercise: a.targetId.toUpperCase(),
        score: a.score,
        status: a.score >= 85 ? 'Excellent' : a.score >= 70 ? 'Good' : a.score >= 50 ? 'Fair' : 'Poor',
      }));
  }, [attempts]);

  const recentActivities = useMemo(() => {
    return [...attempts]
      .sort((a, b) => b.at - a.at)
      .slice(0, 5)
      .map((a, i) => {
        const date = new Date(a.at);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
          id: `${a.at}-${i}`,
          title: `Practice completed`,
          desc: `Practised ${a.level} level for "${a.targetId.toUpperCase()}" with score ${a.score}/100`,
          time: timeStr,
          icon: '🎯',
          color: a.score >= 75 ? 'var(--signal)' : '#0E9F8E',
        };
      });
  }, [attempts]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Page title */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: 4 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>
          Track your progress and continue your speech practice
        </p>
      </div>

      {/* Welcome + goal + stats */}
      <DashboardStats
        attemptsCount={attemptsCount}
        avgScore={avgScore}
        streak={streak}
        bestSound={bestSound}
        practiceSeconds={practiceTime}
        totalMinutes={totalMinutes}
        goalPct={goalPct}
      />

      {/* Charts */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Progress Analytics</h2>
          <button className="btn-ghost" style={{ fontSize: '0.82rem' }} onClick={() => navigate('/app/progress')}>
            View full report
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
        <ProgressChart />
      </section>

      {/* Scores + Activity */}
      <div className="dashboard-split-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <ScoreCard scores={recentScores} />
        <ActivityTimeline items={recentActivities} />
      </div>

      {/* Recommended practice */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Recommended Practice</h2>
          <button className="btn-ghost" style={{ fontSize: '0.82rem' }} onClick={() => navigate('/app/practice')}>
            All exercises
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {RECOMMENDED.map((rec) => {
            const target = TARGETS.find(t => t.id === rec.id) || TARGETS[0];
            return (
              <PracticeCard
                key={rec.id}
                exercise={rec.exercise}
                difficulty={rec.difficulty}
                estimatedTime={rec.estimatedTime}
                onStart={() => navigate(`/app/practice/${target?.id || rec.id}`)}
              />
            );
          })}
        </div>
      </section>

    </div>
  );
}
