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

const skillId = "921fb03f-d84c-4e53-9662-011614f53e50";

async function run() {
  console.log("Updating Skill #108: Accounting Software (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Cloud Accounting Platforms, Dimensions and System Architecture" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Automated Workflows, Digital AP/AR and Receipt Capture" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Audit Trails, Closing Date Locks and ERP Migrations" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Financial Systems Architect & Certified ProAdvisor level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Modern Accounting Software Ecosystem (QBO, Xero, NetSuite)",
      order_index: 1,
      content: `### Cloud General Ledger Architectures

1. Platform Segmentation:
   - Small Business Cloud (QuickBooks Online, Xero): Single-ledger relational databases with open REST API ecosystems.
   - Mid-Market / Enterprise ERPs (Sage Intacct, Oracle NetSuite): Multi-entity intercompany consolidation, multi-currency ledger revaluations, and automated ASC 606 revenue recognition.

2. Cloud vs Desktop:
   - Real-time bank synchronization, automatic tax compliance updates, and multi-user concurrent access.`
    },
    {
      track_id: track1Id,
      title: "Customizing the Chart of Accounts, Classes and Locations",
      order_index: 2,
      content: `### Multi-Dimensional General Ledger Reporting

1. Dimensional Tagging Architecture:
   - Class Tracking: Segregates revenues and operating expenses by department, business unit, or product line.
   - Location Tracking: Categorizes transactions by physical geography, branch office, or retail store.

2. Dimensional P&L:
   - Allows financial analysts to generate segmented departmental Profit and Loss statements without bloating the primary Chart of Accounts with duplicate line items.`
    },
    {
      track_id: track1Id,
      title: "Bank Feeds, Open Banking APIs and Automated Rule Engines",
      order_index: 3,
      content: `### Bank Data Ingestion and Automated Matching

1. Direct Bank Feed APIs:
   - Ingesting cleared bank, credit card, and merchant transactions via secure Open Banking connections (Plaid, Yodlee).

2. Rule Engine Logic:
   - Creating automated logic rules based on description strings, memo keywords, and transaction amounts.
   - Automates account coding, class assignment, and 1-click matching against open accounts receivable invoices and accounts payable bills.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Automated Customer Invoicing and Payment Gateways",
      order_index: 1,
      content: `### Order-to-Cash Automation and Payment Rails

1. Billing Automation:
   - Generating recurring scheduled retainers, automated payment reminder workflows, and customer self-service billing portals.

2. Integrated Payment Processing:
   - Embedded payment rails allowing customers to pay directly via ACH bank transfer (low fixed transaction fee) or credit card (percentage processing fee), automatically reconciling the general ledger upon payment settlement.`
    },
    {
      track_id: track2Id,
      title: "Automated Bill Processing, OCR Receipt Capture and Bill.com",
      order_index: 2,
      content: `### Paperless AP and Machine Learning Extraction

1. Optical Character Recognition (OCR):
   - Machine learning engines (Dext Prepare, Hubdoc, QBO Receipt Capture) extracting vendor name, invoice date, line-item totals, and sales tax from photos and PDF bills.

2. AP Approval Workflows:
   - Cloud payment platforms (Bill.com, Melio) establishing multi-tier approval hierarchies and syncing bill payments seamlessly into the accounting software general ledger.`
    },
    {
      track_id: track2Id,
      title: "Employee Expense Management and 1099 Contractor Tracking",
      order_index: 3,
      content: `### Corporate Card Sync and 1099 E-Filing

1. Automated Spend Management:
   - Corporate card platforms (Ramp, Brex, Expensify) enforcing policy spending limits, auto-categorizing receipts, and posting directly into GL expense accounts.

2. 1099 Compliance:
   - Tagging 1099-eligible independent contractors, tracking threshold cumulative payments ($600+), and e-filing Form 1099-NEC directly with the IRS and state authorities.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Immutable Audit Logs and Role-Based Access Controls (RBAC)",
      order_index: 1,
      content: `### System Governance and Forensic Auditability

1. The Immutable Audit Trail:
   - A permanent system log tracking every transaction creation, modification, date change, amount edit, and deletion, timestamped with user ID and IP address.

2. Role-Based Access Control (RBAC):
   - Segregating user permissions (e.g. restricting sales staff to AR invoicing while blocking access to bank reconciliations, payroll data, and general ledger journal entries).`
    },
    {
      track_id: track3Id,
      title: "Closing Date Locks and Period-End Reporting Packages",
      order_index: 2,
      content: `### Closing Books and Financial Statement Generation

1. The Closing Date Lock:
   - Password-protecting past accounting periods to prevent unauthorized additions, edits, or deletions of transactions in closed fiscal periods.

2. Management Reporting Packages:
   - Generating automated monthly financial packages: Comparative Balance Sheet, Multi-Period Profit and Loss with variance analysis, and Statement of Cash Flows.`
    },
    {
      track_id: track3Id,
      title: "Data Migration, System Cutover and Opening Balance Equity",
      order_index: 3,
      content: `### System Implementation and Opening Balance Clean-up

1. Implementation Cutover:
   - Cleansing master vendor/customer data, setting a hard accounting cutover date, and importing historical trial balances.

2. Opening Balance Equity (OBE):
   - A default clearing account created by accounting software to hold initial imbalances; must be thoroughly reconciled and closed into permanent Retained Earnings before go-live.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #108.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In cloud accounting software (such as QuickBooks Online or Xero), what is an 'Audit Log' (Audit Trail)?",
      options: [
        "A permanent, unalterable system history tracking every transaction creation, edit, date change, and deletion with user names and timestamps",
        "A list of tax audit lawyers",
        "A backup file saved on a USB drive",
        "A marketing dashboard showing website visitors"
      ],
      correct_option_index: 0,
      explanation: "The audit log maintains an unalterable forensic record of every user action and transaction change in the software.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In accounting software, what is the primary purpose of setting a 'Closing Date Lock' with a password?",
      options: [
        "To lock employees out of their computers at 5:00 PM",
        "To delete all transactions from the prior year",
        "To prevent users from accidentally adding, modifying, or deleting transactions in closed prior fiscal periods, protecting financial statement integrity",
        "To shut down the cloud server"
      ],
      correct_option_index: 2,
      explanation: "A closing date lock freezes historical accounting periods so prior financial statements and tax returns cannot be altered.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In accounting software features, what does 'Class Tracking' enable an organization to accomplish?",
      options: [
        "Tracking how many employees attend college classes",
        "Segmenting and reporting revenues and expenses by department, business unit, or product line to generate departmental Profit and Loss statements",
        "Sorting customer names alphabetically",
        "Grading customer credit scores from A to F"
      ],
      correct_option_index: 1,
      explanation: "Class tracking provides dimensional reporting to produce departmental P&Ls without creating duplicate COA accounts.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What technology is used in modern accounts payable software (like Dext or Hubdoc) to automatically read and extract vendor names, invoice dates, and totals from scanned receipt images?",
      options: [
        "GPS satellite tracking",
        "Blockchain cryptocurrency mining",
        "Radio frequency identification (RFID)",
        "Optical Character Recognition (OCR) combined with machine learning"
      ],
      correct_option_index: 3,
      explanation: "OCR and machine learning extract alphanumeric text and numbers from invoice images, automating data entry.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In cloud accounting software, what is a 'Bank Feed'?",
      options: [
        "A direct, automated API connection that imports cleared banking and credit card transactions daily into the accounting software for review and matching",
        "A daily newsletter sent by banks",
        "A loan application form",
        "A fee paid to bank tellers"
      ],
      correct_option_index: 0,
      explanation: "Bank feeds automatically sync real-time cleared transaction data from financial institutions directly into the software.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "When setting up a new company in accounting software, what is the 'Opening Balance Equity' account and what must be done with it before finalizing setup?",
      options: [
        "It is a bank account that holds cash for new equipment",
        "It is an expense account that should be left open permanently",
        "It is a government tax liability account",
        "A temporary system-generated clearing account holding initial setup imbalances; it must be reconciled and closed out to permanent Retained Earnings or Owner's Capital"
      ],
      correct_option_index: 3,
      explanation: "Opening Balance Equity is a temporary holding account for initial balances that must be reconciled and zeroed into Retained Earnings.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In accounting software security and internal controls, what is 'Role-Based Access Control' (RBAC)?",
      options: [
        "Giving all employees full administrator access",
        "Restricting user permissions to specific functional modules based on job roles (e.g. allowing sales staff to create invoices while blocking access to bank registers and payroll)",
        "Requiring employees to change passwords every 5 minutes",
        "Banning remote employees from logging in"
      ],
      correct_option_index: 1,
      explanation: "RBAC enforces segregation of duties by restricting user permissions to only the modules required for their specific job.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "How does creating 'Automated Bank Rules' in cloud accounting software improve bookkeeping efficiency and accuracy?",
      options: [
        "It automatically categorizes repetitive transactions (e.g. monthly subscriptions or utility bills) by payee, account, and class based on predefined keyword and dollar criteria",
        "It forces the bank to approve all loans",
        "It prevents all bank fees from being charged",
        "It automatically transfers money to the CEO's personal account"
      ],
      correct_option_index: 0,
      explanation: "Bank rules recognize recurring transaction patterns and automatically apply correct account coding, tax codes, and tags.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In enterprise software architecture, what core capability distinguishes enterprise ERPs (like Oracle NetSuite or Sage Intacct) from small business software (like QBO)?",
      options: [
        "Enterprise ERPs cannot connect to the internet",
        "Enterprise ERPs are only used by non-profits",
        "Enterprise ERPs provide multi-entity intercompany eliminations, complex global multi-currency revaluations, and automated ASC 606 revenue schedules",
        "Small business software has higher computing power"
      ],
      correct_option_index: 2,
      explanation: "ERPs handle complex multi-subsidiary consolidations, automated revenue recognition, and global enterprise operations.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "When a customer pays an invoice online through an integrated payment portal (e.g. Stripe or QuickBooks Payments), what automated bookkeeping sequence occurs?",
      options: [
        "The software deletes the customer account",
        "The software marks the invoice as unpaid",
        "The invoice is converted into a purchase order",
        "The software marks the invoice as Paid, credits Accounts Receivable, debits Undeposited Funds / Cash, records merchant processing fee expense, and matches the bank deposit"
      ],
      correct_option_index: 3,
      explanation: "Integrated payments automatically close open receivables, record fee expenses, and reconcile bank deposits without manual data entry.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In ERP data migration, why is establishing a strict 'Cutover Date' and entering an initial trial balance essential?",
      options: [
        "To avoid paying software subscription fees",
        "It establishes a precise historical boundary where legacy systems are frozen and opening general ledger balances are verified, preventing duplicate or omitted transactions during the transition",
        "To delete all customer contact records",
        "Cutover dates are only required for manufacturing companies"
      ],
      correct_option_index: 1,
      explanation: "A clean cutover date prevents transaction overlap between legacy and new systems while verifying opening balance accuracy.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In QuickBooks Online and Xero, what is the functional difference between 'Class Tracking' and 'Location Tracking'?",
      options: [
        "Class tracking is for taxes; location tracking is for weather",
        "Location tracking is used only for delivery trucks",
        "Class tracking allows multiple different classes to be assigned to separate line items within a single transaction; Location tracking applies a single location to the entire transaction",
        "There is zero structural difference between them"
      ],
      correct_option_index: 2,
      explanation: "Classes can be assigned per line item (e.g. splitting an expense across 3 departments); locations apply to the transaction as a whole.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In automated accounts payable systems (like Bill.com), what is '2-Way' vs '3-Way' digital purchase order matching?",
      options: [
        "2-Way matches the Vendor Invoice against the Purchase Order; 3-Way matches the Vendor Invoice against both the Purchase Order AND the warehouse Receiving Report before releasing payment",
        "2-Way matching uses 2 computers; 3-Way uses 3 computers",
        "2-Way matching is for credit cards; 3-Way is for cash",
        "3-Way matching is illegal in the United States"
      ],
      correct_option_index: 0,
      explanation: "2-way matches invoice to PO (services); 3-way adds receiving report verification (physical inventory) before payment authorization.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In automated corporate card management software (like Ramp or Brex), how does automated 'Receipt Matching' enforce internal expense compliance?",
      options: [
        "By automatically firing employees who spend money",
        "By refusing all corporate credit card charges",
        "By sending printed receipts to the IRS weekly",
        "The software matches card transaction data (amount, merchant, timestamp) with uploaded mobile receipt images, flagging missing receipts and auto-blocking card use if receipts are overdue"
      ],
      correct_option_index: 3,
      explanation: "Spend management tools auto-match receipts to card transactions via OCR and enforce policy compliance by pausing non-compliant cards.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In year-end software tax preparation, what criteria must be met in accounting software to ensure an accurate 1099-NEC contractor report?",
      options: [
        "The vendor must have an email address",
        "The vendor profile must have 'Track payments for 1099' checked, a valid Taxpayer ID (TIN/SSN) recorded from Form W-9, and payments mapped to qualifying non-employee compensation expense accounts",
        "The vendor must be paid exclusively in cash",
        "The vendor must have worked for over 10 years"
      ],
      correct_option_index: 1,
      explanation: "1099 reporting requires enabling vendor 1099 tracking, inputting a verified W-9 TIN, and mapping eligible payment accounts.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #108.");
  console.log("Skill #108 update completed successfully!");
}

run();
