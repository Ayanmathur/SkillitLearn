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

const skillId = "2521e109-48b5-4aa0-84db-eb27bdac2fd3";

async function run() {
  console.log("Updating Skill #86: E-commerce Payments & Logistics (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Payment Gateway Architecture, 3DS2 Security and Fraud Mitigation" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Order Management Systems (OMS), 3PL Networks and Inventory Economics" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Reverse Logistics, Multi-Carrier Rate Shopping and Post-Purchase UX" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Supply Chain & Payments Infrastructure Director level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Payment Service Providers (PSPs) and Interchange++ Pricing",
      order_index: 1,
      content: `### Global Payment Processing and Fee Mechanics

1. The 4-Party Payment Ecosystem:
   - Cardholder -> Merchant -> Acquirer (PSP: Stripe, Adyen) -> Card Schemes (Visa/Mastercard) -> Issuing Bank.

2. Interchange-Plus (Interchange++) Pricing vs Flat-Rate:
   - Flat-Rate (e.g. 2.9% + $0.30): Blends all processing costs into a single rate with high merchant margins.
   - Interchange++: Breaks out exact card interchange fees (0.5% to 1.5%), card scheme fees (0.1%), and transparent PSP processing markup (0.1% to 0.3% + $0.10), saving high-volume enterprise merchants 30 to 50 basis points (bps) annually.`
    },
    {
      track_id: track1Id,
      title: "3D Secure 2 (3DS2), PSD2 Compliance and Liability Shift",
      order_index: 2,
      content: `### Strong Customer Authentication and Fraud Liability

1. 3D Secure 2.0 (3DS2) Protocol:
   - Frictionless data-sharing protocol transmitting over 100 device and behavioral telemetry data points from merchant to issuing bank to verify buyer identity without manual OTP challenges in 95%+ of transactions.

2. The Fraud Liability Shift:
   - Successfully authenticating transactions via 3DS2 legally shifts financial liability for fraudulent chargebacks from the merchant directly to the issuing card bank.`
    },
    {
      track_id: track1Id,
      title: "Fraud Detection Engines and Chargeback Representment",
      order_index: 3,
      content: `### Machine Learning Risk Scoring and Dispute Defense

1. Real-Time Fraud Engines (Stripe Radar, Signifyd):
   - Machine learning algorithms evaluating velocity checks, geolocation distance mismatches, proxy/VPN detection, and device fingerprinting to block automated bot attacks.

2. Chargeback Representment Architecture:
   - Assembling empirical evidence packages (AVS address match, CVV verification, signed carrier delivery confirmation with GPS coordinates) to successfully dispute and overturn friendly fraud claims.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Distributed Order Management (DOM) and 3PL Fulfillment",
      order_index: 1,
      content: `### Scalable Warehousing and Multi-Node Routing

1. Distributed Order Management (DOM):
   - Intelligent fulfillment routing engines that evaluate real-time multi-warehouse stock levels to route orders to the closest geographical node, minimizing delivery transit time and carrier zone costs.

2. 3PL Selection Metrics (ShipBob, Quiet 3PL, Amazon MCF):
   - Auditing Service Level Agreements (SLAs): 99.8%+ same-day dispatch cut-off adherence, <0.1% pick-and-pack error rates, and automated B2B EDI retailer compliance integrations.`
    },
    {
      track_id: track2Id,
      title: "Dimensional Weight (DIM) and Carrier Zone Optimization",
      order_index: 2,
      content: `### Freight Cost Management and Packaging Engineering

1. Dimensional Weight (DIM) Formula:
   - DIM Weight (lbs) = (Length * Width * Height in inches) / 139 (or 166 for domestic ground).
   - Carriers bill based on whichever is greater: Actual Physical Scale Weight vs Calculated DIM Weight.

2. Zone Skipping Strategy:
   - Consolidating individual parcel volume into full truckloads (FTL) transported directly to destination regional carrier postal hubs, converting expensive Zone 7/8 shipments into economical Zone 2/3 local deliveries.`
    },
    {
      track_id: track2Id,
      title: "Inventory Optimization: Reorder Points and Safety Stock",
      order_index: 3,
      content: `### Quantitative Inventory Control and Supply Chain Models

1. Reorder Point (ROP) Formulation:
   - ROP = (Average Daily Sales Demand * Supplier Lead Time in Days) + Safety Stock.
   - Triggers automated purchase orders to manufacturing suppliers before stock levels dip below buffer thresholds.

2. Economic Order Quantity (EOQ):
   - Mathematical balancing of annual order placement costs against inventory holding carrying costs to identify optimal batch procurement sizes.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Multi-Carrier Rate Shopping and Shipping API Integration",
      order_index: 1,
      content: `### Automated Dispatch and Cross-Border Customs

1. Multi-Carrier Rate Shopping APIs (EasyPost, Shippo, ShipStation):
   - Programmatically querying real-time rate tables across USPS, FedEx, UPS, DHL, and regional last-mile couriers at the warehouse packing station to auto-select the lowest-cost shipping label meeting transit SLAs.

2. Harmonized System (HS / HTS) Tariff Codes:
   - Embedding standardized 6 to 10 digit product classification codes onto electronic commercial invoices for international customs clearance, eliminating border impoundments.`
    },
    {
      track_id: track3Id,
      title: "Reverse Logistics and Automated Return Management",
      order_index: 2,
      content: `### Retention-Driven Returns Architecture

1. Automated Return Portals (Loop Returns, Happy Returns):
   - Frictionless customer-facing portals offering 1-click variant exchanges, bonus store credit incentives (+10% credit bonus to prevent cash refund churn), and QR-code boxless in-person drop-offs.

2. Programmatic Returnless Refunds:
   - Automatically issuing immediate refunds for low-cost, heavy-weight items where round-trip reverse shipping costs exceed item salvage value.`
    },
    {
      track_id: track3Id,
      title: "Post-Purchase Tracking UX and WISMO Reduction",
      order_index: 3,
      content: `### Customer Experience and Tracking Portals

1. Branded Post-Purchase Tracking (Malomo, Wonderment):
   - Replacing generic carrier tracking web pages with customized merchant tracking portals displaying live route progress, accurate delivery estimates, and relevant product cross-sells.

2. WISMO Deflection:
   - Proactive automated SMS/email transit event updates (\"Out for Delivery\", \"Delivered to Front Porch\") reducing \"Where Is My Order?\" (WISMO) customer support tickets by up to 60%.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #86.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In e-commerce logistics, what is the mathematical formula used to calculate Dimensional Weight (DIM Weight in lbs) using the industry standard 139 divisor?",
      options: [
        "DIM Weight = (Length * Width * Height in inches) / 139",
        "DIM Weight = Price / Tax Rate",
        "DIM Weight = Total Weight * 100",
        "DIM Weight = (Length + Width) * 139"
      ],
      correct_option_index: 0,
      explanation: "DIM Weight is calculated by multiplying volume in cubic inches and dividing by the carrier dimensional factor (typically 139).",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In payment processing security, what major legal benefit does a merchant gain by successfully authenticating a transaction via 3D Secure 2 (3DS2)?",
      options: [
        "Zero payment processing fees",
        "Free international shipping",
        "Fraud Liability Shift (financial liability for fraudulent chargebacks shifts from the merchant to the issuing bank)",
        "Automatic customer approval"
      ],
      correct_option_index: 2,
      explanation: "3DS2 shifts chargeback fraud liability to the issuing bank once Strong Customer Authentication is completed.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In e-commerce customer support operations, what does the acronym 'WISMO' stand for?",
      options: [
        "Website Internal Sales Management Optimization",
        "Where Is My Order?",
        "Wireless Internet Security Module Organization",
        "Weekly Inventory Supply Management Operations"
      ],
      correct_option_index: 1,
      explanation: "WISMO ('Where Is My Order?') represents the single highest-volume inquiry type in e-commerce customer support.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In inventory control, what formula determines the exact Reorder Point (ROP) to trigger replenishment purchase orders?",
      options: [
        "ROP = Cash Balance / Rent",
        "ROP = Total Website Visitors * CTR",
        "ROP = Product Weight * Number of Warehouses",
        "ROP = (Average Daily Demand * Supplier Lead Time in Days) + Safety Stock"
      ],
      correct_option_index: 3,
      explanation: "ROP calculates lead-time demand plus buffer safety stock to prevent stockouts while waiting for supplier shipments.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In e-commerce fulfillment, what is a 3PL?",
      options: [
        "Third-Party Logistics provider (an outsourced company that manages warehousing, picking, packing, and shipping for merchants)",
        "A 3-page letter sent to customers",
        "A third-tier programming language",
        "A 3-digit product serial number"
      ],
      correct_option_index: 0,
      explanation: "A 3PL (Third-Party Logistics) provides outsourced supply chain services including warehousing, picking, packing, and freight management.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In merchant payment processing, why is 'Interchange-Plus' (Interchange++) pricing superior to Flat-Rate pricing for high-volume enterprise merchants?",
      options: [
        "Interchange++ eliminates sales tax",
        "Flat-rate pricing is illegal in North America",
        "Interchange++ makes payments 10 times faster",
        "Interchange++ passes through exact base wholesale card network interchange costs plus a transparent markup, saving 30 to 50 basis points over inflated flat-rate fees"
      ],
      correct_option_index: 3,
      explanation: "Interchange++ exposes wholesale card scheme interchange rates, eliminating the hefty risk buffers embedded in blended flat rates.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In e-commerce supply chain logistics, what is 'Zone Skipping' and how does it reduce shipping costs?",
      options: [
        "Skipping safety inspections on delivery trucks",
        "Consolidating large volumes of individual parcels into full truckloads (FTL) transported directly to destination regional carrier hubs, converting expensive high-zone rates to low local-zone rates",
        "Delivering packages by drone",
        "Refusing to ship to certain postal codes"
      ],
      correct_option_index: 1,
      explanation: "Zone skipping bypasses carrier sorting hubs via direct long-haul freight, lowering individual parcel delivery zone tiers.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In reverse logistics management, what is a 'Returnless Refund' strategy?",
      options: [
        "Automatically issuing a full refund without requiring the customer to physically return the item when return shipping and restocking costs exceed the item's salvage value",
        "Refusing all customer return requests",
        "Banning customers who request returns",
        "Charging customers double for returns"
      ],
      correct_option_index: 0,
      explanation: "Returnless refunds save merchants money on low-cost/heavy items where two-way shipping wipes out product margin.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In international e-commerce shipping, what is the role of Harmonized System (HS / HTS) Tariff Codes on customs declarations?",
      options: [
        "They determine the color of the shipping box",
        "They translate customer names into Spanish",
        "They provide standardized 6 to 10 digit product classifications that international customs authorities use to calculate correct duty rates and clear packages across borders",
        "They track the delivery driver's speed"
      ],
      correct_option_index: 2,
      explanation: "HS codes classify physical merchandise for international customs, ensuring proper duty assessment and preventing border impoundments.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In multi-warehouse e-commerce operations, what is 'Distributed Order Management' (DOM)?",
      options: [
        "A system that assigns orders to random employees",
        "A spreadsheet tracking employee vacation days",
        "A program that deletes orders after 30 days",
        "An intelligent routing engine that analyzes real-time multi-node warehouse inventory and delivery destinations to assign each order to the optimal, closest fulfillment center"
      ],
      correct_option_index: 3,
      explanation: "DOM software routes orders intelligently to the closest warehouse with available stock, cutting transit time and shipping fees.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In freight logistics billing, how do carriers decide whether to bill a parcel based on 'Actual Physical Weight' or 'Dimensional (DIM) Weight'?",
      options: [
        "They always use actual physical scale weight",
        "Carriers calculate both physical scale weight and dimensional weight, billing the merchant based on whichever value is greater",
        "They use dimensional weight only on weekends",
        "They flip a coin at the sorting station"
      ],
      correct_option_index: 1,
      explanation: "Carriers calculate both weights and bill on the greater value, penalizing bulky lightweight packages taking up cargo volume.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In dispute defense and chargeback representment for 'Friendly Fraud' (First-Party Misuse), what evidence package provides the strongest legal proof of fulfillment?",
      options: [
        "A screenshot of a text message",
        "A handwritten letter from the founder",
        "AVS (Address Verification Service) match, CVV confirmation, and signed carrier delivery proof with timestamped GPS coordinates matching the billing address",
        "A link to the product website"
      ],
      correct_option_index: 2,
      explanation: "Combining full AVS/CVV verification with carrier-verified GPS delivery proof decisively wins chargeback disputes.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In 3DS2 architecture, what is the difference between a 'Frictionless Flow' and a 'Challenge Flow'?",
      options: [
        "In a Frictionless Flow, rich device and behavioral telemetry satisfies the bank's risk assessment without user intervention; in a Challenge Flow, the user must complete a step-up biometric or OTP prompt",
        "Frictionless flows are only for mobile apps",
        "Challenge flows are used only for international transactions",
        "There is zero difference"
      ],
      correct_option_index: 0,
      explanation: "Frictionless 3DS2 verifies identity in the background via rich device signals; high-risk transactions trigger a challenge OTP.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In modern returns automation (e.g. Loop Returns), why do merchants offer a 'Store Credit Bonus Incentive' (e.g. +10% extra credit for choosing store credit over cash refund)?",
      options: [
        "To trick customers",
        "To lose money on purpose",
        "Store credit bonuses are mandated by law",
        "To retain gross merchandise value (GMV) within the brand ecosystem, converting potential revenue churn into repeat customer orders while preserving cash flow"
      ],
      correct_option_index: 3,
      explanation: "Bonus store credit incentives retain revenue within the business, driving repeat purchase behavior instead of cash liquidation.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In multi-carrier shipping automation, how do packing-station rate shopping APIs (EasyPost / Shippo) optimize shipping margin in real time?",
      options: [
        "By deleting carrier accounts",
        "By querying live contractual rate tables across multiple couriers (USPS, FedEx, UPS, regional couriers) and auto-generating the cheapest label meeting delivery SLAs",
        "By guessing shipping rates randomly",
        "By delaying shipments by 7 days"
      ],
      correct_option_index: 1,
      explanation: "Rate-shopping APIs dynamically compare all available carrier rates at label generation to ensure the lowest shipping cost per package.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #86.");
  console.log("Skill #86 update completed successfully!");
}

run();
