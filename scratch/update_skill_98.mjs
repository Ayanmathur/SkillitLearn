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

const skillId = "dc8ab688-4904-4f5e-ab62-c0475466f596";

async function run() {
  console.log("Updating Skill #98: Carbon Footprint Measurement (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: GHG Protocol Standards, Organizational Boundaries and Scope 1 & 2 Accounting" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Scope 3 Value Chain Emissions Across 15 Standardized Categories" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Carbon Accounting Software, Life Cycle Assessment (LCA) and Audit Assurance" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Lead Carbon Auditor & GHG Protocol Specialist level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The GHG Protocol Architecture and Organizational Boundaries",
      order_index: 1,
      content: `### Greenhouse Gas Standards and Boundary Consolidation

1. The GHG Protocol Corporate Standard:
   - Covers 7 Kyoto greenhouse gases (CO2, CH4, N2O, HFCs, PFCs, SF6, NF3) measured in metric tons of carbon dioxide equivalent (tCO2e).

2. Organizational Boundary Approaches:
   - Operational Control Approach: Accounting for 100% of emissions from operations where the company has full authority to introduce operating policies (the standard corporate tech methodology).
   - Financial Control Approach: Accounting based on financial direction of policies.
   - Equity Share Approach: Accounting based on economic interest percentage.`
    },
    {
      track_id: track1Id,
      title: "Scope 1 Direct Emissions: Combustion and Fugitive Sources",
      order_index: 2,
      content: `### Direct Combustion and Refrigerant Leakage Accounting

1. Scope 1 Direct Emission Sources:
   - Stationary Combustion: Boilers, furnaces, and emergency diesel generators.
   - Mobile Combustion: Company-owned fleet vehicles, trucks, and aircraft.
   - Process Emissions: Physical or chemical manufacturing transformations (e.g. chemical cracking).
   - Fugitive Emissions: Refrigerant leaks (HFCs/PFCs) from building air conditioning, heat pumps, and industrial chillers using screening mass balance calculations.`
    },
    {
      track_id: track1Id,
      title: "Scope 2 Dual-Reporting: Location-Based vs Market-Based Accounting",
      order_index: 3,
      content: `### Purchased Energy and Dual-Reporting Standards

1. Scope 2 Dual-Reporting Mandate:
   - Location-Based Method: Reflects the average emissions intensity of the regional electrical grid where consumption occurs (using EPA eGRID subregional factors or national IEA factors).
   - Market-Based Method: Reflects emissions from specific contractual energy instruments purchased by the company (Power Purchase Agreements PPAs, Energy Attribute Certificates EACs/RECs, Guarantees of Origin GOs).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Scope 3 Upstream Categories (Categories 1 through 8)",
      order_index: 1,
      content: `### Value Chain Supply Chain Accounting

1. Scope 3 Upstream Categories (GHG Protocol):
   - Category 1 (Purchased Goods and Services): Raw material extraction and production (calculated via spend-based EEIO transitioning to supplier activity data).
   - Category 2 (Capital Goods): Amortized equipment and machinery.
   - Category 3 (Fuel-and-Energy Related Activities FERA): Well-to-tank transmission losses.
   - Category 4 (Upstream Freight), Category 5 (Waste in Operations), Category 6 (Business Travel air/rail/hotels), Category 7 (Employee Commuting and Remote Work), Category 8 (Upstream Leased Assets).`
    },
    {
      track_id: track2Id,
      title: "Scope 3 Downstream Categories (Categories 9 through 15)",
      order_index: 2,
      content: `### Product Use, End-of-Life and Financed Emissions

1. Scope 3 Downstream Categories:
   - Category 9 (Downstream Logistics) and Category 10 (Processing of Sold Products).
   - Category 11 (Use Phase of Sold Products): Direct/indirect electricity consumed by hardware and appliances over operational lifespans.
   - Category 12 (End-of-Life Treatment): Landfill and recycling emissions.
   - Category 15 (Investments): Financed emissions calculated using PCAF (Partnership for Carbon Accounting Financials) standards for banking institutions.`
    },
    {
      track_id: track2Id,
      title: "Activity Data, Emission Factor Databases and Calculation Formulas",
      order_index: 3,
      content: `### Carbon Accounting Equations and Factor Hierarchies

1. The Foundational GHG Equation:
   - Emissions (tCO2e) = Activity Data (kWh, liters, miles, dollars spent) * Emission Factor (kg CO2e per unit) * GWP / 1,000.

2. Emission Factor Databases:
   - Utilizing authoritative emission factor libraries: UK DEFRA (freight and travel), US EPA GHG Hub (electricity and stationary fuel), Ecoinvent (industrial materials), and Exiobase (global multi-regional input-output spend modeling).`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Enterprise Carbon Accounting Platforms and Automated Pipelines",
      order_index: 1,
      content: `### Enterprise Carbon SaaS and Data Ingestion

1. Modern Carbon Accounting Platforms (Watershed, Persefoni, Sweep):
   - Ingesting raw enterprise data via automated API pipelines connecting ERP ledgers (SAP, NetSuite), utility smart meters, and corporate travel booking platforms (Navan, Concur).
   - Maintains an immutable carbon general ledger with automated versioning and factor mapping.`
    },
    {
      track_id: track3Id,
      title: "Product Carbon Footprint (PCF) and Life Cycle Assessment (LCA)",
      order_index: 2,
      content: `### ISO 14040/14044 Life Cycle Assessment

1. Life Cycle Assessment (LCA) System Boundaries:
   - Cradle-to-Gate: Quantifies emissions from raw material extraction up to the manufacturing factory gate.
   - Cradle-to-Grave: Comprehensive footprint encompassing supply chain, manufacturing, customer distribution, operational use phase, and final end-of-life disposal or recycling.`
    },
    {
      track_id: track3Id,
      title: "Third-Party GHG Verification and Audit Assurance (ISO 14064-3)",
      order_index: 3,
      content: `### Carbon Audit Assurance and Regulatory Readiness

1. ISO 14064-3 GHG Verification Standard:
   - Limited Assurance: Negative assurance statement (\"Nothing has come to our attention to suggest material misstatement\").
   - Reasonable Assurance: High-level positive assurance equivalent to financial audits, requiring detailed sampling, source utility invoice inspection, and strict uncertainty analysis.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #98.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In the Greenhouse Gas Protocol (GHG Protocol), what defines 'Scope 1' emissions?",
      options: [
        "Direct greenhouse gas emissions from sources owned or controlled by the company (e.g. natural gas boilers, fleet vehicles, and physical chemical processes)",
        "Purchased electricity from the regional grid",
        "Employee business flights",
        "Emissions from waste decomposing in municipal landfills"
      ],
      correct_option_index: 0,
      explanation: "Scope 1 covers direct emissions from owned or controlled sources like boilers, furnaces, and company fleet vehicles.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What is the universal metric unit used in corporate carbon accounting to aggregate all different greenhouse gases into a single comparable figure?",
      options: [
        "Gallons of water",
        "Barrels of oil",
        "Metric tons of Carbon Dioxide Equivalent (tCO2e)",
        "Megawatt hours"
      ],
      correct_option_index: 2,
      explanation: "tCO2e (metric tons of CO2 equivalent) normalizes all greenhouse gases by multiplying by their Global Warming Potential.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In corporate greenhouse gas inventorying, what is 'Scope 2' emissions?",
      options: [
        "Purchasing paper clips",
        "Indirect greenhouse gas emissions from the generation of purchased electricity, steam, heating, and cooling consumed by the reporting company",
        "Emissions from customer driving",
        "Methane leaks from oil wells"
      ],
      correct_option_index: 1,
      explanation: "Scope 2 accounts for indirect emissions associated with the production of purchased electricity and heating.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "Under the GHG Protocol Corporate Value Chain Standard, into how many distinct operational categories are Scope 3 emissions divided?",
      options: [
        "3 categories",
        "50 categories",
        "100 categories",
        "15 standardized categories (8 upstream categories and 7 downstream categories)"
      ],
      correct_option_index: 3,
      explanation: "Scope 3 is standardized into exactly 15 categories spanning upstream supply chains (1-8) and downstream product lifecycles (9-15).",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What is the foundational mathematical equation used to calculate greenhouse gas emissions from corporate activity data?",
      options: [
        "Emissions (tCO2e) = Activity Data * Emission Factor * GWP / 1,000",
        "Emissions = Price * Number of Customers",
        "Emissions = Office Square Footage * 12",
        "Emissions = Total Company Revenue / Tax Rate"
      ],
      correct_option_index: 0,
      explanation: "Emissions multiply activity volume (kWh, liters, miles) by the relevant emission factor and GWP index.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "Under the GHG Protocol Scope 2 Guidance, what does the mandatory 'Dual-Reporting' rule require companies to calculate and disclose?",
      options: [
        "Reporting emissions in pounds and kilograms",
        "Reporting morning emissions and evening emissions",
        "Reporting financial profits and losses",
        "Reporting Scope 2 electricity emissions using BOTH the Location-Based method (grid average) AND the Market-Based method (contractual PPAs/RECs)"
      ],
      correct_option_index: 3,
      explanation: "Dual-reporting requires companies to disclose both location-based grid averages and market-based contractual renewable purchases.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Scope 1 accounting, what are 'Fugitive Emissions'?",
      options: [
        "Emissions from employees running to work",
        "Unintentional leaks and releases of greenhouse gases, primarily refrigerant leaks (HFCs/PFCs) from building air conditioning, heat pumps, and refrigeration systems",
        "Exhaust from airplanes flying overseas",
        "Smoke from wood burning stoves"
      ],
      correct_option_index: 1,
      explanation: "Fugitive emissions refer to structural leaks from pressurized equipment, especially fluorinated refrigerants with massive GWPs.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In Product Carbon Footprint (PCF) and Life Cycle Assessment (LCA) (ISO 14040/14044), what is the difference between 'Cradle-to-Gate' and 'Cradle-to-Grave' system boundaries?",
      options: [
        "Cradle-to-Gate covers raw material extraction up to the manufacturing factory exit; Cradle-to-Grave covers the full lifecycle including customer distribution, usage phase, and end-of-life disposal",
        "Cradle-to-gate is for food only",
        "Cradle-to-grave has zero environmental impact",
        "There is zero difference under ISO standards"
      ],
      correct_option_index: 0,
      explanation: "Cradle-to-gate stops at factory dispatch; cradle-to-grave encompasses entire product use and end-of-life recycling or landfill.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In Scope 3 greenhouse gas accounting, which category typically represents the single largest source of emissions for consumer goods, manufacturing, and technology companies?",
      options: [
        "Category 6 (Business Travel)",
        "Category 5 (Waste in Operations)",
        "Category 1 (Purchased Goods and Services, encompassing all upstream raw materials and supply chain manufacturing)",
        "Category 7 (Employee Commuting)"
      ],
      correct_option_index: 2,
      explanation: "Category 1 (Purchased Goods & Services) routinely accounts for 60-80% of total enterprise carbon footprints.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In carbon accounting data consolidation, what is the 'Operational Control Approach' for setting organizational boundaries?",
      options: [
        "A company accounts for emissions only when employees are awake",
        "A company only accounts for emissions from foreign subsidiaries",
        "Emissions are divided equally among all shareholders",
        "A company accounts for 100% of greenhouse gas emissions from all operational facilities and assets where it has the full authority to introduce and implement operating policies"
      ],
      correct_option_index: 3,
      explanation: "Under operational control, a company reports 100% of emissions from any site where it directs operational procedures.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In third-party GHG verification under ISO 14064-3, what is the core difference between 'Limited Assurance' and 'Reasonable Assurance'?",
      options: [
        "Limited assurance is for charities only",
        "Limited Assurance provides a negative conclusion ('Nothing has come to our attention'); Reasonable Assurance provides a high-level positive conclusion based on exhaustive testing, equivalent to financial audit standards",
        "Reasonable assurance is illegal in Europe",
        "There is zero difference in auditor liability"
      ],
      correct_option_index: 1,
      explanation: "Reasonable assurance involves detailed primary data testing and controls validation, yielding positive audit certification.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Scope 3 Category 15 accounting for financial institutions and asset managers, what global framework is standard for calculating 'Financed Emissions'?",
      options: [
        "Google Analytics",
        "The Fair Labor Association standard",
        "PCAF (Partnership for Carbon Accounting Financials), which attributes portfolio company emissions proportionally to the financial institution's debt or equity share",
        "The ISO 9001 quality manual"
      ],
      correct_option_index: 2,
      explanation: "PCAF provides standard formulas attributing investee and borrower emissions proportionally to financial investment exposure.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In calculating Scope 3 Category 6 (Business Travel) emissions from aviation, why do carbon accounting guidelines apply a 'Radiative Forcing Index' (RFI) multiplier to high-altitude flight emissions?",
      options: [
        "Because high-altitude aircraft emissions release nitrogen oxides (NOx), water vapor contrails, and aviation soot that produce additional net radiative warming beyond direct CO2 combustion alone",
        "To punish airlines with taxes",
        "Because airplane fuel is cheaper than car fuel",
        "RFI multipliers are used only for helicopter flights"
      ],
      correct_option_index: 0,
      explanation: "High-altitude non-CO2 radiative effects (contrails, NOx) amplify the climate impact of flights, accounted for via RFI multipliers.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Scope 3 supply chain carbon accounting, how does 'Spend-Based EEIO Modeling' compare to 'Supplier-Specific Activity Accounting'?",
      options: [
        "Spend-based modeling uses satellite imagery",
        "Supplier activity accounting is banned by the GHG Protocol",
        "Spend-based modeling is 100% accurate down to the gram",
        "Spend-based EEIO estimates emissions using industry spend averages ($ spent * sector emission factor), while Supplier-Specific accounting uses actual primary energy/production data directly from the supplier, providing far higher accuracy"
      ],
      correct_option_index: 3,
      explanation: "Spend-based EEIO is a high-level estimation tool; supplier-specific primary data is required for high accuracy and decarbonization tracking.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "Which authoritative international database is standard for providing life cycle inventory (LCI) emission factors across thousands of industrial materials, chemical processes, and electricity grids?",
      options: [
        "Wikipedia",
        "Ecoinvent (and multi-regional input-output databases like Exiobase)",
        "The New York Stock Exchange database",
        "IMDb"
      ],
      correct_option_index: 1,
      explanation: "Ecoinvent is the premier global life cycle inventory database providing verified background datasets for LCA calculations.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #98.");
  console.log("Skill #98 update completed successfully!");
}

run();
