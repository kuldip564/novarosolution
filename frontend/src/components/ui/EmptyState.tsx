import Link from "next/link";
import { Button } from "@/components/Button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({
  title,
  description,
  actionHref = "/blog",
  actionLabel = "Browse blog",
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 7h16M4 12h10M4 17h14" />
        </svg>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionHref && (
        <Button href={actionHref} variant="ghost">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
