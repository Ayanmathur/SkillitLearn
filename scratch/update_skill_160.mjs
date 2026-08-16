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

const skillId = "80a0d5b6-7c43-42a0-9529-115e3244c071";

async function run() {
  console.log("Updating Skill #160: Space Planning (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Anthropometrics, Circulation Paths and Spatial Clearances" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Architectural Programming, Adjacency Matrices and Zoning" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: ADA Accessibility, IBC Building Codes and Life Safety" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / NCIDQ Interior Architect level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Anthropometric Dimensions and Ergonomic Envelope Design",
      order_index: 1,
      content: `### Human Scale and Dimensional Envelopes

1. Anthropometric Data:
   - Designing for 5th to 95th percentile human body dimensions across sitting, standing, reach, and functional clearance envelopes.

2. Ergonomic Principles:
   - Establishing correct work surface heights (36-inch standard kitchen counters, 29-to-30-inch executive desks) to minimize musculoskeletal strain.`
    },
    {
      track_id: track1Id,
      title: "Circulation Flow: Primary and Secondary Pathway Geometry",
      order_index: 2,
      content: `### Traffic Pattern Engineering and Spatial Rhythms

1. Clearance Standards:
   - Primary circulation pathways (48 to 60 inches for commercial traffic and accessibility); Secondary pathways (36 inches minimum between residential furnishings).

2. Furniture Clearances:
   - Maintaining 18 inches between sofas and coffee tables; 36 to 42 inches behind dining chairs for pushback and serving flow.`
    },
    {
      track_id: track1Id,
      title: "The Kitchen Work Triangle and Task Station Clearances",
      order_index: 3,
      content: `### Culinary Ergonomics and Appliance Workflows

1. Work Triangle Geometry:
   - Connecting the Sink (Cleaning), Refrigerator (Storage), and Cooktop (Preparation). The perimeter sum of the three legs must measure between 12 and 26 feet.

2. Obstruction Control:
   - Ensuring no single leg is shorter than 4 feet or longer than 9 feet, and zero through-traffic intersects the work triangle zone.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Architectural Programming, Needs Auditing and Area Takeoffs",
      order_index: 1,
      content: `### Programmatic Discovery and Spatial Allocation

1. Programming Brief:
   - Conducting qualitative user interviews, lifestyle audits, departmental headcount projections, and square footage area takeoffs.

2. Space Factor Allocations:
   - Factoring gross-to-net usable area ratios (typically 1.25 to 1.40 multiplier for circulation, mechanical chases, and core partitions).`
    },
    {
      track_id: track2Id,
      title: "Adjacency Matrices, Bubble Diagrams and Block Planning",
      order_index: 2,
      content: `### Spatial Topology and Schema Progression

1. Adjacency Analysis:
   - Constructing quantitative Adjacency Matrices categorizing functional relationships (Essential, Desirable, Neutral, Undesirable).

2. Progressive Schematics:
   - Translating matrices into functional Bubble Diagrams, advancing to scaled Block Plans, and finalizing dimensioned floor plans.`
    },
    {
      track_id: track2Id,
      title: "Spatial Zoning, Sightlines and Asymmetrical Balance",
      order_index: 3,
      content: `### Visual Composition and Acoustic Separation

1. Functional Zoning:
   - Separating Public/Social zones (entry, living, dining) from Private zones (bedrooms, quiet focus pods) and Service zones (kitchen, laundry).

2. Visual Balance:
   - Framing architectural sightlines and focal points; balancing heavy physical volumes with asymmetrical negative space and natural daylight access.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "ADA Guidelines: Turning Radii, Clear Widths and Reach Ranges",
      order_index: 1,
      content: `### Universal Design and Federal Accessibility (ADAAG)

1. Spatial Maneuverability:
   - Mandating 60-inch diameter clear turning spaces (or T-shaped turning configurations) for standard wheelchair navigation in all public areas.

2. Clear Openings & Reach:
   - Requiring minimum 32-inch clear door opening widths (with 90-degree open door) and maintaining unobstructed reach ranges between 15 and 48 inches above finished floor.`
    },
    {
      track_id: track3Id,
      title: "IBC Means of Egress, Travel Distance and Corridor Widths",
      order_index: 2,
      content: `### Life Safety and Building Code Compliance

1. Means of Egress:
   - Calculating occupant loads (e.g. 100 sq ft per person in business occupancies) to size exit capacity under IBC and NFPA 101.

2. Egress Limitations:
   - Enforcing maximum 20-foot dead-end corridors; mandating minimum 44-inch corridor widths for occupant loads greater than 50; ensuring exit doors swing in direction of egress.`
    },
    {
      track_id: track3Id,
      title: "Universal Design Principles for Lifelong Living Spaces",
      order_index: 3,
      content: `### Inclusive Architecture and Barrier-Free Design

1. The 7 Principles of Universal Design:
   - Equitable Use, Flexibility in Use, Simple and Intuitive Use, Perceptible Information, Tolerance for Error, Low Physical Effort, and Size/Space for Approach.

2. Aging-in-Place Architecture:
   - Integrating zero-threshold curbless showers, reinforced backing for grab bars, lever door handles, and multi-height work surfaces.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #160.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In residential interior design, what are the three primary appliance stations that define the classic 'Kitchen Work Triangle'?",
      options: [
        "The Sink (Cleaning), the Refrigerator (Food Storage), and the Cooktop / Range (Food Preparation)",
        "The Toaster, the Blender, and the Microwave",
        "The Dining Table, the TV, and the Sofa",
        "The Dishwasher, the Trash Can, and the Pantry"
      ],
      correct_option_index: 0,
      explanation: "The Kitchen Work Triangle connects the three primary task centers: Sink, Refrigerator, and Cooktop/Range.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "Under the Americans with Disabilities Act (ADA) Accessibility Guidelines, what is the standard minimum turning space required for a wheelchair user in a room?",
      options: [
        "24 inches diameter",
        "36 inches diameter",
        "A 60-inch (5-foot) diameter circular clear space (or a 36-inch T-shaped turn area)",
        "100 inches diameter"
      ],
      correct_option_index: 2,
      explanation: "ADAAG mandates a 60-inch diameter circular clear space (or T-turn) for standard 360-degree wheelchair turning.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What is 'Anthropometrics' in interior architecture and ergonomics?",
      options: [
        "The study of outer space planets",
        "The measurement of the physical dimensions, proportions, reach ranges, and functional clearance envelopes of the human body to optimize spatial design",
        "The chemical testing of paint colors",
        "The study of ancient insect fossils"
      ],
      correct_option_index: 1,
      explanation: "Anthropometrics is the scientific study of human body dimensions and physical measurements used to design ergonomic furniture and spaces.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In space planning for dining rooms, what is the standard recommended clearance required behind a dining chair to allow someone to comfortably pull back their chair and walk behind it?",
      options: [
        "6 inches",
        "12 inches",
        "18 inches",
        "36 to 42 inches of clearance from the edge of the table to the nearest wall or furniture piece"
      ],
      correct_option_index: 3,
      explanation: "36 to 42 inches provides adequate clearance for chair pushback and unimpeded serving circulation behind seated diners.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In initial schematic design, what is a 'Bubble Diagram'?",
      options: [
        "A freehand conceptual drawing using circular shapes ('bubbles') to represent rooms, illustrating spatial relationships, scale, and circulation adjacencies before drawing formal floor plans",
        "A diagram showing soap bubble recipes",
        "A drawing of round lighting fixtures",
        "A chart measuring water pipe pressure"
      ],
      correct_option_index: 0,
      explanation: "Bubble diagrams explore functional space arrangements, zoning, and flow relationships during early schematic design.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In kitchen design guidelines (National Kitchen and Bath Association - NKBA), what is the mandatory rule regarding the total perimeter sum of all three legs in a Kitchen Work Triangle?",
      options: [
        "The total sum must equal exactly 50 feet",
        "The total sum must be under 6 feet",
        "The sum must be greater than 35 feet",
        "The total sum of the three legs must be between 12 and 26 feet, with no single leg measuring less than 4 feet or greater than 9 feet"
      ],
      correct_option_index: 3,
      explanation: "NKBA rules mandate the sum of the work triangle be 12 to 26 feet, with individual legs between 4 and 9 feet, and zero traffic cross-cutting.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "Under ADA Standards for Accessible Design, what is the minimum CLEAR doorway opening width required for interior commercial passage doors?",
      options: [
        "28 inches",
        "At least 32 inches of clear width measured between the face of the door and the opposite door stop when the door is opened 90 degrees",
        "48 inches",
        "60 inches"
      ],
      correct_option_index: 1,
      explanation: "ADA requires at least 32 inches of clear opening width with the door positioned at 90 degrees (standardly satisfied by a 36-inch door slab).",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In architectural programming, what is an 'Adjacency Matrix' used to evaluate?",
      options: [
        "A structured grid table that systematically scores and maps the direct relationship, proximity necessity, and acoustic separation requirements between every room or department in a facility",
        "A mathematical formula for calculating concrete weight",
        "A schedule of paint color swatches",
        "A list of furniture manufacturers"
      ],
      correct_option_index: 0,
      explanation: "Adjacency matrices establish priority proximity relationships (high, medium, low, negative) between spaces before spatial layout begins.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In International Building Code (IBC) and NFPA 101 Life Safety standards, what is a 'Dead-End Corridor' limitation for commercial facilities without automatic sprinkler systems?",
      options: [
        "Corridors can be infinitely long",
        "Corridors must be painted red",
        "Dead-end corridors where an occupant has only one direction of egress travel are strictly limited to a maximum length of 20 feet",
        "Dead-end corridors are completely forbidden in any structure"
      ],
      correct_option_index: 2,
      explanation: "IBC limits dead-end corridors to 20 feet (50 feet in fully sprinklered buildings) to prevent occupants from becoming trapped during fire egress.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In living room space planning, what is the standard recommended distance between a sofa and its companion central coffee table?",
      options: [
        "2 inches",
        "6 inches",
        "36 inches",
        "14 to 18 inches (providing comfortable legroom while keeping the table within easy arm reach for seated individuals)"
      ],
      correct_option_index: 3,
      explanation: "14 to 18 inches allows comfortable legroom and passage while maintaining ergonomic reaching distance for drinks and books.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In architectural space programming, what is the 'Gross-to-Net Usable Area Factor' (Efficiency Ratio) and how is it used during preliminary sizing?",
      options: [
        "The ratio of windows to solid walls",
        "A multiplier (typically 1.20 to 1.40) added to net programmed room square footage to account for circulation corridors, structural columns, wall thicknesses, mechanical shafts, and restrooms",
        "The price per square foot of drywall",
        "The ratio of ceiling height to room width"
      ],
      correct_option_index: 1,
      explanation: "Gross area includes all unprogrammed circulation, shafts, and structure; designers apply an efficiency multiplier to convert net space to gross.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "Under ADAAG wheelchair ramp compliance, what is the MAXIMUM allowable slope ratio and maximum vertical rise allowed for a single ramp run without a level landing?",
      options: [
        "1:5 slope with 10 feet rise",
        "1:8 slope with 4 feet rise",
        "Maximum slope of 1:12 (1 inch of vertical rise for every 12 inches of horizontal run), with a maximum vertical rise of 30 inches per run between landings",
        "1:20 slope with no landings required"
      ],
      correct_option_index: 2,
      explanation: "ADAAG mandates a maximum ramp slope of 1:12 and a maximum single-run vertical rise of 30 inches before requiring a 60-inch level landing.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In commercial interior architecture, when does the International Building Code (IBC) mandate that an exit egress door MUST swing outwards in the direction of egress travel?",
      options: [
        "When the room or space serves an Occupant Load of 50 or more people, or serves high-hazard occupancy groups",
        "Only when the door is located on the roof",
        "Only for residential bathrooms",
        "Exit doors must always swing inwards into the room"
      ],
      correct_option_index: 0,
      explanation: "IBC Section 1010 mandates egress doors swing in the direction of exit travel when serving an occupant load of 50+ or hazardous areas.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In human factors and Universal Design, what does designing for the '5th to 95th Percentile' anthropometric range ensure?",
      options: [
        "That only 5 people can enter the room at once",
        "That 95% of furniture must be made of wood",
        "That the building costs 95% less to construct",
        "That interior dimensions, counter heights, and reach zones accommodate at least 90% of the entire human population (from a 5th percentile female to a 95th percentile male)"
      ],
      correct_option_index: 3,
      explanation: "Anthropometric design spans 5th percentile female to 95th percentile male dimensions, creating spaces accessible to 90%+ of the population.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In interior spatial composition and optical ergonomics, how does 'Asymmetrical Balance' create visual equilibrium in an open-concept floor plan?",
      options: [
        "By placing identical duplicate furniture items on exact opposite sides of a mirror line",
        "By balancing elements of differing visual weight, size, color intensity, or texture around an imaginary axis or architectural focal point rather than using mirror-image duplication",
        "By leaving 100% of the floor completely empty",
        "Asymmetrical balance is an error in CAD drafting"
      ],
      correct_option_index: 1,
      explanation: "Asymmetrical balance achieves visual stability through the thoughtful arrangement of contrasting weights, shapes, and textures around an axis.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #160.");
  console.log("Skill #160 update completed successfully!");
}

run();
