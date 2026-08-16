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

const skillId = "f6dd6bb4-e31b-498b-b1a6-57cdcdaeb758";

async function run() {
  console.log("Updating Skill #4: Farm Equipment Operation Basics...");

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
  await supabase.from("tracks").update({ title: "Track 1: Tractor Powertrains, Hydraulics and Operational Safety" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Precision Planters, Sprayers and Guidance Systems" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Harvester Mechanics, Logistics and Machinery Maintenance" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Diesel Engine Thermodynamics, Emissions and Powertrains",
      order_index: 1,
      content: `### Heavy-Duty Agricultural Diesel Architecture

Modern agricultural tractors operate under severe, continuous high-load duty cycles. Industrial agricultural diesel engines utilize high-pressure common rail (HPCR) direct fuel injection systems operating at fuel pressures exceeding 2,000 to 2,500 bar (30,000 to 36,000 PSI). Electronic injectors deliver multiple discrete micro-injections per combustion stroke (pilot, main, and post-injection) to optimize peak cylinder pressures and torque curves.

### EPA Tier 4 Final and EU Stage V Aftertreatment Chemistry

Modern agricultural diesels integrate sophisticated multi-stage emissions aftertreatment systems to meet statutory particulate matter (PM) and nitrogen oxide (NOx) limits:
1. Diesel Oxidation Catalyst (DOC): Catalytically oxidizes unburnt hydrocarbons (HC) and carbon monoxide (CO) into carbon dioxide and water vapor.
2. Diesel Particulate Filter (DPF): Wall-flow ceramic honeycomb substrate that physically traps soot and particulate matter. Periodic high-temperature regeneration (passive or active fuel dosing) oxidizes captured carbon into CO2.
3. Selective Catalytic Reduction (SCR): Injects Diesel Exhaust Fluid (DEF, a precise 32.5% aqueous solution of high-purity synthetic urea in deionized water) into the exhaust stream. In the presence of a ceramic catalytic catalyst, the urea vaporizes into ammonia (NH3), converting harmful NOx into harmless atmospheric nitrogen gas (N2) and water vapor.

### Advanced Tractor Transmissions

- Full Powershift Transmissions: Utilizes wet multi-plate clutch packs and planetary gear sets to enable on-the-fly gear shifting across 16 to 24 forward speeds without interrupting power delivery to the drive wheels.
- Continuously Variable Transmissions (CVT / IVT): Hydrostatic-mechanical power-split transmissions that combine a variable displacement hydraulic pump/motor unit with mechanical planetary gear trains. This allows infinite ground speed regulation from 0.05 to 50 km/h entirely independent of engine RPM, optimizing fuel efficiency.

### Ballasting, Static Weight Distribution and Wheel Slip

Maximizing tractive efficiency while mitigating soil compaction requires precise tractor ballasting:
- Static Weight Split Targets:
  - Mechanical Front-Wheel Drive (MFWD): 35% to 40% front axle, 60% to 65% rear axle.
  - Four-Wheel Drive (4WD Articulated): 55% front axle, 45% rear axle (levels out to 50/50 under heavy drawbar draft load).
- Optimal Wheel Slip Range: In firm fields, target wheel slip is 8% to 12%. Wheel slip under 8% indicates over-ballasting (excessive soil compaction and parasitic rolling resistance). Slip exceeding 15% indicates under-ballasting (excessive tire tread wear and severe energy loss).`
    },
    {
      track_id: track1Id,
      title: "Agricultural Hydraulic Systems and Power Take-Off (PTO) Dynamics",
      order_index: 2,
      content: `### Hydraulic System Architecture

Agricultural implements require high-volume, high-pressure hydraulic fluid to operate orbital drive motors, lift cylinders, and fan blowers:

1. Closed-Center Pressure-Flow Compensating (PFC) Systems:
   - Utilizes a variable-displacement axial piston pump with swashplate angle regulation.
   - When no hydraulic function is activated, the swashplate flattens, maintaining standby pressure (approx 20 to 30 bar / 300 to 450 PSI) while pumping near-zero flow, eliminating parasitic engine load.
   - When a remote valve opens, a load-sensing (LS) signal line communicates required pressure back to the pump compensator, tilting the swashplate to supply immediate flow at pressures up to 210 bar (3,000 PSI).

2. Remote Selective Control Valves (SCVs):
   - Tractor in-cab consoles permit digital configuration of continuous flow rate (gallons/minute or liters/minute) and detent timing (e.g. 5-second automatic cylinder stroke) for each remote circuit.

### Power Take-Off (PTO) Standards and Mechanics

The Power Take-Off shaft transfers mechanical rotational torque from the tractor engine directly to driven implements (balers, mowers, grain augers, silage choppers):

- Standard Specifications (ASABE S203):
  - Type 1 (540 RPM): 6-spline shaft, 1-3/8 inch (35 mm) diameter. Rated for light implements up to 85 HP.
  - Type 2 (1,000 RPM): 21-spline shaft, 1-3/8 inch (35 mm) diameter. Rated for medium/high power up to 150 HP.
  - Type 3 (1,000 RPM Heavy-Duty): 20-spline shaft, 1-3/4 inch (45 mm) diameter. Rated for high-horsepower implements exceeding 150 to 300+ HP.

### PTO Horsepower and Torque Mathematics

Mechanical power delivered through the PTO is calculated by the standard formula:

\`\`\`
PTO Horsepower (HP) = (Torque in lb-ft * RPM) / 5252
\`\`\`

Where torque is measured in pound-feet and rotational velocity is 540 or 1,000 RPM.

### PTO Driveline Overload Protection

1. Shear Bolt Couplers: Calibrated sacrificial bolts shear clean under catastrophic overload, disconnecting the drive.
2. Radial Friction Slip Clutches: Spring-loaded friction discs slip momentarily during transient shock loads (e.g. baler plug ingestion).
3. Overrunning Clutches: Allows the driven implement flywheel to freewheel forward when the tractor PTO brake is engaged, preventing heavy implement momentum from back-driving through the tractor transmission.`
    },
    {
      track_id: track1Id,
      title: "Machinery Safety, ROPS and Highway Transport Protocols",
      order_index: 3,
      content: `### Rollover Protective Structures (ROPS)

Tractor rollovers represent the single highest cause of occupational fatalities in agriculture. Engineering safety is governed by OSHA 1928.51 standards:
- Structural Integrity: Certified steel ROPS frames are engineered to absorb catastrophic dynamic impact energy, creating a structural "Zone of Protection" around the operator seat.
- Mandatory Seatbelt Interlock: A ROPS frame is effective only when the operator is wearing the seatbelt. In an overturn without a seatbelt, the operator is thrown from the protective zone and crushed by the cab frame or fenders.

### Three-Point Hitch Geometry and Category Standards

The three-point hitch connects mounted and semi-mounted implements to the tractor chassis via two lower lift arms and one top link:
- Category 1: Up to 45 HP (Top link pin: 3/4 inch; Lower hitch pins: 7/8 inch).
- Category 2: 40 to 100 HP (Top link pin: 1.0 inch; Lower hitch pins: 1-1/8 inch).
- Category 3: 80 to 225 HP (Top link pin: 1-1/4 inch; Lower hitch pins: 1-7/16 inch).
- Category 4: 180 to 400+ HP (Top link pin: 1-3/4 inch; Lower hitch pins: 2.0 inch).

### Hitch Control Modes: Draft Control vs Position Control

1. Position Control: Maintains the implement at an exact, fixed physical elevation relative to the tractor frame (essential for mowers, sprayers, and fertilizer spreaders).
2. Draft Control: Senses draft resistance force exerted on the lower links or top link. When a soil-engaging plow encounters a dense clay pocket or hardpan, the hydraulic draft sensor automatically pulses the lift arms upward momentarily to transfer implement weight to the tractor drive wheels, preventing engine stalling and excessive wheel slip.

### Highway Transport Safety Protocols

- Slow Moving Vehicle (SMV) Emblem: Fluorescent orange reflective triangle mandatory on all equipment operated on public roadways at speeds under 25 MPH (40 km/h).
- Flashing Amber Warning Beacons & Hazard Lights: Must be illuminated whenever navigating public rights-of-way.
- Brake Interlock: Dual left/right steering brake pedals must be mechanically latched together before highway travel to prevent catastrophic single-wheel braking spinouts at road speeds.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Precision Planters: Metering, Downforce and Furrow Geometry",
      order_index: 1,
      content: `### Architecture of Modern Precision Planters

Modern row-crop planters place seeds at exact spacing intervals and uniform depths (1.5 to 2.5 inches) at speeds up to 10 to 12 MPH (16 to 20 km/h).

### Seed Metering and Singulation Technology

1. Vacuum Seed Meters:
   - A variable-speed hydraulic or electric vacuum blower creates negative air pressure behind a rotating polymer seed disc with precision-drilled orifices.
   - Individual seeds are drawn onto each hole. Adjustable dual-sided singulator fingers knock off doubles and triples, achieving 99.5%+ seed singulation accuracy.
2. Electric Drive Row Units:
   - Replaces traditional ground-driven chains, hex shafts, and sprockets with individual high-torque brushless 24V DC electric motors on each row unit. Enables instantaneous row-by-row variable rate seeding and individual row turn compensation (matching seed drop frequency to radius speed during curve planting).
3. High-Speed Flighted Delivery Belts:
   - Replaces gravity drop seed tubes with an active motorized flighted belt (e.g. SpeedTube / ExactEmerge). Seeds are mechanically captured from the meter and deposited downward into the trench at a speed matching the tractor forward velocity, eliminating seed bounce and roll.

### Active Hydraulic Downforce Systems

Maintaining uniform seed depth across varying soil bulk densities requires automated active downforce:
- System Architecture: Each row unit features an integrated load cell pin in the gauge wheel depth assembly, sampling ground contact force at 200 Hz.
- Proportional Hydraulic Actuators: A double-acting hydraulic cylinder applies up to 400 lbs of instantaneous downforce in compacted wheel tracks, or up to 200 lbs of upward lift in soft loose sands.
- Target Gauge Wheel Margin: The system maintains a constant 50 to 100 lbs of residual downforce on the depth gauge wheels, guaranteeing exact target depth while eliminating furrow sidewall compaction.

### Furrow Opening and Closing Assemblies

- Heavy-Duty Double-Disk Openers: 15-inch staggered sharp steel discs cut a clean V-shaped seed trench.
- Seed Firming Devices (Keeton Seed Firmer): Gently presses the seed into the moist furrow floor for optimal seed-to-soil contact.
- Closing Wheel Configurations: Spoked or cast-iron closing wheels fracture trench sidewalls, collapsing moist soil over the seed without surface air pockets.`
    },
    {
      track_id: track2Id,
      title: "Agricultural Sprayers: Nozzle Fluid Dynamics and Drift Mitigation",
      order_index: 2,
      content: `### Self-Propelled Chemical Sprayer Engineering

Modern agricultural sprayers feature 1,000 to 1,600 gallon stainless steel tanks, hydrostatic four-wheel drive, and 90 to 132-foot boom widths with ultrasonic active terrain height control.

### Spray Nozzle Fluid Mechanics and ASABE Standards

Spray nozzle tips atomize liquid chemical solutions into droplets under pressure. The ASABE S572.1 standard classifies droplet size spectra by Volume Median Diameter (VMD / D_v0.5 in microns):
- Very Fine (VF): < 145 microns (High drift hazard; restricted to specialized greenhouse fogging).
- Fine (F): 145 to 225 microns (Excellent contact fungicide/insecticide coverage; high drift risk above 8 MPH wind).
- Medium (M): 226 to 325 microns (Standard for contact herbicides).
- Coarse (C): 326 to 400 microns (Ideal for systemic herbicides like Glyphosate).
- Very Coarse (VC): 401 to 500 microns (Drift reduction standard).
- Extremely Coarse (XC) / Ultra Coarse (UC): > 500 microns (Maximum drift reduction for Dicamba and 2,4-D auxins).

### Drift Reduction Technology: Air-Induction (AI) Nozzles

Air-Induction (Venturi) nozzles incorporate an internal venturi orifice that draws atmospheric air into the fluid mixing chamber. The resulting spray droplet contains microscopic air bubbles. Upon impact with the plant cuticle, the air-filled droplet shatters gently rather than bouncing off, maximizing surface wetting while eliminating fine driftable droplets (< 105 microns).

### Pulse Width Modulation (PWM) Nozzle Control

Traditional sprayers vary system pressure to adjust application rate when ground speed changes. However, varying pressure alters droplet size and spray pattern angle.
Pulse Width Modulation (PWM) decouples flow rate from operating pressure:
- Fast-acting 12V electromagnetic solenoid valves pulse individual nozzles at 10 Hz to 50 Hz.
- Duty Cycle Regulation: Duty cycle (percentage of time the solenoid is open per cycle) varies linearly from 10% to 100% based on ground speed.
- System pressure remains rock-solid at the target operating pressure, maintaining a perfectly constant droplet size spectrum across 5 to 20 MPH speed variations.
- Turn Compensation: Outer boom nozzles automatically pulse at a higher duty cycle than inner boom nozzles during curve turns, maintaining exact target gallons-per-acre application.`
    },
    {
      track_id: track2Id,
      title: "GNSS Guidance, Autosteer and ISOBUS Communication Networks",
      order_index: 3,
      content: `### Satellite Positioning Architecture in Agriculture

Precision agriculture guidance relies on Global Navigation Satellite Systems (GNSS) utilizing multi-frequency L1/L2/L5 signals across GPS, GLONASS, Galileo, and BeiDou constellations.

### Positioning Correction Differential Levels

1. Autonomous Sub-Meter GNSS (WAAS / EGNOS):
   - Pass-to-pass accuracy: +/- 6 to 8 inches (15 to 20 cm).
   - Suitable for broadacre broadcasting, fertilizer spreading, and rough tillage.
2. Decimeter Satellite Correction (TerraStar / OmniSTAR / StarFire):
   - Dual-frequency precise point positioning (PPP) delivered via geostationary L-band satellites.
   - Pass-to-pass accuracy: +/- 1.5 to 2.0 inches (3 to 5 cm).
   - Suitable for cereal seeding and chemical spraying.
3. Real-Time Kinematic (RTK) Differential Correction:
   - Terrestrial local base station or cellular NTRIP IP network transmitting dual-frequency carrier-phase differential corrections at 1 Hz.
   - Absolute repeatable accuracy: +/- 0.5 to 1.0 inch (1.2 to 2.5 cm) year-over-year.
   - Essential for controlled traffic farming (CTF), strip-till, sub-surface drip burial, and precision row-crop planting.

### Automated Steering Actuation

- Integrated Hydraulic Steer Valves: Proportional electro-hydraulic steering valves plumbed directly into the tractor steering orbitrol circuit, receiving guidance corrections from the navigation controller.
- Inertial Measurement Units (IMU): 3-axis gyroscopes and accelerometers calculate roll, pitch, and yaw at 100 Hz, compensating for terrain slope antenna offset errors.

### ISOBUS Protocol (ISO 11783 Standard)

The international ISOBUS standard enables seamless plug-and-play interoperability between tractors and implements of different manufacturers:
- Universal Terminal (UT / Virtual Terminal): Displays implement operating graphics on any standard tractor in-cab touchscreen console.
- Task Controller Basic (TC-BAS) & Geo-Based (TC-GEO): Logs spatial GPS field operations and automatically executes variable rate prescription application maps.
- Section Control (TC-SC): Automatically turns individual planter row units or sprayer boom sections on and off based on GPS boundary mapping to eliminate double-planting and chemical overlapping on headlands.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Combine Harvester Threshing, Separation and Cleaning Systems",
      order_index: 1,
      content: `### Mechanics of Combine Harvesters

A modern combine harvester performs five continuous, synchronized industrial processes: gathering/cutting, feeding, threshing, separation, and cleaning.

### Crop Gathering Platforms

1. Draper Headers: Flexible cutterbars follow ground contours while rubber fabric draper belts convey crop smoothly head-first toward the center feed auger, eliminating feeding bunches in soybeans and small grains.
2. Corn Heads: Rotating gathering chains pull corn stalks into deck plates (stripping plates) where hydraulic knife rolls pull stalks downward at high velocity, snapping off ears without pinching or shelling kernels.

### Threshing and Separation Technologies

- Tangential Cylinder & Concave Systems (Conventional):
  - A transverse spinning rasp-bar cylinder (300 to 1,000 RPM) rubs grain against a stationary curved concave grating. 70% to 80% of grain separates through the concave; the remaining straw moves to reciprocating straw walkers for gravity separation.
- Axial Rotary Systems (Single / Twin Rotor):
  - The crop enters a longitudinal rotor spinning inside a cylindrical cage. Helical guide vanes spiral the crop rearward multiple times through threshing rasp bars and separation grates under centrifugal force (300 to 400 Gs). Provides superior grain quality and lower kernel crackage.

### The Cleaning Shoe Aerodynamics

The cleaning shoe separates threshed grain from chaff (husks, pods, broken straw) using density and aerodynamic drag differentials:
1. Chaffer (Top Sieve): Coarse oscillating louvered sieve.
2. Cleaning Sieve (Bottom Sieve): Fine louvered sieve allowing only clean grain to pass.
3. Centrifugal Cleaning Fan: Blasts high-velocity air upward through the oscillating sieves. The air velocity is calibrated so that lightweight chaff is levitated and blown out the rear, while heavy grain falls through the sieves into the clean grain cross auger.

### Grain Loss Monitoring and Optimization

Piezoelectric impact acoustic sensors located behind the rotor separation grates and shoe sieves detect unthreshed grain strikes. Combine ground speed and fan airflow are adjusted to keep total harvesting losses below 1.0% of total yield.`
    },
    {
      track_id: track3Id,
      title: "Grain Carts, Augers and Field Logistics Optimization",
      order_index: 2,
      content: `### Field Harvest Logistics Architecture

Harvest efficiency depends directly on minimizing combine idle time. A combine harvester must never stop moving to unload.

### Grain Cart Engineering and Capacity Matching

- Grain Cart (Chaser Bin) Capacities: 800 to 1,500+ bushels (20 to 40+ metric tons).
- High-Speed Unloading Augers: 20 to 24-inch vertical and corner augers discharging grain at rates exceeding 500 to 1,000 bushels per minute, capable of emptying an entire cart into a semi-truck trailer in under 90 seconds.
- Hydraulic Directional Spouts: Multi-axis hydraulically adjustable discharge spouts allow the grain cart operator to top off semi-trailers evenly without spilling grain over sideboards.

### Machine-to-Machine (M2M) Telematics and Unload-on-the-Go

- Automated Sync Telematics (e.g. Machine Sync / FieldView Drive): The combine harvester establishes a peer-to-peer radio connection with the grain cart tractor. When the grain cart enters the operational zone, the combine takes automated control of the grain cart tractor steering and forward speed, locking the grain cart perfectly under the combine discharge auger spout.
- In-Field Traffic Management: Grain carts travel exclusively on compacted headlands and designated controlled traffic lanes to prevent widespread soil compaction across the main field interior.

### On-Board Scale Systems and Harvest Data Telemetry

Modern grain carts feature four-point shear beam load cell weigh systems connected to digital indicators and telematics modems. The system automatically records:
- Gross, tare, and net bushel weight per semi-trailer load.
- GPS field name, truck ID, driver name, and grain moisture level.
- Live data streaming directly to farm management software (FMS) for instant grain inventory reconciliation.`
    },
    {
      track_id: track3Id,
      title: "Preventive Maintenance, Tribology and Winterization",
      order_index: 3,
      content: `### Agricultural Tribology and Lubrication Science

Agricultural machinery operates in severe environments exposed to abrasive mineral dust, extreme vibration, and heavy shock loads.

### Lubricating Greases and Base Oil Chemistry

- National Lubricating Grease Institute (NLGI) Standards:
  - NLGI Grade 2 Lithium Complex Grease with 3% to 5% Molybdenum Disulfide (Moly) is the standard for high-load pivot pins, kingpins, and universal joint cross bearings.
  - Solid moly particles plate onto metal surfaces, providing extreme pressure (EP) boundary lubrication when hydrodynamic oil films collapse under shock loads.
- Polyurea Synthetic Greases: Preferred for high-speed sealed electric motor bearings and high-temperature mower spindle hubs.

### Heavy-Duty Diesel Engine Oil Standards

- API CK-4 / FA-4 Specifications: Formulated with advanced shear-stable viscosity index improvers, high Total Base Number (TBN > 9.0) to neutralize acidic combustion byproducts, and low sulfated ash (< 1.0%) to prevent DPF soot filter clogging.
- Viscosity Selection: 15W-40 for conventional summer heavy drawbar operations; 10W-30 or 5W-40 full synthetic for cold-weather winter operations and reduced cold-cranking wear.
- Scheduled Oil Sampling (SOS): Regular laboratory spectrometric analysis testing for wear metals (Iron, Copper, Lead, Aluminum), silica dirt contamination, soot percentage, and glycol coolant leaks.

### Hydraulic and Hydrostatic Fluid Maintenance

- Hydrostatic transmission loops require clean fluid with strict ISO 4406 Cleanliness Codes (e.g. 18/16/13).
- High-efficiency spin-on glass fiber micro-filters with beta ratings (Beta_10 > 200) trap 99.5% of particles larger than 10 microns, preventing premature axial piston pump wear.

### Comprehensive Machinery Winterization Protocols

1. Fuel System Stabilization: Treating bulk and machine fuel tanks with bio-diesel biocides and anti-gel cold flow improvers to prevent paraffin wax drop-out.
2. DEF System Purge: Draining or verifying that tractor automatic DEF reverse-purge pump cycles operate correctly to prevent urea freezing (DEF freezes at -11 degrees C / 12 degrees F, expanding by 7% and cracking plastic header tanks).
3. Electrical Harness Protection: Cleaning all multi-pin harness connectors and applying dielectric silicone grease to inhibit pin fretting corrosion.
4. Chemical Sprayer Winterization: Completely draining spray booms, flushing tanks with RV non-toxic propylene glycol antifreeze (rated to -50 degrees C), and disassembling nozzle check valves to prevent diaphragm frost rupture.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #4.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "What safety component is mandated by OSHA 1928.51 to create a structural protective zone around the tractor operator in the event of an overturn?",
      options: [
        "Rollover Protective Structure (ROPS) paired with a secured seatbelt",
        "Front-mounted iron counterweights",
        "High-output halogen road headlights",
        "Pneumatic air horn system"
      ],
      correct_option_index: 0,
      explanation: "A certified Rollover Protective Structure (ROPS) combined with a fastened seatbelt holds the operator securely within a protective envelope during an overturn, preventing crush fatalities.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What standardized chemical solution is injected into the exhaust stream of a Tier 4 Final agricultural diesel engine equipped with Selective Catalytic Reduction (SCR)?",
      options: [
        "Pure gasoline fuel additive",
        "Liquid anhydrous ammonia fertilizer",
        "Diesel Exhaust Fluid (DEF / 32.5% aqueous urea solution)",
        "Synthetic hydraulic brake fluid"
      ],
      correct_option_index: 2,
      explanation: "DEF is a standardized 32.5% aqueous solution of high-purity synthetic urea in deionized water that breaks down NOx emissions into harmless nitrogen gas and water vapor in SCR systems.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What is the standard rotational operating velocity of an ASABE Type 1 6-spline Power Take-Off (PTO) shaft on utility tractors?",
      options: [
        "1,800 RPM",
        "540 RPM",
        "2,500 RPM",
        "100 RPM"
      ],
      correct_option_index: 1,
      explanation: "An ASABE Type 1 PTO shaft has a 1-3/8 inch diameter with 6 splines and operates at a standard rated velocity of 540 RPM.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What is the primary function of the cleaning shoe fan in an agricultural combine harvester?",
      options: [
        "To cool the hydraulic oil reservoir",
        "To blow harvested grain directly into the grain tank",
        "To shred crop straw into small pieces for bedding",
        "To blow lighter chaff and husks out the rear of the machine while allowing heavier clean grain to fall through the oscillating sieves"
      ],
      correct_option_index: 3,
      explanation: "The cleaning shoe fan provides a controlled aerodynamic airstream that levitates and blows lightweight chaff out the back of the combine while heavier grain falls through the sieves.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What international electronic communication standard enables cross-brand plug-and-play interoperability between tractors and implement terminal consoles?",
      options: [
        "ISOBUS (ISO 11783 Standard)",
        "Bluetooth 5.0 Audio",
        "RS-232 Serial Port",
        "CANopen Marine Standard"
      ],
      correct_option_index: 0,
      explanation: "ISOBUS (ISO 11783) establishes universal hardware and software compatibility between tractor virtual terminals and agricultural implement task controllers across all manufacturers.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "What is the target wheel slip percentage range recommended for agricultural tractors to optimize tractive drawbar efficiency while preventing severe soil compaction?",
      options: [
        "0% to 2% wheel slip",
        "30% to 40% wheel slip",
        "20% to 25% wheel slip",
        "8% to 12% wheel slip"
      ],
      correct_option_index: 3,
      explanation: "An 8% to 12% wheel slip range provides maximum tractive power transfer. Less than 8% indicates over-ballasting and unnecessary compaction, while over 15% causes severe tire wear and energy loss.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "How does Pulse Width Modulation (PWM) nozzle technology improve chemical spraying accuracy compared to traditional pressure-regulated boom sprayers?",
      options: [
        "By heating the chemical solution to 60 degrees C",
        "By pulsing solenoid valves at 10 to 50 Hz to control flow rate independently of line pressure, maintaining constant droplet size across varying ground speeds",
        "By replacing all water carrier volume with compressed air",
        "By operating exclusively with zero GPS connectivity"
      ],
      correct_option_index: 1,
      explanation: "PWM technology modulates nozzle solenoid duty cycles to regulate flow rate precisely as ground speed changes without altering line pressure, keeping droplet size and spray pattern uniform.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What GNSS correction technology utilizes terrestrial base stations or cellular NTRIP networks to achieve +/- 0.5 to 1.0 inch (+/- 2.5 cm) repeatable year-over-year accuracy in autosteer systems?",
      options: [
        "Real-Time Kinematic (RTK) Differential Correction",
        "Wide Area Augmentation System (WAAS)",
        "Autonomous Single-Frequency GPS",
        "Standard EGNOS broadcast"
      ],
      correct_option_index: 0,
      explanation: "RTK differential positioning uses local base station carrier-phase corrections to eliminate atmospheric and orbital satellite errors, achieving sub-inch repeatable accuracy year-over-year.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What hitch control setting automatically senses draft resistance on lower links and momentarily raises a tillage implement to prevent tractor engine stalling when hitting hardpan soil?",
      options: [
        "Float Mode",
        "Position Control Mode",
        "Draft Control Mode",
        "Hydraulic Remote Detent Mode"
      ],
      correct_option_index: 2,
      explanation: "Draft control senses draft load resistance and pulses lift arms upward slightly to transfer implement weight to the tractor drive wheels, maintaining engine power and ground speed through tough spots.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "Which type of agricultural spray nozzle incorporates an internal venturi throat to produce air-filled, coarse droplets that minimize spray drift in windy conditions?",
      options: [
        "Standard Flat Fan nozzle",
        "Hollow Cone nozzle",
        "Centrifugal rotary disc atomizer",
        "Air-Induction (Venturi) nozzle"
      ],
      correct_option_index: 3,
      explanation: "Air-Induction nozzles draw atmospheric air into the fluid chamber via venturi effect, creating coarse air-cushioned droplets that resist wind drift and shatter on leaf contact.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "A tractor PTO dynamometer test measures 750 lb-ft of torque at a standard operating speed of 1,000 RPM. What is the calculated Power Take-Off horsepower delivered to the implement?",
      options: [
        "350.5 HP",
        "142.8 HP",
        "750.0 HP",
        "525.2 HP"
      ],
      correct_option_index: 1,
      explanation: "PTO Horsepower = (Torque * RPM) / 5252 = (750 * 1000) / 5252 = 750,000 / 5252 = 142.80 HP.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "How does a Closed-Center Pressure-Flow Compensating (PFC) hydraulic system minimize parasitic engine horsepower loss when remote control valves are in neutral?",
      options: [
        "By venting all hydraulic fluid directly into the fuel tank",
        "By running a fixed gear pump at maximum relief valve pressure continuously",
        "The swashplate in the variable-displacement axial piston pump flattens, maintaining standby pressure while delivering near-zero flow",
        "By shutting off the engine alternator automatically"
      ],
      correct_option_index: 2,
      explanation: "When hydraulic valves are closed, the PFC pump compensator de-strokes the internal swashplate to near-zero angle, maintaining standby pressure (approx 300 PSI) with zero fluid flow and minimal parasitic drag.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "On a high-speed precision planter operating with automated active hydraulic downforce, how does the control loop prevent furrow sidewall compaction in soft soil while maintaining target depth in compacted wheel tracks?",
      options: [
        "Gauge wheel load cell pins sample ground contact force at 200 Hz, actuating double-acting hydraulic cylinders to apply downforce or upward lift to maintain a constant 50 to 100 lbs gauge wheel margin",
        "By utilizing mechanical steel coil springs set to permanent maximum compression",
        "By slowing the tractor down to 1.0 MPH in soft soil",
        "By filling planter tires with liquid calcium chloride ballast"
      ],
      correct_option_index: 0,
      explanation: "Active downforce systems use load cell pins in the depth gauge wheels to modulate double-acting hydraulic cylinders at 200 Hz, applying downforce in hard ground and active lift in soft soil to maintain target gauge wheel margin.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In lubricating grease science for agricultural machinery, why is an NLGI Grade 2 Lithium Complex grease containing 3% to 5% Molybdenum Disulfide (Moly) specified for heavy-load pivot pins and universal joints?",
      options: [
        "Moly lowers the boiling point of grease to 0 degrees C",
        "Moly turns the grease bright green for aesthetic identification",
        "Moly evaporates instantly upon application to prevent dust attraction",
        "Solid moly platelets plate onto steel surfaces, providing extreme pressure (EP) boundary lubrication when hydrodynamic fluid films collapse under violent shock loads"
      ],
      correct_option_index: 3,
      explanation: "Molybdenum disulfide contains micro-platelets that chemically adhere to metal surfaces, providing solid EP boundary barrier lubrication when high shock loads rupture liquid grease films.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "Why is it critical to verify that an agricultural diesel tractor executes an automated DEF line reverse-purge cycle upon engine shutdown during freezing winter conditions?",
      options: [
        "DEF reacts with cold air to produce corrosive hydrochloric acid",
        "DEF freezes at -11 degrees C (12 degrees F) and expands by 7% in volume, which will crack pump housings, injector valves, and lines if fluid is not purged back into the tank",
        "DEF catches fire if allowed to cool below freezing temperatures",
        "Cold DEF permanently neutralizes all engine oil additives"
      ],
      correct_option_index: 1,
      explanation: "Diesel Exhaust Fluid freezes at -11 degrees C (12 degrees F) and expands 7% like water. If the pump does not reverse-purge lines back into the heated tank upon shutdown, ice expansion fractures lines and pumps.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #4.");
  console.log("Skill #4 update completed successfully!");
}

run();
