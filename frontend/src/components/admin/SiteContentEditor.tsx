"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { normalizeHeroContent } from "@/lib/hero-content";
import { defaultHero, type HeroContent } from "@/lib/site-data";
import { useAdminToast } from "./AdminToast";

type SiteRow = { key: string; value: unknown };

type SiteInfo = {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
};

type CtaContent = {
  homeTitle: string;
  homeDescription: string;
  servicesTitle: string;
  servicesDescription: string;
  workTitle: string;
  workDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  contactTitle: string;
  contactDescription: string;
};

const tabs = [
  { id: "hero", label: "Home hero" },
  { id: "site", label: "Site & contact" },
  { id: "cta", label: "CTA bands" },
  { id: "advanced", label: "Advanced JSON" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const advancedKeys = [
  "navLinks",
  "marqueeItems",
  "processSteps",
  "homeStats",
  "aboutStats",
  "whyItems",
  "contactOptions",
];

export function SiteContentEditor() {
  const { push } = useAdminToast();
  const [rows, setRows] = useState<SiteRow[]>([]);
  const [tab, setTab] = useState<TabId>("hero");
  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState<HeroContent>({ ...defaultHero });
  const [site, setSite] = useState<SiteInfo>({
    name: "",
    tagline: "",
    email: "",
    phone: "",
    location: "",
  });
  const [cta, setCta] = useState<CtaContent>({
    homeTitle: "",
    homeDescription: "",
    servicesTitle: "",
    servicesDescription: "",
    workTitle: "",
    workDescription: "",
    aboutTitle: "",
    aboutDescription: "",
    contactTitle: "",
    contactDescription: "",
  });
  const [advancedKey, setAdvancedKey] = useState("navLinks");
  const [advancedDraft, setAdvancedDraft] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await apiFetch("/api/admin/site-content");
        const json = (await res.json()) as { data?: SiteRow[] };
        const data = json.data ?? [];
        setRows(data);
        const heroRow = data.find((r) => r.key === "hero")?.value as HeroContent | undefined;
        const siteRow = data.find((r) => r.key === "site")?.value as SiteInfo | undefined;
        const ctaRow = data.find((r) => r.key === "cta")?.value as CtaContent | undefined;
        if (heroRow) setHero(normalizeHeroContent(heroRow));
        if (siteRow) setSite(siteRow);
        if (ctaRow) setCta(ctaRow);
      } catch {
        push("Failed to load site content", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [push]);

  const advancedBase = useMemo(() => {
    const row = rows.find((item) => item.key === advancedKey);
    return JSON.stringify(row?.value ?? {}, null, 2);
  }, [advancedKey, rows]);

  const advancedJson =
    advancedDraft !== null && tab === "advanced" ? advancedDraft : advancedBase;

  async function saveKey(key: string, value: unknown) {
    const res = await apiFetch(`/api/admin/site-content/${key}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    });
    if (!res.ok) throw new Error("Save failed");
    setRows((prev) => [...prev.filter((r) => r.key !== key), { key, value }]);
  }

  async function saveCurrent() {
    try {
      if (tab === "hero") await saveKey("hero", normalizeHeroContent(hero));
      else if (tab === "site") await saveKey("site", site);
      else if (tab === "cta") await saveKey("cta", cta);
      else {
        const value = JSON.parse(advancedJson) as unknown;
        await saveKey(advancedKey, value);
        setAdvancedDraft(null);
      }
      push("Site content saved");
    } catch {
      push("Save failed — check your fields or JSON", "error");
    }
  }

  if (loading) return <div className="admin-empty">Loading site content…</div>;

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Site content</h1>
          <p>Hero copy, contact details, CTA bands, and advanced JSON blocks.</p>
        </div>
        <button type="button" className="admin-btn" onClick={() => void saveCurrent()}>
          Save {tabs.find((t) => t.id === tab)?.label}
        </button>
      </div>

      <div className="admin-content-tabs">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? "active" : undefined}
            onClick={() => {
              setTab(item.id);
              setAdvancedDraft(null);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "hero" && (
        <div className="admin-form admin-form-panel">
          <p className="admin-muted-inline">
            Prefer a live preview?{" "}
            <Link href="/admin/hero">Open the dedicated hero editor</Link>.
          </p>
          <label className="admin-field"><span>Eyebrow</span><input value={hero.eyebrow} onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })} /></label>
          <label className="admin-field"><span>Headline</span><input value={hero.headline} onChange={(e) => setHero({ ...hero, headline: e.target.value })} /></label>
          <label className="admin-field"><span>Accent phrase</span><input value={hero.headlineAccent} onChange={(e) => setHero({ ...hero, headlineAccent: e.target.value })} /></label>
          <label className="admin-field"><span>Lede</span><textarea rows={3} value={hero.lede} onChange={(e) => setHero({ ...hero, lede: e.target.value })} /></label>
          <label className="admin-field"><span>Primary CTA</span><input value={hero.ctaPrimary} onChange={(e) => setHero({ ...hero, ctaPrimary: e.target.value })} /></label>
          <label className="admin-field"><span>Secondary CTA</span><input value={hero.ctaSecondary} onChange={(e) => setHero({ ...hero, ctaSecondary: e.target.value })} /></label>
          <div className="admin-inline-fields">
            <label className="admin-field"><span>Stat value</span><input value={hero.metaStat} onChange={(e) => setHero({ ...hero, metaStat: e.target.value })} /></label>
            <label className="admin-field"><span>Stat label</span><input value={hero.metaLabel} onChange={(e) => setHero({ ...hero, metaLabel: e.target.value })} /></label>
          </div>
        </div>
      )}

      {tab === "site" && (
        <div className="admin-form admin-form-panel">
          <label className="admin-field"><span>Company name</span><input value={site.name} onChange={(e) => setSite({ ...site, name: e.target.value })} /></label>
          <label className="admin-field"><span>Tagline</span><input value={site.tagline} onChange={(e) => setSite({ ...site, tagline: e.target.value })} /></label>
          <label className="admin-field"><span>Email</span><input value={site.email} onChange={(e) => setSite({ ...site, email: e.target.value })} /></label>
          <label className="admin-field"><span>Phone</span><input value={site.phone} onChange={(e) => setSite({ ...site, phone: e.target.value })} /></label>
          <label className="admin-field"><span>Location</span><input value={site.location} onChange={(e) => setSite({ ...site, location: e.target.value })} /></label>
        </div>
      )}

      {tab === "cta" && (
        <div className="admin-form admin-form-panel">
          <fieldset className="admin-form-section">
            <legend>Home CTA</legend>
            <label className="admin-field"><span>Title</span><input value={cta.homeTitle} onChange={(e) => setCta({ ...cta, homeTitle: e.target.value })} /></label>
            <label className="admin-field"><span>Description</span><textarea rows={2} value={cta.homeDescription} onChange={(e) => setCta({ ...cta, homeDescription: e.target.value })} /></label>
          </fieldset>
          <fieldset className="admin-form-section">
            <legend>Services CTA</legend>
            <label className="admin-field"><span>Title</span><input value={cta.servicesTitle} onChange={(e) => setCta({ ...cta, servicesTitle: e.target.value })} /></label>
            <label className="admin-field"><span>Description</span><textarea rows={2} value={cta.servicesDescription} onChange={(e) => setCta({ ...cta, servicesDescription: e.target.value })} /></label>
          </fieldset>
          <fieldset className="admin-form-section">
            <legend>Work CTA</legend>
            <label className="admin-field"><span>Title</span><input value={cta.workTitle} onChange={(e) => setCta({ ...cta, workTitle: e.target.value })} /></label>
            <label className="admin-field"><span>Description</span><textarea rows={2} value={cta.workDescription} onChange={(e) => setCta({ ...cta, workDescription: e.target.value })} /></label>
          </fieldset>
          <fieldset className="admin-form-section">
            <legend>About CTA</legend>
            <label className="admin-field"><span>Title</span><input value={cta.aboutTitle} onChange={(e) => setCta({ ...cta, aboutTitle: e.target.value })} /></label>
            <label className="admin-field"><span>Description</span><textarea rows={2} value={cta.aboutDescription} onChange={(e) => setCta({ ...cta, aboutDescription: e.target.value })} /></label>
          </fieldset>
          <fieldset className="admin-form-section">
            <legend>Contact CTA</legend>
            <label className="admin-field"><span>Title</span><input value={cta.contactTitle} onChange={(e) => setCta({ ...cta, contactTitle: e.target.value })} /></label>
            <label className="admin-field"><span>Description</span><textarea rows={2} value={cta.contactDescription} onChange={(e) => setCta({ ...cta, contactDescription: e.target.value })} /></label>
          </fieldset>
        </div>
      )}

      {tab === "advanced" && (
        <div className="admin-split">
          <div className="admin-key-list">
            {advancedKeys.map((key) => (
              <button
                key={key}
                type="button"
                className={advancedKey === key ? "active" : undefined}
                onClick={() => {
                  setAdvancedKey(key);
                  setAdvancedDraft(null);
                }}
              >
                {key}
              </button>
            ))}
          </div>
          <div className="admin-editor">
            <textarea
              value={advancedJson}
              onChange={(e) => setAdvancedDraft(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>
      )}
    </>
  );
}
