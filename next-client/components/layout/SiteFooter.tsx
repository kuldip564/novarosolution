'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { OPEN_CONSENT_EVENT } from '@/lib/consent';
import type { SiteChrome } from '@/lib/siteChrome';
import { DEFAULT_SITE_CHROME } from '@/lib/siteChrome';

type Props = {
  chrome?: SiteChrome;
};

export default function SiteFooter({ chrome = DEFAULT_SITE_CHROME }: Props) {
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
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <p className="site-footer__brand-name">{chrome.brandName}</p>
            <p className="site-footer__brand-tag">{chrome.footerTagline}</p>
          </div>

          <nav className="site-footer__menus" aria-label="Footer links">
            <div className="site-footer__col">
              <p className="site-footer__heading">{h.explore}</p>
              <div className="site-footer__links site-footer__links--split">
                {exploreLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="site-footer__a">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {!loading && isAuthenticated ? (
              <div className="site-footer__col">
                <p className="site-footer__heading">{h.workspace}</p>
                <div className="site-footer__links site-footer__links--workspace">
                  <Link href="/project-chat" className="site-footer__a">
                    Project Chat
                  </Link>
                  <Link href="/creator-feed" className="site-footer__a">
                    Feed
                  </Link>
                  {isCreator ? (
                    <Link href="/creator/studio" className="site-footer__a">
                      Creator Studio
                    </Link>
                  ) : null}
                  {isEmployee ? (
                    <Link href="/employee/tasks" className="site-footer__a">
                      Employee Tasks
                    </Link>
                  ) : null}
                  {isAdmin ? (
                    <Link href="/admin/dashboard" className="site-footer__a">
                      Admin Dashboard
                    </Link>
                  ) : null}
                  {isAdmin ? (
                    <Link href="/admin/blog-manager" className="site-footer__a">
                      Blog Manager
                    </Link>
                  ) : null}
                  {isAdmin ? (
                    <Link href="/admin/project-chats" className="site-footer__a">
                      Admin Chats
                    </Link>
                  ) : null}
                  {isAdmin ? (
                    <Link href="/admin/job-manager" className="site-footer__a">
                      Job Manager
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="site-footer__col">
              <p className="site-footer__heading">{h.legal}</p>
              <div className="site-footer__links">
                {legalLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="site-footer__a">
                    {item.label}
                  </Link>
                ))}
                <button type="button" className="site-footer__cookie" onClick={openCookiePreferences}>
                  Manage Cookies
                </button>
              </div>
            </div>

            <div className="site-footer__col">
              <p className="site-footer__heading">{h.social}</p>
              <div className="site-footer__links">
                {socialLinks.map((item) => (
                  <a key={item.href} href={item.href} target="_blank" rel="noreferrer noopener" className="site-footer__a">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </nav>

          <div className="site-footer__meta">
            <small>
              © {new Date().getFullYear()} {chrome.copyrightName}
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
}
