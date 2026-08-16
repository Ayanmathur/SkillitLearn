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

const skillId = "dda5fc27-48d2-4470-bb0f-d261d643f530";

async function run() {
  console.log("Updating Skill #111: Financial Modeling (9 steps across 3 tracks)...");

  // 1. Fetch tracks for this skill
  let { data: tracks, error: tErr } = await supabase
    .from("tracks")
    .select("id, title, order_index")
    .eq("skill_id", skillId)
    .order("order_index");

  if (tErr) {
    console.error("Error fetching tracks:", tErr);
    return;
  }

  // Delete excess tracks if > 3
  if (tracks.length > 3) {
    const extraTrackIds = tracks.slice(3).map(t => t.id);
    await supabase.from("steps").delete().in("track_id", extraTrackIds);
    await supabase.from("tracks").delete().in("id", extraTrackIds);
    tracks = tracks.slice(0, 3);
  }

  // Ensure exactly 3 tracks exist
  while (tracks.length < 3) {
    const { data: newTrack } = await supabase
      .from("tracks")
      .insert({
        skill_id: skillId,
        title: `Track ${tracks.length + 1}: Financial Modeling`,
        order_index: tracks.length + 1
      })
      .select()
      .single();
    tracks.push(newTrack);
  }

  tracks.sort((a, b) => a.order_index - b.order_index);

  const track1Id = tracks[0].id;
  const track2Id = tracks[1].id;
  const track3Id = tracks[2].id;

  // Update Track titles
  await supabase.from("tracks").update({ title: "Track 1: Integrated 3-Statement Modeling Architecture and Best Practices" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Discounted Cash Flow (DCF) and Cost of Capital (WACC)" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: LBO, M&A Accretion/Dilution and Sensitivity Tables" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Investment Banking VP & Private Equity Director level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Financial Modeling Standards (FAST) and Color-Coding",
      order_index: 1,
      content: `### Wall Street Modeling Conventions and Code Rigor

1. The FAST Modeling Standard:
   - Flexible, Appropriate, Structured, and Transparent model design.

2. Universal Color-Coding Conventions:
   - Blue Font: Hardcoded input drivers and historical constants.
   - Black Font: Dynamic spreadsheet formulas and mathematical logic.
   - Green Font: Cross-worksheet links referencing other tabs in the workbook.
   - Red/Yellow Fill: External warnings, plugs, and automated balance sheet error check formulas.`
    },
    {
      track_id: track1Id,
      title: "Revenue Builds, Working Capital and PP&E Schedules",
      order_index: 2,
      content: `### Supporting Operational Schedules and Asset Roll-Forwards

1. Operating Schedules:
   - Revenue Build: Detailed bottom-up volume * pricing drivers.
   - Working Capital Schedule: Converting DSO, DIO, and DPO days assumptions into projected Accounts Receivable, Inventory, and Accounts Payable balances.
   - PP&E Schedule: Beginning Net PP&E + CapEx - Depreciation - Asset Sales = Ending Net PP&E.`
    },
    {
      track_id: track1Id,
      title: "Debt Schedules, Circular Interest Sweeps and Cash Balancing",
      order_index: 3,
      content: `### Capital Structure Modeling and Balance Sheet Equilibrium

1. Debt Schedule Mechanics:
   - Senior term debt amortization, mandatory repayments, and Revolving Credit Facility (Revolver) sweeps.

2. Circular Interest Calculations:
   - Interest Expense calculated on average beginning and ending debt balances, linked to the P&L.
   - Balance Sheet Check Formula: Total Assets - (Total Liabilities + Total Equity) = 0.00.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Unlevered Free Cash Flow (FCFF) Modeling",
      order_index: 1,
      content: `### Cash Flow Available to All Capital Providers

1. Unlevered Free Cash Flow (UFCF / FCFF) Formula:
   - UFCF = EBIT * (1 - Tax Rate) + D&A - Capital Expenditures (CapEx) - Delta Net Working Capital.

2. Mid-Year Discounting Convention:
   - Assumes cash flows are generated evenly throughout each 12-month period rather than lumping all cash at year-end, discounting via (t - 0.5) time periods.`
    },
    {
      track_id: track2Id,
      title: "Capital Asset Pricing Model (CAPM) and WACC",
      order_index: 2,
      content: `### Blended Cost of Capital and Beta Levering

1. Cost of Equity (CAPM):
   - Re = Risk-Free Rate (Rf) + Levered Beta * Equity Risk Premium (ERP).

2. Delevering and Relevering Peer Beta (Hamada's Equation):
   - Levered Beta = Unlevered Beta * [1 + (1 - Tax Rate) * (Debt / Equity)].

3. Weighted Average Cost of Capital (WACC):
   - WACC = (Equity/Total Capital * Re) + (Debt/Total Capital * Rd * (1 - Tax Rate)).`
    },
    {
      track_id: track2Id,
      title: "Terminal Value and Enterprise Value to Equity Value Bridge",
      order_index: 3,
      content: `### Valuation Synthesis and Implied Share Price

1. Terminal Value (TV) Methods:
   - Gordon Growth: TV = (UFCF_final * (1 + g)) / (WACC - g).
   - Exit Multiple: TV = Final Year EBITDA * Target EV/EBITDA Multiple.

2. The Enterprise Value to Equity Value Bridge:
   - Equity Value = PV of Discrete Cash Flows + PV of Terminal Value - Net Debt (Total Debt - Cash) - Minority Interest.
   - Implied Share Price = Equity Value / Fully Diluted Shares Outstanding.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Leveraged Buyout (LBO) Model Architecture and Returns",
      order_index: 1,
      content: `### Private Equity Returns and Cash Sweep Cascades

1. LBO Capital Structure (Sources & Uses):
   - Senior Bank Debt (3-4x EBITDA), Mezzanine / High-Yield Notes (1-2x), and Sponsor Equity Check (35-45% of total purchase price).

2. Debt Paydown Cascade and Returns:
   - 100% of excess Free Cash Flow swept to pay down senior debt tranches.
   - Evaluating sponsor returns: Internal Rate of Return (IRR >= 20-25%) and Multiple on Invested Capital (MoIC >= 2.0x to 3.0x over 5 years).`
    },
    {
      track_id: track3Id,
      title: "M&A Accretion/Dilution Model and Synergy Valuation",
      order_index: 2,
      content: `### Merger Consequences and Purchase Price Allocation

1. M&A Analysis:
   - Purchase Price Allocation (PPA): Writing up target identifiable tangible/intangible assets and creating balance sheet Goodwill.

2. Pro-Forma EPS Accretion / Dilution:
   - Modeling transaction financing (Cash, New Debt, Acquirer Stock) and pre-tax cost/revenue synergies.
   - Deal is Accretive if Combined Pro-Forma EPS > Acquirer Standalone EPS.`
    },
    {
      track_id: track3Id,
      title: "Dynamic 2-Way Sensitivity Tables and Scenario Switches",
      order_index: 3,
      content: `### Advanced Sensitivity Tables and Excel Automation

1. Dynamic 2-Way Data Tables:
   - Utilizing Excel Data Tables (=TABLE(row_input, col_input)) to stress-test implied share price against varying WACC rates (rows) and Terminal Growth rates (columns).

2. Scenario Toggle Switches:
   - Implementing dynamic model switches using CHOOSE() and INDEX(MATCH()) functions to instantly toggle between Base, Bull, and Bear operating assumptions.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #111.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In standard Wall Street financial modeling color-coding conventions, what does BLUE font indicate in a cell?",
      options: [
        "A calculation formula",
        "A hardcoded numerical input assumption or historical constant",
        "A link to another worksheet",
        "A cell that contains an error"
      ],
      correct_option_index: 1,
      explanation: "Blue font signifies hardcoded input constants; black signifies formulas; green signifies links to other tabs.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What is the formula used to calculate Unlevered Free Cash Flow (UFCF / Free Cash Flow to Firm) in a DCF model?",
      options: [
        "UFCF = Net Income + Dividends",
        "UFCF = Revenue - Expenses",
        "UFCF = Total Assets - Total Liabilities",
        "UFCF = EBIT * (1 - Tax Rate) + D&A - CapEx - Change in Net Working Capital"
      ],
      correct_option_index: 3,
      explanation: "UFCF represents cash generated by operations available to all capital providers: NOPAT + D&A - CapEx - Delta NWC.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In the Gordon Growth Method of calculating Terminal Value in a DCF model, what is the mathematical formula?",
      options: [
        "Terminal Value = (Final Year UFCF * (1 + g)) / (WACC - g)",
        "Terminal Value = Revenue * Profit Margin",
        "Terminal Value = Total Assets / Number of Shares",
        "Terminal Value = Net Income * 10"
      ],
      correct_option_index: 0,
      explanation: "Gordon Growth formula: TV = (UFCF_final * (1 + g)) / (WACC - g), capitalizing terminal cash flows in perpetuity.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In corporate valuation and financial modeling, what is the formula to bridge Enterprise Value (EV) to Equity Value?",
      options: [
        "Equity Value = Enterprise Value + Total Debt",
        "Equity Value = Revenue - COGS",
        "Equity Value = Enterprise Value - Total Debt + Cash - Minority Interest",
        "Equity Value = Total Assets / Market Capitalization"
      ],
      correct_option_index: 2,
      explanation: "Equity Value = Enterprise Value - Total Debt + Cash (Net Debt subtracted) - Preferred Stock/Minority Interest.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In a Leveraged Buyout (LBO) model, what two primary return metrics are evaluated by private equity sponsors?",
      options: [
        "Customer satisfaction score and employee turnover",
        "Internal Rate of Return (IRR) and Multiple on Invested Capital (MoIC)",
        "Gross Margin and Inventory turnover",
        "Accounts Receivable DSO and Days Payable DPO"
      ],
      correct_option_index: 1,
      explanation: "Private equity sponsors evaluate deal performance using IRR (annualized percentage return) and MoIC (cash return multiple).",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In calculating the Weighted Average Cost of Capital (WACC), why is the Cost of Debt multiplied by '(1 - Tax Rate)'?",
      options: [
        "To account for inflation",
        "Because corporate debt is taxed twice",
        "To account for the Interest Tax Shield, because interest expense on debt is tax-deductible under corporate tax law",
        "Because banks charge a 20% penalty fee"
      ],
      correct_option_index: 2,
      explanation: "Interest expense is tax-deductible, reducing the effective after-tax cost of debt financing to Rd * (1 - t).",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "Under the Capital Asset Pricing Model (CAPM), what formula determines a company's Cost of Equity (Re)?",
      options: [
        "Re = Risk-Free Rate (Rf) + Levered Beta * Equity Risk Premium (ERP)",
        "Re = Debt / Equity * Interest Rate",
        "Re = Net Income / Total Assets",
        "Re = Stock Price * Dividend Yield"
      ],
      correct_option_index: 0,
      explanation: "CAPM formula: Cost of Equity = Risk-Free Rate + Beta * (Market Return - Risk-Free Rate).",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In M&A merger modeling, what determines whether an acquisition is 'Accretive' to the buyer's Earnings Per Share (EPS)?",
      options: [
        "If the target company has more employees than the acquirer",
        "If the purchase price is paid 100% in stock",
        "If the target company is located in a foreign country",
        "If the combined pro-forma Earnings Per Share (EPS) of the merged entity is HIGHER than the acquirer's standalone EPS"
      ],
      correct_option_index: 3,
      explanation: "A transaction is accretive if combined pro-forma EPS exceeds the buyer's standalone EPS post-transaction.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In DCF modeling, why is the 'Mid-Year Discounting Convention' preferred over standard year-end discounting?",
      options: [
        "It makes models easier to build in Excel",
        "Because corporate cash flows are received continuously throughout the entire 12-month fiscal year, rather than arriving in a single lump sum on December 31",
        "It doubles the valuation of every company",
        "It is required by IRS tax authorities"
      ],
      correct_option_index: 1,
      explanation: "Mid-year discounting reflects the realistic reality that operational cash flows are earned continuously across the year.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "When modeling an integrated 3-statement financial model, what line item functions as the dynamic liquidity 'Plug' on the Balance Sheet to ensure assets equal liabilities plus equity?",
      options: [
        "Accounts Payable",
        "Retained Earnings",
        "Cash and Cash Equivalents (or a Revolving Credit Facility / Revolver if cash drops below minimum operating cash)",
        "Common Stock"
      ],
      correct_option_index: 2,
      explanation: "Cash (from the cash flow statement) and the Revolving credit line absorb cash surpluses or shortfalls to balance the model.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In financial valuation theory, how does Hamada's Equation allow an analyst to 'Delever' a peer company's Beta and 'Relever' it to the target company's capital structure?",
      options: [
        "Unlevered Beta = Levered Beta / [1 + (1 - Tax Rate) * (Debt/Equity)]; then Relevered Beta = Unlevered Beta * [1 + (1 - Tax Rate) * (Target Debt/Target Equity)]",
        "By dividing the stock price by book value",
        "By subtracting the risk-free rate from the market return",
        "By multiplying beta by the company's P/E ratio"
      ],
      correct_option_index: 0,
      explanation: "Hamada's equation isolates pure business operating risk (unlevering) before applying the target company's specific financial leverage.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In an LBO debt schedule, what is a 'Cash Sweep Waterfall'?",
      options: [
        "Cleaning money out of physical bank vaults",
        "A method to hide corporate profits from tax authorities",
        "A bonus paid to executives when a deal closes",
        "A contractual covenant requiring 100% of available excess Free Cash Flow generated by the business to be used to prepay outstanding senior debt principal before junior tranches or equity dividends"
      ],
      correct_option_index: 3,
      explanation: "A cash sweep funnels excess post-operating cash to prepay debt, de-leveraging the business and compounding equity value.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Excel financial modeling engineering, how is a dynamic '2-Way Data Table' configured to sensitivity-test valuation without breaking the model?",
      options: [
        "By manually typing in 50 different numbers",
        "By using the '=TABLE(row_input_cell, col_input_cell)' What-If Analysis function referencing the core valuation output and linking to the WACC and Terminal Growth rate driver cells",
        "By running a macro that deletes rows",
        "By linking to an external PDF document"
      ],
      correct_option_index: 1,
      explanation: "Excel Data Tables run multi-variable simulations, dynamically populating valuation matrix grids across two driver inputs.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In dynamic 3-statement modeling, what causes a 'Circular Reference' when linking the Debt Schedule and the Income Statement, and how is it managed?",
      options: [
        "Typing words into number cells",
        "Using lowercase letters instead of uppercase",
        "Interest Expense depends on Average Debt (which depends on Ending Cash, which depends on Net Income, which depends on Interest Expense); solved by enabling Excel Iterative Calculations or adding an interest toggle switch",
        "Circular references always destroy the spreadsheet"
      ],
      correct_option_index: 2,
      explanation: "Circular loops occur when average debt drives interest expense, which alters net income and cash flow, resolved via iterative calculation.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In an M&A transaction, what is 'Purchase Price Allocation' (PPA) and how is 'Goodwill' calculated on the pro-forma balance sheet?",
      options: [
        "Goodwill = Purchase Price Allocated to Target Equity - Fair Market Value of Target's Net Identifiable Assets (Assets acquired minus Liabilities assumed)",
        "Goodwill = Purchase Price * 50%",
        "Goodwill = Target Total Revenue - Target Net Income",
        "Goodwill is always zero under GAAP"
      ],
      correct_option_index: 0,
      explanation: "Goodwill represents the excess purchase price paid over the fair market value of net identifiable tangible and intangible assets acquired.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #111.");
  console.log("Skill #111 update completed successfully!");
}

run();
