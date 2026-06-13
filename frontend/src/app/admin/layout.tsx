import type { Metadata } from "next";
import type { ReactNode } from "react";
import { rootMetadata } from "@/lib/site-metadata";
import "@/styles/admin.css";

export const metadata: Metadata = {
  ...rootMetadata,
  title: {
    default: "Admin — Novaro Solution",
    template: "%s — Novaro Admin",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="admin-root">{children}</div>;
}
