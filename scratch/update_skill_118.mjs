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

const skillId = "e9ff7b90-5790-45ae-b99f-92b3a6f3fe16";

async function run() {
  console.log("Updating Skill #118: Game Design Principles (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: The MDA Framework, Core Loops and Meaningful Choices" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Player Motivation, Flow Channel and Behavioral Taxonomies" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Systemic Game Mechanics, Feedback Loops and Game Feel" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Principal Game Designer & System Architect level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The MDA Framework (Mechanics, Dynamics, Aesthetics)",
      order_index: 1,
      content: `### Formal Game System Taxonomy (MDA Model)

1. The 3 Pillars of MDA:
   - Mechanics: The explicit rules, data structures, and code-level actions provided to the player.
   - Dynamics: The emergent run-time interactions that manifest as players engage with mechanics.
   - Aesthetics: The targeted emotional responses evoked in the player (Sensation, Fantasy, Narrative, Challenge, Fellowship, Discovery, Expression, Submission).

2. Dual Perspectives:
   - Designer: Mechanics -> Dynamics -> Aesthetics.
   - Player: Aesthetics -> Dynamics -> Mechanics.`
    },
    {
      track_id: track1Id,
      title: "Micro, Meso and Macro Gameplay Loop Architectures",
      order_index: 2,
      content: `### Nested Temporal Loops and Engagement Pacing

1. The 3 Nested Gameplay Loops:
   - Micro Loop (Second-to-Second): Core physical interaction and sensory feedback (e.g. Aiming, firing, dodging, reloading).
   - Meso Loop (Minute-to-Minute): Immediate tactical objective cycles (e.g. Clearing an encounter room, looting, craft-bench upgrades).
   - Macro Loop (Hour-to-Hour): Long-term strategic meta-progression (e.g. Talent tree expansion, world conquest, prestige rank resets).`
    },
    {
      track_id: track1Id,
      title: "Sid Meier's Doctrine: Designing Interesting Choices",
      order_index: 3,
      content: `### Decision Theory and Non-Dominant Mechanics

1. Anatomy of an Interesting Choice:
   - Sid Meier's Axiom: 'A game is a series of interesting choices.'

2. Eliminating Dominant Strategies:
   - A choice is uninteresting if there is a single mathematically optimal move (dominant strategy), zero consequences, or blind random chance.
   - Core Trade-Offs: Immediate gratification vs long-term compounding risk; High burst damage vs sustain; Specialization vs general utility.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Mihaly Csikszentmihalyi's Flow State and Dynamic Difficulty",
      order_index: 1,
      content: `### Flow Channel Dynamics and Anxiety-Boredom Boundaries

1. The Flow Channel:
   - The optimal psychological zone where game challenge scales dynamically with expanding player mastery.

2. Psychological Extremes:
   - If Challenge > Skill: The player experiences Anxiety, frustration, and eventual rage-quitting.
   - If Skill > Challenge: The player experiences Boredom, apathy, and disengagement.
   - Dynamic Difficulty Adjustment (DDA): Modulating AI aggression, ammo drops, and telegraph windows in real time.`
    },
    {
      track_id: track2Id,
      title: "Bartle's Player Taxonomy and Motivation Profiles",
      order_index: 2,
      content: `### Player Typologies and Behavioral Orientations

1. Richard Bartle's 4 Player Archetypes:
   - Achievers (Diamonds): Goal-driven, mastering badges, levels, and 100% completionism.
   - Explorers (Spades): Mapping hidden zones, uncovering lore, and probing game engine physics boundaries.
   - Socializers (Hearts): Interacting with peers, building guild communities, and collaborative social play.
   - Killers (Clubs): Competitive dominance, imposing will through PvP mastery and rival elimination.`
    },
    {
      track_id: track2Id,
      title: "Operant Conditioning, Reward Schedules and Player Autonomy",
      order_index: 3,
      content: `### Reinforcement Schedules and Ethical Game Design

1. Variable Reward Schedules:
   - Variable Ratio Schedules: Intermittent, unpredictable rewards (e.g. procedural loot drops) generating intense dopamine spikes.

2. Self-Determination Theory (SDT) in Games:
   - Cultivating Autonomy (meaningful choices), Competence (skill growth), and Relatedness (cooperative play) to build sustainable intrinsic enjoyment without relying on predatory dark patterns.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Systemic Game Design and Feedback Loops",
      order_index: 1,
      content: `### Cybernetics: Positive vs Negative Feedback Loops

1. Positive Feedback Loops (Destabilizing / Reinforcing):
   - Amplifies advantage (e.g. winning team earns bonus resources, snowballing their lead). Accelerates match conclusion but risks early surrender.

2. Negative Feedback Loops (Stabilizing / Balancing):
   - Dampens divergence to preserve tension (e.g. rubber-banding in racing games, giving trailing players top-speed buffs; catch-up bounties in MOBA arenas).`
    },
    {
      track_id: track3Id,
      title: "Juice, Game Feel and Perceptual Polish",
      order_index: 2,
      content: `### Tactile Responsiveness and Perceptual Forgiveness

1. Visual and Temporal 'Juice' (Game Feel):
   - Hit Stop (Freeze Frames): Pausing animation for 2 to 6 frames on impact to convey visceral weight.
   - Screen Shake, particle debris, and audio ducking.

2. Input Forgiveness Mechanics:
   - Input Buffering: Storing button presses milliseconds before an animation finishes.
   - Coyote Time: Allowing jump execution for a few frames after a character walks off a ledge.`
    },
    {
      track_id: track3Id,
      title: "The Game Design Document (GDD) and System Specs",
      order_index: 3,
      content: `### Production Architecture and Specification Engineering

1. The Living GDD:
   - 1-Page High-Concept Brief: Core Pillars, Target Audience, and USP (Unique Selling Proposition).

2. Technical Feature Specifications:
   - Formal mathematical state machines, deterministic balance sheets, edge-case interaction tables, and wireframe user flows designed to guide multi-disciplinary engineering, art, and audio teams.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #118.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In the MDA framework of formal game design, what do the three letters 'M-D-A' stand for?",
      options: [
        "Models, Drawing, and Animation",
        "Mechanics (rules/actions), Dynamics (emergent run-time systems), and Aesthetics (emotional player experience)",
        "Marketing, Distribution, and Analytics",
        "Multiplayer, Database, and Architecture"
      ],
      correct_option_index: 1,
      explanation: "The MDA framework decomposes games into Mechanics (rules), Dynamics (player interactions), and Aesthetics (emotions).",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In game design terminology, what is a 'Micro Gameplay Loop'?",
      options: [
        "A 50-hour storyline campaign",
        "The annual expansion release cycle",
        "A tiny computer chip",
        "The second-to-second physical action and sensory feedback loop (e.g. aiming, shooting, jumping, dodging)"
      ],
      correct_option_index: 3,
      explanation: "The micro loop governs momentary second-to-second motor inputs and immediate sensory audiovisual feedback.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "According to legendary designer Sid Meier, how is a great game fundamentally defined?",
      options: [
        "'A game is a series of interesting choices'",
        "'A game is a series of cinematic cutscenes'",
        "'A game is a computer program with 3D graphics'",
        "'A game is a digital slot machine'"
      ],
      correct_option_index: 0,
      explanation: "Sid Meier famously articulated that great gameplay centers on confronting players with a series of interesting choices.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In Richard Bartle's player taxonomy, which archetype is motivated by exploring the entire map, uncovering lore secrets, and finding edge-case physics glitches?",
      options: [
        "Killers (Clubs)",
        "Achievers (Diamonds)",
        "Explorers (Spades)",
        "Socializers (Hearts)"
      ],
      correct_option_index: 2,
      explanation: "Explorers delight in discovering world geography, hidden mechanics, Easter eggs, and deep lore.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In platformer game physics and game feel, what is 'Coyote Time'?",
      options: [
        "A timer when wild animals attack",
        "A brief temporal grace period (e.g. 50-100ms) that allows the player to successfully execute a jump even after their character has walked slightly off a ledge into mid-air",
        "A desert-themed game level",
        "A visual filter turning the screen orange"
      ],
      correct_option_index: 1,
      explanation: "Coyote time (named after Wile E. Coyote) allows jumps for a few frames after leaving ground, preventing unfair missed inputs.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In Mihaly Csikszentmihalyi's Flow State model, what emotional state occurs when a game's challenge severely outpaces the player's current skill level?",
      options: [
        "Boredom and apathy",
        "Euphoria and flow",
        "Anxiety, frustration, and eventual rage-quitting",
        "Sleepiness"
      ],
      correct_option_index: 2,
      explanation: "When challenge exceeds player skill, the player falls out of the flow channel into anxiety and frustration.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In systemic game design, what is a 'Negative Feedback Loop' and how does it affect competitive balance?",
      options: [
        "A stabilizing cybernetic loop that dampens divergence and helps trailing players catch up (e.g. rubber-banding or catch-up bounties), maintaining close competitive tension",
        "A loop that automatically deletes the player's saved game",
        "A loop that makes winning players 10x stronger immediately",
        "Negative feedback loops are banned in game design"
      ],
      correct_option_index: 0,
      explanation: "Negative feedback loops act as self-correcting mechanisms (like a thermostat), keeping competitive matches closely contested.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In action game combat feel, what is 'Hit Stop' (or Freeze Frames) and why is it implemented?",
      options: [
        "A bug where the game crashes upon taking damage",
        "A button that pauses the game menu",
        "A setting that turns off blood effects",
        "A deliberate micro-pause (2 to 6 frames) where character animations freeze upon impact, giving visceral weight and tactile punch to successful strikes"
      ],
      correct_option_index: 3,
      explanation: "Hit stop briefly pauses animations on weapon contact, creating the tactile sensation of cutting through solid resistance.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "Why is a 'Dominant Strategy' considered a major flaw in game system design?",
      options: [
        "Because it makes the game run too fast on modern graphics cards",
        "Because one specific move or tactic is mathematically superior to all other options in every situation, rendering all other choices obsolete and destroying strategic depth",
        "Because dominant strategies only exist in single-player games",
        "Because dominant strategies cause memory leaks in game engines"
      ],
      correct_option_index: 1,
      explanation: "A dominant strategy removes meaningful choice because rational players will always select the single optimal path.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In responsive game feel engineering, what is 'Input Buffering'?",
      options: [
        "A loading screen between game levels",
        "A method to slow down button presses",
        "Storing button inputs registered during an ongoing non-interruptible animation and executing them automatically on the very first available frame afterwards",
        "Disabling the keyboard for 5 seconds"
      ],
      correct_option_index: 2,
      explanation: "Input buffering queues early button inputs, ensuring actions execute fluidly on the exact first frame of character recovery.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In the MDA Framework, why do game designers and players view a game from completely opposite architectural directions?",
      options: [
        "The Designer creates Mechanics (code/rules), which produce run-time Dynamics, which generate Aesthetic emotional experiences; the Player directly experiences Aesthetics, which lead them to understand Dynamics, and ultimately deduce the underlying Mechanics",
        "Designers only care about music; players only care about story",
        "Players design the code while designers play the game",
        "There is zero difference in perspective between designers and players"
      ],
      correct_option_index: 0,
      explanation: "Designers work forward from Mechanics to Aesthetics, while players consume the game backward from Aesthetics to Mechanics.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In competitive multiplayer design, what is the 'Snowball Effect' and what type of cybernetic feedback loop creates it?",
      options: [
        "A negative feedback loop that resets all scores to zero",
        "A visual snow particle effect used in winter levels",
        "A design technique used only in fighting games",
        "A Positive Feedback Loop where an early advantage yields additional resources (gold, territory, buffs), allowing the leading player to grow exponentially stronger and crush opponents"
      ],
      correct_option_index: 3,
      explanation: "Snowballing is a positive feedback loop: early victory produces more power, accelerating victory and widening the gap.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In behavioral reward systems, why do 'Variable Ratio Reward Schedules' generate higher resistance to extinction than 'Fixed Ratio Schedules'?",
      options: [
        "Because fixed ratio schedules are illegal under copyright law",
        "Because the unpredictable delivery of rewards (varying number of actions required before a payout) sustains high dopamine anticipation and continuous engagement",
        "Because variable ratio schedules give players free money",
        "Because fixed ratio schedules require internet connection"
      ],
      correct_option_index: 1,
      explanation: "Variable ratio schedules deliver unpredictable reinforcement, maximizing engagement and preventing behavioral extinction.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In formal Game Design Documentation (GDD), what are 'Design Pillars' and how do they govern system development?",
      options: [
        "Architectural columns holding up the game studio roof",
        "A list of database passwords for engineers",
        "Three to five fundamental non-negotiable artistic and gameplay tenets that serve as the supreme decision-making framework for resolving all feature debates and scope cuts",
        "The credits list at the end of the game"
      ],
      correct_option_index: 2,
      explanation: "Design pillars are core guiding principles used to evaluate whether proposed features align with the game's core vision.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In Steve Swink's seminal framework on 'Game Feel', what three foundational pillars define whether a game possesses world-class physical tactile sensation?",
      options: [
        "Real-time control (instantaneous motor responsiveness), simulated physical space (convincing virtual physics/inertia), and sensory polish (harmonized audiovisual feedback on interaction)",
        "Voice acting, cinematics, and subtitles",
        "Multiplayer servers, credit card processing, and ads",
        "High polygon count, ray tracing, and 4K textures"
      ],
      correct_option_index: 0,
      explanation: "Game feel relies on instantaneous real-time control, consistent physical space simulation, and rich tactile sensory feedback.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #118.");
  console.log("Skill #118 update completed successfully!");
}

run();
