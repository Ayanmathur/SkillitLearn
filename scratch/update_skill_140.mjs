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

const skillId = "18298f2d-1804-4a8a-af9c-34e5e5bbc00f";

async function run() {
  console.log("Updating Skill #140: Medical Billing & Coding Basics (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Diagnostic Coding Systems and ICD-10-CM Conventions" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Procedural Coding: CPT, HCPCS Level II and Modifiers" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Revenue Cycle Management, Claims and Reimbursement" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Certified Professional Coder CPC & Health Information Management level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "ICD-10-CM Code Structure, Specificity and Extensions",
      order_index: 1,
      content: `### Diagnostic Code Architecture and Structure

1. Code Format:
   - 3 to 7 character alphanumeric structure (Category A00-Z99, Etiology, Anatomical Site, Severity).

2. 7th Character Extensions:
   - Initial Encounter ('A': active medical treatment), Subsequent Encounter ('D': routine healing and follow-up), and Sequela ('S': late complication resulting from a prior condition). Coding strictly to the highest level of specificity.`
    },
    {
      track_id: track1Id,
      title: "Coding Conventions: Excludes1, Excludes2 and Sequencing",
      order_index: 2,
      content: `### Tabular Instructional Notes and Logic Rules

1. Exclusion Notes:
   - Excludes1: Pure exclusion; the two conditions are mutually exclusive and can NEVER be billed together on the same claim.
   - Excludes2: Not included here; patient may have both distinct conditions concurrently, and both codes may be reported together.

2. Sequencing:
   - 'Code First' underlying disease before manifestation codes.`
    },
    {
      track_id: track1Id,
      title: "Social Determinants of Health (Z-Codes) and Morbidity",
      order_index: 3,
      content: `### Contextual Diagnoses and Risk Adjustment

1. Z-Codes (Z00-Z99):
   - Coding encounters for general medical examinations, prophylactic inoculations, family history, and Social Determinants of Health (SDOH: housing instability, food insecurity, economic hardship).

2. Hierarchical Condition Categories (HCC):
   - Accurate chronic disease coding directly driving risk-adjusted insurance capitation reimbursements.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "CPT Categories and Evaluation & Management (E/M) Codes",
      order_index: 1,
      content: `### Procedural Terminology and Clinical Encounters

1. CPT Category Structure:
   - Category I (5-digit numeric codes covering E/M, Surgery, Radiology, Pathology/Lab, Medicine).
   - Category II (performance measurement tracking).
   - Category III (emerging medical technologies).

2. E/M Coding (99202-99215):
   - Selecting outpatient office visit levels based on Medical Decision Making (MDM) or total clinician face-to-face time.`
    },
    {
      track_id: track2Id,
      title: "CPT Modifiers: -25, -59, -50 and Modifier Overuse Risks",
      order_index: 2,
      content: `### Procedural Modifiers and Unbundling Safeguards

1. Essential Modifiers:
   - Modifier -25: Significant, separately identifiable Evaluation and Management service performed on the same day as a minor surgical procedure.
   - Modifier -59: Distinct procedural service unbundling National Correct Coding Initiative (NCCI) edits.
   - Modifier -50: Bilateral procedure performed on both paired anatomical organs.`
    },
    {
      track_id: track2Id,
      title: "HCPCS Level II National Codes and Medical Necessity",
      order_index: 3,
      content: `### Supplies, Injectables and Coverage Determinations

1. HCPCS Level II (Alphanumeric A-V codes):
   - Billing Durable Medical Equipment (DMEPOS), prosthetic devices, parenteral medications, injectables, and ambulance transport.

2. Medical Necessity:
   - Satisfying CMS National Coverage Determinations (NCDs) and Local Coverage Determinations (LCDs) by linking valid ICD-10 diagnosis codes directly to billed CPT procedures.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Patient Intake, Insurance Verification and Prior Auth",
      order_index: 1,
      content: `### Front-End Revenue Cycle Management (RCM)

1. Preregistration:
   - Verifying active insurance eligibility, co-payments, annual deductibles, co-insurance percentages, and out-of-pocket maximums.

2. Prior Authorization:
   - Securing formal pre-service insurer approval for specialized surgeries, advanced diagnostic MRI/CT scans, and specialty medications to avoid non-covered denials.`
    },
    {
      track_id: track3Id,
      title: "Claims Forms: CMS-1500 (837P) vs UB-04 (837I) and EDI",
      order_index: 2,
      content: `### Claim Transmission and Clearinghouse Scrubbing

1. Claim Formats:
   - CMS-1500 (electronic ANSI 837P): Professional outpatient physician claims.
   - UB-04 / CMS-1450 (electronic ANSI 837I): Institutional hospital inpatient and facility claims.

2. Clearinghouse Scrubbing:
   - Automated pre-submission validation catching NPI errors, missing diagnosis pointers, and demographic mismatches before insurer transmission.`
    },
    {
      track_id: track3Id,
      title: "Adjudication, EOB/ERA, Denial Appeals and Compliance",
      order_index: 3,
      content: `### Post-Adjudication, Remittance and Audit Defense

1. Remittance Processing:
   - Parsing Electronic Remittance Advice (ERA 835) and Explanation of Benefits (EOB).
   - Resolving Claim Adjustment Reason Codes (CARC) and Remittance Advice Remark Codes (RARC).

2. Denials & Compliance:
   - Managing appeals for timely filing and medical necessity; adhering to HIPAA privacy and OIG compliance guidelines to prevent billing fraud.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #140.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In medical billing and insurance processing, what is the standard paper claim form (and its electronic ANSI 837P equivalent) used for professional outpatient physician billing?",
      options: [
        "W-2 Tax Form",
        "CMS-1500 Form (Electronic 837P)",
        "Form 1040",
        "UB-04 Form"
      ],
      correct_option_index: 1,
      explanation: "CMS-1500 (837P electronic) is the standard claim form used by physicians and outpatient clinicians.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In medical insurance terms, what is a 'Co-Payment' (Copay)?",
      options: [
        "The total price of the doctor's car",
        "A monthly fee to keep a driver's license",
        "The money the hospital pays the patient",
        "A fixed flat dollar amount (e.g. $25) that an insured patient is obligated to pay out-of-pocket at the time of receiving a healthcare service"
      ],
      correct_option_index: 3,
      explanation: "A copayment is a fixed dollar fee paid by the patient at the point of service under their insurance policy.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In ICD-10-CM diagnostic coding, what does the '7th Character Extension - A' indicate on an injury code?",
      options: [
        "Initial Encounter (the patient is receiving active medical treatment for the condition)",
        "Allergic reaction",
        "Ambulance ride",
        "Adult patient"
      ],
      correct_option_index: 0,
      explanation: "Extension 'A' designates the initial encounter while the patient is receiving active medical/surgical care.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What coding system published by the American Medical Association (AMA) is standardly used to report medical, surgical, and diagnostic procedures?",
      options: [
        "ISBN System",
        "ZIP Code System",
        "Current Procedural Terminology (CPT)",
        "Morse Code"
      ],
      correct_option_index: 2,
      explanation: "CPT (Current Procedural Terminology) codes report physician clinical, diagnostic, and surgical procedures.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In healthcare insurance, what is an 'Annual Deductible'?",
      options: [
        "The discount given to hospital employees",
        "The specific amount of out-of-pocket medical expenses a patient must pay each year before their insurance carrier begins covering covered medical benefits",
        "A penalty fee for being late to a doctor appointment",
        "The doctor's annual salary"
      ],
      correct_option_index: 1,
      explanation: "A deductible is the upfront annual dollar amount a policyholder pays before insurance cost-sharing kicks in.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In the ICD-10-CM Tabular List, what is the critical coding distinction between an 'Excludes1' note and an 'Excludes2' note?",
      options: [
        "Excludes1 is for children; Excludes2 is for adults",
        "Excludes1 is only used in dental billing",
        "Excludes1 means 'NOT CODED HERE' (the two conditions are mutually exclusive and can NEVER be billed together); Excludes2 means 'NOT INCLUDED HERE' (the patient may have both conditions at once, and both codes may be reported together)",
        "There is zero difference between them"
      ],
      correct_option_index: 2,
      explanation: "Excludes1 indicates mutually exclusive conditions (never coded together); Excludes2 allows concurrent coding if documented.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In procedural billing, when is CPT 'Modifier -25' properly appended to an Evaluation & Management (E/M) service code?",
      options: [
        "When a physician performs a significant, separately identifiable Evaluation and Management service on the same patient on the exact same day as a minor surgical procedure or other clinical service",
        "When the patient is 25 years old",
        "When the doctor is 25 minutes late",
        "When the bill is discounted by 25%"
      ],
      correct_option_index: 0,
      explanation: "Modifier -25 indicates a significant, separately identifiable E/M service performed on the same date as a minor procedure.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In hospital facility billing, which claim form (and its ANSI 837I electronic equivalent) is used for institutional inpatient hospital admissions and nursing facilities?",
      options: [
        "CMS-1500 Form",
        "W-4 Form",
        "IRS Form 990",
        "UB-04 Form (CMS-1450 / 837I electronic)"
      ],
      correct_option_index: 3,
      explanation: "UB-04 (CMS-1450 / 837I electronic) is used for institutional hospital inpatient, emergency room, and facility billing.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In healthcare reimbursement, what is the purpose of 'Prior Authorization' (Pre-Certification)?",
      options: [
        "To allow patients to choose their own doctor",
        "Obtaining formal advance approval from a health insurance plan before scheduling non-emergency surgeries, advanced imaging (MRI/CT), or expensive specialty medications to ensure coverage will be granted",
        "To check if the hospital has electricity",
        "Prior authorization is only used for buying hospital furniture"
      ],
      correct_option_index: 1,
      explanation: "Prior authorization requires insurer pre-approval confirming medical necessity before elective procedures or high-cost therapies.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What coding system is used to report Durable Medical Equipment (DME), prosthetics, ambulance transport, and injectable medications that do not have CPT Category I codes?",
      options: [
        "ICD-10-PCS",
        "SNOMED-CT",
        "HCPCS Level II (Healthcare Common Procedure Coding System)",
        "LOINC Codes"
      ],
      correct_option_index: 2,
      explanation: "HCPCS Level II national alphanumeric codes cover DMEPOS equipment, supplies, ambulance rides, and injectable pharmaceuticals.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In medical necessity verification, what role do CMS 'National Coverage Determinations' (NCDs) and 'Local Coverage Determinations' (LCDs) play during claim adjudication?",
      options: [
        "They establish formal administrative guidelines that specify which exact ICD-10-CM diagnosis codes provide valid medical necessity to justify reimbursement for specific CPT procedure codes; mismatched codes result in automatic claim denial",
        "They determine the geographical boundaries of US states",
        "They set the speed limits for ambulances",
        "They dictate how many nurses work in a hospital"
      ],
      correct_option_index: 0,
      explanation: "NCDs and LCDs define clinical diagnosis criteria justifying procedural necessity; claims without approved ICD-10 pairings are denied.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In revenue cycle claim remittance processing, what is the difference between 'CARC' and 'RARC' codes on an Explanation of Benefits / Electronic Remittance Advice (ERA 835)?",
      options: [
        "CARC is for cars; RARC is for airplanes",
        "CARC sets doctor pay; RARC sets hospital pay",
        "There is zero difference between them",
        "CARC (Claim Adjustment Reason Codes) explains WHY a claim or service line was adjusted or denied; RARC (Remittance Advice Remark Codes) provides additional, detailed explanatory context or required appeal documentation"
      ],
      correct_option_index: 3,
      explanation: "CARCs provide the primary financial adjustment reason, while RARCs supply supplemental explanatory remarks on remittances.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In healthcare value-based care and Medicare Advantage reimbursement, how do 'Hierarchical Condition Categories' (HCC) utilize ICD-10 diagnostic coding?",
      options: [
        "HCC codes determine how many parking passes a doctor receives",
        "Documented chronic condition ICD-10 codes map to HCC risk categories, calculating a patient's individual Risk Adjustment Factor (RAF) score to determine annual capitated insurance reimbursement payments to health systems",
        "HCC codes are used to order surgical equipment",
        "HCC codes automatically delete unpaid patient bills"
      ],
      correct_option_index: 1,
      explanation: "HCC models map chronic ICD-10 diagnoses into patient RAF risk scores, setting capitated payment rates in value-based care.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In medical coding compliance and anti-fraud regulations, what constitutes illegal 'Unbundling' (Fragmenting)?",
      options: [
        "Opening a box of medical gloves",
        "Discharging a patient from the hospital early",
        "Separately billing multiple individual component CPT codes for parts of a comprehensive procedure when a single all-inclusive CPT code exists that covers the entire surgical encounter, artificially inflating reimbursement",
        "Unbundling is a standard legal practice"
      ],
      correct_option_index: 2,
      explanation: "Unbundling is the fraudulent practice of billing individual component codes separately instead of a single bundled code to inflate fees.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In ICD-10-CM diagnostic guidelines, what is a 'Sequela' code (designated by 7th character extension 'S') and what is its mandatory sequencing rule?",
      options: [
        "A late residual effect or condition produced after the acute phase of an illness or injury has ended; the residual condition is sequenced FIRST, followed immediately by the sequela injury code with extension 'S'",
        "A code used only for senior citizens",
        "A sequela code must always be placed first on the claim",
        "Sequela codes can only be billed on weekends"
      ],
      correct_option_index: 0,
      explanation: "Sequela ('S') codes report residual complications of past injuries; guidelines mandate coding the residual condition first.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #140.");
  console.log("Skill #140 update completed successfully!");
}

run();
