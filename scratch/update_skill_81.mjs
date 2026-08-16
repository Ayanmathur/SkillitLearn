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

const skillId = "9660204c-b8e1-464a-a21d-58cfb93cb19e";

async function run() {
  console.log("Updating Skill #81: Marketing Reporting & Dashboards (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Marketing Data Warehousing, Modeling and Reconciliation" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Executive Dashboard Design, BI Modeling and Visual Metrics" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Automated Telemetry, Alerting Systems and Anomaly Detection" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / VP of Marketing Operations & BI level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Modern Marketing Data Stack (MMDS) and Ingestion",
      order_index: 1,
      content: `### Marketing Data Warehousing and API Pipelines

1. The Data Silo Fragmentation Dilemma:
   - Ad platforms (Google, Meta, TikTok), CRM tools (HubSpot, Salesforce), and billing engines (Stripe, Shopify) isolate data with disparate schemas and conflicting attribution windows.

2. Modern Ingestion Architecture:
   - Automated ELT pipelines (Fivetran, Airbyte) querying platform APIs daily to load raw performance tables into cloud data warehouses (Snowflake, Google BigQuery).
   - Centralizes media spend, impressions, clicks, and transactional revenue into an immutable, unified raw data lake.`
    },
    {
      track_id: track1Id,
      title: "Dimensional Modeling for Omnichannel Marketing Analytics",
      order_index: 2,
      content: `### Star Schema Modeling and dbt Transformations

1. The Marketing Star Schema:
   - Fact Table: \`fact_marketing_performance\` (Grain: \`date_id\` + \`campaign_id\` + \`ad_id\` + \`channel_id\`), storing daily spend, impressions, clicks, and platform conversions.
   - Dimension Tables: \`dim_campaign\`, \`dim_ad\`, \`dim_channel\`, \`dim_date\`.

2. dbt Normalization Workflows:
   - Harmonizing multi-currency expenditures to base USD using daily FX exchange rates.
   - Converting local platform timestamps to UTC.
   - Parsing standard UTM parameters (\`utm_source\`, \`utm_medium\`, \`utm_campaign\`, \`utm_content\`) to establish consistent cross-channel reporting.`
    },
    {
      track_id: track1Id,
      title: "Revenue Reconciliation: Platform Attribution vs ERP Cash",
      order_index: 3,
      content: `### Discrepancy Auditing and Single Source of Truth

1. Platform Over-Reporting Bias:
   - When Meta reports $40k revenue, Google reports $30k, and TikTok reports $20k, but the payment gateway (Stripe/Shopify) collected only $60k total gross revenue, platforms over-reported by 50% due to overlapping attribution windows.

2. Financial Reconciliation Rules:
   - Enforcing backend ERP/payment gateway cash transactions as the immutable Single Source of Truth for top-line revenue, calculating blended Marketing Efficiency Ratio (MER) rather than sum-of-platforms ROAS.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The Three-Tier Marketing Reporting Architecture",
      order_index: 1,
      content: `### Stakeholder Dashboard Tiering

1. Tier 1: C-Suite Executive Summary (Single-Screen View):
   - High-level business metrics: Blended MER (Total Revenue / Total Ad Spend), Blended CAC, Total Marketing Spend, Net New Revenue, and Contribution Margin 2 (CM2).

2. Tier 2: Channel Performance Deep-Dive:
   - Channel-specific ROAS, Cost Per Acquisition (CPA) trends, Search Lost Impression Share, and Conversion Rates by channel.

3. Tier 3: Creative Asset Performance Matrix:
   - Video Thumb-Stop Rates, 100% Video Completion Rates, and Creative Fatigue indicators ranked by spend and revenue volume.`
    },
    {
      track_id: track2Id,
      title: "BI Calculations: MoM, YoY, Pacing and Rolling Metrics",
      order_index: 2,
      content: `### Analytical Formulations in Power BI DAX and Tableau

1. Core Analytical Measures:
   - Month-over-Month (MoM) Growth:
     MoM Growth = (Current Month Revenue - Prior Month Revenue) / Prior Month Revenue.
   - Rolling 7-Day Moving Average CPA:
     Smooths volatile weekend/weekday performance spikes to reveal true trend trajectories.

2. Budget Pacing Formulations:
   - Pacing % = (Cumulative Spend to Date) / (Monthly Budget Target * (Current Day of Month / Total Days in Month)).
   - Values > 105% signal overspending; values < 95% signal underspending.`
    },
    {
      track_id: track2Id,
      title: "Interactive Filtering, Cross-Channel Blending and Cohorts",
      order_index: 3,
      content: `### Visual Dashboard UX and Cohort Heatmaps

1. Interactive Dashboard Topologies:
   - Universal Date Slicers, Channel Dropdowns, and Cross-Filtering between visual tiles in Looker Studio and Power BI.

2. Customer LTV Cohort Retention Heatmaps:
   - Formatting monthly customer acquisition cohorts into triangular heatmaps to track cumulative gross margin and retention decay curves across 12 to 24 months.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Automated Stakeholder Reporting Cadences",
      order_index: 1,
      content: `### Automated Operations and Multi-Channel Reporting

1. Operational Reporting Cadences:
   - Daily Flash Slack Alerts (via Python Webhook / Zapier): Summarizing yesterday's total spend, revenue, MER, and top converting campaigns for operational media buyers.
   - Weekly Executive Digest: 5-slide visual performance pack detailing week-over-week efficiency, wins, losses, and active experiment updates.
   - Monthly Board Deck Pack: Strategic CAC payback velocity, customer LTV expansion, and contribution to company EBITDA.`
    },
    {
      track_id: track3Id,
      title: "Statistical Anomaly Detection and Spend Spikes",
      order_index: 2,
      content: `### Automated Telemetry and Risk Mitigation

1. Z-Score Statistical Anomaly Detection:
   - Calculating 14-day rolling mean (mu) and standard deviation (sigma) for daily CPA and spend:
     Z = (Daily_CPA - mu) / sigma.
   - Triggering automated Slack/PagerDuty alerts when |Z| > 2.5 (identifying broken tracking pixels, website checkout crashes, or auction bidding anomalies).

2. Automated Circuit Breakers:
   - Scripted rules pausing campaigns if hourly spend velocity exceeds 150% of forecast, preventing runaway budget drain.`
    },
    {
      track_id: track3Id,
      title: "Marketing Data Governance and Audit Frameworks",
      order_index: 3,
      content: `### Data Integrity and Taxonomy Governance

1. UTM Parameter Linters:
   - Enforcing strict automated linters (snake_case, lower-case, validated taxonomy) across all ad tracking URLs prior to campaign launch.

2. dbt Data Quality Assertions:
   - Automated continuous data testing (\`not_null\`, \`unique\`, \`accepted_values\`, custom relationship tests) verifying that daily ad spend extracts match external API billing records with zero missing dates.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #81.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In the Modern Marketing Data Stack (MMDS), what is the primary role of automated ELT tools like Fivetran and Airbyte?",
      options: [
        "Extracting performance data from ad and CRM APIs (Google, Meta, Shopify) and loading it into a centralized cloud data warehouse (Snowflake, BigQuery)",
        "Designing marketing logos",
        "Writing video ad scripts",
        "Sending email newsletters"
      ],
      correct_option_index: 0,
      explanation: "ELT tools automate extraction from disparate ad and business APIs, centralizing raw data into cloud warehouses.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In marketing dashboard architecture, what high-level metric evaluates total enterprise revenue divided by total paid ad spend across all channels?",
      options: [
        "Click-Through Rate (CTR)",
        "Bounce Rate",
        "Marketing Efficiency Ratio (MER / Blended ROAS)",
        "Quality Score"
      ],
      correct_option_index: 2,
      explanation: "MER (Total Revenue / Total Ad Spend) measures holistic blended business return, overcoming platform attribution bias.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In financial revenue reconciliation, what system must serve as the authoritative Single Source of Truth for top-line revenue?",
      options: [
        "Facebook Ads Manager",
        "The backend payment gateway / ERP transactional system (e.g. Stripe, Shopify, NetSuite)",
        "Google Analytics estimated revenue",
        "Twitter Ads analytics"
      ],
      correct_option_index: 1,
      explanation: "Actual cash collected in ERP/payment systems represents the only financial source of truth, as ad platform models overlap.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In marketing budget tracking, what is 'Budget Pacing'?",
      options: [
        "Paying marketing bills early",
        "The speed of website loading",
        "Running on a treadmill during meetings",
        "Comparing cumulative daily ad spend against expected linear target spend throughout the month to identify overspending or underspending"
      ],
      correct_option_index: 3,
      explanation: "Budget pacing tracks actual daily spend trajectories against monthly allocated budget targets to prevent over/underspending.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In executive reporting tiering, what metrics should be prioritized on a Tier 1 C-Suite Executive Summary dashboard?",
      options: [
        "Macro strategic metrics: Blended MER, Total Spend, Blended CAC, Net New Revenue, and Contribution Margin 2 (CM2)",
        "Individual keyword bids and ad font sizes",
        "Social media likes and follower counts",
        "Server CPU temperature"
      ],
      correct_option_index: 0,
      explanation: "Executive dashboards prioritize high-level profitability, unit economics, and macro efficiency metrics on a single screen.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "Why do individual ad platform revenue reports (Meta, Google, TikTok) often sum up to substantially more than total actual bank revenue (Platform Over-Reporting Bias)?",
      options: [
        "Ad platforms use fake foreign currencies",
        "Search engines cannot calculate addition",
        "Ad platforms cannot track refunds",
        "Each ad platform claims 100% conversion credit for overlapping user touchpoints within their respective view and click attribution windows"
      ],
      correct_option_index: 3,
      explanation: "Separate ad platforms claim overlapping credit for the same multi-touch customer journey, creating inflated sum-of-platform totals.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In marketing dimensional modeling, what is the 'Grain' of a standard fact_marketing_performance table?",
      options: [
        "The price of wheat on commodity markets",
        "One row per unique combination of Date + Campaign ID + Ad ID + Channel ID",
        "One row per website visitor",
        "One row per year"
      ],
      correct_option_index: 1,
      explanation: "The grain defines the atomic level of detail, typically daily performance per individual creative/ad across campaigns.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "Why is a 'Rolling 7-Day Moving Average CPA' preferred over raw daily CPA on operational marketing dashboards?",
      options: [
        "It filters out day-of-week seasonality (e.g. weekend vs weekday fluctuations) and volatile daily noise, revealing the true underlying performance trajectory",
        "It makes reports 7 times longer",
        "It multiplies CPA by 7",
        "Daily CPA is illegal in statistics"
      ],
      correct_option_index: 0,
      explanation: "Rolling 7-day averages smooth out day-of-week variance, showing clear trendlines rather than erratic daily spikes.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In marketing visual analytics, what is a Customer LTV Cohort Retention Heatmap?",
      options: [
        "A thermal infrared camera photo of customers",
        "A weather forecast for retail stores",
        "A triangular matrix displaying how monthly customer acquisition cohorts retain and generate cumulative gross margin over 12 to 24 months",
        "A list of customer home addresses"
      ],
      correct_option_index: 2,
      explanation: "Cohort heatmaps visualize retention and cumulative revenue expansion per acquisition group over time.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In automated marketing telemetry, what is the purpose of an automated 'Daily Morning Slack Flash Report'?",
      options: [
        "To wish employees good morning",
        "To post funny internet memes",
        "To delete old marketing files",
        "To give media buyers and leadership an instant 8:00 AM summary of yesterday's spend, revenue, MER, and top/bottom campaigns to guide daily bid adjustments"
      ],
      correct_option_index: 3,
      explanation: "Daily flash alerts provide actionable operational snapshots of yesterday's media performance to guide same-day optimizations.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In marketing anomaly detection, how does a Z-Score alert algorithm (Z = (Daily_CPA - mu) / sigma) prevent false alarms while catching real emergencies?",
      options: [
        "By ignoring all CPA changes under $100",
        "It calculates the 14-day rolling mean (mu) and standard deviation (sigma), alerting teams only when CPA deviates by more than 2.5 standard deviations (|Z| > 2.5), capturing statistically significant emergencies like broken pixels or checkout crashes",
        "By only checking reports once a year",
        "By setting CPA to zero"
      ],
      correct_option_index: 1,
      explanation: "Z-score anomaly detection normalizes deviations against historical volatility, triggering alerts only on genuine statistical outliers.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In dbt data transformation pipelines for marketing, why is standardizing all monetary amounts to a single base currency (e.g. USD) with daily FX rates critical?",
      options: [
        "To avoid paying taxes",
        "Ad platforms only accept Bitcoin",
        "Without FX normalization, global campaigns spending Euros, GBP, and Yen will be summed directly as raw numbers, severely distorting blended ROAS and MER calculations",
        "Foreign currencies crash cloud data warehouses"
      ],
      correct_option_index: 2,
      explanation: "Aggregating un-normalized multi-currency spend creates corrupted financial metrics; converting via daily FX rates ensures accuracy.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In data warehouse modeling, how does a 'Bridge Table' resolve Many-to-Many relationships between ad campaigns and multi-product promotional bundles?",
      options: [
        "It contains foreign keys linking campaign_id and product_id along with an allocation weighting factor, ensuring revenue and spend distribute accurately across products without duplicate counting",
        "It physically connects two computer monitors",
        "It deletes duplicate products",
        "It turns off database indexing"
      ],
      correct_option_index: 0,
      explanation: "Bridge tables map many-to-many relationships with weighting factors, preventing Cartesian row multiplication in BI aggregations.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In marketing data governance, what is the role of an automated 'UTM Parameter Linter'?",
      options: [
        "To clean dust from computer screens",
        "To delete old website URLs",
        "To send automated emails to leads",
        "To validate tracking link parameters (enforcing lowercase, snake_case, approved channel taxonomies) before ads go live, preventing fragmented reporting in analytics"
      ],
      correct_option_index: 3,
      explanation: "UTM linters enforce strict naming conventions before campaign launch, stopping dirty data from polluting analytics pipelines.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In media spend safety architecture, what does an automated 'Circuit Breaker' webhook script accomplish?",
      options: [
        "It shuts off the building electricity",
        "It monitors hourly spend pacing via API and automatically pauses campaigns if spend exceeds 150% of hourly forecast, protecting ad accounts from runaway bidding algorithm loops or API errors",
        "It increases bids by 500%",
        "It downloads all customer records to a CSV"
      ],
      correct_option_index: 1,
      explanation: "Circuit breakers automatically throttle or pause campaigns during anomalous spending surges, preventing catastrophic account drains.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #81.");
  console.log("Skill #81 update completed successfully!");
}

run();
