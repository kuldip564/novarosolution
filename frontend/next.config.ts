import type { NextConfig } from "next";

const apiOrigin = process.env.API_PROXY_TARGET || "http://127.0.0.1:5001";

/**
 * Crawlers that get <title>, description and canonical in the initial <head> (blocking metadata)
 * instead of streamed metadata. Next.js's default list plus Googlebot, AI answer engines and SEO tools,
 * so every crawler sees the canonical URL without running JavaScript.
 */
const htmlLimitedBots =
  /Googlebot|[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|msnbot|applebot|facebookexternalhit|facebookcatalog|Facebot|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|TelegramBot|Pinterest|SkypeUriPreview|Yeti|Naverbot|googleweblight|GPTBot|OAI-SearchBot|ChatGPT-User|PerplexityBot|Perplexity-User|ClaudeBot|Claude-User|Claude-SearchBot|anthropic-ai|Amazonbot|CCBot|Bytespider|cohere-ai|YouBot|AhrefsBot|SemrushBot|Screaming Frog|MJ12bot|DotBot/i;

const nextConfig: NextConfig = {
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
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 750, 828, 1080, 1200, 1400],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    qualities: [75, 95],
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
