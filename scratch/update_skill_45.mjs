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

const skillId = "949799ed-7948-4a7e-9480-3b03d60ee2b9";

async function run() {
  console.log("Updating Skill #45: Incident Response (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Incident Response Lifecycles, Volatile Memory and Forensic Acquisition" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Host Artifact Forensics, Lateral Movement and Adversary Eradication" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Crisis Management, Regulatory Disclosures and Blameless Post-Mortems" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / SANS FOR508 Incident Response level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The IR Lifecycle: NIST SP 800-61r2 and SANS PICERL Frameworks",
      order_index: 1,
      content: `### Architecture and Phased Execution of Enterprise Incident Response

Incident responders structure response workflows around standardized industry lifecycles (NIST SP 800-61r2 and SANS PICERL):

1. The Six SANS PICERL Phases:
   - 1. Preparation: Establishing out-of-band communication channels (Signal/offline war rooms), incident response playbooks, pre-configured forensic jump kits, and pre-deployed EDR agents.
   - 2. Identification: Validating security alerts, scoping adversary dwell time, and identifying patient zero and compromised accounts.
   - 3. Containment: Short-term tactical isolation (EDR network quarantine, revoking active sessions) vs Long-term containment (firewall microsegmentation, deploying clean DMZ proxies).
   - 4. Eradication: Purging all malware artifacts, terminating backdoors, removing rogue scheduled tasks/WMI persistence, and resetting compromised credentials.
   - 5. Recovery: Phased restoration from verified clean golden images, system integrity validation, and heightened 24/7 telemetry monitoring.
   - 6. Lessons Learned: Conducting blameless post-mortems, publishing SMART remediation items, and updating detection signatures.`
    },
    {
      track_id: track1Id,
      title: "Digital Forensics: Order of Volatility and Chain of Custody",
      order_index: 2,
      content: `### Forensic Evidence Preservation and Legal Admissibility

1. Order of Volatility (RFC 3227):
   - Evidence must be acquired in order from most volatile (perishable) to least volatile:
     - 1. CPU registers and CPU cache.
     - 2. Routing tables, ARP cache, process tables, kernel memory.
     - 3. Temporary file systems and RAM (Random Access Memory).
     - 4. Physical disk storage (SSDs / HDDs).
     - 5. Remote logging data and network flow records.
     - 6. Physical backup media and optical archival disks.

2. Bit-Stream Forensic Acquisition:
   - Hardware write-blockers (Tableau) preventing physical write alterations during acquisition.
   - Generating bit-for-bit raw/E01 disk images (FTK Imager, \`dc3dd\`).
   - Calculating cryptographic SHA-256 verification hashes immediately before and after acquisition to prove forensically sound integrity in court.

3. Chain of Custody:
   - Detailed legal logging tracking evidence handlers, timestamps, physical locker security, and transfer custody documentation.`
    },
    {
      track_id: track1Id,
      title: "Volatile Memory Forensics: Volatility 3 and Shellcode Analysis",
      order_index: 3,
      content: `### In-Memory Artifact Acquisition and Volatility 3 Analysis

1. Live Memory Acquisition:
   - Capturing raw RAM images using specialized kernel drivers (WinPmem, DumpIt, LiME for Linux) while minimizing operating system footprint.

2. Volatility 3 Forensic Framework Analysis:
   - \`windows.pslist\` & \`windows.pstree\`: Reconstructs complete parent-child process execution trees; identifies unlinked stealth processes hidden via Direct Kernel Object Manipulation (DKOM).
   - \`windows.malfind\`: Scans process Virtual Address Descriptor (VAD) memory trees for pages allocated with \`PAGE_EXECUTE_READWRITE\` (RWX) permissions containing unmapped injected shellcode or reflective DLLs.
   - \`windows.netscan\`: Recovers active, closed, and hidden TCP/UDP network sockets directly from kernel memory pools, revealing Command and Control (C2) IPs linked to process IDs.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Windows Artifact Forensics: Prefetch, Shimcache and NTFS $MFT",
      order_index: 1,
      content: `### Windows Host Artifact Analysis and Anti-Forensic Detection

1. Execution Evidence Artifacts:
   - Windows Prefetch (\`C:\\Windows\\Prefetch\\*.pf\`): Records application execution evidence including binary name, run count, last 8 execution timestamps, and referenced DLLs.
   - Shimcache (AppCompatCache) & Amcache (\`Amcache.hve\`): Tracks application execution metadata (full file path, file size, SHA-1 hash, first execution time) even if the binary was deleted from the disk by the adversary.

2. NTFS Filesystem Forensics:
   - Master File Table ($MFT): Contains \$STANDARD_INFORMATION and \$FILE_NAME timestamp attributes.
   - Detecting 'Timestomping': Comparing \$STANDARD_INFORMATION (user-modifiable) against \$FILE_NAME (kernel-restricted) timestamps to reveal anti-forensic timestamp alteration.
   - Shellbags and Jump Lists: Proves user folder browsing and manual opening of exfiltrated data files.`
    },
    {
      track_id: track2Id,
      title: "Lateral Movement Forensics: Pass-the-Hash and Kerberoasting",
      order_index: 2,
      content: `### Investigating Lateral Adversary Traversal in Active Directory

1. Lateral Movement Vectors:
   - Pass-the-Hash (PtH): Reusing harvested NTLM password hashes across SMB to authenticate as local administrator (Event ID 4624 Type 3 network logon with NTLM authentication package).
   - Pass-the-Ticket (PtT): Forging forged Kerberos Silver Tickets (service-level access) or Golden Tickets (complete Active Directory domain dominance).

2. Kerberoasting Investigations:
   - Identifying adversaries requesting Kerberos TGS service tickets for Service Principal Names (SPNs) using weak RC4-HMAC encryption (\`0x17\`) to crack plaintext passwords offline (spikes in Event ID 4769).

3. PsExec and Remote WMI:
   - Tracking lateral execution tools spawning \`PSEXESVC.exe\` or invoking \`wmic process call create\` over RPC/WinRM.`
    },
    {
      track_id: track2Id,
      title: "Adversary Eradication: Persistence Removal and Golden Ticket Eviction",
      order_index: 3,
      content: `### Comprehensive Remediation and Active Directory Forest Recovery

1. Eradicating Advanced Persistence Mechanisms:
   - Registry Run Keys: Inspecting \`HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\` and user profile RunOnce keys.
   - WMI Event Subscriptions: Auditing \`__EventFilter\`, \`__EventConsumer\`, and \`__FilterToConsumerBinding\` objects executing persistent fileless scripts on system events.
   - Scheduled Tasks: Inspecting \`C:\\Windows\\System32\\Tasks\` for malicious scheduled jobs.

2. The Active Directory KRBTGT Double-Reset Protocol:
   - When an adversary mints a Kerberos Golden Ticket, changing administrator passwords fails to revoke access.
   - Remediation Protocol: The Active Directory \`krbtgt\` service account password must be reset TWICE, separated by a 10 to 12-hour synchronization window, completely invalidating all forged Kerberos tickets across the entire forest.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Incident Triage, Severity Classification and Out-of-Band War Rooms",
      order_index: 1,
      content: `### Crisis Operations and Incident Command Architecture

1. Incident Severity Matrix:
   - SEV1 (Critical Breach): Active ransomware encryption, broad data exfiltration, domain controller compromise. Activates executive response team.
   - SEV2 (High Severity): Isolated system compromise with lateral movement risk.
   - SEV3 / SEV4 (Medium/Low): Contained malware infection without privilege escalation.

2. Out-of-Band Communications:
   - Mandating isolated communication tools (encrypted Signal groups, dedicated out-of-band video conferencing) during active investigations.
   - Prevents sophisticated adversaries with corporate Microsoft Exchange or Teams access from monitoring defensive containment discussions.`
    },
    {
      track_id: track3Id,
      title: "Regulatory Notification Frameworks: GDPR, SEC and State Laws",
      order_index: 2,
      content: `### Mandatory Legal Reporting and Regulatory Compliance

1. Global Data Breach Notification Standards:
   - European Union GDPR Article 33: Mandatory breach notification to the Data Protection Authority (DPA) within 72 hours of becoming aware of a personal data breach.
   - SEC Form 8-K Cybersecurity Disclosure: Mandates public disclosure within 4 business days of determining that a cybersecurity breach has material impact on investors.
   - US State Data Breach Laws: Statutory notification to affected individuals and State Attorneys General (typically within 30 to 45 days).

2. Coordination with Legal Counsel and Law Enforcement:
   - Engaging outside breach counsel to maintain Attorney-Client Privilege across technical investigation reports and coordinating with federal law enforcement (FBI Cyber Division / CISA).`
    },
    {
      track_id: track3Id,
      title: "Post-Incident Review, Blameless Post-Mortems and SMART Governance",
      order_index: 3,
      content: `### Transforming Breaches into Defensive Hardening

1. Blameless Post-Mortem Methodology:
   - Focusing on systemic design vulnerabilities, detection visibility gaps, and process bottlenecks rather than assigning individual blame to employees.

2. SMART Remediation Governance:
   - Tracking corrective action items:
     - Specific (e.g. Enforce FIDO2 hardware MFA on all AWS root accounts).
     - Measurable (100% compliance across all 500 administrators).
     - Achievable with allocated budget.
     - Relevant to closing the initial attack vector.
     - Time-bound (Completed within 14 calendar days).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #45.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "According to the Order of Volatility (RFC 3227) in digital forensics, what evidence source is the MOST volatile and must be captured first before system shutdown?",
      options: [
        "Hard drive backups",
        "Printed paper logs",
        "CPU registers, cache, and system RAM (Random Access Memory)",
        "Optical CD-ROM discs"
      ],
      correct_option_index: 2,
      explanation: "CPU registers and system RAM lose data immediately when power is cut, making them the most volatile digital evidence.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What are the six sequential phases of the SANS 'PICERL' Incident Response framework?",
      options: [
        "Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned",
        "Program, Install, Compile, Execute, Reboot, Log",
        "Protect, Inspect, Catch, Eliminate, Return, Lock",
        "Plan, Inform, Check, Exit, Report, Leave"
      ],
      correct_option_index: 0,
      explanation: "PICERL stands for Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "Why do digital forensics investigators use hardware write-blockers (such as Tableau devices) when imaging suspect storage media?",
      options: [
        "To speed up internet connections",
        "To delete malware from the drive",
        "To cool down the physical disk",
        "To physically prevent any write modifications to the evidence drive during bit-stream imaging, preserving legal integrity"
      ],
      correct_option_index: 3,
      explanation: "Hardware write-blockers intercept write commands, ensuring the original evidence drive remains completely unaltered during acquisition.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "Under European Union GDPR Article 33 regulations, what is the mandatory timeframe for notifying the Data Protection Authority (DPA) after becoming aware of a personal data breach?",
      options: [
        "Within 1 year",
        "Within 72 hours",
        "Within 30 days",
        "Never"
      ],
      correct_option_index: 1,
      explanation: "GDPR Article 33 mandates reporting qualifying personal data breaches to regulatory authorities within 72 hours of discovery.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In digital forensic analysis, what Windows artifact located in 'C:\\Windows\\Prefetch' provides evidence of application execution, run counts, and last 8 execution timestamps?",
      options: [
        "Windows Registry",
        "Recycle Bin",
        "Prefetch Files (*.pf)",
        "System Log"
      ],
      correct_option_index: 2,
      explanation: "Prefetch files (*.pf) record execution evidence, run counts, execution timestamps, and referenced DLLs for executed binaries.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In the Volatility 3 memory analysis framework, what plugin scans process VAD memory trees for pages allocated with 'PAGE_EXECUTE_READWRITE' (RWX) permissions containing unmapped injected shellcode?",
      options: [
        "windows.info",
        "windows.malfind",
        "windows.driverscan",
        "windows.registry"
      ],
      correct_option_index: 1,
      explanation: "The windows.malfind plugin identifies hidden or injected code in process memory by locating memory pages with RWX permissions.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "Why must an incident response team use out-of-band communication channels (such as Signal or isolated conference bridges) during an active intrusion investigation?",
      options: [
        "Because corporate email is too expensive",
        "To make phone calls louder",
        "Because cell towers do not work on computers",
        "To prevent advanced adversaries who have compromised corporate email, Slack, or Microsoft Teams from eavesdropping on defensive containment plans"
      ],
      correct_option_index: 3,
      explanation: "Out-of-band communications prevent attackers with administrative access to enterprise collaboration tools from anticipating containment actions.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In Windows NTFS forensics, how do investigators detect anti-forensic 'Timestomping' (where an attacker altered file creation dates to match system files)?",
      options: [
        "By comparing the user-modifiable $STANDARD_INFORMATION attribute timestamps against the kernel-restricted $FILE_NAME attribute timestamps in the $MFT",
        "By restarting the computer",
        "By looking at the clock on the wall",
        "By checking the file name length"
      ],
      correct_option_index: 0,
      explanation: "Timestomping tools alter $STANDARD_INFORMATION timestamps, but NTFS automatically maintains authentic timestamps in the $FILE_NAME attribute.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "When an adversary has forged an Active Directory Kerberos Golden Ticket, why is resetting the domain administrator password completely ineffective at evicting them?",
      options: [
        "Because domain administrators cannot be reset",
        "Because passwords have no effect on computers",
        "Golden Tickets are signed with the secret hash of the KRBTGT service account; access can only be revoked by resetting the KRBTGT account password TWICE",
        "Because Active Directory cannot be repaired"
      ],
      correct_option_index: 2,
      explanation: "Golden Tickets are forged using the krbtgt account key; performing a double KRBTGT password reset invalidates all forged tickets forest-wide.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "Under the US SEC 2023 cybersecurity disclosure rules, what is the mandatory deadline for public companies to file a Form 8-K disclosure once an incident is determined to be 'material'?",
      options: [
        "Within 90 business days",
        "Within 4 business days",
        "Within 1 year",
        "Only after law enforcement solves the case"
      ],
      correct_option_index: 1,
      explanation: "The SEC mandates public Form 8-K disclosure within 4 business days following the determination of materiality.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "In Active Directory lateral movement forensics, what event log signature indicates an active 'Kerberoasting' attack?",
      options: [
        "Zero events in the security log",
        "Event ID 1102 log wipe",
        "Event ID 4624 Logon Type 2",
        "A large burst of Event ID 4769 (Kerberos Service Ticket TGS Request) specifically requesting weak RC4-HMAC (Ticket Encryption Type 0x17) for accounts with Service Principal Names"
      ],
      correct_option_index: 3,
      explanation: "Kerberoasting generates bursts of Event ID 4769 requesting RC4-HMAC tickets for SPN accounts to perform offline password cracking.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Windows forensic analysis, what execution artifact tracks executable file metadata (path, size, SHA-1 hash, first execution time) even if the executable file was deleted from disk?",
      options: [
        "Shimcache (AppCompatCache) and Amcache (Amcache.hve)",
        "System Volume Information",
        "Windows Media Player logs",
        "Desktop icons"
      ],
      correct_option_index: 0,
      explanation: "Shimcache and Amcache record metadata and hashes for executed binaries in the registry, persisting even after file deletion.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In live memory forensics, what technique does an adversary use when hiding processes from standard operating system APIs by unlinking the process EPROCESS block from the ActiveProcessLinks double-linked list?",
      options: [
        "Phishing",
        "SQL Injection",
        "Direct Kernel Object Manipulation (DKOM)",
        "Buffer Overflow"
      ],
      correct_option_index: 2,
      explanation: "DKOM modifies kernel data structures directly (unlinking EPROCESS blocks from ActiveProcessLinks), hiding processes from Task Manager.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In post-incident governance, why is adopting a 'Blameless Post-Mortem' methodology superior to punitive fault-finding?",
      options: [
        "Because nobody made any mistakes",
        "It encourages transparent disclosure of operational failures, focusing on identifying systemic design flaws, detection blindspots, and process improvements rather than punishing individuals",
        "To save money on legal fees",
        "Because blameless post-mortems take less time"
      ],
      correct_option_index: 1,
      explanation: "Blameless post-mortems cultivate psychological safety, uncovering true root causes and improving institutional resilience.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "Why must the Active Directory KRBTGT password reset be executed TWICE, separated by a 10 to 12-hour replication interval, during adversary eviction?",
      options: [
        "Active Directory retains both current and previous KRBTGT password hashes to maintain Kerberos ticket validity during password changes; resetting twice flushes all previously minted Golden Tickets while allowing legitimate tickets to refresh",
        "Because Microsoft Windows requires two passwords for all accounts",
        "To make the server reboot twice",
        "Because the first reset is always ignored by domain controllers"
      ],
      correct_option_index: 0,
      explanation: "AD stores current and previous password hashes for krbtgt; resetting twice invalidates both hashes, terminating all forged Golden Tickets.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #45.");
  console.log("Skill #45 update completed successfully!");
}

run();
