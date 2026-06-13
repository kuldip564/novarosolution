"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", exact: true }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/work", label: "Work" },
      { href: "/admin/services", label: "Services" },
      { href: "/admin/blog", label: "Blog" },
      { href: "/admin/team", label: "Team" },
      { href: "/admin/testimonials", label: "Testimonials" },
      { href: "/admin/logos", label: "Client logos" },
      { href: "/admin/faq", label: "FAQ" },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/site-content", label: "Site content" },
      { href: "/admin/leads", label: "Leads inbox" },
    ],
  },
  {
    label: "System",
    items: [{ href: "/admin/settings", label: "Settings" }],
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-nav-groups">
      {sections.map((section) => (
        <div key={section.label} className="admin-nav-group">
          <p className="admin-nav-label">{section.label}</p>
          {section.items.map((item) => {
            const active = "exact" in item && item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "active" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

const modules = [
  { href: "/admin/work", label: "Work", desc: "Case studies & project media" },
  { href: "/admin/services", label: "Services", desc: "Rows, images & home cards" },
  { href: "/admin/blog", label: "Blog", desc: "Articles, covers & SEO" },
  { href: "/admin/team", label: "Team", desc: "About page headshots" },
  { href: "/admin/testimonials", label: "Testimonials", desc: "Quotes & avatars" },
  { href: "/admin/logos", label: "Logos", desc: "Client trust strip" },
  { href: "/admin/faq", label: "FAQ", desc: "Questions & answers" },
  { href: "/admin/site-content", label: "Site content", desc: "Hero, contact & CTAs" },
  { href: "/admin/leads", label: "Leads", desc: "Inbox & CSV export" },
];

export function AdminModuleGrid() {
  return (
    <div className="admin-module-grid">
      {modules.map((mod) => (
        <Link key={mod.href} href={mod.href} className="admin-module-card">
          <strong>{mod.label}</strong>
          <span>{mod.desc}</span>
        </Link>
      ))}
    </div>
  );
}
