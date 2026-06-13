type MediaPlaceholderProps = {
  title: string;
  hint?: string;
  className?: string;
};

export function MediaPlaceholder({
  title,
  hint = "Add image / video",
  className = "",
}: MediaPlaceholderProps) {
  return (
    <div className={`media-ph ${className}`.trim()}>
      <div className="ph-ic">
        <svg viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="10" r="1.5" />
          <path d="M21 16l-5-5L5 19" />
        </svg>
      </div>
      <div className="ph-t">{title}</div>
      <div className="ph-s">{hint}</div>
    </div>
  );
}
