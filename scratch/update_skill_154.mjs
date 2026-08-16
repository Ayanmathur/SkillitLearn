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

const skillId = "4f11931a-a4c1-46ca-af6b-24fa3d84bd61";

async function run() {
  console.log("Updating Skill #154: Compensation & Benefits Basics (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Compensation Architecture, Salary Bands and Compa-Ratio" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Healthcare Plans, HSAs, 401(k) and ERISA Compliance" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Total Rewards, Variable Incentives and Executive Perks" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Certified Compensation Professional CCP level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Job Leveling Frameworks and Market Salary Benchmarking",
      order_index: 1,
      content: `### Job Evaluation and Market Pricing

1. Leveling Frameworks:
   - Establishing consistent job evaluation points (Radford / Mercer / Hay Group levels) evaluating scope, complexity, and impact.

2. Market Benchmarking:
   - Surveying peer compensation data across 25th, 50th (median), and 75th percentiles to define competitive target market positioning.`
    },
    {
      track_id: track1Id,
      title: "Salary Band Architecture: Min, Midpoint, Max and Spread",
      order_index: 2,
      content: `### Grade Structures and Range Spreads

1. Band Geometry:
   - Defining salary grades with a Minimum, Midpoint (market anchor for fully proficient performance), and Maximum.

2. Range Spread:
   - Calculating range spread ((Max - Min) / Min), standardly 30% to 50% for technical and managerial roles with planned grade overlap.`
    },
    {
      track_id: track1Id,
      title: "Compa-Ratio Mathematics and Pay Equity Auditing",
      order_index: 3,
      content: `### Internal Equity and Compa-Ratio Analytics

1. Compa-Ratio Calculation:
   - Compa-Ratio = (Actual Salary / Grade Midpoint), where 1.00 represents market midpoint (0.80 to 1.20 standard distribution).

2. Pay Equity Audits:
   - Analyzing multivariate wage regressions to eliminate gender and racial pay disparities; complying with state Pay Transparency laws.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Healthcare Architectures: HDHPs, PPOs, HSAs vs FSAs",
      order_index: 1,
      content: `### Group Health Plans and Tax-Advantaged Accounts

1. Plan Structures:
   - Preferred Provider Organizations (PPOs: co-pays/co-insurance) vs High-Deductible Health Plans (HDHPs: paired with HSAs).

2. HSA vs FSA Tax Mechanics:
   - Health Savings Account (HSA: triple-tax-advantaged, portable, unspent funds roll over permanently) vs Flexible Spending Account (FSA: use-it-or-lose-it annual forfeiture).`
    },
    {
      track_id: track2Id,
      title: "Defined Contribution 401(k) Plans, Matching and Vesting",
      order_index: 2,
      content: `### Retirement Security and Corporate Matches

1. 401(k) Architecture:
   - Pre-tax and Roth employee deferrals paired with employer matching formulas (e.g. 100% match on first 3% plus 50% match on next 2%).

2. Employer Vesting Schedules:
   - Graded vesting (20% per year over 5 years) vs Cliff vesting (100% after 3 years) for employer contribution balances.`
    },
    {
      track_id: track2Id,
      title: "ERISA Governance, Form 5500 and Non-Discrimination Tests",
      order_index: 3,
      content: `### Fiduciary Compliance and Federal Oversight

1. ERISA Mandates:
   - Enforcing fiduciary standards, Summary Plan Descriptions (SPDs), and annual Form 5500 regulatory filings.

2. Non-Discrimination Testing:
   - Conducting annual ADP/ACP tests to ensure 401(k) benefits do not disproportionately favor Highly Compensated Employees (HCEs).`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Total Rewards Statements and The 30% Benefits Load",
      order_index: 1,
      content: `### Communicating Holistic Employee Value

1. Total Rewards Communication:
   - Visualizing the full compensation breakdown beyond base pay: employer-paid health premiums, 401(k) matches, FICA payroll taxes, life/disability insurance, and PTO value.

2. Benefits Load Factor:
   - Demonstrating that benefits add 30% to 40% in total financial value on top of annual base salary.`
    },
    {
      track_id: track3Id,
      title: "Variable Pay Design: Short-Term Incentives and Bonuses",
      order_index: 2,
      content: `### Incentive Pay and Performance Formulas

1. Short-Term Incentives (STI):
   - Annual bonus structures combining Company Performance Multipliers (e.g. EBITDA / Revenue attainment) with Individual Performance Rating Multipliers.

2. Sales Compensation:
   - On-Target Earnings (OTE) with progressive commission accelerator tiers and contractual clawback provisions for customer churn.`
    },
    {
      track_id: track3Id,
      title: "Voluntary Benefits, EAPs and Modern Wellness Perks",
      order_index: 3,
      content: `### Holistic Well-Being and Lifestyle Benefits

1. Modern Benefits Portfolio:
   - Mental health Employee Assistance Programs (EAPs), short-term and long-term disability (STD/LTD), fertility/adoption benefits, and student loan repayment subsidies.

2. Voluntary Perks:
   - Pre-tax commuter benefits, legal services plans, and wellness subsidies driving holistic employee retention.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #154.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In compensation analytics, what is the mathematical formula for calculating an employee's 'Compa-Ratio'?",
      options: [
        "Compa-Ratio = (Employee's Actual Salary / Salary Band Midpoint)",
        "Compa-Ratio = (Employee's Age / Years at Company)",
        "Compa-Ratio = (Total Company Revenue / Number of Employees)",
        "Compa-Ratio = (Bonus / Base Salary)"
      ],
      correct_option_index: 0,
      explanation: "Compa-Ratio = (Actual Salary / Band Midpoint); a ratio of 1.00 indicates an employee is paid exactly at market midpoint.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What unique 'Triple-Tax Advantage' is provided by a Health Savings Account (HSA) paired with a High-Deductible Health Plan (HDHP)?",
      options: [
        "It pays triple interest on savings accounts",
        "It eliminates all federal income tax permanently",
        "Contributions are tax-deductible (pre-tax), investment earnings grow 100% tax-free, and withdrawals for qualified medical expenses are 100% tax-free",
        "It provides triple health insurance coverage"
      ],
      correct_option_index: 2,
      explanation: "HSAs are triple-tax advantaged: pre-tax contributions, tax-free growth, and tax-free withdrawals for medical expenses.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What is the primary operational difference between a Health Savings Account (HSA) and a Flexible Spending Account (FSA)?",
      options: [
        "FSAs are for dental; HSAs are for vision",
        "HSA funds are owned by the employee, portable, and roll over year-after-year permanently; FSA funds are subject to an annual 'use-it-or-lose-it' rule with forfeiture of unspent balances",
        "FSAs are only available to executives",
        "There is zero difference between them"
      ],
      correct_option_index: 1,
      explanation: "HSAs roll over indefinitely and are portable between employers; FSAs forfeit unspent balances annually.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In employee benefits architecture, what does a 'Total Rewards Statement' show an employee?",
      options: [
        "A list of company holiday dates",
        "A schedule of all company meetings",
        "The employee's performance review rating",
        "A comprehensive financial summary showing total monetary value including base salary, bonuses, employer 401(k) matches, health insurance subsidies, FICA taxes, and paid time off"
      ],
      correct_option_index: 3,
      explanation: "Total Rewards Statements illustrate the full holistic financial value of employment beyond base pay.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What is an 'Employee Assistance Program' (EAP)?",
      options: [
        "A confidential, employer-funded program offering short-term professional counseling, mental health support, substance abuse resources, and crisis assistance for employees and their families",
        "A software tool for writing resumes",
        "A program where employees assist the CEO",
        "A government unemployment office"
      ],
      correct_option_index: 0,
      explanation: "EAPs provide free, confidential psychological counseling and life resources to support employee mental health and well-being.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In salary band structure design, what does the 'Band Midpoint' represent?",
      options: [
        "The lowest starting salary in the company",
        "The highest salary paid to the CEO",
        "The average age of team members",
        "The competitive market consensus rate (typically 50th percentile) for a fully experienced, fully competent employee performing all duties of the role"
      ],
      correct_option_index: 3,
      explanation: "The midpoint is anchored to market median (50th percentile) for a fully proficient performer in that grade.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In retirement benefit plans, what is the fundamental difference between a 'Defined Benefit Plan' (traditional pension) and a 'Defined Contribution Plan' (401k)?",
      options: [
        "Pensions are illegal; 401ks are mandatory",
        "A Defined Benefit plan guarantees a specific monthly dollar retirement income for life backed by the employer; a Defined Contribution plan specifies what goes in today, but retirement payouts depend on market investment returns",
        "401k plans are only for government workers",
        "Defined benefit plans are funded by Bitcoin"
      ],
      correct_option_index: 1,
      explanation: "Defined benefit plans promise a fixed lifetime payout; defined contribution plans (401k) depend on individual market investment growth.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "Under ERISA compliance, what is the purpose of mandatory 'Non-Discrimination Testing' (ADP and ACP tests) on corporate 401(k) plans?",
      options: [
        "To ensure that Highly Compensated Employees (HCEs) and executives do not receive disproportionate tax-deferred contribution benefits compared to Non-Highly Compensated Employees (NHCEs)",
        "To test if employees know how to invest in stocks",
        "To check the age of plan participants",
        "To eliminate all employer matches"
      ],
      correct_option_index: 0,
      explanation: "ERISA non-discrimination testing ensures 401(k) plans benefit all employees equitably, preventing exclusive executive tax sheltering.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In compensation geometry, what is 'Range Spread' and how is it standardly calculated?",
      options: [
        "The distance an employee travels to work",
        "The number of job levels in a department",
        "The percentage width of a salary grade calculated as (Maximum - Minimum) / Minimum, typically 30% to 50% for technical and professional roles",
        "The total bonus budget divided by employee headcount"
      ],
      correct_option_index: 2,
      explanation: "Range Spread = (Max - Min) / Min; standard 30-50% spreads allow career progression and merit raises within a single job grade.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In sales compensation architecture, what is an 'Accelerator' in commission plan design?",
      options: [
        "A fast car given to the top salesperson",
        "A penalty fee for missing quarterly quotas",
        "An automated email tool for cold outreach",
        "A progressive compensation tier where the commission rate increases significantly (e.g. from 10% to 20%) on all revenue generated AFTER an account executive surpasses 100% of their sales quota"
      ],
      correct_option_index: 3,
      explanation: "Accelerators increase commission percentages once quota is exceeded, driving hyper-performance and exceeding enterprise targets.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In corporate total rewards budgeting, what is the 'Benefits Load Factor' (Burden Rate) and what percentage of base salary does it standardly represent?",
      options: [
        "The weight of an employee's computer equipment",
        "The additional enterprise cost of mandatory taxes and benefits (employer FICA/FUTA, healthcare premiums, 401k match, worker's comp, disability), typically adding 30% to 40% on top of an employee's annual base salary",
        "The percentage of employees who take maternity leave",
        "The cost of office snacks"
      ],
      correct_option_index: 1,
      explanation: "The benefits load factor accounts for the 30-40% additional cost of taxes, health plans, and retirement matches above base payroll.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "If an employee has a Compa-Ratio of 0.82 in their salary grade, what does this indicate to a compensation analyst?",
      options: [
        "The employee is overpaid by 82%",
        "The employee should be terminated immediately",
        "The employee is paid at 82% of the market midpoint, typical for an entry-level new hire or newly promoted individual developing proficiency who has room for progressive salary growth",
        "The employee has worked at the company for 82 months"
      ],
      correct_option_index: 2,
      explanation: "A compa-ratio of 0.82 indicates pay near the bottom quartile (82% of midpoint), appropriate for developing or newly promoted staff.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In employer health plan funding, what is the core structural difference between a 'Fully-Insured Plan' and a 'Self-Insured (Self-Funded) Plan'?",
      options: [
        "In a Fully-Insured plan, the employer pays fixed premiums to an insurance carrier who assumes all claim risk; in a Self-Insured plan, the employer directly pays employee medical claims out of corporate cash flow and contracts a TPA for claim administration",
        "Fully-insured plans are only for hospitals; self-insured are for schools",
        "Self-insured plans do not cover doctor visits",
        "There is zero financial difference between them"
      ],
      correct_option_index: 0,
      explanation: "Self-insured employers directly absorb claim risk and pay actual medical costs, whereas fully-insured employers pay fixed premiums.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In incentive design, what are 'Clawback Provisions' in executive and sales compensation agreements?",
      options: [
        "Physical gloves worn by executives",
        "A bonus given to employees who work on weekends",
        "A tax credit for buying office furniture",
        "Legally binding contractual clauses that require employees or executives to repay previously disbursed bonuses or commissions if financial misstatements, fraud, or immediate customer contract cancellations occur"
      ],
      correct_option_index: 3,
      explanation: "Clawback provisions protect companies by forcing reimbursement of incentive pay if revenue is restated or deals churn prematurely.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In modern compensation governance, what is the primary compliance requirement introduced by state 'Pay Transparency Laws' (such as in CA, NY, CO, WA)?",
      options: [
        "Publishing all employee bank account numbers online",
        "Mandating that employers include the bona fide good-faith salary range or hourly wage scale in all public job postings and internal promotion notices",
        "Prohibiting employees from discussing their salaries with coworkers",
        "Requiring all employees to be paid the exact same wage"
      ],
      correct_option_index: 1,
      explanation: "Pay transparency statutes legally mandate posting good-faith salary ranges on all job listings to promote pay equity and reduce wage gaps.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #154.");
  console.log("Skill #154 update completed successfully!");
}

run();
