import React from 'react';

const LoadingState = ({ label = 'Loading content...', className = '', screen = false }) => {
  if (screen) {
    return (
      <div className={`loading-screen fixed inset-0 z-70 flex items-center justify-center px-4 ${className}`}>
        <div className="loading-screen-shell w-full max-w-xl rounded-3xl p-6 md:p-8">
          <div className="loading-3d-scene" aria-hidden>
            <div className="loading-3d-cube">
              <span className="loading-3d-face loading-3d-face-front" />
              <span className="loading-3d-face loading-3d-face-back" />
              <span className="loading-3d-face loading-3d-face-left" />
              <span className="loading-3d-face loading-3d-face-right" />
              <span className="loading-3d-face loading-3d-face-top" />
              <span className="loading-3d-face loading-3d-face-bottom" />
            </div>
            <div className="loading-3d-ring" />
            <div className="loading-3d-prism" />
          </div>

          <div className="mt-5 text-center">
            <p className="loading-screen-kicker">NovaRo Solution</p>
            <p className="loading-screen-title mt-2">Building Your Premium Experience</p>
            <p className="loading-screen-label mt-2">{label}</p>
          </div>

          <div className="loading-progress mt-6">
            <span className="loading-progress-bar" />
          </div>

          <div className="loading-states mt-4">
            <span>Design</span>
            <span>Develop</span>
            <span>Deliver</span>
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

