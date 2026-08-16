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

const skillId = "81ff508d-417e-41a1-8d1d-4a35abd7ad0b";

async function run() {
  console.log("Updating Skill #67: Data Visualization (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Visual Perception Theory, Gestalt Laws and Tufte Principles" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: The Grammar of Graphics and Chart Selection Taxonomy" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Executive Dashboards, Color Systems and Interactive UX" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Principal Visualization Architect & Tufte level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Preattentive Processing and Visual Channel Effectiveness",
      order_index: 1,
      content: `### Visual Encoding Hierarchy and Human Perception Science

1. Preattentive Visual Attributes:
   - Visual properties processed automatically and unconsciously by the human visual cortex in under 200ms: Spatial Position, Length, Width, Orientation, Size, Enclosure, Color Hue, and Color Intensity.

2. Cleveland & McGill Perceptual Accuracy Hierarchy (1984):
   - Ranks quantitative visual decoding precision from most accurate to least accurate:
     1. Position along a common scale (scatter plots, aligned bar charts).
     2. Position along non-aligned scales.
     3. Length (bar charts).
     4. Direction / Slope (line charts).
     5. Angle (pie charts; difficult for human perception to decode precisely).
     6. Area (bubble charts, treemaps).
     7. Volume and 3D curvature.
     8. Color Saturation and Luminance.`
    },
    {
      track_id: track1Id,
      title: "Gestalt Principles of Visual Perception in Interface Design",
      order_index: 2,
      content: `### Cognitive Grouping Laws and Layout Architecture

1. Core Gestalt Principles Applied to Data Visualization:
   - Proximity: Visual elements positioned closely together are immediately perceived as belonging to the same functional group or entity.
   - Similarity: Elements sharing identical visual channels (e.g. color hue, geometric shape, or font weight) are perceived as sharing common category traits.
   - Enclosure: Drawing a subtle border or background card container around visual elements creates an instantaneous boundary grouping them together.
   - Connection: Physical lines explicitly connecting data points override proximity and similarity, forming perceived relational sequences.
   - Continuity: The human visual system naturally prioritizes smooth continuous paths over abrupt angular directional changes.`
    },
    {
      track_id: track1Id,
      title: "Edward Tufte Principles: Data-Ink Ratio and Lie Factor",
      order_index: 3,
      content: `### Information Density, Chartjunk Elimination and Graphical Integrity

1. The Data-Ink Ratio (Edward Tufte, 1983):
   - Data-Ink Ratio = (Data-Ink) / (Total Ink used in graphic).
   - Core Maxim: Maximize data-ink and aggressively eliminate non-data ink (chartjunk: heavy decorative 3D effects, moire background textures, redundant borders, distracting gridlines, and duplicate numerical labels).

2. The Lie Factor:
   - Lie Factor = (Size of effect shown in graphic) / (Size of effect in actual data).
   - A Lie Factor significantly differing from 1.0 violates graphical integrity (e.g. truncating the y-axis baseline on bar charts or scaling 2D areas proportionally to 1D linear values).

3. Small Multiples:
   - Arranging a matrix of identical charts sharing identical scales across different data dimensions, enabling effortless comparative visual scanning.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Leland Wilkinson Grammar of Graphics and Layered Abstraction",
      order_index: 1,
      content: `### Formal Theoretical Foundations of Data Graphics

1. The Grammar of Graphics (Wilkinson, 2005):
   - Replaces fixed chart taxonomies with a formal compositional pipeline of 7 independent structural layers:
     - Data: The underlying dataset variables.
     - Aesthetics: Mapping data fields to visual channels (x, y, color, size, shape).
     - Geometries: Geometric objects representing data (points, lines, bars, polygons).
     - Statistics: Statistical transformations (binning, smoothing, linear regression fits).
     - Scales: Mapping data space to visual range (linear, logarithmic, square root, discrete).
     - Coordinates: The physical coordinate system (Cartesian, Polar, Geographic).
     - Facets: Splitting data into small multiple subplot matrices.

2. Modern Implementations:
   - ggplot2 in R, Vega-Lite declarative JSON specifications, Altair, and Plotly graph engines.`
    },
    {
      track_id: track2Id,
      title: "Chart Selection Framework: Distribution, Composition and Correlation",
      order_index: 2,
      content: `### Scientific Chart Selection Matrix and Encoding Rules

1. Distribution Visualizations:
   - Histograms: Continuous numerical data binned into intervals (bin count optimized via Freedman-Diaconis rule).
   - Box Plots: Visualizing five-number summaries (Min, Q1, Median, Q3, Max) and individual outlier points.
   - Violin Plots: Merges box plot summary statistics with Kernel Density Estimation (KDE) curves.

2. Correlation and Multivariable Visualizations:
   - Scatter Plots: Two continuous variables with optional trendlines.
   - Hexbin Plots: Bins dense overlapping points into regular hexagons to reveal true density distributions.
   - Correlation Heatmaps: Matrices utilizing diverging color palettes with annotated correlation values.

3. Part-to-Whole and Hierarchical Visualizations:
   - 100% Stacked Bar Charts vs Treemaps (nested rectangles proportional to values).
   - Avoid multi-slice pie/donut charts (>4 slices) due to human angle decoding limitations.`
    },
    {
      track_id: track2Id,
      title: "Time-Series, Geospatial and Flow Visualizations",
      order_index: 3,
      content: `### Temporal Dynamics, Spatial Maps and Flow Networks

1. Temporal Visualizations:
   - Continuous Line Charts: Aspect ratio optimized by banking to 45 degrees (Cleveland).
   - Slope Charts: Compares changes between two discrete time points across multiple categories.
   - Sparklines (Tufte): High-density, word-sized inline trendlines embedded directly inside tabular reports.

2. Geospatial Visualizations:
   - Choropleth Maps: Shading geographic regions by metric; must be normalized by population/density to prevent large unpopulated geographic landmasses from distorting perception.
   - Proportional Symbol Maps: Places scaled circles at specific coordinate points.

3. Flow and Funnel Visualizations:
   - Sankey Diagrams: Visualizes multi-stage conversion funnels, resource flows, and user journey transitions with proportional flow ribbon widths.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Color Theory: Sequential, Diverging, Categorical and Accessibility",
      order_index: 1,
      content: `### Palette Engineering, Perceptual Uniformity and WCAG Standards

1. Color Palette Typologies:
   - Categorical Palettes: Distinct hues with identical perceptual luminance for unordered qualitative data.
   - Sequential Palettes: Monochromatic gradients varying smoothly in lightness to encode ordered numeric ranges.
   - Diverging Palettes: Two contrasting hues diverging from a neutral central midpoint to highlight deviations from a meaningful baseline (e.g. Red-White-Blue for profit vs loss).

2. Perceptually Uniform Palettes (Viridis, Plasma, Magma):
   - Mathematically constructed so that steps in data values correspond to uniform steps in human perceived brightness, eliminating false visual artifacts and preserving full readability in greyscale.

3. Accessibility and WCAG Standards:
   - Enforcing minimum 4.5:1 contrast ratios between text/marks and backgrounds; testing palettes against Deuteranopia and Protanopia color vision deficiencies.`
    },
    {
      track_id: track3Id,
      title: "BI Calculations: Tableau LOD Expressions and Power BI DAX",
      order_index: 2,
      content: `### Enterprise Analytical Calculation Engines

1. Tableau Level of Detail (LOD) Expressions:
   - \`FIXED\`: Computes an aggregate at specific declared dimensions, completely independent of the dashboard visual filter context:
     \`{FIXED [Customer ID] : MIN([Order Date])}\`
   - \`INCLUDE\` / \`EXCLUDE\`: Dynamically incorporates or omits specific dimensions relative to the visualization level of detail.

2. Power BI DAX (Data Analysis Expressions):
   - Measures vs Calculated Columns:
     - Measures: Dynamic calculations evaluated at query execution time within the active visual filter context (e.g. \`Total_Sales = CALCULATE(SUM(Sales[Amount]), ALL(Sales[Region]))\`).
     - Calculated Columns: Static row-level attributes computed once during data ingestion and stored in memory.`
    },
    {
      track_id: track3Id,
      title: "Executive Dashboard Architecture and Narrative Storytelling",
      order_index: 3,
      content: `### Information Hierarchy, Cognitive Load and Visual Storytelling

1. The Inverted Pyramid Information Hierarchy:
   - Top Layer: High-level Single Value Indicator Cards (KPIs: Revenue, Growth, Churn Rate).
   - Middle Layer: High-impact analytical trends and comparisons (Line charts, Grouped bar charts).
   - Bottom Layer: Granular tabular details and transaction lookup grids for drill-down analysis.

2. Cognitive Load Minimization:
   - Restrict a single dashboard view to 4 to 6 focused visual tiles.
   - Eliminate non-essential decorative elements and redundant legends.

3. Interactive Filtering and Context:
   - Cross-filtering: Clicking a bar or scatter point dynamically updates all adjacent dashboard tiles.
   - Direct In-Chart Annotations: Explaining anomalous spikes, marketing launches, or outage events directly on the visual trendline to provide instant narrative context.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #67.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "According to the Cleveland & McGill perceptual accuracy hierarchy (1984), what visual encoding channel is decoded most accurately by the human visual system for quantitative data?",
      options: [
        "Position along a common scale (e.g. aligned bar charts, scatter plots)",
        "Color saturation",
        "Volume of 3D objects",
        "Angle of pie slices"
      ],
      correct_option_index: 0,
      explanation: "Position along a common scale is decoded with the highest mathematical accuracy by the human visual cortex.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In Edward Tufte's principles of data visualization, what is the 'Data-Ink Ratio'?",
      options: [
        "The price of printer ink per page",
        "The number of colors used in a chart",
        "The proportion of total ink in a graphic dedicated to displaying actual data information (Data-Ink / Total Ink)",
        "The file size of an image in megabytes"
      ],
      correct_option_index: 2,
      explanation: "The Data-Ink Ratio measures the proportion of ink that presents non-redundant data, which should be maximized by removing chartjunk.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In Leland Wilkinson's 'Grammar of Graphics', what structural layer maps data variables to visual channels such as position (x, y), color, size, and shape?",
      options: [
        "Facets",
        "Aesthetics (Aesthetic Mappings)",
        "Coordinates",
        "Themes"
      ],
      correct_option_index: 1,
      explanation: "Aesthetics define the mappings between data columns and visual properties (x, y, color, size, shape).",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "Why are 3D pie charts and multi-slice pie charts (>4 slices) generally discouraged in professional data visualization?",
      options: [
        "Computers cannot render circles",
        "Pie charts only work on black and white monitors",
        "Pie charts are illegal in statistics",
        "Humans struggle to accurately decode and compare angular differences and 2D/3D slice areas, often misinterpreting relative category proportions"
      ],
      correct_option_index: 3,
      explanation: "Humans evaluate angles and 3D perspectives poorly compared to linear length; bar charts communicate proportions far more accurately.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What type of color palette is scientifically designed to highlight deviations in two opposite directions from a neutral baseline (e.g. positive profit vs negative loss)?",
      options: [
        "Diverging Palette (two contrasting hues diverging from a central neutral midpoint)",
        "Categorical Palette",
        "Monochrome black",
        "Random rainbow palette"
      ],
      correct_option_index: 0,
      explanation: "Diverging palettes use two distinct hues that meet at a neutral center, ideal for values with a meaningful midpoint like zero.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In Tableau, what does a FIXED Level of Detail (LOD) expression achieve (e.g. {FIXED [Customer ID] : MIN([Order Date])})?",
      options: [
        "It fixes bugs in the Tableau software",
        "It deletes all customer records",
        "It changes the font size to fixed width",
        "It computes the aggregation at the exact specified dimension grain (Customer ID), completely independent of what filters or dimensions are present in the visualization view"
      ],
      correct_option_index: 3,
      explanation: "FIXED LOD expressions compute aggregates at specific declared dimensions, breaking out of the dashboard view filter context.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Edward Tufte's data visualization principles, what is the 'Lie Factor' and what value represents graphical integrity?",
      options: [
        "Lie Factor = Number of words / Number of numbers; integrity = 0",
        "Lie Factor = (Size of effect shown in graphic) / (Size of effect in actual data); perfect integrity = 1.0",
        "Lie Factor = Number of lines / Number of columns; integrity = 100",
        "Lie Factor = Time to load chart; integrity = 0.5"
      ],
      correct_option_index: 1,
      explanation: "The Lie Factor compares graphical effect size to data effect size; a ratio of 1.0 indicates accurate representation without distortion.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In geospatial data visualization, why must Choropleth Maps (shading geographic regions by a metric) be normalized by population or area?",
      options: [
        "Raw counts cause large geographic landmasses with low populations (e.g. Alaska or Montana) to visually dominate the map, distorting the actual per-capita reality",
        "Choropleth maps cannot display raw numbers",
        "Population data cannot be stored in databases",
        "Un-normalized maps crash web browsers"
      ],
      correct_option_index: 0,
      explanation: "Choropleths of raw counts reflect land area rather than population density; normalizing per capita ensures accurate visual comparison.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In color science, why are 'Perceptually Uniform' colormaps (such as Viridis, Plasma, and Magma) superior to traditional Rainbow/Jet palettes?",
      options: [
        "They use less computer memory",
        "They only contain 2 colors",
        "Their perceived lightness changes monotonically and linearly with data values, eliminating false boundary artifacts and remaining fully readable for colorblind viewers and in greyscale printing",
        "They make charts render 10 times faster"
      ],
      correct_option_index: 2,
      explanation: "Perceptually uniform palettes feature monotonic luminance gradients, preventing visual distortion and ensuring accessibility across color vision types.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In Power BI DAX modeling, what is the fundamental operational difference between a 'Measure' and a 'Calculated Column'?",
      options: [
        "Measures are written in Python; Calculated Columns are written in SQL",
        "Calculated columns cannot calculate sums",
        "Measures only run on mobile phones",
        "Measures are dynamic calculations evaluated at query time in the visual filter context, whereas Calculated Columns are static row-level values computed during data refresh and stored in memory"
      ],
      correct_option_index: 3,
      explanation: "Measures compute aggregates dynamically based on user slicers and filter contexts, while calculated columns compute static values row-by-row.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In visual perception and UI design, how does the Gestalt principle of 'Enclosure' function in dashboard layout design?",
      options: [
        "By closing all open browser tabs",
        "Drawing a subtle border, container card, or background shading around a cluster of related visual cards creates an immediate, powerful cognitive grouping that overrides proximity",
        "Deleting all whitespace between charts",
        "Locking dashboard filters with a password"
      ],
      correct_option_index: 1,
      explanation: "Enclosure visually bounds elements with background cards or borders, establishing an instant cognitive grouping that overrules spatial distance.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In multivariable exploratory visualization, what is a 'Hexbin Plot' and when should it be chosen over a standard Scatter Plot?",
      options: [
        "A plot that only works on 6-sided numbers",
        "A chart for displaying 3D audio frequencies",
        "It bins 2D spatial points into regular hexagonal tiles and colors tiles by point count, resolving severe overplotting when visualizing hundreds of thousands of dense overlapping scatter points",
        "A pie chart with 6 slices"
      ],
      correct_option_index: 2,
      explanation: "Hexbin plots aggregate overlapping points into hexagonal bins, preventing overplotting from masking dense data clusters in massive datasets.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In time-series visual design, what is William Cleveland's 'Banking to 45 Degrees' principle for line charts?",
      options: [
        "Adjusting the aspect ratio (height-to-width ratio) of a line chart so that the absolute values of the slopes of the line segments center around 45 degrees, maximizing human visual discrimination of slope changes",
        "Rotating the computer monitor by 45 degrees",
        "Only plotting financial banking data",
        "Drawing lines with 45 data points"
      ],
      correct_option_index: 0,
      explanation: "Banking to 45 degrees optimizes chart aspect ratio so average line slopes hover near 45 degrees, maximizing perceptual discrimination of rate changes.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In user journey and flow analytics, what chart geometry visualizes multi-stage transitions and drop-offs across discrete steps with link widths proportional to flow volume?",
      options: [
        "Scatter Plot",
        "Radar Chart",
        "Donut Chart",
        "Sankey Diagram"
      ],
      correct_option_index: 3,
      explanation: "Sankey diagrams represent flows through multi-stage systems with proportional ribbon widths mapping volume between nodes.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In executive dashboard UX architecture, what is the 'Inverted Pyramid' information layout pattern?",
      options: [
        "Placing the largest chart at the bottom",
        "Structuring the view with high-level KPI cards at the top, high-impact analytical trend charts in the middle, and detailed granular lookup grids at the bottom for drill-down investigation",
        "Writing text upside down",
        "Hiding all data behind passwords"
      ],
      correct_option_index: 1,
      explanation: "The inverted pyramid pattern places top-level summary KPIs at the peak, followed by contextual trend graphs, and granular tabular records below.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #67.");
  console.log("Skill #67 update completed successfully!");
}

run();
