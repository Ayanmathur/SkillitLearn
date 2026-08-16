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

const skillId = "867495c5-a93a-464d-adfd-cff92e4a356e";

async function run() {
  console.log("Updating Skill #137: Typography (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Type Anatomy, Metrics and Historical Classifications" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Micro-Typography: Kerning, Leading and Measure" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: OpenType Features, Variable Fonts and Type Pairing" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Master Typographer & Editorial Design Director level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Anatomy of Letterforms, Metrics and Structural Geometry",
      order_index: 1,
      content: `### Letterform Anatomy and Proportional Metrics

1. Vertical Typographic Metrics:
   - Baseline, X-Height (proportional height of lowercase 'x'), Cap Height, Ascender Line, and Descender Line.

2. Glyph Anatomy:
   - Stem, Bowl (curved enclosure), Counter (internal negative space), Aperture (open negative space), Terminal, Serif, Ear, and Crossbar.`
    },
    {
      track_id: track1Id,
      title: "Vox-ATypI Historical Type Classifications (Serif)",
      order_index: 2,
      content: `### Historical Evolution of Serif Typefaces

1. Serif Categories:
   - Humanist / Old Style (Garamond, Jenson): Organic calligraphic angles and bracketed serifs.
   - Transitional (Baskerville): Sharper contrast and vertical stress axes.
   - Modern / Didone (Bodoni, Didot): Extreme contrast with razor-thin hairline serifs.
   - Slab Serif / Egyptian (Rockwell): Heavy, unbracketed block serifs.`
    },
    {
      track_id: track1Id,
      title: "Sans-Serif Categories: Grotesque, Geometric and Humanist",
      order_index: 3,
      content: `### Sans-Serif Typographic Ideologies

1. Sans-Serif Taxonomy:
   - Grotesque (Akzidenz-Grotesk): Early industrial sans-serifs with idiosyncratic curves.
   - Neo-Grotesque (Helvetica, Univers): Neutral, unadorned horizontal terminals and closed apertures.
   - Geometric (Futura): Built strictly on circles, triangles, and squares.
   - Humanist Sans (Gill Sans, Frutiger): Open apertures and calligraphic proportions.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Kerning, Tracking and Optical vs Metric Letter-Spacing",
      order_index: 1,
      content: `### Letter-Spacing Mechanics and Optical Harmony

1. Kerning vs Tracking:
   - Kerning: Adjusting the specific spatial relationship between individual letter pairs (e.g. 'AV', 'To', 'Wa') to achieve uniform perceptual area.
   - Tracking: Uniform letter-spacing across whole text blocks (loosened for ALL CAPS; tightened for large display titles).`
    },
    {
      track_id: track2Id,
      title: "Leading (Line-Height), Vertical Rhythm and Baseline Grids",
      order_index: 2,
      content: `### Vertical Spacing and Reading Comfort

1. Leading (Line-Height):
   - Setting leading to 120% to 150% of font size (e.g. 16px body type with 24px line-height) to prevent eye collisions between lines.

2. Vertical Rhythm:
   - Snapping all paragraph text to a mathematical baseline grid increment to maintain harmonious horizontal line alignment across multi-column pages.`
    },
    {
      track_id: track2Id,
      title: "Measure (Line Length), Rag and Eliminating Widows/Orphans",
      order_index: 3,
      content: `### Line Length, Paragraph Hygiene and Rag Shaping

1. Optimal Measure:
   - Robert Bringhurst's rule of 45 to 75 characters per line (66 characters ideal) to prevent reader fatigue.

2. Paragraph Hygiene:
   - Eliminating Widows (isolated line at top of page), Orphans (isolated line at bottom of page), and Runts (single word stranded on its own line at the end of a paragraph).`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "OpenType Features: Tabular Figures, Small Caps and Ligatures",
      order_index: 1,
      content: `### Advanced Digital Typography and OpenType Glyphs

1. Numerical Figures:
   - Tabular Figures (tnum: monospaced numbers aligning in financial tables) vs Proportional Figures (pnum).
   - Oldstyle Figures (onum: lowercase figures with ascenders/descenders).

2. Glyphs:
   - True Small Caps (smcp), Standard Ligatures (fi, fl), and Discretionary Ligatures (st, ct).`
    },
    {
      track_id: track3Id,
      title: "Variable Fonts (OpenType-CWT) and Continuous Axes",
      order_index: 2,
      content: `### Next-Gen Variable Typeface Technology

1. Variable Font Technology:
   - A single unified font file containing continuous interpolation axes.

2. Standard Axes:
   - Weight (wght: 100-900), Width (wdth: 50%-125%), Slant (slnt), Italic (ital), and Optical Size (opsz: optimizing glyph details automatically between micro captions and massive display billboards).`
    },
    {
      track_id: track3Id,
      title: "Typographic Pairing Harmony and Modular Scale Math",
      order_index: 3,
      content: `### Font Pairing Harmony and Proportional Ratios

1. Font Pairing Rules:
   - Combining contrasting styles (e.g. Humanist Serif body with Geometric Sans headline) while matching x-heights and core proportions.

2. Typographic Modular Scales:
   - Deriving type sizes from mathematical musical ratios (Major Third 1.250, Perfect Fourth 1.333, Golden Ratio 1.618) to ensure harmonious proportional scale.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #137.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In typography anatomy, what is the 'X-Height' of a typeface?",
      options: [
        "The total width of the letter X",
        "The height of the main body of lowercase letters (such as x, u, v, w, z), excluding any ascenders or descenders",
        "The size of the computer screen",
        "The thickness of capital letters"
      ],
      correct_option_index: 1,
      explanation: "X-Height measures the height of lowercase letters without ascenders/descenders, heavily dictating perceived readability at small sizes.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In typography, what is 'Kerning'?",
      options: [
        "Changing the color of words",
        "Converting text into audio",
        "Underlining important sentences",
        "Adjusting the specific spacing between two individual adjacent characters (letter pairs like 'AV' or 'To') to achieve visual balance and eliminate awkward gaps"
      ],
      correct_option_index: 3,
      explanation: "Kerning adjusts spacing between specific individual letter pairs to maintain optically consistent space.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In layout typography, what is 'Leading' (Line-Height)?",
      options: [
        "The vertical distance between the baselines of consecutive lines of text",
        "The first person who founded a type foundry",
        "The physical weight of a printed book",
        "The margin at the top of a page"
      ],
      correct_option_index: 0,
      explanation: "Leading (historically strips of lead) measures the vertical baseline-to-baseline distance between text lines.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In editorial typesetting, what is a 'Runt' (or Widow in paragraph endings)?",
      options: [
        "A paragraph written in a foreign language",
        "A font that has missing characters",
        "A single short word left stranded on its own line at the very end of a paragraph, creating awkward negative whitespace",
        "A type of underline effect"
      ],
      correct_option_index: 2,
      explanation: "A runt is a lonely single word on the final line of a paragraph, breaking visual paragraph shape.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "Which historical typeface category is characterized by extreme contrast between thick vertical stems and razor-thin hairline serifs (e.g. Bodoni and Didot)?",
      options: [
        "Old Style / Humanist",
        "Modern / Didone",
        "Geometric Sans",
        "Slab Serif"
      ],
      correct_option_index: 1,
      explanation: "Modern / Didone typefaces (Bodoni, Didot) feature dramatic stroke contrast and flat unbracketed hairline serifs.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In book design and web reading ergonomics (Robert Bringhurst's standard), what is the optimal 'Measure' (character count per line) for comfortable reading?",
      options: [
        "10 to 20 characters per line",
        "200 to 300 characters per line",
        "45 to 75 characters per line (approximately 66 characters including spaces)",
        "Exactly 1,000 characters per line"
      ],
      correct_option_index: 2,
      explanation: "45-75 characters per line prevents reader eye fatigue from excessive tracking jumps or scanning strain.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In financial tables and data spreadsheets, why MUST 'Tabular Figures' (tnum) be used instead of 'Proportional Figures' (pnum)?",
      options: [
        "Tabular figures give every numeral the exact same uniform horizontal advance width (monospaced numbers), ensuring decimals and columns of numbers align vertically with mathematical perfection",
        "Tabular figures make numbers green in color",
        "Proportional figures delete negative numbers",
        "Tabular figures double the value of money"
      ],
      correct_option_index: 0,
      explanation: "Tabular figures share uniform character widths, aligning multi-row financial tables and numerical columns vertically.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In digital font technology, what major performance and design capability do 'Variable Fonts' (OpenType-CWT) provide?",
      options: [
        "They change language based on GPS location",
        "They allow fonts to be printed in 3D",
        "They delete unused letters from the alphabet",
        "A single lightweight font file contains continuous multidimensional interpolation axes (such as Weight 100-900, Width, Slant, and Optical Size), replacing dozens of individual static font files"
      ],
      correct_option_index: 3,
      explanation: "Variable fonts pack an infinite continuum of weights, widths, and optical sizes into a single unified font file.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What is the typographic difference between 'Tracking' (letter-spacing) and 'Kerning'?",
      options: [
        "Tracking is only for numbers; Kerning is for punctuation",
        "Tracking applies a uniform spacing adjustment across an entire block of text or word; Kerning adjusts the specific spatial gap between two individual character glyphs",
        "Kerning deletes words; Tracking adds words",
        "There is zero difference between them"
      ],
      correct_option_index: 1,
      explanation: "Tracking affects overall word/sentence spacing uniformly; Kerning fine-tunes the unique gap between adjacent character pairs.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In variable font design, what does the 'Optical Size' (`opsz`) axis achieve?",
      options: [
        "It changes the monitor resolution",
        "It measures the reader's eyesight using the webcam",
        "It dynamically alters letterform proportions (increasing x-height, opening apertures, and thickening hairlines for micro captions, while refining delicate high-contrast serifs for large display headlines)",
        "It translates text into braille"
      ],
      correct_option_index: 2,
      explanation: "The Optical Size axis modifies stroke contrast, apertures, and x-height dynamically to maximize legibility at any physical point size.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In classical typographic pairing, what is the golden principle of 'Concord vs Contrast' when combining two distinct typefaces (e.g. a Header font and a Body font)?",
      options: [
        "Combine typefaces that share complementary structural x-heights and proportions while exhibiting strong stylistic contrast (such as a Modern Serif header paired with a clean Humanist Sans body); avoid pairing typefaces from the same sub-category that look nearly identical (visual conflict)",
        "Always use Comic Sans for body text and Papyrus for headlines",
        "Never use more than one font on an entire website",
        "Typefaces must have opposite x-heights"
      ],
      correct_option_index: 0,
      explanation: "Successful pairing pairs contrasting styles with shared structural proportions (x-heights), avoiding conflicting near-identical fonts.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In OpenType typesetting, what are 'Oldstyle Figures' (onum) and in what context are they preferred?",
      options: [
        "Oldstyle figures are numbers written in Roman numerals (I, V, X)",
        "Numbers used only before the year 1900",
        "Numbers that are completely illegible",
        "Numerals designed with varying heights, ascenders (6, 8), and descenders (3, 4, 5, 7, 9) matching the rhythm and x-height of lowercase body text, blending seamlessly into running editorial prose"
      ],
      correct_option_index: 3,
      explanation: "Oldstyle figures have ascenders and descenders like lowercase letters, blending harmoniously into running text without shouting.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In typographic scale mathematics, how does a 'Modular Typographic Scale' (such as Major Third 1.250 or Perfect Fourth 1.333) establish visual hierarchy?",
      options: [
        "By picking random font sizes from a hat",
        "Each consecutive heading level (H3 -> H2 -> H1 -> Display) is calculated by multiplying the base body font size by a fixed mathematical ratio (e.g. 16px * 1.250 = 20px * 1.250 = 25px * 1.250 = 31.25px), creating consistent harmonic proportions",
        "By making all headlines 100 pixels tall",
        "Modular scales are used only for building architecture"
      ],
      correct_option_index: 1,
      explanation: "Modular scales apply fixed geometric multiplier ratios to base text, producing mathematically unified typographic hierarchies.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In ligature design, what optical problem do standard ligatures (such as 'fi', 'fl', 'ffi') solve?",
      options: [
        "They make words easier to pronounce",
        "They turn text into vector icons",
        "The overhanging terminal of the lowercase letter 'f' physically collides with the dot of the letter 'i' or the ascender of 'l'; ligatures merge both characters into a single harmoniously redesigned glyph to eliminate the awkward collision",
        "Ligatures are used to translate text into French"
      ],
      correct_option_index: 2,
      explanation: "Ligatures merge characters whose ascenders and dots would otherwise awkwardly collide, creating an elegant combined glyph.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In typography anatomy, what distinguishes a 'Humanist Sans-Serif' (e.g. Gill Sans, Frutiger) from a 'Neo-Grotesque Sans-Serif' (e.g. Helvetica)?",
      options: [
        "Humanist sans-serifs feature open apertures, varied stroke modulation, and classical Roman proportion roots derived from handwriting; Neo-Grotesques feature strict geometric neutrality, uniform stroke weight, and closed horizontal terminals",
        "Humanist fonts have massive slab serifs",
        "Neo-Grotesque fonts are always written in all-caps",
        "Humanist fonts only support 3 letters of the alphabet"
      ],
      correct_option_index: 0,
      explanation: "Humanist sans fonts stem from organic calligraphic Roman proportions with open apertures; Neo-Grotesques feature neutral, uniform geometry.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #137.");
  console.log("Skill #137 update completed successfully!");
}

run();
