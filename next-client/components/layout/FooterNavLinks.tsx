'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { OPEN_CONSENT_EVENT } from '@/lib/consent';

export default function FooterNavLinks() {
  const { loading, isAuthenticated, isAdmin, isEmployee, isCreator } = useAuth();
  const exploreLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/projects', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' }
  ];
  const legalLinks = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-and-conditions', label: 'Terms & Conditions' },
    { href: '/disclaimer', label: 'Disclaimer' }
  ];
  const socialLinks = [
    { href: 'https://www.linkedin.com', label: 'LinkedIn' },
    { href: 'https://github.com', label: 'GitHub' },
    { href: 'https://www.youtube.com', label: 'YouTube' }
  ];

  function openCookiePreferences() {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT));
  }

  return (
    <nav className="footer-links-grid" aria-label="Footer links">
      <div className="footer-link-group">
        <p className="footer-link-heading">Explore</p>
        <div className="footer-links footer-links-split">
          {exploreLinks.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </div>
      </div>

      {!loading && isAuthenticated ? (
        <div className="footer-link-group">
          <p className="footer-link-heading">Workspace</p>
          <div className="footer-links footer-links-workspace">
            <Link href="/project-chat">Project Chat</Link>
            <Link href="/creator-feed">Feed</Link>
            {isCreator ? <Link href="/creator/studio">Creator Studio</Link> : null}
            {isEmployee ? <Link href="/employee/tasks">Employee Tasks</Link> : null}
            {isAdmin ? <Link href="/admin/dashboard">Admin Dashboard</Link> : null}
            {isAdmin ? <Link href="/admin/blog-manager">Blog Manager</Link> : null}
            {isAdmin ? <Link href="/admin/project-chats">Admin Chats</Link> : null}
          </div>
        </div>
      ) : null}

      <div className="footer-link-group">
        <p className="footer-link-heading">Legal</p>
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
        <p className="footer-link-heading">Social</p>
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
