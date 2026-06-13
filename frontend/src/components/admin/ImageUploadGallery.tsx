"use client";

import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { deleteImageAsset, uploadImageAsset } from "@/lib/admin-api";
import { cloudinaryTransformUrl, parseCloudinaryAsset, type CloudinaryAsset } from "@/lib/media";

type ImageUploadGalleryProps = {
  label: string;
  hint?: string;
  value: CloudinaryAsset[];
  onChange: (assets: CloudinaryAsset[]) => void;
  maxItems?: number;
};

export function ImageUploadGallery({
  label,
  hint = "Add UI shots, dashboards, or extra project images.",
  value,
  onChange,
  maxItems = 12,
}: ImageUploadGalleryProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  const uploadFile = useCallback(
    async (file: File) => {
      if (value.length >= maxItems) {
        setError(`Maximum ${maxItems} images`);
        return;
      }
      setError("");
      setProgress(0);
      try {
        const asset = await uploadImageAsset(file, setProgress);
        onChange([...value, asset]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setProgress(null);
      }
    },
    [maxItems, onChange, value],
  );

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    void (async () => {
      for (const file of files) {
        if (file.type.startsWith("image/")) await uploadFile(file);
      }
    })();
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files ?? []).filter((f) =>
      f.type.startsWith("image/"),
    );
    void (async () => {
      for (const file of files) await uploadFile(file);
    })();
  }

  function move(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= value.length) return;
    const items = [...value];
    const [item] = items.splice(index, 1);
    items.splice(next, 0, item);
    onChange(items);
  }

  async function removeAt(index: number) {
    const asset = value[index];
    if (asset?.publicId) {
      try {
        await deleteImageAsset(asset.publicId);
      } catch {
        // still remove from form
      }
    }
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="admin-field">
      <span>{label}</span>
      <p className="admin-field-hint">{hint}</p>

      {value.length > 0 && (
        <div className="admin-gallery-grid">
          {value.map((item, index) => {
            const parsed = parseCloudinaryAsset(item);
            const preview =
              parsed &&
              (cloudinaryTransformUrl(parsed, { width: 320, crop: "fill" }) ??
                parsed.secureUrl);

            return (
              <div key={`${parsed?.publicId ?? parsed?.secureUrl}-${index}`} className="admin-gallery-item">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="" className="admin-gallery-thumb" />
                ) : null}
                <div className="admin-gallery-actions">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0}>
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === value.length - 1}
                  >
                    ↓
                  </button>
                  <button type="button" className="danger" onClick={() => void removeAt(index)}>
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {value.length < maxItems && (
        <div
          className={`admin-upload-drop compact ${dragging ? "dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          role="button"
          tabIndex={0}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={onFileChange}
          />
          <p>Add image{value.length ? "s" : ""} — drop or click ({value.length}/{maxItems})</p>
          {progress !== null && (
            <div className="admin-upload-progress">
              <div style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      )}

      {error && <p className="admin-error">{error}</p>}
    </div>
  );
}
