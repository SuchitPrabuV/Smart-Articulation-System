const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Flip to false on Day 2 once Sukirthan's endpoint is up.
export const USE_MOCK = false;

function mockScore({ target_phoneme, target_text, expected }) {
  const roll = () => 35 + Math.floor(Math.random() * 65);
  const statusOf = (s) => (s >= 75 ? 'correct' : s >= 50 ? 'close' : 'incorrect');
  let t = 0;
  const phonemes = (expected || [target_phoneme]).map((symbol) => {
    const score = roll();
    const start_ms = t;
    t += 120 + Math.floor(Math.random() * 120);
    return { symbol, score, status: statusOf(score), start_ms, end_ms: t };
  });
  const overall = Math.round(phonemes.reduce((a, p) => a + p.score, 0) / phonemes.length);
  return {
    overall_score: overall,
    verdict: statusOf(overall),
    target_phoneme,
    target_text,
    expected: expected || [target_phoneme],
    heard: phonemes.map((p) => p.symbol),
    phonemes,
    tip: 'Mock feedback — the real engine will name the substitution here.',
    duration_ms: t,
    engine: 'mock',
  };
}

export async function health() {
  if (USE_MOCK) return { status: 'ok', engine: 'mock' };
  const r = await fetch(`${BASE}/api/health`);
  if (!r.ok) throw new Error('health failed');
  return r.json();
}

/**
 * @param {Blob} audioBlob
 * @param {{target_phoneme:string, target_text:string, level:string, expected:string[]}} meta
 * @returns {Promise<ScoreResponse>}  shape frozen in CONTRACT.md §3.4
 */
export async function scoreAttempt(audioBlob, meta) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 900)); // fake latency, keeps the UI honest
    return mockScore(meta);
  }
  const fd = new FormData();
  fd.append('audio', audioBlob, 'attempt.webm');
  fd.append('target_phoneme', meta.target_phoneme);
  fd.append('target_text', meta.target_text);
  fd.append('level', meta.level);

  const res = await fetch(`${BASE}/api/score`, { method: 'POST', body: fd });
  if (!res.ok) {
    let detail = 'scoring failed';
    try { detail = (await res.json()).detail || detail; } catch { /* empty body */ }
    const err = new Error(detail);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export async function fetchProgress(userId) {
  if (USE_MOCK) return { attempts: [], totalPracticeSeconds: 0 };
  const res = await fetch(`${BASE}/api/progress/${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error('fetchProgress failed');
  return res.json();
}

export async function saveAttempt(userId, attempt) {
  if (USE_MOCK) return;
  const res = await fetch(`${BASE}/api/progress/${encodeURIComponent(userId)}/attempt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(attempt),
  });
  if (!res.ok) throw new Error('saveAttempt failed');
  return res.json();
}

export async function savePracticeTime(userId, seconds) {
  if (USE_MOCK) return;
  const res = await fetch(`${BASE}/api/progress/${encodeURIComponent(userId)}/time`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ seconds }),
  });
  if (!res.ok) throw new Error('savePracticeTime failed');
  return res.json();
}