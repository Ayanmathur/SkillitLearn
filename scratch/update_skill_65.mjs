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

const skillId = "851ff67b-35cb-4fe5-b615-514e85a0288d";

async function run() {
  console.log("Updating Skill #65: SQL for Analysts (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Advanced Aggregations, Window Functions and Frame Mathematics" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Analytical Patterns: Cohorts, Funnels and Sessionization" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Performance Tuning, SARGability and Semi-Structured Data" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Staff Analytics Engineer level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Multi-Dimensional Aggregation: GROUPING SETS, ROLLUP and CUBE",
      order_index: 1,
      content: `### Complex Multilevel Summarization and Subtotal Hierarchies

1. Multi-Dimensional Grouping Extensions:
   - \`GROUPING SETS\`: Computes multiple independent grouping combinations in a single table scan (e.g. \`GROUP BY GROUPING SETS ((region, product), (region), (product), ())\`), replacing multiple expensive \`UNION ALL\` subqueries.
   - \`ROLLUP\`: Generates hierarchical subtotals and a grand total (e.g. \`ROLLUP(year, quarter, month)\`).
   - \`CUBE\`: Generates the complete power set (2^k) of all Cartesian subtotal combinations across k dimensions.

2. The \`GROUPING()\` Function:
   - Returns 1 when a column value is NULL due to subtotal row aggregation, and 0 when NULL is an actual data value.

3. Conditional Aggregation:
   - Standard \`COUNT(CASE WHEN status = 'REFUNDED' THEN 1 END)\` vs ANSI SQL \`COUNT(*) FILTER (WHERE status = 'REFUNDED')\` for clean pivot matrices.`
    },
    {
      track_id: track1Id,
      title: "Window Functions, Partitioning and Frame Specification Clauses",
      order_index: 2,
      content: `### Fine-Grained Analytical Partitions and Window Frames

1. Ranking and Offset Window Functions:
   - \`ROW_NUMBER()\`: Strict monotonic integer sequence per partition.
   - \`RANK()\`: Assigns identical rank to ties, creating gaps (e.g. 1, 2, 2, 4).
   - \`DENSE_RANK()\`: Assigns identical rank to ties without gaps (e.g. 1, 2, 2, 3).
   - \`LAG(col, offset, default)\` / \`LEAD(col, offset, default)\`: Accesses preceding or succeeding rows within the partition.

2. Frame Specification Mathematics:
   - \`ROWS BETWEEN N PRECEDING AND CURRENT ROW\`: Physical row-count sliding window (ideal for 7-day moving averages of daily data).
   - \`RANGE BETWEEN INTERVAL '7 DAYS' PRECEDING AND CURRENT ROW\`: Value-based temporal window handling missing calendar dates.
   - Cumulative Running Totals: \`SUM(amount) OVER (PARTITION BY user_id ORDER BY date ROWS UNBOUNDED PRECEDING)\`.`
    },
    {
      track_id: track1Id,
      title: "Direct Window Filtering: The QUALIFY Clause and Ranking Logic",
      order_index: 3,
      content: `### Advanced Window Filtering and Cumulative Distributions

1. The \`QUALIFY\` Clause (Snowflake, BigQuery, Databricks):
   - Eliminates the need to nest window functions inside subqueries or Common Table Expressions (CTEs):
\`\`\`sql
SELECT user_id, order_id, amount,
       ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY amount DESC) as rnk
FROM orders
QUALIFY rnk <= 3;
\`\`\`
   - Filters window calculations after WHERE, GROUP BY, and HAVING stages have evaluated.

2. Cumulative Statistical Distributions:
   - \`CUME_DIST()\`: Computes relative cumulative rank (values <= current row / total partition rows).
   - \`PERCENT_RANK()\`: Relative percentile position: (Rank - 1) / (Total Rows - 1).
   - \`NTILE(n)\`: Divides partition into n equal statistical buckets (quartiles, deciles).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Cohort Retention Matrices and Churn State Modeling",
      order_index: 1,
      content: `### User Lifecycle Analytics and Growth Modeling

1. Cohort Retention Matrix Construction:
   - Step 1: Assign user acquisition cohort month: \`first_month = MIN(DATE_TRUNC('month', order_date)) OVER (PARTITION BY user_id)\`.
   - Step 2: Calculate month index offset: \`month_index = DATEDIFF('month', first_month, DATE_TRUNC('month', order_date))\`.
   - Step 3: Aggregate active users per cohort and calculate retention percentage: Retention% = (Active Users in Month Index K / Initial Cohort Size) * 100%.

2. Churn and Lifecycle State Transitions:
   - Evaluates consecutive active monthly user sets using \`FULL OUTER JOIN\`:
     - New: Active in Month M, no prior history.
     - Retained: Active in Month M and Month M-1.
     - Resurrected: Active in Month M, inactive in Month M-1, with historical activity prior to M-1.
     - Churned: Active in Month M-1, inactive in Month M.`
    },
    {
      track_id: track2Id,
      title: "Event Sessionization and Inactivity Gap Thresholding",
      order_index: 2,
      content: `### Clickstream Behavioral Modeling and Session Boundaries

1. The Sessionization Algorithm:
   - Converts discrete clickstream event logs into continuous user browsing sessions:
\`\`\`sql
WITH event_gaps AS (
    SELECT user_id, event_time,
           CASE WHEN DATEDIFF('minute', LAG(event_time) OVER (PARTITION BY user_id ORDER BY event_time), event_time) > 30 
                OR LAG(event_time) OVER (PARTITION BY user_id ORDER BY event_time) IS NULL 
                THEN 1 ELSE 0 END AS is_new_session
    FROM clickstream_events
),
sessions AS (
    SELECT user_id, event_time,
           SUM(is_new_session) OVER (PARTITION BY user_id ORDER BY event_time) AS session_id
    FROM event_gaps
)
SELECT user_id, session_id, MIN(event_time) as session_start, MAX(event_time) as session_end,
       DATEDIFF('minute', MIN(event_time), MAX(event_time)) as duration_minutes, COUNT(*) as pageviews
FROM sessions
GROUP BY user_id, session_id;
\`\`\``
    },
    {
      track_id: track2Id,
      title: "Recursive CTEs for Hierarchies and Graph Traversals",
      order_index: 3,
      content: `### Hierarchical Trees, Graph Traversal and Multi-Touch Paths

1. Recursive Common Table Expression (CTE) Architecture:
   - \`WITH RECURSIVE\` consists of two unified queries:
     - Anchor Member: Evaluates initial base root nodes (e.g. CEO in organization chart or root category).
     - Recursive Member: Joins the CTE back to the source table, iterating until no new rows are produced.
\`\`\`sql
WITH RECURSIVE org_hierarchy AS (
    SELECT employee_id, manager_id, name, 1 as depth, CAST(name as VARCHAR(1000)) as path
    FROM employees
    WHERE manager_id IS NULL -- Anchor
    UNION ALL
    SELECT e.employee_id, e.manager_id, e.name, h.depth + 1, CAST(h.path || ' -> ' || e.name as VARCHAR(1000))
    FROM employees e
    JOIN org_hierarchy h ON e.manager_id = h.employee_id -- Recursive step
)
SELECT * FROM org_hierarchy ORDER BY depth, path;
\`\`\``
    },

    // Track 3
    {
      track_id: track3Id,
      title: "SARGability, Indexing Mechanics and Execution Plans",
      order_index: 1,
      content: `### Query Optimization, SARGability and Cost Diagnostics

1. SARGable (Search Argument Able) Predicates:
   - Predicates formatted to leverage B-Tree index range scans directly:
     - Non-SARGable: \`WHERE YEAR(created_at) = 2026\` or \`WHERE SUBSTRING(phone, 1, 3) = '415'\` (forces engine to evaluate function on every single row via full table scan).
     - SARGable: \`WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'\` (enables instant B-Tree index seek).

2. \`EXPLAIN ANALYZE\` Plan Diagnostics:
   - Cost Metric: (Startup Cost .. Total Cost) estimated in arbitrary page fetch units.
   - Scan Types: Sequential Scan (Seq Scan) vs Index Scan vs Bitmap Index Scan + Bitmap Heap Scan.
   - Join Mechanics: Nested Loop (low volume) vs Hash Join (high volume unsorted) vs Merge Join (pre-sorted).`
    },
    {
      track_id: track3Id,
      title: "Semi-Structured Data Manipulation: JSONB and Arrays",
      order_index: 2,
      content: `### Parsing JSON Objects, Flattening Arrays and Nested Structures

1. JSONB and JSON Querying (PostgreSQL & Snowflake):
   - Field Extraction: \`payload->>'user_id'\` (extracts text string) vs \`payload->'user_id'\` (returns JSON element).
   - Path Navigation: \`payload #>> '{metadata, device, os}'\` extracting nested hierarchical fields.

2. Array Unnesting and Lateral Joins:
   - Flattening arrays of objects into independent relational rows:
\`\`\`sql
-- Snowflake LATERAL FLATTEN
SELECT t.transaction_id, f.value:item_name::string as item_name, f.value:price::numeric as price
FROM transactions t,
LATERAL FLATTEN(input => t.items_array) f;

-- PostgreSQL jsonb_to_recordset
SELECT t.transaction_id, item.*
FROM transactions t,
jsonb_to_recordset(t.items_array) as item(item_name text, price numeric);
\`\`\``
    },
    {
      track_id: track3Id,
      title: "Analytical Cost Optimization and Cloud Warehouse FinOps",
      order_index: 3,
      content: `### Cloud Query Cost Reduction and Scan Elimination

1. Columnar Scan Cost Drivers (BigQuery / Snowflake):
   - Avoid \`SELECT *\`: In columnar warehouses, billing is directly proportional to bytes scanned; querying 5 columns out of a 100-column table reduces query costs by 95%.

2. Partition and Cluster Key Filtering:
   - Always include partition column filters in \`WHERE\` clauses (e.g. \`WHERE event_date >= CURRENT_DATE - 7\`) to allow the query engine to prune micro-partitions before scanning data.

3. Cartesian Join Explosion Mitigation:
   - Joining un-aggregated transactional tables on non-unique keys produces M x N row explosions, exhausting warehouse memory and spiking cloud compute credits. Solution: Pre-aggregate tables in CTEs before joining.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #65.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In SQL aggregation extensions, what clause allows calculating aggregations across multiple discrete dimension groupings (e.g. (region, product), (region), (product), and ()) in a single query scan?",
      options: [
        "GROUPING SETS",
        "ORDER BY",
        "LIMIT",
        "DROP TABLE"
      ],
      correct_option_index: 0,
      explanation: "GROUPING SETS allows multi-dimensional subtotals across specified grouping sets in a single table scan.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In SQL window functions, what is the difference between ROW_NUMBER(), RANK(), and DENSE_RANK() when tied values occur?",
      options: [
        "They all produce identical outputs",
        "ROW_NUMBER only works on text",
        "ROW_NUMBER assigns strict sequential integers; RANK assigns identical ranks to ties and leaves gaps (1, 2, 2, 4); DENSE_RANK assigns identical ranks to ties without gaps (1, 2, 2, 3)",
        "DENSE_RANK deletes duplicate rows"
      ],
      correct_option_index: 2,
      explanation: "RANK leaves gaps after ties, while DENSE_RANK continues numbering consecutively without gaps.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In cloud data warehouses (such as Snowflake and BigQuery), what clause allows filtering directly on window function outputs (e.g. QUALIFY rnk <= 3) without writing a subquery?",
      options: [
        "WHERE",
        "QUALIFY",
        "HAVING",
        "GROUP BY"
      ],
      correct_option_index: 1,
      explanation: "The QUALIFY clause filters window function results directly without requiring wrapped subqueries or CTEs.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "Why is 'SELECT *' considered bad practice in cloud data warehouses like BigQuery and Snowflake?",
      options: [
        "It crashes the web browser",
        "It deletes database indexes",
        "It is illegal in SQL",
        "In columnar storage, costs are billed based on bytes scanned from disk; selecting all columns reads 100% of data, dramatically increasing cloud billing costs"
      ],
      correct_option_index: 3,
      explanation: "Columnar databases charge per byte scanned; selecting all columns forces full table reads, maximizing query costs.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In SQL window frame specification, what frame clause calculates an exact 7-row moving average (current row and 6 preceding rows)?",
      options: [
        "ROWS BETWEEN 6 PRECEDING AND CURRENT ROW",
        "RANGE BETWEEN 1 AND 100",
        "ROWS UNBOUNDED FOLLOWING",
        "LIMIT 7"
      ],
      correct_option_index: 0,
      explanation: "ROWS BETWEEN 6 PRECEDING AND CURRENT ROW bounds the window frame to exactly 7 physical rows.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In web clickstream analytics, how do analysts use SQL to sessionize user events with a 30-minute inactivity timeout?",
      options: [
        "By grouping by user_id and deleting events older than 30 minutes",
        "By writing a Python script outside the database",
        "By converting timestamps to UTC",
        "By calculating the time gap from the previous event with LAG(), flagging a new session when the gap exceeds 30 minutes, and assigning session IDs via a cumulative SUM() over the flags"
      ],
      correct_option_index: 3,
      explanation: "Sessionization calculates the gap from previous events via LAG(), flags gaps > 30 min, and assigns session IDs via cumulative SUM().",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In database query optimization, why is 'WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'' SARGable, while 'WHERE YEAR(created_at) = 2026' is non-SARGable?",
      options: [
        "YEAR() is not a valid SQL function",
        "Wrapping the column in YEAR() forces the database to compute the function on every single row via a full table scan, while the date range allows instant B-Tree index seeks",
        "SARGable queries only work on integer columns",
        "There is zero performance difference"
      ],
      correct_option_index: 1,
      explanation: "Applying functions to columns disables index lookups (non-SARGable), forcing costly full table scans.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In cohort retention analysis, how is the monthly retention decay percentage calculated for an acquisition cohort?",
      options: [
        "Retention% = (Active Users in Month Offset K / Total Initial Cohort Users in Month 0) * 100%",
        "Retention% = Total Revenue / Total Orders",
        "Retention% = Month Index * 100",
        "Retention% = Count of all database rows"
      ],
      correct_option_index: 0,
      explanation: "Cohort retention measures the fraction of the original cohort size that remains active in subsequent month offsets.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In hierarchical SQL queries, what are the two core query components required within a 'WITH RECURSIVE' statement?",
      options: [
        "WHERE and HAVING",
        "CREATE and DROP",
        "An Anchor Member (evaluating base root nodes) and a Recursive Member (joining the CTE back to the source table until termination) combined via UNION ALL",
        "SELECT and INSERT"
      ],
      correct_option_index: 2,
      explanation: "Recursive CTEs combine an Anchor query (base case) and a Recursive query (inductive step) joined via UNION ALL.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In PostgreSQL JSONB querying, what is the difference between the '->' operator and the '->>' operator?",
      options: [
        "-> is for numbers; ->> is for dates",
        "->> deletes the JSON field; -> copies it",
        "-> only works on arrays",
        "-> returns the extracted field as a JSON/JSONB object; ->> returns the extracted field as a plaintext text string"
      ],
      correct_option_index: 3,
      explanation: "-> extracts elements as JSON objects, whereas ->> extracts values as unquoted plaintext strings.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In multi-touch marketing attribution and organizational reporting, how does a Recursive CTE prevent infinite loops on circular graph references?",
      options: [
        "By rebooting the database server",
        "By tracking traversed path arrays (e.g. ARRAY_APPEND(path, employee_id)) and adding a termination condition 'WHERE employee_id != ANY(path)' or limiting recursion depth",
        "Recursive CTEs cannot form infinite loops",
        "By deleting all manager IDs"
      ],
      correct_option_index: 1,
      explanation: "Tracking an array of visited node IDs allows cycles to be detected, preventing infinite recursion on cyclic graphs.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In analytical SQL window frame mathematics, what is the difference between 'ROWS BETWEEN' and 'RANGE BETWEEN' when ORDER BY contains duplicate or non-contiguous values?",
      options: [
        "ROWS only works on strings; RANGE only works on integers",
        "RANGE deletes all duplicate values",
        "ROWS specifies physical row offset counts regardless of values, whereas RANGE specifies logical value offsets (treating tied values as identical frame boundaries)",
        "There is zero difference in execution"
      ],
      correct_option_index: 2,
      explanation: "ROWS counts physical row positions; RANGE evaluates value ranges relative to the current row's ORDER BY value.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In SQL user lifecycle modeling, how are 'Resurrected Users' formally identified in month M?",
      options: [
        "Users who were active in month M, inactive in month M-1, and had historical activity prior to month M-1",
        "Users who registered an account today",
        "Users who made a refund request",
        "Users who were active in both month M and month M-1"
      ],
      correct_option_index: 0,
      explanation: "Resurrected users are active in the current period, were dormant in the immediately preceding period, but have prior historical activity.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In database query execution plans (EXPLAIN ANALYZE), what does a 'Bitmap Index Scan + Bitmap Heap Scan' represent?",
      options: [
        "The database is drawing an image on the screen",
        "The query has crashed",
        "The database is deleting old records",
        "The engine scans the index to construct an in-memory bitmap of matching physical page addresses, sorts addresses by disk location, and reads physical data pages in sequential order to minimize random disk I/O"
      ],
      correct_option_index: 3,
      explanation: "Bitmap scans build a page address bitmap from indexes and read data pages sequentially to minimize random disk head movement.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In multi-table analytical SQL queries, what causes a 'Cartesian Explosion' and what is the standard engineering remedy?",
      options: [
        "A hardware explosion inside the server",
        "Joining two granular un-aggregated tables on non-unique keys multiplies row counts (M x N), blowing up memory; remedy by pre-aggregating each table to the join key grain in CTEs before joining",
        "Writing queries with lowercase letters",
        "Selecting more than 10 columns"
      ],
      correct_option_index: 1,
      explanation: "Joining many-to-many tables on non-unique keys multiplies rows (M x N); pre-aggregating to 1-to-1 or 1-to-many before joins eliminates blowups.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #65.");
  console.log("Skill #65 update completed successfully!");
}

run();
