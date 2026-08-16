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

const skillId = "c8979dfd-d2c9-4779-a110-830101575d6b";

async function run() {
  console.log("Updating Skill #122: Narrative Design Basics (9 steps across 3 tracks)...");

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

  // Ensure exactly 3 tracks exist
  while (tracks.length < 3) {
    const { data: newTrack } = await supabase
      .from("tracks")
      .insert({
        skill_id: skillId,
        title: `Track ${tracks.length + 1}: Narrative Design Basics`,
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
  await supabase.from("tracks").update({ title: "Track 1: Narrative Architecture, Ludonarrative Harmony and Emergence" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Interactive Branching Architectures and Dialogue Engines" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Character Arcs, Dynamic Barks and Quest Design" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / AAA Narrative Director & Lead Game Writer level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Game Writing vs Narrative Design and Mechanics Integration",
      order_index: 1,
      content: `### The Interdisciplinary Role of Narrative Design

1. Writing vs Narrative Design:
   - Game Writing: Crafting script dialogue, item descriptions, and lore bibles.
   - Narrative Design: Architecting how the story is communicated through mechanics, systems, level geometry, and player actions.

2. The Golden Rule:
   - Story in games is what the player experiences through interactive agency, not merely what is written in passive cutscene scripts.`
    },
    {
      track_id: track1Id,
      title: "Ludonarrative Harmony vs Ludonarrative Dissonance",
      order_index: 2,
      content: `### Aligning Mechanical Verbs with Thematic Story

1. Ludonarrative Dissonance (Clint Hocking):
   - The cognitive clash when gameplay mechanics contradict the narrative themes (e.g. a compassionate pacifist protagonist who slaughters hundreds of enemies in casual gameplay).

2. Achieving Ludonarrative Harmony:
   - Tightly binding player mechanics and systems to the narrative premise (e.g. Papers, Please; The Last of Us; Brothers: A Tale of Two Sons).`
    },
    {
      track_id: track1Id,
      title: "Embedded Narrative vs Emergent Narrative Systems",
      order_index: 3,
      content: `### Pre-Authored Lore vs Dynamic Player Storytelling

1. Embedded Narrative:
   - Developer-authored, fixed narrative artifacts (cutscenes, audio diaries, main quest dialogue, environmental set dressing).

2. Emergent Narrative:
   - Unscripted, player-generated stories that arise dynamically from the complex interaction of underlying game systems (e.g. survival drama in RimWorld, Crusader Kings, or Dwarf Fortress).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Branching Narrative Graphs and Combinatorial Explosion",
      order_index: 1,
      content: `### Narrative Topologies and Scope Management

1. Combinatorial Explosion:
   - The unsustainable exponential growth of branches (2^N) where 90% of expensive written content is missed by average players.

2. Structural Solutions:
   - Branch-and-Bottle (Delayed Branching): Allowing choices to diverge meaningfully in local dialogue and gameplay, then reconverging at critical bottleneck story beats.
   - Modular Diamond structures.`
    },
    {
      track_id: track2Id,
      title: "Dialogue Tree Systems, State Flags and Relationship Trackers",
      order_index: 2,
      content: `### Technical Scripting: Variables and Conditional Branching

1. Dialogue State Machines:
   - Evaluating conditional logic flags (e.g. IF Player_Reputation >= 50 AND Saved_Hostage == TRUE).

2. Affinity Metrics and Choice Timers:
   - Tracking companion approval meters, faction reputations, and incorporating timed decision countdowns to create psychological urgency in high-stakes moral dilemmas.`
    },
    {
      track_id: track2Id,
      title: "Interactive Scripting Languages (Twine, Ink, Articy:Draft)",
      order_index: 3,
      content: `### Narrative Middleware and Integration Pipelines

1. Interactive Scripting Tools:
   - Twine: Hypertext node-based prototyping.
   - ink (Inkle): Professional markup language for complex branching dialogue and variable tracking.
   - Articy:Draft: Multi-user enterprise narrative database.

2. Engine Middleware Sync:
   - Exporting structured JSON/XML dialogue nodes directly into Unity and Unreal Engine dialogue parsers.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Character Archetypes, Dialogue Barks and Companion Systems",
      order_index: 1,
      content: `### Dynamic Voice Lines and Multi-Dimensional Characters

1. Three-Dimensional Characters:
   - Establishing Internal Needs vs External Wants, personal flaws, and distinct linguistic voice.

2. Diegetic Audio Barks:
   - Context-sensitive short voice lines triggered by gameplay events (e.g. reloading under fire, spotting a sniper, low ammunition, entering a dark cave) and companion banter that humanizes NPCs.`
    },
    {
      track_id: track3Id,
      title: "Multi-Path Quest Design and Non-Linear Resolution",
      order_index: 2,
      content: `### Quest Architecture and Multiple Solution Vectors

1. 4-Stage Quest Flow:
   - The Hook -> Investigation / Rising Action -> Moral Climax -> Consequence / Resolution.

2. Multiple Solution Vectors:
   - Providing distinct systemic paths to resolve objectives: Direct Combat, Stealth Infiltration, Social Persuasion / Deception, Bribery, or Environmental Investigation.`
    },
    {
      track_id: track3Id,
      title: "Narrative Pacing: Harmonizing Story Beats with Gameplay",
      order_index: 3,
      content: `### Dramatic Tension and Mechanical Synchronization

1. Pacing and Rhythm:
   - Synchronizing emotional story beats (exposition, discovery, tragedy, climax) with gameplay mechanical intensity waves.

2. Climax Convergence:
   - Aligning high-stakes narrative revelations with peak mechanical boss encounters, ensuring emotional tension and player gameplay mastery culminate simultaneously.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #122.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In video game development, what fundamentally distinguishes a 'Narrative Designer' from a traditional 'Game Writer'?",
      options: [
        "A game writer uses computers while a narrative designer uses a typewriter",
        "A game writer focuses on writing dialogue scripts and lore; a narrative designer architects HOW the story is communicated through gameplay mechanics, systems, and player agency",
        "A narrative designer only designs 3D weapon models",
        "There is zero professional difference between them"
      ],
      correct_option_index: 1,
      explanation: "Narrative designers integrate storytelling directly into game systems, mechanics, and level flow, while writers craft script copy.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What is 'Ludonarrative Dissonance' (a concept famously coined by game designer Clint Hocking)?",
      options: [
        "A bug that disables background game audio",
        "When two players talk at the same time in voice chat",
        "A musical instrument used in game soundtracks",
        "The cognitive clash that occurs when gameplay mechanics and player actions directly contradict the themes of the written story (e.g. a gentle hero killing hundreds of people in combat)"
      ],
      correct_option_index: 3,
      explanation: "Ludonarrative dissonance describes the friction when what the player does in gameplay conflicts with what the story claims.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In video game audio and narrative scripting, what is a 'Bark'?",
      options: [
        "A short, context-sensitive voice line triggered dynamically by gameplay events (e.g. 'Reloading!', 'Sniper on the roof!', or companion reactions)",
        "The sound of a virtual dog in a game",
        "A tree texture in a forest level",
        "A command that crashes the game"
      ],
      correct_option_index: 0,
      explanation: "Barks are dynamic, context-specific audio callouts triggered by AI or companions in response to immediate gameplay states.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In storytelling systems, what is an 'Emergent Narrative'?",
      options: [
        "An emergency news broadcast inside a game",
        "A storyline that is completely written in a book",
        "Unscripted, personal stories that arise organically from the interaction of underlying gameplay mechanics, AI, and player choices (e.g. in RimWorld or Crusader Kings)",
        "A cutscene that cannot be skipped"
      ],
      correct_option_index: 2,
      explanation: "Emergent narrative arises from dynamic systemic simulations and player decisions rather than pre-written scripts.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "Which of the following software tools is widely used in the games industry as an open-source scripting language for authoring interactive, branching dialogue trees and state logic?",
      options: [
        "Adobe Photoshop",
        "ink (developed by Inkle) and Twine",
        "Microsoft Excel exclusively",
        "Blender 3D"
      ],
      correct_option_index: 1,
      explanation: "Inkle's ink and Twine are premier industry standards for writing complex branching interactive dialogue with state logic.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In branching narrative design, what is the 'Combinatorial Explosion' problem and why is it dangerous in production?",
      options: [
        "Game engines exploding when rendering fire",
        "Players buying too many copies of the game",
        "Exponential branching (2^N) where every choice permanently splits the storyline creates an unsustainable amount of content where 90% of written assets are never seen by average players, blowing budget and scope",
        "A mathematical bug in damage calculations"
      ],
      correct_option_index: 2,
      explanation: "Combinatorial explosion occurs when branches multiply exponentially, requiring massive writing and asset creation for low player visibility.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "How does the 'Branch-and-Bottle' (Delayed Branching) narrative architecture solve the problem of Combinatorial Explosion?",
      options: [
        "It allows player choices to branch out into immediate localized consequences and distinct dialogue variations, but strategically reconverges the storylines back into shared bottleneck nodes for major plot beats",
        "It forces all players to drink potions",
        "It deletes all branching choices completely",
        "It makes every character say the exact same words"
      ],
      correct_option_index: 0,
      explanation: "Branch-and-bottle gives immediate local divergence for player agency while reconverging on key bottlenecks to control production scope.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In interactive dialogue systems, how do 'Conditional State Flags' influence NPC conversations?",
      options: [
        "They make NPCs speak in foreign languages",
        "They change the color of the screen",
        "They mute all background music",
        "They check background game variables (e.g. IF Player_Reputation >= 50 OR Quest_Completed == TRUE) to dynamically unlock or lock specific dialogue choices and NPC reactions"
      ],
      correct_option_index: 3,
      explanation: "Conditional flags query world state, past decisions, and inventory to present dynamic, context-aware dialogue options.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In multi-path quest design, why is offering 'Multiple Solution Vectors' (e.g. Combat, Stealth, Persuasion, Hacking) essential for player agency?",
      options: [
        "It makes the game file size smaller",
        "It allows players to express their chosen character build and roleplay identity by solving problems in ways that match their playstyle rather than forcing a single linear path",
        "It guarantees that players never die",
        "It eliminates the need for voice acting"
      ],
      correct_option_index: 1,
      explanation: "Multiple solution vectors empower player agency, allowing different character builds to tackle objectives creatively.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What constitutes 'Embedded Narrative' in environmental world design?",
      options: [
        "Writing code inside an embedded microchip",
        "A player typing messages in multiplayer chat",
        "Pre-authored narrative clues placed in the game environment by developers (such as audio logs, diaries, graffiti, and skeletal remains) that reveal past historical events",
        "A game engine error message"
      ],
      correct_option_index: 2,
      explanation: "Embedded narrative encompasses pre-authored narrative artifacts placed within the world for players to discover.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In narrative pacing integration, why must major narrative climaxes and revelations be synchronized with mechanical gameplay difficulty peaks?",
      options: [
        "Because emotional investment and player gameplay tension peak simultaneously; defeating a climactic boss while discovering a major plot truth delivers maximum catharsis and narrative resonance",
        "Because game engines cannot play cutscenes during easy levels",
        "To make players fail the mission on purpose",
        "Narrative revelations should only happen during loading screens"
      ],
      correct_option_index: 0,
      explanation: "Synchronizing dramatic story climaxes with mechanical mastery peaks aligns emotional catharsis with physical accomplishment.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In character design for interactive storytelling, what is the psychological difference between a character's 'Internal Need' and their 'External Want'?",
      options: [
        "Internal need is food; external want is water",
        "There is zero difference between them",
        "Internal need is money; external want is armor",
        "The 'Want' is the conscious, tangible external goal the character pursues (e.g. revenge, treasure); the 'Need' is the underlying emotional or spiritual growth required for true fulfillment (e.g. forgiveness, connection)"
      ],
      correct_option_index: 3,
      explanation: "Want represents the superficial plot objective; Need represents the core internal character arc and emotional evolution.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In dialogue system engineering, what is a 'Hub-and-Spoke Dialogue Node' and how does it prevent conversation deadlocks?",
      options: [
        "A bicycle wheel mini-game",
        "A central dialogue root where players can ask multiple informational questions in any order before selecting a final exit spoke that commits them to an action or closes the conversation",
        "A dialogue system where players cannot choose what to say",
        "A dialogue system used only for animal characters"
      ],
      correct_option_index: 1,
      explanation: "Hub-and-spoke dialogue structures let players explore optional lore inquiries while always returning to a central decision root.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In game writing and dialogue mechanics, why are 'Timed Dialogue Choices' (such as those in Telltale or Oxenfree) psychologically powerful?",
      options: [
        "They make the game download faster",
        "They allow players to fall asleep during cutscenes",
        "They introduce immediate visceral pressure, forcing instinctive, emotional decisions and preventing players from over-analyzing social interactions, mimicking real-world conversation tension",
        "They delete incorrect dialogue choices from the game"
      ],
      correct_option_index: 2,
      explanation: "Time-limited dialogue forces authentic, visceral decision-making, replicating the emotional tension of real conversational stakes.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "How does the game 'Papers, Please' demonstrate world-class 'Ludonarrative Harmony'?",
      options: [
        "The core mechanical action (stressful, repetitive document stamping under time pressure for meager wages) directly reinforces the narrative themes of surviving under a totalitarian, bureaucratic regime",
        "It features high-polygon 3D graphics",
        "It has zero story and zero dialogue",
        "It is a multiplayer first-person shooter"
      ],
      correct_option_index: 0,
      explanation: "Papers, Please aligns mechanical gameplay labor (inspecting documents) with its thematic narrative of bureaucratic oppression.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #122.");
  console.log("Skill #122 update completed successfully!");
}

run();
