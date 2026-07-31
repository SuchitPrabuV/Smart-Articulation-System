import { NEUTRAL, visemeFor } from './visemeMap.js';

const VOWELS = new Set(['AA', 'AE', 'AH', 'AO', 'AW', 'AY', 'EH', 'ER', 'EY', 'IH', 'IY', 'OW', 'OY', 'UH', 'UW']);
const STOPS = new Set(['P', 'B', 'T', 'D', 'K', 'G']);

function durationFor(arpa, level) {
  const base = VOWELS.has(arpa) ? 220 : 160;
  const d = STOPS.has(arpa) ? 110 : base;
  return level === 'sound' ? d * 4 : d;
}

export function buildTimeline(phonemes, level = 'word') {
  const out = [];
  let t = 250;
  out.push({ viseme: NEUTRAL, arpa: 'sil', start: 0, end: t });

  for (const p of phonemes) {
    const d = durationFor(String(p).toUpperCase(), level);
    out.push({ viseme: visemeFor(p), arpa: String(p).toUpperCase(), start: t, end: t + d });
    t += d;
  }

  out.push({ viseme: NEUTRAL, arpa: 'sil', start: t, end: t + 300 });
  return out;
}

export function totalDuration(timeline) {
  return timeline.length ? timeline[timeline.length - 1].end : 0;
}

export function frameAt(timeline, tMs) {
  for (let i = 0; i < timeline.length; i += 1) {
    const frame = timeline[i];
    if (tMs >= frame.start && tMs < frame.end) {
      const progress = (tMs - frame.start) / (frame.end - frame.start);
      return { frame, next: timeline[i + 1] || null, progress };
    }
  }
  return { frame: timeline[timeline.length - 1] || null, next: null, progress: 1 };
}
