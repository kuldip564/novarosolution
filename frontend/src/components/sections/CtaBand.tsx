import type { ReactNode } from "react";
import { Reveal } from "@/components/anim/Reveal";
import { Button } from "@/components/Button";

type CtaBandProps = {
  eyebrow?: string;
  title: ReactNode;
  description: string;
  buttonLabel?: string;
  buttonHref?: string;
};

export function CtaBand({
  eyebrow = "Let's talk",
  title,
  description,
  buttonLabel = "Start a project",
  buttonHref = "/contact",
}: CtaBandProps) {
  return (
    <section className="sec">
      <div className="wrap">
        <Reveal>
          <div className="cta-band">
            <div className="mesh" />
            <div className="grid2" />
            <div className="inner">
              <span className="eyebrow center cta-eyebrow">{eyebrow}</span>
              <h2>{title}</h2>
              <p>{description}</p>
              <Button href={buttonHref}>{buttonLabel}</Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
