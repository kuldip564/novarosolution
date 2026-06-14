"use client";

import { motion } from "framer-motion";
import { useMotionSettings } from "@/lib/motion-provider";

type TemplateProps = {
  children: React.ReactNode;
};

export default function Template({ children }: TemplateProps) {
  const { reducedMotion, effectsEnabled } = useMotionSettings();

  if (reducedMotion || !effectsEnabled) {
    return <>{children}</>;
  }

  return (
    <motion.div
      className="route-shell"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.16, 0.84, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
