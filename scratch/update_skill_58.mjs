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

const skillId = "c56fb8e8-9573-4980-bbe6-5048e8271228";

async function run() {
  console.log("Updating Skill #58: Model Evaluation & Tuning (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Cross-Validation Architectures, Leakage Prevention and Evaluation Metrics" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Hyperparameter Optimization, Bayesian Engines and Bias-Variance Dynamics" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Model Explainability, SHAP/LIME and Production Drift Monitoring" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Kaggle Grandmaster & ML Systems level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Cross-Validation Schemes and Data Leakage Prevention",
      order_index: 1,
      content: `### Validation Topology and Leakage Elimination

1. Cross-Validation Strategies:
   - k-Fold Cross-Validation: Partitions dataset into k equal folds, iteratively training on k-1 folds and validating on the remaining fold to produce unbiased generalization metrics.
   - Stratified k-Fold: Preserves identical class distribution percentages across every fold; mandatory for imbalanced classification tasks.
   - Group k-Fold: Ensures all records associated with a specific subject (e.g. patient ID, user ID, household) reside exclusively within either the training or test split, preventing identity leakage across folds.
   - TimeSeriesSplit / Purged Walk-Forward Validation: Enforces temporal causal order (training strictly on past data and validating on future windows) with embargo periods to prevent temporal lookahead contamination.

2. Data Leakage Prevention:
   - Preprocessing steps (StandardScaler, SimpleImputer, TargetEncoder) must be encapsulated within an end-to-end Pipeline fitted exclusively on training folds.`
    },
    {
      track_id: track1Id,
      title: "Classification Metrics: ROC-AUC, PR-AUC and Cost-Sensitive F-Beta",
      order_index: 2,
      content: `### Probabilistic Metrics, Imbalance and Cost-Sensitive Objectives

1. Confusion Matrix and Compound Metrics:
   - Precision: TP / (TP + FP) (measures positive prediction purity).
   - Recall (Sensitivity): TP / (TP + FN) (measures positive instance capture rate).
   - F_beta Score: Weighted harmonic mean: F_beta = (1 + beta^2) * (Precision * Recall) / (beta^2 * Precision + Recall).
     - beta = 2 (F2 Score): Weights Recall higher than Precision (critical in medical diagnosis and fraud detection).
     - beta = 0.5 (F0.5 Score): Weights Precision higher than Recall (critical in spam filtering).

2. Threshold-Independent Curves:
   - ROC-AUC: Plots True Positive Rate vs False Positive Rate across all classification thresholds; invariant to class prevalence.
   - Precision-Recall Curve (PR-AUC): Evaluates Precision vs Recall; essential for highly skewed, imbalanced datasets where ROC-AUC provides overly optimistic evaluations.

3. Probability Calibration:
   - Brier Score: (1/N) * sum (p_i - y_i)^2; calibrated via Platt Scaling or Isotonic Regression.`
    },
    {
      track_id: track1Id,
      title: "Regression Metrics, Residual Diagnostics and Loss Topologies",
      order_index: 3,
      content: `### Continuous Error Formulation and Residual Analysis

1. Regression Error Metrics:
   - Mean Absolute Error (MAE): (1/n) * sum |y_i - y_hat_i| (L1 linear penalty; highly robust to extreme outliers).
   - Mean Squared Error (MSE) and Root Mean Squared Error (RMSE): (1/n) * sum (y_i - y_hat_i)^2 (L2 quadratic penalty; heavily penalizes large catastrophic errors).
   - Coefficient of Determination (R^2): R^2 = 1 - (SS_res / SS_tot) (quantifies proportion of variance explained by model relative to mean baseline).
   - Mean Absolute Percentage Error (MAPE): (100/n) * sum |(y_i - y_hat_i) / y_i|.

2. Residual Diagnostics:
   - Residual vs Fitted Value Plots: Tests for homoscedasticity (constant variance) and non-linear patterns.
   - Quantile-Quantile (Q-Q) Plots: Compares residual distribution against theoretical normal distribution to detect heavy-tailed skew.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Search Strategies: Grid, Random and Bayesian Optimization",
      order_index: 1,
      content: `### Hyperparameter Search Mechanics and Sequential Optimization

1. Search Paradigms:
   - Grid Search: Exhaustive evaluation across all Cartesian combinations of discrete parameter values; suffers from the exponential curse of dimensionality O(k^d).
   - Random Search (Bergstra & Bengio, 2012): Samples parameter configurations randomly from continuous distributions; proves empirically superior to Grid Search by exploring vastly more distinct values of the most sensitive hyperparameters within identical compute budgets.

2. Sequential Model-Based Optimization (SMBO / Bayesian Optimization):
   - Constructs a probabilistic surrogate model (Gaussian Process or Tree-structured Parzen Estimator) approximating the objective function f(theta).
   - Acquisition Functions: Expected Improvement (EI) and Upper Confidence Bound (UCB) balance exploration (sampling high-uncertainty regions) against exploitation (sampling regions of predicted optimal performance).`
    },
    {
      track_id: track2Id,
      title: "Distributed Tuning Frameworks: Optuna, ASHA and Hyperband",
      order_index: 2,
      content: `### Asynchronous Pruning and Multi-Fidelity Optimization

1. Tree-structured Parzen Estimators (TPE in Optuna):
   - Uses Bayes rule to model p(x|y < y*) and p(x|y >= y*) using kernel density estimators, outperforming Gaussian Processes on high-dimensional, mixed categorical/continuous search spaces.

2. Multi-Fidelity Early Stopping (Hyperband):
   - Allocates small resource budgets (e.g. 1 epoch) to a massive population of candidate configurations.
   - Successive Halving: Iteratively eliminates the bottom fraction (e.g. bottom 50%) of underperforming trials and promotes top-performing trials to receive exponentially increasing resource budgets.

3. Asynchronous Successive Halving Algorithm (ASHA):
   - Eliminates synchronous barriers in distributed GPU clusters by promoting configurations asynchronously as soon as they reach target rungs, maximizing multi-node hardware utilization.`
    },
    {
      track_id: track2Id,
      title: "Bias-Variance Decomposition and Learning Curve Diagnostics",
      order_index: 3,
      content: `### Deconstructing Generalization Error and Diagnostic Curves

1. The Bias-Variance Decomposition:
   - For squared error loss: E[(y - f_hat(x))^2] = Bias[f_hat(x)]^2 + Var[f_hat(x)] + sigma^2 (where sigma^2 is irreducible noise).
   - Bias^2: Error originating from erroneous simplifying assumptions in the model algorithm (underfitting).
   - Variance: Error originating from sensitivity to small fluctuations in the training dataset (overfitting).

2. Diagnosing Learning Curves:
   - High Bias (Underfitting): Both training error and validation error converge to unacceptably high error rates. Solution: Increase model capacity, add engineered interaction features, or reduce regularization penalties.
   - High Variance (Overfitting): Training error is low while validation error remains substantially higher (large generalization gap). Solution: Gather more training data, apply L1/L2 regularization, increase dropout, or implement feature selection.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Global vs Local Interpretability: Feature Importance and Permutation",
      order_index: 1,
      content: `### Model-Agnostic and Tree-Based Feature Attribution

1. Mean Decrease in Impurity (MDI / Gini Importance):
   - Computes total weighted reduction in split criterion (Gini/MSE) brought by a feature across all trees in an ensemble.
   - Flaw: Heavily biased towards high-cardinality continuous features and correlated predictors.

2. Permutation Feature Importance:
   - Evaluates the drop in model validation metric after randomly shuffling the values of a single feature column while keeping all other columns constant.
   - Advantages: Truly model-agnostic, reflects real validation metric impact, and eliminates high-cardinality bias.

3. Partial Dependence Plots (PDP) and ICE Curves:
   - Partial Dependence: Shows the average marginal effect of one or two features on predicted target outcomes across the dataset.
   - Individual Conditional Expectation (ICE): Plots the feature effect curve for each individual instance separately, revealing heterogeneous interactions masked by average PDPs.`
    },
    {
      track_id: track3Id,
      title: "Game-Theoretic Explainability: SHAP and LIME",
      order_index: 2,
      content: `### Rigorous Cooperative Game Theory and Local Surrogates

1. Shapley Additive Explanations (SHAP - Lundberg & Lee, 2017):
   - Grounded in cooperative game theory (Lloyd Shapley, 1953).
   - Defines feature importance as the marginal contribution of a feature across all possible feature coalition subsets S:
     phi_i = sum_{S subseteq N \\ {i}} (|S|! * (|N| - |S| - 1)! / |N|!) * [v(S union {i}) - v(S)].
   - Axiomatic Guarantees: Efficiency (sum of SHAP values equals difference between prediction and expected value), Symmetry, Dummy (zero contribution yields zero value), and Additivity.
   - TreeSHAP: Exact polynomial-time O(T * L * D^2) algorithm computing Shapley values for tree ensembles.

2. Local Interpretable Model-agnostic Explanations (LIME):
   - Generates local perturbations around a specific prediction instance, weights perturbations by exponential kernel distance, and fits a sparse interpretable linear surrogate model.`
    },
    {
      track_id: track3Id,
      title: "Production Model Monitoring: Drift Detection and Calibration",
      order_index: 3,
      content: `### Distribution Shift, Drift Metrics and Monitoring Governance

1. Distribution Shift Taxonomies:
   - Covariate Shift: Input feature distribution P(X) changes over time while conditional label distribution P(Y|X) remains unchanged.
   - Concept Shift: Relationship between features and targets P(Y|X) changes (e.g. consumer macroeconomic spending patterns or emerging fraud strategies).
   - Prior Probability Shift: Target class prevalence P(Y) shifts.

2. Statistical Drift Metrics:
   - Population Stability Index (PSI): Compares production inference feature bin distributions against baseline training distributions:
     PSI = sum (Actual_% - Expected_%) * ln(Actual_% / Expected_%).
     PSI < 0.1 (negligible drift); 0.1 <= PSI <= 0.25 (moderate drift); PSI > 0.25 (significant drift requiring model retraining).
   - Kolmogorov-Smirnov (KS) Test: Two-sample non-parametric test evaluating maximum vertical divergence between cumulative distribution functions.

3. Adversarial Validation:
   - Trains a binary classifier to distinguish training records from production records; AUC > 0.7 signals severe distribution mismatch.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #58.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In machine learning cross-validation, what is the primary purpose of 'Stratified k-Fold' cross-validation?",
      options: [
        "To make models train 10 times faster",
        "To preserve the exact percentage of each target class across every single fold, preventing class distribution bias in imbalanced datasets",
        "To delete outlier data points",
        "To convert classification tasks into regression tasks"
      ],
      correct_option_index: 1,
      explanation: "Stratified k-fold guarantees that each validation split contains identical class proportions to the full dataset.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In classification evaluation, what does an F_beta score with beta = 2 (F2 Score) emphasize?",
      options: [
        "It only evaluates training speed",
        "It ignores all false negatives",
        "It weighs Precision twice as much as Recall",
        "It weighs Recall twice as much as Precision, prioritizing the capture of positive instances (e.g. in medical cancer screening or fraud detection)"
      ],
      correct_option_index: 3,
      explanation: "Setting beta = 2 places greater weight on Recall over Precision, suitable when missing a positive case has high cost.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "Why is Random Search empirically superior to Grid Search when tuning hyperparameter search spaces with many dimensions (Bergstra & Bengio, 2012)?",
      options: [
        "Random Search evaluates vastly more distinct values of the most sensitive hyperparameters for the same compute budget, avoiding redundant evaluations of uninformative parameters",
        "Random Search guarantees 100% test accuracy",
        "Random Search does not require a computer",
        "Random Search only tests integer parameters"
      ],
      correct_option_index: 0,
      explanation: "Random search explores distinct values along each dimension rather than testing redundant grid coordinates, efficiently identifying optimal parameter values.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What regression metric represents the proportion of target variance explained by the model relative to a simple horizontal mean baseline?",
      options: [
        "Mean Absolute Error (MAE)",
        "Root Mean Squared Error (RMSE)",
        "Coefficient of Determination (R^2 Score)",
        "F1 Score"
      ],
      correct_option_index: 2,
      explanation: "R^2 measures the percentage of total variance explained by regression predictions (1 - SS_res/SS_tot).",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In machine learning explainability, what is the primary advantage of 'Permutation Feature Importance' over tree-based Mean Decrease in Impurity (MDI / Gini Importance)?",
      options: [
        "Permutation importance only works on linear regression",
        "Permutation importance is model-agnostic, reflects true validation metric drops, and is completely free of bias towards high-cardinality continuous features",
        "Permutation importance makes models run faster",
        "Permutation importance changes the model weights permanently"
      ],
      correct_option_index: 1,
      explanation: "Permutation feature importance shuffles test columns to measure true validation metric impact without high-cardinality bias.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In cross-validation design, why must 'Group k-Fold' be used when training models on multi-record entity data (such as multiple diagnostic readings from the same patient)?",
      options: [
        "To group all numbers into even and odd categories",
        "Because standard k-fold cannot run on medical data",
        "To ensure all records from a given patient ID reside strictly within either the train or validation set, preventing identity leakage across splits",
        "To delete 50% of the patient records"
      ],
      correct_option_index: 2,
      explanation: "Group k-fold prevents subject-level identity leakage by ensuring all observations from a specific entity stay in one split.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "Why is the Precision-Recall Area Under Curve (PR-AUC) preferred over ROC-AUC when evaluating models on severely imbalanced datasets (e.g. 1 positive per 10,000 negatives)?",
      options: [
        "Because ROC-AUC False Positive Rate is diluted by the vast number of True Negatives, presenting an artificially optimistic score, whereas PR-AUC focuses strictly on positive class performance",
        "Because PR-AUC is faster to compute",
        "Because ROC-AUC cannot be plotted as a graph",
        "Because PR-AUC only works on neural networks"
      ],
      correct_option_index: 0,
      explanation: "In severe class skew, large true negative pools suppress FPR in ROC-AUC; PR-AUC evaluates precision against recall directly.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In distributed hyperparameter optimization, how does the 'Hyperband' algorithm improve search efficiency?",
      options: [
        "By testing only 1 configuration at a time",
        "By training all models for 1,000 epochs",
        "By guessing parameters randomly",
        "It uses Successive Halving to evaluate many configurations on minimal initial resources (e.g. 1 epoch), early-stopping poor performers and promoting top performers to receive exponentially increasing compute"
      ],
      correct_option_index: 3,
      explanation: "Hyperband allocates small initial resource budgets across many configurations, progressively pruning underperformers via successive halving.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In the Bias-Variance trade-off, what learning curve symptoms diagnose a model suffering from 'High Variance' (Overfitting)?",
      options: [
        "Training error and validation error are both very high",
        "Training error is very low while validation error is substantially higher, revealing a wide generalization gap",
        "Training error is zero and validation error is zero",
        "The model produces no output"
      ],
      correct_option_index: 1,
      explanation: "High variance manifests as low training error combined with high validation error, demonstrating poor generalization to unseen data.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In production machine learning monitoring, what does a Population Stability Index (PSI) score greater than 0.25 indicate?",
      options: [
        "The model is 100% accurate",
        "The computer CPU is overheating",
        "A significant distribution shift in input feature distributions compared to the training baseline, indicating the model needs retraining",
        "The database is completely empty"
      ],
      correct_option_index: 2,
      explanation: "A PSI > 0.25 indicates substantial population shift between baseline training data and production inference distributions.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In game-theoretic model explainability, what mathematical axioms uniquely guarantee that SHAP (Shapley Additive Explanations) values provide fair feature attribution?",
      options: [
        "Efficiency (local accuracy), Symmetry, Dummy (Null player), and Additivity",
        "Associativity, Commutativity, and Distributivity",
        "Reflection, Refraction, and Diffraction",
        "Convergence, Differentiability, and Homoscedasticity"
      ],
      correct_option_index: 0,
      explanation: "Shapley values are the unique attribution method mathematically proven to satisfy Efficiency, Symmetry, Dummy, and Additivity.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In time-series machine learning, why must standard k-Fold Cross-Validation NEVER be applied to financial or forecasting data?",
      options: [
        "Because time-series data has no numbers",
        "Because financial markets do not use computers",
        "Because k-Fold only works on images",
        "It shuffles observations randomly across time, allowing future information to train models predicting past events (temporal lookahead bias and causal leakage)"
      ],
      correct_option_index: 3,
      explanation: "Random k-fold shuffles future data into training splits, violating temporal causality and creating invalid forward-looking leakage.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "What is 'Adversarial Validation' in competitive ML and production deployment pipelines?",
      options: [
        "Attacking a web server with DDoS packets",
        "Training a binary classifier to distinguish training set observations from test (or production) observations; an AUC > 0.7 reveals severe distribution mismatch between train and inference domains",
        "Deleting all models with errors",
        "Manually guessing which features to drop"
      ],
      correct_option_index: 1,
      explanation: "Adversarial validation builds a classifier to differentiate train vs test data, detecting covariate shift and dataset drift.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "How does TreeSHAP achieve polynomial time complexity O(T * L * D^2) for tree ensembles compared to the exponential O(T * L * 2^M) cost of exact Shapley computation?",
      options: [
        "By deleting all decision trees except 1",
        "By replacing trees with linear models",
        "By recursively tracking the proportion of training instances flowing down all decision paths simultaneously in a single tree traversal",
        "By rounding all feature values to zero"
      ],
      correct_option_index: 2,
      explanation: "TreeSHAP exploits tree graph structure to compute expected values across all feature coalitions in polynomial time during tree traversal.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In statistical classification calibration, what does the Brier Score evaluate for probabilistic model outputs?",
      options: [
        "The mean squared difference between predicted probabilities p_i and actual binary class outcomes y_i (Brier = (1/N) * sum (p_i - y_i)^2), measuring probability calibration accuracy",
        "The number of trees in an ensemble",
        "The execution speed of the model in milliseconds",
        "The total number of parameters in a neural network"
      ],
      correct_option_index: 0,
      explanation: "The Brier score measures the mean squared error of probabilistic predictions against binary ground truth labels.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #58.");
  console.log("Skill #58 update completed successfully!");
}

run();
