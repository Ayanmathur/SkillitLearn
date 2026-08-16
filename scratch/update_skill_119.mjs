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

const skillId = "13723032-ce50-4dc5-9e31-b22dffa13c73";

async function run() {
  console.log("Updating Skill #119: Level Design (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Greyboxing, Spatial Metrics and Player Guidance" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Level Topology, Encounter Pacing and Kishōtenketsu" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Environmental Storytelling, Multiplayer Maps and Technical Polish" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / AAA Lead Level Designer & Spatial Architect level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Greybox / Whitebox Prototyping Methodology",
      order_index: 1,
      content: `### Rapid Prototyping and Gameplay Validation

1. The Greyboxing Paradigm:
   - Constructing environments using untextured primitive 3D geometry (BSP brushes, ProBuilder, Unreal modeling blocks).

2. Core Development Rules:
   - Validates spatial proportions, traversal flow, jump arcs, and combat lines-of-sight before committing 3D environment art and lighting resources.`
    },
    {
      track_id: track1Id,
      title: "Spatial Metrics, Traversal Affordances and Cover Heights",
      order_index: 2,
      content: `### Architectural Human Scale and Kinetic Metrics

1. Establishing Consistent Spatial Metrics:
   - Character capsule height, sprint jump reach, maximum step-up height (0.3m), and mantle ledge reach (2.2m).

2. Tactical Cover Standardizations:
   - Half / Low-Cover (1.0m, allows crouched weapon fire and ducking).
   - Full / High-Cover (2.0m, provides complete character occlusion).`
    },
    {
      track_id: track1Id,
      title: "Visual Composition, Leading Lines and Weenies",
      order_index: 3,
      content: `### Subconscious Player Navigation Architecture

1. Visual Guidance Cues:
   - Utilizing high-contrast light pools, architectural leading lines (pipes, rails, roads), and color signposts (e.g. yellow climbable paint).

2. The 'Weenie' (Walt Disney / Kevin Lynch):
   - Iconic, towering visual landmarks visible from afar (e.g. Half-Life 2 Citadel) providing constant psychological orientation.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Macro Level Topologies (Linear, Hub-and-Spoke, Metroidvania)",
      order_index: 1,
      content: `### Spatial Layout Archetypes and Flow Architecture

1. Level Layout Topologies:
   - Linear: Directed, high-intensity cinematic narrative progression.
   - Hub-and-Spoke: Central sanctuary interconnecting thematic challenge branches (e.g. Demon's Souls Nexus).
   - Metroidvania: Non-linear interconnected maps featuring gated locks reopened by acquiring new traversal abilities.`
    },
    {
      track_id: track2Id,
      title: "Kishōtenketsu 4-Act Level Progression",
      order_index: 2,
      content: `### 4-Act Japanese Structural Level Design

1. The Kishōtenketsu Framework (Nintendo):
   - 1. Ki (Introduction): Introducing a new mechanic in a safe, risk-free space.
   - 2. Shō (Development): Applying the mechanic in a structured challenge.
   - 3. Ten (Twist / Complication): Introducing a hazardous twist or orthogonal mechanic.
   - 4. Ketsu (Conclusion): A high-stakes mastery climax before closing the level.`
    },
    {
      track_id: track2Id,
      title: "Combat Encounter Design and Arena Geometry",
      order_index: 3,
      content: `### Tactical Combat Spaces and Flow Dynamics

1. Arena Topography:
   - Designing elevation variance (advantageous high ground), diverse flanking routes, and destructible cover.

2. Pacing and Sightlines:
   - Occluding long-range sightlines to prevent instant sniper dominance; controlling enemy spawn staging to manage cognitive overload.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Environmental Storytelling and Narrative Vignettes",
      order_index: 1,
      content: `### Spatial Narrative and Visual History Layering

1. Storytelling Through Level Props:
   - Communicating historical events through visual artifacts (e.g. barricaded doors, blood trails, discarded ration cans, unmade beds).

2. Narrative Vignettes:
   - Designing micro-scenes that reveal world lore, faction warfare, and character backstories without relying on dialogue cutscenes.`
    },
    {
      track_id: track3Id,
      title: "Multiplayer Map Design (Symmetry, 3-Lane and Chokes)",
      order_index: 2,
      content: `### Competitive Map Architectures and Timing Metrics

1. Competitive Topologies:
   - Symmetrical Maps (Capture the Flag) vs Asymmetrical Maps (Bomb Defusal).

2. 3-Lane Architecture:
   - Two outer flank lanes separated by a contested high-risk Middle lane, linked by tight choke points.
   - Rush Timings: Tuning spawn-to-choke travel times to the millisecond to guarantee balanced initial combat contact.`
    },
    {
      track_id: track3Id,
      title: "Level Optimization: Occlusion Culling, LODs and NavMeshes",
      order_index: 3,
      content: `### Performance Engineering and Technical Constraints

1. Occlusion Culling and Visportals:
   - Dynamically disabling the rendering of hidden geometry behind massive occluder walls to minimize GPU draw calls.

2. Navigation and Collision:
   - Baking AI Navigation Meshes (NavMesh) on walkable surfaces; generating simplified collision hulls to prevent player snagging.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #119.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In game development, what is 'Greyboxing' (or Whiteboxing)?",
      options: [
        "Constructing a game level using untextured, primitive 3D geometric shapes to test and validate layout, scale, jump distances, and combat flow before creating final art",
        "Painting a finished level in shades of grey",
        "A bug that makes the sky turn grey",
        "A method to compress game audio files"
      ],
      correct_option_index: 0,
      explanation: "Greyboxing validates spatial mechanics, pacing, and traversal with simple geometric blocks prior to art production.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In level design terminology, what is a 'Weenie' (a concept pioneered by Walt Disney and urban designer Kevin Lynch)?",
      options: [
        "A small enemy that dies in one hit",
        "A hot dog power-up item",
        "A prominent, towering visual landmark visible from afar (e.g. the Citadel in Half-Life 2) that provides constant visual orientation for the player",
        "A hidden cheat code"
      ],
      correct_option_index: 2,
      explanation: "A Weenie is a towering landmark visible from multiple vantage points, anchoring spatial orientation and drawing the player forward.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In tactical shooter level metrics, what are the standard height specifications for 'Low Cover' (Half-Cover) versus 'High Cover' (Full-Cover)?",
      options: [
        "Low Cover: 10 meters; High Cover: 50 meters",
        "Low Cover: ~1.0 meter (allows crouched firing and protection); High Cover: ~2.0 meters (provides complete standing occlusion)",
        "Low Cover: 0.1 meters; High Cover: 0.3 meters",
        "All cover in games must be exactly 5 meters tall"
      ],
      correct_option_index: 1,
      explanation: "Standard cover metrics dictate ~1.0m for half-cover (crouching) and ~2.0m for full-cover (standing occlusion).",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In level topology, what structure characterizes a 'Hub-and-Spoke' map layout?",
      options: [
        "A straight hallway with zero turns",
        "A completely random maze that changes constantly",
        "A circular racing track",
        "A central safe or neutral hub zone connecting distinct, separate thematic challenge branches (e.g. Demon's Souls Nexus or Mario 64 Peach's Castle)"
      ],
      correct_option_index: 3,
      explanation: "Hub-and-Spoke layouts feature a central core connecting multiple independent spoke levels or zones.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In level design lighting and guidance, how do designers subconsciously guide players toward the critical path without using floating UI arrows?",
      options: [
        "Placing bright, high-contrast light sources, architectural leading lines (pipes/wires), and vibrant color signposts (e.g. yellow climbable edges) along the intended path",
        "Shutting off all lighting in the game",
        "Making the player move backwards",
        "Displaying an error message on screen"
      ],
      correct_option_index: 0,
      explanation: "Lighting contrast, leading lines, and standardized color signposts guide the human eye naturally toward forward objectives.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In Nintendo's 4-act 'Kishōtenketsu' level design philosophy, what occurs during the 'Ten' (Twist) phase?",
      options: [
        "The game deletes the player's progress",
        "The level immediately ends with zero action",
        "The player is forced to watch a 20-minute movie",
        "The level introduces an unexpected complication, hazardous condition, or orthogonal mechanic that challenges the player to apply their mastered skill in a novel way"
      ],
      correct_option_index: 3,
      explanation: "The Ten (Twist) phase introduces an unexpected variation or complication on the core mechanic established in earlier phases.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In competitive multiplayer FPS map design (such as CS:GO or Valorant), what is a 'Choke Point'?",
      options: [
        "A place where the computer microphone stops working",
        "A narrow, constricted spatial bottleneck where player movement routes converge, creating high-tension tactical engagements and grenade utility contests",
        "A bug where weapons refuse to shoot",
        "The respawn room for defeated players"
      ],
      correct_option_index: 1,
      explanation: "Choke points are tight transitional corridors where flanking routes converge, creating high-risk tactical engagements.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In 3D level engine optimization, what is 'Occlusion Culling'?",
      options: [
        "A rendering process that disables the drawing of 3D meshes that are currently hidden behind massive opaque occluders (such as solid walls or hills) from the player camera's viewpoint",
        "Deleting game textures from the hard drive to save disk space",
        "Turning all 3D characters into 2D sprites",
        "A technique used only for mobile phone games"
      ],
      correct_option_index: 0,
      explanation: "Occlusion culling prevents the GPU from rendering objects blocked by foreground architecture, optimizing frame rates.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In game narrative techniques, what is 'Environmental Storytelling'?",
      options: [
        "Planting virtual trees in a forest level",
        "Having a character read a history book aloud for 2 hours",
        "Communicating past lore, world events, and character actions through contextual spatial dressing (e.g. barricaded doors, skeleton poses, scattered ammunition) rather than explicit dialogue cutscenes",
        "Displaying environmental weather forecasts"
      ],
      correct_option_index: 2,
      explanation: "Environmental storytelling uses prop placement and visual history layering to allow players to deduce past narrative events.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In Metroidvania level architecture, what is the defining structural gameplay mechanic?",
      options: [
        "The player must complete the level in under 60 seconds",
        "The player can never jump or crouch",
        "The player plays on a linear conveyor belt",
        "An interconnected non-linear world where specific pathways are gated by environmental locks that require acquiring new movement abilities (e.g. double jump, grapple) to backtrack and access"
      ],
      correct_option_index: 3,
      explanation: "Metroidvania progression relies on ability-gated locks that encourage exploration and purposeful backtracking across interconnected maps.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In competitive 3-Lane multiplayer map design, why is measuring 'Rush Timings' (spawn-to-choke travel times in milliseconds) crucial during the whitebox phase?",
      options: [
        "To ensure the game server does not overheat",
        "To ensure that defending and attacking teams arrive at critical sightlines and choke points with balanced tactical timing, preventing one team from establishing uncontested dominance before the opposing team can contest",
        "To calculate the total number of polygons in the map",
        "Rush timings are only measured in single-player games"
      ],
      correct_option_index: 1,
      explanation: "Rush timings dictate first-contact engagements; imbalances allow one team to cross choke points and establish unearned positional advantages.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In combat arena architecture, why is incorporating 'Verticality' (elevated platforms and multi-tiered walkways) strategically important?",
      options: [
        "It makes the game level take up less physical computer memory",
        "It forces all players to look at the sky",
        "High ground provides superior tactical sightlines, spatial oversight, and asymmetric advantage, while forcing players below to utilize cover and flanking paths",
        "Verticality eliminates the need for collision detection"
      ],
      correct_option_index: 2,
      explanation: "Vertical elevation creates asymmetric tactical opportunities, rewarding position-holding while giving attackers flanking dynamics.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In game AI systems and level geometry, what is a 'NavMesh' (Navigation Mesh) and why must it be baked onto level geometry?",
      options: [
        "A polygonal mesh representation of all walkable surfaces in the level that AI pathfinding algorithms (such as A*) use to calculate obstacle-free navigation routes",
        "A fishing net texture applied to water surfaces",
        "A tool used to compress 3D character models",
        "A network cable connecting game consoles"
      ],
      correct_option_index: 0,
      explanation: "A NavMesh defines navigable spatial surfaces, enabling AI agents to run pathfinding algorithms around static obstacles.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In level design pacing theory, what is the 'Tension-and-Release' cycle and why is continuous non-stop high-intensity combat flawed?",
      options: [
        "Tension-and-release is only used in horror games",
        "High-intensity combat uses too much electricity",
        "Players should never experience any tension during games",
        "Continuous combat causes emotional desensitization, cognitive fatigue, and sensory overload; alternating combat peaks with quiet exploration valleys heightens dramatic impact and allows absorption"
      ],
      correct_option_index: 3,
      explanation: "Pacing waves alternate intense combat with quiet exploration, preventing sensory burnout and enhancing dramatic contrast.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In 3D level optimization, what is the role of 'Simplified Collision Hulls' (Player Blockers) placed over complex decorative prop meshes?",
      options: [
        "To delete decorative props when players walk past them",
        "To enclose detailed high-polygon props inside smooth invisible geometric collision bounds, preventing the player character's physics capsule from snagging or jittering on intricate mesh geometry",
        "To make props invisible to the camera",
        "To double the polygon count of the level"
      ],
      correct_option_index: 1,
      explanation: "Simplified collision bounds prevent player snagging on complex prop geometry, ensuring buttery smooth movement flow.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #119.");
  console.log("Skill #119 update completed successfully!");
}

run();
