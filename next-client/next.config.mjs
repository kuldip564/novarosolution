import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV !== 'production';

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
