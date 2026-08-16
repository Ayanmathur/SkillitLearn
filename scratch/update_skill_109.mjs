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

const skillId = "8281cb20-6c20-43d3-8c61-e3383ffe0f81";

async function run() {
  console.log("Updating Skill #109: Financial Statements (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: The Multi-Step Income Statement (P&L) and Quality of Earnings" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: The Classified Balance Sheet, Working Capital and Equity Roll-Forward" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: The Statement of Cash Flows and 3-Statement Dynamic Linkage" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Chief Financial Officer & Lead Corporate CPA level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Multi-Step Income Statement Waterfall Architecture",
      order_index: 1,
      content: `### The Standard Multi-Step P&L Structure

1. The Waterfall Architecture:
   - Gross Revenues - Sales Returns and Discounts = Net Revenue.
   - Net Revenue - Cost of Goods Sold (COGS) = Gross Profit.
   - Gross Profit - Operating Expenses (SG&A, R&D, D&A) = Operating Income (EBIT).
   - EBIT - Net Interest Expense +- Non-Operating Items = Earnings Before Taxes (EBT).
   - EBT - Income Tax Expense = Net Income (Bottom Line).`
    },
    {
      track_id: track1Id,
      title: "EBITDA, Non-GAAP Normalizations and Diluted EPS",
      order_index: 2,
      content: `### Operational Cash Flow Proxies and Per-Share Metrics

1. EBITDA and Adjusted EBITDA:
   - EBITDA = Operating Income (EBIT) + Depreciation + Amortization.
   - Adjusted EBITDA normalizes for non-cash stock compensation, restructuring costs, and non-recurring litigation.

2. Earnings Per Share (EPS):
   - Basic EPS = (Net Income - Preferred Dividends) / Weighted Average Common Shares.
   - Diluted EPS incorporates options and convertible securities via the Treasury Stock Method.`
    },
    {
      track_id: track1Id,
      title: "Revenue Recognition Standards (ASC 606 / IFRS 15)",
      order_index: 3,
      content: `### The 5-Step GAAP/IFRS Revenue Recognition Framework

1. The 5-Step Model:
   - Step 1: Identify the contract with a customer.
   - Step 2: Identify distinct performance obligations.
   - Step 3: Determine the transaction price.
   - Step 4: Allocate transaction price based on Standalone Selling Prices (SSP).
   - Step 5: Recognize revenue when or as performance obligations are satisfied.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Classified Balance Sheet: Current and Non-Current Assets",
      order_index: 1,
      content: `### Asset Liquidity and Capital Investment Architecture

1. Current Assets (Liquid within 12 months):
   - Cash and Cash Equivalents, Marketable Securities, Accounts Receivable (at Net Realizable Value), Inventory (FIFO/LIFO/Average Cost), and Prepaid Expenses.

2. Non-Current Assets:
   - Property, Plant and Equipment (PP&E, net of Accumulated Depreciation), Operating Lease ROU Assets, Intangibles, and Goodwill (tested annually for impairment).`
    },
    {
      track_id: track2Id,
      title: "Current and Non-Current Liabilities and Deferred Taxes",
      order_index: 2,
      content: `### Debt Obligations, Unearned Revenues and Deferred Taxes

1. Current Liabilities:
   - Accounts Payable, Accrued Payroll, Unearned Revenue (customer contract liability), and Current Portion of Long-Term Debt (CPLTD).

2. Non-Current Liabilities:
   - Senior Notes, Finance Leases, and Deferred Tax Liabilities (DTL created when MACRS accelerated tax depreciation exceeds straight-line book depreciation).`
    },
    {
      track_id: track2Id,
      title: "Stockholders' Equity Architecture and Statement of Equity",
      order_index: 3,
      content: `### Equity Components and Retained Earnings Roll-Forward

1. Equity Structure:
   - Common Stock (Par Value) + Additional Paid-In Capital (APIC) + Retained Earnings - Treasury Stock (contra-equity buybacks) +- Accumulated Other Comprehensive Income (AOCI).

2. Retained Earnings Roll-Forward:
   - Ending Retained Earnings = Beginning Retained Earnings + Net Income - Dividends Paid.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Cash Flow from Operating Activities: The Indirect Method",
      order_index: 1,
      content: `### Operating Cash Flow Mechanics (ASC 230 / IAS 7)

1. The Indirect Method Formula:
   - Start with Net Income.
   - Add back Non-Cash Expenses: Depreciation, Amortization, Stock-Based Compensation.
   - Adjust for Working Capital Changes:
     - Subtract Increases in Current Assets (-Delta AR, -Delta Inventory, -Delta Prepaids).
     - Add Increases in Current Liabilities (+Delta AP, +Delta Accrued Expenses, +Delta Unearned Revenue).`
    },
    {
      track_id: track3Id,
      title: "Cash Flow from Investing (CFI) and Financing (CFF)",
      order_index: 2,
      content: `### Capital Deployment, Debt Servicing and Cash Reconciliation

1. Investing Activities (CFI):
   - Capital Expenditures (CapEx purchases of PP&E, cash outflow), business acquisitions, and marketable security investments.

2. Financing Activities (CFF):
   - Proceeds from debt/equity issuances (cash inflows), debt principal repayments, dividend payments, and share buybacks.
   - Net Change in Cash reconciles starting and ending Balance Sheet Cash.`
    },
    {
      track_id: track3Id,
      title: "The 3-Statement Dynamic Linkage Model",
      order_index: 3,
      content: `### The Interconnected 3-Statement Financial Engine

1. Dynamic Linkages:
   - Net Income from P&L flows into Retained Earnings on the Balance Sheet and starts the Cash Flow from Operations (CFO).
   - Net Change in Cash from Cash Flow Statement drives the Cash balance on the Balance Sheet.
   - CapEx from CFI increases Gross PP&E, while P&L Depreciation accumulates in contra-asset reserves.
   - Ending Debt on the Balance Sheet drives Interest Expense on the P&L.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #109.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "On a standard Multi-Step Income Statement, how is 'Gross Profit' calculated?",
      options: [
        "Net Income - Operating Expenses",
        "Net Revenue - Cost of Goods Sold (COGS)",
        "Cash - Accounts Payable",
        "Total Assets - Total Liabilities"
      ],
      correct_option_index: 1,
      explanation: "Gross Profit equals Net Revenue minus Cost of Goods Sold (COGS).",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What financial metric is calculated by taking Operating Income (EBIT) and adding back non-cash Depreciation and Amortization expenses?",
      options: [
        "Net Income",
        "Retained Earnings",
        "Gross Margin",
        "EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization)"
      ],
      correct_option_index: 3,
      explanation: "EBITDA adds back Depreciation and Amortization to Operating Income (EBIT) as an operational cash proxy.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In the Cash Flow Statement under the Indirect Method (ASC 230), what is the starting line item in Cash Flow from Operating Activities (CFO)?",
      options: [
        "Net Income (from the Income Statement)",
        "Gross Sales Revenue",
        "Ending Cash Balance",
        "Total Assets"
      ],
      correct_option_index: 0,
      explanation: "The indirect method of calculating CFO begins with Net Income and adjusts for non-cash items and working capital shifts.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "On a corporate Balance Sheet, how are 'Treasury Shares' (shares repurchased by the company from the open market) classified?",
      options: [
        "As a current asset",
        "As a long-term liability",
        "As a Contra-Equity account subtracted from Total Stockholders' Equity",
        "As operating revenue"
      ],
      correct_option_index: 2,
      explanation: "Treasury Stock is a contra-equity account that reduces total stockholders' equity on the balance sheet.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What is the formula used to roll forward the 'Retained Earnings' account from the beginning of a fiscal year to the end of the year?",
      options: [
        "Ending Retained Earnings = Assets - Liabilities",
        "Ending Retained Earnings = Beginning Retained Earnings + Net Income - Dividends Paid",
        "Ending Retained Earnings = Total Sales * Profit Margin",
        "Ending Retained Earnings = Cash + Accounts Receivable"
      ],
      correct_option_index: 1,
      explanation: "Retained earnings roll-forward: Beginning Retained Earnings + Net Income - Dividends Paid = Ending Retained Earnings.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In the Statement of Cash Flows (Indirect Method), if a company's Accounts Receivable increases by $25,000 during the year, how is this change treated in CFO?",
      options: [
        "It is added to Net Income because sales grew",
        "It has zero impact on cash flows",
        "It is deducted ($25,000 cash outflow adjustment) from Net Income because revenue was recognized on the P&L but cash has not yet been collected",
        "It is classified under Cash Flow from Financing"
      ],
      correct_option_index: 2,
      explanation: "An increase in AR means revenues exceeded cash collections; it is deducted from Net Income in CFO.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "Under US GAAP (ASC 606) and IFRS 15, what is the core 5-step framework required to recognize revenue from contracts with customers?",
      options: [
        "1. Identify contract; 2. Identify distinct performance obligations; 3. Determine transaction price; 4. Allocate price to obligations; 5. Recognize revenue when obligations are satisfied",
        "1. Send invoice; 2. Wait 30 days; 3. Collect cash; 4. Pay tax; 5. Ship goods",
        "1. Sign contract; 2. Deposit check; 3. Record profit; 4. Pay bonus; 5. Audit",
        "1. Advertise product; 2. Make sale; 3. Record revenue immediately; 4. Reconcile; 5. Close"
      ],
      correct_option_index: 0,
      explanation: "ASC 606 mandates the standard 5-step revenue recognition model based on satisfying distinct performance obligations.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "On a classified Balance Sheet, how does a 'Deferred Tax Liability' (DTL) typically arise?",
      options: [
        "When a company fails to pay its taxes on time",
        "When the IRS audits the business",
        "When a company has zero revenue",
        "When temporary timing differences occur between financial accounting and tax rules (such as using MACRS accelerated depreciation for tax returns while using straight-line for financial statements)"
      ],
      correct_option_index: 3,
      explanation: "DTLs arise from temporary timing differences where tax depreciation exceeds book depreciation in early asset years.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In corporate finance and cash flow classification, which of the following transactions is categorized under 'Cash Flow from Investing Activities' (CFI)?",
      options: [
        "Paying cash dividends to shareholders",
        "Purchasing $500,000 of new industrial manufacturing machinery (Capital Expenditures / CapEx)",
        "Collecting cash from customer invoices",
        "Issuing $1,000,000 in corporate bonds"
      ],
      correct_option_index: 1,
      explanation: "CapEx (purchases of property, plant, and equipment) is classified under Cash Flow from Investing Activities (CFI).",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In calculating 'Diluted Earnings Per Share' (Diluted EPS), what method is standardly used under US GAAP to calculate the dilutive impact of in-the-money employee stock options?",
      options: [
        "The Direct Write-Off Method",
        "The Double-Declining Method",
        "The Treasury Stock Method (which assumes hypothetical proceeds from exercised options are used to repurchase shares on the open market at the average stock price)",
        "The FIFO Method"
      ],
      correct_option_index: 2,
      explanation: "The Treasury Stock Method assumes option proceeds are used to buy back shares at average market prices, calculating net dilution.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In a fully integrated 3-Statement Financial Model, how does a $10,000 increase in Depreciation Expense ripple dynamically through the Income Statement, Cash Flow Statement, and Balance Sheet (assuming a 20% corporate tax rate)?",
      options: [
        "P&L: Pre-tax income drops by $10k, Net Income drops by $8k (saving $2k in tax); CFS: Net Income starts at -$8k, +$10k non-cash depreciation added back, Net Cash increases by +$2k; Balance Sheet: Cash increases by +$2k, Net PP&E decreases by -$10k, and Retained Earnings decreases by -$8k (Assets drop -$8k = Equity drops -$8k)",
        "Cash decreases by $10,000 and Retained Earnings increases by $10,000",
        "There is zero effect on cash or balance sheet assets",
        "Net income increases by $10,000 due to tax credits"
      ],
      correct_option_index: 0,
      explanation: "The $10k depreciation creates a $2k tax shield, increasing net cash by $2k while net PP&E falls $10k and equity drops $8k (balanced).",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "Under US GAAP (ASC 350) and IFRS, how is 'Goodwill' presented on the Balance Sheet and how is its valuation maintained over time?",
      options: [
        "Goodwill is depreciated straight-line over 5 years",
        "Goodwill is written off to zero immediately upon acquisition",
        "Goodwill is adjusted every day based on stock market prices",
        "Goodwill is capitalized as an indefinite-life intangible asset; it is NOT amortized, but must be tested for impairment at least annually (or whenever triggering events indicate fair value < carrying value)"
      ],
      correct_option_index: 3,
      explanation: "Goodwill is not amortized under public US GAAP/IFRS; it is tested annually for impairment and written down if fair value drops.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In the Statement of Cash Flows, where are 'Cash Dividends Paid to Shareholders' and 'Interest Paid on Debt' classified under US GAAP (ASC 230)?",
      options: [
        "Both are classified in Cash Flow from Financing",
        "Dividends Paid are classified under Cash Flow from Financing Activities (CFF); Interest Paid is classified under Cash Flow from Operating Activities (CFO)",
        "Both are classified in Cash Flow from Investing",
        "Dividends are in Operating; Interest is in Financing"
      ],
      correct_option_index: 1,
      explanation: "Under US GAAP, Dividends Paid are CFF (equity return), while Interest Paid is classified under CFO (operating flow).",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "What is 'Accumulated Other Comprehensive Income' (AOCI) on the Balance Sheet, and why is it excluded from the standard Net Income figure on the Income Statement?",
      options: [
        "A bank account holding executive compensation",
        "A list of unpaid customer invoices",
        "A separate component of Stockholders' Equity that captures unrealized gains and losses (e.g. foreign currency translation adjustments, unrealized gains on available-for-sale securities, and pension plan adjustments) that have not yet been realized in operating transactions",
        "An emergency loan from the government"
      ],
      correct_option_index: 2,
      explanation: "AOCI captures unrealized non-owner equity changes (currency translation, AFS securities) bypass the P&L until realized.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In financial statement quality of earnings analysis, why is a persistent and widening divergence where Net Income significantly exceeds Cash Flow from Operating Activities (CFO) considered a major red flag?",
      options: [
        "It indicates aggressive accrual accounting, uncollected revenue growth (swelling Accounts Receivable), or inventory build-up that may signal deteriorating earnings quality or revenue overstatement",
        "It proves the company is paying zero taxes",
        "It means the company has too much cash",
        "It indicates that the company is switching from IFRS to GAAP"
      ],
      correct_option_index: 0,
      explanation: "When Net Income outpaces CFO over multiple periods, earnings are driven by non-cash accruals rather than real cash flow.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #109.");
  console.log("Skill #109 update completed successfully!");
}

run();
