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
    let rafId = 0;
    let scrollHeightRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    const updateRange = () => {
      scrollHeightRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    const runMeasure = () => {
      rafId = 0;
      const y = window.scrollY;
      const nextProgress = Math.min(1, Math.max(0, y / scrollHeightRange));
      setScrollY(y);
      setProgress(nextProgress);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(runMeasure);
    };

    const onResize = () => {
      updateRange();
      onScroll();
    };

    const observer = new ResizeObserver(() => {
      updateRange();
      onScroll();
    });
    observer.observe(document.documentElement);

    updateRange();
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
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

