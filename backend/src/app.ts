import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config, getCorsOrigins } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
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
        callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    }),
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "512kb" }));

  if (config.NODE_ENV !== "production") {
    app.use(morgan("dev"));
  }

  app.use("/uploads", express.static(uploadsDir));

  const apiLimiter = rateLimit({
    windowMs: 60_000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, error: "Too many requests, please try again later." },
  });

  const contactLimiter = rateLimit({
    windowMs: 60_000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      ok: false,
      error: "Too many contact requests, please try again later.",
    },
  });

  const apiRouter = express.Router();
  apiRouter.use(apiLimiter);
  apiRouter.use("/health", healthRouter);
  apiRouter.use("/contact", contactLimiter, contactRouter);
  apiRouter.use("/content", publicContentRouter);
  apiRouter.use("/content/blog", publicBlogRouter);
  apiRouter.use("/admin", adminRouter);

  app.use("/api", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
