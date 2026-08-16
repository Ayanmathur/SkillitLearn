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

const skillId = "7ec2c7ac-b4c9-4e1e-944a-42db83a1cb21";

async function run() {
  console.log("Updating Skill #9: Building Codes & Zoning Basics (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: International Building Code (IBC) Framework and Occupancy Classifications" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Means of Egress, Life Safety Geometry and Universal Accessibility" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Municipal Zoning Law, Land Use Entitlements and Bulk Envelope Controls" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "IBC Model Code Framework, Jurisdiction and Administration",
      order_index: 1,
      content: `### Architecture of Model Building Codes

Building regulatory governance in the United States and many international jurisdictions is founded upon the Model Code system developed by the International Code Council (ICC). The core code family includes:
- International Building Code (IBC): Governs commercial, institutional, and multi-family construction.
- International Residential Code (IRC): Governs detached one- and two-family dwellings and townhouses up to three stories.
- International Fire Code (IFC), Energy Conservation Code (IECC), Mechanical Code (IMC), and Existing Building Code (IEBC).

Statutory Authority: Model codes have zero legal force until formally enacted by state legislatures or municipal city councils into statutory law, frequently with local regional amendments (e.g. NYC Building Code, California Title 24).

### Code Administration and Permitting Procedures (IBC Chapter 1)

1. Plan Review and Submittal: Architects and Professional Engineers submit sealed construction drawings, structural calculations, and energy compliance forms to the local Authority Having Jurisdiction (AHJ / Department of Buildings).
2. Building Permit Issuance: Authorizes on-site construction work in strict accordance with approved documents.
3. Mandatory Milestone Field Inspections: Foundation footing inspection prior to pouring concrete, under-slab plumbing/vapor barrier inspection, structural framing and shear wall inspection, rough MEP inspection, fire-resistance penetration inspection, and insulation envelope verification.
4. Certificate of Occupancy (CO / TCO): Formal legal authorization permitting human occupancy. Unlawful occupancy prior to CO issuance carries severe civil and criminal penalties.

### Prescriptive vs Performance-Based Building Design

- Prescriptive Design: Traditional compliance adhering strictly to published dimensional tables (e.g. maximum travel distances, fixed hourly fire ratings, standard lumber spans).
- Performance-Based Design (ICC Performance Code / NFPA 101): Utilizes computational fluid dynamics (CFD) fire/smoke plume modeling (FDS) and egress pedestrian evacuation simulations to prove equivalent life safety for complex mega-structures (airports, domed stadiums, multi-story high-rise atriums) where prescriptive rules cannot apply.`
    },
    {
      track_id: track1Id,
      title: "Occupancy Classifications and Multi-Use Spatial Separation",
      order_index: 2,
      content: `### The 10 Fundamental IBC Occupancy Groups (IBC Chapter 3)

Occupancy classification defines the intended human activity, fuel load risk, and fire hazard profile of every building space:
1. Group A (Assembly): Civic, cultural, and recreational gathering of 50+ persons (A-1 theaters with fixed seating, A-2 food/drink nightclubs and restaurants, A-3 worship/community halls, A-4 indoor arenas, A-5 outdoor stadiums).
2. Group B (Business): Office spaces, banks, civic administration, and collegiate classrooms.
3. Group E (Educational): K-12 academic schools and daycare facilities for more than 5 children older than 2.5 years of age.
4. Group F (Factory / Industrial): F-1 Moderate-Hazard manufacturing vs F-2 Low-Hazard non-combustible material fabrication.
5. Group H (High-Hazard): Manufacturing/storage of toxic, flammable, explosive, or pyrophoric chemicals (H-1 detonation hazards through H-5 semiconductor fabrication).
6. Group I (Institutional): Supervised care facilities (I-1 assisted living, I-2 24-hour medical hospitals/nursing homes with non-ambulatory patients, I-3 detention/correctional prisons, I-4 adult/child daycare).
7. Group M (Mercantile): Retail department stores, pharmacies, and supermarket shopping centers.
8. Group R (Residential): Sleeping accommodations (R-1 transient hotels/motels, R-2 permanent apartments/condos with > 2 units, R-3 one/two-family residences, R-4 small congregate care).
9. Group S (Storage): S-1 Moderate-Hazard storage vs S-2 Low-Hazard non-combustible storage / open parking garages.
10. Group U (Utility and Miscellaneous): Agricultural barns, carports, retaining walls, and sheds.

### Mixed-Occupancy Spatial Separation Strategies (IBC Section 508)

Modern mixed-use buildings (e.g. retail on ground floor with residential apartments above) must comply with one of three statutory design strategies:
- Non-Separated Uses (Section 508.3): Entire building is treated as a single unified entity. Zero fire-rated separation walls are required between uses, but the most restrictive height, area, and sprinkler rules among all occupancies apply to the entire structure.
- Separated Uses (Section 508.4): Individual occupancy compartments must be physically separated by continuous, fire-rated Fire Barriers or Horizontal Assemblies (Table 508.4: typically 1 to 3-hour fire ratings). Total building allowable area is governed by the fractional summation ratio:
\`\`\`
Sum(Actual Area_i / Allowable Area_i) <= 1.0
\`\`\`
- Accessory Occupancies (Section 508.2): Minor ancillary support spaces (occupying < 10% of floor area) require no fire separation from the primary occupancy.`
    },
    {
      track_id: track1Id,
      title: "Construction Types, Fire Resistance and Allowable Area Calculations",
      order_index: 3,
      content: `### The Five Basic Types of Construction (IBC Chapter 6)

Construction classification defines the combustibility and fire resistance duration of primary structural elements (columns, girders, floor slabs, exterior walls per IBC Table 601):

1. Type I (Fire-Resistive Non-Combustible): High-rise structural steel encased in heavy concrete or SFRM fireproofing. Type I-A (3-hour structural frame) and Type I-B (2-hour structural frame). Unlimited allowable height and floor area potential.
2. Type II (Non-Combustible Protected / Unprotected): Steel and concrete construction. Type II-A (1-hour protected) vs Type II-B (0-hour unprotected steel roof joists and deck).
3. Type III (Exterior Non-Combustible / Interior Any Material): Heavy exterior masonry or concrete walls with interior wood framing (traditional brick-and-beam construction). Type III-A (1-hour) vs Type III-B (0-hour).
4. Type IV (Mass Timber / Heavy Timber): Structural framing composed of solid sawn lumber or mass timber (CLT, Glulam) without concealed spaces. Subdivided into IV-A (fully encapsulated 3-hr), IV-B (partially exposed 2-hr), IV-C (fully exposed 2-hr), and IV-HT (traditional heavy timber).
5. Type V (Combustible Any Material): Standard light-frame wood construction (2x4 / 2x6 stud framing). Type V-A (1-hour fire-rated with type X gypsum) vs Type V-B (0-hour unprotected residential framing).

### Allowable Building Height and Area Calculations (IBC Tables 504.3 & 506.2)

The legal maximum physical footprint and floor area of a proposed building is calculated through mathematical modification formulas:

1. Automatic Fire Sprinkler Increase:
   - Installing an approved NFPA 13 automatic fire sprinkler system permits a 200% area increase for multi-story buildings (\`S_s = 2.0\`) or 300% for single-story buildings (\`S_s = 3.0\`), plus adding 20 feet of building height and 1 additional story.

2. Perimeter Open Frontage Increase:
   - Buildings with open public street access around their perimeter receive an area increase factor (\`I_f\`):
\`\`\`
I_f = [F / P - 0.25] * (W / 30)
\`\`\`
Where F is open building perimeter with clear width W >= 20 feet, and P is total building perimeter.

3. Total Allowable Floor Area Formula:
\`\`\`
A_a = A_t + [A_t * I_f] + [A_t * S_s]
\`\`\`
Where A_t is tabular base allowable area.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Occupant Load Calculations and Means of Egress Geometry",
      order_index: 1,
      content: `### Sizing the Human Egress Capacity

The primary objective of building life safety codes is ensuring safe, unobstructed evacuation during a fire. All egress dimensions originate from mathematical Occupant Load calculations.

### 1. Occupant Load Calculations (IBC Table 1004.5)

The design occupant load is calculated by dividing floor area by the statutory occupant load factor (gross or net square feet per person):
- Assembly (Concentrated Standing Space / Waiting Areas): 5 sq ft net per person.
- Assembly (Unconcentrated Tables and Chairs / Dining): 15 sq ft net per person.
- Business (Commercial Office Space): 150 sq ft gross per person.
- Educational (Classrooms): 20 sq ft net per person.
- Mercantile (Ground Floor Retail): 60 sq ft gross per person.
- Storage Warehouses: 500 sq ft gross per person.

### 2. The Three Sequential Components of Means of Egress (IBC Section 1002)

1. Exit Access: The portion of the egress system that leads from any occupied point in a building to an exit (aisles, rooms, corridors).
2. Exit: The protected, separated component providing a safe travel path to the exit discharge (1 to 2-hour fire-resistance rated interior exit stairways, exit passageways, horizontal exits, and exterior exit doors at grade).
3. Exit Discharge: The portion between the termination of an exit and a public way (exterior sidewalks, public plazas, streets).

### 3. Egress Width Sizing Formulas (IBC Section 1005.3)

The total cumulative clear width of corridors, doors, and stairways is calculated by multiplying the design occupant load by width factors:
- Stairways: Minimum width = \`Occupant Load * 0.3 inches\` (7.6 mm per person). In buildings equipped with NFPA 13 sprinklers and emergency voice/alarm communications, this factor reduces to \`0.2 inches\` per person.
- Level Egress and Doorways: Minimum width = \`Occupant Load * 0.2 inches\` (5.1 mm per person). In fully sprinklered voice/alarm buildings, this factor reduces to \`0.15 inches\` per person.
- Absolute Minimums: Egress corridors serving > 50 occupants must maintain a minimum clear width of 44 inches (1.12 m). Commercial exit doors must provide a minimum 32 inches clear opening width.`
    },
    {
      track_id: track2Id,
      title: "Egress Path Limits, Travel Distances and Exit Remoteness",
      order_index: 2,
      content: `### Spatial Geometry and Limiting Travel Distances

Building layouts must strictly limit travel distances so occupants can reach safe exit enclosures before being overcome by smoke or toxic combustion gases.

### 1. Minimum Number of Required Exits (IBC Section 1006)

The minimum number of independent exits required from any room, floor level, or entire building is governed by occupant load:
- Occupant Load 1 to 500 persons: Minimum 2 separate, independent exits.
- Occupant Load 501 to 1,000 persons: Minimum 3 separate, independent exits.
- Occupant Load Greater than 1,000 persons: Minimum 4 separate, independent exits.

### 2. Critical Distance Limitations

- Common Path of Egress Travel: The distance an occupant must travel before two separate, distinct exit access paths become available. Maximum limit: 75 feet (expanded to 100 feet in fully sprinklered NFPA 13 buildings).
- Maximum Exit Access Travel Distance: The total travel distance measured along the natural center of the path from the most remote occupied point in a room to the nearest enclosed exit door. Maximum limit: 200 feet in unsprinklered commercial buildings; 250 to 300 feet in NFPA 13 sprinklered buildings.
- Dead-End Corridors: A corridor pocket having an exit access in only one direction. Maximum limit: 20 feet (expanded to 50 feet in NFPA 13 sprinklered buildings).

### 3. Exit Remoteness and The Diagonal Separation Rule (IBC Section 1007.1.1)

To ensure that a single localized fire cannot block both exits simultaneously, multiple exits must be physically separated in space:
- Standard Unsprinklered Rule: The straight-line distance between two exit access doorways must be not less than one-half of the maximum overall diagonal dimension of the building or area served:
\`\`\`
Separation Distance >= 0.50 * Maximum Diagonal Dimension
\`\`\`
- Sprinklered Exception (NFPA 13): In buildings protected throughout by an automatic fire sprinkler system, the required minimum separation distance is reduced to not less than one-third of the maximum diagonal dimension:
\`\`\`
Separation Distance >= 0.333 * Maximum Diagonal Dimension
\`\`\``
    },
    {
      track_id: track2Id,
      title: "Universal Accessibility Standards: ADA and ICC/ANSI A117.1",
      order_index: 3,
      content: `### Civil Rights and Physical Accessibility Standards

Architectural accessibility is governed by the Americans with Disabilities Act Title III Standards (ADAAG) and the International Code Council standard ICC/ANSI A117.1 (Accessible and Usable Buildings and Facilities).

### 1. Continuous Accessible Route

A continuous, unobstructed path connecting accessible parking spaces, public transportation drop-offs, and public sidewalks to all accessible building entrances, interior corridors, elevators, and occupied rooms.
- Minimum Clear Width: Continuous 36 inches minimum width (can reduce to 32 inches for a maximum length of 24 inches at doorways).
- Passing Spaces: Accessible routes with clear width < 60 inches must provide 60x60 inch passing spaces at maximum intervals of 200 feet.

### 2. Accessible Restroom and Fixture Geometry

- Turning Space: 60-inch (1.52 m) diameter clear circle or T-shaped turning space allowing 360-degree wheelchair rotation.
- Water Closet Placement: Centerline of the toilet bowl must be positioned exactly 16 to 18 inches (405 to 455 mm) from the adjacent side wall (17 to 19 inches for ambulatory accessible stalls).
- Grab Bar Standards: Heavy-duty stainless steel grab bars (1-1/4 to 1-1/2 inch diameter) mounted horizontally between 33 and 36 inches above finished floor:
  - Side Wall Grab Bar: Minimum 42 inches long, located max 12 inches from rear wall.
  - Rear Wall Grab Bar: Minimum 36 inches long.
- Lavatory Clearances: Top of sink rim maximum 34 inches above floor; minimum 27 inches knee clearance height beneath the apron; all exposed hot water supply pipes and drain lines must be insulated to prevent contact burns.

### 3. Accessible Ramps and Handrail Requirements

- Maximum Ramp Slope: 1:12 (8.33% slope / 1 inch of rise per 12 inches of run).
- Maximum Rise per Run: Maximum 30 inches of vertical rise between level horizontal landings (maximum single ramp run length of 30 feet).
- Level Landings: Minimum 60 inches clear length at the top and bottom of every ramp run, and 60x60 inches at ramps changing direction.
- Continuous Handrails: Mandatory on both sides of ramps with rise > 6 inches, mounted at 34 to 38 inches height with 12-inch horizontal extensions at ends.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Municipal Zoning Frameworks, Land Use Law and Police Powers",
      order_index: 1,
      content: `### Constitutional Foundations of Municipal Zoning Law

Zoning codes regulate land use, building density, and physical parcel development entirely independently of building construction codes:
- Constitutional Origin: Derived from Municipal Police Powers under the 10th Amendment of the U.S. Constitution, authorizing state and municipal governments to enact regulations protecting public health, safety, morals, and general welfare.
- Landmark Supreme Court Precedent (*Village of Euclid v. Ambler Realty Co.*, 1926): Established the constitutional validity of comprehensive municipal land-use segregation, originating the legal term Euclidean Zoning.

### Standard Zoning Districts and Land Use Hierarchies

1. Residential Districts (R-Districts):
   - Low-Density Single-Family (R-1, R-E estate).
   - Medium-Density Two-Family / Townhomes (R-2, R-T).
   - High-Density Multi-Family Apartments / Condos (R-3, R-4).
2. Commercial Districts (C-Districts):
   - C-1 (Neighborhood Convenience / Retail).
   - C-2 (General Highway Commercial / Big Box Retail).
   - C-3 (Central Business District / Urban Core Commercial).
3. Industrial Districts (I-Districts / M-Districts):
   - Light Industrial (I-1 / M-1: clean technology, warehousing, light assembly).
   - Heavy Industrial (I-2 / M-2: chemical processing, refining, foundry smelting).

### Modern Innovations in Land Use Regulation

- Planned Unit Developments (PUD): Overlay zoning that allows developers flexible clustering of mixed residential and commercial uses in exchange for dedicated public open space and community amenities.
- Form-Based Codes (SmartCode): Replaces strict Euclidean land-use separation with regulations based on physical urban form, building-to-street relationships, active ground-floor frontages, and pedestrian public realm character.`
    },
    {
      track_id: track3Id,
      title: "Spatial Bulk Regulations: FAR, Setbacks and Sky Exposure Planes",
      order_index: 2,
      content: `### Spatial Bulk and Dimensional Envelope Geometry

Zoning bylaws control building bulk, population density, and access to natural daylight through standardized mathematical parameters:

### 1. Floor Area Ratio (FAR)

Floor Area Ratio is the fundamental metric governing allowable building density on a real estate parcel:

\`\`\`
FAR = Total Gross Building Floor Area / Total Lot Parcel Area
\`\`\`

- Example: On a 10,000 sq ft parcel with a permitted FAR of 3.0:
  - Total Maximum Gross Floor Area = 10,000 * 3.0 = 30,000 sq ft.
  - Development Options: A 1-story building covering 30,000 sq ft (if lot coverage permits), a 3-story building covering 10,000 sq ft per floor (100% lot coverage), or a 6-story tower covering 5,000 sq ft per floor (50% lot coverage).

### 2. Property Setback Buffers and Maximum Lot Coverage

- Property Setbacks: Mandatory clear yard dimensions between property lot lines and the exterior building face:
  - Front Yard Setback: Establishes streetscape alignment and vehicular sight triangles.
  - Side Yard Setbacks: Provides fire separation buffers and side daylighting between neighboring properties.
  - Rear Yard Setback: Preserves private rear amenity space and urban tree canopy.
- Maximum Lot Coverage: The percentage of parcel land area occupied by the building ground footprint (\`Footprint Area / Lot Area <= Max Coverage, e.g. 40% to 60%\`).

### 3. Sky Exposure Planes and Sunlight Encroachment Angles

In dense urban cores, tall buildings are bounded by Sky Exposure Planes:
- An imaginary sloping angular plane starting at a designated height above the street curb and leaning backward into the property at a specified angle ratio (e.g. 2.5:1 or 60 degrees).
- Building envelopes must step back as they rise in height (wedding cake / setback skyscraper architecture) to prevent permanent solar shadows over public street sidewalks.`
    },
    {
      track_id: track3Id,
      title: "Development Approvals, Variances and Environmental Review",
      order_index: 3,
      content: `### The Entitlement and Permitting Lifecycle

Developing real estate requires navigating statutory discretionary approval pathways:

### 1. As-of-Right (Permitted) Development vs Discretionary Review

- As-of-Right Development: The proposed architectural project conforms 100% to all published zoning bylaws (use, FAR, height, setbacks, parking). The developer is legally entitled to building permits via administrative staff review without public hearings.
- Special Use Permit (Conditional Use / SUP): Uses permitted only upon discretionary review by the Planning Commission, subject to conditions mitigating traffic, noise, and neighborhood impact (e.g. gas stations, night clubs, daycare centers in commercial zones).

### 2. Zoning Variances and Hardship Criteria

When unique parcel conditions prevent strict compliance with zoning bylaws, property owners apply for a Variance before the municipal Zoning Board of Adjustment (ZBA):
1. Area / Bulk Variance: Relief from dimensional rules (setbacks, height, lot width, parking ratios). Standard of proof: Practical Difficulty.
2. Use Variance: Relief to establish a prohibited land use (e.g. commercial office in a single-family residential zone). Standard of proof: Unnecessary Hardship. The applicant must prove that the property cannot yield a reasonable financial return under any permitted use, that the plight is due to unique parcel topography/shape, and that the hardship was not self-created.

### 3. Environmental Impact Assessment and Public Engagement

- Environmental Review Acts (e.g. CEQA in California, SEQRA in New York, NEPA for federal funding): Requires formal Environmental Impact Reports (EIR / EIS) evaluating traffic generation, storm runoff, shadow impacts, historical resources, and greenhouse gas emissions.
- Community Board & Public Hearings: Public notice and community testimony enabling neighboring residents to voice support or concerns before municipal approvals.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #9.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "What mathematical metric defines allowable building density by dividing total gross building floor area by total parcel lot area?",
      options: [
        "Solar Heat Gain Coefficient (SHGC)",
        "Modulus of Elasticity (MOE)",
        "Floor Area Ratio (FAR)",
        "Occupant Load Factor"
      ],
      correct_option_index: 2,
      explanation: "Floor Area Ratio (FAR) = Total Gross Building Floor Area / Total Lot Parcel Area. It is the primary zoning metric controlling urban building density.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "Under the International Building Code (IBC Chapter 3), which occupancy group classification governs commercial office buildings, banks, and civic administration spaces?",
      options: [
        "Group B (Business)",
        "Group A (Assembly)",
        "Group H (High-Hazard)",
        "Group I (Institutional)"
      ],
      correct_option_index: 0,
      explanation: "Group B designates Business occupancies, encompassing office facilities, banks, professional services, and civic administration spaces.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "Under the Americans with Disabilities Act (ADA) and ICC/ANSI A117.1, what is the maximum permitted slope for an accessible pedestrian ramp?",
      options: [
        "1:4 (25% slope)",
        "1:8 (12.5% slope)",
        "1:20 (5% slope)",
        "1:12 (8.33% slope / 1 inch of rise per 12 inches of run)"
      ],
      correct_option_index: 3,
      explanation: "ADA standards mandate a maximum slope of 1:12 (8.33%) for accessible ramps, with a maximum rise of 30 inches between horizontal level landings.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In the International Building Code, what is the most fire-resistive Type of Construction, permitting unlimited building height and area potential for high-rise towers?",
      options: [
        "Type V-B (Unprotected Wood Framing)",
        "Type I (Type I-A / I-B Protected Non-Combustible)",
        "Type III-B (Unprotected Masonry/Wood)",
        "Type IV-HT (Heavy Timber)"
      ],
      correct_option_index: 1,
      explanation: "Type I construction (Type I-A / I-B) features non-combustible steel and concrete protected by 2 to 3-hour fireproofing, allowing unlimited height and area.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What U.S. Supreme Court landmark legal decision (1926) established the constitutional validity of municipal zoning ordinances under local police powers?",
      options: [
        "Brown v. Board of Education",
        "Marbury v. Madison",
        "Village of Euclid v. Ambler Realty Co.",
        "Penn Central Transportation Co. v. New York City"
      ],
      correct_option_index: 2,
      explanation: "Village of Euclid v. Ambler Realty Co. (1926) upheld municipal zoning as a valid exercise of government police powers, giving rise to the term 'Euclidean Zoning'.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In IBC Chapter 10 egress calculations, if a multi-family apartment building floor has a total calculated design occupant load of 650 persons, what is the minimum number of separate, independent exits required from that floor?",
      options: [
        "1 Exit",
        "3 Exits (Minimum 3 independent exits for occupant loads between 501 and 1,000 persons)",
        "2 Exits",
        "5 Exits"
      ],
      correct_option_index: 1,
      explanation: "IBC Table 1006.3.2 mandates: 1-500 occupants = 2 exits; 501-1,000 occupants = 3 exits; > 1,000 occupants = 4 exits. For 650 persons, minimum 3 exits are required.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "How does installing an approved NFPA 13 automatic fire sprinkler system throughout a commercial building affect the Diagonal Separation Rule for exit remoteness?",
      options: [
        "It eliminates all exit separation requirements completely",
        "It increases the required exit separation distance to 100% of the building diagonal",
        "It allows all exits to be placed inside the same room",
        "It reduces the minimum required straight-line distance between exits from one-half (1/2) to not less than one-third (1/3) of the overall diagonal dimension of the space"
      ],
      correct_option_index: 3,
      explanation: "Under IBC 1007.1.1 Exception 2, a fully sprinklered NFPA 13 building allows exit doorways to be separated by not less than 1/3 of the diagonal dimension (instead of 1/2).",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What legal standard of proof must an applicant demonstrate to a municipal Zoning Board of Adjustment (ZBA) to obtain a Use Variance for a prohibited land use?",
      options: [
        "Unnecessary Hardship (proving the land cannot yield a reasonable financial return under permitted uses due to unique physical parcel traits, and the hardship was not self-created)",
        "That the property taxes are too high",
        "That the building has already been constructed",
        "That the owner dislikes the current zoning officer"
      ],
      correct_option_index: 0,
      explanation: "Obtaining a Use Variance requires proving 'Unnecessary Hardship'—showing that unique parcel characteristics prevent any reasonable economic return under conforming uses.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "Under ADA and ICC/ANSI A117.1 standards, what is the exact required positioning for the centerline of an accessible water closet (toilet) relative to the adjacent side wall?",
      options: [
        "12 inches (305 mm)",
        "24 inches (610 mm)",
        "16 to 18 inches (405 to 455 mm)",
        "30 inches (760 mm)"
      ],
      correct_option_index: 2,
      explanation: "ANSI A117.1 mandates that the centerline of an accessible water closet must be exactly 16 to 18 inches from the adjacent side wall for proper grab bar reach.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In a multi-story commercial building, what is the standard IBC occupant load factor used to calculate design occupant load for business office areas?",
      options: [
        "15 sq ft net per person",
        "150 sq ft gross per person",
        "500 sq ft gross per person",
        "5 sq ft net per person"
      ],
      correct_option_index: 1,
      explanation: "IBC Table 1004.5 assigns an occupant load factor of 150 gross square feet per person for Business office occupancies.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "A commercial building parcel has a lot area of 20,000 sq ft and a permitted base FAR of 4.0. The zoning code establishes a maximum lot coverage of 50%. If a developer builds a tower with a constant floorplate utilizing 100% of the maximum allowable gross floor area and 100% of maximum lot coverage, how many stories tall is the building?",
      options: [
        "4 stories",
        "12 stories",
        "6 stories",
        "8 stories (Max Floor Area = 80,000 sq ft; Footprint = 10,000 sq ft; 80,000 / 10,000 = 8 stories)"
      ],
      correct_option_index: 3,
      explanation: "Max Gross Floor Area = 20,000 * 4.0 = 80,000 sq ft. Max Footprint = 20,000 * 0.50 = 10,000 sq ft. Number of stories = 80,000 / 10,000 = 8 stories.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "Under IBC Section 508.4 for Separated Mixed-Occupancies, what mathematical condition must be satisfied across all occupancy compartments on a floor for the building area to be compliant?",
      options: [
        "The sum of the ratios of actual floor area to allowable floor area for each individual occupancy group must not exceed 1.0 (Sum of Area_i / Allowable_Area_i <= 1.0)",
        "The building must contain zero fire-rated barrier walls",
        "All residential units must be smaller than 500 sq ft",
        "The total building height must be less than 20 feet"
      ],
      correct_option_index: 0,
      explanation: "For separated mixed-occupancies, IBC Section 508.4.2 mandates that the fractional sum of (Actual Area / Allowable Area) for each occupancy compartment cannot exceed 1.0.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "An architect is calculating the required exit stairway width for an unsprinklered 3-story assembly hall with an occupant load of 400 persons on the upper floor. What is the minimum cumulative clear stairway width required by IBC Section 1005.3.1?",
      options: [
        "44 inches",
        "80 inches",
        "120 inches (400 persons * 0.3 inches per person = 120 inches / 10 feet total width)",
        "60 inches"
      ],
      correct_option_index: 2,
      explanation: "Under IBC 1005.3.1, unsprinklered stair width = Occupant Load * 0.3 inches = 400 * 0.3 in = 120 inches (10.0 feet), which may be distributed across two or more stairways.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "What architectural zoning regulation establishes an imaginary sloping angle plane rising from the street curb inward to prevent high-rise towers from casting continuous shadows over urban sidewalks?",
      options: [
        "Property Setback Buffer",
        "Sky Exposure Plane",
        "Floor Area Ratio (FAR)",
        "View Corridor Baseline"
      ],
      correct_option_index: 1,
      explanation: "Sky Exposure Planes are inclined angular boundaries that require upper stories of tall buildings to step back from the street, ensuring natural sunlight and air reach ground sidewalks.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In the IBC Chapter 5 allowable area frontage increase formula (I_f = [F/P - 0.25] * W/30), what is the minimum open perimeter clearance width (W) required for a building side to qualify as open frontage?",
      options: [
        "20 feet (6.10 m)",
        "5 feet (1.52 m)",
        "50 feet (15.24 m)",
        "10 feet (3.05 m)"
      ],
      correct_option_index: 0,
      explanation: "IBC Section 506.3 mandates that open perimeter width (W) must be at least 20 feet measured from the building exterior face to the nearest lot line or public way to count for frontage increases.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #9.");
  console.log("Skill #9 update completed successfully!");
}

run();
