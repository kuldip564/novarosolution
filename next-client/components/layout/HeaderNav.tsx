'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' }
];

export default function HeaderNav() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <nav className="nav" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => {
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
      })}
    </nav>
  );
}

