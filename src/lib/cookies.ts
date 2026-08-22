export const COOKIE_CONSENT_KEY = "stampabr:cookie-consent";
export const COOKIE_CONSENT_EVENT = "stampabr-cookie-consent";

export type CookieConsent = "all" | "necessary";

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    return value === "all" || value === "necessary" ? value : null;
  } catch {
    return null;
  }
}

export function writeCookieConsent(value: CookieConsent) {
  window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}
