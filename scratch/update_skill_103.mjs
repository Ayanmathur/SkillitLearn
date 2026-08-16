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

const skillId = "6e541451-0dd6-4edc-8f34-706ebe80b0e0";

async function run() {
  console.log("Updating Skill #103: Pattern Making Basics (9 steps across 3 tracks)...");

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

  // Delete excess tracks if > 3
  if (tracks.length > 3) {
    const extraTrackIds = tracks.slice(3).map(t => t.id);
    await supabase.from("steps").delete().in("track_id", extraTrackIds);
    await supabase.from("tracks").delete().in("id", extraTrackIds);
    tracks = tracks.slice(0, 3);
  }

  // Ensure exactly 3 tracks exist
  while (tracks.length < 3) {
    const { data: newTrack } = await supabase
      .from("tracks")
      .insert({
        skill_id: skillId,
        title: `Track ${tracks.length + 1}: Pattern Making Basics`,
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
  await supabase.from("tracks").update({ title: "Track 1: Anthropometric Measurement, Ease and Foundation Slopers" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Dart Manipulation, Slash-and-Spread and Contouring Mechanics" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Pattern Drafting Conventions, Seam Allowances and Grading" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Master Patternmaker & Technical Apparel Director level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Anatomical Landmarks and Body Measurement Architecture",
      order_index: 1,
      content: `### Anthropometry and Body Landmark Geometry

1. Primary Anatomical Reference Landmarks:
   - 7th Cervical Vertebra (Nape): Base point for back bodice length.
   - Acromion Point: The bone tip defining shoulder drop and sleeve cap insertion.
   - Bust Apex (Bust Point): Pivotal center for all front bodice dart manipulation.
   - Natural Waistline: Narrowest torso plane.
   - Low Hip (Seat): Widest horizontal circumference around buttocks.

2. Measurement Protocols:
   - Maintaining level horizontal tape positions, ensuring Center Front (CF) and Center Back (CB) plumb line alignment.`
    },
    {
      track_id: track1Id,
      title: "The 5 Fundamental Foundation Slopers (Blocks)",
      order_index: 2,
      content: `### The Master Sloper Architecture

1. What is a Sloper / Block?:
   - A basic 2D flat pattern template drafted to fit a standard 3D dress form closely, containing zero design ease and zero seam allowances.

2. The 5 Foundation Blocks:
   - 1. Front Bodice (with waist and shoulder/bust darts).
   - 2. Back Bodice (with waist and shoulder blade ease darts).
   - 3. Straight Skirt (front and back).
   - 4. Fitted Trouser Block (crotch curve geometry).
   - 5. Set-In Sleeve Block (matching armscye circumference and cap height).`
    },
    {
      track_id: track1Id,
      title: "Ease Classifications: Wearing Ease vs Design Ease vs Negative Ease",
      order_index: 3,
      content: `### Dimension Allocation and Stretch Physics

1. Three Core Ease Categories:
   - Wearing Ease (Functional Comfort): Non-negotiable minimum room added to basic dimensions for breathing, sitting, and mobility (+2\" to +3\" at bust, +1\" at waist, +2\" at hip for rigid wovens).
   - Design Ease: Stylistic volume added for oversized silhouettes, drape, and coats.
   - Negative Ease: Drafting patterns smaller than body measurements (-10% to -25%) for high-stretch knits, swimwear, and compression activewear.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The Bust Apex Pivot and Dart Transfer Methods",
      order_index: 1,
      content: `### Helen Joseph Armstrong Dart Dynamics

1. The Bust Apex Principle:
   - All front bodice contouring radiates 360 degrees around the central bust apex.

2. Dart Manipulation Techniques:
   - The Pivoting Method: Pinning the apex and rotating the sloper to transfer dart intake to new positions.
   - The Slash-and-Spread Method: Slashing from a new seamline to the apex, closing the original dart, and spreading the new opening.
   - Standard Transfers: French dart (low diagonal side seam), armhole dart, neckline dart, and shoulder dart.`
    },
    {
      track_id: track2Id,
      title: "Princess Seams, Gathers, Pleats and Stylelines",
      order_index: 2,
      content: `### Converting Darts into Architectural Seamlines

1. Princess Seam Architecture:
   - Shoulder Princess Seam: Merges shoulder dart and waist dart into a single vertical contouring seam.
   - Armhole Princess Seam: Curves smoothly from the mid-armhole down through the bust apex to the waistline.

2. Creative Volume Transformation:
   - Converting dart intake into neckline gathers, shoulder cowl drapery, radiating tucks, or accordion pleats while preserving identical fit.`
    },
    {
      track_id: track2Id,
      title: "Contouring Principles for Strapless and Cutout Silhouettes",
      order_index: 3,
      content: `### Body Hollows and Gap Elimination

1. The Contouring Theory:
   - Standard slopers bridge smoothly over body depressions; cutaway garments and strapless necklines gap open unless contoured.

2. Contouring Locations:
   - Upper Bust Hollow: Removing 1/4\" to 1/2\" along the strapless neckline.
   - Under-Bust Hollow: Tightening the under-bust plane for corset and empire cuts.
   - Cleavage Hollow: Eliminating center front plunge gaping.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Professional Pattern Drafting Tools and Marking Conventions",
      order_index: 1,
      content: `### Drafting Equipment and Standardized Labeling

1. Professional Drafting Tools:
   - Vary Form / French Curve (shaping armholes and necklines), Fairgate Hip Curve ruler, L-Square, Pattern Awl (punching drill holes), and Notcher.

2. Mandatory Pattern Piece Markings:
   - Grainline Arrow (aligned to warp), Style Number, Garment Piece Name (e.g. \"Front Bodice\"), Cut Quantity (e.g. \"Cut 1 on Fold\" or \"Cut 2 Self\"), Size, and Seam Allowance boundary lines.`
    },
    {
      track_id: track3Id,
      title: "Seam Allowances, Hem Margins, Notches and Drill Holes",
      order_index: 2,
      content: `### Production-Ready Blueprint Specifications

1. Standard Industrial Seam Allowances (SA):
   - 1/4\" (6mm): Enclosed necklines, collars, and curved facings.
   - 1/2\" (12mm): Standard structural side seams and armscyes.
   - 1.5\" to 2.0\": Folded garment hems.

2. Notches and Drill Holes:
   - Single Notch: Identifies Front armhole/sleeve.
   - Double Notch: Identifies Back armhole/sleeve.
   - Dart Drill Holes: Punched 1/2\" backed off from true apex point to prevent visible punch holes on finished garments.`
    },
    {
      track_id: track3Id,
      title: "Pattern Grading Principles and 2D CAD Systems",
      order_index: 3,
      content: `### Multi-Size Production Scaling and CAD Systems

1. Pattern Grading Fundamentals:
   - Proportional scaling of a sample pattern (e.g. Size 6) across Cartesian X (width/circumference) and Y (length) axes to produce a complete graded size run (Sizes 0 to 18).

2. 2D Pattern CAD Software (Gerber AccuMark, Lectra Modaris, Optitex):
   - Digital pattern digitizing, automated grade-rule table application, and automated fabric marker nesting for high marker efficiency (>85% fabric utilization).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #103.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In apparel patternmaking, what is a 'Sloper' (Block)?",
      options: [
        "A finished dress sold in stores",
        "A basic 2D foundation pattern template fitted closely to a standard body form with zero design ease and zero seam allowances",
        "A type of sewing machine needle",
        "A damaged piece of fabric"
      ],
      correct_option_index: 1,
      explanation: "A sloper (block) is the fundamental fitted 2D template with no seam allowances, used as the base for all pattern manipulation.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In industrial pattern notation, what does a 'Single Notch' versus a 'Double Notch' indicate on sleeve and armhole patterns?",
      options: [
        "Single notch is for men; double notch is for women",
        "Single notch means cut 1; double notch means cut 2",
        "Single notch is for summer; double notch is for winter",
        "A Single Notch indicates the Front armhole/sleeve; a Double Notch indicates the Back armhole/sleeve"
      ],
      correct_option_index: 3,
      explanation: "Single notches denote front seams; double notches denote back seams, preventing sleeves from being sewn on backwards.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In patternmaking ease classifications, what is 'Negative Ease'?",
      options: [
        "Drafting pattern dimensions smaller than actual body measurements (e.g. -10% to -25%) so stretch knit fabric hugs the body under tension",
        "Making clothes too big by mistake",
        "Deleting pattern pieces",
        "Failing to sew seam allowances"
      ],
      correct_option_index: 0,
      explanation: "Negative ease is intentionally drafting smaller than body measurements for stretch fabrics like activewear and swimwear.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In bodice dart manipulation, what central anatomical point serves as the 360-degree pivotal axis for all dart transfers?",
      options: [
        "The elbow",
        "The belly button",
        "The Bust Apex (Bust Point)",
        "The shoulder tip"
      ],
      correct_option_index: 2,
      explanation: "All front bodice darts rotate around the central bust apex to create three-dimensional shape over the bust mound.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What are the two most common architectural continuous seams used to combine bodice waist and bust darts into sleek vertical lines?",
      options: [
        "Zip-lock seams and Velcro seams",
        "Shoulder Princess Seams and Armhole Princess Seams",
        "Overlock seams and Flatlock seams",
        "Curved hems and straight hems"
      ],
      correct_option_index: 1,
      explanation: "Princess seams (shoulder or armhole) incorporate dart intake into continuous, flattering vertical structural seams.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In industrial pattern drafting, why are 'Dart Drill Holes' punched 1/2 inch (12mm) backed off from the true bust apex point?",
      options: [
        "To save on paper",
        "Because drill bits are too large",
        "To prevent the punched marker hole from showing on the outside surface of the finished garment after the dart is sewn to the apex",
        "It is an accidental manufacturing error"
      ],
      correct_option_index: 2,
      explanation: "Backing off the drill hole by 1/2 inch ensures the punch mark is hidden entirely inside the dart fold when sewn.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In patternmaking theory, what is 'Contouring' and why is it essential for strapless or deep plunge necklines?",
      options: [
        "Removing excess wedge volume along stylelines to fit skin-tight into anatomical hollows (e.g. above bust, cleavage), preventing gaping when fabric lacks shoulder support",
        "Painting shadows onto fabric",
        "Ironing seams flat with steam",
        "Grading patterns to larger sizes"
      ],
      correct_option_index: 0,
      explanation: "Contouring eliminates excess bridge ease over body hollows, ensuring strapless and plunge necklines cling without gaping.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In pattern drafting, what is the standard industrial Seam Allowance (SA) added for enclosed curved edges like collars and necklines?",
      options: [
        "2.0 inches",
        "1.0 inch",
        "Zero seam allowance",
        "1/4 inch (6mm, to minimize bulk and eliminate the need for excessive seam trimming)"
      ],
      correct_option_index: 3,
      explanation: "1/4 inch (6mm) seam allowances are standard for enclosed collars and facing necklines to reduce bulk inside turns.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What are the two standard methods used by master patternmakers to manipulate and relocate bodice darts?",
      options: [
        "Guessing and shrinking",
        "The Pivoting Method and The Slash-and-Spread Method",
        "Washing and drying",
        "Tracing and deleting"
      ],
      correct_option_index: 1,
      explanation: "Pivoting (rotating the template around the apex) and Slash-and-Spread are the two universal dart transfer techniques.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In digital apparel manufacturing CAD systems (Gerber AccuMark, Lectra, Optitex), what is 'Marker Making'?",
      options: [
        "Drawing on fabric with felt markers",
        "Writing price tags for clothing stores",
        "The digital nesting and arrangement of all multi-size pattern pieces onto a virtual fabric roll layout to maximize fabric utilization efficiency (>85%) and minimize cutting waste",
        "Testing garment water resistance"
      ],
      correct_option_index: 2,
      explanation: "Marker making arranges pattern pieces like a puzzle on the fabric roll to maximize cutting yield and minimize scrap fabric.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In professional pattern grading, how are multi-size production runs generated from a base sample size pattern (e.g. Size 6 to Sizes 0-18)?",
      options: [
        "By applying mathematical Grade Rules that proportionally shift key Cartesian (X, Y) coordinate points at shoulders, armscyes, waist, and hips across size increments",
        "By scaling the entire pattern uniformly by 150% with a photocopier",
        "By re-measuring 50 different human models from scratch",
        "By stretching the fabric after sewing"
      ],
      correct_option_index: 0,
      explanation: "Grading applies specific X and Y coordinate shift values to key pattern points based on anthropometric growth tables.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In trouser pattern drafting, what causes a pants pattern to create uncomfortable 'whiskering' or smile wrinkles pulling across the front crotch?",
      options: [
        "Pants legs are too long",
        "The fabric was dyed incorrectly",
        "The zipper is too long",
        "The front crotch extension is too short or the front crotch curve is drafted too shallow for the wearer's pelvic depth, restricting forward stride room"
      ],
      correct_option_index: 3,
      explanation: "Short crotch extensions or shallow crotch curves pull tight across the pelvis, creating horizontal tension whiskers.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "When drafting a fitted Set-In Sleeve block, what critical geometric relationship must exist between the sleeve cap seamline and the bodice armscye seamline?",
      options: [
        "The sleeve cap must be 5 inches smaller than the armscye",
        "The sleeve cap perimeter must measure slightly larger than the bodice armscye (typically 1\" to 1.5\" of cap ease) to be eased smoothly over the rounded 3D shoulder ball without puckering",
        "The sleeve cap must be completely flat",
        "The armscye must be twice as long as the sleeve cap"
      ],
      correct_option_index: 1,
      explanation: "1 to 1.5 inches of sleeve cap ease is necessary to mold smoothly over the three-dimensional deltoid/shoulder curve.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In bodice drafting, what is a 'French Dart'?",
      options: [
        "A dart sewn only in Paris",
        "A straight vertical dart along center back",
        "A long, low diagonal dart that starts at the lower side seam near the hip/waist and angles upward directly toward the bust apex",
        "A dart sewn with red and blue thread"
      ],
      correct_option_index: 2,
      explanation: "A French dart is a dramatic diagonal low side-seam dart tapering up to the bust apex, creating clean fitted silhouettes.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In skirt patternmaking, what happens if the curved hip line on a straight skirt block is drafted without maintaining a 90-degree right angle at the side seam and waist intersection?",
      options: [
        "The waist seamline will form an unsightly 'V-dip' point or peaked point when the front and back pattern pieces are joined together, ruining the smooth horizontal waistline",
        "The skirt will turn into pants",
        "The zipper will not open",
        "The fabric will tear in the wash"
      ],
      correct_option_index: 0,
      explanation: "Seam intersections must square off at 90 degrees to ensure smooth, continuous lines without V-notches or peaks when sewn.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #103.");
  console.log("Skill #103 update completed successfully!");
}

run();
