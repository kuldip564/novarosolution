'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaArrowUp, FaEnvelope, FaFolderOpen } from 'react-icons/fa';

export default function SiteEnhancements() {
  const reduceMotion = useReducedMotion();
  const [scrollY, setScrollY] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = pageHeight > 0 ? Math.min(1, Math.max(0, y / pageHeight)) : 0;
      setScrollY(y);
      setProgress(nextProgress);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      <div className="scroll-progress-track" aria-hidden="true">
        <motion.span
          className="scroll-progress-fill"
          style={{ transformOrigin: 'left center' }}
          animate={{ scaleX: progress || 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.15, ease: 'easeOut' }}
        />
      </div>

      <div className="quick-dock" aria-label="Quick actions">
        <Link href="/contact" className="quick-dock-btn" aria-label="Contact us">
          <FaEnvelope />
        </Link>
        <Link href="/projects" className="quick-dock-btn" aria-label="View projects">
          <FaFolderOpen />
        </Link>
        <AnimatePresence>
          {scrollY > 260 ? (
            <motion.button
              type="button"
              className="quick-dock-btn"
              aria-label="Back to top"
              onClick={scrollToTop}
              initial={reduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.92 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.92 }}
            >
              <FaArrowUp />
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}

