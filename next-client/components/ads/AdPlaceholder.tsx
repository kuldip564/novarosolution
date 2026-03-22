type AdPlaceholderProps = {
  slotName?: string;
};

export default function AdPlaceholder({ slotName = 'Content Area' }: AdPlaceholderProps) {
  return (
    <aside className="ad-placeholder" aria-label="Advertisement placeholder">
      <p className="ad-placeholder__label">Advertisement</p>
      <div className="ad-placeholder__box">
        <p className="text-sm text-slate-300">
          Ad slot reserved for Google AdSense ({slotName}). Ads render only after consent where required.
        </p>
      </div>
    </aside>
  );
}
