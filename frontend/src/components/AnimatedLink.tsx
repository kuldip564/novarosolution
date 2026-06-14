"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type AnimatedLinkProps = ComponentProps<typeof Link> & {
  children: ReactNode;
};

export function AnimatedLink({ className = "", children, ...props }: AnimatedLinkProps) {
  return (
    <Link className={`animated-link ${className}`.trim()} {...props}>
      <span className="animated-link-text">{children}</span>
    </Link>
  );
}
