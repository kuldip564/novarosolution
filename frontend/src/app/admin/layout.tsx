import type { ReactNode } from "react";
import "@/styles/admin.css";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="admin-root">{children}</div>;
}
