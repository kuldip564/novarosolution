"use client";

import { useEffect } from "react";

type TemplateProps = {
  children: React.ReactNode;
};

/** False until the first page has hydrated; later navigations get a short CSS entrance. */
let hasHydrated = false;

/**
 * Route transition. The first page renders exactly as the server sent it, with no wrapper
 * swap and nothing hidden, so the largest paint is never delayed by JavaScript. Client
 * navigations after that fade in with a CSS animation (off under prefers-reduced-motion).
 */
export default function Template({ children }: TemplateProps) {
  const animate = hasHydrated;

  useEffect(() => {
    hasHydrated = true;
  }, []);

  return <div className={animate ? "route-shell route-shell--enter" : "route-shell"}>{children}</div>;
}
