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

const skillId = "9a0bd01b-6a54-4711-8994-68d22bbf82ef";

async function run() {
  console.log("Updating Skill #117: Coaching & Motivation Techniques (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Self-Determination Theory, Self-Efficacy and Behavioral Psychology" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Motor Learning, Attentional Focus and Neuromuscular Cueing" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Habit Architecture, Cognitive Reframing and Adherence" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD in Sport Psychology & Master Strength Coach level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Deci and Ryan's Self-Determination Theory (SDT) Framework",
      order_index: 1,
      content: `### Psychological Needs and the Motivation Continuum

1. The 3 Core Psychological Needs (SDT):
   - Autonomy: Feeling control over training choices and programming input.
   - Competence: Experiencing mastery, measurable progress, and skill capability.
   - Relatedness: Feeling genuine connection, trust, and belonging with the coach.

2. The Organismic Continuum:
   - Amotivation -> External Regulation (rewards/punishments) -> Introjected (guilt/ego) -> Identified (valuing health) -> Integrated -> Pure Intrinsic Motivation.`
    },
    {
      track_id: track1Id,
      title: "Bandura's Self-Efficacy Theory and Four Sources of Confidence",
      order_index: 2,
      content: `### Pillars of Task-Specific Self-Efficacy

1. Bandura's 4 Sources of Efficacy:
   - 1. Mastery Experiences: Past successful performances (structuring early training wins).
   - 2. Vicarious Experiences: Observing relatable peers succeed at similar movements.
   - 3. Verbal Persuasion: Credible, constructive coaching feedback and positive reinforcement.
   - 4. Physiological/Affective States: Reframing heavy breathing and muscle burn as positive adaptation rather than distress.`
    },
    {
      track_id: track1Id,
      title: "Locus of Control and Growth vs Fixed Mindset in Fitness",
      order_index: 3,
      content: `### Psychological Attribution and Resilience

1. Locus of Control:
   - Transitioning clients from External (blaming genetics, lack of time, bad luck) to Internal Locus of Control (focusing on preparation, schedule discipline, and effort).

2. Growth vs Fixed Mindset (Dweck):
   - Viewing plateaus, technical errors, and missed reps as opportunities for neuromuscular adaptation rather than fixed biological ceilings.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Fitts and Posner's Three Stages of Motor Learning",
      order_index: 1,
      content: `### Neuromuscular Skill Acquisition Stages

1. The 3 Motor Stages:
   - 1. Cognitive Stage: Conscious, deliberate movement; high cognitive load and gross biomechanical errors. Requires visual demonstration and simple cues.
   - 2. Associative Stage: Refining movement patterns, developing internal error detection, smoother kinetic coordination.
   - 3. Autonomous Stage: Fluid, automatic execution requiring minimal conscious thought; movement resists fatigue and environmental distractions.`
    },
    {
      track_id: track2Id,
      title: "Attentional Focus and External vs Internal Cueing",
      order_index: 2,
      content: `### Constrained Action Hypothesis and Verbal Cues

1. Attentional Focus (Wulf):
   - Internal Focus: Directing attention to body parts (e.g. 'Squeeze your glutes'). Constrains the motor control system and reduces movement efficiency.
   - External Focus: Directing attention to movement effects on the environment (e.g. 'Push the floor away', 'Snap the bar in half').

2. Motor Advantages:
   - External cues enhance motor unit recruitment, movement economy, and peak force generation.`
    },
    {
      track_id: track2Id,
      title: "Augmented Feedback Architectures: Bandwidth, Fading and KR/KP",
      order_index: 3,
      content: `### Feedback Delivery and Dependency Prevention

1. Feedback Types:
   - Knowledge of Results (KR): Objective outcome information (e.g. jump height, bar velocity).
   - Knowledge of Performance (KP): Biomechanical movement quality (e.g. hip depth on squat).

2. Feedback Schedules:
   - Bandwidth Feedback: Correcting only when errors exceed a preset error bandwidth.
   - Faded Feedback: Systematically reducing feedback frequency to foster internal proprioceptive error detection.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "The Habit Loop, Implementation Intentions and Stacking",
      order_index: 1,
      content: `### Behavioral Habit Engineering

1. The 4-Part Habit Loop:
   - Cue -> Craving -> Response -> Reward.

2. Behavioral Strategies:
   - Implementation Intentions: Pre-committing to exact situational cues ('When situation X arises, I will perform action Y').
   - Habit Stacking: Anchoring new training or nutrition habits directly onto entrenched daily routines (e.g. 'After I brush my teeth, I will do 5 minutes of mobility drills').`
    },
    {
      track_id: track3Id,
      title: "Cognitive Reframing, Lapses and the What-The-Hell Effect",
      order_index: 2,
      content: `### Cognitive Restructuring and Relapse Prevention

1. Reframing Cognitive Distortions:
   - Replacing All-or-Nothing thinking ('I missed one workout, the week is ruined') with Dialectical acceptance ('A 20-minute workout is far superior to zero').

2. Mitigating the 'What-The-Hell' Effect:
   - Preventing a minor nutritional or workout lapse from triggering complete behavioral disinhibition by reframing lapses as objective feedback.`
    },
    {
      track_id: track3Id,
      title: "Professional Scope of Practice and Identity Transformation",
      order_index: 3,
      content: `### Boundaries, Active Listening and Identity Shifts

1. Scope of Practice:
   - Maintaining professional boundaries by providing fitness/behavioral coaching while immediately referring clinical psychological disorders, severe eating pathologies, or acute injuries to licensed medical specialists.

2. Identity-Based Habit Change:
   - Shifting client self-identity from 'Someone trying to workout' to 'I am an active athlete who values lifelong strength and vitality.'`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #117.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "According to Deci and Ryan's Self-Determination Theory (SDT), what are the three basic psychological needs required to foster intrinsic motivation?",
      options: [
        "Autonomy (choice/control), Competence (mastery/capability), and Relatedness (connection/belonging)",
        "Money, Fame, and Luxury",
        "Diet, Sleep, and Supplements",
        "Speed, Power, and Agility"
      ],
      correct_option_index: 0,
      explanation: "Self-Determination Theory identifies Autonomy, Competence, and Relatedness as essential psychological nutriments for intrinsic drive.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In motor learning and coaching cueing, which of the following is an example of an 'EXTERNAL Attentional Focus' cue during a deadlift?",
      options: [
        "Squeeze your gluteus maximus muscles together",
        "Think about contracting your hamstring fibers",
        "Push the floor away through your heels",
        "Focus on flexing your latissimus dorsi"
      ],
      correct_option_index: 2,
      explanation: "External focus directs attention to the movement effect on the environment ('Push the floor away') rather than body parts.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In Albert Bandura's Self-Efficacy Theory, which of the four sources of self-efficacy is the MOST powerful driver of long-term confidence?",
      options: [
        "Reading a motivational fitness quote on social media",
        "Mastery Experiences (past successful performances and personal accomplishments)",
        "Drinking an energy drink before a workout",
        "Wearing matching workout clothes"
      ],
      correct_option_index: 1,
      explanation: "Mastery experiences (actual tangible successes in training) provide the strongest biological and cognitive evidence of capability.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In Fitts and Posner's stages of motor learning, what is the initial stage where a client performs movements stiffly with high conscious effort and frequent errors?",
      options: [
        "Autonomous Stage",
        "Associative Stage",
        "Reflexive Stage",
        "Cognitive Stage"
      ],
      correct_option_index: 3,
      explanation: "The Cognitive Stage is characterized by conscious deliberation, high cognitive load, and gross biomechanical errors.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In behavioral psychology, what is 'Habit Stacking'?",
      options: [
        "Pairing a new desired habit with an existing, well-entrenched daily routine (e.g. doing 10 pushups immediately after brewing morning coffee)",
        "Lifting heavier weights in the gym",
        "Eating two meals at the exact same time",
        "Reading two books simultaneously"
      ],
      correct_option_index: 0,
      explanation: "Habit stacking anchors a new target behavior directly onto an established automatic daily habit trigger.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "According to Gabriele Wulf's 'Constrained Action Hypothesis', why does an External Attentional Focus produce superior movement economy and force output compared to an Internal Focus?",
      options: [
        "Because external cues make the weights lighter",
        "Because internal cues stop the heart from beating",
        "Because external cues only work for professional athletes",
        "Internal focus causes conscious interference with automatic motor control processes, whereas External focus allows the motor system to self-organize naturally and execute fluid neuromuscular coordination"
      ],
      correct_option_index: 3,
      explanation: "Internal focus constrains motor degrees of freedom, while external focus allows reflexive neuromuscular self-organization.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In behavioral coaching, what is an 'Implementation Intention' (developed by psychologist Peter Gollwitzer)?",
      options: [
        "Wishing for good luck in the gym",
        "A pre-planned 'If/When situation X arises, then I will perform behavior Y' plan that links a specific environmental cue to a designated fitness response",
        "Buying a gym membership without going",
        "Setting a goal to be rich"
      ],
      correct_option_index: 1,
      explanation: "Implementation intentions create clear situational triggers ('When it is 7:00 AM on Tuesday, I will enter the gym'), drastically raising adherence.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In coaching feedback protocols, what is 'Bandwidth Feedback' and why is it beneficial for long-term skill retention?",
      options: [
        "The coach only provides corrective feedback when the client's movement error falls OUTSIDE a predetermined acceptable margin of error, allowing the client to develop internal proprioceptive error detection",
        "The coach shouts instructions on every single repetition",
        "The coach measures internet speed during workouts",
        "The coach gives zero feedback for 6 months"
      ],
      correct_option_index: 0,
      explanation: "Bandwidth feedback gives corrections only when errors exceed tolerances, preventing client dependence on constant coach feedback.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In cognitive psychology and fitness coaching, what is the 'What-The-Hell Effect' (counter-regulatory behavior)?",
      options: [
        "A client swearing when they lift heavy weights",
        "A sudden boost of energy during cardio",
        "When a minor dietary or workout lapse causes a client to experience total behavioral disinhibition (e.g. eating one cookie and deciding to abandon the entire nutrition plan for the week)",
        "A type of high-intensity interval training"
      ],
      correct_option_index: 2,
      explanation: "The What-The-Hell effect is the cognitive collapse where a minor deviation is perceived as total failure, prompting complete abandonment.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In Self-Determination Theory, what type of extrinsic motivation is characterized by exercising strictly to avoid feelings of guilt, shame, or anxiety (e.g. 'I have to workout or I will feel terrible about myself')?",
      options: [
        "Pure Intrinsic Motivation",
        "Integrated Regulation",
        "Amotivation",
        "Introjected Regulation"
      ],
      correct_option_index: 3,
      explanation: "Introjected regulation involves internal pressure, ego-involvement, and guilt-driven behavior, which leads to burnout if unshifted.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In motor learning science, how does 'Faded Feedback' differ from 'Summary Feedback', and how does it optimize athletic skill retention?",
      options: [
        "Faded feedback is given only in the dark",
        "Faded feedback starts with high-frequency feedback in early cognitive stages and systematically tapers down as competence increases; Summary feedback provides cumulative performance analysis after a block of trials",
        "Summary feedback is banned in athletic training",
        "Both provide feedback on 100% of repetitions forever"
      ],
      correct_option_index: 1,
      explanation: "Faded feedback gradually withdraws augmented guidance to stimulate independent retrieval and motor program consolidation.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "How does a personal trainer apply 'Cognitive Restructuring' (from CBT) when a client demonstrates 'All-or-Nothing' (Black-and-White) thinking after missing a scheduled workout?",
      options: [
        "By agreeing that the client has failed completely and ending the contract",
        "By punishing the client with 500 burpees",
        "By reframing the binary distortion: guiding the client to recognize that consistency is built on a continuum and that completing a modified 20-minute session or resuming tomorrow maintains positive momentum",
        "By ignoring the client's comments completely"
      ],
      correct_option_index: 2,
      explanation: "Cognitive restructuring reframes rigid cognitive distortions into balanced, dialectical perspectives that preserve self-efficacy.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In professional coaching ethics and Scope of Practice, what action must a personal trainer take if a client exhibits signs of severe clinical depression, severe body dysmorphic disorder, or an active eating disorder?",
      options: [
        "Immediately provide supportive listening within scope and refer the client to a licensed clinical psychologist, psychiatrist, or registered dietitian specializing in eating disorders",
        "Prescribe antidepressant medication and write a strict meal plan",
        "Force the client to weigh themselves in front of the gym",
        "Diagnose the mental health condition on their training chart"
      ],
      correct_option_index: 0,
      explanation: "Personal trainers must never diagnose or treat clinical psychological or medical conditions, maintaining ethical referral boundaries.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In the Organismic Integration Theory continuum, what distinguishes 'Integrated Regulation' from 'Identified Regulation' in a client's motivation?",
      options: [
        "Identified is for cardio; Integrated is for weights",
        "There is zero difference between them",
        "Identified regulation is 100% intrinsic with zero extrinsic elements",
        "In Identified Regulation, the client values the behavior's utility; in Integrated Regulation, the behavior is fully harmonized with their core personal identity and lifestyle values (e.g. 'Fitness is a core part of who I am')"
      ],
      correct_option_index: 3,
      explanation: "Integrated regulation fully assimilates the behavior into the individual's self-identity, representing the highest form of extrinsic drive.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In identity-based behavior change (James Clear / BJ Fogg), why is shifting client focus from 'Outcome-Based Identity' ('I want a six-pack') to 'Process-Based Identity' ('I am the type of person who never misses a training session') the ultimate key to permanent adherence?",
      options: [
        "Because outcome goals are completely illegal",
        "Every action taken becomes a vote for the type of person the client believes they are; when behavior aligns with personal identity, adherence becomes effortless and self-sustaining",
        "Because identity change burns 1,000 extra calories per day",
        "Because process-based identity eliminates the need to exercise"
      ],
      correct_option_index: 1,
      explanation: "True behavioral change is identity change; daily habits act as repeated evidence validating the client's internal athletic identity.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #117.");
  console.log("Skill #117 update completed successfully!");
}

run();
