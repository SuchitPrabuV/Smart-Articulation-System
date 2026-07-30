const attempts = [];
const listeners = new Set();

export function pushAttempt(a) {
  attempts.push(a);
  listeners.forEach((fn) => fn([...attempts]));
}
export function getAttempts() { return [...attempts]; }
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
