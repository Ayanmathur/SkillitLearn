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

const skillId = "9dcef5e0-c7c3-413f-af6b-6cd97c5dab11";

async function run() {
  console.log("Updating Skill #133: Adobe Premiere Pro (9 steps across 3 tracks)...");

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
        title: `Track ${tracks.length + 1}: Adobe Premiere Pro`,
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
  await supabase.from("tracks").update({ title: "Track 1: Project Architecture, Precision Trimming and Multi-Cam Editing" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Dynamic Link, Essential Audio and Lumetri Color Grading" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Captions, Export Pipelines and Master Archiving" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Adobe Certified Master Instructor & Post Supervisor level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Workspace Architecture, Scratch Disks and Media Cache",
      order_index: 1,
      content: `### Project Architecture and Cache Hygiene

1. Media Cache Management:
   - Directing Media Cache database (.mcdb) and peak (.cfa) files to a dedicated NVMe scratch drive to prevent timeline stutter and project corruption.

2. Ingest Settings & Productions:
   - Automating background proxy creation (ProRes Proxy) upon media import; utilizing Premiere Productions for multi-user project locking.`
    },
    {
      track_id: track1Id,
      title: "Advanced Trimming Tools: Ripple, Roll, Slip and Slide",
      order_index: 2,
      content: `### Keyboard-Driven Trimming and Pancake Sequences

1. Trimming Toolset:
   - Ripple Edit (B): Modifies in/out points while shifting downstream clips.
   - Rolling Edit (N): Moves cut boundary between two adjacent clips without altering total timeline length.
   - Slip (Y) vs Slide (U): Slip shifts internal content; Slide moves clip position on timeline.
   - Top/Tail (Q/W) ripple trimming.

2. Pancake Timelines:
   - Stacking source selects timelines directly above master sequences for rapid pull edits.`
    },
    {
      track_id: track1Id,
      title: "Multi-Camera Production Sequences and Waveform Sync",
      order_index: 3,
      content: `### Synchronized Multi-Angle Live Cutting

1. Multi-Cam Sequences:
   - Synchronizing multi-camera clips automatically using audio waveform analysis or embedded timecode.

2. Multi-Camera Monitor:
   - Enabling live multi-angle playback switching using numeric keypad shortcuts (1, 2, 3, 4) to drop edit cuts dynamically on the fly.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Adobe Dynamic Link and Motion Graphics (MOGRTs)",
      order_index: 1,
      content: `### Cross-Application Integration Pipelines

1. Adobe Dynamic Link:
   - Embedding live After Effects compositions into Premiere timelines without intermediate pre-rendering; updates in AE reflect instantly in Premiere.

2. Motion Graphics Templates (.mogrt):
   - Utilizing AE-authored MOGRTs with responsive design time pins that automatically preserve intro and outro animation durations when stretched.`
    },
    {
      track_id: track2Id,
      title: "Essential Sound Panel and Broadcast Loudness Standards",
      order_index: 2,
      content: `### Audio Post-Production and Loudness Compliance

1. Essential Sound Workflows:
   - Tagging audio stems as Dialogue, Music, SFX, or Ambience.

2. Loudness Normalization:
   - Auto-matching dialogue loudness to broadcast standards (EBU R128 at -24 LUFS) or web streaming targets (-14 LUFS to -16 LUFS on YouTube/Spotify).
   - Real-time DeNoise, DeReverb, and spectral DeHum filtering.`
    },
    {
      track_id: track2Id,
      title: "Lumetri Color Pipeline, Scopes and Skin Tone Indicator",
      order_index: 3,
      content: `### Color Grading and Calibration Scopes

1. Lumetri Processing Order:
   - Technical Input LUT (Log transform) -> Basic Exposure/WhiteBalance -> Curves & Color Wheels -> HSL Secondary Qualifiers -> Creative Look LUT.

2. Lumetri Scopes:
   - Waveform (evaluating 0-100 IRE luma limits), RGB Parade (balancing color channels), and Vectorscope with the Skin Tone Line (aligning skin tones precisely along the 10:30 axis).`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Speech-to-Text Auto-Transcription and Captioning",
      order_index: 1,
      content: `### AI Transcription and Accessibility Subtitling

1. Speech-to-Text Engine:
   - Generating automated speech transcriptions with multi-speaker detection directly in the Text panel.

2. Subtitle Tracks:
   - Converting transcriptions into customizable closed captions (CEA-708, SRT) with strict line-length limits and broadcast timing templates.`
    },
    {
      track_id: track3Id,
      title: "Adobe Media Encoder (AME) and Delivery Codecs",
      order_index: 2,
      content: `### Background Batch Encoding and Codec Profiles

1. Adobe Media Encoder Queue:
   - Offloading timeline exports to AME for background batch rendering, allowing continuous editorial work in Premiere.

2. Codec Standards:
   - H.264 / H.265 with Variable Bitrate (VBR 2-Pass) for web delivery; Apple ProRes 422 HQ / Avid DNxHR for broadcast mastering deliverables.`
    },
    {
      track_id: track3Id,
      title: "Project Consolidation, Project Manager and Archiving",
      order_index: 3,
      content: `### Cold Storage Archiving and Media Consolidation

1. Project Manager Utility:
   - Consolidating active sequence media into a dedicated archive folder.

2. Transcoding with Handles:
   - Trimming used media with handles (e.g. 24-frame safety padding) while eliminating unreferenced B-roll, shrinking multi-terabyte project folders for efficient long-term archiving.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #133.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In Adobe Premiere Pro trimming, what does the 'Ripple Edit Tool' (Keyboard Shortcut: B) do?",
      options: [
        "It splits the screen into multiple windows",
        "It adjusts the In or Out point of a clip on the timeline while automatically shifting all downstream media forward or backward to close the resulting gap",
        "It applies a water ripple visual effect",
        "It deletes all audio tracks"
      ],
      correct_option_index: 1,
      explanation: "Ripple Edit adjusts a clip's boundary while rippling the rest of the timeline to prevent gaps.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In Premiere Pro, what technology allows an editor to embed an active After Effects composition directly into the Premiere timeline without pre-rendering video files?",
      options: [
        "Apple AirDrop",
        "Bluetooth Sync",
        "QuickTime Player",
        "Adobe Dynamic Link"
      ],
      correct_option_index: 3,
      explanation: "Adobe Dynamic Link embeds live After Effects compositions in Premiere timelines with zero intermediate rendering.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In the Lumetri Color Vectorscope, what does the 'Skin Tone Line' (located at approximately 10:30 on the scope dial) represent?",
      options: [
        "A universal hue axis representing human blood perfusion under skin, indicating that healthy human skin tones across all ethnicities align along this exact line",
        "A color bar for cartoon characters",
        "A measure of monitor brightness",
        "A battery health indicator"
      ],
      correct_option_index: 0,
      explanation: "The skin tone line represents hemoglobin light reflection; healthy human skin aligns on this vector regardless of race.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In Premiere Pro timeline editing, what do the 'Q' and 'W' keyboard shortcuts (Top and Tail Trimming) execute?",
      options: [
        "They turn on the computer webcam",
        "They change timeline zoom levels",
        "Q ripples deletes from the start of the clip to the playhead; W ripple deletes from the playhead to the end of the clip",
        "They mute the audio volume"
      ],
      correct_option_index: 2,
      explanation: "Q (Ripple Trim Previous Edit to Playhead) and W (Ripple Trim Next Edit to Playhead) execute instant top-and-tail trims.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In Adobe Premiere Pro audio mastering, what does 'LUFS' measure?",
      options: [
        "Laser Ultra Frequency Sound",
        "Loudness Units relative to Full Scale, the international standard for measuring perceived human loudness over time",
        "Linear Unit File Size",
        "Light Under Film Surface"
      ],
      correct_option_index: 1,
      explanation: "LUFS (Loudness Units Full Scale) is the global broadcast and streaming standard for measuring integrated audio loudness.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In Premiere Pro timeline editing, what is the key difference between the 'Slip Tool' (Y) and the 'Slide Tool' (U)?",
      options: [
        "Slip is for audio; Slide is for video",
        "Slip makes clips faster; Slide makes clips slower",
        "Slip changes the internal in/out frames of a clip without moving its position on the timeline; Slide moves the clip along the timeline, changing the head and tail of adjacent clips without changing its internal frames",
        "There is zero difference between them"
      ],
      correct_option_index: 2,
      explanation: "Slip changes the visible portion inside a fixed timeline window; Slide moves the window along the timeline, trimming adjacent clips.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Lumetri Color grading, what is the critical difference between a 'Technical Input LUT' and a 'Creative Look LUT'?",
      options: [
        "A Technical Input LUT mathematically converts flat camera Log profiles (e.g. S-Log3, C-Log) into standardized Rec.709 color space; a Creative Look LUT applies stylistic artistic color grading",
        "Technical LUTs only work in black and white",
        "Creative LUTs are used only for 3D animation",
        "Technical LUTs delete exposure data"
      ],
      correct_option_index: 0,
      explanation: "Input LUTs normalize camera Log sensors to standard Rec.709; Creative LUTs apply aesthetic color styling afterwards.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In multi-editor post-production workflows, what is the primary advantage of 'Premiere Productions' over traditional standalone `.prproj` project files?",
      options: [
        "Productions makes video files 10x smaller",
        "Productions automatically uploads files to YouTube",
        "Productions is a video editing mobile app",
        "Productions divides a massive documentary or feature film into a lightweight cross-referenced folder of project bins, with automatic project locking that prevents multiple editors from overwriting each other's work"
      ],
      correct_option_index: 3,
      explanation: "Premiere Productions breaks massive projects into small referenced files with project locking for multi-user collaboration.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In After Effects Motion Graphics Templates (.mogrt), how does 'Responsive Design - Time' ensure title animations behave properly when stretched on a Premiere timeline?",
      options: [
        "It speeds up the entire animation by 200%",
        "It pins intro and outro keyframe animations so their durations remain constant, while only the middle resting hold time expands or contracts when the template is resized on the timeline",
        "It turns vector graphics into raster images",
        "It deletes keyframes automatically"
      ],
      correct_option_index: 1,
      explanation: "Responsive Design Time pins intro/outro keyframe timing, stretching only the static middle hold area when extended.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In audio post-production, what are the target integrated loudness standards for European Broadcast (EBU R128) versus Online Streaming Platforms (YouTube/Spotify)?",
      options: [
        "Broadcast: 0 LUFS; Streaming: -50 LUFS",
        "Broadcast: -10 LUFS; Streaming: -30 LUFS",
        "Broadcast: -24 LUFS (EBU R128) / -23 LUFS; Streaming: -14 LUFS to -16 LUFS",
        "All platforms require exactly -6 LUFS"
      ],
      correct_option_index: 2,
      explanation: "Broadcast standardizes at -24 LUFS (EBU R128), while web streaming platforms target -14 to -16 LUFS for louder mobile playback.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In Adobe Premiere Pro editing workflow, what is a 'Pancake Timeline' and why do professional editors rely on it for documentary and unscripted editing?",
      options: [
        "Stacking two timeline panels vertically (a 'Selects' sequence containing organized B-roll/interviews on top, and the master 'Assembly' sequence on the bottom), allowing instant visual scanning and drag-and-drop pull edits",
        "A timeline shaped like a breakfast pancake",
        "A timeline that renders video in circles",
        "A method to edit on two computers simultaneously"
      ],
      correct_option_index: 0,
      explanation: "Pancake timelines stack a source selects sequence above an active assembly timeline, speeding up pull-editing dramatically.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In long-term project archiving, how does Premiere Pro's 'Project Manager' utility consolidate media with 'Handles'?",
      options: [
        "By printing physical paper film strips",
        "By deleting all project files completely",
        "By converting video files into audio files",
        "It copies or transcodes only the exact media segments utilized on the timeline, adding a configurable number of extra padding frames (e.g. 24-frame handles) to heads and tails while discarding gigabytes of unused raw footage"
      ],
      correct_option_index: 3,
      explanation: "Project Manager trims unused B-roll, saving used clip ranges with handles for compact, future-proof cold storage archives.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In video export settings in Adobe Media Encoder, why is 'Variable Bitrate, 2-Pass' (VBR 2-Pass) encoding preferred over 'Constant Bitrate' (CBR) for web deliverables?",
      options: [
        "CBR is banned on the internet",
        "Pass 1 analyzes the entire video to map complex motion vs static scenes; Pass 2 allocates higher bitrate to high-action scenes and lower bitrate to simple scenes, maximizing visual quality while keeping file size small",
        "VBR 2-Pass renders 10x faster than CBR",
        "VBR 2-Pass only works in 720p resolution"
      ],
      correct_option_index: 1,
      explanation: "VBR 2-Pass analyzes scene complexity first, distributing bits efficiently to maintain maximum clarity in action without bloating file size.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Lumetri Scopes, how does the 'RGB Parade' scope help an editor fix an unwanted color cast in shadow and highlight areas?",
      options: [
        "It turns all colors into green",
        "It measures the audio volume of each color",
        "It displays isolated Red, Green, and Blue waveform graphs side-by-side; when shadows are neutral black, the bottoms of all three RGB graphs align horizontally at 0 IRE, and when highlights are clean white, their peaks align at 100 IRE",
        "RGB Parade is used only for subtitle alignment"
      ],
      correct_option_index: 2,
      explanation: "RGB Parade isolates R, G, B channel luma waveforms side-by-side, allowing editors to balance color casts at black, mid, and white levels.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In Premiere Pro's 'Rolling Edit Tool' (N), what occurs mathematically to the sequence duration and neighboring clips when a cut point is dragged?",
      options: [
        "The overall sequence duration remains strictly unchanged; the outgoing clip's Out point and the incoming clip's In point are adjusted simultaneously by equal and opposite frame counts",
        "The sequence becomes 10 seconds longer",
        "Both clips are deleted from the timeline",
        "The video resolution is doubled"
      ],
      correct_option_index: 0,
      explanation: "Rolling edits roll the edit boundary between two adjacent clips without altering total timeline duration.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #133.");
  console.log("Skill #133 update completed successfully!");
}

run();
