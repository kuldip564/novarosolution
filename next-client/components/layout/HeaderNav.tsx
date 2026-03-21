'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { isAuthenticated, isCreator, isAdmin, isEmployee, logout } = useAuth();
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

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    window.localStorage.setItem('novaro_theme', nextTheme);
    setTheme(nextTheme);
  }

  function renderLink(item: { href: string; label: string }) {
    const isActive =
      pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
    return (
      <Link key={item.href} href={item.href} className={`nav-link ${isActive ? 'is-active' : ''}`}>
        <span>{item.label}</span>
        {isActive ? (
          <motion.span
            className="nav-active-indicator"
            layoutId={reduceMotion ? undefined : 'nav-active-indicator'}
            transition={{ type: 'spring', stiffness: 480, damping: 38, mass: 0.75 }}
          />
        ) : null}
      </Link>
    );
  }

  return (
    <div className="header-nav-wrap">
      <nav className="nav nav-desktop" aria-label="Main navigation">
        {NAV_ITEMS.map(renderLink)}
        {isAuthenticated ? (
          <>
            {isCreator ? renderLink({ href: '/creator/studio', label: 'Creator Studio' }) : null}
            {isEmployee ? renderLink({ href: '/employee/tasks', label: 'Tasks' }) : null}
            {isAdmin ? renderLink({ href: '/admin/dashboard', label: 'Admin' }) : null}
            {renderLink({ href: '/project-chat', label: 'Project Chat' })}
            {renderLink({ href: '/creator-feed', label: 'Feed' })}
            {renderLink({ href: '/profile', label: 'Profile' })}
            <button type="button" className="nav-link" onClick={logout}>
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            {renderLink({ href: '/login', label: 'Login' })}
            {renderLink({ href: '/register', label: 'Register' })}
          </>
        )}
      </nav>

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
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {NAV_ITEMS.map(renderLink)}
              {isAuthenticated ? (
                <>
                  {isCreator ? renderLink({ href: '/creator/studio', label: 'Creator Studio' }) : null}
                  {isEmployee ? renderLink({ href: '/employee/tasks', label: 'Tasks' }) : null}
                  {isAdmin ? renderLink({ href: '/admin/dashboard', label: 'Admin' }) : null}
                  {renderLink({ href: '/project-chat', label: 'Project Chat' })}
                  {renderLink({ href: '/creator-feed', label: 'Feed' })}
                  {renderLink({ href: '/profile', label: 'Profile' })}
                  <button type="button" className="nav-link" onClick={logout}>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {renderLink({ href: '/login', label: 'Login' })}
                  {renderLink({ href: '/register', label: 'Register' })}
                </>
              )}
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

