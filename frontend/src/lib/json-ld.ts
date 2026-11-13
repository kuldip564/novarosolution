const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

/**
 * Serialises structured data for a <script type="application/ld+json"> tag.
 *
 * JSON.stringify alone does not escape "<", so a CMS value containing "</script>" would end the
 * script tag and let the rest run as HTML. Escaping <, > and & (and the two JavaScript line
 * separators) keeps the JSON valid and the tag closed.
 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .split(LINE_SEPARATOR)
    .join("\\u2028")
    .split(PARAGRAPH_SEPARATOR)
    .join("\\u2029");
}
