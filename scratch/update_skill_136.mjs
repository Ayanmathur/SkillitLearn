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

const skillId = "a61e2d80-d7c3-4770-ab02-b2bf2da5b768";

async function run() {
  console.log("Updating Skill #136: Design Principles (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Gestalt Psychology, Visual Hierarchy and Balance" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Grid Systems, Swiss Typography and Active Negative Space" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Color Harmonies, Semiotics and WCAG Accessibility" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Design Faculty & Creative Director level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Gestalt Laws of Visual Perception in Graphic Design",
      order_index: 1,
      content: `### Perceptual Grouping and Cognitive Psychology

1. Gestalt Principles:
   - Proximity: Elements positioned in close spatial proximity are perceived as a unified functional group.
   - Similarity: Objects sharing color, geometry, or scale are categorized together.
   - Closure: The human visual system automatically bridges gaps to perceive incomplete shapes as whole objects (e.g. WWF Panda logo).
   - Figure-Ground: Distinguishing primary subjects from negative background space.`
    },
    {
      track_id: track1Id,
      title: "Visual Hierarchy, Focal Points and Reading Scans (F vs Z)",
      order_index: 2,
      content: `### Attention Direction and Eye-Tracking Scans

1. Dominant Focal Points:
   - Establishing primary visual entry points using scale contrast, color isolation, and typographic weight.

2. Reading Scan Models:
   - Gutenberg Diagram: Gravity-driven diagonal scanning across structured documents.
   - Z-Pattern: Eye trajectory across landing pages and visual ads.
   - F-Pattern: Scanning behavior across text-dense editorial layouts.`
    },
    {
      track_id: track1Id,
      title: "Symmetrical, Asymmetrical and Radial Balance Systems",
      order_index: 3,
      content: `### Compositional Weight and Dynamic Tension

1. Symmetrical Balance:
   - Bilateral mirror-image alignment conveying stability, formal authority, and classical elegance.

2. Asymmetrical Balance:
   - Offsetting a large low-contrast object with a compact, high-contrast, heavily weighted visual element to generate energy and dynamic equilibrium.
   - Radial Balance: Elements radiating outward from a central focal core.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Josef Müller-Brockmann Swiss Grid Systems and Anatomy",
      order_index: 1,
      content: `### Cartesian Order and International Typographic Style

1. Swiss Grid Theory (Josef Müller-Brockmann):
   - Imposing mathematical discipline and proportional structure across graphic layouts.

2. Anatomy of a Grid:
   - Margins (outer boundary padding), Columns (vertical content channels), Gutters (spaces between columns), Modules (individual grid units), and Flowlines (horizontal alignment anchors).`
    },
    {
      track_id: track2Id,
      title: "Modular, Column and Baseline Grids (The 8pt System)",
      order_index: 2,
      content: `### Structural Grid Topologies and Vertical Rhythm

1. Column and Modular Grids:
   - 12-column responsive frameworks providing flexible multi-span arrangements (1/2, 1/3, 1/4, 1/6 page divisions).

2. Baseline Grids & The 8pt System:
   - Locking typographic baselines to a uniform vertical increment (8pt/4pt system) ensuring text across adjacent columns aligns across horizontal planes.`
    },
    {
      track_id: track2Id,
      title: "Active Negative Space (White Space) and Cognitive Load",
      order_index: 3,
      content: `### Intentional Whitespace and Cognitive Hierarchy

1. Micro vs Macro White Space:
   - Micro White Space: Kerning between letters, leading between lines, and padding around UI buttons.
   - Macro White Space: Generous negative borders surrounding major layout sections.

2. Cognitive Load:
   - Strategic whitespace prevents visual clutter, lowers cognitive processing effort, and elevates perceived brand luxury.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Color Harmonies, Simultaneous Contrast and Josef Albers",
      order_index: 1,
      content: `### Color Wheels and Interaction of Color

1. Harmonic Palettes:
   - Monochromatic, Analogous, Complementary, Split-Complementary, Triadic, and Tetradic color schemes.

2. Josef Albers' Interaction of Color:
   - Simultaneous Contrast: Demonstrating that a single color appears visually altered depending on the surrounding background hue and value.`
    },
    {
      track_id: track3Id,
      title: "Cultural Semiotics and Emotional Color Psychology",
      order_index: 2,
      content: `### Psychological Associations and Contextual Semiotics

1. Symbolic Color Meaning:
   - Red: Urgency, energy, danger, and auspicious prosperity in East Asian culture.
   - Blue: Corporate security, trust, and serenity.
   - Green: Organic nature, freshness, financial stability, and renewal.

2. Saturation and Value:
   - High-saturation tones convey kinetic vibrancy; muted, low-saturation tones communicate sophistication.`
    },
    {
      track_id: track3Id,
      title: "WCAG 2.1 Contrast Ratios and Color Blindness (CVD)",
      order_index: 3,
      content: `### Inclusive Accessibility and Contrast Compliance

1. WCAG 2.1 Contrast Standards:
   - Normal text requires at least 4.5:1 contrast ratio against backgrounds (Level AA) or 7:1 (Level AAA); Large text (18pt+ or 14pt bold) requires 3:1 (Level AA).

2. Color Vision Deficiency (CVD):
   - Designing for Deuteranopia, Protanopia, and Tritanopia by pairing color coding with iconography, shape, and text labels.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #136.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In Gestalt psychology and graphic design, what does the 'Law of Proximity' state?",
      options: [
        "Visual elements placed close to one another are perceived by the human brain as belonging together in a unified group",
        "Objects must always be colored red",
        "Text must be centered on the page",
        "Images must take up the entire screen"
      ],
      correct_option_index: 0,
      explanation: "The Law of Proximity states that items situated near each other are cognitively perceived as a related unit.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In Web Content Accessibility Guidelines (WCAG 2.1 Level AA), what is the minimum required contrast ratio for standard body text against its background?",
      options: [
        "1:1",
        "100:1",
        "4.5:1",
        "2:1"
      ],
      correct_option_index: 2,
      explanation: "WCAG 2.1 Level AA requires a minimum 4.5:1 contrast ratio for regular body text (and 3:1 for large text).",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In layout design, what is 'Negative Space' (White Space)?",
      options: [
        "Empty space that was left behind by accident and should be filled immediately",
        "The unmarked, unoccupied area surrounding and between visual elements and typography, used intentionally to reduce clutter, enhance readability, and create visual hierarchy",
        "Space on a computer hard drive",
        "A black hole in space"
      ],
      correct_option_index: 1,
      explanation: "Negative space is an active compositional tool that frames subjects, organizes hierarchy, and eases cognitive reading load.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In color theory, what is a 'Complementary Color Scheme'?",
      options: [
        "Colors that give nice compliments to each other",
        "Using only shades of gray",
        "Three colors located immediately next to each other on the color wheel",
        "Two colors positioned directly opposite each other on the color wheel (such as blue and orange, or red and green), creating high visual contrast and vibrant energy"
      ],
      correct_option_index: 3,
      explanation: "Complementary colors sit opposite each other on the color wheel, creating maximum chromatic contrast.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In Swiss graphic design and grid anatomy, what is a 'Gutter'?",
      options: [
        "The blank spacing channel between adjacent layout columns that prevents text and imagery from colliding",
        "The outer margin of a piece of paper",
        "The line at the very bottom of a book",
        "The title at the top of a webpage"
      ],
      correct_option_index: 0,
      explanation: "Gutters are the negative spaces between adjacent grid columns that separate content modules.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In Gestalt theory, what is the 'Law of Closure' and how is it used in famous logo design (such as the WWF Panda or IBM logo)?",
      options: [
        "A law that forces companies to close on weekends",
        "A rule stating that all shapes must be surrounded by heavy black borders",
        "A requirement to close all open browser tabs",
        "The human visual system naturally bridges gaps and mentally fills in missing visual information to perceive an incomplete or open shape as a complete, recognizable whole object"
      ],
      correct_option_index: 3,
      explanation: "Closure allows viewers to mentally complete fragmented shapes into coherent recognizable wholes.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In eye-tracking research and page layout, what is the difference between the 'F-Pattern' and the 'Z-Pattern' visual scan behaviors?",
      options: [
        "F-Pattern is used only by French readers; Z-Pattern is used by German readers",
        "F-Pattern occurs on text-dense editorial layouts where users read top lines fully and scan down the left edge; Z-Pattern occurs on visual landing pages and advertisements where the eye moves across the top, diagonally down, and across the bottom",
        "F-Pattern is for video; Z-Pattern is for audio",
        "There is zero difference between them"
      ],
      correct_option_index: 1,
      explanation: "F-Pattern describes scanning across text-heavy articles; Z-Pattern maps eye trajectory across image-driven landing pages.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In composition theory, how does 'Asymmetrical Balance' achieve visual equilibrium compared to 'Symmetrical Balance'?",
      options: [
        "By balancing a large, low-contrast, visually lighter element on one side with a smaller, highly saturated or textured heavy element on the opposite side, creating dynamic tension and visual interest",
        "By making both halves of the page exact mirror images of each other",
        "By placing all content in the exact mathematical center of the page",
        "Asymmetrical balance is an error that should be avoided"
      ],
      correct_option_index: 0,
      explanation: "Asymmetrical balance counterweights differing visual elements across an axis, generating dynamic equilibrium.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In color science and interaction theory, what did Josef Albers demonstrate with 'Simultaneous Contrast'?",
      options: [
        "That all colors look identical in dark rooms",
        "That color cannot be seen on computer monitors",
        "A single color sample appears visually different in hue, value, and saturation depending on the surrounding adjacent background color, proving that color is entirely relative",
        "That primary colors cannot be mixed"
      ],
      correct_option_index: 2,
      explanation: "Josef Albers demonstrated that adjacent background hues dynamically shift our perception of a central color swatch.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In modern digital UI and typography systems, what is the '8pt Grid System' and why is it globally adopted?",
      options: [
        "A grid that allows only 8 words per sentence",
        "A grid system that only works on 8-inch tablets",
        "A rule that restricts designers to 8 colors",
        "Sizing and spacing all layout elements, margins, paddings, and typographic line-heights in multiples of 8 (e.g. 8, 16, 24, 32, 48px), ensuring crisp pixel alignment and scalable responsiveness across display resolutions"
      ],
      correct_option_index: 3,
      explanation: "The 8pt grid scales cleanly across standard screen pixel densities, providing mathematical harmony and UI consistency.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In visual communication design, what is the 'Gutenberg Diagram' reading model?",
      options: [
        "A diagram showing how the printing press was invented",
        "A model describing how Western readers scan structured print and web documents along a diagonal gravity path from the Primary Optical Area (top-left) through weak fallow areas down to the Terminal Area (bottom-right)",
        "A method to print newspapers in color",
        "A diagram used only for map making"
      ],
      correct_option_index: 1,
      explanation: "The Gutenberg Diagram charts reading gravity from the top-left primary entry point down to the bottom-right terminal call to action.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In accessible graphic design, why is relying SOLELY on color (e.g. green for success, red for error) considered an accessibility failure for users with Color Vision Deficiency (CVD)?",
      options: [
        "Because red and green colors take up too much bandwidth",
        "Because red ink is more expensive than black ink",
        "Users with Deuteranopia or Protanopia cannot distinguish red from green tones; accessible design must reinforce color cues with iconography, explicit text labels, borders, and tactile/shape changes",
        "Color blindness does not exist in digital media"
      ],
      correct_option_index: 2,
      explanation: "Red-green color blindness makes pure color indicators unreadable; combining color with icons, text, and patterns ensures full accessibility.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Josef Müller-Brockmann's Swiss grid methodology, what is a 'Flowline' (or Hangline) in editorial grid anatomy?",
      options: [
        "A designated horizontal alignment line that runs across multiple columns or pages, breaking the grid into distinct spatial zones and providing a consistent resting anchor for the reader's eye",
        "A curved line used to draw rivers on maps",
        "An animation line in video editing",
        "The bottom margin of a magazine"
      ],
      correct_option_index: 0,
      explanation: "Flowlines create horizontal alignment anchors across spreads, imposing top-level spatial organization across columns.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Gestalt perceptual theory, what is 'Figure-Ground Segregation' and how can it create multi-layered visual ambiguity (such as Rubin's Vase)?",
      options: [
        "Grounding electrical wires in a printing factory",
        "Painting figures on the ground with chalk",
        "A visual glitch in 3D game engines",
        "The cognitive ability to distinguish a primary focal object (Figure) from its surrounding background field (Ground); sharing contour borders allows artists to create bistable illusions where positive and negative spaces swap roles"
      ],
      correct_option_index: 3,
      explanation: "Figure-Ground segregation distinguishes foreground from background; clever contour sharing enables dual-meaning visual illusions.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In typography and layout composition, what is the role of a 'Baseline Grid'?",
      options: [
        "A line drawn on the floor of an art studio",
        "A series of evenly spaced horizontal guides to which the baseline of every line of text snaps, ensuring that typography across adjacent multi-column articles aligns on the exact same horizontal plane",
        "A ruler used to cut paper",
        "A tool used to measure website download speed"
      ],
      correct_option_index: 1,
      explanation: "Baseline grids lock all text baselines to shared horizontal increments, preventing ragged vertical stepping between columns.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #136.");
  console.log("Skill #136 update completed successfully!");
}

run();
