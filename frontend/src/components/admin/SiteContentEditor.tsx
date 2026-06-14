"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  defaultAboutPage,
  normalizeAboutPage,
  type AboutPageContent,
} from "@/lib/about-content";
import {
  defaultServicesPage,
  normalizeServicesPage,
  type ServicesPageContent,
} from "@/lib/services-content";
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
  { id: "about", label: "About page" },
  { id: "services", label: "Services page" },
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
  "aboutPage",
  "servicesPage",
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
  const [about, setAbout] = useState<AboutPageContent>({ ...defaultAboutPage });
  const [servicesPage, setServicesPage] = useState<ServicesPageContent>({ ...defaultServicesPage });
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
        const aboutRow = data.find((r) => r.key === "aboutPage")?.value;
        const servicesRow = data.find((r) => r.key === "servicesPage")?.value;
        if (heroRow) setHero(normalizeHeroContent(heroRow));
        if (siteRow) setSite(siteRow);
        if (ctaRow) setCta(ctaRow);
        if (aboutRow) setAbout(normalizeAboutPage(aboutRow));
        if (servicesRow) setServicesPage(normalizeServicesPage(servicesRow));
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
      else if (tab === "about") await saveKey("aboutPage", about);
      else if (tab === "services") await saveKey("servicesPage", servicesPage);
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

      {tab === "about" && (
        <div className="admin-form admin-form-panel">
          <fieldset className="admin-form-section">
            <legend>Intro</legend>
            <div className="admin-inline-fields">
              <label className="admin-field">
                <span>Headline (outline)</span>
                <input
                  value={about.introTitle}
                  onChange={(e) => setAbout({ ...about, introTitle: e.target.value })}
                />
              </label>
              <label className="admin-field">
                <span>Headline (accent)</span>
                <input
                  value={about.introAccent}
                  onChange={(e) => setAbout({ ...about, introAccent: e.target.value })}
                />
              </label>
            </div>
            <label className="admin-field">
              <span>Intro tagline</span>
              <textarea
                rows={2}
                value={about.introLine}
                onChange={(e) => setAbout({ ...about, introLine: e.target.value })}
              />
            </label>
          </fieldset>

          <fieldset className="admin-form-section">
            <legend>Who we are</legend>
            <label className="admin-field">
              <span>Eyebrow</span>
              <input
                value={about.whoWeAre.eyebrow}
                onChange={(e) =>
                  setAbout({ ...about, whoWeAre: { ...about.whoWeAre, eyebrow: e.target.value } })
                }
              />
            </label>
            <label className="admin-field">
              <span>Title (use line breaks for split headline)</span>
              <textarea
                rows={2}
                value={about.whoWeAre.title}
                onChange={(e) =>
                  setAbout({ ...about, whoWeAre: { ...about.whoWeAre, title: e.target.value } })
                }
              />
            </label>
            <label className="admin-field">
              <span>Body</span>
              <textarea
                rows={4}
                value={about.whoWeAre.body}
                onChange={(e) =>
                  setAbout({ ...about, whoWeAre: { ...about.whoWeAre, body: e.target.value } })
                }
              />
            </label>
          </fieldset>

          <fieldset className="admin-form-section">
            <legend>Mission & vision</legend>
            <label className="admin-field">
              <span>Section eyebrow</span>
              <input
                value={about.missionVision.eyebrow}
                onChange={(e) =>
                  setAbout({
                    ...about,
                    missionVision: { ...about.missionVision, eyebrow: e.target.value },
                  })
                }
              />
            </label>
            <label className="admin-field">
              <span>Mission label</span>
              <input
                value={about.missionVision.missionLabel}
                onChange={(e) =>
                  setAbout({
                    ...about,
                    missionVision: { ...about.missionVision, missionLabel: e.target.value },
                  })
                }
              />
            </label>
            <label className="admin-field">
              <span>Mission</span>
              <textarea
                rows={3}
                value={about.missionVision.mission}
                onChange={(e) =>
                  setAbout({
                    ...about,
                    missionVision: { ...about.missionVision, mission: e.target.value },
                  })
                }
              />
            </label>
            <label className="admin-field">
              <span>Vision label</span>
              <input
                value={about.missionVision.visionLabel}
                onChange={(e) =>
                  setAbout({
                    ...about,
                    missionVision: { ...about.missionVision, visionLabel: e.target.value },
                  })
                }
              />
            </label>
            <label className="admin-field">
              <span>Vision</span>
              <textarea
                rows={3}
                value={about.missionVision.vision}
                onChange={(e) =>
                  setAbout({
                    ...about,
                    missionVision: { ...about.missionVision, vision: e.target.value },
                  })
                }
              />
            </label>
          </fieldset>

          <fieldset className="admin-form-section">
            <legend>Story timeline</legend>
            <label className="admin-field">
              <span>Eyebrow</span>
              <input
                value={about.timeline.eyebrow}
                onChange={(e) =>
                  setAbout({
                    ...about,
                    timeline: { ...about.timeline, eyebrow: e.target.value },
                  })
                }
              />
            </label>
            <label className="admin-field">
              <span>Title</span>
              <textarea
                rows={2}
                value={about.timeline.title}
                onChange={(e) =>
                  setAbout({
                    ...about,
                    timeline: { ...about.timeline, title: e.target.value },
                  })
                }
              />
            </label>
            {about.timeline.milestones.map((milestone, index) => (
              <div key={`milestone-${index}`} className="admin-form-section">
                <p className="admin-muted-inline">Milestone {index + 1}</p>
                <label className="admin-field">
                  <span>Year</span>
                  <input
                    value={milestone.year}
                    onChange={(e) => {
                      const milestones = [...about.timeline.milestones];
                      milestones[index] = { ...milestones[index], year: e.target.value };
                      setAbout({ ...about, timeline: { ...about.timeline, milestones } });
                    }}
                  />
                </label>
                <label className="admin-field">
                  <span>Title</span>
                  <input
                    value={milestone.title}
                    onChange={(e) => {
                      const milestones = [...about.timeline.milestones];
                      milestones[index] = { ...milestones[index], title: e.target.value };
                      setAbout({ ...about, timeline: { ...about.timeline, milestones } });
                    }}
                  />
                </label>
                <label className="admin-field">
                  <span>Text</span>
                  <textarea
                    rows={2}
                    value={milestone.text}
                    onChange={(e) => {
                      const milestones = [...about.timeline.milestones];
                      milestones[index] = { ...milestones[index], text: e.target.value };
                      setAbout({ ...about, timeline: { ...about.timeline, milestones } });
                    }}
                  />
                </label>
              </div>
            ))}
          </fieldset>

          <fieldset className="admin-form-section">
            <legend>Core values</legend>
            <label className="admin-field">
              <span>Eyebrow</span>
              <input
                value={about.values.eyebrow}
                onChange={(e) =>
                  setAbout({ ...about, values: { ...about.values, eyebrow: e.target.value } })
                }
              />
            </label>
            <label className="admin-field">
              <span>Title</span>
              <input
                value={about.values.title}
                onChange={(e) =>
                  setAbout({ ...about, values: { ...about.values, title: e.target.value } })
                }
              />
            </label>
            {about.values.items.map((value, index) => (
              <div key={`value-${index}`} className="admin-form-section">
                <p className="admin-muted-inline">Value {index + 1}</p>
                <label className="admin-field">
                  <span>Icon key (spark, shield, compass, chart)</span>
                  <input
                    value={value.icon}
                    onChange={(e) => {
                      const items = [...about.values.items];
                      items[index] = { ...items[index], icon: e.target.value };
                      setAbout({ ...about, values: { ...about.values, items } });
                    }}
                  />
                </label>
                <label className="admin-field">
                  <span>Title</span>
                  <input
                    value={value.title}
                    onChange={(e) => {
                      const items = [...about.values.items];
                      items[index] = { ...items[index], title: e.target.value };
                      setAbout({ ...about, values: { ...about.values, items } });
                    }}
                  />
                </label>
                <label className="admin-field">
                  <span>Description</span>
                  <textarea
                    rows={2}
                    value={value.description}
                    onChange={(e) => {
                      const items = [...about.values.items];
                      items[index] = { ...items[index], description: e.target.value };
                      setAbout({ ...about, values: { ...about.values, items } });
                    }}
                  />
                </label>
              </div>
            ))}
          </fieldset>

          <fieldset className="admin-form-section">
            <legend>Section labels</legend>
            <label className="admin-field">
              <span>Stats eyebrow</span>
              <input
                value={about.stats.eyebrow}
                onChange={(e) =>
                  setAbout({ ...about, stats: { ...about.stats, eyebrow: e.target.value } })
                }
              />
            </label>
            <label className="admin-field">
              <span>Stats title</span>
              <input
                value={about.stats.title}
                onChange={(e) =>
                  setAbout({ ...about, stats: { ...about.stats, title: e.target.value } })
                }
              />
            </label>
            <p className="admin-muted-inline">
              Stat numbers are edited under Advanced → <code>aboutStats</code>.
            </p>
            <label className="admin-field">
              <span>Team eyebrow</span>
              <input
                value={about.team.eyebrow}
                onChange={(e) =>
                  setAbout({ ...about, team: { ...about.team, eyebrow: e.target.value } })
                }
              />
            </label>
            <label className="admin-field">
              <span>Team title</span>
              <input
                value={about.team.title}
                onChange={(e) =>
                  setAbout({ ...about, team: { ...about.team, title: e.target.value } })
                }
              />
            </label>
            <label className="admin-field">
              <span>Team description</span>
              <textarea
                rows={2}
                value={about.team.description}
                onChange={(e) =>
                  setAbout({ ...about, team: { ...about.team, description: e.target.value } })
                }
              />
            </label>
            <p className="admin-muted-inline">
              Team members are managed on the <Link href="/admin/team">Team</Link> page.
            </p>
            <label className="admin-field">
              <span>Why us eyebrow</span>
              <input
                value={about.whyUs.eyebrow}
                onChange={(e) =>
                  setAbout({ ...about, whyUs: { ...about.whyUs, eyebrow: e.target.value } })
                }
              />
            </label>
            <label className="admin-field">
              <span>Why us title</span>
              <input
                value={about.whyUs.title}
                onChange={(e) =>
                  setAbout({ ...about, whyUs: { ...about.whyUs, title: e.target.value } })
                }
              />
            </label>
            <p className="admin-muted-inline">
              Why-us list items are edited under Advanced → <code>whyItems</code>.
            </p>
            <label className="admin-field">
              <span>CTA eyebrow</span>
              <input
                value={about.cta.eyebrow}
                onChange={(e) =>
                  setAbout({ ...about, cta: { ...about.cta, eyebrow: e.target.value } })
                }
              />
            </label>
            <label className="admin-field">
              <span>CTA button label</span>
              <input
                value={about.cta.buttonLabel}
                onChange={(e) =>
                  setAbout({ ...about, cta: { ...about.cta, buttonLabel: e.target.value } })
                }
              />
            </label>
            <p className="admin-muted-inline">
              CTA title and description are on the CTA bands tab (About CTA).
            </p>
          </fieldset>
        </div>
      )}

      {tab === "services" && (
        <div className="admin-form admin-form-panel">
          <p className="admin-muted-inline">
            Service titles, descriptions, bullets, and images are managed on{" "}
            <Link href="/admin/services">Services</Link>. Edit page framing, outcomes, and SEO links here.
          </p>

          <fieldset className="admin-form-section">
            <legend>Intro</legend>
            <div className="admin-inline-fields">
              <label className="admin-field">
                <span>Headline (outline)</span>
                <input
                  value={servicesPage.introTitle}
                  onChange={(e) =>
                    setServicesPage({ ...servicesPage, introTitle: e.target.value })
                  }
                />
              </label>
              <label className="admin-field">
                <span>Headline (accent)</span>
                <input
                  value={servicesPage.introAccent}
                  onChange={(e) =>
                    setServicesPage({ ...servicesPage, introAccent: e.target.value })
                  }
                />
              </label>
            </div>
            <label className="admin-field">
              <span>Intro tagline</span>
              <input
                value={servicesPage.introLine}
                onChange={(e) => setServicesPage({ ...servicesPage, introLine: e.target.value })}
              />
            </label>
            <label className="admin-field">
              <span>Subline</span>
              <textarea
                rows={2}
                value={servicesPage.introSubline}
                onChange={(e) => setServicesPage({ ...servicesPage, introSubline: e.target.value })}
              />
            </label>
          </fieldset>

          <fieldset className="admin-form-section">
            <legend>Capabilities & process labels</legend>
            <label className="admin-field">
              <span>Capabilities eyebrow</span>
              <input
                value={servicesPage.capabilities.eyebrow}
                onChange={(e) =>
                  setServicesPage({
                    ...servicesPage,
                    capabilities: { ...servicesPage.capabilities, eyebrow: e.target.value },
                  })
                }
              />
            </label>
            <label className="admin-field">
              <span>Capabilities title</span>
              <input
                value={servicesPage.capabilities.title}
                onChange={(e) =>
                  setServicesPage({
                    ...servicesPage,
                    capabilities: { ...servicesPage.capabilities, title: e.target.value },
                  })
                }
              />
            </label>
            <label className="admin-field">
              <span>Capabilities description</span>
              <textarea
                rows={3}
                value={servicesPage.capabilities.lede}
                onChange={(e) =>
                  setServicesPage({
                    ...servicesPage,
                    capabilities: { ...servicesPage.capabilities, lede: e.target.value },
                  })
                }
              />
            </label>
          </fieldset>

          <fieldset className="admin-form-section">
            <legend>Capability cards</legend>
            {servicesPage.capabilities.items.map((item, index) => (
              <div key={`cap-${index}`} className="admin-form-subpanel">
                <p className="admin-form-subpanel-title">{item.title || `Capability ${index + 1}`}</p>
                <label className="admin-field">
                  <span>Icon key</span>
                  <input
                    value={item.icon}
                    onChange={(e) => {
                      const items = [...servicesPage.capabilities.items];
                      items[index] = { ...items[index], icon: e.target.value };
                      setServicesPage({
                        ...servicesPage,
                        capabilities: { ...servicesPage.capabilities, items },
                      });
                    }}
                    placeholder="cloud, palette, database, plug, shield, gauge, chart, smartphone"
                  />
                </label>
                <label className="admin-field">
                  <span>Title</span>
                  <input
                    value={item.title}
                    onChange={(e) => {
                      const items = [...servicesPage.capabilities.items];
                      items[index] = { ...items[index], title: e.target.value };
                      setServicesPage({
                        ...servicesPage,
                        capabilities: { ...servicesPage.capabilities, items },
                      });
                    }}
                  />
                </label>
                <label className="admin-field">
                  <span>Description</span>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => {
                      const items = [...servicesPage.capabilities.items];
                      items[index] = { ...items[index], description: e.target.value };
                      setServicesPage({
                        ...servicesPage,
                        capabilities: { ...servicesPage.capabilities, items },
                      });
                    }}
                  />
                </label>
              </div>
            ))}
          </fieldset>

          <fieldset className="admin-form-section">
            <legend>Process labels</legend>
            <label className="admin-field">
              <span>Process eyebrow</span>
              <input
                value={servicesPage.process.eyebrow}
                onChange={(e) =>
                  setServicesPage({
                    ...servicesPage,
                    process: { ...servicesPage.process, eyebrow: e.target.value },
                  })
                }
              />
            </label>
            <label className="admin-field">
              <span>Process title</span>
              <input
                value={servicesPage.process.title}
                onChange={(e) =>
                  setServicesPage({
                    ...servicesPage,
                    process: { ...servicesPage.process, title: e.target.value },
                  })
                }
              />
            </label>
            <label className="admin-field">
              <span>Process lede</span>
              <textarea
                rows={2}
                value={servicesPage.process.lede}
                onChange={(e) =>
                  setServicesPage({
                    ...servicesPage,
                    process: { ...servicesPage.process, lede: e.target.value },
                  })
                }
              />
            </label>
            <p className="admin-muted-inline">
              Process step copy is edited under Advanced → <code>processSteps</code>.
            </p>
          </fieldset>

          {Object.entries(servicesPage.serviceExtras).map(([slug, extra]) => (
            <fieldset key={slug} className="admin-form-section">
              <legend>{slug}</legend>
              <p className="admin-muted-inline">Outcomes and internal SEO links for this service.</p>
              {extra.outcomes.map((outcome, index) => (
                <label key={`${slug}-outcome-${index}`} className="admin-field">
                  <span>Outcome {index + 1}</span>
                  <input
                    value={outcome}
                    onChange={(e) => {
                      const outcomes = [...extra.outcomes];
                      outcomes[index] = e.target.value;
                      setServicesPage({
                        ...servicesPage,
                        serviceExtras: {
                          ...servicesPage.serviceExtras,
                          [slug]: { ...extra, outcomes },
                        },
                      });
                    }}
                  />
                </label>
              ))}
              {extra.relatedLinks.map((link, index) => (
                <div key={`${slug}-link-${index}`} className="admin-inline-fields">
                  <label className="admin-field">
                    <span>Link label {index + 1}</span>
                    <input
                      value={link.label}
                      onChange={(e) => {
                        const relatedLinks = [...extra.relatedLinks];
                        relatedLinks[index] = { ...relatedLinks[index], label: e.target.value };
                        setServicesPage({
                          ...servicesPage,
                          serviceExtras: {
                            ...servicesPage.serviceExtras,
                            [slug]: { ...extra, relatedLinks },
                          },
                        });
                      }}
                    />
                  </label>
                  <label className="admin-field">
                    <span>URL</span>
                    <input
                      value={link.href}
                      onChange={(e) => {
                        const relatedLinks = [...extra.relatedLinks];
                        relatedLinks[index] = { ...relatedLinks[index], href: e.target.value };
                        setServicesPage({
                          ...servicesPage,
                          serviceExtras: {
                            ...servicesPage.serviceExtras,
                            [slug]: { ...extra, relatedLinks },
                          },
                        });
                      }}
                    />
                  </label>
                </div>
              ))}
            </fieldset>
          ))}

          <fieldset className="admin-form-section">
            <legend>CTA band</legend>
            <label className="admin-field">
              <span>Eyebrow</span>
              <input
                value={servicesPage.cta.eyebrow}
                onChange={(e) =>
                  setServicesPage({
                    ...servicesPage,
                    cta: { ...servicesPage.cta, eyebrow: e.target.value },
                  })
                }
              />
            </label>
            <label className="admin-field">
              <span>Button label</span>
              <input
                value={servicesPage.cta.buttonLabel}
                onChange={(e) =>
                  setServicesPage({
                    ...servicesPage,
                    cta: { ...servicesPage.cta, buttonLabel: e.target.value },
                  })
                }
              />
            </label>
            <p className="admin-muted-inline">
              CTA title and description are on the CTA bands tab (Services CTA).
            </p>
          </fieldset>
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
