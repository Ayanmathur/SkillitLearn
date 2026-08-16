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

const skillId = "81662514-07f4-4a03-8aa7-871e056b1ebb";

async function run() {
  console.log("Updating Skill #29: Systems & Networking (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Linux Kernel Internals, Virtual Memory and High-Performance I/O" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: TCP/IP Stack Architecture, Congestion Control and Sockets" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Domain Name System, BGP Routing and Kernel Packet Filtering" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Linux Process Lifecycle, Context Switching and Kernel vs User Space",
      order_index: 1,
      content: `### Architecture of the Linux Kernel Execution Environment

Operating system engineering relies on hardware-enforced protection boundaries:

1. Kernel Space (Ring 0) vs User Space (Ring 3):
   - Dual-Mode Silicon Execution: User applications execute in unprivileged Ring 3, isolated from raw physical hardware.
   - System Calls: To access disk, memory, or network hardware, applications invoke software traps (\`syscall\` instruction), causing CPU transition into Ring 0 supervisor mode.
   - Virtual File System (VFS): Abstracts block devices, network sockets, pipes, and IPC mechanisms into universal File Descriptors (\`fd\`).

2. Process Creation and CPU Scheduling:
   - Creation Mechanics: \`fork()\` duplicates the parent process table entry (\`task_struct\`) using Copy-on-Write (CoW); \`execve()\` replaces the process address space with a new executable ELF binary.
   - Completely Fair Scheduler (CFS): Linux CPU scheduler using a Red-Black Tree to schedule tasks based on virtual runtime (\`vruntime\`), ensuring proportional CPU allocation.
   - Context Switching Overhead: Involuntary context switches force CPU register saving, program counter swapping, and Translation Lookaside Buffer (TLB) cache flushes.

3. Signals and Inter-Process Communication (IPC):
   - Signals: Asynchronous notifications dispatched by the kernel (\`SIGTERM\` 15 graceful termination, \`SIGKILL\` 9 uncatchable forced termination, \`SIGSEGV\` 11 invalid memory access).
   - IPC Channels: Anonymous pipes, POSIX shared memory (\`shm_open\`), and high-speed local Unix Domain Sockets (\`AF_UNIX\`).`
    },
    {
      track_id: track1Id,
      title: "Virtual Memory Subsystems, Page Tables, TLB and OOM Killer",
      order_index: 2,
      content: `### Virtual Memory Management and Kernel Allocators

1. 64-Bit Virtual Memory Translation:
   - Virtual Address Space: Applications operate in contiguous virtual memory mapped to non-contiguous physical RAM frames via 4-level or 5-level Page Tables (PML4/PML5 -> PDP -> PD -> PT).
   - Translation Lookaside Buffer (TLB): High-speed hardware CPU cache storing recent virtual-to-physical address translations.
   - Page Fault Dynamics:
     - Minor Page Fault: Requested memory page is resident in RAM but unmapped in the process page table (e.g. allocating zeroed memory or CoW write).
     - Major Page Fault: Page must be read synchronously from swap space or block storage, blocking CPU execution for milliseconds.

2. Transparent Huge Pages (THP) and Page Cache:
   - THP merges standard 4 KB memory pages into 2 MB or 1 GB Huge Pages, reducing page table size and drastically cutting TLB miss rates for database workloads.
   - Page Cache: The kernel caches disk blocks in unallocated RAM; dirty pages are flushed to disk asynchronously by background flusher threads (\`vm.dirty_ratio\`).

3. Memory Overcommit and the Out-Of-Memory (OOM) Killer:
   - Memory Overcommit (\`vm.overcommit_memory\`): Linux grants memory allocation requests exceeding physical RAM based on heuristic estimates.
   - The OOM Killer: When physical RAM and swap are exhausted, the kernel calculates an \`oom_score\` (proportional to RSS memory usage minus \`oom_score_adj\`) and sends \`SIGKILL\` to the highest-scoring process to save the operating system from a kernel panic.`
    },
    {
      track_id: track1Id,
      title: "High-Performance I/O: Blocking, Non-Blocking, epoll and io_uring",
      order_index: 3,
      content: `### Scalable I/O Multiplexing and Modern Kernel Asynchronous Interfaces

Solving the C10K and C1000K concurrency problems requires event-driven I/O architectures:

1. Evolution of I/O Multiplexing:
   - Blocking I/O: One thread per connection; scaling to 10,000 connections exhausts memory and CPU due to thread stack allocations and context switching.
   - Legacy \`select()\` and \`poll()\`: Suffers from \`O(N)\` overhead, linearly scanning thousands of file descriptors on every event loop iteration.
   - Scalable \`epoll\`: Operates in \`O(1)\` constant time. Uses an in-kernel Red-Black Tree to monitor registered sockets and an event ready-list populated by hardware interrupts:
     - Level-Triggered (LT): Notifies continuously as long as data remains in the buffer.
     - Edge-Triggered (ET): Notifies only when new state transitions occur, requiring non-blocking drained loops.

2. Zero-Copy Data Transfer (\`sendfile\` / \`splice\`):
   - Bypasses user-space memory buffers, streaming data directly from page cache storage to network socket buffers via Direct Memory Access (DMA), eliminating CPU memory copies.

3. Next-Generation Asynchronous I/O (\`io_uring\`):
   - Linux 5.1+ asynchronous interface using two lockless ring-buffers (Submission Queue SQ and Completion Queue CQ) shared in kernel/user mapped memory.
   - Eliminates system call overhead entirely via kernel polling threads (\`IORING_SETUP_SQPOLL\`), processing hundreds of thousands of IOPS with zero context switches.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "TCP State Machine, Three-Way Handshake and TIME_WAIT Sockets",
      order_index: 1,
      content: `### Deep Mechanics of the Transmission Control Protocol (TCP)

1. The TCP Three-Way Handshake:
   - Step 1 (SYN): Client sends a SYN packet with an initial sequence number (ISN).
   - Step 2 (SYN-ACK): Server allocates socket memory in the SYN backlog queue and responds with SYN-ACK.
   - Step 3 (ACK): Client acknowledges with ACK; connection moves to \`ESTABLISHED\` state.
   - SYN Flood Defense: When SYN queues saturate during DDoS attacks, SYN Cookies (\`net.ipv4.tcp_syncookies = 1\`) encode state mathematically into the sequence number, eliminating memory allocation until the final ACK arrives.

2. Connection Teardown and the TIME_WAIT State:
   - Four-Way Teardown (FIN -> ACK -> FIN -> ACK): The endpoint initiating active close enters the \`TIME_WAIT\` state.
   - Purpose of TIME_WAIT:
     - Lasts for 2 * Maximum Segment Lifetime (2*MSL, typically 60 seconds).
     - Guarantees that any delayed duplicate packets in the internet expire, preventing corruption of future connections reusing the same 4-tuple (Source IP, Source Port, Dest IP, Dest Port).
     - Ensures the final ACK was received by the remote host.
   - Mitigating Ephemeral Port Exhaustion: Enabling socket reuse (\`SO_REUSEADDR\`, \`SO_REUSEPORT\`) and tuning \`net.ipv4.tcp_tw_reuse = 1\`.`
    },
    {
      track_id: track2Id,
      title: "TCP Congestion Control: Loss-Based vs BBR and Bufferbloat",
      order_index: 2,
      content: `### Congestion Control Dynamics and Bandwidth-Delay Product

1. Flow Control vs Congestion Control:
   - Flow Control (Receiver Window \`rwnd\`): Advertised in TCP headers to prevent sender from overflowing the receiving application's buffer.
   - Congestion Control (Congestion Window \`cwnd\`): Calculated dynamically by the sender to prevent overwhelming network router queues.
   - Maximum Transmission Rate: \`min(rwnd, cwnd)\`.

2. Bandwidth-Delay Product (BDP):
   - The volume of data that can be in flight simultaneously across a network link:
\`\`\`
BDP = Bottleneck Bandwidth * Round-Trip Time (RTT)
\`\`\`
   - Socket buffer auto-tuning (\`net.ipv4.tcp_rmem\`, \`net.ipv4.tcp_wmem\`) must scale buffer sizes to match the BDP on high-bandwidth long-distance connections (e.g. 10 Gbps transatlantic links).

3. Loss-Based vs Model-Based Congestion Algorithms:
   - Loss-Based Algorithms (TCP Reno, TCP Cubic):
     - Assume packet loss is caused by network congestion. Constantly increases \`cwnd\` until packet loss occurs, filling router buffers and causing 'Bufferbloat' (high latency spikes).
   - Model-Based Algorithm (TCP BBR / Bottleneck Bandwidth and RTT):
     - Developed by Google; measures actual path bandwidth and minimum round-trip time directly without waiting for packet drops.
     - Maintains maximum transmission throughput while operating with empty router queues, eliminating bufferbloat and dramatically improving throughput on lossy Wi-Fi/cellular networks.`
    },
    {
      track_id: track2Id,
      title: "Network Layer Protocols: IPv4/IPv6, ARP, ICMP and Path MTU",
      order_index: 3,
      content: `### Network Layer Protocols and Packet Routing Mechanics

1. IPv4 / IPv6 Subnetting and VLSM:
   - Classless Inter-Domain Routing (CIDR) subnet masks and routing table longest-prefix matching.
   - IPv6: 128-bit address space, eliminating NAT via Stateless Address Autoconfiguration (SLAAC) and Neighbor Discovery Protocol (NDP).

2. Address Resolution Protocol (ARP):
   - Resolves Layer 3 IP addresses to Layer 2 physical MAC addresses on local Ethernet broadcast domains.
   - Gratuitous ARP: Broadcasts updated IP-to-MAC mappings during high-availability failover events (e.g. Keepalived / VRRP).

3. Maximum Transmission Unit (MTU) and Path MTU Discovery (PMTUD):
   - Standard Ethernet MTU: 1,500 bytes (Jumbo Frames: 9,000 bytes).
   - PMTUD Mechanics: Packets are transmitted with the Don't Fragment (\`DF\`) bit set in the IP header. If a router cannot forward a packet because its MTU is smaller than packet size, it drops the packet and transmits an ICMP Type 3 Code 4 ('Fragmentation Needed and DF set') message back to the sender containing the next-hop MTU.
   - Black Hole PMTUD Failures: When over-aggressive firewalls block all ICMP messages, large TCP packets (like TLS handshakes) are silently dropped forever without error notifications, causing hanging connections.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Domain Name System: Recursive Resolvers, Anycast and DNSSEC",
      order_index: 1,
      content: `### Global DNS Architecture and Cryptographic Verification

1. The Hierarchical DNS Resolution Pipeline:
   - Stub Resolver (Client \`/etc/resolv.conf\`) -> Local Recursive Caching Resolver (e.g. 1.1.1.1, 8.8.8.8) -> Root Name Servers (13 logical clusters A-M) -> Top-Level Domain (TLD) Name Servers (\`.com\`, \`.org\`) -> Authoritative Name Servers.

2. Core DNS Resource Records (RR):
   - \`A\` (IPv4), \`AAAA\` (IPv6), \`CNAME\` (Canonical Name alias), \`MX\` (Mail Exchanger), \`TXT\` (Domain verification, SPF, DKIM), \`SRV\` (Service discovery port/priority), \`CAA\` (Certificate Authority Authorization).
   - Caching and TTL: Controlled by Time-To-Live (TTL) values; negative caching defined in SOA records.

3. Global Anycast DNS and Geo-Routing:
   - Anycast BGP routing directs DNS queries to the nearest physical edge data center out of hundreds of global locations.
   - EDNS0 Client Subnet (ECS): Passes client IP prefix to authoritative servers to enable geographically accurate CDN edge routing.

4. Domain Name System Security Extensions (DNSSEC):
   - Cryptographically signs DNS records using public-key cryptography (RRSIG, DNSKEY, DS records).
   - Establishes a cryptographic chain of trust rooted in the ICANN Root Zone, completely preventing DNS cache poisoning and man-in-the-middle spoofing attacks.`
    },
    {
      track_id: track3Id,
      title: "Dynamic Internet Routing: Autonomous Systems and BGP Protocol",
      order_index: 2,
      content: `### Global Internet Topology and Border Gateway Protocol (BGP)

1. Autonomous Systems (AS) and Inter-Domain Routing:
   - Autonomous System (AS): A collection of IP routing prefixes under a single administrative domain assigned a unique Autonomous System Number (ASN / 16-bit or 32-bit).
   - Interior Gateway Protocols (IGP / OSPF, IS-IS): Routes traffic internally within an organization's network.
   - Exterior Gateway Protocol (BGP-4 / RFC 4271): The path-vector routing protocol running the global internet backbone over TCP port 179.

2. BGP Path Attributes and Route Selection Decision Tree:
   - Network Layer Reachability Information (NLRI) exchanged with attributes:
     - Weight (Local preference attribute on Cisco routers).
     - Local Preference: Highest value wins; steers outbound egress traffic.
     - AS Path Length: Shortest list of traversed ASNs wins (can be inflated via AS Path Prepending for backup links).
     - Multi-Exit Discriminator (MED): Inbound traffic steering metric suggested to neighboring peers.
     - eBGP paths preferred over iBGP paths.

3. Mitigating BGP Route Hijacking with RPKI:
   - Resource Public Key Infrastructure (RPKI): Cryptographic framework creating Route Origin Authorizations (ROAs), validating that an AS is legally authorized to announce a specific IP prefix.`
    },
    {
      track_id: track3Id,
      title: "Kernel Packet Filtering: Netfilter, iptables, NFTables and eBPF/XDP",
      order_index: 3,
      content: `### Linux Network Subsystem and Wire-Rate Packet Processing

1. Netfilter Kernel Framework and iptables:
   - Netfilter: Kernel subsystem exposing 5 packet hook points: \`PREROUTING\`, \`INPUT\`, \`FORWARD\`, \`OUTPUT\`, \`POSTROUTING\`.
   - \`iptables\` Tables:
     - \`raw\` (Bypasses connection tracking).
     - \`mangle\` (Modifies TTL, TOS, or packet marks).
     - \`nat\` (Source NAT \`SNAT\` / Destination NAT \`DNAT\` / \`MASQUERADE\`).
     - \`filter\` (Accept, Drop, Reject rules).
   - The O(N) Scaling Problem: \`iptables\` processes rules sequentially in a linear array. When Kubernetes clusters scale to 20,000 services (100,000 rules), \`iptables\` latency spikes catastrophically.

2. NFTables:
   - Replaces iptables with an in-kernel bytecode virtual machine, combining tables into unified rule sets and using hash maps for \`O(1)\` lookups.

3. eXpress Data Path (XDP) and eBPF Packet Filtering:
   - Bypasses the entire Linux network stack (\`sk_buff\` allocation).
   - Executes sandboxed eBPF programs directly inside the Network Interface Card (NIC) driver at the lowest software layer upon packet arrival.
   - Capable of filtering, modifying, and dropping DDoS attack packets at wire rate (exceeding 20 million packets per second per CPU core).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #29.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In the Linux CPU execution model, what privilege ring transition occurs when a user-space application executes a system call (such as read or write) to request hardware access?",
      options: [
        "Transition from Ring 3 (User Space) to Ring 0 (Kernel Space)",
        "Transition from Ring 0 to Ring 3",
        "Transition to BIOS mode",
        "Transition to GPU mode"
      ],
      correct_option_index: 0,
      explanation: "User applications run in Ring 3 (unprivileged user space) and transition to Ring 0 (privileged kernel space) during system calls.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What Linux kernel component calculates an 'oom_score' to terminate memory-heavy processes with SIGKILL when physical RAM and swap space are completely exhausted?",
      options: [
        "Completely Fair Scheduler",
        "Virtual File System",
        "Out-Of-Memory (OOM) Killer",
        "systemd-journald"
      ],
      correct_option_index: 2,
      explanation: "The OOM Killer intervenes during severe memory starvation to kill candidate processes based on oom_score to prevent kernel panics.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What TCP socket state lasts for 2 * Maximum Segment Lifetime (2*MSL, ~60 seconds) after active connection close to ensure delayed duplicate packets expire in the network?",
      options: [
        "SYN_SENT",
        "TIME_WAIT",
        "ESTABLISHED",
        "LISTEN"
      ],
      correct_option_index: 1,
      explanation: "The TIME_WAIT state persists for 2*MSL to allow delayed duplicate packets to expire and guarantee reliable reception of the final ACK.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What high-performance Linux packet processing technology executes sandboxed eBPF bytecode directly inside the Network Interface Card (NIC) driver before socket buffer allocation to drop DDoS packets at line rate?",
      options: [
        "FTP Proxy",
        "Apache Web Server",
        "Telnet",
        "eXpress Data Path (XDP)"
      ],
      correct_option_index: 3,
      explanation: "XDP executes eBPF programs at the earliest layer in the network driver before kernel socket buffer allocation, enabling wire-rate packet filtering.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In scalable I/O multiplexing, what Linux system call provides O(1) constant-time event readiness notifications using an in-kernel Red-Black Tree and ready-list?",
      options: [
        "epoll (epoll_create / epoll_wait)",
        "select()",
        "poll()",
        "sleep()"
      ],
      correct_option_index: 0,
      explanation: "epoll maintains an in-kernel interest list using a red-black tree, delivering constant-time O(1) event readiness regardless of monitored socket count.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "How does Google's TCP BBR (Bottleneck Bandwidth and RTT) congestion control algorithm fundamentally differ from traditional loss-based algorithms like TCP Cubic?",
      options: [
        "BBR only transmits data on Sundays",
        "BBR disables packet acknowledgments",
        "BBR increases latency to maximum levels",
        "BBR models the actual bottleneck bandwidth and round-trip time directly without waiting for packet loss, preventing bufferbloat and maintaining high throughput with empty router queues"
      ],
      correct_option_index: 3,
      explanation: "BBR continuously measures actual bottleneck bandwidth and min RTT directly, achieving maximum throughput without causing queue bufferbloat.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Path MTU Discovery (PMTUD), what causes a 'Black Hole' connection failure where small HTTP requests succeed but large file transfers or TLS handshakes hang indefinitely?",
      options: [
        "The computer running out of battery",
        "Upstream network firewalls block all ICMP messages, preventing the sender from receiving ICMP Type 3 Code 4 ('Fragmentation Needed') packets when MTU is exceeded",
        "A bad Ethernet cable",
        "The web browser clearing its history"
      ],
      correct_option_index: 1,
      explanation: "When firewalls drop ICMP Type 3 Code 4 messages, the sender never learns to reduce its packet size, causing oversized packets with the DF bit set to be dropped silently.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What security extension (DNSSEC) protects the Domain Name System from cache poisoning and man-in-the-middle spoofing attacks?",
      options: [
        "Cryptographically signing DNS records using public-key cryptography (RRSIG, DNSKEY, DS records) establishing a chain of trust back to the Root Zone",
        "Encrypting all domain names with ROT13",
        "Disabling all DNS caching worldwide",
        "Requiring users to type IP addresses manually"
      ],
      correct_option_index: 0,
      explanation: "DNSSEC uses cryptographic digital signatures (RRSIG) validated through a hierarchical chain of trust back to the ICANN root zone to verify DNS authenticity.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In Linux memory management, how do Transparent Huge Pages (THP) improve database and high-throughput application performance?",
      options: [
        "By deleting half of physical RAM",
        "By converting RAM into SSD storage",
        "By merging standard 4 KB memory pages into 2 MB or 1 GB Huge Pages, reducing page table size and drastically cutting Translation Lookaside Buffer (TLB) miss rates",
        "By increasing CPU fan speed"
      ],
      correct_option_index: 2,
      explanation: "Huge pages increase memory page size from 4 KB to 2 MB/1 GB, allowing the CPU Translation Lookaside Buffer (TLB) to map far more memory with fewer cache entries.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What protocol is used by Autonomous Systems (AS) on the global internet backbone to exchange Network Layer Reachability Information (NLRI) over TCP port 179?",
      options: [
        "SNMP",
        "DHCP",
        "HTTP/2",
        "Border Gateway Protocol (BGP-4)"
      ],
      correct_option_index: 3,
      explanation: "BGP-4 is the standard path-vector routing protocol running the global internet backbone, establishing peer sessions over TCP port 179.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "How does the Linux 'io_uring' asynchronous I/O subsystem eliminate system call overhead when processing hundreds of thousands of concurrent I/O operations?",
      options: [
        "By ignoring all read and write errors",
        "By establishing two lockless ring-buffers (Submission Queue SQ and Completion Queue CQ) in memory shared between user space and kernel space, with optional kernel submission polling",
        "By writing all data to magnetic tape",
        "By routing all operations through a single global thread lock"
      ],
      correct_option_index: 1,
      explanation: "io_uring shares Submission and Completion ring buffers directly between user space and the kernel, enabling lockless asynchronous batching without syscall traps.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In high-throughput network engineering, what is the Bandwidth-Delay Product (BDP), and why must TCP socket memory buffers be auto-tuned to match it?",
      options: [
        "BDP is the cost of internet bandwidth per month",
        "BDP is the speed of electricity in copper cables",
        "BDP is the maximum volume of unacknowledged data that can be in flight across a network link (Bandwidth * RTT); socket buffers must match BDP to prevent sender throttling on high-speed long-latency links",
        "BDP is the number of routers between two computers"
      ],
      correct_option_index: 2,
      explanation: "BDP = Bandwidth * RTT. If TCP socket buffers are smaller than the BDP, the sender will stall waiting for ACKs before the network pipe is fully utilized.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Linux zero-copy data transfer mechanics, how does the 'sendfile' system call optimize streaming files to a network socket compared to standard read/write loops?",
      options: [
        "It streams data directly from the kernel Page Cache to the network socket buffer via Direct Memory Access (DMA), eliminating CPU memory copies and user-space context switches",
        "It compresses files into zip format before sending",
        "It deletes the file from disk during transmission",
        "It executes read and write operations on the GPU"
      ],
      correct_option_index: 0,
      explanation: "sendfile transfers data within kernel space directly from page cache to socket buffers, avoiding unnecessary data copies into user-space buffers.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In BGP routing policy decisions, how does BGP AS Path Prepending influence inbound traffic routing from external internet peers?",
      options: [
        "It disables all incoming connections",
        "It encrypts all BGP routing tables",
        "It forces peers to pay higher transit fees",
        "An organization artificially repeats its own Autonomous System Number (ASN) multiple times in the AS_PATH attribute when announcing routes to a backup ISP, making that path appear longer and less attractive"
      ],
      correct_option_index: 3,
      explanation: "AS Path Prepending artificially inflates the path length advertised to a backup provider, causing external internet routers to prefer the shorter primary route.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In Linux Netfilter packet processing, why does legacy 'iptables' suffer catastrophic performance degradation in large Kubernetes clusters running tens of thousands of services compared to IPVS or eBPF?",
      options: [
        "Because iptables only supports 8-bit numbers",
        "iptables evaluates rules sequentially in an O(N) linear linked list; with 100,000 rules, every incoming packet must evaluate thousands of rules sequentially, creating severe CPU latency spikes",
        "Because iptables requires manual user input for each packet",
        "Because iptables crashes when more than 10 pods exist"
      ],
      correct_option_index: 1,
      explanation: "iptables uses a flat linear rule list evaluated sequentially in O(N) time. Modern IPVS and eBPF use O(1) hash tables that scale to tens of thousands of services with zero overhead.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #29.");
  console.log("Skill #29 update completed successfully!");
}

run();
