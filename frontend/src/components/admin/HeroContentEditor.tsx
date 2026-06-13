"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAdminToast } from "@/components/admin/AdminToast";
import { apiFetch } from "@/lib/api";
import {
  heroContentFields,
  normalizeHeroContent,
} from "@/lib/hero-content";
import { defaultHero, type HeroContent } from "@/lib/site-data";

export function HeroContentEditor() {
  const { push } = useAdminToast();
  const [hero, setHero] = useState<HeroContent>({ ...defaultHero });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const res = await apiFetch("/api/admin/site-content/hero");
        if (res.ok) {
          const json = (await res.json()) as { data?: { value?: unknown } };
          setHero(normalizeHeroContent(json.data?.value));
        } else {
          setHero({ ...defaultHero });
        }
      } catch {
        push("Failed to load hero content", "error");
        setHero({ ...defaultHero });
      } finally {
        setLoading(false);
      }
    })();
  }, [push]);

  async function saveHero() {
    setSaving(true);
    try {
      const payload = normalizeHeroContent(hero);
      const res = await apiFetch("/api/admin/site-content/hero", {
        method: "PUT",
        body: JSON.stringify({ value: payload }),
      });
      if (!res.ok) throw new Error("Save failed");
      setHero(payload);
      push("Hero words saved — refresh the home page to see changes");
    } catch {
      push("Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  function resetDefaults() {
    setHero({ ...defaultHero });
  }

  if (loading) return <div className="admin-empty">Loading hero content…</div>;

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Home hero words</h1>
          <p>Edit every line on the home page hero — headline, buttons, and stat.</p>
        </div>
        <div className="admin-quick-actions">
          <button type="button" className="admin-btn ghost" onClick={resetDefaults}>
            Reset defaults
          </button>
          <Link href="/" className="admin-btn ghost" target="_blank">
            View home
          </Link>
          <button
            type="button"
            className="admin-btn"
            disabled={saving}
            onClick={() => void saveHero()}
          >
            {saving ? "Saving…" : "Save hero"}
          </button>
        </div>
      </div>

      <div className="admin-hero-editor-grid">
        <div className="admin-form admin-form-panel">
          {heroContentFields().map(({ key, label, hint, multiline }) => (
            <label key={key} className="admin-field">
              <span>{label}</span>
              {hint && <small className="admin-field-hint">{hint}</small>}
              {multiline ? (
                <textarea
                  rows={4}
                  value={hero[key]}
                  onChange={(e) => setHero({ ...hero, [key]: e.target.value })}
                />
              ) : (
                <input
                  value={hero[key]}
                  onChange={(e) => setHero({ ...hero, [key]: e.target.value })}
                />
              )}
            </label>
          ))}
        </div>

        <aside className="admin-hero-preview">
          <p className="admin-preview-label">Live preview</p>
          <div className="admin-hero-preview-card">
            <span className="admin-hero-preview-eyebrow">{hero.eyebrow}</span>
            <h2>
              {hero.headline}
              <br />
              <span>{hero.headlineAccent}</span>
            </h2>
            <p>{hero.lede}</p>
            <div className="admin-hero-preview-actions">
              <span className="admin-hero-preview-btn primary">{hero.ctaPrimary}</span>
              <span className="admin-hero-preview-btn ghost">{hero.ctaSecondary}</span>
            </div>
            <p className="admin-hero-preview-meta">
              <strong>{hero.metaStat}</strong> {hero.metaLabel}
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
