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

const skillId = "6a1ad4f7-800b-4f0f-82b0-3db9eadac0f0";

async function run() {
  console.log("Updating Skill #46: Security Compliance Basics (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Regulatory Frameworks, Standards and Global Privacy Laws" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Quantitative Risk Analysis, FAIR Model and Governance Hierarchy" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Third-Party Risk, Continuous Compliance and Audit Execution" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / CRISC / CISA Compliance level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Regulatory Landscape: PCI-DSS 4.0, HIPAA, SOC 2 and ISO 27001",
      order_index: 1,
      content: `### Global Regulatory Standards and Compliance Frameworks

Enterprise security governance operates within a matrix of legal, industry, and international standards:

1. PCI-DSS v4.0 (Payment Card Industry Data Security Standard):
   - 12 Core Requirements protecting Cardholder Data Environments (CDE).
   - Scoping and Segmentation: Isolating payment databases using firewalls to minimize audit boundaries. Mandates multi-factor authentication (MFA) for all administrative and CDE access.

2. HIPAA Security & Privacy Rules (Healthcare):
   - Safeguarding Electronic Protected Health Information (ePHI) across Administrative, Physical, and Technical Safeguard domains. Requires Business Associate Agreements (BAAs) with third-party vendors.

3. AICPA SOC 2 (System and Organization Controls):
   - Evaluates service organizations against Trust Services Criteria (Security, Availability, Processing Integrity, Confidentiality, Privacy).
   - SOC 2 Type I (Point-in-time design suitability) vs SOC 2 Type II (Evaluates operating effectiveness of controls tested across a 6 to 12-month audit window).

4. ISO/IEC 27001:2022:
   - International standard establishing an Information Security Management System (ISMS), supported by 93 Annex A controls organized into 4 themes (Organizational, People, Physical, Technological).`
    },
    {
      track_id: track1Id,
      title: "Federal and Government Baselines: NIST SP 800-53 and FedRAMP",
      order_index: 2,
      content: `### US Federal Cybersecurity Standards and Cloud Authorization

1. NIST SP 800-53 rev 5:
   - Comprehensive security and privacy control catalog for federal information systems.
   - 20 Control Families (Access Control AC, Audit and Accountability AU, Contingency Planning CP, Incident Response IR, System and Communications Protection SC).
   - Baselines: Categorized into Low, Moderate, and High impact levels under FIPS 199/200 risk assessments.

2. FedRAMP (Federal Risk and Authorization Management Program):
   - Standardized US federal government program assessing cloud service providers (CSPs).
   - FedRAMP High/Moderate Authorization: Involves rigorous third-party assessment organization (3PAO) audits, continuous monitoring (ConMon), and strict federal supply chain controls.

3. DoD CMMC 2.0 (Cybersecurity Maturity Model Certification):
   - Tiered framework protecting Controlled Unclassified Information (CUI) across the Defense Industrial Base.`
    },
    {
      track_id: track1Id,
      title: "Global Data Privacy Governance: GDPR, CCPA/CPRA and Transfers",
      order_index: 3,
      content: `### International Privacy Regulations and Cross-Border Data Transfers

1. EU General Data Protection Regulation (GDPR):
   - Seven Core Principles: Lawfulness/Fairness/Transparency, Purpose Limitation, Data Minimization, Accuracy, Storage Limitation, Integrity/Confidentiality, and Accountability.
   - Data Subject Rights: Right to Access (Article 15), Right to Rectification, Right to Erasure / 'Right to be Forgotten' (Article 17), Right to Restrict Processing, Data Portability (Article 20).
   - Penalties: Up to 20 million euros or 4% of global annual turnover.

2. California Consumer Privacy Act / CPRA (CCPA/CPRA):
   - Protects consumer rights to opt out of the sale or sharing of personal data and limits the use of sensitive personal information. Requires recognition of Global Privacy Control (GPC) opt-out signals.

3. Cross-Border Data Transfers:
   - Standard Contractual Clauses (SCCs), Data Transfer Impact Assessments (DTIAs), and compliance with the EU-US Data Privacy Framework.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Quantitative and Qualitative Risk Analysis: The FAIR Framework",
      order_index: 1,
      content: `### Risk Assessment Methodologies and Quantitative Financial Modeling

1. Qualitative vs Quantitative Risk Assessment:
   - Qualitative: Subjective risk matrices scoring Likelihood and Impact on High/Medium/Low scales.
   - Quantitative: Calculating financial risk exposure in discrete monetary terms using mathematical modeling.

2. Factor Analysis of Information Risk (FAIR):
   - Industry-standard quantitative risk taxonomy:
     - Loss Event Frequency (LEF = Threat Event Frequency * Vulnerability / Resistance Strength).
     - Loss Magnitude (Primary Loss: direct response costs + Secondary Loss: regulatory fines, reputational customer churn, litigation).

3. Annualized Loss Expectancy Mathematics:
\`\`\`
Single Loss Expectancy (SLE) = Asset Value (AV) * Exposure Factor (EF)
Annualized Loss Expectancy (ALE) = Single Loss Expectancy (SLE) * Annualized Rate of Occurrence (ARO)
\`\`\`
   - Enables executive leadership to compare control implementation costs against projected annualized risk savings.`
    },
    {
      track_id: track2Id,
      title: "Risk Treatment Strategies and Enterprise Risk Appetite",
      order_index: 2,
      content: `### The Four Classical Risk Treatments and Executive Governance

1. The Four Risk Treatment Options:
   - 1. Risk Mitigation (Reduction): Implementing technical, physical, or administrative controls to reduce likelihood or impact (e.g. enforcing FIDO2 MFA, network segmentation).
   - 2. Risk Transfer: Offloading financial exposure to third parties via cyber insurance policies or vendor indemnification contract clauses.
   - 3. Risk Avoidance: Terminating the risky business process, exiting a hostile market, or retiring vulnerable legacy infrastructure.
   - 4. Risk Acceptance: Formal executive sign-off accepting residual risk when the cost of mitigation exceeds the potential loss.

2. Risk Appetite vs Risk Tolerance:
   - Risk Appetite: The broad level of risk an organization is willing to accept in pursuit of its strategic business objectives.
   - Risk Tolerance: The acceptable boundary of variation around specific risk objectives.`
    },
    {
      track_id: track2Id,
      title: "Security Governance Hierarchy: Policies, Standards, Baselines and SOPs",
      order_index: 3,
      content: `### Architecture of the Enterprise Security Documentation Hierarchy

Enterprise governance relies on a structured, 5-tier documentation pyramid:

1. The Five Documentation Tiers:
   - Tier 1: Policies (Executive-approved, high-level mandatory foundational directives e.g. 'Enterprise Information Security Policy').
   - Tier 2: Standards (Mandatory specific technological requirements e.g. 'All symmetric encryption must utilize AES-256-GCM').
   - Tier 3: Baselines (Minimum mandatory configuration settings e.g. CIS Benchmarks for Windows Server 2022 / Ubuntu Linux).
   - Tier 4: Procedures / Standard Operating Procedures - SOPs (Step-by-step operational workflows e.g. 'SOP for Employee Access Revocation upon Termination').
   - Tier 5: Guidelines (Discretionary best-practice recommendations and non-mandatory advice).`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Third-Party Vendor Risk Management (TPRM) and Supply Chain Security",
      order_index: 1,
      content: `### Supply Chain Due Diligence and Vendor Governance

1. Third-Party Risk Management (TPRM) Framework:
   - Criticality Tiering: Categorizing vendors from Tier 1 Critical (access to production systems, source code, or customer PII/PHI) to Tier 4 Low Risk.
   - Assessment Instruments: Standardized Information Gathering (SIG) questionnaires and Cloud Security Alliance Consensus Assessments Initiative Questionnaires (CAIQ).

2. Reviewing Vendor SOC 2 Reports:
   - Section II (Management Assertion) and Section IV (Independent Auditor's Report): Verifying if the audit opinion is Unqualified (clean pass) or Qualified (deficiencies noted).
   - Complementary User Entity Controls (CUECs): Mandatory controls the customer organization must implement for the vendor's security model to function.
   - SOC 2 Bridge Letters: Formal letters covering audit gap periods between annual report issuances.

3. Continuous Vendor Risk Scoring:
   - External telemetry ratings (SecurityScorecard, BitSight) monitoring third-party DNS, patching, and SSL hygiene.`
    },
    {
      track_id: track3Id,
      title: "Automated GRC Platforms and Continuous Compliance Monitoring",
      order_index: 2,
      content: `### Continuous Control Verification and GRC Automation Platforms

1. Limitations of Manual Spreadsheet Auditing:
   - Traditional annual point-in-time compliance audits create substantial control drift and require weeks of manual screenshot gathering.

2. Modern Automated GRC Platforms (Vanta, Drata, OneTrust, AWS Audit Manager):
   - Direct API integrations connecting to Cloud Infrastructure (AWS/Azure/GCP), Identity Providers (Okta/Google Workspace), Code Repositories (GitHub/GitLab), and MDM solutions.
   - Continuous Automated Testing: Evaluating control health in real time (e.g. instantly alerting on unencrypted cloud storage buckets, missing endpoint antivirus, or code pull requests merged without mandatory peer reviews).`
    },
    {
      track_id: track3Id,
      title: "Audit Preparation, Evidence Gathering and POA&M Remediation",
      order_index: 3,
      content: `### External Audit Choreography and Deficiency Remediation

1. Audit Evidence Collection Protocols:
   - Evidence Request Lists (ERL): Extracting complete population data (e.g. all 120 new hires during the audit period) from which independent auditors draw randomized samples.
   - Forensic Evidence Integrity: Providing read-only auditor access or digitally signed, timestamped exports.

2. Managing Audit Findings:
   - Classifying findings: Observations, Significant Deficiencies, and Material Weaknesses.

3. Plans of Action and Milestones (POA&M):
   - Standardized federal and enterprise remediation tracker documenting:
     - Identified deficiency and root cause.
     - Assigned executive owner and engineering team.
     - Allocated budget and compensating interim controls.
     - Scheduled milestone target completion dates.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #46.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "What major payment industry security standard establishes mandatory technical and operational requirements to protect Cardholder Data Environments (CDE)?",
      options: [
        "PCI-DSS v4.0",
        "OSHA Standards",
        "HTML5 Specification",
        "IEEE 802.11"
      ],
      correct_option_index: 0,
      explanation: "PCI-DSS (Payment Card Industry Data Security Standard) establishes mandatory baseline controls for entities processing cardholder data.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What is the key difference between an AICPA SOC 2 Type I report and a SOC 2 Type II report?",
      options: [
        "Type I is for Europe only",
        "Type II costs zero dollars",
        "Type I evaluates control design suitability at a single point in time, whereas Type II tests operating effectiveness over a 6 to 12-month period",
        "There is zero difference"
      ],
      correct_option_index: 2,
      explanation: "SOC 2 Type I is a point-in-time snapshot, while SOC 2 Type II verifies that controls operated effectively over a 6 to 12-month audit window.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In the enterprise security documentation hierarchy, which tier represents high-level, mandatory, executive-approved foundational directives?",
      options: [
        "Guidelines",
        "Policies (Tier 1)",
        "Procedures",
        "Suggestions"
      ],
      correct_option_index: 1,
      explanation: "Policies sit at Tier 1 as mandatory executive directives that define the organization's overarching security commitments.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What risk treatment strategy involves purchasing cyber insurance to offload the financial consequences of a major security breach?",
      options: [
        "Risk Avoidance",
        "Risk Mitigation",
        "Risk Acceptance",
        "Risk Transfer"
      ],
      correct_option_index: 3,
      explanation: "Risk transfer shifts financial liability for potential losses to a third party, such as an insurance underwriter.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "Under the EU GDPR regulation, what is the maximum regulatory penalty for severe violations of fundamental data protection principles?",
      options: [
        "Up to 20 million euros or 4% of total worldwide annual turnover",
        "A $50 gift card",
        "Zero penalty",
        "A written warning letter only"
      ],
      correct_option_index: 0,
      explanation: "GDPR enforces severe penalties up to 20 million euros or 4% of global annual turnover for serious privacy infractions.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In quantitative risk analysis, how is Annualized Loss Expectancy (ALE) mathematically calculated?",
      options: [
        "ALE = Revenue / Employee Count",
        "ALE = Server Count * CPU Speed",
        "ALE = Download Speed * Upload Speed",
        "ALE = Single Loss Expectancy (SLE) multiplied by the Annualized Rate of Occurrence (ARO)"
      ],
      correct_option_index: 3,
      explanation: "ALE = SLE * ARO, calculating the expected monetary loss per year based on single event impact and annual frequency.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Third-Party Risk Management (TPRM), what are 'Complementary User Entity Controls' (CUECs) identified in a vendor's SOC 2 report?",
      options: [
        "Passwords used by the auditor",
        "Controls that the customer organization must implement in their own environment for the vendor's security architecture to function securely",
        "Free software upgrades provided by the vendor",
        "Government taxes on cloud computing"
      ],
      correct_option_index: 1,
      explanation: "CUECs are mandatory controls that customers must operate (e.g. managing user access credentials) to ensure complete end-to-end security.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What US federal program provides a standardized approach to security assessment, authorization, and continuous monitoring for cloud service providers (CSPs) serving government agencies?",
      options: [
        "FedRAMP (Federal Risk and Authorization Management Program)",
        "FCC Regulations",
        "FAA Guidelines",
        "FTC Complaints"
      ],
      correct_option_index: 0,
      explanation: "FedRAMP standardizes cloud security authorizations across US federal agencies based on NIST SP 800-53 baselines.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In regulatory audit remediation, what is a 'Plan of Action and Milestones' (POA&M)?",
      options: [
        "A map of the corporate building",
        "The company vacation calendar",
        "A formal management document detailing identified security control deficiencies, assigned owners, corrective actions, and scheduled target completion dates",
        "A list of computer hardware prices"
      ],
      correct_option_index: 2,
      explanation: "A POA&M is a formal corrective action plan tracking control deficiencies, remediation steps, assigned resources, and milestone dates.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "How do modern automated GRC platforms (such as Vanta or Drata) improve on traditional manual spreadsheet compliance audits?",
      options: [
        "They eliminate the need for computer security entirely",
        "They write software code automatically",
        "They delete all system logs",
        "They connect via APIs to cloud infrastructure, code repositories, and identity providers to continuously test control configurations in real time"
      ],
      correct_option_index: 3,
      explanation: "Automated GRC platforms continuously evaluate infrastructure and identity controls via APIs, replacing manual annual evidence collection.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In quantitative risk management, what core framework models risk by deconstructing Loss Event Frequency (LEF) and Loss Magnitude into discrete probabilistic factors?",
      options: [
        "Scrum Framework",
        "Factor Analysis of Information Risk (FAIR)",
        "Waterfall Model",
        "Six Sigma"
      ],
      correct_option_index: 1,
      explanation: "The FAIR framework provides a standardized taxonomy and mathematical methodology for quantifying information risk in discrete financial metrics.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "What is the purpose of a 'SOC 2 Bridge Letter' (Gap Letter) issued by a third-party SaaS vendor?",
      options: [
        "To build physical bridges between office buildings",
        "To request a financial loan from a bank",
        "It provides management certification that internal controls remained in place without material changes during the gap period between the end of the last SOC 2 audit period and the current date",
        "To cancel a software subscription"
      ],
      correct_option_index: 2,
      explanation: "Bridge letters cover the interim gap period between the end of a SOC 2 audit period and the customer's contract date, confirming control continuity.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "Under NIST SP 800-53 rev 5, what control family governs 'System and Communications Protection' (including cryptographic mechanisms and network boundary defense)?",
      options: [
        "SC Control Family",
        "AC Control Family",
        "AU Control Family",
        "PE Control Family"
      ],
      correct_option_index: 0,
      explanation: "The SC (System and Communications Protection) family in NIST SP 800-53 establishes controls for cryptographic protection and perimeter defenses.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "Under GDPR Article 17, what specific data subject right allows an individual to demand that an organization delete their personal data without undue delay?",
      options: [
        "Right to Data Portability",
        "Right to File Lawsuits",
        "Right to Free Software",
        "Right to Erasure ('Right to be Forgotten')"
      ],
      correct_option_index: 3,
      explanation: "Article 17 grants data subjects the Right to Erasure ('Right to be Forgotten') when data is no longer necessary for its original purpose.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In enterprise governance, what is the precise distinction between a 'Standard' and a 'Guideline'?",
      options: [
        "Standards are written in English; Guidelines are written in French",
        "A Standard is a mandatory, non-negotiable technical requirement (e.g. mandatory AES-256 encryption), whereas a Guideline provides discretionary, recommended best practices",
        "Guidelines are legally binding in federal court; Standards are optional",
        "There is zero distinction"
      ],
      correct_option_index: 1,
      explanation: "Standards are mandatory rules establishing specific technical requirements, while guidelines offer non-mandatory recommendations and advice.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #46.");
  console.log("Skill #46 update completed successfully!");
}

run();
