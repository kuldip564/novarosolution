"use client";

import { cloudinaryTransformUrl, parseCloudinaryAsset, type CloudinaryAsset } from "@/lib/media";

type AdminAssetThumbProps = {
  asset: unknown;
  alt?: string;
  size?: number;
};

export function AdminAssetThumb({ asset, alt = "", size = 44 }: AdminAssetThumbProps) {
  const parsed = parseCloudinaryAsset(asset);
  if (!parsed?.secureUrl) {
    return <span className="admin-thumb-empty">—</span>;
  }

  const src =
    cloudinaryTransformUrl(parsed, { width: size * 2, crop: "fill" }) ?? parsed.secureUrl;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="admin-thumb"
      width={size}
      height={size}
    />
  );
}

export function getRowAsset(row: Record<string, unknown>, keys: string[]): CloudinaryAsset | null {
  for (const key of keys) {
    const asset = parseCloudinaryAsset(row[key]);
    if (asset?.secureUrl) return asset;
  }
  return null;
}
