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

const skillId = "22f64248-5089-4d7a-ba45-ca1f0d202f95";

async function run() {
  console.log("Updating Skill #78: Social Media Strategy (9 steps across 3 tracks)...");

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
        title: `Track ${tracks.length + 1}: Social Media Strategy`,
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
  await supabase.from("tracks").update({ title: "Track 1: Platform Algorithm Architecture, Feed Mechanics and Ranking Signals" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Content Pillar Taxonomy, Editorial Calendars and Production" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Community Flywheels, Social Listening and Crisis Management" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / VP of Social Media & Community level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The LinkedIn Distribution Algorithm: Dwell Time and Golden Hour",
      order_index: 1,
      content: `### Professional Social Graph and Feed Distribution Mechanics

1. LinkedIn Feed Ranking Algorithm:
   - Dwell Time: Measures the duration a user spends viewing, reading, and expanding \"see more\" on a post; longer dwell times signal high quality and trigger broader distribution.
   - The Golden Hour: Meaningful engagement (substantive comments >5 words) within the first 60 minutes of publication boosts organic reach by up to 3x.
   - Outbound Link Penalty: Posts containing external links are deprioritized in the feed to keep users on-platform; placing links in the first comment or bio preserves organic reach.`
    },
    {
      track_id: track1Id,
      title: "Short-Form Video Algorithms: TikTok and Instagram Reels",
      order_index: 2,
      content: `### Interest Graphs and Retention Engineering

1. The Video Recommendation Engine:
   - Watch-Through Completion Rate: The #1 algorithmic ranking factor; videos with >60% completion rates for 15 to 30 second runtimes are pushed aggressively to broader discovery feeds (For You Page / Reels Explore).
   - Engagement Hierarchy: Shares (highest algorithmic weight) > Saves (high utility bookmarking) > Comments > Likes.

2. Audio Momentum:
   - Leveraging nascent trending audio tracks (<10k video uses exhibiting steep upward velocity) captures early algorithmic discovery waves.`
    },
    {
      track_id: track1Id,
      title: "Twitter/X Recommendation Engine and Conversation Threads",
      order_index: 3,
      content: `### Real-Time Conversational Ranking Architecture

1. Recommendation Algorithm Signals:
   - The open-source X algorithm heavily rewards active author engagement (author replying to comments boosts post score by +75x), Retweets, and Bookmarks (which signal evergreen reference value).

2. Tactical Thread Architecture:
   - Opening Hook Tweet (provocative contrarian thesis or case study teaser) -> 5 to 7 bite-sized standalone tactical insights -> Summary recap -> Newsletter sign-up CTA.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The 4 Core Content Pillars and Audience Empathy",
      order_index: 1,
      content: `### Strategic Content Matrix and Audience Empathy

1. The 4 Essential B2B/B2C Content Pillars:
   - 1. Thought Leadership & Industry Analysis (30%): Forward-looking industry theses, macroeconomic commentary, and contrarian perspectives.
   - 2. Tactical Education & How-To Frameworks (40%): Step-by-step guides, cheat sheets, and practical execution tutorials.
   - 3. Social Proof & Case Studies (15%): Client ROI transformations, hard metrics (+150% pipeline), and customer spotlights.
   - 4. Culture & Behind-the-Scenes (15%): Founder stories, raw engineering post-mortems, and team core values.`
    },
    {
      track_id: track2Id,
      title: "Editorial Calendar Management and Kanban Operations",
      order_index: 2,
      content: `### Content Production Scheduling and Batch Workflows

1. Production Batching:
   - Scheduling dedicated weekly time-blocks for ideation, copywriting, visual design, and batch scheduling (via Notion, Sprout Social, or Buffer), eliminating daily context switching.

2. Cadence Benchmarks:
   - LinkedIn: 1 high-value post per business day (Mon to Fri).
   - Twitter/X: 2 to 4 tactical posts daily + 1 weekly deep-dive thread.
   - TikTok/Reels: 1 to 2 vertical videos daily.`
    },
    {
      track_id: track2Id,
      title: "Visual Asset Formats: Carousels, Infographics and Memes",
      order_index: 3,
      content: `### Format Optimization and Screen Real Estate

1. Document Carousels (PDF Slides):
   - Multi-slide visual frameworks on LinkedIn (7 to 10 slides) generate exceptional dwell time and save rates by packaging dense frameworks into bite-sized swipeable graphics.

2. B2B Memes and Relatable Culture:
   - Humor humanizes technical brands and drives massive peer-to-peer sharing across Slack groups and Twitter feeds, lowering customer acquisition friction.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "The Community Engagement Flywheel and DM Automation",
      order_index: 1,
      content: `### Inbound Social Funnels and Community Building

1. The Reciprocity Engine:
   - Spending 15 minutes daily commenting insightful, value-additive contributions on 10 target industry peer and client accounts before posting personal content.

2. DM Lead Funnel Automation (ManyChat):
   - Setting automated keyword triggers (e.g. \"Comment AUDIT below and I will send the free template\") that immediately deliver lead magnets via direct message, capturing verified email subscribers from social reach.`
    },
    {
      track_id: track3Id,
      title: "Employee Advocacy and Executive Personal Branding",
      order_index: 2,
      content: `### Human-Led Organic Amplification

1. Personal Profiles vs Company Pages:
   - Individual personal profiles (Founders, Engineers, Product Leads) receive 8x to 10x more organic reach, engagement, and trust than official corporate brand pages.

2. Employee Advocacy Programs:
   - Empowering internal team members with weekly curated content prompts, graphics, and leadership support to build authentic industry influence.`
    },
    {
      track_id: track3Id,
      title: "Social Listening, Sentiment Analysis and Crisis Governance",
      order_index: 3,
      content: `### Brand Reputation Monitoring and Crisis Escalation

1. Social Listening Telemetry:
   - Monitoring brand keywords, competitor product discussions, and industry sentiment across social channels using tools like Sprout Social and Brandwatch.

2. Crisis Escalation Protocol:
   - In the event of a PR emergency or system outage:
     1. Acknowledge the issue publicly within 60 minutes with full transparency.
     2. Immediately pause all scheduled automated promotional social posts.
     3. Direct individual complaints to dedicated support channels.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #78.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In the LinkedIn feed distribution algorithm, what metric measures the amount of time a user spends viewing, reading, and expanding a post?",
      options: [
        "Bounce Rate",
        "Dwell Time",
        "Screen Resolution",
        "Connection Count"
      ],
      correct_option_index: 1,
      explanation: "Dwell Time is a primary ranking signal on LinkedIn, signaling high content quality when users pause to read thoroughly.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What is the single most critical algorithmic ranking factor for short-form vertical video on TikTok and Instagram Reels?",
      options: [
        "Number of hashtags",
        "Video file size",
        "Camera megapixel rating",
        "Watch-Through Completion Rate (percentage of viewers who watch to the end)"
      ],
      correct_option_index: 3,
      explanation: "Watch-Through Completion Rate is the top algorithmic metric on TikTok and Reels, driving wider discovery reach.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In social media content pillar strategy, what content category should typically comprise the largest share (approx 40%) of a B2B editorial mix?",
      options: [
        "Tactical Education & How-To Frameworks (actionable guides, templates, tutorials)",
        "Daily weather reports",
        "Direct sales pitches and buy-now links",
        "Office furniture photos"
      ],
      correct_option_index: 0,
      explanation: "Educational how-to content provides immediate value, establishing domain authority and building loyal audiences.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "Why do individual executive and employee personal profiles consistently outperform corporate company pages on LinkedIn by 8x to 10x?",
      options: [
        "Personal profiles are free to use",
        "Company pages are banned from posting text",
        "Audiences connect with and trust authentic human voices, practitioner stories, and individual thought leaders far more than faceless logos",
        "Company pages only display in black and white"
      ],
      correct_option_index: 2,
      explanation: "Human-to-human connection drives organic social trust; users prefer engaging with practitioners over brand logos.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In social lead generation, how does Direct Message (DM) automation (e.g. ManyChat) convert social engagement into email subscribers?",
      options: [
        "By hacking into user phone contacts",
        "By automatically sending a direct message containing a downloadable resource link whenever a user comments a designated trigger keyword on a post",
        "By deleting follower accounts",
        "By sending spam emails"
      ],
      correct_option_index: 1,
      explanation: "Comment-to-DM automation delivers lead magnets directly to engaged commenters, capturing verified email leads seamlessly.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In the LinkedIn algorithm, what is the 'Golden Hour' phenomenon?",
      options: [
        "Taking photos at sunset",
        "A 60-minute window where all ads are free",
        "The first 60 minutes following a post's publication, where receiving substantive comments (>5 words) signals high engagement to the algorithm, multiplying organic reach",
        "Posting only at 12:00 PM"
      ],
      correct_option_index: 2,
      explanation: "High-quality engagement during the first hour after posting signals relevance, triggering broader algorithmic feed distribution.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "Why do social media algorithms frequently penalize organic posts that contain direct external website links in the main post body?",
      options: [
        "Social media platforms aim to maximize on-platform user session time and ad exposure; external links pull users off the platform, so algorithms suppress their reach",
        "External links crash social media servers",
        "Links are illegal under copyright law",
        "Websites cannot be viewed on mobile devices"
      ],
      correct_option_index: 0,
      explanation: "Social platforms prioritize user retention on their own feeds; outbound links reduce session time, prompting algorithmic reach penalties.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In short-form video engagement metrics, which action is weighted most heavily by recommendation algorithms behind watch completion rate?",
      options: [
        "Double tapping a like",
        "Viewing the creator profile",
        "Adjusting phone volume",
        "Shares (sending the video to friends or external messaging apps)"
      ],
      correct_option_index: 3,
      explanation: "Shares represent the highest endorsement of content value, bringing new users to the platform and driving viral distribution.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What visual content format on LinkedIn generates high dwell times by allowing users to swipe through 7 to 10 structured framework slides?",
      options: [
        "Animated GIF",
        "Document Carousel (PDF upload)",
        "Single low-resolution JPEG",
        "Audio voice note"
      ],
      correct_option_index: 1,
      explanation: "PDF document carousels encourage multiple swipes and sustained reading time, dramatically increasing dwell time scores.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In brand reputation management, what is the immediate mandatory first step of a Social Media Crisis Escalation Protocol during a major PR emergency?",
      options: [
        "Post a funny meme to distract followers",
        "Delete all company social media accounts",
        "Immediately pause all scheduled automated promotional posts and acknowledge the situation publicly with transparency within 60 minutes",
        "Argue aggressively in the comments section"
      ],
      correct_option_index: 2,
      explanation: "Pausing scheduled promotional posts prevents tone-deaf marketing during crises, followed by swift, transparent public acknowledgment.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In the open-source recommendation algorithm of X (formerly Twitter), which user interaction carries the highest positive scoring multiplier for a tweet's distribution score?",
      options: [
        "The author actively replying to a conversation comment on their tweet (+75x boost)",
        "Liking the tweet",
        "Reporting the tweet",
        "Scrolling past the tweet quickly"
      ],
      correct_option_index: 0,
      explanation: "Author responses to comments carry a massive algorithmic weight (+75x), incentivizing active multi-participant conversation threads.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In viral short-form video strategy, how do creators strategically leverage 'Trending Audio Tracks' with under 10k video uses?",
      options: [
        "Trending audios are free of royalties",
        "They make the video play in slow motion",
        "They hide the video from competitors",
        "Early adoption of audios with steep velocity allows videos to ride the audio's recommendation wave into algorithmic explore feeds before saturation"
      ],
      correct_option_index: 3,
      explanation: "Catching trending sounds early taps into the algorithm's sound-clustering recommendation graphs during initial promotion waves.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In B2B organic growth methodology, what is the 'Reciprocity Engine' community strategy?",
      options: [
        "Paying people for follows",
        "Proactively engaging with insightful, high-value comments on 10 targeted peer, client, and influencer accounts daily before publishing original content",
        "Sending spam direct messages to 1,000 users",
        "Creating fake bot accounts"
      ],
      correct_option_index: 1,
      explanation: "Adding genuine value to key accounts first activates social reciprocity and brings targeted visibility back to the creator's profile.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In social media analytics, what is 'Social Listening' and how does it differ from standard social media monitoring?",
      options: [
        "Listening to podcast recordings",
        "Tracking follower counts on a spreadsheet",
        "Analyzing sentiment, brand mentions, competitor trends, and industry conversations across the entire web/social sphere to extract macro strategic insights rather than just replying to direct notifications",
        "Recording customer phone calls"
      ],
      correct_option_index: 2,
      explanation: "Social listening analyzes broad industry sentiment and competitor chatter across the web, going far beyond direct @mention monitoring.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In Twitter/X conversational thread architecture, what is the optimal structural sequence to maximize engagement and follower conversion?",
      options: [
        "A provocative teaser hook tweet -> 5 to 7 bite-sized tactical value points -> Summary recap -> Newsletter/Product CTA",
        "A single link with zero text",
        "Posting 50 memes with no context",
        "Copying an entire Wikipedia page into one tweet"
      ],
      correct_option_index: 0,
      explanation: "A compelling hook tweet draws readers in, followed by standalone value points, a recap, and a clear call to action.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #78.");
  console.log("Skill #78 update completed successfully!");
}

run();
