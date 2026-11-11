/**
 * Geo SEO data.
 *
 * One intent, one URL (see docs/seo-growth.md and docs/local-seo-plan.md):
 * - /locations/gandhinagar — where the studio actually is (Capitol Icon, Sargasan).
 * - /locations/ahmedabad — a service-area page: 25 km away, no office there, said plainly.
 * - /software-development-usa keeps its URL; every other market is a section of /locations.
 * Only facts the business already publishes are stated, plus general public facts about each city.
 */

export type LocationKind = "city" | "country" | "region";

export type LocationFaq = { question: string; answer: string };

export type LocationTimezone = {
  /** City used for the overlap chart, e.g. "London". */
  city: string;
  /** UTC offset in hours during standard time. */
  offset: number;
  zone: string;
  /** UTC offset in summer time, when the market uses daylight saving. */
  dstOffset?: number;
  dstZone?: string;
};

/** A full landing page (local page or the USA page). */
export type LocationEntry = {
  slug: string;
  name: string;
  /** Name as used after "in" — e.g. "the US". Defaults to name. */
  inName?: string;
  kind: LocationKind;
  group: "india" | "international";
  isoCode: string;
  eyebrow: string;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  ogHeadline: string;
  lede: string;
  cardSummary: string;
  facts: Array<{ value: string; label: string }>;
  timezone: LocationTimezone | null;
  howWeWork: string[];
  hireUsFor: string[];
  data: { title: string; body: string };
  areas: string[];
  inPerson?: string;
  /** A short, factual paragraph about the local business landscape. */
  localContext?: { title: string; body: string };
  /** Services as offered in this market, each linking to its service page. */
  localServices?: Array<{ title: string; body: string; href: string }>;
  faqs: LocationFaq[];
  keywords: string[];
};

/** A market shown as a section of the /locations hub (no page of its own, except the USA). */
export type MarketEntry = {
  slug: string;
  name: string;
  isoCode: string;
  eyebrow: string;
  summary: string;
  timezone: LocationTimezone | null;
  data: { title: string; body: string };
  areas: string[];
  /** Dedicated page, when one exists. */
  href?: string;
};

export const STUDIO_UTC_OFFSET = 5.5;
export const STUDIO_HOURS = { start: 10, end: 19 };

/** Local landing pages: the studio's city and its neighbouring metro. */
export const locations: LocationEntry[] = [
  {
    slug: "gandhinagar",
    name: "Gandhinagar",
    kind: "city",
    group: "india",
    isoCode: "IN-GJ",
    eyebrow: "Gandhinagar · Gujarat · Our studio",
    h1: "Software & website development company in Gandhinagar",
    seoTitle: "Software & Website Development in Gandhinagar",
    seoDescription:
      "Websites, web and mobile apps, AI and SEO from our studio at Capitol Icon, Sargasan, Gandhinagar. Visit the team and see a working build every week.",
    ogHeadline: "Software & website development in Gandhinagar",
    lede: "Our studio is at Capitol Icon in Sargasan, Gandhinagar. Local businesses, startups, and teams around GIFT City and Infocity can sit with the people building their product — and see a working build every week.",
    cardSummary: "Our studio at Capitol Icon, Sargasan — visit the team, Monday to Saturday.",
    facts: [
      { value: "Sargasan", label: "Studio at Capitol Icon, Gandhinagar" },
      { value: "12 km", label: "From GIFT City" },
      { value: "Mon–Sat", label: "10:00 AM – 7:00 PM IST" },
      { value: "1 day", label: "Reply time on new briefs" },
    ],
    timezone: null,
    localContext: {
      title: "Building for Gandhinagar businesses",
      body: "Gandhinagar is Gujarat's capital and home to Infocity and GIFT City, India's first International Financial Services Centre. Its businesses range from government suppliers and institutes to fintech teams, clinics, schools, and fast-growing local retail. Most need the same things: a site that works on a phone, internal tools that replace spreadsheets, and enquiries they can measure.",
    },
    localServices: [
      {
        title: "Website development",
        body: "Fast, mobile-first business websites and landing pages with technical SEO set up from day one.",
        href: "/services/web-app-eng",
      },
      {
        title: "Web apps & custom software",
        body: "Dashboards, booking systems, portals, and admin panels that replace spreadsheets and manual work.",
        href: "/services/web-app-eng",
      },
      {
        title: "Mobile app development",
        body: "Store apps when the phone is the product — camera, offline use, or push — and responsive web apps when it isn't.",
        href: "/services/web-app-eng",
      },
      {
        title: "AI development",
        body: "Document extraction, search over your own files, and review queues — with a person in the loop.",
        href: "/services/ai-machine-ml",
      },
      {
        title: "SEO & Google Ads",
        body: "Technical and local SEO, paid search and social campaigns, and analytics tied to real enquiries.",
        href: "/services/digital-marketing",
      },
      {
        title: "Cloud, DevOps & design",
        body: "AWS or GCP hosting, CI/CD, monitoring, and design systems your team can keep using.",
        href: "/services/cloud-devops",
      },
    ],
    howWeWork: [
      "Send a short brief. We reply within one business day and book a 30-minute discovery call.",
      "Kick-off at the studio in Sargasan, or on a call — your choice.",
      "A written proposal with scope, timeline, and price within 2–3 business days.",
      "Weekly demos of working software, then a handover with documentation.",
    ],
    hireUsFor: [
      "Websites and web apps for Gujarat businesses moving off spreadsheets and manual work.",
      "D2C storefronts like Zeevan and KankreG, and the SEO and campaigns around them.",
      "Booking, logistics, and service platforms like Mr Antidot and Quadrato Cargo.",
      "AI features in existing apps: document extraction, search, and review queues.",
    ],
    data: {
      title: "Data handled under India's DPDP Act",
      body: "Personal data in the apps we build is planned around the Digital Personal Data Protection Act, 2023: collect only what a feature needs, record consent where it is required, and limit who can access production data.",
    },
    areas: ["Sargasan", "Kudasan", "Raysan", "Randesan", "Koba", "Infocity", "GIFT City", "Sector 21"],
    inPerson:
      "Visit the studio at 707, Capitol Icon, Swagat Reliance Road, Sargasan, Gandhinagar — Monday to Saturday, 10:00 AM to 7:00 PM IST. Please call ahead so the right people are in.",
    faqs: [
      {
        question: "Where is your office in Gandhinagar?",
        answer:
          "707, Capitol Icon, Swagat Reliance Road, Sargasan, Gandhinagar, Gujarat 382419 — about 12 km from GIFT City.",
      },
      {
        question: "Can we meet the team in person?",
        answer:
          "Yes. You can visit the studio Monday to Saturday, 10:00 AM to 7:00 PM IST. Call +91 96244 98325 first so we can book a time.",
      },
      {
        question: "Do you build websites as well as software?",
        answer:
          "Yes. We build business websites and landing pages, and the web apps, mobile apps, and AI features behind them — with the SEO handled by the same team.",
      },
      {
        question: "Do you work with companies in GIFT City?",
        answer:
          "Yes. Fintech and SaaS are among the industries we build for, and the studio is a short drive from GIFT City for workshops and reviews.",
      },
      {
        question: "What does a project cost?",
        answer:
          "Fixed-scope projects are quoted after a discovery call. Budget ranges start from ₹5L for focused builds; larger platforms are phased so you pay for one release at a time.",
      },
    ],
    keywords: [
      "software development company Gandhinagar",
      "website development company in Gandhinagar",
      "web development services Gandhinagar",
      "mobile app development Gandhinagar",
      "SEO company Gandhinagar",
      "AI development company Gandhinagar",
      "IT company in Gandhinagar",
    ],
  },
  {
    slug: "ahmedabad",
    name: "Ahmedabad",
    kind: "city",
    group: "india",
    isoCode: "IN-GJ",
    eyebrow: "Ahmedabad · Gujarat · 25 km from our studio",
    h1: "Website & software development for Ahmedabad businesses",
    seoTitle: "Website & Software Development for Ahmedabad",
    seoDescription:
      "Websites, web and mobile apps, AI and SEO for Ahmedabad businesses, from our Gandhinagar studio 25 km away. Meet at the studio or over weekly demos.",
    ogHeadline: "Website & software development for Ahmedabad",
    lede: "We don't have an Ahmedabad office — our studio is in Sargasan, Gandhinagar, about 25 km away. Ahmedabad companies visit us there or work with us over calls, a shared channel, and a working build every week.",
    cardSummary: "25 km from our studio — meet in Sargasan or work over weekly demos.",
    facts: [
      { value: "25 km", label: "From our Gandhinagar studio" },
      { value: "Studio visits", label: "Mon–Sat, in Sargasan" },
      { value: "Weekly", label: "Demos of working software" },
      { value: "₹ INR", label: "Fixed-scope pricing" },
    ],
    timezone: null,
    localContext: {
      title: "Building for Ahmedabad businesses",
      body: "Ahmedabad is Gujarat's largest city, with textile, pharma, chemicals, and manufacturing firms alongside D2C food brands and a startup scene around its universities and incubators. The brief we hear most often is practical: a website that sells on a phone, internal tools that replace spreadsheets and WhatsApp threads, and marketing that brings enquiries you can count.",
    },
    localServices: [
      {
        title: "Website development",
        body: "Business websites, catalogue sites, and landing pages that load fast on a phone and are set up for search.",
        href: "/services/web-app-eng",
      },
      {
        title: "Custom software & web apps",
        body: "Order, inventory, booking, and field-service tools for operations-heavy businesses.",
        href: "/services/web-app-eng",
      },
      {
        title: "Mobile app development",
        body: "Android and iOS apps when the phone is the product; responsive web apps when the workflow is still changing.",
        href: "/services/web-app-eng",
      },
      {
        title: "E-commerce & D2C",
        body: "Storefronts with product storytelling and a fast checkout — the kind we built for Zeevan and KankreG.",
        href: "/work",
      },
      {
        title: "SEO & digital marketing",
        body: "Technical and local SEO, Google Ads and Meta campaigns, and reporting tied to orders and enquiries.",
        href: "/services/digital-marketing",
      },
      {
        title: "AI development",
        body: "AI features with a fallback: reading invoices and documents, search over your files, and review queues.",
        href: "/services/ai-machine-ml",
      },
    ],
    howWeWork: [
      "Discovery call first, then a kick-off at our Sargasan studio or on a call.",
      "A written proposal with scope, timeline, and price within 2–3 business days.",
      "A shared channel with the people building your product — no account-manager relay.",
      "Weekly demos, priced change requests, and a handover you can run without us.",
    ],
    hireUsFor: [
      "Custom software for manufacturers, traders, and service businesses ready to leave spreadsheets.",
      "D2C storefronts and catalogue sites with the SEO and Meta ads around them.",
      "Booking, logistics, and field-service apps like Mr Antidot and Quadrato Cargo.",
      "Rebuilding a slow website so it ranks and loads on a phone.",
    ],
    data: {
      title: "Data handled under India's DPDP Act",
      body: "We follow the Digital Personal Data Protection Act, 2023 in what we build: consent where it is needed, the minimum personal data, and access controls your team can audit.",
    },
    areas: ["SG Highway", "Prahlad Nagar", "Bodakdev", "Vastrapur", "Thaltej", "Satellite", "Navrangpura", "Bopal"],
    inPerson:
      "Our studio is at 707, Capitol Icon, Swagat Reliance Road, Sargasan, Gandhinagar — reachable from Ahmedabad via SG Highway. Visits are Monday to Saturday, 10:00 AM to 7:00 PM IST; please call ahead.",
    faqs: [
      {
        question: "Do you have an office in Ahmedabad?",
        answer:
          "No. Our only studio is in Sargasan, Gandhinagar, about 25 km from central Ahmedabad. Ahmedabad clients visit us there or work with us over calls and weekly demos.",
      },
      {
        question: "What kinds of Ahmedabad businesses do you work with?",
        answer:
          "D2C and e-commerce brands, logistics and service companies, and teams building SaaS or fintech products. Our case studies include Zeevan, KankreG, Mr Antidot, and Quadrato Cargo.",
      },
      {
        question: "How long does a website or web app take?",
        answer:
          "Marketing sites and landing pages take 3–6 weeks. MVPs and web apps take 8–14 weeks. Larger platforms with AI, admin panels, and integrations take 12–20 weeks.",
      },
      {
        question: "Can you handle SEO and Google Ads for an Ahmedabad business?",
        answer:
          "Yes. Technical SEO, local SEO, and paid campaigns are run by the same team that builds the site, so the pages and the campaigns stay in sync.",
      },
      {
        question: "How is pricing structured?",
        answer:
          "Fixed-scope projects are quoted in INR after discovery. Budget ranges start from ₹5L for focused builds, and larger platforms are split into phases with milestone payments.",
      },
    ],
    keywords: [
      "website development company in Ahmedabad",
      "software development company Ahmedabad",
      "web development agency Ahmedabad",
      "mobile app development Ahmedabad",
      "SEO agency Ahmedabad",
      "custom software Ahmedabad",
    ],
  },
];

/** The USA keeps its own URL (/software-development-usa) but uses the same page design. */
export const usaLocation: LocationEntry = {
  slug: "united-states",
  name: "United States",
  inName: "the US",
  kind: "country",
  group: "international",
  isoCode: "US",
  eyebrow: "United States · Remote delivery",
  h1: "Software development for US companies",
  seoTitle: "Software Development Company for US Teams",
  seoDescription:
    "Novaro Solution builds web apps, mobile products, and AI systems for companies in the United States. Remote studio in Gandhinagar, calls in the US morning.",
  ogHeadline: "Software development for US companies",
  lede: "Web apps, mobile products, and AI systems for teams in the United States. One team in Gandhinagar, weekly demos, and calls in the US morning.",
  cardSummary: "Calls at the start of your Eastern day, progress overnight.",
  facts: [
    { value: "US morning", label: "Calls at the end of the India workday" },
    { value: "1 team", label: "Design, engineering, and launch" },
    { value: "Weekly", label: "A working build, not a status deck" },
    { value: "2–3 days", label: "From discovery call to proposal" },
  ],
  timezone: { city: "New York", offset: -5, zone: "EST", dstOffset: -4, dstZone: "EDT" },
  howWeWork: [
    "Discovery call in your morning. We send a scoped proposal within 2–3 business days.",
    "Shared Slack and a single backlog. Decisions happen in the thread, not in a chain of vendors.",
    "Weekly demo of something you can click. Scope changes get priced before they are built.",
    "Handover with docs. A retainer is optional if you want us after launch.",
  ],
  hireUsFor: [
    "A first product or a rebuild when the current stack is slowing sales down.",
    "AI features with a fallback — document extraction, search, review queues.",
    "The marketing site and the product in the same codebase, so SEO and the app do not drift apart.",
    "D2C storefronts, logistics platforms, healthcare services, and fintech tools.",
  ],
  data: {
    title: "US privacy rules, planned with you",
    body: "We plan data flows with your team around the rules that apply to you — for example CCPA/CPRA requests from California users, or HIPAA if the product handles health data. Hosting can stay in a US cloud region.",
  },
  areas: ["New York", "San Francisco Bay Area", "Austin", "Seattle", "Boston", "Chicago", "Los Angeles", "Miami"],
  faqs: [
    {
      question: "Do you have an office in the United States?",
      answer:
        "No. The studio is in Gandhinagar, India. US companies work with us remotely — shared Slack, weekly demos, and calls booked for the US morning.",
    },
    {
      question: "What time do you overlap with US teams?",
      answer:
        "Studio hours are Monday–Saturday, 10:00–19:00 IST. That covers the US East morning. The rest of the day runs asynchronously on Slack so your team is not blocked waiting for a reply.",
    },
    {
      question: "What do you build for US companies?",
      answer:
        "Web apps, mobile products, AI features, and the marketing site around them. Recent work includes D2C storefronts, logistics platforms, healthcare services, and fintech tools.",
    },
    {
      question: "How does a US company start a project?",
      answer:
        "Send a short brief. We do a 30-minute discovery call, then a written proposal with scope, timeline, and price — usually within 2–3 business days.",
    },
  ],
  keywords: [
    "software development company USA",
    "software development company for US companies",
    "hire software developers for a US startup",
    "offshore software development company",
    "custom software development USA",
  ],
};

/** Markets shown as sections of the /locations hub. */
export const markets: MarketEntry[] = [
  {
    slug: "india",
    name: "India",
    isoCode: "IN",
    eyebrow: "India · Same time zone",
    summary:
      "Remote delivery across India from Gandhinagar. We share your time zone, so the whole working day overlaps.",
    timezone: null,
    data: {
      title: "DPDP Act, 2023",
      body: "Consent and purpose limits are planned into the app from the first sprint, and hosting can stay in an Indian cloud region.",
    },
    areas: ["Mumbai", "Bengaluru", "Delhi NCR", "Pune", "Hyderabad", "Vadodara", "Surat", "Rajkot"],
  },
  {
    slug: "united-states",
    name: "United States",
    isoCode: "US",
    eyebrow: "USA · Remote delivery",
    summary: "Calls at the start of your Eastern day; progress continues overnight.",
    timezone: usaLocation.timezone,
    data: usaLocation.data,
    areas: usaLocation.areas,
    href: "/software-development-usa",
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    isoCode: "GB",
    eyebrow: "UK · Remote delivery",
    summary: "The studio is online for the whole London morning, Monday to Friday — and Saturday if you need it.",
    timezone: { city: "London", offset: 0, zone: "GMT", dstOffset: 1, dstZone: "BST" },
    data: {
      title: "UK GDPR",
      body: "Personal data is kept to what the product needs, access is limited to named engineers, and hosting can stay in a UK or EU region.",
    },
    areas: ["London", "Manchester", "Birmingham", "Leeds", "Bristol", "Edinburgh"],
  },
  {
    slug: "europe",
    name: "Europe",
    isoCode: "EU",
    eyebrow: "Europe · Remote delivery",
    summary: "Overlap through the CET morning and early afternoon for reviews and decisions.",
    timezone: { city: "Berlin", offset: 1, zone: "CET", dstOffset: 2, dstZone: "CEST" },
    data: {
      title: "GDPR transfers",
      body: "India has no EU adequacy decision, so personal-data transfers need safeguards such as Standard Contractual Clauses. We agree this with you before the build, and hosting can stay in an EU region.",
    },
    areas: ["Germany", "Netherlands", "France", "Ireland", "Spain", "Sweden"],
  },
  {
    slug: "uae",
    name: "United Arab Emirates",
    isoCode: "AE",
    eyebrow: "UAE · Remote delivery",
    summary: "Only 1½ hours apart — nearly the whole UAE working day overlaps, Monday to Saturday.",
    timezone: { city: "Dubai", offset: 4, zone: "GST" },
    data: {
      title: "UAE PDPL",
      body: "Data flows are planned with the UAE Personal Data Protection Law in mind, and with DIFC or ADGM rules if your company is registered in those free zones.",
    },
    areas: ["Dubai", "Abu Dhabi", "Sharjah"],
  },
  {
    slug: "canada",
    name: "Canada",
    isoCode: "CA",
    eyebrow: "Canada · Remote delivery",
    summary: "Calls at the start of your Eastern day; written progress waiting each morning.",
    timezone: { city: "Toronto", offset: -5, zone: "EST", dstOffset: -4, dstZone: "EDT" },
    data: {
      title: "PIPEDA",
      body: "Consent, purpose limits, and access controls are planned with PIPEDA in mind, and Quebec's Law 25 where it applies.",
    },
    areas: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
  },
  {
    slug: "australia",
    name: "Australia",
    isoCode: "AU",
    eyebrow: "Australia · Remote delivery",
    summary: "Daily overlap in your afternoon; more hours for Perth.",
    timezone: { city: "Sydney", offset: 10, zone: "AEST", dstOffset: 11, dstZone: "AEDT" },
    data: {
      title: "Privacy Act 1988",
      body: "Collection notices, purpose limits, and secure storage are planned around the Australian Privacy Principles.",
    },
    areas: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  },
];

export function getLocation(slug: string): LocationEntry | undefined {
  return locations.find((location) => location.slug === slug);
}

export function locationPath(slug: string): string {
  return `/locations/${slug}`;
}

/** Where a market links: its own page if it has one, otherwise its section on the hub. */
export function marketHref(market: MarketEntry): string {
  return market.href ?? `/locations#${market.slug}`;
}

/** Links for the service-area labels used across the site (hero, footer, contact). */
export const serviceAreaLinks: Record<string, string> = {
  USA: "/software-development-usa",
  Canada: "/locations#canada",
  "United Kingdom": "/locations#united-kingdom",
  Europe: "/locations#europe",
  UAE: "/locations#uae",
  Australia: "/locations#australia",
  India: "/locations#india",
  Worldwide: "/it-services",
  Gandhinagar: "/locations/gandhinagar",
  Ahmedabad: "/locations/ahmedabad",
  "GIFT City": "/locations/gandhinagar",
};

export type OverlapResult = {
  hours: number;
  /** Overlap start/end in the client's local hours (may exceed 24 before normalising). */
  startLocal: number;
  endLocal: number;
  /** Studio start/end in the client's local hours. */
  studioStartLocal: number;
  studioEndLocal: number;
  /** Overlap window in the client's local time, e.g. "09:00–13:30". */
  window: string | null;
  /** Studio hours (10:00–19:00 IST) shown in the client's local time. */
  studioLocal: string;
};

export function formatHour(value: number): string {
  const normalized = ((value % 24) + 24) % 24;
  const h = Math.floor(normalized);
  const m = Math.round((normalized - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Overlap between studio hours and a 09:00–18:00 client workday at the given UTC offset. */
export function computeOverlap(offset: number): OverlapResult {
  const studioStartUtc = STUDIO_HOURS.start - STUDIO_UTC_OFFSET;
  const studioEndUtc = STUDIO_HOURS.end - STUDIO_UTC_OFFSET;
  let best = { hours: 0, start: 0, end: 0 };
  // Check the client day and its neighbours so windows that cross midnight UTC are caught.
  for (const shift of [-24, 0, 24]) {
    const clientStartUtc = 9 - offset + shift;
    const clientEndUtc = 18 - offset + shift;
    const start = Math.max(studioStartUtc, clientStartUtc);
    const end = Math.min(studioEndUtc, clientEndUtc);
    if (end - start > best.hours) best = { hours: end - start, start, end };
  }
  return {
    hours: best.hours,
    startLocal: best.start + offset,
    endLocal: best.end + offset,
    studioStartLocal: studioStartUtc + offset,
    studioEndLocal: studioEndUtc + offset,
    window: best.hours > 0 ? `${formatHour(best.start + offset)}–${formatHour(best.end + offset)}` : null,
    studioLocal: `${formatHour(studioStartUtc + offset)}–${formatHour(studioEndUtc + offset)}`,
  };
}

export function overlapBadge(timezone: LocationTimezone | null): string {
  if (!timezone) return "Same time zone";
  const overlap = computeOverlap(timezone.offset);
  if (overlap.hours === 0) return "Morning calls";
  const rounded = Math.round(overlap.hours * 2) / 2;
  return `≈${rounded % 1 === 0 ? rounded : rounded.toFixed(1)} h overlap`;
}
