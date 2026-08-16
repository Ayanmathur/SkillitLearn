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

const skillId = "08dbd9f4-d8b3-4aec-a3e4-9aa24de90a44";

async function run() {
  console.log("Updating Skill #131: Character & Environment Animation (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Skeletal Rigging, Skinning and FK/IK Chains" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Gameplay Animation, Blend Trees and State Machines" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Environmental Animation, Vertex Shaders and Procedural IK" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Lead Technical Animation Director level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Bone Hierarchies, Joint Orientations and Skinning",
      order_index: 1,
      content: `### Skeletal Foundations and Vertex Influences

1. Bone Hierarchy:
   - Root -> Pelvis -> Spine -> Chest -> Neck -> Head; Clavicles -> Shoulders -> Elbows -> Wrists -> Fingers.
   - Consistent Joint Orientation: Ensuring primary bone axes align uniformly along bone lengths.

2. Skinning & Vertex Weighting:
   - Weight Painting: Binding mesh vertices to bone transforms.
   - GPU Hardware Limits: Capping skinning influences to 4 or 8 bones per vertex for high-speed GPU shader computation.`
    },
    {
      track_id: track1Id,
      title: "Linear Blend Skinning (LBS) vs Dual Quaternion Skinning",
      order_index: 2,
      content: `### Skin Deformation Mathematics and Volume Preservation

1. Linear Blend Skinning (LBS):
   - Standard matrix blending; suffers from severe volume loss (the 'candy-wrapper' collapse artifact) when joints twist 180 degrees (e.g. wrist and forearm twisting).

2. Dual Quaternion Skinning (DQS):
   - Blends rigid rotations and translations through dual quaternions, completely preserving anatomical cross-sectional volume during extreme joint twists.`
    },
    {
      track_id: track1Id,
      title: "Forward Kinematics (FK) vs Inverse Kinematics (IK) Systems",
      order_index: 3,
      content: `### Kinetic Chains, Solvers and Pole Vectors

1. Forward Kinematics (FK):
   - Posing parent joints down the hierarchical chain (Shoulder -> Elbow -> Hand); ideal for fluid, expressive swinging arcs.

2. Inverse Kinematics (IK):
   - Positioning the end-effector (Hand/Foot target) while mathematical solvers (Two-Bone IK, FABRIK) calculate intermediate joint rotations automatically.
   - Pole Vector Constraints: Directing the 3D swivel angle of elbows and knees.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The 12 Animation Principles in Real-Time Games",
      order_index: 1,
      content: `### Interactive Timing and Kinetic Weight

1. Anticipation vs Input Snappiness:
   - Balancing artistic anticipation with instant game responsiveness; cutting long anticipation frames down to 1-2 frames on player attack inputs to eliminate sluggish control feel while preserving weighty follow-through.

2. Overlapping Action and Drag:
   - Allowing secondary elements (hair, clothing, holsters) to lag behind main pelvic movement to convey momentum and organic physical inertia.`
    },
    {
      track_id: track2Id,
      title: "Locomotion Blend Trees (1D and 2D Cartesian)",
      order_index: 2,
      content: `### Velocity-Driven Animation Interpolation

1. 1D Blend Trees:
   - Linearly blending between Idle (0 m/s) -> Walk (1.5 m/s) -> Run (4.0 m/s) -> Sprint (7.0 m/s) based on a single scalar speed parameter.

2. 2D Freeform Directional Blend Trees:
   - Interpolating multidirectional locomotion (forward, backward, left/right strafing) across 2D Cartesian velocity coordinates (X, Y) without foot-sliding.`
    },
    {
      track_id: track2Id,
      title: "Animation Layering, Bone Masking and State Transitions",
      order_index: 3,
      content: `### State Machines and Layered Skeletal Blending

1. State Machines:
   - Managing transitions between distinct motion states (Locomotion -> Jump -> Fall -> Land) with calibrated crossfade blend durations (0.15s).

2. Bone Masking / Layering:
   - Isolating upper-body bones to play weapon firing, aiming, or reloading animations while lower-body bones concurrently execute full-speed sprinting.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Vertex Shader Foliage and World Position Offset (WPO)",
      order_index: 1,
      content: `### GPU-Driven Environmental Motion

1. Vertex Shader Wind:
   - Utilizing mathematical sine and cosine wave equations inside material shaders (World Position Offset in Unreal / Vertex Shader in Unity) to simulate oscillating foliage, bending grass, and waving cloth without skeletal bone overhead.

2. Pivot Painter:
   - Baking hierarchical branch pivots into texture maps for realistic cascading wind physics.`
    },
    {
      track_id: track3Id,
      title: "Procedural Foot Placement and Slope Alignment IK",
      order_index: 2,
      content: `### Dynamic Ground Adaptation and Raycast Solvers

1. Procedural Foot IK:
   - Firing downward raycasts from character feet to detect uneven ground height and surface normal angles.

2. Two-Bone Foot IK:
   - Adjusting pelvis displacement and rotating foot bones parallel to ground slopes and stairs, eliminating foot-sliding and mid-air floating across rocky terrain.`
    },
    {
      track_id: track3Id,
      title: "Motion Matching and Next-Gen Procedural Animation",
      order_index: 3,
      content: `### Continuous Motion Databases and Secondary Physics

1. Motion Matching:
   - Replacing monolithic state machines with continuous real-time queries across vast motion-capture databases, instantly finding animations that match the player's current pose, velocity, and stick trajectory.

2. Secondary Spring Physics:
   - Simulating procedural inertial drag and bouncy physics on accessories, ponytails, and armor using spring-bone algorithms.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #131.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In 3D character rigging, what is 'Inverse Kinematics' (IK)?",
      options: [
        "A system where placing the end-effector (such as a hand or foot target) causes mathematical solvers to automatically calculate the rotations of all parent joints (elbows, knees, hips)",
        "An animation that plays in reverse",
        "A tool used to delete 3D character models",
        "A method to make characters move without a skeleton"
      ],
      correct_option_index: 0,
      explanation: "IK calculates joint rotations upward from an end-effector position, essential for planting feet on terrain or grabbing objects.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In gameplay animation systems, what is a '1D Blend Tree'?",
      options: [
        "A tree model with only one polygon",
        "An audio mixer track",
        "An animation node that smoothly blends between multiple animation clips (e.g. Idle -> Walk -> Run -> Sprint) based on a single scalar parameter like character speed",
        "A 2D sprite sheet"
      ],
      correct_option_index: 2,
      explanation: "1D blend trees interpolate between animations along a single numerical parameter (like locomotion speed).",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In real-time GPU skinning, what is the standard maximum number of bone influences allowed per mesh vertex for optimal performance?",
      options: [
        "100 bones per vertex",
        "4 to 8 bones per vertex",
        "1,000 bones per vertex",
        "Exactly 1 bone per vertex always"
      ],
      correct_option_index: 1,
      explanation: "Game engines and GPU skinning shaders cap vertex bone influences to 4 (mobile/standard) or 8 (high-end) to optimize GPU memory and arithmetic.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In environment animation, how do modern game engines animate thousands of waving grass blades and tree branches with near-zero CPU performance cost?",
      options: [
        "By animating each grass blade by hand",
        "By building a 50-bone skeleton inside every blade of grass",
        "By taking screenshots of real grass",
        "By calculating mathematical wind wave oscillations directly on the GPU in the vertex shader (World Position Offset / Vertex Shader)"
      ],
      correct_option_index: 3,
      explanation: "Vertex shader WPO displaces vertices mathematically on the GPU, animating foliage without expensive skeletal CPU overhead.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In animation rigging, what is a 'Pole Vector Constraint'?",
      options: [
        "A special target handle in 3D space that controls the direction and swivel angle of a character's knees or elbows during IK solving",
        "A flag pole model placed in a level",
        "A constraint that freezes character rotation",
        "A tool used to paint textures on poles"
      ],
      correct_option_index: 0,
      explanation: "Pole vectors provide an external directional target that dictates which way knees and elbows point during IK calculations.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In character mesh skinning, what is the 'Candy-Wrapper Artifact' that occurs when using Linear Blend Skinning (LBS)?",
      options: [
        "Textures turning into candy wrappers",
        "A bug where characters eat virtual food",
        "When character models become completely transparent",
        "The severe structural collapsing, pinching, and loss of cross-sectional volume that occurs when a joint twists 180 degrees (e.g. wrist and forearm twisting)"
      ],
      correct_option_index: 3,
      explanation: "Linear Blend Skinning blends matrices linearly, causing ugly mesh collapse ('candy-wrapper' pinching) during axial joint twists.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "How does 'Dual Quaternion Skinning' (DQS) solve the volume loss problem of Linear Blend Skinning?",
      options: [
        "By deleting half of the character's polygons",
        "It mathematically blends rigid rotations and translations using dual quaternions, completely preserving the spherical and cylindrical volume of limbs during extreme joint twisting",
        "By adding extra lights around the character",
        "DQS only works on static furniture"
      ],
      correct_option_index: 1,
      explanation: "Dual Quaternion Skinning mathematically preserves volume during rotation, eliminating candy-wrapper joint pinching.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In gameplay animation architecture, what does 'Bone Masking' (Layered Animation) enable?",
      options: [
        "It splits the skeleton so the upper body can play aiming, shooting, or reloading animations while the lower body concurrently executes running or sprinting locomotion",
        "It hides the character skeleton from the player's view",
        "It turns character bones into solid metal in physics",
        "It is a visual mask that hides enemy faces"
      ],
      correct_option_index: 0,
      explanation: "Bone masking isolates skeletal subsets, allowing upper-body action animations to blend over lower-body locomotion states.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "How does 'Procedural Foot Placement IK' improve character realism when traversing uneven stairs and rocky terrain?",
      options: [
        "It makes character shoes glow in the dark",
        "It speeds up character movement by 500%",
        "It casts downward raycasts from the feet to detect ground height and surface normal angles, dynamically adjusting pelvic height and rotating feet parallel to slopes to prevent floating and clipping",
        "It deletes terrain beneath character feet"
      ],
      correct_option_index: 2,
      explanation: "Procedural Foot IK uses ground raycasts to align feet with slope normals and adjust hip height, eliminating foot floating and floor clipping.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In real-time action gameplay animation, why is long 'Anticipation' (from classic animation principles) often heavily compressed or eliminated for player attack inputs?",
      options: [
        "Because game engines cannot render anticipation frames",
        "Because anticipation frames take up too much RAM",
        "Anticipation is strictly illegal in 3D animation",
        "Excessive anticipation creates perceived input lag and sluggishness; action combat requires instantaneous 1-to-2 frame responsiveness upon button press, shifting artistic weight to follow-through and impact"
      ],
      correct_option_index: 3,
      explanation: "Players demand instantaneous control responsiveness; long anticipation creates sluggish input lag, so designers prioritize snappy startups.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In next-generation animation systems (such as in The Last of Us Part II or Unreal Engine 5), what is 'Motion Matching' and how does it replace traditional Animation State Machines?",
      options: [
        "Motion matching matches audio files to character footsteps",
        "It abandons complex node state machines; instead, an algorithm continuously queries a massive motion-capture database in real-time to pick the exact animation frame that best matches the character's current pose, velocity, and stick input trajectory",
        "It forces two characters to mirror each other's movements",
        "Motion matching is a 2D sprite animation tool"
      ],
      correct_option_index: 1,
      explanation: "Motion Matching queries mocap databases in real time to find matching poses and trajectories, achieving unparalleled fluid locomotion without transition trees.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In 2D Cartesian Locomotion Blend Trees, why are animations mapped to a 2D velocity coordinate space (X = Strafe Velocity, Y = Forward Velocity)?",
      options: [
        "To make character models run on flat 2D planes only",
        "To delete backward movement animations",
        "It allows continuous, multi-directional blending between forward, backward, left/right strafe, and diagonal running animations based on analog joystick input without foot-sliding",
        "2D blend trees are only used for menu UI"
      ],
      correct_option_index: 2,
      explanation: "2D Cartesian blend trees map directional velocity vectors to locomotion clips, allowing seamless strafing and diagonal movement.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In technical rigging and joint orientation, why is establishing consistent 'Primary and Secondary Bone Axes' (e.g. +X down bone, +Y for primary bend) critical?",
      options: [
        "Consistent axes allow automated mirror pasting of poses, prevent gimbal flipping during rotational interpolation, and ensure IK solvers calculate predictable bending planes across all limbs",
        "To make bones visible in the dark",
        "Because inconsistent axes cause computer processor overheating",
        "Bones do not have coordinate axes in 3D"
      ],
      correct_option_index: 0,
      explanation: "Consistent joint axes ensure predictable rotation planes, prevent gimbal flips, and allow seamless symmetry mirroring across rigs.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In procedural character dynamics, what are 'Spring Bones' (or KawaiiPhysics / Dynamic Secondary Bones)?",
      options: [
        "Physical springs installed inside gaming controllers",
        "Bones that make characters jump higher",
        "Bones that only move in the springtime",
        "Procedural bone chains driven by spring-damper physics algorithms that simulate inertia, drag, and gravity on secondary character assets (hair, capes, tails, equipment) without keyframe animation"
      ],
      correct_option_index: 3,
      explanation: "Spring bones simulate dynamic inertia and damping on secondary attachments (ponytails, capes, holsters) procedurally in real time.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In environmental foliage shaders, what is the role of 'Pivot Painter' in Unreal Engine?",
      options: [
        "A digital paintbrush used to paint 2D textures",
        "It bakes 3D model hierarchy pivot points and rotation axes directly into custom UV and texture channels, allowing vertex shaders to simulate hierarchical wind motion (leaves oscillating on branches, branches bending on trunks)",
        "A tool that deletes trees from the game world",
        "A system that records foliage audio"
      ],
      correct_option_index: 1,
      explanation: "Pivot Painter encodes sub-mesh pivot coordinates in texture data, enabling GPU vertex shaders to simulate hierarchical wind swaying.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #131.");
  console.log("Skill #131 update completed successfully!");
}

run();
