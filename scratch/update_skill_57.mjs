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

const skillId = "0c8431a0-7741-4ba7-a865-323e28426a17";

async function run() {
  console.log("Updating Skill #57: Deep Learning Fundamentals (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Neural Network Foundations, Activations and Weight Initialization" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Normalization Layers, Regularization and Convolutional Networks (CNNs)" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Recurrent Sequence Models, Transformers and Self-Attention" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Stanford CS231n & CS224n level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Multi-Layer Perceptrons and Universal Approximation",
      order_index: 1,
      content: `### Feedforward Neural Architectures and Representation Theory

1. The Mathematical Neuron and Layer Compositions:
   - Artificial neurons perform affine transformations z = W x + b followed by element-wise non-linear activation a = g(z).
   - Deep Feedforward Networks (Multi-Layer Perceptrons - MLPs) compose multiple non-linear hidden layers: f(x) = f_L(f_{L-1}(...f_1(x))).

2. Universal Approximation Theorem (Cybenko, 1989; Hornik, 1991):
   - A feedforward neural network with a single hidden layer containing a finite number of neurons and non-linear activation functions can approximate any continuous function on compact subsets of R^n to arbitrary precision.

3. Depth vs Width Parameter Efficiency:
   - While shallow networks can theoretically approximate any function, deep compositional hierarchies achieve exponential parameter efficiency, representing complex compositional functions with polynomial parameter complexity.`
    },
    {
      track_id: track1Id,
      title: "Non-Linear Activation Functions: ReLU, GELU and Vanishing Gradients",
      order_index: 2,
      content: `### Activation Function Dynamics and Gradient Propagation

1. Saturating Activations and the Vanishing Gradient Problem:
   - Sigmoid: sigma(z) = 1 / (1 + e^(-z)) in (0, 1). Maximum derivative sigma'(z) <= 0.25 at z=0.
   - Tanh: tanh(z) in (-1, 1). Maximum derivative tanh'(z) <= 1.0.
   - Vanishing Gradients: Multiplying chain rule derivatives < 1.0 across deep layers causes backpropagated error gradients to exponentially vanish to zero near input layers.

2. Non-Saturating Activations:
   - ReLU (Rectified Linear Unit): f(x) = max(0, x). Gradient is exactly 1.0 for x > 0, completely resolving vanishing gradients. Susceptible to 'Dying ReLU' if large negative updates cause permanent zero outputs.
   - Leaky ReLU: f(x) = max(alpha * x, x) where alpha approx 0.01.

3. Modern Smooth Activations:
   - Gaussian Error Linear Unit (GELU): f(x) = x * Phi(x) (where Phi(x) is standard normal CDF); standard in Transformer models (BERT, GPT).
   - Swish / SiLU: f(x) = x * sigma(x).`
    },
    {
      track_id: track1Id,
      title: "Weight Initialization Schemes: Xavier and Kaiming He",
      order_index: 3,
      content: `### Variance Preservation and Initialization Mathematics

1. The Initialization Dilemma:
   - Initializing weights with arbitrary variances causes signal explosions (exponential activation growth) or signal collapse (activations vanishing to zero).

2. Xavier / Glorot Initialization (Glorot & Bengio, 2010):
   - Derived for zero-centered, symmetric activations (Tanh, Sigmoid).
   - Enforces Var(a^l) = Var(a^{l-1}) and Var(grad^l) = Var(grad^{l+1}).
   - Uniform Distribution: W ~ U(-sqrt(6 / (n_in + n_out)), sqrt(6 / (n_in + n_out))).
   - Normal Distribution: W ~ N(0, 2 / (n_in + n_out)).

3. He / Kaiming Initialization (He et al., 2015):
   - Derived specifically for ReLU and LeakyReLU activations.
   - Because ReLU sets approximately 50% of activations to zero, the variance of the input signal is halved.
   - Compensating Variance: W ~ N(0, 2 / n_in), scaling by an additional factor of 2 to preserve forward and backward signal variance across 100+ deep layers.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Batch Normalization, Layer Normalization and Dropout",
      order_index: 1,
      content: `### Internal Covariate Shift, Normalization and Regularization

1. Batch Normalization (Ioffe & Szegedy, 2015):
   - Normalizes layer inputs across the mini-batch dimension:
     x_hat = (x - mu_B) / sqrt(sigma_B^2 + epsilon)
     y = gamma * x_hat + beta (where gamma and beta are learnable scale and shift parameters).
   - Benefits: Smooths the optimization loss landscape, enables higher learning rates, acts as mild regularizer, and tracks exponential moving averages for inference.

2. Layer Normalization (Ba, Kiros, Hinton, 2016):
   - Normalizes across all hidden feature channels within each individual training instance (independent of batch size); standard in sequence models and Transformers.

3. Inverted Dropout (Srivastava et al., 2014):
   - Randomly zeroes activations with dropout probability p during training, scaling surviving activations by 1 / (1 - p).
   - Eliminates need for scaling adjustments during inference.`
    },
    {
      track_id: track2Id,
      title: "Convolutional Neural Networks (CNNs) and Feature Maps",
      order_index: 2,
      content: `### Spatial Inductive Biases, Convolutions and Receptive Fields

1. 2D Convolutional Operations:
   - Slides discrete kernel filters over input feature maps, enforcing translation equivariance and local spatial weight sharing:
     S(i, j) = (I * K)(i, j) = sum_m sum_n I(i-m, j-n) K(m, n).

2. Spatial Geometry and Output Dimensions:
   - Output spatial dimension for input size W, kernel size K, padding P, and stride S:
     O = floor((W - K + 2P) / S) + 1.
   - Padding Modes: 'Valid' (P = 0, spatial reduction) vs 'Same' (P = (K - 1) / 2, spatial preservation).

3. Effective Receptive Field (ERF):
   - The spatial footprint in the input image that mathematically influences a given hidden feature unit; grows linearly with network depth and dilated convolutions.

4. Pooling Layers:
   - Max Pooling (extracts prominent features, introduces local translation invariance) and Global Average Pooling (replaces dense layers to prevent overfitting).`
    },
    {
      track_id: track2Id,
      title: "Residual Networks (ResNet) and Skip Connections",
      order_index: 3,
      content: `### The Degradation Problem and Identity Shortcut Connections

1. The Degradation Problem in Deep Networks:
   - As network depth increases beyond 20 layers, training accuracy saturates and then degrades severely (an optimization problem rather than overfitting).

2. Residual Learning Framework (He et al., 2015):
   - Instead of fitting an underlying mapping H(x), residual blocks explicitly fit a residual mapping F(x) = H(x) - x, outputting:
     H(x) = F(x) + x.

3. Gradient Flow Mathematics:
   - dL / dx = (dL / dH) * (dF / dx + 1).
   - The additive '+1' term guarantees an uninterrupted gradient highway, allowing error gradients to backpropagate directly to initial layers without decaying, enabling training of 152+ layer architectures.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Recurrent Neural Networks and Long Short-Term Memory (LSTM)",
      order_index: 1,
      content: `### Sequential Temporal Dynamics and Gating Architectures

1. Vanilla Recurrent Neural Networks (RNNs):
   - Updates hidden state across time steps: h_t = tanh(W_hh * h_{t-1} + W_xh * x_t + b).
   - Backpropagation Through Time (BPTT): Suffers from exponential gradient vanishing or exploding across extended temporal sequences.

2. Long Short-Term Memory (LSTM - Hochreiter & Schmidhuber, 1997):
   - Maintains a dedicated constant-error carousel Cell State C_t regulated by three multiplicative sigmoid gates:
     - Forget Gate: f_t = sigma(W_f [h_{t-1}, x_t] + b_f) (decides what information to purge).
     - Input Gate: i_t = sigma(W_i [h_{t-1}, x_t] + b_i) and Candidate C_tilde_t = tanh(W_c [h_{t-1}, x_t] + b_c).
     - Cell State Update: C_t = f_t * C_{t-1} + i_t * C_tilde_t.
     - Output Gate: o_t = sigma(W_o [h_{t-1}, x_t] + b_o); Hidden State h_t = o_t * tanh(C_t).

3. Gated Recurrent Unit (GRU):
   - Merges cell and hidden states using Reset and Update gates.`
    },
    {
      track_id: track3Id,
      title: "Self-Attention Mechanisms and Scaled Dot-Product Mathematics",
      order_index: 2,
      content: `### The Self-Attention Mechanism and Multi-Head Projections

1. Query, Key, Value Projections:
   - Input representations X are linearly projected into Query (Q), Key (K), and Value (V) matrices:
     Q = X W_Q, K = X W_K, V = X W_V.

2. Scaled Dot-Product Attention:
   - Attention(Q, K, V) = Softmax((Q K^T) / sqrt(d_k)) V.
   - The Scaling Factor 1 / sqrt(d_k): For large projection dimensions d_k, dot products grow large in magnitude, pushing the Softmax function into saturated regions with vanishingly small gradients; scaling by sqrt(d_k) stabilizes variance to 1.0.

3. Multi-Head Attention (MHA):
   - Projects queries, keys, and values h times with learned linear projections:
     MultiHead(Q, K, V) = Concat(head_1, ..., head_h) W_O.
   - Allows the network to jointly attend to information from different representation subspaces at different positions.`
    },
    {
      track_id: track3Id,
      title: "Modern Transformer Architecture: Encoders, Decoders and RoPE",
      order_index: 3,
      content: `### Full Transformer Architectures and Sequence Modeling

1. Positional Encodings:
   - Because self-attention is permutation-invariant, positional information must be injected:
   - Sinusoidal Absolute Encodings vs Rotary Position Embeddings (RoPE): RoPE applies a rotation matrix to Query and Key representations in complex space, naturally encoding relative token distances.

2. Transformer Architectural Blocks:
   - Encoder Block: Multi-Head Self-Attention -> Pre-LayerNorm / RMSNorm -> Feed-Forward Network (MLP / SwiGLU) with residual skip connections.
   - Decoder Block: Masked Causal Self-Attention (upper-triangular -infinity mask preventing attention to future tokens during autoregressive generation) -> Cross-Attention -> Feed-Forward Network.

3. Computational Scaling:
   - Self-attention computational complexity is O(N^2) with respect to sequence length N; optimized via FlashAttention (IO-aware tiling in GPU SRAM).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #57.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "What mathematical theorem proves that a feedforward neural network with a single hidden layer and non-linear activation functions can approximate any continuous function to arbitrary precision?",
      options: [
        "Universal Approximation Theorem",
        "Pythagorean Theorem",
        "Central Limit Theorem",
        "Bayes Theorem"
      ],
      correct_option_index: 0,
      explanation: "The Universal Approximation Theorem (Cybenko, 1989; Hornik, 1991) establishes the theoretical representation power of non-linear feedforward networks.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "Why does the ReLU (Rectified Linear Unit) activation function (f(x) = max(0, x)) resolve the Vanishing Gradient Problem compared to Sigmoid and Tanh?",
      options: [
        "ReLU deletes all negative numbers permanently",
        "ReLU runs on quantum computers",
        "For all positive inputs (x > 0), the derivative of ReLU is constant and exactly equal to 1.0, preventing gradient decay during backpropagation",
        "ReLU converts matrices into vectors"
      ],
      correct_option_index: 2,
      explanation: "ReLU has a constant derivative of 1.0 for positive activations, allowing gradients to backpropagate without exponential decay.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In Convolutional Neural Networks (CNNs), what output spatial dimension O results from an input width W = 32, kernel size K = 5, padding P = 2, and stride S = 1?",
      options: [
        "16",
        "32 (O = floor((32 - 5 + 4) / 1) + 1 = 32)",
        "28",
        "64"
      ],
      correct_option_index: 1,
      explanation: "Using the formula O = floor((W - K + 2P) / S) + 1 = floor((32 - 5 + 4) / 1) + 1 = 32 ('same' padding preserves dimension).",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In modern Transformer self-attention (Attention(Q, K, V) = Softmax((Q K^T) / sqrt(d_k)) V), why is the dot product scaled by 1 / sqrt(d_k)?",
      options: [
        "To speed up GPU cooling",
        "To convert text into images",
        "To reduce model file size",
        "To prevent large dot product magnitudes from pushing the Softmax function into saturated regions with vanishingly small gradients"
      ],
      correct_option_index: 3,
      explanation: "Dividing by sqrt(d_k) maintains unit variance for dot products, preventing Softmax from saturating and killing gradients.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In Deep Residual Networks (ResNet), what architectural feature enables training networks with over 100 deep layers without suffering from the degradation problem?",
      options: [
        "Identity Skip (Shortcut) Connections that add the input directly to the block output (H(x) = F(x) + x), creating an uninterrupted gradient highway",
        "Replacing all weights with zeros",
        "Using 1,000 GPUs simultaneously",
        "Removing all activation functions"
      ],
      correct_option_index: 0,
      explanation: "Identity skip connections add the identity mapping +x, allowing gradients to propagate directly to early layers via the +1 derivative term.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "Why is 'Kaiming / He Initialization' (W ~ N(0, 2 / n_in)) preferred over 'Xavier Initialization' when initializing deep networks utilizing ReLU activation functions?",
      options: [
        "He initialization is 10 times faster to compute",
        "He initialization was created by Microsoft",
        "Xavier initialization only works on CPUs",
        "Because ReLU zeroes out ~50% of incoming signals, halving the activation variance; He initialization scales variance by an extra factor of 2 to maintain constant signal variance"
      ],
      correct_option_index: 3,
      explanation: "He initialization accounts for the 50% rectification of ReLU by doubling the variance scale (2/n_in) to maintain signal magnitude.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In deep learning normalization techniques, how does 'Layer Normalization' differ fundamentally from 'Batch Normalization'?",
      options: [
        "Layer Normalization is only used in computer vision",
        "Layer Normalization computes mean and variance across all hidden feature channels within a single instance, making it completely independent of batch size",
        "Batch Normalization cannot be trained with backpropagation",
        "Layer Normalization requires a batch size of at least 1,000"
      ],
      correct_option_index: 1,
      explanation: "Layer Normalization normalizes across features per sample, operating identically during training and inference regardless of batch size.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In Long Short-Term Memory (LSTM) recurrent networks, what is the role of the 'Forget Gate' (f_t = sigma(W_f [h_{t-1}, x_t] + b_f))?",
      options: [
        "It outputs a number between 0 and 1 for each element in the Cell State C_{t-1}, deciding what proportion of past temporal memory to retain versus discard",
        "It shuts down the neural network",
        "It resets model weights to random numbers",
        "It deletes the training dataset"
      ],
      correct_option_index: 0,
      explanation: "The forget gate applies a sigmoid function to past hidden state and current input, scaling elements in the cell state between 0 (discard) and 1 (keep).",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In modern Transformer Large Language Models, what is the primary purpose of 'Causal (Autoregressive) Masking' in decoder self-attention layers?",
      options: [
        "To speed up matrix multiplication",
        "To translate English into Spanish",
        "To apply an upper-triangular -infinity attention mask that prevents current tokens from attending to future tokens during training, preserving autoregressive prediction",
        "To compress the vocabulary size"
      ],
      correct_option_index: 2,
      explanation: "Causal masking zeros out attention scores to future positions, ensuring tokens only attend to past and current sequence positions.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In neural network regularization, how does 'Inverted Dropout' operate during training and inference?",
      options: [
        "It deletes weights during inference",
        "It inverts all weight signs from positive to negative",
        "It forces all activations to 1.0",
        "It randomly drops units with probability p during training and scales surviving activations by 1 / (1 - p), requiring zero architectural modification at test time"
      ],
      correct_option_index: 3,
      explanation: "Inverted dropout scales surviving activations by 1/(1-p) during training so that test time forward passes can execute without modification.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In the mathematical derivation of ResNet backpropagation (dL/dx = dL/dH * (dF/dx + 1)), why does the additive '+1' term prevent vanishing gradients across 100+ layers?",
      options: [
        "It increases learning rate by 1.0 every step",
        "Even if the weight derivative dF/dx approaches zero (vanishing residual weights), the +1 term ensures that dL/dx is at least equal to dL/dH, passing gradients cleanly backwards without attenuation",
        "It converts float32 to float64",
        "It forces all gradients to be positive numbers"
      ],
      correct_option_index: 1,
      explanation: "The +1 term creates an identity gradient path, ensuring error gradients can bypass deep layers without being multiplied by shrinking weight matrices.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In modern Transformer positional encoding, how do Rotary Position Embeddings (RoPE) inject relative token order into self-attention?",
      options: [
        "By spinning the GPU fans",
        "By randomly shuffling the training dataset",
        "By rotating Query and Key vector representations in 2D coordinate pairs by an angle proportional to token position, ensuring their inner product depends purely on relative distance (m - n)",
        "By adding random noise to embeddings"
      ],
      correct_option_index: 2,
      explanation: "RoPE applies complex orthogonal rotation matrices to Q and K vectors, making their dot product an explicit function of relative token distance.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Multi-Head Attention (MHA), what mathematical capability does splitting Q, K, and V into h distinct projection subspaces provide over single-head attention?",
      options: [
        "It allows the model to jointly attend to information from different representation subspaces at different positions simultaneously (e.g. tracking syntactic syntax and semantic co-reference in parallel)",
        "It divides the training time by h",
        "It reduces model parameter count to zero",
        "It converts attention into a recurrent neural network"
      ],
      correct_option_index: 0,
      explanation: "Multi-head attention allows the model to learn multiple independent attention patterns across diverse feature subspaces concurrently.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Deep Learning activation design, what distinguishes the Gaussian Error Linear Unit (GELU) used in BERT/GPT from standard ReLU?",
      options: [
        "GELU is a linear function",
        "GELU cannot be computed by GPUs",
        "GELU was invented in 1950",
        "GELU weights inputs by their percentile value from a standard normal distribution (f(x) = x * Phi(x)), providing a smooth, non-monotonic curve with non-zero negative gradients that avoids hard zero saturation"
      ],
      correct_option_index: 3,
      explanation: "GELU combines probabilistic gating with non-monotonic curvature, providing smooth derivatives and avoiding the hard cutoff of ReLU.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In GPU memory optimization for large sequence Transformers, how does FlashAttention achieve 2x to 4x speedups without changing the exact mathematical output of Softmax((QK^T)/sqrt(d_k))V?",
      options: [
        "By dropping 50% of the attention tokens",
        "By fusing Softmax computation into tiled blocks processed entirely in fast on-chip GPU SRAM, avoiding slow High Bandwidth Memory (HBM) read/write roundtrips for intermediate N x N attention matrices",
        "By rounding all numbers to 8-bit integers",
        "By replacing Softmax with addition"
      ],
      correct_option_index: 1,
      explanation: "FlashAttention uses tiling and online softmax recomputation to compute exact attention in GPU SRAM, eliminating HBM memory bandwidth bottlenecks.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #57.");
  console.log("Skill #57 update completed successfully!");
}

run();
