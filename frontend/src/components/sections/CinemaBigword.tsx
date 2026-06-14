type CinemaBigwordProps = {
  title?: string;
  accent: string;
  className?: string;
};

/** Outline + gradient headline — matches Blog / Work PageHead bigword style. */
export function CinemaBigword({
  title = "NOVARO",
  accent,
  className = "",
}: CinemaBigwordProps) {
  return (
    <h1 className={`bigword cinema-bigword ${className}`.trim()}>
      <span className="o">{title}</span>
      <br />
      <span className="g">{accent}</span>
    </h1>
  );
}
