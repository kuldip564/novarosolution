import { marqueeItems } from "@/lib/site-data";

export function Marquee() {
  const items = [...marqueeItems, ...marqueeItems];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="item">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
