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

const skillId = "d29e908a-9e12-4468-850b-94f0e54a811c";

async function run() {
  console.log("Updating Skill #33: Incident Management (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Incident Command Systems, War Room Choreography and Severity Triage" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Reliability Metrics, Communications and Traffic Shedding" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Blameless Post-Mortems, Systemic Causation and On-Call Health" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Incident Command System (ICS) and Operational SRE Roles",
      order_index: 1,
      content: `### Emergency Response Governance: The Incident Command System

Site Reliability Engineering adapts emergency management principles from the Incident Command System (FEMA / NIMS) for software outages:

1. Defined Incident Roles:
   - Incident Commander (IC): The supreme leader holding sole decision-making authority over the incident lifecycle. The IC does not execute technical fixes; instead, the IC directs resources, assigns tasks, time-boxes diagnostic hypotheses, and prevents team rabbit holes.
   - Operations Lead (Ops Lead / Tech Lead): Coordinates engineering investigation, runs diagnostic checks, and executes rollback scripts.
   - Communications Lead (Comms Lead): Handles all outbound updates to executives, legal, customer support, and public status pages, shielding engineers from management interruptions.
   - Scribe: Maintains an accurate, timestamped event log of actions, hypotheses, and telemetry graph links in the incident channel.

2. Formal Transfer of Command:
   - During extended multi-hour incidents, command is formally handed over verbally: the departing IC reviews the timeline, current state, active hypotheses, and assigned tasks with the incoming IC before transferring control.`
    },
    {
      track_id: track1Id,
      title: "Severity Classification Matrices: SEV0, SEV1, SEV2 and SEV3",
      order_index: 2,
      content: `### Objective Incident Severity Triage Framework

Severity levels define the organizational urgency and response cadence:

1. Standard Severity Matrix:
   - SEV0 (Catastrophic / Critical Emergency):
     - Criteria: Complete failure of core revenue-generating business capability for all users (e.g. global payment checkout failure, active data loss, total authentication outage).
     - Response: Immediate automated paging of on-call teams, executive escalation to VP/CTO, dedicated war room bridge, stakeholder updates every 15 minutes.
   - SEV1 (Major Outage):
     - Criteria: Significant degradation affecting a large customer segment without a workaround (e.g. search engine offline in Europe, 20% elevated error rates).
     - Response: On-call engineer mobilized immediately, public status page updated every 30 minutes.
   - SEV2 (Moderate Impact):
     - Criteria: Non-critical feature impaired with an available workaround (e.g. profile picture uploads failing, recommendation widget offline).
     - Response: Handled during normal working hours by the on-call engineer.
   - SEV3 (Minor Issue):
     - Criteria: Minor internal glitch with zero customer impact; tracked via standard sprint backlog.`
    },
    {
      track_id: track1Id,
      title: "War Room Choreography, Triage Playbooks and Rollback First",
      order_index: 3,
      content: `### War Room Execution and the Cardinal SRE Mitigation Rule

1. The Cardinal Rule of Incident Response:
   - 'Mitigate First, Diagnose Later':
     - The immediate objective of incident response is restoring customer service as fast as humanly possible (via instant software rollback, feature flag deactivation, traffic shedding, or node cycling).
     - Deep forensic root-cause analysis is strictly deferred until production is fully restored.

2. Virtual War Room Best Practices:
   - Incident Communication Hub: Automatic creation of dedicated Slack/Teams channels (\`#inc-2026-08-payment-gateway\`) with integrated PagerDuty ChatOps bots.
   - Time-Boxing Diagnostic Hypotheses: The IC assigns specific diagnostic tasks with strict time bounds (e.g. 'Alice, you have 10 minutes to verify if the database connection pool is saturated; check back at 14:15').
   - Rollback Playbooks: Pre-tested one-click rollback scripts reverting recent deployments to the last known good commit.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Incident Telemetry Metrics: MTTD, MTTA, MTTR and MTBF",
      order_index: 1,
      content: `### Quantitative Incident Management Lifecycle Metrics

Measuring incident response performance enables data-driven organizational improvements:

1. Core Lifecycle Time Metrics:
   - Mean Time to Detect (MTTD): Elapsed time from initial defect occurrence until automated monitoring generates an alert. High MTTD indicates monitoring gaps.
   - Mean Time to Acknowledge (MTTA): Elapsed time from alert dispatch until the on-call engineer acknowledges the page.
   - Mean Time to Mitigate / Recover (MTTR): Elapsed time from alert acknowledgment until the system is restored to normal operational parameters. MTTR is the primary metric evaluated by SRE organizations.
   - Mean Time Between Failures (MTBF): The average duration of uninterrupted system uptime between consecutive outages, measuring underlying architectural stability.

2. The MTTR Breakdown Equation:
\`\`\`
MTTR = Triage Time + Diagnosis Time + Mitigation Execution Time + Verification Time
\`\`\`
   - SRE automation focuses on slashing diagnosis and mitigation execution times through automated runbooks.`
    },
    {
      track_id: track2Id,
      title: "Incident Communications: Status Pages and Executive Briefings",
      order_index: 2,
      content: `### Stakeholder Communication Architecture

Clear communication prevents customer panic and executive interference during active outages:

1. Public Status Page Protocols (Statuspage / Instatus):
   - Structured Incident State Transitions:
     - \`Investigating\`: Acknowledging the issue promptly (e.g. 'We are investigating elevated error rates on checkout').
     - \`Identified\`: Stating the issue cause in non-technical terms.
     - \`Monitoring\`: Mitigation applied; actively verifying recovery telemetry.
     - \`Resolved\`: Confirmed normal operation restored.
   - Predictable Cadence: Updating status pages every 15-30 minutes even if no new breakthrough has occurred, building customer trust.

2. Internal Executive Briefing Templates:
   - Standardized 4-bullet executive summaries:
     - Current User Impact (e.g. 12% of US East transactions failing).
     - Current Working Hypothesis and Active Mitigation Actions.
     - Estimated Time to Resolution (or Next Update Time).
     - Key Incident Commander Point of Contact.`
    },
    {
      track_id: track2Id,
      title: "Traffic Shedding, Degraded Modes and Load Shedding Playbooks",
      order_index: 3,
      content: `### Defensive Degradation and Load Shedding Mechanics

When systems experience catastrophic load or database failure, graceful degradation preserves core capability:

1. Edge Load Shedding:
   - When backend compute clusters or databases reach saturation thresholds (e.g. CPU > 92%), API Gateways execute load shedding, rejecting lower-priority requests with HTTP 503 (Service Unavailable) or HTTP 429 (Too Many Requests) to ensure high-priority checkout transactions succeed.

2. Dynamic Feature Flag Deactivation:
   - Instantly disabling non-essential, compute-heavy features via centralized feature management (LaunchDarkly / Unleash):
     - Turning off real-time recommendation engines.
     - Disabling complex fraud ML scoring models in favor of lightweight rule-based heuristics.
     - Bypassing non-essential database audit writes.

3. Read-Only Mode Failover:
   - Switching applications to read-only mode during database primary failovers, allowing users to browse products while queuing writes.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Blameless Post-Mortem Methodology and Psychological Safety",
      order_index: 1,
      content: `### Human Factors and Blameless Retrospective Culture

Modern SRE embraces blameless post-mortems derived from human factors engineering (John Allspaw / Sydney Dekker):

1. The Blameless Post-Mortem Principle:
   - Premise: Human engineers never come to work intending to cause an outage. Failures are properties of complex systems, not individual incompetence.
   - Hindsight Bias: Resisting the cognitive trap of believing an outcome was obvious in advance ('They should have checked the database flag').
   - Psychological Safety: If engineers fear punitive disciplinary action, they will hide mistakes, delete evidence, and avoid reporting near-misses, guaranteeing that catastrophic systemic flaws remain hidden.

2. Conducting the Blameless Post-Mortem Meeting:
   - Focus questions on system context:
     - 'What tools, alerts, or documentation led the engineer to believe that action was safe?'
     - 'Why did our automated CI/CD safety checks fail to catch this error before production deployment?'`
    },
    {
      track_id: track3Id,
      title: "The Root Cause Fallacy, 5 Whys and Action Item Governance",
      order_index: 2,
      content: `### Systemic Causation and Post-Mortem Action Item Engineering

1. The 'Root Cause Fallacy' in Complex Systems:
   - Complex distributed software systems never fail from a single isolated 'root cause'.
   - Outages are the result of multiple interconnected contributing factors: latent architectural bugs, unexpected edge-case traffic, inadequate monitoring, and organizational pressure aligning simultaneously.

2. The 5 Whys Iterative Analysis:
   - Drills past proximate human triggers into underlying systemic vulnerabilities:
     - Why did the website crash? Database connection pool was exhausted.
     - Why? An unindexed database query blocked worker threads.
     - Why? A developer deployed code without an index.
     - Why? Automated schema linting was missing from the CI pipeline.
     - Why? Schema linting tooling was never prioritized in platform engineering backlog.

3. Action Item Governance and Decay Prevention:
   - SMART Action Items: Every post-mortem item must have a specific owner, quantifiable deliverable, and hard deadline.
   - Action Item Governance: P0/P1 corrective actions are automatically injected into the next engineering sprint before the post-mortem is formally closed.`
    },
    {
      track_id: track3Id,
      title: "Sustainable On-Call Rotations, Fatigue Management and Toil Caps",
      order_index: 3,
      content: `### SRE On-Call Health and Operational Toil Limits

High reliability requires protecting human engineers from cognitive burnout:

1. Google SRE On-Call Standards:
   - Alert Thresholds: SRE rotations must average no more than 2 actionable alerts per 12-hour shift. Higher alert volume indicates broken monitoring and triggers emergency rotation relief.
   - Time Off in Lieu (TOIL Recovery): Engineers paged overnight receive mandatory daytime rest to recover cognitive alertness.

2. The 50% Rule for SRE Teams:
   - SRE teams must cap operational work (on-call response, manual tickets, repetitive maintenance) at a maximum of 50% of their total working time.
   - The remaining >= 50% of time must be dedicated to software engineering (developing automated healing, improving telemetry, and building scalable platforms) to eliminate operational toil permanently.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #33.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In the Incident Command System (ICS) adapted for SRE, what role holds sole decision-making authority over the incident lifecycle, directs investigations, and time-boxes tasks without writing code during the outage?",
      options: [
        "Incident Commander (IC)",
        "Database Administrator",
        "Junior Developer",
        "Marketing Specialist"
      ],
      correct_option_index: 0,
      explanation: "The Incident Commander (IC) leads the incident response, coordinating resources and assigning tasks without getting lost in technical execution details.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What cardinal rule governs SRE incident response during an active production outage?",
      options: [
        "Spend 4 hours debugging root causes before taking action",
        "Delete all server logs immediately",
        "'Mitigate First, Diagnose Later': Restoring user service via rollbacks or restarts takes immediate priority over investigating root cause",
        "Blame the junior developer on Twitter"
      ],
      correct_option_index: 2,
      explanation: "Mitigate First, Diagnose Later: restoring customer service (via rollback, restart, or traffic shedding) is the urgent first priority during an outage.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In SRE incident metrics, what does Mean Time to Recover / Mitigate (MTTR) measure?",
      options: [
        "The time it takes to hire a new engineer",
        "The elapsed duration from alert acknowledgment until the system is restored to normal operational parameters",
        "The time between software releases",
        "The time taken to reboot a laptop"
      ],
      correct_option_index: 1,
      explanation: "MTTR measures the time from alert acknowledgment until service is mitigated and normal operations are restored.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What cultural philosophy (championed by John Allspaw) assumes human engineers work in good faith within complex systems, focusing post-mortems on systemic weaknesses rather than punishing individuals?",
      options: [
        "Punitive Disciplinary Reviews",
        "Total Secrecy Policy",
        "Mandatory Fines",
        "Blameless Post-Mortem Methodology"
      ],
      correct_option_index: 3,
      explanation: "Blameless post-mortems eliminate fear and punitive finger-pointing, enabling teams to transparently investigate systemic and architectural flaws.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "According to Google SRE guidelines, what maximum percentage of an SRE team's total engineering time should be spent on operational work (on-call response, tickets, manual toil)?",
      options: [
        "Maximum 50% (with at least 50% dedicated to engineering & automation)",
        "100% operational work",
        "95% operational work",
        "0% operational work"
      ],
      correct_option_index: 0,
      explanation: "Google SRE mandates that operational toil must be capped at 50%, reserving at least 50% of time for engineering automation to eliminate future toil.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In incident severity classification, what defines a 'SEV0' (or Critical P0) incident?",
      options: [
        "A spelling error in a code comment",
        "A broken coffee machine in the office",
        "A feature request from a user",
        "A catastrophic failure of core revenue-generating business functionality affecting all users (e.g. global payment checkout down, active data loss)"
      ],
      correct_option_index: 3,
      explanation: "SEV0 is the most severe incident level: complete failure of mission-critical revenue capabilities, requiring immediate executive escalation and all-hands war room response.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In complex systems engineering, why is the concept of a single 'Root Cause' considered a fallacy?",
      options: [
        "Because computers cannot fail",
        "Complex distributed systems never fail from a single isolated failure; outages emerge from multiple interconnected contributing factors (latent bugs, unexpected traffic, monitoring gaps) aligning simultaneously",
        "Because developers are never wrong",
        "Because hardware never breaks"
      ],
      correct_option_index: 1,
      explanation: "The root cause fallacy highlights that complex system failures result from systemic interactions across multiple latent conditions, not a single trigger.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What defensive technique drops low-priority incoming requests with HTTP 503 errors at the API Gateway when backend systems reach saturation thresholds to protect core checkout transactions?",
      options: [
        "Load Shedding (Traffic Shedding)",
        "DNS Cache Poisoning",
        "Infinite Loop Execution",
        "Hard Drive Formatting"
      ],
      correct_option_index: 0,
      explanation: "Load shedding drops non-essential requests when systems approach maximum capacity, preserving vital resources for core revenue-generating workflows.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In SRE post-mortem governance, how do high-performing engineering teams prevent 'Action Item Decay' (where preventive fixes are forgotten)?",
      options: [
        "By deleting all post-mortem documents after 1 week",
        "By ignoring all action items",
        "By mandating that P0/P1 corrective action items are automatically injected into the very next engineering sprint with assigned owners before closing the incident",
        "By requiring written apologies from developers"
      ],
      correct_option_index: 2,
      explanation: "Action item governance ensures high-priority post-mortem preventive tasks are tracked as top-priority sprint deliverables before incident tickets are marked resolved.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What role in an Incident Command structure is responsible for writing external customer status page updates and internal executive briefings, shielding responding engineers from interruptions?",
      options: [
        "Database Administrator",
        "Junior Intern",
        "Security Auditor",
        "Communications Lead (Comms Lead)"
      ],
      correct_option_index: 3,
      explanation: "The Communications Lead handles all internal and external messaging, allowing engineers and the Incident Commander to focus purely on mitigation.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In SRE on-call rotation health, what is the maximum recommended alert rate per 12-hour shift before an on-call rotation is considered broken and subject to emergency remediation?",
      options: [
        "50 alerts per shift",
        "A maximum average of 2 actionable pages per 12-hour shift",
        "100 alerts per shift",
        "Unlimited alerts"
      ],
      correct_option_index: 1,
      explanation: "Google SRE guidelines recommend a maximum of 2 actionable pages per 12-hour shift to prevent severe cognitive fatigue and alert burnout.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In retrospective root-cause discovery, how does the '5 Whys' iterative interrogation method uncover systemic organizational vulnerabilities?",
      options: [
        "By asking the same question to 5 different developers",
        "By repeating the word 'Why' 5 times in an email",
        "By iteratively drilling down past the proximate human trigger through successive layers of cause-and-effect to uncover deep procedural, architectural, and governance gaps",
        "By waiting 5 days before starting an investigation"
      ],
      correct_option_index: 2,
      explanation: "The 5 Whys method drills past surface symptoms and immediate human errors to expose the systemic process, tooling, and architectural weaknesses beneath.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "During an active incident, how should the Incident Commander manage competing diagnostic theories from multiple engineers to prevent team paralysis?",
      options: [
        "Time-box diagnostic hypotheses: assign specific engineers 10-15 minute diagnostic spikes with strict deadlines to report back findings before exploring alternatives",
        "Allow engineers to argue indefinitely in the main channel",
        "Shut down all debugging tools",
        "Randomly guess which service is broken"
      ],
      correct_option_index: 0,
      explanation: "The IC time-boxes diagnostic tasks, assigning specific owners short time windows (e.g. 10-15 minutes) to validate or falsify hypotheses systematically.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In public status page communications, why is posting status updates on a predictable schedule (e.g. every 20 minutes) essential even when no new engineering progress has occurred?",
      options: [
        "To increase website ad revenue",
        "To confuse competitors",
        "To fill up web browser caches",
        "It reassures customers that the incident team is actively engaged and managing the situation, preventing customer panic and floods of duplicate support tickets"
      ],
      correct_option_index: 3,
      explanation: "Regular status updates provide transparency and assurance, managing customer expectations and dramatically reducing customer support inbound surges.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In cognitive psychology and post-mortem analysis, what is 'Hindsight Bias' and how does it distort post-incident investigations?",
      options: [
        "The ability to see in the dark",
        "The unconscious inclination to view past events as having been predictable ('They should have known better'), obscuring the real-time ambiguity and pressures faced by engineers during the outage",
        "Remembering things from childhood",
        "A software bug in monitor displays"
      ],
      correct_option_index: 1,
      explanation: "Hindsight bias makes past events appear obvious after the facts are known, falsely blaming operators instead of analyzing the systemic ambiguity they navigated.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #33.");
  console.log("Skill #33 update completed successfully!");
}

run();
