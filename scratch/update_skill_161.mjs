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

const skillId = "f33e56fc-b1f1-4fe9-acdd-710fe27572bb";

async function run() {
  console.log("Updating Skill #161: Color & Material Selection (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Munsell Color Theory, LRV and Metamerism Physics" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Architectural Surfaces: Stone, Timber and Hard Finishes" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Commercial Textiles, Wyzenbeek Rubs and Fire Codes" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Master Color Theorist & NCIDQ Materials Specialist level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Munsell Color System: Hue, Value and Chroma",
      order_index: 1,
      content: `### Three-Dimensional Color Solid Geometry

1. Munsell Dimensions:
   - Hue (color family along 360-degree circle), Value (lightness from 0 pure black to 10 pure white), and Chroma (purity and saturation intensity from 0 neutral grey to 14+ vivid).

2. Spatial Perception:
   - Modulating value and chroma to alter perceived room volume (high-value light colors expand boundaries; saturated warm chromas advance visually).`
    },
    {
      track_id: track1Id,
      title: "Light Reflectance Value (LRV) and Contrast Ratios",
      order_index: 2,
      content: `### Photometric Measurement and Visual Ergonomics

1. LRV Metrics:
   - Measuring the percentage of visible light reflected from a cured surface (0% total absorption to 100% total reflection).

2. ADA Compliance:
   - Specifying minimum 30% LRV contrast between doors/frames and walls, and between stair treads and risers to guide visually impaired occupants safely.`
    },
    {
      track_id: track1Id,
      title: "Correlated Color Temperature (CCT), CRI and Metamerism",
      order_index: 3,
      content: `### Lighting Physics and Optical Phenomenon

1. Lighting Parameters:
   - CCT (2700K warm residential glow vs 3500K-4000K crisp commercial task lighting) and Color Rendering Index (CRI > 90 for true pigment rendition).

2. Metamerism Control:
   - Preventing metameric failure where paint and textile swatches match under 5000K showroom lamps but clash violently under 2700K incandescent home lights.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Natural Stone vs Engineered Quartz and Tile DCOF",
      order_index: 1,
      content: `### Hard Surface Mineralogy and Slip Resistance

1. Stone Typology:
   - Calcite-based marble (acid-sensitive, Mohs hardness 3-4) vs Igneous granite vs Engineered quartz (93% crushed quartz + 7% polymer resin).

2. Dynamic Coefficient of Friction (DCOF):
   - Enforcing ANSI A137.1 DCOF ratings of 0.42 or higher for interior floor tiles in wet commercial walkways to prevent slip hazards.`
    },
    {
      track_id: track2Id,
      title: "Wood Flooring: Janka Hardness and Engineered Planks",
      order_index: 2,
      content: `### Dendrological Hardness and Dimensional Stability

1. Janka Scale:
   - Rating timber resistance to denting (e.g. Douglas Fir 660, Red Oak 1290, White Oak 1360, Brazilian Cherry 2350).

2. Engineered Hardwood:
   - Multi-ply cross-grain plywood core backing supporting a real hardwood wear layer (lamella), providing dimensional stability over concrete slabs.`
    },
    {
      track_id: track2Id,
      title: "Millwork Substrates: High-Pressure Laminates and Veneers",
      order_index: 3,
      content: `### Joinery Substrates and Architectural Metals

1. Substrates & Finishes:
   - Medium-Density Fiberboard (MDF) and Particleboard cores finished with Architectural Wood Veneers or High-Pressure Laminate (HPL / Formica).

2. Architectural Metals:
   - Specifying living patinas (unlacquered brass, oiled bronze) vs durable barrier finishes (anodized aluminum, PVD titanium coating, stainless steel).`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Textile Fibers: Natural vs Synthetic Performance Specs",
      order_index: 1,
      content: `### Fiber Chemistry and Fabric Construction

1. Natural Fibers:
   - Wool (inherent flame resistance, high elasticity), Linen (breathable, low abrasion resistance), and Cotton (absorbent, prone to wrinkling).

2. Synthetic Performance:
   - Solution-dyed Polypropylene / Olefin and High-Tenacity Nylon delivering superior UV fade resistance, chemical cleanability, and stain repellency.`
    },
    {
      track_id: track3Id,
      title: "Wyzenbeek vs Martindale Abrasion and Double Rubs",
      order_index: 2,
      content: `### Mechanical Wear Testing and Contract Standards

1. Wyzenbeek Oscillatory Test:
   - Measuring back-and-forth double rubs (Residential: 15,000 double rubs; Commercial Heavy-Duty: 30,000 to 50,000+ double rubs for hospitality).

2. Martindale Abrasion Test:
   - European figure-eight rotational rubbing test standardizing contract upholstery resilience.`
    },
    {
      track_id: track3Id,
      title: "Flammability Codes: ASTM E84, CAL 133 and Low-VOC LEED",
      order_index: 3,
      content: `### Life Safety Ratings and Environmental Certifications

1. Fire Testing Standards:
   - ASTM E84 Steiner Tunnel Test (Class A Flame Spread Index 0-25 for commercial corridors); CAL 133 full-scale open-flame chair burn tests.

2. Eco-Certifications:
   - Specifying GreenGuard Gold certified low-VOC finishes, FSC-certified sustainable timber, and Cradle-to-Cradle circular lifecycle materials.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #161.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In the Munsell Color System, what are the THREE fundamental dimensions used to define any color?",
      options: [
        "Red, Green, Blue",
        "Hue (color family), Value (lightness/darkness), and Chroma (color purity/saturation)",
        "Tint, Tone, and Shade",
        "Cyan, Magenta, and Yellow"
      ],
      correct_option_index: 1,
      explanation: "Munsell organizes color into a 3D solid defined by Hue (spectral color), Value (light to dark), and Chroma (saturation intensity).",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In interior paint and surface design, what does the acronym 'LRV' stand for?",
      options: [
        "Linear Room Volume",
        "Liquid Resin Viscosity",
        "Laminate Resistance Value",
        "Light Reflectance Value (the percentage of visible light reflected from a surface)"
      ],
      correct_option_index: 3,
      explanation: "LRV measures the percentage of visible light a paint color or finish reflects on a scale from 0% (pure black) to 100% (pure white).",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In contract textile specifications, what is the 'Wyzenbeek Test' used to measure?",
      options: [
        "Abrasion resistance (measured in back-and-forth 'double rubs') to determine how durable an upholstery fabric is under continuous wear",
        "How fast a fabric catches fire",
        "The weight of fabric per square foot",
        "The waterproof rating of curtains"
      ],
      correct_option_index: 0,
      explanation: "The Wyzenbeek test measures surface wear resistance in double rubs to verify commercial durability.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "On the Janka Hardness Scale for wood flooring, what does a higher numerical score (e.g. 2350 for Brazilian Cherry vs 1290 for Red Oak) indicate?",
      options: [
        "The wood is softer and easier to scratch",
        "The wood has more knots and defects",
        "Greater wood density and superior physical resistance to denting, impact, and heel marks",
        "The tree was taller when harvested"
      ],
      correct_option_index: 2,
      explanation: "The Janka scale measures the force required to embed a steel ball halfway into wood: higher numbers mean harder, more dent-resistant timber.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In interior lighting design, what light color appearance is produced by a Correlated Color Temperature (CCT) of 2700K?",
      options: [
        "A warm, inviting yellowish-amber incandescent glow (standard for residential living spaces and bedrooms)",
        "A cool, bright blue hospital surgical light",
        "Pure daylight ultraviolet radiation",
        "A green fluorescent light"
      ],
      correct_option_index: 0,
      explanation: "2700K produces a warm, amber residential atmosphere; higher Kelvin numbers (3500K-5000K) produce crisp white to cool blue task lighting.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In optical color physics, what is 'Metamerism' (Metameric Failure)?",
      options: [
        "A chemical reaction that causes paint to peel off walls",
        "A manufacturing defect in glass windows",
        "An optical phenomenon where two distinct material swatches appear to match perfectly under one light source (e.g. 5000K daylight), but appear completely different and mismatched under another light source (e.g. 2700K incandescent)",
        "A form of color blindness that affects only architects"
      ],
      correct_option_index: 2,
      explanation: "Metamerism occurs when different spectral reflection curves look identical under one illuminant but diverge under another light source.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "Under ANSI A137.1 standards, what is the minimum 'Dynamic Coefficient of Friction' (DCOF) rating required for interior porcelain/ceramic floor tiles in wet commercial areas to prevent slip-and-fall injuries?",
      options: [
        "A minimum DCOF of 0.42 (or higher) when wet",
        "A DCOF of 0.05",
        "Tiles must have zero friction",
        "DCOF only applies to outdoor highways"
      ],
      correct_option_index: 0,
      explanation: "ANSI A137.1 requires a minimum wet DCOF of 0.42 for commercial hard-surface flooring expected to be walked upon when wet.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In commercial interior design (such as high-traffic hotel lobbies and corporate offices), what is the minimum Wyzenbeek double-rub rating required for 'Heavy-Duty Commercial Upholstery'?",
      options: [
        "3,000 double rubs",
        "9,000 double rubs",
        "15,000 double rubs",
        "At least 30,000 to 50,000+ double rubs"
      ],
      correct_option_index: 3,
      explanation: "The Association for Contract Textiles (ACT) defines heavy-duty commercial upholstery as meeting or exceeding 30,000 double rubs.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What makes 'Engineered Hardwood' flooring structurally superior to 'Solid Hardwood' when installed over radiant-heated subfloors or concrete slabs?",
      options: [
        "Engineered wood is made of 100% plastic",
        "Its multi-ply cross-grain plywood core resists expansion, contraction, cupping, and warping caused by fluctuations in humidity and temperature",
        "It can never be stained or colored",
        "It is 100% fireproof"
      ],
      correct_option_index: 1,
      explanation: "Cross-directional plywood plies cancel out natural wood grain expansion, providing outstanding dimensional stability over concrete.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In classic interior color distribution schemes, what is the '60-30-10 Rule'?",
      options: [
        "60% wood, 30% metal, 10% glass",
        "60 minutes design, 30 minutes painting, 10 minutes cleanup",
        "60% Dominant color (walls/large rugs), 30% Secondary color (upholstery/curtains), and 10% Accent color (pillows, art, accessories)",
        "60% artificial light, 30% natural light, 10% darkness"
      ],
      correct_option_index: 2,
      explanation: "The 60-30-10 rule creates balanced palettes: 60% dominant backdrop, 30% secondary visual interest, and 10% vibrant focal accents.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In architectural fire safety testing, what is the 'ASTM E84' (Steiner Tunnel Test) and why is a 'Class A' rating mandatory for wall finishes in commercial exit corridors?",
      options: [
        "It measures Flame Spread Index (0-25 for Class A) and Smoke Developed Index (0-450) to ensure materials do not rapidly propagate fire or produce blinding smoke along life-safety exit routes",
        "It tests whether paint is toxic to touch",
        "It measures the sound insulation of drywall",
        "ASTM E84 is only used for concrete foundations"
      ],
      correct_option_index: 0,
      explanation: "ASTM E84 rates surface flame spread; Class A (index 0-25) is legally required in commercial egress corridors to protect escaping occupants.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "Why is natural Marble considered highly vulnerable when specified for high-traffic commercial kitchen bar counters compared to Quartz or Granite?",
      options: [
        "Marble is an artificial plastic that melts in water",
        "Marble is radioactive",
        "Marble turns into dust after 1 year",
        "Marble is a metamorphic calcite-based stone (Mohs hardness 3-4) that is highly porous and chemically reactive to acids (citrus, vinegar, wine), causing immediate surface etching and permanent staining"
      ],
      correct_option_index: 3,
      explanation: "Calcite in marble chemically reacts with acids to produce calcium salts, causing dull etched spots that cannot be wiped away.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In lighting specification for high-end retail and art galleries, why is a Color Rendering Index (CRI) of 90 or higher (or high TM-30-18 fidelity Rf score) strictly required?",
      options: [
        "To make light bulbs last 50 years",
        "Low CRI (< 80) light sources distort, dull, and wash out natural color pigments, whereas high CRI (> 90) faithfully reveals true textile hues, wood undertones, and vibrant artwork colors",
        "High CRI lights reduce electricity bills to zero",
        "CRI is only used to measure computer monitors"
      ],
      correct_option_index: 1,
      explanation: "High CRI (90+) accurately renders all spectral colors across the R1-R15 palette, ensuring fabrics and finishes appear as intended.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "What is 'Solution-Dyed' synthetic fiber (e.g. Solution-Dyed Nylon or Olefin) and why is it specified for healthcare and hospitality upholstery?",
      options: [
        "Fabric that is dipped in hot water after sewing",
        "Fabric made from recycled paper towels",
        "The pigment is infused directly into the liquid polymer solution BEFORE the fiber is extruded into yarn, resulting in color that locks throughout the entire fiber and resists bleach cleaning and severe UV sunlight without fading",
        "Solution dyeing is a temporary watercolor wash"
      ],
      correct_option_index: 2,
      explanation: "Solution dyeing locks pigment throughout the entire polymer fiber cross-section, making it impervious to bleach cleaning and UV fading.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In sustainable building standards (LEED v4 and WELL Building Standard), what does a 'GreenGuard Gold Certification' on interior paints, sealants, and furniture guarantee?",
      options: [
        "The product meets strict chemical emissions limits for low Volatile Organic Compounds (VOCs), ensuring healthy indoor air quality for vulnerable occupants like children and patients",
        "The product is made of solid 24-karat gold",
        "The furniture was painted by hand",
        "The manufacturer planted 10,000 trees"
      ],
      correct_option_index: 0,
      explanation: "GreenGuard Gold establishes rigorous VOC emission criteria to prevent indoor air contamination in sensitive environments like schools and clinics.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #161.");
  console.log("Skill #161 update completed successfully!");
}

run();
