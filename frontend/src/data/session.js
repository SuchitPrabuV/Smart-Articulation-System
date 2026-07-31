const attempts = [];
let totalPracticeSeconds = 0;
const listeners = new Set();

export function pushAttempt(a) {
  attempts.push(a);
  listeners.forEach((fn) => fn([...attempts], totalPracticeSeconds));
}

export function addPracticeTime(seconds) {
  totalPracticeSeconds += seconds;
  listeners.forEach((fn) => fn([...attempts], totalPracticeSeconds));
}

export function getAttempts() { return [...attempts]; }
export function getPracticeTime() { return totalPracticeSeconds; }

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
