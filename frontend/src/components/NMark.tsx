type NMarkProps = {
  className?: string;
  size?: number;
};

export function NMark({ className = "", size = 34 }: NMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <use href="#nshape" fill="url(#gN)" />
    </svg>
  );
}
