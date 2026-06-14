"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { isCoarsePointer } from "@/lib/device";
import { useMotionSettings } from "@/lib/motion-provider";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "ghost";
  className?: string;
  children: ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  magnetic?: boolean;
};

const MotionLink = motion.create(Link);

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Button({
  href,
  variant = "primary",
  className = "",
  children,
  type = "button",
  onClick,
  disabled,
  magnetic = true,
}: ButtonProps) {
  const { reducedMotion, effectsEnabled } = useMotionSettings();
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 22, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 22, mass: 0.4 });

  const classes = `btn btn-${variant} ${className}`.trim();
  const motionEnabled = magnetic && effectsEnabled && !reducedMotion && !isCoarsePointer();

  function onMove(event: MouseEvent) {
    if (!motionEnabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.12);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.12);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  const motionProps = {
    className: classes,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    whileHover: reducedMotion ? undefined : { scale: 1.02 },
    whileTap: reducedMotion ? undefined : { scale: 0.98 },
    style: motionEnabled ? { x: springX, y: springY } : undefined,
  };

  if (href) {
    return (
      <MotionLink href={href} ref={ref as never} {...motionProps} onClick={onClick}>
        {children}
        <ArrowIcon />
      </MotionLink>
    );
  }

  return (
    <motion.button
      ref={ref as never}
      type={type}
      {...motionProps}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      <ArrowIcon />
    </motion.button>
  );
}
