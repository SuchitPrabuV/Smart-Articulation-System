import { fetchProgress, saveAttempt, savePracticeTime } from '../api/client';

const USER_ID = 'default_user';
let attempts = [];
let totalPracticeSeconds = 0;
const listeners = new Set();
let initialized = false;

export async function initSession() {
  if (initialized) return;
  try {
    const data = await fetchProgress(USER_ID);
    attempts = data.attempts || [];
    totalPracticeSeconds = data.totalPracticeSeconds || 0;
    initialized = true;
    listeners.forEach((fn) => fn([...attempts], totalPracticeSeconds));
  } catch (err) {
    console.error('Failed to load session progress:', err);
  }
}

// Start loading on page load
initSession();

export function pushAttempt(a) {
  attempts.push(a);
  listeners.forEach((fn) => fn([...attempts], totalPracticeSeconds));
  saveAttempt(USER_ID, a).catch(err => console.error('Failed to save attempt:', err));
}

export function addPracticeTime(seconds) {
  totalPracticeSeconds += seconds;
  listeners.forEach((fn) => fn([...attempts], totalPracticeSeconds));
  savePracticeTime(USER_ID, seconds).catch(err => console.error('Failed to save practice time:', err));
}

export function getAttempts() { return [...attempts]; }
export function getPracticeTime() { return totalPracticeSeconds; }

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
