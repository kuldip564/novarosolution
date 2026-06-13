import type { ReactNode } from "react";
import { Parallax } from "@/components/anim/Parallax";
import { Reveal } from "@/components/anim/Reveal";
import { SplitText } from "@/components/anim/SplitText";

type PageHeadProps = {
  eyebrow: string;
  title: string;
  description?: string;
  splitTitle?: boolean;
  children?: ReactNode;
};

export function PageHead({
  eyebrow,
  title,
  description,
  splitTitle = false,
  children,
}: PageHeadProps) {
  return (
    <section className="pagehead">
      <Parallax speed={0.05} className="grid" />
      <Parallax speed={0.12}>
        <div className="glow g1" />
      </Parallax>
      <div className="wrap inner">
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        {splitTitle ? (
          <SplitText text={title} className="page-title" />
        ) : (
          <Reveal delay={0.1}>
            <h1>{title}</h1>
          </Reveal>
        )}
        {description && (
          <Reveal delay={0.2}>
            <p>{description}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
