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

const skillId = "ba4a9752-7a21-4740-8a2d-39a6435d7f4d";

async function run() {
  console.log("Updating Skill #42: Handling Complaints Gracefully (9 steps across 3 tracks)...");

  // 1. Fetch tracks for this skill
  let { data: tracks, error: tErr } = await supabase
    .from("tracks")
    .select("id, title, order_index")
    .eq("skill_id", skillId)
    .order("order_index");

  if (tErr) {
    console.error("Error fetching tracks:", tErr);
    return;
  }

  // Ensure exactly 3 tracks exist
  while (tracks.length < 3) {
    const { data: newTrack } = await supabase
      .from("tracks")
      .insert({
        skill_id: skillId,
        title: `Track ${tracks.length + 1}: Handling Complaints Gracefully`,
        order_index: tracks.length + 1
      })
      .select()
      .single();
    tracks.push(newTrack);
  }

  tracks.sort((a, b) => a.order_index - b.order_index);

  const track1Id = tracks[0].id;
  const track2Id = tracks[1].id;
  const track3Id = tracks[2].id;

  // Update Track titles
  await supabase.from("tracks").update({ title: "Track 1: Conflict Psychology, Verbal De-Escalation and The L.A.S.T. Framework" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Compensatory Recovery, Difficult Behaviors and Warm Handoffs" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Digital Reputation Management, Closed-Loop Feedback and Resilience" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Cornell Hospitality level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Neurobiology of Anger, Amygdala Hijack and Emotional Regulation",
      order_index: 1,
      content: `### Neurobiology and Psychological Dynamics of Guest Frustration

Handling guest complaints begins with understanding the human physiological response to perceived service failure:

1. Amygdala Hijack and the Venting Imperative:
   - When a guest experiences an acute service failure (e.g. lost reservation, dirty room), their brain perceives a threat, triggering sympathetic nervous system arousal (adrenaline surge, elevated heart rate, and loss of rational cognitive processing).
   - The Venting Dynamic: Attempting to interrupt an angry guest with logical explanations or policy facts in the first 60 seconds triggers defensive aggression. Allowing the guest to vent uninterrupted for 60 to 90 seconds discharges emotional adrenaline, allowing higher-order prefrontal cortex reasoning to return.

2. Staff Emotional Self-Regulation:
   - Maintaining calm psychological equilibrium: Practicing tactical breathing and cognitive reframing ('The guest is reacting to a frustrating situation, not attacking me personally').`
    },
    {
      track_id: track1Id,
      title: "The L.A.S.T. and L.E.A.R.N. De-Escalation Frameworks",
      order_index: 2,
      content: `### Standardized Service Recovery Methodologies

1. The Classical L.A.S.T. Method:
   - L (Listen): Active, uninterrupted listening with engaged, open body language and empathetic eye contact.
   - A (Apologize): Sincere, authentic emotional ownership without making defensive excuses ('I am truly sorry this occurred; I completely understand how upsetting this is').
   - S (Solve): Formulating an immediate, definitive action plan in collaboration with the guest.
   - T (Thank): Genuinely thanking the guest for sharing their feedback, acknowledging that their complaint allows the property to improve operational quality.

2. The L.E.A.R.N. Hospitality Framework:
   - Listen, Empathize, Apologize, Resolve, and Notify (ensuring inter-departmental documentation so all shifts remain aware of the guest's situation).`
    },
    {
      track_id: track1Id,
      title: "Tactical Verbal De-Escalation: Forbidden Phrases and Power Language",
      order_index: 3,
      content: `### Linguistic Psychology and Verbal Conflict De-Escalation

1. The Forbidden Phrases in Service Recovery:
   - 'Calm down' (infantilizes the guest and accelerates rage).
   - 'That is not my department' (signals organizational apathy).
   - 'You should have notified us earlier' (shifts blame onto the customer).
   - 'It is company policy' (hides behind bureaucratic rules, destroying empathy).

2. Power Language of Service Ownership:
   - 'I will personally take ownership of this for you right now.'
   - 'Let us resolve this immediately.'
   - 'What would be the ideal outcome for you to make this right?'
   - Using the guest's name with sincere, calm vocal tone (matching lower volume to naturally lower the guest's speaking volume).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Proportionate Redress, Compensatory Scaling and Over-Compensation",
      order_index: 1,
      content: `### The Calculus of Fair Redress and Organizational Justice

1. The Three Dimensions of Customer Justice:
   - Procedural Justice: The speed, simplicity, and lack of friction in the resolution process.
   - Interactional Justice: The genuine respect, empathy, and dignity shown by staff during interaction.
   - Distributive Justice (Compensatory Redress): The tangible compensation provided to balance the perceived loss.

2. Compensatory Scaling Matrix:
   - Minor Inconvenience (delayed drink, missing towel): Complimentary beverage or dessert ($15 to $30 value).
   - Moderate Failure (noisy room, air conditioning failure): Meal voucher plus 10,000 loyalty points ($75 to $150 value).
   - Catastrophic Failure (unresolved maintenance issue, room flooding, ruined anniversary): Full night room comped, complimentary suite upgrade on return visit, and personal written apology from the General Manager ($300 to $800+ value).`
    },
    {
      track_id: track2Id,
      title: "Managing Difficult, Intoxicated or Hostile Guest Encounters",
      order_index: 2,
      content: `### Handling Extreme Conflict and Workplace Safety Boundaries

1. The 'Broken Record' De-Escalation Technique:
   - Calmly and politely repeating essential safety or operational boundaries in steady, neutral tones without escalating emotions.

2. Managing Intoxicated or Disruptive Patrons:
   - Discreetly cutting off alcohol service while offering complimentary food, bottled water, or coffee.
   - Moving the conversation away from public dining rooms or busy lobbies to protect the guest's dignity and maintain a peaceful ambiance.

3. Workplace Safety and Zero Tolerance:
   - Immediate protocol for guests who cross the boundary into physical intimidation, verbal harassment, or property damage:
     - Frontline staff step back safely and summon Security / Management on Duty (MOD) discreetly.
     - Security executes formal trespass or law enforcement notification when safety is compromised.`
    },
    {
      track_id: track2Id,
      title: "Real-Time Multi-Party Escalation: Warm Handoff Protocols",
      order_index: 3,
      content: `### Seamless Managerial Escalation and Warm Handoffs

1. The 'Warm Handoff' Protocol:
   - When a complaint exceeds frontline authority limits, the agent introduces the Manager on Duty (MOD) directly to the guest.
   - Private Pre-Briefing: The agent briefs the manager away from the guest with full factual context (guest name, room number, exact sequence of events, what has already been offered).

2. The 'Never Make Them Repeat Themselves' Rule:
   - The manager greets the guest already fully informed: 'Mr. Davis, Sarah briefed me on the air conditioning issue you experienced in room 412; I apologize sincerely, and I am here to personally resolve this for you.'
   - Eliminates the severe psychological fatigue of forcing frustrated guests to recount traumatic stories multiple times.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Online Review Architecture: Public Responses and Reputation SEO",
      order_index: 1,
      content: `### Digital Reputation Management across Online Platforms

1. Online Review Response Protocol (TripAdvisor, Google, Yelp, OTAs):
   - Service Level Agreement (SLA): Mandatory public response within 24 to 48 hours for all 1-star and 2-star reviews.

2. The 4-Part Executive Review Response Formula:
   - 1. Gracious Personalized Opening: Thanking the guest by name for taking the time to share feedback.
   - 2. Sincere Authentic Apology: Acknowledging the specific operational breakdown without defensive excuses or corporate boilerplate.
   - 3. Concrete Corrective Action: Stating the specific operational fix or staff retraining enacted to ensure the issue never recurs.
   - 4. Offline Executive Contact: Providing the General Manager's direct email and phone number to continue private resolution.`
    },
    {
      track_id: track3Id,
      title: "Closed-Loop Customer Feedback and Root-Cause Elimination",
      order_index: 2,
      content: `### Transforming Complaints into Systemic Operational Improvements

1. Categorical Root-Cause Tagging in PMS:
   - Every guest complaint is tagged in the Property Management System by root cause:
     - Physical Plant / Engineering (HVAC, plumbing, Wi-Fi).
     - Cleanliness / Housekeeping (dust, linen, odors).
     - Food and Beverage Quality / Speed.
     - Billing / Reservation Discrepancies.

2. Closed-Loop Engineering Meetings:
   - Weekly inter-departmental meetings reviewing complaint Pareto charts (the 80/20 rule).
   - Eliminating the systemic root causes behind recurrent issues (e.g. replacing aging boiler valves rather than repeatedly comping meals for cold morning showers).`
    },
    {
      track_id: track3Id,
      title: "Psychological Resilience, Compassion Fatigue and Staff Debriefs",
      order_index: 3,
      content: `### Frontline Mental Health, Resilience and Team Debriefing

1. Post-Incident Staff Debriefs:
   - Following intense verbal confrontations, managers conduct immediate 10-minute check-ins with affected frontline staff, validating their professionalism and providing emotional support.

2. Preventing Compassion Fatigue and Burnout:
   - Implementing rotational desk shifts, allowing front desk agents and phone operators to rotate off high-stress customer desks into back-office administrative tasks during grueling peak checkout hours.
   - Fostering a supportive team culture where asking for managerial backup is recognized as strong situational awareness, not personal failure.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #42.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In the classical 'L.A.S.T.' hospitality service recovery framework, what do the four letters stand for?",
      options: [
        "Leave, Argue, Sue, Terminate",
        "Listen, Apologize, Solve, and Thank",
        "Lock, Alert, Screen, Track",
        "Look, Ask, Settle, Transfer"
      ],
      correct_option_index: 1,
      explanation: "L.A.S.T. stands for Listen attentively, Apologize sincerely, Solve with definitive action, and Thank the guest for their feedback.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "Why should customer service staff NEVER use the phrase 'Calm down' when addressing an angry, frustrated guest?",
      options: [
        "Because it is too short to say",
        "Because it makes the room too cold",
        "Because guests love being told to calm down",
        "It invalidates the guest's emotions, infantilizes them, and biologically accelerates emotional frustration and anger"
      ],
      correct_option_index: 3,
      explanation: "Telling an upset guest to 'calm down' dismisses their feelings and triggers further psychological defensiveness and rage.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In the neurobiology of customer anger, why is allowing a furious guest to vent uninterrupted for the first 60 to 90 seconds essential?",
      options: [
        "It discharges acute adrenaline and emotional arousal (amygdala hijack), allowing rational prefrontal cortex reasoning to return before problem-solving begins",
        "It allows staff to take a coffee break",
        "It makes the guest forget their name",
        "It makes the computer run faster"
      ],
      correct_option_index: 0,
      explanation: "Uninterrupted venting allows the initial sympathetic adrenaline rush to subside, transitioning the guest into a receptive state for logical solutions.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "When escalating a guest complaint from a frontline agent to the Manager on Duty (MOD), what is the 'Warm Handoff' rule?",
      options: [
        "Giving the guest a warm cup of soup",
        "Telling the guest to wait outside in the rain",
        "The agent privately briefs the manager with full factual details in advance so the manager arrives fully informed, ensuring the guest never has to repeat their frustrating story",
        "Forcing the guest to write a 10-page essay"
      ],
      correct_option_index: 2,
      explanation: "A warm handoff ensures the manager arrives already briefed on the facts, eliminating the exhausting frustration of repeating the complaint.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In public online review management (such as on TripAdvisor or Google Reviews), what is the target Service Level Agreement (SLA) for responding to negative 1-star or 2-star reviews?",
      options: [
        "Within 1 year",
        "Within 24 to 48 hours with a personalized, professional executive response",
        "Never respond to negative reviews",
        "Within 10 seconds using automated robots"
      ],
      correct_option_index: 1,
      explanation: "Responding within 24 to 48 hours demonstrates authentic organizational accountability, empathy, and active operational leadership to prospective travelers.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In organizational justice theory applied to hospitality service recovery, what is 'Procedural Justice'?",
      options: [
        "The amount of cash refunded to the guest",
        "The tone of voice used by the front desk",
        "The speed, ease, and frictionless efficiency of the complaint resolution process without bureaucratic delays",
        "The legal lawsuit filed in court"
      ],
      correct_option_index: 2,
      explanation: "Procedural justice evaluates the operational fairness and frictionless speed of the policies and systems used to resolve customer issues.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "What are the four components of the executive formula for responding publicly to negative online hotel reviews?",
      options: [
        "1. Gracious Personalized Opening, 2. Sincere Authentic Apology, 3. Concrete Corrective Action Taken, and 4. Offline Executive Contact Details",
        "1. Deny everything, 2. Blame the guest, 3. Threaten legal action, and 4. Delete the review",
        "1. Copy and paste template, 2. Say sorry, 3. Offer $1, and 4. Say goodbye",
        "1. Ask for money, 2. Change hotel name, 3. Fire staff, and 4. Ignore"
      ],
      correct_option_index: 0,
      explanation: "A professional review response opens graciously, offers a sincere apology, explains systemic fixes, and moves private communication offline with the GM.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "Why is the phrase 'That is against company policy' considered a destructive failure in service recovery communication?",
      options: [
        "Because hotels have no policies",
        "Because policies are written in Latin",
        "Because guests love reading policies",
        "It signals cold organizational indifference, hiding behind bureaucratic rules rather than showing empathetic human problem-solving"
      ],
      correct_option_index: 3,
      explanation: "Hiding behind company policy alienates guests by demonstrating that the business values internal rules over customer satisfaction.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In hospitality conflict management, what is the 'Broken Record' de-escalation technique?",
      options: [
        "Playing scratchy music in the lobby",
        "Calmly and politely repeating essential safety or operational boundaries in a steady, neutral, non-confrontational tone without escalating emotions",
        "Breaking physical plates to make noise",
        "Talking backwards"
      ],
      correct_option_index: 1,
      explanation: "The broken record technique maintains calm, consistent, respectful repetition of firm boundaries when handling unreasonable demands.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In closed-loop customer feedback management, why do hotel leadership teams categorize and tag complaints by root cause in the PMS?",
      options: [
        "To punish the lowest-performing employees",
        "To publish guest complaints in the newspaper",
        "To identify recurring systemic failure trends (e.g. aging HVAC chillers or billing errors) and invest capital to eliminate the root cause permanently",
        "To increase room prices"
      ],
      correct_option_index: 2,
      explanation: "Root-cause tagging reveals recurring operational breakdowns, enabling leadership to fix underlying equipment or processes permanently.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In the compensatory scaling matrix for hotel service recovery, what is the appropriate redress for a severe, catastrophic failure (such as a room flooding or ruined wedding anniversary)?",
      options: [
        "Comping the room night in full, providing a complimentary upgraded suite for a future stay, and delivering a personal written apology from the General Manager",
        "Offering a free bottle of tap water",
        "Giving a 5% discount on parking",
        "Saying thank you and doing nothing"
      ],
      correct_option_index: 0,
      explanation: "Severe failures warrant substantial over-compensation (comped night, future stay upgrade, executive outreach) to protect lifetime guest loyalty.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In emotional labor management for hospitality staff, what is 'Compassion Fatigue' and how can management prevent it during peak operational stress?",
      options: [
        "Being too happy all the time",
        "Running out of food in the kitchen",
        "Staff sleeping at the front desk",
        "Chronic physical and emotional exhaustion resulting from continuous high-stress customer conflict; prevented through rotational desk shifts and immediate post-incident debriefs"
      ],
      correct_option_index: 3,
      explanation: "Compassion fatigue causes emotional burnout in frontline staff; rotating duties and managerial support check-ins maintain emotional resilience.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "When managing an intoxicated and disruptive guest in a luxury dining room, what is the safest and most professional operational protocol?",
      options: [
        "Challenging the guest to a physical fight",
        "Discreetly discontinuing alcohol service with complimentary food/water, moving the conversation to a private area away from other diners, and arranging safe transit",
        "Serving unlimited alcohol until they fall asleep",
        "Yelling at the guest in front of everyone"
      ],
      correct_option_index: 1,
      explanation: "Cutting off alcohol gently, moving conversations to private spaces, and ensuring safe transportation de-escalates conflict while preserving guest dignity.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In linguistic de-escalation, how does replacing 'You did not explain the issue clearly' with 'I want to make sure I completely understand; could you help clarify?' alter the interaction dynamic?",
      options: [
        "It makes the conversation take 10 hours",
        "It makes the guest angry",
        "It eliminates accusatory 'you' language that induces defensiveness, shifting the posture to cooperative ownership and sincere partnership in finding a solution",
        "It allows the hotel to charge more money"
      ],
      correct_option_index: 2,
      explanation: "Removing accusatory language replaces conflict with collaborative problem-solving, lowering defensive barriers immediately.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In the 'L.E.A.R.N.' service recovery framework, what does the final step 'N' (Notify) entail?",
      options: [
        "Documenting the incident in the PMS and communicating details across incoming shifts and department heads so all staff are aligned on the recovery status",
        "Calling the police for every minor complaint",
        "Notifying the local news media",
        "Leaving a sticky note on the floor"
      ],
      correct_option_index: 0,
      explanation: "The Notify step ensures complete cross-shift documentation so subsequent staff members recognize the guest and maintain seamless service continuity.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #42.");
  console.log("Skill #42 update completed successfully!");
}

run();
