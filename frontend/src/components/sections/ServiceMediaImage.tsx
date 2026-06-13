import Image from "next/image";
import { CloudinaryImage } from "@/components/admin/CloudinaryImage";
import type { CloudinaryAsset } from "@/lib/media";
import { cloudinaryTransformUrl, parseCloudinaryAsset } from "@/lib/media";

type ServiceMediaImageProps = {
  asset?: CloudinaryAsset | null;
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

export function ServiceMediaImage({
  asset,
  src,
  alt,
  width = 2048,
  height = 1529,
  priority = false,
}: ServiceMediaImageProps) {
  const parsed = asset ? parseCloudinaryAsset(asset) : null;

  return (
    <div className="srow-media-slot">
      <div className="srow-media-glow" aria-hidden="true" />
      <div className="srow-media-frame">
        {parsed ? (
          <CloudinaryImage
            asset={parsed}
            alt={alt}
            width={width}
            height={height}
            className="srow-media-img"
            transformWidth={1200}
            priority={priority}
            sizes="(max-width: 600px) 100vw, (max-width: 980px) 92vw, min(560px, 46vw)"
          />
        ) : src ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="(max-width: 600px) 100vw, (max-width: 980px) 92vw, min(560px, 46vw)"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            className="srow-media-img"
            style={{ width: "100%", height: "auto" }}
          />
        ) : null}
      </div>
    </div>
  );
}

export function serviceCardImageUrl(asset: CloudinaryAsset | null | undefined): string | undefined {
  if (!asset) return undefined;
  return cloudinaryTransformUrl(asset, { width: 640, crop: "fill" }) ?? asset.secureUrl;
}
