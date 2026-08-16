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

const skillId = "735716c3-b6ae-4300-b851-1be902dc6f4f";

async function run() {
  console.log("Updating Skill #97: Sustainability Fundamentals (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Planetary Boundaries, Earth Systems and Ecological Overshoot" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: The Triple Bottom Line, Circular Economy and Industrial Ecology" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Climate Policy, The Paris Agreement and Science-Based Targets" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Chief Sustainability Officer & Climate Scientist level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Johan Rockström's 9 Planetary Boundaries and Tipping Points",
      order_index: 1,
      content: `### Earth System Science and Planetary Boundaries

1. The 9 Planetary Boundaries (Stockholm Resilience Centre):
   - Defined by Johan Rockström and Will Steffen to demarcate the safe operating space for humanity:
     - 1. Climate Change (atmospheric CO2 and radiative forcing)
     - 2. Biosphere Integrity (genetic diversity and extinction rates)
     - 3. Biogeochemical Flows (nitrogen and phosphorus agricultural runoff)
     - 4. Land-System Change (deforestation and biome conversion)
     - 5. Freshwater Change (green and blue water consumption)
     - 6. Novel Entities (synthetic chemicals, microplastics, PFAS)
     - 7. Ocean Acidification (calcite/aragonite saturation)
     - 8. Stratospheric Ozone Depletion (CFC concentration)
     - 9. Atmospheric Aerosol Loading (optical depth).

2. Tipping Points and Transgressed Boundaries:
   - Six of the nine boundaries are already transgressed, risking non-linear catastrophic climate feedback loops.`
    },
    {
      track_id: track1Id,
      title: "The Anthropocene, Radiative Forcing and Global Warming Potential",
      order_index: 2,
      content: `### Atmospheric Physics and Greenhouse Gas Metrics

1. Climate Dynamics:
   - Radiative Forcing (Watts per square meter, W/m2): Net energy imbalance trapped in Earth's atmosphere by anthropogenic greenhouse gases.

2. Global Warming Potential (GWP100) Multipliers:
   - Carbon Dioxide (CO2): Baseline GWP = 1.
   - Methane (CH4): GWP100 = 28 (traps 28x more heat than CO2 over a 100-year horizon; 84x over 20 years).
   - Nitrous Oxide (N2O): GWP100 = 273 (agricultural fertilizer emissions).
   - Sulfur Hexafluoride (SF6): GWP100 = 25,200 (electrical switchgear gas).`
    },
    {
      track_id: track1Id,
      title: "Ecological Footprint, Earth Overshoot Day and Bio-Capacity",
      order_index: 3,
      content: `### Bio-Capacity Accounting and Carrying Capacity

1. Global Footprint Network Accounting:
   - Measures human resource consumption in global hectares (gha) against Earth's biological capacity to regenerate resources and absorb waste.

2. Earth Overshoot Day:
   - The calendar date each year when humanity's resource consumption exceeds Earth's annual ecological regenerative capacity (humanity currently consumes resources at a rate equivalent to 1.7 Earths annually).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "John Elkington's Triple Bottom Line and True Cost Accounting",
      order_index: 1,
      content: `### Stakeholder Capitalism and Natural Capital

1. The Triple Bottom Line (3Ps Framework):
   - People: Social equity, fair labor practices, community impact, and human rights.
   - Planet: Ecological footprint, greenhouse gas emissions, and natural resource stewardship.
   - Profit: Long-term economic viability and sustainable shareholder returns.

2. True Cost Accounting (TCA):
   - Quantifying and internalizing unpriced environmental and social negative externalities (e.g. air pollution healthcare costs, soil depletion) into corporate profit equations.`
    },
    {
      track_id: track2Id,
      title: "Ellen MacArthur Foundation Circular Economy and Butterfly Diagram",
      order_index: 2,
      content: `### Circular System Architecture vs Linear Extraction

1. The Linear 'Take-Make-Waste' Paradigm:
   - Depletes finite virgin resources while generating massive landfill accumulation.

2. The Circular Economy Butterfly Architecture:
   - Technical Cycle: Retaining value of finite inorganic materials through Share -> Maintain -> Reuse/Redistribute -> Remanufacture/Refurbish -> Recycle.
   - Biological Cycle: Regenerating living systems by returning non-toxic organic nutrients safely to the biosphere through Cascades -> Anaerobic Digestion -> Composting.`
    },
    {
      track_id: track2Id,
      title: "Cradle to Cradle (C2C) Design and Waste Elimination",
      order_index: 3,
      content: `### Regenerative Industrial Design and Material Passports

1. The Cradle to Cradle (C2C) Philosophy (McDonough & Braungart):
   - Eliminating the very concept of waste (\"Waste equals food\").

2. Design for Disassembly (DfD) and Digital Product Passports:
   - Engineering industrial products with non-toxic, separable components and digital QR passports tracking chemical composition and recyclability lineages.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "The Paris Agreement, IPCC Scenarios and 1.5°C Carbon Budgets",
      order_index: 1,
      content: `### International Treaties and Climate Trajectories

1. The Paris Agreement (UNFCCC COP21):
   - Legally binding international climate accord committing 196 nations to hold global temperature rise well below 2.0 degrees C above pre-industrial levels, with aggressive efforts to limit warming to 1.5 degrees C.

2. IPCC Carbon Budgets:
   - Intergovernmental Panel on Climate Change (IPCC) Shared Socioeconomic Pathways (SSPs) defining the finite remaining cumulative gigatons of CO2 humanity can emit before locking in 1.5 degrees C of warming.`
    },
    {
      track_id: track3Id,
      title: "Science Based Targets initiative (SBTi) and Corporate Net-Zero",
      order_index: 2,
      content: `### Corporate Decarbonization and Scientific Standards

1. The SBTi Corporate Net-Zero Standard:
   - Near-Term Targets (5 to 10 years): Halving absolute corporate emissions (50% reduction) across Scopes 1, 2, and 3.
   - Long-Term Targets (by 2050): Achieving 90% to 95% deep structural decarbonization across all direct and supply chain emissions.

2. Neutralization Restrictions:
   - Limiting permanent carbon removal offsets strictly to the final <=10% of unavoidable residual emissions, prohibiting cheap unverified avoidance offsets.`
    },
    {
      track_id: track3Id,
      title: "United Nations Sustainable Development Goals (UN SDGs)",
      order_index: 3,
      content: `### The 2030 Agenda and Enterprise SDG Alignment

1. The 17 UN Sustainable Development Goals:
   - Global 2030 roadmap established by all 193 UN member states to address poverty, inequality, climate degradation, and peace.

2. Enterprise Value Chain Alignment:
   - Mapping corporate sustainability initiatives directly to core targets:
     - SDG 7: Affordable and Clean Energy
     - SDG 12: Responsible Consumption and Production
     - SDG 13: Climate Action.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #97.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "What are the three pillars of John Elkington's famous 'Triple Bottom Line' (3Ps) framework?",
      options: [
        "Price, Promotion, Product",
        "People (Social), Planet (Environmental), and Profit (Economic)",
        "Power, Policy, Politics",
        "Production, Packaging, Purchasing"
      ],
      correct_option_index: 1,
      explanation: "The Triple Bottom Line balances People (social equity), Planet (environmental stewardship), and Profit (economic health).",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "Under the international Paris Climate Agreement (COP21), what is the primary target limit for global average temperature increase above pre-industrial levels?",
      options: [
        "10.0 degrees Celsius",
        "5.0 degrees Celsius",
        "Zero degrees Celsius",
        "Well below 2.0 degrees Celsius, with aggressive efforts to limit the increase to 1.5 degrees Celsius"
      ],
      correct_option_index: 3,
      explanation: "The Paris Agreement legally commits nations to keeping global temperature rise well below 2.0C and pursuing 1.5C.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In atmospheric chemistry, what is the Global Warming Potential (GWP100) baseline value assigned to Carbon Dioxide (CO2)?",
      options: [
        "1 (CO2 is the universal scientific baseline index for all greenhouse gas warming potentials)",
        "100",
        "28",
        "0"
      ],
      correct_option_index: 0,
      explanation: "Carbon dioxide (CO2) serves as the standard scientific baseline with a GWP value of exactly 1.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In the Ellen MacArthur Foundation's Circular Economy model, what is the primary goal of the 'Technical Cycle'?",
      options: [
        "Burying electronics in landfills",
        "Burning plastic for electricity",
        "Keeping inorganic materials (metals, polymers) in high-value circulation through sharing, maintenance, reuse, remanufacturing, and recycling",
        "Converting metals into fertilizer"
      ],
      correct_option_index: 2,
      explanation: "The technical cycle retains finite technical materials at their highest utility without degrading them into landfill waste.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What does 'Earth Overshoot Day' represent in global bio-capacity accounting?",
      options: [
        "The day astronauts land on Mars",
        "The calendar date when humanity's annual ecological resource consumption exceeds Earth's biological capacity to regenerate those resources in that year",
        "The longest day of the year",
        "The date of the winter solstice"
      ],
      correct_option_index: 1,
      explanation: "Earth Overshoot Day marks the date human demand for ecological resources outstrips the planet's annual regenerative budget.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In the Stockholm Resilience Centre's Planetary Boundaries framework, developed by Johan Rockström, how many total planetary boundaries are defined?",
      options: [
        "3 boundaries",
        "50 boundaries",
        "9 boundaries (including climate change, biosphere integrity, and biogeochemical flows)",
        "1 boundary"
      ],
      correct_option_index: 2,
      explanation: "Rockström identified 9 planetary boundaries that regulate the stability and resilience of the Earth system.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In greenhouse gas accounting, why is Methane (CH4) a particularly potent gas compared to CO2 over a 100-year horizon?",
      options: [
        "Methane has a GWP100 of approximately 28, trapping 28 times more atmospheric heat per ton than CO2 (and over 80x more over 20 years)",
        "Methane freezes the atmosphere",
        "Methane only comes from volcanoes",
        "Methane has zero warming effect"
      ],
      correct_option_index: 0,
      explanation: "Methane is a potent short-lived climate pollutant with a 100-year GWP of 28, making methane reduction crucial for near-term cooling.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In Cradle to Cradle (C2C) industrial design (McDonough & Braungart), what is the foundational principle regarding waste?",
      options: [
        "Waste is inevitable and must be burned",
        "Waste should be dumped in the ocean",
        "Waste is managed only by government taxes",
        "'Waste equals food' (all materials are designed as either biological nutrients that safely decompose or technical nutrients that circulate perpetually in closed loops)"
      ],
      correct_option_index: 3,
      explanation: "Cradle to Cradle eliminates the concept of waste by designing every material to serve as feedstock for another process.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "Under the Science Based Targets initiative (SBTi) Corporate Net-Zero Standard, what requirement is mandated for long-term 2050 targets?",
      options: [
        "Companies can buy 100% cheap carbon offsets without changing their business",
        "Companies must achieve 90% to 95% deep structural decarbonization across all Scope 1, 2, and 3 emissions, using permanent carbon removal only for the final <=10% residual emissions",
        "Companies only need to reduce emissions by 10%",
        "Emissions are allowed to increase if profits rise"
      ],
      correct_option_index: 1,
      explanation: "SBTi mandates 90-95% absolute emissions abatement, restricting carbon removal offsets strictly to neutralizing residual emissions.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In corporate sustainability economics, what is 'True Cost Accounting' (TCA)?",
      options: [
        "A method to hide corporate financial losses",
        "Calculating the cost of office paper",
        "A holistic accounting methodology that quantifies and internalizes unpriced environmental and social negative externalities (e.g. health costs from air pollution) into balance sheets",
        "The retail price of a finished product"
      ],
      correct_option_index: 2,
      explanation: "True Cost Accounting measures the full economic, social, and environmental costs of business activities, internalizing externalities.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In industrial ecology and sustainable product lifecycle engineering, what is 'Design for Disassembly' (DfD)?",
      options: [
        "Designing products with modular, non-destructive mechanical fasteners and clear material labeling so components can be easily separated, repaired, and recycled at end-of-life",
        "Building products that break after 1 year to force repeat sales",
        "Manufacturing products without instructions",
        "Shredding products into unseparated landfill waste"
      ],
      correct_option_index: 0,
      explanation: "DfD designs products for rapid, tool-less disassembly, enabling clean material separation and closed-loop remanufacturing.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In climate physics and Earth system modeling, what is 'Radiative Forcing' (measured in W/m2)?",
      options: [
        "The speed of ocean currents",
        "The rotational speed of the Earth",
        "The sound frequency of wind turbines",
        "The net difference between incoming solar irradiance absorbed by Earth and outgoing infrared thermal radiation emitted back into space; positive values indicate atmospheric net warming"
      ],
      correct_option_index: 3,
      explanation: "Radiative forcing quantifies the net energy imbalance of the climate system caused by greenhouse gas concentrations in Watts/m2.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In the United Nations 2030 Agenda, which specific UN Sustainable Development Goal (SDG) is explicitly dedicated to 'Responsible Consumption and Production'?",
      options: [
        "SDG 1",
        "SDG 12",
        "SDG 4",
        "SDG 17"
      ],
      correct_option_index: 1,
      explanation: "SDG 12 establishes global targets for sustainable resource management, circularity, chemical management, and waste reduction.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In chemical lifecycle management, what is a major environmental threat posed by 'Novel Entities' in Johan Rockström's Planetary Boundaries framework?",
      options: [
        "They are invisible space objects",
        "They cause sudden temperature drops in Antarctica",
        "Synthetic chemical compounds, microplastics, and persistent organic pollutants (e.g. PFAS) released into ecosystems without natural degradation pathways, causing bioaccumulation and hormonal toxicity",
        "They are completely harmless to wildlife"
      ],
      correct_option_index: 2,
      explanation: "Novel entities include persistent human-made chemicals and microplastics that accumulate in ecosystems with unknown long-term toxicity.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In circular economy biological nutrient cascades, how does 'Anaerobic Digestion' generate sustainable energy while closing soil nutrient loops?",
      options: [
        "Microorganisms break down organic biodegradable waste in oxygen-free environments to produce biomethane biogas for renewable energy, while generating nutrient-rich digestate for agricultural fertilizer",
        "By incinerating plastic in open air",
        "By freezing organic waste in liquid nitrogen",
        "By burying food waste in concrete tombs"
      ],
      correct_option_index: 0,
      explanation: "Anaerobic digestion captures biogas for clean electricity while producing organic digestate fertilizer, returning nutrients to the soil.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #97.");
  console.log("Skill #97 update completed successfully!");
}

run();
