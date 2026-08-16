import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envFile = fs.readFileSync(".env", "utf-8");
const env = Object.fromEntries(
  envFile
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => l.trim().split("="))
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const skillId = "468b41ba-30af-4f72-bfaf-881bd6f81ff2";

async function run() {
  console.log("Updating Skill #77: SEO Fundamentals (9 steps across 3 tracks)...");

  // 1. Fetch tracks for this skill
  const { data: tracks, error: tErr } = await supabase
    .from("tracks")
    .select("id, title, order_index")
    .eq("skill_id", skillId)
    .order("order_index");

  if (tErr || !tracks || tracks.length < 3) {
    console.error("Error fetching tracks:", tErr);
    return;
  }

  const track1Id = tracks[0].id;
  const track2Id = tracks[1].id;
  const track3Id = tracks[2].id;

  // Update Track titles
  await supabase.from("tracks").update({ title: "Track 1: Crawling, Indexing, Canonicalization and Technical Architecture" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: On-Page Optimization, Semantic HTML and Schema JSON-LD" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: PageRank, Link Equity, Core Web Vitals and E-E-A-T Quality" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Google Search Quality & Principal SEO level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Search Engine Pipeline: Crawl, Render and Index",
      order_index: 1,
      content: `### Search Engine Crawler Mechanics and Rendering Pipelines

1. The Three-Phase Pipeline:
   - Crawling: Googlebot discovers web pages by traversing hyperlinks, parsing XML sitemaps, and reading API feeds.
   - Two-Wave Indexing and Rendering:
     - Wave 1: Instant indexing of initial raw server-side HTML.
     - Wave 2: Headless Chromium Web Rendering Service (WRS) queues and executes client-side JavaScript, rendering the complete Document Object Model (DOM). Client-side rendered SPAs often experience indexing lag of days or weeks compared to server-rendered HTML.
   - Indexing: Parsing text, entities, and structured data into the global inverted index database.

2. Crawl Budget Management:
   - Optimizing crawl frequency on large websites (>100k URLs) by removing crawl traps (faceted faceted filter query parameters, internal infinite redirect loops).`
    },
    {
      track_id: track1Id,
      title: "Robots.txt, XML Sitemaps and HTTP Status Codes",
      order_index: 2,
      content: `### Server Directives, Protocols and Status Governance

1. Server Configuration Directives:
   - \`robots.txt\`: Controls crawler accessibility at root (\`User-agent: *\`, \`Disallow: /admin/\`).
   - XML Sitemaps Protocol: Declares canonical URLs with \`<lastmod>\` timestamps; capped at 50,000 URLs or 50MB uncompressed per sitemap index.

2. HTTP Status Code Governance:
   - \`301 Moved Permanently\`: Permanently redirects a URL, passing 95%+ of historical PageRank equity to the target URL.
   - \`302 Found\`: Temporary redirect; passes zero link equity.
   - \`410 Gone\`: Explicitly tells search engines the resource was permanently purged, de-indexing faster than standard 404s.
   - \`503 Service Unavailable\`: Used during server maintenance to pause indexing without de-listing URLs.`
    },
    {
      track_id: track1Id,
      title: "Canonicalization and Parameter Management",
      order_index: 3,
      content: `### Duplicate Content Resolution and Master URLs

1. The Canonical Link Element:
   - \`<link rel=\"canonical\" href=\"https://example.com/canonical-url\">\`: Instructs search engines which URL represents the authoritative master among duplicate or parameterized versions (\`?sort=price\`, \`?session_id=\`).

2. Self-Referencing Canonicals:
   - Enforcing self-referential canonical tags on every unique standalone page prevents third-party scraper websites or tracking parameter URLs from usurping indexing authority.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Semantic HTML, Title Tags and Heading Architecture",
      order_index: 1,
      content: `### Semantic Document Structure and Meta Tags

1. Title Tag Engineering:
   - Under 60 characters (or 600px desktop SERP container) to prevent truncation.
   - Best-Practice Formula: Primary Keyword - Secondary Modifier | Brand Name.

2. Meta Description Optimization:
   - Under 160 characters; acts as persuasive click-through ad copy containing relevant keywords and a clear call to action.

3. Semantic Heading Hierarchy:
   - Strict hierarchical structure: Exactly one \`<h1>\` tag per page reflecting primary topic, followed logically by nested \`<h2>\` and \`<h3>\` section headings without skipping structural levels.`
    },
    {
      track_id: track2Id,
      title: "Image Optimization, Internal Linking and Site Architecture",
      order_index: 2,
      content: `### Asset Optimization and Internal Equity Distribution

1. Image SEO:
   - Descriptive hyphenated file naming (\`apache-kafka-cluster-architecture.webp\`), contextual accessibility \`alt\` text describing visual entities, modern AVIF/WebP image formats, and explicit \`width\` and \`height\` attributes to avoid layout shifts.

2. Internal Linking Topologies:
   - Distributing internal PageRank equity from high-authority parent hubs to deep child articles using descriptive, keyword-rich anchor text (strictly avoiding generic \"click here\" links).`
    },
    {
      track_id: track2Id,
      title: "Schema.org Structured Data and JSON-LD Rich Snippets",
      order_index: 3,
      content: `### Machine-Readable Entity Annotation

1. JSON-LD Structured Data:
   - Embedding linked data schema in \`<script type=\"application/ld+json\">\`:
     - \`Article\` / \`BlogPosting\`: Declares author entity, publication timestamps, and publisher.
     - \`Product\`: Enables rich snippet pricing, real-time availability, and aggregate review star ratings in SERPs.
     - \`FAQPage\`: Generates interactive expandable FAQ accordions directly within search engine result listings.
     - \`BreadcrumbList\`: Establishes hierarchical navigation trails in SERPs.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "The PageRank Algorithm, Anchor Text and Link Attributes",
      order_index: 1,
      content: `### Algorithmic Link Equity and Relationship Tags

1. Larry Page's PageRank Formula:
   - PR(A) = (1 - d) + d * Sum(PR(T_i) / C(T_i)), where d = 0.85 (damping factor) and C(T_i) is the outbound link count of referring page T_i.

2. Modern Link Attributes:
   - \`rel=\"nofollow\"\`: Instructs search engine crawlers not to follow or transfer PageRank equity.
   - \`rel=\"sponsored\"\`: Mandatory markup for paid marketing links, sponsorships, and affiliate partnerships.
   - \`rel=\"ugc\"\`: Applied to user-generated forum discussions and blog comments.`
    },
    {
      track_id: track3Id,
      title: "Google Core Web Vitals and Mobile-First Indexing",
      order_index: 2,
      content: `### Technical Performance and Mobile-First Standards

1. Mobile-First Indexing:
   - Googlebot crawls, evaluates, and indexes websites exclusively using its smartphone mobile user-agent; desktop-only content is ignored for ranking calculations.

2. Core Web Vitals Benchmarks:
   - Largest Contentful Paint (LCP < 2.5s): Measures loading performance of main content element.
   - Interaction to Next Paint (INP < 200ms): Measures user interaction responsiveness across page lifecycle.
   - Cumulative Layout Shift (CLS < 0.1): Measures visual layout stability during page render.`
    },
    {
      track_id: track3Id,
      title: "Google E-E-A-T Quality Framework and Helpful Content",
      order_index: 3,
      content: `### Search Quality Evaluator Guidelines and Authority

1. The E-E-A-T Quality Framework:
   - Experience: Tangible firsthand real-world testing, original photo/video evidence of using the product.
   - Expertise: Verifiable author credentials, formal education, and published professional contributions.
   - Authoritativeness: Third-party citations, Wikipedia/Wikidata entity mapping, and backlinks from reputable domain sources (.edu, .gov, major industry publications).
   - Trustworthiness: The central pillar; clear editorial standards, secure HTTPS encryption, and accessible contact/refund information.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #77.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "What HTTP status code is used to perform a permanent redirect, transferring 95%+ of historical PageRank equity from the old URL to the new URL?",
      options: [
        "200 OK",
        "404 Not Found",
        "301 Moved Permanently",
        "500 Internal Server Error"
      ],
      correct_option_index: 2,
      explanation: "A 301 redirect signals a permanent move, transferring virtually all link equity to the destination URL.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What is the primary function of the HTML canonical link tag (<link rel=\"canonical\" href=\"...\">)?",
      options: [
        "To specify the single authoritative master URL among duplicate or parameterized page versions, preventing duplicate content penalties",
        "To change the font color of the webpage",
        "To speed up the internet connection",
        "To delete the website from the internet"
      ],
      correct_option_index: 0,
      explanation: "Canonical tags designate the master URL to index, resolving duplicate content from sorting filters and tracking parameters.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In semantic HTML document hierarchy for SEO, how many <h1> tags should typically exist on a single web page?",
      options: [
        "10 h1 tags",
        "Zero h1 tags",
        "50 h1 tags",
        "Exactly one <h1> tag (representing the core primary topic of the page)"
      ],
      correct_option_index: 3,
      explanation: "A single <h1> tag clearly establishes the primary topic for search crawlers, followed logically by <h2> and <h3> subheadings.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What preferred structured data format is recommended by Google for embedding Schema.org linked data in <script type=\"application/ld+json\"> tags?",
      options: [
        "Microdata",
        "JSON-LD (JavaScript Object Notation for Linked Data)",
        "Plain text CSV",
        "Flash XML"
      ],
      correct_option_index: 1,
      explanation: "Google explicitly recommends JSON-LD for structured data because it separates metadata cleanly from visual HTML markup.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In Google's E-E-A-T quality guidelines, what do the letters stand for?",
      options: [
        "Earnings, Expenses, Assets, and Taxes",
        "Efficiency, Effectiveness, Accessibility, and Technology",
        "Experience, Expertise, Authoritativeness, and Trustworthiness",
        "Email, Engagement, Acquisition, and Traffic"
      ],
      correct_option_index: 2,
      explanation: "E-E-A-T stands for Experience, Expertise, Authoritativeness, and Trustworthiness in Google's Search Quality Evaluator Guidelines.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In search engine crawler architecture, how does Googlebot handle JavaScript-rendered Single Page Applications (SPAs) during 'Two-Wave Indexing'?",
      options: [
        "Googlebot immediately bans all JavaScript websites",
        "In Wave 1, Googlebot indexes raw server HTML; in Wave 2, headless Chromium (WRS) queues and executes client JavaScript to render the DOM, often causing indexing delays of days or weeks",
        "Googlebot executes JavaScript in 0 milliseconds",
        "JavaScript websites are only indexed on mobile phones"
      ],
      correct_option_index: 1,
      explanation: "Two-wave indexing parses raw HTML first and delays JS rendering until rendering resources are available, causing indexing lag.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "When a web page is permanently deleted with zero replacement URL, why is returning an HTTP '410 Gone' status code superior to '404 Not Found' for SEO?",
      options: [
        "410 status codes increase website traffic by 200%",
        "404 status codes crash search engine servers",
        "There is zero difference",
        "410 explicitly confirms intentional permanent removal, prompting search engine crawlers to purge the URL from the index immediately without repeatedly re-crawling"
      ],
      correct_option_index: 3,
      explanation: "410 signals permanent deletion, instructing bots to remove the URL from the index much faster than a standard 404.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What link attribute markup is mandatory according to Google webmaster guidelines when adding paid sponsorship or affiliate links?",
      options: [
        "rel=\"sponsored\" (or rel=\"nofollow\")",
        "rel=\"author\"",
        "rel=\"canonical\"",
        "rel=\"stylesheet\""
      ],
      correct_option_index: 0,
      explanation: "rel=\"sponsored\" (or rel=\"nofollow\") explicitly marks commercial paid links, preventing penalties for unnatural link schemes.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In Google indexing architecture, what does 'Mobile-First Indexing' mean for website rankings?",
      options: [
        "Websites only appear on Apple iPhones",
        "Websites with desktop versions are deleted",
        "Googlebot crawls, evaluates, and indexes content exclusively using its smartphone mobile user-agent; content hidden or missing on mobile is completely ignored for ranking",
        "Desktop computers cannot access search engines"
      ],
      correct_option_index: 2,
      explanation: "Google evaluates indexing and ranking solely based on how the site renders on a mobile smartphone crawler.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In on-page optimization, what is the recommended maximum character length for Title tags to prevent truncation in Google search results?",
      options: [
        "1,000 characters",
        "Under 60 characters (or approximately 600 pixels visual container width)",
        "10 characters",
        "250 characters"
      ],
      correct_option_index: 1,
      explanation: "Title tags exceeding 60 characters (600px width) get truncated with ellipsis (...) in SERPs.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "In the classical PageRank algorithm equation PR(A) = (1 - d) + d * Sum(PR(T_i) / C(T_i)), what does the damping factor 'd' (typically 0.85) represent?",
      options: [
        "The download speed of the webpage in megabytes",
        "The number of images on the page",
        "The discount code for search ads",
        "The probability that a random web surfer will continue clicking links on a page rather than jumping to a completely new random URL (1 - d = 0.15 teleportation probability)"
      ],
      correct_option_index: 3,
      explanation: "The damping factor d = 0.85 models the random surfer continuing down a link trail before jumping to another random page.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Core Web Vitals optimization, what metric replaced First Input Delay (FID) to evaluate overall responsiveness to user interactions throughout the entire page lifecycle?",
      options: [
        "Interaction to Next Paint (INP < 200ms)",
        "Time to First Byte (TTFB)",
        "First Contentful Paint (FCP)",
        "Total Blocking Time (TBT)"
      ],
      correct_option_index: 0,
      explanation: "INP replaced FID as an official Core Web Vital, measuring the latency of all user interactions across the full session lifecycle.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In enterprise technical SEO, what is 'Crawl Budget' and what architectural flaws waste it?",
      options: [
        "The amount of money paid to search engines for crawling",
        "The number of servers owned by Google",
        "The number of URLs Googlebot can and wants to crawl on a domain; wasted by faceted search filter parameter combinations, slow server responses, and internal redirect chains",
        "The monthly internet bill of the company"
      ],
      correct_option_index: 2,
      explanation: "Crawl budget is the crawler resource allocation per domain; faceted filter traps and redirect loops waste bot attention on duplicate pages.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Schema.org JSON-LD markup, what schema type allows publishing step-by-step questions and answers that generate expandable interactive accordions in Google SERPs?",
      options: [
        "Recipe",
        "FAQPage",
        "Event",
        "LocalBusiness"
      ],
      correct_option_index: 1,
      explanation: "FAQPage schema marks up question-answer pairs, allowing Google to display rich interactive dropdown accordions in search listings.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In internal linking strategy, why is passing link equity using 'Contextual Anchor Text' superior to generic 'click here' links?",
      options: [
        "Descriptive keyword-rich anchor text provides semantic context to search engines about the specific topical entity of the target page, reinforcing its keyword relevance and PageRank flow",
        "Generic links cause 500 server errors",
        "Click here links are blocked by firewalls",
        "There is zero impact on search rankings"
      ],
      correct_option_index: 0,
      explanation: "Contextual anchor text describes the destination page's topic, passing valuable semantic relevance and PageRank equity.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #77.");
  console.log("Skill #77 update completed successfully!");
}

run();
