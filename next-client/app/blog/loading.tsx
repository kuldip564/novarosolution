import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function BlogLoading() {
  return (
    <SkeletonTheme baseColor="#1e293b" highlightColor="#334155">
      <section>
        <Skeleton height={30} width={120} />
        <div className="post-list mt-5">
          {[1, 2, 3, 4].map((item) => (
            <article key={item} className="card">
              <Skeleton height={24} width="72%" />
              <div className="mt-3">
                <Skeleton count={2} height={14} style={{ marginBottom: 8 }} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </SkeletonTheme>
  );
}
