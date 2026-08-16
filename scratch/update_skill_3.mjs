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

const skillId = "871897c8-98d1-4087-a650-bff8bf9bb769";

async function run() {
  console.log("Updating Skill #3: Irrigation & Water Management...");

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
  await supabase.from("tracks").update({ title: "Track 1: Soil-Plant-Water Dynamics and Evapotranspiration" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Pressurized and Gravity Irrigation Engineering" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Water Quality, Fertigation and Drainage Engineering" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Soil Water Physics, Water Potentials and Energy States",
      order_index: 1,
      content: `### Thermodynamic Foundations of Soil Water Movement

Water movement through the soil-plant-atmosphere continuum (SPAC) is driven by gradients in Total Soil Water Potential (Psi_total), which measures the potential energy of soil water relative to pure, free water at standard temperature and pressure:

\`\`\`
Psi_total = Psi_matric + Psi_osmotic + Psi_gravitational + Psi_pressure
\`\`\`

Where:
- Matric Potential (Psi_matric): Negative pressure caused by capillary meniscus curvature and adhesive adsorptive forces of soil colloids. This is the primary force binding water in unsaturated soil.
- Osmotic Potential (Psi_osmotic): Negative potential caused by dissolved mineral salts in the soil solution.
- Gravitational Potential (Psi_gravitational): Positive potential driven by elevation relative to a defined reference plane.
- Pressure Potential (Psi_pressure): Positive hydrostatic pressure in saturated zones beneath the water table.

### Standard Soil Moisture Constants

1. Saturation (0 kPa / 0 bars):
   - All soil pores (macropores and micropores) are completely filled with water. Gaseous oxygen is absent.
2. Field Capacity (FC) (-10 to -33 kPa / -0.1 to -0.33 bars):
   - The soil water content remaining after excess gravitational water has drained freely from macropores (typically 24 to 48 hours after saturating rain or irrigation).
3. Permanent Wilting Point (PWP) (-1500 kPa / -15 bars):
   - The soil water content at which plant root suction can no longer extract water against soil matric forces. Plants wilt irreversibly and suffer permanent tissue death.
4. Available Water Capacity (AWC):
   - The quantity of water stored in the soil profile between Field Capacity and Permanent Wilting Point:
\`\`\`
AWC = FC - PWP
\`\`\`
   - Coarse Sand: 0.5 to 1.0 inches of water per foot of soil depth.
   - Sandy Loam: 1.2 to 1.6 inches per foot.
   - Silt Loam: 2.0 to 2.5 inches per foot (Optimal storage).
   - Clay Loam: 1.6 to 2.0 inches per foot.

### Management Allowed Depletion (MAD)

Irrigation scheduling never allows soil moisture to deplete to PWP. Agronomists establish Management Allowed Depletion (MAD) thresholds representing the maximum fraction of AWC that can be extracted before crop yield or quality is reduced:
- Agronomic Row Crops (Corn, Soybeans, Wheat): MAD = 50%.
- Moisture-Sensitive Horticultural Crops (Potatoes, Onions, Crisphead Lettuce): MAD = 25% to 35%.`
    },
    {
      track_id: track1Id,
      title: "Crop Evapotranspiration (ET) and Atmospheric Water Demand",
      order_index: 2,
      content: `### Physics of Evapotranspiration

Crop Evapotranspiration represents the combined loss of water via direct evaporation from the soil surface (E) and transpiration through active plant leaf stomata (T).

### The FAO-56 Penman-Monteith Reference Equation

Standard agricultural engineering calculates Reference Evapotranspiration (ET_0) for a hypothetical well-watered, actively growing grass reference crop (0.12 m height, albedo 0.23, surface resistance 70 s/m) using the standardized FAO-56 Penman-Monteith equation:

\`\`\`
ET_0 = [ 0.408 * Delta * (R_n - G) + gamma * (900 / (T + 273)) * u_2 * (e_s - e_a) ] / [ Delta + gamma * (1 + 0.34 * u_2) ]
\`\`\`

Where:
- R_n is net radiation at the crop surface (MJ/m2/day).
- G is soil heat flux density (MJ/m2/day).
- T is mean daily air temperature at 2 m height (degrees C).
- u_2 is wind speed at 2 m height (m/s).
- e_s - e_a is the Vapor Pressure Deficit (VPD) of the air (kPa).
- Delta is the slope of the saturation vapor pressure curve (kPa/degree C).
- gamma is the psychrometric constant (kPa/degree C).

### Crop Coefficients (K_c) and Actual Crop Water Use

Actual Crop Evapotranspiration (ET_c) under standard non-stressed conditions is calculated by scaling reference ET_0 by a specific phenological Crop Coefficient (K_c):

\`\`\`
ET_c = K_c * ET_0
\`\`\`

The K_c curve transitions through four distinct physiological growth phases:
1. Initial Stage (K_c_ini, 0.30 to 0.40): Dominated by soil surface evaporation prior to canopy closure.
2. Crop Development Stage: Rapid canopy expansion; K_c rises linearly as transpiration accelerates.
3. Mid-Season Stage (K_c_mid, 1.05 to 1.25): Full canopy coverage, maximum anthesis, peak transpiration water consumption.
4. Late-Season Stage (K_c_end, 0.50 to 0.60): Leaf senescence, grain dry-down, and physiological maturity.

In advanced water budgeting, the Dual Crop Coefficient approach splits K_c into basal transpiration (K_cb) and direct soil surface evaporation (K_e): \`ET_c = (K_cb + K_e) * ET_0\`.`
    },
    {
      track_id: track1Id,
      title: "Atmospheric Water Balance and Checkbook Irrigation Scheduling",
      order_index: 3,
      content: `### The Soil Water Balance Checkbook Method

The Checkbook Method tracks the root zone soil water deficit (D) like a bank checking account:

\`\`\`
D_end = D_start - Effective_Rain - Net_Irrigation + ET_c + Deep_Percolation + Runoff
\`\`\`

Where:
- D_start: Starting root zone soil water deficit (inches or mm).
- Effective Rain: Total precipitation minus surface runoff and deep percolation beyond the active root zone.
- Net Irrigation: Gross applied irrigation water multiplied by system Application Efficiency (E_a).
- ET_c: Daily crop evapotranspiration consumed.

An irrigation event is triggered whenever the accumulated deficit reaches the Management Allowed Depletion threshold (\`D_end >= MAD * AWC * Root_Depth\`).

### In-Situ Soil Moisture Monitoring Technologies

1. Volumetric Water Content (VWC, theta_v = Volume of Water / Total Soil Volume):
   - Time Domain Reflectometry (TDR): Measures high-frequency electromagnetic wave propagation velocity along metallic waveguides, which is directly proportional to soil dielectric permittivity (water = 80, dry mineral soil = 3 to 5).
   - Frequency Domain Reflectometry (FDR) & Capacitance Probes: Measures the resonant electrical frequency of an LC circuit formed with surrounding soil, providing continuous automated logging across multiple profile depths (e.g. 10, 20, 30, 40 inches).

2. Soil Water Tension / Matric Potential Sensors:
   - Tensiometers: Water-filled porous ceramic cups connected to a vacuum gauge. Measures actual soil matric tension directly from 0 to 80 kPa (ideal for sandy soils and drip-irrigated vegetables; cavitation occurs above 85 kPa).
   - Granular Matrix Sensors (Watermark): Porous ceramic matrix containing embedded electrodes that measure electrical resistance as water moves into equilibrium with surrounding soil tension (calibrated from 0 to 200 kPa).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Pressurized Micro-Irrigation and Drip System Hydraulics",
      order_index: 1,
      content: `### Hydraulic Design of Agricultural Drip Systems

Micro-irrigation delivers water directly to the crop root zone at low pressures (10 to 30 PSI / 70 to 200 kPa) and low discharge rates (0.5 to 4.0 Liters/hour per emitter). A complete drip irrigation network comprises:
1. Pumping Station & Filtration Complex.
2. Mainline and Submain Manifold Distribution Network.
3. Polyethylene Lateral Drip Lines with Pressure-Compensating (PC) Emitters.
4. Pressure Regulators, Air/Vacuum Relief Valves, and Flush Manifolds.

### Pipe Friction Loss and Hydraulic Modeling

Friction head loss in mainlines and lateral tubing is calculated using the Hazen-Williams empirical formula:

\`\`\`
h_f = 10.67 * (L * Q^1.852) / (C^1.852 * D^4.87)
\`\`\`

Where h_f is friction head loss (m), L is pipe length (m), Q is flow rate (m3/s), D is internal pipe diameter (m), and C is the Hazen-Williams roughness coefficient (C = 150 for smooth plastic PVC/PE).

Along multi-outlet lateral drip lines, total friction loss is modified by the Christiansen Reduction Factor (F) to account for decreasing discharge along the pipe length: \`h_f_lateral = F * h_f\`.

### Emission Uniformity (EU) and Field Performance

System distribution uniformity is quantified by the Design Emission Uniformity (EU):

\`\`\`
EU = 100 * [ 1 - (1.27 * CV / sqrt(n)) ] * (q_min / q_avg)
\`\`\`

Where CV is the manufacturer's Coefficient of Variation for emitter discharge, n is the number of emitters per plant, q_min is the average discharge of the lowest 25% of emitters, and q_avg is the mean system emitter discharge. An EU > 90% is classified as excellent.

### Drip Line Filtration and Chemical Maintenance

- Filtration Standards: Emitters with small orifice pathways require filtration down to 120 to 200 mesh (130 to 75 microns). Media (crushed silica sand) filters are essential for surface water containing organic algae and biological silt.
- Acid Injection: Periodic injection of sulfuric, hydrochloric, or phosphoric acid to lower water pH to 5.5 dissolves calcium carbonate and magnesium precipitates that clog emitter labyrinths.
- Chlorination: Continuous chlorination (1 to 2 ppm free chlorine) or shock chlorination (20 to 50 ppm free chlorine for 60 minutes) oxidizes dissolved iron/manganese and lyses bacterial biofilm slimes.`
    },
    {
      track_id: track2Id,
      title: "Mechanized Center-Pivot and Linear-Move Sprinkler Systems",
      order_index: 2,
      content: `### Mechanics of Center-Pivot Irrigation

Center-pivots are the dominant mechanized sprinkler systems worldwide, irrigating circular fields of 120 to 160 acres (typically 400 meters in radius). The structure consists of a fixed central pivot point supplying electrical power and pressurized water to multiple truss spans supported on wheeled motorized drive towers.

### Radial Sprinkler Nozzle Sizing

Because the area swept per unit of time increases with the square of the distance from the pivot center, sprinkler nozzle flow rates must increase continuously along the radial length of the pivot:

\`\`\`
q_r = (2 * pi * r * w * d) / T
\`\`\`

Where q_r is the required discharge at radial distance r, w is span width, d is gross application depth, and T is total rotation time. Sprinklers near the pivot center emit small droplet streams, whereas sprinklers near the outer overhang emit heavy discharges exceeding 20 to 50 gallons/minute per drop.

### Modern Application Packages and Pressure Regulators

1. Mid-Elevation Spray Application (MESA): Sprinklers positioned 5 to 8 feet above ground on flexible drop hoses.
2. Low-Elevation Spray Application (LESA): Sprinklers positioned 1 to 2 feet above the crop canopy, drastically reducing Wind Drift and Evaporation Losses (WDEL).
3. Low-Energy Precision Application (LEPA): Bubble nozzles discharge water directly into furrow basins at low pressure (6 to 10 PSI), achieving 95%+ application efficiency.
4. Inline Pressure Regulators: Each nozzle is equipped with an engineered spring-loaded pressure regulator (typically 10, 15, or 20 PSI) to ensure identical discharge regardless of field elevation changes.

### Christiansen Uniformity Coefficient (CU) Testing

Sprinkler distribution uniformity is audited in the field using catch-can matrices and the Christiansen Uniformity Coefficient:

\`\`\`
CU = 100 * [ 1 - (Sum |X_i - X_mean| / (n * X_mean)) ]
\`\`\`

Where X_i is individual catch can catch depth, X_mean is average catch depth, and n is total catch cans. A CU > 85% is required for uniform crop emergence and nitrogen fertigation.`
    },
    {
      track_id: track2Id,
      title: "Surface Irrigation Hydraulics: Furrow, Border and Basin Systems",
      order_index: 3,
      content: `### Fluid Mechanics of Surface Irrigation

Surface irrigation utilizes gravity to distribute water across the soil surface. The operational cycle consists of four distinct chronological phases:
1. Advance Phase: Water is introduced at the field inlet and advances down the furrow or border strip toward the end of the field.
2. Storage Phase: The water volume builds up on the soil surface between the inlet and the advancing wetting front.
3. Depletion Phase: Inflow is shut off at the inlet; ponded surface water continues to drain and infiltrate.
4. Recession Phase: The surface water front recedes downfield until all ponded water has fully infiltrated into the soil profile.

### Manning's Equation for Open Channel and Furrow Flow

Flow velocity in irrigation furrows and conveyance canals is modeled using Manning's equation:

\`\`\`
V = (1 / n) * R^(2/3) * S^(1/2)
\`\`\`

Where V is cross-sectional mean velocity (m/s), n is Manning's roughness coefficient (0.02 to 0.04 for agricultural furrows), R is the hydraulic radius (cross-sectional area A divided by wetted perimeter P), and S is the energy slope / furrow grade (m/m).

### Infiltration Opportunity Time and Deep Percolation

Because water enters the top of the field first and recedes last, the upper end of the field experiences a significantly longer Infiltration Opportunity Time than the lower end. In conventional furrow systems, this leads to excessive deep percolation losses at the field head and deficit under-irrigation at the field tail.

### Advanced Surface Management Technologies

- Surge Irrigation: Applying water in intermittent, cycled pulses (e.g. 30 minutes on, 30 minutes off) rather than continuous inflow. Wetting and drying cycles seal surface soil pores, smoothing the furrow bed and accelerating the advance phase by 30% to 50%, which drastically reduces deep percolation at the head end.
- Gated Pipe and Cablegation: Low-pressure aluminum or PVC pipes with adjustable slide gates to control precise gallon-per-minute inflow into individual furrows.
- Tailwater Recovery and Reuse Systems: Excavated retention sumps at the bottom of the field collect runoff water, which is pumped back to the field head to achieve 85%+ overall surface irrigation efficiency.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Irrigation Water Quality, Salinity and Sodicity Chemistry",
      order_index: 1,
      content: `### Chemical Evaluation of Agricultural Irrigation Water

Irrigating with poor-quality water degrades soil structure, causes specific ion toxicities, and induces osmotic drought stress.

### 1. Salinity Hazard (Osmotic Potential Stress)
- Electrical Conductivity of Irrigation Water (EC_w) measured in deciSiemens per meter (dS/m) or millimhos/cm (1 dS/m = 640 ppm Total Dissolved Solids - TDS).
- High dissolved salt concentrations lower the osmotic potential of soil water, making it thermodynamically impossible for crop roots to absorb moisture even in moist soil (physiological drought).
- Maas-Hoffman Salinity Thresholds: Crops exhibit distinct salinity tolerance thresholds (EC_e):
  - Sensitive (Beans, Strawberries): Yield loss begins at EC_e > 1.0 dS/m.
  - Moderately Tolerant (Corn, Alfalfa): Threshold 1.7 to 2.0 dS/m.
  - Highly Tolerant (Barley, Cotton, Sugarbeets): Threshold 7.0 to 8.0 dS/m.

### 2. Sodicity Hazard and Soil Dispersion (SAR)

Excessive Sodium (Na+) relative to Calcium (Ca2+) and Magnesium (Mg2+) degrades soil physical structure. When sodium saturates clay exchange sites, soil aggregates disperse, clogging soil pores and causing surface crusting and zero water infiltration.
The Sodicity Hazard is quantified by the Sodium Adsorption Ratio (SAR):

\`\`\`
SAR = [ Na+ ] / sqrt( ([ Ca2+ ] + [ Mg2+ ]) / 2 )
\`\`\`

Where cation concentrations are expressed in milliequivalents per liter (meq/L).
- Infiltration Hazard Interaction: Low-salinity water (low EC_w) combined with high SAR causes the most catastrophic soil dispersion. Highly saline water (high EC_w) can partially counteract sodium dispersion by compressing the electrical double layer of clay platelets.

### 3. The Leaching Requirement (LR)

To prevent progressive root zone salt accumulation in irrigated agriculture, a fraction of applied water must pass entirely through the root zone to leach salts into deep subsoil drainage:

\`\`\`
LR = EC_w / (5 * EC_e_threshold - EC_w)
\`\`\`

Where EC_e_threshold is the maximum soil salinity the specific crop can tolerate without yield loss. Total irrigation water required is: \`Gross Irrigation = Net Crop ET / (1 - LR)\`.`
    },
    {
      track_id: track3Id,
      title: "Fertigation and Chemigation Engineering",
      order_index: 2,
      content: `### Precision Nutrient Injection via Irrigation Systems

Fertigation delivers soluble fertilizers directly through pressurized irrigation systems, synchronizing nutrient delivery with daily crop uptake curves.

### Chemical Injection Technologies

1. Positive Displacement Injector Pumps (Electric Piston / Diaphragm Pumps):
   - Delivers precise, adjustable injection volumes against high system line pressures. Essential for precise proportional dosing.
2. Hydraulic Venturi Injectors (Mazzei Injectors):
   - Operates on Bernoulli's Principle: Pressurized water passes through a constricted throat, creating a localized pressure drop (vacuum) that draws chemical solution into the stream.
3. Proportional Hydraulic Water-Powered Injectors (Dosatron):
   - Driven entirely by mainline water flow, maintaining exact chemical dilution ratios (e.g. 1:100 or 1:500) independent of water pressure variations.

### Chemical Compatibility and Precipitation Prevention

Mixing incompatible concentrated fertilizers causes immediate chemical precipitation, permanently clogging drip emitters and destroying filtration media:
- The Golden Fertigation Rule: Never mix Calcium sources (Calcium Nitrate) with Phosphate fertilizers (MAP, MKP, Phosphoric Acid) or Sulfate fertilizers (Ammonium Sulfate, Potassium Sulfate, Magnesium Sulfate) in the same concentrated stock tank.
- Dual Stock Tank Configuration:
  - Tank A: Calcium Nitrate, Potassium Nitrate, Iron Chelates (EDTA/DTPA).
  - Tank B: Monoammonium Phosphate (MAP), Monopotassium Phosphate (MKP), Potassium Sulfate, Magnesium Sulfate, Micronutrients.
  - Tank C (Acid Tank): Phosphoric, Nitric, or Sulfuric Acid for continuous pH regulation.

### Critical Safety and Environmental Backflow Prevention

Chemigation laws mandate automated fail-safe interlocks to prevent catastrophic chemical backflow into agricultural groundwater aquifers:
1. Reduced Pressure Zone (RPZ) or Double Check Valve Backflow Preventer on the water supply.
2. Positive-Closing Chemical Injection Check Valve (10 PSI cracking pressure) preventing water from siphoning back into the chemical supply tank.
3. Low-Pressure Sensor & Interlock Switch: Automatically cuts off the chemical injection pump if the irrigation water pump loses pressure or shuts down.`
    },
    {
      track_id: track3Id,
      title: "Subsurface Tile Drainage, Groundwater Hydrology and Water Law",
      order_index: 3,
      content: `### Agricultural Drainage Engineering

Excessive root zone waterlogging causes anaerobic conditions, root hypoxia, and denitrification. Subsurface tile drainage removes gravitational water from the crop root zone while preserving capillary water.

### Hooghoudt's Drainage Equation for Tile Spacing

The horizontal spacing (S) between buried corrugated perforated plastic drainage pipes (tiles) installed above an impermeable barrier layer is modeled using Hooghoudt's steady-state equation:

\`\`\`
S^2 = [ 4 * K_1 * m^2 + 8 * K_2 * d * m ] / q
\`\`\`

Where:
- S: Drain pipe spacing (meters).
- K_1, K_2: Hydraulic conductivity of soil layers above and below the drain depth (m/day).
- m: Height of the water table crest above the drain centerline mid-way between drains (meters).
- d: Equivalent depth to the impermeable layer (meters).
- q: Drainage design coefficient (steady recharge rate per day, typically 0.01 to 0.025 m/day).

### Groundwater Aquifer Hydrology

- Unconfined (Water Table) Aquifers: The upper boundary is the atmospheric phreatic surface. Direct surface recharge occurs rapidly.
- Confined (Artesian) Aquifers: Trapped beneath impermeable confining aquitard layers under hydrostatic pressure.
- Pumping Cone of Depression and Well Drawdown: Pumping water from an agricultural well creates a localized hydraulic cone of depression. If pumping extraction exceeds the natural recharge rate, regional water tables collapse (aquifer overdraft), inducing land subsidence and well dry-ups.

### Agricultural Water Rights and Legal Doctrines

1. Riparian Doctrine (Dominant in Eastern US and Europe):
   - Landowners whose property borders a natural watercourse have equal, correlative rights to reasonable use of water.
2. Prior Appropriation Doctrine (Dominant in Western US and Arid Regions):
   - "First in time, first in right." Senior water right holders have complete statutory priority to divert their allocated acre-feet volume over junior right holders during drought shortages.
3. Groundwater Governance Districts: Regulatory metering, seasonal allocation quotas, and tradable groundwater pumping credits.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #3.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "What soil moisture constant represents the water content remaining in the soil after gravitational water has completely drained away from macropores?",
      options: [
        "Saturation (0 kPa)",
        "Permanent Wilting Point (-1500 kPa)",
        "Field Capacity (-10 to -33 kPa)",
        "Hygroscopic Coefficient (-3100 kPa)"
      ],
      correct_option_index: 2,
      explanation: "Field Capacity represents the moisture level of soil after excess gravitational water has drained freely (typically 24 to 48 hours after saturating irrigation).",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In the universal crop evapotranspiration formula ET_c = K_c * ET_0, what does the variable ET_0 represent?",
      options: [
        "Reference Evapotranspiration of a standardized, well-watered grass crop",
        "Total volume of rainfall collected in on-farm storage reservoirs",
        "Electrical Conductivity of the irrigation water supply",
        "Estimated depth of tile drainage pipes"
      ],
      correct_option_index: 0,
      explanation: "ET_0 is Reference Evapotranspiration, calculated using meteorological variables for a standard well-watered grass reference crop via the Penman-Monteith equation.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What is the primary operational advantage of Low-Energy Precision Application (LEPA) bubble packages installed on center-pivot irrigation systems?",
      options: [
        "They shoot water 200 feet into the air to increase humidity",
        "They eliminate the need for agricultural electricity on the farm",
        "They increase water pressure to over 100 PSI",
        "They discharge water directly into furrows at low pressure (6 to 10 PSI), achieving 95%+ efficiency by minimizing wind drift and evaporation"
      ],
      correct_option_index: 3,
      explanation: "LEPA systems operate at ultra-low pressures (6 to 10 PSI) and apply water directly at ground level, drastically reducing wind drift and evaporation losses.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What is the standard agronomic definition of Available Water Capacity (AWC) in an agricultural soil profile?",
      options: [
        "Total water present at saturation minus water at Field Capacity",
        "The fraction of soil water held between Field Capacity (FC) and Permanent Wilting Point (PWP)",
        "The total volume of gravitational water lost to deep aquifers",
        "The water volume held in the soil when matric potential is exactly zero"
      ],
      correct_option_index: 1,
      explanation: "Available Water Capacity is mathematically defined as AWC = FC - PWP, representing the capillary water reservoir accessible by crop root systems.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In fertigation management, why must Calcium Nitrate never be mixed in the same concentrated stock solution tank with Monoammonium Phosphate (MAP) or Potassium Sulfate?",
      options: [
        "The mixture releases toxic chlorine gas into the atmosphere",
        "The combination freezes at standard room temperature",
        "Calcium reacts chemically with phosphates and sulfates to form insoluble precipitates that permanently clog drip emitters",
        "The mixture neutralizes all nitrogen content instantly"
      ],
      correct_option_index: 2,
      explanation: "Dissolved calcium ions react immediately with phosphate and sulfate anions to form insoluble calcium phosphate and calcium sulfate precipitates, which clog irrigation emitters.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "Which soil moisture sensing instrument measures soil matric potential (tension) directly via a water-filled porous ceramic cup from 0 to 80 kPa?",
      options: [
        "Time Domain Reflectometry (TDR) probe",
        "Vacuum Tensiometer",
        "Capacitance frequency probe",
        "Neutron thermalization probe"
      ],
      correct_option_index: 1,
      explanation: "Tensiometers measure the physical matric tension exerted by the soil matrix on a water-filled ceramic tip, reading directly on a vacuum gauge from 0 to 80 kPa.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "How is the Sodium Adsorption Ratio (SAR) of irrigation water mathematically calculated to determine sodicity hazard and soil structural dispersion?",
      options: [
        "SAR = (Na+ + Ca2+) divided by Mg2+",
        "SAR = Na+ multiplied by Total Dissolved Solids",
        "SAR = (Ca2+ + Mg2+) divided by EC_w",
        "SAR = [ Na+ ] / sqrt( ([ Ca2+ ] + [ Mg2+ ]) / 2 )"
      ],
      correct_option_index: 3,
      explanation: "SAR = [Na+] / sqrt(([Ca2+] + [Mg2+]) / 2), where ion concentrations are in meq/L. High SAR values indicate high sodium relative to calcium/magnesium, causing severe soil dispersion.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "Under FAO-56 dual crop coefficient methodology, how is daily Actual Crop Evapotranspiration (ET_c) calculated from reference ET_0?",
      options: [
        "ET_c = (K_cb + K_e) * ET_0",
        "ET_c = (K_cb multiplied by K_e) divided by ET_0",
        "ET_c = ET_0 minus K_cb",
        "ET_c = (K_cb + ET_0) multiplied by MAD"
      ],
      correct_option_index: 0,
      explanation: "In dual crop coefficient modeling, K_c is partitioned into basal crop transpiration (K_cb) and direct soil evaporation (K_e): ET_c = (K_cb + K_e) * ET_0.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What periodic chemical injection procedure is required in agricultural drip irrigation systems to dissolve calcium carbonate mineral scale clogging emitter labyrinths?",
      options: [
        "Continuous sodium hydroxide injection to raise pH to 10.0",
        "Potassium chloride salt shock injection",
        "Acid injection (sulfuric, hydrochloric, or phosphoric acid) to lower line water pH to 5.5 to 6.0",
        "Copper sulfate injection at 500 ppm"
      ],
      correct_option_index: 2,
      explanation: "Injecting acid to lower line pH dissolves carbonate and bicarbonate scale deposits, restoring full emitter labyrinth flow paths.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "A commercial corn field has an Available Water Capacity (AWC) of 2.0 inches per foot, a rooting depth of 3.0 feet, and a Management Allowed Depletion (MAD) of 50%. What is the maximum allowable soil water deficit before irrigation must be triggered?",
      options: [
        "1.5 inches of water deficit",
        "3.0 inches of water deficit",
        "6.0 inches of water deficit",
        "0.75 inches of water deficit"
      ],
      correct_option_index: 1,
      explanation: "Total Available Water = 2.0 in/ft * 3.0 ft = 6.0 inches. Maximum Allowable Deficit = 6.0 inches * 50% MAD = 3.0 inches.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "An agricultural irrigation water source has an electrical conductivity of EC_w = 1.2 dS/m. The crop being grown has a salinity threshold of EC_e_threshold = 2.0 dS/m. What is the calculated Leaching Requirement (LR) to prevent root zone salt accumulation?",
      options: [
        "6.0%",
        "30.0%",
        "50.0%",
        "13.6%"
      ],
      correct_option_index: 3,
      explanation: "LR = EC_w / (5 * EC_e_threshold - EC_w) = 1.2 / (5 * 2.0 - 1.2) = 1.2 / (10.0 - 1.2) = 1.2 / 8.8 = 0.136 (13.6%).",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In subsurface agricultural drainage engineering, which mathematical equation is used to calculate the optimum lateral spacing between buried perforated drainage tiles based on soil hydraulic conductivity and water table crest height?",
      options: [
        "Hooghoudt's Steady-State Drainage Equation (S^2 = (4*K_1*m^2 + 8*K_2*d*m) / q)",
        "Hazen-Williams Pipe Friction Formula",
        "Penman-Monteith Thermodynamic Equation",
        "Christiansen Uniformity Equation"
      ],
      correct_option_index: 0,
      explanation: "Hooghoudt's equation models lateral drain spacing (S) as a function of upper/lower soil hydraulic conductivities (K_1, K_2), water table crest elevation (m), equivalent depth (d), and steady drainage coefficient (q).",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In center-pivot irrigation hydraulics, why must sprinkler nozzle orifice diameters increase continuously as nozzle placement moves further outward along the radial pivot span?",
      options: [
        "Water pressure drops to zero at the outer overhang",
        "Outer soil has higher sand content than central soil",
        "The ground area swept per unit time increases with the square of the distance from the central pivot point, requiring higher discharge rates to apply uniform depth",
        "Outer nozzles operate at higher RPM than inner nozzles"
      ],
      correct_option_index: 2,
      explanation: "As radial distance (r) increases, each span covers a vastly larger concentric circular area per revolution. Nozzle flow rates must increase proportionally (q_r = 2*pi*r*w*d / T) to maintain uniform application depth.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "How does surge irrigation improve application efficiency and reduce deep percolation losses in gravity furrow systems compared to continuous flow?",
      options: [
        "By utilizing high-pressure booster pumps to vaporize water into fog",
        "Intermittent on/off pulsing of furrow inflow causes soil surface particles to settle and seal pores, reducing intake rate and speeding up the advance front downfield",
        "By heating water to 40 degrees C to lower surface tension",
        "By forcing water to bypass the topsoil directly into subsurface bedrock"
      ],
      correct_option_index: 1,
      explanation: "Surge irrigation pulses water intermittently down furrows. During off-phases, soil pores consolidate and seal, drastically reducing infiltration rate and allowing subsequent pulses to advance rapidly to the field tail.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In agricultural water rights legal doctrine, what distinguishes the Prior Appropriation Doctrine from the Riparian Doctrine?",
      options: [
        "Prior Appropriation grants priority based on historical diversion date ('first in time, first in right') regardless of land proximity, whereas Riparian rights attach strictly to waterfront land ownership",
        "Prior Appropriation is restricted entirely to rainwater harvesting systems",
        "Riparian rights expire after 12 months, whereas Prior Appropriation rights are non-transferable",
        "Prior Appropriation requires 100% federal government ownership of all agricultural crops"
      ],
      correct_option_index: 0,
      explanation: "Prior Appropriation allocates water rights based on historical priority of beneficial use ('first in time, first in right') without requiring riparian land ownership, whereas Riparian doctrine grants rights exclusively to waterfront landowners.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #3.");
  console.log("Skill #3 update completed successfully!");
}

run();
