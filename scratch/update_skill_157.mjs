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

const skillId = "43dce2f6-4913-40d6-a32a-405a2bdb0daf";

async function run() {
  console.log("Updating Skill #157: Policy Types & Underwriting Basics (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Personal Lines and Commercial Property Casualty Structures" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Life, Disability, CGL and Specialty Cyber Lines" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Underwriting Risk Selection, Audits and Rate Making" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / CPCU & Chief Underwriting Officer level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Homeowners HO-3, HO-5 and Personal Auto PAP Architectures",
      order_index: 1,
      content: `### Personal Lines Policy Geometry

1. Homeowners Forms:
   - HO-3 Special Form (open perils on Coverage A Dwelling/B Other Structures; named perils on Coverage C Personal Property/D Loss of Use).

2. Personal Auto Policy (PAP):
   - Split Liability Limits (e.g. 250/500/100: Bodily Injury per person / per accident / Property Damage); Collision and Comprehensive (Other-Than-Collision).`
    },
    {
      track_id: track1Id,
      title: "Commercial Property Coinsurance Formulas and Actual Cash Value",
      order_index: 2,
      content: `### Property Valuation and Coinsurance Penalties

1. Valuation Methods:
   - Actual Cash Value (ACV = Replacement Cost minus Physical Depreciation) vs Guaranteed Replacement Cost.

2. Coinsurance Mathematics:
   - Enforcing 80% Coinsurance: Payout = ((Did Carry / Should Carry) * Loss) - Deductible, heavily penalizing under-insured commercial structures.`
    },
    {
      track_id: track1Id,
      title: "Commercial General Liability: Occurrence vs Claims-Made",
      order_index: 3,
      content: `### Commercial Casualty Liability Triggers

1. CGL Policy Triggers:
   - Occurrence Trigger (covers bodily injury/property damage occurring during policy period, regardless of when claim is reported).

2. Claims-Made Trigger:
   - Requires both the incident to occur after the Retroactive Date AND the claim to be filed during the active policy term; requiring Tail Coverage upon cancellation.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Term Life, Whole Life and Universal Life Structures",
      order_index: 1,
      content: `### Life Insurance Architectures and Cash Value

1. Term Life:
   - Pure death benefit protection over fixed horizons (10, 20, 30 years) with zero cash value build-up.

2. Permanent Life:
   - Whole Life (fixed premiums, guaranteed cash value accumulation) vs Universal Life (unbundled transparent mortality, flexible premiums, floating interest crediting).`
    },
    {
      track_id: track2Id,
      title: "Disability Income: Own-Occupation vs Any-Occupation",
      order_index: 2,
      content: `### Income Protection and Elimination Periods

1. Disability Definitions:
   - Own-Occupation (pays benefits if unable to perform material duties of specific specialty profession) vs Any-Occupation (strict definition requiring total inability to work any job).

2. Elimination Periods:
   - 30, 90, or 180-day waiting periods serving as time deductibles before benefit disbursement.`
    },
    {
      track_id: track2Id,
      title: "Specialty Lines: E&O, D&O, Cyber Risk and Inland Marine",
      order_index: 3,
      content: `### Executive and Cyber Risk Transfers

1. Management Liability:
   - Errors & Omissions (E&O: professional negligence) and Directors & Officers (D&O: corporate governance liability).

2. Cyber Risk & Marine:
   - First-party ransomware / forensic recovery + third-party privacy liability; Inland Marine insuring mobile high-value equipment in transit.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "The Underwriting Process: Submission, Hazards and Audits",
      order_index: 1,
      content: `### Risk Selection and Decisioning Workflows

1. Underwriting Evaluation:
   - Analyzing applicant financials, engineering loss-control reports, and risk inspections to classify loss probability.

2. Underwriting Decisions:
   - Accept at standard rate, Accept with modifications (exclusions, higher deductibles, conditional warranties), or Decline adverse selection risks.`
    },
    {
      track_id: track3Id,
      title: "Third-Party Risk Databases: MVR, CLUE and MIB Reports",
      order_index: 2,
      content: `### Verification Intelligence and Loss History

1. Underwriting Databases:
   - LexisNexis CLUE (Comprehensive Loss Underwriting Exchange tracking 7-year auto/property claim history).

2. Specialized Registries:
   - Motor Vehicle Records (MVR driving infractions); Medical Information Bureau (MIB coded life/health application histories preventing fraud).`
    },
    {
      track_id: track3Id,
      title: "Actuarial Rate Making: Pure Premium vs Loss Ratio Methods",
      order_index: 3,
      content: `### Rate Engineering and Experience Modification

1. Rate Making Math:
   - Pure Premium Method (Pure Premium = Incurred Losses / Exposure Units; Gross Rate = Pure Premium / (1 - Expense Loading)).

2. Experience Rating:
   - Applying Experience Modification Rates (EMR) in Workers' Compensation to adjust premiums based on individual past safety records.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #157.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In homeowners insurance, what is the standard coverage structure of an 'HO-3 Special Form' policy?",
      options: [
        "Open Perils coverage on the Dwelling (structures), and Named Perils coverage on Personal Property (contents)",
        "Zero coverage for fire or lightning",
        "Covers only vehicles parked in the garage",
        "Covers flood damage with zero deductible"
      ],
      correct_option_index: 0,
      explanation: "HO-3 provides Open Perils (all losses covered unless explicitly excluded) for structures, and Named Perils for personal contents.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In disability insurance, what does an 'Own-Occupation' definition of total disability mean for the policyholder?",
      options: [
        "The insured must own the company they work for",
        "The insured is paid only if they cannot work any minimum wage job",
        "Benefits are paid if the insured is unable to perform the substantial and material duties of their specific regular specialty profession, even if they could work in another career",
        "Disability benefits expire after 30 days"
      ],
      correct_option_index: 2,
      explanation: "Own-Occupation protects professionals (e.g. surgeons, trial lawyers) if unable to practice their specific specialty.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In life insurance products, what distinguishes 'Term Life' from 'Whole Life' insurance?",
      options: [
        "Whole life is only for children",
        "Term Life provides pure death benefit protection for a specified period (e.g. 20 years) with no cash value; Whole Life provides permanent lifetime coverage with a guaranteed cash value savings component",
        "Term life pays double if you live to age 100",
        "There is zero difference between them"
      ],
      correct_option_index: 1,
      explanation: "Term life offers pure death benefit coverage for a set term; whole life provides permanent coverage with cash value buildup.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In personal auto insurance liability, what do split limits of '250/500/100' represent?",
      options: [
        "$250 total deductible, $500 monthly premium, $100 collision fee",
        "250 horsepower, 500 miles range, 100 miles per hour",
        "250 days coverage, 500 dollars down, 100 payments",
        "$250,000 Bodily Injury limit per person, $500,000 Bodily Injury limit per accident, and $100,000 Property Damage limit per accident"
      ],
      correct_option_index: 3,
      explanation: "Split limits represent: per-person bodily injury / total per-accident bodily injury / total per-accident property damage in thousands.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What is 'Actual Cash Value' (ACV) in property insurance loss valuation?",
      options: [
        "Replacement Cost MINUS Physical Depreciation",
        "The original price paid 20 years ago without adjustment",
        "The exact cost to buy a brand new item at retail today",
        "Paying the claim in physical dollar bills"
      ],
      correct_option_index: 0,
      explanation: "Actual Cash Value (ACV) equals current replacement cost minus physical depreciation (wear, tear, and obsolescence).",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In Commercial General Liability (CGL) insurance, what is the operational difference between an 'Occurrence' policy and a 'Claims-Made' policy?",
      options: [
        "Occurrence policies are only for car accidents",
        "Claims-made policies are illegal in the United States",
        "Occurrence policies require claims to be reported in 24 hours",
        "An Occurrence policy covers losses that occur during the policy period regardless of when the claim is filed; a Claims-Made policy covers losses only if the incident occurred after the retroactive date AND the claim is reported during the active policy period"
      ],
      correct_option_index: 3,
      explanation: "Occurrence triggers attach to the date of loss; claims-made triggers require both loss and report to happen during the policy term.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In underwriting verification, what is a 'CLUE Report' (Comprehensive Loss Underwriting Exchange)?",
      options: [
        "A board game played by insurance executives",
        "A centralized consumer reporting database provided by LexisNexis that contains up to seven years of personal auto and property insurance loss and claim history",
        "A medical report detailing blood test results",
        "A credit card transaction report"
      ],
      correct_option_index: 1,
      explanation: "The CLUE database tracks 7 years of prior auto and property claims, allowing underwriters to verify prior loss history.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "Under commercial property insurance, how is a claim payout calculated when a building fails to satisfy the mandatory '80% Coinsurance Clause'?",
      options: [
        "Payout = ((Amount of Insurance Carried / Amount of Insurance Required) * Loss Amount) - Deductible",
        "The insurer pays $0 and cancels the policy",
        "The insurer pays double the loss amount",
        "Coinsurance penalties only apply to life insurance"
      ],
      correct_option_index: 0,
      explanation: "Coinsurance Formula: Payout = ((Did Carry / Should Carry) * Loss) - Deductible, imposing a proportional penalty for under-insuring.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In corporate executive risk management, what does 'Directors & Officers' (D&O) liability insurance protect against?",
      options: [
        "Physical slip-and-fall injuries in corporate hallways",
        "Damage to executive company cars",
        "Personal financial liability and legal defense costs incurred by corporate directors and officers resulting from alleged wrongful acts, breach of fiduciary duty, or shareholder lawsuits",
        "Worker injuries in manufacturing plants"
      ],
      correct_option_index: 2,
      explanation: "D&O insurance shields corporate directors and officers from personal liability resulting from shareholder or regulatory governance lawsuits.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In commercial workers' compensation insurance, what is an 'Experience Modification Rate' (EMR)?",
      options: [
        "The age of the oldest worker on the payroll",
        "The speed at which claims are processed",
        "The interest rate charged on late premiums",
        "A multiplier applied to a company's workers' comp premium based on their historical claim loss experience compared to industry averages (an EMR < 1.0 reduces premiums for superior safety records)"
      ],
      correct_option_index: 3,
      explanation: "EMR compares a business's claim history to industry peers: a score <1.0 provides premium discounts; >1.0 incurs surcharges.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In actuarial rate making, what is the 'Pure Premium Method' formula for calculating baseline insurance rates?",
      options: [
        "Pure Premium = Total Company Profit / Total Executive Salaries",
        "Pure Premium = Total Incurred Losses (including Loss Adjustment Expenses) / Total Exposure Units",
        "Pure Premium = Gross Premium * 100",
        "Pure Premium = Total Investment Dividends / Number of Claims"
      ],
      correct_option_index: 1,
      explanation: "Pure Premium = Incurred Losses / Exposure Units; Gross Rate is then calculated by loading Pure Premium for underwriting expenses.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In enterprise cyber risk insurance, what is the core structural difference between 'First-Party Cyber Coverage' and 'Third-Party Cyber Coverage'?",
      options: [
        "First-party covers hardware; third-party covers software",
        "First-party is for personal phones; third-party is for servers",
        "First-Party covers direct losses incurred by the policyholder (ransom payments, forensic IT investigation, customer notification costs, data restoration); Third-Party covers liability claims and legal defense if clients or consumers sue over compromised data",
        "There is zero difference in cyber policy endorsements"
      ],
      correct_option_index: 2,
      explanation: "First-party covers direct incident response costs (ransom, forensics); third-party covers legal liability and regulatory fines from affected third parties.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In claims-made professional liability policies (e.g. Medical Malpractice / E&O), why is purchasing 'Tail Coverage' (Extended Reporting Period endorsement) critical when a practitioner retires or switches carriers?",
      options: [
        "Without Tail Coverage, any lawsuit filed AFTER the cancellation date for incidents that occurred during the prior active policy term will be completely uncovered and denied by the insurer",
        "Tail coverage pays for a vacation after retirement",
        "Tail coverage refunds all prior premiums paid over 30 years",
        "Tail coverage is mandatory under traffic laws"
      ],
      correct_option_index: 0,
      explanation: "Tail coverage extends the reporting period indefinitely, ensuring coverage for past acts when a claims-made policy is cancelled.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In life insurance underwriting, what is the specific role of the 'Medical Information Bureau' (MIB)?",
      options: [
        "A government hospital system",
        "A pharmaceutical distribution company",
        "A medical school accrediting board",
        "A non-profit membership corporation that maintains a secure database of coded medical and underwriting findings from prior life and health insurance applications to detect applicant non-disclosure and fraud"
      ],
      correct_option_index: 3,
      explanation: "The MIB maintains coded underwriting histories across carriers, preventing applicants from omitting medical conditions on new applications.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In Universal Life insurance policies, how does the 'Unbundled Pricing Architecture' provide transparency compared to traditional Whole Life?",
      options: [
        "Universal life policies have zero fees",
        "The three core policy components (Mortality Cost of Insurance, Policy Administration Expense Charges, and Cash Value Interest Crediting Rate) are completely separated and reported transparently on monthly statements",
        "Universal life policies cannot be cancelled",
        "Universal life is only sold in European countries"
      ],
      correct_option_index: 1,
      explanation: "Universal life unbundles mortality costs, interest earnings, and expense charges, giving policyholders transparency and flexible premium options.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #157.");
  console.log("Skill #157 update completed successfully!");
}

run();
