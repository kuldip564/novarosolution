import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { Router } from "express";
import { z } from "zod";
import { isCloudinaryConfigured } from "../../config/env.js";
import {
  CLOUDINARY_UPLOAD_FOLDER,
  deleteCloudinaryAsset,
  getSignedUploadParams,
  uploadImageBuffer,
} from "../../lib/cloudinary.js";
import { imageUploadMemory, uploadsDir } from "../../middleware/upload.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const router = Router();

const signSchema = z.object({
  folder: z.string().trim().min(1).max(120).optional(),
});

const deleteSchema = z.object({
  publicId: z.string().min(1),
});

router.get("/config", requireAuth, (_req, res) => {
  res.json({
    ok: true,
    data: {
      cloudinaryEnabled: isCloudinaryConfigured(),
      folder: CLOUDINARY_UPLOAD_FOLDER,
      cloudName: isCloudinaryConfigured()
        ? process.env.CLOUDINARY_CLOUD_NAME
        : null,
    },
  });
});

router.post("/sign", requireAuth, (req, res) => {
  if (!isCloudinaryConfigured()) {
    res.status(503).json({
      ok: false,
      error:
        "Cloudinary is not configured. Set CLOUDINARY_* env vars or use server upload fallback.",
    });
    return;
  }

  const parsed = signSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: "Invalid sign request" });
    return;
  }

  try {
    const data = getSignedUploadParams(parsed.data.folder ?? CLOUDINARY_UPLOAD_FOLDER);
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Failed to sign upload",
    });
  }
});

router.post("/", requireAuth, imageUploadMemory.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ ok: false, error: "No file uploaded" });
      return;
    }

    if (isCloudinaryConfigured()) {
      const asset = await uploadImageBuffer(req.file.buffer, req.file.mimetype);
      res.json({ ok: true, data: asset });
      return;
    }

    const ext = path.extname(req.file.originalname).toLowerCase() || ".jpg";
    const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(ext)
      ? ext
      : ".jpg";
    const filename = `${Date.now()}-${crypto.randomUUID()}${safeExt}`;
    await fs.writeFile(path.join(uploadsDir, filename), req.file.buffer);

    res.json({
      ok: true,
      data: {
        secureUrl: `/uploads/${filename}`,
        publicId: `local/${filename}`,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/", requireAuth, async (req, res, next) => {
  try {
    const parsed = deleteSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ ok: false, error: "publicId is required" });
      return;
    }

    const { publicId } = parsed.data;

    if (publicId.startsWith("local/")) {
      const filename = publicId.replace(/^local\//, "");
      try {
        await fs.unlink(path.join(uploadsDir, filename));
      } catch {
        // file may already be gone
      }
      res.json({ ok: true, message: "Local asset deleted." });
      return;
    }

    if (!isCloudinaryConfigured()) {
      res.status(503).json({ ok: false, error: "Cloudinary is not configured" });
      return;
    }

    await deleteCloudinaryAsset(publicId);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;
