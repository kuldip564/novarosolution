"use client";

import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { deleteImageAsset, uploadImageAsset } from "@/lib/admin-api";
import { cloudinaryTransformUrl, type CloudinaryAsset } from "@/lib/media";

type ImageUploadProps = {
  label: string;
  value?: CloudinaryAsset | null;
  onChange: (asset: CloudinaryAsset | null) => void;
};

export function ImageUpload({ label, value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  const previewUrl = value
    ? cloudinaryTransformUrl(value, { width: 480, crop: "fill" }) ?? value.secureUrl
    : null;

  const uploadFile = useCallback(
    async (file: File) => {
      setError("");
      setProgress(0);
      try {
        const asset = await uploadImageAsset(file, setProgress);
        onChange(asset);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setProgress(null);
      }
    },
    [onChange],
  );

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void uploadFile(file);
    e.target.value = "";
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) void uploadFile(file);
  }

  async function removeImage() {
    if (value?.publicId) {
      try {
        await deleteImageAsset(value.publicId);
      } catch {
        // still clear from form even if remote delete fails
      }
    }
    onChange(null);
  }

  return (
    <div className="admin-field">
      <span>{label}</span>
      <div
        className={`admin-upload-drop ${dragging ? "dragging" : ""}`}
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
          hidden
          onChange={onFileChange}
        />
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="" className="admin-upload-preview large" />
        ) : (
          <p>Drop an image here or click to browse</p>
        )}
        {progress !== null && (
          <div className="admin-upload-progress">
            <div style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      {value && (
        <div className="admin-upload-meta">
          <code>{value.publicId ?? "local asset"}</code>
          <div className="admin-upload-actions">
            <button type="button" className="admin-btn ghost" onClick={() => inputRef.current?.click()}>
              Replace
            </button>
            <button type="button" className="admin-btn danger" onClick={() => void removeImage()}>
              Remove
            </button>
          </div>
        </div>
      )}
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
}
