export type CookieConsentChoice = 'accepted' | 'rejected';

export const COOKIE_CONSENT_KEY = 'novaro_cookie_consent_v1';
export const CONSENT_UPDATED_EVENT = 'novaro-consent-updated';
export const OPEN_CONSENT_EVENT = 'novaro-open-consent';

export function readCookieConsent(): CookieConsentChoice | null {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  if (stored === 'accepted' || stored === 'rejected') return stored;
  return null;
}

export function writeCookieConsent(choice: CookieConsentChoice) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(COOKIE_CONSENT_KEY, choice);
  window.dispatchEvent(new CustomEvent(CONSENT_UPDATED_EVENT, { detail: { choice } }));
}

export function clearCookieConsent() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(COOKIE_CONSENT_KEY);
  window.dispatchEvent(new CustomEvent(CONSENT_UPDATED_EVENT, { detail: { choice: null } }));
}
