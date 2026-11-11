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
  fetchPriority?: "high" | "low" | "auto";
};

export function CloudinaryImage({
  asset,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  transformWidth,
  fetchPriority,
}: CloudinaryImageProps) {
  const parsed = parseCloudinaryAsset(asset);
  if (!parsed) return null;

  const fallbackWidth = transformWidth ?? width;
  const src = cloudinaryTransformUrl(parsed, { width: fallbackWidth, crop: "fill" }) ?? parsed.secureUrl;

  const isCloudinary = src.includes("cloudinary.com");
  // Cloudinary resizes on its own CDN: hand next/image a loader so the browser gets a real
  // srcset (one URL per width) instead of a single large file for every screen.
  const canTransform = isCloudinary && src !== parsed.secureUrl;
  const loader = canTransform
    ? ({ width: requested }: { width: number }) =>
        cloudinaryTransformUrl(parsed, { width: requested, crop: "fill" }) ?? src
    : undefined;
  // Bundled images (including the versioned /images/work/*.jpg?v=N files) go through the
  // Next image optimizer for AVIF/WebP and resizing. Anything else with a query string, or a
  // Cloudinary URL we can't transform, is served as-is.
  const isBundled = src.startsWith("/images/");
  const unoptimized = !loader && !isBundled && (isCloudinary || src.includes("?"));

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={fetchPriority ?? (priority ? "high" : undefined)}
      sizes={sizes}
      quality={90}
      loader={loader}
      unoptimized={unoptimized}
    />
  );
}
