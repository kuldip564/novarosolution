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
  /** Last edit, from the API. Shown only when it is later than the publication day. */
  updatedAt?: string;
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

const builtInPosts: BlogPost[] = [
  {
    id: "fallback-website-development-process",
    title: "Website development process: from brief to launch",
    slug: "website-development-process",
    excerpt:
      "The stages we follow for business websites and web apps, what you bring to each one, and where projects usually slip.",
    coverImage: { secureUrl: "/images/services/web-app-eng.webp", publicId: null },
    content: `<p>Most website projects that go wrong do so before any code is written: the brief was vague, nobody owned the content, or launch was treated as the finish line. This is the process we follow at Novaro for business websites and web apps, from the first brief to the weeks after launch, with what you need to bring to each stage.</p><h2>The brief: one page is enough</h2><p>A useful brief answers five questions:</p><ul><li>What the business sells, and to whom</li><li>What a visitor must be able to do on the site: call, book, buy or sign in</li><li>Which kinds of page you expect: home, service, product, article, contact</li><li>Who will supply the text, photos and prices</li><li>The date that matters, and why</li></ul><p>It doesn't need wireframes or a long feature list. From the brief we book a 30-minute call, then send a written proposal with the scope, timeline and milestones.</p><h2>Scope: count layouts and features, not pages</h2><p>The size of a website project depends less on how many pages it has than on how many distinct layouts it needs and what the site has to do. Mr Antidot, a pest-control company in Ahmedabad, offers ten treatments, and its site has a page for each. The ten pages share one service-page layout, and every Book Now button opens the contact form with that service already selected. That is ten pages, one layout and one small piece of form logic. <a href="/work/mr-antidot">Read the Mr Antidot case study</a>.</p><p>This is also the moment to agree, in writing, what the first release will not include. A short out-of-scope list prevents most arguments later.</p><h2>Design: settle the pages that carry the traffic</h2><p>We design the home page and the one or two templates most visitors will land on, usually a service or product page, at phone and desktop widths. Once those are approved, the remaining layouts follow the same system of type, colour, spacing and buttons, so they go quickly.</p><p>The decisions worth your time at this stage are the navigation, the main call to action on each page type, and how forms behave. Colours and photos are easier to change later than structure.</p><h2>Content: the step that most often slips</h2><p>Text, photos, prices and product data are the slowest part of most projects, and placeholder text hides layout problems until it is replaced. Agree early who writes what and by when, and put real content into the design as soon as it exists. If we write or source the content, that is part of the quote.</p><h2>Build: something to click every week</h2><p>We build in short cycles and share a working preview link every week, so you review real pages on your own phone rather than screenshots. Feedback is most useful while a page is being built, and it is cheapest then too.</p><p>Complex flows are easier to review in parts. On Quadrato Cargo, a courier platform, booking a pickup is split into four short steps: route and pickup, sender, recipient, then parcel details. Each step asks only for what it needs, which also makes each one easy to test on its own. <a href="/work/quadrato-cargo">See the Quadrato Cargo case study</a>.</p><h2>Testing before launch</h2><p>Before anything goes live we check:</p><ul><li>Every form submits, and the message reaches the right inbox</li><li>Pages work on a real phone, not only in a desktop browser</li><li>Keyboard navigation, visible focus and colour contrast meet WCAG 2.2 level AA</li><li>Every page has its own title and description, and the sitemap lists the pages you want found</li><li>Speed, measured with Lighthouse on mobile settings</li></ul><h2>Launch: domain, redirects and measurement</h2><p>Launch day is mostly configuration. The domain is pointed at the new site. If an old site existed, each old URL is redirected to its new equivalent, so existing links and search visibility carry over. The sitemap is submitted in Google Search Console, and analytics is checked to confirm it records visits and enquiries.</p><h2>The first weeks after launch</h2><p>Real visitors find what the brief missed. Plan for security and dependency updates, small content changes, and a review after six to eight weeks of what Search Console and analytics show: which pages are found, for which searches, and where visitors leave.</p><h2>How long it takes</h2><p>The timelines we publish are 3–6 weeks for marketing sites and landing pages, and 8–14 weeks for MVPs and web apps. Content that is ready on time moves these more than anything else.</p><h2>What to do next</h2><p>If you are setting a budget, read <a href="/blog/website-development-cost-india">what changes the cost of a website in India</a>. If you are comparing partners, read <a href="/blog/hire-it-services-company">what to check before you hire an IT services company</a>. Or <a href="/contact?service=web-app-eng">send us a short brief</a> and we will reply within one business day.</p><h2>Sources</h2><ul><li><a href="https://www.w3.org/TR/WCAG22/">Web Content Accessibility Guidelines (WCAG) 2.2, W3C</a></li><li><a href="https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview">What is a sitemap, Google Search Central</a></li><li><a href="https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes">Site moves and migrations, Google Search Central</a></li></ul>`,
    category: "Web Development",
    tags: ["Website development process", "Web design", "Project planning", "Website launch"],
    author: { name: "Novaro Team", avatar: null },
    publishedAt: "2026-11-12T12:00:00.000Z",
    readingTime: 0,
    metaTitle: "Website Development Process: From Brief to Launch",
    metaDescription:
      "The website development process we follow, from a one-page brief to launch and the weeks after: scope, design, content, build, testing and launch.",
    ogImage: null,
  },
  {
    id: "fallback-mobile-app-development-process",
    title: "Mobile app development process: from idea to Google Play",
    slug: "mobile-app-development-process",
    excerpt:
      "How we take an app from first sketch to the Play Store, using VeggieKing's customer and delivery-partner apps as the example.",
    coverImage: { secureUrl: "/images/work/veggieking.jpg", publicId: null },
    content: `<p>A mobile app is rarely one app. Behind a delivery app there is usually a second app for the people who deliver, and a web panel for the team that runs it all. When we built VeggieKing, a fresh fruit and vegetable delivery service, the product was two Flutter apps, one for customers and one for delivery partners, plus a web admin panel. This guide follows a project like that from the first idea to a Google Play release.</p><h2>Map everyone who touches an order</h2><p>Start with people, not screens. For VeggieKing that meant:</p><ul><li><strong>Customers</strong>, who browse, order, pay and track a delivery</li><li><strong>Delivery partners</strong>, who pick up orders and deliver them</li><li><strong>The store and operations team</strong>, who manage stores and delivery areas, the catalogue and prices, stock, orders, riders and cash</li></ul><p>Each group gets its own app or panel, with only what that person needs. Mixing them into one app makes every screen harder to use.</p><h2>Decide what the first release must do</h2><p>The first release should complete one loop end to end: a customer places an order, a partner delivers it, and the team can see that it happened. Everything else, from loyalty points to reorder shortcuts, earns its place once people order regularly. Write the first release down as a short list and keep it visible.</p><h2>Choose the stack</h2><p>We built VeggieKing in Flutter, and the Zeevan and KankreG storefronts with Expo, the React Native framework. The right choice depends on your platforms, whether you need a website from the same code, and who will maintain the app. We compare the options in <a href="/blog/react-native-vs-native-apps">React Native, Flutter or native apps: how we choose</a>.</p><h2>Design for one hand and a busy day</h2><p>People use delivery apps on the move. A few rules we follow:</p><ul><li>Keep the main action within reach of the thumb. In VeggieKing the cart stays one tap away, in a bar above the tab bar.</li><li>Make every tap target at least 48dp, as Android's accessibility guidance recommends.</li><li>Design the loading, empty and error states, not only the happy path.</li><li>Let people correct mistakes easily. VeggieKing's November 2026 update made cancelling an order a two-tap action.</li></ul><h2>Build the backend and admin alongside the apps</h2><p>The apps are only as good as the data behind them. Orders, stock, delivery areas and rider assignments live on the server and in the admin panel, and they need to be built at the same pace as the app screens. VeggieKing also uses Google Maps for location and live tracking, and Firebase for sign-in, push notifications, analytics and crash reports.</p><h2>Test on real phones and real networks</h2><p>Emulators miss what customers run into. Test on older and low-memory Android phones, on slow mobile data, with location permission denied, and with the app sent to the background in the middle of an order.</p><h2>Prepare the Google Play release</h2><p>Publishing on Google Play has its own checklist:</p><ul><li><strong>App Bundle.</strong> Since August 2021, new apps must be published on Google Play as an Android App Bundle (.aab).</li><li><strong>Signing.</strong> You sign uploads with an upload key, and Play App Signing holds the key that signs what users install. Store the upload keystore and its passwords somewhere safe, outside the code repository.</li><li><strong>Version codes.</strong> Every upload needs a higher version code than the one before.</li><li><strong>Target API level.</strong> Google Play raises the required target API level every year. From 31 August 2026, new apps and app updates must target Android 16 (API level 36), which is what we moved VeggieKing's customer app to in November 2026.</li><li><strong>Data safety.</strong> The Data safety form in Play Console describes what data the app collects and shares, and it must match what the app actually does.</li><li><strong>Testing tracks.</strong> Internal, closed and open tests let real people try a build before production. Developers with personal accounts created after 13 November 2023 must run a closed test with at least 12 testers for 14 days before they can apply for production access.</li></ul><h2>After launch: small, regular updates</h2><p>A store app is never finished. Crash reports and reviews show what to fix, and small regular releases are easier to test than rare large ones. VeggieKing's 7 November 2026 update, for example, added orders by any weight, one-tap reorder, clearer live tracking and two-tap cancellation.</p><h2>What to do next</h2><p>See what we built in the <a href="/work/veggieking">VeggieKing case study</a>, or compare stacks in <a href="/blog/react-native-vs-native-apps">React Native, Flutter or native apps</a>. If you are planning an app, <a href="/contact?service=web-app-eng">tell us what it has to do</a> and we will suggest a first release.</p><h2>Sources</h2><ul><li><a href="https://developer.android.com/guide/app-bundle">About Android App Bundles, Android Developers</a></li><li><a href="https://developer.android.com/studio/publish/app-signing">Sign your app, Android Developers</a></li><li><a href="https://developer.android.com/studio/publish/versioning">Version your app, Android Developers</a></li><li><a href="https://developer.android.com/google/play/requirements/target-sdk">Meet Google Play's target API level requirement, Android Developers</a></li><li><a href="https://support.google.com/googleplay/android-developer/answer/10787469">Provide information for Google Play's Data safety section, Play Console Help</a></li><li><a href="https://support.google.com/googleplay/android-developer/answer/9845334">Set up an open, closed or internal test, Play Console Help</a></li><li><a href="https://support.google.com/googleplay/android-developer/answer/14151465">App testing requirements for new personal developer accounts, Play Console Help</a></li><li><a href="https://support.google.com/accessibility/android/answer/7101858">Touch target size, Android Accessibility Help</a></li></ul>`,
    category: "Mobile Apps",
    tags: ["Mobile app development process", "Flutter", "Google Play", "App launch"],
    author: { name: "Novaro Team", avatar: null },
    publishedAt: "2026-11-12T11:00:00.000Z",
    readingTime: 0,
    metaTitle: "Mobile App Development Process: From Idea to Google Play",
    metaDescription:
      "The mobile app development process we follow, from mapping users to a Google Play release, with lessons from shipping VeggieKing's two Flutter apps.",
    ogImage: null,
  },
  {
    id: "fallback-website-performance",
    title: "Website performance: what we fixed on our own site",
    slug: "website-performance-optimization",
    excerpt:
      "Real before-and-after numbers from our own site: a 3D background, oversized images, a map that loaded too early, and what is still not good enough.",
    coverImage: { secureUrl: "/images/services/cloud-devops.webp", publicId: null },
    content: `<p>We tell clients that a slow website costs them enquiries, so in November 2026 we measured our own. The results were mixed: good on phones in places, poor on desktop in others, and in one case slowed down by a decorative effect we were proud of. This is what we found, what we changed and what still needs work. Every number here is a lab measurement, and we explain below why that matters.</p><h2>How we measured</h2><p>We ran Lighthouse 12.8 against a production build of the site, three runs per page and device type, and took the median. The mobile runs emulate a mid-range phone on a slow 4G connection with a slowed-down processor. We also ran Google's PageSpeed Insights against the live homepage.</p><p>Lab tests are repeatable, which makes them good for before-and-after comparisons, but they are not what real visitors experience. Real-user data comes from the Chrome UX Report, and our site did not yet have enough traffic for it to report any. So we don't claim to pass Core Web Vitals; we can only say the lab numbers moved.</p><h2>A 3D background that blocked the page for over a second</h2><p>PageSpeed Insights gave our live homepage a desktop score of 65, with 1,220 ms of total blocking time, 9.1 seconds of main-thread work and 20 long tasks. The cause was a decorative three.js background. On a machine without a graphics processor, as in Google's test environment, Chrome draws WebGL on the CPU, and our scene was rendering at the full refresh rate.</p><p>We changed four things:</p><ul><li>Decorative 3D now starts only after the page has loaded and the browser is idle</li><li>The animation is capped at 30 frames a second and stops completely when the tab is hidden</li><li>Software renderers without a GPU are treated as having no WebGL, so they get the static CSS background instead</li><li>Phones, and visitors who prefer reduced motion, never load it</li></ul><h2>Images that skipped optimisation</h2><p>A cache-busting query string on our project images stopped the Next.js image optimiser from processing them, so 1,024-pixel JPEGs of about 230 KB each went to every screen size. Our Work page alone moved 826 KB of images on mobile. Once the images went through the optimiser, zeevan.jpg, for example, dropped from a 223 KB JPEG to a 48 KB AVIF at 640 pixels wide. The Work page's mobile image weight fell from 826 KB to 201 KB, and its lab LCP from 5.71 s to 3.79 s.</p><h2>A map that loaded before anyone saw it</h2><p>The Google Maps embed on our contact page pulled in about 460 KB of third-party script as soon as the page opened, even though the map sits near the bottom. It now loads only when it scrolls within 200 pixels of view, with a styled placeholder until then. The contact page's total mobile transfer fell from 1,012 KB to 487 KB.</p><h2>A validation library on every page</h2><p>Our contact form used zod for validation, about 73 KB gzipped, and that code was prefetched from every page. We replaced it with a small hand-written validator with the same rules and messages; the server still validates every submission. The contact page's initial JavaScript fell from 333 KB to 270 KB gzipped, and the rest of the site stopped downloading the form code.</p><h2>Headings that waited for JavaScript</h2><p>Page headings were hidden until JavaScript ran, and the whole page rendered a second time after it loaded. Now headings paint with the HTML. On desktop, the moment the largest element actually appeared moved from about 1.2–2.6 s to about 0.1–0.2 s after navigation; on the contact page, from 2,582 ms to 97 ms.</p><h2>What is still not good enough</h2><ul><li>On mobile, lab LCP was still 3.4–4.1 s on most pages. Google's threshold for a good LCP is 2.5 seconds or less, so those pages sat in the "needs improvement" range.</li><li>Every page still downloaded about 260–290 KB of shared JavaScript, including an animation library.</li><li>A second font file of 84 KB downloaded on pages that show the rupee sign, because ₹ falls outside the basic Latin character set.</li><li>We have no real-user data yet. Until the Chrome UX Report covers the site, we can't say how it performs for visitors.</li></ul><h2>A checklist you can use on your own site</h2><ol><li>Measure first, over several runs, and keep the numbers</li><li>Check the image weight of each page, and whether images are resized for phones</li><li>List every third-party embed, and load each one only when it is needed</li><li>Find large libraries that are sent to pages that don't use them</li><li>Make sure the main heading and first paragraph show without JavaScript</li><li>Give decorative effects the lowest priority: after load, and never on weak devices</li></ol><h2>What to do next</h2><p>For the search side of the same work, read <a href="/blog/tech-seo-tips">technical SEO that moves the needle</a>. If your site feels slow, <a href="/contact?service=cloud-devops">send us the address</a> and we will tell you what we would check first, or see our <a href="/services/cloud-devops">cloud, DevOps and design services</a>.</p><h2>Sources</h2><ul><li><a href="https://web.dev/articles/lcp">Largest Contentful Paint (LCP), web.dev</a></li><li><a href="https://web.dev/articles/vitals">Web Vitals, web.dev</a></li><li><a href="https://developer.chrome.com/docs/lighthouse/performance/performance-scoring">Lighthouse performance scoring, Chrome for Developers</a></li><li><a href="https://developer.chrome.com/docs/crux">Overview of the Chrome UX Report, Chrome for Developers</a></li></ul>`,
    category: "Web Development",
    tags: ["Website performance optimization", "Core Web Vitals", "Lighthouse", "Next.js"],
    author: { name: "Novaro Team", avatar: null },
    publishedAt: "2026-11-12T10:00:00.000Z",
    readingTime: 0,
    metaTitle: "Website Performance Optimization: What We Fixed on Our Site",
    metaDescription:
      "What slowed our own website and how we fixed it: deferred 3D effects, optimised images, a lazy map and a smaller form bundle, with real Lighthouse numbers.",
    ogImage: null,
  },
  {
    id: "fallback-react-native-vs-native",
    title: "React Native, Flutter or native apps: how we choose",
    slug: "react-native-vs-native-apps",
    excerpt:
      "We have shipped Expo storefronts and Flutter apps. When each approach fits, and when fully native apps are worth the extra cost.",
    coverImage: { secureUrl: "/images/work/zeevan/home-desktop.webp", publicId: null },
    content: `<p>There are three main ways to build a mobile app today: separate native apps for iOS and Android, React Native, or Flutter. We have shipped work with both cross-platform options. Zeevan and KankreG, two D2C stores, are built with Expo, the React Native framework, and VeggieKing's customer and delivery-partner apps are built with Flutter. This is how we decide which one a project should use.</p><h2>The three options in brief</h2><ul><li><strong>Native.</strong> Two codebases: Swift for iOS and Kotlin for Android. Each app uses its platform's own tools and interface components directly.</li><li><strong>React Native.</strong> One codebase in JavaScript or TypeScript, written with React. Expo adds tooling, routing and build services on top, and React Native for Web lets much of the same code run in a browser.</li><li><strong>Flutter.</strong> One codebase in Dart. Flutter has its own implementation of each interface control instead of using the system's, and its code compiles to native code.</li></ul><h2>When React Native with Expo fits</h2><p>React Native suits teams that already work in React and TypeScript, and products that need a website and apps from shared code. Zeevan and KankreG are web storefronts built with Expo and Expo Router, so the same React Native code that serves the browser today can be extended into store apps later, without starting again.</p><ul><li>You need a website and mobile apps, and want to share screens and logic between them</li><li>Your team, or the team that will maintain the product, knows React</li><li>Most screens are standard: lists, forms, product pages and accounts</li></ul><h2>When Flutter fits</h2><p>Flutter suits apps with a strongly branded interface that should look the same on every phone. Because Flutter draws its own controls, a design looks and behaves consistently across Android versions and manufacturers. VeggieKing's apps have custom festive themes, a floating cart bar, maps and live order tracking, and both the customer and delivery-partner apps are written in the same language and framework.</p><ul><li>The app is mobile first, and a website is a separate product or not needed</li><li>The design is custom rather than close to standard iOS and Android screens</li><li>You want one team to build and maintain more than one app</li></ul><h2>When native is worth the extra cost</h2><p>Two native codebases cost more to build and maintain, so they need a reason. Good reasons include:</p><ul><li>Deep use of platform features: home-screen widgets, complex background work, advanced camera or audio, or augmented reality</li><li>Needing new operating-system features on the day they ship</li><li>An in-house team that already works natively on each platform</li></ul><h2>Questions we ask before choosing</h2><ul><li>Which platform matters first: Android, iOS, the web, or all three?</li><li>Do you need a website from the same code?</li><li>Which phone features does the first release use: camera, location, background tasks, Bluetooth?</li><li>Does the app need to work offline?</li><li>Who will maintain it after launch, and what do they already know?</li></ul><p>For most business apps, such as catalogues, carts, bookings and tracking, all three approaches are fast enough. Slow apps are usually slow because of large images, too many network calls or long lists that render every row at once, and no framework fixes those on its own.</p><h2>What to do next</h2><p>Read our <a href="/blog/mobile-app-development-process">mobile app development process</a>, or see the stacks in practice in the <a href="/work/veggieking">VeggieKing</a> and <a href="/work/zeevan">Zeevan</a> case studies. If you are deciding for your own product, <a href="/contact?service=web-app-eng">tell us what it has to do</a> and we will recommend a starting point.</p><h2>Sources</h2><ul><li><a href="https://reactnative.dev/docs/getting-started">React Native documentation</a></li><li><a href="https://docs.expo.dev/">Expo documentation</a></li><li><a href="https://necolas.github.io/react-native-web/">React Native for Web</a></li><li><a href="https://docs.flutter.dev/resources/architectural-overview">Flutter architectural overview</a></li></ul>`,
    category: "Mobile Apps",
    tags: ["React Native vs native", "Flutter", "Expo", "Cross-platform apps"],
    author: { name: "Novaro Team", avatar: null },
    publishedAt: "2026-11-12T09:00:00.000Z",
    readingTime: 0,
    metaTitle: "React Native vs Flutter vs Native Apps: How We Choose",
    metaDescription:
      "React Native, Flutter or native iOS and Android apps? When each fits, the questions we ask first, and what we used for Zeevan, KankreG and VeggieKing.",
    ogImage: null,
  },
  {
    id: "fallback-seo-indian-businesses",
    title: "SEO for Indian businesses: a practical guide",
    slug: "seo-for-indian-businesses",
    excerpt:
      "Where to start with SEO when your customers search by city and service, enquire by phone or WhatsApp, and mostly browse on mobile.",
    coverImage: { secureUrl: "/images/services/digital-marketing.webp", publicId: null },
    content: `<p>Most SEO advice is written for American and British websites. Indian businesses share the fundamentals but work in a different market: customers search by service and city, enquire by phone or WhatsApp as often as by form, and many search in more than one language. This guide sets out the order we would work in for a business starting SEO properly. It is not a promise of rankings; nobody can honestly give one.</p><h2>Start with what people search for, by service and city</h2><p>Local customers rarely search for a company name. They search for a service and a place, such as "pest control in Ahmedabad" or "website design in Gandhinagar". Two free sources show what people actually type:</p><ul><li>The Performance report in Google Search Console, once your site has been live for a few weeks</li><li>Google's own search suggestions, and the "People also ask" questions for your services</li></ul><p>Give each service its own page that answers the questions those searches imply: what it is, what it costs or how pricing works, how long it takes, and how to book. The Mr Antidot website, for example, has a separate page for each of its ten pest-control treatments, each with its time, starting price, method and a booking path.</p><h2>Set up Google Business Profile properly</h2><p>For searches with a place in them, the map results often appear before the websites. Google says local results are mainly based on relevance, distance and popularity. In practice that means:</p><ul><li>Verify the profile, and choose the most specific primary category</li><li>Set real opening hours, a service area if you visit customers, and the services you offer</li><li>Add your own photos of the premises, the team and the work</li><li>Ask real customers for reviews, and reply to them. Never buy reviews or post fake ones: Google's policies prohibit fake engagement and remove it</li></ul><h2>Keep your name, address and phone number consistent</h2><p>Use the same business name, address and phone number on your website, your Business Profile and the directories your customers use, such as Justdial or IndiaMART. Inconsistent details make it harder for search engines, and for customers, to trust that the listings describe one business.</p><h2>Make the website easy to crawl and understand</h2><ul><li>A unique title and description on every page you want found</li><li>One canonical URL per page, so duplicates don't compete with each other</li><li>An XML sitemap, submitted in Search Console</li><li>Internal links from your home page and articles to each service page</li><li>Structured data for your organisation, breadcrumbs and articles, generated by the site rather than pasted in by hand</li></ul><p>Our own site works the same way: every page declares its own canonical URL, and the organisation, breadcrumb and article structured data comes from templates.</p><h2>Speed matters on mobile data</h2><p>Many visitors will reach you on a phone, on mobile data. Heavy images, embedded maps and large scripts cost them time before they see anything. We measured and fixed our own site, with real numbers, in <a href="/blog/website-performance-optimization">website performance: what we fixed on our own site</a>.</p><h2>Write in the language your customers search in</h2><p>If customers search in Hindi or Gujarati as well as English, consider pages in those languages, written properly rather than machine translated. Put each language on its own URL, and tell search engines how the versions relate with hreflang. A few good pages in a second language beat many thin ones.</p><h2>Make enquiries easy, and measure them</h2><p>An enquiry is the result that matters. Put a phone number and a WhatsApp link where people can tap them, keep forms short, and pass along context, such as the service the visitor was reading about. Then measure: on our own site, Google Analytics records clicks on phone, email and WhatsApp links as separate events, so we can see which pages lead to contact.</p><h2>What to avoid</h2><ul><li>Near-identical pages for every city with only the name swapped. Google treats these as doorway pages, which its spam policies prohibit.</li><li>Keyword stuffing: repeating a phrase until the text stops reading naturally</li><li>Buying links or reviews</li><li>Anyone who guarantees a first-page ranking</li></ul><h2>A 90-day starting plan</h2><ol><li><strong>Month one:</strong> set up Search Console and analytics, verify and complete your Business Profile, and fix technical basics such as titles, canonical URLs, the sitemap and speed.</li><li><strong>Month two:</strong> improve or create one page per service, with real prices or pricing logic, photos and a clear way to enquire.</li><li><strong>Month three:</strong> publish articles that answer the questions customers ask before buying, link them to the service pages, and ask every happy customer for a review.</li></ol><p>Then review what Search Console shows: which pages appear, for which searches, and which get clicks.</p><h2>What to do next</h2><p>For the technical checklist, read <a href="/blog/tech-seo-tips">technical SEO that moves the needle</a>. If you are in Gujarat, see our <a href="/locations/gandhinagar">Gandhinagar studio page</a>. Or <a href="/contact?service=digital-marketing">send us your website and what you sell</a>, and we will tell you what we would check first.</p><h2>Sources</h2><ul><li><a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide">SEO Starter Guide, Google Search Central</a></li><li><a href="https://support.google.com/business/answer/7091">Tips to improve your local ranking on Google, Google Business Profile Help</a></li><li><a href="https://support.google.com/contributionpolicy/answer/7400114">Prohibited and restricted content, Maps user-generated content policy</a></li><li><a href="https://developers.google.com/search/docs/essentials/spam-policies">Spam policies for Google web search, Google Search Central</a></li><li><a href="https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites">Managing multi-regional and multilingual sites, Google Search Central</a></li><li><a href="https://search.google.com/search-console/about">Google Search Console</a></li></ul>`,
    category: "Digital Marketing",
    tags: ["SEO for Indian businesses", "Local SEO", "Google Business Profile", "Search Console"],
    author: { name: "Novaro Team", avatar: null },
    publishedAt: "2026-11-12T08:00:00.000Z",
    readingTime: 0,
    metaTitle: "SEO for Indian Businesses: A Practical Guide",
    metaDescription:
      "A practical SEO guide for Indian businesses: city and service searches, Google Business Profile, technical basics, language, enquiries and a 90-day plan.",
    ogImage: null,
  },
  {
    id: "fallback-website-cost-india",
    title: "Website development cost in India: what changes the price",
    slug: "website-development-cost-india",
    excerpt:
      "Why quotes for the same website vary so much, the five things that move the price, and how to get quotes you can compare.",
    coverImage: { secureUrl: "/images/webapp-dashboard.webp", publicId: null },
    content: `<p>Ask five agencies what a website costs and you will get five numbers that are hard to compare. The price follows the work, and the work depends on a handful of decisions you can make before you ask. This guide explains those decisions, and how we quote.</p><h2>The short answer</h2><p>A business website in India is priced on five things: how many distinct page layouts it needs, what it has to do beyond showing information, who supplies the content, how much design work it needs, and what happens after launch. We quote a fixed price for an agreed scope after a 30-minute discovery call, and larger builds are split into phases, so you pay for one release at a time.</p><h2>Page layouts, not page count</h2><p>Twenty service pages that share one layout cost far less than five pages that each need their own design. So count layouts instead: home, a service or product page, a listing page, an article, contact.</p><p>Mr Antidot, a pest-control company in Ahmedabad, has a page for each of its ten treatments, with the time it takes, the starting price and the method. All ten use one layout, and every Book Now button opens the contact form with that service selected. The site is large in pages but modest in layouts. <a href="/work/mr-antidot">Read the case study</a>.</p><h2>What the site has to do</h2><p>A site that only presents information is the simplest to build. Each of these adds design and build time:</p><ul><li>Enquiry or booking forms that carry context, such as the service a visitor was reading about</li><li>Online payments and a cart</li><li>Customer accounts and order history</li><li>A content management system your team can use without a developer</li><li>Integrations with a CRM, WhatsApp, email or accounting software</li></ul><h2>Who supplies the content</h2><p>Writing, photography and product data are often the slowest part of a project. If you supply final text and images, the build is shorter. If we write and source them, that time is added to the quote.</p><h2>How much design work it needs</h2><p>Applying an existing brand costs less than creating one. Custom illustration, animation and interactive features add time, and they are worth it only where they help visitors understand or decide.</p><h2>What happens after launch</h2><p>A domain, hosting, security updates and small changes are ongoing costs. They are easy to forget when comparing quotes, so ask every agency what is included in the first year and what costs extra.</p><h2>How long it takes</h2><p>Time and price move together. The timelines we publish are 3–6 weeks for marketing sites and landing pages, and 8–14 weeks for MVPs and web apps.</p><h2>How to get quotes you can compare</h2><p>Send every agency the same one-page brief:</p><ul><li>What the business sells, and to whom</li><li>The page layouts you expect</li><li>The features you need from the list above</li><li>Who supplies the content</li><li>Your deadline</li></ul><p>Then ask each one for the deliverables, timeline and payment milestones in writing. A quote without those is a guess, and two guesses can't be compared.</p><h2>What to do next</h2><p>If you are budgeting for software people log into rather than a website, read <a href="/blog/saas-mvp-cost-factors">what changes the cost of a SaaS MVP</a>. For the stages of a build, read <a href="/blog/website-development-process">our website development process</a>. To get a number for your own project, <a href="/contact?service=web-app-eng">send us a short brief</a> and we will reply within one business day.</p>`,
    category: "Web Development",
    tags: ["Website development cost", "Website cost India", "Small business website", "Budget"],
    author: { name: "Novaro Team", avatar: null },
    publishedAt: "2026-11-12T07:00:00.000Z",
    readingTime: 0,
    metaTitle: "Website Development Cost in India: What Changes the Price",
    metaDescription:
      "What a business website costs in India depends on layouts, features, content and upkeep. How we scope and quote, and what moves the price up or down.",
    ogImage: null,
  },
  {
    id: "fallback-saas-mvp-cost",
    title: "What changes the cost of a SaaS MVP",
    slug: "saas-mvp-cost-factors",
    excerpt:
      "Scope, integrations, accounts, and admin work move the price of a first SaaS release. A number without those facts is a guess.",
    coverImage: { secureUrl: "/images/work/mr-antidot/home-desktop.webp", publicId: null },
    content: `<p>A SaaS MVP is the smallest product a real user can log into and finish one job. The price moves with what that job requires, not with a flat package.</p><h2>What actually changes the cost</h2><ul><li>How many roles sign in, and what each role is allowed to see</li><li>Integrations that must work on day one — payments, email, or an existing database</li><li>Whether an admin needs to fix a customer record without a developer</li><li>How much of the workflow is new versus a screen on top of a tool you already pay for</li></ul><p>Leave reporting, extra roles, and nice-to-have integrations for the next release. A weekly build shows whether the first loop is worth finishing. <a href="/work/mr-antidot">Mr Antidot</a> is a service product with booking and pricing, which is the same shape as a first SaaS release. If you are scoping one, start with <a href="/services/web-app-eng">web and app development</a> or <a href="/contact">send a short brief</a>.</p>`,
    category: "Web Development",
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
    coverImage: { secureUrl: "/images/work/quadrato-cargo/home-desktop.webp", publicId: null },
    content: `<p>Off-the-shelf software is the right buy when many companies do the job the same way. Custom software is worth it when the way you work is why customers pick you.</p><h2>Buy when</h2><ul><li>The workflow matches what the product already does, with light settings</li><li>You can live with the vendor's screens, data model, and release schedule</li><li>The job is accounting, email, or another problem that is already solved</li></ul><h2>Build when</h2><ul><li>Staff keep a spreadsheet beside the tool because the tool cannot do the real job</li><li>Customers would notice if you swapped the product for a generic one</li><li>Two or three tools have to be glued together for one order, booking, or shipment</li></ul><p><a href="/work/quadrato-cargo">Quadrato Cargo</a> needed booking, tracking, and dispatch in one product. A generic site would not have run that operation. If that sounds like the problem, see <a href="/services/web-app-eng">web and app development</a> or <a href="/contact">talk through the workflow</a>.</p>`,
    category: "Web Development",
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
    coverImage: { secureUrl: "/images/novaro-it-services.webp", publicId: null },
    content: `<p>An IT services company is a fit when the same team can design, build, and launch. A fit is not a slide deck from one vendor and a codebase from another.</p><h2>Ask these before you sign</h2><ul><li>Who is on the squad, and do they stay for the whole build?</li><li>What will you click at the end of each week?</li><li>What is out of scope, and how is a change priced?</li><li>Where is the studio, and when can you speak to them live?</li></ul><p>The first step is a brief and a 30-minute call.</p>`,
    category: "Web Development",
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
    category: "Web Development",
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
    coverImage: { secureUrl: "/images/novaro-it-services.webp", publicId: null },
    content: `<p>A US company does not need a local office from its software partner. It needs a squad that shows working software every week and answers while your morning is still open.</p><h2>The hours</h2><p>Our studio runs Monday–Saturday, 10:00–19:00 IST. That window covers the US East morning. We book calls then. The rest of the day is Slack: decisions, screenshots, and a written note when something changes scope.</p><h2>What to send first</h2><ul><li>Who the product is for, and what they do today instead</li><li>The date you need a first version people can use</li><li>What is out of scope for that first version</li></ul><p>We reply with a 30-minute call and a proposal. No pitch deck required.</p>`,
    category: "Web Development",
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
    coverImage: { secureUrl: "/images/services/web-app-eng.webp", publicId: null },
    content: `<p>Most product delays aren't technical — they're coordination tax. Hand-offs between agencies, internal teams, and vendors create gaps where decisions stall and scope drifts.</p><h2>One team, one backlog</h2><p>We run discovery, design, build, and launch with the same squad. Trade-offs get made in real time, not in email threads three days later.</p><ul><li>Weekly demos with something clickable — not slide decks</li><li>Shared metrics: performance, conversion, and reliability from day one</li><li>Design systems that engineers actually use</li></ul><p>If you're planning a rebuild or a net-new product, start with the shortest path to something users can touch.</p>`,
    category: "Web Development",
    tags: ["Delivery", "Process", "Next.js"],
    author: { name: "Novaro Team", avatar: null },
    publishedAt: "2026-10-12T00:00:00.000Z",
    readingTime: 3,
    metaTitle: "Shipping faster with a single full-stack team",
    metaDescription:
      "Why one team for design, engineering and growth cuts hand-offs, and how weekly demos keep a software project moving.",
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
    category: "AI & Automation",
    tags: ["LLM", "Computer vision"],
    author: { name: "Novaro Team", avatar: null },
    publishedAt: "2026-10-05T00:00:00.000Z",
    readingTime: 3,
    metaTitle: "Practical AI features for production apps",
    metaDescription:
      "The AI features we build most often, from document extraction to search over your own content, and the guardrails that keep them reliable.",
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
    category: "Digital Marketing",
    tags: ["SEO", "Performance", "Analytics"],
    author: { name: "Novaro Team", avatar: null },
    publishedAt: "2026-09-28T00:00:00.000Z",
    readingTime: 3,
    metaTitle: "Technical SEO that moves the needle",
    metaDescription:
      "The technical SEO baseline to fix before spending on ads: unique titles, one canonical URL, Core Web Vitals, internal links and structured data.",
    ogImage: null,
  },
];

/** Reading time from the text itself (about 220 words a minute), so it stays right when copy changes. */
function readingMinutes(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Built-in posts, newest first, with reading time measured from the content. */
const fallbackPosts: BlogPost[] = builtInPosts
  .map((post) => ({ ...post, readingTime: readingMinutes(post.content) }))
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

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
    related: [
      ...fallbackPosts.filter((item) => item.slug !== slug && item.category === post.category),
      ...fallbackPosts.filter((item) => item.slug !== slug && item.category !== post.category),
    ].slice(0, 3),
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
