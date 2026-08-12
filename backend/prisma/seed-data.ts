/**
 * Seed data mirrored from frontend/src/lib/site-data.ts
 * plus inline copy from Hero / pages where noted.
 */

export const seedSite = {
  name: "Novaro Solution",
  tagline: "Software · Intelligence · Growth",
  description:
    "A Gandhinagar-based digital product studio — we design, build, and grow web apps, AI systems, and marketing engines for startups and established brands across India.",
  email: "novaro@novarosolution.com",
  phone: "+91 96244 98325",
  location: "Gandhinagar, Gujarat, India",
  businessHours: "Mon–Sat · 10:00 AM – 7:00 PM IST",
  responseTime: "We reply within one business day",
  founded: 2024,
  geo: {
    latitude: 23.2156,
    longitude: 72.6369,
    region: "IN-GJ",
    placename: "Gandhinagar, Gujarat, India",
    postalCode: "382010",
    streetAddress: "Gandhinagar, Gujarat",
    addressLocality: "Gandhinagar",
    addressRegion: "Gujarat",
    addressCountry: "IN",
    timezone: "Asia/Kolkata",
  },
  serviceAreas: [
    "Gandhinagar",
    "Ahmedabad",
    "GIFT City",
    "Vadodara",
    "Surat",
    "Rajkot",
    "Gujarat",
    "India",
    "Worldwide (Remote)",
  ],
  industries: [
    "D2C & E-commerce",
    "Logistics & Supply Chain",
    "Healthcare & Services",
    "Fintech & SaaS",
    "Education & EdTech",
  ],
  social: {
    linkedin: "https://www.linkedin.com/company/novaro-solution",
    x: "#",
    github: "#",
    instagram: "https://www.instagram.com/novarosolution/",
  },
};

export const seedHero = {
  eyebrow: "Digital product studio · Gandhinagar, Gujarat",
  headline: "We engineer products",
  headlineAccent: "that earn trust.",
  lede:
    "Novaro builds production-grade web and mobile apps, AI systems that survive real users, and digital marketing that moves revenue — one senior team from discovery to launch and beyond.",
  ctaPrimary: "See our work",
  ctaSecondary: "Book a call",
  metaStat: "32",
  metaLabel: "Clients served",
};

export const seedCta = {
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
  { value: 2, suffix: " yrs", label: "Shipping production software" },
  { value: 32, suffix: "+", label: "Clients across India & abroad" },
  { value: 50, suffix: "+", label: "Products & platforms delivered" },
  { value: 98, suffix: "%", label: "Clients who return for phase two" },
];

export const seedAboutStats = [
  { value: 2, suffix: " yrs", label: "Shipping production software" },
  { value: 32, suffix: "+", label: "Clients across India & abroad" },
  { value: 8, suffix: "", label: "People on the team" },
  { value: 98, suffix: "%", label: "Clients who return for phase two" },
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
  introTitle: "NOVARO",
  introAccent: "ABOUT",
  introLine: "We build digital products that earn trust — and keep earning it after launch.",
  whoWeAre: {
    eyebrow: "Who we are",
    title: "A senior studio that ships\nwith you, not around you.",
    body:
      "Novaro Solution is an IT studio headquartered in Gandhinagar, Gujarat. We specialise in web and app engineering, AI/ML, and digital marketing — helping founders and brands ship products that perform in production, not just in pitch decks. In two years we've delivered 50+ platforms for clients in D2C, logistics, healthcare, and services — with one accountable team from first wireframe to post-launch growth.",
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
        year: "2024",
        title: "Founded",
        text:
          "Kuldip Chaudhary, Mehul Chaudhary, and Ronak Prajapati founded Novaro in Gandhinagar — one focused studio shipping web, app, and AI products without the agency hand-off cycle.",
      },
      {
        year: "2025",
        title: "AI in production",
        text:
          "We brought AI/ML and digital marketing in-house so intelligent features and growth campaigns share the same strategy and codebase.",
      },
      {
        year: "Today",
        title: "Two years in",
        text:
          "Two years of shipping production software for clients across fintech, healthcare, and D2C — still small by choice, still hands-on.",
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
    eyebrow: "Our people",
    title: "Founders, leaders & the team.",
    description:
      "Co-founders Kuldip Chaudhary, Mehul Chaudhary, and Ronak Prajapati built Novaro to ship products with real accountability. Alpesh Prajapati manages operations and delivery. Maulik, Krina, Sonal, and Abhi are the engineers, designers, and marketers who bring every roadmap to life.",
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
  introTitle: "NOVARO",
  introAccent: "SERVICES",
  introLine: "Engineering, intelligence, and growth — built to ship.",
  introSubline:
    "Four practices. One accountable team. Production software, AI that holds up, and marketing that moves the numbers.",
  introStats: [
    { value: 4, suffix: "", label: "Core practices" },
    { value: 2, suffix: " yrs", label: "Years of experience" },
    { value: 32, suffix: "+", label: "Happy clients" },
  ],
  capabilities: {
    eyebrow: "Capabilities",
    title: "Everything that supports a product at scale.",
    lede:
      "Beyond our four core practices, we bring the surrounding craft — infrastructure, design systems, data, and growth instrumentation — so your product holds up after launch.",
    items: [
      {
        icon: "cloud",
        title: "Cloud & DevOps",
        description:
          "CI/CD, infra as code, and observability stacks that survive launch-day traffic spikes.",
      },
      {
        icon: "palette",
        title: "UI / UX Design",
        description:
          "Design systems, prototypes, and interfaces that feel fast before they are fast.",
      },
      {
        icon: "database",
        title: "Data Engineering",
        description:
          "Pipelines, warehouses, and analytics layers your product team can trust.",
      },
      {
        icon: "plug",
        title: "API & Integrations",
        description:
          "REST, GraphQL, webhooks, and third-party connections built for change.",
      },
      {
        icon: "shield",
        title: "Security & Compliance",
        description:
          "Auth, encryption, audit trails, and policies aligned to your industry.",
      },
      {
        icon: "gauge",
        title: "Performance & SEO",
        description:
          "Core Web Vitals, caching, and technical SEO baked into every release.",
      },
      {
        icon: "chart",
        title: "Analytics & Growth",
        description:
          "Event tracking, funnels, and dashboards tied to revenue — not vanity metrics.",
      },
      {
        icon: "smartphone",
        title: "Mobile Engineering",
        description:
          "Responsive and cross-platform builds that ship on schedule and feel native.",
      },
    ],
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
        { label: "Quadrato Cargo logistics platform", href: "https://www.quadratocargo.com/" },
        { label: "Mr Antidot service platform", href: "https://www.mrantidot.com/" },
      ],
    },
    "ai-machine-ml": {
      outcomes: [
        "Models evaluated against real metrics, not demo accuracy",
        "Pipelines that survive scale, drift, and compliance reviews",
        "Human-in-the-loop workflows clinicians and ops teams trust",
      ],
      relatedLinks: [
        { label: "Mr Antidot operations platform", href: "https://www.mrantidot.com/" },
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
        { label: "Zeevan premium D2C storefront", href: "https://www.zeevan.shop/" },
        { label: "KankreG brand commerce site", href: "https://www.kankreg.com/" },
      ],
    },
    "cloud-devops": {
      outcomes: [
        "Infrastructure that scales without fire drills",
        "Design systems that keep UX consistent as you ship",
        "Security and observability built in, not bolted on",
      ],
      relatedLinks: [
        { label: "Quadrato Cargo platform build", href: "https://www.quadratocargo.com/" },
        { label: "Talk to us about your stack", href: "/contact" },
      ],
    },
  },
};

export const seedWorkProjects = [
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
    coverClass: "c1",
    heroImage: "/images/work/zeevan.jpg",
    screens: ["/images/work/zeevan.jpg"],
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
    coverClass: "c2",
    heroImage: "/images/work/kankreg.jpg",
    screens: ["/images/work/kankreg.jpg"],
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
    coverClass: "c3",
    heroImage: "/images/work/mr-antidot.jpg",
    screens: ["/images/work/mr-antidot.jpg"],
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
    coverClass: "c4",
    heroImage: "/images/work/quadrato-cargo.jpg",
    screens: ["/images/work/quadrato-cargo.jpg"],
    results: [
      { value: "180", label: "countries" },
      { value: "10K+", label: "deliveries" },
      { value: "~10 min", label: "pickup target" },
    ],
    tags: ["Next.js", "Booking", "Tracking", "Logistics"],
  },
];

export const seedTeam = [
  { name: "Kuldip Chaudhary", role: "Co-Founder · Engineering" },
  { name: "Mehul Chaudhary", role: "Co-Founder · Food Safety & Quality Assurance" },
  { name: "Ronak Prajapati", role: "Co-Founder · Technology" },
  { name: "Alpesh Prajapati", role: "Manager · Operations & Delivery" },
  { name: "Maulik Chaudhary", role: "Software Developer" },
  { name: "Krina Patel", role: "Python Developer" },
  { name: "Sonal Chaudhary", role: "Digital Marketing Specialist" },
  { name: "Abhi Joshi", role: "Finance & Business Automation" },
];

export const seedContactOptions = {
  services: ["Web / App", "AI / ML", "Marketing", "Cloud / DevOps", "Design"],
  budgetRanges: ["Under ₹5L", "₹5L – ₹15L", "₹15L – ₹40L", "₹40L+"],
};

export const seedServicesSection = {
  eyebrow: "What we do",
  title: "Four core practices.\nOne accountable team.",
  description:
    "Web and app engineering, AI/ML, and digital marketing under one roof — so nothing falls through the gaps between build and growth.",
};

export const seedWhySection = {
  title: "Senior people. One team. Real ownership.",
};

export const seedTeamSection = {
  description:
    "Co-founders Kuldip Chaudhary, Mehul Chaudhary, and Ronak Prajapati built Novaro to ship products with real accountability. Alpesh Prajapati manages operations and delivery. Maulik, Krina, Sonal, and Abhi are the engineers, designers, and marketers who bring every roadmap to life.",
};
