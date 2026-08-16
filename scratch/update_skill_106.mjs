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

const skillId = "911d754c-3d50-4e14-85d8-a6fc9db199c0";

async function run() {
  console.log("Updating Skill #106: Bookkeeping Basics (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Double-Entry Mechanics, DEALER Rules and Chart of Accounts" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: The Accounting Cycle, General Ledger and Trial Balance" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Accrual Adjustments, Depreciation and Period-End Closing" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Certified Public Accountant & Accounting Faculty level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Fundamental Accounting Equation and Double-Entry Physics",
      order_index: 1,
      content: `### Double-Entry Foundations and Balance Physics

1. Luca Pacioli's Double-Entry Principle:
   - Every financial transaction impacts a minimum of two accounts, preserving continuous mathematical equilibrium.

2. The Fundamental Accounting Equation:
   - Assets = Liabilities + Equity.

3. The Expanded Accounting Equation:
   - Assets = Liabilities + Contributed Capital - Owner Draws + Revenues - Expenses.
   - Any change in assets must be precisely offset by an equal change in liabilities or net equity components.`
    },
    {
      track_id: track1Id,
      title: "Debit and Credit Rules (The DEALER Acronym)",
      order_index: 2,
      content: `### Debit and Credit Mechanics and Normal Balances

1. Defining Debits and Credits:
   - Debit (Dr): An entry on the left side of a T-account ledger.
   - Credit (Cr): An entry on the right side of a T-account ledger.

2. The DEALER Framework for Normal Balances:
   - D-E-A (Dividends/Draws, Expenses, Assets): Increase with a DEBIT; Decrease with a CREDIT (Normal Debit Balance).
   - L-E-R (Liabilities, Equity, Revenue): Increase with a CREDIT; Decrease with a DEBIT (Normal Credit Balance).`
    },
    {
      track_id: track1Id,
      title: "Structuring the Standard Chart of Accounts (COA)",
      order_index: 3,
      content: `### General Ledger Numbering and Taxonomy

1. Standard Chart of Accounts Hierarchy:
   - 1000-1999: Assets (1010 Operating Cash, 1100 AR, 1200 Inventory, 1500 Equipment).
   - 2000-2999: Liabilities (2010 AP, 2100 Accrued Wages, 2200 Unearned Revenue).
   - 3000-3999: Equity (3010 Common Stock, 3020 Retained Earnings, 3030 Draws).
   - 4000-4999: Revenues (4010 Product Sales, 4020 Consulting Services).
   - 5000-5999: Cost of Goods Sold (COGS).
   - 6000-7999: Operating Expenses (6010 Payroll, 6020 Rent, 6030 Utilities).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Source Documents and General Journal Entry Protocols",
      order_index: 1,
      content: `### Transaction Intake and General Journal Protocols

1. Source Document Evidence:
   - Bank feeds, supplier invoices, sales receipts, payroll summaries, and customer contracts.

2. General Journal Entry Formatting:
   - Entries recorded chronologically with Transaction Date, Debited Account (left-aligned with debit amount), Credited Account (indented to the right with credit amount), and a concise narrative description referencing source documents.`
    },
    {
      track_id: track2Id,
      title: "Posting to General Ledger T-Accounts and Subledgers",
      order_index: 2,
      content: `### Ledger Posting and Control Account Reconciliation

1. Posting Mechanics:
   - Transferring journal debits and credits into individual General Ledger (GL) T-accounts to compute updated running account balances.

2. Control Accounts vs Subsidiary Ledgers:
   - Reconciling main GL control accounts (e.g. Account 1100 AR Control) against granular customer subledgers to guarantee exact line-item parity.`
    },
    {
      track_id: track2Id,
      title: "Constructing the Unadjusted Trial Balance and Error Detection",
      order_index: 3,
      content: `### Trial Balance Schedules and Undetected Accounting Errors

1. The Unadjusted Trial Balance:
   - An internal working schedule listing all open GL accounts to verify mathematical parity: Sum of All Debits = Sum of All Credits.

2. Errors Not Detected by a Balanced Trial Balance:
   - Errors of Omission (transaction completely forgotten), Errors of Commission (posting to wrong account of same class), Compensating Errors, and Transposition Errors (divisible by 9).`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Cash vs Accrual Accounting and Adjusting Journal Entries",
      order_index: 1,
      content: `### The Accrual Principle and 4 Adjusting Entry Types

1. Cash vs Accrual Accounting (GAAP Matching Principle):
   - Revenue recognized when earned; expenses recognized when incurred to generate revenue.

2. The 4 Period-End Adjusting Journal Entries (AJEs):
   - 1. Accrued Revenues: Earned but unbilled (Dr AR, Cr Revenue).
   - 2. Accrued Expenses: Incurred but unpaid (Dr Expense, Cr Accrued Liability).
   - 3. Deferred / Unearned Revenues: Cash received in advance (Dr Unearned Revenue, Cr Revenue).
   - 4. Prepaid Expenses: Cash paid in advance (Dr Expense, Cr Prepaid Asset).`
    },
    {
      track_id: track3Id,
      title: "Straight-Line Depreciation and Contra-Asset Accounts",
      order_index: 2,
      content: `### Fixed Asset Capitalization and Depreciation

1. Straight-Line Depreciation Formula:
   - Annual Depreciation Expense = (Asset Historical Cost - Salvage Value) / Useful Life in Years.

2. Bookkeeping Entries:
   - Debit: Depreciation Expense (Income Statement operating expense).
   - Credit: Accumulated Depreciation (Balance Sheet contra-asset account offsetting Gross Fixed Assets to report Book Value).`
    },
    {
      track_id: track3Id,
      title: "The 4-Step Closing Process and Post-Closing Trial Balance",
      order_index: 3,
      content: `### Temporary Account Resets and Retained Earnings

1. Temporary vs Permanent Accounts:
   - Temporary (Revenues, Expenses, Dividends/Draws) reset to zero each fiscal period.
   - Permanent (Assets, Liabilities, Equity) roll forward continuously.

2. The 4-Step Closing Sequence:
   - 1. Close Revenue accounts to Income Summary.
   - 2. Close Expense accounts to Income Summary.
   - 3. Close Income Summary net balance to Retained Earnings / Capital.
   - 4. Close Owner Draws / Dividends directly to Retained Earnings.
   - 5. Generate Post-Closing Trial Balance containing balance sheet accounts only.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #106.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "What is the fundamental accounting equation that forms the structural foundation of all double-entry bookkeeping?",
      options: [
        "Assets = Liabilities + Equity",
        "Revenue = Cash + Inventory",
        "Profit = Sales - Taxes",
        "Assets = Expenses + Debt"
      ],
      correct_option_index: 0,
      explanation: "Assets = Liabilities + Equity is the universal double-entry equation that must balance at all times.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "Using the standard DEALER accounting rule, which three account categories increase with a DEBIT and have a normal debit balance?",
      options: [
        "Liabilities, Equity, and Revenue",
        "Cash, Debt, and Sales",
        "Dividends/Draws, Expenses, and Assets (D-E-A)",
        "Taxes, Loans, and Inventory"
      ],
      correct_option_index: 2,
      explanation: "Under DEALER, Draws/Dividends, Expenses, and Assets increase with a Debit (normal debit balance).",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In a standard corporate Chart of Accounts (COA), which account numbering range is standardly assigned to Operating Revenues?",
      options: [
        "1000-1999 (Assets)",
        "4000-4999 (Revenues)",
        "2000-2999 (Liabilities)",
        "6000-6999 (Expenses)"
      ],
      correct_option_index: 1,
      explanation: "The 4000-4999 numerical range is universally allocated to operating revenues and sales accounts.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What is the primary purpose of preparing an 'Unadjusted Trial Balance' at the end of an accounting period?",
      options: [
        "To calculate federal income tax payments",
        "To decide employee salary increases",
        "To send bills to customers",
        "To verify mathematical equality by proving that the sum of all debit balances equals the sum of all credit balances across the general ledger"
      ],
      correct_option_index: 3,
      explanation: "The trial balance proves mathematical parity across the general ledger: Total Debits = Total Credits.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In accrual accounting, what is 'Unearned Revenue' (Deferred Revenue) classified as on the balance sheet when a customer pays cash in advance before services are delivered?",
      options: [
        "A Current Liability (representing the company's legal obligation to deliver goods or services in the future)",
        "An Asset",
        "An Expense",
        "Stockholders' Equity"
      ],
      correct_option_index: 0,
      explanation: "Unearned revenue is a liability because the company owes the customer performance before it can recognize revenue.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "A business purchases $12,000 of office equipment on credit (to be paid in 30 days). What is the correct double-entry journal entry?",
      options: [
        "Debit Cash $12,000, Credit Equipment $12,000",
        "Debit Accounts Payable $12,000, Credit Equipment $12,000",
        "Debit Equipment Expense $12,000, Credit Cash $12,000",
        "Debit Equipment (Asset) $12,000, Credit Accounts Payable (Liability) $12,000"
      ],
      correct_option_index: 3,
      explanation: "Equipment asset increases (debit $12,000) and Accounts Payable liability increases (credit $12,000).",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "A company purchases a commercial delivery van for $40,000 with an estimated useful life of 5 years and an expected salvage value of $5,000. Using straight-line depreciation, what is the annual depreciation expense?",
      options: [
        "$8,000 per year",
        "$7,000 per year (calculated as: ($40,000 - $5,000) / 5 years)",
        "$5,000 per year",
        "$35,000 per year"
      ],
      correct_option_index: 1,
      explanation: "Straight-line depreciation = (Cost $40,000 - Salvage $5,000) / 5 years = $35,000 / 5 = $7,000 annually.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "On December 31, employees have earned $6,000 in wages that will not be paid until the next regular payroll on January 5. What Adjusting Journal Entry (AJE) must be recorded on December 31 under accrual accounting?",
      options: [
        "Debit Wage Expense $6,000, Credit Accrued Wages Payable $6,000",
        "Debit Cash $6,000, Credit Wage Expense $6,000",
        "Debit Accrued Wages Payable $6,000, Credit Cash $6,000",
        "No entry is made until cash is physically paid"
      ],
      correct_option_index: 0,
      explanation: "Accrual requires recording the expense when incurred: Debit Wage Expense $6,000, Credit Accrued Wages Payable $6,000.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "Which of the following accounting errors would NOT cause an unadjusted trial balance to be out of balance (i.e. debits would still equal credits)?",
      options: [
        "Entering a $500 debit with a $50 credit",
        "Omitting the debit side of a journal entry completely",
        "A Transposition Error where $890 was recorded as both an $890 debit and an $890 credit, or an Error of Commission posting to the wrong asset account",
        "Adding the debit column incorrectly"
      ],
      correct_option_index: 2,
      explanation: "If equal debits and credits are recorded, the trial balance remains in balance even if the dollar amount or account name is wrong.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "At the end of the fiscal year, which accounts are classified as 'Temporary Accounts' that must be closed to Retained Earnings / Owner's Capital?",
      options: [
        "Cash, Accounts Receivable, and Accounts Payable",
        "Land, Buildings, and Equipment",
        "Common Stock and Retained Earnings",
        "Revenues, Expenses, and Owner Draws / Dividends"
      ],
      correct_option_index: 3,
      explanation: "Temporary accounts (Revenues, Expenses, Draws/Dividends) measure single-period activity and are reset to zero at year-end.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In the 4-step closing entry process, how is a fiscal year net income of $50,000 closed from the temporary 'Income Summary' clearing account into permanent equity?",
      options: [
        "Debit Retained Earnings $50,000, Credit Cash $50,000",
        "Debit Income Summary $50,000, Credit Retained Earnings (or Owner's Capital) $50,000",
        "Debit Revenue $50,000, Credit Income Summary $50,000",
        "Debit Dividends $50,000, Credit Retained Earnings $50,000"
      ],
      correct_option_index: 1,
      explanation: "Net income leaves a credit balance in Income Summary; closing it requires debiting Income Summary and crediting Retained Earnings.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "On October 1, a company pays $12,000 cash for an annual 12-month commercial insurance policy covering Oct 1 through Sept 30. What is the correct adjusting journal entry on December 31 after 3 months have expired?",
      options: [
        "Debit Cash $3,000, Credit Insurance Expense $3,000",
        "Debit Prepaid Insurance $12,000, Credit Cash $12,000",
        "Debit Insurance Expense $3,000, Credit Prepaid Insurance $3,000 (3 months * $1,000/month expired)",
        "Debit Insurance Expense $12,000, Credit Prepaid Insurance $12,000"
      ],
      correct_option_index: 2,
      explanation: "3 months of the $12,000 policy have expired ($3,000): Debit Insurance Expense $3,000, Credit Prepaid Insurance $3,000.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In forensic bookkeeping, what is a 'Transposition Error' and what mathematical diagnostic rule proves its existence?",
      options: [
        "Switching the order of two adjacent digits (e.g. writing $540 as $450); the resulting discrepancy between total debits and total credits is always evenly divisible by 9",
        "Writing entries in red ink instead of black",
        "Deleting a transaction by mistake",
        "Recording an entry twice"
      ],
      correct_option_index: 0,
      explanation: "Transposition errors (swapping adjacent numbers like 54 and 45) always produce an imbalance divisible by 9 (90 / 9 = 10).",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "How does the 'Accumulated Depreciation' account function on the Balance Sheet, and why is it never credited directly to the Fixed Asset account during monthly depreciation?",
      options: [
        "It is an equity account that holds cash for buying new equipment",
        "It is a liability account that must be paid to the bank",
        "It is an expense account on the income statement",
        "It is a Contra-Asset account that accumulates all historical depreciation, preserving the original historical cost in the asset account while displaying net book value"
      ],
      correct_option_index: 3,
      explanation: "Accumulated Depreciation preserves the original historical cost in the asset account while displaying net book value on the balance sheet.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "Which of the following accounts will appear on a 'Post-Closing Trial Balance'?",
      options: [
        "Sales Revenue and Advertising Expense",
        "Cash, Accounts Receivable, Equipment, Accounts Payable, and Retained Earnings (Permanent Balance Sheet Accounts only)",
        "Depreciation Expense and Income Summary",
        "Owner Draws and Consulting Fees"
      ],
      correct_option_index: 1,
      explanation: "Only permanent balance sheet accounts (Assets, Liabilities, Equity) appear on the post-closing trial balance, as all temporary accounts are zeroed.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #106.");
  console.log("Skill #106 update completed successfully!");
}

run();
