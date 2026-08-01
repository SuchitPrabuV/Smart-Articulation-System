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

// Phonetic spellings so browser TTS speaks the SOUND (e.g. "sss") at sound
// level, instead of reading the ARPAbet letter name (e.g. "ess"). Falls back
// to the raw phoneme for anything unmapped.
const SOUND_SPEECH = {
  S: 's', Z: 'z', SH: 'sh', ZH: 'zh', CH: 'ch', JH: 'j',
  TH: 'th', DH: 'th', F: 'f', V: 'v', R: 'r', L: 'l',
  K: 'kuh', G: 'guh', M: 'm', N: 'n', NG: 'ng', HH: 'huh',
  P: 'puh', B: 'buh', T: 'tuh', D: 'duh', W: 'wuh', Y: 'yuh',
  AA: 'ah', AE: 'a', AH: 'uh', AO: 'aw', AW: 'ow', AY: 'eye',
  EH: 'eh', ER: 'er', EY: 'ay', IH: 'ih', IY: 'ee', OW: 'oh',
  OY: 'oy', UH: 'uh', UW: 'oo',
};

// What TTS should actually say for the current target.
function utteranceFor(level, text, phoneme) {
  if (level === 'sound') {
    return SOUND_SPEECH[String(phoneme || '').toUpperCase()] || phoneme || '';
  }
  return text || phoneme || '';
}

// Best-quality female English voices, most preferred first. Names vary by
// OS/browser, so we match by substring and fall back gracefully.
const PREFERRED_FEMALE = [
  'aria', 'jenny', 'michelle', 'emma', 'ava', 'nova',          // Edge "Natural" / online
  'google us english', 'google uk english female',            // Chrome
  'samantha', 'karen', 'serena', 'moira', 'tessa', 'fiona',    // macOS / iOS
  'zira', 'hazel', 'susan', 'linda', 'heera',                 // Windows / other local
];
const FEMALE_HINTS = ['female', 'woman', ...PREFERRED_FEMALE, 'joanna', 'salli', 'kendra', 'victoria', 'sonia', 'natasha'];
const MALE_HINTS = ['david', 'mark', 'ravi', 'guy', 'eric', 'christopher', 'roger', 'daniel', 'george', 'james', 'male', 'alex', 'fred', 'tom', 'william', 'richard'];

// Pick the nicest available female English voice.
function pickFemaleVoice(voices) {
  if (!voices || !voices.length) return null;
  const en = voices.filter((v) => /^en/i.test(v.lang));
  const pool = en.length ? en : voices;
  for (const needle of PREFERRED_FEMALE) {
    const v = pool.find((x) => x.name.toLowerCase().includes(needle));
    if (v) return v;
  }
  const byHint = pool.find((v) => {
    const n = v.name.toLowerCase();
    return FEMALE_HINTS.some((h) => n.includes(h)) && !MALE_HINTS.some((h) => n.includes(h));
  });
  if (byHint) return byHint;
  const notMale = pool.find((v) => !MALE_HINTS.some((h) => v.name.toLowerCase().includes(h)));
  return notMale || pool.find((v) => /en[-_]us/i.test(v.lang)) || pool[0];
}

// Rough spoken-duration estimate in ms, calibrated against measured TTS output:
// a large fixed overhead plus per-character time, and slower rates stretch the
// body (halving the rate is ~1.37x longer, not 2x). Only used to space the
// in-between visemes — the mouth's exact start/stop is driven by speech events.
function estimateSpeechMs(text, rate) {
  const chars = String(text || '').replace(/\s+/g, '').length || 1;
  const base = 1050 + 70 * chars;                        // ~duration at rate 1
  const rateFactor = 0.63 + 0.37 / Math.max(0.1, rate || 1);
  return Math.round(base * rateFactor);
}

class Boundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError(error) {
    console.error("Boundary caught error:", error);
    return { failed: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Boundary componentDidCatch:", error, errorInfo);
  }

  render() {
    if (this.state.failed) {
      return <ClipFallback phoneme={this.props.phoneme} />;
    }
    return this.props.children;
  }
}

export default function Articulation({ phoneme, text, level = 'sound', expected, playing }) {
  const [speed, setSpeed] = useState(1);
  const playRef = useRef({ playing: false, startedAt: 0, timeline: [], speed: 1 });
  const timeoutRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentArpa, setCurrentArpa] = useState('sil');
  const safePhoneme = String(phoneme || '').toUpperCase();
  const info = phonemeInfo(safePhoneme);
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // True only while a user-initiated "Show" playback is running, so we speak on
  // the button but stay silent when the animation auto-plays during recording.
  const manualRef = useRef(false);

  const cancelSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Kick off async voice loading so the first "Show" click already has an
  // en-US voice available (getVoices() is empty until this fires).
  useEffect(() => {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    if (!synth) return undefined;
    synth.getVoices();
    const noop = () => {};
    synth.addEventListener?.('voiceschanged', noop);
    return () => synth.removeEventListener?.('voiceschanged', noop);
  }, []);

  const timeline = useMemo(
    () => buildTimeline(phonemesForItem(safePhoneme, text, level, expected), level),
    [safePhoneme, text, level, expected]
  );

  // Bumped on every start/stop so stale speech callbacks (e.g. a cancelled
  // utterance firing onend late) can tell they no longer own the playback.
  const playTokenRef = useRef(0);

  // Stop mouth + reset to neutral. Invalidates any in-flight speech callbacks.
  const stopPlayback = useCallback(() => {
    playTokenRef.current += 1;
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    playRef.current.playing = false;
    setIsPlaying(false);
    setCurrentArpa('sil');
  }, []);

  // Start the mouth, stretching the viseme timeline to fill `windowMs` of
  // wall-clock time so it lines up with however long the audio actually runs.
  const startAnim = useCallback((windowMs, token) => {
    if (token !== playTokenRef.current) return;
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const total = Math.max(1, totalDuration(timeline));
    const motionSpan = prefersReducedMotion ? 100 : Math.max(1, windowMs);
    playRef.current = {
      playing: true,
      startedAt: performance.now(),
      timeline,
      speed,
      mapScale: total / motionSpan,     // wall-clock ms -> timeline ms
    };
    setIsPlaying(true);
    setCurrentArpa(safePhoneme);
    // Safety net in case onend never fires (some browsers drop it).
    timeoutRef.current = window.setTimeout(() => {
      if (token === playTokenRef.current) stopPlayback();
    }, Math.max(motionSpan, windowMs) + 400);
  }, [timeline, safePhoneme, prefersReducedMotion, speed, stopPlayback]);

  // Manual "Show": speak with the female voice AND drive the mouth from the
  // speech's own start/stop events, so the two correspond at any speed.
  const runManual = useCallback((rate) => {
    manualRef.current = true;
    const token = ++playTokenRef.current;
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    const toSay = utteranceFor(level, text, safePhoneme);
    const estMs = estimateSpeechMs(toSay, rate);

    // No speech available — fall back to a timed animation.
    if (!synth || !toSay) {
      startAnim(estMs, token);
      return;
    }

    const begin = () => startAnim(estMs, token);

    const doSpeak = () => {
      if (token !== playTokenRef.current) return;
      const u = new SpeechSynthesisUtterance(toSay);
      u.lang = 'en-US';
      u.rate = Math.max(0.1, Math.min(2, rate || 1));
      const v = pickFemaleVoice(synth.getVoices());
      if (v) u.voice = v;
      let started = false;
      u.onstart = () => { started = true; begin(); };   // mouth starts with the audio
      u.onend = () => { if (token === playTokenRef.current) stopPlayback(); }; // and stops with it
      u.onerror = (e) => {
        if (e.error !== 'canceled' && e.error !== 'interrupted') console.error('[tts]', e.error);
      };
      synth.speak(u);
      // If onstart is late or never fires, start the mouth anyway.
      window.setTimeout(() => { if (!started) begin(); }, 350);
    };

    // Chrome/Edge silently drop a speak() issued in the same tick as cancel().
    if (synth.speaking || synth.pending) {
      synth.cancel();
      window.setTimeout(doSpeak, 120);
    } else {
      doSpeak();
    }
  }, [level, text, safePhoneme, startAnim, stopPlayback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      playRef.current = { playing: false, startedAt: 0, timeline: [], speed: 1 };
    };
  }, []);

  const prevPlayingRef = useRef(false);

  // Silent, timed animation used when the guide auto-plays during recording.
  const play = useCallback(() => {
    if (playRef.current.playing) return;
    const token = ++playTokenRef.current;
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const span = prefersReducedMotion ? 100 : (totalDuration(timeline) + 100) / speed;
    playRef.current = { playing: true, startedAt: performance.now(), timeline, speed, mapScale: speed };
    setIsPlaying(true);
    setCurrentArpa(safePhoneme);
    timeoutRef.current = window.setTimeout(() => {
      if (token === playTokenRef.current) stopPlayback();
    }, span);
  }, [timeline, safePhoneme, prefersReducedMotion, speed, stopPlayback]);

  const changeSpeed = useCallback((newSpeed) => {
    setSpeed(newSpeed);
    playRef.current.speed = newSpeed;
    if (!playRef.current.playing) return;
    if (manualRef.current) {
      runManual(newSpeed);      // re-speak + re-sync the mouth at the new speed
    } else {
      stopPlayback();           // recording auto-play: restart timed animation
      play();
    }
  }, [runManual, play, stopPlayback]);

  useEffect(() => {
    if (playing !== prevPlayingRef.current) {
      prevPlayingRef.current = playing;
      if (playing) {
        // Auto-play during recording must stay silent — otherwise the
        // reference audio would bleed into the mic capture.
        manualRef.current = false;
        stopPlayback();
        cancelSpeech();
        play();
      } else {
        cancelSpeech();
        stopPlayback();
      }
    }
  }, [playing, play, cancelSpeech, stopPlayback]);

  if (USE_CLIPS) return <ClipFallback phoneme={safePhoneme} />;

  return (
    <div>
      <div className="aspect-video rounded-[10px] overflow-hidden bg-paper border border-line">
        <Boundary phoneme={safePhoneme}>
          <Canvas camera={{ position: [0, 0, 0.45], fov: 12 }}>
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
          onClick={() => runManual(speed)}
          disabled={isPlaying || playing}
          className="px-4 h-10 rounded-[10px] text-sm font-medium border border-line disabled:opacity-40"
          style={{ background: 'var(--card)', color: 'var(--text-primary)', cursor: 'pointer', transition: 'background 0.2s' }}
        >
          {isPlaying || playing ? 'Playing…' : `Show ${info.label || safePhoneme || 'sound'}`}
        </button>
        <span className="mono text-xs text-muted" style={{ marginLeft: 'auto' }}>
          {info.ipa} · {info.place}
        </span>
        {(isPlaying || playing) && <span className="mono text-xs" style={{ color: 'var(--signal)' }}>▸ {currentArpa}</span>}
      </div>

      <div className="mt-4 pt-3 border-t border-line flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted" style={{ color: 'var(--muted)', opacity: 0.8 }}>
            Playback Speed
          </span>
          <span className="text-xs font-bold" style={{ color: 'var(--signal)' }}>
            {speed}x
          </span>
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-paper border border-line rounded-[12px]">
          {[0.25, 0.5, 0.75, 1, 1.5].map((val) => (
            <button
              key={val}
              onClick={() => changeSpeed(val)}
              className="flex-1 py-1.5 text-xs font-semibold rounded-[8px] transition-all"
              style={{
                background: speed === val ? 'var(--signal)' : 'transparent',
                color: speed === val ? 'var(--text-on-signal)' : 'var(--text-primary)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {val}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
