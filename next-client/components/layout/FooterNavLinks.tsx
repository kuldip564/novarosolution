'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { OPEN_CONSENT_EVENT } from '@/lib/consent';
import type { SiteChrome } from '@/lib/siteChrome';
import { DEFAULT_SITE_CHROME } from '@/lib/siteChrome';

type FooterNavLinksProps = {
  chrome?: SiteChrome;
};

export default function FooterNavLinks({ chrome = DEFAULT_SITE_CHROME }: FooterNavLinksProps) {
  const { loading, isAuthenticated, isAdmin, isEmployee, isCreator } = useAuth();
  const exploreLinks = chrome.exploreLinks?.length ? chrome.exploreLinks : chrome.navItems;
  const legalLinks = chrome.legalLinks?.length ? chrome.legalLinks : DEFAULT_SITE_CHROME.legalLinks;
  const socialLinks = chrome.socialLinks?.length ? chrome.socialLinks : DEFAULT_SITE_CHROME.socialLinks;
  const h = chrome.headings || DEFAULT_SITE_CHROME.headings;

  function openCookiePreferences() {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT));
  }

  return (
    <nav className="footer-links-grid" aria-label="Footer links">
      <div className="footer-link-group">
        <p className="footer-link-heading">{h.explore}</p>
        <div className="footer-links footer-links-split">
          {exploreLinks.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </div>
      </div>

      {!loading && isAuthenticated ? (
        <div className="footer-link-group">
          <p className="footer-link-heading">{h.workspace}</p>
          <div className="footer-links footer-links-workspace">
            <Link href="/project-chat">Project Chat</Link>
            <Link href="/creator-feed">Feed</Link>
            {isCreator ? <Link href="/creator/studio">Creator Studio</Link> : null}
            {isEmployee ? <Link href="/employee/tasks">Employee Tasks</Link> : null}
            {isAdmin ? <Link href="/admin/dashboard">Admin Dashboard</Link> : null}
            {isAdmin ? <Link href="/admin/blog-manager">Blog Manager</Link> : null}
            {isAdmin ? <Link href="/admin/project-chats">Admin Chats</Link> : null}
            {isAdmin ? <Link href="/admin/job-manager">Job Manager</Link> : null}
          </div>
        </div>
      ) : null}

      <div className="footer-link-group">
        <p className="footer-link-heading">{h.legal}</p>
        <div className="footer-links">
          {legalLinks.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
          <button className="footer-inline-btn" type="button" onClick={openCookiePreferences}>
            Manage Cookies
          </button>
        </div>
      </div>

      <div className="footer-link-group">
        <p className="footer-link-heading">{h.social}</p>
        <div className="footer-links">
          {socialLinks.map((item) => (
            <a key={item.href} href={item.href} target="_blank" rel="noreferrer noopener">
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
