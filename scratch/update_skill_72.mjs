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

const skillId = "3d3fe2ff-6087-426f-9764-bdb729d73fc0";

async function run() {
  console.log("Updating Skill #72: Landing Page Optimization (9 steps across 3 tracks)...");

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
        title: `Track ${tracks.length + 1}: Landing Page Optimization`,
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
  await supabase.from("tracks").update({ title: "Track 1: Conversion Psychology, Visual Hierarchy and Information Architecture" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Form Optimization, Friction Reduction and Mobile CRO" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Copywriting Frameworks, Message Matching and Personalization" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / CRO Lead & Growth Architect level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The 5-Second Test and Hero Section Anatomy",
      order_index: 1,
      content: `### Instant Clarity and Above-the-Fold Conversion Architecture

1. The 5-Second Usability Rule:
   - Within 5 seconds of landing, visitors must clearly comprehend:
     1. What product or service is offered?
     2. What specific benefit or outcome does it provide?
     3. What is the immediate next step to take?

2. High-Converting Hero Section Anatomy:
   - Primary Outcome Headline: Focuses on tangible transformation rather than generic product features (e.g. \"Automate SOC-2 Compliance in 14 Days\").
   - Supportive Sub-Headline: Explains the exact mechanism delivering the promise.
   - Primary Call-to-Action (CTA): High-contrast button with active, value-oriented copy (\"Claim Free Audit\" vs passive \"Submit\").
   - Visual Evidence: High-resolution product UI mockup or 30-second interactive product demo.
   - Immediate Social Proof: Client logos and verified review badges positioned directly adjacent to the CTA.`
    },
    {
      track_id: track1Id,
      title: "Eye-Tracking Patterns, Directional Cues and Cognitive Flow",
      order_index: 2,
      content: `### Visual Scanning Pathways and Attention Engineering

1. Eye-Tracking Scanning Patterns:
   - F-Pattern: Prevalent on text-dense content; top horizontal scan followed by shorter horizontal scan and vertical left-edge scan.
   - Z-Pattern: Optimal for visual landing pages; eye moves top-left to top-right, diagonals down to bottom-left, and finishes at bottom-right (where primary CTA must reside).

2. Directional Cues:
   - Explicit Cues: Arrows, pointing icons, or hand-drawn lines guiding gaze directly to form fields or conversion buttons.
   - Implicit Cues (Gaze Following): Using human faces in hero imagery where the subject is looking directly at the headline or CTA button, naturally pulling user eye movement along the gaze vector.`
    },
    {
      track_id: track1Id,
      title: "Persuasive Psychology: Social Proof, Loss Aversion and Risk Reversal",
      order_index: 3,
      content: `### Behavioral Economics and Friction Elimination

1. Social Proof Hierarchy:
   - Quantified Results Testimonials: Case studies citing exact percentage growth or cost reduction out-convert generic praise by over 3x.
   - Recognizable Enterprise Client Logos: Establishes instant institutional credibility.
   - Video Testimonials with Real Customers: Maximizes authenticity and emotional resonance.

2. Loss Aversion Framing:
   - Highlighting the cost of inaction (\"Stop losing $50,000 annually to un-optimized cloud compute\") leverages human loss aversion, which is twice as psychologically motivating as equivalent gains.

3. Total Risk Reversal:
   - Unconditional 30-day money-back guarantees, no-credit-card-required free trials, and verified security trust seals eliminating purchase anxiety.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Form Design: Multi-Step Flows and Progressive Profiling",
      order_index: 1,
      content: `### Reducing Cognitive Friction in Lead Capture

1. The Multi-Step 'Breadcrumb' Technique:
   - Long 8-field single-page forms intimidate users, triggering high abandonment.
   - Multi-step forms ask 1 to 2 low-friction, non-invasive qualifying questions on Step 1 (e.g. \"What is your company size?\"), leveraging the psychological Sunk Cost and Consistency principles before requesting email/phone on Step 2.
   - Multi-step forms consistently achieve 30% to 50% higher completion rates.

2. Inline Real-Time Validation:
   - Instant visual green checkmarks upon valid input completion; avoids frustrating bulk error summaries upon clicking submit.

3. Progressive Profiling and API Enrichment:
   - Utilizing Clearbit/Apollo API enrichment to automatically append company firmographics from a single work email field, eliminating unnecessary form fields.`
    },
    {
      track_id: track2Id,
      title: "Mobile CRO: Touch Targets, Viewports and Sticky CTAs",
      order_index: 2,
      content: `### Mobile-First Conversion Architecture

1. Thumb Zone Ergonomics:
   - Positioning critical interactive conversion elements within the natural arc of one-handed thumb movement (lower-middle screen viewport).

2. Minimum Touch Target Sizing:
   - Enforcing minimum 48x48 pixel interactive button areas with at least 8px padding to eliminate accidental click errors on touchscreens.

3. Sticky Footer CTA Bars:
   - Persistent bottom conversion bar that appears smoothly when users scroll past the hero fold, maintaining instant one-tap conversion access throughout the entire mobile browsing experience.

4. Native Mobile Keyboards:
   - Setting explicit HTML input types (\`inputmode=\"tel\"\`, \`type=\"email\"\`, \`inputmode=\"numeric\"\`) to open optimal native mobile keyboards automatically.`
    },
    {
      track_id: track2Id,
      title: "Technical Performance and Core Web Vitals for Conversion",
      order_index: 3,
      content: `### Technical Speed as a Conversion Multiplier

1. Page Speed Conversion Economics:
   - Studies indicate every 100ms increase in landing page load time decays conversion rate by 7%.

2. Google Core Web Vitals Thresholds for Landing Pages:
   - Largest Contentful Paint (LCP < 2.5s): Optimizing main hero image loading via next-gen AVIF/WebP formats, responsive \`srcset\`, and critical asset preloading (\`<link rel=\"preload\">\`).
   - Interaction to Next Paint (INP < 200ms): Eliminating long JavaScript execution blocks to ensure instant button click responsiveness.
   - Cumulative Layout Shift (CLS < 0.1): Specifying explicit width and height dimensions on all images, video embeds, and fonts to prevent layout shifts.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Copywriting Frameworks: PAS, BAB and AIDA for Conversion",
      order_index: 1,
      content: `### Direct-Response Conversion Copywriting Frameworks

1. Problem - Agitation - Solution (PAS):
   - Problem: Pinpoints the specific acute bottleneck the user is facing.
   - Agitation: Dramatizes the emotional, operational, and financial cost of leaving the problem unaddressed.
   - Solution: Introduces the product as the definitive, frictionless antidote.

2. Before - After - Bridge (BAB):
   - Before: Depicts current frustrating reality.
   - After: Illustrates the desired future state where the problem is solved.
   - Bridge: Positions the product/service as the bridge getting them there.

3. Attention - Interest - Desire - Action (AIDA):
   - Classical structural framework maintaining reading momentum down the page.`
    },
    {
      track_id: track3Id,
      title: "Ad-to-Page Message Match and Information Scent",
      order_index: 2,
      content: `### Cognitive Scent and Campaign Scent Alignment

1. Information Scent Continuity:
   - High conversion rates require strict visual and semantic continuity between the ad creative and the destination landing page.
   - Ad Headline, promotional offer, imagery style, and primary value proposition must be echoed verbatim on the landing page hero section.

2. The Scent Disconnect Trap:
   - Sending users clicking an ad for \"Enterprise B2B Accounting Software\" to a generic corporate homepage forces users to hunt for information, causing instant bounce rates (>70%). Dedicated single-purpose landing pages are mandatory for paid media.`
    },
    {
      track_id: track3Id,
      title: "Dynamic Text Replacement (DTR) and Personalization",
      order_index: 3,
      content: `### Programmatic Dynamic Landing Page Personalization

1. Dynamic Text Replacement (DTR):
   - Replaces headline words dynamically based on URL query parameters:
\`\`\`javascript
const urlParams = new URLSearchParams(window.location.search);
const keyword = urlParams.get('kw') || 'Enterprise Software';
document.getElementById('hero-headline').innerText = 'The Best ' + keyword + ' for Fast Teams';
\`\`\`
   - Achieves 100% ad-to-page keyword match across thousands of search campaign variations automatically.

2. IP Reverse Lookup Personalization:
   - Dynamically adapts logos and case studies based on the visitor's corporate IP domain (e.g. displaying FinTech case studies to financial visitors and Healthcare case studies to hospital networks).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #72.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "According to conversion rate optimization principles, what three fundamental questions must a visitor be able to answer within the '5-Second Test' of landing on a page?",
      options: [
        "What is the CEO name, company address, and stock ticker?",
        "What is this product?, What benefit does it provide me?, and What action do I take next?",
        "How many employees work here, what server OS is used, and what font is this?",
        "Is the website written in HTML, CSS, or JavaScript?"
      ],
      correct_option_index: 1,
      explanation: "The 5-second test evaluates whether a user immediately understands the product, value proposition, and primary call to action.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In conversion copywriting, what does the PAS copywriting framework stand for?",
      options: [
        "Price, Accuracy, Speed",
        "Position, Alignment, Scale",
        "Product, Audience, Sales",
        "Problem, Agitation, Solution"
      ],
      correct_option_index: 3,
      explanation: "PAS stands for Problem (identifying pain), Agitation (dramatizing consequences), and Solution (presenting the product).",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What is 'Ad-to-Page Message Match' (Information Scent) in performance marketing?",
      options: [
        "Ensuring the exact headline, offer, and imagery from the ad are mirrored directly on the landing page hero section to maintain cognitive continuity",
        "Sending all ad clicks to the company homepage",
        "Showing random popup ads on the landing page",
        "Changing page colors based on the user's mood"
      ],
      correct_option_index: 0,
      explanation: "Message match maintains consistency between the ad creative and the landing page, confirming to users they reached the right destination.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In mobile landing page design, what is the minimum recommended touch target size for primary Call-to-Action (CTA) buttons to prevent mis-clicks?",
      options: [
        "10x10 pixels",
        "100x100 millimeters",
        "48x48 pixels (with adequate surrounding padding)",
        "5x5 pixels"
      ],
      correct_option_index: 2,
      explanation: "Mobile touch guidelines (Apple HIG and Google Material) recommend at least 48x48px touch targets for effortless thumb interaction.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What direct-response headline approach produces the highest conversion rates on landing page hero sections?",
      options: [
        "A generic vague slogan (e.g. 'Innovating the Future of Business')",
        "A clear, quantifiable outcome or user transformation (e.g. 'Automate SOC-2 Compliance in 14 Days')",
        "Listing 50 bullet points in tiny font",
        "A dictionary definition of the industry"
      ],
      correct_option_index: 1,
      explanation: "Outcome-driven headlines that articulate specific, quantifiable user value convert far higher than vague brand slogans.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In lead generation CRO, why do Multi-Step 'Breadcrumb' forms consistently outperform long single-page forms by 30% to 50%?",
      options: [
        "Multi-step forms hide the submit button permanently",
        "Multi-step forms delete email addresses",
        "They ask low-friction non-invasive questions on Step 1, leveraging the psychological Sunk Cost and Consistency principles before requesting contact details on Step 2",
        "Multi-step forms only run on desktop computers"
      ],
      correct_option_index: 2,
      explanation: "Multi-step forms lower initial intimidation by starting with easy non-threatening questions, creating psychological momentum to complete.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In visual eye-tracking and direction cuing, how does 'Gaze Following' (implicit directional cues) increase conversion rates?",
      options: [
        "Using imagery of a person looking directly toward the headline or CTA button naturally pulls the visitor's subconscious eye gaze along the same vector toward the conversion goal",
        "It forces users to keep their webcams turned on",
        "It speeds up website hosting servers",
        "It changes text fonts automatically"
      ],
      correct_option_index: 0,
      explanation: "Humans instinctively look where other humans are looking; aligning model eye gaze toward CTAs directs visitor attention effectively.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In technical performance optimization for conversion, what is the impact of Core Web Vitals Largest Contentful Paint (LCP)?",
      options: [
        "LCP measures font sizes on the page",
        "LCP only matters for search engine bots",
        "LCP determines screen brightness",
        "LCP measures the time to render the main hero image or text block; keeping LCP under 2.5 seconds prevents visitor drop-off and boosts conversion rates"
      ],
      correct_option_index: 3,
      explanation: "LCP measures perceived load speed for main content; fast LCP under 2.5s minimizes bounce rates and maximizes conversion.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In programmatic conversion optimization, what is 'Dynamic Text Replacement' (DTR)?",
      options: [
        "Replacing all words with emojis",
        "Reading URL query parameters (e.g. ?kw=Miami+Real+Estate) to dynamically update landing page headlines in real time, achieving 100% ad-to-page keyword match",
        "Translating English into Latin",
        "Deleting text after 10 seconds"
      ],
      correct_option_index: 1,
      explanation: "DTR matches page copy dynamically to the exact search keyword or campaign parameter in the URL, maximizing message match.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In behavioral conversion psychology, why is 'Loss Aversion' framing often more effective than standard benefit framing?",
      options: [
        "Loss aversion makes website fonts darker",
        "Loss aversion is required by law",
        "Psychologically, the emotional pain of losing an asset or wasting money is roughly twice as motivating as the pleasure of gaining an equivalent benefit",
        "Loss aversion only works on teenagers"
      ],
      correct_option_index: 2,
      explanation: "Kahneman & Tversky's prospect theory shows humans are twice as motivated to avoid potential losses as to achieve equivalent gains.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In landing page visual layout theory, what distinguishes the 'Z-Pattern' from the 'F-Pattern' eye-tracking scan?",
      options: [
        "The Z-Pattern describes scanning across visual landing pages with alternating blocks (top-left to right, diagonal down-left, across to bottom-right CTA), while the F-Pattern occurs on text-heavy content",
        "The Z-Pattern is only used on mobile phones",
        "The F-Pattern only occurs on video websites",
        "There is zero difference in visual scanning"
      ],
      correct_option_index: 0,
      explanation: "Z-patterns guide eyes across balanced visual landing pages ending at the CTA; F-patterns dominate text-heavy scanning along the left margin.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Core Web Vitals optimization for landing pages, what causes Cumulative Layout Shift (CLS) and how is it eliminated?",
      options: [
        "Slow internet cables",
        "Having too many buttons",
        "Using dark mode themes",
        "Images, web fonts, or dynamic embeds loading without explicit width/height dimensions, causing content to jump; eliminated by reserving explicit aspect-ratio containers in CSS"
      ],
      correct_option_index: 3,
      explanation: "CLS occurs when elements shift unexpectedly during render; reserving dimension containers in HTML/CSS eliminates layout shifts.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In conversion copywriting, what is the 'Before - After - Bridge' (BAB) framework?",
      options: [
        "A guide for building physical bridges",
        "It depicts the user's current painful reality (Before), paints an idealized picture of life with the problem solved (After), and presents the product as the vehicle getting them there (Bridge)",
        "A system for sorting customer emails",
        "A technique for deleting old landing pages"
      ],
      correct_option_index: 1,
      explanation: "BAB contrasts the user's current frustration with their desired outcome, positioning the product as the bridge between them.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In B2B high-value lead capture forms, how does 'API-Driven Progressive Enrichment' (e.g. using Clearbit or Apollo) optimize conversion without sacrificing lead quality?",
      options: [
        "By asking users 20 mandatory questions",
        "By calling customers on the phone during form fill",
        "The form asks only for a corporate email address; backend webhooks query enrichment APIs in real time to populate company size, industry, revenue, and tech stack into the CRM automatically",
        "By verifying passwords with two-factor authentication"
      ],
      correct_option_index: 2,
      explanation: "Data enrichment APIs look up firmographic data in the background from a single email, keeping forms short while delivering rich lead data.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In mobile CRO engineering, why are 'Sticky Bottom CTA Bars' critical for long-form landing pages?",
      options: [
        "They maintain effortless one-tap conversion accessibility as users scroll through social proof and pricing without forcing them to scroll all the way back to the top",
        "They prevent mobile screens from turning off",
        "They reduce mobile data usage",
        "They lock the user inside the browser"
      ],
      correct_option_index: 0,
      explanation: "Sticky footer bars keep conversion buttons visible and clickable anywhere on the page, eliminating scroll friction.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #72.");
  console.log("Skill #72 update completed successfully!");
}

run();
