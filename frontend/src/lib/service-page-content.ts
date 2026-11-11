/**
 * Long-form copy for the four service pages (/services/[slug]).
 *
 * Kept in code rather than the CMS so the page structure stays complete:
 * intro → problems → approach → scope → technologies → process → benefits and
 * examples → case studies → FAQs → related services → CTA.
 *
 * Only facts the site already publishes are used here (timelines, pricing
 * approach, stack, real case studies). Examples are labelled as illustrations,
 * not client results. See docs/on-page-keyword-map.md for the keyword mapping.
 */

export type ServiceCopyItem = { title: string; body: string };

export type ServiceExample = ServiceCopyItem & { href?: string; linkLabel?: string };

export type ServicePageContent = {
  slug: string;
  /** Short name used in breadcrumbs, cards and anchors. */
  name: string;
  /** Visible H1. */
  h1: string;
  /** <title> text; the brand is appended by createPageMetadata. */
  seoTitle: string;
  metaDescription: string;
  eyebrow: string;
  /** One- or two-sentence summary under the H1. */
  lede: string;
  keywords: string[];
  intro: { title: string; paragraphs: string[] };
  problems: { title: string; items: ServiceCopyItem[] };
  approach: { title: string; items: ServiceCopyItem[] };
  scope: { title: string; items: ServiceCopyItem[] };
  technologies: Array<{ group: string; items: string[] }>;
  process: { title: string; steps: ServiceCopyItem[]; note: string };
  benefits: { title: string; items: ServiceCopyItem[] };
  examples: { title: string; lede?: string; items: ServiceExample[] };
  caseStudies: { title: string; lede?: string; items: Array<{ slug: string; note: string }> };
  faqTitle: string;
  faqs: Array<{ question: string; answer: string }>;
  related: string[];
  /** One line used when another service page links here. */
  cardSummary: string;
  cta: { title: string; description: string; buttonLabel: string };
};

const webAppEng: ServicePageContent = {
  slug: "web-app-eng",
  name: "Web & mobile app development",
  h1: "Web and mobile app development services",
  seoTitle: "Web & Mobile App Development Services",
  metaDescription:
    "Custom web apps, SaaS platforms and mobile apps built on Next.js and Node.js by one team in Gandhinagar, India, with a working build every week.",
  eyebrow: "Services · Web & app engineering",
  lede:
    "We design and build web applications, SaaS platforms, customer portals and mobile apps: the screens your customers use, the admin panel your staff run the business from, and the API in between.",
  keywords: [
    "web app development services",
    "mobile app development",
    "web application development company",
    "SaaS MVP development",
    "custom software development",
    "Next.js development",
  ],
  intro: {
    title: "Software your customers and staff log into every day",
    paragraphs: [
      "Most of our projects start when a business has outgrown spreadsheets, a website template or a tool that almost fits. We build the product around the way your team actually works, and connect it to the payments, email and services you already use.",
      "Everything is written in TypeScript on Next.js and Node.js, so one team owns the whole build. You see a working version every week instead of a demo at the end, and the code, designs and documentation are yours at launch.",
    ],
  },
  problems: {
    title: "Problems this service solves",
    items: [
      {
        title: "Work is stuck in spreadsheets and chat",
        body: "Orders, bookings or approvals live in shared sheets and message threads, so nobody sees the current status and mistakes surface late.",
      },
      {
        title: "Off-the-shelf tools almost fit",
        body: "You pay for several subscriptions and still copy data between them, because none of them matches how your business runs.",
      },
      {
        title: "An existing app is slow or hard to change",
        body: "Pages load slowly on phones, small changes take weeks, and the original developers are no longer around to explain the code.",
      },
      {
        title: "An idea needs a first release",
        body: "You need a version people can sign up to and use, without a long build that tries to do everything at once.",
      },
    ],
  },
  approach: {
    title: "How we solve them",
    items: [
      {
        title: "Start from the workflow",
        body: "We map who does what, and in which order, before designing screens. The first release covers the loop people repeat every day; extra roles and integrations follow once that loop is in use.",
      },
      {
        title: "One team across the stack",
        body: "Front end, API, database and admin panel are built by the same engineers, so nothing is lost between agencies.",
      },
      {
        title: "A working build every week",
        body: "You review the real product as it grows, not slides, and can change direction while it is still cheap to do so.",
      },
      {
        title: "Built to be maintained",
        body: "Typed code, a readable structure and documentation mean your own team, or another vendor, can extend the product after launch.",
      },
    ],
  },
  scope: {
    title: "What's included",
    items: [
      {
        title: "Web applications and SaaS platforms",
        body: "Customer dashboards, booking and order systems, and multi-user products with accounts, roles and billing.",
      },
      {
        title: "Mobile apps",
        body: "A responsive web app when the workflow is still changing; a cross-platform store app when the product needs the camera, offline use or push notifications.",
      },
      {
        title: "APIs, back ends and integrations",
        body: "REST and GraphQL APIs, databases, payment gateways, email and the third-party services your business already relies on.",
      },
      {
        title: "Admin panels and content management",
        body: "Tools your staff use to manage orders, content, users and reports without asking a developer.",
      },
      {
        title: "E-commerce storefronts",
        body: "D2C stores with product storytelling, a fast mobile checkout and an SEO-ready structure.",
      },
      {
        title: "Audits and rebuilds",
        body: "Performance, security and accessibility reviews of an existing app, followed by fixes or a phased rebuild.",
      },
    ],
  },
  technologies: [
    { group: "Front end", items: ["Next.js", "React", "TypeScript"] },
    { group: "Mobile & cross-platform", items: ["Expo", "React Native"] },
    { group: "Back end & APIs", items: ["Node.js", "Express", "Prisma", "REST & GraphQL"] },
    { group: "Data & hosting", items: ["MongoDB", "PostgreSQL", "Cloudinary", "Vercel", "AWS", "GCP"] },
  ],
  process: {
    title: "How a web or app project runs",
    steps: [
      {
        title: "Discovery call",
        body: "A 30-minute call about the problem, the users and the deadline, followed by a scoped proposal, usually within 2–3 business days.",
      },
      {
        title: "Workflow and design",
        body: "User flows, the data model and screen designs you can react to before the build starts.",
      },
      {
        title: "Weekly build sprints",
        body: "Features land in a working version every week, in the order agreed in the plan.",
      },
      {
        title: "Launch and handover",
        body: "Production release, monitoring, and a handover with documentation and training.",
      },
      {
        title: "Support and iteration",
        body: "An optional monthly retainer for fixes, new features and performance work.",
      },
    ],
    note: "Typical timelines: MVPs and web apps take 8–14 weeks; larger platforms with AI, admin panels and integrations take 12–20 weeks. You get a week-by-week plan before kickoff.",
  },
  benefits: {
    title: "What you get",
    items: [
      {
        title: "A product you own",
        body: "Code, designs and documentation are handed over at launch. Support is optional, never a lock-in.",
      },
      {
        title: "Fast on phones",
        body: "Page speed and Core Web Vitals are checked before launch, because most users arrive on mobile.",
      },
      {
        title: "Fewer manual steps",
        body: "When the workflow lives in one system, data is entered once and everyone sees the same status.",
      },
    ],
  },
  examples: {
    title: "Practical examples",
    lede: "How we usually approach three common requests.",
    items: [
      {
        title: "SaaS MVP",
        body: "The first release is the workflow people repeat: accounts, the main screens and one admin view. Extra roles and integrations wait until that loop is in use.",
        href: "/blog/saas-mvp-cost-factors",
        linkLabel: "What changes the cost of an MVP",
      },
      {
        title: "Mobile app or web app?",
        body: "When the phone is the product (camera, offline use or push notifications) we build a store app. When the workflow is still changing, a responsive web app ships first and the store build follows.",
      },
      {
        title: "Booking and tracking platforms",
        body: "A product with bookings, live status and an operations dashboard is a web application, not a website theme. Quadrato Cargo is an example.",
        href: "/work/quadrato-cargo",
        linkLabel: "Quadrato Cargo case study",
      },
    ],
  },
  caseStudies: {
    title: "Web and app case studies",
    items: [
      { slug: "quadrato-cargo", note: "Pickup booking, live shipment tracking and quote requests for an international courier." },
      { slug: "mr-antidot", note: "Service catalogue, pricing tiers, sector pages and lead capture for a hygiene and pest-control company." },
      { slug: "zeevan", note: "A D2C pantry store built with Expo, with shop filters, accounts and order tracking." },
    ],
  },
  faqTitle: "Questions about web and app projects",
  faqs: [
    {
      question: "How long does it take to build a web app?",
      answer:
        "Most MVPs and web apps take 8–14 weeks. Larger platforms with admin panels, AI features and integrations take 12–20 weeks. We share a week-by-week plan before kickoff, so you know what ships when.",
    },
    {
      question: "How much does custom web app development cost?",
      answer:
        "Fixed-scope projects are quoted after a discovery call. Budget ranges start from ₹5L for focused builds; larger platforms are phased, so you pay for one release at a time. Every proposal lists deliverables, timeline and payment milestones.",
    },
    {
      question: "Should we build a mobile app or a web app first?",
      answer:
        "If the product depends on the camera, offline use or push notifications, a store app makes sense from the start. If the workflow is still changing, a responsive web app ships faster and is cheaper to adjust; the store app can follow.",
    },
    {
      question: "Who owns the code?",
      answer: "You do. Code, designs and documentation are handed over at launch. Support retainers are optional.",
    },
    {
      question: "Can you take over an existing app?",
      answer:
        "Yes. We start by reviewing the code, hosting and open issues, then recommend whether to fix what is there or rebuild in phases.",
    },
    {
      question: "Do you work with companies outside India?",
      answer:
        "Yes. Our studio is in Gandhinagar and we work remotely with clients in India, the USA, the UK, Europe and the Middle East. Calls are scheduled in the overlap between your working day and ours.",
    },
  ],
  related: ["ai-machine-ml", "cloud-devops", "digital-marketing"],
  cardSummary: "Web apps, SaaS platforms, mobile apps, APIs and admin panels.",
  cta: {
    title: "Planning a web or mobile app?",
    description:
      "Send a short brief. We reply within one business day with questions, a suggested first release and a timeline.",
    buttonLabel: "Start Your Project",
  },
};

const aiMachineMl: ServicePageContent = {
  slug: "ai-machine-ml",
  name: "AI & machine learning",
  h1: "AI and machine learning development services",
  seoTitle: "AI & Machine Learning Development Services",
  metaDescription:
    "AI development for real business workflows: document extraction, search over your own files and LLM features, with evaluation and a person in the loop.",
  eyebrow: "Services · AI & machine learning",
  lede:
    "We add AI to work your team already does by hand, such as reading documents, answering questions from your own files and routing requests, with a measure of accuracy and a person reviewing what the model is unsure about.",
  keywords: [
    "AI development services",
    "machine learning development",
    "AI document extraction",
    "LLM application development",
    "AI search over company documents",
    "AI development company India",
  ],
  intro: {
    title: "AI features with a job, a measure and a fallback",
    paragraphs: [
      "Useful AI projects start with one task that costs your team time today: typing data out of invoices, searching old documents for an answer, or sorting incoming requests. We build that feature into your product or internal tools, measure how often it is right on your own data, and send uncertain cases to a person.",
      "We work with OpenAI models, LangChain and custom Python pipelines, and keep the prompts, data flow and evaluation in your codebase, so the feature can be checked and improved after launch.",
    ],
  },
  problems: {
    title: "Problems this service solves",
    items: [
      {
        title: "Manual data entry from documents",
        body: "Staff retype details from invoices, forms, PDFs or scans into another system, which is slow and error-prone.",
      },
      {
        title: "Knowledge that is hard to find",
        body: "Answers sit in contracts, manuals, tickets and shared drives, and only a few people know where to look.",
      },
      {
        title: "Repetitive triage",
        body: "Every enquiry, ticket or order has to be read and routed by hand before anyone can act on it.",
      },
      {
        title: "AI pilots that never reach production",
        body: "A demo worked on a few examples, but nobody measured accuracy, cost, or what happens when the model is wrong.",
      },
    ],
  },
  approach: {
    title: "How we solve them",
    items: [
      {
        title: "Pick one measurable task",
        body: "We agree what the feature does, how success is measured and what the fallback is before writing code.",
      },
      {
        title: "Test on your own data",
        body: "A short pilot runs on a sample of your real documents or questions, so accuracy is measured on your data rather than a vendor demo.",
      },
      {
        title: "Keep a person in the loop",
        body: "Low-confidence results go to a review queue. Staff approve or correct them, and corrections feed the next round of evaluation.",
      },
      {
        title: "Ship it where people work",
        body: "The feature runs inside your app, admin panel or internal tool, with logging and usage-cost tracking.",
      },
    ],
  },
  scope: {
    title: "What's included",
    items: [
      {
        title: "Document extraction",
        body: "Fields pulled from invoices, forms, receipts and scanned PDFs into structured data your systems can use.",
      },
      {
        title: "Search and assistants over your content",
        body: "Question answering over manuals, policies, tickets and knowledge bases, with links back to the source.",
      },
      {
        title: "Classification and routing",
        body: "Enquiries, tickets and documents sorted by type, urgency or owner.",
      },
      {
        title: "LLM features in existing apps",
        body: "Summaries, drafts and assistants added to a product you already run.",
      },
      {
        title: "Computer vision, forecasting and recommendations",
        body: "Image checks, demand forecasts and ranking models, where you have the data to support them.",
      },
      {
        title: "Evaluation and monitoring",
        body: "Test sets, accuracy and cost tracking, and alerts once the feature is live.",
      },
    ],
  },
  technologies: [
    { group: "Models & frameworks", items: ["OpenAI", "LangChain", "Python"] },
    { group: "Pipelines", items: ["Custom ML pipelines", "Data pipelines", "Evaluation sets"] },
    { group: "App layer", items: ["Next.js", "Node.js", "TypeScript"] },
    { group: "Data", items: ["PostgreSQL", "MongoDB"] },
  ],
  process: {
    title: "How an AI project runs",
    steps: [
      {
        title: "Discovery call",
        body: "We look at the task, the documents or data involved, and how the result will be used.",
      },
      {
        title: "Pilot on your data",
        body: "A small, time-boxed build on a sample of real inputs, scored against answers your team has checked.",
      },
      {
        title: "Production build",
        body: "Integration into your app, a review queue for uncertain results, logging and access control.",
      },
      {
        title: "Launch and monitoring",
        body: "Accuracy, cost and volume tracked after launch, with the test set re-run whenever prompts or models change.",
      },
    ],
    note: "The pilot is scoped after the discovery call. Full platforms with AI, admin panels and integrations typically take 12–20 weeks.",
  },
  benefits: {
    title: "What you get",
    items: [
      {
        title: "Less manual work",
        body: "Staff check and correct results instead of typing everything from scratch.",
      },
      {
        title: "Accuracy you can see",
        body: "Every version is scored against a test set built from your own examples.",
      },
      {
        title: "Controlled risk",
        body: "Uncertain results go to a person, and the feature can fall back to the manual process.",
      },
    ],
  },
  examples: {
    title: "Practical examples",
    lede: "Illustrations of how these features usually work, not client results.",
    items: [
      {
        title: "Invoice and form processing",
        body: "Supplier invoices arrive as PDFs or photos. The model extracts the supplier, date, amounts and tax fields; anything below a confidence threshold goes to a person to confirm before it reaches the accounting system.",
      },
      {
        title: "Answers from your own documents",
        body: "Sales or support staff ask a question in plain language and get an answer drawn from your policies and past proposals, with a link to the source paragraph so they can check it.",
      },
      {
        title: "Enquiry triage",
        body: "Website and email enquiries are tagged by service and urgency and routed to the right person, with the original message kept alongside.",
        href: "/blog/ai-prod-apps",
        linkLabel: "Shipping AI features to production",
      },
    ],
  },
  caseStudies: {
    title: "Related work",
    lede: "We haven't published an AI case study yet. These are production platforms our team built: the kind of software an AI feature is added to.",
    items: [
      { slug: "quadrato-cargo", note: "Booking, tracking and quote flows for an international courier." },
      { slug: "mr-antidot", note: "A service platform with catalogues, pricing and lead capture." },
    ],
  },
  faqTitle: "Questions about AI projects",
  faqs: [
    {
      question: "How do you measure whether an AI feature works?",
      answer:
        "Before the build, we collect a sample of your real inputs with the correct answers, checked by your team. Each version of the feature is scored against that set, and the score is tracked after launch.",
    },
    {
      question: "What happens when the model gets it wrong?",
      answer:
        "Results below an agreed confidence level go to a review queue instead of straight into your system. A person approves or corrects them, and the feature can fall back to the manual process.",
    },
    {
      question: "Where is our data processed?",
      answer:
        "That depends on the model provider and hosting you choose. We document which services receive data, limit access to what the feature needs, and discuss providers and regions that meet your requirements during discovery.",
    },
    {
      question: "Do we need a lot of data to start?",
      answer:
        "Not for document extraction or search over your files: a representative sample is enough to build and test a pilot. Forecasting and recommendation models need historical data, and we will tell you if there isn't enough yet.",
    },
    {
      question: "Can you add AI to our existing software?",
      answer:
        "Yes. Most AI features are added to an app or internal tool you already use, rather than built as a separate product.",
    },
    {
      question: "How much does an AI project cost?",
      answer:
        "The pilot is scoped and quoted after the discovery call, and budget ranges start from ₹5L for focused builds. Model usage costs are measured during the pilot, so you can see the running cost before committing to a full build.",
    },
  ],
  related: ["web-app-eng", "cloud-devops", "digital-marketing"],
  cardSummary: "Document extraction, search over your own files and LLM features.",
  cta: {
    title: "Have a task you'd like AI to take on?",
    description:
      "Describe the task and the documents or data involved. We reply within one business day with questions and a suggested pilot.",
    buttonLabel: "Discuss Your Requirements",
  },
};

const digitalMarketing: ServicePageContent = {
  slug: "digital-marketing",
  name: "Digital marketing & SEO",
  h1: "Digital marketing and SEO services",
  seoTitle: "Digital Marketing & SEO Services",
  metaDescription:
    "Technical SEO, local SEO, Google Ads and Meta campaigns with conversion tracking, run by the team that builds your site, so the fixes actually ship.",
  eyebrow: "Services · Digital marketing",
  lede:
    "Technical and local SEO, Google Ads and Meta campaigns, landing pages and analytics, run by the same team that builds the site, so fixes ship instead of waiting in a report.",
  keywords: [
    "digital marketing and SEO services",
    "technical SEO services",
    "local SEO services",
    "Google Ads management",
    "Meta ads management",
    "conversion tracking setup",
  ],
  intro: {
    title: "Marketing that starts with a site that works",
    paragraphs: [
      "Campaigns waste money when the landing page is slow, the tracking is broken or search engines can't crawl the site properly. We fix the foundation first (page speed, site structure, titles and conversion tracking) and then run search and social campaigns aimed at enquiries and orders, not clicks.",
      "Our engineers and marketers work in one team, so the changes an SEO audit recommends are made directly in the code, and campaign landing pages can live in the same codebase as your website or app.",
    ],
  },
  problems: {
    title: "Problems this service solves",
    items: [
      {
        title: "Traffic that doesn't turn into enquiries",
        body: "Visitors arrive but don't buy or get in touch, and nobody can say which pages or campaigns are working.",
      },
      {
        title: "A site search engines struggle with",
        body: "Duplicate titles, slow pages, broken links or content hidden behind scripts keep pages out of search results.",
      },
      {
        title: "Ad spend without clear attribution",
        body: "Google and Meta report conversions that don't match the orders or leads in your own records.",
      },
      {
        title: "Local customers can't find you",
        body: "Your business doesn't appear for searches in your area, or your listings and website disagree on basic details.",
      },
    ],
  },
  approach: {
    title: "How we solve them",
    items: [
      {
        title: "Technical SEO first",
        body: "Crawlable pages, good page speed, unique titles and descriptions, structured data and one canonical URL for every page.",
      },
      {
        title: "Tracking you can trust",
        body: "GA4 and conversion events for the actions that matter (enquiries, calls, bookings and orders), checked against your own records.",
      },
      {
        title: "Campaigns aimed at qualified leads",
        body: "Google Ads and Meta campaigns built around specific services and audiences, with landing pages that match the ad.",
      },
      {
        title: "Fixes shipped, not just recommended",
        body: "Our engineers make the changes in the site's code, so recommendations don't sit in a backlog.",
      },
    ],
  },
  scope: {
    title: "What's included",
    items: [
      {
        title: "Technical SEO audits and fixes",
        body: "Crawling, indexing, site speed, structured data, internal links and redirects.",
      },
      {
        title: "On-page SEO and content",
        body: "Keyword mapping, page titles, service pages and articles that answer the questions customers ask.",
      },
      {
        title: "Local SEO",
        body: "Google Business Profile, consistent business details, and location pages for areas you genuinely serve.",
      },
      {
        title: "Google Ads and Meta campaigns",
        body: "Search and social campaigns, with budgets and audiences reviewed against results.",
      },
      {
        title: "Landing pages and conversion optimization",
        body: "Pages built for one offer and improved using real form and call data.",
      },
      {
        title: "Analytics and reporting",
        body: "GA4, conversion tracking, and reports that tie spend to enquiries and revenue.",
      },
    ],
  },
  technologies: [
    { group: "Search", items: ["Google Search Console", "Structured data", "Core Web Vitals"] },
    { group: "Analytics", items: ["GA4", "Conversion tracking"] },
    { group: "Advertising", items: ["Google Ads", "Meta Ads"] },
    { group: "Sites & landing pages", items: ["Next.js", "Headless CMS"] },
  ],
  process: {
    title: "How a marketing engagement runs",
    steps: [
      {
        title: "Audit",
        body: "A review of the site, search visibility, analytics setup and current campaigns, listing what is costing you traffic or leads.",
      },
      {
        title: "Fix the foundation",
        body: "Technical issues, tracking and the key landing pages are fixed first.",
      },
      {
        title: "Plan",
        body: "Keywords, content and campaigns planned per service and market, with budgets and targets agreed up front.",
      },
      {
        title: "Run and report",
        body: "Campaigns and content go live, results are reported against enquiries and orders, and the plan is adjusted monthly.",
      },
    ],
    note: "Landing pages and marketing sites take 3–6 weeks to build. SEO and campaign management then run on a monthly retainer.",
  },
  benefits: {
    title: "What you get",
    items: [
      {
        title: "Budget spent where it converts",
        body: "Spend moves toward the campaigns and keywords that produce enquiries, based on tracked conversions.",
      },
      {
        title: "Pages that can compete in search",
        body: "A fast, crawlable site gives your content a fair chance. We don't promise positions, because no one can.",
      },
      {
        title: "One team, one plan",
        body: "The people who find a problem are the people who fix it.",
      },
    ],
  },
  examples: {
    title: "Practical examples",
    lede: "How we usually approach three common situations.",
    items: [
      {
        title: "Launching a D2C store",
        body: "Product pages, structured data and a fast mobile checkout come first. Meta campaigns then send buyers to those product pages, and purchases are tracked back to the ad.",
      },
      {
        title: "A service business that needs leads",
        body: "Each service gets its own page with a clear enquiry form, and Google Ads campaigns point to the matching page instead of the home page.",
      },
      {
        title: "Fixing a site before spending on ads",
        body: "Unique titles, one canonical URL, crawlable links and a page that loads quickly. Campaigns start after that.",
        href: "/blog/tech-seo-tips",
        linkLabel: "Our technical SEO checklist",
      },
    ],
  },
  caseStudies: {
    title: "Related work",
    lede: "We don't publish campaign or traffic results without a client's permission. These are sites our team built, where structure and clear enquiry paths come first.",
    items: [
      { slug: "mr-antidot", note: "A page and a booking path for each of ten services, plus sector pages and a blog." },
      { slug: "kankreg", note: "Collections, offer codes and quick-add product cards for a D2C brand." },
      { slug: "zeevan", note: "Range-by-range storytelling with a filterable shop." },
    ],
  },
  faqTitle: "Questions about SEO and digital marketing",
  faqs: [
    {
      question: "Can you guarantee first-page rankings?",
      answer:
        "No. Nobody controls Google's results, and guaranteed rankings are a warning sign. We commit to the work (technical fixes, content and tracking) and report on the traffic and enquiries it produces.",
    },
    {
      question: "How long does SEO take to show results?",
      answer:
        "It depends on the competition and where the site starts. Technical fixes are picked up as pages are re-crawled; content and authority usually take months. We report progress monthly so you can judge it yourself.",
    },
    {
      question: "Do you manage Google Ads and Meta ads?",
      answer:
        "Yes. We set up and run campaigns, write the ads, build the landing pages and track conversions. We recommend keeping the ad accounts in your company's name, so you keep the data and history.",
    },
    {
      question: "Do we need a new website first?",
      answer:
        "Not always. We start with an audit, and if the current site can be fixed, we fix it. If it can't be crawled, is very slow or is hard to edit, a rebuild may cost less than working around it.",
    },
    {
      question: "What does a monthly retainer cover?",
      answer:
        "SEO, campaign management and reporting, plus changes to the site when the data shows a problem. Scope and budget are agreed before the retainer starts.",
    },
    {
      question: "Do you work with businesses outside Gujarat?",
      answer:
        "Yes. We work with clients across India and abroad. Local SEO is done only for the areas a business genuinely serves.",
    },
  ],
  related: ["web-app-eng", "cloud-devops", "ai-machine-ml"],
  cardSummary: "Technical and local SEO, Google Ads, Meta campaigns and analytics.",
  cta: {
    title: "Want more enquiries from search and ads?",
    description:
      "Send us your website and what you sell. We reply within one business day with what we would check first.",
    buttonLabel: "Book a Consultation",
  },
};

const cloudDevops: ServicePageContent = {
  slug: "cloud-devops",
  name: "Cloud, DevOps & design",
  h1: "Cloud, DevOps and design system services",
  seoTitle: "Cloud & DevOps Services on AWS and GCP",
  metaDescription:
    "AWS and GCP setup, CI/CD pipelines, monitoring and cloud cost reviews, plus design systems, from the team that builds your app, so nothing is lost in handover.",
  eyebrow: "Services · Cloud, DevOps & design",
  lede:
    "Cloud setup on AWS or GCP, the pipeline that deploys your app, monitoring you can act on, and a design system that keeps every new screen consistent.",
  keywords: [
    "cloud and DevOps services",
    "CI/CD pipeline setup",
    "AWS consulting",
    "GCP consulting",
    "cloud cost optimization",
    "design system development",
  ],
  intro: {
    title: "The foundation your product runs on",
    paragraphs: [
      "Many products reach launch with hosting set up by hand, deployments that depend on one person, and no clear view of what fails or what it costs. We set up cloud infrastructure on AWS or GCP, automate testing and deployment, and add logging and alerts so problems are found before customers report them.",
      "The same team maintains design systems (shared components, colours and type) so the product stays consistent as new screens are added. Because we build apps as well, infrastructure and interface decisions are made with the code in view.",
    ],
  },
  problems: {
    title: "Problems this service solves",
    items: [
      {
        title: "Manual, risky deployments",
        body: "Releases depend on one person running commands by hand, and a bad release is hard to roll back.",
      },
      {
        title: "No visibility when something breaks",
        body: "Customers find the errors first, and the logs are missing or hard to read.",
      },
      {
        title: "Cloud bills that keep growing",
        body: "Unused environments, oversized servers and forgotten services add cost every month.",
      },
      {
        title: "An interface that drifts",
        body: "Each new screen looks slightly different because there is no shared component library or set of design rules.",
      },
    ],
  },
  approach: {
    title: "How we solve them",
    items: [
      {
        title: "Documented, repeatable environments",
        body: "Settings, secrets and environments are written down and set up the same way each time, so staging behaves like production.",
      },
      {
        title: "Automated CI/CD",
        body: "Every change is tested and deployed by a pipeline, with a clear way to roll back.",
      },
      {
        title: "Monitoring with a runbook",
        body: "Health checks, logs and alerts for the failures that matter, and short written steps for handling each one.",
      },
      {
        title: "Cost review on real traffic",
        body: "Servers are right-sized and unused resources removed once you know how the app is actually used.",
      },
    ],
  },
  scope: {
    title: "What's included",
    items: [
      {
        title: "Cloud architecture on AWS and GCP",
        body: "Hosting, databases, storage, networking and environments sized for your traffic.",
      },
      {
        title: "CI/CD pipelines",
        body: "Automated tests, builds and deployments for web apps, APIs and background jobs.",
      },
      {
        title: "Monitoring and incident response",
        body: "Health checks, logging, uptime alerts and a runbook for common failures.",
      },
      {
        title: "Security reviews and compliance readiness",
        body: "Access control, secrets handling, backups and the documentation that reviews ask for.",
      },
      {
        title: "Cloud cost reviews",
        body: "A comparison of what you pay for with what you use, and the changes that cut waste.",
      },
      {
        title: "Design systems and product UI/UX",
        body: "Component libraries, design tokens and interface design for web and mobile products.",
      },
    ],
  },
  technologies: [
    { group: "Cloud", items: ["AWS", "GCP"] },
    { group: "Delivery", items: ["CI/CD pipelines", "Health checks", "Logging & alerts"] },
    { group: "App stack", items: ["Node.js", "Next.js", "PostgreSQL", "MongoDB", "Cloudinary"] },
    { group: "Design", items: ["Design tokens", "Component libraries"] },
  ],
  process: {
    title: "How a cloud or DevOps engagement runs",
    steps: [
      {
        title: "Review",
        body: "We look at your current hosting, deployments, monitoring and monthly bill.",
      },
      {
        title: "Plan",
        body: "A prioritised list of changes, starting with the ones that reduce the most risk.",
      },
      {
        title: "Set up",
        body: "Pipelines, environments, monitoring and alerts, introduced step by step alongside your normal releases.",
      },
      {
        title: "Hand over",
        body: "Documentation and a walkthrough for your team, with optional ongoing support.",
      },
    ],
    note: "Scope varies a lot from one setup to the next, so the timeline is agreed after the review. Monitoring and support are available on a monthly retainer.",
  },
  benefits: {
    title: "What you get",
    items: [
      {
        title: "Safer releases",
        body: "Automated tests and deployments make releases routine and reversible.",
      },
      {
        title: "Problems found early",
        body: "Alerts reach the team before customers notice.",
      },
      {
        title: "A clearer cloud bill",
        body: "You pay for what the app uses, not for what was set up just in case.",
      },
      {
        title: "A consistent interface",
        body: "New screens are assembled from tested components, which saves design and build time.",
      },
    ],
  },
  examples: {
    title: "Practical examples",
    lede: "How we usually approach three common situations.",
    items: [
      {
        title: "From manual deploys to a pipeline",
        body: "An app that is deployed by copying files to a server moves to a pipeline that tests every change, deploys to staging, and promotes to production with a rollback option.",
      },
      {
        title: "Cost clean-up after launch",
        body: "Costs come down when unused environments and oversized instances go away, once the app has real traffic to size them against.",
      },
      {
        title: "A design system for a growing product",
        body: "When several people have built screens in different ways, we extract shared components and rules so the next feature needs less design time.",
      },
    ],
  },
  caseStudies: {
    title: "Products this work supports",
    lede: "Infrastructure is mostly invisible, so these case studies show the products our team built and ships.",
    items: [
      { slug: "quadrato-cargo", note: "Booking, live tracking and quote flows for an international courier." },
      { slug: "mr-antidot", note: "A service platform with a CMS, sector pages and lead capture." },
    ],
  },
  faqTitle: "Questions about cloud, DevOps and design systems",
  faqs: [
    {
      question: "Do you work with AWS or GCP?",
      answer:
        "Both. We recommend one based on your existing accounts, your team's experience and the services the product needs, and we can work inside a cloud account you already have.",
    },
    {
      question: "Can you take over infrastructure set up by another vendor?",
      answer:
        "Yes. We start by reviewing what is running, what it costs and how it is deployed, and document it before making changes.",
    },
    {
      question: "How can we reduce our cloud bill?",
      answer:
        "Start by measuring. Unused environments, oversized servers and forgotten storage are the usual causes. We recommend changes once the app has real traffic data, so savings don't cost you reliability.",
    },
    {
      question: "Do you provide ongoing monitoring and support?",
      answer: "Yes, on a monthly retainer covering monitoring, fixes, updates and performance work.",
    },
    {
      question: "What is a design system, and do we need one?",
      answer:
        "It is a shared set of components, colours, type and rules for building screens. If several people design or build your product, or you plan many new screens, it saves time and keeps the interface consistent. A small marketing site usually doesn't need one.",
    },
    {
      question: "Who should own the cloud accounts?",
      answer:
        "Your company. We recommend the accounts are in your name, with our team given the access it needs, so you keep control and billing if the engagement ends.",
    },
  ],
  related: ["web-app-eng", "ai-machine-ml", "digital-marketing"],
  cardSummary: "AWS and GCP, CI/CD pipelines, monitoring and design systems.",
  cta: {
    title: "Want safer releases and a clearer cloud bill?",
    description:
      "Tell us where the app is hosted and what is causing trouble. We reply within one business day with what we would review first.",
    buttonLabel: "Book a Consultation",
  },
};

export const servicePageContent: Record<string, ServicePageContent> = {
  [webAppEng.slug]: webAppEng,
  [aiMachineMl.slug]: aiMachineMl,
  [digitalMarketing.slug]: digitalMarketing,
  [cloudDevops.slug]: cloudDevops,
};

export function getServicePageContent(slug: string): ServicePageContent | null {
  return servicePageContent[slug] ?? null;
}
