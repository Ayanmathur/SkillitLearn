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

const skillId = "f822a905-e630-42ce-9e30-11c5918d5bf2";

async function run() {
  console.log("Updating Skill #32: Capacity Planning (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Queueing Theory, Concurrency Math and Little's Law" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Load Testing Paradigms, Coordinated Omission and Benchmarking" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Capacity Forecasting, Redundancy Headroom and Quota Governance" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Little's Law, System Throughput and Concurrency Limits",
      order_index: 1,
      content: `### Mathematical Foundations of System Concurrency

Capacity planning translates business traffic forecasts into physical compute, memory, and network sizing:

1. Little's Law (John Little, 1961):
   - In any stable queueing system, the average number of concurrent requests (\`L\`) equals the long-term average arrival rate (\`lambda\`) multiplied by the average response time (\`W\`):
\`\`\`
L = lambda * W
\`\`\`
   - SRE Practical Application:
     - If an API handles 10,000 requests/sec with an average latency of 150 ms (0.15s), the infrastructure must support \`10000 * 0.15 = 1,500\` concurrent active requests.
     - If a downstream database slowdown increases API latency to 1.2 seconds, the required concurrency jumps to \`10000 * 1.2 = 12,000\` concurrent requests, triggering thread pool starvation and memory crashes unless concurrency limits are enforced.

2. Bounding In-Flight Concurrency:
   - Implementing admission control and thread pool limits to prevent unbounded concurrency queues from causing memory exhaustion during latency spikes.`
    },
    {
      track_id: track1Id,
      title: "Queueing Models: M/M/1, M/M/c and Kingman's VUT Equation",
      order_index: 2,
      content: `### Queueing Dynamics and the Non-Linear Utilization Hockey Stick

1. Kendall's Queueing Notation:
   - M/M/1: Markovian arrivals (Poisson process), Markovian service times (exponential distribution), 1 server.
   - M/M/c: Multi-server queueing systems (e.g. c worker instances behind a load balancer).
   - Resource Utilization (\`rho = lambda / (c * mu)\`): The ratio of incoming traffic load to maximum service capacity.

2. The Asymptotic Hockey-Stick Latency Curve:
   - In queueing theory, average queue waiting time (\`W_q\`) does not increase linearly with load; it grows proportionally to \`rho / (1 - rho)\`.
   - As server utilization (\`rho\`) rises from 50% to 70%, waiting time increases modestly. However, as utilization rises from 85% to 95%, waiting time explodes exponentially toward infinity.

3. Kingman's Heavy-Traffic Formula (The VUT Equation):
\`\`\`
Wait Time = Variability (V) * Utilization (U) * Service Time (T)
Wait Time = ((c_a^2 + c_s^2) / 2) * (rho / (1 - rho)) * (1 / mu)
\`\`\`
   - Why SREs run production fleets at 60-70% target utilization: It leaves headroom to absorb natural traffic burstiness without entering the catastrophic exponential delay zone.`
    },
    {
      track_id: track1Id,
      title: "Hardware Saturation: CPU Run-Queues, Memory and Disk IOPS",
      order_index: 3,
      content: `### Identifying Systemic Hardware Bottlenecks

Capacity limits are dictated by the earliest hardware resource to reach saturation:

1. CPU Bottlenecks and Run-Queue Saturation:
   - System Load Average (\`/proc/loadavg\`): Represents the average number of threads in \`TASK_RUNNING\` (active on CPU) or \`TASK_UNINTERRUPTIBLE\` (blocked waiting on disk/lock).
   - A 1-minute load average exceeding the physical CPU core count indicates thread queueing and CPU starvation.

2. Memory and Swap Contention:
   - Monitoring Resident Set Size (RSS), Page Cache reclamation pressure, and minor/major page fault frequencies before OOM events occur.

3. Storage I/O Limits:
   - IOPS Saturation and Queue Depth: When storage requests exceed provisioned disk IOPS (e.g. EBS GP3 3,000 IOPS), storage queue depth grows and \`iowait\` CPU percentage spikes.

4. Network Bandwidth and PPS Limits:
   - Hardware limits on Packets Per Second (PPS) and connection tracking table sizes (\`conntrack_max\`).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Load Testing Methodologies: Baseline, Stress, Spike and Soak Tests",
      order_index: 1,
      content: `### Taxonomy of Production Load Testing Paradigms

Empirical capacity verification requires structured, multi-faceted load testing strategies:

1. Baseline / Benchmark Testing:
   - Executing nominal expected traffic loads to measure baseline response time distributions (p50, p95, p99) and resource consumption under clean conditions.

2. Stress Testing (Breaking Point Analysis):
   - Gradually stepping up traffic load in controlled increments (e.g. increasing by 10% every 5 minutes) until the system fails.
   - Identifies the exact breaking point capacity, primary bottleneck component, and failure mode (e.g. graceful degradation vs catastrophic cascade).

3. Spike / Surge Testing:
   - Injecting sudden, instantaneous 5x to 10x traffic surges within seconds to simulate viral marketing campaigns, flash sales, or breaking news events.
   - Evaluates load balancer scaling speed, autoscaling responsiveness, and circuit breaker tripping.

4. Soak / Endurance Testing:
   - Sustaining 70-80% peak load continuously for 24 to 72 hours.
   - Critical for detecting slow memory leaks, database connection pool leaks, open file descriptor accumulation, and log disk filling.`
    },
    {
      track_id: track2Id,
      title: "Modern Load Generation Tooling: k6, Locust and Distributed Injection",
      order_index: 2,
      content: `### Distributed Load Generation and Traffic Realism

1. Modern Load Testing Frameworks:
   - Grafana k6: High-performance Go runtime executing JavaScript test scripts with low CPU/memory overhead per virtual user.
   - Locust: Python-based framework enabling dynamic, highly realistic user behavioral journeys.

2. Open-Model vs Closed-Model Load Generation:
   - Closed-Model: Virtual Users wait for the previous request to finish before sending the next one. Flawed: when the server slows down, the load generator sends fewer requests, masking true overload.
   - Open-Model (Arrival-Rate Generation): The load generator injects requests at a fixed, mathematically independent rate (e.g. 5,000 req/sec) regardless of server response latency, accurately modeling real-world user behavior.

3. Distributed Load Generation:
   - Coordinating dozens of worker generator instances across multiple cloud regions to generate millions of requests per second without saturating the test machine's own CPU, RAM, or ephemeral ports.`
    },
    {
      track_id: track2Id,
      title: "Profiling Under Load: Coordinated Omission and Percentiles",
      order_index: 3,
      content: `### Overcoming Measurement Bias in Performance Engineering

1. The Coordinated Omission Flaw (Gil Tene):
   - Traditional benchmark tools measure only Service Time (duration from request transmission to response). If a server freezes for 10 seconds during a GC pause, the tool sends zero requests during those 10 seconds, recording only 1 slow sample instead of the 50,000 requests that were delayed.
   - Correct Methodology: Measuring total response time as Queue Wait Time plus Service Time.

2. High-Percentile Latency Analysis:
   - Mean (Average) Latency Fallacy: In a system serving 10 million daily requests, an average latency of 50 ms can easily mask that 100,000 requests (the 99th percentile) took over 5 seconds.
   - SRE standards mandate evaluating p90, p99, and p99.9 latencies to understand the experience of real users executing complex multi-service transactions.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Time Series Capacity Forecasting: Trend Models and Seasonality",
      order_index: 1,
      content: `### Predictive Analytics and Capacity Trend Forecasting

Capacity planning prevents unexpected outages by forecasting resource exhaustion months in advance:

1. Time Series Decomposition:
   - Seasonal and Trend decomposition using Loess (STL): Decomposes raw telemetry into:
     - Underlying Long-Term Trend.
     - Seasonal Periodic Cycles (diurnal 24-hour peaks, weekly business-day cycles).
     - Residual Random Noise.

2. Algorithmic Forecasting Models:
   - Holt-Winters Triple Exponential Smoothing: Forecasts time series exhibiting both trend and seasonal variations.
   - Meta Prophet: Robust forecasting framework accommodating multi-period seasonality, national holidays, and structural trend changepoints.

3. Organic Growth vs Step-Change Events:
   - Organic Growth: Baseline month-over-month expansion (e.g. 3% monthly data growth).
   - Step-Change Modeling: Programmatic capacity adjustments engineered for major marketing launches, international geographic expansions, or enterprise customer onboardings.`
    },
    {
      track_id: track3Id,
      title: "Redundancy Modeling: Failure Headroom, N+1 and N+2 Engineering",
      order_index: 2,
      content: `### Redundancy Engineering and Failure Headroom Calculations

Production systems must withstand catastrophic component losses without degrading user performance:

1. Failure Redundancy Models:
   - N+1 Redundancy: The cluster continues operating at full capacity if any single instance or Availability Zone experiences total failure.
   - N+2 Redundancy: The cluster maintains 100% operational capacity during simultaneous planned maintenance (e.g. rolling OS upgrades on AZ-A) and an unplanned emergency outage in another AZ.

2. Multi-AZ Headroom Mathematical Sizing:
   - For a 3-AZ Active-Active architecture with N+1 redundancy:
\`\`\`
Max Steady-State Target Utilization per AZ = ((N - 1) / N) * 100% = ((3 - 1) / 3) * 100% = 66.6%
\`\`\`
   - If each AZ operates at 65% capacity during normal peak hours, the loss of 1 complete AZ causes the remaining 2 AZs to absorb the load at \`65% * (3 / 2) = 97.5%\` capacity, surviving the outage without crashing.
   - Operating steady-state above 66.6% in a 3-AZ cluster guarantees that losing 1 AZ will cause the remaining 2 AZs to exceed 100% capacity and fail in a cascading outage.`
    },
    {
      track_id: track3Id,
      title: "Cloud Service Quotas, Capacity Reservations and Multi-Region Hedging",
      order_index: 3,
      content: `### Cloud Quota Governance and Capacity Guarantees

1. Cloud Service Quota Governance:
   - Hyperscaler Quotas: Default regional limits on vCPU allocations, elastic IPs, NAT gateways, and load balancer rules (e.g. AWS Service Quotas).
   - Automated Quota Monitoring: Implementing CloudWatch alarms that trigger automated quota increase tickets when resource consumption reaches 75% of the account limit.

2. On-Demand Capacity Reservations (ODCR):
   - In shared public cloud regions, extreme regional demand spikes can cause cloud providers to temporarily run out of specific instance types (returning \`InsufficientInstanceCapacity\` errors).
   - ODCR guarantees physical compute capacity reservations in specific Availability Zones for mission-critical failover targets.

3. Multi-Region Hedging:
   - Maintaining pilot light or active-active capacity footprint across secondary cloud regions to hedge against catastrophic regional fiber cuts or datacenter disruptions.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #32.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "According to Little's Law (L = lambda * W), if a cloud service receives an average of 4,000 requests per second (lambda) with an average latency of 250 milliseconds (0.25s), what is the average number of concurrent in-flight requests (L) the system must support?",
      options: [
        "100 concurrent requests",
        "1,000 concurrent requests (4,000 * 0.25)",
        "4,000,000 concurrent requests",
        "16,000 concurrent requests"
      ],
      correct_option_index: 1,
      explanation: "L = lambda * W = 4,000 requests/sec * 0.25 seconds = 1,000 concurrent in-flight requests.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What type of load test runs a steady 70-80% peak load continuously for 24 to 72 hours specifically to uncover slow memory leaks, connection pool exhaustion, and disk log accumulation?",
      options: [
        "Smoke Test",
        "Spike Test",
        "Chaos Test",
        "Soak / Endurance Test"
      ],
      correct_option_index: 3,
      explanation: "Soak / Endurance testing runs sustained moderate-to-high load over extended timeframes (24-72 hours) to detect slow leaks and resource accumulation.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In queueing theory (Kingman's VUT formula), what happens to queue waiting times as server resource utilization (rho) approaches 100%?",
      options: [
        "Queue waiting times explode non-linearly (exponentially) toward infinity",
        "Queue waiting times drop to zero",
        "Queue waiting times increase in a flat linear line",
        "Waiting times remain constant"
      ],
      correct_option_index: 0,
      explanation: "Queue waiting time is proportional to rho / (1 - rho); as utilization approaches 1.0 (100%), waiting times grow asymptotically toward infinity.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What cloud feature (such as AWS On-Demand Capacity Reservations) guarantees that physical compute capacity will be available in specific Availability Zones during disaster recovery failover?",
      options: [
        "Spot Fleet",
        "Public Internet Gateway",
        "On-Demand Capacity Reservation (ODCR)",
        "Lambda Function"
      ],
      correct_option_index: 2,
      explanation: "On-Demand Capacity Reservations secure physical compute capacity in designated AZs, preventing InsufficientInstanceCapacity errors during failovers.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In Linux system performance diagnostics, what does a 1-minute system load average exceeding the physical CPU core count signify?",
      options: [
        "The computer is turned off",
        "Processes are queuing for CPU execution time, indicating CPU starvation and run-queue saturation",
        "The computer is running at peak efficiency with zero delays",
        "Memory has been doubled"
      ],
      correct_option_index: 1,
      explanation: "When system load average exceeds the number of CPU cores, more threads are runnable than there are cores to execute them, causing run-queue delays.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In a 3-AZ Active-Active cloud deployment with N+1 redundancy, what is the maximum steady-state target utilization allowable per AZ to ensure surviving AZs do not exceed 100% capacity if 1 full AZ fails?",
      options: [
        "95% utilization per AZ",
        "100% utilization per AZ",
        "66.6% utilization per AZ (((3 - 1) / 3) * 100%)",
        "10% utilization per AZ"
      ],
      correct_option_index: 2,
      explanation: "With 3 AZs, losing 1 AZ requires the remaining 2 to handle 150% of their individual load (3/2 = 1.5x). Therefore, normal utilization must be <= 66.6% (66.6% * 1.5 = 100%).",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In load testing methodology, how does 'Open-Model' (Arrival-Rate) load generation prevent the distortion caused by 'Closed-Model' testing?",
      options: [
        "It injects requests at a fixed mathematical arrival rate independent of server response latency, accurately modeling real-world user traffic during server slowdowns",
        "It deletes all slow responses from reports",
        "It requires users to log in through Google",
        "It only generates traffic from a single IP address"
      ],
      correct_option_index: 0,
      explanation: "Open-model load testing generates requests at a fixed arrival rate regardless of whether the server is fast or slow, accurately modeling real-world traffic overload.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What measurement flaw, identified by Gil Tene, occurs when traditional benchmarking tools measure only server service time and pause transmissions during server stalls, hiding massive latency spikes?",
      options: [
        "Memory Leak",
        "Deadlock",
        "Buffer Overflow",
        "Coordinated Omission"
      ],
      correct_option_index: 3,
      explanation: "Coordinated Omission occurs when benchmark tools pause or coordinate their generation with server responses, inadvertently filtering out queued latency delays from test results.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In time-series capacity forecasting, what framework (developed by Meta) accommodates multi-period seasonality, national holidays, and structural trend changepoints to forecast cloud resource exhaustion?",
      options: [
        "Apache Kafka",
        "Prophet",
        "Docker Compose",
        "Nginx"
      ],
      correct_option_index: 1,
      explanation: "Meta Prophet is a specialized time-series forecasting library designed to handle daily/weekly seasonality, trend changepoints, and holiday effects in operational metrics.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "Why is evaluating 99th percentile (p99) and 99.9th percentile (p99.9) latency mandatory in SRE capacity planning instead of relying on mean (average) latency?",
      options: [
        "Because averages are illegal in computer science",
        "Percentiles use less memory to calculate",
        "Average latency masks catastrophic tail-latency spikes experienced by hundreds of thousands of users executing complex multi-service workflows",
        "Average latency only measures failed requests"
      ],
      correct_option_index: 2,
      explanation: "Averages hide extreme tail latency. High percentiles (p99/p99.9) reveal the severe delays experienced by long-tail transactions across microservices.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "According to Kingman's VUT Equation for queue waiting times, what three fundamental factors directly multiply to determine average queue waiting time in a system?",
      options: [
        "Variability (V), Utilization factor (U: rho / (1 - rho)), and Mean Service Time (T)",
        "Voltage, Utility cost, and Temperature",
        "Volume, User count, and Thread count",
        "Velocity, Units, and Throughput"
      ],
      correct_option_index: 0,
      explanation: "Kingman's formula demonstrates that Queue Wait Time = V(Variability of arrivals/service) * U(rho/(1-rho) Utilization factor) * T(Mean Service Time).",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In SRE capacity management, what is 'N+2 Redundancy' and why do critical financial systems mandate it over standard N+1?",
      options: [
        "Running two separate cloud providers simultaneously",
        "Requiring two passwords to log in",
        "Having two network cables connected to every server",
        "Ensuring the system maintains 100% operational capacity even during simultaneous planned maintenance in one fault domain (AZ) and an unplanned emergency outage in a second fault domain"
      ],
      correct_option_index: 3,
      explanation: "N+2 redundancy guarantees that taking a node or AZ down for routine scheduled maintenance will not cause an outage if an unexpected failure occurs in another AZ concurrently.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In time-series decomposition (STL) for capacity forecasting, into what three distinct mathematical components is raw telemetry data decomposed?",
      options: [
        "CPU, Memory, and Disk",
        "Underlying Long-Term Trend, Periodic Seasonal Cycles (diurnal/weekly), and Residual Noise",
        "Inbound, Outbound, and Internal",
        "Minimum, Maximum, and Average"
      ],
      correct_option_index: 1,
      explanation: "STL decomposes time-series telemetry into its fundamental Trend component, Seasonal periodic cycles, and Residual random noise.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "What occurs during a 'Spike / Surge Test' in performance benchmarking, and what architectural capability does it specifically evaluate?",
      options: [
        "It tests electrical power spikes in server power cords",
        "It measures how fast computer hard drives spin",
        "It injects an instantaneous 5x to 10x traffic surge within seconds to test load balancer pre-warming, autoscaling latency, and circuit breaker trip thresholds",
        "It measures CPU heat output"
      ],
      correct_option_index: 2,
      explanation: "Spike testing injects sudden massive traffic leaps within seconds to evaluate whether autoscaling, load balancers, and protective circuit breakers respond effectively.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In Little's Law dynamics, what happens to concurrent system load (L) if downstream service latency (W) increases by 10x while arrival rate (lambda) remains constant?",
      options: [
        "The concurrent in-flight request load (L) increases by exactly 10x, rapidly saturating thread pools and memory buffers",
        "The concurrent request load drops by 10x",
        "Latency has zero mathematical relationship to concurrent load",
        "The arrival rate automatically drops to zero"
      ],
      correct_option_index: 0,
      explanation: "Because L = lambda * W, a 10x increase in latency (W) directly causes a 10x surge in concurrent in-flight requests (L), leading to thread exhaustion.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #32.");
  console.log("Skill #32 update completed successfully!");
}

run();
