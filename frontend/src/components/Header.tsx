"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/Button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { navLinks } from "@/lib/site-data";
import { subscribeScroll } from "@/lib/scroll-store";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`site-header ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}
      >
        <div className="wrap nav">
          <BrandLogo
            href="/"
            iconSize={30}
            className="brand-header"
            onClick={() => setMenuOpen(false)}
          />

          <nav className="nav-links" aria-label="Primary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? "active" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nav-actions">
            <ThemeToggle />
            <Button href="/contact" className="nav-cta">
              Start a project
            </Button>
          </div>

          <div className="nav-mobile-actions">
            <ThemeToggle />
            <button
              type="button"
              className={`burger ${menuOpen ? "open" : ""}`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <button
        type="button"
        className={`mobile-menu-backdrop ${menuOpen ? "open" : ""}`}
        aria-label="Close menu"
        onClick={() => setMenuOpen(false)}
      />

      <div
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu-inner">
          <div className="mobile-menu-head">
            <BrandLogo
              href="/"
              iconSize={34}
              className="brand-header"
              onClick={() => setMenuOpen(false)}
            />
            <p>Software · Intelligence · Growth</p>
          </div>

          <nav className="mobile-menu-nav" aria-label="Mobile">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? "active" : undefined}
                style={{ animationDelay: `${index * 45}ms` }}
                onClick={() => setMenuOpen(false)}
              >
                <span className="mobile-menu-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mobile-menu-foot">
            <Button href="/contact" onClick={() => setMenuOpen(false)}>
              Start a project
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
