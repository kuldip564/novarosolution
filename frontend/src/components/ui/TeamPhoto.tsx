"use client";

import Image from "next/image";
import { useState } from "react";

/** Premium display quality — high-res sources, Next.js serves WebP/AVIF at quality 95 */
export const TEAM_PHOTO_QUALITY = 95;

type TeamPhotoProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  variant?: "card" | "modal";
};

const dimensions = {
  card: {
    width: 600,
    height: 800,
    sizes: "(max-width: 640px) 46vw, (max-width: 1024px) 28vw, 360px",
  },
  modal: {
    width: 720,
    height: 960,
    sizes: "(max-width: 720px) 85vw, 420px",
  },
} as const;

export function TeamPhoto({
  src,
  alt,
  className = "",
  priority = false,
  variant = "card",
}: TeamPhotoProps) {
  const [loaded, setLoaded] = useState(false);
  const dim = dimensions[variant];

  return (
    <span
      className={`team-photo team-photo--${variant} ${loaded ? "team-photo--loaded" : ""} ${className}`.trim()}
    >
      {!loaded && <span className="team-photo__shimmer" aria-hidden />}
      <span className="team-photo__sheen" aria-hidden />
      <Image
        src={src}
        alt={alt}
        width={dim.width}
        height={dim.height}
        sizes={dim.sizes}
        quality={TEAM_PHOTO_QUALITY}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="team-photo__img"
        onLoad={() => setLoaded(true)}
      />
    </span>
  );
}
