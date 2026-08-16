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

const skillId = "c370894f-d3fe-4867-95c7-76cab920fd29";

async function run() {
  console.log("Updating Skill #6: Architectural Drafting (9 steps)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Orthographic Projection, Lineweight Hierarchy and CAD Standards" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Architectural Working Drawings: Plans, Elevations and Sections" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Construction Details, Schedules and Document Set Integration" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Descriptive Geometry and Multiview Orthographic Projection",
      order_index: 1,
      content: `### Principles of Multiview Orthographic Projection

Architectural drafting translates three-dimensional physical space into precise, two-dimensional geometric projections without perspective distortion. The theoretical foundation is the Glass Box Model:
- The object is suspended inside an imaginary transparent glass cube. The observer's lines of sight (projectors) are mutually parallel and perpendicular (orthogonal) to the projection planes.
- Six Principal Views: Top (Plan), Front Elevation, Right Side Elevation, Left Side Elevation, Rear Elevation, and Bottom/Reflected Plan.

### First-Angle vs Third-Angle Projection Systems

1. Third-Angle Projection (ANSI / US Standard):
   - The projection plane sits between the observer and the object.
   - The Top View is projected directly above the Front View; the Right Side View is projected to the right of the Front View. This is the universal standard for architectural drafting in North America.
2. First-Angle Projection (ISO / European Standard):
   - The object sits between the observer and the projection plane.
   - The Top View is projected below the Front View; the Right Side View is projected to the left of the Front View.

### Lineweight Hierarchy and Vector Linework Standards (ANSI/ASME Y14.2)

Clear visual communication in architectural blueprints relies on a strict hierarchy of lineweights and line styles:
- Extra-Heavy Lines (0.70 mm to 1.00 mm): Used for major structural section cut outlines, building footprint profile borders, and cutting-plane lines.
- Heavy / Object Lines (0.50 mm to 0.60 mm): Used for primary physical boundaries, visible edges of walls, columns, and major building contours cut in floor plans.
- Medium Lines (0.35 mm): Used for secondary interior elements, casework outlines, door swings, and window frames.
- Light / Thin Lines (0.18 mm to 0.25 mm): Used for dimension strings, leader lines, centerlines, section grid lines, material cross-hatch patterns, and tile layout grids.
- Hidden Lines: Thin dashed lines (1/8 inch dash, 1/16 inch gap) representing concealed structural edges, headers above floor plans, or footings below grade.
- Centerlines: Alternating long and short dashes used to locate structural column grid intersections and symmetrical openings.`
    },
    {
      track_id: track1Id,
      title: "Architectural Scales, Dimensioning Systems and Tolerances",
      order_index: 2,
      content: `### Architectural Scaling Systems

Architectural drawings are drawn at standard proportional reduction scales to fit standardized sheet formats while allowing accurate physical measurement via triangular architectural scales:

1. Standard Imperial Architectural Scales:
   - Site Plans: 1" = 20'-0" (1:240) or 1" = 30'-0" (Civil engineering scale).
   - Overall Floor Plans & Exterior Elevations: 1/8" = 1'-0" (1:96) for large commercial projects; 1/4" = 1'-0" (1:48) for standard commercial and residential construction.
   - Enlarged Plans & Interior Elevations: 1/2" = 1'-0" (1:24) or 3/8" = 1'-0" (1:32).
   - Wall Sections & Assembly Details: 3/4" = 1'-0" (1:16) or 1-1/2" = 1'-0" (1:8).
   - Detailed Millwork & Window Jamb Profiles: 3" = 1'-0" (1:4) or Full Size (1:1).

2. Standard Metric Architectural Scales (ISO 5455):
   - Site Plans: 1:500 or 1:200.
   - Floor Plans & Elevations: 1:100 or 1:50.
   - Section Details: 1:20, 1:10, or 1:5.

### Dimensioning Hierarchy and Standards (AIA / National CAD Standard)

Architectural dimensioning follows a strict 3-tier hierarchy moving outward from the building core:
- Tier 1 (Inner Line / Minor Dimensions): Locates exterior door and window opening centerlines (or masonry rough openings) and interior wall partition intersections.
- Tier 2 (Middle Line / Structural Offsets): Locates structural column grid lines, building jogs, and major structural wall transitions.
- Tier 3 (Outer Line / Overall Dimension): Gives the continuous, overall exterior building length and width.

### Dimensioning Rules and Symbology

- Dimension Text Orientation: Unidirectional dimensioning (all text placed horizontally above the dimension line) is preferred for modern digital CAD/BIM drawings.
- Dimension Terminators: Standard 45-degree architectural tick marks (slashes) are standard for architectural plans; arrows are reserved for radius and leader callouts.
- Never Close Dimension Strings: Leave one non-critical interior room dimension unclosed to absorb cumulative job site framing tolerances without creating mathematical contradictions.`
    },
    {
      track_id: track1Id,
      title: "Graphic Symbolism, Conventions and Layer Standards",
      order_index: 3,
      content: `### Standardized Architectural Graphic Symbols

Architectural working drawings utilize universal graphic conventions to convey building elements:
- Door Swings: Drawn with a thin line representing the door leaf open at a 90-degree angle, with a quarter-circle arc indicating the path of travel and clearance envelope.
- Window Symbology: Single solid lines for fixed glass; parallel lines for sliding sashes; dashed directional triangles pointing to hinge axes for casement and awning windows.
- Material Hatching (Cross-Hatching):
  - Cast-in-Place Concrete: Stippled sand dots with small triangular aggregate stones.
  - Concrete Masonry Units (CMU): Diagonal lines cross-hatched at 45 degrees.
  - Common Face Brick: Diagonal parallel lines at 45 degrees.
  - Batt Insulation: Continuous sinusoidal squiggle curve filling the exact stud cavity width.
  - Plywood / Structural Wood: Fine parallel grain lines or layered cross-ply sections.

### Callout Bubbles and Reference Coordination

Working drawing sets link sheets through standardized callout bubbles (typically 1/2-inch split circles):
- Top Number: The specific Detail or Section Number on the target drawing sheet.
- Bottom Number: The Sheet Number where that specific detail is drawn (e.g. Detail 4 on Sheet A501).
- Cutting Plane Arrow: Points in the exact direction of view for the section observer.

### National CAD Standard (NCS) / ISO 13567 Layer Architecture

Digital drafting requires standardized layer organization across disciplines:
\`\`\`
[Discipline Code] - [Major Group] - [Minor Group] - [Status Phase]
\`\`\`
- Examples:
  - \`A-WALL-FULL-EXTR\`: Architectural - Wall - Full Height - Exterior
  - \`A-DOOR-IDEN-NEWW\`: Architectural - Door - Identification Tags - New Construction
  - \`S-COLS-GRID-EXTR\`: Structural - Columns - Grid Lines - Existing
  - \`M-HVAC-DUCT-SYST\`: Mechanical - HVAC - Ductwork - Proposed System`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Architectural Floor Plan Development and Core Layout",
      order_index: 1,
      content: `### Geometry of the Architectural Floor Plan

An architectural floor plan is mathematically defined as a horizontal sectional slice taken through the building at a height of 4 feet (48 inches / 1.20 meters) above the finished floor level:
- Sliced / Cut Elements: Exterior cavity walls, interior partitions, structural concrete columns, and elevator shafts are sliced through by the horizontal cutting plane. They are drafted using heavy lineweights (0.50 to 0.70 mm) or filled solid (pouched) with black ink or solid dark hatch.
- Projected Elements (Below Cutting Plane): Floor tiles, casework, kitchen counters, plumbing fixtures (toilets, sinks, bathtubs), and low sill windows are projected in medium to light lineweights.
- Overhead Elements (Above Cutting Plane): Beams, bulkheads, ceiling drops, clerestory windows, and roof overhangs are drafted using thin dashed hidden lines.

### Egress and Accessibility Geometry (IBC / ADA Standards)

Floor plan design must incorporate statutory life safety geometry:
1. Minimum Egress Corridor Width: 44 inches minimum for occupant loads exceeding 50 persons (72 to 96 inches for healthcare and educational facilities).
2. Accessible Door Clearances (ADA / ANSI A117.1):
   - Minimum 32 inches clear opening width measured between the face of the door leaf open at 90 degrees and the opposite frame stop.
   - Minimum 18 inches maneuvering latch clearance on the pull side of swinging doors.
   - 60-inch (1.52 m) diameter clear turning circle or T-shaped turning space in all accessible restrooms and kitchens.

### Stairway Geometry and Tread-Riser Ratios

Stair design is governed by the International Building Code (IBC Section 1011):
- Maximum Riser Height: 7.0 inches (178 mm).
- Minimum Tread Depth: 11.0 inches (279 mm).
- The Blondel Ergonomic Formula:
\`\`\`
2 * Riser + Tread = 24 to 25 inches (600 to 635 mm)
\`\`\`
- Minimum Headroom Clearance: 80 inches (6'-8" / 2.03 m) measured vertically from the leading tread nosing to the ceiling plane above.`
    },
    {
      track_id: track2Id,
      title: "Exterior and Interior Building Elevations",
      order_index: 2,
      content: `### Exterior Architectural Elevations

Exterior elevations are orthographic projections of the outer building envelope viewed from a vertical plane parallel to the building facade:
- Orientation Naming: Elevations are named by cardinal compass direction (North Elevation, South Elevation) or by structural grid reference lines.

### Lineweight Depth Cuing on Building Facades

Because orthographic drawings lack perspective convergence, depth perception is communicated through lineweight modulation:
1. Building Silhouette Profile: The outermost perimeter boundary separating the building mass from the sky is drafted with an extra-heavy profile line (0.70 mm).
2. Foreground Projections (Entry canopies, front-plane bays): Heavy lineweight (0.50 mm).
3. Intermediate Facade Plane (Main exterior walls): Medium lineweight (0.35 mm).
4. Recessed / Background Planes (Rear building wings, courtyards): Fine lineweight (0.18 mm).

### Datum Levels and Vertical Dimensioning

Exterior elevations must clearly establish vertical reference datums:
- Top of Footing (T.O.F.) and Top of Foundation Wall (T.O.F.W.).
- Finished Ground Grade Line (heavy irregular line anchored with earth hatch).
- Finished Floor Elevations (e.g. Level 1 F.F.E. = +100'-0" or +0.00 m).
- Floor-to-Floor Heights and Ceiling Heights (e.g. Level 2 F.F.E. = +114'-0").
- Top of Parapet Cap (T.O.P.) and Top of Roof Structural Steel (T.O.S.).

### Interior Elevations and Architectural Millwork

Interior elevations are drafted at 1/4" = 1'-0" or 1/2" = 1'-0" to detail complex vertical interior surfaces:
- Kitchen and laboratory casework layouts (countertop heights at 36 inches, upper cabinet drops at 54 inches above floor).
- Restroom fixture elevations verifying ADA grab bar mounting heights (33 to 36 inches above floor) and mirror reflective surfaces.
- Electrical device vertical elevations (light switches at 48 inches on center, wall receptacles at 18 inches above floor).`
    },
    {
      track_id: track2Id,
      title: "Longitudinal and Transverse Building Sections",
      order_index: 3,
      content: `### Spatial Function of Building Sections

Building sections represent a vertical slicing plane cut through the entire building from roof to foundation subsoil:
- Longitudinal Section: Cut parallel to the longest axis of the building.
- Transverse Section: Cut perpendicular to the longest axis (cross-section).

### Strategic Section Cut Placement

Section cutting planes are strategically routed through critical architectural and structural zones:
1. Vertical Circulation Cores: Cutting through open multi-story stair towers, elevator shafts, and escalator banks to reveal floor-to-floor landings, headroom clearances, and pit depths.
2. Major Spatial Transitions: Slicing through double-height atriums, clerestory roof pop-ups, and building expansion joints.
3. Complex Building Envelope Transitions: Slicing through parapets, cantilevered balconies, and underground parking retaining walls.

### Structural and Mechanical Stratification

Building sections reveal the vertical sandwich of architectural and engineering systems:
- Structural System: Poured concrete footings, slab-on-grade thicknesses (4 to 6 inches with welded wire reinforcement), structural steel wide-flange beams, open-web steel joists (OWSJ), and composite metal floor decks.
- Ceiling Plenum Space: The interstitial zone between the suspended acoustical tile ceiling (ACT) and the bottom of the structural floor deck, accommodating HVAC supply/return ducts, fire sprinkler main piping, and electrical cable trays.
- Floor-to-Floor vs Clear Ceiling Heights: Explicitly dimensioning total structural floor-to-floor height (e.g. 14'-0") vs usable interior clear ceiling height (e.g. 10'-0" finish ceiling with a 4'-0" plenum).`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Large-Scale Wall Sections and Construction Detailing",
      order_index: 1,
      content: `### Construction Detailing Methodology

Large-scale wall sections and architectural details (drafted at 3/4" = 1'-0", 1-1/2" = 1'-0", or 3" = 1'-0") bridge design concepts and physical job site assembly. Every architectural detail must resolve three non-negotiable building physics criteria: Structural Load Transfer, Continuous Environmental Barriers (Thermal, Air, Moisture, Vapor), and Material Thermal Expansion Tolerances.

### 1. Foundation-to-Slab Detailing
- Reinforced concrete foundation stem wall bearing on continuous spread footing.
- Concrete slab-on-grade (4 to 6 inches) isolated from foundation wall with 1/2-inch preformed asphalt expansion joint filler.
- Sub-Slab Moisture Barrier: 15-mil polyolefin puncture-resistant vapor retarder (ASTM E1745 Class A) installed directly over 4 inches of crushed compacted drainage stone, with all pipe penetrations sealed with elastomeric flashing tape.
- Foundation Insulation: Continuous vertical 2-inch extruded polystyrene (XPS R-10) perimeter insulation extending down to frost depth.

### 2. Window Head, Jamb and Sill Details
- Sill Pan Flashing: Self-adhering modified bitumen flashing membrane lining the rough sill with 2-inch end dams turned up at the sides to form a watertight pan.
- Weep Drainage: Open weep slots in the exterior cladding allowing any sill condensation to escape outward over through-wall stainless steel flashing.
- Perimeter Air/Water Seal: Continuous low-expansion polyurethane foam insulation between window frame and rough opening, sealed on the exterior with open-cell backer rod and high-performance silicone sealant (ASTM C920 Class 50).

### 3. Parapet Wall and Roof Termination Details
- Parapet Framing: Structural steel or wood stud parapet extending 30 to 42 inches above the finished roof deck.
- Continuous Air Barrier Wrap: Self-adhering air/vapor barrier membrane wrapped up the parapet wall, over the top wood nailer blocking, and tied into the exterior wall weather barrier.
- Tapered Roof Insulation: Polyisocyanurate rigid foam boards (minimum R-30 total) with 1/4" per foot slope to internal roof drains and scuppers.
- Coping Metal Flashing: 24-gauge continuous sheet metal coping cap with hemmed drip edges, fastened to continuous cleat strips without exposed face fasteners to accommodate thermal expansion.`
    },
    {
      track_id: track3Id,
      title: "Architectural Schedules: Doors, Windows and Finishes",
      order_index: 2,
      content: `### Tabular Construction Schedules

Architectural schedules organize complex building component specifications into standardized tabular spreadsheets linked directly to drawing plan tags:

### 1. Door and Frame Schedule
The door schedule cross-references every numbered door tag on the floor plan with its physical attributes:
- Door Mark Number (e.g. 101A, 102B).
- Dimensions: Nominal Width x Height x Thickness (e.g. 3'-0" x 7'-0" x 1-3/4" / 914 x 2134 x 44 mm).
- Door Material & Construction: Hollow Metal (18-gauge cold-rolled steel), Solid Core Wood (staved lumber core with hardwood veneer), or Aluminum Stile & Rail.
- Frame Type & Material: 16-gauge welded hollow metal frame or knock-down drywall frame, jamb depth, and throat size.
- Fire Rating Label: 20-minute (corridor doors), 45-minute (1-hour shaft partitions), 90-minute (2-hour stairwell enclosures), or 3-hour (fire barrier walls).
- Hardware Group Reference: Cross-references hardware specification sets (hinges, mortise locksets, panic exit push bars, hydraulic door closers, magnetic hold-opens, and perimeter smoke seals).

### 2. Window and Glazing Schedule
- Window Mark (e.g. W1, W2).
- Unit Dimensions: Width x Height, Rough Opening (RO) dimensions, and Masonry Opening (MO).
- Operation Type: Fixed, Casement, Awning, Hopper, or Unitized Curtain Wall.
- Glazing Specification: 1-inch Insulated Glass Unit (1/4" Low-E outer pane + 1/2" Argon air space + 1/4" clear tempered inner pane).
- NFRC Performance: Maximum U-factor (e.g. U <= 0.28) and maximum SHGC (e.g. SHGC <= 0.22).

### 3. Room Finish Schedule
- Room Number & Name (e.g. Room 104 - Conference Room).
- Floor Material: Polished concrete, luxury vinyl tile (LVT), or commercial carpet tile.
- Baseboard: 4-inch rubber cove base or solid wood base.
- Wall Finishes: North, South, East, West walls (e.g. Paint 1, Paint 2 accent wall, acoustic fabric wall panels).
- Ceiling Finish & Height: Suspended 2x2 ft Acoustical Ceiling Tile (ACT) at 9'-0" A.F.F. (Above Finished Floor).`
    },
    {
      track_id: track3Id,
      title: "Drawing Set Organization, Title Blocks and Deliverables",
      order_index: 3,
      content: `### Construction Document Set Architecture (U.S. National CAD Standard / AIA)

A complete set of working construction documents is organized in a standardized multi-disciplinary sequence:
- G-Series: General Information (Cover Sheet, Drawing Sheet Index, Code Compliance Matrix, Partition Types, Life Safety Egress Plans).
- C-Series: Civil Engineering & Site Utilities (Topography, Grading, Stormwater Drainage, Paving).
- L-Series: Landscape Architecture (Planting Plans, Irrigation, Hardscape).
- S-Series: Structural Engineering (Foundation Plans, Framing Plans, Structural Column Schedules, Connection Details).
- A-Series: Architectural Drawings:
  - A100 Series: Demolition and New Construction Floor Plans.
  - A150 Series: Reflected Ceiling Plans (RCP) and Lighting Layouts.
  - A200 Series: Exterior Building Elevations.
  - A300 Series: Overall Building Sections.
  - A400 Series: Enlarged Plans and Wall Sections.
  - A500 Series: Architectural Construction Details.
  - A600 Series: Door, Window, and Room Finish Schedules.
- M-Series: Mechanical & HVAC Plans.
- P-Series: Plumbing & Fire Protection Piping.
- E-Series: Electrical Power, Lighting, and Telecom Engineering.

### Standard Sheet Sizes (ARCH & ISO Formats)

- ARCH D (24 x 36 inches / 610 x 914 mm): The most universal standard format for commercial and residential architectural construction documents.
- ARCH E (36 x 48 inches / 914 x 1219 mm): Used for large-scale institutional and healthcare projects.
- ISO A1 (594 x 841 mm) & ISO A0 (841 x 1189 mm): International metric standards.

### Title Block Anatomy and Legal Governance

The title block occupies the right-hand margin or bottom edge of every drawing sheet:
1. Professional Seal / Stamp: Legally binding embossed or digital seal of the Licensed Registered Architect (RA) or Professional Engineer (PE).
2. Project Identification: Formal project legal name, site address, and client name.
3. Sheet Identification: Sheet Title (e.g. FIRST FLOOR ENLARGED PLAN) and Sheet Number (e.g. A101).
4. Revision Block (Delta Tracking): Chronological table recording revision delta number, date, revision description (e.g. Addendum #1, Plan Review Response), and drafter initials.
5. Drawing Metadata: Drawing Scale (e.g. 1/4" = 1'-0"), Date of Issue, Project Number, and North Arrow orientation.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #6.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "At what standard height above the finished floor level is the horizontal cutting plane assumed to slice through a building when generating an architectural floor plan?",
      options: [
        "1 foot (12 inches / 0.30 m)",
        "8 feet (96 inches / 2.40 m)",
        "4 feet (48 inches / 1.20 m)",
        "Directly at ceiling height"
      ],
      correct_option_index: 2,
      explanation: "An architectural floor plan is a horizontal section cut taken at exactly 4 feet (48 inches / 1.20 m) above finished floor level, slicing through doors, windows, and walls.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In the United States and North American architectural drafting standards (ANSI), which projection system places the projection plane between the observer and the object so the Top View is drawn directly above the Front View?",
      options: [
        "Third-Angle Projection",
        "First-Angle Projection",
        "Isometric Axonometric Projection",
        "Oblique Cavalier Projection"
      ],
      correct_option_index: 0,
      explanation: "Third-Angle Projection is the North American standard where the projection plane sits between the observer and object, placing the Top View above the Front View.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What standard drawing scale is most commonly specified for architectural floor plans and exterior elevations in commercial building working drawings?",
      options: [
        "1\" = 20'-0\" (1:240)",
        "3\" = 1'-0\" (1:4)",
        "Full Size (1:1)",
        "1/4\" = 1'-0\" (1:48 scale)"
      ],
      correct_option_index: 3,
      explanation: "1/4\" = 1'-0\" (1:48 scale) is the industry standard scale for architectural floor plans, exterior elevations, and building sections in commercial construction.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "Under the International Building Code (IBC Section 1011), what are the maximum riser height and minimum tread depth dimensions for commercial egress stairways?",
      options: [
        "Maximum 10-inch riser; minimum 8-inch tread",
        "Maximum 7.0-inch riser; minimum 11.0-inch tread",
        "Maximum 8.5-inch riser; minimum 9.0-inch tread",
        "Maximum 6.0-inch riser; minimum 14.0-inch tread"
      ],
      correct_option_index: 1,
      explanation: "IBC Section 1011 mandates a maximum riser height of 7.0 inches (178 mm) and a minimum tread depth of 11.0 inches (279 mm) for commercial stairways.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What standardized layer naming discipline code prefix is designated for Architectural drawings under the U.S. National CAD Standard (NCS)?",
      options: [
        "S (e.g. S-WALL)",
        "M (e.g. M-WALL)",
        "A (e.g. A-WALL-FULL-EXTR)",
        "C (e.g. C-WALL)"
      ],
      correct_option_index: 2,
      explanation: "Under the National CAD Standard and AIA guidelines, 'A' designates the Architectural discipline (e.g. A-WALL, A-DOOR, A-FLOR).",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In architectural dimensioning hierarchy, what information is placed on the outermost (third) continuous dimension line of a floor plan?",
      options: [
        "Window rough opening centerlines",
        "Overall building length and width dimensions",
        "Interior wall partition thicknesses",
        "Plumbing fixture centerline locations"
      ],
      correct_option_index: 1,
      explanation: "The outermost dimension string gives the overall continuous building dimensions, while intermediate strings locate structural column grids and inner strings locate window/door openings.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "How is visual depth perception established on 2D orthographic exterior building elevations without perspective convergence?",
      options: [
        "By drawing all lines with identical 0.18 mm fine pens",
        "By applying bright multi-colored markers to all walls",
        "By rotating all windows at 45-degree angles",
        "Through lineweight hierarchy modulation (extra-heavy 0.70 mm silhouette profile lines, medium lines for main planes, and fine lines for distant background planes)"
      ],
      correct_option_index: 3,
      explanation: "Lineweight modulation creates depth cuing: outermost building silhouette borders use extra-heavy lineweights (0.7 mm), while receding background surfaces use fine lines (0.18 mm).",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What are the standard sheet dimensions of an ARCH D architectural drawing format, the most universal size for commercial working drawing sets?",
      options: [
        "24 x 36 inches (610 x 914 mm)",
        "8.5 x 11 inches (216 x 279 mm)",
        "11 x 17 inches (279 x 432 mm)",
        "36 x 48 inches (914 x 1219 mm)"
      ],
      correct_option_index: 0,
      explanation: "ARCH D measures exactly 24 x 36 inches (610 x 914 mm), representing the universal standard sheet size for commercial and residential construction documents.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In a standardized architectural callout bubble (1/2-inch split circle), what does the number in the bottom half of the circle indicate to the builder?",
      options: [
        "The total cost estimate in thousands of dollars",
        "The number of construction workers required",
        "The Sheet Number where that specific enlarged detail or section drawing is located",
        "The structural concrete compressive strength"
      ],
      correct_option_index: 2,
      explanation: "In a standard callout tag, the top number identifies the detail/section number and the bottom number identifies the target drawing sheet (e.g. Detail 3 on Sheet A501).",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "Under the Americans with Disabilities Act (ADA / ANSI A117.1), what is the minimum clear turning diameter required in accessible restrooms and kitchen work zones?",
      options: [
        "36 inches (0.91 m)",
        "60 inches (1.52 m / 5 feet)",
        "48 inches (1.22 m)",
        "72 inches (1.83 m)"
      ],
      correct_option_index: 1,
      explanation: "ADA standards mandate a minimum 60-inch (1.52 m / 5-foot) diameter circular turning space or a T-shaped turning configuration for wheelchair maneuverability.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "An architect is calculating commercial stairway proportions using the Blondel ergonomic formula (2*R + T = 24 to 25 inches). If the structural floor-to-floor height requires a 6.5-inch riser, what is the mathematically optimal tread depth?",
      options: [
        "9.0 inches",
        "14.5 inches",
        "10.0 inches",
        "11.5 to 12.0 inches (2 * 6.5 + 11.5 = 24.5 inches)"
      ],
      correct_option_index: 3,
      explanation: "Using 2*R + T = 24.5 in: 2*(6.5) + T = 24.5 -> 13.0 + T = 24.5 -> T = 11.5 inches. This satisfies both the Blondel comfort formula and the IBC 11.0-inch minimum tread rule.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "Why is it an established architectural drafting rule to never close a continuous interior dimension chain across the entire width of a building floor plan?",
      options: [
        "Leaving one dimension unclosed creates a floating tolerance string that absorbs cumulative job site framing variations without mathematical contradictions",
        "Closed strings violate local fire evacuation codes",
        "Dimension chains longer than 10 feet cannot be read by CAD software",
        "Unclosed chains reduce ink costs during blueprint plotting"
      ],
      correct_option_index: 0,
      explanation: "Leaving one non-critical dimension unclosed prevents mathematical discrepancies caused by minor field framing deviations and material thickness tolerances during construction.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In architectural window sill construction detailing, what critical engineering element prevents wind-driven rainwater from infiltrating into the wall cavity beneath the window frame?",
      options: [
        "Applying silicone caulking over exterior weep holes",
        "Installing wood blocks directly under the glass",
        "A continuous self-adhering flashing sill pan with 2-inch upturned end dams and open weep channels that drain water outward over through-wall flashing",
        "Using single-pane annealed glass"
      ],
      correct_option_index: 2,
      explanation: "A flexible sill pan flashing with upturned end dams captures any water penetrating the window frame and directs it safely out through weep channels, protecting the rough opening.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "On a Door and Frame Schedule, what fire resistance rating is statutory for doors installed in a 2-hour fire-rated exit stairwell enclosure?",
      options: [
        "20-minute fire-rated door",
        "90-minute (1.5-hour) fire-rated door assembly",
        "3-hour fire-rated door",
        "Non-rated hollow core wood door"
      ],
      correct_option_index: 1,
      explanation: "Building codes (IBC Table 716.1) mandate that door assemblies in 2-hour fire-rated exit enclosures (stair towers) must possess a minimum 90-minute (1.5-hour) fire protection rating.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In architectural parapet construction details, why is sheet metal coping cap flashing installed with continuous concealed cleats rather than exposed face screws through the top of the metal?",
      options: [
        "Continuous cleats allow the metal coping to expand and contract longitudinally under thermal temperature swings without oil-canning or tearing fastener holes",
        "Concealed cleats are magnetic and eliminate the need for screws",
        "Exposed screws violate local zoning height limitations",
        "Cleats increase the R-value of the parapet insulation by R-15"
      ],
      correct_option_index: 0,
      explanation: "Continuous hemmed cleats secure coping edges against wind uplift while allowing the metal to slide freely during thermal expansion and contraction, preventing leaks from sheared face screws.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #6.");
  console.log("Skill #6 update completed successfully!");
}

run();
