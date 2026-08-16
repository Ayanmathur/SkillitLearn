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

const skillId = "d5ef0038-07a7-41c5-bf4f-57bea6572911";

async function run() {
  console.log("Updating Skill #41: Event & Service Coordination (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Banquet Event Orders (BEOs), Spatial Geometry and Capacity Math" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Banquet Service Execution, Run-of-Show and Beverage Controls" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: AV Staging Production, Vendor Logistics and Crisis Management" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / CMP Event Management level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Banquet Event Order (BEO) as the Master Operational Contract",
      order_index: 1,
      content: `### Architecture and Anatomy of the Banquet Event Order

The Banquet Event Order (BEO) is the definitive operational blueprint binding the event organizer, banquet operations, culinary kitchen, and audiovisual engineering:

1. Essential Structural Sections of a Master BEO:
   - Header Metadata: Account name, on-site contact, booking ID, event date, assigned room, guaranteed guest count vs expected count vs set count.
   - Chronological Production Schedule: Exact timestamped milestones (Vendor load-in, registration open, cocktail hour, ballroom doors open, salad drop, entree fire, speeches, dessert service, teardown).
   - Culinary and Dietary Specifications: Detailed itemized menus, wine pairings, and explicit counts for special dietary requirements (gluten-free, vegan, kosher, severe peanut allergies).
   - Setup and Room Configuration: Linen colors, chair type, riser dimensions, dance floor size (calculated at 3 square feet per dancing guest for 30% to 50% peak attendance).
   - Electrical and Audiovisual: Microphone counts, projection screen lumens, dedicated power circuits.`
    },
    {
      track_id: track1Id,
      title: "Spatial Geometry: Room Configurations and Life-Safety Egress",
      order_index: 2,
      content: `### Ballroom Spatial Calculations and Fire Life-Safety Compliance

1. Standard Floor Plan Configurations and Spatial Allocations:
   - Banquet Rounds (60-inch rounds seat 8; 72-inch rounds seat 10 to 12): Requires 12 to 14 square feet per person.
   - Crescent Rounds (Cabaret Seating): Seating only on the outer arc facing the stage with no backs to the presenter; requires 15 square feet per person.
   - Classroom Style (6-foot x 18-inch tables): Requires 18 to 20 square feet per person.
   - Theater Style (Chairs aligned in straight rows): Requires 9 to 10 square feet per person.
   - Hollow Square / U-Shape (Executive Boardroom): Requires 30 to 35 square feet per person.

2. Life Safety and Egress Regulations (NFPA 101 Life Safety Code):
   - Mandatory minimum 6-foot primary perimeter egress aisles.
   - Minimum 36 inches of clear service space between table chair backs.
   - Emergency exit doors must remain completely unobstructed by pipe-and-drape or staging at all times.`
    },
    {
      track_id: track1Id,
      title: "Contractual Attrition, Guarantees and The Overset Policy",
      order_index: 3,
      content: `### Managing Event Capacity and Contractual Attrition

1. The 72-Hour Final Guarantee:
   - The event client must submit a binding final guest count 72 hours prior to the event. This number establishes the minimum billing threshold and kitchen raw food purchasing.

2. The Standard Overset Policy (3% to 5% Overset):
   - Banquet operations physically sets tables and preps food for 3% to 5% above the final guaranteed count:
     - For a 500-guest guarantee with a 5% overset, the room is set with 525 seats, and the kitchen prepares 515 to 525 plated meals.
     - Protects the host against unexpected walk-in attendees without delaying dinner service.

3. Contractual Attrition Clauses:
   - Sliding-scale financial damages charged when an organization fails to utilize contracted guest room blocks or food and beverage minimum spend (typically allowing 15% to 20% slippage before penalties apply).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Classical Banquet Service Styles: American, French and Stations",
      order_index: 1,
      content: `### Taxonomy of Banquet Dining and Service Execution

Selecting the appropriate service style dictates banquet staffing ratios and operational speed:

1. The Primary Service Styles:
   - American Plated Service: Meals pre-plated in the banquet kitchen. Served from the guest's right with the server's right hand; beverages served from the right; bread and butter served from the left; cleared from the right. Standard staffing: 1 server per 20 to 30 guests.
   - Synchronized French Banquet Service (White Glove): Teams of synchronized servers surround round tables simultaneously, lifting heated cloches in unison on the Captain's signal. Staffing: 1 server per 10 to 12 guests.
   - Russian Service (Platter Service): Food carved and arranged on heavy silver platters, presented from the guest's left and served directly onto plates with spoon and fork.
   - Interactive Action Stations: Live chef-attended stations (carving prime rib, pasta flambe, nitrogen ice cream).`
    },
    {
      track_id: track2Id,
      title: "Master Run-of-Show: Minute-by-Minute Cue Sheets and Captain Cues",
      order_index: 2,
      content: `### Precision Event Choreography and Kitchen Communication

1. The Master Run-of-Show (ROS):
   - A minute-by-minute execution matrix aligning the Banquet Captain, Audio-Visual Engineer, Event Planner, and Executive Banquet Chef:
     - 18:30: Doors open; house background music active; lighting preset 1.
     - 18:45: Guests seated; first course pre-set on tables.
     - 19:10: Welcoming remarks; spotlights on podium.
     - 19:18: Banquet Captain calls 'Fire Main Course' to the kitchen pass.
     - 19:30: Synchronized entree drop across all tables.

2. Banquet Captain Communication Protocols:
   - The 'Fire' Call: Notifying the kitchen exactly 12 to 15 minutes before the main course drop, allowing culinary staff to plate hot proteins and sauces at peak temperature without drying out under heat lamps.`
    },
    {
      track_id: track2Id,
      title: "High-Volume Beverage Service: Open Bars, Wine Pours and Controls",
      order_index: 3,
      content: `### High-Volume Banquet Beverage Operations and Bar Controls

1. Bartender Ratios and Speed of Service:
   - Standard Open Bar: 1 bartender per 75 to 100 guests for beer/wine/standard spirits.
   - Premium Craft Cocktail Bar: 1 bartender per 50 guests.

2. Banquet Wine Service Etiquette:
   - Presenting bottle label; pouring from the guest's right without touching the bottle neck to the glass rim.
   - Filling red wine glasses to the widest point of the bowl (approx. 5 ounces) to permit proper aeration; twisting the bottle on completion and wiping with a clean linen service napkin.

3. Beverage Inventory Governance:
   - Pre-event and post-event bottle audits using digital scales to weigh partial liquor bottles, ensuring exact ounce-level reconciliation for consumption-based billing.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Audiovisual Architecture: Staging, Sightlines, DMX and Power",
      order_index: 1,
      content: `### Technical Event Production, Staging and Electrical Infrastructure

1. Sightline Geometry and Projection Engineering:
   - 45-Degree Horizontal Viewing Cones: Ensuring no audience chairs are placed outside the 45-degree angle from the screen edge.
   - Screen Height: The bottom of projection screens must sit at least 5 feet above the ballroom floor so seated guests can view unobstructed over front rows.
   - Projector Lumens: Ballrooms require 6,000 to 12,000 ANSI Lumens to overpower ambient lighting.

2. RF Microphone Coordination:
   - Wireless microphone systems must undergo UHF frequency scanning to avoid interference from local emergency radio and cellular broadcast bands.

3. Heavy Event Power Infrastructure:
   - Dedicated 100A to 400A 3-phase cam-lock electrical disconnects, kept completely isolated from kitchen refrigeration circuits to prevent audio buzzing.`
    },
    {
      track_id: track3Id,
      title: "Vendor Management: Load-In Logistics, COIs and Union Rules",
      order_index: 2,
      content: `### Facility Logistics, Risk Transfer and Labor Compliance

1. Certificates of Insurance (COI):
   - All third-party production vendors, florists, and decorators must submit a valid COI with $1,000,000 to $2,000,000 comprehensive general liability coverage naming the hotel as an additional insured before accessing loading bays.

2. Loading Dock Management:
   - Staggered arrival schedules preventing loading bay congestion; enforcing freight elevator weight capacities and floor protection masonite boarding.

3. Union Labor Jurisdictions (IATSE / Teamsters):
   - Adhering to strict collective bargaining rules regarding which union trades are legally authorized to hang truss rigging, handle electrical tie-ins, or operate AV consoles.`
    },
    {
      track_id: track3Id,
      title: "Event Crisis Management, Evacuation and Medical Response",
      order_index: 3,
      content: `### Emergency Preparedness and Crisis Decision-Making

1. Severe Weather Protocols (The Weather Call):
   - For outdoor ceremonies and receptions, the Banquet Director and Event Planner must make the binding 'Weather Call' at least 4 to 6 hours prior to start time to allow banquet teams to transition physical setups into backup ballrooms.

2. Medical and Life-Safety Response:
   - Banquet Captains must maintain clear knowledge of Automated External Defibrillator (AED) and first aid kit locations.
   - Immediate EMS notification protocol for severe guest injuries or acute anaphylactic allergic reactions.

3. Post-Incident Documentation:
   - Comprehensive factual incident reports logged within 2 hours of any incident, preserving physical evidence and CCTV footage.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #41.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "What master operational document serves as the binding blueprint communicating event timelines, menus, setups, and AV needs across all hotel departments?",
      options: [
        "Banquet Event Order (BEO)",
        "Daily Newspaper",
        "Employee Timecard",
        "Front Desk Registration Card"
      ],
      correct_option_index: 0,
      explanation: "The Banquet Event Order (BEO) is the master document detailing every operational aspect of an event for banquets, culinary, and engineering.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In banquet service execution, what is the standard American Plated service rule for serving and clearing courses?",
      options: [
        "Throw plates across the room",
        "Serve from the left with left hand; clear from the left",
        "Serve food from the guest's right with the right hand; clear plates from the guest's right",
        "Ask guests to walk into the kitchen to pick up food"
      ],
      correct_option_index: 2,
      explanation: "American Plated service dictates serving plated food and beverages from the guest's right with the right hand, and clearing from the right.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In banquet operations, what is an 'Overset Policy' (typically 3% to 5%)?",
      options: [
        "Charging customers 50% extra in secret",
        "Setting physical tables and prepping meals for 3% to 5% above the final guaranteed guest count to comfortably absorb unexpected walk-in attendees",
        "Setting tables in the parking lot",
        "Placing five forks at every seat"
      ],
      correct_option_index: 1,
      explanation: "The overset policy prepares extra seating and meals (3-5% above guarantee) to accommodate surprise attendees smoothly without delays.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What ballroom seating layout arranges chairs in a circle around round tables with NO chairs facing away from the stage so all guests face the speaker?",
      options: [
        "Theater Style",
        "Classroom Style",
        "Hollow Square",
        "Crescent Rounds (Cabaret Seating)"
      ],
      correct_option_index: 3,
      explanation: "Crescent rounds seat guests only along the outer curve of round tables facing the stage, ensuring unobstructed sightlines.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "Why must third-party event vendors (such as florists, decorators, and AV staging companies) submit a Certificate of Insurance (COI) prior to loading into the hotel?",
      options: [
        "To provide legal proof of general liability coverage ($1M-$2M) naming the hotel property as an additional insured to transfer property and injury risk",
        "To prove they have a driver's license",
        "To get free parking",
        "To receive free hotel food"
      ],
      correct_option_index: 0,
      explanation: "COIs protect the venue by transferring financial liability for property damage or physical injuries caused by outside contractors.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In banquet dining, what is 'Synchronized French Banquet Service' (White Glove Service)?",
      options: [
        "Serving fast food from drive-through windows",
        "Guests cooking their own meals at tables",
        "Servers running in circles around the room",
        "Teams of synchronized servers surround round tables simultaneously and lift heated cloches or place plates on the Captain's coordinated visual signal"
      ],
      correct_option_index: 3,
      explanation: "Synchronized French service coordinates servers to place cloched plates in front of every guest at a table simultaneously on a unified cue.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In banquet kitchen timing, why does the Banquet Captain issue a formal 'Fire Main Course' call to the Executive Chef 12 to 15 minutes before the entree drop?",
      options: [
        "To start a campfire in the kitchen",
        "It signals culinary staff to plate hot proteins, starches, and sauces in rhythm so plates leave the pass at peak thermal temperature without sitting under lamps",
        "To order more food from the grocery store",
        "To turn off the kitchen lights"
      ],
      correct_option_index: 1,
      explanation: "The 'Fire' call gives the kitchen the precise 12-15 minute window needed to plate and sauce hundreds of hot meals for immediate delivery.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "According to NFPA 101 Life Safety Code standards, what minimum clearance must be maintained between banquet table chair backs in a ballroom?",
      options: [
        "Minimum 36 inches of clear service aisle space",
        "1 inch",
        "10 feet",
        "Zero clearance"
      ],
      correct_option_index: 0,
      explanation: "NFPA life-safety standards mandate a minimum 36-inch service clearance between chair backs to ensure safe egress during emergencies.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In outdoor event management, what is 'The Weather Call' and when must it be made prior to an outdoor ceremony or reception?",
      options: [
        "Calling the local television weather reporter for advice",
        "Canceling the entire wedding completely",
        "The binding operational decision made 4 to 6 hours before event start to move an outdoor setup into an indoor backup space, allowing time for physical transition",
        "Waiting until it starts raining during the ceremony"
      ],
      correct_option_index: 2,
      explanation: "The weather call must be made 4-6 hours in advance to provide adequate setup time for banquet staff and audio engineers to transition indoors.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In high-volume banquet beverage service, what is the standard staffing ratio for bartenders on a full open bar with mixed spirits, wine, and beer?",
      options: [
        "1 bartender per 1,000 guests",
        "1 bartender per 5 guests",
        "Zero bartenders (guests pour own drinks)",
        "1 bartender per 75 to 100 guests (or 1 per 50 for custom craft cocktails)"
      ],
      correct_option_index: 3,
      explanation: "A ratio of 1 bartender per 75-100 guests maintains fast beverage service lines without causing lengthy guest queues.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In ballroom audiovisual projection geometry, why must the bottom of all projection screens be elevated at least 5 feet above the finished ballroom floor?",
      options: [
        "Because projectors cannot shoot lower than 5 feet",
        "To ensure that seated guests in middle and back rows can view slide content without having their sightlines blocked by the heads of guests seated in front rows",
        "To keep screens away from dogs",
        "To make room for banquet tables underneath the screen"
      ],
      correct_option_index: 1,
      explanation: "Elevating the screen bottom to 5 feet guarantees unobstructed sightlines over seated audience heads throughout the entire ballroom.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In contract negotiation and event capacity planning, how does an 'Attrition Clause' calculate financial damages when a group underperforms its contracted room block?",
      options: [
        "By charging the client double the room rate",
        "By canceling the event immediately",
        "It enforces sliding-scale liquidated damages when actual room pickup or food spend falls below the contracted slippage threshold (typically 80%-85% of commitment)",
        "By requiring the client to purchase the hotel"
      ],
      correct_option_index: 2,
      explanation: "Attrition clauses protect the venue by holding planners financially responsible for revenue shortfalls below the contracted slippage minimum (80-85%).",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In event production engineering, why must staging lighting and audio equipment be connected to dedicated 3-phase cam-lock power tie-ins isolated from kitchen circuits?",
      options: [
        "Inductive electrical noise from heavy kitchen compressor cycling (refrigerators, dishwashers) introduces severe 60Hz audio hums and lighting flickering into production gear",
        "Because kitchens do not have electricity",
        "Because AV equipment requires nuclear power",
        "To make wires look organized"
      ],
      correct_option_index: 0,
      explanation: "Isolating AV power onto dedicated 3-phase feeds prevents electrical noise, voltage drops, and audio buzzes caused by kitchen refrigeration compressors.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In banquet wine service, how should a professional server pour and present wine at a formal seated dinner?",
      options: [
        "Pour wine from the left across the guest's plate",
        "Fill the glass to the very top rim so it spills",
        "Shake the bottle vigorously before uncorking",
        "Present the label, pour from the guest's right without touching the bottle neck to the glass rim, fill to the widest point of the bowl (approx. 5 oz), and twist the bottle while wiping with a linen napkin"
      ],
      correct_option_index: 3,
      explanation: "Proper wine service presents the label, pours from the right to the glass widest point (5 oz) without glass contact, and twists the bottle with a napkin wipe.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "How is the required dance floor area calculated for a wedding or gala event with 300 total attendees?",
      options: [
        "100 square feet per guest",
        "Assuming 30% to 50% of guests dance at peak times (90 to 150 dancers) and allocating 3 square feet per active dancer (approx. 300 to 450 sq ft dance floor)",
        "1 square inch per guest",
        "Dance floors are always 10x10 regardless of guest count"
      ],
      correct_option_index: 1,
      explanation: "Standard event planning sizes dance floors at 3 sq ft per active dancer, estimating 30-50% peak participation among total attendees.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #41.");
  console.log("Skill #41 update completed successfully!");
}

run();
