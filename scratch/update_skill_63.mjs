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

const skillId = "4d589064-bd10-4b7f-90e5-a09bca52c463";

async function run() {
  console.log("Updating Skill #63: Big Data Tools (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Distributed Batch Processing with Apache Spark Core and SQL" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Distributed Streaming with Apache Kafka and KRaft Quorum" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Real-Time Stream Engines (Flink) and Distributed NoSQL Systems" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Staff Big Data Architect level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Spark Core Internals: RDDs, Lineage and Directed Acyclic Graphs",
      order_index: 1,
      content: `### Distributed In-Memory Processing and Fault Tolerance

1. Resilient Distributed Datasets (RDDs):
   - Fundamental abstraction in Apache Spark: Immutable, lazily-evaluated distributed collections partitioned across cluster worker nodes.

2. Lineage Graphs and Fault Tolerance:
   - Spark maintains a Directed Acyclic Graph (DAG) recording every transformation applied to base data.
   - If a worker node crashes during computation, Spark reconstructs only the lost partitions by replaying the lineage graph rather than replicating raw data across memory.

3. Narrow vs Wide Dependencies:
   - Narrow Transformations (\`map\`, \`filter\`, \`mapPartitions\`): Each parent partition is consumed by at most one child partition; executed in parallel in-memory within local pipeline stages without network data transfer.
   - Wide Transformations (\`groupByKey\`, \`reduceByKey\`, \`join\`, \`distinct\`): Require data from multiple parent partitions, necessitating expensive cluster-wide Shuffle stages with disk I/O and network transfers.`
    },
    {
      track_id: track1Id,
      title: "Spark SQL Optimization: Catalyst Optimizer, Tungsten and AQE",
      order_index: 2,
      content: `### Query Optimization Engines and Off-Heap Binary Execution

1. Catalyst Query Optimizer:
   - Compilation Pipeline: Parsing SQL/DataFrame AST -> Logical Optimization (rule-based constant folding, predicate pushdown) -> Cost-Based Physical Optimization (join selection) -> Code Generation (\`WholeStageCodeGen\` compiling entire subgraphs into optimized Java bytecode).

2. Project Tungsten Engine:
   - Bypasses JVM garbage collection and object overhead by managing raw off-heap binary memory layouts directly, utilizing CPU cache-aware algorithms and compact binary encoders.

3. Adaptive Query Execution (AQE):
   - Dynamically re-optimizes execution plans during runtime based on actual stage runtime statistics:
     - Coalescing Shuffle Partitions: Automatically combines small post-shuffle partitions to prevent thousands of tiny task overheads.
     - Dynamic Join Switching: Automatically converts Sort-Merge Joins to Broadcast Hash Joins at runtime if intermediate tables shrink below broadcast thresholds.
     - Dynamic Skew Join Handling: Splits oversized skewed partitions into multiple sub-partitions to eliminate straggler tasks.`
    },
    {
      track_id: track1Id,
      title: "Spark Cluster Memory Management and Partition Tuning",
      order_index: 3,
      content: `### JVM Memory Sizing and Executor Performance Engineering

1. Unified Memory Management Architecture:
   - JVM Executor Memory is divided dynamically:
     - Reserved Memory (300MB): Hardcoded system overhead.
     - User Memory (40% of remaining): User data structures and custom UDFs.
     - Spark Memory (60% of remaining): Dynamically shared between Execution Memory (shuffles, joins, aggregations) and Storage Memory (cached DataFrames). When execution memory needs space, it evicts cached storage blocks to disk.

2. Partition Sizing Best Practices:
   - Target partition size: 100MB to 200MB of uncompressed data per partition.
   - Tuning \`spark.sql.shuffle.partitions\` (default 200) to match cluster core count and data scale.
   - Broadcast Threshold: \`spark.sql.autoBroadcastJoinThreshold\` (default 10MB) avoiding shuffles on dimension lookups.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Kafka Architecture: Topics, Partitions, Segments and KRaft",
      order_index: 1,
      content: `### Distributed Append-Only Commit Logs and Modern Metadata Quorums

1. Topic and Partition Topology:
   - Topics are split into independent, ordered, immutable commit logs (Partitions).
   - Ordering Guarantee: Strict total ordering is preserved strictly within a single partition, not globally across the topic.
   - Physical Storage: Partitions reside on disk as sequential 1GB segment files (\`.log\`) indexed by memory-mapped offset index files (\`.index\`), enabling high sequential disk I/O throughput.

2. Partitioning Keys:
   - Messages with identical keys are routed to the same partition using default Murmur2 hashing.

3. Kafka Raft (KRaft Quorum - KIP-500):
   - Replaces external Apache ZooKeeper clusters with a built-in event-driven Raft consensus quorum running inside Kafka controller brokers, improving metadata scalability to millions of partitions and enabling instantaneous leader failover.`
    },
    {
      track_id: track2Id,
      title: "Producer Durability, Idempotence and In-Sync Replicas",
      order_index: 2,
      content: `### High-Durability Producer Guarantees and Zero Data Loss

1. Producer Acknowledgement Modes (\`acks\`):
   - \`acks=0\`: Fire-and-forget; zero latency, highest risk of data loss.
   - \`acks=1\`: Leader broker writes to local log before acknowledging.
   - \`acks=all\` (\`acks=-1\`): Leader and all in-sync replicas must commit the message before returning success.

2. In-Sync Replicas (ISR) and \`min.insync.replicas\`:
   - High-Durability Pattern: Setting \`acks=all\` combined with \`min.insync.replicas=2\` guarantees zero data loss even during hardware node failures.

3. Idempotent Producer (\`enable.idempotence=true\`):
   - Assigns a unique Producer ID (PID) and monotonically increasing sequence number to every message batch.
   - The broker verifies sequence numbers, automatically deduplicating retried messages caused by transient network timeouts.`
    },
    {
      track_id: track2Id,
      title: "Consumer Group Scaling, Offset Management and Rebalances",
      order_index: 3,
      content: `### Horizontal Consumer Scaling and Rebalance Protocols

1. Consumer Group Mechanics:
   - Multiple consumers sharing a common \`group.id\` collaboratively divide topic partitions among themselves.
   - Max Parallelism: The number of active consumers in a group cannot exceed the number of partitions in the subscribed topic.

2. Offset Commit Semantics:
   - Consumers periodically commit processed offsets to the internal compact \`__consumer_offsets\` topic (At-Least-Once vs At-Most-Once delivery).

3. Cooperative Sticky Rebalance Protocol:
   - Legacy Eager Rebalance: Required all consumers to revoke all partitions simultaneously ('stop-the-world' pause).
   - Cooperative Sticky Protocol: Gradually revokes and reassigns only the specific partitions requiring migration, allowing uninterrupted processing on unaffected partitions.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Real-Time Processing: Apache Flink and Structured Streaming",
      order_index: 1,
      content: `### True Event-Driven Streaming and Windowing Topologies

1. Stream Engine Paradigms:
   - Apache Flink: True pipelined streaming engine executing transformations record-by-record with sub-millisecond latency.
   - Spark Structured Streaming: Micro-batching stream abstraction (or continuous processing mode) backed by Catalyst query engine.

2. Time Semantics and Watermarking:
   - Event Time: The exact timestamp when an event occurred on the client device.
   - Watermarks: Pipelined temporal markers ($t - \Delta$) signaling to window operators that no further records with timestamps $< t$ are expected, triggering window evaluation while handling bounded out-of-order latency.

3. Window Typologies:
   - Tumbling Windows: Fixed-duration, non-overlapping windows (e.g. 5-minute sales aggregations).
   - Sliding Windows: Fixed-duration overlapping windows (e.g. 10-minute moving average evaluated every 1 minute).
   - Session Windows: Dynamic windows bounded by periods of user inactivity gap.`
    },
    {
      track_id: track3Id,
      title: "Stateful Streaming, Checkpointing and Exactly-Once Semantics",
      order_index: 2,
      content: `### Distributed State Storage and Two-Phase Commit Sinks

1. Flink State Management:
   - Keyed State: Retains intermediate aggregation values for each stream key.
   - State Backends: \`HashMapStateBackend\` (in-memory JVM heap for microsecond access) vs \`EmbeddedRocksDBStateBackend\` (out-of-core embedded disk database for terabyte-scale stateful streams).

2. Distributed Snapshotting (Chandy-Lamport Algorithm):
   - Injects asynchronous Checkpoint Barrier tokens into input streams.
   - Operators snapshot local state when barriers arrive without pausing ongoing stream execution, writing consistent state snapshots to durable cloud storage.

3. End-to-End Exactly-Once Processing:
   - Requires three components: Replayable Source (Kafka offsets) + Deterministic Stateful Stream Processing + Transactional Two-Phase Commit (2PC) Sink Coordinator.`
    },
    {
      track_id: track3Id,
      title: "Distributed NoSQL Storage: Cassandra Rings and HBase LSM",
      order_index: 3,
      content: `### High-Throughput Distributed NoSQL Architecture and Storage Engines

1. Apache Cassandra (Dynamo Paper Masterless Architecture):
   - Decentralized Peer-to-Peer Ring: Uses Consistent Hashing (Murmur3Partitioner) over Partition Keys to distribute data across token ranges.
   - Tunable Consistency: Read Consistency (R) and Write Consistency (W) configured per query (e.g. \`QUORUM\` ensures strong consistency when $R + W > N$).
   - Masterless Design: Every node can serve reads/writes with zero single points of failure.

2. Log-Structured Merge-Tree (LSM-Tree) Storage (Cassandra / HBase):
   - Write Path: Writes appended sequentially to CommitLog on disk and in-memory Memtable (instant $O(1)$ write throughput).
   - Read Path: Memtable flushed to immutable SSTables/HFiles on disk; reads consult Bloom Filters, Key Indexes, and SSTable merged scans with background Compaction.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #63.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In Apache Spark architecture, what makes Resilient Distributed Datasets (RDDs) fault-tolerant without replicating data across worker nodes?",
      options: [
        "Spark saves all data on USB drives",
        "Spark only runs on error-free hardware",
        "Spark maintains a Lineage Graph (DAG) of transformations; if a node crashes, Spark recomputes only the lost partitions from parent RDDs",
        "Spark deletes failed jobs automatically"
      ],
      correct_option_index: 2,
      explanation: "Spark uses RDD lineage graphs to reconstruct lost partition data on-demand without needing expensive full memory replication.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What metadata consensus mechanism built directly into Apache Kafka (KIP-500) replaces external Apache ZooKeeper clusters?",
      options: [
        "KRaft (Kafka Raft Metadata Quorum)",
        "MySQL database",
        "Redis cluster",
        "DNS servers"
      ],
      correct_option_index: 0,
      explanation: "KRaft implements event-driven Raft consensus inside Kafka controller brokers, eliminating ZooKeeper dependencies.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In Kafka streaming, what is the maximum number of active consumers that can concurrently read data in a single Consumer Group?",
      options: [
        "Exactly 1 consumer",
        "Unlimited consumers",
        "100 consumers",
        "The number of active consumers cannot exceed the total number of partitions in the subscribed topic"
      ],
      correct_option_index: 3,
      explanation: "Each partition in a topic can be consumed by at most one consumer instance within a consumer group at any given time.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In Apache Spark, what is the difference between a 'Narrow' transformation and a 'Wide' transformation?",
      options: [
        "Narrow transformations only work on numbers",
        "Narrow transformations (e.g. map, filter) process partitions locally without network movement; Wide transformations (e.g. groupByKey, join) require cluster-wide data shuffles",
        "Wide transformations run in Microsoft Excel",
        "Narrow transformations delete data"
      ],
      correct_option_index: 1,
      explanation: "Narrow dependencies evaluate within local memory partitions; wide dependencies require all-to-all network shuffles across nodes.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What storage engine architecture used by Apache Cassandra and HBase provides extremely high write throughput by appending writes sequentially to memory Memtables and disk CommitLogs before flushing immutable SSTables?",
      options: [
        "B+ Tree Index",
        "Relational Foreign Key table",
        "Log-Structured Merge-Tree (LSM-Tree)",
        "CSV spreadsheet"
      ],
      correct_option_index: 2,
      explanation: "LSM-Trees append writes sequentially in memory (Memtable) and WAL commit logs, avoiding random disk I/O to deliver high write throughput.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In Apache Spark Adaptive Query Execution (AQE), what optimization is dynamically performed at runtime when two large tables are being joined?",
      options: [
        "AQE shuts down the Spark cluster",
        "If intermediate stage statistics reveal one side of the join has shrunk below the broadcast threshold, AQE dynamically converts a Sort-Merge Join to a Broadcast Hash Join",
        "AQE converts SQL into Python code",
        "AQE deletes duplicate partitions"
      ],
      correct_option_index: 1,
      explanation: "AQE adapts query plans during runtime, dynamically switching costly sort-merge joins to broadcast hash joins when table sizes drop.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Kafka producer configuration, what configuration combination guarantees absolute zero data loss even during broker failure?",
      options: [
        "acks=0 and retries=0",
        "compression.type=gzip only",
        "buffer.memory=100MB",
        "acks=all (or acks=-1) combined with min.insync.replicas=2 on the topic brokers"
      ],
      correct_option_index: 3,
      explanation: "Setting acks=all with min.insync.replicas=2 ensures that at least two in-sync brokers have committed the record before success is returned.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In real-time stream processing with Apache Flink, what is a 'Watermark' and what stream anomaly does it handle?",
      options: [
        "A temporal metric injected into data streams signaling that no further events with timestamps older than t are expected, allowing window calculations to finalize despite out-of-order latency",
        "A digital logo on video streams",
        "A tool for deleting duplicate messages",
        "A network speed test"
      ],
      correct_option_index: 0,
      explanation: "Watermarks track progress in event time, providing a heuristic boundary to evaluate windows and process out-of-order data.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In distributed NoSQL architecture, how does Apache Cassandra achieve 'Strong Consistency' across a cluster with replication factor N = 3?",
      options: [
        "By electing a single master server",
        "By turning off all read queries",
        "By configuring query read consistency (R) and write consistency (W) such that R + W > N (e.g. Write QUORUM (2) and Read QUORUM (2) = 4 > 3)",
        "By storing all data in a single file"
      ],
      correct_option_index: 2,
      explanation: "Configuring R + W > N guarantees that the read set and write set overlap on at least one replica node holding the most recent timestamp.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "How does the 'Cooperative Sticky' consumer rebalance protocol in Kafka improve on the legacy 'Eager Rebalance' protocol?",
      options: [
        "It increases network latency by 10x",
        "It incrementally migrates only the specific partitions requiring reallocation, avoiding global 'stop-the-world' pauses and allowing unaffected consumers to continue reading streams",
        "It deletes inactive consumer groups",
        "It forces all consumers to share a single CPU"
      ],
      correct_option_index: 1,
      explanation: "Cooperative sticky rebalancing avoids stop-the-world pauses by reallocating only migrating partitions while others continue processing.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "In Apache Flink stateful streaming, how does the Chandy-Lamport algorithm implement asynchronous distributed checkpointing without stopping stream processing?",
      options: [
        "By deleting all intermediate state every 10 seconds",
        "By pausing all network incoming sockets for 1 minute",
        "By writing all streaming data to a single relational database",
        "It injects Checkpoint Barrier tokens into input streams; when operators receive barriers, they snapshot their local state asynchronously to durable storage while continuously processing data"
      ],
      correct_option_index: 3,
      explanation: "Chandy-Lamport aligns stream barriers to trigger non-blocking, asynchronous state snapshots to cloud storage without halting execution.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Apache Spark Project Tungsten, why does managing off-heap binary memory layouts directly dramatically outperform standard JVM object memory allocation?",
      options: [
        "It completely eliminates JVM Garbage Collection pauses and compacts memory into cache-aligned binary structures, reducing CPU L1/L2/L3 cache misses",
        "It allows Spark to run without electricity",
        "It converts Java bytecode into assembly in Python",
        "It doubles the size of every string"
      ],
      correct_option_index: 0,
      explanation: "Tungsten manages raw binary memory off-heap, bypassing JVM GC overhead and formatting data for optimal CPU cache locality.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Kafka message reliability, how does an Idempotent Producer (enable.idempotence=true) prevent duplicate records during network retries?",
      options: [
        "By discarding all failed messages",
        "By slowing down message delivery to 1 message per second",
        "The broker tracks a Producer ID (PID) and monotonically increasing sequence numbers per batch, automatically recognizing and discarding duplicate sequence numbers sent during retry handshakes",
        "By encrypting message keys"
      ],
      correct_option_index: 2,
      explanation: "Idempotent producers use PIDs and sequence numbers to allow brokers to identify and deduplicate retried batches seamlessly.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In real-time windowing mathematics, what distinguishes a 'Tumbling Window' from a 'Sliding Window'?",
      options: [
        "Tumbling windows run on GPUs; sliding windows run on CPUs",
        "Tumbling windows have fixed durations and are strictly non-overlapping (e.g. [0:00-0:05), [0:05-0:10)), whereas Sliding windows overlap by moving in smaller step increments (e.g. 10-min window advancing every 1 min)",
        "Sliding windows cannot calculate sums",
        "Tumbling windows only process text data"
      ],
      correct_option_index: 1,
      explanation: "Tumbling windows partition time into contiguous non-overlapping blocks; sliding windows advance incrementally, creating overlapping time windows.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In Apache Spark Unified Memory Management, what occurs when Execution Memory needs space for active shuffles/joins while Storage Memory is currently full of cached DataFrames?",
      options: [
        "Execution Memory has priority; it dynamically evicts cached DataFrames from Storage Memory, writing evicted blocks to disk or dropping them from memory to fulfill execution needs",
        "The Spark job crashes with an immediate fatal error",
        "Spark pauses until more physical RAM is installed",
        "Storage Memory deletes all execution tasks"
      ],
      correct_option_index: 0,
      explanation: "Spark Unified Memory gives priority to execution; when shuffles require memory, cached storage blocks are evicted to disk.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #63.");
  console.log("Skill #63 update completed successfully!");
}

run();
