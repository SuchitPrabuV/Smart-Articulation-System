import { useNavigate } from 'react-router-dom';
import DashboardStats from '../components/DashboardStats';
import ProgressChart from '../components/ProgressChart';
import ScoreCard from '../components/ScoreCard';
import PracticeCard from '../components/PracticeCard';
import ActivityTimeline from '../components/ActivityTimeline';
import { TARGETS, phonemeInfo } from '../data/loadContent';

const RECOMMENDED = [
  { id: 'r', exercise: '"R"',  difficulty: 'Medium', estimatedTime: '5 min' },
  { id: 'th', exercise: '"TH"', difficulty: 'Hard',   estimatedTime: '7 min' },
  { id: 'l', exercise: '"L"',  difficulty: 'Easy',   estimatedTime: '4 min' },
];

export default function Dashboard() {
  const navigate = useNavigate();

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
      <DashboardStats />

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
        <ScoreCard />
        <ActivityTimeline />
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
