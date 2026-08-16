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

const skillId = "4ce29c3f-f716-41f3-84a1-d666a770a999";

async function run() {
  console.log("Updating Skill #75: Content Writing (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Audience Research, Editorial Strategy and Search Intent" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Persuasive Rhetoric, Long-Form Structure and Micro-Formatting" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Semantic Entity Optimization, Editorial Governance and Distribution" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Editorial Director & SEO Copywriting level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Search Intent Taxonomy and Audience Mental Models",
      order_index: 1,
      content: `### Search Intent Classification and Persona Modeling

1. The 4 Core Search Intent Archetypes:
   - Informational Intent (\"How does Kafka work?\"): Requires comprehensive conceptual explanations, architectural diagrams, and code snippets.
   - Commercial Investigation (\"Kafka vs RabbitMQ\"): Requires objective side-by-side comparative matrices, latency benchmarks, and operational tradeoffs.
   - Transactional Intent (\"Buy Confluent Cloud enterprise license\"): Requires explicit pricing tiers, SLA uptime guarantees, and clear sign-up CTAs.
   - Navigational Intent (\"Confluent login\"): Requires frictionless direct portal navigation.

2. Audience Empathy Mapping:
   - Defining reader Jobs-to-be-Done (JTBD), acute operational pains, career anxieties, and desired status gains to calibrate vocabulary and technical depth.`
    },
    {
      track_id: track1Id,
      title: "The Inverted Pyramid and BLUF Information Architecture",
      order_index: 2,
      content: `### Scannable Information Architecture and Executive Summaries

1. The Inverted Pyramid Journalism Model:
   - Structures articles with the most critical conclusions, key takeaways, and quantitative answers at the very beginning, followed by supporting secondary arguments and granular technical appendices.

2. Bottom Line Up Front (BLUF):
   - Placing a 2 to 3 sentence executive takeaway summary immediately below the title.
   - Respects executive reader time, satisfies immediate search intent, and significantly reduces bounce rates.`
    },
    {
      track_id: track1Id,
      title: "Comprehensive Content Brief Engineering and SERP Analysis",
      order_index: 3,
      content: `### Structural Content Engineering and Competitive Gap Analysis

1. SERP Competitive Gap Analysis:
   - Deconstructing the top 5 organic search results to detect unaddressed user questions, outdated code examples, missing benchmark charts, or weak arguments.

2. Content Brief Specifications:
   - Target Word Count: Aligned with topical depth (e.g. 2,500 words for comprehensive technical pillars).
   - Core Semantic Entities: Primary keywords and related semantic terms.
   - Target Reading Grade Level: Flesch-Kincaid Grade 7 to 8 for maximum cognitive fluency and effortless readability.
   - Internal Linking Blueprints: Pre-determining inbound and outbound contextual links.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The 4 U's Headline Framework and Hook Architecture",
      order_index: 1,
      content: `### Attention Capture and Headline Engineering

1. The 4 U's Headline Formula (AWAI):
   - Useful: Demonstrates immediate practical value to the reader.
   - Urgent: Compels the reader to engage immediately.
   - Unique: Expresses a distinct, non-cliche perspective.
   - Ultra-Specific: Employs exact metrics and concrete numbers (e.g. \"How We Reduced AWS Compute Bills by $42,000 in 14 Days\").

2. The 4 Primary Hook Formats:
   - The Contrarian Hook: Challenges industry dogma directly.
   - The Statistical Shock Hook: Cites an alarming, unexpected industry data point.
   - The Anecdotal Story Hook: Drops the reader directly into a tense narrative moment.
   - The Problem Agitation Hook: Pinpoints a painful, recurring daily frustration.`
    },
    {
      track_id: track2Id,
      title: "Aristotelian Rhetoric in Copy: Ethos, Pathos and Logos",
      order_index: 2,
      content: `### Persuasive Argumentation and Classical Rhetoric

1. Ethos (Authority and Trust):
   - Establishing real-world practitioner credentials, citing firsthand enterprise production experiences, and sharing transparent post-mortem failures.

2. Pathos (Emotional Connection):
   - Validating reader struggles with broken toolchains, imposter syndrome, or exhausting manual workflows.

3. Logos (Logical Evidence and Proof):
   - Grounding every technical claim in empirical benchmark data, reproducible code snippets, and mathematical formulations.`
    },
    {
      track_id: track2Id,
      title: "Bucket Brigades, Skim Paths and Visual Rhythm",
      order_index: 3,
      content: `### Reader Momentum and Cognitive Friction Reduction

1. Bucket Brigades:
   - Short transitional phrases that break up long paragraphs and draw the reader's eye down the page:
     - \"Here is why that matters:\"
     - \"The catch?\"
     - \"Let me explain:\"
     - \"Think about it this way:\"

2. Skim-Path Visual Engineering:
   - Bolding key concepts and takeaways for the 80% of users who scan articles.
   - Inserting descriptive sub-headings (H2, H3) every 250 words.
   - Using callout boxes, bulleted lists, and structured comparison tables to create dynamic visual cadence.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Semantic Search Entities and Topical Authority",
      order_index: 1,
      content: `### Entity-Based SEO and Topic Clusters

1. Entity-Based NLP Search:
   - Google BERT and MUM evaluate semantic entities, conceptual relationships, and topical comprehensiveness rather than raw keyword frequency.

2. Hub-and-Spoke Topic Clusters:
   - A single comprehensive Pillar Page covering the broad core subject, linked bi-directionally to 6 to 10 granular Cluster Sub-Topic Articles.
   - Builds authoritative topical depth that signals search engine algorithms of complete domain expertise.`
    },
    {
      track_id: track3Id,
      title: "Editorial Governance: Orwell's Rules and Readability",
      order_index: 2,
      content: `### Rigorous Copyediting Standards and Readability Optimization

1. George Orwell's 6 Rules for Clear Writing:
   - Never use a metaphor or figure of speech you are used to seeing in print.
   - Never use a long word where a short one will do.
   - If it is possible to cut a word out, always cut it out.
   - Never use the passive voice where you can use the active.
   - Never use a foreign phrase or jargon word if you can think of an everyday English equivalent.
   - Break any of these rules sooner than say anything barbarous.

2. Readability Metrics:
   - Maintaining Flesch Reading Ease scores between 60 and 70, and restricting passive voice to under 10% of sentences.`
    },
    {
      track_id: track3Id,
      title: "The Content Repurposing Flywheel and Distribution",
      order_index: 3,
      content: `### Multi-Channel Content Multiplication

1. The 1-to-10 Content Cascade:
   - Deconstruct a single comprehensive 2,500-word Pillar Article into:
     - 1 Email Newsletter deep-dive issue.
     - 3 LinkedIn visual slide carousels highlighting core frameworks.
     - 5 Tactical Twitter/X breakdown threads.
     - 1 YouTube educational video script outline.
     - 2 Short-form vertical Reels/Shorts scripts.

2. Distribution Strategy:
   - Publishing across owned (newsletter), earned (SEO), and social channels to maximize return on editorial investment.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #75.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In journalism and web content architecture, what is the 'Inverted Pyramid' model?",
      options: [
        "Writing in a foreign language",
        "Placing the most critical conclusion, core answer, and essential takeaway at the very beginning of the article, followed by supporting details and granular context",
        "Writing backwards from the last word",
        "Hiding the main point at the bottom of the page"
      ],
      correct_option_index: 1,
      explanation: "The Inverted Pyramid places the most crucial information at the top, ensuring readers get value immediately.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What does BLUF stand for in executive communications and strategic content writing?",
      options: [
        "Best Layout Under Formatting",
        "Bold Letters Underline Fonts",
        "Basic Logic Used Frequently",
        "Bottom Line Up Front"
      ],
      correct_option_index: 3,
      explanation: "BLUF stands for Bottom Line Up Front, providing an immediate summary for busy executive readers.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In the 4 U's headline copywriting framework, what are the four qualities of a high-converting headline?",
      options: [
        "Useful, Urgent, Unique, and Ultra-Specific",
        "Unclear, Unwritten, Ugly, and Understated",
        "Universal, Unlimited, Unbound, and Ultimate",
        "Unique, User, Uniform, and Utilitarian"
      ],
      correct_option_index: 0,
      explanation: "The 4 U's framework requires headlines to be Useful, Urgent, Unique, and Ultra-Specific.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In classical Aristotelian rhetoric applied to copywriting, what does 'Logos' represent?",
      options: [
        "The company's graphic logo",
        "An emotional story",
        "Logical evidence, empirical data, benchmarks, and reproducible facts supporting an argument",
        "The author's job title"
      ],
      correct_option_index: 2,
      explanation: "Logos appeals to logic and intellect through empirical proof, data, benchmarks, and structured reasoning.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What are 'Bucket Brigades' in online content writing?",
      options: [
        "Plastic containers used in construction",
        "Short transitional phrases (e.g. 'Here is the catch:', 'Think about it:') that bridge paragraphs and keep readers moving down the page",
        "A list of database tables",
        "A system for deleting spam comments"
      ],
      correct_option_index: 1,
      explanation: "Bucket brigades are conversational transition phrases designed to hook reader curiosity and maintain reading flow.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In Search Intent classification, what type of content is required for a 'Commercial Investigation' query (e.g. 'PostgreSQL vs MySQL')?",
      options: [
        "A 1-word definition",
        "A checkout page with a credit card form",
        "An objective side-by-side comparison matrix, performance benchmarks, and nuanced architectural tradeoffs",
        "A company privacy policy"
      ],
      correct_option_index: 2,
      explanation: "Commercial investigation queries require thorough comparison tables, benchmark metrics, and balanced pros/cons.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "According to George Orwell's 6 Rules for Clear Writing, what should a writer always do if it is possible to cut a word out?",
      options: [
        "Always cut it out",
        "Replace it with a longer Latin word",
        "Make it bold and italicized",
        "Leave it in to increase total word count"
      ],
      correct_option_index: 0,
      explanation: "Orwell's third rule is: 'If it is possible to cut a word out, always cut it out.'",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In SEO architecture, what is the 'Hub-and-Spoke' (Topic Cluster) model?",
      options: [
        "A bicycle repair manual",
        "Connecting a computer to a Wi-Fi router",
        "Writing 50 random articles with no internal links",
        "A comprehensive Pillar Page covering a core topic linked bi-directionally to 6 to 10 granular Sub-Topic Cluster articles, establishing topical domain authority"
      ],
      correct_option_index: 3,
      explanation: "Topic clusters organize related content around a central pillar page with structured internal links to signal search engines of comprehensive authority.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What target reading grade level on the Flesch-Kincaid scale is recommended for general and technical web copy to maximize cognitive fluency?",
      options: [
        "Post-Doctoral Grade 20+",
        "Grade 7 to 8 (accessible, clear, conversational syntax with minimal cognitive friction)",
        "Kindergarten Grade 1",
        "Grade 16 (College Senior)"
      ],
      correct_option_index: 1,
      explanation: "Writing at a 7th to 8th grade reading level maximizes accessibility and rapid comprehension without dumbing down complex concepts.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In content production workflows, what is the '1-to-10 Content Cascade' (Content Repurposing)?",
      options: [
        "Deleting 9 out of 10 articles",
        "Paying 10 writers to write 1 article",
        "Deconstructing a single comprehensive 2,500-word pillar article into multiple derivative assets (newsletter issues, LinkedIn carousels, Twitter threads, video scripts)",
        "Publishing the exact same article on 10 websites"
      ],
      correct_option_index: 2,
      explanation: "Content repurposing systematically breaks down deep long-form assets into bite-sized multi-channel social formats.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In modern Natural Language Processing (NLP) search algorithms (such as Google BERT and MUM), how has entity optimization replaced legacy keyword density?",
      options: [
        "Search engines evaluate semantic entities, conceptual relationships, and topical comprehensiveness rather than counting exact keyword frequency repetitions",
        "Search engines no longer read text",
        "Keywords must now be repeated at least 50 times",
        "Search engines only rank websites written in Python"
      ],
      correct_option_index: 0,
      explanation: "Modern NLP engines evaluate underlying Knowledge Graph entities, semantic relationships, and contextual depth rather than keyword frequency.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In long-form technical B2B content, how does 'Ethos' establish practitioner credibility in an article?",
      options: [
        "By copying text from Wikipedia",
        "By writing in all capital letters",
        "By refusing to cite external sources",
        "By detailing real-world engineering credentials, referencing firsthand production experience, and transparently sharing post-mortem lessons"
      ],
      correct_option_index: 3,
      explanation: "Ethos builds authentic trust by demonstrating firsthand practitioner expertise, engineering rigor, and honest reflection on production realities.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In competitive content engineering, what is the primary objective of a 'SERP Gap Analysis' before writing an article?",
      options: [
        "To copy the competitor's exact text",
        "To audit top-ranking pages to identify unaddressed reader questions, outdated code snippets, or missing benchmark data to make your piece demonstrably superior",
        "To report competitor websites for copyright violations",
        "To purchase backlinks from competitors"
      ],
      correct_option_index: 1,
      explanation: "SERP gap analysis uncovers missing information, outdated references, or shallow coverage in competing articles, guiding superior content creation.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In web formatting and reader psychology, what is the 'Skim-Path' and how is it constructed?",
      options: [
        "A path for skimming stones",
        "A feature that skips paragraphs randomly",
        "Structuring visual hierarchy (bolded concepts, descriptive H2/H3s every 250 words, callout cards, comparison tables) so the 80% of visitors who scan can grasp core insights in 60 seconds",
        "A technique for deleting all images"
      ],
      correct_option_index: 2,
      explanation: "Skim-paths format content with bolded key ideas, subheaders, and tables so scanning readers immediately absorb the main takeaways.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In editorial standards, why is reducing 'Passive Voice' (to under 10% of sentences) critical for professional persuasive writing?",
      options: [
        "Active voice clearly identifies the actor performing the action, producing more direct, punchy, energetic, and accountable prose with fewer wasted words",
        "Passive voice is prohibited by search engine terms of service",
        "Active voice makes fonts render in color",
        "There is zero difference in reader perception"
      ],
      correct_option_index: 0,
      explanation: "Active voice makes sentences direct, energetic, and clear by placing the subject before the verb, eliminating passive ambiguity.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #75.");
  console.log("Skill #75 update completed successfully!");
}

run();
