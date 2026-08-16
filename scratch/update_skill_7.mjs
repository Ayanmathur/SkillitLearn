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

const skillId = "eb367ba9-0a18-4c12-903e-b3e624010bd5";

async function run() {
  console.log("Updating Skill #7: 3D Modeling & Visualization...");

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
  if (tracks.length < 3) {
    console.log("Adding missing 3rd track for Skill #7...");
    const { data: newTrack, error: nErr } = await supabase
      .from("tracks")
      .insert({
        skill_id: skillId,
        title: "Track 3: Camera Optics, Compositing and Cinematic Production",
        order_index: 3
      })
      .select()
      .single();
    if (nErr) console.error("Error inserting track 3:", nErr);
    tracks.push(newTrack);
  }

  // Sort tracks
  tracks.sort((a, b) => a.order_index - b.order_index);

  const track1Id = tracks[0].id;
  const track2Id = tracks[1].id;
  const track3Id = tracks[2].id;

  // Update Track titles
  await supabase.from("tracks").update({ title: "Track 1: Computational Geometry, NURBS and Parametric Topology" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Physically Based Rendering (PBR), Shaders and Lighting" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Camera Optics, Compositing and Cinematic Production" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / PhD level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Computational Geometry, Polygon Meshes and Boundary Representation",
      order_index: 1,
      content: `### Mathematical Foundations of 3D Geometric Modeling

In computer-aided architectural design and visual computing, 3D space is represented using Euclidean vector geometry. Surfaces and solids are defined through distinct mathematical paradigms:

1. Polygon Mesh Topology:
   - A mesh consists of a geometric collection of Vertices (points in R3 space), Edges (linear segments connecting vertex pairs), and Faces (planar or near-planar polygonal facets).
   - Face Normal Vector Calculation: The orientation and front/back facing direction of a planar polygon defined by vertices V1, V2, V3 is calculated via the cross product:
\`\`\`
N = (V2 - V1) x (V3 - V1)
\`\`\`
   - Quad-Dominant Topology: Professional 3D modeling prioritizes 4-sided quadrilaterals (quads) over triangles or n-gons (> 4 vertices). Quads maintain continuous edge loops, deform cleanly under subdivision algorithms (Catmull-Clark subdivision), and eliminate rendering shading artifacts.

2. Boundary Representation (B-Rep) Solid Modeling:
   - B-Rep models define a solid by explicitly bounding its interior volume with a closed topological shell composed of continuous faces, trimmed edges, and vertices.
   - Manifold Geometry: A valid solid B-Rep must be manifold (watertight), meaning every edge is shared by exactly two adjacent faces and the surface contains zero self-intersections or open boundary holes.

3. Constructive Solid Geometry (CSG):
   - Combines primitive volumetric solids (cubes, cylinders, spheres) using set-theoretic Boolean operations:
     - Boolean Union (A union B): Merges two intersecting solids into a single continuous volume.
     - Boolean Difference (A - B): Subtracts the volume of solid B from solid A.
     - Boolean Intersection (A intersect B): Retains only the shared overlapping volume.`
    },
    {
      track_id: track1Id,
      title: "Non-Uniform Rational B-Splines (NURBS) and Complex Curvature",
      order_index: 2,
      content: `### Mathematical Architecture of NURBS Geometry

Non-Uniform Rational B-Splines (NURBS) are the mathematical standard for modeling smooth, double-curved complex surfaces in computational architecture and industrial design:
- Non-Uniform: Knot vectors defining parameter intervals can have non-equal spacing.
- Rational: Control points carry adjustable homogeneous weighting factors (w), enabling exact mathematical representation of conics (circles, ellipses, parabolas) without approximation errors.
- B-Splines: Parametric piecewise polynomial curves governed by a network of de Boor control points.

### Geometric and Parametric Continuity (G-Continuity)

When joining adjacent curves or surfaces, the degree of smoothness across the transition boundary is classified by continuity tiers:
1. G0 Continuity (Positional): The two surfaces share a common touching edge. A sharp visual crease and abrupt angle change exist at the seam.
2. G1 Continuity (Tangency): The surface normal vectors are parallel along the entire seam (tangent continuous). A smooth transition without a sharp crease, but with an abrupt jump in surface curvature.
3. G2 Continuity (Curvature): The rate of curvature (second derivative) is continuous across the seam. Highlight reflection lines (zebra stripes) transition seamlessly across the joint with zero visual breaks (mandatory for high-end organic facades and automotive design).
4. G3 Continuity (Torsion): The rate of change of curvature (third derivative / jerk) is continuous, providing ultimate optical flow.

### Advanced Surface Generation Algorithms (Rhino 3D Workflows)

- Sweep 2 Rails: A cross-sectional profile curve is swept along two independent guiding rail curves to create complex freeform canopies.
- Network Surface: Generates a smooth surface through an intersecting grid of U and V curves, enforcing G1 or G2 edge continuity against surrounding geometry.
- Surface Trimming: Projecting 2D curves onto 3D NURBS surfaces to trim away portions without destroying the underlying mathematical surface definition.`
    },
    {
      track_id: track1Id,
      title: "Parametric and Algorithmic Design with Visual Scripting",
      order_index: 3,
      content: `### Principles of Parametric Associative Modeling

Parametric modeling (e.g. Grasshopper in Rhino, Dynamo in Revit) transforms static geometric drafting into dynamic algorithmic rules. Architectural form is generated through Directed Acyclic Graphs (DAG), where upstream parameter sliders instantly propagate changes through downstream geometric transformations.

### Data Tree Architecture in Visual Scripting

Complex architectural facades require manipulating hierarchical nested data arrays (Data Trees):
- Data Path Notation: Data items are addressed by hierarchical path branches (e.g. \`{0;1;3}[i]\`, representing Project; Floor 1; Panel 3; Vertex i).
- Data Operations:
  - Flatten: Collapses all multi-dimensional branches into a single linear list.
  - Graft: Creates a new unique sub-branch for every individual item.
  - Simplify: Trims redundant leading zero path branches to align data structures between components.

### Computational Form-Finding and Environmental Optimization

1. Tensile Form-Finding (Particle-Spring Physics):
   - Utilizing physics solvers (Kangaroo) to simulate dynamic catenary gravity hanging models and minimal surface soap-film membranes, finding pure structural tension forms for large-span stadium roofs.
2. Conformal Surface Panelization:
   - Mapping 2D planar panels across complex double-curved 3D freeform surfaces using UV parameter domain subdivision, optimizing panel repetition and minimizing costly double-curved glass fabrication.
3. Evolutionary Multi-Objective Optimization:
   - Linking parametric facade geometry to environmental analysis engines (Ladybug for daylight autonomy and solar radiation) and running genetic algorithms (Galapagos) to automatically optimize louver tilt angles for maximum winter solar gain and minimum summer cooling loads.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Physically Based Rendering (PBR) Materials and Microfacet Theory",
      order_index: 1,
      content: `### The Physics of Light-Material Interaction

Physically Based Rendering (PBR) models the physical behavior of light rays interacting with matter according to thermodynamics and energy conservation:

### The Microfacet BRDF Model (Cook-Torrance)

Surfaces are modeled at the microscopic level as a collection of tiny, randomly oriented planar specular microfacets. The Bidirectional Reflectance Distribution Function (BRDF) combines diffuse and specular components:

\`\`\`
f_r = k_d * f_diffuse + k_s * f_specular
\`\`\`

Where:
- k_d and k_s are diffuse and specular energy fractions (\`k_d + k_s <= 1.0\`, enforcing the law of conservation of energy).
- The Cook-Torrance specular term incorporates the Fresnel Equation (F), Normal Distribution Function (D / GGX distribution), and Geometric Shadowing/Masking (G).

### The Metallic / Roughness PBR Texture Stack

1. Base Color (Albedo Map):
   - Represents pure diffuse surface reflectance for non-metals (dielectrics).
   - Must contain zero pre-baked shadows, ambient occlusion, or directional lighting highlights.
2. Metallic Map (Conductor vs Dielectric):
   - Dielectrics (wood, concrete, glass, plastic): Metallic = 0.0. Specular reflection is non-colored (white) with a base reflectance F0 of approximately 4% (0.04).
   - Metals (gold, copper, aluminum, steel): Metallic = 1.0. All reflectance is specular, and the reflected highlight is tinted by the material base color.
3. Roughness Map:
   - Defines microfacet variance (0.0 = optically smooth mirror; 1.0 = completely matte diffuse scattering).
4. Normal Maps vs Height (Displacement) Maps:
   - Tangent-Space Normal Maps (RGB texture): Perturbs surface normal vectors during pixel shading without altering physical polygon geometry.
   - True 32-Bit Floating Point Displacement Maps: Physically displaces mesh vertices along normal vectors at render time, casting true self-shadows and altering silhouette profiles.`
    },
    {
      track_id: track2Id,
      title: "Lighting Physics, Photometry and Global Illumination (GI)",
      order_index: 2,
      content: `### Photometric Lighting Physics

Architectural visualization requires accurate replication of real-world optical lighting units:
- Luminous Flux (Lumens, lm): Total quantity of visible light emitted by a source in all directions.
- Luminous Intensity (Candelas, cd): Luminous flux emitted per unit solid angle in a specific direction (\`1 cd = 1 lumen / steradian\`).
- Illuminance (Lux / Foot-Candles, lx): Luminous flux incident per unit surface area (\`1 Lux = 1 lumen / m2\`).
- Luminance (Candelas/m2 / Nits): Perceived surface brightness reflected toward the observer.

### IES Photometric Light Profiles

Manufactured architectural luminaires (downlights, spotlights, wall washers) are accurately simulated using ANSI/IES LM-63 standard Photometric Data Files (.ies):
- An IES file contains a 3D polar coordinate distribution array of measured luminous intensity candelas.
- Accurately renders optical lens beam angles, field angles, and fixture reflector cutoff patterns.

### Global Illumination (GI) and Light Transport Algorithms

1. The Rendering Equation (Kajiya):
   Mathematically balances emitted light and incoming reflected radiance across all surface points.
2. Path Tracing (Unbiased Monte Carlo Integration):
   - Simulates millions of individual light paths (rays) bouncing stochastically through the 3D scene from the camera lens to light sources.
   - Calculates physically accurate color bleeding (indirect diffuse illumination), soft area shadows, and optical caustics.
3. High Dynamic Range Imaging (HDRI) and Image-Based Lighting (IBL):
   - 32-bit floating-point panoramic spherical radiance maps (Radiance .hdr or OpenEXR .exr) capturing 20+ stops of real-world dynamic range.
   - Provides calibrated sun intensity, sky color gradients, and environmental reflection maps simultaneously.`
    },
    {
      track_id: track2Id,
      title: "Real-Time Rendering Engines and Interactive Architectural VR",
      order_index: 3,
      content: `### The Real-Time Architectural Revolution

Real-time rendering engines (Unreal Engine 5, Twinmotion, D5 Render, Lumion, Enscape) render complex architectural scenes at 60 to 120 frames per second:

### Real-Time Lighting and Geometry Innovations

1. Dynamic Global Illumination (Unreal Engine Lumen):
   - Combines software ray tracing (signed distance fields) and hardware ray tracing with screen-space radiance caching.
   - Eliminates traditional hours-long static light baking; dynamic sun positions, cloud movements, and moving doors cast real-time indirect diffuse light bounces instantly.
2. Virtualized Micro-Polygon Geometry (Unreal Engine Nanite):
   - Automatically streams and renders multi-million polygon meshes (high-resolution photogrammetry 3D scans, detailed furniture models) without manual Level of Detail (LOD) polygon reduction, rendering only pixel-sized micropolygons in real time.

### Virtual Reality (VR) and Immersive Architectural Exploration

- Stereoscopic Rendering: Renders two independent viewports offset by the inter-pupillary distance (IPD, approx 64 mm) at minimum 90 FPS per eye to eliminate motion sickness.
- Six Degrees of Freedom (6-DOF): Tracks both rotational head motion (pitch, yaw, roll) and translational spatial position (X, Y, Z coordinates) via inside-out optical sensors.
- Spatial Audio Simulation: Binaural head-related transfer functions (HRTF) simulating acoustic room reverberation, absorption, and sound occlusion through walls.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Architectural Camera Optics, Composition and Framing Mechanics",
      order_index: 1,
      content: `### Synthetic Camera Optics in 3D Visualization

Virtual cameras in 3D rendering engines emulate physical large-format architectural cameras:

### 1. Two-Point Perspective and Vertical Shift (Tilt-Shift)

The primary hallmark of professional architectural photography is the complete elimination of vertical perspective convergence (keystoning):
- When a standard camera tilts upward to capture a tall building, vertical lines converge toward a vanishing point, making the building appear to be falling backward.
- Vertical Tilt-Shift Correction: The virtual camera sensor plane is kept perfectly vertical (Pitch = 0 degrees), while the lens focal center is shifted upward along the Y-axis. This preserves perfectly parallel vertical building lines across all facades.

### 2. Focal Length and Field of View (FOV) Selection

- Standard Exterior Architectural Views: 35 mm to 50 mm focal length (63 to 46 degrees horizontal FOV). Accurately replicates human visual perception without wide-angle peripheral stretching.
- Interior Spaces: 24 mm to 28 mm wide-angle focal length. Expands perceived interior volume without severe edge distortion. Avoid ultra-wide lenses (< 18 mm) that dramatically exaggerate room dimensions.
- Telephoto Facade Compression: 70 mm to 135 mm focal length. Compresses foreground and background spatial depth, emphasizing facade rhythm and contextual urban layering.

### 3. Compositional Principles in Architectural Rendering

- Rule of Thirds and Golden Ratio: Aligning primary horizon lines, structural columns, and focal entries with grid intersection lines.
- Foreground Layering: Incorporating vegetation, paving textures, or human scale figures in the immediate foreground to create an optical sense of three-dimensional depth.
- Leading Lines: Positioning pathways, curb lines, ceiling bulkheads, or lighting fixtures to guide the viewer's eye toward the architectural focal entrance.`
    },
    {
      track_id: track3Id,
      title: "Post-Production, Multi-Pass Compositing and Color Grading",
      order_index: 2,
      content: `### Multi-Pass Render Channel Architecture

Professional 3D visualization avoids raw single-pass rendering outputs. Instead, engines output multi-channel 32-bit floating-point OpenEXR files containing discrete render passes (render elements):

1. Core Render Elements:
   - Diffuse / Beauty Pass: Direct plus indirect diffuse surface illumination.
   - Raw Reflection & Refraction Passes: Isolated specular highlights and glass transparency channels.
   - Ambient Occlusion (AO) Pass: Grayscale contact shadow map calculating ambient sky occlusion in tight structural corners and surface seams.
   - Z-Depth Pass: Linear floating-point distance map from camera lens to surfaces, used in post-production to generate realistic atmospheric aerial haze and synthetic optical depth of field.
   - Cryptomatte / Material ID Passes: Pixel-perfect, anti-aliased procedural selection masks for every individual 3D material and geometry object, allowing instant post-production isolation without manual rotoscoping.

### Color Grading and Atmospheric Post-Processing

- Color Management: Working in linearized 32-bit floating point ACEScg (Academy Color Encoding System) wide-gamut color space to preserve extreme highlights without clipping.
- Tone Mapping: Applying S-curve contrast tonemappers (Filmic / Reinhard) to compress 20+ stops of dynamic range into standard sRGB displays.
- Optical Glare and Bloom: Simulating lens diffraction spikes on intense light sources and soft bloom haloing around windows.
- Material Micro-Tweaking: Blending Ambient Occlusion multiply layers (typically 15% to 30% opacity) to accentuate architectural reveals, shadow lines, and structural joints.`
    },
    {
      track_id: track3Id,
      title: "Cinematic Animation, Camera Choreography and Visual Storytelling",
      order_index: 3,
      content: `### Principles of Architectural Cinematic Animation

Architectural walkthrough animations communicate spatial sequence, daylight transitions, and human experiential scale.

### Camera Choreography and Motion Curves

- Smooth Bezier Interpolation: Camera movement paths are governed by smooth continuous spline curves in 3D space.
- Decoupled Target Tracking: The camera physical position (eye) and camera viewing direction (target) travel along separate, independent spline paths. This enables cinematic panning, crane sweeps, and parallax tracking shots.
- Camera Speed and Pacing: Virtual camera movement should simulate a steady human walking pace (3 to 4 km/h) or a smooth motorized mechanical gimbal/dolly track. Sudden directional changes and erratic speed accelerations cause visual disorientation.

### Dynamic Environmental and Lighting Transitions

- Solar Day-to-Night Time-Lapse: Animating the astronomical sun position from afternoon golden hour, through dusk blue hour, to nighttime illumination. Highlights the transition from natural daylighting to artificial interior architectural lighting.
- Dynamic Entourage Scatter: Incorporating wind-animated foliage (using vertex wind shaders), moving vehicles with realistic head/taillight trails, and photorealistic 3D scanned animated humans to convey real-world scale and community vitality.

### Video Encoding and Final Mastering

- Frame Rate Standards: 24 FPS (Cinematic standard), 30 FPS (Broadcast), or 60 FPS (Ultra-smooth real-time interactive playback).
- Master Codec Formats: Exporting individual uncompressed PNG/EXR frame sequences, assembled in DaVinci Resolve or Adobe Premiere Pro, and encoded via H.265 (HEVC) or Apple ProRes 422 HQ with 10-bit color depth.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #7.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "What mathematical property defines G0 (Positional) continuity between two adjacent 3D surfaces in NURBS modeling?",
      options: [
        "The surfaces share a common touching boundary edge, but exhibit a sharp crease with no tangency alignment",
        "The surfaces have identical curvature rates across the seam",
        "The surfaces are separated by a 1-meter air gap",
        "The surfaces are rendered with 100% metallic transparency"
      ],
      correct_option_index: 0,
      explanation: "G0 continuity means positional continuity; the two surfaces touch at a common boundary, but their tangent vectors do not align, resulting in a sharp crease.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In Physically Based Rendering (PBR), what is the metallic value assigned to standard non-metallic (dielectric) architectural materials such as wood, concrete, and plastic?",
      options: [
        "Metallic = 1.0",
        "Metallic = 0.50",
        "Metallic = 0.0 (with a non-colored base specular reflectance F0 of approx 4%)",
        "Metallic = -1.0"
      ],
      correct_option_index: 2,
      explanation: "In PBR metallic/roughness workflows, all non-conductive dielectric materials have a Metallic value of 0.0, exhibiting non-tinted specular reflections with F0 of approx 0.04.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What essential camera adjustment must be applied in architectural visualization to eliminate vertical perspective convergence (keystoning) on tall building facades?",
      options: [
        "Rotate the camera 90 degrees horizontally",
        "Maintain a level camera sensor (Pitch = 0 degrees) and apply a vertical lens shift (Tilt-Shift) to keep all vertical lines parallel",
        "Increase the camera focal length to 500 mm",
        "Render the scene exclusively in black and white"
      ],
      correct_option_index: 1,
      explanation: "Vertical lens shift (simulating a physical tilt-shift lens) keeps the camera sensor perfectly vertical, eliminating perspective keystoning so all vertical building lines stay parallel to the Y-axis.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What standardized photometric file format (.ies) is used by architectural lighting designers to accurately simulate real-world luminaire 3D candela beam distribution patterns?",
      options: [
        "JPEG Image",
        "DWG AutoCAD Drawing",
        "MP3 Audio File",
        "ANSI/IES Photometric Data File (.ies)"
      ],
      correct_option_index: 3,
      explanation: "IES photometric data files contain measured real-world 3D polar luminous intensity (candela) distributions manufactured by lighting companies.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In visual parametric scripting environments such as Grasshopper, what data tree operation collapses all multi-dimensional branch paths into a single flat list?",
      options: [
        "Flatten",
        "Graft",
        "Weave",
        "Simplify"
      ],
      correct_option_index: 0,
      explanation: "The Flatten operation removes all hierarchical data tree branch paths, merging all data elements into a single continuous linear list.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "Why is G2 (Curvature) continuity mandatory when modeling double-curved organic architectural facades and sleek automotive surfaces?",
      options: [
        "G2 continuity reduces 3D rendering file sizes by 90%",
        "G2 continuity converts all NURBS surfaces into 2D drafting lines",
        "G2 surfaces cannot reflect sunlight",
        "G2 continuity matches the rate of change of surface curvature across the seam, ensuring seamless zebra-stripe reflection highlights with zero visual breaks"
      ],
      correct_option_index: 3,
      explanation: "G2 continuity ensures that surface curvature is mathematically continuous across the joint. This eliminates sharp reflection breaks, producing perfectly smooth specular highlights.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In multi-pass architectural rendering post-production, what is the specific function of the Z-Depth render element pass?",
      options: [
        "To calculate the total cost of construction materials",
        "It outputs a linear floating-point grayscale map representing the exact distance of surfaces from the camera lens, used to generate synthetic depth-of-field and atmospheric aerial haze",
        "To delete all glass reflections from the image",
        "To automatically adjust the sound volume of the animation"
      ],
      correct_option_index: 1,
      explanation: "The Z-Depth pass encodes per-pixel distance from the camera lens, enabling post-production artists to add realistic camera focus blur (depth of field) and atmospheric haze.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "How does the Cook-Torrance Microfacet BRDF model enforce the fundamental law of conservation of energy in PBR shaders?",
      options: [
        "The sum of diffuse reflectance (k_d) and specular reflectance (k_s) must never exceed 1.0 (k_d + k_s <= 1.0)",
        "By multiplying surface roughness by 2.0",
        "By setting all ambient light sources to 100 Watts",
        "By converting all specular reflections into electrical heat"
      ],
      correct_option_index: 0,
      explanation: "Energy conservation in PBR dictates that a surface cannot reflect more light energy than it receives: total diffuse fraction plus specular fraction cannot exceed 1.0.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What real-time global illumination technology in modern game engines (such as Unreal Engine Lumen) eliminates the need for hours-long static light baking by calculating real-time indirect diffuse light bounces?",
      options: [
        "Static Shadow Maps",
        "Lambertian Shading",
        "Dynamic Global Illumination (Lumen / Real-Time Radiance Caching)",
        "Vertex Painting"
      ],
      correct_option_index: 2,
      explanation: "Lumen uses dynamic software and hardware ray tracing with surface radiance caching to calculate multi-bounce indirect global illumination in real time without baking.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "Why is quad-dominant polygon topology (4-sided polygons) strictly preferred over n-gons (> 4 vertices) and dense triangles in 3D architectural mesh modeling?",
      options: [
        "Quads can only be viewed on Apple computers",
        "Quads weigh 50% less in physical 3D prints",
        "Quads automatically color the building facade blue",
        "Quads maintain predictable edge loops, deform smoothly under subdivision surface algorithms (Catmull-Clark), and eliminate pinched shading artifacts"
      ],
      correct_option_index: 3,
      explanation: "Quad topology allows edge loops to flow naturally along architectural contours, subdivides cleanly under Catmull-Clark algorithms, and prevents pinching artifacts.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In 3D vector geometry, if a planar triangular polygon face has vertex coordinates V1 = (0,0,0), V2 = (2,0,0), and V3 = (0,3,0), what is the calculated face normal unit vector?",
      options: [
        "(1.0, 1.0, 0.0)",
        "(0.0, 0.0, 1.0)",
        "(0.5, 0.5, 0.5)",
        "(0.0, 1.0, 0.0)"
      ],
      correct_option_index: 1,
      explanation: "Vector A = V2 - V1 = (2,0,0); Vector B = V3 - V1 = (0,3,0). Cross product N = A x B = (2*0 - 0*3, 0*0 - 2*0, 2*3 - 0*0) = (0, 0, 6). Normalized unit vector = (0, 0, 1.0).",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In architectural multi-pass compositing, what is the primary technical advantage of using Cryptomatte render elements compared to traditional RGB Material ID color masks?",
      options: [
        "Cryptomatte files are 100 times smaller than JPEGs",
        "Cryptomatte works only with black and white images",
        "Cryptomatte automatically generates anti-aliased, sub-pixel accurate selection mattes that preserve motion blur, depth-of-field, and semi-transparent hair/glass edges",
        "Cryptomatte eliminates the need for a 3D camera"
      ],
      correct_option_index: 2,
      explanation: "Cryptomatte stores material and object names alongside exact pixel coverage metadata in multi-channel OpenEXRs, providing perfect anti-aliased mattes with motion blur and transparency.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "What mathematical property differentiates Rational B-Splines (in NURBS) from standard non-rational polynomial B-Spline curves?",
      options: [
        "Control points in rational splines possess homogeneous weighting factors (w), allowing exact mathematical representation of conics (circles, parabolas, ellipses) without approximation",
        "Rational splines can only be drafted in straight lines",
        "Rational splines cannot be edited after creation",
        "Rational splines require all knots to be equidistant integers"
      ],
      correct_option_index: 0,
      explanation: "The 'Rational' in NURBS means each control point has an adjustable weight (w). This mathematical formulation allows exact representation of conic sections like circles and ellipses.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In real-time virtual reality (VR) architectural walkthroughs, why is it mandatory for the graphics pipeline to maintain a steady minimum frame rate of 90 FPS per eye with stereoscopic rendering?",
      options: [
        "To increase the temperature of the VR headset",
        "Lower frame rates cause the building walls to disappear",
        "90 FPS is required by municipal building codes",
        "To minimize motion-to-photon latency (< 20 ms), preventing vestibular-ocular sensory mismatch that triggers motion sickness and nausea"
      ],
      correct_option_index: 3,
      explanation: "In VR, maintaining 90+ FPS per eye keeps motion-to-photon latency below 20 ms, synchronizing visual feedback with the inner ear's vestibular system to prevent simulator sickness.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "What physical lighting phenomenon occurs when calculating Path Traced global illumination where light reflects off a highly saturated colored surface (such as a vibrant red brick wall) and subtly illuminates an adjacent white ceiling?",
      options: [
        "Specular chromatic aberration",
        "Diffuse Interreflection / Color Bleeding",
        "Volumetric phase scattering",
        "Fresnel polarization extinction"
      ],
      correct_option_index: 1,
      explanation: "Diffuse interreflection (commonly known as color bleeding) occurs when indirect diffuse light bounces carry the spectral reflectance color of the source surface onto adjacent surfaces.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #7.");
  console.log("Skill #7 update completed successfully!");
}

run();
