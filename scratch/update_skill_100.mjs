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

const skillId = "3c03406c-1896-4137-89b3-f58c3f897076";

async function run() {
  console.log("Updating Skill #100: Sustainable Operations Strategy (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Energy Efficiency, Renewable Procurement and Facility Decarbonization" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Zero Waste to Landfill, Industrial Symbiosis and Water Stewardship" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Sustainable Procurement, Supplier Decarbonization and Green Logistics" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / VP of Sustainable Operations & Supply Chain Director level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "ISO 50001 Energy Management and ASHRAE Energy Audits",
      order_index: 1,
      content: `### Energy Management Architecture and Facility Auditing

1. ISO 50001 Energy Management Systems (EnMS):
   - Establishes rigorous Energy Baselines (EnB) and Energy Performance Indicators (EnPI) to systematically reduce facility kilowatt-hour consumption.

2. ASHRAE Energy Audit Hierarchy:
   - Level I (Walk-Through): Preliminary low-cost operational adjustments.
   - Level II (Energy Survey & Engineering Analysis): In-depth sub-metered analysis of HVAC, thermal envelopes, and variable frequency drives (VFDs).
   - Level III (Investment-Grade Audit): High-precision financial modeling for major capital expenditure retrofits.`
    },
    {
      track_id: track1Id,
      title: "On-Site Renewables, Battery Storage and Electrification",
      order_index: 2,
      content: `### Industrial Electrification and Peak Shaving

1. Thermal Electrification:
   - Replacing natural gas industrial boilers with high-efficiency commercial heat pumps and electric boilers powered by clean electricity.

2. On-Site Solar PV and Battery Energy Storage Systems (BESS):
   - Deploying rooftop solar paired with lithium iron phosphate (LFP) BESS for peak-shaving demand charges and providing microgrid backup power.`
    },
    {
      track_id: track1Id,
      title: "Renewable Energy Contracting: VPPAs and 24/7 Carbon-Free Energy",
      order_index: 3,
      content: `### Corporate Power Purchase Agreements and Hourly Matching

1. Virtual Power Purchase Agreements (VPPAs):
   - Long-term corporate contracts with utility-scale wind and solar developers that guarantee project additionality (financing new clean generation onto the grid).

2. 24/7 Carbon-Free Energy (24/7 CFE):
   - Moving beyond annual volumetric offsetting to temporal hourly matching of energy consumption with local clean grid generation.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Zero Waste to Landfill (TRUE Certification) and Diversion",
      order_index: 1,
      content: `### Solid Waste Elimination and Facility Diversion

1. TRUE Zero Waste Standard (GBCI):
   - Requires facilities to achieve at least 90% diversion of all solid, non-hazardous operational waste from landfills, incineration facilities, and the environment.

2. Systematic Waste Stream Auditing:
   - Segregating compostable organic waste, clean commercial film plastics, pallets, and e-waste into dedicated closed-loop recycling partnerships.`
    },
    {
      track_id: track2Id,
      title: "Industrial Symbiosis and Byproduct Synergy (The Kalundborg Model)",
      order_index: 2,
      content: `### Cross-Industry Circular Synergies

1. The Kalundborg Industrial Symbiosis Model:
   - A collaborative industrial cluster where the physical waste streams, excess steam, sulfur, cooling water, and gypsum of one facility become the primary raw feedstocks for neighboring factories.
   - Drastically cuts raw material procurement costs and eliminates industrial landfill waste.`
    },
    {
      track_id: track2Id,
      title: "Alliance for Water Stewardship and Zero Liquid Discharge",
      order_index: 3,
      content: `### Watershed Resilience and Closed-Loop Water

1. Water Footprint Accounting:
   - Blue Water: Consumed surface/groundwater.
   - Green Water: Consumed rainwater.
   - Grey Water: Volume of freshwater required to assimilate chemical pollutants.

2. Zero Liquid Discharge (ZLD) Engineering:
   - Advanced membrane filtration, reverse osmosis, and thermal evaporation systems purifying 100% of industrial wastewater for perpetual in-plant closed-loop reuse.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Sustainable Procurement (ISO 20400) and EcoVadis Audits",
      order_index: 1,
      content: `### Responsible Sourcing and Supplier Governance

1. ISO 20400 Sustainable Procurement Standards:
   - Integrating mandatory ESG risk criteria, human rights protections, and environmental thresholds directly into corporate vendor RFPs.

2. Third-Party Supplier Audits (EcoVadis, Sedex SMETA):
   - Conducting annual sustainability assessments of Tier 1 and Tier 2 suppliers, requiring minimum scores for contract eligibility and vendor award renewals.`
    },
    {
      track_id: track3Id,
      title: "Carbon Insetting vs Offsetting and Agricultural Supply Chains",
      order_index: 2,
      content: `### Value Chain Decarbonization and Insetting

1. Carbon Insetting:
   - Direct corporate investment into regenerative agriculture, soil carbon sequestration, and agroforestry projects within the company's own supply chain and grower communities.

2. Insetting vs Offsetting:
   - Directly shrinks Scope 3 emissions, strengthens supplier relationships, and builds climate resilience, avoiding the reputational risks of unverified external offsets.`
    },
    {
      track_id: track3Id,
      title: "Green Logistics, Intermodal Freight and Fleet Electrification",
      order_index: 3,
      content: `### Low-Carbon Transportation and Modal Shifts

1. Modal Freight Shifts:
   - Transitioning cargo from high-emission air freight (500 g CO2e per ton-km) to maritime vessels (10-15 g) or electrified freight rail (18 g).

2. Last-Mile Fleet Electrification:
   - Transitioning urban delivery vans to battery electric vehicles (EVs) and contracting EPA SmartWay-certified logistics carriers.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #100.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "What minimum operational waste diversion rate is required for a commercial facility to achieve TRUE Zero Waste to Landfill certification?",
      options: [
        "At least 90% diversion from landfills, incineration, and the environment",
        "10%",
        "50%",
        "100% zero trash production"
      ],
      correct_option_index: 0,
      explanation: "TRUE Zero Waste certification requires facilities to divert at least 90% of non-hazardous waste away from landfills and incineration.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What international management standard provides the structured framework for organizations to establish an Energy Management System (EnMS)?",
      options: [
        "ISO 9001",
        "ISO 27001",
        "ISO 50001",
        "ISO 45001"
      ],
      correct_option_index: 2,
      explanation: "ISO 50001 is the global standard for establishing, implementing, and maintaining an Energy Management System.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In freight transport decarbonization, why is shifting cargo from air freight to maritime shipping or electric rail so impactful?",
      options: [
        "Air freight is illegal for food",
        "Air freight emits ~500g CO2e per ton-km, whereas maritime shipping emits only ~10-15g and electric rail emits ~18g (a 95%+ emissions reduction)",
        "Ships travel faster than airplanes",
        "Airplanes use solar power"
      ],
      correct_option_index: 1,
      explanation: "Modal shifts away from aviation slash freight carbon intensity by over 95% per ton-kilometer.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In corporate renewable energy procurement, what does '24/7 Carbon-Free Energy' (24/7 CFE) require?",
      options: [
        "Using electricity only in the daytime",
        "Buying carbon offsets from foreign countries",
        "Turning off factory electricity on weekends",
        "Matching every kilowatt-hour of electricity consumed on an hourly basis, in real-time, with local zero-carbon generation on the same regional grid"
      ],
      correct_option_index: 3,
      explanation: "24/7 CFE matches corporate energy use on an hourly, localized basis rather than relying on annual net-accounting averages.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In industrial ecology, what famous real-world eco-industrial park in Denmark serves as the benchmark for 'Industrial Symbiosis'?",
      options: [
        "The Kalundborg Symbiosis (where waste heat, steam, sulfur, and water from one facility become the primary raw materials for adjacent plants)",
        "The Copenhagen Shopping Mall",
        "The London Eye",
        "The Tokyo Train Station"
      ],
      correct_option_index: 0,
      explanation: "Kalundborg is the world's first working industrial symbiosis, exchanging byproducts between power plants, refineries, and factories.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In sustainable supply chain strategy, how does 'Carbon Insetting' differ fundamentally from 'Carbon Offsetting'?",
      options: [
        "Insetting is banned by the United Nations",
        "Offsetting is only for airlines",
        "Insetting costs zero dollars",
        "Insetting invests directly in decarbonization and regenerative practices within the company's own supply chain and supplier communities, directly reducing Scope 3 emissions"
      ],
      correct_option_index: 3,
      explanation: "Insetting directs capital into the company's own agricultural/manufacturing value chain, reducing Scope 3 emissions directly.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In commercial facility water management, what is a 'Zero Liquid Discharge' (ZLD) system?",
      options: [
        "Banning drinking water in offices",
        "An advanced industrial wastewater treatment engineering system that purifies and recovers 100% of wastewater for closed-loop in-plant reuse, leaving only dry solid residue",
        "Dumping untreated wastewater into rivers at night",
        "Collecting rainwater in open buckets"
      ],
      correct_option_index: 1,
      explanation: "ZLD purifies and recycles all industrial wastewater within the plant, eliminating environmental liquid effluent discharge.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In building energy efficiency, what is an 'ASHRAE Level III Investment-Grade Audit'?",
      options: [
        "A rigorous, engineering-grade thermal and electrical analysis providing comprehensive CapEx financial models, payback projections, and ROI for major facility retrofit investments",
        "A 5-minute walk through the lobby",
        "A government tax inspection",
        "An audit of employee salaries"
      ],
      correct_option_index: 0,
      explanation: "ASHRAE Level III provides rigorous financial-grade engineering modeling required to justify major capital retrofit investments.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In water footprint accounting, what is 'Grey Water'?",
      options: [
        "Water collected from rainstorms",
        "Water frozen in glaciers",
        "The theoretical volume of freshwater required to assimilate and dilute industrial chemical pollutants down to ambient regulatory water quality standards",
        "Clean drinking water from mountain springs"
      ],
      correct_option_index: 2,
      explanation: "Grey water footprint quantifies the freshwater required to dilute pollutants back to natural water quality standards.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In sustainable procurement under ISO 20400, what role do platform ratings like EcoVadis and Sedex SMETA play?",
      options: [
        "They replace the need for purchasing departments",
        "They set currency exchange rates",
        "They sell office supplies at discounts",
        "They provide standardized, evidence-based third-party audits of supplier ESG performance, enabling corporations to benchmark supply chain risks and enforce code of conduct compliance"
      ],
      correct_option_index: 3,
      explanation: "EcoVadis/Sedex evaluate supplier ESG practices, giving procurement teams objective data to enforce sustainable purchasing policies.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In corporate clean energy procurement, why are 'Virtual Power Purchase Agreements' (VPPAs) considered superior for demonstrating 'Additionality'?",
      options: [
        "VPPAs make energy free for 50 years",
        "A long-term VPPA provides revenue certainty that allows renewable developers to secure project financing and construct brand-new wind/solar farms that would not otherwise exist on the grid",
        "VPPAs require companies to build their own power plants",
        "VPPAs eliminate the need for transmission lines"
      ],
      correct_option_index: 1,
      explanation: "Additionality proves that the corporate contract directly enabled the construction of new clean renewable generation capacity.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In facility energy operations, what is 'Peak Shaving' using Battery Energy Storage Systems (BESS) and why is it financially advantageous?",
      options: [
        "Cutting tree branches around power lines",
        "Turning off factory lights during lunch breaks",
        "Discharging stored battery electricity during brief periods of maximum facility energy demand to prevent expensive utility peak demand capacity surcharges",
        "Selling solar panels to employees"
      ],
      correct_option_index: 2,
      explanation: "Peak shaving uses battery power during maximum load spikes, avoiding costly commercial utility peak demand charges.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In thermal facility decarbonization, why are 'Industrial Commercial Heat Pumps' replacing natural gas boilers across manufacturing and office assets?",
      options: [
        "They achieve Coefficients of Performance (COP) of 3.0 to 4.5, transferring 3 to 4.5 units of heat for every 1 unit of electricity consumed while generating zero on-site Scope 1 combustion emissions",
        "Because natural gas is illegal worldwide",
        "Heat pumps do not use electricity",
        "Heat pumps make buildings colder in winter"
      ],
      correct_option_index: 0,
      explanation: "Heat pumps achieve >300-450% thermodynamic efficiency, eliminating on-site Scope 1 fossil fuel combustion entirely.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Extended Producer Responsibility (EPR) regulations, what legal and operational obligation is placed on manufacturers?",
      options: [
        "Manufacturers must pay employee healthcare costs",
        "Manufacturers must lower product prices every year",
        "Manufacturers are prohibited from exporting products",
        "Manufacturers must organize, finance, and execute take-back, recycling, and safe end-of-life management for the post-consumer packaging and products they put on the market"
      ],
      correct_option_index: 3,
      explanation: "EPR laws make producers financially and physically responsible for the entire end-of-life collection and recycling of their products.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In corporate logistics decarbonization, what standard is set by the US EPA 'SmartWay' program?",
      options: [
        "Building smart highways for self-driving cars",
        "A voluntary public-private partnership benchmarking, verifying, and certifying logistics carriers on fuel efficiency and emissions performance to help shippers select green transport fleets",
        "Developing battery-powered airplanes",
        "Banning diesel trucks in city centers"
      ],
      correct_option_index: 1,
      explanation: "SmartWay certifies freight carriers on fuel efficiency and emissions, allowing enterprise shippers to quantify and lower freight emissions.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #100.");
  console.log("Skill #100 update completed successfully!");
}

run();
