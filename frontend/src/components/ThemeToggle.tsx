"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type ThemeToggleProps = {
  className?: string;
  variant?: "header" | "menu";
};

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

const subscribeMounted = () => () => {};
const getMounted = () => true;
const getServerMounted = () => false;

export function ThemeToggle({
  className = "",
  variant = "header",
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeMounted,
    getMounted,
    getServerMounted,
  );
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!mounted) {
    return (
      <button
        type="button"
        className={`theme-toggle ${className}`.trim()}
        aria-label="Theme"
        disabled
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  const TriggerIcon = isDark ? Sun : Moon;

  if (variant === "menu") {
    return (
      <div className={`theme-switch theme-switch-menu ${className}`.trim()}>
        <span className="theme-menu-label">Appearance</span>
        <div className="theme-segment" role="group" aria-label="Theme">
          {options.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              className={`theme-segment-btn ${theme === value ? "active" : ""}`}
              aria-label={`Use ${label.toLowerCase()} theme`}
              aria-pressed={theme === value}
              onClick={() => setTheme(value)}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className={`theme-switch ${className}`.trim()}>
      <button
        type="button"
        className="theme-toggle"
        aria-label={`Current theme: ${theme ?? "dark"}. Change theme`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
      >
        <span
          key={resolvedTheme ?? "dark"}
          className="theme-toggle-icon"
          aria-hidden="true"
        >
          <TriggerIcon size={18} strokeWidth={2} />
        </span>
      </button>

      {open && (
        <div className="theme-menu" role="menu">
          {options.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              role="menuitemradio"
              aria-checked={theme === value}
              className={`theme-menu-item ${theme === value ? "active" : ""}`}
              onClick={() => {
                setTheme(value);
                setOpen(false);
              }}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
