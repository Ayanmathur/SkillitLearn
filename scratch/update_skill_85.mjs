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

const skillId = "e47fe828-ab82-49dc-a342-e2779b54658c";

async function run() {
  console.log("Updating Skill #85: Product Listings & Merchandising (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Visual Merchandising, PDP Anatomy and Media Engineering" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Copywriting Architecture, PIM Attributes and Social Proof" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Collection Merchandising, Cross-Sells and Recommendation Engines" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / VP of E-Commerce Merchandising level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The 7-Image Product Asset Framework",
      order_index: 1,
      content: `### High-Converting PDP Visual Asset Blueprint

1. The 7-Image Visual Asset Standard:
   - 1. Hero Studio Cutout: 2000x2000px on pure white #FFFFFF background with soft natural drop shadow (optimized for high-resolution zoom).
   - 2. In-Context Scale Shot: Displays product in realistic use against human hands or everyday objects to communicate accurate scale.
   - 3. Feature Infographic: Callout lines highlighting proprietary engineering materials and internal mechanisms.
   - 4. Macro Texture Close-Up: Ultra high-resolution shot demonstrating tactile material craftsmanship.
   - 5. Sizing and Dimension Diagram: Technical schematic with explicit height, width, and capacity metrics.
   - 6. Packaging / Unboxing Shot: Showing retail presentation box and included accessories.
   - 7. Customer UGC Social Proof: Real-world lifestyle photo verifying authentic use.`
    },
    {
      track_id: track1Id,
      title: "3D AR Assets, Video Integration and Interactive Media",
      order_index: 2,
      content: `### Augmented Reality and Rich Interactive Media

1. 3D Augmented Reality (AR) Assets:
   - Serving 3D files (.usdz for Apple iOS Quick Look, .gltf/.glb for Android Scene Viewer) allowing shoppers to preview virtual products in their living spaces, reducing returns by 25% to 40%.

2. Dynamic Video Embeds:
   - Muted, autoplaying looping WebM/MP4 videos directly within the PDP gallery demonstrating functional product operation in under 6 seconds.`
    },
    {
      track_id: track1Id,
      title: "Mobile PDP Ergonomics and Sticky Conversion Bars",
      order_index: 3,
      content: `### Mobile Conversion Architecture and Thumb Zone Ergonomics

1. Mobile PDP Viewport Optimization:
   - Designing within the primary mobile thumb zone: placing size/color variant swatches, quantity selectors, and primary CTA buttons within immediate one-handed thumb reach.

2. Persistent Sticky 'Add to Cart' Bar:
   - Triggering a fixed bottom bar when users scroll past the primary hero button, displaying product title, active variant swatch, price, and a direct checkout trigger.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Product Information Management (PIM) and Master Data",
      order_index: 1,
      content: `### Structured Catalog Data Governance

1. PIM Architecture (Akeneo, Salsify):
   - Centralizing structured master SKU data (materials, washing/care instructions, country of origin COO, Harmonized Tariff System HTS codes, certifications).

2. Accordion Drawer Architecture:
   - Structuring dense technical information into collapsible drawer accordions (1. Overview & Benefits, 2. Materials & Dimensions, 3. Shipping & Delivery, 4. Warranty & Returns) to keep PDP layout uncluttered.`
    },
    {
      track_id: track2Id,
      title: "Direct-Response E-Commerce Copywriting Frameworks",
      order_index: 2,
      content: `### Persuasive Product Descriptions and Microcopy

1. Feature-to-Benefit Translation Matrix:
   - Mapping technical specifications to emotional human outcomes:
     - Spec: \"6061-T6 Aircraft Grade Aluminum\" -> Benefit: \"Indestructible, ultralight frame that will never rust or bend.\"
     - Spec: \"IPX8 Waterproof Rating\" -> Benefit: \"Submersible up to 3 meters, completely safe in heavy rain or accidental drops.\"

2. Risk Reversals and Microcopy:
   - Placing guarantees (\"30-Day Risk-Free Trial\", \"Free Returns\", \"2-Year Warranty\") directly beneath the Add to Cart button.`
    },
    {
      track_id: track2Id,
      title: "Verified Customer Reviews and Social Proof Engineering",
      order_index: 3,
      content: `### UGC Architecture and Review Syndication

1. High-Converting Review Widgets (Yotpo, Okendo, Judge.me):
   - Collecting verified buyer reviews with customer uploaded photos and videos, customer sizing attributes (e.g. height, fit rating: runs small / true to size / runs large), and rating distribution histograms.

2. On-Page Community Q&A:
   - Public Q&A modules addressing common technical objections directly on the PDP.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Collection Merchandising and Algorithmic Ranking Rules",
      order_index: 1,
      content: `### Revenue-Optimized Collection Sorting Topologies

1. Algorithmic Merchandising Sorting:
   - Margin-Weighted Revenue per Visitor (RPV): Sorting collections algorithmically by multiplying conversion rate, sales velocity, and gross margin, while automatically suppressing out-of-stock or low-inventory (<5 units) items to the bottom of the grid.

2. Visual Merchandising Badges:
   - Dynamic ribbon tags (\"Best Seller\", \"Staff Pick\", \"Limited Edition\", \"Save 25%\") directing visual attention toward high-margin SKUs.`
    },
    {
      track_id: track3Id,
      title: "Cross-Sell, Upsell and Bundle Mechanics",
      order_index: 2,
      content: `### Expanding Average Order Value (AOV)

1. Slide-Out Drawer Cart Merchandising:
   - Incorporating dynamic tiered free shipping progress bars (\"Add $14 more for Free Shipping!\") paired with 1-click in-cart cross-sell add-ons (extended warranties, cleaning kits, accessories).

2. Frequently Bought Together (FBT) Bundling:
   - Displaying algorithmic 2 or 3 product bundles directly below the PDP fold offering a 10% to 15% discount for 1-click bundle purchase.`
    },
    {
      track_id: track3Id,
      title: "AI-Driven Personalization and Vector Search Engines",
      order_index: 3,
      content: `### Semantic Discovery and Recommendation Feeds

1. Vector-Based Product Search (Algolia, Klevu, Shopify Search):
   - Powering fast search with typo tolerance, synonym libraries, and natural language semantic parsing (\"breathable running shoes for wide feet\").

2. Collaborative Recommendation Feeds:
   - Serving real-time \"Customers Also Viewed\" and \"Recommended For You\" carousels driven by collaborative filtering algorithms.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #85.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In the 7-Image Product Asset Framework for e-commerce PDPs, what is the primary standard for Image #1 (Hero Shot)?",
      options: [
        "A photo taken in dark lighting",
        "A 2000x2000px studio cutout on a pure white #FFFFFF background with soft natural shadow, optimized for high-resolution zoom",
        "A cartoon drawing",
        "A low-resolution screenshot of a website"
      ],
      correct_option_index: 1,
      explanation: "A high-res clean studio shot on pure white with subtle shadow is the universal hero image standard across e-commerce.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In e-commerce merchandising, how does 3D Augmented Reality (AR) asset integration (.usdz / .gltf) directly impact merchant profitability?",
      options: [
        "It increases shipping costs",
        "It deletes product reviews",
        "It turns the store into a video game",
        "It enables shoppers to preview virtual products in their real spaces, reducing customer return rates by 25% to 40%"
      ],
      correct_option_index: 3,
      explanation: "AR spatial previews allow customers to verify dimensions and fit at home before buying, dramatically cutting returns.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In mobile e-commerce UX, what is the primary purpose of a 'Persistent Sticky Add to Cart Bar'?",
      options: [
        "Keeping the product title, selected variant, price, and primary purchase CTA accessible at all times as the user scrolls down long PDP descriptions",
        "Playing background music on the phone",
        "Hiding product pricing",
        "Preventing the user from scrolling"
      ],
      correct_option_index: 0,
      explanation: "Sticky CTA bars remove purchase friction, letting shoppers check out instantly without scrolling back to the top.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In e-commerce copywriting, what is the 'Feature-to-Benefit' translation formula?",
      options: [
        "Translating English words into Latin",
        "Listing only manufacturer serial numbers",
        "Translating a dry technical engineering specification into a tangible, emotional outcome or advantage for the customer",
        "Deleting product descriptions completely"
      ],
      correct_option_index: 2,
      explanation: "Feature-to-benefit translation explains why the technical spec matters to the buyer's everyday life.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In e-commerce merchandising, what is a Product Information Management (PIM) system used for?",
      options: [
        "Calculating company payroll",
        "Centralizing, organizing, and governing structured master product data (SKU attributes, materials, care specs, tariff codes) across sales channels",
        "Sending marketing emails",
        "Hosting web servers"
      ],
      correct_option_index: 1,
      explanation: "PIM platforms act as single sources of truth for structured catalog specifications across global sales channels.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In collection page merchandising, why is 'Margin-Weighted Revenue per Visitor (RPV)' sorting superior to standard chronological sorting?",
      options: [
        "It ranks products in alphabetical order",
        "It hides all product images",
        "It algorithmically prioritizes high-converting, high-margin best-sellers at the top of the grid while pushing low-margin and low-stock SKUs to the bottom, maximizing store profitability",
        "It deletes out-of-stock items from the database"
      ],
      correct_option_index: 2,
      explanation: "Margin-weighted RPV sorting maximizes gross profit per visitor by ranking high-margin, high-velocity items at the top.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In cart merchandising, how does a 'Tiered Free Shipping Progress Bar' in a slide-out drawer cart expand Average Order Value (AOV)?",
      options: [
        "It gamifies the checkout by showing customers the exact remaining dollar threshold needed to unlock free shipping (e.g. 'Add $14 more for Free Shipping'), incentivizing add-on item purchases",
        "It adds hidden shipping fees at checkout",
        "It slows down cart loading speed",
        "It cancels orders below $50"
      ],
      correct_option_index: 0,
      explanation: "Free shipping threshold bars leverage positive gamification, encouraging customers to add cross-sells to hit the target.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In e-commerce product reviews, what specific feature in modern review platforms (Okendo, Yotpo) most effectively helps apparel shoppers choose correct sizing?",
      options: [
        "Reviewer star rating only",
        "Reviewer IP address",
        "Review submission timestamp",
        "Reviewer fit feedback attributes (e.g. height, weight, 'runs small / true to size / runs large' scale) paired with verified customer photos"
      ],
      correct_option_index: 3,
      explanation: "Fit and sizing attributes paired with customer body metrics provide sizing confidence, drastically reducing fit-related returns.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In storefront UX design, why is structuring dense product specifications into 'Collapsible Accordion Drawers' recommended?",
      options: [
        "Accordions hide pricing from competitors",
        "It provides deep technical transparency for detailed researchers while keeping the visual layout clean and scannable for the majority of mobile shoppers",
        "Search engines cannot read accordions",
        "It speeds up internet connection"
      ],
      correct_option_index: 1,
      explanation: "Accordion drawers balance comprehensive technical data with a compact, scannable mobile visual hierarchy.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In e-commerce bundling strategy, what is a 'Frequently Bought Together' (FBT) widget?",
      options: [
        "A list of products the customer returned in the past",
        "A pop-up asking for customer surveys",
        "An algorithmic multi-product recommendation block displayed on the PDP that bundles complementary items (e.g. Camera + Lens + Case) with a 1-click discounted checkout",
        "A spam advertisement banner"
      ],
      correct_option_index: 2,
      explanation: "FBT widgets bundle complementary SKUs dynamically, offering bundle incentives to increase multi-item order rates.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In site search and merchandising, how does 'Vector-Based Semantic Search' (Algolia, Klevu) outperform traditional lexical keyword matching?",
      options: [
        "It maps search queries into multi-dimensional conceptual vector embeddings, understanding buyer intent, typo variations, and natural language concepts (e.g. 'warm waterproof winter boots') even if the exact keyword does not match product titles",
        "It only searches product SKU numbers",
        "It requires users to upload a photo to search",
        "It deletes search history every 5 minutes"
      ],
      correct_option_index: 0,
      explanation: "Semantic vector search analyzes conceptual intent and synonyms rather than brittle literal keyword matches, lifting search conversion.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In conversion rate optimization on PDPs, where should critical 'Risk Reversal Badges' (e.g. 30-Day Guarantee, Free Returns, 2-Year Warranty) be strategically placed?",
      options: [
        "Hidden in the website footer",
        "Only on the 404 error page",
        "Inside an external PDF download",
        "Directly in the immediate optical scan path immediately beneath or adjacent to the primary 'Add to Cart' button"
      ],
      correct_option_index: 3,
      explanation: "Placing risk reversals near the main CTA resolves friction and hesitation at the exact moment of decision.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In the 7-Image Asset Framework, what is the role of Image #2 ('In-Context Scale Shot')?",
      options: [
        "Showing the corporate headquarters building",
        "Displaying the product held by human hands or positioned next to everyday standard objects to prevent customer misjudgment of physical size and proportion",
        "Showing the founder's college degree",
        "A picture of the shipping box label"
      ],
      correct_option_index: 1,
      explanation: "In-context scale shots establish realistic physical proportions in the shopper's mind, preventing size misunderstandings.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In catalog merchandising algorithms, what rule should automatically apply to products that fall below safety stock inventory levels (<5 units)?",
      options: [
        "Double the product price",
        "Delete the product from Google search",
        "Automatically demote or de-boost the SKU's rank to the lower rows of collection pages to prevent sending high-value traffic to items that will quickly go out of stock",
        "Send an email to every customer"
      ],
      correct_option_index: 2,
      explanation: "Demoting low-stock items preserves prime collection real estate for fully stocked, high-conversion inventory.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In e-commerce personalization engines, what is 'Collaborative Filtering'?",
      options: [
        "An algorithmic recommendation method that analyzes purchasing and browsing behaviors across large populations of users to recommend items to a shopper based on what similar users purchased",
        "Filtering email spam",
        "Two employees editing a spreadsheet at the same time",
        "Filtering water in an office"
      ],
      correct_option_index: 0,
      explanation: "Collaborative filtering identifies behavioral overlaps between user clusters to deliver tailored 'Customers who bought X also bought Y' suggestions.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #85.");
  console.log("Skill #85 update completed successfully!");
}

run();
