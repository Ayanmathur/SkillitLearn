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

const skillId = "179825b3-6434-4c32-b8d3-d04ea2319933";

async function run() {
  console.log("Updating Skill #143: Health Records Management (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: EHR/EMR Architectures, Standards and Interoperability" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: HIPAA Privacy, Security Safeguards and Breach Compliance" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Legal Medical Records, Chart Auditing and Retention" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Registered Health Information Administrator RHIA level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "EHR vs EMR vs PHR and Master Patient Index (MPI)",
      order_index: 1,
      content: `### Health Information Systems and Identity Governance

1. Record Classifications:
   - Electronic Medical Record (EMR: single-clinic clinical record) vs Electronic Health Record (EHR: interoperable longitudinal health history) vs Personal Health Record (PHR: patient portal).

2. Master Patient Index (MPI):
   - Utilizing deterministic and probabilistic identity algorithms to prevent duplicate patient charts and demographic overlays.`
    },
    {
      track_id: track2Id,
      title: "Interoperability Standards: HL7, FHIR, DICOM and LOINC",
      order_index: 2,
      content: `### Clinical Messaging and Standardized Ontologies

1. Interoperability Frameworks:
   - HL7 v2/v3 messaging and Fast Healthcare Interoperability Resources (FHIR) RESTful JSON resource models.

2. Clinical Ontologies:
   - DICOM (radiology image storage in PACS).
   - LOINC (standardized laboratory observation codes).
   - SNOMED-CT (multiaxial clinical terminology for diagnostic and anatomical indexing).`
    },
    {
      track_id: track3Id,
      title: "HITECH Act, Meaningful Use and Information Blocking",
      order_index: 3,
      content: `### Federal Mandates and Regulatory Compliance

1. HITECH Act & Promoting Interoperability:
   - Financial incentive structures mandating certified EHR adoption, e-prescribing, and electronic clinical quality measure (eCQM) reporting.

2. 21st Century Cures Act:
   - Enforcing strict civil monetary penalties for Information Blocking, ensuring seamless, unhindered electronic health data access for patients.`
    },

    // Track 2
    {
      track_id: track1Id,
      title: "The HIPAA Privacy Rule, PHI Identifiers and TPO Disclosures",
      order_index: 1,
      content: `### Patient Privacy and Permitted Disclosures

1. Protected Health Information (PHI):
   - Governing 18 distinct direct and indirect identifiers (names, SSNs, dates of birth, MRNs, biometric data, IP addresses).

2. Permitted Disclosures:
   - Disclosing PHI without individual authorization strictly for Treatment, Payment, and Healthcare Operations (TPO), governed by the Minimum Necessary Standard.`
    },
    {
      track_id: track2Id,
      title: "HIPAA Security Rule: Administrative, Physical and Technical",
      order_index: 2,
      content: `### Tri-Partite Security Safeguards and Access Controls

1. Security Rule Architecture:
   - Administrative Safeguards (security management processes, workforce training, disaster recovery planning).
   - Physical Safeguards (facility access controls, server room locks).
   - Technical Safeguards (AES-256 encryption at rest and in transit, Role-Based Access Control RBAC, automatic logoff, immutable audit logs).`
    },
    {
      track_id: track3Id,
      title: "The Breach Notification Rule and Business Associate Agreements",
      order_index: 3,
      content: `### Data Breach Protocols and Vendor Oversight

1. Breach Notification Mandates:
   - Notifying affected individuals without unreasonable delay (maximum 60 calendar days); notifying HHS OCR and prominent media outlets immediately for breaches affecting 500+ records.

2. Business Associate Agreements (BAAs):
   - Legally binding third-party vendors (cloud hosts, billing clearinghouses) to HIPAA security compliance.`
    },

    // Track 3
    {
      track_id: track1Id,
      title: "The Legal Health Record (LHR) and Chart Auditing",
      order_index: 1,
      content: `### Legal Evidentiary Boundaries and Audit Integrity

1. Legal Health Record (LHR):
   - Explicitly defining the business and clinical document boundaries released in response to legal subpoenas and court discovery.

2. Quantitative vs Qualitative Analysis:
   - Quantitative analysis verifying missing clinician signatures and unauthenticated orders; Qualitative analysis auditing clinical documentation quality and care continuity.`
    },
    {
      track_id: track2Id,
      title: "Amendments, Late Entries, Addendums and Correction Rules",
      order_index: 2,
      content: `### Medical Record Modifications and Medicolegal Defense

1. Documentation Corrections:
   - Deleting, whiting-out, or backdating clinical records is strictly illegal.

2. Late Entries and Addendums:
   - Making timely clinical corrections by adding electronic Addendums or single-line strikethroughs with exact date, timestamp, reason for correction, and clinician electronic signature.`
    },
    {
      track_id: track3Id,
      title: "Record Retention Schedules and Certified Destruction",
      order_index: 3,
      content: `### Lifecycle Mandates and Cryptographic Purging

1. Retention Mandates:
   - CMS Medicare Conditions of Participation requiring minimum 5-year retention (many states mandate 7-10 years; pediatric records retained until age of majority plus statute of limitations, e.g. age 21 to 28).

2. Certified Destruction:
   - High-security cross-cut shredding, degaussing, or cryptographic wiping backed by Certificates of Destruction.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #143.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "Under HIPAA Privacy regulations, what is the 'Minimum Necessary Standard'?",
      options: [
        "Clinicians should only spend 5 minutes with each patient",
        "Healthcare workers must only access, use, or disclose the exact minimum amount of Protected Health Information (PHI) necessary to accomplish the intended clinical or administrative task",
        "Hospitals must have the minimum number of computer monitors",
        "Patients should only receive minimal medical care"
      ],
      correct_option_index: 1,
      explanation: "The Minimum Necessary standard restricts PHI access and disclosures strictly to what is required for the specific job duty.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What is the primary difference between an EMR (Electronic Medical Record) and an EHR (Electronic Health Record)?",
      options: [
        "EMRs are written on paper; EHRs are written on stone",
        "EMRs are used only by dentists",
        "EHRs can only be viewed on mobile phones",
        "An EMR is confined to a single clinic or medical practice; an EHR is a standardized, interoperable longitudinal health record designed to share data seamlessly across multiple disparate health systems"
      ],
      correct_option_index: 3,
      explanation: "EMRs remain internal to one practice; EHRs are interoperable across disparate health systems and providers.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "Under the HIPAA Privacy Rule, what does 'TPO' stand for regarding permitted disclosures without separate patient authorization?",
      options: [
        "Treatment, Payment, and Healthcare Operations",
        "Total Patient Outcome",
        "Transfer, Postpone, Order",
        "Time, Privacy, Ownership"
      ],
      correct_option_index: 0,
      explanation: "TPO (Treatment, Payment, and Healthcare Operations) permits clinicians to disclose PHI for essential care delivery and billing without explicit consent.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In hospital health information management, what is a 'Master Patient Index' (MPI)?",
      options: [
        "A list of the wealthiest hospital donors",
        "A book containing all surgical instruments",
        "A centralized permanent database that indexes every patient registered at a healthcare facility, linking all clinical records to a single unique Enterprise Master Person Identifier (EMPI)",
        "A dictionary of medical terms"
      ],
      correct_option_index: 2,
      explanation: "The Master Patient Index (MPI) serves as the core database linking all historical medical records to a unique patient identity.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "If a physician realizes an error was made in a finalized medical record entry, what is the ONLY legally permissible method to correct it?",
      options: [
        "Delete the original electronic entry completely",
        "Add a dated, timestamped electronic Addendum or Late Entry explaining the correction with a clinician electronic signature (never deleting or backdating)",
        "Use white-out correction fluid on paper charts",
        "Backdate the chart to the previous month"
      ],
      correct_option_index: 1,
      explanation: "Medical records must never be deleted or backdated; corrections require a dated and signed electronic addendum.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "Under the HITECH Breach Notification Rule, what is the mandatory reporting timeline and threshold for notifying the US Department of Health and Human Services (HHS) and major media outlets?",
      options: [
        "Breaches affecting 1 person must be broadcast on national television in 24 hours",
        "Hospitals never have to report data breaches",
        "Breaches of unsecured PHI affecting 500 or more individuals must be reported without unreasonable delay and no later than 60 calendar days to HHS OCR, affected individuals, and prominent media outlets",
        "Breaches only need to be reported if money was stolen"
      ],
      correct_option_index: 2,
      explanation: "Breaches of 500+ individuals trigger mandatory 60-day notifications to HHS OCR, individuals, and prominent local media.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In modern health informatics and interoperability, what is 'FHIR' (Fast Healthcare Interoperability Resources)?",
      options: [
        "A modern, RESTful API standard developed by HL7 that utilizes lightweight JSON/XML resource data structures to enable modular, real-time data exchange across EHR systems and mobile health apps",
        "A fire alarm system in hospital corridors",
        "An insurance billing software for dental claims",
        "A tool used to destroy old paper charts"
      ],
      correct_option_index: 0,
      explanation: "FHIR (HL7) utilizes modern RESTful web APIs and JSON resources to power mobile and cross-EHR healthcare data integration.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In healthcare HIPAA compliance, what is a 'Business Associate Agreement' (BAA)?",
      options: [
        "A contract between two competing hospital CEOs",
        "A job application form for hospital nurses",
        "A business partnership agreement for opening a pharmacy",
        "A legally binding contract between a HIPAA covered entity and a third-party vendor (e.g. cloud host, IT service, billing clearinghouse) that legally binds the vendor to adhere to HIPAA Privacy and Security standards"
      ],
      correct_option_index: 3,
      explanation: "BAAs legally hold third-party vendors (cloud providers, software vendors) accountable to HIPAA privacy and security regulations.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In health records auditing, what is the difference between 'Quantitative Analysis' and 'Qualitative Analysis' of a clinical chart?",
      options: [
        "Quantitative analysis is done by doctors; Qualitative is done by nurses",
        "Quantitative analysis checks for document completeness (e.g. missing signatures, missing operative reports, unsigned discharge summaries); Qualitative analysis evaluates documentation consistency, clinical logic, and adherence to medical standards",
        "Quantitative measures patient height; Qualitative measures patient weight",
        "There is zero difference between them"
      ],
      correct_option_index: 1,
      explanation: "Quantitative checks for missing signatures/forms; Qualitative evaluates documentation consistency and medical logic.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What federal mandate under the 21st Century Cures Act imposes severe civil monetary penalties on healthcare organizations that engage in 'Information Blocking'?",
      options: [
        "Prohibiting patients from viewing their own medical test results",
        "Allowing hospitals to lock their doors at night",
        "Prohibiting healthcare providers, EHR vendors, and health information exchanges from knowingly interfering with, preventing, or materially discouraging the access, exchange, or use of electronic health information",
        "Mandating that all doctors write by hand"
      ],
      correct_option_index: 2,
      explanation: "The 21st Century Cures Act outlaws Information Blocking, ensuring patients and providers have unfettered electronic access to health data.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In Health Information Management, what is the 'Legal Health Record' (LHR) and why must a healthcare organization formally define its specific parameters in policy?",
      options: [
        "The explicit subset of clinical, diagnostic, and administrative documentation that officially represents the business record of patient care released upon legal discovery, court orders, or subpoenas in litigation",
        "The physical paper chart stored in the basement",
        "A record of all speeding tickets a doctor received",
        "An insurance policy contract"
      ],
      correct_option_index: 0,
      explanation: "The Legal Health Record establishes the official legal evidentiary boundary of medical data released for litigation and discovery.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "For pediatric medical records, what is the standard retention guideline mandated across most state statutes and health information management standards?",
      options: [
        "Pediatric records must be destroyed when the child turns 1 year old",
        "Pediatric records only need to be kept for 30 days",
        "Pediatric records are kept for 1 year after the child finishes school",
        "Records must be retained for the state adult statute of limitations period (often 7 to 10 years) calculated starting AFTER the pediatric patient reaches the legal age of majority (e.g. retained until the patient reaches age 21 to 28)"
      ],
      correct_option_index: 3,
      explanation: "Pediatric retention clocks start when the minor reaches the age of majority (18/21), requiring retention until age 21-28.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "Under the HIPAA Security Rule, what is the crucial architectural distinction between 'Required' and 'Addressable' implementation specifications?",
      options: [
        "Addressable specifications can be ignored completely without any documentation",
        "'Required' specifications MUST be implemented exactly as stated; 'Addressable' specifications require the entity to assess whether the safeguard is reasonable and appropriate, and if not, implement an equivalent alternative measure or formally document why it is not applicable",
        "Required is for hospitals; Addressable is for private homes",
        "Addressable specifications only apply to postal mailing addresses"
      ],
      correct_option_index: 1,
      explanation: "Addressable specifications require evaluating and implementing equivalent alternative security controls with formal risk documentation.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In medical terminology standards, what is the clinical distinction between 'LOINC' and 'SNOMED-CT' ontologies in an EHR database?",
      options: [
        "LOINC is for billing; SNOMED-CT is for scheduling",
        "SNOMED-CT is only used for dental procedures",
        "LOINC standardizes laboratory observations, clinical tests, and diagnostic measurements; SNOMED-CT provides a comprehensive, multiaxial clinical ontology covering diagnoses, clinical findings, body structures, and procedures",
        "LOINC and SNOMED-CT are identical systems"
      ],
      correct_option_index: 2,
      explanation: "LOINC encodes lab/observation results; SNOMED-CT encodes comprehensive multiaxial clinical diagnoses, findings, and anatomy.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In medical records destruction compliance, what documentation is legally REQUIRED to certify the permanent, unrecoverable destruction of expired medical charts?",
      options: [
        "A formal 'Certificate of Destruction' documenting the exact date of destruction, method of destruction (e.g. cross-cut shredding / degaussing), specific record series destroyed, inclusive date ranges, and authorized supervisor signatures",
        "A verbal agreement between two hospital janitors",
        "A receipt from a local garbage dump",
        "Certificates are not required for destroying records"
      ],
      correct_option_index: 0,
      explanation: "A Certificate of Destruction provides permanent legal proof of authorized, compliant destruction with dates, ranges, and supervisor signatures.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #143.");
  console.log("Skill #143 update completed successfully!");
}

run();
