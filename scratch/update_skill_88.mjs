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

const skillId = "18626102-0439-482a-bb90-5d8c5b542344";

async function run() {
  console.log("Updating Skill #88: Idea Validation (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Customer Discovery, Problem Interviews and The Mom Test" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Quantitative Smoke Testing, Fake Door MVPs and Pre-Sales" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Synthesis, Pivot Decisions and Product-Market Fit Signals" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Venture Capital & Startup Founder level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Rob Fitzpatrick's The Mom Test and Unbiased Problem Discovery",
      order_index: 1,
      content: `### Customer Interview Methodology and Bias Elimination

1. The Three Rules of The Mom Test (Rob Fitzpatrick):
   - 1. Talk about their life and past behaviors instead of your hypothetical idea.
   - 2. Ask about specific instances and actual dollars spent in the past rather than generic opinions or hypothetical promises (\"Would you buy X?\").
   - 3. Talk less and listen more; compliments are the biggest red flag in user research (they indicate polite disinterest rather than genuine commercial intent).`
    },
    {
      track_id: track1Id,
      title: "Identifying Hair-on-Fire Problems and Economic Pain",
      order_index: 2,
      content: `### Problem Qualification and Urgency Diagnosis

1. Vitamin vs Painkiller Classification:
   - Vitamins (Nice-to-Have): Improve convenience or status, but customers will cancel during budget downturns.
   - Painkillers (Must-Have): Solve active, financially painful \"hair-on-fire\" bottlenecks.

2. Empirical Signals of Acute Pain:
   - The prospect has already allocated budget to solve the issue.
   - The prospect has hacked together cumbersome DIY solutions (complex Excel spreadsheets, fragile Zapier chains).
   - Inaction results in direct financial loss or regulatory non-compliance.`
    },
    {
      track_id: track1Id,
      title: "Jobs-to-be-Done (JTBD) Theory and Customer Empathy Mapping",
      order_index: 3,
      content: `### Functional, Emotional and Social Job Dimensions

1. Clayton Christensen's Jobs-to-be-Done (JTBD) Framework:
   - Customers do not buy products; they \"hire\" products to make progress in specific circumstances.

2. The 3 Core Job Dimensions:
   - Functional Job: The practical, tactical task to complete (e.g. reconcile bank statements in 5 minutes).
   - Emotional Job: How the user wants to feel (e.g. confident, relieved, stress-free during audits).
   - Social Job: How the user wants to be perceived by peers and management (e.g. appearing competent and organized).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Smoke Test Landing Pages and Fake Door Experiments",
      order_index: 1,
      content: `### Quantitative Pre-Product Demand Validation

1. Fake Door / Smoke Test Methodology:
   - Deploying a professional landing page showcasing value propositions, feature breakdowns, and explicit pricing tiers before building software.
   - Measuring conversion intent: When visitors click \"Order Now\" or \"Start Free Trial\", displaying a polite modal: \"We are currently onboarding early cohorts. Enter your email to join the priority beta queue.\"
   - Benchmarks: A >5% click-to-intent rate from cold targeted traffic validates viable market interest.`
    },
    {
      track_id: track2Id,
      title: "Skin-in-the-Game Validation: Pre-Orders and LOIs",
      order_index: 2,
      content: `### Financial Commitment as Absolute Truth

1. Letters of Intent (LOI) in B2B:
   - Securing signed non-binding LOIs from enterprise decision-makers stating: \"If Company X builds features A, B, and C by Date Y, we intend to pilot at $Z annual contract value.\"

2. B2C Refundable Pre-Orders:
   - Collecting $10 to $100 deposits via Stripe before manufacturing or engineering. Cash commitment is the only unambiguous proof of genuine commercial willingness to pay.`
    },
    {
      track_id: track2Id,
      title: "Concierge and Wizard of Oz MVPs",
      order_index: 3,
      content: `### Low-Code Manual Minimum Viable Products

1. Concierge MVP:
   - Manually performing the service for early clients in-person or via email with zero software automation, learning the nuances of customer workflow directly.

2. Wizard of Oz MVP (Flintstoning):
   - Presenting an automated-looking front-end interface to the user while humans manually execute the backend operations behind the curtain (e.g. Zappos founder photographing shoes in local stores), validating demand before writing backend code.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Customer Discovery Synthesis and Opportunity Scoring",
      order_index: 1,
      content: `### Quantitative Gap Analysis and White Space Mapping

1. Anthony Ulwick's Opportunity Algorithm:
   - Opportunity Score = Importance + MAX(Importance - Satisfaction, 0).
   - Surveying target users on a 1-to-10 scale for Importance of an outcome and Satisfaction with current solutions.
   - Opportunity Scores > 12 identify severe market underservice and high-probability venture opportunities.`
    },
    {
      track_id: track3Id,
      title: "The Pivot Decision Framework: Lean Startup Cycles",
      order_index: 2,
      content: `### Build-Measure-Learn Feedback Loops and Pivot Archetypes

1. Validated Learning vs Vanity Metrics:
   - Measuring actionable cohort retention and revenue instead of cumulative registered users.

2. Pivot Archetypes:
   - Customer Segment Pivot: Product solves a real problem, but for a different audience than originally envisioned.
   - Zoom-In Feature Pivot: Refocusing the entire product architecture onto a single standout high-engagement feature.
   - Value Capture Pivot: Changing monetization model (e.g. shifting from advertising to SaaS subscription).`
    },
    {
      track_id: track3Id,
      title: "Sean Ellis 40% Rule and Leading Indicators of PMF",
      order_index: 3,
      content: `### Product-Market Fit Benchmarks and Retention Curves

1. The Sean Ellis PMF Survey Benchmark:
   - Asking active users: \"How would you feel if you could no longer use this product?\"
     - A. Very disappointed
     - B. Somewhat disappointed
     - C. Not disappointed
   - Reaching >= 40% answering \"Very disappointed\" is the universal empirical leading indicator of Sustainable Product-Market Fit (PMF).

2. Flattening Cohort Retention Curves:
   - Long-term cohort retention graphs stabilizing into a horizontal plateau indicate true market fit.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #88.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "According to Rob Fitzpatrick's 'The Mom Test', what type of questions should you avoid asking during customer discovery interviews?",
      options: [
        "Hypothetical future questions and opinion-seeking questions (e.g. 'Would you buy a product that does X?')",
        "Questions about specific past purchases",
        "Questions about current software tools used",
        "Questions about how much time a process takes"
      ],
      correct_option_index: 0,
      explanation: "The Mom Test warns that hypothetical future questions invite polite lies; you must ask about past behavior instead.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What empirical leading indicator benchmark established by Sean Ellis indicates that a startup has achieved Product-Market Fit (PMF)?",
      options: [
        "Having 1,000 Twitter followers",
        "Raising $5,000,000 from venture capitalists",
        "At least 40% of surveyed active users stating they would be 'Very Disappointed' if the product disappeared tomorrow",
        "Winning a business pitch competition"
      ],
      correct_option_index: 2,
      explanation: "The Sean Ellis 40% 'Very Disappointed' benchmark is the gold standard leading metric for Product-Market Fit.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In startup validation terminology, what is a 'Fake Door' (Smoke Test) experiment?",
      options: [
        "A broken door in an office building",
        "A landing page showcasing a product, pricing, and a 'Buy / Join Beta' button to measure real click-through conversion intent before developing the actual product",
        "Selling counterfeit software",
        "An exit door in a retail store"
      ],
      correct_option_index: 1,
      explanation: "Smoke tests present the offer upfront to quantify real buyer demand and willingness to click before building software.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In Clayton Christensen's Jobs-to-be-Done (JTBD) theory, what is the core premise regarding why customers purchase products?",
      options: [
        "Customers buy products based purely on logo colors",
        "Customers buy products because they are forced by government regulations",
        "Customers only buy products that are advertised on television",
        "Customers 'hire' products to make progress in a specific struggle or achieve a functional, emotional, or social job"
      ],
      correct_option_index: 3,
      explanation: "JTBD asserts that customers hire products to solve specific functional, emotional, and social jobs in their lives.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In startup validation, what is a 'Wizard of Oz' MVP?",
      options: [
        "A product that appears fully automated to the end user on the frontend, but has its backend processes manually executed by human workers behind the scenes",
        "A movie streaming website",
        "A magical computer program",
        "A video game with wizards"
      ],
      correct_option_index: 0,
      explanation: "Wizard of Oz MVPs simulate automation through manual human effort behind the scenes to validate demand before investing in code.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In customer discovery, why are verbal compliments (e.g. 'That sounds like a great idea!') considered a dangerous red flag by user researchers?",
      options: [
        "Compliments are illegal in research",
        "They make the founder too confident",
        "They mean the interview was too short",
        "Compliments are polite deflections that cost the prospect nothing, providing false positive validation while disguising a lack of genuine commercial intent"
      ],
      correct_option_index: 3,
      explanation: "Compliments are cheap and often disguise disinterest; true validation requires commitments of time, reputation, or money.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In B2B enterprise validation, what is a non-binding 'Letter of Intent' (LOI)?",
      options: [
        "A love letter to a company",
        "A formal statement signed by an enterprise buyer expressing intent to purchase or pilot the software at a specified price once specific features are built",
        "A job application form",
        "A tax declaration document"
      ],
      correct_option_index: 1,
      explanation: "Signed LOIs provide enterprise validation, proving that buyers will commit budget if product requirements are met.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In Anthony Ulwick's Outcome-Driven Innovation, what does the Opportunity Score formula (Opportunity = Importance + MAX(Importance - Satisfaction, 0)) measure?",
      options: [
        "It quantifies market underservice by finding high-importance customer outcomes that currently have low market satisfaction",
        "The salary of the CEO",
        "The price of cloud servers",
        "The number of competitors in an industry"
      ],
      correct_option_index: 0,
      explanation: "High importance paired with low current satisfaction pinpoints underserved market opportunities with high willingness to pay.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In Lean Startup methodology, what constitutes a 'Zoom-In Feature Pivot'?",
      options: [
        "Buying a better camera lens",
        "Refocusing the entire company on marketing",
        "Refocusing the entire product architecture on a single high-performing feature that customers love, eliminating the rest of the bloated product",
        "Changing the company name"
      ],
      correct_option_index: 2,
      explanation: "A zoom-in pivot strips away peripheral features to build a dedicated product around the single standout feature users care about.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What strong behavioral signal proves that a prospective customer is experiencing a true 'Hair-on-Fire' problem?",
      options: [
        "They like your company LinkedIn page",
        "They agree to a free coffee meeting",
        "They have never thought about the problem before",
        "They have already allocated budget or cobbled together painful DIY workarounds (e.g. complex spreadsheets or multi-app Zapier hacks)"
      ],
      correct_option_index: 3,
      explanation: "Prospects actively hacking together messy DIY solutions prove acute, unsolved pain and active demand.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In Lean Startup analytics, what visual pattern in long-term customer cohort retention curves provides definitive mathematical proof of Product-Market Fit?",
      options: [
        "A curve that declines straight to 0% retention",
        "A curve that flattens out into a horizontal plateau parallel to the x-axis, demonstrating that a core cohort of users continues returning indefinitely",
        "A line that zig-zags erratically every week",
        "A vertical straight line"
      ],
      correct_option_index: 1,
      explanation: "A flattening retention curve proves that the product retains a stable baseline of engaged users over time, signaling true PMF.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In user research synthesis, how does a 'Concierge MVP' differ fundamentally from a 'Wizard of Oz MVP'?",
      options: [
        "Concierge MVPs cost millions of dollars",
        "Wizard of Oz MVPs are only used in hospitals",
        "In a Concierge MVP, the service is performed explicitly manually in the open with full transparency to the customer; in Wizard of Oz, manual labor is hidden behind an interface",
        "There is zero difference between them"
      ],
      correct_option_index: 2,
      explanation: "Concierge testing provides high-touch manual service transparently, while Wizard of Oz mimics automated software behind a UI.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In customer discovery interviews, what is the most effective way to validate whether a problem is severe enough to warrant building a startup?",
      options: [
        "Ask the interviewee: 'How did you attempt to solve this problem the last time it happened, and how much time and money did that attempt cost you?'",
        "Ask the interviewee: 'If we built an AI app for this, would you use it?'",
        "Ask the interviewee: 'Do you think this is a billion-dollar idea?'",
        "Ask the interviewee to invest in the company on the spot"
      ],
      correct_option_index: 0,
      explanation: "Probing specific past attempts and real expenditures reveals whether the pain is severe enough to command budget.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Lean Startup experimentation, why are 'Vanity Metrics' (e.g. cumulative registered users, total page views) dangerous during idea validation?",
      options: [
        "They make web servers run slowly",
        "They are difficult to calculate",
        "They are illegal under SEC guidelines",
        "They always increase over time regardless of whether the business is succeeding, masking poor retention, zero engagement, and unsustainable churn"
      ],
      correct_option_index: 3,
      explanation: "Vanity metrics create an illusion of traction while hiding poor retention and product rejection.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In business model hypothesis testing, what constitutes a 'Customer Segment Pivot'?",
      options: [
        "Firing all sales representatives",
        "Keeping the core product value proposition relatively intact, but redirecting marketing and sales toward a completely different customer persona who experiences far greater urgency",
        "Lowering prices by 90%",
        "Moving the company headquarters to another city"
      ],
      correct_option_index: 1,
      explanation: "A customer segment pivot targets a new, more desperate customer profile where the product delivers immediate, high-value utility.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #88.");
  console.log("Skill #88 update completed successfully!");
}

run();
