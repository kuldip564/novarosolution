"use client";

import dynamic from "next/dynamic";

export const SiteBackground = dynamic(
  () =>
    import("./SiteBackground3D").then((mod) => ({
      default: mod.SiteBackground3D,
    })),
  { ssr: false },
);
