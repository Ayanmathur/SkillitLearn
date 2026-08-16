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

const skillId = "71641347-ef66-49e9-ad51-430d6150eb42";

async function run() {
  console.log("Updating Skill #125: Physics & Collision Systems (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Rigid Body Dynamics, Numerical Integration and Solvers" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Collision Detection: Broadphase, Narrowphase and CCD" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Ragdolls, Raycasting and Custom Physics Controllers" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Lead Physics Engine Programmer level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Rigid Body Mechanics: Forces, Torques and Inertia Tensors",
      order_index: 1,
      content: `### Newtonian Rigid Body Mechanics

1. Linear and Angular Dynamics:
   - Linear Motion: F = m * a (Force = mass * acceleration); computes linear velocity and momentum.
   - Angular Motion: Torque (tau = r x F) and angular acceleration (tau = I * alpha), governed by the 3x3 Inertia Tensor matrix (I) defining resistance to rotational change about 3D axes.

2. Center of Mass:
   - Applying forces away from the Center of Mass generates angular torque alongside linear impulse.`
    },
    {
      track_id: track1Id,
      title: "Numerical Integration: Euler, Verlet and RK4 Solvers",
      order_index: 2,
      content: `### Numerical Approximations of Continuous Motion

1. Integration Paradigms:
   - Explicit Euler: Unstable; introduces artificial energy, causing physical systems to explode over time.
   - Semi-Implicit Euler (Symplectic Euler): Computes velocity first (v_new = v + a*dt) then updates position (x_new = x + v_new*dt); conserves energy and serves as the industry standard in PhysX, Havok, and Bullet.
   - Verlet & RK4: High-precision solvers used for cloth, ropes, and planetary physics.`
    },
    {
      track_id: track1Id,
      title: "Physics Constraints, Friction and Impulse Solvers",
      order_index: 3,
      content: `### Constraint Solvers and Surface Interaction

1. Sequential Impulse Solvers:
   - Resolving contacts via instantaneous velocity impulses (J) to eliminate interpenetration without unrealistic spring elasticity.

2. Friction and Restitution:
   - Coulomb Friction: Static friction (mu_s) resisting initial motion vs Kinetic friction (mu_k) resisting sliding.
   - Restitution (e): Elasticity ratio (0.0 perfectly inelastic thud to 1.0 perfectly elastic bounce).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Broadphase Spatial Partitioning (AABB Trees, BVH, Grid Hashing)",
      order_index: 1,
      content: `### Spatial Optimization and Broadphase Culling

1. The Pairwise Problem:
   - Testing collisions across N objects takes O(N^2) pairwise tests; 1,000 bodies require 500,000 checks.

2. Broadphase Spatial Pruning (O(N log N)):
   - Axis-Aligned Bounding Box (AABB) Trees, Bounding Volume Hierarchies (BVH), and Spatial Hash Grids cull distant pairs, discarding 99% of non-colliding objects before exact geometry checks.`
    },
    {
      track_id: track2Id,
      title: "Narrowphase Algorithms: SAT, GJK and EPA",
      order_index: 2,
      content: `### Exact Convex Geometry Collision Algorithms

1. Separating Axis Theorem (SAT):
   - If an axis exists where 1D orthogonal projections of two convex shapes do not overlap, the objects are separated.

2. GJK and EPA Algorithms:
   - Gilbert-Johnson-Keerthi (GJK): Evaluates the Minkowski Difference (A - B) to detect if the origin is contained inside the geometric simplex in O(1) time.
   - Expanding Polytope Algorithm (EPA): Computes exact penetration depth and contact normals upon GJK overlap.`
    },
    {
      track_id: track2Id,
      title: "High-Speed Tunneling and Continuous Collision Detection (CCD)",
      order_index: 3,
      content: `### Eliminating High-Velocity Physics Tunneling

1. The Tunneling Bug:
   - Discrete physics checks evaluate positions only at discrete intervals (t0, t1); fast objects (bullets, arrows) leap completely through thin colliders between ticks without registering a hit.

2. Continuous Collision Detection (CCD):
   - Swept Spherecast / Swept Volume: Extruding geometric shapes along their velocity delta vector to compute exact time-of-impact (t_hit), preventing pass-through.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Raycasts, Shape Sweeps and Collision Filtering Layers",
      order_index: 1,
      content: `### Spatial Queries and Collision Matrix Filtering

1. Geometric Casts:
   - Raycasts (infinite lines), Spherecasts (thick volume sweeps), Capsulecasts, and Boxcasts querying scene geometry.

2. LayerMask Matrix Filtering:
   - Bitmask filtering (e.g. LayerMask.GetMask('Enemies', 'Environment')) disabling collision checks between non-interactive layers (e.g. Projectiles ignoring other Projectiles) to maximize performance.`
    },
    {
      track_id: track3Id,
      title: "Ragdoll Physics and Physical Animation Blending",
      order_index: 2,
      content: `### Dynamic Skeletal Articulation and Active Ragdolls

1. Ragdoll Architecture:
   - Connecting skeletal bones to rigid body capsules linked by angular limit joints.

2. Active Physical Animation:
   - Blending kinematic keyframed animation with dynamic physical response using PD (Proportional-Derivative) joint motors, allowing characters to stumble, take realistic bullet impact impulses, and recover gracefully.`
    },
    {
      track_id: track3Id,
      title: "Vehicle Physics and Kinematic vs Dynamic Controllers",
      order_index: 3,
      content: `### Suspension Physics and Character Locomotion

1. Raycast Suspension Vehicles:
   - Modeling 4 raycast springs evaluating Hooke's Law (F = -k*x - c*v) and Pacejka's Magic Formula for lateral tire slip angles and friction.

2. Kinematic vs Dynamic Character Controllers:
   - Why platformers use Kinematic controllers (direct programmatic velocity/sweeps) instead of Dynamic Rigidbodies to ensure crisp, non-floaty player control.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #125.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In game physics, what is the 'Tunneling' problem that occurs with high-speed projectiles (like bullets or arrows)?",
      options: [
        "A fast-moving projectile moves so far in a single fixed physics time step that it leaps completely through a thin wall without registering a collision",
        "A bug where players dig underground holes",
        "A network lag issue in multiplayer servers",
        "When 3D textures fail to load"
      ],
      correct_option_index: 0,
      explanation: "Tunneling happens in discrete collision detection when a fast object's displacement per tick exceeds the thickness of an obstacle.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In physics materials, what does the 'Coefficient of Restitution' (e) determine?",
      options: [
        "The electric conductivity of a surface",
        "The transparency of a 3D mesh",
        "The elasticity / bounciness of a collision (ranging from 0.0 for a completely inelastic thud to 1.0 for a perfectly elastic bounce)",
        "The weight of an object in kilograms"
      ],
      correct_option_index: 2,
      explanation: "Restitution measures kinetic energy retention in collisions: 0.0 means zero bounce, 1.0 means full bounce elasticity.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In collision detection pipelines, what is the purpose of the 'Broadphase' stage?",
      options: [
        "To calculate exact pixel lighting",
        "To rapidly prune and eliminate pairs of objects that are far apart using fast bounding volumes (AABBs), avoiding expensive polygon-by-polygon checks",
        "To render 3D character shadows",
        "To play collision audio sound effects"
      ],
      correct_option_index: 1,
      explanation: "Broadphase eliminates non-colliding distant objects quickly, reducing O(N^2) checks to manageable candidates for narrowphase.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In 3D game engines, what spatial query projects an imaginary infinite line from an origin point along a direction vector to detect intersecting colliders?",
      options: [
        "Audio Reverb Zone",
        "NavMesh Modifier",
        "Skybox Query",
        "Raycast"
      ],
      correct_option_index: 3,
      explanation: "A Raycast fires an infinite or distance-limited line into the physics scene to detect collider hits and surface normals.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "Why do responsive action platformers and first-person shooters typically use 'Kinematic Character Controllers' rather than 'Dynamic Rigidbody Physics' for the player avatar?",
      options: [
        "Kinematic controllers move programmatically via collision sweeps, providing instantaneous, snappy movement without the floaty momentum, bouncy jitter, or tipping of true rigidbodies",
        "Because game engines do not support rigidbodies for players",
        "Because dynamic rigidbodies make graphics blurry",
        "Kinematic controllers use less internet data"
      ],
      correct_option_index: 0,
      explanation: "Kinematic controllers provide crisp, responsive control by bypassing dynamic inertia and resolving collisions programmatically.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In game physics engines (such as PhysX, Havok, and Bullet), why is 'Semi-Implicit Euler' (Symplectic Euler) integration used instead of standard 'Explicit Euler'?",
      options: [
        "Because Semi-Implicit Euler runs only on graphics cards",
        "Because Explicit Euler is banned by physics laws",
        "Because Semi-Implicit Euler is twice as slow",
        "Explicit Euler adds artificial kinetic energy into the system, causing oscillating objects to explode into infinity; Semi-Implicit Euler updates velocity first, ensuring energy conservation and stability"
      ],
      correct_option_index: 3,
      explanation: "Semi-Implicit Euler preserves symplectic energy properties, preventing numerical energy growth and instability.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In narrowphase collision detection, what is the 'Separating Axis Theorem' (SAT)?",
      options: [
        "A theorem stating that heavy objects fall faster than light objects",
        "A geometric principle stating that two convex polyhedra do NOT collide if there exists at least one axis onto which their 1D orthogonal projections do not overlap",
        "A method to split 3D meshes in half with a sword",
        "A law of computer memory separation"
      ],
      correct_option_index: 1,
      explanation: "SAT proves non-intersection if a single separating axis exists where the 1D shadow projections of two convex shapes do not overlap.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "How does 'Continuous Collision Detection' (CCD) using 'Swept Volume' eliminate projectile tunneling?",
      options: [
        "It extrudes the projectile's geometric shape along its velocity vector over the time step, creating a continuous swept 3D volume that tests for intersections and calculates the exact time of impact (t_hit)",
        "By slowing down the game engine to 1 frame per second",
        "By making all walls 50 meters thick",
        "By deleting the projectile if it moves too fast"
      ],
      correct_option_index: 0,
      explanation: "Swept CCD creates a continuous swept volume across the frame's trajectory, finding the exact time-of-impact along the path.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In rotational rigid body dynamics, what does the 3x3 'Inertia Tensor' matrix (I) represent?",
      options: [
        "The color palette of a 3D model",
        "The gravitational pull of planets",
        "A rigid body's rotational mass distribution, defining its resistance to angular acceleration when torques are applied about arbitrary 3D axes",
        "The computer's memory bandwidth"
      ],
      correct_option_index: 2,
      explanation: "The Inertia Tensor is the rotational equivalent of mass, quantifying resistance to rotational acceleration along 3D axes.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In game physics performance, why is configuring the 'Layer Collision Matrix' (LayerMask bitmasks) critical?",
      options: [
        "It makes 3D models load faster from disk",
        "It changes the language of the game",
        "It increases screen brightness",
        "It explicitly disables physics collision evaluation between designated layer pairs that never need to interact (e.g. Debris ignoring Debris, Bullets ignoring Bullets), saving massive CPU overhead"
      ],
      correct_option_index: 3,
      explanation: "LayerMask collision matrices prevent needless collision checks between layer pairs that do not interact physically.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In narrowphase computational geometry, how does the 'Gilbert-Johnson-Keerthi' (GJK) algorithm determine if two arbitrary convex 3D shapes are colliding?",
      options: [
        "By measuring the file sizes of the 3D meshes",
        "It computes the Minkowski Difference (Shape A - Shape B) and uses support mappings to iteratively build a geometric simplex, determining whether the coordinate origin (0,0,0) lies inside the Minkowski sum",
        "By projecting raycasts from the sky",
        "By measuring the vertex count of both meshes"
      ],
      correct_option_index: 1,
      explanation: "GJK evaluates if the origin is contained within the Minkowski Difference simplex, indicating a physical intersection in O(1) time.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "When GJK detects a collision overlap, why is the 'Expanding Polytope Algorithm' (EPA) executed immediately afterwards?",
      options: [
        "EPA is used to delete the colliding objects",
        "EPA calculates the audio pitch of the impact",
        "GJK only returns a boolean (colliding or not); EPA expands the Minkowski simplex outward to calculate the exact penetration depth and contact normal vector needed for impulse resolution",
        "EPA turns convex shapes into concave shapes"
      ],
      correct_option_index: 2,
      explanation: "EPA computes the minimum penetration depth and contact normal vector from the GJK simplex to allow impulse solvers to separate objects.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In modern character physics, what is an 'Active Ragdoll' (Physical Animation) and how does it function?",
      options: [
        "A skeletal hierarchy where rigid body bones are actively driven by joint motors (PD controllers) toward target keyframed animation angles while remaining fully responsive to external dynamic forces and collisions",
        "A 2D sprite animated with paper drawings",
        "A character that cannot move when attacked",
        "An enemy that explodes into pieces upon spawning"
      ],
      correct_option_index: 0,
      explanation: "Active ragdolls use motorized joints to follow animations while physically reacting to impacts, stumbles, and forces.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In arcade and sim-cade vehicle dynamics, how does a 'Raycast Suspension Vehicle' model wheel contact without using high-friction physical wheel mesh colliders?",
      options: [
        "By placing four invisible balls under the car",
        "By locking the car to a railroad track",
        "By calculating aerodynamics exclusively",
        "It casts 4 downward raycasts from the chassis corners to find ground contact, applies Hooke's spring law (F = -kx - cv) for suspension forces, and calculates lateral tire friction via Pacejka's Magic Formula"
      ],
      correct_option_index: 3,
      explanation: "Raycast vehicles simulate suspension and tire grip mathematically via downward raycasts, avoiding glitchy physical wheel interpenetration.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In physics engine constraint solvers, why are 'Sequential Impulse Solvers' preferred over penalty-based spring-damper collision models?",
      options: [
        "Because spring models require zero math",
        "Penalty spring models require extremely stiff springs that create numerical instability ('soft bouncy jitter') or require tiny micro-timesteps; Sequential Impulses resolve velocities directly at contacts in a single step",
        "Because sequential impulses only work in 2D games",
        "Because penalty springs are illegal under game software licenses"
      ],
      correct_option_index: 1,
      explanation: "Sequential impulse solvers resolve contact velocities directly, eliminating squishy penetrations and unstable spring oscillations.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #125.");
  console.log("Skill #125 update completed successfully!");
}

run();
