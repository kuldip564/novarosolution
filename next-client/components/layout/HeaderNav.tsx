'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' }
];

export default function HeaderNav() {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { loading, isAuthenticated, isCreator, isAdmin, isEmployee, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;
    const stored = window.localStorage.getItem('novaro_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const nextTheme = stored === 'dark' || stored === 'light' ? stored : prefersDark ? 'dark' : 'light';
    root.setAttribute('data-theme', nextTheme);
    setTheme(nextTheme);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 1024) {
        setMenuOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    window.localStorage.setItem('novaro_theme', nextTheme);
    setTheme(nextTheme);
  }

  function handleLogout() {
    logout();
    setMenuOpen(false);
    router.replace('/');
  }

  function renderLink(item: { href: string; label: string }) {
    const isActive =
      pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`nav-link ${isActive ? 'is-active' : ''}`}
        onClick={() => setMenuOpen(false)}
      >
        <span>{item.label}</span>
        {isActive ? (
          <motion.span
            className="nav-active-indicator"
            layoutId={reduceMotion ? undefined : 'nav-active-indicator'}
            transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.72 }}
          />
        ) : null}
      </Link>
    );
  }

  const authLinks = !loading && isAuthenticated
    ? [
        ...(isCreator ? [{ href: '/creator/studio', label: 'Creator Studio' }] : []),
        ...(isEmployee ? [{ href: '/employee/tasks', label: 'Tasks' }] : []),
        ...(isAdmin ? [{ href: '/admin/dashboard', label: 'Admin' }] : []),
        ...(isAdmin ? [{ href: '/admin/project-chats', label: 'Admin Chats' }] : []),
        { href: '/project-chat', label: 'Project Chat' },
        { href: '/creator-feed', label: 'Feed' },
        { href: '/profile', label: 'Profile' }
      ]
    : !loading
      ? [
          { href: '/login', label: 'Login' },
          { href: '/register', label: 'Register' }
        ]
      : [];

  return (
    <div className="header-nav-wrap">
      <motion.nav
        className="nav nav-desktop nav-shell"
        aria-label="Main navigation"
        initial={reduceMotion ? undefined : { opacity: 0, y: -6 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        {NAV_ITEMS.map(renderLink)}
        {authLinks.length ? (
          <>
            <span className="nav-divider" aria-hidden="true" />
            {authLinks.map(renderLink)}
            {!loading && isAuthenticated ? (
              <button type="button" className="nav-link nav-link-ghost" onClick={handleLogout}>
                <span>Logout</span>
              </button>
            ) : null}
          </>
        ) : (
          <span className="nav-link nav-link-loading"><span>Loading...</span></span>
        )}
      </motion.nav>

      <div className="nav-utilities nav-shell-utilities">
        <button
          type="button"
          aria-label="Toggle theme"
          className="theme-toggle"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <FaSun size={14} /> : <FaMoon size={14} />}
        </button>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className={`mobile-menu-btn ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.button
              aria-label="Close menu overlay"
              className="mobile-menu-overlay"
              onClick={() => setMenuOpen(false)}
              initial={reduceMotion ? undefined : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
            />
            <motion.nav
              className="mobile-menu-panel"
              aria-label="Mobile navigation"
              initial={reduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mobile-menu-heading">Menu</div>
              {NAV_ITEMS.map(renderLink)}
              {authLinks.length ? <span className="nav-divider mobile-nav-divider" aria-hidden="true" /> : null}
              {authLinks.map(renderLink)}
              {!loading && isAuthenticated ? (
                <button type="button" className="nav-link nav-link-ghost" onClick={handleLogout}>
                  <span>Logout</span>
                </button>
              ) : null}
              {loading ? (
                <span className="nav-link nav-link-loading"><span>Loading...</span></span>
              ) : null}
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

