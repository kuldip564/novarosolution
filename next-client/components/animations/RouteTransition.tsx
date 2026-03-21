'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export default function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div key={pathname} className="route-transition-wrap">
        <motion.div
          className="route-transition-sheen"
          initial={{ x: '-120%', opacity: 0 }}
          animate={{ x: '220%', opacity: [0, 1, 0] }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          initial={{ opacity: 0.55, y: 8, scale: 0.995, filter: 'blur(2px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0.75, y: -6, scale: 0.997, filter: 'blur(1px)' }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

