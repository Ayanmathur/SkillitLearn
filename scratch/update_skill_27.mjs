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

const skillId = "d50278e8-ab98-499c-9db9-ccd25ecf5ba7";

async function run() {
  console.log("Updating Skill #27: Scalability & High Availability (9 steps across 3 tracks)...");

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

  // If more than 3 tracks, delete extra tracks
  if (tracks.length > 3) {
    const extraTrackIds = tracks.slice(3).map((t) => t.id);
    await supabase.from("steps").delete().in("track_id", extraTrackIds);
    await supabase.from("tracks").delete().in("id", extraTrackIds);
    tracks = tracks.slice(0, 3);
  }

  // Ensure exactly 3 tracks exist
  while (tracks.length < 3) {
    const { data: newTrack } = await supabase
      .from("tracks")
      .insert({
        skill_id: skillId,
        title: `Track ${tracks.length + 1}: Scalability & High Availability`,
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
  await supabase.from("tracks").update({ title: "Track 1: Scalability Foundations, Load Balancing and Auto-Scaling" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Database Scalability, Sharding and Asynchronous Decoupling" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: High Availability, Resilience Patterns and Chaos Engineering" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Scalability Physics: Amdahl's Law, Universal Scalability Law and State",
      order_index: 1,
      content: `### Theoretical Foundations of Distributed System Scalability

Scalability measures a system's ability to handle growing workloads by proportionally adding resources:

1. Horizontal vs Vertical Scaling:
   - Vertical Scaling (Scale-Up): Adding CPU/RAM to a single machine. Hard physical silicon limits, exponential hardware costs, and single-point-of-failure risks.
   - Horizontal Scaling (Scale-Out): Adding independent compute nodes in parallel. Theoretically boundless, but bounded by concurrency physics.

2. Mathematical Concurrency Limits:
   - Amdahl's Law: The maximum speedup of a parallel system is strictly bounded by the serial (non-parallelizable) portion of the code:
\`\`\`
Speedup(N) = 1 / ((1 - P) + (P / N))
\`\`\`
   - Gunther's Universal Scalability Law (USL): Expands Amdahl's law to model real-world concurrency degradation caused by Serialization (alpha) and Crosstalk / Coherency delay (beta):
\`\`\`
C(N) = N / (1 + alpha * (N - 1) + beta * N * (N - 1))
\`\`\`
     - As node count N increases, inter-node communication crosstalk causes throughput to peak and then degrade.

3. 12-Factor Stateless Architecture:
   - Compute instances must maintain zero persistent in-memory session state. User sessions and dynamic state are externalized to distributed in-memory datastores (Redis / DynamoDB), enabling instant provisioning and destruction of compute nodes without user disruption.`
    },
    {
      track_id: track1Id,
      title: "Load Balancing Architecture: Layer 4 vs Layer 7, Maglev and Envoy",
      order_index: 2,
      content: `### Deep Architecture of Cloud Load Balancing

1. OSI Layer 4 vs Layer 7 Load Balancing:
   - Layer 4 (Transport Layer / TCP/UDP): Routes packets based purely on IP addresses and port numbers without inspecting payload. Extremely high packet throughput with low CPU overhead, but cannot inspect HTTP paths or cookies.
   - Layer 7 (Application Layer / HTTP/HTTPS): Deep inspection of HTTP headers, cookies, and URI paths. Enables advanced content-based routing (e.g. \`/api/payments\` -> Payment Service; \`/api/search\` -> Search Service) and TLS termination.

2. Advanced Load Distribution Algorithms:
   - Weighted Round Robin, Least Outstanding Requests, and IP Hash.
   - Consistent Hashing with Virtual Nodes: Distributes client requests across backend nodes while ensuring that adding or removing a node re-maps only \`1/N\` fraction of keys, preventing cache thundering herds.

3. Next-Generation Load Balancer Technology:
   - Google Maglev Architecture: State-of-the-art software network load balancer using consistent hashing lookup tables to distribute millions of packets per second without maintaining connection state tables.
   - Envoy Service Proxy: Modern L7 proxy providing dynamic endpoint discovery, active outlier detection, and HTTP/2 connection pooling.`
    },
    {
      track_id: track1Id,
      title: "Autoscaling Dynamics: Target Tracking, Predictive Scaling and Cooldowns",
      order_index: 3,
      content: `### Dynamic Cloud Elasticity and Scaling Control Systems

Autoscaling dynamically matches compute capacity to fluctuating real-time traffic demand:

1. Autoscaling Control Policy Paradigms:
   - Target Tracking Scaling: Acts like a digital thermostat, dynamically increasing or decreasing cluster size to maintain a specific metric target (e.g. keeping Average CPU Utilization at 65% or ALB Request Count Per Target at 1,200).
   - Step Scaling: Applies incremental instance adjustments based on breach thresholds (e.g. if CPU > 80% add 2 instances; if CPU > 90% add 5 instances).
   - Predictive Scaling: Leverages machine learning models to analyze multi-week historical traffic patterns, proactively scaling out compute capacity 15 to 30 minutes prior to recurring daily traffic spikes.

2. Stabilization and Anti-Flapping Control:
   - Cooldown Periods: Enforces a mandatory idle stabilization window (e.g. 300 seconds) after a scaling event before evaluating additional scaling triggers, preventing destructive flapping oscillations where a cluster rapidly expands and contracts.
   - Instance Warm-Up Time: Prevents newly provisioned instances from reporting skewed high CPU metrics while warming up JVM/application caches.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Database Scalability: Read Replicas, Caching and CQRS Patterns",
      order_index: 1,
      content: `### Scaling High-Volume Data Systems

Traditional relational databases become severe bottlenecks under high concurrent read/write loads:

1. Read Scaling Strategies:
   - Asynchronous Read Replicas: Offloading read-heavy SQL SELECT queries from the primary master database to up to 15 read replicas across multiple Availability Zones.
   - Managing Replication Lag: Applications requiring read-after-write consistency must route reads to the primary master immediately after executing a write transaction.

2. Distributed In-Memory Caching Strategies:
   - Cache-Aside (Lazy Loading): Application queries Redis first; on cache miss, reads from database and populates cache with a Time-To-Live (TTL).
   - Write-Through: Application writes simultaneously to cache and database, ensuring cache is always hot and consistent.
   - Write-Behind (Write-Back): Application writes to cache immediately and confirms; cache asynchronously flushes data to the database in bulk batches.

3. Command Query Responsibility Segregation (CQRS):
   - Decoupling data modification commands (Insert/Update/Delete) from data query reads.
   - Write models write to normalized ACID relational databases; changes are published via event streams to denormalized read-optimized materialized views in Elasticsearch or MongoDB.`
    },
    {
      track_id: track2Id,
      title: "Database Partitioning, Horizontal Sharding and Consistent Hashing",
      order_index: 2,
      content: `### Horizontal Database Sharding and Partitioning Architecture

When database dataset size or write throughput exceeds the physical capacity of the largest hardware node, databases must be horizontally sharded:

1. Sharding Mechanics:
   - Dividing a single logical database into multiple independent physical database instances (Shards).
   - Choosing the Optimal Shard Key:
     - High Cardinality: Must provide millions of unique key values (e.g. \`tenant_id\` or \`user_uuid\`).
     - Uniform Distribution: Prevents 'Hotspotting' where a disproportionate volume of writes floods a single physical shard node.

2. Partitioning Strategies:
   - Range-Based Partitioning: Partitions data by value ranges (e.g. dates or alphabetic ranges); prone to write hotspots on the latest date partition.
   - Hash-Based Partitioning: Applies a cryptographic hash function (\`hash(shard_key) % num_shards\`) to distribute records uniformly across all shards.

3. Distributed Query Routers (Vitess / Citus / Mongos):
   - Middleware proxies intercepting client SQL queries, routing requests directly to the specific shard containing the data, avoiding expensive scatter-gather cross-shard joins.`
    },
    {
      track_id: track2Id,
      title: "Asynchronous Decoupling: Message Queues, Streams and Event-Driven Mesh",
      order_index: 3,
      content: `### Asynchronous Microservice Decoupling and Event Streaming

Synchronous HTTP REST calls create tight temporal coupling, where a failure or slowdown in one microservice triggers cascading thread pool exhaustion across upstream services:

1. Point-to-Point Message Queuing (Amazon SQS / RabbitMQ):
   - Competing Consumers Pattern: Multiple worker instances consume messages from a single queue in parallel.
   - Message Visibility Timeout: Hides a message from other consumers while a worker processes it.
   - Dead-Letter Queues (DLQ): Automatically isolates poison messages that fail processing after a set number of retry attempts.

2. Publish-Subscribe (Pub/Sub: Amazon SNS / Google Cloud Pub/Sub):
   - Event Fanout Pattern: A publisher emits a single event to a topic; the topic instantly broadcasts copies to multiple independent subscriber queues (e.g. Billing Service, Notification Service, Analytics Service).

3. Distributed Event Streaming (Apache Kafka / AWS Kinesis):
   - Partitioned Distributed Commit Log: Producers append immutable event streams to ordered partitions.
   - Consumer Groups: Multiple consumer instances track their own individual partition read offsets, allowing replayability and petabyte-scale stream processing.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "High Availability Metrics, Multi-AZ Architectures and Redundancy",
      order_index: 1,
      content: `### Mathematics of High Availability and Fault Isolation

High availability is the measure of a system's resilience against unplanned component disruptions:

1. The Mathematics of System Availability:
\`\`\`
Availability = MTBF / (MTBF + MTTR)
\`\`\`
   - MTBF (Mean Time Between Failures) and MTTR (Mean Time To Recovery).
   - The 'Nines' of High Availability:
     - 99.9% (Three Nines): Maximum 8.76 hours of downtime per year.
     - 99.99% (Four Nines): Maximum 52.6 minutes of downtime per year.
     - 99.999% (Five Nines): Maximum 5.26 minutes of downtime per year.

2. Multi-AZ Fault Isolation Architecture:
   - Deploying compute clusters, load balancers, and database clusters across a minimum of 3 Availability Zones.
   - Active-Active Multi-AZ: All three AZs process live production traffic concurrently. Capacity is provisioned such that if an entire AZ experiences catastrophic power failure, the remaining two AZs possess sufficient headroom to handle 100% of peak traffic without degradation.

3. Cellular Architectures:
   - Partitioning an entire multi-tenant system into independent, self-contained mini-deployments (Cells). A catastrophic bug or data corruption failure in Cell 4 is strictly contained to that cell, protecting the remaining 95% of users.`
    },
    {
      track_id: track3Id,
      title: "Distributed Resilience: Circuit Breakers, Bulkheads and Jitter",
      order_index: 2,
      content: `### Software Resilience Patterns for Distributed Systems

Resilient distributed architectures implement defense mechanisms to prevent cascading systemic failure:

1. The Circuit Breaker Pattern (Michael Nygard):
   - Closed State: Requests flow normally. If failure rates exceed a threshold (e.g. 50% errors over 10 seconds), the circuit trips to Open.
   - Open State: Requests immediately fail fast and return fallback cached responses without touching the struggling downstream service.
   - Half-Open State: After a sleep duration, a small probe percentage of requests is allowed through. If successful, the circuit resets to Closed; if failing, it returns to Open.

2. Exponential Backoff with Full Jitter:
   - When retrying failed network calls, fixed interval retries cause 'Thundering Herd' synchronized traffic spikes that overwhelm recovering servers.
   - Full Jitter Algorithm: Randomizes sleep intervals between zero and the exponential backoff ceiling (\`sleep = rand(0, min(cap, base * 2^attempt))\`), breaking up synchronization waves.

3. Bulkhead Pattern:
   - Isolates resources into discrete pools (e.g. separate thread pools or database connection pools per customer tier), ensuring high load on non-critical endpoints cannot starve mission-critical checkout workflows.`
    },
    {
      track_id: track3Id,
      title: "Chaos Engineering: Failure Injection and Game Day Experiments",
      order_index: 3,
      content: `### Proactive Verification via Chaos Engineering

Chaos Engineering is the discipline of experimenting on a system to build confidence in the system's capability to withstand turbulent conditions in production:

1. The Scientific Chaos Process:
   - Step 1: Define 'Steady State' metrics representing normal system behavior (e.g. 99.95% successful HTTP 200 responses, < 150ms 95th percentile latency).
   - Step 2: Formulate a falsifiable hypothesis (e.g. 'If Availability Zone B fails completely, automated health checks will reroute all traffic to AZ-A and AZ-C within 15 seconds with zero dropped user requests').
   - Step 3: Inject realistic turbulent failure conditions.
   - Step 4: Compare metrics against steady state; identify and fix architectural weaknesses.

2. Modern Chaos Tooling and Experiments:
   - AWS Fault Injection Simulator (FIS) / Chaos Mesh / Gremlin:
     - Simulating complete AZ network blackouts.
     - Injecting artificial 500ms latency and 20% packet loss into internal database connections.
     - Simulating CPU and memory exhaustion spikes on random compute nodes.
     - Terminating primary database instances to verify automated failover.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #27.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "What architectural principle dictates that cloud compute instances must maintain zero persistent session state in local memory, externalizing session data to Redis or DynamoDB to enable dynamic horizontal scaling?",
      options: [
        "Monolithic Coupling",
        "Single-Server Persistence",
        "12-Factor Stateless Architecture",
        "Local Disk Caching"
      ],
      correct_option_index: 2,
      explanation: "Stateless architecture externalizes all dynamic state to distributed storage, allowing compute nodes to scale up and down seamlessly without losing user sessions.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In high availability metrics, what maximum annual downtime is permitted for a system engineered to achieve 'Five Nines' (99.999%) availability?",
      options: [
        "Approximately 5.26 minutes per year",
        "Approximately 8.76 hours per year",
        "Approximately 30 days per year",
        "Zero downtime ever"
      ],
      correct_option_index: 0,
      explanation: "Five Nines (99.999%) availability permits a maximum of only 5.26 minutes of unplanned downtime across an entire calendar year.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In asynchronous message queuing systems (such as Amazon SQS), what mechanism temporarily hides a message from other worker consumers while an active worker processes it?",
      options: [
        "Message Deletion",
        "Queue Encryption",
        "FIFO Sequencing",
        "Message Visibility Timeout"
      ],
      correct_option_index: 3,
      explanation: "The visibility timeout hides a message during processing; if the worker crashes before deleting the message, it becomes visible again for another worker.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In distributed software resilience, what pattern detects downstream service failures and immediately trips to an 'Open' state to fail fast and return fallback responses without exhausting threads?",
      options: [
        "Infinite Retry Loop",
        "Circuit Breaker Pattern",
        "Single Thread Lock",
        "Memory Dump"
      ],
      correct_option_index: 1,
      explanation: "The Circuit Breaker pattern trips to an Open state during downstream failures, failing fast and preventing upstream thread pool exhaustion.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What discipline involves intentionally injecting controlled failures (such as killing database instances or simulating AZ outages) into production systems to verify resilience?",
      options: [
        "Manual Bug Hunting",
        "Static Code Analysis",
        "Chaos Engineering",
        "Unit Testing"
      ],
      correct_option_index: 2,
      explanation: "Chaos Engineering proactively injects real-world failures into distributed systems to identify weaknesses before they cause actual outages.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "According to Gunther's Universal Scalability Law (USL), why does system throughput eventually peak and degrade as the number of concurrent worker nodes (N) grows beyond a certain point?",
      options: [
        "Because hardware prices increase",
        "Due to the compounding effects of Serialization contention (alpha) and inter-node Crosstalk/Coherency delays (beta)",
        "Because internet cables melt",
        "Because operating systems cannot count past 100"
      ],
      correct_option_index: 1,
      explanation: "Gunther's USL shows that inter-node crosstalk and coherency delays grow quadratically, eventually causing throughput degradation as node count expands.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In horizontal database sharding, what critical property must be possessed by the chosen 'Shard Key' to prevent 'Hotspotting' where a single database shard is overwhelmed?",
      options: [
        "The shard key must be a boolean true/false value",
        "The shard key must be identical for all records",
        "The shard key must be written in uppercase",
        "High cardinality and uniform write distribution across all shard partitions"
      ],
      correct_option_index: 3,
      explanation: "A high-cardinality shard key with uniform distribution ensures writes are evenly scattered across all physical shards, preventing single-node bottlenecks.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In distributed retry mechanisms, why is adding 'Full Jitter' to exponential backoff algorithms essential to protect recovering backend servers?",
      options: [
        "It randomizes retry intervals across client instances, breaking up synchronized waves of retries and preventing the 'Thundering Herd' problem",
        "It increases network latency to maximum levels",
        "It converts TCP packets into UDP packets",
        "It disables retry attempts completely"
      ],
      correct_option_index: 0,
      explanation: "Jitter randomizes the sleep interval across clients, smoothing out traffic spikes that would otherwise assault recovering backend servers simultaneously.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In cloud autoscaling control systems, what is the purpose of configuring a 'Cooldown Period' after a scaling activity?",
      options: [
        "To allow server cooling fans to turn off",
        "To delete all logs from the cluster",
        "To enforce a stabilization window that prevents flapping oscillations where a cluster rapidly and repeatedly scales up and down in response to short-lived spikes",
        "To restart the load balancer"
      ],
      correct_option_index: 2,
      explanation: "Cooldown periods enforce a stabilization delay after scaling, preventing rapid oscillation and over-compensating scale actions.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In distributed architectures, what is the 'Bulkhead Pattern' derived from naval engineering?",
      options: [
        "Painting servers yellow",
        "Partitioning system resources (such as thread pools and memory allocations) into isolated pools so a failure in a non-critical feature cannot exhaust resources for core critical workflows",
        "Storing all databases on a single physical hard drive",
        "Allowing any service to consume 100% of CPU memory"
      ],
      correct_option_index: 1,
      explanation: "Bulkheads isolate critical thread pools and connection limits so failures in auxiliary components cannot starve core business operations.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "How does Google's Maglev network load balancer achieve line-rate packet distribution for millions of concurrent connections without maintaining centralized state tables?",
      options: [
        "By discarding 50% of all incoming packets",
        "By routing all traffic through a single physical computer",
        "By converting HTTP requests into email messages",
        "By utilizing consistent hashing lookup tables generated using permutation arrays, enabling any Maglev node to deterministically map packets of a flow to the exact same backend"
      ],
      correct_option_index: 3,
      explanation: "Maglev uses specialized consistent hashing lookup tables that allow stateless nodes to map packets to backends deterministically without shared connection state.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Command Query Responsibility Segregation (CQRS) architectures, how are high-volume transactional writes reconciled with fast, complex analytical query reads?",
      options: [
        "Write transactions modify a normalized relational database; changes are published asynchronously via event streams to denormalized read-optimized materialized views (e.g. Elasticsearch)",
        "Reads and writes are processed by a single SQLite file",
        "All database writes are permanently rejected",
        "Queries are executed exclusively during weekend maintenance windows"
      ],
      correct_option_index: 0,
      explanation: "CQRS decouples the write model (normalized for transactional consistency) from read models (denormalized materialized views populated via event streaming).",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In ultra-high availability enterprise platforms, what is a 'Cellular Architecture'?",
      options: [
        "Running software exclusively on mobile cellular phones",
        "A system that connects servers via Bluetooth",
        "Partitioning a global multi-tenant system into independent, self-contained mini-deployments (Cells), strictly bounding the blast radius of unexpected software failures to a tiny fraction of users",
        "A database that stores data in biology cells"
      ],
      correct_option_index: 2,
      explanation: "Cellular architecture isolates complete application stacks into independent cells, ensuring failures in one cell affect only a small subset of total users.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In caching dynamics, what occurs during a 'Thundering Herd' (Cache Stampede) event and how is it mitigated?",
      options: [
        "Cables are unplugged from the wall",
        "When a high-traffic cached key expires, thousands of concurrent requests miss the cache simultaneously and overwhelm the backend database; mitigated using mutex locks or probabilistic early expiration (XFetch)",
        "The cache server increases its storage capacity",
        "Users are disconnected from the internet"
      ],
      correct_option_index: 1,
      explanation: "Cache stampedes happen when simultaneous cache misses flood the database on key expiration; mitigated via mutex locking or probabilistic early refreshing.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In database read-replica architectures, what mechanism must be implemented by the application to guarantee 'Read-After-Write Consistency' for a user who just updated their profile?",
      options: [
        "The application must route subsequent read queries for that specific user directly to the primary master database for a brief window (e.g. 5 seconds) before falling back to read replicas",
        "The user must wait 24 hours to view their profile",
        "The application must delete the user's account",
        "All database replicas must be shut down during writes"
      ],
      correct_option_index: 0,
      explanation: "To prevent showing stale data due to replication lag, the application routes reads to the primary master for a short duration immediately following a user write.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #27.");
  console.log("Skill #27 update completed successfully!");
}

run();
