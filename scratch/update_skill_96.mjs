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

const skillId = "67aec141-8c02-47ed-9238-a41b36fc918d";

async function run() {
  console.log("Updating Skill #96: Basic Fundraising Concepts (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Capital Typologies, SAFEs and Early-Stage Equity Mechanics" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: The Venture Fundraising Process, Pitch Decks and Data Rooms" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Term Sheet Governance, Investor Rights and Alternative Financing" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / VC General Partner & Stanford GSB Entrepreneurial Finance level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Capital Sources: Bootstrapping vs Angels vs Venture Capital",
      order_index: 1,
      content: `### Capital Spectrum and Incentive Alignment

1. Funding Sources:
   - Bootstrapping: Retaining 100% equity ownership, funding growth entirely from customer operating profits; perfect for sustainable cash-flow businesses.
   - Angel Investors: High-net-worth individuals deploying $10k to $100k personal checks in pre-seed rounds.
   - Institutional Venture Capital (VC): Investment funds managing institutional capital (endowments, pension funds) requiring massive 10x to 100x return multiples driven by the Power Law.`
    },
    {
      track_id: track1Id,
      title: "YC Post-Money SAFEs and Convertible Notes",
      order_index: 2,
      content: `### Convertible Early-Stage Financing Instruments

1. Y Combinator Post-Money SAFE:
   - Grants investors the right to receive preferred equity in a future priced round without interest or maturity debt deadlines.

2. Post-Money SAFE Ownership Formula:
   - SAFE Investor Ownership % = Investment Amount / Post-Money Valuation Cap.
   - Valuation Cap: Sets the maximum effective valuation at which the SAFE converts into equity.
   - Discount Rate (typically 15% to 20%): Applied if the priced round valuation is below the cap.`
    },
    {
      track_id: track1Id,
      title: "Priced Rounds: Pre-Money vs Post-Money Valuations and Dilution",
      order_index: 3,
      content: `### Equity Dilution Mathematics and Option Pools

1. Core Valuation Equations:
   - Post-Money Valuation = Pre-Money Valuation + New Investment Capital.
   - Investor Ownership % = Investment Capital / Post-Money Valuation.

2. The Option Pool Shuffle:
   - Investors typically require a new 10% to 15% unallocated Employee Stock Option Pool (ESOP) created entirely within the Pre-Money valuation, which dilutes only existing founders rather than the new investor.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The 10-Slide Institutional Venture Pitch Deck",
      order_index: 1,
      content: `### Pitch Deck Architecture and Narrative Structure

1. The Standard 10-Slide Venture Pitch Framework:
   - 1. Problem: Acute, painful customer bottleneck.
   - 2. Solution: Unique value proposition and product insight.
   - 3. Why Now: Regulatory, behavioral, or technical tailwinds.
   - 4. Market Sizing: Bottom-Up TAM / SAM / SOM analysis.
   - 5. Product: Visual screenshots and core workflow.
   - 6. Traction: Monthly revenue growth, retention curves, and MoM velocity.
   - 7. Business Model: Unit economics (CAC, LTV, Gross Margins).
   - 8. Competition: Unfair defensible moats.
   - 9. Team: Unique founder domain expertise.
   - 10. The Ask: Capital required and 18-month execution milestones.`
    },
    {
      track_id: track2Id,
      title: "VC Fund Economics and the Power Law Distribution",
      order_index: 2,
      content: `### Venture Fund Economics and Return Profiles

1. The 2/20 Fund Structure:
   - Venture firms charge a 2% annual management fee plus 20% carried interest (carry) on net profits paid to General Partners (GPs) by Limited Partners (LPs).

2. The Venture Power Law:
   - Out of 30 investments, ~15 fail completely, ~10 generate modest returns, and 1 or 2 mega-winners generate 90%+ of total fund profits. Every individual investment must theoretically possess the potential to return the entire fund.`
    },
    {
      track_id: track2Id,
      title: "Virtual Data Rooms (VDR) and Due Diligence Protocols",
      order_index: 3,
      content: `### Institutional Due Diligence and Data Room Structure

1. Virtual Data Room (VDR) Repository Structure:
   - Corporate Governance: Delaware Certificate of Incorporation, bylaws, board consent resolutions.
   - Cap Table: Fully diluted ownership ledger (Carta/Pulley).
   - Financials: Historical P&L, balance sheets, and forward-looking 3-statement models.
   - Legal & IP: Signed PIIAAs for all contributors, registered trademarks, and patents.
   - Material Contracts: Top enterprise customer MSAs and vendor agreements.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Key Term Sheet Economic and Control Provisions",
      order_index: 1,
      content: `### Term Sheet Anatomy and Preferred Rights

1. Core Term Sheet Clauses:
   - Liquidation Preference: 1x Non-Participating Preferred Stock is the venture standard (investors get their 1x capital back OR convert to common stock, whichever yields higher payout).
   - Board of Directors Structure: Standard Series A board of 2 Founder seats and 1 Investor seat.
   - Pro-Rata Rights: Legal right to invest in future equity rounds to prevent dilution.`
    },
    {
      track_id: track3Id,
      title: "Founder-Friendly Governance vs Toxic Clauses",
      order_index: 2,
      content: `### Governance Protections and Down-Round Safeguards

1. Anti-Dilution Protection Types:
   - Broad-Based Weighted Average: Standard founder-friendly anti-dilution formula adjusting conversion prices proportionally during a down round.
   - Full Ratchet: Toxic clause repricing previous shares fully down to the lowest new share price, triggering severe founder dilution.

2. Protective Provisions:
   - Veto rights over major events (mergers, company sale, taking on debt).`
    },
    {
      track_id: track3Id,
      title: "Alternative Non-Dilutive Financing: Debt and RBF",
      order_index: 3,
      content: `### Non-Dilutive Capital Strategies

1. Venture Debt:
   - Term loans combined with small equity warrants (1% to 3%) used post-Series A to extend cash runway without surrendering significant equity ownership.

2. Revenue-Based Financing (RBF) (Pipe, Capchase):
   - Selling a portion of predictable monthly recurring revenue (MRR) for immediate upfront capital with zero equity dilution or personal guarantees.

3. Non-Dilutive Government Grants:
   - SBIR/STTR research grants and R&D tax credit offsets.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #96.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In startup equity financing, what is the formula to calculate Post-Money Valuation?",
      options: [
        "Post-Money Valuation = Pre-Money Valuation + New Investment Amount",
        "Post-Money Valuation = Revenue * Tax Rate",
        "Post-Money Valuation = Cash Balance / Total Employees",
        "Post-Money Valuation = Pre-Money Valuation - Debt"
      ],
      correct_option_index: 0,
      explanation: "Post-Money Valuation is the sum of the agreed pre-money valuation plus the fresh investment capital injected into the company.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In startup fundraising terminology, what does 'SAFE' stand for?",
      options: [
        "Standard Asset Financial Evaluation",
        "Security Audit For Employees",
        "Simple Agreement for Future Equity",
        "Stock Allocation and Founders Equity"
      ],
      correct_option_index: 2,
      explanation: "SAFE (Simple Agreement for Future Equity) was pioneered by Y Combinator as a fast, flexible convertible investment instrument.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In Y Combinator Post-Money SAFEs, how is an investor's exact ownership percentage calculated upon conversion?",
      options: [
        "Ownership % = Number of founders / 100",
        "Ownership % = SAFE Investment Amount / Post-Money Valuation Cap",
        "Ownership % = Company Revenue / Investment",
        "Ownership % = Total Employees * 5%"
      ],
      correct_option_index: 1,
      explanation: "Post-Money SAFEs provide immediate clarity: ownership equals the check size divided by the post-money cap.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What is the standard venture capital industry benchmark for 'Liquidation Preference' in Series Seed and Series A term sheets?",
      options: [
        "10x Participating Preferred",
        "Zero liquidation preference",
        "100% company takeover",
        "1x Non-Participating Preferred Stock (investors receive their 1x capital back or convert to common stock)"
      ],
      correct_option_index: 3,
      explanation: "1x Non-Participating Preferred is the clean venture standard, returning capital or sharing upside as common stock.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What is 'Venture Debt' in startup financing?",
      options: [
        "A specialized loan paired with small equity warrants (1% to 3%) provided to venture-backed startups to extend cash runway without major equity dilution",
        "Personal credit card debt",
        "Money borrowed from family members",
        "A government fine"
      ],
      correct_option_index: 0,
      explanation: "Venture debt provides non-dilutive debt financing to extend cash runway between priced venture equity rounds.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In venture capital economics, what is 'The Power Law' distribution and how does it dictate partner investment decisions?",
      options: [
        "All 30 portfolio companies generate identical 10% returns",
        "VC funds invest only in power and electric utilities",
        "VCs are required by law to invest in 100 companies per year",
        "A tiny fraction of outlier investments (1 or 2 mega-winners out of 30) generate over 90% of the entire fund's financial returns, requiring every investment to have fund-returning potential"
      ],
      correct_option_index: 3,
      explanation: "Because power law dynamics govern venture returns, VCs must only invest in companies with potential to return their entire fund.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In priced venture rounds, what is 'The Option Pool Shuffle'?",
      options: [
        "A party game played by venture capitalists",
        "Investors requiring a new 10% to 15% unallocated employee option pool created entirely within the Pre-Money valuation, diluting existing founders rather than incoming investors",
        "Cancelling all employee stock options",
        "Selling stock options to the public"
      ],
      correct_option_index: 1,
      explanation: "Creating option pools in the pre-money valuation forces founders to absorb all dilution before the new investor's cash enters.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In term sheet negotiations, why is 'Broad-Based Weighted Average' anti-dilution preferred by founders over 'Full Ratchet' anti-dilution?",
      options: [
        "Weighted average adjusts the conversion price proportionally based on the actual capital raised in a down round, whereas Full Ratchet punitively reprices all past shares to the lowest new price, causing massive founder dilution",
        "Weighted average eliminates all legal fees",
        "Full ratchet gives founders free stock",
        "There is zero mathematical difference"
      ],
      correct_option_index: 0,
      explanation: "Full ratchet is a toxic penalty clause; broad-based weighted average is the fair market standard for down-round protection.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In venture fund structure, what does '2/20' represent?",
      options: [
        "2 founders and 20 employees",
        "2 meetings every 20 days",
        "A 2% annual management fee charged on committed capital plus 20% carried interest (profit share) paid to General Partners",
        "Investing 2 dollars for 20 shares"
      ],
      correct_option_index: 2,
      explanation: "2/20 is the standard VC fund structure: 2% annual operating fee and 20% share of net capital gains.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In alternative financing, how does 'Revenue-Based Financing' (RBF) work for SaaS startups?",
      options: [
        "The government purchases company shares",
        "The startup sells physical assets to pay debt",
        "Founders take out personal mortgages",
        "The startup receives upfront non-dilutive capital in exchange for paying a fixed percentage of ongoing monthly recurring revenue until a set multiple (e.g. 1.1x to 1.3x) is repaid"
      ],
      correct_option_index: 3,
      explanation: "RBF converts predictable recurring revenue into upfront cash without surrendering board seats or equity ownership.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "If a startup raises $2,000,000 on an $8,000,000 Pre-Money Valuation, what is the Post-Money Valuation and the new investor's exact ownership percentage?",
      options: [
        "Post-Money is $8M; Ownership is 25%",
        "Post-Money is $10,000,000; Ownership is 20% ($2M / $10M)",
        "Post-Money is $16M; Ownership is 12.5%",
        "Post-Money is $6M; Ownership is 33.3%"
      ],
      correct_option_index: 1,
      explanation: "Post-Money = $8M Pre + $2M Investment = $10M. Investor Ownership = $2M / $10M = 20%.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In venture capital due diligence, what critical document in the Virtual Data Room (VDR) proves that all software source code is legally owned by the company?",
      options: [
        "The office lease agreement",
        "The founder's college diploma",
        "Signed Proprietary Information and Inventions Assignment Agreements (PIIAAs) from every current and past employee, founder, and contractor",
        "A screenshot of GitHub commits"
      ],
      correct_option_index: 2,
      explanation: "Without executed PIIAAs from every developer, IP ownership is clouded, preventing venture investment or acquisition.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In term sheets, what is the purpose of 'Pro-Rata Rights' (Pre-emptive Rights)?",
      options: [
        "They grant existing investors the legal right to participate in future funding rounds to maintain their exact proportional ownership percentage against future dilution",
        "They require the company to pay annual dividends",
        "They allow investors to fire the CEO at any time",
        "They set the product retail price"
      ],
      correct_option_index: 0,
      explanation: "Pro-rata rights protect investors from being diluted in subsequent venture financing rounds.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "Why is 'Participating Preferred Stock' (with liquidation preference) considered toxic to founders compared to standard Non-Participating Preferred Stock?",
      options: [
        "It prevents the company from hiring employees",
        "It forces the company into bankruptcy immediately",
        "It is banned by the Federal Trade Commission",
        "It enables investors to 'double dip' by taking their full initial investment back first AND then sharing pro-rata in the remaining proceeds as common stock"
      ],
      correct_option_index: 3,
      explanation: "Participating preferred takes capital out first and shares in the remaining payout, severely depressing founder exit payouts.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In pitch deck narrative construction, what is the strategic purpose of the 'Why Now?' slide?",
      options: [
        "To explain why the meeting is happening today",
        "To articulate the specific market catalysts (new regulations, breakthrough technologies, or massive behavioral shifts) that make this venture viable today when it previously failed",
        "To show the company calendar",
        "To list the founder's daily schedule"
      ],
      correct_option_index: 1,
      explanation: "The 'Why Now' slide explains the market timing inflection that creates a unique window of opportunity.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #96.");
  console.log("Skill #96 update completed successfully!");
}

run();
