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

const skillId = "78586084-6a58-4419-b620-927a1d09bd86";

async function run() {
  console.log("Updating Skill #102: Textiles & Fabric Knowledge (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Fiber Taxonomy, Polymer Science and Identification Testing" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Yarn Spinning, Weaving Physics and Knit Geometries" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Dyeing, Textile Finishes, Performance Testing and Eco-Labels" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Master Textile Scientist & Materials Director level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Natural Cellulosic and Protein Fibers",
      order_index: 1,
      content: `### Natural Fiber Polymers and Molecular Properties

1. Plant Cellulosic Fibers:
   - Cotton: Long-staple (Pima/Egyptian Giza) providing superior tensile strength and softness.
   - Linen (Flax): High crystallinity, rapid moisture absorption, low elasticity, natural coolness.

2. Animal Protein Fibers:
   - Wool: Natural three-dimensional crimp, moisture regain up to 30% without feeling damp, natural flame resistance.
   - Mulberry Silk: Continuous triangular prism protein filament producing natural lustrous light refraction.`
    },
    {
      track_id: track1Id,
      title: "Synthetic Polymers and Regenerated Semi-Synthetics",
      order_index: 2,
      content: `### Petrochemical Synthetics and Closed-Loop Cellulosics

1. Synthetic Polymers:
   - Polyester (PET): Hydrophobic, high dimensional stability, wrinkle recovery, oleophilic (oil-attracting).
   - Polyamide (Nylon 6 / 6.6): Exceptional abrasion resistance and elastic recovery under tension.
   - Elastane (Spandex): Segmented polyurethane block copolymer stretching over 500%.

2. Regenerated Cellulosics:
   - Viscose Rayon, Modal, and Lyocell/Tencel (closed-loop production recycling >99.5% of organic amine oxide solvents).`
    },
    {
      track_id: track1Id,
      title: "Fiber Burn Testing and Microscopic Analysis",
      order_index: 3,
      content: `### Forensic Textile Identification Protocols

1. Fiber Burn Test Diagnostics:
   - Cellulosics (Cotton/Linen/Rayon): Burns quickly with yellow flame, smells of burning paper/wood, leaves light powdery grey ash.
   - Proteins (Wool/Silk): Burns slowly, self-extinguishes upon removal from flame, smells of burning hair/feathers, leaves crushable dark hollow bead.
   - Synthetics (Polyester/Nylon): Melts, shrinks from heat, produces dark chemical smoke, leaves hard uncrushable plastic bead.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Yarn Architecture, Twist (S vs Z) and Numbering Systems",
      order_index: 1,
      content: `### Linear Density and Yarn Structure

1. Spinning Dynamics:
   - S-Twist vs Z-Twist directionality balancing torque and preventing spirality in knitted fabrics.

2. Yarn Numbering Systems:
   - Denier: Direct system measuring grams per 9,000 meters of filament yarn (finer filament = lower denier).
   - Tex: Grams per 1,000 meters.
   - Cotton Count (Ne): Indirect system measuring 840-yard hanks per pound (higher number = finer spun yarn).`
    },
    {
      track_id: track2Id,
      title: "Woven Structures: Plain, Twill, Satin and True Bias Physics",
      order_index: 2,
      content: `### Loom Interlacing Geometry and Bias Drape

1. The 3 Fundamental Weave Structures:
   - Plain Weave (1/1 interlacing): High stability and tensile strength (poplin, chiffon, taffeta).
   - Twill Weave (diagonal wales, e.g. 3/1 right-hand twill): Soft hand, flexible drape, high durability (denim, gabardine).
   - Satin Weave (long floating warp/weft yarns): High surface luster and liquid drape.

2. The True Bias (45-Degree Angle):
   - Cutting fabric at 45 degrees to warp and weft unlocks maximum mechanical stretch and fluid body contouring.`
    },
    {
      track_id: track2Id,
      title: "Knit Geometries: Weft vs Warp Knits and Fabric Weight (GSM)",
      order_index: 3,
      content: `### Interlooping Physics and Metric Fabric Weight

1. Knit Classifications:
   - Weft Knits: Single Jersey (natural edge curling), Rib Knit (high crosswise elasticity), Interlock (smooth, non-curling double-knit structure).
   - Warp Knits: Tricot and Raschel (run-resistant looping used in activewear and lingerie).

2. Fabric Weight Metric:
   - Grams per Square Meter (GSM = oz/yd2 * 33.906); dictates drape, opacity, and garment categorization.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Dyeing Chemistry and Color Fastness",
      order_index: 1,
      content: `### Molecular Color Chemistry and Solution Dyeing

1. Dye Class Affinities:
   - Reactive Dyes: Covalent chemical bonding with cellulosic hydroxyl groups (wash-fast cotton).
   - Acid Dyes: Ionic bonding with wool, silk, and nylon fibers.
   - Disperse Dyes: High-temperature pressure diffusion into hydrophobic polyester filaments.

2. Solution Dyeing (Dope Dyeing):
   - Pigment injected into molten polymer prior to fiber extrusion, saving over 80% water and delivering superior UV colorfastness.`
    },
    {
      track_id: track3Id,
      title: "Mechanical and Chemical Textile Finishes",
      order_index: 2,
      content: `### Functional and Aesthetic Surface Modification

1. Mechanical Finishing:
   - Sanforization: Compressive preshrinking controlling residual laundering shrinkage to <1%.
   - Calendaring & Chintz: Heated high-pressure rollers producing high-gloss surfaces.

2. Chemical Finishing:
   - Mercerization: Sodium hydroxide bath swelling cotton fibers, permanently increasing tensile strength, luster, and dye affinity.
   - C0 Fluorine-Free DWR: Eco-compliant durable water repellents.`
    },
    {
      track_id: track3Id,
      title: "Physical Textile Testing and Global Eco-Certifications",
      order_index: 3,
      content: `### Laboratory Quality Standards and Sustainable Sourcing

1. Performance Testing Standards:
   - Martindale Abrasion Rubs (ISO 12947): Quantifying fabric wear resistance.
   - Pilling Resistance (ISO 12945): Evaluating surface fiber balling.

2. Global Certification Verification:
   - OEKO-TEX Standard 100: Testing for toxic chemicals and heavy metals.
   - GOTS (Global Organic Textile Standard): Verifying >=95% organic agricultural fibers and non-toxic processing.
   - GRS (Global Recycled Standard).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #102.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In textile science, what does 'GSM' stand for when measuring fabric weight and density?",
      options: [
        "Grams per Square Meter",
        "Gallons per Standard Measurement",
        "Gross Silk Metric",
        "Garment Size Measurement"
      ],
      correct_option_index: 0,
      explanation: "GSM (Grams per Square Meter) is the universal metric standard for quantifying fabric weight and thickness.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In a forensic Fiber Burn Test, how do natural protein fibers (such as sheep wool or mulberry silk) typically behave?",
      options: [
        "They melt into hot liquid plastic and smell like sweet celery",
        "They explode in a blue flame",
        "They burn slowly, self-extinguish when removed from flame, smell of burning hair/feathers, and leave a crushable dark bead",
        "They burn instantly with a bright yellow flash and smell of paper"
      ],
      correct_option_index: 2,
      explanation: "Protein fibers burn slowly, self-extinguish due to natural flame resistance, smell like burning hair, and leave crushable ash.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What famous natural physical property allows wool fibers to absorb up to 30% of their dry weight in moisture vapor without feeling damp to the touch?",
      options: [
        "Hydrophobic plastic coating",
        "Natural moisture regain capacity due to internal hygroscopic cellular structure",
        "Synthetic chemical silicone finish",
        "Waterproofing with rubber"
      ],
      correct_option_index: 1,
      explanation: "Wool's complex cellular protein structure absorbs interior moisture vapor while repelling external liquid droplets.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What are the three fundamental foundation weave structures in woven textile manufacturing?",
      options: [
        "Plastic, Metal, and Wood",
        "Knitted, Crocheted, and Braided",
        "Printed, Dyed, and Bleached",
        "Plain Weave, Twill Weave, and Satin Weave"
      ],
      correct_option_index: 3,
      explanation: "All woven fabrics derive from the three fundamental weave architectures: Plain, Twill, and Satin weaves.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In garment cutting and pattern physics, what is the 'True Bias'?",
      options: [
        "A line drawn at an exact 45-degree angle to the warp (lengthwise) and weft (crosswise) grainlines, offering maximum stretch and fluid body contouring",
        "Cutting fabric straight along the selvage edge",
        "Cutting fabric across the width",
        "A personal opinion about fashion"
      ],
      correct_option_index: 0,
      explanation: "Cutting at a 45-degree bias angle unlocks mechanical stretch and liquid drape even in rigid woven fabrics.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In eco-friendly textile manufacturing, why is Lyocell (Tencel) considered environmentally superior to traditional Viscose Rayon?",
      options: [
        "Lyocell uses plastic bottles",
        "Lyocell requires zero water to grow",
        "Lyocell is made from petroleum oil",
        "Lyocell uses a closed-loop manufacturing process that recovers and recycles over 99.5% of non-toxic organic amine oxide (NMMO) solvents and water"
      ],
      correct_option_index: 3,
      explanation: "Lyocell's closed-loop process recycles over 99.5% of solvents, avoiding the toxic carbon disulfide effluents of viscose rayon.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In denim and workwear manufacturing, what visual and structural characteristic defines a 'Twill Weave'?",
      options: [
        "A checkerboard grid pattern",
        "Prominent diagonal ridges or ribs (wales) running across the fabric face (e.g. 3/1 right-hand twill), providing durability, tear resistance, and drape",
        "Complete transparency like glass",
        "Open holes like fishing net"
      ],
      correct_option_index: 1,
      explanation: "Twill weaves feature staggered warp floating yarns that create distinctive diagonal wales, providing heavy-duty tear strength.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In cotton finishing chemistry, what does 'Mercerization' (treatment with sodium hydroxide) accomplish?",
      options: [
        "It swells the cotton fibers, permanently increasing fiber tensile strength, dimensional luster, smooth hand-feel, and dye absorption affinity",
        "It burns the cotton fibers into ash",
        "It turns cotton into synthetic nylon",
        "It shrinks the fabric by 50%"
      ],
      correct_option_index: 0,
      explanation: "Mercerization un-twists and rounds cotton fibers in an alkaline bath, enhancing luster, strength, and color depth.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In synthetic yarn measurement, what is 'Denier'?",
      options: [
        "A measurement of fabric stretch percentage",
        "The temperature of the dye bath",
        "A direct yarn numbering system measuring the mass in grams of 9,000 meters of filament yarn (lower denier = finer filament)",
        "The number of threads per inch"
      ],
      correct_option_index: 2,
      explanation: "Denier measures the weight in grams of 9,000 meters of continuous filament; lower numbers denote ultra-fine fibers.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In organic apparel certification, what standard does the Global Organic Textile Standard (GOTS) enforce?",
      options: [
        "Clothing must be 100% plastic",
        "Garments must be hand-sewn only",
        "Fabrics cannot be dyed",
        "Requires at least 95% certified organic natural fibers, strict prohibitions on toxic heavy-metal dyes, wastewater treatment mandates, and verified fair labor standards"
      ],
      correct_option_index: 3,
      explanation: "GOTS is the gold standard organic textile certification, covering the entire chain from farming through non-toxic chemical processing.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In industrial textile dyeing, what is 'Solution Dyeing' (Dope Dyeing) and why is it superior to conventional piece-dyeing?",
      options: [
        "Dyeing clothes in washing machines",
        "Color pigments are mixed directly into liquid molten polymer prior to fiber extrusion, locking color inside the fiber core while saving over 80% water and eliminating toxic effluent",
        "Dyeing fabric using food coloring",
        "Dyeing only the outside surface of clothing"
      ],
      correct_option_index: 1,
      explanation: "Dope dyeing integrates color into the polymer matrix before extrusion, providing permanent UV fastness while slashing water usage.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In mechanical finishing, what is 'Sanforization' and how does it protect garments from post-purchase customer returns?",
      options: [
        "Spraying fabric with perfume",
        "Bleaching fabric with chlorine",
        "A controlled mechanical compressive shrinkage process using heated rubber blankets that pre-shrinks woven cotton to prevent laundering shrinkage (<1% residual)",
        "Ironing fabric at high speed"
      ],
      correct_option_index: 2,
      explanation: "Sanforization mechanically compresses cotton fabric in length and width, eliminating surprise shrinkage when washed by consumers.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "Why does Mulberry Silk have a natural, luminous sheen and luster compared to matte cotton fibers?",
      options: [
        "Silk fibroin protein filaments have a triangular prism cross-section that refracts incoming light at various angles, creating a natural iridescent pearlescent luster",
        "Silk is coated in synthetic petroleum wax",
        "Silk fibers are painted with metallic dye",
        "Silk reflects 100% of light like a flat glass mirror"
      ],
      correct_option_index: 0,
      explanation: "The triangular cross-sectional geometry of silk filaments acts like a optical prism, refracting light into an iridescent luster.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In knit textile engineering, what structural difference makes an 'Interlock Knit' superior to a 'Single Jersey Knit' for high-end garments?",
      options: [
        "Interlock is made of steel wire",
        "Single jersey cannot be washed",
        "Interlock knits are transparent",
        "Interlock is a double-knit construction formed by two interlocking rib courses, producing an identical smooth face on both sides that will not curl at the cut edges"
      ],
      correct_option_index: 3,
      explanation: "Interlock knits use two interlocking needle beds to create a balanced, thicker, non-curling fabric with identical smooth surfaces on both sides.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In laboratory abrasion testing under ISO 12947, how is the 'Martindale Abrasion Test' conducted to evaluate upholstery and apparel durability?",
      options: [
        "Dropping weights from a roof",
        "A circular specimen is rubbed against a standard abrasive wool fabric in a continuous geometric Lissajous figure pattern until yarn breakage occurs (rated in thousands of cycles/rubs)",
        "Washing fabric in acid for 100 hours",
        "Pulling fabric with a hydraulic crane"
      ],
      correct_option_index: 1,
      explanation: "The Martindale test rubs fabric along multi-directional Lissajous patterns, measuring rub cycles until visible thread breakdown.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #102.");
  console.log("Skill #102 update completed successfully!");
}

run();
