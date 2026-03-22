'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

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
    </nav>
  );
}
