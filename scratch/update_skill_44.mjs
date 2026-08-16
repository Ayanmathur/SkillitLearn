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

const skillId = "9eedab04-116c-45f2-a3b5-77a20d06a33d";

async function run() {
  console.log("Updating Skill #44: SIEM & Log Analysis (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: SIEM Architecture, Ingestion Pipelines and Schema Normalization" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Endpoint Forensics, Linux auditd and Network Flow Telemetry" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Detection Engineering, Sigma Rules, UEBA and SOAR Playbooks" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / SANS SEC555 Security Analytics level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "SIEM Data Architecture: Ingestion, Storage Tiers and Retention",
      order_index: 1,
      content: `### Architecture and Lifecycle of Security Information and Event Management (SIEM)

Modern Security Operations Centers (SOC) rely on SIEM platforms (Splunk Enterprise, Microsoft Sentinel, Elastic Security, Wazuh) to aggregate and analyze enterprise telemetry:

1. End-to-End Ingestion Pipeline Architecture:
   - Collection Layer: Lightweight agents and log forwarders (Splunk Universal Forwarder, Elastic Beats, Fluentbit, Vector) shipping endpoint logs.
   - Buffering & Ingestion Queue: Apache Kafka or Redis clusters absorbing high-volume event bursts (50,000+ EPS) to prevent log dropper data loss.
   - Indexing & Storage Engine: Distributed parsing nodes executing timestamp extraction, schema mapping, and inverted index generation.
   - Analytics Layer: Search heads executing correlation rules and threat hunting queries.

2. Storage Lifecycle Tiering:
   - Hot Storage (NVMe / SSD): High-speed indexed data spanning the last 30 days for sub-second real-time alert evaluation.
   - Warm Storage (Standard SSD): Searchable data from 31 to 90 days for forensic investigations.
   - Cold / Frozen Storage (Object Storage S3/GCS): Compressed, unindexed archives retained for 1 to 7 years to satisfy regulatory compliance (PCI-DSS, HIPAA, SOX).`
    },
    {
      track_id: track1Id,
      title: "Log Ingestion Protocols: Syslog RFC 5424, Sysmon and Windows WEF",
      order_index: 2,
      content: `### Telemetry Ingestion Protocols and Advanced Endpoint Auditing

1. Syslog Standard Architecture (RFC 5424 / RFC 3164):
   - Transmitted securely over TLS (TCP port 6514) with structured metadata.
   - Facility Codes (0-kern, 1-user, 4-auth, 10-authpriv, 16-local0) and Numerical Severity Levels (0-Emergency to 7-Debug).

2. Microsoft System Monitor (Sysmon):
   - Advanced kernel-level Windows telemetry bridging visibility gaps:
     - Event ID 1 (Process Creation): Logs full command-line arguments, parent process GUID, user context, and SHA-256 image hashes.
     - Event ID 3 (Network Connection): Outbound TCP/UDP sockets mapped to initiating process IDs.
     - Event ID 7 (Image Loaded): Detects DLL injection and DLL side-loading.
     - Event ID 11 (File Creation): Identifies ransomware dropped files.
     - Event ID 22 (DNS Query): Logs outbound domain lookups initiated by non-browser binaries.

3. Windows Event Forwarding (WEF):
   - Native Kerberos-authenticated push/pull architecture aggregating security events from thousands of domain-joined endpoints without third-party agents.`
    },
    {
      track_id: track1Id,
      title: "Schema Normalization: Elastic Common Schema (ECS) and OCSF",
      order_index: 3,
      content: `### Overcoming Heterogeneous Log Taxonomies with Universal Schemas

1. The Log Taxonomy Problem:
   - A Cisco firewall logs an IP as \`src_ip\`, an Apache web server logs \`client_ip\`, a Windows DC logs \`IpAddress\`, and AWS CloudTrail logs \`sourceIPAddress\`.
   - Without universal schema normalization, writing a single correlation rule requires chaining dozens of vendor-specific field queries.

2. Universal Normalization Standards:
   - Elastic Common Schema (ECS) & Open Cybersecurity Schema Framework (OCSF):
     - Maps disparate logs into unified semantic taxonomies: \`source.ip\`, \`destination.port\`, \`user.name\`, \`process.parent.executable\`, \`event.action\`.

3. Ingestion-Time Parsing and Enrichment:
   - Logstash / Ingest Pipelines parsing raw text with Grok patterns and regular expressions, enriching raw events with MaxMind GeoIP location data, ASN reputation scores, and Active Directory department tags before disk indexing.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Windows Security Event Forensics: Logon Types and Process Trees",
      order_index: 1,
      content: `### Windows Security Event Log Forensics for Threat Analysts

1. Critical Windows Security Event IDs:
   - Event ID 4624 (Successful Logon) & 4625 (Failed Logon):
     - Logon Type 2 (Interactive - physical keyboard login).
     - Logon Type 3 (Network - SMB connection, lateral movement, PsExec).
     - Logon Type 4 (Batch - scheduled tasks).
     - Logon Type 5 (Service - background service start).
     - Logon Type 10 (RemoteInteractive - Remote Desktop Protocol / RDP).
   - Event ID 4688 (Process Creation): Tracking suspicious child processes spawned by Microsoft Office (\`winword.exe\` spawning \`powershell.exe\` or \`cmd.exe\`).
   - Event ID 4720 (User Created) & 4728 (Member Added to Privileged Group e.g. Domain Admins).
   - Event ID 4697 / 7045 (Service Installed - persistence indicator).
   - Event ID 1102 / 104 (Audit Log Cleared - defense evasion indicator).`
    },
    {
      track_id: track2Id,
      title: "Linux System Forensics: auditd Rules and eBPF Telemetry",
      order_index: 2,
      content: `### Linux Kernel-Level Auditing and System Call Interception

1. Linux Audit Daemon (\`auditd\`):
   - Operates in Linux kernel space, monitoring system calls and filesystem access:
     - Monitoring critical security files: \`-w /etc/shadow -p wa -k shadow_modification\`
     - Monitoring privilege escalation: \`-a always,exit -F arch=b64 -S execve -F euid=0 -k root_command_execution\`
   - The \`/var/log/audit/audit.log\` provides forensically sound audit trails including PID, PPID, UID, EUID, terminal (tty), and executable paths.

2. Modern eBPF Telemetry (Tetragon / Falco):
   - In-kernel sandboxed eBPF bytecode intercepting system calls directly at the kernel tracepoint layer.
   - Detects namespace escapes, dynamic rootkit installations, and unauthorized memory modifications with near-zero CPU overhead.`
    },
    {
      track_id: track2Id,
      title: "Network Flow Telemetry: Zeek, Suricata and Beaconing Analytics",
      order_index: 3,
      content: `### Network Security Monitoring and Command & Control (C2) Detection

1. Zeek Network Telemetry:
   - Generates structured, transaction-oriented protocol logs: \`conn.log\` (connection state, duration, bytes), \`http.log\` (URI, user-agent), \`ssl.log\` (TLS certificates, SNI), and \`dns.log\`.
   - JA3 / JA3S Cryptographic Fingerprinting: Creates MD5 hashes of client TLS hello parameters (cipher suites, extensions, elliptic curves), identifying malware C2 clients (e.g. Cobalt Strike) even when communicating over valid HTTPS.

2. Detecting Command and Control (C2) Beaconing:
   - Calculating statistical inter-arrival time frequency: Identifying recurring periodic HTTP/DNS connections exhibiting fixed intervals with low jitter (e.g. beacon every 60s +/- 5s).

3. DNS Tunneling and Exfiltration:
   - Flagging high-entropy domain lookups (\`7f8a9b2c.data.attacker.com\`), unusually large TXT/NULL record query volumes, and rapid NXDOMAIN bursts.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Detection Engineering: Sigma Rules, YARA-L, KQL and SPL",
      order_index: 1,
      content: `### Detection Engineering and Query Formulation

1. Vendor-Neutral Sigma Signatures:
   - Generic YAML-based detection format translated across multiple SIEM query engines:
\`\`\`yaml
title: Suspicious PowerShell Encoded Command
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        Image|endswith: '\\powershell.exe'
        CommandLine|contains:
            - '-enc'
            - '-EncodedCommand'
            - 'FromBase64String'
    condition: selection
severity: high
\`\`\`

2. Splunk Search Processing Language (SPL):
\`\`\`spl
index=windows EventCode=4625 | stats count by user, src_ip | where count > 10 | sort - count
\`\`\`

3. Microsoft Kusto Query Language (KQL):
\`\`\`kql
DeviceProcessEvents
| where InitiatingProcessFileName =~ "excel.exe" and FileName in~ ("cmd.exe", "powershell.exe")
| project Timestamp, DeviceName, AccountName, ProcessCommandLine
\`\`\``
    },
    {
      track_id: track3Id,
      title: "User and Entity Behavior Analytics (UEBA) and Anomaly Detection",
      order_index: 2,
      content: `### Machine Learning and Behavioral Telemetry Analytics

1. Beyond Static Threshold Alerting:
   - Static threshold rules (e.g. 'Alert if failed logins > 5') fail to detect low-and-slow attacks and cause massive false-positive alert fatigue.

2. UEBA Behavioral Baseline Modeling:
   - Establishing baseline statistical profiles for users and entities (typical working hours, normal login geolocation, regular data transfer volumes, and accessed database tables).
   - Peer Group Analysis: Identifying behavioral outliers within organizational cohorts (e.g. an HR representative accessing GitHub code repositories, which is abnormal compared to their HR peer group).

3. Impossible Travel Telemetry:
   - Detecting successful account authentications from geographically distant locations within a physically impossible timeframe (e.g. login from London followed by login from Sydney 45 minutes later).`
    },
    {
      track_id: track3Id,
      title: "Security Orchestration, Automation and Response (SOAR) Playbooks",
      order_index: 3,
      content: `### Automated Triage and Incident Response Orchestration

1. SOAR Architecture (Splunk SOAR, Cortex XSOAR, Microsoft Sentinel):
   - Automates repetitive Tier 1 analyst workflows, slashing Mean Time to Respond (MTTR) from hours to seconds.

2. Automated Phishing Triage Playbook:
   - Step 1: Ingests suspicious email forwarded by employee.
   - Step 2: Extracts embedded URLs, attachments, and headers; queries VirusTotal, URLScan, and threat intelligence feeds.
   - Step 3: Detonates attachments in an isolated sandbox environment.
   - Step 4: If malicious, searches enterprise mailboxes across 10,000 inboxes for identical message hashes and purges them automatically.
   - Step 5: Blocks the malicious sender domain on perimeter firewalls and notifies the user within 15 seconds.

3. Automated Host Isolation:
   - EDR API automation quarantining infected endpoints from the local network upon detection of active ransomware encryption.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #44.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In Microsoft Sysmon endpoint auditing, what critical Event ID logs process creation along with full command-line arguments and cryptographic image hashes?",
      options: [
        "Event ID 1 (Process Creation)",
        "Event ID 4624",
        "Event ID 999",
        "Event ID 0"
      ],
      correct_option_index: 0,
      explanation: "Sysmon Event ID 1 captures rich process execution telemetry including command-line strings, parent processes, and file hashes.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In Windows Security Event logs, what Logon Type recorded in Event ID 4624 indicates a Remote Desktop Protocol (RDP) network session?",
      options: [
        "Logon Type 2 (Interactive)",
        "Logon Type 3 (Network)",
        "Logon Type 10 (RemoteInteractive)",
        "Logon Type 5 (Service)"
      ],
      correct_option_index: 2,
      explanation: "Logon Type 10 specifically denotes a RemoteInteractive session (RDP terminal connection into the host).",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What open-source schema standard maps disparate vendor log formats (firewalls, web servers, cloud logs) into unified, standardized field names across the enterprise?",
      options: [
        "HTML5",
        "Open Cybersecurity Schema Framework (OCSF) and Elastic Common Schema (ECS)",
        "ASCII Format",
        "MP3 Standard"
      ],
      correct_option_index: 1,
      explanation: "OCSF and ECS normalize diverse log sources into consistent field taxonomies (e.g. source.ip, user.name) for universal query rules.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What universal YAML-based signature format enables detection engineers to write threat detection rules once and compile them across Splunk, Sentinel, and Elastic SIEMs?",
      options: [
        "JSON",
        "Markdown",
        "SQL",
        "Sigma"
      ],
      correct_option_index: 3,
      explanation: "Sigma is the generic open-source signature format that converts into native query languages across multiple SIEM backends.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In SIEM storage architecture, what tier consists of fast NVMe/SSD storage containing indexed data for the last 30 days to evaluate real-time correlation rules?",
      options: [
        "Hot Storage Tier",
        "Frozen Archive Tier",
        "Paper Backup Tier",
        "Cold Storage Tier"
      ],
      correct_option_index: 0,
      explanation: "Hot storage utilizes ultra-fast solid-state media for real-time alerting and active searching on recent event streams.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In network security telemetry, what is 'JA3 / JA3S Cryptographic Fingerprinting' and how does it identify malware communications?",
      options: [
        "It measures internet wire thickness",
        "It translates network packets into Japanese",
        "It blocks all websites on weekends",
        "It generates MD5 hashes of client TLS Client Hello parameters (ciphers, extensions, curves), identifying malicious C2 clients regardless of changing domain names or IPs"
      ],
      correct_option_index: 3,
      explanation: "JA3 fingerprints the unique combination of TLS client hello parameters, allowing analysts to identify specific malware binaries over encrypted HTTPS.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In User and Entity Behavior Analytics (UEBA), what is an 'Impossible Travel' anomaly alert?",
      options: [
        "A user who books a flight to Mars",
        "Detecting successful account logins from geographically distant locations within a timeframe that is physically impossible to travel (e.g. London and Tokyo within 45 minutes)",
        "A computer without a network card",
        "An expired airline ticket"
      ],
      correct_option_index: 1,
      explanation: "Impossible travel detects account compromise when authentication origins span impossible distances faster than commercial air travel.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In Linux system security monitoring, what command-line syntax in '/etc/audit/rules.d/audit.rules' establishes a persistent kernel watch on the '/etc/shadow' password file?",
      options: [
        "-w /etc/shadow -p wa -k shadow_modification",
        "cat /etc/shadow",
        "rm -rf /etc/shadow",
        "chmod 777 /etc/shadow"
      ],
      correct_option_index: 0,
      explanation: "-w /etc/shadow -p wa -k shadow_modification sets a file write/attribute audit watch with a searchable key in auditd.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In Security Orchestration, Automation and Response (SOAR), what is the primary operational advantage of an automated phishing triage playbook?",
      options: [
        "It prints out all emails on paper",
        "It sends spam emails to customers",
        "It extracts IOCs, detonates attachments in sandboxes, purges identical emails across 10,000 mailboxes, and blocks sender domains in seconds without manual analyst effort",
        "It crashes the email server"
      ],
      correct_option_index: 2,
      explanation: "SOAR automates repetitive investigation and containment workflows, slashing response times from hours to seconds.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In Windows endpoint monitoring, why is Event ID 4688 (Process Creation) with Command-Line Process Auditing enabled critical for detecting living-off-the-land attacks?",
      options: [
        "It counts how many times the mouse was clicked",
        "It measures computer monitor brightness",
        "It plays a sound when an app opens",
        "It captures full obfuscated command-line execution strings (e.g. powershell.exe -enc ... or certutil -urlcache), exposing malicious scripts using native system binaries"
      ],
      correct_option_index: 3,
      explanation: "Command-line auditing in Event 4688 captures encoded scripts and command arguments used by adversaries in living-off-the-land techniques.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "How do statistical time-series algorithms in SIEM systems detect stealthy Command and Control (C2) beaconing over legitimate HTTPS or DNS traffic?",
      options: [
        "By turning off the network",
        "By analyzing inter-arrival time intervals between consecutive connection sessions, identifying recurring periodic heartbeats with low statistical jitter (e.g. 60s +/- 5s)",
        "By reading the email subject line",
        "By checking if the server is hot"
      ],
      correct_option_index: 1,
      explanation: "Malware beacons establish periodic callbacks at fixed intervals; statistical inter-arrival time analysis detects low-jitter regularity.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Windows Security log analysis, what combination of Event IDs indicates potential unauthorized persistence via Windows Service installation followed by defense evasion?",
      options: [
        "Event ID 100 and Event ID 200",
        "Event ID 1000 and Event ID 2000",
        "Event ID 7045 / 4697 (A service was installed in the system) followed by Event ID 1102 / 104 (The audit log was cleared)",
        "Event ID 1 and Event ID 2"
      ],
      correct_option_index: 2,
      explanation: "Event 7045/4697 logs service persistence, while Event 1102/104 indicates an adversary clearing event logs to cover tracks.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Microsoft Kusto Query Language (KQL), what query correctly identifies Microsoft Excel spawning Windows Command Shell or PowerShell as child processes?",
      options: [
        "DeviceProcessEvents | where InitiatingProcessFileName =~ \"excel.exe\" and FileName in~ (\"cmd.exe\", \"powershell.exe\") | project Timestamp, DeviceName, AccountName, ProcessCommandLine",
        "SELECT * FROM excel WHERE child = 'powershell'",
        "find powershell in excel.exe",
        "search EventCode=4624"
      ],
      correct_option_index: 0,
      explanation: "KQL queries DeviceProcessEvents filtering for InitiatingProcessFileName matching excel.exe spawning cmd.exe or powershell.exe child processes.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In DNS log analytics, what statistical indicators in 'dns.log' indicate data exfiltration via DNS Tunneling?",
      options: [
        "Zero DNS queries",
        "Only looking up google.com",
        "Printing website pages",
        "Unusually high Shannon entropy strings in subdomains (e.g. 7f8a9b2c.data.domain.com), high volume of TXT/NULL record requests, and rapid NXDOMAIN bursts"
      ],
      correct_option_index: 3,
      explanation: "DNS tunneling encodes binary data into high-entropy subdomain strings, generating high query volumes for TXT or NULL records.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In modern Linux observability and security, how does eBPF system call telemetry (such as Tetragon or Falco) overcome the limitations of traditional auditd?",
      options: [
        "eBPF requires rebooting every hour",
        "eBPF executes sandboxed bytecode inside kernel tracepoints, inspecting arguments and enforcing runtime blocking with near-zero CPU and context-switch overhead",
        "eBPF only works on Windows",
        "eBPF deletes system logs"
      ],
      correct_option_index: 1,
      explanation: "eBPF hooks directly into kernel tracepoints, enabling deep real-time system call telemetry and enforcement with negligible CPU performance impact.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #44.");
  console.log("Skill #44 update completed successfully!");
}

run();
