import { useMemo, useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTarget, getItems, phonemeInfo } from '../data/loadContent';
import { scoreAttempt } from '../api/client';
import { useRecorder } from '../hooks/useRecorder';
import { pushAttempt } from '../data/session';
import Waveform from '../components/Waveform';
import Recorder from '../components/Recorder';
import FeedbackCard from '../components/FeedbackCard';

export default function Practice() {
  const { targetId } = useParams();
  const navigate = useNavigate();
  const target = getTarget(targetId);

  const [level, setLevel] = useState('sound');
  const [idx, setIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  const { state, level: micLevel, error: micError, start, stop } = useRecorder();
  const items = useMemo(() => getItems(targetId, level), [targetId, level]);
  const item = items[idx];
  const info = target ? phonemeInfo(target.phoneme) : null;

  // Timer during recording
  useEffect(() => {
    if (state === 'recording') {
      setTimer(0);
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [state]);

  if (!target) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: 12 }}>Sound not found</h2>
        <p style={{ color: 'var(--ink)', marginBottom: 24 }}>The requested exercise doesn't exist.</p>
        <Link to="/app/lessons" className="btn-primary">Browse Lessons</Link>
      </div>
    );
  }

  function changeLevel(next) { setLevel(next); setIdx(0); setResult(null); setError(null); }
  function nextItem() { setIdx(i => (i + 1) % items.length); setResult(null); setError(null); }
  function prevItem() { setIdx(i => (i - 1 + items.length) % items.length); setResult(null); setError(null); }

  async function handleStop() {
    const blob = await stop();
    if (!blob) return;
    setLoading(true);
    setError(null);
    try {
      const res = await scoreAttempt(blob, {
        target_phoneme: target.phoneme,
        target_text: item.text,
        level,
        expected: item.expected,
      });
      setResult(res);
      pushAttempt({ targetId, level, itemId: item.id, score: res.overall_score, at: Date.now() });
    } catch (e) {
      setError(e.message || 'Could not score that attempt.');
    } finally {
      setLoading(false);
    }
  }

  const LEVELS = ['sound', 'word', 'sentence'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--ink)' }}>
        <button onClick={() => navigate('/app/lessons')} className="btn-ghost" style={{ padding: '4px 8px', fontSize: '0.85rem' }}>
          Lessons
        </button>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Practising {target.phoneme}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>

        {/* ── LEFT: Main practice panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Header card */}
          <div style={{ background: 'white', border: '1px solid var(--paper)', borderRadius: 16, padding: '24px 28px', boxShadow: 'var(--card-shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>
                  {info?.label || target.phoneme}
                  <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--ink)', marginLeft: 10, fontFamily: 'monospace' }}>
                    {info?.ipa}
                  </span>
                </h1>
                {info?.cue && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--ink)', lineHeight: 1.5 }}>{info.cue}</p>
                )}
              </div>
              {/* Level tabs */}
              <div style={{ display: 'flex', gap: 4, background: 'var(--paper)', borderRadius: 10, padding: 4 }}>
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => changeLevel(l)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 8,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.83rem',
                      fontWeight: 600,
                      transition: 'all 0.15s',
                      background: level === l ? 'white' : 'transparent',
                      color: level === l ? 'var(--blue-primary)' : 'var(--ink)',
                      boxShadow: level === l ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
                      textTransform: 'capitalize',
                      fontFamily: 'var(--font-body)',
                    }}
                    id={`level-tab-${l}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Target text */}
            {item && (
              <div style={{
                background: 'linear-gradient(135deg, var(--paper), var(--signal-light))',
                border: '1px solid var(--signal-mid)',
                borderRadius: 14,
                padding: '20px 24px',
                textAlign: 'center',
                marginBottom: 16,
              }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--signal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  {level === 'sound' ? 'Target Sound' : level === 'word' ? 'Target Word' : 'Target Sentence'}
                </p>
                <p style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: level === 'sentence' ? '1.3rem' : '2.5rem',
                  color: 'var(--signal)',
                  letterSpacing: level === 'sentence' ? '-0.01em' : '-0.03em',
                  lineHeight: 1.2,
                  marginBottom: item.prompt ? 8 : 0,
                }}>
                  {item.text}
                </p>
                {item.prompt && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--signal)', marginTop: 6 }}>{item.prompt}</p>
                )}
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={prevItem} className="btn-ghost" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
                Previous
              </button>
              <span style={{ fontSize: '0.82rem', color: 'var(--ink)', fontWeight: 600 }}>
                {idx + 1} / {items.length}
              </span>
              <button onClick={nextItem} className="btn-ghost" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                Next
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          {/* Recording card — focal point */}
          <div style={{
            background: 'white',
            border: '1px solid var(--paper)',
            borderRadius: 20,
            padding: '36px 28px',
            boxShadow: 'var(--card-shadow-lg)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 24,
          }}>
            <div style={{ width: '100%', background: 'var(--paper)', borderRadius: 12, padding: '12px 8px' }}>
              <Waveform isRecording={state === 'recording'} />
            </div>

            {/* Mic level indicator */}
            {state === 'recording' && micLevel != null && (
              <div style={{ width: '80%', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--ink)' }}>
                  <span>Mic Level</span>
                  <span style={{ fontWeight: 600, color: micLevel > 60 ? 'var(--signal)' : micLevel > 30 ? 'var(--signal)' : 'var(--ink)' }}>{micLevel}%</span>
                </div>
                <div style={{ height: 6, background: '#FBF9F4', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${micLevel}%`,
                    background: micLevel > 60 ? 'var(--signal)' : micLevel > 30 ? 'var(--signal)' : '#FBF9F4',
                    borderRadius: 999, transition: 'width 0.1s',
                  }} />
                </div>
              </div>
            )}

            <Recorder
              state={state}
              onStart={start}
              onStop={handleStop}
              onReplay={null}
              disabled={loading}
              timer={timer}
            />

            {micError && (
              <p style={{ fontSize: '0.85rem', color: 'var(--signal)', background: '#FFFFFF', padding: '8px 14px', borderRadius: 8, border: '1px solid var(--signal)' }}>
                {micError}
              </p>
            )}
          </div>
        </div>

        {/* ── RIGHT: Feedback panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FeedbackCard
            result={result}
            loading={loading}
            error={error}
            onRetry={() => { setResult(null); setError(null); }}
          />

          {/* Next exercise button */}
          {result && (
            <button
              onClick={nextItem}
              className="btn-primary"
              style={{ justifyContent: 'center', padding: '12px' }}
              id="practice-next-exercise"
            >
              Next Exercise
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          )}

          {/* Session info */}
          <div style={{ background: 'white', border: '1px solid var(--paper)', borderRadius: 14, padding: '16px 18px', boxShadow: 'var(--card-shadow)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: 14 }}>Session Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Target sound', value: target.phoneme },
                { label: 'Level', value: level.charAt(0).toUpperCase() + level.slice(1) },
                { label: 'Exercise', value: `${idx + 1} of ${items.length}` },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem' }}>
                  <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{label}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'monospace' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
