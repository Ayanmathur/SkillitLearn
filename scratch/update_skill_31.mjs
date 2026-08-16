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

const skillId = "1571702d-8572-46a2-8566-83488243a68f";

async function run() {
  console.log("Updating Skill #31: Observability (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: OpenTelemetry Standards, Prometheus TSDB and PromQL Mathematics" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Distributed Tracing, Span DAGs and High-Scale Logging" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: SRE SLIs/SLOs, Multi-Burn-Rate Alerts and eBPF Profiling" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Three Pillars and OpenTelemetry (OTel) Collector Architecture",
      order_index: 1,
      content: `### Telemetry Foundations and the OpenTelemetry Standard

Observability is the ability to infer the internal states of a complex system based on external outputs:

1. The Three Pillars of Observability:
   - Metrics: Numeric aggregations evaluated over fixed time intervals (low storage footprint, ideal for threshold alerting and capacity trends).
   - Logs: Structured contextual event records with microsecond timestamps (ideal for forensic debugging of discrete transactions).
   - Distributed Traces: Request journeys across distributed microservice boundaries (ideal for diagnosing distributed latency bottlenecks).

2. OpenTelemetry (CNCF OTel):
   - Universal vendor-neutral telemetry specification unifying metrics, logs, and traces.
   - OTel Collector Pipeline Architecture:
     - Receivers: Ingests telemetry via OTLP (gRPC/HTTP), Prometheus, or Jaeger formats.
     - Processors: Batches records, applies memory limits, drops sensitive PII attributes, and decorates telemetry with Kubernetes pod/node metadata.
     - Exporters: Translates and ships data to storage backends (Prometheus, Loki, Tempo, Datadog).

3. W3C Trace Context Propagation:
   - Standardized HTTP header (\`traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01\`) passing 128-bit Trace ID and 64-bit Parent Span ID across microservices.`
    },
    {
      track_id: track1Id,
      title: "Prometheus TSDB Architecture, Gorilla Compression and Scraping",
      order_index: 2,
      content: `### Internal Storage Engine of Prometheus

Prometheus is a time-series database optimized for high-throughput metric ingestion:

1. TSDB Block Storage Architecture:
   - Head Block: In-memory active sample buffer backed by an append-only Write-Ahead Log (WAL) on disk to survive server crashes.
   - 2-Hour Compacted Block Directories:
     - \`chunks/\`: Raw compressed time-series metric data.
     - \`index\`: Lucene-style inverted index mapping label pairs (\`app="frontend"\`, \`env="prod"\`) to series IDs.
     - \`meta.json\`: Block metadata and compaction level.

2. Facebook Gorilla Compression Algorithm:
   - Timestamp Compression: Delta-of-delta encoding (calculating the difference between successive time deltas), compressing 64-bit timestamps down to an average of 1.37 bits.
   - Value Compression: XOR encoding with leading/trailing zero tracking against the previous 64-bit IEEE 754 floating-point sample.
   - Compresses 16-byte raw metric samples into an average of ~1.37 bytes per sample.

3. Pull-Based Metric Scraping:
   - Prometheus server actively scrapes \`/metrics\` HTTP endpoints exposed by applications at regular scrape intervals (e.g. every 15 seconds), utilizing dynamic Kubernetes Service Discovery.`
    },
    {
      track_id: track1Id,
      title: "Advanced PromQL: Rate Mathematics, Histograms and Quantiles",
      order_index: 3,
      content: `### Mathematical Analytics with Prometheus Query Language (PromQL)

1. PromQL Metric Types:
   - Counter: Monotonically increasing value resetting to zero on service restarts.
   - Gauge: Snapshot value that can arbitrarily increase or decrease (e.g. memory usage).
   - Histogram: Samples observations into cumulative bucket intervals (\`_bucket\`), tracking sample count (\`_count\`) and sum (\`_sum\`).

2. Rate Mathematics:
   - \`rate(http_requests_total[5m])\`: Calculates per-second average rate over a 5-minute range window, automatically compensating for counter resets and extrapolating boundary intervals.
   - \`irate()\`: Instantaneous rate calculated strictly between the last two data points in the range window; highly volatile, used for fast-spiking metrics.

3. High-Cardinality Quantile Calculations:
   - Computing 99th percentile (p99) latency across microservices:
\`\`\`promql
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))
\`\`\`
   - PromQL interpolates bucket boundaries linearly to calculate accurate percentile latencies.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Distributed Tracing Architecture, Spans and Tail-Based Sampling",
      order_index: 1,
      content: `### Architecture of Distributed Tracing Systems

Distributed tracing reconstructs execution paths through asynchronous microservices:

1. Trace and Span Mechanics:
   - Trace: A Directed Acyclic Graph (DAG) representing the complete end-to-end execution of a user request.
   - Span: The fundamental building block representing a single unit of contiguous work (e.g. an HTTP request or SQL query execution).
   - Span Anatomy: Span ID, Trace ID, Parent Span ID, Operation Name, Start/End Timestamps, Key-Value Span Attributes, and Span Events (in-span logs and exceptions).

2. Trace Sampling Strategies:
   - Head-Based Sampling: Sampling decision is made at the initial ingress gateway (e.g. sampling a fixed 2% of incoming traffic). Inefficient: drops 98% of rare error transactions.
   - Tail-Based Sampling: The OpenTelemetry Collector buffers all spans in memory until the entire distributed trace completes. The collector inspects the completed trace and samples 100% of traces containing HTTP 5xx errors or latency exceeding 1,500ms, while keeping only 1% of normal 200 OK traces.`
    },
    {
      track_id: track2Id,
      title: "Distributed Trace Engines: Tempo, Jaeger and Critical Path Analysis",
      order_index: 2,
      content: `### Trace Storage Engines and Distributed Latency Analysis

1. Trace Storage Engines:
   - Grafana Tempo / Jaeger: Massively scalable distributed tracing backends storing raw compressed span blocks directly in cheap cloud object storage (S3/GCS), querying traces via TraceQL.

2. Critical Path Latency Analysis:
   - Traces contain complex mixtures of synchronous blocking calls and parallel asynchronous fanouts.
   - Critical Path Analysis algorithmically computes the longest sequential chain of dependent synchronous spans responsible for the total duration of the end-to-end request, pinpointing the exact microservice causing user-facing latency.

3. Correlation Linking (Logs-to-Traces):
   - Structured loggers inject \`trace_id\` and \`span_id\` into every log message.
   - Modern observability UIs (Grafana) enable 1-click jumps directly from an error log entry to the corresponding distributed trace waterfall.`
    },
    {
      track_id: track2Id,
      title: "High-Scale Log Ingestion: Vector, Grafana Loki and LogQL",
      order_index: 3,
      content: `### Modern Cloud-Native Centralized Logging Architecture

Traditional log indexing engines (Elasticsearch) index every text word, causing massive disk bloat and JVM memory crashes under high ingestion volume:

1. Edge Log Routing with Vector / Fluentbit:
   - High-performance Rust/C log agents deployed as DaemonSets on Kubernetes nodes.
   - Streams container logs directly from \`/var/log/pods\`, strips debug logs, masks credit card/PII patterns, and enriches streams with Kubernetes pod labels.

2. Grafana Loki Architecture:
   - 'Prometheus, but for logs': Loki indexes only metadata labels (e.g. \`namespace="production"\`, \`app="auth"\`), leaving raw log lines unindexed and compressed into gzip chunks stored in object storage.
   - Reduces logging storage and memory infrastructure costs by up to 80% compared to full-text search clusters.

3. LogQL Querying:
   - Filtering and parsing JSON logs dynamically at query time:
\`\`\`logql
{app="checkout"} |= "error" | json | status >= 500 | line_format "{{.timestamp}} - {{.error_msg}}"
\`\`\`
   - Generating metric time series from logs: \`sum(rate({app="checkout"} |= "panic" [5m]))\`.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "SRE Reliability Engineering: SLIs, SLOs and Error Budget Math",
      order_index: 1,
      content: `### Quantitative SRE Frameworks: SLIs, SLOs and Error Budgets

Site Reliability Engineering transforms subjective uptime discussions into mathematical reliability targets (Google SRE Book):

1. Service Level Indicators (SLIs):
   - A quantifiable metric measuring real-time user experience:
\`\`\`
SLI = (Count of Good Events / Total Count of Valid Events) * 100%
\`\`\`
   - Example: Percentage of HTTP GET requests to \`/checkout\` returning HTTP 200 in < 250 milliseconds over a 30-day rolling window.

2. Service Level Objectives (SLOs):
   - The formal target reliability percentage agreed upon by engineering, product, and leadership (e.g. 99.9% availability over 30 days).

3. The Error Budget:
   - The allowable margin of unreliability: \`Error Budget = 100% - SLO\`.
   - For a 99.9% SLO over 30 days, the Error Budget is 0.1% (allowing exactly 43.2 minutes of service degradation per month).
   - Error Budget Policy: When the error budget is healthy, product teams deploy features rapidly; when the error budget is exhausted (> 100% burned), feature releases are halted and engineering effort is dedicated 100% to reliability refactoring.`
    },
    {
      track_id: track3Id,
      title: "Multi-Window Multi-Burn-Rate Alerting (Google SRE Standard)",
      order_index: 2,
      content: `### Eliminating Alert Fatigue with Multi-Burn-Rate Alerts

Static threshold alerts (e.g. 'Alert if CPU > 85%') cause severe alert fatigue and miss critical slow degradation; modern SRE uses Multi-Window Multi-Burn-Rate alerting (Google SRE Workbook Chapter 5):

1. Burn Rate Physics:
   - Burn Rate (BR) is the rate at which a service is consuming its Error Budget:
     - BR 1: Consumes 100% of the 30-day error budget in exactly 30 days (nominal limit).
     - BR 14.4: Consumes 100% of the error budget in 2 days (5% consumed in 1 hour).

2. Multi-Window Multi-Burn-Rate Alert Architecture:
   - To eliminate false alarms, an alert requires BOTH a long window (to detect significant budget consumption) AND a short window (to confirm the outage is actively ongoing right now):
     - Critical Page (Wake On-Call Engineer): 1-hour long window AND 5-minute short window with Burn Rate 14.4 (rapidly burning 5% budget).
     - Moderate Page (Business Hours): 6-hour long window AND 30-minute short window with Burn Rate 6 (burning 5% budget in 6 hours).
     - Ticket Alert: 3-day window with Burn Rate 1 (burning 10% budget over 3 days).`
    },
    {
      track_id: track3Id,
      title: "Continuous Profiling with eBPF and SRE Dashboard Design (RED / USE)",
      order_index: 3,
      content: `### Low-Overhead Continuous Profiling and Dashboard Design

1. Dashboard Visualization Methodologies:
   - The RED Method (for Request-Driven Services):
     - Rate: The number of requests per second received by the service.
     - Errors: The number of failing requests per second.
     - Duration: The latency distribution (p50, p95, p99) of request processing.
   - The USE Method (for Hardware Resources - CPU, Memory, Disk, Network):
     - Utilization: Percentage of time the resource is busy.
     - Saturation: Degree of backlog / queue depth waiting for the resource.
     - Errors: Count of physical or hardware errors.

2. Continuous In-Production Profiling (Parca / Pyroscope):
   - eBPF-Powered Stack Sampling: Samples kernel and user-space CPU stack traces 100 times per second across all Kubernetes containers with < 1% CPU overhead.
   - Interactive Flame Graphs: Visualizes hierarchical function call trees, pinpointing exact code lines causing CPU spin loops or memory allocations in live production.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #31.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "What CNCF open-source standard provides a universal, vendor-neutral telemetry framework for collecting and processing metrics, logs, and distributed traces?",
      options: [
        "Docker Swarm",
        "Apache Tomcat",
        "OpenTelemetry (OTel)",
        "MySQL Workbench"
      ],
      correct_option_index: 2,
      explanation: "OpenTelemetry (OTel) is the CNCF standard providing vendor-agnostic APIs, SDKs, and tooling to generate and collect telemetry.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In Prometheus time-series data storage, what compression algorithm encodes timestamps using delta-of-delta and values using XOR floating-point diffs to achieve ~1.37 bytes per sample?",
      options: [
        "Facebook Gorilla Compression",
        "Zip Compression",
        "LZW Algorithm",
        "Gzip Default"
      ],
      correct_option_index: 0,
      explanation: "Facebook's Gorilla compression algorithm compresses 16-byte raw samples down to an average of 1.37 bytes per sample using delta-of-delta and XOR encoding.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In Site Reliability Engineering (SRE), what metric defines the quantifiable target reliability level agreed upon by engineering and business stakeholders (e.g. 99.9% over 30 days)?",
      options: [
        "Service Level Agreement (SLA)",
        "Mean Time to Failure (MTTF)",
        "Total Cost of Ownership (TCO)",
        "Service Level Objective (SLO)"
      ],
      correct_option_index: 3,
      explanation: "The Service Level Objective (SLO) is the internal reliability target (e.g. 99.9%) that guides engineering trade-offs and error budget management.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In distributed tracing, what fundamental building block represents a single discrete unit of contiguous work (such as an individual HTTP request or database query)?",
      options: [
        "Packet",
        "Span",
        "Thread",
        "Interrupt"
      ],
      correct_option_index: 1,
      explanation: "A Span is the fundamental building block of a trace, representing a single unit of contiguous work with start/end timestamps and attributes.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In microservice dashboard engineering, what three metrics compose the 'RED Method' for request-driven services?",
      options: [
        "Reads, Errors, Disks",
        "Requests, Endpoints, Drivers",
        "Rate (requests/sec), Errors (failed requests/sec), and Duration (latency distribution)",
        "RAM, Ethernet, Database"
      ],
      correct_option_index: 2,
      explanation: "The RED Method visualizes Rate (throughput), Errors (error count/sec), and Duration (request latency distribution) for microservices.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In distributed trace sampling, how does Tail-Based Sampling at the OpenTelemetry Collector differ from traditional Head-Based Sampling?",
      options: [
        "Tail-based sampling only runs on weekends",
        "Tail-based sampling buffers completed traces in memory and evaluates the entire trace, retaining 100% of traces containing HTTP 5xx errors or high latency while sampling only 1% of successful traces",
        "Tail-based sampling deletes all error traces",
        "Tail-based sampling requires zero memory"
      ],
      correct_option_index: 1,
      explanation: "Tail-based sampling makes sampling decisions after a trace completes, ensuring all anomalous and error traces are preserved while normal traffic is sampled down.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In PromQL rate calculations, what is the critical difference between the 'rate()' function and the 'irate()' function?",
      options: [
        "rate() only works on gauges; irate() only works on histograms",
        "irate() can only be run once per day",
        "rate() is deprecated and should never be used",
        "rate() calculates the average per-second increase across the entire range window (ideal for alerting), while irate() calculates instantaneous rate between the last two data points (ideal for fast-spiking graphs)"
      ],
      correct_option_index: 3,
      explanation: "rate() averages over the entire range window smoothing out noise (ideal for SLO alerts), while irate() evaluates the last two points capturing instantaneous spikes.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "How does Grafana Loki achieve up to 80% lower infrastructure storage and memory costs compared to traditional Elasticsearch clusters?",
      options: [
        "Loki indexes only metadata stream labels (like Prometheus) and stores raw compressed log streams directly in cheap object storage (S3) without building full-text inverted word indexes",
        "Loki deletes all logs immediately after receiving them",
        "Loki runs exclusively on floppy disks",
        "Loki only accepts logs in plain text without timestamps"
      ],
      correct_option_index: 0,
      explanation: "Loki avoids expensive full-text inverted indexes, indexing only metadata labels and storing compressed log chunks in cheap object storage.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In Google SRE Multi-Burn-Rate alerting, why must an alert condition evaluate BOTH a long time window AND a short time window simultaneously?",
      options: [
        "To increase the number of pages sent to engineers",
        "Because Prometheus cannot evaluate single windows",
        "To eliminate false alarms: the long window ensures a significant portion of the error budget was consumed, while the short window verifies the outage is actively ongoing right now",
        "To delay alert delivery by 24 hours"
      ],
      correct_option_index: 2,
      explanation: "Multi-window alerting prevents reset-flapping by ensuring both significant budget depletion (long window) and active ongoing severity (short window) exist before paging.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In distributed tracing analytics, what is 'Critical Path Analysis'?",
      options: [
        "A tool that deletes slow microservices",
        "An algorithmic technique that calculates the longest sequential chain of dependent synchronous spans responsible for total request latency, separating serial bottlenecks from parallel calls",
        "A system that measures computer room temperature",
        "A script that restarts Kubernetes nodes"
      ],
      correct_option_index: 1,
      explanation: "Critical Path Analysis computes the serial dependency path governing overall trace duration, revealing the exact spans dictating total latency.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "In SRE error budget mathematics, if an application targets a 99.9% SLO over a rolling 30-day window, what total duration of cumulative service degradation is permitted by the Error Budget?",
      options: [
        "43.2 seconds",
        "8.76 hours",
        "24 hours",
        "43.2 minutes (0.1% of 43,200 total minutes in 30 days)"
      ],
      correct_option_index: 3,
      explanation: "30 days contains 43,200 minutes. An error budget of 0.1% (100% - 99.9%) equals exactly 43.2 minutes of permitted unreliability per 30-day window.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In PromQL, what function and syntax computes the 99th percentile (p99) request latency across microservices from cumulative histogram bucket metrics?",
      options: [
        "histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))",
        "p99(http_requests_total)",
        "avg(http_latency) > 0.99",
        "max_over_time(latency[5m])"
      ],
      correct_option_index: 0,
      explanation: "histogram_quantile(0.99, sum(rate(..._bucket[5m])) by (le, ...)) uses cumulative 'le' buckets to calculate linear percentile approximations in PromQL.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In context propagation across microservices, what standardized HTTP header defined by the W3C Trace Context specification carries the distributed trace and parent span identifiers?",
      options: [
        "X-Custom-Header",
        "Authorization: Bearer",
        "traceparent (e.g. 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01)",
        "Content-Type: application/json"
      ],
      correct_option_index: 2,
      explanation: "The W3C traceparent header encodes the version, 16-byte trace ID, 8-byte parent span ID, and trace flags in a standard format across distributed systems.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In modern continuous profiling systems (such as Parca or Pyroscope), how does eBPF capture full-system CPU call stacks with under 1% overhead?",
      options: [
        "By modifying application source code manually",
        "An in-kernel eBPF probe samples CPU instruction pointers and unwinds user/kernel stack frames at fixed timer frequencies (e.g. 100 Hz), generating hierarchical Flame Graphs without application restarts",
        "By taking complete physical RAM dumps every second",
        "By halting the operating system during profiling"
      ],
      correct_option_index: 1,
      explanation: "eBPF timer probes unwind kernel and user-space stacks directly in kernel space with minimal overhead, aggregating stack samples into interactive Flame Graphs.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In Google SRE Burn Rate calculations, what does a Burn Rate of 14.4 signify regarding a 30-day Error Budget?",
      options: [
        "The service is consuming the entire 30-day error budget in exactly 2 days (burning 5% of the total monthly error budget in a single hour)",
        "The server CPU is 14.4% busy",
        "The error budget will last for 14.4 years",
        "14.4 servers have crashed"
      ],
      correct_option_index: 0,
      explanation: "A burn rate of 14.4 burns through 100% of a 30-day budget in 2 days (30 / 14.4 = 2.08 days), representing a 5% budget consumption in 1 hour (mandating an immediate page).",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #31.");
  console.log("Skill #31 update completed successfully!");
}

run();
