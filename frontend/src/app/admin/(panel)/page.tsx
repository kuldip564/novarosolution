"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminModuleGrid } from "@/components/admin/AdminNav";
import { BlogCoverThumb } from "@/components/blog/BlogAuthorMeta";
import { apiFetch } from "@/lib/api";

type DashboardData = {
  counts: {
    projects: number;
    services: number;
    posts: number;
    publishedPosts: number;
    testimonials: number;
    team: number;
    logos: number;
    faqs: number;
    newLeads: number;
    totalLeads: number;
  };
  recentLeads: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
    createdAt: string;
  }>;
  recentPosts: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    coverImage: unknown;
    updatedAt: string;
  }>;
};

const statLinks = [
  { label: "Projects", key: "projects", href: "/admin/work" },
  { label: "Services", key: "services", href: "/admin/services" },
  { label: "Blog posts", key: "posts", href: "/admin/blog" },
  { label: "Published", key: "publishedPosts", href: "/admin/blog" },
  { label: "Team", key: "team", href: "/admin/team" },
  { label: "Leads (new)", key: "newLeads", href: "/admin/leads" },
] as const;

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    apiFetch("/api/admin/dashboard")
      .then(async (res) => {
        const json = (await res.json()) as { data?: DashboardData };
        setData(json.data ?? null);
      })
      .catch(() => setData(null));
  }, []);

  const counts = data?.counts;

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Control center</h1>
          <p>Manage every page, image, blog post, and lead from one premium dashboard.</p>
        </div>
        <div className="admin-quick-actions">
          <Link href="/admin/blog/new" className="admin-btn ghost">
            New blog post
          </Link>
          <Link href="/" className="admin-btn ghost" target="_blank">
            View site
          </Link>
          <Link href="/admin/leads" className="admin-btn">
            Leads inbox
          </Link>
        </div>
      </div>

      <div className="admin-stat-grid admin-stat-grid-wide">
        {statLinks.map(({ label, key, href }) => (
          <Link key={key} href={href} className="admin-stat-card linked">
            <p>{label}</p>
            <strong>{counts?.[key] ?? "—"}</strong>
          </Link>
        ))}
      </div>

      <section className="admin-panel">
        <div className="admin-panel-head">
          <h2>Manage everything</h2>
        </div>
        <AdminModuleGrid />
      </section>

      <div className="admin-split-panels">
        <section className="admin-panel">
          <div className="admin-panel-head">
            <h2>Recent posts</h2>
            <Link href="/admin/blog">All posts</Link>
          </div>
          {!data?.recentPosts?.length ? (
            <p className="admin-empty-inline">No posts yet.</p>
          ) : (
            <div className="admin-recent-list">
              {data.recentPosts.map((post) => (
                <Link key={post.id} href={`/admin/blog/${post.id}`} className="admin-recent-item">
                  <BlogCoverThumb
                    coverImage={post.coverImage}
                    title={post.title}
                    size={56}
                  />
                  <div>
                    <strong>{post.title}</strong>
                    <span className={`admin-status-pill ${post.status.toLowerCase()}`}>
                      {post.status}
                    </span>
                    <p className="admin-muted-inline">
                      Updated {new Date(post.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="admin-panel">
          <div className="admin-panel-head">
            <h2>Recent leads</h2>
            <Link href="/admin/leads">View all</Link>
          </div>
          {!data?.recentLeads?.length ? (
            <p className="admin-empty-inline">No leads yet.</p>
          ) : (
            <table className="admin-table compact">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <strong>{lead.name}</strong>
                      <div className="admin-muted-inline">{lead.email}</div>
                    </td>
                    <td>{lead.status}</td>
                    <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </>
  );
}
