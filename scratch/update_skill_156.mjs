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

const skillId = "cf8a8745-c205-49d5-8a5d-650876d28646";

async function run() {
  console.log("Updating Skill #156: Insurance Fundamentals (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Actuarial Risk Theory, Law of Large Numbers and Hazards" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Legal Doctrines of Insurance Contracts and Indemnity" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Reinsurance Structures, Solvency and NAIC Governance" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / CPCU & Actuarial Science level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Pure vs Speculative Risk and The Law of Large Numbers",
      order_index: 1,
      content: `### Mathematical Probability and Risk Classifications

1. Risk Categories:
   - Pure Risk (situations involving only loss or no loss: insurable) vs Speculative Risk (situations involving potential gain, loss, or neutral: uninsurable gambling/investments).

2. Law of Large Numbers:
   - As the number of homogeneous exposure units increases, actual loss experience converges statistically toward predicted expected loss probability.`
    },
    {
      track_id: track1Id,
      title: "The Six Elements of Ideally Insurable Loss Exposures",
      order_index: 2,
      content: `### Actuarial Insurability Criteria

1. Core Insurability Elements:
   - 1. Large number of homogeneous exposure units.
   - 2. Accidental and unintentional loss.
   - 3. Determinable and measurable loss.
   - 4. Non-catastrophic loss exposure (diversified geographic spread).
   - 5. Calculable chance of loss.
   - 6. Economically feasible premium.`
    },
    {
      track_id: track1Id,
      title: "Perils, Physical Hazards, Moral Hazards and Morale Hazards",
      order_index: 3,
      content: `### Loss Catalysts and Behavioral Asymmetries

1. Perils vs Hazards:
   - Peril is the direct cause of loss (fire, collision, flood); Hazard is a condition increasing the frequency or severity of a peril.

2. Hazard Typology:
   - Physical Hazard (faulty electrical wiring).
   - Moral Hazard (dishonesty/fraudulent arson to collect claims).
   - Morale Hazard (carelessness/indifference because insurance exists).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The Principle of Indemnity and Insurable Interest",
      order_index: 1,
      content: `### Foundational Legal Restitution Doctrines

1. Principle of Indemnity:
   - Restoring the insured to the exact financial position enjoyed immediately prior to the loss, prohibiting unjust enrichment or profiting from insurance.

2. Insurable Interest Timing:
   - Life Insurance requires insurable interest only at policy inception; Property/Casualty requires insurable interest at the exact time of loss.`
    },
    {
      track_id: track2Id,
      title: "Utmost Good Faith, Warranties and Material Misrepresentation",
      order_index: 2,
      content: `### Legal Disclosure and Policy Voidance

1. Uberrimae Fidei (Utmost Good Faith):
   - Requiring higher disclosure honesty than ordinary commercial contracts.

2. Contractual Terms:
   - Representations (applicant statements believed true to best knowledge) vs Warranties (guaranteed factual conditions). Material Misrepresentation gives insurer grounds to void coverage.`
    },
    {
      track_id: track2Id,
      title: "Contract Characteristics: Aleatory, Adhesion and Subrogation",
      order_index: 3,
      content: `### Contractual Enforceability and Legal Recovery

1. Legal Characteristics:
   - Contract of Adhesion (drafted by insurer; ambiguities resolved strictly in favor of insured); Aleatory Contract (unequal monetary exchange).

2. Subrogation Rights:
   - Transferring legal recovery rights to the insurer after claim payment to pursue reimbursement from negligent third parties.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Reinsurance Mechanisms: Treaty vs Facultative Structures",
      order_index: 1,
      content: `### Risk Transfer and Capital Protection

1. Reinsurance Architecture:
   - Primary Ceding Company transferring excess risk exposure to Reinsurers to expand underwriting capacity and stabilize loss ratios.

2. Treaty vs Facultative:
   - Treaty Reinsurance (automatic contractual sharing of entire portfolios via Quota Share or Excess of Loss) vs Facultative (negotiated individual policy-by-policy risk underwriting).`
    },
    {
      track_id: track3Id,
      title: "Insurance Accounting: Loss Ratios, Combined Ratios and Float",
      order_index: 2,
      content: `### Insurer Financial Health and Underwriting Metrics

1. Financial Ratios:
   - Loss Ratio (Incurred Losses / Earned Premiums); Expense Ratio (Underwriting Costs / Written Premiums); Combined Ratio (Loss Ratio + Expense Ratio; < 100% indicates underwriting profitability).

2. Insurance Float:
   - Investing collected premium reserves prior to claim payout.`
    },
    {
      track_id: track3Id,
      title: "NAIC Governance, Risk-Based Capital (RBC) and Solvency",
      order_index: 3,
      content: `### State Regulatory Oversight and Consumer Protection

1. NAIC & RBC Standards:
   - National Association of Insurance Commissioners (NAIC) establishing Risk-Based Capital (RBC) solvency thresholds to prevent carrier bankruptcy.

2. State Guaranty Associations:
   - State-mandated insolvency safety nets funding policyholder claims if an admitted insurance carrier enters liquidation.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #156.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In actuarial risk theory, which type of risk is considered commercially INSURABLE by insurance companies?",
      options: [
        "Speculative Risk (such as stock market trading or casino gambling)",
        "Pure Risk (situations involving ONLY the possibility of financial loss or no loss, with zero potential for financial gain)",
        "Political election betting",
        "Cryptocurrency speculation"
      ],
      correct_option_index: 1,
      explanation: "Pure risk involves only loss or no loss, making it insurable; speculative risk involves potential gain and cannot be insured.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In insurance contract law, what does the 'Principle of Indemnity' dictate?",
      options: [
        "The insured should profit significantly every time an accident occurs",
        "Insurance companies never have to pay claims",
        "The policyholder must pay double premiums after a claim",
        "The insured is restored to the approximate financial position they enjoyed immediately prior to the loss, prohibiting financial profit or unjust enrichment from an insurance claim"
      ],
      correct_option_index: 3,
      explanation: "The Principle of Indemnity ensures insurance reimburses actual financial loss without allowing the insured to profit.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In insurance underwriting terms, what is the fundamental difference between a 'Peril' and a 'Hazard'?",
      options: [
        "A Peril is the direct cause of loss (e.g. fire, hail, collision); a Hazard is a condition that increases the frequency or severity of that peril (e.g. faulty wiring, icy roads)",
        "A Peril is a contract; a Hazard is a premium",
        "Perils only occur in marine insurance",
        "There is zero legal difference between them"
      ],
      correct_option_index: 0,
      explanation: "Peril is the active cause of destruction (fire); hazard is the underlying vulnerability that increases risk (oily rags).",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What is 'Subrogation' in property and casualty insurance?",
      options: [
        "Canceling an insurance policy without notice",
        "Buying insurance in a foreign country",
        "The legal process where an insurer, after paying a covered claim to the policyholder, acquires the policyholder's legal rights to pursue recovery from the negligent third party who caused the loss",
        "A discount given to safe drivers"
      ],
      correct_option_index: 2,
      explanation: "Subrogation transfers legal recovery rights to the carrier to recoup claim payouts from responsible third parties.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "Why is an insurance contract legally classified as a 'Contract of Adhesion'?",
      options: [
        "Because it is glued to the policyholder's house",
        "Because it is drafted entirely by one party (the insurer) with non-negotiable 'take-it-or-leave-it' terms; consequently, any legal ambiguities in policy wording are interpreted by courts strictly in favor of the insured",
        "Because it requires adhesive stamps",
        "Because it adheres to international trade treaties"
      ],
      correct_option_index: 1,
      explanation: "In adhesion contracts, the drafting party holds power; courts interpret any ambiguous clauses in favor of the policyholder.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In actuarial mathematics, how does the 'Law of Large Numbers' enable insurance companies to accurately price insurance premiums?",
      options: [
        "By charging large numbers of dollars to wealthy customers",
        "By making insurance policies 1,000 pages long",
        "As the number of similar, independent exposure units (policyholders) increases, the actual aggregate loss experience converges closer to the mathematically expected loss probability, allowing accurate premium calculation",
        "The law of large numbers is only used for counting population censuses"
      ],
      correct_option_index: 2,
      explanation: "Large pools of exposure units stabilize loss variance, allowing actuaries to predict aggregate claim frequency with precision.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In property and casualty insurance accounting, what does a 'Combined Ratio' of LESS than 100% (e.g. 94%) indicate about an insurance company's financial performance?",
      options: [
        "The insurer generated an underwriting profit (taking in more premium revenue than paid out in claims and operating expenses) before factoring in investment income",
        "The insurer is bankrupt and entering liquidation",
        "The insurer had 94 fraudulent claims",
        "The insurer must refund 6% of all premiums"
      ],
      correct_option_index: 0,
      explanation: "Combined Ratio = Loss Ratio + Expense Ratio; a score <100% proves underwriting profitability without relying on investment returns.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What is the crucial legal distinction regarding WHEN 'Insurable Interest' must exist in Life Insurance compared to Property & Casualty Insurance?",
      options: [
        "Insurable interest is never required in property insurance",
        "Insurable interest must exist every single day in life insurance",
        "Property insurance requires insurable interest only on the policy purchase date",
        "Life Insurance requires insurable interest ONLY at the time of policy inception/purchase; Property Insurance requires insurable interest at the EXACT TIME OF THE LOSS"
      ],
      correct_option_index: 3,
      explanation: "Life insurance tests insurable interest at contract inception; property insurance mandates financial ownership/interest at time of loss.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In insurance risk management, what is 'Reinsurance' and what is the difference between 'Treaty' and 'Facultative' reinsurance?",
      options: [
        "Reinsurance is buying car insurance twice",
        "Reinsurance is insurance for insurance companies; Treaty reinsurance automatically covers an entire portfolio of risks, whereas Facultative reinsurance is negotiated case-by-case on individual high-value policies",
        "Treaty reinsurance is for governments; Facultative is for universities",
        "Reinsurance is an illegal form of money laundering"
      ],
      correct_option_index: 1,
      explanation: "Reinsurance transfers risk from primary insurers to reinsurers: Treaty covers entire book portfolios; Facultative evaluates individual risks.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In insurance behavioral hazards, what is the critical difference between a 'Moral Hazard' and a 'Morale Hazard'?",
      options: [
        "Moral hazards are for church buildings; Morale hazards are for military bases",
        "Morale hazard involves intentional criminal fraud; Moral hazard is an accident",
        "Moral Hazard involves intentional dishonesty or fraud (e.g. staging a fake arson fire); Morale Hazard involves careless indifference or recklessness caused by knowing insurance will cover the loss (e.g. leaving car unlocked)",
        "There is zero difference between them"
      ],
      correct_option_index: 2,
      explanation: "Moral hazard involves intentional deception/fraud; morale hazard involves carelessness and apathy arising from insurance protection.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In actuarial science, why is a 'Non-Catastrophic Loss Exposure' one of the mandatory six criteria for an ideally insurable risk?",
      options: [
        "If a single catastrophic peril (such as widespread nuclear disaster or massive nationwide flood) damages millions of exposure units simultaneously, pooling fails, and claims would cause immediate systemic insolvency for the entire insurance industry",
        "Catastrophic losses take too long to repair",
        "Catastrophes only happen in space",
        "Insurance companies are legally banned from insuring buildings"
      ],
      correct_option_index: 0,
      explanation: "Risk pooling requires statistical independence; correlated catastrophic events wipe out insurer reserves, violating pooling math.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "Under insurance contract law and the doctrine of 'Uberrimae Fidei' (Utmost Good Faith), how does a 'Warranty' differ from a 'Representation' on an insurance application?",
      options: [
        "A representation guarantees 100% truth; a warranty is an opinion",
        "Warranties are only used for home appliances",
        "There is zero legal difference in contract litigation",
        "A Representation is a statement believed to be true to the applicant's best knowledge; a Warranty is a strict legal guarantee of fact, where any breach voids the policy regardless of materiality"
      ],
      correct_option_index: 3,
      explanation: "Warranties are strict factual guarantees whose breach voids coverage; representations void policies only if materially fraudulent.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In US insurance solvency regulation, what role does the NAIC's 'Risk-Based Capital' (RBC) formula play in monitoring carrier health?",
      options: [
        "It sets the price of homeowner insurance in each city",
        "It calculates minimum statutory capital requirements based on the specific risk profile of the carrier's asset investments, underwriting liabilities, and credit risks, triggering mandatory regulatory intervention if capital drops below solvency thresholds",
        "It taxes insurance companies 50% on all revenues",
        "RBC requirements only apply to banks"
      ],
      correct_option_index: 1,
      explanation: "RBC calculates required capital reserves against asset/underwriting risks, dictating mandatory state intervention levels upon deterioration.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "Why is an insurance policy characterized as an 'Aleatory Contract'?",
      options: [
        "Because it is written in a foreign language",
        "Because it cannot be cancelled by either party",
        "Because the monetary values exchanged between the parties are inherently unequal and depend entirely upon the occurrence of an uncertain future event (e.g. paying $1,000 premium for a $1,000,000 claim or paying for 20 years with zero claims)",
        "Aleatory means the contract is signed by a judge"
      ],
      correct_option_index: 2,
      explanation: "Aleatory contracts feature unequal dollar exchange based on chance: a large claim payout or zero payout for years of premiums.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In insurance financial economics, what is 'Insurance Float' and how does it generate enterprise value for insurance carriers?",
      options: [
        "The large pool of premium cash collected upfront from policyholders that is held in reserves and invested in yield-generating assets before claims are eventually paid out months or years later",
        "A boat insured by a maritime company",
        "The money left in cash registers at insurance offices",
        "A loan taken from a central bank"
      ],
      correct_option_index: 0,
      explanation: "Float represents customer premium funds held in reserve and invested in liquid assets before claims arise, driving investment profits.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #156.");
  console.log("Skill #156 update completed successfully!");
}

run();
