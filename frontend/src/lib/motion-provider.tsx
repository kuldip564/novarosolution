"use client";

import { MotionConfig } from "framer-motion";
import { ReactLenis, useLenis } from "lenis/react";
import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  isCoarsePointer,
  prefersReducedMotion,
} from "@/lib/device";
import {
  getPerformanceTier,
  shouldEnableWebGL,
  type PerformanceTier,
} from "@/lib/performance";
import { setScrollY } from "@/lib/scroll-store";

type MotionSettings = {
  smoothScroll: boolean;
  effectsEnabled: boolean;
  reducedMotion: boolean;
  performanceTier: PerformanceTier;
  ready: boolean;
};

const defaultSettings: MotionSettings = {
  smoothScroll: false,
  effectsEnabled: false,
  reducedMotion: false,
  performanceTier: "high",
  ready: false,
};

const MotionSettingsContext = createContext<MotionSettings>(defaultSettings);

export function useMotionSettings(): MotionSettings {
  return useContext(MotionSettingsContext);
}

let clientSettings: MotionSettings | null = null;

function getClientSettings(): MotionSettings {
  if (clientSettings) return clientSettings;

  const reducedMotion = prefersReducedMotion();
  const coarse = isCoarsePointer();
  const performanceTier = getPerformanceTier();

  clientSettings = {
    reducedMotion,
    smoothScroll: !reducedMotion && !coarse,
    effectsEnabled: shouldEnableWebGL(performanceTier),
    performanceTier,
    ready: true,
  };

  return clientSettings;
}

/** Publishes Lenis's scroll position to the shared scroll store. */
function LenisScrollBridge() {
  useLenis((lenis) => {
    setScrollY(lenis.scroll);
  });

  return null;
}

function NativeScrollBridge() {
  useEffect(() => {
    let frameId = 0;
    let pending = false;

    const readScroll = () => {
      pending = false;
      setScrollY(window.scrollY);
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      frameId = requestAnimationFrame(readScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    readScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return null;
}

type MotionProviderProps = {
  children: ReactNode;
};

export function MotionProvider({ children }: MotionProviderProps) {
  const settings = useSyncExternalStore(
    () => () => {},
    getClientSettings,
    () => defaultSettings,
  );

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "auto";
  }, []);

  return (
    <MotionSettingsContext.Provider value={settings}>
      <MotionConfig reducedMotion="user">
        {/* Scroll plumbing sits beside the page, never around it: switching it on after
            hydration must not remount the whole tree. */}
        {settings.ready && settings.smoothScroll ? (
          <ReactLenis
            root
            options={{
              lerp: 0.1,
              autoRaf: true,
              syncTouch: false,
              touchMultiplier: 0,
              smoothWheel: true,
            }}
          >
            <LenisScrollBridge />
          </ReactLenis>
        ) : (
          <NativeScrollBridge />
        )}
        {children}
      </MotionConfig>
    </MotionSettingsContext.Provider>
  );
}
