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

const skillId = "4e7aeeac-9d1b-4643-999b-e20edf5236e1";

async function run() {
  console.log("Updating Skill #62: Python for Data Engineering (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: High-Performance Data Processing: Polars, Pandas and Apache Arrow" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Database Ingestion, Binary COPY and Schema Serialization" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Distributed Compute, Data Validation and Pipeline Reliability" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Staff Data Engineer & Polars Core level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Apache Arrow In-Memory Architecture and Zero-Copy IPC",
      order_index: 1,
      content: `### Columnar In-Memory Standards and Inter-Process Communication

1. The Apache Arrow In-Memory Standard:
   - Language-independent columnar memory specification defining contiguous data buffers, validity bitmaps for null tracking, and offset buffers.
   - Eliminates format conversion bottlenecks across polyglot ecosystems (Python, Rust, C++, Java, Go).

2. Zero-Copy Data Sharing:
   - Shared memory mapping enables passing multi-gigabyte Arrow record batches between separate OS processes (e.g. PyArrow to DuckDB) instantly without serialization/deserialization overhead.

3. Arrow Flight and Flight SQL:
   - High-throughput binary RPC protocol built over gRPC and HTTP/2.
   - Streams columnar record batches across network boundaries up to 50x faster than traditional JDBC/ODBC database drivers.`
    },
    {
      track_id: track1Id,
      title: "Polars vs Pandas: Lazy Evaluation and Query Optimization",
      order_index: 2,
      content: `### Rust-Native Vectorization and Symbolic Execution Plans

1. Pandas Architectural Limitations:
   - Single-threaded execution, eager evaluation, high memory overhead (often 5x to 10x raw dataset size), and GIL execution bottlenecks.

2. Polars Architecture:
   - Built from the ground up in Rust using Apache Arrow memory layouts, multi-threaded parallel execution across CPU cores, and SIMD hardware acceleration.

3. Lazy Evaluation (\`pl.LazyFrame\`):
   - Builds an Abstract Syntax Tree (AST) representing the logical query plan:
\`\`\`python
import polars as pl

q = (
    pl.scan_parquet("s3://lake/transactions/*.parquet")
    .filter(pl.col("amount") > 100.0)
    .select(["customer_id", "amount", "timestamp"])
    .group_by("customer_id")
    .agg(pl.col("amount").sum().alias("total_spend"))
)
df = q.collect()
\`\`\`
   - Query Optimizer Optimizations: Predicate Pushdown (filtering rows at file scan level), Projection Pushdown (reading strictly requested columns from Parquet files), and Slice Pushdown.`
    },
    {
      track_id: track1Id,
      title: "Chunked Streaming I/O and Memory-Bounded Generators",
      order_index: 3,
      content: `### Streaming Datasets Exceeding Physical Memory Limits

1. Memory-Bounded Generator Pipelines:
   - When processing 100GB+ files on memory-constrained (16GB RAM) worker nodes:
\`\`\`python
def stream_and_transform(filepath, chunksize=100_000):
    for chunk in pd.read_csv(filepath, chunksize=chunksize):
        cleaned = clean_batch(chunk)
        yield cleaned
\`\`\`
   - Maintains a constant O(1) memory footprint regardless of total file size.

2. Polars Streaming Engine:
   - Invoking \`.collect(streaming=True)\` processes data in batches over a work-stealing threadpool, executing joins and group-bys out-of-core without encountering Out-Of-Memory (OOM) errors.

3. PyArrow Dataset Scanner:
   - Scans massive multi-partition S3 directories, yielding Arrow RecordBatches directly into streaming consumer sinks.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "High-Throughput Ingestion: Psycopg3, Binary COPY and SQLAlchemy",
      order_index: 1,
      content: `### High-Speed Relational Ingestion and Binary Protocols

1. Ingestion Protocol Bottlenecks:
   - Standard \`INSERT INTO ... VALUES (...)\` statements incur heavy network latency, SQL parser CPU overhead, and string escaping penalties.

2. Psycopg3 Binary COPY Protocol:
   - Directly streams binary data into PostgreSQL tables via \`COPY table FROM STDIN WITH (FORMAT binary)\`:
\`\`\`python
with cursor.copy("COPY events (id, payload, created_at) FROM STDIN WITH (FORMAT binary)") as copy:
    copy.set_types(["int8", "jsonb", "timestamptz"])
    for row in binary_records:
        copy.write_row(row)
\`\`\`
   - Achieves ingestion throughput exceeding 150,000 rows per second on production database clusters.

3. SQLAlchemy 2.0 Async Engine:
   - Utilizes asynchronous connection pooling and context managers (\`async with engine.begin() as conn:\`) for non-blocking concurrent microservice ingestion.`
    },
    {
      track_id: track2Id,
      title: "Schema Evolution and Serialization: Avro, Protobuf and JSONL",
      order_index: 2,
      content: `### Binary Event Serialization and Schema Compatibility

1. Apache Avro Serialization:
   - Compact binary serialization format requiring an accompanying JSON schema.
   - Schema Evolution: Enables backward, forward, and full schema compatibility (e.g. adding optional fields with defaults), managed via Confluent Schema Registry in Kafka streaming architectures.

2. Protocol Buffers (Protobuf):
   - Google binary format with strongly typed schema definitions (\`.proto\`), maximizing network serialization throughput.

3. JSON Lines (\`jsonl\` / Newline Delimited JSON):
   - High-throughput streaming format where each line represents an independent JSON object.
   - High-Speed Parsers: Utilizing \`orjson\` or streaming \`ijson\` to parse gigabyte files without buffering massive JSON arrays into RAM.`
    },
    {
      track_id: track2Id,
      title: "Resilient API Ingestion, Retries and Rate Limiting",
      order_index: 3,
      content: `### Asynchronous Network Ingestion and Fault-Tolerant Retries

1. Asynchronous HTTP Ingestion (\`httpx\` / \`aiohttp\`):
   - Concurrent non-blocking requests fetching records from hundreds of REST or GraphQL API endpoints simultaneously over connection pools.

2. Exponential Backoff and Jitter:
   - Decorating ingestion functions with \`tenacity\` to handle transient network errors:
\`\`\`python
from tenacity import retry, stop_after_attempt, wait_exponential_jitter

@retry(stop=stop_after_attempt(5), wait=wait_exponential_jitter(initial=1, max=60))
async def fetch_api_page(url, client):
    response = await client.get(url)
    response.raise_for_status()
    return response.json()
\`\`\`
   - Adding jitter prevents the 'Thundering Herd' problem from overwhelming upstream servers upon recovery.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Distributed Python Compute: Dask, Ray and PySpark Architecture",
      order_index: 1,
      content: `### Scaling Python Across Multi-Node Distributed Clusters

1. Dask Distributed:
   - Dynamic Directed Acyclic Graph (DAG) task scheduling framework scaling NumPy arrays (Dask Array) and Pandas dataframes (Dask DataFrame) across multi-node clusters with pure Python APIs.

2. Ray Core:
   - High-performance distributed computing framework based on Tasks (stateless parallel functions) and Actors (stateful microservices).
   - Ideal for complex distributed ETL pipelines, streaming transformations, and distributed ML data loading.

3. PySpark Architecture:
   - Python API wrapper interacting with the JVM Apache Spark engine via Py4J.
   - Optimization: Catalyst optimizer builds optimized physical plans; Tungsten manages off-heap binary memory to avoid JVM garbage collection overhead.`
    },
    {
      track_id: track3Id,
      title: "Data Validation with Pydantic v2 and Pandera",
      order_index: 2,
      content: `### Schema Enforcement and Statistical Contract Validation

1. Pydantic v2 (Rust Core Engine):
   - High-speed data validation and parsing library written in Rust (\`pydantic-core\`).
   - Validates incoming raw JSON records against strict type models, field constraints, regex patterns, and custom validator functions before entering the data lake.

2. Pandera DataFrame Schema Validation:
   - Statistical schema validation framework for Polars, Pandas, and PySpark:
\`\`\`python
import pandera.polars as pa

class TransactionSchema(pa.DataFrameModel):
    transaction_id: str = pa.Field(unique=True)
    amount: float = pa.Field(gt=0.0, le=1_000_000.0)
    status: str = pa.Field(isin=["PENDING", "COMPLETED", "FAILED"])
\`\`\`
   - Verifies column types, value bounds, null fractions, and unique constraints in CI/CD pipeline runs.`
    },
    {
      track_id: track3Id,
      title: "Pipeline Observability, Structured Logging and Memory Profiling",
      order_index: 3,
      content: `### Production Diagnostics and Reliability Engineering

1. Structured JSON Logging (\`structlog\`):
   - Emits structured JSON log events enriched with pipeline context metadata:
\`\`\`python
import structlog
logger = structlog.get_logger()
logger.info("batch_processed", pipeline_id="etl_orders", batch_size=50000, duration_ms=241.5)
\`\`\`
   - Ingested directly into Datadog, Elasticsearch, or Loki for automated alerting and latency monitoring.

2. Memory Profiling and Leak Detection:
   - Utilizing \`tracemalloc\` and \`memory_profiler\` to inspect object allocation traces and diagnose memory leaks, preventing fatal Out-Of-Memory (OOM) Kubernetes pod evictions during long-running batch jobs.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #62.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "What open-source in-memory columnar data specification allows Python, Rust, C++, and Java processes to share multi-gigabyte dataframes with zero-copy overhead?",
      options: [
        "Apache Arrow",
        "SQLite",
        "HTML5",
        "ZIP format"
      ],
      correct_option_index: 0,
      explanation: "Apache Arrow defines a standardized columnar in-memory format enabling zero-copy shared memory data exchange across languages.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In Polars DataFrame processing, what is the primary operational advantage of using LazyFrames (pl.LazyFrame) over eager DataFrames?",
      options: [
        "LazyFrames convert Python code into C++",
        "LazyFrames delete all duplicate data automatically",
        "The query optimizer compiles a query plan that applies Predicate Pushdown and Projection Pushdown, scanning only required rows and columns from storage",
        "LazyFrames do not use RAM"
      ],
      correct_option_index: 2,
      explanation: "LazyFrames enable the query optimizer to push filters and column selections down to the file scanner, minimizing disk I/O.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What PostgreSQL client protocol in Python (psycopg3) achieves ingestion speeds over 150,000 rows/sec by bypassing standard INSERT statements and streaming raw binary data directly into the database?",
      options: [
        "HTTP POST",
        "Binary COPY protocol (COPY table FROM STDIN WITH FORMAT binary)",
        "FTP transfer",
        "WebSocket connection"
      ],
      correct_option_index: 1,
      explanation: "The binary COPY protocol streams records directly into PostgreSQL storage engines without SQL parsing overhead.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "When ingesting data from external REST APIs, why is 'Jitter' added to exponential backoff retry algorithms (e.g. with tenacity)?",
      options: [
        "To speed up the internet connection",
        "To delete failed HTTP requests",
        "To encrypt passwords",
        "To randomize retry delays across distributed workers, preventing the Thundering Herd problem from overwhelming the recovered API server"
      ],
      correct_option_index: 3,
      explanation: "Jitter introduces random noise into retry timers to prevent hundreds of concurrent clients from retrying at the exact same millisecond.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What Python library provides statistical DataFrame schema validation, asserting column types, null tolerances, and value boundaries for Polars, Pandas, and PySpark?",
      options: [
        "Pandera",
        "NumPy",
        "Matplotlib",
        "TensorFlow"
      ],
      correct_option_index: 0,
      explanation: "Pandera provides statistical and structural contract validation for DataFrames across Pandas, Polars, and PySpark.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In memory-bounded Python data pipelines, how do generator functions (using 'yield') process 100GB CSV files on machines with only 16GB of RAM?",
      options: [
        "By compressing the entire file into 1 byte",
        "By deleting 90% of the dataset",
        "By loading the whole file into virtual memory swap space",
        "By reading and transforming data in fixed-size chunks (e.g. 100,000 rows at a time), maintaining a constant O(1) memory footprint throughout execution"
      ],
      correct_option_index: 3,
      explanation: "Chunked generators process fixed batch sizes in a stream, maintaining a constant low memory footprint regardless of total dataset size.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Kafka streaming and data engineering, why is 'Apache Avro' widely favored for event serialization over raw JSON?",
      options: [
        "Avro files can be opened in Microsoft Word",
        "Avro produces compact binary serialization paired with schema validation, enabling backward and forward Schema Evolution via a Schema Registry",
        "Avro runs without a CPU",
        "Avro deletes all null values"
      ],
      correct_option_index: 1,
      explanation: "Avro pairs compact binary encoding with formal schema evolution rules, allowing producers and consumers to evolve schemas safely.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What is the primary architectural difference between Dask and Ray for distributed Python computing?",
      options: [
        "Dask focuses on parallelizing NumPy and Pandas data structures via task graph DAGs; Ray provides a low-level framework based on stateless Tasks and stateful Actors for high-concurrency streaming and ML workloads",
        "Dask is written in C++; Ray is written in PHP",
        "Ray only runs on a single CPU core",
        "Dask does not support Python"
      ],
      correct_option_index: 0,
      explanation: "Dask parallelizes standard PyData structures via dynamic graphs; Ray uses Actor and Task primitives to manage distributed state and compute.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In production data pipelines, why is 'Structured JSON Logging' (e.g. using structlog) superior to unstructured plaintext print/log statements?",
      options: [
        "Plaintext logs consume too much electricity",
        "Structured logs are written in Japanese",
        "It outputs machine-readable key-value JSON logs with contextual metadata (batch_id, duration_ms, records_processed), enabling automated indexing, filtering, and alerting in Datadog/Elasticsearch",
        "Structured logs delete all error messages"
      ],
      correct_option_index: 2,
      explanation: "Structured logging outputs parseable JSON events with contextual pipeline metrics, enabling automated search and monitoring.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In high-throughput event ingestion, why is 'JSON Lines' (.jsonl) superior to standard multi-record JSON arrays for large streaming pipelines?",
      options: [
        "JSON Lines files have no text",
        "JSON Lines files are encrypted by default",
        "JSON Lines cannot be read by Python",
        "Each line is an independent JSON object, allowing streaming parsers to read and process records line-by-line without buffering multi-gigabyte files into RAM"
      ],
      correct_option_index: 3,
      explanation: "JSON Lines format enables line-by-line streaming without requiring parsers to load and parse an entire multi-gigabyte array at once.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In Apache Spark's PySpark architecture, what are the roles of the 'Catalyst Optimizer' and 'Project Tungsten'?",
      options: [
        "Catalyst optimizes network cards; Tungsten cools the server fans",
        "Catalyst builds and optimizes logical and physical query execution plans, while Tungsten manages off-heap binary memory layouts to bypass JVM garbage collection overhead",
        "Catalyst converts Spark code into Python; Tungsten converts it into HTML",
        "Catalyst and Tungsten are external cloud databases"
      ],
      correct_option_index: 1,
      explanation: "Catalyst optimizes query execution plans; Tungsten executes computations on raw off-heap binary memory, avoiding JVM GC overhead.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In high-performance database networking, what is 'Apache Arrow Flight' and why does it outperform traditional JDBC/ODBC connections?",
      options: [
        "Flight is a flight simulator for pilots",
        "Flight is a web browser",
        "It streams columnar Arrow data directly over gRPC/HTTP/2 without row-by-row serialization, utilizing parallel data streams to achieve up to 50x higher throughput",
        "Flight requires no network cables"
      ],
      correct_option_index: 2,
      explanation: "Arrow Flight uses gRPC to stream raw columnar memory buffers across networks, bypassing slow row-by-row JDBC/ODBC serialization.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Python data pipeline diagnostics, what standard library module allows data engineers to trace heap memory allocations and identify memory leaks causing Kubernetes OOM kills?",
      options: [
        "tracemalloc",
        "math",
        "random",
        "json"
      ],
      correct_option_index: 0,
      explanation: "tracemalloc traces Python memory block allocations, pinpointing lines of code responsible for memory growth and leaks.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Polars query optimization, what is 'Projection Pushdown'?",
      options: [
        "Projecting slides onto a screen",
        "Deleting unneeded columns after all calculations finish",
        "Converting integers to strings",
        "Analyzing the query AST to determine exactly which columns are required downstream, instructing the Parquet reader to physically read only those specific column chunks from disk"
      ],
      correct_option_index: 3,
      explanation: "Projection pushdown pushes column selection down to the file reader, reading only requested column chunks from Parquet files.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In Pydantic v2 data validation architecture, why does it execute validation 5x to 20x faster than Pydantic v1?",
      options: [
        "Pydantic v2 skips all data validation",
        "Its core validation and serialization engine (pydantic-core) was completely rewritten in Rust, compiling schema validators into native machine code",
        "Pydantic v2 only works on 64-bit integers",
        "Pydantic v2 runs on quantum hardware"
      ],
      correct_option_index: 1,
      explanation: "Pydantic v2 uses pydantic-core written in Rust, compiling schema validation logic into fast native machine code.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #62.");
  console.log("Skill #62 update completed successfully!");
}

run();
