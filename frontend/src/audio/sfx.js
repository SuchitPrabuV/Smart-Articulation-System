// Tiny self-contained sound effects via the Web Audio API — no asset files.
// Used to reward young learners when they nail a sound.

let ctx = null;

function getCtx() {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

// One hand-clap: a short burst of band-passed noise with a fast decay.
function scheduleClap(ac, dest, time, gainValue) {
  const dur = 0.09;
  const buffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * dur), ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;

  const src = ac.createBufferSource();
  src.buffer = buffer;

  const bp = ac.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 1100 + Math.random() * 900;
  bp.Q.value = 0.7;

  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, time);
  g.gain.exponentialRampToValueAtTime(gainValue, time + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, time + dur);

  src.connect(bp);
  bp.connect(g);
  g.connect(dest);
  src.start(time);
  src.stop(time + dur);
}

// A short burst of applause: many overlapping claps over ~1.3s.
export function playApplause() {
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;

  const master = ac.createGain();
  master.gain.value = 0.85;
  master.connect(ac.destination);

  // Two emphatic lead claps, then a scattered crowd.
  scheduleClap(ac, master, now + 0.02, 0.9);
  scheduleClap(ac, master, now + 0.16, 0.8);
  for (let i = 0; i < 20; i += 1) {
    const t = now + 0.05 + Math.random() * 1.25;
    scheduleClap(ac, master, t, 0.25 + Math.random() * 0.5);
  }
}
