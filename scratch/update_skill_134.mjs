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

const skillId = "1d412263-d520-400c-9d8e-f692eb4d9876";

async function run() {
  console.log("Updating Skill #134: Motion Graphics with After Effects (9 steps across 3 tracks)...");

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
        title: `Track ${tracks.length + 1}: Motion Graphics with After Effects`,
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
  await supabase.from("tracks").update({ title: "Track 1: Graph Editor, Interpolation and Shape Layer Animators" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Expressions, JavaScript Rigging and Master Controls" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: 3D Cameras, Tracking and Green Screen Compositing" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Lead Motion Designer & Technical Director level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Value Graph vs Speed Graph and Bézier Interpolation",
      order_index: 1,
      content: `### Velocity Curves and Keyframe Interpolation

1. Graph Editor Mastery:
   - Speed Graph (velocity in px/sec) vs Value Graph (absolute dimensional values over time).
   - Bézier Handles: Sculpting dynamic velocity curves with 75% to 90% incoming/outgoing influence to achieve snappy commercial motion design timing.

2. Interpolation Types:
   - Linear vs Continuous Bézier vs Hold Keyframes (Ctrl+Alt+H).`
    },
    {
      track_id: track1Id,
      title: "Shape Layer Animators: Trim Paths, Repeater and Wiggle",
      order_index: 2,
      content: `### Parametric Vector Operations and Modifiers

1. Shape Animators:
   - Trim Paths: Animating Start, End, and Offset properties to produce synchronized vector stroke reveals and line flourishes.
   - Repeater: Creating radial or linear arrays with cascading transform offsets (Position, Scale, Rotation, Opacity).

2. Dynamic Modifiers:
   - Wiggle Paths and Zig Zag adding organic procedural vibration.`
    },
    {
      track_id: track1Id,
      title: "Kinetic Typography and 3D Per-Character Text Animators",
      order_index: 3,
      content: `### Range Selectors and Procedural Typography

1. Text Animators:
   - Range Selectors: Controlling letter-by-letter animation via Start, End, and Offset parameters.
   - Advanced Easing: Utilizing Ramp Up, Ramp Down, and Smooth modes to orchestrate kinetic text reveals.

2. 3D Per-Character Animation:
   - Enabling per-character 3D axes to rotate individual letters along Z/Y axes in 3D space.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Core Expression Language: Wiggle, Linear and ValueAtTime",
      order_index: 1,
      content: `### JavaScript Expression Architecture

1. Mathematical Functions:
   - wiggle(frequency, amplitude): Generating organic continuous pseudorandom noise.
   - linear(val, min1, max1, min2, max2): Mapping input ranges dynamically to output motion.

2. Time Offset Dynamics:
   - valueAtTime(time - delay): Sampling upstream layer keyframes with a time offset to create cascading wave delays across layer chains.`
    },
    {
      track_id: track2Id,
      title: "Expression Controls, Slider Slaves and Master Rigging",
      order_index: 2,
      content: `### UI Controller Slaves and Master Null Architecture

1. Expression Controls:
   - Adding Slider, Angle, Point, Color, and Checkbox Controls onto dedicated Master Null layers.

2. Pick-Whipping:
   - Linking dozens of child layer parameters to centralized master sliders via expressions, allowing complex multi-layer animation sequences to be driven by a single master slider.`
    },
    {
      track_id: track2Id,
      title: "Null Parent Hierarchies and Coordinate Transformations",
      order_index: 3,
      content: `### Hierarchical Rigging and Spatial Transforms

1. Null Object Hierarchies:
   - Nesting invisible Null objects (Root -> Global Move -> Local Rotate -> Anchor) to isolate complex compound movements without keyframe collisions.

2. Layer Space Transforms:
   - Utilizing toComp() and toWorld() expressions to translate localized layer coordinates into global 2D/3D composition space.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "3D Cameras, Point of Interest and Depth of Field",
      order_index: 1,
      content: `### Spatial 3D Staging and Camera Optics

1. 3D Camera Configurations:
   - 1-Node Camera (freely positioned/rotated like a physical handheld camera) vs 2-Node Camera (locked to an animated Point of Interest).

2. Optical Simulation:
   - Simulating physical camera lenses with Focus Distance, Aperture, and Blur Level to render photorealistic cinematic Depth of Field (DoF) across 3D planes.`
    },
    {
      track_id: track3Id,
      title: "3D Camera Tracker, Mocha AE Planar Tracking and Solves",
      order_index: 2,
      content: `### Matchmoving and Planar Surface Tracking

1. 3D Camera Tracker:
   - Analyzing background footage parallax to reconstruct real-world camera focal length and movement, solving camera motion with sub-pixel error (< 0.5 px).

2. Mocha AE Planar Tracking:
   - Tracking 2D planes across perspective shifts, occlusion, and motion blur to composite screen replacements and floating graphics.`
    },
    {
      track_id: track3Id,
      title: "Keylight (1.2) Green Screen Keying and Matte Refinement",
      order_index: 3,
      content: `### Chroma Keying and Optical Compositing

1. Keylight 1.2 Extraction:
   - Setting Screen Colour, Screen Gain, and Screen Balance to pull clean alpha transparency from green/blue screens.

2. Matte Optimization:
   - Tuning Screen Matte (Clip Black to remove background noise, Clip White to solidify foreground opacity) and applying Despill Bias to neutralize green color fringing.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #134.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In After Effects keyframe animation, what does pressing the 'F9' keyboard shortcut apply to selected keyframes?",
      options: [
        "Easy Ease (applying smooth Bézier deceleration and acceleration curves to keyframes)",
        "Deletes selected keyframes",
        "Turns keyframes into 3D objects",
        "Exports the composition to disk"
      ],
      correct_option_index: 0,
      explanation: "F9 converts linear keyframes into Easy Ease, applying standard 33% Bézier temporal smoothing.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In the After Effects expression language, what does the expression `wiggle(5, 50)` execute on a layer's Position property?",
      options: [
        "Moves the layer 500 pixels to the right",
        "Freezes the layer for 5 seconds",
        "Applies continuous procedural random jitter occurring 5 times per second with a maximum displacement amplitude of 50 pixels",
        "Rotates the layer 50 degrees"
      ],
      correct_option_index: 2,
      explanation: "The wiggle(frequency, amplitude) function generates smooth pseudorandom motion at the specified rate and strength.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In After Effects Shape Layers, which animator is standardly used to create stroke drawing reveals and flourishing line animations?",
      options: [
        "Wiggle Transform",
        "Trim Paths (animating the Start, End, and Offset properties along the vector stroke)",
        "Audio Spectrum",
        "Lens Flare"
      ],
      correct_option_index: 1,
      explanation: "Trim Paths animates percentage-based stroke draws along vector paths, fundamental for motion graphic line flourishes.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In After Effects chroma keying, what industry-standard built-in plugin is primarily used to extract transparent alpha mattes from green screen footage?",
      options: [
        "Gaussian Blur",
        "Curves",
        "Drop Shadow",
        "Keylight (1.2)"
      ],
      correct_option_index: 3,
      explanation: "Keylight (1.2) is the industry-standard chroma keyer built into After Effects for green/blue screen extraction.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In After Effects rigging and animation, what is a 'Null Object'?",
      options: [
        "An invisible dummy layer with standard transform properties used as a parent controller to move, scale, or rotate child layers without rendering any visual pixels",
        "A video clip that has zero seconds duration",
        "A broken file that must be deleted",
        "An audio effect"
      ],
      correct_option_index: 0,
      explanation: "Null objects are invisible transformation controllers used to build parent-child hierarchies and master animation rigs.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In the After Effects Graph Editor, what is the critical difference between the 'Speed Graph' and the 'Value Graph'?",
      options: [
        "Speed Graph is for 3D; Value Graph is for 2D",
        "Value Graph can only be opened on Mac computers",
        "There is zero difference between them",
        "The Speed Graph plots rate of change (pixels/second or degrees/second), allowing editors to sculpt acceleration peaks; the Value Graph plots absolute property values over time, showing directional curves"
      ],
      correct_option_index: 3,
      explanation: "Speed Graph plots velocity (px/sec) to control pacing snappiness; Value Graph plots actual coordinate values over time.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In After Effects expressions, how does the `valueAtTime()` function enable automatic trailing and cascading wave delay animations across multiple layers?",
      options: [
        "By setting the computer system clock to the past",
        "It queries the property value of a parent layer at a specified time offset (e.g. `thisComp.layer('Lead').transform.position.valueAtTime(time - 0.1)`), causing child layers to follow the leader with a perfectly synchronized delay",
        "By slowing down the video frame rate to 1 FPS",
        "By duplicating layer keyframes in RAM"
      ],
      correct_option_index: 1,
      explanation: "valueAtTime(time - delay) samples past keyframe states, allowing child layers to trail parent animations automatically without manual keyframing.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In 3D camera staging in After Effects, what distinguishes a '2-Node Camera' from a '1-Node Camera'?",
      options: [
        "A 2-Node Camera has both a Position coordinate and a separate 'Point of Interest' target in 3D space, orienting the camera towards the target automatically; a 1-Node Camera rotates freely on its own axis like a handheld camera",
        "A 1-Node camera renders in black and white only",
        "2-Node cameras require two monitors to operate",
        "A 1-Node camera has two separate lenses"
      ],
      correct_option_index: 0,
      explanation: "2-Node cameras track an external Point of Interest target; 1-Node cameras rotate via intrinsic Pan/Tilt/Roll axes.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In kinetic typography, how do 'Range Selectors' inside Text Animators create sequential character reveals (e.g. letters flying into place one by one)?",
      options: [
        "By typing each letter on a separate text layer",
        "By taking screenshots of each word",
        "By animating the 'Offset' or 'Start/End' percentage values across the text string, sequentially passing the transform modifier (e.g. Position, Opacity, Tracking) across characters",
        "Range selectors only work on numbers"
      ],
      correct_option_index: 2,
      explanation: "Range Selectors pass percentage boundaries across character strings, selectively activating transform properties across letters.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In visual effects matchmoving, what does the '3D Camera Tracker' effect in After Effects achieve?",
      options: [
        "It tracks the physical location of the user's mouse",
        "It tracks faces to apply virtual makeup",
        "It speeds up computer rendering hardware",
        "It analyzes optical parallax across video frames to solve and reconstruct the original physical camera's focal length, position, and 3D movement path, creating a virtual 3D camera and ground plane in the composition"
      ],
      correct_option_index: 3,
      explanation: "3D Camera Tracker computes motion parallax to recreate a 3D camera and spatial coordinate system matching the live footage.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In professional motion design, why are standard 'Easy Ease' (33% influence) keyframes often rejected in favor of customized high-influence (75% to 90% influence) speed curves?",
      options: [
        "High-influence curves render faster on the CPU",
        "Standard 33% Easy Ease feels sluggish and floaty; 75-90% influence curves create an explosive initial velocity followed by a steep deceleration, delivering the crisp, high-energy snap expected in modern motion branding",
        "33% influence keyframes cause color distortion",
        "Easy Ease is not supported in 4K compositions"
      ],
      correct_option_index: 1,
      explanation: "High-influence Bézier velocity curves generate explosive starts with extended deceleration snaps, giving animations modern professional punch.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In After Effects mathematical expressions, what does the `linear()` interpolation function do (e.g. `linear(val, min1, max1, min2, max2)`)?",
      options: [
        "Draws a straight line on the screen",
        "Deletes all keyframes on the layer",
        "It remaps an input value (`val`) from an original range (`min1` to `max1`) onto a new target output range (`min2` to `max2`), clamping values outside the range",
        "Converts 3D layers into 2D layers"
      ],
      correct_option_index: 2,
      explanation: "The linear() expression function normalizes and remaps values across custom ranges, ideal for driving scale or rotation from audio amplitude.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Keylight (1.2) green screen matte extraction, what is the primary purpose of adjusting the 'Screen Matte -> Clip Black' and 'Clip White' parameters?",
      options: [
        "Clip Black raises the threshold to force noisy semi-transparent background pixels into pure 100% transparent black; Clip White lowers the threshold to force semi-transparent foreground areas into solid 100% opaque white",
        "Clip Black and Clip White are audio volume filters",
        "They turn the video footage into a black and white film",
        "They increase camera shutter speed"
      ],
      correct_option_index: 0,
      explanation: "Clip Black cleans background noise to solid transparency, while Clip White fills internal holes to guarantee solid foreground opacity.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Mocha AE planar tracking, why is planar tracking vastly more reliable than point tracking for inserting graphics onto moving surfaces (e.g. phone screens, billboards)?",
      options: [
        "Planar tracking only works on circular shapes",
        "Point tracking is not compatible with After Effects",
        "Planar tracking uses AI to invent new pixels",
        "It tracks the collective texture and luminescence of an entire planar surface area rather than isolated high-contrast points, maintaining solid tracking even through severe motion blur, grain, and temporary hand occlusions"
      ],
      correct_option_index: 3,
      explanation: "Planar tracking evaluates surface texture patterns across whole planes, resisting point drift, motion blur, and partial obstructions.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In After Effects layer space coordinate expressions, what does the `toComp()` method achieve (e.g. `thisComp.layer('Child').toComp([0,0,0])`)?",
      options: [
        "Compresses the video into an MP4 file",
        "It translates a layer's localized 3D coordinate space into universal 2D composition screen space coordinates, allowing 2D effects (like lens flares or beam lasers) to accurately track 3D moving points",
        "Converts composition frame rate to 60 FPS",
        "Exports the layer as a 3D model"
      ],
      correct_option_index: 1,
      explanation: "toComp() transforms local 3D layer coordinates into 2D composition screen space, allowing 2D effects to stick to 3D tracked objects.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #134.");
  console.log("Skill #134 update completed successfully!");
}

run();
