"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useForm, type FieldValues, type UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { apiFetch } from "@/lib/api";
import { ConfirmDialog } from "./ConfirmDialog";
import { useAdminToast } from "./AdminToast";

type Row = {
  id: string;
  order: number;
  published: boolean;
  [key: string]: unknown;
};

type AdminCrudPageProps<T extends z.ZodTypeAny> = {
  title: string;
  subtitle: string;
  endpoint: string;
  schema: T;
  defaultValues: z.infer<T>;
  columns: Array<{ key: string; label: string }>;
  renderFields: (form: UseFormReturn<FieldValues>) => ReactNode;
  wideDrawer?: boolean;
  mapRowToForm?: (row: Row) => FieldValues;
  renderThumb?: (row: Row) => ReactNode;
};

export function AdminCrudPage<T extends z.ZodTypeAny>({
  title,
  subtitle,
  endpoint,
  schema,
  defaultValues,
  columns,
  renderFields,
  wideDrawer = false,
  mapRowToForm,
  renderThumb,
}: AdminCrudPageProps<T>) {
  const { push } = useAdminToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);

  const form = useForm<FieldValues>({
    defaultValues: defaultValues as FieldValues,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/admin/${endpoint}`);
      const json = (await res.json()) as { data?: Row[] };
      setRows(json.data ?? []);
    } catch {
      push("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, [endpoint, push]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await apiFetch(`/api/admin/${endpoint}`);
        if (cancelled) return;
        const json = (await res.json()) as { data?: Row[] };
        setRows(json.data ?? []);
      } catch {
        if (!cancelled) push("Failed to load data", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [endpoint, push]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      JSON.stringify(row).toLowerCase().includes(q),
    );
  }, [query, rows]);

  function openCreate() {
    setEditing(null);
    form.reset(defaultValues as FieldValues);
    setDrawerOpen(true);
  }

  function openEdit(row: Row) {
    setEditing(row);
    form.reset(mapRowToForm ? mapRowToForm(row) : (row as FieldValues));
    setDrawerOpen(true);
  }

  async function onSubmit(values: FieldValues) {
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      push("Please check the form fields", "error");
      return;
    }

    try {
      const res = await apiFetch(
        editing ? `/api/admin/${endpoint}/${editing.id}` : `/api/admin/${endpoint}`,
        {
          method: editing ? "PUT" : "POST",
          body: JSON.stringify(parsed.data),
        },
      );
      if (!res.ok) throw new Error("Save failed");
      push(editing ? "Updated" : "Created");
      setDrawerOpen(false);
      await load();
    } catch {
      push("Could not save", "error");
    }
  }

  async function togglePublished(row: Row) {
    try {
      await apiFetch(`/api/admin/${endpoint}/${row.id}/published`, {
        method: "PATCH",
        body: JSON.stringify({ published: !row.published }),
      });
      setRows((prev) =>
        prev.map((item) =>
          item.id === row.id ? { ...item, published: !row.published } : item,
        ),
      );
    } catch {
      push("Could not update publish state", "error");
    }
  }

  async function moveRow(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= rows.length) return;
    const ids = [...rows];
    const [item] = ids.splice(index, 1);
    ids.splice(nextIndex, 0, item);
    setRows(ids);
    try {
      await apiFetch(`/api/admin/${endpoint}/reorder`, {
        method: "PUT",
        body: JSON.stringify({ ids: ids.map((row) => row.id) }),
      });
    } catch {
      push("Reorder failed", "error");
      await load();
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await apiFetch(`/api/admin/${endpoint}/${deleteTarget.id}`, {
        method: "DELETE",
      });
      push("Deleted");
      setDeleteTarget(null);
      await load();
    } catch {
      push("Delete failed", "error");
    }
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <button type="button" className="admin-btn" onClick={openCreate}>
          Add new
        </button>
      </div>

      <div className="admin-toolbar">
        <input
          type="search"
          placeholder="Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="admin-toolbar-count">
          {loading ? "…" : `${filtered.length} item${filtered.length === 1 ? "" : "s"}`}
        </span>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-skeleton-table">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="admin-skeleton-row" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">No items yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                {renderThumb && <th>Preview</th>}
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th>Published</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, index) => (
                <tr key={row.id}>
                  <td className="admin-order-cell">
                    <button type="button" onClick={() => moveRow(index, -1)}>
                      ↑
                    </button>
                    <button type="button" onClick={() => moveRow(index, 1)}>
                      ↓
                    </button>
                  </td>
                  {renderThumb && <td className="admin-thumb-cell">{renderThumb(row)}</td>}
                  {columns.map((col) => (
                    <td key={col.key}>{String(row[col.key] ?? "")}</td>
                  ))}
                  <td>
                    <button
                      type="button"
                      className={`admin-pill ${row.published ? "on" : ""}`}
                      onClick={() => togglePublished(row)}
                    >
                      {row.published ? "Live" : "Draft"}
                    </button>
                  </td>
                  <td className="admin-row-actions">
                    <button type="button" className="admin-btn ghost" onClick={() => openEdit(row)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn danger"
                      onClick={() => setDeleteTarget(row)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {drawerOpen && (
        <div className="admin-drawer-backdrop" onClick={() => setDrawerOpen(false)}>
          <aside className={`admin-drawer ${wideDrawer ? "wide" : ""}`} onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? "Edit" : "Create"} {title}</h2>
            <form className="admin-form" onSubmit={form.handleSubmit(onSubmit)}>
              {renderFields(form)}
              <div className="admin-drawer-actions">
                <button type="button" className="admin-btn ghost" onClick={() => setDrawerOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn">
                  Save
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete item?"
        message="This cannot be undone."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
