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

const skillId = "fdeaac5a-5693-4aad-ab21-4216984ca1c0";

async function run() {
  console.log("Updating Skill #12: Contractor & Vendor Coordination (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Subcontract Procurement, Scope Packages and Contract Law" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Submittals, RFIs, BIM Coordination and Field Execution" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Supply Chain Logistics, Quality Control and Project Closeout" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Subcontract Scope Packaging, Unbundling and Scope Gap Mitigation",
      order_index: 1,
      content: `### Engineering Subcontract Trade Scope Packages

In commercial construction management, General Contractors (GCs) unbundle 100% Construction Documents into discrete, well-defined trade bid packages (e.g. Earthwork & Utilities, Cast-in-Place Concrete, Structural Steel, Mechanical HVAC, Building Enclosure):

1. Scope Gaps vs Scope Overlaps:
   - Scope Gap: An essential piece of work omitted from all trade packages (e.g. no trade contracted to grout base plates under steel columns). Results in expensive emergency change orders.
   - Scope Overlap: Duplicate work included in two separate trade contracts (e.g. both concrete and steel trades billing for cast-in anchor bolts). Results in inflated project costs.

2. Scope Matrix Management:
   - A detailed cross-trade responsibility matrix defining exact handoff boundaries:
     - Who furnishes embedded items vs who installs them in concrete forms.
     - Who provides temporary 120V power panels vs who wires electrical connections.
     - Who performs floor slab moisture testing prior to flooring installation.

3. Procurement Lifecycle:
   - Invitation to Bid (ITB / RFP) issuance, pre-bid job site conferences, formal addenda distribution, and mandatory bid submission deadlines.`
    },
    {
      track_id: track1Id,
      title: "Subcontractor Prequalification, Vetting and Bid Leveling",
      order_index: 2,
      content: `### Vetting Subcontractor Capacity and Financial Solvency

Awarding subcontracts solely on the lowest price frequently leads to trade contractor default, schedule abandonment, and catastrophic delays. Comprehensive vetting requires multi-dimensional prequalification:

1. Quantitative Prequalification Metrics:
   - Balance Sheet Analysis: Current Ratio (\`Current Assets / Current Liabilities >= 1.3\`), Working Capital sufficiency, and Debt-to-Equity ratios.
   - Surety Bonding Capacity: Verifying single project bonding capacity and aggregate bonding limits through surety letters of bondability.
   - Safety Performance: Experience Modification Rate (\`EMR < 1.0\`, with elite thresholds < 0.85) and OSHA 300 log incident histories.
   - Current Workload Capacity: Backlog-to-capacity ratios preventing over-extended trade commitments.

2. Bid Leveling (De-Scoping Process):
   - Trade bids arrive with differing qualifications, material inclusions, and labor exclusions.
   - Bid leveling tabulates and normalizes bids onto a standardized spreadsheet:
     - Equalizing exclusions (e.g. adding crane hoisting costs if a bidder excluded rigging).
     - Standardizing labor wage rates (Davis-Bacon prevailing wage vs open shop).
     - Normalizing material escalation clauses and delivery lead time commitments to identify the true lowest responsive and responsible bidder.`
    },
    {
      track_id: track1Id,
      title: "Construction Subcontracts, Risk Allocation and Critical Clauses",
      order_index: 3,
      content: `### Subcontract Agreement Architecture (AIA A401 / ConsensusDocs 750)

Subcontract agreements legally define the commercial relationship between General Contractor and Subcontractor:

1. Critical Risk-Shifting Clauses:
   - "Pay-When-Paid" vs "Pay-If-Paid":
     - Pay-When-Paid: A timing mechanism establishing that the GC will pay the subcontractor within a reasonable time after receiving payment from the Owner (does not excuse GC payment if owner becomes insolvent).
     - Pay-If-Paid: A true condition precedent. The subcontractor bears 100% of owner insolvency risk; the GC has zero legal obligation to pay the trade if the Owner fails to pay. (Prohibited or strictly limited in several state jurisdictions).
   - Flow-Down (Pass-Through) Provision: Subcontractors are legally bound to the GC by all terms, general conditions, drawings, specifications, and dispute resolution procedures of the prime contract between Owner and GC.
   - Indemnification and Hold Harmless: Obligates the subcontractor to defend and indemnify the GC and Owner against claims arising from the subcontractor's negligent performance (governed by state anti-indemnity statutes).

2. Retainage and Liquidated Damages:
   - Retainage Withholding: Typically 5% to 10% withheld from monthly progress billing until final project completion and punch list sign-off.
   - Pass-Through Liquidated Damages: Passing owner delay penalties directly to the subcontractor whose performance breached the critical path.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Submittal Administration, Shop Drawings and Delegated Design",
      order_index: 1,
      content: `### The Construction Submittal Protocol (AIA A201 Section 3.12)

Submittals ensure that trade fabrications and manufactured equipment conform strictly to architectural and engineering design intent:

1. Submittal Categories:
   - Shop Drawings: Precise fabrication and installation drawings prepared by trade draftsmen (e.g. structural steel connection detailing, custom casework profiles, precast panel reinforcement).
   - Product Data: Manufacturer technical specification cut sheets, flame spread ratings, and thermal U-factors.
   - Physical Samples: Material finish samples (anodized aluminum color chips, brick masonry panels, carpet tiles).
   - Delegated Design Submittals: Structural calculations and drawings engineered and stamped by a licensed Professional Engineer (PE) hired by the trade contractor (e.g. structural steel connection design, metal stud curtain wall engineering, fire sprinkler hydraulic calculations).

2. The Submittal Review Workflow:
   - Subcontractor creates and submits package -> General Contractor performs initial quality check and stamps approval -> Architect / Engineer (A/E) conducts technical design review.

3. Standard Action Review Stamps:
   - Approved / No Exceptions Taken.
   - Approved as Noted / Make Corrections Noted (work may proceed incorporating noted edits).
   - Revise and Resubmit (R&R - work cannot proceed until revised drawings are re-reviewed).
   - Rejected.`
    },
    {
      track_id: track2Id,
      title: "Requests for Information (RFIs) and Design Clarification",
      order_index: 2,
      content: `### Management of Requests for Information (RFIs)

An RFI is the formal digital communication mechanism used by contractors to request design clarification from architects and engineers regarding conflicting, ambiguous, or missing construction details:

1. Professional RFI Protocol:
   - Clear Problem Statement: Referencing specific drawing sheet numbers, detail bubbles, and specification section paragraphs.
   - Proposed Solution (Contractor Recommendation): Efficient RFIs always suggest a constructible, cost-effective field solution with proposed material specifications.

2. Tracking Metrics and Service Level Agreements (SLAs):
   - Contractual Turnaround Limits: Standard prime contracts mandate design team RFI responses within 7 to 14 calendar days.
   - RFI Impact Classification:
     - Clarification Only (zero cost or schedule impact).
     - Potential Cost Impact (triggers Contractor Change Proposal).
     - Potential Schedule Critical Path Impact.

3. Downstream Design Directives:
   - Architect's Supplemental Instructions (ASI): Minor design changes issued by the architect that do not alter contract sum or project duration.
   - Construction Change Directive (CCD): A binding order directing immediate field work when cost/time negotiations are ongoing.`
    },
    {
      track_id: track2Id,
      title: "BIM Clash Detection and Multi-Trade Coordination Meetings",
      order_index: 3,
      content: `### Virtual Design and Construction (VDC) Multi-Trade Coordination

Modern commercial construction coordinates MEPF (Mechanical, Electrical, Plumbing, Fire Protection) systems virtually before fabrication:

1. BIM Level of Development (LOD Standards / BIMForum):
   - LOD 300: Specific assemblies with precise quantity, size, shape, and location (Design intent).
   - LOD 400: Fabrication and assembly level detail with exact hangers, flanges, and shop detailing.
   - LOD 500: Field-verified As-Built conditions.

2. Clash Detection in Federated 3D Models (Navisworks / Revizto):
   - Hard Clashes: Physical spatial intersection of two solid components (e.g. a 24-inch HVAC supply duct colliding with a structural steel wide-flange beam).
   - Soft Clashes (Clearance Clashes): Violations of required maintenance access envelopes (e.g. electrical switchgear door swings blocked by plumbing pipes).
   - 4D Temporal Clashes: Clashes where work zones overlap in time.

3. Trade Spatial Priority Hierarchy:
   - Priority 1: Gravity Drainage Plumbing (Sloped waste lines cannot be easily rerouted).
   - Priority 2: Large HVAC Ductwork and Hydronic Mains.
   - Priority 3: Fire Protection Sprinkler Mains.
   - Priority 4: Electrical Cable Trays and Flexible Conduit.

4. Weekly Multi-Trade Coordination Meetings:
   - Reviewing clash viewpoints, signing off on coordination zone ceiling elevations, resolving trade interface disputes, and tracking 3-week rolling lookahead schedules.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Long-Lead Procurement, Vendor Expediting and Site Logistics",
      order_index: 1,
      content: `### Critical Supply Chain and Equipment Expediting

Procuring major engineered equipment requires active vendor management to prevent schedule derailment:

1. Long-Lead Tracking Matrix:
   - Tracking engineered equipment with extensive factory manufacturing lead times (e.g. 500-ton centrifugal chillers, medium-voltage switchgear, custom curtain wall cassettes with 24 to 52-week lead times).
   - Milestones: Submittal approval date -> Factory release date -> Manufacturing completion -> Factory Witness Testing (FWT) -> Freight shipment -> On-site delivery date.

2. Stored Materials Off-Site:
   - Owners require strict security protocols before paying for off-site stored materials:
     - Stored in a bonded, insured commercial warehouse.
     - Materials segregated, clearly labeled with project name.
     - General Contractor files a UCC-1 Financing Statement securing legal title.

3. Job Site Material Staging and Hoisting Logistics:
   - Just-In-Time (JIT) Material Deliveries: Coordinating urban site deliveries to prevent congestion on public streets.
   - Hoisting Resource Scheduling: Allocating shared tower crane hook-time and external buck hoist elevator hours among competing trades to ensure smooth material movement.`
    },
    {
      track_id: track3Id,
      title: "Quality Assurance / Quality Control (QA/QC) and Non-Conformance",
      order_index: 2,
      content: `### Construction Quality Management Systems

Quality assurance prevents expensive demolition, rework, and structural defects:

1. The Three-Phase Control System (USACE / NAVFAC Quality Model):
   - Preparatory Phase (Pre-Installation Conference): Conducted prior to starting any new work feature. Reviews approved shop drawings, verifies on-site material certifications, inspects underlying substrate readiness, and reviews safety requirements.
   - Initial Phase: Conducted upon completing the first representative portion of work (e.g. first 50 feet of concrete wall or first completed rough-in room). Establishes the acceptable quality benchmark for the entire project.
   - Follow-Up Phase: Daily continuous field inspections ensuring ongoing production matches the established benchmark.

2. First-In-Place Mockups:
   - Constructing standalone physical mockups of complex building envelopes (e.g. 20x20 ft exterior wall mockup including brick veneer, window frame, flashing, and air barrier) subjected to ASTM E331 water penetration and ASTM E283 air leakage chamber testing.

3. Non-Conformance Reports (NCR):
   - Formal documentation issued when work fails to meet contract specifications. Documents deficiency with photographs, identifies root cause, mandates contractor corrective action plan, and requires formal engineering re-inspection prior to closure.`
    },
    {
      track_id: track3Id,
      title: "Subcontract Closeout, Lien Waivers and Warranty Management",
      order_index: 3,
      content: `### Project Commissioning and Subcontract Closeout

Closing out trade subcontracts requires financial, legal, and operational coordination:

1. Substantial Completion and Punch Lists:
   - Substantial Completion (AIA Document G704): The legal milestone certified by the Architect when the project is sufficiently complete for the Owner to occupy for its intended use. Starts statutory warranty clocks and shifts building insurance to Owner.
   - Punch List Administration: Compiling digital punch lists of minor cosmetic deficiencies, assigning items to specific trades, and verifying completion before final payment.

2. Statutory Mechanics Lien Waivers:
   - Lien waivers protect the Owner and GC against unpaid subcontractor or supplier mechanics liens:
     - Conditional Progress Waiver: Discharges lien rights for work billed through a specific date, contingent upon check clearance.
     - Unconditional Progress Waiver: Legally binding immediate release of lien rights up to payment date (executed after payment clears).
     - Conditional Final Waiver: Surrenders all remaining lien and retainage rights upon receipt of final contract balance.
     - Unconditional Final Waiver: Complete, absolute legal release of all property lien rights.

3. Closeout Deliverable Packages:
   - As-Built Record Drawings (redline drawings reflecting actual field routing).
   - Operations & Maintenance (O&M) Manuals.
   - Attic Stock Deliverables: Contractually required spare materials (typically 2% to 5% extra ceiling tiles, floor tiles, and paint cans).
   - 1-Year General Contractor Comprehensive Warranty and Extended Manufacturer Equipment Warranties (e.g. 20-year NDL roof membrane warranty).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #12.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "What legal milestone, certified by the Architect on AIA Document G704, signifies that a building is sufficiently complete for the Owner to occupy for its intended use?",
      options: [
        "Final Contract Procurement",
        "Submittal Approval",
        "Substantial Completion",
        "Bid Leveling Milestone"
      ],
      correct_option_index: 2,
      explanation: "Substantial Completion is the formal legal milestone where the facility is fit for occupancy, transferring building custody and starting warranty periods.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In construction trade coordination, what trade system is assigned top routing priority in ceiling plenums because its lines must slope continuously for gravity flow?",
      options: [
        "Gravity Drainage Plumbing",
        "Flexible Electrical Conduit",
        "Low-Voltage Telecom Data Cabling",
        "Fire Alarm Strobe Wiring"
      ],
      correct_option_index: 0,
      explanation: "Gravity drainage plumbing must follow fixed continuous downhill slopes, giving it highest spatial routing priority over pressurized and flexible systems.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What formal document is used by contractors to request clarification from the architectural and engineering design team regarding conflicting or missing drawing details?",
      options: [
        "Non-Conformance Report (NCR)",
        "Purchase Order (PO)",
        "Bill of Lading",
        "Request for Information (RFI)"
      ],
      correct_option_index: 3,
      explanation: "A Request for Information (RFI) is the formal administrative tool used by contractors to obtain written clarification of ambiguous or conflicting design documents.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What percentage of monthly progress billing is traditionally withheld as Retainage to ensure subcontractor project completion and punch list closeout?",
      options: [
        "50% Retainage",
        "5% to 10% Retainage",
        "0% Retainage",
        "30% Retainage"
      ],
      correct_option_index: 1,
      explanation: "Commercial construction contracts standardly withhold 5% to 10% retainage from progress payments until final completion and punch list resolution.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What is the primary objective of constructing a standalone First-In-Place exterior wall mockup on a commercial project site?",
      options: [
        "To provide a breakroom for construction workers",
        "To test structural demolition explosives",
        "To establish an acceptable quality benchmark and conduct physical chamber testing for air leakage (ASTM E283) and water penetration (ASTM E331) before full-scale installation",
        "To store spare plumbing supplies"
      ],
      correct_option_index: 2,
      explanation: "Full-scale exterior mockups establish workmanship quality benchmarks and undergo rigorous air/water chamber testing prior to mass facade installation.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In construction subcontracting law, what is the critical legal difference between a 'Pay-If-Paid' clause and a 'Pay-When-Paid' clause?",
      options: [
        "Pay-When-Paid only applies to government contracts",
        "A Pay-If-Paid clause creates a true condition precedent shifting 100% of owner insolvency risk to the subcontractor, whereas Pay-When-Paid is a timing mechanism requiring payment within a reasonable time even if the owner defaults",
        "Pay-If-Paid requires payment in gold bullion",
        "There is zero legal distinction between the two clauses"
      ],
      correct_option_index: 1,
      explanation: "Pay-If-Paid makes owner payment an absolute condition precedent to subcontractor payment (shifting insolvency risk), whereas Pay-When-Paid merely governs payment timing.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In 3D BIM coordination, what is the definition of a 'Soft Clash' (Clearance Clash)?",
      options: [
        "A collision between two soft materials like insulation",
        "A software crash in the 3D graphics card",
        "A scheduling delay caused by weather",
        "An encroachment of a building component into a required maintenance access zone, equipment clearance envelope, or code-mandated egress clearance"
      ],
      correct_option_index: 3,
      explanation: "A soft clash occurs when geometry invades an operational clearance or maintenance access envelope (such as panel swing access) without physical solid-to-solid intersection.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In the USACE / NAVFAC Three-Phase Quality Control System, what occurs during the 'Preparatory Phase' (Pre-Installation Conference)?",
      options: [
        "The project team reviews approved shop drawings, verifies on-site material certifications, inspects substrate readiness, and reviews safety requirements prior to starting work",
        "The building is demolished and re-excavated",
        "The final retainage check is issued to the subcontractor",
        "Workers are sent home on paid vacation"
      ],
      correct_option_index: 0,
      explanation: "The Preparatory Phase is held before starting any work feature to align submittals, inspect materials and substrates, and review safety and quality standards.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What is the function of the Flow-Down (Pass-Through) provision in standard AIA A401 subcontract agreements?",
      options: [
        "It forces rainwater to flow downward through roof drains",
        "It reduces subcontractor insurance limits by 50%",
        "It binds the subcontractor to the General Contractor by the exact same terms, general conditions, drawings, specifications, and dispute resolution rules of the prime contract with the Owner",
        "It allows subcontractors to bill the owner directly"
      ],
      correct_option_index: 2,
      explanation: "The Flow-Down clause binds the subcontractor to all prime contract terms and responsibilities assumed by the General Contractor toward the Owner.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "What process tabulates and normalizes disparate subcontractor bids to equalize excluded items, adjust labor rates, and identify the true lowest responsive and responsible bidder?",
      options: [
        "Fast-Tracking",
        "Bid Leveling (De-Scoping)",
        "Critical Path Analysis",
        "Forensic Delay Quantification"
      ],
      correct_option_index: 1,
      explanation: "Bid Leveling (De-scoping) equalizes varying inclusions, exclusions, and labor assumptions across competing trade proposals to evaluate true comparative costs.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "What type of statutory Mechanics Lien Waiver provides a legally binding, immediate release of lien rights for progress billing only after the contractor confirms that payment funds have cleared the bank?",
      options: [
        "Conditional Final Lien Waiver",
        "Unconditional Final Lien Waiver",
        "Pre-Bid Affidavit",
        "Unconditional Progress Lien Waiver"
      ],
      correct_option_index: 3,
      explanation: "An Unconditional Progress Lien Waiver provides an immediate, unconditional release of lien rights up to a specific billing date, executed once funds clear the bank.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In construction subcontract administration, what constitutes a 'Delegated Design' submittal?",
      options: [
        "Engineering calculations and drawings prepared, stamped, and sealed by a licensed Professional Engineer (PE) hired by the trade contractor for specialized systems (e.g. curtain wall anchoring, pre-engineered trusses)",
        "A submittal drafted by an unlicensed intern",
        "A verbal agreement made on the job site",
        "A manufacturer catalog brochure downloaded from the internet"
      ],
      correct_option_index: 0,
      explanation: "Delegated design transfers specific engineering design responsibility for specialized assemblies (e.g. connections, curtain walls) to a licensed engineer retained by the trade contractor.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "What legal financing document must be filed by a General Contractor under the Uniform Commercial Code (UCC) to protect the Owner's legal ownership of high-value materials stored in an off-site bonded warehouse prior to installation?",
      options: [
        "AIA G702 Pay Application",
        "OSHA 300 Log",
        "UCC-1 Financing Statement",
        "SWPPP Stormwater Permit"
      ],
      correct_option_index: 2,
      explanation: "Filing a UCC-1 Financing Statement establishes public notice of a perfected security interest in off-site stored materials, protecting the Owner's title against warehouse creditor claims.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "According to BIMForum Level of Development (LOD) standards, what LOD level corresponds to 3D model elements containing complete fabrication, assembly, and precise shop installation detailing?",
      options: [
        "LOD 200 (Generic System)",
        "LOD 400 (Fabrication and Assembly)",
        "LOD 100 (Conceptual Massing)",
        "LOD 300 (Design Intent)"
      ],
      correct_option_index: 1,
      explanation: "LOD 400 represents model elements detailed with sufficient fabrication, connection, and assembly detail for direct manufacturing and shop fabrication.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "What formal document is issued by an Architect when a design change is required that impacts construction cost or schedule, but the Owner and Contractor have not yet agreed upon final pricing adjustments?",
      options: [
        "Construction Change Directive (CCD)",
        "Architect's Supplemental Instruction (ASI)",
        "Certificate of Occupancy (CO)",
        "RFI Response"
      ],
      correct_option_index: 0,
      explanation: "A Construction Change Directive (CCD / AIA G714) directs immediate execution of work when cost or schedule terms are pending negotiation, preventing critical path stoppages.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #12.");
  console.log("Skill #12 update completed successfully!");
}

run();
