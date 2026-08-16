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

const skillId = "f130844d-940e-4dea-b234-f7afc2667176";

async function run() {
  console.log("Updating Skill #26: Cloud Certification Prep (9 steps across 3 tracks)...");

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

  // Ensure exactly 3 tracks exist
  while (tracks.length < 3) {
    const { data: newTrack } = await supabase
      .from("tracks")
      .insert({
        skill_id: skillId,
        title: `Track ${tracks.length + 1}: Cloud Certification Prep`,
        order_index: tracks.length + 1
      })
      .select()
      .single();
    tracks.push(newTrack);
  }

  tracks.sort((a, b) => a.order_index - b.order_index);

  const track1Id = tracks[0].id;
  const track2Id = tracks[1].id;
  const track3Id = tracks[2].id;

  // Update Track titles
  await supabase.from("tracks").update({ title: "Track 1: Well-Architected Framework, DR Strategies and Storage Selection" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Multi-Account Landing Zones, Transit Networking and Federation" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: CKA Kubernetes Architecture and Scenario Decomposition Strategy" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Well-Architected Framework: Six Core Architectural Pillars",
      order_index: 1,
      content: `### Architecture Evaluation via the Six Well-Architected Pillars

Professional cloud certifications (AWS SAP-C02, Azure AZ-305, GCP PCA) evaluate solutions against the Well-Architected Framework:

1. The Six Core Architectural Pillars:
   - Operational Excellence: Delivering business value through Infrastructure as Code (IaC), small reversible changes, automated CI/CD pipelines, and structured Game Day simulations.
   - Security: Implementing defense-in-depth, Zero Trust identity verification, least-privilege IAM policies, automated threat detection, and comprehensive data encryption at rest and in transit.
   - Reliability: Engineering fault-tolerant distributed systems that recover automatically from underlying hardware disruptions, testing recovery procedures via Chaos Engineering, and scaling horizontally across Availability Zones.
   - Performance Efficiency: Selecting optimal instance types and storage engines, leveraging serverless architectures, and exploiting caching layers (CDNs, in-memory caches).
   - Cost Optimization: Measuring return on investment, adopting consumption-based pricing, utilizing Spot instances for fault-tolerant batch workloads, and continuously right-sizing compute resources.
   - Sustainability: Minimizing environmental footprint by maximizing hardware utilization and optimizing data retention lifecycles.`
    },
    {
      track_id: track1Id,
      title: "Resilient Disaster Recovery: RPO, RTO and Four Architectural Tiers",
      order_index: 2,
      content: `### Disaster Recovery (DR) Engineering and Multi-Region Architectures

1. Fundamental DR Metrics:
   - Recovery Point Objective (RPO): The maximum acceptable duration of data loss measured in time backward from the disaster event.
   - Recovery Time Objective (RTO): The maximum acceptable downtime duration required to restore operational capability.

2. The Four Standard Cloud Disaster Recovery Strategies:
   - Backup and Restore: High RPO (hours), High RTO (hours/days), lowest cost. Regular snapshots copied across regions; compute provisioned from scratch via IaC after a disaster.
   - Pilot Light: Low RPO (minutes), Moderate RTO (tens of minutes). Core database state is continuously replicated live to the secondary region; minimal compute (e.g. database read replica) runs continuously. During a disaster, autoscaling groups spin up full application compute clusters.
   - Warm Standby: Low RPO (seconds), Low RTO (minutes). A scaled-down but fully operational duplicate environment runs 24/7 in the secondary region. DNS failover routes live traffic while autoscaling expands capacity.
   - Multi-Region Active-Active: Near-zero RPO, Near-zero RTO, highest cost. Full production clusters in two or more regions actively serve production traffic simultaneously with multi-region distributed databases (e.g. DynamoDB Global Tables, Aurora Global Database).`
    },
    {
      track_id: track1Id,
      title: "High-Throughput Storage & Database Engine Selection Matrices",
      order_index: 3,
      content: `### Architectural Decision Matrices for Storage and Databases

Certification exam scenarios test precise trade-offs between throughput, latency, and operational overhead:

1. Cloud Storage Engine Selection:
   - Block Storage (EBS io2 Block Express): Sub-millisecond latency, up to 256,000 IOPS and 4,000 MB/s throughput; required for raw high-performance database volumes.
   - Distributed File Storage (EFS / FSx for Lustre): POSIX-compliant multi-instance shared file systems; FSx for Lustre delivers hundreds of GB/s throughput for High-Performance Computing (HPC) and machine learning training.
   - Object Storage (S3): Petabyte scale with 11 9s durability, lifecycle policies, and S3 Select / Glacier Deep Archive for long-term cold compliance.

2. Database Paradigm Selection:
   - Relational OLTP (Aurora): ACID compliance, PostgreSQL/MySQL compatibility, 15 read replicas with automated failover.
   - NoSQL Key-Value (DynamoDB): Single-digit millisecond latency at any scale; coupled with DynamoDB Accelerator (DAX) for microsecond in-memory read caching.
   - Analytical OLAP (Redshift / BigQuery): Columnar storage and Massively Parallel Processing (MPP) for complex SQL aggregations across petabytes of structured data.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Enterprise Multi-Account Architecture and AWS Organizations",
      order_index: 1,
      content: `### Enterprise Multi-Account Landing Zones and Governance

1. Multi-Account Landing Zone Architecture:
   - AWS Organizations / Azure Management Groups: Centralized management and consolidated billing across hundreds of discrete member accounts.
   - Organizational Units (OUs):
     - Core / Security OU: Dedicated Log Archive account (immutable S3 buckets with Object Lock and cross-account KMS key access) and Security Tooling account (centralized GuardDuty, Security Hub).
     - Workload OUs: Separate Development, Staging, and Production accounts isolating blast radiuses.

2. Service Control Policies (SCPs) and Permission Guardrails:
   - Coarse-grained governance boundaries setting the maximum allowable permissions across member accounts.
   - Must-Know Exam SCP Patterns:
     - Denying all actions outside approved geographic regions (e.g. restricting deployments to us-east-1 and eu-west-1).
     - Denying the ability to delete or modify CloudTrail logs or AWS Config rules.
     - Blocking member accounts from creating unencrypted EBS volumes or leaving S3 buckets public.`
    },
    {
      track_id: track2Id,
      title: "Advanced Hybrid and Multi-Region Cloud Transit Networking",
      order_index: 2,
      content: `### Cloud Transit Routing and Hybrid Interconnectivity

1. Hub-and-Spoke Transit Architectures:
   - AWS Transit Gateway / Azure Virtual WAN: Centralized cloud router interconnecting thousands of VPCs, AWS Direct Connect Gateways, and on-premises IPsec VPN connections.
   - Eliminates complex full-mesh VPC peering meshes (\`N*(N-1)/2\` connections).

2. Dynamic Routing and Resilient High Availability:
   - Border Gateway Protocol (BGP): Dynamic route exchange between customer gateways and cloud routers over Autonomous System Numbers (ASNs).
   - Equal-Cost Multi-Path (ECMP) Routing: Aggregates multiple VPN tunnels to scale bandwidth beyond the standard 1.25 Gbps per tunnel limit.
   - BGP AS Path Prepending: Deterministic primary and backup path steering for hybrid connectivity.

3. Hybrid Private DNS Resolution:
   - Route 53 Resolver Endpoints:
     - Inbound Resolver: Allows on-premises DNS servers to resolve private hosted zones in AWS VPCs.
     - Outbound Resolver: Forwards cloud VPC DNS queries to on-premises Active Directory DNS servers.`
    },
    {
      track_id: track2Id,
      title: "Directory Federation, IAM Identity Center and Cross-Account Roles",
      order_index: 3,
      content: `### Enterprise Identity Federation and Cross-Account Access

1. Centralized Identity Federation (AWS IAM Identity Center / Azure AD):
   - Integrates enterprise identity providers (Okta, Entra ID) using SAML 2.0 and automated SCIM user provisioning.
   - Permission Sets: Fine-grained IAM policies mapped to enterprise directory groups, granting short-lived federated access across multi-account organizations.

2. Cross-Account Role Delegation:
   - External Account Trust Policies (\`sts:AssumeRole\`):
     - Granting access across independent AWS accounts without creating duplicate IAM users.
   - Preventing the 'Confused Deputy' Security Vulnerability:
     - When a third-party SaaS vendor performs actions on behalf of multiple AWS customers, the trust policy MUST require an \`sts:ExternalId\` condition matching a unique shared secret per customer to prevent unauthorized cross-tenant privilege escalation.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Certified Kubernetes Administrator (CKA) Core Architecture",
      order_index: 1,
      content: `### Deep Architecture for the CKA Certification

The Certified Kubernetes Administrator (CKA) exam requires hands-on mastery of Kubernetes internals:

1. Control Plane Component Architecture:
   - \`kube-apiserver\`: The stateless REST API front-end validating and configuring data for pods, services, and replication controllers.
   - \`etcd\`: Consistent and highly available key-value store implementing Raft consensus. Exam Essential: Backing up etcd snapshots (\`etcdctl snapshot save\`) and restoring from backups.
   - \`kube-scheduler\`: Assigns pods to nodes based on resource filtering (predicates) and scoring (priorities).
   - \`kube-controller-manager\`: Runs core control loops (Node Lifecycle Controller, ReplicaSet Controller, EndpointSlice Controller).

2. Worker Node Components:
   - \`kubelet\`: Node agent ensuring containers described in PodSpecs are running and healthy via Container Runtime Interface (CRI / containerd).
   - \`kube-proxy\`: Manages network rules (iptables / IPVS) on nodes, enabling Kubernetes Service cluster IP abstraction.

3. Core Troubleshooting Scenarios:
   - Diagnosing failed nodes using \`journalctl -u kubelet\` and checking certificate expiration dates in \`/etc/kubernetes/pki\`.`
    },
    {
      track_id: track3Id,
      title: "Exam Scenario Decomposition and Question Anatomy",
      order_index: 2,
      content: `### Deconstructing Scenario-Based Certification Questions

Professional certification exams (AWS SAP-C02, GCP PCA) utilize long, complex scenario questions with multiple plausible answers:

1. Keyword Decoding Matrix:
   - 'Most Cost-Effective Solution': Look for Serverless (Lambda, Fargate), Spot Instances (for stateless fault-tolerant workloads), S3 Intelligent-Tiering / Glacier, and managed auto-scaling over provisioned EC2 fleets.
   - 'Lowest Operational Overhead': Choose managed cloud native services (Amazon RDS over self-managed MySQL on EC2, AWS Secrets Manager over custom Vault clusters, CloudFront over custom Nginx reverse proxies).
   - 'High Availability with Zero RPO': Choose Multi-Region Active-Active with synchronous database replication (Aurora Global Database / DynamoDB Global Tables).

2. Eliminating Distractor Options:
   - Rule out options that introduce valid technologies but violate the specific scenario requirement (e.g. an architecturally sound solution that costs 10x more when the prompt asked for the most cost-effective option).
   - Identify fabricated non-existent feature names or impossible cross-service configurations.`
    },
    {
      track_id: track3Id,
      title: "Time Management, Practical Lab Strategies and CLI Mastery",
      order_index: 3,
      content: `### Execution Tactics for Performance-Based and Multiple-Choice Exams

1. Multiple-Choice Time Pacing (65-75 questions in 180 minutes):
   - Target pace: 2.0 to 2.4 minutes per question.
   - Systematic Two-Pass Strategy:
     - Pass 1: Read the final sentence (the actual question) FIRST, scan keywords, eliminate two obvious distractors, choose the best remaining option, and flag uncertain questions.
     - Pass 2: Re-evaluate only flagged questions with remaining time.

2. Performance-Based Practical Exams (CKA / CKAD / Red Hat):
   - Command-Line Speed Tactics:
     - Set imperative shell aliases immediately (\`alias k=kubectl\`, \`export do='--dry-run=client -o yaml'\`).
     - Never write YAML from scratch: generate boilerplate templates using \`k run nginx --image=nginx $do > pod.yaml\` and modify.
     - Master JSONPath queries and JMESPath CLI filtering (\`--query\` parameter in AWS CLI) to extract resource IDs rapidly.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #26.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In the AWS and Azure Well-Architected Frameworks, which architectural pillar focuses on running and monitoring systems to deliver business value and continuously improving processes via automation and Game Days?",
      options: [
        "Operational Excellence",
        "Cost Optimization",
        "Performance Efficiency",
        "Sustainability"
      ],
      correct_option_index: 0,
      explanation: "The Operational Excellence pillar focuses on executing operations as code, making frequent small reversible changes, and refining procedures via game days.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In disaster recovery metrics, what does Recovery Point Objective (RPO) measure?",
      options: [
        "The time it takes to reboot a server",
        "The salary of the disaster recovery engineer",
        "The maximum acceptable duration of data loss measured in time backward from the disaster event",
        "The cost of cloud storage"
      ],
      correct_option_index: 2,
      explanation: "RPO defines the maximum allowable data loss timeframe (e.g. RPO of 15 minutes means no more than 15 minutes of transactional data may be lost).",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In AWS Organizations, what governance mechanism allows administrators to enforce coarse-grained permission boundaries across member accounts (e.g. denying actions outside specific regions)?",
      options: [
        "Amazon Route 53",
        "Service Control Policies (SCPs)",
        "Amazon DynamoDB Accelerator",
        "AWS Elastic Beanstalk"
      ],
      correct_option_index: 1,
      explanation: "Service Control Policies (SCPs) define the maximum available permissions across an AWS Organization or Organizational Unit (OU).",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In the Kubernetes control plane architecture (evaluated in the CKA exam), what component is the consistent, highly available distributed key-value store implementing Raft consensus?",
      options: [
        "kube-scheduler",
        "kubelet",
        "kube-proxy",
        "etcd"
      ],
      correct_option_index: 3,
      explanation: "etcd is the primary distributed key-value backing store for all Kubernetes cluster state, configuration, and secrets.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "Which disaster recovery tier provides near-zero RPO and near-zero RTO by running fully scaled production clusters in two or more cloud regions actively serving live traffic simultaneously?",
      options: [
        "Multi-Region Active-Active",
        "Backup and Restore",
        "Pilot Light",
        "Warm Standby"
      ],
      correct_option_index: 0,
      explanation: "Multi-Region Active-Active achieves near-zero RTO and RPO by operating live, load-balanced clusters across multiple geographic regions with distributed databases.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In cross-account IAM role assumption involving third-party SaaS vendors, what condition must be enforced in the trust policy to prevent the 'Confused Deputy' vulnerability?",
      options: [
        "Disabling all MFA requirements",
        "Allowing public access to the role",
        "Using HTTP instead of HTTPS",
        "Requiring an 'sts:ExternalId' condition matching a unique shared secret per customer"
      ],
      correct_option_index: 3,
      explanation: "The sts:ExternalId condition ensures that a third-party vendor cannot be tricked by another malicious customer into accessing your account resources.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "What centralized cloud networking service eliminates complex full-mesh VPC peering by acting as a hub-and-spoke router interconnecting thousands of VPCs and on-premises Direct Connect connections?",
      options: [
        "Standard Internet Gateway",
        "AWS Transit Gateway / Azure Virtual WAN",
        "NAT Gateway",
        "VPC Endpoint"
      ],
      correct_option_index: 1,
      explanation: "Transit Gateway acts as a central cloud router interconnecting VPCs and hybrid VPN/Direct Connect circuits in a scalable hub-and-spoke topology.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In hybrid cloud DNS architecture, what Route 53 Resolver endpoint allows cloud VPCs to forward internal domain queries to on-premises Active Directory DNS servers?",
      options: [
        "Route 53 Outbound Resolver Endpoint",
        "Route 53 Inbound Resolver Endpoint",
        "Public DNS Root Server",
        "VPC Peering Connection"
      ],
      correct_option_index: 0,
      explanation: "Outbound Resolver Endpoints forward DNS queries originating in AWS VPCs to on-premises DNS servers via VPN or Direct Connect.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In CKA exam troubleshooting, what command is used to capture a complete point-in-time backup snapshot of the etcd database cluster?",
      options: [
        "docker commit etcd",
        "kubectl delete etcd",
        "etcdctl snapshot save <snapshot-file-path> --endpoints=... --cacert=... --cert=... --key=...",
        "tar -czvf /etc/etcd.tar.gz"
      ],
      correct_option_index: 2,
      explanation: "The official method to back up etcd is using 'etcdctl snapshot save' with the appropriate TLS client certificates and endpoint parameters.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In professional certification scenario decomposition, when a question explicitly demands the 'Lowest Operational Overhead', which solution architecture is almost always preferred?",
      options: [
        "Deploying and managing custom software clusters manually on raw EC2 instances",
        "Writing custom assembly code on bare metal servers",
        "Building a custom operating system kernel",
        "Leveraging fully managed serverless or PaaS/SaaS services (e.g. Amazon RDS, S3, Secrets Manager, CloudFront)"
      ],
      correct_option_index: 3,
      explanation: "Fully managed cloud-native services minimize operational overhead by offloading patching, scaling, high availability, and backups to the cloud provider.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In the 'Pilot Light' disaster recovery strategy, what components are maintained continuously running in the secondary recovery region prior to a disaster declaration?",
      options: [
        "Zero resources (everything is turned off)",
        "The database read replica / live data synchronization only, while compute fleets remain unprovisioned until disaster recovery is triggered via autoscaling",
        "Full 100% capacity compute clusters actively handling production traffic",
        "Only a static HTML error page"
      ],
      correct_option_index: 1,
      explanation: "Pilot Light keeps only the core data tier continuously replicated in the secondary region; compute infrastructure is scaled up rapidly via IaC/ASGs during a disaster.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In high-throughput cloud networking, how does Equal-Cost Multi-Path (ECMP) routing scale bandwidth across multiple IPsec VPN connections attached to an AWS Transit Gateway?",
      options: [
        "By converting VPN tunnels into copper telephone wires",
        "By disabling data encryption",
        "By dynamically load-balancing traffic across multiple active BGP VPN tunnels simultaneously, scaling aggregate bandwidth beyond the single-tunnel 1.25 Gbps limit",
        "By compressing all packets into zip archives"
      ],
      correct_option_index: 2,
      explanation: "ECMP allows Transit Gateway to distribute network flows across multiple active VPN tunnels simultaneously, linearly scaling aggregate hybrid throughput.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Kubernetes performance exams (CKA/CKAD), what imperative CLI command creates a deployment YAML manifest template without actually creating resources on the cluster?",
      options: [
        "kubectl create deployment web --image=nginx --dry-run=client -o yaml > deploy.yaml",
        "kubectl delete all --all",
        "docker run -d nginx",
        "git clone https://kubernetes.io"
      ],
      correct_option_index: 0,
      explanation: "Using '--dry-run=client -o yaml' generates the exact declarative YAML specification locally without sending an execution request to the cluster apiserver.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In high-performance database caching architectures, what is the key difference between DynamoDB Accelerator (DAX) and standard Amazon ElastiCache Redis?",
      options: [
        "DAX only works with SQL Server",
        "Redis is slower than a floppy disk",
        "DAX requires modifying application source code to route all queries",
        "DAX is an in-line write-through cache purpose-built for DynamoDB that requires zero application logic changes, providing microsecond read latencies seamlessly"
      ],
      correct_option_index: 3,
      explanation: "DAX is an in-line cache designed specifically for DynamoDB, intercepting read/write SDK calls directly without requiring custom cache invalidation code.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In multi-account enterprise security architectures, why must the centralized S3 Log Archive bucket have S3 Object Lock and a dedicated cross-account KMS key configured?",
      options: [
        "To make logs publicly readable on Google",
        "To enforce Write-Once-Read-Many (WORM) compliance and prevent compromised administrator credentials in member accounts from deleting or tampering with security audit trails",
        "To compress logs into MP3 audio files",
        "To reduce cloud storage costs to zero"
      ],
      correct_option_index: 1,
      explanation: "S3 Object Lock enforces WORM immutability, ensuring that attackers who compromise member accounts cannot delete or alter centralized CloudTrail audit records.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #26.");
  console.log("Skill #26 update completed successfully!");
}

run();
