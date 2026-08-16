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

const skillId = "1a14bcd1-fb3d-4486-9ee1-58248027f4a9";

async function run() {
  console.log("Updating Skill #51: Vulnerability Assessment Tools (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Enterprise Vulnerability Scanners, Architecture and Scanning Modes" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Prioritization Metrics: CVSS, EPSS, SAST/DAST and Cloud CSPM" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Vulnerability Lifecycles, Remediation SLAs and Verification" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / CEH / Vulnerability Management level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Network Vulnerability Scanners: Nessus, Qualys and OpenVAS",
      order_index: 1,
      content: `### Architecture and Operations of Enterprise Vulnerability Scanners

Enterprise vulnerability management relies on automated assessment engines (Tenable Nessus, Qualys VMDR, Rapid7 InsightVM, OpenVAS / Greenbone):

1. Scanner Architecture and Plugin Engines:
   - Plugin Framework: Modular vulnerability definitions written in scripting languages (e.g. NASL - Nessus Attack Scripting Language).
   - Sensor Deployment Topology: Centralized Cloud Scanners for external perimeter asset discovery vs Distributed On-Premises Scanner Appliances deployed in internal DMZs and data centers to prevent firewall bandwidth saturation.

2. Scanning Methodology:
   - Host Discovery -> Port Enumeration -> Service Fingerprinting -> Vulnerability Plugin Execution -> Flaw Correlation against CVE/NVD databases.`
    },
    {
      track_id: track1Id,
      title: "Credentialed vs Non-Credentialed Scanning Mechanics",
      order_index: 2,
      content: `### Authenticated Local Security Checks vs External Probing

1. Non-Credentialed (Unauthenticated) Scans:
   - External network probing: Sends TCP/UDP packets to open ports, inspects service banners, and tests web responses.
   - Limitations: Generates high false-positive rates, blind to internal patch levels, and easily blocked by firewalls or IPS rate limiters.

2. Credentialed (Authenticated) Scans:
   - Uses administrative credentials (SSH keys on Linux; WMI / WinRM on Windows) to execute Local Security Checks (LSC).
   - Queries local package managers (\`dpkg -l\`, \`rpm -qa\`), reads Windows registry keys (\`HKLM\\Software\\Microsoft\\Updates\`), and validates exact shared library file hashes on disk.

3. Agent-Based Scanning:
   - Eliminates network credential distribution by executing local lightweight background agents reporting telemetry back to the cloud dashboard.`
    },
    {
      track_id: track1Id,
      title: "Web Application Dynamic Scanning (DAST) and Nuclei Templates",
      order_index: 3,
      content: `### Dynamic Web Application Testing and Fast Community Fuzzers

1. Dynamic Application Security Testing (DAST):
   - Tools: Burp Suite Professional Scanner, OWASP ZAP (Zed Attack Proxy), Acunetix.
   - Passive Scanning: Intercepts HTTP requests and responses without sending new payloads; audits security headers, weak cookies, and information disclosure.
   - Active Scanning: Automated fuzzing engine generating thousands of parameterized payloads to detect SQLi, XSS, and command injection vulnerabilities.

2. Rapid Vulnerability Fuzzing with Nuclei:
   - Open-source, highly parallelized vulnerability engine utilizing community-contributed YAML templates:
\`\`\`yaml
id: cve-2024-enterprise-rce
info:
  name: Enterprise Remote Code Execution
  severity: critical
http:
  - method: GET
    path:
      - "{{BaseURL}}/api/v1/debug?cmd=id"
    matchers:
      - type: word
        words:
          - "uid=0(root)"
\`\`\``
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Vulnerability Prioritization: CVSS v3.1/v4.0, EPSS and CISA KEV",
      order_index: 1,
      content: `### Advanced Vulnerability Prioritization Frameworks

Modern security teams prioritize vulnerabilities by combining severity with real-world exploit likelihood:

1. Common Vulnerability Scoring System (CVSS v3.1 / v4.0):
   - Base Score Metrics: Attack Vector (AV), Attack Complexity (AC), Privileges Required (PR), User Interaction (UI), Scope (S), and Impact on Confidentiality (C), Integrity (I), Availability (A). Score ranges from 0.0 to 10.0.

2. Exploit Prediction Scoring System (EPSS - FIRST.org):
   - Machine-learning model calculating the empirical probability (0.0 to 1.0 / 0% to 100%) that a software vulnerability will be weaponized and actively exploited in the wild within the next 30 days.

3. CISA Known Exploited Vulnerabilities (KEV) Catalog:
   - Authoritative list of CVEs with verified active exploitation in the wild. Establishes mandatory federal remediation timelines (typically 14 calendar days).`
    },
    {
      track_id: track2Id,
      title: "Static Application Security Testing (SAST) and SCA Analysis",
      order_index: 2,
      content: `### Shifting Security Left: Source Code and Dependency Scanning

1. Static Application Security Testing (SAST):
   - Analyzes raw application source code without executing the program (Semgrep, SonarQube, GitHub CodeQL).
   - Identifies dangerous sinks (\`eval()\`, raw SQL concatenation) and unvalidated user inputs directly within developer pull requests.

2. Software Composition Analysis (SCA):
   - Tools: Snyk, OWASP Dependency-Check, Trivy.
   - Inspects package manifest files (\`package.json\`, \`requirements.txt\`, \`pom.xml\`), generating a Software Bill of Materials (SBOM) and alerting on vulnerable transitive open-source dependencies.

3. Secret Detection:
   - Tools: Gitleaks, TruffleHog scanning Git commit histories for exposed private API keys, AWS credentials, and database passwords.`
    },
    {
      track_id: track2Id,
      title: "Container and Cloud Posture Scanners: Trivy, Grype and Prowler",
      order_index: 3,
      content: `### Cloud-Native Infrastructure and Container Image Security

1. Container Image Vulnerability Scanning (Trivy / Grype):
   - Scans container image layers (Docker / OCI) for outdated base image OS packages and embedded application libraries, integrating into CI/CD build pipelines to block deployment of images with Critical CVEs.

2. Cloud Security Posture Management (CSPM):
   - Tools: Prowler, ScoutSuite, AWS Inspector, Prisma Cloud.
   - Audits multi-cloud infrastructure configurations against CIS Cloud Benchmarks:
     - Flagging publicly accessible Amazon S3 buckets.
     - Detecting overly permissive IAM policies (e.g. \`"Action": "*"\`).
     - Auditing disabled CloudTrail audit logs or unencrypted EBS volumes.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "False Positive Analysis, Backported Patches and Scan Tuning",
      order_index: 1,
      content: `### Scanner Calibration and Engineering False-Positive Analysis

1. The Backported Patch Dilemma:
   - Linux enterprise distributions (Debian, Ubuntu, Red Hat Enterprise Linux) routinely backport security fixes into older software releases without incrementing the upstream software version string (e.g. fixing a CVE in Apache 2.4.41 without upgrading to 2.4.52).
   - Version-based scanners generate false positives by looking solely at banner version strings. Credentialed scans resolve this by checking package manager patch build logs (\`changelog\`).

2. Safe Checks vs Destructive Checks:
   - Disabling dangerous plugins (buffer overflows, SYN floods) in production scanning policies to prevent unintentional server crashes.

3. Scan Scheduling and Rate Limiting:
   - Limiting parallel host connections to prevent saturated network links.`
    },
    {
      track_id: track3Id,
      title: "Enterprise Remediation Lifecycles and Service Level Agreements",
      order_index: 2,
      content: `### The Vulnerability Management Lifecycle and Remediation Governance

1. The 5-Stage Vulnerability Lifecycle:
   - Discovery -> Prioritization -> Assessment -> Remediation -> Verification.

2. Industry Standard Remediation Service Level Agreements (SLAs):
   - Critical Severity (CVSS >= 9.0 or CISA KEV Listed): Remediation mandated within 7 to 14 calendar days.
   - High Severity (CVSS 7.0 to 8.9): Remediation mandated within 30 calendar days.
   - Medium Severity (CVSS 4.0 to 6.9): Remediation mandated within 90 calendar days.
   - Low Severity (CVSS < 4.0): Remediation within 180 days or formally documented as acceptable technical debt.`
    },
    {
      track_id: track3Id,
      title: "Compensating Controls, Exception Management and Re-Testing",
      order_index: 3,
      content: `### Risk Exceptions and Automated Verification Rescanning

1. Compensating Controls (Virtual Patching):
   - When immediate software patching is impossible due to operational constraints or vendor delays:
     - Deploying Web Application Firewall (WAF) virtual patch signatures blocking exploit payloads.
     - Applying network microsegmentation to isolate vulnerable hosts.

2. Formal Risk Exception Management:
   - Submitting formal risk acceptance requests documenting business justification, compensating controls, risk evaluation, and explicit expiration dates (maximum 90 days), requiring Chief Information Security Officer (CISO) sign-off.

3. Automated Differential Re-Scanning:
   - Triggering targeted re-scans upon ticket resolution to cryptographically confirm that the vulnerability is closed.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #51.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "What is the primary operational advantage of a 'Credentialed (Authenticated) Vulnerability Scan' compared to an unauthenticated network scan?",
      options: [
        "It costs zero dollars",
        "It runs without a computer",
        "It logs into the operating system to perform Local Security Checks (LSC), inspecting installed package versions and registry keys to eliminate false positives",
        "It deletes all open ports"
      ],
      correct_option_index: 2,
      explanation: "Credentialed scans execute local security checks via SSH or WMI, verifying installed patches on disk with high precision.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What open-source vulnerability scanning engine uses highly parallelized, community-contributed YAML templates to rapidly detect CVEs across web applications?",
      options: [
        "Nuclei",
        "Wireshark",
        "Calculator",
        "Vim"
      ],
      correct_option_index: 0,
      explanation: "Nuclei uses YAML templates to execute fast, customized, community-driven vulnerability and misconfiguration checks.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What security testing methodology analyzes raw source code for security flaws (e.g. with Semgrep or SonarQube) without compiling or executing the software?",
      options: [
        "DAST (Dynamic Application Security Testing)",
        "Penetration Testing",
        "Network Sniffing",
        "SAST (Static Application Security Testing)"
      ],
      correct_option_index: 3,
      explanation: "SAST inspects source code statically before compilation to catch coding flaws and insecure API sinks early in the SDLC.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What authoritative government catalog lists software vulnerabilities with confirmed active exploitation in the wild, establishing strict 14-day federal patching deadlines?",
      options: [
        "Wikipedia",
        "CISA Known Exploited Vulnerabilities (KEV) Catalog",
        "Stack Overflow",
        "GitHub Trending"
      ],
      correct_option_index: 1,
      explanation: "The CISA KEV catalog tracks CVEs actively exploited by threat actors, mandating expedited remediation timelines.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "Under standard enterprise vulnerability management SLAs, what is the mandatory remediation timeframe for Critical severity vulnerabilities (CVSS >= 9.0)?",
      options: [
        "Within 5 years",
        "Never",
        "Within 7 to 14 calendar days",
        "Within 365 days"
      ],
      correct_option_index: 2,
      explanation: "Industry best practices and regulatory baselines require remediating Critical vulnerabilities within 7 to 14 calendar days.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "What prioritization metric created by FIRST.org uses machine learning to calculate the empirical probability (0% to 100%) that a CVE will be weaponized in the wild within 30 days?",
      options: [
        "CPU Benchmark",
        "Exploit Prediction Scoring System (EPSS)",
        "Base CVSS Score",
        "Lines of Code (LOC)"
      ],
      correct_option_index: 1,
      explanation: "EPSS forecasts real-world exploitation likelihood using statistical models, helping teams prioritize high-risk vulnerabilities.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "Why do vulnerability scanners frequently generate 'False Positives' against enterprise Linux distributions (such as Debian, Ubuntu, or RHEL) when performing banner-only scans?",
      options: [
        "Because Linux has no security vulnerabilities",
        "Because Linux servers run on batteries",
        "Because scanners cannot connect to Linux",
        "Enterprise Linux vendors backport security patches into older software versions without changing the upstream version string; banner scanners flag the version as vulnerable even though the fix is applied"
      ],
      correct_option_index: 3,
      explanation: "Backported security fixes patch vulnerabilities without incrementing major version numbers, causing banner-based scanners to report false positives.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In software supply chain security, what is the primary role of Software Composition Analysis (SCA) tools (such as Snyk or OWASP Dependency-Check)?",
      options: [
        "To scan package manifests (package.json, pom.xml) and build dependencies, generating an SBOM and alerting on known open-source CVEs",
        "To compress image files",
        "To format source code indentation",
        "To write unit tests"
      ],
      correct_option_index: 0,
      explanation: "SCA scans third-party open-source libraries and transitive dependencies to identify known vulnerabilities in the supply chain.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What open-source tool is widely used to audit AWS, Azure, and GCP multi-cloud infrastructure configurations against CIS Cloud Benchmarks (Cloud Security Posture Management)?",
      options: [
        "Photoshop",
        "Calculator",
        "Prowler (or ScoutSuite)",
        "Nmap"
      ],
      correct_option_index: 2,
      explanation: "Prowler audits cloud environments against CIS benchmarks, identifying misconfigurations like public S3 buckets or permissive IAM roles.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "When an immediate vendor software patch is not yet available for a zero-day vulnerability, what 'Compensating Control' technique temporarily protects the application?",
      options: [
        "Deleting the database",
        "Virtual Patching (deploying custom Web Application Firewall - WAF rules or network segmentation to block exploit payloads)",
        "Turning off computer monitors",
        "Ignoring the vulnerability"
      ],
      correct_option_index: 1,
      explanation: "Virtual patching deploys WAF filter rules to drop exploit payloads at the network boundary while waiting for vendor source code patches.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "What is the key structural difference between CVSS Base metrics and CVSS Temporal/Threat metrics?",
      options: [
        "Base metrics are calculated in Japanese; Threat metrics in English",
        "Threat metrics cannot be calculated by computers",
        "Base metrics only apply to mobile phones",
        "Base metrics evaluate constant qualities of the vulnerability over time and environments (e.g. Attack Vector, Impact), whereas Temporal/Threat metrics adjust scores based on real-world exploit maturity and remediation availability"
      ],
      correct_option_index: 3,
      explanation: "Base metrics capture inherent vulnerability attributes, while Threat/Temporal metrics factor in exploit code maturity and available workarounds.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In container security, what does a tool like Trivy or Grype inspect within a Docker/OCI container image to detect vulnerabilities?",
      options: [
        "It unpacks all container filesystem layers, inspecting installed operating system packages (apk, deb, rpm) and language dependencies (npm, pip, maven) against vulnerability databases",
        "It measures container network speed",
        "It counts the number of files on the host computer",
        "It changes the container root password"
      ],
      correct_option_index: 0,
      explanation: "Container scanners parse the layer filesystems to identify vulnerable OS libraries and application dependencies before deployment.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In vulnerability scanner policy configuration, why must 'Safe Checks' be enabled and destructive checks disabled during production asset scans?",
      options: [
        "Safe checks make the scanner run faster",
        "Destructive checks cost more money",
        "Destructive checks intentionally send high-volume payload overflows or denial-of-service conditions that can crash production databases and services",
        "Safe checks only scan port 80"
      ],
      correct_option_index: 2,
      explanation: "Disabling destructive checks prevents scanners from sending dangerous exploits that could crash mission-critical production servers.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In software security pipelines, what tool scans Git commit histories, branches, and pull requests to detect inadvertently hardcoded API keys and private certificates?",
      options: [
        "Docker",
        "Gitleaks (or TruffleHog)",
        "Nessus",
        "Burp Suite"
      ],
      correct_option_index: 1,
      explanation: "Gitleaks and TruffleHog scan repositories using regex and entropy checks to detect committed secrets and private keys.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In vulnerability governance, what must a formal 'Risk Exception' request contain when a critical system cannot be patched within the mandatory SLA?",
      options: [
        "Documented business justification, specific technical compensating controls, residual risk analysis, and an explicit time-bound expiration date (typically <= 90 days) signed by executive leadership",
        "A verbal promise from the developer",
        "A blank sheet of paper",
        "An email asking the auditor to forget about it"
      ],
      correct_option_index: 0,
      explanation: "Formal risk exceptions require executive sign-off, clear compensating controls, risk analysis, and strict expiration dates.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #51.");
  console.log("Skill #51 update completed successfully!");
}

run();
