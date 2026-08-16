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

const skillId = "62e71755-66b4-41e3-84ea-d01b234a9e28";

async function run() {
  console.log("Updating Skill #56: Supervised & Unsupervised Learning (9 steps across 3 tracks)...");

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

  // If there are extra tracks (e.g. 4), delete extra
  if (tracks.length > 3) {
    const extraTrackIds = tracks.slice(3).map((t) => t.id);
    await supabase.from("steps").delete().in("track_id", extraTrackIds);
    await supabase.from("tracks").delete().in("id", extraTrackIds);
    tracks = tracks.slice(0, 3);
  }

  const track1Id = tracks[0].id;
  const track2Id = tracks[1].id;
  const track3Id = tracks[2].id;

  // Update Track titles
  await supabase.from("tracks").update({ title: "Track 1: Linear Models, Regularization, GLMs and Support Vector Machines" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Tree Ensembles, Random Forests, XGBoost and Gradient Boosting" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Clustering Geometries, Manifold Learning (UMAP) and Anomaly Detection" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Stanford CS229 level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Ordinary Least Squares, Regularization (Ridge, Lasso, Elastic Net)",
      order_index: 1,
      content: `### Linear Regression Formulations and Regularization Penalties

1. Ordinary Least Squares (OLS) and the Gauss-Markov Theorem:
   - OLS minimizes residual sum of squares: min ||y - X beta||_2^2.
   - The Gauss-Markov theorem proves OLS is the Best Linear Unbiased Estimator (BLUE) under spherical homoscedastic errors.

2. Regularization Formulations:
   - Ridge Regression (L2 penalty lambda ||beta||_2^2): Analytical solution beta_ridge = (X^T X + lambda I)^(-1) X^T y. Shrinks coefficients smoothly, stabilizing collinear features.
   - Lasso Regression (L1 penalty lambda ||beta||_1): Solved via coordinate descent. The diamond constraint geometry sets non-informative coefficients exactly to zero, performing automated feature selection.
   - Elastic Net: Combines L1 and L2 penalties (r * lambda ||beta||_1 + ((1-r)/2) * lambda ||beta||_2^2) to handle groups of strongly correlated predictors.`
    },
    {
      track_id: track1Id,
      title: "Logistic Regression, Maximum Likelihood and Generalized Linear Models",
      order_index: 2,
      content: `### Probabilistic Classification and Binary Cross-Entropy

1. The Logit Link Function:
   - Models the log-odds of positive class: log(p / (1-p)) = beta^T x.
   - Sigmoid Transformation: p(y=1|x) = sigma(beta^T x) = 1 / (1 + e^(-beta^T x)).

2. Maximum Likelihood Estimation (MLE):
   - Parameters are estimated by maximizing the likelihood of Bernoulli trials, equivalent to minimizing Negative Log-Likelihood (Binary Cross-Entropy Loss):
     L = -sum [y_i * log(p_hat_i) + (1 - y_i) * log(1 - p_hat_i)].
   - Solved via numerical optimization: Newton-Raphson / Iteratively Reweighted Least Squares (IRLS) or gradient descent.

3. Multiclass Generalization:
   - Softmax Regression (Multinomial Logistic Regression): Generalizes the sigmoid function to K mutually exclusive classes using the normalized exponential softmax function.`
    },
    {
      track_id: track1Id,
      title: "Support Vector Machines and Non-Linear Kernel Dynamics",
      order_index: 3,
      content: `### Margin Maximization, Dual Formulations and Mercer's Theorem

1. Support Vector Machine (SVM) Optimization:
   - Hard Margin: Finds hyperplane w^T x + b = 0 maximizing geometric margin 2 / ||w|| subject to y_i (w^T x_i + b) >= 1.
   - Soft Margin: Introduces slack variables xi_i and regularization parameter C (balancing margin width against margin violations).

2. Dual Formulation and Support Vectors:
   - Transformed into a convex quadratic programming dual problem maximizing over Lagrange multipliers alpha_i.
   - Only data points lying on or violating the margin boundary possess alpha_i > 0 (Support Vectors).

3. The Kernel Trick (Mercer's Theorem):
   - Projects inputs into infinite-dimensional Hilbert feature spaces via inner product kernel evaluations K(x, x') = <phi(x), phi(x')> without explicitly calculating coordinates.
   - Radial Basis Function (RBF / Gaussian) Kernel: K(x, x') = exp(-gamma * ||x - x'||^2).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Decision Trees: CART, Splitting Criteria and Pruning",
      order_index: 1,
      content: `### Recursive Binary Partitioning and Tree Pruning

1. Splitting Criteria for Classification and Regression Trees (CART):
   - Gini Impurity: I_G = 1 - sum_{k=1}^K p_k^2 (measures classification homogeneity; reaches 0 for pure nodes).
   - Shannon Entropy: H = -sum_{k=1}^K p_k * log_2(p_k) (information gain = parent entropy minus weighted child entropy).
   - Mean Squared Error (MSE) reduction for continuous regression targets.

2. Regularization and Pruning:
   - Unconstrained trees grow until all leaves are pure, severely overfitting training data.
   - Pre-Pruning: Setting stopping hyper-parameters (max_depth, min_samples_split, min_samples_leaf).
   - Minimal Cost-Complexity Pruning: Prunes subtrees by minimizing cost function R_alpha(T) = R(T) + alpha * |T|, where |T| is leaf count and alpha is complexity penalty.`
    },
    {
      track_id: track2Id,
      title: "Bagging and Random Forests: Variance Reduction Mechanics",
      order_index: 2,
      content: `### Bootstrap Aggregation, Out-of-Bag Validation and Decorrelation

1. Bootstrap Aggregation (Bagging):
   - Trains B base estimators on bootstrap samples (sampling N observations with replacement from training dataset of size N).
   - Each bootstrap sample contains approximately 63.2% unique instances; the remaining 36.8% form the Out-of-Bag (OOB) sample used for unbiased generalization error estimation.

2. Random Forests (Breiman, 2001):
   - Ensembles decorrelated decision trees: At each candidate split node, algorithm restricts search to a random subset of m features (typically m = sqrt(p) for classification; m = p/3 for regression).
   - Variance Reduction Mathematics: Ensembling B trees reduces ensemble variance Var(mean_X) = rho * sigma^2 + ((1 - rho) / B) * sigma^2, where feature subsampling reduces inter-tree correlation rho.`
    },
    {
      track_id: track2Id,
      title: "Gradient Boosting Architectures: XGBoost, LightGBM and CatBoost",
      order_index: 3,
      content: `### Sequential Residual Optimization and Second-Order Tree Boosting

1. Gradient Boosting Machine (GBM):
   - Trains sequential weak decision trees iteratively fitting the pseudo-residuals (negative gradient of differentiable loss function) of the previous ensemble.

2. XGBoost (Chen & Guestrin, 2016):
   - Employs second-order Taylor expansion of the loss function using first gradients g_i and second Hessians h_i.
   - Optimal Leaf Weight: w_j* = -(sum g_i) / (sum h_i + lambda).
   - Structure Score Gain: Evaluates tree split candidates while penalizing leaf count with regularization gamma * T.

3. LightGBM (Ke et al., 2017):
   - Gradient-based One-Side Sampling (GOSS) retaining instances with large gradients, Exclusive Feature Bundling (EFB), and leaf-wise (best-first) tree growth.

4. CatBoost:
   - Ordered target statistics and symmetric oblivious decision trees preventing target leakage on categorical features.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Clustering Geometries: K-Means, GMM and DBSCAN",
      order_index: 1,
      content: `### Unsupervised Cluster Topology, Voronoi Cells and Density

1. K-Means Clustering:
   - Iteratively partitions observations into k Voronoi cells minimizing within-cluster inertia (sum of squared Euclidean distances).
   - K-Means++ Seeding: Initializes cluster centers with probability proportional to squared distance D(x)^2 from nearest existing center, guaranteeing O(log k) competitive optimality over random seeding.

2. Gaussian Mixture Models (GMM):
   - Soft probabilistic clustering modeling data as a mixture of k Gaussian distributions.
   - Expectation-Maximization (EM) Algorithm: E-step calculates posterior responsibilities gamma_ik; M-step updates mixture weights, means mu_k, and covariance matrices Sigma_k.

3. DBSCAN (Density-Based Spatial Clustering):
   - Identifies clusters of arbitrary non-convex geometric shapes based on density reachability: Core points (>= min_samples within epsilon radius), Border points, and Noise points (outliers).`
    },
    {
      track_id: track3Id,
      title: "Non-Linear Dimensionality Reduction: t-SNE and UMAP",
      order_index: 2,
      content: `### Manifold Learning and High-Dimensional Topology Preservation

1. t-Distributed Stochastic Neighbor Embedding (t-SNE):
   - Converts high-dimensional Euclidean distances into Gaussian probabilities p_ij.
   - Models low-dimensional map similarities q_ij using a Student-t distribution with 1 degree of freedom (Cauchy distribution).
   - Heavy-Tail Resolution: The heavy tails of the Student-t distribution resolve the 'crowding problem', allowing moderate high-dimensional distances to map to larger low-dimensional distances.
   - Minimized via gradient descent on the Kullback-Leibler (KL) divergence KL(P || Q).

2. Uniform Manifold Approximation and Projection (UMAP):
   - Grounded in Riemannian geometry and algebraic topology (fuzzy simplicial sets).
   - Preserves both local and global data manifold structure while providing superior computational scaling over t-SNE.`
    },
    {
      track_id: track3Id,
      title: "Anomaly Detection: Isolation Forests and One-Class Methods",
      order_index: 3,
      content: `### Outlier Identification and Unsupervised Anomaly Isolation

1. Isolation Forest (iForest):
   - Isolates anomalies instead of profiling normal data points.
   - Constructs an ensemble of Isolation Trees (iTrees) by randomly selecting a feature and randomly selecting a split value between feature min and max.
   - Anomaly Mathematics: Anomalies require significantly fewer random splits to isolate, resulting in substantially shorter average tree path lengths h(x). The anomaly score s(x, n) scales inversely with expected path length.

2. Local Outlier Factor (LOF):
   - Measures local density deviation of an object with respect to its k-nearest neighbors; points with substantially lower density than their neighbors are flagged as outliers.

3. One-Class Support Vector Machines (One-Class SVM):
   - Fits a maximum margin hyperplane in kernel space separating the training data envelope from the coordinate origin.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #56.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In linear regression regularization, what distinguishing mathematical property does Lasso (L1 regularization) have compared to Ridge (L2)?",
      options: [
        "Lasso increases model complexity",
        "Lasso only works on neural networks",
        "Lasso drives non-essential feature coefficients exactly to zero, performing automated feature selection",
        "Lasso divides all weights by 2"
      ],
      correct_option_index: 2,
      explanation: "L1 regularization forces non-essential feature weights to exactly zero, enabling automated feature selection and sparse models.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In Support Vector Machines (SVM), what are 'Support Vectors'?",
      options: [
        "The critical data points that lie exactly on or violate the margin boundaries and solely determine the position and orientation of the decision boundary",
        "The customer service team supporting the model",
        "The average of all training data points",
        "The software libraries used to code SVMs"
      ],
      correct_option_index: 0,
      explanation: "Support vectors are the subset of training instances with non-zero Lagrange multipliers that define the maximum margin hyperplane.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What splitting criterion in Decision Tree classification measures node impurity such that a completely pure node containing only one class equals zero?",
      options: [
        "Root Mean Squared Error (RMSE)",
        "Learning Rate",
        "F1 Score",
        "Gini Impurity (or Shannon Entropy)"
      ],
      correct_option_index: 3,
      explanation: "Gini Impurity and Shannon Entropy reach zero when a node is 100% pure (all samples belong to a single class).",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In Random Forest ensemble algorithms, how does feature subsampling at each split node (selecting m = sqrt(p) random features) improve generalization performance?",
      options: [
        "By making all trees identical",
        "It decorrelates the individual decision trees, reducing ensemble variance without increasing bias",
        "By deleting half of the dataset",
        "By converting the model to linear regression"
      ],
      correct_option_index: 1,
      explanation: "Subsampling candidate split features decorrelates the individual trees in the forest, lowering ensemble variance.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In unsupervised clustering, what clustering algorithm identifies clusters of arbitrary non-spherical shapes based on density reachability and labels sparse points as noise?",
      options: [
        "K-Means",
        "Linear Discriminant Analysis",
        "DBSCAN (Density-Based Spatial Clustering of Applications with Noise)",
        "Logistic Regression"
      ],
      correct_option_index: 2,
      explanation: "DBSCAN discovers clusters of arbitrary geometric shape by expanding connected dense regions and labeling sparse points as noise.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "Why does the 'K-Means++' initialization algorithm produce superior clustering results compared to standard random centroid initialization?",
      options: [
        "It converts K-Means into a deep neural network",
        "It seeds initial cluster centers sequentially with probability proportional to the squared distance D(x)^2 from the nearest existing center, spreading centroids apart and guaranteeing O(log k) competitive optimality",
        "It forces all clusters to have identical sample sizes",
        "It deletes outliers before clustering begins"
      ],
      correct_option_index: 1,
      explanation: "K-Means++ spaces initial centroids far apart using D(x)^2 probability weighting, preventing poor local minima.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In high-dimensional dimensionality reduction, how does t-SNE resolve the 'Crowding Problem' when mapping high-dimensional spaces to 2D visualization planes?",
      options: [
        "By increasing the number of clusters to 1,000",
        "By rounding all numbers to integers",
        "By deleting outlier points",
        "It models low-dimensional similarities using a heavy-tailed Student-t distribution (1 degree of freedom / Cauchy), allowing moderate high-dimensional distances to map to larger low-dimensional distances without collapsing onto center points"
      ],
      correct_option_index: 3,
      explanation: "The heavy tails of the Student-t distribution in t-SNE accommodate the exponential volume difference between high and low dimensions.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In Anomaly Detection, what fundamental mathematical property allows Isolation Forests (iForest) to efficiently isolate outliers?",
      options: [
        "Anomalies have sparse feature values and require significantly fewer random partition splits to isolate, resulting in substantially shorter average tree path lengths h(x)",
        "Anomalies always have negative numbers",
        "Anomalies take the longest path to the bottom of the tree",
        "Anomalies cannot be partitioned by binary trees"
      ],
      correct_option_index: 0,
      explanation: "Outliers are few and structurally different, making them easy to isolate in very shallow tree path depths.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In Gradient Boosting, what is the primary structural difference between XGBoost and standard Gradient Boosting Machines (GBM)?",
      options: [
        "XGBoost only runs on Python 2",
        "GBM uses neural networks while XGBoost uses linear models",
        "XGBoost utilizes a second-order Taylor expansion of the loss function incorporating both first gradients and second Hessians, and adds explicit tree complexity regularization (gamma * T + lambda * ||w||^2)",
        "XGBoost does not use decision trees"
      ],
      correct_option_index: 2,
      explanation: "XGBoost approximates arbitrary loss functions via second-order Taylor expansions (gradients and Hessians) with regularized objective functions.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In ensemble learning, what is the 'Out-of-Bag' (OOB) error in Bagging and Random Forests, and why is it valuable?",
      options: [
        "An error caused by insufficient computer memory",
        "Because each bootstrap sample contains only ~63.2% of unique training samples, the remaining ~36.8% unseen samples serve as an internal validation set, providing an unbiased generalization estimate without separate cross-validation",
        "An error that occurs when a decision tree has no leaves",
        "A metric for measuring training speed in seconds"
      ],
      correct_option_index: 1,
      explanation: "The ~36.8% of observations omitted from each bootstrap sample act as an internal validation set to evaluate generalization performance.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "In Support Vector Machines, what does Mercer's Theorem establish regarding the Kernel Trick (K(x, x') = <phi(x), phi(x')>)?",
      options: [
        "All kernels must be linear functions",
        "Support vector weights must sum to 1",
        "Kernels cannot be used on image data",
        "Any continuous, symmetric, positive semi-definite kernel function implicitly corresponds to an inner product in some high-dimensional Hilbert feature space, enabling non-linear classification without ever computing explicit coordinate mappings phi(x)"
      ],
      correct_option_index: 3,
      explanation: "Mercer's theorem guarantees that any valid symmetric positive semi-definite kernel represents an inner product in a transformed feature space.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In LightGBM, what is the role of Gradient-based One-Side Sampling (GOSS) and Exclusive Feature Bundling (EFB)?",
      options: [
        "GOSS retains all instances with large gradients and randomly samples from instances with small gradients to speed up split evaluation, while EFB bundles mutually exclusive sparse features into single dense features",
        "GOSS deletes all categorical columns; EFB converts text into images",
        "GOSS doubles the number of training samples; EFB slows down training to increase precision",
        "GOSS and EFB are hardware components inside NVIDIA GPUs"
      ],
      correct_option_index: 0,
      explanation: "GOSS focuses computation on under-trained instances with large gradients, while EFB reduces feature dimensionality by bundling exclusive sparse features.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In probabilistic clustering with Gaussian Mixture Models (GMM), what occurs during the 'Expectation' (E) step and 'Maximization' (M) step of the EM algorithm?",
      options: [
        "E-step deletes data; M-step adds new data",
        "E-step trains a decision tree; M-step trains an SVM",
        "The E-step computes the posterior probability (responsibility) that each data point belongs to each Gaussian component given current parameters, while the M-step updates the mixture weights, means, and covariance matrices to maximize the expected log-likelihood",
        "E-step sorts the data; M-step computes the median"
      ],
      correct_option_index: 2,
      explanation: "The EM algorithm iteratively alternates between calculating soft cluster responsibilities (E-step) and updating Gaussian parameters (M-step).",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "What mathematical property characterizes the Gauss-Markov Theorem regarding Ordinary Least Squares (OLS) regression?",
      options: [
        "OLS is always non-linear",
        "Under the classical assumptions of linearity, strict exogeneity, and spherical homoscedastic errors, the OLS estimator beta_hat is the Best Linear Unbiased Estimator (BLUE), having minimum variance among all linear unbiased estimators",
        "OLS produces zero error on all datasets",
        "OLS requires L1 regularization to converge"
      ],
      correct_option_index: 1,
      explanation: "The Gauss-Markov theorem proves that OLS achieves the lowest sampling variance among all possible linear unbiased estimators.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In decision tree complexity regularization, how does 'Minimal Cost-Complexity Pruning' balance tree depth and validation error?",
      options: [
        "It minimizes the cost function R_alpha(T) = R(T) + alpha * |T|, where R(T) is training error, |T| is leaf count, and alpha is a penalty parameter selected via cross-validation to prune weak subtrees",
        "It deletes all leaves with odd numbers",
        "It stops training after exactly 5 seconds",
        "It replaces all decision nodes with random guesses"
      ],
      correct_option_index: 0,
      explanation: "Cost-complexity pruning penalizes tree size |T| with parameter alpha, iteratively removing subtrees that contribute least to error reduction.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #56.");
  console.log("Skill #56 update completed successfully!");
}

run();
