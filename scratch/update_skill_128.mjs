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

const skillId = "041a4d30-923f-486c-be80-260d5e91ee0a";

async function run() {
  console.log("Updating Skill #128: 2D Game Art Fundamentals (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Pixel Art Mastery, Color Theory and Rasterization" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Tilesets, Autotiling Systems and Parallax Composition" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: 2D Skeletal Animation, Texture Atlases and UI Slicing" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Lead 2D Art Director & Technical Artist level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Pixel Clusters, Anti-Aliasing and Clean Line Art",
      order_index: 1,
      content: `### High-Precision Low-Resolution Rasterization

1. Pixel Clusters:
   - Building cohesive color masses rather than noisy isolated single pixels.

2. Eliminating Jaggies:
   - Smoothing diagonal pixel curves by enforcing monotonic mathematical steps (e.g. 3-2-1 sequences rather than chaotic 3-1-2 steps).
   - Outlining: Hard black borders vs Selective Outlining ('Sel-out' shifting outline tones relative to adjacent lighting).`
    },
    {
      track_id: track1Id,
      title: "Limited Color Palettes, Hue Ramping and Dithering",
      order_index: 2,
      content: `### Palette Harmonization and Shading Dynamics

1. Hue Shifting (Ramping):
   - Shifting highlights toward warm yellow tones and shadows toward cool blue/purple wavelengths to replicate natural sunlight and ambient atmospheric scatter, avoiding muddy desaturated grayscale shading.

2. Dithering Techniques:
   - Alternating checkerboard pixel matrices to blend tonal ramps smoothly across strictly limited indexed color palettes without color banding.`
    },
    {
      track_id: track1Id,
      title: "Sub-Pixel Animation and Silhouette Readability",
      order_index: 3,
      content: `### Kinetic Readability and Low-Res Motion

1. Silhouette Testing:
   - Evaluating sprites against solid black and white backgrounds to ensure distinct character identity, weapon posture, and action readability without relying on internal detail.

2. Sub-Pixel Animation:
   - Simulating fluid fractional movement on low-resolution grids (16x16) by shifting internal highlight and shadow clusters while keeping outline boundaries stationary.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Orthogonal, Isometric and Hexagonal Grid Tilesets",
      order_index: 1,
      content: `### Grid Systems and Spatial Projection Topologies

1. Grid Topologies:
   - Orthogonal (16x16, 32x32 side-scrolling and top-down planes).
   - Isometric (2:1 pixel ratio dimetric projections, e.g. 64x32 diamond tiles) providing 2.5D pseudo-3D depth.
   - Hexagonal (eliminating diagonal distance distortion in turn-based tactical strategy games).`
    },
    {
      track_id: track2Id,
      title: "The 47-Tile / 16-Tile Autotiling and Dual-Grid Systems",
      order_index: 2,
      content: `### Procedural Map Painting and Autotiling Bitmasks

1. Bitmask Autotiling:
   - Evaluating 8-neighbor bitwise masks (cardinal and corner neighbors) to automatically select matching corner, wall, outer-bend, and center tiles as designers paint maps in LDtk or Unity Tilemaps.

2. The 47-Tile Template:
   - Standard comprehensive tileset template resolving all possible terrain boundary permutations without visual seams.`
    },
    {
      track_id: track2Id,
      title: "Multi-Layer Parallax Backgrounds and Atmospheric Depth",
      order_index: 3,
      content: `### Multi-Plane Illusion and Atmospheric Perspective

1. Parallax Velocity Calculation:
   - Layer Scroll Speed = Camera Speed * (1 - Layer Depth Factor).

2. Aerial Perspective:
   - Progressively diminishing contrast, reducing color saturation, and tinting distant mountain and sky layers with ambient atmospheric fog color to create massive spatial depth.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Frame-by-Frame vs 2D Skeletal Rigging (Spine / Unity 2D)",
      order_index: 1,
      content: `### 2D Character Animation Pipelines

1. Frame-by-Frame Raster Sprites:
   - Hand-crafted traditional animation delivering rich squash-and-stretch volume deformation; high VRAM texture footprint.

2. 2D Skeletal Mesh Deformation (Spine2D / Unity 2D Bones):
   - Cutting art into modular limb sprites, binding them to 2D skeletal bones with Inverse Kinematics (IK), and applying mesh weighting. Reduces VRAM by 80% and enables runtime dynamic retargeting.`
    },
    {
      track_id: track3Id,
      title: "Texture Atlases, Bin-Packing and Bleed Prevention",
      order_index: 2,
      content: `### GPU Texture Memory and Draw Call Optimization

1. Texture Atlases:
   - Packing hundreds of sprite frames into single power-of-two (1024x1024, 2048x2048) texture sheets using MaxRects bin-packing algorithms to minimize draw calls.

2. Bleed Prevention:
   - Padding sprites with 2 to 4 pixels of extruded border color to eliminate neighbor pixel bleeding during sub-pixel camera movement.`
    },
    {
      track_id: track3Id,
      title: "UI Sprite 9-Slicing and Vector-to-Raster Pipelines",
      order_index: 3,
      content: `### Scalable Interface Elements and Vector Workflows

1. 9-Slicing (9-Patch):
   - Segmenting UI sprites into 9 zones (4 fixed corner radii, 4 stretchable/tiled borders, 1 stretchable center), allowing dialog windows to scale infinitely across display resolutions without distorting corners.

2. Vector-to-Raster Workflows:
   - Authoring vector graphics in Illustrator/Figma and rasterizing to crisp integer-aligned pixel grids.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #128.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In 2D pixel art, what are 'Jaggies' and how are they avoided?",
      options: [
        "A type of enemy in retro games",
        "Irregular, jagged stair-step artifacts along pixel lines; they are avoided by maintaining consistent, monotonic pixel step sequences (e.g. 3-2-1 instead of 3-1-2)",
        "A bug that deletes color palettes",
        "A pixel art tool in Adobe Photoshop"
      ],
      correct_option_index: 1,
      explanation: "Jaggies are uneven pixel staircases that break smooth line continuity; keeping step counts orderly eliminates them.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In 2D game environments, what is 'Parallax Scrolling'?",
      options: [
        "A method to play video games in VR",
        "A visual glitch where pixels shake rapidly",
        "A technique to compress game sound effects",
        "Moving multiple background layers at different speeds relative to the camera (closer layers move faster, distant layers move slower) to create the illusion of 3D depth"
      ],
      correct_option_index: 3,
      explanation: "Parallax scrolling moves background layers at varying speeds based on depth, producing a convincing 3D depth effect.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In 2D user interface design, what is '9-Slicing' (9-Patch)?",
      options: [
        "Dividing a UI sprite into 9 zones (4 unscaled corners, 4 stretchable borders, and a scalable center) so boxes can resize to any dimension without distorting rounded corners",
        "Cutting an image with 9 physical razor blades",
        "A game played on a 3x3 tic-tac-toe grid",
        "Splitting a 3D model into 9 pieces"
      ],
      correct_option_index: 0,
      explanation: "9-Slicing protects corner borders from scaling distortion while allowing center and edge tiles to stretch seamlessly.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In 2D game engines, what is a 'Texture Atlas' (Sprite Sheet)?",
      options: [
        "A book containing geographical maps of game levels",
        "A hard drive partition used for textures",
        "A large single image containing multiple individual sprite frames and UI elements packed together, minimizing GPU draw calls and state changes",
        "A 3D terrain scanner"
      ],
      correct_option_index: 2,
      explanation: "Texture Atlases pack many sprites into one large texture, collapsing multiple draw calls into a single batch.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In color theory for pixel art and digital painting, what is 'Hue Shifting' (Hue Ramping)?",
      options: [
        "Changing monitor color settings while playing",
        "Shifting the color hue towards warm tones (yellow/orange) for highlights and cool tones (blue/purple) for shadows, mimicking natural ambient lighting rather than simply adding black or white",
        "Painting only in shades of green",
        "A filter that inverts all colors"
      ],
      correct_option_index: 1,
      explanation: "Hue shifting introduces warmth into highlights and coolness into shadows, avoiding flat, muddy monochromatic shading.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In 2D skeletal animation software (such as Spine2D or Unity 2D Animation), what major advantages does 'Skeletal Mesh Deformation' have over traditional 'Frame-by-Frame' sprite animation?",
      options: [
        "It makes games completely 3D automatically",
        "It eliminates the need for art design",
        "It drastically cuts texture VRAM memory by reusing a single set of limb sprites, enables buttery-smooth 60+ FPS interpolation, and allows seamless weapon swapping on bones",
        "It only works on Apple operating systems"
      ],
      correct_option_index: 2,
      explanation: "Skeletal 2D animation moves rigid limb sprites via bones, saving massive VRAM and enabling fluid runtime interpolation.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In tilemap design, what does an 'Autotiling System' (such as the 47-Tile Blob template) do?",
      options: [
        "It uses neighbor-checking bitmask algorithms to automatically select the correct edge, inner-corner, outer-corner, or center tile as a level designer paints terrain onto the grid",
        "It paints the entire game level with AI without human input",
        "It deletes invalid tiles from the hard drive",
        "It converts 2D tiles into high-polygon 3D meshes"
      ],
      correct_option_index: 0,
      explanation: "Autotiling evaluates surrounding neighboring cells to pick appropriate corner, border, and center tile pieces dynamically.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In pixel art shading, what is 'Dithering' and what is its purpose?",
      options: [
        "A bug that causes pixels to flicker",
        "Drawing characters with shaky hands",
        "Deleting every other pixel in an image",
        "Using alternating checkerboard or crosshatch pixel patterns to simulate smooth gradient transitions and subtle shading between two colors within a strictly limited color palette"
      ],
      correct_option_index: 3,
      explanation: "Dithering interweaves distinct colors in geometric dot patterns, creating the optical illusion of mid-tones with limited palettes.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "Why is 'Sprite Extrude Padding' (adding 2 to 4 pixels of border bleeding) essential when packing sprites into Texture Atlases?",
      options: [
        "It makes sprites physically heavier in the game engine",
        "It prevents 'Texture Bleeding' artifacts where adjacent sprite colors bleed into the active sprite's borders during camera zooming or sub-pixel texture filtering",
        "It is required by copyright law",
        "It doubles the game frame rate"
      ],
      correct_option_index: 1,
      explanation: "Extrude padding duplicates border pixels into gutter margins, preventing neighboring sprites from bleeding into seams during bilinear filtering.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What characterizes an 'Isometric' grid in 2D game development?",
      options: [
        "A grid made of circles",
        "A grid that changes size every second",
        "A dimetric projection utilizing a 2:1 pixel ratio (e.g. 64 pixels wide by 32 pixels tall diamond tiles) to simulate pseudo-3D elevated perspective on a 2D plane",
        "A top-down square grid with zero angles"
      ],
      correct_option_index: 2,
      explanation: "Isometric 2D grids use a 2:1 diamond pixel ratio to create convincing pseudo-3D spatial depth for tactical strategy and RPGs.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In low-resolution pixel art character design (such as 16x16 or 24x24 sprites), what is 'Sub-Pixel Animation'?",
      options: [
        "Creating the optical illusion of fractional, sub-pixel kinetic motion by shifting internal clusters of highlight and shadow tones across frames while keeping the outer silhouette boundary stationary",
        "Splitting hardware monitor pixels in half with a laser",
        "Drawing images in 8K resolution",
        "Animating sprites at 1 frame per second"
      ],
      correct_option_index: 0,
      explanation: "Sub-pixel animation shifts internal shading values across fixed bounds to convey subtle breathing or drifting without jittery whole-pixel jumps.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In pixel art outlining techniques, what is 'Selective Outlining' ('Sel-out') and how does it elevate visual sophistication over hard black outlines?",
      options: [
        "Selecting pixels with the mouse wand tool",
        "Deleting all outlines from the character",
        "Outlining only female characters in games",
        "Coloring the outline pixels with dark tints that harmonize with the adjacent internal surface color and external lighting, softening harsh edges while preserving crisp contrast against backgrounds"
      ],
      correct_option_index: 3,
      explanation: "Sel-out shifts outline color dynamically based on internal shading and ambient light, blending lines harmoniously into backgrounds.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In environment art and background design, how does 'Aerial Perspective' (Atmospheric Perspective) create believable environmental scale across parallax layers?",
      options: [
        "By flying an airplane over the game level",
        "Distant background layers are rendered with lower contrast, lower color saturation, and shifted toward ambient atmospheric haze color (e.g. bluish-gray) to simulate light scattering across miles of atmosphere",
        "By making all background objects completely white",
        "By blurring every object on the screen equally"
      ],
      correct_option_index: 1,
      explanation: "Aerial perspective simulates atmospheric Rayleigh scattering by reducing contrast and tinting distant layers with atmospheric fog.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "Why is 'Silhouette Testing' considered the most critical benchmark in character and enemy visual design?",
      options: [
        "Because shadows use less computer memory",
        "Because players only look at character shadows",
        "If a character's silhouette cannot be instantly identified and its weapon/action understood when filled with solid black, internal details will fail in fast-paced gameplay and chaotic visual noise",
        "Silhouette testing is only used in horror games"
      ],
      correct_option_index: 2,
      explanation: "Silhouettes provide instantaneous cognitive recognition during chaotic gameplay; strong shapes ensure readability across all lighting conditions.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In texture atlas generation for 2D engines, why is the 'MaxRects Bin-Packing Algorithm' considered the industry benchmark for packing irregular sprites?",
      options: [
        "It evaluates maximal free rectangular sub-spaces to achieve near-optimal packing density (frequently >90% texture area utilization), minimizing wasted VRAM and power-of-two sheet dimensions",
        "It automatically paints 3D textures",
        "It converts images into vector files",
        "It is the only algorithm supported by Windows"
      ],
      correct_option_index: 0,
      explanation: "MaxRects achieves superior packing density by tracking maximal free overlapping rectangles, minimizing wasted transparent atlas padding.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #128.");
  console.log("Skill #128 update completed successfully!");
}

run();
