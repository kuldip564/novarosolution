import { parseCloudinaryAsset, type CloudinaryAsset } from "./media";

export type ProjectResultMetric = {
  value: string;
  label: string;
};

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeProjectResults(raw: unknown): ProjectResultMetric[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item, index) => {
      if (typeof item === "string") {
        return { value: item, label: `Result ${index + 1}` };
      }
      if (item && typeof item === "object" && "value" in item) {
        const row = item as { value?: unknown; label?: unknown };
        return {
          value: String(row.value ?? ""),
          label: String(row.label ?? `Result ${index + 1}`),
        };
      }
      return null;
    })
    .filter((row): row is ProjectResultMetric => Boolean(row?.value?.trim()));
}

export function normalizeProjectScreens(raw: unknown): CloudinaryAsset[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => parseCloudinaryAsset(item))
    .filter((asset): asset is CloudinaryAsset => Boolean(asset?.secureUrl));
}

export function lines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
