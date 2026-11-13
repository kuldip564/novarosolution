"use client";

import { useEffect, useRef, useState } from "react";

type LazyMapProps = { src: string; title: string; className?: string };

/**
 * Google Maps embed that only loads when the reader scrolls close to it. The embed pulls
 * several hundred KB of scripts, which should never compete with the first paint.
 */
export function LazyMap({ src, title, className }: LazyMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  return (
    <div ref={ref} className={className} data-map-loaded={show || undefined}>
      {show ? (
        <iframe
          title={title}
          className={className}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : null}
    </div>
  );
}
