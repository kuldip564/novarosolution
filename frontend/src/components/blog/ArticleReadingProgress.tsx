"use client";

import { useEffect, useState } from "react";

export function ArticleReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const article = document.querySelector<HTMLElement>(".article-body");
      if (!article) return;
      const total = article.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY - (article.offsetTop - 96);
      const pct = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
      setProgress(pct);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="article-progress" aria-hidden="true">
      <div style={{ width: `${progress}%` }} />
    </div>
  );
}
