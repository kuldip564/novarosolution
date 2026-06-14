import { Reveal } from "@/components/anim/Reveal";
import { processSteps as defaultSteps } from "@/lib/site-data";

type ProcessStep = {
  num: string;
  title: string;
  description: string;
};

type ProcessProps = {
  centered?: boolean;
  steps?: readonly ProcessStep[];
};

export function Process({
  centered = false,
  steps = defaultSteps,
}: ProcessProps) {
  return (
    <section className="sec light process-sec">
      <div className="wrap process-wrap">
        <div className={`sec-head ${centered ? "center" : ""}`}>
          <Reveal>
            <span className={`eyebrow ${centered ? "center" : ""}`}>How we work</span>
            <h2>A clear path from idea to impact.</h2>
            {!centered && (
              <p>
                No black boxes. Every engagement runs through the same four stages so
                you always know what&apos;s happening and why.
              </p>
            )}
          </Reveal>
        </div>

        <div className="proc">
          {steps.map((step, index) => (
            <Reveal key={step.num} delay={(index + 1) * 0.1}>
              <div className="step">
                {index < steps.length - 1 && <span className="dot" />}
                <div className="num">{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
