/**
 * Normalize stored URLs for resumes and links (Cloudinary, https pastes, etc.).
 * Returns empty string if the value is not a safe http(s) URL.
 */
export function normalizeHttpUrl(raw: string | undefined | null): string {
  if (raw == null) return '';
  let t = String(raw).trim();
  if (!t) return '';
  t = t.replace(/\s+/g, '').replace(/&amp;/g, '&');
  try {
    const u = new URL(t);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
    if (u.username || u.password) return '';
    return u.href;
  } catch {
    try {
      const u = new URL(encodeURI(t));
      if (u.protocol === 'http:' || u.protocol === 'https:') return u.href;
    } catch {
      /* noop */
    }
  }
  return '';
}
