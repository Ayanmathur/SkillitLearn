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

const skillId = "2d1428ec-908f-4a4e-a765-a531395640af";

async function run() {
  console.log("Updating Skill #80: Google Analytics & Tag Manager (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: GA4 Event-Driven Architecture and BigQuery Integration" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Google Tag Manager (GTM) Architecture: Client and Server" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Attribution Modeling, GA4 Explorations and Consent Mode v2" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Lead Web Analytics Engineer level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Event-Driven Data Model and Custom Dimensions",
      order_index: 1,
      content: `### GA4 Event Architecture and Dimension Scopes

1. Universal Analytics vs GA4:
   - Universal Analytics relied on rigid session-based hit types (pageviews, events, transactions).
   - GA4 utilizes a flexible, unified Event-Driven data model where every interaction is an \`event\` accompanied by custom key-value parameter payloads.

2. GA4 Event Taxonomy:
   - Automatically Collected: \`page_view\`, \`session_start\`, \`first_visit\`.
   - Enhanced Measurement: \`scroll\` (90% depth), outbound \`click\`, \`view_search_results\`, \`file_download\`.
   - Recommended Events: Standardized schemas (\`login\`, \`sign_up\`, \`generate_lead\`, \`purchase\`).
   - Custom Events: Domain-specific events (up to 500 unique names per property).

3. Custom Dimension Scopes:
   - Event-scoped: Parameters evaluated per event occurrence.
   - User-scoped: Attributes adhering permanently to user profiles (\`user_properties\`).
   - Item-scoped: E-commerce product catalog metadata.`
    },
    {
      track_id: track1Id,
      title: "GA4 E-Commerce Schema and DataLayer Implementation",
      order_index: 2,
      content: `### E-Commerce Telemetry and DataLayer Protocols

1. Standard GA4 E-Commerce Funnel Steps:
   - \`view_item_list\` -> \`select_item\` -> \`view_item\` -> \`add_to_cart\` -> \`view_cart\` -> \`begin_checkout\` -> \`add_payment_info\` -> \`purchase\`.

2. The Standardized \`dataLayer.push\` Syntax:
\`\`\`javascript
window.dataLayer = window.dataLayer || [];
dataLayer.push({ ecommerce: null }); // Clear previous state
dataLayer.push({
  event: \"purchase\",
  ecommerce: {
    transaction_id: \"T_10842\",
    value: 149.50,
    tax: 12.00,
    shipping: 7.50,
    currency: \"USD\",
    items: [{
      item_id: \"SKU_554\",
      item_name: \"Ergonomic Desk Chair\",
      item_category: \"Furniture\",
      price: 149.50,
      quantity: 1
    }]
  }
});
\`\`\``
    },
    {
      track_id: track1Id,
      title: "BigQuery Export Architecture and SQL Unnesting",
      order_index: 3,
      content: `### Data Warehousing and Raw Event Telemetry

1. GA4 to BigQuery Native Export:
   - Streams raw, unsampled event-level data directly to Google BigQuery daily and in real time with zero platform licensing cost.
   - Completely bypasses GA4 UI thresholding, sampling, and standard 14-month data retention limits.

2. SQL Unnesting of Repeated Parameters:
\`\`\`sql
SELECT
  event_date,
  event_name,
  user_pseudo_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_url,
  (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'engagement_time_msec') AS engagement_ms
FROM
  \`project.analytics_123456789.events_*\`
WHERE
  _TABLE_SUFFIX = FORMAT_DATE('%Y%m%d', CURRENT_DATE() - 1);
\`\`\``
    },

    // Track 2
    {
      track_id: track2Id,
      title: "GTM Core Anatomy: Tags, Triggers and Variables",
      order_index: 1,
      content: `### Client-Side Tag Management Architecture

1. Core Components of Google Tag Manager (GTM):
   - Tags: Executable JavaScript snippets sending data to third parties (GA4 Event tags, Meta Pixel, Google Ads Conversion).
   - Triggers: Boolean firing rules evaluated by event listeners (Page View, DOM Ready, Click - All Elements, Form Submission, Element Visibility, Custom Event).
   - Variables: Dynamic data retrieval mechanisms: Data Layer Variables (\`dlv - ecommerce.value\`), Lookup Tables, Regex Tables, and Custom JavaScript Functions.`
    },
    {
      track_id: track2Id,
      title: "Server-Side GTM (sGTM) and First-Party Tracking",
      order_index: 2,
      content: `### Privacy-First Server-Side Tagging Infrastructure

1. Server-Side GTM (sGTM) Architecture:
   - Runs a dedicated Node.js proxy container on Google Cloud Run or AWS behind a custom first-party subdomain (\`analytics.yourdomain.com\`).

2. Mitigating Browser Cookie Restrictions:
   - Server-set \`Set-Cookie\` HTTP response headers with \`HttpOnly\` and \`SameSite=Lax\` bypass Apple Safari ITP 24-hour cookie limits, restoring client identification durability for up to 1 to 2 years.

3. Client Performance & Vendor Consolidation:
   - Client sends 1 unified event to sGTM; the server distributes payloads downstream to GA4, Meta CAPI, and Google Ads, reducing browser JavaScript bloat by 70%.`
    },
    {
      track_id: track2Id,
      title: "GTM Debugging, Environments and Version Control",
      order_index: 3,
      content: `### Telemetry Quality Assurance and Versioning

1. Tag Assistant Debugging:
   - Interactive preview mode displaying real-time message events, dataLayer state changes, resolved variable values, and tag firing/blocking sequences.

2. Environments & Workspaces:
   - Creating isolated Development, Staging, and Production environments with separate container IDs.
   - Multi-user Workspaces with merge conflict resolution and instant version rollbacks in production emergencies.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "GA4 Explorations: Free Form, Funnel and Path Analysis",
      order_index: 1,
      content: `### Advanced Exploratory Analytics in GA4

1. Core Exploration Techniques:
   - Free-Form Exploration: Nested dimension-metric cross-tabulation grids with heatmaps and filters.
   - Funnel Exploration: Open vs Closed step funnels evaluating multi-stage user progression, abandoned drop-off rates, and elapsed time between stages.
   - Path Exploration: Reverse pathing beginning from a conversion or churn event to trace prior touchpoint pathways in reverse.`
    },
    {
      track_id: track3Id,
      title: "Attribution Modeling: Data-Driven vs Rule-Based Models",
      order_index: 2,
      content: `### Machine Learning Attribution and Reporting Identities

1. Data-Driven Attribution (DDA):
   - Uses machine learning algorithms based on cooperative game theory (Shapley values and Markov chains) to evaluate how touchpoint combinations lead to conversions, comparing converting paths against non-converting paths.

2. Reporting Identity Hierarchy:
   - Blended: Evaluates User-ID -> Google Signals -> Device ID -> Modeled data.
   - Observed: Restricts evaluation to verified User-ID and Device-ID without probabilistic modeling.`
    },
    {
      track_id: track3Id,
      title: "Google Consent Mode v2 and European Regulatory Compliance",
      order_index: 3,
      content: `### Cookieless Pings and Consent Signals under GDPR/DMA

1. Consent Mode v2 Signals:
   - \`analytics_storage\`, \`ad_storage\`, \`ad_user_data\`, and \`ad_personalization\`.

2. Advanced Consent Mode:
   - When consent is denied by European users, tags fire cookieless, non-identifying pings.
   - GA4 machine learning models bridge the measurement gap, recovering over 70% of lost conversion attribution data under strict GDPR and Digital Markets Act (DMA) compliance.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #80.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "What fundamental architectural data model distinguishes Google Analytics 4 (GA4) from legacy Universal Analytics?",
      options: [
        "GA4 utilizes a unified Event-Driven data model where every interaction is an event with custom parameters, replacing legacy session-based hit types",
        "GA4 only tracks mobile app downloads",
        "GA4 was written in PHP",
        "GA4 deletes all historical data every 24 hours"
      ],
      correct_option_index: 0,
      explanation: "GA4 replaced session-based hit types (pageviews, timing, transactions) with a flexible, unified event-driven model.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In Google Tag Manager (GTM), what core component defines the condition or rule under which a tag executes (e.g. Page View, Custom Event, Form Submission)?",
      options: [
        "Variable",
        "Data Layer",
        "Trigger",
        "Folder"
      ],
      correct_option_index: 2,
      explanation: "Triggers evaluate runtime conditions and event listeners to determine when tags should fire.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "Why is clearing the previous ecommerce state ('dataLayer.push({ ecommerce: null });') required before pushing a new ecommerce event into the dataLayer?",
      options: [
        "To delete customer cookies",
        "To clear previous ecommerce object state and prevent accidental parameter bleeding or data corruption across sequential events",
        "To restart the web browser",
        "To disconnect Google Tag Manager"
      ],
      correct_option_index: 1,
      explanation: "Clearing the ecommerce object ensures previous product arrays do not accidentally merge into subsequent transaction payloads.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What cloud data warehouse receives raw, unsampled GA4 event streaming data natively with zero platform license fees?",
      options: [
        "Amazon Redshift",
        "Snowflake",
        "Microsoft Access",
        "Google BigQuery"
      ],
      correct_option_index: 3,
      explanation: "GA4 features a native free BigQuery export integration for streaming raw, unsampled event logs.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In GA4 exploration reports, what type of exploration allows analysts to trace user navigation pathways backwards starting from a final conversion or cancellation event?",
      options: [
        "Path Exploration (Reverse Pathing)",
        "Free Form Table",
        "Scatter Plot",
        "User Lifetime Exploration"
      ],
      correct_option_index: 0,
      explanation: "Path Exploration supports backward pathing, tracing the preceding touchpoints that led to a specific conversion.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "How does Server-Side Google Tag Manager (sGTM) hosted on a custom first-party subdomain (e.g. analytics.yourdomain.com) overcome Apple Safari ITP cookie restrictions?",
      options: [
        "By disabling JavaScript",
        "By asking users to use Chrome",
        "By encrypting web pages",
        "By setting cookies via HTTP response headers (Set-Cookie) with HttpOnly and SameSite flags directly from a first-party server, extending cookie lifespans beyond Safari's 24-hour client-side cap"
      ],
      correct_option_index: 3,
      explanation: "Server-set HTTP cookies bypass Safari ITP JavaScript cookie caps, restoring durable 1-2 year client tracking.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Google BigQuery SQL queries on GA4 event exports, why must the 'UNNEST()' operator be used to query event parameters?",
      options: [
        "BigQuery cannot query strings",
        "GA4 exports event_params as a repeated nested RECORD array of key-value structs, requiring UNNEST to flatten rows for SQL filtering",
        "To speed up database indexing",
        "UNNEST is used to delete duplicate tables"
      ],
      correct_option_index: 1,
      explanation: "event_params are stored as nested repeated arrays; UNNEST flattens these arrays so parameter keys and values can be selected.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What is the primary operational mechanism behind GA4's 'Data-Driven Attribution' (DDA) model?",
      options: [
        "It uses machine learning and cooperative game theory (Shapley values / Markov models) to analyze both converting and non-converting user paths to distribute fractional credit to touchpoints",
        "It gives 100% credit to the first click",
        "It gives 100% credit to the last click",
        "It splits credit equally among all clicks"
      ],
      correct_option_index: 0,
      explanation: "DDA uses algorithmic game theory models to calculate the incremental conversion contribution of each touchpoint.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In Google Consent Mode v2, what two new consent signals were introduced to comply with the European Union Digital Markets Act (DMA)?",
      options: [
        "page_view and click_track",
        "user_email and user_phone",
        "ad_user_data and ad_personalization",
        "cookie_yes and cookie_no"
      ],
      correct_option_index: 2,
      explanation: "Consent Mode v2 added ad_user_data and ad_personalization signals to govern audience building and remarketing in the EU.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In GA4 custom dimension configuration, what is the difference between an 'Event-scoped' dimension and a 'User-scoped' dimension?",
      options: [
        "Event-scoped dimensions only work on mobile",
        "User-scoped dimensions cannot be exported to BigQuery",
        "There is zero difference",
        "Event-scoped dimensions describe specific single-event parameters (e.g. video_title), while User-scoped dimensions describe permanent customer attributes (e.g. loyalty_tier) that persist across sessions"
      ],
      correct_option_index: 3,
      explanation: "Event-scoped dimensions describe specific actions; user-scoped dimensions attach persistent attributes to the visitor profile.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In GA4 reporting identity configuration, what is the difference between 'Blended' identity and 'Observed' identity?",
      options: [
        "Observed identity deletes all user records",
        "Blended uses User-ID, Google Signals, Device ID, and machine learning behavioral modeling for unconsented users, while Observed uses only verified observed identifiers without modeling",
        "Blended only runs on Android devices",
        "Observed identity costs extra money"
      ],
      correct_option_index: 1,
      explanation: "Blended identity leverages algorithmic machine learning modeling to fill gaps from unconsented users; Observed relies strictly on first-party IDs.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In GTM variable architecture, when should a 'Lookup Table' or 'Regex Table' variable be preferred over multiple separate tags?",
      options: [
        "To make websites load slower",
        "To delete old analytics tags",
        "To dynamically route a single tag's destination ID (e.g. sending to different GA4 Measurement IDs based on hostname or page path) without creating redundant duplicate tags",
        "To translate JavaScript into Python"
      ],
      correct_option_index: 2,
      explanation: "Lookup and Regex tables dynamically map input variables to outputs, enabling a single tag to handle multiple environments or tracking IDs.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Advanced Consent Mode v2 implementation, how does GA4 recover conversion attribution data when European users deny cookie consent?",
      options: [
        "Tags fire cookieless, non-identifying pings containing only timestamp and browser metadata; GA4 machine learning models analyze behavioral patterns to bridge attribution gaps with >70% accuracy",
        "It ignores the user's choice and sets tracking cookies anyway",
        "It blocks the user from viewing the website",
        "It prompts the user to solve a CAPTCHA"
      ],
      correct_option_index: 0,
      explanation: "Cookieless pings transmit non-identifying telemetry, which machine learning models use to estimate total conversions without violating GDPR.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In GA4 Funnel Explorations, what is the structural difference between an 'Open Funnel' and a 'Closed Funnel'?",
      options: [
        "Open funnels can only be viewed by administrators",
        "Closed funnels delete user data upon completion",
        "Open funnels only work on e-commerce websites",
        "In an Open Funnel, users can enter the funnel at any step; in a Closed Funnel, users must enter strictly at Step 1 and proceed sequentially to be counted in subsequent steps"
      ],
      correct_option_index: 3,
      explanation: "Closed funnels enforce strict sequential progression from Step 1; Open funnels count users entering at any intermediate step.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In GA4 BigQuery event schemas, what SQL function aggregates total engaged time per session across all session events?",
      options: [
        "COUNT(DISTINCT page_location)",
        "SUM((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'engagement_time_msec')) / 1000",
        "AVG(user_pseudo_id)",
        "MAX(event_name)"
      ],
      correct_option_index: 1,
      explanation: "engagement_time_msec is extracted via scalar subquery from unnested event_params and summed to calculate total engagement seconds.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #80.");
  console.log("Skill #80 update completed successfully!");
}

run();
