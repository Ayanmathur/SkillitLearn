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

const skillId = "9295a062-55ac-42f7-b9bd-0b0d598e6a68";

async function run() {
  console.log("Updating Skill #16: Brakes & Suspension Repair (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Brake Hydraulics, Fluid Chemistry and Friction Tribology" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Anti-Lock Brakes (ABS), Stability Control and Electric Parking Brakes" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Suspension Kinematics, Steering and Four-Wheel Alignment" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Pascal's Law, Hydraulic Master Cylinders and Brake Boosters",
      order_index: 1,
      content: `### Principles of Automotive Brake Hydraulics

Automotive friction braking converts vehicle kinetic energy into thermal heat energy through pressurized hydraulic fluid:

1. Fluid Mechanics in Closed Systems (Pascal's Principle):
   - Pressure applied to an enclosed, incompressible liquid is transmitted undiminished in all directions:
\`\`\`
Pressure (P) = Force (F) / Piston Area (A)
\`\`\`
   - Mechanical Advantage Multiplication:
     - Mechanical Pedal Leverage Ratio: Typically 3.5:1 to 4.5:1 (a 100 lb driver pedal effort delivers 400 lbs of force to the master cylinder pushrod).
     - Hydraulic Multiplication: The ratio of large caliper slave piston area to small master cylinder bore area multiplies hydraulic clamping force by an additional 400% to 800% at the wheel calipers.

2. Tandem Dual-Split Master Cylinders:
   - Primary and secondary piston chambers provide independent hydraulic split circuits:
     - Diagonal Split (Standard in FWD vehicles): Front-Left paired with Rear-Right; Front-Right paired with Rear-Left. If one line ruptures, 50% braking power and balanced steering stability remain.
     - Front/Rear Split: Front axle on primary circuit, rear axle on secondary.

3. Power Brake Boosters:
   - Vacuum Boosters: Uses engine intake manifold vacuum (18 to 22 in-Hg) acting across a rubber diaphragm to amplify driver pedal effort.
   - Hydraulic Hydro-Boost: Uses high-pressure fluid (1,500+ PSI) from the power steering pump (standard on heavy-duty diesel trucks).
   - Electro-Mechanical Brake Boosters (iBooster): High-torque brushless electric motors providing instantaneous electronically mapped boost for electric and hybrid vehicles.`
    },
    {
      track_id: track1Id,
      title: "Brake Fluid Chemistry, Hygroscopic Degradation and Vapor Lock",
      order_index: 2,
      content: `### Brake Fluid Chemistry and FMVSS 116 Specifications

Brake fluid must maintain strict boiling points, thermal stability, rubber elastomer seal compatibility, and low viscosity at sub-zero temperatures:

1. DOT Brake Fluid Classifications:
   - Glycol-Ether Based Fluids:
     - DOT 3: Minimum Dry Boiling Point = 401 deg F (205 deg C); Minimum Wet Boiling Point = 284 deg F (140 deg C).
     - DOT 4 (Borate Ester additives): Minimum Dry Boiling Point = 446 deg F (230 deg C); Minimum Wet Boiling Point = 311 deg F (155 deg C).
     - DOT 5.1 (Low-Viscosity Glycol): Minimum Dry = 500 deg F (260 deg C); Minimum Wet = 356 deg F (180 deg C). Specifically engineered with low dynamic kinematic viscosity at -40 deg C to permit rapid cycling in modern ABS and ESP solenoid valves.
   - Silicone-Based Fluids:
     - DOT 5 (Polydimethylsiloxane): Hydrophobic, non-hygroscopic (Dry = 500 deg F). Strictly incompatible with ABS systems because rapid solenoid pulsing aerates the silicone fluid, forming spongy micro-bubbles.

2. Hygroscopic Moisture Absorption and Vapor Lock:
   - Glycol fluids are hygroscopic, naturally absorbing atmospheric humidity through microscopic rubber hose pores (typically 2% to 3% water by volume every 18 to 24 months).
   - Vapor Lock Failure: Absorbed water severely degrades boiling points. Under sustained downhill braking, caliper temperatures exceed 300 deg F; absorbed moisture boils into compressible steam pockets. When the driver presses the brake pedal, the compressible steam collapses completely, causing total loss of braking pedal pressure.`
    },
    {
      track_id: track1Id,
      title: "Brake Friction Materials, Disc Rotor Metrology and Pad Bedding",
      order_index: 3,
      content: `### Tribology of Brake Friction Pairs

Friction linings clamp against rotating disc brake rotors to generate decelerating torque:

1. Friction Material Formulations:
   - Non-Asbestos Organic (NAO): Glass, rubber, and carbon bonded with phenolic resins. Quiet, gentle on rotors, but suffers severe thermal fade at temperatures above 400 deg F (200 deg C).
   - Semi-Metallic (30% to 65% steel fibers and copper): High coefficient of friction (mu = 0.38 to 0.45), extreme high-temperature thermal conductivity (fade resistant up to 1,000 deg F), but higher rotor wear and metallic brake dust.
   - Ceramic Formulations: Ceramic fibers and non-ferrous filler metals. Stable friction coefficient across street temperature ranges, ultra-low dusting, and quiet operation.

2. Precision Brake Rotor Metrology:
   - Lateral Runout (LRO): Measured using a dial indicator mounted on the steering knuckle while rotating the rotor. Maximum allowable LRO is strictly < 0.002 inches (0.050 mm). Excessive runout causes the rotor to slap brake pads back and forth.
   - Disc Thickness Variation (DTV): Measured with an outside micrometer at 8 equidistant points around the friction track. DTV exceeding 0.0005 inches (0.013 mm) causes hydraulic pedal pulsation and vehicle steering shudder during braking.

3. Friction Transfer Layer Bedding (Burnishing):
   - Proper pad bedding involves a series of moderate decelerations (e.g. 60 MPH down to 15 MPH) that generate controlled interface temperatures (400 to 500 deg F), depositing an even, adherent microscopic transfer film of friction material onto the rotor surface.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Anti-Lock Brakes (ABS), Modulator Valves and Wheel Speed Sensors",
      order_index: 1,
      content: `### Anti-Lock Braking System (ABS) Dynamics

ABS prevents wheel lockup during emergency braking, maintaining tire tractive steering control:

1. Longitudinal Tire Slip Mechanics:
\`\`\`
Slip Ratio (S) = [(Vehicle Speed - Wheel Speed) / Vehicle Speed] * 100%
\`\`\`
   - Peak Braking Coefficient (mu_peak): Maximum road grip occurs between 15% and 20% wheel slip. Beyond 20% slip, tire adhesion drops into sliding kinetic friction, and lateral cornering force drops to zero (locking wheels prevents steering).

2. ABS Hydraulic Modulator Operation:
   - An electro-hydraulic unit comprising an electric motor pump, low-pressure accumulators, and 8 to 12 high-speed solenoid valves.
   - Three-Phase Pressure Control Loop (Cycling at 15 to 25 Hz):
     - Pressure Hold: Closes inlet valve when wheel deceleration indicates impending lockup, locking caliper hydraulic pressure.
     - Pressure Dump: Opens outlet valve, bleeding fluid to the low-pressure accumulator to allow the wheel to spin back up.
     - Pressure Increase: Motor pump re-pressurizes the circuit, reapplying clamping force.

3. Wheel Speed Sensor (WSS) Technologies:
   - Passive Variable Reluctance (VR) Sensors: 2-wire magnetic sensors generating AC voltage (cannot read below 3 to 5 MPH).
   - Active Digital Sensors (Hall Effect / Magnetoresistive): 2-wire active sensors reading multi-pole magnetic encoder rings integrated into wheel hub bearing seals, outputting square-wave current pulses accurate down to 0.1 MPH.`
    },
    {
      track_id: track2Id,
      title: "Electronic Stability Control (ESC), Yaw Dynamics and Traction Control",
      order_index: 2,
      content: `### Active Vehicle Dynamics and Stability Control (FMVSS 126)

Electronic Stability Control (ESC / ESP) uses automated individual wheel braking to correct vehicle skids:

1. Critical Sensor Network:
   - Steering Angle Sensor (SAS): Measures driver intended direction and steering angular velocity (degrees/sec).
   - Yaw Rate Sensor: Micro-Electro-Mechanical (MEMS) gyroscopic sensor measuring vehicle rotational velocity about its vertical Z-axis (deg/sec).
   - Lateral Acceleration Sensor: Measures lateral G-forces.
   - Wheel Speed Sensors: Measures individual wheel angular velocities.

2. Correcting Dynamic Handling Instabilities:
   - Understeer Correction (Vehicle plows forward, failing to turn):
     - The ESC module automatically applies braking force to the INSIDE REAR wheel. This generates an inward corrective yaw torque that rotates the vehicle nose into the turn.
   - Oversteer Correction (Vehicle fishtails, rear end swings out):
     - The ESC module automatically applies braking force to the OUTSIDE FRONT wheel. This generates an opposing outward stabilizing yaw torque that counteracts the spin.

3. Electronic Brake-Force Distribution (EBD):
   - Software algorithm that monitors rear wheel slip during braking, dynamically regulating rear brake pressure to maximize total stopping power without locking rear wheels under varying vehicle cargo weights.`
    },
    {
      track_id: track2Id,
      title: "Electric Parking Brakes and Regenerative Braking Integration",
      order_index: 3,
      content: `### Modern Electronic Actuation and Hybrid Braking

1. Electric Parking Brakes (EPB / Motor-on-Caliper):
   - Replaces mechanical handbrake cables with high-torque DC electric gearmotors mounted directly onto the rear disc brake calipers.
   - Planetary reduction gearsets drive a high-precision internal ball-screw mechanism, clamping the caliper piston against the rotor with over 20 kN of clamping force.
   - Service Mode Retraction: Technicians must put the EPB into 'Service / Pad Replacement Mode' using a diagnostic scan tool (or in-cab menu) to electrically reverse the internal spindle motor before compressing the caliper piston; manually forcing the piston back without retraction destroys the planetary gear mechanism.

2. Brake-by-Wire and Regenerative Blending:
   - Decoupled Electro-Hydraulic Braking (EHB): The physical brake pedal is disconnected from the hydraulic caliper lines during normal driving, operating against an electronic pedal feel simulator.
   - Regenerative Braking Blending: The vehicle control module utilizes electric drive motors as generators to harvest up to 0.3G of decelerating kinetic energy into high-voltage battery storage, seamlessly transitioning to hydraulic friction calipers only during heavy panic stops or when bringing the vehicle to a complete standstill.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Suspension Kinematics: MacPherson, Double Wishbone and Dampers",
      order_index: 1,
      content: `### Kinematics and Dynamics of Suspension Systems

Suspension systems manage wheel travel, body roll, and tire contact patch geometry across uneven terrain:

1. Suspension Topologies:
   - MacPherson Strut: Compact, lightweight design where the hydraulic strut damper assembly acts as the upper structural locating link and steering pivot. Limited camber gain during body roll.
   - Double Wishbone (Short-Long Arm - SLA): Features unequal-length upper and lower control arms (A-arms). Engineered so the shorter upper wishbone swings through a tighter arc during suspension compression (jounce), inducing negative camber gain that keeps the tire contact patch flat against the pavement during high-G cornering.
   - Multi-Link Suspension: 4 or 5 independent kinematic links per wheel, completely decoupling lateral cornering stiffness from longitudinal ride compliance.

2. Hydraulic Shock Absorbers (Dampers):
   - Dampers dissipate spring oscillation energy through fluid viscous friction, generating damping force proportional to piston velocity squared (\`F_damping proportional to v^2\`).
   - Mono-Tube vs Twin-Tube Gas Dampers: High-pressure nitrogen gas charge (200 to 300 PSI) in mono-tube dampers acts across a floating separator piston, preventing hydraulic oil aeration, foaming, and cavitation fade under severe washboard road conditions.

3. Magnetorheological (MR) Active Dampers:
   - Damper fluid contains microscopic carbonyl iron spheres suspended in synthetic oil. Energizing internal electromagnetic coils aligns iron particles into fibrous chains, altering fluid viscosity and damping resistance within 1 millisecond.`
    },
    {
      track_id: track3Id,
      title: "Steering Systems: Rack-and-Pinion, EPS and Geometry Fundamentals",
      order_index: 2,
      content: `### Automotive Steering Kinematics

Steering systems translate rotational steering wheel inputs into lateral tie rod motion:

1. Electric Power Steering (EPS) Architectures:
   - Column-Assist (C-EPS): Electric motor mounted on the interior steering column (light passenger cars).
   - Rack-Assist (R-EPS / Belt-Drive Ball-Nut): High-torque brushless electric motor drives a recirculating ball-nut on the steering rack via a toothed belt (heavy SUVs and performance vehicles).
   - Torque Sensor and Steering Angle Sensor: Measures driver steering torque and rotational speed at 500 Hz to calculate variable assist curves.

2. Fundamental Steering Geometry:
   - Ackerman Steering Geometry:
     - When navigating a turn, the inside wheel must trace a tighter radius than the outside wheel.
     - Steering arms are angled inward toward the center of the rear axle so that the inside wheel turns at a sharper angle than the outside wheel (\`cot(theta_outside) - cot(theta_inside) = Track_Width / Wheelbase\`), preventing tire scrubbing and side-slip wear.
   - Scrub Radius:
     - The distance on the ground between the Kingpin Inclination (KPI / Steering Axis Inclination - SAI) centerline and the center of the tire contact patch.
     - Positive Scrub Radius: Steering axis intersects road inside the tire center.
     - Negative Scrub Radius (Standard in modern FWD/AWD): Steering axis intersects road outside the tire center; automatically counter-steers if one front tire blows out or encounters ice during braking.`
    },
    {
      track_id: track3Id,
      title: "Four-Wheel Alignment Geometry: Camber, Caster, Toe and Thrust",
      order_index: 3,
      content: `### Precision Wheel Alignment Engineering

Four-wheel computerized alignment aligns all four wheels relative to the geometric center and thrust line of the vehicle:

1. Camber Angle:
   - The inward (negative) or outward (positive) vertical tilt of the top of the tire when viewed from the front of the vehicle.
   - Moderate negative camber (-0.5 to -1.5 degrees) improves cornering grip; excessive negative camber causes rapid wear on the inside tire shoulder.

2. Caster Angle:
   - The forward (negative) or rearward (positive) tilt of the steering axis pivot line when viewed from the side of the vehicle.
   - Positive Caster (+3.0 to +7.0 degrees): Places the tire contact patch behind the steering axis intersection point (like a shopping cart caster wheel), providing high-speed straight-line directional stability and natural self-centering steering wheel return.

3. Toe Angle (The #1 Cause of Rapid Tire Wear):
   - The inward (Toe-In) or outward (Toe-Out) pointing of the wheels relative to the vehicle longitudinal centerline when viewed from above.
   - Just 1/8 inch (3 mm) of incorrect toe scrubs the tire sideways across the pavement by 28 feet for every single mile traveled, completely destroying tire tread within a few thousand miles.

4. Thrust Angle and Setback:
   - Thrust Line: The perpendicular line to the rear axle centerline.
   - Thrust Angle: The angle between the thrust line and the vehicle geometric centerline. A non-zero thrust angle causes the vehicle to 'dog-track' sideways down the road with an off-center steering wheel.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #16.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "What fundamental physical law states that pressure applied to an enclosed liquid is transmitted undiminished in all directions throughout the fluid?",
      options: [
        "Pascal's Principle (Pascal's Law)",
        "Newton's Third Law",
        "Hooke's Law of Elasticity",
        "Bernoulli's Principle"
      ],
      correct_option_index: 0,
      explanation: "Pascal's Law is the foundation of hydraulic braking: pressure applied to the master cylinder is transmitted equally to all wheel caliper slave cylinders.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What dangerous braking failure occurs when hygroscopic moisture absorbed in glycol brake fluid boils into compressible steam pockets during heavy braking, causing the brake pedal to drop to the floor?",
      options: [
        "Hydraulic Hydro-planing",
        "ABS Lockout",
        "Vapor Lock",
        "Brake Pad Glazing"
      ],
      correct_option_index: 2,
      explanation: "Vapor lock occurs when heat boils absorbed moisture in degraded brake fluid into compressible steam, causing total loss of hydraulic brake pedal pressure.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What wheel alignment angle is the single most critical adjustment determining rapid tire tread wear, where just 1/8 inch of error scrubs tires sideways across the road by 28 feet per mile?",
      options: [
        "Caster Angle",
        "Toe Angle (Toe-In / Toe-Out)",
        "Kingpin Inclination (KPI)",
        "Steering Axis Offset"
      ],
      correct_option_index: 1,
      explanation: "Toe angle alignment is the primary cause of rapid tire scrub wear; incorrect toe drags the tire sideways continuously down the road.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In vehicle steering geometry, what design layout ensures that the inside front wheel turns at a sharper angle than the outside wheel during a corner to prevent tire scrub?",
      options: [
        "Negative Camber Geometry",
        "Zero Caster Geometry",
        "Direct Drive Geometry",
        "Ackerman Steering Geometry"
      ],
      correct_option_index: 3,
      explanation: "Ackerman geometry angles steering arms so the inside wheel turns tighter than the outside wheel, matching their differing turning radius paths.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What mandatory service procedure must be performed using a diagnostic scan tool prior to mechanically replacing rear brake pads on a vehicle equipped with Motor-on-Caliper Electric Parking Brakes (EPB)?",
      options: [
        "Put the EPB system into 'Service / Pad Replacement Mode' to electrically retract the internal caliper ball-screw spindle motors",
        "Bleed all four brake calipers with gasoline",
        "Disconnect the front steering tie rods",
        "Over-inflate the vehicle tires to 60 PSI"
      ],
      correct_option_index: 0,
      explanation: "EPB systems require electronic service mode retraction to wind back the internal gearmotor spindle before the caliper piston can be safely pushed back.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "During an active Electronic Stability Control (ESC) intervention, what automated action is taken to correct severe vehicle OVERSTEER (where the rear of the car fishtails outward in a corner)?",
      options: [
        "The system applies maximum throttle to all four wheels",
        "The system locks the steering wheel in place",
        "The system shuts off the engine cooling fan",
        "The ESC module automatically applies braking force specifically to the OUTSIDE FRONT wheel to create an opposing corrective stabilizing yaw moment"
      ],
      correct_option_index: 3,
      explanation: "To correct oversteer fishtailing, ESC brakes the outside front wheel, creating an outward stabilizing yaw torque that pulls the vehicle back on line.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "What is the maximum allowable Lateral Runout (LRO) specification for a modern automotive disc brake rotor measured with a dial indicator?",
      options: [
        "0.050 inches (1.27 mm)",
        "Less than 0.002 inches (0.050 mm)",
        "0.250 inches (6.35 mm)",
        "Runout has zero effect on braking performance"
      ],
      correct_option_index: 1,
      explanation: "Brake rotor lateral runout must be strictly under 0.002 inches (0.050 mm); excessive runout causes uneven pad wear and disc thickness variation.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In Double Wishbone (Short-Long Arm - SLA) suspension geometry, what is the primary kinematic advantage of making the upper control arm shorter than the lower control arm?",
      options: [
        "As the suspension compresses in jounce, the shorter upper arm swings through a tighter arc, inducing negative camber gain that keeps the tire contact patch flat against the pavement during high-G cornering",
        "It eliminates the need for shock absorbers",
        "It makes the vehicle 50% lighter",
        "It allows the wheels to turn 360 degrees"
      ],
      correct_option_index: 0,
      explanation: "Short-Long Arm geometry induces negative camber as the suspension compresses under cornering body roll, maintaining optimal tire contact patch grip.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "Why is silicone-based DOT 5 brake fluid strictly prohibited from being used in vehicles equipped with Anti-Lock Braking Systems (ABS)?",
      options: [
        "DOT 5 is highly corrosive to titanium",
        "DOT 5 freezes at room temperature",
        "Rapid cycling of ABS solenoid valves aerates silicone fluid into foamy micro-bubbles, causing severe spongy pedal drop and loss of pressure",
        "DOT 5 is conductive and causes electrical shorts"
      ],
      correct_option_index: 2,
      explanation: "DOT 5 silicone fluid aerates into compressible foam under rapid ABS valve pulsing (15-25 Hz), compromising emergency hydraulic brake pressure.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What wheel alignment angle describes the forward or rearward tilt of the steering knuckle pivot axis when viewed from the side, providing straight-line directional stability and steering wheel returnability?",
      options: [
        "Camber Angle",
        "Toe-Out on Turns",
        "Thrust Angle",
        "Positive Caster Angle"
      ],
      correct_option_index: 3,
      explanation: "Positive caster tilts the steering axis rearward at the top, creating a self-centering trailing effect that provides straight-line stability and steering return.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In vehicle longitudinal tire dynamics, at what slip ratio percentage does peak braking friction (mu_peak) occur before tire adhesion drops into sliding kinetic friction?",
      options: [
        "0% wheel slip (free rolling)",
        "Between 15% and 20% wheel slip",
        "100% wheel slip (fully locked wheel)",
        "50% to 60% wheel slip"
      ],
      correct_option_index: 1,
      explanation: "Peak braking traction occurs between 15% and 20% slip; beyond 20%, tire grip transitions into locked sliding friction with zero lateral steering ability.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "A technician measures Disc Thickness Variation (DTV) across a ventilated brake rotor using an outside micrometer at 8 points. What maximum variation threshold will trigger noticeable brake pedal pulsation and vehicle shudder during moderate braking?",
      options: [
        "0.050 inches (1.27 mm)",
        "0.010 inches (0.25 mm)",
        "As little as 0.0005 inches (0.013 mm / 13 microns) of variation",
        "1.00 inch"
      ],
      correct_option_index: 2,
      explanation: "Disc thickness variation as small as 0.0005 inches (13 microns) causes periodic displacement of caliper pistons, creating hydraulic brake pedal pulsation.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "How does a Negative Scrub Radius steering geometry benefit driver safety in modern front-wheel-drive vehicles during emergency braking on split-mu surfaces (e.g. left tire on dry asphalt, right tire on ice)?",
      options: [
        "The steering axis intersects the ground outside the tire centerline; the tire with higher traction creates a natural self-correcting steering moment that counteracts the vehicle's tendency to spin toward the high-traction side",
        "It locks the steering wheel permanently straight",
        "It eliminates all mechanical friction in the rack",
        "It disconnects the front brakes automatically"
      ],
      correct_option_index: 0,
      explanation: "Negative scrub radius uses the higher-traction tire's drag to generate an opposing steering torque, automatically counter-steering to keep the car straight.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "How do Magnetorheological (MR) active suspension dampers alter damping resistance within 1 millisecond without utilizing mechanical stepper motors or moving spool valves?",
      options: [
        "By heating damper oil to 500 degrees C",
        "By injecting compressed air into the damper tube",
        "By draining fluid into an external reservoir",
        "Damper fluid contains microscopic iron spheres; energizing an internal electromagnetic coil aligns the particles into microscopic fibrous chains, increasing fluid shear viscosity instantly"
      ],
      correct_option_index: 3,
      explanation: "Magnetorheological fluid contains suspended carbonyl iron particles that align into rigid chains under magnetic fields, altering viscosity and damping in 1 ms.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In four-wheel computerized alignment, what is the 'Thrust Angle' and what vehicle handling symptom is caused when the thrust angle is out of specification?",
      options: [
        "The angle of the engine crankshaft; causes misfires",
        "The angle between the rear axle perpendicular thrust line and the vehicle geometric centerline; causes the vehicle to 'dog-track' sideways down the road with a crooked steering wheel",
        "The angle of the front windshield; causes wind noise",
        "The angle of the exhaust pipe; causes emissions failure"
      ],
      correct_option_index: 1,
      explanation: "Thrust angle represents the directional push of the rear wheels relative to chassis centerline. An incorrect thrust angle causes dog-tracking and off-center steering.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #16.");
  console.log("Skill #16 update completed successfully!");
}

run();
