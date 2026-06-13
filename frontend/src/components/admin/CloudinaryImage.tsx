"use client";

import Image from "next/image";
import { cloudinaryTransformUrl, parseCloudinaryAsset, type CloudinaryAsset } from "@/lib/media";

type CloudinaryImageProps = {
  asset: CloudinaryAsset | string | null | undefined;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  transformWidth?: number;
};

export function CloudinaryImage({
  asset,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes,
  transformWidth,
}: CloudinaryImageProps) {
  const parsed = parseCloudinaryAsset(asset);
  if (!parsed) return null;

  const src =
    cloudinaryTransformUrl(parsed, {
      width: transformWidth ?? width,
      crop: "fill",
    }) ?? parsed.secureUrl;

  const isLocal = src.startsWith("/") && !src.startsWith("//");

  if (isLocal) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      unoptimized={src.includes("cloudinary.com")}
    />
  );
}
