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

const skillId = "11ae36b1-516d-4531-9116-1798c217f9cf";

async function run() {
  console.log("Updating Skill #138: Adobe Illustrator & Photoshop (9 steps across 3 tracks)...");

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
        title: `Track ${tracks.length + 1}: Adobe Illustrator & Photoshop`,
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
  await supabase.from("tracks").update({ title: "Track 1: Illustrator Vector Precision, Pen Tool and Pathfinder" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Photoshop Non-Destructive Masking and Blend Modes" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Frequency Separation, Prepress CMYK and Asset Export" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Adobe Certified Expert & Creative Studio Lead level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Bézier Pen Tool Mechanics, Anchor Points and Handles",
      order_index: 1,
      content: `### Vector Mathematical Curves and Precision Drawing

1. Pen Tool (P) Geometry:
   - Smooth Anchor Points (continuous tangential handles) vs Corner Points (independent angled handles via Alt modifier).

2. Curve Optimization:
   - Placing anchor points strictly at curve extrema (highest, lowest, leftmost, rightmost inflection points) with horizontal/vertical 45-degree constrained handles to minimize vector point counts.`
    },
    {
      track_id: track1Id,
      title: "Pathfinder Operations vs Shape Builder Geometry",
      order_index: 2,
      content: `### Boolean Geometry and Compound Path Construction

1. Pathfinder Panel:
   - Boolean Operations: Unite, Minus Front, Intersect, Exclude, and Divide.

2. Shape Builder Tool (Shift+M):
   - Merging and subtracting overlapping vector regions interactively on canvas; building complex iconic logos from primitive overlapping circles and polygons without manual point stitching.`
    },
    {
      track_id: track1Id,
      title: "Appearance Panel, Multiple Fills and Global Swatches",
      order_index: 3,
      content: `### Non-Destructive Vector Styling and Dynamic Attributes

1. Appearance Panel:
   - Stacking multiple independent Strokes, Fills, and live Vector Effects (Offset Path, Transform, Drop Shadow) on a single geometric path.

2. Global Swatches & Recolor Artwork:
   - Defining dynamic Global Color Swatches that update across thousands of vector artwork instances instantly when master palette values are edited.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Smart Objects, Layer Masks and Clipping Masks",
      order_index: 1,
      content: `### Non-Destructive Layer Pipelines and Masking

1. Smart Objects:
   - Encapsulating raster and vector media into non-destructive containers, preserving original pixel resolution through repeated scaling, rotating, and Smart Filter applications.

2. Masking Architectures:
   - Pixel Layer Masks (grayscale opacity painting) vs Clipping Masks (constraining child layer visibility to parent layer boundaries via Alt+Click).`
    },
    {
      track_id: track2Id,
      title: "Blend Modes Mathematics and The Five Categories",
      order_index: 2,
      content: `### Pixel Blending Algorithms and Math

1. The Five Blend Mode Families:
   - Darken Group (Multiply: blends darker pixels, drops pure white).
   - Lighten Group (Screen: blends lighter pixels, drops pure black).
   - Contrast Group (Overlay, Soft Light: 50% gray neutral).
   - Inversion (Difference).
   - Component Group (Color, Luminosity: isolating hue and tone).`
    },
    {
      track_id: track2Id,
      title: "Select and Mask Workspace, Refine Edge and Hair Extraction",
      order_index: 3,
      content: `### High-Precision Alpha Extraction and Edge Refinement

1. Select and Mask Workspace:
   - Refine Edge Brush sampling edge contrast to extract wispy human hair, fur, and semi-transparent fabrics from busy backgrounds.

2. Decontaminate Colors:
   - Neutralizing background color spill along subject borders and outputting clean New Layer with Layer Mask containers.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Frequency Separation and High-End Commercial Retouching",
      order_index: 1,
      content: `### Frequency Splitting and Texture Preservation

1. Frequency Separation:
   - Splitting an image into Low Frequency (Gaussian blur capturing broad skin tones and lighting) and High Frequency (High Pass / Apply Image extracting pores, fine wrinkles, and fabric textures).

2. Retouching Execution:
   - Smoothing skin tones on the low layer without destroying organic skin pore texture on the high layer.`
    },
    {
      track_id: track3Id,
      title: "Color Spaces: RGB vs CMYK, Gamut Warnings and Spot Colors",
      order_index: 2,
      content: `### Prepress Color Management and Printing Plates

1. Color Gamut Management:
   - RGB (additive light gamut for digital displays) vs CMYK (subtractive ink gamut for 4-color process printing).
   - Soft-Proofing and Out-of-Gamut Warnings.

2. Spot Colors (Pantone PMS):
   - Specifying dedicated pre-mixed ink spot channels (Pantone Matching System) for accurate corporate brand reproduction.`
    },
    {
      track_id: track3Id,
      title: "Prepress Standards: Bleed, Crop Marks, PDF/X and SVG",
      order_index: 3,
      content: `### Production Print Packaging and Digital Delivery

1. Commercial Print Preparation:
   - Setting 3mm (0.125 inch) Bleeds, Margins, Crop Marks, and 300 PPI print resolution; exporting certified PDF/X-1a and PDF/X-4 print packages.

2. Web Asset Export:
   - Exporting clean, minified SVGs with CSS styling and modern WebP / AVIF compressed raster deliverables.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #138.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In Adobe Photoshop, what is the primary non-destructive benefit of converting a layer into a 'Smart Object'?",
      options: [
        "It preserves the original source image resolution and data, allowing unlimited scaling, rotating, and filter adjustments without permanent pixel loss or degradation",
        "It automatically paints the image with watercolor",
        "It turns raster images into 3D models",
        "It deletes all hidden layers"
      ],
      correct_option_index: 0,
      explanation: "Smart Objects protect source pixel data, preventing destructive resolution loss during repeated transforms and scaling.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In commercial printing preparation, what is the universal industry standard resolution (PPI / DPI) required for crisp physical prints?",
      options: [
        "10 PPI",
        "72 PPI",
        "300 PPI (Pixels Per Inch)",
        "1,000,000 PPI"
      ],
      correct_option_index: 2,
      explanation: "300 PPI is the global standard print resolution for sharp offset and digital commercial printing (72 PPI is legacy screen).",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In Adobe Illustrator, what does the 'Shape Builder Tool' (Keyboard Shortcut: Shift+M) enable designers to do?",
      options: [
        "Build physical 3D furniture",
        "Interactively merge overlapping vector regions by dragging across them, or delete unwanted segments by holding Alt and clicking, constructing complex shapes rapidly on canvas",
        "Draw rectangles only",
        "Translate artwork into foreign languages"
      ],
      correct_option_index: 1,
      explanation: "Shape Builder interactively merges and subtracts overlapping vector geometry right on the canvas.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In Photoshop Layer Masks, how does painting with black and white on the mask affect layer visibility?",
      options: [
        "Black paints physical black ink; White paints white ink",
        "Black makes the image louder; White makes it quieter",
        "Painting has zero effect on masks",
        "Black conceals (makes pixels transparent); White reveals (makes pixels 100% visible); Grays create partial transparency"
      ],
      correct_option_index: 3,
      explanation: "In layer masks: Black hides, White reveals, and Gray creates semi-transparency non-destructively.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In print design and prepress production, what is 'Bleed' (standardly 3mm or 0.125 inches)?",
      options: [
        "Extending background artwork beyond the final trim crop line to ensure no unprinted white paper edges appear if the physical guillotine paper cutter shifts slightly during cutting",
        "Ink leaking from printer nozzles",
        "A red color filter",
        "A printer error that ruins paper"
      ],
      correct_option_index: 0,
      explanation: "Bleed extends artwork beyond the trim edge to eliminate white borders caused by minor trimming shifts.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In professional beauty and portrait retouching, what is 'Frequency Separation' and why is it superior to basic blur and clone stamping?",
      options: [
        "A technique to speed up Photoshop rendering",
        "A filter that converts color photos into sepia",
        "A tool that separates audio frequencies in video files",
        "It splits the portrait into two independent layers (a Low Frequency layer containing color and tone, and a High Frequency layer containing fine pores and skin texture), allowing artists to smooth blemishes and blotchiness without blurring natural skin texture"
      ],
      correct_option_index: 3,
      explanation: "Frequency separation separates color/tone from high-frequency pore texture, preserving natural skin detail during retouching.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Adobe Illustrator, what is the operational advantage of defining a swatch as a 'Global Color Swatch'?",
      options: [
        "Global swatches can be seen from space",
        "When the master Global Color swatch is modified in the Swatches panel, every single vector shape, stroke, and gradient across the entire document linked to that swatch updates automatically in real time",
        "Global swatches work only on global internet websites",
        "Global colors are completely free of copyright"
      ],
      correct_option_index: 1,
      explanation: "Global color swatches maintain dynamic links to all applied artwork, updating the entire document automatically when edited.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In Photoshop Blend Modes, how does the 'Multiply' blend mode mathematically interact with underlying layers compared to 'Screen'?",
      options: [
        "Multiply multiplies pixel luminosity values, making the image darker while treating pure 100% white as completely invisible; Screen inverts, multiplies, and inverts back, making the image brighter while treating pure 100% black as invisible",
        "Multiply is for vector; Screen is for raster",
        "Multiply adds 3D shadows; Screen adds 3D highlights",
        "There is zero difference between them"
      ],
      correct_option_index: 0,
      explanation: "Multiply darkens and drops pure white; Screen lightens and drops pure black.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In commercial brand printing, what is a 'Spot Color' (such as a Pantone Matching System / PMS ink) compared to standard CMYK process printing?",
      options: [
        "A color applied with a physical paintbrush",
        "A color used only for polka dots",
        "A single pre-mixed, custom-formulated ink printed on its own dedicated printing plate, guaranteeing exact color consistency across packaging, merchandise, and stationery regardless of the press machine",
        "A color that glows in the dark"
      ],
      correct_option_index: 2,
      explanation: "Spot colors use custom pre-mixed inks on dedicated press plates to guarantee flawless color consistency beyond CMYK limits.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In Adobe Illustrator's 'Appearance Panel', what unique capability does it offer that cannot be achieved via standard toolbar swatches?",
      options: [
        "It changes the appearance of the user's desktop",
        "It translates vector artwork into 3D animations",
        "It records audio commentary on drawings",
        "It allows an artist to apply multiple independent fills, multiple strokes, custom opacities, and live vector effects (like Offset Path and Transform) to a single vector path without duplicating geometry"
      ],
      correct_option_index: 3,
      explanation: "The Appearance panel stacks multiple fills, strokes, and live effects non-destructively on a single vector object.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "When drawing precision vector letterforms and icons with the Pen Tool in Illustrator, what is the golden rule for placing anchor points and direction handles?",
      options: [
        "Place as many anchor points as possible on every straight line",
        "Place anchor points strictly at the curve extrema (the highest, lowest, leftmost, and rightmost points of the curve) and keep direction handles aligned to horizontal or vertical 45-degree axes, minimizing anchor point count and ensuring smooth curves",
        "Never use direction handles with the Pen Tool",
        "Anchor points must always be placed randomly"
      ],
      correct_option_index: 1,
      explanation: "Placing anchors at extrema with axis-aligned handles yields mathematically clean curves with minimum points and maximum smoothness.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Photoshop compositing, how does a 'Clipping Mask' differ fundamentally from a standard 'Layer Mask'?",
      options: [
        "Clipping masks delete pixels; layer masks save pixels",
        "Clipping masks are only used for text layers",
        "A Clipping Mask uses the transparency and shape boundaries of the layer directly beneath it to clip and constrain the visibility of the layer(s) above it, rather than requiring an independent painted grayscale mask",
        "There is zero difference between them"
      ],
      correct_option_index: 2,
      explanation: "Clipping masks inherit the silhouette boundary of the base layer below to constrain visibility across top layers.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In prepress color science, why does converting an image from RGB to CMYK often cause vibrant neon greens, bright cyan blues, and intense oranges to appear dull and muddy?",
      options: [
        "The CMYK color space (subtractive ink reflecting off paper) has a significantly smaller color gamut than the RGB color space (additive light emitted by monitors); colors outside the CMYK gamut are clipped and mapped to the nearest printable dull ink equivalent",
        "Because CMYK printers use low-quality ink by default",
        "Because CMYK only supports 8 colors total",
        "RGB images are corrupted during conversion"
      ],
      correct_option_index: 0,
      explanation: "CMYK ink gamut is much smaller than RGB display gamut; out-of-gamut electric colors compress into duller printable inks.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In the Photoshop 'Select and Mask' workspace, what does the 'Decontaminate Colors' feature accomplish when isolating a subject from a green or bright background?",
      options: [
        "It removes computer viruses from the image file",
        "It converts the subject into pure black and white",
        "It makes the subject 50% larger",
        "It analyzes the color of the subject's edge pixels, replacing the background color spill (green bounce) with the underlying color of the subject's hair/clothing and outputting to a clean New Layer with Layer Mask"
      ],
      correct_option_index: 3,
      explanation: "Decontaminate Colors clones interior subject colors into edge pixels, eliminating background color fringe and haloing.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In professional prepress document delivery, what is the primary purpose of exporting a certified 'PDF/X-1a' or 'PDF/X-4' file for a commercial print house?",
      options: [
        "To make the PDF interactive with clickable hyperlinks",
        "It enforces strict prepress compliance: embedding all fonts, flattening or managing transparency, stripping unprintable RGB colors into certified CMYK/Spot inks, and locking high-resolution images with exact trim and bleed boxes",
        "To encrypt the file with a password",
        "PDF/X files can only be viewed on mobile phones"
      ],
      correct_option_index: 1,
      explanation: "PDF/X is the international ISO standard for print exchange, guaranteeing embedded fonts, CMYK compliance, and exact bleed geometry.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #138.");
  console.log("Skill #138 update completed successfully!");
}

run();
