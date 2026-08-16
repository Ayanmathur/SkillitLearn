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

const skillId = "b5df79d0-b346-4bf6-803b-515872f271fb";

async function run() {
  console.log("Updating Skill #28: Cost Optimization (9 steps across 3 tracks)...");

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
        title: `Track ${tracks.length + 1}: Cost Optimization`,
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
  await supabase.from("tracks").update({ title: "Track 1: FinOps Framework, Cost Attribution and Tagging Governance" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Compute Optimization, Savings Plans and Spot Orchestration" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Storage Lifecycle Engineering and Network Egress Optimization" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The FinOps Framework: Inform, Optimize, Operate and Unit Economics",
      order_index: 1,
      content: `### Principles of Cloud Financial Operations (FinOps)

FinOps is an operational framework and cultural shift bringing financial accountability to variable cloud spending (FinOps Foundation):

1. The Three Iterative FinOps Phases:
   - Inform: Visibility into real-time cloud expenditures, automated cost allocation, chargeback/showback reports, and anomaly detection.
   - Optimize: Eliminating waste, right-sizing underutilized instances, converting on-demand workloads to Savings Plans/Spot, and optimizing storage tiers.
   - Operate: Continuously evaluating business performance against cloud cost metrics, integrating automated cost guardrails into CI/CD pipelines, and establishing executive accountability.

2. Cloud Unit Economics:
   - Measuring cloud efficiency via business value metrics rather than aggregate gross spending:
     - Examples: Cost Per Monthly Active User (MAU), Cost Per E-Commerce Checkout, Cost Per Streamed Video Hour.
   - Enables engineering and leadership to evaluate whether cloud spending growth represents operational inefficiency or healthy business expansion.`
    },
    {
      track_id: track1Id,
      title: "Enterprise Tagging Taxonomy, Cost Allocation and Anomaly Detection",
      order_index: 2,
      content: `### Cost Attribution, Tagging Governance and Anomaly Detection

1. Enterprise Tagging Taxonomy:
   - Enforcing standardized metadata tags across 100% of cloud resources:
     - Mandatory Tags: \`Environment\` (prod, staging, dev), \`CostCenter\`, \`Owner\` (team email), \`ProjectName\`, \`DataClassification\`.
   - AWS Cost Allocation Tags: Activating user-defined tags in the billing console to enable detailed cost tracking in billing reports.
   - Automated Policy Enforcement: AWS Config rules and Open Policy Agent (OPA) gates denying deployment of resources that lack required cost tags.

2. AWS Cost Categories and Multi-Dimensional Allocation:
   - Grouping accounts, tags, and chargeback rules into customizable organizational hierarchies (e.g. mapping 50 distinct AWS accounts to 4 business units).

3. Machine Learning Cost Anomaly Detection:
   - Continuous background evaluation of historical spending baselines.
   - Automatically detects anomalous spending surges (e.g. runaway Lambda recursive execution loops or unattached NAT gateways) within hours, sending targeted alerts to engineering Slack channels.`
    },
    {
      track_id: track1Id,
      title: "Advanced Billing Analytics: AWS CUR, Athena SQL and Kubecost",
      order_index: 3,
      content: `### Granular Cost Analytics and Container-Level Cost Attribution

1. AWS Cost and Usage Report (CUR):
   - The most comprehensive source of cloud billing data: exports raw Parquet/CSV files to Amazon S3 containing hourly line-item resource consumption, discounts, Savings Plans amortizations, and individual resource IDs.

2. Querying CUR with Amazon Athena:
   - Running distributed SQL queries against S3 billing data to identify:
     - Top 10 costliest individual EC2/RDS resources.
     - Unused EBS volume snapshots and idle elastic IP addresses.
     - Cross-AZ and Internet data transfer egress cost breakdowns per service.

3. Kubernetes Pod Cost Allocation (Kubecost / AWS Cost Allocation for EKS):
   - Traditional cloud billing views a Kubernetes cluster as a single large EC2/VM compute bill.
   - Kubecost inspects container CPU/RAM requests and real-time usage, allocating cluster infrastructure costs accurately down to the individual Kubernetes Namespace, Service, and Pod level.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Compute Pricing Models: On-Demand, Savings Plans and RIs",
      order_index: 1,
      content: `### Strategy for Compute Commitments and Rate Optimization

Optimizing compute costs requires balancing flexible capacity against commitment discounts:

1. The Compute Commitment Hierarchy:
   - On-Demand: 100% flexibility with zero upfront commitment; highest hourly price point (intended for volatile, unpredictable workloads).
   - Compute Savings Plans: Hourly spend commitment (e.g. committing to spend $15/hour on compute for 1 or 3 years). Delivers up to 66% discount; automatically applies across EC2 instances, AWS Fargate containers, and AWS Lambda functions regardless of instance family, operating system, or AWS region.
   - EC2 Instance Savings Plans: Hourly spend commitment tied to a specific instance family in a specific region (e.g. \`c6g\` in \`us-east-1\`). Delivers higher discounts (up to 72%).
   - Standard and Convertible Reserved Instances (RIs).

2. The Optimal 3-Tier Compute Portfolio Strategy:
   - Baseline Load (60-70% of steady-state): Covered by 1-year or 3-year Compute Savings Plans.
   - Predictable Periodic Scale: Handled by Auto Scaling On-Demand instances.
   - Fault-Tolerant Batch / Ephemeral Tasks: Handled by Spot Instances (yielding up to 90% savings).`
    },
    {
      track_id: track2Id,
      title: "Spot Instance Orchestration, Karpenter and Graceful Draining",
      order_index: 2,
      content: `### Enterprise Spot Orchestration and Autonomous Kubernetes Scaling

Spot instances represent unused cloud compute capacity auctioned at up to 90% discounts relative to On-Demand rates, subject to a 2-minute interruption notice:

1. Spot Fleet Diversification Strategies:
   - Price-Capacity-Optimized Strategy: Allocates instances across a wide variety of instance families, sizes, and generations across all Availability Zones, drastically minimizing the probability of simultaneous fleet interruptions.

2. Next-Generation Kubernetes Autoscaling (Karpenter):
   - Bypasses traditional node groups and AWS Auto Scaling Groups (ASGs).
   - Karpenter evaluates pending Pod specifications directly and launches the optimal, most cost-effective Spot instance types within 30 to 45 seconds.

3. Handling Spot Termination Notices:
   - Cloud providers emit a 2-minute termination warning via EventBridge and Instance Metadata Service (\`/latest/meta-data/spot/instance-action\`).
   - Automated Node Termination Handlers immediately cordon the node, drain active pods, and spin up replacement capacity before the physical node is terminated.`
    },
    {
      track_id: track2Id,
      title: "Compute Right-Sizing, Graviton Silicon and Lambda Power Tuning",
      order_index: 3,
      content: `### Hardware Modernization and Serverless Optimization

1. Automated Compute Right-Sizing:
   - AWS Compute Optimizer: Utilizes machine learning models on CloudWatch memory, CPU, and network utilization metrics to recommend optimal instance types, eliminating over-provisioned waste (e.g. downsizing an \`m5.4xlarge\` averaging 4% CPU to an \`m5.large\`).

2. Custom ARM-Based Silicon (AWS Graviton3/Graviton4 / Azure Cobalt):
   - Migrating workloads from x86_64 to ARM64 architecture delivers up to 40% superior price-performance for equivalent compute configurations with 60% lower power consumption.

3. AWS Lambda Power Tuning:
   - Open-source serverless optimization tool running Step Functions to execute a Lambda function across various memory allocations (from 128 MB to 10,240 MB) against real payloads.
   - Mathematical Sweet Spot: Increasing memory from 512 MB to 1,024 MB allocates proportional virtual CPU power, reducing execution time from 2,000 ms to 400 ms, resulting in both faster performance and a lower total financial cost per invocation.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Storage Lifecycle Engineering: S3 Tiers, Intelligent-Tiering and GP3",
      order_index: 1,
      content: `### Cloud Storage Cost Engineering and Lifecycle Automation

1. S3 Storage Class Economics:
   - S3 Standard: $0.023 per GB/month (High durability, frequent access).
   - S3 Standard-IA (Infrequent Access): $0.0125 per GB/month (Lower storage cost, small per-GB retrieval fee).
   - S3 Glacier Flexible: $0.0036 per GB/month (Archive tier, minutes to hours retrieval).
   - S3 Glacier Deep Archive: $0.00099 per GB/month (Lowest cost cloud storage: under $1 per Terabyte per month; 12-hour retrieval).

2. Automated Lifecycle Transitions & Intelligent-Tiering:
   - S3 Lifecycle Rules: Programmatically transitioning objects: S3 Standard -> S3-IA after 30 days -> Glacier Deep Archive after 90 days -> Permanent deletion of non-current versions after 365 days.
   - S3 Intelligent-Tiering: Automatically moves data between Frequent, Infrequent, and Archive Instant Access tiers based on real-time machine-learning access patterns with zero operational overhead and zero data retrieval fees.

3. EBS Volume Modernization (GP2 to GP3):
   - Migrating block storage from GP2 to GP3 delivers an instant 20% cost reduction per GB while decoupling baseline performance (3,000 IOPS and 125 MB/s included for free).`
    },
    {
      track_id: track3Id,
      title: "Network Data Transfer Optimization, VPC Endpoints and CDNs",
      order_index: 2,
      content: `### Network Egress Cost Reduction and Architecture

Network data transfer represents one of the most frequently overlooked and expensive components of cloud bills:

1. Data Transfer Cost Physics:
   - Inbound Data Transfer: Free across all major cloud providers.
   - Same-AZ Communication: Free between instances within the same Availability Zone.
   - Cross-AZ Data Transfer: Billed per GB in both directions (e.g. $0.01/GB sent and $0.01/GB received).
   - Internet Data Egress: The most expensive data charge (up to $0.09 per GB).

2. Gateway VPC Endpoints for S3 and DynamoDB:
   - Standard NAT Gateways charge $0.045 per hour plus $0.045 per GB of processed data.
   - Gateway VPC Endpoints route S3 and DynamoDB traffic directly over private internal AWS network links for completely FREE, instantly eliminating thousands of dollars in monthly NAT data processing fees.

3. Content Delivery Network (CDN) Offloading:
   - Routing static assets and media through AWS CloudFront or Cloudflare caches requests at edge PoPs, drastically cutting origin server egress traffic while taking advantage of lower CDN data transfer rates.`
    },
    {
      track_id: track3Id,
      title: "FinOps Culture, Automated Waste Cleanup and CI/CD Cost Gates",
      order_index: 3,
      content: `### Automated Waste Remediation and Shifting Cost Left

1. Automated Cloud Waste Cleanup (Cloud Custodian / AWS Lambda):
   - Identifying and purging orphaned cloud assets:
     - Terminating unattached Elastic IP addresses (which incur hourly idle charges).
     - Deleting unattached EBS volumes left behind after EC2 instance terminations.
     - Pruning obsolete automated database and volume snapshots.
   - Automated Environment Auto-Stopping: Automatically scheduling non-production development and testing environments to stop on evenings and weekends, eliminating 65% of dev compute expenses.

2. Shifting Cost Left in CI/CD (Infracost):
   - Integrating Infracost into GitHub Actions / GitLab CI pull request pipelines.
   - Parsing Terraform code changes to post an exact monthly financial impact diff directly on the Pull Request (e.g. 'This pull request will increase monthly cloud spend by +$142.50 (+4.2%)') before engineers merge code to production.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #28.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "What cloud cost metric measures cloud expenditure against direct business value (such as Cost Per Monthly Active User or Cost Per Transaction) rather than gross cloud spending totals?",
      options: [
        "Gross Margin",
        "Cloud Unit Economics",
        "Electricity Metering",
        "Depreciation Schedule"
      ],
      correct_option_index: 1,
      explanation: "Cloud Unit Economics measures cloud costs against core business activity metrics, revealing whether cost growth reflects efficiency or waste.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "Which AWS compute commitment model provides flexible hourly spend discounts (up to 66%) that automatically apply across EC2 instances, AWS Fargate containers, and AWS Lambda functions regardless of instance family or region?",
      options: [
        "Spot Instances",
        "On-Demand",
        "Standard Reserved Instances",
        "Compute Savings Plans"
      ],
      correct_option_index: 3,
      explanation: "Compute Savings Plans offer flexible dollar-per-hour commitment discounts applying automatically across EC2, Fargate, and Lambda across all regions.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What lowest-cost Amazon S3 storage class costs under $1 per Terabyte per month ($0.00099/GB/month) for long-term compliance data with 12-hour retrieval times?",
      options: [
        "S3 Glacier Deep Archive",
        "S3 Standard",
        "S3 Express One Zone",
        "EBS io2"
      ],
      correct_option_index: 0,
      explanation: "S3 Glacier Deep Archive is the lowest-cost cloud storage tier, costing under $1/TB/month for cold archival data.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What free AWS private networking component routes S3 and DynamoDB traffic privately over internal AWS links, completely eliminating expensive NAT Gateway data processing fees ($0.045/GB)?",
      options: [
        "Public Internet Gateway",
        "Transit Gateway",
        "Gateway VPC Endpoint",
        "Direct Connect"
      ],
      correct_option_index: 2,
      explanation: "Gateway VPC Endpoints for S3 and DynamoDB are completely free to provision and use, eliminating costly NAT Gateway data transfer fees.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What tool integrates with GitHub Actions / GitLab CI to parse Terraform diffs and display exact monthly cost impact breakdowns directly on Pull Requests before merging?",
      options: [
        "Docker Engine",
        "Infracost",
        "Jenkins Master",
        "Vim Editor"
      ],
      correct_option_index: 1,
      explanation: "Infracost shifts cost awareness left by calculating monthly cloud financial diffs from IaC pull requests directly in source control.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "How do Spot Instances differ from standard On-Demand compute instances in cloud financial operations?",
      options: [
        "Spot instances only run during daylight hours",
        "Spot instances are only available on Linux 2.0",
        "Spot instances represent spare unused cloud compute capacity sold at steep discounts (up to 90% off), subject to a 2-minute interruption notice when capacity is reclaimed",
        "Spot instances are twice as expensive as on-demand"
      ],
      correct_option_index: 2,
      explanation: "Spot instances auction surplus capacity at up to 90% discounts with a 2-minute interruption notice, ideal for fault-tolerant and containerized batch workloads.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Kubernetes cost attribution, what tool inspects container CPU/RAM requests and real-time usage to allocate cluster costs down to the individual Namespace, Service, and Pod level?",
      options: [
        "Kubecost / AWS Cost Allocation for EKS",
        "AWS Route 53",
        "Amazon SES",
        "CloudFront"
      ],
      correct_option_index: 0,
      explanation: "Kubecost breaks down monolithic Kubernetes cluster VM bills into granular per-pod and per-namespace cost attribution.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In block storage modernization, what financial and performance advantage is achieved by migrating AWS EBS volumes from legacy GP2 to GP3?",
      options: [
        "GP3 volumes are free of charge",
        "GP3 increases disk size to 1 Petabyte",
        "GP3 only works with Windows",
        "An immediate 20% lower cost per GB with baseline 3,000 IOPS and 125 MB/s throughput included for free, with decoupled independent provisioning of capacity and IOPS"
      ],
      correct_option_index: 3,
      explanation: "GP3 delivers 20% cost savings per GB while decoupling IOPS and throughput from volume storage capacity.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In enterprise FinOps governance, what percentage of dev/staging compute costs can be saved by automatically stopping non-production environments during non-business hours (evenings and weekends)?",
      options: [
        "Approximately 5%",
        "Approximately 65% (running ~50 hours per week instead of 168 hours)",
        "Zero savings",
        "100% of all company costs"
      ],
      correct_option_index: 1,
      explanation: "Non-production environments running only during working hours (~50 hrs/wk out of 168 total hours) save approximately 65% on compute bills.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "How does ARM-based custom silicon (such as AWS Graviton3/Graviton4 or Azure Cobalt) optimize compute economics compared to comparable x86_64 processors?",
      options: [
        "By disabling all security encryption",
        "By running only single-threaded code",
        "By delivering up to 40% superior price-performance for equivalent workloads with substantially lower power consumption",
        "By reducing memory capacity by 90%"
      ],
      correct_option_index: 2,
      explanation: "Custom ARM-based cloud silicon delivers up to 40% better price-performance compared to standard x86 processors for equivalent compute tasks.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In Kubernetes autoscaling architecture, how does Karpenter optimize cloud compute costs compared to traditional Cluster Autoscaler with pre-configured node groups?",
      options: [
        "Karpenter evaluates pending Pod specifications directly and launches the optimal, most cost-effective diverse Spot/On-Demand instance types in 30-45 seconds without pre-configured Auto Scaling Groups",
        "Karpenter shuts down all cluster nodes permanently",
        "Karpenter converts containers into virtual machines",
        "Karpenter requires manual approval for every pod"
      ],
      correct_option_index: 0,
      explanation: "Karpenter provides dynamic, group-less node provisioning, evaluating unscheduled pod resource needs to launch the cheapest suitable instance types in seconds.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In AWS Lambda serverless cost optimization, why can increasing function memory from 512 MB to 1,024 MB actually reduce the total financial cost of execution?",
      options: [
        "Because AWS gives free credits for 1,024 MB functions",
        "Because memory is free on AWS Lambda",
        "Because 512 MB functions are charged an extra tax",
        "AWS Lambda allocates proportional virtual CPU power with memory; doubling memory can decrease execution duration by more than 4x (e.g. from 2,000 ms to 400 ms), resulting in a lower total GB-second bill"
      ],
      correct_option_index: 3,
      explanation: "Proportional CPU allocation means more memory yields faster execution, often reducing execution duration enough to lower total GB-second compute cost.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "How does Amazon S3 Intelligent-Tiering optimize object storage costs without introducing unexpected operational retrieval fees?",
      options: [
        "By deleting all files older than 30 days",
        "It automatically moves objects between Frequent, Infrequent, and Archive Instant Access tiers based on machine-learning access patterns with zero operational overhead and zero data retrieval charges",
        "By compressing files into zip archives",
        "By converting images into black and white"
      ],
      correct_option_index: 1,
      explanation: "S3 Intelligent-Tiering automatically manages tier transitions without retrieval fees, making it ideal for datasets with unpredictable access patterns.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "What SQL analytics database tool is commonly deployed to query raw Parquet-formatted AWS Cost and Usage Reports (CUR) stored in Amazon S3 for multi-account cost investigations?",
      options: [
        "Microsoft Access",
        "Redis Cache",
        "Amazon Athena",
        "SQLite on a desktop computer"
      ],
      correct_option_index: 2,
      explanation: "Amazon Athena executes serverless distributed SQL queries directly against raw Parquet CUR billing files stored in S3.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In cloud network data transfer economics, what is the cost difference between Inbound Data Transfer, Same-AZ Data Transfer, Cross-AZ Data Transfer, and Internet Egress?",
      options: [
        "Inbound and Same-AZ transfers are FREE; Cross-AZ transfer is charged per GB in both directions; Internet Egress is the most expensive charge ($0.09/GB)",
        "All data transfers are 100% free of charge",
        "Inbound data transfer is the most expensive charge",
        "Same-AZ transfer costs $100 per megabyte"
      ],
      correct_option_index: 0,
      explanation: "Inbound and Same-AZ traffic are free; Cross-AZ incurs bilateral per-GB charges; public Internet Egress is the highest-cost network charge.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #28.");
  console.log("Skill #28 update completed successfully!");
}

run();
