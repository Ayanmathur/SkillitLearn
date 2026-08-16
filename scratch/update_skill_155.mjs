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

const skillId = "efb13d85-beef-461b-9b94-8892ed069e6b";

async function run() {
  console.log("Updating Skill #155: Employee Engagement (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Engagement Psychology, Herzberg and The Gallup Q12" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Pulse Survey Design, eNPS and Action Planning" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Recognition Systems, Psychological Safety and Rituals" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Chief People Officer & Employee Experience Director level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "William Kahn's Engagement Theory and Self-Determination",
      order_index: 1,
      content: `### Theoretical Foundations of Workplace Engagement

1. Kahn's Tripartite Model:
   - Meaningful work, psychological safety, and physical/emotional availability driving the simultaneous employment of self in work roles.

2. Self-Determination Theory (SDT):
   - Nurturing Autonomy (agency over execution), Competence (mastery/growth), and Relatedness (belonging and human connection).`
    },
    {
      track_id: track1Id,
      title: "Herzberg's Two-Factor Motivator-Hygiene Theory",
      order_index: 2,
      content: `### Intrinsic Motivators vs Extrinsic Baseline Hygiene

1. Hygiene Factors:
   - Baseline requirements (salary, working conditions, job security, basic policy); eliminating dissatisfaction but never generating true engagement.

2. Motivator Factors:
   - Intrinsic drivers (achievement, recognition, meaningful responsibility, intellectual advancement) that actively ignite discretionary effort.`
    },
    {
      track_id: track1Id,
      title: "The Gallup Q12 Framework: 12 Drivers of High Performance",
      order_index: 3,
      content: `### Empirical Hierarchy of Engagement Drivers

1. The Q12 Hierarchy:
   - Basic Needs (clear expectations, materials/equipment).
   - Management Support (recognition in past 7 days, supervisor cares, encourages development).
   - Teamwork (opinions count, shared mission, best friend at work).
   - Growth (progress discussions, opportunities to learn).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Annual Census Surveys vs Continuous Pulse Listening",
      order_index: 1,
      content: `### Survey Architecture and Continuous Listening

1. Listening Strategy:
   - Combining comprehensive annual census benchmarks with real-time monthly/quarterly pulse surveys tracking specific organizational change initiatives.

2. Survey Rigor:
   - Utilizing 5-point Likert scales, anonymous data thresholds (minimum 5 respondents per team), and mobile-first frictionless response interfaces.`
    },
    {
      track_id: track2Id,
      title: "eNPS Calculations, Driver Analysis and Sentiment NLP",
      order_index: 2,
      content: `### Sentiment Analytics and Natural Language Processing

1. eNPS Mathematical Formula:
   - eNPS = % Promoters (score 9-10) - % Detractors (score 0-6).

2. Qualitative NLP Scraping:
   - Running automated natural language processing and theme clustering on open-ended comments to pinpoint friction drivers across departments.`
    },
    {
      track_id: track2Id,
      title: "Closed-Loop Action Planning and Preventing Survey Fatigue",
      order_index: 3,
      content: `### Rapid Remediation and Manager Action Sprints

1. Action Planning Cadence:
   - Mandating manager-led team debriefs within 30 days of survey closure; co-creating 2-3 focused action commitments.

2. Eliminating Cynicism:
   - Preventing survey fatigue by visibly tying executive policy and workplace changes directly to employee survey feedback.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Peer-to-Peer Recognition Programs and Social Rewards",
      order_index: 1,
      content: `### Values-Driven Appreciation Architecture

1. Social Recognition Platforms:
   - Empowering continuous peer-to-peer point allocations tied to corporate core values, redeemable for rewards.

2. Impact of Timely Recognition:
   - Reinforcing desired cultural behaviors immediately; frequent informal praise delivering 4x higher retention than annual service awards.`
    },
    {
      track_id: track3Id,
      title: "Amy Edmondson's Psychological Safety Framework",
      order_index: 2,
      content: `### Interpersonal Risk-Taking and Innovation

1. Psychological Safety Definition:
   - A shared belief among team members that the team is safe for interpersonal risk-taking, admitting mistakes, asking questions, and proposing unorthodox ideas.

2. Leadership Behaviors:
   - Demonstrating vulnerability, framing work as learning problems, and actively inviting input.`
    },
    {
      track_id: track3Id,
      title: "Stay Interviews, ERGs and Organizational Culture Rituals",
      order_index: 3,
      content: `### Proactive Retention and Inclusion Rituals

1. Stay Interviews:
   - Conducting proactive 1-on-1 retention dialogues with high-performing talent to understand what keeps them engaged and what might tempt them to leave.

2. Culture Rituals:
   - Transparent All-Hands Town Halls with unmoderated leadership Q&A and active Employee Resource Groups (ERGs).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #155.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In organizational psychology, how is the Employee Net Promoter Score (eNPS) calculated?",
      options: [
        "eNPS = (% Promoters who score 9-10) MINUS (% Detractors who score 0-6)",
        "eNPS = Average salary divided by total employees",
        "eNPS = Total hours worked minus total vacation days",
        "eNPS = Number of employees who resign each month"
      ],
      correct_option_index: 0,
      explanation: "eNPS subtracts the percentage of Detractors (0-6) from Promoters (9-10), with Passives (7-8) counted in total respondents.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "According to Frederick Herzberg's Two-Factor Theory, which of the following is categorized as an INTRINSIC MOTIVATOR that drives true job satisfaction and engagement?",
      options: [
        "Company parking spaces",
        "Working air conditioning",
        "Meaningful responsibility, personal achievement, and recognition for good work",
        "Basic monthly salary"
      ],
      correct_option_index: 2,
      explanation: "Intrinsic motivators (achievement, responsibility, recognition) generate true engagement; salary/conditions are hygiene factors.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In human resources management, what is a 'Stay Interview'?",
      options: [
        "An exit interview when an employee resigns",
        "A proactive structured conversation with a valued, high-performing current employee to understand what keeps them at the company and what might tempt them to leave",
        "A mandatory meeting where employees are forbidden from going home",
        "An interview for candidates applying for hotel jobs"
      ],
      correct_option_index: 1,
      explanation: "Stay interviews proactively identify retention drivers and friction points while key employees are still happily employed.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In organizational team dynamics, how did Harvard professor Amy Edmondson define 'Psychological Safety'?",
      options: [
        "Having security guards in the office building",
        "Installing firewalls on company computers",
        "Requiring all employees to pass psychological exams",
        "A shared belief held by team members that the team is safe for interpersonal risk-taking, admitting mistakes, and voicing unorthodox ideas without fear of humiliation or retribution"
      ],
      correct_option_index: 3,
      explanation: "Psychological safety enables candid collaboration and innovation by removing the fear of ridicule or punishment for making mistakes.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In the famous Gallup Q12 employee engagement survey, what does question Q04 ('In the last seven days, I have received recognition or praise for doing good work') measure?",
      options: [
        "The presence of timely, frequent manager and peer recognition in the workplace",
        "Whether the employee received a 50% cash bonus this week",
        "How many emails the employee sent",
        "Whether the company has an annual holiday party"
      ],
      correct_option_index: 0,
      explanation: "Gallup Q12 question 4 measures weekly positive reinforcement and recognition, a critical driver of psychological engagement.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In Herzberg's Motivator-Hygiene Theory, what happens when an employer improves 'Hygiene Factors' (such as paying market wages or fixing office air conditioning)?",
      options: [
        "Employees immediately become 500% more productive",
        "It generates passionate, long-term employee innovation",
        "It eliminates the need for any management leadership",
        "It eliminates workplace dissatisfaction and complaints, but DOES NOT actively motivate or create high psychological engagement"
      ],
      correct_option_index: 3,
      explanation: "Hygiene factors merely remove dissatisfaction; only intrinsic motivators (growth, meaning, autonomy) ignite true engagement.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "What is the primary cause of 'Survey Fatigue' and cynicism among corporate employees regarding engagement surveys?",
      options: [
        "Surveys that use too many colors",
        "Leadership repeatedly collects survey feedback from employees but fails to visibly communicate results, take meaningful action, or implement tangible changes",
        "Surveys being sent on Monday mornings",
        "Employees not liking multiple choice questions"
      ],
      correct_option_index: 1,
      explanation: "Survey fatigue is caused by lack of action: employees stop participating when leadership fails to close the loop and fix reported issues.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In Self-Determination Theory (Deci & Ryan), what are the THREE universal psychological needs that must be satisfied to foster high intrinsic motivation?",
      options: [
        "Autonomy (agency over one's work), Competence (mastery and growth), and Relatedness (belonging and connection to others)",
        "Money, Fame, and Power",
        "Food, Water, and Sleep",
        "Hardware, Software, and Network"
      ],
      correct_option_index: 0,
      explanation: "Self-Determination Theory proves intrinsic motivation thrives when Autonomy, Competence, and Relatedness are fulfilled.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In workplace culture, what are 'Employee Resource Groups' (ERGs)?",
      options: [
        "Groups that order office supplies",
        "Teams of lawyers who audit HR policies",
        "Voluntary, employee-led affinity groups organized around shared identities, backgrounds, or life experiences (e.g. Women in Tech, LGBTQ+, Veterans) that foster belonging and provide business insights",
        "Mandatory overtime groups"
      ],
      correct_option_index: 2,
      explanation: "ERGs build workplace community, mentorship, and inclusion for underrepresented identity groups while advising executive leadership.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "Why is 'Peer-to-Peer Social Recognition' often more effective in reinforcing positive organizational culture than formal annual executive awards?",
      options: [
        "Because executives are not allowed to praise employees",
        "Because peer recognition programs cost zero dollars",
        "Because annual awards are illegal in many states",
        "It enables immediate, real-time appreciation from coworkers who actually see daily contributions, embedding company core values into daily team interactions"
      ],
      correct_option_index: 3,
      explanation: "Peer recognition provides continuous, decentralized appreciation tied to daily behaviors rather than delayed once-a-year formalities.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In survey administration governance, what is the standard 'Confidentiality Threshold' (Anonymity Threshold) required to display team-level engagement survey results?",
      options: [
        "Results are displayed for teams of 1 person",
        "A minimum threshold of at least 5 completed survey responses per reporting group is strictly enforced; smaller teams have their data rolled up into the parent department to protect employee anonymity",
        "Surveys are never anonymous in business",
        "Results require a minimum of 5,000 employees"
      ],
      correct_option_index: 1,
      explanation: "Enforcing a minimum 5-respondent threshold ensures individual responses cannot be reverse-engineered by managers, protecting trust.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Google's 'Project Aristotle' research on team effectiveness, which single dynamic emerged as the NUMBER ONE prerequisite for high-performing teams?",
      options: [
        "Having the highest average IQ on the team",
        "Colocating all team members in the same physical room",
        "Psychological Safety: team members feeling confident that no one on the team will embarrass, reject, or punish them for speaking up, taking risks, or asking questions",
        "Paying everyone the exact same salary"
      ],
      correct_option_index: 2,
      explanation: "Google's Project Aristotle proved Psychological Safety is by far the most critical dynamic underpinning team innovation and output.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In engagement survey action planning, what is the 'Closed-Loop Action Planning' standard recommended to prevent cynicism?",
      options: [
        "Managers share survey results with their teams within 30 days, facilitate collaborative action sessions to choose 2-3 focused commitments, and track progress openly in monthly 1-on-1s and all-hands meetings",
        "HR keeps survey results secret from employees for 5 years",
        "The CEO fires all managers with low survey scores",
        "Surveys are deleted immediately after reading"
      ],
      correct_option_index: 0,
      explanation: "Closed-loop action planning commits to rapid transparent debriefs and collaborative action sprints within 30 days of survey close.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Kahn's foundational psychological theory of employee engagement, what are the three psychological conditions necessary for personal engagement at work?",
      options: [
        "Speed, Power, and Precision",
        "Money, Status, and Promotion",
        "Coffee, Snacks, and Free Lunch",
        "Meaningfulness (feeling work is worthwhile), Safety (trusting one will not suffer for self-expression), and Availability (having physical/emotional bandwidth to engage)"
      ],
      correct_option_index: 3,
      explanation: "William Kahn proved engagement occurs when employees experience psychological Meaningfulness, Safety, and Availability.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In organizational listening architecture, what is the strategic advantage of combining an Annual Census Survey with Monthly/Quarterly 'Pulse Surveys'?",
      options: [
        "To make sure employees never have free time",
        "The annual survey establishes broad longitudinal enterprise benchmarks, while lightweight pulse surveys track real-time sentiment and the direct impact of specific ongoing workplace initiatives and leadership changes",
        "Pulse surveys replace all performance reviews",
        "Pulse surveys are only given to interns"
      ],
      correct_option_index: 1,
      explanation: "Annual surveys provide deep comprehensive baselines, while agile pulse surveys track ongoing sentiment and initiative traction.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #155.");
  console.log("Skill #155 update completed successfully!");
}

run();
