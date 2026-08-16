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

const skillId = "4e87001c-b769-4564-9b1f-e18c8929c6c9";

async function run() {
  console.log("Updating Skill #84: Online Store Setup (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: E-Commerce Platform Architecture, Domain Infrastructure and Headless Systems" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Catalog Taxonomy, Variant Architecture and Sales Tax Nexus" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: App Ecosystem, Checkout Extensibility and Site Performance" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Principal E-Commerce Architect level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Monolithic vs Headless E-Commerce Platform Architecture",
      order_index: 1,
      content: `### Commerce Platform Topologies and Trade-offs

1. Architectural Paradigms:
   - Monolithic SaaS (Shopify / BigCommerce): Unified backend commerce engine, native database, and server-side templating engine (Liquid). Delivers turnkey PCI-DSS Level 1 compliance and zero infrastructure maintenance.
   - Headless Commerce (Hydrogen / Next.js Storefront API): Decouples custom React/Next.js frontends from backend commerce APIs via GraphQL, enabling sub-second edge routing and custom UX.
   - Self-Hosted Open-Source (WooCommerce / Magento): Full database sovereignty, but demands dedicated server management, database scaling, and manual security patch governance.`
    },
    {
      track_id: track1Id,
      title: "DNS Topologies, Custom Domains and SSL Provisioning",
      order_index: 2,
      content: `### Domain Name Routing and Security Protocols

1. DNS Records for E-Commerce Storefronts:
   - Apex A Record: Points apex domain (\`yourstore.com\`) to the platform edge load balancer (e.g. \`23.227.38.65\` for Shopify).
   - Subdomain CNAME Record: Points \`www.yourstore.com\` to \`shops.myshopify.com\`.

2. Redirection & Certificate Provisioning:
   - Enforcing automatic 301 canonical redirects between apex and www domains to eliminate duplicate content indexing.
   - Automated TLS/SSL certificate issuance via Let's Encrypt with HTTP Strict Transport Security (HSTS) enforcement.`
    },
    {
      track_id: track1Id,
      title: "Multi-Region Localization and International Markets",
      order_index: 3,
      content: `### Cross-Border Commerce and Currency Infrastructure

1. International URL Architecture:
   - Subfolders (\`store.com/fr-fr/\`): Consolidates domain authority while localizing language and currency.
   - ccTLDs (\`store.de\`, \`store.co.uk\`): Maximizes local search engine trust but fragments backlink equity.

2. Dynamic Price Localization:
   - Real-time foreign exchange (FX) conversion with fixed price lists, country-specific duty estimation (Delivered Duty Paid DDP), and local payment method routing (iDEAL in Netherlands, Klarna in Germany).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Product Catalog Architecture and Variant Scaling",
      order_index: 1,
      content: `### Catalog Data Modeling and Taxonomy

1. Structured E-Commerce Hierarchy:
   - Handles, Vendor, Product Type, Standard Product Taxonomy (standardized Google/Shopify categories), and Collections (Automated dynamic collections matching rules vs Manual curated collections).

2. Variant Limits and Combined Listings:
   - Standard 100-variant / 3-option limits (e.g. Size, Color, Material).
   - Enterprise Combined Listings: Parent-child product grouping models enabling distinct dedicated product detail pages (PDPs) for individual colorways while linking them dynamically on the storefront.`
    },
    {
      track_id: track2Id,
      title: "Automated Sales Tax Nexus and Economic Compliance",
      order_index: 2,
      content: `### Regulatory Tax Compliance and Nexus Thresholds

1. Economic Nexus (South Dakota v. Wayfair):
   - Out-of-state remote sellers are legally obligated to collect and remit sales tax once exceeding state thresholds (typically $100,000 in gross annual revenue or 200 separate transactions).

2. Automated Rooftop Tax Calculation:
   - Tax engines (Shopify Tax, Avalara AvaTax) calculating exact destination-based state, county, and municipal tax rates dynamically at checkout based on 9-digit ZIP codes.`
    },
    {
      track_id: track2Id,
      title: "Policy Governance and Regulatory Legal Disclosures",
      order_index: 3,
      content: `### Merchant Legal Infrastructure and Underwriting

1. Mandatory E-Commerce Legal Disclosures:
   - Terms of Service: Governs transactional contracts, warranty disclaimers, and limitation of liability.
   - Privacy Policy: Compliant with GDPR, CCPA, and CPRA data privacy disclosures.
   - Return and Refund Policy: Clear window (e.g. 30 days), condition requirements, and return shipping fee assignments required for payment processor merchant underwriting approval.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "The Modern App Ecosystem and Webhook Security",
      order_index: 1,
      content: `### App Architecture and Cryptographic Verification

1. Theme App Extensions vs ScriptTags:
   - Theme App Extensions inject modular app UI blocks directly into theme JSON templates without modifying or polluting base Liquid source code, allowing clean uninstalls.

2. Webhook Architecture and HMAC Verification:
   - Subscribing to platform event webhooks (\`orders/paid\`, \`customers/create\`).
   - Computing HMAC-SHA256 signatures using the app secret to cryptographically verify payload integrity before processing downstream.`
    },
    {
      track_id: track3Id,
      title: "Checkout Extensibility and Web Pixels API",
      order_index: 2,
      content: `### Modern Sandboxed Checkout Engineering

1. Checkout Extensibility Architecture:
   - Replaces legacy \`checkout.liquid\` with sandboxed React-based UI components (Checkout UI Extensions), enabling post-purchase upsells and custom fields while maintaining strict PCI-DSS Level 1 security.

2. Web Pixels API:
   - Sandboxed pixel execution running within a secure Web Worker, ensuring third-party tracking scripts cannot access customer payment data or block checkout rendering performance.`
    },
    {
      track_id: track3Id,
      title: "Core Web Vitals and E-Commerce Page Speed Optimization",
      order_index: 3,
      content: `### Storefront Performance and Revenue Multipliers

1. Performance Optimization Protocol:
   - Liquid Profiling: Eliminating nested Liquid loops (\`{% for p in collections.all %}\`) that increase Time to First Byte (TTFB).
   - Asset Optimization: Serving modern WebP/AVIF images with explicit \`width\` and \`height\` to achieve Cumulative Layout Shift (CLS < 0.1).
   - Script Governance: Deferring non-critical third-party JavaScript to maintain Largest Contentful Paint (LCP < 2.5s) and Interaction to Next Paint (INP < 200ms).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #84.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "What type of DNS record is used to point the 'www' subdomain of an e-commerce store to an external hosted platform (e.g. shops.myshopify.com)?",
      options: [
        "CNAME Record",
        "TXT Record",
        "MX Record",
        "PTR Record"
      ],
      correct_option_index: 0,
      explanation: "A CNAME (Canonical Name) record aliases a subdomain (like www) to another domain name.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In US e-commerce sales tax law, what supreme court ruling established that states can mandate remote online sellers to collect sales tax based on 'Economic Nexus'?",
      options: [
        "Brown v. Board of Education",
        "Roe v. Wade",
        "South Dakota v. Wayfair (2018)",
        "Marbury v. Madison"
      ],
      correct_option_index: 2,
      explanation: "South Dakota v. Wayfair (2018) ruled that states can require remote online retailers to collect sales tax once economic thresholds are met.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In modern Shopify app architecture, why are 'Theme App Extensions' superior to legacy direct Liquid script injections?",
      options: [
        "They make products cheaper",
        "They inject modular UI blocks cleanly into JSON templates without altering core Liquid files, enabling clean, residue-free uninstalls",
        "They delete unused customer accounts",
        "They are written in Python"
      ],
      correct_option_index: 1,
      explanation: "Theme App Extensions avoid modifying underlying theme code, preventing orphan scripts and theme corruption upon app removal.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What is 'Headless E-Commerce' architecture?",
      options: [
        "An online store that has no CEO",
        "A store that only sells hats",
        "An online store with no products",
        "Decoupling the frontend presentation layer (e.g. Next.js) from the backend commerce engine via APIs"
      ],
      correct_option_index: 3,
      explanation: "Headless commerce separates the frontend presentation layer from the backend commerce engine, connecting via GraphQL/REST APIs.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In e-commerce catalog management, what is an 'Automated (Smart) Collection'?",
      options: [
        "A dynamic collection that automatically groups products matching predefined conditional rules (e.g. tag equals 'winter' AND price > 50)",
        "A collection created by sending physical letters",
        "A collection that charges automatic credit card fees",
        "A collection that cannot be edited"
      ],
      correct_option_index: 0,
      explanation: "Automated collections dynamically query and group products matching specified tag, vendor, or pricing condition rules.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In e-commerce webhook integration, why is computing an HMAC-SHA256 signature verification step mandatory when receiving store event payloads?",
      options: [
        "To speed up internet bandwidth",
        "To compress the JSON payload",
        "To translate data into foreign languages",
        "To cryptographically verify that the webhook payload originated authentically from the platform and was not forged or altered by an attacker"
      ],
      correct_option_index: 3,
      explanation: "HMAC-SHA256 signature verification validates payload authenticity, ensuring only genuine platform events trigger downstream workflows.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In modern Shopify architecture, what technology replaced legacy checkout.liquid to enable custom checkout extensions while maintaining Level 1 PCI-DSS compliance?",
      options: [
        "Adobe Flash",
        "Checkout Extensibility (sandboxed React-based UI components)",
        "WordPress Gutenberg",
        "Apache Cordova"
      ],
      correct_option_index: 1,
      explanation: "Checkout Extensibility replaced checkout.liquid with sandboxed, performant React UI extensions under PCI-DSS compliance.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "When configuring international e-commerce URL structures, why are 'Subfolders' (e.g. store.com/ca/) often preferred over separate 'ccTLDs' (e.g. store.ca)?",
      options: [
        "Subfolders consolidate all international backlink equity and domain authority onto a single primary root domain rather than fragmenting authority across separate domains",
        "ccTLDs are banned in North America",
        "Subfolders cost zero dollars",
        "ccTLDs cannot process credit cards"
      ],
      correct_option_index: 0,
      explanation: "Subfolders concentrate all international SEO authority and PageRank onto one domain, whereas ccTLDs require building authority from scratch.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In e-commerce site performance, what common Liquid templating mistake causes severe backend server response delays (high TTFB)?",
      options: [
        "Using CSS variables",
        "Uploading WebP images",
        "Executing nested Liquid loops over large product collections (e.g. {% for product in collections.all %}) on high-traffic pages",
        "Enabling HTTPS encryption"
      ],
      correct_option_index: 2,
      explanation: "Nested loops across large collections force expensive database iterations on every page render, spiking server response times.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In e-commerce tracking architecture, how does the 'Web Pixels API' improve storefront security and performance compared to legacy script tags?",
      options: [
        "By disabling all analytics",
        "By making all products free",
        "By encrypting customer passwords",
        "By executing tracking pixels inside an isolated Web Worker sandbox, preventing third-party scripts from accessing sensitive payment data or blocking main-thread rendering"
      ],
      correct_option_index: 3,
      explanation: "Web Pixels API runs tracking in isolated Web Workers, isolating sensitive checkout data and keeping the main thread performant.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In cross-border e-commerce checkout operations, what is the critical difference between 'DDP' (Delivered Duty Paid) and 'DDU' (Delivered Duty Unpaid)?",
      options: [
        "DDP only works for digital downloads",
        "Under DDP, the merchant calculates and collects all international customs duties and import taxes at checkout, ensuring frictionless delivery with zero surprise fees on arrival for the customer",
        "DDU is mandatory in the European Union",
        "There is zero difference"
      ],
      correct_option_index: 1,
      explanation: "DDP collects all import duties upfront at checkout, preventing customs delays and surprise fees upon delivery.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In large enterprise catalogs with deep SKU variations, how does a 'Combined Listings' parent-child architecture overcome standard variant limits (100 variants)?",
      options: [
        "By deleting out-of-stock items",
        "By hosting the catalog on a physical hard drive",
        "By creating separate parent products for distinct colorways with dedicated URLs and rich media, while seamlessly linking them as swatches on the frontend product detail page",
        "By converting product variants into blog posts"
      ],
      correct_option_index: 2,
      explanation: "Combined listings link independent child products as swatches, allowing unlimited SKUs and dedicated SEO URLs per colorway.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In payment processor merchant underwriting (e.g. Stripe, Shopify Payments), what specific storefront policy is most strictly scrutinized to prevent chargeback fraud risk?",
      options: [
        "A clear, unambiguous Refund and Return Policy detailing exact timelines, condition requirements, return shipping cost responsibilities, and customer service contact channels",
        "The company mission statement",
        "The employee dress code policy",
        "The founder's biography"
      ],
      correct_option_index: 0,
      explanation: "Payment underwriters require transparent refund and return policies to minimize customer dispute rates and chargebacks.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In storefront DNS architecture, why must a merchant enforce an automated 301 canonical redirect between the apex domain (yourstore.com) and the www domain (www.yourstore.com)?",
      options: [
        "To avoid paying internet domain registration fees",
        "To speed up computer processor clock speed",
        "To change the website font",
        "To prevent search engines from indexing two identical duplicate versions of the website, which splits backlink equity and dilutes SEO rankings"
      ],
      correct_option_index: 3,
      explanation: "Canonical 301 redirection between apex and www variants consolidates all search authority and eliminates duplicate indexing.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In e-commerce Core Web Vitals optimization, what specific implementation prevents layout shifts (CLS < 0.1) when responsive product images load asynchronously?",
      options: [
        "Removing all product images",
        "Setting explicit 'width' and 'height' aspect-ratio attributes or CSS aspect-ratio on all image container elements so browsers reserve visual space before assets render",
        "Compressing images into zip files",
        "Using black and white images only"
      ],
      correct_option_index: 1,
      explanation: "Explicit dimensions allow the browser to reserve the exact layout space required, preventing jarring layout shifts during image loading.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #84.");
  console.log("Skill #84 update completed successfully!");
}

run();
