import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart,
  BarChart, Bar,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  Legend,
} from 'recharts';

const weeklyData = [
  { day: 'Mon', score: 72 },
  { day: 'Tue', score: 78 },
  { day: 'Wed', score: 75 },
  { day: 'Thu', score: 83 },
  { day: 'Fri', score: 88 },
  { day: 'Sat', score: 85 },
  { day: 'Sun', score: 91 },
];

const accuracyData = [
  { sound: '/S/', accuracy: 92 },
  { sound: '/R/', accuracy: 84 },
  { sound: '/TH/', accuracy: 76 },
  { sound: '/L/', accuracy: 88 },
  { sound: '/CH/', accuracy: 80 },
  { sound: '/SH/', accuracy: 86 },
];

const radarData = [
  { metric: 'Accuracy',   value: 88 },
  { metric: 'Clarity',    value: 82 },
  { metric: 'Fluency',    value: 75 },
  { metric: 'Confidence', value: 70 },
  { metric: 'Pace',       value: 78 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'white',
      border: '1px solid var(--paper)',
      borderRadius: 10,
      padding: '10px 14px',
      boxShadow: '0 4px 16px rgba(0,0,0,.08)',
    }}>
      <p style={{ fontSize: '0.78rem', color: 'var(--ink)', marginBottom: 4 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ fontSize: '0.9rem', fontWeight: 700, color: p.color || 'var(--signal)' }}>
          {p.value}{p.name === 'score' ? '' : '%'}
        </p>
      ))}
    </div>
  );
};

export default function ProgressChart() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {/* Weekly Line Chart */}
      <ChartCard title="Weekly Progress" subtitle="Score over the past 7 days">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--signal)" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="var(--signal)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#FBF9F4" vertical={false}/>
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#16233A' }} axisLine={false} tickLine={false}/>
            <YAxis domain={[60, 100]} tick={{ fontSize: 12, fill: '#16233A' }} axisLine={false} tickLine={false}/>
            <Tooltip content={<CustomTooltip />}/>
            <Area
              type="monotone"
              dataKey="score"
              stroke="var(--signal)"
              strokeWidth={2.5}
              fill="url(#lineGrad)"
              dot={{ fill: 'var(--signal)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'white', strokeWidth: 2, fill: 'var(--signal)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Bar Chart — accuracy */}
      <ChartCard title="Exercise Accuracy" subtitle="Per-phoneme breakdown">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={accuracyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#FBF9F4" horizontal vertical={false}/>
            <XAxis dataKey="sound" tick={{ fontSize: 11, fill: '#16233A' }} axisLine={false} tickLine={false}/>
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#16233A' }} axisLine={false} tickLine={false}/>
            <Tooltip content={<CustomTooltip />}/>
            <Bar
              dataKey="accuracy"
              fill="var(--signal)"
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Radar Chart */}
      <ChartCard title="Speech Profile" subtitle="Multi-dimensional skill radar">
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData} outerRadius="75%">
            <PolarGrid stroke="#FBF9F4" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#16233A' }}/>
            <Radar
              name="Score"
              dataKey="value"
              stroke="var(--signal)"
              fill="var(--signal)"
              fillOpacity={0.12}
              strokeWidth={2}
              dot={{ fill: 'var(--signal)', r: 3 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Mini trend cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { label: 'Best session this week', value: '91', sub: 'Sunday · /S/ exercise', color: 'var(--signal)' },
          { label: 'Most improved sound', value: '/R/', sub: '+12pts from last week', color: 'var(--signal)' },
          { label: 'Weakest area', value: '/TH/', sub: 'Needs more practice', color: 'var(--signal)' },
        ].map((item) => (
          <div key={item.label} style={{
            background: 'white',
            border: '1px solid var(--paper)',
            borderRadius: 12,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flex: 1,
            boxShadow: 'var(--card-shadow)',
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: item.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', color: item.color }}>{item.value}</span>
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--ink)' }}>{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid var(--paper)',
      borderRadius: 16,
      padding: '20px 20px 12px',
      boxShadow: 'var(--card-shadow)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 2 }}>{title}</h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--ink)' }}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
