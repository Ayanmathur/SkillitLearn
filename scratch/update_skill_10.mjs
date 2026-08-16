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

const skillId = "5ca439e2-8108-4096-ac7c-94d613e380c4";

async function run() {
  console.log("Updating Skill #10: Site Safety Management (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: OSHA Regulations, Focus Four Hazards and Industrial Hygiene" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Fall Protection, Scaffolding and Trenching Safety" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Crane Operations, Confined Spaces and Environmental Management" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "OSHA Statutory Framework, Multi-Employer Policy and Safety Culture",
      order_index: 1,
      content: `### Legal Foundations of Construction Safety (29 CFR 1926)

Federal worker safety governance in the United States is established by the Occupational Safety and Health Act of 1970 and codified in Title 29 of the Code of Federal Regulations, Part 1926 (Safety and Health Regulations for Construction):

1. The General Duty Clause (Section 5(a)(1)):
   - Mandates that every employer shall furnish to each of his employees employment and a place of employment which are free from recognized hazards that are causing or are likely to cause death or serious physical harm.
   - Invoked by OSHA compliance officers whenever a severe, recognized hazard exists for which no specific codified subpart standard yet applies.

2. OSHA Multi-Employer Worksite Policy (CPL 02-00-124):
   - On complex construction projects involving multiple subcontractors, OSHA classifies employer responsibility across four distinct legal categories:
     - Creating Employer: The entity that physically created the hazardous condition.
     - Exposing Employer: The employer whose own workers are exposed to the hazard.
     - Correcting Employer: The contractor responsible for repairing or erecting safety systems (e.g. guardrail installer).
     - Controlling Employer: The General Contractor (GC) or Construction Manager (CM) who holds broad supervisory authority over the entire job site, legally liable for safety violations under their oversight.

3. Quantitative Safety Performance Metrics:
   - Total Recordable Incident Rate (TRIR): Standardized annual injury rate per 100 full-time workers (\`TRIR = (Total Recordable Injuries * 200,000) / Total Employee Work Hours\`).
   - Days Away, Restricted, or Transferred (DART) Rate.
   - Experience Modification Rating (EMR): Insurance underwriting benchmark (1.0 is industry average; < 0.85 signifies elite safety performance, lowering workers' compensation insurance premiums).`
    },
    {
      track_id: track1Id,
      title: "The OSHA Construction Focus Four Hazards",
      order_index: 2,
      content: `### The Leading Causes of Construction Fatalities

OSHA identifies the Focus Four Hazards as responsible for over 85% of catastrophic injuries and fatalities in the construction industry:

1. Fall Hazards (Subpart M):
   - The number one cause of construction fatalities (> 35%). Unprotected leading edges, open floor holes, scaffold collapses, and ladder slips.
2. Caught-In / Between Hazards:
   - Cave-ins of unshored trenches, workers pinned between moving heavy machinery (excavators, loaders) and fixed structures, rotating machine shafts, unguarded PTO drivelines, and swinging crane counterweights.
3. Struck-By Hazards:
   - Flying objects from powder-actuated nailers, falling tools and concrete spalls dropped from elevated work decks, swung crane loads, and traffic collisions within highway work zones.
4. Electrocution Hazards (Subpart K):
   - Direct contact with overhead high-voltage transmission lines (mandatory minimum clearance of 10 feet for lines up to 50 kV, plus 0.4 inches for every 1 kV above 50 kV).
   - Defective electrical tools and non-grounded circuits.
   - Mandatory Electrical Protection: Job sites must utilize Ground Fault Circuit Interrupters (GFCI) on all 120V 15A/20A temporary branch circuits, or implement a written, tested Assured Equipment Grounding Conductor Program (AEGCP).
   - Lockout / Tagout (LOTO, 29 CFR 1926.417): Physical lockout devices and danger tags securing all energy isolating switches in the zero-energy state prior to servicing equipment.`
    },
    {
      track_id: track1Id,
      title: "Industrial Hygiene, Silica Dust and Chemical Safety Standards",
      order_index: 3,
      content: `### Industrial Hygiene and The Hierarchy of Controls

Worker health protection is structured around the ANSI/ASSP Z590.3 Hierarchy of Controls:
1. Elimination: Physically removing the hazard from the design.
2. Substitution: Replacing hazardous chemicals with non-toxic alternatives.
3. Engineering Controls: Local exhaust ventilation, wet dust suppression, and mechanical isolation.
4. Administrative Controls: Worker job rotation, shift scheduling, and standard operating procedures.
5. Personal Protective Equipment (PPE): The final, least reliable line of defense.

### Respirable Crystalline Silica Standard (29 CFR 1926.1153)

Cutting, grinding, and drilling concrete, brick, and stone generates microscopic respirable crystalline silica (quartz dust) particles (< 10 microns) that penetrate deep into lung alveoli, causing incurable silicosis and lung cancer:
- Permissible Exposure Limit (PEL): 50 micro-grams per cubic meter of air (50 ug/m3) averaged over an 8-hour Time-Weighted Average (TWA).
- Action Level: 25 ug/m3.
- OSHA Table 1 Compliance: Mandates specific engineering controls for 18 common construction tasks:
  - Handheld concrete saws: Integrated continuous water feed delivering water directly to the cutting blade.
  - Tuckpointing grinders: Dust collection shroud connected to a HEPA vacuum system providing 25 CFM per inch of wheel diameter, equipped with a filter cleaning mechanism (99.97% efficiency at 0.3 microns).

### Hazard Communication Standard (GHS / HazCom 29 CFR 1926.59)

- Standardized Safety Data Sheets (SDS): 16-section globally harmonized format detailing chemical composition, toxicological thresholds, flash points, and emergency spill procedures.
- Chemical Container Labeling: Standardized GHS hazard pictograms (flame, skull, health hazard), signal words (DANGER vs WARNING), and precautionary statements.
- Hearing Conservation Standard: OSHA 8-hour TWA Action Level of 85 dBA; mandatory hearing protection at or above 90 dBA with a 5 dBA exchange rate.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Personal Fall Arrest Systems (PFAS) and Clearance Mathematics",
      order_index: 1,
      content: `### Fall Protection Governance (29 CFR 1926 Subpart M)

In general construction, fall protection is legally mandated when employees are exposed to a fall hazard of 6 feet (1.8 meters) or greater to a lower level:

### Components of a Personal Fall Arrest System (PFAS - ANSI/ASSP Z359)

1. Full-Body Harness (ANSI Z359.11): Distributes impact arresting forces across the thighs, pelvis, chest, and shoulders. The dorsal D-ring must remain centered between the shoulder blades.
2. Energy-Absorbing Lanyard / Self-Retracting Lifeline (SRL):
   - Energy Absorber: Deploys an internal tearing textile pack that limits maximum arresting force (MAF) on the human body to 1,800 lbs (8.0 kN). Maximum allowable deceleration expansion is 42 inches (3.5 feet).
3. Structural Anchorage Connector:
   - Mandatory structural capacity: Must support at least 5,000 lbs (22.2 kN) per attached worker, or be designed by a Qualified Person as part of a complete engineered fall arrest system maintaining a safety factor of 2.0.

### Total Required Fall Clearance (TRFC) Calculation

Failing to calculate fall clearance leads to workers striking the ground or lower obstruction before their energy absorber fully decelerates:

\`\`\`
TRFC = Lanyard Length + Deceleration Distance + Harness Stretch & Worker Height + Safety Margin Factor
\`\`\`

- Calculation Example:
  - Standard 6.0-foot Lanyard: 6.0 ft
  - Max Energy Absorber Deceleration: 3.5 ft
  - Harness Stretch and Worker Height (D-ring to feet): 6.0 ft
  - Safety Factor Buffer: 3.0 ft
  - Total Required Fall Clearance = 6.0 + 3.5 + 6.0 + 3.0 = 18.5 feet (5.64 meters) below the anchorage point.

### Guardrail Systems and Hole Covers

- Guardrails: Top rail height at 42 inches (+/- 3 inches) supporting a minimum 200 lb outward/downward force; Mid-rail at 21 inches supporting 150 lbs; Toeboard minimum 3.5 inches height supporting 50 lbs to prevent tools from falling.
- Floor Hole Covers: Must support at least twice the maximum intended load of workers, equipment, and materials, secured against accidental displacement, and painted with the word 'HOLE' or 'COVER'.`
    },
    {
      track_id: track2Id,
      title: "Scaffolding Mechanics, Erection Protocols and Inspection",
      order_index: 2,
      content: `### Scaffolding Engineering and Standards (29 CFR 1926 Subpart L)

Scaffolds provide temporary elevated work platforms for masonry, plastering, and curtain wall installation.

### Structural Safety Factors and Capacities

- Supported Scaffolds: Must be capable of supporting their own weight and at least 4 times the maximum intended working load (4:1 Safety Factor).
- Suspension Scaffolds (Two-Point Swing Stages): Suspension wire ropes and hardware must support at least 6 times the maximum intended load (6:1 Safety Factor).
- Planking Standards: Scaffold-grade solid sawn lumber (2x10 nominal grade) or manufactured aluminum/plywood platforms. Planks must overlap supports by a minimum of 6 inches and a maximum of 12 inches unless cleated. The platform must be fully planked with gaps between planks not exceeding 1 inch.

### Stability, Base Support and Wall Tie-Ins

- Base Support: Supported scaffold legs must bear on steel base plates resting on solid wood mudsills (minimum 2x10 lumber) to distribute concentrated leg loads across subsoil.
- Height-to-Base Ratio and Tie-Ins:
  - When the height of a supported scaffold exceeds 4 times its minimum base dimension (4:1 Ratio), the scaffold must be restrained against tipping by installing wall ties, guys, or outrigger brackets.
  - Vertical Tie Spacing: Every 20 feet vertical for scaffolds 3 feet wide or less; every 26 feet vertical for scaffolds wider than 3 feet.
  - Horizontal Tie Spacing: At both ends and not exceeding 30 feet intervals horizontally.

### The Role of the Scaffolding Competent Person

OSHA strictly mandates that all scaffolds must be erected, moved, dismantled, or altered only under the direct supervision of an OSHA Competent Person:
- Pre-Shift Inspection: The Competent Person must conduct a thorough physical inspection before every work shift.
- Inspection Tagging: Green Tag (Safe for Use), Yellow Tag (Modified / Specific Restraints Required), Red Tag (DANGER - Do Not Use).`
    },
    {
      track_id: track2Id,
      title: "Excavation, Trenching Mechanics and Soil Mechanics",
      order_index: 3,
      content: `### Soil Mechanics and Trenching Safety (29 CFR 1926 Subpart P)

Trench cave-ins occur instantaneously; one cubic yard of soil weighs approximately 2,700 to 3,000 lbs (1.3 to 1.5 metric tons), crushing human chest cavities instantly.

### Mandatory Protection Thresholds

- Any excavation or trench 5 feet (1.5 meters) or deeper must have an approved protective system (sloping, benching, shoring, or trench shielding).
- In unstable soil, protection is mandatory regardless of trench depth if the Competent Person identifies cave-in potential.

### OSHA Soil Classification Hierarchy

1. Solid Rock: Natural solid mineral matter that can be excavated with vertical walls.
2. Type A Soil: Cohesive soils with an unconfined compressive strength of 1.5 tons per square foot (tsf / 144 kPa) or greater (dense clay, silty clay). Never classified as Type A if fissured, subjected to vibration, or previously disturbed.
3. Type B Soil: Cohesive soils with strength between 0.5 and 1.5 tsf (silt, angular gravel, loam), or previously disturbed soils.
4. Type C Soil: Cohesive soils with strength <= 0.5 tsf, granular soils (sand, gravel), submerged soil, or soil with freely seeping water.

### Engineering Protective Systems

1. Sloping and Benching:
   - Type A: Maximum allowable slope is 3/4:1 (53 degrees from horizontal).
   - Type B: Maximum allowable slope is 1:1 (45 degrees).
   - Type C: Maximum allowable slope is 1-1/2:1 (34 degrees). Benching is strictly prohibited in Type C soils.
2. Aluminum Hydraulic Shoring: Pressurized hydraulic cylinders apply continuous horizontal pre-load force against trench walls to prevent soil movement.
3. Trench Boxes (Shields): Steel or aluminum protective shields designed to withstand soil lateral pressure. Trench boxes must extend at least 18 inches above the surrounding ground when the trench is sloped above the box.

### Trench Access and Atmospheric Safety

- Ingress / Egress: Trenches 4 feet (1.22 m) or deeper require ladders, stairways, or ramps located so that workers do not travel more than 25 feet laterally to exit. Ladders must extend 3 feet (0.91 m) above the trench lip.
- Spoil Pile Setback: Excavated soil spoil piles and heavy machinery must be kept a minimum of 2 feet (0.61 m) back from the edge of the trench.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Crane Operations, Rigging Engineering and Heavy Lifting",
      order_index: 1,
      content: `### Crane Safety Standards (29 CFR 1926 Subpart CC)

Lifting thousands of pounds of structural steel and precast panels requires strict mechanical and geotechnical coordination:

### Crane Setup and Ground Bearing Pressure (GBP)

- Ground Condition Verification: The controlling contractor must verify in writing that subsurface ground conditions (soil compaction, proximity to underground vaults or sewer pipes) can support crane operational loads.
- Outrigger Mat Sizing: Crane outriggers concentrate massive point loads during swinging operations. Outrigger reaction forces must be calculated and distributed across engineered timber or composite crane mats:
\`\`\`
GBP = Peak Outrigger Force / Outrigger Mat Surface Area <= Allowable Soil Bearing Capacity
\`\`\`

### Crane Load Charts and Net Lifting Capacity

- Load Chart Interpretation: Lifting capacity varies continuously based on boom length, boom operating angle, and operating radius (distance from crane center of rotation to hook load).
- Gross vs Net Capacity: Net lifting capacity is calculated by deducting the weight of all attachments from the gross chart capacity:
\`\`\`
Net Capacity = Gross Chart Capacity - (Hook Block Weight + Rigging Slings + Headache Ball + Wire Rope Deduction)
\`\`\`

### Rigging Engineering and Sling Tension Mathematics

- Sling Angle Tension Factor: The angle between the sling leg and the horizontal load drastically alters tensile force:
\`\`\`
Tension per Sling Leg = (Total Load Weight / Number of Legs) * [1 / sin(Horizontal Angle)]
\`\`\`
- Critical Safety Rule: Rigging sling angles less than 30 degrees from horizontal are strictly prohibited because sling tension approaches infinity as the angle flattens.
- Hardware Inspection: Slings, shackles, and hoist rings must display legible manufacturer rated capacity tags. Any sling showing kinked wire rope, cut synthetic webbing, or stretched chain links must be removed from service immediately.`
    },
    {
      track_id: track3Id,
      title: "Confined Spaces in Construction and Hot Work Protocols",
      order_index: 2,
      content: `### Confined Space Safety Governance (29 CFR 1926 Subpart AA)

Construction confined spaces (manholes, storm sewers, storage tanks, bored caissons, precast box culverts) present severe atmospheric toxicity, oxygen deficiency, and engulfment hazards.

### Confined Space Classification

1. Confined Space:
   - Large enough for an employee to bodily enter and perform work.
   - Has limited or restricted means for entry or exit.
   - Is not designed for continuous employee occupancy.
2. Permit-Required Confined Space (PRCS):
   - Meets confined space criteria and contains one or more recognized hazards: potential hazardous atmosphere (toxic, flammable, or oxygen deficient), engulfment hazard (grain, sand, water), converging walls, or exposed electrical/mechanical hazards.

### PRCS Mandatory Entry Protocol

- Entry Permit System: A written, signed permit issued by the Entry Supervisor authorizing entry for a specific task duration.
- Continuous 4-Gas Atmospheric Testing (Tested in exact vertical sequence: 1. Oxygen content, 2. Flammable gases/vapors, 3. Carbon monoxide, 4. Hydrogen sulfide):
  - Oxygen: Must remain between 19.5% and 23.5%.
  - Combustible Gases (LEL): Must not exceed 10% of the Lower Explosive Limit.
  - Carbon Monoxide (CO): PEL is 50 PPM.
  - Hydrogen Sulfide (H2S): PEL is 20 PPM.
- Roles: Entry Supervisor, Dedicated Attendant (stationed outside continuously, never enters), and Authorized Entrants.
- Non-Entry Rescue Equipment: Mechanical retrieval tripod winch connected to entrant full-body harness for emergency extraction without risking rescuer lives.

### Hot Work Safety Protocols (Subpart F & NFPA 51B)

- Hot Work Permit: Mandatory prior to welding, cutting, grinding, or open-flame torch work.
- The 35-Foot Rule: All combustible materials within a 35-foot (10.7 m) radius must be removed or shielded with fire-retardant welding blankets.
- Mandatory Fire Watch: Dedicated fire watch personnel with a fully charged fire extinguisher must remain on duty during hot work and for a minimum of 30 to 60 minutes after hot work completes to detect smoldering embers.`
    },
    {
      track_id: track3Id,
      title: "Emergency Action Plans, Environmental Compliance and SWPPP",
      order_index: 3,
      content: `### Construction Site Emergency Management (29 CFR 1926.35)

Every construction job site must maintain a comprehensive written Emergency Action Plan (EAP):
- Primary and Secondary Evacuation Routes and designated assembly muster points.
- Medical Emergency Protocol: Emergency telephone contacts, on-site certified First Aid/CPR responders, emergency eyewash stations, and automated external defibrillators (AEDs).
- Severe Weather Protocols: High wind crane shutdown thresholds (typically 20 to 30 MPH) and the Lightning 30-30 Rule (halt outdoor operations if thunder is heard within 30 seconds of lightning flash; wait 30 minutes after last thunder before resuming).

### Stormwater Pollution Prevention Plans (SWPPP / EPA NPDES Permit)

Under the federal Clean Water Act and EPA National Pollutant Discharge Elimination System (NPDES) Construction General Permit, any construction project that disturbs 1.0 or more acres of land must implement an active SWPPP:

### Best Management Practices (BMPs)

1. Sediment and Erosion Control BMPs:
   - Silt Fencing: Geotextile fabric fences trenched 6 inches into soil with wire backing, intercepting sediment-laden sheet runoff.
   - Stabilized Construction Entrances (Anti-Tracking Pads): 50-foot long pads of 2 to 3-inch crushed angular stone that knock mud from truck tires before entering public roadways.
   - Inlet Protection: Filter fabric and gravel rings around storm drain inlets to prevent sediment entering municipal storm sewers.
2. Chemical and Concrete Pollution Prevention:
   - Dedicated Concrete Washout Basins: Lined, watertight impoundments preventing high-pH caustic concrete slurry (pH 12 to 13) from leaching into groundwater.
   - Spill Prevention, Control, and Countermeasure (SPCC): Secondary containment dikes for diesel fuel tanks and hydraulic oil storage.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #10.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "At what fall height threshold is fall protection legally mandated by OSHA 29 CFR 1926 Subpart M for general construction operations?",
      options: [
        "6 feet (1.8 meters) above lower levels",
        "20 feet (6.1 meters)",
        "2 feet (0.6 meters)",
        "12 feet (3.6 meters)"
      ],
      correct_option_index: 0,
      explanation: "OSHA Subpart M requires fall protection (guardrails, safety nets, or personal fall arrest systems) whenever employees work 6 feet or higher above a lower level.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What OSHA standard clause (Section 5(a)(1)) mandates that employers must furnish a workplace free from recognized hazards causing or likely to cause death or serious physical harm?",
      options: [
        "The Commerce Clause",
        "The Equal Protection Clause",
        "The General Duty Clause",
        "The Subpart Z Standard"
      ],
      correct_option_index: 2,
      explanation: "The General Duty Clause of the OSH Act of 1970 requires employers to maintain a safe working environment free of recognized hazards even where specific regulations are absent.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What minimum structural capacity is legally required for an anchorage connector point supporting a single worker personal fall arrest system (PFAS)?",
      options: [
        "1,000 lbs (4.4 kN)",
        "5,000 lbs (22.2 kN) per attached worker, or engineered with a safety factor of 2.0",
        "500 lbs (2.2 kN)",
        "2,500 lbs (11.1 kN)"
      ],
      correct_option_index: 1,
      explanation: "OSHA 1926.502(d)(15) mandates that anchorages used for PFAS must support at least 5,000 lbs (22.2 kN) per attached employee or be engineered with a 2.0 safety factor.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "At what trench excavation depth does OSHA 29 CFR 1926 Subpart P mandate that an approved protective system (sloping, shoring, or shielding) must be installed?",
      options: [
        "10 feet (3.0 meters)",
        "2 feet (0.6 meters)",
        "8 feet (2.4 meters)",
        "5 feet (1.5 meters) or deeper"
      ],
      correct_option_index: 3,
      explanation: "OSHA Subpart P requires protective systems for all excavations 5 feet or deeper, or less if a Competent Person identifies cave-in hazards.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "Under the ANSI/ASSP Z590.3 Hierarchy of Controls, which method is the most effective at protecting workers from physical hazards?",
      options: [
        "Elimination (physically removing the hazard from the workplace)",
        "Personal Protective Equipment (PPE)",
        "Administrative Controls (worker rotation)",
        "Warning Signs and Posters"
      ],
      correct_option_index: 0,
      explanation: "Elimination physically removes the hazard from the work environment, making it the most effective control tier; PPE is the least effective last line of defense.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "Under the OSHA Multi-Employer Worksite Policy, what classification is given to the General Contractor who possesses broad supervisory authority over the entire job site?",
      options: [
        "Exposing Employer",
        "Creating Employer",
        "Correcting Employer",
        "Controlling Employer"
      ],
      correct_option_index: 3,
      explanation: "The Controlling Employer (typically the General Contractor or Construction Manager) holds overall authority over safety and health compliance across the entire multi-employer project.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "What is the maximum allowable slope angle required by OSHA when sloping a trench in cohesive Type A soil?",
      options: [
        "1-1/2:1 (34 degrees)",
        "3/4:1 (53 degrees from horizontal)",
        "2:1 (26 degrees)",
        "Vertical (90 degrees)"
      ],
      correct_option_index: 1,
      explanation: "OSHA Appendix B to Subpart P specifies that Type A soil permits a maximum slope of 3/4:1 (53 degrees from horizontal), whereas Type B is 1:1 and Type C is 1-1/2:1.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In industrial hygiene, what is the OSHA Permissible Exposure Limit (PEL) for Respirable Crystalline Silica dust averaged over an 8-hour Time-Weighted Average (TWA)?",
      options: [
        "50 micro-grams per cubic meter of air (50 ug/m3)",
        "500 micro-grams per cubic meter of air",
        "5 milli-grams per cubic meter of air",
        "Zero allowable exposure"
      ],
      correct_option_index: 0,
      explanation: "29 CFR 1926.1153 establishes a PEL of 50 ug/m3 for respirable crystalline silica dust over an 8-hour TWA, with an Action Level of 25 ug/m3.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In Permit-Required Confined Space (PRCS) safety, what is the mandatory acceptable range for atmospheric oxygen concentration prior to worker entry?",
      options: [
        "10.0% to 15.0%",
        "25.0% to 30.0%",
        "19.5% to 23.5% oxygen by volume",
        "Exactly 50.0%"
      ],
      correct_option_index: 2,
      explanation: "OSHA 1926 Subpart AA mandates that oxygen levels in confined spaces must remain between 19.5% (oxygen deficient) and 23.5% (oxygen enriched fire hazard).",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "Under OSHA scaffolding standards (29 CFR 1926 Subpart L), what is the minimum required safety factor for supported scaffolding structures?",
      options: [
        "1:1 Safety Factor",
        "2:1 Safety Factor",
        "10:1 Safety Factor",
        "4:1 Safety Factor (must support its own weight plus at least 4 times the maximum intended load)"
      ],
      correct_option_index: 3,
      explanation: "Supported scaffolds must be engineered with a 4:1 safety factor against maximum intended design loads, whereas suspension rope systems require a 6:1 factor.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "A safety engineer is calculating Total Required Fall Clearance (TRFC) for a worker using a 6.0-foot energy-absorbing lanyard attached to an overhead beam anchor. The lanyard has a maximum deceleration deployment of 3.5 feet, the worker's D-ring height plus harness stretch is 6.0 feet, and site policy mandates a 3.0-foot safety buffer. What is the minimum required fall clearance distance below the anchor?",
      options: [
        "12.0 feet",
        "18.5 feet (6.0 ft lanyard + 3.5 ft deceleration + 6.0 ft worker/stretch + 3.0 ft buffer = 18.5 ft)",
        "25.0 feet",
        "14.5 feet"
      ],
      correct_option_index: 1,
      explanation: "TRFC = Lanyard (6.0) + Deceleration (3.5) + Harness stretch/height (6.0) + Buffer (3.0) = 18.5 feet (5.64 meters) required clearance below the anchorage point.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "A crane is lifting a 10,000 lb precast concrete panel using a two-leg bridal wire rope sling. If the horizontal sling angle is rigged at 30 degrees from horizontal, what is the calculated tension force in EACH individual sling leg?",
      options: [
        "5,000 lbs",
        "2,500 lbs",
        "10,000 lbs (Tension = (10,000 / 2) / sin(30 deg) = 5,000 / 0.5 = 10,000 lbs per leg)",
        "20,000 lbs"
      ],
      correct_option_index: 2,
      explanation: "Tension = (Load / Legs) / sin(theta) = (10,000 / 2) / sin(30 deg) = 5,000 / 0.50 = 10,000 lbs in each leg. At 30 degrees, each sling leg carries 100% of the total load weight.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "Under OSHA 29 CFR 1926 Subpart F and NFPA 51B hot work standards, what is the '35-Foot Rule' regarding combustible fire hazards during welding and torch cutting?",
      options: [
        "All combustible materials within a 35-foot radius of the hot work operation must be relocated, or protected with fire-resistive welding blankets/shields",
        "Welding leads must never exceed 35 feet in length",
        "Workers must maintain a 35-foot distance from welding arcs",
        "Fire extinguishers must be rated for 35 gallons of water"
      ],
      correct_option_index: 0,
      explanation: "The 35-foot rule mandates that all combustible materials within a 35-foot (10.7 m) radius of hot work must be removed or shielded with fire-retardant blankets, accompanied by a fire watch.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "Under the EPA National Pollutant Discharge Elimination System (NPDES) Stormwater Construction General Permit, at what land disturbance threshold is a site legally required to implement an active SWPPP?",
      options: [
        "10.0 or more acres",
        "5.0 or more acres",
        "0.1 acres",
        "1.0 or more acres of total soil disturbance (or part of a common plan of development)"
      ],
      correct_option_index: 3,
      explanation: "The EPA Construction General Permit (CGP) mandates a comprehensive Stormwater Pollution Prevention Plan (SWPPP) for all construction activities disturbing 1.0 or more acres of land.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "Under OSHA 29 CFR 1926 Subpart P, what is the maximum lateral travel distance permitted for a worker in an excavation 4 feet or deeper to reach an egress ladder or ramp?",
      options: [
        "50 feet (15.2 meters)",
        "25 feet (7.6 meters)",
        "100 feet (30.5 meters)",
        "10 feet (3.0 meters)"
      ],
      correct_option_index: 1,
      explanation: "OSHA 1926.651(c)(2) requires that ladders, stairs, or ramps in trenches 4 feet or deeper must be located so that workers do not travel more than 25 feet laterally.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #10.");
  console.log("Skill #10 update completed successfully!");
}

run();
