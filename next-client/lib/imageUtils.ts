/** URLs Next.js Image cannot optimize (served as-is; still benefits from lazy loading + dimensions). */
export function imageSrcNeedsUnoptimized(src: string): boolean {
  const s = String(src || '').trim();
  if (!s) return true;
  if (/^(data:|blob:)/i.test(s)) return true;
  return false;
}
