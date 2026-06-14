import type { ReactNode } from "react";
import { Parallax } from "@/components/anim/Parallax";
import { Reveal } from "@/components/anim/Reveal";
import { SplitText } from "@/components/anim/SplitText";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";

type PageHeadProps = {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  description?: string;
  splitTitle?: boolean;
  variant?: "default" | "bigword";
  className?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: ReactNode;
};

export function PageHead({
  eyebrow,
  title,
  titleAccent,
  description,
  splitTitle = false,
  variant = "default",
  className = "",
  breadcrumbs,
  children,
}: PageHeadProps) {
  return (
    <section className={`pagehead ${className}`.trim()}>
      <Parallax speed={0.05} className="grid" />
      <Parallax speed={0.12}>
        <div className="glow g1" />
      </Parallax>
      <div className="wrap inner">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Reveal>
            <Breadcrumbs items={breadcrumbs} className="pagehead-crumbs" />
          </Reveal>
        )}
        <Reveal delay={breadcrumbs?.length ? 0.05 : 0}>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>

        {variant === "bigword" ? (
          <Reveal delay={0.1}>
            <div className="bigword">
              <span className="o">{title}</span>
              {titleAccent && (
                <>
                  <br />
                  <span className="g">{titleAccent}</span>
                </>
              )}
            </div>
          </Reveal>
        ) : splitTitle ? (
          <SplitText text={title} className="page-title" />
        ) : (
          <Reveal delay={0.1}>
            <h1>{title}</h1>
          </Reveal>
        )}

        {description && (
          <Reveal delay={0.2}>
            <p className="pagehead-lede">{description}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
