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
  const [bootError, setBootError] = useState("");

  useEffect(() => {
    let cancelled = false;

    apiFetch("/api/admin/me")
      .then(async (res) => {
        if (cancelled) return;

        if (res.status === 0 || res.status >= 500) {
          setBootError(
            "Cannot reach the API. Run `npm run dev` from the repo root so the backend starts on port 5001.",
          );
          setReady(true);
          return;
        }

        if (res.status === 401) {
          router.replace("/admin/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Unable to verify admin session");
        }

        const data = (await res.json()) as { user?: { email?: string } };
        setEmail(data.user?.email ?? null);
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) router.replace("/admin/login");
      });

    return () => {
      cancelled = true;
    };
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

  if (bootError) {
    return (
      <div className="admin-auth">
        <div className="admin-auth-card">
          <p className="admin-eyebrow">Novaro Admin</p>
          <h1>API unavailable</h1>
          <p className="admin-lede">{bootError}</p>
          <button
            type="button"
            className="admin-btn"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
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
