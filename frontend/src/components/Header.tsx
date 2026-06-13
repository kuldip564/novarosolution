"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NMark } from "@/components/NMark";
import { navLinks } from "@/lib/site-data";
import { subscribeScroll } from "@/lib/scroll-store";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;

    let scrolled = header.classList.contains("scrolled");

    return subscribeScroll((scrollY) => {
      const next = scrollY > 30;
      if (next === scrolled) return;
      scrolled = next;
      header.classList.toggle("scrolled", next);
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="site-header">
        <div className="wrap nav">
          <Link href="/" className="brand" aria-label="Novaro Solution home">
            <NMark />
            <span className="txt">
              <span className="nm">Novaro</span>
              <span className="sl">SOLUTION</span>
            </span>
          </Link>

          <nav className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? "active" : ""}
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

          <button
            type="button"
            className={`burger ${menuOpen ? "open" : ""}`}
            aria-label="Menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <ThemeToggle variant="menu" />
        <Button href="/contact" onClick={() => setMenuOpen(false)}>
          Start a project
        </Button>
      </div>
    </>
  );
}
