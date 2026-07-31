export default function FeedbackCard({ result, loading, error, onRetry }) {
  if (loading) {
    return (
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 16,
        padding: 24,
        boxShadow: 'var(--card-shadow)',
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 6 }} />
            <div className="skeleton" style={{ height: 12, width: '40%' }} />
          </div>
        </div>
        <div className="skeleton" style={{ height: 60, borderRadius: 10, marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 40, borderRadius: 10 }} />
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: '0.85rem', color: 'var(--ink)' }}>
          Analyzing your pronunciation…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 16,
        padding: 24,
        boxShadow: 'var(--card-shadow)',
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--signal)" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--signal)', marginBottom: 4 }}>Analysis Failed</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--ink)' }}>{error}</div>
          </div>
        </div>
        <button onClick={onRetry} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
          Try Again
        </button>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={{
        background: 'var(--paper)',
        border: '1px dashed var(--paper)',
        borderRadius: 16,
        padding: '32px 24px',
        textAlign: 'center',
      }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'white', border: '1px solid var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)', marginBottom: 6 }}>No feedback yet</p>
        <p style={{ fontSize: '0.82rem', color: 'var(--ink)', lineHeight: 1.5 }}>
          Record an attempt and your AI-powered pronunciation analysis will appear here.
        </p>
      </div>
    );
  }

  const { overall_score, verdict, phonemes = [], tip, expected = [], heard = [] } = result;

  const verdictConfig = {
    correct:   { label: 'Excellent',  bg: 'var(--paper)', color: 'var(--signal)', border: 'var(--line)' },
    close:     { label: 'Almost',     bg: 'var(--paper)', color: '#0E9F8E', border: 'var(--line)' },
    incorrect: { label: 'Keep Going', bg: 'var(--paper)', color: 'var(--signal)', border: 'var(--line)' },
  };
  const cfg = verdictConfig[verdict] || verdictConfig.close;

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: 24, boxShadow: 'var(--card-shadow)' }}>
      {/* Score header */}
      <div style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 12,
        padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20,
      }}>
        <div style={{ textAlign: 'center', minWidth: 56 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', color: cfg.color, lineHeight: 1 }}>{overall_score}</div>
          <div style={{ fontSize: '0.7rem', color: cfg.color, fontWeight: 600, opacity: 0.7 }}>/100</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: cfg.color, marginBottom: 2 }}>{cfg.label}</div>
          <div style={{ fontSize: '0.8rem', color: cfg.color, opacity: 0.8 }}>
            {verdict === 'correct' ? 'Great pronunciation!' : verdict === 'close' ? 'Almost there, keep practicing!' : 'Need more practice — you can do it!'}
          </div>
        </div>
        {result.engine && (
          <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: cfg.color, opacity: 0.6 }}>{result.engine}</span>
        )}
      </div>

      {/* Phoneme breakdown */}
      {phonemes.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Phoneme Analysis
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {phonemes.map((p, i) => {
              const pCfg = { correct: { bg: '#FFFFFF', color: 'var(--signal)' }, close: { bg: '#FFFFFF', color: '#0E9F8E' }, incorrect: { bg: '#FFFFFF', color: 'var(--signal)' } }[p.status] || {};
              return (
                <div key={`${p.symbol}-${i}`} style={{
                  padding: '8px 12px', borderRadius: 10,
                  background: pCfg.bg || '#FBF9F4',
                  border: `1px solid ${pCfg.bg || '#FBF9F4'}`,
                  textAlign: 'center', minWidth: 56,
                }}>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem', color: pCfg.color || 'var(--text-primary)' }}>{p.symbol}</div>
                  <div style={{ fontSize: '0.7rem', color: pCfg.color || 'var(--ink)', fontWeight: 600 }}>{p.score}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expected vs heard */}
      {heard.length > 0 && heard.join(' ') !== expected.join(' ') && (
        <div style={{ background: 'var(--paper)', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem' }}>
            <div><span style={{ color: 'var(--ink)', fontWeight: 500 }}>Expected: </span><span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)' }}>{expected.join(' ')}</span></div>
            <div><span style={{ color: 'var(--ink)', fontWeight: 500 }}>Heard: </span><span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)' }}>{heard.join(' ')}</span></div>
          </div>
        </div>
      )}

      {/* AI Tip */}
      {tip && (
        <div style={{
          background: 'linear-gradient(135deg, var(--paper), var(--signal-light))',
          border: '1px solid var(--signal-mid)',
          borderRadius: 12, padding: '12px 14px',
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--signal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--signal)', marginBottom: 3 }}>AI Tip</div>
            <div style={{ fontSize: '0.83rem', color: 'var(--signal)', lineHeight: 1.5 }}>{tip}</div>
          </div>
        </div>
      )}

      {/* Retry */}
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Try Again
        </button>
      )}
    </div>
  );
}
