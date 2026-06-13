import { apiFetch } from "./api";
import type { CloudinaryAsset } from "./media";

export async function adminFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await apiFetch(path, init);
  const data = (await res.json()) as { ok?: boolean; error?: string; data?: T };

  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data.data as T;
}

export type UploadConfig = {
  cloudinaryEnabled: boolean;
  folder: string;
  cloudName: string | null;
};

export async function getUploadConfig(): Promise<UploadConfig> {
  return adminFetch<UploadConfig>("/api/admin/upload/config");
}

export async function uploadImageAsset(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<CloudinaryAsset> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.withCredentials = true;

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText) as {
          ok?: boolean;
          error?: string;
          data?: CloudinaryAsset;
        };
        if (xhr.status >= 400 || !data.ok || !data.data) {
          reject(new Error(data.error || "Upload failed"));
          return;
        }
        resolve(data.data);
      } catch {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed"));

    const form = new FormData();
    form.append("file", file);
    xhr.send(form);
  });
}

export async function deleteImageAsset(publicId: string | null): Promise<void> {
  if (!publicId) return;
  const res = await apiFetch("/api/admin/upload", {
    method: "DELETE",
    body: JSON.stringify({ publicId }),
  });
  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error || "Delete failed");
  }
}

/** @deprecated Use uploadImageAsset */
export async function uploadImage(file: File): Promise<string> {
  const asset = await uploadImageAsset(file);
  return asset.secureUrl;
}
