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

const skillId = "a1e57d85-3011-443f-9182-5deba294db8b";

async function run() {
  console.log("Updating Skill #1: Soil & Crop Management...");

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

  // Update Track titles (Masked to Track in UI, clean database naming)
  await supabase.from("tracks").update({ title: "Track 1: Soil Science, Chemistry and Soil Physics" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Crop Nutrition, Phenology and Rotation" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Precision Sampling, Tillage and Field Execution" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Soil Texture, Structure and Soil Horizons",
      order_index: 1,
      content: `### The Physical Architecture of Soil

Soil physical properties form the non-negotiable baseline of all agricultural productivity. Soil texture is defined by the relative proportions of three mineral particle fractions:
- Sand (0.05 mm to 2.0 mm diameter): High aeration, rapid drainage, low nutrient retention.
- Silt (0.002 mm to 0.05 mm diameter): Smooth tactile feel, moderate water retention, vulnerable to wind and water erosion.
- Clay (less than 0.002 mm diameter): Extremely high specific surface area (up to 800 square meters per gram), high water-holding capacity, and high electrical charge.

### The Soil Textural Triangle and Ribbon Testing

In field agronomy, soil texture is determined using tactile ribbon tests:
1. Moisten a golf-ball-sized soil sample until it reaches the consistency of putty.
2. Squeeze the ball between your thumb and forefinger, pushing it upward to form a continuous ribbon of uniform thickness (approx 2 mm).
3. If the ribbon breaks at less than 2.5 cm, the soil is sandy loam or silt loam. If it extends 2.5 cm to 5.0 cm before breaking, it is a clay loam. Ribbons exceeding 5.0 cm indicate high clay content.

### Soil Horizons and Bulk Density Management

A healthy agricultural soil profile consists of distinct genetic horizons:
- O Horizon: Organic surface layer composed of decomposing plant residues.
- A Horizon (Topsoil): Mineral soil with high organic matter accumulation and intense biological activity.
- E Horizon: Eluviated, leached zone where silicate clay, iron, and aluminum have washed out.
- B Horizon (Subsoil): Illuviated zone of clay and mineral accumulation.
- C Horizon: Unconsolidated weathered parent bedrock.
- R Horizon: Hard, solid underlying bedrock.

Bulk density (Db) is calculated as the dry mass of soil divided by total soil volume (g/cm3). Ideal topsoil bulk density ranges from 1.10 to 1.40 g/cm3. When compaction drives bulk density above 1.60 g/cm3 in clay or 1.75 g/cm3 in sand, mechanical root penetration is severely restricted and anaerobic conditions trigger root rot pathogens.`
    },
    {
      track_id: track1Id,
      title: "Soil Chemistry, pH Dynamics and Cation Exchange Capacity (CEC)",
      order_index: 2,
      content: `### Electrochemical Foundations of Soil Fertility

Soil particles, particularly clays and decomposed humus colloids, carry net negative electrical surface charges. These negative sites hold positively charged ions (cations) against gravitational leaching, releasing them into the soil solution for root absorption.

### Cation Exchange Capacity (CEC) Explained

Cation Exchange Capacity measures the total quantity of exchangeable cations a soil can hold, expressed in milliequivalents per 100 grams of dry soil (meq/100g) or centimoles of positive charge per kilogram (cmol(+)/kg).
- Coarse Sandy Soils: 1 to 5 meq/100g (Requires frequent, small split fertilizer applications).
- Silt Loams: 10 to 20 meq/100g (Balanced water and nutrient retention).
- Clay Loams: 20 to 35 meq/100g (High buffer capacity, holds nutrients strongly).
- Humus and Organic Soils: 50 to 100+ meq/100g.

### Soil pH and Base Saturation

Soil pH governs chemical solubility and microbial activity:
- Strongly Acidic (pH below 5.5): Aluminum (Al3+) and Manganese (Mn2+) reach phytotoxic concentrations; Phosphorus fixes to iron and aluminum oxides.
- Optimal Agronomic Range (pH 6.0 to 7.0): Maximum availability of Nitrogen, Phosphorus, Potassium, Calcium, and Magnesium; optimal bacterial nitrification.
- Alkaline / Calcareous (pH above 7.8): Phosphorus binds with Calcium forming insoluble calcium phosphates; micronutrients like Iron and Zinc become unavailable.

### Correcting Soil Acidity and Alkalinity

- Agricultural Liming: Calcium carbonate (CaCO3) neutralizes active H+ and exchangeable Al3+ in the soil solution.
- Sodic Soil Remediation: Gypsum (Calcium sulfate, CaSO4) is applied to displace excess Sodium (Na+) from colloid exchange sites, followed by heavy irrigation to leach sodium downward.`
    },
    {
      track_id: track1Id,
      title: "Soil Biology, Organic Matter and the Soil Food Web",
      order_index: 3,
      content: `### Soil Organic Matter (SOM) Dynamics

Soil Organic Matter is the vital foundation of biological soil fertility. It is divided into three distinct operational fractions:
1. Living Biomass: Soil bacteria, fungi, actinomycetes, earthworms, and plant root exudates.
2. Active Fraction (Particulate Organic Matter): Readily decomposable fresh residues that feed microbes and release plant-available nutrients over 1 to 5 years.
3. Passive Fraction (Humus): Chemically stabilized organic compounds that persist for decades to centuries, providing long-term structural aggregation and water retention.

### The Microbial Carbon-to-Nitrogen (C:N) Equilibrium

Microorganisms require carbon for energy and nitrogen for protein synthesis in an average internal ratio of 8:1. Because microbes burn approximately two-thirds of consumed carbon as CO2 during respiration, they require an input diet of roughly 24:1 C:N ratio:
- Low C:N Residues (Legumes 12:1 to 18:1, Young Cover Crops): Rapid decomposition releases surplus inorganic nitrogen into the soil solution (Net Nitrogen Mineralization).
- High C:N Residues (Wheat Straw 80:1, Corn Stover 60:1, Sawdust 400:1): Microbes scavenge available soil mineral nitrogen to process carbon, temporarily starving crops (Net Nitrogen Immobilization).

### Mycorrhizal Fungi and Rhizosphere Symbiosis

- Arbuscular Mycorrhizal Fungi (AMF): Fungal hyphae penetrate root cortical cells, extending the effective root surface area by 100x to 1000x to mine immobile Phosphorus and Zinc from soil micropores.
- Rhizobia Bacteria: Form nodules on legume roots to break the triple bond of atmospheric N2 gas, converting it directly into bio-available ammonium (NH4+).`
    },
    
    // Track 2
    {
      track_id: track2Id,
      title: "Plant Nutrition: Macronutrients, Micronutrients and Diagnostics",
      order_index: 1,
      content: `### The Essential Elements of Crop Nutrition

Plants require 17 essential chemical elements to complete their lifecycle. Carbon, Hydrogen, and Oxygen are acquired from air and water. The remaining 14 mineral nutrients are categorized as follows:
- Primary Macronutrients: Nitrogen (N), Phosphorus (P), Potassium (K). Needed in quantities of 50 to 300+ kg/ha.
- Secondary Macronutrients: Calcium (Ca), Magnesium (Mg), Sulfur (S). Needed in quantities of 10 to 50 kg/ha.
- Micronutrients: Iron (Fe), Zinc (Zn), Manganese (Mn), Copper (Cu), Boron (B), Molybdenum (Mo), Chlorine (Cl), Nickel (Ni). Needed in grams to a few kilograms per hectare.

### In-Field Nutrient Deficiency Diagnostics

Nutrient mobility within the plant vascular system dictates where visual deficiency symptoms appear first:

#### Mobile Nutrients (Symptoms appear on LOWER, OLDER leaves first):
- Nitrogen (N): Uniform pale yellowing (chlorosis) starting at the leaf tip and progressing along the midrib in a V-shaped pattern.
- Phosphorus (P): Stunted growth with distinct dark purple or reddish coloration along leaf margins and stems due to anthocyanin pigment accumulation.
- Potassium (K): Marginal leaf scorch, yellowing, and necrotic burning along outer leaf edges.
- Magnesium (Mg): Distinct interveinal chlorosis on older leaves while leaf veins remain dark green.

#### Immobile Nutrients (Symptoms appear on UPPER, YOUNGER leaves first):
- Calcium (Ca): Distorted young leaf tips, hooked leaves, and localized cell breakdown (e.g. blossom end rot in tomatoes, tip burn in lettuce).
- Iron (Fe): Sharp interveinal chlorosis on the youngest emerging leaves while veins stay vibrant green.
- Boron (B): Brittle, stunted growing points, cracked stems, and poor pollination/seed set.

### The 4R Nutrient Stewardship Framework
1. Right Source: Match fertilizer chemical composition to soil chemistry and crop needs.
2. Right Rate: Match amount applied to soil test deficits and realistic target yield goals.
3. Right Time: Apply when crops are actively taking up nutrients to prevent leaching and volatilization.
4. Right Place: Band, inject, or broadcast nutrients precisely where root zones can access them.`
    },
    {
      track_id: track2Id,
      title: "Crop Phenology, Growth Stages and Environmental Stress",
      order_index: 2,
      content: `### Standardized Crop Phenology Scales

Accurate agronomic decisions (herbicide timing, fungicide applications, and sidedress fertilization) require standard phenological scales:
- BBCH Scale: A universal decimal code from 00 (dry seed) to 99 (harvested product). Principal growth stages include 0 (germination), 1 (leaf development), 2 (tillering), 3 (stem elongation), 5 (inflorescence emergence), 6 (flowering/anthesis), 7 (fruit/grain development), and 8 (ripening).
- Feekes Scale (Cereal Grains): 1.0 (emergence), 2.0 to 5.0 (tillering), 6.0 (first node detectable; herbicide cutoff), 10.0 (in boot), 10.51 (flowering), 11.4 (ripe for harvest).

### Growing Degree Days (GDD) Calculation

Plant developmental rate is driven by cumulative thermal heat units rather than calendar days.
GDD is calculated with the standard formula:
\`\`\`
GDD = ((T_max + T_min) / 2) - T_base
\`\`\`
Where:
- T_max is daily maximum temperature (capped at upper physiological threshold, e.g. 30 degrees C for corn).
- T_min is daily minimum temperature (floored at base physiological threshold, e.g. 10 degrees C for corn).
- T_base is base developmental temperature below which growth ceases.

### Managing Abiotic Crop Stress

- Critical Flowering Windows: High heat (temperatures above 35 degrees C) during anthesis causes pollen desiccation and sterile ovules, leading to severe yield drops.
- Drought Adaptation: Crops accumulate compatible osmolytes (proline, glycine betaine) to maintain cell turgor and close stomata via abscisic acid (ABA) signaling.
- Waterlogging and Anoxia: Saturated root zones deplete oxygen within 24 to 48 hours, halting root respiration and ATP synthesis. Artificial tile drainage and bed raising prevent severe yield penalties.`
    },
    {
      track_id: track2Id,
      title: "Systematic Crop Rotation and Intercropping Architectures",
      order_index: 3,
      content: `### Agronomic Principles of Crop Rotation

Monoculture cropping systems degrade soil biology and select for specialized weed, insect, and fungal pathogen communities. A strategic multi-year crop rotation breaks these cycles through ecological diversity:
1. Pest and Disease Lifecycle Interruption: Pathogens like Fusarium head blight, corn rootworm, and soybean cyst nematode decline significantly when non-host break crops are planted for 1 to 3 seasons.
2. Root Architecture Stratification: Alternating shallow fibrous-rooted crops (corn, wheat) with deep taproot crops (sunflowers, canola, alfalfa) accesses nutrients across different soil depths and bio-drills hardpan layers.
3. Biological Nitrogen Fixation: Legume rotations (soybeans, chickpeas, field peas) leave residual organic nitrogen credits (20 to 60+ kg N/ha) for the subsequent grain crop.

### Cover Cropping Strategies

Cover crops are planted primarily for soil protection, organic matter accumulation, and nutrient scavenging:
- Winter Cereal Rye: High biomass producer, exceptional weed suppression, scavenges residual nitrate to prevent groundwater contamination.
- Daikon / Tillage Radish: Rapidly drills deep taproots (up to 1.5 meters), fracturing compacted subsoil layers and bio-accumulating mobile nutrients.
- Crimson Clover / Hairy Vetch: High-fixation legumes contributing substantial biomass nitrogen for spring cash crops.

### Spatial Intercropping and Relay Systems

- Strip Intercropping: Growing two or more crops in narrow, alternating strips (e.g. 6 rows of corn alternating with 6 rows of soybeans) to maximize edge sunlight interception.
- Relay Cropping: Seeding a secondary crop (e.g. winter wheat or soybeans) directly into an existing standing crop before the primary crop is harvested, maximizing thermal growing seasons.`
    },
    
    // Track 3
    {
      track_id: track3Id,
      title: "Precision Soil Sampling, Lab Testing and Prescription Mapping",
      order_index: 1,
      content: `### Systematic Soil Sampling Methodologies

The accuracy of all fertilizer investments depends directly on soil sampling discipline:
- Grid Soil Sampling: Fields are divided into uniform geometric grids (typically 2.5 acres or 1.0 hectare). Soil cores (15 to 20 cores per grid cell) are extracted, mixed thoroughly, and georeferenced with GPS.
- Zone Soil Sampling: Field boundaries are partitioned into distinct management zones based on soil Electrical Conductivity (EC) veris mapping, multi-year yield history, elevation contours, and satellite NDVI maps.

### Proper Sampling Depth Protocol

- Routine Fertility (P, K, pH, OM, Micronutrients): 0 to 6 inches (0 to 15 cm). This depth represents the primary root absorption zone and where lime/fertilizers are incorporated.
- Nitrate-Nitrogen (NO3-N) and Sulfate (SO4-S) Deep Profiling: 6 to 24 inches (15 to 60 cm). Mobile anions leach downward, requiring deep core sampling to prevent over-fertilization.

### Interpreting Laboratory Soil Test Reports

- Soil Phosphorus Extraction Methods:
  - Bray P1: Calibrated for acidic to neutral soils (pH below 7.2).
  - Olsen P (Sodium Bicarbonate): Used for alkaline/calcareous soils (pH above 7.3).
  - Mehlich-3: Universal multi-element extractant used across wide pH ranges.
- Exchangeable Potassium (K): Values below 120 ppm require broadcast replenishment; 160 to 200 ppm represents optimal agronomic sufficiency.
- Base Saturation Percentages: Target ratios are 65% to 75% Calcium, 12% to 18% Magnesium, 3% to 5% Potassium, and less than 1% Sodium on colloid exchange sites.

### Generating Variable Rate Application (VRA) Prescription Maps

Soil test results are interpolated using GIS algorithms (Inverse Distance Weighting or Kriging) to build nutrient deficit shapefiles. These prescription files are loaded into modern tractor rate controllers to apply high rates only on deficient zones, optimizing input costs and environmental safety.`
    },
    {
      track_id: track3Id,
      title: "Tillage Systems: Conventional, Minimum-Till and No-Till Operations",
      order_index: 2,
      content: `### Evaluating Agricultural Tillage Systems

Tillage systems manipulate soil structure, residue cover, and seedbed temperature. Modern agronomy evaluates tillage based on soil health impact and operational efficiency:

#### 1. Conventional Tillage (Moldboard Plow / Disk Harrow)
- Mechanical Impact: Inverts the entire topsoil horizon, burying 90%+ of crop residues.
- Pros: Creates a warm, bare seedbed for rapid spring seed germination.
- Cons: Destroys soil aggregates, accelerates organic matter oxidation, causes severe water and wind erosion, and forms dense plow pans.

#### 2. Conservation Tillage (Strip-Till / Vertical Tillage)
- Strip-Till: Clears residue and tills a narrow 6 to 8 inch band where the seed and fertilizer will be placed, leaving the inter-row space undisturbed under full residue cover.
- Vertical Tillage: High-speed shallow coulters size crop residue and fracture surface crusts without inverting soil layers.

#### 3. No-Till (Direct Seeding)
- Mechanical Impact: Zero soil inversion. Seeds are placed directly into undisturbed soil and standing stubble.
- Pros: Drastically reduces fuel and labor costs, maximizes water infiltration, enhances fungal mycorrhizae, and eliminates soil erosion.
- Cons: Slower soil warming in cold springs, risk of surface compaction without crop rotation, and requires heavy-duty planter downforce.

### Planter Setup for High-Residue Systems

Successful no-till and strip-till planting requires specific row-unit components:
1. Row Cleaners: Spoked wheels sweep heavy residue away from the furrow path to prevent residue hairpinning.
2. Heavy-Duty Double Disk Openers: Sharp steel disks cut a clean V-slot through firm soil.
3. Automated Hydraulic Downforce: Applies 150 to 400+ lbs of continuous downward pressure to maintain exact seed placement depth (typically 1.5 to 2.0 inches).
4. Spoked / Cast Closing Wheels: Crumble furrow sidewalls without over-compacting soil directly over the emerging seed.`
    },
    {
      track_id: track3Id,
      title: "Integrated Crop Protection, Scouting and Yield Optimization",
      order_index: 3,
      content: `### The Integrated Pest Management (IPM) Decision Matrix

Integrated Pest Management combines biological, cultural, mechanical, and chemical tools to minimize pest damage while maximizing economic and ecological safety:

### Economic Injury Level (EIL) and Economic Threshold (ET)

Chemical treatments must never be applied on arbitrary calendar schedules. Agronomists calculate economic viability using standard bio-economic models:
\`\`\`
EIL = C / (V * I * D * K)
\`\`\`
Where:
- C = Management cost per unit area (cost of pesticide plus application machinery).
- V = Market value per unit of yield (e.g. dollars per metric ton or bushel).
- I = Injury per pest density unit (percentage leaf loss per insect).
- D = Damage per unit injury (yield loss per unit of injury).
- K = Proportionate reduction in pest population achieved by the treatment (control efficacy).

The Economic Threshold (Action Threshold) is the pest density at which control measures must be initiated to prevent an increasing pest population from reaching the Economic Injury Level.

### Systematic Field Scouting Protocols

- Spatial Sampling Patterns: Scouts walk fields in representative M-patterns, W-patterns, or stratified zig-zags, inspecting at least 10 random sites per 40-acre quadrant.
- Multispectral Drone NDVI Analysis: Normalized Difference Vegetation Index:
\`\`\`
NDVI = (NIR - Red) / (NIR + Red)
\`\`\`
Identifies localized chlorophyll deficits, drought stress, and nematode patches days before visible symptoms appear to the human eye.

### Harvest Timing and Grain Moisture Management

- Corn: Optimal harvest at 20% to 25% kernel moisture for mechanical combine efficiency, dried down to 15% for safe bin storage.
- Soybeans: Optimal harvest at 13% moisture to avoid harvest pod shatter losses and elevator drying discounts.
- Combine Yield Monitor Calibration: Calibrating mass flow impact sensors and moisture sensors against certified scale weights guarantees reliable spatial yield maps for next year's crop planning.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks.");

  // 2. Clear old generic quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "Which group represents the three fundamental mineral particle size fractions that determine soil texture?",
      options: [
        "Humus, compost, and manure",
        "Nitrogen, Phosphorus, and Potassium",
        "Clay, silt, and sand",
        "Topsoil, subsoil, and bedrock"
      ],
      correct_option_index: 2,
      explanation: "Soil texture is strictly defined by the relative percentage of mineral particles classified by size: sand (0.05 to 2.0 mm), silt (0.002 to 0.05 mm), and clay (under 0.002 mm).",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What are the three primary macronutrients required in the largest quantities by agricultural row crops?",
      options: [
        "Nitrogen (N), Phosphorus (P), and Potassium (K)",
        "Calcium (Ca), Magnesium (Mg), and Sulfur (S)",
        "Iron (Fe), Zinc (Zn), and Boron (B)",
        "Carbon (C), Hydrogen (H), and Oxygen (O)"
      ],
      correct_option_index: 0,
      explanation: "Nitrogen, Phosphorus, and Potassium are primary macronutrients, utilized by plants in large amounts ranging from dozens to hundreds of kilograms per hectare.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What is the optimal soil pH range for maximizing overall nutrient availability for most commercial crops?",
      options: [
        "3.5 to 4.5",
        "4.5 to 5.5",
        "8.0 to 9.0",
        "6.0 to 7.0"
      ],
      correct_option_index: 3,
      explanation: "A soil pH between 6.0 and 7.0 minimizes toxic aluminum/manganese solubility while optimizing the availability of both macronutrients and micronutrients.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "Where do visual deficiency symptoms of mobile nutrients such as Nitrogen first manifest on a growing plant?",
      options: [
        "On newly emerging leaves at the top of the canopy",
        "On the lowest, oldest leaves of the plant",
        "Exclusively on developing floral structures",
        "Uniformly across the entire plant at the exact same moment"
      ],
      correct_option_index: 1,
      explanation: "Mobile nutrients can be translocated by the plant from older tissues to newer active growth points, causing older lower leaves to show chlorosis first.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What is the standard mathematical formula used to calculate daily Growing Degree Days (GDD) for crop phenology?",
      options: [
        "GDD = T_max multiplied by T_min",
        "GDD = T_max minus T_min divided by 2",
        "GDD = ((T_max + T_min) / 2) minus T_base",
        "GDD = (T_max + T_base) divided by T_min"
      ],
      correct_option_index: 2,
      explanation: "Growing Degree Days calculate accumulated thermal heat units by taking the average of daily maximum and minimum temperatures and subtracting the crop base threshold temperature.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "Which sequence accurately ranks soil types in order of increasing Cation Exchange Capacity (CEC)?",
      options: [
        "Organic Soil < Clay Loam < Silt Loam < Coarse Sand",
        "Coarse Sand < Silt Loam < Clay Loam < Organic Humus Soil",
        "Clay Loam < Coarse Sand < Silt Loam < Organic Soil",
        "Silt Loam < Organic Soil < Coarse Sand < Clay Loam"
      ],
      correct_option_index: 1,
      explanation: "Coarse sand has the lowest CEC (1 to 5 meq/100g) due to low surface area, followed by silt loam (10 to 20), clay loam (20 to 35), and organic humus soil (50 to 100+).",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "How does agricultural lime (Calcium Carbonate, CaCO3) chemically correct soil acidity?",
      options: [
        "By releasing excess hydrogen ions directly into the groundwater",
        "By converting nitrogen gas into ammonium ions",
        "By increasing the concentration of toxic aluminum in soil pores",
        "Carbonate ions react with active H+ and Al3+ to form water and CO2 while Calcium occupies exchange sites"
      ],
      correct_option_index: 3,
      explanation: "Calcium carbonate dissolves to release carbonate ions that neutralize acidic hydrogen and precipitate toxic aluminum, while calcium cations saturate colloidal exchange sites.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What is the ideal Carbon to Nitrogen (C:N) ratio of organic matter required to maintain microbial equilibrium without causing nitrogen immobilization?",
      options: [
        "Approximately 24:1",
        "Approximately 80:1",
        "Approximately 150:1",
        "Approximately 400:1"
      ],
      correct_option_index: 0,
      explanation: "Microbes consume carbon and nitrogen in an effective diet ratio of 24:1. Residues with C:N ratios significantly above 24:1 trigger temporary nitrogen immobilization in the soil.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "A vegetable grower observes blossom end rot on tomato fruits while older foliage appears dark green. Which nutrient deficiency is responsible?",
      options: [
        "Nitrogen deficiency",
        "Potassium deficiency",
        "Calcium deficiency",
        "Magnesium deficiency"
      ],
      correct_option_index: 2,
      explanation: "Calcium is immobile in plant vascular systems. When transpiration fluctuates, calcium cannot reach rapidly expanding fruit cells, causing cell wall collapse and blossom end rot.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What is the standard agronomic core depth recommended when collecting soil samples for routine P, K, and pH testing in row crops?",
      options: [
        "0 to 2 inches (0 to 5 cm)",
        "0 to 6 inches (0 to 15 cm)",
        "12 to 24 inches (30 to 60 cm)",
        "24 to 36 inches (60 to 90 cm)"
      ],
      correct_option_index: 1,
      explanation: "The 0 to 6 inch (0 to 15 cm) core depth captures the primary tillage and root-zone fertility layer for immobile nutrients like Phosphorus, Potassium, and pH buffer evaluation.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "In Integrated Pest Management, which formula defines the Economic Injury Level (EIL)?",
      options: [
        "EIL = (V multiplied by C) divided by (I + D)",
        "EIL = (I multiplied by D) minus (C divided by V)",
        "EIL = K divided by (C multiplied by V)",
        "EIL = C / (V * I * D * K)"
      ],
      correct_option_index: 3,
      explanation: "The Economic Injury Level is defined as EIL = C / (V * I * D * K), where C is management cost, V is crop value, I is injury per pest, D is damage per injury, and K is control efficacy.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "An agronomist measures a soil core with dry mass 165 grams and total core volume 100 cm3. What is the bulk density and its agronomic implication?",
      options: [
        "1.65 g/cm3; severe root restriction and reduced aeration in fine-textured soils",
        "0.60 g/cm3; excessively porous organic muck soil prone to wind erosion",
        "2.65 g/cm3; typical density of solid quartz mineral parent rock",
        "1.15 g/cm3; ideal topsoil condition with optimal porosity and root penetration"
      ],
      correct_option_index: 0,
      explanation: "Bulk density = 165 g / 100 cm3 = 1.65 g/cm3. In silt and clay loams, bulk density exceeding 1.60 g/cm3 severely impedes root elongation and causes drainage problems.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "When incorporating 5 tons/ha of wheat straw residue (C:N ratio 80:1) into the soil immediately before planting, what immediate phenomenon occurs?",
      options: [
        "Surplus nitrogen mineralization causing toxic vegetative growth",
        "Rapid volatilization of potassium ions into the atmosphere",
        "Microbial nitrogen immobilization, causing temporary nitrogen deficiency in the emerging crop",
        "Instantaneous decline in soil cation exchange capacity"
      ],
      correct_option_index: 2,
      explanation: "High C:N residues cause soil microbes to scavenge all available mineral ammonium and nitrate from the soil solution to synthesize proteins, temporarily starving the cash crop.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "How does apparent soil Electrical Conductivity (EC) mapping delineate distinct agricultural management zones?",
      options: [
        "By measuring solar radiation absorption of surface plant canopies",
        "By sensing spatial variations in soil texture, moisture capacity, topsoil depth, and salinity",
        "By determining the exact atmospheric humidity above the crop canopy",
        "By calculating the exact genetic hybrid vigor of planted seeds"
      ],
      correct_option_index: 1,
      explanation: "Soil Electrical Conductivity directly correlates with soil textural variations (clay vs sand), moisture-holding capacity, cation concentrations, and subsoil depth.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "When configuring a modern direct-seeding planter for heavy residue continuous no-till conditions, what critical adjustment must be executed?",
      options: [
        "Increase row-unit hydraulic downforce and install spoked row cleaners to prevent residue hairpinning",
        "Remove closing wheels and reduce coulter sharpness to avoid cutting residue",
        "Operate at maximum tractor velocity to throw residue across adjacent rows",
        "Decrease planting depth to 0.25 inches to avoid cold subsoil temperatures"
      ],
      correct_option_index: 0,
      explanation: "In heavy residue no-till, spoked row cleaners clear residue away from the furrow path to stop residue hairpinning, while automated downforce maintains consistent seed depth in firm soil.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers.");
  console.log("Skill #1 update completed successfully!");
}

run();
