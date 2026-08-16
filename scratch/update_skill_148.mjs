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

const skillId = "8496f786-344a-4725-8794-5e4c0bf240f0";

async function run() {
  console.log("Updating Skill #148: Employer Branding (9 steps across 3 tracks)...");

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

  // Delete excess tracks if > 3
  if (tracks.length > 3) {
    const extraTrackIds = tracks.slice(3).map(t => t.id);
    await supabase.from("steps").delete().in("track_id", extraTrackIds);
    await supabase.from("tracks").delete().in("id", extraTrackIds);
    tracks = tracks.slice(0, 3);
  }

  // Ensure exactly 3 tracks exist
  while (tracks.length < 3) {
    const { data: newTrack } = await supabase
      .from("tracks")
      .insert({
        skill_id: skillId,
        title: `Track ${tracks.length + 1}: Employer Branding`,
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
  await supabase.from("tracks").update({ title: "Track 1: Employer Value Proposition (EVP) Architecture and Research" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Recruitment Marketing, Inbound Funnels and Advocacy" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Brand Analytics, Reputation Management and Talent ROI" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / VP Talent Brand & Chief People Officer level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Five Pillars of the Employer Value Proposition (EVP)",
      order_index: 1,
      content: `### Strategic Talent Value Architecture

1. The EVP Model:
   - Defining the reciprocal psychological contract: Rewards (compensation/benefits), Opportunity (career progression), Organization (prestige/market leadership), Work (meaningful challenge), and People (leadership/camaraderie).

2. Distinctive Differentiation:
   - Formulating core pillars that set the organization apart from direct talent competitors.`
    },
    {
      track_id: track1Id,
      title: "Discovery Research: Sentiment Auditing and eNPS Analysis",
      order_index: 2,
      content: `### Quantitative and Qualitative Talent Discovery

1. Discovery Methodologies:
   - Employee Net Promoter Score (eNPS), internal focus groups, candidate drop-off surveys, and external Glassdoor/Indeed sentiment scraping.

2. Segmented Personas:
   - Tailoring EVP messaging nuances across engineering, sales, and corporate operational talent profiles.`
    },
    {
      track_id: track1Id,
      title: "Balancing Authenticity vs Aspirational Brand Promises",
      order_index: 3,
      content: `### Psychological Contracts and Attrition Prevention

1. Authenticity Alignment:
   - Grounding 80% of employer messaging in the lived daily reality of current employees to prevent psychological contract breach and early 90-day new hire turnover.

2. Aspirational Vision:
   - Weaving 20% future-facing mission and transformation goals into talent marketing narratives.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Inbound Recruitment Funnels and Career Site Optimization",
      order_index: 1,
      content: `### Talent Marketing Funnel Mechanics

1. Candidate Journey Stages:
   - Awareness (thought leadership/social), Consideration (career site/blogs), and Conversion (job application).

2. Career Site Architecture:
   - Frictionless mobile-first UX, 1-click apply integration, search-engine-optimized job descriptions, and ADA accessibility compliance.`
    },
    {
      track_id: track2Id,
      title: "Employee-Generated Content (EGC) and Brand Ambassadors",
      order_index: 2,
      content: `### Peer-to-Peer Organic Talent Engagement

1. Employee Advocacy Programs:
   - Training and empowering employees to share authentic workplace stories, behind-the-scenes engineering blogs, and day-in-the-life media on LinkedIn.

2. Organic Credibility:
   - Leveraging employee networks, which yield 8x higher engagement than corporate social brand channels.`
    },
    {
      track_id: track2Id,
      title: "Programmatic Job Advertising and CRM Talent Communities",
      order_index: 3,
      content: `### Algorithmic Distribution and Passive Pipelines

1. Programmatic Media Buying:
   - Real-time algorithmic budget allocation across job boards, bidding dynamically on high-scarcity specialized talent profiles.

2. Candidate Relationship Management (CRM):
   - Nurturing silver-medalist candidate pools with personalized automated email newsletters and tech tech briefings.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Core Talent Brand Metrics: CPH, TTF, OAR and Conversion",
      order_index: 1,
      content: `### Quantitative Performance Measurement

1. Financial & Operational KPIs:
   - Cost-per-Hire (CPH: agency fee reductions), Time-to-Fill (TTF), Offer Acceptance Rate (OAR target > 85%), and Career Site Visitor-to-Applicant Conversion Rate (3-8% baseline).

2. Quality of Hire (QoH):
   - Tracking 1-year retention rates and high-performer manager ratings.`
    },
    {
      track_id: track3Id,
      title: "Reputation Management, Glassdoor Audits and Crisis PR",
      order_index: 2,
      content: `### Employer Brand Governance and Review Sites

1. Review Site Strategy:
   - Establishing transparent, empathetic executive response SLAs for negative Glassdoor/Indeed reviews; analyzing recurring operational pain points.

2. Crisis Communications:
   - Managing brand perception during corporate layoffs, restructuring, and leadership transitions to protect ongoing talent pipelines.`
    },
    {
      track_id: track3Id,
      title: "Quantifying Employer Brand ROI and Business Value",
      order_index: 3,
      content: `### Executive Business Case and Financial Return

1. Measurable Business Impact:
   - Demonstrating that a top-tier employer brand reduces cost-per-hire by up to 50%, cuts voluntary turnover by 28%, and decreases required wage premiums by 10%.

2. Executive Alignment:
   - Presenting talent brand investments directly as revenue-enabling strategic growth initiatives.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #148.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In talent acquisition and human resources, what does the acronym 'EVP' stand for?",
      options: [
        "Employer Value Proposition",
        "Employee Vacation Plan",
        "Executive Vice President",
        "Emergency Vehicle Parking"
      ],
      correct_option_index: 0,
      explanation: "EVP stands for Employer Value Proposition: the core value and culture promise an employer offers to talent.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What is an 'Employee Net Promoter Score' (eNPS) used to measure in human resources?",
      options: [
        "How fast employees can type",
        "The total amount of overtime hours worked",
        "Employee loyalty and willingness to recommend the company as a great place to work to friends and family",
        "The company's stock market valuation"
      ],
      correct_option_index: 2,
      explanation: "eNPS measures internal employee sentiment based on likelihood to recommend the workplace on a 0-10 scale.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What is 'Employee-Generated Content' (EGC) in recruitment marketing?",
      options: [
        "Automated spam generated by bots",
        "Authentic photos, videos, blogs, and testimonials created directly by employees showcasing their real daily workplace experiences",
        "Legal contracts written by corporate lawyers",
        "Tax forms filled out by new hires"
      ],
      correct_option_index: 1,
      explanation: "EGC consists of authentic workplace content shared directly by employees, carrying high credibility with candidates.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In recruiting metrics, what does 'Time-to-Fill' (TTF) measure?",
      options: [
        "How long it takes to eat lunch",
        "The time it takes to clean the office",
        "How long an employee stays at the company before retiring",
        "The total number of calendar days between the date a job requisition is opened/approved and the date a candidate formally accepts the job offer"
      ],
      correct_option_index: 3,
      explanation: "Time-to-Fill measures operational recruiting velocity from requisition opening to offer acceptance.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In talent recruitment analytics, what does 'Cost-per-Hire' (CPH) calculate?",
      options: [
        "The total internal and external recruiting expenses (job ads, recruiter fees, referral bonuses, technology) divided by the total number of hires made in a given timeframe",
        "The employee's annual base salary",
        "The cost of a company laptop",
        "The monthly office rent per desk"
      ],
      correct_option_index: 0,
      explanation: "Cost-per-Hire sums all recruiting expenditures divided by total hires to assess hiring budget efficiency.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "Why is an 'Authentic EVP' critical, and what danger occurs when an employer brand is overly aspirational or exaggerated in job ads?",
      options: [
        "Candidates will ask for higher salaries",
        "Job boards will delete the advertisements",
        "The company will be required to change its name",
        "It causes a 'Psychological Contract Breach': newly hired employees discover the reality does not match the marketing promise, leading to disengagement and high voluntary attrition within the first 90 days"
      ],
      correct_option_index: 3,
      explanation: "Exaggerated employer branding causes early 90-day turnover when new hires experience reality mismatch.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In modern talent acquisition marketing, what is 'Programmatic Job Advertising'?",
      options: [
        "Printing paper job flyers to hand out on streets",
        "Using automated software algorithms and machine learning to distribute job ads across web channels in real time, bidding dynamically on target candidate demographics and adjusting spend based on application volume",
        "Hiring a team of software programmers to write job descriptions",
        "Only advertising jobs to computer science students"
      ],
      correct_option_index: 1,
      explanation: "Programmatic advertising algorithmically optimizes job ad placement and budget allocation across digital job networks.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In recruitment marketing funnels, what are 'Silver Medalist' candidates and how should an employer's CRM engage them?",
      options: [
        "Highly qualified, vetted final-round candidates who were not selected for a specific role; they should be actively nurtured in talent community pools with personalized updates for future openings",
        "Candidates who competed in the Olympic Games",
        "Candidates who failed their background checks",
        "Candidates who rejected the company's job offer"
      ],
      correct_option_index: 0,
      explanation: "Silver medalists are top-tier finalists who barely missed out; nurturing them drastically slashes future time-to-fill.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "How does a strong, established Employer Brand provide measurable financial ROI to an enterprise according to industry research?",
      options: [
        "It allows companies to eliminate all HR software",
        "It guarantees that every employee will work 80 hours per week",
        "It reduces Cost-per-Hire by up to 50%, decreases voluntary turnover by 28%, and lowers wage premiums required to attract specialized talent",
        "It eliminates all corporate taxes"
      ],
      correct_option_index: 2,
      explanation: "Strong employer brands cut recruitment marketing/agency spend, lower employee churn, and attract top talent at competitive wages.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What are the core stages of the 'Inbound Candidate Journey' in recruitment marketing?",
      options: [
        "Interview, Rejection, Appeal, Lawsuit",
        "Salary, Bonus, Stock, Vacation",
        "Resume, Phone Call, Meeting, Offer",
        "Awareness (discovering the brand), Consideration (researching culture and values), and Conversion (submitting a job application)"
      ],
      correct_option_index: 3,
      explanation: "The candidate journey mirrors marketing funnels: moving passive talent through Awareness, Consideration, and Conversion.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In global employer brand governance, what is the best practice strategy for responding to negative employee reviews on public platforms like Glassdoor and Indeed?",
      options: [
        "Threaten the reviewer with legal action immediately",
        "Respond promptly and professionally with empathy, acknowledge specific operational themes without being defensive, take feedback to leadership for internal improvements, and avoid scripted generic PR statements",
        "Create fake positive accounts to drown out the negative review",
        "Ignore all negative reviews completely"
      ],
      correct_option_index: 1,
      explanation: "Empathetic, authentic leadership responses to reviews signal operational accountability and transparency to prospective candidates.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In talent acquisition analytics, what is the formula and definition for calculating 'Offer Acceptance Rate' (OAR)?",
      options: [
        "Total Applicants divided by Total Job Openings",
        "Total Employees divided by Total Resignations",
        "Number of Formally Accepted Job Offers divided by the Total Number of Extended Job Offers (expressed as a percentage, benchmarked at >= 85%)",
        "Average Salary divided by Total Bonus Budget"
      ],
      correct_option_index: 2,
      explanation: "OAR = (Accepted Offers / Extended Offers) * 100; an OAR >=85% indicates strong brand positioning and competitive compensation.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In defining an Employer Value Proposition (EVP), what are the five universal structural dimensions defined by the Corporate Executive Board (CEB/Gartner)?",
      options: [
        "Rewards (compensation/benefits), Opportunity (career growth), Organization (market position/prestige), Work (meaningful challenge), and People (culture/leadership)",
        "Office, Coffee, Gym, Parking, Furniture",
        "Hardware, Software, Cloud, Security, Network",
        "Marketing, Sales, Finance, Legal, HR"
      ],
      correct_option_index: 0,
      explanation: "The CEB/Gartner EVP framework spans Rewards, Opportunity, Organization, Work, and People.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In career site conversion rate optimization (CRO), what is a major structural friction point that causes over 60% of qualified candidates to abandon job application forms?",
      options: [
        "Having high quality photos on the career page",
        "Posting clear salary ranges on job descriptions",
        "Allowing 1-click apply from LinkedIn",
        "Lengthy multi-page application portals requiring mandatory account creation and manual re-entry of resume work history that was already parsed"
      ],
      correct_option_index: 3,
      explanation: "Clunky ATS portals forcing redundant manual re-entry of resume fields cause massive candidate drop-off (>60% abandonment).",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In Talent Acquisition, how does 'Quality of Hire' (QoH) index validate the long-term effectiveness of an employer branding strategy?",
      options: [
        "By counting how many pages a candidate's resume has",
        "By combining objective performance metrics: 1-year employee retention rate, hiring manager satisfaction scores, time-to-productivity, and first-year performance appraisal ratings into a composite scorecard",
        "By tracking which university the candidate graduated from",
        "Quality of Hire cannot be measured in business"
      ],
      correct_option_index: 1,
      explanation: "Quality of Hire combines 1-year retention, productivity ramp time, and manager appraisal scores to prove talent quality.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #148.");
  console.log("Skill #148 update completed successfully!");
}

run();
