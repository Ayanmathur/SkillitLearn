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

const skillId = "74752584-6026-4cab-84b7-3fc3ed2ed80f";

async function run() {
  console.log("Updating Skill #120: Game Balancing (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Mathematical Combat Modeling, DPS and Probability Systems" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Game Economy Design, Resource Sinks and Progression Curves" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Game Theory, Asymmetry and LiveOps Telemetry" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Lead Systems Designer & Economic Balancer level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Combat Mathematics: EHP, DPS and Time-To-Kill (TTK)",
      order_index: 1,
      content: `### Deterministic Combat Equations and Survivability

1. Effective Hit Points (EHP):
   - Formula: EHP = Base HP * (1 + (Armor / Armor Constant)). Each armor point increases effective survivability by a fixed percentage against physical damage.

2. Damage Per Second (DPS) and TTK:
   - DPS = Base Damage * Attack Speed * [1 + (Crit Chance * (Crit Damage - 1))].
   - Time-To-Kill (TTK) = Target EHP / Incoming DPS. High TTK rewards tracking aim and teamplay; low TTK rewards reflex speed and ambush positioning.`
    },
    {
      track_id: track1Id,
      title: "Probability Curves: True Random vs Pseudo-Random (PRD)",
      order_index: 2,
      content: `### Statistical Distributions and Streak Mitigation

1. True RNG vs Bell Curves:
   - Single dice (1d20) yield flat uniform probability; summing multiple dice (3d6) creates a Gaussian normal distribution clustering around the mean.

2. Pseudo-Random Distribution (PRD):
   - Replaces pure RNG by starting crit probability low (e.g. 8.5% for a 25% nominal chance) and incrementally increasing probability with each non-crit attack, resetting upon a hit. Eliminates frustrating cold streaks and overpowered consecutive burst streaks.`
    },
    {
      track_id: track1Id,
      title: "Diminishing Returns Curves and Stat Budgeting",
      order_index: 3,
      content: `### Asymptotic Scaling and Item Point Budgets

1. Diminishing Returns:
   - Formula: Effective Benefit = Raw Stat / (Raw Stat + Constant K). Prevents game-breaking 100% cooldown reduction or unkillable evasion builds by flattening gains asymptotically.

2. Stat Budgeting:
   - Normalizing all equipment attributes into baseline item budget points (e.g. 1 Strength = 20 HP = 0.5 Armor = 10 Gold) to ensure gear parity across diverse character classes.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Virtual Economy Architecture: Faucets, Sinks and Decay",
      order_index: 1,
      content: `### Currency Equilibrium and Macroeconomic Sinks

1. Faucets vs Sinks:
   - Faucets (Sources): Monster drops, quest rewards, salvage converting into currency.
   - Sinks (Drains): Mandatory money sinks (repair costs, marketplace transaction taxes, crafting fees, vanity cosmetics).

2. Hyperinflation Control:
   - Without adequate currency sinks, cumulative wealth among veteran players explodes exponentially, inflating marketplace prices and bankrupting new players.`
    },
    {
      track_id: track2Id,
      title: "Progression Math: Linear, Exponential and Logarithmic",
      order_index: 2,
      content: `### Power Scaling Equations and Power Creep

1. Progression Curve Equations:
   - Linear (Y = mX + b) vs Polynomial/Exponential (XP Required = Base * Level^Exponent) for RPG level curves.

2. Managing Power Creep:
   - The gradual systemic escalation of damage/health numbers across new expansions or characters, diluting the relevance of legacy content. Requires strict baseline normalization.`
    },
    {
      track_id: track2Id,
      title: "Loot Distribution, Drop Tables and Gacha Pity Mechanics",
      order_index: 3,
      content: `### Item Drop Rarity and Pity Algorithms

1. Weighted Drop Tables:
   - Assigning weight integers across rarity tiers (Common 600, Rare 300, Epic 80, Legendary 20) divided by total weight sum.

2. Pity System Engineering:
   - Soft Pity (linearly ramping drop chances after a specific pull threshold) and Hard Pity (100% guaranteed drop at a ceiling limit) to protect players from extreme negative variance.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Symmetrical vs Asymmetrical Balancing and RPS",
      order_index: 1,
      content: `### Asymmetric Parity and Transitive Triangles

1. Asymmetrical Balance:
   - StarCraft (Terran vs Zerg vs Protoss) or asymmetric 1v4 multiplayer: Balancing wildly disparate mechanics (horde mobility vs high-tech shields) by tuning win probabilities toward 50% across skill brackets.

2. Rock-Paper-Scissors (RPS) Loops:
   - Transitive balancing where every dominant archetype has an accessible counter (e.g. Cavalry beats Archers, Archers beat Spearmen, Spearmen beat Cavalry).`
    },
    {
      track_id: track3Id,
      title: "First-Order Optimal Strategies (FOOS) and Nash Equilibria",
      order_index: 2,
      content: `### Beginner Strategies and Game Theory States

1. First-Order Optimal Strategy (FOOS):
   - A low-effort, moderate-reward tactic easily discovered by beginners (e.g. projectile spam). A healthy game provides accessible counter-strategies at intermediate tiers so FOOS does not dominate.

2. Nash Equilibrium:
   - A stable state where no player can gain an advantage by unilaterally altering their strategy, establishing the baseline meta.`
    },
    {
      track_id: track3Id,
      title: "LiveOps Telemetry, Win Rate / Pick Rate and Patching",
      order_index: 3,
      content: `### Data Telemetry and Balance Patch Governance

1. The Win Rate vs Pick Rate Matrix:
   - High Win / High Pick: Overpowered (Nerf target).
   - Low Win / High Pick: High popular appeal but mechanically weak.
   - High Win / Low Pick: High skill ceiling niche specialist.
   - Low Win / Low Pick: Underpowered (Rework candidate).

2. Monte Carlo Simulations:
   - Simulating 100,000 automated AI matches to detect statistical anomalies prior to live deployment.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #120.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In combat mathematics, what does 'Effective Hit Points' (EHP) calculate?",
      options: [
        "The number of healing potions a player owns",
        "A character's total real survivability when factoring in damage mitigation (such as armor and resistance) applied to base raw health",
        "The speed at which a player runs",
        "The amount of mana required to cast a spell"
      ],
      correct_option_index: 1,
      explanation: "EHP measures true survivability by combining raw health points with damage reduction formulas.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In virtual game economies, what is a 'Currency Sink'?",
      options: [
        "A place where gold is manufactured out of thin air",
        "A player inventory slot",
        "A bank loan in a game",
        "A game mechanic that permanently removes currency from the active economy (e.g. gear repair fees, auction house taxes, crafting costs) to prevent inflation"
      ],
      correct_option_index: 3,
      explanation: "Currency sinks permanently destroy currency, balancing faucets to prevent runaway in-game inflation.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In game balance terminology, what is 'Time-To-Kill' (TTK)?",
      options: [
        "The average duration of time required to eliminate an opponent in combat under standard conditions",
        "A countdown timer on a bomb",
        "The time when game servers shut down",
        "The total duration of a game's single-player campaign"
      ],
      correct_option_index: 0,
      explanation: "Time-To-Kill (TTK) measures the duration needed to defeat a target based on incoming DPS and target EHP.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In game balance design, what is an 'Asymmetrical Game'?",
      options: [
        "A game with broken 3D graphics",
        "A game played with only one hand",
        "A game where opposing players or factions have fundamentally different abilities, mechanics, and resources (e.g. StarCraft factions or Dead by Daylight)",
        "A game that is completely unplayable"
      ],
      correct_option_index: 2,
      explanation: "Asymmetrical games feature disparate faction mechanics while maintaining balanced win probabilities across skill brackets.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In game balance, what is a 'First-Order Optimal Strategy' (FOOS)?",
      options: [
        "The final boss strategy in an RPG",
        "A low-effort, easily discovered tactic that is highly effective for beginners (such as projectile spam) but should have accessible counter-strategies at higher skill tiers",
        "A strategy created by computer AI",
        "A cheat code built into the game engine"
      ],
      correct_option_index: 1,
      explanation: "FOOS gives beginners an easy early success loop, but must be counterable at higher play tiers to encourage mastery.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In probability design, why do competitive games (like Dota 2 or League of Legends) use 'Pseudo-Random Distribution' (PRD) for critical strike chances instead of Pure RNG?",
      options: [
        "Because PRD makes computers run faster",
        "Because pure RNG is illegal in video games",
        "PRD dynamically adjusts crit chance up or down after each attack, eliminating frustrating long streaks of non-crits while preventing overpowered consecutive crit bursts",
        "PRD guarantees that every attack is a critical hit"
      ],
      correct_option_index: 2,
      explanation: "PRD prevents extreme variance streaks, ensuring consistent statistical experience that matches player expectations.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In LiveOps telemetry analysis, how should a balance designer treat a character that exhibits a 'High Win Rate AND High Pick Rate'?",
      options: [
        "The character is strongly overpowered and dominating the competitive meta; they are a primary candidate for targeted numerical nerfs or mechanical adjustments",
        "The character should be given a 50% damage buff",
        "The character should be deleted from the game permanently",
        "Nothing should be done because high pick rate means players are happy"
      ],
      correct_option_index: 0,
      explanation: "High Win Rate + High Pick Rate indicates an overpowered character that crowds out strategic diversity and requires nerfing.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In RPG stat design, why are 'Diminishing Returns Formulas' (e.g. Benefit = Stat / (Stat + K)) applied to defensive attributes like Armor or Evasion?",
      options: [
        "To make armor completely useless",
        "To force players to buy microtransactions",
        "Because game engines cannot calculate numbers over 100",
        "To ensure that each additional point of raw stat provides progressively smaller incremental benefits, preventing game-breaking states like 100% damage immunity or 100% dodge"
      ],
      correct_option_index: 3,
      explanation: "Diminishing returns curves flatten stat scaling asymptotically, preventing invulnerability and maintaining balance.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In multiplayer balance design, what is a 'Transitive Relationship' (often modeled as Rock-Paper-Scissors)?",
      options: [
        "A storyline connecting two game levels",
        "A cyclic dynamic where Element A defeats Element B, Element B defeats Element C, and Element C defeats Element A, ensuring no single option remains dominant",
        "A system where all characters have the exact same weapon",
        "A game played across multiple computer monitors"
      ],
      correct_option_index: 1,
      explanation: "Rock-Paper-Scissors loops ensure that every powerful strategy has a direct, accessible counter-strategy.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In loot box and gacha game mechanics, what is a 'Pity System'?",
      options: [
        "Giving defeated players a consolation message",
        "Making the game easier when players lose three times",
        "A mathematical algorithm that progressively increases the probability of obtaining a rare item (or guarantees it outright at a hard cap) after a sequence of unsuccessful pulls",
        "A discount coupon for in-game shops"
      ],
      correct_option_index: 2,
      explanation: "Pity mechanics establish safety ceilings that protect players from extreme negative statistical variance in reward pulls.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "A character has 1,000 Base HP and 100 Armor. In a game system where Effective HP is defined as EHP = HP * (1 + (Armor / 100)), what is the character's Effective Hit Points against physical damage?",
      options: [
        "2,000 EHP (calculated as: 1,000 * (1 + (100 / 100)) = 1,000 * 2.0 = 2,000 EHP, meaning they can absorb 2,000 raw physical damage before dying)",
        "1,100 EHP",
        "100,000 EHP",
        "1,000 EHP"
      ],
      correct_option_index: 0,
      explanation: "EHP = 1,000 * (1 + 1.0) = 2,000 EHP. 100 armor provides 50% damage reduction, effectively doubling physical survivability.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "What is 'Power Creep' in live-service and collectible card games, and why is it dangerous to long-term system stability?",
      options: [
        "Electricity costs increasing for server hosting",
        "A horror game mechanic where monsters get faster",
        "A bug that increases computer processor heat",
        "The gradual, uncontrolled inflation of stats and power in newly released content designed to entice purchases, which progressively renders older characters and content obsolete"
      ],
      correct_option_index: 3,
      explanation: "Power creep invalidates legacy assets and shrinks strategic variety by making older content statistically unviable.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In game balance simulation, how are 'Monte Carlo Simulations' used by system designers prior to launch?",
      options: [
        "By hosting a poker tournament for game developers",
        "By running automated scripts that simulate 100,000+ AI matches across all character matchups, weapon combinations, and builds to generate statistical win-rate telemetry and detect imbalances",
        "By rendering 3D graphics in Monte Carlo, Monaco",
        "By testing game controller buttons with robotic arms"
      ],
      correct_option_index: 1,
      explanation: "Monte Carlo simulations run massive automated AI match batches to surface edge-case balance anomalies and win-rate skews.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In game theory, what defines a 'Nash Equilibrium' in a competitive multiplayer ecosystem?",
      options: [
        "A state where all players agree to stop playing",
        "A game mode where all players share one screen",
        "A strategic state where no player can increase their expected payoff or win rate by unilaterally changing their chosen character or strategy while other players keep theirs constant",
        "A tournament held in Nashville"
      ],
      correct_option_index: 2,
      explanation: "Nash Equilibrium represents a stable meta state where no individual player can improve their outcome by deviating alone.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "Why does summing multiple dice (such as 3d6) create a significantly different gameplay experience than rolling a single twenty-sided die (1d20)?",
      options: [
        "Rolling 3d6 generates a Gaussian normal distribution where outcomes cluster heavily around the average (10-11) making performance predictable; 1d20 generates a flat uniform distribution with equal 5% odds for extreme failure or success",
        "3d6 rolls are always higher than 1d20 rolls",
        "1d20 rolls cannot be calculated by computers",
        "There is zero mathematical or experiential difference between them"
      ],
      correct_option_index: 0,
      explanation: "Summing dice creates central limit clustering (predictable performance), while a single die has uniform randomness across all values.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #120.");
  console.log("Skill #120 update completed successfully!");
}

run();
