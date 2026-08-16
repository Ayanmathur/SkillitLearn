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

const skillId = "68a043fa-a297-49e6-afd4-f15bf9b4e0ee";

async function run() {
  console.log("Updating Skill #104: Garment Construction (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Industrial Machinery, Needle-Thread Engineering and Seam Classes" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Garment Assembly Sequencing, Closures, Collars and Sleeves" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Pressing Physics, Atelier Tailoring and Quality Assurance" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Master Couturier & Head of Atelier Production level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Industrial Machinery and Differential Feed Mechanics",
      order_index: 1,
      content: `### Industrial Sewing Systems and Feed Calibration

1. High-Speed Production Machinery:
   - Industrial Lockstitch (Juki DDL series): High-speed rotary hook, needle positioning, automatic thread trimming.
   - Overlock/Serger (4-Thread / 5-Thread Safety Stitch): Trims and encases raw fabric edges in loopers.

2. Differential Feed Ratios (0.7 to 2.0):
   - Adjusts the relative speed between front and rear feed dogs, preventing wavy stretched seams on elastic knits and eliminating gathering puckers on fine wovens.`
    },
    {
      track_id: track1Id,
      title: "Needle Systems, Point Geometries and Thread Engineering",
      order_index: 2,
      content: `### Needle Penetration Physics and Thread Selection

1. Needle Point Geometries:
   - Sharp / Microtex: Acute slender point for high-density woven silks and microfiber.
   - Ballpoint / Jersey: Rounded tip that slides between knit loops without severing yarns.
   - Wedge / Cutting Points: Chisel edges for leather and vinyl.

2. Thread Engineering (Tex System):
   - Core-Spun Polyester (poly-wrapped polyester filament): Superior tensile strength and heat resistance.
   - Tex Sizing: Tex 24 (fine shirting), Tex 40 (general apparel), Tex 80 (heavy denim topstitching).`
    },
    {
      track_id: track1Id,
      title: "Standardized ASTM D6193 Seam Classifications",
      order_index: 3,
      content: `### The 6 Universal Industrial Seam Classes

1. Standardized ASTM Seam Types:
   - Class SS (Superimposed): Plain seams (SSa), French seams (SSae) encasing raw edges within double stitching.
   - Class LS (Lapped Seams): Flat-felled seams (LSc) with double topstitching for rugged denim and workwear.
   - Class BS (Bound Seams): Hong Kong bias binding (BSa) encasing raw seam allowances in silk or satin strips.
   - Class FS (Flat Seams): 4-needle coverstitch flatlock (FSa) for zero-chafing activewear.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Structural Interfacing, Stay-Stitching and Understitching",
      order_index: 1,
      content: `### Stabilization Techniques and Edge Control

1. Fabric Stabilization Protocols:
   - Interfacing: Applying fusible weft-insertion or woven sew-in canvas to support collars, lapels, and cuffs without stiffening board-like.
   - Stay-Stitching: Directional straight stitching placed 1/8\" inside the seam allowance on curved necklines and bias cuts to prevent stretching.
   - Understitching: Stitching the seam allowance directly to the inner facing 1/16\" from the seamline to roll the seam invisibly out of sight.`
    },
    {
      track_id: track2Id,
      title: "Master Zipper Insertion, Fly Fronts and Pockets",
      order_index: 2,
      content: `### Precision Closures and Pocket Engineering

1. Precision Closures:
   - Invisible Zipper Insertion: Sewing directly into the teeth coil with specialized grooved presser feet.
   - Trouser Fly Front: Assembling zipper fly shield, curved J-stitch topstitching template, and bartack reinforcement.

2. Pocket Construction:
   - In-seam pockets with stay tape, patch pockets with mitered corners and top corner bartacks, and Double-Welt (Besom) pockets with internal pocket bags.`
    },
    {
      track_id: track2Id,
      title: "Collar Engineering, Sleeve Setting and Tailored Structure",
      order_index: 3,
      content: `### 3D Component Assembly and Sleeve Insertion

1. Collar Construction:
   - Two-piece shirt collar with separate collar stand; trimming and grading internal seam allowances to eliminate edge bulk.

2. Set-In Sleeve Insertion:
   - Distributing 1.0\" to 1.5\" of sleeve cap ease smoothly over the upper armscye without forming puckers.
   - Inserting bias-cut wool sleeve heads and tailored shoulder pads to support a rounded, wrinkle-free sleeve crown.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Thermal Pressing Physics and Atelier Molding Tools",
      order_index: 1,
      content: `### The 4 Variables of Pressing and Shaping

1. The 4 Pressing Variables:
   - Heat + Steam (relaxing fiber hydrogen bonds) + Mechanical Pressure + Rapid Cooling with a Wooden Clapper (locking the newly molded shape into place).

2. Specialized Atelier Pressing Tools:
   - Tailor's Ham: Pressing curved darts and 3D bust contours.
   - Seam Roll: Pressing tubular sleeves without leaving ridge impressions.
   - Wooden Clapper: Absorbing steam to produce razor-sharp wool jacket edges.`
    },
    {
      track_id: track3Id,
      title: "Bespoke Floating Canvas Tailoring vs Fused Construction",
      order_index: 2,
      content: `### Jacket Architecture: Bespoke vs Ready-to-Wear

1. Full Floating Canvas Construction:
   - An internal chest piece made of natural horsehair canvas, wool flannel, and chest felt pad-stitched by hand to the jacket front.
   - Allows the wool fabric to drape naturally and mold to the wearer's body shape over time without bubbling.

2. Fused Construction:
   - Heat-activated adhesive interfacings applied via industrial fusing presses for rapid mass production.`
    },
    {
      track_id: track3Id,
      title: "Factory Quality Assurance (QA) and AQL Inspection Audits",
      order_index: 3,
      content: `### Stitch Quality Metrics and Production Standards

1. Stitches Per Inch (SPI) Standards:
   - 10-12 SPI for standard woven apparel, 14-16 SPI for luxury shirting/silks, 8-10 SPI for heavy denim.

2. Defect Inspection and AQL Audits:
   - Inspecting for skipped stitches, seam puckering, broken stitches, and seam slippage under ISO standards.
   - Conducting Acceptance Quality Limit (AQL 2.5) statistical batch sampling prior to factory shipping.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #104.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In garment sewing technique, what is 'Understitching' and what is its primary purpose?",
      options: [
        "Stitching the seam allowances directly to the inside facing or lining (1/16\" from the seamline) so the facing rolls invisibly inward and does not peek out",
        "Sewing underneath the garment while holding it upside down",
        "Stitching buttons on the bottom of shirts",
        "Sewing pockets on underwear"
      ],
      correct_option_index: 0,
      explanation: "Understitching secures the seam allowances to the facing, preventing the lining/facing from rolling out to the right side.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In sewing machine needle selection, why is a 'Ballpoint / Jersey Needle' specified for sewing knit fabrics instead of a sharp needle?",
      options: [
        "Ballpoint needles are magnetic",
        "Ballpoint needles sew twice as fast",
        "The rounded ball tip pushes between the knit yarn loops without piercing or cutting the delicate synthetic filaments, preventing holes and ladder runs",
        "Sharp needles are illegal in clothing factories"
      ],
      correct_option_index: 2,
      explanation: "Ballpoint needles slide between knit loops rather than piercing filaments, preventing fiber breakage and laddering runs.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In industrial seam classification (ASTM D6193), what is a 'French Seam' (Class SSae)?",
      options: [
        "A seam sewn with red, white, and blue thread",
        "A double-stitched enclosed seam where the raw fabric edges are completely encased inside a finished stitched fold, used in luxury sheer and silk garments",
        "A seam glued together with fabric cement",
        "An open raw edge that has been burned"
      ],
      correct_option_index: 1,
      explanation: "French seams encase raw fabric edges inside a clean folded seam, providing high-end durability for sheer, delicate fabrics.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What are the 4 fundamental physical variables required in professional garment pressing to mold wool and lock in sharp creases?",
      options: [
        "Ice, Air, Water, and Fire",
        "Starch, Detergent, Bleach, and Perfume",
        "Scissors, Pins, Thread, and Rulers",
        "Heat, Steam (relaxing fiber bonds), Mechanical Pressure, and Rapid Cooling (locking the new shape)"
      ],
      correct_option_index: 3,
      explanation: "Pressing uses heat and steam to soften fibers, pressure to shape them, and rapid cooling to lock the molecular bonds in place.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In denim and workwear manufacturing, what heavy-duty seam type (ASTM Class LSc) features two parallel visible rows of topstitching encasing both folded raw edges?",
      options: [
        "Flat-Felled Seam",
        "Basting stitch",
        "Zigzag stitch",
        "Blind hem"
      ],
      correct_option_index: 0,
      explanation: "Flat-felled seams interlock two folded raw edges with two parallel stitch lines, providing maximum structural tear resistance in jeans.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In overlock and serger sewing machines, how does the 'Differential Feed' mechanism prevent wavy stretched seams when sewing stretchy knit fabrics?",
      options: [
        "By oiling the needle automatically",
        "By cutting the thread with a laser",
        "By heating the metal presser foot",
        "By moving the front feed dog faster than the rear feed dog (ratio >1.0), gently gathering and feeding excess fabric into the needle to counter stretching"
      ],
      correct_option_index: 3,
      explanation: "A differential feed ratio >1.0 feeds more fabric into the stitch zone, neutralizing mechanical stretch and preventing lettuce-edge waves.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In garment construction prep, what is 'Stay-Stitching' and where must it be applied?",
      options: [
        "A permanent decorative embroidery stitch",
        "A directional row of straight stitching placed 1/8\" inside the seam allowance on curved necklines, armholes, and bias edges to prevent fabric distortion during handling",
        "A stitch used only to attach brand labels",
        "A stitch that washes away in water"
      ],
      correct_option_index: 1,
      explanation: "Stay-stitching stabilizes curved and bias-cut edges immediately after cutting, preventing stretching out of shape during assembly.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In bespoke suiting and tailoring, what is the defining structural advantage of a 'Full Floating Canvas' jacket construction compared to a 'Fused' jacket?",
      options: [
        "The floating horsehair canvas chest piece is stitched loosely to the wool, allowing the garment to drape naturally, breathe, and mold to the wearer's body contours over time without bubbling",
        "Floating canvas makes jackets 100% waterproof",
        "Floating canvas allows jackets to float on water",
        "Fused jackets are always more expensive and durable"
      ],
      correct_option_index: 0,
      explanation: "Floating canvas allows natural movement and molds to body contours with wear, avoiding the stiff bubbling of glued fused interfacings.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In high-end dressmaking and couture, what is a 'Hong Kong Finish' (ASTM Class BSa)?",
      options: [
        "A silk screen print made in Hong Kong",
        "A plastic zipper closure",
        "A bound seam finish where the raw edge of each seam allowance is individually encased in a narrow strip of lightweight bias-cut silk or satin tape",
        "A raw edge trimmed with pinking shears"
      ],
      correct_option_index: 2,
      explanation: "Hong Kong binding encases raw seam edges individually in lightweight bias tape, providing an unlined luxury finish.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What specialized wooden pressing tool is used by master tailors to pound steam into wool seamlines and instantly cool them into razor-sharp creases?",
      options: [
        "A wooden ruler",
        "A rolling pin",
        "A wooden hanger",
        "A Hardwood Tailor's Clapper"
      ],
      correct_option_index: 3,
      explanation: "A tailor's clapper is applied immediately after steaming; the dense hardwood traps steam and cools wool into crisp, permanent creases.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "When setting a tailored Set-In Sleeve into a jacket bodice, why is a bias-cut 'Sleeve Head' (wadding strip) inserted along the upper sleeve cap seam?",
      options: [
        "To make the sleeve waterproof",
        "To fill out the upper sleeve crown and prevent the eased sleeve cap allowance from collapsing or indenting into a sharp cliff edge, creating a smooth rounded roll",
        "To attach the cuff buttons",
        "To tighten the armpit seam"
      ],
      correct_option_index: 1,
      explanation: "Sleeve heads cushion the cap seam allowance, creating a proud, rounded shoulder crown without hollows or indentations.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In apparel quality control metrics, what is the standard 'Stitches Per Inch' (SPI) specification for luxury dress shirts and fine silk blouses?",
      options: [
        "4 to 6 SPI",
        "25 to 30 SPI",
        "14 to 16 SPI (tight, fine stitches providing superior seam strength, clean drape, and refined aesthetics on lightweight fabrics)",
        "SPI is never measured in factories"
      ],
      correct_option_index: 2,
      explanation: "Luxury fine wovens and shirting require 14-16 SPI for strong, delicate, puckering-free seams.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In trouser construction, what is the purpose of sewing a 'Fly Shield' behind the front zipper insertion?",
      options: [
        "To protect the wearer's skin and undergarments from getting caught or pinched in the metal zipper teeth and provide structural backing for the fly",
        "To hold coins inside the pants",
        "To make pants legs wider",
        "To prevent pants from falling down"
      ],
      correct_option_index: 0,
      explanation: "The fly shield acts as a protective fabric guard between the metal zipper coils and the wearer's body.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In factory garment production quality auditing, what does an 'AQL 2.5' (Acceptable Quality Limit) standard mandate?",
      options: [
        "Every single garment can have 2.5 holes",
        "Workers are paid $2.50 per hour",
        "Garments must weigh 2.5 kilograms",
        "A statistical sampling standard defining the maximum allowable percentage of defective garments in a batch during final inspection before the entire shipment is rejected"
      ],
      correct_option_index: 3,
      explanation: "AQL 2.5 is the standard statistical quality threshold in apparel manufacturing determining batch acceptance or rejection.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In tailored pocket construction, what is a 'Double-Welt' (Besom) pocket?",
      options: [
        "A pocket glued onto the outside of a shirt",
        "A slit pocket opening finished with two narrow, symmetrical fabric welts (lips) framing the horizontal or angled slit opening above an internal pocket bag",
        "A pocket with two zippers",
        "A pocket located inside the shoe"
      ],
      correct_option_index: 1,
      explanation: "A double-welt (besom) pocket features two equal, parallel welts framing the pocket slit opening, standard in fine tailoring.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #104.");
  console.log("Skill #104 update completed successfully!");
}

run();
