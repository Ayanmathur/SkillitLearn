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

const skillId = "4d1ba9f3-94a7-4936-8cc3-bd1d61ae8cde";

async function run() {
  console.log("Updating Skill #116: Exercise Science Basics (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Skeletal Muscle Physiology and Neuromuscular Mechanics" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Bioenergetics, Metabolic Pathways and Substrate Utilization" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Biomechanics, Musculoskeletal Levers and Movement Planes" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD in Kinesiology & Exercise Physiology level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Sarcomere Ultrastructure and the Sliding Filament Theory",
      order_index: 1,
      content: `### Excitation-Contraction Coupling and Cross-Bridge Cycling

1. Sarcomere Architecture:
   - Functional contractile unit bounded by Z-discs, containing thin Actin filaments and thick Myosin filaments regulated by Troponin and Tropomyosin.

2. Excitation-Contraction Sequence:
   - Action potential depolarizes T-tubules -> Sarcoplasmic Reticulum releases Calcium (Ca2+) -> Ca2+ binds Troponin-C -> Tropomyosin uncovers active actin sites -> Myosin heads bind actin forming cross-bridges -> Power stroke driven by ATP hydrolysis (ATP -> ADP + Pi).`
    },
    {
      track_id: track1Id,
      title: "Muscle Fiber Typologies and Henneman's Size Principle",
      order_index: 2,
      content: `### Muscle Fiber Types and Orderly Motor Unit Recruitment

1. Fiber Typology Spectrum:
   - Type I (Slow-Oxidative): High capillary/mitochondrial density, highly fatigue resistant, low peak force.
   - Type IIa (Fast-Oxidative-Glycolytic): Intermediate force and moderate fatigue resistance.
   - Type IIx (Fast-Glycolytic): Highest contraction velocity and peak force, rapidly fatiguing.

2. Henneman's Size Principle:
   - Motor units are recruited in ascending order from smallest/lowest threshold (Type I) to largest (Type IIx) under heavy load or explosive velocity.`
    },
    {
      track_id: track1Id,
      title: "Muscle Architecture: Pennation Angle and Hypertrophy",
      order_index: 3,
      content: `### Structural Geometry and Mechanotransduction

1. Pennation Geometry:
   - Muscle fibers oriented at an angle to the tendon axis; higher pennation increases Physiological Cross-Sectional Area (PCSA), packing more contractile sarcomeres in parallel to generate maximum absolute force.

2. Hypertrophy Signaling:
   - Mechanical tension (primary driver stimulating the mTORC1 intracellular signaling pathway), muscle damage, and metabolic stress.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The Phosphagen (ATP-PCr) and Glycolytic Energy Systems",
      order_index: 1,
      content: `### Anaerobic Cellular Bioenergetics

1. The Phosphagen System (ATP-PCr):
   - Creatine Kinase catalyzes: Phosphocreatine + ADP <-> ATP + Creatine. Supplies immediate energy for 0 to 10 seconds of maximal explosive exertion.

2. Anaerobic Glycolysis:
   - Rapid breakdown of glycogen/glucose to pyruvate (yielding 2-3 net ATP). Under high anaerobic flux, pyruvate reduces to Lactate, releasing H+ hydrogen ions that cause intracellular metabolic acidosis and muscular burning.`
    },
    {
      track_id: track2Id,
      title: "Oxidative Phosphorylation, Beta-Oxidation and Krebs Cycle",
      order_index: 2,
      content: `### Aerobic Respiration and Mitochondrial Metabolism

1. Oxidative Phosphorylation:
   - Pyruvate converts to Acetyl-CoA -> enters the Krebs (Citric Acid) Cycle -> Electron Transport Chain (ETC) generates 30 to 32 ATP per glucose with oxygen as the final electron acceptor.

2. Beta-Oxidation:
   - Enzymatic cleavage of Free Fatty Acids into Acetyl-CoA units, generating massive ATP yields (> 100 ATP per triglyceride) during low-to-moderate sustained aerobic activity.`
    },
    {
      track_id: track2Id,
      title: "Lactate Dynamics, Ventilatory Thresholds and EPOC",
      order_index: 3,
      content: `### Metabolic Clearance, Thresholds and EPOC

1. Lactate Dynamics:
   - Lactate is a metabolic fuel recycled by the heart and converted back to glucose in the liver via the Cori Cycle.
   - Onset of Blood Lactate Accumulation (OBLA / LT2) occurs at 4.0 mmol/L blood lactate.

2. Excess Post-Exercise Oxygen Consumption (EPOC):
   - Elevated post-workout oxygen consumption required to replenish ATP-PCr stores, clear lactate, and restore core biological homeostasis.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "The Three Cardinal Planes of Motion and Joint Kinematics",
      order_index: 1,
      content: `### Spatial Human Biomechanics and Movement Planes

1. Sagittal Plane (Bisects Left/Right):
   - Flexion and extension movements (e.g. Barbell Squat, Bicep Curl, Walking, Forward Lunge).

2. Frontal / Coronal Plane (Bisects Anterior/Posterior):
   - Abduction, adduction, lateral spinal flexion, ankle inversion/eversion (e.g. Lateral Dumbbell Raise, Side Lunge).

3. Transverse / Horizontal Plane (Bisects Superior/Inferior):
   - Internal/external rotation, horizontal abduction/adduction (e.g. Cable Woodchop, Bench Press fly).`
    },
    {
      track_id: track3Id,
      title: "Musculoskeletal Lever Classes and Mechanical Advantage",
      order_index: 2,
      content: `### Anatomical Physics and Lever Mechanics

1. Lever Typologies:
   - Class 1 (Fulcrum between Effort and Load): Atlanto-occipital neck extension.
   - Class 2 (Load between Fulcrum and Effort): Plantarflexion calf raise. Mechanical Advantage > 1.0 (force multiplier).
   - Class 3 (Effort between Fulcrum and Load): Biceps brachii elbow flexion. Mechanical Advantage < 1.0 (force deficit, but optimized for high speed and extensive angular range of motion).`
    },
    {
      track_id: track3Id,
      title: "Force-Velocity, Length-Tension and Stretch-Shortening Cycle",
      order_index: 3,
      content: `### Contractile Dynamics and Neuro-Elastic Properties

1. Contractile Curves:
   - Force-Velocity Curve: Concentric force drops as velocity increases; eccentric contractions produce the highest peak forces.
   - Length-Tension Relationship: Maximal active tension occurs at optimal sarcomere resting length (2.0 to 2.25 micrometers) with peak actin-myosin cross-bridge overlap.

2. Stretch-Shortening Cycle (SSC):
   - Eccentric stretch activates muscle spindles and stores elastic energy in tendons/titin for explosive concentric release (Plyometrics).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #116.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In skeletal muscle physiology, what is the functional contractile unit of a muscle fiber bounded by Z-discs?",
      options: [
        "A Mitochondrion",
        "A Sarcomere",
        "A Tendon",
        "A Motor Neuron"
      ],
      correct_option_index: 1,
      explanation: "The sarcomere is the fundamental structural and contractile unit of striated muscle tissue bounded by Z-discs.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In human biomechanics, in which cardinal plane of motion do standard Barbell Back Squats and Bicep Curls primarily take place?",
      options: [
        "Transverse plane",
        "Frontal plane",
        "Coronal plane",
        "Sagittal plane (flexion and extension movements bisecting the body into left and right halves)"
      ],
      correct_option_index: 3,
      explanation: "Flexion and extension joint actions occur within the sagittal plane.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "Which cellular energy system provides immediate ATP for 0 to 10 seconds of maximal explosive exertion (e.g. a 100m sprint start or 1RM clean)?",
      options: [
        "The Phosphagen System (ATP-PCr / Creatine Phosphate system)",
        "Beta-Oxidation of fatty acids",
        "The Krebs Cycle",
        "Aerobic Glycolysis"
      ],
      correct_option_index: 0,
      explanation: "The phosphagen (ATP-PCr) system delivers rapid ATP resynthesis for maximal efforts lasting under 10 seconds.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "According to Henneman's Size Principle, in what order are motor units recruited as muscular force demands increase?",
      options: [
        "Randomly without any biological order",
        "Largest Type IIx fibers first, followed by Type I fibers",
        "In ascending order of size threshold: Small, fatigue-resistant Type I (Slow-Twitch) motor units first, followed by larger Type IIa and Type IIx (Fast-Twitch) motor units",
        "Motor units are only recruited when an athlete is asleep"
      ],
      correct_option_index: 2,
      explanation: "Henneman's Size Principle mandates orderly recruitment from lowest-threshold Type I to highest-threshold Type IIx units.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In anatomical lever systems, the human Biceps Brachii flexing the elbow is an example of which lever class?",
      options: [
        "Class 1 Lever",
        "Class 3 Lever (Effort applied between the Fulcrum/Elbow and the Load in hand, providing high velocity and range of motion despite a mechanical force disadvantage)",
        "Class 2 Lever",
        "Class 4 Lever"
      ],
      correct_option_index: 1,
      explanation: "Biceps elbow flexion is a Class 3 lever (Effort between Fulcrum and Load), favoring speed and range of motion over mechanical leverage.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "During Excitation-Contraction Coupling in skeletal muscle, what ion binds to Troponin-C to cause Tropomyosin to shift and expose myosin-binding sites on actin?",
      options: [
        "Sodium (Na+)",
        "Potassium (K+)",
        "Calcium (Ca2+) released from the Sarcoplasmic Reticulum",
        "Iron (Fe2+)"
      ],
      correct_option_index: 2,
      explanation: "Calcium (Ca2+) release from the sarcoplasmic reticulum binds to Troponin-C, moving tropomyosin off active actin sites.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "What biological metabolic process describes the breakdown of Free Fatty Acids in the mitochondria into Acetyl-CoA molecules to generate aerobic ATP?",
      options: [
        "Beta-Oxidation",
        "Anaerobic Glycolysis",
        "The Cori Cycle",
        "Fermentation"
      ],
      correct_option_index: 0,
      explanation: "Beta-oxidation enzymatically cleaves fatty acid chains into Acetyl-CoA units for entry into the Krebs cycle.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What blood lactate concentration standardly defines the 'Onset of Blood Lactate Accumulation' (OBLA / Lactate Threshold 2)?",
      options: [
        "0.1 mmol/L",
        "1.0 mmol/L",
        "20.0 mmol/L",
        "4.0 mmol/L (the inflection point where blood lactate production exponentially outpaces clearance capacity)"
      ],
      correct_option_index: 3,
      explanation: "OBLA is clinically defined at 4.0 mmol/L blood lactate, marking rapid metabolic acidosis during heavy exertion.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In the Sliding Filament Theory, what causes the 'Rigor Mortis' state (permanent actin-myosin binding) in the absence of biological energy?",
      options: [
        "Excessive calcium in the blood",
        "The complete depletion of ATP, preventing ATP from binding to the myosin head to release it from the actin filament",
        "Excess lactic acid in the joints",
        "Cold environmental temperatures"
      ],
      correct_option_index: 1,
      explanation: "ATP binding is required to detach the myosin cross-bridge from actin; without ATP, cross-bridges remain locked in rigor mortis.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In human movement planes, which of the following exercises occurs primarily in the 'Frontal (Coronal) Plane'?",
      options: [
        "Barbell Deadlift",
        "Push-up",
        "Standing Dumbbell Lateral Shoulder Raise (and Side Lunge)",
        "Russian Twist"
      ],
      correct_option_index: 2,
      explanation: "Lateral raises and side lunges involve abduction/adduction movements within the frontal (coronal) plane.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In the Length-Tension Relationship of skeletal muscle, why is maximal active isometric force generated specifically at an intermediate sarcomere resting length of 2.0 to 2.25 micrometers?",
      options: [
        "Because this optimal resting length allows the maximum possible structural overlap between myosin cross-bridge heads and actin binding sites (overly stretched sarcomeres lose overlap; overly compressed sarcomeres cause filament interference)",
        "Because mitochondria produce 100x more ATP at that length",
        "Because blood flow stops at other lengths",
        "Because bones become stronger at that length"
      ],
      correct_option_index: 0,
      explanation: "Optimal sarcomere resting length maximizes the number of actin-myosin cross-bridge bindings, producing peak active tension.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In plyometrics and athletic power, what two neuro-mechanical mechanisms drive the enhanced force output of the 'Stretch-Shortening Cycle' (SSC)?",
      options: [
        "Bone density and joint cartilage thickness",
        "Skin temperature and sweat rate",
        "Lactic acid accumulation and dehydration",
        "Storage and recoil of passive elastic energy in the Series Elastic Component (titin and tendons) PLUS the neurophysiological Myotatic Stretch Reflex mediated by muscle spindles"
      ],
      correct_option_index: 3,
      explanation: "The SSC leverages stored elastic tendon recoil combined with muscle spindle stretch reflex activation during rapid eccentric pre-stretching.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In muscle structural architecture, why does a higher 'Pennation Angle' enable a pennate muscle (like the rectus femoris) to generate greater maximal force than a parallel muscle of identical volume?",
      options: [
        "Pennate muscles have zero connective tissue",
        "Angled fiber orientation allows more muscle fibers and sarcomeres to be packed in parallel across the Physiological Cross-Sectional Area (PCSA), increasing force-generating capacity despite a minor cosine vector loss",
        "Pennate muscles use fat rather than glycogen for fuel",
        "Pennate muscles do not require motor unit recruitment"
      ],
      correct_option_index: 1,
      explanation: "Pennation packs more contractile fibers across the PCSA, substantially increasing total cross-bridge capacity and peak force output.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "What is the primary physiological mechanism explaining 'Excess Post-Exercise Oxygen Consumption' (EPOC) following high-intensity anaerobic training?",
      options: [
        "Breathing fast because of nervousness",
        "Lungs becoming permanently enlarged",
        "Elevated oxygen consumption required to resynthesize intramuscular phosphagen (ATP-PCr) stores, metabolize and clear lactate via the Cori cycle, re-oxygenate blood/myoglobin, and support elevated post-exercise body temperature and catecholamines",
        "Digesting post-workout protein shakes"
      ],
      correct_option_index: 2,
      explanation: "EPOC oxygen uptake restores PCr, processes lactate into glycogen, re-oxygenates myoglobin, and supports elevated metabolic rate post-exercise.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In musculoskeletal biomechanics, why do 'Eccentric' muscular contractions produce higher peak absolute force than 'Concentric' contractions at any given movement velocity?",
      options: [
        "During eccentric lengthening, the giant structural protein Titin increases passive stiffness while cross-bridge detachment is mechanically forced rather than purely ATP-rate limited, generating substantial passive and active resistive tension",
        "Concentric contractions do not use actin or myosin",
        "Eccentric contractions happen only in zero gravity",
        "Concentric contractions generate zero mechanical tension"
      ],
      correct_option_index: 0,
      explanation: "Eccentric actions engage titin filament stiffening and mechanical cross-bridge resistance, producing superior peak force over concentric actions.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #116.");
  console.log("Skill #116 update completed successfully!");
}

run();
