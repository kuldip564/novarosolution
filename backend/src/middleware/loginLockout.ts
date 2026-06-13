type LockEntry = {
  attempts: number;
  lockedUntil: number;
};

const lockouts = new Map<string, LockEntry>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export function isLoginLocked(email: string): boolean {
  const entry = lockouts.get(email.toLowerCase());
  if (!entry) return false;
  if (Date.now() >= entry.lockedUntil) {
    lockouts.delete(email.toLowerCase());
    return false;
  }
  return entry.attempts >= MAX_ATTEMPTS;
}

export function recordFailedLogin(email: string): void {
  const key = email.toLowerCase();
  const entry = lockouts.get(key) ?? { attempts: 0, lockedUntil: 0 };
  entry.attempts += 1;
  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCKOUT_MS;
  }
  lockouts.set(key, entry);
}

export function clearLoginAttempts(email: string): void {
  lockouts.delete(email.toLowerCase());
}
