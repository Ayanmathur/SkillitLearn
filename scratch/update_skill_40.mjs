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

const skillId = "12371b3f-3c58-488f-b15c-25b813fb98d4";

async function run() {
  console.log("Updating Skill #40: Reservations & Front Desk Operations (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Property Management Systems (PMS), Channel Distribution and RevPAR Math" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Dynamic Yield Management, Front Desk Cycles and Walk Protocols" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Night Audit Accounting, Emergency Reporting and Billing Ledgers" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Cornell Hospitality Management level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "PMS Architecture, Core Data Models and Room Inventory States",
      order_index: 1,
      content: `### Property Management System (PMS) Architecture

The Property Management System (Oracle Opera Cloud, Amadeus, Infor HMS) serves as the central operational hub for all hotel data:

1. Core Data Models and Relational Architecture:
   - Central Guest Profiles: Relational store tracking contact details, loyalty tiers, billing histories, and room preferences.
   - Room Inventory State Taxonomy:
     - Clean / Inspected: Inspected by housekeeping supervisor; ready for immediate guest check-in.
     - Dirty / Vacant: Checked-out guest departed; awaiting housekeeping sanitization.
     - Out of Order (OOO): Structural defect or renovation; removed completely from available inventory (reduces room count denominator in occupancy math).
     - Out of Service (OOS): Minor maintenance issue (e.g. broken remote control); can be sold in an emergency if needed (remains in available room inventory).

2. Precision Room Blocking:
   - Assigning specific room numbers prior to arrival for VIPs, extended-stay guests, and connecting room requests.`
    },
    {
      track_id: track1Id,
      title: "Distribution Architecture: GDS, OTAs, Direct Engines and Channel Managers",
      order_index: 2,
      content: `### Electronic Distribution Channels and Two-Way Channel Managers

Hotel rooms are perishable assets that must be distributed across global reservation networks in real time:

1. The Global Distribution Matrix:
   - Global Distribution Systems (GDS - Sabre, Amadeus, Travelport): High-speed B2B reservation networks connecting over 600,000 corporate travel agents and booking platforms (Concur).
   - Online Travel Agencies (OTAs - Booking.com, Expedia Group): High-volume third-party consumer channels charging 15% to 25% commission margins.
   - Direct Brand Booking Engines (Direct-to-Consumer): Zero-commission reservations captured on hotel websites.

2. Two-Way Channel Managers (SiteMinder, SynXis):
   - Central Reservation Systems (CRS) maintaining two-way API synchronization across all 50+ booking channels.
   - Instantly adjusts rates and pushes inventory decrements within 2 seconds of a booking, eliminating double-bookings and rate parity violations.`
    },
    {
      track_id: track1Id,
      title: "Revenue Metrics: ADR, RevPAR, Occupancy and TrevPAR Mathematics",
      order_index: 3,
      content: `### Quantitative Revenue Management Analytics

Hotel asset performance is evaluated through standardized financial yield formulas:

1. Core Performance Equations:
\`\`\`
Occupancy Percentage (Occ %) = (Total Rooms Sold / Total Available Rooms) * 100%
Average Daily Rate (ADR) = Total Room Revenue / Total Rooms Sold
Revenue Per Available Room (RevPAR) = Total Room Revenue / Total Available Rooms = ADR * Occupancy Rate
Total Revenue Per Available Room (TrevPAR) = (Room Revenue + F&B + Spa + Parking) / Total Available Rooms
Gross Operating Profit Per Available Room (GOPPAR) = Gross Operating Profit / Total Available Rooms
\`\`\`

2. ADR vs Occupancy Strategy:
   - High RevPAR driven by high ADR is significantly more profitable than identical RevPAR driven by high Occupancy.
   - Why: High occupancy incurs variable operating expenses (housekeeping labor, linen laundry, room amenities, and water/power utilities), whereas rate increases flow directly to gross operating profit.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Dynamic Yield Management, Rate Fences and Overbooking Calculus",
      order_index: 1,
      content: `### Algorithmic Yield Optimization and Capacity Modeling

1. Dynamic Pricing and Rate Restrictions:
   - Algorithmic rate adjustments responding in real time to booking velocity, local convention demand, and competitor pricing.
   - Rate Fences: Minimum Length of Stay (MLOS) during peak event weekends, Closed to Arrival (CTA), and Non-Refundable Advance Purchase (NRAP) restrictions protecting occupancy buffers.

2. Statistical Overbooking Mathematics:
   - Deliberately booking inventory to 103% to 108% of physical capacity to offset historical wash percentages (cancellations, no-shows, and early departures).
   - Minimizes empty unsold rooms (spoilage) while managing walk risk.

3. Displacement Analysis:
   - Calculating whether accepting a large discounted group contract (e.g. 100 rooms at $180/night) yields more net profit than selling those rooms to transient leisure guests at full retail price ($280/night) after factoring group banquet spend.`
    },
    {
      track_id: track2Id,
      title: "The Front Desk Registration Cycle: Authorizations, RFID and Upselling",
      order_index: 2,
      content: `### Front Desk Execution and Credit Pre-Authorization

1. Frictionless Registration Protocol:
   - Verifying matching government photo identification, confirming reservation departure date, and acknowledging loyalty membership status.

2. Credit Card Pre-Authorization Holds:
   - Authorizing the guest credit card at check-in for the full estimated Room and Tax total plus a mandatory daily incidental deposit ($50 to $150 per night).
   - Guarantees financial solvency for room service, restaurant charges, mini-bar consumption, and damage without requiring cash deposits.

3. RFID Keycard Encoding:
   - Programming encrypted radio-frequency identification (RFID) keycards with sector access rules (guest room, elevator floor restrictions, executive lounge, fitness center) and automatic expiration at 11:00 AM on departure day.

4. Strategic Check-In Upselling:
   - Offering arriving guests premium upgrades (penthouse suites, oceanfront views, club lounge access) at discounted check-in rates, generating pure profit from perishable luxury inventory.`
    },
    {
      track_id: track2Id,
      title: "Walked Guest Mitigation Protocols and Relocation Service",
      order_index: 3,
      content: `### Relocation Protocols and Overbooking Crisis Resolution

When deliberate overbooking models collide with zero cancellations, the hotel must execute 'walking' a guest:

1. Candidate Selection Criteria for Walking:
   - NEVER walk VIPs, top-tier loyalty members, multi-night guests, or wedding/convention attendees.
   - Select local, single-night, non-loyalty OTA bookings arriving late in the evening.

2. The Professional 'Walk' Service Protocol:
   - The Front Office Manager speaks privately with the guest in an executive office (never publicly at the front desk).
   - Step 1: Provide equivalent or superior accommodations at an upscale partner hotel at company expense.
   - Step 2: Provide complimentary luxury private transportation (Uber Black or hotel house car).
   - Step 3: Pay the first night's room and tax in full at the alternate property.
   - Step 4: Provide a complimentary future stay certificate and a personal letter of apology from the General Manager.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "The Night Audit: Room & Tax Posting, Trial Balances and Day Roll",
      order_index: 1,
      content: `### Financial Accounting and the Daily Night Audit Cycle

The Night Audit shift (11:00 PM to 7:00 AM) acts as the financial closing control for the hotel property:

1. The Night Audit Sequence:
   - Step 1 (Bucket Check): Verifying physical/digital registration cards against PMS room rates and credit card authorization totals to catch posting errors.
   - Step 2 (Posting Room and Tax): Automated batch posting of daily room charges, municipal occupancy taxes, and resort fees across all occupied folios.
   - Step 3 (Trial Balance Reconciliation): Reconciling all point-of-sale departmental revenue (restaurants, bars, spa, parking) against front desk cashier summaries.
   - Step 4 (Ledger Balancing): Balancing the Guest Ledger (in-house guest balances) and City Ledger (corporate direct-bill accounts).
   - Step 5 (Rolling the Day): Advancing the PMS system date to the new business day.`
    },
    {
      track_id: track3Id,
      title: "Emergency Contingency Reports and Disaster Downtime Operations",
      order_index: 2,
      content: `### Operational Continuity and Life-Safety Documentation

1. Mandatory Nightly Emergency Reports:
   - Emergency In-House Guest Manifest: A printed physical list of all currently occupied room numbers, registered guest counts, and rooms designated for disabled guests (mandatory for first responders during overnight fires or structural emergencies).
   - Room Status & Housekeeping Report: Physical snapshot of clean, dirty, and OOO rooms.

2. Cloud PMS Disaster Downtime Protocols:
   - Generating local offline digital backups (Arrivals List, Departures List, In-House Ledger) every 4 hours.
   - Manual Downtime Execution: Operating standalone manual credit card imprinters and offline standalone keycard encoders during internet outages or cloud PMS server downtime.`
    },
    {
      track_id: track3Id,
      title: "Folio Management, Express Checkout and Chargeback Defense",
      order_index: 3,
      content: `### Billing Ledgers, Digital Settlements and Chargeback Prevention

1. Advanced Folio Management:
   - Master Folios (Routing A): Routing room and tax charges to corporate master billing accounts.
   - Incidental Folios (Routing B): Routing personal discretionary charges (room service, movies, mini-bar) to the guest's personal credit card.

2. Frictionless Express Checkout:
   - Automatically emailing detailed itemized folios overnight; guests depart without standing in front desk lines, while PMS automatically captures authorized card balances.

3. Credit Card Chargeback Defense:
   - Archiving EMV chip-and-PIN transaction logs, electronic signature capture, and electronic keycard door lock access timestamps to decisively dispute fraudulent chargeback claims.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #40.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "What hotel revenue management metric calculates the total room revenue divided by the total number of available rooms in the hotel (or ADR multiplied by Occupancy Rate)?",
      options: [
        "Gross Domestic Product (GDP)",
        "Customer Acquisition Cost (CAC)",
        "Revenue Per Available Room (RevPAR)",
        "Return on Equity (ROE)"
      ],
      correct_option_index: 2,
      explanation: "RevPAR = Total Room Revenue / Total Available Rooms = ADR * Occupancy Rate, measuring room revenue generation efficiency across total capacity.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In hotel Property Management Systems (PMS), what room status code indicates that a room is undergoing structural repairs and is completely removed from available inventory (reducing the room denominator in occupancy calculations)?",
      options: [
        "Out of Order (OOO)",
        "Dirty / Vacant",
        "Clean / Inspected",
        "Out of Service (OOS)"
      ],
      correct_option_index: 0,
      explanation: "Out of Order (OOO) rooms are removed from total available inventory counts; Out of Service (OOS) rooms remain in inventory.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "Why do hotels pre-authorize a guest's credit card at check-in for the full room & tax amount plus a daily incidental deposit ($50-$150/night)?",
      options: [
        "To charge extra fees in secret",
        "To buy gifts for the front desk staff",
        "To pay hotel property taxes immediately",
        "To place a temporary financial hold ensuring funds are available for room service, mini-bar, restaurant charges, and damages before checkout"
      ],
      correct_option_index: 3,
      explanation: "Incidental pre-authorization holds ensure guaranteed payment for discretionary in-stay purchases and prevent unpaid balances.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What primary task is executed by the hotel Night Audit during the overnight shift?",
      options: [
        "Cooking breakfast for the kitchen",
        "Closing the daily financial ledger, posting room and tax charges across all folios, balancing departmental revenue, and advancing the PMS business date",
        "Painting guest room walls",
        "Washing all hotel bed sheets"
      ],
      correct_option_index: 1,
      explanation: "The Night Audit reconciles daily financial transactions, posts room & tax, balances ledgers, and rolls the system date forward.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What electronic systems (such as Sabre, Amadeus, and Travelport) connect hotels to over 600,000 corporate travel agents and enterprise booking tools globally?",
      options: [
        "Social Media Networks",
        "Local Cable TV",
        "Global Distribution Systems (GDS)",
        "Bluetooth Beacons"
      ],
      correct_option_index: 2,
      explanation: "Global Distribution Systems (GDS) are global B2B networks enabling corporate travel management platforms to book hotel inventory.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In hotel financial strategy, why is achieving a high RevPAR driven by high Average Daily Rate (ADR) significantly more profitable than achieving the identical RevPAR driven by high Occupancy?",
      options: [
        "Because ADR does not require math",
        "High occupancy incurs variable operating costs (housekeeping wages, linen laundry, room amenities, and water/power utilities), whereas ADR rate increases flow directly to gross operating profit",
        "Because high occupancy makes hotels illegal",
        "There is zero financial difference"
      ],
      correct_option_index: 1,
      explanation: "Higher occupancy incurs variable costs per occupied room; rate-driven RevPAR captures pure margin without increasing operational labor and utility expenses.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In revenue management, what is 'Statistical Overbooking' and why do hotels deliberately book beyond 100% physical capacity on peak nights?",
      options: [
        "An accidental software glitch",
        "A system designed to make guests angry",
        "A way to build more floors on the hotel",
        "Deliberately booking to 103%-108% capacity to offset historical cancellation, no-show, and early departure wash percentages, ensuring 100% full occupancy"
      ],
      correct_option_index: 3,
      explanation: "Overbooking offsets predictable cancellation and no-show rates, protecting the hotel against empty rooms (spoilage) on high-demand dates.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "If an overbooked hotel must 'Walk' a guest to another property due to zero cancellations, what is the mandatory service protocol?",
      options: [
        "Provide equivalent or upgraded accommodations at an upscale partner hotel at company expense, provide private luxury transit, cover the first night, and provide a future stay certificate",
        "Lock the front door and ignore the guest",
        "Tell the guest to sleep in their car",
        "Charge the guest a cancellation penalty"
      ],
      correct_option_index: 0,
      explanation: "Professional walk protocols require arranging and paying for comparable accommodations, luxury transit, and future compensation.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What critical physical document must the Night Auditor print and store at the front desk every night for emergency first responders?",
      options: [
        "A list of hotel recipes",
        "The employee payroll summary",
        "The Emergency In-House Guest Manifest (listing all occupied rooms, registered guest counts, and designated rooms for guests with disabilities)",
        "The restaurant cocktail menu"
      ],
      correct_option_index: 2,
      explanation: "The emergency in-house guest manifest provides life-safety details to fire departments during overnight building evacuations.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In hotel distribution, what is the role of a Two-Way Channel Manager (such as SiteMinder)?",
      options: [
        "To switch TV channels in guest rooms",
        "It maintains real-time two-way API synchronization of rates and inventory across 50+ booking channels (OTAs, GDS, direct website), instantly updating availability within seconds of a booking",
        "To clean hotel hallways",
        "To print guest receipts"
      ],
      correct_option_index: 1,
      explanation: "Channel managers synchronize room rates and availability across all third-party and direct channels simultaneously, preventing double-bookings.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "In hotel yield management, what is a 'Displacement Analysis'?",
      options: [
        "Measuring water displacement in the hotel pool",
        "Moving furniture between rooms",
        "Firing employees who arrive late",
        "A mathematical evaluation comparing the total revenue of a discounted group contract against the expected revenue of displaced transient leisure guests paying full retail rates"
      ],
      correct_option_index: 3,
      explanation: "Displacement analysis determines whether accepting a group block generates more total profit (including catering/banquets) than retail transient bookings.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In folio accounting, how does a hotel structure billing when a corporate guest stays on an employer-paid business trip?",
      options: [
        "By establishing Master Folio Routing: Room and tax charges route to the corporate master billing account (City Ledger), while personal incidentals route to the guest's personal credit card",
        "By charging the entire bill to the hotel manager",
        "By refusing to accept business travelers",
        "By asking the guest to pay in cash only"
      ],
      correct_option_index: 0,
      explanation: "Split folio routing directs authorized room/tax to corporate master accounts while keeping personal discretionary spending on individual cards.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In revenue analytics, what metric measures 'Gross Operating Profit Per Available Room' (GOPPAR), and why is it superior to RevPAR for hotel owners?",
      options: [
        "It measures parking lot revenue only",
        "It measures the number of pillows per room",
        "GOPPAR evaluates total revenue minus all operational departmental expenses divided by available rooms, reflecting true bottom-line operational profitability",
        "It measures the temperature of guest rooms"
      ],
      correct_option_index: 2,
      explanation: "GOPPAR factors in operational labor, F&B, and utility expenses against all revenue streams, providing a true measure of bottom-line profit.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "When selecting which guest to 'Walk' during an unexpected overbooking shortage, which of the following guests must NEVER be selected?",
      options: [
        "A local guest who booked a single night through an OTA 2 hours ago",
        "A top-tier VIP loyalty member, a multi-night business guest, or a member of a booked wedding block",
        "A guest who has no loyalty membership",
        "A guest who paid the lowest rate"
      ],
      correct_option_index: 1,
      explanation: "VIPs, elite loyalty members, multi-night guests, and wedding attendees should never be walked due to extreme relationship and revenue damage.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In credit card dispute defense, what electronic evidence successfully refutes fraudulent chargeback claims from guests alleging they never stayed at the hotel?",
      options: [
        "EMV chip-and-PIN transaction logs, signed electronic registration slips, and electronic keycard lock interrogation timestamps proving room entry",
        "A verbal phone call with the bank",
        "A copy of the restaurant menu",
        "A photograph of the hotel building"
      ],
      correct_option_index: 0,
      explanation: "Encrypted EMV logs, signature capture, and door lock access timestamps provide undeniable forensic proof of physical occupancy.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #40.");
  console.log("Skill #40 update completed successfully!");
}

run();
