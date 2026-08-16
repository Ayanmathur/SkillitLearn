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

const skillId = "43bb59f0-1838-4f85-8451-be126c919366";

async function run() {
  console.log("Updating Skill #105: Accounts Payable & Receivable (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: The Procure-to-Pay (P2P) Cycle, 3-Way Matching and Accounts Payable" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: The Order-to-Cash (O2C) Cycle, Credit Risk and AR Aging" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Working Capital Optimization, Bad Debt and Cash Reconciliation" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Corporate Controller & CPA level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Procure-to-Pay (P2P) Workflow and 3-Way Matching",
      order_index: 1,
      content: `### End-to-End P2P Architecture and Internal Controls

1. The Procure-to-Pay (P2P) Workflow:
   - Purchase Requisition -> Approved Purchase Order (PO) -> Receiving / Goods Receipt Note (GRN) -> Vendor Invoice.

2. The 3-Way Matching Protocol:
   - Automated reconciliation comparing:
     - 1. Purchase Order (authorized items, quantities, and agreed prices).
     - 2. Receiving Report (actual physical quantities delivered and inspected).
     - 3. Vendor Invoice (billed quantities, rates, and payment terms).
   - Prevents phantom vendor fraud, overbilling, and paying for damaged or unreceived goods.`
    },
    {
      track_id: track1Id,
      title: "Early Payment Discounts and Trade Credit Economics",
      order_index: 2,
      content: `### Trade Credit Mathematics and Treasury Yields

1. Trade Discount Terms (e.g. 2/10 Net 30):
   - Paying within 10 days earns a 2% cash discount; otherwise full balance is due in 30 days.

2. Annualized Cost of Forgoing Trade Credit:
   - Formula: Effective APR = (Discount % / (100 - Discount %)) * (365 / (Total Days - Discount Days)).
   - For 2/10 Net 30: (2 / 98) * (365 / 20) = 37.24% APR.
   - Forgoing early payment discounts is equivalent to borrowing capital at an exorbitant 37.24% annual interest rate.`
    },
    {
      track_id: track1Id,
      title: "Days Payable Outstanding (DPO) and Master File Controls",
      order_index: 3,
      content: `### Payables Working Capital and Fraud Mitigation

1. Days Payable Outstanding (DPO):
   - Formula: DPO = (Ending Accounts Payable / Cost of Goods Sold) * 365.
   - Measures average days taken to pay trade suppliers; higher DPO preserves cash liquidity without damaging vendor relationships.

2. Vendor Master File Governance:
   - Mandatory W-9/W-8BEN collection, Taxpayer ID (TIN) validation, strict segregation of duties between PO creation and disbursement, and bank Positive Pay verification.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The Order-to-Cash (O2C) Cycle and Commercial Credit",
      order_index: 1,
      content: `### Revenue Realization and Credit Underwriting

1. The Order-to-Cash (O2C) Framework:
   - Sales Order Entry -> Credit Check -> Inventory Allocation -> Fulfillment / Delivery -> Invoicing -> Cash Application.

2. Commercial Credit Underwriting:
   - Assessing creditworthiness using Dun & Bradstreet (D&B) Paydex scores, audited financial statements, bank references, and trade credit limits to minimize default risks.`
    },
    {
      track_id: track2Id,
      title: "Accounts Receivable Aging Schedules and DSO",
      order_index: 2,
      content: `### Aging Analysis and Days Sales Outstanding

1. AR Aging Buckets:
   - Categorizing open receivables into Current, 1-30 days, 31-60 days, 61-90 days, and 90+ days past due. Probability of default escalates exponentially past 90 days.

2. Days Sales Outstanding (DSO):
   - Formula: DSO = (Ending Accounts Receivable / Total Credit Sales) * 365.
   - Benchmarks collection velocity; rising DSO signals deteriorating customer liquidity or billing disputes.`
    },
    {
      track_id: track2Id,
      title: "Dunning Strategies, Dispute Resolution and Collections",
      order_index: 3,
      content: `### Structured Dunning and Collections Escalation

1. Automated Dunning Workflow:
   - Day 1-5 past due: Automated friendly email reminder and invoice copy.
   - Day 15-30: Phone outreach and credit hold warning.
   - Day 60+: Formal written demand letter and immediate shipping hold.
   - Day 90+: Referral to legal collections or third-party agency.

2. Dispute Root-Cause Resolution:
   - Identifying billing errors, short shipments, or pricing discrepancies to unfreeze disputed payments.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "ASC 326 CECL Standard and Bad Debt Accounting",
      order_index: 1,
      content: `### Expected Credit Losses and Allowance Mechanics

1. GAAP ASC 326 CECL Standard:
   - Replaces the legacy incurred loss model with the Current Expected Credit Losses (CECL) framework, requiring companies to estimate lifetime expected credit losses on Day 1 using historical loss rates, current economic conditions, and reasonable forecasts.

2. Balance Sheet Presentation:
   - Allowance for Doubtful Accounts is a contra-asset account offset against Gross Accounts Receivable to report Net Realizable Value (NRV).`
    },
    {
      track_id: track3Id,
      title: "Direct Write-Off vs Allowance Method and Recoveries",
      order_index: 2,
      content: `### Journal Entries and Debt Recovery Mechanics

1. The Allowance Method (GAAP Mandatory):
   - Recognizing Bad Debt: Debit Bad Debt Expense, Credit Allowance for Doubtful Accounts.
   - Writing off specific uncollectible account: Debit Allowance for Doubtful Accounts, Credit Accounts Receivable (no income statement effect at write-off).

2. Debt Recovery:
   - Reinstating written-off account: Debit Accounts Receivable, Credit Allowance for Doubtful Accounts, followed by standard cash receipt debit.`
    },
    {
      track_id: track3Id,
      title: "Cash Conversion Cycle and Automated Bank Reconciliation",
      order_index: 3,
      content: `### Working Capital Integration and Cash Controls

1. The Cash Conversion Cycle (CCC):
   - Formula: CCC = Days Inventory Outstanding (DIO) + Days Sales Outstanding (DSO) - Days Payable Outstanding (DPO).
   - Quantifies the net days required to convert operational cash outflows back into cash inflows.

2. Automated Bank Reconciliations:
   - Daily ERP reconciliation matching general ledger bank accounts against bank feeds, resolving deposits in transit, outstanding checks, and merchant processing fees.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #105.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In Accounts Payable internal controls, what three documents are reconciled in a standard '3-Way Match' before releasing payment?",
      options: [
        "Resume, Driver's License, and Bank Card",
        "Purchase Order (PO), Receiving Report / Goods Receipt Note (GRN), and Vendor Invoice",
        "Tax Return, Employee Contract, and Utility Bill",
        "Credit Card Statement, Cash Receipt, and Shipping Label"
      ],
      correct_option_index: 1,
      explanation: "A 3-way match verifies that the Purchase Order, Goods Receipt Note, and Vendor Invoice agree on items, quantities, and prices.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What does trade credit payment term '2/10 Net 30' mean for a purchasing company?",
      options: [
        "Pay 2 dollars in 10 days, or 30 dollars in a month",
        "Pay 20% down and the rest in 30 days",
        "Take 2 months of vacation after 30 days",
        "The buyer receives a 2% cash discount if the invoice is paid within 10 days; otherwise the full balance is due in 30 days"
      ],
      correct_option_index: 3,
      explanation: "2/10 Net 30 grants a 2% cash discount for payment within 10 days, with the full net amount due in 30 days.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In financial working capital metrics, what does 'DSO' stand for?",
      options: [
        "Days Sales Outstanding (the average number of days it takes a company to collect cash from credit sales)",
        "Daily Shipping Orders",
        "Direct Supplier Optimization",
        "Deferred Stock Ownership"
      ],
      correct_option_index: 0,
      explanation: "Days Sales Outstanding (DSO) measures how quickly an organization converts credit sales into collected cash.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "On a corporate Balance Sheet, how is the 'Allowance for Doubtful Accounts' classified and presented?",
      options: [
        "As a long-term liability",
        "As stockholders' equity",
        "As a Contra-Asset account subtracted directly from Gross Accounts Receivable to report Net Realizable Value",
        "As an intangible asset"
      ],
      correct_option_index: 2,
      explanation: "Allowance for Doubtful Accounts is a contra-asset account paired with Gross Accounts Receivable on the balance sheet.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What is the primary formula used to calculate a company's 'Cash Conversion Cycle' (CCC)?",
      options: [
        "CCC = Days Sales Outstanding (DSO) + Days Payable Outstanding (DPO)",
        "CCC = Days Inventory Outstanding (DIO) + Days Sales Outstanding (DSO) - Days Payable Outstanding (DPO)",
        "CCC = Revenue - Expenses",
        "CCC = Assets / Liabilities"
      ],
      correct_option_index: 1,
      explanation: "The Cash Conversion Cycle measures net operating cash velocity: CCC = DIO + DSO - DPO.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "When evaluating trade credit economics, what is the effective annualized borrowing cost (APR) of forgoing a '2/10 Net 30' cash discount?",
      options: [
        "2.0% APR",
        "10.0% APR",
        "Approximately 37.24% APR (calculated as: (2/98) * (365/20))",
        "5.5% APR"
      ],
      correct_option_index: 2,
      explanation: "Forgoing 2/10 Net 30 is mathematically equivalent to borrowing money for 20 days at an annualized cost of 37.24% APR.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "Under US GAAP ASC 326, how does the 'Current Expected Credit Losses' (CECL) model differ from the legacy incurred loss model for Accounts Receivable?",
      options: [
        "CECL requires companies to estimate lifetime expected credit losses immediately on Day 1 using historical loss rates and forward-looking economic forecasts, rather than waiting for an actual default trigger event",
        "CECL bans selling goods on credit",
        "CECL only applies to government contracts",
        "CECL allows companies to never write off bad debt"
      ],
      correct_option_index: 0,
      explanation: "ASC 326 CECL mandates estimating lifetime expected credit losses upon receivable recognition using forward-looking forecasts.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "Under the GAAP Allowance Method, what is the correct journal entry when a specific $5,000 customer invoice is officially deemed uncollectible and written off?",
      options: [
        "Debit Cash $5,000, Credit Revenue $5,000",
        "Debit Bad Debt Expense $5,000, Credit Cash $5,000",
        "Debit Bad Debt Expense $5,000, Credit Accounts Receivable $5,000",
        "Debit Allowance for Doubtful Accounts $5,000, Credit Accounts Receivable $5,000"
      ],
      correct_option_index: 3,
      explanation: "Writing off an account debits the Allowance contra-asset and credits AR, having zero net impact on the income statement or Net AR.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What is the primary financial implication of an increasing Days Payable Outstanding (DPO) metric?",
      options: [
        "The company is collecting cash faster from customers",
        "The company is taking longer on average to pay its trade vendors, preserving working capital cash liquidity within the business (provided it does not damage supplier terms)",
        "The company is losing money on sales",
        "The company has zero inventory"
      ],
      correct_option_index: 1,
      explanation: "Higher DPO extends payment timing to suppliers, keeping cash inside the enterprise longer to fund operating activities.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In corporate treasury cash controls, what is a 'Positive Pay' service offered by commercial banks?",
      options: [
        "A system that pays employees bonuses automatically",
        "A marketing program for credit cards",
        "An anti-fraud control where the company transmits an electronic list of all issued checks/ACH payments to the bank, and the bank rejects any check presented that does not exactly match check number, account, and dollar amount",
        "A method to avoid paying bank fees"
      ],
      correct_option_index: 2,
      explanation: "Positive Pay reconciles company-issued disbursement lists against presented checks, preventing check fraud and unauthorized ACH debits.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "When an account previously written off as uncollectible is unexpectedly paid by a customer in cash, what two-step journal entry sequence is required under GAAP?",
      options: [
        "Step 1: Debit Accounts Receivable, Credit Allowance for Doubtful Accounts (to reinstate the receivable); Step 2: Debit Cash, Credit Accounts Receivable",
        "Step 1: Debit Cash, Credit Bad Debt Expense",
        "Step 1: Debit Revenue, Credit Cash",
        "Step 1: Debit Retained Earnings, Credit Cash"
      ],
      correct_option_index: 0,
      explanation: "Recovery requires reinstating the customer receivable against the allowance account first, then recording standard cash collection.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In working capital optimization, how is an organization able to achieve a 'Negative Cash Conversion Cycle' (like Amazon or Dell)?",
      options: [
        "By going bankrupt",
        "By borrowing infinite bank debt",
        "By refusing to sell products to consumers",
        "By collecting cash immediately from customers (low DSO) and turning inventory rapidly (low DIO) while negotiating extended payment terms with suppliers (high DPO, where DPO > DIO + DSO)"
      ],
      correct_option_index: 3,
      explanation: "A negative CCC occurs when DPO exceeds DIO + DSO, meaning customers fund operations before suppliers are paid.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In commercial credit risk underwriting, what does a 'Dun & Bradstreet Paydex Score' of 80 indicate about a business borrower?",
      options: [
        "The company is 80 days past due on all loans",
        "The company pays its trade invoices exactly 'Prompt' according to agreed invoice terms (scores above 80 indicate paying ahead of terms; below 80 indicates slow payments)",
        "The company has an 80% default rate",
        "The company has $80 million in cash"
      ],
      correct_option_index: 1,
      explanation: "A D&B Paydex score of 80 is the benchmark indicating a company pays vendors exactly on time according to trade terms.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In bank reconciliations, how are 'Deposits in Transit' and 'Outstanding Checks' treated in the reconciliation formula to determine adjusted book balance?",
      options: [
        "Both are subtracted from the book balance",
        "Both are added to the bank balance",
        "Deposits in Transit are added to the Bank Statement Balance; Outstanding Checks are deducted from the Bank Statement Balance",
        "Neither has any effect on bank reconciliation"
      ],
      correct_option_index: 2,
      explanation: "Deposits in transit are added to the bank balance; outstanding uncashed checks are deducted from the bank balance.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "Why is the 'Direct Write-Off Method' prohibited under US GAAP for material receivables, forcing the use of the 'Allowance Method'?",
      options: [
        "Because the Direct Write-Off Method violates the Matching Principle by recognizing bad debt expense in a different fiscal period than the period when the original credit sale and revenue occurred",
        "Because it is too easy for accountants to calculate",
        "Because the IRS does not allow bad debt deductions",
        "Because it requires double the paperwork"
      ],
      correct_option_index: 0,
      explanation: "The direct write-off method violates the core matching principle by recording expense months or years after the associated revenue.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #105.");
  console.log("Skill #105 update completed successfully!");
}

run();
