import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config, getCorsOrigins, getTrustProxy } from "./config/env.js";
import { errorHandler, HttpError } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFound.js";
import adminRouter from "./routes/admin/index.js";
import contactRouter from "./routes/contact.js";
import healthRouter from "./routes/health.js";
import publicContentRouter from "./routes/public/content.js";
import publicBlogRouter from "./routes/public/blog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "..", "uploads");

export function createApp() {
  const app = express();
  const allowedOrigins = getCorsOrigins();

  // Render (and most hosts) put one proxy in front of the app. Without this, every visitor
  // shares the proxy's IP, so one busy minute would rate-limit everyone.
  app.set("trust proxy", getTrustProxy());
  app.disable("x-powered-by");

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        if (
          config.NODE_ENV === "development" &&
          /^https?:\/\/localhost:\d+$/.test(origin)
        ) {
          callback(null, true);
          return;
        }
        callback(new HttpError(403, "Origin not allowed"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    }),
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "512kb" }));

  // Request log: compact in production, without health checks (Render pings them constantly).
  app.use(
    morgan(config.NODE_ENV === "production" ? ":method :url :status :res[content-length] - :response-time ms" : "dev", {
      skip: (req) => req.originalUrl.startsWith("/api/health"),
    }),
  );

  // Uploaded images (local fallback when Cloudinary is off). SVG can carry script, so every file is
  // served sandboxed: no scripts, no plugins, no framing, and never sniffed as another type.
  app.use(
    "/uploads",
    express.static(uploadsDir, {
      dotfiles: "deny",
      index: false,
      setHeaders(res) {
        res.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      },
    }),
  );

  // Page content is mostly read by the website's own server (cached for 30 s), so reads get a
  // generous limit; writes and admin calls keep the stricter one.
  const readLimiter = rateLimit({
    windowMs: 60_000,
    limit: 600,
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, error: "Too many requests, please try again later." },
  });

  const apiLimiter = rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === "GET" && req.path.startsWith("/content"),
    message: { ok: false, error: "Too many requests, please try again later." },
  });

  const contactLimiter = rateLimit({
    windowMs: 60_000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      ok: false,
      error: "Too many contact requests, please try again later.",
    },
  });

  const apiRouter = express.Router();
  apiRouter.use("/health", healthRouter);
  apiRouter.use(apiLimiter);
  apiRouter.use("/content", (req, res, next) => (req.method === "GET" ? readLimiter(req, res, next) : next()));
  apiRouter.use("/contact", contactLimiter, contactRouter);
  apiRouter.use("/content", publicContentRouter);
  apiRouter.use("/content/blog", publicBlogRouter);
  apiRouter.use("/admin", adminRouter);

  app.use("/api", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
