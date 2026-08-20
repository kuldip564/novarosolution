"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ArrowUp } from "lucide-react";
import { useLenis } from "lenis/react";
import type { BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { PageHead } from "@/components/sections/PageHead";
import { scrollToTarget } from "@/lib/scroll-to";
import { subscribeScroll } from "@/lib/scroll-store";
import { slugifyText } from "@/lib/slug";

type LegalDocumentProps = {
  title: string;
  description: string;
  lastUpdated: string;
  breadcrumbs: BreadcrumbItem[];
  children: ReactNode;
};

type TocItem = { id: string; label: string };

export function LegalDocument({
  title,
  description,
  lastUpdated,
  breadcrumbs,
  children,
}: LegalDocumentProps) {
  const articleRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    const headings = Array.from(article.querySelectorAll("h2"));
    const seen = new Set<string>();
    const items: TocItem[] = headings.map((heading) => {
      const label = heading.textContent?.trim() ?? "";
      const base = heading.id || slugifyText(label, 64) || "section";
      let id = base;
      let n = 2;
      while (seen.has(id)) {
        id = `${base}-${n}`;
        n += 1;
      }
      seen.add(id);
      heading.id = id;
      return { id, label };
    });
    setToc(items);

    if (typeof IntersectionObserver === "undefined" || headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, []);

  useEffect(() => subscribeScroll((y) => setShowBackToTop(y > 480)), []);

  function handleTocClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    scrollToTarget(`#${id}`, lenis ?? undefined);
    window.history.replaceState(null, "", `#${id}`);
    setActiveId(id);
  }

  function handleBackToTop() {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.1 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const hasToc = toc.length > 1;

  return (
    <main className="page-cinema legal-cinema">
      <PageHead
        eyebrow="Legal"
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
      />
      <section className="sec legal-sec">
        <div className={`wrap legal-wrap${hasToc ? " legal-wrap--with-toc" : ""}`}>
          <p className="legal-updated">Last updated: {lastUpdated}</p>
          <div className={`legal-layout${hasToc ? "" : " legal-layout--single"}`}>
            {hasToc && (
              <nav className="legal-toc" aria-label="On this page">
                <span className="legal-toc-label">On this page</span>
                <ul>
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={item.id === activeId ? "is-active" : ""}
                        aria-current={item.id === activeId ? "location" : undefined}
                        onClick={(event) => handleTocClick(event, item.id)}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <article ref={articleRef} className="legal-prose">
              {children}
            </article>
          </div>
        </div>
      </section>
      {mounted &&
        createPortal(
          <button
            type="button"
            className={`back-to-top${showBackToTop ? " is-visible" : ""}`}
            onClick={handleBackToTop}
            aria-label="Back to top"
            tabIndex={showBackToTop ? 0 : -1}
          >
            <ArrowUp size={18} strokeWidth={2.25} />
          </button>,
          document.body,
        )}
    </main>
  );
}
