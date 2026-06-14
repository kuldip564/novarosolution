/**
 * Seed data mirrored from frontend/src/lib/site-data.ts
 * plus inline copy from Hero / pages where noted.
 */

export const seedSite = {
  name: "Novaro Solution",
  tagline: "Software · Intelligence · Growth",
  email: "hello@novarosolution.com",
  phone: "+91 00000 00000",
  location: "Gandhinagar, Gujarat, India",
  social: {
    linkedin: "https://www.linkedin.com/company/novaro-solution",
    x: "#",
    github: "#",
    instagram: "https://www.instagram.com/novarosolution/",
  },
};

export const seedHero = {
  eyebrow: "Digital product studio",
  headline: "Software, intelligence and growth,",
  headlineAccent: "engineered as one.",
  lede:
    "Novaro Solution builds production-grade web apps, AI systems, and digital marketing engines for companies that want to move fast and look the part.",
  ctaPrimary: "See our work",
  ctaSecondary: "Book a call",
  metaStat: "50+",
  metaLabel: "products shipped",
};

export const seedCta = {
  homeTitle: "Let's build something worth showing off.",
  homeDescription:
    "Tell us what you're working on. We'll come back within one business day with a way forward.",
  servicesTitle: "Not sure where to start?",
  servicesDescription:
    "Tell us the problem and we'll tell you the shortest path to a result.",
  workTitle: "Have a project in mind?",
  workDescription:
    "Share a brief — we'll reply with a clear plan, timeline, and team fit.",
  aboutTitle: "Let's build something worth shipping.",
  aboutDescription:
    "Share what you're working on — we'll reply within one business day with a clear path forward.",
  contactTitle: "Let's talk about your project.",
  contactDescription:
    "Fill in the form and we'll get back within one business day.",
};

export const seedNavLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const seedMarqueeItems = [
  "Next.js",
  "Machine Learning",
  "React",
  "Node & Express",
  "Cloud & DevOps",
  "Performance Marketing",
  "UI / UX Design",
  "Data Engineering",
];

export const seedCapabilities = [
  "Cloud & DevOps",
  "UI / UX Design",
  "Data Engineering",
  "API & Integrations",
];

export const seedProcessSteps = [
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
];

export const seedHomeStats = [
  { value: 50, suffix: "+", label: "Products shipped" },
  { value: 32, suffix: "+", label: "Happy clients" },
  { value: 6, suffix: " yrs", label: "Building products" },
  { value: 98, suffix: "%", label: "Client retention" },
];

export const seedAboutStats = [
  { value: 50, suffix: "+", label: "Products shipped" },
  { value: 32, suffix: "+", label: "Happy clients" },
  { value: 14, suffix: "", label: "People on the team" },
  { value: 6, suffix: " yrs", label: "Building products" },
];

export const seedWhyItems = [
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
      "Production code from day one, with architecture that grows when you do — not a prototype dressed up for pitch day.",
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
];

export const seedAboutPage = {
  introLine: "We build digital products that earn trust — and keep earning it.",
  whoWeAre: {
    eyebrow: "Who we are",
    title: "A senior studio that ships\nwith you, not around you.",
    body:
      "Novaro Solution is an IT studio in Gandhinagar focused on web and app engineering, AI/ML, and digital marketing. We're builders first — fewer hand-offs, more ownership, and software that holds up in production long after launch day.",
  },
  missionVision: {
    eyebrow: "Mission & vision",
    missionLabel: "Mission",
    mission:
      "Ship software, intelligence, and growth programs that move real business metrics — with craftsmanship you can see in the details.",
    visionLabel: "Vision",
    vision:
      "To be the team founders call when the stakes are high and the roadmap has to ship — known for depth across engineering, AI, and growth under one roof.",
  },
  timeline: {
    eyebrow: "Our story",
    title: "From a small studio\nto a trusted partner.",
    milestones: [
      {
        year: "2019",
        title: "Founded",
        text:
          "Novaro started as a tight-knit studio tired of work bouncing between agencies and dev shops — one team, one standard.",
      },
      {
        year: "2021",
        title: "AI in production",
        text:
          "We shipped our first ML features to production for healthcare and fintech clients — evaluation, pipelines, and humans in the loop.",
      },
      {
        year: "2023",
        title: "Full-stack growth",
        text:
          "We added a dedicated marketing practice so code and campaigns share the same strategy, data, and accountability.",
      },
      {
        year: "Today",
        title: "Scaling with intent",
        text:
          "Fifty-plus products shipped, a senior squad, and long-term partnerships across India and beyond — still small by choice.",
      },
    ],
  },
  values: {
    eyebrow: "Core values",
    title: "What we won't compromise on.",
    items: [
      {
        icon: "spark",
        title: "Craft over hype",
        description:
          "We polish the details users feel — performance, accessibility, and code you can extend without fear.",
      },
      {
        icon: "shield",
        title: "Ownership end-to-end",
        description:
          "One accountable team from architecture to analytics. No mystery vendors, no blame ping-pong.",
      },
      {
        icon: "compass",
        title: "Clarity in complexity",
        description:
          "We translate hard technical choices into plain language so you can decide with confidence.",
      },
      {
        icon: "chart",
        title: "Measure what matters",
        description:
          "We tie our work to outcomes — retention, conversion, latency, revenue — not slide decks.",
      },
    ],
  },
  stats: {
    eyebrow: "By the numbers",
    title: "Proof in the work.",
  },
  team: {
    eyebrow: "The team",
    title: "The people behind the work.",
    description:
      "Senior practitioners across engineering, AI, design, and growth — aligned on shipping, not theatre.",
  },
  whyUs: {
    eyebrow: "Why Novaro",
    title: "What sets us apart.",
  },
  cta: {
    eyebrow: "Let's build something",
    buttonLabel: "Start a project",
  },
};

export const seedServicesGrid = [
  {
    id: "01",
    slug: "web-app-eng",
    title: "Web & App Engineering",
    shortDescription:
      "Production-grade web and mobile apps built on Next.js and Node — fast, scalable, and made to ship and last.",
    tags: ["Next.js", "Express", "SaaS", "Mobile"],
    icon: "monitor",
  },
  {
    id: "02",
    slug: "ai-machine-ml",
    title: "AI & Machine Learning",
    shortDescription:
      "Models, pipelines, and intelligent features that turn your data into decisions, automation, and real product value.",
    tags: ["LLM apps", "Computer vision", "Pipelines"],
    icon: "ai",
  },
  {
    id: "03",
    slug: "digital-marketing",
    title: "Digital Marketing",
    shortDescription:
      "SEO, performance campaigns, and brand systems that put your product in front of the right people at the right moment.",
    tags: ["SEO", "Paid ads", "Analytics", "Brand"],
    icon: "chart",
  },
  {
    id: "04",
    slug: "cloud-devops",
    title: "Cloud, DevOps & Design",
    shortDescription:
      "Cloud architecture, CI/CD, observability, and design systems that keep products reliable, secure, and beautiful at scale.",
    tags: ["AWS", "GCP", "CI/CD", "Design systems"],
    icon: "cloud",
  },
];

export const seedServiceDetails = [
  {
    no: "01",
    slug: "web-app-eng",
    title: "Web & App Engineering",
    description:
      "We design and ship production web and mobile products on a modern Next.js and Node stack — typed, tested, accessible, and ready for real traffic from day one.",
    bullets: [
      "SaaS platforms and customer dashboards",
      "Cross-platform mobile and responsive web",
      "API, backend, and integration layers",
      "Performance, security, and accessibility audits",
    ],
    image: "/images/webapp-dashboard.webp",
    imageAlt:
      "Web and app engineering services — glassmorphic dashboard on a laptop with navy and cyan UI",
  },
  {
    no: "02",
    slug: "ai-machine-ml",
    title: "AI & Machine Learning",
    description:
      "From first prototype to production model, we build intelligent features with proper evaluation, data pipelines, monitoring, and humans firmly in the loop.",
    bullets: [
      "LLM apps, assistants, and retrieval workflows",
      "Computer vision and document intelligence",
      "Forecasting, recommendations, and ranking",
      "MLOps, evaluation, and model monitoring",
    ],
    image: "/images/ai-ml-dashboard.webp",
    imageAlt:
      "AI and machine learning services — neural network visualization with glassmorphic panels",
  },
  {
    no: "03",
    slug: "digital-marketing",
    title: "Digital Marketing",
    description:
      "We connect product and pipeline — technical SEO, performance campaigns, and analytics that tie every rupee of spend to qualified leads and revenue.",
    bullets: [
      "Technical SEO and content systems",
      "Paid search, social, and lifecycle campaigns",
      "Landing pages and conversion optimization",
      "Brand, creative, and analytics setup",
    ],
    image: "/images/digital-marketing-dashboard.webp",
    imageAlt:
      "Digital marketing services — analytics dashboard with campaign performance panels",
  },
  {
    no: "04",
    slug: "cloud-devops",
    title: "Cloud, DevOps & Design",
    description:
      "The foundation that keeps everything reliable and polished — cloud architecture, CI/CD, observability, design systems, and UX your team can ship with.",
    bullets: [
      "Cloud architecture on AWS and GCP",
      "CI/CD, observability, and incident response",
      "Design systems and product UI/UX",
      "Security reviews and compliance readiness",
    ],
    image: null,
    imageAlt:
      "Cloud, DevOps, and design services — infrastructure and design system preview",
  },
];

export const seedServicesPage = {
  introLine: "Engineering, intelligence, and growth — built to ship.",
  introSubline:
    "Four practices. One accountable team. Production software, AI that holds up, and marketing that moves the numbers.",
  introStats: [
    { value: 4, suffix: "", label: "Core practices" },
    { value: 50, suffix: "+", label: "Products shipped" },
    { value: 6, suffix: " yrs", label: "Building products" },
  ],
  capabilities: {
    eyebrow: "Capabilities",
    title: "Everything that supports a product at scale.",
  },
  process: {
    eyebrow: "How we work",
    title: "A clear path from idea to impact.",
    lede:
      "No black boxes. Every engagement runs through the same four stages so you always know what's happening and why.",
  },
  cta: {
    eyebrow: "Let's talk",
    buttonLabel: "Book a call",
  },
  serviceExtras: {
    "web-app-eng": {
      outcomes: [
        "Ship faster with production-ready architecture from sprint one",
        "Core Web Vitals and accessibility baked in before launch",
        "A codebase your team can extend without rewriting",
      ],
      relatedLinks: [
        { label: "FinFlow fintech case study", href: "/work" },
        { label: "How we ship with Next.js", href: "/blog/ship-fast-stack" },
      ],
    },
    "ai-machine-ml": {
      outcomes: [
        "Models evaluated against real metrics, not demo accuracy",
        "Pipelines that survive scale, drift, and compliance reviews",
        "Human-in-the-loop workflows clinicians and ops teams trust",
      ],
      relatedLinks: [
        { label: "MediSense healthcare AI project", href: "/work" },
        { label: "Shipping AI to production", href: "/blog/ai-prod-apps" },
      ],
    },
    "digital-marketing": {
      outcomes: [
        "Qualified traffic that converts — not vanity clicks",
        "Spend tied to revenue with clean attribution",
        "Brand and performance working from the same playbook",
      ],
      relatedLinks: [
        { label: "Aurora Commerce growth story", href: "/work" },
        { label: "Technical SEO that ranks", href: "/blog/tech-seo-tips" },
      ],
    },
    "cloud-devops": {
      outcomes: [
        "Infrastructure that scales without fire drills",
        "Design systems that keep UX consistent as you ship",
        "Security and observability built in, not bolted on",
      ],
      relatedLinks: [
        { label: "Helio CRM platform build", href: "/work" },
        { label: "Talk to us about your stack", href: "/contact" },
      ],
    },
  },
};

export const seedWorkProjects = [
  {
    idx: "01",
    slug: "finflow",
    category: "Web App · Fintech",
    title: "FinFlow",
    hook:
      "A real-time payments dashboard handling 2M+ monthly transactions with sub-second insights.",
    heroTitle: "Project hero — FinFlow",
    story:
      "We rebuilt FinFlow from a slow legacy stack into a Next.js + Express platform with a streaming data layer. Treasury teams now see balances, flows, and anomalies update live, with role-based controls and an audit trail baked in.",
    coverClass: "c1",
    screens: ["Screen 1", "Screen 2", "Screen 3"],
    results: [
      { value: "-72%", label: "load time" },
      { value: "2M+", label: "txns / month" },
      { value: "99.98%", label: "uptime" },
    ],
    tags: ["Next.js", "Express", "PostgreSQL", "WebSockets", "AWS"],
  },
  {
    idx: "02",
    slug: "medisense",
    category: "AI / ML · Healthcare",
    title: "MediSense",
    hook:
      "A diagnostic assistant that reads scans and flags anomalies for clinicians in seconds.",
    heroTitle: "Project hero — MediSense",
    story:
      "MediSense pairs a computer-vision model with a clean review workflow. Radiologists get ranked findings with confidence scores and heat-maps, cutting first-read time while keeping a human firmly in the loop.",
    coverClass: "c2",
    screens: ["Screen 1", "Screen 2", "Screen 3"],
    results: [
      { value: "8s", label: "avg read" },
      { value: "+34%", label: "throughput" },
      { value: "HIPAA", label: "compliant" },
    ],
    tags: ["PyTorch", "Computer vision", "FastAPI", "Next.js"],
  },
  {
    idx: "03",
    slug: "aurora-commerce",
    category: "Marketing · D2C",
    title: "Aurora Commerce",
    hook:
      "A growth engine that lifted qualified traffic 240% and tripled return on ad spend.",
    heroTitle: "Project hero — Aurora Commerce",
    story:
      "We rebuilt the Aurora funnel end to end — technical SEO, a new content system, and a performance-ad program wired to clean analytics — so spend follows what actually converts.",
    coverClass: "c3",
    screens: ["Screen 1", "Screen 2", "Screen 3"],
    results: [
      { value: "+240%", label: "organic traffic" },
      { value: "3.1x", label: "ROAS" },
      { value: "-38%", label: "CAC" },
    ],
    tags: ["SEO", "Paid social", "GA4", "CRO"],
  },
  {
    idx: "04",
    slug: "helio-crm",
    category: "Web App · SaaS",
    title: "Helio CRM",
    hook:
      "A multi-tenant CRM platform built to scale from first customer to enterprise rollout.",
    heroTitle: "Project hero — Helio CRM",
    story:
      "Helio needed to go from prototype to product. We designed the multi-tenant architecture, billing, and a component system that lets their team ship features without breaking the experience.",
    coverClass: "c4",
    screens: ["Screen 1", "Screen 2", "Screen 3"],
    results: [
      { value: "10x", label: "faster onboarding" },
      { value: "500+", label: "tenants" },
      { value: "SOC 2", label: "ready" },
    ],
    tags: ["Next.js", "Stripe", "PostgreSQL", "Design system"],
  },
];

export const seedTeam = [
  { name: "Founder / CEO", role: "Strategy & Product" },
  { name: "Engineering Lead", role: "Web & Cloud" },
  { name: "AI Lead", role: "ML & Data" },
  { name: "Growth Lead", role: "Marketing & SEO" },
];

export const seedContactOptions = {
  services: ["Web / App", "AI / ML", "Marketing", "Cloud / DevOps", "Design"],
  budgetRanges: ["Under ₹5L", "₹5L – ₹15L", "₹15L – ₹40L", "₹40L+"],
};

export const seedServicesSection = {
  eyebrow: "What we do",
  title: "Three core practices, one accountable team.",
  description:
    "From first line of code to the campaign that brings users in, we own the whole stack so nothing falls through the gaps.",
};

export const seedWhySection = {
  title: "Senior people. One team. Real ownership.",
};

export const seedTeamSection = {
  description:
    "Senior practitioners across engineering, AI, design, and growth — aligned on shipping, not theatre.",
};
