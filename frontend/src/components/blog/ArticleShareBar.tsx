"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { siteBaseUrl } from "@/lib/blog";

type ArticleShareBarProps = {
  title: string;
  slug: string;
};

/** Copy link, LinkedIn and X. A vertical rail beside the article on wide screens, a row on phones. */
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
    <div className="ar-share" role="group" aria-label="Share this article">
      <p className="ar-share__label" aria-hidden="true">
        Share
      </p>
      <button type="button" className="ar-share__btn" onClick={() => void copyLink()}>
        {copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
        <span className="ar-share__text">{copied ? "Copied" : "Copy link"}</span>
      </button>
      <a
        className="ar-share__btn"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="ar-share__mark" aria-hidden="true">
          in
        </span>
        <span className="ar-share__text">
          LinkedIn<span className="sr-only"> (opens in a new tab)</span>
        </span>
      </a>
      <a
        className="ar-share__btn"
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="ar-share__mark" aria-hidden="true">
          X
        </span>
        <span className="ar-share__text">
          Post on X<span className="sr-only"> (opens in a new tab)</span>
        </span>
      </a>
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied" : ""}
      </span>
    </div>
  );
}
