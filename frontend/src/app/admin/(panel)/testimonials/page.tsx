"use client";

import { z } from "zod";
import { AdminAssetThumb, getRowAsset } from "@/components/admin/AdminAssetThumb";
import { AdminCrudPage } from "@/components/admin/AdminCrudPage";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { CloudinaryAsset } from "@/lib/media";
import { cloudinaryAssetFormSchema, cloudinaryAssetDefault } from "@/lib/media-schemas";
import { normalizeServiceImage } from "@/lib/service-form";

const schema = z.object({
  quote: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  avatar: cloudinaryAssetFormSchema,
  rating: z.coerce.number().min(1).max(5).default(5),
  published: z.boolean().default(true),
});

const defaults = {
  quote: "",
  name: "",
  role: "",
  avatar: cloudinaryAssetDefault as CloudinaryAsset | null,
  rating: 5,
  published: true,
};

function mapRowToForm(row: Record<string, unknown>) {
  return {
    quote: String(row.quote ?? ""),
    name: String(row.name ?? ""),
    role: String(row.role ?? ""),
    avatar: normalizeServiceImage(row.avatar),
    rating: Number(row.rating ?? 5),
    published: Boolean(row.published ?? true),
  };
}

export default function AdminTestimonialsPage() {
  return (
    <AdminCrudPage
      title="Testimonials"
      subtitle="Client quotes and avatars for social proof."
      endpoint="testimonials"
      schema={schema}
      defaultValues={defaults}
      wideDrawer
      mapRowToForm={mapRowToForm}
      renderThumb={(row) => (
        <AdminAssetThumb asset={getRowAsset(row, ["avatar"])} alt={String(row.name ?? "")} />
      )}
      columns={[
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
      ]}
      renderFields={(form) => (
        <>
          <fieldset className="admin-form-section">
            <legend>Quote</legend>
            <label className="admin-field">
              <span>Testimonial</span>
              <textarea {...form.register("quote")} rows={5} />
            </label>
            <label className="admin-field admin-checkbox">
              <input type="checkbox" {...form.register("published")} />
              <span>Published on site</span>
            </label>
          </fieldset>
          <fieldset className="admin-form-section">
            <legend>Person</legend>
            <label className="admin-field">
              <span>Name</span>
              <input {...form.register("name")} />
            </label>
            <label className="admin-field">
              <span>Role / company</span>
              <input {...form.register("role")} />
            </label>
            <label className="admin-field">
              <span>Rating (1–5)</span>
              <input type="number" min={1} max={5} {...form.register("rating")} />
            </label>
            <ImageUpload
              label="Avatar"
              value={form.watch("avatar") as CloudinaryAsset | null}
              onChange={(asset) => form.setValue("avatar", asset)}
            />
          </fieldset>
        </>
      )}
    />
  );
}
