type SkeletonProps = {
  className?: string;
  width?: string | number;
  height?: string | number;
};

export function Skeleton({
  className = "",
  width,
  height,
}: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`.trim()}
      aria-hidden="true"
      style={{ width, height }}
    />
  );
}

export function PageSkeleton() {
  return (
    <div className="page-skeleton" aria-busy="true" aria-label="Loading page">
      <div className="wrap">
        <Skeleton className="page-skeleton-eyebrow" height={14} width={120} />
        <Skeleton className="page-skeleton-title" height={48} width="min(520px, 80%)" />
        <Skeleton className="page-skeleton-lede" height={18} width="min(640px, 92%)" />
        <div className="page-skeleton-grid">
          <Skeleton height={220} />
          <Skeleton height={220} />
          <Skeleton height={220} />
        </div>
      </div>
    </div>
  );
}
