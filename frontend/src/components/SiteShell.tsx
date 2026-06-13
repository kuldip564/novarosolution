"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SvgDefs } from "@/components/SvgDefs";
import { MotionProvider } from "@/lib/motion-provider";

const Bgfx = dynamic(() => import("@/components/bgfx"), {
  ssr: false,
  loading: () => null,
});

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
      <SvgDefs />
      <Bgfx />
      <Cursor />
      <Header />
      <div className="page">{children}</div>
      <Footer />
    </MotionProvider>
  );
}
