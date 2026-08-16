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

const skillId = "19ed8f91-e65c-49d3-87c0-b6836d07bcd1";

async function run() {
  console.log("Updating Skill #53: SQL & Relational Databases (9 steps across 3 tracks)...");

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
        title: `Track ${tracks.length + 1}: SQL & Relational Databases`,
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
  await supabase.from("tracks").update({ title: "Track 1: Relational Theory, Normalization (1NF to BCNF) and Dimensional Modeling" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Advanced SQL Engineering, Window Functions and Recursive CTEs" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Indexing Internals, Query Optimization and ACID MVCC Concurrency" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Stanford Database Systems level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Relational Algebra Foundations and Set Theory",
      order_index: 1,
      content: `### Mathematical Foundations of the Relational Model

The relational database model (Edgar F. Codd, 1970) provides the mathematical framework underlying relational database management systems:

1. Formal Relational Constructs:
   - Relation: A mathematical set of tuples sharing a common schema.
   - Tuple: An unordered set of attribute-value pairs (row).
   - Attribute: A named column associated with a specific data domain (data type).

2. Core Relational Algebra Operators:
   - Selection (sigma): Filters tuples satisfying a predicate.
   - Projection (pi): Selects a subset of specified attributes, discarding others.
   - Cartesian Product (X): Combines all tuples from relation R with all tuples from relation S.
   - Set Union, Difference, and Intersection: Set operations requiring union-compatible schemas.
   - Joins: Theta Join, Equi-Join, and Natural Join (Cartesian product followed by equality selection and projection).

3. Declarative SQL Translation:
   - Declarative SQL statements are compiled by the database query planner into algebraic operator trees representing these primitive relational operations.`
    },
    {
      track_id: track1Id,
      title: "Database Normalization Theory: 1NF, 2NF, 3NF and BCNF",
      order_index: 2,
      content: `### Eliminating Redundancy and Functional Dependency Theory

Database normalization eliminates insert, update, and deletion anomalies by structuring schemas around functional dependencies (X -> Y):

1. Normal Form Progression:
   - 1NF (First Normal Form): All column values are atomic (indivisible scalars); no repeating groups or nested array columns.
   - 2NF (Second Normal Form): Satisfies 1NF and contains no partial key dependencies (every non-prime attribute is fully functionally dependent on the entirety of every candidate key).
   - 3NF (Third Normal Form): Satisfies 2NF and contains no transitive dependencies (no non-prime attribute is functionally dependent on another non-prime attribute).
   - Boyce-Codd Normal Form (BCNF): A stricter version of 3NF where for every non-trivial functional dependency X -> Y, X must be a superkey.

2. Normalization vs Denormalization Trade-offs:
   - Highly normalized schemas (3NF/BCNF) maximize transactional data integrity in OLTP systems.
   - Denormalized schemas reduce join complexity to optimize read throughput in analytical data warehouses.`
    },
    {
      track_id: track1Id,
      title: "Dimensional Modeling: Star Schema, Snowflake and SCD Types",
      order_index: 3,
      content: `### Analytical Data Warehousing and Dimensional Architectures

Analytical data repositories (OLAP) structure data around Kimball dimensional modeling principles:

1. Fact vs Dimension Tables:
   - Fact Tables: Contain quantitative numerical metrics and additive measurements (e.g. \`sales_amount\`, \`unit_count\`) alongside foreign keys linking to dimension tables.
   - Dimension Tables: Contain rich, denormalized textual attributes providing analytical context (e.g. \`dim_customer\`, \`dim_product\`, \`dim_time\`).

2. Schema Topologies:
   - Star Schema: Fact table at the center directly joined to completely denormalized dimension tables (simplifies SQL joins and optimizes query execution).
   - Snowflake Schema: Dimension tables are normalized into sub-dimensions (conserves disk storage but introduces multi-table join overhead).

3. Slowly Changing Dimensions (SCD):
   - SCD Type 1: Overwrites historical values in place (no audit history).
   - SCD Type 2: Inserts a new record with surrogate key, \`start_date\`, \`end_date\`, and \`is_current\` flag, preserving complete historical changes.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Advanced SQL Joins, Aggregations and Grouping Sets",
      order_index: 1,
      content: `### Advanced Query Formulation and Multi-Dimensional Aggregation

1. Relational Join Execution Mechanics:
   - \`INNER JOIN\`: Returns records with matching keys in both tables.
   - \`LEFT OUTER JOIN\` / \`RIGHT OUTER JOIN\`: Preserves all rows from one table, inserting NULLs for missing counterparts.
   - \`FULL OUTER JOIN\`: Preserves all rows from both tables.
   - \`CROSS JOIN\`: Computes full Cartesian product (N * M rows).
   - Self Joins: Joining a table onto itself to model parent-child relationships.

2. Multi-Dimensional Aggregations:
   - \`GROUPING SETS\`: Computes multiple custom aggregations in a single query pass.
   - \`ROLLUP\`: Generates hierarchical subtotals and grand totals (e.g. Year -> Quarter -> Month).
   - \`CUBE\`: Computes subtotals across all possible cross-dimensional combinations.
   - Conditional Aggregation: Using \`COUNT(CASE WHEN condition THEN 1 END)\` or PostgreSQL \`FILTER (WHERE condition)\` syntax.`
    },
    {
      track_id: track2Id,
      title: "SQL Window Functions, Partitioning and Frame Specifications",
      order_index: 2,
      content: `### Analytical SQL Window Functions and Frame Mechanics

Window functions perform calculations across a set of table rows related to the current row without collapsing the result set:

1. Window Function Syntax:
   - \`FUNCTION() OVER (PARTITION BY partition_col ORDER BY sort_col [FRAME_CLAUSE])\`

2. Ranking and Distribution Functions:
   - \`ROW_NUMBER()\`: Assigns unique sequential integers starting at 1.
   - \`RANK()\`: Assigns ranks with gaps on tie values (e.g. 1, 2, 2, 4).
   - \`DENSE_RANK()\`: Assigns ranks without gaps on tie values (e.g. 1, 2, 2, 3).
   - \`NTILE(n)\`: Divides ordered partitions into n buckets (quartiles, percentiles).

3. Offset and Value Functions:
   - \`LAG(col, offset, default)\` & \`LEAD(col, offset, default)\`: Accesses values from previous or subsequent rows (essential for computing month-over-month growth rates).

4. Window Frame Specifications:
   - \`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\` (running cumulative sums).
   - \`ROWS BETWEEN 6 PRECEDING AND CURRENT ROW\` (7-day moving averages).`
    },
    {
      track_id: track2Id,
      title: "Common Table Expressions (CTEs) and Recursive Queries",
      order_index: 3,
      content: `### Query Modularization and Graph Traversal with Recursive CTEs

1. Non-Recursive Common Table Expressions (CTEs):
   - \`WITH cte_name AS (SELECT ...)\`: Improves query readability, decomposes complex queries into modular stages, and enables query optimizer re-use.

2. Hierarchical and Recursive CTEs (\`WITH RECURSIVE\`):
   - Architecture:
     - Anchor Member: Base query establishing the initial result set.
     - \`UNION ALL\`
     - Recursive Member: Query referencing the CTE itself, executing iteratively until returning an empty set.
\`\`\`sql
WITH RECURSIVE OrgHierarchy AS (
    -- Anchor member
    SELECT employee_id, manager_id, full_name, 1 AS depth
    FROM employees WHERE manager_id IS NULL
    UNION ALL
    -- Recursive member
    SELECT e.employee_id, e.manager_id, e.full_name, o.depth + 1
    FROM employees e
    INNER JOIN OrgHierarchy o ON e.manager_id = o.employee_id
)
SELECT * FROM OrgHierarchy ORDER BY depth;
\`\`\`
   - Applications: Organizational charts, bill-of-materials traversal, and network graph pathfinding.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Database Storage Internals: B+ Trees, Hash and GIN Indexes",
      order_index: 1,
      content: `### Physical Storage Structures, Page Layouts and Index Architectures

1. Database Page and Slotted-Page Architecture:
   - Data stored in fixed-size pages (e.g. 8KB in PostgreSQL) composed of page headers, line pointers, and tuple storage.

2. B+ Tree Index Mechanics:
   - Self-balancing n-ary tree with high fan-out (100 to 500 children per node) and shallow depth (typically 3 to 4 levels).
   - Leaf nodes contain all index keys and tuple pointers, linked horizontally as a doubly linked list.
   - Search Complexity: O(log N) operations; optimized for equality lookups, range scans (\`BETWEEN\`, \`>\`, \`<\`), and sorted order traversal (\`ORDER BY\`).

3. Specialized Index Types:
   - Hash Indexes: O(1) equality lookups; cannot support range queries.
   - Generalized Inverted Indexes (GIN): Maps elements within composite values to posting lists of row IDs (optimized for JSONB \`@>\` containment, full-text search \`tsvector\`, and array queries).`
    },
    {
      track_id: track3Id,
      title: "Query Optimization, EXPLAIN Plans and Join Algorithms",
      order_index: 2,
      content: `### Cost-Based Optimizers and Physical Execution Engines

1. Query Execution Pipeline:
   - SQL Parser -> Query Rewriter -> Cost-Based Optimizer (CBO) -> Execution Engine.
   - The CBO evaluates disk I/O, CPU costs, table statistics, and data histograms to select the lowest-cost execution plan.

2. Analyzing \`EXPLAIN (ANALYZE, BUFFERS)\`:
   - Sequential Scan (\`Seq Scan\`): Reads all pages sequentially from disk.
   - Index Scan: Traverses B+ tree to fetch individual heap pages.
   - Bitmap Index Scan: Gathers page pointers into an in-memory bitmap before fetching heap pages in physical sequential order.

3. Physical Join Algorithms:
   - Nested Loop Join: Iterates through outer relation, probing inner relation (fast for small, indexed tables).
   - Hash Join: Builds an in-memory hash table on the inner relation, probing with rows from the outer relation (efficient for large unsorted datasets).
   - Merge Join: Sorts both relations on join keys, then merges simultaneously.`
    },
    {
      track_id: track3Id,
      title: "ACID Semantics, Transaction Isolation and MVCC Concurrency",
      order_index: 3,
      content: `### Transactional Integrity, Isolation Levels and Concurrency Control

1. The ACID Properties:
   - Atomicity: All operations succeed or all roll back (enforced via Write-Ahead Logging - WAL).
   - Consistency: Transitions database between valid schema states.
   - Isolation: Concurrent transactions execute without cross-transaction interference.
   - Durability: Committed transactions persist permanently across power loss (enforced via WAL \`fsync\`).

2. ANSI SQL Isolation Levels & Concurrency Anomalies:
   - Read Uncommitted: Permits Dirty Reads (reading uncommitted changes).
   - Read Committed: Prevents dirty reads; vulnerable to Non-Repeatable Reads.
   - Repeatable Read: Snapshot isolation; prevents non-repeatable reads; vulnerable to Write Skew.
   - Serializable: Full serialization; prevents all anomalies including Phantom Reads via Two-Phase Locking (2PL) or Serializable Snapshot Isolation (SSI).

3. Multi-Version Concurrency Control (MVCC):
   - In PostgreSQL, readers never block writers and writers never block readers.
   - Implemented via tuple versioning metadata (\`xmin\` and \`xmax\` transaction IDs) and background VACUUM garbage collection.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #53.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In relational database theory, what normal form requires that all column values are atomic (no repeating groups or arrays) and that a primary key is defined?",
      options: [
        "First Normal Form (1NF)",
        "Second Normal Form (2NF)",
        "Third Normal Form (3NF)",
        "Boyce-Codd Normal Form (BCNF)"
      ],
      correct_option_index: 0,
      explanation: "1NF requires that all attribute values are atomic scalar values and that each record is uniquely identifiable by a primary key.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In SQL window functions, what ranking function assigns sequential integers starting at 1 without creating gaps when tied values occur (e.g. 1, 2, 2, 3)?",
      options: [
        "ROW_NUMBER()",
        "RANK()",
        "DENSE_RANK()",
        "NTILE()"
      ],
      correct_option_index: 2,
      explanation: "DENSE_RANK() assigns consecutive ranks to tie values without skipping subsequent integer ranks.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In dimensional data warehouse modeling (Kimball methodology), what type of table contains quantitative numerical measurements (such as revenue and units sold) and foreign keys?",
      options: [
        "Dimension Table",
        "Fact Table",
        "Lookup Table",
        "Staging Table"
      ],
      correct_option_index: 1,
      explanation: "Fact tables store quantitative additive business metrics (facts) linked to surrounding dimension context tables.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What standard database index data structure organizes keys in a self-balancing tree with high fan-out and doubly-linked leaf nodes, optimizing both equality lookups and range scans?",
      options: [
        "Hash Index",
        "Linked List",
        "Binary Search Tree",
        "B+ Tree Index"
      ],
      correct_option_index: 3,
      explanation: "B+ Trees maintain balanced n-ary trees where all data pointers reside in doubly linked leaf nodes, ideal for range queries.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In database transaction management, what does the 'A' in the ACID acronym stand for?",
      options: [
        "Atomicity (all transaction steps succeed completely or all roll back with zero partial changes)",
        "Authorization",
        "Availability",
        "Authentication"
      ],
      correct_option_index: 0,
      explanation: "Atomicity guarantees that all statements within a transaction execute as an indivisible unit of work, rolling back entirely on failure.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In database normalization, what defines Third Normal Form (3NF)?",
      options: [
        "Tables must have exactly 3 columns",
        "Tables must be stored in 3 different files",
        "All tables must use foreign keys",
        "The schema satisfies 2NF and contains no transitive functional dependencies (no non-prime attribute depends on another non-prime attribute)"
      ],
      correct_option_index: 3,
      explanation: "3NF eliminates transitive functional dependencies, ensuring every non-key column depends solely on candidate keys.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In SQL analytical queries, how does an offset window function like 'LAG(revenue, 1) OVER (ORDER BY sale_date)' operate?",
      options: [
        "It slows down query execution by 1 second",
        "It accesses the value of the 'revenue' column from the immediately preceding row within the ordered partition, enabling period-over-period variance calculations",
        "It deletes the previous row",
        "It sorts the table in descending order"
      ],
      correct_option_index: 1,
      explanation: "LAG() retrieves attribute values from prior rows in an ordered window partition, facilitating delta and growth calculations.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In dimensional data modeling, how does a 'Slowly Changing Dimension Type 2' (SCD Type 2) track historical changes to customer records?",
      options: [
        "By inserting a new record with a new surrogate key, valid start date, end date, and current flag, preserving complete historical audit trails",
        "By overwriting the old address in place without saving history",
        "By deleting the customer account",
        "By adding 10 new columns to the fact table"
      ],
      correct_option_index: 0,
      explanation: "SCD Type 2 maintains historical accuracy by adding new versioned records with effective date timestamps and current row indicators.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In PostgreSQL and relational query engines, what is Multi-Version Concurrency Control (MVCC) and what concurrency benefit does it provide?",
      options: [
        "It requires all users to take turns running queries one at a time",
        "It creates duplicate databases on multiple servers",
        "Readers do not block writers and writers do not block readers; each transaction views a consistent snapshot of data based on row version timestamps (xmin/xmax)",
        "It converts SQL into Python"
      ],
      correct_option_index: 2,
      explanation: "MVCC maintains multiple physical row versions, allowing concurrent read transactions without acquiring exclusive write locks.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In SQL, what is the role of a Recursive Common Table Expression (WITH RECURSIVE)?",
      options: [
        "To create infinite loops that crash the server",
        "To format dates into strings",
        "To encrypt passwords",
        "It combines an initial Anchor query with an iterative Recursive query to traverse hierarchical structures, tree nodes, and graph networks"
      ],
      correct_option_index: 3,
      explanation: "Recursive CTEs iteratively process hierarchical data (e.g. employee manager hierarchies, bills of materials) until reaching a base termination condition.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In query optimization, under what dataset conditions will a Cost-Based Optimizer (CBO) choose a 'Hash Join' algorithm over a 'Nested Loop Join'?",
      options: [
        "When both tables have fewer than 5 rows",
        "When joining large, unsorted datasets without existing indexes on the join keys; the engine builds an in-memory hash table on the smaller relation and probes it with the larger relation in O(N+M) time",
        "When running queries on mobile phones",
        "When tables contain only text columns"
      ],
      correct_option_index: 1,
      explanation: "Hash joins excel at joining substantial unindexed tables by constructing in-memory hash buckets, achieving linear O(N+M) scan performance.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "What formal condition defines Boyce-Codd Normal Form (BCNF) and distinguishes it from standard Third Normal Form (3NF)?",
      options: [
        "BCNF allows repeating arrays in columns",
        "BCNF requires all primary keys to be integers",
        "In BCNF, for every non-trivial functional dependency X -> Y, the determinant X MUST be a superkey (eliminating redundancies where candidate keys overlap)",
        "BCNF prohibits foreign keys"
      ],
      correct_option_index: 2,
      explanation: "BCNF strictly requires the determinant of every functional dependency to be a superkey, resolving edge cases where candidate keys overlap.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In relational storage engines, what is a 'Generalized Inverted Index' (GIN) and what query patterns is it optimized to accelerate?",
      options: [
        "An inverted index mapping component values to posting lists of row IDs; optimized for JSONB containment (@>), full-text search (tsvector), and array intersection queries",
        "An index that stores photos",
        "A tool for sorting numbers from high to low",
        "An index that only works on primary keys"
      ],
      correct_option_index: 0,
      explanation: "GIN indexes decompose composite values (JSONB keys, text tokens, array elements) into inverted index posting lists for high-speed containment searches.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In ANSI SQL transaction isolation levels, what concurrency anomaly is permitted under 'Repeatable Read' snapshot isolation that is ONLY eliminated in 'Serializable' isolation?",
      options: [
        "Dirty Reads",
        "Corrupted hard drives",
        "Loss of database backups",
        "Write Skew (where concurrent transactions read overlapping datasets and make disjoint updates that violate multi-record business constraints)"
      ],
      correct_option_index: 3,
      explanation: "Write skew occurs in Repeatable Read when concurrent transactions modify distinct records based on overlapping premise reads; only Serializable prevents this.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "What is the difference between 'ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW' and 'RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW' in SQL window framing when duplicate values exist in the ORDER BY column?",
      options: [
        "ROWS and RANGE are 100% identical in all SQL engines",
        "ROWS frames strictly by physical row offset count, whereas RANGE includes all peer rows sharing identical sort values up to the end of the duplicate group",
        "RANGE only works with dates",
        "ROWS converts numbers to text"
      ],
      correct_option_index: 1,
      explanation: "ROWS computes over exact physical row counts; RANGE groups duplicate sort values as identical peers within the running window calculation.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #53.");
  console.log("Skill #53 update completed successfully!");
}

run();
