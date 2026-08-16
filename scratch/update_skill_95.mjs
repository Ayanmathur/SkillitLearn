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

const skillId = "c7e23e01-a89d-4c3f-81c4-8d7abfd6a173";

async function run() {
  console.log("Updating Skill #95: Customer Retention Strategy (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Customer Success Architecture, Onboarding and Health Scoring" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Churn Analytics, Net Revenue Retention (NRR) and Dunning" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Land-and-Expand Motions, Upselling and Customer Advocacy" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / CCO & SaaS Customer Retention Director level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Proactive Customer Success vs Reactive Customer Support",
      order_index: 1,
      content: `### Strategic Post-Sale Architecture and Segmentation

1. Reactive Support vs Proactive Customer Success:
   - Reactive Support resolves inbound troubleshooting tickets after errors occur.
   - Proactive Customer Success actively guides clients toward quantifiable business outcomes, driving user adoption, product health, and renewal security.

2. Tiered Service Delivery Models:
   - High-Touch CS for Tier 1 Enterprise accounts (dedicated CSM, custom onboarding, executive QBRs).
   - Tech-Touch Automated CS for SMBs (automated lifecycle email sequences, in-app product tours, and self-serve knowledge bases).`
    },
    {
      track_id: track1Id,
      title: "Customer Product Health Scoring Algorithms",
      order_index: 2,
      content: `### Predictive Churn Telemetry and Health Indices

1. The Composite Customer Health Score (0-100 Index):
   - Product Usage & Feature Breadth (40%): Weekly active usage (WAU/MAU) and adoption of core high-value features.
   - License Seat Utilization (20%): Percentage of purchased seats actively logged in (<60% indicates impending downsell/churn).
   - Executive Engagement (20%): Regular attendance and communication with the economic decision maker.
   - Support Sentiment & Open Tickets (20%): CSAT survey ratings and unresolved critical blocker tickets.`
    },
    {
      track_id: track1Id,
      title: "First 90-Day Time-to-First-Value (TTFV) and QBR Cadence",
      order_index: 3,
      content: `### Early Value Realization and Quarterly Business Reviews

1. Time-to-First-Value (TTFV):
   - Streamlining onboarding workflows so customers achieve their first tangible business win within 30 days of contract signing.

2. Executive Quarterly Business Reviews (QBRs):
   - Hosting structured 45-minute quarterly meetings with client executive sponsors presenting empirical ROI data, product usage metrics, and strategic roadmap alignment.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Gross Revenue Churn vs Net Revenue Retention (NRR)",
      order_index: 1,
      content: `### SaaS Financial Retention Economics

1. Net Revenue Retention (NRR) Equation:
   - NRR = ((Starting ARR + Expansion ARR - Contraction ARR - Churned ARR) / Starting ARR) * 100%.

2. Enterprise SaaS Benchmarks:
   - Top-quartile enterprise software companies achieve >= 120% to 130% NRR, generating 20% to 30% annual revenue growth from existing customer accounts alone before signing a single new customer.`
    },
    {
      track_id: track2Id,
      title: "Cohort Retention Heatmaps and Churn Root Cause Analysis",
      order_index: 2,
      content: `### Retention Decay Curves and Exit Audits

1. Monthly Cohort Retention Heatmaps:
   - Tracking monthly customer signup cohorts over 12 to 24 months to isolate exactly when churn spikes occur (e.g. Month 1 onboarding drop vs Month 12 renewal cliff).

2. Systematic Churn Exit Interviews:
   - Categorizing customer cancellations into actionable root causes: Product Deficit, Pricing Mismatch, Champion Departure, or Poor Sales Qualification.`
    },
    {
      track_id: track2Id,
      title: "Involuntary Churn Mitigation and Automated Dunning",
      order_index: 3,
      content: `### Payment Failure Recovery and Dunning Logic

1. Involuntary Churn Drivers:
   - 20% to 40% of all SaaS customer churn is involuntary (expired credit cards, temporary bank fraud blocks, outdated billing addresses).

2. Automated Dunning Architecture (Stripe Smart Retries, Churn Buster):
   - Automatic card account updater integrations (Visa/Mastercard VAU), machine learning payment retries at optimal bank processing hours, and automated payment update warning emails.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "The Land-and-Expand Playbook: Seats, Usage and Add-Ons",
      order_index: 1,
      content: `### Account Expansion and Cross-Selling Frameworks

1. The 4 Land-and-Expand Expansion Vectors:
   - 1. Seat Expansion: Organic spread across additional team members and new internal departments.
   - 2. Tier Upgrades: Upgrading from Team to Enterprise tiers for advanced security (SSO/SAML, audit logs).
   - 3. Usage Scaling: Increasing compute, API call volumes, or data storage limits.
   - 4. Product Cross-Selling: Purchasing complementary add-on software modules.`
    },
    {
      track_id: track3Id,
      title: "Customer Advocacy, G2 Reviews and Case Study Engines",
      order_index: 2,
      content: `### Transforming Promoters into Acquisition Flywheels

1. Net Promoter Score (NPS) Segmentation:
   - Promoters (Score 9-10): Immediately routed to submit verified reviews on G2/Capterra and participate in filmed case studies.
   - Passives (Score 7-8): Targeted with advanced product training.
   - Detractors (Score 0-6): Escalated to Customer Success leadership for rapid 1-on-1 issue resolution within 24 hours.`
    },
    {
      track_id: track3Id,
      title: "Customer Advisory Boards (CABs) and Enterprise Lock-In",
      order_index: 3,
      content: `### Executive Strategic Alignment and Retention Moats

1. Customer Advisory Boards (CABs):
   - Convening 10 to 15 key C-level client executives for semi-annual closed-door product roadmap advisory sessions.
   - Creates deep emotional investment and enterprise lock-in, resulting in 98%+ renewal rates among participating enterprise accounts.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #95.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "What top-quartile benchmark for Net Revenue Retention (NRR) is standard among world-class enterprise SaaS companies?",
      options: [
        "10% to 20%",
        "At least 120% to 130% (meaning the business grows 20-30% annually from existing accounts even with zero new customer acquisition)",
        "0%",
        "50%"
      ],
      correct_option_index: 1,
      explanation: "NRR >= 120-130% indicates negative net revenue churn, driving powerful compounding growth from existing customer expansion.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In Customer Success operations, what is the primary difference between 'Proactive Customer Success' and 'Reactive Customer Support'?",
      options: [
        "Customer support costs more money",
        "There is zero difference",
        "Customer success is only for retail stores",
        "Support resolves incoming technical issues after they occur; Success proactively guides customers toward quantifiable business ROI to ensure long-term retention"
      ],
      correct_option_index: 3,
      explanation: "Support is reactive and ticket-driven; Success is proactive and outcome-driven to ensure adoption and renewals.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What percentage range of total customer churn in SaaS is estimated to be 'Involuntary Churn' (caused by expired cards or failed billing)?",
      options: [
        "20% to 40%",
        "0%",
        "99%",
        "0.01%"
      ],
      correct_option_index: 0,
      explanation: "Between 20% and 40% of churn is involuntary, caused by passive payment failures rather than active product cancellation.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In customer health scoring, what does a low 'License Seat Utilization' rate (e.g. only 40% of purchased seats actively logging in) signal to a Customer Success Manager?",
      options: [
        "The customer is happy and wants to buy more seats",
        "The customer needs a price increase",
        "A severe impending churn or downsell risk at the upcoming contract renewal date",
        "The customer website is broken"
      ],
      correct_option_index: 2,
      explanation: "Unused seats represent waste to the client's finance department, leading to downsized renewals or total cancellation.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In Net Promoter Score (NPS) methodology, which customer score category represents 'Promoters'?",
      options: [
        "Scores 0 to 6",
        "Scores 9 and 10",
        "Scores 7 and 8",
        "Scores below 0"
      ],
      correct_option_index: 1,
      explanation: "Customers rating 9 or 10 are Promoters, loyal enthusiasts who fuel viral word-of-mouth and case studies.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "What is the mathematical formula used to calculate Net Revenue Retention (NRR)?",
      options: [
        "NRR = Total Sales / Number of Employees",
        "NRR = Cash Balance * 100",
        "NRR = ((Starting ARR + Expansion ARR - Contraction ARR - Churned ARR) / Starting ARR) * 100%",
        "NRR = Gross Revenue - Income Tax"
      ],
      correct_option_index: 2,
      explanation: "NRR measures the net percentage of recurring revenue retained from an existing customer base over a specified period.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In enterprise account retention, what is the primary purpose of an executive Quarterly Business Review (QBR)?",
      options: [
        "To present concrete empirical ROI data, review product milestones, and align on upcoming strategic business priorities with executive decision makers",
        "To send invoices and demand payment",
        "To fix software bugs during the meeting",
        "To show funny videos to employees"
      ],
      correct_option_index: 0,
      explanation: "QBRs reinforce the quantifiable financial value delivered to executive sponsors, securing contract renewals and expansion.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In customer lifecycle analytics, what is the primary value of a 'Monthly Cohort Retention Heatmap'?",
      options: [
        "It tracks the temperature of the office building",
        "It generates automatic invoices",
        "It calculates marketing ad spend",
        "It tracks monthly customer groups over time to identify exact retention drop-off inflection points (e.g. onboarding drop vs annual renewal cliff)"
      ],
      correct_option_index: 3,
      explanation: "Heatmaps visualize retention decay across cohorts, highlighting whether churn happens early in onboarding or at annual contract renewals.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In SaaS revenue expansion, what is the 'Land-and-Expand' commercial motion?",
      options: [
        "Buying farmland to build data centers",
        "Landing an initial low-friction contract with a single team or department, then systematically expanding revenue through seat additions, tier upgrades, and add-on modules",
        "Expanding sales exclusively to international markets",
        "Giving software away for free forever"
      ],
      correct_option_index: 1,
      explanation: "Land-and-Expand gets a foot in the door with a small contract, growing account value organically over time.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "How does an automated 'Dunning Engine' (e.g. Churn Buster, Stripe Smart Retries) recover failed recurring subscriptions?",
      options: [
        "By sending debt collectors to customer homes",
        "By immediately cancelling the account upon first failure",
        "By using card updater APIs to refresh expired card details, retrying failed charges at optimal bank hours, and sending automated branded payment update prompts",
        "By reporting customers to credit bureaus"
      ],
      correct_option_index: 2,
      explanation: "Dunning systems automate card account updates and smart retries to recover involuntary payment failures without human intervention.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In customer onboarding optimization, why is 'Time-to-First-Value' (TTFV) the single most critical leading indicator of long-term account retention?",
      options: [
        "Customers who achieve their primary desired business outcome within the first 30 days experience rapid time-to-value, establishing immediate ROI and cementing product adoption before buyer remorse sets in",
        "TTFV is required for tax reporting",
        "Longer TTFV increases customer loyalty",
        "TTFV eliminates the need for software engineering"
      ],
      correct_option_index: 0,
      explanation: "Rapid time-to-first-value validates the purchase decision early, dramatically reducing Month 1-3 customer churn.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In enterprise software governance, how does a 'Customer Advisory Board' (CAB) generate exceptional account retention (>98%)?",
      options: [
        "By paying customers cash bonuses",
        "By forcing customers to sign 10-year contracts",
        "By threatening legal action if they leave",
        "By giving key executive decision makers direct influence over the company's future product roadmap, creating immense strategic partnership and emotional lock-in"
      ],
      correct_option_index: 3,
      explanation: "Involving C-level leaders in roadmap co-creation builds deep executive trust and enterprise alignment, making switching vendors unthinkable.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "When conducting Net Promoter Score (NPS) operations, what immediate workflow should trigger when a customer responds as a 'Detractor' (Score 0-6)?",
      options: [
        "Delete the customer's account immediately",
        "Automatically route the feedback to Customer Success leadership for proactive, personalized outreach within 24 hours to diagnose and resolve the root frustration",
        "Ask the Detractor to write a public review on G2",
        "Ignore the score completely"
      ],
      correct_option_index: 1,
      explanation: "Rapid escalation of detractor feedback enables teams to turn negative experiences around before public complaints or contract cancellations occur.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In SaaS metric analysis, how can a company have a 95% Logo Retention Rate but only an 80% Net Revenue Retention (NRR) Rate?",
      options: [
        "Because of software bugs",
        "Because logo retention is always higher than NRR",
        "The company retained 95% of its total customer count, but high-spending enterprise accounts experienced severe contraction (downselling) or churn, wiping out dollar retention",
        "Because foreign currency values changed"
      ],
      correct_option_index: 2,
      explanation: "Losing a few high-ACV enterprise accounts or experiencing widespread downselling degrades NRR even if total customer count remains stable.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In predictive customer health scoring models, why should 'Support Ticket Volume' be evaluated alongside 'Ticket Sentiment and Resolution Time' rather than in isolation?",
      options: [
        "A high volume of feature questions often indicates high user engagement, whereas zero tickets combined with declining logins is a far more dangerous silent churn signal",
        "Support tickets are completely unrelated to retention",
        "Support tickets only measure software bugs",
        "Customers never submit support tickets"
      ],
      correct_option_index: 0,
      explanation: "Active support inquiries indicate active usage; complete silence paired with dropping logins is the classic warning sign of silent churn.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #95.");
  console.log("Skill #95 update completed successfully!");
}

run();
