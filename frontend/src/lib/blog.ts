import type { CloudinaryAsset } from "./media";

const API_ORIGIN =
  process.env.API_PROXY_TARGET ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5001";

const FETCH_TIMEOUT_MS = 2500;

export type BlogAuthor = {
  name: string;
  avatar: CloudinaryAsset | null;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: CloudinaryAsset | null;
  content: string;
  category: string;
  tags: string[];
  author: BlogAuthor;
  publishedAt: string;
  readingTime: number;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: CloudinaryAsset | null;
};

export type BlogListResponse = {
  posts: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  categories: string[];
};

export type BlogPostResponse = {
  post: BlogPost;
  related: BlogPost[];
};

const fallbackPosts: BlogPost[] = [
  {
    id: "fallback-saas-mvp-cost",
    title: "What changes the cost of a SaaS MVP",
    slug: "saas-mvp-cost-factors",
    excerpt:
      "Scope, integrations, accounts, and admin work move the price of a first SaaS release. A number without those facts is a guess.",
    coverImage: { secureUrl: "/images/webapp-dashboard.webp", publicId: null },
    content: `<p>A SaaS MVP is the smallest product a real user can log into and finish one job. The price moves with what that job requires, not with a flat package.</p><h2>What actually changes the cost</h2><ul><li>How many roles sign in, and what each role is allowed to see</li><li>Integrations that must work on day one — payments, email, or an existing database</li><li>Whether an admin needs to fix a customer record without a developer</li><li>How much of the workflow is new versus a screen on top of a tool you already pay for</li></ul><p>Leave reporting, extra roles, and nice-to-have integrations for the next release. A weekly build shows whether the first loop is worth finishing. <a href="/work/mr-antidot">Mr Antidot</a> is a service product with booking and pricing, which is the same shape as a first SaaS release. If you are scoping one, start with <a href="/services/web-app-eng">web and app development</a> or <a href="/contact">send a short brief</a>.</p>`,
    category: "Product",
    tags: ["SaaS", "MVP", "Budget"],
    author: { name: "Novaro Solution", avatar: null },
    publishedAt: "2026-10-21T00:00:00.000Z",
    readingTime: 4,
    metaTitle: "What changes the cost of a SaaS MVP",
    metaDescription:
      "The factors that change what a first SaaS release costs: roles, integrations, admin, and what you leave for later.",
    ogImage: null,
  },
  {
    id: "fallback-custom-vs-shelf",
    title: "Custom software vs off-the-shelf software",
    slug: "custom-vs-off-the-shelf",
    excerpt:
      "Buy a tool when the workflow is common. Build one when the workflow is the business.",
    coverImage: { secureUrl: "/images/webapp-dashboard.webp", publicId: null },
    content: `<p>Off-the-shelf software is the right buy when many companies do the job the same way. Custom software is worth it when the way you work is why customers pick you.</p><h2>Buy when</h2><ul><li>The workflow matches what the product already does, with light settings</li><li>You can live with the vendor's screens, data model, and release schedule</li><li>The job is accounting, email, or another problem that is already solved</li></ul><h2>Build when</h2><ul><li>Staff keep a spreadsheet beside the tool because the tool cannot do the real job</li><li>Customers would notice if you swapped the product for a generic one</li><li>Two or three tools have to be glued together for one order, booking, or shipment</li></ul><p><a href="/work/quadrato-cargo">Quadrato Cargo</a> needed booking, tracking, and dispatch in one product. A generic site would not have run that operation. If that sounds like the problem, see <a href="/services/web-app-eng">web and app development</a> or <a href="/contact">talk through the workflow</a>.</p>`,
    category: "Product",
    tags: ["Custom software", "SaaS", "Buying"],
    author: { name: "Novaro Solution", avatar: null },
    publishedAt: "2026-10-22T00:00:00.000Z",
    readingTime: 4,
    metaTitle: "Custom software vs off-the-shelf software",
    metaDescription:
      "When to buy a tool and when to build one, for founders deciding if a SaaS product should be custom.",
    ogImage: null,
  },
  {
    id: "fallback-hire-it-services",
    title: "What to check before you hire an IT services company",
    slug: "hire-it-services-company",
    excerpt:
      "A short list for founders anywhere in the world: who writes the code, what you see each week, and what the proposal must include.",
    coverImage: { secureUrl: "/images/webapp-dashboard.webp", publicId: null },
    content: `<p>An IT services company is a fit when the same team can design, build, and launch. A fit is not a slide deck from one vendor and a codebase from another.</p><h2>Ask these before you sign</h2><ul><li>Who is on the squad, and do they stay for the whole build?</li><li>What will you click at the end of each week?</li><li>What is out of scope, and how is a change priced?</li><li>Where is the studio, and when can you speak to them live?</li></ul><p>The first step is a brief and a 30-minute call.</p>`,
    category: "Product",
    tags: ["IT services", "Hiring", "Process"],
    author: { name: "Novaro Team", avatar: null },
    publishedAt: "2026-10-20T00:00:00.000Z",
    readingTime: 3,
    metaTitle: "What to check before you hire an IT services company",
    metaDescription:
      "Questions to ask an IT services company before you hire them — squad, weekly demos, scope, and where the team actually sits.",
    ogImage: null,
  },
  {
    id: "fallback-web-app-vs-site",
    title: "Web app development: what a company should expect",
    slug: "web-app-development-expect",
    excerpt:
      "A marketing site and a web app are different products. Here is what a build includes, and what to leave for later.",
    coverImage: { secureUrl: "/images/webapp-dashboard.webp", publicId: null },
    content: `<p>A web app is software people log into: accounts, data, and a job they do every day. A marketing site explains the company. Most teams need the site first and the app when the workflow is clear.</p><h2>What the first version includes</h2><ul><li>The one workflow users repeat, not every idea from the brief</li><li>Accounts, the main screens, and a way to see if it worked</li><li>A deploy you can open on a phone, with room to add the next feature</li></ul><p>We build that on Next.js and Node, then keep the same team for the next release. If you are choosing a web app development company, ask to see a weekly build, not a monthly report.</p>`,
    category: "Product",
    tags: ["Web apps", "Next.js", "Delivery"],
    author: { name: "Novaro Team", avatar: null },
    publishedAt: "2026-10-19T00:00:00.000Z",
    readingTime: 3,
    metaTitle: "Web app development: what a company should expect",
    metaDescription:
      "What a first web app includes, how it differs from a marketing site, and what to ask a development company before you start.",
    ogImage: null,
  },
  {
    id: "fallback-working-with-us-teams",
    title: "How US product teams work with a software studio in India",
    slug: "working-with-us-teams",
    excerpt:
      "What actually overlaps with a US workday, how weekly demos stay useful, and what to put in the first brief.",
    coverImage: { secureUrl: "/images/webapp-dashboard.webp", publicId: null },
    content: `<p>A US company does not need a local office from its software partner. It needs a squad that shows working software every week and answers while your morning is still open.</p><h2>The hours</h2><p>Our studio runs Monday–Saturday, 10:00–19:00 IST. That window covers the US East morning. We book calls then. The rest of the day is Slack: decisions, screenshots, and a written note when something changes scope.</p><h2>What to send first</h2><ul><li>Who the product is for, and what they do today instead</li><li>The date you need a first version people can use</li><li>What is out of scope for that first version</li></ul><p>We reply with a 30-minute call and a proposal. No pitch deck required.</p>`,
    category: "Product",
    tags: ["USA", "Delivery", "Process"],
    author: { name: "Novaro Team", avatar: null },
    publishedAt: "2026-10-18T00:00:00.000Z",
    readingTime: 3,
    metaTitle: "How US teams work with a software studio in India",
    metaDescription:
      "Timezone, weekly demos, and the first brief — how Novaro Solution works with product teams in the United States.",
    ogImage: null,
  },
  {
    id: "fallback-ship-fast-stack",
    title: "Shipping faster with a single full-stack team",
    slug: "ship-fast-stack",
    excerpt:
      "Why keeping engineering, design, and growth under one roof cuts delivery risk — and how we structure sprints so clients see working software every week.",
    coverImage: { secureUrl: "/images/webapp-dashboard.webp", publicId: null },
    content: `<p>Most product delays aren't technical — they're coordination tax. Hand-offs between agencies, internal teams, and vendors create gaps where decisions stall and scope drifts.</p><h2>One team, one backlog</h2><p>We run discovery, design, build, and launch with the same squad. Trade-offs get made in real time, not in email threads three days later.</p><ul><li>Weekly demos with something clickable — not slide decks</li><li>Shared metrics: performance, conversion, and reliability from day one</li><li>Design systems that engineers actually use</li></ul><p>If you're planning a rebuild or a net-new product, start with the shortest path to something users can touch.</p>`,
    category: "Product",
    tags: ["Delivery", "Process", "Next.js"],
    author: { name: "Novaro Team", avatar: null },
    publishedAt: "2026-10-12T00:00:00.000Z",
    readingTime: 3,
    metaTitle: null,
    metaDescription: null,
    ogImage: null,
  },
  {
    id: "fallback-ai-prod-apps",
    title: "Practical AI features that belong in production apps",
    slug: "ai-prod-apps",
    excerpt:
      "Not every product needs a chatbot. Here are the AI patterns we ship most often — and the guardrails that keep them reliable.",
    coverImage: { secureUrl: "/images/ai-ml-dashboard.webp", publicId: null },
    content: `<p>The work that matters is quiet: narrow features with clear inputs, measurable outputs, and humans still in the loop.</p><h2>Patterns we ship</h2><ul><li>Document intelligence — extract and route structured data from PDFs and scans.</li><li>Search and retrieval — grounded answers over your own content.</li><li>Vision assist — flag anomalies and surface them for review.</li></ul><p>We treat model calls like any other dependency: timeouts, retries, and a fallback when the model is unsure. Start with one workflow that saves real time.</p>`,
    category: "AI / ML",
    tags: ["LLM", "Computer vision"],
    author: { name: "Novaro AI Lead", avatar: null },
    publishedAt: "2026-10-05T00:00:00.000Z",
    readingTime: 3,
    metaTitle: null,
    metaDescription: null,
    ogImage: null,
  },
  {
    id: "fallback-tech-seo-tips",
    title: "Technical SEO that actually moves the needle",
    slug: "tech-seo-tips",
    excerpt:
      "Core Web Vitals, structured data, and content architecture — the checklist we use before spending on paid acquisition.",
    coverImage: { secureUrl: "/images/digital-marketing-dashboard.webp", publicId: null },
    content: `<p>Paid traffic is an accelerant, not a foundation. If a site is slow, thin, or hard to crawl, campaigns leak budget.</p><h2>The baseline</h2><ul><li>Unique titles and descriptions on every indexable template</li><li>Stable Core Web Vitals on real devices</li><li>Clean internal links and one canonical URL per page</li></ul><p>Article, product, and organization schema belong in the template, not in a hand-written script. Search Console and analytics should tell the same story about what gets found and what converts.</p>`,
    category: "Growth",
    tags: ["SEO", "Performance", "Analytics"],
    author: { name: "Novaro Growth Lead", avatar: null },
    publishedAt: "2026-09-28T00:00:00.000Z",
    readingTime: 3,
    metaTitle: null,
    metaDescription: null,
    ogImage: null,
  },
];

function fallbackBlogList(options: {
  page?: number;
  limit?: number;
  category?: string;
}): BlogListResponse {
  const page = Math.max(1, options.page ?? 1);
  const limit = options.limit ?? 9;
  const filtered = options.category
    ? fallbackPosts.filter((post) => post.category === options.category)
    : fallbackPosts;
  const start = (page - 1) * limit;

  return {
    posts: filtered.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
    },
    categories: [...new Set(fallbackPosts.map((post) => post.category))],
  };
}

async function fetchBlog<T>(path: string, fallback: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(`${API_ORIGIN}${path}`, {
      next: { revalidate: 30 },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return fallback;
    const json = (await res.json()) as { ok?: boolean; data?: T };
    return json.ok && json.data !== undefined ? json.data : fallback;
  } catch {
    return fallback;
  }
}

export async function getBlogPosts(options: {
  page?: number;
  limit?: number;
  category?: string;
} = {}): Promise<BlogListResponse> {
  const params = new URLSearchParams();
  params.set("page", String(options.page ?? 1));
  params.set("limit", String(options.limit ?? 9));
  if (options.category) params.set("category", options.category);

  const remote = await fetchBlog<BlogListResponse | null>(
    `/api/content/blog?${params}`,
    null,
  );
  if (remote && remote.pagination.total > 0) return remote;
  return fallbackBlogList(options);
}

export async function getBlogPost(slug: string): Promise<BlogPostResponse | null> {
  const data = await fetchBlog<BlogPostResponse | null>(
    `/api/content/blog/${encodeURIComponent(slug)}`,
    null,
  );
  if (data?.post) return data;

  const post = fallbackPosts.find((item) => item.slug === slug);
  if (!post) return null;
  return {
    post,
    related: fallbackPosts.filter((item) => item.slug !== slug).slice(0, 2),
  };
}

/** Fetches every published post (paginated API) for sitemap generation. */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const all: BlogPost[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await getBlogPosts({ page, limit: 24 });
    all.push(...response.posts);
    totalPages = response.pagination.totalPages;
    page += 1;
  }

  return all;
}

export function formatBlogDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export { siteBaseUrl } from "./site-metadata";
