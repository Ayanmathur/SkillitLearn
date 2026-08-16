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

const skillId = "f2bfa293-970f-4ffd-ad18-9c50877f5f3d";

async function run() {
  console.log("Updating Skill #114: Program Design (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Exercise Science Principles, Needs Analysis and Acute Variables" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Periodization Paradigms and Cycle Architectures" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Goal-Specific Programming, Autoregulation and Fatigue Modeling" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / CSCS & Exercise Physiologist level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Foundational Training Laws (SAID, Overload and Specificity)",
      order_index: 1,
      content: `### Physiological Adaptation Laws and Overload

1. The SAID Principle:
   - Specific Adaptations to Imposed Demands: The human body adapts precisely to the specific mechanical, neuromuscular, and metabolic vectors placed upon it.

2. Progressive Overload and Reversibility:
   - Progressive Overload: Systematically increasing mechanical load, total volume, movement density, or range of motion to force continuous homeostatic adaptation.
   - Reversibility: Ceasing training leads to rapid neural drive decay and muscular atrophy within 2 to 4 weeks.`
    },
    {
      track_id: track1Id,
      title: "Conducting a Biomechanical and Metabolic Needs Analysis",
      order_index: 2,
      content: `### Movement Screening and Energy System Profiling

1. Biomechanical Needs Analysis:
   - Mapping joint kinematics across sagittal, frontal, and transverse planes. Categorizing primary movement patterns: Squat, Hinge, Lunge, Upper Push, Upper Pull, Carry, and Rotation.

2. Metabolic Profiling:
   - Identifying dominant energy systems: Phosphagen (ATP-PCr 0-10s), Fast Glycolytic (10-120s), and Oxidative (> 2 min) to match work-to-rest ratios.`
    },
    {
      track_id: track1Id,
      title: "Manipulating Acute Program Variables and Exercise Sequencing",
      order_index: 3,
      content: `### Acute Exercise Variables and Neural Sequencing

1. Acute Variable Manipulation:
   - Load (% of 1RM), Total Volume (Sets * Reps * Load), Rest Intervals, and Tempo (eccentric-isometric-concentric tempo notation, e.g. 3-1-1-0).

2. Neuromuscular Exercise Ordering:
   - Power and explosive movements (cleans, snatches, plyometrics) first -> Heavy multi-joint structural lifts (squats, deadlifts) second -> Single-joint isolation accessories last.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Hans Selye's GAS and Periodization Hierarchies",
      order_index: 1,
      content: `### Stress Adaptation Biology and Periodization Scales

1. General Adaptation Syndrome (GAS):
   - Alarm Phase (shock and temporary performance dip) -> Resistance Stage (adaptation) -> Supercompensation (elevated baseline) -> Exhaustion (overtraining if unmanaged).

2. Structural Planning Hierarchies:
   - Macrocycle: The multi-month or annual master training plan.
   - Mesocycle: Targeted 4-to-6-week training blocks focused on a specific adaptation.
   - Microcycle: Weekly structural unit (typically 7 days).`
    },
    {
      track_id: track2Id,
      title: "Linear, Undulating (DUP) and Block Periodization Models",
      order_index: 2,
      content: `### Periodization Paradigms and Volume-Intensity Dynamics

1. Linear Periodization:
   - Progressive step-wise transition from high volume/low intensity toward low volume/high intensity peaking.

2. Daily Undulating Periodization (DUP):
   - Altering training stimulus daily within a microcycle (e.g. Day 1: Hypertrophy 3x10 @ 70%, Day 2: Strength 4x5 @ 82.5%, Day 3: Power 5x3 @ 65% with max velocity).

3. Block Periodization:
   - Concentrated loads: Accumulation -> Transmutation -> Realization.`
    },
    {
      track_id: track2Id,
      title: "Deload Strategies, Supercompensation and Tapering",
      order_index: 3,
      content: `### Fatigue Dissipation and Peaking Protocols

1. Planned Deload Microcycles:
   - Executed every 4th to 6th week: Reducing total training volume by 40% to 50% while maintaining high intensity (>= 80% 1RM) to preserve neural motor patterns while allowing systemic connective tissue and CNS recovery.

2. Tapering for Peak Performance:
   - Progressive exponential volume reduction over 8 to 14 days to maximize supercompensation before athletic competition.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Hypertrophy, Maximal Strength and Power Programming",
      order_index: 1,
      content: `### Adaptation-Specific Volume, Intensity and Rest Prescriptions

1. Hypertrophy (Muscle Growth):
   - 10 to 20 direct working sets per muscle group per week; 6 to 15 reps at 1 to 3 Reps in Reserve (RIR); 60 to 90 seconds rest to maximize mechanical tension.

2. Maximal Strength:
   - >= 85% 1RM; 1 to 5 reps; 3 to 5 minutes rest to optimize high-threshold motor unit recruitment.

3. Power and Rate of Force Development (RFD):
   - 30% to 70% 1RM moved with maximal intended concentric velocity.`
    },
    {
      track_id: track3Id,
      title: "Autoregulation: RIR, RPE Scales and Velocity-Based Training",
      order_index: 2,
      content: `### Real-Time Load Adjustment and Velocity Tracing

1. Subjective Autoregulation:
   - Rating of Perceived Exertion (RPE) and Reps in Reserve (RIR): RPE 10 (0 RIR, failure), RPE 9 (1 RIR), RPE 8 (2 RIR). Adjusts daily weights based on neuromuscular readiness.

2. Velocity-Based Training (VBT):
   - Using linear position transducers to track mean concentric barbell velocity (m/s); sets terminate when velocity drops by 10% to 20% to avoid excessive neuromuscular fatigue.`
    },
    {
      track_id: track3Id,
      title: "The Fitness-Fatigue 2-Factor Model and Readiness Tracking",
      order_index: 3,
      content: `### Cumulative Stress Modeling and Session RPE

1. Banister's 2-Factor Model:
   - Preparedness(t) = Fitness(t) - Fatigue(t). Fatigue is higher in magnitude but decays roughly three times faster than fitness gains.

2. Monitoring Internal Training Load:
   - Session RPE (sRPE) Training Load = Session RPE * Duration in Minutes.
   - Heart Rate Variability (HRV) and morning readiness questionnaires to dynamically adjust daily volume and avoid overreaching.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #114.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In exercise science and program design, what does the 'SAID Principle' stand for?",
      options: [
        "Systematic Aerobic Intensity Demand",
        "Specific Adaptations to Imposed Demands (the body adapts specifically to the mechanical and metabolic stresses applied to it)",
        "Standard Athletic Instruction Division",
        "Strength And Isometric Development"
      ],
      correct_option_index: 1,
      explanation: "The SAID principle dictates that physiological adaptations are specific to the type of stress imposed.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In exercise sequencing within a single workout session, which category of exercises should be performed FIRST?",
      options: [
        "Single-joint isolation bicep curls",
        "Static stretching and foam rolling",
        "Core abdominal crunches",
        "Explosive power exercises and complex multi-joint Olympic lifts (e.g. cleans, snatches, plyometrics) when the central nervous system is freshest"
      ],
      correct_option_index: 3,
      explanation: "High-threshold neural power movements must precede heavy structural and isolation lifts to ensure technical execution.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In periodization terminology, what is a 'Mesocycle'?",
      options: [
        "A targeted training block typically lasting 4 to 6 weeks focused on developing a specific physical quality (e.g. hypertrophy or maximal strength)",
        "A 4-year Olympic training plan",
        "A single 60-minute workout session",
        "A stationary exercise bicycle"
      ],
      correct_option_index: 0,
      explanation: "A mesocycle represents a multi-week (typically 4-6 weeks) block of microcycles targeting specific adaptations.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In resistance training loading prescriptions, what rest interval is standardly recommended between heavy maximal strength sets (>= 85% 1RM)?",
      options: [
        "10 seconds",
        "30 seconds",
        "3 to 5 minutes (allowing complete phosphagen ATP-PCr replenishment and central nervous system recovery)",
        "15 minutes"
      ],
      correct_option_index: 2,
      explanation: "Heavy strength sets require 3-5 minutes of rest to restore cellular ATP-PCr reserves and neural excitability.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "On the Modified RPE / RIR scale used in autoregulated strength training, what does 'RPE 8' or '2 RIR' signify?",
      options: [
        "The athlete reached complete muscular failure and dropped the bar",
        "The athlete completed the set with exactly 2 Reps in Reserve (could have performed 2 more repetitions before reaching failure)",
        "The athlete trained at 80% heart rate",
        "The athlete rested for 8 minutes"
      ],
      correct_option_index: 1,
      explanation: "RPE 8 corresponds to 2 RIR (Reps in Reserve), indicating two remaining repetitions before technical failure.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In Hans Selye's General Adaptation Syndrome (GAS), what is the optimal physiological phase following the Alarm and Resistance phases where performance capacity rises ABOVE the initial baseline?",
      options: [
        "The Exhaustion Phase",
        "The Atrophy Phase",
        "The Supercompensation Phase",
        "The Detraining Phase"
      ],
      correct_option_index: 2,
      explanation: "Supercompensation occurs when adequate recovery allows the body to rebuild biological structures above baseline capacity.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "How does Daily Undulating Periodization (DUP) structure training variables compared to traditional Linear Periodization?",
      options: [
        "DUP alters intensity, volume, and rep ranges on a daily basis within a single microcycle (e.g. Hypertrophy on Monday, Strength on Wednesday, Power on Friday), whereas Linear shifts variables progressively across months",
        "DUP only uses cardiovascular running",
        "DUP requires lifting the exact same weight every single day for a year",
        "DUP is used exclusively for marathon runners"
      ],
      correct_option_index: 0,
      explanation: "DUP rotates acute training stimuli daily within each week, preventing neural accommodation and training plateaus.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What is the recommended weekly volume dose of direct working sets per muscle group to optimize muscular hypertrophy in intermediate to advanced lifters?",
      options: [
        "1 to 2 sets total per month",
        "50 to 100 sets per day",
        "Zero direct sets",
        "10 to 20 hard working sets per muscle group per week (spread across 2 to 3 weekly sessions) taken within 1 to 3 RIR"
      ],
      correct_option_index: 3,
      explanation: "Evidence-based guidelines show 10-20 weekly sets per muscle group at 1-3 RIR maximizes hypertrophy response.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In strength and conditioning programming, what is the standard protocol for executing a 'Deload Microcycle'?",
      options: [
        "Taking 4 weeks completely off from exercise with zero physical activity",
        "Reducing total training volume (sets and reps) by 40% to 50% while maintaining relatively high intensity (>= 80% 1RM) to preserve neuromuscular coordination while shedding systemic fatigue",
        "Doubling the training volume and eliminating all rest days",
        "Only drinking water without eating food"
      ],
      correct_option_index: 1,
      explanation: "A deload reduces volume by 40-50% while maintaining intensity to clear accumulated fatigue while maintaining neural drive.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In movement analysis, what are the primary functional compound movement patterns that form the foundation of a comprehensive resistance training program?",
      options: [
        "Only bicep curls and tricep pushdowns",
        "Running in circles and jumping jacks",
        "Squat, Hinge (e.g. deadlift), Lunge, Upper Body Push (horizontal/vertical), Upper Body Pull (horizontal/vertical), Carry, and Rotation/Anti-Rotation",
        "Sitting on a bench without moving"
      ],
      correct_option_index: 2,
      explanation: "Foundational human movement patterns encompass Squat, Hinge, Lunge, Push, Pull, Carry, and Core Rotation/Bracing.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "According to Eric Banister's Fitness-Fatigue 2-Factor Model, how do Fitness and Fatigue interact to determine an athlete's real-time 'Preparedness' (Performance Capacity)?",
      options: [
        "Preparedness(t) = Fitness(t) - Fatigue(t); Fatigue is greater in initial magnitude than the fitness stimulus, but Fatigue decays roughly three times faster than Fitness, yielding peak preparedness after adequate recovery",
        "Preparedness = Fitness + Fatigue (fatigue makes you stronger immediately)",
        "Fitness and Fatigue are identical biological markers with zero mathematical difference",
        "Fatigue lasts for 10 years while fitness decays in 10 minutes"
      ],
      correct_option_index: 0,
      explanation: "Banister's 2-factor model: Performance = Fitness - Fatigue. Fatigue masks fitness until it dissipates due to its faster decay rate.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Velocity-Based Training (VBT), how is a 'Velocity Loss Cutoff' (e.g. 10% to 20% drop in mean concentric barbell velocity) utilized during working sets?",
      options: [
        "To punish athletes for moving too quickly",
        "To speed up the gym clock",
        "To calculate the athlete's body weight",
        "To terminate the set dynamically once barbell velocity drops below the threshold, preventing excessive neuromuscular fatigue and metabolic accumulation while preserving maximum power output"
      ],
      correct_option_index: 3,
      explanation: "VBT velocity cutoffs stop sets before excessive neuromuscular fatigue degrades movement velocity and motor unit recruitment quality.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Vladimir Issurin's Block Periodization framework, what are the three sequential mesocycle blocks and their respective targeted physiological qualities?",
      options: [
        "Running, Swimming, and Cycling",
        "Accumulation (basic motor abilities, aerobic base, hypertrophy) -> Transmutation (sport-specific strength-endurance and specialized power) -> Realization (tapering, speed, and maximum neuromuscular readiness)",
        "Breakfast, Lunch, and Dinner blocks",
        "Warmup, Cooldown, and Sleep blocks"
      ],
      correct_option_index: 1,
      explanation: "Block periodization sequences Accumulation (high volume base) -> Transmutation (specialized strength) -> Realization (peaking).",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "How is 'Internal Training Load' calculated using the Foster Session-RPE (sRPE) method to monitor cumulative training stress?",
      options: [
        "Heart rate multiplied by body temperature",
        "Total pounds lifted divided by body weight",
        "Training Load (Arbitrary Units AU) = Session RPE (Borg CR-10 scale rating of entire workout) * Duration of the Session in Minutes",
        "Number of calories burned during lunch"
      ],
      correct_option_index: 2,
      explanation: "Foster's Session-RPE calculates internal load as: Session RPE * Duration (minutes), quantifying session exertion dose.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In tempo prescription notation (e.g. '3-1-1-0' on a barbell back squat), what does each individual digit represent?",
      options: [
        "3 seconds Eccentric lowering phase, 1 second Isometric pause at the bottom, 1 second Concentric lifting phase, 0 seconds rest at the top before next rep",
        "3 sets, 1 rep, 1 plate, 0 chalk",
        "3 minutes warmup, 1 minute lift, 1 minute rest, 0 cooldown",
        "3 reps squat, 1 rep lunge, 1 rep deadlift, 0 reps rest"
      ],
      correct_option_index: 0,
      explanation: "Standard tempo notation: 1st digit = Eccentric, 2nd = Isometric bottom pause, 3rd = Concentric drive, 4th = Top pause.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #114.");
  console.log("Skill #114 update completed successfully!");
}

run();
