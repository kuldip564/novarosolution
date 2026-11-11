/**
 * GA4 event helper. Rules:
 * - Never send personal data (names, emails, phone numbers, message text) to analytics.
 * - `generate_lead` is the only conversion. It fires after the server confirms the enquiry was
 *   received, never on a button click, so accidental or failed submits are not counted.
 * - Clicks (CTA, email, phone, WhatsApp) are intent signals, debounced so a double click is
 *   one event.
 *
 * GA loads lazily (see app/layout.tsx). track() runs the loader first, so the `config` command is
 * always queued before the event; events from before the loader exists are replayed by it.
 */

/**
 * Event names (see docs/measurement-plan.md for parameters and which one is a key event):
 *  generate_lead            the server confirmed an enquiry (the only conversion)
 *  form_submit              a valid form was sent to the server (attempt, not yet a lead)
 *  form_start / form_validation_error / form_submit_error   funnel and error diagnostics
 *  primary_cta_click        click on a primary (filled) call-to-action button
 *  cta_click                click on a secondary button
 *  click_email / click_phone / click_whatsapp   contact-link clicks (intent, not leads)
 *  service_page_view        a service detail page was opened
 *  service_page_engagement  the reader scrolled half of it or stayed 30 s
 *  project_view             a case-study page was opened
 */
export type AnalyticsEvent =
  | "generate_lead"
  | "form_submit"
  | "form_start"
  | "form_validation_error"
  | "form_submit_error"
  | "primary_cta_click"
  | "cta_click"
  | "click_email"
  | "click_phone"
  | "click_whatsapp"
  | "service_page_view"
  | "service_page_engagement"
  | "project_view";

type Params = Record<string, string | number | boolean | undefined>;

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  __gaLoad?: () => void;
  __gaPending?: Array<[string, Params]>;
};

const recent = new Map<string, number>();
const DEBOUNCE_MS = 1_000;

export function track(event: AnalyticsEvent, params: Params = {}): void {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;

  const key = `${event}|${JSON.stringify(params)}`;
  const now = Date.now();
  const last = recent.get(key);
  if (last && now - last < DEBOUNCE_MS) return;
  recent.set(key, now);

  const clean: Params = {};
  for (const [name, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") clean[name] = typeof value === "string" ? value.slice(0, 100) : value;
  }

  try {
    if (typeof w.__gaLoad === "function") {
      // Loader is on the page: make sure GA is configured, then send.
      w.__gaLoad();
      w.gtag?.("event", event, clean);
    } else if (process.env.NODE_ENV === "production") {
      // Loader script hasn't run yet (it is injected after load): it replays these after `config`.
      (w.__gaPending ||= []).push([event, clean]);
    }
  } catch {
    // Analytics must never break the page.
  }

  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, clean);
  }
}
