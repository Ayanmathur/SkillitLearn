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

const skillId = "4917aa10-d61c-4548-a657-11f3a179d48c";

async function run() {
  console.log("Updating Skill #71: Ad Budgeting & Bidding Strategy (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Performance Unit Economics, LTV Modeling and MER Frameworks" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Bidding Strategies, Auction Controls and Seasonality Shocks" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Budget Liquidity, Incrementality Testing and Portfolio Governance" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / VP of Performance Marketing & Growth level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Unit Economics Equation: LTV, CAC and Payback Velocity",
      order_index: 1,
      content: `### Growth Unit Economics and Capital Velocity Modeling

1. Core Acquisition and Lifetime Metrics:
   - Paid Customer Acquisition Cost (CAC): Total Paid Ad Spend / New Attributed Customers.
   - Blended CAC: Total Marketing Spend / All New Organic and Paid Customers.
   - Customer Lifetime Value (LTV): LTV = (Average Revenue Per User * Gross Margin %) / Churn Rate.

2. LTV:CAC Ratio Governance:
   - LTV:CAC < 1.0: Severe value destruction and insolvency risk.
   - LTV:CAC = 3.0: Industry benchmark for sustainable enterprise growth.
   - LTV:CAC > 5.0: Under-investing; under-spending ad capital and surrendering market share.

3. CAC Payback Period:
   - Payback Months = CAC / (Monthly Gross Profit per Customer).
   - Target payback velocity: Under 6 to 12 months to maintain positive operating cash flow cycles.`
    },
    {
      track_id: track1Id,
      title: "Marketing Efficiency Ratio (MER) and Contribution Margins",
      order_index: 2,
      content: `### Blended Efficiency and Tiered Contribution Modeling

1. Marketing Efficiency Ratio (MER / Blended ROAS):
   - MER = Total Enterprise Top-Line Revenue / Total Marketing Ad Spend Across All Channels.
   - Decouples growth governance from platform-reported attribution bias.

2. Contribution Margin Hierarchy:
   - Contribution Margin 1 (CM1): Revenue - Cost of Goods Sold (COGS).
   - Contribution Margin 2 (CM2): CM1 - Total Paid Ad Spend (primary metric determining marketing profitability).
   - Contribution Margin 3 (CM3): CM2 - Fulfillment, Shipping, Packaging, and Payment Gateway Fees (net cash contribution).`
    },
    {
      track_id: track1Id,
      title: "Diminishing Marginal Returns and Ad Fatigue Curves",
      order_index: 3,
      content: `### Marginal Economics and Audience Saturation

1. Average vs Marginal ROAS (mROAS):
   - Average ROAS measures aggregate efficiency (e.g. 3.0x on $50,000 spend).
   - Marginal ROAS measures the return on the next incremental dollar (e.g. $10,000 additional spend generating only $8,000 revenue = 0.8x mROAS).
   - Capital allocation rule: Continue scaling budget until Marginal ROAS equals the business break-even threshold.

2. Ad Fatigue and Saturation Indicators:
   - Audience Frequency > 3.5 per week accompanied by dropping First-Time Impression Ratio (FTIR) and escalating CPMs signals creative fatigue, requiring creative refreshes.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Algorithmic Bidding Taxonomy: tCPA, tROAS and Value Bidding",
      order_index: 1,
      content: `### Algorithmic Machine Learning Bidding Topologies

1. Automated Smart Bidding Architectures:
   - Target Cost Per Acquisition (tCPA): Dynamic auction-time bids tailored to individual user conversion probabilities.
   - Target Return on Ad Spend (tROAS): Bids proportionally to predicted transaction order value, prioritizing whales over low-ticket shoppers.

2. Portfolio Bidding Strategies:
   - Combines multiple campaigns under a unified algorithmic bidding model and shared budget pool.
   - Max/Min Bid Limits: Enforcing bid ceilings to prevent algorithms from placing catastrophic $80+ CPC bids during competitive auction spikes.`
    },
    {
      track_id: track2Id,
      title: "Cost Caps, Bid Caps and Lowest Cost in Paid Social Auctions",
      order_index: 2,
      content: `### Paid Social Auction Controls and Bidding Constraints

1. Paid Social Bidding Modes (Meta, TikTok):
   - Lowest Cost (Auto-Bid): Maximizes conversions by spending 100% of the daily budget, accepting fluctuating acquisition costs.
   - Cost Cap: Maximizes conversion volume while ensuring average CPA stays at or below the target cap; automatically throttles ad spend when auctions become unprofitable.
   - Bid Cap (Hard Max Bid): Sets an absolute maximum bid limit per auction impression/conversion, winning only the cheapest auction inventory.

2. Strategic Usage:
   - Cost Caps used for predictable scaling during volatile market conditions; Lowest Cost used for rapid budget deployment and creative discovery.`
    },
    {
      track_id: track2Id,
      title: "Seasonality Adjustments and Promo Spike Bidding",
      order_index: 3,
      content: `### Temporary Demand Shocks and Promotional Spike Governance

1. Seasonality Adjustments:
   - Informs machine learning bidding algorithms (Google/Meta) of anticipated short-term conversion rate spikes (e.g. +75% conversion rate during a 72-hour Black Friday flash sale).
   - Allows algorithms to immediately bid aggressively without waiting for historical statistical confidence to build.

2. Post-Promo Recovery:
   - Automatically expires the seasonality adjustment, returning bidding parameters to baseline models without causing post-promotional hangover underspending.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Budget Liquidity: Campaign Budget Optimization (CBO) vs ABO",
      order_index: 1,
      content: `### Budget Allocation Topologies and Liquidity Optimization

1. Ad Set Budget Optimization (ABO):
   - Manual budget allocation per ad set; ideal for controlled creative sandbox testing where each creative requires guaranteed spend.

2. Campaign Budget Optimization (CBO / Advantage Campaign Budget):
   - Machine learning algorithm dynamically allocates a single campaign-level budget in real time to the highest-performing ad sets.
   - Advantages: Minimizes blended CPA, adapts automatically to shifting audience liquidity, and reduces manual intra-day budget shifting.`
    },
    {
      track_id: track3Id,
      title: "Incrementality Lift Testing, Geo-Experiments and MMM",
      order_index: 2,
      content: `### Causal Measurement, Holdout Testing and Media Mix Modeling

1. The Attribution Over-Reporting Dilemma:
   - Platform click/view attribution models over-credit brand search and retargeting ads that capture users who would have converted organically.

2. Conversion Lift Testing (Incrementality):
   - Splits target audiences into randomized Treatment (served ads) and Control (held out) groups to measure true Incremental Return on Ad Spend (iROAS).

3. Geo-Experiments and Media Mix Modeling (MMM):
   - Geo-matched testing comparing revenue across matched geographic metro areas.
   - Bayesian MMM (Meta Robyn / Google Meridian) using historical top-down econometric regression to isolate true media channel contribution.`
    },
    {
      track_id: track3Id,
      title: "The 70-20-10 Capital Allocation Framework and Stop-Loss Rules",
      order_index: 3,
      content: `### Portfolio Risk Diversification and Automated Kill Rules

1. The 70-20-10 Marketing Capital Allocation Model:
   - 70% Core Scaled Channels: Proven revenue drivers operating stably above target MER (e.g. Google Search, Meta Direct Response).
   - 20% Emerging Validated Channels: Growing channels undergoing scaling (e.g. TikTok Shop, YouTube Video Action).
   - 10% Moonshots: High-risk, experimental channels (e.g. Connected TV, Reddit, Influencer affiliates).

2. Automated Stop-Loss Kill Rules:
   - Automated rule terminating ad sets when spend exceeds 2x to 3x Target CPA with zero conversions over a 72-hour evaluation window, preventing budget bleed.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #71.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In performance marketing economics, what is considered the healthy industry benchmark ratio for Customer Lifetime Value to Customer Acquisition Cost (LTV:CAC)?",
      options: [
        "3.0 to 1 (LTV is 3 times CAC)",
        "0.5 to 1",
        "100 to 1",
        "0 to 1"
      ],
      correct_option_index: 0,
      explanation: "An LTV:CAC ratio of 3:1 represents the golden benchmark for sustainable, profitable enterprise customer acquisition.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What marketing metric calculates total enterprise revenue divided by total paid ad spend across all channels (Total Revenue / Total Ad Spend), evaluating overall blended marketing efficiency?",
      options: [
        "Click-Through Rate (CTR)",
        "Cost Per Click (CPC)",
        "Marketing Efficiency Ratio (MER / Blended ROAS)",
        "Quality Score"
      ],
      correct_option_index: 2,
      explanation: "Marketing Efficiency Ratio (MER) evaluates macro blended business revenue generated per dollar of marketing spend.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In Meta and TikTok ad auctions, what bidding strategy aims to get the maximum number of conversions while maintaining the average CPA at or below a target threshold, automatically reducing spend if auctions become expensive?",
      options: [
        "Lowest Cost without caps",
        "Cost Cap",
        "Manual Impression Bidding",
        "Highest Bid"
      ],
      correct_option_index: 1,
      explanation: "Cost Caps instruct the algorithm to acquire conversions at or below a specific average cost target, throttling spend when expensive.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What budget allocation model in Meta Ads allows a single campaign-level budget to be dynamically distributed across multiple ad sets by machine learning in real time?",
      options: [
        "Ad Set Budget Optimization (ABO)",
        "Manual spreadsheet pacing",
        "Zero budget",
        "Campaign Budget Optimization (CBO / Advantage Campaign Budget)"
      ],
      correct_option_index: 3,
      explanation: "CBO dynamically routes campaign funds to the highest-performing ad sets in real time to maximize overall campaign conversions.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In the 70-20-10 marketing budget allocation framework, what percentage of ad capital is allocated to proven, core scalable channels operating reliably above target MER?",
      options: [
        "70%",
        "10%",
        "100%",
        "0%"
      ],
      correct_option_index: 0,
      explanation: "The 70-20-10 rule allocates 70% of spend to core proven channels, 20% to emerging validated channels, and 10% to experimental moonshots.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "Why is 'Marginal ROAS' (mROAS) a more critical metric than 'Average ROAS' when deciding whether to scale ad budget from $50,000 to $100,000?",
      options: [
        "Marginal ROAS is easier to calculate",
        "Average ROAS is illegal to use",
        "Marginal ROAS only applies to Google Ads",
        "Average ROAS masks diminishing returns; if an incremental $10,000 spend generates only $8,000 in revenue (0.8x mROAS), scaling is unprofitable despite a positive average ROAS"
      ],
      correct_option_index: 3,
      explanation: "Marginal ROAS isolates the profitability of the next incremental dollar spent, revealing auction saturation and diminishing returns.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In financial marketing modeling, how is Contribution Margin 2 (CM2) defined?",
      options: [
        "Revenue minus CEO salary",
        "Revenue minus Cost of Goods Sold (COGS) minus Total Paid Advertising Spend (measuring marketing profit contribution)",
        "Total ad clicks minus conversions",
        "Revenue divided by website pageviews"
      ],
      correct_option_index: 1,
      explanation: "CM2 calculates gross profit minus direct marketing media spend, defining true post-acquisition marketing contribution.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In ad auction bidding controls, what is the key operational difference between a 'Cost Cap' and a 'Bid Cap'?",
      options: [
        "Cost Cap controls average CPA across all conversions, while Bid Cap sets an absolute hard ceiling on the maximum bid entered into any individual auction",
        "Cost Cap only works on Google; Bid Cap only works on TikTok",
        "Bid Cap spends double the budget",
        "There is zero difference"
      ],
      correct_option_index: 0,
      explanation: "Cost Caps target an average cost per conversion, while Bid Caps enforce a strict maximum ceiling on every individual auction bid.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "Why do growth marketing teams run 'Conversion Lift (Incrementality) Tests' with randomized holdout control groups?",
      options: [
        "To spend more money on software",
        "To eliminate all advertising permanently",
        "To measure true causal incremental revenue generated by ads versus baseline sales that would have occurred organically without ad exposure",
        "To increase website loading speeds"
      ],
      correct_option_index: 2,
      explanation: "Incrementality testing holds out a control group to prove whether ads caused new revenue or merely captured existing organic demand.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In smart bidding management, how do 'Seasonality Adjustments' assist algorithmic bidding during short 72-hour holiday flash sales (e.g. Black Friday)?",
      options: [
        "They turn off all ads during holidays",
        "They discount product prices on the website",
        "They delete negative keywords",
        "They inform the algorithm of expected temporary conversion rate increases (e.g. +80%), allowing immediate aggressive bidding without waiting for historical models to adapt"
      ],
      correct_option_index: 3,
      explanation: "Seasonality adjustments prompt bidding algorithms to bid up aggressively during anticipated short-term promotional surges.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In Media Mix Modeling (MMM) using Bayesian regression (e.g. Meta Robyn or Google Meridian), what econometric concepts model diminishing returns and ad memory carryover?",
      options: [
        "HTML5 and CSS3",
        "Adstock Transformation (decay carryover rate) and Hill Saturation Curves (diminishing marginal returns)",
        "Linear extrapolation and subtraction",
        "Random number generation"
      ],
      correct_option_index: 1,
      explanation: "MMM captures temporal ad lag via Adstock functions and non-linear diminishing marginal returns using Hill saturation curves.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In performance risk governance, what automated 'Stop-Loss Kill Rule' prevents runaway budget bleed on underperforming ad sets?",
      options: [
        "Pausing ads whenever it rains",
        "Deleting campaigns every Friday",
        "Automatically pausing ad sets when cumulative ad spend exceeds 2x to 3x Target CPA with zero attributed conversions over a 72-hour window",
        "Raising bids whenever conversions drop"
      ],
      correct_option_index: 2,
      explanation: "A 2x-3x target CPA spend threshold with zero conversions identifies unprofitable ad sets early, stopping waste automatically.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In venture-backed unit economics, why is a CAC Payback Period of under 12 months considered critical for high-growth SaaS and e-commerce companies?",
      options: [
        "It recycles customer acquisition cash back into operating capital within the same fiscal year, enabling self-funding growth loops without infinite equity dilution",
        "It guarantees 100% customer retention",
        "It eliminates all payroll taxes",
        "It allows companies to operate without marketing"
      ],
      correct_option_index: 0,
      explanation: "Fast payback periods replenish cash reserves within the year, allowing capital to be reinvested into growth repeatedly.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In ad creative fatigue diagnostics, what metrics signal that a scaled direct response audience has reached saturation?",
      options: [
        "Website uptime reaches 99.9%",
        "Server CPU usage drops",
        "Average order value increases",
        "Audience Frequency exceeds 3.5 per week, First-Time Impression Ratio (FTIR) drops sharply, and CPMs rise while Conversion Rate decays"
      ],
      correct_option_index: 3,
      explanation: "High frequency, plummeting new impression ratios, and escalating CPMs signify audience fatigue and diminishing returns.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In Google Ads Portfolio Bidding strategies, why is configuring a 'Maximum Bid Limit' (Bid Ceiling) essential when using Target ROAS?",
      options: [
        "Google requires bid limits by law",
        "It prevents the smart bidding algorithm from placing excessively high bids (e.g. $80+ CPCs) during brief competitive auction spikes or anomaly conversion value signals",
        "It reduces the quality score of competitors",
        "It forces ads to show only on desktop computers"
      ],
      correct_option_index: 1,
      explanation: "Bid ceilings cap runaway algorithmic bidding during anomalous auction spikes, preventing expensive single-click charges.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #71.");
  console.log("Skill #71 update completed successfully!");
}

run();
