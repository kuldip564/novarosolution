'use client';

import Image from 'next/image';
import { imageSrcNeedsUnoptimized } from '@/lib/imageUtils';

type SafeImageFillProps = {
  src: string;
  alt: string;
  fill: true;
  sizes: string;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
};

type SafeImageFixedProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
};

export type SafeImageProps = SafeImageFillProps | SafeImageFixedProps;

/**
 * next/image with automatic WebP/AVIF when optimized; data/blob URLs use unoptimized.
 */
export default function SafeImage(props: SafeImageProps) {
  const { src, alt, className, priority, loading } = props;
  const unoptimized = imageSrcNeedsUnoptimized(src);

  if ('fill' in props && props.fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={props.sizes}
        className={className}
        unoptimized={unoptimized}
        priority={priority}
        loading={loading}
      />
    );
  }

  const { width, height } = props as SafeImageFixedProps;
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized={unoptimized}
      priority={priority}
      loading={loading}
    />
  );
}
