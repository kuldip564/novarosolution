"use client";

import { useEffect, useState } from "react";
import { BgfxCanvas } from "@/components/bgfx/BgfxCanvas";
import { useMotionSettings } from "@/lib/motion-provider";

export default function Bgfx() {
  const { effectsEnabled, ready } = useMotionSettings();
  const [deferred, setDeferred] = useState(false);

  useEffect(() => {
    if (!ready || !effectsEnabled) return;

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setDeferred(true), {
        timeout: 600,
      });
      return () => window.cancelIdleCallback(id);
    }

    const timer = setTimeout(() => setDeferred(true), 300);
    return () => clearTimeout(timer);
  }, [ready, effectsEnabled]);

  if (!ready || !effectsEnabled || !deferred) return null;

  return <BgfxCanvas />;
}
