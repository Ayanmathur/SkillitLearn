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

const skillId = "ac2fad39-0502-45b2-8b95-cb848d86c810";

async function run() {
  console.log("Updating Skill #15: Electrical Systems Diagnostics (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: DC Circuit Laws, Voltage Drop Metrology and Oscilloscopes" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Automotive Sensor Physics, Actuators and Ignition Electronics" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: CAN Bus Networks, Multiplex Diagnostics and Smart Charging" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "DC Circuit Fundamentals, Kirchhoff's Laws and Voltage Drop Metrology",
      order_index: 1,
      content: `### Electrical Physics in 12V and 48V Automotive Architectures

Automotive electrical diagnostics requires rigorous application of direct current (DC) circuit laws:
1. Fundamental Circuit Laws:
   - Ohm's Law: Voltage equals current multiplied by resistance (\`V = I * R\`).
   - Kirchhoff's Voltage Law (KVL): The algebraic sum of all voltage drops around any closed electrical loop must equal the source voltage.
   - Kirchhoff's Current Law (KCL): The total current entering a circuit node equals the total current leaving that node.
   - Electrical Power Equations: \`P = V * I = I^2 * R = V^2 / R\` (Watts).

2. The Power of Live Voltage Drop Testing:
   - Static Resistance Testing Fallacy: Measuring resistance with an ohmmeter on a disconnected, unloaded wire is deeply deceptive; an ohmmeter passes only micro-amps. A high-amperage cable with 95% of its copper strands broken will measure 0.1 ohms on an ohmmeter, but will suffer massive voltage drop and fail completely when carrying a 20-Amp load.
   - Live Circuit Voltage Drop Standards:
     - Standard Ground Circuits: Maximum allowable drop < 0.10 Volts.
     - Sensitive Computer / Sensor Grounds: Maximum allowable drop < 0.05 Volts.
     - Starter Motor Main Ground Path: Maximum allowable drop < 0.20 Volts under 200A cranking load.
     - Starter Motor High-Current Positive Cable: Maximum allowable drop < 0.20 Volts.
     - Standard Lighting / Accessory Circuit Wires: Maximum allowable drop < 0.20 to 0.30 Volts.`
    },
    {
      track_id: track1Id,
      title: "Digital Multimeters, Parasitic Drain Testing and Fuse Millivolts",
      order_index: 2,
      content: `### Advanced Automotive Multimeter Metrology

Professional automotive diagnostics mandates high-impedance Digital Multimeters (DMM, CAT III / IV 1000V rated):
- Input Impedance Specification: Minimum 10 Mega-ohms (10 M-ohm) input impedance to prevent the meter from drawing significant current that could damage sensitive ECU microprocessors.
- True-RMS AC Measurement: Essential for detecting AC ripple voltage (> 0.50V AC indicates a blown alternator rectifier diode).

### Parasitic Battery Drain Testing Protocols

Modern vehicles feature 30 to 70+ distributed electronic control units (ECUs). When the ignition is switched off, modules enter low-power sleep modes over 15 to 45 minutes:
- Acceptable Parasitic Draw Threshold: Normal quiescent current draw is strictly less than 30 to 50 milliamperes (0.030 to 0.050 A). Drain exceeding 50 mA will discharge an automotive battery within several days.

### Non-Intrusive Fuse Millivolt Drop Isolation:
- Pulling fuses to isolate drains wakes up sleeping CAN bus gateway modules, invalidating test results.
- Best Practice: Measuring DC millivolts directly across the exposed test contact pins of closed blade fuses without removing them.
- Millivolt-to-Milliamp Conversion: Using standard fuse chart tables based on internal metal blade resistance:
  - Example: A 0.7 mV reading across a standard 10A mini-fuse indicates an active parasitic current of approx 95 mA flowing through that circuit.`
    },
    {
      track_id: track1Id,
      title: "Digital Storage Oscilloscopes, Signal Metrology and Waveforms",
      order_index: 3,
      content: `### Automotive Lab Oscilloscope Metrology

While multimeters display time-averaged numerical values, Digital Storage Oscilloscopes (DSO) capture real-time voltage versus time waveforms at mega-sample rates (MS/s):

1. Oscilloscope Configuration Parameters:
   - Voltage Scale (Volts per division): Sets vertical amplitude.
   - Time Base (Seconds / Milliseconds / Microseconds per division): Sets horizontal time sweep.
   - Triggering Configuration: Edge Trigger (Rising vs Falling), Trigger Level (threshold voltage), and Trigger Mode (Single-Shot for catching intermittent dropouts; Normal; Auto).

2. Automotive Signal Classifications:
   - Direct Current (DC) Steady Signals: Potentiometer throttle position sensors, battery voltage.
   - Pulse Width Modulation (PWM) Signals: High-frequency digital switching (100 Hz to 20 kHz) varying duty cycle (% ON-time vs OFF-time) to modulate cooling fans, fuel pump speeds, and boost control solenoids.
   - Alternating Current (AC) Analog Signals: Variable Reluctance speed sensors (sine waves).
   - Digital Square Waves: Hall Effect and optical position sensors (instantaneous 0V to 5V transitions).

3. Inductive Flyback and Ignition Waveforms:
   - Inductive Kickback: When current to an inductive coil (solenoid or fuel injector) is suddenly switched off, collapsing magnetic fields induce an instantaneous reverse voltage spike (often 60V to 80V on 12V injectors; suppressed by flyback zener diodes).
   - Primary Ignition Waveforms: Dwell charging time, primary breakdown peak, spark burn line (1.2 to 2.0 ms duration), and coil energy dissipation oscillations.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Automotive Sensor Physics: Position, Temperature and Airflow",
      order_index: 1,
      content: `### Physics of Engine Management Sensors

Engine control modules rely on precision sensor inputs to calculate real-time fuel injection mass and ignition timing advance:

1. Crankshaft & Camshaft Position Sensors:
   - Variable Reluctance (VR) Sensors: 2-wire passive analog sensor. A permanent magnet wrapped with a copper coil senses reluctor wheel teeth. Induces an AC sine wave whose voltage amplitude and frequency increase with engine RPM. Cannot detect stationary engine position.
   - Hall Effect Sensors: 3-wire active sensor (5V/12V Power, Ground, Signal). Relies on the Hall effect in a semiconductor crystal. Outputs a constant-amplitude 0V to 5V digital square wave with sharp rise/fall times (< 1 microsecond), accurate down to 0 RPM.

2. Temperature Sensing (NTC Thermistors):
   - Coolant Temperature (ECT) and Intake Air Temperature (IAT) sensors utilize Negative Temperature Coefficient (NTC) ceramic thermistors.
   - As temperature increases, electrical resistance decreases exponentially. The ECM measures the voltage drop across an internal 5.0V pull-up reference resistor voltage divider circuit.

3. Airflow and Pressure Transducers:
   - Mass Air Flow (MAF) Sensors: Hot-wire and hot-film anemometers. A platinum wire element is electrically heated to 200 degrees C above ambient air. Airflow cools the wire; the sensor electronic circuit increases heating current to maintain temperature. The heating current is converted into a calibrated 0V to 5V analog signal or digital frequency (Hz) directly proportional to mass air intake.
   - Manifold Absolute Pressure (MAP) Sensors: Piezoresistive silicon diaphragm sensors measuring intake manifold vacuum and boost pressure.`
    },
    {
      track_id: track2Id,
      title: "Exhaust Gas Chemistry: Narrowband O2 and Wideband Air-Fuel Sensors",
      order_index: 2,
      content: `### Exhaust Gas Oxygen Sensor Electrochemistry

Closed-loop air-fuel ratio control is governed by exhaust gas oxygen sensors:

1. Narrowband Zirconia O2 Sensors (Thimble / Planar):
   - Solid-State Electrolyte: Zirconium dioxide (ZrO2) ceramic element coated with porous platinum electrodes, operating at temperatures > 350 degrees C (660 degrees F).
   - Nernst Concentration Cell: Compares oxygen concentration in exhaust gas against outside atmospheric reference air.
   - Non-Linear Switching Voltage:
     - Rich Mixture (Lambda < 1.0 / AFR < 14.7:1): Low exhaust oxygen creates high voltage (\`0.80V to 0.95V\`).
     - Lean Mixture (Lambda > 1.0 / AFR > 14.7:1): High exhaust oxygen creates low voltage (\`0.10V to 0.20V\`).
     - Switches rapidly across stoichiometric (14.7:1) at 1 to 3 Hz during closed-loop operation.

2. Wideband Universal Exhaust Gas Oxygen (UEGO) Sensors:
   - Dual-Cell Architecture: Combines a Nernst Concentration Cell and an Electrochemical Oxygen Pumping Cell separated by a microscopic diffusion gap.
   - Operating Principle:
     - The ECM continuously supplies bidirectional Pumping Current (\`I_p\`, measured in micro-amperes / uA) to the pump cell to pump oxygen ions into or out of the diffusion gap, maintaining the Nernst cell at exactly 450 mV.
     - In a Rich mixture, positive current pumps oxygen into the gap.
     - In a Lean mixture, negative current pumps oxygen out of the gap.
     - The magnitude and direction of pumping current (\`I_p\`) is linearly proportional to exact Lambda across the entire operating range from 0.70 (very rich) to 2.0+ (pure air), enabling precise closed-loop fueling under boost and deceleration.`
    },
    {
      track_id: track2Id,
      title: "Actuator Electronics: Solenoids, H-Bridges and Coil-on-Plug",
      order_index: 3,
      content: `### Actuator Control and Electronic Drivers

ECU microprocessors control high-current actuators through solid-state semiconductor switches:

1. High-Side vs Low-Side Drivers:
   - Low-Side Switching (Industry Standard): The actuator is supplied with continuous 12V battery power; the ECM pulses the ground circuit via an internal N-channel MOSFET transistor, minimizing short-to-ground risks.
   - High-Side Switching: The ECM switches the 12V power supply while the actuator is permanently grounded to the chassis.

2. Electronic Throttle Control (ETC / Drive-by-Wire):
   - H-Bridge Driver Circuit: Four interconnected MOSFET transistors arranged in an H-configuration, permitting instantaneous polarity reversal to drive the DC throttle motor forward and backward.
   - Dual Redundant TPS Sensors: Dual potentiometers (TPS 1 ascending from 0.5V to 4.5V; TPS 2 descending from 4.5V to 0.5V). If the sum of TPS 1 and TPS 2 deviates from 5.0V by more than 0.2V, the ECM triggers limp-home mode.

3. Coil-on-Plug (COP) Ignition Systems:
   - High-energy step-up transformers mounted directly over spark plugs.
   - Primary Current Saturation: ECM grounds the primary coil for 2.5 to 3.5 ms (dwell time), charging the primary winding to 6 to 10 Amps.
   - High-Voltage Induction: When the ground circuit opens, the rapid magnetic field collapse induces a 30,000 to 45,000 Volt (30 to 45 kV) secondary voltage spike that ionizes the spark plug air gap, initiating combustion.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Controller Area Networks (CAN Bus), LIN and FlexRay Architecture",
      order_index: 1,
      content: `### In-Vehicle Multiplex Communication Protocols

Modern vehicles eliminate hundreds of pounds of dedicated wiring through serial multiplex data buses:

1. Controller Area Network (ISO 11898 CAN 2.0B / CAN-FD):
   - Differential Signal Architecture: Utilizes a twisted pair of copper wires designated CAN-High (CAN-H) and CAN-Low (CAN-L) to cancel electromagnetic interference (EMI).
   - Recessive State (Logical 1 / Idle):
     - Both CAN-H and CAN-L idle at exactly 2.50 Volts.
     - Differential Voltage (\`V_diff = CAN_H - CAN_L\`) is \`0.0 Volts\`.
   - Dominant State (Logical 0 / Active Driving):
     - CAN-H is driven up to 3.50 Volts.
     - CAN-L is driven down to 1.50 Volts.
     - Differential Voltage (\`V_diff\`) is \`2.00 Volts\` (3.50V - 1.50V = 2.00V).
   - Bus Termination: Two 120-ohm terminating resistors connected in parallel across CAN-H and CAN-L at the extreme physical ends of the bus network. Total measured network resistance with battery disconnected is exactly \`60.0 ohms\`.
   - Non-Destructive Bitwise Arbitration: Lower numerical 11-bit or 29-bit Message Identifier (e.g. 0x001 vs 0x100) has priority on the bus. Dominant zeros overwrite recessive ones, ensuring critical ABS and airbag messages broadcast instantly without packet collision.

2. Local Interconnect Network (LIN Bus):
   - Single-wire sub-bus operating at 12V UART (19.2 kbps) for non-safety accessories (door mirrors, wiper motors, window switches). Master-slave polling eliminates bus collisions.

3. Automotive Ethernet (100BASE-T1 / 1000BASE-T1):
   - High-bandwidth unshielded twisted pair (100 Mbps to 1 Gbps) used for ADAS cameras, LiDAR, and infotainment gateways.`
    },
    {
      track_id: track3Id,
      title: "CAN Bus Physical Layer Fault Diagnostics and Waveform Decoding",
      order_index: 2,
      content: `### Forensic Network Troubleshooting and Physical Layer Faults

When communication collapses across a vehicle multiplex network, technicians analyze the physical layer using DMM resistance checks and dual-channel oscilloscopes:

1. Diagnostic Multimeter Resistance Checks (Battery Disconnected):
   - Normal Bus Resistance (CAN-H to CAN-L): 60.0 ohms.
   - Open Terminating Resistor: Resistance reads 120.0 ohms (indicates an open circuit in one terminating module or severed trunk harness).
   - Shorted Bus (CAN-H to CAN-L): Resistance reads 0.0 ohms.

2. Dual-Channel Oscilloscope Physical Fault Waveforms:
   - CAN-High Shorted to Ground: CAN-H trace is pinned at 0.0V; transceivers cannot create dominant state.
   - CAN-Low Shorted to 12V Battery: CAN-L trace is pinned at 12V to 14V; communications crash.
   - CAN-High Shorted to CAN-Low: Both traces overlap identically at 2.5V; differential voltage is 0.0V, halting communication.
   - Open in CAN-H or CAN-L Line: Split single-ended waveforms with severe reflection ringing artifacts.

3. Network Diagnostic Trouble Codes (U-Codes):
   - U0100: Lost Communication with Engine Control Module (ECM).
   - U0101: Lost Communication with Transmission Control Module (TCM).
   - U0121: Lost Communication with Anti-Lock Brake System (ABS) Module.
   - Gateway Module Architecture: Central gateway routes data between High-Speed CAN (500 kbps), Medium-Speed CAN (250 kbps), LIN, and Ethernet networks.`
    },
    {
      track_id: track3Id,
      title: "Battery Chemistries, Smart Alternators and Cranking Diagnostics",
      order_index: 3,
      content: `### 12V / 48V Energy Storage and Charging Systems

1. Automotive Battery Chemistries:
   - Flooded Lead-Acid: Standard flooded antimony/calcium lead plates.
   - Absorbent Glass Mat (AGM): Electrolyte absorbed in micro-fiberglass mat separators; mandatory for Start-Stop vehicles due to high deep-cycle durability and lower internal resistance.
   - Battery Conductance Testing (Electronic Testing): Imposes high-frequency AC micro-signals to calculate plate surface area and internal impedance, reporting Cold Cranking Amps (CCA) and State of Health (SoH) without discharging the battery.
   - Carbon Pile Load Testing: Applies a discharge load equal to 50% of the battery CCA rating for 15 seconds; terminal voltage must remain >= 9.60 Volts at 70 degrees F (21 degrees C).

2. LIN-Controlled Smart Alternator Systems:
   - Modern alternators do not maintain a static 14.2V output.
   - The ECM communicates with the internal alternator voltage regulator via LIN bus, varying charging voltage dynamically from 12.2V to 15.2V based on battery temperature, state of charge (SoC), and current load. During deceleration, the ECM elevates voltage to 15.0V to capture kinetic energy; during heavy acceleration, charging voltage drops to 12.5V to reduce engine horsepower drag.

3. Starter Motor Cranking Waveform Diagnostics:
   - Using a 500A / 1000A inductive current clamp on an oscilloscope:
     - In-Rush Current Spike: Initial surge (400 to 700 Amps) required to overcome stationary engine inertia.
     - Steady Cranking Current: Consistent sine-wave current pulses (120 to 180 Amps) corresponding to each cylinder's compression stroke. A single low current hump identifies a mechanical cylinder compression loss without removing spark plugs.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #15.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "What is the normal, acceptable quiescent parasitic battery drain threshold on a modern vehicle after all electronic control modules have entered sleep mode?",
      options: [
        "5.0 to 10.0 Amperes",
        "500 to 800 milliamperes",
        "Less than 30 to 50 milliamperes (0.030 to 0.050 A)",
        "Zero milliamperes (absolute zero)"
      ],
      correct_option_index: 2,
      explanation: "Acceptable parasitic current drain on modern vehicles is strictly under 30 to 50 mA (0.030 to 0.050 A). Draws exceeding 50 mA cause dead batteries within days.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What type of engine position sensor is a 3-wire active sensor that produces a constant-amplitude 0V to 5V digital square wave with sharp rise times even at zero RPM?",
      options: [
        "Hall Effect Sensor",
        "Variable Reluctance (VR) Magnetic Sensor",
        "Negative Temperature Coefficient Thermistor",
        "Zirconia Oxygen Sensor"
      ],
      correct_option_index: 0,
      explanation: "Hall Effect sensors utilize an active 3-wire circuit (power, ground, signal) to generate clean digital square waves at any rotational speed down to zero RPM.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In a healthy High-Speed CAN Bus network (ISO 11898), what is the total measured resistance between CAN-High and CAN-Low across the two 120-ohm terminating resistors with the battery disconnected?",
      options: [
        "120.0 ohms",
        "240.0 ohms",
        "0.0 ohms",
        "60.0 ohms (two 120-ohm resistors in parallel: 120 / 2 = 60.0 ohms)"
      ],
      correct_option_index: 3,
      explanation: "Two 120-ohm terminating resistors wired in parallel at opposite ends of the bus produce a total parallel circuit resistance of exactly 60.0 ohms.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What is the maximum allowable voltage drop recommended across a standard automotive ground circuit under full electrical load?",
      options: [
        "2.0 Volts",
        "Less than 0.10 Volts (100 millivolts)",
        "5.0 Volts",
        "12.6 Volts"
      ],
      correct_option_index: 1,
      explanation: "Standard ground circuit voltage drop should be under 0.10V (100 mV); computer sensor grounds should drop less than 0.05V.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What electrical relationship occurs in a Negative Temperature Coefficient (NTC) thermistor (such as an Engine Coolant Temperature sensor) as temperature increases?",
      options: [
        "Electrical resistance increases to infinity",
        "Voltage output locks permanently at 12V",
        "Electrical resistance decreases exponentially",
        "The sensor emits radio frequency signals"
      ],
      correct_option_index: 2,
      explanation: "In an NTC thermistor, electrical resistance decreases as temperature rises, causing a corresponding drop in measured signal voltage across the circuit.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "Why is live circuit Voltage Drop testing vastly superior to static resistance testing with an ohmmeter when diagnosing high-current automotive circuits?",
      options: [
        "Ohmmeters damage vehicle batteries",
        "An ohmmeter sends only micro-amps through the wire; a high-current cable with 95% of its copper strands broken will measure near zero ohms on an ohmmeter, but will suffer severe voltage drop and fail completely when carrying a real 20A operating load",
        "Voltage drop testing requires zero electrical tools",
        "Ohmmeters cannot measure copper wire"
      ],
      correct_option_index: 1,
      explanation: "Ohmmeters pass minuscule test currents that cannot reveal high resistance in corroded or broken strands under real operating loads; live voltage drop testing reveals true circuit bottlenecks.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "On a High-Speed CAN Bus (CAN 2.0B), what are the nominal voltages on CAN-High and CAN-Low during the active DOMINANT state (Logical 0)?",
      options: [
        "CAN-H = 2.50V; CAN-L = 2.50V (Differential = 0.0V)",
        "CAN-H = 12.0V; CAN-L = 0.0V (Differential = 12.0V)",
        "CAN-H = 5.00V; CAN-L = 5.00V (Differential = 0.0V)",
        "CAN-H = 3.50V; CAN-L = 1.50V (Differential = 2.00V)"
      ],
      correct_option_index: 3,
      explanation: "In dominant state, CAN-H rises to 3.50V and CAN-L drops to 1.50V, creating a 2.00V differential. In recessive state, both idle at 2.50V (0.0V differential).",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In Wideband Universal Exhaust Gas Oxygen (UEGO) sensors, what parameter does the engine control module measure to calculate exact air-fuel ratio (Lambda) from 0.70 rich to pure air?",
      options: [
        "The bidirectional Pumping Current (I_p) supplied to the oxygen pump cell to maintain the Nernst cell at exactly 450 mV",
        "The resistance of the spark plug wire",
        "The AC ripple voltage from the alternator",
        "The temperature of the intake manifold"
      ],
      correct_option_index: 0,
      explanation: "The ECM supplies pumping current (I_p) to transfer oxygen ions into or out of the diffusion gap, keeping the Nernst cell at 450 mV. The pumping current is linearly proportional to Lambda.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "When conducting a carbon pile load test on a 12V automotive battery rated at 600 Cold Cranking Amps (CCA), what test current must be applied for 15 seconds, and what is the minimum acceptable terminal voltage at 70 degrees F (21 degrees C)?",
      options: [
        "Apply 600A load; minimum voltage 12.6V",
        "Apply 100A load; minimum voltage 8.0V",
        "Apply 300A load (50% of CCA rating); minimum voltage must remain >= 9.60 Volts",
        "Apply 50A load; minimum voltage 10.5V"
      ],
      correct_option_index: 2,
      explanation: "Carbon pile testing applies half the CCA rating (300A for 600 CCA) for 15 seconds; terminal voltage must stay at or above 9.60V at 70 deg F.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In Electronic Throttle Control (ETC) systems, what dual sensor redundancy strategy is implemented to prevent unintended acceleration?",
      options: [
        "Two identical MAF sensors installed in the exhaust pipe",
        "Dual Throttle Position Sensors (TPS 1 ascending from 0.5V to 4.5V; TPS 2 descending from 4.5V to 0.5V) whose sum must always equal 5.0V (+/- 0.2V)",
        "A mechanical steel cable running to the driver seat",
        "An emergency parachute deployed from the rear bumper"
      ],
      correct_option_index: 1,
      explanation: "Dual inverse TPS sensors provide continuous cross-checking: TPS 1 rises while TPS 2 falls, constantly summing to 5.0V; any divergence triggers limp-home mode.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "A technician disconnects the battery on a vehicle and measures resistance between Pin 6 (CAN-High) and Pin 14 (CAN-Low) at the DLC OBD-II port. The multimeter reads exactly 120.0 ohms. What is the precise diagnostic conclusion?",
      options: [
        "The CAN bus network is 100% normal and healthy",
        "CAN-High is shorted directly to chassis ground",
        "Both terminating resistors have melted into a short circuit",
        "One of the two 120-ohm terminating resistors is open-circuited (or there is an open in the bus harness isolating one end module)"
      ],
      correct_option_index: 3,
      explanation: "With one 120-ohm resistor disconnected or open, total bus resistance measures 120 ohms instead of the normal parallel 60 ohms (120 || 120 = 60).",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "How does CAN bus Non-Destructive Bitwise Arbitration resolve simultaneous message collisions without corrupting data or requiring packet retransmissions?",
      options: [
        "Dominant bits (Logical 0) overwrite Recessive bits (Logical 1) on the physical bus; the transmitter with the lowest numerical Message ID continues transmitting uninterrupted while higher ID nodes step down to listen",
        "The module with the highest battery voltage overrides all other modules",
        "All colliding messages are immediately deleted by the gateway",
        "Modules take turns based on alphabetical manufacturer names"
      ],
      correct_option_index: 0,
      explanation: "In CAN arbitration, dominant zeros override recessive ones. A module transmitting a 1 that sees a 0 on the bus realizes a higher-priority (lower numeric ID) message is broadcasting and yields.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "An oscilloscope is connected to an inductive fuel injector circuit. When the ECM low-side driver transistor suddenly opens the ground circuit, what physical phenomenon produces the instantaneous 60V to 80V voltage spike observed on the waveform?",
      options: [
        "Alternator over-charging surge",
        "Battery chemical thermal runaway",
        "Inductive Flyback / Counter-Electromotive Force (CEMF) generated by the rapid collapse of the magnetic field across the coil windings",
        "A short circuit to the starter motor"
      ],
      correct_option_index: 2,
      explanation: "Collapsing magnetic fields in inductive coils induce a high reverse CEMF voltage spike (flyback voltage) proportional to the rate of current change (V = -L * di/dt).",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "How does a LIN-bus controlled Smart Alternator Charging System reduce engine parasitic drag and fuel consumption during vehicle acceleration?",
      options: [
        "By disconnecting the alternator belt with a mechanical clutch",
        "The ECM sends digital LIN commands to the voltage regulator lowering charging voltage to approx 12.5V during heavy acceleration, and elevating voltage to 15.0V during deceleration to harvest kinetic energy",
        "By shutting off the vehicle headlights automatically",
        "By reversing the rotation of the engine crankshaft"
      ],
      correct_option_index: 1,
      explanation: "Smart charging systems lower alternator load during acceleration (dropping voltage to battery float level ~12.5V) and increase output during braking (15.0V) for regenerative energy recovery.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "When performing relative compression testing using a high-current oscilloscope clamp on the battery main starter cable during engine cranking, what does a waveform displaying five uniform 150A current humps and one sunken 40A current hump indicate?",
      options: [
        "A 6-cylinder engine with one cylinder suffering severe mechanical compression loss",
        "A defective starter motor pinion gear",
        "A dead battery cell",
        "A blown alternator rectifier diode"
      ],
      correct_option_index: 0,
      explanation: "Each current peak represents the starter motor working against a cylinder's compression stroke. A single low hump in a 6-cylinder engine identifies one cylinder with lost compression.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #15.");
  console.log("Skill #15 update completed successfully!");
}

run();
