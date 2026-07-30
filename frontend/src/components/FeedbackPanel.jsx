const cls = { correct: 'status-correct', close: 'status-close', incorrect: 'status-incorrect' };
const label = { correct: 'Correct', close: 'Close', incorrect: 'Try again' };

export default function FeedbackPanel({ result, loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="card p-6 text-muted text-sm">Listening back to your attempt…</div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <p className="text-wrong font-medium">{error}</p>
        <button onClick={onRetry} className="mt-3 text-sm underline text-ink">
          Record again
        </button>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="card p-6 text-muted text-sm">
        Record an attempt to see how each sound landed.
      </div>
    );
  }

  const { overall_score, verdict, phonemes = [], tip, expected = [], heard = [] } = result;

  return (
    <div className="card p-6">
      <div className="flex items-baseline gap-3">
        <span className={`mono text-4xl font-bold ${cls[verdict]}`}>{overall_score}</span>
        <span className={`font-display font-bold ${cls[verdict]}`}>{label[verdict]}</span>
        {result.engine && (
          <span className="ml-auto text-[10px] uppercase tracking-widest text-muted">
            {result.engine}
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {phonemes.map((p, i) => (
          <div
            key={`${p.symbol}-${i}`}
            className="px-3 py-2 rounded-[10px] border border-line text-center min-w-[64px]"
          >
            <div className={`mono font-bold ${cls[p.status]}`}>{p.symbol}</div>
            <div className="mono text-[11px] text-muted">{p.score}</div>
          </div>
        ))}
      </div>

      {heard.length > 0 && heard.join(' ') !== expected.join(' ') && (
        <p className="mt-4 mono text-xs text-muted">
          expected {expected.join(' ')} · heard {heard.join(' ')}
        </p>
      )}

      <p className="mt-5 leading-relaxed">{tip}</p>
    </div>
  );
}
