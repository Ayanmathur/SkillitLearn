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

const skillId = "a25c3fe1-ae09-4a96-870c-0ff39cd24f0f";

async function run() {
  console.log("Updating Skill #113: Valuation Basics (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Intrinsic Valuation and Discounted Cash Flow (DCF) Mechanics" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Relative Valuation, Trading Comps and Precedent Transactions" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Asset-Based Valuation, SOTP and The Football Field Chart" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Valuation Professor & M&A Managing Director level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Philosophy of Intrinsic Valuation and Cash Flow Typologies",
      order_index: 1,
      content: `### Intrinsic Valuation and Cash Flow Frameworks

1. The Intrinsic Valuation Principle (Damodaran):
   - The value of an asset equals the present value of its future expected cash flows, discounted at a rate reflecting operating and financial risk.

2. FCFF vs FCFE:
   - Free Cash Flow to Firm (FCFF / Unlevered FCF): Cash flow generated before debt servicing, discounted at the Weighted Average Cost of Capital (WACC).
   - Free Cash Flow to Equity (FCFE / Levered FCF): Cash flow remaining after interest and net debt repayments, discounted at the Cost of Equity (Re).`
    },
    {
      track_id: track1Id,
      title: "Multi-Stage DCF Models and the Fundamental Growth Equation",
      order_index: 2,
      content: `### Growth Fundamentals and Multi-Stage DCF Models

1. Fundamental Growth Equation:
   - Fundamental Operating Growth Rate (g) = Reinvestment Rate * Return on Invested Capital (ROIC).

2. Multi-Stage Modeling:
   - Stage 1 (High Growth): 5-to-10 year projection of discrete cash flows reflecting competitive advantage.
   - Stage 2 (Fade / Transition): Fading excess returns where ROIC converges toward WACC as competitive moats erode.
   - Stage 3 (Stable Mature Growth): Constraining long-term growth rate g <= Long-Term Risk-Free Rate / GDP Growth.`
    },
    {
      track_id: track1Id,
      title: "Terminal Value Governance and the EV-to-Equity Value Bridge",
      order_index: 3,
      content: `### Terminal Value Rigor and Equity Value Per Share

1. Terminal Value Mechanics:
   - Gordon Growth Formula: TV = (FCFF_final * (1 + g)) / (WACC - g), where Reinvestment Rate = g / ROIC_terminal.

2. The Full Enterprise Value to Equity Value Bridge:
   - Implied Enterprise Value (PV of Cash Flows + PV of Terminal Value)
   - Less: Total Debt, Preferred Stock, Minority Interest
   - Plus: Cash, Marketable Securities, Non-Operating Assets
   - Equals: Implied Equity Value / Diluted Shares = Implied Target Share Price.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Comparable Public Companies Analysis (Trading Comps)",
      order_index: 1,
      content: `### Trading Multiples and Peer Group Selection

1. Peer Universe Selection:
   - Filtering publicly traded peers across 4 key operational dimensions: Business Model, Industry Vertical, Scale / Revenue Size, and Growth / Margin Profile.

2. Core Trading Multiples:
   - Enterprise Value Multiples: EV/EBITDA and EV/EBIT (capital structure neutral).
   - Equity Multiples: Price-to-Earnings (P/E) and Price-to-Book (P/B).
   - Evaluating 25th percentile, Median, and 75th percentile benchmark valuation multiples.`
    },
    {
      track_id: track2Id,
      title: "Precedent Transactions Analysis and Control Premiums",
      order_index: 2,
      content: `### M&A Transaction Multiples and Control Premiums

1. Precedent Transactions Methodology:
   - Evaluating historical acquisition multiples paid in M&A deals for comparable companies.

2. The Control Premium (20% to 35%):
   - Precedent transaction multiples are systematically higher than public trading comps because acquirers pay a premium for 100% operational control, post-merger cost synergies, and strategic restructuring authority.`
    },
    {
      track_id: track2Id,
      title: "Harmonizing Trailing (TTM) vs Forward (NTM) Multiples",
      order_index: 3,
      content: `### Normalization and Growth-Adjusted Multiples

1. TTM vs NTM Multiples:
   - Trailing Twelve Months (TTM): Historical reported actuals, eliminating accounting non-recurring items.
   - Next Twelve Months (NTM): Forward Wall Street consensus analyst estimates, capturing future growth inflections.

2. Growth-Adjusted Benchmarking:
   - Utilizing PEG ratios and regression curves (EV/EBITDA plotted against Revenue Growth + EBITDA Margin) to adjust for operational outperformance.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Sum-of-the-Parts (SOTP) and Asset-Based Valuation (NAV)",
      order_index: 1,
      content: `### Conglomerate Valuation and Net Asset Value

1. Sum-of-the-Parts (SOTP) Valuation:
   - Valuing diversified multi-segment corporate conglomerates by valuing each distinct division independently using its specific industry peer multiples (e.g. Cloud SaaS division at 10x Revenue + Hardware division at 6x EBITDA), applying a Conglomerate Discount (10-15%).

2. Net Asset Value (NAV):
   - Marking tangible and intangible balance sheet assets to fair market liquidation value.`
    },
    {
      track_id: track3Id,
      title: "Private Company Valuation Discounts: DLOM and DLOC (409A)",
      order_index: 2,
      content: `### Private Company Illiquidity and 409A Appraisals

1. Private Company Valuation Adjustments:
   - Discount for Lack of Marketability (DLOM, 15% to 25%): Haircut reflecting the inability to liquidate private shares rapidly on public exchanges (modeled via Chaffe put options).
   - Discount for Lack of Control (DLOC): DLOC = 1 - (1 / (1 + Control Premium)).

2. IRS Section 409A Valuations:
   - Independent appraisals setting fair market strike prices for private employee stock option grants.`
    },
    {
      track_id: track3Id,
      title: "Synthesizing Valuation Methodologies: The Football Field Chart",
      order_index: 3,
      content: `### The Investment Banking Football Field Presentation

1. The Football Field Valuation Summary:
   - A visual horizontal floating bar chart consolidating valuation ranges across:
     - 1. Discounted Cash Flow (sensitivity matrix range).
     - 2. Public Trading Comps (25th to 75th percentile).
     - 3. Precedent M&A Transactions (25th to 75th percentile).
     - 4. Leveraged Buyout (LBO) Floor.
     - 5. 52-Week High / Low Trading Range.
   - Synthesizes an executive fair value range for M&A negotiations and fairness opinions.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #113.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In corporate valuation theory, what is the foundational principle of 'Intrinsic Valuation' (pioneered by Aswath Damodaran)?",
      options: [
        "The value of an asset is equal to the present value of its expected future cash flows, discounted at a rate that reflects its operational and financial risk profile",
        "The value of a company is determined only by its social media followers",
        "The value is equal to whatever price the highest stock bidder offers",
        "The value is calculated by adding all historical employee salaries"
      ],
      correct_option_index: 0,
      explanation: "Intrinsic valuation determines value based on an asset's fundamental cash-generating capability and risk.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In valuation methodology, what is the primary difference between Free Cash Flow to Firm (FCFF) and Free Cash Flow to Equity (FCFE)?",
      options: [
        "FCFF is in dollars; FCFE is in euros",
        "FCFF is only used for non-profit organizations",
        "FCFF represents cash available to all capital providers (debt and equity) and is discounted at WACC; FCFE represents cash available to equity shareholders after debt service and is discounted at Cost of Equity",
        "There is zero mathematical difference"
      ],
      correct_option_index: 2,
      explanation: "FCFF is unlevered cash flow discounted at WACC; FCFE is levered post-debt cash flow discounted at Cost of Equity.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "Why do Precedent Transactions (M&A comps) typically result in HIGHER valuation multiples than Public Trading Comps for the same company?",
      options: [
        "Because M&A bankers make calculation mistakes",
        "Because acquirers in M&A deals pay a 'Control Premium' (typically 20-35%) to gain 100% operational control and capture post-merger cost and revenue synergies",
        "Because public stock markets are always in a recession",
        "Because M&A transactions are taxed at 0%"
      ],
      correct_option_index: 1,
      explanation: "Precedent transactions reflect the Control Premium paid to acquire 100% operational governance and synergies.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What visual chart format is universally used in investment banking pitchbooks to display overlapping valuation ranges across DCF, Trading Comps, Precedent M&A, and LBO models?",
      options: [
        "A pie chart",
        "A scatter plot",
        "A line graph",
        "A 'Football Field' Valuation Summary Chart (horizontal floating bar ranges)"
      ],
      correct_option_index: 3,
      explanation: "The Football Field chart displays floating horizontal bars comparing valuation ranges across multiple methodologies.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In DCF modeling, what is the fundamental macroeconomic rule regarding the 'Terminal Growth Rate' (g) in perpetuity?",
      options: [
        "The terminal growth rate cannot exceed the long-term risk-free rate / nominal GDP growth rate of the overall economy (typically 2% to 3.5%)",
        "The terminal growth rate must be at least 50% per year",
        "The terminal growth rate must equal the company's historical 5-year growth rate",
        "Terminal growth rate is always set to 0%"
      ],
      correct_option_index: 0,
      explanation: "No company can grow faster than the overall economy in perpetuity; g is constrained to nominal GDP growth.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In corporate valuation, what is 'Sum-of-the-Parts' (SOTP) valuation and when is it the most appropriate methodology?",
      options: [
        "Adding up the cost of office furniture",
        "A method to value startup companies with zero revenue",
        "Counting the number of shares owned by founders",
        "A valuation method for diversified conglomerates where each distinct operating division is valued separately using industry-specific peer multiples, then aggregated (minus a conglomerate discount)"
      ],
      correct_option_index: 3,
      explanation: "SOTP values multi-segment conglomerates by applying appropriate distinct peer multiples to each division independently.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In private company valuation (such as IRC Section 409A appraisals), what is a 'Discount for Lack of Marketability' (DLOM)?",
      options: [
        "A discount for companies with poor marketing campaigns",
        "A percentage valuation haircut (typically 15% to 25%) applied to private equity shares to reflect the inability of investors to liquidate or sell their shares rapidly on a public exchange",
        "A coupon code given to retail shoppers",
        "A tax penalty charged by the IRS"
      ],
      correct_option_index: 1,
      explanation: "DLOM reflects the illiquidity penalty of private shares that cannot be converted to cash immediately on public exchanges.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What is the fundamental operating growth equation linking a company's investment strategy to its long-term growth rate (g)?",
      options: [
        "Growth Rate (g) = Reinvestment Rate * Return on Invested Capital (ROIC)",
        "Growth Rate (g) = Total Revenue / Total Employees",
        "Growth Rate (g) = Net Income * Tax Rate",
        "Growth Rate (g) = Stock Price / Dividend"
      ],
      correct_option_index: 0,
      explanation: "Fundamental growth equation: g = Reinvestment Rate * ROIC (how much is reinvested and how profitably it is deployed).",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In trading comparables, why are 'Forward NTM Multiples' (Next Twelve Months) generally preferred by equity research analysts over 'Historical TTM Multiples' (Trailing Twelve Months)?",
      options: [
        "Forward multiples are easier to calculate",
        "Historical multiples are illegal in financial reports",
        "Forward NTM multiples reflect consensus future earnings expectations, upcoming capacity expansions, and cyclical inflection points, whereas TTM looks backward at sunk history",
        "Forward multiples eliminate all corporate debt"
      ],
      correct_option_index: 2,
      explanation: "Valuation is forward-looking; NTM multiples capture upcoming growth, new product cycles, and operational run-rates.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In private equity valuation, what is the 'Discount for Lack of Control' (DLOC) and how is it derived from the Control Premium?",
      options: [
        "DLOC = Control Premium * 2",
        "DLOC = 50% flat discount",
        "DLOC = Total Debt / Total Assets",
        "DLOC = 1 - (1 / (1 + Control Premium)), reflecting the reduced value of a minority equity stake that lacks voting power to direct company strategy or dividends"
      ],
      correct_option_index: 3,
      explanation: "DLOC mathematically derives from the control premium: DLOC = 1 - [1 / (1 + Control Premium)], discounting minority non-controlling shares.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In a Discounted Cash Flow valuation, if a company has an Implied Enterprise Value of $500M, Cash of $50M, Total Debt of $150M, Preferred Stock of $20M, and 10 million diluted shares outstanding, what is the implied share price?",
      options: [
        "$50.00 per share",
        "$38.00 per share (Equity Value = $500M EV - $150M Debt + $50M Cash - $20M Preferred = $380M; $380M / 10M shares = $38.00)",
        "$40.00 per share",
        "$68.00 per share"
      ],
      correct_option_index: 1,
      explanation: "Equity Value = $500M - $150M + $50M - $20M = $380M. Implied price = $380M / 10M shares = $38.00 per share.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In DCF terminal value modeling, why is setting the Terminal Year Reinvestment Rate equal to 'g / ROIC_terminal' essential to prevent mathematical overvaluation?",
      options: [
        "To make the terminal growth rate equal to zero",
        "To avoid paying corporate income taxes",
        "Because in stable perpetuity, a firm must reinvest a portion of its NOPAT (Reinvestment Rate = g / ROIC) to generate the terminal growth rate (g); assuming 0% reinvestment creates impossible free growth",
        "It is only used for banking institutions"
      ],
      correct_option_index: 2,
      explanation: "Firms cannot grow in perpetuity without capital reinvestment; tying reinvestment to g/ROIC preserves mathematical integrity.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In quantitative option pricing models for DLOM (such as the Chaffe or Finnerty models), how is the marketability discount of private shares modeled?",
      options: [
        "By modeling the cost of a European or Asian Protective Put Option on the stock with a strike price equal to the stock price over the expected private holding period",
        "By flipping a coin",
        "By dividing the company's inventory by its debt",
        "By applying a random 10% discount"
      ],
      correct_option_index: 0,
      explanation: "Chaffe/Finnerty models value illiquidity as the price of a protective put option insuring against price drops during the lockup period.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "What constitutes the 'Conglomerate Discount' in financial markets when analyzing multi-segment companies under Sum-of-the-Parts (SOTP)?",
      options: [
        "A discount given to large retail shoppers",
        "A lower interest rate charged by commercial banks",
        "A tax credit for companies with more than 10 factories",
        "The historical market tendency for multi-division conglomerates to trade at a 10% to 15% discount to the aggregate sum of their individual segment values due to corporate overhead, capital misallocation, and lack of focus"
      ],
      correct_option_index: 3,
      explanation: "The conglomerate discount reflects public market penalties for complexity, governance overhead, and capital misallocation.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "Under IRS Code Section 409A regulations, why must venture-backed private companies obtain independent third-party 409A appraisals annually (or after priced funding rounds)?",
      options: [
        "To register their trademark with the US Patent Office",
        "To establish an independent, legally defensible Fair Market Value (FMV) for common stock strike prices, protecting employees from immediate 20% federal tax penalties on stock option grants",
        "To calculate the CEO's personal income tax",
        "To file for public IPO listing"
      ],
      correct_option_index: 1,
      explanation: "409A appraisals provide a safe-harbor common stock fair market value, preventing severe 20% IRS tax penalties on option grants.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #113.");
  console.log("Skill #113 update completed successfully!");
}

run();
