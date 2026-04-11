'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import type { SiteChrome } from '@/lib/siteChrome';
import { DEFAULT_SITE_CHROME } from '@/lib/siteChrome';

type HeaderNavProps = {
  chrome?: SiteChrome;
};

export default function HeaderNav({ chrome = DEFAULT_SITE_CHROME }: HeaderNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { loading, isAuthenticated, isCreator, isAdmin, isEmployee, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const navItems = chrome.navItems?.length ? chrome.navItems : DEFAULT_SITE_CHROME.navItems;
  const searchPlaceholder = chrome.searchPlaceholder || DEFAULT_SITE_CHROME.searchPlaceholder;

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
    if (pathname !== '/search') return;
    const params = new URLSearchParams(window.location.search);
    setSearchQuery(params.get('q') || '');
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

  function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      router.push('/search');
      setMenuOpen(false);
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setMenuOpen(false);
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
        className="nav nav-desktop nav-shell header-nav-desktop"
        aria-label="Main navigation"
        initial={reduceMotion ? undefined : { opacity: 0, y: -6 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        {navItems.map(renderLink)}
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

      <form className="header-search-form" onSubmit={onSearchSubmit} role="search" aria-label="Site search">
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label="Search site"
        />
      </form>

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
              <form className="header-search-form mobile-search-form" onSubmit={onSearchSubmit} role="search" aria-label="Mobile site search">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  aria-label="Search site"
                />
              </form>
              <div className="mobile-menu-heading">Menu</div>
              {navItems.map(renderLink)}
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

