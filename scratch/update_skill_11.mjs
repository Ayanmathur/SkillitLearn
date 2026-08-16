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

const skillId = "c96ab247-b15a-4e95-ba6a-cb8127628304";

async function run() {
  console.log("Updating Skill #11: Construction Planning & Scheduling (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: WBS Decomposition, Activity Logic and Precedence Diagramming" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Critical Path Method (CPM), Float Analysis and Resource Leveling" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Schedule Compression, Earned Value Management and Forensic Delay Analysis" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Scope Decomposition, Work Breakdown Structures and MasterFormat",
      order_index: 1,
      content: `### Principles of Work Breakdown Structure (WBS) Architecture

The Work Breakdown Structure (WBS) is the hierarchical decomposition of the total project scope of work into manageable, measurable deliverables (governed by the Project Management Institute PMI and Construction Management Association of America CMAA standards):

1. The 100% Rule:
   - The WBS must capture 100% of the contractual scope defined in construction documents, specifications, and addenda.
   - The sum of work at child levels must roll up completely to 100% of the parent deliverable without omitting scope or including extraneous work.

2. Hierarchical Scope Levels:
   - Level 1: Total Project (e.g. 10-Story Commercial Hospital).
   - Level 2: Subproject / Major Deliverables (Substructure, Core & Shell, Interior Fit-Out, MEP Infrastructure).
   - Level 3: Deliverable Phases (Level 1 Framing, HVAC Rough-In, Roofing Assembly).
   - Level 4 / 5: Work Packages. The lowest WBS level representing discrete work deliverables assigned to a single trade contractor with definable cost, scope, and duration.

3. Industry Coding Systems Integration:
   - CSI MasterFormat (50 Divisions): Standardized work-results specification format (e.g. Division 03 Concrete, Division 05 Metals, Division 26 Electrical).
   - CSI UniFormat: Elemental building systems categorization (A Substructure, B Shell, C Interiors, D Services, E Equipment).
   - Organizational Breakdown Structure (OBS) & RACI Matrix: Maps work packages to organizational teams, defining who is Responsible, Accountable, Consulted, and Informed.`
    },
    {
      track_id: track1Id,
      title: "Activity Duration Estimation and Probabilistic PERT Modeling",
      order_index: 2,
      content: `### Estimating Construction Activity Durations

Work packages are decomposed into discrete Schedule Activities possessing defined start dates, finish dates, and resource demands:

1. Deterministic vs Parametric Estimation:
   - Parametric Formula: Activity duration is mathematically derived from work quantity takeoffs and crew production benchmarks:
\`\`\`
Duration (Days) = Total Work Quantity / (Daily Crew Output * Efficiency Factor)
\`\`\`
   - Example: 12,000 sq ft of CMU block wall / (600 sq ft per day crew rate * 0.85 site congestion factor) = 23.5 working days.

2. Three-Point Probabilistic Estimation (PERT Beta Distribution):
   - When activities carry high uncertainty (geotechnical drilling, winter weather, supply chain long-lead items), durations are modeled using three estimates:
     - Optimistic Duration (O): Best-case scenario.
     - Most Likely Duration (M): Normal operational conditions.
     - Pessimistic Duration (P): Worst-case scenario.
   - PERT Weighted Mean Expected Duration (\`T_e\`):
\`\`\`
T_e = (O + 4 * M + P) / 6
\`\`\`
   - Activity Standard Deviation (\`sigma\`) and Variance (\`sigma^2\`):
\`\`\`
sigma = (P - O) / 6
Variance = sigma^2 = ((P - O) / 6)^2
\`\`\`
   - Summing variances along the critical path allows project managers to calculate the exact probability of achieving contractual milestone dates under Gaussian normal distributions.`
    },
    {
      track_id: track1Id,
      title: "Precedence Diagramming Method (PDM) and Dependency Logic",
      order_index: 3,
      content: `### Network Logic Modeling (Activity-on-Node Architecture)

Construction schedules model the physical and operational flow of construction via the Precedence Diagramming Method (PDM / AON):

1. The Four Logical Precedence Relationships:
   - Finish-to-Start (FS): The successor activity cannot start until the predecessor activity finishes. (Standard relationship, representing > 85% of construction logic: e.g. Pour Concrete Footing -> Erect Steel Columns).
   - Start-to-Start (SS): The successor activity cannot start until the predecessor activity starts. Used for staged operations (e.g. Start Drywall Installation 3 days after Starting Electrical Rough-In).
   - Finish-to-Finish (FF): The successor activity cannot finish until the predecessor activity finishes. Used for synchronized milestone handoffs (e.g. Finish Testing & Balancing when Finish HVAC Controls Commissioning).
   - Start-to-Finish (SF): The successor cannot finish until the predecessor starts (rare in construction practice).

2. Leads and Lags:
   - Lag Time (+): A mandatory waiting delay introduced between activities without consuming labor resources (e.g. 7-day cure lag following a structural concrete deck pour).
   - Lead Time (-): An overlap acceleration (negative lag) where the successor starts prior to predecessor completion.

3. Logic Constraints:
   - Mandatory Hard Logic (Physical Constraints): Structural masonry cannot be erected before foundations are poured.
   - Discretionary Soft Logic (Preferential Logic): Sequencing floor 3 framing before floor 4 framing based on trade crew availability.
   - External Logic: Delays driven by third parties (municipal utility connections, owner-furnished equipment delivery).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Critical Path Method (CPM) Forward and Backward Pass Algorithms",
      order_index: 1,
      content: `### Mathematical Mechanics of the Critical Path Method (CPM)

The Critical Path Method (CPM) calculates the absolute minimum calendar duration required to complete a project through two mathematical computational passes:

### 1. The Forward Pass (Calculating Early Dates)
Moves chronologically from project start to finish:
- Early Start (ES): The earliest calendar date an activity can possibly begin based on predecessor logic.
  - \`ES_activity = max(Early Finish of all immediate predecessors)\`.
- Early Finish (EF): The earliest date an activity can finish:
  - \`EF = ES + Duration - 1\` (or \`EF = ES + Duration\` in continuous time).

### 2. The Backward Pass (Calculating Late Dates)
Moves backward from the project completion milestone:
- Late Finish (LF): The latest calendar date an activity can finish without delaying the overall contractual completion date.
  - \`LF_activity = min(Late Start of all immediate successors)\`.
- Late Start (LS): The latest date an activity can start without delaying project completion:
  - \`LS = LF - Duration + 1\` (or \`LS = LF - Duration\`).

### 3. Determining the Critical Path
- Total Float (TF) is the mathematical difference between Late and Early dates:
\`\`\`
Total Float = LS - ES = LF - EF
\`\`\`
- The Critical Path is defined as the continuous, unbroken chain of activities extending from project inception to final completion where Total Float is zero (\`TF = 0\`). Any delay to any critical path activity results in an instantaneous, day-for-day delay to the overall project completion milestone.`
    },
    {
      track_id: track2Id,
      title: "Total Float, Free Float and Schedule Sensitivity Analysis",
      order_index: 2,
      content: `### Float Classification and Mathematical Properties

Float (slack time) quantifies scheduling flexibility across non-critical network paths:

1. Total Float (TF):
   - The maximum duration an activity can be delayed from its Early Start without delaying the contractual project completion date:
\`\`\`
Total Float = LS - ES = LF - EF
\`\`\`
   - Shared Property: Total float belongs to the network path, not to an individual activity. If an upstream trade consumes all total float on a path, all downstream activities on that path become critical (\`TF = 0\`).

2. Free Float (FF):
   - The duration an activity can be delayed without delaying the Early Start of any immediate successor activity:
\`\`\`
Free Float = min(ES_successors) - EF_activity
\`\`\`
   - Owned exclusively by that specific activity. Consuming free float does not impact any other contractor's early start dates.

3. Interfering Float:
   - The portion of Total Float that, if consumed, delays the early start of downstream successor activities without delaying the project finish (\`Interfering Float = Total Float - Free Float\`).

### Schedule Sensitivity and Merge Bias

- Criticality Index: The percentage of iterations in a Monte Carlo simulation where an activity falls on the critical path. Near-critical paths (e.g. paths with 1 to 5 days of float) frequently flip to critical under real-world delays.
- Merge Bias: At nodes where multiple parallel paths converge into a single successor, the probability of on-time start drops dramatically because ALL incoming paths must finish before the successor can begin.`
    },
    {
      track_id: track2Id,
      title: "Resource Loading, Resource Allocation and Resource Leveling",
      order_index: 3,
      content: `### Resource-Driven Construction Scheduling

CPM logic establishes theoretical early dates, but ignores physical job site constraints such as crane availability, trade crew limits, and subcontractor workforce caps:

### 1. Resource Loading and Curves
- Assigning specific resource quantities (man-hours per trade, mobile cranes, concrete pump trucks, electrical wire tons) to each schedule activity.
- Cumulative Resource S-Curves: Plotting cumulative man-hours over time generates a classic S-curve representing slow startup mobilization, peak multi-trade production during interior rough-ins, and gradual closeout demobilization.

### 2. Resource Leveling Algorithms (Heuristic & Mathematical)

1. Resource Smoothing (Time-Constrained Leveling):
   - Smooths volatile peaks and valleys in labor demand by shifting non-critical activities within their available Total Float (\`TF > 0\`).
   - The project completion date remains fixed and unchanged.

2. Resource Leveling (Resource-Constrained Leveling):
   - Applied when resource limits (e.g. maximum of 2 tower cranes or 15 electricians) cannot be exceeded under any circumstances.
   - If peak demand exceeds resource limits, the leveling algorithm delays activities beyond their total float, extending the critical path and pushing out the project completion date.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Schedule Compression Techniques: Crashing and Fast-Tracking",
      order_index: 1,
      content: `### Project Schedule Acceleration Methodologies

When owner mandates, weather delays, or supply chain disruptions threaten liquidated damages deadlines, project managers deploy schedule compression:

### 1. Fast-Tracking (Parallel Processing)
- Performing activities in parallel that were originally planned in sequential order (e.g. starting structural foundation excavation while 100% construction document architectural detailing is still underway, or hanging drywall on floor 2 while MEP rough-in continues on floor 3).
- Risks: Massive increase in coordination complexity, design clashes, expensive field rework, and subcontractor change orders.

### 2. Schedule Crashing (Resource Infusion)
- Shortening the duration of critical path activities by adding resources (overtime shifts, second shifts, additional crews, high-capacity equipment).
- The Cost-Slope Formula:
\`\`\`
Cost Slope = (Crash Cost - Normal Cost) / (Normal Duration - Crash Duration)
\`\`\`
- Cost slope represents the exact marginal cost per day saved by crashing an activity.

### Optimal Crashing Algorithm
1. Identify all activities currently on the Critical Path (\`TF = 0\`).
2. Calculate the Cost Slope for each critical activity.
3. Crash the critical activity with the lowest Cost Slope first, until its duration reaches minimum crash limit or a parallel path becomes critical.
4. Re-evaluate network logic to identify newly formed parallel critical paths.
5. If multiple parallel critical paths exist, crash activities across ALL critical paths simultaneously to achieve true project-level duration reduction.`
    },
    {
      track_id: track3Id,
      title: "Earned Value Management (EVM) and Project Performance Controls",
      order_index: 2,
      content: `### Earned Value Management Architecture (ANSI/EIA-748)

Earned Value Management (EVM) integrates project scope, schedule baseline, and cost baseline into a unified quantitative performance measurement framework:

### 1. The Three Core Parameters
1. Planned Value (PV / BCWS): The authorized budget assigned to scheduled work up to a specific reporting date.
2. Earned Value (EV / BCWP): The quantified value of work physically completed:
\`\`\`
EV = % Physical Complete * Total Activity Budget (BAC)
\`\`\`
3. Actual Cost (AC / ACWP): The total realized cost incurred in completing the work to date.

### 2. Variances and Performance Indices
- Schedule Variance (\`SV = EV - PV\`): Positive = Ahead of schedule; Negative = Behind schedule.
- Cost Variance (\`CV = EV - AC\`): Positive = Under budget; Negative = Cost overrun.
- Schedule Performance Index (\`SPI = EV / PV\`):
  - \`SPI > 1.0\`: High schedule efficiency.
  - \`SPI < 1.0\`: Project is progressing slower than baseline schedule.
- Cost Performance Index (\`CPI = EV / AC\`):
  - \`CPI > 1.0\`: Under budget (spending less than planned per dollar of work).
  - \`CPI < 1.0\`: Cost overrun (spending more than planned per dollar of work).

### 3. Forecasting Final Completion Metrics
- Estimate at Completion (EAC): Projected total cost at project finish:
\`\`\`
EAC = BAC / CPI
\`\`\`
- To-Complete Performance Index (TCPI): Cost efficiency required on remaining work to meet original budget:
\`\`\`
TCPI = (BAC - EV) / (BAC - AC)
\`\`\``
    },
    {
      track_id: track3Id,
      title: "Forensic Schedule Delay Analysis and Claims Quantification",
      order_index: 3,
      content: `### Forensic Schedule Delay Analysis (AACE International RP 29R-03)

When construction projects suffer delays resulting in extended general conditions costs or liquidated damages, forensic scheduling engineers quantify causation and liability:

### 1. Legal Classification of Construction Delays
- Excusable vs Non-Excusable:
  - Excusable: Delays caused by factors beyond the contractor's control (unforeseeable site conditions, owner change orders, severe unseasonal weather). Entitles contractor to time extension.
  - Non-Excusable: Delays caused by contractor fault, poor planning, or subcontractor insolvency. Contractor pays liquidated damages.
- Compensable vs Non-Compensable:
  - Compensable: Excusable delays caused solely by the Owner (late design responses, late site access). Contractor receives both time extension and delay overhead compensation.
  - Non-Compensable: Excusable Force Majeure events (acts of God, strikes). Contractor receives time extension only, zero monetary damages.
- Concurrent Delays: When two independent delays (one Owner-caused, one Contractor-caused) occur in the same timeframe, both impacting the critical path. Typically results in time extension without delay damages.

### 2. Standard Forensic Delay Methodologies

1. Impacted As-Planned: Inserts delay event fragnet networks into the original baseline schedule to calculate theoretical impact (frequently rejected in court due to ignoring actual job site dynamics).
2. Time Impact Analysis (TIA): The gold standard in construction disputes. Inserts delay fragnets into the approved contemporaneous schedule update immediately preceding each delay event, establishing precise contemporaneous critical path impact.
3. Windows Analysis (Contemporaneous Period Analysis): Divides the total project duration into discrete monthly update snapshots ('windows'), evaluating critical path movement and delay liability period-by-period.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #11.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "What fundamental rule of Work Breakdown Structure (WBS) design states that the WBS must capture 100% of the project scope and that child elements must sum exactly to 100% of their parent deliverable?",
      options: [
        "The Pareto 80/20 Rule",
        "The 100% Rule",
        "The Critical Path Rule",
        "The Law of Diminishing Returns"
      ],
      correct_option_index: 1,
      explanation: "The 100% Rule mandates that the WBS must encompass all contractual project scope, and child elements must roll up completely to 100% of their parent level without omission.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In the Critical Path Method (CPM), what is the Total Float value of activities lying directly along the Critical Path?",
      options: [
        "Total Float = 100 days",
        "Total Float = 50% of duration",
        "Total Float is infinite",
        "Total Float = 0 (zero days)"
      ],
      correct_option_index: 3,
      explanation: "The Critical Path is defined as the continuous sequence of activities with zero Total Float (TF = 0); any delay directly extends the project completion date.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What is the most common logical precedence relationship used in construction network scheduling, where a successor activity cannot begin until its predecessor finishes?",
      options: [
        "Finish-to-Start (FS)",
        "Start-to-Start (SS)",
        "Finish-to-Finish (FF)",
        "Start-to-Finish (SF)"
      ],
      correct_option_index: 0,
      explanation: "Finish-to-Start (FS) represents over 85% of construction schedule dependencies (e.g. pour footing before erecting column).",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In Earned Value Management (EVM), what does a Schedule Performance Index (SPI) of 0.82 indicate regarding project progress?",
      options: [
        "The project is 18% under budget",
        "The project is 18% ahead of schedule",
        "The project is progressing at only 82% of its planned rate, indicating it is behind schedule",
        "The project has 82 days of float remaining"
      ],
      correct_option_index: 2,
      explanation: "SPI = EV / PV. An SPI < 1.0 indicates that work is progressing slower than scheduled; SPI = 0.82 means only 82% of planned work has been accomplished.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What schedule compression technique involves performing activities in parallel that were originally planned in sequential order?",
      options: [
        "Schedule Crashing",
        "Fast-Tracking",
        "Resource Leveling",
        "Scope Reduction"
      ],
      correct_option_index: 1,
      explanation: "Fast-tracking overlaps sequential activities in parallel (e.g. starting framing while foundation engineering is finalized), increasing coordination risk.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In Critical Path Method scheduling, what is the key difference between Total Float and Free Float?",
      options: [
        "Total Float is measured in dollars, while Free Float is measured in hours",
        "Free Float belongs to the entire project path, while Total Float is owned by a single activity",
        "Total Float is the delay an activity can absorb without delaying the project finish date, while Free Float is the delay an activity can absorb without delaying the Early Start of any immediate successor",
        "There is zero difference between Total Float and Free Float"
      ],
      correct_option_index: 2,
      explanation: "Total Float (LS - ES) delays project completion if exceeded; Free Float (min(ES_successors) - EF) delays successor early starts without affecting project finish.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "Under three-point PERT probabilistic duration modeling, if an excavation activity has an Optimistic duration of 10 days, a Most Likely duration of 16 days, and a Pessimistic duration of 28 days, what is the calculated Weighted Mean Expected Duration (T_e)?",
      options: [
        "17.0 days (T_e = (10 + 4 * 16 + 28) / 6 = 102 / 6 = 17.0 days)",
        "18.0 days",
        "16.0 days",
        "21.0 days"
      ],
      correct_option_index: 0,
      explanation: "PERT Expected Duration Te = (O + 4*M + P) / 6 = (10 + 4*16 + 28) / 6 = (10 + 64 + 28) / 6 = 102 / 6 = 17.0 days.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In forensic schedule delay analysis, what methodology is universally recognized as the 'gold standard' in construction litigation because it inserts delay fragnets into the contemporaneous schedule update immediately preceding each delay event?",
      options: [
        "As-Planned vs As-Built",
        "Total Cost Method",
        "Impacted As-Planned",
        "Time Impact Analysis (TIA)"
      ],
      correct_option_index: 3,
      explanation: "Time Impact Analysis (TIA / AACE RP 29R-03) evaluates delay events against contemporaneous schedule updates, providing the most legally defensible proof of critical path impact.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "When executing schedule crashing algorithms to accelerate a delayed critical path, how should project managers select which critical activities to crash first?",
      options: [
        "Crash the activity with the highest total dollar cost",
        "Prioritize the critical activity that has the lowest Cost Slope (lowest marginal cost per day saved)",
        "Crash all non-critical activities first",
        "Crash activities at random"
      ],
      correct_option_index: 1,
      explanation: "Cost Slope = (Crash Cost - Normal Cost) / (Normal Duration - Crash Duration). Crashing the lowest cost-slope critical activity achieves maximum time savings at minimum additional cost.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What is the primary operational difference between Resource Smoothing and Resource-Constrained Leveling?",
      options: [
        "Resource Smoothing only applies to concrete work",
        "Resource Leveling is only done in Microsoft Excel",
        "Resource Smoothing shifts non-critical activities within available float without extending project duration, whereas Resource-Constrained Leveling shifts critical activities and extends the project completion date when resource caps are breached",
        "Resource Smoothing requires hiring 50% more workers"
      ],
      correct_option_index: 2,
      explanation: "Resource smoothing operates strictly within total float (project finish fixed), while resource-constrained leveling delays activities beyond float, pushing the completion date out.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "An activity has an Early Start of Day 12, an Early Finish of Day 20, a Late Start of Day 17, and a Late Finish of Day 25. Its immediate successor activity has an Early Start of Day 22. What are the calculated Total Float and Free Float values for this activity?",
      options: [
        "Total Float = 5 days; Free Float = 2 days (TF = LS - ES = 17 - 12 = 5; FF = ES_successor - EF = 22 - 20 = 2)",
        "Total Float = 2 days; Free Float = 5 days",
        "Total Float = 8 days; Free Float = 0 days",
        "Total Float = 0 days; Free Float = 2 days"
      ],
      correct_option_index: 0,
      explanation: "Total Float = Late Start - Early Start = 17 - 12 = 5 days. Free Float = Successor Early Start - Early Finish = 22 - 20 = 2 days.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "A commercial project has a Budget at Completion (BAC) of $2,000,000. At month 6, the project has an Earned Value (EV) of $800,000 and an Actual Cost (AC) of $1,000,000. Assuming current cost performance continues, what is the forecasted Estimate at Completion (EAC)?",
      options: [
        "$2,000,000",
        "$1,600,000",
        "$2,200,000",
        "$2,500,000 (CPI = EV / AC = 800k / 1000k = 0.80; EAC = BAC / CPI = 2,000,000 / 0.80 = $2,500,000)"
      ],
      correct_option_index: 3,
      explanation: "CPI = EV / AC = 800,000 / 1,000,000 = 0.80. EAC = BAC / CPI = 2,000,000 / 0.80 = $2,500,000 (a projected $500,000 cost overrun).",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In construction schedule risk management, what phenomenon describes the probabilistic drop in on-time milestone completion when multiple parallel independent schedule paths converge into a single successor activity?",
      options: [
        "Parkinson's Law",
        "Merge Bias (where the joint probability of on-time start equals the mathematical product of all incoming paths finishing on time)",
        "Student Syndrome",
        "Fast-Track Decay"
      ],
      correct_option_index: 1,
      explanation: "Merge Bias occurs at network convergence nodes: because the successor cannot start until ALL incoming predecessor paths finish, the likelihood of on-time start drops significantly.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In construction claims jurisprudence, how is an excusable, compensable delay legally distinguished from an excusable, non-compensable delay?",
      options: [
        "Compensable delays are caused exclusively by subcontractor errors",
        "Non-compensable delays always result in contractor termination",
        "Compensable delays are caused solely by the Owner (granting both time extension and delay overhead damages), whereas non-compensable delays arise from Force Majeure events (granting time extension only, zero monetary damages)",
        "Compensable delays are illegal under federal law"
      ],
      correct_option_index: 2,
      explanation: "Owner-caused delays (e.g. late access, design errors) are compensable (time + money). Force Majeure acts of God are non-compensable (time only).",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In three-point PERT scheduling, if a critical path activity has an Optimistic duration of 8 days and a Pessimistic duration of 20 days, what is the calculated statistical Variance (sigma^2) of this activity?",
      options: [
        "4.0 days^2 (sigma = (20 - 8) / 6 = 12 / 6 = 2.0; Variance = 2.0^2 = 4.0)",
        "2.0 days^2",
        "12.0 days^2",
        "36.0 days^2"
      ],
      correct_option_index: 0,
      explanation: "Standard deviation sigma = (P - O) / 6 = (20 - 8) / 6 = 12 / 6 = 2.0 days. Variance = sigma^2 = 2.0^2 = 4.0 days^2.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #11.");
  console.log("Skill #11 update completed successfully!");
}

run();
