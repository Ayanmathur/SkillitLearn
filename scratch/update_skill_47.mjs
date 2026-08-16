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

const skillId = "d500417b-587f-4fbc-bbd4-7c039ce6fd61";

async function run() {
  console.log("Updating Skill #47: Networking Fundamentals (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: OSI Architecture, Encapsulation and Binary Subnetting" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Transport Protocols, Deep Packet Analysis and Routing" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Core Network Services, Next-Gen Firewalls and Secure Tunnels" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / CCNA / CCNP Security level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The OSI 7-Layer and TCP/IP Encapsulation Models",
      order_index: 1,
      content: `### Network Layering Architectures and Data Encapsulation

Modern internetworking is organized across the OSI 7-layer and TCP/IP protocol stacks:

1. The OSI 7-Layer Reference Model:
   - Layer 1 (Physical): Bitstream transmission over copper, fiber, and RF media.
   - Layer 2 (Data Link): Framing, physical MAC addressing (48-bit), error detection (CRC-32), and switch forwarding.
   - Layer 3 (Network): Logical IP packet addressing and path determination across routers.
   - Layer 4 (Transport): End-to-end transport segments (TCP stateful connections, UDP datagrams, port multiplexing).
   - Layer 5 (Session): Session lifecycle checkpointing and dialogue control.
   - Layer 6 (Presentation): Data serialization, syntax translation, and TLS cryptographic encryption.
   - Layer 7 (Application): High-level network application interfaces (HTTP/HTTPS, DNS, SSH, SMTP, BGP).

2. Protocol Data Unit (PDU) Encapsulation:
   - Data (L7-5) -> Segment (L4) -> Packet (L3) -> Frame (L2) -> Bits (L1).
   - IEEE 802.3 Ethernet Frame: Preamble, Destination MAC (6 bytes), Source MAC (6 bytes), EtherType (e.g. 0x0800 IPv4, 0x86DD IPv6, 0x0806 ARP), Payload (46 to 1500 bytes MTU), and Frame Check Sequence (FCS / CRC-32).`
    },
    {
      track_id: track1Id,
      title: "IPv4, IPv6 and Binary Subnetting: CIDR and VLSM",
      order_index: 2,
      content: `### Binary Subnet Calculations and Internet Addressing

1. IPv4 Binary Subnet Mathematics:
   - 32-bit addresses divided into Network and Host portions by a subnet mask.
   - Usable host capacity formula: \`Capacity = 2^(32 - Prefix) - 2\` (subtracting network and broadcast addresses).
   - Example: A \`/26\` prefix yields a 64-address block (256 - 192 = 64) with 62 usable host IPs.

2. Classless Inter-Domain Routing (CIDR) and RFC 1918 Private Ranges:
   - \`10.0.0.0/8\` (10.0.0.0 to 10.255.255.255)
   - \`172.16.0.0/12\` (172.16.0.0 to 172.31.255.255)
   - \`192.168.0.0/16\` (192.168.0.0 to 192.168.255.255)
   - Carrier-Grade NAT (CGNAT): \`100.64.0.0/10\` (RFC 6598).

3. IPv6 Architecture:
   - 128-bit hexadecimal notation (e.g. \`2001:0db8:85a3::8a2e:0370:7334\`). Eliminates broadcast domains (replaced by efficient Multicast), incorporates Stateless Address Autoconfiguration (SLAAC), and replaces ARP with Neighbor Discovery Protocol (NDP).`
    },
    {
      track_id: track1Id,
      title: "Layer 2 Operations: ARP, Switching, VLANs and 802.1Q",
      order_index: 3,
      content: `### Switching Mechanics, ARP Exploits and Virtual LAN Segmentation

1. Address Resolution Protocol (ARP):
   - Resolves Layer 3 IP addresses to Layer 2 MAC addresses via local broadcast requests and unicast replies.
   - ARP Poisoning / Spoofing: An adversary sends unsolicited gratuitous ARP replies, poisoning switch and host ARP tables to position themselves as a Man-in-the-Middle (MitM).
   - Defense: Dynamic ARP Inspection (DAI) coupled with DHCP Snooping binding tables.

2. Virtual Local Area Networks (VLANs) and IEEE 802.1Q:
   - Isolates broadcast domains at Layer 2.
   - 802.1Q Tagging: Inserts a 4-byte tag (including a 12-bit VLAN ID supporting 4,096 VLANs) into the Ethernet frame header across inter-switch trunk links.
   - Mitigating VLAN Hopping: Disabling DTP (Dynamic Trunking Protocol) and changing the default Native VLAN away from VLAN 1.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Transport Layer Mechanics: TCP State Machine and UDP",
      order_index: 1,
      content: `### Transport Layer Reliability, Flags and Socket Multiplexing

1. TCP 3-Way Handshake and Connection Teardown:
   - Establishment: Client sends SYN (Initial Sequence Number ISN) -> Server replies with SYN-ACK (Server ISN + Client ISN + 1) -> Client sends ACK (Server ISN + 1).
   - Termination: 4-way FIN -> ACK -> FIN -> ACK handshake, concluding in the TIME_WAIT state (2 * MSL) to ensure lingering duplicate segments dissipate.

2. TCP Header Flags:
   - SYN (Synchronize), ACK (Acknowledgment), FIN (Finish), RST (Reset - immediate termination), PSH (Push data to app), URG (Urgent pointer), ECE, CWR (Congestion notification).
   - Reliability Mechanics: Sliding window flow control, cumulative acknowledgments, and Selective Acknowledgment (SACK).

3. User Datagram Protocol (UDP):
   - Connectionless, unreliable, 8-byte header (Source Port, Dest Port, Length, Checksum).
   - Low-latency transport ideal for DNS, VoIP, real-time gaming, and QUIC (HTTP/3), vulnerable to IP spoofing amplification attacks.`
    },
    {
      track_id: track2Id,
      title: "Packet Capture Forensics: Wireshark, BPF Filters and PCAPs",
      order_index: 2,
      content: `### Deep Packet Inspection and Network Forensic Analysis

1. Berkeley Packet Filters (BPF) Capture Syntax:
   - Filtering traffic at the kernel network tap before writing to disk:
     - \`tcp port 80 and not host 192.168.1.1\`
     - \`tcp[tcpflags] & (tcp-syn) != 0 and tcp[tcpflags] & (tcp-ack) == 0\` (captures pure SYN packets).

2. Wireshark Display Filters:
   - \`http.request.method == "POST"\`
   - \`tcp.flags.reset == 1 and tcp.seq == 1\`
   - \`dns.flags.response == 1 and dns.time > 0.5\`

3. Reconstructing TCP Streams:
   - Reassembling packet payloads into continuous application streams, allowing forensic analysts to extract transferred malware binaries, cleartext HTTP credentials, and reverse shell commands.`
    },
    {
      track_id: track2Id,
      title: "Network Routing Dynamics: Static Routes, OSPF and BGP",
      order_index: 3,
      content: `### Path Determination, Interior Gateways and BGP Routing

1. Routing Table Decision Hierarchy:
   - 1. Longest Prefix Match (LPM): The most specific route (e.g. \`/28\` wins over \`/24\`).
   - 2. Administrative Distance (AD): Trustworthiness of route source (Directly Connected: 0, Static: 1, eBGP: 20, OSPF: 110, iBGP: 200).
   - 3. Routing Metric: Cost / Hop Count.

2. Interior Gateway Protocols (OSPF):
   - Open Shortest Path First (OSPF v2/v3): Link-State protocol using Dijkstra's Shortest Path First (SPF) algorithm, dividing networks into hierarchical Area 0 (Backbone Area) and non-backbone areas.

3. Exterior Gateway Protocol (BGP):
   - Border Gateway Protocol (BGP-4): Path-Vector protocol interconnecting Autonomous Systems (ASNs) across the global internet.
   - BGP Route Hijacking & RPKI: Cryptographic Route Origin Authorizations (ROAs) signed via Resource Public Key Infrastructure (RPKI) to prevent malicious or accidental route hijacking.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "DNS Architecture, Recursion and DNSSEC Cryptographic Chains",
      order_index: 1,
      content: `### The Domain Name System and DNSSEC Security Architecture

1. DNS Resolution Architecture:
   - Root Hint Servers (\`.\`) -> Top-Level Domain (TLD) Nameservers (\`.com\`, \`.org\`) -> Authoritative Nameservers.
   - Essential Resource Records: A (IPv4), AAAA (IPv6), CNAME (canonical name alias), MX (mail exchange), TXT (SPF/DKIM/DMARC records), PTR (reverse DNS), NS (nameserver), SOA (start of authority).

2. The Kaminsky DNS Cache Poisoning Attack:
   - Exploited predictable 16-bit DNS transaction IDs and static UDP source ports to flood recursive resolvers with fraudulent IP mappings before authoritative servers replied.

3. Domain Name System Security Extensions (DNSSEC):
   - Cryptographic Authentication: Validates authenticity and integrity of DNS records using asymmetric digital signatures:
     - RRSIG (Resource Record Signature): Cryptographically signs record sets.
     - DNSKEY: Public key used to verify RRSIG records.
     - DS (Delegation Signer): Hash of the child DNSKEY placed in the parent zone, establishing an unbroken cryptographic chain of trust to the ICANN root zone.`
    },
    {
      track_id: track3Id,
      title: "Network Security Architecture: Stateful Firewalls, NGFW and IPS",
      order_index: 2,
      content: `### Perimeter Security, Deep Packet Inspection and Intrusion Prevention

1. Firewall Generations:
   - Stateless Packet Filters: Inspects headers independently without connection context.
   - Stateful Packet Inspection (SPI): Maintains connection state tables (SYN_SENT, ESTABLISHED), allowing return traffic dynamically.
   - Next-Generation Firewalls (NGFW - Palo Alto Networks, Fortinet, Check Point): Layer 7 Deep Packet Inspection (DPI), Application Identification (App-ID), and SSL/TLS Decryption Forward Proxies.

2. Intrusion Detection & Prevention Systems (IDS/IPS - Snort, Suricata):
   - Signature-Based Detection: Pattern matching against known exploit byte sequences (e.g. \`alert tcp any any -> $HOME_NET 80 (msg:"SQL Injection Attempt"; content:"UNION SELECT"; sid:10001;)\`).
   - Behavioral Anomaly Engines: Detecting port scans, SYN floods, and abnormal traffic volume spikes.`
    },
    {
      track_id: track3Id,
      title: "Secure Network Tunnels: IPsec, WireGuard, OpenVPN and NAT",
      order_index: 3,
      content: `### Cryptographic VPN Tunnels and Network Address Translation

1. IPsec (Internet Protocol Security) Architecture:
   - Internet Key Exchange (IKEv2): Authenticates peers and negotiates cryptographic keys.
   - Encapsulating Security Payload (ESP): Provides encryption (confidentiality) and data origin authentication (integrity) over IP protocol 50.
   - Tunnel Mode (encrypts original IP header + payload; site-to-site VPNs) vs Transport Mode (encrypts payload only; host-to-host).

2. Modern VPN Technologies:
   - WireGuard: Lightweight, high-performance kernel-space VPN using Noise protocol framework, Curve25519 ECDH, ChaCha20-Poly1305 AEAD, and BLAKE2s with under 4,000 lines of code.
   - OpenVPN: SSL/TLS-based user-space VPN operating over TCP or UDP port 1194.

3. Network Address Translation (NAT / PAT):
   - Port Address Translation (PAT / NAT Overload): Translates thousands of internal private RFC 1918 IP addresses onto a single public IP address using unique Layer 4 source ports.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #47.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In the OSI 7-layer model, at which layer do logical IP packet addressing and router path determinations operate?",
      options: [
        "Layer 1 (Physical)",
        "Layer 2 (Data Link)",
        "Layer 3 (Network)",
        "Layer 7 (Application)"
      ],
      correct_option_index: 2,
      explanation: "Layer 3 (Network Layer) is responsible for logical IP addressing, packet routing, and subnet forwarding.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What sequence of packets establishes a reliable connection in the TCP 3-Way Handshake?",
      options: [
        "SYN -> SYN-ACK -> ACK",
        "HELLO -> PING -> PONG",
        "GET -> POST -> PUT",
        "START -> RUN -> STOP"
      ],
      correct_option_index: 0,
      explanation: "TCP establishes connections through a 3-way handshake: Client sends SYN, Server replies with SYN-ACK, and Client confirms with ACK.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "Which of the following IP address ranges is officially designated by RFC 1918 as a private non-routable IPv4 address block?",
      options: [
        "8.8.8.0/24",
        "1.1.1.0/24",
        "200.100.50.0/24",
        "192.168.0.0/16"
      ],
      correct_option_index: 3,
      explanation: "192.168.0.0/16, 10.0.0.0/8, and 172.16.0.0/12 are the designated RFC 1918 private IPv4 address allocations.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In Layer 2 networking, what protocol resolves a known Layer 3 IP address to a physical Layer 2 MAC address on a local area network?",
      options: [
        "DNS",
        "Address Resolution Protocol (ARP)",
        "HTTP",
        "BGP"
      ],
      correct_option_index: 1,
      explanation: "ARP maps logical Layer 3 IP addresses to physical 48-bit Layer 2 MAC addresses via local broadcast requests.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In standard binary subnetting, how many usable host IP addresses are available in a '/24' IPv4 subnet (255.255.255.0)?",
      options: [
        "256",
        "512",
        "254 (256 minus network and broadcast addresses)",
        "100"
      ],
      correct_option_index: 2,
      explanation: "A /24 network has 2^(32-24) = 256 total addresses; subtracting the network address (.0) and broadcast address (.255) leaves 254 usable host IPs.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In DNS security, what cryptographic mechanism does DNSSEC use to validate that DNS query responses originated from the authentic domain owner and were not tampered with in transit?",
      options: [
        "Wiping the DNS server disk",
        "Asymmetric digital signatures (RRSIG records) verified via DNSKEY and DS records forming a cryptographic chain of trust to the root zone",
        "Sending DNS queries over postal mail",
        "Disabling all domain names"
      ],
      correct_option_index: 1,
      explanation: "DNSSEC uses digital signatures (RRSIG) validated through parent-child DS/DNSKEY delegations up to the ICANN root zone.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "What network attack is mitigated by enabling 'Dynamic ARP Inspection' (DAI) and 'DHCP Snooping' on enterprise access switches?",
      options: [
        "Physical cable cutting",
        "Spam email",
        "Password cracking",
        "ARP Spoofing / ARP Poisoning Man-in-the-Middle (MitM) attacks"
      ],
      correct_option_index: 3,
      explanation: "DAI intercepts gratuitous and invalid ARP packets, validating them against the trusted DHCP snooping binding table to block ARP poisoning.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In routing table path selection algorithms, what rule takes absolute top priority when a router chooses between multiple valid routes to a destination?",
      options: [
        "Longest Prefix Match (LPM - selecting the most specific subnet mask, such as /28 over /24)",
        "The cheapest router price",
        "Alphabetical order of route names",
        "Random selection"
      ],
      correct_option_index: 0,
      explanation: "Longest Prefix Match (LPM) is the foundational routing rule: the route with the most specific prefix length (/28 vs /24) is always preferred.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In packet capture analysis with Wireshark/tcpdump, what Berkeley Packet Filter (BPF) capture expression captures only incoming TCP SYN packets without ACK flags (initiating new connections)?",
      options: [
        "capture all",
        "port 80 only",
        "tcp[tcpflags] & (tcp-syn) != 0 and tcp[tcpflags] & (tcp-ack) == 0",
        "ip.addr == 1.1.1.1"
      ],
      correct_option_index: 2,
      explanation: "The bitwise BPF filter tcp[tcpflags] & (tcp-syn) != 0 and tcp[tcpflags] & (tcp-ack) == 0 filters specifically for pure connection initiation SYN packets.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What is the primary architectural difference between Stateful Packet Inspection (SPI) firewalls and Next-Generation Firewalls (NGFW)?",
      options: [
        "SPI firewalls run on batteries; NGFW runs on electricity",
        "SPI firewalls track Layer 4 connection state tables, whereas NGFWs perform Layer 7 Deep Packet Inspection (DPI), Application Identification (App-ID), and SSL decryption",
        "NGFW only works on smartphones",
        "SPI firewalls cannot block IP addresses"
      ],
      correct_option_index: 1,
      explanation: "Stateful firewalls operate up to Layer 4 tracking TCP states; NGFWs inspect Layer 7 application payloads (App-ID) and decrypt TLS traffic.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "In global internet routing security, what technology uses cryptographically signed Route Origin Authorizations (ROAs) to prevent BGP Route Hijacking across Autonomous Systems?",
      options: [
        "Simple Static Routing",
        "HTML Form Validation",
        "Telnet Authentication",
        "Resource Public Key Infrastructure (RPKI)"
      ],
      correct_option_index: 3,
      explanation: "RPKI allows Autonomous System owners to cryptographically sign Route Origin Authorizations (ROAs), preventing BGP hijacking and route leaks.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In modern VPN protocol architecture, why does WireGuard achieve significantly higher throughput and lower connection latency compared to legacy IPsec and OpenVPN?",
      options: [
        "It runs in Linux kernel space using modern high-speed primitives (Curve25519, ChaCha20-Poly1305, Noise Protocol) with an ultra-compact codebase under 4,000 lines of code",
        "It operates without encryption",
        "It uses plain text UDP",
        "It bypasses all network routing"
      ],
      correct_option_index: 0,
      explanation: "WireGuard utilizes state-of-the-art cryptographic primitives in a streamlined kernel-space implementation of <4,000 lines, maximizing speed and auditability.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In IEEE 802.1Q Ethernet framing, how does a switch handle Native VLAN frames across a trunk link, and why does this present a security risk if misconfigured?",
      options: [
        "Native VLAN frames are encrypted with RSA-4096",
        "Native VLAN frames are dropped immediately",
        "Untagged frames traversing a trunk are assumed to belong to the Native VLAN; misconfiguring Native VLAN 1 enables double-tagging VLAN hopping attacks",
        "Native VLANs can only carry voice traffic"
      ],
      correct_option_index: 2,
      explanation: "Trunk ports transmit Native VLAN traffic untagged; leaving Native VLAN set to default VLAN 1 permits double-tagging VLAN hopping exploits.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In the TCP state machine, what is the purpose of the 'TIME_WAIT' connection state (lasting 2 * Maximum Segment Lifetime - MSL) after closing a socket?",
      options: [
        "To allow the computer to sleep",
        "To ensure the remote host received the final ACK and to allow any lingering duplicate packets wandering the network to dissipate before the port can be reused",
        "To charge extra fees for internet usage",
        "To reboot the operating system kernel"
      ],
      correct_option_index: 1,
      explanation: "TIME_WAIT ensures delayed in-flight TCP segments dissipate, preventing old duplicate data from corrupting newly opened connections on identical sockets.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "How does Port Address Translation (PAT / NAT Overload) allow hundreds of internal corporate workstations with RFC 1918 private IPs to browse the public internet simultaneously through a single public IPv4 address?",
      options: [
        "The router translates internal source IP and port combinations onto unique dynamic Layer 4 ephemeral source ports on its single external public IP, maintaining a stateful NAT mapping table",
        "By giving every computer the exact same MAC address",
        "By turning off IPv4 and using Morse code",
        "By broadcasting all traffic to all computers"
      ],
      correct_option_index: 0,
      explanation: "PAT multiplexes many private hosts onto a single public IP by tracking and rewriting unique Layer 4 source ports in a stateful NAT table.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #47.");
  console.log("Skill #47 update completed successfully!");
}

run();
