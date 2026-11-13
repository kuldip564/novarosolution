import type { ReactNode } from "react";

/** Section header for /services and /about: eyebrow, a heading that reveals line by line, and an optional side lede. */
export function StudioSectionHead({
  eyebrow,
  title,
  id,
  lede,
  align = "left",
  action,
}: {
  eyebrow: string;
  /** Line breaks ("\n") become separately revealed lines. */
  title: string;
  id: string;
  lede?: string;
  align?: "left" | "split";
  action?: ReactNode;
}) {
  const lines = title.split("\n");
  return (
    <header className={`st-head st-head--${align}`}>
      <div>
        <p className="st-eyebrow">{eyebrow}</p>
        <h2 id={id} className="st-h2" data-st-reveal>
          {lines.map((line, index) => (
            <span key={`${index}-${line}`} className="st-mask">
              <span style={{ ["--line" as string]: index }}>{line}</span>
              {index < lines.length - 1 ? " " : null}
            </span>
          ))}
        </h2>
      </div>
      {lede || action ? (
        <div className="st-head__side" data-st-reveal style={{ ["--i" as string]: 1 }}>
          {lede ? <p className="st-lede">{lede}</p> : null}
          {action}
        </div>
      ) : null}
    </header>
  );
}
