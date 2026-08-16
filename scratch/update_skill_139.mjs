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

const skillId = "8609f069-00e2-49b0-9355-e0924e816f87";

async function run() {
  console.log("Updating Skill #139: Branding & Logo Design (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Brand Strategy, Archetypes and Architecture" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Logo Taxonomy, Geometric Construction and Stress-Testing" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Brand Guidelines, Design Systems and Touchpoint Rollout" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Global Identity Design Director & Brand Strategist level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Brand Strategy, Positioning and Marty Neumeier's Onliness",
      order_index: 1,
      content: `### Strategic Foundations and Positioning

1. Brand Strategy vs Identity:
   - Strategy defines gut emotional reputation, market whitespace, and customer promise before visual design commences.

2. Marty Neumeier's Onliness Framework:
   - 'Our brand is the ONLY [category] that [unique benefit] for [target audience] in [market space].'
   - Mapping competitive positioning quadrants to claim uncontested market territory.`
    },
    {
      track_id: track1Id,
      title: "Carl Jung's 12 Brand Archetypes and Brand Persona",
      order_index: 2,
      content: `### Psychological Archetypes and Brand Voice

1. Jungian Archetypes:
   - The Outlaw (Harley-Davidson, Apple 1984: disruptive rebellion).
   - The Magician (Disney, Tesla: visionary transformation).
   - The Sage (Google, BBC: objective truth and knowledge).
   - The Creator (Lego, Adobe: imaginative innovation).

2. Persona Articulation:
   - Codifying tone of voice, personality traits, and emotional resonance.`
    },
    {
      track_id: track1Id,
      title: "Brand Architecture: Branded House vs House of Brands",
      order_index: 3,
      content: `### Structural Portfolio Architecture

1. Monolithic / Branded House:
   - Single master brand powering all products (e.g. Apple, Virgin, FedEx).

2. Endorsed Brands:
   - Sub-brands supported by a parent seal (e.g. Courtyard by Marriott).

3. Pluralistic / House of Brands:
   - Decentralized standalone product brands with invisible corporate holding parents (e.g. Procter & Gamble: Tide, Pampers, Gillette).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The 7 Core Logo Archetypes and Semiotic Meaning",
      order_index: 1,
      content: `### Structural Typology of Brand Marks

1. Logo Taxonomy:
   - Wordmark / Logotype (Google, Braun).
   - Lettermark / Monogram (IBM, HBO, NASA).
   - Pictorial Mark / Brandmark (Apple, Target).
   - Abstract Mark (Nike Swoosh, Chase Octagon).
   - Mascot (Michelin Man, Pringles).
   - Emblem / Crest (Starbucks, Porsche).
   - Combination Mark (Adidas, Lacoste).`
    },
    {
      track_id: track2Id,
      title: "Geometric Construction, Golden Ratio Grids and Optical Tuning",
      order_index: 2,
      content: `### Mathematical Precision and Optical Corrections

1. Vector Geometry:
   - Constructing marks with tangent circles, golden ratio proportions (phi = 1.618), and precise bezier arc intersections.

2. Optical vs Mathematical Symmetry:
   - Applying optical corrections (overhang adjustments, center of mass shifts) so geometry appears visually balanced to the human eye rather than mathematically rigid.`
    },
    {
      track_id: track2Id,
      title: "Scalability Stress-Testing: Favicons, 1-Bit Mono and Embroidery",
      order_index: 3,
      content: `### Rigorous Reproduction and Media Viability

1. Scalability Testing:
   - Stress-testing marks at 16x16 pixel favicon sizes, 1-bit solid black/white reproduction, and physical embroidery / laser-etching constraints.

2. Silhouette Integrity:
   - Eliminating hairline gaps and micro-details that choke when printed at small scales.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Master Lockups, Clearspace Rules and Minimum Sizes",
      order_index: 1,
      content: `### Logo Clearspace and Usage Governance

1. Lockup Formats:
   - Primary Horizontal, Secondary Stacked / Vertical, Sub-mark Icon, and Monogram Favicon.

2. Exclusion Zones:
   - Establishing clearspace isolation boundaries based on relative typographic x-height or mark width, paired with absolute minimum reproduction dimensions for print (mm) and digital (px).`
    },
    {
      track_id: track3Id,
      title: "Color Systems: PMS Spot Inks, CMYK, RGB and HEX Specs",
      order_index: 2,
      content: `### Omnichannel Color Standardization

1. Cross-Media Color Calibration:
   - Primary, Secondary, and Neutral palettes defined across Pantone Matching System (PMS Coated/Uncoated), CMYK for process printing, sRGB for monitors, and HEX for web UI.

2. Proportional Color Weight:
   - Defining 60-30-10 dominant, secondary, and accent color distribution guidelines.`
    },
    {
      track_id: track3Id,
      title: "Brand Style Guides, Touchpoints and Design System Tokens",
      order_index: 3,
      content: `### Comprehensive Brand Delivery and Governance

1. Brand Style Guide (Brand Book):
   - Formal documentation governing typography scales, photographic art direction, iconography, and explicit logo misuse rules.

2. Touchpoint Rollout:
   - Deploying identity across stationery, packaging dielines, digital design system tokens (Figma/CSS variables), and environmental signage.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #139.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In logo design taxonomy, what is a 'Lettermark' (Monogram) logo?",
      options: [
        "A typography-based mark composed exclusively of a company's acronym initials (such as IBM, NASA, or HBO)",
        "A mark drawn with crayons",
        "A photo of a building",
        "A sound effect played at the start of a movie"
      ],
      correct_option_index: 0,
      explanation: "Lettermarks/monograms distill complex corporate names into distinct, stylized typographic acronym initials.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In brand guidelines, what is a logo 'Clearspace' (Exclusion Zone)?",
      options: [
        "A physical parking space at company headquarters",
        "The space on a computer screen where no apps can be opened",
        "A designated mandatory buffer zone surrounding the logo that must remain completely free of other text, graphics, or busy background elements to preserve visual impact",
        "A room where designers work in silence"
      ],
      correct_option_index: 2,
      explanation: "Clearspace protects the logo from encroaching text and visual clutter, ensuring maximum legibility.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In brand architecture, what is a 'Branded House' (Monolithic) model?",
      options: [
        "A physical house built with company logos",
        "A master brand structure where a single dominant corporate brand name is used across all products and sub-offerings (e.g. Apple, Virgin, FedEx)",
        "A company that sells houses",
        "A brand that has zero logos"
      ],
      correct_option_index: 1,
      explanation: "A Branded House leverages a single master brand across all products, maximizing brand equity and marketing efficiency.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What is an 'Abstract Logo Mark'?",
      options: [
        "A logo that cannot be seen by human eyes",
        "A logo painted in watercolor only",
        "A logo that is missing letters",
        "A conceptual geometric shape that does not depict a literal physical object, but conveys brand attributes through symbolic form (such as the Nike Swoosh or Chase Octagon)"
      ],
      correct_option_index: 3,
      explanation: "Abstract marks use non-representational geometric symbolism to convey metaphorical brand attributes.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In brand identity design, what is a 'Brand Style Guide' (Brand Book)?",
      options: [
        "A comprehensive governing document that establishes the strict visual, verbal, and technical rules for using a brand's logos, colors, typography, and assets consistently",
        "A book that teaches people how to paint",
        "A list of company employee names",
        "A financial accounting ledger"
      ],
      correct_option_index: 0,
      explanation: "A Brand Style Guide codifies visual and verbal rules to ensure absolute consistency across all global touchpoints.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In brand strategy, what is the 'House of Brands' (Pluralistic) architecture and what is its primary strategic advantage?",
      options: [
        "Building real estate properties for advertising",
        "Selling only one single product worldwide",
        "Using identical logos for every subsidiary",
        "Operating independent standalone brand identities for different consumer products (e.g. Procter & Gamble owning Tide, Pampers, Gillette); this insulates sister brands from reputational crises and allows targeting distinct demographics"
      ],
      correct_option_index: 3,
      explanation: "A House of Brands runs distinct individual consumer brands, isolating risks and enabling tailored niche market positioning.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "Why MUST every professional logo design undergo a strict '1-Bit Solid Black and White' stress test during development?",
      options: [
        "Because color monitors will be banned in the future",
        "If a logo relies on gradients, drop shadows, or color contrast to be readable, it will fail completely in single-color reproduction environments (such as physical product embossing, laser engraving, faxing, and invoices)",
        "Because black and white ink is free",
        "1-bit testing is only required for government agencies"
      ],
      correct_option_index: 1,
      explanation: "Logos must work as pure solid black silhouettes to ensure viability across all single-color manufacturing and printing methods.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In branding strategy, how did Marty Neumeier define the core concept of a 'Brand' in 'The Brand Gap'?",
      options: [
        "A brand is not a logo, a corporate identity system, or a product; a brand is a person's visceral gut feeling about a product, service, or company",
        "A brand is purely a trademark registered with the government",
        "A brand is the amount of money a company spends on TV commercials",
        "A brand is a company's physical office building"
      ],
      correct_option_index: 0,
      explanation: "Marty Neumeier famously defined a brand as a customer's individual gut feeling, created by cumulative brand touchpoints.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In brand persona development, how do Carl Jung's '12 Brand Archetypes' guide identity design (e.g. Apple as 'The Outlaw' vs Disney as 'The Magician')?",
      options: [
        "They determine the physical size of the logo",
        "They tell designers which software to buy",
        "They anchor the brand's narrative personality and visual tone in universal psychological patterns that humans intuitively recognize and emotionally connect with",
        "Archetypes are used only in horror video games"
      ],
      correct_option_index: 2,
      explanation: "Archetypes tap into deep universal psychological patterns, creating instantly relatable brand personalities.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In logo geometry, why is 'Optical Correction' often chosen over strict mathematical symmetry (e.g. in the Google 'G' logo or Nintendo Switch logo)?",
      options: [
        "Because mathematical circles use too much computer memory",
        "Because graphic designers cannot draw mathematically perfect shapes",
        "Optical corrections are accidental errors made by beginners",
        "The human visual perception perceives mathematically perfect circles and identical weights as unbalanced or visually pinched; subtle optical compensations make geometry look visually balanced and harmonious"
      ],
      correct_option_index: 3,
      explanation: "Optical compensations counteract human visual perception biases, ensuring geometry feels balanced rather than stiff or pinched.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In Marty Neumeier's 'Zag' positioning framework, what is the 'Onliness Statement' exercise used to determine competitive market differentiation?",
      options: [
        "A legal statement promising to never change prices",
        "A concise strategic declaration completing the formula: 'Our brand is the ONLY [category] that [differentiating benefit] for [target audience] in [market space]', proving true market uniqueness",
        "A contract signed by all corporate board members",
        "An advertisement broadcast once per year"
      ],
      correct_option_index: 1,
      explanation: "The Onliness Statement forces brands to articulate their radical differentiation and uncontested market positioning.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In comprehensive brand style guide authoring, why must a brand's color palette be explicitly defined across FOUR distinct color spaces (Pantone PMS, CMYK, sRGB, HEX)?",
      options: [
        "To make the brand book longer",
        "Because each designer uses a different software program",
        "To guarantee precise color accuracy across physical manufacturing (PMS spot inks), commercial 4-color offset printing (CMYK), digital video displays (sRGB), and web/mobile user interfaces (HEX)",
        "Four color spaces are required by international trade law"
      ],
      correct_option_index: 2,
      explanation: "Defining PMS, CMYK, sRGB, and HEX ensures flawless color fidelity across merchandise, print, broadcast, and web.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In digital product design systems, what is the role of 'Design System Brand Tokens' (Design Tokens) in modern identity rollout?",
      options: [
        "Centralized, platform-agnostic variables storing visual brand decisions (brand-primary-color, font-family-heading, border-radius-sm) that automatically synchronize between Figma libraries and production CSS/codebases",
        "Cryptocurrency coins issued by graphic designers",
        "Physical plastic badges worn by design team members",
        "Tokens used to buy fonts on the internet"
      ],
      correct_option_index: 0,
      explanation: "Design tokens translate brand decisions into programmatic variables, ensuring instant synchronization between design and code.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In professional logo stress-testing, what is '16x16 Favicon Viability' and what does it reveal about a mark's design integrity?",
      options: [
        "A test to see if a logo looks good on a 16-inch monitor",
        "A test that counts the number of colors in an icon",
        "A requirement for video games running at 16 FPS",
        "Testing whether a mark can be reduced to a tiny 16x16 pixel square in a web browser tab without becoming an illegible, muddy smudge; passing proves the mark has powerful silhouette simplicity and visual clarity"
      ],
      correct_option_index: 3,
      explanation: "A 16x16 favicon test is the ultimate test of simplicity; marks with excess complexity become unrecognizable smudges.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In brand architecture governance, what is an 'Endorsed Brand' model (such as 'Courtyard by Marriott' or 'PlayStation by Sony')?",
      options: [
        "A brand that is endorsed by famous movie actors exclusively",
        "A sub-brand with its own unique identity and market positioning that visibly carries the credibility, trust, and quality endorsement of an overarching corporate master brand",
        "A brand that has zero competitors",
        "A brand that operates without a trademark"
      ],
      correct_option_index: 1,
      explanation: "Endorsed brands maintain independent consumer identities while borrowing institutional trust from a parent master brand.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #139.");
  console.log("Skill #139 update completed successfully!");
}

run();
