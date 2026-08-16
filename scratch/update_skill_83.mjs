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

const skillId = "c36c8a2f-da33-46de-ad33-9e18993562d1";

async function run() {
  console.log("Updating Skill #83: Competitor & Market Research (9 steps across 3 tracks)...");

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

  // Ensure exactly 3 tracks exist
  while (tracks.length < 3) {
    const { data: newTrack } = await supabase
      .from("tracks")
      .insert({
        skill_id: skillId,
        title: `Track ${tracks.length + 1}: Competitor & Market Research`,
        order_index: tracks.length + 1
      })
      .select()
      .single();
    tracks.push(newTrack);
  }

  tracks.sort((a, b) => a.order_index - b.order_index);

  const track1Id = tracks[0].id;
  const track2Id = tracks[1].id;
  const track3Id = tracks[2].id;

  // Update Track titles
  await supabase.from("tracks").update({ title: "Track 1: Market Sizing, Industry Economics and Structural Forces" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Digital Reconnaissance, Telemetry and Win-Loss Analysis" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Sales Battlecards, Positioning Matrices and Blue Ocean Strategy" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Corporate Strategy & Market Intelligence Director level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Market Sizing: TAM, SAM, SOM and Bottom-Up Modeling",
      order_index: 1,
      content: `### Quantitative Market Sizing Methodologies

1. Market Sizing Taxonomy:
   - Total Addressable Market (TAM): Total global demand for a product category.
     - Bottom-Up Formula: TAM = (Total Qualified Accounts in Target ICP) * (Annual Contract Value ACV). Bottom-up sizing is rigorous and verifiable compared to speculative top-down macro analyst reports.
   - Serviceable Addressable Market (SAM): The segment of TAM reachable through existing distribution channels, geographic footprints, and product features.
   - Serviceable Obtainable Market (SOM): The realistic market share capture over 24 to 36 months based on current sales headcount and capital allocation.`
    },
    {
      track_id: track1Id,
      title: "Michael Porter's Five Forces and Industry Attractiveness",
      order_index: 2,
      content: `### Structural Industry Analysis and Moats

1. Porter's Five Forces Framework:
   - 1. Threat of New Entrants: Governed by economies of scale, network effects, and high capital switching barriers.
   - 2. Bargaining Power of Buyers: Elevated when customers have low switching costs or alternative commodity options.
   - 3. Bargaining Power of Suppliers: High when proprietary technologies or critical components are controlled by monopolies.
   - 4. Threat of Substitute Products: Non-direct alternatives that solve the same fundamental human problem.
   - 5. Competitive Rivalry: Price competition and margin erosion among incumbent rivals in mature markets.`
    },
    {
      track_id: track1Id,
      title: "PESTLE Analysis and Macro-Environmental Scanning",
      order_index: 3,
      content: `### Macro-Environmental Intelligence

1. The PESTLE Scanning Framework:
   - Political (international trade tariffs, regulatory barriers).
   - Economic (inflation rates, interest rate environments, enterprise IT budgets).
   - Social (remote workforce transitions, shifting cultural values).
   - Technological (advancements in generative AI, cloud computing, automation).
   - Legal (GDPR, EU AI Act, antitrust compliance).
   - Environmental (carbon neutrality goals, sustainable packaging mandates).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Digital Competitive Reconnaissance and Media Intelligence",
      order_index: 1,
      content: `### Digital Reverse Engineering and Competitive Auditing

1. Digital Intelligence Telemetry:
   - Search Gap Analysis (Semrush / Ahrefs): Identifying high-intent keyword gaps, competitor paid ad bidding strategies, and organic backlinks.
   - Ad Creative Scraping (Meta Ad Library, Google Ads Transparency Center): Evaluating active creative angles, hooks, and identifying long-running ads (>90 days) indicating profitable conversion engines.
   - Technology Stack Profiling (BuiltWith / Wappalyzer): Auditing competitor CDNs, CRM integrations, and payment gateways.`
    },
    {
      track_id: track2Id,
      title: "Win-Loss Analysis and Customer Buying Interviews",
      order_index: 2,
      content: `### Primary Qualitative Decision Auditing

1. Unbiased Win-Loss Methodology (Clozd Framework):
   - Conducting structured, third-party post-purchase interviews with both closed-won and closed-lost enterprise buyers.

2. Core Diagnostic Evaluation Criteria:
   - Product Capabilities: Were specific features missing or perceived as inferior?
   - Pricing & Packaging: Was pricing transparent, flexible, and perceived as fair?
   - Sales Execution: Did the sales engineering team build trust and act consultatively?
   - Competitor Counter-Claims: What specific FUD (fear, uncertainty, doubt) did rivals introduce?`
    },
    {
      track_id: track2Id,
      title: "Pricing Intelligence and Commercial Packaging Audits",
      order_index: 3,
      content: `### Monetization Audits and Packaging Mechanics

1. Competitive Pricing Deconstruction:
   - Auditing metric alignment (per-seat, per-API call, usage-based consumption vs flat subscription).
   - Identifying hidden add-on costs (enterprise SSO, premium support SLAs, data retention fees).
   - Mapping price-to-value elasticity curves across low-end and enterprise competitor tiers.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Enterprise Sales Battlecard Architecture",
      order_index: 1,
      content: `### Actionable Competitive Enablement for Revenue Teams

1. Core Battlecard Anatomy:
   - Quick Competitor Summary & Pricing Model.
   - \"Where We Win\" (Core differentiated product strengths).
   - \"Where We Lose\" (Known product gaps with honest de-escalation scripts).
   - Landmine Questions: Strategic questions sales reps teach prospects to ask competitors during evaluations (e.g. \"Ask them how their system handles multi-region failover under heavy write load\").
   - Objection Handling Response Matrix.`
    },
    {
      track_id: track3Id,
      title: "2x2 Positioning Matrices and Perceptual Mapping",
      order_index: 2,
      content: `### Perceptual White Space Identification

1. Designing 2x2 Positioning Maps:
   - Selecting two independent, highly strategic axes representing true buyer decision criteria (e.g. Developer Autonomy vs Enterprise Governance; Lightweight Agility vs Full-Suite Complexity).
   - Plotting incumbent competitors to uncover uncrowded \"white space\" market opportunities for new product positioning.`
    },
    {
      track_id: track3Id,
      title: "Blue Ocean Strategy and the ERRC Four-Actions Grid",
      order_index: 3,
      content: `### Value Innovation and Uncontested Market Creation

1. Red Ocean vs Blue Ocean:
   - Red Oceans: Crowded, cut-throat commodity markets where rivals fight for market share.
   - Blue Oceans: Creating uncontested market space, unlocking new demand and rendering competition irrelevant.

2. The ERRC Four-Actions Grid:
   - Eliminate: Which factors that the industry takes for granted should be eliminated?
   - Reduce: Which factors should be reduced well below industry standards?
   - Raise: Which factors should be raised well above industry standards?
   - Create: Which factors should be created that the industry has never offered?`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #83.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In quantitative market sizing, what is the 'Bottom-Up' mathematical formula to calculate Total Addressable Market (TAM)?",
      options: [
        "TAM = Website Visitors * Bounce Rate",
        "TAM = Total Employees * Office Rent",
        "TAM = (Total Number of Qualified Customer Accounts in ICP) * (Annual Contract Value ACV)",
        "TAM = Gross Margin - Ad Spend"
      ],
      correct_option_index: 2,
      explanation: "Bottom-up TAM calculates total demand directly from verifiable target account counts multiplied by expected annual deal size.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In Michael Porter's Five Forces framework, which force evaluates how easily new competing companies can enter an industry?",
      options: [
        "Threat of New Entrants (Barriers to Entry)",
        "Bargaining Power of Buyers",
        "Threat of Substitute Products",
        "Bargaining Power of Suppliers"
      ],
      correct_option_index: 0,
      explanation: "Threat of New Entrants analyzes how barriers such as capital requirements, patents, and network effects protect market incumbents.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In enterprise sales enablement, what is a 'Sales Battlecard'?",
      options: [
        "A board game played in office lobbies",
        "A business credit card for sales lunches",
        "A certificate of completion",
        "A concise, structured reference document arming sales reps with competitor strengths, weaknesses, objection handling, and landmine questions"
      ],
      correct_option_index: 3,
      explanation: "Battlecards provide tactical competitive counter-intelligence, objection handling, and positioning points for sales reps.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In competitor ad intelligence, why is discovering an ad creative that has run continuously for over 90 days in the Meta Ad Library significant?",
      options: [
        "It means the marketing team forgot their password",
        "It indicates the ad creative is a highly profitable, proven conversion winner that generates positive ROI (otherwise the brand would have turned it off)",
        "It means the ad was rejected by moderators",
        "It proves the ad cost zero dollars"
      ],
      correct_option_index: 1,
      explanation: "Advertisers do not spend money on failing ads for months; a 90+ day active ad is a confirmed high-converting asset.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In market sizing taxonomy, what does 'SOM' stand for?",
      options: [
        "System Output Module",
        "Standard Operating Margin",
        "Serviceable Obtainable Market (the realistic market share capture over 2-3 years)",
        "Social Optimization Model"
      ],
      correct_option_index: 2,
      explanation: "SOM represents the specific realistic share of the market that your company can capture in the near term with current resources.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In primary market intelligence, what is the primary objective of conducting third-party 'Win-Loss Analysis' interviews?",
      options: [
        "To sue losing customers",
        "To gather unbiased qualitative feedback from closed-won and closed-lost prospects about product gaps, pricing transparency, and competitor claims",
        "To offer refunds to happy customers",
        "To delete lost opportunities from the CRM"
      ],
      correct_option_index: 1,
      explanation: "Win-loss interviews reveal unfiltered reasons why buyers selected or rejected a solution, highlighting real product and sales gaps.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Blue Ocean Strategy, what are the four strategic actions analyzed in the 'ERRC' Grid to achieve value innovation?",
      options: [
        "Earn, Return, Reinvest, Capitalize",
        "Engage, Retain, Reach, Convert",
        "Evaluate, Report, Record, Calculate",
        "Eliminate, Reduce, Raise, and Create"
      ],
      correct_option_index: 3,
      explanation: "The ERRC grid asks which factors to Eliminate, Reduce, Raise, and Create to differentiate and break industry trade-offs.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In competitive sales battlecards, what are 'Landmine Questions'?",
      options: [
        "Strategic open-ended questions that sales reps teach prospects to ask competitor vendors during demos to expose known structural weaknesses in the rival's product",
        "Insulting questions asked during job interviews",
        "Questions about office locations",
        "Trivia questions about competitor history"
      ],
      correct_option_index: 0,
      explanation: "Landmine questions prompt prospects to probe rivals on areas where your product is superior and the competitor is weak.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In Michael Porter's Five Forces, how does the 'Threat of Substitute Products' differ from direct competitive rivalry?",
      options: [
        "Substitutes only exist in retail stores",
        "Direct competitors have higher prices",
        "Substitutes come from outside the traditional industry and perform the same core function through a completely different technological or procedural approach (e.g. Zoom replacing business travel)",
        "There is zero difference"
      ],
      correct_option_index: 2,
      explanation: "Substitutes solve the underlying customer problem using an entirely different category or method, disrupting industry boundaries.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In macro-environmental market analysis, what do the letters in the 'PESTLE' framework represent?",
      options: [
        "Product, Engineering, Sales, Testing, Legal, Enterprise",
        "Political, Economic, Social, Technological, Legal, and Environmental",
        "Pricing, Evaluation, Strategy, Tactics, Logistics, Execution",
        "Planning, Estimating, Sizing, Tracking, Launching, Expanding"
      ],
      correct_option_index: 1,
      explanation: "PESTLE analyzes Political, Economic, Social, Technological, Legal, and Environmental forces shaping markets.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "In perceptual market mapping, what makes a 2x2 Positioning Matrix effective for discovering market 'White Space'?",
      options: [
        "Using colors that match the company logo",
        "Plotting every company in the top right corner",
        "Using axes that are identical to each other",
        "Selecting two independent, mutually exclusive decision criteria (e.g. Developer Autonomy vs Enterprise Governance) to reveal uncrowded market quadrants where buyer needs remain unmet"
      ],
      correct_option_index: 3,
      explanation: "Independent axes provide orthogonal perspectives on customer priorities, exposing unserved market niches with high demand.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In SaaS competitor monetization analysis, why is auditing a competitor's pricing metric alignment (e.g. per-seat vs usage-based consumption) critical?",
      options: [
        "It reveals their cost scaling dynamics, helping sales position your solution against their hidden price penalties as customer usage expands",
        "It shows how much sales tax they pay",
        "It reveals their bank account numbers",
        "All SaaS companies use identical pricing"
      ],
      correct_option_index: 0,
      explanation: "Pricing metric analysis uncovers hidden expansion friction in competitor models, allowing reps to position fair, predictable pricing.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In competitive intelligence ethics and corporate strategy, what constitutes legal competitive intelligence versus illegal corporate espionage?",
      options: [
        "Looking at competitor websites is illegal",
        "All competitor research is illegal",
        "Gathering publicly available data, ad libraries, patent filings, job postings, and voluntary customer interviews is legal intelligence; hacking servers, wiretapping, or violating non-disclosure agreements (NDAs) is illegal espionage",
        "Paying competitors for trade secrets is always legal"
      ],
      correct_option_index: 2,
      explanation: "Competitive intelligence relies on open-source intelligence (OSINT) and legal public research, never illicit data theft or NDA breach.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Blue Ocean Strategy, how does 'Value Innovation' fundamentally break the traditional trade-off between differentiation and low cost?",
      options: [
        "By firing the entire marketing department",
        "By eliminating and reducing factors an industry competes on to lower costs, while raising and creating new value factors buyers value, achieving both lower cost and high differentiation simultaneously",
        "By copying competitors exactly",
        "By giving products away for free"
      ],
      correct_option_index: 1,
      explanation: "Value innovation simultaneously drives down costs by eliminating unnecessary features while raising unprecedented value for customers.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In SEO competitor intelligence, what is a 'Keyword Gap Analysis'?",
      options: [
        "Comparing your domain's organic and paid keyword rankings against top competitors to identify high-volume, transactional search queries where competitors rank on Page 1 but your domain does not",
        "Deleting missing keywords from a blog post",
        "Searching for words with typos on Google",
        "Counting the number of spaces in an article"
      ],
      correct_option_index: 0,
      explanation: "Keyword gap analysis identifies lucrative search terms driving traffic to competitors that your site has not yet targeted.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #83.");
  console.log("Skill #83 update completed successfully!");
}

run();
