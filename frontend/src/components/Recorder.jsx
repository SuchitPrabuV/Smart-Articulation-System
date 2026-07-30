export default function Recorder({ state, onStart, onStop, onReplay, disabled, timer }) {
  const isRecording = state === 'recording';
  const isDone = state === 'done' || state === 'idle';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      {/* Timer */}
      {isRecording && timer != null && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          color: 'var(--signal)', fontWeight: 700, fontSize: '0.9rem',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--signal)', animation: 'pulseRing 1s ease-out infinite' }} />
          REC · {String(Math.floor(timer / 60)).padStart(2,'0')}:{String(timer % 60).padStart(2,'0')}
        </div>
      )}

      {/* Main record button */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Pulse rings when recording */}
        {isRecording && (
          <>
            <div style={{
              position: 'absolute',
              width: 100, height: 100,
              borderRadius: '50%',
              border: '2px solid rgba(224,128,60,0.4)',
              animation: 'pulseRing 1.5s ease-out infinite',
            }} />
            <div style={{
              position: 'absolute',
              width: 120, height: 120,
              borderRadius: '50%',
              border: '2px solid rgba(224,128,60,0.2)',
              animation: 'pulseRing 1.5s ease-out 0.4s infinite',
            }} />
          </>
        )}

        <button
          onClick={isRecording ? onStop : onStart}
          disabled={disabled}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          id="recorder-main-btn"
          style={{
            width: 76, height: 76,
            borderRadius: '50%',
            background: isRecording
              ? 'var(--signal)'
              : 'var(--signal)',
            border: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white',
            boxShadow: isRecording
              ? '0 0 0 6px rgba(224,128,60,.15), 0 4px 20px rgba(224,128,60,.4)'
              : '0 4px 20px rgba(14,159,142,.35)',
            transition: 'all 0.25s ease',
            transform: isRecording ? 'scale(1.05)' : 'scale(1)',
            opacity: disabled ? 0.6 : 1,
            position: 'relative',
            zIndex: 1,
          }}
          onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = isRecording ? 'scale(1.08)' : 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = isRecording ? 'scale(1.05)' : 'scale(1)'; }}
        >
          {isRecording ? (
            /* Stop icon */
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="6" width="12" height="12" rx="2"/>
            </svg>
          ) : (
            /* Mic icon */
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" x2="12" y1="19" y2="22"/>
              <line x1="8" x2="16" y1="22" y2="22"/>
            </svg>
          )}
        </button>
      </div>

      {/* Secondary controls */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          onClick={onReplay}
          disabled={!onReplay || state === 'idle' || state === 'recording'}
          className="btn-secondary"
          style={{ padding: '8px 18px', fontSize: '0.85rem', opacity: (!onReplay || state === 'idle' || state === 'recording') ? 0.4 : 1 }}
          id="recorder-replay-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Replay
        </button>
        <span style={{ fontSize: '0.8rem', color: 'var(--ink)', fontWeight: 500 }}>
          {isRecording ? 'Tap to stop' : 'Tap mic to record'}
        </span>
      </div>
    </div>
  );
}
