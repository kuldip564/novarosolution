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

  const src =
    cloudinaryTransformUrl(parsed, {
      width: transformWidth ?? width,
      crop: "fill",
    }) ?? parsed.secureUrl;

  const isLocal = src.startsWith("/") && !src.startsWith("//");
  const isCloudinary = src.includes("cloudinary.com");

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      fetchPriority={fetchPriority}
      sizes={sizes}
      unoptimized={isCloudinary}
      {...(isLocal ? {} : {})}
    />
  );
}
