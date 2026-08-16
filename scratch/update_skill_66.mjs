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

const skillId = "576fbb55-cb05-4668-b5fb-ebab2779a593";

async function run() {
  console.log("Updating Skill #66: Statistics Fundamentals (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Descriptive Statistics, Moments and Probability Distributions" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Sampling Theory, Central Limit Theorem and Confidence Intervals" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Hypothesis Testing, Inferential Tests and Categorical Analysis" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Quantitative Analyst & Statistics level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Measures of Central Tendency, Dispersion and Higher Moments",
      order_index: 1,
      content: `### Statistical Summaries, Variance and Moment Decompositions

1. Measures of Location and Spread:
   - Central Tendency: Sample Mean (x_bar = (1/n) * sum x_i; sensitive to outliers) vs Sample Median (50th percentile; robust location estimator).
   - Sample Variance: s^2 = (1 / (n - 1)) * sum (x_i - x_bar)^2 (Bessel's correction n-1 eliminates sample variance estimation bias).
   - Interquartile Range (IQR): IQR = Q3 - Q1; defines Tukey outlier boundaries [Q1 - 1.5*IQR, Q3 + 1.5*IQR].

2. Higher Statistical Moments:
   - Third Moment (Skewness gamma_1): Measures distributional asymmetry. Positive skew: Mean > Median (right tail). Negative skew: Mean < Median (left tail).
   - Fourth Moment (Kurtosis beta_2): Measures tail thickness. Mesokurtic (Normal = 3), Leptokurtic (>3, fat-tailed with extreme outlier probability), and Platykurtic (<3).`
    },
    {
      track_id: track1Id,
      title: "Discrete and Continuous Probability Distributions",
      order_index: 2,
      content: `### Parametric Probability Density and Mass Functions

1. Discrete Distributions:
   - Binomial Distribution: P(X = k) = (n choose k) * p^k * (1 - p)^(n - k) (models k successes in n independent Bernoulli trials with probability p).
   - Poisson Distribution: P(X = k) = (lambda^k * e^(-lambda)) / k! (models occurrence frequency of rare independent events within a fixed temporal or spatial interval).

2. Continuous Distributions:
   - Gaussian (Normal) Distribution: Symmetrical bell curve parameterized by mean mu and variance sigma^2; satisfies empirical 68%-95%-99.7% rule across standard deviations.
   - Student's t-Distribution: Symmetrical bell curve parameterized by degrees of freedom nu; exhibits heavier tails than Normal, converging to Gaussian as nu approaches infinity.
   - Exponential Distribution: f(x) = lambda * e^(-lambda * x) (memoryless model for waiting times between Poisson events).`
    },
    {
      track_id: track1Id,
      title: "Joint, Conditional and Marginal Probability (Bayes' Theorem)",
      order_index: 3,
      content: `### Axiomatic Probability and Bayesian Belief Updating

1. Fundamental Probability Axioms (Kolmogorov):
   - Non-negativity P(E) >= 0; Total probability P(Sample Space) = 1; Additivity for mutually exclusive events.
   - Conditional Probability: P(A|B) = P(A intersect B) / P(B) (where P(B) > 0).
   - Statistical Independence: Events A and B are independent if and only if P(A intersect B) = P(A) * P(B).

2. Bayes' Theorem:
   - P(A|B) = (P(B|A) * P(A)) / P(B)
   - Updating prior belief P(A) using likelihood P(B|A) and evidence P(B) to compute the updated posterior probability P(A|B).
   - Base Rate Fallacy: Ignoring prior baseline rates P(A) when interpreting diagnostic test results with high sensitivity.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The Central Limit Theorem and Standard Error of the Mean",
      order_index: 1,
      content: `### Asymptotic Normality and Sampling Distributions

1. The Central Limit Theorem (CLT):
   - Given independent, identically distributed (i.i.d.) random variables drawn from ANY population with mean mu and finite variance sigma^2, the sample mean distribution approaches a Normal distribution as sample size n increases:
     X_bar ~ Normal(mu, sigma^2 / n) (typically valid for n >= 30).

2. Standard Error of the Mean (SE):
   - SE = sigma / sqrt(n) (or s / sqrt(n) when population standard deviation is unknown).
   - Quantifies the statistical dispersion of sample means across repeated sampling experiments.

3. The Law of Large Numbers (LLN):
   - Weak and Strong LLN guarantee that as sample size n grows toward infinity, the sample mean X_bar converges directly to the true population expectation mu.`
    },
    {
      track_id: track2Id,
      title: "Confidence Intervals, Margin of Error and Sample Size",
      order_index: 2,
      content: `### Point Estimation, Interval Precision and Power Sizing

1. Confidence Interval Construction:
   - For known population variance: CI = x_bar +/- z_crit * (sigma / sqrt(n)) (e.g. z_crit = 1.96 for 95% confidence).
   - For unknown population variance: CI = x_bar +/- t_crit * (s / sqrt(n)) using Student's t distribution with nu = n - 1 degrees of freedom.
   - Interpretation: If 100 random samples are drawn, exactly 95 of the computed confidence intervals will contain the true population parameter.

2. Margin of Error (MoE) and Sample Sizing:
   - MoE = z_crit * (sigma / sqrt(n)).
   - Required Sample Size: n = (z_crit * sigma / MoE)^2.

3. Non-Parametric Bootstrap Resampling:
   - Generates 10,000 empirical sample replicates by drawing with replacement from observed data, computing percentile-based confidence intervals without requiring distributional normality assumptions.`
    },
    {
      track_id: track2Id,
      title: "Hypothesis Testing Framework: Errors, Alpha, Beta and Power",
      order_index: 3,
      content: `### Decision Theory Under Uncertainty and Statistical Power

1. Null (H0) and Alternative (H1) Hypotheses:
   - H0: Status quo (no effect, zero difference). H1: Claimed effect or difference.

2. Statistical Decision Errors:
   - Type I Error (alpha / Significance Level): Rejecting a true Null Hypothesis (False Positive; standard alpha = 0.05).
   - Type II Error (beta): Failing to reject a false Null Hypothesis (False Negative).
   - Statistical Power (1 - beta): Probability of correctly rejecting a false Null Hypothesis when an actual effect exists (standard power target = 0.80 or 0.90).

3. The p-value:
   - Probability of obtaining a test statistic as extreme as, or more extreme than, the observed value, assuming the Null Hypothesis H0 is true. If p < alpha, reject H0.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Parametric Inference: Z-Tests, Student's T-Tests and Welch's T-Test",
      order_index: 1,
      content: `### Mean Comparison Tests and Variance Heterogeneity

1. One-Sample and Two-Sample Z-Tests:
   - Used when population variance sigma is known and sample size n is large:
     z = (x_bar - mu0) / (sigma / sqrt(n)).

2. Student's Two-Sample T-Test (Pooled Variance):
   - Assumes both populations are normally distributed with equal variances (homoscedasticity).

3. Welch's Two-Sample T-Test (Unequal Variances):
   - Modern recommended default; does not assume equal variances.
   - Computes degrees of freedom via the Welch-Satterthwaite equation:
     t = (x_bar_1 - x_bar_2) / sqrt(s1^2 / n1 + s2^2 / n2).

4. Paired T-Test:
   - Evaluates mean difference d_i = x_1i - x_2i for dependent, matched subjects (e.g. pre-treatment vs post-treatment measurements on identical users).`
    },
    {
      track_id: track3Id,
      title: "Multi-Group Comparison: One-Way ANOVA and Tukey HSD",
      order_index: 2,
      content: `### Multi-Mean Variance Decomposition and Post-Hoc Corrections

1. One-Way Analysis of Variance (ANOVA):
   - Compares means across k >= 3 independent groups simultaneously.
   - Decomposes Total Sum of Squares: SS_total = SS_between + SS_within.
   - F-Statistic: F = MS_between / MS_within = (SS_between / (k - 1)) / (SS_within / (N - k)).
   - Significant F-test (p < alpha) indicates at least one group mean differs significantly from the others.

2. Family-Wise Error Rate (FWER) and Multiple Testing:
   - Performing multiple pairwise t-tests causes error inflation: FWER = 1 - (1 - alpha)^m.
   - Post-Hoc Tests: Tukey's Honestly Significant Difference (HSD) and Bonferroni adjustment (alpha / m) control overall Type I error rates across all pairwise comparisons.`
    },
    {
      track_id: track3Id,
      title: "Categorical Tests, Correlation Metrics and Simpson's Paradox",
      order_index: 3,
      content: `### Categorical Association, Monotonicity and Confounding

1. Chi-Square (chi^2) Test of Independence:
   - Evaluates statistical association between two categorical variables in an r x c contingency table:
     chi^2 = sum ((O_ij - E_ij)^2 / E_ij) with degrees of freedom (r - 1) * (c - 1).
   - Expected frequency: E_ij = (Row_Total_i * Col_Total_j) / Grand_Total.

2. Linear vs Non-Linear Association:
   - Pearson Correlation (r in [-1, 1]): Quantifies linear relationship between continuous variables; sensitive to outliers.
   - Spearman Rank Correlation (rho in [-1, 1]): Quantifies monotonic relationships by ranking values before computing Pearson r; robust to non-linear monotonicity and outliers.

3. Simpson's Paradox:
   - Occurs when a trend appears in multiple individual sub-groups but completely reverses or disappears when aggregated, caused by a confounding lurking variable.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #66.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "According to the Central Limit Theorem (CLT), what happens to the sampling distribution of the sample mean as sample size n increases (n >= 30)?",
      options: [
        "It becomes completely flat and uniform",
        "It approaches a Normal (Gaussian) distribution centered at population mean mu with variance sigma^2 / n, regardless of the underlying population distribution shape",
        "It turns into a Poisson distribution",
        "It equals zero"
      ],
      correct_option_index: 1,
      explanation: "The Central Limit Theorem guarantees that the distribution of sample means approaches normality as n increases, regardless of population shape.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In statistical summary metrics, why is Bessel's correction (dividing by n - 1 rather than n) applied when calculating Sample Variance s^2?",
      options: [
        "To make calculation faster",
        "To convert variance into a percentage",
        "Because sample size n is always even",
        "To correct for negative bias, producing an unbiased estimator of the true population variance sigma^2"
      ],
      correct_option_index: 3,
      explanation: "Dividing by n-1 compensates for using the sample mean rather than the true population mean, eliminating underestimation bias.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In hypothesis testing, what is a 'Type I Error' (alpha)?",
      options: [
        "Rejecting a true Null Hypothesis H0 (a False Positive)",
        "Failing to reject a false Null Hypothesis (a False Negative)",
        "Calculating a sum incorrectly",
        "Having too small of a dataset"
      ],
      correct_option_index: 0,
      explanation: "A Type I error occurs when a test rejects the null hypothesis when in reality the null hypothesis is true (false positive).",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What continuous probability distribution is memoryless and commonly used to model the waiting time between consecutive Poisson process events?",
      options: [
        "Binomial Distribution",
        "Uniform Distribution",
        "Exponential Distribution",
        "Chi-Square Distribution"
      ],
      correct_option_index: 2,
      explanation: "The Exponential distribution is the continuous memoryless distribution that models time elapsed between independent Poisson arrivals.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In statistical hypothesis testing, what does a p-value evaluate?",
      options: [
        "The probability that the alternate hypothesis is false",
        "The probability of observing a test statistic as extreme as, or more extreme than, the observed data, assuming the Null Hypothesis H0 is true",
        "The sample size of the experiment",
        "The probability of computer hardware failure"
      ],
      correct_option_index: 1,
      explanation: "The p-value measures the probability of obtaining results at least as extreme as observed, under the assumption that the null hypothesis is true.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "When comparing two independent sample means, why is 'Welch's t-test' preferred over the traditional Student's two-sample t-test in modern practice?",
      options: [
        "Welch's t-test only works on integers",
        "Welch's t-test requires zero calculations",
        "Welch's t-test does not assume equal population variances (homoscedasticity), adjusting degrees of freedom via the Welch-Satterthwaite equation to prevent Type I error inflation",
        "Student's t-test is no longer allowed"
      ],
      correct_option_index: 2,
      explanation: "Welch's t-test robustly handles unequal sample variances, protecting against Type I error rate inflation.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In multi-group comparison, why is One-Way ANOVA used to test k >= 3 group means simultaneously rather than running multiple pairwise t-tests?",
      options: [
        "Running multiple pairwise t-tests inflates the Family-Wise Error Rate (FWER = 1 - (1 - alpha)^m), causing a dramatic rise in false positive Type I errors",
        "Pairwise t-tests cannot be run on computers",
        "ANOVA eliminates the need for data collection",
        "ANOVA guarantees that all group means are identical"
      ],
      correct_option_index: 0,
      explanation: "Running multiple pairwise tests compounds the risk of false positives; ANOVA tests all means simultaneously at a controlled alpha level.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What is 'Simpson's Paradox' in statistical data analysis?",
      options: [
        "A paradox where averages equal medians",
        "A rule stating that sample size must be infinite",
        "An error caused by division by zero",
        "A phenomenon where a statistical trend or association appears in multiple distinct sub-groups, but reverses or disappears when the groups are aggregated, caused by an unobserved confounding variable"
      ],
      correct_option_index: 3,
      explanation: "Simpson's paradox occurs when an apparent trend across sub-groups disappears or reverses upon aggregation due to confounding variables.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In categorical data analysis, what test evaluates whether two nominal categorical variables are statistically independent in a contingency table?",
      options: [
        "Student's t-test",
        "Chi-Square (chi^2) Test of Independence",
        "Linear Regression",
        "Z-score calculation"
      ],
      correct_option_index: 1,
      explanation: "The Chi-Square Test of Independence tests for significant associations between categorical variables in an r x c contingency table.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What is the difference between Pearson correlation coefficient (r) and Spearman rank correlation (rho)?",
      options: [
        "Pearson is for text; Spearman is for numbers",
        "Spearman correlation cannot be negative",
        "Pearson quantifies linear relationships and is sensitive to outliers; Spearman quantifies monotonic relationships by ranking values first, making it robust to non-linear monotonicity and outliers",
        "There is zero mathematical difference"
      ],
      correct_option_index: 2,
      explanation: "Pearson evaluates linear relationships; Spearman evaluates monotonic relationships on ranked data, robust to non-linearities and outliers.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In probability theory and Bayesian updating, what is the 'Base Rate Fallacy'?",
      options: [
        "Ignoring the low prior baseline probability P(A) of a rare condition when interpreting diagnostic test results, leading to gross overestimation of the posterior probability P(A|Positive)",
        "Dividing by zero in a calculation",
        "Failing to compute a standard deviation",
        "Assuming all numbers are positive"
      ],
      correct_option_index: 0,
      explanation: "The base rate fallacy occurs when prior odds P(A) are neglected, creating erroneous overconfidence in positive test likelihoods for rare events.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In statistical distribution analysis, what does a 'Leptokurtic' distribution (Excess Kurtosis > 0) signify for financial risk modeling?",
      options: [
        "The distribution has zero variance",
        "The distribution has no mean",
        "All values are strictly positive",
        "The distribution possesses 'fat tails' and a sharper peak compared to a Normal distribution, indicating substantially higher probability of extreme catastrophic outlier events"
      ],
      correct_option_index: 3,
      explanation: "Leptokurtic distributions exhibit heavy tails and sharp peaks, reflecting elevated probabilities of extreme tail outlier events.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In inferential statistics, how does 'Non-Parametric Bootstrap Resampling' construct a 95% confidence interval for a metric (such as a median or trimmed mean)?",
      options: [
        "By guessing parameter values randomly",
        "By repeatedly sampling the observed data with replacement B = 10,000 times, computing the metric on each replicate, and taking the 2.5th and 97.5th percentiles of the bootstrap distribution",
        "By converting all data into normal distributions",
        "By multiplying standard deviation by 1.96"
      ],
      correct_option_index: 1,
      explanation: "Bootstrap resampling draws repeated samples with replacement, deriving empirical confidence bounds directly from empirical percentiles.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In post-hoc ANOVA testing, what is the purpose of 'Tukey's Honestly Significant Difference' (HSD) test?",
      options: [
        "To delete outlier data points",
        "To convert groups into numbers",
        "It tests all pairwise group mean differences while strictly controlling the Family-Wise Error Rate (FWER) at nominal alpha using the studentized range distribution",
        "To prove the null hypothesis is true"
      ],
      correct_option_index: 2,
      explanation: "Tukey's HSD calculates studentized range critical values to compare all pairwise group differences without inflating family-wise error.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In experiment design, what mathematical formula determines the required sample size n per variation to detect a Minimum Detectable Effect (MDE) with significance alpha and power 1 - beta?",
      options: [
        "n = 2 * (z_(alpha/2) + z_beta)^2 * (sigma^2 / MDE^2)",
        "n = alpha * beta * 100",
        "n = MDE / 2",
        "n = sigma * 1.96"
      ],
      correct_option_index: 0,
      explanation: "Sample size scaling is proportional to (z_alpha/2 + z_beta)^2 * sigma^2 / MDE^2, growing quadratically as detectable effect MDE shrinks.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #66.");
  console.log("Skill #66 update completed successfully!");
}

run();
