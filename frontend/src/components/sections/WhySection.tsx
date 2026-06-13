import { Parallax } from "@/components/anim/Parallax";
import { Reveal } from "@/components/anim/Reveal";
import { NMark } from "@/components/NMark";
import { whyItems } from "@/lib/site-data";

export function WhySection() {
  return (
    <section className="sec why-sec">
      <div className="wrap">
        <div className="why-grid">
          <Parallax speed={0.05}>
            <Reveal className="why-visual">
              <div className="gl" />
              <NMark className="bign" size={220} />
            </Reveal>
          </Parallax>

          <Reveal delay={0.1}>
            <span className="eyebrow">Why Novaro</span>
            <h2 className="why-title">
              Senior people. One team. Real ownership.
            </h2>
            <div className="why-list">
              {whyItems.map((item) => (
                <div key={item.key} className="why-item">
                  <span className="k">{item.key}</span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
