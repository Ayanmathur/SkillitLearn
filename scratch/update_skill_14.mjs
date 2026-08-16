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

const skillId = "824b7bc4-41d7-4ed4-94e4-3bf046132838";

async function run() {
  console.log("Updating Skill #14: Engine Systems Fundamentals (9 steps across 3 tracks)...");

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
        title: `Track ${tracks.length + 1}: Engine Systems`,
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
  await supabase.from("tracks").update({ title: "Track 1: Engine Thermodynamics, Block Metallurgy and Rotating Assembly" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Cylinder Heads, Valvetrain Dynamics and Forced Induction" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Lubrication Tribology, Cooling and Combustion Diagnostics" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Internal Combustion Thermodynamics, Air-Standard Cycles and Output Math",
      order_index: 1,
      content: `### Thermodynamic Foundations of Internal Combustion Engines

Internal combustion engines convert chemical bond energy in hydrocarbon fuels into mechanical rotational torque through cyclic thermal expansion:

1. The Four-Stroke Operating Cycle:
   - Intake Stroke: Piston descends from Top Dead Center (TDC) to Bottom Dead Center (BDC), drawing in air-fuel charge.
   - Compression Stroke: Piston ascends, compressing the charge in a closed cylinder.
   - Power Stroke: Combustion rapidly elevates cylinder pressure (60 to 120+ bar), forcing the piston downward.
   - Exhaust Stroke: Piston ascends with exhaust valve open, scavenging burnt combustion gases.

2. Thermodynamic Air-Standard Cycles:
   - Otto Cycle (Constant-Volume Combustion): Thermal efficiency is governed exclusively by the geometric compression ratio (r) and specific heat ratio (gamma = 1.4 for air):
\`\`\`
Thermal Efficiency (eta_th) = 1 - [1 / (r^(gamma - 1))]
\`\`\`
   - Atkinson & Miller Cycles: Delays intake valve closing (IVC) late into the compression stroke. Reduces effective compression stroke while maintaining a full expansion stroke, lowering pumping losses and achieving 40%+ thermal efficiency in hybrid powertrains.

3. Engine Performance Metrics and Power Calculations:
   - Brake Mean Effective Pressure (BMEP): Theoretical average cylinder pressure producing shaft torque:
\`\`\`
BMEP (PSI) = (BHP * 792,000) / (Displacement in CID * RPM)
\`\`\`
   - Brake Horsepower Formula:
\`\`\`
Brake Horsepower (BHP) = (Torque in lb-ft * Engine RPM) / 5252
\`\`\`
   - Brake Specific Fuel Consumption (BSFC, g/kWh): Measures mass fuel consumption per unit power output.`
    },
    {
      track_id: track1Id,
      title: "Engine Block Metallurgy, Cylinder Liners and Head Gasket Sealing",
      order_index: 2,
      content: `### Metallurgy and Structural Mechanics of the Engine Block

The cylinder block serves as the rigid structural foundation supporting reciprocating cylinder forces:

1. Block Materials and Bore Technologies:
   - Cast Grey Iron (ASTM Class 35/40): Lamellar graphite microstructures provide extreme compressive strength, vibration dampening, and high thermal stability.
   - Cast Aluminum Alloys (A380 / A356): High thermal conductivity and lightweight properties. Requires wear-resistant bore technologies:
     - Cast-in-place ductile grey iron cylinder liners.
     - Nikasil / Plasma Transfer Wire Arc (PTWA) Thermal Spray Coating: Atomized steel alloy coatings (150 to 250 microns thick) applied directly to aluminum cylinder bores, eliminating heavy iron sleeves while reducing frictional drag.

2. Cylinder Bore Geometry and Plateau Honing:
   - Plateau Honing: Creates a 30 to 45-degree intersecting cross-hatch micro-groove pattern. Deep valleys store lubricating oil for ring boundary lubrication, while flat plateaus support piston rings during break-in.
   - Dimensional Tolerances: Maximum allowable bore out-of-round and taper is typically < 0.0005 inches (0.013 mm).

3. Multi-Layer Steel (MLS) Head Gasket Sealing:
   - Modern engines utilize MLS gaskets featuring multiple plies of full-hard spring steel with Viton fluoroelastomer outer coatings.
   - Embossed combustion seal beads generate localized sealing pressures exceeding 15,000 PSI to contain extreme peak cylinder pressures.
   - Torque-to-Yield (TTY) Cylinder Head Fasteners: Fasteners tightened into their plastic yield deformation zone, exerting constant, uniform clamping preload across all engine operating temperatures.`
    },
    {
      track_id: track1Id,
      title: "Rotating Assembly: Crankshafts, Connecting Rods and Piston Dynamics",
      order_index: 3,
      content: `### Dynamics of the Reciprocating Assembly

The rotating assembly transforms reciprocating linear motion into rotary shaft output:

1. Crankshaft Metallurgy and Hydrodynamic Bearings:
   - Forged 4340 Chromoly Steel vs Nodular Ductile Iron: Micro-polished crank journals with rolled fillet radiuses to eliminate stress concentration fractures.
   - Hydrodynamic Journal Lubrication (Reynolds Equation): As the journal rotates eccentric to the bearing shell, it sweeps oil into a converging wedge, generating hydrodynamic oil wedge pressures (up to 3,000 to 5,000 PSI) that completely separate the metal surfaces.
   - Main Bearing Oil Clearance: Typically 0.0015 to 0.0025 inches (0.038 to 0.064 mm).

2. Connecting Rod Mechanics:
   - Forged H-Beam vs I-Beam Rods: Sized for tensile and buckling loads.
   - Cracked-Cap (Fracture-Split) Technology: Connecting rod big-ends are laser-notched and hydraulically fractured. The unique interlocking crystalline fracture surface ensures perfect realignment upon assembly without lateral fretting.

3. Piston Architecture and Compression Ring Dynamics:
   - Piston Metallurgy: Cast hypereutectic aluminum (16% to 18% silicon for low thermal expansion) vs Forged 2618/4032 aluminum alloys for forced induction.
   - Piston Skirt Profile: Machined with slight barrel and oval contours to accommodate greater thermal expansion along the wrist pin axis.
   - Ring Pack Configuration:
     - Top Compression Ring: Steel or ductile iron with PVD diamond-like carbon or plasma moly coating.
     - Second Scraper Ring: Cast iron Napier hook profile providing oil scraping and intermediate gas pressure containment.
     - 3-Piece Oil Control Ring: Stainless steel expander with two chrome-faced rails.
     - Ring End Gap Gapping: Sized at 0.0045 inches per inch of cylinder bore diameter (expanded to 0.0065 in/in for turbocharged applications to prevent ring butting).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Cylinder Head Flow Dynamics, Combustion Chambers and Valves",
      order_index: 1,
      content: `### Cylinder Head Aerodynamics and Combustion Physics

The cylinder head regulates gas exchange and initiates flame propagation:

1. Intake Port Aerodynamics and In-Cylinder Motion:
   - Swirl Motion: Rotational airflow about the cylinder vertical axis (common in diesel and direct-injected 2-valve engines).
   - Tumble Motion: Barrel-roll airflow about a horizontal axis (essential in modern 4-valve pent-roof gasoline engines to generate high turbulence kinetic energy for rapid flame speed).
   - Flow Bench Quantification: SuperFlow testing measuring airflow in CFM at a standardized depression of 28 inches of water (approx 7.0 kPa).

2. Combustion Chamber Geometries:
   - Pent-Roof 4-Valve Chambers: Central spark plug placement and central direct injector with dual intake valves angled at 20 to 30 degrees. Minimizes flame travel distance to mitigate engine knock.
   - Squish / Quench Bands: Tight clearance zones (0.035 to 0.045 inches) between the flat piston crown and cylinder head deck. Squeezes air-fuel mixture inward toward the spark plug at TDC, cooling unburnt end gases to inhibit pre-ignition.

3. Poppet Valve Metallurgy and Valve Seat Cutting:
   - Intake Valves: High-temperature 21-4N austenitic stainless steel with hardened stellite tips.
   - Exhaust Valves: Inconel nickel-chromium superalloys with hollow stems filled with metallic sodium (sodium melts at 98 deg C, sloshing inside the stem to conduct heat from the valve head to the cooled valve guide).
   - Multi-Angle Valve Seats: Precision 3-angle cutting (30-degree top un-shrouding cut, 45-degree sealing seat cut, 60-degree bottom throat cut) to maximize flow discharge coefficients.`
    },
    {
      track_id: track2Id,
      title: "Valvetrain Topologies, Camshaft Profiles and Variable Valve Timing",
      order_index: 2,
      content: `### Valvetrain Mechanics and Variable Actuation

The valvetrain actuates valves at precise microsecond intervals:

1. Valvetrain Topologies:
   - Overhead Valve (OHV / Pushrod): Single camshaft in block actuating pushrods and rocker arms. Compact packaging but high valvetrain reciprocating mass.
   - Double Overhead Cam (DOHC): Dual camshafts per cylinder head actuating valves directly via hydraulic mechanical lash adjusters (finger followers with roller bearings), minimizing valvetrain inertia for high-RPM operation.

2. Camshaft Geometry and Event Timing:
   - Lobe Lift vs Valve Lift (\`Valve Lift = Lobe Lift * Rocker Arm Ratio\`).
   - Duration (@ 0.050 inch / 1.27 mm lift): Number of crankshaft degrees that the valve is lifted above 0.050 inches.
   - Lobe Separation Angle (LSA): Angle between intake and exhaust lobe centerlines.
   - Valve Overlap: Period near TDC where both intake and exhaust valves are open simultaneously, utilizing exhaust gas momentum to scavenge residual cylinder gases.

3. Variable Valve Timing (VVT) and Variable Valve Lift (VVL):
   - Continuous Cam Phasing (VVT): Electro-hydraulic vane phasers advance or retard camshaft timing by 30 to 50 crankshaft degrees relative to the timing sprocket, optimizing low-end torque and high-end horsepower.
   - Variable Valve Lift (VVL / VTEC): Hydraulic locking pins shift rocker arms between mild low-speed cam profiles and aggressive high-lift duration profiles.
   - Throttling-Free Valve Control (BMW Valvetronic): Variable intake valve lift (0.18 mm to 9.9 mm) regulates engine airflow directly, eliminating the throttle plate and reducing intake pumping losses by 10%+.`
    },
    {
      track_id: track2Id,
      title: "Forced Induction: Turbochargers, Superchargers and Intercooling",
      order_index: 3,
      content: `### Principles of Forced Induction

Forced induction compresses ambient intake air, increasing charge air density to burn more fuel mass per combustion stroke:

1. Turbocharger Thermodynamics:
   - Driven by wasted exhaust gas thermal enthalpy and kinetic pressure.
   - Centrifugal Compressor Map Architecture:
     - Pressure Ratio (Y-axis: \`P_boost_absolute / P_ambient\`) vs Corrected Air Mass Flow (X-axis in lbs/min or kg/s).
     - Surge Line: Left boundary where airflow stalls and reverses over compressor blades, causing violent pressure oscillations.
     - Choke Line: Right boundary where air velocity through compressor inlet reaches sonic speed (Mach 1.0).
     - Efficiency Islands: Contours of peak isentropic thermal efficiency (typically 72% to 78%+).

2. Turbine Housing Engineering:
   - Twin-Scroll Divided Housings: Separates exhaust pulses from alternate firing cylinders (e.g. cylinders 1-4 paired and 2-3 paired in an inline-4), eliminating exhaust pulse backpressure interference.
   - Wastegates and Blow-Off Valves: Electronic wastegates bypass excess exhaust around the turbine wheel to regulate boost pressure. Compressor bypass valves (CBVs) vent boost pressure during throttle closure to prevent compressor surge.

3. Supercharging and Charge Air Cooling:
   - Positive Displacement (Roots / Twin-Screw Lysholm): Crankshaft belt-driven compressors delivering instantaneous low-RPM boost.
   - Charge Air Coolers (Intercoolers): Air-to-air or liquid-to-air heat exchangers. Compressing air to 15 PSI boost heats charge air to 250+ deg F (120 deg C); intercoolers drop charge temperature to within 20 deg F of ambient, increasing air density and preventing engine knock.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Engine Lubrication Systems, Tribology and Hydrodynamic Bearings",
      order_index: 1,
      content: `### Lubrication Science and Engine Tribology

Engine lubrication minimizes friction, dissipates heat, cushions shock loads, and cleans internal surfaces:

1. Lubrication Circuit Flow Path:
   - Wet Sump System: Oil is stored in the lower oil pan. A positive-displacement gerotor or gear-driven oil pump draws oil through a mesh pickup screen.
   - Oil travels through the pressure relief valve -> full-flow spin-on oil filter (with anti-drainback valve and bypass valve) -> main oil gallery -> crankshaft main bearings and rod journals -> cylinder head valvetrain gallery -> hydraulic lash adjusters and VVT phasers -> gravity drainback passages to the sump.
   - Dry Sump Systems: Multiple scavenge pump stages evacuate oil to an external reservoir, eliminating oil starvation during high-G cornering and lowering engine center of gravity.

2. Lubricant Rheology and Viscosity Classifications:
   - SAE Viscosity Grades (e.g. 0W-20, 5W-30): 'W' rating indicates cold-cranking pumpability at sub-zero temperatures; second number indicates kinematic viscosity at 100 degrees C.
   - High-Temperature High-Shear (HTHS): Dynamic viscosity measured at 150 degrees C under extreme shear rates (10^6 s^-1), governing hydrodynamic bearing film thickness under full engine load.
   - Anti-Wear Additive Chemistry: Zinc Dialkyldithiophosphate (ZDDP) creates sacrificial glassy zinc polyphosphate boundary barrier films on camshaft lobes during metal-to-metal boundary friction.`
    },
    {
      track_id: track3Id,
      title: "Engine Thermal Management and Pressurized Cooling Systems",
      order_index: 2,
      content: `### Thermodynamics of Engine Cooling

Internal combustion engines convert approximately one-third of fuel energy into shaft power, one-third into exhaust heat, and one-third into engine cooling jacket heat:

1. Pressurized Liquid Cooling Chemistry:
   - 50/50 Coolant Mixture: 50% Ethylene Glycol (or Propylene Glycol) and 50% deionized water containing Organic Acid Technology (OAT / HOAT) corrosion inhibitors.
   - Pressurized Radiator Cap (15 to 18 PSI / 1.0 to 1.2 bar): For every 1 PSI increase in system pressure, the boiling point of coolant rises by approximately 3 degrees F. A 16 PSI system elevates the boiling point of a 50/50 mix to 265 degrees F (129 degrees C), preventing localized nucleate boiling in cylinder head exhaust passages.

2. Advanced Thermal Management:
   - Wax Pellet vs Electronic Thermostats: ECM map-controlled thermostats vary coolant operating temperatures dynamically (running at 105 deg C during light highway cruising for lower oil viscosity friction, dropping to 85 deg C under aggressive acceleration to suppress knock).
   - Split Cooling Blocks: Cools the cylinder head with high-flow low-temperature coolant to suppress knock while keeping cylinder block liners warmer to reduce piston ring friction.`
    },
    {
      track_id: track3Id,
      title: "Combustion Diagnostics, Cylinder Health and Failure Analysis",
      order_index: 3,
      content: `### Precision Mechanical Diagnostics and Failure Analysis

Diagnosing internal engine mechanical integrity requires systematic instrumentation:

1. Cranking Compression Testing:
   - Measures peak pressure developed in each cylinder during starter cranking (typically 150 to 210 PSI in modern engines).
   - All cylinders must read within 10% of each other. A single low cylinder indicates valve sealing failure or ring/cylinder wall damage.

2. Differential Cylinder Leakdown Testing (100 PSI Air Input):
   - Pressurizes each cylinder with regulated 100 PSI compressed air at TDC of the compression stroke (valves closed):
   - Acceptable leakage is < 5% to 10% in healthy engines.
   - Pinpointing Leakage Locations by Sound:
     - Hissing at Throttle Body: Leaking intake valve.
     - Hissing at Tailpipe: Leaking exhaust valve.
     - Bubbling in Radiator Neck: Blown cylinder head gasket or cracked cylinder head casting.
     - Hissing at Oil Filler Cap / Dipstick Tube: Worn piston rings or scored cylinder wall.

3. Forensic Engine Failure Modes:
   - Detonation Damage: Uncontrolled secondary end-gas auto-ignition causing severe shockwaves (> 100 bar/ms pressure spikes) that fracture piston ring lands, crack ceramic spark plug insulators, and erode piston crowns.
   - Pre-Ignition: Glowing carbon deposits or overheated spark plug electrodes igniting air-fuel mixture before spark firing, melting holes directly through the center of the piston crown.
   - Hydrodynamic Bearing Fatigue: Oil film breakdown causing wiped babbit material, copper underlay exposure, and crankshaft journal scoring.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #14.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In the four-stroke internal combustion engine operating cycle, during which stroke does combustion occur, forcing the piston downward to produce rotational crankshaft torque?",
      options: [
        "Intake Stroke",
        "Power (Expansion) Stroke",
        "Compression Stroke",
        "Exhaust Stroke"
      ],
      correct_option_index: 1,
      explanation: "The Power stroke (expansion stroke) occurs immediately following ignition, expanding combustion gases to drive the piston downward and generate shaft torque.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What is the primary function of the pressure relief cap on an automotive engine cooling system radiator (typically rated at 15 to 18 PSI)?",
      options: [
        "To drain coolant onto the roadway",
        "To cool the vehicle passenger compartment",
        "To measure oil temperature",
        "To increase system pressure, thereby elevating the boiling point of the coolant to over 260 degrees F (127 degrees C) to prevent localized boiling"
      ],
      correct_option_index: 3,
      explanation: "Pressurizing the cooling system elevates the coolant boiling point by approx 3 deg F per PSI, preventing localized boiling and steam pocket formation in the cylinder head.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What type of exhaust valve design utilizes a hollow stem partially filled with metallic sodium to improve thermal heat dissipation from the valve head to the cylinder head guide?",
      options: [
        "Sodium-Filled Hollow Exhaust Valve",
        "Titanium Solid Intake Valve",
        "Cast Iron Sleeve Valve",
        "Ceramic Poppet Valve"
      ],
      correct_option_index: 0,
      explanation: "Sodium-filled valves contain metallic sodium that melts at 98 deg C, sloshing inside the stem to rapidly conduct heat away from the hot valve face to the liquid-cooled guide.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "During a differential cylinder leakdown test with compressed air applied at TDC, hissing air heard escaping directly from the vehicle exhaust tailpipe indicates what mechanical defect?",
      options: [
        "A leaking intake valve",
        "A worn oil control ring",
        "A leaking or burnt exhaust valve seat",
        "A blown radiator hose"
      ],
      correct_option_index: 2,
      explanation: "Air escaping into the exhaust manifold and out the tailpipe during a leakdown test at TDC indicates that the exhaust valve is failing to seal against its seat.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What engine component converts the reciprocating linear motion of the pistons into rotational torque output delivered to the vehicle transmission?",
      options: [
        "Camshaft",
        "Crankshaft",
        "Timing Chain Tensioner",
        "Intake Manifold"
      ],
      correct_option_index: 1,
      explanation: "The crankshaft transforms the reciprocating linear motion of pistons and connecting rods into continuous rotary power output.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "What mathematical property dictates the theoretical thermal efficiency of the ideal Otto cycle?",
      options: [
        "Thermal efficiency increases as exhaust pipe diameter increases",
        "Thermal efficiency depends exclusively on the type of engine oil used",
        "Thermal efficiency is governed exclusively by the compression ratio (r) and the specific heat ratio (gamma) according to: eta_th = 1 - (1 / r^(gamma - 1))",
        "Thermal efficiency is constant at 100% across all engines"
      ],
      correct_option_index: 2,
      explanation: "In the Otto cycle, thermal efficiency = 1 - (1 / r^(gamma - 1)); higher compression ratios yield higher thermodynamic thermal efficiency.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In engine block manufacturing, what is the primary operational advantage of connecting rods manufactured with Cracked-Cap (Fracture-Split) technology?",
      options: [
        "The unique interlocking crystalline fracture surface ensures perfect realignment of rod caps upon assembly without lateral cap shift or fretting wear",
        "Fractured rods weigh 50% less than forged rods",
        "Fractured rods eliminate the need for connecting rod bolts",
        "Fractured rods allow rods to be bent into curved shapes"
      ],
      correct_option_index: 0,
      explanation: "Cracked-cap fracture splitting creates unique 3D interlocking microscopic surfaces that perfectly align the rod cap, eliminating shearing movement under heavy load.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "On a turbocharger compressor aerodynamic performance map, what boundary line on the left side of the map represents unstable aerodynamic stall and violent airflow reversal across the compressor wheel?",
      options: [
        "The Choke Line",
        "The Wastegate Limit Line",
        "The Turbine Backpressure Line",
        "The Surge Line"
      ],
      correct_option_index: 3,
      explanation: "The Surge Line represents the operational boundary where high boost pressure combined with low airflow causes aerodynamic stall and reverse airflow pulses.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "Why are cylinder bores finished with a Plateau Honing process featuring a 30 to 45-degree cross-hatch pattern?",
      options: [
        "To make the cylinder block look decorative",
        "The cross-hatch micro-valleys store lubricating oil for boundary lubrication, while smooth plateau peaks support piston rings for rapid ring seating and low friction",
        "To create air channels that bypass the piston",
        "To permanently prevent the engine from reaching operating temperature"
      ],
      correct_option_index: 1,
      explanation: "Plateau honing leaves flat microscopic plateaus that support ring loads while retaining cross-hatch micro-grooves that hold oil films, minimizing break-in wear.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In crankshaft hydrodynamic journal bearings, how does the rotating shaft maintain separation from the bearing shell without metal-to-metal contact during engine operation?",
      options: [
        "Through permanent magnetic repulsion",
        "By utilizing dry Teflon solid roller balls",
        "The eccentric rotation of the journal sweeps engine oil into a converging hydrodynamic fluid wedge, generating localized oil wedge pressures (3,000+ PSI) that float the shaft",
        "By heating the steel until it expands into a gas cushion"
      ],
      correct_option_index: 2,
      explanation: "Under the Reynolds lubrication equation, journal rotation draws oil into a narrowing wedge between journal and bearing, generating high hydrodynamic pressure that floats the crank.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "An engine dynamometer measures 400 lb-ft of brake torque at 5,252 RPM. What is the calculated Brake Horsepower (BHP) produced by the engine?",
      options: [
        "400.0 BHP (BHP = (Torque * RPM) / 5252 = (400 * 5252) / 5252 = 400 BHP)",
        "800.0 BHP",
        "200.0 BHP",
        "525.2 BHP"
      ],
      correct_option_index: 0,
      explanation: "BHP = (Torque * RPM) / 5252. At 5,252 RPM, Horsepower and Torque are mathematically equal; 400 lb-ft * 5252 / 5252 = 400.0 BHP.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "How does the Atkinson/Miller thermodynamic cycle achieve higher thermal efficiency in modern hybrid vehicles compared to a standard Otto cycle?",
      options: [
        "By eliminating the spark plug and using glow plugs exclusively",
        "By using pure liquid hydrogen fuel",
        "By running the engine without engine oil",
        "By delaying Intake Valve Closing (IVC) late into the compression stroke, shortening the effective compression stroke while maintaining a full expansion power stroke to extract maximum work with reduced pumping losses"
      ],
      correct_option_index: 3,
      explanation: "Late intake valve closing pushes part of the intake charge back out, creating an asymmetrical expansion ratio higher than compression ratio and minimizing intake throttling losses.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "What forensic mechanical distinction separates engine piston damage caused by Pre-Ignition from damage caused by severe Detonation (Knock)?",
      options: [
        "Detonation melts the oil filter, while pre-ignition breaks the alternator",
        "Pre-ignition burns a clean hole directly through the center of the piston crown due to premature surface hot-spot ignition, whereas detonation causes shockwave pressure spikes that fracture piston ring lands and erode piston crown outer edges",
        "Detonation only occurs in diesel engines",
        "Pre-ignition causes zero physical damage to pistons"
      ],
      correct_option_index: 1,
      explanation: "Pre-ignition creates an intense localized blowtorch effect melting a hole through the piston crown. Detonation produces violent pressure spikes (ringing knock) that fracture brittle ring lands.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "Why are Torque-to-Yield (TTY) cylinder head bolts specified in modern Multi-Layer Steel (MLS) head gasket assemblies, and why must they NEVER be reused after removal?",
      options: [
        "TTY bolts are made of magnetic plastic",
        "TTY bolts are welded to the engine block",
        "TTY bolts are tightened past their elastic limit into their permanent plastic deformation yield zone to exert uniform clamping preload; once yielded, they cannot maintain engineered tension if retightened",
        "TTY bolts dissolve in engine coolant after 50 miles"
      ],
      correct_option_index: 2,
      explanation: "TTY fasteners stretch permanently into their plastic zone to provide perfectly consistent clamping force across the gasket. Reusing them causes bolt elongation failure or gasket leaks.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In engine lubricant tribology, what is the High-Temperature High-Shear (HTHS) viscosity parameter and why is it critical for high-load engine protection?",
      options: [
        "It measures dynamic oil viscosity at 150 degrees C under extreme shear rates (10^6 s^-1), ensuring the oil film does not collapse under extreme connecting rod bearing loads at high RPM and temperature",
        "It measures the freezing point of engine oil at -40 degrees C",
        "It calculates the rate of oil evaporation in the exhaust manifold",
        "It measures the amount of zinc additive in the oil filter"
      ],
      correct_option_index: 0,
      explanation: "HTHS viscosity measures hydrodynamic oil film strength in journal bearings under high temperature (150 C) and violent mechanical shear, preventing metal-to-metal contact.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #14.");
  console.log("Skill #14 update completed successfully!");
}

run();
