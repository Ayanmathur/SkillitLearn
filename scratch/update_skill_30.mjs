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

const skillId = "d279fd30-cca2-43b2-9244-7d4e63f6a0b2";

async function run() {
  console.log("Updating Skill #30: Automation & Scripting (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Advanced Bash Engineering, Process Traps and Text Stream Engines" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Python Systems Automation, Concurrency and Cloud SDKs" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Go Systems Tooling, Ansible Idempotency and CI/CD Automation" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Production Bash Shell Engineering: Strict Mode, Subshells and Expansion",
      order_index: 1,
      content: `### Hardened Bash Shell Scripting Architecture

Enterprise shell scripts must adhere to strict defensive programming standards:

1. Unofficial Bash Strict Mode:
\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\\n\\t'
\`\`\`
   - \`set -e\`: Halts script execution immediately if any command exits with a non-zero status.
   - \`set -u\`: Treats uninitialized variables as fatal errors, preventing catastrophic bugs like \`rm -rf \${DIRECTORY}/\` when \`DIRECTORY\` is undefined.
   - \`set -o pipefail\`: Ensures a pipeline exit status reflects the rightmost non-zero exit code, preventing hidden errors in chained commands (\`cmd1 | cmd2\`).
   - \`IFS=$'\\n\\t'\`: Hardens the Internal Field Separator to prevent word-splitting on spaces.

2. Advanced Parameter Expansion:
   - Default Values: \`\${VAR:-default}\` (use default if unset), \`\${VAR:=default}\` (assign default if unset).
   - Validation: \`\${VAR:?error message}\` (abort if unset).
   - Substring & Pattern Stripping: \`\${FILENAME%.*}\` (strips shortest match from end; removes file extension); \`\${PATH##*/}\` (strips longest match from beginning; extracts basename).

3. Subshells and Process Substitution:
   - Subshell Execution (\`( cd /tmp && ./build.sh )\`) executes in an isolated forked process without modifying the parent shell working directory or environment variables.
   - Process Substitution (\`diff <(sort file1) <(sort file2)\`) streams command outputs as file descriptors without creating temporary files.`
    },
    {
      track_id: track1Id,
      title: "Signal Trapping, File Locking (flock) and Graceful Teardown",
      order_index: 2,
      content: `### Signal Handling and Atomic Concurrency Controls

1. POSIX Signal Traps in Shell:
   - Registering cleanup handlers using the \`trap\` builtin:
\`\`\`bash
TEMP_DIR=$(mktemp -d)
cleanup() {
  local exit_code=$?
  rm -rf "\${TEMP_DIR}"
  exit \${exit_code}
}
trap cleanup EXIT INT TERM HUP
\`\`\`
   - The \`EXIT\` pseudo-signal guarantees the cleanup function executes regardless of whether the script completes successfully, encounters a fatal error, or is terminated by \`SIGINT\` (Ctrl+C) or \`SIGTERM\`.

2. Preventing Overlapping Execution via Kernel File Locks (\`flock\`):
   - Overlapping cron executions cause race conditions and resource exhaustion.
   - Atomic Mutex Locking with \`flock\`:
\`\`\`bash
exec 200>/var/lock/my-script.lock
flock -n 200 || { echo "Script is already running; exiting." >&2; exit 1; }
\`\`\`
   - Uses the Linux kernel \`flock()\` system call on file descriptor 200. The non-blocking \`flock -n\` instantly aborts if another process holds the lock; the lock is released automatically by the kernel when the process terminates.`
    },
    {
      track_id: track1Id,
      title: "Text Processing Engines: AWK, Sed and jq Data Transformations",
      order_index: 3,
      content: `### High-Performance Text and Stream Parsing

1. Stream Editing with \`sed\`:
   - Non-interactive stream editor executing address-based transformations.
   - Regex replacement: \`sed -i.bak -E 's/(port=)[0-9]+/\\18080/g' config.ini\`.
   - Address ranges: \`sed -n '/START_MARKER/,/END_MARKER/p' /var/log/app.log\`.

2. The AWK Data Processing Language:
   - Columnar data processor with associative arrays, field delimiters (\`FS\`, \`OFS\`), and built-in floating-point math:
\`\`\`awk
awk -F',' '$3 == "ERROR" { counts[$2]++ } END { for (ip in counts) print ip, counts[ip] }' access.log
\`\`\`
   - Evaluates gigabyte-scale structured log files in seconds with minimal RAM overhead.

3. Structured JSON Processing with \`jq\`:
   - Parsing nested JSON payloads from cloud REST APIs:
     - Slicing and Filtering: \`jq '.Reservations[].Instances[] | select(.State.Name=="running") | {id: .InstanceId, type: .InstanceType}'\`.
     - Transformation: Transforming array objects into key-value maps (\`jq 'map({(.Key): .Value}) | add'\`).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Python Systems Automation: Subprocess, OS Primitives and Logging",
      order_index: 1,
      content: `### Robust Systems Programming with Modern Python

1. The \`subprocess\` Subsystem:
   - Executing operating system commands defensively:
\`\`\`python
import subprocess

result = subprocess.run(
    ["systemctl", "status", "nginx"],
    capture_output=True,
    text=True,
    check=True,
    timeout=10
)
\`\`\`
   - Using explicit argument lists (avoiding \`shell=True\`) prevents shell injection vulnerabilities.
   - \`check=True\` automatically raises \`CalledProcessError\` on non-zero exit codes.

2. Modern OS and Filesystem Primitives:
   - \`pathlib.Path\`: Object-oriented filesystem paths (\`Path('/var/log').glob('*.log')\`).
   - Signal handling via \`signal.signal(signal.SIGTERM, sig_handler)\` for graceful container shutdown.

3. Production SRE Logging:
   - Structured JSON logging: Emitting structured key-value log entries with timestamp, severity level, execution context, and error stack traces formatted for ingestion into Elasticsearch or Loki.`
    },
    {
      track_id: track2Id,
      title: "Concurrency Models: Asyncio, Multiprocessing and Threading",
      order_index: 2,
      content: `### Python Concurrency Mechanics and the Global Interpreter Lock (GIL)

1. The Global Interpreter Lock (GIL):
   - A mutex mechanism preventing multiple native threads from executing Python bytecodes simultaneously in CPython.

2. Selecting the Optimal Concurrency Model:
   - Threading (\`concurrent.futures.ThreadPoolExecutor\`):
     - Preemptive multitasking. Ideal for I/O-bound tasks (e.g. downloading files, querying databases) where threads spend most of their time waiting on socket I/O, releasing the GIL during network waits.
   - Multiprocessing (\`concurrent.futures.ProcessPoolExecutor\`):
     - Bypasses the GIL by spawning independent Python processes with isolated memory spaces. Ideal for CPU-intensive data analysis and cryptography. Requires IPC data serialization (pickle).
   - Asynchronous Event Loops (\`asyncio\`):
     - Single-threaded cooperative multitasking using \`async\` and \`await\`. Capable of handling 50,000+ concurrent network connections (via \`aiohttp\` / \`httpx\`) with minimal memory overhead and zero thread context-switching penalties.`
    },
    {
      track_id: track2Id,
      title: "Cloud SDK Automation: Boto3, Paginators and Jitter Backoff",
      order_index: 3,
      content: `### Enterprise Cloud Automation with AWS Boto3 and Python

1. Boto3 Architecture:
   - Client API (Low-level 1:1 service mapping returning raw dictionaries) vs Resource API (High-level object-oriented abstraction).

2. Memory-Safe Traversal with Paginators:
   - Standard API calls return truncated result pages (typically 50-100 items).
   - Paginator Mechanics:
\`\`\`python
paginator = s3_client.get_paginator('list_objects_v2')
for page in paginator.paginate(Bucket='my-bucket'):
    for obj in page.get('Contents', []):
        process_object(obj['Key'])
\`\`\`
   - Lazily fetches next pages automatically, allowing millions of cloud resources to be audited without memory exhaustion.

3. Waiters and Exponential Backoff with Jitter:
   - Programmatic polling: \`ec2_client.get_waiter('instance_status_ok').wait(InstanceIds=[instance_id])\`.
   - Incorporating full jitter backoff into custom API retry loops to prevent throttling exceptions during mass provisioning.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Go Systems Tooling: Goroutines, Channels and CLI Engineering",
      order_index: 1,
      content: `### Systems Programming with Go for Infrastructure Engineers

Go is the foundational language of modern cloud infrastructure (Kubernetes, Docker, Terraform, Prometheus):

1. Key Architectural Advantages:
   - Static single binary compilation with zero runtime dependencies; cross-compiles across architectures via \`GOOS=linux GOARCH=arm64 go build\`.
   - Sub-millisecond startup times and tiny 10 MB memory footprints.

2. Go Concurrency Primitives:
   - Goroutines: Ultra-lightweight user-space green threads starting with only 2 KB stack allocation (compared to 2 MB for an OS thread), multiplexed across OS threads via the Go runtime M:N scheduler.
   - Channels and Synchronization:
     - Unbuffered vs Buffered Channels: Communicating sequential processes (\`ch <- data\`).
     - \`select\` Statements: Multiplexing channel events with timeout channels (\`time.After\`).
     - \`sync.WaitGroup\` and \`sync.Mutex\`: Coordinating worker pools and protecting shared memory.
   - Context Cancellation (\`context.Context\`): Propagating deadlines, cancellation signals, and request-scoped values across goroutine call trees.

3. Enterprise CLI Development with Cobra:
   - Building enterprise CLI utilities with subcommands, typed flags, and Viper environment variable bindings.`
    },
    {
      track_id: track3Id,
      title: "Configuration Management: Ansible Idempotency and Custom Modules",
      order_index: 2,
      content: `### Agentless Configuration Management and Idempotency

1. Ansible Architecture:
   - Agentless Architecture: Executes remotely over standard OpenSSH using target machine Python runtimes without installing background daemons.
   - Dynamic Inventories: Programmatically discovering infrastructure instances from AWS, Azure, or Kubernetes APIs.

2. Writing Idempotent Playbooks and Roles:
   - Idempotency Principle: Executing an Ansible playbook against an already-configured server results in \`changed=0\`.
   - Using state-enforcing modules (\`ansible.builtin.template\`, \`ansible.builtin.package\`, \`ansible.builtin.systemd\`) instead of raw \`command\` or \`shell\` tasks.
   - Jinja2 Dynamic Templating: Dynamically rendering complex service configuration files (\`nginx.conf.j2\`) using host variables and facts.

3. Developing Custom Ansible Modules:
   - Writing custom Python modules extending the \`AnsibleModule\` class to manage proprietary internal APIs with structured JSON input/output.`
    },
    {
      track_id: track3Id,
      title: "Automated CI/CD Pipelines: GitHub Actions and Self-Healing",
      order_index: 3,
      content: `### Automated CI/CD Orchestration and Event-Driven Self-Healing

1. Production CI/CD Pipeline Architecture:
   - Multi-Stage Workflow Stages: Code Linting -> Static Security Analysis (SAST) -> Unit Testing -> Container Build -> Staging Deployment -> Integration Testing -> Canary Production Rollout.
   - Reusable Workflows and Composite Actions: Standardizing pipeline logic across hundreds of microservice repositories.
   - Self-Hosted Runner Auto-Scaling: Leveraging Actions Runner Controller (ARC) to dynamically scale ephemeral runner pods on Kubernetes based on workflow queue depth.

2. Event-Driven Self-Healing Runbooks:
   - Connecting Observability to Automated Remediation:
     - Alertmanager triggers a webhook when a service experiences high error rates or disk space exhaustion.
     - The webhook invokes an automated serverless workflow or Ansible automation controller.
     - The remediation script executes automated diagnosis, captures heap/thread dumps for post-mortem analysis, expands EBS volume capacity, and restarts unhealthy pods within 30 seconds of alert creation.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #30.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In Bash shell scripting, what setting inside 'set -euo pipefail' ensures that a pipeline command fails if ANY command in the pipeline returns a non-zero exit code?",
      options: [
        "set -o pipefail",
        "set -e",
        "set -u",
        "IFS"
      ],
      correct_option_index: 0,
      explanation: "set -o pipefail sets the pipeline return status to the rightmost non-zero exit code, preventing hidden failures in piped commands.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What Linux utility provides atomic file locking on dedicated file descriptors to prevent overlapping cron job executions of the same script?",
      options: [
        "chmod",
        "tar",
        "flock",
        "grep"
      ],
      correct_option_index: 2,
      explanation: "flock uses the Linux kernel flock() system call to acquire an exclusive lock, safely preventing overlapping script executions.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In Python systems automation, what argument to 'subprocess.run' ensures that non-zero exit codes automatically raise a CalledProcessError exception?",
      options: [
        "shell=True",
        "check=True",
        "text=False",
        "timeout=0"
      ],
      correct_option_index: 1,
      explanation: "Passing check=True causes subprocess.run to raise a CalledProcessError if the executed command returns a non-zero exit status.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What ultra-lightweight user-space concurrency primitive in Go starts with only a 2 KB stack allocation and is multiplexed across OS threads by the Go runtime?",
      options: [
        "Java Thread",
        "Linux Process",
        "Operating System Kernel",
        "Goroutine"
      ],
      correct_option_index: 3,
      explanation: "Goroutines are lightweight user-space green threads starting with a tiny 2 KB stack, allowing hundreds of thousands to run concurrently.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In Ansible configuration management, what architectural property describes a playbook that can be executed 100 times against a server while producing zero unwanted modifications (changed=0)?",
      options: [
        "Idempotency",
        "Asynchrony",
        "Inheritance",
        "Polymorphism"
      ],
      correct_option_index: 0,
      explanation: "Idempotency ensures that applying an Ansible playbook repeatedly maintains the desired end state without unintended duplicate modifications.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In Bash signal handling, why is trapping the 'EXIT' pseudo-signal superior to trapping individual signals like SIGINT or SIGTERM?",
      options: [
        "EXIT makes scripts run twice as fast",
        "EXIT deletes the operating system",
        "EXIT only works on Apple macOS",
        "The EXIT trap is guaranteed to execute when the script exits under ANY circumstance (normal completion, error exit, or caught signal), ensuring reliable cleanup"
      ],
      correct_option_index: 3,
      explanation: "The EXIT trap handler executes whenever the shell script terminates for any reason, guaranteeing cleanup of temporary files and locks.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Python concurrency, what is the Global Interpreter Lock (GIL) and what type of workload can bypass its execution limitations using multiprocessing?",
      options: [
        "A hardware lock on the CPU fan",
        "A mutex mechanism in CPython preventing multiple threads from executing Python bytecodes simultaneously; CPU-bound workloads bypass the GIL by spawning separate processes",
        "A network firewall rule",
        "A database encryption key"
      ],
      correct_option_index: 1,
      explanation: "The GIL serializes thread execution in CPython. Multiprocessing spawns separate Python processes with isolated memory spaces, bypassing the GIL for CPU-bound tasks.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In AWS Boto3 automation, why are 'Paginators' essential when listing millions of S3 objects or EC2 instances in an enterprise account?",
      options: [
        "They lazily fetch subsequent result pages automatically as generators, traversing massive cloud inventories without exhausting application memory",
        "They translate Python into JavaScript",
        "They make all S3 objects publicly readable",
        "They encrypt the entire cloud account"
      ],
      correct_option_index: 0,
      explanation: "Paginators iterate across truncated API result pages automatically, enabling memory-safe traversal of massive multi-page cloud inventories.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In command-line text processing, what command uses associative arrays and columnar delimiters to aggregate error counts by IP address from a server log?",
      options: [
        "ls -la",
        "cat /etc/passwd",
        "awk -F',' '$3 == \"ERROR\" { counts[$2]++ } END { for (ip in counts) print ip, counts[ip] }'",
        "rm -rf /var/log"
      ],
      correct_option_index: 2,
      explanation: "AWK evaluates columnar fields and aggregates counts in associative arrays, printing the aggregated summary in the END block.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What Go package framework is the industry standard for constructing robust command-line tools (such as kubectl and hugo) with POSIX-compliant flags and subcommands?",
      options: [
        "Express.js",
        "Django",
        "Spring Boot",
        "Cobra (spf13/cobra)"
      ],
      correct_option_index: 3,
      explanation: "Cobra is the standard Go CLI framework powering Kubernetes (kubectl), Hugo, and GitHub CLI, providing subcommands and flag parsing.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In advanced Bash parameter expansion, what does the expression '${FILENAME%.*}' evaluate to?",
      options: [
        "It deletes the entire file from disk",
        "It strips the shortest matching pattern from the end of the variable, effectively removing the file extension",
        "It converts the filename to uppercase",
        "It prints the file permissions"
      ],
      correct_option_index: 1,
      explanation: "The % operator strips the shortest matching pattern from the trailing end of a string, commonly used to strip file extensions.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "How does Python's 'asyncio' event loop manage tens of thousands of concurrent network connections with minimal memory footprint compared to multi-threading?",
      options: [
        "By spawning 10,000 physical CPU cores",
        "By disabling TCP handshakes",
        "It uses single-threaded cooperative multitasking with async/await, polling I/O event multiplexers (epoll) without allocating 2MB OS thread stacks or context-switch overhead",
        "By writing network packets directly to floppy disks"
      ],
      correct_option_index: 2,
      explanation: "asyncio uses cooperative non-blocking event loops on top of epoll/kqueue, eliminating OS thread stack memory allocations and context switches.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Go concurrency design, what pattern utilizes 'context.Context' with 'select' statements to coordinate graceful shutdown across worker goroutines?",
      options: [
        "Passing a Context to goroutines and listening for '<-ctx.Done()' in a 'select' block to abort in-flight work and release resources when a cancellation signal or timeout fires",
        "Using panic() to crash all goroutines simultaneously",
        "Rebooting the server hardware",
        "Writing infinite while loops in every function"
      ],
      correct_option_index: 0,
      explanation: "context.Context propagates cancellation signals and timeouts across goroutines; checking <-ctx.Done() allows goroutines to exit cleanly.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In enterprise event-driven automation, what mechanism links Prometheus Alertmanager alerts to automated self-healing runbooks?",
      options: [
        "Sending an email to a physical printer",
        "Manually rebooting servers by pulling power cords",
        "Posting a message on Twitter",
        "Alertmanager invokes a webhook endpoint triggering an automated serverless workflow or Ansible controller to diagnose, collect telemetry, and execute remediation scripts automatically"
      ],
      correct_option_index: 3,
      explanation: "Webhook integrations allow Alertmanager alerts to trigger automated serverless scripts or Ansible controllers for instant event-driven remediation.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In Bash process substitution, how does '<(command)' optimize data streaming compared to traditional intermediate temporary files?",
      options: [
        "It prints the output in green text",
        "It connects the command output directly to a named pipe / file descriptor (/dev/fd/X), streaming data directly between processes without writing to physical disk storage",
        "It encrypts the output using RSA-4096",
        "It runs the command on a remote server"
      ],
      correct_option_index: 1,
      explanation: "Process substitution streams command output via an anonymous pipe or /dev/fd/ file descriptor, eliminating disk I/O and temporary file management.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #30.");
  console.log("Skill #30 update completed successfully!");
}

run();
