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

const skillId = "a556c5db-b935-4f49-8aab-7bde6f03a364";

async function run() {
  console.log("Updating Skill #21: Aviation Safety Fundamentals (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Safety Management Systems (SMS) and Risk Matrix Analysis" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Human Factors, Cognitive Models and Threat & Error Management" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Flight Recorders, Accident Investigation and Emergency Response" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Four Pillars of Safety Management Systems (ICAO Annex 19)",
      order_index: 1,
      content: `### Architecture of Aviation Safety Management Systems (SMS)

A Safety Management System (SMS) is an organized, data-driven approach to managing aviation safety, codified globally in ICAO Annex 19 and FAA 14 CFR Part 5:

1. Pillar 1: Safety Policy and Objectives:
   - Senior Leadership Commitment: Formal written safety policy signed by the Accountable Executive.
   - Organizational Accountability: Establishing clear safety reporting lines, safety committees, and an Emergency Response Plan (ERP).

2. Pillar 2: Safety Risk Management (SRM):
   - Hazard Identification: Systematic identification of hazards through reactive (incident reports), proactive (safety audits), and predictive (FOQA flight data trends) methods.
   - Risk Assessment & Mitigation: Evaluating probability and severity of hazards to apply engineered control barriers.

3. Pillar 3: Safety Assurance (SA):
   - Continuous Performance Monitoring: Tracking Safety Performance Indicators (SPIs) against Safety Performance Targets (SPTs).
   - Management of Change (MOC): Formal hazard analysis conducted prior to introducing new aircraft types, operating routes, or organizational procedures.

4. Pillar 4: Safety Promotion:
   - Fostering an organizational Just Culture, continuous safety training programs, and two-way open communication channels across all operational divisions.`
    },
    {
      track_id: track1Id,
      title: "Quantitative Hazard Identification and Safety Risk Assessment Matrices",
      order_index: 2,
      content: `### Quantitative Risk Analysis in Aviation Operations

Risk management converts raw hazard data into actionable decision matrices (ICAO Doc 9859 Safety Management Manual):

1. The 5x5 Safety Risk Matrix Architecture:
   - Severity Categories:
     - Catastrophic (A): Total aircraft hull loss and multiple fatalities.
     - Hazardous (B): Large reduction in safety margins, serious injuries, major structural damage.
     - Major (C): Significant reduction in safety margins, emergency procedures required.
     - Minor (D): Operating limitations, minor nuisance or system reset.
     - Negligible (E): Minimal operational consequence.
   - Probability / Likelihood Scales:
     - Frequent (5): Likely to occur many times.
     - Occasional (4): Likely to occur sometimes.
     - Remote (3): Unlikely, but possible.
     - Improbable (2): Very unlikely.
     - Extremely Improbable (1): Almost inconceivable (probability < 10^-9 per flight hour).

2. Risk Acceptability Criteria:
   - Intolerable / Unacceptable (Red Zone: e.g. 5A, 5B, 4A): Operation must cease immediately until risk is mitigated.
   - Tolerable / ALARP (Yellow Zone: e.g. 3B, 4C): As Low As Reasonably Practicable; operations may proceed with documented tracking and risk mitigation controls.
   - Acceptable (Green Zone: e.g. 1D, 2E): Safe to operate without further action.

3. Risk Mitigation Hierarchy:
   - Elimination (highest efficacy) -> Engineering Substitution -> Administrative Controls / SOPs -> Warning Systems / PPE.`
    },
    {
      track_id: track1Id,
      title: "Just Culture, Voluntary Safety Reporting and FOQA / ASAP Programs",
      order_index: 3,
      content: `### Non-Punitive Reporting and Big-Data Flight Analytics

Modern commercial aviation achieves historically low accident rates by learning from high-volume operational data:

1. James Reason's Just Culture Philosophy:
   - An atmosphere of trust where operational personnel are encouraged to provide essential safety-related information without fear of punishment.
   - Clear Boundary Line:
     - Non-Punitive: Honest human errors, cognitive slips, memory lapses, and inadvertent procedural deviations are protected from disciplinary action.
     - Punitive Action: Deliberate gross negligence, reckless willful violations of regulations, substance abuse, and criminal sabotage are strictly subject to disciplinary and legal penalties.

2. Voluntary Safety Reporting Programs:
   - Aviation Safety Action Program (ASAP / FAA AC 120-66): Confidential, non-punitive reporting system connecting pilots, dispatchers, and mechanics directly with an Event Review Committee (ERC) comprising the Airline, Pilot Union, and FAA.
   - Aviation Safety Reporting System (ASRS): Confidential voluntary incident reporting database administered independently by NASA.

3. Flight Operational Quality Assurance (FOQA / Flight Data Monitoring - FDM):
   - Algorithmic analysis of high-density optical Quick Access Recorder (QAR) flight data across 100% of airline flights.
   - Automated detection of flight parameter exceedances (e.g. unstabilized approach criteria, late flap deployments, excessive G-loads on touchdown), identifying latent hazards before they develop into accidents.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Human Factors Engineering: The SHELL Model and Cognitive Biases",
      order_index: 1,
      content: `### Cognitive Ergonomics and Human Performance (ICAO Doc 9683)

Over 70% of aviation incidents involve human performance breakdowns; human factors engineering optimizes the interface between humans and operational systems:

1. The SHELL Conceptual Model:
   - Liveware (Core / The Human): Physiological limitations, sensory processing, spatial disorientation, sleep debt, and cognitive bandwidth.
   - Liveware-Hardware: Ergonomic physical interface (cockpit display symbology, fly-by-wire sidestick feel, physical control reach).
   - Liveware-Software: Interaction with Standard Operating Procedures (SOPs), flight management computers (FMC), checklists, and automated flight modes.
   - Liveware-Environment: Ambient operational factors (hypoxia at altitude, turbulence, severe weather, nighttime IMC, high cockpit noise).
   - Liveware-Liveware: Interpersonal communication, crew leadership, air traffic control interactions, and CRM teamwork.

2. Critical Cognitive Biases in Flight Operations:
   - Plan Continuation Bias (Get-There-Itis): Unconscious cognitive anchoring causing crews to continue an unstabilized approach in deteriorating weather rather than executing a mandatory go-around.
   - Confirmation Bias: Selectively interpreting ambiguous cockpit warnings to fit a pre-existing false mental model.
   - Automation Complacency: Over-reliance on autopilot and autothrottle systems leading to degraded monitoring vigilance.`
    },
    {
      track_id: track2Id,
      title: "Systemic Accident Causation: Reason's Swiss Cheese Model",
      order_index: 2,
      content: `### Systemic Accident Causation and Defensive Barriers

Modern aviation safety rejects the simplistic concept of single-point pilot error, viewing accidents as systemic organizational failures:

1. James Reason's Swiss Cheese Model of Accident Causation:
   - Defensive Barriers (The Slices of Cheese): Layers of engineered and operational protection:
     - Organizational Decision-Making and Resource Allocation.
     - Supervisory Oversight, Standard Maintenance Programs, and Crew Training.
     - Preconditions for Unsafe Acts (Fatigue management, ergonomic flight decks).
     - Operational Flight Crew Actions (Adherence to SOPs, active monitoring).
     - Engineered Defensive Safety Nets (TCAS, EGPWS, Stall Shakers).

2. Latent Conditions vs Active Failures:
   - Latent Conditions: Inherent flaws embedded deep within organizational systems (inadequate training syllabi, aggressive commercial schedule pressure, ambiguous maintenance manuals) that lie dormant for months or years.
   - Active Failures: Immediate unsafe acts, slips, or errors committed by operational personnel (e.g. setting an incorrect altimeter setting).
   - Accident Trajectory: An accident occurs only when the 'holes' (deficiencies) in every consecutive defensive layer momentarily align, creating a catastrophic trajectory of failure.`
    },
    {
      track_id: track2Id,
      title: "Threat & Error Management (TEM) and Crew Resource Management",
      order_index: 3,
      content: `### Threat & Error Management and Flight Deck Non-Technical Skills

Threat and Error Management (TEM) is the operational framework practiced in modern airline flight decks to manage real-world complexity:

1. The Three Components of TEM:
   - Threats: Environmental or operational events outside the direct control of the flight crew (e.g. convective thunderstorms, terrain, runway closures, complex ATC clearances). Must be anticipated and briefed.
   - Errors: Crew actions or inactions leading to deviations from intentions (e.g. missed checklist items, incorrect MCP altitude selection). Must be detected and trapped.
   - Undesired Aircraft States (UAS): Transitional states placing the aircraft in immediate operational risk (e.g. unstabilized approach, altitude bust, high bank angle). Must be recognized and mitigated immediately (e.g. executing an immediate go-around).

2. Crew Resource Management (CRM) Tools:
   - Shared Situational Awareness: Level 1 (Perception of environment), Level 2 (Comprehension of current status), Level 3 (Projection of future state).
   - Graded Assertiveness (The PACE Hierarchy):
     - Probe: 'Captain, what speed are we targeting?'
     - Alert: 'Captain, our airspeed is 15 knots below V_REF.'
     - Challenge: 'Captain, we are unstabilized; you must go around.'
     - Emergency Action: 'I have control. Go-around, flaps 15, positive rate, gear up.'
   - The Two-Challenge Rule: If a pilot does not acknowledge two consecutive safety challenges, the non-flying pilot is mandated to assume control.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Flight Recorders: CVR, DFDR Engineering and CSMU Survivability",
      order_index: 1,
      content: `### Black Box Engineering and Survivability Standards

Flight data and cockpit audio recorders provide empirical forensic records for accident investigators (ICAO Annex 6 / FAA TSO-C123 & TSO-C124):

1. Crash-Survivable Memory Unit (CSMU) Survivability Standards:
   - Impact Shock: Must withstand an instantaneous deceleration shock of 3,400 G for 6.5 milliseconds.
   - Direct Fire Resistance: Must endure continuous direct flame engulfment at 1,100 degrees C (2,000 degrees F) for 60 consecutive minutes.
   - Deep-Sea Hydrostatic Pressure: Must resist immersion pressure at 20,000 feet (6,000 meters) ocean depth.

2. Recorder Systems Architecture:
   - Cockpit Voice Recorder (CVR): Solid-state recording of 4 independent audio channels (Captain, First Officer, third crewmember/PA, and the high-sensitivity Cockpit Area Microphone). Modern standard: 25-hour digital recording loop with an independent Recorder Independent Power Supply (RIPS) providing 10 minutes of backup power if aircraft electrical buses fail.
   - Digital Flight Data Recorder (DFDR): Continuous recording of mandatory flight parameters (ranging from 88 parameters on older aircraft to over 1,000+ parameters on modern fly-by-wire airliners: control surface positions, pitch/roll/yaw, engine EPR/N1, autopilot engagement status, acceleration G-forces). Minimum recording duration: 25 hours.
   - Underwater Locator Beacon (ULB / Pinger): Emits a 37.5 kHz acoustic ultrasonic pulse once per second for 90 days upon immersion in water.`
    },
    {
      track_id: track3Id,
      title: "ICAO Annex 13 Accident Investigation Protocols and Forensic Analysis",
      order_index: 2,
      content: `### Aircraft Accident and Incident Investigation Methodology

Accident investigations are conducted under the international standards of ICAO Annex 13:

1. International Party Participation:
   - State of Occurrence: Leads the investigation on sovereign territory.
   - State of Registry: State where aircraft is registered.
   - State of the Operator: Home nation of the airline.
   - State of Design and State of Manufacture: Nations where the airframe and engines were certified and constructed. Each assigns an Accredited Representative (AccRep) with technical advisors (Boeing, Airbus, NTSB, BEA).

2. Investigation Group Structure:
   - Specialized technical teams: Operations, Systems, Structures, Powerplants, Air Traffic Control, Meteorology, Flight Recorders, Human Performance, and Survival Factors.

3. Forensic Engineering Analysis:
   - Wreckage Trajectory Mapping: Distribution of debris across the crash site indicates in-flight structural breakup vs ground impact.
   - Fracture Metallurgy: Scanning Electron Microscope (SEM) analysis distinguishing static ductile overload fractures from high-cycle fatigue beach marks.
   - Final Report Structure: Factual Information -> Analysis -> Conclusions & Probable Cause -> Safety Recommendations.`
    },
    {
      track_id: track3Id,
      title: "Airport Emergency Response Planning (ERP) and ARFF Capabilities",
      order_index: 3,
      content: `### Emergency Response Planning and Rescue Firefighting (14 CFR Part 139)

Airports and airlines maintain detailed Emergency Response Plans (ERP) to manage catastrophic incidents:

1. Aircraft Rescue and Fire Fighting (ARFF / ICAO Doc 9137):
   - Mandatory Response Time (14 CFR 139.319): From the moment the alarm sounds, the primary ARFF crash vehicle must reach the midpoint of the farthest operational runway and begin applying foam/water extinguishing agent within 3 minutes (180 seconds).
   - Aqueous Film-Forming Foam (AFFF): Extinguishes hydrocarbon fuel fires by blanketing the fuel surface to suppress vapor release and prevent burn-back.

2. Airport Emergency Operations Center (EOC):
   - Command center coordinating multi-agency operations: airport operations, ARFF, municipal fire departments, police, trauma hospitals, and air traffic control.
   - Tri-Service Triage: Immediate categorization of casualties on scene into Red (Immediate life threat), Yellow (Delayed), Green (Minor), and Black (Deceased).

3. Family Assistance and Humanitarian Response:
   - Governed by the Aviation Disaster Family Assistance Act: Dedicated crisis response teams providing immediate logistical, emotional, and humanitarian support to passenger families in coordination with the NTSB.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #21.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "What international aviation standard (ICAO Annex 19 / FAA 14 CFR Part 5) establishes the framework for organizational data-driven Safety Management Systems (SMS)?",
      options: [
        "Annex 2 (Rules of the Air)",
        "Annex 14 (Aerodromes)",
        "Annex 19 (Safety Management)",
        "Annex 1 (Personnel Licensing)"
      ],
      correct_option_index: 2,
      explanation: "ICAO Annex 19 is the dedicated global standard establishing requirements for state safety programs and airline Safety Management Systems (SMS).",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "Under FAA 14 CFR Part 139 standards, what is the maximum allowable response time for the primary ARFF crash vehicle to reach any runway midpoint and begin applying extinguishing foam?",
      options: [
        "Within 3 minutes (180 seconds)",
        "Within 15 minutes",
        "Within 45 minutes",
        "Within 1 hour"
      ],
      correct_option_index: 0,
      explanation: "Airport Rescue and Fire Fighting (ARFF) vehicles must reach the midpoint of the farthest operational runway and apply foam within 3 minutes of alarm.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In James Reason's systemic accident causation model, what visual metaphor represents organizational, supervisory, and operational defensive barriers?",
      options: [
        "A brick wall",
        "A chain link fence",
        "An iron bridge",
        "Slices of Swiss Cheese (where holes represent latent conditions and active failures)"
      ],
      correct_option_index: 3,
      explanation: "Reason's Swiss Cheese Model visualizes defensive barriers as cheese slices, where an accident occurs only when holes in all layers momentarily align.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What voluntary aviation safety program (FAA AC 120-66) provides non-punitive, confidential incident reporting by pilots and technicians, evaluated by an Event Review Committee?",
      options: [
        "Air Traffic Control Tower Log",
        "Aviation Safety Action Program (ASAP)",
        "Airline Stockholder Report",
        "Public Press Release"
      ],
      correct_option_index: 1,
      explanation: "The Aviation Safety Action Program (ASAP) allows operational personnel to voluntarily disclose safety events without fear of punitive FAA enforcement.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "For how long must an underwater locator beacon (ULB / Pinger) attached to a crash-survivable flight recorder transmit its 37.5 kHz ultrasonic acoustic signal upon water immersion?",
      options: [
        "24 hours",
        "7 days",
        "90 days",
        "10 years"
      ],
      correct_option_index: 2,
      explanation: "Modern underwater locator beacons are mandated to transmit acoustic homing pulses for a minimum of 90 days following water immersion.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In an ICAO 5x5 Safety Risk Matrix, how is an operational risk classified if its severity is 'Catastrophic' (A) and its likelihood is 'Frequent' (5)?",
      options: [
        "Acceptable (Green Zone)",
        "Intolerable / Unacceptable (Red Zone: operations must cease immediately until risk is mitigated)",
        "Tolerable without any tracking",
        "Negligible consequence"
      ],
      correct_option_index: 1,
      explanation: "A risk combining catastrophic severity (A) with frequent likelihood (5) falls into the Red (Intolerable) zone, mandating immediate cessation of operations.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In the Threat and Error Management (TEM) framework, what constitutes an 'Undesired Aircraft State' (UAS)?",
      options: [
        "A flight cancellation due to rain",
        "A passenger ordering the wrong meal",
        "A baggage delay at destination",
        "A transitional operational condition where the aircraft is placed in immediate risk (such as an unstabilized approach, altitude bust, or high bank angle deviation)"
      ],
      correct_option_index: 3,
      explanation: "An Undesired Aircraft State (UAS) is a transitional condition (e.g. unstabilized approach) resulting from unmanaged threats/errors that requires immediate recovery.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In the SHELL human factors model, what interface is represented by a flight crew interacting with the Flight Management Computer (FMC) and Standard Operating Procedure (SOP) checklists?",
      options: [
        "Liveware-Software (L-S)",
        "Liveware-Hardware (L-H)",
        "Liveware-Environment (L-E)",
        "Liveware-Liveware (L-L)"
      ],
      correct_option_index: 0,
      explanation: "The Liveware-Software interface encompasses the human interaction with procedures, manuals, checklists, symbology, and automated computer software logic.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "Under James Reason's Just Culture principles, what is the critical distinction between acceptable behavior and unacceptable behavior?",
      options: [
        "All pilot errors result in immediate termination",
        "There is zero accountability for any action in aviation",
        "Honest cognitive slips, mistakes, and inadvertent errors are protected non-punitively, whereas gross negligence, intentional violations, and substance impairment are subject to strict disciplinary action",
        "Only senior captains are exempt from discipline"
      ],
      correct_option_index: 2,
      explanation: "Just Culture draws a clear line: honest human error is treated non-punitively to encourage safety reporting, while reckless willful misconduct is subject to disciplinary action.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In Crew Resource Management (CRM), what is the 'Two-Challenge Rule'?",
      options: [
        "A pilot must challenge two other airlines to a race",
        "If a pilot in control fails to acknowledge two consecutive safety challenges regarding an unsafe state from the monitoring pilot, the monitoring pilot is mandated to assume control of the aircraft",
        "Two pilots must agree on the flight meal",
        "Air traffic control must issue every clearance twice"
      ],
      correct_option_index: 1,
      explanation: "The Two-Challenge Rule dictates that if the flying pilot ignores two clear safety warnings, the monitoring pilot must immediately take physical control of the aircraft.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "What cognitive bias describes an unconscious anchoring where a flight crew persists in attempting to land from an unstabilized approach in severe weather rather than executing a mandatory go-around?",
      options: [
        "Automation Complacency",
        "Availability Heuristic",
        "Hindsight Bias",
        "Plan Continuation Bias (Get-There-Itis)"
      ],
      correct_option_index: 3,
      explanation: "Plan Continuation Bias (Get-There-Itis) is the unconscious drive to stick to an initial flight plan despite emerging sensory evidence that conditions have become unsafe.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "What physical survivability parameters must a Crash-Survivable Memory Unit (CSMU) inside a modern DFDR or CVR withstand during certification testing?",
      options: [
        "3,400 G impact deceleration for 6.5 ms, 1,100 degrees C (2,000 degrees F) direct flame for 60 minutes, and 20,000 feet deep-sea hydrostatic pressure",
        "50 G impact and 100 degrees C heat",
        "Immersion in household tap water for 10 minutes",
        "Withstand dropping from a 6-foot ladder"
      ],
      correct_option_index: 0,
      explanation: "CSMUs must survive extreme catastrophic forces: 3,400 G impact shock, 1,100 C fire for 1 hour, and 20,000 ft deep ocean pressure.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In microscopic fracture metallurgy during an aircraft structural failure investigation, how does an investigator distinguish high-cycle fatigue from sudden ductile overload failure under a Scanning Electron Microscope (SEM)?",
      options: [
        "Fatigue fractures are painted yellow",
        "Ductile overload has zero metal deformation",
        "High-cycle fatigue exhibits progression 'beach marks' and microscopic striations showing cyclical crack growth, whereas ductile overload exhibits microvoid coalescence dimples",
        "Fatigue only occurs in plastic parts"
      ],
      correct_option_index: 2,
      explanation: "Cyclic fatigue displays microscopic striations and progression beach marks from repetitive stress cycles; instantaneous ductile overload displays microscopic dimples.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Flight Operational Quality Assurance (FOQA) programs, what automated digital process allows airlines to proactively identify latent flight safety risks before accidents occur?",
      options: [
        "Random drug testing of baggage handlers",
        "Algorithmic analysis of high-density Quick Access Recorder (QAR) flight data across 100% of routine flights to identify statistical parameter exceedances (e.g. unstabilized approaches, high G-loads)",
        "Surveying passenger satisfaction after flight",
        "Watching YouTube videos of aircraft landings"
      ],
      correct_option_index: 1,
      explanation: "FOQA algorithmically mines routine digital flight recorder data to detect aggregate safety trends and parameter exceedances across thousands of revenue flights.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In Crew Resource Management graded assertiveness, what is the correct sequence of escalating communication under the PACE model?",
      options: [
        "Probe -> Alert -> Challenge -> Emergency Action (Take Control)",
        "Yell -> Scream -> Cry -> Resign",
        "Whisper -> Suggest -> Agree -> Ignore",
        "Silence -> Log Entry -> Delay -> Dismiss"
      ],
      correct_option_index: 0,
      explanation: "The PACE graded assertiveness model progresses methodically from Probing inquiry, to Alerting statement, to direct Challenging directive, to Emergency assumption of control.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #21.");
  console.log("Skill #21 update completed successfully!");
}

run();
