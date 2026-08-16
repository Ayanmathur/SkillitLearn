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

const skillId = "d659aa1d-d5a4-45cc-a4df-9bb9441682f2";

async function run() {
  console.log("Updating Skill #35: Plating & Presentation (9 steps across 3 tracks)...");

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
        title: `Track ${tracks.length + 1}: Plating & Presentation`,
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
  await supabase.from("tracks").update({ title: "Track 1: Visual Design Theory, Composition and Plate Geometry" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Sauce Dynamics, Modernist Fluids and Culinary Textures" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Dishware Selection, Service Thermodynamics and Pass Choreography" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Master Chef level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Visual Hierarchy: Negative Space, Focal Points and the Rule of Thirds",
      order_index: 1,
      content: `### Visual Design Principles in Fine Dining Culinary Composition

The human brain processes visual culinary aesthetics before olfactory or gustatory receptors engage:

1. Visual Anchors and Focal Points:
   - Every plate composition requires a clear focal point (the hero ingredient, such as a seared dry-aged duck breast or roasted turbot fillet) commanding immediate eye focus.
   - Secondary elements (purees, glazed root vegetables, crisp tuiles) are arranged hierarchically to guide the guest's eye across the plate.

2. The Power of Negative Space (White Space):
   - Leaving 30% to 40% of the plate canvas completely unadorned.
   - Negative space prevents visual crowding, isolates colors, and frames the food with fine-dining elegance.

3. The Rule of Thirds and Golden Ratio:
   - Dividing the plate into an imaginary 3x3 grid. Positioning key focal points at grid line intersections creates dynamic visual tension compared to static centered placement.

4. The Rule of Odds:
   - Grouping garnishes and components in odd numbers (3, 5, or 7 seared scallops or puree droplets). The human visual cortex finds odd groupings more natural and visually engaging than symmetric pairs.`
    },
    {
      track_id: track1Id,
      title: "Chromatic Harmony: Color Theory, Natural Pigments and Contrast",
      order_index: 2,
      content: `### Color Theory and Cellular Plant Pigments in Plating

1. Color Harmony Paradigms:
   - Complementary Contrast: Pairing opposing hues on the color wheel (e.g. bright emerald herb oil against vibrant orange butternut squash puree, or ruby beet reductions against golden pan-seared scallops).
   - Analogous Warmth: Using neighboring warm tones (amber caramelized shallots, golden chanterelles, rich brown demi-glace).
   - Monochromatic Elegance: Modern minimalist plating utilizing varying textures of a single monochrome hue (e.g. cauliflower silk, shaved white asparagus, and poached cod).

2. Biochemical Preservation of Natural Plant Pigments:
   - Chlorophyll (Vibrant Greens): Highly heat-sensitive. Prolonged cooking releases plant acids, displacing magnesium from chlorophyll to form dull brown pheophytin. Preserved via rapid boiling in salted water followed by immediate ice-water shock.
   - Anthocyanins (Reds, Purples, Blues): Flavonoid pigments found in red cabbage and berries; require acidic conditions (pH < 4) to maintain bright red brilliance.
   - Carotenoids (Yellows, Oranges): Heat-stable, fat-soluble pigments in carrots and squashes.`
    },
    {
      track_id: track1Id,
      title: "Plating Geometries: Circular, Linear, Landscape and Height",
      order_index: 3,
      content: `### Structural Geometry and Compositional Layouts

Plating arrangements establish architectural flow on the plate:

1. The Four Foundational Plating Styles:
   - Classical Architectural Stacking: Vertical layering of starch base, vegetable garnish, and rested protein angled across the top, crowned with delicate micro-greens. Creates dramatic height.
   - Contemporary Landscape (Free-Form): An organic, flowing trail of purees, roasted vegetables, and proteins meandering across the plate canvas like a natural landscape.
   - Linear Alignment: Clean, parallel or staggered lines along rectangular or oblong plates, popular in modern Japanese kaiseki and tasting menus.
   - Concentric Circular Wreath: Encircling purees, emulsions, and grains around the inner rim of wide-brim coupe bowls, leaving the center clear for tableside pouring.

2. Balance and Harmony:
   - Ensuring the physical arrangement allows the diner to capture all component flavor notes on a single fork without requiring awkward deconstruction.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Hydrocolloids and Modernist Fluid Gels: Agar and Xanthan",
      order_index: 1,
      content: `### Modernist Hydrocolloid Chemistry and Fluid Gel Physics

Traditional purees weep liquid onto plates over time; modernist culinary physics eliminates syneresis through hydrocolloid engineering:

1. Fluid Gel Physics (Modernist Cuisine):
   - Agar-Agar Thermal Hysteresis: Pureed liquids (e.g. yuzu juice, beetroot reduction, herb coulis) are set with 1% agar-agar and chilled into a solid brittle gel.
   - High-Shear Blending: The set gel is blended in a high-speed blender (Vitamix) at maximum shear. The mechanical shear fractures the macroscopic agar matrix into microscopic gel particles suspended in liquid.
   - Shear-Thinning Properties: The resulting fluid gel flows easily through fine squeeze bottle tips under pressure, but instantly re-sets upon hitting the plate, holding sharp dimensional droplets and architectural ribbons without weeping a single drop of water.

2. Xanthan Gum Stabilization:
   - Using 0.1% to 0.2% xanthan gum cold-dispersed into purees to provide pseudoplastic viscosity, preventing separation and creating velvety mouthfeel.

3. Tamis Sieve Refining:
   - Passing purees through drum-style stainless steel tamis sieves to remove microscopic fibers, followed by cold butter emulsification for mirror gloss.`
    },
    {
      track_id: track2Id,
      title: "Precision Sauce Application: Quenelles, Drops and Split Oils",
      order_index: 2,
      content: `### Saucier Execution Techniques and Kinetic Plating

1. The Classical Quenelle (Rocher):
   - Single-Spoon Technique: Using a deep culinary spoon dipped in warm water, scooping velvety ice creams, mousses, ganaches, or tartares against the container side in a continuous arc, forming a seamless 3-sided oval egg shape with sharp, symmetrical ridges.

2. Kinetic Sauce Application Methods:
   - Squeeze Bottle Droplet Arrays: Calibrated droplets of varying diameters arranged in descending geometric sequences.
   - Offset Spatula / Saucier Spoon Swoosh: Placing a generous dollop of velvety puree and dragging the back of a warm spoon in a single smooth, confident stroke to create a teardrop tail.
   - Silicone Brush Sweeps: Creating textured paint-like brush strokes across slate or ceramic surfaces.

3. Herbaceous Split Oils:
   - Pureeing blanched chlorophyll herbs (parsley, chives, tarragon) with neutral grape seed oil at 60 degrees C, followed by rapid fine mesh and coffee filter straining.
   - Intentionally breaking drops of bright emerald oil into acidic dashi, buttermilk, or clarified broths to create shimmering chromatic beads.`
    },
    {
      track_id: track2Id,
      title: "Textural Architecture: Crisps, Coral Tuiles and Siphon Foams",
      order_index: 3,
      content: `### Multi-Sensory Textural Contrast and Edible Garnishes

Refined culinary creations must balance crisp, creamy, chewy, and airy textures:

1. Modernist Coral Tuiles (Lace Tuiles):
   - Emulsion formulation (80g water, 30g oil, 10g flour, natural colorant) poured directly into a smoking dry non-stick skillet.
   - The rapid steam evaporation creates an intricate, delicate crispy web lace disc used to add crisp structural height.

2. Savory Crumbles, Soils and Powders:
   - Dehydrated black olive soil, toasted panko-herb crumbles, and tapioca maltodextrin fat-powders (transforming high-fat oils into delicate powders that melt back to liquid on the tongue).

3. Siphon Espumas and Lecithin Airs:
   - Culinary Siphons (iSi Chargers with N2O): Aerating warm starch-rich purees or gelatin-based foams into warm, velvety espumas.
   - Soy Lecithin Airs: Adding 0.5% soy lecithin to aromatic liquids (citrus juice, truffle broth) and frothing with an immersion blender held half-submerged, capturing delicate aromatic clouds that float on proteins without adding heavy fat.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Dishware Selection: Materials, Glazes and Color Canvases",
      order_index: 1,
      content: `### Dishware Material Science and Ceramic Canvas Design

The plate is the physical canvas framing the culinary creation:

1. Ceramic Materials and Surface Finishes:
   - High-Fired Limoges Porcelain: Non-porous, brilliant white canvas providing maximum color contrast and timeless fine-dining refinement.
   - Hand-Thrown Stoneware & Terracotta: Organic tactile textures, earth tones, and wabi-sabi imperfections popular in farm-to-table dining.
   - Matte vs Gloss Glazes: Matte black or charcoal basalt surfaces absorb light, making bright seafood and vibrant emerald herb oils stand out dramatically; gloss glazes reflect light, highlighting glistening sauces.

2. Vessel Shapes and Functional Geometries:
   - Wide-Brim Coupe Bowls: Deep center well containing sauces and broths while wide sloping rims draw focus inward.
   - Rimless Slate and Flat Discs: Maximizes negative space canvas for free-form landscape plating.`
    },
    {
      track_id: track3Id,
      title: "Thermal Management: Hot vs Cold Plate Conditioning and Cloches",
      order_index: 2,
      content: `### Thermodynamics of Service and Tableside Presentations

A beautifully plated dish is a failure if it arrives lukewarm to the guest:

1. Thermal Conditioning Protocols:
   - Hot Food on Hot Plates: Ceramic plates for hot entrees must be pre-heated to 55 to 65 degrees C (130 to 150 degrees F) in plate warming cabinets. Prevents cold ceramic from pulling heat out of rested proteins and congealing butter-based sauces during dining room transit.
   - Cold Food on Chilled Plates: Dishware for carpaccios, tartares, crudos, and chilled soups must be chilled in walk-in refrigeration to 0 to 4 degrees C (32 to 39 degrees F) to preserve raw fish cellular firmness and fat stability.

2. Tableside Saucier Service:
   - Serving delicate broths, consommes, and veloutes in miniature copper saucepans or ceramic jugs poured tableside in front of the guest, preventing crispy garnishes from becoming soggy in transit.
   - Glass Cloche Infusions: Capturing scented applewood or rosemary smoke under glass cloches lifted at the table for theatrical olfactory aroma release.`
    },
    {
      track_id: track3Id,
      title: "Pass-Line Choreography, Expeditor Role and Speed Execution",
      order_index: 3,
      content: `### Expeditor Station Execution and Pass-Line Synchronization

1. The Expeditor (Aboyeur / Expo) Authority:
   - The nerve center connecting the hot kitchen line to the dining room floor.
   - Coordinates multi-course timing, calls order tickets, checks plate temperatures, and verifies table order completeness.

2. Assembly Line Plating Choreography:
   - SRE-Grade Pass Synchronization: Stations plate components in rapid sequential rhythm:
     - Second 0: Hot plate pulled from warmer.
     - Second 5: Starch puree or grain base placed.
     - Second 15: Sautéed vegetables and aromatics positioned.
     - Second 25: Rested protein carved and placed.
     - Second 35: Sauce spooned or sauced.
     - Second 40: Micro-garnishes, tuiles, and flaky sea salt applied via precision culinary tweezers.
     - Second 45: Rim inspected and wiped; called for immediate service.

3. The Clean Rim Protocol:
   - Every plate rim is wiped with a clean microfiber cloth dampened with hot water and a drop of white vinegar to remove fingerprints and sauce splatters before leaving the pass.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #35.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In visual culinary plating composition, why is leaving 30% to 40% of the plate canvas as 'Negative Space' (white space) considered a best practice?",
      options: [
        "To save money on food costs",
        "To allow plates to cool down faster",
        "It prevents visual clutter, highlights vibrant colors, and frames the food with refined elegance",
        "To leave room for dirty forks"
      ],
      correct_option_index: 2,
      explanation: "Negative space prevents visual overcrowding, frames the dish cleanly, and focuses the diner's eye on the hero components.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What single-spoon culinary technique shapes velvety ice cream, mousse, ganache, or tartare into a seamless three-sided oval egg shape with sharp ridges?",
      options: [
        "A Quenelle (Rocher)",
        "A Chiffonade",
        "A Brunoise",
        "A Tourne"
      ],
      correct_option_index: 0,
      explanation: "A quenelle (or rocher) is formed by scooping a soft, cohesive food with a warm spoon into a smooth 3-sided oval.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "Why should ceramic plates for hot entrees always be pre-heated to 55-65 degrees C (130-150 degrees F) prior to plating on the line?",
      options: [
        "To cook the vegetables further on the plate",
        "To melt the plate glaze",
        "To sanitize the plate surface",
        "To prevent cold ceramic from rapidly pulling thermal energy out of hot proteins and congealing butter-based sauces during transit"
      ],
      correct_option_index: 3,
      explanation: "Pre-heated plates prevent rapid conduction cooling, keeping hot entrees and emulsified sauces at optimal dining temperatures.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In culinary color science, why must green vegetables containing chlorophyll be blanched quickly in boiling water and shocked in ice water?",
      options: [
        "To wash away all vitamins",
        "To prevent plant acids from displacing magnesium from chlorophyll molecules and turning the vegetables dull olive-brown (pheophytin)",
        "To turn vegetables purple",
        "To remove all water from cells"
      ],
      correct_option_index: 1,
      explanation: "Rapid boiling and ice-shocking sets the bright green chlorophyll and deactivates enzymes before plant acids convert it to dull brown pheophytin.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What rule in visual composition states that grouping plate garnishes in odd numbers (such as 3 or 5 scallops or drops) is more engaging than even numbers?",
      options: [
        "The Rule of Halves",
        "The Rule of Symmetry",
        "The Rule of Odds",
        "The Binary Principle"
      ],
      correct_option_index: 2,
      explanation: "The Rule of Odds recognizes that human perception finds odd-numbered groupings naturally more dynamic and visually compelling than static pairs.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In modernist culinary physics, how does an 'Agar-Agar Fluid Gel' achieve shear-thinning properties that allow it to flow through a squeeze bottle but hold sharp droplets without weeping liquid?",
      options: [
        "By freezing the gel into ice cubes",
        "A set agar gel is sheared in a high-speed blender into microscopic gel particles that flow under shear pressure and instantly re-set on the plate without syneresis",
        "By adding liquid nitrogen",
        "By evaporating all water in an oven"
      ],
      correct_option_index: 1,
      explanation: "Fluid gels are created by setting agar and high-shear blending it into micro-gel particles that exhibit pseudoplastic shear-thinning without weeping liquid.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In culinary composition, what is the 'Rule of Thirds' applied to plating?",
      options: [
        "Serving only three courses per meal",
        "Dividing the bill into three equal parts",
        "Using only three ingredients per dish",
        "Dividing the plate canvas with an imaginary 3x3 grid and placing key focal elements at grid line intersections rather than dead center to create dynamic visual tension"
      ],
      correct_option_index: 3,
      explanation: "The Rule of Thirds positions visual anchors off-center at grid line intersections, creating natural aesthetic balance and movement.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "How is a delicate, porous crispy 'Coral Tuile' (Lace Tuile) created in modern gastronomy?",
      options: [
        "By frying an emulsion of water, oil, flour, and colorant in a dry hot skillet until rapid steam evaporation leaves an intricate crisp web",
        "By carving coral from the ocean",
        "By baking bread for 48 hours",
        "By freezing sugar syrup"
      ],
      correct_option_index: 0,
      explanation: "Coral tuiles are formed by frying a water/oil/flour batter in a hot skillet; violent steam escaping creates an intricate, crunchy lace pattern.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What hydrocolloid is used at 0.1% to 0.2% concentration to stabilize purees and vinaigrettes against syneresis (weeping liquid halos) without altering mouthfeel?",
      options: [
        "Baking Soda",
        "Gelatin Powder",
        "Xanthan Gum",
        "Cornmeal"
      ],
      correct_option_index: 2,
      explanation: "Xanthan gum provides pseudoplastic stabilization at low concentrations (0.1-0.2%), preventing purees from separating or weeping liquid on the plate.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What surfactant ingredient is added at 0.5% to aromatic broths to create stable, ethereal culinary foams ('airs') using an immersion blender?",
      options: [
        "Egg Whites",
        "Soy Lecithin",
        "Granulated Sugar",
        "Butter"
      ],
      correct_option_index: 1,
      explanation: "Soy lecithin is a natural phospholipid surfactant that traps air bubbles on the surface of liquid when frothing, creating delicate aromatic airs.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "Why are delicate broths, consommes, and veloutes increasingly poured tableside from miniature pitchers rather than sauced on the kitchen line?",
      options: [
        "Because chefs do not know how to pour liquids",
        "To save money on kitchen dish soap",
        "Because dining room servers need more exercise",
        "It creates an engaging tableside experience, releases fresh aromatic aromas, and prevents crispy garnishes and tuiles from becoming soggy in transit"
      ],
      correct_option_index: 3,
      explanation: "Tableside pouring provides theatrical aroma release and preserves the crisp textures of delicate garnishes until the exact moment of consumption.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In the kitchen brigade, what is the role of the Expeditor (Aboyeur / Expo) at the pass station during dinner service?",
      options: [
        "The central coordinator who calls order tickets, paces course firing, verifies plate quality and temperature, enforces clean plate rims, and authorizes dishes for service",
        "The person who washes the dishes",
        "The person who purchases ingredients at the market",
        "The manager who handles payroll"
      ],
      correct_option_index: 0,
      explanation: "The Expeditor coordinates ticket timing between kitchen stations and front-of-house, ensuring all plates in an order are assembled and checked to perfection.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In culinary color chemistry, what biochemical mechanism causes red cabbage, beet, and berry anthocyanin purees to maintain a vibrant ruby color versus turning dull violet-blue?",
      options: [
        "Adding baking soda (alkaline pH)",
        "Cooking with iron utensils",
        "Maintaining an acidic environment (pH < 4) with lemon juice, vinegar, or citric acid to keep the anthocyanin molecule in its flavylium cation state",
        "Adding salt"
      ],
      correct_option_index: 2,
      explanation: "Anthocyanins shift from dull blue-violet to brilliant red in acidic pH (< 4) as the pigment molecule exists in its red flavylium cation form.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "How do fat-converting hydrocolloids like Tapioca Maltodextrin (Zorbit) contribute to modern culinary textural architecture on the plate?",
      options: [
        "They turn water into ice",
        "They transform high-fat liquids (truffle oil, nut butters, bacon fat) into delicate dry powders that melt instantly back into liquid oils upon contact with the palate",
        "They make food sweet",
        "They harden chocolate into candy shells"
      ],
      correct_option_index: 1,
      explanation: "Tapioca maltodextrin encapsulates fats, converting liquid oils and fats into dry powders that melt back into rich liquids upon contact with saliva.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "On the professional expediting pass, what solution is used on clean microfiber cloths to wipe plate rims before service?",
      options: [
        "Warm water dampened with a small amount of white vinegar (to dissolve finger oils and remove sauce splatters without leaving residue)",
        "Raw cooking oil",
        "Hand soap",
        "Tap water with heavy bleach"
      ],
      correct_option_index: 0,
      explanation: "A warm water and white vinegar solution cuts grease and fingerprints instantly, evaporating cleanly without leaving streaks or soapy flavors.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #35.");
  console.log("Skill #35 update completed successfully!");
}

run();
