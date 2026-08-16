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

const skillId = "b01e79ee-e0cb-4453-9396-adbeb55450ce";

async function run() {
  console.log("Updating Skill #19: Airport Ground Operations (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Aerodrome Airside Layout, FOD Prevention and Marshalling" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Aircraft Turnaround Choreography, Fueling and Baggage Logistics" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Weight and Balance, Deicing Holdover Times and Pushback" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "ICAO Annex 14 Aerodrome Standards, Airside Zoning and Markings",
      order_index: 1,
      content: `### Aerodrome Airside Infrastructure and Spatial Zoning

Airport airside operations are strictly regulated by ICAO Annex 14 (Aerodromes) and FAA 14 CFR Part 139:

1. Airside vs Landside Demarcation:
   - Landside: Public areas accessible without security screening.
   - Airside (SIDA / Security Identification Display Area): Secured air operations area accessible only by credentialed personnel through physical access control gates.

2. ICAO Aerodrome Reference Code (ARC):
   - Code Element 1 (Aircraft Reference Field Length: 1 to 4).
   - Code Element 2 (Wingspan and Outer Main Gear Wheel Span: Letters A through F):
     - Code C: Narrow-body aircraft (e.g. A320, B737; wingspans 24m to < 36m).
     - Code E: Wide-body aircraft (e.g. B777, A350; wingspans 52m to < 65m).
     - Code F: Super-heavy aircraft (e.g. A380, B747-8; wingspans 65m to < 80m).

3. Apron Markings and Safety Envelopes:
   - Aircraft Stand Taxilanes and Lead-In Guidance Lines: Solid yellow centerlines guiding the aircraft nose gear to the parking stop line.
   - Equipment Restraint Area (ERA): Red boundary box painted around the aircraft parking stand. All motorized and non-motorized Ground Support Equipment (GSE) must remain outside the ERA until the aircraft comes to a complete stop, engines shut down, and anti-collision beacons are extinguished.
   - Jet Blast Hazard Zones: Distinctly marked buffer zones behind jet engine tailpipes to prevent blast damage to equipment and ground crew during breakaway thrust.`
    },
    {
      track_id: track1Id,
      title: "Foreign Object Debris (FOD) Prevention and Airside Hazard Management",
      order_index: 2,
      content: `### Physics of Foreign Object Debris and Airside Risk Mitigation

Foreign Object Debris (FOD) represents any loose item on airside pavements that can cause catastrophic damage to aircraft, engines, or personnel (ICAO Doc 9981 / FAA AC 150/5210-24):

1. Physics of Jet Engine Ingestion:
   - High-bypass turbofan engines at takeoff thrust generate ground suction vortices drawing loose objects off tarmac surfaces.
   - Ingestion of a single steel bolt into spinning titanium fan blades induces catastrophic uncontained compressor blade fracturing, engine fires, and emergency shutdowns, costing millions of dollars in repair.
   - Soft FOD (baggage straps, plastic film) can block engine cooling ducts, pitot tubes, or air data sensors.

2. Comprehensive FOD Prevention Program:
   - Continuous Mechanical Sweeping: Operating friction sweepers and high-powered magnetic sweeping trucks across taxiways and runway thresholds.
   - Daily Multi-Agency Apron Walks: Organized manual line walks across parking stands and service roads to retrieve small hardware and debris.
   - Designated FOD Bins: Placed at every aircraft gate; personnel are mandated to 'See a FOD, Pick up a FOD'.
   - Tool Control Protocols: Strict shadow-board tool accountability preventing mechanics from leaving sockets or safety wire on airside aprons.`
    },
    {
      track_id: track1Id,
      title: "Ground Support Equipment (GSE) and Aircraft Marshalling Systems",
      order_index: 3,
      content: `### Ground Support Equipment Fleet and Marshalling Guidance

1. Ground Support Equipment (GSE) Fleet Architecture:
   - Non-Motorized GSE: Baggage carts, cargo dollies, and container pallet transporters with positive mechanical tow hitch lock pins.
   - Motorized Service GSE:
     - Ground Power Units (GPU): Delivering 400 Hz, 115V / 200V AC clean 3-phase electrical power, allowing the aircraft to shut down its fuel-burning Auxiliary Power Unit (APU).
     - Pre-Conditioned Air (PCA) Carts: High-volume ducted conditioned air to maintain cabin climate control at gate.
     - Air Start Units (ASU): Delivering high-pressure pneumatic air (40+ PSI) to spin jet engine starter turbines when an on-board APU is inoperable.
     - Belt Loaders, Main Deck Cargo High-Loaders, Catering Trucks, and Lavatory / Potable Water Service Trucks.

2. Aircraft Marshalling Protocols (ICAO Doc 9432 / IATA AHM 630):
   - Standardized day/night illuminated wand signals:
     - Straight Ahead: Both wands extended vertically, moving up and down.
     - Wingwalker Clearance: Wingwalkers stationed at wingtips verifying obstacle clearance, signaling the lead marshaller.
     - Emergency Stop: Crossing illuminated wands vigorously above the head in an 'X' pattern.

3. Advanced Visual Docking Guidance Systems (A-VDGS):
   - Automated laser-rangefinder and optical camera systems installed on terminal buildings.
   - Tracks aircraft centerline deviation (azimuth guidance) and closing velocity in real time, displaying closing distance and commanding the pilot to stop within +/- 10 cm of the aircraft nose-wheel stop line.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Aircraft Turnaround Choreography: The Critical Path Matrix",
      order_index: 1,
      content: `### Gantt Chart Choreography of Aircraft Turnaround

The turnaround window (typically 30 to 45 minutes for narrow-body aircraft) is an orchestrated parallel operation where every second counts:

1. Step-by-Step Turnaround Chronology:
   - Minute 0 (On-Chock): Aircraft stops on mark, parking brake set, engines spool down, anti-collision beacons extinguish. Chocks placed at nose and main gear wheels; 6 safety cones positioned around wingtips, engines, and tail.
   - Minutes 1 to 3: Jet bridge or passenger stairs docked to Door 1L (forward left). Ground Power Unit (400 Hz) and Pre-Conditioned Air connected. Cargo hold doors opened.
   - Minutes 3 to 15: Inbound passenger deplaning commences. Simultaneous baggage and cargo offloading via belt loaders and tugs. Galley catering truck docks at service doors (Doors 1R and 2R).
   - Minutes 10 to 25: Cabin deep cleaning crew boards. Lavatory service truck (vacuum blue-water extraction) and potable water replenishment truck connect to service panels.
   - Minutes 15 to 35: Aviation fueling commences. Outbound baggage and cargo loaded into lower decks.
   - Minutes 25 to 40: Outbound passenger boarding. Final cargo doors closed and verified locked. Loadmaster delivers final Load and Trim Sheet to the flight crew.
   - Minutes 40 to 45: Jet bridge retracted, ground power disconnected, pushback tug connected with steering bypass pin installed. Ramp clearance confirmed.`
    },
    {
      track_id: track2Id,
      title: "Aviation Fueling Hydrant Systems, Chemistry and Safety Protocols",
      order_index: 2,
      content: `### Aviation Fueling Technology and Fluid Safety

Aviation fueling requires rigorous static control, filtration, and flow rate regulation:

1. Aviation Turbine Fuel Classifications:
   - Jet A / Jet A-1: Kerosene-based fuel for commercial jet airliners. Minimum Flash Point = 100 deg F (38 deg C); Maximum Freezing Point = -40 deg F (-40 deg C for Jet A) and -47 deg C (-53 deg F for Jet A-1).
   - Avgas 100LL: Low-lead aviation gasoline (100 octane) for spark-ignition piston aircraft.

2. Airport Hydrant Fueling Infrastructure vs Refueler Tankers:
   - Underground Hydrant Pipeline Networks: Centralized fuel distribution maintaining 100 to 150 PSI fuel line pressure to underground apron pit valves.
   - Hydrant Servicer Dispensers: Mobile low-profile trucks connecting hydrant pit valves to aircraft underwing fueling ports via flexible hoses. Equipped with multi-stage filter water separators (coalescer elements removing free and emulsified water down to < 15 PPM).

3. Electrostatic Bonding and Deadman Safety Controls:
   - Static Bonding: High-velocity fuel flow (up to 1,000 GPM / 3,800 LPM) generates massive electrostatic charges. Mandatory bonding cables must connect the fuel dispenser to the aircraft grounding point before hose attachment.
   - Deadman Control Switch: A spring-loaded hand switch held continuously by the fueling technician. If released for more than 2 seconds, fueling terminates instantaneously to prevent fuel overfill spills.`
    },
    {
      track_id: track2Id,
      title: "Baggage Handling Systems, ULD Containers and Cargo Restraints",
      order_index: 3,
      content: `### Air Cargo Handling, ULD Containers and Hold Restraints

1. Unit Load Devices (ULD Standards / IATA AHM 510):
   - Standardized structural aluminum and composite containers and pallets engineered to lock into aircraft lower-deck and main-deck cargo holds:
     - LD-3 (AKE) Container: Contoured to match wide-body fuselage lower deck profiles (maximum gross weight approx 3,500 lbs / 1,588 kg).
     - Cargo Pallets (PAG / PMC): Flat aluminum pallets loaded with cargo and secured with high-strength structural nets.

2. Cargo Hold Roller Floors and Restraint Locks:
   - Cargo Hold Mechanics: Floor-mounted omnidirectional ball transfer mats and roller tracks allowing smooth cargo movement. Powered Drive Units (PDUs) mechanically drive ULDs into position.
   - Restraint Lock Integrity: Retractable vertical, longitudinal, and lateral mechanical locks engage the perimeter base lip of every ULD. Ground crew must physically verify that all locks are in the upright, locked position; an unsecured ULD shifting during takeoff rotation can cause catastrophic rearward center of gravity shift and immediate aircraft stall.

3. Automated Baggage Handling Systems (BHS):
   - Advanced barcode and RFID tracking tags scanning baggage at 99.5%+ accuracy.
   - In-Line Explosive Detection System (EDS) CT X-ray scanning integrated with automated high-speed sortation trays routing bags to specific flight make-up carousels.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Aircraft Weight and Balance, Center of Gravity and Load Sheets",
      order_index: 1,
      content: `### Weight and Balance Engineering and Aerodynamic Stability

An aircraft cannot legally or safely depart without verifying that total gross weight and Center of Gravity (CG) reside within strictly certified operational flight envelopes:

1. Key Weight Definitions:
   - Dry Operating Weight (DOW / Basic Empty Weight): Weight of aircraft structure, engines, unusable fuel, operating fluids, crew, and catering supplies.
   - Zero Fuel Weight (ZFW): DOW plus total Payload (Passengers + Baggage + Cargo). Governed by maximum wing-root structural bending moment limits.
   - Maximum Takeoff Weight (MTOW): Maximum allowable weight at the start of takeoff roll.

2. Center of Gravity (CG) and Mean Aerodynamic Chord (% MAC):
\`\`\`
CG Location = Total Moment / Total Gross Weight
% MAC = [(CG Location - Leading Edge MAC) / Length of MAC] * 100%
\`\`\`
   - Forward CG Limit: Nose-heavy aircraft requires excessive downward aerodynamic elevator trim from the horizontal stabilizer, increasing drag, fuel burn, and takeoff rotation speeds.
   - Aft CG Limit: Tail-heavy aircraft severely degrades longitudinal pitch stability. If CG moves behind the aft limit, the aircraft becomes aerodynamically unstable, risking an unrecoverable deep stall during takeoff rotation.

3. The Electronic Load and Trim Sheet (LIR):
   - Generated by central load planning, mapping exact passenger seat row distributions and cargo compartment weight zones (Forward Hold vs Aft Hold vs Bulk Hold), calculating final % MAC for flight crew takeoff trim setting.`
    },
    {
      track_id: track3Id,
      title: "Winter Ground Operations: Deicing, Anti-Icing and Holdover Times",
      order_index: 2,
      content: `### Cold Weather Aerodynamics and Aircraft Deicing Protocols

Even minuscule ice contamination degrades aerodynamic performance catastrophically (FAA 14 CFR 121.629 / ICAO Doc 9640):

1. The Clean Aircraft Concept:
   - Federal regulations strictly prohibit takeoff with any frost, snow, or ice adhering to critical aircraft surfaces (wings, horizontal stabilizers, vertical fin, control surfaces, and engine inlets).
   - As little as 1 mm of surface roughness across the wing leading edge reduces maximum lift coefficient (C_L_max) by up to 30% and increases aircraft stall speed by 15% to 20%.

2. SAE Deicing and Anti-Icing Fluid Chemistry (SAE AMS 1424 / 1428):
   - Type I Fluid (Orange / Pink): Unthickened, heated propylene glycol and water mixture sprayed at 140 to 180 deg F (60 to 80 deg C) under high pressure to melt and flush away existing ice and snow. Minimal holdover protection.
   - Type IV Fluid (Green): Advanced pseudoplastic thickened anti-icing fluid applied cold over a clean aircraft. Forms a viscous protective layer that absorbs falling snow and freezing rain. Designed to thin and shear cleanly off the wings as the aircraft reaches takeoff speeds (> 100 knots).

3. Holdover Time (HOT) Calculations:
   - The estimated time that anti-icing fluid will prevent ice formation on protected surfaces under specific meteorological conditions (ambient temperature, precipitation type: light snow, freezing fog, freezing drizzle).
   - HOT clock starts the exact minute the final anti-icing application begins.`
    },
    {
      track_id: track3Id,
      title: "Aircraft Pushback Operations, Towbarless Tractors and Communications",
      order_index: 3,
      content: `### Pushback Mechanics, Towbarless Systems and Ramp Communication

Aircraft cannot reverse under their own engine power on aprons (thrust reverser ground ingestion risks); pushback operations maneuver aircraft safely into taxiways:

1. Pushback Systems and Equipment:
   - Conventional Towbars: Heavy steel tubes fitted with calibrated mechanical Shear Pins. If the tug operator exceeds safe steering angles or applies excessive torque, the shear pin fractures, protecting the aircraft nose landing gear from structural shearing damage.
   - Towbarless (TBL) Pushback Tractors: Modern high-speed tractors utilizing hydraulic cradles that scoop up, clamp, and lift the aircraft nose landing gear off the tarmac, utilizing aircraft weight for traction and eliminating shear pin breakage.

2. The Nose Gear Steering Bypass Pin:
   - Ground crew must insert a mechanical Nose Gear Steering Bypass Lockout Pin into the nose gear hydraulic manifold before connecting the tug.
   - The bypass pin physically vents hydraulic steering pressure from the aircraft rudder pedal steering actuators, allowing the ground tug to steer the nose wheels freely without fighting aircraft hydraulic pressure.

3. Headset Ground-to-Cockpit Communications:
   - Standardized ICAO Phraseology: Ground crew communicates via wired intercom headset:
     - Confirming parking brakes released, ATC pushback clearance obtained, and clear ramp area.
     - Monitoring engine startup sequence.
     - Disconnecting tug, extracting bypass pin, and conducting final visual salute displaying the bypass pin and red streamer to the flight crew.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #19.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "What safety boundary area, painted as a red box on the apron around a parked aircraft, prohibits Ground Support Equipment (GSE) from entering until the aircraft is fully stopped and engines are shut down?",
      options: [
        "Runway Safety Area (RSA)",
        "Equipment Restraint Area (ERA)",
        "Passenger Terminal Concourse",
        "Baggage Sortation Carousel"
      ],
      correct_option_index: 1,
      explanation: "The Equipment Restraint Area (ERA) is the designated red safety envelope around a parked aircraft that GSE must not enter until engines are off and chocks are in place.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What mechanical lockout device must be inserted into the aircraft nose landing gear hydraulic manifold prior to pushback to allow the ground tug to steer the nose wheels freely?",
      options: [
        "Pitot Tube Cover",
        "Landing Gear Chock",
        "Fuel Cap Latch",
        "Nose Gear Steering Bypass Pin"
      ],
      correct_option_index: 3,
      explanation: "The steering bypass pin physically bypasses the aircraft hydraulic steering actuators, preventing hydraulic resistance while the ground tug maneuvers the nose gear.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What critical aviation regulation (Clean Aircraft Concept / FAA 14 CFR 121.629) governs cold-weather ground operations?",
      options: [
        "No aircraft may take off with frost, ice, or snow adhering to critical aerodynamic surfaces (wings, control surfaces, horizontal stabilizers)",
        "Aircraft must only fly during warm daylight hours",
        "All aircraft must be washed with soap every morning",
        "Deicing fluid is optional if the sun is shining"
      ],
      correct_option_index: 0,
      explanation: "The Clean Aircraft Concept legally mandates that all critical aerodynamic lifting and control surfaces must be 100% free of frost, ice, or snow before takeoff.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What type of ground equipment delivers 400 Hz, 115V AC electrical power to parked aircraft so they can shut down their fuel-burning Auxiliary Power Units (APU)?",
      options: [
        "Belt Loader",
        "Air Start Unit (ASU)",
        "Ground Power Unit (GPU)",
        "Lavatory Service Truck"
      ],
      correct_option_index: 2,
      explanation: "A Ground Power Unit (GPU) provides standardized 400 Hz 115V/200V 3-phase AC power to parked aircraft to power on-board electrical systems at the gate.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What type of standardized cargo container, contoured to fit lower-deck wide-body aircraft fuselages, is designated as an LD-3 (AKE)?",
      options: [
        "Semi-Truck Trailer",
        "Unit Load Device (ULD)",
        "Cardboard Shipping Box",
        "Wooden Freight Crate"
      ],
      correct_option_index: 1,
      explanation: "An LD-3 is a standardized Unit Load Device (ULD) contoured aluminum/composite container engineered to lock securely into aircraft cargo hold roller decks.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "Why is an uncontained rearward shift of an aircraft's Center of Gravity (CG) beyond the certified Aft CG limit catastrophic during flight?",
      options: [
        "It causes the cabin lights to flicker",
        "It causes the jet bridge to disconnect",
        "It severely degrades or eliminates longitudinal pitch stability, making the aircraft nose pitch up uncontrollably and causing an unrecoverable aerodynamic stall",
        "It freezes the engine fuel lines"
      ],
      correct_option_index: 2,
      explanation: "An aft CG past the limit destabilizes longitudinal pitch control, making the aircraft violently tail-heavy, prone to uncontrollable nose pitch-up and deep stall.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In airport fuel safety protocols, why must a static electrical bonding wire be attached between the fueling servicer dispenser and aircraft grounding point before connecting fuel hoses?",
      options: [
        "High-velocity fuel flow (up to 1,000 GPM) through hoses generates massive electrostatic charges; bonding equalizes electrical potential to prevent static ignition sparks in volatile fuel vapor zones",
        "To charge the aircraft 12V battery",
        "To test the pilot headset audio connection",
        "To measure fuel density"
      ],
      correct_option_index: 0,
      explanation: "High-speed fuel pumping builds significant static electricity. Bonding equalizes electrical potentials between truck and aircraft, eliminating dangerous spark hazards.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What is the primary difference between SAE Type I and SAE Type IV deicing/anti-icing fluids?",
      options: [
        "Type I is solid dry ice; Type IV is liquid nitrogen",
        "Type I is green; Type IV is purple",
        "Type I is fuel; Type IV is hydraulic oil",
        "Type I is an unthickened, heated fluid used to melt existing snow and ice; Type IV is a cold, thickened pseudoplastic fluid that provides holdover protection by forming a viscous blanket that shears off during takeoff rotation"
      ],
      correct_option_index: 3,
      explanation: "Type I is heated for deicing (melting ice); Type IV is thickened for anti-icing (absorbing freezing precipitation while parked and blowing off at 100+ knots on takeoff).",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What safety device is engineered into conventional aircraft pushback towbars to protect the nose landing gear structure from excessive lateral twisting forces?",
      options: [
        "A parachute",
        "A calibrated mechanical Shear Pin that fractures when torque exceeds safe thresholds",
        "A rubber bungee cord",
        "An electric heating element"
      ],
      correct_option_index: 1,
      explanation: "Shear pins are calibrated sacrificial mechanical fuses in towbars that intentionally shear if the tug exceeds safe turning angles or torque limits, saving the nose gear.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What terminal optical guidance technology uses laser rangefinders and optical cameras to track aircraft centerline alignment and closing speed, guiding pilots to stop within +/- 10 cm of the parking mark?",
      options: [
        "Traffic Collision Avoidance System (TCAS)",
        "Instrument Landing System (ILS)",
        "Advanced Visual Docking Guidance System (A-VDGS)",
        "VOR Navigation Beacon"
      ],
      correct_option_index: 2,
      explanation: "A-VDGS uses automated laser and camera sensing on terminal facades to provide real-time azimuth tracking and millimeter-accurate stop line guidance to pilots.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In aerodynamic theory, how much does as little as 1.0 mm of frost, snow, or ice roughness adhering to an aircraft wing leading edge degrade maximum lift coefficient (C_L_max) and increase stall speed?",
      options: [
        "Reduces maximum lift coefficient (C_L_max) by up to 30% and increases stall speed by 15% to 20%, potentially causing stall on initial rotation",
        "Has zero effect on aerodynamic performance",
        "Increases wing lift by 50%",
        "Reduces aircraft weight by 10%"
      ],
      correct_option_index: 0,
      explanation: "Even 1 mm of surface roughness disrupts laminar airflow over wings, reducing peak lift by ~30% and increasing stall speed by up to 20%, risking immediate takeoff stall.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "What is the operational definition of Holdover Time (HOT) in aircraft winter operations, and when does the Holdover Time clock officially begin?",
      options: [
        "The time passengers spend waiting at the gate; starts at ticket purchase",
        "The time required to refuel the aircraft; starts when fuel hoses are attached",
        "The flight duration from departure to arrival; starts at takeoff roll",
        "The estimated duration that anti-icing fluid will prevent ice formation on treated surfaces; the clock begins the exact minute the final application of anti-icing fluid commences"
      ],
      correct_option_index: 3,
      explanation: "Holdover Time (HOT) is the calculated window anti-icing fluid protects clean wings in freezing weather. The timer starts at the exact start of the final anti-icing step.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In aircraft weight and balance engineering, what is the aerodynamic consequence of operating an aircraft at or near its extreme Forward Center of Gravity (CG) limit?",
      options: [
        "The aircraft flies backwards",
        "The aircraft requires excessive downward aerodynamic tailplane elevator trim to hold level flight, increasing aerodynamic trim drag, fuel consumption, and takeoff rotation speeds",
        "The engines produce zero thrust",
        "The landing gear refuses to retract"
      ],
      correct_option_index: 1,
      explanation: "A forward (nose-heavy) CG requires large downward aerodynamic tailplane forces to keep the nose up, generating high trim drag and demanding higher rotation speeds.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "What is the structural limit that dictates the Maximum Zero Fuel Weight (MZFW) of a commercial transport aircraft?",
      options: [
        "The strength of the passenger seat belts",
        "The maximum tire inflation pressure",
        "The maximum structural wing-root bending moment capacity (the maximum payload weight the fuselage can carry without fuel in the wings relieving upward wing bending forces)",
        "The size of the cargo hold doors"
      ],
      correct_option_index: 2,
      explanation: "MZFW is capped by wing-root bending stress: payload in the fuselage bends wings upward, whereas fuel stored inside the wings counteracts this bending force.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "According to ICAO Annex 14, an airport with an Aerodrome Reference Code (ARC) of 'Code 4E' is engineered to accommodate aircraft with what operational characteristics?",
      options: [
        "Aircraft Reference Field Length of 1,800m+ (Code 4) and Wingspans between 52m and less than 65m (Code E, such as Boeing 777 and Airbus A350)",
        "Light single-engine training aircraft",
        "Ultralight gliders and hot air balloons",
        "Helicopters only"
      ],
      correct_option_index: 0,
      explanation: "ICAO Code 4 represents runway field lengths > 1800m, and Code E represents wide-body wingspans between 52m and < 65m (e.g. B777, A350).",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #19.");
  console.log("Skill #19 update completed successfully!");
}

run();
