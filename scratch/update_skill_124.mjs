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

const skillId = "347c270f-1bf3-4739-8249-d85b8f4103f1";

async function run() {
  console.log("Updating Skill #124: Game Engine Basics (Unity/Unreal) (9 steps across 3 tracks)...");

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
        title: `Track ${tracks.length + 1}: Game Engine Basics (Unity/Unreal)`,
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
  await supabase.from("tracks").update({ title: "Track 1: Engine Architectures, Object Lifecycles and Gameplay Frameworks" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Modern Rendering Pipelines, Shaders and Lighting" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Asset Pipelines, Memory Management and Build Engineering" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Lead Game Engine Architect & Technical Director level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Unity MonoBehaviour Lifecycle and Component Hierarchy",
      order_index: 1,
      content: `### Execution Order and Component State Management

1. Unity Execution Lifecycle:
   - Awake() (internal initialization) -> OnEnable() -> Start() (cross-script references).
   - FixedUpdate() (physics steps) -> Update() (game logic/input) -> LateUpdate() (camera tracking).
   - OnDisable() -> OnDestroy().

2. ScriptableObjects:
   - Data containers living independently of scene instances, perfect for item databases and global event architectures.`
    },
    {
      track_id: track1Id,
      title: "Unreal Engine Gameplay Framework (UObject, AActor, Pawn, Character)",
      order_index: 2,
      content: `### C++ Gameplay Framework Hierarchy in Unreal

1. Class Inheritance Hierarchy:
   - UObject (base class with GC and reflection) -> AActor (spawnable in 3D world) -> APawn (possessable entity) -> ACharacter (Pawn with CharacterMovementComponent).

2. Controller & Game Flow:
   - APlayerController possesses Pawns to translate input into movement.
   - AGameModeBase enforces authoritative server rules; AGameStateBase replicates match state to all clients.`
    },
    {
      track_id: track1Id,
      title: "Blueprints vs C++ and Unreal Reflection Macros",
      order_index: 3,
      content: `### Hybrid Architecture and UHT Reflection Macros

1. Unreal Header Tool (UHT) Macros:
   - UCLASS(), USTRUCT(), UENUM() enable garbage collection and editor visibility.
   - UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = 'Combat') exposes variables to designers.
   - UFUNCTION(BlueprintCallable) exposes C++ functions to visual scripting.

2. Production Split:
   - High-performance math and core systems in C++; UI, FX, and tuning in Blueprints.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Unity Render Pipelines: Built-in, URP and HDRP",
      order_index: 1,
      content: `### Scriptable Render Pipeline (SRP) Paradigms

1. Universal Render Pipeline (URP):
   - Optimized single-pass forward and deferred rendering designed for multi-platform reach across mobile, Nintendo Switch, VR, and consoles.

2. High Definition Render Pipeline (HDRP):
   - Compute shader-driven deferred rendering engineered for high-fidelity photorealism on PC and high-end consoles, supporting ray tracing and physical camera models.`
    },
    {
      track_id: track2Id,
      title: "Unreal Engine 5 Nanite, Lumen and Virtual Shadow Maps",
      order_index: 2,
      content: `### Next-Gen Geometry and Global Illumination

1. Nanite Virtualized Geometry:
   - Renders film-quality source meshes with millions of polygons directly via micro-polygon clusters, completely automating level-of-detail (LOD) management.

2. Lumen Dynamic Global Illumination:
   - Real-time diffuse indirect lighting and reflections that instantly react to moving light sources and geometry changes without baking static lightmaps.`
    },
    {
      track_id: track2Id,
      title: "PBR Materials, Textures and Node-Based Shaders",
      order_index: 3,
      content: `### Physically Based Rendering (PBR) Standards

1. Core PBR Texture Channels:
   - Albedo / Base Color (diffuse color without lighting), Metallic (0.0 to 1.0 dielectric/conductor), Roughness (micro-surface light scattering), Normal Maps (tangent-space faux surface detail), and Ambient Occlusion (AO).

2. Visual Shaders:
   - Assembling shaders mathematically in Unity Shader Graph and Unreal Material Editor.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Dynamic Asset Loading: Addressables vs Soft Pointers",
      order_index: 1,
      content: `### Asynchronous Memory Management and Streaming

1. Unity Addressables:
   - Asynchronous asset bundle streaming (Addressables.LoadAssetAsync<T>()) and explicit memory release (Addressables.Release()) to prevent RAM bloat.

2. Unreal Soft Object Pointers:
   - TSoftObjectPtr<T> references assets without loading them into memory upfront, streaming them into RAM on demand via FStreamableManager.`
    },
    {
      track_id: track3Id,
      title: "Level Streaming and World Partition Systems",
      order_index: 2,
      content: `### Seamless Open-World Spatial Loading

1. Unity Additive Scene Streaming:
   - SceneManager.LoadSceneAsync('SubLevel', LoadSceneMode.Additive) dynamically streams level sectors based on player position.

2. Unreal World Partition:
   - Automatic grid-based spatial streaming dividing large open worlds into localized cells, loading and unloading geometry dynamically based on camera distance.`
    },
    {
      track_id: track3Id,
      title: "Build Systems, IL2CPP Compilation and Target Packaging",
      order_index: 3,
      content: `### Cross-Platform Packaging and Native Compilation

1. Unity IL2CPP:
   - Converts C# Intermediate Language (IL) into high-performance native C++ binaries prior to platform compilation, optimizing speed and preventing code reverse engineering.

2. Unreal Build Tool (UBT):
   - Compiles monolithic C++ binaries and packages compressed assets into container files (Pak/IoStore) tailored for PC, Consoles, and Mobile.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #124.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In the Unity MonoBehaviour execution lifecycle, which method is guaranteed to execute FIRST before any Start() methods are called?",
      options: [
        "Update()",
        "Awake()",
        "LateUpdate()",
        "FixedUpdate()"
      ],
      correct_option_index: 1,
      explanation: "Awake() is called first when the script instance is initialized, before Start() and before any frame updates.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In Unreal Engine's core gameplay framework, what is the base class for any object that can be placed or spawned inside a 3D level?",
      options: [
        "UObject",
        "UWidget",
        "AGameState",
        "AActor"
      ],
      correct_option_index: 3,
      explanation: "AActor is the foundational class in Unreal Engine for any entity that possesses a transform and can be spawned in a level.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What revolutionary technology in Unreal Engine 5 enables rendering film-quality 3D assets with millions of polygons directly without manual LOD authoring?",
      options: [
        "Nanite (Virtualized Micro-Polygon Geometry)",
        "Ray Tracing Audio",
        "DirectX 9",
        "PhysX 2D"
      ],
      correct_option_index: 0,
      explanation: "Nanite streams micro-polygon clusters dynamically, rendering geometric detail at the pixel level without manual LOD models.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In Physically Based Rendering (PBR), what does a 'Roughness' map dictate?",
      options: [
        "The physical weight of the 3D model",
        "The file size of the texture",
        "How microscopically smooth or rough a surface is, controlling the sharpness or blurriness of specular light reflections",
        "The damage dealt by a weapon"
      ],
      correct_option_index: 2,
      explanation: "Roughness controls micro-facet scattering: smooth surfaces produce sharp mirror reflections, while rough surfaces blur highlights.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In Unity C# development, what is the primary benefit of using 'ScriptableObjects' for game data (like item stats or enemy databases)?",
      options: [
        "They make 3D graphics look photorealistic",
        "They exist as independent asset files in the project, storing shared data without attaching redundant copies to scene GameObjects, saving RAM",
        "They allow players to play without a keyboard",
        "They automatically upload games to Steam"
      ],
      correct_option_index: 1,
      explanation: "ScriptableObjects store centralized, shareable data assets in memory, eliminating redundant data duplication across GameObjects.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In Unity, what is the key difference between the Universal Render Pipeline (URP) and the High Definition Render Pipeline (HDRP)?",
      options: [
        "URP is for 2D audio; HDRP is for 3D physics",
        "URP only works in virtual reality",
        "URP is a lightweight, scalable pipeline designed for multi-platform performance (mobile, Switch, VR, PC); HDRP is a compute-heavy pipeline engineered for photorealism on high-end PC/consoles",
        "HDRP is completely deprecated and unsupported"
      ],
      correct_option_index: 2,
      explanation: "URP focuses on cross-platform performance efficiency; HDRP targets AAA photorealism on high-end hardware.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Unreal Engine C++, what does the macro 'UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = \"Combat\")' do?",
      options: [
        "It registers the C++ variable with Unreal's reflection and garbage collection systems, allowing it to be edited in the Details panel and accessed within Blueprint graphs",
        "It deletes the variable from memory",
        "It turns the variable into a 3D model",
        "It compiles the code for iOS automatically"
      ],
      correct_option_index: 0,
      explanation: "UPROPERTY exposes C++ variables to the Unreal editor, reflection engine, serialization, and Blueprints.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In Unreal Engine 5, what is 'Lumen' and how does it revolutionize game lighting?",
      options: [
        "A texture compression algorithm",
        "An AI enemy pathfinding system",
        "A tool used to record voice acting",
        "A real-time dynamic global illumination and indirect reflection system that reacts immediately to changes in scene lighting without requiring baked lightmaps"
      ],
      correct_option_index: 3,
      explanation: "Lumen provides fully dynamic diffuse global illumination and reflections, eliminating the need for time-consuming static lightmap baking.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In Unity, why is the 'LateUpdate()' method specifically used for camera follow scripts rather than 'Update()'?",
      options: [
        "Because LateUpdate() runs at half the frame rate",
        "LateUpdate() runs after all standard Update() methods have finished, ensuring the player character has completed their movement before the camera updates its position, preventing visual jitter",
        "Because cameras cannot execute code in Update()",
        "LateUpdate() is only used in mobile games"
      ],
      correct_option_index: 1,
      explanation: "LateUpdate executes after character movement in Update(), guaranteeing the camera tracks a finalized position without stutter.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In Unreal Engine C++ architecture, what is a 'TSoftObjectPtr<T>' and why is it used instead of raw object pointers for heavy assets?",
      options: [
        "A pointer made out of soft foam",
        "A pointer that deletes assets from disk",
        "A weak reference that stores an asset's path without loading it into RAM upfront, allowing asynchronous on-demand streaming to minimize memory usage",
        "A pointer that runs twice as fast as raw C++ pointers"
      ],
      correct_option_index: 2,
      explanation: "TSoftObjectPtr prevents hard reference loading waterfalls, enabling asynchronous streaming of heavy meshes and textures into RAM.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In Unity's build compilation pipeline, what does 'IL2CPP' (Intermediate Language to C++) do and what are its primary performance advantages?",
      options: [
        "It converts managed C# Intermediate Language (IL) into highly optimized native C++ source code before compiling with platform-native compilers, maximizing CPU execution speed and hindering code decompilation",
        "It converts 3D models into 2D pixel art",
        "It translates English game dialogue into foreign languages",
        "It is an obsolete tool replaced by Flash Player"
      ],
      correct_option_index: 0,
      explanation: "IL2CPP converts .NET IL into native C++, yielding significant performance improvements, AOT compilation for consoles, and security.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Unreal Engine multiplayer architecture, what is the architectural difference between 'AGameModeBase' and 'AGameStateBase'?",
      options: [
        "AGameModeBase is for graphics; AGameStateBase is for audio",
        "There is zero difference; they are aliases for the same class",
        "AGameModeBase runs on every client; AGameStateBase runs only on the server",
        "AGameModeBase exists ONLY on the authoritative server to define match rules and spawning; AGameStateBase is replicated to all connected clients to display match scores and timers"
      ],
      correct_option_index: 3,
      explanation: "GameMode exists strictly on the server to enforce authoritative rules; GameState replicates public match info to all connected clients.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In large open-world game engineering in Unreal Engine 5, what does the 'World Partition' system do?",
      options: [
        "It splits the game into separate disk drives",
        "It replaces manual sub-level management by dividing the entire open world into a single grid of spatial streaming cells that automatically load and unload dynamically based on camera distance",
        "It forces all players to stay within 10 meters of each other",
        "It deletes terrain when players turn around"
      ],
      correct_option_index: 1,
      explanation: "World Partition uses distance-based spatial grid streaming within a single map, automating seamless open-world streaming.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Unity asset architecture, how does the 'Addressables System' manage memory differently than placing assets inside the legacy 'Resources' folder?",
      options: [
        "Addressables delete all textures upon startup",
        "The Resources folder is 100x faster than Addressables",
        "The Resources folder forces all assets into the main game executable memory at startup; Addressables load and unload specific asset bundles asynchronously on demand and free RAM upon release",
        "Addressables are only compatible with HTML5 web games"
      ],
      correct_option_index: 2,
      explanation: "Resources bloats startup RAM and binary size, whereas Addressables provides asynchronous streaming and explicit memory release.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In game engine architecture, why is the controller separated from the possessed Pawn in Unreal Engine (APlayerController / AAIController possessing APawn)?",
      options: [
        "It cleanly decouples player identity, input mapping, and UI management from the physical in-world avatar, allowing a player to possess different Pawns (e.g. exiting a character and driving a vehicle) seamlessly",
        "Because Pawns cannot receive keyboard input directly in C++",
        "To make character models smaller in memory",
        "Controllers only exist for console gamepads"
      ],
      correct_option_index: 0,
      explanation: "Separating Controllers from Pawns enables flexible possession, allowing players or AI to switch vehicles or characters effortlessly.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #124.");
  console.log("Skill #124 update completed successfully!");
}

run();
