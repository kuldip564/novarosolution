import { parseCloudinaryAsset, type CloudinaryAsset } from "./media";

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeStringList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(String).map((s) => s.trim()).filter(Boolean);
}

export function normalizeServiceImage(raw: unknown): CloudinaryAsset | null {
  return parseCloudinaryAsset(raw);
}

export const SERVICE_ICON_OPTIONS = [
  { value: "monitor", label: "Monitor — Web / App" },
  { value: "ai", label: "AI — Intelligence" },
  { value: "chart", label: "Chart — Marketing / Growth" },
  { value: "cloud", label: "Cloud — DevOps / Design" },
] as const;
