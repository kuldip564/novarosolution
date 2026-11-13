"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ArticleHeading } from "@/lib/article-enhance";

/**
 * Table of contents built from the article's H2s. On wide screens it sits in a sticky rail and
 * highlights the section being read; on phones it is a collapsed list above the article.
 */
export function ArticleToc({ items }: { items: ArticleHeading[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!headings.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      // The current section is the last heading above 30% of the viewport.
      const line = window.innerHeight * 0.3;
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) current = heading.id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav className={`ar-toc${open ? " is-open" : ""}`} aria-label="In this article">
      <button
        type="button"
        className="ar-toc__toggle"
        aria-expanded={open}
        aria-controls="ar-toc-list"
        onClick={() => setOpen((value) => !value)}
      >
        <span>In this article</span>
        <span className="ar-toc__count">{items.length} sections</span>
        <ChevronDown size={18} aria-hidden="true" />
      </button>
      <p className="ar-toc__label" aria-hidden="true">
        In this article
      </p>
      <ol id="ar-toc-list" className="ar-toc__list">
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              onClick={() => setOpen(false)}
            >
              <span className="ar-toc__num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
