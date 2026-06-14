"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/Button";
import { NMark } from "@/components/NMark";
import { useMotionSettings } from "@/lib/motion-provider";

function ErrorPageContent() {
  return (
    <>
      <NMark size={72} className="error-page-mark" />
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p className="lede">
        The page you are looking for moved, never existed, or is still on the
        roadmap.
      </p>
      <div className="error-page-actions">
        <Button href="/">Back to home</Button>
        <Button href="/contact" variant="ghost">
          Contact us
        </Button>
      </div>
      <nav className="error-page-links" aria-label="Helpful links">
        <Link href="/services" className="animated-link">
          <span className="animated-link-text">Services</span>
        </Link>
        <Link href="/work" className="animated-link">
          <span className="animated-link-text">Work</span>
        </Link>
        <Link href="/blog" className="animated-link">
          <span className="animated-link-text">Blog</span>
        </Link>
      </nav>
    </>
  );
}

export function NotFoundPage() {
  const { reducedMotion } = useMotionSettings();

  return (
    <main className="error-page">
      {reducedMotion ? (
        <div className="wrap error-page-inner">
          <ErrorPageContent />
        </div>
      ) : (
        <motion.div
          className="wrap error-page-inner"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 0.84, 0.36, 1] }}
        >
          <ErrorPageContent />
        </motion.div>
      )}
    </main>
  );
}
