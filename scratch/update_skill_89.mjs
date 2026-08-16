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

const skillId = "e57bd23b-5cb7-48be-b809-283acc63e559";

async function run() {
  console.log("Updating Skill #89: Business Model Design (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Business Model Canvas, Lean Canvas and Value Proposition Mapping" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Monetization Archetypes, Pricing Strategies and Unit Economics" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Defensibility, Hamilton Helmer's 7 Powers and Flywheels" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / HBS & Venture Capital Partner level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Alexander Osterwalder's 9-Box Business Model Canvas",
      order_index: 1,
      content: `### Strategic Enterprise Business Architecture

1. The 9 Canvas Building Blocks:
   - 1. Customer Segments: Target buyer groups (Niche, Segmented, Multi-sided).
   - 2. Value Propositions: Differentiated quantitative and qualitative utility.
   - 3. Channels: Distribution touchpoints (Direct Web, Enterprise Field Sales, Value-Added Resellers).
   - 4. Customer Relationships: Interaction model (Self-service vs Dedicated account executive).
   - 5. Revenue Streams: Monetization mechanisms (Recurring subscriptions, Transaction fees, Licensing).
   - 6. Key Resources: Core assets (Intellectual IP, Cloud infrastructure, Human capital).
   - 7. Key Activities: Essential operations (Platform engineering, Customer success).
   - 8. Key Partnerships: Strategic supplier and co-marketing alliances.
   - 9. Cost Structure: Operating expense profile (Fixed vs Variable cost drivers).`
    },
    {
      track_id: track1Id,
      title: "Ash Maurya's Lean Canvas for Startups and Risk-First Modeling",
      order_index: 2,
      content: `### High-Uncertainty Venture Modeling

1. Lean Canvas Adaptations:
   - Tailored specifically for fast-moving startups facing extreme market uncertainty by replacing traditional corporate boxes with:
     - Problem: Top 3 user problems and existing alternatives.
     - Solution: Top 3 core features.
     - Key Metrics: Pirate Metrics (AARRR: Acquisition, Activation, Retention, Referral, Revenue).
     - Unfair Advantage: Proprietary moats that cannot be easily bought or copied.`
    },
    {
      track_id: track1Id,
      title: "The Value Proposition Canvas (VPC) and Fit Calibration",
      order_index: 3,
      content: `### Problem-Solution Fit Calibration

1. Customer Profile (Right Side):
   - Customer Jobs: Functional tasks, social status gains, and emotional desires.
   - Customer Pains: Unwanted costs, operational risks, and workflow frustrations.
   - Customer Gains: Desired positive outcomes and concrete business benefits.

2. Value Map (Left Side):
   - Products & Services: Specific software or physical offerings.
   - Pain Relievers: Explicit mechanisms eliminating customer pains.
   - Gain Creators: Specific capabilities delivering quantifiable customer ROI.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The 6 Core Commercial Monetization Archetypes",
      order_index: 1,
      content: `### Monetization Topologies and Margin Profiles

1. Commercial Monetization Archetypes:
   - 1. SaaS / Subscription: Predictable ARR/MRR with 75% to 85% gross margins.
   - 2. Usage-Based / Consumption: Pricing tied directly to compute, API volume, or processed transactions (e.g. Snowflake, Stripe).
   - 3. Two-Sided Marketplaces: Take-rate / rake model capturing 10% to 25% Gross Merchandise Value (GMV).
   - 4. Open-Core: Free open-source base software paired with proprietary enterprise security/compliance modules.
   - 5. Freemium: Free tier driving bottom-up viral adoption, converting 2% to 5% into paid tiers.
   - 6. Direct-to-Consumer (D2C): High-margin physical e-commerce with auto-replenishment subscriptions.`
    },
    {
      track_id: track2Id,
      title: "Unit Economics Architecture: CAC, LTV and Payback Periods",
      order_index: 2,
      content: `### Financial Sustainability and Unit Economic Health

1. Core Unit Economic Equations:
   - Customer Lifetime Value:
     LTV = (Average Revenue Per User * Gross Margin %) / Customer Churn Rate.
   - LTV:CAC Ratio: 3:1 is the venture standard (values < 1:1 burn cash unsustainably; values > 5:1 signal under-investment in growth).

2. CAC Payback Period:
   - CAC Payback (Months) = CAC / (Monthly ARPU * Gross Margin %).
   - Cash-efficient startups target < 12 months for payback velocity.`
    },
    {
      track_id: track2Id,
      title: "Pricing Strategies: Value-Based vs Cost-Plus vs Penetration",
      order_index: 3,
      content: `### Monetization Strategy and Economic Rent Extraction

1. Value-Based Pricing:
   - Setting price based on a percentage (typically 10% to 20%) of the quantifiable economic value generated or saved for the client ($100k savings -> $15k software fee).

2. Cost-Plus Fallacy:
   - Adding a fixed markup onto cost of goods sold (COGS) destroys software pricing power by commoditizing intellectual innovation.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Hamilton Helmer's 7 Powers of Business Defensibility",
      order_index: 1,
      content: `### Structural Business Defensibility and Sustainable Moats

1. The 7 Powers Framework (Hamilton Helmer):
   - 1. Scale Economies: Declining unit costs with increasing production volume.
   - 2. Network Effects: Value to each user increases as total users grow.
   - 3. Counter-Positioning: Adopting a superior business model that incumbents cannot mimic without destroying their existing core profits.
   - 4. Switching Costs: Severe financial or operational friction required to migrate to a competitor.
   - 5. Branding: Visceral customer trust and status enabling price premiums.
   - 6. Cornered Resource: Preferential access to scarce talent, patents, or assets.
   - 7. Process Power: Complex operational excellence embedded in organizational culture that cannot be easily replicated.`
    },
    {
      track_id: track3Id,
      title: "Designing Virtuous Flywheels and Growth Loops",
      order_index: 2,
      content: `### Self-Reinforcing Economic Loops

1. The Amazon Virtuous Cycle:
   - Lower Prices -> Increased Customer Traffic -> More Third-Party Sellers -> Broader Product Selection -> Fixed Cost Scale Economies -> Lower Operating Cost Structure -> Lower Prices.

2. Product-Led Growth (PLG) Loops:
   - Collaborative software (Notion, Figma) where active users naturally invite external team members, converting them into new self-serve accounts without paid ad spend.`
    },
    {
      track_id: track3Id,
      title: "Business Model Stress Testing and Disruption Analysis",
      order_index: 3,
      content: `### Vulnerability Auditing and Enterprise Resilience

1. Structural Stress Testing:
   - Platform Dependency Risk: Auditing exposure to third-party gatekeepers (Apple App Store policy shifts, Google search core algorithm updates).
   - Customer Concentration Risk: Enforcing rules that no single enterprise account represents >15% of annual recurring revenue.
   - Margin Squeeze Sensitivity: Modeling resilience against sudden supplier price increases.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #89.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In the 9-Box Business Model Canvas created by Alexander Osterwalder, what building block defines the unique mix of products and services that create value for a specific customer segment?",
      options: [
        "Key Resources",
        "Value Propositions",
        "Cost Structure",
        "Key Partnerships"
      ],
      correct_option_index: 1,
      explanation: "Value Propositions describe the bundle of products and services that create tangible value for customer segments.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What is the healthy venture capital benchmark for the ratio of Customer Lifetime Value to Customer Acquisition Cost (LTV:CAC)?",
      options: [
        "0.1 to 1",
        "100 to 1",
        "0 to 0",
        "3 to 1 (3:1, where lifetime customer profit is at least 3x the cost to acquire them)"
      ],
      correct_option_index: 3,
      explanation: "A 3:1 LTV:CAC ratio represents the ideal balance between capital efficiency and aggressive growth investment.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In Hamilton Helmer's 7 Powers framework, what power is demonstrated when a product becomes intrinsically more valuable to every user as more total users join the platform (e.g. WhatsApp, Uber)?",
      options: [
        "Network Effects",
        "Cost-Plus Accounting",
        "Tax Deductions",
        "Office Real Estate"
      ],
      correct_option_index: 0,
      explanation: "Network effects occur when the value of a service increases exponentially as the network of active participants expands.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In startup business modeling, what is 'Value-Based Pricing'?",
      options: [
        "Selling products at cost with zero profit",
        "Guessing prices randomly",
        "Setting price based on a percentage (e.g. 10% to 20%) of the quantifiable economic value, revenue generated, or cost saved for the client",
        "Pricing everything at $1.00"
      ],
      correct_option_index: 2,
      explanation: "Value-based pricing anchors price to the tangible financial ROI delivered to the customer rather than internal production costs.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In Ash Maurya's Lean Canvas, what is an 'Unfair Advantage'?",
      options: [
        "Cheating on taxes",
        "Something proprietary (patents, exclusive partnerships, network moats) that cannot be easily copied, replicated, or bought by competitors",
        "Having a pretty website",
        "Working long hours"
      ],
      correct_option_index: 1,
      explanation: "An unfair advantage is an authentic barrier to entry that prevents well-funded competitors from copying your success.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In business defensibility, what is Hamilton Helmer's concept of 'Counter-Positioning'?",
      options: [
        "Sitting on the opposite side of a conference table",
        "Lowering prices until competitors go bankrupt",
        "A newcomer adopting a novel, superior business model that incumbent competitors cannot replicate without cannibalizing their own existing core profits and business (e.g. Netflix streaming vs Blockbuster late fees)",
        "Suing a competitor in court"
      ],
      correct_option_index: 2,
      explanation: "Counter-positioning paralyzes incumbents because copying the startup's model would destroy their existing cash cows.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In SaaS financial economics, how is the Customer Acquisition Cost (CAC) Payback Period calculated?",
      options: [
        "CAC Payback (Months) = CAC / (Monthly ARPU * Gross Margin %)",
        "CAC Payback = Total Employees * Stock Price",
        "CAC Payback = Revenue * 12",
        "CAC Payback = Rent / CAC"
      ],
      correct_option_index: 0,
      explanation: "CAC Payback measures the number of months required for gross margin revenue from a customer to fully repay the marketing cost to acquire them.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In marketplace business models (e.g. Airbnb, Uber), what is the 'Take-Rate' (Rake)?",
      options: [
        "The income tax rate paid to the government",
        "The interest rate on bank loans",
        "The number of visitors who view the website",
        "The percentage fee (typically 10% to 25%) captured by the platform from the total Gross Merchandise Value (GMV) of facilitated transactions"
      ],
      correct_option_index: 3,
      explanation: "Take-rate is the percentage of total transaction volume captured as net revenue by the marketplace platform.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In the Value Proposition Canvas (VPC), how does the 'Value Map' on the left correspond to the 'Customer Profile' on the right?",
      options: [
        "It translates English into Spanish",
        "Pain Relievers address specific Customer Pains, Gain Creators generate desired Customer Gains, and Products/Services satisfy Customer Jobs",
        "It calculates income taxes",
        "There is zero relationship between them"
      ],
      correct_option_index: 1,
      explanation: "The VPC ensures explicit alignment: pain relievers relieve pains, gain creators create gains, and products solve customer jobs.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "Why is a typical Freemium conversion rate benchmark in SaaS between 2% and 5%?",
      options: [
        "Freemium is illegal in software",
        "Free users are banned after 7 days",
        "The vast majority of users will only ever use free utility, while a dedicated 2% to 5% power-user cohort with advanced corporate needs converts to paid enterprise plans, subsidizing the free tier",
        "Payment gateways only approve 5% of credit cards"
      ],
      correct_option_index: 2,
      explanation: "In freemium models, a small converting tier (2-5%) generates sufficient revenue to cover the server costs of the wider free audience.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In enterprise software defensibility, what is 'Switching Costs' power and why does it protect high customer retention?",
      options: [
        "The substantial operational downtime, retraining costs, and complex data migration risks that a company must endure if they attempt to replace an embedded core platform (e.g. Salesforce, Epic Systems)",
        "The cost of changing light switches in an office",
        "The fee charged by credit card companies",
        "The discount offered to new customers"
      ],
      correct_option_index: 0,
      explanation: "High switching costs make moving away painful, expensive, and risky, resulting in high enterprise retention and pricing power.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In business model risk management, what is 'Customer Concentration Risk' and what is the standard enterprise governance threshold?",
      options: [
        "Having too many small customers",
        "Customers who complain too often",
        "Customers located in the same city",
        "When a single customer accounts for more than 15% of total annual company revenue, leaving the business severely vulnerable to catastrophic loss if that client churns"
      ],
      correct_option_index: 3,
      explanation: "Customer concentration $>15\%$ creates existential risk if that key client terminates their contract.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In self-reinforcing growth engines, how does the Amazon Virtuous Cycle (Flywheel) sustain competitive price leadership?",
      options: [
        "By borrowing unlimited money from banks",
        "Lower prices attract customer traffic, attracting 3rd-party sellers, expanding product selection, scaling fixed logistics infrastructure, lowering unit operating cost structures, which funds even lower prices",
        "By paying suppliers in company stock",
        "By avoiding all marketing expenditures"
      ],
      correct_option_index: 1,
      explanation: "The flywheel drives scale economies that lower cost structures, enabling lower consumer prices in a self-reinforcing loop.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Open-Core business models (e.g. MongoDB, GitLab, Elastic), how do companies commercialize free open-source software?",
      options: [
        "By deleting the open-source code",
        "By charging users for technical support only",
        "By keeping the core software engine free and open-source to drive massive developer adoption, while charging enterprises for proprietary security, role-based access control (RBAC), multi-region clustering, and compliance modules",
        "By selling physical t-shirts"
      ],
      correct_option_index: 2,
      explanation: "Open-core commercializes enterprise security, compliance, and multi-node clustering on top of a free open-source engine.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In business financial modeling, why is the 'Cost-Plus Pricing' method structurally flawed for technology startups?",
      options: [
        "Because software marginal cost is near zero, cost-plus forces artificially low prices that surrender enormous consumer surplus and fail to capture the massive economic ROI generated for buyers",
        "Because software cannot be priced",
        "Because cost-plus is banned by the SEC",
        "Because customers refuse to pay for software"
      ],
      correct_option_index: 0,
      explanation: "Cost-plus fails for software because marginal delivery costs are near zero, leaving massive customer economic value on the table.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #89.");
  console.log("Skill #89 update completed successfully!");
}

run();
