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

const skillId = "57ad2237-06e5-4191-881a-8e29beb98f82";

async function run() {
  console.log("Updating Skill #132: Video Editing Fundamentals (9 steps across 3 tracks)...");

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

  // Delete excess tracks if > 3
  if (tracks.length > 3) {
    const extraTrackIds = tracks.slice(3).map(t => t.id);
    await supabase.from("steps").delete().in("track_id", extraTrackIds);
    await supabase.from("tracks").delete().in("id", extraTrackIds);
    tracks = tracks.slice(0, 3);
  }

  // Ensure exactly 3 tracks exist
  while (tracks.length < 3) {
    const { data: newTrack } = await supabase
      .from("tracks")
      .insert({
        skill_id: skillId,
        title: `Track ${tracks.length + 1}: Video Editing Fundamentals`,
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
  await supabase.from("tracks").update({ title: "Track 1: Cinematic Grammar, Continuity and Walter Murch's Rule of Six" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Cut Types, Temporal Pacing and Audio-Visual Rhythm" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Digital Video Codecs, Timecode and Post-Production Pipelines" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Master Film Editor & Post-Production Supervisor level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Kuleshov Effect and Soviet Montage Theory",
      order_index: 1,
      content: `### The Psychological Foundation of Film Editing

1. The Kuleshov Effect (Lev Kuleshov):
   - Viewers derive more emotional meaning from the psychological juxtaposition of two sequential shots than from a single shot in isolation (e.g. neutral face + soup = hunger; neutral face + child = warmth).

2. Soviet Montage:
   - Constructing meaning through colliding visual rhythms and intellectual metaphors.`
    },
    {
      track_id: track1Id,
      title: "Walter Murch's Rule of Six for the Ideal Cut",
      order_index: 2,
      content: `### Editorial Hierarchy and Decision-Making

1. Walter Murch's Rule of Six (Ranked Importance):
   - 1. Emotion (51%): Does the cut reflect the emotional truth of the scene?
   - 2. Story (23%): Does the cut advance the narrative?
   - 3. Rhythm (10%): Does the cut occur at a musically correct instant?
   - 4. Eye-Trace (7%): Does the cut respect viewer visual gaze?
   - 5. 2D Plane of Screen (5%): 180-degree axis.
   - 6. 3D Space (4%): Spatial continuity.`
    },
    {
      track_id: track1Id,
      title: "Continuity Editing: The 180-Degree Rule and Match Cuts",
      order_index: 3,
      content: `### Spatial Integrity and Invisible Cutting

1. The 180-Degree Rule:
   - Maintaining cameras on one side of the axis of action to preserve left/right screen direction and eyeline consistency.

2. Match on Action & 30-Degree Rule:
   - Cutting inside physical motion (e.g. opening a door) to mask the cut invisibly; shifting camera angle by at least 30 degrees to prevent jarring Jump Cuts.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Cut Grammar: Hard Cuts, J-Cuts, L-Cuts and Smash Cuts",
      order_index: 1,
      content: `### Structural Cut Vocabulary and Transitions

1. J-Cuts and L-Cuts:
   - J-Cut: Incoming audio precedes video cut, pulling audience attention forward naturally.
   - L-Cut: Outgoing audio continues beneath the new visual shot, creating conversational realism.

2. Smash Cuts and Graphic Matches:
   - Smash Cut: Abrupt high-contrast cut.
   - Graphic Match Cut: Linking shots with identical visual shapes across time.`
    },
    {
      track_id: track2Id,
      title: "Cross-Cutting, Parallel Editing and Tension Escalation",
      order_index: 2,
      content: `### Multi-Narrative Pacing and Simultaneous Action

1. Parallel Editing (Cross-Cutting):
   - Alternating between two or more simultaneous events in separate locations (e.g. The Godfather baptism scene).

2. Tension Pacing:
   - Progressively accelerating cut frequency (shortening shot durations) as simultaneous narrative threads converge toward a shared dramatic climax.`
    },
    {
      track_id: track2Id,
      title: "Pacing, Dialogue Subtext and Reaction Cuts",
      order_index: 3,
      content: `### Subtextual Editing and Conversational Rhythm

1. Cutting for Subtext:
   - Rejecting mechanical ping-pong cutting (cutting solely to whoever is speaking); holding on the silent listening character to capture non-verbal reactions and subtextual tension.

2. Pacing Waves:
   - Structuring scene tempo with organic breathing room (peaks and valleys) rather than uniform metric cut lengths.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Intraframe vs Interframe (Long-GOP) Compression",
      order_index: 1,
      content: `### Video Encoding and Timeline Performance

1. Intraframe Codecs (ProRes 422 HQ, Avid DNxHR, CineForm):
   - Compresses each video frame independently; larger file size, but delivers smooth scrubbing and low CPU decoding overhead.

2. Interframe Codecs (H.264 / AVC, H.265 / HEVC):
   - Long-GOP structure using I, P, B frames; smaller file size for delivery, but causes severe CPU lag and dropped frames during timeline editing.`
    },
    {
      track_id: track3Id,
      title: "Chroma Subsampling (4:2:2 vs 4:2:0), Bit Depth and RAW",
      order_index: 2,
      content: `### Color Precision and Pixel Bit Depth

1. Chroma Subsampling:
   - 4:4:4 (full color), 4:2:2 (broadcast standard, half horizontal color resolution), 4:2:0 (consumer web standard, quarter color resolution).

2. Bit Depth:
   - 8-Bit (256 shades per channel = 16.7M colors; prone to banding) vs 10-Bit (1,024 shades = 1.07B colors; essential for HDR and heavy color grading).`
    },
    {
      track_id: track3Id,
      title: "Offline/Online Proxy Workflows, Timecode and Conform",
      order_index: 3,
      content: `### Enterprise Post-Production Pipelines

1. SMPTE Timecode:
   - Non-Drop Frame (NDF) vs Drop Frame (DF at 29.97 fps dropping frame numbers to sync with clock time).

2. Proxy Workflows:
   - Editing lightweight ProRes Proxy (1080p) files, then executing an Online Conform (relinking timeline XML/EDL to original 4K/8K camera RAW files for color grading and mastering).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #132.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "According to Walter Murch's famous 'Rule of Six', what is the single MOST important criterion (accounting for 51% of the decision) for an ideal cut?",
      options: [
        "Emotion (does the cut reflect the emotional truth of the scene?)",
        "3D Space of Action",
        "Two-Dimensional Plane of Screen",
        "Eye-Trace"
      ],
      correct_option_index: 0,
      explanation: "Walter Murch assigns 51% of the cutting decision to Emotion, prioritizing emotional truth above technical continuity.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In video editing terminology, what is a 'J-Cut'?",
      options: [
        "A cut where video and audio change at the exact same frame",
        "A cut where the screen turns into the letter J",
        "A split edit where the audio of the upcoming scene begins playing BEFORE the video cuts to the new shot, pulling the audience forward naturally",
        "A cut made with a laser"
      ],
      correct_option_index: 2,
      explanation: "In a J-Cut, audio leads video, creating seamless and natural conversational transitions.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In cinematography and continuity editing, what is the '180-Degree Rule'?",
      options: [
        "Cameras must rotate in a complete circle around actors",
        "An imaginary line (axis of action) connecting two subjects; cameras must remain on one side of the line to prevent confusing left/right screen-direction reversals",
        "The rule that video editing software must run at 180 FPS",
        "The angle of the computer monitor"
      ],
      correct_option_index: 1,
      explanation: "The 180-degree rule maintains consistent spatial orientation and eyelines by keeping cameras on one side of the axis of action.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In film history and psychological editing theory, what did the 'Kuleshov Effect' demonstrate?",
      options: [
        "That black and white films look better than color",
        "That actors must speak very loudly",
        "That sound effects are louder than music",
        "Viewers derive more emotional meaning and subtext from the interaction of two sequential shots cut together than from a single shot in isolation"
      ],
      correct_option_index: 3,
      explanation: "Lev Kuleshov proved that editing creates mental juxtaposition, generating emergent emotional meaning between sequential shots.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What is an 'L-Cut' in video editing?",
      options: [
        "A split edit where the audio from the previous shot continues playing beneath the incoming visual shot",
        "Cutting footage in the shape of an L",
        "A low-quality video format",
        "A keyboard shortcut that deletes a clip"
      ],
      correct_option_index: 0,
      explanation: "In an L-Cut, audio from the outgoing shot carries over into the next visual scene, smoothing the cut.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In video compression engineering, why are 'Intraframe Codecs' (such as Apple ProRes or Avid DNxHR) vastly superior for timeline editing compared to 'Interframe Codecs' (such as H.264 / H.265)?",
      options: [
        "Intraframe codecs have smaller file sizes than H.264",
        "Intraframe codecs delete all background noise",
        "Intraframe codecs only work on YouTube",
        "Intraframe codecs compress each frame as an independent image, allowing instantaneous CPU scrubbing and playback without the heavy processing strain of reconstructing Long-GOP predictive frames"
      ],
      correct_option_index: 3,
      explanation: "Intraframe codecs decode every frame independently, eliminating the CPU bottleneck of reconstructing Long-GOP I/P/B frame sequences.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In continuity editing, what is 'Cutting on Action' (Match on Action) and why is it used?",
      options: [
        "Cutting only during car explosion scenes",
        "Slicing the video cut point during an ongoing physical subject movement (such as opening a door or standing up), using the visual motion to make the cut invisible to the human eye",
        "Cutting footage to the tempo of techno music",
        "Cutting whenever an actor stops talking"
      ],
      correct_option_index: 1,
      explanation: "Match on Action masks the cut point inside continuous physical movement, maintaining the illusion of uninterrupted time.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In post-production, what is an 'Offline / Online Proxy Editing Workflow'?",
      options: [
        "Editing lightweight, low-resolution proxy files (e.g. 1080p ProRes Proxy) for fast timeline responsiveness, then relinking the final timeline (Online Conform) back to original 4K/8K RAW camera media for color grading and mastering",
        "Editing without an internet connection",
        "Using paper storyboards instead of computers",
        "Exporting videos directly to VHS tapes"
      ],
      correct_option_index: 0,
      explanation: "Proxy workflows decouple heavy raw media from creative editorial, conforming back to high-res camera originals for finishing.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In digital color precision, why is '10-Bit Color Depth' (1,024 shades per channel) essential for professional color grading over standard '8-Bit Color Depth' (256 shades)?",
      options: [
        "10-bit color makes the computer monitor louder",
        "8-bit color is incompatible with video editing software",
        "10-bit offers 1.07 billion colors compared to 16.7 million in 8-bit, providing smooth tonal gradients that prevent ugly color banding artifacts when pushing contrast in Log and HDR footage",
        "10-bit color makes videos run twice as fast"
      ],
      correct_option_index: 2,
      explanation: "10-bit provides 64x more color data per channel than 8-bit, preventing color banding in smooth skies and shadows during color grading.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In cinematic narrative pacing, what is 'Parallel Editing' (Cross-Cutting)?",
      options: [
        "Editing two identical video tracks on top of each other",
        "Editing video horizontally across two screens",
        "A technique used only in animated cartoons",
        "Alternating between two or more separate narrative actions occurring simultaneously in different locations, building suspense and thematic connections as cut frequency accelerates"
      ],
      correct_option_index: 3,
      explanation: "Cross-cutting cuts between simultaneous events, creating narrative tension, dramatic comparison, and thematic resonance.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In dialogue editing for dramatic films, why is 'Ping-Pong Editing' (mechanically cutting back and forth strictly to whoever is delivering dialogue) considered amateurish?",
      options: [
        "Because table tennis is not allowed in movies",
        "It treats dialogue as mere radio audio; true cinema captures the dramatic subtext and emotional stakes by holding on the silent reaction of the listening character, revealing their internal conflict",
        "Because ping-pong editing causes audio phase cancellation",
        "Because actors prefer not to be filmed while speaking"
      ],
      correct_option_index: 1,
      explanation: "Cutting solely on spoken lines ignores subtext; holding on reaction shots reveals character thought, vulnerability, and subtextual tension.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In broadcast television and video synchronization, what is the difference between 'Non-Drop Frame' (NDF) and 'Drop Frame' (DF) SMPTE Timecode at 29.97 FPS?",
      options: [
        "NDF drops audio frames; DF drops video frames",
        "DF is used only in cinema theaters",
        "Because 29.97 fps is slightly slower than 30 fps, NDF drifts by 108 frames per hour against real-time clock time; Drop Frame periodically skips frame NUMBERS (not actual video frames) to synchronize perfectly with real-world clocks",
        "Drop Frame deletes every second frame to save disk space"
      ],
      correct_option_index: 2,
      explanation: "Drop Frame skips timecode numbering (not video frames) to eliminate the 3.6-second-per-hour clock drift of 29.97 fps.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In video color subsampling, what does '4:2:2 Chroma Subsampling' indicate compared to uncompressed '4:4:4'?",
      options: [
        "In every 4x2 pixel block, full luma (brightness) is preserved for all 4 pixels, but color (chrominance) is sampled at half horizontal resolution, reducing bandwidth by 33% while retaining crisp edges for color grading",
        "4:2:2 deletes all red color channels",
        "4:4:4 is only used for black and white video",
        "4:2:2 means the video is played in 4K resolution"
      ],
      correct_option_index: 0,
      explanation: "4:2:2 preserves full luma clarity while halving horizontal color resolution, balancing professional grading quality with file size.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In continuity editing, what is the '30-Degree Rule' and what visual error does it prevent?",
      options: [
        "The computer temperature must stay below 30 degrees",
        "Actors must tilt their heads 30 degrees",
        "Cameras must rotate 30 degrees every second",
        "When cutting between two consecutive shots of the same subject, the camera angle must shift by at least 30 degrees and change focal length; otherwise, the minor difference appears as a jarring, accidental Jump Cut"
      ],
      correct_option_index: 3,
      explanation: "The 30-degree rule dictates that camera perspective must change significantly between consecutive shots to avoid jarring jump cuts.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "What is a 'Smash Cut' and how is it used dramatically in cinema?",
      options: [
        "A cut that physically breaks the camera lens",
        "An abrupt, jarring cut between two scenes of extreme audio and visual contrast (e.g. cutting from a tranquil quiet dream straight into a loud screaming car crash), startling the audience and maximizing shock",
        "A slow 10-second cross-dissolve between two landscape shots",
        "A cut where the screen turns completely green"
      ],
      correct_option_index: 1,
      explanation: "Smash cuts deliver intense visceral contrast, jolting the audience through sudden shifts in volume, action, or tone.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #132.");
  console.log("Skill #132 update completed successfully!");
}

run();
