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

const skillId = "617c18dc-6e36-448f-a1fd-6a585c4f0daa";

async function run() {
  console.log("Updating Skill #61: ETL/ELT Pipelines (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: ETL vs ELT Paradigms, Change Data Capture and Lakehouse Layers" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Transformation Engineering with dbt and Incremental Models" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Pipeline Idempotency, Late-Arriving Data and Observability" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Staff Data Platform Engineer & dbt level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Paradigm Shift: Traditional ETL vs Modern ELT",
      order_index: 1,
      content: `### Architectural Evolution of Data Ingestion and Transformation

1. Traditional ETL (Extract, Transform, Load):
   - Ingests data from source systems, performs heavy transformations (cleansing, aggregations, joining) on dedicated intermediary compute servers (e.g. Informatica, Talend, custom Spark), and loads finalized data into target data warehouses.
   - Bottlenecks: Heavy compute infrastructure costs, pipeline fragility, schema lock-in, and permanent loss of raw source history.

2. Modern ELT (Extract, Load, Transform):
   - Ingests raw data directly into high-speed cloud data warehouses (Snowflake, BigQuery, Databricks) and executes transformations in-place using SQL via analytical engines.
   - Advantages: Complete preservation of raw historical data, decoupled ingestion from business logic, and agile self-service analytics modeling.

3. The Modern Data Stack (MDS):
   - Composed of specialized modular tools: Automated Connectors (Fivetran, Airbyte), Cloud Storage/Warehouse, SQL Transformation (dbt), and Orchestration (Airflow, Dagster).`
    },
    {
      track_id: track1Id,
      title: "Change Data Capture (CDC): Log-Based vs Query-Based Ingestion",
      order_index: 2,
      content: `### Real-Time Ingestion Mechanics and Transaction Log Replication

1. Query-Based (Watermark) CDC:
   - Polls transactional database tables periodically using timestamp filters (\`WHERE updated_at > :last_watermark\`).
   - Limitations: Imposes heavy read loads on production OLTP databases, cannot detect physical hard deletes, and misses intermediate state updates occurring between polling intervals.

2. Log-Based CDC (Debezium, Kafka Connect, AWS DMS):
   - Tails the transactional Write-Ahead Log directly (PostgreSQL WAL, MySQL binlog, Oracle Redo Log).
   - Advantages: Captures all inserts, updates, and deletes with sub-second latency, captures exact pre/post state changes, and produces zero query overhead on production database engines.

3. The Transactional Outbox Pattern:
   - Writes business domain events directly into a dedicated database Outbox table within the same ACID transaction as business entities, which is then tailed by CDC to eliminate dual-write distributed transaction failures.`
    },
    {
      track_id: track1Id,
      title: "The Medallion Architecture: Bronze, Silver and Gold Layers",
      order_index: 3,
      content: `### Multi-Hop Lakehouse Data Quality Architecture

1. Bronze Layer (Raw Ingestion):
   - Append-only, raw immutable event storage.
   - Ingests raw JSON payloads, binary records, and CSV feeds alongside audit metadata (\`_ingestion_timestamp\`, \`_source_file_name\`). No schema validation or transformations applied.

2. Silver Layer (Cleaned / Conformed):
   - Cleansed, enriched, and structured data tables.
   - Operations: Parses raw JSON into typed columns, applies schema enforcement, deduplicates duplicate records based on natural keys, standardizes timestamps to UTC, and joins reference lookups.

3. Gold Layer (Business Aggregates / Data Marts):
   - Consumption-ready dimensional star schemas and pre-computed analytical aggregates.
   - Operations: Powers executive BI dashboards, customer-facing analytics, and machine learning feature stores with strict SLAs.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "dbt Fundamentals: DAG Compilation, Ref Macros and Sources",
      order_index: 1,
      content: `### Declarative Analytics Engineering and Graph Dependency Resolution

1. Declarative Modeling with dbt (data build tool):
   - Analytics engineers write modular \`SELECT\` queries; dbt compiles SQL and automatically wraps it in boilerplate Data Definition Language (DDL: \`CREATE TABLE AS\` or \`CREATE VIEW AS\`).

2. The \`ref()\` Macro and Automated DAG Construction:
   - Referencing upstream models via \`FROM {{ ref('stg_customers') }}\` allows dbt to build the full Directed Acyclic Graph (DAG), resolving execution dependencies and topological sort ordering automatically.

3. Source Management (\`source()\` Macro):
   - Declares raw upstream database tables in YAML configuration files (\`{{ source('raw_pos', 'transactions') }}\`), enabling automated data freshness monitoring (\`dbt source freshness\`) and lineage tracking.`
    },
    {
      track_id: track2Id,
      title: "dbt Materialization Strategies: Incremental Models and Merges",
      order_index: 2,
      content: `### High-Performance Incremental Processing and Merge Topologies

1. dbt Materialization Modes:
   - \`view\`: Compiles model as a database view (zero storage cost, recomputed at query time).
   - \`table\`: Rebuilds entire table on every run (simple, but cost-prohibitive on massive datasets).
   - \`ephemeral\`: Interpolates model directly as a Common Table Expression (CTE) in downstream models.
   - \`incremental\`: Transforms and appends only new or updated records since the previous pipeline run.

2. Incremental Model Syntax and Execution:
\`\`\`sql
{{ config(materialized='incremental', unique_key='order_id', incremental_strategy='merge') }}
SELECT * FROM {{ ref('stg_orders') }}
{% if is_incremental() %}
  WHERE updated_at > (SELECT MAX(updated_at) FROM {{ this }})
{% endif %}
\`\`\`

3. Incremental Strategies:
   - \`merge\`: Executes ANSI SQL MERGE statements updating existing records and inserting new records based on \`unique_key\`.
   - \`insert_overwrite\`: Atomically replaces entire date partitions.`
    },
    {
      track_id: track2Id,
      title: "dbt Testing, Documentation and Snapshots (SCD Type 2)",
      order_index: 3,
      content: `### Automated Quality Assurance and Historical Snapshot Tracking

1. Automated Schema and Data Testing:
   - Out-of-the-Box Generic Tests: \`unique\`, \`not_null\`, \`accepted_values\`, and \`relationships\` (referential integrity checks) declared directly in YAML.
   - Singular Custom SQL Tests: Custom SQL queries asserting business logic; test passes if query returns 0 failing rows.

2. dbt Snapshots (Automated SCD Type 2):
   - Tracks historical state changes over time for mutable source tables:
\`\`\`sql
{% snapshot orders_snapshot %}
{{ config(target_schema='snapshots', unique_key='id', strategy='timestamp', updated_at='updated_at') }}
SELECT * FROM {{ source('ecom', 'orders') }}
{% endsnapshot %}
\`\`\`
   - Automatically maintains \`dbt_valid_from\` and \`dbt_valid_to\` columns, capturing full audit history.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Designing Idempotent Pipelines and Exactly-Once Semantics",
      order_index: 1,
      content: `### Pipeline Idempotency, Deterministic Hashing and Replayability

1. The Idempotency Principle:
   - A data pipeline is idempotent if executing it multiple times over the exact same input dataset produces the identical target state, without creating duplicate records or corrupted cumulative aggregates.

2. Engineering Idempotent Pipelines:
   - Avoid non-deterministic functions (e.g. \`NOW()\`, \`UUID()\`) during record transformation.
   - Deterministic Surrogate Hashing: Generating primary keys via cryptographic hashes over composite natural keys (\`MD5(CONCAT_WS('||', tenant_id, user_id, event_timestamp))\`).
   - Atomic Partition Overwrites (\`INSERT OVERWRITE\`): Replacing partition intervals atomically rather than appending.

3. Backfilling and Reprocessing:
   - Allows historical date ranges to be re-run safely after upstream logic changes without polluting downstream reporting tables.`
    },
    {
      track_id: track3Id,
      title: "Handling Late-Arriving Data, Watermarking and Re-Aggregation",
      order_index: 2,
      content: `### Temporal Stream Inconsistencies and Lookback Windows

1. The Three Time Dimensions in Data Engineering:
   - Event Time: When the real-world business event occurred (e.g. timestamp on mobile checkout).
   - Ingestion Time: When the raw record landed in the data lake object storage.
   - Processing Time: When the ETL transformation pipeline executed.

2. Late-Arriving Data Dilemma:
   - Mobile and IoT edge devices often buffer events offline, submitting data hours or days after the original event time.

3. Lookback Buffer Window Strategy:
   - Incremental pipelines must query beyond the latest timestamp by including a lookback window (e.g. 3 days):
     \`WHERE updated_at >= (SELECT MAX(updated_at) - INTERVAL 3 DAY FROM {{ this }})\`
   - Re-aggregates affected historical partitions, ensuring late-arriving metrics are fully incorporated into business reports.`
    },
    {
      track_id: track3Id,
      title: "Data Observability, Contracts and Lineage Governance",
      order_index: 3,
      content: `### Data Reliability Engineering and Contract Governance

1. The 5 Pillars of Data Observability (Monte Carlo Framework):
   - Freshness: Is data updated within expected SLA timeframes?
   - Volume: Are expected row counts arriving, or has an upstream outage caused a 90% data drop?
   - Distribution: Are column statistical profiles (means, null percentages, standard deviations) within expected ranges?
   - Schema: Have unannounced column renames or type changes broken downstream DAG models?
   - Lineage: End-to-end mapping from raw data sources through transformations to consumer dashboards.

2. Data Contracts:
   - Explicit architectural agreements defined between upstream software engineering producers and downstream data platform consumers, enforcing JSON schema validation and preventing upstream schema breakage.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #61.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "What is the primary architectural difference between traditional ETL and modern ELT?",
      options: [
        "In ELT, raw data is loaded directly into the cloud data warehouse first, and transformations are executed in-place using the warehouse's SQL engine",
        "ETL uses cloud computing while ELT uses paper forms",
        "ELT deletes all data after 24 hours",
        "ETL is only used for video files"
      ],
      correct_option_index: 0,
      explanation: "ELT loads raw data directly into cloud data warehouses and executes transformations in-warehouse using massively parallel processing.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In the Medallion Architecture (Lakehouse pattern), what is the primary role of the 'Bronze' layer?",
      options: [
        "To host executive dashboards",
        "To delete all duplicate data",
        "To store raw, append-only, immutable data exactly as ingested from source systems with audit metadata",
        "To train machine learning models"
      ],
      correct_option_index: 2,
      explanation: "The Bronze layer acts as an immutable raw landing zone preserving original source data formats and ingestion metadata.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In dbt (data build tool), what macro is used to reference upstream transformation models (e.g. FROM {{ ref('stg_orders') }}), allowing dbt to automatically build the Directed Acyclic Graph (DAG)?",
      options: [
        "config()",
        "ref()",
        "source()",
        "var()"
      ],
      correct_option_index: 1,
      explanation: "The ref() macro establishes model dependencies, enabling dbt to compile the DAG and execute models in correct topological order.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What does it mean for a data engineering pipeline to be 'Idempotent'?",
      options: [
        "The pipeline only runs on Sundays",
        "The pipeline crashes when errors occur",
        "The pipeline encrypts data with passwords",
        "Executing the pipeline multiple times over the exact same input data produces the identical final target state without creating duplicate rows or corrupting metrics"
      ],
      correct_option_index: 3,
      explanation: "Idempotency ensures that rerunning pipelines produces consistent, duplicate-free results regardless of execution count.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In Change Data Capture (CDC), why is 'Log-Based CDC' (e.g. Debezium reading WAL/binlogs) superior to periodic query polling?",
      options: [
        "It captures all inserts, updates, and hard deletes with sub-second latency with zero query load on the production database",
        "It requires no computer network",
        "It converts MySQL into PostgreSQL automatically",
        "It eliminates the need for database storage"
      ],
      correct_option_index: 0,
      explanation: "Log-based CDC tails database write-ahead logs asynchronously, capturing all row mutations and hard deletes without query overhead.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In dbt transformation engineering, what does an 'Incremental' materialization strategy achieve?",
      options: [
        "It deletes all historical records",
        "It converts all tables to views",
        "It doubles the size of every column",
        "It transforms and appends/merges only new or updated records since the previous pipeline execution, saving massive warehouse compute costs on large datasets"
      ],
      correct_option_index: 3,
      explanation: "Incremental models process only new or changed records since the last run, drastically reducing warehouse compute costs.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In software engineering to data pipeline integration, what is the 'Transactional Outbox Pattern' and what failure does it prevent?",
      options: [
        "An email inbox for developers",
        "It writes domain events to an Outbox database table inside the exact same ACID transaction as business records, which CDC then relays to prevent dual-write inconsistencies",
        "A spam filter for database queries",
        "A tool for deleting old user accounts"
      ],
      correct_option_index: 1,
      explanation: "The outbox pattern commits business data and event messages in a single transaction, eliminating dual-write race conditions.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In data pipeline design, how do data engineers handle 'Late-Arriving Data' caused by mobile or IoT devices uploading records days after the actual event timestamp?",
      options: [
        "By implementing a lookback window buffer (e.g. checking data updated within the last 3 days) during incremental runs to reprocess and update affected historical partitions",
        "By permanently deleting all late records",
        "By shutting down the pipeline for 24 hours",
        "By changing the event timestamp to the current time"
      ],
      correct_option_index: 0,
      explanation: "Lookback buffer windows check recent history to ingest and reconcile late-arriving events into historical partitions.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In dbt, what feature automatically implements Slowly Changing Dimension Type 2 (SCD Type 2) tracking with 'dbt_valid_from' and 'dbt_valid_to' columns?",
      options: [
        "dbt run",
        "dbt docs",
        "dbt Snapshots (using timestamp or check strategies)",
        "dbt test"
      ],
      correct_option_index: 2,
      explanation: "dbt snapshots monitor mutable source tables, automatically generating SCD Type 2 historical valid-time records.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What are the '5 Pillars of Data Observability' in modern data reliability engineering (Monte Carlo framework)?",
      options: [
        "HTML, CSS, JavaScript, Python, SQL",
        "Extract, Transform, Load, Test, Deploy",
        "CPU, Memory, Disk, Network, Power",
        "Freshness, Volume, Distribution, Schema, and Lineage"
      ],
      correct_option_index: 3,
      explanation: "The 5 pillars of data observability evaluate data health across Freshness, Volume, Distribution, Schema, and Lineage.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In modern data architecture governance, what is a 'Data Contract' between software engineering producers and data engineering consumers?",
      options: [
        "A financial agreement to buy cloud credits",
        "A formal, versioned API schema specification (in JSON/Protobuf/YAML) defining data models, SLAs, and constraints that upstream services agree not to break without coordinated migration",
        "An employment contract for data engineers",
        "A database backup schedule"
      ],
      correct_option_index: 1,
      explanation: "Data contracts establish formal schema agreements between upstream producers and downstream consumers to prevent silent schema breakage.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In dbt incremental model configuration, what is the architectural difference between the 'merge' strategy and the 'insert_overwrite' strategy?",
      options: [
        "Merge is written in C; insert_overwrite is written in Java",
        "Merge only works on text files",
        "Merge executes an ANSI SQL MERGE matching rows on unique_key (row-by-row updates and inserts), whereas insert_overwrite atomically replaces entire date partitions",
        "There is zero difference in execution"
      ],
      correct_option_index: 2,
      explanation: "Merge updates individual matching records on a key, while insert_overwrite replaces entire partitions in cloud object stores.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In distributed idempotent data pipelines, why is generating surrogate keys via deterministic cryptographic hashes (e.g. MD5 or SHA-256 over composite natural keys) superior to auto-incrementing integer IDs?",
      options: [
        "Deterministic hashes can be computed independently across distributed worker nodes without coordinating central lock sequences, and produce identical keys on pipeline replays",
        "Hashes take up less disk space than integers",
        "Hashes make database queries run 1,000 times faster",
        "Auto-incrementing integers are illegal in cloud databases"
      ],
      correct_option_index: 0,
      explanation: "Deterministic hashing allows distributed nodes to generate consistent, clash-free surrogate keys without central sequence locks.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In event streaming architectures, what distinguishes 'Event Time', 'Ingestion Time', and 'Processing Time'?",
      options: [
        "They all describe the exact same nanosecond",
        "Event time is in UTC; Ingestion time is in EST",
        "Processing time is when the event occurred",
        "Event time is when the event occurred on client device; Ingestion time is when the raw data landed in lake storage; Processing time is when transformation code executed"
      ],
      correct_option_index: 3,
      explanation: "Event time is client creation time; Ingestion time is storage arrival time; Processing time is transformation execution time.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In automated data quality testing, what distinguishes 'Generic Schema Tests' from 'Singular Custom Tests' in dbt?",
      options: [
        "Generic tests only run on mobile phones",
        "Generic tests are parameterized YAML assertions (unique, not_null) applied across model columns, while Singular tests are bespoke SQL queries asserting custom business logic (failing if > 0 rows return)",
        "Singular tests cannot be automated in CI/CD",
        "Generic tests are written in Python"
      ],
      correct_option_index: 1,
      explanation: "Generic tests are reusable YAML constraints, whereas singular tests are custom SQL scripts asserting specific business rules.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #61.");
  console.log("Skill #61 update completed successfully!");
}

run();
