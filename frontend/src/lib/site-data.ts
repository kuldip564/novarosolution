export const site = {
  name: "Novaro Solution",
  tagline: "Software · Intelligence · Growth",
  brandIcon: "/brand/novaro-icon.png",
  email: "novaro@novarosolution.com",
  phone: "+91 96244 98325",
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
    href: "https://www.zeevan.shop/",
    category: "E-commerce · D2C",
    title: "Zeevan",
    description:
      "Premium A2 ghee brand storefront with product storytelling and a conversion-focused shopping experience.",
    cover: "c1",
  },
  {
    href: "https://www.kankreg.com/",
    category: "E-commerce · D2C",
    title: "KankreG",
    description:
      "A2 ghee D2C site with premium product presentation and a streamlined checkout journey.",
    cover: "c2",
  },
  {
    href: "https://www.mrantidot.com/",
    category: "Web App · Services",
    title: "Mr Antidot",
    description:
      "Hygiene and pest-control platform with service booking, pricing tiers, and sector coverage.",
    cover: "c3",
  },
  {
    href: "https://www.quadratocargo.com/",
    category: "Web App · Logistics",
    title: "Quadrato Cargo",
    description:
      "International courier platform with booking, live tracking, and dispatch across 180 countries.",
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
  { name: "Kuldip Chaudhary", role: "Co-Founder" },
  { name: "Mehul Chaudhary", role: "Co-Founder" },
  { name: "Piyush Chaudhary", role: "Manager" },
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
    slug: "zeevan",
    externalUrl: "https://www.zeevan.shop/",
    category: "E-commerce · D2C",
    title: "Zeevan",
    hook:
      "Premium A2 ghee brand storefront with product storytelling and a conversion-focused shopping experience.",
    heroTitle: "Project hero — Zeevan",
    story:
      "We designed and built Zeevan's digital storefront to communicate premium quality from the first scroll — clear product hierarchy, trust-led visuals, and a fast path from discovery to purchase for A2 ghee buyers.",
    results: [
      { value: "A2", label: "ghee positioning" },
      { value: "D2C", label: "commerce flow" },
      { value: "Fast", label: "mobile UX" },
    ],
    tags: ["E-commerce", "Next.js", "Brand", "D2C"],
  },
  {
    idx: "02",
    slug: "kankreg",
    externalUrl: "https://www.kankreg.com/",
    category: "E-commerce · D2C",
    title: "KankreG",
    hook:
      "A2 ghee D2C site with premium product presentation and a streamlined checkout journey.",
    heroTitle: "Project hero — KankreG",
    story:
      "KankreG needed a brand-forward commerce experience that feels as premium as the product. We shipped a responsive storefront with strong product pages, clear value messaging, and performance tuned for mobile shoppers.",
    results: [
      { value: "Premium", label: "brand feel" },
      { value: "Mobile", label: "first UX" },
      { value: "SEO", label: "ready structure" },
    ],
    tags: ["E-commerce", "Next.js", "Brand", "D2C"],
  },
  {
    idx: "03",
    slug: "mr-antidot",
    externalUrl: "https://www.mrantidot.com/",
    category: "Web App · Services",
    title: "Mr Antidot",
    hook:
      "Hygiene and pest-control platform with service booking, pricing tiers, and sector coverage for homes and businesses.",
    heroTitle: "Project hero — Mr Antidot",
    story:
      "Mr Antidot goes beyond a brochure site — we built a full service platform with treatment catalogues, transparent pricing, sector pages for hospitals and hospitality, team profiles, and lead capture wired for their operations team.",
    results: [
      { value: "8+", label: "years in market" },
      { value: "24/7", label: "support positioning" },
      { value: "10+", label: "service lines" },
    ],
    tags: ["Next.js", "Service booking", "CMS", "SEO"],
  },
  {
    idx: "04",
    slug: "quadrato-cargo",
    externalUrl: "https://www.quadratocargo.com/",
    category: "Web App · Logistics",
    title: "Quadrato Cargo",
    hook:
      "International courier platform with booking, live tracking, and dispatch flows across 180 countries.",
    heroTitle: "Project hero — Quadrato Cargo",
    story:
      "Quadrato Cargo is a full logistics product — instant and scheduled pickup booking, live shipment tracking, quote requests, and customer-facing flows designed for speed. We built the technology stack behind their Fast Forward, Rapid Reach promise.",
    results: [
      { value: "180", label: "countries" },
      { value: "10K+", label: "deliveries" },
      { value: "~10 min", label: "pickup target" },
    ],
    tags: ["Next.js", "Booking", "Tracking", "Logistics"],
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
