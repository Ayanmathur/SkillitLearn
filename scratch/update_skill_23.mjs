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

const skillId = "c649a48b-6264-4a05-9a65-7c85fc414053";

async function run() {
  console.log("Updating Skill #23: Cloud Computing Fundamentals (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Distributed Systems, Hypervisor Virtualization and Service Models" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Cloud Storage, Database Engines and Content Delivery" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Software-Defined Networking, Global Infrastructure and Hybrid Cloud" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "NIST Cloud Characteristics, Distributed Systems and CAP Theorem",
      order_index: 1,
      content: `### Foundations of Cloud Computing and Distributed Systems

Cloud computing represents on-demand access to a shared pool of configurable computing resources (NIST Special Publication 800-145):

1. The Five Essential NIST Cloud Characteristics:
   - On-Demand Self-Service: Unilateral automated provisioning of compute, storage, and networking without human interaction.
   - Broad Network Access: Standard mechanism access over heterogeneous thin/thick client platforms.
   - Resource Pooling: Multi-tenant model dynamically assigning physical resources according to consumer demand.
   - Rapid Elasticity: Capabilities elastically provisioned and released to scale outward and inward with demand.
   - Measured Service: Resource usage metering, monitoring, and transparent billing.

2. Distributed Systems Physics and Consensus:
   - Brewer's CAP Theorem: In any distributed data store, it is mathematically impossible to simultaneously provide all three guarantees:
     - Consistency (C): Every read receives the most recent write or an error.
     - Availability (A): Every request receives a non-error response without guarantee of most recent data.
     - Partition Tolerance (P): The system continues operating despite arbitrary network drops.
   - PACELC Theorem: If there is a Partition (P), trade off Availability (A) and Consistency (C); Else (E), trade off Latency (L) and Consistency (C).
   - Consensus Algorithms: Paxos and Raft algorithms establishing quorum consensus across distributed node clusters.`
    },
    {
      track_id: track1Id,
      title: "Virtualization Mechanics: Hypervisors, Containers and MicroVMs",
      order_index: 2,
      content: `### Compute Virtualization and Isolation Architectures

Modern cloud platforms achieve high-density hardware multitenancy through virtualization technologies:

1. Hypervisor Architectures (Intel VT-x / AMD-V):
   - Type 1 (Bare-Metal Hypervisors / KVM, Xen, ESXi): Executes directly on physical server silicon, managing CPU scheduling, Extended Page Tables (EPT / SLAT), and NUMA memory nodes with sub-millisecond overhead.
   - Type 2 (Hosted Hypervisors): Runs on top of a conventional host operating system.

2. Containerization vs Virtual Machines:
   - Traditional VMs: Emulate virtual hardware and run a complete guest operating system kernel (high memory overhead and gigabyte disk footprints).
   - Linux Containers (Docker / OCI): Share the underlying host Linux kernel, achieving process isolation through:
     - Linux Namespaces: Isolates process IDs (pid), network stacks (net), mount points (mnt), and user IDs (user).
     - Control Groups (cgroups v2): Enforces strict physical resource limits on memory, CPU shares, block I/O, and network bandwidth.

3. MicroVM Sandboxing (AWS Firecracker / Google gVisor):
   - Lightweight virtual machines running on KVM, stripping legacy BIOS and PCI devices. Boots in less than 5 milliseconds with a 5 MB memory footprint, providing hypervisor-grade multi-tenant security for serverless workloads.`
    },
    {
      track_id: track1Id,
      title: "Cloud Service Models (IaaS, PaaS, SaaS, FaaS) and Shared Responsibility",
      order_index: 3,
      content: `### Cloud Service Abstractions and Shared Responsibility Models

1. The Spectrum of Cloud Service Models:
   - Infrastructure as a Service (IaaS / AWS EC2, Azure VMs, GCP Compute Engine): Provides raw virtual machines, storage, and networking. Customer manages the guest operating system, runtime, security patches, firewall configurations, and applications.
   - Platform as a Service (PaaS / AWS Elastic Beanstalk, Heroku, Google App Engine): Cloud provider manages the OS, web server, and runtime environment. Customer manages only application code and database configurations.
   - Serverless / Function as a Service (FaaS / AWS Lambda, Cloud Functions): Ephemeral event-driven execution. Customer uploads stateless function code executed on demand, billed per millisecond with zero idle cost.
   - Software as a Service (SaaS / Microsoft 365, Salesforce): Turnkey end-user software fully managed by vendor.

2. The Cloud Shared Responsibility Security Model:
   - Security OF the Cloud (Provider Responsibility): Physical data center security, hardware maintenance, hypervisor virtualization layer, and global backbone network infrastructure.
   - Security IN the Cloud (Customer Responsibility): Customer data encryption (in-transit and at-rest), Identity and Access Management (IAM) role policies, network security group firewall rules, guest OS patching (IaaS), and application source code.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Block, File and Object Storage Architectures in the Cloud",
      order_index: 1,
      content: `### Deep Architecture of Cloud Storage Paradigms

Cloud platforms provide three fundamental storage abstractions tailored to distinct I/O profiles:

1. Block Storage (AWS EBS / Azure Managed Disks / GCP Persistent Disk):
   - High-IOPS low-latency virtual hard drives attached to virtual machine instances via NVMe-over-Fabrics protocols.
   - Formatted with local file systems (ext4, XFS, NTFS).
   - Point-in-time volume snapshots created via asynchronous Copy-on-Write (CoW) delta tracking stored in durable object storage.

2. File Storage (AWS EFS, Azure Files, Google Cloud Filestore):
   - Fully managed distributed file systems implementing standard POSIX protocols (NFSv4 / SMB).
   - Supports concurrent multi-instance read/write mounting across thousands of compute nodes.

3. Object Storage (AWS S3 / Azure Blob Storage / Google Cloud Storage):
   - Flat, non-hierarchical namespace addressing immutable data blobs via unique RESTful HTTP URIs.
   - Data Durability Engineering: Provides 11 9s (99.999999999%) durability using Reed-Solomon Erasure Coding, splitting data into data and parity chunks distributed across multiple physically isolated Availability Zones.
   - Storage Lifecycle Tiers: Automated policy transitions moving data from Standard (Hot) -> Infrequent Access (Warm) -> Glacier Deep Archive (Cold, magnetic tape tier with hours retrieval time).`
    },
    {
      track_id: track2Id,
      title: "Cloud Database Paradigms: Relational, NoSQL and Globally Distributed Spanner",
      order_index: 2,
      content: `### Cloud Database Systems and Distributed Data Architecture

1. Managed Relational OLTP (Amazon RDS, Azure SQL, Google Cloud SQL):
   - ACID compliance, automated point-in-time recovery, and multi-AZ synchronous replication with automated failover.
   - Cloud-Native Distributed Storage (Amazon Aurora): Decouples compute engines from distributed log-structured storage, replicating 6 copies of data across 3 Availability Zones with quorum writes (4 of 6) and quorum reads (3 of 6).

2. NoSQL Database Engines:
   - Key-Value Stores (Amazon DynamoDB): Consistent hashing partition keys distributing data across solid-state drive clusters, delivering predictable single-digit millisecond latency at any scale.
   - Document Stores (MongoDB Atlas, Google Firestore): Flexible JSON/BSON hierarchical document structures.
   - Columnar Data Warehouses (Amazon Redshift, Google BigQuery, Snowflake): Massively Parallel Processing (MPP) columnar storage compressing petabytes of data for high-speed analytical OLAP SQL queries.

3. Globally Distributed NewSQL (Google Cloud Spanner):
   - True globally distributed ACID transactions across continents.
   - The TrueTime API: Utilizes synchronized GPS receivers and atomic clocks in global data centers, bounding clock drift uncertainty (epsilon < 7 ms) to enforce external consistency without global locks.`
    },
    {
      track_id: track2Id,
      title: "Content Delivery Networks, Edge Computing and Caching Dynamics",
      order_index: 3,
      content: `### Edge Acceleration and Content Delivery Infrastructure

1. Content Delivery Networks (AWS CloudFront, Cloudflare, Akamai):
   - Anycast DNS Routing (RFC 4786): Directs user requests to the topologically nearest Point of Presence (PoP) edge location via Border Gateway Protocol (BGP).
   - HTTP Caching Dynamics: Controlled by HTTP headers (\`Cache-Control: public, max-age=86400, stale-while-revalidate=60\`).
   - Regional Origin Shields: Intermediate caching tier reducing origin server load during traffic spikes.

2. Edge Compute Engines (Lambda@Edge, Cloudflare Workers):
   - Executes lightweight stateless JavaScript/Wasm code inside Google V8 isolates at edge PoPs, modifying HTTP headers, performing JWT authentication, and running A/B routing experiments with sub-10ms latency.

3. Transport Layer Optimization:
   - HTTP/3 over QUIC protocol utilizing UDP to eliminate TCP head-of-line blocking during packet loss on mobile networks.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Hyperscaler Global Infrastructure: Regions, AZs and Edge PoPs",
      order_index: 1,
      content: `### Topology of Global Hyperscaler Infrastructure

Leading cloud service providers (AWS, Microsoft Azure, Google Cloud Platform) deploy global physical topologies engineered for fault isolation:

1. Cloud Regions:
   - Distinct geographic locations worldwide (e.g. us-east-1 N. Virginia, eu-west-1 Ireland, ap-southeast-1 Singapore).
   - Multi-Region Deployments: Protects applications against catastrophic regional grid failures, geopolitical compliance mandates (GDPR data residency), and provides low-latency global reach.

2. Availability Zones (AZs):
   - Each Cloud Region contains a minimum of 3 discrete, physically isolated Availability Zones.
   - Fault Isolation Engineering: Each AZ resides in a separate physical building, located on separate 100-year flood plains, fed by independent utility power substations, and cooled by independent chiller plants.
   - Ultra-Low Latency Interconnects: AZs within a region are separated by meaningful physical distance (typically 10 to 60 miles), interconnected by dedicated high-bandwidth private dark fiber optic networks delivering round-trip latency strictly < 1.0 to 2.0 milliseconds.

3. Points of Presence (PoPs) and Direct Interconnects:
   - Hundreds of edge locations worldwide caching static content and providing low-latency entry points into the private hyperscaler global fiber backbone.`
    },
    {
      track_id: track3Id,
      title: "Software-Defined Networking: VPCs, Subnets, Routing and Security Groups",
      order_index: 2,
      content: `### Software-Defined Virtual Private Cloud (VPC) Architecture

Software-Defined Networking (SDN) abstracts physical network switches into virtual overlay networks using encapsulation protocols (Geneve / VXLAN):

1. VPC Topology and CIDR Addressing:
   - Classless Inter-Domain Routing (RFC 1918 Private IPv4 Blocks: e.g. \`10.0.0.0/16\` providing 65,536 private IP addresses).
   - Subnet Architecture: Subnets are tied to specific Availability Zones (e.g. \`10.0.1.0/24\` in AZ-A, \`10.0.2.0/24\` in AZ-B).

2. Public vs Private Subnets:
   - Public Subnet: Route table contains an explicit route to an Internet Gateway (IGW: \`0.0.0.0/0 -> igw-xxxx\`). Instances receive public IPv4 addresses.
   - Private Subnet: Route table routes outbound internet traffic through a Network Address Translation (NAT) Gateway in a public subnet (\`0.0.0.0/0 -> nat-xxxx\`), allowing backend databases to download security patches while blocking inbound connections from the internet.

3. Defense-in-Depth Firewall Architecture:
   - Stateful Security Groups: Virtual firewalls attached at the Elastic Network Interface (ENI) level. Evaluates individual connection state; return response traffic is automatically allowed regardless of inbound rules.
   - Stateless Network Access Control Lists (NACLs): Subnet-level boundary firewalls evaluating rules in strict numerical order; requires explicit inbound and outbound rule definitions.`
    },
    {
      track_id: track3Id,
      title: "Hybrid Cloud Interconnects, PrivateLink and Multi-Cloud Strategy",
      order_index: 3,
      content: `### Enterprise Hybrid Cloud and Private Networking

Enterprises connect on-premises data centers to cloud VPCs via private dedicated circuits:

1. Hybrid Connectivity Solutions:
   - IPsec VPN Over Internet: Encrypted tunnel running over the public internet with BGP dynamic routing (throughput typically 1.25 Gbps per tunnel).
   - Dedicated Private Interconnects (AWS Direct Connect / Azure ExpressRoute / GCP Cloud Interconnect): Dedicated 1 Gbps, 10 Gbps, or 100 Gbps physical fiber connections directly into hyperscaler colocation facilities, bypassing the public internet to provide deterministic throughput, ultra-low latency, and reduced data egress costs.

2. Private Endpoints and VPC Peering:
   - VPC Peering: Direct non-transitive network routing between two VPCs.
   - Transit Gateways: Central hub-and-spoke cloud router connecting hundreds of VPCs and on-premises VPNs.
   - PrivateLink / VPC Endpoints: Exposes managed cloud services (S3, DynamoDB) directly to private subnets via elastic network interfaces without internet gateways or NAT devices.

3. Hybrid Infrastructure Platforms (AWS Outposts, Azure Stack, Google Anthos):
   - Physical cloud-managed server racks installed in enterprise on-premises data centers, providing unified APIs and local sub-millisecond compute execution.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #23.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "According to the NIST SP 800-145 definition of cloud computing, which characteristic describes the ability of consumers to unilaterally provision compute and storage automatically without human interaction?",
      options: [
        "On-Demand Self-Service",
        "Resource Pooling",
        "Broad Network Access",
        "Measured Service"
      ],
      correct_option_index: 0,
      explanation: "On-demand self-service allows consumers to provision computing capabilities (server time, network storage) automatically as needed without human intervention.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In the Cloud Shared Responsibility Model, which layer of security is always the exclusive responsibility of the cloud service provider (such as AWS, Azure, or GCP)?",
      options: [
        "Customer application source code",
        "Guest operating system security patches on IaaS VMs",
        "Physical data center security, hardware maintenance, and hypervisor infrastructure",
        "Customer database user permissions"
      ],
      correct_option_index: 2,
      explanation: "The cloud provider is responsible for security 'OF' the cloud, encompassing physical facilities, underlying hardware, and hypervisor virtualization layers.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What cloud storage model stores immutable data blobs in a flat namespace, assigns unique RESTful HTTP URIs to each object, and achieves 11 9s of durability using erasure coding?",
      options: [
        "Block Storage (AWS EBS)",
        "Object Storage (AWS S3 / Azure Blob / GCS)",
        "Local RAM Disk",
        "Magnetic Floppy Disk"
      ],
      correct_option_index: 1,
      explanation: "Object storage (e.g. AWS S3) organizes data into flat namespaces with RESTful HTTP access, metadata tagging, and extreme durability (99.999999999%).",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In a Software-Defined Virtual Private Cloud (VPC), what virtual device allows private subnet instances to make outbound internet connections (for updates) while blocking unsolicited inbound connections from the internet?",
      options: [
        "Internet Gateway (IGW)",
        "Transit Gateway",
        "VPC Peering Connection",
        "Network Address Translation (NAT) Gateway"
      ],
      correct_option_index: 3,
      explanation: "A NAT Gateway in a public subnet translates private IP addresses for outbound traffic while preventing external internet hosts from initiating direct inbound connections.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What physical cloud infrastructure component consists of one or more discrete, physically isolated data centers with independent power, cooling, and networking within a Region, connected by low-latency fiber (< 1 ms)?",
      options: [
        "Availability Zone (AZ)",
        "Edge Point of Presence (PoP)",
        "Local Desktop Tower",
        "Colocation Server Closet"
      ],
      correct_option_index: 0,
      explanation: "An Availability Zone (AZ) consists of isolated data centers with redundant power and cooling within a Region, connected via low-latency private dark fiber networks.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "According to Eric Brewer's CAP Theorem, what fundamental trade-off must every distributed data store make in the presence of a network partition (P)?",
      options: [
        "The system must shut down completely",
        "The system can achieve 100% consistency, 100% availability, and 100% partition tolerance simultaneously",
        "The database must switch to single-server mode",
        "The system must choose between Consistency (returning errors rather than stale data) or Availability (returning accessible data that may be stale)"
      ],
      correct_option_index: 3,
      explanation: "Under network partition (P), a distributed system must mathematically choose between Consistency (CP) or Availability (AP); both cannot be guaranteed simultaneously.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In virtual firewall architectures, what is the critical behavioral difference between a Stateful Security Group and a Stateless Network Access Control List (NACL)?",
      options: [
        "NACLs only apply to Windows instances",
        "Security Groups are stateful (if an inbound connection is allowed, return outbound traffic is automatically permitted regardless of outbound rules), whereas NACLs are stateless and require explicit inbound and outbound rules",
        "Security Groups only filter IP addresses, not port numbers",
        "There is zero functional difference between the two"
      ],
      correct_option_index: 1,
      explanation: "Stateful Security Groups automatically allow return traffic for established connections. Stateless NACLs evaluate rules in both directions independently.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "How do modern MicroVM virtualization technologies (such as AWS Firecracker) achieve sub-5 millisecond boot times and minimal 5 MB memory footprints while maintaining hypervisor-grade isolation?",
      options: [
        "By utilizing Linux KVM while stripping away legacy BIOS, emulated devices, and unnecessary PCI peripherals to run minimalist virtualized kernels",
        "By disabling all security encryption",
        "By storing operating systems in browser cookies",
        "By running exclusively on mainframe computers"
      ],
      correct_option_index: 0,
      explanation: "MicroVMs leverage Linux KVM stripped of bloated legacy emulated hardware devices, booting minimal purpose-built kernels in milliseconds with tiny memory footprints.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What dedicated private networking service allows enterprise customers to establish physical 10 Gbps to 100 Gbps fiber optic connections directly between their on-premises data centers and AWS/Azure/GCP, completely bypassing the public internet?",
      options: [
        "Dial-Up Modem",
        "Standard Public IPsec VPN",
        "AWS Direct Connect / Azure ExpressRoute / GCP Cloud Interconnect",
        "Tor Onion Routing"
      ],
      correct_option_index: 2,
      explanation: "Direct Connect / ExpressRoute / Cloud Interconnect provides private dedicated physical fiber cross-connects bypassing the public internet for deterministic low latency and high bandwidth.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "How does Anycast DNS routing (RFC 4786) optimize Content Delivery Network (CDN) traffic for global end-users?",
      options: [
        "By assigning a unique home address to every computer",
        "By translating domain names into Roman numerals",
        "By forcing all global traffic through a single central server in California",
        "Multiple global edge servers advertise the exact same IP address via BGP; internet routers automatically steer user requests to the topologically nearest edge Point of Presence (PoP)"
      ],
      correct_option_index: 3,
      explanation: "Anycast announces a single shared IP address globally via BGP routing, allowing internet routing tables to automatically route clients to the geographically closest edge location.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "How does Google Cloud Spanner achieve globally distributed ACID transactions across continents without suffering long distributed locking delays or violating external consistency?",
      options: [
        "By ignoring the CAP theorem and disabling data consistency checks",
        "By utilizing the TrueTime API with synchronized GPS receivers and atomic clocks in global data centers, bounding clock skew uncertainty (epsilon < 7 ms) to generate monotonically increasing commit timestamps",
        "By running exclusively over dial-up modems",
        "By requiring manual database administrator approval for every SQL query"
      ],
      correct_option_index: 1,
      explanation: "Google Cloud Spanner uses TrueTime (GPS + atomic clocks) to bound clock skew to tight intervals (< 7 ms), enforcing linearizable distributed transactions globally.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Linux container runtime mechanics, what two underlying Linux kernel subsystems provide process isolation and physical resource limitation respectively?",
      options: [
        "FAT32 and NTFS",
        "systemd and GRUB",
        "Namespaces (isolating PID, network, mount, user spaces) and Control Groups / cgroups (enforcing CPU, memory, and I/O resource limits)",
        "HTTP and FTP"
      ],
      correct_option_index: 2,
      explanation: "Linux Namespaces provide virtual isolation boundaries for processes, network stacks, and mount points; cgroups govern hard physical resource quotas (CPU, RAM).",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In cloud-native database architecture, how does Amazon Aurora decouple compute from storage to achieve high throughput and rapid failover across multiple Availability Zones?",
      options: [
        "It writes database redo logs directly to a distributed, multi-tenant storage fleet that replicates 6 copies of data across 3 Availability Zones with 4-of-6 quorum writes, offloading crash recovery from database compute instances",
        "It stores all database tables on local USB drives",
        "It converts SQL tables into plain text email attachments",
        "It uses a single shared hard drive for all regions"
      ],
      correct_option_index: 0,
      explanation: "Aurora pushes write-ahead redo logs down to a purpose-built distributed storage service that replicates data 6 ways across 3 AZs with quorum writes, decoupling compute and storage.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "What private networking mechanism enables instances in a private subnet to access managed cloud services (such as S3 or DynamoDB) over dedicated Elastic Network Interfaces (ENIs) without using an Internet Gateway, NAT Gateway, or public IP addresses?",
      options: [
        "Tor Proxy",
        "Public DNS Forwarding",
        "SSH Tunneling",
        "AWS PrivateLink / Azure Private Link / GCP Private Service Connect (VPC Endpoints)"
      ],
      correct_option_index: 3,
      explanation: "PrivateLink / VPC Endpoints provision private ENIs inside customer subnets, routing API traffic directly to cloud services over provider internal networks without touching public IPs.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "Under the PACELC theorem, what trade-off must a distributed database system negotiate during normal, non-partitioned operational execution (Else - E)?",
      options: [
        "Trade-off between server cost and server color",
        "Trade-off between Latency (L) and Consistency (C)",
        "Trade-off between keyboard layout and monitor resolution",
        "Trade-off between power voltage and cooling fan speed"
      ],
      correct_option_index: 1,
      explanation: "In the PACELC theorem: If Partition (P) trade off Availability (A) vs Consistency (C); Else (E) trade off Latency (L) vs Consistency (C) during normal execution.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #23.");
  console.log("Skill #23 update completed successfully!");
}

run();
