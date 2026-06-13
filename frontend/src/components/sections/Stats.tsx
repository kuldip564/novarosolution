import { Counter } from "@/components/anim/Counter";
import { Reveal } from "@/components/anim/Reveal";

type Stat = {
  value: number;
  suffix: string;
  label: string;
};

type StatsProps = {
  items: readonly Stat[];
};

export function Stats({ items }: StatsProps) {
  return (
    <section className="sec stats-sec">
      <div className="wrap">
        <div className="stats">
          {items.map((stat, index) => (
            <Reveal key={stat.label} delay={(index + 1) * 0.1}>
              <div className="stat">
                <Counter value={stat.value} suffix={stat.suffix} className="v" />
                <div className="l">{stat.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
