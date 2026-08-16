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

const skillId = "f999b29d-9d3a-422f-a8f9-8bc0441edd9f";

async function run() {
  console.log("Updating Skill #68: Python for Data Analysis (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: NumPy Array Computing, Strides and Vectorization" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Pandas Manipulation, Indexing and Merge Topologies" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Exploratory Data Analysis, Imputation and Time-Series" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Senior Quantitative Data Scientist level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "NumPy N-Dimensional Arrays and Memory Layouts",
      order_index: 1,
      content: `### Array Strides, Contiguous Memory and Views vs Copies

1. The NumPy \`ndarray\` Memory Model:
   - Encapsulates a contiguous block of homogeneous memory characterized by data type (\`dtype\`), shape tuple (dimensions), and strides tuple (byte offsets to traverse to the next element along each dimension).
   - C-Contiguous (Row-Major: rows stored consecutively in memory) vs Fortran-Contiguous (Column-Major).

2. Memory Views vs Memory Copies:
   - Slicing operations (\`arr[::2, :]\`) create zero-copy \`views\` pointing to original buffer offsets, executing with O(1) time and memory complexity.
   - Boolean masking (\`arr[arr > 0]\`) and integer fancy indexing force full memory allocation and data copying.`
    },
    {
      track_id: track1Id,
      title: "Vectorized Arithmetic, Universal Functions and Broadcasting",
      order_index: 2,
      content: `### SIMD Hardware Acceleration and Broadcasting Rules

1. Universal Functions (ufuncs):
   - Fast, compiled C-functions performing element-by-element operations across arrays in CPU SIMD vector registers (\`np.sin\`, \`np.exp\`, \`np.add.reduce\`), eliminating Python interpreter loop overhead.

2. The NumPy Broadcasting Rules:
   - Two dimensions are compatible when:
     - They are equal, or
     - One of them is equal to 1.
   - Arrays are aligned starting from trailing (rightmost) dimensions. If shapes are (256, 256, 3) and (3,), the second array is broadcast along the leading dimensions with zero memory duplication.

3. Conditional Vectorization:
   - Fast conditional branching via \`np.where(condition, x, y)\` and \`np.select([cond1, cond2], [choice1, choice2], default=default_val)\`.`
    },
    {
      track_id: track1Id,
      title: "Advanced Indexing, Reshaping and Structured Arrays",
      order_index: 3,
      content: `### High-Dimensional Array Reshaping and Record Buffers

1. Reshaping and Transposing:
   - \`reshape()\`: Modifies shape and strides without copying data when memory layout permits.
   - \`ravel()\` returns a contiguous flattened view when possible; \`flatten()\` always allocates a new physical copy.
   - \`transpose()\`: Swaps strides along axes without copying buffer contents.

2. Structured Arrays and Record Arrays:
   - Associates heterogeneous named fields and sub-dtypes with custom byte offsets in a single contiguous memory block:
\`\`\`python
dt = np.dtype([('user_id', 'i8'), ('balance', 'f8'), ('active', '?')])
records = np.zeros(1000, dtype=dt)
\`\`\``
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Pandas 2.0 Architecture, PyArrow Backends and BlockManager",
      order_index: 1,
      content: `### Columnar Memory Layouts and String Categorical Compression

1. Pandas 2.0 Apache Arrow Backend:
   - Replaces the fragmented 2D NumPy \`BlockManager\` with 1D Apache Arrow columnar arrays (\`pd.read_parquet(..., dtype_backend="pyarrow")\`).
   - Advantages: Standardized Arrow data types, native support for missing values without type coercion (e.g. integer columns with NULLs without casting to float64), and over 50% memory reduction.

2. Categorical Optimization:
   - Converting high-cardinality repetitive string columns to \`category\` dtypes replaces text strings with compact integer code lookups, reducing memory consumption by up to 90%.`
    },
    {
      track_id: track2Id,
      title: "Groupby Split-Apply-Combine, Multi-Indexing and Transforms",
      order_index: 2,
      content: `### Aggregations, Window Transforms and Hierarchical Slicing

1. Split-Apply-Combine Mechanics:
   - Splitting DataFrame by categorical keys, applying mathematical functions, and combining results.

2. \`transform()\` vs \`agg()\`:
   - \`agg()\`: Collapses rows to output summary scalar metrics per group.
   - \`transform()\`: Preserves original DataFrame row shape and index, broadcasting group statistics directly back to individual rows (essential for group standardization):
\`\`\`python
df['z_score'] = df.groupby('category')['amount'].transform(lambda x: (x - x.mean()) / x.std())
\`\`\`

3. MultiIndex Slicing:
   - Slicing across hierarchical multi-level row/column indexes using \`pd.IndexSlice\` and \`unstack()\`.`
    },
    {
      track_id: track2Id,
      title: "Reshaping Data: Pivot, Melt, Stack and Merge Topologies",
      order_index: 3,
      content: `### Tidy Data Principles, Pivoting and As-Of Joins

1. Reshaping and Tidy Data:
   - \`pd.melt()\`: Unpivots wide DataFrames into long format with clear variable and value columns.
   - \`pd.pivot_table()\`: Reshapes long format into structured multi-dimensional summary grids with aggregated values.

2. Relational Merges and Validation:
   - \`pd.merge(left, right, on='key', how='inner', validate='one_to_many')\` (enforces cardinality constraints, catching unintended Cartesian duplicates).

3. Approximate Time Merging (\`pd.merge_asof\`):
   - Performs approximate time-series matching joins, matching timestamps on nearest prior event within specified tolerance windows (essential for financial tick data).`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Missing Data Mechanisms, Imputation and Outlier Detection",
      order_index: 1,
      content: `### Statistical Cleansing, MICE Imputation and Outlier Fences

1. Missing Data Taxonomies:
   - Missing Completely at Random (MCAR): Missingness is independent of both observed and unobserved data (safe for listwise deletion).
   - Missing at Random (MAR): Missingness depends systematically on observed features.
   - Missing Not at Random (MNAR): Missingness depends directly on the unobserved missing value itself.

2. Imputation Strategies:
   - Simple median/mode imputation vs Multivariate Imputation by Chained Equations (MICE / \`IterativeImputer\`) fitting iterative regression models across features.

3. Outlier Diagnostics:
   - Standard Z-Score (|Z| > 3).
   - Modified Z-Score utilizing Median Absolute Deviation (MAD): MAD = median(|x_i - median(x)|) (robust against extreme outlier masking).
   - Tukey IQR Fences: [Q1 - 1.5*IQR, Q3 + 1.5*IQR].`
    },
    {
      track_id: track3Id,
      title: "Time-Series Analysis: Resampling, Rolling Windows and STL",
      order_index: 2,
      content: `### Temporal Aggregations, Window Functions and Trend Decomposition

1. DatetimeIndex Operations:
   - Timezone localization (\`tz_localize('UTC')\`), conversion (\`tz_convert('America/New_York')\`), and frequency downsampling/upsampling (\`resample('W-MON').agg(...)\`).

2. Window Statistics:
   - Rolling Window: \`df['sales'].rolling(window=30).mean()\` (calculating 30-day moving averages).
   - Expanding Window: \`df['sales'].expanding().sum()\` (calculating cumulative year-to-date totals).

3. STL Seasonal Decomposition:
   - Decomposes time-series using Loess smoothing into three additive components:
     Y_t = Trend_t + Seasonal_t + Residual_t.`
    },
    {
      track_id: track3Id,
      title: "Statistical Modeling in Python: Statsmodels and Seaborn",
      order_index: 3,
      content: `### Exploratory Regression Diagnostics and Visualizations

1. Statsmodels OLS Regression Analysis:
   - Fitting Ordinary Least Squares regressions with formula interface:
\`\`\`python
import statsmodels.formula.api as smf

model = smf.ols('revenue ~ marketing_spend + C(region) + discount', data=df).fit()
print(model.summary())
\`\`\`
   - Interpreting R-squared, Adjusted R-squared, F-statistic, p-values, t-statistics, condition numbers, and Omnibus normality tests.

2. Exploratory Visual Diagnostics with Seaborn:
   - Multi-feature pairwise scatter distributions via \`sns.pairplot(df, hue='category')\`, joint distributions via \`sns.jointplot()\`, and correlation matrices via \`sns.heatmap(df.corr(), annot=True, cmap='viridis')\`.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #68.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In NumPy array memory architecture, what is the operational difference between a 'View' and a 'Copy'?",
      options: [
        "Views require double the memory of Copies",
        "A View points to the original array memory buffer with adjusted strides and shape (O(1) memory), while a Copy allocates brand-new memory and duplicates elements",
        "Copies are written in C; Views are written in Java",
        "There is zero difference in memory allocation"
      ],
      correct_option_index: 1,
      explanation: "NumPy views share the underlying memory buffer using offset and stride metadata, executing instantly without allocating new memory.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In NumPy, how do 'Broadcasting' rules allow operations between arrays of different dimensions (e.g. shape (100, 3) and shape (3,))?",
      options: [
        "NumPy deletes trailing dimensions",
        "NumPy converts both arrays to Python lists",
        "NumPy only broadcasts arrays of identical shapes",
        "NumPy aligns dimensions from right to left; if trailing dimensions match or one dimension equals 1, the smaller array is virtually expanded without memory duplication"
      ],
      correct_option_index: 3,
      explanation: "NumPy aligns dimensions from right to left, broadcasting dimensions of size 1 across larger dimensions without copying data.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In Pandas data optimization, how does converting high-cardinality repetitive string columns to the 'category' dtype reduce memory usage by up to 90%?",
      options: [
        "It stores unique strings in an integer dictionary table, replacing repeated string memory allocations with small integer code arrays",
        "It deletes all rows containing duplicate strings",
        "It compresses data into a ZIP archive",
        "It converts text into floating point numbers"
      ],
      correct_option_index: 0,
      explanation: "Categorical dtypes store strings as an indexed code dictionary, replacing bulky string objects with compact integer memory representations.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In Pandas data transformation, what is the primary functional difference between df.groupby().agg() and df.groupby().transform()?",
      options: [
        "transform() only works on text columns",
        "agg() multiplies numbers by 2",
        "agg() collapses rows to return a single aggregate summary per group, whereas transform() broadcasts calculated group statistics back to every original row, preserving the original DataFrame index and shape",
        "There is zero difference in output shape"
      ],
      correct_option_index: 2,
      explanation: "agg() reduces rows per group, while transform() outputs a Series aligned with the original DataFrame's rows and index.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In time-series data analysis with Pandas, what method resamples a DatetimeIndex DataFrame from high-frequency (hourly) to lower-frequency (daily) and computes mean metrics?",
      options: [
        "df.drop_duplicates()",
        "df.resample('D').mean()",
        "df.sort_values()",
        "df.tail()"
      ],
      correct_option_index: 1,
      explanation: "resample('D') performs temporal downsampling to daily frequency, applying the specified aggregation function.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In Pandas 2.0+, what architectural change improves memory efficiency and null handling over legacy NumPy BlockManagers?",
      options: [
        "Pandas 2.0 was rewritten in HTML",
        "Pandas 2.0 deletes all missing values",
        "Adoption of the Apache Arrow in-memory backend (dtype_backend='pyarrow'), providing native missing value representations without float type-casting and zero-copy parquet interop",
        "Pandas 2.0 only runs on mobile devices"
      ],
      correct_option_index: 2,
      explanation: "Pandas 2.0 supports PyArrow backends, enabling true nullable types and standardized columnar memory without BlockManager fragmentation.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In financial and high-frequency time-series joins, what does 'pd.merge_asof()' accomplish?",
      options: [
        "It performs an approximate match merge on key timestamps, matching records to the nearest prior (or posterior) timestamp within an allowable tolerance window",
        "It only merges data on exact string matches",
        "It deletes all non-matching records",
        "It converts financial data to Bitcoin"
      ],
      correct_option_index: 0,
      explanation: "merge_asof joins two DataFrames on closest chronological timestamps, essential when aligning asynchronous event streams.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In exploratory data cleansing, why is the 'Modified Z-score' based on Median Absolute Deviation (MAD) preferred over the standard Z-score for outlier detection?",
      options: [
        "Standard Z-score requires quantum computing",
        "Modified Z-score only works on positive integers",
        "Standard Z-score cannot be calculated in Python",
        "Standard Z-score relies on sample mean and standard deviation, which are themselves severely distorted by extreme outliers; MAD uses medians, making outlier detection robust against masking"
      ],
      correct_option_index: 3,
      explanation: "Sample means and standard deviations are heavily skewed by extreme values; MAD uses medians, providing an uncorrupted outlier baseline.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In tidy data manipulation, what is the difference between 'pd.melt()' and 'pd.pivot_table()'?",
      options: [
        "melt() deletes missing values; pivot_table() keeps them",
        "pd.melt() unpivots wide DataFrames into long tidy format, while pd.pivot_table() aggregates long data into wide multi-dimensional grids",
        "melt() is written in Rust; pivot_table() is written in C",
        "There is zero difference"
      ],
      correct_option_index: 1,
      explanation: "pd.melt() transforms wide data into long format; pd.pivot_table() aggregates and reshapes long data into wide multidimensional summaries.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In statistical time-series modeling, what are the three components extracted during Seasonal-Trend decomposition using Loess (STL)?",
      options: [
        "Mean, Median, and Mode",
        "Alpha, Beta, and Gamma",
        "Trend component (underlying direction), Seasonal component (cyclical periodic pattern), and Residual component (irregular random noise)",
        "Minimum, Maximum, and Average"
      ],
      correct_option_index: 2,
      explanation: "STL decomposes time-series into Trend (T_t), Seasonal (S_t), and Residual/Remainder (R_t) additive components.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In missing data theory, how does 'Missing at Random' (MAR) fundamentally differ from 'Missing Not at Random' (MNAR)?",
      options: [
        "In MAR, missingness systematically depends on other observed variables (which can be statistically controlled via MICE imputation); in MNAR, missingness depends directly on the unobserved value itself (creating systematic bias)",
        "MAR only occurs in laboratory experiments",
        "MNAR data can be solved by simple listwise deletion",
        "There is no mathematical distinction"
      ],
      correct_option_index: 0,
      explanation: "MAR missingness is explained by observed covariates; MNAR missingness relates to the unobserved value itself, introducing severe bias.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In NumPy array memory layout, why does traversing a C-Contiguous 2D array row-by-row execute substantially faster than traversing column-by-column?",
      options: [
        "Columns contain more data than rows",
        "NumPy prevents column traversal with an error",
        "Rows use less RAM than columns",
        "Row-by-row traversal reads contiguous adjacent memory addresses, maximizing CPU L1/L2 cache line hits, whereas column traversal jumps across memory strides causing frequent CPU cache misses"
      ],
      correct_option_index: 3,
      explanation: "C-contiguous arrays store elements of a row sequentially in memory; traversing row-wise leverages CPU spatial cache locality.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In relational DataFrame merging, what is the purpose of passing 'validate=\"one_to_many\"' or 'validate=\"one_to_one\"' to pd.merge()?",
      options: [
        "To encrypt data during the merge",
        "It checks merge key uniqueness across left and right DataFrames, raising an immediate MergeError exception if unexpected duplicates exist, preventing Cartesian row explosion bugs",
        "To automatically convert strings into dates",
        "To speed up merging by 1,000x"
      ],
      correct_option_index: 1,
      explanation: "validate ensures key uniqueness matches expectations, throwing errors if duplicate keys cause unintended Cartesian explosions.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In statistical regression diagnostics with statsmodels, what does a large 'Condition Number' (> 1000) in the OLS regression summary diagnose?",
      options: [
        "The computer operating system has crashed",
        "The dataset has zero missing values",
        "Severe multicollinearity among independent predictor features, making matrix inversion ill-conditioned and coefficient standard errors unstable",
        "The model has 100% predictive accuracy"
      ],
      correct_option_index: 2,
      explanation: "Condition numbers > 1000 indicate severe multicollinearity, causing numerical instability in matrix inversion and coefficient estimates.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In high-dimensional NumPy array operations, what is the structural difference between np.ravel() and np.flatten()?",
      options: [
        "np.ravel() returns a contiguous 1D flattened view whenever memory layout allows (O(1) memory), while np.flatten() always allocates new memory and returns a physical copy",
        "np.ravel() is for 3D arrays; np.flatten() is for 2D arrays",
        "np.flatten() converts numbers to strings",
        "There is zero difference in memory allocation"
      ],
      correct_option_index: 0,
      explanation: "ravel() returns a memory view whenever possible; flatten() always creates a brand-new copy of the flattened array in memory.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #68.");
  console.log("Skill #68 update completed successfully!");
}

run();
