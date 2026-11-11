"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Layout classes that say nothing about which section a click came from. */
const GENERIC_CLASSES = new Set(["home-scene", "sec", "light", "wrap", "reveal", "in"]);

function locationOf(el: Element): string {
  const tagged = el.closest<HTMLElement>("[data-cta-location]");
  if (tagged?.dataset.ctaLocation) return tagged.dataset.ctaLocation;
  if (el.closest("header")) return "header";
  if (el.closest("footer")) return "footer";
  const section = el.closest("section");
  if (!section) return "page";
  const specific = [...section.classList].find((name) => !GENERIC_CLASSES.has(name));
  return section.id || specific || section.getAttribute("aria-labelledby") || "section";
}

function label(el: Element): string {
  return (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60);
}

/**
 * One delegated click listener for intent signals: CTA buttons, email, phone and WhatsApp links.
 * These are not leads; the only lead event is `generate_lead` after a confirmed form submission.
 */
export function AnalyticsListener() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest<HTMLAnchorElement>("a[href]");
      const path = window.location.pathname;

      if (link) {
        const href = link.getAttribute("href") ?? "";
        if (href.startsWith("mailto:")) {
          track("email_click", { location: locationOf(link), page_path: path });
          return;
        }
        if (href.startsWith("tel:")) {
          track("phone_click", { location: locationOf(link), page_path: path });
          return;
        }
        if (/^(https?:\/\/)?(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\b|^whatsapp:/i.test(href)) {
          track("whatsapp_click", { location: locationOf(link), page_path: path });
          return;
        }
      }

      // CTA buttons are the shared Button component (.btn). The contact form's submit button
      // is excluded: submissions are measured by the server-confirmed `generate_lead`.
      const cta = target?.closest<HTMLElement>("a.btn, [data-cta]");
      if (cta) {
        track("cta_click", {
          cta_text: cta.dataset.cta || label(cta),
          cta_location: locationOf(cta),
          link_url: cta.getAttribute("href") ?? undefined,
          page_path: path,
        });
      }
    };

    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
