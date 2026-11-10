import type { Metadata } from "next";
import { NotFoundPage } from "@/components/pages/NotFoundPage";

export const metadata: Metadata = {
  title: { absolute: "Page not found — Novaro Solution" },
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundPage />;
}
