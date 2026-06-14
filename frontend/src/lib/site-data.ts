export const site = {
  name: "Novaro Solution",
  tagline: "Software · Intelligence · Growth",
  brandIcon: "/brand/novaro-icon.png",
  email: "hello@novarosolution.com",
  phone: "+91 00000 00000",
  location: "Gandhinagar, Gujarat, India",
  social: {
    linkedin: "https://www.linkedin.com/company/novaro-solution",
    x: "#",
    github: "#",
    instagram: "https://www.instagram.com/novarosolution/",
  },
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const marqueeItems = [
  "Next.js",
  "Machine Learning",
  "React",
  "Node & Express",
  "Cloud & DevOps",
  "Performance Marketing",
  "UI / UX Design",
  "Data Engineering",
] as const;

export const services = [
  {
    id: "01",
    title: "Web & App Engineering",
    description:
      "Production-grade web and mobile apps built on Next.js and Node — fast, scalable, and made to ship and last.",
    tags: ["Next.js", "Express", "SaaS", "Mobile"],
    icon: "monitor",
  },
  {
    id: "02",
    title: "AI & Machine Learning",
    description:
      "Models, pipelines, and intelligent features that turn your data into decisions, automation, and real product value.",
    tags: ["LLM apps", "Computer vision", "Pipelines"],
    icon: "ai",
  },
  {
    id: "03",
    title: "Digital Marketing",
    description:
      "SEO, performance campaigns, and brand systems that put your product in front of the right people at the right moment.",
    tags: ["SEO", "Paid ads", "Analytics", "Brand"],
    icon: "chart",
  },
] as const;

export const capabilities = [
  "Cloud & DevOps",
  "UI / UX Design",
  "Data Engineering",
  "API & Integrations",
] as const;

export const processSteps = [
  {
    num: "01",
    title: "Discover",
    description:
      "We map goals, users, and constraints — then define success in metrics you can track, not buzzwords.",
  },
  {
    num: "02",
    title: "Design",
    description:
      "Architecture, UX, and a clickable direction you can react to before we commit to the build.",
  },
  {
    num: "03",
    title: "Build",
    description:
      "Tight delivery sprints with working software in your hands every week — typed, tested, and reviewable.",
  },
  {
    num: "04",
    title: "Launch & Scale",
    description:
      "We ship, measure, and keep optimizing performance, infrastructure, and growth loops.",
  },
] as const;

export const homeProjects = [
  {
    href: "/work",
    category: "Web App · Fintech",
    title: "FinFlow",
    description:
      "A real-time payments dashboard handling 2M+ monthly transactions with sub-second insights.",
    cover: "c1",
  },
  {
    href: "/work",
    category: "AI / ML · Healthcare",
    title: "MediSense",
    description:
      "A diagnostic assistant that reads scans and flags anomalies for clinicians in seconds.",
    cover: "c2",
  },
  {
    href: "/work",
    category: "Marketing · D2C",
    title: "Aurora Commerce",
    description:
      "A growth campaign that lifted qualified traffic 240% and tripled return on ad spend.",
    cover: "c3",
  },
  {
    href: "/work",
    category: "Web App · SaaS",
    title: "Helio CRM",
    description:
      "A multi-tenant CRM platform built to scale from first customer to enterprise rollout.",
    cover: "c4",
  },
] as const;

export const homeStats = [
  { value: 2, suffix: " yrs", label: "Years of experience" },
  { value: 32, suffix: "+", label: "Happy clients" },
  { value: 4, suffix: "", label: "Core practices" },
  { value: 98, suffix: "%", label: "Client retention" },
] as const;

export const aboutStats = [
  { value: 2, suffix: " yrs", label: "Years of experience" },
  { value: 32, suffix: "+", label: "Happy clients" },
  { value: 14, suffix: "", label: "People on the team" },
  { value: 98, suffix: "%", label: "Client retention" },
] as const;

export const whyItems = [
  {
    key: "01",
    title: "Full-stack under one roof",
    description:
      "Engineering, AI, design, and marketing in the same room — no hand-offs, no finger-pointing.",
  },
  {
    key: "02",
    title: "Built to scale, not to demo",
    description:
      "We write production code from day one, with architecture to grow when you do.",
  },
  {
    key: "03",
    title: "Outcomes, not hours",
    description:
      "We measure ourselves on the metrics that matter to your business, then move them.",
  },
  {
    key: "04",
    title: "Transparent delivery",
    description:
      "Weekly working software, clear milestones, and honest updates — you always know where things stand.",
  },
] as const;

export const team = [
  { name: "Founder / CEO", role: "Strategy & Product" },
  { name: "Engineering Lead", role: "Web & Cloud" },
  { name: "AI Lead", role: "ML & Data" },
  { name: "Growth Lead", role: "Marketing & SEO" },
] as const;

export const serviceDetails = [
  {
    no: "01",
    title: "Web & App Engineering",
    description:
      "We design and ship production web and mobile products on a modern Next.js and Node stack — typed, tested, accessible, and ready for real traffic from day one.",
    bullets: [
      "SaaS platforms and customer dashboards",
      "Cross-platform mobile and responsive web",
      "API, backend, and integration layers",
      "Performance, security, and accessibility audits",
    ],
    mediaTitle: "Web & App work",
    mediaHint: "Add image / video · 4:3",
    media: {
      src: "/images/webapp-dashboard.webp",
      alt: "Web and app engineering services — glassmorphic dashboard on a laptop with navy and cyan UI",
      width: 2048,
      height: 1529,
    },
  },
  {
    no: "02",
    title: "AI & Machine Learning",
    description:
      "From first prototype to production model, we build intelligent features with proper evaluation, data pipelines, monitoring, and humans firmly in the loop.",
    bullets: [
      "LLM apps, assistants, and retrieval workflows",
      "Computer vision and document intelligence",
      "Forecasting, recommendations, and ranking",
      "MLOps, evaluation, and model monitoring",
    ],
    mediaTitle: "AI / ML work",
    mediaHint: "Add image / video · 4:3",
    media: {
      src: "/images/ai-ml-dashboard.webp",
      alt: "AI and machine learning services — neural network visualization with glassmorphic panels",
      width: 2048,
      height: 1529,
    },
  },
  {
    no: "03",
    title: "Digital Marketing",
    description:
      "We connect product and pipeline — technical SEO, performance campaigns, and analytics that tie every rupee of spend to qualified leads and revenue.",
    bullets: [
      "Technical SEO and content systems",
      "Paid search, social, and lifecycle campaigns",
      "Landing pages and conversion optimization",
      "Brand, creative, and analytics setup",
    ],
    mediaTitle: "Marketing work",
    mediaHint: "Add image / video · 4:3",
    media: {
      src: "/images/digital-marketing-dashboard.webp",
      alt: "Digital marketing services — analytics dashboard with campaign performance panels",
      width: 2048,
      height: 1529,
    },
  },
  {
    no: "04",
    title: "Cloud, DevOps & Design",
    description:
      "The foundation that keeps everything reliable and polished — cloud architecture, CI/CD, observability, design systems, and UX your team can ship with.",
    bullets: [
      "Cloud architecture on AWS and GCP",
      "CI/CD, observability, and incident response",
      "Design systems and product UI/UX",
      "Security reviews and compliance readiness",
    ],
    mediaTitle: "Cloud & Design work",
    mediaHint: "Add image / video · 4:3",
  },
] as const;

export const workProjects = [
  {
    idx: "01",
    category: "Web App · Fintech",
    title: "FinFlow",
    hook:
      "A real-time payments dashboard handling 2M+ monthly transactions with sub-second insights.",
    heroTitle: "Project hero — FinFlow",
    story:
      "We rebuilt FinFlow from a slow legacy stack into a Next.js + Express platform with a streaming data layer. Treasury teams now see balances, flows, and anomalies update live, with role-based controls and an audit trail baked in.",
    results: [
      { value: "-72%", label: "load time" },
      { value: "2M+", label: "txns / month" },
      { value: "99.98%", label: "uptime" },
    ],
    tags: ["Next.js", "Express", "PostgreSQL", "WebSockets", "AWS"],
  },
  {
    idx: "02",
    category: "AI / ML · Healthcare",
    title: "MediSense",
    hook:
      "A diagnostic assistant that reads scans and flags anomalies for clinicians in seconds.",
    heroTitle: "Project hero — MediSense",
    story:
      "MediSense pairs a computer-vision model with a clean review workflow. Radiologists get ranked findings with confidence scores and heat-maps, cutting first-read time while keeping a human firmly in the loop.",
    results: [
      { value: "8s", label: "avg read" },
      { value: "+34%", label: "throughput" },
      { value: "HIPAA", label: "compliant" },
    ],
    tags: ["PyTorch", "Computer vision", "FastAPI", "Next.js"],
  },
  {
    idx: "03",
    category: "Marketing · D2C",
    title: "Aurora Commerce",
    hook:
      "A growth engine that lifted qualified traffic 240% and tripled return on ad spend.",
    heroTitle: "Project hero — Aurora Commerce",
    story:
      "We rebuilt the Aurora funnel end to end — technical SEO, a new content system, and a performance-ad program wired to clean analytics — so spend follows what actually converts.",
    results: [
      { value: "+240%", label: "organic traffic" },
      { value: "3.1x", label: "ROAS" },
      { value: "-38%", label: "CAC" },
    ],
    tags: ["SEO", "Paid social", "GA4", "CRO"],
  },
  {
    idx: "04",
    category: "Web App · SaaS",
    title: "Helio CRM",
    hook:
      "A multi-tenant CRM platform built to scale from first customer to enterprise rollout.",
    heroTitle: "Project hero — Helio CRM",
    story:
      "Helio needed to go from prototype to product. We designed the multi-tenant architecture, billing, and a component system that lets their team ship features without breaking the experience.",
    results: [
      { value: "10x", label: "faster onboarding" },
      { value: "500+", label: "tenants" },
      { value: "SOC 2", label: "ready" },
    ],
    tags: ["Next.js", "Stripe", "PostgreSQL", "Design system"],
  },
] as const;

export const contactServices = [
  "Web / App",
  "AI / ML",
  "Marketing",
  "Cloud / DevOps",
  "Design",
] as const;

export const budgetRanges = [
  "Under ₹5L",
  "₹5L – ₹15L",
  "₹15L – ₹40L",
  "₹40L+",
] as const;

export const apiBase =
  process.env.NEXT_PUBLIC_API_URL ?? "";

export const defaultHero = {
  eyebrow: "Digital product studio · Gandhinagar",
  headline: "We engineer products",
  headlineAccent: "that earn trust.",
  lede:
    "Web and app platforms, AI that survives production, and marketing that moves revenue — one accountable team from roadmap to launch.",
  ctaPrimary: "See our work",
  ctaSecondary: "Book a call",
  metaStat: "2",
  metaLabel: "Years of experience",
} as const;

export type HeroContent = {
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  lede: string;
  ctaPrimary: string;
  ctaSecondary: string;
  metaStat: string;
  metaLabel: string;
};

export const defaultCta = {
  homeTitle: "Ready to ship something worth showing off?",
  homeDescription:
    "Tell us what you're building. We'll reply within one business day with a clear path, timeline, and team fit.",
  servicesTitle: "Not sure where to start?",
  servicesDescription:
    "Tell us the problem — we'll map the shortest path to a shipped result, with the right team and a clear timeline.",
  workTitle: "Have a project in mind?",
  workDescription:
    "Share a brief — we'll reply with a clear plan, timeline, and team fit.",
  aboutTitle: "Let's build something worth shipping.",
  aboutDescription:
    "Share what you're working on — we'll reply within one business day with a clear path forward.",
  contactTitle: "Let's talk about your project.",
  contactDescription:
    "Fill in the form and we'll get back within one business day.",
} as const;

export type CtaContent = typeof defaultCta;

export type CtaPageKey = "home" | "services" | "work" | "about" | "contact";

export function pickCta(cta: CtaContent, page: CtaPageKey) {
  const titleKey = `${page}Title` as keyof CtaContent;
  const descKey = `${page}Description` as keyof CtaContent;
  return {
    title: cta[titleKey],
    description: cta[descKey],
  };
}

export const fallbackTestimonials = [
  {
    id: "1",
    quote:
      "Novaro shipped a production-ready platform in weeks, not months — and the quality held up as we scaled.",
    name: "Product Lead",
    role: "Fintech SaaS",
    rating: 5,
    avatar: null,
  },
  {
    id: "2",
    quote:
      "They integrated AI into our workflow without the usual hype — measurable time saved from week one.",
    name: "Operations Director",
    role: "Healthcare",
    rating: 5,
    avatar: null,
  },
] as const;

export const fallbackFaqs = [
  {
    id: "1",
    question: "What types of projects do you take on?",
    answer:
      "Web and mobile products, AI features, marketing sites, and full-stack platforms — from MVP to scale-up.",
  },
  {
    id: "2",
    question: "How do engagements usually start?",
    answer:
      "A short discovery call, then a scoped proposal with timeline, team, and clear deliverables.",
  },
  {
    id: "3",
    question: "Do you work with startups and enterprises?",
    answer: "Yes — we adapt squad size and process to your stage and constraints.",
  },
] as const;
