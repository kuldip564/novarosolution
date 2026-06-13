"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { apiFetch } from "@/lib/api";
import { AdminNav } from "./AdminNav";
import { AdminToastProvider } from "./AdminToast";

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    apiFetch("/api/admin/me")
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        const data = (await res.json()) as { user?: { email?: string } };
        setEmail(data.user?.email ?? null);
        setReady(true);
      })
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  async function logout() {
    await apiFetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  if (!ready) {
    return (
      <div className="admin-shell admin-loading">
        <div className="admin-skeleton-sidebar" />
        <div className="admin-skeleton-main" />
      </div>
    );
  }

  return (
    <AdminToastProvider>
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <BrandLogo
            href="/admin"
            iconSize={32}
            name="Novaro"
            tagline="ADMIN"
            label="Novaro Admin dashboard"
            className="admin-brand-lockup"
          />
          <AdminNav />
        </aside>
        <div className="admin-main-wrap">
          <header className="admin-topbar">
            <div className="admin-topbar-meta">
              <span className="admin-eyebrow">Control center</span>
              <p>{email}</p>
            </div>
            <button type="button" className="admin-btn ghost" onClick={logout}>
              Log out
            </button>
          </header>
          <main className="admin-main">{children}</main>
        </div>
      </div>
    </AdminToastProvider>
  );
}
