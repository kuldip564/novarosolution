import type { ReactNode } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { PageHead } from "@/components/sections/PageHead";

type LegalDocumentProps = {
  title: string;
  description: string;
  lastUpdated: string;
  breadcrumbs: BreadcrumbItem[];
  children: ReactNode;
};

export function LegalDocument({
  title,
  description,
  lastUpdated,
  breadcrumbs,
  children,
}: LegalDocumentProps) {
  return (
    <main className="page-cinema legal-cinema">
      <PageHead
        eyebrow="Legal"
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
      />
      <section className="sec legal-sec">
        <div className="wrap legal-wrap">
          <p className="legal-updated">Last updated: {lastUpdated}</p>
          <article className="legal-prose">{children}</article>
        </div>
      </section>
    </main>
  );
}
