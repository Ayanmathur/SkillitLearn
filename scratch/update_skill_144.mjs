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

const skillId = "d4aff9db-2bbb-486f-940b-5a39a782bfde";

async function run() {
  console.log("Updating Skill #144: Vital Signs & Basic Assessment (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Cardiovascular Vital Signs: BP, Pulse and Perfusion" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Thermoregulation, Respiratory Mechanics and SpO2" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Pain Assessment, Head-to-Toe Baseline and Escalation" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Clinical Nurse Specialist & Health Assessment Faculty level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Blood Pressure Auscultation, Cuff Sizing and AHA Guidelines",
      order_index: 1,
      content: `### Arterial Pressure Dynamics and Auscultation

1. Korotkoff Sounds:
   - Phase I (initial clear tapping = Systolic Blood Pressure SBP); Phase V (complete cessation of sound = Diastolic Blood Pressure DBP).

2. Cuff Sizing:
   - Inflatable bladder width must cover at least 40% of arm circumference; bladder length must encircle at least 80% of the limb. Undersized cuffs falsely elevate readings; oversized cuffs falsely lower readings.`
    },
    {
      track_id: track1Id,
      title: "Orthostatic Hypotension and Postural Position Protocols",
      order_index: 2,
      content: `### Autonomic Hemodynamic Assessment

1. Orthostatic Testing Protocol:
   - Measuring BP and pulse while supine (after 5 minutes rest), then at 1 minute and 3 minutes upon standing.

2. Diagnostic Criteria:
   - Positive orthostasis defined as a drop in Systolic BP >= 20 mmHg or a drop in Diastolic BP >= 10 mmHg within 3 minutes of standing, accompanied by compensatory reflex tachycardia.`
    },
    {
      track_id: track1Id,
      title: "Pulse Assessment, Apical Auscultation and Capillary Refill",
      order_index: 3,
      content: `### Peripheral Perfusion and Central Cardiac Rate

1. Pulse Assessment:
   - Palpating Radial Pulse; auscultating Apical Pulse at the 5th intercostal space midclavicular line for a full 60 seconds in irregular rhythms.
   - Pulse Amplitude Scale: 0 (absent), 1+ (weak/thready), 2+ (normal), 3+ (bounding).

2. Capillary Refill Time (CRT):
   - Normal brisk blanch return < 2 seconds indicating adequate peripheral microvascular perfusion.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Thermoregulation, Core Temperature and Pyrexia",
      order_index: 1,
      content: `### Hypothalamic Set-Points and Temperature Sites

1. Core vs Peripheral Measurement:
   - Rectal and Tympanic (closest to core body temperature); Oral, Temporal Artery, and Axillary.

2. Thermal Derangements:
   - Normal core baseline (36.5 to 37.5 degrees C / 97.7 to 99.5 degrees F).
   - Pyrexia (hypothalamic set-point elevation via pyrogens).
   - Hyperthermia (thermoregulatory failure).
   - Hypothermia (< 35.0 degrees C / 95.0 degrees F).`
    },
    {
      track_id: track2Id,
      title: "Respiratory Rate, Depth and Pathological Breathing Patterns",
      order_index: 2,
      content: `### Ventilatory Dynamics and Neurological Breathing

1. Respiratory Assessment:
   - Normal adult eupnea (12 to 20 breaths per minute), evaluated unobtrusively while palpating the pulse to prevent conscious patient alteration.

2. Pathological Patterns:
   - Cheyne-Stokes (crescendo-decrescendo breathing with alternating apnea).
   - Kussmaul Breathing (deep, rapid hyperventilation in Diabetic Ketoacidosis).
   - Biot's / Ataxic breathing (irregular brainstem trauma).`
    },
    {
      track_id: track2Id,
      title: "Pulse Oximetry (SpO2) Physics and False Artifacts",
      order_index: 3,
      content: `### Photoplethysmography and Arterial Saturation

1. Pulse Oximetry Physics:
   - Comparing differential absorption of red light (660 nm) and infrared light (940 nm) across oxygenated vs deoxygenated hemoglobin.

2. Clinical Artifacts:
   - False high readings in Carbon Monoxide poisoning (carboxyhemoglobin absorption overlap).
   - Signal failure in severe peripheral vasoconstriction, hypothermia, nail polish, and severe anemia.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Pain Assessment: The 5th Vital Sign and PQRSTU Scales",
      order_index: 1,
      content: `### Nociceptive Evaluation and Multidimensional Scales

1. PQRSTU Mnemonic:
   - Provocative/Palliative, Quality, Region/Radiation, Severity (0-10 NRS), Timing, and Understanding.

2. Behavioral Scales:
   - Wong-Baker FACES scale for pediatrics; FLACC Behavioral Scale (Face, Legs, Activity, Cry, Consolability) for non-verbal or cognitively impaired patients.`
    },
    {
      track_id: track3Id,
      title: "Cephalocaudal Head-to-Toe Baseline Assessment",
      order_index: 2,
      content: `### Systematic Physical Assessment Architecture

1. Neurological & Pupils:
   - Glasgow Coma Scale (GCS 3-15) and PERRLA (Pupils Equal, Round, Reactive to Light and Accommodation).

2. Cardiopulmonary & Abdominal:
   - Auscultating S1/S2 heart sounds; lung sounds (crackles, wheezes, stridor).
   - Abdominal sequence: Inspection -> Auscultation (bowel sounds in all 4 quadrants) -> Light Palpation.`
    },
    {
      track_id: track3Id,
      title: "Early Warning Scores (NEWS2/MEWS) and SBAR Escalation",
      order_index: 3,
      content: `### Clinical Deterioration and Structured Handoffs

1. Early Warning Scoring:
   - National Early Warning Score (NEWS2) aggregating physiological deviations into an objective clinical deterioration score to trigger rapid response teams.

2. SBAR Escalation Communication:
   - Situation (immediate patient issue), Background (relevant clinical history), Assessment (vital sign deviations), and Recommendation (specific requested clinical orders).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #144.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "When measuring manual blood pressure using a sphygmomanometer, which Korotkoff sound indicates the Systolic Blood Pressure (SBP)?",
      options: [
        "Phase I (the first appearance of clear, rhythmic tapping sounds)",
        "Phase V (the complete cessation and disappearance of all sound)",
        "The sound of the patient speaking",
        "Phase IV (the initial muffling of sound)"
      ],
      correct_option_index: 0,
      explanation: "Korotkoff Phase I (the first tapping sound) marks Systolic pressure; Phase V (complete silence) marks Diastolic pressure.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What is the normal resting respiratory rate range for a healthy adult at rest?",
      options: [
        "2 to 5 breaths per minute",
        "40 to 60 breaths per minute",
        "12 to 20 breaths per minute",
        "80 to 100 breaths per minute"
      ],
      correct_option_index: 2,
      explanation: "Normal adult eupneic respiratory rate is 12 to 20 breaths per minute at rest.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In peripheral cardiovascular assessment, what is the normal expected finding for 'Capillary Refill Time' (CRT)?",
      options: [
        "Color returns in 10 to 15 seconds",
        "Brisk blanch color return in less than 2 seconds",
        "Color never returns to the nail bed",
        "Fingernails turn permanently blue"
      ],
      correct_option_index: 1,
      explanation: "Normal capillary refill time is brisk (< 2 seconds), indicating adequate peripheral microvascular perfusion.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In clinical patient handoff and urgent escalation, what does the structured communication acronym 'SBAR' stand for?",
      options: [
        "System, Blood, Airway, Rate",
        "Symptoms, Breathing, Auscultation, Recovery",
        "Speed, Body, Accuracy, Response",
        "Situation, Background, Assessment, Recommendation"
      ],
      correct_option_index: 3,
      explanation: "SBAR (Situation, Background, Assessment, Recommendation) is the standardized clinical communication framework.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In pupillary neurological assessment, what does the clinical acronym 'PERRLA' stand for?",
      options: [
        "Pupils Equal, Round, Reactive to Light and Accommodation",
        "Pulse Elevated, Rapid, Regular, Low, Active",
        "Pressure Equal, Rested, Responsive, Level, Aligned",
        "Pain Evaluation, Recovery, Rest, Location, Assessment"
      ],
      correct_option_index: 0,
      explanation: "PERRLA documents that pupils are equal in size, round, and react normally to both light constriction and near accommodation.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "What happens to blood pressure readings if a clinician uses a blood pressure cuff that is too SMALL (narrow) for a patient's arm circumference?",
      options: [
        "The reading will be 100% accurate",
        "The blood pressure reading will be falsely LOW",
        "The cuff will automatically deflate without reading",
        "The blood pressure reading will be falsely HIGH (overestimating actual arterial pressure)"
      ],
      correct_option_index: 3,
      explanation: "An undersized cuff requires excessive bladder pressure to occlude the artery, resulting in falsely elevated high readings.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In physical abdominal examination, what is the mandatory sequence of assessment techniques and why must it be performed in this exact order?",
      options: [
        "Palpation -> Percussion -> Auscultation -> Inspection",
        "Inspection -> Auscultation -> Percussion -> Palpation (auscultation is performed BEFORE palpation so physical touch does not artificially stimulate or alter bowel sounds)",
        "Percussion -> Palpation -> Inspection -> Auscultation",
        "Sequence does not matter in abdominal assessment"
      ],
      correct_option_index: 1,
      explanation: "Auscultation precedes palpation in abdominal exams because touching/palpating bowel loops induces artificial peristaltic sounds.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In hemodynamic assessment, what diagnostic criteria confirm a patient has 'Orthostatic (Postural) Hypotension'?",
      options: [
        "A drop in Systolic BP >= 20 mmHg or a drop in Diastolic BP >= 10 mmHg within 3 minutes of standing from a supine position, often accompanied by dizziness and compensatory tachycardia",
        "Blood pressure increasing by 50 mmHg when lying down",
        "Pulse rate dropping to zero immediately",
        "Body temperature increasing by 2 degrees"
      ],
      correct_option_index: 0,
      explanation: "Orthostatic hypotension is diagnosed when SBP falls >= 20 mmHg or DBP falls >= 10 mmHg within 3 minutes of standing.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In pediatric or non-verbal patient pain evaluation, what does the 'FLACC' behavioral pain scale assess?",
      options: [
        "Fever, Lungs, Airway, Cough, Chest",
        "Food, Liquids, Activity, Communication, Comfort",
        "Face, Legs, Activity, Cry, Consolability",
        "Frequency, Location, Age, Cause, Complexity"
      ],
      correct_option_index: 2,
      explanation: "FLACC evaluates five objective non-verbal behavioral categories: Face, Legs, Activity, Cry, and Consolability (0-10 score).",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "Where is the 'Apical Pulse' auscultated on the adult chest wall?",
      options: [
        "Directly on the neck over the carotid artery",
        "Behind the knee in the popliteal space",
        "At the wrist on the thumb side",
        "At the 5th intercostal space along the left midclavicular line (the apex of the heart / point of maximal impulse)"
      ],
      correct_option_index: 3,
      explanation: "The apical pulse is auscultated at the cardiac apex: 5th intercostal space at the left midclavicular line.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In emergency toxicology, why can a standard Pulse Oximeter (SpO2) produce a dangerously FALSE NORMAL reading (e.g. 99%) in a patient suffering from severe Carbon Monoxide (CO) poisoning?",
      options: [
        "Carbon monoxide destroys the pulse oximeter's battery",
        "Standard two-wavelength pulse oximeters (660nm/940nm) cannot distinguish between oxyhemoglobin and carboxyhemoglobin (CO-bound hemoglobin), falsely interpreting CO-saturated hemoglobin as fully oxygenated blood",
        "Pulse oximeters only measure room temperature",
        "Carbon monoxide turns blood into water"
      ],
      correct_option_index: 1,
      explanation: "Carboxyhemoglobin absorbs light at 660nm identically to oxyhemoglobin, blinding two-wavelength pulse oximeters to severe hypoxia.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In endocrine emergency assessment, what characterizes 'Kussmaul Breathing' and in what life-threatening condition is it characteristically observed?",
      options: [
        "Slow shallow breathing during an asthma attack",
        "Periodic breathing with long apnea pauses during sleep",
        "Deep, rapid, labored hyperventilation occurring as a compensatory respiratory mechanism to blow off excess carbon dioxide in severe Diabetic Ketoacidosis (DKA)",
        "Rapid panting caused by running a marathon"
      ],
      correct_option_index: 2,
      explanation: "Kussmaul breathing is deep, rapid hyperventilation acting as a metabolic compensatory mechanism to eliminate CO2 during DKA acidosis.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In hospital patient safety systems, what is the clinical objective of the 'National Early Warning Score' (NEWS2)?",
      options: [
        "Aggregating physiological vital sign parameters (respiratory rate, oxygen saturation, temperature, blood pressure, heart rate, consciousness) into a single composite score to detect early clinical deterioration and trigger rapid response escalation",
        "Reporting hospital news on morning television",
        "Ranking hospital cleanliness scores",
        "Calculating patient insurance billing copays"
      ],
      correct_option_index: 0,
      explanation: "NEWS2 aggregates vital sign deviations into an objective weighted score that prompts immediate rapid response team intervention.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In neurological clinical assessment, what are the three behavioral response categories evaluated in the 'Glasgow Coma Scale' (GCS, scored from 3 to 15)?",
      options: [
        "Heart Rate, Blood Pressure, Respiratory Rate",
        "Memory, Concentration, Problem Solving",
        "Walking, Running, Jumping",
        "Eye Opening Response (1-4), Verbal Response (1-5), and Motor Response (1-6)"
      ],
      correct_option_index: 3,
      explanation: "GCS assesses level of consciousness via Eye Opening (E 1-4), Verbal Response (V 1-5), and Motor Response (M 1-6), totaling 3 to 15.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In respiratory pathophysiology, what characterizes 'Cheyne-Stokes Respiration' and what underlying conditions does it indicate?",
      options: [
        "Continuous high-pitched wheezing caused by bronchitis",
        "A repeating cycle of gradually increasing depth of breathing followed by a gradual decrease in depth, ending in a temporary period of Apnea (cessation of breathing); associated with severe congestive heart failure and brainstem injury",
        "Slow, irregular gasping breaths seen in newborns only",
        "Inability to inhale through the nose"
      ],
      correct_option_index: 1,
      explanation: "Cheyne-Stokes features a crescendo-decrescendo tidal volume cycle with central apnea, seen in severe heart failure and central neurologic lesions.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #144.");
  console.log("Skill #144 update completed successfully!");
}

run();
