const AHREFS_KEY = "kPDT2Mh1QceaW3jLiouxfQ";

/** Ahrefs Web Analytics. Public pages only, and only in production. */
export function AhrefsScript() {
  if (process.env.NODE_ENV !== "production") return null;
  return (
    <script async src="https://analytics.ahrefs.com/analytics.js" data-key={AHREFS_KEY} />
  );
}
