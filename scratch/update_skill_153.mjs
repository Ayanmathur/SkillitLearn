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

const skillId = "55e58b04-265c-4eb2-acda-9ad8a5b9e8c6";

async function run() {
  console.log("Updating Skill #153: Performance Management (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Goal Frameworks: OKRs, SMART Goals and Strategic Alignment" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Continuous Feedback, 360 Reviews and Coaching Models" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Calibration Committees, 9-Box Grids and PIPs" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Chief Talent Officer & Organizational Development level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Objectives and Key Results (OKRs) vs SMART Goal Systems",
      order_index: 1,
      content: `### Strategic Goal Architecture and Execution

1. OKR Mechanics:
   - Ambitious qualitative Objectives paired with 3-5 quantifiable, outcome-based Key Results (targeting 70% stretch attainment).

2. SMART Goals:
   - Operational tasks structured around Specific, Measurable, Achievable, Relevant, and Time-bound criteria for foundational role commitments.`
    },
    {
      track_id: track1Id,
      title: "Cascading Enterprise OKRs to Team and Individual Key Results",
      order_index: 2,
      content: `### Cross-Organizational Alignment and Line of Sight

1. Top-Down and Bottom-Up Alignment:
   - Cascading enterprise strategic priorities to department and squad levels, with 50% of goals set bottom-up by frontline teams.

2. Cross-Functional Dependencies:
   - Mapping shared Key Results between engineering, product, and sales to eliminate operational silos.`
    },
    {
      track_id: track1Id,
      title: "Leading vs Lagging Indicators and Stretch Goal Mindsets",
      order_index: 3,
      content: `### Performance Measurement Metrics

1. Leading vs Lagging Metrics:
   - Leading indicators (input activities like client demos or code reviews) vs Lagging outcomes (revenue or system uptime).

2. Stretch Culture:
   - Decoupling OKR completion percentages from direct compensation formulas to encourage audacious risk-taking and innovation.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The Shift to Continuous Performance Management and 1-on-1s",
      order_index: 1,
      content: `### Real-Time Agile Performance Dialogues

1. Continuous Feedback Cadence:
   - Moving away from archaic annual appraisals to weekly/bi-weekly structured 1-on-1 coaching conversations.

2. Agenda Architecture:
   - Focusing 1-on-1s on obstacle removal, developmental growth, workload calibration, and psychological safety rather than tactical status updates.`
    },
    {
      track_id: track2Id,
      title: "360-Degree Feedback Architecture and Multi-Rater Syntheses",
      order_index: 2,
      content: `### Holistic Multi-Source Evaluation

1. Multi-Rater Structure:
   - Collecting anonymous upward feedback from direct reports, peer evaluations, self-appraisals, and manager reviews.

2. Synthesis & Blind Spots:
   - Identifying perception gaps between self-ratings and peer ratings to build self-awareness and executive leadership presence.`
    },
    {
      track_id: track2Id,
      title: "Radical Candor and The GROW Coaching Framework",
      order_index: 3,
      content: `### Empathetic Feedback and Developmental Coaching

1. Radical Candor Model:
   - Balancing Caring Personally with Challenging Directly (avoiding Ruinous Empathy and Obnoxious Aggression).

2. The GROW Framework:
   - Structuring coaching dialogues around Goal, Current Reality, Options/Obstacles, and Will/Way Forward.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Cross-Functional Calibration Sessions and Rater Debiasing",
      order_index: 1,
      content: `### Eliminating Performance Grading Inequities

1. Calibration Committee Protocol:
   - Bringing cross-functional leaders together to review and challenge employee ratings across uniform performance criteria.

2. Rater Bias Elimination:
   - Eliminating manager leniency bias, central tendency bias, and harsh grader variance across disparate departments.`
    },
    {
      track_id: track3Id,
      title: "The 9-Box Grid: Performance vs Potential for Succession",
      order_index: 2,
      content: `### Talent Portfolio Mapping and Succession Planning

1. 9-Box Architecture:
   - Plotting employees on a 3x3 matrix evaluating Current Job Performance (X-axis) against Future Leadership Potential (Y-axis).

2. Talent Stratification:
   - Identifying High Potentials (Stars/HiPos) for fast-track leadership, Core Contributors for retention, and low-performers for targeted coaching.`
    },
    {
      track_id: track3Id,
      title: "Underperformance Remediation and Defensible PIP Protocols",
      order_index: 3,
      content: `### Corrective Action and Fair Offboarding

1. Remediation Architecture:
   - Enforcing formal 30-to-60 day Performance Improvement Plans with concrete deficiency documentation, coaching milestones, and weekly progress reviews.

2. Ethical Exit Governance:
   - Providing fair, dignified separation pathways when PIP performance standards are not met.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #153.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In organizational goal setting, what does the acronym 'OKR' stand for?",
      options: [
        "Operating Knowledge Report",
        "Objectives and Key Results",
        "Office Key Requirements",
        "Online Knowledge Repository"
      ],
      correct_option_index: 1,
      explanation: "OKR stands for Objectives and Key Results, a goal setting framework pioneered by Intel and popularized by Google.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In talent management and succession planning, what two primary dimensions are evaluated on the '9-Box Grid' matrix?",
      options: [
        "Age and Salary",
        "Typing speed and Attendance",
        "Height and Weight",
        "Current Job Performance (X-axis) and Future Leadership Potential (Y-axis)"
      ],
      correct_option_index: 3,
      explanation: "The 9-Box Grid plots current performance against future growth/leadership potential on a 3x3 matrix.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What is a '360-Degree Feedback' appraisal system in human resources?",
      options: [
        "A performance review process that gathers anonymous feedback from multiple stakeholders surrounding an employee: direct manager, peers, direct reports, and self-evaluation",
        "A camera that rotates 360 degrees in the office",
        "A review conducted once every 360 days",
        "A feedback meeting where everyone sits in a complete circle"
      ],
      correct_option_index: 0,
      explanation: "360-degree feedback provides a comprehensive view by gathering evaluations from peers, subordinates, managers, and self-appraisal.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In Kim Scott's 'Radical Candor' framework, what are the two core dimensions required for giving healthy, direct feedback?",
      options: [
        "Speaking loudly and Writing emails",
        "Giving money and Buying gifts",
        "Caring Personally and Challenging Directly",
        "Ignoring mistakes and Praising everyone"
      ],
      correct_option_index: 2,
      explanation: "Radical Candor lies at the intersection of caring personally about the individual while challenging them directly on performance.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In professional employee coaching, what does the 'GROW' coaching model acronym stand for?",
      options: [
        "Grade, Rank, Organize, Win",
        "Goal, Current Reality, Options/Obstacles, Will/Way Forward",
        "Gain, Review, Observe, Work",
        "Growth, Revenue, Outcome, Wealth"
      ],
      correct_option_index: 1,
      explanation: "GROW structures coaching: establishing the Goal, examining Reality, exploring Options, and agreeing on the Will to act.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In OKR goal setting theory (John Doerr / Andy Grove), what is the optimal target achievement benchmark percentage for an ambitious 'Stretch OKR'?",
      options: [
        "10% (90% failure rate)",
        "50%",
        "Approximately 70% attainment (0.7 score); consistently achieving 100% indicates goals were set too safely without sufficient stretch",
        "100% mandatory perfection at all times"
      ],
      correct_option_index: 2,
      explanation: "A 70% average score indicates ambitious stretch goals; 100% completion signals that targets were too easy (sandbagged).",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "Why have modern high-performing organizations transitioned from traditional 'Annual Performance Appraisals' to 'Continuous Performance Management' (weekly/bi-weekly 1-on-1s)?",
      options: [
        "Annual reviews are backwards-looking, generate recency bias, and delay feedback by months; continuous dialogues provide real-time coaching, immediate course correction, and proactive blocker removal",
        "Because annual reviews take too much paper",
        "Because HR software is deleted every month",
        "Annual reviews were banned by labor courts"
      ],
      correct_option_index: 0,
      explanation: "Continuous performance feedback enables agile real-time course correction, eliminating the recency bias and anxiety of annual reviews.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In Kim Scott's Radical Candor matrix, what occurs when a manager 'Cares Personally' but FAILS to 'Challenge Directly' when an employee underperforms?",
      options: [
        "Radical Candor",
        "Obnoxious Aggression",
        "Manipulative Insincerity",
        "Ruinous Empathy (unwillingness to give constructive criticism for fear of hurting feelings, ultimately harming the employee's career and team performance)"
      ],
      correct_option_index: 3,
      explanation: "Ruinous Empathy occurs when kindness prevents constructive criticism, leaving the employee unaware of serious performance gaps.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What is the primary operational purpose of conducting a 'Performance Calibration Committee' meeting among cross-functional leaders?",
      options: [
        "To fire 10% of employees automatically",
        "To standardize performance evaluation benchmarks across departments, eliminating manager grading biases (e.g. lenient managers rating everyone high vs tough managers rating everyone low)",
        "To calculate company tax returns",
        "To assign office desks"
      ],
      correct_option_index: 1,
      explanation: "Calibration committees ensure fairness and consistency by aligning ratings across departments against objective standards.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In performance metrics, what is the difference between a 'Leading Indicator' and a 'Lagging Indicator'?",
      options: [
        "Leading indicators are for CEOs; lagging indicators are for interns",
        "Lagging indicators predict the future; leading indicators measure the past",
        "Leading indicators measure proactive input activities that influence future success (e.g. outbound calls, sprint velocity); Lagging indicators measure historical end results (e.g. quarterly revenue, customer churn)",
        "There is zero difference between them"
      ],
      correct_option_index: 2,
      explanation: "Leading indicators track input behaviors influencing upcoming outcomes; lagging indicators measure final historical results.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "Why is 'Decoupling OKR Completion Scores from Direct Salary and Bonus Calculations' a foundational best practice in modern performance management?",
      options: [
        "If bonuses are directly tied to 100% OKR attainment, employees will inevitably sandbag targets (set safe, conservative, easy goals), destroying company innovation and the psychological safety required for stretch goal attainment",
        "Because bonuses are illegal in tech companies",
        "To prevent employees from earning money",
        "OKRs can only be viewed by outside consultants"
      ],
      correct_option_index: 0,
      explanation: "Tying bonuses directly to OKR percentages encourages sandbagging; decoupling OKRs from comp fosters audacious innovation.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In the 9-Box Talent Matrix, how should an organization strategically manage and invest in a 'High-Performance, High-Potential' employee located in Box 9 ('Star / Top Talent')?",
      options: [
        "Give them routine administrative tasks",
        "Cut their compensation to test loyalty",
        "Place them on a performance improvement plan",
        "Accelerate stretch assignments, provide executive mentorship, prioritize retention and equity incentives, and prepare them for rapid succession into key leadership roles"
      ],
      correct_option_index: 3,
      explanation: "Box 9 Stars represent core future enterprise leadership, requiring executive mentoring, stretch projects, and strong retention incentives.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In weekly 1-on-1 manager-employee meetings, what percentage of the conversation should be driven by the EMPLOYEE's agenda vs the Manager's tactical updates?",
      options: [
        "100% driven by the manager's status checklist",
        "Predominantly employee-driven (at least 70-80% focused on employee priorities, blockers, career development, and feedback), with the manager facilitating and listening",
        "1-on-1s should have zero agenda",
        "Only the CEO can speak during 1-on-1s"
      ],
      correct_option_index: 1,
      explanation: "Effective 1-on-1s are employee-owned sessions designed for mentorship, problem solving, and developmental growth.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In performance appraisals, what is 'Central Tendency Bias' and how does it distort talent evaluations?",
      options: [
        "Evaluating everyone based on their location in the center of the office",
        "Rating employees based on their political views",
        "The tendency of reluctant or conflict-averse managers to rate ALL employees as average (e.g. 3 out of 5), failing to reward true top performers or address serious underperformers",
        "A mathematical error in spreadsheet software"
      ],
      correct_option_index: 2,
      explanation: "Central tendency bias clumps all ratings in the middle, obscuring top-performer contributions and protecting poor performance.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "When structuring an enforceable and fair Performance Improvement Plan (PIP), what documentation standards MUST be met to ensure legal defensibility and ethical governance?",
      options: [
        "Clear documentation of specific factual performance deficiencies, objective and measurable success criteria, provision of necessary resources/coaching, designated check-in dates, and explicit consequences of failure to meet standards",
        "A verbal promise to work harder",
        "A generic note stating 'needs better attitude'",
        "PIPs do not require written documentation"
      ],
      correct_option_index: 0,
      explanation: "Defensible PIPs require concrete factual evidence, measurable milestones, regular check-ins, and explicit outcome documentation.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #153.");
  console.log("Skill #153 update completed successfully!");
}

run();
