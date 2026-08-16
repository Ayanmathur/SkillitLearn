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

const skillId = "90ae70d1-7f51-4cdd-bdf1-b70aba9ff506";

async function run() {
  console.log("Updating Skill #149: Sourcing & Recruiting (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Advanced Boolean Search, X-Ray and Talent Mapping" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Passive Outreach Psychology, Cadence and Conversion" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Screening Intake, ATS Pipelines and Sourcing Ratios" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Principal Technical Recruiter & Head of Sourcing level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Boolean Search String Architecture and Logical Operators",
      order_index: 1,
      content: `### Complex Boolean Syntax and Query Engineering

1. Logical Operators:
   - AND (intersection), OR (expansion/synonyms), NOT (exclusion), Quotation Marks (exact phrases), and Parentheses for nested logical groupings.

2. Syntax Modifiers:
   - Wildcards (*) and phrase variations capturing title variations (e.g. ('Software Engineer' OR 'Backend Developer') AND ('Distributed Systems' OR Kubernetes) NOT (Junior OR Intern)).`
    },
    {
      track_id: track1Id,
      title: "Google X-Ray Search Techniques Across Niche Platforms",
      order_index: 2,
      content: `### Search Engine Modifiers and Deep Sourcing

1. X-Ray Operators:
   - site: (constraining search to domains like site:linkedin.com/in/ or site:github.com).
   - filetype: (uncovering public resumes via filetype:pdf OR filetype:docx).
   - intitle: and inurl: (pinpointing portfolio and directory URLs).

2. Technical Talent Sourcing:
   - Mining GitHub repositories, Stack Overflow leaderboards, and Kaggle competitions for specialized passive technical talent.`
    },
    {
      track_id: track1Id,
      title: "Market Mapping, Feeder Companies and Org Chart Scraping",
      order_index: 3,
      content: `### Competitive Intelligence and Talent Landscape

1. Talent Market Mapping:
   - Identifying tier-1 competitor feeder companies, skill density clusters, and compensation geographic tiers.

2. Org Chart Construction:
   - Reverse-engineering engineering hierarchy trees to identify mid-level and senior ICs before competitors engage them.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Cold Outreach Copywriting and What's-In-It-For-Me (WIIFM)",
      order_index: 1,
      content: `### Passive Candidate Engagement Psychology

1. High-Converting Copywriting:
   - Short personalized subject lines (< 5 words), individualized hooks referencing specific past projects, and compelling WIIFM value propositions.

2. Low-Friction Calls to Action (CTA):
   - Asking for a casual 10-minute exploratory conversation rather than pushing a formal job application upfront.`
    },
    {
      track_id: track2Id,
      title: "Multi-Touchpoint Omni-Channel Outreach Cadences",
      order_index: 2,
      content: `### Multi-Channel Sequencing and Timing

1. Cadence Architecture:
   - Structuring 4 to 6 touchpoints across 14 business days (e.g. Day 1: LinkedIn InMail; Day 3: Personalized Email; Day 7: Content bump; Day 14: Polite breakup email).

2. Conversion Metrics:
   - Achieving 40-60% passive response rates through persistent, value-added follow-up cadences.`
    },
    {
      track_id: track2Id,
      title: "Overcoming Candidate Objections and Counter-Offers",
      order_index: 3,
      content: `### Candidate Reluctance and Retentive Counter-Offers

1. Addressing Reluctance:
   - Uncovering underlying motivations (autonomy, tech stack, leadership, equity upside) to reframe career transition benefits.

2. Pre-empting Counter-Offers:
   - Exploring counter-offer statistics early to prepare passive candidates for current employer retention tactics.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Hiring Manager Intake Alignment and Calibration Profiles",
      order_index: 1,
      content: `### Requisition Calibration and Role Definition

1. Intake Meeting Protocol:
   - Establishing Must-Haves vs Nice-to-Haves, target company lists, scorecards, and salary bounds.

2. Calibration Profiles:
   - Reviewing 5 benchmark profiles with the hiring manager in the first 48 hours to align on quality and caliber before launching full pipeline sourcing.`
    },
    {
      track_id: track3Id,
      title: "Behavioral Recruiter Phone Screens and Competency Evaluation",
      order_index: 2,
      content: `### Structured Initial Candidate Evaluation

1. Screen Protocol:
   - Assessing career trajectory motivations, culture alignment, baseline technical scope, geographic flexibility, and salary expectations.

2. Risk Flagging:
   - Identifying unaligned compensation expectations, employment authorization constraints, or conflicting timeline milestones early.`
    },
    {
      track_id: track3Id,
      title: "ATS Pipeline Architecture, Sourcing Ratios and Metrics",
      order_index: 3,
      content: `### Funnel Velocity and Conversion Ratios

1. Pipeline Funnel Ratios:
   - Benchmarking pipeline conversion funnel (e.g. 100 Sourced -> 20 Screened -> 8 Hiring Manager Review -> 3 Final Panel -> 1 Hired).

2. ATS Workflow Governance:
   - Enforcing disposition reason hygiene, stage SLA tracking, and OFCCP / EEOC regulatory compliance.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #149.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In Boolean search syntax used by professional recruiters, which operator is used to EXPAND search results to include synonyms or alternative job titles (such as 'Software Engineer' or 'Developer')?",
      options: [
        "AND",
        "OR",
        "NOT",
        "MINUS"
      ],
      correct_option_index: 1,
      explanation: "The Boolean 'OR' operator broadens search queries by capturing any matching synonym or alternative phrase in the group.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In Google X-Ray sourcing, what search modifier allows a recruiter to target public candidate profiles hosted specifically on LinkedIn?",
      options: [
        "filetype:linkedin",
        "find:linkedin",
        "search(linkedin)",
        "site:linkedin.com/in/"
      ],
      correct_option_index: 3,
      explanation: "'site:linkedin.com/in/' restricts search engine queries specifically to individual public LinkedIn profile URLs.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In recruitment, what is a 'Passive Candidate'?",
      options: [
        "An employed professional who is currently NOT actively looking for a new job, but may be open to compelling opportunities if approached strategically",
        "A candidate who sleeps during an interview",
        "A person who sends 50 resumes every day",
        "A retired worker who has left the workforce"
      ],
      correct_option_index: 0,
      explanation: "Passive candidates are employed professionals not actively browsing job boards, requiring proactive sourcing outreach.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What is an 'Applicant Tracking System' (ATS)?",
      options: [
        "A GPS tracker attached to candidate cars",
        "An accounting tool for paying taxes",
        "A software application that manages the end-to-end recruitment lifecycle, tracking candidate progression through sourcing, screening, interviews, and hiring",
        "A social media chat app"
      ],
      correct_option_index: 2,
      explanation: "An ATS is the core database managing candidate applications, pipeline stages, interview feedback, and compliance.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In Boolean search strings, what is the purpose of enclosing words in Quotation Marks (e.g. \"Product Manager\")?",
      options: [
        "To make the font italic",
        "To command the search engine to match that exact phrase with words in that precise order, rather than matching individual words separately across the page",
        "To translate the words into another language",
        "Quotation marks delete the phrase from search results"
      ],
      correct_option_index: 1,
      explanation: "Quotation marks enforce exact-phrase matching, preventing search engines from matching isolated words out of order.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In sourcing technical engineers, why do recruiters X-Ray platforms like GitHub and Stack Overflow rather than relying solely on LinkedIn?",
      options: [
        "Because GitHub has free food coupons",
        "Because LinkedIn accounts are illegal for engineers",
        "GitHub and Stack Overflow provide objective evidence of real code repositories, technical contributions, open-source projects, and technical peer reputation",
        "Engineers do not have internet access on LinkedIn"
      ],
      correct_option_index: 2,
      explanation: "Technical platforms provide proof-of-work, code repositories, and technical domain depth beyond static self-written resumes.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In the first 48 hours after opening a new job requisition, what is the primary purpose of reviewing 3 to 5 'Calibration Profiles' with the Hiring Manager?",
      options: [
        "To align immediately on candidate caliber, must-have skills versus nice-to-have preferences, and realistic market expectations before wasting sourcing time",
        "To reject all internal candidates",
        "To test if the hiring manager is paying attention",
        "To check the hiring manager's computer screen"
      ],
      correct_option_index: 0,
      explanation: "Calibration profiles ensure recruiter and hiring manager are perfectly aligned on candidate scope before launching full outreach.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In passive candidate email copywriting, what is a 'Low-Friction Call to Action' (CTA)?",
      options: [
        "Demanding the candidate submit an 8-page assignment by tomorrow",
        "Asking the candidate to quit their current job immediately",
        "Telling the candidate to fill out a 20-field application form",
        "Inviting the candidate to a brief, casual 10-to-15 minute exploratory phone chat to discuss their career goals without any pressure to apply"
      ],
      correct_option_index: 3,
      explanation: "Low-friction CTAs lower psychological resistance, drastically increasing passive candidate reply rates.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In recruitment search syntax, what does the Boolean operator 'NOT' (or '-' minus sign in Google) accomplish?",
      options: [
        "It searches for negative news stories",
        "It excludes specific unwanted terms, job levels, or skills from the search results (e.g. NOT 'Junior' OR NOT 'Intern')",
        "It multiplies the search results by 10",
        "It stops the computer from searching"
      ],
      correct_option_index: 1,
      explanation: "The 'NOT' operator filters out irrelevant profiles (excluding interns, juniors, agencies, or unwanted skills).",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In passive outreach campaign strategy, what is the optimal multi-touchpoint sequence cadence?",
      options: [
        "Sending 1 single email and never contacting the person again if they do not reply in 1 hour",
        "Calling the candidate 20 times every day",
        "A structured 4 to 6 touchpoint sequence spanning 14 business days across email and LinkedIn with value-add messages, increasing response rates by up to 60%",
        "Visiting the candidate's home unannounced"
      ],
      correct_option_index: 2,
      explanation: "Multi-touchpoint cadences over 2 weeks maximize reply conversion without being spammy, capturing busy passive talent.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In advanced sourcing strategy, what is 'Talent Market Mapping' and how is it executed?",
      options: [
        "Systematically researching and documenting the total available candidate pool across competitor feeder companies, skill density hubs, compensation tiers, and organizational charts to identify exactly where target talent resides",
        "Drawing geographical maps of city streets",
        "Counting the number of chairs in an office",
        "Creating a travel itinerary for executives"
      ],
      correct_option_index: 0,
      explanation: "Talent mapping systematically charts competitor talent pools and organizational structures to execute proactive hiring.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In recruitment pipeline analytics, what does a '100:20:8:3:1' sourcing-to-hire funnel ratio indicate?",
      options: [
        "The number of hours worked per week",
        "The salary bonus percentages for executives",
        "The budget allocated to different departments",
        "For every 100 passive candidates sourced, 20 are screened, 8 proceed to hiring manager review, 3 reach final panel interviews, and 1 receives/accepts an offer"
      ],
      correct_option_index: 3,
      explanation: "Pipeline ratios establish the volume of sourced top-of-funnel talent required to produce one successful hire.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Google X-Ray syntax, what search string correctly isolates publicly exposed PDF resumes of Data Engineers with Spark and AWS experience?",
      options: [
        "find me data engineers with spark and aws on pdf",
        "site:linkedin.com/in/ OR filetype:pdf 'Data Engineer' (Spark OR PySpark) AWS -job -jobs -template",
        "resume.doc search spark aws",
        "data engineer pdf download free"
      ],
      correct_option_index: 1,
      explanation: "Using 'filetype:pdf' combined with exact titles, boolean skill groups, and excluding job posting spam ('-job -jobs') extracts true resumes.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In candidate phone screening, what is the best practice method for addressing 'Compensation Expectations' to prevent late-stage offer collapse?",
      options: [
        "Never discuss money until the employee has worked for 6 months",
        "Tell the candidate they will be paid minimum wage",
        "Transparently state the budgeted salary range for the role early in the initial screen, and confirm the candidate's target compensation falls within that band before advancing them",
        "Guess the candidate's current salary without asking"
      ],
      correct_option_index: 2,
      explanation: "Aligning on transparent salary bands during the initial phone screen prevents wasted interview cycles and late offer rejections.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In talent sourcing psychology, what does 'WIIFM' stand for and why must cold outreach messages be structured around it?",
      options: [
        "'What's In It For Me' (the candidate): passive talent cares about career growth, autonomy, impact, and compensation rather than why the hiring company needs an employee",
        "Work In International Financial Markets",
        "Where Is It Found Manually",
        "When Is Income Formally Managed"
      ],
      correct_option_index: 0,
      explanation: "WIIFM shifts the message focus from company needs to candidate career value, dramatically elevating passive outreach conversion.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #149.");
  console.log("Skill #149 update completed successfully!");
}

run();
