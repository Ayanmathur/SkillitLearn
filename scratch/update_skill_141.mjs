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

const skillId = "d958b2cb-ab9e-4342-b924-dd76627c4fb6";

async function run() {
  console.log("Updating Skill #141: Medical Terminology (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Etymological Word Architecture: Roots, Prefixes and Suffixes" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Organ System Clinical Lexicon and Pathologies" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Anatomical Orientations, Planes and JCAHO Abbreviations" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Clinical Anatomy & Medical Education level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Word Roots, Combining Forms and The Linking 'O' Rule",
      order_index: 1,
      content: `### Morphological Foundations of Clinical Terms

1. Word Architecture:
   - Word Root: Core anatomical meaning (e.g. cardi/o heart, nephr/o kidney, hepat/o liver, gastr/o stomach, encephal/o brain).

2. Combining Vowel Rule:
   - The combining vowel 'o' is retained when connecting a root to a suffix beginning with a consonant (e.g. cardi-o-megaly); dropped when the suffix begins with a vowel (e.g. gastr-itis).`
    },
    {
      track_id: track1Id,
      title: "Diagnostic, Pathological and Quantitative Prefixes",
      order_index: 2,
      content: `### Positional, Temporal and Rate Modifiers

1. Rate and Volume:
   - tachy- (abnormally fast) vs brady- (abnormally slow).
   - hyper- (excessive/elevated) vs hypo- (deficient/low).
   - poly- (copious/many) vs oligo- (scanty/few).

2. Spatial and Descriptive:
   - dys- (painful/abnormal), a-/an- (absence of), peri- (surrounding), endo- (within), epi- (upon/above).`
    },
    {
      track_id: track1Id,
      title: "Surgical, Diagnostic and Symptomatic Suffixes",
      order_index: 3,
      content: `### Procedural Actions and Disease Endings

1. Surgical Suffixes:
   - -ectomy (surgical excision/removal), -otomy (surgical incision/cutting into), -ostomy (creation of an artificial stoma opening), -plasty (surgical repair/reconstruction).

2. Pathological Suffixes:
   - -itis (inflammation), -rrhea (profuse flow/discharge), -rrhagia (hemorrhage/bursting forth), -stenosis (narrowing), -malacia (softening), -megaly (enlargement).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Cardiovascular, Hematologic and Respiratory Lexicons",
      order_index: 1,
      content: `### Cardiopulmonary Pathologies and Terminology

1. Cardiovascular & Blood:
   - Myocardial Infarction (ischemic necrosis of heart muscle), Arteriosclerosis (hardening of arterial walls), Arrhythmia (irregular rhythm), Endocarditis.

2. Respiratory:
   - Dyspnea (labored breathing), Atelectasis (alveolar lung collapse), Hemoptysis (coughing up blood), Pneumothorax (air within pleural cavity).`
    },
    {
      track_id: track2Id,
      title: "Gastrointestinal, Hepatic and Renal Clinical Terms",
      order_index: 2,
      content: `### Digestive, Liver and Urological Conditions

1. GI and Hepatobiliary:
   - Cholecystitis (gallbladder inflammation), Cirrhosis (chronic hepatic fibrosis), Dysphagia (difficulty swallowing), Hematemesis (vomiting blood).

2. Renal:
   - Nephrolithiasis (renal calculi/kidney stones), Oliguria (abnormally low urine output <400mL/day), Glomerulonephritis (inflammation of renal capillary filters).`
    },
    {
      track_id: track2Id,
      title: "Musculoskeletal, Neurological and Endocrine Systems",
      order_index: 3,
      content: `### Orthopedic, Neural and Hormonal Pathology

1. Musculoskeletal & Nervous:
   - Osteoarthritis (degenerative joint disease), Spondylolisthesis, Myasthenia (muscle weakness), Encephalopathy (brain disease), Cerebrovascular Accident (CVA / stroke).

2. Endocrine:
   - Diabetic Ketoacidosis (DKA), Hyperthyroidism (elevated thyroid hormone), Hypoglycemia.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Cardinal Body Planes: Sagittal, Coronal and Transverse",
      order_index: 1,
      content: `### Spatial Sectioning and Anatomical Planes

1. Cardinal Sectioning Planes:
   - Sagittal / Midsagittal Plane: Bisects the body into unequal or equal left and right halves.
   - Coronal / Frontal Plane: Divides the body into anterior (front) and posterior (back) sections.
   - Transverse / Axial Plane: Divides the body horizontally into superior (upper) and inferior (lower) portions.`
    },
    {
      track_id: track3Id,
      title: "Directional Vectors, Relative Proximity and Patient Positions",
      order_index: 2,
      content: `### Directional Vectors and Bedside Postures

1. Directional Vectors:
   - Proximal (closer to trunk origin) vs Distal (farther from trunk along an extremity).
   - Medial (toward midline) vs Lateral (away from midline).
   - Anterior/Ventral vs Posterior/Dorsal.

2. Clinical Positions:
   - Supine (lying flat on back, face up) vs Prone (lying face down) vs Fowler's Position (semi-upright sitting at 45-60 degrees).`
    },
    {
      track_id: track3Id,
      title: "Clinical Abbreviations and The JCAHO 'Do Not Use' List",
      order_index: 3,
      content: `### Patient Safety and High-Risk Abbreviations

1. Standard Clinical Abbreviations:
   - NPO (nil per os / nothing by mouth), PRN (pro re nata / as needed), STAT (immediately), PO (by mouth).

2. Joint Commission (JCAHO) 'Do Not Use' List:
   - Prohibiting 'U' (write 'unit'), 'IU' (write 'International Unit'), 'Q.D.' (write 'daily'), trailing zeros ('5.0 mg' is prohibited; write '5 mg'), and lack of leading zeros ('.5 mg' is prohibited; write '0.5 mg').`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #141.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In medical terminology, what does the prefix 'brady-' indicate (such as in 'bradycardia')?",
      options: [
        "Abnormally slow",
        "Abnormally fast",
        "Extremely loud",
        "Painful"
      ],
      correct_option_index: 0,
      explanation: "The prefix 'brady-' means slow (bradycardia = heart rate < 60 bpm; tachy- means fast).",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What surgical suffix denotes the complete surgical removal or excision of an organ (such as in 'appendectomy' or 'cholecystectomy')?",
      options: [
        "-itis",
        "-otomy",
        "-ectomy",
        "-scopy"
      ],
      correct_option_index: 2,
      explanation: "The suffix -ectomy denotes surgical excision/removal of an anatomical structure.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In clinical abbreviation standards, what does the Latin medical abbreviation 'NPO' (*nil per os*) mandate for a patient?",
      options: [
        "Normal blood pressure",
        "Nothing by mouth (no food or liquids permitted)",
        "Patient may leave the hospital",
        "New patient orientation"
      ],
      correct_option_index: 1,
      explanation: "NPO stands for nil per os (nothing by mouth), standard before surgeries to prevent pulmonary aspiration.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In anatomical directional terminology, what does the term 'Distal' describe when referring to a limb?",
      options: [
        "Located inside the brain",
        "Closest to the midline of the body",
        "Above the head",
        "Farther away from the point of attachment to the body trunk (e.g. the fingers are distal to the elbow)"
      ],
      correct_option_index: 3,
      explanation: "Distal means farther from the trunk/point of attachment (proximal means closer to the trunk).",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In pulmonary clinical terminology, what does 'Dyspnea' define?",
      options: [
        "Difficult, painful, or labored breathing / shortness of breath",
        "Rapid heart rate",
        "Coughing up stomach acid",
        "Complete loss of voice"
      ],
      correct_option_index: 0,
      explanation: "Dyspnea is the clinical term for difficult, labored breathing or shortness of breath (dys- = difficult, -pnea = breathing).",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In anatomical sectioning, which cardinal body plane divides the body vertically into Anterior (front) and Posterior (back) portions?",
      options: [
        "Transverse (Axial) Plane",
        "Midsagittal Plane",
        "Oblique Plane",
        "Coronal (Frontal) Plane"
      ],
      correct_option_index: 3,
      explanation: "The Coronal (Frontal) plane bisects the body vertically into anterior/ventral and posterior/dorsal halves.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In medical word building rules, when is the combining vowel 'o' retained versus dropped when connecting a word root to a suffix?",
      options: [
        "The combining vowel is never used in medicine",
        "The 'o' is RETAINED when the suffix begins with a consonant (e.g. cardi-o-megaly); it is DROPPED when the suffix begins with a vowel (e.g. gastr-itis)",
        "The 'o' is only used for female patients",
        "The 'o' is added randomly based on hospital preference"
      ],
      correct_option_index: 1,
      explanation: "The combining vowel 'o' links roots to consonant-starting suffixes (cardiomegaly) and is omitted before vowel suffixes (gastritis).",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In surgical terminology, what is the critical technical distinction between an '-otomy' and an '-ostomy'?",
      options: [
        "An '-otomy' is a temporary surgical incision/cutting into an organ (e.g. laparotomy); an '-ostomy' creates a permanent or semi-permanent artificial stoma opening to the body surface (e.g. colostomy)",
        "An '-otomy' removes an organ; an '-ostomy' repairs an organ",
        "An '-ostomy' is used only on bones",
        "There is zero difference between them"
      ],
      correct_option_index: 0,
      explanation: "-otomy means to cut into/incise; -ostomy means to create a surgical mouth or stoma opening to the exterior.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In gastrointestinal and renal clinical vocabulary, what condition does 'Nephrolithiasis' describe?",
      options: [
        "Inflammation of the liver",
        "Hardening of the heart arteries",
        "The presence of calculi (kidney stones) formed in the renal pelvis and kidney tubules",
        "Ulceration of the stomach lining"
      ],
      correct_option_index: 2,
      explanation: "Nephrolithiasis (nephr/o = kidney, lith/o = stone, -iasis = condition) defines the formation of kidney stones.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In clinical patient positioning, what distinguishes 'Fowler\'s Position' from 'Supine' position?",
      options: [
        "Fowler's position places the patient face down on their stomach",
        "Fowler's position hangs the patient upside down",
        "Supine means standing upright on two feet",
        "Fowler's position elevates the head of the bed to a semi-sitting angle of 45 to 60 degrees to facilitate lung expansion and breathing; Supine positions the patient lying completely flat on their back"
      ],
      correct_option_index: 3,
      explanation: "Fowler's position props the head of bed at 45-60 degrees to ease respiratory distress; Supine is flat on the back.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In Joint Commission (JCAHO) patient safety medication standards, why is writing a trailing zero (such as '5.0 mg') strictly prohibited on the 'Do Not Use' list?",
      options: [
        "Because zero is not a valid number in pharmacology",
        "If the decimal point is missed or blurred during printing or faxing, '5.0 mg' will be misread as '50 mg', delivering a catastrophic 10-fold medication overdose (clinicians must write '5 mg')",
        "Because trailing zeros use too much printer ink",
        "Trailing zeros are only prohibited in veterinary medicine"
      ],
      correct_option_index: 1,
      explanation: "A trailing zero ('5.0 mg') risks a 10x overdose if the decimal is overlooked; JCAHO mandates '5 mg' without trailing zeros.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In pulmonary pathology, what is the clinical difference between 'Hemoptysis' and 'Hematemesis'?",
      options: [
        "Hemoptysis is bleeding from the ear; Hematemesis is bleeding from the nose",
        "Both terms describe identical brain hemorrhages",
        "Hemoptysis is coughing up bright red blood originating from the respiratory tract or lungs; Hematemesis is vomiting dark 'coffee-ground' or red blood originating from the gastrointestinal tract",
        "Hemoptysis is blood in the urine"
      ],
      correct_option_index: 2,
      explanation: "Hemoptysis is expectorating/coughing blood from lungs; Hematemesis is vomiting blood from the upper GI tract.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In JCAHO medication safety guidelines, why is the abbreviation 'U' (for Unit) placed on the mandatory 'Do Not Use' list?",
      options: [
        "When handwritten in clinical charts, 'U' is frequently misread as the number '0' (zero) or the number '4', turning a 5 Unit insulin order into a fatal 50 or 54 Unit overdose (clinicians must write out 'unit')",
        "Because 'U' is trademarked by university hospitals",
        "Because 'U' stands for unknown dosage",
        "'U' is only banned on prescription bottles"
      ],
      correct_option_index: 0,
      explanation: "Handwritten 'U' easily resembles '0' or '4', risking deadly 10-fold insulin overdoses; 'unit' must be written in full.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In pulmonary pathophysiology, what is 'Atelectasis'?",
      options: [
        "An infection of the vocal cords",
        "Hyper-inflation of the lung alveoli",
        "A severe allergic skin rash",
        "The partial or complete collapse of pulmonary alveoli and lung tissue resulting in impaired gas exchange, commonly occurring post-operatively due to shallow anesthesia breathing"
      ],
      correct_option_index: 3,
      explanation: "Atelectasis (atel/o = incomplete, -ectasis = expansion) is the collapse of alveolar air sacs, preventing normal gas exchange.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In orthopedic terminology, what is 'Spondylolisthesis'?",
      options: [
        "Inflammation of the knee cartilage",
        "The forward displacement and slipping of one vertebral body over the vertebra directly below it in the spinal column (most commonly at L4-L5 or L5-S1)",
        "The surgical replacement of a hip joint",
        "A fracture of the collarbone"
      ],
      correct_option_index: 1,
      explanation: "Spondylolisthesis (spondyl/o = vertebra, -listhesis = slipping) is the forward subluxation/slipping of one vertebra over another.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #141.");
  console.log("Skill #141 update completed successfully!");
}

run();
