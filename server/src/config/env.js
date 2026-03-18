export const PORT = process.env.PORT || 5001;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
export const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
export const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/novarosolution';
export const MONGODB_URI_FALLBACK =
  process.env.MONGODB_URI_FALLBACK || 'mongodb://127.0.0.1:27017/novarosolution';
export const MONGODB_DNS_SERVERS =
  process.env.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1';

