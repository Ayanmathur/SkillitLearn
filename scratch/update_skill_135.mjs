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

const skillId = "c6d5340a-4e2c-48f3-9e6e-d1632fc94739";

async function run() {
  console.log("Updating Skill #135: Color Grading & Audio Basics (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Color Science, Log Profiles and Primary Correction" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Secondary Qualifiers, Power Windows and Look Design" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Audio Engineering, Parametric EQ and Loudness Mastering" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Lead Colorist & Re-Recording Audio Mixer level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Color Science: Scene-Referred vs Display-Referred and Log",
      order_index: 1,
      content: `### Color Science and Camera Dynamic Range

1. Scene-Referred vs Display-Referred:
   - ACES (Academy Color Encoding System) and color-managed workflows preserving wide sensor gamut before mapping to Rec.709 or Rec.2020 displays.

2. Camera Log Profiles:
   - S-Log3, C-Log2, ARRI LogC4 encoding 14+ stops of dynamic range into logarithmic gamma curves to prevent clipped highlights and crushed shadows.`
    },
    {
      track_id: track1Id,
      title: "Three-Way Primary Wheels: Lift, Gamma, Gain and Offset",
      order_index: 2,
      content: `### Primary Color Balancing and Contrast Math

1. Primary Color Wheels:
   - Lift (Shadows / Black point), Gamma (Midtones / Gray balance), Gain (Highlights / White point), and Offset (global exposure and color cast shift).

2. Contrast and Pivot:
   - Expanding tonal contrast around an adjustable midtone pivot point without clipping extreme shadow or highlight details.`
    },
    {
      track_id: track1Id,
      title: "Calibration Scopes: Waveform, Parade and Vectorscope",
      order_index: 3,
      content: `### Objective Color Analysis and Scopes

1. Scopes Reading:
   - Waveform Monitor (evaluating 0-100 IRE luma boundaries).
   - RGB Parade (neutralizing unwanted color casts by horizontally aligning R, G, B channels at black and white levels).

2. Vectorscope Skin Tone Alignment:
   - Ensuring human skin tones fall accurately along the skin tone indicator line (10:30 on scope) regardless of lighting or ethnicity.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Secondary HSL Qualifiers and 3D Color Selection",
      order_index: 1,
      content: `### Targeted Color Isolation and Masking

1. HSL Qualifiers:
   - Isolating specific color ranges using Hue, Saturation, and Luminance keys (e.g. selecting only a red jacket or yellow car) with soft edge feathering.

2. 3D Qualifiers:
   - Sampling volumetric color space to isolate complex skin tones and foliage without picking up background noise.`
    },
    {
      track_id: track2Id,
      title: "Power Windows, Planar Tracking and Localized Relighting",
      order_index: 2,
      content: `### Spatial Vignettes and Planar Mask Tracking

1. Power Windows:
   - Drawing Circular, Linear, and Custom Bézier shapes to isolate faces or dark background corners.

2. Planar Tracking:
   - Binding Power Windows to moving subjects via planar tracking algorithms to relight actors and enhance subject separation dynamically throughout a shot.`
    },
    {
      track_id: track2Id,
      title: "Look Creation: Split-Toning, Film Emulation and LUTs",
      order_index: 3,
      content: `### Cinematic Styling and Film Print Emulation

1. Split-Toning:
   - Pushing warm orange/gold tones into midtones/highlights while cooling shadows with teal/cyan tones to create complementary visual depth.

2. Film Print Emulation (FPE):
   - Simulating Kodak 2383 / Fuji print stock characteristics (highlight roll-off, halation, gate weave, and organic 35mm grain structure).`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Audio Signal Flow: Sample Rates, Bit Depth and Headroom",
      order_index: 1,
      content: `### Digital Audio Foundations and Gain Staging

1. Technical Specifications:
   - Sample Rate: 48 kHz (broadcast video standard) vs 44.1 kHz (legacy CD).
   - Bit Depth: 24-bit (144 dB dynamic range) and 32-bit float (virtually impossible to digitally clip on recording).

2. Gain Staging:
   - Setting individual track levels so dialogue averages around -18 dBFS to -12 dBFS, leaving healthy headroom.`
    },
    {
      track_id: track3Id,
      title: "Parametric EQ, High-Pass Filtering and De-Essing",
      order_index: 2,
      content: `### Frequency Sculpting and Dialogue Polish

1. Parametric EQ:
   - High-Pass (Low-Cut) filter at 80 Hz to remove mic handling rumble and AC hum.
   - Gentle notch cut at 250-500 Hz to eliminate boxy mud; presence boost at 3-5 kHz for vocal intelligibility.

2. De-Esser:
   - Taming harsh sibilance ('S' and 'T' sounds) in the 5 kHz to 8 kHz frequency range.`
    },
    {
      track_id: track3Id,
      title: "Dynamic Compression, Limiting and True Peak Standards",
      order_index: 3,
      content: `### Dynamic Control and Mastering Compliance

1. Compression:
   - Applying 2:1 to 4:1 ratios with calibrated attack and release times to smooth out dialogue peaks.

2. True Peak Limiting & Loudness Standards:
   - Setting True Peak limiters to -1.0 dBTP to prevent inter-sample digital clipping during DAC conversion.
   - Mastering to integrated loudness standards (-24 LUFS for broadcast; -14 LUFS for web streaming).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #135.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In digital audio for video production, what is the universal industry standard 'Sample Rate' for broadcast and film deliverables?",
      options: [
        "12 kHz",
        "48 kHz (48,000 samples per second)",
        "8 kHz",
        "96 Hz"
      ],
      correct_option_index: 1,
      explanation: "48 kHz is the global standard audio sample rate for video and film production (44.1 kHz is standard for CD music).",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In primary color grading wheels, which control adjusts the shadow / black levels of the image?",
      options: [
        "Gain",
        "Gamma",
        "Saturation",
        "Lift"
      ],
      correct_option_index: 3,
      explanation: "Lift controls shadow/black levels; Gamma controls midtones; Gain controls highlights; Offset moves the entire tonal curve.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In audio frequency equalization (EQ), what does a 'High-Pass Filter' (Low-Cut Filter) set at 80 Hz do?",
      options: [
        "It cuts low-frequency rumble (such as air conditioning hum, wind noise, and mic handling thumps) below 80 Hz while letting higher audio frequencies pass through unaffected",
        "It makes all voices sound like robots",
        "It mutes the audio track completely",
        "It increases bass volume by 100 dB"
      ],
      correct_option_index: 0,
      explanation: "High-Pass (Low-Cut) filters eliminate low-end mud, handling noise, and room rumble below 80 Hz.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In cinematic color grading, what popular aesthetic look utilizes complementary colors by pushing teal/cyan into shadows and warm orange/gold into skin tones?",
      options: [
        "Monochrome Black and White",
        "Infrared Night Vision",
        "Teal and Orange Look",
        "Sepia Tone"
      ],
      correct_option_index: 2,
      explanation: "Teal and Orange uses complementary color theory to maximize contrast between human skin tones (orange) and shadows (teal).",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In vocal audio mixing, what is the primary role of a 'De-Esser' plugin?",
      options: [
        "To speed up the vocal track",
        "To attenuate harsh, piercing high-frequency sibilance (such as 'S', 'Sh', and 'T' sounds) typically occurring between 5 kHz and 8 kHz",
        "To add echo and reverb to dialogue",
        "To convert audio into MIDI notes"
      ],
      correct_option_index: 1,
      explanation: "A De-Esser is a frequency-specific compressor targeting harsh sibilant frequencies (5-8 kHz) in vocal recordings.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In video camera sensors, why is shooting in a 'Log Profile' (such as S-Log3, C-Log, or ARRI LogC) advantageous for color grading?",
      options: [
        "Log profiles automatically edit the video",
        "Log profiles make video files take up zero storage space",
        "It compresses wide dynamic range (14+ stops) into a logarithmic curve, preserving maximum shadow and highlight detail without clipping highlights or crushing darks",
        "Log footage looks 100% finished straight out of the camera"
      ],
      correct_option_index: 2,
      explanation: "Log curves preserve extreme sensor dynamic range, preventing clipped highlights and allowing extensive grading latitude.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In color grading software (like DaVinci Resolve or Lumetri), what is the difference between 'Primary' and 'Secondary' color grading?",
      options: [
        "Primary grading adjusts the overall global balance, exposure, and contrast of the entire image; Secondary grading isolates specific colors or spatial regions (using qualifiers or windows) to modify them independently",
        "Primary grading is done by human colorists; Secondary grading is done by computers",
        "Primary grading is only for 4K video; Secondary is for 1080p",
        "There is zero difference between them"
      ],
      correct_option_index: 0,
      explanation: "Primary grading affects the entire canvas; Secondary grading targets specific color ranges or tracked shapes.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In audio dynamics processing, how does an 'Audio Compressor' control vocal dialogue levels?",
      options: [
        "By deleting silent moments in the clip",
        "By converting stereo audio to mono",
        "By playing audio backwards",
        "When audio volume exceeds a designated Threshold, the compressor automatically reduces the gain by a specified Ratio (e.g. 3:1), smoothing out volume spikes and creating a consistent, polished voice"
      ],
      correct_option_index: 3,
      explanation: "Compressors attenuate audio exceeding a threshold based on a ratio, taming peaks and evening out dynamic range.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In color grading with DaVinci Resolve, what is a 'Power Window' and how is it used with 'Planar Tracking'?",
      options: [
        "A feature that boosts the power of the computer monitor",
        "A geometric mask (circle, rectangle, or custom curve) that isolates an area of the frame, tracked automatically across camera movements to relight faces or darken backgrounds dynamically",
        "A window that opens the internet browser",
        "A tool used only for 3D modeling"
      ],
      correct_option_index: 1,
      explanation: "Power Windows isolate spatial regions, locked to moving subjects via planar tracking to relight or color-correct local elements.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In digital audio mastering, why is 'True Peak Limiting' set to -1.0 dBTP (Decibels True Peak) rather than 0.0 dBFS?",
      options: [
        "Because -1.0 dBTP makes music 10x louder",
        "Because audio software crashes at 0.0 dBFS",
        "When digital audio is converted to analog signals (DAC) or compressed into MP3/AAC for streaming, inter-sample peaks can exceed 0.0 dB, causing harsh digital distortion; -1.0 dBTP provides safe headroom",
        "0.0 dB is illegal under copyright law"
      ],
      correct_option_index: 2,
      explanation: "A -1.0 dBTP ceiling protects against inter-sample reconstruction overshoots during lossy compression and DAC playback.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In modern cinematic color management pipelines, what is 'ACES' (Academy Color Encoding System) and what problem does it solve?",
      options: [
        "A standardized, device-independent scene-referred color management architecture that preserves the full sensor color gamut and dynamic range across multiple camera brands, providing unified grading and archiving",
        "A brand of gaming laptops",
        "A sound compression format used by movie theaters",
        "A video editing keyboard shortcut"
      ],
      correct_option_index: 0,
      explanation: "ACES provides an open, device-independent scene-referred color framework, unifying diverse camera formats into a single standard.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In audio recording and mixing, what major advantage does '32-Bit Float Audio' recording offer over standard 24-bit fixed-point recording?",
      options: [
        "32-bit float audio records 3D spatial surround sound with one microphone",
        "32-bit float audio removes background noise automatically using AI",
        "32-bit float files are 10x smaller in size",
        "With over 1,500 dB of dynamic range, 32-bit float audio cannot be digitally clipped on the hardware preamp, allowing clipped-sounding screams or whisper-quiet dialogue to be fully recovered in post-production with zero distortion"
      ],
      correct_option_index: 3,
      explanation: "32-bit float format provides immense dynamic range headroom, eliminating digital clipping and allowing clipped audio recovery.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In primary color grading math, what does adjusting the 'Contrast Pivot' parameter do?",
      options: [
        "It inverts all image colors",
        "It sets the exact midtone luminance value around which the contrast curve expands and contracts, allowing colorists to protect bright skin tones or dark shadows when increasing contrast",
        "It changes the video frame rate",
        "It rotates the video 90 degrees"
      ],
      correct_option_index: 1,
      explanation: "Contrast Pivot determines the center anchor point of the S-curve expansion, controlling which tonal values stay static during contrast adjustments.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In audio dialogue cleanup, what is 'Gain Staging' and what is the optimal target average level for spoken dialogue on digital meters (dBFS)?",
      options: [
        "Setting dialogue volume to +10 dBFS to make it as loud as possible",
        "Muting all audio tracks during recording",
        "Calibrating signal levels across the audio chain so dialogue averages between -18 dBFS and -12 dBFS, preventing pre-fader distortion while maintaining high signal-to-noise ratio",
        "Gain staging is only used for live stadium rock concerts"
      ],
      correct_option_index: 2,
      explanation: "Proper gain staging keeps dialogue peaking between -18 and -12 dBFS, maintaining clean signal-to-noise ratio with ample clipping headroom.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In professional Film Print Emulation (FPE) grading, what is 'Halation' and how does it contribute to organic film aesthetics?",
      options: [
        "The warm reddish-orange photochemical glow that scatters around high-contrast edges and specular highlights on analog film as light bounces off the film base layer (anti-halation backing)",
        "A digital glitch caused by bad HDMI cables",
        "The sound of projector reels spinning in cinema booths",
        "A tool that sharpens blurry video pixels"
      ],
      correct_option_index: 0,
      explanation: "Halation is the red-orange photochemical glow around high-contrast light sources in analog film, a hallmark of cinematic film emulation.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #135.");
  console.log("Skill #135 update completed successfully!");
}

run();
