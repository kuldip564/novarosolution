"use client";

import dynamic from "next/dynamic";

export const HomeBackground = dynamic(
  () =>
    import("./HomeBackground3D").then((mod) => ({
      default: mod.HomeBackground3D,
    })),
  { ssr: false },
);
