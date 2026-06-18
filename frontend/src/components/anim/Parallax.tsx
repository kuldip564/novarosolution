"use client";

import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { memo, type ReactNode } from "react";
import { useHydratedScroll } from "@/lib/use-hydrated-scroll";

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
  const reduced = useReducedMotion();

  const { ref, scrollYProgress } = useHydratedScroll({
    offset: ["start end", "end start"],
    enabled: !reduced,
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
