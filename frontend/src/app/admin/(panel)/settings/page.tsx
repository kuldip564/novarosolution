"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAdminToast } from "@/components/admin/AdminToast";

export default function AdminSettingsPage() {
  const { push } = useAdminToast();
  const [adminEmail, setAdminEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    apiFetch("/api/admin/settings")
      .then(async (res) => {
        const json = (await res.json()) as { data?: { adminEmail?: string } };
        setAdminEmail(json.data?.adminEmail ?? "");
      })
      .catch(() => undefined);
  }, []);

  async function syncFromEnv(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await apiFetch("/api/admin/settings/sync-admin", { method: "POST" });
      if (!res.ok) throw new Error("Sync failed");
      push("Admin credentials synced from backend/.env");
    } catch {
      push("Sync failed", "error");
    }
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await apiFetch("/api/admin/settings/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed");
      push("Password updated");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      push(err instanceof Error ? err.message : "Password change failed", "error");
    }
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Settings</h1>
          <p>Admin credentials and environment configuration.</p>
        </div>
      </div>

      <section className="admin-panel">
        <h2>Environment credentials</h2>
        <p className="admin-muted">
          Primary admin login is controlled by <code>ADMIN_EMAIL</code> and{" "}
          <code>ADMIN_PASSWORD</code> in <code>backend/.env</code>. The server
          syncs these on every startup.
        </p>
        <p>
          <strong>Current admin email:</strong> {adminEmail || "—"}
        </p>
        <form onSubmit={syncFromEnv}>
          <button type="submit" className="admin-btn ghost">
            Re-sync from .env now
          </button>
        </form>
      </section>

      <section className="admin-panel">
        <h2>Change password (database)</h2>
        <p className="admin-muted">
          Updates the stored hash immediately. Restarting the backend will reset
          to the env password unless you also update <code>ADMIN_PASSWORD</code>.
        </p>
        <form className="admin-form narrow" onSubmit={changePassword}>
          <label className="admin-field">
            <span>Current password</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </label>
          <label className="admin-field">
            <span>New password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
          </label>
          <button type="submit" className="admin-btn">
            Update password
          </button>
        </form>
      </section>
    </>
  );
}
