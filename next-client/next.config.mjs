import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV !== 'production';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
let apiOrigin = '';
try {
  apiOrigin = new URL(apiUrl).origin;
} catch {
  apiOrigin = '';
}
const connectSources = [
  "'self'",
  ...(apiOrigin ? [apiOrigin] : []),
  ...(isDev ? ['http://localhost:5001'] : []),
  'https://www.google-analytics.com',
  'https://region1.google-analytics.com',
  'https://stats.g.doubleclick.net',
  'https://pagead2.googlesyndication.com',
  'https://googleads.g.doubleclick.net',
  'https://ep1.adtrafficquality.google',
  'https://*.adtrafficquality.google',
  'https://*.api.sanity.io'
];
const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.googletagservices.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  `connect-src ${connectSources.join(' ')}`,
  "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.googlesyndication.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests'
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: isDev ? '.next-dev' : '.next',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' }
    ]
  },
  compress: true,
  poweredByHeader: false,
  outputFileTracingRoot: path.join(__dirname, '..'),
  experimental: {
    optimizePackageImports: ['react-icons', 'framer-motion']
  },
  async headers() {
    return [
      {
        source: '/ads.txt',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=86400' }
        ]
      },
      {
        source: '/:path*.ico',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
      },
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: cspHeader },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ]
      }
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Avoid intermittent ENOENT pack cache rename warnings in local dev.
      config.cache = false;
    }
    return config;
  }
};

export default nextConfig;
