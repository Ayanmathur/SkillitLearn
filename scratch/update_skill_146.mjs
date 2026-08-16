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

const skillId = "41b4da3a-77b5-40d0-a4aa-04ed257fbfe5";

async function run() {
  console.log("Updating Skill #146: Patient Safety & Mobility Support (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Ergonomics, Transfer Mechanics and Assistive Devices" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Fall Risk Assessment, Mitigation and Restraint Safety" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Pressure Injury Staging, Braden Scale and Positioning" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Physical Rehabilitation & Patient Safety Specialist level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Body Mechanics, Center of Gravity and Safe Transfers",
      order_index: 1,
      content: `### Biomechanics and Musculoskeletal Protection

1. Ergonomic Principles:
   - Widening Base of Support (BOS); bending at knees and hips rather than waist; keeping patient load close to the clinician center of gravity.

2. Safe Patient Handling (SPHM):
   - Zero-Lift programs utilizing slide sheets, transfer boards, and mechanical ceiling/Hoyer lifts for non-weight-bearing patients.`
    },
    {
      track_id: track1Id,
      title: "Gait Belts, Mechanical Lifts and Transfer Protocols",
      order_index: 2,
      content: `### Bedside Transfer Execution

1. Gait Belt Application:
   - Fastening snug around patient lumbar waist; using an underhand (supinated) grasp to assist standing and pivot transfers without pulling on arms or axillae.

2. Mechanical Lifts:
   - Inspecting sling weight capacity and positioning straps symmetrically before hoisting dependent patients between bed, wheelchair, and commode.`
    },
    {
      track_id: track1Id,
      title: "Assistive Devices: Walkers, Canes and Crutches Sizing",
      order_index: 3,
      content: `### Ambulation Device Fitting and Mechanics

1. Device Fitting:
   - Sizing walkers and canes so handgrips level with the greater trochanter / wrist crease (20-30 degree elbow flexion).
   - Crutches: Ensuring 2-3 fingerbreadths below axilla to prevent radial nerve crutch palsy.

2. Cane Ambulation:
   - Holding cane on the STRONGER unaffected side, advancing cane simultaneously with the affected weak leg.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Inpatient Fall Risk Scales: Morse, Hendrich II and TUG",
      order_index: 1,
      content: `### Fall Risk Stratification Tools

1. Clinical Risk Scales:
   - Morse Fall Scale (evaluating history of falls, secondary diagnoses, ambulatory aids, IV access, gait, and mental status).
   - Timed Up and Go (TUG test > 12 seconds indicating elevated fall risk).

2. Interventions:
   - Low-rise beds, bed/chair sensor alarms, non-skid footwear, and targeted 1-to-1 safety observation.`
    },
    {
      track_id: track2Id,
      title: "Restraint Minimization, Non-Pharmacological Alternatives",
      order_index: 2,
      content: `### Restraint Reduction and Patient Dignity

1. Restraint Definition:
   - Any physical or chemical method restricting freedom of movement (including 4 side rails up in bed).

2. Least Restrictive Alternatives:
   - Bed alarms, calm redirection, family presence, covering IV sites with tubular netting, and frequent toileting rounds to eliminate restraint need.`
    },
    {
      track_id: track2Id,
      title: "CMS / Joint Commission Restraint Regulatory Mandates",
      order_index: 3,
      content: `### Medicolegal Restraint Governance

1. Physician Orders:
   - Face-to-face physician evaluation required; PRN (as needed) restraint orders strictly prohibited by CMS. Time-limited orders (maximum 4 hours for adults).

2. Mandatory Monitoring:
   - Neurovascular and skin checks every 15-30 minutes; releasing restraints for range of motion, hydration, and toileting at least every 2 hours.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Pathophysiology of Pressure Injuries and Shear Forces",
      order_index: 1,
      content: `### Ischemic Tissue Necrosis and Shear Mechanics

1. Pressure Injury Etiology:
   - Sustained pressure exceeding capillary closing pressure (32 mmHg) over bony prominences (sacrum, trochanter, heels, ischium) producing microvascular ischemia.

2. Shear vs Friction:
   - Shear force distorting deeper muscle tissue when head of bed is elevated > 30 degrees; friction abrading superficial epidermis.`
    },
    {
      track_id: track3Id,
      title: "The Braden Scale for Predicting Pressure Sore Risk",
      order_index: 2,
      content: `### Multidimensional Risk Stratification

1. Braden Subscales:
   - Scoring 6 clinical domains: Sensory Perception, Moisture, Activity, Mobility, Nutrition, and Friction/Shear (scores range from 6 to 23).

2. Risk Thresholds:
   - Scores <= 12 indicate High Risk; scores 15-18 indicate Mild Risk. Scores triggering automatic pressure-relieving mattress deployment and barrier creams.`
    },
    {
      track_id: track3Id,
      title: "NPUAP Pressure Injury Staging and Q2H Turning Schedules",
      order_index: 3,
      content: `### Wound Staging and Offloading Protocols

1. NPUAP Staging:
   - Stage 1: Non-blanchable erythema.
   - Stage 2: Partial-thickness loss with exposed dermis or serum blister.
   - Stage 3: Full-thickness skin loss with adipose visible.
   - Stage 4: Exposed bone, tendon, or muscle.
   - Unstageable: Covered by slough/eschar.

2. Offloading Protocols:
   - Q2H (every 2 hours) turning schedules; 30-degree lateral tilt and floating heels.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #146.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "When assisting an adult patient to ambulate using a single-point or quad cane, on which side should the patient hold the cane?",
      options: [
        "On their STRONGER (unaffected) side, advancing the cane simultaneously with the weaker affected leg",
        "On their weaker injured side",
        "In both hands simultaneously",
        "Behind their back"
      ],
      correct_option_index: 0,
      explanation: "Canes are always held on the stronger unaffected side to widen the base of support and offload the weak limb.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "How often should an immobile, bedbound patient be repositioned (turned) to prevent pressure injuries (decubitus ulcers)?",
      options: [
        "Once every 24 hours",
        "Only when the patient asks",
        "At least every 2 hours (Q2H turning schedule)",
        "Once a week"
      ],
      correct_option_index: 2,
      explanation: "Q2H (every 2 hours) turning is the universal standard to relieve capillary closing pressure over bony prominences.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What is the proper grip when holding a patient's 'Gait Belt' during transfer or ambulation?",
      options: [
        "Holding the belt with one finger loosely",
        "An underhand (supinated) upward grasp around the belt near the patient's lumbar spine",
        "Grabbing the patient's shoulder",
        "Pulling on the patient's arms"
      ],
      correct_option_index: 1,
      explanation: "An underhand (supinated) grasp provides maximum mechanical control and stability without slipping.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In the NPUAP pressure injury classification system, what defines a 'Stage 1' pressure injury?",
      options: [
        "A bone sticking out through the skin",
        "A deep bleeding cut",
        "A wound covered in black dead tissue",
        "Intact skin with a localized area of persistent, non-blanchable erythema (redness that does not turn white when pressed)"
      ],
      correct_option_index: 3,
      explanation: "Stage 1 is characterized by intact skin exhibiting persistent, non-blanchable erythema over a bony prominence.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "When adjusting axillary crutches for a patient, how much space must exist between the crutch pad top and the patient's axilla (armpit)?",
      options: [
        "2 to 3 fingerbreadths (approximately 1 to 1.5 inches) below the axilla to prevent pressure injury to the radial nerve (crutch palsy)",
        "Zero space (crutches should jam tightly into armpits)",
        "12 inches of space",
        "Crutches should touch the chin"
      ],
      correct_option_index: 0,
      explanation: "A 2-3 fingerbreadth axillary gap prevents body weight resting on the armpits, avoiding radial nerve palsy.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "Under CMS and Joint Commission hospital regulations, which statement regarding physician orders for physical restraints is TRUE?",
      options: [
        "Nurses can write PRN (as needed) restraint orders anytime",
        "Restraints can be ordered for a full month in advance",
        "Restraint orders never expire",
        "PRN (as needed) restraint orders are STRICTLY PROHIBITED; restraints require a face-to-face physician evaluation and a time-limited order (maximum 4 hours for adults)"
      ],
      correct_option_index: 3,
      explanation: "PRN restraint orders are illegal under CMS guidelines; orders must be time-limited (max 4 hrs) with face-to-face evaluation.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In the 'Braden Scale for Predicting Pressure Sore Risk' (scored 6 to 23), what does a LOWER score indicate?",
      options: [
        "The patient is completely healthy with zero risk",
        "A LOWER numerical score indicates a HIGHER risk of developing pressure injuries (e.g. a score of 12 or below indicates high risk)",
        "The patient has a fever",
        "The patient can run a marathon"
      ],
      correct_option_index: 1,
      explanation: "In the Braden Scale, lower scores indicate severe sensory/mobility impairment, reflecting a significantly higher ulcer risk.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In ergonomic body mechanics, how should a healthcare worker position their body when lifting or moving a heavy object or assisting a patient?",
      options: [
        "Maintain a wide base of support, bend at the knees and hips, keep the back straight, and keep the load close to the body's center of gravity",
        "Keep legs completely straight and bend deeply at the waist",
        "Twist the spine vigorously while lifting",
        "Lift entirely with back muscles"
      ],
      correct_option_index: 0,
      explanation: "A wide base of support, bent knees/hips, straight spine, and close center-of-gravity load prevent lumbar disc herniation.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In hospital fall prevention, what is evaluated during the 'Timed Up and Go' (TUG) test?",
      options: [
        "How long a patient can hold their breath",
        "How fast a patient can run 100 meters",
        "The time it takes a patient to stand up from an armchair, walk 3 meters (10 feet), turn around, walk back, and sit down (scores > 12 seconds indicate high fall risk)",
        "How fast a patient can eat dinner"
      ],
      correct_option_index: 2,
      explanation: "The TUG test measures functional mobility; taking >12 seconds indicates impaired balance and elevated fall risk.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In bedside positioning protocols, why is the '30-degree Lateral Tilt' position recommended over a full 90-degree side-lying position?",
      options: [
        "Because 90 degrees makes the bed too narrow",
        "To help the patient watch television",
        "Because nurses are not allowed to turn patients 90 degrees",
        "A 30-degree tilt avoids placing direct, crushing body weight on the greater trochanter of the femur and the sacrum, protecting vulnerable bony prominences from pressure necrosis"
      ],
      correct_option_index: 3,
      explanation: "A 30-degree tilt distributes weight across the gluteal muscle mass while avoiding direct pressure on the greater trochanter.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In pressure injury staging, how is an 'Unstageable' pressure injury defined by the NPUAP?",
      options: [
        "A minor sunburn on the shoulders",
        "Full-thickness tissue loss in which the actual depth of the wound bed is completely obscured by slough (yellow, tan, gray) or eschar (black/brown necrotic tissue), preventing direct visualization of the true base",
        "A wound that heals in less than 24 hours",
        "A surgical incision that was closed with staples"
      ],
      correct_option_index: 1,
      explanation: "Unstageable wounds cannot be accurately staged until slough/eschar is debrided to expose whether Stage 3 or 4 tissue depth exists.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In healthcare restraint safety governance, what mandatory clinical assessments MUST be performed and documented while a patient is in physical restraints?",
      options: [
        "Checking room temperature once per shift",
        "Taking a photo of the patient every hour",
        "Continuous monitoring with neurovascular, skin integrity, and circulation checks (pulse, temperature, capillary refill) every 15-30 minutes, and releasing restraints for range of motion, hydration, and toileting at least every 2 hours",
        "Restraints do not require any monitoring once locked"
      ],
      correct_option_index: 2,
      explanation: "Mandatory restraint governance requires neurovascular checks every 15-30 mins and full release for ROM/hygiene every 2 hours.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In patient bed positioning, why does elevating the head of the bed (HOB) GREATER than 30 degrees significantly increase the risk of deep sacral tissue breakdown?",
      options: [
        "It causes severe 'Shear Force': gravity pulls the patient's skeleton downward toward the foot of the bed while the sacral skin remains stationary against the mattress, stretching and tearing deep perforating blood vessels",
        "It makes the mattress too warm",
        "It prevents the patient from breathing normally",
        "It stops blood from flowing to the brain"
      ],
      correct_option_index: 0,
      explanation: "Elevating HOB >30 deg induces gravity shear, twisting and thrombosing deep microvascular blood vessels in the sacral fascia.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In clinical wound evaluation, what is a 'Deep Tissue Pressure Injury' (DTPI)?",
      options: [
        "A simple mosquito bite",
        "A surface abrasion caused by scratching",
        "A wound with clean pink granulation tissue",
        "Intact or non-intact skin with localized, persistent non-blanchable deep red, maroon, or purple discoloration, or blood-filled blister, resulting from intense pressure/shear injury at the bone-muscle interface"
      ],
      correct_option_index: 3,
      explanation: "DTPI manifests as deep purple/maroon intact skin or blood blister, reflecting severe underlying muscle ischemia beneath the dermis.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "What is the clinical definition of a 'Restraint' under Joint Commission standards regarding hospital bed side rails?",
      options: [
        "Side rails are never considered restraints",
        "Raising all FOUR side rails up on a bed when the patient is cognitively or physically unable to lower them independently to exit the bed is legally and clinically defined as a physical restraint",
        "Raising two upper side rails",
        "Lowering the bed to the floor"
      ],
      correct_option_index: 1,
      explanation: "Raising all 4 side rails prevents intentional egress; if the patient cannot lower them freely, it is legally a restraint.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #146.");
  console.log("Skill #146 update completed successfully!");
}

run();
