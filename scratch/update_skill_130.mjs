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

const skillId = "ef7933ca-4f5f-49a9-9f8d-d661304b09c3";

async function run() {
  console.log("Updating Skill #130: Texturing & Materials (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Physically Based Rendering (PBR) Theory and Channels" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Procedural Texturing and Substance 3D Authoring" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Master Shader Graphs, Channel Packing and Compression" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Lead Shading Artist & Technical LookDev level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Physics of Light Transport and Energy Conservation",
      order_index: 1,
      content: `### Light Transport Physics and Fresnel Equations

1. Conservation of Energy:
   - Reflected Light + Absorbed/Transmitted Light <= Incident Light.

2. Fresnel Effect & Schlick's Approximation:
   - Reflectance reaches 100% at glancing angles (90 degrees). Dielectrics reflect ~4% (F0 = 0.04) at normal incidence; Metals reflect 70% to 100% with colored specular reflections.
   - Microfacet Theory: Cook-Torrance BRDF evaluating Normal Distribution (GGX), Fresnel (F), and Geometric Shadowing (G).`
    },
    {
      track_id: track1Id,
      title: "Metallic/Roughness vs Specular/Glossiness Workflows",
      order_index: 2,
      content: `### PBR Texture Channels and Normal Conventions

1. Metallic/Roughness Channels:
   - Base Color: Diffuse color for dielectrics; raw specular reflectance for metals. Must contain zero baked lighting or shadows.
   - Metallic: Binary mask (0.0 insulator/dielectric to 1.0 conductive metal).
   - Roughness: Grayscale micro-surface scattering (0.0 mirror sharp to 1.0 ultra-matte).

2. Normal Map Inversion:
   - DirectX / Unreal Engine uses Y- (inverted Green channel); OpenGL / Unity uses Y+ (standard Green channel).`
    },
    {
      track_id: track1Id,
      title: "Color Spaces: Linear vs sRGB Gamma Curves",
      order_index: 3,
      content: `### Color Gamma Spaces and Data Texture Integrity

1. sRGB Color Space:
   - Applied strictly to visual human-perceived color textures (Base Color / Albedo) with 2.2 gamma curve correction.

2. Linear Color Space:
   - Mandatory for numerical data textures (Metallic, Roughness, Normal, Ambient Occlusion, Mask Maps). Interpreting data textures as sRGB corrupts lighting mathematics, creating washed-out and physically invalid material responses.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Procedural Noise, Pattern Generation and Distance Nodes",
      order_index: 1,
      content: `### Substance Designer Mathematical Graph Pipelines

1. Procedural Noises:
   - Perlin, Worley / Voronoi (cellular cracks), Simplex, and Directional Scratches generating resolution-independent procedural patterns.

2. Mathematical Filter Stacks:
   - Levels, Histogram Scan, Distance Transforms, Blend Modes (Multiply, Overlay, Max Lighten), and Flood Fill nodes converting flat tile patterns into rich height and gradient maps.`
    },
    {
      track_id: track2Id,
      title: "Smart Materials, Edge Wear and Cavity Weathering",
      order_index: 2,
      content: `### Layered Material Weathering and Mask Generators

1. Smart Material Architecture:
   - Layering Base Substrate (Raw Metal) -> Primer Layer -> Top Paint Coat -> Surface Grime.

2. Dynamic Mask Generators:
   - Curvature-driven Edge Wear exposing bare metal along sharp exterior corners; Ambient Occlusion (AO) and World-Space Position masks depositing dirt in interior crevices and undersides.`
    },
    {
      track_id: track2Id,
      title: "Tri-Planar Projection and Seamless Blending",
      order_index: 3,
      content: `### Seam-Free Procedural World Texturing

1. Tri-Planar Mapping:
   - Projecting textures along the three cardinal world axes (X, Y, Z) and blending them across surface normals with soft falloff transitions.

2. Applications:
   - Eliminates visible UV seams and texture stretching across complex terrain cliffs, caves, and organic sculpted rock meshes without requiring manual UV unwrapping.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Master Material Graphs and Dynamic Instances",
      order_index: 1,
      content: `### Scalable Engine Shader Architectures

1. Master Materials:
   - A single parameterized uber-shader in Unreal/Unity containing switchable feature toggles (Static Switches) and exposed uniform properties.

2. Material Instances (MIs) and Dynamic Instances (MIDs):
   - MIs allow artists to tweak colors, roughness scales, and textures instantly without shader recompilation; MIDs enable real-time runtime parameter animation via code.`
    },
    {
      track_id: track3Id,
      title: "Channel Packing (ORM / ARM) and Memory Bandwidth",
      order_index: 2,
      content: `### Texture Sampler Optimization and Packing

1. Channel Packing (ORM / ARM):
   - Storing three grayscale data maps in the individual RGBA channels of a single texture file (e.g. Red = Ambient Occlusion, Green = Roughness, Blue = Metallic).

2. GPU Performance Gains:
   - Cuts texture sampler instructions by 66% and slashes VRAM bandwidth consumption, preventing mobile GPU sampler starvation.`
    },
    {
      track_id: track3Id,
      title: "GPU Texture Compression Formats and Normal Blending",
      order_index: 3,
      content: `### Binary Compression Algorithms and Reoriented Normals

1. Block Compression (BC) Standards:
   - BC7 (high-quality 8-bit RGBA color/albedo), BC5 (2-channel high-precision normal maps storing RG and reconstructing Z = sqrt(1 - X^2 - Y^2)), BC4 (single-channel masks), and ASTC for mobile.

2. Reoriented Normal Mapping (RNM):
   - Mathematically blending base baked normals with tiling detail micro-normals without flattening underlying surface curvature.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #130.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In Physically Based Rendering (PBR), what is the foundational rule of 'Conservation of Energy'?",
      options: [
        "Surfaces must reflect 100% of all incoming light at all times",
        "A surface cannot reflect or bounce more light energy than the total amount of light energy it receives (Reflected + Absorbed <= Incident Light)",
        "Light only travels in straight lines in game engines",
        "Materials must generate their own electrical energy"
      ],
      correct_option_index: 1,
      explanation: "Conservation of energy dictates that reflected and transmitted light can never exceed total incident light energy.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In game texture optimization, what is 'Channel Packing' (such as an ORM / ARM texture map)?",
      options: [
        "Compressing audio channels into an MP3 file",
        "Packing television channels into a cable box",
        "Organizing files into alphabetical folders",
        "Storing multiple independent grayscale data maps inside the individual Red, Green, Blue, and Alpha channels of a single texture (e.g. Red = Occlusion, Green = Roughness, Blue = Metallic) to reduce GPU memory and texture sampler counts"
      ],
      correct_option_index: 3,
      explanation: "Channel packing merges separate grayscale masks into RGBA channels of a single texture, saving 66% sampler bandwidth.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In the PBR Metallic/Roughness workflow, how is the 'Metallic' map standardly authored?",
      options: [
        "As a strict binary black-and-white mask (0.0 black for dielectrics/insulators like wood and plastic; 1.0 white for pure conductive metals like iron and gold)",
        "As a bright rainbow colored image",
        "As a normal vector map",
        "As a 3D polygonal mesh"
      ],
      correct_option_index: 0,
      explanation: "Metallic values in reality are binary (0.0 for dielectrics, 1.0 for pure conductors; intermediate values represent transitions like dust or rust).",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In 3D texture mapping, what is 'Tri-Planar Projection'?",
      options: [
        "A method to render three games at the same time",
        "A technique using three computer monitors",
        "Projecting texture coordinates along the three cardinal world axes (X, Y, Z) and blending them across surface normals, completely eliminating visible UV seams on complex organic terrain and rocks without manual UV unwrapping",
        "A tool used to slice 3D models into three parts"
      ],
      correct_option_index: 2,
      explanation: "Tri-planar projection projects textures from three spatial planes, blending them seamlessly across complex organic surfaces without UV seams.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In Unreal Engine and DirectX graphics conventions, how does Tangent-Space Normal Map orientation differ from Unity / OpenGL conventions?",
      options: [
        "DirectX normal maps use black and white only",
        "DirectX / Unreal Engine inverts the Green Channel (Y-), whereas OpenGL / Unity uses standard Green Channel orientation (Y+)",
        "DirectX normal maps do not use red pixels",
        "OpenGL normal maps are completely flat"
      ],
      correct_option_index: 1,
      explanation: "DirectX/Unreal expects an inverted green channel (Y-), while OpenGL/Unity uses a positive green channel (Y+).",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "Why MUST mathematical data texture maps (such as Roughness, Metallic, Normal, and Ambient Occlusion) be imported using 'Linear Color Space' rather than 'sRGB'?",
      options: [
        "Linear color space makes textures load 10x faster from disk",
        "Because sRGB is banned by GPU manufacturers",
        "sRGB applies a 2.2 gamma curve designed for human eye perception; applying gamma to raw numerical data distorts calculations, corrupting physical lighting and making materials look washed out or overly glossy",
        "Linear color space makes all textures black and white"
      ],
      correct_option_index: 2,
      explanation: "Data textures store pure mathematical values; applying sRGB gamma curves distorts shader math, ruining PBR accuracy.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In PBR optical physics, what is the 'Fresnel Effect' (modeled via Schlick's approximation)?",
      options: [
        "The phenomenon where the reflectivity of any surface increases dramatically as the viewing angle approaches a glancing angle (90 degrees), causing all dielectric materials to become near-100% reflective at grazing edges",
        "The effect of light bending inside water exclusively",
        "The speed at which shadows disappear at night",
        "A visual glitch where surfaces turn pink"
      ],
      correct_option_index: 0,
      explanation: "The Fresnel effect dictates that all physical materials become virtually 100% reflective at glancing 90-degree grazing angles.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In Substance 3D Painter, how do 'Curvature' and 'Ambient Occlusion' baked maps drive procedural Smart Material weathering?",
      options: [
        "They delete unused layers automatically",
        "They record audio sound effects during texturing",
        "They make the 3D model heavier",
        "Curvature maps identify convex exterior edges to apply procedural paint chipping and metal wear; Ambient Occlusion maps identify concave crevices and cavities to deposit dirt and grime"
      ],
      correct_option_index: 3,
      explanation: "Curvature masks expose high-wear convex edges for chipping, while AO masks deposit cavity dirt in occluded crevices.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In GPU texture compression standards, why is 'BC5' (Block Compression 5) the industry standard format for 3D Tangent-Space Normal Maps?",
      options: [
        "BC5 makes normal maps completely flat",
        "BC5 uses high-precision 2-channel compression (storing X in Red and Y in Green) with zero cross-channel artifacting, allowing the GPU pixel shader to reconstruct the Z vector dynamically (Z = sqrt(1 - X^2 - Y^2))",
        "BC5 is only supported on mobile phones",
        "BC5 compresses audio files into normal maps"
      ],
      correct_option_index: 1,
      explanation: "BC5 allocates dedicated bit-depth to Red and Green channels independently, eliminating RGB cross-talk artifacts on normal maps.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In game engine shading architecture, what is the primary benefit of creating 'Material Instances' (MIs) from a 'Master Material'?",
      options: [
        "Material instances make textures 4K automatically",
        "Material instances allow players to modify game code",
        "They allow artists to adjust exposed parameters (colors, roughness scales, texture inputs) instantly in the editor with zero shader recompilation wait time, sharing the compiled parent shader instructions on the GPU",
        "Material instances delete unused shaders from disk"
      ],
      correct_option_index: 2,
      explanation: "Material Instances share the parent master shader bytecode, allowing instant parameter tweaking without shader compilation stalls.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In microfacet Cook-Torrance BRDF theory, what are the three mathematical distribution terms that calculate physical specular light reflection?",
      options: [
        "D (Normal Distribution Function GGX: micro-facet alignment), F (Fresnel equation: reflection vs angle), and G (Geometric Shadowing/Masking: self-occlusion of micro-facets)",
        "RGB (Red, Green, Blue)",
        "XYZ (Length, Width, Height)",
        "FPS (Frames, Polygons, Shaders)"
      ],
      correct_option_index: 0,
      explanation: "The Cook-Torrance specular term combines D (Normal Distribution), F (Fresnel reflectance), and G (Geometric shadowing/masking).",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "When combining a base baked low-poly normal map with a tiling micro-detail normal map (such as fabric weave or metal stippling), why is 'Reoriented Normal Mapping' (RNM) superior to simple linear addition or overlay blending?",
      options: [
        "RNM runs only on mobile chips",
        "Linear addition is illegal under GPU shader standards",
        "Overlay blending makes textures completely black",
        "Simple addition flattens underlying surface curvature and corrupts vector normalization; RNM mathematically rotates the detail normal vector relative to the base normal frame, preserving full curvature fidelity"
      ],
      correct_option_index: 3,
      explanation: "RNM rotates detail normals onto the base normal's tangent frame, preserving geometric curvature without flattening.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In PBR Base Color / Albedo map authoring, what is the 'Photometric Brightness Range' rule for realistic dielectric materials?",
      options: [
        "All textures must be pure 100% white (#FFFFFF)",
        "Real-world physical dielectric materials have an sRGB albedo range between ~30 sRGB (pure dark charcoal) and ~240 sRGB (pure fresh snow); values outside this range break PBR lighting equations and produce unrealistic glow or pitch-black voids",
        "Textures must have a brightness value of exactly 50% everywhere",
        "Dielectrics should never use color textures"
      ],
      correct_option_index: 1,
      explanation: "Physical materials never reflect 0% or 100% of light; staying within 30-240 sRGB guarantees valid physical lighting response.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Unreal Engine C++ and Blueprint gameplay systems, how does a 'Dynamic Material Instance' (MID) enable runtime parameter animation (such as a character flashing red on taking damage)?",
      options: [
        "By re-downloading the game engine from the internet",
        "By painting on the 3D model with physical ink",
        "By creating a unique runtime instance of the material in RAM via 'CreateDynamicMaterialInstance' and calling 'SetVectorParameterValue' or 'SetScalarParameterValue' dynamically during gameplay ticks",
        "MIDs are only used for static scenery"
      ],
      correct_option_index: 2,
      explanation: "MIDs instantiate mutable runtime material parameters in memory, allowing code to animate colors, dissolves, and scalar values in real time.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In procedural Substance Designer authoring, what is the role of the 'Distance Transform' node?",
      options: [
        "It calculates Euclidean pixel distances from input black-and-white mask boundaries, generating smooth continuous mathematical gradients and conical height bevels used to create embossed patterns, tiles, and organic weathering",
        "It measures the physical distance between two 3D models in kilometers",
        "It deletes pixels that are far from the center",
        "It increases texture download speeds"
      ],
      correct_option_index: 0,
      explanation: "Distance Transform generates continuous Euclidean distance gradient ramps from mask edges, forming the foundation of procedural bevels and shapes.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #130.");
  console.log("Skill #130 update completed successfully!");
}

run();
