import { z } from "zod";

export type CloudinaryAsset = {
  secureUrl: string;
  publicId: string | null;
};

export const cloudinaryAssetSchema = z
  .object({
    secureUrl: z.string().min(1),
    publicId: z.string().nullable(),
  })
  .nullable()
  .optional();

export const cloudinaryAssetArraySchema = z.array(
  z.object({
    secureUrl: z.string().min(1),
    publicId: z.string().nullable(),
  }),
);

export const cloudinaryAssetRequiredSchema = z.object({
  secureUrl: z.string().min(1),
  publicId: z.string().nullable(),
});

export function parseCloudinaryAsset(value: unknown): CloudinaryAsset | null {
  if (!value) return null;
  if (typeof value === "string") {
    return { secureUrl: value, publicId: null };
  }
  const parsed = cloudinaryAssetRequiredSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function toCloudinaryAsset(
  url: string | null | undefined,
  publicId: string | null = null,
): CloudinaryAsset | null {
  if (!url) return null;
  return { secureUrl: url, publicId };
}

export function resolveAssetUrl(value: unknown): string | undefined {
  const asset = parseCloudinaryAsset(value);
  return asset?.secureUrl;
}

/** Pass-through for optional Cloudinary composite fields (MongoDB accepts plain null). */
export function toPrismaJsonAsset(
  asset: CloudinaryAsset | null | undefined,
): CloudinaryAsset | null | undefined {
  return asset;
}

export function toPrismaJsonAssetArray(
  assets: CloudinaryAsset[],
): CloudinaryAsset[] {
  return assets;
}
