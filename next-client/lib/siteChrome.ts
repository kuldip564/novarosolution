export type NavItem = { href: string; label: string };

export type SocialLink = { href: string; label: string };

export type SiteChromeHeadings = {
  explore: string;
  workspace: string;
  legal: string;
  social: string;
};

export type SiteChrome = {
  brandName: string;
  brandSubtitle: string;
  searchPlaceholder: string;
  navItems: NavItem[];
  footerTagline: string;
  copyrightName: string;
  headings: SiteChromeHeadings;
  exploreLinks: NavItem[];
  legalLinks: NavItem[];
  socialLinks: SocialLink[];
};

const DEFAULT_NAV: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' }
];

const DEFAULT_LEGAL: NavItem[] = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-and-conditions', label: 'Terms & Conditions' },
  { href: '/disclaimer', label: 'Disclaimer' }
];

const DEFAULT_SOCIAL: SocialLink[] = [
  { href: 'https://www.linkedin.com', label: 'LinkedIn' },
  { href: 'https://github.com', label: 'GitHub' },
  { href: 'https://www.youtube.com', label: 'YouTube' }
];

export const DEFAULT_SITE_CHROME: SiteChrome = {
  brandName: 'Novaro Solution',
  brandSubtitle: 'Web · mobile · product',
  searchPlaceholder: 'Search site…',
  navItems: DEFAULT_NAV,
  footerTagline: 'Web, mobile, and product engineering.',
  copyrightName: 'Novaro Solution',
  headings: {
    explore: 'Explore',
    workspace: 'Workspace',
    legal: 'Legal',
    social: 'Social'
  },
  exploreLinks: DEFAULT_NAV,
  legalLinks: DEFAULT_LEGAL,
  socialLinks: DEFAULT_SOCIAL
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

/** Allow internal routes and safe external URLs for nav/footer links */
export function sanitizeNavHref(href: string): string | null {
  const t = String(href || '').trim();
  if (!t) return null;
  if (t.startsWith('/') && !t.startsWith('//')) return t.split('?')[0] || '/';
  if (/^https:\/\//i.test(t)) return t;
  if (/^mailto:/i.test(t)) return t;
  return null;
}

function sanitizeSocialHref(href: string): string | null {
  const t = String(href || '').trim();
  if (!t) return null;
  if (/^https:\/\//i.test(t)) return t;
  return null;
}

function normalizeNavItems(raw: unknown, fallback: NavItem[]): NavItem[] {
  if (!Array.isArray(raw)) return fallback;
  const out: NavItem[] = [];
  for (const row of raw) {
    if (!row || typeof row !== 'object') continue;
    const href = sanitizeNavHref(String((row as NavItem).href || ''));
    const label = String((row as NavItem).label || '').trim();
    if (href && label) out.push({ href, label });
  }
  return out.length ? out : fallback;
}

function normalizeSocial(raw: unknown, fallback: SocialLink[]): SocialLink[] {
  if (!Array.isArray(raw)) return fallback;
  const out: SocialLink[] = [];
  for (const row of raw) {
    if (!row || typeof row !== 'object') continue;
    const href = sanitizeSocialHref(String((row as SocialLink).href || ''));
    const label = String((row as SocialLink).label || '').trim();
    if (href && label) out.push({ href, label });
  }
  return out.length ? out : fallback;
}

function normalizeHeadings(raw: unknown, fallback: SiteChromeHeadings): SiteChromeHeadings {
  if (!raw || typeof raw !== 'object') return fallback;
  const o = raw as Record<string, unknown>;
  return {
    explore: isNonEmptyString(o.explore) ? o.explore.trim() : fallback.explore,
    workspace: isNonEmptyString(o.workspace) ? o.workspace.trim() : fallback.workspace,
    legal: isNonEmptyString(o.legal) ? o.legal.trim() : fallback.legal,
    social: isNonEmptyString(o.social) ? o.social.trim() : fallback.social
  };
}

/**
 * Merge CMS `siteChrome` with defaults so header/footer always have safe, complete data.
 */
export function linkRowsToNavItems(rows: Array<{ href: string; label: string }>): NavItem[] {
  const out: NavItem[] = [];
  for (const row of rows) {
    const href = sanitizeNavHref(String(row?.href || ''));
    const label = String(row?.label || '').trim();
    if (href && label) out.push({ href, label });
  }
  return out;
}

export function linkRowsToSocial(rows: Array<{ href: string; label: string }>): SocialLink[] {
  const out: SocialLink[] = [];
  for (const row of rows) {
    const href = sanitizeSocialHref(String(row?.href || ''));
    const label = String(row?.label || '').trim();
    if (href && label) out.push({ href, label });
  }
  return out;
}

export function normalizeSiteChrome(raw: unknown): SiteChrome {
  const base = DEFAULT_SITE_CHROME;
  if (!raw || typeof raw !== 'object') return { ...base, exploreLinks: [...base.exploreLinks] };

  const r = raw as Record<string, unknown>;
  const navItems = normalizeNavItems(r.navItems, base.navItems);
  const exploreRaw = r.exploreLinks;
  const exploreLinks = Array.isArray(exploreRaw)
    ? normalizeNavItems(exploreRaw, navItems)
    : navItems;

  return {
    brandName: isNonEmptyString(r.brandName) ? r.brandName.trim() : base.brandName,
    brandSubtitle: isNonEmptyString(r.brandSubtitle) ? r.brandSubtitle.trim() : base.brandSubtitle,
    searchPlaceholder: isNonEmptyString(r.searchPlaceholder) ? r.searchPlaceholder.trim() : base.searchPlaceholder,
    navItems,
    footerTagline: isNonEmptyString(r.footerTagline) ? r.footerTagline.trim() : base.footerTagline,
    copyrightName: isNonEmptyString(r.copyrightName) ? r.copyrightName.trim() : base.copyrightName,
    headings: normalizeHeadings(r.headings, base.headings),
    exploreLinks,
    legalLinks: normalizeNavItems(r.legalLinks, base.legalLinks),
    socialLinks: normalizeSocial(r.socialLinks, base.socialLinks)
  };
}
