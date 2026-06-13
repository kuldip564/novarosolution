type MarqueeProps = {
  items?: readonly string[];
};

export function Marquee({ items = [] }: MarqueeProps) {
  if (!items.length) return null;

  const track = [...items, ...items];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        {track.map((item, index) => (
          <div key={`${item}-${index}`} className="item">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
