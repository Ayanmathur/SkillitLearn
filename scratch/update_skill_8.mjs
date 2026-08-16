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

const skillId = "03ad1708-b713-4d0c-be56-64148c93eee2";

async function run() {
  console.log("Updating Skill #8: CAD for Architecture (9 steps across 3 tracks)...");

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

  // If more than 3 tracks, delete extra tracks
  if (tracks.length > 3) {
    const extraTrackIds = tracks.slice(3).map((t) => t.id);
    await supabase.from("steps").delete().in("track_id", extraTrackIds);
    await supabase.from("tracks").delete().in("id", extraTrackIds);
    tracks = tracks.slice(0, 3);
  }

  // Ensure exactly 3 tracks exist
  while (tracks.length < 3) {
    const { data: newTrack } = await supabase
      .from("tracks")
      .insert({
        skill_id: skillId,
        title: `Track ${tracks.length + 1}: CAD Architecture`,
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
  await supabase.from("tracks").update({ title: "Track 1: CAD Geometry Engine, Precision Snapping and Layer Standards" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Dynamic Blocks, Attributes, Xrefs and Annotative Scaling" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Layout Viewports, Sheet Set Manager and Publishing" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Cartesian & Polar Coordinate Systems and Vector Transformation",
      order_index: 1,
      content: `### Vector Geometry Engines in Computer-Aided Design

Computer-Aided Design (CAD) engines represent architectural geometry through double-precision 64-bit floating point vector math. All spatial entities are referenced to Euclidean coordinate systems:

1. World Coordinate System (WCS) vs User Coordinate System (UCS):
   - WCS: The permanent, global Cartesian reference origin (0,0,0) with fixed X, Y, and Z axes.
   - UCS: A movable, user-defined local Cartesian coordinate system. Drafters rotate and align the UCS to angled property lot lines, non-orthogonal building wings, or 3D inclined roof planes (using commands such as UCS 3-Point or UCS Object), simplifying drafting without rotating global site geometry.

2. Coordinate Entry Modes:
   - Absolute Coordinates (\`X,Y\`): Referenced directly to the (0,0) origin (e.g. \`1500,2400\`).
   - Relative Coordinates (\`@X,Y\`): Referenced to the last entered vertex point (e.g. \`@3000,0\` draws a 3000 mm horizontal segment).
   - Relative Polar Coordinates (\`@Distance<Angle\`): Defines length and vector trajectory angle relative to the positive X-axis (e.g. \`@25'<45\` draws a 25-foot line at a 45-degree angle).

3. Precision Geometric Constraints and Object Snaps (OSNAP):
   - Mathematical Snapping Modes: Endpoint, Midpoint, Center, Geometric Center (centroid of closed polylines), Node, Quadrant, Intersection, Apparent Intersection, Perpendicular, and Tangent.
   - Polar Tracking and Object Snap Tracking (O-TRACK): Emits dynamic alignment vector rays from designated snap points at user-configured angle increments (e.g. 15, 30, 45, 90 degrees), allowing precise non-contact alignment points to be established in space without drawing temporary construction lines.`
    },
    {
      track_id: track1Id,
      title: "Vector Geometry Construction, Polylines and Modification Commands",
      order_index: 2,
      content: `### Lightweight Polylines (LWPOLYLINE) and Complex Vector Topology

In architectural CAD, drawing continuous elements using fragmented lines causes severe database bloat and prevents automated area calculations. Professional drafting relies on Lightweight Polylines (LWPOLYLINE):
- Continuous 2D chains composed of straight line segments and true circular arc segments.
- Properties: Continuous constant or tapering segment width, vertex elevation, and closed boundary area.
- Polyline Operations:
  - \`PEDIT\` (Polyline Edit): Joins fragmented co-planar lines and arcs into a single continuous boundary with a tolerance fuzz distance.
  - \`BOUNDARY\` / \`HATCH\`: Uses ray-casting flood algorithms to automatically trace internal void boundaries, generating a closed polyline or region for instant square footage calculation.

### High-Precision Geometric Modification Commands

1. Precision Offset (\`OFFSET\`):
   - Offsets lines, polylines, or circles by an exact perpendicular distance. Used to generate parallel wall cavity faces, continuous footing offsets, and roadway curb alignments.
2. Fillet and Chamfer (\`FILLET\` / \`CHAMFER\`):
   - Applying Fillet with Radius = 0 (\`F -> R -> 0\`) instantaneously cleans, trims, and closes non-intersecting or overlapping line corners into perfect 90-degree corners.
3. Trim and Extend (\`TRIM\` / \`EXTEND\`):
   - Modern CAD utilizes implied crossing window selection to trim or extend entities to nearest boundaries without requiring manual cutting edge pre-selection.
4. Associative Arrays (\`ARRAY\`):
   - Rectangular Arrays (columns and rows with associative spacing parameters).
   - Polar Arrays (rotates items around a central axis with full 360-degree fill or specified angle).
   - Path Arrays (distributes items at exact uniform spacing intervals along irregular non-linear splines).`
    },
    {
      track_id: track1Id,
      title: "Layer Management, Color-Dependent Plotting (CTB) and Standards",
      order_index: 3,
      content: `### Architectural Layer Management and National CAD Standards

Layers are the primary organizational tool in CAD, separating building systems into logical graphic overlays. Compliance with the U.S. National CAD Standard (NCS) / AIA Layer Guidelines is mandatory for multi-disciplinary architecture and engineering sets:

\`\`\`
[Discipline Code] - [Major Group] - [Minor Group] - [Status / Phase]
\`\`\`

- Discipline Codes: A (Architectural), C (Civil), S (Structural), M (Mechanical), P (Plumbing), E (Electrical), L (Landscape), G (General).
- Examples:
  - \`A-WALL-FULL\`: Architectural - Wall - Full Height
  - \`A-DOOR-IDEN\`: Architectural - Door - Identification Tags
  - \`S-FNDN-FTNG\`: Structural - Foundation - Footings
  - \`M-HVAC-DUCT\`: Mechanical - HVAC - Ductwork

### Layer States and Graphic Overrides

- Properties ByLayer (\`BYLAYER\`): All entity colors, linetypes, lineweights, and plot transparency should be set to \`BYLAYER\`. Assigning hardcoded colors directly to individual lines breaks team standards and causes plot errors.
- Freeze vs Lock vs Off:
  - Off: Hides objects visually, but entities are still calculated during database regenerations (\`REGEN\`).
  - Freeze: Completely removes layer entities from memory calculation, accelerating pan/zoom performance in massive drawings.
  - Lock: Keeps entities visible for reference and object snapping, while preventing accidental editing, moving, or deletion.

### Color-Dependent Plot Style Tables (CTB Architecture)

Traditional architectural plotting maps CAD screen colors (AutoCAD Color Index - ACI 1 to 255) to specific printed lineweights on paper:
- Color 1 (Red): 0.18 mm (Ultra-fine: material hatches, tile patterns).
- Color 2 (Yellow): 0.25 mm (Light: dimension strings, centerlines, leader text).
- Color 3 (Green): 0.35 mm (Medium: interior partition lines, casework, door swings).
- Color 4 (Cyan): 0.50 mm (Heavy: primary exterior wall boundaries, structural cuts).
- Color 5 (Blue): 0.60 mm (Extra-Heavy: column outlines, major section cuts).
- Color 7 (White / Black): 0.70 mm to 1.00 mm (Profile lines, property boundary lines).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Dynamic Blocks, Attributes and Parametric Geometric Constraints",
      order_index: 1,
      content: `### Architecture of Dynamic Blocks

Standard static blocks (\`BLOCK\`) group geometry into reusable symbols, but require separate block definitions for every size variation. Dynamic Blocks integrate parameters and actions to create intelligent, multi-state architectural components:

1. Parameter and Action Sets:
   - Linear Parameter + Stretch Action: Allows a single window block to stretch smoothly to any width while maintaining fixed frame profile dimensions.
   - Polar Parameter + Polar Stretch Action: Rotates and stretches elements simultaneously.
   - Alignment Parameter: Automatically snaps and aligns the block perpendicular or parallel to any wall edge upon insertion without manual rotation.

2. Visibility States:
   - Embeds multiple graphic variations inside a single block file.
   - Example: A single Dynamic Door Block containing visibility states for 30", 32", 36", and 42" widths, with toggleable 45-degree, 90-degree, and 180-degree door swing arcs.

### Block Attribute Definitions (ATTDEF)

Attributes embed dynamic textual and non-graphical database metadata inside blocks:
- Attribute Tags: Invisible or visible text placeholders (e.g. \`DOOR_NUMBER\`, \`FIRE_RATING\`, \`MANUFACTURER\`, \`HARDWARE_SET\`).
- Data Extraction Wizard (\`DATAEXTRACTION\`): Scans hundreds of block instances across a drawing set and compiles an automated, linked tabular schedule (Door Schedule, Window Schedule, Hardware Schedule) exported directly into CAD tables or Microsoft Excel (.xlsx) spreadsheets.

### Geometric and Dimensional Parametric Constraints

Parametric CAD links geometric entities with dynamic mathematical relationships:
- Geometric Constraints: Coincident (locking points together), Collinear, Concentric, Parallel, Perpendicular, Tangent, and Horizontal/Vertical.
- Dimensional Constraints: Constrains distances and angles with algebraic formulas (e.g. \`Length = Width * 1.618\` or \`Spacing = (Total_Length - 200) / 4\`). Modifying a single master dimension automatically resizes all related geometry.`
    },
    {
      track_id: track2Id,
      title: "External Reference (Xref) Management and Collaboration",
      order_index: 2,
      content: `### Collaborative CAD Architecture via External References (Xrefs)

In professional architectural practice, separate team members work simultaneously on floor plans, structural framing, HVAC ductwork, and electrical layouts. External References (\`XREF\`) dynamically link external DWG files into a host drawing without embedding the physical geometry into the host database:

### Xref Overlay vs Xref Attachment (Critical Distinction)

1. Xref Attachment:
   - When Drawing B attaches Drawing A, and Drawing C subsequently attaches Drawing B, Drawing A is automatically loaded into Drawing C as a nested reference.
   - Risk: In large multi-disciplinary teams, attachments cause circular reference dependency loops (A references B, B references A) that crash CAD sessions.
2. Xref Overlay (Industry Best Practice):
   - Nested references are ignored. When Drawing C references Drawing B, Drawing A does not load. Prevents accidental nested clutter and circular loops.

### Xref Path Types and Cloud Server Protocols

- Relative Path (\`..\\Base_Plans\\Floor_1.dwg\`): References the target file relative to the host drawing folder. Mandatory for projects hosted on local area network (LAN) servers or cloud platforms (Autodesk Construction Cloud / BIM 360) so file links do not break when mapped drives change.
- Absolute (Full) Path (\`D:\\Projects\\Project_A\\Floor_1.dwg\`): Hardcodes exact drive letters. Breaks immediately when opened on another team member's computer.

### Performance Optimization and Xref Tools

- In-Place Reference Editing (\`REFEDIT\` / \`XOPEN\`): Allows direct editing of referenced geometry from within the host file.
- Xref Clipping (\`XCLIP\`): Defines polygonal clipping boundaries to display only a specific building quadrant or enlarged suite without loading unnecessary geometry.
- Demand Loading and Spatial Indexing: Enables CAD to load only the specific clipped layers and spatial quadrants into RAM, accelerating file opening times by 80%+ on massive master plans.`
    },
    {
      track_id: track2Id,
      title: "Annotative Scaling, Multileaders and Text Standards",
      order_index: 3,
      content: `### The Annotative Property Architecture

Historically, CAD drafters had to calculate reciprocal scale factors manually to scale text, dimensions, and callout tags (e.g. drafting text at 4.5 inches high in Model Space so it would print at 3/32 inch on a 1/48 scale plan).
The Annotative Property eliminates this entirely by automating text scaling across viewports:

### How Annotative Objects Operate

- An entity (Text, MText, Dimension, Multileader, Hatch) is assigned the \`Annotative = Yes\` property, and a Target Paper Height is specified (e.g. 3/32" / 2.4 mm).
- The drafter assigns supported Annotation Scales to the object (e.g. 1/8" = 1'-0", 1/4" = 1'-0", 1/2" = 1'-0").
- In Model Space or Layout Viewports, the CAD engine automatically calculates the required display magnification based on the current active viewport scale. On the printed physical paper sheet, all annotative text prints at the exact target paper height (3/32") regardless of whether the viewport is scaled at 1/8" or 1/2".

### Multileader Styles (MLEADERSTYLE)

Multileaders unify leader lines, landing shoulders, and annotation callouts into a single parametric object:
- Leader Line Types: Straight vector lines or smooth Bezier splines.
- Landing Distance: Standardized horizontal landing shoulder (typically 1/8" or 3 mm).
- Leader Line Breaks: Automatically breaks leader lines around dimension text and crossing linework without destroying vector continuity.
- Content Types: MText paragraphs or integrated attribute callout blocks (hexagons for room tags, circles for detail numbers).`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Model Space vs Paper Space Layouts and Viewport Controls",
      order_index: 1,
      content: `### Dual-Space Drafting Philosophy

Professional CAD operations operate strictly across two distinct computational environments:
1. Model Space (Tilemode = 1):
   - An infinite, unconstrained 3D digital workspace where all building geometry is drawn at 1:1 Full Scale (1 unit = 1 inch or 1 millimeter). A 100-foot wall is drafted at exactly 100 feet.
2. Paper Space Layouts (Tilemode = 0):
   - A 2D virtual drawing sheet representation (e.g. 24x36 inch ARCH D sheet) simulating the physical printed page at 1:1 Paper Scale (1 unit = 1 inch on paper).

### Floating Layout Viewports (MVIEW / VP)

Layout viewports act as transparent visual windows cut through the paper sheet looking into Model Space:
- Viewport Scale Synchronization: Viewport scale must be locked to standard architectural scales (e.g. 1/4" = 1'-0" / Scale Factor = 1/48XP).
- Viewport Locking: Once scaled and framed, the viewport Display Locked property must be set to \`Yes\` to prevent accidental zooming or panning from altering the architectural scale.

### Viewport-Specific Layer Overrides (VP Overrides)

Paper space viewports permit independent visual formatting of layers without altering global Model Space properties:
- VP Freeze (\`VPLAYER Freeze\`): Hides specific layers in one viewport while keeping them visible in adjacent viewports on the same sheet (e.g. displaying demolition walls on the Demolition Plan viewport while freezing them on the New Construction Plan viewport).
- VP Color / VP Lineweight Overrides: Displays structural column grids in light gray (halftone) on architectural finish plans, but in bold black on structural framing sheets.`
    },
    {
      track_id: track3Id,
      title: "CAD Sheet Set Manager (SSM) and Automated Indexing",
      order_index: 2,
      content: `### Enterprise Project Coordination with Sheet Set Manager (SSM)

On large commercial projects involving 50 to 500+ drawing sheets distributed across dozens of separate DWG files, managing drawing sheets manually causes numbering mismatches and broken cross-references. The Sheet Set Manager (SSM / .dst database) centralizes project management:

### Core Sheet Set Architecture

1. Sheet Set Tree Structure:
   - Organizes drawing sheets into standardized multi-disciplinary subsets (General, Civil, Architectural, Structural, MEP).
2. Automated Dynamic Text Fields (\`FIELD\`):
   - Dynamic metadata links embedded in sheet title blocks and callout tags that automatically pull live data from the Sheet Set database:
     - \`SheetNumber\`: Automatically numbers sheets sequentially (e.g. A101, A102).
     - \`SheetTitle\`: Displays the formal drawing title.
     - \`CurrentSheetCustomProjectName\`: Project name.
     - \`SheetSetTotalSheets\`: Calculates total project sheet count.
3. Automated Sheet Index Generation:
   - Inserts an automated tabular Drawing Index on the project cover sheet (Sheet G001). If sheets are added, deleted, or reordered in the SSM tree, the sheet index table updates instantly with a single refresh command.

### Cross-Referencing Callouts via SSM

When placing section callouts, the callout bubble is linked directly to the target view in the Sheet Set. If the detail is moved from Sheet A501 to Sheet A503, the callout bubble text on the floor plan automatically updates from \`3 / A501\` to \`3 / A503\`, eliminating manual coordination errors.`
    },
    {
      track_id: track3Id,
      title: "Batch Publishing, PDF Vector Exports and CAD Database Hygiene",
      order_index: 3,
      content: `### High-Efficiency Batch Publishing

Exporting multi-sheet construction document deliverables is automated using Batch Publish (\`PUBLISH\`):
- Multi-Sheet Vector PDF Creation: Plots all 100+ sheets in a Sheet Set to a single combined PDF in the background.
- Vector Text Layers: Maintains TrueType and SHX font searchable vector text layers within the PDF, enabling instant text searching (Ctrl+F) for contractors and plan review officials.
- Layer Information: Preserves CAD layer hierarchy in the PDF, allowing reviewers to toggle discipline layers on and off directly in Adobe Acrobat or Bluebeam Revu.

### CAD Database Hygiene and Performance Optimization

Over time, CAD DWG databases accumulate corrupt entities, bloated registered applications, and orphaned definitions. Routine maintenance commands are mandatory:

1. \`PURGE\` & \`-PURGE Regapps\`:
   - Deletes unused block definitions, layer filters, dimension styles, and registered application ID bloat that secretly inflates DWG file sizes from 2 MB to 50+ MB.
2. \`AUDIT\` & \`RECOVER\`:
   - Scans the internal entity database structure, fixing corrupted pointers, repairing invalid vector tables, and eliminating fatal crash errors.
3. \`OVERKILL\`:
   - Scans the drawing to delete duplicate overlapping vector geometry, merges collinear line segments into single continuous lines, and optimizes drawing file performance.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #8.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "What drafting scale is universally applied to Model Space in architectural CAD software?",
      options: [
        "1/4\" = 1'-0\" (1:48 scale)",
        "1:1 Full Scale (all geometry drawn at actual real-world physical dimensions)",
        "1/8\" = 1'-0\" (1:96 scale)",
        "1:100 Metric scale"
      ],
      correct_option_index: 1,
      explanation: "Model Space is an unconstrained digital workspace where all architectural geometry is drawn at 1:1 full real-world scale (1 unit = 1 inch or 1 millimeter).",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In architectural CAD layer management, why is setting entity color, linetype, and lineweight properties to 'BYLAYER' considered mandatory standard practice?",
      options: [
        "It locks all lines so they cannot be deleted",
        "It converts 2D drawings into 3D models automatically",
        "It cuts electrical power consumption of the computer monitor",
        "It ensures global layer property changes update all entities simultaneously, maintaining strict drawing standards across large project teams"
      ],
      correct_option_index: 3,
      explanation: "Using BYLAYER ensures that modifying a layer's color or lineweight updates all associated entities automatically, preventing hardcoded inconsistencies.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What CAD feature automates text, dimension, and multileader scaling so that annotations print at the exact same target height (e.g. 3/32 inch) across viewports of different scales?",
      options: [
        "Annotative Scaling",
        "Linear Array",
        "Dynamic Blocks",
        "Object Snap Tracking"
      ],
      correct_option_index: 0,
      explanation: "Annotative scaling automatically adjusts annotation display size in viewports based on the active viewport scale, ensuring uniform printed text height.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "Under Color-Dependent Plot Style Tables (CTB), what printed lineweight on paper is typically mapped to CAD Color 1 (Red)?",
      options: [
        "1.00 mm (Extra-Heavy Profile Line)",
        "0.70 mm (Heavy Structural Line)",
        "0.18 mm (Fine / Thin Line for material hatching and patterns)",
        "0.50 mm (Medium-Heavy Boundary Line)"
      ],
      correct_option_index: 2,
      explanation: "In standard architectural CTB plot style tables, Color 1 (Red) maps to a fine 0.18 mm pen weight, ideal for material hatch patterns and tile grids.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What modification command allows a drafter to clean, trim, and close two non-intersecting lines into a perfect 90-degree corner in a single operation?",
      options: [
        "OFFSET with distance 10",
        "FILLET with Radius = 0",
        "SCALE with factor 1.0",
        "EXPLODE"
      ],
      correct_option_index: 1,
      explanation: "Executing FILLET with Radius set to 0 (F -> R -> 0) instantly trims or extends two lines to form a sharp, clean intersection corner.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In multi-disciplinary collaborative CAD workflows, why is referencing external files via 'Xref Overlay' preferred over 'Xref Attachment'?",
      options: [
        "Overlay reduces file sizes to zero bytes",
        "Attachment converts all text into foreign languages",
        "Overlay prevents circular nested reference loops by ignoring nested dependencies when the host file is referenced by another drawing",
        "Overlay automatically prints drawings without human intervention"
      ],
      correct_option_index: 2,
      explanation: "Xref Overlay prevents nested drawings from propagating down subsequent host files, eliminating circular reference loops and drawing bloat.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "What is the primary function of Visibility States inside a Dynamic Block?",
      options: [
        "It embeds multiple graphic variations inside a single block, allowing users to toggle between different sizes and configurations from a drop-down menu",
        "It makes the block invisible on the computer screen while printing in color",
        "It encrypts the block with a password to prevent client access",
        "It calculates the monetary cost of manufacturing the block"
      ],
      correct_option_index: 0,
      explanation: "Visibility States allow a single dynamic block (such as a door) to store multiple graphical configurations (e.g. 30\", 36\" widths, 90-deg swing) selectable via a grip menu.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What is the key functional difference between freezing a layer (Freeze) and turning a layer off (Off) in architectural CAD software?",
      options: [
        "Turning off a layer deletes all contained lines permanently",
        "Freezing a layer changes its color to cyan",
        "There is zero difference between Freeze and Off",
        "Freezing completely removes layer geometry from memory calculations, drastically accelerating zoom/pan performance during database regenerations (REGEN)"
      ],
      correct_option_index: 3,
      explanation: "Turning a layer Off hides it visually while leaving it in memory. Freezing removes the layer entities from RAM calculations entirely, speeding up large drawing performance.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In CAD Sheet Set Manager (.dst), what technology links title block text (such as Sheet Number and Project Name) dynamically to the central sheet set database?",
      options: [
        "Static MText paragraphs",
        "Dynamic Text Fields (FIELD)",
        "Raster JPEG images",
        "HTML hyperlinks"
      ],
      correct_option_index: 1,
      explanation: "Dynamic Text Fields link title block attributes directly to Sheet Set properties, updating sheet numbers and project data across all drawings automatically.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What CAD database hygiene command is utilized to purge hidden registered application ID bloat (-PURGE Regapps) that secretly inflates DWG file sizes?",
      options: [
        "AUDIT",
        "OVERKILL",
        "-PURGE with the 'Regapp' option",
        "WBLOCK"
      ],
      correct_option_index: 2,
      explanation: "Executing '-PURGE' and selecting 'Regapp' removes orphaned registered application tables, which are a major cause of massive file size inflation and slow opening times.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "A drafter sets up an architectural floor plan in a Paper Space Layout viewport on an ARCH D sheet. The drawing must be scaled at 1/4\" = 1'-0\". What is the precise zoom scale factor that must be applied relative to paper space units?",
      options: [
        "1/48XP (or 0.020833XP)",
        "48XP",
        "1/4XP",
        "12XP"
      ],
      correct_option_index: 0,
      explanation: "At 1/4\" = 1'-0\", 1 foot (12 inches) equals 48 quarter-inches. The scale ratio is 1:48. In paper space, the command is ZOOM 1/48XP.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In architectural CAD drafting, how does Viewport Layer Freezing (VPLAYER Freeze / VP Freeze) enable multi-purpose floor plan generation from a single model?",
      options: [
        "It converts all 2D floor plans into 3D walkthroughs",
        "It permanently deletes furniture from the hard drive",
        "It prints all viewports in grayscale",
        "It hides specific layers (such as furniture or demolition walls) exclusively within a selected layout viewport without affecting its visibility in adjacent viewports on the same sheet"
      ],
      correct_option_index: 3,
      explanation: "VP Freeze allows individual viewports to display different discipline layers (e.g. Demolition vs New Construction vs Furniture) from the exact same Model Space geometry.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "When extracting tabular schedule data (such as Door Schedules) from block attributes using the DATAEXTRACTION command, how does CAD maintain bidirectional data associativity?",
      options: [
        "Data extraction is a one-way irreversible process that destroys blocks",
        "Data can be linked to an AutoCAD Data Link table; updates in an external Excel spreadsheet or CAD block attributes can be updated bidirectionally via DATALINKUPDATE",
        "By printing the schedule on transparent mylar film",
        "By converting all attributes into polyline contours"
      ],
      correct_option_index: 1,
      explanation: "AutoCAD Data Links establish live bidirectional synchronization between block attribute extraction tables and external Microsoft Excel (.xlsx) files via DATALINKUPDATE.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "What CAD command scans an entire drawing to eliminate duplicate overlapping lines, merge collinear fragmented line segments, and optimize vector drawing entity order?",
      options: [
        "PURGE",
        "RECOVER",
        "OVERKILL",
        "FLATTEN"
      ],
      correct_option_index: 2,
      explanation: "The OVERKILL command cleans vector geometry by deleting duplicate overlapping lines and arcs, combining partially overlapping collinear lines, and simplifying polylines.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In User Coordinate System (UCS) transformations, what command option allows a drafter to align the X and Y axes instantly to an angled site boundary line or building facade without manually calculating the rotation angle?",
      options: [
        "UCS with the 'Object' or '3-Point' option",
        "UCS 'World'",
        "ROTATE with angle 90",
        "PLAN 'World'"
      ],
      correct_option_index: 0,
      explanation: "The 'UCS Object' or 'UCS 3-Point' command aligns the local coordinate system directly to a selected line or plane, making angled drafting effortless.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #8.");
  console.log("Skill #8 update completed successfully!");
}

run();
