import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Avatar from '../animation/Avatar';
import ClipFallback from '../animation/clipFallback';
import { buildTimeline, totalDuration } from '../animation/timeline';
import { phonemeInfo } from '../data/loadContent';

const USE_CLIPS = false;

function phonemesForItem(phoneme, text, level, expected) {
  if (level === 'sound' || !expected?.length) return [phoneme];
  return expected;
}

class Boundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return <ClipFallback phoneme={this.props.phoneme} />;
    }
    return this.props.children;
  }
}

export default function Articulation({ phoneme, text, level = 'sound', expected }) {
  const playRef = useRef({ playing: false, startedAt: 0, timeline: [], speed: 1 });
  const timeoutRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentArpa, setCurrentArpa] = useState('sil');
  const [speed, setSpeed] = useState(1);
  const safePhoneme = String(phoneme || '').toUpperCase();
  const info = phonemeInfo(safePhoneme);
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const timeline = useMemo(
    () => buildTimeline(phonemesForItem(safePhoneme, text, level, expected), level),
    [safePhoneme, text, level, expected]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      playRef.current = { playing: false, startedAt: 0, timeline: [], speed: 1 };
    };
  }, []);

  const play = useCallback(() => {
    if (playing) return;
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    playRef.current = { playing: true, startedAt: performance.now(), timeline, speed };
    setPlaying(true);
    setCurrentArpa(safePhoneme);
    const duration = prefersReducedMotion ? 100 : totalDuration(timeline) + 100;
    timeoutRef.current = window.setTimeout(() => {
      playRef.current.playing = false;
      setPlaying(false);
      setCurrentArpa('sil');
      timeoutRef.current = null;
    }, duration);
  }, [playing, timeline, speed, safePhoneme, prefersReducedMotion]);

  if (USE_CLIPS) return <ClipFallback phoneme={safePhoneme} />;

  return (
    <div>
      <div className="aspect-video rounded-[10px] overflow-hidden bg-paper border border-line">
        <Boundary phoneme={safePhoneme}>
          <Canvas camera={{ position: [0, 0.05, 0.62], fov: 22 }}>
            <ambientLight intensity={1.1} />
            <directionalLight position={[1, 2, 2]} intensity={1.4} />
            <Suspense fallback={null}>
              <Avatar playRef={playRef} currentArpa={currentArpa} onFrame={setCurrentArpa} />
            </Suspense>
          </Canvas>
        </Boundary>
      </div>

      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <button
          onClick={play}
          disabled={playing}
          className="px-4 h-10 rounded-[10px] text-sm font-medium border border-line disabled:opacity-40"
        >
          {playing ? 'Playing…' : `Show ${info.label || safePhoneme || 'sound'}`}
        </button>
        <label className="text-xs text-muted mono flex items-center gap-2">
          <span>Speed</span>
          <select
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
            className="rounded border border-line bg-[var(--paper)] px-2 py-1"
          >
            <option value={1}>1×</option>
            <option value={0.5}>0.5×</option>
          </select>
        </label>
        <span className="mono text-xs text-muted">{info.ipa} · {info.place}</span>
        {currentArpa === safePhoneme && <span className="mono text-xs" style={{ color: 'var(--signal)' }}>▸ {safePhoneme}</span>}
      </div>
    </div>
  );
}
