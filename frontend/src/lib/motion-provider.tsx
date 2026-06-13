"use client";

import { MotionConfig, useAnimationFrame } from "framer-motion";
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
  isLowEndDevice,
  prefersReducedMotion,
} from "@/lib/device";
import { setScrollY } from "@/lib/scroll-store";

type MotionSettings = {
  smoothScroll: boolean;
  effectsEnabled: boolean;
  reducedMotion: boolean;
  ready: boolean;
};

const defaultSettings: MotionSettings = {
  smoothScroll: false,
  effectsEnabled: false,
  reducedMotion: false,
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
  const lowEnd = isLowEndDevice();

  clientSettings = {
    reducedMotion,
    smoothScroll: !reducedMotion && !coarse,
    effectsEnabled: !reducedMotion && !lowEnd,
    ready: true,
  };

  return clientSettings;
}

function LenisFrameBridge() {
  const lenis = useLenis();

  useAnimationFrame((time) => {
    if (!lenis) return;
    lenis.raf(time);
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
        {!settings.ready ? (
          <>
            <NativeScrollBridge />
            {children}
          </>
        ) : settings.smoothScroll ? (
          <ReactLenis
            root
            options={{
              lerp: 0.1,
              autoRaf: false,
              syncTouch: false,
              touchMultiplier: 0,
              smoothWheel: true,
            }}
          >
            <LenisFrameBridge />
            {children}
          </ReactLenis>
        ) : (
          <>
            <NativeScrollBridge />
            {children}
          </>
        )}
      </MotionConfig>
    </MotionSettingsContext.Provider>
  );
}
