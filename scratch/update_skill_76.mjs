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

const skillId = "98a4de75-f2e3-4e31-8cd8-44b918917c21";

async function run() {
  console.log("Updating Skill #76: Script Writing & Storytelling (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Narrative Structural Architecture, Hero's Journey and Story Circles" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: AV Script Formatting, Pacing and Audio-Visual Synchronization" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Short-Form Vertical Scripts, VSLs and Commercial Storytelling" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Screenwriter & Video Direct-Response Master level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Classical Three-Act Structure and Dramatic Arc",
      order_index: 1,
      content: `### Classical Dramatic Structure in Video Scripts

1. Three-Act Narrative Mechanics:
   - Act I (Setup and Inciting Incident): Introduces the protagonist in their ordinary world; the Inciting Incident disrupts equilibrium (around 10% of runtime), forcing Plot Point 1 where the protagonist commits to the journey.
   - Act II (Rising Action, Midpoint, and Crisis): Progressive complications escalate stakes; the Midpoint shifts the protagonist from passive reaction to active pursuit; culminates in the Dark Night of the Soul (All Hope is Lost).
   - Act III (Climax and Resolution): Decisive confrontation, emotional catharsis, and establishment of a new transformed equilibrium.`
    },
    {
      track_id: track1Id,
      title: "The Hero's Journey and Donald Miller's SB7 Brand Framework",
      order_index: 2,
      content: `### Mythological Storytelling and Brand Narrative Architecture

1. Joseph Campbell's Monomyth:
   - Ordinary World -> Call to Adventure -> Crossing the First Threshold -> Supreme Ordeal -> Transformation.

2. Donald Miller's StoryBrand 7-Part (SB7) Framework:
   - 1. A Character: The Customer is ALWAYS the Hero of the story (never the brand).
   - 2. Has a Problem: External, Internal, and Philosophical pain points.
   - 3. Meets a Guide: The Brand acts as the trusted Mentor/Guide (expressing Empathy and Authority).
   - 4. Who Gives Them a Plan: Clear 3-step actionable roadmap.
   - 5. And Calls Them to Action: Direct CTA.
   - 6. That Helps Them Avoid Failure: Explicit stakes of inaction.
   - 7. And Ends in a Success: Transformation and celebration.`
    },
    {
      track_id: track1Id,
      title: "Dan Harmon's 8-Step Story Circle and Character Transformation",
      order_index: 3,
      content: `### Cyclical Narrative Algorithms in Short-Form Content

1. Dan Harmon's 8-Step Story Circle:
   - 1. YOU: A character is in a zone of comfort.
   - 2. NEED: But they want something.
   - 3. GO: They enter an unfamiliar situation.
   - 4. SEARCH: Adapt to it through trials.
   - 5. FIND: Get what they wanted.
   - 6. TAKE: Pay a heavy price for it.
   - 7. RETURN: Return to their familiar situation.
   - 8. CHANGE: Having fundamentally transformed as an individual.

2. Commercial Application:
   - Condensing all 8 steps into a 60-second video ad creates an emotionally satisfying, complete narrative arc.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The Two-Column Audio-Visual (AV) Script Standard",
      order_index: 1,
      content: `### Professional Commercial Video Script Formatting

1. Two-Column Audio-Visual (AV) Script Layout:
   - Left Column (VIDEO): Shot framing (Wide Shot WS, Medium Shot MS, Close-Up CU), camera motion (Dolly In, Pan, Tilt), talent physical actions, B-Roll footage descriptions, and on-screen text overlays (Lower Thirds, kinetic typography).
   - Right Column (AUDIO): Spoken dialogue (Voiceover VO, A-Roll on-camera speech), sound effects (SFX: whooshes, UI clicks, risers), and background music track shifts (beat drops, audio ducking under dialogue).`
    },
    {
      track_id: track2Id,
      title: "Voiceover Cadence, WPM Metrics and Dialogic Direction",
      order_index: 2,
      content: `### Vocal Timing, Pacing and Performance Notation

1. Words Per Minute (WPM) Conversational Benchmarks:
   - 130 to 150 WPM: Standard conversational rate for explainer videos and educational documentaries.
   - 160 to 180 WPM: High-energy pacing for direct-response social media ads.

2. Actor Direction Notations:
   - Parentheticals: Indicating emotional delivery \`(skeptical)\`, vocal cadence, breath marks, and dramatic pauses \`[beat]\` to guide voice actors toward authentic delivery.`
    },
    {
      track_id: track2Id,
      title: "Pattern Interrupts, Visual Hooks and Editing Synchronicity",
      order_index: 3,
      content: `### Retention Engineering and Cognitive Resetting

1. The Visual Hook (0 to 3 Seconds):
   - Sudden dynamic movement, an unusual physical prop, or high-contrast visual action that arrests scrolling in the social feed.

2. The 4-to-6 Second Pattern Interrupt Rule:
   - Changing camera angles, performing digital punch-ins (scaling frame by 15%), inserting B-Roll cutaways, or triggering sound effects every 4 to 6 seconds to reset viewer cognitive attention and maintain high audience retention graphs.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Short-Form Vertical Scripts: TikTok, Reels and Shorts",
      order_index: 1,
      content: `### Vertical Video Narrative Architecture

1. The 15 to 60 Second Short-Form Script Formula:
   - Hook (0 to 3s): Spoken hook synchronized with Text-on-Screen (TOS) headline (\"If you build websites, stop doing this...\").
   - Problem Agitation (3 to 12s): Showcases the frustrating bottleneck.
   - Mechanism & Solution (12 to 45s): High-speed tactical walkthrough or demonstration.
   - Call to Action (45 to 60s): Seamless loop transition or keyword comment trigger (\"Comment AUDIT for the free tool\").`
    },
    {
      track_id: track3Id,
      title: "Direct-Response Video Sales Letters (VSLs) and Epiphany Bridges",
      order_index: 2,
      content: `### Long-Form Video Conversion Architecture

1. Russell Brunson's Epiphany Bridge Script:
   - Backstory and Core Desire -> The Wall (insurmountable obstacle) -> The Epiphany (breakthrough discovery of the new vehicle) -> The Framework (strategy) -> The Irresistible Offer.

2. The Text-Only VSL Format (Jon Benson):
   - Displaying black text on a clean white background with highlighted red focus words synchronized to voiceover audio, stripping away visual distractions to drive hypnotic focus on sales copy.`
    },
    {
      track_id: track3Id,
      title: "B2B Case Study Video Storytelling and Testimonial Scripts",
      order_index: 3,
      content: `### Enterprise Transformation Narrative Frameworks

1. The 4-Part Case Study Video Arc:
   - 1. The Pre-Existing Bottleneck: Legacy architecture failing under load or causing high operational expenses.
   - 2. The Search and Evaluation: Overcoming skepticism and selecting the vendor.
   - 3. Rapid Implementation: Frictionless onboarding and initial time-to-value.
   - 4. Quantifiable Outcomes: Hard empirical business metrics (+240% throughput, $1.4M annual cloud compute savings, zero production outages).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #76.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In Donald Miller's StoryBrand 7-Part (SB7) framework, who must ALWAYS be positioned as the hero of the story?",
      options: [
        "The Customer",
        "The Brand/Company",
        "The CEO",
        "The Lead Software Engineer"
      ],
      correct_option_index: 0,
      explanation: "In the SB7 framework, the customer is always the hero; the brand acts as the wise guide/mentor (like Yoda or Gandalf).",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In the professional Two-Column Audio-Visual (AV) script format, what content is documented in the Left Column?",
      options: [
        "Financial accounting balance sheets",
        "The musical notes of the soundtrack",
        "Video and visual cues (Shot framing, camera motion, talent physical actions, B-roll descriptions, on-screen graphics)",
        "Actor salary information"
      ],
      correct_option_index: 2,
      explanation: "The left column of an AV script contains all visual direction, camera movements, shot sizes, and graphics.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What is the recommended conversational voiceover speaking rate (Words Per Minute) for explainer and educational video scripts?",
      options: [
        "50 WPM",
        "130 to 150 Words Per Minute (WPM)",
        "400 WPM",
        "10 WPM"
      ],
      correct_option_index: 1,
      explanation: "130 to 150 WPM represents the sweet spot for clear, conversational, articulate voiceover narration.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In short-form vertical video (TikTok, Instagram Reels, YouTube Shorts), what is the critical window of time to deliver the visual and verbal hook?",
      options: [
        "After 25 minutes",
        "At the exact end of the video",
        "Only in the description caption",
        "The first 0 to 3 seconds"
      ],
      correct_option_index: 3,
      explanation: "Viewers decide whether to scroll away within the first 3 seconds; hooks must immediately arrest attention.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In dramatic video pacing, what is a 'Pattern Interrupt'?",
      options: [
        "A planned change in camera angle, visual punch-in, sound effect, or graphic every 4 to 6 seconds to reset viewer cognitive attention and boost retention",
        "A power outage that turns off the camera",
        "Deleting the video editing timeline",
        "A grammatical error in the script"
      ],
      correct_option_index: 0,
      explanation: "Pattern interrupts refresh visual stimulation every few seconds, preventing viewers from becoming bored and dropping off.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In Dan Harmon's 8-Step Story Circle, what occurs at Step 6 ('TAKE')?",
      options: [
        "The protagonist goes to sleep",
        "The movie ends with credits",
        "The character buys a car",
        "The protagonist gets what they wanted, but pays a heavy emotional or physical price for it"
      ],
      correct_option_index: 3,
      explanation: "Step 6 ('Take') represents paying the necessary price or consequence for achieving the object of desire.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In direct-response sales video scriptwriting, what is Russell Brunson's 'Epiphany Bridge' script structure designed to do?",
      options: [
        "Teach civil engineering",
        "Take the audience through the exact emotional backstory, struggle, and discovery that gave the speaker the breakthrough epiphany, causing the listener to arrive at the same belief on their own",
        "Sell physical bridge tolls",
        "Translate English scripts to Spanish"
      ],
      correct_option_index: 1,
      explanation: "The Epiphany Bridge builds empathy through narrative backstory so the audience experiences the same breakthrough realization.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In script notation and voice actor direction, what does the parenthetical notation '[beat]' indicate?",
      options: [
        "A brief dramatic pause or momentary silence before resuming dialogue",
        "Punching the microphone with a fist",
        "Playing a drum solo",
        "Turning up the volume to maximum"
      ],
      correct_option_index: 0,
      explanation: "[beat] instructs the voice actor to pause for a fraction of a second, letting a crucial point resonate emotionally.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In B2B customer case study video storytelling, why must the story highlight hard quantifiable metrics in Act 4 (Outcome)?",
      options: [
        "Numbers look pretty on video",
        "B2B buyers do not care about feelings",
        "It provides empirical proof of ROI (+240% throughput, $1.4M savings), giving enterprise decision-makers logical justification to purchase",
        "Case studies are required to have math equations by law"
      ],
      correct_option_index: 2,
      explanation: "Enterprise B2B buyers require empirical quantifiable metrics to justify purchasing decisions to internal finance committees.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In video script editing terminology, what is 'B-Roll' footage?",
      options: [
        "Defective footage thrown in the trash",
        "Footage of the letter B",
        "The audio track of a podcast",
        "Supplemental visual footage (product demos, cutaway shots, ambient workplace action) intercut over the primary speaker's voice to illustrate what is being discussed"
      ],
      correct_option_index: 3,
      explanation: "B-roll provides visual context and coverage, showing supporting scenes while the main voiceover continues playing.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In the Three-Act Screenwriting structure, what is the 'Dark Night of the Soul' (All Hope is Lost moment) and where does it occur?",
      options: [
        "The first second of the video",
        "The lowest emotional point near the end of Act II (around 75% of runtime), where all previous plans have failed, forcing internal transformation before the final climax",
        "The post-credits scene",
        "The opening logo animation"
      ],
      correct_option_index: 1,
      explanation: "The Dark Night of the Soul is the crisis point where external tactics fail, catalyzing inner character growth for Act III.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Jon Benson's 'Ugly VSL' (Video Sales Letter) formula, why is synchronized black text on a clean white background with highlighted focus words so effective?",
      options: [
        "It is cheap to produce",
        "It looks like an old book",
        "It strips away visual distractions, synchronizing visual reading and auditory processing simultaneously to induce intense cognitive focus on the persuasive sales copy",
        "It is the only format supported on mobile"
      ],
      correct_option_index: 2,
      explanation: "Dual sensory synchronization (reading and hearing identical words simultaneously) eliminates distraction and maximizes copy retention.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In short-form vertical video scripting, what is a 'Seamless Loop' CTA?",
      options: [
        "Drafting the concluding sentence so that its syntax grammatically and logically flows directly into the very first sentence of the opening hook, encouraging viewers to watch a second time",
        "A video that plays in reverse",
        "A video that never stops playing",
        "A circular video frame"
      ],
      correct_option_index: 0,
      explanation: "Seamless loops connect the ending line to the opening hook, causing the video to loop effortlessly and boosting completion rates.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In StoryBrand (SB7) philosophy, what role does the brand assume when positioning the customer as the hero?",
      options: [
        "The Villain",
        "The Victim",
        "The Sidekick who does nothing",
        "The Guide / Mentor (embodying Empathy and Authority) who gives the hero the plan and tools to succeed"
      ],
      correct_option_index: 3,
      explanation: "The brand positions itself as the trusted guide (like Yoda), supporting the customer hero with empathy and proven authority.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In video audio design and script direction, what is 'Audio Ducking'?",
      options: [
        "Making quacking duck sounds",
        "Automatically lowering the volume of background music and sound effects whenever the voiceover narration or actor dialogue is speaking, ensuring pristine vocal clarity",
        "Muting the video completely",
        "Deleting the audio track"
      ],
      correct_option_index: 1,
      explanation: "Audio ducking attenuates background music levels when dialogue is active so the voice remains crisp and intelligible.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #76.");
  console.log("Skill #76 update completed successfully!");
}

run();
