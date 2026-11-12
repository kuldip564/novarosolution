const ADSENSE_CLIENT = "ca-pub-1997736983474353";

/**
 * Google AdSense loader, exactly as AdSense issues it. Rendered on public pages only (never the
 * admin panel). React moves an async script into <head>, where AdSense's site check looks for it.
 */
export function AdSenseScript() {
  if (process.env.NODE_ENV !== "production") return null;
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
