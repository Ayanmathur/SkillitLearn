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

const skillId = "e8927156-5c34-4c7b-81fb-278b537606ee";

async function run() {
  console.log("Updating Skill #94: Hiring Your First Team (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Job Scorecard Architecture, Role Scoping and Sourcing Channels" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Structured Interviewing, Paid Work Trials and Reference Checks" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Compensation Design, 30-60-90 Day Onboarding and Culture" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / CPO & Talent Acquisition Director level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Geoff Smart's 'Who' Method: Job Scorecards vs Job Descriptions",
      order_index: 1,
      content: `### Executive Role Definition and Scorecard Architecture

1. The Job Scorecard Framework (Geoff Smart's 'Who'):
   - Replaces vague job descriptions with an objective blueprint defining what world-class execution looks like:
     - 1. Mission: 1-sentence executive summary of why the role exists.
     - 2. Outcomes: 3 to 5 measurable quantitative goals required within 12 months (e.g. \"Scale MRR from $20k to $100k\").
     - 3. Competencies: 5 to 8 behavioral traits required to hit outcomes.`
    },
    {
      track_id: track1Id,
      title: "Candidate Sourcing Engines: Inbound, Outbound and Referrals",
      order_index: 2,
      content: `### Talent Pipeline Generation and Outbound Recruitment

1. Multi-Pronged Sourcing Architecture:
   - Inbound Channels: Well-targeted posts on niche job boards (Wellfound, RemoteOK).
   - Direct Founder Outbound: Identifying passive high-performers on LinkedIn and GitHub with personalized founder-written pitch emails.
   - Warm Employee Referrals: Offering lucrative internal referral bonuses to capture pre-vetted talent.`
    },
    {
      track_id: track1Id,
      title: "Compelling Job Post Copywriting and Employer Branding",
      order_index: 3,
      content: `### High-Converting Job Post Marketing

1. High-Performing Opportunity Overview Structure:
   - Lead with company mission and market trajectory.
   - Outline the specific technical or commercial challenges they will own.
   - Full compensation transparency (base salary range + equity percentage).
   - Elimination of generic corporate jargon (\"fast-paced rockstar\") in favor of substantive autonomy.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The 4-Stage Structured Interview Funnel",
      order_index: 1,
      content: `### Bias Elimination and Topgrading Funnels

1. Standardized 4-Stage Interview Process:
   - 1. Screening Call (20 min): Basic role fit, salary expectations, and timeline alignment.
   - 2. Topgrading Interview (60 min): Chronological deep-dive into each career chapter (highs, lows, supervisor ratings, reasons for leaving).
   - 3. Focused Competency Interview (45 min): Deep technical or domain problem solving.
   - 4. Executive Alignment Call (30 min): Vision, culture, and closing.`
    },
    {
      track_id: track2Id,
      title: "Paid Practical Work Trials and Case Studies",
      order_index: 2,
      content: `### Objective Empirical Evaluation and Work Simulations

1. Paid Practical Work Trials:
   - Engaging top 2 finalists in a 1-day or weekend paid trial working on an actual anonymized business problem or codebase task.

2. Structured Evaluation Rubrics:
   - Grading candidate submissions on a 1-to-5 scale across predefined scorecard criteria, eliminating subjective gut-feel hiring decisions.`
    },
    {
      track_id: track2Id,
      title: "Rigorous Reference Checks and The Torpedo Question",
      order_index: 3,
      content: `### Reference Verification and Past Performance Audits

1. Past Manager Reference Calls:
   - Speaking directly with past direct supervisors rather than candidate-selected peers.

2. The Torpedo Question:
   - \"On a scale of 1 to 10, how would you rate their performance, and what would it take for them to have been a 10?\" (Any score below 8 is a severe red flag).`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Total Rewards: Cash, Equity Option Pools and Offer Closing",
      order_index: 1,
      content: `### Startup Compensation Architecture and Closing Calls

1. Total Rewards Package Formulation:
   - Balancing below-market cash salary with meaningful stock option equity grants (0.5% to 2.0% for first 10 engineering/sales hires with 4-year vesting).

2. The Dedicated Offer Closing Call:
   - Walking through valuation upside models, explaining ISO option tax mechanics, and addressing competing offers transparently.`
    },
    {
      track_id: track3Id,
      title: "The 30-60-90 Day Onboarding Blueprint",
      order_index: 2,
      content: `### New Hire Ramp Acceleration and Milestone Cadence

1. Structured 30-60-90 Day Onboarding Phases:
   - Days 1-30 (Learn & Absorb): Product immersion, customer support shadowing, and shipping first small code commit on Day 1.
   - Days 31-60 (Execute & Deliver): Leading core sprint projects and executing workflows independently.
   - Days 61-90 (Own & Innovate): Full autonomous ownership and proposing strategic operational improvements.`
    },
    {
      track_id: track3Id,
      title: "High-Performance Culture, Radical Candor and Fast Parting",
      order_index: 3,
      content: `### Continuous Feedback and Probationary Governance

1. Radical Candor (Kim Scott):
   - Practicing weekly 1-on-1 feedback combining personal care with direct, unvarnished challenge to foster rapid professional growth.

2. Fast Termination Protocols:
   - Decisively parting ways with cultural mismatches or underperforming hires within the 90-day probationary window with fair severance, protecting team morale.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #94.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In Geoff Smart's 'Who' hiring framework, what are the three core sections of a professional Job Scorecard?",
      options: [
        "Mission, Measurable Outcomes (3-5 goals), and Core Competencies",
        "Salary, Vacation Days, and Office Location",
        "Age, Height, and Weight",
        "Resume, College GPA, and Social Media links"
      ],
      correct_option_index: 0,
      explanation: "A Job Scorecard defines the Role Mission, quantifiable 12-month Outcomes, and behavioral Competencies.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In startup equity compensation, what typical stock option equity grant range is standard for early key hires (first 10 employees)?",
      options: [
        "0.001%",
        "50% to 80%",
        "0.5% to 2.0% (subject to 4-year vesting with a 1-year cliff)",
        "100% of the company"
      ],
      correct_option_index: 2,
      explanation: "Early key hires typically receive 0.5% to 2.0% equity depending on seniority, vesting over 4 years with a 1-year cliff.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In reference checking methodology, what is 'The Torpedo Question' used to uncover hidden performance issues?",
      options: [
        "What is the candidate's favorite food?",
        "'On a scale of 1 to 10, how would you rate their performance, and what would it take for them to have been a 10?'",
        "Where did the candidate go to school?",
        "Do you like working in an office?"
      ],
      correct_option_index: 1,
      explanation: "The Torpedo Question forces references past generic praise to reveal authentic weaknesses and areas for improvement.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In new employee onboarding, what is the goal of the first 30 days in a '30-60-90 Day Plan'?",
      options: [
        "Taking a month-long vacation",
        "Rewriting the entire company codebase from scratch",
        "Firing other employees",
        "Learning the business model, shadowing customer workflows, absorbing team context, and shipping a small quick win on Day 1"
      ],
      correct_option_index: 3,
      explanation: "Day 1-30 focuses on deep context absorption, customer understanding, and building initial momentum.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In Kim Scott's management philosophy, what does 'Radical Candor' mean?",
      options: [
        "Caring personally for team members while challenging them directly with clear, immediate feedback",
        "Yelling at employees in public",
        "Never giving critical feedback to avoid hurting feelings",
        "Ignoring employee performance completely"
      ],
      correct_option_index: 0,
      explanation: "Radical Candor balances deep personal care with direct, honest feedback to drive high performance.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "Why are 'Paid Practical Work Trials' superior to traditional resume-based interviews for evaluating top candidate finalists?",
      options: [
        "They make hiring completely free",
        "They eliminate the need to pay salaries",
        "They are legally required by federal labor law",
        "They evaluate real, hands-on job performance on actual simulated company tasks, removing subjective interview charisma bias"
      ],
      correct_option_index: 3,
      explanation: "Work trials test actual execution, problem-solving, and communication on real tasks, bypassing smooth interview talkers.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In structured interviewing, what is a 'Topgrading Interview'?",
      options: [
        "Grading an employee on a report card",
        "A chronological walkthrough of a candidate's entire career history, analyzing successes, failures, boss ratings, and reasons for leaving each role",
        "Testing a candidate's typing speed",
        "An interview conducted on top of a mountain"
      ],
      correct_option_index: 1,
      explanation: "Topgrading chronologically inspects each past career role to identify consistent patterns of high performance and truthfulness.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In early-stage talent acquisition, why is 'Founder-Led Direct Outbound Sourcing' more effective than passive job postings for key roles?",
      options: [
        "Top-tier talent is currently employed and not browsing job boards; personal founder outreach with a compelling vision attracts high-performing passive candidates",
        "Outbound sourcing costs $0 in taxes",
        "Job boards are banned in technology startups",
        "Founders have nothing else to do"
      ],
      correct_option_index: 0,
      explanation: "Exceptional talent rarely searches job boards; personalized founder pitches cut through noise to engage passive superstars.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In startup talent governance, why is 'Fast Termination' within the 90-day probationary window critical when a hire is a clear cultural or performance mismatch?",
      options: [
        "To save on holiday party costs",
        "To show off executive power",
        "Prolonging a bad hire drains founder energy, damages team morale, lowers cultural standards, and costs far more in lost momentum than decisive separation",
        "Because probation periods cannot be extended"
      ],
      correct_option_index: 2,
      explanation: "Keeping poor fits poisons culture and drags down team velocity; swift, compassionate separation protects the organization.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In candidate evaluation, what is the role of a 'Structured Evaluation Rubric'?",
      options: [
        "A game played during lunch",
        "A spreadsheet tracking employee vacation time",
        "A list of interview jokes",
        "A standardized scoring sheet with explicit grading criteria for each scorecard competency, ensuring all interviewers evaluate candidates objectively"
      ],
      correct_option_index: 3,
      explanation: "Rubrics ensure every interviewer scores candidates against the same objective standards, eliminating subjective bias.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In executive reference checking, why should founders conduct 'Backchannel Reference Calls' in addition to candidate-provided references?",
      options: [
        "Candidate-provided references are always illegal",
        "Candidate-provided references are hand-picked friends biased to give glowing reviews; backchannel calls with past managers and peers provide unvarnished, authentic feedback",
        "Backchannel calls are automated by AI",
        "To find out the candidate's political views"
      ],
      correct_option_index: 1,
      explanation: "Backchannel calls reach unbiased past colleagues who provide raw, honest perspectives on work ethic and teamwork.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In startup offer closing strategy, what is the structure and purpose of the 'Sell Meeting'?",
      options: [
        "Selling company products to the candidate",
        "Asking the candidate to invest money in the startup",
        "A dedicated call to walk through equity upside models, explain option vesting mechanics, articulate why the candidate is essential, and address competing offers",
        "Negotiating office furniture"
      ],
      correct_option_index: 2,
      explanation: "The Sell Meeting clarifies equity upside, validates the candidate's unique impact, and closes the deal with high enthusiasm.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In job post copywriting, why should early startups avoid generic clichés like 'Rockstar Ninja' or 30-item qualification laundry lists?",
      options: [
        "They repel experienced high-performers who seek clear autonomy, quantifiable impact, and mature professional respect rather than superficial buzzwords",
        "Clichés cause website code crashes",
        "They make job posts too short",
        "They are prohibited by copyright laws"
      ],
      correct_option_index: 0,
      explanation: "Top performers want to know the real business mission and ownership scope, not juvenile buzzwords.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In 30-60-90 day onboarding planning, why is having an engineer ship their first small code commit on 'Day 1' considered best practice?",
      options: [
        "To test if the servers crash",
        "Because developers are not allowed to read documentation",
        "To replace the senior engineering team",
        "It validates that developer environment setup, permissions, and CI/CD deployment pipelines work immediately while instilling immediate confidence and momentum"
      ],
      correct_option_index: 3,
      explanation: "Shipping on Day 1 confirms development tooling is operational and builds immediate psychological momentum and ownership.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In Kim Scott's Radical Candor matrix, what dangerous management failure occurs when leaders 'Care Personally' but 'Fail to Challenge Directly'?",
      options: [
        "Obnoxious Aggression",
        "Ruinous Empathy (being so polite and afraid of hurting feelings that critical performance flaws go unmentioned, ultimately harming the employee and company)",
        "Manipulative Insincerity",
        "Radical Leadership"
      ],
      correct_option_index: 1,
      explanation: "Ruinous Empathy shields employees from necessary critique, allowing bad habits to compound until sudden termination is inevitable.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #94.");
  console.log("Skill #94 update completed successfully!");
}

run();
