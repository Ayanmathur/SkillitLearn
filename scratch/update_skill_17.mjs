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

const skillId = "e273837f-19f9-49f5-b00f-55b1e19f7d8c";

async function run() {
  console.log("Updating Skill #17: Automotive Safety & Tools (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: OSHA Shop Safety, Hazardous Waste and High-Voltage EV Protocols" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Precision Dimensional Metrology and Fastener Engineering" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Fastener Tribology, Torque-to-Yield and Vehicle Lifting Systems" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "OSHA Shop Regulations, PPE Metrology and Emergency Systems",
      order_index: 1,
      content: `### Industrial Safety Engineering in Automotive Facilities

Automotive maintenance facilities operate under federal safety regulations governed by OSHA 29 CFR 1910 (General Industry Standards):

1. Personal Protective Equipment (PPE) Metrology:
   - Eye and Face Protection: ANSI/ISEA Z87.1 certified impact-resistant polycarbonate safety glasses with wrap-around side shields; full-face polycarbonate shields required during grinding, welding, and battery service.
   - Hand Protection: Heavy-duty 8-mil nitrile gloves for petroleum oils and greases; neoprene gloves for corrosive acids and caustics (avoiding latex, which breaks down rapidly in contact with hydrocarbon solvents).
   - Foot Protection: ASTM F2413 certified steel or composite toe footwear with puncture-resistant soles and oil-resistant non-slip outsoles.
   - Hearing Conservation: NRR 25+ dB rated hearing protection during prolonged air tool and chassis dynamometer operation.

2. Facility Emergency Infrastructure:
   - Emergency Eye Wash Stations (ANSI Z358.1): Located within 10 seconds of unhindered travel from chemical hazards, providing 15 minutes of hands-free continuous low-pressure flushing (0.4 GPM at 60 to 100 deg F).
   - Fire Protection (NFPA 10): Class A (combustible paper/wood), Class B (flammable solvents, gasoline, motor oils), Class C (electrical energized circuits), and Class D (combustible metals such as magnesium engine covers).
   - Carbon Monoxide Exhaust Capture: Dedicated mechanical ducted extraction hoses clamped directly to vehicle tailpipes, maintaining indoor CO concentrations strictly below 35 PPM.`
    },
    {
      track_id: track1Id,
      title: "Hazardous Chemical Management, SDS and EPA Clean Air Compliance",
      order_index: 2,
      content: `### Hazardous Materials Management and Environmental Standards

Chemical handling in automotive workshops is regulated by the OSHA Hazard Communication Standard (29 CFR 1910.1200) and EPA Resource Conservation and Recovery Act (RCRA):

1. Safety Data Sheets (SDS) and GHS Pictograms:
   - Standardized 16-section SDS documents detailing chemical composition, toxicological thresholds (PEL and TLV), exposure limits, flash points, and specific fire-fighting extinguishing media.
   - Mandatory secondary container labeling using GHS hazard pictograms (flame, corrosion, health hazard).

2. Hazardous Waste Stream Management:
   - Cradle-to-Grave Waste Tracking (RCRA): Used engine oil, transmission fluid, and oily sludge must be stored in labeled double-walled containment tanks with approved hazardous waste manifest tracking.
   - Lead-Acid Battery Acid Neutralization: Battery acid (sulfuric acid) spills neutralized with sodium bicarbonate (baking soda) until effervescence ceases prior to cleanup.
   - Parts Washers: Solvent-based parts cleaning units must feature automatic fusible-link fire closure lids.

3. EPA Section 609 Refrigerant Compliance:
   - Mandatory certified recovery equipment for mobile air conditioning refrigerants (R-134a and R-1234yf).
   - Strict prohibition of atmospheric venting; automated recovery units must achieve 95% refrigerant recovery efficiency before system opening.`
    },
    {
      track_id: track1Id,
      title: "High-Voltage Electric Vehicle Safety and Lockout/Tagout Protocols",
      order_index: 3,
      content: `### High-Voltage (HV) Safety in Electric and Hybrid Vehicles (SAE J2344 / NFPA 70E)

Modern battery electric vehicles (BEVs) operate on 400V to 800V direct current (DC) systems where electrical contact can cause fatal cardiac ventricular fibrillation:

1. High-Voltage Personal Protective Equipment:
   - Class 0 (1,000V Rated) Electrical Insulating Rubber Gloves: Must be paired with outer goat-skin leather protectors to prevent mechanical puncturing.
   - Pre-Use Air Leak Inspection: Technicians must perform a roll-and-trap air inflation test before every single use to verify zero microscopic pinhole leaks.
   - Mandatory laboratory dielectric re-testing every 6 months.
   - VDE / IEC 60900 Certified 1,000V Insulated Hand Tools with dual-color insulation.

2. Vehicle De-Energization and Lockout/Tagout (LOTO) Protocol:
   - Ignition power switched off, smart key removed to 15+ feet away, and 12V auxiliary battery disconnected.
   - High-Voltage Manual Service Disconnect (MSD) plug extracted and locked inside a dedicated padlock lockout station.
   - Capacitor Bleed-Down Time: Waiting a mandatory 5 to 10 minutes for internal inverter DC-link high-voltage bus capacitors to discharge through bleeder resistors.

3. Zero-Energy Verification (The Live-Dead-Live Protocol):
   - Using a CAT III / CAT IV 1000V rated True-RMS digital multimeter:
     1. Test meter on a known live voltage source.
     2. Test across high-voltage terminals (must verify < 5.0V DC).
     3. Re-test meter on a known live source to confirm meter functionality.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Precision Calipers, Dial Indicators and Dial Test Indicators",
      order_index: 1,
      content: `### Dimensional Metrology and Deflection Measurement

Precision engine building and transmission rebuilding require micrometer-level dimensional inspection:

1. Vernier and Digital Calipers:
   - Abbe's Principle of Measurement: For maximum accuracy, the measuring scale and the measured dimension must lie along the same collinear line.
   - Outside, inside, depth, and step measurements to 0.0005 inches (0.01 mm) resolution.
   - Parallax Error: Viewing vernier scales perpendicular to the eyesight line to eliminate visual alignment errors.

2. Dial Indicators and Magnetic Base Rigidity:
   - Plunger-Type Dial Indicators: Measure linear travel (typically 1.000 inch travel with 0.001 inch dial graduations). Used to measure crankshaft endplay, camshaft endplay, and brake rotor lateral runout.
   - Dial Test Indicators (DTI / Lever-Type): Highly sensitive lever mechanism with 0.0001 inch (0.0025 mm) resolution for measuring flyback deflection, transmission output shaft runout, and differential ring gear backlash.
   - Total Indicator Reading (TIR): The absolute algebraic difference between the highest positive peak and lowest negative valley on the dial sweep during a complete 360-degree rotation.`
    },
    {
      track_id: track2Id,
      title: "Precision Outside Micrometers, Dial Bore Gauges and Plastigage",
      order_index: 2,
      content: `### Precision Internal and External Bore Metrology

1. Precision Outside Micrometers:
   - Spindle and Anvil Metrology: Carbide-tipped measuring faces ground optically flat to within micro-inches.
   - Ratchet Thimble Mechanism: Ensures constant, standardized measuring contact pressure (typically 5 to 10 N) across all users.
   - Thermal Normalization: Calibrating micrometers at standard reference temperature (68 deg F / 20 deg C) using certified Grade 0 gauge blocks. Holding micrometers by thermal insulated frame grips prevents hand heat from expanding the steel frame.

2. Cylinder Bore Measurement and Taper Analysis:
   - Dial Bore Gauges (3-Point Centralizing Gauges): Zeroed using an outside micrometer mounted in a setting fixture.
   - Six-Point Cylinder Bore Inspection:
     - Measuring bore diameter at Top, Middle, and Bottom of cylinder travel.
     - Taking two perpendicular measurements at each level (Thrust Axis vs Non-Thrust Axis).
     - Cylinder Out-of-Round: Difference between thrust and non-thrust measurements at the same depth (< 0.0005 inches).
     - Cylinder Taper: Difference between top and bottom bore diameter (< 0.0005 inches).

3. Hydrodynamic Bearing Clearance Measurement with Plastigage:
   - Calibrated extruded wax thread placed across clean crankshaft journals. Bearing caps are torqued to full factory specification without rotating the shaft. The flattened wax width is measured against a calibrated graduated envelope scale to verify oil clearances (0.0015 to 0.0025 inches).`
    },
    {
      track_id: track2Id,
      title: "Thread Metrology, Tap and Die Mechanics and Thread Restoration",
      order_index: 3,
      content: `### Thread Metrology and Fastener Repair Engineering

1. Thread Geometry and Standards:
   - Unified National Thread (60-degree included angle): UNC (Coarse) for soft cast iron and aluminum; UNF (Fine) for high tensile strength in steel connections.
   - Metric Thread Standards (60-degree included angle): Designated by nominal diameter and thread pitch in millimeters (e.g. M10 x 1.50 = 10 mm diameter with 1.50 mm pitch between crests).
   - Thread Pitch Gauges: Matched leaves used to identify exact pitch and profile before threading.

2. Taps and Dies for Thread Cutting:
   - Taper Tap: Chamfered over 8 to 10 threads for easy straight alignment when starting new threads.
   - Plug Tap: Chamfered over 3 to 5 threads for general through-hole tapping.
   - Bottoming Tap: Chamfered over only 1 to 2 threads, designed to cut full threads to the absolute bottom of a blind hole.
   - Cutting Lubrication: High-sulfur cutting oil for steel, mineral spirits / kerosene for aluminum, dry tapping for cast iron.

3. Engineering Thread Repair Inserts:
   - Heli-Coil Wire Thread Inserts: Precision formed diamond-shaped 18-8 stainless steel wire coils wound into tapped holes.
   - Time-Sert Solid Bushing Inserts: Solid, synchronized threaded steel bushings with positive mechanical locking flanges, mandatory for high-stress repairs including cylinder head bolt holes and spark plug threads in aluminum heads.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Fastener Tribology, Clamping Physics and Torque-Angle Fastening",
      order_index: 1,
      content: `### Tribology of Threaded Fasteners and Clamping Preload

Threaded bolts act as precision mechanical springs clamping mating surfaces together:

1. The Fastener Clamping Equation (Hooke's Law):
\`\`\`
Torque (T) = K * F_preload * Nominal Diameter (D)
\`\`\`
   - Friction Distribution: In dry threaded fasteners, applied torque is dissipated as follows:
     - 50% lost to friction under the bolt head / washer face.
     - 40% lost to friction within mating thread flanks.
     - Only 10% of applied torque is converted into actual tensile elastic clamping force (preload).

2. Lubrication and the Torque Friction Multiplier (K-Factor):
   - Dry steel-on-steel friction factor \`K approx 0.20\`.
   - Applying engine oil or anti-seize reduces \`K to approx 0.12\`.
   - Critical Warning: If a bolt specified for dry torque is torqued with anti-seize lubrication to the same numerical torque value, bolt clamping tension increases by over 65%, risking instantaneous bolt shearing or stripped threads.

3. Torque-Angle and Torque-to-Yield (TTY) Fastening:
   - Snug Torque Stage: Torquing fasteners to a baseline threshold (e.g. 35 lb-ft) to seat components.
   - Angle Stage: Rotating the bolt through a specified angular rotation (e.g. 90 degrees + 90 degrees) using a digital torque-angle meter. Angular rotation correlates directly with thread pitch elongation, completely eliminating friction variability and stretching the fastener into its engineered plastic yield plateau.`
    },
    {
      track_id: track3Id,
      title: "Pneumatic Workshops, Air Compressors and 50-Ton Hydraulic Presses",
      order_index: 2,
      content: `### Workshop Pneumatics and Heavy Hydraulic Machinery

1. Compressed Air System Architecture:
   - Two-Stage Reciprocating Compressors: Delivering 150 to 175 PSI plant air.
   - Moisture Removal: Refrigerated air dryers and desiccant filtration units removing water vapor to prevent internal corrosion and freezing in pneumatic tools.
   - Point-of-Use FRL Units: Filter, Regulator, and Lubricator assemblies providing clean, regulated pressure and atomized tool oil.

2. Pneumatic Tool Mechanics:
   - Twin-Hammer Impact Mechanisms: High-frequency rotational shock blows (1,200 to 1,800 impacts/min) generating 500 to 1,200+ lb-ft of loosening torque without transferring high reactive torque to the technician's hands.
   - High-Speed Die Grinders and Cut-Off Wheels: Operating at 20,000 to 25,000 RPM; mandatory verification that grinding disc maximum RPM rating exceeds tool free speed.

3. Hydraulic Shop Presses (20 to 50 Ton Capacity):
   - Bearing and Bushing Pressing Protocols:
     - Always apply pressing force exclusively to the press-fit race (e.g. press only on the outer race when pressing a bearing into a knuckle housing; press only on the inner race when pressing onto a shaft).
     - Never transmit pressing force through bearing rolling elements (balls or rollers); doing so causes micro-denting (Brinelling) of the raceways, leading to immediate bearing failure and howling noise.`
    },
    {
      track_id: track3Id,
      title: "Automotive Vehicle Lifts, Rigging Safety and ASME Jack Stands",
      order_index: 3,
      content: `### Vehicle Lifting Dynamics and Structural Safety

Under-vehicle service represents the single highest catastrophic crushing risk in automotive maintenance:

1. Automotive Lift Institute (ALI / ANSI ALCTV) Certified Lifts:
   - Two-Post Above-Ground Surface Lifts:
     - Asymmetric Lifts: Turned columns and unequal-length swing arms positioning the vehicle center of gravity rearward, allowing vehicle doors to open freely.
     - Symmetric Lifts: Equal-length arms positioning vehicle centrally for heavy trucks and vans.
   - Locating Manufacturer Lifting Points: Lifting pads must contact reinforced frame rails or pinch weld lift points. Never position lift arms on floor pans, steering tie rods, driveshafts, or aluminum suspension links.
   - The Mandatory Mechanical Lock Procedure:
     - Raise the vehicle 6 inches and perform a vigorous physical shake test to confirm stability.
     - Raise vehicle to desired height, then immediately lower the lift down onto the mechanical load-holding safety locking dogs; never work under a lift supported solely by hydraulic cylinder pressure.

2. Hydraulic Floor Jacks and ASME PASE Jack Stands:
   - Hydraulic floor jacks are strictly lifting devices, never load-holding devices (internal hydraulic seals can fail without warning).
   - Once raised, vehicles must be supported immediately on rated, certified steel jack stands with positive mechanical ratchet pawls or locking pins, placed on solid, level reinforced concrete.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #17.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "What class of electrical insulating rubber gloves, rated for 1,000V AC / 1,500V DC and protected by leather outer gloves, is required for servicing High-Voltage Electric and Hybrid Vehicles?",
      options: [
        "Class 00 (500V rated)",
        "Class 0 (1,000V rated)",
        "Class 3 (26,500V rated)",
        "Standard household cotton gardening gloves"
      ],
      correct_option_index: 1,
      explanation: "Class 0 rubber insulating gloves (rated for 1,000V AC / 1,500V DC) paired with protective leather over-gloves are mandatory for high-voltage EV service.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What essential safety procedure must be performed immediately after raising a vehicle on a two-post automotive lift before walking underneath to begin work?",
      options: [
        "Turn off the shop interior lights",
        "Disconnect the building main power",
        "Open all vehicle windows",
        "Lower the lift down onto its mechanical load-holding safety locks so vehicle weight is supported mechanically rather than by hydraulic pressure"
      ],
      correct_option_index: 3,
      explanation: "Lifts must always be lowered onto mechanical safety dogs; hydraulic pressure alone must never be relied upon to support a vehicle with technicians underneath.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What precision measuring tool is used to measure cylinder bore out-of-round and taper across top, middle, and bottom depths with 0.0001-inch resolution?",
      options: [
        "Dial Bore Gauge (3-Point Centralizing Gauge)",
        "Carpentry Tape Measure",
        "Standard Bubble Level",
        "Tire Pressure Gauge"
      ],
      correct_option_index: 0,
      explanation: "A Dial Bore Gauge zeroed against an outside micrometer precisely measures bore taper and out-of-round across multiple cylinder depths.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In dry threaded fastener tightening, approximately what percentage of the total applied wrench torque is converted into actual tensile elastic clamping preload force?",
      options: [
        "100% of applied torque",
        "50% of applied torque",
        "Approximately 10% of applied torque (with 90% lost to under-head and thread flank friction)",
        "0% of applied torque"
      ],
      correct_option_index: 2,
      explanation: "Approximately 90% of torque is consumed overcoming friction (50% under head, 40% in threads), leaving only ~10% to generate actual bolt clamping stretch.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What type of thread tap is chamfered over only 1 to 2 threads and is engineered specifically to cut full threads to the absolute bottom of a blind hole?",
      options: [
        "Taper Tap",
        "Bottoming Tap",
        "Plug Tap",
        "Die Nut"
      ],
      correct_option_index: 1,
      explanation: "Bottoming taps have minimal chamfer (1-2 threads), allowing them to thread all the way to the bottom base of blind holes.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "When verifying that a high-voltage hybrid or electric vehicle circuit is completely de-energized, what is the 'Live-Dead-Live' multimeter testing protocol?",
      options: [
        "Testing the vehicle battery while running the radio",
        "Measuring resistance on a live 400V cable",
        "Testing the multimeter on a known live voltage source, testing the de-energized circuit to confirm < 5V, and immediately re-testing the meter on a known live source to verify meter integrity",
        "Touching the high-voltage wire with a metal screwdriver to see if it sparks"
      ],
      correct_option_index: 2,
      explanation: "The Live-Dead-Live protocol tests the meter on a live circuit, checks the target circuit for zero voltage (< 5V), and re-verifies the meter on a live circuit to confirm it did not fail.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "When pressing a new wheel bearing into a steering knuckle housing using a hydraulic shop press, where must the pressing adapter sleeve apply force?",
      options: [
        "Exclusively to the bearing's OUTER race, never transmitting pressing force through the internal balls or rollers",
        "Directly to the plastic bearing dust seal",
        "Exclusively to the inner race",
        "Directly across the rotating center balls"
      ],
      correct_option_index: 0,
      explanation: "When pressing into a housing, force must be applied only to the outer press-fit race to avoid transmitting force through balls/rollers which causes brinelling damage.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What happens if a technician applies anti-seize lubricant to a cylinder head bolt specified by the manufacturer for DRY torque tightening, and torques it to the published dry numerical spec?",
      options: [
        "The bolt will automatically unthread itself immediately",
        "The engine will run 50 degrees cooler",
        "The bolt will refuse to turn",
        "The reduced thread friction (lower K-factor) causes bolt tension and clamping force to increase by over 60%, risking bolt tensile fracture or stripped block threads"
      ],
      correct_option_index: 3,
      explanation: "Lubricating dry threads reduces friction from K=0.20 to K=0.12, causing over 60% higher bolt tension at the same torque, frequently causing bolt shear.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What precision measuring material consists of calibrated extruded wax threads placed across crankshaft journals to measure hydrodynamic oil clearances upon bearing cap torquing?",
      options: [
        "Solder Wire",
        "Plastigage",
        "Teflon Thread Tape",
        "RTV Silicone"
      ],
      correct_option_index: 1,
      explanation: "Plastigage is a calibrated wax thread that squashes under bearing cap torque; measuring the flattened wax width reveals precise journal oil clearance.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What solid bushing thread repair insert provides synchronized internal and external threads with a mechanical locking flange, making it mandatory for high-stress repairs like spark plug and head bolt threads in aluminum?",
      options: [
        "Epoxy Putty",
        "Heli-Coil Wire Insert",
        "Time-Sert Solid Bushing Insert",
        "Wooden Dowel Pin"
      ],
      correct_option_index: 2,
      explanation: "Time-Sert solid bushing inserts provide high mechanical strength with positive locking flanges, ideal for high-stress head bolt and spark plug thread repairs.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "Why is Torque-Angle (Torque-to-Yield) tightening superior to traditional single-stage click torque wrenches on critical engine fasteners like cylinder head bolts?",
      options: [
        "Tightening through a specified angular rotation stretches the fastener based directly on thread pitch elongation, completely eliminating thread friction variables and yielding uniform bolt clamping preload",
        "Torque-angle wrenches do not require human operators",
        "Torque-angle fastening allows bolts to be removed with bare hands",
        "Torque-angle fastening eliminates the need for gaskets"
      ],
      correct_option_index: 0,
      explanation: "Rotating a fastener through a specified angle converts rotational degrees directly into linear bolt stretch via thread pitch, bypassing friction inconsistencies.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "What inspection must a technician perform on Class 0 high-voltage electrical insulating rubber gloves before every single use prior to EV maintenance?",
      options: [
        "Washing them with brake cleaner solvent",
        "Heating them in an oven to 200 degrees C",
        "Measuring their weight on a gram scale",
        "A manual roll-and-trap air inflation test, squeezing the cuff to trap air and inspecting the glove under pressure for microscopic pinholes, cracks, or punctures"
      ],
      correct_option_index: 3,
      explanation: "Rolling the glove cuff to trap air pressurizes the fingers and palm, allowing visual and acoustic detection of microscopic pinholes that could conduct fatal high voltage.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "According to Abbe's Principle of Dimensional Metrology, what fundamental geometry must be maintained to minimize measuring instrument error in calipers and micrometers?",
      options: [
        "The tool must be made of plastic",
        "The measuring scale and the axis of the measured dimension must be collinear (lie along the exact same straight line)",
        "The tool must be submerged in motor oil during measurement",
        "The measuring faces must be curved"
      ],
      correct_option_index: 1,
      explanation: "Abbe's principle states that measurement errors are minimized when the measuring scale and the measured component lie along the same line of action (as in micrometers).",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "When measuring a rotating component using a dial indicator mounted on a magnetic base, what is Total Indicator Reading (TIR)?",
      options: [
        "The weight of the dial indicator in grams",
        "The total number of dial rotations divided by RPM",
        "The absolute algebraic difference between the highest positive peak and lowest negative valley recorded by the indicator pointer over a complete 360-degree rotation",
        "The average diameter of the shaft"
      ],
      correct_option_index: 2,
      explanation: "TIR (Total Indicator Reading) represents the full sweep distance between minimum and maximum indicator dial points during one complete rotation.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "Under EPA Section 609 clean air regulations, what standard must mobile air conditioning refrigerant recovery and recycling stations achieve prior to technicians opening an A/C system?",
      options: [
        "The recovery equipment must pull a deep vacuum and achieve at least 95% refrigerant recovery efficiency to prevent atmospheric venting",
        "The system must be vented through a water bucket",
        "Refrigerant must be burned in the shop furnace",
        "Technicians must wear scuba diving tanks"
      ],
      correct_option_index: 0,
      explanation: "EPA Section 609 mandates certified recovery equipment capable of extracting at least 95% of refrigerant under deep vacuum before opening A/C lines.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #17.");
  console.log("Skill #17 update completed successfully!");
}

run();
