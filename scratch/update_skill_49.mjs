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

const skillId = "bd47c08e-680c-43bc-b0f3-3ed3dc1819f1";

async function run() {
  console.log("Updating Skill #49: Web Application Security (9 steps across 3 tracks)...");

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

  // If there are extra tracks (e.g. 4), delete extra
  if (tracks.length > 3) {
    const extraTrackIds = tracks.slice(3).map((t) => t.id);
    await supabase.from("steps").delete().in("track_id", extraTrackIds);
    await supabase.from("tracks").delete().in("id", extraTrackIds);
    tracks = tracks.slice(0, 3);
  }

  const track1Id = tracks[0].id;
  const track2Id = tracks[1].id;
  const track3Id = tracks[2].id;

  // Update Track titles
  await supabase.from("tracks").update({ title: "Track 1: OWASP Top 10, Injection Flaws and Cloud Metadata SSRF" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Client-Side Security: XSS, CSRF, CORS and Cookie Architecture" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Insecure Deserialization, SSTI, GraphQL and API Security" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / OSWE / PortSwigger Web Security level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "The OWASP Top 10 Taxonomy and Broken Access Controls (IDOR)",
      order_index: 1,
      content: `### Web Application Vulnerability Taxonomy and Access Control Failures

The Open Web Application Security Project (OWASP) Top 10 provides the global baseline for web application vulnerabilities:

1. The OWASP Top 10 (2021) Categories:
   - A01: Broken Access Control (Ranked #1 most critical risk).
   - A02: Cryptographic Failures.
   - A03: Injection (SQL, Command, LDAP).
   - A04: Insecure Design.
   - A05: Security Misconfiguration.
   - A06: Vulnerable and Outdated Components.
   - A07: Identification and Authentication Failures.
   - A08: Software and Data Integrity Failures.
   - A09: Security Logging and Monitoring Failures.
   - A10: Server-Side Request Forgery (SSRF).

2. Insecure Direct Object References (IDOR):
   - Horizontal Privilege Escalation: Accessing another user's private records by manipulating unvalidated parameter IDs (e.g. changing \`/api/documents?id=1024\` to \`id=1025\`).
   - Vertical Privilege Escalation: Gaining administrative functionality via unauthenticated direct endpoint requests (\`/admin/delete_user\`).
   - Mitigation: Enforcing centralized, server-side object-level access control checks on every request, verifying the session user owns the requested record.`
    },
    {
      track_id: track1Id,
      title: "Advanced SQL Injection: In-Band, Blind and Time-Based Exploits",
      order_index: 2,
      content: `### Database Injection Mechanics and Parameterized Remediation

1. SQL Injection Taxonomy:
   - In-Band (Classic / UNION-based): Combining malicious queries with original statements to extract schema and data directly in the HTTP response:
\`\`\`sql
' UNION SELECT null, username, password FROM users-- -
\`\`\`
   - Error-Based SQLi: Triggering database runtime errors revealing table data in verbose error logs.
   - Blind Boolean-Based SQLi: Extracting data character-by-character by measuring true/false application responses (\`' AND SUBSTRING((SELECT password FROM users WHERE username='admin'),1,1)='a'--\`).
   - Blind Time-Based SQLi: Inferring data using conditional time delays (\`' OR (SELECT 1 FROM (SELECT pg_sleep(5))a)--\`).

2. Definitive Remediation:
   - Parameterized Queries (Prepared Statements): Binds user input strictly as data parameters, preventing the SQL query interpreter from parsing input as executable code semantics.
   - Object-Relational Mapping (ORM): Utilizing secure ORM abstractions while avoiding unsafe raw SQL query methods.`
    },
    {
      track_id: track1Id,
      title: "Server-Side Request Forgery (SSRF) and Cloud Metadata Exfiltration",
      order_index: 3,
      content: `### Backend Request Forgery and Cloud Infrastructure Exploitation

1. Server-Side Request Forgery (SSRF):
   - Occurs when a web application fetches a remote resource based on a user-supplied URL without validating the destination.

2. Cloud Metadata Exploitation:
   - AWS EC2 Instance Metadata Service (IMDS): Querying the link-local address \`http://169.254.169.254/latest/meta-data/iam/security-credentials/\` to steal temporary IAM role credentials and establish cloud persistence.
   - Localhost Exploitation: Accessing loopback interfaces (\`http://127.0.0.1:8080/actuator\`) to access unauthenticated admin dashboards.

3. Filter Bypasses:
   - Decimal IP notation (\`http://2130706433\`), Octal (\`http://0177.0.0.1\`), Hex (\`http://0x7f000001\`), and DNS Rebinding.

4. Defense and AWS IMDSv2:
   - Enforcing AWS IMDSv2 (requiring a session token generated via a local PUT request, which blocks SSRF payloads lacking custom header injection capability).`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Cross-Site Scripting: Reflected, Stored, DOM and CSP Bypasses",
      order_index: 1,
      content: `### Client-Side Code Injection and Execution Mechanisms

1. The Three Primary Flavors of XSS:
   - Stored (Persistent) XSS: Malicious JavaScript is permanently stored in the database (e.g. comment field, user profile); executes inside the browser of every visitor viewing the content.
   - Reflected (Non-Persistent) XSS: Injected script is reflected off the web server via URL query parameters or search bars.
   - DOM-Based XSS: Execution vulnerability existing purely in client-side JavaScript where an untrusted Source (\`location.hash\`, \`document.referrer\`) is passed into an unsafe Sink (\`element.innerHTML\`, \`eval()\`, \`document.write\`).

2. Impact:
   - Session hijacking via cookie theft, keystroke logging, and client-side credential phishing.

3. Defense-in-Depth:
   - Context-Aware Output Encoding (HTML entity, JavaScript attribute, URL encoding).
   - Content Security Policy (CSP): Restricting executable script sources (\`Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-r4nd0m'\`).`
    },
    {
      track_id: track2Id,
      title: "Cross-Site Request Forgery and SameSite Cookie Architecture",
      order_index: 2,
      content: `### State-Changing Request Forgery and Cookie Security Attributes

1. Cross-Site Request Forgery (CSRF):
   - Exploits browser ambient authority: An attacker tricks a logged-in victim browser into executing unwanted state-changing POST requests (e.g. changing email address or transferring funds) to a vulnerable target application.

2. Modern Cookie Security Flags:
   - \`SameSite=Strict\`: Cookie is never sent on cross-site requests, eliminating CSRF for standard web apps.
   - \`SameSite=Lax\`: Cookie is withheld on cross-site sub-requests (images, forms), but sent on top-level cross-site GET navigations.
   - \`HttpOnly\`: Blocks client-side JavaScript access to \`document.cookie\`, protecting session tokens from XSS theft.
   - \`Secure\`: Mandates cookie transmission exclusively over encrypted HTTPS connections.

3. Anti-CSRF Tokens:
   - Synchronizer Token Pattern: Generating unique, cryptographically random, per-session tokens validated on all state-changing HTTP requests.`
    },
    {
      track_id: track2Id,
      title: "Cross-Origin Resource Sharing (CORS) Misconfigurations",
      order_index: 3,
      content: `### Same-Origin Policy (SOP) Mechanics and CORS Exploitation

1. The Same-Origin Policy (SOP):
   - Fundamental browser security sandbox preventing scripts loaded on Origin A (\`https://attacker.com\`) from reading sensitive response data from Origin B (\`https://target-bank.com\`). Origin is defined by Protocol, Host, and Port.

2. Exploitable CORS Misconfigurations:
   - Origin Reflection with Credentials:
\`\`\`http
Access-Control-Allow-Origin: https://attacker.com
Access-Control-Allow-Credentials: true
\`\`\`
   - Allows an attacker domain to issue authenticated cross-origin \`fetch()\` requests and exfiltrate private user folios and API tokens.
   - Trusting the \`null\` Origin: Exploitable via sandboxed iframes (\`<iframe sandbox="allow-scripts" src="...">\`).

3. Secure CORS Implementation:
   - Avoid dynamic reflection of the \`Origin\` header; maintain strict server-side origin whitelists.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Insecure Deserialization and Object Injection Exploits",
      order_index: 1,
      content: `### Object Serialization Vulnerabilities and Remote Code Execution

1. Insecure Deserialization Mechanics:
   - Converting serialized byte streams back into live in-memory objects without verifying data integrity.
   - An attacker tampers with serialized object state or class definitions to trigger arbitrary code execution during instantiation.

2. Language-Specific Deserialization Exploits:
   - Java Deserialization (\`ObjectInputStream.readObject()\`, Apache Commons Collections gadget chains executed via \`ysoserial\`).
   - PHP Object Injection: Passing untrusted input to \`unserialize()\`, triggering magic methods (\`__wakeup()\`, \`__destruct()\`, \`__toString()\`).
   - Python \`pickle\`: Exploiting \`pickle.loads()\` via \`__reduce__\` methods executing \`os.system\`.

3. Remediation:
   - Avoid native object serialization formats for untrusted data; adopt structured formats like JSON or Protocol Buffers, and use cryptographic HMAC signing if serialized tokens are required.`
    },
    {
      track_id: track3Id,
      title: "Server-Side Template Injection (SSTI) and Command Injection",
      order_index: 2,
      content: `### Template Engine Exploitation and OS Command Injection

1. Server-Side Template Injection (SSTI):
   - Occurs when user input is concatenated directly into template engine strings rather than passed as data context:
   - Detection Polyglots: Injecting \`{{7*7}}\`, \`\${7*7}\`, \`<%= 7*7 %>\`.
   - Python Jinja2 / Flask Sandbox Escapes: Navigating object inheritance to execute arbitrary system commands:
\`\`\`jinja2
{{ self._TemplateReference__context.cycler.__init__.__globals__.os.popen('id').read() }}
\`\`\`

2. OS Command Injection:
   - Occurs when applications pass unsanitized input to system shell execution functions (\`system()\`, \`exec()\`, \`subprocess.Popen(..., shell=True)\`).
   - Exploitation: Chaining shell metacharacters (\`;\`, \`|\`, \`&&\`, \`\` \` \`\`).
   - Defense: Avoid shell invocation; pass command arguments as discrete arrays without shell interpreters.`
    },
    {
      track_id: track3Id,
      title: "API Security: GraphQL Introspection, BOLA and JWT Exploitation",
      order_index: 3,
      content: `### Modern API Vulnerabilities, GraphQL and Token Security

1. Broken Object Level Authorization (BOLA):
   - The API equivalent of IDOR; the #1 vulnerability in the OWASP API Security Top 10, allowing unauthorized access to endpoints like \`GET /api/v1/users/{userId}/financials\`.

2. GraphQL Vulnerabilities:
   - Schema Enumeration via Introspection: Attackers query \`__schema\` to extract all types, queries, and mutations.
   - Circular Query Denial of Service: Deeply nested recursive queries consuming 100% database CPU.
   - Defense: Disable introspection in production; implement Query Depth Limiting and Query Cost Analysis.

3. JSON Web Token (JWT) Exploits:
   - The \`alg: "none"\` Vulnerability: Stripping the cryptographic signature and setting algorithm to none.
   - Key Confusion Attacks: Forcing the server to verify an RSA public key using HMAC-SHA256 (symmetric verification with a known public key).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #49.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "According to the OWASP Top 10 (2021), what vulnerability category holds the #1 position as the most critical risk to web applications?",
      options: [
        "Cryptographic Failures",
        "Injection",
        "A01: Broken Access Control",
        "Security Misconfiguration"
      ],
      correct_option_index: 2,
      explanation: "Broken Access Control (A01) is ranked as the #1 most prevalent and impactful security risk in modern web applications.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What type of Cross-Site Scripting (XSS) occurs when malicious JavaScript is permanently saved into a database (e.g. in a comment section) and executes in the browser of every visitor?",
      options: [
        "Stored (Persistent) XSS",
        "Reflected XSS",
        "DOM-Based XSS",
        "Blind XSS"
      ],
      correct_option_index: 0,
      explanation: "Stored XSS occurs when untrusted script is saved persistently on the server and served to all subsequent users viewing that content.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What cookie security flag blocks client-side JavaScript from reading 'document.cookie', preventing session token theft during XSS attacks?",
      options: [
        "SameSite=None",
        "Domain=.com",
        "Path=/",
        "HttpOnly"
      ],
      correct_option_index: 3,
      explanation: "The HttpOnly flag ensures that cookies cannot be accessed or read by client-side JavaScript scripts, protecting session tokens from XSS theft.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What definitive software development practice completely eliminates SQL Injection vulnerabilities by separating SQL command syntax from user data parameters?",
      options: [
        "Using regular expressions to remove quotes",
        "Parameterized Queries (Prepared Statements)",
        "Turning off database logging",
        "Converting everything to uppercase"
      ],
      correct_option_index: 1,
      explanation: "Prepared statements treat user input strictly as literal data parameters, preventing the SQL parser from interpreting input as executable code.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In AWS cloud environments, what link-local IP address is targeted by Server-Side Request Forgery (SSRF) attacks to extract temporary IAM role credentials?",
      options: [
        "127.0.0.1",
        "192.168.1.1",
        "169.254.169.254 (Instance Metadata Service)",
        "8.8.8.8"
      ],
      correct_option_index: 2,
      explanation: "169.254.169.254 is the link-local EC2 Instance Metadata Service address used by SSRF exploits to harvest temporary cloud IAM credentials.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In web application access control, what is an 'Insecure Direct Object Reference' (IDOR)?",
      options: [
        "A broken web link leading to a 404 page",
        "An application exposes a direct reference to an internal database object (such as /api/invoice?id=105) without verifying on the server that the session user owns that object",
        "An unencrypted Wi-Fi router",
        "A missing CSS stylesheet"
      ],
      correct_option_index: 1,
      explanation: "IDOR occurs when user-supplied parameter keys directly query database records without server-side verification of user ownership.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "How does the cookie attribute 'SameSite=Strict' defend web applications against Cross-Site Request Forgery (CSRF) attacks?",
      options: [
        "It encrypts passwords with AES-256",
        "It deletes cookies every 5 minutes",
        "It requires biometric authentication",
        "The browser completely withholds the cookie on all cross-site requests, preventing third-party malicious sites from leveraging authenticated user sessions"
      ],
      correct_option_index: 3,
      explanation: "SameSite=Strict prevents the browser from sending cookies along with any cross-site request, neutralizing CSRF attacks completely.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In Cross-Origin Resource Sharing (CORS) security, why is returning 'Access-Control-Allow-Origin: https://attacker.com' combined with 'Access-Control-Allow-Credentials: true' catastrophic?",
      options: [
        "It permits the attacker domain to make authenticated cross-origin JavaScript fetch() requests and read sensitive response bodies and private user data",
        "It changes the website background color",
        "It makes the web server crash instantly",
        "It disables HTML5 features"
      ],
      correct_option_index: 0,
      explanation: "Reflecting arbitrary origins with Allow-Credentials: true bypasses the Same-Origin Policy, allowing external sites to steal private user data.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In GraphQL API security, what vulnerability allows an attacker to automatically reconstruct the entire schema, including private data models and administrative mutations?",
      options: [
        "SQL Injection",
        "Buffer Overflow",
        "Enabled GraphQL Introspection Queries (__schema)",
        "DNS Tunneling"
      ],
      correct_option_index: 2,
      explanation: "Enabled introspection queries allow attackers to query __schema, dumping all data types, fields, queries, and mutations in the API.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "How does AWS Instance Metadata Service Version 2 (IMDSv2) mitigate Server-Side Request Forgery (SSRF) credential theft?",
      options: [
        "By disabling all cloud virtual machines",
        "It requires a session token generated via an HTTP PUT request with custom TTL headers, which typical SSRF vulnerabilities cannot forge",
        "By making all EC2 instances public",
        "By requiring passwords on every web page"
      ],
      correct_option_index: 1,
      explanation: "IMDSv2 requires a session token acquired via a local PUT request, neutralizing standard SSRF exploits that only generate GET/POST requests.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "In Server-Side Template Injection (SSTI) against Python Jinja2 applications, how does an injected payload like '{{ self._TemplateReference__context.cycler.__init__.__globals__.os.popen('id').read() }}' achieve Remote Code Execution (RCE)?",
      options: [
        "By breaking the monitor screen",
        "By downloading a virus from GitHub",
        "By sending an email to the server admin",
        "It traverses Python object inheritance trees to access the global scope and Python 'os' module, executing arbitrary operating system commands inside the server process"
      ],
      correct_option_index: 3,
      explanation: "SSTI exploits object reflection in template engines, navigating class hierarchies to reach the os module and execute shell commands.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Insecure Deserialization exploits, what mechanism allows tools like 'ysoserial' (Java) to achieve arbitrary code execution when untrusted data is passed to 'readObject()'?",
      options: [
        "Chaining pre-existing class methods ('gadget chains') present on the application classpath (e.g. Apache Commons Collections) that execute commands during automatic object instantiation",
        "Overheating the computer CPU",
        "Cracking passwords via brute force",
        "Flooding the network with UDP packets"
      ],
      correct_option_index: 0,
      explanation: "Gadget chains link existing library classes on the classpath to trigger dangerous method invocations (like Runtime.getRuntime().exec()) during deserialization.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In JSON Web Token (JWT) authentication, what is an 'Algorithm Confusion' (Key Confusion) vulnerability?",
      options: [
        "A typo in the username field",
        "A token with an expired date",
        "An attacker changes the token header 'alg' from RS256 (asymmetric) to HS256 (symmetric), signing the token with the server's public RSA key (which the server uses as an HMAC secret key)",
        "A JWT that is too long"
      ],
      correct_option_index: 2,
      explanation: "Algorithm confusion tricks a server expecting RS256 into verifying with HS256 using its public key as the HMAC secret.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "What distinguishes DOM-Based XSS from Reflected and Stored XSS in terms of execution flow?",
      options: [
        "DOM XSS only runs on Windows computers",
        "In DOM-Based XSS, the malicious payload is executed entirely within the client-side browser DOM without the malicious payload ever being sent to or processed by the backend web server",
        "DOM XSS requires writing code in C++",
        "DOM XSS only affects CSS styles"
      ],
      correct_option_index: 1,
      explanation: "DOM XSS vulnerabilities exist entirely in client-side script execution (processing untrusted sources into unsafe sinks) without server involvement.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In API security, what is 'Broken Object Level Authorization' (BOLA / OWASP API1:2023) and why is it prevalent in REST and GraphQL APIs?",
      options: [
        "API endpoints rely on object IDs supplied by clients (e.g. /api/users/882/profile) without validating on the server that the authenticated caller has authorization to access that specific object",
        "An API that returns HTML instead of JSON",
        "An API that uses HTTP port 80",
        "A database that has too many tables"
      ],
      correct_option_index: 0,
      explanation: "BOLA occurs when APIs accept object identifiers without verifying authorization, enabling unauthorized access to other users' private data.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #49.");
  console.log("Skill #49 update completed successfully!");
}

run();
