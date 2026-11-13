"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

type ServiceEngagementProps = { service: string };

const ENGAGED_MS = 30_000;
const SCROLL_DEPTH = 0.5;

/**
 * Fires `service_page_engagement` once per page view, when the reader has either scrolled
 * half the page or spent 30 seconds on it with the tab visible. A bounce never counts.
 */
export function ServiceEngagement({ service }: ServiceEngagementProps) {
  useEffect(() => {
    let done = false;
    let visibleMs = 0;
    let lastTick = document.visibilityState === "visible" ? performance.now() : 0;
    let frame = 0;

    const fire = (trigger: "scroll_50" | "time_30s") => {
      if (done) return;
      done = true;
      track("service_page_engagement", { service, trigger });
      cleanup();
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (max > 0 && window.scrollY / max >= SCROLL_DEPTH) fire("scroll_50");
      });
    };

    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") {
        lastTick = 0;
        return;
      }
      const now = performance.now();
      if (lastTick) visibleMs += now - lastTick;
      lastTick = now;
      if (visibleMs >= ENGAGED_MS) fire("time_30s");
    }, 1_000);

    function cleanup() {
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(timer);
      cancelAnimationFrame(frame);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return cleanup;
  }, [service]);

  return null;
}
