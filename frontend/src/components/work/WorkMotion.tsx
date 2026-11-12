import type { ReactNode } from "react";
import { RevealScope } from "@/components/anim/RevealScope";

/** Scroll reveals for the Work page (`data-wk-reveal`); see RevealScope. */
export function WorkMotion({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <RevealScope attribute="data-wk-reveal" className={className}>
      {children}
    </RevealScope>
  );
}
