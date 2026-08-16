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

const skillId = "477f0521-21ce-4a38-b01d-68f3c04f9aa8";

async function run() {
  console.log("Updating Skill #150: Interviewing Techniques (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Structured Interviewing, STAR Method and BARS Rubrics" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Competency Mapping, Case Probes and Work Samples" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Cognitive Debiasing, Legal Compliance and Debriefs" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Organizational Psychologist & Head of Assessment level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Predictive Validity of Structured vs Unstructured Interviews",
      order_index: 1,
      content: `### Industrial-Organizational Psychology Foundations

1. Scientific Predictive Validity:
   - Structured interviews achieve high predictive job performance validity (r = 0.51 to 0.58) compared to unstructured casual conversations (r = 0.20).

2. Standardization Protocol:
   - Asking identical predefined questions in the exact same sequence with standardized evaluation scoring criteria across all candidates.`
    },
    {
      track_id: track1Id,
      title: "The STAR Framework and Probing Candidate Actions",
      order_index: 2,
      content: `### Behavioral Exploration Mechanics

1. The STAR Method:
   - Situation (context/challenge), Task (required responsibility), Action (specific individual contribution), and Result (quantifiable business impact).

2. Probing Mechanics:
   - Drilling past team 'we' narratives to extract the candidate's exact individual 'I' ownership, architectural choices, and personal interventions.`
    },
    {
      track_id: track1Id,
      title: "Behaviorally Anchored Rating Scales (BARS) Design",
      order_index: 3,
      content: `### Objective Competency Rubric Construction

1. BARS Architecture:
   - Establishing 1-to-5 scoring rubrics where each numerical rating is anchored by concrete, observable behavioral descriptions rather than subjective impressions.

2. Calibration Consistency:
   - Training interview panels on rubric benchmarks to eliminate inter-rater grading variances.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Behavioral vs Situational Questions and Competencies",
      order_index: 1,
      content: `### Core Assessment Question Formats

1. Behavioral vs Situational:
   - Behavioral ('Tell me about a time you resolved cross-functional conflict') evaluates proven past actions.
   - Situational ('Imagine a critical production system fails...') tests forward-looking problem-solving models.

2. Competency Alignment:
   - Mapping each interview session to 2-3 specific distinct organizational competencies.`
    },
    {
      track_id: track2Id,
      title: "Work-Sample Tests, Case Studies and Technical Probing",
      order_index: 2,
      content: `### Practical Simulations and Proof of Work

1. Work-Sample Tests:
   - Practical real-world job simulations (e.g. code pairing, system architecture case studies, writing briefs) demonstrating the highest predictive validity in hiring science.

2. Cognitive Probing:
   - Probing edge-cases, system constraints, trade-off evaluations, and architectural justifications.`
    },
    {
      track_id: track2Id,
      title: "Failure Autopsies, Self-Reflection and Growth Mindset",
      order_index: 3,
      content: `### Evaluating Resilience and Metacognition

1. The Failure Autopsy:
   - Exploring candidate mistakes and setbacks: 'What was your biggest professional failure, why did it occur, and what would you do differently today?'

2. Psychological Indicators:
   - Identifying radical self-accountability, resilience, and growth mindset vs external blame shifting.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Cognitive Biases: Halo Effect, Affinity Bias and Contrast",
      order_index: 1,
      content: `### Interviewer Psychological Pitfalls

1. Common Biases:
   - Halo/Horns Effect (one trait skewing overall judgment).
   - Similarity/Affinity Bias (favoring candidates with shared backgrounds/schools).
   - Contrast Effect (grading a candidate relative to previous interviewee rather than objective rubric).

2. Anchoring Bias:
   - Rushing to judgment in the first 3 minutes.`
    },
    {
      track_id: track3Id,
      title: "Independent Blind Scorecards and Bar Raiser Programs",
      order_index: 2,
      content: `### Objective Panel Governance and Bar Raisers

1. Blind Scorecard Submission:
   - Requiring all interviewers to submit written feedback and numerical ratings independently before viewing peer assessments.

2. Bar Raiser Mechanism:
   - Deploying an independent interviewer outside the hiring department with veto authority, ensuring every hire raises the company's long-term talent bar.`
    },
    {
      track_id: track3Id,
      title: "Title VII Legal Compliance and Prohibited Interview Inquiries",
      order_index: 3,
      content: `### Employment Law and Protected Characteristics

1. Prohibited Inquiries:
   - Banning all questions regarding age, marital status, pregnancy/family plans, religion, national origin, race, disability, and past arrest records under Title VII / EEOC laws.

2. Post-Interview Debriefs:
   - Facilitating objective calibration meetings focused exclusively on rubric evidence.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #150.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In behavioral interviewing, what does the structured evaluation acronym 'STAR' stand for?",
      options: [
        "Situation, Task, Action, Result",
        "System, Technology, Architecture, Review",
        "Salary, Time, Agreement, Retention",
        "Skill, Talent, Attitude, Reliability"
      ],
      correct_option_index: 0,
      explanation: "STAR stands for Situation (context), Task (goal), Action (what the candidate specifically did), and Result (quantifiable outcome).",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "Under Title VII of the Civil Rights Act and EEOC guidelines, which question is STRICTLY ILLEGAL to ask a job candidate during an interview?",
      options: [
        "What programming languages are you proficient in?",
        "Are you available to work on Monday mornings?",
        "Do you have children or are you planning to become pregnant in the near future?",
        "Can you describe a time you handled a difficult project deadline?"
      ],
      correct_option_index: 2,
      explanation: "Inquiries regarding pregnancy, family planning, marital status, religion, age, or disability are strictly unlawful under EEOC regulations.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In industrial-organizational psychology, what is the core difference between a 'Structured Interview' and an 'Unstructured Interview'?",
      options: [
        "Structured interviews are conducted outdoors",
        "A structured interview asks every candidate the same predetermined questions in the exact same sequence with a standardized objective rubric; unstructured interviews are casual, non-standardized conversations",
        "Structured interviews only last 5 minutes",
        "There is zero difference between them"
      ],
      correct_option_index: 1,
      explanation: "Structured interviews standardize questions, sequence, and scoring rubrics across all applicants to ensure objective comparison.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In hiring bias psychology, what is the 'Halo Effect'?",
      options: [
        "Wearing bright clothing to an interview",
        "Candidates seeing halos during technical tests",
        "A candidate refusing to answer questions",
        "A cognitive bias where one exceptionally positive trait (such as a prestigious university or charismatic appearance) causes an interviewer to overlook deficiencies and rate all other competencies overly high"
      ],
      correct_option_index: 3,
      explanation: "The Halo Effect occurs when an interviewer lets a single positive attribute color their entire judgment of a candidate.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In interview question taxonomy, what distinguishes a 'Behavioral Question' from a 'Situational Question'?",
      options: [
        "Behavioral questions ask about specific past experiences ('Tell me about a time you...'); Situational questions present hypothetical future scenarios ('Imagine a server goes down...')",
        "Behavioral questions are only for actors",
        "Situational questions are illegal",
        "Behavioral questions never require answers"
      ],
      correct_option_index: 0,
      explanation: "Behavioral questions explore proven past actions; situational questions assess hypothetical future problem-solving logic.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In assessment design, what are 'Behaviorally Anchored Rating Scales' (BARS) and why are they superior to generic 1-to-5 rating scales?",
      options: [
        "Rating scales that measure physical strength",
        "Scales that average all candidate test scores together",
        "Rating systems used only in military bootcamps",
        "Scoring rubrics where every single numerical rating (1 to 5) is explicitly defined by concrete, observable behavioral examples of poor, satisfactory, and exceptional performance, drastically reducing subjective grading bias"
      ],
      correct_option_index: 3,
      explanation: "BARS anchors numbers to concrete behavioral benchmarks, ensuring all interviewers evaluate candidates against identical standards.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "Why is 'Independent Blind Scorecard Submission' mandated across top-tier hiring organizations prior to a group calibration debrief?",
      options: [
        "To prevent interviewers from seeing the candidate's resume",
        "It forces interviewers to independently write notes and submit their scores before viewing peer feedback, preventing dominant or senior panel members from unduly influencing or anchoring everyone's ratings",
        "To save computer memory",
        "Blind scoring is required by international trade law"
      ],
      correct_option_index: 1,
      explanation: "Blind scorecards eliminate groupthink and anchoring bias by requiring independent evaluation before peer discussion.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In selection science research (e.g. Schmidt & Hunter meta-analyses), which evaluation method demonstrates the HIGHEST predictive validity for actual future on-the-job performance?",
      options: [
        "Work-Sample Tests (hands-on practical job simulations, code pairing, case studies) combined with structured cognitive/behavioral interviews",
        "Unstructured 15-minute informal coffee chats",
        "Handwriting graphology analysis",
        "Astrological sign matching"
      ],
      correct_option_index: 0,
      explanation: "Work-sample tests combined with structured interviews demonstrate the highest statistical correlation with actual job performance.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In interview cognitive bias, what is the 'Contrast Effect'?",
      options: [
        "Adjusting the brightness of the video monitor",
        "Wearing black and white suits to an interview",
        "Evaluating a candidate's performance inaccurately because their interview immediately followed an exceptionally weak or exceptionally strong candidate, distorting the objective baseline",
        "A candidate having contrasting opinions with the hiring manager"
      ],
      correct_option_index: 2,
      explanation: "Contrast effect skews ratings when a candidate is judged in comparison to the previous interviewee rather than against the objective rubric.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In technology hiring frameworks (such as Amazon's 'Bar Raiser' program), what is the specific role and authority of the Bar Raiser?",
      options: [
        "To serve drinks at the post-interview party",
        "To clean the interview rooms",
        "To negotiate the candidate's stock options",
        "An objective, highly trained interviewer from outside the hiring department who evaluates long-term cultural alignment and holds veto authority over hiring decisions to ensure every hire is better than 50% of current staff"
      ],
      correct_option_index: 3,
      explanation: "Bar Raisers are independent objective interviewers with veto power, preventing managers from lowering standards to fill urgent vacancies.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "When a candidate answers a STAR behavioral question using vague collective phrases ('We designed the database and we scaled the system'), what is the required probing technique?",
      options: [
        "Immediately fail the candidate and end the interview",
        "Interrupt politely and drill down into the candidate's specific personal contributions: 'What was your specific individual role in that project? What exact lines of code or architectural decisions did you personally own?'",
        "Assume the candidate did 100% of the team's work",
        "Ask the candidate to name every person on the team"
      ],
      correct_option_index: 1,
      explanation: "Effective interviewers probe past collective 'we' claims to isolate the candidate's authentic individual 'I' ownership and decisions.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In cognitive psychology and executive hiring, what is the purpose of conducting a structured 'Failure Autopsy' interview probe ('Tell me about a major project failure you led')?",
      options: [
        "To humiliate the candidate and see if they cry",
        "To gather trade secrets from competitor failures",
        "To evaluate the candidate's metacognition, self-awareness, personal accountability, and capacity to extract lessons and adapt strategies without shifting blame to subordinates or external factors",
        "To check if the candidate has any criminal records"
      ],
      correct_option_index: 2,
      explanation: "Failure autopsies evaluate resilience, growth mindset, and intellectual honesty by observing how candidates process accountability.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In predictive validity research in industrial psychology, what are the approximate statistical validity coefficients (r) comparing Structured Interviews to Unstructured Interviews?",
      options: [
        "Structured Interviews achieve r = 0.51 to 0.58; Unstructured Interviews achieve only r = 0.14 to 0.20 (barely better than random coin flips)",
        "Both have identical validity of r = 0.99",
        "Unstructured interviews are 10 times more predictive than structured interviews",
        "Interview validity cannot be measured statistically"
      ],
      correct_option_index: 0,
      explanation: "Scientific research proves structured interviews are more than 2.5x more predictive of performance than unstructured chats.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In EEOC compliance and hiring interview audits, why is taking structured, objective notes documenting ONLY observable behaviors and factual responses essential?",
      options: [
        "To write a biography about the candidate",
        "To publish interview notes on social media",
        "To practice typing speed during interviews",
        "Subjective notes (e.g. 'bad attitude', 'not a culture fit') create severe legal exposure in discrimination lawsuits; factual behavioral notes directly tied to job competencies provide legally defensible proof of merit-based hiring"
      ],
      correct_option_index: 3,
      explanation: "Objective behavioral notes protect organizations against Title VII lawsuits by proving decisions were based solely on job-related competencies.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In candidate evaluation debriefs, what is 'Affinity Bias' (Similarity Bias) and how does a structured panel mitigate it?",
      options: [
        "A preference for candidates who like computers",
        "The subconscious tendency of interviewers to favor candidates who share similar backgrounds, alma maters, hobbies, or personality styles; mitigated by evaluating candidates strictly against competency rubrics rather than 'gut feel'",
        "A bias towards candidates who ask for low salaries",
        "Affinity bias only applies to internal transfer employees"
      ],
      correct_option_index: 1,
      explanation: "Affinity bias causes interviewers to favor candidates who resemble themselves; strict BARS rubrics eliminate gut-feel hiring.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #150.");
  console.log("Skill #150 update completed successfully!");
}

run();
