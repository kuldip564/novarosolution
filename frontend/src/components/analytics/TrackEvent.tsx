"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

type TrackEventProps = {
  event: AnalyticsEvent;
  params?: Record<string, string | number | boolean>;
};

/** Fires one analytics event when the page mounts (once per page view; track() debounces). */
export function TrackEvent({ event, params }: TrackEventProps) {
  const key = JSON.stringify(params ?? {});

  useEffect(() => {
    track(event, JSON.parse(key) as Record<string, string | number | boolean>);
  }, [event, key]);

  return null;
}
