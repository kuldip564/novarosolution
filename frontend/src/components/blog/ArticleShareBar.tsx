"use client";

import { useState } from "react";
import { siteBaseUrl } from "@/lib/blog";

type ArticleShareBarProps = {
  title: string;
  slug: string;
};

export function ArticleShareBar({ title, slug }: ArticleShareBarProps) {
  const [copied, setCopied] = useState(false);
  const url = `${siteBaseUrl()}/blog/${slug}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <aside className="article-share">
      <span className="article-share-label">Share</span>
      <button type="button" className="btn btn-ghost small" onClick={() => void copyLink()}>
        {copied ? "Copied" : "Copy link"}
      </button>
      <a
        className="btn btn-ghost small"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>
      <a
        className="btn btn-ghost small"
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        X
      </a>
    </aside>
  );
}
