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

const skillId = "5fb1b872-9638-4c32-b371-44927d3ac407";

async function run() {
  console.log("Updating Skill #18: Diagnostic Scan Tools (9 steps across 3 tracks)...");

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
        title: `Track ${tracks.length + 1}: Diagnostic Systems`,
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
  await supabase.from("tracks").update({ title: "Track 1: OBD-II Protocols, DTC Anatomy and Freeze Frame Forensics" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Live PID Analysis, Fuel Trim Chemistry and Mode $06 Data" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Bi-Directional Controls, Topology Mapping and J2534 Flashing" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "OBD-II Architecture, DLC Pinouts and DTC Anatomy (SAE J2012)",
      order_index: 1,
      content: `### Architecture of Standardized Vehicle Diagnostics

On-Board Diagnostics II (OBD-II / EOBD) standardizes vehicle emissions and electronic systems communication:

1. The 16-Pin Data Link Connector (DLC / SAE J1962):
   - Standardized physical interface located within 2 feet of the steering wheel:
     - Pin 4: Chassis Ground.
     - Pin 5: Signal Ground.
     - Pin 6: CAN-High (ISO 11898 differential communication).
     - Pin 14: CAN-Low.
     - Pin 16: Constant 12V Battery Power.
     - Pin 7: ISO 9141-2 / ISO 14230-4 K-Line (legacy).

2. Anatomy of a Diagnostic Trouble Code (SAE J2012 5-Digit Standard):
   - 1st Digit (System Domain):
     - P: Powertrain (Engine, Transmission, Emissions).
     - B: Body (Climate control, Airbags, Central locking).
     - C: Chassis (Anti-Lock Brakes, Steering, Suspension).
     - U: Network (CAN bus communication, Gateway modules).
   - 2nd Digit (Code Type):
     - 0: Standardized SAE generic code (legally mandatory definitions).
     - 1: Manufacturer-specific enhanced code.
   - 3rd Digit (Powertrain Subsystem):
     - 1: Fuel and Air Metering.
     - 2: Fuel and Air Injector Circuit.
     - 3: Ignition System or Engine Misfire.
     - 4: Auxiliary Emission Controls (EVAP, Catalytic Converter, Secondary Air).
     - 5: Vehicle Speed Control and Idle System.
     - 6: Computer Output Circuits.
     - 7 / 8 / 9: Transmission Controls.
   - 4th & 5th Digits: Specific component fault designation.

3. DTC Status Classifications:
   - Pending DTC: Fault detected during the current drive cycle; does not illuminate the Check Engine Light (MIL).
   - Confirmed DTC: Fault confirmed over two consecutive drive cycles, illuminating the MIL.
   - Permanent DTC: Stored in non-volatile memory; cannot be erased with a scan tool and clears only after the vehicle completes internal monitors successfully.`
    },
    {
      track_id: track1Id,
      title: "SAE J1979 Diagnostic Service Modes ($01 through $0A)",
      order_index: 2,
      content: `### The Ten Standardized OBD-II Diagnostic Service Modes

SAE J1979 defines ten standardized hexadecimal service modes accessible by all compliant diagnostic scan tools:

1. Mode $01: Request Current Powertrain Diagnostic Data:
   - Displays real-time live sensor Parameter Identifications (PIDs) including engine RPM, coolant temperature, vehicle speed, and fuel trims.

2. Mode $02: Request Freeze Frame Data:
   - Retrieves a complete snapshot of all operating PIDs captured at the exact microsecond an emissions fault was detected and stored.

3. Mode $03: Request Emission-Related Confirmed Diagnostic Trouble Codes:
   - Reads stored confirmed trouble codes that have illuminated the Malfunction Indicator Lamp (MIL).

4. Mode $04: Clear / Reset Emission-Related Diagnostic Information:
   - Erases confirmed DTCs, pending DTCs, freeze frame records, and resets all readiness monitors to 'Not Ready'.

5. Mode $06: Request On-Board Monitoring Test Results for Specific Monitored Systems:
   - Displays raw test data, minimum thresholds, and maximum thresholds for non-continuous monitors (catalytic converter efficiency, EVAP leak decay, VVT phasers, oxygen sensor heaters).

6. Mode $07: Request Pending Trouble Codes:
   - Reads faults detected during the current or last completed driving cycle before two-trip MIL illumination.

7. Mode $08: Request Control of On-Board Systems / Bi-Directional Tests:
   - Commands service bay component tests (e.g. commanding EVAP canister vent solenoids closed for smoke testing).

8. Mode $09: Request Vehicle Information:
   - Reads Vehicle Identification Number (VIN), ECU Calibration Identifiers (Cal ID), and Calibration Verification Numbers (CVN).

9. Mode $0A: Request Permanent Diagnostic Trouble Codes:
   - Displays permanent emissions DTCs that survive power disconnections.`
    },
    {
      track_id: track1Id,
      title: "Freeze Frame Forensics and Drive Cycle Readiness Monitors",
      order_index: 3,
      content: `### Forensic Data Analysis and Inspection Readiness

1. Freeze Frame Data Forensic Recreation:
   - When a fault code triggers, the engine control module locks a complete snapshot of all sensor parameters at that exact moment:
     - Example Forensic Scenario: P0300 Random Misfire stored:
       - Engine Coolant Temp: 195 deg F (Engine fully warmed up).
       - Engine RPM: 2,450 RPM.
       - Vehicle Speed: 62 MPH.
       - Calculated Engine Load: 78% (Under heavy acceleration / uphill load).
       - Fuel Pressure: 28 PSI (Significantly below normal 58 PSI specification).
       - Diagnostic Conclusion: Misfire is caused by fuel starvation under load, not cold-start ignition breakdown.

2. EPA I/M Readiness Monitors:
   - Continuous Monitors (Run continuously during all driving):
     - Comprehensive Component Monitor (CCM).
     - Engine Misfire Monitor.
     - Fuel System Fuel Trim Monitor.
   - Non-Continuous Monitors (Require precise drive cycle criteria):
     - Catalytic Converter Efficiency Monitor.
     - Evaporative Emission (EVAP) Monitor (requires fuel tank level between 15% and 85%, cold engine soak overnight, and specific cruising speeds).
     - Oxygen / Air-Fuel Sensor Monitor and Sensor Heater Monitor.
     - Exhaust Gas Recirculation (EGR) and Variable Valve Timing (VVT) Monitors.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Live PID Data Stream Analysis, Graphing and Custom Parameter Lists",
      order_index: 1,
      content: `### High-Speed Live Parameter (PID) Diagnostics

Modern electronic control modules broadcast hundreds of live data parameters across serial data links:

1. Scan Tool Baud Rate and Data Refresh Optimization:
   - When a scan tool requests 50 PIDs simultaneously, the serial bus refresh rate slows to 1 to 2 frames per second (Hz), causing technicians to miss rapid, intermittent signal dropouts.
   - Best Practice: Create custom, focused PID lists selecting only 3 to 5 relevant parameters (e.g. Throttle Position, Engine RPM, Mass Air Flow, Front O2 Sensor), increasing data stream sample rates to 30+ frames per second (30 Hz) for high-resolution waveform graphing.

2. Critical Baseline PID Parameters:
   - Calculated Engine Load (%): Measures actual air consumption relative to theoretical maximum volumetric efficiency. A healthy naturally aspirated engine should read 18% to 25% at idle in Park, and reach 90% to 100% at wide-open throttle (WOT) near peak torque RPM. An engine reading only 60% load at WOT indicates a dirty/degraded MAF sensor or restricted exhaust.
   - Absolute Throttle Position (TPS %): Smooth linear sweep from 10% to 15% at idle up to 85% to 92% at full throttle without dropouts.
   - High-Pressure Fuel Rail Pressure: Monitored on Gasoline Direct Injection (GDI) engines (500 PSI at idle, ramping to 2,000 to 3,000+ PSI under wide-open throttle).`
    },
    {
      track_id: track2Id,
      title: "Fuel Trim Chemistry: Short-Term (STFT) and Long-Term (LTFT) Diagnostics",
      order_index: 2,
      content: `### Fuel Trim Chemistry and Adaptive Engine Diagnostics

Fuel trims represent the percentage correction applied by the engine control module to maintain stoichiometric combustion (14.7:1 air-fuel ratio / Lambda = 1.00):

1. Fuel Trim Architecture:
   - Short-Term Fuel Trim (STFT): Real-time instantaneous feedback correction responding to front oxygen/wideband sensor voltage (switches dynamically between -5% and +5%).
   - Long-Term Fuel Trim (LTFT): Learned adaptive fuel table correction stored in non-volatile memory across RPM and Engine Load grid cells.
   - Total Fuel Trim Formula:
\`\`\`
Total Fuel Trim = Short-Term Fuel Trim (STFT) + Long-Term Fuel Trim (LTFT)
\`\`\`

2. Diagnostic Diagnostic Code Thresholds:
   - Normal Baseline: Total fuel trim within +/- 5% to 8%.
   - System Too Lean (P0171 / P0174 Bank 1/2): Total fuel trim exceeds +20% to +25%. The ECM is adding extra fuel to compensate for unmetered air or inadequate fuel delivery.
   - System Too Rich (P0172 / P0175 Bank 1/2): Total fuel trim drops below -20% to -25%. The ECM is subtracting fuel due to leaking injectors or EVAP purge vapor flooding.

3. Differentiating Vacuum Leaks vs Fuel Starvation:
   - Intake Vacuum Leak: Shows high positive fuel trim (+25%) at idle when manifold vacuum is high. As RPM increases to 2,500 RPM, unmetered air becomes negligible compared to total airflow, and fuel trim drops back to normal (+2% to +5%).
   - Weak Fuel Pump / Dirty MAF Sensor: Shows normal fuel trim (+3%) at idle, but climbs to severe positive fuel trim (+25%) at 2,500 RPM under load due to fuel delivery starvation.`
    },
    {
      track_id: track2Id,
      title: "Mode $06 Advanced Component Testing: Test IDs and Misfire Tables",
      order_index: 3,
      content: `### Advanced Diagnostics with On-Board Mode $06 Data

Mode $06 provides access to internal non-continuous monitor test results before a fault is severe enough to illuminate the Check Engine Light:

1. Mode $06 Data Structure:
   - Test ID (TID) / Monitor ID (MID) and Component ID (CID): Identifies the specific sensor or component test.
   - Minimum Test Threshold (Min Limit): Lowest passing value.
   - Maximum Test Threshold (Max Limit): Highest passing value.
   - Actual Test Value: The real measured test result calculated by the ECM during the last driving cycle.
   - Status: Pass or Fail.

2. Diagnostic Applications of Mode $06:
   - Identifying Intermittent Misfires:
     - Accessing Mode $06 Cylinder Misfire Counters (e.g. Misfire Cylinder 1 through Cylinder 8 over the current and last 10 driving cycles). Pinpoints a cylinder recording 45 misfires (which is below the 80-misfire threshold required to set a P0301 DTC), isolating weak ignition coils before complete failure.
   - Catalytic Converter Degradation (MID $21):
     - Shows oxygen storage capacity test ratios. A catalyst reading 0.75 against a maximum threshold of 0.80 is passing, but reveals the converter is 90% degraded and nearing imminent failure.
   - EVAP Small Leak Decay Rates (0.020-inch and 0.040-inch vacuum decay rates).`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Bi-Directional Functional Testing and Electronic Calibrations",
      order_index: 1,
      content: `### Active Actuator Testing and Electronic Calibrations

Professional scan tools provide bi-directional control, allowing technicians to manually command vehicle actuators:

1. Bi-Directional Functional Tests:
   - Fuel Injector Balance Test: The scan tool commands the fuel pump on, then pulses each fuel injector for an exact duration (e.g. 50 ms). The technician records the precise pressure drop on a mechanical fuel pressure gauge for each cylinder (e.g. 15 PSI drop). An injector dropping only 8 PSI is clogged; an injector dropping 22 PSI is leaking.
   - Automated Cylinder Power Balance Test: Software cancels fuel injection to individual cylinders sequentially, measuring the resulting engine RPM drop to pinpoint weak cylinders.
   - EVAP System Service Bay Tests: Manually energizing the EVAP canister vent solenoid closed while introducing 0.5 PSI smoke to detect plumbing leaks.
   - Variable Valve Timing (VVT) Cam Phasing Active Test: Forcing cam phasers to advance 30 degrees at idle to confirm smooth hydraulic operation and engine stalling.

2. Electronic Relearn and Calibration Procedures:
   - Electronic Throttle Body (ETB) Idle Air Volume Relearn.
   - Steering Angle Sensor (SAS) Zero-Point Calibration (after wheel alignment).
   - Occupant Classification System (OCS) Airbag Weight Zero-Point Calibration.
   - Diesel Particulate Filter (DPF) Forced Service Regeneration.`
    },
    {
      track_id: track3Id,
      title: "Network Topology Mapping, Security Gateways and DoIP (ISO 13400)",
      order_index: 2,
      content: `### Vehicle Network Topology and Security Gateway Architecture

1. Full-Vehicle Network Topology Mapping:
   - Scan tools perform automated high-speed network interrogation across all internal data buses (High-Speed CAN, LIN, MOST, Ethernet):
     - Displays color-coded system topology maps:
       - Green: Module communicating with zero stored DTCs.
       - Yellow: Module communicating with active/stored DTCs.
       - Red: Module unresponsive / Bus Offline / No Communication.

2. Security Gateway Modules (SGW / FCA AutoAuth / Nissan SGW):
   - Modern vehicle architectures incorporate cybersecurity firewalls that block unauthorized scan tools from writing data, clearing DTCs, performing bi-directional active tests, or coding modules through the OBD-II port.
   - Technicians must use certified scan tools connected to OEM cloud authentication servers (e.g. AutoAuth) to unlock cryptographic gateway access.

3. Diagnostics over Internet Protocol (DoIP / ISO 13400):
   - High-bandwidth 100BASE-TX / 1000BASE-T1 Ethernet diagnostic links replacing traditional CAN bus for flash reprogramming, allowing multi-gigabyte ADAS radar, camera, and infotainment firmware updates in minutes instead of hours.`
    },
    {
      track_id: track3Id,
      title: "SAE J2534 Pass-Thru Reprogramming, Clean Power and Module Coding",
      order_index: 3,
      content: `### SAE J2534 Pass-Thru ECU Reprogramming Standards

SAE J2534 (and ISO 22900) establishes a standardized hardware interface enabling aftermarket technicians to re-flash vehicle electronic control units using OEM calibration software:

1. Clean Power Supply Management (Battery Support Units - BSU):
   - During ECU flash programming, vehicle cooling fans may run at maximum speed and multiple modules stay fully awake, drawing 30 to 70 Amps of current.
   - Mandatory Equipment: A regulated, ripple-free Battery Support Power Supply (BSU) supplying continuous clean 13.5V to 14.0V DC (never use a standard battery charger, which produces dirty AC ripple voltage).
   - Critical Warning: If battery voltage drops below 12.0V during a flash reprogramming sequence, the communication packet fails, permanently corrupting the ECU internal flash EEPROM memory and rendering the module permanently inoperable (bricked).

2. Module Replacement and Configuration:
   - Programmable Module Installation (PMI): Uploading original module configuration parameters and transferring them to a new replacement module.
   - VIN Writing: Programmatically burning the vehicle's unique VIN into new replacement control modules.
   - Immobilizer (Anti-Theft) Key Registration and Module Security Handshake pairing.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #18.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "On a standard 16-pin OBD-II Data Link Connector (DLC / SAE J1962), which pins are standardly assigned to High-Speed CAN-High and CAN-Low communication?",
      options: [
        "Pin 1 (CAN-H) and Pin 2 (CAN-L)",
        "Pin 4 (CAN-H) and Pin 5 (CAN-L)",
        "Pin 6 (CAN-High) and Pin 14 (CAN-Low)",
        "Pin 16 (CAN-H) and Pin 8 (CAN-L)"
      ],
      correct_option_index: 2,
      explanation: "On the SAE J1962 16-pin DLC, Pin 6 is dedicated to CAN-High and Pin 14 is dedicated to CAN-Low.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "Which SAE J1979 diagnostic service mode provides access to Freeze Frame data, capturing a complete snapshot of all operating sensor parameters at the exact moment an emissions fault occurred?",
      options: [
        "Mode $02 (Request Freeze Frame Data)",
        "Mode $01 (Live Current Data)",
        "Mode $04 (Clear DTCs)",
        "Mode $09 (Vehicle Info)"
      ],
      correct_option_index: 0,
      explanation: "Mode $02 provides the freeze frame data snapshot recorded by the ECM when an emissions diagnostic trouble code is triggered.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In standard OBD-II 5-digit diagnostic trouble code anatomy (e.g. P0301), what system domain is designated by the letter 'P' as the first character?",
      options: [
        "Body Control Systems",
        "Chassis and Anti-Lock Brakes",
        "Network CAN Communication",
        "Powertrain (Engine, Transmission, Emissions)"
      ],
      correct_option_index: 3,
      explanation: "In SAE J2012 DTC codes, 'P' designates Powertrain, 'B' designates Body, 'C' designates Chassis, and 'U' designates Network communication.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What mathematical formula represents Total Fuel Trim on a diagnostic scan tool?",
      options: [
        "Total Fuel Trim = STFT divided by LTFT",
        "Total Fuel Trim = Short-Term Fuel Trim (STFT) + Long-Term Fuel Trim (LTFT)",
        "Total Fuel Trim = Engine RPM * 14.7",
        "Total Fuel Trim = Oxygen Sensor Voltage squared"
      ],
      correct_option_index: 1,
      explanation: "Total Fuel Trim is the sum of Short-Term Fuel Trim (STFT) and Long-Term Fuel Trim (LTFT), representing total fueling correction relative to stoichiometric 14.7:1.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What type of power equipment must be connected to a vehicle's 12V battery during SAE J2534 ECU flash reprogramming to supply continuous clean 13.5V to 14.0V power and prevent module destruction (bricking)?",
      options: [
        "A 500-watt solar panel",
        "A standard dirty automotive battery charger producing AC ripple",
        "A regulated, ripple-free Battery Support Power Supply Unit (BSU) capable of delivering 70 to 100 Amps",
        "Zero external power equipment is needed"
      ],
      correct_option_index: 2,
      explanation: "A regulated Battery Support Unit (BSU) maintaining clean, ripple-free 13.5-14.0V is mandatory to prevent voltage dips that corrupt ECU flash memory during reprogramming.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "How does an automotive technician distinguish an Intake Manifold Vacuum Leak from a Weak Fuel Pump using live fuel trim data at idle versus 2,500 RPM?",
      options: [
        "Vacuum leaks only occur on diesel engines",
        "A vacuum leak causes high positive fuel trim (+25%) at idle that drops back toward normal (+3%) at 2,500 RPM, whereas a weak fuel pump or dirty MAF shows normal trim at idle that becomes excessively positive (+25%) under 2,500 RPM load",
        "Fuel pumps never affect fuel trim",
        "Both faults display identical fuel trim data across all RPMs"
      ],
      correct_option_index: 1,
      explanation: "At idle, vacuum leaks allow significant unmetered air (+25% trim); at 2,500 RPM, leak volume is negligible. Weak fuel pumps deliver adequate fuel at idle but starve under load.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "Why is SAE J1979 Mode $06 diagnostic data invaluable when diagnosing intermittent engine misfires before a Check Engine Light illuminates?",
      options: [
        "Mode $06 automatically replaces spark plugs",
        "Mode $06 measures tire tread depth",
        "Mode $06 only works when the engine is turned off",
        "Mode $06 provides raw test counts and thresholds for non-continuous monitors, allowing technicians to view specific Cylinder Misfire Counters over past driving cycles before the 80-misfire MIL threshold is reached"
      ],
      correct_option_index: 3,
      explanation: "Mode $06 displays raw monitor test counts and limits, enabling technicians to identify which cylinder is accumulating misfires before a permanent DTC is set.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "Why should a technician customize and reduce their live scan tool PID data list to only 3 to 5 parameters when graphing intermittent sensor dropouts?",
      options: [
        "Fewer PIDs significantly increase the scan tool communication refresh frame rate (from 2 Hz up to 30+ Hz), capturing high-speed microsecond dropouts that would otherwise be missed",
        "Scan tools overheat if more than 5 PIDs are displayed",
        "Vehicle engines will stall if too many PIDs are requested",
        "OBD-II regulations prohibit viewing more than 5 parameters"
      ],
      correct_option_index: 0,
      explanation: "Requesting fewer PIDs reduces serial bus bandwidth load, boosting the refresh frame rate to 30+ frames/sec to capture rapid, transient signal glitches.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What bi-directional active test is performed using a scan tool and fuel pressure gauge to identify individual clogged or leaking fuel injectors without removing them from the engine?",
      options: [
        "Compression Test",
        "Exhaust Backpressure Test",
        "Fuel Injector Balance Test (commanding the scan tool to pulse each injector individually and comparing the resulting fuel rail pressure drop across all cylinders)",
        "Alternator Ripple Test"
      ],
      correct_option_index: 2,
      explanation: "The Fuel Injector Balance Test pulses each injector for a fixed duration and measures the resulting pressure drop; a lower drop indicates a clogged injector.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What is the purpose of Security Gateway Modules (SGW / FCA AutoAuth) integrated into modern vehicle electrical architectures?",
      options: [
        "To prevent vehicle wheels from spinning in rain",
        "To act as a cybersecurity firewall that blocks unauthorized third-party scan tools from writing data, clearing DTCs, or sending bi-directional commands via the OBD-II port without cryptographic authentication",
        "To regulate fuel tank vapor pressure",
        "To encrypt AM/FM radio broadcasts"
      ],
      correct_option_index: 1,
      explanation: "Security Gateways protect vehicle CAN buses against unauthorized cyber access, requiring scan tools to authenticate through OEM security servers before performing active commands.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "In OBD-II emissions monitoring regulations, what defines a 'Permanent DTC' and how is it cleared from vehicle memory?",
      options: [
        "A code that can be erased by disconnecting the 12V battery for 10 minutes",
        "A code that erases automatically with any handheld code reader",
        "A code that causes the vehicle to be permanently crushed",
        "A code stored in non-volatile memory that cannot be erased with a scan tool or battery disconnect; it clears only after the vehicle's internal on-board diagnostic monitor runs and confirms the repair during real-world driving"
      ],
      correct_option_index: 3,
      explanation: "Permanent DTCs prevent fraudulent code clearing before smog inspections; they can only be cleared by the ECM itself verifying that the fault is repaired during drive cycles.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "A technician performs a wide-open throttle (WOT) test on a 3.0-liter naturally aspirated engine. At peak torque RPM (4,500 RPM), the scan tool Calculated Engine Load PID reads only 58% (normal spec is 90% to 100%). What do these data indicate?",
      options: [
        "A degraded / contaminated Mass Air Flow (MAF) sensor or severe exhaust backpressure restriction limiting volumetric airflow into the cylinders",
        "The transmission torque converter is slipping",
        "The battery voltage is too high",
        "The engine oil viscosity is too thin"
      ],
      correct_option_index: 0,
      explanation: "Calculated Engine Load measures volumetric airflow efficiency. Low load (58%) at WOT indicates restricted breathing (plugged exhaust) or a under-reporting dirty MAF sensor.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "What high-speed network protocol defined by ISO 13400 utilizes 100BASE-TX / 1000BASE-T1 Ethernet physical layers to flash multi-gigabyte ADAS radar, camera, and infotainment firmware updates in minutes instead of hours?",
      options: [
        "LIN Bus Protocol",
        "K-Line Serial Protocol",
        "Diagnostics over Internet Protocol (DoIP)",
        "SAE J1850 PWM Protocol"
      ],
      correct_option_index: 2,
      explanation: "DoIP (ISO 13400) provides high-bandwidth Ethernet diagnostic routing, replacing traditional CAN buses for fast flash reprogramming of complex automotive microprocessors.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In SAE J1979 Mode $09, what is the critical difference between the Calibration Identifier (Cal ID) and the Calibration Verification Number (CVN)?",
      options: [
        "Cal ID is the vehicle color; CVN is the tire size",
        "Cal ID identifies the software part number / calibration file version installed in the ECU, while the CVN is a calculated cryptographic checksum used by emissions regulators to verify that the software has not been illegally tuned or modified",
        "There is zero technical difference between Cal ID and CVN",
        "CVN is only used on electric golf carts"
      ],
      correct_option_index: 1,
      explanation: "Cal ID represents the software version ID, while CVN is the cryptographic checksum verifying whether the ECU flash calibration matches OEM certified emissions standards.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "During an automated Cylinder Power Balance test using a bi-directional scan tool, the software cancels fuel injection sequentially to all cylinders. Cylinders 1, 2, 4, 5, and 6 each cause an immediate 130 RPM engine speed drop, but canceling Cylinder 3 causes zero (0 RPM) speed drop. What does this result prove?",
      options: [
        "Cylinder 3 is producing zero power (a dead cylinder with misfire, loss of compression, or no fuel delivery)",
        "Cylinder 3 is the most powerful cylinder in the engine",
        "The starter motor is defective",
        "The alternator belt is slipping"
      ],
      correct_option_index: 0,
      explanation: "In a power balance test, canceling a working cylinder causes engine RPM to drop. Zero RPM drop when canceling Cylinder 3 proves that Cylinder 3 was contributing zero power.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #18.");
  console.log("Skill #18 update completed successfully!");
}

run();
