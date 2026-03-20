export default function RootLoading() {
  return (
    <div className="loading-center" role="status" aria-live="polite" aria-label="Loading">
      <div className="loading-orb">
        <span className="loading-ring loading-ring-a" />
        <span className="loading-ring loading-ring-b" />
        <span className="loading-core" />
      </div>
      <p className="loading-text">Loading experience...</p>
    </div>
  );
}
