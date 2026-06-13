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
  role: z.string().min(1),
  photo: cloudinaryAssetFormSchema,
  published: z.boolean().default(true),
});

const defaults = {
  name: "",
  role: "",
  photo: cloudinaryAssetDefault as CloudinaryAsset | null,
  published: true,
};

function mapRowToForm(row: Record<string, unknown>) {
  return {
    name: String(row.name ?? ""),
    role: String(row.role ?? ""),
    photo: normalizeServiceImage(row.photo),
    published: Boolean(row.published ?? true),
  };
}

export default function AdminTeamPage() {
  return (
    <AdminCrudPage
      title="Team"
      subtitle="Team members on the About page — photo, name, role."
      endpoint="team"
      schema={schema}
      defaultValues={defaults}
      mapRowToForm={mapRowToForm}
      renderThumb={(row) => (
        <AdminAssetThumb asset={getRowAsset(row, ["photo"])} alt={String(row.name ?? "")} />
      )}
      columns={[
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
      ]}
      renderFields={(form) => (
        <>
          <fieldset className="admin-form-section">
            <legend>Member</legend>
            <label className="admin-field">
              <span>Name</span>
              <input {...form.register("name")} />
            </label>
            <label className="admin-field">
              <span>Role</span>
              <input {...form.register("role")} />
            </label>
            <label className="admin-field admin-checkbox">
              <input type="checkbox" {...form.register("published")} />
              <span>Published on About page</span>
            </label>
          </fieldset>
          <fieldset className="admin-form-section">
            <legend>Photo</legend>
            <ImageUpload
              label="Headshot (3:4 portrait)"
              value={form.watch("photo") as CloudinaryAsset | null}
              onChange={(asset) => form.setValue("photo", asset)}
            />
          </fieldset>
        </>
      )}
    />
  );
}
