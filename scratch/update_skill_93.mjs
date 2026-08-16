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

const skillId = "ee48ed67-40de-4941-8b29-74f14a17bcbc";

async function run() {
  console.log("Updating Skill #93: Operations Management (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Standard Operating Procedures (SOPs), Workflow Mapping and Automation" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Lean Operations, Theory of Constraints (TOC) and Waste Elimination" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Operational KPIs, Capacity Planning and Risk Mitigation" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / COO & Lean Six Sigma Master level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Standard Operating Procedures (SOPs) and Checklist Architecture",
      order_index: 1,
      content: `### Process Standardization and Operational Checklists

1. The Checklist Manifesto Framework (Atul Gawande):
   - Eliminates cognitive slips and execution errors in mission-critical workflows by replacing complex memory recall with explicit, sequential verification steps.

2. Professional 3-Part SOP Architecture:
   - 1. Purpose & Scope: Clear definition of task objective and required software permissions.
   - 2. Step-by-Step Protocol: Numbered instructions with visual annotations and recorded video walkthroughs.
   - 3. Definition of Done (DoD): Objective criteria determining successful completion.`
    },
    {
      track_id: track1Id,
      title: "Business Process Mapping and the RACI Matrix",
      order_index: 2,
      content: `### Cross-Functional Workflow Mapping and Accountability

1. Swimlane Process Flow Diagrams:
   - Visually mapping end-to-end workflows across departmental swimlanes to uncover handoff delays, duplicate approvals, and administrative bottlenecks.

2. RACI Governance Matrix:
   - Responsible (R): Does the work.
   - Accountable (A): Exactly one individual who owns the final outcome and has veto power.
   - Consulted (C): Subject matter experts providing input.
   - Informed (I): Stakeholders updated on progress.`
    },
    {
      track_id: track1Id,
      title: "Low-Code Workflow Automation and System Integration",
      order_index: 3,
      content: `### Enterprise Workflow Automation and Integration

1. Low-Code Automation Platforms (Make, Zapier, n8n):
   - Connecting disparate databases (CRM, billing, project management) via automated webhook triggers and API endpoints.

2. Eliminating Repetitive Manual Overhead:
   - Automating client onboarding sequences, invoice reconciliation, and operational notifications, saving 15 to 25 hours of manual data entry per team member weekly.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The 8 Wastes of Lean (DOWNTIME Framework)",
      order_index: 1,
      content: `### Taiichi Ohno's Waste Identification Taxonomy

1. The DOWNTIME Framework:
   - Defects: Errors requiring costly rework.
   - Overproduction: Building goods or features ahead of actual demand.
   - Waiting: Idle queue time between process steps.
   - Non-Utilized Talent: Underutilizing employee intellect and problem-solving skills.
   - Transportation: Unnecessary moving of materials or digital assets.
   - Inventory: Excess raw materials or un-shipped software features.
   - Motion: Unnecessary physical steps or software clicks.
   - Extra-Processing: Over-engineering features beyond customer requirements.`
    },
    {
      track_id: track2Id,
      title: "Eliyahu Goldratt's Theory of Constraints (TOC)",
      order_index: 2,
      content: `### Bottleneck Management and System Throughput

1. The 5 Focusing Steps of TOC:
   - 1. Identify the Constraint: Find the single slowest bottleneck limiting total operational throughput.
   - 2. Exploit the Constraint: Ensure the bottleneck is 100% utilized and never idle.
   - 3. Subordinate Everything: Align non-bottleneck processes to pace their output to the bottleneck's speed.
   - 4. Elevate the Constraint: Invest capital and resources to expand bottleneck capacity.
   - 5. Repeat: Prevent inertia from becoming the new bottleneck.`
    },
    {
      track_id: track2Id,
      title: "Kaizen Continuous Improvement and 5S Methodology",
      order_index: 3,
      content: `### Daily Incremental Optimization and 5S Workplaces

1. The Kaizen Philosophy:
   - Small, continuous daily micro-improvements initiated from bottom-up frontline employee feedback rather than disruptive top-down reorganizations.

2. The 5S Workplace Discipline:
   - Sort (Seiri): Eliminate unnecessary items.
   - Set in Order (Seiton): Arrange tools for optimal accessibility.
   - Shine (Seiso): Clean and inspect equipment regularly.
   - Standardize (Seiketsu): Create uniform operational standards.
   - Sustain (Shitsuke): Maintain long-term organizational discipline.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Operational Metrics: Takt Time, Cycle Time and Lead Time",
      order_index: 1,
      content: `### Flow Metrics and Production Cadence

1. Core Operational Time Metrics:
   - Takt Time = Net Available Working Time / Total Customer Demand Units (the pace of production required to meet buyer demand).
   - Cycle Time: The actual elapsed time required to complete one unit of work from start to finish.
   - Lead Time: The total elapsed duration from initial customer order placement to final delivery.`
    },
    {
      track_id: track3Id,
      title: "Capacity Planning, Resource Utilization and Scalability",
      order_index: 2,
      content: `### Workload Balancing and Queue Management

1. Optimal Capacity Utilization (The 80% Rule):
   - Operating systems at 70% to 80% utilization rather than 100%; operating at 100% capacity creates exponential queue delays when small variability occurs (Kingman's formula).

2. Workload Leveling (Heijunka):
   - Distributing work evenly across operating schedules to avoid alternating periods of burnout and idle capacity.`
    },
    {
      track_id: track3Id,
      title: "Single Point of Failure (SPOF) Audits and Continuity",
      order_index: 3,
      content: `### Operational Risk Mitigation and Business Continuity

1. Single Point of Failure (SPOF) Elimination:
   - Auditing systems to ensure no single employee, vendor, or server can halt business operations if they become unavailable.

2. Business Continuity Planning (BCP):
   - Documenting disaster recovery runbooks, cross-training secondary team members, and establishing backup vendor supply relationships.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #93.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In the RACI responsibility assignment matrix, what rule must be strictly enforced for the 'Accountable' (A) role?",
      options: [
        "Every team member must be Accountable for everything",
        "The Accountable role is chosen randomly every week",
        "Exactly one individual must be assigned as Accountable for a process to ensure clear ownership and decision-making authority",
        "Accountable individuals do not participate in meetings"
      ],
      correct_option_index: 2,
      explanation: "A process must have exactly one Accountable owner; having multiple owners diffuses responsibility and leads to inaction.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In Lean operations (Toyota Production System), what does the Japanese term 'Kaizen' represent?",
      options: [
        "Continuous, incremental daily improvements driven by frontline team feedback",
        "Filing for bankruptcy",
        "Firing underperforming employees",
        "Building massive inventory stockpiles"
      ],
      correct_option_index: 0,
      explanation: "Kaizen is the philosophy of continuous, daily incremental improvement involving all employees across the organization.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In operational management, what is a 'Single Point of Failure' (SPOF)?",
      options: [
        "A bad product review",
        "A spelling error in an email",
        "A power outlet that is turned off",
        "A critical process, employee, or supplier whose failure or absence would completely halt business operations"
      ],
      correct_option_index: 3,
      explanation: "A SPOF is a solitary vulnerability in a system that will cause total operational shutdown if it fails.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In production and flow metrics, what is 'Takt Time'?",
      options: [
        "The time it takes to brew coffee",
        "The pace of production needed to match the rate of customer demand (Net Working Time / Demand Units)",
        "The time an employee spends on breaks",
        "The total age of the company"
      ],
      correct_option_index: 1,
      explanation: "Takt time calculates the required production rhythm to satisfy customer demand without overproducing or underproducing.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In workflow documentation, what is a Standard Operating Procedure (SOP)?",
      options: [
        "A legal contract signed by customers",
        "A marketing slogan",
        "A standardized, step-by-step document detailing how employees must perform a routine operational process to ensure quality and consistency",
        "A company financial balance sheet"
      ],
      correct_option_index: 2,
      explanation: "SOPs provide standardized instructions that enable any trained team member to execute tasks reliably with high quality.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In Eliyahu Goldratt's Theory of Constraints (TOC), what is the first critical step of the 5 Focusing Steps?",
      options: [
        "Buy new software for the entire company",
        "Identify the system's constraint (the single slowest bottleneck limiting total operational throughput)",
        "Fire the slowest worker",
        "Increase customer prices"
      ],
      correct_option_index: 1,
      explanation: "You cannot optimize a system without first identifying the primary bottleneck that dictates total output.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Lean manufacturing and service operations, what do the letters in the 'DOWNTIME' 8 wastes framework stand for?",
      options: [
        "Data, Output, Work, Network, Technology, Income, Margin, Expenses",
        "Delivery, Operations, Warehouse, Numbers, Time, Inventory, Money, Energy",
        "Draft, Organize, Write, Notify, Test, Implement, Monitor, Evaluate",
        "Defects, Overproduction, Waiting, Non-utilized talent, Transportation, Inventory, Motion, and Extra-processing"
      ],
      correct_option_index: 3,
      explanation: "DOWNTIME classifies the 8 core operational wastes identified in the Toyota Production System.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In workflow mapping, what is the primary benefit of using 'Swimlane Diagrams' (BPMN) over standard linear flowcharts?",
      options: [
        "They visually separate tasks by department or role across horizontal lanes, clearly exposing handoff delays, redundant steps, and bottlenecks",
        "They make diagrams look like swimming pools",
        "They eliminate the need for employees",
        "They are legally required by tax authorities"
      ],
      correct_option_index: 0,
      explanation: "Swimlanes clearly delineate role responsibilities and highlight friction points during cross-departmental handoffs.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In queue theory and capacity planning, why is operating a team or system at 100% capacity utilization dangerous for operational performance?",
      options: [
        "100% utilization causes employees to sleep on the job",
        "It makes software run backwards",
        "Operating at 100% utilization leaves zero buffer for variability, causing queues and customer wait times to spike exponentially (Kingman's formula)",
        "It is illegal under labor laws"
      ],
      correct_option_index: 2,
      explanation: "Running at 100% capacity leaves no headroom; any small interruption causes cascading backlogs and exponential delays.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In the 5S workplace organization methodology, what are the five sequential Japanese principles?",
      options: [
        "Sushi, Sashimi, Sake, Soba, Sukiyaki",
        "Sort (Seiri), Set in Order (Seiton), Shine (Seiso), Standardize (Seiketsu), and Sustain (Shitsuke)",
        "Speed, Scale, Size, Scope, Structure",
        "Sell, Send, Spend, Save, Settle"
      ],
      correct_option_index: 1,
      explanation: "5S establishes workplace cleanliness, organization, and standardization to eliminate wasted motion and defects.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "In Theory of Constraints (TOC), what does the third step ('Subordinate Everything Else to the Constraint') mandate?",
      options: [
        "Making the bottleneck work 24 hours without breaks",
        "Ignoring all customer complaints",
        "Firing department managers",
        "Pacing and aligning all non-bottleneck upstream processes to operate only as fast as the bottleneck can process work, preventing massive work-in-progress (WIP) pileups"
      ],
      correct_option_index: 3,
      explanation: "Subordination ensures non-bottlenecks do not produce excess inventory faster than the bottleneck can absorb it.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "How does 'Cycle Time' differ fundamentally from 'Lead Time' in operational process analysis?",
      options: [
        "Cycle Time is the actual active duration spent working on a single unit from start to finish; Lead Time is the total elapsed customer waiting time from initial order placement to final delivery",
        "Cycle time only applies to bicycles",
        "Lead time is always shorter than cycle time",
        "There is zero difference between them"
      ],
      correct_option_index: 0,
      explanation: "Lead time encompasses total wait time plus queue time; cycle time measures only active hands-on processing duration.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In operations automation engineering, when should a company automate a manual process using tools like Make, Zapier, or custom APIs?",
      options: [
        "Automate everything immediately before testing manually",
        "Never automate processes",
        "Only after the manual process has been standardized, debugged, and proven consistently effective through repeated human execution (automating an unstable process only accelerates chaos)",
        "Only when forced by investors"
      ],
      correct_option_index: 2,
      explanation: "Automating broken, undefined workflows amplifies errors; processes must be standardized manually before applying automation.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In operational risk management, what is a 'Cross-Training Matrix' and how does it prevent operational disruption?",
      options: [
        "A fitness program for executives",
        "A structured skills grid documenting which secondary team members are trained and certified to execute critical primary workflows when key employees are absent",
        "A list of competitor employees",
        "A spreadsheet calculating payroll taxes"
      ],
      correct_option_index: 1,
      explanation: "Cross-training matrices ensure redundancy, eliminating single-person dependencies across critical business functions.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In production planning, what is 'Workload Leveling' (Heijunka) and why is it implemented?",
      options: [
        "Distributing production volume and product mix evenly over time to eliminate erratic peaks and valleys, stabilizing workforce utilization and supply chain predictability",
        "Working 24 hours a day on Mondays and taking the rest of the week off",
        "Giving all employees identical job titles",
        "Shutting down the factory during peak demand"
      ],
      correct_option_index: 0,
      explanation: "Heijunka smooths out production schedules, preventing the wasteful bullwhip effect and workforce fatigue.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #93.");
  console.log("Skill #93 update completed successfully!");
}

run();
