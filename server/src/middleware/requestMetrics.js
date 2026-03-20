import { NODE_ENV, SLOW_REQUEST_THRESHOLD_MS } from '../config/env.js';

export function requestMetrics(req, res, next) {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    if (elapsedMs >= SLOW_REQUEST_THRESHOLD_MS || NODE_ENV !== 'production') {
      console.info(
        `[http] ${req.method} ${req.originalUrl} ${res.statusCode} ${elapsedMs.toFixed(1)}ms`
      );
    }
  });
  next();
}

