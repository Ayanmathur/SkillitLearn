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

const skillId = "37c0544c-90e5-4772-800b-4a4c2c7cf9ee";

async function run() {
  console.log("Updating Skill #142: Patient Communication (9 steps across 3 tracks)...");

  // 1. Fetch tracks for this skill
  let { data: tracks, error: tErr } = await supabase
    .from("tracks")
    .select("id, title, order_index")
    .eq("skill_id", skillId)
    .order("order_index");

  if (tErr) {
    console.error("Error fetching tracks:", tErr);
    return;
  }

  // Delete excess tracks if > 3
  if (tracks.length > 3) {
    const extraTrackIds = tracks.slice(3).map(t => t.id);
    await supabase.from("steps").delete().in("track_id", extraTrackIds);
    await supabase.from("tracks").delete().in("id", extraTrackIds);
    tracks = tracks.slice(0, 3);
  }

  // Ensure exactly 3 tracks exist
  while (tracks.length < 3) {
    const { data: newTrack } = await supabase
      .from("tracks")
      .insert({
        skill_id: skillId,
        title: `Track ${tracks.length + 1}: Patient Communication`,
        order_index: tracks.length + 1
      })
      .select()
      .single();
    tracks.push(newTrack);
  }

  tracks.sort((a, b) => a.order_index - b.order_index);

  const track1Id = tracks[0].id;
  const track2Id = tracks[1].id;
  const track3Id = tracks[2].id;

  // Update Track titles
  await supabase.from("tracks").update({ title: "Track 1: Clinical Interview Models, Active Listening and Empathy" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Health Literacy, The Teach-Back Method and Diversity" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: De-Escalation, Delivering Sensitive News and SPIKES" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Healthcare Communication & Patient Experience level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Calgary-Cambridge Framework for Medical Encounters",
      order_index: 1,
      content: `### Structured Clinical Interview Frameworks

1. Calgary-Cambridge Guide:
   - 1. Initiating the encounter (establishing rapport and identifying reasons for consultation).
   - 2. Gathering information (exploring biomedical perspective and patient's illness experience).
   - 3. Providing structure.
   - 4. Building relationships.
   - 5. Explanation and planning.
   - 6. Closing the consultation.`
    },
    {
      track_id: track1Id,
      title: "The PEARLS Model of Clinical Empathy and Rapport",
      order_index: 2,
      content: `### Empathetic Communication Architecture

1. The PEARLS Framework:
   - Partnership (working collaboratively).
   - Empathy (expressing understanding of patient emotions).
   - Apology / Acknowledgment (recognizing delays or distress).
   - Respect (honoring patient choices and dignity).
   - Legitimation (validating patient feelings).
   - Support (pledging continuous care).`
    },
    {
      track_id: track1Id,
      title: "Non-Verbal Attunement, Funneling and Clinical Silence",
      order_index: 3,
      content: `### Non-Verbal Attunement and Information Funneling

1. Question Funneling:
   - Starting with open-ended inquiries ('Tell me what brought you in today') before narrowing to focused closed-ended clarifying questions.

2. Non-Verbal Signals:
   - Maintaining open posture, eye contact, and purposeful clinical silence allowing patients time to formulate thoughts.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Universal Health Literacy Precautions and Plain Language",
      order_index: 1,
      content: `### Plain Language Translation in Patient Education

1. Universal Health Literacy:
   - Assuming all patients may struggle to understand complex medical information.

2. Medical Jargon Translation:
   - Replacing clinical jargon with plain language (e.g. 'high blood pressure' instead of 'hypertension'; 'swelling' instead of 'edema'; 'heart attack' instead of 'myocardial infarction').`
    },
    {
      track_id: track2Id,
      title: "The Teach-Back Method for Patient Safety and Discharge",
      order_index: 2,
      content: `### Interactive Verification of Patient Understanding

1. The Teach-Back Protocol:
   - Asking patients to explain care instructions in their own words: 'To make sure I explained everything clearly, can you tell me how you will take this medication at home?'

2. Shaming Avoidance:
   - Placing the burden of clear communication entirely on the healthcare provider rather than testing the patient.`
    },
    {
      track_id: track2Id,
      title: "Cross-Cultural Communication and The LEARN Model",
      order_index: 3,
      content: `### Culturally Competent Care and Medical Interpreters

1. The LEARN Model:
   - Listen with empathy, Explain your perception, Acknowledge differences, Recommend treatment, Negotiate agreement.

2. Certified Medical Interpreters:
   - Using trained medical interpreters rather than family members to ensure accuracy, patient autonomy, and Title VI Civil Rights Act compliance.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Verbal De-Escalation Protocols and The LAST Model",
      order_index: 1,
      content: `### Crisis Resolution and Agitation Management

1. The LAST Protocol:
   - Listen actively to grievances without interruption.
   - Apologize for the patient's distress or frustration.
   - Solve the actionable issue collaboratively.
   - Thank the patient for sharing feedback.

2. Boundary Setting:
   - Maintaining calm tone and non-threatening stance while enforcing zero-tolerance safety limits.`
    },
    {
      track_id: track3Id,
      title: "Delivering Difficult News: The 6-Step SPIKES Protocol",
      order_index: 2,
      content: `### Oncological and Palliative Communication

1. The SPIKES Protocol:
   - Setting up the private interview.
   - Perception (assessing patient understanding).
   - Invitation (obtaining permission on detail depth).
   - Knowledge (delivering information in clear chunks).
   - Emotions (responding empathetically to tears/silence).
   - Strategy and Summary (outlining clear next steps).`
    },
    {
      track_id: track3Id,
      title: "Trauma-Informed Care and Informed Consent Dialogue",
      order_index: 3,
      content: `### Psychological Safety and Shared Decision-Making

1. Trauma-Informed Principles:
   - Prioritizing physical and emotional safety, trustworthiness, collaboration, and patient empowerment.

2. Informed Consent Communication:
   - Explaining diagnosis, procedural risks, benefits, alternatives, and risks of refusal in language the patient can comprehend prior to obtaining voluntary signatures.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #142.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In clinical patient education and discharge instructions, what is the 'Teach-Back Method'?",
      options: [
        "Asking the patient to explain back the care instructions or medication plan in their own words to verify true understanding",
        "Giving the patient a written medical textbook to read",
        "Asking the patient to teach a class of medical students",
        "Asking the patient if they have any questions and leaving the room"
      ],
      correct_option_index: 0,
      explanation: "Teach-Back asks patients to explain concepts in their own words, verifying comprehension non-punitively.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In plain language healthcare communication, how should the medical term 'Hypertension' be explained to a patient?",
      options: [
        "Extreme mental stress",
        "A hyperactive personality",
        "High blood pressure",
        "Fast breathing"
      ],
      correct_option_index: 2,
      explanation: "Hypertension should be translated to plain language as 'high blood pressure' to avoid patient confusion with emotional tension.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In managing an upset or angry patient in a medical clinic, what does the 'LAST' de-escalation protocol stand for?",
      options: [
        "Leave, Argue, Shout, Threaten",
        "Listen, Apologize, Solve, Thank",
        "Lock, Avoid, Settle, Terminate",
        "Log, Alert, Silence, Transfer"
      ],
      correct_option_index: 1,
      explanation: "LAST stands for Listen to the grievance, Apologize for distress, Solve the issue, and Thank the patient for feedback.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In clinical empathy frameworks, what does the 'PEARLS' model emphasize in clinician-patient relationships?",
      options: [
        "Prescribing expensive jewelry",
        "Polishing medical equipment",
        "Printing paper pamphlets",
        "Partnership, Empathy, Apology/Acknowledgment, Respect, Legitimation, and Support"
      ],
      correct_option_index: 3,
      explanation: "The PEARLS framework structures empathetic clinical interactions through partnership, validation, and support.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "When communicating with a non-English speaking patient, why is using a 'Certified Medical Interpreter' required rather than relying on an adult or child family member?",
      options: [
        "Certified interpreters ensure clinical accuracy, maintain confidentiality, prevent medical translation errors, and protect patient autonomy (complying with Title VI of the Civil Rights Act)",
        "Because family members charge money for translating",
        "Because hospitals cannot allow family members in the room",
        "Translators are only used for written letters"
      ],
      correct_option_index: 0,
      explanation: "Certified medical interpreters ensure accurate clinical vocabulary and patient privacy, avoiding dangerous omissions by family.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In oncology and palliative care, what is the 'SPIKES Protocol' specifically designed for?",
      options: [
        "Administering intravenous injections",
        "Measuring patient blood sugar levels",
        "Treating sports injuries on the field",
        "A structured, 6-step clinical communication protocol for delivering difficult diagnoses, prognosis changes, and breaking bad news to patients and families"
      ],
      correct_option_index: 3,
      explanation: "SPIKES (Setting, Perception, Invitation, Knowledge, Emotions, Strategy) is the standard protocol for delivering bad news.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In the Calgary-Cambridge guide to the medical interview, what is 'Question Funneling'?",
      options: [
        "Pouring liquid medication through a funnel",
        "Beginning an interview with broad, open-ended questions (allowing the patient to describe their illness experience) before progressively narrowing down to focused, closed-ended clarifying questions",
        "Asking 50 yes-or-no questions in 60 seconds",
        "Interviewing 10 patients at the exact same time"
      ],
      correct_option_index: 1,
      explanation: "Question funneling begins broadly with open-ended exploration before narrowing down to specific diagnostic clarifications.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "How should a healthcare provider properly introduce the 'Teach-Back Method' to avoid making the patient feel tested, interrogated, or patronized?",
      options: [
        "Frame the request around the provider's own communication effectiveness (e.g. 'I want to make sure I explained everything clearly; can you tell me in your words how you will take these pills?')",
        "Tell the patient they will receive a grade on their answers",
        "Ask the patient to take a written exam",
        "Tell the patient that people usually forget everything"
      ],
      correct_option_index: 0,
      explanation: "Placing the burden of clarity on the clinician ('I want to ensure I explained clearly') eliminates patient shame and anxiety.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In cross-cultural clinical care, what does the 'LEARN Model' guide clinicians to do?",
      options: [
        "Learn medical school textbooks by memory",
        "Teach patients how to speak English",
        "Listen with empathy, Explain your perception, Acknowledge differences, Recommend treatment, and Negotiate agreement",
        "Leave emergency rooms during night shifts"
      ],
      correct_option_index: 2,
      explanation: "The LEARN model facilitates culturally competent shared decision-making through listening, acknowledging, and negotiating.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In patient communication, what is 'Universal Health Literacy Precautions'?",
      options: [
        "Assuming that all patients have master's degrees in biology",
        "Distributing medical dictionaries to every patient",
        "Refusing to talk to patients without a college degree",
        "Structuring all verbal and written patient communications with the assumption that ANY patient may struggle to understand complex medical terminology, ensuring universal clarity and plain language for everyone"
      ],
      correct_option_index: 3,
      explanation: "Universal precautions approach all communications with plain language, ensuring equitable understanding regardless of background.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In the 'SPIKES Protocol' for breaking bad news, what does the 'E' step ('Emotions and Empathetic Responses') require the clinician to do when a patient cries or goes silent?",
      options: [
        "Immediately leave the room to let them cry alone",
        "Identify and name the patient's emotion, validate their response empathetically (e.g. 'I can see how devastating this news is for you'), and pause with purposeful silence rather than rushing into technical medical data",
        "Tell the patient to stop crying because it makes the doctor uncomfortable",
        "Immediately print a 10-page treatment brochure"
      ],
      correct_option_index: 1,
      explanation: "The 'E' in SPIKES requires naming the emotion, offering validation, and providing empathetic silence before discussing treatment.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In patient-centered medical ethics and communication, what elements are REQUIRED for legally and ethically valid 'Informed Consent' dialogue?",
      options: [
        "Only having the patient sign a blank piece of paper",
        "Telling the patient that surgery is mandatory with zero risks",
        "Explaining the clinical diagnosis, nature/purpose of the proposed procedure, significant potential risks and benefits, reasonable alternative treatments (including doing nothing), and verifying the patient's voluntary, uncoerced comprehension",
        "Informed consent is only required for veterinary surgery"
      ],
      correct_option_index: 2,
      explanation: "Informed consent requires discussing nature, risks, benefits, alternatives, and consequences of refusal with uncoerced comprehension.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Trauma-Informed Care (TIC) clinical communication, what core paradigm shift in healthcare mindset occurs?",
      options: [
        "Shifting from asking 'What is wrong with you?' to asking 'What happened to you?', recognizing that patient behaviors and anxieties are often coping adaptations to past trauma",
        "Treating every patient like an emergency surgery case",
        "Ignoring patient emotional history completely",
        "Requiring patients to undergo psychiatric evaluations before seeing a doctor"
      ],
      correct_option_index: 0,
      explanation: "Trauma-Informed Care shifts focus from 'What is wrong with you?' to 'What happened to you?', fostering trust and psychological safety.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In de-escalating an aggressive, hostile, or verbally abusive patient in a healthcare setting, what non-verbal physical posture should the healthcare worker maintain?",
      options: [
        "Cross arms and glare directly into the patient's eyes",
        "Point fingers directly at the patient's chest",
        "Turn your back and run away screaming",
        "Maintain an open, relaxed posture at a 45-degree angle, keep hands visible and unclenched, maintain eye contact without staring aggressively, and ensure an unobstructed exit path between yourself and the door"
      ],
      correct_option_index: 3,
      explanation: "An open, non-confrontational 45-degree stance with visible hands de-escalates tension while preserving physical safety and exit pathways.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In clinical dialogue, what is 'Empathetic Silence' and how does it benefit high-emotion medical interviews?",
      options: [
        "Refusing to answer any patient questions",
        "A deliberate therapeutic pause where the clinician remains quiet and attentive, giving the patient cognitive processing space to absorb heavy information, process grief, or articulate deep underlying concerns",
        "Turning off the lights in the exam room",
        "Wearing noise-canceling headphones during consultations"
      ],
      correct_option_index: 1,
      explanation: "Empathetic silence provides emotional breathing room, encouraging patients to process grief and articulate complex symptoms without interruption.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #142.");
  console.log("Skill #142 update completed successfully!");
}

run();
