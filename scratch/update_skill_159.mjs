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

const skillId = "d4554c73-b65c-4c77-95f9-91b3437889be";

async function run() {
  console.log("Updating Skill #159: Client Needs Assessment & Sales (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Financial Needs Analysis, DIME and Buy-Sell Funding" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Consultative Structuring, Umbrella and Policy Bundling" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Market Conduct Ethics, Anti-Twisting and Policy Reviews" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / ChFC & Certified Insurance Counselor CIC level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Human Life Value vs Capital Needs Analysis Methods",
      order_index: 1,
      content: `### Quantitative Life Insurance Sizing

1. Human Life Value (HLV):
   - Discounting future net lifetime earnings (projected income minus taxes and self-maintenance costs) to present value using prevailing discount rates.

2. Capital Needs Analysis:
   - Calculating immediate cash requirements (final expenses, debts, estate liquidity) plus future income streams for surviving dependents.`
    },
    {
      track_id: track1Id,
      title: "The DIME Framework and Family Income Blackout Periods",
      order_index: 2,
      content: `### Comprehensive Fact-Finding Frameworks

1. The DIME Model:
   - Debt (consumer debt + final costs), Income (replacement multiplier e.g. 10x salary), Mortgage (home balance payoff), and Education (college tuition funds).

2. Social Security Blackout Period:
   - Funding the income gap between when youngest child turns 16 and surviving spouse reaches age 60.`
    },
    {
      track_id: track1Id,
      title: "Commercial Continuity: Key Person and Buy-Sell Agreements",
      order_index: 3,
      content: `### Business Succession and Entity Protection

1. Key Person Insurance:
   - Offsetting executive search costs, client disruption, and lost revenue caused by the death of a critical corporate leader.

2. Buy-Sell Agreements:
   - Structuring life-funded Cross-Purchase vs Entity-Purchase agreements to guarantee seamless ownership transfers among business partners.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Personal Umbrella Policies (PUP) and Excess Liability",
      order_index: 1,
      content: `### Catastrophic Liability Shielding

1. Umbrella Mechanics:
   - Providing $1M to $5M in excess liability coverage above underlying auto and homeowner limits; protecting high-net-worth personal assets against catastrophic tort judgments.

2. Self-Insured Retention (SIR):
   - Paying a small SIR deductible when the umbrella drops down to cover claims excluded by primary policies (e.g. personal injury libel/slander).`
    },
    {
      track_id: track2Id,
      title: "Commercial Packaging: Business Owners Policies (BOP) vs CPP",
      order_index: 2,
      content: `### Commercial Risk Consolidation

1. Business Owners Policy (BOP):
   - Pre-packaged property, general liability, and business interruption coverage for small-to-medium low-hazard enterprises.

2. Commercial Package Policy (CPP):
   - Fully customized modular casualty, property, inland marine, and crime policies tailored to complex industrial risks.`
    },
    {
      track_id: track2Id,
      title: "Multi-Line Cross-Selling and Account Retention Economics",
      order_index: 3,
      content: `### Portfolio Economics and Client Lifetime Value

1. Multi-Line Bundling:
   - Structuring companion discounts (Auto + Home + Umbrella) delivering 15-20% client savings.

2. Retention Velocity:
   - Increasing agency account retention from 65% on mono-line accounts to over 92% on multi-line household accounts.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Fiduciary vs Suitability Standards and Best Interest Rules",
      order_index: 1,
      content: `### Regulatory Sales Conduct and Advisory Duties

1. Standard of Care:
   - Navigating NAIC Suitability in Annuity Transactions and Best Interest regulations; documenting thorough fact-finding justifying every product recommendation.

2. Agent vs Broker Duties:
   - Agent represents the insurance company; Broker represents the insured client with heightened fiduciary responsibilities.`
    },
    {
      track_id: track3Id,
      title: "Prohibited Sales Practices: Twisting, Churning and Rebating",
      order_index: 2,
      content: `### Compliance Violations and License Revocation

1. Illegal Inducements:
   - Twisting (misleading policy comparison to induce replacement); Churning (unnecessary policy replacements for commission generation); Rebating (returning commission cash to the buyer).

2. Sliding:
   - Deceptively adding unauthorized insurance riders without consumer knowledge.`
    },
    {
      track_id: track3Id,
      title: "Annual Policy Reviews and Lifecycle Trigger Management",
      order_index: 3,
      content: `### Long-Term Advisory and Milestones

1. Annual Review Protocol:
   - Auditing client property replacement valuations, liability limits, beneficiary designations, and new asset acquisitions.

2. Lifecycle Triggers:
   - Proactively modifying coverage for major milestones (home renovation, marriage, teenage drivers, new business formation).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #159.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In life insurance needs analysis, what does the memory acronym 'DIME' stand for during a client fact-finding interview?",
      options: [
        "Debt, Income, Mortgage, Education",
        "Dollar, Interest, Market, Equity",
        "Dental, Injury, Medical, Emergency",
        "Disability, Indemnity, Mortality, Expense"
      ],
      correct_option_index: 0,
      explanation: "DIME calculates life insurance need: paying off consumer Debt, replacing Income, retiring the Mortgage, and funding children's Education.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What is a 'Personal Umbrella Policy' (PUP) designed to provide for a policyholder?",
      options: [
        "Free rain umbrellas during stormy weather",
        "Coverage for physical damage to patio furniture",
        "An extra layer of high-limit liability protection (typically $1M to $5M) that sits above standard auto and homeowner policy limits to protect personal assets against catastrophic lawsuits",
        "A policy that replaces lost smartphones"
      ],
      correct_option_index: 2,
      explanation: "A Personal Umbrella Policy provides excess liability coverage ($1M+) above primary auto/home policies to protect assets from major liability verdicts.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In insurance sales ethics, what is the illegal sales practice known as 'Rebating'?",
      options: [
        "Sending a client a holiday card",
        "Promising or giving any portion of the agent's sales commission or any special financial favor to the prospective buyer as an inducement to purchase an insurance policy",
        "Offering a discount for safe driving",
        "Renewing a policy automatically"
      ],
      correct_option_index: 1,
      explanation: "Rebating (giving kickbacks or commission rebates to buyers) is strictly prohibited by state insurance departments to prevent unfair competition.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What is a 'Business Owners Policy' (BOP) in commercial lines insurance?",
      options: [
        "A retirement plan for CEOs",
        "A personal life insurance policy for entrepreneurs",
        "A policy that pays corporate income taxes",
        "A convenient pre-packaged policy that bundles property, general liability, and business interruption coverage together for small-to-medium, low-hazard commercial businesses"
      ],
      correct_option_index: 3,
      explanation: "A BOP packages property and general liability coverage into a single cost-effective policy for eligible small businesses.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In corporate commercial risk management, what is 'Key Person Insurance'?",
      options: [
        "A life or disability policy purchased by a business on a crucial executive or technical expert to compensate the company for financial losses and recruiting costs if that person dies or becomes disabled",
        "A policy insuring office door keys",
        "Health insurance for hotel concierges",
        "Car insurance for delivery drivers"
      ],
      correct_option_index: 0,
      explanation: "Key Person insurance protects a business against the financial shock, disruption, and hiring costs resulting from the death of a pivotal leader.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In life insurance needs analysis, what is the 'Social Security Blackout Period'?",
      options: [
        "A total loss of electrical power at government offices",
        "The period during the night when applications cannot be filed",
        "The time when death benefits cannot be paid",
        "The time interval between when the youngest child reaches age 16 (when survivor benefits to the surviving parent cease) and when the surviving spouse reaches age 60 (when retirement survivor benefits begin)"
      ],
      correct_option_index: 3,
      explanation: "The Social Security Blackout Period leaves a surviving spouse with zero government survivor income between their youngest child turning 16 and reaching age 60.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In insurance compliance, what is the illegal sales practice known as 'Twisting'?",
      options: [
        "Physical gymnastics performed in insurance offices",
        "Making misleading or fraudulent comparisons of policies to persuade a policyholder to lapse, forfeit, or surrender an existing policy in order to buy a new policy from the agent",
        "Canceling a policy for non-payment of premiums",
        "Charging higher premiums to high-risk drivers"
      ],
      correct_option_index: 1,
      explanation: "Twisting involves deceptive or incomplete comparisons to convince a client to replace an existing policy to generate new sales commissions.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In quantitative life insurance planning, how does the 'Human Life Value' (HLV) approach calculate the appropriate amount of coverage needed?",
      options: [
        "By calculating the present capitalized monetary value of the individual's future net earnings dedicated to family support (projected lifetime earnings minus personal taxes and self-maintenance costs)",
        "By multiplying the individual's age by their height",
        "By adding the replacement cost of all household furniture",
        "By taking 100% of the company's annual profit"
      ],
      correct_option_index: 0,
      explanation: "Human Life Value calculates the present value of the individual's future economic earnings stream dedicated to their family.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In client retention economics, why is 'Multi-Line Account Bundling' (cross-selling Auto, Home, and Umbrella policies) considered the cornerstone of agency profitability?",
      options: [
        "Because multi-line policies cannot be cancelled",
        "Because the government pays subsidies for multi-line accounts",
        "Data proves that client retention jumps from ~65% on single-policy accounts to over 90-95% on multi-line accounts, drastically lowering acquisition costs and multiplying lifetime client value",
        "Multi-line bundling is mandatory under state law"
      ],
      correct_option_index: 2,
      explanation: "Multi-line clients experience dramatically lower churn (>90% retention) and higher lifetime value than single mono-line policyholders.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In business partnership continuation, how does a 'Cross-Purchase Buy-Sell Agreement' function when funded with life insurance?",
      options: [
        "The company owns one giant policy on the building",
        "The partners buy life insurance policies on each other's children",
        "The government buys the company upon a partner's death",
        "Each business partner individually purchases and owns a life insurance policy on the lives of all other partners; upon a partner's death, the surviving partners use the tax-free insurance payout to buy the deceased partner's ownership shares"
      ],
      correct_option_index: 3,
      explanation: "In a cross-purchase plan, co-owners own policies on each other and use death proceeds to buy out the deceased owner's equity interest.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In insurance agency law, what is the critical legal difference between the fiduciary duty of an 'Insurance Agent' vs an 'Insurance Broker'?",
      options: [
        "Agents only sell health insurance; brokers only sell life insurance",
        "An Agent legally represents and owes primary allegiance to the INSURANCE COMPANY (insurer); a Broker legally represents and owes a fiduciary duty of best interest directly to the CLIENT (insured)",
        "Brokers work for the government; agents work in banks",
        "There is zero legal difference in representation"
      ],
      correct_option_index: 1,
      explanation: "Agents legally bind and represent the insurer; brokers act on behalf of the client and owe primary fiduciary loyalty to the client.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In personal umbrella underwriting, what is 'Self-Insured Retention' (SIR) and when is it paid by the policyholder?",
      options: [
        "The annual fee paid to renew a driver's license",
        "The premium paid to the state insurance commissioner",
        "An initial out-of-pocket dollar amount (similar to a deductible, e.g. $500 or $1,000) that the insured must pay when an umbrella policy 'drops down' to cover a personal liability claim (such as libel or slander) that was completely excluded by the underlying primary policy",
        "The money left in an insurance savings account"
      ],
      correct_option_index: 2,
      explanation: "An SIR is an out-of-pocket retention paid by the insured when an umbrella policy covers a claim not covered by any primary underlying policy.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In market conduct compliance, what is the illegal sales practice known as 'Sliding'?",
      options: [
        "Deceptively representing to a consumer that a specific optional coverage or endorsement is required by law or included for free, while covertly charging the consumer for that extra coverage on their billing statement",
        "Canceling a policy before the expiration date",
        "Sliding down the stairs in an office",
        "Offering an installment payment plan"
      ],
      correct_option_index: 0,
      explanation: "Sliding is the unlawful practice of adding optional coverages/fees into a policy without the applicant's informed consent.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "Why is conducting an 'Annual Client Policy Review' essential for mitigating an insurance agent's Errors & Omissions (E&O) professional liability exposure?",
      options: [
        "To collect cash tips from clients",
        "To increase the agent's golf handicap",
        "Annual reviews are required to pay property taxes",
        "It provides a documented checkpoint to identify un-endorsed home renovations, newly acquired high-value assets, teenage drivers, or expanded business operations, preventing devastating uncovered claims where the client alleges failure-to-advise"
      ],
      correct_option_index: 3,
      explanation: "Annual reviews ensure coverage limits match life changes, eliminating coverage gaps and protecting agents from failure-to-advise E&O lawsuits.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In life insurance needs analysis, how does the 'Capital Needs Analysis' approach differ fundamentally from the 'Human Life Value' approach?",
      options: [
        "Capital needs analysis is only used for Fortune 500 corporations",
        "Capital Needs Analysis calculates the exact balance sheet cash needed to extinguish all liabilities and generate a permanent income capital fund for survivors, whereas Human Life Value measures the economic lifetime value of the earner themselves",
        "Capital needs analysis requires zero math calculations",
        "There is zero conceptual difference between them"
      ],
      correct_option_index: 1,
      explanation: "Capital needs analysis determines exact financial obligations and capital required to generate survivor income, rather than pricing human earning power.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #159.");
  console.log("Skill #159 update completed successfully!");
}

run();
