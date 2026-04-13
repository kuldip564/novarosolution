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
    <footer className="site-footer" role="contentinfo">
      <div className="container site-footer__container">
        <div className="site-footer__primary">
          <div className="site-footer__identity">
            <span className="site-footer__brand">{chrome.brandName}</span>
            {chrome.footerTagline ? <p className="site-footer__tagline">{chrome.footerTagline}</p> : null}
          </div>

          <div className="site-footer__columns">
            <div className="site-footer__column">
              <p className="site-footer__label">{h.explore}</p>
              <ul className="site-footer__list">
                {exploreLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="site-footer__link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {!loading && isAuthenticated ? (
              <div className="site-footer__column">
                <p className="site-footer__label">{h.workspace}</p>
                <ul className="site-footer__list">
                  <li>
                    <Link href="/project-chat" className="site-footer__link">
                      Project Chat
                    </Link>
                  </li>
                  <li>
                    <Link href="/creator-feed" className="site-footer__link">
                      Feed
                    </Link>
                  </li>
                  {isCreator ? (
                    <li>
                      <Link href="/creator/studio" className="site-footer__link">
                        Creator Studio
                      </Link>
                    </li>
                  ) : null}
                  {isEmployee ? (
                    <li>
                      <Link href="/employee/tasks" className="site-footer__link">
                        Employee Tasks
                      </Link>
                    </li>
                  ) : null}
                  {isAdmin ? (
                    <li>
                      <Link href="/admin/dashboard" className="site-footer__link">
                        Admin
                      </Link>
                    </li>
                  ) : null}
                  {isAdmin ? (
                    <li>
                      <Link href="/admin/blog-manager" className="site-footer__link">
                        Blog
                      </Link>
                    </li>
                  ) : null}
                  {isAdmin ? (
                    <li>
                      <Link href="/admin/project-chats" className="site-footer__link">
                        Chats
                      </Link>
                    </li>
                  ) : null}
                  {isAdmin ? (
                    <li>
                      <Link href="/admin/job-manager" className="site-footer__link">
                        Jobs
                      </Link>
                    </li>
                  ) : null}
                </ul>
              </div>
            ) : null}

            <div className="site-footer__column">
              <p className="site-footer__label">{h.legal}</p>
              <ul className="site-footer__list">
                {legalLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="site-footer__link">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button type="button" className="site-footer__link site-footer__link--button" onClick={openCookiePreferences}>
                    Cookies
                  </button>
                </li>
              </ul>
            </div>

            <div className="site-footer__column">
              <p className="site-footer__label">{h.social}</p>
              <ul className="site-footer__list">
                {socialLinks.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} target="_blank" rel="noreferrer noopener" className="site-footer__link">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="site-footer__legal">
          <small className="site-footer__copy">
            © {new Date().getFullYear()} {chrome.copyrightName}
          </small>
        </div>
      </div>
    </footer>
  );
}
