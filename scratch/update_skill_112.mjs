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

const skillId = "01169605-a84d-41b1-bc21-3f21693ff937";

async function run() {
  console.log("Updating Skill #112: Financial Ratio Analysis (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Liquidity, Solvency and Financial Leverage Ratios" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Profitability, Asset Efficiency and DuPont Decomposition" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Market Multiples, Credit Scoring and Distress Modeling" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / CFA Charterholder & Lead Equity Research level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Short-Term Liquidity and Cash Preservation Metrics",
      order_index: 1,
      content: `### Short-Term Liquidity Ratios and Buffers

1. Current Ratio:
   - Formula: Current Assets / Current Liabilities. Evaluates general short-term solvency (healthy benchmark > 1.5x).

2. Quick Ratio (Acid-Test):
   - Formula: (Cash + Marketable Securities + Accounts Receivable) / Current Liabilities.
   - Strictly excludes illiquid inventory and prepaid assets; provides a stringent test of immediate obligations coverage (target >= 1.0x).

3. Cash Ratio:
   - Formula: Cash and Cash Equivalents / Current Liabilities.`
    },
    {
      track_id: track1Id,
      title: "Solvency, Debt Burden and Financial Leverage Ratios",
      order_index: 2,
      content: `### Capital Structure Gearing and Leverage Metrics

1. Debt-to-Equity (D/E) Ratio:
   - Formula: Total Debt / Total Stockholders' Equity. Measures the proportion of debt financing relative to net equity value.

2. Debt-to-Capital Ratio:
   - Formula: Total Debt / (Total Debt + Total Equity).

3. Financial Leverage Multiplier (Equity Multiplier):
   - Formula: Total Assets / Total Equity. Quantifies the degree to which assets are funded by debt.`
    },
    {
      track_id: track1Id,
      title: "Debt Service Coverage and Earnings Buffer Metrics",
      order_index: 3,
      content: `### Solvency Buffers and Lending Covenants

1. Interest Coverage Ratio (Times Interest Earned TIE):
   - Formula: Operating Income (EBIT) / Interest Expense.
   - Measures the operational safety buffer to service debt interest (< 2.0x signals severe default risk).

2. Debt-to-EBITDA Multiplier:
   - Formula: Total Debt / EBITDA. Standard bank lending and leveraged finance debt limit benchmark (typically capped at 3.0x to 4.5x).

3. Fixed Charge Coverage Ratio (FCCR):
   - Formula: (EBIT + Lease Payments) / (Interest Expense + Lease Payments).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Profit Margins, ROA and Return on Invested Capital",
      order_index: 1,
      content: `### Return Metrics and Economic Value Added (EVA)

1. Profitability Margins:
   - Gross Margin = Gross Profit / Revenue; Operating Margin = EBIT / Revenue; Net Margin = Net Income / Revenue.

2. Return on Assets (ROA):
   - Formula: Net Income / Total Assets.

3. Return on Invested Capital (ROIC):
   - Formula: NOPAT / (Total Debt + Total Equity - Cash).
   - Value Creation Spread: When ROIC exceeds WACC (ROIC > WACC), the enterprise generates positive Economic Value Added (EVA).`
    },
    {
      track_id: track2Id,
      title: "Asset Turnover and Operating Efficiency Cycles",
      order_index: 2,
      content: `### Asset Velocity and Working Capital Turnovers

1. Total Asset Turnover (TAT):
   - Formula: Revenue / Average Total Assets. Measures sales generated per dollar of capital assets.

2. Inventory Turnover:
   - Formula: COGS / Average Inventory (Days Inventory Outstanding DIO = 365 / Inventory Turnover).

3. Receivables Turnover:
   - Formula: Credit Sales / Average Accounts Receivable (Days Sales Outstanding DSO = 365 / Receivables Turnover).`
    },
    {
      track_id: track2Id,
      title: "The 3-Step and 5-Step DuPont ROE Decomposition",
      order_index: 3,
      content: `### Deconstructing Return on Equity (DuPont Analysis)

1. 3-Step DuPont Model:
   - ROE = Net Profit Margin * Asset Turnover * Equity Multiplier = (Net Income / Revenue) * (Revenue / Assets) * (Assets / Equity).
   - Isolates whether ROE is driven by operational profitability, asset efficiency, or financial debt leverage.

2. 5-Step DuPont Model:
   - ROE = Tax Burden * Interest Burden * EBIT Margin * Asset Turnover * Leverage = (NI / EBT) * (EBT / EBIT) * (EBIT / Rev) * (Rev / Assets) * (Assets / Equity).`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Market Valuation Multiples: P/E, PEG, EV/EBITDA and P/B",
      order_index: 1,
      content: `### Public Market Comps and Valuation Multiples

1. Equity Multiples:
   - Price-to-Earnings (P/E) = Market Price per Share / Earnings per Share (EPS).
   - Price/Earnings-to-Growth (PEG) = (P/E Ratio) / Annual EPS Growth Rate % (PEG < 1.0 indicates undervaluation relative to growth).
   - Price-to-Book (P/B) = Market Cap / Book Value of Equity.

2. Enterprise Value Multiples:
   - EV/EBITDA and EV/Sales (capital-structure neutral comparables evaluating the entire operating enterprise).`
    },
    {
      track_id: track3Id,
      title: "Edward Altman's Z-Score Bankruptcy Distress Model",
      order_index: 2,
      content: `### Insolvency Prediction and Credit Risk Scoring

1. The Classic Altman Z-Score Formula:
   - Z = 1.2*(Working Capital/Assets) + 1.4*(Retained Earnings/Assets) + 3.3*(EBIT/Assets) + 0.6*(Market Value Equity/Total Liabilities) + 0.999*(Sales/Assets).

2. The 3 Distress Zones:
   - Safe Zone: Z > 2.99 (low probability of default).
   - Grey Zone: 1.81 <= Z <= 2.99 (moderate risk).
   - Distress Zone: Z < 1.81 (high probability of corporate bankruptcy within 2 years).`
    },
    {
      track_id: track3Id,
      title: "Forensic Analysis, Common-Size Statements and Beneish M-Score",
      order_index: 3,
      content: `### Forensic Accounting and Earnings Quality Tests

1. Common-Size Financial Statements:
   - Vertical Analysis: P&L items expressed as % of Total Revenue; Balance Sheet items as % of Total Assets.
   - Horizontal Analysis: Percentage year-over-year line item growth rates.

2. Beneish M-Score:
   - An 8-variable mathematical composite model identifying financial engineering and earnings manipulation; an M-Score > -1.78 flags a high probability of accounting fraud.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #112.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In corporate liquidity analysis, what is the formula for the 'Quick Ratio' (Acid-Test Ratio)?",
      options: [
        "Quick Ratio = (Cash + Marketable Securities + Accounts Receivable) / Current Liabilities",
        "Quick Ratio = Total Assets / Total Debt",
        "Quick Ratio = Net Income / Revenue",
        "Quick Ratio = Inventory / Accounts Payable"
      ],
      correct_option_index: 0,
      explanation: "The Quick Ratio excludes illiquid inventory and prepaids: (Cash + Securities + AR) / Current Liabilities.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What does the 3-Step DuPont Analysis break Return on Equity (ROE) down into?",
      options: [
        "Cash, Debt, and Equity",
        "Sales, Expenses, and Taxes",
        "Net Profit Margin * Total Asset Turnover * Financial Leverage Multiplier (Equity Multiplier)",
        "Price, Earnings, and Book Value"
      ],
      correct_option_index: 2,
      explanation: "3-step DuPont: ROE = Net Margin (Profitability) * Asset Turnover (Efficiency) * Equity Multiplier (Leverage).",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In solvency and debt service coverage analysis, what does the 'Interest Coverage Ratio' (Times Interest Earned) measure?",
      options: [
        "How fast employees work",
        "How many times a company's Operating Income (EBIT) can cover its annual Interest Expense obligations",
        "The retail price of corporate bonds",
        "The corporate income tax rate"
      ],
      correct_option_index: 1,
      explanation: "Interest Coverage (EBIT / Interest Expense) measures the operational earnings cushion available to pay debt interest.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In public equity valuation, what does a 'PEG Ratio' (Price/Earnings to Growth) of LESS than 1.0 typically signal to investors?",
      options: [
        "The company is going bankrupt immediately",
        "The company has zero profit",
        "The stock is paying a 100% dividend",
        "The stock may be undervalued relative to its expected future earnings growth rate"
      ],
      correct_option_index: 3,
      explanation: "A PEG ratio below 1.0 indicates that a stock's P/E multiple is low relative to its underlying earnings growth rate.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In financial statement preparation, what is 'Vertical Common-Size Analysis' for an Income Statement?",
      options: [
        "Expressing every single income statement line item as a percentage of Total Net Revenue (100%)",
        "Printing statements vertically on poster board",
        "Sorting expenses from largest to smallest",
        "Converting dollars into foreign currency"
      ],
      correct_option_index: 0,
      explanation: "Vertical common-size P&L analysis displays every revenue and expense line item as a percentage of total net sales.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In Edward Altman's classic Z-Score bankruptcy prediction model, what score threshold indicates that a manufacturing company is in the dangerous 'Distress Zone'?",
      options: [
        "Z > 10.0",
        "Z = 5.0",
        "Z > 2.99",
        "Z < 1.81 (indicating a high statistical probability of bankruptcy within two years)"
      ],
      correct_option_index: 3,
      explanation: "An Altman Z-Score below 1.81 indicates severe financial distress and high probability of insolvency within 24 months.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "A company has Total Assets of $2,000,000 and Total Stockholders' Equity of $500,000. What is the company's 'Financial Leverage Multiplier' (Equity Multiplier)?",
      options: [
        "0.25x",
        "4.0x (calculated as: Total Assets $2,000,000 / Total Equity $500,000)",
        "2.5x",
        "10.0x"
      ],
      correct_option_index: 1,
      explanation: "Equity Multiplier = Total Assets / Total Equity = $2,000,000 / $500,000 = 4.0x (assets are 4 times net equity).",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In corporate finance and value creation metrics, when does an enterprise create positive 'Economic Value Added' (EVA)?",
      options: [
        "When its Return on Invested Capital exceeds its Weighted Average Cost of Capital (ROIC > WACC)",
        "When revenue increases by 5%",
        "When the company borrows more bank debt",
        "When the CEO receives a cash bonus"
      ],
      correct_option_index: 0,
      explanation: "Economic Value Added is created only when returns on capital exceed the blended hurdle cost of that capital (ROIC > WACC).",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "A company reports Annual Cost of Goods Sold (COGS) of $3,650,000 and Average Inventory of $365,000. What is the company's 'Days Inventory Outstanding' (DIO)?",
      options: [
        "100 days",
        "10 days",
        "36.5 days (calculated as: 365 days / (COGS $3,650,000 / Average Inventory $365,000 = 10x Inventory Turnover))",
        "365 days"
      ],
      correct_option_index: 2,
      explanation: "Inventory Turnover = $3.65M / $365k = 10x. Days Inventory Outstanding (DIO) = 365 / 10 = 36.5 days.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In forensic accounting and earnings quality detection, what is the primary purpose of the 'Beneish M-Score'?",
      options: [
        "To calculate corporate sales commissions",
        "To predict employee promotions",
        "To calculate inventory reorder points",
        "An 8-variable mathematical composite model that flags the statistical probability that a company has manipulated or artificially inflated its reported earnings (M-Score > -1.78 indicates high fraud risk)"
      ],
      correct_option_index: 3,
      explanation: "The Beneish M-Score uses financial statement ratios to detect accounting manipulation and earnings distortion (M > -1.78).",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In the 5-Step DuPont Model, what specific operational and financial factor does the 'Interest Burden' ratio (EBT / EBIT) isolate?",
      options: [
        "The impact of income tax rates on net income",
        "The percentage of operating earnings (EBIT) that remains after paying debt interest expenses; a lower ratio reveals a heavier debt interest drain on profits",
        "How fast inventory is sold",
        "The company's marketing spending efficiency"
      ],
      correct_option_index: 1,
      explanation: "Interest Burden (EBT / EBIT) measures the proportion of operating profits retained after paying debt interest financing costs.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "Why is the 'EV/EBITDA' multiple generally preferred over the 'P/E' multiple when comparing companies with significantly different capital structures or tax regimes?",
      options: [
        "Because EBITDA is always higher than revenue",
        "Because P/E ratios are illegal in Europe",
        "Because Enterprise Value and EBITDA are capital-structure-neutral (unaffected by differing debt-to-equity leverage, interest expense, or tax rate variations)",
        "Because EV/EBITDA ignores depreciation costs completely"
      ],
      correct_option_index: 2,
      explanation: "EV/EBITDA measures total enterprise operating value independent of debt capitalization, interest burden, and tax jurisdictions.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In banking credit analysis, what does a 'Fixed Charge Coverage Ratio' (FCCR) measure that standard Interest Coverage (TIE) misses?",
      options: [
        "It incorporates fixed operating lease obligations into both the numerator and denominator: (EBIT + Lease Payments) / (Interest + Lease Payments), capturing off-balance-sheet rental debt burdens",
        "It measures fixed employee bonuses",
        "It measures utility electricity costs",
        "It calculates dividend yields"
      ],
      correct_option_index: 0,
      explanation: "FCCR accounts for mandatory operating lease payments alongside interest debt service, providing a true fixed-charge cushion.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In corporate efficiency analysis, if a firm increases its Total Asset Turnover (TAT) from 1.2x to 1.8x while maintaining identical Net Profit Margins (10%) and Financial Leverage Multipliers (2.0x), what is the resulting impact on its Return on Equity (ROE)?",
      options: [
        "ROE remains unchanged at 24%",
        "ROE decreases to 12%",
        "ROE increases to 50%",
        "ROE increases from 24% (10% * 1.2 * 2.0) to 36% (10% * 1.8 * 2.0), demonstrating increased asset productivity driving shareholder returns"
      ],
      correct_option_index: 3,
      explanation: "DuPont math: Old ROE = 10% * 1.2 * 2.0 = 24%. New ROE = 10% * 1.8 * 2.0 = 36% (a 12 percentage point increase).",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In corporate credit analysis, why is a high 'Total Debt to EBITDA' ratio (e.g. > 5.0x) considered a critical warning sign for bond investors?",
      options: [
        "It means the company has zero employees",
        "It indicates that it would take more than 5 full years of operational cash flow (at current EBITDA levels) strictly to repay outstanding debt principal, increasing vulnerability to interest rate hikes and refinancing shocks",
        "It means the stock price will automatically double",
        "It shows that the company has too much cash on hand"
      ],
      correct_option_index: 1,
      explanation: "Debt/EBITDA > 5.0x indicates heavy leverage taking over 5 years of pre-tax cash flow to extinguish debt, elevating default risk.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #112.");
  console.log("Skill #112 update completed successfully!");
}

run();
