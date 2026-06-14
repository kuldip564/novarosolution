import { site } from "@/lib/site-data";

type NMarkProps = {
  className?: string;
  size?: number;
};

export function NMark({ className = "", size = 34 }: NMarkProps) {
  // Portrait logo — height drives size; width follows aspect ratio.
  const height = size;
  const width = Math.round(size * 0.77);

  return (
    // Plain img keeps PNG transparency; Next/Image can add a white matte.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={site.brandIcon}
      alt=""
      width={width}
      height={height}
      className={`nmark ${className}`.trim()}
      aria-hidden
      decoding="async"
      draggable={false}
      fetchPriority={size >= 200 ? "high" : "auto"}
    />
  );
}
