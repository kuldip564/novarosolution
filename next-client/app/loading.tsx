import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function RootLoading() {
  return (
    <SkeletonTheme baseColor="#1e293b" highlightColor="#334155">
      <div className="card">
        <Skeleton height={28} width="38%" borderRadius={8} />
        <div className="mt-3">
          <Skeleton count={2} height={14} style={{ marginBottom: 8 }} />
        </div>
      </div>
    </SkeletonTheme>
  );
}
