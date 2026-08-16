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

const skillId = "cc72a89d-ec60-4f49-900a-1689ea7ba45e";

async function run() {
  console.log("Updating Skill #5: Materials & Construction Methods (9 steps)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Structural Concrete, Steel and Foundation Engineering" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Mass Timber, Masonry and Architectural Cladding" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Building Enclosure Physics, Envelopes and Embodied Carbon" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Concrete Material Science, Hydration Chemistry and Mix Design",
      order_index: 1,
      content: `### Chemistry of Portland Cement Hydration

Concrete is a heterogeneous composite material whose mechanical performance is dictated by the chemical hydration reactions of Ordinary Portland Cement (OPC, ASTM C150). The four principal clinker mineral phases are:
1. Tricalcium Silicate (C3S / Alite, 50% to 70% of clinker): Hydrates rapidly to form Calcium Silicate Hydrate (C-S-H gel) and Calcium Hydroxide (Ca(OH)2), responsible for early compressive strength development (1 to 28 days).
2. Dicalcium Silicate (C2S / Belite, 15% to 30%): Hydrates slowly, providing steady long-term strength gain extending beyond 28 days to years.
3. Tricalcium Aluminate (C3A, 5% to 10%): Reacts instantaneously with water, releasing high heat of hydration. Gypsum (CaSO4.2H2O) is inter-ground with clinker to control C3A flash setting by forming ettringite needles.
4. Tetracalcium Aluminoferrite (C4AF, 5% to 15%): Contributes to raw material fluxing during manufacturing and imparts the characteristic grey color.

### Water-to-Cementitious Ratio (w/cm) and Abram's Law

The single most critical determinant of concrete compressive strength (f'c) and durability is the water-to-cementitious material ratio (w/cm):
- Abram's Law dictates that compressive strength is inversely proportional to the w/cm ratio.
- High w/cm (> 0.50): Surplus unreacted water evaporates, leaving an extensive network of continuous capillary micropores that severely reduces strength and allows rapid ingress of corrosive chlorides and carbonation.
- Low w/cm (0.32 to 0.40): Dense microstructure with minimal capillary porosity, achieving high compressive strength (50 to 100+ MPa / 7,000 to 15,000+ PSI) and high durability.

### Supplementary Cementitious Materials (SCMs)

Modern high-performance concrete incorporates industrial pozzolanic byproducts:
- Fly Ash (Class F and Class C, ASTM C618): Pozzolanic silica reacts with liberated Calcium Hydroxide to form secondary C-S-H gel, refining pore structure and mitigating Alkali-Silica Reaction (ASR).
- Ground Granulated Blast-Furnace Slag (GGBFS, ASTM C989): Replaces 30% to 70% of cement, providing extreme resistance to marine sulfate attack and low heat of hydration for mass concrete pours.
- Silica Fume (ASTM C1240): Ultra-fine amorphous silica particles (0.1 microns) that densify the interfacial transition zone (ITZ) between cement paste and aggregate particles.

### Quality Control and Standard Laboratory Testing

- Slump Cone Test (ASTM C143): Measures fresh workability and rheological yield stress.
- Air Content Pressure Method (ASTM C231): Verifies entrained microscopic air bubbles (4% to 7% volume) required to protect concrete against freeze-thaw spalling.
- Compressive Strength Test (ASTM C39): 4x8 inch or 6x12 inch cylindrical specimens are moist-cured and tested in unconfined compression at 7, 14, and 28 days.`
    },
    {
      track_id: track1Id,
      title: "Structural Steel Metallurgy, Fabrication and Connection Mechanics",
      order_index: 2,
      content: `### Metallurgy of Structural Steel Shapes

Structural steel framework engineering is governed by the American Institute of Steel Construction (AISC 360) specifications:
- ASTM A992 Steel: The standard structural steel grade for wide-flange beams and columns (W-shapes), featuring a minimum yield strength (F_y) of 50 ksi (345 MPa) and a minimum tensile strength (F_u) of 65 ksi (450 MPa).
- ASTM A36 Steel: Low-carbon steel (F_y = 36 ksi) utilized for base plates, angles, and connection gusset plates.
- ASTM A500 Grade B/C: Cold-formed welded structural steel tubing (HSS - Hollow Structural Sections: square, rectangular, round).

### Structural Stress-Strain Behavior

Structural steel exhibits a distinct elastic-plastic response under axial tensile stress:
1. Elastic Region: Stress is linear with strain governed by Young's Modulus of Elasticity (\`E = 29,000 ksi / 200,000 MPa\`).
2. Yield Plateau: The material undergoes plastic deformation at constant yield stress (F_y) without immediate load increase.
3. Strain Hardening: Additional molecular dislocation resistance increases load capacity up to ultimate tensile strength (F_u).
4. Ductile Necking and Failure: Provides massive energy dissipation and observable structural warning prior to catastrophic fracture, making steel the ideal material for high seismic design categories.

### Bolted and Welded Structural Connections

1. High-Strength Bolted Connections (ASTM F3125 Grade A325 and A490):
   - Bearing-Type Connections (Snug-Tight): Shear load is transferred purely through physical mechanical bearing of the bolt shank against the hole sidewalls.
   - Slip-Critical Connections (Pre-Tensioned): Bolts are tensioned to a minimum specified clamping force (using Direct Tension Indicator - DTI washers or Turn-of-Nut method). Shear load is transferred entirely through friction between the clamped faying steel surfaces. Required for bridges, crane runways, and cyclic seismic joints.

2. Structural Welding (AWS D1.1 Structural Welding Code):
   - Fillet Welds: Triangular cross-section joining overlapping or perpendicular steel surfaces. Designed based on effective throat thickness (\`Effective Throat = 0.707 * Leg Size\`).
   - Complete Joint Penetration (CJP) Groove Welds: Fuses the entire cross-section of joining members, developing 100% of the base metal's structural strength.
   - Non-Destructive Testing (NDT): Ultrasonic Testing (UT) for internal subsurface weld flaws, Radiographic Testing (RT), and Magnetic Particle Testing (MT) for surface cracks.

### Structural Fire Protection

Structural steel loses 50% of its structural yield strength at approximately 550 degrees C (1,000 degrees F). Fireproofing strategies include:
- Spray-Applied Fire-Resistive Materials (SFRM): Cementitious or mineral fiber slurries applied at thicknesses of 0.5 to 2.5 inches to achieve 1 to 4-hour fire endurance ratings (ASTM E119).
- Intumescent Fireproofing Coatings: Thin aesthetic paint films that expand up to 50 times their original thickness under high heat, forming an insulating cellular carbon foam char.`
    },
    {
      track_id: track1Id,
      title: "Geotechnical Engineering, Substructures and Foundation Systems",
      order_index: 3,
      content: `### Geotechnical Soil Mechanics and Foundation Design

All architectural superstructure dead loads, live loads, wind lateral shears, and seismic overturning moments must be safely transferred to underlying soil or bedrock without exceeding bearing capacity or causing excessive differential settlement.

### Soil Classification and Subsurface Investigation

- Standard Penetration Test (SPT, ASTM D1586): A 140-lb hammer drops 30 inches to drive a split-spoon sampler 18 inches into the borehole. The number of blows required for the final 12 inches defines the SPT N-value, correlating to soil relative density and shear strength.
- Soil Types (Unified Soil Classification System - USCS): Coarse-grained gravels (G) and sands (S) exhibit high frictional shear strength and rapid settlement. Fine-grained silts (M) and clays (C) exhibit cohesion and undergo long-term time-dependent consolidation settlement.

### Shallow Foundation Systems

Shallow foundations bear directly on near-surface soil when upper soil strata exhibit adequate allowable bearing capacity (typically > 150 to 300 kPa / 3,000 to 6,000 PSF):
1. Continuous Strip (Spread) Footings: Poured reinforced concrete strips supporting loadbearing concrete or masonry walls.
2. Isolated Pad Footings: Square or rectangular reinforced concrete pads supporting concentrated point loads from structural columns.
3. Mat / Raft Foundations: Heavy, continuous reinforced concrete slabs (often 2 to 6 feet thick) spanning the entire building footprint, distributing building weight over a large area to bridge variable soft soil pockets.

### Deep Foundation Systems

Deep foundations bypass weak, compressible upper soil layers to transfer building loads to competent deep strata or solid bedrock:
1. Driven Piles: Steel H-piles, pipe piles, or precast prestressed concrete piles driven into the ground using diesel or hydraulic impact hammers. Loads are resisted via end bearing on bedrock and skin friction along the pile perimeter shaft.
2. Drilled Shafts (Caissons / Bored Piles): Large-diameter holes (2 to 10+ feet in diameter) drilled into the earth using auger rigs, reinforced with heavy full-length rebar cages, and filled with high-slump structural concrete.
3. Continuous Flight Auger (CFA / Augercast) Piles: A continuous hollow-stem flighted auger drills to target depth; high-strength cement grout is pumped under pressure through the hollow stem as the auger is extracted, followed by static insertion of reinforcing steel.

### Below-Grade Waterproofing and Hydrostatic Relief

- Hydrostatic Pressure Management: Installing perforated perimeter foundation drain pipes bedded in washed crushed gravel, connected to sump basins to continuously relieve lateral hydrostatic water pressure.
- Positive-Side Waterproofing Membranes: Self-adhering modified bitumen sheets or fluid-applied elastomeric membranes applied to the exterior face of foundation walls, protected by dimpled drainage composites to facilitate water descent to the drain tile.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Mass Timber Architecture, CLT and Heavy Wood Framing",
      order_index: 1,
      content: `### Wood as an Orthotropic Structural Material

Wood is a biological, anisotropic composite material with distinct mechanical properties along three mutually perpendicular axes:
- Longitudinal (parallel to grain): Maximum tensile and compressive strength (E_L is 10 to 20 times higher than transverse modulus).
- Radial (perpendicular to growth rings): Moderate dimensional stability.
- Tangential (tangent to growth rings): Experiences the greatest shrinkage and swelling during moisture cycling.

### Moisture Dynamics in Structural Timber

- Fiber Saturation Point (FSP): Occurs at approximately 28% to 30% Moisture Content (MC). Above FSP, water exists as free water inside cell lumens with zero effect on structural strength. Below FSP, bound water leaves cell walls, causing wood shrinkage, cellular stiffening, and dramatic increases in mechanical strength.
- Equilibrium Moisture Content (EMC): Structural lumber is kiln-dried to 15% to 19% MC to match typical indoor relative humidity and prevent post-installation warping.

### Engineered Mass Timber Systems

Mass timber refers to large-format, solid engineered wood structural panel and beam products:

1. Cross-Laminated Timber (CLT, ANSI/APA PRG 320):
   - Manufactured by stacking kiln-dried dimensional lumber boards (typically 2x4, 2x6, or 2x8) in odd-numbered alternating orthogonal layers (3, 5, 7, or 9 plies) glued under high hydraulic pressure with structural polyurethane or melamine adhesives.
   - Cross-lamination provides bi-directional structural spanning capacity, extreme dimensional stability across seasonal humidity swings, and acts as heavy structural shear walls and floor diaphragms.

2. Glued-Laminated Timber (Glulam, ANSI A190.1):
   - Individual lumber laminations stacked and glued parallel to the longitudinal grain. Enables manufacturing of deep straight beams, multi-story heavy columns, and sweeping structural arches spanning over 100 feet.

3. Structural Composite Lumber (LVL / LSL / PSL):
   - Laminated Veneer Lumber (LVL) uses thin peeled wood veneers aligned in parallel, eliminating natural defects (knots, grain slope) to achieve high bending strength and stiffness.

### Fire Resistance and Charring Mechanics in Mass Timber

Unlike light-frame wood that burns rapidly, heavy mass timber elements exhibit predictable, natural fire resistance:
- Char Layer Formation: When exposed to standard building fire temperatures (> 300 degrees C), the outer surface of dense mass timber pyrolyzes into a solid carbonaceous char layer at a constant linear rate of approximately 0.65 mm per minute (1.5 inches per hour) for softwoods.
- Thermal Insulation of Inner Core: The porous carbon char layer has extremely low thermal conductivity (one-sixth that of raw wood). It prevents oxygen penetration and insulates the interior unburnt solid wood core, allowing the mass timber element to retain 85%+ of its structural loadbearing capacity during 1 to 3-hour fire exposures without steel-like catastrophic buckling (IBC Type IV Construction).`
    },
    {
      track_id: track2Id,
      title: "Structural Masonry, Mortar Chemistry and Reinforcement Assemblies",
      order_index: 2,
      content: `### Concrete Masonry Unit (CMU) Engineering

Concrete Masonry Units (ASTM C90) are standardized precast loadbearing building blocks. Standard nominal dimensions (e.g. 8x8x16 inches) have actual manufactured dimensions of 7-5/8 x 7-5/8 x 15-5/8 inches to account for standard 3/8-inch (10 mm) mortar joints:
- Face Shells and Web Geometry: CMUs feature two exterior face shells connected by transverse interior webs, creating open vertical cores (cells) designed for steel rebar insertion and grout filling.
- Specified Compressive Strength (f'm): Standard structural masonry assemblies achieve specified compressive strengths from 1,500 to 3,000+ PSI (10.3 to 20.7 MPa).

### Mortar Classifications and Performance (ASTM C270)

Mortar binds masonry units, compensates for dimensional tolerances, and provides weather sealing. Mortar types are defined by proportioning Portland cement, hydrated lime (Ca(OH)2), and sand:

1. Type M (High Strength, 2,500 PSI / 17.2 MPa): High compressive strength, low workability. Specified for below-grade foundation walls, heavy retaining walls, and high axial loadbearing piers.
2. Type S (High Flexural Bond, 1,800 PSI / 12.4 MPa): High lateral tensile bond strength. The mandatory specification for seismic design categories and high-wind exterior loadbearing walls.
3. Type N (Medium Strength, 750 PSI / 5.2 MPa): Balanced workability and durability. The standard specification for above-grade exterior veneer walls and interior partitions.
4. Type O (Low Strength, 350 PSI / 2.4 MPa): High lime content, low compressive strength. Used strictly for interior non-loadbearing partitions and historic masonry tuckpointing.

### Structural Grouting and Reinforcement Placement

- Grout (ASTM C476): A high-slump (8 to 11 inches) fluid mixture of cement, sand, fine pea gravel, and water. Fluidity allows grout to flow completely around congested rebar without vibrating pockets or voids.
- Vertical Reinforcement: Deformed steel rebar placed in continuous vertical CMU cells, anchored to foundation dowels.
- Bond Beams (Horizontal Reinforcement): Special U-shaped CMU blocks placed horizontally at floor and roof diaphragm elevations, reinforced with continuous horizontal rebar and filled with grout to distribute lateral seismic and wind diaphragm loads.

### Movement Joints and Crack Control

Masonry expands and contracts due to thermal changes and moisture dry-out:
- Control Joints (CJ): Vertical continuous separation joints placed in CMU walls at 20 to 25-foot intervals, at wall intersections, and at window/door openings to accommodate shrinkage without uncontrolled wall cracking.
- Cavity Drainage: Masonry veneer walls require a minimum 1.0 to 2.0-inch clear drainage air cavity behind brick veneer, paired with mortar net mesh, through-wall flashing, and open weep holes spaced at 24 inches on center.`
    },
    {
      track_id: track2Id,
      title: "Architectural Metals, Rainscreen Cladding and Protective Coatings",
      order_index: 3,
      content: `### Architectural Metal Cladding Systems

Exterior architectural metal facades protect buildings while delivering striking visual aesthetics. Common architectural metal alloys include:
- Architectural Aluminum (Alloy 6063-T6 / 5052-H32): High strength-to-weight ratio, extruded into complex mullions or formed into composite metal panels (ACM / MCM: two thin aluminum skins bonded to a fire-retardant mineral core).
- Architectural Zinc (Titanium-Zinc Alloy): Naturally self-healing patina (zinc hydroxycarbonate) that develops over 2 to 5 years, providing a 100+ year maintenance-free lifespan in non-marine environments.
- Copper and Architectural Bronze: Weathering copper alloys that oxidize from bright metallic salmon to rich dark brown oxide, culminating in the protective green carbonate verdigris patina.
- Weathering Steel (ASTM A588 / Cor-Ten): Forms an adhering protective surface rust layer when subjected to alternating wet and dry cycles, eliminating paint maintenance.

### Rainscreen Cladding Assemblies

Modern commercial envelopes utilize Rear-Ventilated Rainscreen (RVR) cladding systems:
1. Outer Cladding Layer: Terracotta tiles, fiber cement panels, phenolic HPL panels, or metal cassettes that shed 90%+ of bulk precipitation.
2. Ventilated Air Cavity: Continuous 1.0 to 2.0-inch vertical air drainage space created by engineered structural aluminum sub-framing brackets (thermal clips / continuous T-rails).
3. Continuous Weather Resistive Barrier (WRB) & Exterior Insulation: Applied directly over the structural backup wall to provide airtight, watertight, and thermally continuous envelope performance.

### High-Performance Architectural Coatings and Finishes

- Polyvinylidene Fluoride (PVDF / Kynar 500 / Hylar 5000, AAMA 2605): 70% fluoropolymer resin factory-baked liquid coating providing extreme UV resistance, color retention, and chemical chalking resistance for 20 to 30+ years.
- Architectural Anodizing (AAMA 611 Class I): An electrochemical process that thickens the natural aluminum oxide layer to 0.7 mils (18 microns), creating an extremely hard, integral sapphire-like metallic surface impervious to peeling or blistering.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Building Enclosures: Thermal Physics, Air Barriers and Vapor Dynamics",
      order_index: 1,
      content: `### Hygrothermal Physics of the Building Envelope

The building envelope must regulate four primary environmental transfer mechanisms in order of physical damage potential: Liquid Water Ingress, Air Leakage, Water Vapor Diffusion, and Thermal Heat Conduction.

### 1. Thermal Insulation and Continuous Insulation (ci)

Heat transfer through opaque wall assemblies is governed by Fourier's Law of Conduction:

\`\`\`
q = U * A * Delta_T
\`\`\`

Where q is heat flow rate (BTU/hr or Watts), U is the overall assembly thermal transmittance (\`U = 1 / R_total\`), A is surface area, and Delta_T is temperature differential.

- Thermal Bridging Penalty: Structural steel studs (spaced at 16 or 24 inches on center) act as thermal conductors, short-circuiting cavity batts and reducing effective wall R-value by up to 50% to 60%.
- Continuous Exterior Insulation (ci): ASHRAE 90.1 mandates continuous rigid insulation (extruded polystyrene - XPS, polyisocyanurate, or rigid mineral wool) installed over exterior sheathing to eliminate thermal bridging through studs and floor slab edges.

### 2. Continuous Air Barrier Assemblies

Air leakage transports 50 to 100 times more moisture into building wall cavities than vapor diffusion:
- Performance Standard (ASTM E2178 / E2357): Air barrier membranes must demonstrate an air permeance < 0.004 cfm/ft2 at 75 Pa, and complete wall assemblies must not exceed 0.04 cfm/ft2.
- Air Barrier Placement: Fluid-applied or self-adhering vapor-permeable sheet membranes applied continuously over exterior gypsum sheathing, sealed airtight to window perimeter frames, roof air barriers, and foundation transitions.

### 3. Water Vapor Transmission and Permeance Classes

Vapor diffusion through building materials is measured in US Perms (1 perm = 1 grain of water vapor per hour per square foot per inch of mercury vapor pressure difference, ASTM E96):
- Class I Vapor Impermeable (< 0.1 perm): Polyethylene sheet, aluminum foil, unperforated foil facers.
- Class II Vapor Semi-Impermeable (0.1 to 1.0 perm): Kraft paper facing on fiberglass batts, smart polyamide vapor barriers.
- Class III Vapor Semi-Permeable (1.0 to 10.0 perms): Latex paint over gypsum board, standard building paper.
- Vapor Permeable (> 10 perms): Modern breathable commercial weather resistive barriers (WRB).

### Psychrometric Dew Point and Interstitial Condensation Analysis

Agronomists and architectural engineers model the temperature gradient through the wall cross-section to calculate the exact condensing plane (where structural temperature drops below the dew point temperature of indoor air). In cold climates, vapor retarders must be placed on the interior (warm-in-winter) side, or sufficient exterior continuous insulation (ci) must be added to keep the cavity sheathing temperature above the interior dew point.`
    },
    {
      track_id: track3Id,
      title: "Advanced Glazing, Curtain Walls and High-Performance Fenestration",
      order_index: 2,
      content: `### Fenestration Performance Standards (NFRC Ratings)

Window and glazed facade energy performance is rated according to the National Fenestration Rating Council (NFRC):
1. U-Factor: Measures the rate of non-solar heat transfer through the entire fenestration assembly including glass and frame (BTU/hr-ft2-degree F or W/m2-K). Low U-factor indicates superior thermal insulation.
2. Solar Heat Gain Coefficient (SHGC): The fraction of incident solar radiation admitted through the window (scale from 0.0 to 1.0). In cooling-dominated climates, low SHGC (< 0.25) is critical to minimize air conditioning peak loads.
3. Visible Transmittance (VT): The percentage of visible light spectrum (380 to 740 nm) passing through the glazing (typically 0.40 to 0.70), balancing daylighting against glare.
4. Light-to-Solar Gain (LSG): Ratio of VT to SHGC (\`LSG = VT / SHGC\`). High-performance spectrally selective glass achieves LSG ratios exceeding 1.8 to 2.2.

### Low-Emissivity (Low-E) Coatings and Insulated Glass Units (IGU)

- Low-E Sputtered Coatings: Microscopic, nanometer-thin layers of pure metallic silver applied to glass surfaces inside an IGU via Magnetron Sputter Vacuum Deposition (MSVD):
  - Surface #2 Placement (inside of outer pane): Blocks exterior solar heat gain before it enters the glass unit (ideal for warm climates).
  - Surface #3 Placement (outside of inner pane): Reflects interior long-wave radiant heat back into the room (ideal for cold climates).
- IGU Gas Fills and Warm-Edge Spacers: Replacing air with inert, high-density Argon (or Krypton) gas reduces convective internal heat loops by 30%+. Thermally broken stainless steel or composite structural silicone spacers eliminate edge-seal condensation.

### Commercial Curtain Wall Engineering

1. Stick-Built Curtain Walls: Individual aluminum vertical mullions and horizontal transoms are assembled piece-by-piece on the building structural frame, followed by field glazing. Suitable for low to mid-rise construction.
2. Unitized Curtain Walls: Large, floor-to-floor pre-glazed aluminum frame cassettes fabricated in climate-controlled factory environments. Installed rapidly via crane on high-rise towers, utilizing inter-locking split male-female mullions with continuous EPDM dual gaskets.
3. Rainscreen Pressure-Equalization Principle: The outer aluminum gasket line sheds bulk water while the inner air seal creates a sealed pressure-equalization chamber. Internal air pressure instantly matches gusting external wind pressure, eliminating the pressure differential that drives rainwater penetration.`
    },
    {
      track_id: track3Id,
      title: "Sustainable Materials, LCA and Embodied Carbon Mitigation",
      order_index: 3,
      content: `### Operational Carbon vs Embodied Carbon

While operational carbon (energy consumed to heat, cool, and light buildings) declines with energy codes and renewable grids, Embodied Carbon (upfront greenhouse gas emissions generated from raw material extraction, manufacturing, transportation, and construction) accounts for nearly 50% of all new building carbon emissions between now and 2050.

### Environmental Product Declarations (EPDs)

Architectural material selection relies on Type III Environmental Product Declarations (ISO 14025 / EN 15804):
- Third-party certified, publicly verified documents that quantify environmental impacts based on standardized Product Category Rules (PCR).
- Core Reported Metric: Global Warming Potential (GWP), expressed in kilograms of carbon dioxide equivalent (kg CO2e) per declared unit (e.g. per cubic yard of concrete or metric ton of steel).

### Whole Building Life Cycle Assessment (WBLCA)

Governed by ISO 21930 and EN 15978, WBLCA evaluates total environmental footprints across standardized lifecycle modules:
- Module A1-A3 (Cradle-to-Gate): Raw material extraction, raw transport, and plant manufacturing.
- Module A4-A5: Job site transportation and construction installation.
- Module B1-B7: Operational use phase, maintenance, repair, and replacement.
- Module C1-C4 (End-of-Life): Demolition, waste transport, processing, and disposal.
- Module D: Beyond building life benefits (circular reuse, structural steel recycling, energy recovery).

### Practical Embodied Carbon Reduction Strategies

1. Concrete Decarbonization: Specifying maximum GWP limits in structural concrete mixes, mandating 40% to 70% cement replacement with SCMs (slag, fly ash, ground limestone), and extending specified compressive strength verification timelines from 28 days to 56 days for foundations and columns.
2. Structural Steel Optimization: Specifying Electric Arc Furnace (EAF) structural steel made from 95%+ recycled scrap metal (GWP ~ 0.4 to 0.8 kg CO2e/kg steel) rather than carbon-intensive Basic Oxygen Furnace (BOF) virgin iron ore steel (GWP ~ 2.0 to 2.5 kg CO2e/kg steel).
3. Mass Timber Substitution: Replacing concrete slabs and steel framing with CLT and Glulam to sequester atmospheric biogenic carbon directly within the building structure.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #5.");
}

run();
