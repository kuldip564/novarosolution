import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocation } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function collectRevealTargets(root) {
  root.querySelectorAll('.js-reveal').forEach((item) => item.classList.add('scroll-reveal'));
  const explicitTargets = Array.from(root.querySelectorAll('.scroll-reveal'));

  if (explicitTargets.length > 0) return explicitTargets;

  const fallbackTargets = Array.from(root.querySelectorAll('section'));
  fallbackTargets.forEach((item) => item.classList.add('scroll-reveal'));
  return fallbackTargets;
}

export default function usePageReveal() {
  const rootRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (!rootRef.current) return undefined;

    const root = rootRef.current;
    const targets = collectRevealTargets(root);
    if (targets.length === 0) return undefined;

    if (prefersReducedMotion()) {
      gsap.set(targets, {
        opacity: 1,
        y: 0,
        clearProps: 'opacity,transform',
      });
      return undefined;
    }

    const ctx = gsap.context(() => {
      targets.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            overwrite: 'auto',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              once: true,
            },
          },
        );
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [location.pathname]);

  return rootRef;
}

