import Link from "next/link";
import { ArrowUpRight, BrainCircuit, Cloud, LineChart, MonitorSmartphone, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/anim/Reveal";
import { processSteps } from "@/lib/site-data";

const capabilities: Array<{ icon: LucideIcon; title: string; body: string; href: string }> = [
  {
    icon: MonitorSmartphone,
    title: "Web & app development",
    body: "Websites, web apps, SaaS dashboards, and mobile products on Next.js and Node.",
    href: "/services/web-app-eng",
  },
  {
    icon: BrainCircuit,
    title: "AI & machine learning",
    body: "Document extraction, search over your own content, and review queues with a person in the loop.",
    href: "/services/ai-machine-ml",
  },
  {
    icon: LineChart,
    title: "Digital marketing & SEO",
    body: "Technical SEO, paid search and social campaigns, and analytics tied to revenue.",
    href: "/services/digital-marketing",
  },
  {
    icon: Cloud,
    title: "Cloud, DevOps & design",
    body: "AWS or GCP, CI/CD, monitoring, and design systems your team can ship with.",
    href: "/services/cloud-devops",
  },
];

/** About page: what the studio does and how a project runs — compact, linking to the full pages. */
export function AboutCapabilities() {
  return (
    <section className="about-scene about-caps" aria-labelledby="about-caps-title">
      <div className="wrap">
        <header className="about-scene__head">
          <span className="eyebrow">Capabilities</span>
          <h2 id="about-caps-title" className="about-caps__title">
            What we do, and how a project runs
          </h2>
        </header>

        <ul className="about-caps__grid">
          {capabilities.map((item, index) => (
            <Reveal as="li" key={item.href} delay={0.05 * index}>
              <Link href={item.href} className="about-caps__card">
                <span className="about-caps__icon" aria-hidden>
                  <item.icon size={20} strokeWidth={1.8} />
                </span>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
                <span className="about-caps__more">
                  Learn more <ArrowUpRight size={14} aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>

        <ol className="about-caps__steps" aria-label="How we work">
          {processSteps.map((step) => (
            <li key={step.num}>
              <span className="about-caps__no">{step.num}</span>
              <strong>{step.title}</strong>
              <span>{step.description}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
