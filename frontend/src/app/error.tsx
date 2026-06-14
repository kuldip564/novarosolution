"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/Button";
import { NMark } from "@/components/NMark";
import { useMotionSettings } from "@/lib/motion-provider";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

function ErrorPageContent({ reset }: { reset: () => void }) {
  return (
    <>
      <NMark size={72} className="error-page-mark" />
      <p className="eyebrow">500</p>
      <h1>Something went wrong</h1>
      <p className="lede">
        We hit an unexpected error. Try again, or head back to a stable page
        while we look into it.
      </p>
      <div className="error-page-actions">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <Button href="/" variant="ghost">
          Back to home
        </Button>
      </div>
      <nav className="error-page-links" aria-label="Helpful links">
        <Link href="/contact" className="animated-link">
          <span className="animated-link-text">Contact support</span>
        </Link>
        <Link href="/blog" className="animated-link">
          <span className="animated-link-text">Read the blog</span>
        </Link>
      </nav>
    </>
  );
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const { reducedMotion } = useMotionSettings();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="error-page">
      {reducedMotion ? (
        <div className="wrap error-page-inner">
          <ErrorPageContent reset={reset} />
        </div>
      ) : (
        <motion.div
          className="wrap error-page-inner"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 0.84, 0.36, 1] }}
        >
          <ErrorPageContent reset={reset} />
        </motion.div>
      )}
    </main>
  );
}
