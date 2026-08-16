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

const skillId = "7b66f8ab-1600-419b-9bc7-06a064a20aec";

async function run() {
  console.log("Updating Skill #20: Aviation Regulations Basics (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: International Air Law, ICAO Framework and Freedoms of the Air" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Airworthiness Standards, Maintenance Regulations and ADs" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Commercial Operating Rules, MEL Protocols and Dangerous Goods" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Chicago Convention (1944), ICAO Governance and the 19 Annexes",
      order_index: 1,
      content: `### Foundations of Global Aviation Jurisprudence

International civil aviation operates under a multilateral treaty framework established by the 1944 Chicago Convention on International Civil Aviation (Doc 7300):

1. Sovereignty and Multilateral Governance:
   - Article 1 (Airspace Sovereignty): Establishes that every State possesses complete and exclusive sovereignty over the airspace above its territory and territorial waters.
   - International Civil Aviation Organization (ICAO): A specialized agency of the United Nations (headquartered in Montreal, Canada) established to administer international civil aviation principles.

2. ICAO Standards and Recommended Practices (SARPs):
   - Standards: Mandatory specifications; member States must conform or file a formal notice of difference under Article 38.
   - Recommended Practices: Desirable standards for global harmonization.

3. Key ICAO Annexes to the Chicago Convention:
   - Annex 1: Personnel Licensing (Pilots, Flight Engineers, Air Traffic Controllers).
   - Annex 2: Rules of the Air (VFR / IFR right-of-way).
   - Annex 6: Operation of Aircraft (International commercial air transport requirements).
   - Annex 8: Airworthiness of Aircraft.
   - Annex 13: Aircraft Accident and Incident Investigation (Mandates independent, no-blame technical safety investigations whose sole objective is the prevention of future accidents).
   - Annex 14: Aerodromes (Physical layout and rescue fire fighting).
   - Annex 17: Security (AVSEC safeguards against unlawful interference).
   - Annex 19: Safety Management Systems (SMS data-driven risk management).`
    },
    {
      track_id: track1Id,
      title: "Bilateral Air Transport Agreements and the Nine Freedoms of the Air",
      order_index: 2,
      content: `### Commercial Air Rights and the Freedoms of the Air

Commercial airline routes across sovereign borders are governed by Bilateral Air Transport Agreements and Open Skies treaties under the Nine Freedoms of the Air:

1. Transit Rights (Technical Freedoms):
   - 1st Freedom: The right of an airline to fly across a foreign country's airspace without landing (e.g. US carrier overflying Canada en route to Europe).
   - 2nd Freedom (Technical Landing): The right to land in a foreign country for non-traffic purposes (refueling or emergency repairs) without boarding or deplaning revenue passengers.

2. Commercial Traffic Rights:
   - 3rd Freedom: The right to fly revenue passengers/cargo from the airline's home country to a foreign country.
   - 4th Freedom: The right to fly revenue passengers/cargo from a foreign country back to the airline's home country.
   - 5th Freedom (Beyond Rights): The right to carry revenue traffic between two foreign countries on a flight originating or terminating in the airline's home country (e.g. Emirates flying Dubai to New York with a commercial stop in Milan boarding Milan-to-New York passengers).
   - 6th Freedom: The right to carry traffic between two foreign countries by connecting through the airline's home hub (e.g. Qatar Airways carrying London to Sydney passengers via Doha).
   - 7th Freedom: Operating standalone commercial service between two foreign countries without touching the home country.
   - 8th Freedom (Consecutive Cabotage): Carrying domestic passengers within a foreign country on a route that originates or continues to the home territory.
   - 9th Freedom (Pure Cabotage): Operating purely domestic air service entirely within a foreign nation's domestic borders.`
    },
    {
      track_id: track1Id,
      title: "National Aviation Authorities: FAA vs EASA and Bilateral Agreements",
      order_index: 3,
      content: `### National Regulatory Frameworks and Harmonization

While ICAO sets global standards, National Aviation Authorities (NAAs) enforce legal regulations within sovereign jurisdictions:

1. Regulatory Philosophy (FAA vs EASA):
   - Federal Aviation Administration (FAA / USA): Governed by Title 14 of the Code of Federal Regulations (14 CFR). Traditionally prescriptive and detailed rule-based framework.
   - European Union Aviation Safety Agency (EASA / Europe): Governed by the EASA Basic Regulation and Implementing Rules (IRs). Performance-based regulatory structure focusing on systemic safety outcomes.

2. Bilateral Aviation Safety Agreements (BASA):
   - Executive agreements between nations (e.g. US-EU BASA) facilitating reciprocal acceptance of civil aeronautical product approvals:
     - Implementation Procedures for Airworthiness (IPA): Streamlines reciprocal Type Certification and Supplemental Type Certification (STC) validation.
     - Maintenance Implementation Procedures (MIP): Provides mutual regulatory oversight and acceptance of certified Repair Stations and Part-145 maintenance facilities, eliminating redundant dual-audit compliance costs.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Aircraft Type Certification, Supplemental Type Certificates and Part 25",
      order_index: 1,
      content: `### Airworthiness Certification Engineering (FAA 14 CFR Part 25)

Every commercial transport aircraft design must undergo rigorous structural and aerodynamic certification before carrying passengers:

1. Transport Category Airplanes (14 CFR Part 25 / EASA CS-25):
   - Structural Design Envelope: Airframes must withstand limit maneuver load factors (+2.5G to -1.0G) and ultimate loads (1.5 times limit load) without structural failure.
   - Fail-Safe and Damage Tolerance: Multiple load paths ensuring single structural element failures do not cause catastrophic loss of the aircraft.
   - Emergency Evacuation Standards: 14 CFR 25.803 mandates full-scale evacuation of maximum passenger capacity within 90 seconds using only 50% of available emergency exits in complete darkness.

2. Certification Documents:
   - Type Certificate (TC): Formal document issued to an aircraft manufacturer certifying that the design meets all applicable airworthiness regulations.
   - Type Certificate Data Sheet (TCDS): Official record detailing technical specifications, engine models, maximum operating airspeeds (V_MO / M_MO), fuel capacities, and Center of Gravity limits.
   - Supplemental Type Certificate (STC): Formal regulatory approval for a major design modification to an existing type-certified airframe (e.g. winglet additions, avionics glass cockpit upgrades, or passenger-to-freighter conversions).
   - Standard Airworthiness Certificate (FAA Form 8100-2): Issued to an individual physical aircraft, legally valid as long as the aircraft is maintained according to approved maintenance programs.`
    },
    {
      track_id: track2Id,
      title: "Continuing Airworthiness: Airworthiness Directives and Service Bulletins",
      order_index: 2,
      content: `### Mandatory Airworthiness Enforcement and Safety Bulletins

Aircraft airworthiness is a continuous legal lifecycle governed by 14 CFR Part 39:

1. Airworthiness Directives (ADs / 14 CFR Part 39):
   - Legally binding federal regulations issued by NAAs to correct an identified unsafe condition in aircraft, engines, propellers, or appliances.
   - Compliance is legally mandatory; operating an aircraft with an overdue AD renders the aircraft legally unairworthy and invalidates its airworthiness certificate.
   - Types of ADs:
     - Emergency ADs: Mandate immediate inspection or grounding before further flight.
     - Notice of Proposed Rulemaking (NPRM) Standard ADs: Provide a compliance window (e.g. inspect within 500 flight cycles or 6 calendar months).
     - Recurring ADs: Require repetitive ultrasonic or eddy-current non-destructive testing at fixed flight hour intervals.

2. Manufacturer Service Bulletins (SBs):
   - Technical product improvement documents issued by airframe and engine manufacturers. SBs are advisory unless incorporated by reference into an FAA Airworthiness Directive, which makes compliance mandatory by federal law.

3. Service Difficulty Reporting (SDR / 14 CFR 121.703):
   - Commercial airlines must report structural cracks, uncommanded engine shutdowns, and uncontained system failures to the FAA SDR database within 96 hours to identify fleet-wide failure trends.`
    },
    {
      track_id: track2Id,
      title: "Certified Maintenance Organizations: FAA Part 145 vs EASA Part-145",
      order_index: 3,
      content: `### Certified Repair Stations and Maintenance Release Protocols

Commercial aircraft maintenance must be executed exclusively by certified maintenance organizations:

1. Regulatory Frameworks:
   - FAA 14 CFR Part 145 (Certificated Repair Stations): Mandates approved Repair Station Manuals (RSM), Quality Control Manuals (QCM), calibration standards, and FAA-licensed Airframe & Powerplant (A&P) technicians with Inspection Authorization (IA).
   - EASA Part-145 (Approved Maintenance Organizations): Mandates strict certifying staff categories (B1 Mechanical, B2 Avionics, C Base Maintenance).
   - Continuing Airworthiness Management Organization (CAMO / EASA Part-CAMO): Responsible for managing maintenance tracking programs, engine condition monitoring, and Life-Limited Parts (LLP) back-to-birth historical documentation.

2. Authorized Release Certificates (FAA Form 8130-3 / EASA Form 1):
   - The legal Return to Service document: Certifies that a newly manufactured or overhauled aeronautical component was inspected and tested in full conformity with approved manufacturer technical data.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Commercial Operating Rules: FAA Part 91, Part 121 and Part 135",
      order_index: 1,
      content: `### Hierarchy of Commercial Aviation Flight Rules

The Federal Aviation Regulations divide flight operations into distinct regulatory parts based on public safety risk:

1. 14 CFR Part 91 (General Operating and Flight Rules):
   - Baseline flight rules for private general aviation, owner-flown aircraft, and corporate business jets.
   - Fuel Reserve Minimums: 30 minutes for day VFR; 45 minutes for IFR flight.

2. 14 CFR Part 135 (Commuter and On-Demand Operations):
   - Governs commercial air taxi, private charter jet flights, and scheduled passenger operations with aircraft seating 9 passengers or fewer.
   - Stricter pilot rest rules, weather minimums, and mandatory FAA Approved Aircraft Inspection Programs (AAIP).

3. 14 CFR Part 121 (Major Scheduled Commercial Air Carriers):
   - Governs scheduled passenger airlines (e.g. Delta, United, American).
   - Multi-Crew Flight Decks: Both Captain and First Officer must hold Airline Transport Pilot (ATP) certificates with type ratings.
   - Joint Operational Control: Legal flight release authority shared equally between the Pilot-in-Command (PIC) and the FAA-certificated Aircraft Dispatcher.
   - Part 117 Flight and Duty Limitations: Strict science-based fatigue management regulations governing flight duty periods.

4. Extended-Range Twin-Engine Operations (ETOPS / EDTO):
   - Authorizes twin-engine commercial airliners to fly routes with single-engine diversion times exceeding 60 minutes from an adequate alternate airport (ETOPS 180, 240, or 370 minutes).`
    },
    {
      track_id: track3Id,
      title: "Minimum Equipment Lists (MEL), Dispatch Releases and CDLs",
      order_index: 2,
      content: `### Deferral of Inoperative Equipment and Dispatch Authority

Under federal regulations, all installed equipment must be fully operational unless deferred under an approved Minimum Equipment List (14 CFR 121.628):

1. MMEL vs MEL Architecture:
   - Master Minimum Equipment List (MMEL): Developed by the aircraft manufacturer and FAA Flight Operations Evaluation Board (FOEB), listing all items that can be inoperative without compromising flight safety.
   - Minimum Equipment List (MEL): Airline-specific document approved by the FAA Principal Operations Inspector (POI). An airline's MEL can be more restrictive than the MMEL, but never less restrictive.
   - Configuration Deviation List (CDL): Authorizes dispatch with missing secondary external airframe parts (e.g. flap track fairings, static wicks) with calculated takeoff weight and fuel burn penalties.

2. Standard MEL Repair Categories:
   - Category A: Rectified within the specific time interval listed in the Remarks column (e.g. 1 flight cycle).
   - Category B: Must be repaired within 3 consecutive calendar days (72 hours).
   - Category C: Must be repaired within 10 consecutive calendar days (240 hours).
   - Category D: Must be repaired within 120 consecutive calendar days.

3. Operational (O) and Maintenance (M) Deferral Procedures:
   - (M) Procedure: Requires a certified mechanic to deactivate and placard the component (e.g. pulling and collaring a circuit breaker).
   - (O) Procedure: Requires special pilot flight crew operating procedures (e.g. flying below 10,000 feet if an unpressurized pack is deferred).`
    },
    {
      track_id: track3Id,
      title: "Dangerous Goods Regulations (ICAO Doc 9284 / IATA DGR)",
      order_index: 3,
      content: `### Hazardous Materials Air Transport Protocols

Transporting dangerous goods by air is governed globally by ICAO Doc 9284 (Technical Instructions) and the IATA Dangerous Goods Regulations (DGR):

1. The Nine UN Dangerous Goods Hazard Classes:
   - Class 1: Explosives.
   - Class 2: Gases (2.1 Flammable, 2.2 Non-flammable non-toxic, 2.3 Toxic).
   - Class 3: Flammable Liquids (Jet fuel, paints).
   - Class 4: Flammable Solids, Spontaneously Combustible, Dangerous When Wet.
   - Class 5: Oxidizers and Organic Peroxides.
   - Class 6: Toxic Substances and Infectious Biological Substances.
   - Class 7: Radioactive Materials.
   - Class 8: Corrosives (Acids, mercury, battery electrolyte).
   - Class 9: Miscellaneous Dangerous Goods: Includes Lithium-Ion batteries (UN 3480 / UN 3481), dry ice (UN 1845), and magnetized materials.

2. Packaging and Segregation Chemistry:
   - UN Specification Packaging: Certified to Packing Group I (High Danger - X), Group II (Medium Danger - Y), or Group III (Low Danger - Z).
   - Incompatible Chemical Segregation: Segregation tables prohibiting oxidizers (Class 5.1) from being loaded adjacent to flammable liquids (Class 3).

3. The NOTOC (Notification to Captain):
   - A mandatory legal document delivered to the Pilot-in-Command before departure:
     - Details exact UN numbers, proper shipping names, hazard classes, net quantities, cargo hold compartment locations, and emergency response drill codes (ICAO Red Book).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #20.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "What fundamental international aviation treaty, signed in 1944, established the principle of national airspace sovereignty and founded the International Civil Aviation Organization (ICAO)?",
      options: [
        "The Chicago Convention on International Civil Aviation",
        "The Treaty of Versailles",
        "The Kyoto Protocol",
        "The Geneva Convention"
      ],
      correct_option_index: 0,
      explanation: "The 1944 Chicago Convention (ICAO Doc 7300) established global airspace sovereignty principles and created ICAO.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What legally binding administrative order is issued by a National Aviation Authority (such as the FAA under 14 CFR Part 39) to mandate corrective action for an identified unsafe condition in an aircraft?",
      options: [
        "Manufacturer Service Bulletin (SB)",
        "Pilot Flight Log Entry",
        "Airworthiness Directive (AD)",
        "Baggage Claim Tag"
      ],
      correct_option_index: 2,
      explanation: "Airworthiness Directives (ADs) are legally mandatory federal regulations that must be complied with to maintain an aircraft's legal airworthiness.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "Which Federal Aviation Regulation (14 CFR) part governs major scheduled commercial passenger airlines operating large transport aircraft (such as Delta, United, and American Airlines)?",
      options: [
        "14 CFR Part 91 (General Aviation)",
        "14 CFR Part 121 (Scheduled Commercial Air Carriers)",
        "14 CFR Part 103 (Ultralights)",
        "14 CFR Part 147 (Mechanic Schools)"
      ],
      correct_option_index: 1,
      explanation: "14 CFR Part 121 governs major scheduled domestic, flag, and supplemental commercial transport air carriers.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What document is delivered to the Pilot-in-Command prior to departure detailing the exact UN numbers, hazard classes, quantities, and cargo hold locations of hazardous materials loaded on board?",
      options: [
        "Passenger Manifest",
        "Weather METAR Report",
        "Aircraft Bill of Sale",
        "Notification to Captain (NOTOC)"
      ],
      correct_option_index: 3,
      explanation: "The NOTOC (Notification to Captain) is a mandatory legal document providing flight crew with the exact locations and emergency response drill codes for all dangerous goods on board.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "Under standard Minimum Equipment List (MEL) repair interval categories, within what maximum timeframe must a Category B inoperative item be repaired and returned to service?",
      options: [
        "Within 3 consecutive calendar days (72 hours)",
        "Within 120 consecutive calendar days",
        "Within 10 years",
        "Never (permanent deferral)"
      ],
      correct_option_index: 0,
      explanation: "Category B MEL deferrals must be rectified and closed out within 3 consecutive calendar days (72 hours).",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "Under the international Freedoms of the Air, what commercial right is granted by the 'Fifth Freedom' of the Air?",
      options: [
        "The right to fly over a country without landing",
        "The right to land for maintenance only",
        "The right to fly only within one's home state",
        "The right to carry revenue passengers/cargo between two foreign countries on a flight that originates or terminates in the airline's home territory"
      ],
      correct_option_index: 3,
      explanation: "The 5th Freedom authorizes an airline to board and deplane revenue traffic between two foreign nations on a flight connected to its home nation (e.g. Dubai to NY via Milan).",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "Under FAA 14 CFR Part 25 emergency evacuation standards (25.803), what requirement must a commercial transport aircraft design satisfy during full-scale certification demonstration?",
      options: [
        "Evacuate the aircraft within 10 minutes with all doors open",
        "Evacuate maximum passenger seating capacity within 90 seconds in complete darkness with 50% of available emergency exits blocked",
        "Provide a parachute for every passenger",
        "Evacuate through the cockpit windows only"
      ],
      correct_option_index: 1,
      explanation: "14 CFR 25.803 mandates full-capacity evacuation in <= 90 seconds under simulated nighttime darkness with half the emergency exits deliberately disabled.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "Under ICAO Annex 13 (Aircraft Accident and Incident Investigation), what is the foundational governing principle of technical safety investigations?",
      options: [
        "The sole objective is the prevention of accidents and incidents; it is not the purpose of the activity to apportion blame or liability",
        "To maximize financial fines on the airline",
        "To provide evidence for criminal prosecution",
        "To publish pilot medical records publicly"
      ],
      correct_option_index: 0,
      explanation: "ICAO Annex 13 explicitly establishes that accident investigations are strictly non-punitive technical safety inquiries designed solely to prevent recurrence.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What is the legal relationship between a manufacturer's Master Minimum Equipment List (MMEL) and an airline's operational Minimum Equipment List (MEL)?",
      options: [
        "The airline MEL can be less restrictive than the MMEL",
        "The MMEL is only used for military aircraft",
        "The airline MEL is customized by the operator and approved by the FAA; it can be more restrictive than the MMEL, but can NEVER be less restrictive than the MMEL",
        "The two documents are completely unrelated"
      ],
      correct_option_index: 2,
      explanation: "An operator's FAA-approved MEL must be at least as restrictive as the manufacturer's MMEL; it may add operational constraints but cannot permit unapproved deferrals.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What regulatory certificate approves a major engineering alteration to an existing type-certified aircraft design, such as adding blended winglets or a cargo door conversion?",
      options: [
        "Student Pilot Certificate",
        "Airframe Scrap Certificate",
        "Noise Level Certificate",
        "Supplemental Type Certificate (STC)"
      ],
      correct_option_index: 3,
      explanation: "A Supplemental Type Certificate (STC) is the FAA/EASA approved authorization required for major modifications to an existing type-certified aircraft model.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "Under 14 CFR Part 121 commercial airline dispatch regulations, who shares Joint Operational Control and legal co-responsibility for authorizing the departure of a scheduled flight?",
      options: [
        "The Gate Agent and the Flight Attendant",
        "The Pilot-in-Command (PIC) and the FAA-certificated Aircraft Dispatcher",
        "The Airport Police Chief and the Fuel Truck Driver",
        "The FAA Administrator and the Airline CEO"
      ],
      correct_option_index: 1,
      explanation: "Part 121 mandates Joint Operational Control: the Captain (PIC) and the FAA-certificated Aircraft Dispatcher must both agree and sign the dispatch release before takeoff.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In global aviation hazardous materials classification (ICAO Doc 9284 / IATA DGR), which UN Hazard Class encompasses Lithium-Ion Batteries (UN 3480 / UN 3481) and Dry Ice (UN 1845)?",
      options: [
        "Class 1 (Explosives)",
        "Class 3 (Flammable Liquids)",
        "Class 9 (Miscellaneous Dangerous Goods)",
        "Class 7 (Radioactive Materials)"
      ],
      correct_option_index: 2,
      explanation: "Class 9 covers Miscellaneous Dangerous Goods, including lithium batteries, dry ice, magnetized materials, and environmentally hazardous substances.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "Under an approved airline MEL, what is the mandatory operational difference between an item marked with an '(M)' symbol versus an item marked with an '(O)' symbol?",
      options: [
        "An '(M)' procedure requires a certified maintenance technician to perform specific deactivation/placarding tasks; an '(O)' procedure requires the flight crew to execute specific operational pilot procedures",
        "'(M)' means mandatory; '(O)' means optional",
        "'(M)' is for morning flights; '(O)' is for overnight flights",
        "'(M)' applies only to military aircraft"
      ],
      correct_option_index: 0,
      explanation: "(M) procedures require qualified maintenance action (e.g. pulling/collaring circuit breakers), while (O) procedures dictate specific flight crew operating techniques.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "What is ETOPS / EDTO certification, and what operational freedom does it grant to twin-engine commercial transport airliners?",
      options: [
        "It allows aircraft to fly without navigation radios",
        "It permits flights without flight attendants",
        "It allows aircraft to fly in supersonic mode",
        "It authorizes twin-engine aircraft to fly long-range oceanic routes where the single-engine flying time to an adequate alternate airport exceeds 60 minutes (e.g. ETOPS 180, 240, or 370 minutes)"
      ],
      correct_option_index: 3,
      explanation: "ETOPS (Extended-range Twin-engine Operational Performance Standards) certifies twin-engine jets to fly over-water routes more than 60 minutes single-engine cruise from an alternate airport.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "What legal document serves as the authorized airworthiness release (Return to Service) for a newly overhauled or repaired aeronautical component under FAA 14 CFR Part 145 and EASA Part-145 regulations?",
      options: [
        "A handwritten post-it note",
        "FAA Form 8130-3 (Airworthiness Approval Tag) / EASA Form 1 (Authorized Release Certificate)",
        "The pilot's personal logbook",
        "The airline's quarterly financial earnings report"
      ],
      correct_option_index: 1,
      explanation: "FAA Form 8130-3 and EASA Form 1 are the official government-recognized Authorized Release Certificates certifying a component has been overhauled in accordance with approved data.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #20.");
  console.log("Skill #20 update completed successfully!");
}

run();
