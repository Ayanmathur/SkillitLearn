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

const skillId = "8d0bb0f5-eb05-43f6-84f9-79c86f35b09c";

async function run() {
  console.log("Updating Skill #92: Launch Planning (9 steps across 3 tracks)...");

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

  // Ensure exactly 3 tracks exist
  while (tracks.length < 3) {
    const { data: newTrack } = await supabase
      .from("tracks")
      .insert({
        skill_id: skillId,
        title: `Track ${tracks.length + 1}: Launch Planning`,
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
  await supabase.from("tracks").update({ title: "Track 1: Pre-Launch Audience Architecture, Viral Waitlists and Recruitment" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Multi-Platform Launch Playbooks: Product Hunt and Hacker News" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Post-Launch Telemetry, Onboarding Velocity and Iteration" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / VP of Growth & Product Launch Master level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Viral Referral Waitlist Engine and Gamification",
      order_index: 1,
      content: `### Pre-Launch Waitlist Engineering and Scarcity Loops

1. The Viral Referral Mechanism (The Robinhood Model):
   - Implementing a referral loop where users advance spots in the onboarding queue for every colleague who registers via their unique invite link.

2. Controlled Cohort Access:
   - Releasing access in managed weekly batches (50 to 100 users) to stress-test server infrastructure, collect deep qualitative feedback, and cultivate exclusive brand cachet.`
    },
    {
      track_id: track1Id,
      title: "Paul Graham's 'Do Things That Don't Scale' and First 100 Users",
      order_index: 2,
      content: `### Manual Customer Recruitment and High-Touch Onboarding

1. Founder-Led Direct Acquisition:
   - Personally recruiting target ICP users one-by-one via cold outreach, specialized subreddits, and private Discord/Slack groups.

2. Concierge Screen-Share Onboarding:
   - Conducting 1-on-1 video onboarding calls with the first 100 users, observing interface confusion live, and deploying software patches within hours to delight early adopters.`
    },
    {
      track_id: track1Id,
      title: "Building in Public and Strategic Teaser Campaigns",
      order_index: 3,
      content: `### The Build-in-Public Narrative Flywheel

1. Transparent Narrative Marketing:
   - Sharing authentic product development updates, early wireframes, technical roadblocks, and initial revenue milestones on X/Twitter and LinkedIn.
   - Converts passive observers into invested brand evangelists who actively champion the product on launch day.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The Product Hunt Launch Playbook and Algorithmic Dynamics",
      order_index: 1,
      content: `### Orchestrating a #1 Product of the Day Campaign

1. Operational Timing and Launch Mechanics:
   - Launching at exactly 12:01 AM PST to capture the entire 24-hour voting cycle.
   - Maximizing early engagement velocity during the first 4 hours to secure top placement on the homepage leaderboard.

2. Maker Comment and Asset Engineering:
   - High-contrast animated GIFs, crisp 1280x720px gallery screenshots, and an authentic Maker Comment detailing the founder backstory, problem statement, and exclusive launch community incentives.`
    },
    {
      track_id: track2Id,
      title: "The Hacker News 'Show HN' Technical Playbook",
      order_index: 2,
      content: `### Developer Community Distribution and Technical Authenticity

1. Hacker News Community Guidelines:
   - Absolute prohibition of marketing hype, buzzwords, and gated sign-up walls.

2. The Show HN Architecture:
   - Title Formula: \"Show HN: [Product Name] - [Concise technical description]\".
   - Direct access to a live working demo or open-source repository.
   - Detailed technical explanation of the engineering stack, database architecture, and performance benchmarks in the top comment.`
    },
    {
      track_id: track2Id,
      title: "Reddit, Specialized Communities and Influencer Seeding",
      order_index: 3,
      content: `### Grassroots Guerrilla Distribution

1. Subreddit Value-First Engagement:
   - Contributing extensive, high-value educational case studies to relevant subreddits before mentioning product solutions in comments.

2. Micro-Influencer Seeding:
   - Providing free lifetime access to niche technical creators in exchange for unbiased review videos and social walkthroughs.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Activating the 'Aha!' Moment and Time-to-Value (TTV)",
      order_index: 1,
      content: `### First-Run User Experience and Activation Velocity

1. Defining the 'Aha!' Moment:
   - The specific moment when a new user experiences visceral product value (e.g. Slack: sending 2,000 messages; Dropbox: syncing the first file).

2. Minimizing Time-to-Value (TTV):
   - Removing mandatory email verification before demo interaction, pre-populating templates, and providing sample sandbox data to eliminate empty-state confusion.`
    },
    {
      track_id: track3Id,
      title: "Rapid Post-Launch Bug Triage and Daily Deployment",
      order_index: 2,
      content: `### High-Velocity Engineering and Triage Protocols

1. Real-Time Feedback Telemetry:
   - Integrating Sentry for real-time error logging and Crisp/Intercom for instant live user support during the first 72 hours.

2. The 24-Hour Patch Cycle:
   - Resolving critical user onboarding bugs within 24 hours of launch to build immense customer goodwill and prevent early cohort churn.`
    },
    {
      track_id: track3Id,
      title: "Transitioning from Launch Spike into Sustainable Retention",
      order_index: 3,
      content: `### Escaping the Trough of Sorrow and Building Growth Loops

1. Launch Spike vs Organic Baseline:
   - Preparing for the inevitable post-launch traffic decay by focusing on Day 7 and Day 30 cohort retention curves rather than vanity signup spikes.

2. Establishing Compounding Growth Loops:
   - Embedding product-led viral loops (invite colleague triggers, shared output watermarks) to drive recurring organic user acquisition.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #92.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "What is the recommended official launch time on Product Hunt to maximize the full 24-hour voting cycle on the daily leaderboard?",
      options: [
        "12:01 AM Pacific Standard Time (PST)",
        "5:00 PM Eastern Time",
        "12:00 PM Noon GMT",
        "11:59 PM PST"
      ],
      correct_option_index: 0,
      explanation: "Product Hunt's daily leaderboard resets at 12:01 AM PST; launching immediately after reset gives the full 24-hour voting window.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In startup product onboarding, what is the 'Aha!' Moment?",
      options: [
        "The moment a customer enters their credit card",
        "The moment an employee gets hired",
        "The pivotal moment when a new user first experiences the core visceral value and utility of the product",
        "The moment the software is shut down"
      ],
      correct_option_index: 2,
      explanation: "The 'Aha!' moment is the realization of value that turns a casual visitor into an active, retained user.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In Paul Graham's classic startup essay, what does the principle 'Do Things that Don't Scale' instruct early-stage founders to do?",
      options: [
        "Spend $1,000,000 on billboards",
        "Manually recruit and personally onboard initial users one-by-one with high-touch effort before automating systems",
        "Build a giant factory",
        "Avoid talking to customers"
      ],
      correct_option_index: 1,
      explanation: "Early founders must do manual, unscalable work (like 1-on-1 onboarding) to deeply understand user needs and build early momentum.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In pre-launch waitlist engineering, what is the core mechanism of a 'Viral Referral Waitlist' (The Robinhood Model)?",
      options: [
        "Charging users $100 to join",
        "Sending spam text messages",
        "Banning users who share links",
        "Allowing subscribers to skip ahead in the onboarding priority queue by referring friends and colleagues via a unique link"
      ],
      correct_option_index: 3,
      explanation: "Viral waitlists reward referrals with priority queue advancement, turning early subscribers into active promoters.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In software user onboarding metrics, what does 'Time-to-Value' (TTV) measure?",
      options: [
        "The elapsed time from when a user lands on the product to when they achieve their first successful, valuable outcome",
        "The price of the software per hour",
        "The duration of a sales meeting",
        "How long a computer battery lasts"
      ],
      correct_option_index: 0,
      explanation: "Time-to-Value (TTV) measures how quickly a user reaches value; shorter TTV drastically reduces onboarding drop-off.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "When posting a 'Show HN' submission on Hacker News, what critical rule must technical founders follow to avoid community backlash and algorithmic flags?",
      options: [
        "Include as many marketing buzzwords as possible",
        "Require credit card entry before allowing demo access",
        "Pay for upvotes on social media",
        "Provide a direct link to a live working demo or open-source repository without forced sign-up walls, maintaining authentic technical transparency"
      ],
      correct_option_index: 3,
      explanation: "Hacker News values technical substance and working demos without marketing jargon or gated sign-up walls.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Product Hunt campaign strategy, why are the 'First 4 Hours' of voting velocity so critical?",
      options: [
        "Product Hunt deletes all posts after 4 hours",
        "Early vote and comment velocity signals high engagement to the ranking algorithm, securing top-3 visibility on the homepage leaderboard for the remainder of the day",
        "All voting closes after 4 hours",
        "There is zero importance to the first 4 hours"
      ],
      correct_option_index: 1,
      explanation: "Early upvote momentum locks the product onto the top of the homepage, driving compounding organic traffic all day.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In post-launch startup operations, what is the 'Trough of Sorrow' described by Y Combinator?",
      options: [
        "The predictable decline in traffic and excitement following the initial launch press spike, requiring founders to grind on product retention and organic growth",
        "A bad financial audit",
        "A hardware server breakdown",
        "An office lease dispute"
      ],
      correct_option_index: 0,
      explanation: "The Trough of Sorrow is the difficult post-launch phase where initial press fades and organic retention must carry the company.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In user experience onboarding design, how do 'Pre-Populated Templates and Sandbox Data' reduce first-run friction?",
      options: [
        "They make the software more expensive",
        "They delete user files",
        "They eliminate the intimidating 'Empty State' screen by providing realistic sample projects that users can immediately explore and edit",
        "They require users to read a 100-page manual"
      ],
      correct_option_index: 2,
      explanation: "Empty state screens cause cognitive paralysis; pre-populated templates give users immediate context to explore.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In community launch distribution, what is the best practice for introducing a new startup tool on specialized subreddits (e.g. r/SaaS, r/startups)?",
      options: [
        "Spamming links with zero context in 50 subreddits simultaneously",
        "Creating fake accounts to upvote own posts",
        "Insulting moderators",
        "Publishing an in-depth, transparent educational breakdown or case study sharing lessons learned, mentioning the tool organically in comments"
      ],
      correct_option_index: 3,
      explanation: "Reddit rewards detailed, authentic value-first contributions and heavily punishes direct self-promotional link spam.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In post-launch cohort analytics, why is tracking Day 7 and Day 30 'Cohort Retention' far more predictive of long-term venture survival than Day 1 signup counts?",
      options: [
        "Day 1 signups are deleted automatically",
        "Launch day signups reflect temporary marketing hype; only Day 7 and Day 30 retention proves that users are experiencing genuine ongoing utility and forming sustainable habits",
        "Cohort retention is required by the SEC",
        "Signups have zero value"
      ],
      correct_option_index: 1,
      explanation: "Signup spikes are vanity metrics; sustained Day 7/30 retention confirms genuine product utility and sustainable PMF.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In high-velocity startup engineering, what is the '48-Hour Launch Patch Protocol'?",
      options: [
        "Shutting down the website for 48 hours",
        "Celebrating with a 48-hour party",
        "Integrating real-time error logging (Sentry) and live customer chat (Intercom) to rapidly detect and fix user onboarding blockers within 24 to 48 hours of launch",
        "Deleting user accounts that find bugs"
      ],
      correct_option_index: 2,
      explanation: "Rapid bug triage during the first 48 hours turns confused or frustrated launch visitors into loyal product evangelists.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Product-Led Growth (PLG) launch planning, what constitutes an embedded 'Viral Growth Loop'?",
      options: [
        "A natural product mechanism where regular usage inherently exposes the product to prospective new users (e.g. shared collaborative links in Figma or 'Powered by' badges)",
        "A computer software virus",
        "Paying influencers $10,000 per post",
        "Buying email lists"
      ],
      correct_option_index: 0,
      explanation: "Viral loops turn regular product usage into organic customer acquisition without incremental paid advertising spend.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In launch messaging architecture, what is the primary role of the 'Maker Comment' on Product Hunt?",
      options: [
        "To criticize competitor products",
        "To list the founder's resume",
        "To post funny jokes",
        "To provide authentic narrative context: the origin story, the core problem being solved, a warm welcome to the community, and special launch incentives"
      ],
      correct_option_index: 3,
      explanation: "The Maker Comment humanizes the launch, articulating the mission and inviting feedback and community discussion.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In pre-launch strategy, how does 'Building in Public' on social media de-risk a future commercial product launch?",
      options: [
        "It eliminates all software coding",
        "It builds an authentic audience of early adopters who provide continuous feedback during development and act as enthusiastic brand champions on launch day",
        "It allows competitors to copy the idea faster",
        "It makes product launch day unnecessary"
      ],
      correct_option_index: 1,
      explanation: "Building in public creates an emotionally invested audience that provides feedback and delivers initial launch momentum.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #92.");
  console.log("Skill #92 update completed successfully!");
}

run();
