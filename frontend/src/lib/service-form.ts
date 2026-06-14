import { parseCloudinaryAsset, type CloudinaryAsset } from "./media";

import { slugifyText } from "./slug";

export function slugifyTitle(title: string): string {
  return slugifyText(title);
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
