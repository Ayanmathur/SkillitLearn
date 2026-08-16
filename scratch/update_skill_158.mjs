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

const skillId = "a5dfdbd1-c83b-4473-b57b-bfe7bfc9d50c";

async function run() {
  console.log("Updating Skill #158: Claims Process Basics (9 steps across 3 tracks)...");

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

  // If fewer than 3 tracks exist, create the missing tracks
  while (tracks.length < 3) {
    const nextOrder = tracks.length + 1;
    const { data: newTrack, error: nErr } = await supabase
      .from("tracks")
      .insert({
        skill_id: skillId,
        title: `Track ${nextOrder}: Claims Process Basics`,
        order_index: nextOrder
      })
      .select("id, title, order_index")
      .single();

    if (nErr) {
      console.error("Error creating track:", nErr);
      return;
    }
    tracks.push(newTrack);
  }

  tracks.sort((a, b) => a.order_index - b.order_index);

  const track1Id = tracks[0].id;
  const track2Id = tracks[1].id;
  const track3Id = tracks[2].id;

  // Update Track titles
  await supabase.from("tracks").update({ title: "Track 1: First Notice of Loss, Coverage Analysis and Case Reserving" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Loss Investigation, Fraud SIU and Bad Faith Prevention" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Settlement Negotiation, Subrogation and Salvage Recovery" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Associate in Claims AIC & Senior Claims Director level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "First Notice of Loss (FNOL) Intake and Triage Workflows",
      order_index: 1,
      content: `### Claims Triage and Immediate Loss Mitigation

1. FNOL Intake Protocols:
   - Capturing initial incident telemetry, police reports, and recorded claimant statements immediately following a loss.

2. Emergency Mitigation:
   - Instructing policyholders on statutory duties after a loss (preventing further secondary water or structure damage).`
    },
    {
      track_id: track1Id,
      title: "Coverage Verification, Exclusions and Policy Provisions",
      order_index: 2,
      content: `### Contractual Liability and Peril Verification

1. Coverage Audit:
   - Verifying policy inception and expiration dates, premium payment standing, named insured definitions, and covered peril triggers.

2. Exclusions & Endorsements:
   - Cross-referencing flood, earth movement, or intentional act exclusions against active policy endorsements.`
    },
    {
      track_id: track1Id,
      title: "Individual Case Reserving and IBNR Actuarial Dynamics",
      order_index: 3,
      content: `### Solvency Reserving and Loss Adjustment Expenses

1. Individual Case Reserves:
   - Establishing immediate liability reserves (anticipated ultimate claim settlement cost + defense litigation expenses) within 24-48 hours.

2. IBNR Reserves:
   - Actuarial Incurred But Not Reported reserves ensuring carrier liquidity for latent unreported claims.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Damage Scoping, Forensic Adjusting and Public Adjusters",
      order_index: 1,
      content: `### Physical Inspection and Loss Quantification

1. Field Adjusting:
   - Deploying forensic adjusters to measure structural damage, evaluate contractor estimates, and establish detailed Xactimate line-item scopes of loss.

2. Representation Dynamics:
   - Navigating disputes with policyholder-retained Public Adjusters and independent appraisal processes.`
    },
    {
      track_id: track2Id,
      title: "Special Investigation Units (SIU) and Fraud Detection",
      order_index: 2,
      content: `### Anti-Fraud Protocols and Red Flag Analytics

1. SIU Escalation Triggers:
   - Staged vehicle collisions, inflated medical billing, fraudulent receipts, and suspicious post-loss policy endorsements.

2. Fraud Intelligence:
   - Reporting suspected fraudulent rings to the National Insurance Crime Bureau (NICB) and state insurance fraud bureaus.`
    },
    {
      track_id: track2Id,
      title: "Bad Faith Avoidance, Reservation of Rights and Non-Waiver",
      order_index: 3,
      content: `### Fair Claims Practices and Insurer Liability

1. Unfair Claims Settlement Acts:
   - Enforcing strict statutory deadlines for claim acknowledgment, prompt investigation, and timely written explanations of claim denial.

2. Legal Disclaimers:
   - Issuing formal Reservation of Rights (ROR) letters and Non-Waiver Agreements to investigate questionable claims without waiving policy defenses.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Total Loss Valuations, GAP Payouts and Salvage Titling",
      order_index: 1,
      content: `### Total Loss Settlement and Vehicle Disposition

1. Total Loss Formula:
   - Declaring a constructive total loss when Repair Cost + Salvage Value exceeds Actual Cash Value (ACV).

2. GAP Insurance & Titling:
   - Coordinating Guaranteed Asset Protection (GAP) to bridge loan balance deficits; executing salvage branding titles and vehicle auction liquidations.`
    },
    {
      track_id: track3Id,
      title: "Subrogation Recovery and Inter-Company Arbitration",
      order_index: 2,
      content: `### Tort Recovery and Deductible Reimbursements

1. Subrogation Demand:
   - Pursuing at-fault third-party carriers to recoup 100% of claim payouts and reimburse the policyholder's deductible.

2. Arbitration Forums:
   - Submitting disputed liability and comparative negligence claims to binding Inter-Company Arbitration forums to avoid costly civil litigation.`
    },
    {
      track_id: track3Id,
      title: "Alternative Dispute Resolution: Mediation and Appraisals",
      order_index: 3,
      content: `### Resolving Disputed Valuation and Claims

1. The Policy Appraisal Clause:
   - Invoking formal appraisal where each party selects an independent appraiser and a neutral umpire resolves disputed property values.

2. Mediation:
   - Facilitating structured mediation to reach binding compromise settlements and avoid protracted court trials.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #158.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In insurance operations, what does the acronym 'FNOL' stand for?",
      options: [
        "Final Notice of Lawsuit",
        "First Notice of Loss",
        "Financial Net Operating Leverage",
        "Full National Ownership License"
      ],
      correct_option_index: 1,
      explanation: "FNOL stands for First Notice of Loss, the initial report made by a policyholder to an insurance carrier following a loss event.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What is a 'Claim Reserve' in insurance accounting?",
      options: [
        "A private room for insurance adjusters",
        "The money a policyholder pays for roadside assistance",
        "A penalty fee for filing too many claims",
        "An estimated liability amount set aside by the insurer on its balance sheet to cover the anticipated ultimate settlement payout and legal expenses of a reported claim"
      ],
      correct_option_index: 3,
      explanation: "A claim reserve is an earmarked liability on the insurer's balance sheet dedicated to paying all future costs associated with that claim.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In property and casualty insurance, what is a 'Public Adjuster'?",
      options: [
        "An independent, state-licensed claims adjuster hired and paid directly by the POLICYHOLDER to represent the policyholder's financial interests in documenting and negotiating property claims with the insurer",
        "A government police officer who inspects car crashes",
        "An insurance company employee who denies all claims",
        "A judge who presides over traffic court"
      ],
      correct_option_index: 0,
      explanation: "Public adjusters represent policyholders (for a percentage of the claim payout), whereas staff/independent adjusters work on behalf of carriers.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What does 'GAP Insurance' (Guaranteed Asset Protection) cover for a policyholder whose financed vehicle suffers a total loss?",
      options: [
        "It pays for dental gaps",
        "It replaces damaged clothing",
        "The financial 'gap' between the vehicle's Actual Cash Value (market payout) and the remaining outstanding balance owed on the auto loan or lease",
        "It provides a free rental car for 5 years"
      ],
      correct_option_index: 2,
      explanation: "GAP insurance covers the deficit between market ACV payout and the higher outstanding loan or lease balance.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What is a policyholder's primary immediate duty under the 'Protection Against Further Loss' clause after a storm damages their roof?",
      options: [
        "Take a vacation immediately",
        "Take reasonable emergency steps (such as placing a protective tarp over the hole) to mitigate and prevent secondary water damage to the home's interior",
        "Wait 6 months before calling anyone",
        "Demolish the entire house"
      ],
      correct_option_index: 1,
      explanation: "Policyholders have a contractual duty to take reasonable steps to prevent secondary damage immediately following a loss.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In insurance claims legal compliance, what is an insurer's 'Reservation of Rights' (ROR) letter?",
      options: [
        "An invitation to an executive dinner party",
        "A letter canceling the policy permanently",
        "A formal written notice informing the insured that the carrier is investigating the claim or defending a lawsuit, but reserves the right to deny coverage later if investigation reveals the loss is excluded",
        "A letter granting 100% full coverage with zero deductible"
      ],
      correct_option_index: 2,
      explanation: "An ROR letter allows an insurer to defend an insured in litigation while preserving its legal right to deny coverage if exclusions apply.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In insurer anti-fraud governance, what is the role of the 'Special Investigation Unit' (SIU)?",
      options: [
        "A specialized internal investigative division dedicated to detecting, investigating, and prosecuting fraudulent, staged, or exaggerated insurance claims",
        "A team that sells car insurance policies online",
        "A department that cleans office facilities",
        "An accounting team that calculates payroll taxes"
      ],
      correct_option_index: 0,
      explanation: "SIU teams investigate suspicious claims, staged accidents, medical billing mills, and arson fraud to protect insurance pools.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In vehicle total loss adjusting, when is a vehicle standardly declared a 'Constructive Total Loss'?",
      options: [
        "When the vehicle has a flat tire",
        "When the car is older than 5 years",
        "When the vehicle owner wants a new car",
        "When the estimated cost of repairs PLUS the anticipated salvage value equals or exceeds the vehicle's pre-accident Actual Cash Value (ACV)"
      ],
      correct_option_index: 3,
      explanation: "A constructive total loss occurs when repair cost plus residual salvage value exceeds market pre-loss ACV.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "Under the standard property policy 'Appraisal Clause', how is a dispute over the amount of loss resolved between the insurer and the policyholder?",
      options: [
        "The insurer's CEO makes the final decision",
        "Each party selects a competent, independent appraiser; the two appraisers select a neutral umpire, and an agreement reached by any two of the three sets the binding loss valuation",
        "A coin toss",
        "The claim is cancelled and both parties pay $0"
      ],
      correct_option_index: 1,
      explanation: "The appraisal clause uses two independent appraisers and an umpire; agreement by any two establishes a binding loss figure.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In claims recovery, what does 'Inter-Company Arbitration' accomplish when two insurance carriers dispute fault in a multi-vehicle accident?",
      options: [
        "It forces both drivers to go to jail",
        "It doubles the deductible for both drivers",
        "It provides a binding, out-of-court dispute resolution forum where insurers resolve subrogation liability disputes efficiently without clogging civil courts",
        "It cancels both insurance companies' state licenses"
      ],
      correct_option_index: 2,
      explanation: "Inter-company arbitration allows carriers to resolve subrogation recovery disputes economically without filing civil lawsuits.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In insurance litigation, what is an 'Insurance Bad Faith' tort claim against a carrier?",
      options: [
        "A civil lawsuit alleging the insurer unreasonably and intentionally delayed, underpaid, or denied a valid claim without proper investigation or reasonable basis, exposing the insurer to punitive damages exceeding policy limits",
        "A claim where the policyholder forgot to pay their monthly premium",
        "A claim for damage caused by lightning",
        "An insurance claim filed by a church"
      ],
      correct_option_index: 0,
      explanation: "Bad faith occurs when a carrier unreasonably refuses to pay or investigate a valid claim, opening exposure to punitive damages.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In actuarial claims reserving, what are 'IBNR' (Incurred But Not Reported) reserves?",
      options: [
        "Money spent on television advertising",
        "Fines paid to the state insurance commissioner",
        "Reserves for claims that have already been settled and paid",
        "Statistical reserves established on the carrier's balance sheet to account for claims that have already occurred but have not yet been reported to the insurer (e.g. latent asbestos or environmental exposure)"
      ],
      correct_option_index: 3,
      explanation: "IBNR reserves ensure carriers maintain statutory capital for events that happened in the policy period but have not yet been reported.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In subrogation recovery, what is the 'Made Whole Doctrine' enforced in many state jurisdictions?",
      options: [
        "The insurance company must recover 100% of its money before paying the insured anything",
        "The policyholder must be fully compensated for their entire loss (including their full deductible) BEFORE the insurer is legally permitted to retain any subrogation recovery proceeds from a negligent third party",
        "All damaged cars must be repaired using brand new OEM parts",
        "Insureds must replace all damaged furniture"
      ],
      correct_option_index: 1,
      explanation: "The Made Whole Doctrine mandates that policyholders receive full recovery (including deductibles) before the insurer keeps subrogation funds.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In claims investigation, what is the legal effect of a 'Non-Waiver Agreement' executed between an adjuster and a policyholder?",
      options: [
        "It waives the policyholder's deductible",
        "It forces the policyholder to drop their claim",
        "It prevents the carrier from defending itself in court",
        "A signed bilateral agreement confirming that neither the insurer's investigation nor its defense of the claim shall be deemed a waiver of any policy defense or exclusion under the policy"
      ],
      correct_option_index: 3,
      explanation: "A Non-Waiver Agreement is a bilateral contract ensuring that investigating a loss does not forfeit the carrier's coverage defenses.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In property damage estimating, what is 'Xactimate' and how is it utilized in industry claims adjusting?",
      options: [
        "The industry-standard computer-aided estimating software that generates standardized line-item replacement and repair cost scopes based on regional labor and material price databases",
        "A drone used to inspect telephone poles",
        "An online tool for calculating life expectancy",
        "A credit scoring algorithm for mortgages"
      ],
      correct_option_index: 0,
      explanation: "Xactimate is the standard software used across property adjusters and contractors to calculate localized repair costs and materials.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #158.");
  console.log("Skill #158 update completed successfully!");
}

run();
