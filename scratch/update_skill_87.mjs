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

const skillId = "87e7c27c-93f1-4647-936c-2cbaac58c7e5";

async function run() {
  console.log("Updating Skill #87: Conversion Rate Optimization (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Conversion Heuristics, User Psychology and Diagnostic Auditing" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Checkout Engineering, Mobile Friction and Micro-Interactions" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Experimentation Statistics, Prioritization and Governance" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / VP of Conversion Engineering & CRO Architect level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The MECLABS Conversion Heuristic and BJ Fogg's Model",
      order_index: 1,
      content: `### Behavioral Models and Conversion Mathematics

1. The MECLABS Conversion Heuristic Formula:
   - C = 4m + 3v + 2(i - f) - 2a
   - C = Probability of Conversion
   - m = Motivation of the user (weighted 4, the strongest driver)
   - v = Clarity of Value Proposition (weighted 3)
   - i = Incentive to act now
   - f = Friction in the process (UI friction, form fields)
   - a = Anxiety (security fears, return doubts, weighted 2).

2. BJ Fogg's Behavioral Model (B = MAP):
   - Behavior occurs when Motivation, Ability (ease of use), and a Prompt converge simultaneously. Increasing checkout simplicity raises user Ability, enabling conversion even with moderate prompts.`
    },
    {
      track_id: track1Id,
      title: "The ResearchXL Diagnostic Audit Framework",
      order_index: 2,
      content: `### Comprehensive Conversion Auditing Methodology

1. The 6 Pillars of the ResearchXL Framework (CXL):
   - 1. Technical Analysis: Cross-browser, cross-device, and page latency bottleneck identification.
   - 2. Heuristic Analysis: Jakob Nielsen's usability heuristics (Relevance, Clarity, Distraction, Friction).
   - 3. Digital Analytics Audit: Funnel drop-off reporting and leak identification in GA4.
   - 4. Qualitative Surveys: On-site exit polls and post-purchase customer interviews.
   - 5. Session Replays & Heatmaps (Hotjar, Microsoft Clarity): Detecting rage clicks, dead clicks, and erratic scrolling.
   - 6. Usability Testing: Task-based user tests uncovering navigation confusion.`
    },
    {
      track_id: track1Id,
      title: "Visual Hierarchy, Information Scent and Cognitive Load",
      order_index: 3,
      content: `### Cognitive Optimization and Message Match

1. Cognitive Load Minimization:
   - Reducing extraneous cognitive load through clean visual hierarchy, prominent contrast between background and CTAs, and progressive disclosure of complex information.

2. Strong Information Scent:
   - Maintaining exact message match (consistent headlines, imagery, pricing, and color palettes) from the top-of-funnel ad creative through the landing page and checkout flow to reinforce user confidence.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Accelerated Checkout Wallets and 1-Click Payments",
      order_index: 1,
      content: `### Checkout Acceleration and Friction Reduction

1. 1-Click Accelerated Wallets:
   - Integrating Shop Pay, Apple Pay, Google Pay, and PayPal Express; eliminates manual entry of shipping and billing addresses, lifting mobile checkout conversion rates by 25% to 35%.

2. Dynamic Form Optimization:
   - Google Places API address auto-complete reducing keystrokes by 75%.
   - Single-page vs multi-step checkouts optimized with auto-advancing focus fields.`
    },
    {
      track_id: track2Id,
      title: "Mobile CRO and Touch Target Ergonomics",
      order_index: 2,
      content: `### Mobile Usability Standards and Viewport Optimization

1. Touch Target Ergonomics:
   - Enforcing minimum 48x48px interactive touch targets (WCAG AAA compliance) with ample margin padding to prevent accidental mis-clicks on mobile touchscreens.

2. Native Keyboard Inputs:
   - Configuring \`inputmode=\"numeric\"\` for credit card, phone, and ZIP code inputs to invoke native numeric keypads automatically.

3. Persistent Sticky Elements:
   - Pinning sticky Add-to-Cart / Checkout CTA bars within the natural mobile thumb zone.`
    },
    {
      track_id: track2Id,
      title: "Reducing Anxiety and Microcopy Optimization",
      order_index: 3,
      content: `### Anxiety De-escalation and Transparent Microcopy

1. Eliminating the #1 Cause of Cart Abandonment:
   - Upfront Shipping Cost Transparency: Displaying live shipping calculators and explicit delivery date estimates early in the funnel, eliminating surprise shipping fees at final checkout.

2. Inline Real-Time Validation:
   - Immediate positive visual feedback (green checkmarks) on valid inputs, paired with friendly, constructive error messaging for incorrect entries.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Hypothesis Engineering and the PXL Prioritization Matrix",
      order_index: 1,
      content: `### Scientific Experimentation Backlogs and Governance

1. Falsifiable Hypothesis Template:
   - \"If we [implement specific change on page], then [primary conversion metric will increase by X%], because [qualitative session replay or quantitative data finding].\"

2. The PXL Prioritization Matrix (CXL):
   - Objective point-based scoring replacing subjective executive opinion:
     - Is the change above the fold? (+1)
     - Is it noticeable in under 5 seconds? (+1)
     - Is it backed by user testing data? (+1)
     - Is it addressing a high-traffic page? (+2)`
    },
    {
      track_id: track3Id,
      title: "Statistical Rigor: Sample Sizing, Power and Peeking",
      order_index: 2,
      content: `### Experimentation Statistics and Fallacy Prevention

1. Statistical Parameters:
   - Statistical Power (1 - Beta = 80%): Probability of detecting a true effect when one exists.
   - Significance Level (Alpha = 0.05): Controlling false positive probability to <= 5%.

2. The Peeking Problem:
   - Checking A/B test results daily and stopping early upon seeing p < 0.05 inflates false positive error rates from 5% to over 30%.
   - Mandatory Rule: Enforce fixed sample sizes running for full 14-day business cycles (covering 2 complete weekends).`
    },
    {
      track_id: track3Id,
      title: "Post-Test Segmentation, Winner Scaling and Iteration",
      order_index: 3,
      content: `### Advanced Experiment Diagnostics and Institutional Memory

1. Post-Test Segmented Analysis:
   - Evaluating test outcomes across key sub-segments: Device Type (Mobile vs Desktop), Traffic Source (Paid Social vs Organic Search), and User Type (New vs Returning Visitors) to identify localized wins hidden in neutral aggregate results.

2. Centralized Experimentation Repositories:
   - Cataloging hypotheses, Figma designs, statistical outcomes, and post-mortems to compound organizational learning over time.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #87.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In the MECLABS conversion heuristic formula (C = 4m + 3v + 2(i - f) - 2a), which variable carries the highest statistical weight (weight 4)?",
      options: [
        "Incentive (i)",
        "Anxiety (a)",
        "Motivation of the user (m)",
        "Friction (f)"
      ],
      correct_option_index: 2,
      explanation: "User Motivation (m) is weighted at 4, representing the single most powerful driver of conversion behavior.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In mobile e-commerce checkout optimization, how do accelerated 1-click wallets (Shop Pay, Apple Pay, Google Pay) lift conversion rates by 25% to 35%?",
      options: [
        "By pre-populating saved shipping, billing, and payment credentials with biometric authentication, eliminating manual 12-field form entry",
        "By offering free products",
        "By turning off the internet connection",
        "By deleting customer orders"
      ],
      correct_option_index: 0,
      explanation: "Express wallets bypass friction-heavy manual form entry, letting mobile users check out in seconds via biometric auth.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What is universally documented in e-commerce behavioral analytics as the #1 primary cause of cart abandonment?",
      options: [
        "Website background colors",
        "Product font choices",
        "The website loading too fast",
        "Unexpected surprise extra costs (shipping fees, taxes) revealed late at final checkout"
      ],
      correct_option_index: 3,
      explanation: "Hidden shipping fees revealed late in checkout trigger immediate sticker shock, driving over 50% of cart abandonments.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In mobile UI accessibility and conversion design (WCAG standards), what is the recommended minimum interactive touch target size for buttons and swatches?",
      options: [
        "10x10 pixels",
        "At least 48x48 pixels (with adequate surrounding padding to prevent accidental mis-clicks)",
        "500x500 pixels",
        "2x2 pixels"
      ],
      correct_option_index: 1,
      explanation: "48x48px represents the standard ergonomic touch target dimension for human fingers on mobile touchscreens.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In BJ Fogg's Behavioral Model (B = MAP), what three components must converge simultaneously for a behavior to occur?",
      options: [
        "Marketing, Advertising, Promotion",
        "Money, Action, Profit",
        "Motivation, Ability (ease of use), and a Prompt (trigger)",
        "Mobile, Analytics, Performance"
      ],
      correct_option_index: 2,
      explanation: "Fogg's model states that Behavior requires Motivation, Ability, and a Prompt to coincide at the same moment.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In A/B testing statistical methodology, what severe flaw occurs when analysts fall victim to 'The Peeking Problem'?",
      options: [
        "Tests become too cheap to run",
        "Checking test results daily and stopping the test early as soon as p < 0.05 inflates false positive error rates from 5% to over 30%",
        "The website database crashes",
        "It causes browser rendering errors"
      ],
      correct_option_index: 1,
      explanation: "Peeking and early stopping causes severe alpha inflation, falsely declaring random noise fluctuations as significant winners.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In the ResearchXL CRO audit framework, what do 'Rage Clicks' in session replay tools (Hotjar, Microsoft Clarity) indicate?",
      options: [
        "Users who are angry at shipping delays",
        "Computer mouse hardware failures",
        "Happy customers clicking rapidly in celebration",
        "Users repeatedly and rapidly clicking an unclickable element or broken button out of frustration because they expect an interactive response"
      ],
      correct_option_index: 3,
      explanation: "Rage clicks reveal broken links, unclickable images that look like buttons, or unresponsive script triggers.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In conversion rate optimization, what is 'Information Scent'?",
      options: [
        "The visual and conceptual consistency (matching headlines, imagery, pricing, and branding) that reassures a user they are on the correct path from initial ad click through to checkout",
        "A physical perfume sold in stores",
        "The speed of server cache memory",
        "The number of images on a webpage"
      ],
      correct_option_index: 0,
      explanation: "Strong information scent maintains message and visual continuity, reassuring shoppers they landed in the right place.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In A/B test backlog prioritization, why is the objective PXL Framework (CXL) superior to subjective executive voting (HiPPO)?",
      options: [
        "It makes meetings longer",
        "It automatically runs A/B tests with zero human intervention",
        "It uses a structured point-scoring system based on empirical data, user test findings, above-the-fold visibility, and traffic volume, removing personal bias",
        "It guarantees 100% test win rates"
      ],
      correct_option_index: 2,
      explanation: "PXL scores test ideas objectively based on empirical evidence and high-impact placement, eliminating executive opinion bias.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In mobile form optimization, what HTML attribute configuration automatically displays a native numeric keypad on smartphones for credit card and ZIP code inputs?",
      options: [
        "type=\"password\"",
        "inputmode=\"numeric\"",
        "class=\"number-only\"",
        "data-keypad=\"true\""
      ],
      correct_option_index: 1,
      explanation: "inputmode='numeric' instructs mobile browsers to bring up the dedicated numeric keypad, streamlining numerical input.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "In pre-experiment sample size calculations for A/B tests, what is the industry standard benchmark for 'Statistical Power' (1 - Beta)?",
      options: [
        "10%",
        "50%",
        "99.9%",
        "80% (0.80, meaning an 80% probability of detecting a true effect when one genuinely exists, controlling Type II error to 20%)"
      ],
      correct_option_index: 3,
      explanation: "80% statistical power (Beta = 0.20) is the universal standard balancing sample size requirements with risk of false negatives.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In post-experiment diagnostics, why is 'Post-Test Segmentation' critical before declaring an overall neutral (flat) A/B test as a failure?",
      options: [
        "A flat overall result can mask strong localized winners (e.g. +18% lift on Mobile iOS) that were cancelled out in aggregate by a technical bug on Desktop or Android",
        "It allows marketers to delete negative data",
        "It automatically doubles website traffic",
        "Segmented analysis is legally required for e-commerce"
      ],
      correct_option_index: 0,
      explanation: "Aggregate results can obscure significant positive lifts in specific segments that were diluted by bugs in other viewports.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In UX micro-interaction design, how does 'Inline Real-Time Validation' improve form completion rates over submit-time validation?",
      options: [
        "It prevents users from typing",
        "It submits the form without user permission",
        "It provides immediate positive visual feedback (green checkmark) as each field is completed correctly, catching errors instantly without forcing users to re-scan the entire form upon submission",
        "It hides the submit button"
      ],
      correct_option_index: 2,
      explanation: "Inline validation catches typos immediately per field, reducing cognitive burden and frustration upon final form submission.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In A/B testing experiment governance, what is the mandatory minimum runtime duration for an online retail experiment regardless of reaching statistical significance early?",
      options: [
        "2 hours",
        "At least 14 full consecutive days (capturing 2 full weekly business cycles to account for day-of-week behavioral seasonality and avoid false positives)",
        "365 days",
        "1 day"
      ],
      correct_option_index: 1,
      explanation: "Running for at least two full 7-day business cycles (14 days) captures weekday vs weekend purchasing dynamics and prevents sample bias.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In the MECLABS heuristic formula (C = 4m + 3v + 2(i - f) - 2a), what are the two primary psychological friction points represented by 'Anxiety' (a)?",
      options: [
        "Privacy/security fears (e.g. entering credit card details on untrusted sites) and purchase consequence fears (e.g. uncertain return policies or product unsuitability)",
        "Being late for work and missing a train",
        "Slow internet bandwidth and battery life",
        "Website font size and color scheme"
      ],
      correct_option_index: 0,
      explanation: "Anxiety encompasses data security fears and buyer remorse fears, mitigated by trust badges, clear guarantees, and reviews.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #87.");
  console.log("Skill #87 update completed successfully!");
}

run();
