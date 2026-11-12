"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AnalyticsListener } from "@/components/analytics/AnalyticsListener";
import { ScrollProgressBar } from "@/components/anim/ScrollProgressBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { ToastProvider } from "@/components/ui/Toast";
import { MotionProvider, useMotionSettings } from "@/lib/motion-provider";
import { useAfterLoad } from "@/lib/use-after-load";

const SiteBackground = dynamic(
  () =>
    import("@/components/site/SiteBackground3D").then((mod) => ({
      default: mod.SiteBackground3D,
    })),
  { ssr: false, loading: () => null },
);

const Cursor = dynamic(
  () => import("@/components/Cursor").then((mod) => mod.Cursor),
  { ssr: false, loading: () => null },
);

/**
 * Decorative WebGL background and custom cursor. They wait for the load event plus an idle
 * moment, so three.js never competes with first paint, hydration or the first interaction.
 */
/** Pages that run their own WebGL scene: the global background stays off there (one canvas per page). */
const OWN_SCENE_PATHS = new Set(["/", "/work"]);

function DesktopEffects({ pathname }: { pathname: string }) {
  const { ready, effectsEnabled } = useMotionSettings();
  const idle = useAfterLoad(ready && effectsEnabled);

  if (!ready || !effectsEnabled || !idle) return null;
  return (
    <>
      {OWN_SCENE_PATHS.has(pathname) ? null : <SiteBackground />}
      <Cursor />
    </>
  );
}

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <MotionProvider>
      <ToastProvider>
        <SeoJsonLd />
        <AnalyticsListener />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ScrollProgressBar />
        <DesktopEffects pathname={pathname} />
        <Header />
        <div className="page" id="main-content" tabIndex={-1}>
          {children}
        </div>
        <Footer />
      </ToastProvider>
    </MotionProvider>
  );
}
