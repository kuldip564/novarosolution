export type CloudinaryAsset = {
  secureUrl: string;
  publicId: string | null;
};

export function parseCloudinaryAsset(value: unknown): CloudinaryAsset | null {
  if (!value) return null;
  if (typeof value === "string") {
    return { secureUrl: value, publicId: null };
  }
  if (
    typeof value === "object" &&
    value !== null &&
    "secureUrl" in value &&
    typeof (value as CloudinaryAsset).secureUrl === "string"
  ) {
    const asset = value as CloudinaryAsset;
    return {
      secureUrl: asset.secureUrl,
      publicId: asset.publicId ?? null,
    };
  }
  return null;
}

export function resolveAssetUrl(value: unknown): string | undefined {
  return parseCloudinaryAsset(value)?.secureUrl;
}

type TransformOptions = {
  width?: number;
  height?: number;
  crop?: "fill" | "scale" | "limit";
  quality?: string;
  format?: string;
};

export function cloudinaryTransformUrl(
  asset: CloudinaryAsset | string | null | undefined,
  options: TransformOptions = {},
): string | undefined {
  const parsed = typeof asset === "string" ? parseCloudinaryAsset(asset) : asset;
  if (!parsed?.secureUrl) return undefined;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!parsed.publicId || !cloudName || parsed.publicId.startsWith("local/")) {
    return parsed.secureUrl;
  }

  const transforms = [
    options.format ?? "f_auto",
    options.quality ?? "q_auto",
  ];
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(",")}/${parsed.publicId}`;
}
