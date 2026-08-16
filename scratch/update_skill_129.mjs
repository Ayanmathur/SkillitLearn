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

const skillId = "607eaef7-1847-4e52-9514-b319fd2baaec";

async function run() {
  console.log("Updating Skill #129: 3D Modeling for Games (9 steps across 3 tracks)...");

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
        title: `Track ${tracks.length + 1}: 3D Modeling for Games`,
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
  await supabase.from("tracks").update({ title: "Track 1: Polygonal Geometry, Topology and Edge Flow" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Digital Sculpting, Retopology and High-to-Low Baking" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: UV Unwrapping, Texel Density and Modular Kit Design" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Lead 3D Artist & Technical Modeler level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Polygon Modeling, Vertices, Edges and Triangulation",
      order_index: 1,
      content: `### Anatomical Components and Real-Time Triangulation

1. Geometric Hierarchy:
   - Vertices (3D spatial points), Edges (linear connections), Faces / Polygons (Tris, Quads, N-Gons).

2. GPU Triangulation:
   - Real-time graphics hardware rasterizes only Triangles (Tris); game artists author clean Quads during digital content creation to strictly control deterministic diagonal triangulation during engine import.`
    },
    {
      track_id: track1Id,
      title: "Topology, Deformation Edge Loops and Manifold Integrity",
      order_index: 2,
      content: `### Clean Edge Flow and Deformation Topology

1. Joint Deformation Loops:
   - Constructing 3-span concentric edge loops across knees, elbows, and knuckles to preserve structural volume and prevent mesh pinching during skeletal bending.
   - Facial Loops: Circular topology radiating around eyes and mouth for expressive facial animation.

2. Mesh Hygiene:
   - Eliminating Non-Manifold geometry (internal faces, edges shared by 3+ faces, open T-junctions).`
    },
    {
      track_id: track1Id,
      title: "Hard vs Soft Edges, Smoothing Groups and Weighted Normals",
      order_index: 3,
      content: `### Vertex Normals and Hard-Surface Shading

1. Normal Shading:
   - Soft Edges (shared vertex normals for smooth organic curves) vs Hard Edges (split vertex normals for sharp 90-degree mechanical breaks).

2. Weighted Vertex Normals:
   - Weighting vertex normal vectors by adjacent face area to project flat, bevel-like highlights across low-poly hard-surface props without adding bevel geometry.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "High-Poly Digital Sculpting (ZBrush / Blender)",
      order_index: 1,
      content: `### High-Density Sculpting and Micro-Surface Detailing

1. Digital Sculpting:
   - Sculpting millions of polygons in ZBrush (Dynamesh, Sculptris Pro, ZRemesher) to craft anatomical muscles, cloth wrinkles, battle damage, and skin pores.

2. Hard-Surface Booleans:
   - Utilizing dynamic Live Booleans and edge creasing to engineer complex sci-fi mechanical armor and weapon assemblies.`
    },
    {
      track_id: track2Id,
      title: "Retopology Pipelines (QuadDraw / TopoGun)",
      order_index: 2,
      content: `### Low-Poly Cage Creation and Optimization

1. The Retopology Objective:
   - Rebuilding an optimized game-ready low-poly mesh (e.g. 15,000 triangles) directly over a 30-million polygon high-poly sculpt.

2. Retopology Tools:
   - Using QuadDraw or TopoGun to place vertices on silhouette inflection points, maintaining quad flow while optimizing triangle counts.`
    },
    {
      track_id: track2Id,
      title: "High-to-Low Baking: Normal Maps, AO and Cage Projections",
      order_index: 3,
      content: `### Texture Map Baking and Cage Calibration

1. Texture Map Baking:
   - Raymarching from a low-poly cage in Substance Painter or Marmoset Toolbag to capture high-poly details into Tangent-Space Normal Maps, Ambient Occlusion (AO), Curvature, and ID maps.

2. Projection Cages:
   - Calibrating push-cages with averaged normals to eliminate raycast misses, texture skewing, and black baking seams along sharp corners.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "UV Seams, Unwrapping and Texture Distortion Relaxation",
      order_index: 1,
      content: `### 2D Coordinate Projection and Seam Placement

1. UV Seam Strategy:
   - Placing seams along natural physical breaks (inseams, armpits, mechanical joints) and placing mandatory UV seams at every Hard Edge to prevent normal map shading errors.

2. Minimizing UV Distortion:
   - Utilizing conformal unwrapping and relaxation algorithms to achieve 1:1 square checkerboard mapping without stretching or compression.`
    },
    {
      track_id: track3Id,
      title: "Texel Density Standardization and UV Space Packing",
      order_index: 2,
      content: `### Visual Resolution Consistency and Overlapping UVs

1. Texel Density (TD):
   - Standardizing pixels-per-meter (e.g. 10.24 px/cm for first-person weapons; 5.12 px/cm for third-person environments) to ensure consistent visual sharpness across all assets.

2. Overlapping (Mirrored) UVs:
   - Stacking symmetrical geometry (arms, legs, vehicle halves) into identical UV space to save 50% texture resolution.`
    },
    {
      track_id: track3Id,
      title: "Modular 3D Environment Kits and Collision Hulls (UCX)",
      order_index: 3,
      content: `### Grid Snapping and Custom Collision Hulls

1. Modular Environment Kits:
   - Snapping wall, floor, and doorway assets to strict metric grids (1m, 2m, 4m) with origin-aligned pivot points and shared Trim Sheets.

2. Custom Collision Hulls:
   - Authoring simplified convex collision meshes using standard engine naming conventions (UCX_MeshName_01) to deliver smooth player traversal.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #129.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In 3D game engines, what geometric polygon type is exclusively processed and rendered by graphics hardware rasterizers?",
      options: [
        "Triangles (Tris / 3-sided polygons)",
        "Quads (4-sided polygons)",
        "N-Gons (5+ sided polygons)",
        "Circles"
      ],
      correct_option_index: 0,
      explanation: "GPU rasterization hardware operates strictly on triangles (Tris); all 3D meshes are triangulated before or during engine rendering.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In 3D modeling for games, what is 'Retopology'?",
      options: [
        "Painting color textures on a 3D model",
        "Adding fur and hair to a character",
        "Rebuilding an optimized, low-polygon game-ready mesh with clean edge flow over a high-density (multi-million polygon) digital sculpt",
        "Deleting all lights from a 3D scene"
      ],
      correct_option_index: 2,
      explanation: "Retopology creates clean, low-poly geometry over high-res sculpts, ensuring optimized game performance and animation deformation.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In 3D asset texturing pipelines, what does a 'Normal Map' do?",
      options: [
        "It changes the character's name to normal",
        "It uses RGB color vectors (Tangent-Space) to fake high-resolution surface bumps, grooves, and bevel details on low-polygon models by altering light reflection calculations",
        "It makes 3D models completely invisible",
        "It measures internet connection speed"
      ],
      correct_option_index: 1,
      explanation: "Normal maps encode surface angle vectors in RGB channels, simulating high-poly micro-details on low-poly geometry.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In 3D texture mapping, what is 'Texel Density' (TD)?",
      options: [
        "The physical weight of a texture file in megabytes",
        "The number of colors in an image",
        "The speed at which textures load from disk",
        "The ratio of texture pixels to 3D world space dimensions (e.g. pixels-per-meter or px/cm), ensuring consistent visual sharpness across all game assets"
      ],
      correct_option_index: 3,
      explanation: "Texel density standardizes texture resolution relative to physical 3D world scale across an entire game project.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In Unreal Engine and Unity 3D asset import pipelines, what prefix is standardly used for custom simplified convex physics collision meshes (e.g. UCX_Pillar_01)?",
      options: [
        "UCX_",
        "LOD_",
        "MAT_",
        "TEX_"
      ],
      correct_option_index: 0,
      explanation: "The UCX_ prefix designates custom simplified convex collision hulls automatically recognized by game engines upon FBX import.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In character topology and rigging, why are concentric '3-Span Edge Loops' built around bending joints (such as elbows and knees)?",
      options: [
        "Because 3D models cannot bend without 100 edge loops",
        "To make character limbs look like cylinders",
        "To increase the download speed of the 3D model",
        "They maintain anatomical volume during joint bending (flexion), preventing ugly mesh collapsing, pinching, or crushing when animated"
      ],
      correct_option_index: 3,
      explanation: "3-span concentric edge loops maintain smooth curve deformation, preserving joint volume without pinching during bending.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "What is the mandatory golden rule of UV seam placement regarding 'Hard Edges' (split smoothing groups)?",
      options: [
        "Hard edges must never have UV seams",
        "Every Hard Edge on a 3D model MUST have a corresponding UV Seam dividing separate UV islands; failure to split UVs causes severe black normal map baking shading errors",
        "UV seams should only be placed in the center of faces",
        "Hard edges are not allowed in video games"
      ],
      correct_option_index: 1,
      explanation: "Hard edges split vertex normals; without a matching UV seam, normal map baking interpolates gradients incorrectly, causing dark edge seams.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In hard-surface low-poly modeling, what do 'Weighted Vertex Normals' achieve?",
      options: [
        "They manipulate vertex normal directions based on polygon face surface area, producing flat, clean shading across surfaces and smooth faux-bevel highlights without adding extra bevel geometry",
        "They make 3D models heavier in physics simulations",
        "They automatically delete unseen vertices",
        "They convert low-poly meshes into NURBS surfaces"
      ],
      correct_option_index: 0,
      explanation: "Weighted normals align vertex normals to large flat polygons, creating crisp shading and rounded highlight edges without extra polygon bevels.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In 3D mesh modeling, why is 'Non-Manifold Geometry' (e.g. interior faces or an edge shared by 3 or more faces) considered a critical modeling error?",
      options: [
        "It turns the 3D model green in the viewport",
        "Non-manifold models use too much hard drive space",
        "It breaks normal map baking, prevents clean UV unwrapping, corrupts subdivision algorithms, and causes physics and lighting crashes in game engines",
        "It makes character models move backwards"
      ],
      correct_option_index: 2,
      explanation: "Non-manifold geometry violates mathematical topology definitions, breaking unwrapping, baking raycasts, and rendering lighting.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In modular environment design, why is placing the 'Pivot Point' at a corner grid origin and authoring assets to strict metric dimensions (e.g. 1m, 2m, 4m) critical?",
      options: [
        "To make the 3D model lighter in file size",
        "Because game engines cannot rotate objects with centered pivots",
        "Pivot points are only used in animation",
        "It allows level designers to snap modular architectural pieces (walls, floors, doors) together seamlessly on grid without gaps, misalignments, or lighting leaks"
      ],
      correct_option_index: 3,
      explanation: "Corner-aligned pivot points on power-of-two metric grids enable rapid, pixel-perfect modular snapping without light leaks or gaps.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In high-to-low texture map baking (in Substance Painter or Marmoset), what is the role of a 'Projection Cage' mesh?",
      options: [
        "A metal cage placed around characters in combat",
        "A customized expanded low-poly mesh envelope with averaged normals that defines the exact raycast distance and direction, preventing projection misses, ray crossovers, and distortion waviness on sharp corners",
        "A tool used to compress 3D textures",
        "A mesh used only to render shadow maps"
      ],
      correct_option_index: 1,
      explanation: "A projection cage controls raymarching trajectory and distance, eliminating skewing and ray intersection misses across sharp geometry.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In UV layout optimization, how does 'Overlapping / Mirrored UV Mapping' maximize texture resolution for symmetrical 3D assets?",
      options: [
        "It deletes one half of the 3D mesh in the game engine",
        "It makes 3D models 100% transparent",
        "Symmetrical halves of a character (e.g. left and right arms, legs) are stacked onto the exact same UV texture space, effectively doubling texture pixel resolution (or saving 50% VRAM)",
        "Overlapping UVs are banned in AAA game development"
      ],
      correct_option_index: 2,
      explanation: "Stacking identical symmetrical UV islands doubles usable texel resolution by sampling the exact same texture pixels for both sides.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In digital sculpting for game assets, what is the architectural difference between 'Dynamesh / Voxel Remeshing' and 'Subdivision Surface Sculpting'?",
      options: [
        "Dynamesh constantly recalculates dynamic volumetric topology, allowing artists to pull, add, and combine massive forms without polygon stretching; Subdivision surfaces subdivide a fixed cage, ideal for refining clean detail on established forms",
        "Dynamesh is for 2D sprites; Subdivision is for 3D meshes",
        "Subdivision surfaces can only be used on wooden objects",
        "Dynamesh automatically completes texture baking"
      ],
      correct_option_index: 0,
      explanation: "Dynamesh recalculates voxel topology dynamically for concept exploration, whereas subdivision refines fixed polygonal quad meshes.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In modular 3D environment art, what is a 'Trim Sheet' and why is it extraordinarily efficient in production?",
      options: [
        "A piece of sandpaper used by 3D artists",
        "A document listing all deleted 3D assets",
        "A tool that trims audio files in games",
        "A single texture atlas containing multiple horizontal or vertical architectural strips (wood trim, metal paneling, stone borders) mapped across dozens of different modular 3D meshes to minimize draw calls and VRAM"
      ],
      correct_option_index: 3,
      explanation: "Trim sheets map shared linear material strips across countless modular props and buildings, dramatically minimizing draw calls and texture memory.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In 3D mesh optimization, why must 'Degenerate Triangles' (faces with zero area where vertices are co-located) and 'Interior Faces' be eliminated prior to engine export?",
      options: [
        "Because zero-area faces make 3D models too heavy",
        "They cause division-by-zero errors in raymarching baking engines, corrupt lighting shadow calculations, and generate visual flickering artifacts (Z-fighting)",
        "Because degenerate triangles are only supported on Mac",
        "Interior faces make games download twice as slow"
      ],
      correct_option_index: 1,
      explanation: "Degenerate triangles create mathematical division-by-zero errors in lighting and baking engines, while interior faces cause Z-fighting.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #129.");
  console.log("Skill #129 update completed successfully!");
}

run();
