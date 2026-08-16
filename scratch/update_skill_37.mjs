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

const skillId = "f1357d43-5efb-458b-847f-336b3e01b5c0";

async function run() {
  console.log("Updating Skill #37: Menu & Recipe Costing (9 steps across 3 tracks)...");

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

  // Ensure exactly 3 tracks exist
  while (tracks.length < 3) {
    const { data: newTrack } = await supabase
      .from("tracks")
      .insert({
        skill_id: skillId,
        title: `Track ${tracks.length + 1}: Menu & Recipe Costing`,
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
  await supabase.from("tracks").update({ title: "Track 1: Yield Analysis, As-Purchased vs Edible-Portion Math and Butcher's Tests" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Food Cost Percentages, Contribution Margins and Prime Cost" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Menu Engineering Matrices, Pricing Psychology and Cross-Utilization" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Cornell Hospitality Management level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "As Purchased (AP) vs Edible Portion (EP) Yield Mathematics",
      order_index: 1,
      content: `### Mathematical Principles of Culinary Yield Analysis

Accurate menu costing requires distinguishing between wholesale raw purchase weight and usable cooked ingredient weight:

1. The Core Yield Equations:
\`\`\`
Yield Percentage = (Edible Portion Weight / As Purchased Weight) * 100%
Edible Portion Cost per Unit = As Purchased Cost per Unit / Yield Percentage
\`\`\`

2. Practical Economic Application:
   - Example 1 (High Yield Alliums): Yellow onions purchased at $1.20 per pound have an average peeling/trimming yield of 90% (0.90). The true Edible Portion cost is \`$1.20 / 0.90 = $1.33\` per pound.
   - Example 2 (Low Yield Vegetables): Fresh globe artichokes purchased at $3.20 per pound have an edible heart/stem yield of only 35% (0.35). The true Edible Portion cost is \`$3.20 / 0.35 = $9.14\` per pound.
   - Failing to factor yield percentage causes chefs to undercost vegetable dishes by 10% to 65%.

3. Thermal Shrinkage and Moisture Loss:
   - Roasting prime beef or pork causes 15% to 25% moisture and fat rendering loss. Cooking yield must be multiplied by trimming yield to determine the final cost per served portion.`
    },
    {
      track_id: track1Id,
      title: "Butcher's Yield Test and Fabricated Protein Economics",
      order_index: 2,
      content: `### The Butcher's Yield Test (BYT) and Cost Factor Multipliers

Wholesale meats are purchased as subprimals or whole carcasses requiring internal fabrication:

1. Butcher's Yield Test Execution:
   - Weighing raw subprimal (As Purchased weight).
   - Fabricating into:
     - Usable Center-of-Plate Steaks.
     - Secondary Usable Trimmings (stew meat, sausage grind, burger blend).
     - Usable Bones (beef stock / demi-glace).
     - Unusable Waste (connective sinew, excess fat cap).

2. Trim Credit Value Deduction:
   - Assigning wholesale market value to secondary trim and bones, subtracting total trim credit value from raw purchase cost to isolate the net fabricated cost of prime center-of-plate steaks.

3. The Cost Factor Multiplier (CFM):
\`\`\`
Cost Factor Multiplier = Net Cost per Pound of Usable Meat / Wholesale AP Cost per Pound
\`\`\`
   - When wholesale meat market prices fluctuate, multiplying the new wholesale invoice price by the CFM updates the portion cost instantly without re-running physical butchery tests.`
    },
    {
      track_id: track1Id,
      title: "Standardized Recipe Formulation and Q-Factor Buffers",
      order_index: 3,
      content: `### Standardized Recipe Costing and Unmeasured Cost Buffers

1. Standardized Recipe Architecture:
   - Every production recipe must specify exact gram/ounce weights (eliminating imprecise volumetric cups/spoons), step-by-step prep methods, exact batch yields, portion counts, and extended unit ingredient costs.

2. The Q-Factor (Question Mark Factor / Cover Cost):
   - In restaurant operations, guests consume numerous unmeasured items: bread baskets, butter pats, table olive oil, finishing Maldon sea salt, fry seasonings, salad dressings, and garnish herbs.
   - Itemizing a single pinch of pepper is impractical. SRE-grade accounting applies a Q-Factor:
     - Method A (Direct Fixed Add-On): Adding a flat $0.50 to $0.85 to every entree cost card based on total monthly bread/condiment spend divided by total covers.
     - Method B (Percentage Buffer): Adding a 3% to 5% cost buffer across all recipe totals to absorb invisible kitchen waste and condiment usage.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Food Cost Percentage Math and Menu Pricing Formulas",
      order_index: 1,
      content: `### Food Cost Percentages vs Contribution Margin Economics

1. Food Cost Percentage Calculations:
\`\`\`
Food Cost % = (Portion Food Cost / Menu Selling Price) * 100%
Target Menu Selling Price = Portion Food Cost / Target Food Cost %
\`\`\`
   - Industry Food Cost Targets: Fine dining (28% to 32%), Casual full-service (30% to 34%), High-volume bars and pizzerias (18% to 24%).

2. The Contribution Margin (CM) Fallacy:
   - High food cost percentage does NOT mean lower profit:
     - Dish A (Handmade Cavatelli Pasta): Portion cost $2.40, selling price $16.00. Food cost = 15%. Contribution Margin = \`$16.00 - $2.40 = $13.60\`.
     - Dish B (Dry-Aged Ribeye Steak): Portion cost $18.00, selling price $48.00. Food cost = 37.5%. Contribution Margin = \`$48.00 - $18.00 = $30.00\`.
   - While Dish A has a superior food cost percentage, Dish B contributes more than double the net cash dollars ($30.00 vs $13.60) to pay rent, labor, and profit. Banks deposit dollars, not percentages.`
    },
    {
      track_id: track2Id,
      title: "Prime Cost Management: COGS, Direct Labor and Operating Ratios",
      order_index: 2,
      content: `### Prime Cost: The Golden Ratio of Restaurant Solvency

1. Defining Prime Cost:
\`\`\`
Prime Cost = Cost of Goods Sold (Food + Beverage COGS) + Total Labor Costs (Salaries + Hourly Wages + Payroll Taxes + Benefits)
Prime Cost Ratio = (Prime Cost / Total Gross Revenue) * 100%
\`\`\`

2. Industry Solvency Benchmarks:
   - Healthy Full-Service Restaurant: Prime cost MUST remain strictly between 55% and 60% of gross revenue.
   - Danger Zone: Prime cost exceeding 65% indicates impending cash flow insolvency and failure.

3. Dynamic Labor Controls:
   - Monitoring Covers Per Labor Hour (CPLH) in real time against hourly sales forecasts.
   - Flexing hourly kitchen prep and front-of-house staff early during slow dinner services to maintain labor targets under 30% of sales.`
    },
    {
      track_id: track2Id,
      title: "Inventory Valuation, Variance Analysis and Waste Audits",
      order_index: 3,
      content: `### Inventory Control and Theoretical vs Actual Food Cost Variance

1. Cost of Goods Sold (COGS) Formula:
\`\`\`
COGS = Beginning Inventory + Invoiced Purchases - Ending Physical Inventory
\`\`\`

2. Theoretical vs Actual Variance Analysis:
   - Theoretical Food Cost: The mathematically ideal food cost calculated by multiplying Point of Sale (POS) sales mix data by standardized recipe portion costs.
   - Actual Food Cost: The real-world inventory consumption determined by weekly physical inventory counts.
   - Variance Gap: \`Variance = Actual Cost - Theoretical Cost\`.
   - An unfavorable variance exceeding 1.5% to 2.0% signals critical operational breakdown: over-portioning on the line, untracked kitchen waste, unrecorded spoilage, or employee theft.

3. Systematic Waste Auditing:
   - Mandatory daily waste sheets recording weight, item name, reason for discard (burnt, dropped, expired), and dollar value before items enter trash bins.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "The Kasavana & Smith Menu Engineering Matrix",
      order_index: 1,
      content: `### Algorithmic Menu Engineering and Portfolio Optimization

The Kasavana & Smith Menu Engineering model categorizes menu offerings based on two variables: Profitability (Contribution Margin) and Popularity (Sales Volume vs 70% Hurdle Rate):

1. The Four Menu Item Quadrants:
   - Stars (High Contribution Margin, High Popularity): The cornerstones of restaurant profitability. Strategy: Maintain strict recipe consistency; place in prime visual menu hotspots.
   - Plowhorses (Low Contribution Margin, High Popularity): Customer favorites with poor profit margins. Strategy: Incrementally increase price by $1 to $2; reduce portion size slightly; or reformulate side garnishes to lower portion cost.
   - Puzzles (High Contribution Margin, Low Popularity): Highly profitable dishes that few guests order. Strategy: Reposition on menu; retrain servers to recommend; rewrite menu description with evocative culinary language.
   - Dogs (Low Contribution Margin, Low Popularity): Items that drain labor and waste inventory. Strategy: Eliminate from the menu immediately or replace with a high-margin seasonal alternative.`
    },
    {
      track_id: track3Id,
      title: "Psychological Menu Design and Pricing Architecture",
      order_index: 2,
      content: `### Neuromarketing and Menu Layout Optimization

Menu design exerts subconscious influence on guest spending behavior:

1. Eye-Tracking and The Golden Triangle:
   - On a standard two-fold or tri-fold menu, the human eye naturally scans in a triangle: first looking at the middle of the page, moving to the top-right corner, and finally scanning the top-left.
   - High-margin Stars and Puzzles should be positioned in the top-right hotspot.

2. Eliminating Currency Symbols:
   - Removing dollar signs ($) and trailing dot leaders (\`Steak.......$42.00\`).
   - Printing prices simply as discrete numbers in matching font (\`Prime Strip Steak 42\`) uncouples the decision from financial spending pain, increasing average guest check size by up to 8%.

3. Price Anchoring and Decoy Pricing:
   - Placing a luxury high-priced anchor item (e.g. $125 Seafood Tower or $85 Dry-Aged Porterhouse) at the top of a category. Surrounding $36 to $44 entrees appear modest and reasonable by psychological comparison.`
    },
    {
      track_id: track3Id,
      title: "Dynamic Seasonal Menus, Cross-Utilization and Supply Chain Hedging",
      order_index: 3,
      content: `### Inventory Turnover and Cross-Utilization Strategies

1. Ingredient Cross-Utilization:
   - The Golden Rule of Inventory: High-cost, perishable ingredients must appear in at least two to three distinct menu items across different stations (e.g. Braised short rib used in an entree, a pasta ragu, and a bar appetizer slider).
   - Prevents isolated inventory stagnation and eliminates spoilage of specialized ingredients.

2. Dynamic Seasonal Menu Rotation:
   - Aligning menu changes with agricultural peak harvest cycles when wholesale produce costs drop by 30% to 50% due to regional market abundance.

3. Fixed-Price (Prix Fixe) and Tasting Menu Hedging:
   - Fixed multi-course menus provide 100% predictable inventory purchasing, exact portion forecasting, and near-zero food waste compared to expansive a la carte menus.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #37.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "If raw globe artichokes are purchased at $3.00 per pound with an Edible Portion (EP) yield of only 35% (0.35) after trimming, what is the true Edible Portion cost per pound?",
      options: [
        "$8.57 per pound ($3.00 / 0.35)",
        "$1.05 per pound",
        "$3.00 per pound",
        "$0.35 per pound"
      ],
      correct_option_index: 0,
      explanation: "EP Cost = AP Cost / Yield % = $3.00 / 0.35 = $8.57 per pound of usable edible product.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In the Kasavana & Smith Menu Engineering Matrix, what term describes a menu item that has HIGH profitability (Contribution Margin) and HIGH popularity (Sales Volume)?",
      options: [
        "Plowhorse",
        "Dog",
        "Star",
        "Puzzle"
      ],
      correct_option_index: 2,
      explanation: "Stars are the ideal menu items boasting high profit margins and high customer sales volume.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What is the industry standard benchmark target for 'Prime Cost' (Food & Beverage COGS + Total Labor Costs) as a percentage of gross sales in a profitable full-service restaurant?",
      options: [
        "85% to 90%",
        "55% to 60% of gross revenue",
        "10% to 15%",
        "100%"
      ],
      correct_option_index: 1,
      explanation: "Prime cost must be kept strictly between 55% and 60% of gross sales for a full-service restaurant to remain solvent and profitable.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In restaurant recipe costing, what is the 'Q-Factor' (Question Mark Factor)?",
      options: [
        "The cost of the kitchen stove",
        "The manager's bonus",
        "The price of chef uniforms",
        "A cost buffer added to recipe cards to cover unmeasured guest items like bread baskets, butter, salt, seasonings, and dressings"
      ],
      correct_option_index: 3,
      explanation: "The Q-Factor allocates the cost of unmeasured condiments, bread, and table accompaniments across all entree costing cards.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What is the standard formula for calculating Cost of Goods Sold (COGS) for an accounting period?",
      options: [
        "Beginning Inventory + Invoiced Purchases - Ending Physical Inventory",
        "Total Sales multiplied by 2",
        "Ending Inventory divided by Cash",
        "Labor cost minus Rent"
      ],
      correct_option_index: 0,
      explanation: "COGS = Beginning Inventory + Invoiced Purchases - Ending Inventory, reflecting the exact value of food and beverage consumed.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In menu profitability analysis, why is maximizing Contribution Margin (CM in dollars) mathematically superior to focusing solely on low Food Cost Percentage?",
      options: [
        "Because food cost percentages are illegal to calculate",
        "Because computers cannot calculate percentages",
        "Because banks accept percentages instead of cash",
        "Bank deposits are made in dollars, not percentages: a $48 steak at 37.5% food cost yields $30 in gross profit dollars, whereas a $16 pasta at 15% food cost yields only $13.60"
      ],
      correct_option_index: 3,
      explanation: "Contribution Margin measures real cash dollars generated per plate to cover fixed overhead and profit; high-ticket items with higher food cost percentages often yield higher cash margins.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In the Menu Engineering Matrix, what strategic action should a restaurant manager take for a 'Plowhorse' item (High Popularity, Low Profit Margin)?",
      options: [
        "Delete the item immediately",
        "Incrementally raise the price by $1-$2, reduce portion size slightly, or reformulate sub-ingredients to lower portion cost without hurting popularity",
        "Give it away for free",
        "Hide it from the menu"
      ],
      correct_option_index: 1,
      explanation: "Plowhorses are customer favorites; slight price increases or portion cost reductions directly convert their high sales volume into increased profitability.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What is the 'Cost Factor Multiplier' (CFM) derived from a Butcher's Yield Test, and how does it benefit restaurant kitchen management?",
      options: [
        "The ratio of fabricated net meat cost per pound to wholesale AP cost per pound, allowing portion costs to be updated instantly when market invoice prices change without repeating butchery tests",
        "The temperature of the walk-in freezer",
        "The speed of the dishwasher",
        "The tax rate on imported beef"
      ],
      correct_option_index: 0,
      explanation: "The Cost Factor Multiplier allows chefs to instantly calculate updated portion costs whenever wholesale meat commodity prices fluctuate.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In menu pricing psychology, why does removing currency symbols ($) and trailing dotted lines from menu prices increase average guest spend?",
      options: [
        "It makes guests think the food is free",
        "It saves printer ink",
        "It uncouples the dining decision from subconscious financial spending pain, focusing the guest on culinary descriptions rather than cost comparison",
        "It makes menus look like phone books"
      ],
      correct_option_index: 2,
      explanation: "Omitting dollar signs and dotted lines reduces the psychological friction of paying, leading to higher average check totals.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In inventory control, what does an unfavorable variance between Actual Food Cost and Theoretical (POS) Food Cost exceeding 2.0% indicate?",
      options: [
        "The restaurant is making too much profit",
        "The menu is perfectly designed",
        "Guests are eating too much food",
        "Critical operational breakdown such as over-portioning on the cooking line, unrecorded food waste/spoilage, or employee theft"
      ],
      correct_option_index: 3,
      explanation: "A gap between theoretical and actual food costs highlights real operational leakage: excessive waste, over-portioning, spoilage, or shrinkage.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In menu engineering, what is a 'Puzzle' (High Contribution Margin, Low Popularity), and what is the best strategy to increase its revenue contribution?",
      options: [
        "A dish that contains crossword puzzles",
        "A highly profitable dish that few guests order; strategy: reposition to the Golden Triangle hotspot, rename with evocative sensory descriptions, or incentivize servers to recommend it",
        "A dish that is impossible to cook",
        "A dish that has zero ingredients"
      ],
      correct_option_index: 1,
      explanation: "Puzzles are high-profit items needing visibility and sales momentum; repositioning and server promotion can transform them into Stars.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In neuromarketing menu design, what is 'Price Anchoring' and how does it influence diner ordering patterns?",
      options: [
        "Tying menus to the table with ropes",
        "Setting all prices to $9.99",
        "Placing an ultra-premium high-priced item (e.g. $125 Seafood Plateau) at the top of a category, making surrounding $38-$45 entrees appear modest and affordable by comparison",
        "Charging customers for water"
      ],
      correct_option_index: 2,
      explanation: "Price anchoring establishes a high reference point, causing subsequent moderately high prices to seem reasonable and attractive by contrast.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In culinary inventory management, why is 'Cross-Utilization of Ingredients' a foundational principle of kitchen profitability?",
      options: [
        "Requiring expensive, perishable ingredients to appear across at least two to three distinct menu dishes prevents inventory stagnation, accelerates turnover, and eliminates food spoilage",
        "It forces cooks to use only one knife",
        "It allows restaurants to buy ingredients once a year",
        "It reduces the size of the kitchen"
      ],
      correct_option_index: 0,
      explanation: "Cross-utilization ensures high-cost perishables are consumed rapidly across multiple stations, preventing single-dish ingredients from spoiling in storage.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Butcher's Yield Testing, how is the Net Fabricated Cost per pound of usable prime steak calculated when trimming yields secondary stew meat and stock bones?",
      options: [
        "By ignoring the trim and dividing the total invoice cost by the weight of the whole carcass",
        "By multiplying the price by two",
        "By throwing away the bones",
        "By subtracting the wholesale market credit value of the secondary stew meat and stock bones from the initial wholesale purchase price, then dividing by the net usable steak weight"
      ],
      correct_option_index: 3,
      explanation: "Deducting the monetary value of usable secondary trim and bones from the total carcass cost isolates the exact net cost of the prime cuts.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In eye-tracking menu research, where is 'The Golden Triangle' located on a standard tri-fold or two-fold menu canvas?",
      options: [
        "At the bottom-left corner of the back page",
        "The eye looks first at the middle of the page, moves to the top-right corner (the primary hotspot), and then scans across to the top-left corner",
        "Around the restaurant logo",
        "In the footer copyright text"
      ],
      correct_option_index: 1,
      explanation: "Eye-tracking studies demonstrate that readers look first at the page center, then top-right, and then top-left, making top-right prime real estate for high-profit Stars.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #37.");
  console.log("Skill #37 update completed successfully!");
}

run();
