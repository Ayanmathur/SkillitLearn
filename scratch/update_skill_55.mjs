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

const skillId = "cfc38834-247a-48ab-abb7-d28d04fc8fe4";

async function run() {
  console.log("Updating Skill #55: Linear Algebra & Calculus for ML (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Vector Spaces, Norms, Spectral Decompositions and SVD/PCA" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Multivariable Calculus, Jacobians, Hessians and Backprop Autodiff" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Optimization Theory: Convexity, SGD, Adam and Second-Order Dynamics" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / MIT Mathematics & Stanford ML level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Vector Spaces, Norms, Orthogonality and Projections",
      order_index: 1,
      content: `### Metric Geometry, Vector Norms and Orthogonal Projections

Linear algebra provides the mathematical substrate for representing data manifolds and linear mappings in machine learning:

1. Vector and Matrix Norms:
   - L1 Norm (Manhattan): ||x||_1 = sum(|x_i|); induces parameter sparsity in Lasso regularization by setting coefficients exactly to zero.
   - L2 Norm (Euclidean): ||x||_2 = sqrt(sum(x_i^2)); enforces smooth parameter shrinkage in Ridge regression and weight decay.
   - Frobenius Matrix Norm: ||A||_F = sqrt(sum_i sum_j a_ij^2); measures overall matrix magnitude.

2. Inner Products and Orthogonality:
   - Dot Product: <u, v> = u^T v = ||u|| ||v|| cos(theta). Orthogonal vectors satisfy u^T v = 0.
   - Cosine Similarity: cos(theta) = (u^T v) / (||u|| ||v||); measures angular orientation in high-dimensional embedding spaces.

3. Orthogonal Projections and Least Squares:
   - Projection Matrix: P = A(A^T A)^(-1) A^T projects any vector onto the column space col(A).
   - Ordinary Least Squares (OLS): Solving min ||y - X beta||_2 yields normal equations (X^T X) beta = X^T y, with optimal weights beta = (X^T X)^(-1) X^T y.`
    },
    {
      track_id: track1Id,
      title: "Eigendecomposition and Positive Semi-Definite Matrices",
      order_index: 2,
      content: `### Spectral Theorem, Quadratic Forms and Loss Curvature

1. Eigendecomposition Fundamentals:
   - For square matrix A: A v = lambda v, where lambda is an eigenvalue and v is the corresponding eigenvector.
   - Characteristic Equation: det(A - lambda I) = 0.

2. Spectral Theorem for Real Symmetric Matrices:
   - Every real symmetric matrix (A = A^T) possesses real eigenvalues and an orthonormal basis of eigenvectors:
     A = Q Lambda Q^T (where Q is an orthogonal matrix Q^T Q = I, and Lambda is a diagonal eigenvalue matrix).

3. Quadratic Forms and Definiteness:
   - Quadratic Form: f(x) = x^T A x.
   - Positive Definite (A > 0): x^T A x > 0 for all x != 0 (all lambda_i > 0); ensures strictly convex loss functions with a unique global minimum.
   - Positive Semi-Definite (A >= 0): x^T A x >= 0 (all lambda_i >= 0). Sample covariance matrices Sigma = (1/n) X^T X are always positive semi-definite.`
    },
    {
      track_id: track1Id,
      title: "Singular Value Decomposition and Principal Component Analysis",
      order_index: 3,
      content: `### Matrix Factorization, SVD and Variance Maximization (PCA)

1. Singular Value Decomposition (SVD):
   - For any real matrix A in R^(m x n):
     A = U Sigma V^T
   - U in R^(m x m): Orthogonal matrix of left singular vectors (eigenvectors of A A^T).
   - Sigma in R^(m x n): Diagonal matrix containing singular values sigma_i = sqrt(lambda_i) sorted in descending order.
   - V in R^(n x n): Orthogonal matrix of right singular vectors (eigenvectors of A^T A).

2. Principal Component Analysis (PCA):
   - Unsupervised dimensionality reduction: Projects zero-centered data matrix X onto the top k right singular vectors V_k (principal axes).
   - Maximizes preserved data variance while minimizing L2 reconstruction error.

3. Low-Rank Approximation (Eckart-Young-Mirsky Theorem):
   - The optimal rank-k matrix approximation is A_k = sum_{i=1}^k sigma_i u_i v_i^T.
   - Moore-Penrose Pseudoinverse: A^+ = V Sigma^+ U^T computes least squares solutions for non-invertible or rectangular matrices.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Multivariable Derivatives, Gradients and Directional Derivatives",
      order_index: 1,
      content: `### Vector Calculus, Gradients and High-Dimensional Geometry

1. Partial Derivatives and the Gradient:
   - Partial Derivative (df/dx_i): Measures instantaneous rate of change along coordinate axis i while holding other variables constant.
   - The Gradient Vector: nabla f(x) = [df/dx_1, df/dx_2, ..., df/dx_n]^T.
   - Directional Derivative: nabla_v f(x) = nabla f(x)^T v measures rate of change in direction of unit vector v.
   - Geometric Property: The gradient vector nabla f(x) points in the direction of steepest ascent; its negative -nabla f(x) points in the direction of steepest descent.

2. Matrix Calculus Identities:
   - Gradient of linear form: nabla_x (a^T x) = a.
   - Gradient of quadratic form: nabla_x (x^T A x) = (A + A^T) x (simplifies to 2 A x when A is symmetric).
   - Gradient of L2 residual: nabla_beta ||y - X beta||_2^2 = -2 X^T (y - X beta).`
    },
    {
      track_id: track2Id,
      title: "Jacobians, Hessians and Second-Order Taylor Approximations",
      order_index: 2,
      content: `### Higher-Order Operators and Local Surface Curvature

1. The Jacobian Matrix (First-Order Vector Derivatives):
   - For vector-valued function f: R^n -> R^m, the Jacobian J in R^(m x n) contains all first-order partial derivatives: J_ij = df_i / dx_j.
   - Represents the best linear local approximation of vector transformations (e.g. neural network layer mappings).

2. The Hessian Matrix (Second-Order Curvature):
   - Symmetric matrix H in R^(n x n) containing all second-order partial derivatives: H_ij = d^2 f / (dx_i dx_j).
   - Captures local loss surface curvature.

3. Second-Order Multivariate Taylor Expansion:
   - f(x + Delta x) approx f(x) + nabla f(x)^T Delta x + (1/2) Delta x^T H(x) Delta x.

4. Critical Point Classification:
   - At stationary points where nabla f(x) = 0:
     - H > 0 (all positive eigenvalues): Local Minimum.
     - H < 0 (all negative eigenvalues): Local Maximum.
     - Indefinite H (mixed positive and negative eigenvalues): Saddle Point.`
    },
    {
      track_id: track2Id,
      title: "Computational Graphs and Reverse-Mode Automatic Differentiation",
      order_index: 3,
      content: `### Automatic Differentiation (Autodiff) and Backpropagation

1. Forward-Mode vs Reverse-Mode Autodiff:
   - Numerical Differentiation (finite differences): Prone to truncation and round-off errors; scales as O(n) function evaluations.
   - Symbolic Differentiation: Suffers from expression swell.
   - Forward-Mode Autodiff: Computes directional derivatives simultaneously with forward pass; efficient when input dimensions are small (n << m).
   - Reverse-Mode Autodiff (Backpropagation): Efficient when scalar loss depends on millions of parameters (m = 1, n >> 1). Computes exact gradients for all n parameters in a single backward pass with O(1) computational overhead relative to the forward pass.

2. Computational Graph DAG and Chain Rule:
   - Decomposes complex neural networks into Directed Acyclic Graphs (DAGs) of elementary mathematical primitives.
   - Vectorized Multivariate Chain Rule: Computes adjoint sensitivities x_bar_j = sum_{k in children(j)} x_bar_k * (dx_k / dx_j), propagating gradients backwards from scalar loss.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Convex Optimization, Jensen's Inequality and KKT Conditions",
      order_index: 1,
      content: `### Convexity, Duality and Constrained Optimization Foundations

1. Convex Sets and Convex Functions:
   - Convex Set C: For all x, y in C and theta in [0, 1], theta x + (1-theta) y in C.
   - Convex Function: f(theta x + (1-theta) y) <= theta f(x) + (1-theta) f(y).
   - Fundamental Property: Any local minimum of a convex function over a convex set is guaranteed to be a global minimum.

2. Jensen's Inequality:
   - For any convex function f and random variable X: f(E[X]) <= E[f(X)].
   - Underpins the Evidence Lower Bound (ELBO) in Variational Autoencoders (VAEs) and the Expectation-Maximization (EM) algorithm.

3. Constrained Optimization and KKT Conditions:
   - Lagrangian: L(x, lambda, mu) = f(x) + sum lambda_i g_i(x) + sum mu_j h_j(x).
   - Karush-Kuhn-Tucker (KKT) Necessary Conditions: Stationarity, Primal Feasibility, Dual Feasibility (mu_j >= 0), and Complementary Slackness (mu_j h_j(x) = 0, determining support vectors in SVMs).`
    },
    {
      track_id: track3Id,
      title: "First-Order Optimization: SGD, Momentum, RMSprop and Adam",
      order_index: 2,
      content: `### Gradient Descent Variants and Adaptive Moment Estimation

1. Stochastic Gradient Descent (SGD):
   - Update rule: theta_{t+1} = theta_t - eta * g_t (where g_t is gradient computed on mini-batch).
   - Prone to oscillations in steep ravines and stagnation at saddle points.

2. Momentum and Nesterov Accelerated Gradient:
   - Momentum: v_t = gamma * v_{t-1} + eta * g_t; theta_{t+1} = theta_t - v_t. Accumulates velocity along consistent gradient directions, dampening orthogonal oscillations.

3. RMSprop (Adaptive Learning Rates):
   - Tracks exponentially decaying average of squared gradients: s_t = beta * s_{t-1} + (1-beta) * g_t^2.
   - Parameter update: theta_{t+1} = theta_t - (eta / sqrt(s_t + epsilon)) * g_t, scaling down steps for high-variance parameters.

4. Adam (Adaptive Moment Estimation):
   - Maintains first moment m_t (momentum) and second raw moment v_t (uncentered variance):
     m_hat_t = m_t / (1 - beta_1^t), v_hat_t = v_t / (1 - beta_2^t)
     theta_{t+1} = theta_t - (eta / (sqrt(v_hat_t) + epsilon)) * m_hat_t.`
    },
    {
      track_id: track3Id,
      title: "Second-Order Methods, Condition Numbers and Loss Topologies",
      order_index: 3,
      content: `### Newton-Raphson Optimization, Ill-Conditioning and Curvature

1. Newton-Raphson Second-Order Optimization:
   - Update rule: Delta x = -H^(-1) nabla f(x).
   - Advantage: Exhibits quadratic convergence near local minima by utilizing exact local curvature.
   - Disadvantages: Prohibitive computational cost of inverting n x n Hessian O(n^3), and vulnerability to divergence near saddle points where H is indefinite.
   - Quasi-Newton Approximations (BFGS / L-BFGS): Iteratively approximates inverse Hessian H^(-1) from gradient differences using low-rank updates.

2. Condition Number of the Hessian (kappa):
   - Condition Number: kappa(H) = lambda_max / lambda_min.
   - Ill-Conditioned Surfaces (kappa >> 1): Highly anisotropic, elongated ravines cause first-order gradient descent to oscillate wildly across narrow valleys with negligible progress along the base.
   - Solutions: Feature standardization (zero-mean unit-variance scaling), batch normalization, and adaptive optimizers (Adam).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #55.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In machine learning regularization, why does the L1 norm (||x||_1 = sum |x_i|) induce sparse weight vectors (Lasso) compared to the L2 norm?",
      options: [
        "The L1 norm geometric diamond constraint has sharp corners on the coordinate axes where contours of the loss function first intersect, setting non-informative parameters exactly to zero",
        "The L1 norm requires less RAM to store",
        "The L1 norm deletes all negative numbers",
        "The L1 norm only works on GPU clusters"
      ],
      correct_option_index: 0,
      explanation: "L1 regularization has non-differentiable corners on coordinate axes where loss contours intersect, forcing irrelevant weights to exactly zero.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What geometric vector property does the Gradient Vector (nabla f(x)) represent for a differentiable multivariable scalar loss function?",
      options: [
        "It points in the direction of steepest descent",
        "It is always equal to zero",
        "It points in the direction of steepest ascent with magnitude equal to the maximum instantaneous rate of increase",
        "It represents the total volume under the curve"
      ],
      correct_option_index: 2,
      explanation: "The gradient vector points in the direction of steepest ascent; gradient descent moves in the opposite direction (-nabla f(x)).",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In Principal Component Analysis (PCA), what are the principal component directions corresponding to the directions of maximum data variance?",
      options: [
        "Randomly selected vectors",
        "The eigenvectors of the sample covariance matrix (or right singular vectors V from SVD) associated with the largest eigenvalues",
        "The row averages of the dataset",
        "The diagonal elements of the identity matrix"
      ],
      correct_option_index: 1,
      explanation: "PCA projects data onto the eigenvectors of the covariance matrix (right singular vectors V) corresponding to the largest eigenvalues.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What is the primary computational advantage of Reverse-Mode Automatic Differentiation (Backpropagation) over Forward-Mode for training deep neural networks with millions of parameters and a single scalar loss?",
      options: [
        "It eliminates all matrix multiplications",
        "It runs on paper without computers",
        "It only works on linear regression",
        "It computes the exact gradients of the scalar loss with respect to all n parameters in a single backward pass with O(1) complexity relative to the forward pass, whereas forward mode requires n passes"
      ],
      correct_option_index: 3,
      explanation: "Reverse mode computes gradients for all parameters simultaneously in one backward sweep, independent of the parameter count n.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In mathematical optimization, what fundamental guarantee holds when minimizing a strictly convex function over a convex set?",
      options: [
        "Any local minimum is guaranteed to be the unique global minimum",
        "The function has infinitely many local maxima",
        "The gradient can never be zero",
        "The loss will always equal zero"
      ],
      correct_option_index: 0,
      explanation: "In convex optimization, the absence of spurious local minima guarantees that any local minimum found is the global minimum.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In matrix spectral theory, what does the Spectral Theorem guarantee for any real symmetric matrix (A = A^T)?",
      options: [
        "All matrix entries must be positive integers",
        "The matrix has no inverse",
        "The determinant is always zero",
        "All eigenvalues are guaranteed to be real numbers, and the matrix can be factorized as A = Q Lambda Q^T using an orthonormal basis of eigenvectors Q"
      ],
      correct_option_index: 3,
      explanation: "The Spectral Theorem guarantees that real symmetric matrices possess real eigenvalues and can be orthogonally diagonalized (A = Q Lambda Q^T).",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In multivariable calculus, what does the Hessian Matrix (H) represent and how is it used to classify critical points where nabla f(x) = 0?",
      options: [
        "It measures network bandwidth",
        "It is the symmetric matrix of all second-order partial derivatives; if H is positive definite (all eigenvalues > 0) the stationary point is a local minimum, if negative definite it is a local maximum, and if indefinite it is a saddle point",
        "It calculates the average of all data points",
        "It is used to normalize pixel values between 0 and 1"
      ],
      correct_option_index: 1,
      explanation: "The Hessian captures second-order surface curvature; positive definiteness indicates a local minimum, while indefinite eigenvalues indicate saddle points.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In neural network optimization, how does the Adam optimizer combine the mechanisms of Momentum and RMSprop?",
      options: [
        "It maintains an exponentially decaying average of past gradients (first moment m_t for momentum) and past squared gradients (second moment v_t for RMSprop adaptive scaling), incorporating bias corrections for initial steps",
        "It resets learning rates to zero every epoch",
        "It calculates exact Hessian inverses on every step",
        "It doubles the batch size every 10 iterations"
      ],
      correct_option_index: 0,
      explanation: "Adam combines Momentum (first moment m_t) and RMSprop (second raw moment v_t) with initialization bias corrections.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In statistical machine learning, what does Jensen's Inequality state for a convex function f and a random variable X, and where is it applied?",
      options: [
        "f(E[X]) > E[f(X)]",
        "E[X] is always zero",
        "f(E[X]) <= E[f(X)]; it provides the mathematical foundation for deriving the Evidence Lower Bound (ELBO) in Variational Autoencoders (VAEs) and Expectation-Maximization",
        "f(X) must be linear"
      ],
      correct_option_index: 2,
      explanation: "Jensen's inequality proves that f(E[X]) <= E[f(X)] for convex f, forming the basis for variational inference and the ELBO in VAEs.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In Singular Value Decomposition (SVD), what do the singular values (sigma_i) on the diagonal of matrix Sigma represent for matrix A?",
      options: [
        "The number of rows in the matrix",
        "The negative sum of all matrix columns",
        "The square roots of the eigenvalues of the matrix product A^T A (or A A^T), representing scaling factors along the principal axes",
        "The inverse of the learning rate"
      ],
      correct_option_index: 2,
      explanation: "Singular values are the non-negative square roots of the eigenvalues of A^T A, quantifying scaling magnitude along principal axes.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In optimization loss landscapes, why does an ill-conditioned Hessian (condition number kappa(H) = lambda_max / lambda_min >> 1) cause standard Gradient Descent to oscillate wildly and converge slowly?",
      options: [
        "Because ill-conditioned matrices cannot be loaded into memory",
        "The loss surface forms an elongated anisotropic ravine where gradients point almost perpendicularly across the steep narrow walls rather than along the gentle slope of the base toward the minimum",
        "Because the gradient becomes imaginary",
        "Because all eigenvalues become zero"
      ],
      correct_option_index: 1,
      explanation: "High condition numbers create steep ravines where gradients bounce back and forth across walls rather than progressing along the valley floor.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In constrained optimization, what role do the Karush-Kuhn-Tucker (KKT) Complementary Slackness conditions (mu_j * h_j(x) = 0) play in Support Vector Machines (SVMs)?",
      options: [
        "They make all training examples equally important",
        "They delete outliers automatically",
        "They dictate that the Lagrange multiplier mu_j can only be non-zero for data points lying exactly on the margin boundary (h_j(x) = 0), identifying the sparse set of Support Vectors defining the decision boundary",
        "They convert non-linear kernels to linear kernels"
      ],
      correct_option_index: 2,
      explanation: "Complementary slackness forces mu_j = 0 for all points not on the margin boundary, proving that only support vectors determine the SVM boundary.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In matrix calculus, what is the exact gradient of the quadratic form f(x) = x^T A x with respect to vector x when A is an arbitrary non-symmetric square matrix?",
      options: [
        "nabla_x (x^T A x) = (A + A^T) x",
        "nabla_x (x^T A x) = A x",
        "nabla_x (x^T A x) = 2 A",
        "nabla_x (x^T A x) = A^T A x"
      ],
      correct_option_index: 0,
      explanation: "For any square matrix A, nabla_x (x^T A x) = (A + A^T) x; when A is symmetric (A = A^T), this simplifies to 2 A x.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "What is the primary operational difference between Newton-Raphson optimization (second-order) and Quasi-Newton methods like L-BFGS in large-scale machine learning?",
      options: [
        "Newton-Raphson only works on integers",
        "L-BFGS requires computing the exact inverse Hessian H^(-1) on every step",
        "Newton-Raphson is faster for 1 billion parameters",
        "Newton-Raphson requires computing and inverting the full n x n Hessian matrix at prohibitive O(n^3) cost, whereas L-BFGS approximates the inverse Hessian curvature using low-rank updates from recent gradient differences with O(n) memory"
      ],
      correct_option_index: 3,
      explanation: "L-BFGS avoids the O(n^3) cost and O(n^2) memory of inverting large Hessians by maintaining limited-memory approximations from gradient history.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In matrix approximation theory, what does the Eckart-Young-Mirsky Theorem state regarding the truncated Singular Value Decomposition (A_k = sum_{i=1}^k sigma_i u_i v_i^T)?",
      options: [
        "The truncated SVD creates an invalid matrix",
        "The rank-k truncated SVD A_k is the mathematically optimal rank-k approximation of matrix A that minimizes both the Frobenius norm and spectral norm reconstruction errors ||A - A_k||",
        "Truncated SVD only works on symmetric square matrices",
        "Truncation increases the rank of the matrix"
      ],
      correct_option_index: 1,
      explanation: "The Eckart-Young-Mirsky theorem proves that truncated SVD provides the lowest-error rank-k approximation under both spectral and Frobenius norms.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #55.");
  console.log("Skill #55 update completed successfully!");
}

run();
