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

const skillId = "deeeda6d-f226-4fc6-b6f3-ac6a8a35a9ca";

async function run() {
  console.log("Updating Skill #64: Data Pipeline Orchestration (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Airflow Architecture, Schedulers and Distributed Executors" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Modern DAG Authoring, TaskFlow API and Asset-Centric Dagster" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Production Operations, Dataset Triggers and CI/CD Governance" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Airflow PMC & Data Platform Architect level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Airflow Core Anatomy: Scheduler, Webserver, Metastore and Triggerer",
      order_index: 1,
      content: `### Distributed Orchestration Architecture and Core Daemons

1. Airflow Scheduler:
   - Multiprocess daemon continuously parsing the DAG folder, evaluating upstream task dependency states, and queuing ready TaskInstances for execution.

2. Metastore Database (PostgreSQL / MySQL):
   - Central repository storing DAG definitions, run history, task instance states, connection credentials, and XCom payloads.

3. Webserver UI:
   - Flask/React interface providing DAG dependency graphs, Gantt execution timelines, task logs, and manual trigger controls.

4. Triggerer Daemon (Asyncio Event Loop):
   - Dedicated high-concurrency daemon managing thousands of deferred tasks and asynchronous sensors over a non-blocking event loop, freeing worker slots completely during long waits.`
    },
    {
      track_id: track1Id,
      title: "Executor Topologies: Celery, Kubernetes and CeleryKubernetes",
      order_index: 2,
      content: `### Distributed Worker Sizing and Containerized Isolation

1. CeleryExecutor:
   - Distributes task instances across a static pool of long-running worker nodes via Celery message queues (Redis or RabbitMQ).
   - Strengths: High throughput and instant task pickup for short, frequent tasks.

2. KubernetesExecutor:
   - Dynamically creates a dedicated, isolated Kubernetes Pod for every individual TaskInstance, terminating the pod upon task completion.
   - Strengths: Absolute dependency isolation (each task uses custom Docker images), granular CPU/GPU resource allocation, and zero idle worker resource waste.

3. CeleryKubernetesExecutor (CKE):
   - Hybrid executor routing lightweight SQL and API tasks to Celery workers while routing heavy GPU, ML, or Spark workloads to dynamically spun Kubernetes pods.`
    },
    {
      track_id: track1Id,
      title: "Sensors, Deferrable Operators and Worker Starvation",
      order_index: 3,
      content: `### Non-Blocking Sensor Topologies and Slot Management

1. Sensor Execution Modes:
   - \`mode="poke"\`: Retains worker slot continuously while sleeping between interval checks; rapidly exhausts worker pool slots when multiple sensors run concurrently (Worker Starvation).
   - \`mode="reschedule"\`: Releases worker slot after each check and goes to sleep, requeueing only when the next evaluation interval arrives.

2. Deferrable (Async) Operators:
   - Replaces blocking operators by yielding an async trigger to the Airflow Triggerer daemon.
   - Worker slot is instantly freed until an external event (e.g. S3 file arrival or Databricks job completion) fires, allowing 1 worker to coordinate thousands of concurrent external jobs.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The TaskFlow API, Decorators and XCom Object Storage",
      order_index: 1,
      content: `### Functional Pythonic DAGs and Cross-Task Communication

1. TaskFlow API (\`@dag\` and \`@task\`):
   - Modern functional syntax replacing classic boilerplate operators:
\`\`\`python
from airflow.decorators import dag, task
from datetime import datetime

@dag(schedule="@daily", start_date=datetime(2026, 1, 1), catchup=False)
def etl_pipeline():
    @task
    def extract() -> dict:
        return {"orders": [101, 102, 103]}

    @task
    def transform(data: dict) -> list:
        return [x * 2 for x in data["orders"]]

    @task
    def load(transformed: list):
        print(f"Loaded {len(transformed)} records")

    load(transform(extract()))

etl_pipeline()
\`\`\`

2. Custom XCom Object Storage Backends:
   - Metastore XCom is restricted to small payloads (<48KB).
   - Custom backends automatically serialize large DataFrames to Parquet on Amazon S3 or Google Cloud Storage, passing only secure URI pointers between tasks.`
    },
    {
      track_id: track2Id,
      title: "Dynamic Task Mapping and Parameterized Fan-Out DAGs",
      order_index: 2,
      content: `### Runtime Elasticity and Dynamic DAG Fan-Out

1. Dynamic Task Mapping (\`.expand()\` and \`.partial()\`):
   - Dynamically spawns parallel task instances at runtime based on the output array length of an upstream task:
\`\`\`python
@task
def list_s3_files() -> list:
    return ["file_a.csv", "file_b.csv", "file_c.csv"]

@task
def process_file(filename: str, tenant_id: int):
    print(f"Processing {filename} for tenant {tenant_id}")

files = list_s3_files()
process_file.partial(tenant_id=402).expand(filename=files)
\`\`\`

2. Branching Workflows (\`@task.branch\`):
   - Evaluates runtime conditions, returning the downstream task ID to execute while automatically marking alternative paths as skipped.`
    },
    {
      track_id: track2Id,
      title: "Asset-Centric Orchestration: Dagster and Software-Defined Assets",
      order_index: 3,
      content: `### The Paradigm Shift to Data Asset Orchestration

1. Task-Centric vs Asset-Centric Orchestration:
   - Task-Centric (Airflow): Focuses on executing tasks (actions) in sequence.
   - Asset-Centric (Dagster): Focuses on the data assets (tables, models, reports) produced, their upstream dependencies, and their freshness guarantees.

2. Software-Defined Assets (\`@asset\`):
   - Unifies code, compute, and data definitions into declarative assets:
\`\`\`python
from dagster import asset

@asset
def raw_orders():
    return fetch_orders()

@asset
def clean_orders(raw_orders):
    return clean(raw_orders)
\`\`\`
   - Enables automated cross-asset lineage mapping, partitioned backfills, and declarative freshness policies.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Temporal Execution Models: Logical Date, Intervals and Catchup",
      order_index: 1,
      content: `### Deterministic Time Execution and Backfilling

1. Temporal Semantics in Airflow:
   - \`logical_date\` (formerly \`execution_date\`): Represents the start of the data interval being processed, NOT the current wall-clock trigger time.
   - \`data_interval_start\` and \`data_interval_end\`: Defines the exact temporal boundaries of data being processed in the run.

2. Backfilling and Catchup:
   - \`catchup=True\`: Scheduler automatically evaluates and runs all historical intervals between \`start_date\` and current time.
   - \`catchup=False\`: Disables automatic backfill, executing only the most recent scheduled interval.
   - CLI Backfilling: \`airflow dags backfill -s 2026-01-01 -e 2026-01-31 dag_id\` re-executes historical intervals deterministically.`
    },
    {
      track_id: track3Id,
      title: "Cross-DAG Dependencies, Dataset Triggers and Sensors",
      order_index: 2,
      content: `### Inter-DAG Coordination and Data-Driven Scheduling

1. Dataset-Driven Scheduling (Airflow 2.4+):
   - Decouples cron schedules by establishing data-driven trigger dependencies:
\`\`\`python
from airflow.datasets import Dataset

orders_dataset = Dataset("s3://lakehouse/orders.parquet")

# Producer DAG
@task(outlets=[orders_dataset])
def write_orders():
    write_to_s3()

# Consumer DAG
@dag(schedule=[orders_dataset], start_date=datetime(2026, 1, 1))
def downstream_reporting():
    ...
\`\`\`
   - Downstream DAG triggers automatically the instant all required datasets are updated.

2. \`ExternalTaskSensor\`:
   - Polls execution status of specific tasks in upstream DAGs across execution intervals.`
    },
    {
      track_id: track3Id,
      title: "Production Resilience: Alerts, Git-Sync and CI/CD Testing",
      order_index: 3,
      content: `### Enterprise Orchestration Governance and Continuous Deployment

1. Production Alerting and Failure Callbacks:
   - Configuring \`on_failure_callback\` and \`sla_miss_callback\` to send structured JSON incident alerts directly to Slack, PagerDuty, or Datadog with direct links to task logs.

2. Git-Sync Sidecar Deployment:
   - Kubernetes sidecar container polls the Git DAG repository every 30 seconds, automatically updating DAG files on worker pods without requiring Airflow container rebuilds or cluster downtime.

3. CI/CD Automated Testing:
   - Automated Pytest suites verifying DAG integrity before production deployment:
\`\`\`python
from airflow.models import DagBag

def test_dagbag_no_errors():
    dagbag = DagBag(dag_folder="./dags", include_examples=False)
    assert len(dagbag.import_errors) == 0, f"DAG import errors: {dagbag.import_errors}"
\`\`\``
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #64.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In Apache Airflow architecture, what daemon manages asynchronous tasks and non-blocking sensors over an event loop without consuming worker slots?",
      options: [
        "Webserver",
        "Triggerer Daemon",
        "Metastore",
        "Worker pool"
      ],
      correct_option_index: 1,
      explanation: "The Triggerer daemon uses an Asyncio event loop to handle deferred operators and async sensors without occupying worker execution slots.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In Airflow executor topologies, what is the primary operational advantage of the 'KubernetesExecutor'?",
      options: [
        "It eliminates the need for a database",
        "It converts Python code into JavaScript",
        "It only runs on weekends",
        "It dynamically spins up a dedicated, isolated Kubernetes pod for every individual task instance, providing complete dependency isolation and zero idle worker waste"
      ],
      correct_option_index: 3,
      explanation: "KubernetesExecutor launches an ephemeral pod per task with custom images and resources, terminating the pod upon completion.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In Airflow 2.0+, what feature allows writing functional, Pythonic DAGs using '@dag' and '@task' decorators while passing data smoothly between tasks?",
      options: [
        "TaskFlow API",
        "Cron syntax",
        "Bash scripting",
        "HTML templates"
      ],
      correct_option_index: 0,
      explanation: "The TaskFlow API simplifies DAG authoring through @dag and @task decorators, automating XCom passing under the hood.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In Airflow sensor configuration, why should 'mode=\"reschedule\"' be chosen over 'mode=\"poke\"' for sensors with long check intervals?",
      options: [
        "mode='poke' deletes the database",
        "mode='reschedule' makes sensors check every millisecond",
        "mode='reschedule' releases the worker slot between checks and re-queues when due, preventing worker slot starvation across the cluster",
        "There is no difference in execution"
      ],
      correct_option_index: 2,
      explanation: "mode='reschedule' yields the worker slot while waiting, preventing sensors from blocking other active tasks.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In Airflow 2.4+, what scheduling mechanism triggers downstream DAGs automatically whenever specific producer tasks update a shared data asset (e.g. Dataset('s3://lake/orders.parquet'))?",
      options: [
        "Random guessing",
        "Dataset-Driven Scheduling (Data-Aware Scheduling)",
        "Static daily cron schedule",
        "Manual email notification"
      ],
      correct_option_index: 1,
      explanation: "Dataset-driven scheduling triggers consumer DAGs automatically when producer tasks commit updates to specified Datasets.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In Airflow Dynamic Task Mapping, what methods allow generating a variable number of task instances at runtime based on upstream list outputs?",
      options: [
        ".map() and .reduce()",
        ".split() and .join()",
        ".expand() and .partial()",
        ".append() and .extend()"
      ],
      correct_option_index: 2,
      explanation: ".expand() maps over a dynamic list from an upstream task while .partial() supplies static shared parameters.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Airflow temporal semantics, what does 'logical_date' (formerly execution_date) represent?",
      options: [
        "The start of the data interval window being processed by the run, rather than the wall-clock time when the scheduler triggered the task",
        "The date the server was manufactured",
        "The date the user logged into Airflow",
        "The date the DAG file was created"
      ],
      correct_option_index: 0,
      explanation: "logical_date specifies the beginning of the data interval processed by the DAG run, ensuring deterministic, idempotent executions.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In data pipeline orchestration, what is the fundamental conceptual difference between Dagster and Apache Airflow?",
      options: [
        "Airflow only runs on Windows; Dagster only runs on macOS",
        "Dagster does not use Python",
        "Airflow does not support databases",
        "Airflow is task-centric (orchestrating execution steps), whereas Dagster is asset-centric (Software-Defined Assets focusing on data products and their lineage/freshness)"
      ],
      correct_option_index: 3,
      explanation: "Dagster structures workflows around Software-Defined Assets and data lineage rather than sequential task execution steps.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "How does a 'Git-Sync' sidecar container streamline Airflow deployments in production Kubernetes clusters?",
      options: [
        "It sends daily email summaries to developers",
        "It continuously polls the Git repository and pulls updated DAG files directly into worker pods every few seconds with zero container rebuilds or service restarts",
        "It deletes all old Git commits",
        "It compiles Python into C++"
      ],
      correct_option_index: 1,
      explanation: "Git-sync sidecars synchronize DAG files from Git repositories in real time, updating tasks without cluster restarts.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In Airflow XCom management, why are Custom XCom Object Storage Backends (e.g. storing to S3 or GCS) necessary for large data pipelines?",
      options: [
        "Metastore XCom is written in assembly",
        "Airflow metastore cannot store numbers",
        "Airflow metastore database columns are limited to small payloads (<48KB); custom backends store large dataframes on cloud object storage, passing only URI pointers in metadata",
        "Cloud storage is free"
      ],
      correct_option_index: 2,
      explanation: "Metastore XComs are limited in size; custom backends offload large artifacts to object storage, passing lightweight URIs.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In continuous integration (CI) for Airflow DAGs, what automated test should run on every pull request to prevent broken DAGs from reaching production?",
      options: [
        "A Pytest asserting dagbag.import_errors == {} to catch syntax errors, missing imports, circular dependencies, and DAG parsing exceptions before deployment",
        "Testing the physical server temperature",
        "Checking if GitHub is online",
        "Manually triggering 100 DAGs"
      ],
      correct_option_index: 0,
      explanation: "Instantiating a DagBag in Pytest asserts zero import errors, catching broken imports and syntax issues in CI before merge.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Airflow hybrid executor architectures, when is the 'CeleryKubernetesExecutor' (CKE) the optimal infrastructure choice?",
      options: [
        "When running Airflow on a laptop",
        "When all tasks take less than 1 second",
        "When only using Bash operators",
        "When a platform runs thousands of rapid lightweight SQL/API tasks alongside heavy, resource-intensive GPU or Spark compute tasks requiring isolated pod scaling"
      ],
      correct_option_index: 3,
      explanation: "CKE routes high-volume small tasks to static Celery workers while offloading heavy resource-intensive jobs to dynamic Kubernetes pods.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "How do 'Deferrable Operators' in Airflow 2.2+ achieve extreme scalability when managing long-running external cloud jobs (e.g. AWS EMR or Snowflake queries)?",
      options: [
        "By running jobs 10 times faster",
        "They yield an asynchronous Trigger to the Triggerer daemon and immediately free the worker execution slot, reclaiming worker capacity until the external job completes",
        "By converting cloud jobs to local Python scripts",
        "By running without internet connectivity"
      ],
      correct_option_index: 1,
      explanation: "Deferrable operators suspend and hand off polling to the Asyncio Triggerer, liberating worker slots during hours of external job execution.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Airflow DAG configuration, what is the operational effect of setting 'catchup=False' on a DAG with start_date set to 6 months ago?",
      options: [
        "The DAG will run 180 times in parallel",
        "The DAG will fail to load",
        "The scheduler skips all 6 months of historical intervals and executes only the single most recent scheduled interval",
        "The DAG is deleted from the server"
      ],
      correct_option_index: 2,
      explanation: "Setting catchup=False instructs the scheduler not to backfill past historical runs, starting execution only from the latest interval.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In Software-Defined Assets (Dagster), how do 'Partition Definitions' enable robust incremental processing and backfills?",
      options: [
        "They explicitly segment an asset into discrete slices (e.g. daily, hourly, or by customer ID), allowing Dagster to track materialized status per partition and backfill failed slices independently",
        "They partition hard drives into separate operating systems",
        "They encrypt each data column with a separate key",
        "They delete all data older than 7 days"
      ],
      correct_option_index: 0,
      explanation: "Partition definitions in Dagster track asset state per partition slice, allowing pinpoint recomputation and incremental tracking.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #64.");
  console.log("Skill #64 update completed successfully!");
}

run();
