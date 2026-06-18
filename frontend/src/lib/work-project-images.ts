import type { CloudinaryAsset } from "./media";

/** Bump when replacing files under public/images/work/ to bust image caches. */
const WORK_IMAGE_VERSION = "4";

export type WorkProjectImageSet = {
  hero: CloudinaryAsset;
  heroAlt: string;
  screens: CloudinaryAsset[];
};

function workImage(path: string): CloudinaryAsset {
  return { secureUrl: `${path}?v=${WORK_IMAGE_VERSION}`, publicId: null };
}

export const WORK_PROJECT_IMAGES: Record<string, WorkProjectImageSet> = {
  zeevan: {
    hero: workImage("/images/work/zeevan.jpg"),
    heroAlt: "Zeevan A2 Desi Cow Ghee — premium pantry storefront",
    screens: [workImage("/images/work/zeevan.jpg")],
  },
  kankreg: {
    hero: workImage("/images/work/kankreg.jpg"),
    heroAlt: "KankreG Pure A2 Bilona ghee — artisanal brand commerce site",
    screens: [workImage("/images/work/kankreg.jpg")],
  },
  "mr-antidot": {
    hero: workImage("/images/work/mr-antidot.jpg"),
    heroAlt: "Mr Antidot — complete hygiene management for homes and businesses",
    screens: [workImage("/images/work/mr-antidot.jpg")],
  },
  "quadrato-cargo": {
    hero: workImage("/images/work/quadrato-cargo.jpg"),
    heroAlt: "Quadrato Cargo — track shipments, book courier, and get quotes",
    screens: [workImage("/images/work/quadrato-cargo.jpg")],
  },
};

export function getWorkProjectImages(slug: string): WorkProjectImageSet | null {
  return WORK_PROJECT_IMAGES[slug] ?? null;
}

/** Prefer bundled work screenshots over stale CMS/DB assets. */
export function mergeWorkProjectImages(
  slug: string,
  heroImage: CloudinaryAsset | null,
  screens: CloudinaryAsset[],
): { heroImage: CloudinaryAsset | null; screens: CloudinaryAsset[] } {
  const local = getWorkProjectImages(slug);
  if (!local) return { heroImage, screens };
  return { heroImage: local.hero, screens: local.screens };
}

export function localAsset(path: string): CloudinaryAsset {
  return workImage(path);
}
