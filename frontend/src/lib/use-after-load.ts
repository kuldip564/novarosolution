"use client";

import { useEffect, useState } from "react";

/**
 * True once the page has loaded and the main thread has had an idle moment. Use it to
 * start decorative work (WebGL, cursor effects) that must never compete with first paint,
 * hydration or the first interaction.
 */
export function useAfterLoad(enabled = true, delayMs = 1200): boolean {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let timer = 0;
    let idleId = 0;
    const start = () => {
      timer = window.setTimeout(() => {
        if (typeof window.requestIdleCallback === "function") {
          idleId = window.requestIdleCallback(() => setIdle(true), { timeout: 2500 });
        } else {
          setIdle(true);
        }
      }, delayMs);
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      window.removeEventListener("load", start);
      window.clearTimeout(timer);
      if (idleId) window.cancelIdleCallback(idleId);
    };
  }, [enabled, delayMs]);

  return enabled && idle;
}
