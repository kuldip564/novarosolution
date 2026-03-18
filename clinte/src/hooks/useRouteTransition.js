import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLocation } from 'react-router-dom';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function useRouteTransition() {
  const shellRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (!shellRef.current) return undefined;

    const shell = shellRef.current;

    if (prefersReducedMotion()) {
      gsap.set(shell, {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        clearProps: 'opacity,transform,visibility,filter',
      });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        shell,
        {
          autoAlpha: 0,
          y: 16,
          filter: 'blur(4px)',
        },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.7,
          ease: 'power3.out',
          overwrite: 'auto',
          clearProps: 'opacity,transform,visibility,filter',
        },
      );
    }, shell);

    return () => ctx.revert();
  }, [location.pathname]);

  return shellRef;
}
