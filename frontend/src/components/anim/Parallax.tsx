"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { memo, useRef, type ReactNode } from "react";

type ParallaxProps = {
  children?: ReactNode;
  speed?: number;
  className?: string;
};

function ParallaxComponent({
  children,
  speed = 0.15,
  className = "",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const range = speed * 160;
  const y: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 1],
    [range, -range],
  );

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y,
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
}

export const Parallax = memo(ParallaxComponent);
