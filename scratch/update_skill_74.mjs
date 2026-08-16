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

const skillId = "76296daa-aad9-4de8-9991-debf513a3558";

async function run() {
  console.log("Updating Skill #74: Meta Ads Management (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Meta Auction Mechanics, Total Value Formula and Targeting Topologies" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Conversions API (CAPI), Deduplication and Tracking Architecture" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Campaign Architecture, Advantage+ and Creative Scaling" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Meta Certified Media Buying & VP Paid Social level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Total Value Equation and Auction Mechanics",
      order_index: 1,
      content: `### Meta Auction Theory and Machine Learning Delivery

1. The Total Value Equation:
   - Evaluated in real time for every individual user ad impression across all surfaces:
     Total Value = Bid * Estimated Action Rate (eAR) + User Value.
   - Sub-Components:
     - Bid: The monetary bid entered by the advertiser (or dynamically calculated in auto-bid).
     - Estimated Action Rate (eAR): Machine learning probability that a given user will complete the conversion event.
     - User Value: Composite score measuring ad creative quality, video watch duration, post-click landing page bounce rates, and user feedback (hiding/reporting ads).

2. Vickrey-Clarke-Groves (VCG) Auction:
   - Meta charges winning advertisers based on the value lost by other competitors displaced by the winning ad, incentivizing truthful bidding and preventing auction gaming.`
    },
    {
      track_id: track1Id,
      title: "Post-iOS 14.5 Targeting: Broad Targeting vs Lookalike Topologies",
      order_index: 2,
      content: `### Modern Machine Learning Targeting Paradigms

1. The Shift to Broad Targeting:
   - Post-iOS 14.5 ATT tracking restrictions rendered narrow, interest-based hyper-targeting inefficient due to severe CPM inflation and auction fragmentation.
   - Broad Targeting (Open Age, Gender, and Location with zero interest restrictions): Leverages Meta Lattice AI to treat the ad creative itself as the targeting filter, locating in-market buyers across massive audiences (>50M users) at the lowest possible CPMs.

2. Lookalike Audiences (LALs):
   - 1% to 5% Lookalikes generated from high-value first-party seed data (Top 10% LTV Customers, Repeat Purchasers) used as secondary scaling layers to validate initial algorithmic delivery.`
    },
    {
      track_id: track1Id,
      title: "Audience Overlap, Auction Cannibalization and Consolidation",
      order_index: 3,
      content: `### Account Simplification and Liquidity Maximization

1. Auction Overlap and Internal Cannibalization:
   - Running multiple ad sets competing for identical audience segments causes an advertiser to bid against themselves in internal auctions, artificially driving up CPMs.

2. Account Consolidation:
   - Merging fragmented ad sets into 1 to 3 consolidated ad sets provides the Meta machine learning engine with the necessary conversion density (at least 50 optimization events per ad set per week) required to exit the volatile Learning Phase into Active status.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Meta Conversions API (CAPI) and Server-Side Architecture",
      order_index: 1,
      content: `### Server-to-Server Attribution and Privacy Infrastructure

1. Client-Side Pixel Limitations:
   - Browser ad blockers, Apple Safari Intelligent Tracking Prevention (ITP), and iOS privacy controls block up to 30% of standard client-side browser pixel events.

2. Conversions API (CAPI) Architecture:
   - Direct server-to-server connection transmitting conversion payloads directly from cloud servers (Server-Side GTM on AWS/GCP, Node.js webhooks, or Shopify backend) to Meta's Graph API endpoints.
   - Bypasses browser-level blocking, ensures 100% telemetry capture, and establishes permanent first-party data ownership.`
    },
    {
      track_id: track2Id,
      title: "Event Deduplication and Advanced Matching Parameters",
      order_index: 2,
      content: `### Data Integrity and Customer Match Quality

1. Dual-Tracking and Event Deduplication:
   - Firing events simultaneously from both Browser Pixel and Server CAPI for zero latency and redundancy.
   - Passing identical unique \`event_id\` (e.g. order UUID) and \`event_name\` (\`Purchase\`) parameters from both channels; Meta automatically deduplicates redundant records within a 48-hour window.

2. Advanced Matching Parameters:
   - Transmitting SHA-256 securely hashed customer PII (\`em\` email, \`ph\` phone, \`fn\` first name, \`ln\` last name, \`ct\` city, \`zp\` zip, \`external_id\`) to achieve Event Match Quality (EMQ) scores above 8.0/10, maximizing attribution accuracy.`
    },
    {
      track_id: track2Id,
      title: "Aggregated Event Measurement (AEM) and Offline Conversions",
      order_index: 3,
      content: `### Downstream Revenue Optimization and Closed-Loop Attribution

1. Offline Conversions Tracking:
   - Securely uploading point-of-sale (POS) store transaction logs and B2B CRM sales pipeline records (e.g. Lead -> Sales Qualified Lead -> Closed-Won Deal).
   - Optimizes Meta machine learning algorithms toward high-margin downstream cash collection rather than low-quality superficial form fills.

2. Aggregated Event Measurement (AEM) Protocol:
   - Configures prioritization of standard conversion events (Purchase, InitiateCheckout, AddToCart, Lead) to preserve campaign optimization under Apple's SKAdNetwork framework restrictions.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Advantage+ Shopping Campaigns (ASC+) vs Manual CBO",
      order_index: 1,
      content: `### AI-Native Campaign Delivery and Scaling

1. Advantage+ Shopping Campaigns (ASC+):
   - Fully automated AI-driven campaign architecture that optimizes budget allocation, audience expansion, placement selection, and creative delivery across all surfaces (Feed, Stories, Reels, Audience Network) simultaneously.

2. Existing Customer Budget Cap:
   - Configuring explicit budget caps (e.g. maximum 10% to 15%) on existing customer retention spend inside ASC+, forcing the algorithm to allocate 85%+ of capital to net-new customer acquisition.`
    },
    {
      track_id: track3Id,
      title: "Dynamic Creative 3:2:2 Framework and Social Proof Retention",
      order_index: 2,
      content: `### Creative Sandbox Testing and Post ID Stacking

1. The 3:2:2 Dynamic Creative Testing Method:
   - Deploying 3 creative visuals (e.g. UGC Video, Product Demo, Static Graphic), 2 primary text copies, and 2 headlines inside a Dynamic Creative Ad (DCO) to rapidly identify winning combinations.

2. Post ID Social Proof Stacking:
   - Extracting the universal Post ID (\`fb_post_id\`) of the validated winning creative permutation and deploying it into scaling campaigns.
   - Retains all accumulated social proof (likes, comments, shares), lowering social friction and boosting conversion rates.`
    },
    {
      track_id: track3Id,
      title: "Horizontal vs Vertical Scaling and Creative Fatigue",
      order_index: 3,
      content: `### Performance Scaling Governance and Creative Refreshing

1. Scaling Frameworks:
   - Vertical Scaling: Increasing daily budget on winning CBO/ASC+ campaigns by 15% to 20% every 48 to 72 hours.
   - Horizontal Scaling: Deploying brand-new creative angles, formats, and consumer personas to unlock new audience segments without causing audience saturation.

2. Creative Fatigue Diagnostics:
   - Monitoring rising Cost Per Unique Outbound Click, dropping CTR (Link Click), and frequency spikes (>3.5) to trigger creative pipeline refreshes before CPA escalates.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #74.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In the Meta Ad Auction, what is the 'Total Value' formula used to determine which ad wins the impression?",
      options: [
        "Total Value = Bid * Estimated Action Rate (eAR) + User Value",
        "Total Value = Daily Budget / Number of Likes",
        "Total Value = Account Age * Number of Campaigns",
        "Total Value = Ad Headline Length * Image Width"
      ],
      correct_option_index: 0,
      explanation: "Meta's auction algorithm calculates Total Value by combining the advertiser's bid, the machine learning estimated action rate, and user ad quality score.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What targeting methodology in Meta Ads uses open demographics (Age, Gender, Location) with zero detailed interest filters, letting the ad creative itself act as the targeting filter?",
      options: [
        "Narrow Retargeting",
        "Keyword Bidding",
        "Broad Targeting",
        "Manual Placement Selection"
      ],
      correct_option_index: 2,
      explanation: "Broad targeting removes interest constraints, allowing Meta Lattice AI to identify buyers across wide audiences at the lowest CPMs.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What server-side tracking technology in Meta sends conversion data directly from a cloud server to Meta's Graph API, bypassing browser ad blockers and Safari ITP?",
      options: [
        "Flash Cookies",
        "Meta Conversions API (CAPI)",
        "UTM Builder",
        "Facebook Pixel only"
      ],
      correct_option_index: 1,
      explanation: "Conversions API (CAPI) creates a direct server-to-server data pipeline that is impervious to browser-level ad blockers.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "How many optimization conversion events per ad set per week does Meta recommend to successfully exit the volatile 'Learning Phase'?",
      options: [
        "1 conversion event",
        "10,000 conversion events",
        "Zero conversion events",
        "Approximately 50 conversion events"
      ],
      correct_option_index: 3,
      explanation: "Meta's delivery system requires roughly 50 conversion events in a 7-day window to calibrate delivery and exit the learning phase.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In the 3:2:2 Dynamic Creative Testing framework on Meta, what do the numbers represent?",
      options: [
        "3 Creative Visuals, 2 Primary Text Copies, and 2 Headlines",
        "3 Campaigns, 2 Ad Sets, and 2 Pixels",
        "3 Clicks, 2 Impressions, and 2 Sales",
        "3 Days, 2 Hours, and 2 Minutes"
      ],
      correct_option_index: 0,
      explanation: "The 3:2:2 method tests 3 visual creatives, 2 primary texts, and 2 headlines inside a dynamic creative ad set.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In Meta event tracking architecture, how does 'Event Deduplication' function when using both the Browser Pixel and Server CAPI?",
      options: [
        "It deletes all conversion records",
        "It doubles the reported revenue",
        "It charges advertisers twice",
        "Meta checks the identical unique 'event_id' and 'event_name' sent from both sources and automatically deduplicates them, retaining a single verified conversion"
      ],
      correct_option_index: 3,
      explanation: "Passing identical event_id and event_name parameters from browser and server allows Meta to merge redundant signals seamlessly.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Advantage+ Shopping Campaigns (ASC+), what is the purpose of configuring an 'Existing Customer Budget Cap'?",
      options: [
        "To ban existing customers from visiting the website",
        "To limit the proportion of ad spend allocated to retargeting existing buyers (e.g. max 10%), ensuring the AI focuses heavily on acquiring net-new customers",
        "To offer discounts only to employees",
        "To turn off email marketing"
      ],
      correct_option_index: 1,
      explanation: "The existing customer budget cap forces ASC+ campaigns to deploy the majority of media budget into net-new customer acquisition.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In Meta ad creative management, what is the benefit of 'Post ID Social Proof Stacking'?",
      options: [
        "Using the universal Post ID (fb_post_id) in scaling campaigns preserves all accumulated likes, comments, and shares across all placements, lowering customer skepticism",
        "It lowers Facebook's stock price",
        "It changes video aspect ratios to 4:3",
        "It hides comments from users"
      ],
      correct_option_index: 0,
      explanation: "Deploying the exact Post ID across campaigns carries over accumulated social proof (likes and comments), improving conversion trust.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In account architecture governance, why is running 20 fragmented ad sets targeting overlapping audiences harmful to ad account performance?",
      options: [
        "Meta limits accounts to 5 ad sets total",
        "It deletes pixel history",
        "It causes 'Auction Overlap', where the advertiser bids against their own ad sets in internal sub-auctions, driving up CPMs and fragmenting conversion learning",
        "It makes landing pages load slower"
      ],
      correct_option_index: 2,
      explanation: "Internal audience overlap forces self-competition in auctions, inflating CPMs and preventing ad sets from reaching the 50 conversions needed to exit learning.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In performance creative diagnostics, what combination of metrics signals that an active scaling ad creative is experiencing 'Creative Fatigue'?",
      options: [
        "Website uptime reaches 100%",
        "Server CPU usage drops",
        "Customer lifetime value increases",
        "Audience Frequency rises above 3.5, Cost Per Unique Outbound Click increases, and CTR (Link Click) drops significantly while CPA escalates"
      ],
      correct_option_index: 3,
      explanation: "Escalating frequency accompanied by declining CTR and rising click costs indicates audience exhaustion and creative fatigue.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In Meta Conversions API (CAPI) optimization, what is 'Advanced Matching' and what data formatting is required?",
      options: [
        "Matching font styles on images",
        "Transmitting customer PII (email, phone, name, city, zip) securely hashed using SHA-256 to raise Event Match Quality (EMQ) scores above 8.0/10 for maximum attribution matching",
        "Translating ads into 10 languages",
        "Matching credit card CVV codes"
      ],
      correct_option_index: 1,
      explanation: "Advanced Matching passes SHA-256 hashed customer identifiers with conversion events, dramatically improving match rates with user profiles.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In the Meta Ad Auction Total Value equation, how does a high 'User Value' score economically benefit an advertiser?",
      options: [
        "It gives the advertiser free ad credits",
        "It allows ads to run without video",
        "It boosts the Total Value score, allowing the advertiser to win high-quality impressions at a lower monetary bid than competitors with poor user experience and high bounce rates",
        "It removes all competition from the auction"
      ],
      correct_option_index: 2,
      explanation: "High user value (great relevance, high watch time, low bounce rate) subsidizes monetary bids, letting great ads win auctions for less spend.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In performance scaling methodology, what is the strategic difference between 'Vertical Scaling' and 'Horizontal Scaling' on Meta Ads?",
      options: [
        "Vertical Scaling increases budget on existing winning campaigns by 15-20% every 48-72 hours; Horizontal Scaling deploys new creative angles, formats, and consumer personas to unlock new market segments",
        "Vertical scaling is for mobile; Horizontal scaling is for desktop",
        "Horizontal scaling only works in winter",
        "Vertical scaling is illegal under GDPR"
      ],
      correct_option_index: 0,
      explanation: "Vertical scaling increases capital on existing winners; horizontal scaling creates new angles and creatives to expand addressable audience reach.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In B2B lead generation and high-ticket sales on Meta, why is integrating 'Offline Conversions' via CRM (e.g. Salesforce or HubSpot) essential?",
      options: [
        "To delete spam form submissions",
        "To send automatic text messages to leads",
        "To turn off ads on weekends",
        "To feed qualified sales pipeline stages (e.g. Sales Qualified Lead, Deal Closed-Won) back into Meta's algorithm, training AI to optimize for revenue rather than cheap unqualified lead clicks"
      ],
      correct_option_index: 3,
      explanation: "Feeding downstream closed revenue back to Meta trains the bidding models to optimize for high-value paying customers rather than form spammers.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In Meta auction theory, what auction model determines the final price paid by winning advertisers based on the opportunity cost imposed on displaced competitors?",
      options: [
        "First-Price Auction",
        "Vickrey-Clarke-Groves (VCG) Auction",
        "Dutch Auction",
        "English Reverse Auction"
      ],
      correct_option_index: 1,
      explanation: "Meta utilizes a VCG auction mechanism where winning advertisers pay for the social cost/harm imposed on other advertisers.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #74.");
  console.log("Skill #74 update completed successfully!");
}

run();
