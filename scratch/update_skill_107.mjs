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

const skillId = "a36a9538-b3df-49cc-bf49-afc3d06691d1";

async function run() {
  console.log("Updating Skill #107: Payroll Fundamentals (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Compensation Structures, FLSA Overtime and Worker Classification" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Statutory Tax Withholdings, FICA and Employer Payroll Taxes" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Deductions, Tax Filings, Payroll Journal Entries and Year-End" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Certified Payroll Professional CPP & Payroll Director level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Fair Labor Standards Act (FLSA) and Exemption Tests",
      order_index: 1,
      content: `### Federal Wage Laws and Exemption Classification

1. The FLSA Framework:
   - Governs federal minimum wage, overtime pay, recordkeeping, and youth employment standards.

2. The 3-Part Exemption Test:
   - 1. Salary Level Test: Earning at or above the statutory federal weekly salary threshold.
   - 2. Salary Basis Test: Receiving a predetermined, fixed salary regardless of hours worked or work quality.
   - 3. Primary Duties Test: Performing exempt responsibilities under Executive, Administrative, Professional, Computer, or Outside Sales classifications.`
    },
    {
      track_id: track1Id,
      title: "Regular Rate of Pay (RROP) and Overtime Mathematics",
      order_index: 2,
      content: `### Overtime Mechanics and Non-Discretionary Inclusions

1. The Overtime Mandate:
   - 1.5 times the employee's Regular Rate of Pay (RROP) for all hours worked over 40 in a single 7-day workweek.

2. Calculating Regular Rate of Pay (RROP):
   - Formula: RROP = (Base Hourly Wages + Non-Discretionary Bonuses + Commissions + Shift Differentials) / Total Hours Worked.
   - Discretionary holiday gifts and business expense reimbursements are legally excluded from the RROP calculation.`
    },
    {
      track_id: track1Id,
      title: "W-2 Employees vs 1099-NEC Contractors and Classification",
      order_index: 3,
      content: `### IRS Common Law Rules and Misclassification Liabilities

1. IRS Common Law Control Tests:
   - Behavioral Control: Directing when, where, and how work is done, including training and equipment mandates.
   - Financial Control: Significant investment in tools, unreimbursed expenses, and opportunity for profit or loss.
   - Type of Relationship: Employee benefits, permanency, and integration into core business operations.

2. Penalties:
   - Misclassifying employees as 1099 independent contractors triggers severe back taxes, unpaid overtime liabilities, and IRS statutory penalties.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Employee Statutory Withholdings: FIT, SIT and Form W-4",
      order_index: 1,
      content: `### Income Tax Withholding and Form W-4 Inputs

1. Federal Income Tax (FIT) Calculations:
   - Computed using employee Form W-4 elections (marital filing status, multiple jobs checkbox, dependents credits, and additional withholding amounts).
   - Applied against IRS Publication 15-T Percentage Method or Wage Bracket Method tables.

2. State and Local Income Taxes (SIT and LIT):
   - Deducted based on employee work location and residence state tax withholding laws.`
    },
    {
      track_id: track2Id,
      title: "FICA Taxes: Social Security, Medicare and Additional Medicare",
      order_index: 2,
      content: `### FICA Structure and Threshold Caps

1. Social Security Tax (OASDI):
   - 6.2% Employee Withholding + 6.2% Employer Match (12.4% total) applied up to the annual Social Security Wage Base cap.

2. Medicare Tax (HI):
   - 1.45% Employee Withholding + 1.45% Employer Match (2.90% total) on all gross wages with zero wage limit.

3. Additional Medicare Tax:
   - 0.9% employee-only withholding on compensation exceeding $200,000 (single) or $250,000 (married filing jointly), with zero employer match.`
    },
    {
      track_id: track2Id,
      title: "Employer-Paid Payroll Taxes: FUTA, SUTA and Experience",
      order_index: 3,
      content: `### Unemployment Insurance and Experience Ratings

1. Federal Unemployment Tax Act (FUTA):
   - Gross rate of 6.0% on the first $7,000 of annual wages per employee, reduced by the maximum 5.4% state credit to an effective net rate of 0.6% ($42 maximum per employee per year).

2. State Unemployment Tax Act (SUTA):
   - Employer-funded state unemployment tax calculated on state taxable wage bases, determined by the employer's historical experience rating (unemployment claims history).`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Pre-Tax vs Post-Tax Deductions and Section 125 Plans",
      order_index: 1,
      content: `### Tax-Advantaged Benefits and Garnishments

1. Pre-Tax Deductions (IRC Section 125 Cafeteria Plans):
   - Traditional 401(k), Health Savings Accounts (HSA), Flexible Spending Accounts (FSA), and pre-tax healthcare premiums. These reduce gross wages subject to FIT, FICA, and FUTA.

2. Post-Tax Deductions:
   - Roth 401(k) contributions and statutory Wage Garnishments (child support, tax levies, creditor judgments) subject to Consumer Credit Protection Act (CCPA) disposable earnings limits.`
    },
    {
      track_id: track3Id,
      title: "Federal Tax Deposit Schedules, Form 941 and Form 940",
      order_index: 2,
      content: `### Tax Remittance Schedules and Quarterly Returns

1. IRS Deposit Schedules:
   - Monthly Depositor: Taxes deposited by the 15th of the following month (if lookback tax liability <= $50,000).
   - Semi-Weekly Depositor: Taxes deposited within 3 business days of payday (if lookback liability > $50,000).
   - $100,000 Next-Day Rule: Immediate next-business-day deposit required if accumulated taxes reach $100,000.

2. Federal Filings:
   - Form 941: Quarterly reporting of FIT and FICA.
   - Form 940: Annual reporting of FUTA taxes.`
    },
    {
      track_id: track3Id,
      title: "Payroll Accounting Journal Entries and Year-End Compliance",
      order_index: 3,
      content: `### General Ledger Payroll Entries and Year-End Reporting

1. Standard Payroll Journal Entry:
   - Debit: Gross Salaries/Wages Expense.
   - Debit: Employer Payroll Tax Expense (Employer FICA + FUTA + SUTA).
   - Credit: FIT, SIT, FICA, FUTA, SUTA Taxes Payable (balance sheet liabilities).
   - Credit: Net Cash / Wages Payable (actual net employee disbursements).

2. Year-End Reporting:
   - Form W-2 issued to employees and SSA; Form 1099-NEC issued to independent contractors by January 31.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #107.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "What are the two components of FICA (Federal Insurance Contributions Act) taxes withheld from employee paychecks?",
      options: [
        "Sales tax and Property tax",
        "Social Security tax (6.2%) and Medicare tax (1.45%)",
        "Federal Income tax and State Income tax",
        "FUTA and SUTA unemployment taxes"
      ],
      correct_option_index: 1,
      explanation: "FICA consists of Social Security (6.2%) and Medicare (1.45%), matched equally by the employer.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "Under the Fair Labor Standards Act (FLSA), at what minimum multiplier must non-exempt employees be paid for hours worked beyond 40 in a workweek?",
      options: [
        "1.0x (Regular hourly pay)",
        "3.0x (Triple time)",
        "Zero extra pay",
        "1.5x the employee's regular rate of pay (Time and a half)"
      ],
      correct_option_index: 3,
      explanation: "The FLSA mandates overtime pay at a minimum of 1.5 times the employee's regular rate of pay for hours over 40.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What is the standard net effective FUTA (Federal Unemployment Tax Act) tax rate paid by employers on the first $7,000 of an employee's annual wages?",
      options: [
        "0.6% ($42 maximum per employee per year, after the standard 5.4% state credit is applied against the 6.0% gross rate)",
        "15.0%",
        "6.2%",
        "0.0%"
      ],
      correct_option_index: 0,
      explanation: "The net FUTA rate is 0.6% ($42 max per employee) after applying the standard 5.4% maximum state credit.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What IRS tax document is provided to an independent contractor by January 31 to report non-employee compensation of $600 or more?",
      options: [
        "Form W-4",
        "Form W-2",
        "Form 1099-NEC",
        "Form 941"
      ],
      correct_option_index: 2,
      explanation: "Form 1099-NEC is used to report non-employee compensation paid to independent contractors.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "Which of the following is classified as a 'Pre-Tax' deduction under an IRC Section 125 Cafeteria Plan?",
      options: [
        "Traditional 401(k) contributions and employer-sponsored health insurance premiums (which reduce taxable income for FIT and FICA)",
        "Roth 401(k) contributions",
        "Court-ordered child support wage garnishments",
        "Voluntary union dues"
      ],
      correct_option_index: 0,
      explanation: "Traditional 401(k) and Section 125 health premiums are deducted pre-tax, reducing gross taxable income for FIT and FICA.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "An employee works 45 hours in a workweek at an hourly base wage of $20/hour and also earns a $100 non-discretionary production bonus. What is the employee's Regular Rate of Pay (RROP) for calculating overtime?",
      options: [
        "$20.00 per hour",
        "$25.00 per hour",
        "$22.22 per hour (calculated as: ($900 base pay + $100 bonus) / 45 total hours)",
        "$30.00 per hour"
      ],
      correct_option_index: 2,
      explanation: "RROP includes non-discretionary bonuses: ($900 base + $100 bonus) / 45 hours = $1,000 / 45 = $22.22/hour.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In federal payroll taxation, what are the rules regarding the 'Additional Medicare Tax' of 0.9%?",
      options: [
        "It is an employee-only tax withheld on compensation exceeding $200,000 (single) or $250,000 (married), with zero employer matching requirement",
        "It is paid 100% by the employer with zero employee deduction",
        "It applies only to employees under age 25",
        "It replaces standard Social Security tax"
      ],
      correct_option_index: 0,
      explanation: "Additional Medicare Tax is 0.9% withheld on employee wages exceeding $200,000 without an employer match.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What are the three core tests that must ALL be satisfied for an employee to be legally classified as 'Exempt' from overtime under the FLSA White-Collar exemptions?",
      options: [
        "Age Test, Education Test, and Uniform Test",
        "Citizenship Test, Background Check, and Drug Screen",
        "Commission Test, Direct Deposit Test, and Contract Test",
        "Salary Level Test, Salary Basis Test (guaranteed predetermined salary), and Primary Duties Test (Executive, Administrative, or Professional)"
      ],
      correct_option_index: 3,
      explanation: "FLSA exemption requires meeting the Salary Level, Salary Basis, and specific Primary Duties tests.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What IRS form is filed quarterly by employers to report federal income tax withheld, employee Social Security/Medicare tax, and the employer's matching FICA tax?",
      options: [
        "Form 1040",
        "Form 941 (Employer's Quarterly Federal Tax Return)",
        "Form 940",
        "Form W-3"
      ],
      correct_option_index: 1,
      explanation: "Form 941 is the quarterly tax return filed by employers to reconcile FIT withholding and FICA taxes.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In payroll accounting, what is the 'Lookback Period' used by the IRS to determine whether an employer must follow a Monthly or Semi-Weekly tax deposit schedule?",
      options: [
        "The past 10 years of business tax returns",
        "The current calendar month only",
        "A 12-month period covering four consecutive calendar quarters ending on June 30 of the prior year (if total tax liability was > $50,000, employer must deposit semi-weekly)",
        "The company's founding fiscal year"
      ],
      correct_option_index: 2,
      explanation: "The lookback period spans the 4 quarters ending June 30 of the prior year; liabilities over $50k require semi-weekly deposits.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In recording a $100,000 gross payroll where employees have $15,000 in FIT withheld, $7,650 in employee FICA withheld, and the employer incurs $7,650 in matching FICA plus $600 in unemployment taxes, what is the total debit to company expense accounts?",
      options: [
        "$108,250 (consisting of $100,000 Gross Wages Expense + $8,250 Employer Payroll Tax Expense)",
        "$100,000",
        "$77,350",
        "$115,900"
      ],
      correct_option_index: 0,
      explanation: "Total employer cost is Gross Wages ($100k) + Employer Taxes ($7,650 FICA + $600 FUTA/SUTA) = $108,250 in total expense debits.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In IRS payroll deposit compliance, what is the '$100,000 Next-Day Deposit Rule'?",
      options: [
        "Employers who earn $100,000 profit must pay bonus taxes",
        "Employees making over $100,000 are exempt from FICA",
        "Employers must keep $100,000 in cash at all times",
        "If an employer accumulates $100,000 or more in undeposited employment taxes on any day during a deposit period, the entire amount must be deposited by the close of the next business day"
      ],
      correct_option_index: 3,
      explanation: "Accumulating $100k+ in undeposited employment taxes triggers an immediate mandatory next-business-day electronic deposit.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "Under the Consumer Credit Protection Act (CCPA), what is the general federal statutory limit on the amount of an employee's disposable earnings that can be garnished for commercial creditor debts?",
      options: [
        "100% of all earnings",
        "Lesser of 25% of disposable weekly earnings OR the amount by which weekly disposable earnings exceed 30 times the federal minimum wage",
        "50% of gross salary",
        "Commercial creditor garnishments are illegal"
      ],
      correct_option_index: 1,
      explanation: "CCPA limits commercial creditor garnishments to 25% of disposable earnings or the excess over 30x the federal minimum wage.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In state unemployment taxation (SUTA), how does an employer's 'Experience Rating' impact their state unemployment tax rate?",
      options: [
        "It measures how many years the CEO has worked in the industry",
        "All companies in a state pay the exact same flat SUTA rate regardless of history",
        "Employers with higher numbers of former employees filing successful unemployment claims are assigned higher SUTA tax rates to fund the state unemployment trust fund",
        "It lowers the company's federal income tax"
      ],
      correct_option_index: 2,
      explanation: "SUTA rates increase for employers whose former employees draw frequent unemployment benefits, reflecting higher risk.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "What constitutes 'Constructive Receipt' of wages in payroll taxation, and why does it dictate the calendar year in which wages and tax withholdings must be reported?",
      options: [
        "Wages are considered paid and taxable when they are credited to an employee's account or made unconditionally available without substantial limitation, regardless of when the paycheck is physically cashed",
        "When an employee signs their employment contract",
        "When the company prepares its annual budget",
        "When the employee turns 65"
      ],
      correct_option_index: 0,
      explanation: "Constructive receipt occurs when funds are made available without restriction (e.g. direct deposit date), dictating the tax year.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #107.");
  console.log("Skill #107 update completed successfully!");
}

run();
