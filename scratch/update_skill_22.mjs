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

const skillId = "f47c5cce-817c-415d-9280-f7b6b7e71779";

async function run() {
  console.log("Updating Skill #22: Flight Scheduling & Coordination (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Network Topologies, Fleet Assignment and Airport Slots" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Crew Scheduling, Flight Duty Rules and Flight Dispatch" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Operations Control Centers, IROPS and Tarmac Delay Rules" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Airline Network Topologies, O&D Demand and Schedule Construction",
      order_index: 1,
      content: `### Airline Network Architecture and Schedule Optimization

Airline scheduling translates passenger market demand into profitable, operationally feasible flight schedules:

1. Network Topologies:
   - Hub-and-Spoke Networks: Connecting regional spoke cities through central mega-hubs using synchronized bank / wave structures. Inbound flights arrive in a 30 to 45-minute arrival bank, passengers connect through the terminal (45 to 90-minute Minimum Connecting Time - MCT), and outbound flights depart in a synchronized departure bank. Maximizes total city-pair connectivity.
   - Point-to-Point Networks: Linear direct routes between city pairs (typical of low-cost carriers). Minimizes terminal turnaround delays and maximizes daily aircraft block-hour utilization (11 to 13 hours/day).

2. Origin & Destination (O&D) Passenger Demand Modeling:
   - Quality of Service Index (QSI): Econometric model forecasting market share based on departure frequency, aircraft cabin comfort, and non-stop vs connecting flight routing.
   - Spill vs Spoil Trade-off:
     - Spill: High demand exceeds seat capacity, turning away profitable passengers.
     - Spoil: Excess seat capacity flies empty, diluting seat-mile revenue.

3. Standard Schedule Information Manual (IATA SSIM):
   - Global standard protocol for exchanging airline schedule data across global distribution systems (GDS), air traffic management, and airport operators.`
    },
    {
      track_id: track1Id,
      title: "Fleet Assignment Models, Aircraft Rotations and Line Maintenance",
      order_index: 2,
      content: `### Mathematical Fleet Assignment and Maintenance Routing

1. Fleet Assignment Model (FAM):
   - Mixed-Integer Linear Programming (MILP) algorithms matching specific aircraft types (e.g. A321neo vs A319) to scheduled flight legs to maximize total network operating profit.
   - Constraints: Aircraft seat capacity, range limits, runway field performance, noise curfews, and maintenance base locations.

2. Aircraft Rotations and Tail Assignment:
   - Constructing closed multi-day flight sequences (Lines of Flying):
     - Example Rotation: Day 1 (Chicago -> Dallas -> Miami -> Boston), Day 2 (Boston -> Atlanta -> Chicago).
   - Maintenance Routing: Aircraft rotations must route each physical airframe into designated maintenance base stations every 48 to 72 hours for mandatory overnight Line Maintenance service checks (A-Checks, tire/brake wear inspections, fluid top-offs).

3. Block Time Metrics:
   - Block Time (Gate-to-Gate): Taxi-Out Duration + Airborne Flight Time + Taxi-In Duration.
   - Block-hour utilization is the primary driver of airline capital efficiency.`
    },
    {
      track_id: track1Id,
      title: "IATA Worldwide Airport Slot Guidelines (WASG) and Capacity Limits",
      order_index: 3,
      content: `### Airport Capacity Management and Slot Coordination

At congested global airports, physical runway and terminal capacity limits necessitate regulatory slot management:

1. IATA Airport Capacity Classifications:
   - Level 1 (Non-Coordinated): Airport infrastructure accommodates all planned operations.
   - Level 2 (Schedules Facilitated): Airports with potential congestion at peak hours; voluntary schedule adjustments.
   - Level 3 (Fully Coordinated / Slot Constrained): Demand exceeds runway, gate, or airspace capacity (e.g. London Heathrow, Tokyo Haneda, New York JFK, Paris CDG). Every takeoff and landing requires an allocated Airport Slot.

2. The IATA Worldwide Airport Slot Guidelines (WASG):
   - The '80/20 Use-It-or-Lose-It' Rule (Grandfather Rights): An airline holding an allocated slot series must operate at least 80% of those scheduled slots over the summer or winter season; failure to achieve 80% utilization results in forfeiture of historical priority for the next equivalent season.
   - Bi-Annual IATA Slot Conferences: Held in June (for Winter season) and November (for Summer season), bringing together global airlines and independent airport slot coordinators to negotiate schedule timings and slot swaps.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Airline Crew Pairing Optimization and Roster Construction",
      order_index: 1,
      content: `### Crew Resource Planning and Mathematical Optimization

Crew costs represent the second largest operating expense after fuel:

1. Crew Pairing Optimization:
   - Mathematical Set Partitioning: Grouping hundreds of thousands of individual flight legs into discrete, legal 1-to-4-day working sequences (Pairings / Trips) starting and ending at a specific crew domicile base.
   - Hard Regulatory Constraints: Maximum duty hours, minimum layover rest times, aircraft type ratings, and landing currency.
   - Cost Drivers: Minimizing crew deadheading (flying crew members as passengers to position them for duty) and unworked flight pay guarantees (Duty Rig and Trip Rig minimums).

2. Monthly Roster / Line Construction:
   - Preferential Bidding System (PBS): Advanced algorithmic bidding software where crew members rank their schedule preferences (layover destinations, days off, flight times). The PBS algorithm awards monthly schedules in strict order of pilot seniority, generating personalized legal lines of flying while staffing reserve coverage.`
    },
    {
      track_id: track2Id,
      title: "Flight Duty Limitations: FAA Part 117 and Fatigue Science",
      order_index: 2,
      content: `### Science-Based Fatigue Risk Management (FAA 14 CFR Part 117)

Part 117 establishes strict legal limits on commercial flight crew scheduling based on circadian chronobiology:

1. The Window of Circadian Low (WOCL):
   - The physiological window between 02:00 and 05:59 local body clock time, where human alertness, psychomotor performance, and cognitive reaction times degrade severely.

2. Flight Duty Period (FDP) Limitations:
   - Dynamic FDP Table: Maximum allowable duty hours (ranging from 9.0 to 14.0 hours) calculated based on the flight crew's scheduled report time and the number of flight segments:
     - Reporting at 07:00 with 1 flight leg allows up to 14 hours FDP.
     - Reporting during the WOCL (03:00) with 5 flight legs limits maximum FDP to only 9 hours.

3. Augmented Flight Crews for Long-Haul Flights:
   - 3-Pilot Crews: Utilizing Class 1 (horizontal bunk) or Class 2 on-board crew rest facilities permits extended FDPs up to 15 to 17 hours.
   - 4-Pilot Ultra-Long-Haul Crews: Permits non-stop intercontinental flights up to 19 hours FDP.

4. Mandatory Rest Requirements:
   - Minimum 10 consecutive hours of rest before an FDP, providing an uninterrupted 8-hour sleep opportunity.
   - Mandatory 30 consecutive hours of rest within every 168-hour (7-day) rolling window.`
    },
    {
      track_id: track2Id,
      title: "Flight Dispatch Planning: Fuel Calculations and Alternate Airports",
      order_index: 3,
      content: `### Flight Planning Engineering and Fuel Optimization (14 CFR 121.645)

Certified Aircraft Dispatchers calculate precise trajectories and legal fuel loads on the Operational Flight Plan (OFP):

1. Standard Fuel Breakdown Equations:
\`\`\`
Total Ramp Fuel = Taxi Fuel + Trip Fuel + Contingency Fuel + Alternate Fuel + Final Reserve Fuel + Extra Fuel
\`\`\`
   - Trip Fuel: Fuel burned from brake release at departure to touchdown at destination.
   - Contingency Fuel: 5% of trip fuel to cover en-route weather deviations or ATC speed assignments.
   - Alternate Fuel: Fuel required to fly missed approach at destination, climb, cruise, and land at the designated alternate airport.
   - Final Reserve Fuel: Mandatory 30 minutes (domestic 14 CFR 121) or 45 minutes (flag international) of holding fuel at 1,500 feet above the alternate airport.

2. The 1-2-3 Destination Alternate Rule (14 CFR 121.619):
   - A destination alternate airport is legally required on the dispatch release unless:
     - For at least 1 hour before to 1 hour after estimated arrival time:
     - The forecast ceiling is at least 2,000 feet above airport elevation, AND
     - The forecast ground visibility is at least 3 statute miles (4,800 meters).

3. Cost Index (CI) Navigation:
   - Ratio of time-related direct operating costs to fuel costs (\`CI = Time Cost ($/hr) / Fuel Cost (cents/lb)\`). Directs the Flight Management Computer to fly the optimal economic Mach number.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "The Airline Integrated Operations Control Center (IOCC / OCC)",
      order_index: 1,
      content: `### Real-Time Command and Control in Airline OCCs

The Integrated Operations Control Center (IOCC / OCC) is the 24/7 centralized nerve center managing real-world flight execution:

1. Operational Divisions within the OCC:
   - Flight Dispatchers (Flight Superintendents): Share Joint Operational Control with aircraft captains, monitoring real-time flight progress, turbulence SIGMETs, and in-flight diversions.
   - Maintenance Control (Maintrol): Coordinates aircraft mechanical faults, Minimum Equipment List (MEL) deferrals, and Aircraft on Ground (AOG) priority parts expediting.
   - Crew Tracking / Schedulers: Monitors pilot and flight attendant duty limits, assigning standby reserve crews when flights are delayed.
   - Passenger Service Coordinators: Manages passenger rebooking and tight connecting gate holds.

2. ATC Collaborative Decision Making (CDM):
   - Real-time digital coordination between the airline OCC and the FAA Air Traffic Control System Command Center (ATCSCC) / Eurocontrol:
     - Ground Delay Programs (GDP): Imposed during severe airport weather, assigning specific Controlled Time of Departure (CTD) and Expected Departure Clearance Times (EDCT) to regulate arrival traffic flow.
     - Ground Stops (GS): Immediate halting of all departures to a specific airport due to severe thunderstorms or runway blockages.`
    },
    {
      track_id: track3Id,
      title: "Irregular Operations (IROPS) Recovery and Dynamic Rescheduling",
      order_index: 2,
      content: `### Algorithmic Disruption Management and Schedule Recovery

Severe weather blizzards, convective storm lines, and air traffic flow ground delays create complex cascading disruption across airline networks:

1. The Cascade Effect of Flight Delays:
   - A single 60-minute delay in a hub morning departure ripples through downstream rotations, causing missed passenger connections, crew duty-hour expirations (crews timing out), and late night maintenance routing cancellations.

2. Mathematical Recovery Strategies:
   - Aircraft Swapping (Tail Swapping): Swapping an arriving on-time aircraft to operate a high-demand or international flight, while assigning the delayed aircraft to a less critical route.
   - Tactical Flight Cancellations: Strategically canceling selected out-and-back spoke flights on high-frequency routes (e.g. canceling 1 of 8 daily Chicago-to-New York flights) to reset aircraft and crew rotations, protecting the wider network.
   - Crew Recovery and Deadhead Repositioning: Mobilizing Airport Hot Reserve pilots stationed at hub domiciles to replace timed-out flight crews within 15 to 30 minutes.`
    },
    {
      track_id: track3Id,
      title: "Tarmac Delay Rules, Passenger Rights and Interline Logistics",
      order_index: 3,
      content: `### Passenger Protection Regulations and Airport Logistics

During severe irregular operations, airlines must comply with strict statutory passenger rights:

1. US DOT Tarmac Delay Regulations (14 CFR Part 259):
   - Mandatory Deplaning Thresholds:
     - Domestic Flights: Maximum 3 hours on the tarmac without giving passengers the opportunity to deplane.
     - International Flights: Maximum 4 hours on the tarmac.
   - Passenger Care Milestones:
     - Within 2 hours of tarmac delay: Mandatory provision of adequate food, potable drinking water, operable lavatories, and comfortable cabin climate control.
     - Severe civil financial penalties (up to $35,000+ per passenger) assessed by the DOT for tarmac rule violations.

2. European Union Passenger Rights (EU Regulation 261/2004):
   - Statutory cash compensation (250 to 600 Euros per passenger) for flight cancellations or arrival delays exceeding 3 hours, unless the airline proves the delay was caused by 'Extraordinary Circumstances' (e.g. volcanic ash, severe un-forecast weather, ATC radar failures).

3. Automated Passenger Recovery Systems:
   - Modern Passenger Service Systems (PSS / Amadeus Altéa / Sabre) automatically re-accommodate thousands of misconnected passengers onto alternate partner flights, generating digital meal and hotel accommodation vouchers instantly.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #22.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "Under the US DOT Tarmac Delay Rule (14 CFR Part 259), what is the maximum allowable duration a domestic passenger flight may remain on the airport tarmac without providing passengers the opportunity to deplane?",
      options: [
        "1 hour",
        "3 hours (180 minutes)",
        "6 hours",
        "12 hours"
      ],
      correct_option_index: 1,
      explanation: "The US DOT tarmac delay rule mandates that domestic flights must allow passengers to deplane before reaching 3 hours of tarmac delay (4 hours for international).",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "According to the FAA 1-2-3 Alternate Rule (14 CFR 121.619), a destination alternate airport is required on the dispatch release unless the weather forecast 1 hour before to 1 hour after arrival indicates at least what minimum ceiling and visibility?",
      options: [
        "Ceiling 500 feet and visibility 1 mile",
        "Ceiling 10,000 feet and visibility 10 miles",
        "Clear skies with zero clouds",
        "Ceiling at least 2,000 feet above airport elevation, and visibility at least 3 statute miles"
      ],
      correct_option_index: 3,
      explanation: "The 1-2-3 rule requires an alternate unless forecast weather from 1 hr before to 1 hr after ETA is at least 2,000 ft ceiling and 3 miles visibility.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In IATA Worldwide Airport Slot Guidelines (WASG), what is the '80/20 Rule' (Use-It-or-Lose-It) governing historic slot precedence at Level 3 coordinated airports?",
      options: [
        "An airline must operate at least 80% of its allocated slot series during a season to retain historic rights to those slots in the subsequent equivalent season",
        "80% of airline profits must be paid in airport taxes",
        "Airports must keep 20% of runway gates empty at all times",
        "Aircraft must fly at 80% maximum speed"
      ],
      correct_option_index: 0,
      explanation: "Under the 80/20 rule, airlines must utilize allocated slot series at least 80% of the time during a scheduling season to maintain grandfather rights.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What centralized 24/7 airline facility houses flight dispatchers, maintenance controllers, crew schedulers, and operations managers to control real-time flight execution?",
      options: [
        "Airport Baggage Claim",
        "Air Traffic Control Tower",
        "Integrated Operations Control Center (IOCC / OCC)",
        "Passenger Security Checkpoint"
      ],
      correct_option_index: 2,
      explanation: "The Airline Operations Control Center (OCC / IOCC) is the central nerve center monitoring and coordinating all real-time flight operations.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In airline crew scheduling chronobiology, what is the Window of Circadian Low (WOCL)?",
      options: [
        "The period during lunch hour when pilots eat",
        "The physiological window between 02:00 and 05:59 local body clock time, where human alertness and cognitive performance degrade most severely",
        "The time when aircraft engines are washed",
        "The daylight hours between 12:00 and 16:00"
      ],
      correct_option_index: 1,
      explanation: "The Window of Circadian Low (02:00 to 05:59 body clock time) represents the biological circadian trough where human fatigue and cognitive errors peak.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "Under FAA 14 CFR Part 117 flight and duty regulations, what is the mandatory minimum rest period required before a pilot may report for any Flight Duty Period (FDP)?",
      options: [
        "4 hours",
        "24 hours",
        "A minimum of 10 consecutive hours of rest, providing an uninterrupted 8-hour sleep opportunity",
        "1 hour"
      ],
      correct_option_index: 2,
      explanation: "Part 117 mandates at least 10 consecutive hours of rest prior to an FDP, including an unhindered 8-hour physiological sleep opportunity.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "What mathematical optimization technique is deployed in the Fleet Assignment Model (FAM) to assign aircraft types to scheduled flight routes to maximize network operating profit?",
      options: [
        "Mixed-Integer Linear Programming (MILP) matching aircraft seat capacity and operating costs to forecast passenger demand",
        "Rolling a six-sided die for each flight",
        "Assigning the largest aircraft to the shortest flight",
        "Simple manual trial-and-error guessing"
      ],
      correct_option_index: 0,
      explanation: "Fleet Assignment Models use Mixed-Integer Linear Programming (MILP) algorithms to optimize capacity allocations against passenger demand and operating costs.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "Under EU Regulation 261/2004, what statutory compensation is mandated for commercial airline passengers experiencing arrival delays exceeding 3 hours or flight cancellations?",
      options: [
        "A free bag of peanuts",
        "Zero compensation under all circumstances",
        "A written letter of apology",
        "Fixed statutory compensation of 250 to 600 Euros per passenger, unless the airline proves the delay was caused by extraordinary circumstances beyond its control"
      ],
      correct_option_index: 3,
      explanation: "EU 261/2004 establishes statutory cash compensation (250 to 600 Euros) for delays > 3 hours, unless caused by extraordinary uncontrollable events.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In flight dispatch fuel planning, what is 'Contingency Fuel'?",
      options: [
        "Fuel drained onto the runway before takeoff",
        "A reserve allocation (typically 5% of trip fuel) added to the fuel plan to account for unforeseen en-route weather deviations, wind shifts, or ATC routing changes",
        "Fuel used exclusively to heat the cabin",
        "Fuel stored in the passenger baggage bins"
      ],
      correct_option_index: 1,
      explanation: "Contingency fuel (typically 5% of planned trip fuel) provides a mandatory buffer for en-route deviations, minor wind changes, and tactical ATC speed adjustments.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In airport slot coordination, what defines an IATA 'Level 3' airport?",
      options: [
        "An airport that has 3 runways",
        "An airport with zero air traffic control",
        "A fully coordinated airport where passenger and aircraft demand significantly exceeds runway, gate, or terminal capacity, requiring mandatory slot allocations for every flight",
        "An airport located at 3,000 feet elevation"
      ],
      correct_option_index: 2,
      explanation: "Level 3 airports are severely capacity-constrained (e.g. Heathrow, JFK) where every single arrival and departure must hold an allocated slot.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In Flight Management Computer (FMC) economic trajectory optimization, what is the 'Cost Index' (CI) and how does it influence flight profile speeds?",
      options: [
        "The ratio of time-related direct operating costs ($/hour) to fuel costs (cents/lb); a higher Cost Index commands higher cruising airspeeds to minimize flight time, while a lower Cost Index prioritizes maximum fuel economy",
        "The price of passenger tickets",
        "The interest rate on aircraft leases",
        "The percentage commission paid to travel agents"
      ],
      correct_option_index: 0,
      explanation: "Cost Index = Time Cost / Fuel Cost. High CI commands faster speeds when time costs dominate; low CI (or CI 0) commands maximum range fuel conservation speeds.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "How do modern airline operations control centers resolve irregular operations (IROPS) during severe hub weather through 'Tail Swapping' (Aircraft Swapping)?",
      options: [
        "By physically unbolting aircraft wings in the hangar",
        "By painting the aircraft a different color",
        "By selling aircraft to rival airlines on the tarmac",
        "By dynamically reassigning an on-time arriving aircraft to operate a high-yield or critical international rotation, while assigning the delayed inbound aircraft to a less time-sensitive route"
      ],
      correct_option_index: 3,
      explanation: "Tail swapping dynamically re-assigns aircraft tails during delays to protect critical onward connections, high-yield flights, or international curfew deadlines.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "Under FAA 14 CFR Part 117, how does utilizing an 'Augmented Flight Crew' (with 3 or 4 qualified pilots and on-board Class 1 rest facilities) extend the maximum allowable Flight Duty Period (FDP)?",
      options: [
        "It allows pilots to fly for 48 hours without rest",
        "Providing dedicated horizontal sleeping bunks allows in-flight rest rotations, legally extending the allowable Flight Duty Period up to 15 to 19 hours for long-haul flights",
        "It eliminates the need for an aircraft dispatcher",
        "It allows the autopilot to fly with all pilots asleep simultaneously"
      ],
      correct_option_index: 1,
      explanation: "Augmented crews take structured in-flight rest in Class 1 sleeping bunks, legally extending maximum duty limits up to 15-19 hours for intercontinental routes.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In air traffic management Collaborative Decision Making (CDM), what is a 'Ground Delay Program' (GDP) and what mechanism does it use to manage traffic flow?",
      options: [
        "A program providing free parking to passengers",
        "A mandatory software update for luggage carts",
        "An FAA/ATC flow control measure that manages airport arrival demand during severe weather by assigning specific Controlled Time of Departure (CTD) and Expected Departure Clearance Times (EDCT) to aircraft at their origin airports before takeoff",
        "A program to clean airport taxiways"
      ],
      correct_option_index: 2,
      explanation: "A Ground Delay Program (GDP) delays aircraft on the ground at their departure airports by assigning EDCT release times, preventing airborne holding congestion.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In airline maintenance routing logistics, why must commercial aircraft flight rotations be scheduled to route each physical airframe through designated maintenance base stations every 48 to 72 hours?",
      options: [
        "To perform mandatory overnight Line Maintenance checks (A-Checks, brake/tire inspections, service fluid checks) required to maintain the aircraft's continuous airworthiness release",
        "To repaint the airline logo",
        "To replace the pilot seats",
        "To remove all fuel from the tanks"
      ],
      correct_option_index: 0,
      explanation: "Scheduled aircraft rotations must route airframes into certified line maintenance bases every 48-72 hours for overnight maintenance inspections and service releases.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #22.");
  console.log("Skill #22 update completed successfully!");
}

run();
