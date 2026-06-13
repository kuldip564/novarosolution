import { v2 as cloudinary } from "cloudinary";
import { config, isCloudinaryConfigured } from "../config/env.js";
import type { CloudinaryAsset } from "../types/media.js";

export const CLOUDINARY_UPLOAD_FOLDER = "novaro";

export function configureCloudinary(): void {
  if (!isCloudinaryConfigured()) return;
  cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

configureCloudinary();

export function getSignedUploadParams(folder = CLOUDINARY_UPLOAD_FOLDER) {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const params = {
    timestamp,
    folder,
    upload_preset: undefined as string | undefined,
  };

  const signature = cloudinary.utils.api_sign_request(
    params,
    config.CLOUDINARY_API_SECRET!,
  );

  return {
    timestamp,
    signature,
    folder,
    cloudName: config.CLOUDINARY_CLOUD_NAME!,
    apiKey: config.CLOUDINARY_API_KEY!,
  };
}

export async function uploadImageBuffer(
  buffer: Buffer,
  mimetype: string,
  folder = CLOUDINARY_UPLOAD_FOLDER,
): Promise<CloudinaryAsset> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured");
  }

  const dataUri = `data:${mimetype};base64,${buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
  });

  return {
    secureUrl: result.secure_url,
    publicId: result.public_id,
  };
}

export async function deleteCloudinaryAsset(publicId: string): Promise<void> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured");
  }
  if (publicId.startsWith("local/")) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

export function buildTransformationUrl(
  publicId: string,
  transforms: string[] = ["f_auto", "q_auto"],
): string {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured");
  }
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [{ raw_transformation: transforms.join(",") }],
  });
}
