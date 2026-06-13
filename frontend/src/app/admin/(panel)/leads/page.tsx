"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAdminToast } from "@/components/admin/AdminToast";

type Lead = {
  id: string;
  name: string;
  email: string;
  services: string[];
  budget: string | null;
  message: string;
  status: "NEW" | "READ" | "ARCHIVED";
  createdAt: string;
};

const filters = ["ALL", "NEW", "READ", "ARCHIVED"] as const;

export default function AdminLeadsPage() {
  const { push } = useAdminToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<(typeof filters)[number]>("ALL");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const query = filter === "ALL" ? "" : `?status=${filter}`;
        const res = await apiFetch(`/api/admin/leads${query}`);
        if (cancelled) return;
        const json = (await res.json()) as { data?: Lead[] };
        setLeads(json.data ?? []);
      } catch {
        if (!cancelled) push("Failed to load leads", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filter, push]);

  const counts = useMemo(
    () => ({
      new: leads.filter((l) => l.status === "NEW").length,
    }),
    [leads],
  );

  async function setStatus(id: string, status: Lead["status"]) {
    try {
      await apiFetch(`/api/admin/leads/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
      if (selected?.id === id) setSelected({ ...selected, status });
      push("Status updated");
    } catch {
      push("Could not update status", "error");
    }
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Leads</h1>
          <p>Contact form submissions from the public site.</p>
        </div>
        <a href="/api/admin/leads/export" className="admin-btn ghost">
          Export CSV
        </a>
      </div>

      <div className="admin-toolbar">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            className={`admin-pill ${filter === item ? "on" : ""}`}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
        <span className="admin-muted">{counts.new} new in view</span>
      </div>

      <div className="admin-split">
        <div className="admin-table-wrap">
          {loading ? (
            <div className="admin-empty">Loading…</div>
          ) : leads.length === 0 ? (
            <div className="admin-empty">No leads yet.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className={selected?.id === lead.id ? "selected" : undefined}
                    onClick={() => setSelected(lead)}
                  >
                    <td>{lead.name}</td>
                    <td>{lead.email}</td>
                    <td>{lead.status}</td>
                    <td>{new Date(lead.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <aside className="admin-detail">
          {!selected ? (
            <p className="admin-empty-inline">Select a lead to view details.</p>
          ) : (
            <>
              <h2>{selected.name}</h2>
              <p>{selected.email}</p>
              <p className="admin-muted">{new Date(selected.createdAt).toLocaleString()}</p>
              <p>
                <strong>Services:</strong>{" "}
                {Array.isArray(selected.services) ? selected.services.join(", ") : "—"}
              </p>
              <p>
                <strong>Budget:</strong> {selected.budget || "—"}
              </p>
              <p>{selected.message}</p>
              <div className="admin-detail-actions">
                <button type="button" className="admin-btn ghost" onClick={() => setStatus(selected.id, "READ")}>
                  Mark read
                </button>
                <button type="button" className="admin-btn ghost" onClick={() => setStatus(selected.id, "ARCHIVED")}>
                  Archive
                </button>
                <button type="button" className="admin-btn" onClick={() => setStatus(selected.id, "NEW")}>
                  Mark new
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
}
