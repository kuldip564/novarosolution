"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ScrollProgressBar } from "@/components/anim/ScrollProgressBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { OrganizationJsonLd } from "@/components/OrganizationJsonLd";
import { ToastProvider } from "@/components/ui/Toast";
import { MotionProvider } from "@/lib/motion-provider";

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
        <OrganizationJsonLd />
        <ScrollProgressBar />
        <SiteBackground />
        <Cursor />
        <Header />
        <div className="page">{children}</div>
        <Footer />
      </ToastProvider>
    </MotionProvider>
  );
}
