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

const skillId = "172c9875-584c-48fd-a803-79f61b6fe542";

async function run() {
  console.log("Updating Skill #70: Google Ads Management (9 steps across 3 tracks)...");

  // 1. Fetch tracks for this skill
  let { data: tracks, error: tErr } = await supabase
    .from("tracks")
    .select("id, title, order_index")
    .eq("skill_id", skillId)
    .order("order_index");

  if (tErr) {
    console.error("Error fetching tracks:", tErr);
    return;
  }

  // If there are extra tracks (e.g. 4), delete extra
  if (tracks.length > 3) {
    const extraTrackIds = tracks.slice(3).map((t) => t.id);
    await supabase.from("steps").delete().in("track_id", extraTrackIds);
    await supabase.from("tracks").delete().in("id", extraTrackIds);
    tracks = tracks.slice(0, 3);
  }

  const track1Id = tracks[0].id;
  const track2Id = tracks[1].id;
  const track3Id = tracks[2].id;

  // Update Track titles
  await supabase.from("tracks").update({ title: "Track 1: Auction Mechanics, Quality Score and Search Architecture" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Responsive Search Ads, Performance Max and Feed Management" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Smart Bidding, Value-Based Strategies and Enhanced Conversions" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Google Ads Certified & Growth Director level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Google Ads Auction and Ad Rank Equation",
      order_index: 1,
      content: `### Generalized Second-Price Auctions and Ad Rank Formulations

1. Generalized Second-Price (GSP) Auction:
   - Evaluated dynamically in milliseconds on every user search query.
   - The winning advertiser does not pay their maximum bid; rather, they pay the minimum price necessary to maintain their position above the competitor ranked immediately below them:
     Actual CPC = (Ad Rank of Competitor Below / Your Quality Score) + $0.01.

2. The Ad Rank Formula:
   - Ad Rank = f(Max CPC Bid, Quality Score, Expected Impact of Ad Assets/Extensions, Auction Competitiveness, User Context).
   - A superior Quality Score allows advertisers to achieve higher ad positioning at substantially lower cost-per-click than competitors with larger budgets.`
    },
    {
      track_id: track1Id,
      title: "Quality Score Optimization: eCTR, Relevance and Landing Pages",
      order_index: 2,
      content: `### Quality Score Diagnostic Sub-Components and Economics

1. Quality Score (1 to 10 Diagnostic Metric):
   - Expected Click-Through Rate (eCTR): Historical likelihood that the ad will be clicked when shown for a specific query, normalized for ad position.
   - Ad Relevance: How closely the language in the ad copy aligns with the user search query intent.
   - Landing Page Experience: Measures relevance, transparency, mobile responsiveness, and page loading speed (Core Web Vitals: LCP < 2.5s).

2. Economic Impact of Quality Score:
   - Quality Score 10: Receives up to a 50% discount on baseline Cost-Per-Click.
   - Quality Score 1 to 4: Incurs up to a 400% cost penalty, making un-optimized campaigns financially unviable.`
    },
    {
      track_id: track1Id,
      title: "Keyword Match Types, Negative Sculpting and STAG Topologies",
      order_index: 3,
      content: `### Intent Targeting, Match Types and Query Sculpting

1. Keyword Match Types:
   - Exact Match [running shoes]: Triggers for queries with identical meaning and close semantic variants.
   - Phrase Match \"running shoes\": Triggers for queries that include the core meaning of the phrase.
   - Broad Match running shoes: Uses Google AI contextual signals to match relevant search queries without requiring explicit keyword strings.

2. Negative Keyword Sculpting:
   - Multi-tiered shared negative lists preventing wasted spend on non-transactional queries (e.g. \"free\", \"jobs\", \"salary\", \"login\", \"pdf\").

3. Single-Theme Ad Groups (STAGs):
   - Organizing ad groups around tightly focused semantic themes (3 to 5 closely related keywords per ad group) to maximize ad copy relevance and Quality Scores.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Responsive Search Ads (RSAs) and Asset Optimization",
      order_index: 1,
      content: `### Machine Learning Creative Generation and Ad Assets

1. Responsive Search Ads (RSAs):
   - Advertisers provide up to 15 Headlines (30 characters max) and 4 Descriptions (90 characters max).
   - Google machine learning dynamically evaluates thousands of combinations, selecting the highest-performing 3-headline, 2-description layout based on real-time user signals.

2. Asset Pinning Strategy:
   - Pinning headlines to Position 1, 2, or 3 restricts algorithmic permutation testing. Pinning should be reserved strictly for legally mandated compliance text or strict brand protection.

3. Ad Assets (Extensions):
   - Sitelinks, Callouts, Structured Snippets, Image Assets, and Lead Forms expand physical screen real estate, boosting Click-Through Rates by 10% to 15%.`
    },
    {
      track_id: track2Id,
      title: "Performance Max (PMax) Campaigns and Audience Signals",
      order_index: 2,
      content: `### Cross-Channel Automated Campaigns and First-Party Signals

1. Performance Max (PMax) Architecture:
   - Goal-based automated campaign serving inventory across all Google channels: Search, YouTube, Display, Discover, Gmail, and Google Maps from a single campaign.

2. Asset Groups:
   - Bundles high-resolution marketing images (landscape, square, portrait), video assets, headlines, long headlines (90 chars), and logos.

3. Audience Signals:
   - Guides the machine learning algorithm during initial ramp-up using high-intent data: First-party Customer Match email lists, Website Visitors, and Custom Intent Search Segments (competitor brand search terms).

4. URL Expansion:
   - Automatically swaps landing pages to relevant website URLs; non-commercial pages (careers, privacy policy) must be added to Final URL Exclusions.`
    },
    {
      track_id: track2Id,
      title: "Google Merchant Center (GMC) and Shopping Feed Optimization",
      order_index: 3,
      content: `### E-Commerce Shopping Feeds and Product Segmentation

1. Google Merchant Center Feed Specifications:
   - Required attributes: \`id\`, \`title\`, \`description\`, \`link\`, \`image_link\`, \`price\`, \`availability\`, \`brand\`, \`gtin\` (Global Trade Item Number), and \`google_product_category\`.
   - Title Optimization Formula: Brand + Product Type + Gender/Age + Key Defining Attributes (Color, Size, Material).

2. Custom Labels (\`custom_label_0\` to \`4\`):
   - Segments product catalogs by business profitability metrics (e.g. High Margin >50%, Medium Margin, Clearance, Top Sellers) to allocate differential Target ROAS bidding targets across product tiers.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Smart Bidding Strategies: tCPA, tROAS and Maximize Conversions",
      order_index: 1,
      content: `### Algorithmic Auction-Time Bidding and Value-Based Optimization

1. Smart Bidding Algorithms:
   - Maximize Conversions: Bids to capture the maximum volume of conversion actions within the daily budget.
   - Target Cost Per Acquisition (tCPA): Sets real-time bids at query auction time based on contextual signals (device, geography, time of day, browser) to achieve average target acquisition cost.
   - Target Return on Ad Spend (tROAS): Prioritizes high-value transactions, bidding aggressively on users predicted to generate high revenue.

2. Learning Phase Governance:
   - Smart Bidding requires 30 to 50 conversion events over a 30-day window to build statistical confidence; modifying targets by >20% resets the algorithm into the Learning Phase.`
    },
    {
      track_id: track3Id,
      title: "Conversion Tracking, GTM and Enhanced Conversions",
      order_index: 2,
      content: `### Privacy-Preserving First-Party Measurement Infrastructure

1. Google Tag Manager (GTM) Conversion Setup:
   - Configures Google Ads Conversion Tracking tags triggered on purchase confirmation events via custom dataLayer triggers.

2. Enhanced Conversions for Web:
   - Captures first-party customer data (SHA-256 hashed email, phone number, address) on checkout forms and transmits it securely to Google during conversion firing.
   - Recovers 5% to 15% of lost conversions caused by browser third-party cookie blocking (Apple Safari ITP and iOS App Tracking Transparency).`
    },
    {
      track_id: track3Id,
      title: "Campaign Diagnostics, Impression Share and Budget Scaling",
      order_index: 3,
      content: `### Scaling Performance and Competitive Metrics

1. Impression Share (IS) Diagnostics:
   - Search Impression Share = Impressions Received / Total Eligible Impressions.
   - Search Lost IS (Budget): Percentage of eligible impressions lost due to insufficient daily budget. Solution: Increase budget or refine targeting.
   - Search Lost IS (Rank): Percentage of eligible impressions lost due to low Ad Rank. Solution: Improve Quality Score or raise target CPA/ROAS bids.

2. Controlled Budget Scaling Protocol:
   - Scale daily budgets by no more than 15% to 20% every 3 to 5 days to avoid destabilizing Smart Bidding algorithmic models.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #70.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In the Google Ads auction, how is the Actual Cost-Per-Click (CPC) calculated in a Generalized Second-Price (GSP) auction?",
      options: [
        "You always pay your maximum bid amount",
        "You pay a flat $1.00 per click",
        "Actual CPC = (Ad Rank of Competitor Below / Your Quality Score) + $0.01",
        "You pay based on the time of day"
      ],
      correct_option_index: 2,
      explanation: "In Google's second-price auction, you pay the minimum amount required to surpass the Ad Rank of the competitor immediately below you.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What are the three core sub-components evaluated by Google to compute an ad's Quality Score (scale 1 to 10)?",
      options: [
        "Expected Click-Through Rate (eCTR), Ad Relevance, and Landing Page Experience",
        "Company revenue, CEO name, and office location",
        "Number of employees, daily budget, and credit card limit",
        "Font color, image resolution, and website domain age"
      ],
      correct_option_index: 0,
      explanation: "Quality Score is determined strictly by Expected CTR, Ad Relevance to the search query, and Landing Page Experience.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What keyword match type syntax represents 'Exact Match' in Google Ads search campaigns?",
      options: [
        "\"keyword\" (with quotes)",
        "+keyword (with plus signs)",
        "keyword (without punctuation)",
        "[keyword] (with brackets)"
      ],
      correct_option_index: 3,
      explanation: "Brackets [keyword] designate Exact Match in Google Ads, matching queries with identical intent and close semantic variants.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What cross-channel campaign type in Google Ads uses machine learning to serve ads across Search, YouTube, Display, Discover, Gmail, and Maps from a single asset group?",
      options: [
        "Standard Shopping",
        "Performance Max (PMax)",
        "Search Only campaign",
        "Call-Only campaign"
      ],
      correct_option_index: 1,
      explanation: "Performance Max (PMax) is an automated goal-based campaign type that serves across Google's entire advertising inventory.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What first-party tracking feature securely hashes customer data (SHA-256 email, phone) on checkout forms to recover conversions lost to third-party cookie blocking?",
      options: [
        "Google Analytics 4",
        "Flash Cookies",
        "Enhanced Conversions",
        "UTM parameters"
      ],
      correct_option_index: 2,
      explanation: "Enhanced Conversions uses hashed first-party user data to match conversions accurately despite cookie limitations.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In Google Ads campaign diagnostics, what is the meaning of 'Search Lost Impression Share (Budget)'?",
      options: [
        "The advertiser was banned from Google",
        "The percentage of eligible search impressions that the ad failed to show for due to daily budget exhaustion",
        "The campaign has an invalid credit card",
        "The ad was clicked by competitors"
      ],
      correct_option_index: 1,
      explanation: "Search Lost IS (Budget) measures the proportion of auctions missed because the campaign's daily spend cap was reached.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Responsive Search Ads (RSAs), why is 'Asset Pinning' (e.g. pinning a headline to Position 1) discouraged unless legally required?",
      options: [
        "Pinning deletes the ad copy",
        "Google bans accounts that use pinning",
        "Pinning costs double the normal CPC",
        "Pinning restricts Google's machine learning engine from dynamically testing thousands of headline/description permutations to find the highest-converting combination"
      ],
      correct_option_index: 3,
      explanation: "Excessive pinning limits the algorithm's combinatorial testing freedom, degrading ad relevance and expected CTR.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In E-Commerce Google Shopping feeds, what is the recommended best-practice structure for product 'Title' optimization?",
      options: [
        "Brand + Product Type + Key Defining Attributes (such as Gender, Color, Size, Material, Model)",
        "Just the product SKU number",
        "A 500-word paragraph of marketing buzzwords",
        "The website homepage URL"
      ],
      correct_option_index: 0,
      explanation: "Front-loading titles with Brand, Product Category, and defining attributes maximizes query matching in Google Shopping auctions.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What Smart Bidding strategy in Google Ads automatically adjusts bids in real time to maximize total revenue value rather than raw conversion count?",
      options: [
        "Manual CPC",
        "Maximize Clicks",
        "Target ROAS (or Maximize Conversion Value)",
        "Target Impression Share"
      ],
      correct_option_index: 2,
      explanation: "Target ROAS and Maximize Conversion Value bid dynamically to capture high-value transaction orders over low-value conversions.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "When scaling daily ad spend on a successful Google Ads campaign utilizing Smart Bidding, what is the maximum recommended budget increase percentage per adjustment?",
      options: [
        "500% increase per day",
        "15% to 20% increase every 3 to 5 days (to prevent resetting the Smart Bidding algorithmic Learning Phase)",
        "100% increase every hour",
        "Zero budget changes are ever allowed"
      ],
      correct_option_index: 1,
      explanation: "Increasing budget by more than 20% destabilizes auction bidding models, throwing the campaign back into the unpredictable Learning Phase.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "In Google Ads economic modeling, how does an advertiser with a Quality Score of 10 and a $2.00 Max Bid compete against an advertiser with a Quality Score of 4 and a $4.00 Max Bid?",
      options: [
        "The advertiser with $4.00 always wins",
        "The ads are shown side by side",
        "The auction results in a tie",
        "The $2.00 bidder achieves an Ad Rank of 20 (2.00 x 10), beating the $4.00 bidder's Ad Rank of 16 (4.00 x 4), winning top position at a lower actual cost per click"
      ],
      correct_option_index: 3,
      explanation: "Ad Rank is bid x Quality Score; a QS of 10 achieves Ad Rank 20, outranking a $4 bid with QS 4 (Ad Rank 16) at lower cost.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Google Merchant Center feed architecture, how do 'Custom Labels' (custom_label_0 to custom_label_4) enable profit-driven shopping campaigns?",
      options: [
        "They segment products by business margins (e.g. High Margin >50% vs Low Margin), allowing advertisers to apply higher Target ROAS goals to low-margin items and lower ROAS goals to high-margin growth items",
        "They translate product descriptions into Spanish",
        "They delete out-of-stock items",
        "They automatically lower product prices on the website"
      ],
      correct_option_index: 0,
      explanation: "Custom labels allow segmentation by business attributes like gross margin, enabling value-aligned bidding strategies.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In search campaign architecture, what is 'Negative Keyword Sculpting' between overlapping ad groups?",
      options: [
        "Deleting all negative keywords",
        "Bidding on competitor names",
        "Adding exact-match keywords from higher-intent ad groups as negative keywords in broader ad groups to prevent broad match cannibalization and ensure queries route to the most specific ad copy",
        "Blocking all search traffic from mobile phones"
      ],
      correct_option_index: 2,
      explanation: "Negative sculpting prevents broader match ad groups from stealing queries intended for higher-specificity ad groups.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Performance Max (PMax) campaign governance, what is the role of 'Audience Signals'?",
      options: [
        "They restrict ads to show ONLY to users inside those lists (hard exclusion)",
        "They provide directional machine learning hints (Customer Match lists, website visitors, search intent) to guide the AI's exploration algorithms during early training without strictly limiting targeting",
        "They send email newsletters to audiences",
        "They track employee website visits"
      ],
      correct_option_index: 1,
      explanation: "Audience signals in PMax are guidance hints for machine learning targeting, rather than strict targeting boundaries.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In Google Ads conversion architecture, why does measuring View-Through Conversions (VTC) alongside Click-Through Conversions provide vital attribution context for Display and YouTube campaigns?",
      options: [
        "It measures conversions from users who viewed an ad impression without clicking it, but subsequently completed a purchase on the website within a specified attribution window",
        "It counts video views on TikTok",
        "It measures how many people looked at the website logo",
        "It proves that Google Ads never works"
      ],
      correct_option_index: 0,
      explanation: "View-Through Conversions attribute users who saw an un-clicked visual ad impression and later converted via direct or search navigation.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #70.");
  console.log("Skill #70 update completed successfully!");
}

run();
