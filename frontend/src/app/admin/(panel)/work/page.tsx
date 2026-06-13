"use client";

import { z } from "zod";
import { AdminAssetThumb, getRowAsset } from "@/components/admin/AdminAssetThumb";
import { AdminCrudPage } from "@/components/admin/AdminCrudPage";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ImageUploadGallery } from "@/components/admin/ImageUploadGallery";
import { ResultMetricsEditor } from "@/components/admin/ResultMetricsEditor";
import type { CloudinaryAsset } from "@/lib/media";
import { cloudinaryAssetFormSchema, cloudinaryAssetDefault } from "@/lib/media-schemas";
import {
  lines,
  normalizeProjectResults,
  normalizeProjectScreens,
  slugifyTitle,
  type ProjectResultMetric,
} from "@/lib/project-form";

const resultSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

const schema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  hook: z.string().min(1),
  body: z.string().min(1),
  heroTitle: z.string().optional().nullable(),
  heroImage: cloudinaryAssetFormSchema,
  coverClass: z.string().optional().nullable(),
  screens: z.array(z.object({ secureUrl: z.string(), publicId: z.string().nullable() })).default([]),
  results: z.array(resultSchema).default([]),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(true),
});

const defaults = {
  slug: "",
  title: "",
  category: "",
  hook: "",
  body: "",
  heroTitle: "",
  heroImage: cloudinaryAssetDefault as CloudinaryAsset | null,
  coverClass: "c1",
  screens: [] as CloudinaryAsset[],
  results: [] as ProjectResultMetric[],
  tags: [] as string[],
  published: true,
};

const coverOptions = [
  { value: "c1", label: "C1 — electric blue" },
  { value: "c2", label: "C2 — violet" },
  { value: "c3", label: "C3 — cyan" },
  { value: "c4", label: "C4 — indigo" },
];

function mapRowToForm(row: Record<string, unknown>) {
  return {
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    category: String(row.category ?? ""),
    hook: String(row.hook ?? ""),
    body: String(row.body ?? ""),
    heroTitle: (row.heroTitle as string | null) ?? "",
    heroImage: (row.heroImage as CloudinaryAsset | null) ?? null,
    coverClass: String(row.coverClass ?? "c1"),
    screens: normalizeProjectScreens(row.screens),
    results: normalizeProjectResults(row.results),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    published: Boolean(row.published ?? true),
  };
}

export default function AdminWorkPage() {
  return (
    <AdminCrudPage
      title="Work"
      subtitle="Full case study editor — hero, gallery shots, metrics, tags, and publish state."
      endpoint="projects"
      schema={schema}
      defaultValues={defaults}
      wideDrawer
      mapRowToForm={mapRowToForm}
      renderThumb={(row) => (
        <AdminAssetThumb asset={getRowAsset(row, ["heroImage"])} alt={String(row.title ?? "")} />
      )}
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "slug", label: "Slug" },
      ]}
      renderFields={(form) => {
        const screens = (form.watch("screens") as CloudinaryAsset[]) ?? [];
        const results = (form.watch("results") as ProjectResultMetric[]) ?? [];
        const tags = (form.watch("tags") as string[]) ?? [];

        return (
          <>
            <fieldset className="admin-form-section">
              <legend>Basics</legend>
              <label className="admin-field">
                <span>Title</span>
                <input
                  {...form.register("title")}
                  onBlur={(e) => {
                    if (!form.getValues("slug")?.trim()) {
                      form.setValue("slug", slugifyTitle(e.target.value));
                    }
                  }}
                />
              </label>
              <label className="admin-field">
                <span>Slug</span>
                <input {...form.register("slug")} placeholder="finflow" />
              </label>
              <label className="admin-field">
                <span>Category</span>
                <input {...form.register("category")} placeholder="Web App · Fintech" />
              </label>
              <label className="admin-field">
                <span>Hook (short teaser)</span>
                <textarea {...form.register("hook")} rows={2} />
              </label>
              <label className="admin-field">
                <span>Cover gradient (home grid)</span>
                <select {...form.register("coverClass")}>
                  {coverOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-field admin-checkbox">
                <input type="checkbox" {...form.register("published")} />
                <span>Published on public Work page</span>
              </label>
            </fieldset>

            <fieldset className="admin-form-section">
              <legend>Case study story</legend>
              <label className="admin-field">
                <span>Hero title (media overlay)</span>
                <input {...form.register("heroTitle")} placeholder="Project hero — FinFlow" />
              </label>
              <label className="admin-field">
                <span>Full story / body</span>
                <textarea {...form.register("body")} rows={8} />
              </label>
            </fieldset>

            <fieldset className="admin-form-section">
              <legend>Media</legend>
              <ImageUpload
                label="Hero image / video still"
                value={form.watch("heroImage") as CloudinaryAsset | null}
                onChange={(asset) => form.setValue("heroImage", asset)}
              />
              <ImageUploadGallery
                label="Extra screenshots & UI shots"
                value={screens}
                onChange={(assets) => form.setValue("screens", assets)}
              />
            </fieldset>

            <fieldset className="admin-form-section">
              <legend>Results & tags</legend>
              <ResultMetricsEditor
                value={results}
                onChange={(metrics) => form.setValue("results", metrics)}
              />
              <label className="admin-field">
                <span>Tech / service tags (one per line)</span>
                <textarea
                  value={tags.join("\n")}
                  rows={4}
                  onChange={(e) => form.setValue("tags", lines(e.target.value))}
                />
              </label>
            </fieldset>
          </>
        );
      }}
    />
  );
}
