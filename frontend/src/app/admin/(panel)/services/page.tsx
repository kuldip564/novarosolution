"use client";

import { z } from "zod";
import { AdminAssetThumb, getRowAsset } from "@/components/admin/AdminAssetThumb";
import { AdminCrudPage } from "@/components/admin/AdminCrudPage";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { StringListEditor } from "@/components/admin/StringListEditor";
import type { CloudinaryAsset } from "@/lib/media";
import { cloudinaryAssetFormSchema, cloudinaryAssetDefault } from "@/lib/media-schemas";
import { SEO_MAX_SLUG_LENGTH } from "@/lib/slug";
import {
  normalizeServiceImage,
  normalizeStringList,
  SERVICE_ICON_OPTIONS,
  slugifyTitle,
} from "@/lib/service-form";

const trimmedList = z
  .array(z.string())
  .default([])
  .transform((items) => items.map((item) => item.trim()).filter(Boolean));

const schema = z.object({
  slug: z.string().trim().min(1).max(SEO_MAX_SLUG_LENGTH),
  name: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  shortDescription: z.string().optional().nullable(),
  bullets: trimmedList,
  tags: trimmedList,
  icon: z.string().optional().nullable(),
  image: cloudinaryAssetFormSchema,
  imageAlt: z.string().optional().nullable(),
  published: z.boolean().default(true),
});

const defaults = {
  slug: "",
  name: "",
  title: "",
  description: "",
  shortDescription: "",
  bullets: [] as string[],
  tags: [] as string[],
  icon: "monitor",
  image: cloudinaryAssetDefault as CloudinaryAsset | null,
  imageAlt: "",
  published: true,
};

function mapRowToForm(row: Record<string, unknown>) {
  return {
    slug: String(row.slug ?? ""),
    name: String(row.name ?? row.title ?? ""),
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    shortDescription: String(row.shortDescription ?? ""),
    bullets: normalizeStringList(row.bullets),
    tags: normalizeStringList(row.tags),
    icon: String(row.icon ?? "monitor"),
    image: normalizeServiceImage(row.image),
    imageAlt: String(row.imageAlt ?? ""),
    published: Boolean(row.published ?? true),
  };
}

export default function AdminServicesPage() {
  return (
    <AdminCrudPage
      title="Services"
      subtitle="Manage service cards, detail rows, images, and tags — synced to Home and Services pages."
      endpoint="services"
      schema={schema}
      defaultValues={defaults}
      wideDrawer
      mapRowToForm={mapRowToForm}
      renderThumb={(row) => (
        <AdminAssetThumb asset={getRowAsset(row, ["image"])} alt={String(row.title ?? "")} />
      )}
      columns={[
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug" },
      ]}
      renderFields={(form) => {
        const bullets = (form.watch("bullets") as string[]) ?? [];
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
                    const title = e.target.value;
                    if (!form.getValues("name")?.trim()) {
                      form.setValue("name", title);
                    }
                    if (!form.getValues("slug")?.trim()) {
                      form.setValue("slug", slugifyTitle(title));
                    }
                  }}
                />
              </label>
              <label className="admin-field">
                <span>Internal name</span>
                <input {...form.register("name")} />
              </label>
              <label className="admin-field">
                <span>Slug</span>
                <input {...form.register("slug")} maxLength={SEO_MAX_SLUG_LENGTH} placeholder="web-app-eng" />
              </label>
              <label className="admin-field">
                <span>Short description (home cards)</span>
                <textarea {...form.register("shortDescription")} rows={2} />
              </label>
              <label className="admin-field admin-checkbox">
                <input type="checkbox" {...form.register("published")} />
                <span>Published on public site</span>
              </label>
            </fieldset>

            <fieldset className="admin-form-section">
              <legend>Detail content</legend>
              <label className="admin-field">
                <span>Full description (Services page)</span>
                <textarea {...form.register("description")} rows={5} />
              </label>
              <StringListEditor
                label="Bullet points"
                hint="Shown as a list under each service row on /services."
                value={bullets}
                onChange={(items) => form.setValue("bullets", items)}
                placeholder="e.g. Next.js + Node delivery"
                addLabel="+ Add bullet"
              />
            </fieldset>

            <fieldset className="admin-form-section">
              <legend>Media</legend>
              <ImageUpload
                label="Service image"
                value={form.watch("image") as CloudinaryAsset | null}
                onChange={(asset) => form.setValue("image", asset)}
              />
              <p className="admin-field-hint">
                Recommended 4:3 or 16:10 · appears on the Services page with parallax frame.
              </p>
              <label className="admin-field">
                <span>Image alt text</span>
                <input {...form.register("imageAlt")} placeholder="Dashboard preview for Web Apps" />
              </label>
            </fieldset>

            <fieldset className="admin-form-section">
              <legend>Home card settings</legend>
              <label className="admin-field">
                <span>Icon</span>
                <select {...form.register("icon")}>
                  {SERVICE_ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <StringListEditor
                label="Tags (Tools & stack on Services page)"
                hint="Shown as tool pills on the cinematic Services page and on home cards."
                value={tags}
                onChange={(items) => form.setValue("tags", items)}
                placeholder="Next.js"
                addLabel="+ Add tag"
              />
            </fieldset>
          </>
        );
      }}
    />
  );
}
