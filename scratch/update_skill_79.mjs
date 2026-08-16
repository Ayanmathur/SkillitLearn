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

const skillId = "3e7e63b9-b503-4709-8ec1-0baf728bf710";

async function run() {
  console.log("Updating Skill #79: Brand Voice & Positioning (9 steps across 3 tracks)...");

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
        title: `Track ${tracks.length + 1}: Brand Voice & Positioning`,
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
  await supabase.from("tracks").update({ title: "Track 1: Positioning Strategy, Category Design and Differentiation" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Brand Archetypes, Voice Matrices and Tone Calibration" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Brand Governance, Lexicons and Messaging Hierarchies" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / CMO & Brand Strategist level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "April Dunford's 10-Step Positioning Framework",
      order_index: 1,
      content: `### Strategic Category Positioning and Value Context

1. The 5 Core Positioning Components (April Dunford):
   - 1. Competitive Alternatives: What customers would do if your product did not exist (e.g. manual spreadsheets, hiring interns, doing nothing).
   - 2. Differentiated Capabilities: Unique features and technical capabilities that competitive alternatives cannot duplicate.
   - 3. Value and Proof: Tangible business value enabled by those capabilities.
   - 4. Target Customer Segments: The specific sub-segment of buyers who care desperately about that unique value.
   - 5. Market Category: The market frame of reference that makes your value immediately obvious to buyers (e.g. Head-to-Head vs Niche Sub-Segment vs New Category Creation).`
    },
    {
      track_id: track1Id,
      title: "Marty Neumeier's Zag and The ONLY-ness Statement",
      order_index: 2,
      content: `### Radical Differentiation and Gut-Feeling Branding

1. Marty Neumeier's Brand Principles:
   - Brand Definition: A brand is not a logo, corporate identity, or slogan; a brand is a customer's visceral gut feeling about a product, service, or organization.
   - The Zag Rule: \"When everybody zigs, zag.\" Meaningful differentiation requires radical focus on being different, not merely incrementally better.

2. The 17-Word ONLY-ness Formulation:
   - \"Our brand is the ONLY [market category] that [differentiated value proposition] for [ideal customer profile] in [geography/segment] who want [transformative outcome].\"`
    },
    {
      track_id: track1Id,
      title: "Positioning vs Messaging vs Taglines Hierarchy",
      order_index: 3,
      content: `### The Strategic Hierarchy of Brand Communication

1. The Three Layers of Brand Expression:
   - Positioning (Internal Strategy): The definitive internal choice defining market category, target ICP, and differentiated value proposition.
   - Messaging (External Architecture): The programmatic translation of positioning into structured value pillars, headlines, and copywriting scripts tailored to specific buyer personas.
   - Taglines (Public Creative Expression): Memorable, concise 3 to 6 word slogans capturing brand essence (e.g. Nike's \"Just Do It\", Apple's \"Think Different\").`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Carl Jung's 12 Brand Archetypes in Enterprise Positioning",
      order_index: 1,
      content: `### Psychological Archetypes and Personality Mapping

1. The 12 Jungian Brand Archetypes:
   - The Outlaw / Rebel: Disrupts the established order (Apple, Harley-Davidson).
   - The Sage: Pursues truth and wisdom through data and knowledge (Google, McKinsey).
   - The Hero: Overcomes massive obstacles through courage and mastery (Nike, FedEx).
   - The Creator: Empowers users to build and invent (Lego, Figma).
   - The Explorer: Craves autonomy, frontier discovery, and rugged authenticity (Patagonia, Jeep).
   - The Caregiver: Protects, nurtures, and provides safety (Volvo, Johnson & Johnson).

2. Dual-Archetype Architecture:
   - Choosing 1 Primary Archetype (70%) + 1 Secondary Modifier (30%) to create nuanced, distinct brand identities.`
    },
    {
      track_id: track2Id,
      title: "Nielsen Norman Group 4 Voice Dimensions Matrix",
      order_index: 2,
      content: `### The 4 Pillars of Brand Voice Calibration

1. The 4 Voice Dimensions (Nielsen Norman Group):
   - 1. Funny vs Serious: Witty, playful humor vs solemn, analytical authority.
   - 2. Formal vs Casual: Academic, highly structured corporate prose vs relaxed, colloquial conversational dialogue.
   - 3. Respectful vs Irreverent: Polite, deferential language vs bold, disruptive, provocative irreverence.
   - 4. Enthusiastic vs Matter-of-Fact: High-energy, passionate inspiration vs pragmatic, understated, dry precision.`
    },
    {
      track_id: track2Id,
      title: "Voice vs Tone: Contextual Tone Modulation Spectrum",
      order_index: 3,
      content: `### Immutable Voice with Contextual Tone Modulation

1. The Voice vs Tone Dichotomy:
   - Brand Voice (Constant): The permanent, underlying personality, character, and rhythm of the brand across all touchpoints.
   - Brand Tone (Fluid): Dynamic modulation of emotional pitch based on the user's immediate psychological context.

2. Contextual Tone Spectrum:
   - Top-of-Funnel Marketing: Provocative, inspiring, energetic.
   - Developer API Documentation: Concise, objective, precise, zero fluff.
   - Service Outages & Billing Errors: Empathetic, calm, serious, transparent, and solution-focused.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "The Messaging Architecture: Value Pillars and Proof Points",
      order_index: 1,
      content: `### Structured Enterprise Messaging Frameworks

1. The 3-Tier Messaging Architecture:
   - Tier 1: Core Positioning Statement and Master Value Proposition.
   - Tier 2: Three Strategic Pillars (e.g. 1. Unmatched Developer Velocity, 2. Enterprise-Grade Security, 3. Zero-Ops Reliability).
   - Tier 3: Supporting Proof Points (hard empirical evidence: SOC-2 Type II certification, 99.999% SLA, 10x query speed benchmarks).`
    },
    {
      track_id: track3Id,
      title: "The Brand Lexicon: Do-Say vs Don't-Say Guidelines",
      order_index: 2,
      content: `### Organizational Vocabulary Governance

1. The Brand Lexicon Guide:
   - Standardizes approved terminology across marketing, sales, product engineering, and customer support.

2. Do-Say vs Don't-Say Protocols:
   - DO SAY: \"Deterministic Data Pipelines\", \"Automated Reliability\", \"Production-Ready Systems\".
   - DON'T SAY: \"Magical AI widget\", \"Cheap quick fix\", \"Synergistic disruptive software\".
   - Prevents corporate buzzword contamination and enforces technical credibility.`
    },
    {
      track_id: track3Id,
      title: "Measuring Brand Equity, Sentiment and Pricing Power",
      order_index: 3,
      content: `### Brand Measurement and Economic Moats

1. The True Economic Test of Brand Equity:
   - Pricing Power: The ability to charge premium prices (2x to 5x commodity alternatives) without losing customer market share.

2. Quantitative Brand Equity Metrics:
   - Net Promoter Score (NPS: % Promoters minus % Detractors).
   - Organic Brand Search Volume (measuring direct navigational Google search growth).
   - Share of Voice (SOV) across industry publications and social mentions.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #79.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "According to Marty Neumeier's brand principles, what is the core definition of a 'Brand'?",
      options: [
        "A company's trademarked logo",
        "A corporate website color scheme",
        "A customer's visceral gut feeling about a product, service, or organization",
        "The legal registered business entity name"
      ],
      correct_option_index: 2,
      explanation: "A brand is not what the company says it is; it is the emotional gut feeling that customers hold about the company.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In April Dunford's 10-step positioning framework, what is a 'Competitive Alternative'?",
      options: [
        "What customers would do or use if your product did not exist (e.g. manual spreadsheets, hiring interns, doing nothing)",
        "The company's stock price competitors",
        "A foreign currency exchange rate",
        "The computer operating system used by developers"
      ],
      correct_option_index: 0,
      explanation: "Competitive alternatives define what the buyer falls back on in the absence of your product, setting the benchmark for differentiation.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In Carl Jung's brand archetypes, which archetype represents seeking truth, wisdom, and data-driven enlightenment (exemplified by Google and McKinsey)?",
      options: [
        "The Outlaw",
        "The Jester",
        "The Lover",
        "The Sage"
      ],
      correct_option_index: 3,
      explanation: "The Sage archetype values knowledge, truth, analysis, and data-driven objective expertise.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In brand voice design, what is the fundamental difference between 'Voice' and 'Tone'?",
      options: [
        "Voice is written; Tone is spoken on video",
        "Voice is the permanent, constant personality of the brand, while Tone is fluid, adapting emotional pitch to specific user situations (e.g. marketing vs billing support)",
        "Voice only applies to startups; Tone only applies to enterprises",
        "There is zero difference"
      ],
      correct_option_index: 1,
      explanation: "Voice remains constant as the core personality; tone flexes dynamically to fit the context (such as empathetic tone during service outages).",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What is the ultimate economic proof of strong brand equity and market positioning?",
      options: [
        "Having a verified blue checkmark on social media",
        "Publishing 50 blog posts a week",
        "Pricing Power (the ability to charge premium prices 2x to 5x commodity alternatives without losing market share)",
        "Buying billboards in Times Square"
      ],
      correct_option_index: 2,
      explanation: "Pricing power is the defining financial indicator of brand equity; customers willingly pay premiums for trusted brands.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In the Nielsen Norman Group's 4 Voice Dimensions matrix, what are the four spectrums used to calibrate brand voice?",
      options: [
        "Red vs Blue, Fast vs Slow, Big vs Small, High vs Low",
        "Funny vs Serious, Formal vs Casual, Respectful vs Irreverent, and Enthusiastic vs Matter-of-Fact",
        "English vs Spanish, Text vs Video, Audio vs Print, Web vs Mobile",
        "Past vs Present, Future vs Now, Cost vs Revenue, Profit vs Loss"
      ],
      correct_option_index: 1,
      explanation: "NN/g identifies 4 primary voice dimensions: Funny/Serious, Formal/Casual, Respectful/Irreverent, and Enthusiastic/Matter-of-Fact.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In positioning architecture, how does 'Positioning' differ from 'Messaging' and 'Taglines'?",
      options: [
        "Positioning is written in HTML; Messaging is written in CSS",
        "Taglines are for developers; Messaging is for executives",
        "Positioning is only for physical retail stores",
        "Positioning is the internal strategic choice defining product identity and category; Messaging translates positioning into structured arguments for personas; Taglines are short public creative slogans"
      ],
      correct_option_index: 3,
      explanation: "Positioning is internal strategic alignment, messaging is persona-specific copywriting architecture, and taglines are public slogans.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In brand vocabulary governance, what is the purpose of a 'Brand Lexicon' (Do-Say vs Don't-Say guide)?",
      options: [
        "To standardize approved terminology across marketing, sales, and engineering while eliminating buzzwords and enforcing technical credibility",
        "To teach employees how to spell English words",
        "To translate product names into foreign languages",
        "To hide product flaws from customers"
      ],
      correct_option_index: 0,
      explanation: "A Brand Lexicon governs terminology, steering teams away from hollow buzzwords toward precise, credible language.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "Which Jungian brand archetype is characterized by disrupting the status quo, championing radical independence, and defying conventional industry norms (e.g. Apple's 1984, Harley-Davidson)?",
      options: [
        "The Innocent",
        "The Caregiver",
        "The Outlaw / Rebel",
        "The Ruler"
      ],
      correct_option_index: 2,
      explanation: "The Outlaw/Rebel archetype challenges conventions and breaks established rules to empower independent thinkers.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In strategic positioning, what is the 'Head-to-Head' category strategy?",
      options: [
        "Fighting with coworkers",
        "Positioning directly against the dominant market leader in an existing established category to win market share by proving overall superiority",
        "Creating a brand-new unnamed product category",
        "Selling only to small businesses"
      ],
      correct_option_index: 1,
      explanation: "Head-to-head positioning takes on established incumbents in existing categories by claiming superior overall performance or value.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "In Marty Neumeier's 'Zag' formulation, what is the 17-word ONLY-ness test structure?",
      options: [
        "We are the cheapest company in the world that sells products to anyone who wants them",
        "A list of 17 product features",
        "A legal copyright disclaimer",
        "Our brand is the ONLY [category] that [differentiated value proposition] for [ideal customer profile] in [geography/segment] who want [transformation]"
      ],
      correct_option_index: 3,
      explanation: "The ONLY-ness statement forces radical clarity by defining the exact category, differentiator, target audience, and outcome.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In enterprise messaging architecture, how are 'Strategic Pillars' linked to 'Proof Points'?",
      options: [
        "Each high-level value pillar (e.g. Zero-Ops Reliability) must be backed by hard empirical proof points (e.g. 99.999% SLA, multi-region failover benchmarks) to substantiate claims",
        "Pillars are for marketing; Proof Points are for legal teams",
        "They are completely unrelated concepts",
        "Proof points must be hidden from customers"
      ],
      correct_option_index: 0,
      explanation: "Strategic messaging pillars make value claims, while empirical proof points validate those claims with hard facts and data.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "When modulating brand tone during a critical production system outage, what tone calibration should an enterprise technical brand adopt?",
      options: [
        "Playful, sarcastic, and funny",
        "Aggressive and defensive",
        "Empathetic, calm, highly transparent, serious, and solution-oriented",
        "Enthusiastic and joyful"
      ],
      correct_option_index: 2,
      explanation: "During service outages, tone must immediately shift to empathetic, transparent, calm, and focused on resolution to preserve trust.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Brand Equity measurement, what does tracking 'Organic Brand Search Volume' over time indicate to marketing leadership?",
      options: [
        "How many employees visited the website",
        "The growth of unprompted consumer mental availability and direct brand demand, proving that top-of-funnel brand equity is building in the market",
        "The cost of Google server hosting",
        "The number of spam bots on search engines"
      ],
      correct_option_index: 1,
      explanation: "Rising branded search volume proves growing brand awareness and intent, as users actively search for the company by name.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In category positioning, why is the 'Big Fish, Small Pond' (Sub-Segment) strategy often superior for emerging startups than creating a new category?",
      options: [
        "It dominates a tightly defined, underserved niche within an established category where buyer budgets already exist, avoiding the massive capital expenditure needed to educate the market on a new category",
        "It only works on fishing websites",
        "It allows companies to avoid paying corporate taxes",
        "It eliminates all customer support needs"
      ],
      correct_option_index: 0,
      explanation: "Sub-segment positioning captures existing category budgets from an underserved niche before expanding to broader markets.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #79.");
  console.log("Skill #79 update completed successfully!");
}

run();
