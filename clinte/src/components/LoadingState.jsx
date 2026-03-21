import React from 'react';

const LoadingState = ({ label = 'Loading content...', className = '', screen = false }) => {
  if (screen) {
    return (
      <div className={`loading-screen fixed inset-0 z-70 flex items-center justify-center px-4 ${className}`}>
        <div className="loading-screen-shell w-full max-w-sm rounded-3xl p-6 md:p-7">
          <div className="loading-center" aria-hidden>
            <div className="loading-orb">
              <span className="loading-ring loading-ring-a" />
              <span className="loading-ring loading-ring-b" />
              <span className="loading-core" />
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="loading-screen-kicker">NovaRo Solution</p>
            <p className="loading-screen-title mt-2">Preparing Experience</p>
            <p className="loading-screen-label mt-2">{label}</p>
          </div>

          <div className="loading-progress mt-5">
            <span className="loading-progress-bar" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`loading-state inline-flex items-center gap-3 rounded-2xl px-4 py-3 ${className}`}>
      <div className="loading-inline-core">
        <span className="loading-inline-ring" />
        <span className="loading-inline-dot" />
      </div>
      <span className="text-sm font-medium text-slate-400">{label}</span>
    </div>
  );
};

export default LoadingState;

