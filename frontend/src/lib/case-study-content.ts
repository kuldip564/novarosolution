/**
 * Long-form case-study copy for /work/[slug].
 *
 * Every statement here was checked against the live client site in November
 * 2026 (pages, features, footer credit, framework and hosting from the HTML and
 * response headers) or against this repository. Figures the clients publish
 * about their own business are attributed to them and never shown as Novaro
 * results. No revenue, traffic, conversion or delivery-date claims: add those
 * only with the client's written approval.
 */

export type CaseStudyItem = { title: string; body: string };

export type CaseStudyScreenshot = {
  src: string;
  alt: string;
  caption: string;
  device: "desktop" | "mobile";
  width: number;
  height: number;
};

export type CaseStudyContent = {
  slug: string;
  seoTitle: string;
  description: string;
  h1: string;
  /** One-sentence summary used on the portfolio card and under the H1. */
  summary: string;
  client: string;
  industry: string;
  projectType: string;
  /** Portfolio filter group. */
  group: "E-commerce" | "Web platforms" | "Mobile apps";
  platform: string;
  liveUrl: string;
  /** Set for mobile apps: the store `liveUrl` points to, e.g. "Google Play". Websites leave it out. */
  store?: string;
  /** The credit line as it appears in the client site's footer (websites only). */
  credit?: string;
  /** Replaces the default "Captured from the live site" line under the screenshots. */
  screenshotsNote?: string;
  services: Array<{ label: string; href: string }>;
  overview: string[];
  clientBackground: { paragraphs: string[]; source: string };
  challenge: string[];
  objectives: string[];
  approach: CaseStudyItem[];
  solution: string;
  features: CaseStudyItem[];
  architecture: Array<{ label: string; value: string }>;
  process: CaseStudyItem[];
  screenshots: CaseStudyScreenshot[];
  technologies: Array<{ name: string; note: string }>;
  outcomes: string[];
  /** Only filled in when the team has something specific and true to say. */
  lessons?: string[];
};

export const CAPTURED = "November 2026";

const webService = { label: "Web & mobile app development", href: "/services/web-app-eng" };
const marketingService = { label: "Digital marketing & SEO", href: "/services/digital-marketing" };

function shot(
  slug: string,
  file: string,
  device: "desktop" | "mobile",
  alt: string,
  caption: string,
): CaseStudyScreenshot {
  const size =
    device === "desktop"
      ? { width: 1280, height: 800 }
      : file === "home-mobile.webp" && slug === "zeevan"
        ? { width: 780, height: 1210 }
        : { width: 780, height: 1560 };
  return { src: `/images/work/${slug}/${file}`, alt, caption, device, ...size };
}

const expoArchitecture = (domain: string) => [
  { label: "Framework", value: "Expo with Expo Router (React Native for the web)" },
  { label: "Rendering", value: "Single-page app that loads from a static HTML shell" },
  { label: "Catalogue data", value: "Products are fetched from an API when the page loads" },
  { label: "Hosting", value: `Vercel, serving ${domain}` },
];

const zeevan: CaseStudyContent = {
  slug: "zeevan",
  seoTitle: "Zeevan Case Study: D2C Pantry Store on Expo",
  description:
    "How we built Zeevan's D2C pantry store with Expo: ghee, oil, masala and honey ranges, shop filters, customer accounts, order tracking and a mobile-first layout.",
  h1: "Zeevan: a D2C pantry store for ghee, oil, masala and honey",
  summary:
    "An online store for an Indian pantry brand, with four product ranges, shop filters, customer accounts and order tracking.",
  client: "Zeevan",
  industry: "Food & pantry · D2C",
  projectType: "E-commerce store",
  group: "E-commerce",
  platform: "Web, built with Expo",
  liveUrl: "https://www.zeevan.shop/",
  credit: "Created by NovaRo Solution",
  services: [webService],
  overview: [
    "Zeevan sells A2 bilona ghee, cold-pressed oils, ground masala and Haldar honey directly to customers. We built its online store: a home page that tells the product story range by range, a shop with search and filters, and account pages for orders, rewards and saved addresses.",
    "The store is built with Expo, the React Native framework that targets the web, iOS and Android from one codebase.",
  ],
  clientBackground: {
    paragraphs: [
      "Zeevan is an Indian pantry brand. Its website describes small-batch production, ingredients from native herds and rain-fed farms, and quality testing at sourcing, processing and packing.",
    ],
    source: "zeevan.shop",
  },
  challenge: [
    "Premium pantry products sell on trust. Before paying more for ghee or oil, buyers want to know where it comes from and how it is made.",
    "Zeevan needed a store that explains sourcing and testing as clearly as it sells, covers four quite different product ranges, and stays easy to use on a phone.",
  ],
  objectives: [
    "Present ghee, oil, masala and honey as clear ranges in one store",
    "Explain sourcing, process and quality checks next to the products",
    "Let customers search, filter and sort the catalogue",
    "Give customers an account for orders, rewards and addresses",
    "Keep the layout readable and quick to use on mobile",
  ],
  approach: [
    {
      title: "Story and shop on one path",
      body: "Each hero slide is one product range with its own shop button, so reading about the brand and buying are never more than a tap apart.",
    },
    {
      title: "Trust content as part of the store",
      body: "Sourcing, process and quality sections sit on the home page between product rows, not on a separate page that few people open.",
    },
    {
      title: "One codebase for web and mobile",
      body: "Expo and Expo Router give the storefront a single React Native codebase that runs in the browser and can be extended to native apps.",
    },
  ],
  solution:
    "A single Expo storefront with a range-by-range home page, a filterable shop, sign-in, and account pages for orders, rewards, addresses and support, deployed on Vercel at zeevan.shop.",
  features: [
    { title: "Product ranges", body: "Ghee, cold-pressed oil, masala and Haldar honey, each with its own entry point from the home page." },
    { title: "Shop with filters", body: "Search, range and category filters, price bands, a rating filter and sorting by price or newest." },
    { title: "Hero carousel", body: "A rotating banner per range, each with its own call to action." },
    { title: "Customer accounts", body: "Sign-in, order history, rewards, saved addresses and a support page." },
    { title: "Order tracking", body: "Delivery tracking is offered as part of the store, alongside a secure checkout." },
    { title: "Sourcing and quality sections", body: "Home page sections that explain where ingredients come from and how batches are checked." },
  ],
  architecture: expoArchitecture("zeevan.shop"),
  process: [
    { title: "Structure", body: "Product ranges, categories and the story sections that sit between them." },
    { title: "Design", body: "A warm, premium visual style applied to phone and desktop layouts." },
    { title: "Build", body: "Expo screens for home, shop, cart and account, connected to the product API." },
    { title: "Launch", body: "Deployment on Vercel under the zeevan.shop domain." },
  ],
  screenshots: [
    shot("zeevan", "home-desktop.webp", "desktop", "Zeevan home page on desktop: a cold-pressed oil hero banner with Shop oil and Our story buttons", "Home page hero, one slide per product range"),
    shot("zeevan", "home-mobile.webp", "mobile", "Zeevan home page on a phone: Haldar honey hero banner with a Shop now button", "The same hero on a phone"),
  ],
  technologies: [
    { name: "Expo", note: "React Native framework for web and native apps" },
    { name: "Expo Router", note: "File-based routing for the store's screens" },
    { name: "React Native for Web", note: "Renders the React Native UI in the browser" },
    { name: "Vercel", note: "Hosting" },
  ],
  outcomes: [
    "The store is live at zeevan.shop",
    "Four product ranges with search, filters and sorting",
    "Customer accounts with orders, rewards and saved addresses",
    "The site footer credits the build: “Created by NovaRo Solution”",
  ],
};

const kankreg: CaseStudyContent = {
  slug: "kankreg",
  seoTitle: "KankreG Case Study: A2 Ghee Store on Expo",
  description:
    "How we built KankreG's A2 ghee store with Expo: shop-by-collection, product filters, offer codes, order tracking and policy pages, designed for mobile shoppers.",
  h1: "KankreG: an A2 ghee and pantry store built for mobile shoppers",
  summary:
    "A D2C store for A2 Kankrej ghee, wood-pressed oils and atta, with collections, offers and order tracking.",
  client: "KankreG",
  industry: "Food & pantry · D2C",
  projectType: "E-commerce store",
  group: "E-commerce",
  platform: "Web, built with Expo",
  liveUrl: "https://www.kankreg.com/",
  credit: "Created by NovaRo Solution",
  services: [webService],
  overview: [
    "KankreG sells A2 Kankrej bilona ghee, wood-pressed oils and high-protein atta online. We built its store: collections you can browse from the home page, product cards with pack sizes and offers, a filterable shop and the order and policy pages a D2C brand needs.",
    "Like Zeevan, the store is built with Expo, so the same React Native code can serve the web and native apps.",
  ],
  clientBackground: {
    paragraphs: [
      "KankreG is a Gujarat food brand. Its website lists a corporate office in Ahmedabad and a registered and packing unit in Banaskantha, and describes bilona-churned ghee from the milk of desi cows.",
    ],
    source: "kankreg.com",
  },
  challenge: [
    "KankreG sells a short range at premium prices, so each product has to make its own case: how it is made, what makes it different, and which pack suits the buyer.",
    "The store also had to carry offers and multiple pack sizes, from a trial pack to a gift box, without becoming cluttered on a small screen.",
  ],
  objectives: [
    "Sell ghee, oils and atta as clear collections",
    "Show pack sizes, prices and offers on every product card",
    "Support discount codes and order tracking",
    "Publish shipping, refund, privacy and terms pages",
    "Keep browsing and adding to cart quick on a phone",
  ],
  approach: [
    {
      title: "Collections first",
      body: "A shop-by-collection row (Ghee, Oil, Atta, All) sits right under the hero, so buyers choose a category before they scroll.",
    },
    {
      title: "Product cards that sell",
      body: "Each card shows pack, price, discount and an add button, so buying doesn't require opening the product page.",
    },
    {
      title: "Offers without clutter",
      body: "A slim promo bar carries the current discount code across the site instead of pop-ups.",
    },
  ],
  solution:
    "An Expo storefront with a collection-led home page, a shop with category, price and sort controls, quick-add product cards, order tracking, newsletter sign-up and full policy pages, deployed on Vercel at kankreg.com.",
  features: [
    { title: "Shop by collection", body: "Ghee, Oil, Atta and All, one tap from the home page." },
    { title: "Product cards with quick add", body: "Pack size, price, discount badge and an add-to-cart button on every card." },
    { title: "Shop filters", body: "Category, price range and sorting by featured, price or newest." },
    { title: "Offer codes", body: "A site-wide promo bar showing the current discount code." },
    { title: "Order tracking", body: "A Track Your Order page linked from the footer." },
    { title: "Policy pages", body: "Shipping, refund, privacy and terms of service pages, plus a sitemap page." },
  ],
  architecture: expoArchitecture("kankreg.com"),
  process: [
    { title: "Structure", body: "Collections, pack sizes and the sourcing and quality story." },
    { title: "Design", body: "A heritage visual style with large product photography." },
    { title: "Build", body: "Expo screens for home, shop, cart and order tracking, connected to the product API." },
    { title: "Launch", body: "Deployment on Vercel under the kankreg.com domain." },
  ],
  screenshots: [
    shot("kankreg", "home-desktop.webp", "desktop", "KankreG home page on desktop: A2 Kankrej cow ghee jar in the hero with a Shop Ghee button", "Home page hero and promo bar"),
    shot("kankreg", "shop-desktop.webp", "desktop", "KankreG shop page on desktop: category, price and sort filters beside product cards for atta, oil and ghee", "Shop page with filters and quick-add cards"),
    shot("kankreg", "home-mobile.webp", "mobile", "KankreG home page on a phone: ghee hero and the shop-by-collection row", "Collections one tap from the hero on a phone"),
  ],
  technologies: [
    { name: "Expo", note: "React Native framework for web and native apps" },
    { name: "Expo Router", note: "File-based routing for the store's screens" },
    { name: "React Native for Web", note: "Renders the React Native UI in the browser" },
    { name: "Vercel", note: "Hosting" },
  ],
  outcomes: [
    "The store is live at kankreg.com",
    "Three collections with quick-add product cards, filters and sorting",
    "Order tracking, newsletter sign-up and shipping, refund, privacy and terms pages",
    "The site footer credits the build: “Created by NovaRo Solution”",
  ],
};

const mrAntidot: CaseStudyContent = {
  slug: "mr-antidot",
  seoTitle: "Mr Antidot Pest Control Website",
  description:
    "How we built Mr Antidot's pest-control website on Next.js: ten service pages with prices and booking, sector pages, team profiles, a blog and lead capture.",
  h1: "Mr Antidot: a pest-control website with service booking",
  summary:
    "A Next.js website for a pest-control and hygiene company, with a page and booking path for each of its ten services.",
  client: "Mr Antidot",
  industry: "Pest control & hygiene services",
  projectType: "Service website with booking",
  group: "Web platforms",
  platform: "Web, built with Next.js",
  liveUrl: "https://www.mrantidot.com/",
  credit: "Developed by NovaRo Solution",
  services: [webService, marketingService],
  overview: [
    "Mr Antidot provides pest control, deep cleaning and hygiene management for homes and businesses. We built its website on Next.js: a page for each of its ten treatments with time, starting price and method, a booking path from every service, and pages for sectors, the team, a blog and a gallery.",
  ],
  clientBackground: {
    paragraphs: [
      "Mr Antidot is based in Navrangpura, Ahmedabad. Its website states more than eight years of industry experience and lists the sectors it serves, from hospitals and hotels to housing societies, offices, pharmaceutical sites, retail, schools and warehouses.",
    ],
    source: "mrantidot.com",
  },
  challenge: [
    "People comparing pest-control companies want to know what a treatment involves, how long it takes and roughly what it costs before they call.",
    "Mr Antidot offers ten distinct treatments to very different customers, from households to clinics and warehouses. It needed a site that answers those questions service by service and turns interest into booked inspections.",
  ],
  objectives: [
    "Give every treatment its own page with time, starting price and method",
    "Make booking a service or a free inspection one click from anywhere",
    "Show the sectors served and the people behind the work",
    "Publish articles that answer common customer questions",
    "Offer phone and WhatsApp contact alongside the forms",
  ],
  approach: [
    {
      title: "One page per service",
      body: "Each treatment has its own URL with the facts a customer asks first: category, estimated time, starting price, method, warranty, what's included, and FAQs.",
    },
    {
      title: "Booking carries context",
      body: "Every Book Now button opens the contact form with that service already selected, so the enquiry arrives with the right details.",
    },
    {
      title: "Trust through specifics",
      body: "Sector pages, named team profiles, a gallery and articles give customers evidence beyond a sales page.",
    },
  ],
  solution:
    "A Next.js website with a services catalogue, ten service detail pages, a pre-filled booking form, sector coverage, individual team profiles, a blog, a gallery, phone and WhatsApp contact, and a sign-in area, hosted on Vercel at mrantidot.com.",
  features: [
    { title: "Ten service pages", body: "General pest control, cockroach, mosquito, rodent, bed bug, termite, fumigation, bird management, silo treatment and deep cleaning." },
    { title: "Service facts", body: "Estimated time, starting price, treatment method, warranty, what's included, dos and don'ts, and FAQs on each page." },
    { title: "Pre-filled booking", body: "Book Now links open the contact form with the chosen service selected." },
    { title: "Free inspection call to action", body: "A free-inspection button in the hero and a booking button in the header." },
    { title: "Sectors and team", body: "Eight sectors served, plus a profile page for each team member." },
    { title: "Blog, gallery and contact", body: "Articles on pest problems, a photo gallery, a video, and phone and WhatsApp links." },
  ],
  architecture: [
    { label: "Framework", value: "Next.js (confirmed by the site's response headers)" },
    { label: "Routing", value: "Separate URLs for each service, team member and blog post" },
    { label: "Booking", value: "Contact form that reads the selected service from the link" },
    { label: "Hosting", value: "Vercel, serving mrantidot.com" },
  ],
  process: [
    { title: "Structure", body: "Services, sectors and the facts each service page needs." },
    { title: "Design", body: "A clean, trustworthy visual style with clear booking buttons." },
    { title: "Build", body: "Next.js pages for services, team, blog, gallery and contact, plus the booking form." },
    { title: "Launch", body: "Deployment on Vercel under the mrantidot.com domain." },
  ],
  screenshots: [
    shot("mr-antidot", "home-desktop.webp", "desktop", "Mr Antidot home page on desktop: hero reading Complete Hygiene Management for Your Homes and Businesses, with a Get Free Inspection button", "Home page with the free-inspection call to action"),
    shot("mr-antidot", "service-desktop.webp", "desktop", "Mr Antidot termite treatment page on desktop: category, estimated time and starting price beside a treatment photo", "A service page: termite treatment"),
    shot("mr-antidot", "services-mobile.webp", "mobile", "Mr Antidot services page on a phone: General Pest Control card with price and Book Now and View More buttons", "Services list on a phone"),
  ],
  technologies: [
    { name: "Next.js", note: "React framework with server-rendered pages" },
    { name: "React", note: "UI library behind Next.js" },
    { name: "Vercel", note: "Hosting" },
  ],
  outcomes: [
    "The website is live at mrantidot.com",
    "Ten service pages, each with a starting price and a booking path",
    "Sector, team, blog and gallery pages are published",
    "The site footer credits the build: “Developed by NovaRo Solution”",
  ],
};

const quadratoCargo: CaseStudyContent = {
  slug: "quadrato-cargo",
  seoTitle: "Quadrato Cargo Courier Platform",
  description:
    "How we built Quadrato Cargo's courier platform on Next.js: four-step pickup booking, instant or scheduled collection, tracking IDs with QR lookup and quotes.",
  h1: "Quadrato Cargo: courier booking and shipment tracking platform",
  summary:
    "A Next.js courier platform with four-step pickup booking, tracking by ID, quote requests and customer accounts.",
  client: "Quadrato Cargo",
  industry: "Logistics & courier",
  projectType: "Booking and tracking platform",
  group: "Web platforms",
  platform: "Web, built with Next.js",
  liveUrl: "https://www.quadratocargo.com/",
  credit: "Technology partner: NovaRo Solution",
  services: [webService],
  overview: [
    "Quadrato Cargo offers doorstep courier pickup for domestic and international shipments. We built its platform on Next.js: a four-step booking flow, instant or scheduled pickup, shipment tracking by booking or tracking ID, quote requests, pricing and customer accounts.",
  ],
  clientBackground: {
    paragraphs: [
      "Quadrato Cargo is an international courier. Its website states 10,000+ deliveries, coverage of 180 countries and 50+ agency partners, and describes a pickup target of about 10 minutes where the service operates. These are the client's own figures, not results we measured.",
    ],
    source: "quadratocargo.com",
  },
  challenge: [
    "For a courier, the website is part of the operation, not just marketing. Customers need to book a pickup, know when it will happen and follow the parcel afterwards.",
    "That has to work for domestic and cross-border routes without customers calling dispatch at every step.",
  ],
  objectives: [
    "Let customers book domestic or international pickups online",
    "Offer instant collection by postal code or a scheduled time slot",
    "Give every shipment an ID customers can track",
    "Handle quote requests for routes that need confirming",
    "Let regular senders register and save addresses",
  ],
  approach: [
    {
      title: "Tracking first",
      body: "The home page opens with the tracking box, so a returning customer can check a parcel without looking for it.",
    },
    {
      title: "Booking in four short steps",
      body: "Route and pickup, sender, recipient, then parcel details. Each step asks only for what it needs, and saved addresses fill steps two and three.",
    },
    {
      title: "Honest service promises",
      body: "Pickup times are shown as targets that depend on area, traffic and capacity, and prices that depend on the route go through a quote request.",
    },
  ],
  solution:
    "A Next.js platform with tracking, a four-step booking flow, instant or scheduled pickup, quote requests, pricing by coverage zone, a how-it-works page and customer accounts, hosted on Vercel with a strict Content Security Policy.",
  features: [
    { title: "Shipment tracking", body: "Look up status by booking or tracking ID from the home page or the track page." },
    { title: "Four-step booking", body: "Route and pickup, sender, recipient, then parcel and send." },
    { title: "Instant or scheduled pickup", body: "Instant collection by postal code, or a chosen date and time slot." },
    { title: "Tracking ID and QR", body: "Each accepted booking gets a tracking ID, and the receipt supports QR status lookup." },
    { title: "Quotes and pricing", body: "Quote requests for any route, and a pricing page with coverage zones." },
    { title: "Customer accounts", body: "Registration and sign-in, with saved addresses that auto-fill bookings." },
  ],
  architecture: [
    { label: "Framework", value: "Next.js with prerendered pages (confirmed by response headers)" },
    { label: "Security", value: "Content Security Policy headers, including frame-ancestors 'none'" },
    { label: "Accounts", value: "Registration and sign-in for senders, with saved addresses" },
    { label: "Hosting", value: "Vercel, serving quadratocargo.com" },
  ],
  process: [
    { title: "Flow mapping", body: "Booking, pickup and tracking steps, for both domestic and international routes." },
    { title: "Design", body: "A light, clear interface with tracking and booking always in reach." },
    { title: "Build", body: "Next.js pages for booking, tracking, quotes, pricing and accounts." },
    { title: "Launch", body: "Deployment on Vercel with security headers in place." },
  ],
  screenshots: [
    shot("quadrato-cargo", "home-desktop.webp", "desktop", "Quadrato Cargo home page on desktop: Track your shipment box with Book courier, Log in and Get a Quote cards", "Home page with tracking first"),
    shot("quadrato-cargo", "book-desktop.webp", "desktop", "Quadrato Cargo booking page on desktop: step 1 of 4, parcels and route, with the four booking steps listed", "Step one of the four-step booking flow"),
    shot("quadrato-cargo", "home-mobile.webp", "mobile", "Quadrato Cargo home page on a phone: tracking box with Book and Track buttons fixed at the bottom", "Tracking and booking on a phone"),
  ],
  technologies: [
    { name: "Next.js", note: "React framework with prerendered pages" },
    { name: "React", note: "UI library behind Next.js" },
    { name: "Content Security Policy", note: "Browser security headers" },
    { name: "Vercel", note: "Hosting" },
  ],
  outcomes: [
    "The platform is live at quadratocargo.com",
    "Booking, tracking, quote, pricing and account pages are published",
    "Instant and scheduled pickup options with time slots",
    "The site footer credits the build: “Technology partner: NovaRo Solution”",
  ],
};

/** Phone screens from the VeggieKing customer app, cropped to the display (personal details blurred). */
function appShot(file: string, alt: string, caption: string): CaseStudyScreenshot {
  return { src: `/images/work/veggieking/${file}`, alt, caption, device: "mobile", width: 713, height: 1550 };
}

/**
 * Checked in November 2026 against the app's Google Play listing (description, release
 * notes, data-safety section), the screens above and the Flutter source code. The 15-minute
 * delivery time is the client's own promise, shown as such.
 */
const veggieKing: CaseStudyContent = {
  slug: "veggieking",
  seoTitle: "VeggieKing Grocery Delivery App",
  description:
    "How we built VeggieKing's grocery delivery apps in Flutter: category shopping, any-weight orders, live tracking, loyalty points and a delivery-partner app.",
  h1: "VeggieKing: fresh fruit and vegetable delivery apps",
  summary:
    "Flutter apps for customers and delivery partners, with any-weight orders, live tracking, loyalty points and festive themes, live on Google Play.",
  client: "VeggieKing",
  industry: "Grocery & quick commerce",
  projectType: "Grocery delivery apps",
  group: "Mobile apps",
  platform: "Android apps on Google Play, built with Flutter",
  liveUrl: "https://play.google.com/store/apps/details?id=com.cm.vegieeking.customer",
  store: "Google Play",
  screenshotsNote: "Screens from the customer app, November 2026. Personal details are blurred.",
  services: [webService],
  overview: [
    "VeggieKing delivers fresh fruits, vegetables and everyday groceries to the customer's door. We built its customer app and its delivery-partner app in Flutter: category shopping and voice search, orders by any weight, live order tracking, VeggieKing Points, one-tap reorder and seasonal festive themes, with a web admin panel for stores, stock, orders and riders.",
  ],
  clientBackground: {
    paragraphs: [
      "VeggieKing is a fresh fruit, vegetable and grocery delivery service. Its Google Play listing describes farm-fresh vegetables, seasonal fruits, quality-checked and hygienically packed products, and fast doorstep delivery.",
      "The app's home screen promises delivery in 15 minutes from a nearby store. That is the client's service promise, not a figure we measured.",
    ],
    source: "the VeggieKing listing on Google Play",
  },
  challenge: [
    "Fresh produce is bought often, in small and exact quantities, and customers expect it at the door quickly. A repeat order has to take seconds, not minutes.",
    "Behind the app, each order has to reach a store with stock and a rider nearby, so customers, riders and the store team all need the same live picture of the order.",
  ],
  objectives: [
    "Let customers shop by category or search, including by voice",
    "Allow orders by any weight, not only fixed pack sizes",
    "Show live order status and tracking after checkout",
    "Bring customers back with points, one-tap reorder and seasonal touches",
    "Give delivery partners an app of their own",
    "Give the team one admin panel for stores, stock, orders and riders",
  ],
  approach: [
    {
      title: "Shopping in a few taps",
      body: "Categories and search open the home screen, search works by voice, and the cart stays one tap away in a bar above the tab bar.",
    },
    {
      title: "Built for repeat orders",
      body: "An Order again tab, saved addresses, and a cart that shows how far the order is from free delivery and what the customer saves.",
    },
    {
      title: "Local and seasonal",
      body: "Festive themes change the app for the season, such as Diwali with greetings in Gujarati, and the Sabji Slice mini-game gives customers a reason to open the app between orders.",
    },
  ],
  solution:
    "Two Flutter apps on Google Play, VeggieKing for customers and Veggieking Delivery Boy for delivery partners, using Firebase for sign-in, push notifications, analytics and crash reports and Google Maps for location and tracking, run from a web admin panel for stores, catalogue and pricing, inventory, orders, riders and cash.",
  features: [
    { title: "15-minute delivery promise", body: "The home screen shows the delivery time from a nearby store, and products carry a 15 MINS badge." },
    { title: "Categories and voice search", body: "Vegetables, fruits, herbs and spices, leafy greens and combo packs, with search by typing or speaking." },
    { title: "Any weight", body: "Customers can type their own amount, such as 130 g, instead of picking a fixed pack." },
    { title: "Live tracking", body: "Order status and live tracking after checkout, and an order can be cancelled in two taps." },
    { title: "A cart that helps", body: "Progress towards free delivery, savings on the order, save for later and cash on delivery." },
    { title: "Points and reorder", body: "VeggieKing Points are earned on delivered orders and can be used at checkout; one tap adds a past order back to the cart." },
    { title: "Festive themes and Sabji Slice", body: "Seasonal themes such as Diwali, and a mini-game where customers slice vegetables and climb a leaderboard." },
    { title: "Delivery-partner app", body: "A separate Flutter app for riders, Veggieking Delivery Boy, also on Google Play." },
    { title: "Admin panel", body: "Stores and delivery areas, catalogue and pricing, inventory, orders and riders, and cash reconciliation in one place." },
  ],
  architecture: [
    { label: "Apps", value: "Flutter: a customer app and a delivery-partner app" },
    { label: "Release", value: "Android App Bundles on Google Play, targeting API level 36" },
    { label: "Maps and location", value: "Google Maps, device location and route lines for live tracking" },
    { label: "Notifications", value: "Firebase Cloud Messaging push notifications" },
    { label: "Monitoring", value: "Firebase Analytics, and Crashlytics in the delivery-partner app" },
    { label: "Admin", value: "Web admin panel with roles, two-factor sign-in and store-level access" },
  ],
  process: [
    { title: "Flow mapping", body: "Browse, cart, checkout, tracking and reorder for customers; pickup and delivery for riders; stock and orders for stores." },
    { title: "Design", body: "A warm, food-first interface with large product photos, festive themes and the cart always in reach." },
    { title: "Build", body: "Two Flutter apps and the admin panel, working from the same orders." },
    { title: "Release and updates", body: "Published on Google Play and updated regularly; the 7 November 2026 release added any-weight orders, one-tap reorder and clearer tracking." },
  ],
  screenshots: [
    appShot(
      "home-mobile.webp",
      "VeggieKing home screen in its Diwali theme: delivery in 15 minutes, search with voice input, and Vegetables, Fruits, Herbs & Spices, Leafy Greens and Combo Packs",
      "Home with the Diwali theme and categories",
    ),
    appShot(
      "product-mobile.webp",
      "VeggieKing product page: Miniature Banana (Elaichi kela), 250 g for ₹40, with a 15 MINS badge and an Add button",
      "Product page",
    ),
    appShot(
      "cart-mobile.webp",
      "VeggieKing cart: progress towards free delivery, savings on the order, VeggieKing Points and Place Order with cash on delivery",
      "Cart with free-delivery progress and points",
    ),
    appShot(
      "account-mobile.webp",
      "VeggieKing account screen: orders, VeggieKing Points, help, the delivery address and the Sabji Slice game, with personal details blurred",
      "Account with points and the Sabji Slice game",
    ),
  ],
  technologies: [
    { name: "Flutter", note: "Customer and delivery-partner apps" },
    { name: "Firebase", note: "Sign-in, push notifications, analytics and crash reports" },
    { name: "Google Maps", note: "Location and live order tracking" },
  ],
  outcomes: [
    "The customer app is live on Google Play",
    "The delivery-partner app, Veggieking Delivery Boy, is live on Google Play",
    "The 7 November 2026 update added any-weight orders, one-tap reorder, clearer live tracking and two-tap cancellation",
    "Google Play's data safety section lists data as encrypted in transit, with deletion on request",
  ],
};

export const caseStudyContent: Record<string, CaseStudyContent> = {
  [zeevan.slug]: zeevan,
  [kankreg.slug]: kankreg,
  [mrAntidot.slug]: mrAntidot,
  [quadratoCargo.slug]: quadratoCargo,
  [veggieKing.slug]: veggieKing,
};

export function getCaseStudyContent(slug: string): CaseStudyContent | null {
  return caseStudyContent[slug] ?? null;
}
