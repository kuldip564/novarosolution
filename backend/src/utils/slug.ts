/** SEO-friendly slug segment length (path segment only, e.g. `/blog/my-slug`). */
export const SEO_MAX_SLUG_LENGTH = 18;

export function slugifyText(
  input: string,
  maxLength: number = SEO_MAX_SLUG_LENGTH,
): string {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug) return "";
  if (slug.length <= maxLength) return slug;

  const parts = slug.split("-").filter(Boolean);
  let result = "";
  for (const part of parts) {
    const next = result ? `${result}-${part}` : part;
    if (next.length > maxLength) break;
    result = next;
  }

  if (result) return result;

  return slug.slice(0, maxLength).replace(/-$/, "");
}
