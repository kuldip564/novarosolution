'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { FaMoon, FaSearch, FaSun } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import type { SiteChrome } from '@/lib/siteChrome';
import { DEFAULT_SITE_CHROME } from '@/lib/siteChrome';

type Props = {
  chrome?: SiteChrome;
};

const DESKTOP_BREAKPOINT = 1024;

export default function SiteHeader({ chrome = DEFAULT_SITE_CHROME }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { loading, isAuthenticated, isCreator, isAdmin, isEmployee, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const searchFieldRef = useRef<HTMLInputElement>(null);

  const navItems = chrome.navItems?.length ? chrome.navItems : DEFAULT_SITE_CHROME.navItems;
  const searchPlaceholder = chrome.searchPlaceholder || DEFAULT_SITE_CHROME.searchPlaceholder;

  useEffect(() => {
    const root = document.documentElement;
    const stored = window.localStorage.getItem('novaro_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next = stored === 'dark' || stored === 'light' ? stored : prefersDark ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    setTheme(next);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== '/search') return;
    const params = new URLSearchParams(window.location.search);
    setSearchQuery(params.get('q') || '');
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const t = window.setTimeout(() => searchFieldRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setSearchOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth > DESKTOP_BREAKPOINT) setMenuOpen(false);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    window.localStorage.setItem('novaro_theme', next);
    setTheme(next);
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
      setSearchOpen(false);
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  function openSearch() {
    if (pathname === '/search') {
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get('q') || '');
    }
    setSearchOpen(true);
  }

  function linkClass(isActive: boolean) {
    return `site-header__link${isActive ? ' site-header__link--active' : ''}`;
  }

  function renderNavLink(item: { href: string; label: string }) {
    const isActive =
      pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
    return (
      <Link
        key={item.href}
        href={item.href}
        className={linkClass(isActive)}
        onClick={() => setMenuOpen(false)}
      >
        {isActive && !reduceMotion ? (
          <motion.span
            className="site-header__nav-pill"
            layoutId="site-header-nav-pill"
            transition={{ type: 'spring', stiffness: 420, damping: 38 }}
          />
        ) : null}
        {isActive && reduceMotion ? <span className="site-header__nav-pill" aria-hidden /> : null}
        <span className="site-header__link-text">{item.label}</span>
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
    <header className="site-header">
      <div className="container site-header__bar">
        <Link href="/" className="site-header__brand">
          <span className="site-header__logo" aria-hidden />
          <span className="site-header__titles">
            <span className="site-header__title">{chrome.brandName}</span>
            <span className="site-header__subtitle">{chrome.brandSubtitle}</span>
          </span>
        </Link>

        <div className="site-header__end">
          <div className="site-header__row">
            <nav className="site-header__nav site-header__nav--desktop" aria-label="Main navigation">
              {navItems.map(renderNavLink)}
              {loading ? (
                <span className="site-header__link site-header__link--loading">
                  <span className="site-header__link-text">Loading…</span>
                </span>
              ) : authLinks.length ? (
                <>
                  <span className="site-header__nav-rule" aria-hidden />
                  {authLinks.map(renderNavLink)}
                  {isAuthenticated ? (
                    <button type="button" className="site-header__link site-header__link--logout" onClick={handleLogout}>
                      <span className="site-header__link-text">Logout</span>
                    </button>
                  ) : null}
                </>
              ) : null}
            </nav>

            <div className="site-header__tools">
              <button
                type="button"
                className="site-header__icon-btn"
                aria-label="Open search"
                aria-expanded={searchOpen}
                aria-haspopup="dialog"
                onClick={() => (searchOpen ? setSearchOpen(false) : openSearch())}
              >
                <FaSearch size={14} aria-hidden />
              </button>
              <button type="button" className="site-header__icon-btn" aria-label="Toggle theme" onClick={toggleTheme}>
                {theme === 'dark' ? <FaSun size={15} /> : <FaMoon size={15} />}
              </button>
              <button
                type="button"
                className={`site-header__burger${menuOpen ? ' is-open' : ''}`}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="site-header__backdrop"
              onClick={() => setMenuOpen(false)}
              initial={reduceMotion ? undefined : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
            />
            <motion.nav
              className="site-header__drawer"
              aria-label="Mobile navigation"
              initial={reduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="site-header__drawer-label">Menu</p>
              {navItems.map(renderNavLink)}
              {loading ? (
                <span className="site-header__link site-header__link--loading">
                  <span className="site-header__link-text">Loading…</span>
                </span>
              ) : (
                <>
                  {authLinks.length ? <span className="site-header__drawer-rule" aria-hidden /> : null}
                  {authLinks.map(renderNavLink)}
                  {isAuthenticated ? (
                    <button type="button" className="site-header__link site-header__link--logout" onClick={handleLogout}>
                      <span className="site-header__link-text">Logout</span>
                    </button>
                  ) : null}
                </>
              )}
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen ? (
          <>
            <motion.button
              key="search-backdrop"
              type="button"
              aria-label="Close search"
              className="site-header__search-popover-backdrop"
              onClick={() => setSearchOpen(false)}
              initial={reduceMotion ? undefined : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
            />
            <motion.div
              key="search-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Search"
              className="site-header__search-popover"
              initial={reduceMotion ? undefined : { opacity: 0, y: -10, scale: 0.98 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <form onSubmit={onSearchSubmit} role="search" className="site-header__search-popover-form">
                <label className="site-header__search-popover-label" htmlFor="site-header-search-q">
                  Search the site
                </label>
                <div className="site-header__search-popover-row">
                  <input
                    ref={searchFieldRef}
                    id="site-header-search-q"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    autoComplete="off"
                    aria-label="Search site"
                  />
                  <button type="submit" className="site-header__search-popover-submit">
                    Go
                  </button>
                </div>
                <button type="button" className="site-header__search-popover-cancel" onClick={() => setSearchOpen(false)}>
                  Cancel
                </button>
              </form>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
