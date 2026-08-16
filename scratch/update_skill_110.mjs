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

const skillId = "19860581-097c-4630-8ee9-f0e444ee6e52";

async function run() {
  console.log("Updating Skill #110: Budgeting & Forecasting (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Corporate Budgeting Methodologies and Master Budget Architecture" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Driver-Based Planning, Rolling Forecasts and Predictive Modeling" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Variance Analysis, Flexible Budgets and FP&A Governance" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / VP of FP&A & Corporate Planning Director level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Traditional Incremental vs Zero-Based Budgeting (ZBB)",
      order_index: 1,
      content: `### Strategic Budgeting Paradigms

1. Incremental Budgeting:
   - Adjusts prior-year actual figures by an arbitrary percentage or inflation rate (risks institutionalizing historical waste and encouraging budget hoarding).

2. Zero-Based Budgeting (ZBB):
   - Reconstructs every departmental budget from a clean sheet ($0 base) each fiscal cycle.
   - Managers must justify every operational dollar through ranked Decision Packages evaluated on clear ROI and strategic alignment.`
    },
    {
      track_id: track1Id,
      title: "Top-Down vs Bottom-Up Planning and Master Budget Assembly",
      order_index: 2,
      content: `### Master Budget Hierarchy and Assembly Sequencing

1. Planning Approaches:
   - Top-Down: Executive leadership sets macro revenue and EBITDA margin targets.
   - Bottom-Up: Departmental cost centers submit granular operational expense plans.

2. Master Budget Sequencing:
   - Sales Forecast -> Production Capacity Budget -> Direct Materials/Labor/Overhead -> Operating Expenses (SG&A, R&D) -> Capital Expenditures (CapEx) Budget -> Master Cash Budget.`
    },
    {
      track_id: track1Id,
      title: "Activity-Based Budgeting (ABB) and Cost Pool Allocation",
      order_index: 3,
      content: `### Operational Cost Drivers and Activity Pools

1. Activity-Based Budgeting (ABB):
   - Derives financial resource requirements by analyzing the specific activities that drive operational costs (e.g. customer service tickets resolved, machine setup hours, purchase orders processed) rather than arbitrary departmental buckets.
   - Eliminates distorted cross-subsidies across complex product lines.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The Static Budget Fallacy and 12-to-18 Month Rolling Forecasts",
      order_index: 1,
      content: `### Dynamic Forecasting and Horizon Planning

1. The Static Budget Fallacy:
   - Annual static budgets become obsolete within months of macroeconomic or competitive shifts.

2. Rolling Financial Forecasts (RRF):
   - Maintains a continuous 12-to-18-month forward horizon updated quarterly.
   - As one quarter ends, a new forward quarter is added, allowing dynamic capital redeployment based on real-time market signals.`
    },
    {
      track_id: track2Id,
      title: "Driver-Based Financial Modeling and Headcount Planning",
      order_index: 2,
      content: `### Operational Modeling Logic and Personnel Costs

1. Driver-Based Modeling:
   - Linking financial outputs directly to mathematical operational drivers (e.g. Sales = Pipeline Opportunities * Win Rate * Average Contract Value; Support Costs = Active Users * Ticket Rate * Cost per Ticket).

2. Headcount Rosters:
   - Modeling personnel costs employee-by-employee: Base Salary + Payroll Taxes (8-10%) + Health Benefits + Equity Compensation + Start Date Timing.`
    },
    {
      track_id: track2Id,
      title: "Statistical Forecasting, Trendlines and Seasonality Analysis",
      order_index: 3,
      content: `### Quantitative FP&A Analytics and Smoothing

1. Statistical Algorithms:
   - Linear Regression Trendlines and Exponential Smoothing models weighting recent actuals.

2. Seasonal Index Decomposition:
   - Deconstructing historical time series into Base Trend, Seasonal Variations (e.g. retail Q4 holiday spikes), Cyclical Economic Waves, and Irregular Noise to enhance projection accuracy.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Budget vs Actual (BvA) and Static vs Flexible Budgets",
      order_index: 1,
      content: `### Variance Decomposition and Flexible Adjustments

1. Static vs Flexible Budgets:
   - Static Budget: Fixed plan based on expected sales volume.
   - Flexible Budget: Recalculates expected revenues and variable expenses based on actual volume achieved (Actual Units Sold * Standard Price/Cost).

2. Variance Breakdown:
   - Volume Variance (sales volume deviation) vs Flexible Budget Variance (spending, rate, and efficiency differences).`
    },
    {
      track_id: track3Id,
      title: "2-Way and 3-Way Variance Decomposition (Price vs Volume)",
      order_index: 2,
      content: `### Mathematical Price and Quantity Variance Equations

1. Direct Cost Variance Formulas:
   - Price / Rate Variance = (Actual Price - Standard Price) * Actual Quantity.
   - Efficiency / Quantity Variance = (Actual Quantity - Standard Quantity) * Standard Price.

2. Executive Bridge (Waterfall) Charts:
   - Visualizing how individual volume, pricing, product mix, and cost variances bridge initial budget targets to actual delivered Net Income.`
    },
    {
      track_id: track3Id,
      title: "Scenario Planning, Sensitivity Modeling and FP&A Platforms",
      order_index: 3,
      content: `### Strategic Stress Testing and Cloud FP&A Software

1. Scenario Modeling:
   - Base Case (expected), Bull Case (accelerated growth), and Bear Case (downside recessionary shock testing cash runway).

2. Enterprise FP&A Cloud Software (Anaplan, Adaptive Planning, Pigment, Planful):
   - Ingesting live ERP general ledger data, providing real-time multi-dimensional scenario modeling, sensitivity tables, and automated executive dashboards.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #110.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In corporate financial planning, what is the core methodology of 'Zero-Based Budgeting' (ZBB)?",
      options: [
        "Setting all employee salaries to zero",
        "Rebuilding every department's budget from a clean sheet ($0 base) each fiscal cycle, requiring all expenses to be justified by ROI rather than using historical spending",
        "Spending zero money on advertising",
        "Refusing to pay income taxes"
      ],
      correct_option_index: 1,
      explanation: "ZBB begins at a zero base each period, requiring managers to justify all proposed expenses via structured decision packages.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In corporate budgeting sequence, which schedule must be completed FIRST because all other production and expense schedules depend on it?",
      options: [
        "The Cash Budget",
        "The Direct Materials Budget",
        "The SG&A Budget",
        "The Sales Forecast / Revenue Budget"
      ],
      correct_option_index: 3,
      explanation: "The sales forecast is the starting foundation of the master budget; production, inventory, labor, and cash flows derive from expected sales.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In FP&A variance analysis, what is a 'Flexible Budget'?",
      options: [
        "A budget that recalculates expected revenues and variable expenses using original standard rates applied to the ACTUAL volume of units sold",
        "A budget with zero spending limits",
        "A budget that changes every day based on stock prices",
        "A budget drafted on flexible rubber paper"
      ],
      correct_option_index: 0,
      explanation: "A flexible budget adjusts budgeted costs to the actual activity level achieved, isolating true spending efficiency from sales volume changes.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In modern financial planning, what is a 'Rolling Forecast' (RRF)?",
      options: [
        "A forecast of tire manufacturing",
        "A weather forecast for outdoor events",
        "A continuous planning model that maintains a fixed 12-to-18 month forward horizon by adding a new future quarter as each current quarter ends",
        "A forecast that only looks backward at historical data"
      ],
      correct_option_index: 2,
      explanation: "Rolling forecasts maintain a forward-looking 12-18 month horizon, updating quarterly to ensure dynamic operational agility.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In corporate budgeting, what is 'Driver-Based Planning'?",
      options: [
        "A budget for company delivery trucks",
        "Modeling financial statement outputs directly from fundamental operational volume drivers (e.g. website traffic, pipeline conversion rates, and employee headcount)",
        "Allowing truck drivers to manage corporate finances",
        "Setting budgets based on executive stock options"
      ],
      correct_option_index: 1,
      explanation: "Driver-based planning mathematically connects financial line items to operational activities (e.g. headcount, units, conversion rates).",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In standard cost variance analysis, what is the mathematical formula used to calculate a 'Direct Labor Rate (Price) Variance'?",
      options: [
        "Rate Variance = Total Sales - Total Costs",
        "Rate Variance = Actual Hours * Standard Rate",
        "Rate Variance = (Actual Hourly Rate - Standard Hourly Rate) * Actual Hours Worked",
        "Rate Variance = (Actual Hours - Standard Hours) * Standard Rate"
      ],
      correct_option_index: 2,
      explanation: "Labor Rate Variance isolates the wage rate difference: (Actual Rate - Standard Rate) * Actual Hours.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "A company budgeted for $100,000 in sales at 1,000 units ($100/unit). Actual results were 1,200 units sold at $95/unit ($114,000 revenue). What was the 'Sales Volume Variance'?",
      options: [
        "$20,000 Favorable (calculated as: (1,200 actual units - 1,000 budgeted units) * $100 standard price)",
        "$14,000 Unfavorable",
        "$6,000 Favorable",
        "$5,000 Unfavorable"
      ],
      correct_option_index: 0,
      explanation: "Sales Volume Variance = (Actual Units 1,200 - Budget Units 1,000) * Standard Price $100 = +200 * $100 = $20,000 Favorable.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In strategic FP&A modeling, what is the core purpose of running 'Scenario Analysis' across Base Case, Bull Case, and Bear Case models?",
      options: [
        "To predict animal population growth",
        "To satisfy internal audit checklists without making business decisions",
        "To guarantee that the company never loses money",
        "To stress-test company cash runway, liquidity, and covenant compliance under varying economic conditions and evaluate strategic contingency triggers"
      ],
      correct_option_index: 3,
      explanation: "Scenario planning evaluates financial performance across distinct futures, testing downside liquidity resilience and upside capacity.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In Activity-Based Budgeting (ABB), how are indirect manufacturing overhead costs allocated to products?",
      options: [
        "Dividing total overhead equally among all employees",
        "Allocating costs based on the consumption of specific cost-driver activities (e.g. number of machine setups, inspection hours, purchase orders) by each product line",
        "Guessing based on product retail price",
        "Assigning 100% of overhead to the lowest-selling product"
      ],
      correct_option_index: 1,
      explanation: "ABB allocates overhead using causal cost drivers (setups, inspections, run-time) reflecting actual resource consumption.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In FP&A visual reporting, what is the primary function of an 'Executive Bridge (Waterfall) Chart'?",
      options: [
        "Showing pictures of bridges built by the company",
        "Tracking employee vacation days",
        "Displaying the step-by-step positive and negative variance drivers (volume, pricing, mix, OPEX) that bridge Budgeted Net Income to Actual Net Income",
        "Listing stock prices over 50 years"
      ],
      correct_option_index: 2,
      explanation: "Bridge/waterfall charts visually isolate individual variance contributors that explain the gap between budget and actual performance.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In manufacturing variance analysis, if a plant uses 5,500 pounds of raw material (standard price $4/lb) to produce units that should have required only 5,000 pounds, what is the 'Direct Materials Efficiency (Quantity) Variance'?",
      options: [
        "$2,000 Unfavorable (calculated as: (5,500 actual lbs - 5,000 standard lbs) * $4 standard price)",
        "$2,000 Favorable",
        "$500 Unfavorable",
        "$22,000 Unfavorable"
      ],
      correct_option_index: 0,
      explanation: "Quantity Variance = (Actual Quantity 5,500 - Standard Quantity 5,000) * Standard Price $4 = +500 * $4 = $2,000 Unfavorable.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In time-series revenue forecasting, what is 'Seasonal Index Decomposition' and why is it superior to simple linear regression?",
      options: [
        "It predicts revenue based on outdoor temperature",
        "It eliminates all company expenses during winter",
        "It only works for agricultural businesses",
        "It isolates the underlying secular growth trend from recurring quarterly cyclical fluctuations and irregular noise, preventing seasonality from distorting underlying run-rate trajectory"
      ],
      correct_option_index: 3,
      explanation: "Seasonal decomposition separates secular trend from recurring cyclical quarterly swings (e.g. Q4 retail surges), yielding accurate baselines.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In corporate personnel budgeting, what is 'Fully Loaded Headcount Cost' and how is it modeled across salary tiers?",
      options: [
        "Only the gross hourly wage paid to the employee",
        "Base Salary PLUS employer payroll taxes (FICA/unemployment ~8-10%), health insurance premiums, 401(k) matching, performance bonus accruals, equity SBC, and workspace/equipment overhead",
        "The cost of the employee's lunch",
        "The salary of the employee's manager"
      ],
      correct_option_index: 1,
      explanation: "Fully loaded headcount encompasses base compensation plus mandatory employer taxes, benefits, bonuses, equity, and equipment overhead.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In enterprise cloud planning software (like Anaplan or Adaptive Planning), what is 'Multi-Dimensional Modeling'?",
      options: [
        "Creating 3D holographic presentations",
        "Playing virtual reality video games",
        "Structuring data cubes across multiple dynamic dimensions (e.g. Time, Account, Department, Geography, Product, Version) to model complex driver relationships without rigid spreadsheet constraints",
        "Designing architectural blueprints"
      ],
      correct_option_index: 2,
      explanation: "Multi-dimensional modeling uses OLAP data cubes to calculate financial statements across intersecting dimensions (time, entity, product, version).",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "Why does relying exclusively on 'Incremental Budgeting' create severe organizational pathology known as 'Budget Hoarding' or the 'Use-It-or-Lose-It' mentality?",
      options: [
        "Department managers intentionally spend their entire remaining budget near year-end on low-value items to prevent executive management from cutting their baseline allocation in the subsequent year's budget",
        "Managers hide money in secret bank accounts",
        "It causes software crashes in ERP systems",
        "It violates IRS federal tax laws"
      ],
      correct_option_index: 0,
      explanation: "Incremental budgeting penalizes cost savings by cutting future budgets, driving wasteful year-end spending to preserve baseline funding.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #110.");
  console.log("Skill #110 update completed successfully!");
}

run();
