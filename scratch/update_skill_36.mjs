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

const skillId = "02126002-558a-40b5-91e5-8b535f8ca401";

async function run() {
  console.log("Updating Skill #36: Cooking Techniques (9 steps across 3 tracks)...");

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

  // If there are more than 3 tracks, delete excess tracks and their steps
  if (tracks.length > 3) {
    const excessTracks = tracks.slice(3);
    for (const t of excessTracks) {
      await supabase.from("steps").delete().eq("track_id", t.id);
      await supabase.from("tracks").delete().eq("id", t.id);
    }
    tracks = tracks.slice(0, 3);
  }

  // Ensure exactly 3 tracks exist
  while (tracks.length < 3) {
    const { data: newTrack } = await supabase
      .from("tracks")
      .insert({
        skill_id: skillId,
        title: `Track ${tracks.length + 1}: Cooking Techniques`,
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
  await supabase.from("tracks").update({ title: "Track 1: Thermodynamics of Heat Transfer, Searing and Maillard Kinetics" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Moist-Heat Methods, Collagen Hydrolysis and Sous-Vide Physics" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Classical Mother Sauces, Roux Chemistry and Emulsion Science" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Master Chef level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Thermodynamics of Heat Transfer: Conduction, Convection and Radiation",
      order_index: 1,
      content: `### Thermal Physics of Culinary Transformations

Cooking is the controlled application of thermal energy to induce chemical and structural changes in food:

1. The Three Fundamental Heat Transfer Modes:
   - Conduction (Direct Contact): Kinetic vibrational energy transfer across physical surfaces (e.g. pan to steak). Material thermal conductivity dictates heat flux (Copper 385 W/m-K > Aluminum 205 > Cast Iron 52 > Stainless Steel 16).
   - Convection (Fluid / Gas Circulation): Movement of liquids or heated air across food. Forced convection ovens strip away the stagnant insulating cold boundary layer of air, cooking foods 25% faster at 20 degrees C lower temperatures.
   - Radiation (Electromagnetic Waves): Infrared photons emitted from glowing charcoal, salamanders, or ceramic broilers directly heating food surfaces without requiring a physical medium.

2. Thermal Diffusivity and Phase Changes of Water:
   - Specific Heat Capacity of Water: High specific heat (4.184 J/g-K) requires massive thermal energy to heat.
   - Latent Heat of Evaporative Vaporization (2,260 kJ/kg): Evaporating surface moisture creates cooling stalls during roasting and smoking.`
    },
    {
      track_id: track1Id,
      title: "Dry-Heat Methods: Searing, Roasting, Grilling and Maillard Kinetics",
      order_index: 2,
      content: `### The Chemical Kinetics of Searing and Caramelization

1. The Maillard Reaction Complex (Louis-Camille Maillard, 1912):
   - A non-enzymatic reaction between reducing sugars and free amino acid amine groups occurring rapidly between 140 and 165 degrees C (284 to 330 degrees F).
   - Generates hundreds of volatile heterocyclic aromatic compounds (pyrazines, furans, oxazoles, and thiophenes) responsible for savory, roasted, and nutty flavors.

2. Overcoming the Moisture Barrier in Searing:
   - Surface moisture caps surface temperatures at 100 degrees C (the boiling point of water) until completely vaporized.
   - Wet steaks boil rather than sear in the pan. Professional dry-heat execution requires patting surfaces dry with towels, dry-brining overnight in refrigeration to dehydrate the surface, and heating heavy cast iron or carbon steel above 200 degrees C.

3. Caramelization vs Maillard Browning:
   - Caramelization: Pure thermal pyrolysis of carbohydrates and sugars occurring above 160 to 180 degrees C (producing sweet, nutty, and butterscotch aromas).
   - Sautéing (high heat, minimal fat, rapid tossing) vs Pan-Roasting (searing on stove, finishing in oven).`
    },
    {
      track_id: track1Id,
      title: "Deep Frying Thermodynamics, Oil Degradation and Smoke Points",
      order_index: 3,
      content: `### Physics of Deep Frying and Lipid Chemistry

1. Deep Frying Thermodynamic Mechanics:
   - When submerged in hot oil (175 to 190 degrees C / 350 to 375 degrees F), surface moisture instantly vaporizes into steam.
   - The outward kinetic pressure of escaping steam creates a physical barrier preventing oil from penetrating the food interior while rapidly dehydrating the crust into a crisp shell.
   - If oil temperature drops below 160 degrees C due to pan overloading, steam pressure collapses and oil saturates the food, resulting in greasy, soggy textures.

2. Smoke Points of Culinary Lipids:
   - Refined Avocado Oil (270 degrees C) > Peanut / Canola Oil (230 degrees C) > Extra Virgin Olive Oil (190 degrees C) > Unclarified Whole Butter (150 degrees C).

3. Thermal Lipid Degradation:
   - Repeated frying breaks triglycerides down into free fatty acids, aldehydes, and polymers (darkening the oil, lowering smoke point, and imparting bitter off-flavors).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Moist-Heat Methods: Poaching, Simmering, Boiling and Steaming",
      order_index: 1,
      content: `### Precision Liquid Cooking and Steam Enthalpy

1. The Water Temperature Hierarchy:
   - Sub-Simmer Poaching (Court-Bouillon): 71 to 82 degrees C (160 to 180 degrees F). Gentle convection without turbulence; prevents protein stringing in delicate fish, seafood, and eggs.
   - Simmering: 85 to 96 degrees C (185 to 205 degrees F). Gentle surface bubbling ideal for extracting gelatin in stocks and gently tenderizing grains.
   - Rolling Boil: 100 degrees C (212 degrees F at sea level). Violent agitation for cooking dried pasta and rapid green vegetable blanching.

2. Steaming Enthalpy Transfer:
   - Steam at 100 degrees C carries massive latent heat energy (2,260 kJ/kg).
   - When steam contacts colder food surfaces, it condenses back into liquid water, transferring enormous thermal energy instantaneously without submerging food, preventing water-soluble vitamins and minerals from leaching away.`
    },
    {
      track_id: track2Id,
      title: "Collagen Hydrolysis in Braising and Stewing: Connective Tissue Dynamics",
      order_index: 2,
      content: `### Connective Tissue Biochemistry in Braising and Stewing

1. Muscle Architecture in Working Cuts (Shank, Chuck, Short Ribs, Oxtail):
   - Muscle fibers (actin and myosin) are bound together by a rigid matrix of insoluble triple-helix collagen connective tissue.
   - High dry-heat rapidly contracts actin/myosin fibers, squeezing out water and rendering tough cuts leathery and dry.

2. Collagen-to-Gelatin Hydrolysis:
   - Sustaining moist heat between 71 and 85 degrees C (160 to 185 degrees F) over 2 to 4 hours hydrolyzes rigid, insoluble collagen into soft, water-soluble gelatin.
   - Gelatin coats individual muscle fibers in a rich, velvety lubricating fluid, transforming tough cuts into fork-tender, succulent meat.

3. The Classical Braising Method:
   - Step 1: High-heat searing of meat to develop Maillard crust and fond in a heavy Dutch oven.
   - Step 2: Sautéing aromatic mirepoix and tomato paste (pincé).
   - Step 3: Deglazing fond with wine or acidic stock.
   - Step 4: Submerging meat one-third in aromatic liquid; covering tightly and braising gently at 150 degrees C (300 degrees F) oven temperature until collagen fully dissolves.`
    },
    {
      track_id: track2Id,
      title: "Sous-Vide Thermodynamics, Equilibrium Cooking and Pasteurization",
      order_index: 3,
      content: `### Precision Thermal Baths and Log-Reduction Pasteurization

1. Immersion Circulator Precision:
   - Circulates water at exact temperatures calibrated to +/- 0.05 degrees C.
   - Eliminates the steep thermal temperature gradients inherent in conventional ovens, cooking vacuum-sealed proteins edge-to-edge to the exact desired doneness (e.g. 54 degrees C medium-rare beef).

2. Equilibrium Cooking vs Delta-T Cooking:
   - Equilibrium Cooking: Setting the water bath to the exact desired core temperature; food cannot overcook regardless of holding time.
   - Delta-T Cooking: Setting the bath higher than target to accelerate heat transfer, requiring removal at exact core probe temps.

3. Food Safety and Pasteurization Curves:
   - Pathogen Destruction (Salmonella, Listeria, E. coli) is a function of BOTH temperature and time:
     - 74 degrees C requires instantaneous exposure (< 1 second).
     - 60 degrees C achieves equivalent 7D log10 lethal pathogen reduction in 35 minutes.
   - Anaerobic Risk Mitigation: Rapid ice-bath chilling below 3 degrees C before cold storage to prevent Clostridium botulinum spore germination.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "The Five Classical French Mother Sauces (Grandes Sauces)",
      order_index: 1,
      content: `### Auguste Escoffier's Classical Sauce Architecture

All classical French sauces derive from the Five Mother Sauces (Grandes Sauces):

1. Béchamel:
   - White roux (equal parts clarified butter and flour cooked pale) + warm whole milk, seasoned with onion piquet, white pepper, and nutmeg. Derivative: Sauce Mornay (Gruyère/Parmesan).

2. Velouté:
   - Blond roux + white stock (veal, chicken, or fish fumet). Derivatives: Sauce Suprême (chicken velouté + heavy cream), Sauce Allemande (veal velouté + egg yolk liaison).

3. Espagnole (Brown Sauce):
   - Brown roux + rich roasted brown veal stock, caramelized mirepoix, and tomato paste. Simmered and reduced 50% with equal parts brown stock into Demi-Glace. Derivative: Sauce Bordelaise (red wine, shallots, bone marrow).

4. Sauce Tomate:
   - Rendered salt pork, mirepoix, tomatoes, garlic, and white veal stock simmered gently and passed through a food mill.

5. Hollandaise:
   - Warm emulsion of egg yolks and warm clarified butter acidified with lemon juice or white wine reduction. Derivative: Sauce Béarnaise (tarragon, shallots, chervil).`
    },
    {
      track_id: track3Id,
      title: "Starch Gelatinization, Roux Chemistry and Reduction",
      order_index: 2,
      content: `### Macromolecular Starch Chemistry and Thickening Mechanisms

1. Starch Gelatinization Dynamics:
   - Starch granules composed of linear amylose and branched amylopectin absorb water and swell between 60 and 85 degrees C.
   - At peak gelatinization, granules burst, releasing polymer chains that form an entangled viscoelastic network trapping free water.

2. Roux Chemistry and Stages:
   - Cooking equal parts by weight of fat (butter) and flour coats starch granules in lipid, preventing clumping when liquids are introduced:
     - White Roux (3 minutes): Pale color, maximum thickening power.
     - Blond Roux (6 minutes): Light golden, subtle nutty aroma.
     - Brown Roux (15 minutes): Deep brown, rich toasted aroma.
     - Dark Cajun Roux (30 minutes): Dark chocolate color; starch chains are extensively broken down by heat (dextrinization), reducing thickening power by 50% while delivering intense roasted flavor.

3. Alternative Thickening Systems:
   - Beurre Manié (raw flour kneaded into cold butter whisked into simmering liquids).
   - Starch Slurries (Cornstarch / Arrowroot dispersed in cold water providing immediate high-gloss thickening).`
    },
    {
      track_id: track3Id,
      title: "Colloid Science and Emulsions: Hollandaise, Mayonnaise and Mounts",
      order_index: 3,
      content: `### Colloid Physics of Culinary Emulsions

1. Emulsion Architecture (Dispersed vs Continuous Phase):
   - Emulsions are colloidal dispersions of two immiscible liquids (e.g. oil droplets suspended in water).
   - Oil-in-Water (O/W) Emulsions: Hollandaise, Béarnaise, Mayonnaise, Vinaigrettes.

2. The Role of Natural Emulsifiers:
   - Egg yolk lecithin (an amphiphilic phospholipid with a hydrophilic water-loving head and a lipophilic fat-loving tail) forms a stabilizing electrostatic membrane around dispersed lipid droplets, preventing them from coalescing into a greasy layer.

3. Fixing a Broken Emulsion:
   - Whisking one tablespoon of warm water or an extra egg yolk vigorously in a clean warm bowl, then slowly streaming the broken emulsion back in drop-by-drop under high mechanical shear.

4. Monter au Beurre:
   - Whisking cold cubes of solid butter into a hot reduced pan sauce off the direct flame.
   - The milk solids and natural water in cold butter form a silky, glossy temporary emulsion, thickening and enriching the sauce without breaking into clear melted oil.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #36.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "What chemical reaction between reducing sugars and free amino acids occurring between 140 and 165 degrees C (284-330 degrees F) produces the savory browned crust on seared steaks and roasted meats?",
      options: [
        "Photosynthesis",
        "The Maillard Reaction",
        "Cellular Respiration",
        "Fermentation"
      ],
      correct_option_index: 1,
      explanation: "The Maillard reaction is the chemical interaction of amino acids and reducing sugars under high heat, creating hundreds of complex roasted flavor compounds.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In classical French culinary foundations, which of the following is NOT one of Auguste Escoffier's Five Mother Sauces (Grandes Sauces)?",
      options: [
        "Béchamel",
        "Velouté",
        "Espagnole",
        "Chimichurri"
      ],
      correct_option_index: 3,
      explanation: "The Five French Mother Sauces are Béchamel, Velouté, Espagnole, Sauce Tomate, and Hollandaise. Chimichurri is a fresh South American herb condiment.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What mode of heat transfer involves thermal energy passing through direct physical contact between a hot cooking surface (such as a cast iron pan) and food?",
      options: [
        "Conduction",
        "Radiation",
        "Sublimation",
        "Evaporation"
      ],
      correct_option_index: 0,
      explanation: "Conduction is the transfer of heat between substances in direct physical contact through microscopic kinetic molecular collisions.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What is a 'Roux' in classical sauce making?",
      options: [
        "A mixture of eggs and vinegar",
        "A broth made from fish bones",
        "A cooked mixture of equal parts by weight of fat (such as butter) and flour used as a thickening agent",
        "A sweet sugar syrup"
      ],
      correct_option_index: 2,
      explanation: "Roux is equal parts by weight of fat and flour cooked together, coating starch granules in fat to thicken sauces smoothly without lumps.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "Why does patting meat completely dry with paper towels prior to searing dramatically improve crust development in a hot skillet?",
      options: [
        "Dry meat weighs less so it cooks faster",
        "Surface moisture caps the pan temperature at 100 degrees C (boiling point) until evaporated; dry meat allows immediate contact with 150+ degree temperatures required for Maillard browning",
        "Towels add salt to the meat",
        "Wet meat explodes in pans"
      ],
      correct_option_index: 1,
      explanation: "Water takes enormous energy to evaporate (latent heat), capping temperatures at 100 degrees C and steaming the meat instead of searing it.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In slow cooking tough meat cuts (like beef shank or chuck roast), what biochemical transformation converts rigid connective tissue into soft, succulent gelatin?",
      options: [
        "Protein coagulation",
        "Sugar caramelization",
        "Collagen Hydrolysis: sustained gentle moist heat (71-85 degrees C) breaks insoluble triple-helix collagen fibers down into water-soluble gelatin",
        "Starch dextrinization"
      ],
      correct_option_index: 2,
      explanation: "Collagen hydrolysis uncoils rigid triple-helix collagen protein fibers into succulent, water-soluble gelatin during slow braising.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In classical sauce making, what French term describes the finishing technique of swirling cold cubes of solid butter into a hot sauce off the heat to create a glossy, temporary emulsion?",
      options: [
        "Monter au Beurre",
        "Mise en Place",
        "Sous Vide",
        "Deglazing"
      ],
      correct_option_index: 0,
      explanation: "Monter au beurre is the technique of whisking cold butter into hot sauces off the heat, forming a silky, glossy emulsion.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What natural emulsifier in egg yolks stabilizes Hollandaise and Mayonnaise by binding both water molecules and dispersed oil droplets?",
      options: [
        "Gluten",
        "Pectin",
        "Casein",
        "Lecithin (an amphiphilic phospholipid)"
      ],
      correct_option_index: 3,
      explanation: "Lecithin is an amphiphilic phospholipid in egg yolks containing both hydrophilic (water-loving) and lipophilic (fat-loving) ends that stabilize emulsions.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "How does deep frying in oil at 180 degrees C (350 degrees F) cook food with minimal internal grease absorption when executed properly?",
      options: [
        "The oil freezes the food instantly",
        "Violent surface steam evaporation creates an outward kinetic pressure barrier that prevents oil from penetrating the food interior while crisping the crust",
        "Hot oil destroys all fat molecules",
        "Food becomes radioactive and repels oil"
      ],
      correct_option_index: 1,
      explanation: "Outward steam pressure from boiling surface water acts as a protective shield pushing oil away from the food interior during frying.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In the classical roux hierarchy, why does a Dark Brown (Cajun) Roux have significantly LESS thickening power than a White or Pale Roux?",
      options: [
        "Dark roux has less fat",
        "Dark roux is made from cornstarch",
        "Prolonged high-heat cooking breaks down starch polymer chains into short dextrins (dextrinization), reducing water-trapping capability by up to 50%",
        "Dark roux evaporates all flour"
      ],
      correct_option_index: 2,
      explanation: "Extensive toasting breaks long starch chains down into smaller dextrins (dextrinization), trading thickening power for deep, complex roasted flavors.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In food safety and sous-vide cooking, how does pathogen pasteurization (e.g. 7D log-reduction of Salmonella) operate across varying temperatures?",
      options: [
        "Pasteurization is a function of BOTH temperature and time: high temperatures pasteurize in seconds (74 degrees C in < 1s), whereas lower temperatures achieve equivalent pathogen destruction over longer holding times (60 degrees C in 35 minutes)",
        "Pasteurization only occurs at 100 degrees C boiling",
        "Low temperatures can never kill bacteria regardless of holding time",
        "Bacteria are immune to heat in vacuum bags"
      ],
      correct_option_index: 0,
      explanation: "Lethality curves show that holding proteins at 60 degrees C for 35 minutes achieves the same 7D Salmonella destruction as 74 degrees C for 1 second.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "If a warm Hollandaise or Béarnaise sauce breaks into a curdled mixture of clear melted butterfat and separated eggs, how is the emulsion scientifically restored?",
      options: [
        "By throwing it in the freezer",
        "By boiling it on high heat for 10 minutes",
        "By adding cold olive oil",
        "By whisking 1 tablespoon of warm water or a fresh egg yolk vigorously in a clean warm bowl, then slowly streaming the broken sauce back in drop-by-drop under high mechanical shear"
      ],
      correct_option_index: 3,
      explanation: "Starting with a tiny amount of continuous water phase (or fresh lecithin yolk) and slowly shearing the broken oil back in re-establishes the emulsion droplet matrix.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In culinary thermodynamics, why does forced convection baking cook foods approximately 25% faster than standard radiant oven baking at identical temperature settings?",
      options: [
        "Convection ovens use microwave radiation",
        "Forced circulating air continuously strips away the stagnant, insulating cool boundary layer of air surrounding food, increasing thermal convection transfer rates",
        "Convection ovens change the air pressure to zero",
        "Convection fans heat the metal walls only"
      ],
      correct_option_index: 1,
      explanation: "Convection fans disrupt the cold thermal boundary layer hugging food surfaces, accelerating convection heat transfer dramatically.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In the classical braising technique, why is the meat submerged only ONE-THIRD to ONE-HALF in liquid rather than fully submerged like a boil?",
      options: [
        "To save stock",
        "Because pots are too small",
        "The submerged portion undergoes gentle collagen hydrolysis via liquid conduction, while the exposed upper portion browns and concentrates via moist radiant steam in the closed pot",
        "To keep the bone dry"
      ],
      correct_option_index: 2,
      explanation: "Partial submersion combines liquid conduction (melting collagen) with hot enclosed steam convection, concentrating flavors and glazing the meat top.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "What culinary liquid cooking method operates in the 71 to 82 degrees C (160 to 180 degrees F) range to cook delicate proteins (like fish or eggs) without agitation or stringiness?",
      options: [
        "Sub-Simmer Poaching (Court-Bouillon)",
        "Rolling Boil",
        "Deep Frying",
        "Pressure Cooking"
      ],
      correct_option_index: 0,
      explanation: "Sub-simmer poaching (71-82 degrees C) cooks delicate proteins gently without boiling turbulence that shreds delicate fish or toughens egg proteins.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #36.");
  console.log("Skill #36 update completed successfully!");
}

run();
