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

const skillId = "f027516d-5e4c-4f4f-af55-e230ecc39001";

async function run() {
  console.log("Updating Skill #69: Excel for Analysis (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Advanced Formula Engineering, Dynamic Arrays and LAMBDA" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Power Query ETL, M Language and Query Folding" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Power Pivot (DAX), VertiPaq Engine and Scenario Modeling" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Financial Modeling World Cup & Excel MVP level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Dynamic Array Engine and Spilled Range References",
      order_index: 1,
      content: `### The Modern Calculation Paradigm and Spilled Arrays

1. The Dynamic Array Engine:
   - Formulas returning multiple results automatically spill into adjacent cells across rows and columns.
   - The Spilled Range Operator (\`#\`): Referencing the entire dynamic result set of cell A2 via \`=SUM(A2#)\`.

2. Core Dynamic Array Functions:
   - \`FILTER(array, include, [if_empty])\`: Dynamically filters ranges on complex multi-criteria boolean masks (\`(Region=\"West\") * (Sales > 1000)\`).
   - \`UNIQUE(array)\`: Extracts distinct values with zero manual deduplication.
   - \`SORT()\` and \`SORTBY(array, by_array, sort_order)\`: Sorts data dynamically without altering source grids.

3. The \`XLOOKUP\` Protocol:
   - \`=XLOOKUP(lookup_val, lookup_rng, return_rng, [if_not_found], [match_mode], [search_mode])\`
   - Advantages over legacy VLOOKUP: Exact match default, indestructible column references, right-to-left lookups, binary search mode (\`search_mode=2\`), and two-way 2D lookups.`
    },
    {
      track_id: track1Id,
      title: "Scoped Variables and Custom Functions: LET and LAMBDA",
      order_index: 2,
      content: `### Functional Programming and Computational Optimization

1. The \`LET\` Function (Local Scoped Variables):
   - Assigns names to intermediate calculation values, eliminating redundant recalculations and accelerating formula execution by up to 10x:
\`\`\`excel
=LET(
    rev, Table1[Revenue],
    cost, Table1[COGS],
    margin, (rev - cost) / rev,
    AVERAGE(FILTER(margin, margin > 0.15))
)
\`\`\`

2. The \`LAMBDA\` Function:
   - Creates reusable, custom named functions without VBA or macros:
     \`=LAMBDA(val, rate, years, val * (1 + rate)^years)\`
   - Stored directly in Name Manager (e.g. \`CompoundGrowth(val, rate, years)\`).

3. Lambda Helper Functions:
   - \`BYROW()\` and \`BYCOL()\`: Applies a lambda function across each individual row or column of an array.
   - \`MAP()\`, \`SCAN()\`, and \`REDUCE()\`: Functional list processing primitives in Excel.`
    },
    {
      track_id: track1Id,
      title: "Index-Match Two-Way Lookups and Matrix Algebra in Excel",
      order_index: 3,
      content: `### Coordinate Mapping and Matrix Mathematics

1. Indestructible Two-Way Lookups:
   - \`=INDEX(Data_Matrix, MATCH(Row_Key, Row_Headers, 0), MATCH(Col_Key, Col_Headers, 0))\`
   - Decouples lookup logic from physical column numbers, ensuring formulas never break when new columns or rows are inserted into the sheet.

2. Matrix Mathematics in Excel:
   - \`MMULT(array1, array2)\`: Computes matrix dot product multiplication (essential for portfolio variance calculations in financial engineering: w^T * Sigma * w).
   - \`TRANSPOSE(array)\`: Swaps matrix rows and columns dynamically.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Power Query ETL Architecture and Applied Steps",
      order_index: 1,
      content: `### Automated Data Transformation and Pipeline Automation

1. Power Query (Get & Transform) Engine:
   - Non-destructive automated data preparation pipeline that records every transformation step as a declarative sequence of Applied Steps.

2. Multi-Source Ingestion:
   - Connects to SQL databases (PostgreSQL, Snowflake), REST API web endpoints, SharePoint lists, and multi-file folders (automatically appending monthly CSV/Excel files).

3. Core Data Cleansing Operations:
   - Unpivot Columns: Converts cross-tabulated wide matrix reports into normalized, tidy attribute-value records.
   - Merging and Appending Queries: Executing relational joins (Inner, Left Outer, Full Outer, Left Anti) and union concatenations.`
    },
    {
      track_id: track2Id,
      title: "Query Folding and the M Language Architecture",
      order_index: 2,
      content: `### Database Pushdown Optimization and M Code Structure

1. Query Folding:
   - The Power Query mashup engine automatically translates recorded M transformation steps into native SQL queries sent directly to source relational databases.
   - Benefit: Heavy filtering, grouping, and joining execute inside the database server, transmitting only finalized results over the network.
   - Breaking Query Folding: Steps using custom M logic or non-foldable operations (e.g. index column creation) force Power Query to download the entire table to local RAM.

2. The M Formula Language:
   - Functional, case-sensitive language structured into \`let ... in\` blocks:
\`\`\`powerquery
let
    Source = Sql.Database("db.corp.net", "Warehouse"),
    Sales_Table = Source{[Schema="dbo",Item="Sales"]}[Data],
    FilteredRows = Table.SelectRows(Sales_Table, each [Amount] > 1000)
in
    FilteredRows
\`\`\``
    },
    {
      track_id: track2Id,
      title: "Memory Caching and Performance Optimization in Power Query",
      order_index: 3,
      content: `### Scalable Ingestion and Pipeline Optimization

1. Table Buffering with \`Table.Buffer\`:
   - Loads and caches an intermediate table directly into local memory:
     \`Buffered_Dim = Table.Buffer(Source_Dim)\`
   - Prevents Power Query from re-querying and re-evaluating slow upstream data sources multiple times during nested loops or complex merge joins.

2. Pipeline Performance Best Practices:
   - Apply row filtering (\`Table.SelectRows\`) and column removal as the very first steps in the query to maximize query folding efficiency and minimize data transit volume.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "The VertiPaq Columnar Engine and Star Schema Data Modeling",
      order_index: 1,
      content: `### In-Memory Analytical Compression and Relational Modeling

1. The xVelocity / VertiPaq Columnar Engine:
   - Powers Excel Power Pivot and Microsoft Power BI.
   - Compresses relational data by up to 10x using columnar dictionary encoding, bit-packing, and Run-Length Encoding (RLE) stored directly in RAM.

2. Star Schema Dimensional Modeling:
   - Fact Tables (transactional numeric metrics) linked to Dimension Tables (descriptive attributes) via 1-to-many single-direction relationships.
   - Avoids flat, bloated de-normalized tables, dramatically accelerating calculations across millions of rows.`
    },
    {
      track_id: track3Id,
      title: "DAX Measures: Filter Context, CALCULATE and Time Intelligence",
      order_index: 2,
      content: `### Data Analysis Expressions and Dynamic Context Transition

1. Filter Context vs Row Context:
   - Filter Context: The active set of filters applied by PivotTable rows, columns, slicers, and report filters evaluating a Measure.
   - Row Context: Exists strictly during row-by-row iteration in Calculated Columns or iterator functions (\`SUMX\`, \`AVERAGEX\`).

2. The \`CALCULATE\` Function:
   - The engine of DAX: Evaluates an expression while overriding, adding, or removing filter contexts:
     \`Sales_Prior_Year = CALCULATE([Total_Sales], SAMEPERIODLASTYEAR(DimDate[Date]))\`
   - \`ALL(Table[Column])\`: Removes filter context to compute percentages of total.
   - \`USERELATIONSHIP\`: Dynamically activates secondary inactive relationships (e.g. Order Date vs Ship Date).`
    },
    {
      track_id: track3Id,
      title: "What-If Analysis, Solver Optimization and Scenario Modeling",
      order_index: 3,
      content: `### Quantitative Optimization and Financial Sensitivity

1. What-If Analysis Tools:
   - Data Tables (1-Variable and 2-Variable): Evaluates financial sensitivity across interest rate and tenure matrices in a single recalculation.
   - Goal Seek: Single-variable backward solver solving for target outputs.

2. Excel Solver Engine:
   - Multivariable optimization under linear and non-linear inequality constraints:
     - Simplex LP: Solves linear programming optimization (supply chain logistics, mix optimization).
     - GRG Non-Linear: Solves smooth non-linear continuous problems.
     - Evolutionary Engine: Solves discontinuous, non-smooth heuristic models.

3. Formula Auditing:
   - Trace Precedents (\`Ctrl + [\`) and Trace Dependents (\`Ctrl + ]\`) to audit financial models and detect circular dependencies.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #69.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In modern Excel (Dynamic Array Engine), what operator symbol is appended to a cell reference (e.g. A2#) to dynamically reference the entire spilled array output?",
      options: [
        "# (Spilled range operator)",
        "@ (Implicit intersection operator)",
        "$ (Absolute reference operator)",
        "! (Sheet reference operator)"
      ],
      correct_option_index: 0,
      explanation: "The # operator references the entire spilled range dynamically returned by a dynamic array formula in that cell.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What modern Excel lookup function replaces VLOOKUP by defaulting to exact match, supporting right-to-left lookups, and eliminating column index numbering errors?",
      options: [
        "HLOOKUP",
        "LOOKUP",
        "XLOOKUP",
        "SEARCH"
      ],
      correct_option_index: 2,
      explanation: "XLOOKUP defaults to exact match, looks up in any direction, and takes separate return arrays rather than brittle column index numbers.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In Excel Power Query, what transformation converts wide cross-tabulated tables with dates across multiple columns into a normalized, tidy two-column format (Attribute and Value)?",
      options: [
        "Pivot Columns",
        "Unpivot Columns",
        "Group By",
        "Transpose"
      ],
      correct_option_index: 1,
      explanation: "Unpivot Columns transforms wide column layouts into normalized long format, making data ready for analytical modeling.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In Excel Power Pivot DAX modeling, what central function modifies, overrides, or adds to the active filter context when evaluating a calculation?",
      options: [
        "SUM",
        "COUNT",
        "VLOOKUP",
        "CALCULATE"
      ],
      correct_option_index: 3,
      explanation: "CALCULATE is the fundamental DAX function that alters the active filter context during measure evaluation.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In Excel advanced formulas, what function assigns variable names to intermediate calculations to eliminate redundant formula recalculations and boost speed?",
      options: [
        "LET",
        "IF",
        "CONCAT",
        "TEXT"
      ],
      correct_option_index: 0,
      explanation: "The LET function defines local named variables within a formula, preventing duplicate computations and improving readability.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In Power Query ETL, what is 'Query Folding' and why is it critical for processing large database datasets?",
      options: [
        "Folding paper printouts of queries",
        "Deleting queries that take longer than 10 seconds",
        "Compressing Excel workbooks into zip files",
        "Power Query translates M transformation steps into native SQL queries executed directly by the source database, retrieving only filtered results over the network"
      ],
      correct_option_index: 3,
      explanation: "Query folding pushes transformation logic down to the source database engine, eliminating client memory and network bottlenecks.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Excel Power Query M language, why is 'Table.Buffer' applied to intermediate dimension tables during complex merge operations?",
      options: [
        "It converts tables into PDF documents",
        "It caches the table in local memory, preventing Power Query from re-querying the slow upstream source multiple times during iterative lookups",
        "It deletes duplicate rows",
        "It turns off Excel calculation"
      ],
      correct_option_index: 1,
      explanation: "Table.Buffer loads and pins a table in RAM, preventing repeated roundtrips to slow upstream sources during nested joins.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In modern Excel formula design, what feature allows creating custom, reusable user-defined functions without writing any VBA or macros?",
      options: [
        "LAMBDA function (stored in Name Manager)",
        "Excel Solver",
        "Goal Seek",
        "Flash Fill"
      ],
      correct_option_index: 0,
      explanation: "The LAMBDA function allows users to define custom functions with parameters, which can be named in Name Manager and reused workbook-wide.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In Excel Power Pivot, what in-memory columnar database engine compresses relational datasets by up to 10x using dictionary encoding and Run-Length Encoding?",
      options: [
        "Access Engine",
        "SQLite",
        "VertiPaq (xVelocity) Engine",
        "VBA Engine"
      ],
      correct_option_index: 2,
      explanation: "The VertiPaq engine powers Power Pivot and Power BI, compressing data column-by-column in RAM for fast aggregations.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In Excel sensitivity modeling, what tool generates a two-dimensional matrix evaluating how varying two inputs (e.g. interest rate and loan tenure) affects a calculated financial output?",
      options: [
        "Conditional Formatting",
        "Text to Columns",
        "Remove Duplicates",
        "Two-Variable Data Table (What-If Analysis)"
      ],
      correct_option_index: 3,
      explanation: "A Two-Variable Data Table calculates a grid of formula outcomes across two independent parameter ranges simultaneously.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In DAX modeling for Power Pivot, how does the 'USERELATIONSHIP' function handle role-playing dimensions (such as Order Date and Ship Date sharing a single Date Dimension)?",
      options: [
        "It deletes all relationships in the model",
        "It dynamically activates an existing inactive relationship for the duration of the specific CALCULATE evaluation without altering the physical model",
        "It combines Order Date and Ship Date into a single column",
        "It converts dates into text strings"
      ],
      correct_option_index: 1,
      explanation: "USERELATIONSHIP activates a secondary inactive relationship within CALCULATE, allowing analysis on alternative date keys.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In mathematical optimization modeling, which algorithm in Excel Solver is specifically designed to solve Linear Programming problems with linear objective functions and constraints?",
      options: [
        "Evolutionary Engine",
        "GRG Non-Linear Engine",
        "Simplex LP",
        "Goal Seek"
      ],
      correct_option_index: 2,
      explanation: "Simplex LP solves linear optimization models with guaranteed global optimality and fast execution.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In financial engineering with Excel, what matrix function computes the dot product of portfolio asset weight vectors and covariance matrices (w^T * Sigma * w)?",
      options: [
        "MMULT",
        "SUMIF",
        "AVERAGE",
        "COUNTBLANK"
      ],
      correct_option_index: 0,
      explanation: "MMULT performs matrix multiplication on arrays, essential for vector-matrix calculations in modern portfolio theory.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Power Query performance engineering, what common transformation step causes Query Folding to fail, forcing full table client-side downloads?",
      options: [
        "Table.SelectRows (simple equality filter)",
        "Table.SelectColumns (choosing columns)",
        "Table.Join (standard database join)",
        "Adding an Index Column or applying custom non-standard M functions"
      ],
      correct_option_index: 3,
      explanation: "Operations like adding index columns or non-translatable M functions break query folding, requiring Power Query to download raw data.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In DAX calculations, what is 'Context Transition' and how is it triggered inside an iterator function like SUMX?",
      options: [
        "Converting numbers to text",
        "Wrapping a calculation in CALCULATE transforms the current Row Context into an equivalent Filter Context, enabling row-level measures to evaluate aggregate filters",
        "Deleting the filter context",
        "Transitioning from Excel to Python"
      ],
      correct_option_index: 1,
      explanation: "Context transition occurs when CALCULATE converts existing row context into equivalent filter context during iteration.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #69.");
  console.log("Skill #69 update completed successfully!");
}

run();
