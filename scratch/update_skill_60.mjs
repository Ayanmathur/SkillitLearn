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

const skillId = "5fceb6a6-9e0b-4283-b9f5-42c348c29546";

async function run() {
  console.log("Updating Skill #60: SQL & Data Warehousing (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Columnar Storage, Micro-Partitioning and Cloud Warehouse Internals" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Data Modeling Methodologies: Kimball, Inmon and Data Vault 2.0" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Distributed Query Optimization, Lakehouse Formats and Governance" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Snowflake & BigQuery Architect level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Row vs Columnar Storage: Parquet, Compression and I/O Pruning",
      order_index: 1,
      content: `### Columnar Physical Layouts and Compression Algorithms

1. Row-Oriented (OLTP) vs Columnar (OLAP) Architectures:
   - Row-Oriented (PostgreSQL/MySQL): Stores contiguous records on disk; ideal for point lookups and transactional single-row inserts/updates. Inefficient for analytics because reading 2 columns requires scanning all 100 columns from disk.
   - Columnar (Parquet/ORC): Stores contiguous values of a single column together; reading 2 columns scans strictly those 2 columns from disk, reducing disk I/O by 90%+.

2. Columnar Encoding and Compression:
   - Dictionary Encoding: Replaces repeating strings with small integer dictionary IDs.
   - Run-Length Encoding (RLE): Compresses consecutive repeated values into (value, count) pairs.
   - Bit-Packing and Delta Encoding: Stores numerical differences between sequential values.

3. Apache Parquet File Layout:
   - Structured into File Metadata, Row Groups (0.5GB to 1GB chunks), and Column Chunks containing Pages with embedded Bloom filters and min/max statistics enabling pushdown predicate pruning.`
    },
    {
      track_id: track1Id,
      title: "Cloud Warehouse Architectures: Snowflake, BigQuery and Redshift",
      order_index: 2,
      content: `### Decoupled Compute and Storage Cloud Topologies

Modern cloud data warehouses separate compute clusters from persistent storage to enable independent elastic scaling:

1. Snowflake Multi-Cluster Shared Data:
   - Centralized Storage: Immutable micro-partitions stored in cloud object storage (Amazon S3, Google Cloud Storage, Azure Blob).
   - Multi-Cluster Compute: Independent Virtual Warehouses (T-shirt sized compute clusters X-Small to 4X-Large) querying shared storage simultaneously with zero resource contention.
   - Cloud Services Layer: Manages authentication, global metadata, ACID transaction coordination, and query optimization.

2. Google BigQuery (Serverless Dremel Architecture):
   - Decoupled Capacitor columnar storage over Colossus distributed filesystem, dynamically allocating ephemeral Dremel multi-stage execution trees with automated slot management.

3. Amazon Redshift (RA3 Architecture):
   - Decouples compute from Amazon Redshift Managed Storage (RMS), utilizing AQUA hardware acceleration caches.`
    },
    {
      track_id: track1Id,
      title: "Micro-Partitioning, Clustering Keys and Metadata Pruning",
      order_index: 3,
      content: `### Physical Partitioning, Clustering Depth and Predicate Pruning

1. Micro-Partition Mechanics (Snowflake):
   - Data is automatically divided into immutable micro-partitions (50MB to 500MB uncompressed).
   - Metadata Repository: Stores distinct min/max values, null counts, and byte offsets for every column within every micro-partition.

2. Clustering Keys and Natural Clustering:
   - When queries filter on specific attributes (e.g. \`WHERE tenant_id = 492 AND transaction_date >= '2026-08-01'\`), the query optimizer consults micro-partition metadata headers before reading storage.
   - Micro-Partition Pruning: If a micro-partition's min/max range for \`transaction_date\` does not overlap the query predicate, the entire micro-partition is pruned, reading zero bytes from storage.
   - Explicit Clustering Keys (\`CLUSTER BY (tenant_id, transaction_date)\`): Reorganizes physical micro-partition sorting to minimize clustering depth.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Dimensional Data Modeling: Conformed Dimensions and Granularity",
      order_index: 1,
      content: `### Ralph Kimball Dimensional Modeling Foundations

1. The 4-Step Dimensional Design Process:
   - Step 1: Select the Business Process (e.g. retail checkout, loan processing).
   - Step 2: Declare the Grain (the exact physical meaning of a single fact table record).
   - Step 3: Identify the Dimensions (contextual descriptive entities: Who, What, Where, When).
   - Step 4: Identify the Facts (numeric, additive quantitative metrics: revenue, cost, quantity).

2. Conformed Dimensions:
   - Standardized dimension tables (e.g. \`dim_date\`, \`dim_customer\`) shared across multiple business processes, enabling cross-process drilled-down analytics across an enterprise Fact Constellation schema.

3. Fact Table Typologies:
   - Transaction Fact Tables: One record per atomic transaction event.
   - Periodic Snapshot Fact Tables: Captures cumulative state at regular time intervals (e.g. monthly account balances).
   - Accumulating Snapshot Fact Tables: Tracks multi-stage business pipelines with predictable milestone dates (e.g. order -> ship -> deliver).`
    },
    {
      track_id: track2Id,
      title: "Corporate Information Factory (Inmon) vs Data Vault 2.0",
      order_index: 2,
      content: `### Enterprise Data Modeling Paradigms and Auditability

1. Bill Inmon Corporate Information Factory (CIF):
   - Top-down architecture: Ingests normalized data into a centralized Enterprise Data Warehouse (EDW) modeled in Third Normal Form (3NF) acting as the single version of truth.
   - Departmental Data Marts: Downstream dimensional star schemas populated from the 3NF EDW for departmental reporting.

2. Data Vault 2.0 (Dan Linstedt):
   - Highly agile, insert-only, auditable modeling architecture designed for massive enterprise warehouses:
     - Hubs: Stores unique business keys, load timestamps, and record sources (e.g. \`hub_customer\`).
     - Links: Captures transactions and many-to-many relationships between Hubs (e.g. \`link_order_item\`).
     - Satellites: Stores all temporal descriptive attributes and complete historical changes over time (e.g. \`sat_customer_details\`).`
    },
    {
      track_id: track2Id,
      title: "Slowly Changing Dimensions and Bridge Tables for Many-to-Many",
      order_index: 3,
      content: `### Advanced Dimension Engineering and Complex Relationships

1. Slowly Changing Dimension (SCD) Taxonomy:
   - SCD Type 1: Overwrites existing attribute values in place (no historical audit tracking).
   - SCD Type 2: Inserts a new record with surrogate key, \`effective_start_date\`, \`effective_end_date\`, and \`is_current\` boolean flag, preserving complete historical timelines.
   - SCD Type 4: Maintains current attributes in base dimension while offloading rapid historical changes to a dedicated historical tracking table.
   - SCD Type 6 (Hybrid 1+2+3): Embeds both historical SCD 2 rows and an overwrite column containing the current active value.

2. Bridge Tables for Many-to-Many Relationships:
   - Resolves multi-valued dimensions (e.g. medical patients with multiple concurrent diagnoses) by inserting a bridge table containing weighting allocation factors summing to 1.0.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Distributed Join Optimization: Broadcast vs Shuffle and Data Skew",
      order_index: 1,
      content: `### Distributed Query Execution Engines and Join Topologies

1. Distributed Join Algorithms:
   - Broadcast (Map-Side / Replicated) Join: Broadcasts a small dimension table (<100MB) to all worker nodes in the cluster. Each node joins its local partition of the massive fact table against the cached dimension with zero inter-node network data movement.
   - Shuffle Hash Join: Re-partitions both massive tables across the network using a hash of the join keys. Necessary when both tables exceed broadcast memory thresholds.

2. Data Skew and Straggler Mitigation:
   - Occurs when join keys are non-uniformly distributed (e.g. 50% of orders belonging to a single bulk customer ID or NULLs), causing one worker node to receive massive data volume while other nodes sit idle.
   - Salting Technique: Appends a random integer (salt: 1 to K) to the skewed join key on the large table and replicates corresponding records on the small table K times to evenly distribute workload across all cluster nodes.`
    },
    {
      track_id: track3Id,
      title: "Modern Lakehouse Formats: Iceberg, Delta Lake and Time Travel",
      order_index: 2,
      content: `### Open Table Formats and ACID Transactions on Object Storage

1. Open Table Format Architecture (Apache Iceberg, Delta Lake, Apache Hudi):
   - Brings database ACID transaction semantics, snapshot isolation, and metadata abstraction to raw cloud object storage (Parquet files on S3/GCS):
   - Transaction Log / Manifest Hierarchy: Atomic commits via JSON/Avro transaction logs tracking exact data file snapshots.

2. Advanced Lakehouse Capabilities:
   - Time Travel Queries: Querying historical snapshots (\`SELECT * FROM sales FOR SYSTEM_TIME AS OF '2026-08-01 00:00:00'\`).
   - Zero-Copy Cloning: Creating instant sandbox environments by referencing existing immutable storage files without duplicating data.
   - Partition Evolution: Changing partitioning strategies (e.g. from daily to hourly) without rewriting historical data files.
   - Schema Evolution: Safe column addition, renaming, and reordering without breaking downstream pipelines.`
    },
    {
      track_id: track3Id,
      title: "Security, Row/Column Masking and Materialized Views",
      order_index: 3,
      content: `### Analytical Governance, Dynamic Masking and Query Acceleration

1. Materialized Views and Automated Query Rewriting:
   - Persists pre-computed aggregations and joins on disk.
   - Modern optimizers automatically rewrite incoming user queries to read from materialized views when available, accelerating dashboard performance from minutes to milliseconds with automatic background incremental refresh.

2. Granular Data Security and Privacy:
   - Dynamic Data Masking: Evaluates user RBAC roles at query runtime to mask sensitive PII (e.g. rendering \`***-**-1234\` for analysts and plaintext SSNs for authorized compliance officers).
   - Row Access Policies (Row-Level Security): Dynamically filters returned row sets based on session context (e.g. restricting regional managers to their assigned sales territories).
   - Secure Views: Prevents query optimizer cost-based optimizations from leaking sensitive data via error message side-channels.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #60.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "Why do columnar storage formats (such as Apache Parquet) drastically outperform row-oriented databases for analytical OLAP queries?",
      options: [
        "Columnar formats delete all text data",
        "Columnar formats only work on single-core CPUs",
        "Columnar storage reads only the specific queried column blocks from disk rather than scanning all row attributes, reducing disk I/O by over 90%",
        "Columnar formats convert numbers to Roman numerals"
      ],
      correct_option_index: 2,
      explanation: "Columnar formats store data by column, allowing analytical queries that touch a few columns to scan only relevant data pages.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In Snowflake cloud data warehouse architecture, what architectural principle enables running multiple compute clusters simultaneously without performance interference?",
      options: [
        "Separation of Compute and Storage (independent Virtual Warehouses querying shared immutable cloud object storage simultaneously)",
        "Running all queries on a single central hard drive",
        "Converting SQL into HTML",
        "Deleting all database indexes"
      ],
      correct_option_index: 0,
      explanation: "Snowflake decouples compute from storage, allowing multiple independent virtual warehouses to query shared storage with zero contention.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In Ralph Kimball dimensional data modeling, what is the 'Grain' of a fact table?",
      options: [
        "The physical weight of the server",
        "The number of rows in the dimension table",
        "The speed of the network connection",
        "The exact atomic level of business detail represented by a single record in the fact table (e.g. individual line item on a retail receipt)"
      ],
      correct_option_index: 3,
      explanation: "The grain defines the fundamental level of detail for every row in a fact table, guiding all downstream dimensional modeling.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In distributed query optimization, what is a 'Broadcast (Map-Side) Join'?",
      options: [
        "A join that plays an audio file",
        "The query engine copies a small dimension table to all cluster nodes, allowing each node to join its local fact partition with zero network shuffle data movement",
        "A join that runs only on Wi-Fi",
        "A join that fails when tables have more than 10 rows"
      ],
      correct_option_index: 1,
      explanation: "Broadcast joins replicate small dimension tables to all worker nodes, eliminating costly network shuffling of massive fact tables.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In modern open lakehouse table formats (such as Apache Iceberg and Delta Lake), what feature allows querying historical snapshots of a table at a past timestamp?",
      options: [
        "Virtual Memory",
        "Garbage Collection",
        "Time Travel (querying historical table states via metadata transaction log snapshots)",
        "Database Sharding"
      ],
      correct_option_index: 2,
      explanation: "Time travel leverages immutable Parquet data files and metadata transaction logs to reproduce table state as of any point in history.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In cloud data warehouses (such as Snowflake), how does 'Micro-Partition Pruning' accelerate query performance without traditional database indexes?",
      options: [
        "By deleting unqueried columns from the table",
        "The metadata layer stores min/max column values for every micro-partition; queries skip non-overlapping micro-partitions entirely, reading zero bytes from storage",
        "By compressing all numbers into 1 bit",
        "By running queries in browser JavaScript"
      ],
      correct_option_index: 1,
      explanation: "Micro-partition headers track min/max statistics, allowing query engines to skip reading unneeded storage files completely.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Data Vault 2.0 modeling architecture, what are the three fundamental table entities?",
      options: [
        "Tables, Views, and Triggers",
        "Rows, Columns, and Cells",
        "Clients, Servers, and Databases",
        "Hubs (unique business keys), Links (transactions and relationships), and Satellites (temporal descriptive attributes and audit history)"
      ],
      correct_option_index: 3,
      explanation: "Data Vault 2.0 models enterprise data through Hubs (business keys), Links (relationships), and Satellites (descriptive context and history).",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In distributed database joins, what problem is caused by 'Data Skew' and how does the 'Salting' technique resolve it?",
      options: [
        "Data skew causes worker nodes processing dominant join keys to become stragglers; salting appends random integers to keys, distributing the workload evenly across all cluster nodes",
        "Data skew causes hard drives to run out of electricity",
        "Salting encrypts passwords using AES-256",
        "Data skew deletes the database schema"
      ],
      correct_option_index: 0,
      explanation: "Salting appends random numbers to disproportionately frequent keys, spreading skewed data across multiple worker nodes to prevent bottlenecks.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In dimensional modeling, what is a 'Conformed Dimension' and why is it critical in enterprise data architecture?",
      options: [
        "A dimension table that has no primary key",
        "A dimension that is stored in a CSV file",
        "A standardized dimension table (such as dim_date or dim_customer) shared consistently across multiple business fact tables, enabling cross-process enterprise analysis",
        "A dimension that changes every second"
      ],
      correct_option_index: 2,
      explanation: "Conformed dimensions have consistent keys and attribute definitions across the enterprise, enabling drilled-across fact constellation queries.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In data warehouse security and governance, what does 'Dynamic Data Masking' achieve?",
      options: [
        "It hides all tables from search engines",
        "It evaluates user RBAC roles at query execution time to obscure sensitive PII (e.g. displaying '***-**-1234' for unauthorized roles) without altering data on disk",
        "It encrypts the entire cloud data center",
        "It turns off database logging"
      ],
      correct_option_index: 1,
      explanation: "Dynamic data masking evaluates access policies during query execution, masking PII for unauthorized roles while preserving raw data.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "In dimensional data modeling, how does a 'Bridge Table' resolve Many-to-Many relationships between fact records and multi-valued dimensions (e.g. medical patients with multiple simultaneous diagnoses)?",
      options: [
        "By deleting all diagnoses except the first one",
        "By converting the database into a graph database",
        "By merging all patient records into a single row",
        "By placing an intermediary bridge table containing group keys and weighting allocation factors (summing to 1.0) between the fact table and the dimension"
      ],
      correct_option_index: 3,
      explanation: "Bridge tables use allocation factors to distribute fact metrics proportionally across multi-valued dimension members without double-counting.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Apache Iceberg table format architecture, what is the hierarchical relationship between Iceberg Catalog, Metadata File, Manifest List, and Manifest Files?",
      options: [
        "The Catalog points to the current Metadata file, which references a Manifest List of valid snapshots, which references Manifest Files tracking individual Parquet data file paths and column min/max metrics",
        "Iceberg stores all data in a single text file",
        "Manifest files run inside CPU registers",
        "The Catalog is a physical printer"
      ],
      correct_option_index: 0,
      explanation: "Iceberg uses a multi-level tree (Catalog -> Metadata File -> Manifest List -> Manifest Files -> Data Files) to achieve atomic snapshot commits.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "What architectural difference distinguishes the Inmon Corporate Information Factory (CIF) from the Kimball Dimensional Lifecycle?",
      options: [
        "Inmon uses Python; Kimball uses Java",
        "Kimball only works on mainframe computers",
        "Inmon builds a normalized 3NF Enterprise Data Warehouse first as the single source of truth, feeding departmental star schema data marts; Kimball builds an integrated bus architecture of dimensional star schemas directly",
        "Inmon does not use databases"
      ],
      correct_option_index: 2,
      explanation: "Inmon advocates a normalized 3NF EDW feeding downstream dimensional marts, while Kimball builds enterprise dimensional models directly around business processes.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In columnar compression algorithms, what is 'Run-Length Encoding' (RLE) and what data ordering maximizes its compression ratio?",
      options: [
        "RLE encrypts data using RSA keys",
        "RLE compresses consecutive identical values into (value, count) pairs; its compression ratio is maximized when data is sorted on the encoded column",
        "RLE only works on randomly shuffled data",
        "RLE converts numbers into floating point decimals"
      ],
      correct_option_index: 1,
      explanation: "RLE compresses repeating consecutive elements; sorting data groups identical values together, maximizing run lengths and compression.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In analytical database optimization, how do 'Materialized Views with Automated Query Rewriting' improve dashboard performance?",
      options: [
        "The optimizer detects when an incoming query matches pre-aggregated materialized view definitions, transparently redirecting execution to read precomputed results from disk without user query modifications",
        "By deleting old data after 30 days",
        "By forcing users to write queries in binary",
        "By caching web browser cookies"
      ],
      correct_option_index: 0,
      explanation: "Automated query rewriting transparently substitutes precomputed materialized view data for complex aggregations, accelerating queries with zero user SQL changes.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #60.");
  console.log("Skill #60 update completed successfully!");
}

run();
