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

const skillId = "66a1d202-f56e-4bc5-8cc3-03eb69cfb30a";

async function run() {
  console.log("Updating Skill #38: Kitchen Safety & Sanitation (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Foodborne Pathogens, FAT TOM Kinetics and Thermal Danger Zones" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: HACCP Systems, Cooler Storage Hierarchy and Allergen Protocols" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Chemical Sanitation, Class K Suppression and Kitchen Safety" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / ServSafe Food Protection Manager level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Microbial Pathology: The FDA Big Six Pathogens and Toxin Mechanisms",
      order_index: 1,
      content: `### Foodborne Microbiology and Infectious Disease Pathways

Food safety management is rooted in clinical microbiology and epidemiology:

1. The FDA 'Big Six' Highly Contagious Pathogens:
   - Norovirus: The leading global cause of foodborne gastroenteritis; extremely low infectious dose (as few as 18 viral particles transmitted via infected food handlers).
   - Salmonella Typhi: Invasive bacterium causing typhoid fever.
   - Nontyphoidal Salmonella (NTS): Bacteria colonizing raw poultry, eggs, unpasteurized dairy, and produce.
   - Shigella spp.: Transmitted via fecal-oral contamination, contaminated water, and flies.
   - Shiga Toxin-Producing E. coli (STEC / O157:H7): Causes severe hemorrhagic colitis and hemolytic uremic syndrome (HUS).
   - Hepatitis A Virus: Causes infectious liver inflammation and jaundice.

2. Bacterial Infection vs Intoxication vs Toxin-Mediated Infection:
   - Foodborne Infection: Ingestion of live viable vegetative bacteria that colonize the gastrointestinal mucosa (Salmonella, Listeria).
   - Foodborne Intoxication: Ingestion of pre-formed chemical toxins produced by bacteria during improper holding (Staphylococcus aureus, Clostridium botulinum neurotoxin). Crucial Rule: Heat and cooking do NOT destroy pre-formed staphylococcal enterotoxins.
   - Toxin-Mediated Infection: Ingestion of bacteria that produce enterotoxins within human intestines (Clostridium perfringens).

3. Employee Health Exclusion Policies:
   - Mandatory exclusion from food premises for workers exhibiting: Vomiting, Diarrhea, Jaundice, or diagnosed Big Six infections (with mandatory health department notification).`
    },
    {
      track_id: track1Id,
      title: "The FAT TOM Framework and Bacterial Growth Kinetics",
      order_index: 2,
      content: `### The Biochemical Conditions Regulating Pathogen Proliferation

Bacterial populations in Time/Temperature Control for Safety (TCS) foods multiply exponentially under specific environmental parameters (FAT TOM):

1. The Six FAT TOM Environmental Variables:
   - Food (Nutrient Substrate): High-protein, high-carbohydrate matrices providing carbon and nitrogen (meat, poultry, dairy, cooked starches).
   - Acidity (pH Range): Pathogens thrive in neutral to slightly acidic pH between 4.6 and 7.5. Acidification below pH 4.6 (pickling, fermentation) halts pathogenic bacterial growth.
   - Temperature: Proliferation within the Temperature Danger Zone.
   - Time: Cumulative exposure time. Under optimal conditions, bacterial populations double every 20 minutes during exponential log phase.
   - Oxygen: Obligate Aerobes vs Facultative Anaerobes vs Obligate Anaerobes (e.g. Clostridium botulinum thriving in oxygen-depleted sous-vide pouches and vacuum-sealed environments).
   - Moisture (Water Activity - aw): Water activity measures unbound free water available for microbial metabolism (pure distilled water = 1.00). Pathogenic bacteria require aw > 0.85; drying, curing with salt, and candying with sugar bind water molecules below this metabolic threshold.`
    },
    {
      track_id: track1Id,
      title: "Temperature Danger Zone and Critical Two-Stage Cooling Kinetics",
      order_index: 3,
      content: `### Thermal Standards and the FDA Two-Stage Cooling Protocol

1. The Temperature Danger Zone (TDZ):
   - Defined by the FDA Food Code as 41 degrees F to 135 degrees F (5 degrees C to 57 degrees C).
   - Rapid Growth Zone: Bacteria multiply at maximum velocity between 70 degrees F and 125 degrees F (21 degrees C to 52 degrees C).

2. The Mandatory FDA Two-Stage Cooling Protocol:
   - Stage 1: Hot prepared foods must be cooled from 135 degrees F down to 70 degrees F within exactly 2 HOURS.
   - Stage 2: Food must be cooled from 70 degrees F down to 41 degrees F or below within an additional 4 HOURS (Maximum total cooling window: 6 hours).
   - If food fails to reach 70 degrees F within the initial 2-hour window, it must be reheated immediately to 165 degrees F or discarded.
   - Accelerated Cooling Methods: Ice-water baths with continuous stirring using sanitized hollow ice paddles, blast chillers, and dividing dense foods into shallow stainless steel pans (liquid depth < 2 inches).

3. Minimum Internal Cooking Temperatures (USDA / FDA Standards):
   - 165 degrees F (74 degrees C) Instantaneous: Poultry, stuffing containing meat, stuffed pasta, and reheated TCS leftovers.
   - 155 degrees F (68 degrees C) for 17 seconds: Ground beef, ground pork, and injected meats.
   - 145 degrees F (63 degrees C) for 15 seconds: Whole cuts of beef, pork, veal, lamb, and seafood.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The 7 Principles of HACCP (Hazard Analysis Critical Control Point)",
      order_index: 1,
      content: `### Systematic Food Safety Engineering: The 7 HACCP Principles

Hazard Analysis Critical Control Point (HACCP) is a systematic preventive framework developed by NASA and the FDA to identify and control biological, chemical, and physical food safety hazards:

1. Principle 1: Conduct a Hazard Analysis:
   - Identifying all potential biological (pathogens), chemical (cleaning toxins, allergens), and physical (glass, metal shavings) hazards across every preparation step from receiving to service.

2. Principle 2: Determine Critical Control Points (CCPs):
   - Identifying the specific operational step where control can be applied to prevent, eliminate, or reduce a safety hazard to an acceptable level (e.g. final cooking, rapid chilling).

3. Principle 3: Establish Critical Limits:
   - Setting clear, measurable boundary parameters (e.g. 'Cook chicken breast to minimum internal temperature of 165 degrees F for 15 seconds').

4. Principle 4: Establish Monitoring Procedures:
   - Continuous observation and measurement (e.g. inserting calibrated digital thermocouple probes into the thickest part of cooked proteins every batch).

5. Principle 5: Establish Corrective Actions:
   - Predetermined protocols executed when monitoring reveals a critical limit breach (e.g. 'If internal temp is 158 degrees F, continue cooking; if held below 135 degrees F for > 2 hours, discard product').

6. Principle 6: Establish Verification Procedures:
   - Verifying that the HACCP plan operates effectively (calibrating thermometers in ice slush at 32 degrees F daily; auditing HACCP logs weekly).

7. Principle 7: Establish Recordkeeping and Documentation:
   - Maintaining temperature logs, cooling logs, supplier invoices, and corrective action records for regulatory compliance.`
    },
    {
      track_id: track2Id,
      title: "Cross-Contamination Prevention and Walk-In Cooler Hierarchy",
      order_index: 2,
      content: `### Physical Barrier Control and Vertical Storage Architecture

1. Color-Coded Cutting Board Protocol:
   - Yellow: Raw Poultry.
   - Red: Raw Beef and Pork.
   - Blue: Raw Seafood and Fish.
   - Green: Fresh Produce and Vegetables.
   - Brown: Cooked and Roasted Meats.
   - White: Bakery and Dairy Products.
   - Purple: Dedicated Allergen-Free Preparation.

2. Handwashing Biomechanics:
   - Scrubbing hands, forearms, and under fingernails with warm water (minimum 100 degrees F / 38 degrees C) and antibacterial soap for a minimum of 20 seconds; drying with single-use paper towels.

3. Walk-In Cooler Vertical Storage Hierarchy:
   - Raw foods must be stored vertically inside commercial refrigerators based strictly on their minimum internal cooking temperatures to eliminate drip contamination:
     - Top Shelf: Ready-to-Eat (RTE) foods, prepared salads, cured charcuterie, cooked leftovers.
     - Shelf 2: Whole raw seafood, intact beef and pork steaks (145 degrees F / 63 degrees C).
     - Shelf 3: Whole raw cuts of beef and pork roasts.
     - Shelf 4: Raw ground meats and injected meats (155 degrees F / 68 degrees C).
     - Bottom Shelf: Raw poultry, whole chicken, ground turkey, and stuffed meats (165 degrees F / 74 degrees C).`
    },
    {
      track_id: track2Id,
      title: "Food Allergen Management: The Big 9 and Cross-Contact Protocols",
      order_index: 3,
      content: `### Allergen Immunology and Cross-Contact Protocols

1. The Big 9 Major Food Allergens (FALCPA / FASTER Act):
   - Milk, Eggs, Peanuts, Tree Nuts (walnuts, almonds, cashews), Fish, Crustacean Shellfish (shrimp, crab, lobster), Wheat, Soybeans, and Sesame.

2. Cross-Contact vs Cross-Contamination:
   - Cross-Contamination: Transfer of biological microorganisms between foods (can be eliminated by cooking heat).
   - Cross-Contact: Transfer of allergenic proteins from an allergen-containing food to an allergen-free food.
   - Critical Safety Truth: Cooking heat, deep frying, and sanitizing chemicals do NOT destroy food allergens. An allergenic protein survives 200 degrees C cooking.

3. Allergen-Safe Kitchen Protocols:
   - Designating dedicated purple allergen-free prep zones, purple cutting boards, and separate dedicated cookware.
   - Washing surfaces with hot soapy water (detergent physically lifts and removes protein molecules; chemical sanitizers alone do not eliminate allergenic proteins).`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Chemical Sanitation: Quats, Chlorine and the 3-Compartment Sink",
      order_index: 1,
      content: `### Chemical Sanitizer Dynamics and Manual Warewashing

1. Cleaning vs Sanitizing:
   - Cleaning: Removing visible soil, food debris, and lipid grease using hot water and chemical detergents.
   - Sanitizing: Applying chemical agents or thermal heat to reduce pathogenic microbial counts by 99.999% (a 5-log reduction) to safe public health levels.

2. Chemical Sanitizer Parameters and Testing:
   - Chlorine (Bleach): Concentration 50 to 99 PPM at water temperature 75 to 100 degrees F; contact time minimum 7 seconds. Corrosive to metal at high concentrations.
   - Quaternary Ammonium Compounds (Quats): Concentration 200 to 400 PPM at water temperature >= 75 degrees F; contact time minimum 30 seconds. Non-corrosive, highly stable.
   - Iodine: Concentration 12.5 to 25 PPM at water temperature 68 to 120 degrees F; contact time minimum 30 seconds.
   - Testing: Must verify active chemical concentrations using calibrated test strips throughout every shift.

3. The Three-Compartment Sink Protocol:
   - Sink 1 (Wash): Hot water at minimum 110 degrees F (43 degrees C) with commercial detergent.
   - Sink 2 (Rinse): Clean warm water to rinse away detergent film.
   - Sink 3 (Sanitize): Chemical sanitizer solution at calibrated PPM (or hot water at >= 171 degrees F for 30 seconds).
   - Air Drying: Items must air-dry completely on clean wire racks; drying with cloth towels causes immediate cross-contamination.`
    },
    {
      track_id: track3Id,
      title: "Commercial Kitchen Fire Protection: Class K and Hood Systems",
      order_index: 2,
      content: `### Fire Physics and Commercial Kitchen Suppression Architecture

Commercial kitchens operate high-temperature grease equipment presenting extreme fire risks:

1. Class K Fire Dynamics:
   - Class K fires involve high-temperature commercial cooking oils, animal fats, and vegetable shortenings in deep fryers and flat-top griddles.
   - Water Reaction Hazard: NEVER throw water on a grease fire. Water is denser than oil; it sinks beneath the burning oil and instantly vaporizes into steam, expanding 1,700 times its liquid volume, atomizing burning grease into a catastrophic fireball explosion.

2. Wet Chemical Suppression (Saponification):
   - Class K Wet Chemical Fire Extinguishers discharge an alkaline potassium acetate / potassium carbonate solution.
   - Saponification Reaction: The alkaline solution reacts chemically with hot fatty acids to create a thick, non-combustible soapy foam blanket over the burning fat.
   - Foam Blanket Action: Smothers the fire by blocking oxygen, traps boiling steam, and cools the lipid mass below its auto-ignition temperature.

3. Automatic Exhaust Hood Systems (Ansul Systems):
   - Heat-sensitive fusible links melt at set thermal thresholds, releasing pressurized wet chemical extinguishing agent through discharge nozzles into exhaust plenums and over fryers while automatically shutting off gas and electrical supply to the cooking line.`
    },
    {
      track_id: track3Id,
      title: "OSHA Kitchen Safety: Ergonomics, Burns, Cuts and Pest Control",
      order_index: 3,
      content: `### Occupational Workplace Safety and Integrated Pest Management

1. Slip, Trip and Fall Prevention:
   - Mandating ASTM-certified slip-resistant rubber-soled footwear with deep tread channels.
   - Installing raised rubber drainage floor mats at warewashing and cooking stations.
   - Immediate vocal communication and cleanup of spilled liquids.

2. Burn and Cut Prevention Protocols:
   - Dry Side Towels: Only completely dry cotton side towels may be used to handle hot pans (damp towels conduct steam instantly through fabric, producing severe second-degree steam burns).
   - Verbal Kitchen Warnings: Loudly calling 'Behind!', 'Hot behind!', and 'Corner!' when moving through the kitchen.
   - Cut Protection: Utilizing cut-resistant stainless steel mesh or Kevlar gloves when operating mandoline slicers and vertical meat slicers. Carrying knives pointed straight down with the sharp edge facing backward.

3. Integrated Pest Management (IPM):
   - Maintaining high-velocity air curtains above receiving loading docks to repel flying insects.
   - Sealing exterior door sweeps with zero light gaps.
   - Partnering with licensed Pest Control Operators (PCO) for routine inspection and documentation.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #38.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "According to the FDA Food Code, what temperature range defines the 'Temperature Danger Zone' (TDZ) where foodborne pathogens multiply rapidly?",
      options: [
        "0 to 32 degrees F",
        "41 degrees F to 135 degrees F (5 degrees C to 57 degrees C)",
        "150 to 200 degrees F",
        "212 to 300 degrees F"
      ],
      correct_option_index: 1,
      explanation: "The FDA Temperature Danger Zone is 41 degrees F to 135 degrees F (5 degrees C to 57 degrees C), within which TCS foods must not linger.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What minimum internal cooking temperature must whole poultry, ground turkey, and stuffed meats reach for food safety?",
      options: [
        "120 degrees F",
        "135 degrees F",
        "145 degrees F",
        "165 degrees F (74 degrees C) instantaneous"
      ],
      correct_option_index: 3,
      explanation: "Poultry and stuffed meats must reach a minimum internal temperature of 165 degrees F (74 degrees C) to ensure destruction of Salmonella and Campylobacter.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "Why should water NEVER be poured onto a burning commercial deep fryer or cooking oil fire?",
      options: [
        "Water sinks beneath hot oil and instantly vaporizes into steam, expanding 1,700 times and atomizing burning grease into a violent fireball explosion",
        "Water turns grease into ice",
        "Water makes the oil taste salty",
        "Water makes the kitchen too cold"
      ],
      correct_option_index: 0,
      explanation: "Water vaporizes violently beneath burning oil, creating a massive steam explosion that scatters flaming grease across the kitchen.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In the walk-in refrigerator vertical storage hierarchy, why must raw poultry ALWAYS be placed on the bottom shelf below all other raw meats and produce?",
      options: [
        "Because chicken is the heaviest meat",
        "Because poultry needs more air",
        "To prevent salmonella-laden juices from dripping down onto foods that have lower required cooking temperatures or ready-to-eat foods",
        "Because the bottom shelf is the coldest"
      ],
      correct_option_index: 2,
      explanation: "Raw poultry requires the highest cooking temp (165 degrees F); storing it on the bottom shelf prevents drip cross-contamination onto other foods.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "Why must cooks use only COMPLETELY DRY side towels when lifting hot cast iron pans or baking sheets from the oven?",
      options: [
        "Wet towels make pans slippery",
        "Moisture in a damp towel conducts heat rapidly into steam, penetrating through the fabric and causing severe instant steam burns to the hands",
        "Dry towels keep the food warm",
        "Wet towels ruin the towel fabric"
      ],
      correct_option_index: 1,
      explanation: "Water is an excellent conductor of thermal energy; damp towels instantly create scalding steam when touching hot cookware.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In the mandatory FDA Two-Stage Cooling Process for hot TCS foods, what is the required time and temperature benchmark for Stage 1?",
      options: [
        "Cool from 135 degrees F to 41 degrees F in 10 hours",
        "Cool from 100 degrees F to 32 degrees F in 1 hour",
        "Cool from 135 degrees F down to 70 degrees F within exactly 2 HOURS (and then from 70 to 41 degrees F in the remaining 4 hours)",
        "Cool directly in the freezer overnight"
      ],
      correct_option_index: 2,
      explanation: "Stage 1 requires cooling from 135 to 70 degrees F within 2 hours to pass rapidly through the peak microbial proliferation zone.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "What chemical reaction occurs when a Class K Wet Chemical fire extinguisher discharges its potassium solution onto burning commercial fryer oil?",
      options: [
        "Saponification: the alkaline solution chemically reacts with hot fatty acids to form a thick, soapy non-combustible foam blanket that smothers oxygen and cools the oil",
        "Combustion",
        "Fermentation",
        "Oxidation"
      ],
      correct_option_index: 0,
      explanation: "Saponification converts burning lipids into a soapy foam layer, extinguishing Class K grease fires by eliminating oxygen and cooling the fat.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "Why does cooking heat or chemical sanitizing fail to protect a guest with a severe food allergy from food that underwent 'Cross-Contact'?",
      options: [
        "Because allergies are caused by bacteria",
        "Because chemicals make allergens stronger",
        "Because allergens only react to cold water",
        "Food allergens are proteins, not living microorganisms; allergenic protein molecules are not destroyed by cooking heat, deep frying, or chemical sanitizers"
      ],
      correct_option_index: 3,
      explanation: "Allergens are heat-stable protein molecules; high heat and sanitizers cannot denature or neutralize allergenic proteins once cross-contact occurs.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In manual dishwashing in a 3-compartment sink, what is the mandatory minimum water temperature required for the Sink 1 (Wash) basin?",
      options: [
        "70 degrees F",
        "Minimum 110 degrees F (43 degrees C) with commercial detergent",
        "180 degrees F",
        "50 degrees F"
      ],
      correct_option_index: 1,
      explanation: "Sink 1 (Wash) must maintain hot water at minimum 110 degrees F (43 degrees C) to effectively dissolve food grease and activate detergents.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What is the critical biological distinction between a foodborne 'Infection' (like Salmonella) and a foodborne 'Intoxication' (like Staphylococcus aureus)?",
      options: [
        "Infections only affect adults",
        "Intoxications only occur from alcohol",
        "Infection results from ingesting live bacteria that multiply in the gut; Intoxication results from ingesting pre-formed toxins produced in the food, which are NOT destroyed by reheating",
        "There is zero difference"
      ],
      correct_option_index: 2,
      explanation: "Intoxication is caused by ingesting pre-formed heat-stable toxins; cooking food kills the bacteria but leaves toxic compounds active.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In HACCP food safety systems, what is a 'Critical Control Point' (CCP)?",
      options: [
        "A point, step, or procedure in a food process where control can be applied to prevent, eliminate, or reduce a food safety hazard to an acceptable level",
        "The place where the manager counts cash",
        "The kitchen back door",
        "The time when the restaurant closes"
      ],
      correct_option_index: 0,
      explanation: "A CCP is a specific step (e.g. thermal cooking or rapid chilling) where essential control can be applied to eliminate or minimize a food safety hazard.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In the FAT TOM framework for bacterial proliferation, what is 'Water Activity' (aw) and what is the minimum threshold required for pathogenic bacterial growth?",
      options: [
        "The amount of tap water used in soup (minimum 5 gallons)",
        "The speed of running water in sinks",
        "The humidity in the dining room",
        "The measure of unbound, free water available for microbial metabolism; pathogenic bacteria require an aw greater than 0.85"
      ],
      correct_option_index: 3,
      explanation: "Water activity (aw) measures unbound free moisture; reducing aw below 0.85 through dehydration or curing with salt/sugar inhibits bacterial proliferation.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "Which of the following represents the complete list of 'The Big Six' highly contagious foodborne pathogens recognized by the FDA?",
      options: [
        "Listeria, Yeast, Mold, Influenza, Common Cold, Anthrax",
        "Norovirus, Salmonella Typhi, Nontyphoidal Salmonella, Shigella spp., Shiga toxin-producing E. coli (STEC), and Hepatitis A Virus",
        "Staphylococcus, Botulism, Rabies, Tetanus, Malaria, Cholera",
        "Campylobacter, Bacillus, Candida, COVID-19, Strep, Polio"
      ],
      correct_option_index: 1,
      explanation: "The FDA Big Six pathogens are Norovirus, Salmonella Typhi, Nontyphoidal Salmonella, Shigella, STEC (E. coli), and Hepatitis A.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In manual warewashing sanitation, why is drying washed and sanitized dishes with cloth kitchen towels strictly prohibited by health regulations?",
      options: [
        "Because towels make too much noise",
        "Because towels cost too much money",
        "Cloth towels harbor bacteria and immediately transfer microorganisms back onto sanitized surfaces; items must air-dry completely on clean wire racks",
        "Because dishes must stay wet in storage"
      ],
      correct_option_index: 2,
      explanation: "Towel drying causes instant cross-contamination by spreading bacteria across clean dishes; ambient air drying is mandatory.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "What allergen was officially added to the United States Major Food Allergens list under the FASTER Act of 2021, expanding the list from the Big 8 to the Big 9?",
      options: [
        "Sesame",
        "Strawberries",
        "Garlic",
        "Mustard"
      ],
      correct_option_index: 0,
      explanation: "The FASTER Act of 2021 declared Sesame the 9th major food allergen in the United States, effective January 1, 2023.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #38.");
  console.log("Skill #38 update completed successfully!");
}

run();
