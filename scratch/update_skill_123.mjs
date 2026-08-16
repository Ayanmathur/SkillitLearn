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

const skillId = "147248f6-dce5-4f09-985b-0c20be49e711";

async function run() {
  console.log("Updating Skill #123: Programming Fundamentals for Games (9 steps across 3 tracks)...");

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
        title: `Track ${tracks.length + 1}: Programming Fundamentals for Games`,
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
  await supabase.from("tracks").update({ title: "Track 1: The Game Loop, Delta Time and Memory Architecture" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Vector Mathematics, Coordinate Spaces and Quaternions" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Game Design Patterns, FSMs and Object Pooling" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Principal Game Engine Programmer level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Core Game Loop and Timestep Architecture",
      order_index: 1,
      content: `### Execution Cycle and Frame-Rate Independence

1. The Classic Game Loop:
   - Structure: while (running) { ProcessInput(); Update(deltaTime); Render(); }

2. Variable vs Fixed Timesteps:
   - Variable Timestep (Update): Runs once per rendered frame; updates animations and UI using Delta Time (dt) to ensure motion speed is independent of framerate (Position += Velocity * dt).
   - Fixed Timestep (FixedUpdate): Runs at a fixed rate (e.g. 50Hz / 0.02s) to guarantee deterministic, stable physics calculations.`
    },
    {
      track_id: track1Id,
      title: "Memory Management: Stack vs Heap and Cache Locality",
      order_index: 2,
      content: `### Hardware Memory Hierarchy and Cache Performance

1. Memory Segments:
   - Stack: Fast, contiguous, compiler-managed memory for local primitives and value types.
   - Heap: Dynamic memory for objects and references, prone to fragmentation.

2. CPU Cache Locality (Data-Oriented Design):
   - Arranging game data contiguously in memory arrays so L1/L2/L3 CPU caches prefetch data efficiently, avoiding expensive RAM cache misses and pipeline stalls.`
    },
    {
      track_id: track1Id,
      title: "Garbage Collection and Zero-Allocation Programming",
      order_index: 3,
      content: `### Managed Memory and Stutter-Free Code

1. Garbage Collection (GC) Spikes:
   - In managed languages (C# in Unity), generational GC sweeps pause execution to free unreferenced heap objects, causing perceptible frame drops.

2. Zero-Allocation Rules:
   - Use Value Types (structs), avoid string concatenation in hot update loops, pre-allocate lists, and employ NonAlloc physics query methods (e.g. Physics.RaycastNonAlloc).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Vector Algebra: Dot Product and Cross Product",
      order_index: 1,
      content: `### 3D Vector Geometry in Game Engines

1. Vector Fundamentals:
   - Magnitude (Length = sqrt(x^2 + y^2 + z^2)) and Normalized Unit Vectors (v / ||v||).

2. Dot Product (a . b = ||a|| * ||b|| * cos(theta)):
   - Returns a scalar; used to determine if a target is in front of or behind an enemy, calculate field of view angles, and evaluate Lambertian lighting.

3. Cross Product (a x b):
   - Returns a perpendicular vector; used to calculate surface normals and torque axes.`
    },
    {
      track_id: track2Id,
      title: "Coordinate Spaces and 4x4 Transformation Matrices",
      order_index: 2,
      content: `### The 3D Rendering and Transform Pipeline

1. Coordinate Space Hierarchy:
   - Model / Local Space -> World Space (via Translation, Rotation, Scale TRS Matrix) -> View / Camera Space -> Clip Space (Perspective Projection) -> Screen Space (pixel coordinates).

2. Matrix Transformation:
   - Multiplying 3D coordinate vectors by 4x4 transformation matrices to translate, rotate, and scale GameObjects within the 3D world.`
    },
    {
      track_id: track2Id,
      title: "Rotations: Euler Angles, Gimbal Lock and Quaternions",
      order_index: 3,
      content: `### 3D Angular Orientation and Gimbal Prevention

1. Euler Angles and Gimbal Lock:
   - Rotating sequentially around X, Y, Z axes. Major Vulnerability: Gimbal Lock (loss of one rotational degree of freedom when two axes align at 90 degrees).

2. Quaternions (4D Hypercomplex Numbers [w, x, y, z]):
   - Represents smooth 3D rotations without gimbal lock.
   - Spherical Linear Interpolation (Slerp): Smoothly interpolates rotations along the shortest geodesic arc on a unit 4D hypersphere.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Object Pooling and Component-Based Architectures",
      order_index: 1,
      content: `### High-Performance Structural Design Patterns

1. The Component Pattern:
   - Composition over inheritance; GameObjects act as containers hosting modular, decoupled components (Transform, MeshRenderer, Collider, Rigidbody).

2. The Object Pool Pattern:
   - Pre-instantiating a fixed reservoir of objects (bullets, particle effects, enemies) at scene initialization, activating and recycling them on demand to eliminate runtime Instantiate/Destroy allocations.`
    },
    {
      track_id: track3Id,
      title: "Finite State Machines (FSM) and Character Controllers",
      order_index: 2,
      content: `### State Management and Clean Transitions

1. The State Pattern:
   - Replacing brittle nested boolean flags (isJumping, isRunning, isAttacking) with distinct State objects implementing Enter(), Update(), and Exit() methods.

2. Deterministic Transitions:
   - Enforcing mutually exclusive character behavior states (e.g. Idle -> Run -> Jump -> Fall), ensuring clean transitions and preventing mid-air action bugs.`
    },
    {
      track_id: track3Id,
      title: "The Observer Pattern, Event Buses and Command Pattern",
      order_index: 3,
      content: `### Decoupled Communication and Input Architecture

1. The Observer Pattern and Event Buses:
   - Broadcasting gameplay events (e.g. OnPlayerDeath, OnItemCollected) using C# Actions / C++ Delegates, allowing UI, Audio, and Achievement systems to react without hard references.

2. The Command Pattern:
   - Encapsulating player input into command objects, enabling seamless input rebinding, network serialization, and replay / undo-redo buffers.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #123.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In game programming, why is movement calculated using 'Delta Time' (e.g. Position += Velocity * deltaTime)?",
      options: [
        "To ensure that character movement speed is independent of the computer's frame rate (moving at the same speed whether running at 30 FPS or 144 FPS)",
        "To make the game run at 1,000 frames per second",
        "To prevent players from pausing the game",
        "To automatically save game progress"
      ],
      correct_option_index: 0,
      explanation: "Delta time scales movement by the elapsed frame time, ensuring consistent physical speed across varying hardware framerates.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In 3D game math, what mathematical operation between two normalized vectors returns a scalar value of 1.0 when the vectors point in the exact same direction and 0 when perpendicular?",
      options: [
        "Cross Product",
        "Matrix Multiplication",
        "Dot Product",
        "Vector Addition"
      ],
      correct_option_index: 2,
      explanation: "The Dot Product (a . b = cos(theta)) yields 1.0 when parallel (0 deg) and 0 when perpendicular (90 deg).",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In game architecture, what design pattern pre-instantiates a collection of objects (like bullets or projectiles) at startup to avoid runtime allocation and destruction overhead?",
      options: [
        "Singleton Pattern",
        "Object Pool Pattern",
        "Decorator Pattern",
        "Abstract Factory Pattern"
      ],
      correct_option_index: 1,
      explanation: "The Object Pool pattern recycles pre-allocated objects in memory, avoiding performance-destroying garbage collection and allocation overhead.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In 3D rotations, what is 'Gimbal Lock' that occurs when using Euler Angles (Pitch, Yaw, Roll)?",
      options: [
        "A feature that locks the camera in place",
        "A physical lock on a gaming mouse",
        "A cheat code used by speedrunners",
        "The loss of one rotational degree of freedom when two of the three rotational axes align parallel to each other (e.g. Pitching up 90 degrees)"
      ],
      correct_option_index: 3,
      explanation: "Gimbal lock occurs in Euler angles when two rotational axes align at 90 degrees, locking out one axis of rotational movement.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In Unity and Unreal Engine architectures, what principle underlies the 'Component Pattern'?",
      options: [
        "Favoring composition over inheritance by allowing GameObjects to act as containers that host modular, plug-and-play components (e.g. Transform, Collider, Rigidbody)",
        "Writing all code in a single 10,000-line script",
        "Using only global variables",
        "Preventing scripts from communicating with each other"
      ],
      correct_option_index: 0,
      explanation: "Component-based architecture builds entity behaviors through composition of independent modular components rather than deep class inheritance.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In C# Unity game development, why is Garbage Collection (GC) in hot update loops (Update()) a major source of frame rate stutter?",
      options: [
        "Because GC increases computer battery life",
        "Because GC deletes saved game files",
        "Because GC only runs when the player presses pause",
        "The generational GC engine must pause main thread execution (stop-the-world) to scan the heap and reclaim memory from discarded temporary objects (e.g. strings, arrays), causing micro-freezes"
      ],
      correct_option_index: 3,
      explanation: "Garbage collection halts main thread execution to clean heap allocations; creating temporary objects in Update() causes recurring frame drops.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In game mathematics, what mathematical representation of 3D rotations uses 4D hypercomplex numbers [w, x, y, z] to completely eliminate Gimbal Lock?",
      options: [
        "Euler Angles",
        "Quaternions",
        "Cartesian Coordinates",
        "Polar Vectors"
      ],
      correct_option_index: 1,
      explanation: "Quaternions represent 3D orientations as 4-dimensional hypercomplex numbers, ensuring smooth, singularity-free rotational interpolation.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In game loop timing, what is the critical difference between the variable 'Update(dt)' loop and the fixed 'FixedUpdate(fixedDt)' loop?",
      options: [
        "Update() runs at a variable rate synchronized with rendering frames; FixedUpdate() runs on a strict, constant time step (e.g. 50Hz) to ensure deterministic, stable physics simulations",
        "Update() is for 2D games; FixedUpdate() is for 3D games",
        "Update() only runs on mobile phones; FixedUpdate() runs on PCs",
        "FixedUpdate() can only be called once per hour"
      ],
      correct_option_index: 0,
      explanation: "Update handles frame-dependent rendering and input, while FixedUpdate processes physics on a constant fixed timestep for stability.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In vector mathematics, what does the 'Cross Product' of two 3D vectors produce?",
      options: [
        "A single number (scalar)",
        "The sum of both vectors",
        "A third vector that is strictly perpendicular (orthogonal) to both input vectors, forming the basis for calculating surface normal vectors",
        "A 4x4 matrix"
      ],
      correct_option_index: 2,
      explanation: "The Cross Product yields a vector perpendicular to both inputs, essential for computing surface normals and physics torque.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In character controller architecture, why is implementing a 'Finite State Machine' (FSM) vastly superior to using nested boolean flags (e.g. isJumping, isAttacking, isDashing)?",
      options: [
        "Because booleans cannot be compiled by game engines",
        "Because FSMs double the graphics resolution",
        "Because state machines are only used in board games",
        "FSMs encapsulate character behaviors into distinct state classes (with Enter, Update, and Exit hooks), guaranteeing mutually exclusive states and eliminating bizarre animation glitches and impossible state overlaps"
      ],
      correct_option_index: 3,
      explanation: "FSMs prevent bugs caused by conflicting boolean combinations by strictly enforcing mutually exclusive, deterministic state transitions.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In computer systems architecture and Data-Oriented Design (DOD), what is 'Cache Locality' and why does contiguous array storage dramatically outperform pointer-based object graphs in game loops?",
      options: [
        "Cache locality means storing files in the browser cache",
        "CPUs fetch contiguous memory into high-speed L1/L2/L3 cache lines in advance; iterating over contiguous arrays produces fast cache hits, whereas chasing scattered heap pointers causes frequent RAM cache misses that stall CPU execution",
        "Contiguous arrays use less hard drive space",
        "Object graphs run faster because they use pointers"
      ],
      correct_option_index: 1,
      explanation: "Contiguous memory layouts optimize CPU hardware cache prefetching, preventing devastating RAM latency stalls during intensive game loops.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "What is 'Spherical Linear Interpolation' (Slerp) and why is it preferred over standard Linear Interpolation (Lerp) for rotating between two Quaternions?",
      options: [
        "Slerp is used only for audio volume",
        "Slerp only works on flat 2D planes",
        "Slerp interpolates along the shortest geodesic arc on the unit 4D hypersphere at a constant angular velocity, preventing the rotational speed distortions caused by Euclidean linear interpolation",
        "Lerp is illegal in 3D game engines"
      ],
      correct_option_index: 2,
      explanation: "Slerp maintains constant angular velocity along the 4D spherical arc, preventing the non-linear rotational speeding and slowing of standard Lerp.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In the 3D graphics rendering pipeline, what sequence of coordinate spaces transforms a raw 3D mesh vertex into final 2D screen pixels?",
      options: [
        "Model (Local) Space -> World Space (via TRS Matrix) -> View (Camera) Space -> Clip Space (Perspective Projection) -> Screen Space",
        "Screen Space -> World Space -> Model Space -> RAM",
        "Pixel Space -> Texture Space -> World Space -> Audio Space",
        "World Space -> Hard Drive Space -> Screen Space"
      ],
      correct_option_index: 0,
      explanation: "The transformation pipeline progresses from Local Model Space -> World Space -> Camera View Space -> Clip Space -> Screen Space.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "How does the 'Command Pattern' enable input remapping and replay / undo-redo buffers in game engines?",
      options: [
        "By executing terminal console commands in Windows",
        "By deleting player input files",
        "By allowing the computer to play the game automatically",
        "It decouples the input hardware (key press / controller trigger) from the action by encapsulating actions into Command objects (e.g. MoveCommand, JumpCommand) that can be remapped, stored in a history queue, and executed on demand"
      ],
      correct_option_index: 3,
      explanation: "The Command pattern turns actions into first-class objects, enabling flexible key rebinding, network serialization, and replay logs.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "Why is utilizing 'Physics.RaycastNonAlloc()' in Unity C# preferred over standard 'Physics.RaycastAll()' in performance-critical game loops?",
      options: [
        "RaycastNonAlloc makes lasers shoot farther",
        "RaycastAll allocates a new RaycastHit array on the managed heap on EVERY call, generating continuous GC pressure; RaycastNonAlloc populates a pre-allocated reusable array with zero heap allocations",
        "RaycastAll is deprecated and will not compile",
        "RaycastNonAlloc works in the dark"
      ],
      correct_option_index: 1,
      explanation: "RaycastNonAlloc populates a pre-allocated buffer, achieving zero heap allocations and eliminating GC stutter during high-frequency raycasts.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #123.");
  console.log("Skill #123 update completed successfully!");
}

run();
