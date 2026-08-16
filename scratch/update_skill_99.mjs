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

const skillId = "b2e5d72a-19ab-4e39-a1f9-dad5a62187b7";

async function run() {
  console.log("Updating Skill #99: ESG Reporting Basics (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: ESG Standards Architecture, GRI, SASB/ISSB and Double Materiality" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Regulatory Disclosures: EU CSRD, TCFD and SEC Climate Rules" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: ESG Rating Agencies, Anti-Greenwashing and Data Governance" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Global ESG Director & Sustainability Regulatory Counsel level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Global Reporting Landscape: GRI vs SASB vs ISSB",
      order_index: 1,
      content: `### Global Sustainability Disclosure Standards

1. GRI (Global Reporting Initiative):
   - Multi-stakeholder reporting standard evaluating an organization's outward economic, environmental, and human rights impacts on society.

2. SASB / IFRS ISSB Frameworks:
   - SASB: 77 industry-specific standards focusing strictly on enterprise financial materiality.
   - IFRS Sustainability Standards (ISSB S1 and S2): Global baseline consolidating SASB and TCFD into standardized capital market disclosures.`
    },
    {
      track_id: track1Id,
      title: "Double Materiality: Financial vs Impact Materiality",
      order_index: 2,
      content: `### The Double Materiality Matrix (EU CSRD)

1. Dual Materiality Dimensions:
   - Financial Materiality (Outside-In): How environmental and social risks (extreme weather, transition costs) impact company cash flows, valuations, and cost of capital.
   - Impact Materiality (Inside-Out): How business operations and value chains impact external ecosystems, climate, and human communities.
   - An issue is material if it meets the threshold on either dimension.`
    },
    {
      track_id: track1Id,
      title: "Stakeholder Engagement Protocols and Governance",
      order_index: 3,
      content: `### Stakeholder Consultation and Matrix Construction

1. Systematic Stakeholder Consultation:
   - Engaging primary stakeholders (institutional investors, employees, supply chain partners, local communities, NGOs) through structured surveys, focus groups, and executive materiality workshops.

2. Materiality Thresholds:
   - Plotting issues on a 2x2 matrix to prioritize corporate ESG disclosures and capital allocation.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "EU Corporate Sustainability Reporting Directive (CSRD) & ESRS",
      order_index: 1,
      content: `### European Regulatory Mandates and ESRS Standards

1. EU CSRD Architecture:
   - Replaces NFRD, mandating comprehensive ESG disclosures for over 50,000 companies and multinational corporations with major EU revenues.

2. European Sustainability Reporting Standards (ESRS):
   - 12 sector-agnostic standards across Environmental (E1-E5: Climate, Pollution, Water, Biodiversity, Circular Economy), Social (S1-S4: Workforce, Value Chain, Communities, Consumers), and Governance (G1: Business Conduct).
   - Mandatory machine-readable digital tagging (ESEF/iXBRL).`
    },
    {
      track_id: track2Id,
      title: "Task Force on Climate-related Financial Disclosures (TCFD)",
      order_index: 2,
      content: `### Climate Governance and Scenario Analysis

1. The 4 TCFD Pillars:
   - Governance: Board oversight and management accountability for climate risks.
   - Strategy: Physical climate risks (extreme storms, sea-level rise) vs Transition risks (carbon taxes, policy mandates) modeled across 1.5C, 2C, and 4C warming scenarios.
   - Risk Management: Integration into Enterprise Risk Management (ERM).
   - Metrics & Targets: Scope 1, 2, and 3 GHG disclosures.`
    },
    {
      track_id: track2Id,
      title: "US SEC Climate-Related Disclosures and Global Mandates",
      order_index: 3,
      content: `### Global Regulatory Convergence and Capital Markets

1. US SEC Climate Disclosure Rules:
   - Mandating audited disclosures of material climate risks, severe weather financial impacts in 10-K footnote filings, and Scope 1/2 emissions for Large Accelerated Filers.

2. California Climate Mandates (SB 253 / SB 261):
   - Requiring full Scope 1, 2, and 3 disclosures and climate risk reporting for all large companies doing business in California.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Major ESG Rating Methodologies (MSCI, Sustainalytics, CDP)",
      order_index: 1,
      content: `### Institutional ESG Scores and Rating Agency Mechanics

1. MSCI ESG Ratings:
   - Grades companies on a letter scale from AAA (Industry Leader) down to CCC (Laggard), evaluating unmanaged ESG risks relative to industry peers.

2. Morningstar Sustainalytics:
   - Evaluates Unmanaged ESG Risk Scores from 0-10 (Negligible) up to 40+ (Severe Risk).

3. CDP Environmental Questionnaires:
   - Grades disclosure transparency and action from A (Leadership) to F across Climate Change, Water Security, and Forests.`
    },
    {
      track_id: track3Id,
      title: "EU Green Claims Directive, Greenwashing and Legal Risks",
      order_index: 2,
      content: `### Anti-Greenwashing Regulations and Legal Compliance

1. Greenwashing Typologies:
   - Selective disclosure (\"cherry-picking\"), vague unsubstantiated claims (\"eco-friendly\", \"all-natural\"), and claiming \"carbon neutral\" status through unverified cheap avoidance offsets.

2. Regulatory Enforcement (EU Green Claims Directive & UK CMA):
   - Prohibiting generic environmental claims without verifiable third-party scientific life cycle assessments, subjecting violators to severe turnover fines.`
    },
    {
      track_id: track3Id,
      title: "ESG Data Governance, Internal Controls and Audit Software",
      order_index: 3,
      content: `### Internal Controls and Digital Reporting Platforms

1. COSO ICSR Internal Controls:
   - Establishing Internal Control over Sustainability Reporting (ICSR) with strict segregation of duties, source document trails, and automated approval workflows.

2. Cloud ESG Platforms (Workiva, Novata):
   - Centralizing automated data collection from ERPs and utility meters, maintaining audit trails for external assurance providers.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #99.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "What does the acronym 'ESG' stand for in corporate reporting and sustainable finance?",
      options: [
        "Economic, Social, Growth",
        "Environmental, Social, and Governance",
        "Energy, Sustainability, Global",
        "Executive, Shareholder, General"
      ],
      correct_option_index: 1,
      explanation: "ESG stands for Environmental, Social, and Governance, the three non-financial pillars used to evaluate corporate sustainability.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In European sustainability regulation, what does the 'CSRD' stand for?",
      options: [
        "Customer Service and Retail Development",
        "Central Securities Registry Directive",
        "Corporate Safety and Risk Database",
        "Corporate Sustainability Reporting Directive"
      ],
      correct_option_index: 3,
      explanation: "The CSRD is the European Union directive establishing mandatory sustainability reporting rules for large companies.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What are the 4 core structural pillars established by the Task Force on Climate-related Financial Disclosures (TCFD)?",
      options: [
        "Governance, Strategy, Risk Management, and Metrics & Targets",
        "Advertising, Pricing, Product, and Promotion",
        "Assets, Liabilities, Equity, and Revenue",
        "Hiring, Training, Compensation, and Benefits"
      ],
      correct_option_index: 0,
      explanation: "The TCFD framework organizes climate reporting across Governance, Strategy, Risk Management, and Metrics & Targets.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What rating scale does MSCI ESG Ratings use to benchmark a company's sustainability performance against industry peers?",
      options: [
        "1 to 5 stars",
        "Pass or Fail",
        "Letter scale from AAA (Leader) to CCC (Laggard)",
        "0% to 100% discount"
      ],
      correct_option_index: 2,
      explanation: "MSCI ESG Ratings grade companies from AAA (industry leader) down to CCC (laggard).",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In sustainability terminology, what is 'Greenwashing'?",
      options: [
        "Washing solar panels with water",
        "The deceptive practice of making misleading, exaggerated, or unsubstantiated environmental claims to appear more sustainable than the company actually is",
        "Planting trees around a factory",
        "Painting corporate offices green"
      ],
      correct_option_index: 1,
      explanation: "Greenwashing is making false, vague, or exaggerated environmental claims to mislead consumers and investors.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "Under the EU CSRD and European Sustainability Reporting Standards (ESRS), what is 'Double Materiality'?",
      options: [
        "Auditing financial statements twice a year",
        "Reporting emissions in two different languages",
        "Evaluating both Financial Materiality (how ESG risks affect company profits/value) AND Impact Materiality (how company operations impact people and the environment)",
        "Paying double taxes on carbon emissions"
      ],
      correct_option_index: 2,
      explanation: "Double Materiality requires assessing both outside-in financial impacts on the firm and inside-out operational impacts on society.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "What is the primary difference in target audience and reporting focus between GRI and SASB standards?",
      options: [
        "GRI focuses on multi-stakeholder impact on the broader world; SASB focuses strictly on financially material ESG topics relevant to institutional investors",
        "GRI is for charities only; SASB is for governments",
        "SASB is only for European companies",
        "There is zero difference between them"
      ],
      correct_option_index: 0,
      explanation: "GRI serves broad societal stakeholders on external impact; SASB focuses on enterprise value creation for capital providers.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "Under the TCFD climate reporting framework, what are 'Transition Risks'?",
      options: [
        "Risks of moving office locations",
        "Risks of employee job transitions",
        "Risks of changing website software",
        "Financial and operational risks arising from the shift toward a low-carbon economy (e.g. carbon pricing policies, technology obsolescence, and litigation)"
      ],
      correct_option_index: 3,
      explanation: "Transition risks encompass regulatory, policy, technological, and market changes required during the transition to a low-carbon economy.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In ESG rating agency analytics, how does Morningstar Sustainalytics score corporate ESG risk?",
      options: [
        "From A+ to F-",
        "An Unmanaged ESG Risk Score scale from 0-10 (Negligible Risk) up to 40+ (Severe Risk), where lower numerical scores represent lower risk",
        "By counting the number of trees planted",
        "By measuring employee average age"
      ],
      correct_option_index: 1,
      explanation: "Sustainalytics scores unmanaged ESG risk on a numerical scale where lower scores represent lower risk (0-10 Negligible, 40+ Severe).",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What does the International Sustainability Standards Board (ISSB), created by the IFRS Foundation, accomplish?",
      options: [
        "It replaces all global stock exchanges",
        "It bans fossil fuels worldwide",
        "It establishes a unified global baseline for sustainability-related financial disclosures (IFRS S1 and S2) consolidating SASB and TCFD into investor-grade reporting",
        "It sets corporate salary caps"
      ],
      correct_option_index: 2,
      explanation: "ISSB creates a unified global baseline of sustainability disclosures (IFRS S1 & S2) integrating SASB and TCFD.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "Under the EU Green Claims Directive and UK CMA Green Claims Code, what deceptive marketing claim is explicitly targeted for prohibition?",
      options: [
        "Claiming a product is 'Carbon Neutral' or 'Climate Positive' based solely on purchasing unverified, cheap carbon avoidance offset credits rather than actual supply chain emissions reduction",
        "Printing product ingredients on food labels",
        "Using recyclable cardboard packaging",
        "Listing product weight in grams"
      ],
      correct_option_index: 0,
      explanation: "Regulators prohibit claims of 'carbon neutrality' relying on cheap unverified offsets, requiring real emissions reductions and LCA proofs.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In CSRD reporting compliance, what format requirement is mandated for published sustainability statements under European ESEF rules?",
      options: [
        "Handwritten paper reports only",
        "Audio podcast recordings",
        "Encrypted PDF documents",
        "Machine-readable digital tagging using Inline XBRL (iXBRL / ESEF taxonomy) embedded directly within the company's annual management report"
      ],
      correct_option_index: 3,
      explanation: "CSRD requires digital XHTML reports tagged with iXBRL to enable automated data scraping by financial analysts and regulators.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In corporate governance, what does COSO ICSR (Internal Control over Sustainability Reporting) establish?",
      options: [
        "A game played by accountants",
        "An enterprise internal control framework providing verifiable audit trails, data reconciliation, and segregation of duties for ESG metrics equivalent to Sarbanes-Oxley (SOX) financial controls",
        "A computer operating system",
        "A tax calculation formula"
      ],
      correct_option_index: 1,
      explanation: "COSO ICSR applies rigorous financial-grade internal controls to non-financial sustainability metrics for audit readiness.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In TCFD climate scenario analysis, what is the purpose of stress-testing corporate business models against a '2°C or lower Scenario' versus a '4°C Business-As-Usual Scenario'?",
      options: [
        "To predict exact stock prices next week",
        "To test office heating systems",
        "A 2°C scenario evaluates heavy transition risks (aggressive carbon pricing and regulatory restrictions), while a 4°C scenario evaluates catastrophic physical risks (extreme storms, asset inundation, supply chain collapse)",
        "To eliminate all corporate taxes"
      ],
      correct_option_index: 2,
      explanation: "Scenario analysis reveals divergent risk profiles: 2C tests policy and market transition risks; 4C tests severe physical disruption.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In CDP environmental reporting, what criteria must a company meet to earn a spot on the prestigious annual 'CDP A-List'?",
      options: [
        "Demonstrating exhaustive transparent disclosure, setting verified SBTi 1.5°C science-based targets, exhibiting active absolute emissions reductions, and governing climate risks at the board level",
        "Paying a $1,000,000 application fee",
        "Having the largest stock market valuation",
        "Being located in London"
      ],
      correct_option_index: 0,
      explanation: "CDP A-List requires comprehensive disclosure, verified science-based targets, and documented absolute decarbonization progress.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #99.");
  console.log("Skill #99 update completed successfully!");
}

run();
