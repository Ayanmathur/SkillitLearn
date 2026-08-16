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

const skillId = "8bc2e571-e7ba-405a-9c9f-aedf466683a7";

async function run() {
  console.log("Updating Skill #73: A/B Testing for Ads (9 steps across 3 tracks)...");

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
        title: `Track ${tracks.length + 1}: A/B Testing for Ads`,
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
  await supabase.from("tracks").update({ title: "Track 1: Experimentation Statistics, Sample Sizing and Stopping Rules" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Ad Creative Experimentation Frameworks and Variable Isolation" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Multi-Armed Bandits, Governance and Cognitive Biases" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Head of Growth Experimentation level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Hypothesis Formulation, Type I/II Errors and Statistical Power",
      order_index: 1,
      content: `### Inferential Statistics and Statistical Power

1. Core Hypothesis Framework:
   - Null Hypothesis (H0): There is no true difference in performance between Ad Variant A and Variant B (lift = 0).
   - Alternative Hypothesis (H1): Ad Variant B produces a statistically significant performance lift over Variant A.

2. Error Typologies and Statistical Power:
   - Type I Error (Alpha, standard 5%): False Positive; declaring an ad variant a winner when no true performance difference exists.
   - Type II Error (Beta, standard 20%): False Negative; failing to detect a true winning ad variation.
   - Statistical Power (1 - Beta, standard 80%): The mathematical probability of correctly detecting a true winning effect when one exists.`
    },
    {
      track_id: track1Id,
      title: "Sample Size Calculation, MDE and The Peeking Problem",
      order_index: 2,
      content: `### Pre-Experiment Sizing and Preventing False Discoveries

1. Sample Sizing and Minimum Detectable Effect (MDE):
   - Minimum Detectable Effect (MDE): The smallest percentage lift the experiment is powered to detect.
   - Sample Size Formula:
     n = (2 * (z_(alpha/2) + z_beta)^2 * p * (1 - p)) / MDE^2.
   - Lowering MDE requires exponentially larger impression volumes.

2. The Peeking Problem:
   - Continuously inspecting p-values and terminating tests early inflates False Discovery Rates from 5% to over 30%.
   - Stopping Rules: Tests must run to predetermined sample sizes and complete full 7 to 14 day business cycles to account for day-of-week seasonality.`
    },
    {
      track_id: track1Id,
      title: "Frequentist vs Bayesian Testing and Sequential Boundaries",
      order_index: 3,
      content: `### Statistical Paradigms in Ad Optimization

1. Frequentist vs Bayesian Inference:
   - Frequentist: Calculates p-values under the assumption that H0 is true; requires strict fixed sample sizes.
   - Bayesian: Computes the direct posterior probability that Variant B is superior to Variant A (P(B > A)) and calculates Expected Loss, providing actionable probability distributions.

2. Sequential Testing (Alpha-Spending Functions):
   - Methods such as Pocock and O'Brien-Fleming boundaries adjust statistical significance thresholds dynamically, allowing continuous monitoring while mathematically controlling Type I error rates.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Single-Variable Isolation and Creative Decomposition",
      order_index: 1,
      content: `### Creative Architecture and Variable Isolation

1. Deconstructing Video and Static Ad Elements:
   - The Hook (First 3 Seconds): Evaluated via Thumb-Stop Rate (3-Second Video Plays / Impressions, target >30%). Testing 3 to 5 distinct visual hooks against identical body copy isolates top-of-funnel engagement.
   - The Angle (Core Value Proposition): Contrasting emotional pain point angles vs status angles vs speed/efficiency angles.
   - The Visual Format: Lo-Fi User Generated Content (UGC) vs High-Production 3D renders vs 2D motion graphics.
   - Call-to-Action (CTA): Transactional (\"Get 20% Off\") vs Low-friction (\"See How It Works\").

2. Single-Variable Isolation Rule:
   - Changing only one element per test ensures performance lift is attributed accurately to the specific variable.`
    },
    {
      track_id: track2Id,
      title: "Sandbox Testing Topologies: ABO Sandbox to CBO Scaling",
      order_index: 2,
      content: `### Enterprise Ad Testing Pipelines

1. Creative Sandbox (ABO Architecture):
   - New ad variations are launched inside an Ad Set Budget Optimization (ABO) sandbox campaign with equal daily budgets per ad set (1x to 2x Target CPA).
   - Prevents platform delivery algorithms from prematurely allocating 90% of budget to an untested ad before statistical significance is achieved.

2. Winner Graduation:
   - Validated winning creatives with proven CPA and ROAS improvements are extracted from the sandbox and scaled inside a master Campaign Budget Optimization (CBO) campaign.`
    },
    {
      track_id: track2Id,
      title: "Audience Split Testing and Cannibalization Prevention",
      order_index: 3,
      content: `### Audience Partitioning and Auction Governance

1. Meta Split Testing Engine:
   - Partitions target audiences into non-overlapping, mutually exclusive randomized segments.
   - Prevents internal auction self-bidding (auction overlap) where multiple ad sets bid against each other, driving up CPMs.

2. Conversion Holdout Tests:
   - Withholds a 10% to 20% randomized control group from seeing any ads to quantify baseline organic conversions and compute true incremental lift (iROAS).`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Multi-Armed Bandits: Exploration vs Exploitation",
      order_index: 1,
      content: `### Dynamic Traffic Allocation and Regret Minimization

1. A/B Testing vs Multi-Armed Bandits:
   - Classical A/B Testing: Splits traffic 50/50 for the entire test duration, incurring opportunity cost (regret) by serving underperforming variants to 50% of traffic.
   - Multi-Armed Bandits (Thompson Sampling / Epsilon-Greedy): Dynamically shifts traffic in real time toward the winning variant while continuing to allocate exploratory traffic to lesser-tested variants.

2. Strategic Selection:
   - Use Fixed-Horizon A/B testing when statistical rigor and long-term causal insights are needed; use Bandits for short-term promotional sales where maximizing immediate revenue is paramount.`
    },
    {
      track_id: track3Id,
      title: "Experimentation Biases: Twyman's Law, Novelty and Primacy",
      order_index: 2,
      content: `### Experimental Artifacts and Bias Diagnostics

1. Twyman's Law:
   - \"Any statistic that appears unusually interesting or different is usually wrong.\"
   - Extreme 500% conversion lifts usually signal tracking bugs, duplicate pixel firings, or bot traffic.

2. Temporal Behavioral Biases:
   - Novelty Effect: Existing users click a new ad design temporarily because it looks fresh; performance decays back to baseline after several days.
   - Primacy Effect: Initial resistance to new designs before adoption stabilizes.

3. Sample Ratio Mismatch (SRM):
   - Running Chi-Square goodness-of-fit tests on visitor counts to confirm the observed split matches the expected 50/50 allocation, detecting silent routing bugs.`
    },
    {
      track_id: track3Id,
      title: "Experiment Prioritization and Knowledge Graphs",
      order_index: 3,
      content: `### Experimentation Governance and Prioritization

1. Prioritization Frameworks:
   - ICE Scoring: Impact (1 to 10), Confidence (1 to 10), Ease of Implementation (1 to 10); Score = (I + C + E) / 3.
   - PIE Scoring: Potential, Importance, Ease.

2. Falsifiable Hypothesis Syntax:
   - \"If we change [Independent Variable Hook], then [Dependent Metric Thumb-Stop Rate] will increase by [X%] because [Specific Psychological Driver].\"

3. Centralized Learning Repositories:
   - Documenting test metadata, statistical confidence, creative visual screenshots, and validated learnings across teams.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #73.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In statistical experimentation, what is a Type I Error (Alpha, typically set at 5%)?",
      options: [
        "A computer hardware failure",
        "Failing to detect a real winning ad",
        "A False Positive (declaring an ad variation a winner when no true difference in performance exists)",
        "Running out of ad spend"
      ],
      correct_option_index: 2,
      explanation: "A Type I error occurs when researchers reject a true null hypothesis, mistakenly declaring a winning variation.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What does Statistical Power (1 - Beta, typically set at 80%) measure in an ad A/B test?",
      options: [
        "The probability of correctly detecting a true winning effect when one actually exists",
        "The computer CPU processing speed",
        "The daily budget of the ad account",
        "The number of characters in the ad headline"
      ],
      correct_option_index: 0,
      explanation: "Statistical power is the probability of avoiding Type II false negative errors and detecting true performance lifts.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What top-of-funnel video ad metric evaluates hook effectiveness during the first 3 seconds of playback (3-Second Video Plays / Impressions)?",
      options: [
        "Return on Ad Spend (ROAS)",
        "Cost Per Acquisition (CPA)",
        "Bounce Rate",
        "Thumb-Stop Rate (Hook Rate)"
      ],
      correct_option_index: 3,
      explanation: "Thumb-Stop Rate measures the percentage of viewers who stop scrolling to watch at least 3 seconds of a video ad.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "Why should an ad creative experiment test only a single variable at a time (e.g. testing 3 hooks while keeping body copy and offer identical)?",
      options: [
        "Multi-variable tests are illegal",
        "To ensure that any observed difference in conversion performance is causally attributable strictly to that specific modified element",
        "Facebook bans multi-variable ads",
        "To make ads render in black and white"
      ],
      correct_option_index: 1,
      explanation: "Isolating a single variable provides unambiguous causal attribution, revealing exactly which component drove the performance change.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In growth experimentation frameworks, what does the 'ICE' prioritization scoring model evaluate?",
      options: [
        "Internet, Computer, Ethernet",
        "Income, Cost, Expense",
        "Impact, Confidence, and Ease of Implementation",
        "Images, Copy, and Extensions"
      ],
      correct_option_index: 2,
      explanation: "ICE scoring ranks experimental ideas based on potential Impact, Confidence in hypothesis, and Ease of execution.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In statistical testing, what is the 'Peeking Problem' and why does it invalidate A/B test results?",
      options: [
        "Looking at competitor ads",
        "Repeatedly checking p-values and stopping the test early as soon as significance is reached, which inflates the true False Positive Rate from 5% to over 30%",
        "Peeking at customer passwords",
        "Turning off web analytics"
      ],
      correct_option_index: 1,
      explanation: "Continuous peeking without sample size correction drastically inflates Type I error rates due to random early fluctuations.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In paid social ad testing architecture, why is an Ad Set Budget Optimization (ABO) sandbox used for creative discovery instead of Campaign Budget Optimization (CBO)?",
      options: [
        "ABO campaigns are free of charge",
        "CBO is disabled on weekends",
        "ABO only runs on mobile devices",
        "CBO algorithms allocate budget aggressively to existing historical winners, starving new creative tests of the impression volume needed to achieve statistical significance; ABO enforces equal spend"
      ],
      correct_option_index: 3,
      explanation: "ABO sandboxes guarantee equal budget distribution to each creative variant, preventing machine learning bias from starving new tests.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In experiment diagnostics, what is 'Twyman's Law'?",
      options: [
        "Any statistic or metric that appears unusually interesting or shows an extreme 500% lift is usually wrong (caused by tracking errors, bot traffic, or broken pixels)",
        "Every ad must have 2 words",
        "Ad spend doubles every year",
        "Video ads always beat static ads"
      ],
      correct_option_index: 0,
      explanation: "Twyman's Law states that extreme outlier experimental results are almost always artifacts of measurement or instrumentation errors.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "How does a 'Multi-Armed Bandit' (e.g. Thompson Sampling) algorithm differ operationally from a fixed-horizon A/B test?",
      options: [
        "Bandits only work on slot machine websites",
        "A/B tests cannot measure revenue",
        "Bandits dynamically route increasing traffic to higher-performing variants in real time to minimize opportunity loss (regret), while A/B tests maintain a rigid 50/50 split until completion",
        "There is zero mathematical difference"
      ],
      correct_option_index: 2,
      explanation: "Multi-armed bandits balance exploration and exploitation dynamically, routing traffic to winning variants during runtime.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In experimental data integrity, what is a 'Sample Ratio Mismatch' (SRM)?",
      options: [
        "A screen aspect ratio problem",
        "A statistically significant discrepancy between the expected traffic split (e.g. 50/50) and observed sample counts, indicating redirect errors or tracking telemetry bugs",
        "Running out of memory in a database",
        "A low video frame rate"
      ],
      correct_option_index: 1,
      explanation: "SRM checks if observed visitor ratios deviate significantly from the randomization design, flagging broken routing or filter biases.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "In statistical experimentation sizing, what happens to the required sample size (n) if a growth team reduces the Minimum Detectable Effect (MDE) from 10% to 5%?",
      options: [
        "Required sample size is cut in half",
        "Required sample size stays identical",
        "Required sample size drops to zero",
        "Required sample size quadruples (increases by 4x) because sample size scales inversely with the square of the MDE (1 / MDE^2)"
      ],
      correct_option_index: 3,
      explanation: "Because MDE is squared in the denominator of sample size formulas, halving the MDE requires 4 times as many sample observations.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Bayesian A/B testing for digital advertising, what does 'Expected Loss' represent?",
      options: [
        "The expected percentage drop in performance if Variant B is declared the winner and deployed, but is actually worse than Variant A",
        "The cost of running the analytics software",
        "Total ad spend wasted on bot clicks",
        "The percentage of employees who quit"
      ],
      correct_option_index: 0,
      explanation: "Expected Loss quantifies the potential downside risk of choosing a variation, establishing a clear risk threshold for shipping.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Sequential A/B Testing, what is the role of 'Alpha-Spending Functions' (such as O'Brien-Fleming or Pocock boundaries)?",
      options: [
        "They automatically increase daily budgets",
        "They delete ad variations that fail",
        "They adjust significance thresholds at intermediate data checkpoints, enabling continuous early monitoring while strictly maintaining total Type I error at alpha = 0.05",
        "They convert impressions into conversions"
      ],
      correct_option_index: 2,
      explanation: "Alpha-spending functions allocate cumulative false positive risk across interim looks, allowing valid early stopping.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "What behavioral testing artifact is characterized by an initial positive spike in conversion performance that gradually decays back to baseline over several weeks?",
      options: [
        "The Hawthorne Effect",
        "The Novelty Effect (existing customers clicking the new design simply because it is unfamiliar)",
        "The Placebo Effect",
        "The Matthew Effect"
      ],
      correct_option_index: 1,
      explanation: "The Novelty Effect causes temporary engagement lifts due to novelty alone, which fade as users habituate to the new interface.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In Meta advertising experiments, why are audience 'Holdout Experiments' essential to measure true Incremental ROAS (iROAS)?",
      options: [
        "They withhold ads from a randomized control group to establish baseline revenue, proving what proportion of conversions were genuinely caused by the ads versus organic baseline demand",
        "They double the frequency of ads to users",
        "They hide ads from competitors",
        "They lower the price of products on the website"
      ],
      correct_option_index: 0,
      explanation: "Holdouts establish an unexposed baseline, enabling exact mathematical calculation of causal, incremental revenue generated by advertising.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #73.");
  console.log("Skill #73 update completed successfully!");
}

run();
