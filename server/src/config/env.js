export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 5001;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
export const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/novarosolution';
export const MONGODB_DNS_SERVERS = process.env.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1';
export const TRUST_PROXY = process.env.TRUST_PROXY || '1';
export const REDIS_URL = process.env.REDIS_URL || '';
export const CACHE_TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS || 60);
export const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
export const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 120);
export const SLOW_REQUEST_THRESHOLD_MS = Number(process.env.SLOW_REQUEST_THRESHOLD_MS || 800);
export const ENABLE_CLUSTER = String(process.env.ENABLE_CLUSTER || 'false') === 'true';
export const CLUSTER_WORKERS = Number(process.env.CLUSTER_WORKERS || 0);

export const DEFAULT_ADMIN_ENABLED =
  String(process.env.DEFAULT_ADMIN_ENABLED ?? (NODE_ENV === 'production' ? 'false' : 'true')) === 'true';
export const DEFAULT_ADMIN_NAME = process.env.DEFAULT_ADMIN_NAME || '';
export const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || '';
export const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || '';
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
export const CLOUDINARY_URL = process.env.CLOUDINARY_URL || '';

function isWeakJwtSecret(value) {
  const text = String(value || '');
  if (!text || text.length < 24) return true;
  return text.toLowerCase().includes('change');
}

if (NODE_ENV === 'production' && isWeakJwtSecret(JWT_SECRET)) {
  throw new Error('JWT_SECRET must be set to a strong value in production.');
}

if (NODE_ENV === 'production') {
  if (!MONGODB_URI || MONGODB_URI.includes('127.0.0.1') || MONGODB_URI.includes('localhost')) {
    throw new Error('MONGODB_URI must point to a production database in production.');
  }
  if (!CORS_ORIGIN || CORS_ORIGIN === '*') {
    throw new Error('CORS_ORIGIN must be explicitly configured in production.');
  }
}

const hasAnyCloudinaryValue = Boolean(
  CLOUDINARY_URL || CLOUDINARY_CLOUD_NAME || CLOUDINARY_API_KEY || CLOUDINARY_API_SECRET
);
const hasCompleteCloudinaryConfig = Boolean(
  CLOUDINARY_URL || (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET)
);

if (NODE_ENV === 'production' && hasAnyCloudinaryValue && !hasCompleteCloudinaryConfig) {
  throw new Error(
    'Cloudinary config is incomplete. Provide CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET.'
  );
}

