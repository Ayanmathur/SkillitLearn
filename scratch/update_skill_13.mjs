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

const skillId = "a8494008-9202-4c22-b3d7-48216cd89ed7";

async function run() {
  console.log("Updating Skill #13: Cost Estimation (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Conceptual Estimating, AACE Classes and Quantity Takeoffs" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Unit Price Breakdown: Labor Burden, Material and Equipment Costs" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: General Conditions, Overhead, Contingency and Bid Finalization" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "AACE Cost Estimate Classification System and Scope Definition",
      order_index: 1,
      content: `### Principles of Construction Cost Engineering

Cost estimation transforms architectural drawings and specifications into precise monetary forecasts. The global standard for estimate classification is governed by AACE International (Recommended Practice 17R-97 / 18R-97):

1. The Five AACE Estimate Classes:
   - Class 5 (Order of Magnitude / Concept Screening): 0% to 2% project definition. Used for initial strategic capital allocation. Expected accuracy range: -50% to +100%.
   - Class 4 (Feasibility / Conceptual Study): 1% to 15% project definition. Used for business case viability. Expected accuracy range: -30% to +50%.
   - Class 3 (Budget Authorization / Preliminary Design): 10% to 40% project definition (Schematic Design phase). Establishes the baseline project budget. Expected accuracy range: -20% to +30%.
   - Class 2 (Control / Detailed Design): 30% to 75% project definition (Design Development phase). Used for contractor bidding and procurement control. Expected accuracy range: -15% to +20%.
   - Class 1 (Check Estimate / Bid Tender): 65% to 100% project definition (100% Construction Documents). High-accuracy lump sum bid. Expected accuracy range: -10% to +15%.

2. Basis of Estimate (BOE) Documentation:
   - A formal narrative accompanying cost estimates defining scope boundaries, drawing revision dates, site access assumptions, labor wage structures, currency exchange rates, allowances, and explicit exclusions.`
    },
    {
      track_id: track1Id,
      title: "Conceptual Cost Modeling, Parametric Estimating and Cost Indexing",
      order_index: 2,
      content: `### Early-Stage Parametric and Historical Cost Modeling

During early schematic design when detailed quantity takeoffs cannot be performed, cost estimators deploy mathematical modeling:

1. Square Foot and Elemental Parametric Estimating:
   - Square Foot Modeling: Total cost modeled from gross floor area (\`Cost = Gross Area * Unit Cost per SF\`).
   - Elemental Parameter Modeling (UniFormat): Pricing by functional building elements (e.g. exterior enclosure cost per SF of wall surface; MEP cost per ton of cooling capacity; cost per hospital bed or hotel key).

2. Historical Cost Indexing and Location Factors (RSMeans City Cost Indexes - CCI):
   - Escalation Indexing (adjusting historical project data across time):
\`\`\`
Cost_TargetYear = Cost_BaseYear * (Index_TargetYear / Index_BaseYear)
\`\`\`
   - Geographic Location Indexing (adjusting between different cities):
\`\`\`
Cost_CityB = Cost_CityA * (CCI_CityB / CCI_CityA)
\`\`\`

3. Capacity Factoring (The Six-Tenths Rule for Industrial Facilities):
\`\`\`
Cost_B = Cost_A * (Capacity_B / Capacity_A)^0.6
\`\`\`
Reflects non-linear economies of scale in process engineering and industrial plants.`
    },
    {
      track_id: track1Id,
      title: "Quantity Takeoff (QTO) Methodologies and Digital Measurement",
      order_index: 3,
      content: `### Precision Quantity Takeoff (QTO) Engineering

Quantity Takeoff is the meticulous measurement of all material quantities from architectural, structural, and MEP construction drawings:

1. Standard Measurement Geometry:
   - Linear Takeoffs (Linear Feet / Meters): Partition wall framing, baseboard trim, underground piping trenching, and parapet coping flashing.
   - Area Takeoffs (Square Feet / Square Meters): Flooring, ceiling finishes, roofing membranes, exterior brick veneer, and drywall (with standard deduction rules omitting wall openings larger than 32 sq ft).
   - Volume Takeoffs (Cubic Yards / Cubic Meters): Cast-in-place concrete footings, structural slabs, and earthwork bulk excavation.
     - Average End Area Method for Earthwork Cut/Fill:
\`\`\`
Volume (Cubic Yards) = Length * [(Area_1 + Area_2) / 2] / 27
\`\`\`
   - Count Takeoffs: Discrete components (doors, windows, light fixtures, plumbing fixtures).

2. Material Waste and Compaction Factors:
   - Estimators convert neat measured drawing quantities into real-world purchasing quantities:
     - Cast-in-Place Concrete: 5% to 8% waste allowance (spillage, formwork deflection).
     - Drywall and Plywood Sheathing: 10% cutting waste.
     - Ceramic Tile and Carpet: 10% to 15% pattern matching and perimeter cut waste.
     - Earthwork Soil Swell and Shrinkage: Bank cubic yards (BCY in-situ) vs Loose cubic yards (LCY in transport truck, 20% to 30% swell) vs Compacted cubic yards (CCY compacted in fill, 10% to 15% shrinkage).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Labor Productivity, Production Rates and Crew Sizing",
      order_index: 1,
      content: `### Labor Productivity and Output Rate Analysis

Labor represents the highest financial risk in construction contracting due to human performance volatility:

1. Labor Production Rate Formulation:
   - Labor Unit Rate (Man-Hours per Unit):
\`\`\`
Man-Hours per Unit = Total Work Hours / Total Quantity Installed
\`\`\`
   - Example: If a 4-man carpenter crew installs 1,600 sq ft of wall framing in an 8-hour shift:
     - Total Man-Hours = 4 men * 8 hours = 32 man-hours.
     - Production Rate = 32 man-hours / 1,600 SF = 0.020 man-hours per square foot.

2. Daily Crew Output Modeling:
   - Defining standard trade crew assemblies (e.g. 1 Foreman, 3 Journeymen, 1 Apprentice, paired with 1 rough-terrain forklift).

3. Productivity Degradation Multipliers:
   - Weather Extremes: High heat (temperatures > 95 deg F reduce efficiency by 15% to 25%) and winter freezing.
   - Job Site Congestion: Stacking of trades in confined tenant spaces.
   - Extended Overtime Fatigue (Business Roundtable Studies): Operating on 60-hour work weeks (six 10-hour days) results in cumulative physical fatigue and error rates that reduce baseline labor productivity by up to 20% to 30% after four consecutive weeks, while increasing accident rates.`
    },
    {
      track_id: track2Id,
      title: "Direct Labor Rate Calculation and Fully Burdened Labor Costs",
      order_index: 2,
      content: `### True Cost of Construction Labor (Labor Burden Chemistry)

Estimators must never calculate labor using raw take-home base wages. Direct labor costs must include mandatory statutory payroll taxes, workers' compensation insurance, and contractual fringe benefits:

1. Statutory Labor Burden Components:
   - FICA Tax: Social Security (6.20%) + Medicare (1.45%) = 7.65% total.
   - Federal Unemployment Tax Act (FUTA, effective 0.60%) and State Unemployment (SUTA, typically 2.0% to 6.0%).
   - Workers' Compensation Insurance (WCI):
     - Calculated as a dollar rate per $100 of gross payroll.
     - Varies dramatically by trade classification risk (e.g. $3.50 per $100 for office clerical vs $24.00 per $100 for structural ironworkers and roofers).
     - Multiplied by company Experience Modification Rate (EMR).

2. Non-Statutory Fringe Benefits:
   - Union Health & Welfare insurance funds, pension plans, vacation pay, and certified apprenticeship training contributions (or prevailing wage fringe benefit package under the Davis-Bacon Act).

3. Fully Burdened Hourly Rate Calculation:
\`\`\`
Burdened Rate = Base Hourly Wage + (Base Wage * % Statutory Payroll Taxes) + Hourly WCI Cost + Hourly Fringe Benefits
\`\`\`
- Example: Base Wage = $35.00/hr; Taxes = 12% ($4.20); WCI = 18% ($6.30); Fringe Benefits = $12.50/hr.
- Total Fully Burdened Labor Rate = $35.00 + $4.20 + $6.30 + $12.50 = $58.00 per hour.`
    },
    {
      track_id: track2Id,
      title: "Construction Equipment Costing and Material Pricing",
      order_index: 3,
      content: `### Equipment Economics and Material Unit Pricing

1. Heavy Equipment Cost Analysis (Ownership vs Operating Costs per Hour):
   - Ownership (Fixed Capital) Costs:
     - Machine Purchase Depreciation (using straight-line or MACRS recovery).
     - Capital financing interest charges, equipment storage yard fees, property taxes, and comprehensive equipment insurance.
   - Operating (Variable) Costs:
     - Diesel Fuel Consumption Formula:
\`\`\`
Fuel Cost per Hour = Engine HP * 0.04 Gallons/HP-Hour * Diesel Fuel Price per Gallon
\`\`\`
     - Lubrication oils, hydraulic filters, ground-engaging wear components (excavator bucket teeth, grader blades), and routine tire replacement.
     - Equipment Mobilization / Demobilization: Flat freight transport charges for low-boy trailer trucking and setup.

2. Material Cost Structure:
   - Manufacturer Base Price (FOB Factory vs FOB Jobsite).
   - Volume Tier Discounts, Delivery Freight Charges, and Local Sales Tax (typically 6% to 9%).
   - Material Escalation Contingency: Protecting against commodity inflation (structural steel, copper electrical wire, PVC resin) during 12 to 24-month construction schedules.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "General Conditions (Job Site Overhead) and Indirect Cost Modeling",
      order_index: 1,
      content: `### General Conditions Architecture (CSI MasterFormat Division 01)

General Conditions (also termed Job Site Overhead or Field Overhead) represent direct project management expenses that cannot be assigned to a specific physical building material, but are essential to execute the contract:

1. On-Site Field Management Staffing:
   - Full-time field salaries and burdened payroll for Project Manager, Project Superintendent, Project Engineer, Field Safety Director, and Quality Control Manager.

2. Temporary Job Site Facilities and Utilities:
   - Monthly rental of mobile job office trailers, conference trailers, and secure tool storage shipping containers.
   - Temporary construction electrical power drop, temporary site lighting, water distribution, winter heating fuel (propane/diesel torpedo heaters), and portable chemical toilets.
   - Temporary site fencing, security cameras, and project identification signage.

3. Field Operations and Logistics:
   - Daily job site trash cleanup labor, continuous multi-ton dumpster haul-off fees, street cleaning, erosion control BMP maintenance, and external material hoist operations.
   - General conditions typically range from 6% to 12% of total direct construction cost depending on project duration and urban site complexity.`
    },
    {
      track_id: track3Id,
      title: "Contingency Modeling, Risk Allocation and Escalation Reserves",
      order_index: 2,
      content: `### Quantitative Contingency and Risk Management

Contingency is an essential budgetary allocation included in construction estimates to account for quantifiable uncertainties:

1. The Three Tiers of Construction Contingency:
   - Design Contingency: Added during preconstruction to account for incomplete drawings, evolving specifications, and uncoordinated details (typically 15% at Schematic Design, dropping to 8% at Design Development, and 0% at 100% Final Construction Documents).
   - Contractor Construction Contingency: Contractor-controlled reserve in Guaranteed Maximum Price (GMP) contracts to absorb trade coordination gaps, minor field rework, and adverse weather downtime (typically 2% to 5%).
   - Owner Project Contingency: A separate owner-controlled capital reserve to fund owner-directed scope additions and unforeseen subterranean geotechnical conditions (typically 5% to 10%).

2. Quantitative Risk Modeling:
   - Expected Monetary Value (EMV):
\`\`\`
EMV = Probability of Risk Event (%) * Financial Impact ($)
\`\`\`
   - Monte Carlo Cost Risk Simulations: Running thousands of statistical iterations assigning probability distributions to volatile cost items, establishing P50 (50% confidence budget) and P80 (80% high-confidence budget) funding thresholds.`
    },
    {
      track_id: track3Id,
      title: "Corporate Overhead, Profit Margin and Bid Finalization",
      order_index: 3,
      content: `### The Final Bid Summary and Markups

The culmination of the estimating process is the assembly of the master bid recap summary sheet:

1. Corporate Overhead (General & Administrative - G&A / Home Office Overhead):
   - Off-site corporate expenses required to maintain enterprise operations: executive salaries, corporate headquarters office rent, legal and accounting fees, corporate IT infrastructure, and marketing.
   - Standard markup: Typically 3% to 6% of total revenue.

2. Net Profit Margin:
   - The commercial return on capital and risk. Determined by market competitiveness, bonding capacity utilization, contractor backlog, and project risk profile (typically 3% to 8%).

3. Performance and Payment Bonds and Insurance:
   - Surety Performance & Payment Bonds (guaranteeing project completion and supplier payment): Scaled pricing tiered from $10 to $15 per $1,000 of total contract value (approx 1.0% to 1.5%).
   - Builder's Risk Property Insurance and Commercial General Liability (CGL) premiums.

4. Master Bid Recap Formula:
\`\`\`
Total Bid = [Direct Material + Labor + Equipment + Subcontracts] + General Conditions + Contingency + G&A Overhead + Profit Margin + Bonds & Insurance + Gross Receipts Tax
\`\`\``
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #13.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "According to AACE International Recommended Practice 17R-97, which estimate class corresponds to a definitive bid tender based on 65% to 100% complete construction documents, providing an expected accuracy range of -10% to +15%?",
      options: [
        "Class 1 Estimate (Bid Tender / Check Estimate)",
        "Class 5 Estimate (Order of Magnitude)",
        "Class 4 Estimate (Feasibility Study)",
        "Class 3 Estimate (Budget Authorization)"
      ],
      correct_option_index: 0,
      explanation: "A Class 1 estimate represents a definitive bid tender prepared from 65% to 100% defined construction drawings, achieving the highest accuracy (-10% to +15%).",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In construction estimating, what term describes job site management expenses (such as project superintendent salaries, job trailers, and temporary power) that are necessary for project execution but not part of a permanent material assembly?",
      options: [
        "Direct Equipment Costs",
        "Material Waste Allowance",
        "General Conditions (Job Site Overhead / Division 01)",
        "Net Profit Margin"
      ],
      correct_option_index: 2,
      explanation: "General Conditions (CSI Division 01 / Job Site Overhead) covers field supervision, trailers, temporary utilities, and cleanup required to support site operations.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What mathematical formula is used in the Average End Area method to calculate bulk earthwork cut and fill volume in cubic yards?",
      options: [
        "Volume = Length * Width * Height",
        "Volume (CY) = Length * [(Area_1 + Area_2) / 2] / 27",
        "Volume = Total Weight / Soil Density",
        "Volume = Area * 100"
      ],
      correct_option_index: 1,
      explanation: "Average End Area volume in cubic yards is: Length * ((Area1 + Area2) / 2) / 27 (dividing by 27 to convert cubic feet to cubic yards).",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What payroll components must be added to a construction worker's base hourly wage to calculate the true 'Fully Burdened' labor cost?",
      options: [
        "Only the cost of steel-toed boots",
        "Only personal income tax",
        "Zero additions; base wage equals burdened cost",
        "Mandatory statutory payroll taxes (FICA, FUTA, SUTA), Workers' Compensation Insurance (adjusted by EMR), and contractual fringe benefits"
      ],
      correct_option_index: 3,
      explanation: "Fully burdened labor includes base wage plus statutory payroll taxes (FICA/unemployment), workers' comp insurance (scaled by EMR), and health/pension fringes.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In construction contingency budgeting, what type of contingency is systematically reduced from approximately 15% at schematic design down to 0% as final construction drawings are completed?",
      options: [
        "Design Contingency",
        "Owner Contingency",
        "Contractor Construction Contingency",
        "Legal Litigation Contingency"
      ],
      correct_option_index: 0,
      explanation: "Design contingency covers uncoordinated details and incomplete drawings during preconstruction; it shrinks to 0% when 100% construction documents are finalized.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "If a 4-man carpenter crew installs 1,600 square feet of metal stud wall framing during an 8-hour work shift, what is the calculated Labor Unit Rate in man-hours per square foot?",
      options: [
        "0.500 man-hours per square foot",
        "0.100 man-hours per square foot",
        "0.050 man-hours per square foot",
        "0.020 man-hours per square foot (4 men * 8 hours = 32 man-hours; 32 / 1600 SF = 0.020 MH/SF)"
      ],
      correct_option_index: 3,
      explanation: "Total labor hours = 4 workers * 8 hours = 32 man-hours. Unit rate = 32 man-hours / 1,600 sq ft = 0.020 man-hours per square foot.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In conceptual parametric cost estimating, how does an estimator adjust a historical project cost from City A (City Cost Index = 100) to City B (City Cost Index = 125)?",
      options: [
        "Subtract 25% from City A cost",
        "Multiply City A cost by the ratio of City B index to City A index (Cost_CityB = Cost_CityA * (125 / 100) = Cost_CityA * 1.25)",
        "Divide City A cost by 125",
        "Location indexes have zero mathematical relationship to cost"
      ],
      correct_option_index: 1,
      explanation: "Cost in City B = Cost in City A * (CCI_CityB / CCI_CityA) = Cost_CityA * (125 / 100) = 1.25 * Cost_CityA (a 25% geographic cost increase).",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "According to research on construction workforce ergonomics (such as Business Roundtable studies), what is the impact on labor productivity when craft workers are subjected to sustained 60-hour work weeks over four consecutive weeks?",
      options: [
        "Cumulative fatigue and error rates degrade labor productivity by 20% to 30%, while increasing safety incidents",
        "Labor productivity increases linearly by 60%",
        "Work output remains 100% constant with zero degradation",
        "Workers require zero rest breaks"
      ],
      correct_option_index: 0,
      explanation: "Extended overtime causes severe cumulative physical fatigue. By week 4 of 60-hour schedules, labor productivity declines by 20% to 30% compared to standard 40-hour baselines.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In construction equipment economics, what is the key difference between Ownership (Fixed) Costs and Operating (Variable) Costs?",
      options: [
        "Ownership costs only apply to small hand tools",
        "Operating costs are paid by the building owner",
        "Ownership costs occur continuously regardless of machine use (depreciation, financing interest, insurance, storage), whereas Operating costs occur only when the machine runs (fuel, lubricants, filters, wear parts)",
        "Ownership costs change every hour based on weather"
      ],
      correct_option_index: 2,
      explanation: "Ownership costs are fixed capital expenses (depreciation, interest, insurance) incurred whether the machine operates or sits idle; operating costs are incurred only during active machine hours.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In quantitative risk management, how is the Expected Monetary Value (EMV) of a recognized construction risk event calculated?",
      options: [
        "EMV = Total Project Cost divided by number of subcontractors",
        "EMV = Square root of total project insurance limits",
        "EMV is determined exclusively by bank lenders",
        "EMV = Probability of Risk Occurrence (%) * Financial Cost Impact ($)"
      ],
      correct_option_index: 3,
      explanation: "Expected Monetary Value (EMV) = Probability (%) * Impact ($). For instance, a 20% probability of a $100,000 groundwater dewatering issue yields an EMV risk reserve of $20,000.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "An estimator is calculating the fully burdened hourly rate for a journeyman electrician. The base wage is $40.00/hour. Statutory payroll taxes are 12% of base wage, Workers' Compensation Insurance is $10.00 per $100 of payroll (with an EMR of 0.80), and contractual fringe benefits are $15.00/hour. What is the total fully burdened labor rate?",
      options: [
        "$55.00 per hour",
        "$63.00 per hour (Base $40 + Taxes $4.80 + WCI $3.20 + Fringe $15.00 = $63.00/hr)",
        "$72.50 per hour",
        "$48.00 per hour"
      ],
      correct_option_index: 1,
      explanation: "Taxes = $40 * 0.12 = $4.80. WCI = ($10 / $100) * $40 * 0.80 EMR = $3.20. Fringe = $15.00. Total Burdened Rate = $40.00 + $4.80 + $3.20 + $15.00 = $63.00 per hour.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In conceptual chemical process plant estimating, the Six-Tenths Rule is applied: Cost_B = Cost_A * (Capacity_B / Capacity_A)^0.6. If a 100,000 gallon wastewater storage facility cost $2,000,000 to construct, what is the estimated cost of a new 200,000 gallon facility?",
      options: [
        "$4,000,000",
        "$2,500,000",
        "$3,031,433 (Cost = 2,000,000 * (200k / 100k)^0.6 = 2,000,000 * (2.0)^0.6 = 2,000,000 * 1.5157 = $3,031,433)",
        "$3,500,000"
      ],
      correct_option_index: 2,
      explanation: "Cost_B = $2,000,000 * (2.0)^0.6 = $2,000,000 * 1.515716 = $3,031,433. This reflects non-linear economies of scale.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "A 500-HP earthmoving scraper operates under heavy load. Diesel fuel costs $4.00 per gallon. Using the standard industrial fuel consumption formula (Gallons/Hour = HP * 0.04), what is the estimated hourly fuel operating cost for this machine?",
      options: [
        "$80.00 per hour (500 HP * 0.04 gal/hp-hr = 20 gal/hr; 20 gal * $4.00/gal = $80.00/hr)",
        "$200.00 per hour",
        "$40.00 per hour",
        "$125.00 per hour"
      ],
      correct_option_index: 0,
      explanation: "Fuel burn = 500 HP * 0.04 = 20.0 gallons per hour. Hourly cost = 20 gal/hr * $4.00/gal = $80.00 per operating hour.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In general contracting corporate finance, what is Home Office Overhead (General & Administrative - G&A) and how is it recovered in project bid proposals?",
      options: [
        "It represents the cost of lumber stored on the job site",
        "It is a penalty paid to the city building department",
        "It is a refundable security deposit returned at project finish",
        "It represents enterprise operational expenses (corporate headquarters rent, executive salaries, legal/IT fees) that cannot be directly attributed to one project, recovered by adding an allocated percentage markup (typically 3% to 6%) across all project bids"
      ],
      correct_option_index: 3,
      explanation: "Home office overhead encompasses corporate executive, accounting, and office infrastructure costs, recovered as a standardized percentage markup across the contractor's portfolio of bids.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In civil earthwork engineering, what is the volumetric relationship between Bank Cubic Yards (BCY), Loose Cubic Yards (LCY), and Compacted Cubic Yards (CCY)?",
      options: [
        "All three measurements are mathematically identical",
        "BCY represents undisturbed in-situ soil; LCY expands by 20% to 30% due to soil swell when excavated into dump trucks; CCY shrinks by 10% to 15% below bank volume when mechanically compacted into structural engineered fill",
        "Loose soil is denser than compacted soil",
        "Compacted soil has zero weight"
      ],
      correct_option_index: 1,
      explanation: "In-situ soil (BCY) swells into loose soil (LCY, 20-30% volume expansion) when disturbed by an excavator, and densifies into compacted fill (CCY, 10-15% volume shrinkage) under roller compaction.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #13.");
  console.log("Skill #13 update completed successfully!");
}

run();
