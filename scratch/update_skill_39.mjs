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

const skillId = "3c9dbdd9-7a74-48b5-b30e-848074782de9";

async function run() {
  console.log("Updating Skill #39: Customer Service Excellence (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Luxury Hospitality Standards, Anticipatory Service and Emotional Intelligence" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Guest Journey Mapping, Personalization and Frontline Empowerment" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Service Quality Metrics, The Recovery Paradox and Lifetime Value" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Luxury Hospitality Management level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Ritz-Carlton Gold Standard and Anticipatory Hospitality",
      order_index: 1,
      content: `### Philosophy and Foundations of Luxury Hospitality

World-class customer service transcends mere transaction processing by orchestrating memorable emotional connections:

1. The Ritz-Carlton Gold Standards (Horst Schulze & Cesar Ritz):
   - The Motto: 'We are Ladies and Gentlemen serving Ladies and Gentlemen' (elevates hospitality into a dignified noble profession based on mutual respect and excellence).
   - The Three Classical Steps of Service:
     - 1. A warm and sincere greeting, using the guest's name whenever possible.
     - 2. Anticipation and fulfillment of each guest's needs (including unexpressed wishes).
     - 3. Fond farewell, expressing gratitude and using the guest's name.

2. Anticipatory vs Reactive Service:
   - Reactive Service: Fulfilling a request after the guest asks for it.
   - Anticipatory Service: Actively observing guest body language, environmental context, and behavioral cues to fulfill unexpressed needs before the guest articulates them (e.g. noticing a guest squinting at a dark dining table and discreetly offering reading glasses and a subtle pen light).`
    },
    {
      track_id: track1Id,
      title: "Emotional Intelligence (EQ), Active Listening and Non-Verbal Dynamics",
      order_index: 2,
      content: `### Psychological Dynamics of High-Touch Communication

1. The Mehrabian Communication Model in Hospitality:
   - In emotional, face-to-face service interactions:
     - 7% Verbal Content (the literal words spoken).
     - 38% Vocal Tone (pitch, warmth, pacing, and inflection).
     - 55% Non-Verbal Body Language (open posture, direct eye contact, genuine Duchenne smiles, and non-threatening stance).

2. Active Listening Protocols (The H.E.A.R. Method):
   - Hear: Listen intently without interrupting or preparing a defensive rebuttal.
   - Empathize: Validate the guest's feelings using empathetic phrases ('I completely understand why that was frustrating').
   - Ask: Ask clarifying, open-ended questions to discover underlying root needs.
   - Resolve: Formulate and communicate an immediate, definitive action plan.

3. Tonal Calibration:
   - Matching and pacing vocal tone to de-escalate anxious or hurried guests, transitioning their emotional state toward calm assurance.`
    },
    {
      track_id: track1Id,
      title: "Cultural Competence, Global Etiquette and Inclusivity",
      order_index: 3,
      content: `### Cross-Cultural Hospitality Protocols and Accessible Service

1. High-Context vs Low-Context Communication Dynamics:
   - High-Context Cultures (Japan, Middle East, Mediterranean): Politeness and respect are conveyed through subtle indirect cues, non-verbal deference, and avoiding public embarrassment (preserving 'face').
   - Low-Context Cultures (United States, Germany, Scandinavia): Value direct, concise, explicit verbal transparency and rapid operational efficiency.

2. Global Dietary and Religious Traditions:
   - In-depth knowledge of Halal requirements, Kosher dietary laws, Hindu vegetarianism (avoiding all beef/gelatin), and traditional East Asian table manners.

3. Accessible and Inclusive Hospitality:
   - Proactive ADA accommodations for mobility, auditory, visual, or neurodiverse needs delivered with natural warmth and dignity, avoiding patronizing behaviors or intrusive questioning.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The 360-Degree Guest Journey: Pre-Arrival to Post-Departure",
      order_index: 1,
      content: `### Complete Lifecycle Orchestration of the Guest Experience

Luxury guest experience engineering divides the customer lifecycle into five distinct operational stages:

1. The Five Lifecycle Stages:
   - Stage 1 (Pre-Arrival): Proactive pre-stay contact confirming transportation, dietary allergies, room floor preferences, and purpose of visit (anniversary, business, leisure).
   - Stage 2 (Arrival & Welcome): Curbside greeting within 30 seconds, luggage tag coordination, and seamless front desk check-in completed in under 3 minutes.
   - Stage 3 (Occupancy & In-Stay): Customized turndown amenities, personalized concierge recommendations, and seamless inter-departmental service delivery.
   - Stage 4 (Departure): Express automated folio review, luggage transfer to vehicle, and personalized farewell amenities.
   - Stage 5 (Post-Stay): Personalized handwritten thank-you notes, feedback surveys, and automatic loyalty point reconciliation.

2. Identifying and Eliminating Friction Points:
   - Conducting service audits to eliminate friction (e.g. long check-in queues, confusing digital room keys, or slow room service deliveries).`
    },
    {
      track_id: track2Id,
      title: "Hospitality CRM Architecture: Preference Tracking and Hyper-Personalization",
      order_index: 2,
      content: `### Telemetry and Data-Driven Personalization in Hospitality

1. Modern Hospitality Property Management and CRM Systems (Opera / Amadeus):
   - Systematic logging of both explicit guest requests and implicit behavioral observations:
     - Preferred room temperature (e.g. exactly 68 degrees F).
     - Still vs sparkling water preference.
     - Pillow preferences (feather down vs hypoallergenic foam).
     - Favorite wine varietals, morning newspaper, and pet names.

2. Daily Line-Up and Preference Distribution:
   - Every morning, operational departments (Front Desk, Concierge, Housekeeping, Food and Beverage) review the daily VIP arrival roster during a 15-minute 'Line-Up' briefing, ensuring all staff members recognize arriving guests by face and name.

3. 'Surprise and Delight' Moments:
   - Delivering unprompted bespoke touches (e.g. framing a family photograph from the guest's public social media and placing it on their nightstand alongside fresh local pastries).`
    },
    {
      track_id: track2Id,
      title: "Frontline Staff Empowerment: The Decentralized Authority Model",
      order_index: 3,
      content: `### Decentralized Governance and Instantaneous Resolution

1. The Ritz-Carlton $2,000 Discretionary Empowerment Standard:
   - Every frontline employee (housekeeper, bellman, server, front desk agent) is authorized to spend up to $2,000 per guest per incident to resolve a problem or create a magical experience without seeking managerial permission.

2. Eliminating Bureaucratic Friction:
   - Phrases like 'Let me ask my manager' or 'Our policy does not allow that' destroy guest trust and inflate service recovery times.
   - Empowering frontline staff provides instantaneous problem resolution at the initial point of contact, preventing minor issues from escalating into major online negative reviews.

3. Psychological Ownership:
   - Staff members act as empowered hosts rather than rule-bound workers, fostering pride, job satisfaction, and elite retention.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Service Quality Metrics: NPS, CSAT, CES and Forbes 900-Point Audits",
      order_index: 1,
      content: `### Quantitative Metrics and Forbes Travel Guide Standards

1. Key Service Quality Telemetry:
   - Net Promoter Score (NPS): \`NPS = % Promoters (Scores 9-10) - % Detractors (Scores 0-6)\`. Measures organic brand advocacy and word-of-mouth referral rates.
   - Customer Satisfaction Score (CSAT): Immediate post-stay rating of specific service dimensions (cleanliness, dining, check-in speed).
   - Customer Effort Score (CES): Evaluates the ease of interaction ('How easy was it to get your issue resolved?'). Research shows reducing customer effort is the single greatest driver of repeat guest loyalty.

2. Forbes Travel Guide 900-Point Standards:
   - Rigorous anonymous incognito hotel audits evaluating up to 900 objective standards:
     - Technical Standards (70%): Cleanliness, timeliness, accuracy.
     - Emotional Hospitality Standards (30%): Eye contact within 5 feet, warm greeting within 30 seconds, answering phones within 3 rings, staff using the guest's name naturally at least twice during an interaction.`
    },
    {
      track_id: track3Id,
      title: "The Service Recovery Paradox: Turning Detractors into Advocates",
      order_index: 2,
      content: `### The Science of Service Recovery and Brand Advocacy

1. The Service Recovery Paradox (McCullough & Bharadwaj):
   - A customer who experiences a service failure that is resolved promptly, empathetically, and generously exhibits HIGHER long-term brand loyalty and lifetime spending than a customer who experienced an uneventful, flawless stay.
   - Why: Outstanding recovery demonstrates authentic organizational integrity, empathy, and customer value under stress.

2. The 4-Step Recovery Framework:
   - 1. Unconditional Apology: Sincere emotional ownership without making excuses or blaming weather/vendors.
   - 2. Immediate Action: Providing immediate alternative solutions or upgrades.
   - 3. Generous Compensation: Offering complimentary meals, room upgrades, or loyalty points that exceed the perceived inconvenience.
   - 4. Executive Follow-Through: A personal call or handwritten note from the General Manager prior to departure.`
    },
    {
      track_id: track3Id,
      title: "High-Touch Loyalty Architecture and Lifetime Value (LTV) Optimization",
      order_index: 3,
      content: `### Customer Lifetime Value and Experiential Loyalty Systems

1. Customer Lifetime Value (LTV) Economics:
   - A high-net-worth business traveler or frequent luxury vacationer represents $100,000 to $500,000 in lifetime hospitality spend.
   - Evaluating recovery costs through the lens of LTV justifies generous frontline spending to retain loyal guests.

2. Modern Experiential Loyalty vs Transactional Points:
   - Transitioning from transactional discount points to exclusive experiential benefits:
     - Guaranteed 4:00 PM late check-out.
     - Upgrades to presidential and specialty suites.
     - Private culinary tastings with executive chefs.
     - Direct dedicated 24/7 concierge WhatsApp access.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #39.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "What famous motto coined by Horst Schulze defines the foundational philosophy of luxury hospitality at The Ritz-Carlton?",
      options: [
        "'We are Ladies and Gentlemen serving Ladies and Gentlemen'",
        "'The customer is always right no matter what'",
        "'Faster service means higher profits'",
        "'Rules and policies must never be broken'"
      ],
      correct_option_index: 0,
      explanation: "'We are Ladies and Gentlemen serving Ladies and Gentlemen' establishes mutual dignity, professionalism, and excellence across all staff.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "According to the Albert Mehrabian communication model, what component accounts for the largest percentage (55%) of emotional perception during face-to-face communication?",
      options: [
        "The specific dictionary words used",
        "The speed of talking",
        "Non-verbal body language (posture, eye contact, facial expressions)",
        "The loudness of the voice"
      ],
      correct_option_index: 2,
      explanation: "Mehrabian's research shows that 55% of emotional communication is perceived through non-verbal body language, 38% through vocal tone, and only 7% through literal words.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In luxury customer service, what is the critical difference between 'Reactive Service' and 'Anticipatory Service'?",
      options: [
        "Anticipatory service only occurs at breakfast",
        "Reactive service fulfills requests only after the guest asks; Anticipatory service observes subtle cues to fulfill unexpressed wishes before the guest has to ask",
        "Anticipatory service is handled entirely by robots",
        "There is zero difference"
      ],
      correct_option_index: 1,
      explanation: "Anticipatory service observes body language and context to solve needs before the guest articulates them, creating magical guest experiences.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What benchmark metric calculates customer loyalty by subtracting the percentage of Detractors (scores 0-6) from the percentage of Promoters (scores 9-10)?",
      options: [
        "Cost per Acquisition (CPA)",
        "Gross Domestic Product (GDP)",
        "Return on Investment (ROI)",
        "Net Promoter Score (NPS)"
      ],
      correct_option_index: 3,
      explanation: "NPS = % Promoters (9-10) - % Detractors (0-6), measuring overall customer brand loyalty and organic word-of-mouth advocacy.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "Under The Ritz-Carlton frontline empowerment standard, what dollar amount is every employee authorized to spend per guest per incident to resolve an issue without seeking managerial approval?",
      options: [
        "Up to $2,000",
        "Up to $5",
        "Zero dollars (requires 3 manager signatures)",
        "Up to $50,000"
      ],
      correct_option_index: 0,
      explanation: "Ritz-Carlton authorizes up to $2,000 per employee per incident, granting full autonomy to resolve issues immediately without bureaucratic delay.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "What psychological phenomenon in customer service occurs when a guest experiences a service failure that is resolved brilliantly and generously, leading them to have HIGHER brand loyalty than if no failure occurred?",
      options: [
        "Buyer's Remorse",
        "The Dunning-Kruger Effect",
        "Cognitive Dissonance",
        "The Service Recovery Paradox"
      ],
      correct_option_index: 3,
      explanation: "The Service Recovery Paradox demonstrates that an empathetic, generous resolution transforms frustrated guests into fiercely loyal brand advocates.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "Why is 'Customer Effort Score' (CES - measuring how easy it was for a guest to resolve their request) considered a stronger predictor of repeat customer retention than general satisfaction scores?",
      options: [
        "Because effort scores take less time to calculate",
        "Research proves that reducing friction, wait times, and customer effort is the single greatest driver of repeat business and loyalty",
        "Because happy customers never come back",
        "Because effort scores only measure hotel room size"
      ],
      correct_option_index: 1,
      explanation: "Frictionless, low-effort experiences eliminate customer frustration, driving retention more effectively than superficial delight gimmicks.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In hospitality CRM systems (such as Opera or Amadeus), why do luxury hotels conduct a mandatory 15-minute daily 'Line-Up' briefing across all departments?",
      options: [
        "To review arriving VIP profiles, personal preferences (pillow type, water, room temp), and special occasions across all operational teams before guests arrive",
        "To practice singing songs",
        "To count physical room keys",
        "To inspect shoes only"
      ],
      correct_option_index: 0,
      explanation: "Daily line-ups align front desk, concierge, housekeeping, and culinary teams on VIP profiles, ensuring personalized recognition property-wide.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In cross-cultural hospitality communication, how does service delivery differ between 'High-Context' cultures (e.g. Japan, Middle East) and 'Low-Context' cultures (e.g. United States, Germany)?",
      options: [
        "High-context cultures only communicate via email",
        "Low-context cultures do not speak English",
        "High-context cultures value indirect politeness, non-verbal deference, and preserving social 'face', whereas low-context cultures prioritize direct, explicit transparency and operational speed",
        "There is zero cultural difference in luxury hotels"
      ],
      correct_option_index: 2,
      explanation: "High-context cultures prioritize harmony, subtlety, and non-verbal cues, whereas low-context cultures favor direct, concise verbal communication.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In Forbes Travel Guide 900-point incognito hotel audits, what percentage of the evaluation score is dedicated to emotional hospitality standards (such as eye contact within 5 feet, warm greeting, and using guest names naturally)?",
      options: [
        "0%",
        "100%",
        "5%",
        "30% (with technical facility execution representing 70%)"
      ],
      correct_option_index: 3,
      explanation: "Forbes Travel Guide audits dedicate 30% of total score to emotional engagement, personal warmth, and intuitive hospitality behaviors.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In customer lifetime value (LTV) economics for luxury hospitality, why is empowering frontline staff to spend significant recovery funds on a single dissatisfied guest mathematically sound?",
      options: [
        "Because hotels have unlimited money",
        "A high-net-worth corporate or leisure traveler represents $100,000 to $500,000 in multi-year lifetime revenue; spending $500 to retain their business protects massive lifetime equity",
        "Because insurance pays for all guest complaints",
        "Because managers do not want to talk to guests"
      ],
      correct_option_index: 1,
      explanation: "Customer Lifetime Value recognizes that retaining a high-spending guest protects hundreds of thousands in future revenue across decades.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "What are the four sequential steps of the 'H.E.A.R.' active listening and verbal de-escalation protocol in hospitality?",
      options: [
        "Halt, Exit, Argue, Report",
        "Help, Explain, Apologize, Run",
        "Hear (listen without interrupting), Empathize (validate emotions), Ask (clarify underlying needs), and Resolve (communicate immediate definitive action)",
        "Hurry, Evacuate, Alert, Return"
      ],
      correct_option_index: 2,
      explanation: "The HEAR method guides staff to listen without interruption, show empathy, ask clarifying questions, and execute an immediate resolution.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In guest journey mapping, what are the five operational lifecycle phases evaluated to eliminate customer friction?",
      options: [
        "Phase 1: Pre-Arrival, Phase 2: Arrival & Welcome, Phase 3: Occupancy & In-Stay, Phase 4: Departure, and Phase 5: Post-Stay Follow-Up",
        "Morning, Afternoon, Evening, Night, and Breakfast",
        "Online, In-Person, Phone, Email, and Mail",
        "Kitchen, Lobby, Pool, Bar, and Garage"
      ],
      correct_option_index: 0,
      explanation: "The 360-degree guest journey breaks down touchpoints from initial pre-arrival communication through post-stay correspondence.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "Why do modern luxury hotel loyalty programs increasingly prioritize 'Experiential Benefits' (such as chef tastings, 4 PM late checkouts, suite upgrades) over transactional point discount systems?",
      options: [
        "Because points are illegal in luxury hotels",
        "Because high-end guests have no credit cards",
        "Because discounts make hotel computers crash",
        "High-net-worth travelers value time, frictionless convenience, and exclusive access far more than minor monetary discounts, driving deeper emotional brand loyalty"
      ],
      correct_option_index: 3,
      explanation: "Luxury consumers prioritize personalized recognition, time flexibility, and bespoke access over transactional financial discounts.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "Why is the phrase 'That is against our company policy' considered a catastrophic failure in luxury customer service communication?",
      options: [
        "Because policies do not exist in hotels",
        "It signals bureaucratic inflexibility and indifference, instantly alienating the guest by prioritizing administrative rules over the guest's human needs",
        "Because it is too long to say",
        "Because guests love policies"
      ],
      correct_option_index: 1,
      explanation: "Hiding behind corporate policy signals cold indifference; luxury hospitality focuses on creative, empathetic problem-solving within safe boundaries.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #39.");
  console.log("Skill #39 update completed successfully!");
}

run();
