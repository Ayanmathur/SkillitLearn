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

const skillId = "df60d79c-da98-4d2c-b638-10bd6cabc62d";

async function run() {
  console.log("Updating Skill #151: Offer Negotiation & Onboarding (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Total Rewards Architecture and Offer Closing Strategy" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Principled Negotiation, Trade-Off Levers and Counter-Offers" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Preboarding, 30-60-90 Enablement and Ramp Analytics" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / VP Total Rewards & Talent Operations level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Total Rewards Packaging: Base, Bonus and Equity RSUs",
      order_index: 1,
      content: `### Compensation Package Structuring

1. Total Rewards Components:
   - Base salary (internal pay equity bands), Short-Term Incentives (annual bonus/OTE), and Long-Term Incentives (RSUs / Stock Options).

2. Equity Schedules:
   - Standard 4-year vesting with a 1-year cliff ($25\%$ vest at month 12; monthly or quarterly vesting thereafter).`
    },
    {
      track_id: track1Id,
      title: "Pre-Closing Throughout the Funnel and Verbal Offers",
      order_index: 2,
      content: `### Offer Rollout and Pre-Closing Mechanics

1. Continuous Pre-Closing:
   - Re-confirming salary expectations, decision criteria, and family buy-in at every interview stage.

2. The Verbal Offer Call:
   - Presenting total financial value collaboratively: 'If we deliver this specific compensation package, are you prepared to sign today?'`
    },
    {
      track_id: track1Id,
      title: "Formal Offer Letters and At-Will Legal Governance",
      order_index: 3,
      content: `### Employment Documentation and Compliance

1. Offer Letter Architecture:
   - Job title, reporting line, exempt/non-exempt status, base pay, bonus metrics, equity grant language, start date, and contingency clauses (background check/I-9 verification).

2. At-Will Clauses:
   - Preserving at-will employment protections without creating implied contracts.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Principled Negotiation: BATNA, ZOPA and Reservation Price",
      order_index: 1,
      content: `### Strategic Negotiation Frameworks

1. Harvard Negotiation Model:
   - BATNA (Best Alternative to a Negotiated Agreement), Reservation Price (walk-away ceiling), and ZOPA (Zone of Possible Agreement).

2. Win-Win Framing:
   - Focusing on mutual value creation rather than adversarial zero-sum positional bargaining.`
    },
    {
      track_id: track2Id,
      title: "Multi-Variable Trade-Off Levers Beyond Base Salary",
      order_index: 2,
      content: `### Non-Cash Compensation Levers

1. Internal Pay Equity Bounds:
   - Protecting team salary bands by refusing to break base salary caps.

2. Alternative Levers:
   - Sign-on bonuses (one-time cost), accelerated equity grants, title upgrades, remote flexibility, relocation allowances, or scheduled 6-month performance reviews.`
    },
    {
      track_id: track2Id,
      title: "Defending Against Counter-Offers and Competing Bids",
      order_index: 3,
      content: `### Retention Defense and Closing Urgency

1. Counter-Offer Realities:
   - Educating candidates on industry retention statistics ($80\%$ of employees who accept current-employer counter-offers leave within 12 months due to eroded trust).

2. Competing Bids:
   - Reframing cultural and long-term career trajectory advantages over short-term bidding wars.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Preboarding Engagement and Buyer's Remorse Mitigation",
      order_index: 1,
      content: `### The Acceptance-to-Day-One Bridge

1. Preboarding Protocols:
   - Eliminating post-offer candidate ghosting and buyer's remorse via manager check-in calls, team welcome videos, swag kits, and seamless early I-9/hardware provisioning.

2. Psychological Safety:
   - Establishing early belonging before Day 1.`
    },
    {
      track_id: track3Id,
      title: "The 30-60-90 Day Structured Onboarding Framework",
      order_index: 2,
      content: `### Milestone-Driven Enablement

1. 30-60-90 Architecture:
   - First 30 Days (Assimilation: culture, systems, peer buddy shadowing).
   - 60 Days (Execution: owning small projects, early deliverables).
   - 90 Days (Autonomy: full ownership of OKRs, formal 90-day performance review).`
    },
    {
      track_id: track3Id,
      title: "Time-to-Productivity (TTP) and 90-Day Retention Analytics",
      order_index: 3,
      content: `### Onboarding ROI and Performance Metrics

1. Velocity Metrics:
   - Time-to-Productivity (TTP: measuring days to first successful code commit, closed deal, or independent case completion).

2. Quality & Retention:
   - Tracking 90-day voluntary attrition rates and New Hire Net Promoter Scores (NPS) to continuously refine onboarding workflows.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #151.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In corporate equity compensation, what does a standard '1-Year Cliff' on a 4-year vesting schedule mean for a newly hired employee?",
      options: [
        "The employee must climb a mountain in year 1",
        "The employee receives zero shares if they leave before completing 12 full months of service; upon completing year 1, 25% of their total equity grant vests immediately",
        "The employee's salary is cut in half after 1 year",
        "The employee gets 100% of their equity on day 1"
      ],
      correct_option_index: 1,
      explanation: "A 1-year cliff mandates 12 months of service before the first 25% of equity vests, protecting companies from rapid departures.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In executive negotiation science (Harvard Negotiation Project), what does the acronym 'BATNA' stand for?",
      options: [
        "Business Account Tax Number Assessment",
        "Basic Agreement Term Negotiation Act",
        "Board Authorized Total Net Assets",
        "Best Alternative to a Negotiated Agreement"
      ],
      correct_option_index: 3,
      explanation: "BATNA is the most advantageous course of action a party can take if negotiations fail to reach an agreement.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What is 'Preboarding' in human resources and talent operations?",
      options: [
        "The strategic engagement and onboarding activities that occur between the moment a candidate signs their offer letter and their official Day 1 start date",
        "Checking in for an airline flight before an interview",
        "A technical coding test given before an interview",
        "The exit interview conducted when an employee resigns"
      ],
      correct_option_index: 0,
      explanation: "Preboarding bridges the gap between offer acceptance and Day 1, preventing candidate anxiety and ghosting.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In onboarding analytics, what does 'Time-to-Productivity' (TTP) measure?",
      options: [
        "The number of hours an employee works in a week",
        "How long it takes to log into a laptop",
        "The time it takes for a new hire to ramp up and begin contributing fully to their role (e.g. first successful code commit, first sales deal, independent case handling)",
        "The time an employee spends on break"
      ],
      correct_option_index: 2,
      explanation: "Time-to-Productivity measures how many days or weeks a new hire takes to reach expected standard independent output.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In total rewards compensation, what are 'RSUs' (Restricted Stock Units)?",
      options: [
        "A promise by the company to grant an employee actual shares of company stock once specific vesting time and performance milestones are satisfied",
        "Restricted Social Units",
        "Retirement Savings Unlimited",
        "Real Salary Upgrades"
      ],
      correct_option_index: 0,
      explanation: "RSUs are equity grants that convert to full company shares upon meeting vesting milestone schedules.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "When negotiating an offer with a strong candidate whose base salary demand exceeds the hiring company's internal pay equity band, what is the best compensation strategy?",
      options: [
        "Break the salary band and pay whatever the candidate asks",
        "Insult the candidate and retract the offer",
        "Hold the base salary at the band ceiling to protect team equity, but negotiate flexible non-base levers (such as a one-time sign-on bonus, equity grant increase, or additional paid time off)",
        "Offer to pay the candidate in cash under the table"
      ],
      correct_option_index: 2,
      explanation: "Protecting base salary bands maintains internal equity; one-time sign-on bonuses and equity bridge the financial gap non-destructively.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "Why should recruiters educate candidates early about the severe risks of accepting a 'Counter-Offer' from their current employer?",
      options: [
        "Industry data shows that over 80% of employees who accept a counter-offer leave or are terminated within 6 to 12 months anyway because the underlying trust and cultural dissatisfaction were never resolved",
        "Because counter-offers are illegal in all 50 states",
        "Because companies never pay the promised counter-offer money",
        "To save money for the candidate's current employer"
      ],
      correct_option_index: 0,
      explanation: "Counter-offers temporarily patch dissatisfaction but permanently damage trust, leading to >80% departure within one year.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In negotiation theory, what is the 'ZOPA' (Zone of Possible Agreement)?",
      options: [
        "The physical conference room where contracts are signed",
        "A zone in an office building where phone calls are prohibited",
        "A legal territory where labor laws do not apply",
        "The overlapping price range between the buyer's maximum willingness to pay (reservation price) and the seller's minimum acceptable price where a mutually beneficial deal can occur"
      ],
      correct_option_index: 3,
      explanation: "ZOPA is the overlapping bargaining range between the employer's maximum budget and candidate's minimum walk-away price.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In a structured '30-60-90 Day Onboarding Plan', what should be the primary focus of the first 30 days?",
      options: [
        "Leading major multi-million dollar corporate projects alone",
        "Learning and assimilation: understanding team workflows, shadowing peers, mastering internal tools, building cross-functional relationships, and understanding the company culture",
        "Firing underperforming team members",
        "Working 80 hours per week without supervision"
      ],
      correct_option_index: 1,
      explanation: "The first 30 days focus on cognitive absorption, cultural assimilation, system onboarding, and peer shadowing.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "Why is an 'Onboarding Peer Buddy' program highly effective in accelerating new hire ramp time?",
      options: [
        "Buddies do all the new hire's work for them",
        "Buddies report daily attendance to the CEO",
        "It provides a dedicated, non-evaluative peer to answer informal daily questions, explain unspoken cultural norms, and navigate organizational systems without fear of judgment",
        "Peer buddies are only used for physical fitness training"
      ],
      correct_option_index: 2,
      explanation: "Peer buddies provide a safe, non-managerial resource for learning unspoken norms and daily tool navigation.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In recruiter offer closing methodology, what is 'Pre-Closing' and how is it strategically applied throughout the candidate interview journey?",
      options: [
        "Continuously testing candidate alignment on compensation, start dates, commute, family considerations, and decision criteria at every interview stage so there are ZERO surprises when the formal offer is extended",
        "Making the candidate sign a contract on day 1 of interviews",
        "Closing the office door during interviews",
        "Rejecting candidates before they finish their interview"
      ],
      correct_option_index: 0,
      explanation: "Pre-closing continuously surfaces and resolves candidate concerns across each stage, ensuring a seamless final offer acceptance.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In US employment law, why MUST an offer letter clearly state that employment is 'At-Will' and avoid guaranteeing annual compensation or fixed employment terms?",
      options: [
        "To make the offer letter shorter",
        "Because fixed salaries are illegal in the US",
        "To prevent candidates from asking for stock options",
        "Guaranteed employment durations or annual statements without at-will disclaimers can be legally construed as binding multi-year employment contracts, exposing the company to wrongful termination liability"
      ],
      correct_option_index: 3,
      explanation: "Without clear at-will clauses, annual salary statements can be interpreted by courts as guaranteed multi-year employment contracts.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Total Rewards design, what is the key difference between Incentive Stock Options (ISOs) and Non-Qualified Stock Options (NSOs)?",
      options: [
        "ISOs are for international workers; NSOs are for domestic workers",
        "ISOs are available only to employees and qualify for special tax treatment (capital gains upon sale if held properly); NSOs can be granted to contractors/directors and are taxed as ordinary income upon exercise",
        "ISOs never expire; NSOs expire in 24 hours",
        "There is zero tax difference between them"
      ],
      correct_option_index: 1,
      explanation: "ISOs qualify for capital gains tax treatment if holding requirements are met; NSOs trigger ordinary income tax at exercise.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In onboarding governance, why is conducting a structured '90-Day New Hire Review' critical for long-term organizational talent retention?",
      options: [
        "To decide whether to give the employee a laptop",
        "To calculate annual tax deductions",
        "It provides a formal milestone to assess early performance against 90-day OKRs, gather candidate onboarding feedback, align on future career growth, and address lingering friction before it leads to first-year turnover",
        "90-day reviews are required by the United Nations"
      ],
      correct_option_index: 2,
      explanation: "The 90-day review formalizes autonomy, resolves early friction points, and anchors long-term retention goals.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In principled negotiation, what is the 'Reservation Price' of an employer extending a job offer?",
      options: [
        "The absolute maximum total compensation the hiring company is authorized and willing to offer for that role before walking away from the negotiation",
        "The cost of reserving a dinner table for the candidate",
        "The lowest salary the candidate will accept",
        "The fee paid to an executive search firm"
      ],
      correct_option_index: 0,
      explanation: "The reservation price is the absolute walk-away threshold (maximum willingness to pay) for the employer in a negotiation.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #151.");
  console.log("Skill #151 update completed successfully!");
}

run();
