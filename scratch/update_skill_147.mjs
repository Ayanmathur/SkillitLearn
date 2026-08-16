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

const skillId = "48e26d69-eb52-4a8f-81dc-24271e952737";

async function run() {
  console.log("Updating Skill #147: Emergency Response Basics (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: BLS Algorithms, High-Quality CPR, AED and Choking" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Medical Emergencies: Stroke, ACS, Anaphylaxis and Hypoglycemia" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Hemorrhage Control, Shock, Burns and Mass Casualty Triage" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Emergency Medicine Physician & ACLS Lead Instructor level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "AHA Adult BLS Algorithm and High-Quality CPR Metrics",
      order_index: 1,
      content: `### Resuscitation Science and Compression Biomechanics

1. High-Quality CPR Parameters:
   - Rate: 100 to 120 compressions per minute.
   - Depth: 2 to 2.4 inches (5 to 6 cm) in adults; full chest recoil between compressions.
   - Chest Compression Fraction (CCF) > 80%; minimizing pauses < 10 seconds.

2. Compression-Ventilation Ratios:
   - 30:2 in adults; 15:2 in two-rescuer pediatric resuscitation.`
    },
    {
      track_id: track1Id,
      title: "AED Operations, Pad Vectors and Shockable Rhythms",
      order_index: 2,
      content: `### Early Defibrillation and Cardiac Arrhythmias

1. AED Pad Placement:
   - Anterolateral placement (upper right sternal border below clavicle; lower left midaxillary line lateral to apex).

2. Shockable vs Non-Shockable Rhythms:
   - Shockable: Ventricular Fibrillation (VF) and Pulseless Ventricular Tachycardia (pVT).
   - Non-Shockable: Asystole and Pulseless Electrical Activity (PEA), managed with continuous CPR and epinephrine.`
    },
    {
      track_id: track1Id,
      title: "Foreign Body Airway Obstruction (FBAO) Management",
      order_index: 3,
      content: `### Airway Choking Protocols Across Lifespans

1. Conscious Choking:
   - Subdiaphragmatic Abdominal Thrusts (Heimlich Maneuver) for adults/children.
   - 5 Back Slaps alternating with 5 Chest Thrusts for infants < 1 year.

2. Unresponsive Choking:
   - Lowering patient to floor and initiating CPR immediately; looking in oral pharynx before breaths and removing visible objects (never blind finger sweeps).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Acute Stroke Triage, BE-FAST and Thrombolytic Windows",
      order_index: 1,
      content: `### Neurological Ischemia and Rapid Stroke Triage

1. BE-FAST Screening:
   - Balance (sudden loss of coordination), Eyes (visual loss), Face (facial droop), Arms (arm drift/weakness), Speech (slurred/aphasia), Time (determining Last Known Well time).

2. Critical Time Windows:
   - Activating Code Stroke; IV thrombolytic (tPA/TNK) eligibility window within 3 to 4.5 hours of symptom onset.`
    },
    {
      track_id: track2Id,
      title: "Acute Coronary Syndromes (ACS) and MONA Interventions",
      order_index: 2,
      content: `### Myocardial Infarction Recognition and Care

1. ACS Clinical Presentation:
   - Crushing retrosternal chest pain radiating to left jaw/arm, diaphoresis, and shortness of breath.

2. Immediate Pharmacotherapy:
   - Aspirin (324 mg chewable, un-coated).
   - Sublingual Nitroglycerin (0.4 mg every 5 mins, max 3 doses; strictly contraindicated if patient used PDE-5 inhibitors like sildenafil within 24-48 hours).`
    },
    {
      track_id: track2Id,
      title: "Anaphylaxis Epinephrine Protocols and Severe Hypoglycemia",
      order_index: 3,
      content: `### Immunological Crises and Glycemic Emergencies

1. Anaphylaxis First-Line Therapy:
   - Immediate Intramuscular Epinephrine 1:1000 (0.3 mg adult, 0.15 mg pediatric) in the anterolateral mid-thigh (vastus lateralis).

2. Severe Hypoglycemia (< 70 mg/dL):
   - Rule of 15 (15g fast-acting oral glucose, recheck in 15 mins); IV 50% Dextrose (D50W) or IM Glucagon 1mg if unconscious.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Stop the Bleed: Tourniquet Application and Wound Packing",
      order_index: 1,
      content: `### Exsanguinating Arterial Hemorrhage Control

1. Tourniquet Placement:
   - Applying commercial windlass tourniquet 2 to 3 inches proximal to limb bleeding site (never over joints); tightening windlass until bright red pulsatile arterial bleeding ceases.

2. Junctional Hemorrhage:
   - Deep wound packing with hemostatic gauze in groin/axilla followed by 3 minutes of continuous direct pressure.`
    },
    {
      track_id: track3Id,
      title: "Shock Pathophysiology, Clinical Stages and Management",
      order_index: 2,
      content: `### Systemic Hypoperfusion and Cellular Shock

1. Shock Classifications:
   - Hypovolemic (hemorrhage/dehydration), Cardiogenic (pump failure), Distributive (Septic/Anaphylactic/Neurogenic vasodilation), and Obstructive (cardiac tamponade, tension pneumothorax).

2. Clinical Recognition:
   - Tachycardia, hypotension, tachypnea, cool clammy extremities, delayed capillary refill, and oliguria.`
    },
    {
      track_id: track3Id,
      title: "START Disaster Triage and Hospital Code Systems",
      order_index: 3,
      content: `### Mass Casualty Incidents (MCI) and Hospital Codes

1. START Triage Color Algorithm:
   - Black (Expectant/Deceased: non-breathing after airway repositioning).
   - Red (Immediate: respirations >30, no radial pulse, or unable to follow simple commands).
   - Yellow (Delayed: serious injuries but stable).
   - Green (Minor / Walking Wounded).

2. Hospital Emergency Codes:
   - Code Blue (cardiac arrest), Code Red (fire / RACE protocols).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #147.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "According to American Heart Association (AHA) guidelines, what is the correct compression rate for adult CPR?",
      options: [
        "40 to 60 compressions per minute",
        "100 to 120 compressions per minute",
        "200 to 250 compressions per minute",
        "Compressions are not timed"
      ],
      correct_option_index: 1,
      explanation: "AHA guidelines mandate a chest compression rate of 100 to 120 compressions per minute for all age groups.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What is the recommended chest compression depth for adult CPR?",
      options: [
        "0.5 inches",
        "1 inch",
        "4 inches",
        "At least 2 inches (5 cm) but no more than 2.4 inches (6 cm)"
      ],
      correct_option_index: 3,
      explanation: "Adult CPR depth must be at least 2 inches (5 cm) up to a maximum of 2.4 inches (6 cm) to maximize coronary perfusion.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What is the FIRST-LINE medication of choice that must be administered IMMEDIATELY for a severe anaphylactic allergic reaction?",
      options: [
        "Intramuscular Epinephrine (injected into the anterolateral mid-thigh / vastus lateralis)",
        "Oral cough syrup",
        "Vitamin C tablets",
        "Aspirin"
      ],
      correct_option_index: 0,
      explanation: "IM Epinephrine in the anterolateral thigh is the sole life-saving first-line medication for anaphylaxis.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In acute stroke recognition, what does the clinical screening acronym 'BE-FAST' stand for?",
      options: [
        "Breathe, Eat, Food, Air, Sleep, Temperature",
        "Blood, Emergency, Fever, Alert, Surgery, Trauma",
        "Balance, Eyes, Face, Arms, Speech, Time",
        "Brain, Energy, Focus, Action, Safety, Transfer"
      ],
      correct_option_index: 2,
      explanation: "BE-FAST evaluates Balance loss, Eye vision changes, Facial droop, Arm weakness, Speech difficulty, and Time to call emergency.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In foreign body airway obstruction, what maneuver should be performed on a conscious CHOKING INFANT (< 1 year old)?",
      options: [
        "Perform deep abdominal thrusts directly on the infant's stomach",
        "Deliver 5 back slaps between shoulder blades alternating with 5 chest thrusts, keeping infant head lower than trunk",
        "Hold the infant upside down by the feet and shake vigorously",
        "Give the infant a glass of water"
      ],
      correct_option_index: 1,
      explanation: "Infant choking requires alternating 5 back slaps and 5 chest thrusts with head positioned downward (abdominal thrusts risk liver injury).",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "Which two cardiac rhythms are classified as 'SHOCKABLE' by an Automated External Defibrillator (AED)?",
      options: [
        "Normal Sinus Rhythm and Sinus Bradycardia",
        "Asystole (flatline) and Pulseless Electrical Activity (PEA)",
        "Ventricular Fibrillation (VF) and Pulseless Ventricular Tachycardia (pVT)",
        "Atrial Fibrillation with normal pulse"
      ],
      correct_option_index: 2,
      explanation: "AEDs deliver shocks exclusively for chaotic Ventricular Fibrillation (VF) and Pulseless Ventricular Tachycardia (pVT).",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "When managing a life-threatening, pulsatile arterial hemorrhage from a severe limb injury using a commercial tourniquet, what is the proper application rule?",
      options: [
        "Apply the tourniquet 2 to 3 inches proximal to the bleeding wound (never directly over a joint), tighten the windlass until bleeding stops, and document the exact time of application",
        "Apply the tourniquet directly over the knee or elbow joint",
        "Loosen the tourniquet every 5 minutes to let blood flow",
        "Apply the tourniquet loosely so fingers can slip underneath"
      ],
      correct_option_index: 0,
      explanation: "Tourniquets are placed 2-3 inches proximal to the wound (avoiding joints), tightened until bleeding ceases, and marked with timestamp.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In the START (Simple Triage and Rapid Treatment) disaster triage algorithm, which color tag is assigned to a victim who is UNABLE TO WALK, has a respiratory rate GREATER than 30 breaths/min, and is unresponsive?",
      options: [
        "Green (Minor)",
        "Yellow (Delayed)",
        "Black (Expectant/Deceased)",
        "Red (Immediate / Priority 1)"
      ],
      correct_option_index: 3,
      explanation: "Red tags indicate critical life-threatening injuries requiring immediate intervention (respiratory rate >30 or absent radial pulse).",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "Why is Sublingual Nitroglycerin STRICTLY CONTRAINDICATED in a patient experiencing acute myocardial chest pain if they have taken a PDE-5 inhibitor (e.g. sildenafil) within the last 24 to 48 hours?",
      options: [
        "It causes an allergic skin rash",
        "The synergistic combination causes profound, refractory, and potentially fatal systemic vasodilation and catastrophic arterial hypotension",
        "It stops the patient from falling asleep",
        "It cancels out the taste of the medication"
      ],
      correct_option_index: 1,
      explanation: "Nitrates combined with PDE-5 inhibitors create severe cGMP-mediated vasodilation, precipitating fatal arterial hypotension.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In managing an acute hypoglycemic emergency (blood glucose < 70 mg/dL) in a conscious patient, what is the standard 'Rule of 15'?",
      options: [
        "Wait 15 hours before doing anything",
        "Give 15 glasses of whole milk",
        "Administer 15 grams of fast-acting simple carbohydrates (e.g. 4 oz fruit juice or glucose tablets), wait 15 minutes, and re-test blood glucose level",
        "Inject 15 units of insulin immediately"
      ],
      correct_option_index: 2,
      explanation: "The Rule of 15 treats hypoglycemia with 15g fast-acting carbs, followed by re-checking blood glucose after 15 minutes.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In resuscitation science, why is 'Full Chest Recoil' between chest compressions essential for CPR survival?",
      options: [
        "Full recoil allows the chest wall to re-expand completely, creating negative intrathoracic pressure that draws venous blood back into the heart chambers, filling the ventricles for the next stroke volume",
        "Full recoil gives the rescuer time to rest",
        "Full recoil prevents the patient from coughing",
        "Recoil is not clinically necessary during CPR"
      ],
      correct_option_index: 0,
      explanation: "Incomplete recoil keeps positive pressure in the chest, impeding venous return to the heart and slashing cerebral perfusion.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In the START Mass Casualty Triage system, what criteria determine that a patient must be tagged with a 'BLACK' (Expectant/Deceased) triage tag?",
      options: [
        "The patient is crying and has a broken arm",
        "The patient has a minor cut on their leg",
        "The patient is elderly",
        "The patient is not breathing spontaneously, and does NOT start breathing even after the rescuer performs a manual jaw-thrust/head-tilt airway opening maneuver"
      ],
      correct_option_index: 3,
      explanation: "In mass casualty triage, victims who remain apneic after a single manual airway positioning attempt are triaged Black (Expectant).",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In emergency airway management for an UNRESPONSIVE patient with suspected severe foreign body airway obstruction (choking), what is the correct procedural action?",
      options: [
        "Perform blind finger sweeps deep into the throat immediately",
        "Lower patient to floor, activate code/911, begin 30 chest compressions, open airway and visually inspect pharynx for foreign body before delivering breaths (removing only if visible)",
        "Wait 10 minutes for emergency medical services to arrive",
        "Pour water down the patient's throat"
      ],
      correct_option_index: 1,
      explanation: "Unresponsive choking protocols mandate starting CPR compressions, visually checking the airway before breaths, and never doing blind sweeps.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In shock pathophysiology, what differentiates 'Distributive Shock' (such as Septic or Anaphylactic shock) from 'Hypovolemic Shock'?",
      options: [
        "Distributive shock only occurs on airplanes",
        "Hypovolemic shock features warm flushed skin",
        "Distributive shock is characterized by profound widespread systemic vasodilation and loss of vascular vascular tone without absolute whole blood volume loss; Hypovolemic shock results from physical intravascular fluid/blood loss",
        "There is zero physiological difference between them"
      ],
      correct_option_index: 2,
      explanation: "Distributive shock is a relative hypovolemia from massive vasodilation (sepsis/anaphylaxis); hypovolemic shock is actual fluid/blood volume loss.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In acute ischemic stroke management, what is the critical time window for administering intravenous thrombolytic therapy (tissue plasminogen activator / tPA or TNK) from the patient's 'Last Known Well' time?",
      options: [
        "Within 3 to 4.5 hours from the patient's documented Last Known Well time (with mechanical thrombectomy up to 24 hours in selected large vessel occlusions)",
        "Within 24 to 48 hours",
        "Within 1 week",
        "Thrombolytics can be given anytime without time limits"
      ],
      correct_option_index: 0,
      explanation: "IV thrombolysis (tPA/TNK) must be administered within 3 to 4.5 hours of last known normal to salvage ischemic penumbra tissue.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #147.");
  console.log("Skill #147 update completed successfully!");
}

run();
