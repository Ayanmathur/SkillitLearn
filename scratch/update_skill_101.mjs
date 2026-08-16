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

const skillId = "eeb86bdf-6af2-4c13-b04d-ff624e7d6257";

async function run() {
  console.log("Updating Skill #101: Fashion Sketching & Illustration (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Anatomical Proportions, Fashion Croquis and Dynamic Posing" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Fabric Rendering, Draping Physics and Surface Textures" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Technical Flats, CAD Specification and Production Tech Packs" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Fashion Creative Director & Technical Designer level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The 9-Head and 10-Head Elongated Fashion Canon",
      order_index: 1,
      content: `### Figure Proportions and Stylized Fashion Canons

1. Anatomical Standard vs Fashion Illustration:
   - Realistic human figure: 7.5 to 8 head units in height.
   - High-Fashion Elongated Canon: 9-head or 10-head stylized figure (extending leg length from crotch to ankle to emphasize silhouette drape and garment movement).

2. Head-to-Body Landmarks:
   - Head 1: Crown to Chin.
   - Head 2: Bust line and armpits.
   - Head 3: Natural waistline.
   - Head 4: Hip line and crotch.
   - Head 5-6: Mid-thigh to Knee.
   - Head 7-8: Calves to Ankle.
   - Head 9-10: Extended feet and high-heel arches.`
    },
    {
      track_id: track1Id,
      title: "The Plumb Line, Contrapposto and Dynamic Balance",
      order_index: 2,
      content: `### Gravitational Equilibrium and Runway Poses

1. The Center Plumb Line (Balance Line):
   - A vertical guideline dropped from the pit of the neck (jugular notch) directly down to the weight-bearing foot on the ground, ensuring visual stability.

2. Contrapposto Posing Dynamics:
   - When the hip tilts upward on the weight-bearing side, the shoulder line tilts downward in the opposite direction, creating natural anatomical tension and dynamic runway posture.`
    },
    {
      track_id: track1Id,
      title: "Facial Features, Hands, Feet and Expressive Stylization",
      order_index: 3,
      content: `### Expressive Details and Minimalist Stylization

1. High-Fashion Facial Geometry:
   - Stylized minimalism: Angled jawlines, suggested eye sockets with clean liner, understated lip highlights, and directional hair flow that does not distract from garment architecture.

2. Hands and Footwear:
   - Elegant, elongated fingers with defined knuckle knuckles; constructing high-heel footwear with precise arch curvature and ground contact points.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Draping Mechanics, Gravity and Fold Taxonomy",
      order_index: 1,
      content: `### Textile Physics and The 6 Universal Fold Types

1. Primary Fold Classifications:
   - Pipe Folds: Tubular cylindrical folds hanging freely from a waistband or gathered hem (e.g. flaring skirts).
   - Zigzag Folds: Alternating accordion folds occurring when fabric buckles under compression (e.g. bunched pant hems).
   - Spiral Folds: Fabric wrapping tightly around cylindrical limbs (e.g. fitted sleeves).
   - Diaper / Drop Folds: Fabric draped between two fixed anchor tension points (e.g. cowls and shawls).
   - Half-Lock and Inert Folds: Folds caused by bending joints or pooling on the floor.`
    },
    {
      track_id: track2Id,
      title: "Rendering Sheer, Heavy and Structured Textiles",
      order_index: 2,
      content: `### Material Weight and Visual Translucency

1. Illustrating Fabric Weights:
   - Sheer & Fluid (Chiffon, Silk Organza): Layering translucent watercolor/marker washes with visible underlying limb silhouettes and soft fluid contours.
   - Heavy & Textured (Wool Melange, Tweed, Herringbone): Fine directional cross-hatching, stippling, and thick, weighted edge outlines.
   - Crisp & Structured (Cotton Poplin, Raw Denim): Sharp, angular fold breaks with high-contrast shadows.`
    },
    {
      track_id: track2Id,
      title: "Specular Highlights, Leather, Metallics and Knits",
      order_index: 3,
      content: `### Surface Reflectivity and High-Contrast Rendering

1. Glossy & Specular Surfaces:
   - Patent Leather and Vinyl: Pure white hard-edged specular highlights contrasted against deep saturated dark shadows with zero mid-tone blending.
   - Liquid Satin & Metallics: Graduated reflective light bands following surface contours.

2. Textured Knits:
   - Cable-knit, ribbing, and boucle rendering using rhythmic interlocking loop patterns.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "2D Technical Flats vs Artistic Fashion Illustrations",
      order_index: 1,
      content: `### Design Communication and Orthographic Flats

1. Artistic Illustration vs Technical Flat:
   - Fashion Illustration: Stylized, emotional mood drawing showcasing silhouette, attitude, and movement.
   - 2D Technical Flat (Specification Sketch): Orthographic, black-and-white 2D schematic drawn completely flat with exact geometric symmetry, communicating construction details directly to garment factories.`
    },
    {
      track_id: track3Id,
      title: "Vector Technical Drawing in Adobe Illustrator and CLO 3D",
      order_index: 2,
      content: `### Vector Drafting and 3D Virtual Prototyping

1. Industry Vector Drafting Standards (Adobe Illustrator):
   - Outer Silhouette Outline: 0.75 pt solid stroke.
   - Internal Seam / Style Lines: 0.50 pt solid stroke.
   - Topstitching: 0.25 pt dashed stroke (2 pt dash, 1.5 pt gap).

2. 3D Digital Sampling (CLO 3D, Browzwear):
   - Simulating 2D pattern fit on 3D parametric avatars, reducing physical sample iterations by up to 70%.`
    },
    {
      track_id: track3Id,
      title: "Technical Callouts, Seams and Tech Pack Integration",
      order_index: 3,
      content: `### Factory Tech Pack Documentation

1. Standardized Stitch and Seam Annotations (ASTM D6193):
   - Single-Needle Lockstitch (ISO 301): Standard structural seams.
   - 4-Thread Overlock (ISO 504): Raw edge serging and stretch seams.
   - Flatlock / Coverstitch (ISO 406): Activewear and hem finishes.

2. Tech Pack Components:
   - Front/back technical flats with callout leader lines, point-of-measure (POM) spec sheets, Bill of Materials (BOM), and colorway matrices.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #101.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "What is the standard elongated figure canon typically used in professional high-fashion illustration to dramatize silhouettes?",
      options: [
        "4-head canon",
        "9-head or 10-head elongated canon",
        "20-head canon",
        "5-head canon"
      ],
      correct_option_index: 1,
      explanation: "Fashion illustration traditionally uses a 9-head or 10-head elongated canon to emphasize garment flow and dramatic silhouettes.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In fashion figure drawing, what is the 'Plumb Line' (Balance Line)?",
      options: [
        "A line drawn on sewing patterns for buttons",
        "A measurement of fabric thickness",
        "The hemline of a skirt",
        "A vertical guideline dropped from the pit of the neck directly down to the ground, aligning with the weight-bearing foot to ensure balance"
      ],
      correct_option_index: 3,
      explanation: "The plumb line from the jugular notch to the supporting foot guarantees the croquis looks structurally grounded and balanced.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What is the fundamental difference between an 'Artistic Fashion Illustration' and a '2D Technical Flat'?",
      options: [
        "Artistic illustrations capture emotional mood and stylized movement; Technical Flats are precise, symmetrical black-and-white 2D schematics showing exact construction for factories",
        "Technical flats are always painted in oil paint",
        "Illustrations are only drawn by computers",
        "There is zero difference in fashion design"
      ],
      correct_option_index: 0,
      explanation: "Artistic sketches convey mood and styling, while technical flats communicate exact seams, stitches, and measurements to manufacturing factories.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In vector technical drawing (Adobe Illustrator), how is 'Topstitching' standardly represented on a garment flat?",
      options: [
        "Solid thick red lines",
        "A wavy green zigzag",
        "A fine dashed line (typically 0.25 pt stroke with a 2 pt dash and 1.5 pt gap)",
        "Text descriptions only"
      ],
      correct_option_index: 2,
      explanation: "Fine dashed strokes (0.25 pt) standardly represent topstitching along seams, pockets, and hems on technical flats.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In the taxonomy of drapery folds, what are 'Pipe Folds'?",
      options: [
        "Folds created by water pipes",
        "Cylindrical, tubular folds of fabric that hang freely from a gathered waistband or flared hemline",
        "Folds in ironed dress shirts",
        "Folds inside leather shoes"
      ],
      correct_option_index: 1,
      explanation: "Pipe folds form clean vertical semi-cylinders when excess fabric drapes freely from a single anchor point like a waistband.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In classical contrapposto posing for fashion croquis, what anatomical relationship occurs between the shoulders and hips?",
      options: [
        "Both shoulders and hips tilt in the exact same direction",
        "The head tilts upside down",
        "The hip tilts upward on the weight-bearing leg while the shoulder line tilts downward in the opposite direction to maintain equilibrium",
        "The hips remain completely frozen"
      ],
      correct_option_index: 2,
      explanation: "Contrapposto balances the body by having the shoulder axis tilt in opposition to the tilted pelvic axis.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "When rendering sheer, translucent fabrics like silk chiffon or organza in fashion illustration, what technique creates the illusion of transparency?",
      options: [
        "Layering light translucent color washes over the visible underlying body silhouette and darkening areas where multiple layers of fabric overlap",
        "Using thick opaque white paint",
        "Drawing solid black outlines across the entire garment",
        "Leaving the paper completely blank"
      ],
      correct_option_index: 0,
      explanation: "Sheer fabrics show the underlying skin tone through soft transparent washes, with deeper value only where folds overlap.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In the ASTM D6193 and ISO 4915 international stitch classification, what is an 'ISO 301' stitch?",
      options: [
        "A 6-thread decorative embroidery stitch",
        "A zigzag buttonhole stitch",
        "A blind hem stitch",
        "A standard Single-Needle Lockstitch, formed by an upper needle thread interlocking with a lower bobbin thread"
      ],
      correct_option_index: 3,
      explanation: "ISO 301 (Single-Needle Lockstitch) is the most common structural seam stitch in woven apparel manufacturing.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In 3D fashion design technology, how do virtual prototyping platforms like CLO 3D and Browzwear transform the apparel product development cycle?",
      options: [
        "They eliminate the need to manufacture clothing completely",
        "They simulate 2D CAD pattern pieces on 3D digital parametric avatars with accurate fabric tension physics, reducing physical sampling iterations by up to 70%",
        "They automatically sell clothing on retail websites",
        "They write accounting balance sheets"
      ],
      correct_option_index: 1,
      explanation: "3D virtual prototyping allows designers to verify pattern drape, fit, and proportions digitally before cutting physical fabric.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "When illustrating high-gloss materials like patent leather, latex, or polished vinyl, how should specular highlights be rendered?",
      options: [
        "Using muddy grey gradients",
        "Blending colors smoothly with water",
        "Sharp, hard-edged pure white specular highlights placed directly adjacent to deep, saturated dark shadow tones with minimal mid-tone transition",
        "Covering the entire surface in yellow glitter"
      ],
      correct_option_index: 2,
      explanation: "High-shine glossy materials exhibit abrupt, high-contrast white specular highlights with crisp edges and minimal diffuse mid-tones.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In garment production tech packs, what is a 'Point of Measure' (POM) specification sheet?",
      options: [
        "A standardized technical measurement chart defining exact dimensional tolerances (e.g. chest width, sleeve length, collar sweep) across all graded production sizes",
        "A map showing the location of the garment factory",
        "A list of fabric dye chemicals",
        "An invoice for shipping freight"
      ],
      correct_option_index: 0,
      explanation: "POM spec sheets establish precise measurements and allowable manufacturing tolerances for every size in a production run.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In drapery physics, what causes 'Zigzag Folds' to form in a garment?",
      options: [
        "Fabric floating in zero gravity",
        "Ironing fabric with high heat",
        "Stretching fabric until it tears",
        "A tubular piece of fabric (like a pant leg or fitted sleeve) buckling and collapsing under compression as it strikes a solid resistance point (like an ankle or shoe)"
      ],
      correct_option_index: 3,
      explanation: "Zigzag folds occur when compressive downward force causes tubular fabric to collapse into alternating angular breaks.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In apparel technical design standards, what are the standard hierarchical vector line weights used in professional 2D CAD flats?",
      options: [
        "All lines must be 5.0 pt",
        "0.75 pt for the outer garment perimeter silhouette, 0.50 pt for internal construction seams and darts, and 0.25 pt dashed for topstitching",
        "Lines are drawn without stroke weights",
        "Red lines for front, blue lines for back"
      ],
      correct_option_index: 1,
      explanation: "Line weight hierarchy (0.75pt outer, 0.50pt internal, 0.25pt topstitch) ensures clear visual legibility for factory patternmakers.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In knitwear and activewear manufacturing, why is an 'ISO 406' / 'ISO 504' Overlock/Coverstitch specified over a standard lockstitch for stretch seams?",
      options: [
        "Lockstitches are too pretty for activewear",
        "Overlock stitches use zero thread",
        "Overlock and coverstitch seam constructions incorporate looping chain structures that stretch elastically with knit fabrics without snapping the thread under tension",
        "Lockstitches are illegal in athletic apparel"
      ],
      correct_option_index: 2,
      explanation: "Chainstitch and overlock thread loop geometries provide elastic stretch, preventing seam popping in stretch garments.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In the anatomy of drapery, what is a 'Diaper Fold' (Drop Fold)?",
      options: [
        "A sagging, curved drape of fabric created between two distinct, separate suspension tension points (such as a cowl neckline or draped cape)",
        "A fold found only on infant clothing",
        "A tight crease pressed into trousers",
        "A vertical seam along a jacket center back"
      ],
      correct_option_index: 0,
      explanation: "Diaper/drop folds form graceful, catenary curves of draped fabric suspended between two fixed support points.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #101.");
  console.log("Skill #101 update completed successfully!");
}

run();
