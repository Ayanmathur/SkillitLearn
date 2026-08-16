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

const skillId = "baf47bae-18ea-4d3d-b672-4ac5af114ba8";

async function run() {
  console.log("Updating Skill #90: Basic Business Finance (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: The Three Financial Statements, GAAP Accrual Accounting and P&L" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Cash Flow Engineering, Burn Rate and Runway Management" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Break-Even Economics, Operating Leverage and Financial Modeling" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / CFO & Venture Finance level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Income Statement (P&L): Revenue, Margins and EBITDA",
      order_index: 1,
      content: `### Operating Profitability Waterfall and Margin Analysis

1. The P&L Waterfall Structure:
   - Gross Revenue - Discounts/Refunds = Net Revenue.
   - Net Revenue - Cost of Goods Sold (COGS) = Gross Profit (Gross Margin %).
   - Gross Profit - Operating Expenses (OPEX: R&D, Sales & Marketing, G&A) = EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization).
   - EBITDA - Depreciation & Amortization = Operating Income (EBIT).
   - EBIT - Interest Expense - Income Taxes = Net Income (Bottom Line).`
    },
    {
      track_id: track1Id,
      title: "The Balance Sheet: Assets, Liabilities and Working Capital",
      order_index: 2,
      content: `### Enterprise Solvency and Asset Valuation

1. The Fundamental Accounting Equation:
   - Assets = Liabilities + Shareholders' Equity.

2. Balance Sheet Components:
   - Current Assets (Cash, Accounts Receivable AR, Inventory) vs Non-Current Assets (Equipment, Intellectual Property).
   - Current Liabilities (Accounts Payable AP, Short-term debt, Accrued payroll) vs Long-term Debt.
   - Net Working Capital = Current Assets - Current Liabilities (measures short-term operational liquidity).`
    },
    {
      track_id: track1Id,
      title: "The Cash Flow Statement and Accrual vs Cash Accounting",
      order_index: 3,
      content: `### Cash Velocity and Revenue Recognition Standards

1. Three Core Cash Flow Sections:
   - Cash Flow from Operating Activities (CFO): Net Income adjusted for non-cash D&A and Working Capital balance changes (AR, Inventory, AP).
   - Cash Flow from Investing Activities (CFI): Capital expenditures (CapEx) and software purchases.
   - Cash Flow from Financing Activities (CFF): Debt issuance, equity rounds, and dividends.

2. GAAP Accrual Accounting (ASC 606):
   - Revenue is recognized when performance obligations are delivered, not when cash is received; upfront annual subscriptions are booked as Deferred Revenue (a Liability) and amortized monthly.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Gross Burn, Net Burn Rate and Zero Cash Date Runway",
      order_index: 1,
      content: `### Startup Cash Solvency and Runway Planning

1. Burn Rate Formulations:
   - Gross Burn Rate: Total monthly cash expenditures (payroll, cloud servers, marketing, office rent).
   - Net Burn Rate = Total Monthly Cash Outflows - Total Monthly Cash Inflows (actual monthly cash loss).

2. Cash Runway Formulation:
   - Cash Runway (Months) = Available Cash Reserves / Monthly Net Burn Rate.
   - Zero Cash Date (ZCD): The calendar date cash reaches zero; companies must initiate fundraising or cost reduction when runway reaches 6 months.`
    },
    {
      track_id: track2Id,
      title: "The Cash Conversion Cycle (CCC) and Working Capital",
      order_index: 2,
      content: `### Operational Cash Velocity and Negative Working Capital

1. The Cash Conversion Cycle (CCC) Equation:
   - CCC (Days) = Days Inventory Outstanding (DIO) + Days Sales Outstanding (DSO) - Days Payable Outstanding (DPO).

2. Negative Working Capital Strategy (The Amazon/Dell Model):
   - Collecting immediate cash upfront from customers (DSO = 0) while negotiating 60-day payment terms with suppliers (DPO = 60), resulting in a negative CCC where growth generates surplus cash rather than consuming it.`
    },
    {
      track_id: track2Id,
      title: "AR/AP Management, Invoicing Terms and Liquidity Buffers",
      order_index: 3,
      content: `### Working Capital Acceleration and Treasury Controls

1. Invoicing Terms (2/10 Net 30):
   - Offering a 2% cash discount if the invoice is paid within 10 days, otherwise full balance due in 30 days, accelerating Accounts Receivable collections.

2. Liquidity Reserve Governance:
   - Maintaining a dedicated 3 to 6 month operating cash reserve in high-yield treasury bills to buffer against customer payment defaults or macroeconomic recessions.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Break-Even Analysis and Contribution Margin",
      order_index: 1,
      content: `### Unit Contribution and Break-Even Volume

1. Unit Contribution Margin:
   - Contribution Margin per Unit = Unit Sales Price - Unit Variable Cost.
   - Contribution Margin Ratio = (Unit Price - Unit Variable Cost) / Unit Price.

2. Break-Even Volume Formulation:
   - Break-Even Quantity (Units) = Total Fixed Overhead Costs / Contribution Margin per Unit.
   - Determines the exact unit sales volume required to achieve zero net loss.`
    },
    {
      track_id: track3Id,
      title: "Operating Leverage and Cost Structure Dynamics",
      order_index: 2,
      content: `### Fixed vs Variable Cost Structures and Margin Expansion

1. Degree of Operating Leverage (DOL):
   - DOL = % Change in Operating Income (EBIT) / % Change in Sales Revenue = Total Contribution Margin / EBIT.

2. High Operating Leverage in Software:
   - High fixed development costs paired with near-zero marginal variable costs create massive profit acceleration once the break-even threshold is passed.`
    },
    {
      track_id: track3Id,
      title: "3-Statement Dynamic Financial Modeling and Scenarios",
      order_index: 3,
      content: `### Integrated FP&A Modeling and Stress Testing

1. Dynamic 3-Statement Model Architecture:
   - Net Income from the P&L links directly to Operating Cash Flow on the CFS.
   - Capital Expenditures on the CFS link to Fixed Assets on the Balance Sheet.
   - Ending Cash from the CFS feeds directly into Balance Sheet Cash Assets.

2. Scenario & Sensitivity Analysis:
   - Modeling Base Case, Bull Case (+30% growth), and Bear Case (-30% sales shock, +20% churn) to stress-test runway survival.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #90.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "What is the fundamental accounting equation that must balance on every corporate Balance Sheet?",
      options: [
        "Assets = Liabilities + Shareholders' Equity",
        "Revenue = Expenses * Tax Rate",
        "Profit = Cash + Inventory",
        "Assets = Revenue - Debt"
      ],
      correct_option_index: 0,
      explanation: "Assets = Liabilities + Equity is the foundational double-entry accounting balance equation.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In financial accounting, what does EBITDA stand for?",
      options: [
        "Equity Balance In Total Dollar Amounts",
        "Employee Income Before Tax Deductions and Audits",
        "Earnings Before Interest, Taxes, Depreciation, and Amortization",
        "Estimated Budget Including Tax Debt Assets"
      ],
      correct_option_index: 2,
      explanation: "EBITDA measures raw operating profitability before financing costs, tax structures, and non-cash capital depreciation.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In startup finance, what is the formula used to calculate Cash Runway in months?",
      options: [
        "Runway = Total Revenue / Total Employees",
        "Cash Runway (Months) = Total Available Cash Reserves / Monthly Net Burn Rate",
        "Runway = Stock Price * Number of Shares",
        "Runway = Annual Contract Value / CAC"
      ],
      correct_option_index: 1,
      explanation: "Cash Runway measures how many months a startup can operate before running out of money at current net cash burn rates.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In corporate finance, how is Net Working Capital calculated?",
      options: [
        "Net Working Capital = Gross Revenue - Income Tax",
        "Net Working Capital = Bank Balance * 12",
        "Net Working Capital = Total Debt / Total Assets",
        "Net Working Capital = Current Assets - Current Liabilities"
      ],
      correct_option_index: 3,
      explanation: "Net Working Capital (Current Assets minus Current Liabilities) measures short-term operating liquidity.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What is the formula to calculate the Break-Even Volume in unit sales?",
      options: [
        "Break-Even Units = Total Fixed Costs / (Unit Sales Price - Unit Variable Cost)",
        "Break-Even Units = Gross Revenue / Total Employees",
        "Break-Even Units = Cash Balance * 100",
        "Break-Even Units = Total Debt / Price"
      ],
      correct_option_index: 0,
      explanation: "Break-Even volume divides total fixed overhead costs by unit contribution margin to find the exact zero-profit sales volume.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In GAAP accrual accounting (ASC 606), how is an upfront payment for a 12-month $120,000 SaaS contract treated on the day cash is received?",
      options: [
        "Recognized immediately as $120,000 net income on the P&L",
        "Recorded as an expense on the Cash Flow Statement",
        "Deleted from the balance sheet",
        "Recorded as $120,000 in Cash (Asset) and $120,000 in Deferred Revenue (Liability), recognizing $10,000 revenue monthly on the P&L as the service is delivered"
      ],
      correct_option_index: 3,
      explanation: "Unearned revenue received upfront is a liability (Deferred Revenue) until performance obligations are delivered over time.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In working capital management, what is the Cash Conversion Cycle (CCC) formula?",
      options: [
        "CCC = Revenue - Profit",
        "CCC (Days) = Days Inventory Outstanding (DIO) + Days Sales Outstanding (DSO) - Days Payable Outstanding (DPO)",
        "CCC = Cash / Burn Rate",
        "CCC = Assets + Liabilities"
      ],
      correct_option_index: 1,
      explanation: "CCC measures the days required to convert operational inventory and receivables into cash minus supplier credit days.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In business commercial terms, what does the invoicing term '2/10 Net 30' mean?",
      options: [
        "The customer receives a 2% discount if they pay within 10 days; otherwise, the full invoice balance is due in 30 days",
        "The customer pays 2 dollars for 10 items",
        "The invoice is due in 2 months and 10 days",
        "The customer is charged a 20% late fee"
      ],
      correct_option_index: 0,
      explanation: "2/10 Net 30 incentivizes rapid cash collection by offering a 2% discount for payments within 10 days.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What is the fundamental difference between 'Gross Burn Rate' and 'Net Burn Rate'?",
      options: [
        "Gross burn includes taxes; net burn does not",
        "Net burn is for hardware; gross burn is for software",
        "Gross Burn is total monthly cash spent; Net Burn is total cash spent minus total incoming cash revenue",
        "There is zero difference between them"
      ],
      correct_option_index: 2,
      explanation: "Gross burn measures total cash outflow; net burn factors in incoming revenue to measure actual monthly net cash loss.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In operational economics, why do software businesses with 'High Operating Leverage' experience massive profit acceleration after reaching break-even?",
      options: [
        "Software companies pay zero corporate taxes",
        "Software companies have no employees",
        "Software is exempt from inflation",
        "Because fixed development costs are high but marginal variable costs to serve each new user are near zero, so nearly all incremental revenue flows directly to operating profit"
      ],
      correct_option_index: 3,
      explanation: "High operating leverage produces high incremental profit margins because variable costs per additional user are negligible.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In working capital strategy, how does a 'Negative Cash Conversion Cycle' (e.g. Amazon, Dell) provide a powerful financing advantage?",
      options: [
        "It forces the company into bankruptcy",
        "The company collects cash immediately from customers at the point of sale (DSO = 0) while paying suppliers on extended 60-90 day terms (high DPO), using suppliers' capital to fund company growth with zero interest",
        "It eliminates all payroll expenses",
        "It doubles customer refund requests"
      ],
      correct_option_index: 1,
      explanation: "Negative CCC means customers finance inventory before suppliers must be paid, generating cash as the business grows.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In 3-Statement financial modeling, how does a $10,000 depreciation expense on the Income Statement flow through to the Cash Flow Statement and Balance Sheet?",
      options: [
        "Depreciation has zero effect on the other statements",
        "Depreciation decreases cash by $10,000 directly",
        "Depreciation reduces Net Income on the P&L, is added back as a non-cash expense on the Cash Flow Statement (CFO), and reduces Property, Plant & Equipment (PP&E) on the Balance Sheet",
        "Depreciation increases liabilities by $10,000"
      ],
      correct_option_index: 2,
      explanation: "Non-cash depreciation reduces accounting net income, is added back on the CFS, and reduces accumulated asset book value on the Balance Sheet.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In corporate treasury management, what is the 'Zero Cash Date' (ZCD) and when should governance protocols trigger executive action?",
      options: [
        "The exact projected calendar date available cash reserves hit $0; founders must trigger structured cost cuts or launch fundraising campaigns at least 6 months prior to ZCD",
        "The date a company opens its bank account",
        "The date employees receive bonuses",
        "The last day of the fiscal year"
      ],
      correct_option_index: 0,
      explanation: "ZCD projects bankruptcy if burn is unchanged; launching fundraising or cost restructuring at 6 months runway prevents desperate insolvency.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In financial modeling, what is the purpose of 'Sensitivity and Scenario Analysis' (Base Case vs Bull Case vs Bear Case)?",
      options: [
        "To predict exact lottery numbers",
        "To make financial statements look more impressive to banks",
        "To hide financial losses from auditors",
        "To stress-test runway and liquidity under adverse market conditions (e.g. -30% revenue shock, +20% churn), determining capital buffer requirements"
      ],
      correct_option_index: 3,
      explanation: "Scenario modeling tests resilience against adverse economic shocks to ensure the business maintains adequate liquidity buffers.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "How does 'Operating Income' (EBIT) differ from 'Net Income' (Bottom Line) on a corporate Income Statement?",
      options: [
        "EBIT includes personal founder expenses",
        "EBIT reflects core business operating profit before financing costs (interest expense) and government income taxes, while Net Income reflects the final residual profit after all interest and taxes",
        "Net income is always higher than EBIT",
        "There is zero difference under GAAP"
      ],
      correct_option_index: 1,
      explanation: "EBIT measures pure operational performance, while Net Income deducts non-operating interest expenses and corporate taxes.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #90.");
  console.log("Skill #90 update completed successfully!");
}

run();
