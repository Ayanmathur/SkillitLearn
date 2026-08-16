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

const skillId = "4d61028e-d9cc-43af-9d3a-06bcfe7da3c2";

async function run() {
  console.log("Updating Skill #91: Legal & Registration Basics (9 steps across 3 tracks)...");

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
        title: `Track ${tracks.length + 1}: Legal & Registration Basics`,
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
  await supabase.from("tracks").update({ title: "Track 1: Entity Classification, Formation and Delaware Governance" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Founder Equity, 83(b) Elections and Intellectual Property" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Employment Law, Commercial Contracts and 409A Valuations" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / Startup General Counsel & Venture Formation level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "Entity Typology: LLC vs C-Corp vs S-Corp Tax Election",
      order_index: 1,
      content: `### Comparative Entity Architecture and Liability Protection

1. Business Legal Structures:
   - Sole Proprietorship: Zero corporate veil; personal assets exposed to business debts.
   - Limited Liability Company (LLC): Pass-through taxation (profits flow directly to personal tax returns avoiding double taxation), governed by an Operating Agreement; optimal for boot-strapped businesses and agencies.
   - C-Corporation: Separate taxable legal entity with corporate-level taxation and dividend taxation, but mandatory for issuing stock options and raising institutional venture capital.
   - S-Corporation Election (IRS Form 2553): Tax status election allowing owner-employees to draw a reasonable salary (subject to payroll FICA tax) while taking remaining profits as non-FICA dividend distributions.`
    },
    {
      track_id: track1Id,
      title: "The Delaware C-Corporation and QSBS Section 1202",
      order_index: 2,
      content: `### Venture Formation Standards and Tax Exclusions

1. Why Delaware C-Corps Dominate Venture Capital:
   - The specialized Delaware Court of Chancery provides deep, predictable corporate case law resolved by expert judges without juries.

2. Qualified Small Business Stock (QSBS / Section 1202):
   - Founders and early investors holding original C-Corp stock for at least 5 years can legally exclude up to 100% of federal capital gains tax upon exit (up to the greater of $10 million or 10x original cost basis).`
    },
    {
      track_id: track1Id,
      title: "Registration Plumbing: Articles, EIN and Corporate Veil",
      order_index: 3,
      content: `### Corporate Formation Protocols and Veil Integrity

1. Essential Registration Steps:
   - Certificate of Incorporation / Articles of Organization filed with the Secretary of State.
   - IRS Employer Identification Number (EIN / Form SS-4) required for opening business banking accounts.

2. Maintaining the Corporate Veil:
   - Commingling personal and business funds, failing to maintain corporate bylaws, or skipping board meeting minutes allows creditors to pierce the corporate veil, holding founders personally liable for company debts.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Founder Equity Structuring and 4-Year Vesting",
      order_index: 1,
      content: `### Equity Allocation and Vesting Safeguards

1. Standard 4-Year Vesting with 1-Year Cliff:
   - Equity vests incrementally monthly over 48 months (1/48th per month).
   - The 1-Year Cliff: If a co-founder leaves before completing 12 full months, they forfeit 100% of their unvested shares, protecting the company from unearned dead equity on the cap table.

2. Vesting Acceleration Clauses:
   - Double-Trigger Acceleration: 100% of unvested equity accelerates if the company is acquired (Trigger 1) AND the employee is terminated without cause within 12 months post-acquisition (Trigger 2).`
    },
    {
      track_id: track2Id,
      title: "Section 83(b) Tax Election and the 30-Day IRS Window",
      order_index: 2,
      content: `### The Most Critical Startup Tax Filing

1. The Section 83(b) Election Rule:
   - An irrevocable formal letter filed with the IRS within strictly 30 days of receiving restricted unvested stock.
   - Elects to pay income tax on the fair market value at grant date (typically nominal fractions of a cent) rather than paying massive ordinary income tax on appreciated valuations as shares vest over 4 years.

2. Non-Negotiable 30-Day Deadline:
   - The IRS allows zero exceptions or late relief for missing the 30-day post-grant window.`
    },
    {
      track_id: track2Id,
      title: "Intellectual Property Assignment (PIIAA) and Inventions",
      order_index: 3,
      content: `### Securing Corporate IP Sovereignty

1. Proprietary Information and Inventions Assignment Agreement (PIIAA):
   - Mandatory legal agreement signed by all founders, employees, and contractors legally assigning all code, designs, patents, and domain names created for the business to the company entity.

2. Clean IP Lineage:
   - Verifying that founders did not write startup code using past employer laptops, servers, or intellectual property to avoid costly copyright lawsuits.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Worker Classification: W-2 Employees vs 1099 Contractors",
      order_index: 1,
      content: `### Labor Law Compliance and Classification Tests

1. Department of Labor Common Law Classification Factors:
   - Behavioral Control: Does the company dictate working hours, equipment, and step-by-step methods (W-2 employee) or does the worker control execution (1099 independent contractor)?
   - Financial Control: Does the worker have unreimbursed business expenses and offer services to the open market?

2. Misclassification Liabilities:
   - Misclassifying employees as 1099 contractors triggers severe liabilities for back payroll taxes, workers' compensation penalties, and unpaid overtime.`
    },
    {
      track_id: track3Id,
      title: "Core Commercial Contracts: MSAs, SOWs and NDAs",
      order_index: 2,
      content: `### Commercial Contract Architecture

1. Master Services Agreement (MSA):
   - Governs overarching legal relationships: limitation of liability, indemnification caps, intellectual property ownership, and dispute jurisdiction.

2. Statement of Work (SOW):
   - Specifies concrete project deliverables, delivery milestones, acceptance testing criteria, and payment schedules.

3. Non-Disclosure Agreements (NDAs):
   - Mutual vs Unilateral agreements protecting proprietary trade secrets and confidential business plans.`
    },
    {
      track_id: track3Id,
      title: "Cap Table Management, Option Pools and 409A Valuations",
      order_index: 3,
      content: `### Equity Governance and Regulatory Valuations

1. Employee Stock Option Pools (ESOP):
   - Reserving 10% to 15% of authorized common stock for employee incentive stock options (ISOs) and non-qualified stock options (NSOs).

2. IRC Section 409A Valuations:
   - Formal independent third-party appraisal determining the Fair Market Value (FMV) of common stock, required annually to establish legally defensible option strike prices and prevent severe IRS tax penalties.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #91.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "What is the strict, non-negotiable statutory deadline to file an IRC Section 83(b) tax election with the IRS after receiving restricted startup stock?",
      options: [
        "Within 1 year",
        "Within strictly 30 days of the stock grant date",
        "At the end of the calendar year",
        "There is no deadline"
      ],
      correct_option_index: 1,
      explanation: "Section 83(b) elections must be postmarked and filed with the IRS within exactly 30 days of the equity grant date.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "In standard startup equity vesting schedules, what is the function of the '1-Year Cliff'?",
      options: [
        "Employees receive a bonus after 1 year",
        "The company must shut down after 1 year",
        "All stock options expire after 1 year",
        "If a founder or employee departs before completing 12 full months, they forfeit 100% of their equity, protecting the cap table from deadweight"
      ],
      correct_option_index: 3,
      explanation: "The 1-year cliff ensures no equity is earned if a team member leaves during their first year of service.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What federal tax identification number issued by the IRS (Form SS-4) is legally required to open a corporate business bank account?",
      options: [
        "Employer Identification Number (EIN)",
        "Social Security Number only",
        "Driver's License Number",
        "Passport Number"
      ],
      correct_option_index: 0,
      explanation: "An Employer Identification Number (EIN) is the federal tax ID required for banking, payroll, and corporate tax returns.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What legal agreement is signed by founders and employees to ensure that all intellectual property, source code, and inventions belong to the company?",
      options: [
        "Lease Agreement",
        "Promissory Note",
        "Proprietary Information and Inventions Assignment Agreement (PIIAA)",
        "Credit Card Agreement"
      ],
      correct_option_index: 2,
      explanation: "A PIIAA explicitly assigns all IP, code, and inventions created by workers directly to the corporate entity.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "Why do institutional venture capital firms overwhelmingly require startups to incorporate as Delaware C-Corporations?",
      options: [
        "Delaware has warm weather",
        "Delaware offers the specialized Court of Chancery with deep, predictable corporate case law and flexible corporate statutes favored by investors",
        "Delaware has zero lawyers",
        "Delaware bans all business taxes"
      ],
      correct_option_index: 1,
      explanation: "The Delaware Court of Chancery provides deep, predictable corporate governance case law, making it the venture gold standard.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "Under Section 1202 of the Internal Revenue Code, what major tax benefit is provided by 'Qualified Small Business Stock' (QSBS)?",
      options: [
        "Zero sales tax on Amazon",
        "Free healthcare for founders",
        "Investors and founders holding original C-Corp stock for >= 5 years can exclude up to 100% of federal capital gains tax upon sale (up to $10M or 10x basis)",
        "Automatic government grants"
      ],
      correct_option_index: 2,
      explanation: "QSBS allows eligible founders and angel investors to exclude up to $10 million in federal capital gains after holding stock for 5 years.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In corporate governance and liability law, what is 'Piercing the Corporate Veil'?",
      options: [
        "A court order stripping away limited liability protection and holding shareholders personally liable for company debts due to commingling funds or failing to follow corporate formalities",
        "Purchasing corporate insurance",
        "Filing annual tax returns",
        "Issuing new stock certificates"
      ],
      correct_option_index: 0,
      explanation: "Commingling personal/business finances or ignoring bylaws allows courts to pierce the corporate veil, destroying personal liability protection.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "What is an independent 'IRC Section 409A Valuation' used for in startup stock option administration?",
      options: [
        "Determining the price of the company's real estate",
        "Calculating state sales tax",
        "Evaluating employee performance reviews",
        "Establishing an independent Fair Market Value (FMV) for common stock to set legally compliant exercise strike prices for employee stock options without IRS tax penalties"
      ],
      correct_option_index: 3,
      explanation: "409A valuations provide an IRS-approved safe-harbor FMV to price employee stock option strike prices.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In startup equity compensation, what is 'Double-Trigger Vesting Acceleration'?",
      options: [
        "Employees receiving double their salary",
        "Unvested equity accelerates only if two distinct events occur: the company is acquired (Trigger 1) AND the employee is terminated without cause within a specified window post-acquisition (Trigger 2)",
        "Equity vests twice as fast on weekends",
        "Vesting accelerates if the employee buys two computers"
      ],
      correct_option_index: 1,
      explanation: "Double-trigger acceleration protects executives if an acquiring company terminates them post-acquisition.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In commercial contracts, what is the primary structural relationship between a Master Services Agreement (MSA) and a Statement of Work (SOW)?",
      options: [
        "MSAs are for employees; SOWs are for customers",
        "They are completely identical documents",
        "The MSA establishes overarching legal terms (liability caps, IP ownership, dispute rules), while individual SOWs define specific project deliverables, timelines, and fees under that MSA",
        "SOWs replace the need for an operating agreement"
      ],
      correct_option_index: 2,
      explanation: "The MSA governs master legal terms; individual SOWs scope out specific milestones and fees under the MSA.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 0, 3, 1, 2, 0)
    {
      skill_id: skillId,
      question_text: "Why is filing an IRC Section 83(b) election critical when receiving restricted startup stock subject to 4-year vesting?",
      options: [
        "It locks in taxable income at the nominal grant value ($0.0001/share), avoiding massive ordinary income tax liabilities on the fair market value of appreciated shares as they vest over 4 years",
        "It eliminates all capital gains tax permanently",
        "It prevents the company from being audited",
        "It makes stock options completely free"
      ],
      correct_option_index: 0,
      explanation: "Without an 83(b) election, founders owe ordinary income tax on the appreciated value of unvested shares on every single vesting date.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In labor law, what primary behavioral factor differentiates a W-2 Employee from a 1099 Independent Contractor under Department of Labor guidelines?",
      options: [
        "The age of the worker",
        "Whether the worker has a college degree",
        "The state where the worker was born",
        "The degree of behavioral control exercised by the employer (e.g. dictating exact work hours, tools, processes, and exclusivity vs the contractor controlling how work is performed)"
      ],
      correct_option_index: 3,
      explanation: "Behavioral control over working hours, methods, and tools is the core common law indicator of a W-2 employment relationship.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In pass-through entity taxation, how does an 'S-Corporation Tax Election' (IRS Form 2553) optimize self-employment payroll taxes for owner-operators?",
      options: [
        "By eliminating all state and federal income taxes",
        "By splitting business net profit into a 'reasonable salary' (subject to FICA payroll tax) and shareholder dividend distributions (which are exempt from FICA self-employment taxes)",
        "By converting business revenue into tax-free gifts",
        "By deducting personal grocery expenses"
      ],
      correct_option_index: 1,
      explanation: "S-Corp status allows owners to take a reasonable salary while avoiding self-employment tax on remaining profit distributions.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In startup M&A due diligence, what fatal flaw in Intellectual Property (IP) chain of custody can derail an acquisition?",
      options: [
        "Having a trademark registered in only one state",
        "Using open-source software libraries",
        "A founder or early developer writing proprietary code before signing a PIIAA or using a former employer's laptop/resources, creating clouded ownership claims",
        "Having a copyright dated in a leap year"
      ],
      correct_option_index: 2,
      explanation: "Missing IP assignments or using previous employer resources creates clouded title, inviting litigation and killing M&A deals.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In commercial contracts, what is an 'Indemnification' clause and why is an aggregate 'Limitation of Liability' cap essential?",
      options: [
        "Indemnification requires one party to defend and pay for third-party legal claims against the other; a liability cap limits total damages (typically to fees paid in last 12 months), protecting the business from catastrophic unlimited liability",
        "It determines employee vacation days",
        "It sets the product retail price",
        "It translates contracts into foreign languages"
      ],
      correct_option_index: 0,
      explanation: "Indemnification covers third-party legal damages; liability caps limit total enterprise exposure to fees collected.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #91.");
  console.log("Skill #91 update completed successfully!");
}

run();
