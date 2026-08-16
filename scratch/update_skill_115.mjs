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

const skillId = "5e2ff72e-08cd-41d4-8ba6-0cad3026dd3f";

async function run() {
  console.log("Updating Skill #115: Client Assessment & Goal Setting (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Pre-Participation Screening, Medical Stratification and Biometrics" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Postural Analysis, Dynamic Movement and Fitness Assessments" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: SMART Goal Setting, Behavior Change and Reassessment" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / ACSM Clinical Exercise Physiologist & NASM Master Instructor level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The PAR-Q+ and the ACSM Pre-Participation Algorithm",
      order_index: 1,
      content: `### Health Screening and Medical Clearance Stratification

1. PAR-Q+ Instrument:
   - Physical Activity Readiness Questionnaire for Everyone: Identifies red-flag cardiovascular, metabolic, or musculoskeletal symptoms requiring physician consultation.

2. The ACSM Screening Algorithm:
   - Evaluates: 1. Current physical activity participation (>= 30 min, 3 days/wk for past 3 months); 2. Known Cardiovascular, Metabolic, or Renal (CMR) diseases; 3. Signs/symptoms suggestive of CMR disease (angina, dyspnea, syncope, ankle edema, intermittent claudication).`
    },
    {
      track_id: track1Id,
      title: "Resting Biometrics: Blood Pressure, RHR and Health Markers",
      order_index: 2,
      content: `### Cardiovascular Baseline Metrics and Clinical Cutoffs

1. Resting Blood Pressure (AHA/ACC Standards):
   - Normal: < 120/< 80 mmHg.
   - Elevated: 120-129/< 80 mmHg.
   - Stage 1 Hypertension: 130-139 or 80-89 mmHg.
   - Stage 2 Hypertension: >= 140 or >= 90 mmHg (requires medical referral).

2. Resting Heart Rate (RHR):
   - Measured via radial pulse; elevated resting heart rates (> 80 to 90 bpm) flag poor aerobic fitness or autonomic overtraining stress.`
    },
    {
      track_id: track1Id,
      title: "Body Composition Assessment: DEXA, Skinfolds and Anthropometrics",
      order_index: 3,
      content: `### Body Fat Quantification and Visceral Adiposity

1. Anthropometric Indices:
   - Body Mass Index (BMI) limitations vs Waist-to-Hip Ratio (WHR > 0.90 men / > 0.85 women indicates high visceral fat and cardiometabolic disease risk).

2. Body Composition Modalities:
   - Dual-Energy X-Ray Absorptiometry (DEXA, gold standard for bone, fat, and lean mass).
   - Jackson-Pollock 3-Site/7-Site Skinfold Calipers utilizing the Siri Equation (% Body Fat = (495 / Body Density) - 450) and Bioelectrical Impedance (BIA).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Static Postural Analysis and Janda's Crossed Syndromes",
      order_index: 1,
      content: `### Kinetic Alignment and Neuromuscular Imbalance

1. Upper Crossed Syndrome (UCS):
   - Forward head, thoracic kyphosis, rounded shoulders.
   - Overactive/Tight: Upper trapezius, levator scapulae, pectoralis major/minor.
   - Underactive/Lengthened: Deep cervical flexors, lower trapezius, serratus anterior, rhomboids.

2. Lower Crossed Syndrome (LCS):
   - Anterior pelvic tilt, lumbar hyperlordosis.
   - Overactive/Tight: Iliopsoas, rectus femoris, erector spinae.
   - Underactive/Lengthened: Gluteus maximus, gluteus medius, rectus abdominis.`
    },
    {
      track_id: track2Id,
      title: "Dynamic Movement Screening: Overhead Squat Assessment (OHSA)",
      order_index: 2,
      content: `### Dynamic Movement Compensation Analysis

1. NASM Overhead Squat Assessment (OHSA) Key Compensations:
   - Knee Valgus (knees cave inward): Overactive adductors, TFL; Underactive gluteus medius, gluteus maximus, VMO.
   - Excessive Forward Lean: Overactive hip flexors, gastrocnemius, soleus; Underactive anterior tibialis, glutes, erectors.
   - Arms Fall Forward: Overactive latissimus dorsi, pectoralis major/minor; Underactive mid/lower trapezius, rhomboids.`
    },
    {
      track_id: track2Id,
      title: "Cardiorespiratory and Muscular Strength/Endurance Testing",
      order_index: 3,
      content: `### Aerobic and Neuromuscular Performance Assessments

1. Submaximal Cardiorespiratory Tests:
   - Rockport 1-Mile Walk Test (estimating VO2max via regression) and YMCA 3-Minute Step Test measuring heart rate recovery.

2. Muscular Fitness Testing:
   - Push-Up Test (muscular endurance).
   - Submaximal 1RM Estimation via the Brzycki Formula: 1RM = Weight Lifted / (1.0278 - (0.0278 * Reps)) for <= 10 repetitions.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "SMART Goal Architecture: Outcome vs Process/Behavioral Goals",
      order_index: 1,
      content: `### Goal Setting Hierarchy and Habit Loops

1. The SMART Criteria:
   - Specific, Measurable, Achievable, Relevant, and Time-bound.

2. Goal Typology:
   - Outcome Goals: The final macro objective (e.g. Lose 15 lbs of body fat).
   - Performance Goals: Intermediate performance milestones (e.g. Squat bodyweight for 5 reps).
   - Process / Habit Goals: Daily/weekly controllable actions (e.g. Complete 3 workouts weekly, hit 140g daily protein). Process goals drive highest long-term adherence.`
    },
    {
      track_id: track3Id,
      title: "The Transtheoretical Model (TTM) and Motivational Interviewing",
      order_index: 2,
      content: `### Stages of Change and Motivational Interviewing (MI)

1. Prochaska's Transtheoretical Model (TTM):
   - Precontemplation (no intent to exercise) -> Contemplation (intending within 6 months) -> Preparation (taking preliminary steps) -> Action (< 6 months) -> Maintenance (> 6 months).

2. Motivational Interviewing (OARS Framework):
   - Open-Ended Questions, Affirmations, Reflective Listening, and Summarizing to resolve client ambivalence and cultivate internal autonomy.`
    },
    {
      track_id: track3Id,
      title: "Periodized Reassessment Cadences and Data-Driven Refinement",
      order_index: 3,
      content: `### Progress Tracking and Adaptive Program Recalibration

1. Reassessment Cadences:
   - Conducting standardized re-evaluations every 6 to 12 weeks: Body composition, circumferences, movement screens, and submaximal strength tests.

2. Program Adaptation:
   - Tracking changes in Lean Body Mass (LBM) to ensure fat loss without muscular atrophy; recalibrating training loads using updated 1RM predictions and celebrating Non-Scale Victories (NSVs).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #115.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "What does the PAR-Q+ health screening tool stand for in fitness assessments?",
      options: [
        "Physical Activity Readiness Questionnaire for Everyone (used to screen for red-flag symptoms prior to beginning exercise)",
        "Personal Athlete Recovery Quotient",
        "Pulse And Respiration Quality",
        "Power And Resistance Quick-test"
      ],
      correct_option_index: 0,
      explanation: "PAR-Q+ is the internationally standardized health questionnaire screening for medical contraindications to exercise.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "According to the American Heart Association (AHA/ACC) clinical guidelines, what blood pressure reading qualifies as 'Stage 1 Hypertension'?",
      options: [
        "< 100/< 60 mmHg",
        "120-129/< 80 mmHg",
        "Systolic between 130-139 mmHg OR Diastolic between 80-89 mmHg",
        "> 200/> 120 mmHg"
      ],
      correct_option_index: 2,
      explanation: "Stage 1 Hypertension is defined as Systolic 130-139 mmHg or Diastolic 80-89 mmHg.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In the SMART goal setting framework, what does the 'R' stand for?",
      options: [
        "Rigid",
        "Relevant (meaning the goal aligns directly with the client's core values, lifestyle, and broader life objectives)",
        "Repetitive",
        "Running"
      ],
      correct_option_index: 1,
      explanation: "SMART: Specific, Measurable, Achievable, Relevant, and Time-bound.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In the Transtheoretical Model (Stages of Change), what stage is a client in if they are not currently exercising but actively intend to start within the next 30 days and have bought gym shoes?",
      options: [
        "Precontemplation",
        "Maintenance",
        "Termination",
        "Preparation Stage"
      ],
      correct_option_index: 3,
      explanation: "The Preparation stage involves taking concrete preliminary steps to start regular physical activity within the immediate month.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In body composition assessment, which technology is considered the gold standard for measuring bone mineral density, total fat mass, and regional lean soft tissue?",
      options: [
        "Dual-Energy X-Ray Absorptiometry (DEXA)",
        "Bathroom weight scale",
        "Measuring tape around the wrist",
        "Mirror visual estimate"
      ],
      correct_option_index: 0,
      explanation: "DEXA scans provide high-precision multi-compartment body composition and bone density analysis.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "During an Overhead Squat Assessment (OHSA), if a client's knees cave inward into dynamic valgus, which muscle group is typically OVERACTIVE (tight) and which is UNDERACTIVE (weak)?",
      options: [
        "Overactive: Gluteus Maximus; Underactive: Biceps Brachii",
        "Overactive: Anterior Tibialis; Underactive: Rectus Abdominis",
        "Overactive: Triceps; Underactive: Deltoids",
        "Overactive/Tight: Adductor Complex and Tensor Fasciae Latae (TFL); Underactive/Weak: Gluteus Medius and Gluteus Maximus"
      ],
      correct_option_index: 3,
      explanation: "Knee valgus is driven by overactive adductors/TFL pulling the femur inward against underactive gluteus medius/maximus abductors.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Vladimir Janda's 'Lower Crossed Syndrome' (LCS), what postural distortion and muscle imbalance pattern is present?",
      options: [
        "Posterior pelvic tilt with flat lower back and weak calves",
        "Anterior Pelvic Tilt and Lumbar Hyperlordosis; caused by tight/overactive Iliopsoas, Rectus Femoris, and Erector Spinae, paired with weak/inhibited Gluteals and Abdominals",
        "Forward head posture with tight hamstrings and weak neck muscles",
        "Rounded shoulders with tight lats and weak biceps"
      ],
      correct_option_index: 1,
      explanation: "Lower Crossed Syndrome features anterior pelvic tilt from hyperactive hip flexors/erectors and reciprocal inhibition of glutes/abs.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In behavioral psychology, why are 'Process / Habit Goals' superior to 'Outcome Goals' for driving long-term client adherence?",
      options: [
        "Process goals focus entirely on daily controllable behaviors (e.g. eating 140g protein and training 3 days weekly) rather than distant outcome results that are influenced by external biological variables",
        "Process goals allow clients to stop exercising completely",
        "Process goals guarantee a 100 lb fat loss in one week",
        "Outcome goals are banned by fitness organizations"
      ],
      correct_option_index: 0,
      explanation: "Process goals focus on direct daily actions within the client's direct control, building sustainable self-efficacy and habits.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In the ACSM Pre-Participation Screening Algorithm, what signs and symptoms are considered suggestive of underlying Cardiovascular, Metabolic, or Renal (CMR) disease?",
      options: [
        "Sneezing and runny nose during spring",
        "Having gray hair and wearing glasses",
        "Angina (chest discomfort), dyspnea (unexplained shortness of breath at rest/mild exertion), syncope (dizziness/fainting), ankle edema, palpitations, or intermittent claudication",
        "Sore muscles 48 hours after a heavy workout"
      ],
      correct_option_index: 2,
      explanation: "ACSM red-flag signs include chest pain, unexplained resting dyspnea, syncope, ankle swelling, and claudication.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In submaximal muscular strength prediction, a client bench presses 200 lbs for exactly 5 repetitions. Using the Brzycki Formula (1RM = Weight / (1.0278 - (0.0278 * Reps))), what is their estimated 1-Repetition Maximum (1RM)?",
      options: [
        "200 lbs",
        "300 lbs",
        "210 lbs",
        "225 lbs (calculated as: 200 / (1.0278 - (0.0278 * 5)) = 200 / 0.8888 = 225.02 lbs)"
      ],
      correct_option_index: 3,
      explanation: "Brzycki formula calculation: 200 / (1.0278 - 0.1390) = 200 / 0.8888 = 225.02 lbs.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In Vladimir Janda's 'Upper Crossed Syndrome' (UCS), which specific deep and superficial muscle groups exhibit reciprocal inhibition and require targeted strengthening?",
      options: [
        "Upper trapezius and levator scapulae",
        "Deep Cervical Neck Flexors (longus capitis/colli), Lower Trapezius, Serratus Anterior, and Rhomboids",
        "Pectoralis Major and Minor",
        "Deltoids and Biceps"
      ],
      correct_option_index: 1,
      explanation: "UCS causes neurological inhibition of deep neck flexors, lower trapezius, serratus anterior, and rhomboids, requiring strengthening.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In anthropometric risk assessment, what Waist-to-Hip Ratio (WHR) thresholds indicate substantially elevated cardiometabolic and type 2 diabetes risk in men and women?",
      options: [
        "WHR > 0.50 in men; WHR > 0.40 in women",
        "WHR < 0.70 in both men and women",
        "WHR > 0.90 in men; WHR > 0.85 in women (indicating central android visceral fat accumulation around vital abdominal organs)",
        "WHR is only used for children"
      ],
      correct_option_index: 2,
      explanation: "WHR > 0.90 in men and > 0.85 in women reflects abdominal visceral obesity, a key marker of metabolic syndrome and cardiovascular risk.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Motivational Interviewing (MI), what four core communication skills comprise the 'OARS' model used by health coaches to resolve client resistance?",
      options: [
        "Open-Ended Questions, Affirmations, Reflective Listening, and Summarizing",
        "Orders, Arguments, Reprimands, and Silence",
        "Observation, Assessment, Re-testing, and Scheduling",
        "Optimism, Action, Recovery, and Sleep"
      ],
      correct_option_index: 0,
      explanation: "OARS (Open-ended questions, Affirmations, Reflections, Summaries) is the foundational active listening toolkit in motivational interviewing.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "During an Overhead Squat Assessment, if a client's 'Arms Fall Forward' past the line of the torso during the descent, which primary muscles are overactive (shortened)?",
      options: [
        "Quadriceps and Hamstrings",
        "Abdominals and Gluteals",
        "Anterior Deltoids and Biceps",
        "Latissimus Dorsi, Pectoralis Major, Pectoralis Minor, and Teres Major"
      ],
      correct_option_index: 3,
      explanation: "Arms falling forward indicates tight latissimus dorsi, pectoralis major/minor, and teres major restricting humeral elevation.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "When conducting periodized client reassessments at 8 to 12 weeks, why is tracking changes in 'Lean Body Mass' (LBM) alongside total scale weight essential during a fat-loss phase?",
      options: [
        "To make the workout longer",
        "To ensure that scale weight reduction is driven by adipose tissue loss rather than catabolic skeletal muscle loss, preserving basal metabolic rate (BMR) and physical function",
        "To increase water retention in the legs",
        "Because muscle weight cannot be measured"
      ],
      correct_option_index: 1,
      explanation: "Tracking LBM ensures caloric deficits and training maintain skeletal muscle mass, confirming true fat loss and preserving resting metabolic rate.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #115.");
  console.log("Skill #115 update completed successfully!");
}

run();
