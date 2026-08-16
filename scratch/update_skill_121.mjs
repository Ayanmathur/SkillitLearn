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

const skillId = "85feb61e-d5b7-457a-b102-f99760406e51";

async function run() {
  console.log("Updating Skill #121: Prototyping Game Ideas (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: The Incubation Mindset, Risk Reduction and Paper Prototyping" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Digital Rapid Prototyping and Visual Scripting Toolsets" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Scientific Playtesting, Telemetry and Iteration Governance" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Lead Incubation Director & Game Lab level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Fail-Fast Philosophy and Disposable Prototyping",
      order_index: 1,
      content: `### Risk Reduction and Throwaway Code

1. The Prototyping Mission:
   - To answer a specific, high-risk gameplay question with maximum velocity and minimal sunk engineering cost.

2. Disposable Prototyping:
   - Writing intentionally unrefactored, disposable scripts using primitive shapes.
   - Fail Faster principle (Jesse Schell): Finding fatal design flaws on Day 2 rather than Month 12 to de-risk commercial production.`
    },
    {
      track_id: track1Id,
      title: "Paper, Card and Tabletop Prototyping Methodologies",
      order_index: 2,
      content: `### Non-Digital Mechanics Validation

1. Physical Prototyping:
   - Simulating card economies, turn orders, resource flows, and ability synergies using index cards, tokens, dice, and marker pens.

2. Velocity vs Limitations:
   - Modifying a card's mana cost or damage rule takes 2 seconds with a pen.
   - Limitation: Cannot validate real-time spatial dexterity, physics inertia, or reflex feel.`
    },
    {
      track_id: track1Id,
      title: "Defining the Hypothesis and Minimum Viable Loop (MVL)",
      order_index: 3,
      content: `### Scientific Gameplay Hypotheses and MVL

1. Formulating Hypotheses:
   - Framing prototypes around testable questions ('Does momentum-based grappling feel compelling in vertical platforming?').

2. Minimum Viable Loop (MVL):
   - The absolute smallest playable software slice that allows testers to perform the core micro-loop (move, aim, fire, collect) and evaluate raw game feel.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Engine Sandboxes and Visual Scripting (Blueprints / GDScript)",
      order_index: 1,
      content: `### Rapid Digital Construction Toolsets

1. Visual Scripting & Rapid Engines:
   - Utilizing Unreal Blueprints or Godot GDScript to assemble functional mechanic prototypes in hours without C++ compilation delays.

2. Testing Gyms (Sandboxes):
   - Dedicated geometric testing chambers containing ramps, obstacle courses, and target dummies designed exclusively to isolate and tune single mechanics.`
    },
    {
      track_id: track2Id,
      title: "Runtime Debugging Tools, Sliders and Parameter Hot-Reloading",
      order_index: 2,
      content: `### In-Game Variable Tuning and Runtime Manipulation

1. Developer Debug Overlays:
   - Exposing gravity scales, friction, jump force, weapon spread, and enemy AI speeds to real-time UI sliders during active gameplay.

2. Rapid Parameter Iteration:
   - Finding the exact 'fun' kinesthetic sweet spot through live runtime slider manipulation before locking in code constants.`
    },
    {
      track_id: track2Id,
      title: "Wizard of Oz Prototyping and Mock Systems",
      order_index: 3,
      content: `### Simulating Complex Features Manually

1. The Wizard of Oz Technique:
   - A human designer manually triggers in-game events, spawns enemies, or manages dialogue responses from a secondary controller/console behind the scenes.

2. Value:
   - Evaluates player reactions to complex AI systems or procedural generation before engineering expensive production code.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Designing Blind Playtests and Observational Protocols",
      order_index: 1,
      content: `### Unbiased Playtesting and Think-Aloud Protocols

1. Blind Playtesting:
   - Handing a tester a build with zero verbal hints or explanations, testing whether visual affordances and tutorials guide play naturally.

2. Observational Protocols:
   - Think-Aloud Method (testers verbalize real-time thoughts and confusion).
   - Silent Observation: Designers must never intervene, explain rules, or defend design choices during testing.`
    },
    {
      track_id: track3Id,
      title: "Quantitative Telemetry: Heatmaps, Chokes and Drop-offs",
      order_index: 2,
      content: `### Spatial Analytics and Funnel Drop-offs

1. Spatial Heatmap Analytics:
   - Logging player death coordinates, traversal paths, and camping spots overlaid directly onto level greybox maps.

2. Funnel Metrics:
   - Tracking tutorial completion percentages, average time-to-first-failure, and the exact timestamps where players abandon the playtest session.`
    },
    {
      track_id: track3Id,
      title: "Feedback Categorization, Triage and Pivot-or-Persevere",
      order_index: 3,
      content: `### Post-Test Synthesis and Decision Matrices

1. Triaging Feedback into 3 Buckets:
   - Usability (UI/visual confusion) vs Balancing (tuning numbers) vs Core Mechanical Flaws (mechanic is fundamentally boring).

2. Pivot-or-Persevere Matrix:
   - Deciding whether to refine the current core loop, pivot to a different mechanic, or kill the prototype entirely to save studio budget.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #121.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "What is the primary core objective of creating a game prototype during the incubation phase?",
      options: [
        "To rapidly answer a specific, high-risk gameplay question and validate fun with minimal sunk engineering cost",
        "To create final 4K visual art assets for marketing",
        "To write clean, enterprise-grade production C++ code",
        "To sell the game on retail shelves immediately"
      ],
      correct_option_index: 0,
      explanation: "Prototyping serves to quickly test and validate gameplay hypotheses with minimal time and code investment.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In game design methodology, what is a 'Paper Prototype'?",
      options: [
        "A game printed in a physical newspaper",
        "An instruction booklet written on paper",
        "A physical, non-digital model of a game using index cards, tokens, and dice to quickly test rules, turns, and resource systems without coding",
        "A piece of origami shaped like a video game console"
      ],
      correct_option_index: 2,
      explanation: "Paper prototypes test game rules, pacing, card balance, and economy using tangible physical components before writing code.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In playtesting protocols, what is a 'Blind Playtest'?",
      options: [
        "A playtest conducted in a completely dark room",
        "A playtest where the player receives zero verbal explanation or coaching from the developer, forcing them to rely entirely on in-game visual affordances and cues",
        "A playtest where the tester wears a blindfold",
        "A playtest conducted by AI bots only"
      ],
      correct_option_index: 1,
      explanation: "Blind playtesting reveals whether the game's intrinsic visual cues and tutorials communicate gameplay without developer assistance.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In rapid game prototyping, what does 'MVL' stand for?",
      options: [
        "Maximum Velocity Laser",
        "Most Valuable Level",
        "Mobile Virtual Language",
        "Minimum Viable Loop (the smallest playable slice that enables testing the core second-to-second gameplay interaction)"
      ],
      correct_option_index: 3,
      explanation: "The Minimum Viable Loop (MVL) is the bare minimum playable implementation needed to evaluate the core gameplay loop.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What is a 'Testing Gym' (or Sandbox) in digital game prototyping?",
      options: [
        "A dedicated, simple geometric level containing obstacle courses, ramps, and target dummies designed exclusively to isolate, test, and tune a specific mechanic",
        "A fitness center inside the game studio",
        "A workout mini-game in an RPG",
        "A place where developers exercise"
      ],
      correct_option_index: 0,
      explanation: "Testing gyms isolate mechanics in a clean geometric environment to test physics, jump arcs, and combat without level clutter.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "What is the 'Wizard of Oz Prototyping' technique in game development?",
      options: [
        "Designing a fantasy level with a yellow brick road",
        "Playing audio from a movie during testing",
        "Dressing up as a wizard during playtests",
        "Having a human designer manually trigger in-game events, spawn enemies, or control dialogue behind the scenes to simulate complex systems before they are coded"
      ],
      correct_option_index: 3,
      explanation: "Wizard of Oz prototyping fakes automated or AI systems manually to evaluate player reactions before writing complex algorithms.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In observational playtesting, what is the 'Think-Aloud Protocol'?",
      options: [
        "Having developers shout instructions at the tester",
        "Asking the playtester to verbalize their real-time thoughts, confusion, emotional reactions, and intentions aloud as they play the game",
        "Reading the game manual aloud",
        "Singing the game's theme song during testing"
      ],
      correct_option_index: 1,
      explanation: "The think-aloud protocol offers immediate cognitive insights into tester expectations, confusion points, and decision-making.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In rapid game prototyping in Unreal Engine or Godot, why are 'Runtime Debug Sliders' essential for finding the 'fun'?",
      options: [
        "They allow designers to manipulate physical variables (gravity, jump force, acceleration, weapon spread) in real-time during live play without recompiling code",
        "They automatically fix all code bugs",
        "They make the 3D graphics look realistic",
        "They increase download speeds"
      ],
      correct_option_index: 0,
      explanation: "Real-time debug sliders allow rapid kinesthetic experimentation to discover the exact physical sweet spot of game feel.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In playtest telemetry analytics, what is a 'Death Heatmap' and how is it used to refine level design?",
      options: [
        "A map showing computer temperature",
        "A weather map of in-game fire effects",
        "A spatial 2D/3D visual overlay showing the exact coordinates where player deaths occur across thousands of play sessions, identifying unfair bottlenecks or broken encounters",
        "A list of player user names"
      ],
      correct_option_index: 2,
      explanation: "Death heatmaps visualize spatial clusters of player failures, highlighting unfair difficulty spikes or broken level geometry.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In Jesse Schell's 'Fail Faster' prototyping philosophy, what is the core rationale for seeking rapid failure early in pre-production?",
      options: [
        "To get fired from the game company quickly",
        "To make the game studio go bankrupt",
        "To avoid working on video games",
        "Every game concept has hidden flaws; discovering fatal design flaws on Day 2 costs almost nothing, whereas discovering them after two years of production destroys the studio"
      ],
      correct_option_index: 3,
      explanation: "Fail faster de-risks development by ruthlessly weeding out unviable mechanics early when changes are virtually free.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In post-playtest feedback synthesis, why is it critical for designers to distinguish between 'Usability Issues' and 'Core Mechanical Flaws'?",
      options: [
        "Because usability issues only happen on consoles",
        "A player might hate a great mechanic simply because the UI/camera is confusing (Usability); discarding the mechanic would be a tragic mistake when only the interface needed fixing",
        "Because mechanical flaws can never be fixed",
        "There is zero difference between usability and game mechanics"
      ],
      correct_option_index: 1,
      explanation: "Triage prevents discarding brilliant gameplay mechanics that were simply masked by poor UI, camera angles, or bad tutorial onboarding.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "What is the cardinal rule of developer conduct while observing an external blind playtest?",
      options: [
        "Guide the player through difficult puzzles with hints",
        "Explain what the character is supposed to be doing",
        "Remain completely silent and take objective notes; never explain mechanics, correct player errors, or justify why a design was built that way",
        "Argue with the player if they criticize the game"
      ],
      correct_option_index: 2,
      explanation: "Intervening distorts test validity; if a player gets lost, the game's design failed to communicate, which is the exact lesson to learn.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In game incubation governance, what criteria define whether a studio should 'Pivot' or 'Kill' a prototype on the Pivot-or-Persevere Matrix?",
      options: [
        "If after multiple rapid iterations the core loop still fails to evoke the target Aesthetic emotion (is not fun) or the technical barriers are insurmountable, the prototype must be killed to free resources for new ideas",
        "Prototypes should never be killed under any circumstances",
        "A prototype is killed only if the computer crashes",
        "If a prototype takes more than 1 hour to build, it must be killed"
      ],
      correct_option_index: 0,
      explanation: "Killing non-viable prototypes preserves studio capital and talent for concepts that demonstrate genuine intrinsic engagement.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "What major limitation prevents Paper Prototyping from being effective for real-time action games (like first-person shooters or character action games)?",
      options: [
        "Paper is too expensive to buy",
        "Dice cannot be rolled on paper",
        "Paper prototypes cannot use colors",
        "Paper cannot simulate continuous physical inertia, real-time motor reflexes, kinesthetic input timing, camera control, or tactile audiovisual game feel ('juice')"
      ],
      correct_option_index: 3,
      explanation: "Paper is ideal for turn systems and card math, but fundamentally incapable of simulating real-time kinesthetic feel and spatial dexterity.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "Why is writing 'Disposable / Throwaway Code' considered a best practice during initial digital prototyping?",
      options: [
        "Because computers perform better with messy code",
        "Investing time in elegant software architecture and clean code creates psychological 'Sunk Cost Bias', making developers reluctant to discard bad gameplay ideas",
        "Because production games are never written in C++",
        "Because throwaway code eliminates all bugs automatically"
      ],
      correct_option_index: 1,
      explanation: "Over-engineering creates emotional attachment to bad mechanics; quick hackable scripts make abandoning flawed concepts painless.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #121.");
  console.log("Skill #121 update completed successfully!");
}

run();
