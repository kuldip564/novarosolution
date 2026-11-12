"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/Button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useMotionSettings } from "@/lib/motion-provider";
import { navLinks, site } from "@/lib/site-data";
import { subscribeScroll } from "@/lib/scroll-store";

const menuEase = [0.16, 0.84, 0.36, 1] as const;

/** Pages whose hero starts at the very top: the header is transparent there until the page scrolls. */
const OVER_HERO_PATHS = new Set(["/", "/work"]);

const navContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.045, delayChildren: 0.06 },
  },
  exit: {
    transition: { staggerChildren: 0.028, staggerDirection: -1 },
  },
};

const navLinkVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: menuEase },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] as const },
  },
};

export function Header() {
  const pathname = usePathname();
  const lenis = useLenis();
  const { reducedMotion } = useMotionSettings();
  // The menu is open only on the page it was opened on: navigating closes it, no effect needed.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const setMenuOpen = (next: boolean | ((open: boolean) => boolean)) =>
    setMenuPath((current) => {
      const open = typeof next === "function" ? next(current === pathname) : next;
      return open ? pathname : null;
    });
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const scrollLockY = useRef(0);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;

    let isScrolled = header.classList.contains("scrolled");

    return subscribeScroll((scrollY) => {
      const next = scrollY > 24;
      if (next === isScrolled) return;
      isScrolled = next;
      setScrolled(next);
      header.classList.toggle("scrolled", next);
    });
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    scrollLockY.current = window.scrollY;
    const { style } = document.body;
    style.overflow = "hidden";
    style.position = "fixed";
    style.top = `-${scrollLockY.current}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";

    return () => {
      style.overflow = "";
      style.position = "";
      style.top = "";
      style.left = "";
      style.right = "";
      style.width = "";
      window.scrollTo(0, scrollLockY.current);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!lenis) return;
    if (menuOpen) lenis.stop();
    else lenis.start();
  }, [lenis, menuOpen]);

  useEffect(() => {
    if (!menuOpen || !menuRef.current) return;

    const focusable = menuRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusable[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuPath(null);
        burgerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`site-header ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""} ${OVER_HERO_PATHS.has(pathname) ? "site-header--over-hero" : ""}`}
      >
        <div className="wrap nav">
          <BrandLogo
            href="/"
            iconSize={30}
            className="brand-header"
            onClick={closeMenu}
          />

          <nav className="nav-links" aria-label="Primary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`animated-link ${pathname === link.href ? "active" : ""}`.trim()}
              >
                <span className="animated-link-text">{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="nav-actions">
            <ThemeToggle />
            <Button href="/contact" className="nav-cta">
              Start Your Project
            </Button>
          </div>

          <div className="nav-mobile-actions">
            <ThemeToggle />
            <button
              ref={burgerRef}
              type="button"
              className={`burger ${menuOpen ? "open" : ""}`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu-panel"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="burger-line" aria-hidden="true" />
              <span className="burger-line" aria-hidden="true" />
              <span className="burger-line" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {menuOpen ? (
          <div key="mobile-menu-layer" className="mobile-menu-layer">
            <motion.button
              type="button"
              className="mobile-menu-backdrop"
              aria-label="Close menu"
              onClick={closeMenu}
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.28, ease: menuEase }}
            />

            <motion.div
              id="mobile-menu-panel"
              ref={menuRef}
              className="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.24, ease: menuEase }}
            >
              <div className="mobile-menu-inner">
                <motion.nav
                  className="mobile-menu-nav"
                  aria-label="Mobile"
                  variants={reducedMotion ? undefined : navContainerVariants}
                  initial={reducedMotion ? false : "hidden"}
                  animate={reducedMotion ? undefined : "visible"}
                  exit={reducedMotion ? undefined : "exit"}
                >
                  {navLinks.map((link, index) => {
                    const current = pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`));
                    return (
                      <motion.div
                        key={link.href}
                        custom={index}
                        variants={reducedMotion ? undefined : navLinkVariants}
                      >
                        <Link
                          href={link.href}
                          className={`mobile-menu-link${current ? " active" : ""}`}
                          aria-current={current ? "page" : undefined}
                          onClick={closeMenu}
                        >
                          <span className="mobile-menu-link__num" aria-hidden="true">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="mobile-menu-link__label">{link.label}</span>
                          <ArrowUpRight className="mobile-menu-link__go" size={20} aria-hidden="true" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.nav>

                <motion.div
                  className="mobile-menu-contact"
                  initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: 8 }}
                  transition={{ delay: reducedMotion ? 0 : 0.22, duration: 0.26, ease: menuEase }}
                >
                  <p className="mobile-menu-contact__label">Talk to us</p>
                  <a href={`mailto:${site.email}`} className="mobile-menu-contact__link">
                    <Mail size={16} aria-hidden="true" />
                    {site.email}
                  </a>
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="mobile-menu-contact__link">
                    <Phone size={16} aria-hidden="true" />
                    {site.phone}
                  </a>
                </motion.div>

                <motion.div
                  className="mobile-menu-foot"
                  initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: 8 }}
                  transition={{
                    delay: reducedMotion ? 0 : 0.28,
                    duration: 0.26,
                    ease: menuEase,
                  }}
                >
                  <ThemeToggle variant="menu" />
                  <Button href="/contact" onClick={closeMenu}>
                    Start Your Project
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
