type CinemaBigwordProps = {
  title?: string;
  accent: string;
  className?: string;
  /** Keyword-rich page heading. When set, the big word becomes decoration and this is the H1. */
  heading?: string;
};

/** Outline + gradient headline — matches Blog / Work PageHead bigword style. */
export function CinemaBigword({
  title = "NOVARO",
  accent,
  className = "",
  heading,
}: CinemaBigwordProps) {
  const word = (
    <>
      <span className="o">{title}</span>
      <br />
      <span className="g">{accent}</span>
    </>
  );

  if (!heading) {
    return <h1 className={`bigword cinema-bigword ${className}`.trim()}>{word}</h1>;
  }

  return (
    <>
      <div className={`bigword cinema-bigword ${className}`.trim()} aria-hidden="true">
        {word}
      </div>
      <h1 className="page-h1 page-h1--center">{heading}</h1>
    </>
  );
}
