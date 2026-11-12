import type { NextConfig } from "next";

const apiOrigin =
  process.env.API_PROXY_TARGET ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5001";

/**
 * Crawlers that get <title>, description and canonical in the initial <head> (blocking metadata)
 * instead of streamed metadata. Next.js's default list plus Googlebot, AI answer engines and SEO tools,
 * so every crawler sees the canonical URL without running JavaScript.
 */
const htmlLimitedBots =
  /Googlebot|[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|msnbot|applebot|facebookexternalhit|facebookcatalog|Facebot|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|TelegramBot|Pinterest|SkypeUriPreview|Yeti|Naverbot|googleweblight|GPTBot|OAI-SearchBot|ChatGPT-User|PerplexityBot|Perplexity-User|ClaudeBot|Claude-User|Claude-SearchBot|anthropic-ai|Amazonbot|CCBot|Bytespider|cohere-ai|YouBot|AhrefsBot|SemrushBot|Screaming Frog|MJ12bot|DotBot/i;

/** Origin of the API when the browser calls it directly (unset = same-origin via the /api proxy). */
function originOf(url: string | undefined): string {
  try {
    return url ? new URL(url).origin : "";
  } catch {
    return "";
  }
}
const browserApiOrigin = originOf(process.env.NEXT_PUBLIC_API_URL);

/**
 * Enforced now: protections that cannot break the site (no framing = no clickjacking, no
 * <base> or plugin injection, forms only post to this site).
 */
const enforcedCsp = ["frame-ancestors 'none'", "base-uri 'self'", "object-src 'none'", "form-action 'self'"].join(
  "; ",
);

/**
 * Full policy in report-only mode: browsers log anything it would block (DevTools console)
 * without blocking it. Once production shows no violations, move it to the enforced header.
 * 'unsafe-inline' is needed for Next.js's inline bootstrap scripts and the GA loader.
 * The googlesyndication / doubleclick / adtrafficquality hosts are Google AdSense (script, ad frames, pixels).
 */
const adsenseHosts =
  "https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google https://adservice.google.com https://www.googletagservices.com https://fundingchoicesmessages.google.com";
const reportOnlyCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://analytics.ahrefs.com ${adsenseHosts}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://res.cloudinary.com https://*.google-analytics.com https://*.googletagmanager.com https://*.g.doubleclick.net https://www.google.com https://www.google.co.in https://*.gstatic.com ${adsenseHosts}`,
  "font-src 'self' data:",
  `connect-src 'self' ${browserApiOrigin} https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.googletagmanager.com https://analytics.ahrefs.com https://*.g.doubleclick.net https://www.google.com https://api.cloudinary.com https://csi.gstatic.com ${adsenseHosts}`
    .replace(/\s+/g, " ")
    .trim(),
  `frame-src https://maps.google.com https://www.google.com ${adsenseHosts}`,
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Content-Security-Policy", value: enforcedCsp },
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Content-Security-Policy-Report-Only", value: reportOnlyCsp }]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  htmlLimitedBots,
  turbopack: {
    root: import.meta.dirname,
  },
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "three",
      "@tiptap/react",
      "@tiptap/starter-kit",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 750, 828, 1080, 1200, 1400],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    qualities: [75, 90, 95],
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5001",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
        pathname: "/uploads/**",
      },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Same site on Render's default domain — keep it out of search results (canonical is www).
        source: "/:path*",
        has: [{ type: "host", value: "(?<host>.+\\.onrender\\.com)" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/brand/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "novarosolution.com" }],
        destination: "https://www.novarosolution.com/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${apiOrigin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
