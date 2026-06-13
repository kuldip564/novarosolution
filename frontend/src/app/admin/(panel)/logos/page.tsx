"use client";

import { z } from "zod";
import { AdminAssetThumb, getRowAsset } from "@/components/admin/AdminAssetThumb";
import { AdminCrudPage } from "@/components/admin/AdminCrudPage";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { CloudinaryAsset } from "@/lib/media";
import { cloudinaryAssetFormSchema, cloudinaryAssetDefault } from "@/lib/media-schemas";
import { normalizeServiceImage } from "@/lib/service-form";

const schema = z.object({
  name: z.string().min(1),
  image: cloudinaryAssetFormSchema,
  published: z.boolean().default(true),
});

const defaults = {
  name: "",
  image: cloudinaryAssetDefault as CloudinaryAsset | null,
  published: true,
};

function mapRowToForm(row: Record<string, unknown>) {
  return {
    name: String(row.name ?? ""),
    image: normalizeServiceImage(row.image),
    published: Boolean(row.published ?? true),
  };
}

export default function AdminLogosPage() {
  return (
    <AdminCrudPage
      title="Client logos"
      subtitle="Logo strip and trust badges — PNG/SVG on transparent background works best."
      endpoint="logos"
      schema={schema}
      defaultValues={defaults}
      mapRowToForm={mapRowToForm}
      renderThumb={(row) => (
        <AdminAssetThumb asset={getRowAsset(row, ["image"])} alt={String(row.name ?? "")} />
      )}
      columns={[{ key: "name", label: "Client" }]}
      renderFields={(form) => (
        <>
          <fieldset className="admin-form-section">
            <legend>Client</legend>
            <label className="admin-field">
              <span>Client name</span>
              <input {...form.register("name")} />
            </label>
            <label className="admin-field admin-checkbox">
              <input type="checkbox" {...form.register("published")} />
              <span>Published on site</span>
            </label>
          </fieldset>
          <fieldset className="admin-form-section">
            <legend>Logo</legend>
            <ImageUpload
              label="Logo image"
              value={form.watch("image") as CloudinaryAsset | null}
              onChange={(asset) => form.setValue("image", asset)}
            />
          </fieldset>
        </>
      )}
    />
  );
}
