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

const skillId = "30b36a7d-fc93-4ba1-89ab-ae398355a395";

async function run() {
  console.log("Updating Skill #82: Email Marketing (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Deliverability Infrastructure, DNS Protocols and Compliance" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Lifecycle Automation Architecture and Behavioral Flows" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: RFM Segmentation, Liquid Personalization and List Hygiene" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Lifecycle Marketing & Deliverability Architect level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The Core Email Authentication Triad: SPF, DKIM and DMARC",
      order_index: 1,
      content: `### Cryptographic DNS Authentication Architecture

1. The Authentication Triad:
   - SPF (Sender Policy Framework): A TXT DNS record listing all authorized sending IP addresses permitted to send mail on behalf of the domain (\`v=spf1 include:mailgun.org include:klaviyo.com ~all\`).
   - DKIM (DomainKeys Identified Mail): Cryptographic public/private key pairing; the sending MTA signs email headers, and recipient mail servers verify against the DNS public key to detect in-transit message tampering.
   - DMARC (Domain-based Message Authentication Reporting & Conformance): Enforces SPF and DKIM alignment (\`p=none\` monitor -> \`p=quarantine\` spam -> \`p=reject\` hard block).
   - BIMI (Brand Indicators for Message Identification): Displays verified brand logos in Gmail and Apple Mail via Verified Mark Certificates (VMC).`
    },
    {
      track_id: track1Id,
      title: "Google and Yahoo 2024 Sender Requirements and Compliance",
      order_index: 2,
      content: `### Mandatory Deliverability Standards and Spam Limits

1. Google and Yahoo 2024 Deliverability Mandates:
   - Spam Complaint Rate Threshold: Must maintain spam complaint rates below 0.10% (with an absolute hard ceiling at 0.30%); exceeding 0.30% results in severe domain-wide blocking.
   - Mandatory DMARC Policy: Basic DMARC record mandatory on all sending domains.
   - One-Click List-Unsubscribe Header: Mandatory implementation of RFC 8058 \`List-Unsubscribe-Post\` and \`List-Unsubscribe\` headers enabling instant one-click unsubscribe directly from the email client UI.`
    },
    {
      track_id: track1Id,
      title: "IP Warmup Schedules and Sender Score Reputation",
      order_index: 3,
      content: `### Dedicated IP Warming Protocols

1. Dedicated vs Shared Sending IPs:
   - High-volume senders (>100k emails/month) require dedicated IP addresses to isolate sender reputation from third-party spammers.

2. The 30-Day IP Warmup Schedule:
   - Gradually escalating daily volume on clean, engaged segments:
     - Days 1 to 3: 50 to 100 emails/day to subscribers active in the last 14 days.
     - Days 4 to 7: 500 emails/day.
     - Days 8 to 14: 2,500 emails/day.
     - Days 15 to 30: Scale to 50k+ daily volume as Mailbox Providers (Gmail, Outlook) establish trust.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "The 5 Core E-Commerce & SaaS Lifecycle Flows",
      order_index: 1,
      content: `### Automated Behavioral Trigger Architecture

1. The 5 Foundational Lifecycle Flows:
   - 1. Welcome Series (3 to 5 emails): Delivers lead magnet, introduces founder origin narrative, and offers initial conversion discount (generates >30% of flow revenue).
   - 2. Abandoned Checkout Flow: 1 hour -> 24 hours -> 48 hours multi-step recovery sequence with dynamic cart item embeds.
   - 3. Browse Abandonment Flow: Triggered when logged-in users view product pages without adding to cart.
   - 4. Post-Purchase Education & Cross-Sell: Product tutorials, unboxing guides, and complementary accessory recommendations.
   - 5. Customer Win-Back: Reactivating customers inactive for 60 to 90 days with special offers.`
    },
    {
      track_id: track2Id,
      title: "Conditional Branching and Dynamic Logic in Automated Flows",
      order_index: 2,
      content: `### Multi-Path Automation Logic and Personalization

1. Conditional Value Splits:
   - Forking workflows based on transactional value (e.g. Carts > $150 route to a high-touch VIP flow with direct concierge support; Carts < $50 route to a standard tiered discount ladder).

2. Real-Time Webhook Exits:
   - Dynamic cancellation triggers terminating active promotional flows immediately when a purchase webhook fires, preventing embarrassing post-purchase discount emails.`
    },
    {
      track_id: track2Id,
      title: "A/B Testing Subject Lines, Preheaders and Send Time Optimization",
      order_index: 3,
      content: `### Conversion Optimization and Send-Time Algorithms

1. Envelope Optimization (Subject Line + Preheader):
   - Subject Line (30 to 45 characters to avoid mobile truncation) + Preheader Text (80 to 100 characters expanding context).
   - Testing Curiosity Hooks vs Direct Benefit Hooks vs Urgency Hooks.

2. Send Time Optimization (STO):
   - Machine learning algorithms evaluating recipient historical inbox activity to deliver emails at each individual subscriber's peak personal engagement window.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "RFM Customer Segmentation (Recency, Frequency, Monetary)",
      order_index: 1,
      content: `### Quantitative Customer Lifecycle Clustering

1. The RFM Framework:
   - Recency (R): Days elapsed since last order.
   - Frequency (F): Total lifetime order count.
   - Monetary (M): Total cumulative customer lifetime spend.

2. Actionable RFM Segment Tiers:
   - Champions / VIPs (Top 5%): High R, High F, High M (receive exclusive early access and zero deep discounts).
   - At-Risk Customers: Low R, High F, High M (flagged for immediate VIP win-back outreach).
   - One-Time Shoppers: High R, Low F, Low M (targeted with cross-sell onboarding).`
    },
    {
      track_id: track3Id,
      title: "Dynamic Content Templating with Liquid and Handlebars",
      order_index: 2,
      content: `### Programmatic 1-to-1 Content Customization

1. Liquid Dynamic Syntax:
\`\`\`liquid
{% if customer.orders_count > 1 %}
  <h2>Welcome back, {{ customer.first_name | default: 'valued customer' }}!</h2>
  <p>Here are recommended accessories for your {{ customer.last_purchased_item }}:</p>
{% else %}
  <h2>Welcome to our community!</h2>
  <p>Enjoy 15% off your first order with code WELCOME15.</p>
{% endif %}
\`\`\`

2. Dynamic Product Feeds:
   - Injecting algorithmic recommendation carousels populated dynamically from store catalog APIs based on browsing history.`
    },
    {
      track_id: track3Id,
      title: "Apple Mail Privacy Protection (MPP) and List Hygiene",
      order_index: 3,
      content: `### Cookieless Analytics, Metric Shifts and Sunset Policies

1. Apple Mail Privacy Protection (MPP) Impact:
   - Apple Mail proxies automatically pre-fetch tracking pixel images in the background, artificially inflating reported Open Rates to 60%+ on iOS devices.
   - Metric Evolution: Shift focus from Open Rates to Click-Through Rate (CTR), Click-to-Open Rate (CTOR), and Revenue Per Recipient (RPR).

2. Automated Sunset Policies & Spam Traps:
   - Spam Traps (Pristine and Recycled traps) blacklist sender domains if uncleaned lists are emailed.
   - Automated Sunset Rule: Automatically unsubscribing or segmenting out any contact who has not clicked an email in 90 to 120 days to preserve domain reputation.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #82.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "What DNS authentication record lists the specific authorized IP addresses and servers permitted to send email on behalf of a domain?",
      options: [
        "MX Record",
        "SPF (Sender Policy Framework)",
        "CNAME Record",
        "A Record"
      ],
      correct_option_index: 1,
      explanation: "SPF records specify authorized sending servers in DNS TXT records to prevent email spoofing.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "Under Google and Yahoo 2024 sender requirements, what is the maximum spam complaint rate threshold that senders must strictly stay below?",
      options: [
        "50.0%",
        "10.0%",
        "5.0%",
        "Below 0.10% (with a hard ceiling at 0.30%)"
      ],
      correct_option_index: 3,
      explanation: "Google and Yahoo strictly enforce spam rates below 0.10% (<0.30% hard ceiling) to maintain inbox placement.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In email marketing metrics, what does 'Revenue Per Recipient' (RPR) measure?",
      options: [
        "Total revenue generated by an email campaign divided by the total number of successfully delivered email recipients",
        "The price of email marketing software",
        "The salary of the email marketer",
        "The number of characters in the email"
      ],
      correct_option_index: 0,
      explanation: "Revenue Per Recipient (RPR = Revenue / Total Recipients) measures the true commercial efficiency of email sends.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In customer segmentation, what three dimensions comprise the 'RFM' quantitative lifecycle framework?",
      options: [
        "Reach, Feedback, Metrics",
        "Rate, Frequency, Margin",
        "Recency, Frequency, and Monetary value",
        "Revenue, Form, Marketing"
      ],
      correct_option_index: 2,
      explanation: "RFM evaluates Recency (last purchase), Frequency (total orders), and Monetary value (total spend).",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In email lifecycle automation, what automated series delivers lead magnets, shares founder origin stories, and typically accounts for over 30% of automated flow revenue?",
      options: [
        "Order Shipping Confirmation",
        "Welcome Series",
        "Password Reset",
        "Credit Card Expiration"
      ],
      correct_option_index: 1,
      explanation: "The Welcome Series engages new subscribers at peak intent, driving massive lifecycle conversion value.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "How does DKIM (DomainKeys Identified Mail) authenticate outgoing email messages?",
      options: [
        "By deleting outgoing emails",
        "By asking recipients for a password",
        "The sending server attaches a cryptographic digital signature to the email header, which receiving servers verify against the public key published in the domain's DNS",
        "By routing emails through physical mail carriers"
      ],
      correct_option_index: 2,
      explanation: "DKIM uses public/private key cryptography to verify message authenticity and ensure headers were not altered in transit.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "Why did Apple's Mail Privacy Protection (MPP) introduced in iOS 15 make 'Open Rates' unreliable as a primary marketing metric?",
      options: [
        "Apple Mail servers automatically proxy and pre-fetch remote tracking pixel images in the background regardless of whether the user opened the email, artificially inflating open rates to 60%+",
        "Apple banned all emails on iPhones",
        "Apple converted all emails to text messages",
        "Open rates were declared illegal"
      ],
      correct_option_index: 0,
      explanation: "Apple MPP automatically loads tracking pixels on proxy servers, falsely reporting opens for unopened emails.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In email deliverability operations, what is an automated 'Sunset Policy'?",
      options: [
        "Sending emails only at sunset",
        "Changing email background colors to orange",
        "Turning off email servers on holidays",
        "Automatically unsubscribing or suppressing contacts who have not opened or clicked an email in 90 to 120 days to protect domain sender reputation and inboxing rates"
      ],
      correct_option_index: 3,
      explanation: "Sunset policies remove disengaged contacts automatically, preventing spam trap hits and protecting deliverability.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In automated lifecycle flows, why are 'Value-Based Conditional Splits' utilized in Abandoned Checkout sequences?",
      options: [
        "To delete small orders",
        "To route high-value cart abandoners (> $150) to high-touch personalized concierge assistance, while routing lower-value carts to standard automated discount ladders",
        "To charge higher sales tax",
        "To translate emails into French"
      ],
      correct_option_index: 1,
      explanation: "Conditional splits allocate resources proportionally, giving VIP high-value carts white-glove treatment.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In email copywriting and layout, what is the 'Preheader Text' (Preview Text)?",
      options: [
        "The email unsubscribe link",
        "The computer IP address",
        "The snippet of text (approx 80-100 characters) displayed directly next to or below the subject line in the inbox preview, expanding context and driving open curiosity",
        "The company legal address"
      ],
      correct_option_index: 2,
      explanation: "Preheader text works synergistically with the subject line to provide compelling teaser context in the inbox preview.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "In DMARC policy governance, what is the progression sequence from initial setup to full enforcement?",
      options: [
        "p=none (monitoring and reporting only) -> p=quarantine (sending suspicious unaligned mail to spam folder) -> p=reject (hard blocking all unauthenticated fraudulent mail)",
        "p=reject -> p=none -> p=quarantine",
        "p=block -> p=allow -> p=ignore",
        "There is only one policy level"
      ],
      correct_option_index: 0,
      explanation: "DMARC progression starts with monitoring (p=none) before advancing to quarantine and ultimate strict rejection (p=reject).",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In email deliverability infrastructure, what are 'Pristine Spam Traps' and how do they differ from 'Recycled Spam Traps'?",
      options: [
        "Pristine traps only catch clean emails",
        "Recycled traps are for paper recycling companies",
        "Pristine traps are created by hackers",
        "Pristine Traps are email addresses created exclusively to catch scrapers that have never opted into any list; Recycled Traps are abandoned user inboxes converted into spam traps after years of inactivity"
      ],
      correct_option_index: 3,
      explanation: "Pristine traps have never been used by real humans, immediately exposing list scraping or purchasing practices.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In dynamic email personalization with Liquid templating, what does the filter 'default' achieve (e.g. {{ customer.first_name | default: 'there' }})?",
      options: [
        "It sets a default font color",
        "It provides a fallback fallback string ('there') if the customer's first name variable is empty or null, preventing awkward blank spaces like 'Hi ,'",
        "It sends the email to everyone",
        "It translates the name into uppercase"
      ],
      correct_option_index: 1,
      explanation: "The default filter ensures that missing customer attributes render gracefully without blank gaps or broken syntax.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In email deliverability engineering, what is the protocol for 'IP Warming' on a brand-new dedicated IP address?",
      options: [
        "Sending 1,000,000 emails on Day 1",
        "Leaving the server in the sun",
        "Gradually ramping daily volume over 30 days starting with small batches (50-100 emails) sent strictly to highly engaged subscribers to build positive sender reputation with mailbox providers",
        "IP warming is unnecessary"
      ],
      correct_option_index: 2,
      explanation: "IP warming slowly increases daily volume to high-engagement contacts, proving to mailbox providers that the IP is reputable.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "Under RFC 8058 standards mandated by Google and Yahoo, what is the requirement for 'One-Click Unsubscribe'?",
      options: [
        "Email headers must include List-Unsubscribe-Post and List-Unsubscribe mailto/https links, allowing recipients to unsubscribe with a single click in the inbox UI without landing on a login or preference page",
        "Users must enter their password to unsubscribe",
        "Unsubscribe requests can take 30 days to process",
        "Users must call customer support to unsubscribe"
      ],
      correct_option_index: 0,
      explanation: "RFC 8058 requires header-based one-click unsubscribe links that execute instantly without forcing users to log in.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #82.");
  console.log("Skill #82 update completed successfully!");
}

run();
