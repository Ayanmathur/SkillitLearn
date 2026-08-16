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

const skillId = "22a9c9cd-0bdd-4584-99fc-23320ef3ecb2";

async function run() {
  console.log("Updating Skill #43: Security Fundamentals (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Cryptographic Primitives, CIA Triad and the Parkerian Hexad" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Threat Modeling, Attack Frameworks and Zero Trust Architecture" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Identity & Access Governance, Authentication and NIST CSF 2.0" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / CISSP Security Engineering level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Security Axioms: CIA Triad, Parkerian Hexad and Non-Repudiation",
      order_index: 1,
      content: `### Foundational Information Security Axioms and Models

Information security architectures protect data assets across transmission, storage, and processing states:

1. The Classical CIA Triad:
   - Confidentiality: Ensuring sensitive data is shielded from unauthorized observation (enforced via AES-256 encryption, access control lists, and data masking).
   - Integrity: Guaranteeing data remains unmodified, accurate, and trustworthy (enforced via cryptographic SHA-256 hashes, digital signatures, and write-once storage).
   - Availability: Ensuring authorized entities have reliable, timely access to systems and data (enforced via multi-AZ redundancy, DDoS mitigation, and disaster recovery failover).

2. The Parkerian Hexad (Donn Parker):
   - Expands the CIA Triad into six distinct security elements:
     - Confidentiality, Integrity, and Availability.
     - Authenticity: Verifying the genuine origin, authorship, and valid identity of data or messages.
     - Possession / Control: Maintaining physical or digital custody of data (e.g. an encrypted hard drive stolen by an attacker preserves confidentiality but breaches possession/control).
     - Utility: Ensuring data remains in a usable, accessible format (e.g. losing an encryption key preserves confidentiality but destroys utility).

3. Non-Repudiation:
   - Providing irrefutable cryptographic proof via asymmetric digital signatures and immutable audit logs that a specific sender originated a transaction, preventing subsequent denial.`
    },
    {
      track_id: track1Id,
      title: "Applied Cryptography: Symmetric Ciphers, Asymmetric Keys and Hashing",
      order_index: 2,
      content: `### Mathematical Mechanics of Modern Applied Cryptography

1. Symmetric Key Cryptography:
   - Single shared secret key for encryption and decryption.
   - Advanced Encryption Standard (AES): 128, 192, or 256-bit block cipher. The Galois/Counter Mode (AES-GCM) provides Authenticated Encryption with Associated Data (AEAD), guaranteeing both confidentiality and message integrity in hardware.
   - ChaCha20-Poly1305: High-speed stream cipher with high performance on devices lacking AES-NI hardware instructions.

2. Asymmetric Public Key Cryptography:
   - Key Pairs: Public key for encryption/verification; private key for decryption/signing.
   - RSA (Rivest-Shamir-Adleman): Relies on the computational hardness of prime number factorization (minimum 2048 to 4096-bit key length).
   - Elliptic Curve Cryptography (ECC - Ed25519, ECDSA over NIST P-256): Delivers equivalent cryptographic strength to 3072-bit RSA with a compact 256-bit key, reducing CPU and bandwidth overhead.

3. Cryptographic Hash Functions:
   - One-way deterministic functions mapping arbitrary data to fixed-length digests (SHA-256, SHA-3, BLAKE3).
   - Mathematical Properties: Pre-image resistance (impossible to reverse), Second pre-image resistance, and Collision resistance (infeasible to find two distinct inputs yielding identical hashes).

4. Perfect Forward Secrecy (PFS):
   - Ephemeral Diffie-Hellman (ECDHE) key exchange generating unique session keys for every connection, ensuring past recorded traffic cannot be decrypted if the server's long-term private key is compromised in the future.`
    },
    {
      track_id: track1Id,
      title: "Public Key Infrastructure (PKI), TLS 1.3 and X.509 Certificates",
      order_index: 3,
      content: `### Trust Hierarchies and Transport Layer Security

1. Public Key Infrastructure (PKI) Architecture:
   - Certificate Authorities (CAs): Trusted root entities issuing digitally signed X.509 certificates validating domain ownership.
   - Hierarchical Trust Chain: Root CA (stored in operating system trust stores) -> Intermediate CA -> End-Entity Server Certificate.
   - Certificate Revocation: Certificate Revocation Lists (CRLs) and Online Certificate Status Protocol (OCSP) with OCSP Stapling (servers caching CA validity tokens to eliminate client CA lookup delays).

2. X.509 v3 Digital Certificate Structure:
   - Subject Alternative Names (SAN), Public Key, Issuer Signature, Validity Period, and Key Usage extensions.

3. The TLS 1.3 Protocol Standard:
   - Modern Cryptographic Modernization: Completely removed obsolete, insecure cipher suites (static RSA key exchange, CBC mode ciphers, RC4, SHA-1, 3DES).
   - Handshake Latency Optimization: Reduced connection negotiation to 1-RTT (single round-trip time) and 0-RTT resumption while mandating Ephemeral Diffie-Hellman forward secrecy for all sessions.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Threat Modeling Frameworks: STRIDE, PASTA and Attack Trees",
      order_index: 1,
      content: `### Structured Threat Modeling and Vulnerability Analysis

Threat modeling identifies architectural vulnerabilities before software deployment:

1. Microsoft STRIDE Framework:
   - Spoofing (Identity): Forging authentication credentials -> Countermeasure: MFA, FIDO2, cryptographic signatures.
   - Tampering (Data): Modifying database records or packets in transit -> Countermeasure: TLS, HMAC, digital signatures.
   - Repudiation: Denying an action occurred -> Countermeasure: Immutable audit logging, digital signatures.
   - Information Disclosure: Data breaches or memory leaks -> Countermeasure: Encryption at rest/transit.
   - Denial of Service: Resource exhaustion -> Countermeasure: Rate limiting, load shedding, DDoS shielding.
   - Elevation of Privilege: Gaining unauthorized administrative rights -> Countermeasure: Principle of Least Privilege, RBAC.

2. Risk-Centric PASTA Methodology:
   - Process for Attack Simulation and Threat Analysis (PASTA): 7-step risk-centric framework aligning threat models with business objectives and financial impact.

3. Quantitative Risk Scoring (DREAD & CVSS 3.1/4.0):
   - Common Vulnerability Scoring System (CVSS): Evaluates Base Metrics (Attack Vector, Complexity, Privileges Required, User Interaction, Scope, Confidentiality/Integrity/Availability impact).`
    },
    {
      track_id: track2Id,
      title: "Attack Frameworks: The Cyber Kill Chain and MITRE ATT&CK Matrix",
      order_index: 2,
      content: `### Deconstructing Adversary Tactics and Operational Telemetry

1. The Lockheed Martin Cyber Kill Chain:
   - 7 Sequential Attack Stages:
     - 1. Reconnaissance (Harvesting target intelligence).
     - 2. Weaponization (Coupling exploit with payload).
     - 3. Delivery (Phishing emails, malicious USBs, web exploits).
     - 4. Exploitation (Triggering malicious code execution).
     - 5. Installation (Establishing persistent foothold / backdoor).
     - 6. Command & Control (C2 beaconing over encrypted channels).
     - 7. Actions on Objectives (Data exfiltration, ransomware encryption).

2. The MITRE ATT&CK Framework:
   - Globally accessible knowledge base of real-world adversary tactics, techniques, and procedures (TTPs).
   - 14 Enterprise Tactical Columns: Initial Access -> Execution -> Persistence -> Privilege Escalation -> Defense Evasion -> Credential Access -> Discovery -> Lateral Movement -> Collection -> Command and Control -> Exfiltration -> Impact.
   - Threat-Informed Defense: Mapping security detection rules (SIEM/EDR) directly to specific ATT&CK Technique IDs (e.g. T1059 Command and Scripting Interpreter).`
    },
    {
      track_id: track2Id,
      title: "Defense-in-Depth and NIST SP 800-207 Zero Trust Architecture",
      order_index: 3,
      content: `### Layered Security Paradigms and Zero Trust Principles

1. The Perimeter Security Fallacy (Castle-and-Moat):
   - Traditional network security assumed everything inside the internal corporate network was trusted. Once an attacker breached the VPN or firewall, unrestricted lateral movement compromised the entire enterprise.

2. Defense-in-Depth (Layered Security):
   - Implementing redundant security controls across every technological layer: Physical -> Network (Firewalls/WAF) -> Compute (EDR/Hardening) -> Application (Input Validation/DAST) -> Data (Encryption/DLP).

3. NIST SP 800-207 Zero Trust Architecture (ZTA):
   - Foundational Mantra: 'Never Trust, Always Verify'.
   - Core Tenets:
     - All resource authentication and authorization are dynamic and strictly enforced on a per-session basis.
     - Network locality does not grant trust: Internal corporate LANs are treated as hostile as the public internet.
     - Microsegmentation: Isolating workloads into micro-perimeters to eliminate lateral movement.
     - Policy Engine (PE) and Policy Enforcement Point (PEP): Evaluating dynamic device health, user context, and risk signals before granting access.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Identity and Access Management: AAA, RBAC, ABAC and PAM",
      order_index: 1,
      content: `### Access Governance and Identity Architecture

1. The AAA Security Architecture:
   - Authentication (AuthN): Verifying claimed identity ('Are you Alice?').
   - Authorization (AuthZ): Determining permitted actions ('Does Alice have write access to the finance database?').
   - Accounting (Auditing): Recording timestamped event telemetry ('Alice modified table ledger_2026 at 14:02').

2. Access Control Models:
   - Role-Based Access Control (RBAC): Assigning permissions to organizational roles (e.g. 'Security Analyst') and mapping users to roles, enforcing the Principle of Least Privilege (PoLP).
   - Attribute-Based Access Control (ABAC): Dynamic policy evaluation based on Subject attributes (role, department), Resource attributes (classification level), Action (read/write), and Environmental context (IP subnet, time of day, device compliance).

3. Privileged Access Management (PAM):
   - Vaulting root and domain administrator credentials, enforcing Just-In-Time (JIT) temporary privilege escalation, and recording all administrator terminal sessions.`
    },
    {
      track_id: track3Id,
      title: "Modern Authentication: MFA, FIDO2/WebAuthn and SSO Protocols",
      order_index: 2,
      content: `### Multi-Factor Authentication and Cryptographic Identity

1. The Four Classical Authentication Factors:
   - Something You Know: Passwords, PINs, passphrases (vulnerable to credential stuffing and phishing).
   - Something You Have: Hardware tokens, mobile authenticator apps, smartcards.
   - Something You Are: Biometrics (fingerprints, facial recognition, retinal scans).
   - Somewhere You Are: GPS coordinates, verified IP geofencing.

2. Phishing-Resistant FIDO2 / WebAuthn Passkeys:
   - Hardware security keys (YubiKey) and platform passkeys using asymmetric public-key cryptography.
   - Domain Binding: The private key signs a cryptographic challenge bound strictly to the browser's exact TLS origin domain, completely eliminating adversary-in-the-middle (AiTM) phishing attacks.

3. Federated Identity and Single Sign-On (SSO):
   - SAML 2.0: XML-based security token exchange between Identity Providers (IdP) and Service Providers (SP).
   - OpenID Connect (OIDC): Lightweight identity layer built on OAuth 2.0 using JSON Web Tokens (JWT) for modern web and mobile single sign-on.`
    },
    {
      track_id: track3Id,
      title: "Security Governance Frameworks: NIST CSF 2.0, ISO 27001 and CIS",
      order_index: 3,
      content: `### Enterprise Governance, Risk and Compliance (GRC)

1. NIST Cybersecurity Framework 2.0 (NIST CSF):
   - Six Core Functions organizing cybersecurity risk management:
     - Govern (Establish organizational risk management strategy, policies, and oversight).
     - Identify (Asset management, risk assessment, supply chain risks).
     - Protect (Access control, awareness training, data security, platform protection).
     - Detect (Continuous monitoring, anomaly detection, threat hunting).
     - Respond (Incident response management, mitigation, analysis).
     - Recover (Disaster recovery restoration, lessons learned).

2. ISO/IEC 27001 Standard:
   - Globally recognized certification specifying the creation and continuous operation of an Information Security Management System (ISMS), supported by the Annex A control catalog (ISO 27002).

3. CIS Critical Security Controls v8:
   - 18 prioritized, actionable defensive controls categorized into Implementation Groups (IG1 for foundational cyber hygiene, IG2 for enterprise scale, IG3 for advanced threats).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #43.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "What fundamental information security model defines the core triad of Confidentiality, Integrity, and Availability?",
      options: [
        "OSI Model",
        "TCP/IP Stack",
        "The CIA Triad",
        "Agile Methodology"
      ],
      correct_option_index: 2,
      explanation: "The CIA Triad (Confidentiality, Integrity, Availability) represents the foundational pillars of information security engineering.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In modern symmetric cryptography, what mode of the Advanced Encryption Standard (AES) provides Authenticated Encryption with Associated Data (AEAD) in hardware?",
      options: [
        "AES-GCM (Galois/Counter Mode)",
        "AES-ECB (Electronic Codebook Mode)",
        "Caesar Cipher",
        "ROT13"
      ],
      correct_option_index: 0,
      explanation: "AES-GCM provides authenticated encryption with associated data (AEAD), guaranteeing both high-speed confidentiality and cryptographic integrity.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What core architectural principle defines the NIST SP 800-207 Zero Trust framework across enterprise networks?",
      options: [
        "Trust everyone inside the internal company network",
        "Disable all firewalls",
        "Allow anyone with a password to access all files",
        "'Never Trust, Always Verify': all access is continuously authenticated, authorized, and encrypted on a per-session basis regardless of network location"
      ],
      correct_option_index: 3,
      explanation: "Zero Trust eliminates implicit trust based on network location, verifying identity and posture dynamically on every request.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In threat modeling, what does the Microsoft 'STRIDE' acronym stand for?",
      options: [
        "Start, Train, Run, Inspect, Deploy, Evaluate",
        "Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege",
        "Software, Testing, Redundancy, IP, Domain, Ethernet",
        "Safety, Tools, Risk, Identity, Access, Data"
      ],
      correct_option_index: 1,
      explanation: "STRIDE categorizes software threats into Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What globally recognized cybersecurity knowledge base maps real-world adversary tactics, techniques, and procedures (TTPs) across 14 operational enterprise stages?",
      options: [
        "Wikipedia",
        "Linux Manual Pages",
        "The MITRE ATT&CK Framework",
        "Stack Overflow"
      ],
      correct_option_index: 2,
      explanation: "The MITRE ATT&CK matrix catalogs documented cyber adversary techniques across 14 tactical categories to inform threat detection and defense.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In Donn Parker's 'Parkerian Hexad', what two security attributes are added alongside Confidentiality, Integrity, Availability, and Authenticity?",
      options: [
        "Cost and Speed",
        "Possession/Control (custody of data) and Utility (usability of data in accessible format)",
        "Color and Size",
        "Software and Hardware"
      ],
      correct_option_index: 1,
      explanation: "The Parkerian Hexad adds Authenticity, Possession/Control (custody), and Utility (usefulness) to the classical CIA triad.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "How do modern FIDO2 / WebAuthn hardware passkeys (such as YubiKeys) mathematically eliminate adversary-in-the-middle (AiTM) phishing attacks?",
      options: [
        "They make passwords longer",
        "They turn off internet connections",
        "They block all emails",
        "They use public-key cryptography where the private key signs a challenge bound strictly to the browser's exact TLS origin domain, preventing credential replay on fake sites"
      ],
      correct_option_index: 3,
      explanation: "FIDO2 credentials are cryptographic keys bound strictly to the authentic web origin; fake phishing sites cannot receive valid signed challenges.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In cryptography, what is 'Perfect Forward Secrecy' (PFS) and how is it achieved during TLS negotiations?",
      options: [
        "Ephemeral Diffie-Hellman (ECDHE) key exchange generates unique session keys for every connection, ensuring past recorded traffic cannot be decrypted if the server's long-term private key is compromised in the future",
        "Encrypting data twice with the same password",
        "Deleting the internet history",
        "Saving passwords in plain text"
      ],
      correct_option_index: 0,
      explanation: "PFS uses ephemeral Diffie-Hellman keys for each session, protecting past recorded traffic from retrospective decryption if master keys leak.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What access control model dynamically evaluates Subject attributes (role, department), Resource classification, and Environmental context (IP subnet, time of day, device health)?",
      options: [
        "Discretionary Access Control (DAC)",
        "Simple Passwords",
        "Attribute-Based Access Control (ABAC)",
        "Mandatory Access Control (MAC)"
      ],
      correct_option_index: 2,
      explanation: "ABAC evaluates dynamic multi-dimensional attributes across users, resources, actions, and environmental risk context to make fine-grained access decisions.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In the NIST Cybersecurity Framework (NIST CSF 2.0), what new foundational Core Function was added alongside Identify, Protect, Detect, Respond, and Recover?",
      options: [
        "Purchase",
        "Govern (establishing organizational cybersecurity strategy, policy, and oversight)",
        "Format",
        "Reboot"
      ],
      correct_option_index: 1,
      explanation: "NIST CSF 2.0 introduced the 'Govern' function to emphasize organizational risk strategy, executive leadership, and policy governance.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "What fundamental architectural changes distinguish TLS 1.3 from TLS 1.2 to maximize both security and performance?",
      options: [
        "TLS 1.3 uses plain text",
        "TLS 1.3 requires 10 round trips",
        "TLS 1.3 only works on Linux",
        "TLS 1.3 completely removed obsolete cipher suites (static RSA, CBC mode, RC4, 3DES), mandated forward secrecy via ECDHE, and reduced handshake latency to 1-RTT"
      ],
      correct_option_index: 3,
      explanation: "TLS 1.3 stripped away vulnerable legacy algorithms, made forward secrecy mandatory, and streamlined the handshake to a single round-trip.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In applied cryptography, why does Elliptic Curve Cryptography (ECC, such as Ed25519 or ECDSA over P-256) offer superior architectural performance compared to traditional RSA?",
      options: [
        "A 256-bit ECC key provides equivalent cryptographic security strength to a 3072-bit RSA key, significantly reducing CPU processing cycles, memory usage, and network bandwidth overhead",
        "ECC is 100 years older than RSA",
        "ECC does not require mathematics",
        "RSA has been completely broken by basic calculators"
      ],
      correct_option_index: 0,
      explanation: "ECC achieves high cryptographic security with much smaller key sizes (256-bit vs 3072-bit), dramatically cutting compute and bandwidth overhead.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Public Key Infrastructure (PKI), what is 'OCSP Stapling' and what problem does it solve in TLS certificate validation?",
      options: [
        "Stapling physical paper certificates to server chassis",
        "A tool that deletes expired domain names",
        "The web server caches a time-stamped, CA-digitally signed OCSP revocation response and sends it directly to the browser during the TLS handshake, eliminating privacy leaks and client CA query latency",
        "A method for encrypting email attachments"
      ],
      correct_option_index: 2,
      explanation: "OCSP Stapling has the server deliver the signed CA validity proof directly to the client, improving performance and protecting user privacy.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In identity federation, what is the architectural difference between SAML 2.0 and OpenID Connect (OIDC)?",
      options: [
        "SAML only works on mobile phones; OIDC works on printers",
        "SAML 2.0 uses XML-based security assertions common in enterprise legacy SSO, whereas OIDC is a lightweight identity layer built on OAuth 2.0 using JSON Web Tokens (JWT) optimized for modern web and mobile apps",
        "OIDC is unencrypted",
        "SAML requires no identity provider"
      ],
      correct_option_index: 1,
      explanation: "SAML 2.0 relies on heavy XML payloads for enterprise federation, while OIDC uses RESTful JSON Web Tokens (JWT) on top of OAuth 2.0.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In the Lockheed Martin Cyber Kill Chain, what sequential stage follows 'Weaponization' and precedes 'Exploitation'?",
      options: [
        "Delivery (transmitting the weaponized payload to the target environment via phishing, web application exploit, or supply chain)",
        "Actions on Objectives",
        "Installation",
        "Reconnaissance"
      ],
      correct_option_index: 0,
      explanation: "The 7 Kill Chain stages proceed: Reconnaissance -> Weaponization -> Delivery -> Exploitation -> Installation -> Command & Control -> Actions on Objectives.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #43.");
  console.log("Skill #43 update completed successfully!");
}

run();
