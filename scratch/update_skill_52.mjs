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

const skillId = "c526d37b-1a29-4f2d-8759-a6c5b8372e4b";

async function run() {
  console.log("Updating Skill #52: Reporting & Responsible Disclosure (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Penetration Testing Report Architecture and Technical Writing" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Coordinated Vulnerability Disclosure (CVD) and Safe Harbor" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: CVE Assignment, Advisory Lifecycle and Executive Debriefs" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Lead Penetration Tester level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Executive Summary: Translating Technical Risk to Business Terms",
      order_index: 1,
      content: `### Executive Communication and Strategic Risk Translation

The Executive Summary is the most critical section of a penetration testing report, written specifically for C-suite leaders and Board members:

1. Essential Elements of an Executive Summary:
   - Overall Strategic Posture: Clear graphical summary of security maturity and overall risk rating.
   - Translating Technical Flaws into Business Risk: Framing technical exploits in terms of financial impact, regulatory penalties (GDPR/PCI-DSS), operational downtime, and brand damage (e.g. describing an unauthenticated RCE as 'a vulnerability allowing remote attackers to access private customer financial records and disrupt production databases').
   - Highlighting Positive Controls: Explicitly acknowledging effective defenses observed during testing (e.g. robust multi-factor authentication or rapid SOC incident detection).
   - Strategic Remediation Roadmap: Prioritized 30/60/90-day investment recommendations.`
    },
    {
      track_id: track1Id,
      title: "Technical Finding Structure: PoC, Root Cause and Vector Strings",
      order_index: 2,
      content: `### Authoring Rigorous and Reproducible Technical Findings

Each technical vulnerability in a report must provide complete clarity for software engineers and DevOps teams:

1. Standard Finding Schema:
   - Finding Title & Severity: Standardized naming coupled with full CVSS v3.1 / v4.0 vector strings (e.g. \`CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H\` = 9.8 Critical).
   - Vulnerability Summary & Root Cause: Explaining the precise architectural or coding defect (e.g. missing object-level authorization decorators in REST API controllers).
   - Step-by-Step Proof of Concept (PoC): Deterministic, repeatable instructions including sanitized HTTP request/response transcripts, curl command examples, and script snippets.
   - Actionable Developer Remediation: Providing concrete, secure code snippets (e.g. parameterized queries or output encoding helpers) rather than generic theoretical advice.`
    },
    {
      track_id: track1Id,
      title: "Finding Metrics, Scoping Disclaimers and Evidence Sanitization",
      order_index: 3,
      content: `### Scoping Compliance, PII Redaction and Encrypted Delivery

1. Engagement Scoping and Methodology Disclaimers:
   - Defining evaluated IP blocks, API endpoints, domains, and specific exclusions.
   - Documenting point-in-time assessment limitations and testing timeframes.

2. Evidence Sanitization and PII Redaction:
   - Strict redacting (\`****\`) of sensitive customer Personally Identifiable Information (PII), payment card numbers, and production database passwords in report screenshots to prevent secondary data exposure.

3. Secure Transmission Standards:
   - Delivering finalized assessment reports exclusively via PGP-encrypted email or end-to-end encrypted secure file portals.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Vulnerability Disclosure Models: Full vs Coordinated vs Private",
      order_index: 1,
      content: `### International Standards for Coordinated Vulnerability Disclosure

1. Disclosure Methodologies:
   - Full Disclosure: Publicly releasing zero-day vulnerability details and exploit scripts immediately without prior vendor notice (exposes end users to immediate unpatched attacks).
   - Private / Vendor-Only Disclosure: Reporting silently to the vendor with no public oversight (risks vendors ignoring or deprioritizing fixes indefinitely).
   - Coordinated Vulnerability Disclosure (CVD - ISO/IEC 29147 & ISO/IEC 30111): The global ethical standard where researchers disclose vulnerabilities privately, agreeing on a reasonable remediation timeline before releasing a joint advisory.

2. Industry Timeline Standards (Google Project Zero Policy):
   - 90-Day Disclosure Window: Vendors receive 90 calendar days to develop and distribute a patch before public disclosure, with a 14-day grace period if a verified patch is imminent.`
    },
    {
      track_id: track2Id,
      title: "Vulnerability Disclosure Programs (VDP) vs Bug Bounties",
      order_index: 2,
      content: `### Managing Inbound Vulnerability Telemetry and Bounty Programs

1. The Security.txt Standard (RFC 9116):
   - A standardized machine-readable text file hosted at \`/.well-known/security.txt\` declaring security contact email addresses, PGP keys, policy URLs, and acknowledgement halls of fame.

2. Vulnerability Disclosure Programs (VDP):
   - Establishes a structured intake channel allowing external security researchers to safely report discovered vulnerabilities without financial rewards.

3. Bug Bounty Platforms (HackerOne, Bugcrowd, Intigriti):
   - Commercial crowdsourced security programs incentivizing ethical researchers with monetary payouts scaled across severity tiers (e.g. Critical $5,000+ down to Low $100).`
    },
    {
      track_id: track2Id,
      title: "Legal Safe Harbor: CFAA Protections and Rules of Engagement",
      order_index: 3,
      content: `### Legal Frameworks and Researcher Protections

1. Legal Risks and the Computer Fraud and Abuse Act (CFAA - 18 U.S.C. 1030):
   - Historical risks where good-faith security researchers faced legal prosecution or civil lawsuits under broad anti-hacking statutes.

2. Gold Standard Safe Harbor Policies:
   - Explicit legal contractual clauses embedded in VDP and bug bounty policies guaranteeing that the organization will not initiate legal action against researchers operating in good faith within documented scope.

3. Out-of-Scope Restrictions:
   - Explicitly prohibiting Denial of Service (DoS/DDoS), physical social engineering of staff, physical facility intrusion, and accessing or altering unauthorized customer data.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "The CVE Assignment Lifecycle: MITRE, CNAs and NVD Indexing",
      order_index: 1,
      content: `### Common Vulnerabilities and Exposures (CVE) Global Registry

1. The CVE Architecture:
   - Unique standardized identifiers (\`CVE-YYYY-NNNNN\`) maintaining a global index of publicly known cybersecurity vulnerabilities.

2. CVE Numbering Authorities (CNAs):
   - Authorized organizations (major software vendors like Microsoft/Apple/Red Hat, or third-party coordinators like CERT/CC) authorized to assign CVE IDs and publish vulnerability metadata.

3. National Vulnerability Database (NVD - NIST):
   - Federal repository synchronizing with CVE data, performing in-depth analysis to assign official CVSS severity scores, Common Weakness Enumeration (CWE) flaw categories, and Common Platform Enumeration (CPE) affected software strings.`
    },
    {
      track_id: track3Id,
      title: "Post-Engagement Executive Debriefs and Technical Readouts",
      order_index: 2,
      content: `### Stakeholder Alignment and Presentation Choreography

1. The Executive Debrief Presentation (30 Minutes):
   - High-level presentation tailored for executive leadership, focusing on business risk themes, systemic root causes (e.g. gaps in developer security training or architectural debt), and strategic budget priorities.

2. Technical Readout Workshop (60 to 90 Minutes):
   - Interactive collaborative session with software engineers and DevOps teams:
     - Demonstrating exploit reproduction steps in non-production environments.
     - Reviewing exact code-level fixes and answering implementation questions.`
    },
    {
      track_id: track3Id,
      title: "Attestation Letters and Remediation Verification Reports",
      order_index: 3,
      content: `### Formal Assessment Closure and Regulatory Attestations

1. Remediation Verification Testing:
   - Re-executing exact penetration testing exploits against patched environments to independently confirm that reported vulnerabilities are fully resolved without introducing regressions.

2. Letter of Attestation (Attestation of Assessment):
   - A formal, executive-signed public letter certifying that a third-party penetration test was conducted against the organization's systems within specific dates.
   - Allows the client to satisfy customer compliance requests and third-party audit requirements (SOC 2, ISO 27001, PCI-DSS) without disclosing sensitive technical vulnerability findings.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #52.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In a penetration testing report, what is the primary purpose of the 'Executive Summary'?",
      options: [
        "To list every single line of code in the software",
        "To translate technical security findings into business risk (financial, regulatory, reputational) and strategic remediation roadmaps for executive leadership",
        "To teach developers how to install Linux",
        "To list all employee home addresses"
      ],
      correct_option_index: 1,
      explanation: "The Executive Summary frames technical vulnerabilities in terms of business impact, financial risk, and strategic remediation for executives.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What standard file hosted at '/.well-known/security.txt' (RFC 9116) provides a machine-readable format for security researchers to find a company's vulnerability disclosure contacts and PGP keys?",
      options: [
        "robots.txt",
        "sitemap.xml",
        "index.html",
        "security.txt"
      ],
      correct_option_index: 3,
      explanation: "RFC 9116 defines security.txt as the standardized location (/.well-known/security.txt) for organizations to publish security contact details.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "Under global Coordinated Vulnerability Disclosure (CVD) standards (such as Google Project Zero policy), what is the standard timeframe granted to software vendors to patch a vulnerability before public disclosure?",
      options: [
        "90 calendar days (with a 14-day grace period if a verified patch is imminent)",
        "24 hours",
        "10 years",
        "Zero days"
      ],
      correct_option_index: 0,
      explanation: "The 90-day disclosure window is the industry standard balance between giving vendors time to patch and protecting end-users.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What globally recognized standardized identifier format (e.g. CVE-2026-10492) tracks publicly known cybersecurity vulnerabilities?",
      options: [
        "ISBN Number",
        "Serial Number",
        "Common Vulnerabilities and Exposures (CVE)",
        "Barcode"
      ],
      correct_option_index: 2,
      explanation: "CVE (Common Vulnerabilities and Exposures) provides standardized, unique identifiers for publicly disclosed cybersecurity vulnerabilities.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In vulnerability disclosure policies, what does a 'Legal Safe Harbor' clause provide to ethical security researchers?",
      options: [
        "A free vacation to a harbor",
        "An explicit legal commitment that the organization will not pursue civil lawsuits or criminal prosecution against researchers operating in good faith within program scope",
        "Free computer hardware",
        "Immunity from all world laws"
      ],
      correct_option_index: 1,
      explanation: "Safe Harbor protects ethical researchers from anti-hacking prosecution (CFAA) when conducting authorized research in good faith.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "What is the key ethical difference between 'Coordinated Vulnerability Disclosure' (CVD) and 'Full Disclosure'?",
      options: [
        "CVD is illegal in all countries",
        "Full disclosure is only practiced by governments",
        "CVD shares vulnerability details privately with the vendor to allow patching before public release, whereas Full Disclosure publishes zero-day details immediately without vendor coordination",
        "There is zero difference"
      ],
      correct_option_index: 2,
      explanation: "CVD gives vendors time to create and deploy patches before releasing technical details, minimizing risk to users.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In a formal penetration testing report, why must proof-of-concept screenshots and data dumps be strictly sanitized to redact customer Personally Identifiable Information (PII) and passwords?",
      options: [
        "To prevent the report deliverable itself from becoming a secondary data breach if intercepted or shared across non-privileged stakeholders",
        "To save printer ink",
        "Because screenshots make files too large",
        "To hide the vulnerability from developers"
      ],
      correct_option_index: 0,
      explanation: "Sanitizing sensitive data in reports prevents the assessment document from exposing real customer PII or credentials.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What organization or authorized entity assigns official CVE IDs to software vulnerabilities and publishes initial metadata?",
      options: [
        "Local police departments",
        "Internet Service Providers",
        "Web hosting companies",
        "CVE Numbering Authorities (CNAs - authorized software vendors, researchers, or coordination centers)"
      ],
      correct_option_index: 3,
      explanation: "CNAs (CVE Numbering Authorities) are authorized by MITRE to assign CVE identifiers and publish official vulnerability records.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What document can an organization provide to external auditors (SOC 2 / ISO 27001) and enterprise clients to prove an annual penetration test occurred without disclosing sensitive technical exploit details?",
      options: [
        "The company cafeteria menu",
        "An official Letter of Attestation (Attestation of Assessment) signed by the independent penetration testing firm",
        "A copy of the CEO's passport",
        "A blank invoice"
      ],
      correct_option_index: 1,
      explanation: "A Letter of Attestation confirms assessment execution, methodology, and dates without exposing sensitive technical exploit findings.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What is the primary operational difference between a Vulnerability Disclosure Program (VDP) and a commercial Bug Bounty Program?",
      options: [
        "VDPs are only for mobile apps",
        "Bug bounties are illegal",
        "A VDP provides a secure intake channel for researchers to report flaws without cash rewards, whereas Bug Bounties offer monetary bounties scaled to severity tiers",
        "VDPs do not fix vulnerabilities"
      ],
      correct_option_index: 2,
      explanation: "VDPs provide a safe legal intake channel without financial payouts, whereas bug bounty programs reward researchers with monetary bounties.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In vulnerability technical writing, what makes a Proof of Concept (PoC) truly 'Defensible and Actionable' for software engineering teams?",
      options: [
        "It provides deterministic, step-by-step reproducible commands (sanitized HTTP requests/responses, payload parameters), identifies exact root cause in code, and provides secure code remediation snippets",
        "It includes 50 pages of marketing brochures",
        "It tells the developer to rewrite the entire application in Assembly",
        "It insults the developer's coding skills"
      ],
      correct_option_index: 0,
      explanation: "Actionable findings provide reproducible steps, root-cause analysis, and specific secure code snippets that engineers can implement immediately.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In cybersecurity legal history, what US federal statute (18 U.S.C. 1030) was historically weaponized against good-faith security researchers for 'exceeding authorized access'?",
      options: [
        "The Clean Air Act",
        "The Copyright Act",
        "The Highway Safety Act",
        "The Computer Fraud and Abuse Act (CFAA)"
      ],
      correct_option_index: 3,
      explanation: "The CFAA (18 U.S.C. 1030) criminalizes unauthorized access to computers; modern Safe Harbor policies protect ethical researchers from its scope.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In post-engagement debriefs, what is the core objective of conducting separate 'Executive Debrief' and 'Technical Readout Workshop' presentations?",
      options: [
        "To charge the client double",
        "The Executive Debrief focuses on strategic risk themes and resource budgeting for C-suite leaders, while the Technical Workshop dives into code-level exploit reproduction and remediation with engineers",
        "To waste employee time",
        "Because executives are not allowed in engineering buildings"
      ],
      correct_option_index: 1,
      explanation: "Tailoring presentations aligns strategic business risk with executive leadership while providing tactical implementation guidance to developers.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In National Vulnerability Database (NVD) enrichment, what standardized naming system is used to identify affected software products and operating systems (e.g. 'cpe:2.3:a:apache:http_server:2.4.41:*:*:*:*:*:*:*')?",
      options: [
        "Common Weakness Enumeration (CWE)",
        "CVSS Score",
        "Common Platform Enumeration (CPE)",
        "DNS Names"
      ],
      correct_option_index: 2,
      explanation: "Common Platform Enumeration (CPE) provides a structured naming scheme for IT systems, platforms, and software packages affected by CVEs.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "What ISO standards define the international requirements for Vulnerability Disclosure (ISO/IEC 29147) and Vulnerability Handling Processes (ISO/IEC 30111)?",
      options: [
        "ISO/IEC 29147 and ISO/IEC 30111",
        "ISO 9001 and ISO 14001",
        "ISO 22000 and ISO 45001",
        "IEEE 802.3 and IEEE 802.11"
      ],
      correct_option_index: 0,
      explanation: "ISO/IEC 29147 provides guidelines for receiving and disclosing vulnerabilities, and ISO/IEC 30111 specifies vulnerability investigation and handling processes.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #52.");
  console.log("Skill #52 update completed successfully!");
}

run();
