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

const skillId = "2c126cb3-f133-4129-9849-bf465d0e10ab";

async function run() {
  console.log("Updating Skill #59: ML Deployment (9 steps across 3 tracks)...");

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
        title: `Track ${tracks.length + 1}: ML Deployment`,
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
  await supabase.from("tracks").update({ title: "Track 1: Model Serialization, Interoperability and High-Throughput Serving" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Inference Optimization: Quantization, TensorRT and Distillation" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Containerization, Kubernetes KServe and Production Rollouts" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Senior MLOps Engineer level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Model Packaging: ONNX, TorchScript and Safetensors",
      order_index: 1,
      content: `### Cross-Framework Serialization Formats and Security

1. Serialization Paradigms:
   - Python Pickle / Joblib: Prone to Python runtime version dependency breaking and severe security vulnerabilities (arbitrary Python code execution during untrusted deserialization).
   - Open Neural Network Exchange (ONNX): Standardized, vendor-neutral computational graph protocol with formal operator definitions; enables seamless deployment across PyTorch, TensorFlow, TensorRT, and OpenVINO.
   - TorchScript (JIT): \`torch.jit.trace\` (recording tensor operations on sample inputs) vs \`torch.jit.script\` (compiling Python control flow into C++ TorchScript graph), enabling Python-free C++ production serving.
   - Safetensors (Hugging Face): Secure, zero-copy memory-mapped (\`mmap\`) tensor format that completely eliminates arbitrary code execution risks and accelerates multi-gigabyte model loading speeds by up to 10x.`
    },
    {
      track_id: track1Id,
      title: "Microservice Serving: FastAPI, gRPC and Dynamic Batching",
      order_index: 2,
      content: `### API Protocol Architectures and Request Queue Dynamics

1. REST API Architecture (FastAPI & Uvicorn):
   - Asynchronous non-blocking event loops, automatic Pydantic request/response schema validation, and low latency serialization for web and mobile clients.

2. High-Performance gRPC over HTTP/2:
   - Binary Protocol Buffer serialization replacing text JSON; eliminates string parsing bottlenecks and enables bi-directional streaming, reducing inter-microservice latency by over 60%.

3. Dynamic Micro-Batching:
   - Aggregates individual incoming inference requests over a short time window (\`max_queue_delay_microseconds\`) into a single combined tensor batch, maximizing GPU parallel tensor core utilization and drastically increasing throughput under high QPS.`
    },
    {
      track_id: track1Id,
      title: "Enterprise Inference Engines: Triton and vLLM PagedAttention",
      order_index: 3,
      content: `### Scalable Model Serving Backends and LLM Serving

1. NVIDIA Triton Inference Server:
   - Multi-framework serving (TensorRT, ONNX Runtime, PyTorch, Python backend).
   - Concurrent Model Execution: Running multiple models or multiple instances of the same model concurrently across GPU instances.
   - Ensemble Pipelines: Chains data preprocessing, inference, and postprocessing entirely within GPU memory without CPU roundtrips.

2. vLLM and PagedAttention for Large Language Models:
   - Manages Key-Value (KV) cache memory using virtual memory paging principles inspired by operating system memory management.
   - Eliminates 96% of KV cache memory fragmentation, enabling up to 24x higher throughput over standard Hugging Face Transformers serving.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Quantization: FP32, INT8, FP8 and Quantization-Aware Training",
      order_index: 1,
      content: `### Precision Reduction and Tensor Compression Mathematics

1. Quantization Mathematics:
   - Maps continuous FP32 values x in [alpha, beta] to discrete n-bit integers q:
     q = round(x / S) + Z (where S is scale factor and Z is zero-point).

2. Post-Training Quantization (PTQ):
   - Converts weights and activations to INT8 using calibration datasets to compute activation histograms and optimal clipping thresholds via KL divergence minimization.

3. Quantization-Aware Training (QAT):
   - Simulates low-precision rounding errors during the forward pass using Straight-Through Estimators (STE), allowing model weights to adapt to quantization noise during gradient backpropagation.

4. 4-Bit LLM Quantization:
   - AWQ (Activation-aware Weight Quantization) and GPTQ (second-order error compensation via inverse Hessian updates).`
    },
    {
      track_id: track2Id,
      title: "TensorRT Compilation, Operator Fusion and Kernel Tuning",
      order_index: 2,
      content: `### Hardware-Specific Graph Optimization and CUDA Kernel Tuning

1. NVIDIA TensorRT Inference Engine:
   - High-performance deep learning inference optimizer and runtime compiler designed for NVIDIA GPU microarchitectures.

2. Operator and Layer Fusion:
   - Vertical Fusion: Fuses consecutive sequential layers (e.g. Convolution + Bias + ReLU + BatchNorm) into a single unified CUDA kernel, eliminating expensive high-bandwidth memory (HBM) read/write roundtrips between GPU registers and DRAM.
   - Horizontal Fusion: Combines parallel operations (e.g. multiple 1x1 convolutions sharing common inputs) into a single batch kernel.

3. Hardware Kernel Auto-Tuning:
   - Benchmarks hundreds of specialized CUDA kernel implementations directly on the target physical GPU hardware, selecting the optimal algorithm for specific tensor dimensions.`
    },
    {
      track_id: track2Id,
      title: "Pruning, Knowledge Distillation and Model Compression",
      order_index: 3,
      content: `### Structural Model Compression and Latent Knowledge Transfer

1. Weight Pruning:
   - Magnitude-based unstructured pruning (zeroing small individual weights) vs Structured pruning (pruning entire channels, attention heads, or feedforward layers for direct hardware acceleration without sparse matrix overhead).

2. Knowledge Distillation (Geoffrey Hinton, 2015):
   - Compresses massive 'Teacher' models or ensembles into compact 'Student' models.
   - Soft Target Loss: The student learns from the teacher's softened probability outputs using temperature-scaled softmax:
     p_i = exp(z_i / T) / sum exp(z_j / T)
   - Minimizes Kullback-Leibler (KL) divergence between teacher and student soft distributions, transferring dark knowledge regarding latent class similarities.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Containerization: Docker, NVIDIA Runtime and Multi-Stage Builds",
      order_index: 1,
      content: `### Cloud-Native Container Packaging and GPU Acceleration

1. Multi-Stage Docker Builds:
   - Stage 1 (Builder): Installs compilers, CUDA build tools, and compiles Python wheels.
   - Stage 2 (Runtime): Copies only compiled binaries and wheels into a minimal, hardened base image (e.g. distroless or Debian slim), reducing container footprint from 8GB to < 800MB.

2. GPU Container Acceleration:
   - Configures the NVIDIA Container Toolkit (\`nvidia-container-toolkit\`) to pass physical GPU drivers and CUDA runtime sockets seamlessly into container instances (\`--gpus all\`).

3. Container Security Hardening:
   - Disables root execution (\`USER nonroot\`), mounts root filesystems as read-only, and enforces explicit health checks (\`HEALTHCHECK\`).`
    },
    {
      track_id: track3Id,
      title: "Kubernetes Orchestration: KServe, Ray Serve and Autoscaling",
      order_index: 2,
      content: `### Cloud-Native Model Infrastructure and Serverless Autoscaling

1. KServe (formerly KFServing):
   - Standardized Kubernetes Custom Resource Definition (InferenceService) providing serverless ML deployments over Knative and Istio.
   - Scale-to-Zero: Scales idle GPU model replicas down to zero pods to conserve cloud infrastructure costs, spinning up instances dynamically on incoming traffic.

2. Ray Serve:
   - Distributed, Python-native model serving framework supporting complex multi-model pipelines, actor replicas, and stateful routing.

3. Custom Autoscaling Metrics:
   - Horizontal Pod Autoscaler (HPA) driven by custom Prometheus metrics: Scaling based on queue depth, request latency (p95), or GPU Duty Cycle rather than standard CPU/memory metrics.`
    },
    {
      track_id: track3Id,
      title: "Deployment Rollouts, Shadow Scoring and Feature Stores",
      order_index: 3,
      content: `### Zero-Downtime Deployment Strategies and Production Monitoring

1. Production Deployment Topologies:
   - Canary Deployment: Routes a small fraction of live traffic (e.g. 5% -> 25% -> 100%) to the new candidate model, monitoring error rates before complete rollout.
   - Blue-Green Deployment: Deploys identical parallel environments, performing atomic traffic cutover via load balancer routing.
   - Shadow (Dark) Deployment: Asynchronously duplicates 100% of live production traffic to the new model without returning its predictions to users, comparing latency and prediction drift safely in production.

2. Feature Stores (Feast / Hopsworks):
   - Eliminates train-serve feature skew by providing a unified feature registry, serving low-latency online features via Redis and historical point-in-time features via data warehouses.

3. Monitoring Telemetry:
   - Prometheus and Grafana capturing inference latency histograms (p50, p95, p99), throughput (QPS), and data drift alerts.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #59.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "What open-source model format from Hugging Face uses memory-mapped (mmap) files to safely store tensors, completely preventing arbitrary code execution vulnerabilities present in Python pickle files?",
      options: [
        "Safetensors",
        "ZIP file",
        "CSV format",
        "HTML file"
      ],
      correct_option_index: 0,
      explanation: "Safetensors is a secure, zero-copy format designed to store tensors safely without executing arbitrary Python bytecode during loading.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In model serving protocols, what is the primary operational advantage of using gRPC (over HTTP/2 with Protocol Buffers) compared to standard REST JSON APIs?",
      options: [
        "gRPC requires zero lines of code",
        "gRPC converts models into images",
        "Binary Protocol Buffer serialization eliminates string parsing overhead and enables bidirectional streaming, dramatically reducing inter-service latency",
        "gRPC only runs on mobile phones"
      ],
      correct_option_index: 2,
      explanation: "gRPC uses binary Protocol Buffers over HTTP/2, eliminating JSON text serialization bottlenecks and lowering request latency.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What inference engine feature combines multiple incoming inference requests that arrive within a short time window into a single tensor batch to maximize GPU hardware utilization?",
      options: [
        "Model Deletion",
        "Dynamic Batching (Micro-Batching)",
        "Single-threaded queuing",
        "Static compilation"
      ],
      correct_option_index: 1,
      explanation: "Dynamic batching groups asynchronous client requests into a unified batch on the GPU, maximizing tensor core utilization.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What deployment strategy routes 100% of live production traffic to a new candidate model asynchronously in the background, measuring its predictions and latency without returning its outputs to real end users?",
      options: [
        "Canary Deployment",
        "Blue-Green Deployment",
        "Rolling Update",
        "Shadow (Dark) Deployment"
      ],
      correct_option_index: 3,
      explanation: "Shadow deployments mirror real production traffic to evaluate new models safely under live conditions without impacting users.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In deep learning quantization, what does Post-Training Quantization (PTQ) from FP32 to INT8 accomplish?",
      options: [
        "It reduces model memory footprint by 4x and accelerates inference execution on integer tensor cores by mapping 32-bit floats to 8-bit integers",
        "It doubles the parameter count",
        "It makes models 100% accurate on all tasks",
        "It eliminates the need for a GPU"
      ],
      correct_option_index: 0,
      explanation: "INT8 quantization maps 32-bit floating point weights/activations to 8-bit integers, reducing memory footprint and boosting throughput.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In Large Language Model (LLM) serving, how does the vLLM engine's 'PagedAttention' algorithm improve serving throughput by 10x to 24x?",
      options: [
        "By deleting the attention mechanism entirely",
        "By translating English into C++",
        "By running only 1 request per GPU",
        "It manages Key-Value (KV) cache memory using virtual memory paging algorithms (similar to OS memory management), eliminating 96% of memory fragmentation"
      ],
      correct_option_index: 3,
      explanation: "PagedAttention allocates KV cache in non-contiguous memory blocks, virtually eliminating memory fragmentation and maximizing batch sizes.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In GPU inference acceleration with NVIDIA TensorRT, what is 'Vertical Layer Fusion'?",
      options: [
        "Rotating a neural network by 90 degrees",
        "Fusing sequential layers (e.g. Convolution + Bias + ReLU + BatchNorm) into a single combined CUDA kernel, eliminating high-bandwidth memory (HBM) read/write roundtrips",
        "Stacking multiple GPUs on top of each other",
        "Training multiple models at once"
      ],
      correct_option_index: 1,
      explanation: "Vertical fusion merges sequential operations into a single GPU kernel, keeping intermediate tensors in registers rather than slow DRAM.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In MLOps architecture, what critical problem does a 'Feature Store' (such as Feast or Hopsworks) solve for production machine learning systems?",
      options: [
        "It eliminates Train-Serve Feature Skew by ensuring identical feature transformation logic is shared between offline training pipelines and low-latency online inference stores",
        "It stores code repositories on GitHub",
        "It sells machine learning datasets to consumers",
        "It compresses video files"
      ],
      correct_option_index: 0,
      explanation: "Feature stores maintain unified feature definitions, preventing discrepancies between features created during training and inference.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In model compression via Knowledge Distillation (Geoffrey Hinton, 2015), why is Temperature scaling (T > 1) applied to the Softmax function of the Teacher model?",
      options: [
        "To overheat the computer processor",
        "To make the output probabilities equal to zero",
        "It softens the probability distribution across non-target classes, revealing 'dark knowledge' and latent semantic relationships for the student model to learn",
        "To format numbers into currency"
      ],
      correct_option_index: 2,
      explanation: "Higher temperature softens output distributions, exposing the relative probability structure (dark knowledge) across non-target classes.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In Docker containerization for machine learning microservices, why are 'Multi-Stage Builds' standard engineering practice?",
      options: [
        "They make Docker images 10 times larger",
        "They allow Docker to run without Linux",
        "They force all developers to use Python 2",
        "They isolate build tools and compilers in early stages, copying only compiled binaries and wheels into a minimal runtime image, reducing container image size from gigabytes to megabytes"
      ],
      correct_option_index: 3,
      explanation: "Multi-stage builds leave heavy compilers in discardable stages, packaging only necessary runtime artifacts into lean, secure images.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In PyTorch production deployment, what is the key operational difference between TorchScript Tracing (torch.jit.trace) and TorchScript Scripting (torch.jit.script)?",
      options: [
        "Tracing is written in Java; Scripting is written in C++",
        "Tracing records exact tensor operations executed during a sample forward pass but silently erases dynamic Python control flow (if-statements, loops), whereas Scripting directly parses and compiles Python AST control flow",
        "Tracing requires a supercomputer",
        "Scripting only works on linear regression"
      ],
      correct_option_index: 1,
      explanation: "Tracing hardcodes the path taken by sample inputs, ignoring branches; Scripting compiles the full AST including dynamic control flow.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Quantization-Aware Training (QAT), how does the 'Straight-Through Estimator' (STE) enable gradient backpropagation through non-differentiable rounding operators?",
      options: [
        "By replacing all gradients with random numbers",
        "By deleting the rounding operator during forward pass",
        "It applies exact discrete rounding in the forward pass, but treats the rounding operator as an identity function (derivative = 1.0) during the backward pass, passing gradients directly to full-precision weights",
        "By training without backpropagation"
      ],
      correct_option_index: 2,
      explanation: "STE passes gradients unchanged (derivative = 1) through the non-differentiable quantization function to update full-precision shadow weights.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Kubernetes model orchestration with KServe, what capability is provided by 'Scale-to-Zero' autoscaling over Knative?",
      options: [
        "It automatically reduces active GPU pod replicas to zero when no incoming inference requests are received, eliminating idle infrastructure costs and spinning up pods on demand",
        "It deletes all model weights from storage",
        "It turns off the internet connection",
        "It sets model latency to zero seconds"
      ],
      correct_option_index: 0,
      explanation: "Scale-to-zero terminates idle pod instances during periods of zero traffic, re-instantiating pods dynamically when new requests arrive.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In production ML observability, why is monitoring P99 latency histograms far more critical than monitoring Mean (Average) Latency for high-throughput APIs?",
      options: [
        "P99 latency requires less memory to calculate",
        "Mean latency cannot be calculated by Prometheus",
        "P99 latency only measures GPU temperature",
        "Mean latency completely masks tail latency spikes caused by garbage collection, queue saturation, and cold starts that degrade the experience of the slowest 1% of user requests"
      ],
      correct_option_index: 3,
      explanation: "Averages hide extreme tail latency anomalies; 99th percentile (p99) metrics expose the worst-case delays experienced by users.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In weight pruning, what is the architectural difference between 'Unstructured Pruning' and 'Structured Pruning' regarding production hardware acceleration?",
      options: [
        "Unstructured pruning only works on text data",
        "Unstructured pruning zeros arbitrary individual weights creating sparse matrices that require specialized sparse accelerators, whereas Structured pruning removes entire channels/layers, providing direct speedups on standard dense hardware",
        "Structured pruning requires quantum computers",
        "There is zero difference in hardware execution"
      ],
      correct_option_index: 1,
      explanation: "Structured pruning drops complete channels/matrix rows, enabling immediate speedups on standard hardware without sparse matrix libraries.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #59.");
  console.log("Skill #59 update completed successfully!");
}

run();
