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

const skillId = "30b50035-3a57-47bd-b338-d5f2305cb174";

async function run() {
  console.log("Updating Skill #24: Infrastructure as Code (9 steps across 3 tracks)...");

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
        title: `Track ${tracks.length + 1}: Infrastructure as Code`,
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
  await supabase.from("tracks").update({ title: "Track 1: IaC Paradigms, Directed Acyclic Graphs and State Engines" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Modular Architecture, Pulumi Multi-Language and Crossplane" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Policy-as-Code, GitOps Pipelines and Drift Remediation" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Declarative vs Imperative Paradigms and Idempotency Mechanics",
      order_index: 1,
      content: `### Mathematical Foundations of Infrastructure as Code

Infrastructure as Code (IaC) applies software engineering rigor to infrastructure provisioning:

1. Declarative vs Imperative Paradigms:
   - Declarative IaC (Terraform, CloudFormation, Bicep, Kubernetes YAML): The engineer specifies the 'Desired End State' of the system; the underlying provisioning engine calculates the difference between current reality and desired state, automatically executing the minimal set of CRUD API calls needed to converge the system.
   - Imperative / Procedural IaC (Ansible, Chef, Shell scripts): The engineer specifies the explicit sequence of execution steps required to configure the machine. Prone to execution order failures if intermediate steps fail.

2. Mathematical Idempotency:
   - An operation is idempotent if executing it multiple times yields the exact same outcome as executing it a single time:
\`\`\`
f(f(x)) = f(x)
\`\`\`
   - In IaC, running a declarative pipeline 100 consecutive times against an unchanged infrastructure results in zero modifications (0 to add, 0 to change, 0 to destroy).

3. Immutable vs Mutable Infrastructure:
   - Mutable (Configuration Drift): Patching live servers in place leads to configuration divergence across machines over time.
   - Immutable Infrastructure: Virtual machine images (AMIs) or containers are never patched in place; updates trigger automated creation of new identical instances followed by decommissioning of old instances (Blue/Green or Canary deployments).`
    },
    {
      track_id: track1Id,
      title: "Terraform & OpenTofu Engine: Directed Acyclic Graphs (DAG)",
      order_index: 2,
      content: `### Core Architecture of the Terraform Graph Engine

HashiCorp Terraform and OpenTofu operate on a dual-component architecture:

1. Core Engine and Provider Plugins:
   - Terraform Core: Parses HashiCorp Configuration Language (HCL2) abstract syntax trees (AST) and manages state files.
   - Provider Plugins: Standalone compiled Go binaries executing independently, communicating with Terraform Core via high-speed gRPC Remote Procedure Calls to interact with cloud vendor APIs.

2. The Directed Acyclic Graph (DAG) Engine:
   - Building the Dependency Graph: Terraform inspects resource references (e.g. \`subnet_id = aws_subnet.main.id\`) to construct a mathematical Directed Acyclic Graph:
     - Vertices: Individual cloud resources, data sources, and provider blocks.
     - Edges: Implicit and explicit (\`depends_on\`) dependency relationships.
   - Parallel Graph Execution: The graph engine performs topological sorting. Resources on independent branches of the graph (e.g. an S3 bucket and an IAM role) are provisioned simultaneously in parallel (up to 10 concurrent threads by default), while strictly serializing dependent nodes (e.g. waiting for VPC creation before subnet provisioning).

3. Lifecycle Execution Phases:
   - \`terraform init\`: Downloads provider plugins and configures remote backend.
   - \`terraform plan\`: Refreshes state, compares desired HCL vs actual state, and generates a speculative execution plan.
   - \`terraform apply\`: Executes the directed acyclic graph across provider gRPC APIs.`
    },
    {
      track_id: track1Id,
      title: "State File Architecture, Remote Backends and State Locking",
      order_index: 3,
      content: `### State Management, Concurrency and Backend Architecture

The state file (\`terraform.tfstate\`) is the single source of truth mapping declarative code to real-world cloud resources:

1. State File Architecture:
   - A structured JSON document mapping user-defined HCL resource addresses (e.g. \`aws_security_group.web\`) to unique cloud provider IDs (\`sg-0a1b2c3d\`), storing complete resource attribute schemas, metadata, and dependencies.

2. Remote State Storage and Distributed Locking:
   - Storing state in local files causes team divergence and exposes plain-text secrets in source control.
   - Production Remote Backends (AWS S3 + DynamoDB / Azure Blob Storage / HashiCorp Cloud):
     - Durable Object Storage: Stores state files with AES-256 server-side encryption and versioning.
     - Distributed State Locking: Uses distributed key-value locks (e.g. DynamoDB LockID table or Azure Blob Leases). When a user or CI/CD runner initiates \`terraform apply\`, a cryptographic mutex lock is acquired; concurrent executions are immediately halted with an error, preventing catastrophic state corruption and race conditions.

3. Advanced State Manipulation Commands:
   - \`terraform import\`: Brings pre-existing unmanaged cloud resources into Terraform state.
   - \`terraform state mv\`: Renames or refactors resources in state without destroying/recreating them.
   - \`terraform state rm\`: Removes an item from state management while leaving the physical cloud resource running.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Terraform Module Architecture, Composition and Dynamic HCL",
      order_index: 1,
      content: `### Enterprise Module Engineering and HCL2 Metaprogramming

Scalable IaC relies on modular component design principles:

1. Modular Architecture Principles:
   - Reusable Child Modules: Encapsulating complex infrastructure patterns (e.g. highly available multi-AZ VPC module) with explicit input variables (\`variables.tf\`), outputs (\`outputs.tf\`), and minimal required provider configurations.
   - Root Module Composition: Calling child modules like software functions, passing dynamic outputs from one module as inputs to another.

2. Advanced HCL2 Metaprogramming:
   - \`for_each\` vs \`count\`:
     - \`count\` assigns numerical array indexes (\`module.web[0]\`, \`module.web[1]\`). Removing an item from the middle of the list causes an index shift, triggering unintended mass destruction and recreation of downstream resources.
     - \`for_each\` uses unique map keys or string sets, ensuring individual resource additions or deletions occur in total isolation without shifting siblings.
   - Dynamic Blocks (\`dynamic "ingress" { for_each = ... }\`): Programmatically generating nested configuration blocks.
   - Lifecycle Meta-Arguments:
     - \`create_before_destroy = true\`: Provisions the replacement resource before tearing down the old one to eliminate downtime.
     - \`prevent_destroy = true\`: Hard safety lock preventing accidental deletion of critical production databases.
     - \`ignore_changes = [tags, capacity]\`: Ignores drift caused by external autoscaling policies.`
    },
    {
      track_id: track2Id,
      title: "Modern Multi-Language IaC: Pulumi and AWS Cloud Development Kit",
      order_index: 2,
      content: `### Programmable Infrastructure in General-Purpose Languages

Multi-language IaC frameworks allow developers to define cloud infrastructure using standard programming languages:

1. Pulumi Multi-Language Architecture:
   - Supports TypeScript, Python, Go, Java, and C#.
   - Execution Mechanics:
     - Language Host (Node.js, Python runtime): Executes user code, evaluating loops, classes, and conditionals to construct a declarative resource graph.
     - Pulumi Deployment Engine: Language-agnostic engine receiving resource definitions via gRPC, managing state convergence and executing provider CRUD operations.
   - Software Engineering Benefits: Full IDE code completion, compile-time static type checking, code reusability via standard package managers (npm, pip, NuGet), and standard unit testing frameworks (Jest, PyTest, Go test).

2. AWS Cloud Development Kit (AWS CDK):
   - Synthesizes object-oriented TypeScript/Python code into raw AWS CloudFormation JSON/YAML templates.
   - Construct Levels:
     - L1 Constructs (CfnResource): Direct 1:1 mapping of raw CloudFormation primitives.
     - L2 Constructs: Curated AWS resources with built-in security best practices, sensible defaults, and helper methods (e.g. \`bucket.grantRead(role)\`).
     - L3 Constructs (Patterns): High-level architectural compositions (e.g. \`ApplicationLoadBalancedFargateService\` spinning up VPC, ALB, ECS cluster, tasks, and DNS records in 10 lines of code).`
    },
    {
      track_id: track2Id,
      title: "Universal Control Planes: Kubernetes CRDs and Crossplane",
      order_index: 3,
      content: `### Continuous Reconciliation Control Planes and Crossplane

Crossplane (a CNCF project) transforms Kubernetes into a universal cloud infrastructure control plane:

1. Continuous Reconciliation vs Static CLI Execution:
   - Traditional IaC runs on a trigger (CLI / CI/CD pipeline); between runs, infrastructure is completely unmonitored.
   - Crossplane leverages Kubernetes Custom Resource Definitions (CRDs) to model external cloud resources (e.g. \`RDSInstance\`, \`S3Bucket\`, \`GCPCloudSQL\`).

2. The Active Reconciliation Loop:
   - The Crossplane Kubernetes Controller continuously queries cloud vendor APIs (e.g. AWS API) at regular intervals (e.g. every 60 seconds).
   - Real-Time Drift Healing: If an unauthorized administrator manually modifies a security group rule via the AWS Web Console, the Crossplane controller detects the state divergence and automatically reverts the security group back to the approved Git-defined state within seconds.

3. Composable Infrastructure Platforms:
   - Platform teams define custom Composite Resource Definitions (XRDs), creating simplified, company-standard infrastructure APIs (e.g. \`MyCompanyDatabase\`) for application developers.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Policy-as-Code: Open Policy Agent (OPA), Rego and Compliance",
      order_index: 1,
      content: `### Shifting Security Left with Policy-as-Code

Policy-as-Code (PaC) enforces security and governance guardrails programmatically before infrastructure is provisioned:

1. Open Policy Agent (OPA) and the Rego Language:
   - A general-purpose declarative policy engine evaluating structured JSON inputs against policy rules.
   - Parsing Terraform Plans: The CI/CD pipeline converts speculative plans into JSON (\`terraform show -json tfplan > plan.json\`) and feeds it to OPA.

2. Typical Rego Policy Guardrails:
   - Mandatory Encryption: Denying creation of any AWS S3 bucket where server-side encryption (\`server_side_encryption_configuration\`) is missing.
   - Network Security: Blocking creation of any security group containing unrestricted inbound CIDR blocks (\`0.0.0.0/0\`) on management ports (SSH port 22, RDP port 3389).
   - Cost and Governance Tagging: Mandating that all resources contain mandatory organizational tags (\`Environment\`, \`Owner\`, \`CostCenter\`).

3. HashiCorp Sentinel and Conftest:
   - Embedded policy enforcement framework supporting Soft-Mandatory (can be overridden by authorized security leads) and Hard-Mandatory (absolute blocking gate in CI/CD pipelines).`
    },
    {
      track_id: track3Id,
      title: "GitOps for Infrastructure: Atlantis, Terraform Cloud and Pipelines",
      order_index: 2,
      content: `### GitOps Automated Infrastructure Delivery

GitOps establishes the Git repository as the single source of truth for all infrastructure definitions:

1. Pull Request Collaborative Workflows (Atlantis / Spacelift):
   - Developer opens a Pull Request (PR) containing modified Terraform code.
   - The GitOps engine automatically runs \`terraform plan\` inside an isolated container and formats the exact resource diff directly as a comment on the PR.
   - Collaborative Peer Review: Senior engineers and security leads review the plan comment; upon approval, a team member posts a comment \`atlantis apply\`.
   - The GitOps runner executes the apply, merges the PR, and locks the branch.

2. Ephemeral Environment Lifecycles:
   - Automated CI/CD pipelines provisioning complete, isolated staging environments per feature branch, executing end-to-end integration tests, and automatically triggering \`terraform destroy\` upon branch merge to eliminate idle cloud costs.`
    },
    {
      track_id: track3Id,
      title: "Continuous Drift Detection, Automated Healing and Secret Zero",
      order_index: 3,
      content: `### Advanced Drift Detection, Remediation and Secret Management

1. Continuous Drift Detection:
   - Automated scheduled CI/CD cron jobs running \`terraform plan -detailed-exitcode\` across all production environments:
     - Exit Code 0: Clean (No drift detected).
     - Exit Code 1: Pipeline error.
     - Exit Code 2: Drift detected (Infrastructure differs from state). Triggers Slack/PagerDuty alerts or automated reconciliation pipelines.

2. Solving the 'Secret Zero' Problem in IaC:
   - Storing static cloud access keys (AWS Access Key ID / Secret Key) in CI/CD pipeline secrets is a major security vulnerability.
   - Modern Standard (OIDC Federation):
     - GitHub Actions / GitLab CI authenticates directly with cloud providers (AWS IAM, Azure AD, GCP Workload Identity) using OpenID Connect (OIDC) tokens.
     - The cloud provider validates the cryptographic JWT token from GitHub and issues short-lived (15-minute) ephemeral STS credentials dynamically, completely eliminating static credentials.

3. Encrypted Secrets in Git:
   - Mozilla SOPS (Secrets OPerationS): Encrypts secret values within YAML/JSON files using cloud KMS keys or age public keys while keeping keys readable for Git diffs.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #24.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "What mathematical property ensures that executing a declarative Infrastructure as Code pipeline 100 consecutive times against an unchanged infrastructure produces zero unintended modifications?",
      options: [
        "Transmutation",
        "Polymorphism",
        "Idempotency (f(f(x)) = f(x))",
        "Asynchrony"
      ],
      correct_option_index: 2,
      explanation: "Idempotency ensures that applying an operation repeatedly produces the exact same end state as applying it once, preventing configuration drift.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What data structure is constructed by the Terraform core engine to analyze resource dependencies and execute parallel resource provisioning across independent graph branches?",
      options: [
        "Directed Acyclic Graph (DAG)",
        "Binary Search Tree",
        "Circular Linked List",
        "Hash Map"
      ],
      correct_option_index: 0,
      explanation: "Terraform builds a Directed Acyclic Graph (DAG) of all resources, allowing independent branches to provision in parallel while serializing dependencies.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In Terraform remote backend architectures, what mechanism is implemented (such as DynamoDB tables or Azure Blob leases) to prevent concurrent executions from corrupting state files?",
      options: [
        "Two-Factor SMS Verification",
        "Manual Email Approvals",
        "File Compression",
        "Distributed State Locking (Mutex Lock)"
      ],
      correct_option_index: 3,
      explanation: "State locking acquires a distributed mutex lock during write operations, halting concurrent executions to prevent state file corruption.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In Terraform HCL2 configuration, why is using 'for_each' with map keys vastly superior to using 'count' with array indices when provisioning multiple similar resources?",
      options: [
        "for_each uses less electricity",
        "Removing an item from the middle of a 'count' array shifts downstream indices, triggering unintended mass destruction and recreation of sibling resources, whereas 'for_each' isolates items by key",
        "count is only supported on Linux",
        "for_each converts code into Python"
      ],
      correct_option_index: 1,
      explanation: "Array index shifts with count cause Terraform to destroy and recreate all downstream resources when an item is removed; for_each tracks items independently by key.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What Policy-as-Code engine uses the declarative 'Rego' query language to evaluate JSON-formatted Terraform plans against security and compliance guardrails before deployment?",
      options: [
        "Ansible Playbook",
        "Docker Engine",
        "Open Policy Agent (OPA)",
        "Apache Web Server"
      ],
      correct_option_index: 2,
      explanation: "Open Policy Agent (OPA) evaluates structured JSON data using Rego policies, enforcing automated security compliance gates in CI/CD pipelines.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "How does Crossplane differ fundamentally from traditional CLI-triggered Terraform in managing cloud infrastructure?",
      options: [
        "Crossplane cannot provision databases",
        "Crossplane runs inside Kubernetes as an active controller that continuously reconciles state against cloud APIs, automatically detecting and healing manual console drift in real time",
        "Crossplane requires zero cloud credentials",
        "Crossplane only supports on-premises physical hardware"
      ],
      correct_option_index: 1,
      explanation: "Crossplane uses continuous Kubernetes reconciliation loops to actively watch and revert configuration drift, whereas traditional Terraform executes only on demand.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In modern CI/CD security, how does OpenID Connect (OIDC) federation eliminate the 'Secret Zero' vulnerability when deploying cloud infrastructure from GitHub Actions?",
      options: [
        "By storing AWS passwords in plain text in the README file",
        "By disabling all cloud authentication checks",
        "By using paper passwords sent through postal mail",
        "GitHub Actions exchanges a cryptographic short-lived JWT token with the cloud provider (AWS IAM / Azure AD), which dynamically issues 15-minute temporary STS credentials without storing static access keys"
      ],
      correct_option_index: 3,
      explanation: "OIDC federation allows CI/CD runners to exchange cryptographic tokens for short-lived temporary cloud credentials, eliminating risky static long-term access keys.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In Terraform state management, what command is used to refactor or rename a resource in HCL code without causing Terraform to destroy and recreate the physical cloud resource?",
      options: [
        "terraform state mv",
        "terraform destroy",
        "terraform init -upgrade",
        "terraform fmt"
      ],
      correct_option_index: 0,
      explanation: "The 'terraform state mv' command updates resource addresses inside the state file, allowing code refactoring without triggering resource recreation.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In AWS Cloud Development Kit (AWS CDK), what level of Construct provides curated AWS resources with built-in security best practices, sensible defaults, and helper IAM grant methods?",
      options: [
        "L0 Constructs (Raw Binary)",
        "L1 Constructs (CfnResource primitives)",
        "L2 Constructs (Curated resources with helper methods)",
        "L5 Constructs (Operating Systems)"
      ],
      correct_option_index: 2,
      explanation: "L2 Constructs wrap CloudFormation primitives with sensible defaults, built-in security guardrails, and programmatic helper methods (e.g. bucket.grantRead).",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What GitOps tool automates Terraform workflows directly within GitHub/GitLab Pull Requests by running speculative plans and applying approved changes via PR comments?",
      options: [
        "Apache Kafka",
        "Atlantis",
        "Elasticsearch",
        "Vim Editor"
      ],
      correct_option_index: 1,
      explanation: "Atlantis is an open-source GitOps automation server that executes terraform plan/apply directly through Pull Request comments and webhooks.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "How does the Pulumi deployment engine execute multi-language Infrastructure as Code programs written in TypeScript, Python, or Go?",
      options: [
        "By compiling code into assembly language and flashing it onto server motherboards",
        "By translating code into bash scripts",
        "By executing commands via SSH on every instance",
        "A language-specific runtime executes user code to construct an in-memory resource graph, then passes declarative resource specs via gRPC to the central Pulumi engine to manage state convergence"
      ],
      correct_option_index: 3,
      explanation: "Pulumi executes code in native language runtimes to build a resource graph, sending definitions over gRPC to a language-neutral engine that handles state and cloud APIs.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In automated CI/CD drift detection pipelines, what exit code from 'terraform plan -detailed-exitcode' indicates that drift has occurred and the real cloud infrastructure differs from state?",
      options: [
        "Exit Code 2 (Drift detected / diff present)",
        "Exit Code 0 (Clean / no diff)",
        "Exit Code 1 (Fatal error)",
        "Exit Code 255"
      ],
      correct_option_index: 0,
      explanation: "The -detailed-exitcode flag returns Exit Code 2 when differences are detected between desired and actual state, allowing CI/CD scripts to trigger drift alerts.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Terraform resource lifecycles, what meta-argument ensures that zero-downtime replacements occur by spinning up the new replacement resource before destroying the old one?",
      options: [
        "ignore_changes = all",
        "prevent_destroy = true",
        "create_before_destroy = true",
        "depends_on = [null]"
      ],
      correct_option_index: 2,
      explanation: "The lifecycle meta-argument 'create_before_destroy = true' forces Terraform to provision the new resource and confirm readiness before destroying the legacy resource.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "What secret management tool allows engineers to commit encrypted secrets (such as API keys) directly into Git repositories while keeping file keys unencrypted for readable Git diffs?",
      options: [
        "Plain Text Notepad",
        "Mozilla SOPS (Secrets OPerationS)",
        "BitTorrent",
        "FTP Server"
      ],
      correct_option_index: 1,
      explanation: "Mozilla SOPS encrypts JSON/YAML values using cloud KMS keys while preserving dictionary keys in plain text, making secret files safe for Git version control.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "What protocol is utilized by Terraform Core to communicate with standalone compiled Provider plugin binaries across process boundaries?",
      options: [
        "gRPC Remote Procedure Calls over localhost",
        "HTTP/1.0 with raw text cookies",
        "RS-232 Serial Port",
        "Email attachments"
      ],
      correct_option_index: 0,
      explanation: "Terraform Core communicates with external Go-compiled provider binaries across process boundaries using high-performance gRPC over localhost.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #24.");
  console.log("Skill #24 update completed successfully!");
}

run();
