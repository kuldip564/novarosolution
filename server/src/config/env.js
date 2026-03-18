export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 5001;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
export const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/novarosolution';
export const MONGODB_DNS_SERVERS = process.env.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1';
export const TRUST_PROXY = process.env.TRUST_PROXY || '1';

export const DEFAULT_ADMIN_ENABLED =
  String(process.env.DEFAULT_ADMIN_ENABLED ?? (NODE_ENV === 'production' ? 'false' : 'true')) === 'true';
export const DEFAULT_ADMIN_NAME = process.env.DEFAULT_ADMIN_NAME || '';
export const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || '';
export const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || '';

function isWeakJwtSecret(value) {
  const text = String(value || '');
  if (!text || text.length < 24) return true;
  return text.toLowerCase().includes('change');
}

if (NODE_ENV === 'production' && isWeakJwtSecret(JWT_SECRET)) {
  throw new Error('JWT_SECRET must be set to a strong value in production.');
}

