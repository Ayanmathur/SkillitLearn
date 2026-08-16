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

const skillId = "215591b0-5ff3-414c-ad84-5fd8e7b7d55b";

async function run() {
  console.log("Updating Skill #145: Infection Control (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Chain of Infection, Standard Precautions and Hand Hygiene" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Transmission Precautions, PPE Protocols and Isolation" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: HAIs, Spaulding Classification and Sharps Safety" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Certified Infection Control CIC & Hospital Epidemiologist level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Six Links in the Chain of Infection and Interventions",
      order_index: 1,
      content: `### Epidemiological Cycle and Transmission Dynamics

1. Chain of Infection:
   - 1. Infectious Agent (bacteria, viruses, fungi, prions).
   - 2. Reservoir (humans, water, equipment).
   - 3. Portal of Exit (respiratory tract, blood, feces).
   - 4. Mode of Transmission (contact, droplet, airborne).
   - 5. Portal of Entry (non-intact skin, mucous membranes, catheters).
   - 6. Susceptible Host. Breaking any single link halts transmission.`
    },
    {
      track_id: track1Id,
      title: "WHO '5 Moments for Hand Hygiene' and Antiseptic Efficacy",
      order_index: 2,
      content: `### Hand Hygiene Science and Clinical Compliance

1. WHO 5 Moments:
   - 1. Before touching a patient; 2. Before clean/aseptic procedures; 3. After body fluid exposure risk; 4. After touching a patient; 5. After touching patient surroundings.

2. Alcohol-Based Rubs vs Soap:
   - Alcohol-Based Hand Rub (ABHR 60-95% alcohol for 20 seconds) for standard sanitizing; mechanical Soap and Water friction (20 seconds) mandatory for visible dirt and spore-forming pathogens.`
    },
    {
      track_id: track1Id,
      title: "Clostridioides difficile Endospores and Soap-Water Mandate",
      order_index: 3,
      content: `### Bacterial Endospores and Alcohol Inactivation Failure

1. Spore-Forming Pathogens (C. difficile):
   - Bacterial endospores possess a resilient protein coat impervious to alcohol-based hand sanitizers.

2. Physical Decontamination:
   - Hand hygiene for C. diff cases strictly requires friction washing with antimicrobial soap and warm running water to physically rinse endospores down the drain, paired with bleach-based surface disinfection.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Contact, Droplet and Airborne Isolation Precautions",
      order_index: 1,
      content: `### Tier-Two Transmission-Based Precautions

1. Contact Precautions (MRSA, VRE, C. diff):
   - Gown and gloves upon room entry; dedicated single-patient equipment.

2. Droplet Precautions (Influenza, Pertussis, RSV):
   - Surgical mask and eye protection within 6 feet.

3. Airborne Precautions (Tuberculosis, Measles, Varicella):
   - Negative-pressure AIIR room (>=12 air changes/hour) and fit-tested N95 / PAPR respirator.`
    },
    {
      track_id: track2Id,
      title: "CDC PPE Donning and Doffing Protocols and Cross-Contamination",
      order_index: 2,
      content: `### Personal Protective Equipment (PPE) Sequences

1. Donning Sequence:
   - Gown -> Mask or N95 Respirator -> Goggles / Face Shield -> Gloves (pulled over gown cuffs).

2. Doffing Sequence (Highest Contamination Risk):
   - Gloves -> Goggles/Shield -> Gown -> Mask (removed outside isolation room after door closure), performing hand hygiene immediately after glove removal and upon completion.`
    },
    {
      track_id: track2Id,
      title: "Airborne Infection Isolation Rooms (AIIR) and HEPA Filtration",
      order_index: 3,
      content: `### Negative-Pressure Engineering and Airflow Control

1. AIIR Specifications:
   - Maintaining continuous negative air pressure relative to surrounding corridors (preventing airborne nuclei escape).

2. Air Exchange Standards:
   - Minimum 12 Air Changes per Hour (ACH) for new healthcare construction; exhaust air filtered through High-Efficiency Particulate Air (HEPA) filters before outdoor venting.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Preventing Device-Associated HAIs: CLABSI, CAUTI and VAP",
      order_index: 1,
      content: `### Healthcare-Associated Infection Bundles

1. CLABSI & CAUTI Prevention:
   - Central line insertion bundles (chlorhexidine skin prep, full-body sterile drapes); urinary catheter maintenance (dependent drainage bag below bladder level, daily necessity audits).

2. VAP Prevention:
   - Elevating head of bed 30-45 degrees, subglottic suctioning, and daily sedation vacations to reduce ventilator duration.`
    },
    {
      track_id: track3Id,
      title: "Spaulding Classification: Critical, Semi-Critical and Non-Critical",
      order_index: 2,
      content: `### Instrument Processing and Disinfection Hierarchy

1. Critical Items (surgical instruments, vascular catheters):
   - Enter sterile body cavities; require Steam Autoclave Sterilization (121C/134C) or chemical gas plasma.

2. Semi-Critical (endoscopes, respiratory tubes):
   - Contact mucous membranes; require High-Level Disinfection (HLD).

3. Non-Critical (BP cuffs, stethoscopes):
   - Contact intact skin; require low/intermediate disinfection.`
    },
    {
      track_id: track3Id,
      title: "OSHA Bloodborne Pathogens, Needle Safety and Post-Exposure (PEP)",
      order_index: 3,
      content: `### Sharps Governance and Needlestick Management

1. OSHA Sharps Standards:
   - Never recapping needles manually; activating engineered safety shields immediately and disposing in puncture-resistant biohazard sharps containers.

2. Post-Exposure Prophylaxis (PEP):
   - Immediate wound washing with soap and water; reporting occupational bloodborne exposure immediately for baseline testing and initiation of HIV/HBV PEP within 2 to 72 hours.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #145.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "Why is alcohol-based hand sanitizer INEFFECTIVE for hand hygiene after caring for a patient with active *Clostridioides difficile* (*C. diff*) diarrhea?",
      options: [
        "Because hand sanitizer is too cold",
        "*C. diff* produces resilient bacterial endospores that have a protective protein shell impervious to alcohol; clinicians MUST wash hands with soap and running water to physically rinse spores away",
        "Because alcohol attracts C. diff bacteria",
        "Hand sanitizer only works on viruses"
      ],
      correct_option_index: 1,
      explanation: "C. diff endospores resist alcohol breakdown; mechanical friction with soap and water is mandatory to physically remove spores.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "According to the World Health Organization (WHO), what is the minimum duration healthcare workers should scrub hands with soap and water?",
      options: [
        "2 seconds",
        "5 minutes",
        "1 hour",
        "At least 20 seconds of vigorous mechanical friction covering all hand surfaces"
      ],
      correct_option_index: 3,
      explanation: "WHO and CDC mandate at least 20 seconds of mechanical friction when washing hands with soap and water.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "Under OSHA Bloodborne Pathogens regulations, what is the golden rule regarding used hypodermic needles?",
      options: [
        "NEVER manually recap used needles; engage safety shields immediately and discard directly into a rigid, puncture-resistant biohazard sharps container",
        "Always recap needles with both hands",
        "Throw used needles into ordinary trash cans",
        "Wash and reuse needles to save money"
      ],
      correct_option_index: 0,
      explanation: "Recapping needles is prohibited under OSHA; safety devices must be deployed immediately into puncture-resistant sharps boxes.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "Which type of Transmission-Based Isolation Precautions requires an Airborne Infection Isolation Room (AIIR) with negative air pressure and fit-tested N95 respirators?",
      options: [
        "Standard Precautions",
        "Contact Precautions",
        "Airborne Precautions (e.g. for active pulmonary Tuberculosis, Measles, Varicella)",
        "Droplet Precautions"
      ],
      correct_option_index: 2,
      explanation: "Airborne precautions protect against microscopic aerosol nuclei via negative-pressure AIIR rooms and N95 respirators.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In the Chain of Infection, what is a 'Reservoir'?",
      options: [
        "A swimming pool at the hospital",
        "The natural habitat or environment (such as humans, animals, equipment, or water) where an infectious pathogen lives, thrives, and multiplies",
        "A sterile bandage",
        "A prescription medication"
      ],
      correct_option_index: 1,
      explanation: "A reservoir is the primary host or environmental medium where infectious microorganisms reside and multiply.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In the Spaulding Classification system for medical equipment reprocessing, how are 'Critical Items' (such as surgical scalpels, cardiac catheters, and biopsy forceps) categorized and processed?",
      options: [
        "Wiped with a paper towel",
        "Rinsed with warm tap water only",
        "Items that enter normally sterile human tissues or the vascular system; they MUST undergo complete Sterilization (e.g. Steam Autoclave, Ethylene Oxide, Gas Plasma) to destroy all viable microbial life including bacterial spores",
        "Sprayed with room deodorizer"
      ],
      correct_option_index: 2,
      explanation: "Critical items penetrate sterile tissue/vascular systems, requiring full sterilization (destroying all microbes and spores).",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "According to the CDC, what is the proper sequence for DOFFING (removing) Personal Protective Equipment (PPE) to prevent self-contamination?",
      options: [
        "Gloves -> Goggles/Face Shield -> Gown -> Mask or N95 Respirator (removed outside the patient room after closing door)",
        "Mask -> Gown -> Gloves -> Goggles",
        "Gown -> Mask -> Goggles -> Gloves",
        "Remove all items simultaneously in one pull"
      ],
      correct_option_index: 0,
      explanation: "Gloves are removed first (most contaminated), followed by eye protection, gown, and finally the mask outside the isolation room.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In healthcare quality and patient safety, what are the core components of the evidence-based bundle to prevent 'Catheter-Associated Urinary Tract Infections' (CAUTI)?",
      options: [
        "Leaving catheters in place indefinitely",
        "Emptying drainage bags only once per week",
        "Giving prophylactic antibiotics to all patients",
        "Inserting catheters only for valid clinical indications using strict aseptic technique, maintaining a closed sterile system, keeping drainage bags below bladder level to prevent backflow, and removing catheters promptly"
      ],
      correct_option_index: 3,
      explanation: "CAUTI bundles require aseptic insertion, continuous dependent drainage below bladder level, and daily necessity reviews for prompt removal.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What technical engineering requirements define an 'Airborne Infection Isolation Room' (AIIR)?",
      options: [
        "A room with open windows facing a courtyard",
        "Continuous negative air pressure relative to adjacent corridors (preventing airborne nuclei escape), a minimum of 12 Air Changes per Hour (ACH), and air exhausted directly outdoors or through HEPA filters",
        "Positive pressure air blowing out into the hallway",
        "A room with double-pane glass only"
      ],
      correct_option_index: 1,
      explanation: "AIIR rooms maintain negative pressure relative to hallways, >=12 air changes/hour, and HEPA-filtered or direct outdoor exhaust.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What is the difference between 'Droplet Precautions' and 'Airborne Precautions' regarding pathogen transmission physics?",
      options: [
        "Droplets travel around the world in airplane ventilation",
        "Airborne pathogens are only spread by physical touch",
        "Droplet transmission involves large respiratory particles (>5 microns) that travel short distances (within 6 feet / 2m) before falling to surfaces; Airborne transmission involves microscopic droplet nuclei (<5 microns) that remain suspended in ambient air currents for hours and travel long distances",
        "There is zero physical difference between them"
      ],
      correct_option_index: 2,
      explanation: "Droplets are heavy (>5 um) and settle within 6 feet; airborne nuclei are light (<5 um), aerosolize, and linger in air currents.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In occupational bloodborne pathogen exposure management, what immediate protocol MUST a healthcare worker follow following a contaminated needlestick injury?",
      options: [
        "Immediately wash the puncture site with soap and water (or flush mucous membranes with saline), report the exposure immediately to occupational health, obtain source patient viral status, and initiate Post-Exposure Prophylaxis (PEP) within 2 to 72 hours if indicated",
        "Squeeze the wound until it turns purple and apply superglue",
        "Hide the needle and continue working without reporting",
        "Wait 6 months before having a blood test"
      ],
      correct_option_index: 0,
      explanation: "Immediate soap/water washing, prompt reporting, source testing, and rapid PEP initiation (within 2-72 hours) are mandatory.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In the Spaulding Classification, what defines a 'Semi-Critical Item' (e.g. flexible gastrointestinal endoscopes, endotracheal tubes) and what level of reprocessing is required?",
      options: [
        "Items that touch intact skin only; require low-level alcohol wipes",
        "Items that are thrown away after one use without cleaning",
        "Items that enter the bloodstream; require autoclaving",
        "Items that come into contact with mucous membranes or non-intact skin; they require High-Level Disinfection (HLD) using chemical sterilants (e.g. glutaraldehyde, ortho-phthalaldehyde) to destroy all vegetative bacteria, fungi, and lipid/non-lipid viruses"
      ],
      correct_option_index: 3,
      explanation: "Semi-critical items touch mucous membranes, requiring High-Level Disinfection (HLD) to destroy all vegetative pathogens and viruses.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In intensive care infection prevention, what evidence-based clinical bundle is proven to eliminate 'Central Line-Associated Bloodstream Infections' (CLABSI)?",
      options: [
        "Inserting central lines in emergency hallways without gloves",
        "Hand hygiene, full-body sterile barrier drapes during insertion, chlorhexidine skin antisepsis with complete air drying, avoiding the femoral vein site, and daily line necessity audits with immediate removal of unneeded lines",
        "Changing the central line catheter every 24 hours",
        "Covering the line insertion site with wet cloth"
      ],
      correct_option_index: 1,
      explanation: "CLABSI insertion bundles include chlorhexidine prep, maximal sterile drapes, subclavian/jugular site selection, and prompt removal.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In WHO Hand Hygiene standards, what are the '5 Moments for Hand Hygiene' in clinical practice?",
      options: [
        "Morning, Noon, Evening, Midnight, Bedtime",
        "Before eating, After eating, Before sleeping, After sleeping, During breaks",
        "1. Before touching a patient; 2. Before a clean/aseptic procedure; 3. After body fluid exposure risk; 4. After touching a patient; 5. After touching patient surroundings",
        "When arriving at work, at lunch, and when going home"
      ],
      correct_option_index: 2,
      explanation: "The WHO 5 Moments define the precise clinical junctures where hand transmission occurs in the patient zone.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In hospital environmental cleaning, why is 'Contact Time' (Dwell Time) of chemical disinfectants critical for destroying multi-drug resistant organisms (MDROs like MRSA and VRE)?",
      options: [
        "The chemical disinfectant MUST remain visibly wet on the hard surface for the full manufacturer-specified duration (e.g. 1 to 4 minutes); wiping the surface dry prematurely leaves active pathogens alive and able to transmit",
        "Contact time refers to how long a patient talks to the cleaner",
        "Disinfectants work in 0.1 seconds regardless of wetness",
        "Contact time is only important for floor wax"
      ],
      correct_option_index: 0,
      explanation: "Disinfectants require surfaces to remain visibly wet for the full contact dwell time to achieve laboratory-tested microbial kill rates.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #145.");
  console.log("Skill #145 update completed successfully!");
}

run();
