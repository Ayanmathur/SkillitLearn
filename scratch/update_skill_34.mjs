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

const skillId = "1dd43076-a02c-489c-a29a-c8e3d4a31b2d";

async function run() {
  console.log("Updating Skill #34: Knife Skills (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Blade Metallurgy, Knife Anatomy and Biomechanical Grips" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Classical French Precision Vegetable Cuts and Alliums" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Protein Fabrication, Whetstone Sharpening and Burr Mechanics" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Master Chef level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Blade Metallurgy, Steel Alloys and Rockwell Hardness (HRC)",
      order_index: 1,
      content: `### Metallurgy and Material Science of Culinary Cutlery

Professional culinary knives represent sophisticated metallurgical engineering balancing hardness, toughness, and edge retention:

1. Forged vs Stamped Blade Construction:
   - Forged Blades: Heated and hammered from a single bar of steel, forming a continuous grain structure, integral bolster, and full tang sandwiched between handle scales with brass rivets.
   - Stamped Blades: Laser-cut from cold rolled steel sheets; lighter, flexible, but lacking the balance and heft of forged knives.

2. Steel Chemistry and Hardness (Rockwell C Scale - HRC):
   - German Western Steels (X50CrMoV15 / DIN 1.4116): 56 to 58 HRC. Formulated with 15% Chromium, 0.5% Carbon, and Molybdenum-Vanadium. Tough, ductile, highly corrosion resistant, forgiving against bone impacts, but requires frequent honing.
   - Japanese High-Carbon Powder Steels (VG-10, Shirogami White Paper, Aogami Super Blue, SG2 / R2 Micro-Carbide): 60 to 64 HRC. Ultra-fine micro-carbide structures providing extreme edge retention and surgical sharpness, but brittle and vulnerable to chipping if twisted.

3. Blade Geometry and Bevel Angles:
   - Western Double Bevel: 20 degrees per side (40 degrees inclusive angle); robust edge for heavy prep.
   - Japanese Double Bevel: 15 degrees per side (30 degrees inclusive angle); razor push-cutting.
   - Traditional Japanese Single Bevel (Kataba - Yanagiba/Deba): Asymmetrical 90/10 grind with a concave back (Urasuki), slicing through raw fish cells with zero tearing.`
    },
    {
      track_id: track1Id,
      title: "Brigade Cutlery: Chef's Knives, Santoku, Boning and Yanagiba",
      order_index: 2,
      content: `### Specialized Cutlery in the Classical Kitchen Brigade

Mastery of kitchen cutlery requires selecting the proper blade profile for specific anatomical and prep tasks:

1. Primary Production Workhorses:
   - French / German Chef's Knife (8 to 10 inches): Curved blade belly optimized for rocking cuts through dense root vegetables and slicing proteins.
   - Japanese Gyuto: Flatter profile than Western chef's knives, optimized for push-cutting and pull-slicing.
   - Santoku (Three Virtues - slicing, dicing, mincing): 6 to 7 inch blade with a sheep's foot tip and low curvature, equipped with scalloped Granton flutes reducing suction.
   - Nakiri: Flat rectangular double-bevel cleaver for rapid vertical push-cutting of vegetables.

2. Precision and Fabrication Knives:
   - Paring Knife (3 to 4 inches) & Tourne Knife (Bird's Beak): Curved blade designed for in-hand peeling and carving 7-sided tourne vegetables.
   - Boning Knife: Narrow 5 to 6 inch blade; stiff blade for beef/pork fabrication, flexible curved blade for poultry and fish.
   - Serrated Bread / Pastry Knife: Scalloped teeth shearing through hard crusts or delicate tomatoes without crushing internal crumb structure.
   - Yanagiba (Willow Leaf): Long (270mm to 330mm) single-bevel slicer drawing through raw fish in a single continuous pull stroke.`
    },
    {
      track_id: track1Id,
      title: "Biomechanics: The Pinch Grip, The Claw and Cutting Station Ergonomics",
      order_index: 3,
      content: `### Cutting Biomechanics and Workplace Ergonomics

Speed, precision, and hand safety depend on strict biomechanical posture:

1. The Professional Pinch Grip:
   - Choking up on the blade: The thumb and curled index finger grip the base of the blade directly in front of the bolster; the remaining three fingers wrap around the handle.
   - Biomechanical Advantage: Places the hand directly over the knife's center of gravity, maximizing blade control, tactile feedback, and eliminating wrist fatigue.

2. The Guiding 'Claw' Hand (The Bear Claw):
   - Fingertips curled inward toward the palm like a bear claw, with the thumb tucked securely behind the fingers.
   - The flat side of the knife blade rests gently against the first knuckle of the middle finger.
   - The middle finger knuckle serves as a physical guide rail, moving backward incrementally with each cut while fingertips remain shielded from the blade path.

3. Cutting Station Ergonomics:
   - Cutting Board Materials: End-grain hardwood (maple, walnut) or high-density synthetic rubber (Hasegawa, Asahi) that preserve knife edges.
   - Stability Anchor: A damp bar towel or non-slip silicone rubber mat placed beneath the board to eliminate shifting.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Classical French Precision Vegetable Cuts: Julienne, Brunoise and Dice",
      order_index: 1,
      content: `### The Classical French Vegetable Cutting Hierarchy

Uniformity in knife cuts is essential in culinary arts to guarantee identical cooking rates and refined visual aesthetics:

1. Squaring and Trimming (Top-and-Tail):
   - Trimming the ends of rounded root vegetables (carrots, potatoes) and slicing thin peelings off four sides to create an exact rectangular prism (eliminating wobble on the board).

2. The Stick and Cube Dimensions Hierarchy:
   - Batonnet (Little Stick): Exactly 1/4 inch x 1/4 inch x 2 inches (6 mm x 6 mm x 5 cm).
   - Small Dice (Macedoine): Exactly 1/4 inch cube (6 mm x 6 mm x 6 mm) derived from Batonnet.
   - Medium Dice (Parmentier): Exactly 1/2 inch cube (12 mm x 12 mm x 12 mm).
   - Large Dice (Carre): Exactly 3/4 inch cube (2 cm x 2 cm x 2 cm).
   - Fine Julienne: Exactly 1/16 inch x 1/16 inch x 2 inches (1.5 mm x 1.5 mm x 5 cm).
   - Fine Brunoise: Exactly 1/16 inch cube (1.5 mm x 1.5 mm x 1.5 mm) derived from Fine Julienne.
   - Standard Julienne (Allumette): Exactly 1/8 inch x 1/8 inch x 2 inches (3 mm x 3 mm x 5 cm).
   - Standard Brunoise: Exactly 1/8 inch cube (3 mm x 3 mm x 3 mm) derived from Standard Julienne.`
    },
    {
      track_id: track2Id,
      title: "Specialty Cuts: Chiffonade, Paysanne, Oblique and Tourne",
      order_index: 2,
      content: `### Advanced Vegetable Carving and Specialty Techniques

1. Chiffonade (Herbs and Leafy Greens):
   - Destemming, stacking, and rolling leaves (basil, sage, sorrel, spinach) into a tight cylinder.
   - Slicing crosswise with a smooth, continuous forward guillotine stroke into thin ribbons.
   - Avoiding downward chopping which bruises plant cells and oxidizes delicate chlorophyll.

2. Paysanne and Oblique Cuts:
   - Paysanne (Country Style): 1/2 inch x 1/2 inch x 1/8 inch thin square tiles used in traditional peasant broths and braises.
   - Oblique / Roll Cutting: Cutting cylindrical vegetables at a 45-degree angle, rolling 90 degrees after each cut, creating multi-faceted geometric wedges with high surface area.

3. Tourne (Chateau / Cocotte Cut):
   - The pinnacle of classical French precision carving:
     - Trimming root vegetables (potatoes, carrots, zucchini) into a 2-inch long football / barrel shape.
     - Carving exactly 7 identical curved facets with blunted, symmetrical ends using a curved bird's beak tourne knife, designed for even butter-glazing in copper pans.`
    },
    {
      track_id: track2Id,
      title: "Allium Fabrication: Onion Dicing, Shallot Brunoise and Garlic",
      order_index: 3,
      content: `### High-Speed Allium Mincing and Cellular Chemistry

1. Cellular Chemistry of Alliums:
   - Cutting alliums ruptures cell vacuoles, releasing alliinase enzymes that convert amino acid sulfoxides into volatile syn-propanethial-S-oxide gas (lachrymatory tear-inducing vapor).
   - Razor-sharp blades slice cleanly between cellular walls, minimizing enzyme release, whereas dull knives crush cells and spray tear-inducing vapors into the air.

2. The Classical Onion Dicing Technique:
   - Step 1: Halving the onion longitudinally through the stem-to-root axis; peel outer skins while keeping the root intact.
   - Step 2: Placing flat face down; making parallel horizontal cuts from stem end toward root without cutting through the root anchor.
   - Step 3: Making tight vertical cuts down through the onion from stem toward root.
   - Step 4: Slicing across the vertical cuts with a smooth downward push stroke to release perfectly uniform Brunoise or dice instantly without tears or messy scattering.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Protein Butchery: Poultry Breakdown, Fish Filleting and Trimming",
      order_index: 1,
      content: `### Culinary Protein Fabrication and Fabrication Economics

1. Whole Poultry Breakdown (8-Way / 10-Way Cut):
   - Slicing through the leg-thigh skin fold; popping the hip joint and cutting through cartilage to remove leg quarters.
   - Separating thighs and drumsticks cleanly through the knee ball-and-socket joint without cutting bone.
   - Removing wings at the shoulder joint; slicing along the keel bone to release boneless airline breasts with drumette attached; reserving backbone for stock.

2. Fish Filleting: Roundfish vs Flatfish:
   - Roundfish (Salmon, Snapper, Bass): Angled cut behind pectoral fin; guiding a flexible fillet knife along the dorsal spine over the ribcage, lifting the fillet cleanly; pin-boning with culinary tweezers.
   - Flatfish (Flounder, Halibut, Turbot): Cutting down the central lateral line from head to tail, sweeping the knife outward along the flat skeleton to yield 4 distinct fillets.

3. French Trimming (Frenching Racks):
   - Scraping meat, fat, and connective intercostal tissue completely off rib bones on lamb racks or beef prime ribs to expose pristine white polished bones for fine-dining presentation.`
    },
    {
      track_id: track3Id,
      title: "Honing vs Sharpening: Apex Geometry and Whetstone Progression",
      order_index: 2,
      content: `### Tribology of Blade Edges and Whetstone Progression

1. Honing vs Sharpening:
   - Honing (Honing Steel / Ceramic Rod): Re-aligns a microscopic rolled wire edge (burr) bent during food contact. Honing removes virtually zero metal; restores cutting keenness between prep tasks.
   - Sharpening (Whetstones): Abrasive removal of steel along the primary bevel to re-establish a sharp cutting apex.

2. Synthetic Japanese Water Stone Grit Progression:
   - Coarse Stone (220 to 400 Grit): Rapid metal removal; used for reprofiling damaged bevels and grinding out nicked chips.
   - Medium Stone (1,000 to 2,000 Grit): The foundational sharpening stone; establishes a clean, razor cutting apex.
   - Fine Finishing Stone (3,000 to 6,000 Grit): Refines the scratch pattern and polishes micro-serrations for protein slicing.
   - Ultra-Fine Polishing Stone (8,000 to 12,000 Grit): Delivers a mirror-polished zero-friction edge for raw fish sashimi knives.`
    },
    {
      track_id: track3Id,
      title: "Burr Formation, Stropping, Knife Maintenance and Storage",
      order_index: 3,
      content: `### Burr Formation, Leather Stropping and Cutlery Preservation

1. The Sharpening Stroke and Burr Formation:
   - Maintaining a consistent 15-degree bevel angle across the water stone.
   - Applying firm forward pressure across the cutting edge with light return strokes.
   - Detecting the Burr: Sharpening continues until a continuous microscopic metal ridge (burr) forms along the entire reverse side of the blade from heel to tip.

2. Deburring and Leather Stropping:
   - Flipping the blade to repeat on the opposite side until a uniform apex forms.
   - Stropping on a vegetable-tanned leather strop loaded with 0.5-micron chromium oxide compound using light trailing strokes to polish the final apex and remove all microscopic wire burrs.

3. Professional Cutlery Preservation:
   - Washing strictly by hand with warm water and mild soap; towel dry immediately to prevent carbon steel oxidation.
   - NEVER place knives in commercial dishwashers (harsh alkaline detergents corrode steel, violent water jets dull edges against racks, and heat destroys wooden rivets).
   - Storage: Solid wood magnetic wall blocks, in-drawer slotted blocks, or individual wooden sayas.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #34.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "What professional grip involves choking up on the knife and holding the blade base between the thumb and curled index finger for maximum control and balance?",
      options: [
        "Hammer Grip",
        "The Pinch Grip",
        "Dagger Grip",
        "Two-Handed Grip"
      ],
      correct_option_index: 1,
      explanation: "The pinch grip places the thumb and index finger directly on the blade in front of the bolster, aligning the hand with the knife's center of gravity.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In classical French culinary cutting dimensions, what are the exact measurements of a standard 'Batonnet' cut?",
      options: [
        "1 inch x 1 inch x 4 inches",
        "1/16 inch x 1/16 inch x 2 inches",
        "1/2 inch x 1/2 inch x 1/2 inch",
        "1/4 inch x 1/4 inch x 2 inches (6 mm x 6 mm x 5 cm)"
      ],
      correct_option_index: 3,
      explanation: "A standard Batonnet cut measures exactly 1/4 inch x 1/4 inch x 2 inches, and serves as the starting point for Macedoine (small dice).",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What French culinary cut involves stacking, rolling, and slicing leafy herbs (like basil or spinach) into thin ribbon-like strips?",
      options: [
        "Chiffonade",
        "Brunoise",
        "Tourne",
        "Julienne"
      ],
      correct_option_index: 0,
      explanation: "Chiffonade is the technique of rolling leafy greens or herbs into a cylinder and slicing across into fine ribbons.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What is the critical functional difference between using a honing steel and using a whetstone on a chef's knife?",
      options: [
        "Honing steels remove metal to create a new bevel; whetstones only straighten the blade",
        "Honing steels are only for wooden knives",
        "Honing steels re-align the microscopic rolled wire edge without removing metal, while whetstones abrasively remove steel to reshape the sharp cutting apex",
        "There is zero difference"
      ],
      correct_option_index: 2,
      explanation: "Honing straightens and re-aligns the rolled microscopic edge, whereas whetstones abrasively grind away steel to form a new sharp apex.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "Why must professional culinary kitchen knives NEVER be cleaned in commercial dishwashers?",
      options: [
        "Dishwashers make knives too sharp",
        "Harsh caustic detergents corrode and pit steel, high heat warps handles and rivets, and violent water jets knock the sharp edge against racks, dulling it instantly",
        "Dishwashers turn metal into plastic",
        "Dishwashers make knives change color"
      ],
      correct_option_index: 1,
      explanation: "Commercial dishwashers destroy knives: aggressive detergents pit steel, high heat damages handle scales, and vibration dings the fragile apex against racks.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In classical French culinary vegetable carving, what defines a 'Tourne' (Chateau) cut?",
      options: [
        "A rough irregular chop",
        "A paper-thin translucent circle",
        "A 2-inch long barrel or football shape with exactly 7 equal curved facets and blunted symmetrical ends",
        "A hollowed-out ring"
      ],
      correct_option_index: 2,
      explanation: "The Tourne cut is a classical 7-sided barrel-shaped carving exactly 2 inches long, designed for uniform butter-glazing in copper pans.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "What are the exact dimensions of a classical French 'Fine Brunoise' cut?",
      options: [
        "1/16 inch x 1/16 inch x 1/16 inch cube (1.5 mm cube) derived from a Fine Julienne",
        "1/2 inch cube",
        "1 inch cube",
        "1/4 inch cube"
      ],
      correct_option_index: 0,
      explanation: "Fine Brunoise is a tiny, precise 1/16-inch cube cut derived by cross-cutting Fine Julienne sticks.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "How does Japanese high-carbon steel (such as VG-10 or Aogami at 60-64 HRC) compare in hardness and durability to German Western cutlery steel (such as X50CrMoV15 at 56-58 HRC)?",
      options: [
        "German steel is much harder and more brittle than Japanese steel",
        "Both steels have identical properties",
        "Japanese steel cannot be sharpened on whetstones",
        "Japanese high-carbon steel is significantly harder with superior edge retention but is more brittle, whereas German steel is tougher and more ductile, resisting chipping against bone"
      ],
      correct_option_index: 3,
      explanation: "Japanese steels (60-64 HRC) hold a razor edge far longer but can chip on hard bones; German steels (56-58 HRC) are tougher and ductile, resisting chipping.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In the guiding 'claw' hand technique, what anatomical part of the hand acts as the physical guide rail for the knife blade to prevent cutting fingertips?",
      options: [
        "The fingernails",
        "The first knuckle of the curled middle finger (with fingertips and thumb tucked safely behind)",
        "The palm of the hand",
        "The wrist"
      ],
      correct_option_index: 1,
      explanation: "The flat of the knife blade rests against the middle finger's first knuckle, which glides backward incrementally while keeping fingertips curled safely inside.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In culinary protein butchery, what is 'French Trimming' (Frenching a rack)?",
      options: [
        "Cooking meat in French wine",
        "Mincing meat into burger patties",
        "Scraping all meat, fat, and connective tissue cleanly off rib bones to expose polished white bone ends for elegant presentation",
        "Deep-frying a bone"
      ],
      correct_option_index: 2,
      explanation: "Frenching involves meticulously scraping fat and connective tissue away from rib bones (on lamb racks or prime ribs) for fine-dining aesthetic presentation.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "During whetstone sharpening, what physical indicator confirms that metal has been ground down far enough on the primary bevel to establish a complete cutting apex?",
      options: [
        "A continuous microscopic wire burr can be felt along the entire reverse side of the blade edge from heel to tip",
        "The whetstone turns completely black",
        "The knife blade gets warm",
        "The knife starts whistling"
      ],
      correct_option_index: 0,
      explanation: "A raised microscopic metal burr along the entire opposite side of the blade proves that the bevel has been ground all the way to the apex.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In allium cutting chemistry, why does cutting onions with a razor-sharp knife cause significantly less tearing and eye irritation than using a dull knife?",
      options: [
        "Sharp knives heat up the onion and destroy all sulfur compounds",
        "Sharp knives only cut the outer skin",
        "Dull knives emit magnetic radiation",
        "A razor blade slices cleanly between cell walls without crushing them, while a dull blade crushes cell walls, rupturing vacuoles and spraying lachrymatory alliinase gas into the air"
      ],
      correct_option_index: 3,
      explanation: "Sharp blades slice through cells cleanly; dull blades crush and burst plant cell walls, spraying alliinase enzymes that create tear-inducing syn-propanethial-S-oxide.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Japanese traditional cutlery, what is a single-bevel 'Kataba' grind (as found on Yanagiba and Deba knives) with a concave 'Urasuki' back?",
      options: [
        "A knife with two serrated edges",
        "An asymmetrical blade ground with a bevel on only one side (90/10) and a concave reverse face, producing clean cellular cuts with zero friction for raw fish sashimi",
        "A knife designed exclusively for chopping firewood",
        "A knife made from glass"
      ],
      correct_option_index: 1,
      explanation: "Single-bevel Kataba blades have a sharp chisel bevel on one side and a concave Urasuki hollow on the back, minimizing food contact and slicing fish with zero cellular tearing.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In culinary fish butchery, how does the filleting technique for Flatfish (such as Halibut, Flounder, Turbot) differ from Roundfish (such as Salmon, Bass)?",
      options: [
        "Flatfish are boiled whole with scales on",
        "Roundfish yield 4 fillets; Flatfish yield 1 fillet",
        "Flatfish are cut along the central lateral line and filleted outward from the center skeleton to yield 4 distinct fillets, whereas Roundfish are cut along the dorsal spine to yield 2 fillets",
        "Flatfish have zero bones"
      ],
      correct_option_index: 2,
      explanation: "Flatfish are cut along the central backbone and lifted outward to yield 4 distinct fillets; Roundfish are sliced down the dorsal spine over ribcages to yield 2 fillets.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In synthetic Japanese water stone sharpening progression, what grit stone is specifically utilized for setting the initial working apex on a dull edge?",
      options: [
        "Medium Grit (1,000 to 2,000 Grit)",
        "Ultra-Fine Grit (12,000 Grit)",
        "Coarse Grit (120 Grit)",
        "Sandpaper 40 Grit"
      ],
      correct_option_index: 0,
      explanation: "1,000 to 2,000 grit medium water stones are the standard baseline for setting a clean, sharp working apex before polishing on higher grits.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #34.");
  console.log("Skill #34 update completed successfully!");
}

run();
