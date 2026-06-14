export const seedBlogPosts = [
  {
    title: "Shipping faster with a single full-stack team",
    slug: "ship-fast-stack",
    excerpt:
      "Why keeping engineering, design, and growth under one roof cuts delivery risk — and how we structure sprints so clients see working software every week.",
    category: "Product",
    tags: ["Delivery", "Process", "Next.js"],
    author: { name: "Novaro Team", avatar: null },
    coverImage: "/images/webapp-dashboard.webp",
    content: `
      <p>Most product delays aren't technical — they're coordination tax. Hand-offs between agencies, internal teams, and vendors create gaps where decisions stall and scope drifts.</p>
      <h2>One team, one backlog</h2>
      <p>We run discovery, design, build, and launch with the same squad. That means trade-offs get made in real time, not in email threads three days later.</p>
      <blockquote>Working software every week beats a perfect spec doc that never ships.</blockquote>
      <h3>What that looks like in practice</h3>
      <ul>
        <li>Weekly demos with something clickable — not slide decks</li>
        <li>Shared metrics: performance, conversion, and reliability from day one</li>
        <li>Design systems that engineers actually use, not PDFs on a drive</li>
      </ul>
      <p>If you're planning a rebuild or a net-new product, start with the shortest path to something users can touch. Everything else follows.</p>
    `,
    publishedDaysAgo: 2,
  },
  {
    title: "Practical AI features that belong in production apps",
    slug: "ai-prod-apps",
    excerpt:
      "Not every product needs a chatbot. Here are the AI patterns we ship most often — and the guardrails that keep them reliable in the wild.",
    category: "AI / ML",
    tags: ["LLM", "Computer vision", "FastAPI"],
    author: { name: "Novaro AI Lead", avatar: null },
    coverImage: "/images/ai-ml-dashboard.webp",
    content: `
      <p>The hype cycle around AI is loud. The work that matters is quiet: narrow features with clear inputs, measurable outputs, and humans still in the loop.</p>
      <h2>Patterns we ship</h2>
      <ol>
        <li><strong>Document intelligence</strong> — extract, classify, and route structured data from PDFs and scans.</li>
        <li><strong>Search + retrieval</strong> — grounded answers over your own content, not the open web.</li>
        <li><strong>Vision assist</strong> — flag anomalies, rank findings, and surface heat-maps for review workflows.</li>
      </ol>
      <h3>Guardrails that matter</h3>
      <p>Logging, evaluation sets, and fallbacks aren't optional. We treat model calls like any other external dependency: timeouts, retries, and observability from the first merge.</p>
      <pre><code>// Pseudocode: always wrap model calls
const result = await withTimeout(runModel(input), 8000);
if (!result.ok) return fallbackWorkflow(input);</code></pre>
      <p>Start with one workflow that saves real time. Expand when the metrics prove it.</p>
    `,
    publishedDaysAgo: 9,
  },
  {
    title: "Technical SEO that actually moves the needle",
    slug: "tech-seo-tips",
    excerpt:
      "Core Web Vitals, structured data, and content architecture — a checklist we use before spending a rupee on paid acquisition.",
    category: "Growth",
    tags: ["SEO", "Performance", "Analytics"],
    author: { name: "Novaro Growth Lead", avatar: null },
    coverImage: "/images/digital-marketing-dashboard.webp",
    content: `
      <p>Paid traffic is a accelerant, not a foundation. If your site is slow, thin, or impossible to crawl, campaigns leak budget.</p>
      <h2>The baseline checklist</h2>
      <ul>
        <li>Indexable templates with unique titles and meta descriptions</li>
        <li>Stable Core Web Vitals on real devices, not just Lighthouse in dev</li>
        <li>Clean internal linking and canonical URLs across marketing + product pages</li>
      </ul>
      <h2>Structured data</h2>
      <p>Article, product, and organization schema help search engines understand what you sell and who you are. We wire JSON-LD at the template level so content editors don't hand-code scripts.</p>
      <p>Measure twice: Search Console, analytics events, and server logs should tell the same story about what's getting found and what converts.</p>
    `,
    publishedDaysAgo: 18,
  },
] as const;
