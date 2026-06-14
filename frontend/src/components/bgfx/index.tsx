"use client";

import { useEffect, useState } from "react";
import { BgfxCanvas } from "@/components/bgfx/BgfxCanvas";
import { useMotionSettings } from "@/lib/motion-provider";

export default function Bgfx() {
  const { effectsEnabled, ready } = useMotionSettings();
  const [deferred, setDeferred] = useState(false);

  useEffect(() => {
    if (!ready || !effectsEnabled) return;

    const delayMs = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
      ? 120
      : 600;

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setDeferred(true), {
        timeout: delayMs,
      });
      return () => window.cancelIdleCallback(id);
    }

    const timer = setTimeout(() => setDeferred(true), delayMs > 300 ? 300 : delayMs);
    return () => clearTimeout(timer);
  }, [ready, effectsEnabled]);

  if (!ready || !effectsEnabled || !deferred) return null;

  return <BgfxCanvas />;
}
