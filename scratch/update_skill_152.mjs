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

const skillId = "4eb7e819-09c2-4961-9fc2-b73912782bed";

async function run() {
  console.log("Updating Skill #152: HR Policies & Compliance (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Employment Labor Law: FLSA, FMLA, ADA and Title VII" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Employee Handbooks, Workplace Investigations and PIPs" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Wage-Hour Audits, Classification and Terminations" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Labor Law Counsel & VP People Operations level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "FLSA Exempt vs Non-Exempt Classification and Overtime",
      order_index: 1,
      content: `### Wage and Hour Statutory Classifications

1. FLSA Exemption Tests:
   - Salary Basis Test, Salary Level Threshold, and Standard Duties Tests (Executive, Administrative, Professional, Computer, and Outside Sales).

2. Overtime Mandates:
   - Paying Non-Exempt employees 1.5x regular rate for hours worked over 40 in a workweek; strict time-tracking compliance.`
    },
    {
      track_id: track1Id,
      title: "FMLA Leave Entitlements and ADA Interactive Processes",
      order_index: 2,
      content: `### Medical Leaves and Disability Accommodations

1. FMLA Mandates:
   - 12 weeks unpaid, job-protected leave for serious health conditions or bonding (50+ employees within 75 miles, 1,250 hours worked).

2. ADA Interactive Process:
   - Collaborative dialogue exploring reasonable accommodations (ergonomic equipment, modified schedule) without causing undue employer hardship.`
    },
    {
      track_id: track1Id,
      title: "Title VII Discrimination, Disparate Impact and ADEA",
      order_index: 3,
      content: `### Civil Rights and Protected Class Governance

1. Discrimination Theories:
   - Disparate Treatment (intentional bias) vs Disparate Impact (neutral policy causing adverse selection violating the Four-Fifths 80% Rule).

2. ADEA Protections:
   - Prohibiting age-based discrimination for workers age 40 and older in hiring, promotions, and compensation.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Employee Handbook Architecture and Policy Disclaimers",
      order_index: 1,
      content: `### Policy Codification and Legal Safeguards

1. Handbook Architecture:
   - Prominent At-Will employment disclaimer, Equal Opportunity policy, Anti-Harassment protocols, Remote Work rules, and Code of Conduct.

2. Acknowledgment Receipts:
   - Mandating signed employee acknowledgment receipts annually to confirm receipt and understanding of updated policies.`
    },
    {
      track_id: track2Id,
      title: "Workplace Investigations and Anti-Harassment Protocols",
      order_index: 2,
      content: `### Impartial Investigative Execution

1. Investigation Protocol:
   - Promptly interviewing complainant, alleged wrongdoer, and third-party witnesses; gathering digital records and emails.

2. Findings & Anti-Retaliation:
   - Applying the Preponderance of the Evidence standard; enforcing strict anti-retaliation protections and appropriate corrective disciplinary actions.`
    },
    {
      track_id: track2Id,
      title: "Progressive Discipline and Performance Improvement Plans",
      order_index: 3,
      content: `### Corrective Action and Legal Defensibility

1. Progressive Stages:
   - Documented Verbal Counseling -> Formal Written Warning -> Performance Improvement Plan (PIP) -> Separation.

2. PIP Structure:
   - 30-to-60 day SMART goals, weekly check-in cadences, objective performance metrics, and explicit consequences of non-attainment.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "W-2 Employees vs 1099 Contractors: DOL Reality Tests",
      order_index: 1,
      content: `### Worker Classification and Tax Liabilities

1. Worker Classification Tests:
   - IRS Common Law behavioral, financial, and relationship control rules; DOL Economic Reality test (evaluating degree of control and financial dependence).

2. Misclassification Exposure:
   - Severe back tax liabilities, wage penalties, and overtime restitution for misclassifying employees as 1099 contractors.`
    },
    {
      track_id: track3Id,
      title: "I-9 Form Compliance, EEO-1 Filings and OSHA 300 Logs",
      order_index: 2,
      content: `### Federal Recordkeeping and Audit Readiness

1. Form I-9 Verification:
   - Completing Section 1 on Day 1; verifying original List A/B/C documents within 3 business days; retaining 3 years post-hire or 1 year post-termination.

2. Regulatory Filings:
   - Annual EEO-1 Component 1 demographic submissions (100+ employees); maintaining OSHA Form 300 workplace injury logs.`
    },
    {
      track_id: track3Id,
      title: "Involuntary Terminations, OWBPA and WARN Act Compliance",
      order_index: 3,
      content: `### Separation Governance and Layoff Mandates

1. Separation Execution:
   - Involuntary exit protocols, final paycheck timing laws, COBRA notices, and Older Workers Benefit Protection Act (OWBPA 21-day review and 7-day revocation).

2. WARN Act:
   - Mandating 60-day advance written notice for plant closings and mass layoffs affecting 50+ workers.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #152.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "Under the Fair Labor Standards Act (FLSA), what is the mandatory overtime pay rate for Non-Exempt employees who work over 40 hours in a single workweek?",
      options: [
        "1.5 times their regular hourly rate of pay (time-and-a-half)",
        "The exact same regular hourly rate",
        "Overtime is not paid to hourly workers",
        "Double their annual bonus"
      ],
      correct_option_index: 0,
      explanation: "The FLSA mandates 1.5x the regular rate of pay for all hours worked exceeding 40 in a single workweek for non-exempt employees.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "Under the Family and Medical Leave Act (FMLA), how many weeks of job-protected, unpaid leave are eligible employees entitled to per year?",
      options: [
        "1 week",
        "4 weeks",
        "Up to 12 weeks of unpaid, job-protected leave",
        "52 weeks"
      ],
      correct_option_index: 2,
      explanation: "FMLA grants eligible employees up to 12 workweeks of unpaid, job-protected leave per year for qualifying health/family reasons.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What federal employment law protects individuals age 40 and older from discrimination in hiring, promotion, discharge, and compensation?",
      options: [
        "OSHA Act",
        "The Age Discrimination in Employment Act (ADEA)",
        "The Clean Air Act",
        "The Digital Millennium Copyright Act"
      ],
      correct_option_index: 1,
      explanation: "ADEA specifically protects workers age 40 and older from age-based employment discrimination.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "Under federal Form I-9 compliance regulations, within how many business days of an employee's first day of work must the employer inspect original identification documents and complete Section 2?",
      options: [
        "30 days",
        "6 months",
        "1 year",
        "Within 3 business days of the employee's start date"
      ],
      correct_option_index: 3,
      explanation: "Section 2 of Form I-9 must be physically/virtually examined and signed within 3 business days of the first day of work.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In progressive discipline, what is a 'Performance Improvement Plan' (PIP)?",
      options: [
        "A formal, structured document establishing clear 30-to-60 day performance milestones, regular check-in schedules, and explicit consequences if standards are not met",
        "A company party plan",
        "An invitation to join the executive board",
        "A promotion announcement"
      ],
      correct_option_index: 0,
      explanation: "A PIP provides formal notice, objective performance metrics, timelines, and clear outcomes for underperforming employees.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "Under the Americans with Disabilities Act (ADA), what is the 'Interactive Process'?",
      options: [
        "Playing video games during office hours",
        "A mandatory computer programming test",
        "A speed-dating event for coworkers",
        "An ongoing, collaborative dialogue between the employer and a qualified employee with a disability to identify and implement reasonable workplace accommodations without imposing undue hardship"
      ],
      correct_option_index: 3,
      explanation: "The ADA interactive process is an ongoing good-faith dialogue exploring effective reasonable workplace accommodations.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In US labor law, what does the 'Worker Adjustment and Retraining Notification' (WARN) Act mandate for large employers planning mass layoffs?",
      options: [
        "Employers can fire everyone without notice via text message",
        "Employers with 100+ full-time employees must provide at least 60 calendar days advance written notice before initiating a plant closing or mass layoff",
        "Employers must pay 10 years of severance pay",
        "The WARN Act only applies to government military bases"
      ],
      correct_option_index: 1,
      explanation: "The WARN Act requires 60 days advance written notice for mass layoffs affecting 50+ workers to give employees transition time.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In Title VII discrimination law, what is the 'Four-Fifths (80%) Rule' used to demonstrate in Equal Employment Opportunity (EEO) audits?",
      options: [
        "Disparate Impact: if the selection rate for a protected demographic group is less than 80% (4/5ths) of the rate for the group with the highest selection rate, the hiring practice is statistically presumed to have adverse impact",
        "That employees must work 80% of the year",
        "That 80% of profits must go to charity",
        "That 4 out of 5 managers must approve a new hire"
      ],
      correct_option_index: 0,
      explanation: "The 80% (4/5ths) rule is the standard mathematical benchmark used by the EEOC to detect disparate adverse impact in selection practices.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "Under the Older Workers Benefit Protection Act (OWBPA), what legal review period MUST be provided to an employee age 40 or older when presenting an individual severance separation agreement?",
      options: [
        "24 hours",
        "3 days",
        "At least 21 calendar days to review and consider the agreement, plus a mandatory 7-day post-signing revocation period",
        "1 year"
      ],
      correct_option_index: 2,
      explanation: "OWBPA mandates a 21-day consideration period (45 days for group layoffs) and a 7-day revocation window for workers age 40+.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In workplace harassment and misconduct investigations, what standard of proof is standardly used by HR investigators to determine findings?",
      options: [
        "Beyond a Reasonable Doubt (100% certainty)",
        "Clear and Convincing Evidence",
        "Random coin toss",
        "Preponderance of the Evidence (it is more likely than not that the alleged misconduct occurred based on credible facts and testimony)"
      ],
      correct_option_index: 3,
      explanation: "Preponderance of the evidence ('more likely than not', >50% probability) is the standard evidentiary threshold for HR workplace investigations.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In FLSA exemption audits, what are the three mandatory criteria that MUST ALL be satisfied for an employee to be legally classified as Exempt under the Administrative Exemption?",
      options: [
        "Must wear business attire, work in an office, and own company stock",
        "Must be paid on a Salary Basis, meet the statutory minimum Salary Level, and their primary duty must be office work directly related to general business management requiring the exercise of discretion and independent judgment on significant matters",
        "Must have a college degree and work 50 hours per week",
        "Must supervise at least 10 full-time employees"
      ],
      correct_option_index: 1,
      explanation: "FLSA Administrative Exemption requires meeting the salary basis, salary threshold, and primary duties involving independent judgment on significant matters.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "Under the Department of Labor (DOL) Economic Reality Test, which factor is PRIMARY in determining whether a worker is an Independent Contractor (1099) vs a W-2 Employee?",
      options: [
        "Whether the worker has a business card",
        "What the worker's job title is on LinkedIn",
        "The degree of behavioral control the employer exercises over how work is performed, the worker's opportunity for profit or loss, the permanence of the relationship, and whether the work is integral to the business",
        "Whether the worker uses a Windows or Mac laptop"
      ],
      correct_option_index: 2,
      explanation: "The DOL Economic Reality Test examines economic dependence, behavioral control, profit/loss risk, and integration into the core business.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "What is the mandatory federal recordkeeping retention period for Form I-9 Employment Eligibility Verification forms?",
      options: [
        "Retained for 3 years after the date of hire, or 1 year after the date employment ends (termination), whichever date is LATER",
        "Destroyed immediately on the employee's first day",
        "Retained permanently for 100 years",
        "Kept for 30 days only"
      ],
      correct_option_index: 0,
      explanation: "USCIS requires retaining Form I-9 for 3 years from hire date or 1 year after termination date, whichever is later.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In employment law, what is the critical legal difference between 'Disparate Treatment' and 'Disparate Impact' under Title VII of the Civil Rights Act?",
      options: [
        "Disparate treatment is for men; disparate impact is for women",
        "Disparate impact is a criminal felony; disparate treatment is a misdemeanor",
        "Both terms are identical in employment litigation",
        "Disparate Treatment involves intentional discrimination against protected individuals; Disparate Impact involves facially neutral employment practices/tests that disproportionately exclude protected groups without business necessity"
      ],
      correct_option_index: 3,
      explanation: "Disparate treatment requires showing discriminatory intent; disparate impact proves discriminatory effect from neutral policies.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "Why is a prominent 'At-Will Employment Disclaimer' legally necessary on the introductory page of an Employee Handbook?",
      options: [
        "To make the handbook look professional",
        "To explicitly clarify that the handbook is NOT an express or implied employment contract, preserving the right of either the employer or employee to terminate employment at any time for any lawful reason",
        "To prevent employees from asking for paid holidays",
        "At-will disclaimers are only required in European countries"
      ],
      correct_option_index: 1,
      explanation: "At-will disclaimers prevent handbook policies from being construed as binding employment contracts that waive at-will termination rights.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #152.");
  console.log("Skill #152 update completed successfully!");
}

run();
