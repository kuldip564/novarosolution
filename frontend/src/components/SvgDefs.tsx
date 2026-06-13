export function SvgDefs() {
  return (
    <>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <linearGradient id="gIntro" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#54CDF6" />
            <stop offset="55%" stopColor="#2F7BFF" />
            <stop offset="100%" stopColor="#1E54D6" />
          </linearGradient>
          <linearGradient id="gN" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor="#6FD8FA" />
            <stop offset="50%" stopColor="#2F7BFF" />
            <stop offset="100%" stopColor="#1741C2" />
          </linearGradient>
        </defs>
      </svg>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <symbol id="nshape" viewBox="0 0 100 100">
          <path d="M16 14 L34 14 L34 86 L16 86 Z" />
          <path d="M34 14 L52 14 L84 70 L84 86 L66 86 L34 30 Z" />
          <path d="M66 14 L84 14 L84 86 L66 86 Z" />
        </symbol>
      </svg>
    </>
  );
}
