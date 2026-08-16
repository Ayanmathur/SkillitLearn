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

const skillId = "36f44616-f759-420c-91b0-7d93fc2772ad";

async function run() {
  console.log("Updating Skill #126: Game Performance Optimization (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Frame Budgets, Profiling Tools and Bottleneck Diagnosis" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: CPU Optimization, Multithreading and Data-Oriented Tech (DOTS)" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: GPU Optimization, Batching, Overdraw and LOD Systems" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Principal Performance Architect level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Frame Budgets and CPU vs GPU Bottleneck Diagnosis",
      order_index: 1,
      content: `### Frame Time Budgets and Bottleneck Identification

1. Frame Time Budgets:
   - 60 FPS Target: 16.66ms total frame budget.
   - 120 FPS Target: 8.33ms total frame budget.
   - 30 FPS Target: 33.33ms total frame budget.

2. Diagnosing Bottlenecks:
   - CPU-Bound: Game Thread (>16.6ms on physics/AI/logic) or Render Thread (excessive draw call submission).
   - GPU-Bound: GPU time (>16.6ms due to fill rate, complex pixel shaders, high resolution).`
    },
    {
      track_id: track1Id,
      title: "Industry Profilers: Unreal Insights, Unity Profiler, RenderDoc",
      order_index: 2,
      content: `### Instrumentation and Profiling Toolsets

1. Profiling Suites:
   - Unity Profiler & Memory Profiler: Tracking CPU execution hierarchies, heap allocations, and memory footprints.
   - Unreal Insights: Low-overhead trace analyzer capturing task graph scheduling, CPU stalls, and asset streaming latency.
   - GPU Debuggers (RenderDoc, NVIDIA Nsight Graphics): Inspecting individual draw calls, pipeline barriers, and shader cycle costs.`
    },
    {
      track_id: track1Id,
      title: "Garbage Collection and Heap Allocation Elimination",
      order_index: 3,
      content: `### Eliminating Managed Memory Micro-Stutters

1. Zero-Allocation Hot Loops:
   - Eliminating heap allocations in Update() loops that trigger periodic Garbage Collection (GC) pauses.

2. Anti-Allocation Patterns:
   - Eliminating boxing of value types (object o = 5), caching delegate references, replacing string concatenation with StringBuilder, and utilizing ArrayPool<T> for temporary memory arrays.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Unity DOTS: Entities, Jobs and the Burst Compiler",
      order_index: 1,
      content: `### Data-Oriented Technology Stack (DOTS)

1. Entity Component System (ECS):
   - Decoupling raw data (IComponentData structs) from logic (ISystem), storing components in contiguous archetype memory chunks.

2. Job System & Burst Compiler:
   - Multi-threading data tasks across CPU cores; Burst compiles C# bytecode into native LLVM assembly with auto-vectorized SIMD instructions.`
    },
    {
      track_id: track2Id,
      title: "Memory Layouts: Array of Structures (AoS) vs SoA",
      order_index: 2,
      content: `### Cache-Coherent Memory Topologies

1. Array of Structures (AoS):
   - struct Particle { Vector3 pos; Vector3 vel; Color col; float life; }; creates cache line waste when updating only positions.

2. Structure of Arrays (SoA):
   - struct Particles { float[] posX; float[] posY; float[] posZ; }; guarantees contiguous memory access, maximizing L1/L2 CPU cache utilization and hardware SIMD execution.`
    },
    {
      track_id: track2Id,
      title: "Multithreading, Task Graphs and Synchronization",
      order_index: 3,
      content: `### Asynchronous Task Scheduling and Lock-Free Code

1. Task Graphs:
   - Dependency-driven asynchronous task execution scheduling worker threads without main thread stalling.

2. Minimizing Contention:
   - Replacing expensive blocking thread mutexes (std::mutex) with lightweight lock-free atomic primitives (std::atomic, Interlocked.Increment) to avoid CPU context switches.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Draw Call Reduction: Static, Dynamic and GPU Instancing",
      order_index: 1,
      content: `### Render State Optimization and Batching

1. The Draw Call Bottleneck:
   - CPU render thread overhead required to bind materials, shaders, and geometry buffers for the GPU.

2. Batching Strategies:
   - Static Batching: Combining non-moving geometry into a single buffer.
   - GPU Instancing (Graphics.RenderMeshInstanced): Rendering thousands of identical meshes (trees, bullets) in a single draw call with per-instance transform buffers.`
    },
    {
      track_id: track3Id,
      title: "Overdraw, Fill Rate and Early-Z Rejection",
      order_index: 2,
      content: `### Fragment Shader Optimization and Depth Testing

1. The Overdraw Problem:
   - Shading identical screen pixels multiple times due to overlapping transparent or unsorted geometry (e.g. dense alpha smoke particles).

2. Early-Z Depth Pre-Pass:
   - Rendering a lightweight depth-only pass first; GPU hardware Early-Z tests then reject occluded pixels before executing expensive fragment/pixel shaders.`
    },
    {
      track_id: track3Id,
      title: "Level of Detail (LOD), HLOD and Texture Streaming Pools",
      order_index: 3,
      content: `### Asset Scaling and VRAM Streaming Architecture

1. Discrete LOD Groups:
   - Progressively swapping high-polygon models for simplified meshes based on screen-space coverage.

2. Hierarchical LOD (HLOD) and Mipmaps:
   - HLOD merges entire clusters of distant static meshes into a single proxy mesh.
   - Texture Mipmaps (powers-of-two downscaled textures) prevent VRAM thrashing and cache aliasing.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #126.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "To maintain a rock-solid target frame rate of 60 Frames Per Second (FPS), what is the maximum total Frame Time Budget available to complete all CPU and GPU work per frame?",
      options: [
        "33.33 milliseconds",
        "16.66 milliseconds",
        "8.33 milliseconds",
        "100 milliseconds"
      ],
      correct_option_index: 1,
      explanation: "60 FPS gives a budget of 1,000ms / 60 = 16.66ms per frame. Exceeding 16.66ms causes the frame rate to drop.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In 3D rendering optimization, what technique renders thousands of identical 3D meshes (such as grass blades, trees, or bullets) in a single GPU draw call?",
      options: [
        "Ray Tracing",
        "Audio Spatialization",
        "Texture Upscaling",
        "GPU Instancing"
      ],
      correct_option_index: 3,
      explanation: "GPU Instancing draws many identical meshes with unique transforms and color properties in a single draw call.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In graphics optimization, what is 'Overdraw'?",
      options: [
        "When the GPU calculates and shades the exact same screen pixel multiple times in a single frame due to overlapping or transparent geometry, wasting fill-rate bandwidth",
        "Drawing 3D art on paper with too much ink",
        "Having too many players in a multiplayer lobby",
        "A bank error in an in-game shop"
      ],
      correct_option_index: 0,
      explanation: "Overdraw occurs when overlapping geometry causes the fragment shader to shade the same pixel repeatedly, wasting GPU fill rate.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What do 'LOD Groups' (Level of Detail) do to optimize 3D mesh rendering performance?",
      options: [
        "They make all models completely flat 2D sprites",
        "They change character clothing colors",
        "They automatically substitute lower-polygon versions of a 3D model as the object moves farther away from the camera and occupies less screen space",
        "They delete objects permanently when they move away"
      ],
      correct_option_index: 2,
      explanation: "LOD groups reduce vertex and triangle counts for distant meshes where high geometric detail is imperceptible.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "Which of the following profiling tools is an open-source, industry-standard standalone GPU frame debugger used to capture and inspect individual draw calls, texture bindings, and shader passes?",
      options: [
        "Microsoft Word",
        "RenderDoc",
        "VLC Media Player",
        "Unity Web Player"
      ],
      correct_option_index: 1,
      explanation: "RenderDoc is the gold standard standalone frame debugger for capturing and analyzing GPU draw calls and pipeline states.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In performance profiling, how do you determine if a game is 'CPU-Bound' versus 'GPU-Bound' using frame telemetry?",
      options: [
        "CPU-bound means the monitor is turned off; GPU-bound means the speakers are muted",
        "There is zero difference; games are always both simultaneously",
        "If the CPU Game/Render thread time exceeds the target budget (e.g. >16.6ms) while the GPU is idle/waiting, the game is CPU-bound; if the GPU frame time is the longest bottleneck, it is GPU-bound",
        "CPU-bound games only happen on mobile phones"
      ],
      correct_option_index: 2,
      explanation: "Comparing CPU execution time against GPU processing time identifies which processing unit is stalling the frame cycle.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Unity C# programming, why does 'Boxing' a value type (e.g. assigning an int to an object or interface) hurt performance in hot loops?",
      options: [
        "Boxing forces the value type from the fast stack onto the managed heap, creating a dynamic memory allocation that increases Garbage Collection pressure and causes frame stutters",
        "Boxing makes numbers negative",
        "Boxing crashes the graphics driver",
        "Boxing is only supported in C++"
      ],
      correct_option_index: 0,
      explanation: "Boxing allocates a heap wrapper object for a stack value type, generating unnecessary garbage that triggers GC pauses.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "How does an 'Early-Z Depth Pre-Pass' optimize GPU fragment shader performance in scenes with heavy overdraw?",
      options: [
        "It turns off all lighting in the scene",
        "It renders the game in black and white",
        "It reduces texture resolution to 16x16 pixels",
        "It renders scene geometry into the depth buffer first with color output disabled; subsequent full rendering passes use hardware Early-Z tests to reject occluded background pixels before running expensive pixel shaders"
      ],
      correct_option_index: 3,
      explanation: "Early-Z pre-passes populate the depth buffer first, allowing the GPU to reject occluded pixels before running complex fragment shaders.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In large open-world rendering, what is 'Hierarchical Level of Detail' (HLOD)?",
      options: [
        "A system that increases the difficulty of enemies",
        "A system that combines entire clusters of distant static meshes and their textures into a single simplified proxy mesh and material, drastically reducing draw calls",
        "A tool used to animate facial expressions",
        "A system that loads audio files from the cloud"
      ],
      correct_option_index: 1,
      explanation: "HLOD merges multiple distant mesh clusters into a single unified proxy mesh, collapsing dozens of draw calls into one.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In 3D texture management, what are 'Mipmaps' and why do they improve both rendering performance and visual quality?",
      options: [
        "Maps showing secret treasure locations",
        "Audio files compressed for streaming",
        "Pre-calculated, downscaled sequences of a texture (e.g. 1024, 512, 256, 128) that reduce GPU texture cache thrashing at a distance and eliminate texture shimmering/aliasing",
        "A method to delete textures when out of memory"
      ],
      correct_option_index: 2,
      explanation: "Mipmaps provide pre-filtered texture resolutions matched to screen pixel density, boosting GPU texture cache hits and preventing moire aliasing.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In high-performance game architecture, why does a 'Structure of Arrays' (SoA) memory layout dramatically outperform an 'Array of Structures' (AoS) during bulk entity updates?",
      options: [
        "SoA stores identical component fields contiguously in memory; when iterating over a single attribute (like positions), the CPU fills entire L1/L2 cache lines with useful data without wasting bandwidth on unused attributes, maximizing SIMD vectorization",
        "AoS uses less RAM than SoA",
        "SoA is only compatible with Apple silicon",
        "AoS runs faster because it uses classes"
      ],
      correct_option_index: 0,
      explanation: "SoA organizes contiguous field arrays, ensuring every byte fetched into CPU cache lines is utilized during bulk arithmetic passes.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Unity's Data-Oriented Technology Stack (DOTS), how does the 'Burst Compiler' achieve C++ level or better execution speeds from C# code?",
      options: [
        "By deleting half of the code before compilation",
        "By converting C# into JavaScript for browser execution",
        "By running code exclusively on mobile chips",
        "It takes a restricted subset of C# (High-Performance C# / HPC#), analyzes data dependencies, and uses LLVM to generate highly optimized native machine code with automatic SIMD vectorization"
      ],
      correct_option_index: 3,
      explanation: "Burst compiles HPC# into native machine code via LLVM, leveraging automatic SIMD vectorization and cache optimization.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In multithreaded game engine architecture, why are 'Lock-Free Atomic Primitives' (e.g. std::atomic, Interlocked) preferred over heavy Mutexes (std::mutex) for high-frequency operations?",
      options: [
        "Mutexes are not supported in C++",
        "When a thread encounters a locked Mutex, the operating system suspends the thread and performs an expensive CPU Context Switch; atomic operations execute directly at the hardware instruction level with zero OS context switching overhead",
        "Lock-free primitives make graphics sharper",
        "Atomic operations can only be used on 3D models"
      ],
      correct_option_index: 1,
      explanation: "Mutexes incur expensive OS thread suspension and context-switching penalties, whereas atomics execute via direct CPU hardware instructions.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In CPU render thread optimization, what is the fundamental performance bottleneck caused by excessive 'Draw Calls'?",
      options: [
        "The computer screen loses color accuracy",
        "Draw calls cause internet lag",
        "Each draw call requires the CPU render thread to validate pipeline state, bind vertex buffers, set shader parameters, and issue driver commands, overwhelming the CPU before commands reach the GPU",
        "Draw calls delete files from the solid state drive"
      ],
      correct_option_index: 2,
      explanation: "The CPU driver overhead of setting pipeline states, switching shaders, and submitting draw calls chokes the render thread.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "How does using 'ArrayPool<T>.Shared.Rent()' in C# prevent Garbage Collection pauses during temporary buffer operations?",
      options: [
        "It rents a pre-allocated array from a thread-safe shared memory pool and returns it upon completion, allocating zero objects on the managed heap and generating zero garbage collection work",
        "It permanently allocates 50 GB of RAM on the user's computer",
        "It converts C# arrays into 3D textures",
        "It runs the Garbage Collector continuously every frame"
      ],
      correct_option_index: 0,
      explanation: "ArrayPool rents and recycles memory buffers from a pre-allocated pool, ensuring zero-allocation performance for temporary arrays.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #126.");
  console.log("Skill #126 update completed successfully!");
}

run();
