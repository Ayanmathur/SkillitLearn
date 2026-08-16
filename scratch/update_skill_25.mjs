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

const skillId = "01f5aa33-53af-4343-af2f-add01a166d24";

async function run() {
  console.log("Updating Skill #25: Cloud Security (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Zero Trust Architecture, IAM Policy Engines and Identity Federation" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Cryptographic Security, Envelope Encryption and Secrets Lifecycle" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Perimeter Defense, Threat Detection and eBPF Runtime Security" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "NIST Zero Trust Architecture (ZTA) and Least Privilege Engineering",
      order_index: 1,
      content: `### Principles of Zero Trust Cloud Architecture

Zero Trust transforms enterprise security from perimeter-based firewalls to continuous, identity-centric verification (NIST SP 800-207):

1. Core Tenets of Zero Trust:
   - 'Never Trust, Always Verify': Assume the internal network is hostile and fully compromised.
   - Every request is authenticated, authorized, and encrypted based on real-time context before access is granted.

2. Access Control Models:
   - Role-Based Access Control (RBAC): Assigns coarse-grained permissions to static job roles.
   - Attribute-Based Access Control (ABAC): Dynamic policy evaluation evaluating:
     - Subject Attributes (User role, department, clearance).
     - Resource Attributes (Data classification, owner).
     - Environmental Attributes (Source IP CIDR, geographic location, device health compliance, time of day).

3. Just-In-Time (JIT) Privilege Elevation:
   - Eliminating permanent standing administrator privileges. Engineers request time-bound elevation (e.g. 2-hour window) with mandatory peer approvals and automated session revocation upon expiry.`
    },
    {
      track_id: track1Id,
      title: "Advanced IAM Policy Grammar and Evaluation Logic Engines",
      order_index: 2,
      content: `### Deterministic IAM Policy Evaluation Mechanics

Cloud identity systems enforce security through formal declarative policy evaluation engines:

1. Standard IAM Policy Grammar:
   - Statement Structure: \`Effect\` (Allow or Deny), \`Principal\` (User, Role, or Service), \`Action\` (API actions), \`Resource\` (Target ARN / URI), and \`Condition\` blocks (e.g. \`aws:PrincipalArn\`, \`aws:SourceIp\`, \`aws:MultiFactorAuthPresent: true\`).

2. The Deterministic Evaluation Algorithm:
   - Step 1 (Default): By default, all requests are implicitly denied.
   - Step 2 (Explicit Deny Override): If ANY applicable policy contains an explicit \`Deny\` statement, the request is immediately denied, overriding all existing allows across all levels.
   - Step 3 (Explicit Allow): In the absence of an explicit deny, if an applicable identity policy, resource policy, or role grant contains an explicit \`Allow\`, the request is permitted.
   - Step 4 (Fallback): If no explicit allow exists, the request defaults to implicit deny.

3. Organizational Governance Guardrails:
   - Service Control Policies (SCPs / Azure Management Group Policies): Organizational boundary guardrails setting maximum allowable permissions across multi-account cloud organizations, preventing even account root users from disabling logging or leaving authorized regions.`
    },
    {
      track_id: track1Id,
      title: "Identity Federation, SAML 2.0, OIDC and Workload Identities",
      order_index: 3,
      content: `### Enterprise Identity Federation and Workload Attestation

Modern enterprises bridge on-premises identity providers (IdPs) to cloud environments without synchronizing or storing static passwords:

1. Human Identity Federation (SAML 2.0 and OIDC):
   - SAML 2.0: XML-based security assertions exchanged between Identity Providers (Okta, Microsoft Entra ID / Azure AD, Ping) and Cloud Service Providers.
   - OpenID Connect (OIDC): JSON Web Token (JWT) identity layer built on OAuth 2.0, validating cryptographically signed RS256 token claims against public JWKS endpoints.

2. Cloud Workload Identities (IRSA / Workload Identity):
   - Storing static IAM access keys inside container images or VM configuration files represents an immediate compromise vulnerability.
   - Solution (IAM Roles for Service Accounts - IRSA / GCP Workload Identity):
     - Kubernetes pods project a signed OIDC Service Account Token.
     - The cloud provider STS (Security Token Service) validates the token against the Kubernetes OIDC discovery endpoint and issues short-lived (15-minute) ephemeral STS credentials dynamically, eliminating all static credentials.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Envelope Encryption, Key Management Services (KMS) and CloudHSM",
      order_index: 1,
      content: `### Cryptographic Engineering and Envelope Encryption

1. The Network Bottleneck of Direct Cloud Encryption:
   - Encrypting multi-gigabyte or terabyte files directly via cloud Key Management Service (KMS) API calls causes severe network bandwidth saturation and KMS API rate-limiting throttling.

2. The Mechanics of Envelope Encryption:
   - Step 1: The application calls \`kms:GenerateDataKey\` specifying a Customer Master Key (CMK / KEK - Key Encryption Key).
   - Step 2: KMS returns two components: a plaintext Data Encryption Key (DEK) and an encrypted ciphertext copy of the DEK.
   - Step 3: The application uses the plaintext DEK locally in RAM to encrypt the large payload using high-speed symmetric AES-GCM-256 encryption.
   - Step 4: The application immediately erases the plaintext DEK from memory.
   - Step 5: The application stores the encrypted DEK alongside the encrypted payload metadata.
   - Step 6 (Decryption): To decrypt, the application sends only the small encrypted DEK to KMS (\`kms:Decrypt\`), receives the plaintext DEK in RAM, decrypts the payload, and wipes memory.

3. Hardware Security Modules (CloudHSM / FIPS 140-2 Level 3):
   - Dedicated single-tenant cryptographic hardware providing tamper-resistant physical silicon isolation where private keys cannot be extracted even by cloud provider root engineers.`
    },
    {
      track_id: track2Id,
      title: "Data Protection: In-Transit, At-Rest and Confidential Computing",
      order_index: 2,
      content: `### Data Protection Across the Three Cryptographic States

1. Data in Transit (Network Cryptography):
   - Mandatory TLS 1.3 encryption with Perfect Forward Secrecy (PFS) using Ephemeral Elliptic Curve Diffie-Hellman (ECDHE) key exchange cipher suites.
   - Service Mesh Mutual TLS (mTLS): Enforcing bidirectional cryptographic certificate verification between microservices.

2. Data at Rest (Storage Cryptography):
   - Server-Side Encryption with KMS Managed Keys (SSE-KMS): Automated transparent encryption of block volumes, object storage buckets, and database disks using AES-256.

3. Data in Use (Confidential Computing Enclaves):
   - Traditional encryption protects data in transit and at rest, but data must be decrypted in RAM during CPU computation, exposing it to hypervisor memory dumping and root kernel exploits.
   - Hardware Memory Encryption (AMD SEV-SNP / Intel SGX / AWS Nitro Enclaves): Encrypts memory addresses in physical CPU hardware with dynamically generated ephemeral hardware keys, completely isolating runtime memory from hypervisors, host operating systems, and cloud administrators.`
    },
    {
      track_id: track2Id,
      title: "Secrets Management, Dynamic Ephemeral Credentials and Vault",
      order_index: 3,
      content: `### Enterprise Secrets Management Architecture

Hardcoded database passwords and static API keys represent the primary cause of modern cloud security breaches:

1. Centralized Secrets Lifecycle Management (HashiCorp Vault / AWS Secrets Manager):
   - Centralized encrypted secrets storage with automated 30/60/90-day secret rotation pipelines.
   - Audit Logging: Tracking every single secret access event with full identity telemetry.

2. Dynamic Ephemeral Credentials:
   - Instead of sharing static database passwords, the application queries Vault/Secrets Manager on demand.
   - The secrets engine communicates with the database to generate a unique, temporary database user with strict 1-hour Time-to-Live (TTL).
   - Upon TTL expiration, the secrets engine automatically drops the database user, neutralizing credential leak risks.

3. Kubernetes Secret Injection Best Practices:
   - Using Secrets Store CSI Drivers to mount secrets directly into in-memory \`tmpfs\` container volumes, preventing sensitive secrets from ever being written to disk, committed into container images, or exposed via environment variables.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Perimeter Defense: Web Application Firewalls, DDoS and Mesh",
      order_index: 1,
      content: `### Cloud Perimeter Defense and Zero Trust Microsegmentation

1. Layer 7 Web Application Firewalls (AWS WAF / Cloudflare WAF):
   - Deep inspection of HTTP/HTTPS traffic inspecting headers, URI paths, and request bodies.
   - Managed Rule Groups: Mitigates OWASP Top 10 vulnerabilities (SQL Injection regex matching, Cross-Site Scripting XSS, Server-Side Request Forgery SSRF).
   - Rate-Based Rules: Automatically throttling or blocking IP addresses exceeding request velocity thresholds (e.g. > 2,000 requests per 5-minute window) to prevent brute-force attacks.

2. Volumetric DDoS Mitigation (AWS Shield Advanced / Anycast Scrubbers):
   - Absorbing terabit-scale Layer 3/4 volumetric attacks (SYN floods, UDP reflection amplification) via global Anycast edge scrubbers before traffic reaches customer VPCs.

3. Zero Trust Microsegmentation:
   - Replacing flat VPC network trust models with service mesh authorization policies (Istio / Linkerd), enforcing cryptographic mTLS and granular L7 HTTP verb/path authorization between microservices regardless of underlying IP topology.`
    },
    {
      track_id: track3Id,
      title: "Cloud Threat Detection, Telemetry and Automated SOAR Response",
      order_index: 2,
      content: `### Security Telemetry and Automated Incident Response

Modern cloud security relies on continuous behavioral telemetry and automated remediation pipelines:

1. Telemetry Data Ingestion Sources:
   - VPC Flow Logs (Network traffic metadata: source/destination IP, port, packet count, accept/reject status).
   - CloudTrail / Azure Activity Logs: Complete audit trail of every API call made in the cloud account.
   - DNS Query Logs: Intercepting DNS lookups to identify command-and-control (C2) domains.

2. Machine Learning Threat Detection (Amazon GuardDuty / Microsoft Sentinel):
   - Continuous behavioral anomaly detection:
     - Compromised IAM Credentials: API calls from unusual geographic locations, known Tor exit nodes, or calling dangerous reconnaissance APIs.
     - EC2 / Kubernetes Compromise: Outbound cryptocurrency mining communication, abnormal DNS data exfiltration tunnels.

3. Security Orchestration, Automation, and Response (SOAR):
   - Automated serverless response workflows (EventBridge -> AWS Lambda):
     - Automatically isolating a compromised EC2 instance by attaching an isolated quarantine security group, taking an EBS forensic snapshot, and revoking compromised IAM user session tokens within 5 seconds of alert detection.`
    },
    {
      track_id: track3Id,
      title: "Cloud Security Posture Management (CSPM) and eBPF Runtime Security",
      order_index: 3,
      content: `### Compliance Governance and Kernel-Level Runtime Security

1. Cloud Security Posture Management (CSPM / Wiz, Prisma Cloud):
   - Agentless API scanning of multi-cloud resource configurations against industry security benchmarks:
     - CIS Cloud Benchmarks, NIST Cybersecurity Framework (CSF), PCI-DSS, SOC 2 Type II, and HIPAA.
     - Graph-Based Risk Correlation: Identifying toxic combinations (e.g. an internet-exposed EC2 instance with an unpatched CVE vulnerability attached to an IAM role with full administrator privileges).

2. Kernel-Level Container Runtime Security (Falco / Cilium eBPF):
   - Extended Berkeley Packet Filter (eBPF) technology running sandboxed programs directly inside the Linux kernel:
     - Real-Time System Call Monitoring: Inspecting kernel syscalls (\`execve\`, \`openat\`, \`connect\`, \`ptrace\`) with near-zero CPU overhead.
     - Anomaly Detection: Immediately alerting and terminating containers when unauthorized interactive shells (\`/bin/sh\`, \`/bin/bash\`) are spawned inside production containers, sensitive host directories (\`/etc/shadow\`) are accessed, or reverse shells are opened.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #25.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "According to NIST SP 800-207 Zero Trust Architecture (ZTA), what is the foundational governing security principle?",
      options: [
        "Trust all devices inside the corporate office network",
        "'Never Trust, Always Verify'; assume the internal network is hostile and authenticate every transaction continuously",
        "Disable all user passwords",
        "Trust any traffic originating from Linux operating systems"
      ],
      correct_option_index: 1,
      explanation: "Zero Trust rejects perimeter-based trust, mandating continuous authentication and authorization under the assumption that the network is hostile.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In cloud IAM policy evaluation logic, what happens when an evaluation engine encounters an applicable policy containing an explicit 'Deny' statement?",
      options: [
        "The deny is ignored if an allow statement exists",
        "The system prompts the user to enter a captcha",
        "The request is delayed by 10 minutes",
        "The request is immediately denied, overriding all existing allow statements across all policy levels"
      ],
      correct_option_index: 3,
      explanation: "In IAM policy evaluation, an explicit Deny always overrides all explicit allows, resulting in immediate request rejection.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What cryptographic technique uses a Key Management Service (KMS) Customer Master Key to generate a local Data Encryption Key (DEK) that encrypts large files locally in RAM, solving network bandwidth bottlenecks?",
      options: [
        "Envelope Encryption",
        "Caesar Cipher",
        "MD5 Hashing",
        "Base64 Encoding"
      ],
      correct_option_index: 0,
      explanation: "Envelope encryption encrypts large data locally using a plaintext data key (DEK) and protects the DEK with a master key (KEK), avoiding KMS bandwidth bottlenecks.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What hardware security technology (e.g. AMD SEV-SNP / Intel SGX) encrypts memory addresses in physical CPU silicon to protect 'Data in Use' from hypervisors and root administrators during computation?",
      options: [
        "USB Thumb Drive",
        "Standard Magnetic Disk",
        "Confidential Computing (Hardware Enclaves)",
        "Graphics Card Fan"
      ],
      correct_option_index: 2,
      explanation: "Confidential Computing protects data in use by encrypting memory at the CPU hardware level, preventing unauthorized hypervisor or host inspection.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What kernel-level technology is utilized by container security engines like Falco to monitor system calls (execve, openat) in real time with near-zero CPU overhead?",
      options: [
        "Java Applets",
        "eBPF (Extended Berkeley Packet Filter)",
        "Flash Player",
        "Cron Jobs"
      ],
      correct_option_index: 1,
      explanation: "eBPF allows sandboxed security programs to run directly inside the Linux kernel, monitoring syscalls in real time without performance overhead.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "How do Cloud Workload Identities (such as AWS IAM Roles for Service Accounts - IRSA) eliminate static credentials from Kubernetes container deployments?",
      options: [
        "By storing AWS access keys in public GitHub repositories",
        "By disabling all database authentication",
        "Kubernetes pods project a signed OIDC Service Account Token; the cloud STS validates it against the cluster OIDC endpoint and dynamically issues short-lived 15-minute temporary credentials",
        "By printing passwords on paper vouchers"
      ],
      correct_option_index: 2,
      explanation: "Workload Identity exchanges short-lived pod OIDC tokens for temporary cloud STS credentials, eliminating static long-lived API keys from containers.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In AWS Organizations, what is the function of Service Control Policies (SCPs)?",
      options: [
        "SCPs act as organizational boundary guardrails setting the maximum allowable permissions across member accounts, preventing even account root users from bypassing rules",
        "SCPs automatically pay the monthly electric bill",
        "SCPs create HTML website templates",
        "SCPs increase server CPU clock speeds"
      ],
      correct_option_index: 0,
      explanation: "Service Control Policies establish maximum permission guardrails across multi-account structures, bounding all IAM principals including the account root user.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In secrets management architecture, what is the primary security advantage of using 'Dynamic Ephemeral Credentials' generated on demand by HashiCorp Vault?",
      options: [
        "Dynamic credentials are easy to guess",
        "Dynamic credentials never expire",
        "Dynamic credentials eliminate the need for databases",
        "Vault generates unique, short-lived database users on demand with strict 1-hour Time-to-Live (TTL), automatically revoking and dropping the user upon expiration to neutralize leak risks"
      ],
      correct_option_index: 3,
      explanation: "Dynamic credentials generate unique, short-lived credentials with automated TTL revocation, eliminating static shared passwords and neutralizing credential exposure.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What security system provides automated threat detection across AWS accounts by applying machine learning and threat intelligence to analyze VPC Flow Logs, CloudTrail logs, and DNS query logs?",
      options: [
        "Amazon EC2",
        "Amazon GuardDuty",
        "Amazon S3",
        "Amazon Simple Email Service"
      ],
      correct_option_index: 1,
      explanation: "Amazon GuardDuty is an intelligent threat detection service that analyzes foundational telemetry streams to identify compromised credentials, crypto-mining, and anomalies.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What Layer 7 security tool inspects incoming HTTP/HTTPS requests to mitigate OWASP Top 10 vulnerabilities (such as SQL Injection and Cross-Site Scripting) and enforce rate-based throttling?",
      options: [
        "Network Hub",
        "BGP Router",
        "Web Application Firewall (WAF)",
        "DNS Server"
      ],
      correct_option_index: 2,
      explanation: "Web Application Firewalls (WAF) operate at Layer 7 to inspect HTTP payloads, blocking SQLi, XSS, and rate-limiting abusive IP traffic.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In cryptographic key management, what level of security standard is provided by single-tenant CloudHSM appliances compared to multi-tenant KMS?",
      options: [
        "FIPS 140-2 / 140-3 Level 3 validated dedicated physical silicon hardware featuring tamper-evident seals and physical zeroization circuitry where private keys cannot be extracted even by cloud provider personnel",
        "CloudHSM is written in Python and runs on shared VMs",
        "CloudHSM is less secure than plain text files",
        "CloudHSM disables data encryption"
      ],
      correct_option_index: 0,
      explanation: "CloudHSM provides single-tenant FIPS 140-2 Level 3 physical cryptographic hardware with hardware-enforced tamper zeroization and exclusive customer key control.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Cloud Security Posture Management (CSPM), what constitutes a 'Toxic Risk Combination' on an infrastructure graph?",
      options: [
        "A server that is turned off",
        "A database that has a green background",
        "A computer running Windows 11",
        "An interconnected vulnerability chain: e.g. an internet-facing EC2 instance containing an unpatched remote code execution CVE attached to an IAM role with full administrator privileges"
      ],
      correct_option_index: 3,
      explanation: "Toxic risk combinations represent correlated risk paths where exposure, unpatched critical vulnerabilities, and excessive cloud permissions align to enable total compromise.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "What is the primary mechanism through which automated Security Orchestration, Automation, and Response (SOAR) workflows neutralize compromised virtual machines within seconds of alert detection?",
      options: [
        "By deleting the entire cloud account",
        "An event rule triggers a serverless function that automatically attaches an isolated quarantine security group, captures an EBS forensic snapshot, and revokes active IAM sessions",
        "By sending a postal letter to the system administrator",
        "By rebooting all servers in the region"
      ],
      correct_option_index: 1,
      explanation: "SOAR event pipelines execute automated Lambda remediation scripts to isolate compromised instances with quarantine security groups, preserve forensics, and revoke tokens.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In transport layer security, how does Ephemeral Elliptic Curve Diffie-Hellman (ECDHE) key exchange provide Perfect Forward Secrecy (PFS)?",
      options: [
        "By reusing the same encryption key forever",
        "By publishing private keys publicly",
        "A unique, temporary session key is generated for every single TLS connection; compromising the server's long-term private key in the future cannot decrypt previously recorded network traffic",
        "By disabling SSL certificates"
      ],
      correct_option_index: 2,
      explanation: "PFS generates unique ephemeral session keys per connection, ensuring that past recorded traffic remains undecryptable even if the master server key is compromised later.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "What access control paradigm evaluates dynamic contextual attributes such as source IP CIDR, device compliance posture, user department, and time of day in real time?",
      options: [
        "Attribute-Based Access Control (ABAC)",
        "Discretionary Access Control (DAC)",
        "Static Password Authentication",
        "Mandatory Access Control (MAC)"
      ],
      correct_option_index: 0,
      explanation: "Attribute-Based Access Control (ABAC) evaluates rich, dynamic multi-dimensional attributes (user, resource, environment context) to make real-time access decisions.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #25.");
  console.log("Skill #25 update completed successfully!");
}

run();
