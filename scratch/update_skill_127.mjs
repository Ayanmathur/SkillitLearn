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

const skillId = "d30947b6-84eb-44fd-a7ad-c52c104804c2";

async function run() {
  console.log("Rebalancing Skill #127 Quiz Questions...");

  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "What is the supreme foundational security rule of authoritative multiplayer game architecture?",
      options: [
        "'Never Trust the Client' (the server must validate all player actions, damage, and movement)",
        "Trust everything the client computer sends",
        "Allow players to modify their own health in memory",
        "Disable all passwords on multiplayer servers"
      ],
      correct_option_index: 0,
      explanation: "Authoritative servers never trust client data; clients send input intents and the server simulates ground truth.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "Why is UDP (User Datagram Protocol) universally preferred over TCP for real-time fast-paced multiplayer games (like competitive shooters and racing)?",
      options: [
        "TCP is illegal in video games",
        "UDP is completely free while TCP costs money",
        "TCP causes devastating 'Head-of-Line Blocking' by re-sending lost packets and pausing game updates; UDP delivers lightweight, low-latency packets without blocking",
        "UDP makes game graphics look sharper"
      ],
      correct_option_index: 2,
      explanation: "TCP halts packet processing when one packet drops (head-of-line blocking); UDP provides low-latency non-blocking streaming.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In multiplayer netcode, what is 'Client-Side Prediction'?",
      options: [
        "A player predicting who will win the match",
        "Simulating the local player's movement immediately upon button input without waiting for server network round-trip confirmation, making control feel instantaneous",
        "AI predicting where enemies will spawn",
        "A tool used to download patches in advance"
      ],
      correct_option_index: 1,
      explanation: "Client-side prediction executes local character movement instantly, eliminating the feeling of lag for the local player.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "In multiplayer networking, what is 'RTT' (Round-Trip Time)?",
      options: [
        "Real Time Television",
        "Running Track Test",
        "Render Texture Target",
        "The duration of time (in milliseconds) required for a network packet to travel from the client to the server and back again (Ping)"
      ],
      correct_option_index: 3,
      explanation: "RTT (Round-Trip Time or ping) measures the total bidirectional network latency between client and server.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In multiplayer architecture, what is a 'Dedicated Server'?",
      options: [
        "A standalone authoritative server instance that simulates game logic and synchronizes clients without participating as a visual player",
        "A gaming PC dedicated to playing one game",
        "A hard drive dedicated to game files",
        "A computer monitor dedicated to games"
      ],
      correct_option_index: 0,
      explanation: "Dedicated servers run headless simulations, acting as authoritative referees for all connected client machines.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 2, 0, 3)
    {
      skill_id: skillId,
      question_text: "In client-side prediction systems, what occurs during 'Server Reconciliation' when the client's predicted position disagrees with the authoritative server snapshot?",
      options: [
        "The client computer is banned from the server",
        "The server is forced to accept the client's position",
        "The game shuts down immediately",
        "The client snaps its position back to the server authoritative point and rapidly replays all unacknowledged pending inputs to re-converge with the current predicted state"
      ],
      correct_option_index: 3,
      explanation: "Server reconciliation rewinds client state to server truth and re-simulates pending local inputs to correct prediction errors.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "How does 'Lag Compensation' (Server Hitbox Rewind) ensure fair hit registration for high-ping players in shooters like Counter-Strike or Valorant?",
      options: [
        "By giving high-ping players unlimited ammunition",
        "When a player fires, the server uses their timestamp to temporarily roll back all enemy hitboxes to where they appeared on the shooter's screen at that exact millisecond before evaluating raycasts",
        "By slowing down the movement speed of all other players",
        "By turning on aim-assist for lagging players"
      ],
      correct_option_index: 1,
      explanation: "Lag compensation rewinds world hitboxes to the shooter's visual timestamp, rewarding accurate crosshair placement.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In network replication, what is the architectural difference between a Remote Procedure Call (RPC) and State Synchronization (SyncVar / Replicated Property)?",
      options: [
        "RPCs are for persistent values (health); SyncVars are for sound effects",
        "There is zero difference; both do the exact same thing",
        "RPCs are one-off event messages (e.g. PlayExplosionEffect); State Synchronization continuously replicates persistent game state (e.g. Health, Inventory) to ensure late-joining players receive the latest data",
        "RPCs only work on local area networks"
      ],
      correct_option_index: 2,
      explanation: "RPCs send transient event notifications; State Synchronization replicates persistent, authoritative entity properties.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In network bandwidth optimization, what is 'Quantization'?",
      options: [
        "Compressing 32-bit floating point world positions into smaller 16-bit or 8-bit normalized integers, dramatically reducing the byte size of network packets",
        "Upgrading the computer CPU",
        "Playing audio through quantum speakers",
        "Multiplying player scores by 10"
      ],
      correct_option_index: 0,
      explanation: "Quantization scales and rounds floating-point values into compact integers, slashing packet payload bandwidth.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In large multiplayer worlds, what is 'Network Relevancy' (or Area of Interest / AOI)?",
      options: [
        "A list of popular multiplayer games",
        "A system that disconnects slow players",
        "A filter that removes bad words in chat",
        "A spatial partitioning system on the server that replicates data only for entities within a player's immediate visual and auditory radius, ignoring actors miles away"
      ],
      correct_option_index: 3,
      explanation: "Area of Interest culling limits replication to nearby actors, keeping server CPU and client bandwidth manageable at scale.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "In multiplayer rendering of remote player characters, why is 'Entity Interpolation' preferred over extrapolating their next position with dead reckoning?",
      options: [
        "Interpolation makes remote characters run twice as fast",
        "Extrapolation must guess future player inputs, resulting in severe overshoot jitter when enemies change direction; Interpolation renders past verified server states smoothly using a small buffer delay",
        "Interpolation uses zero computer memory",
        "Dead reckoning is completely impossible to code"
      ],
      correct_option_index: 1,
      explanation: "Interpolating past verified snapshots produces buttery smooth rendering, avoiding the wild overshooting errors of predictive extrapolation.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In network packet compression, what is 'Delta Compression'?",
      options: [
        "Compressing delta wings on airplanes",
        "Deleting all game assets before sending packets",
        "Transmitting only the specific bits or variables that have CHANGED since the last acknowledged baseline snapshot rather than sending the entire entity state every tick",
        "A method used to compress save games on disk"
      ],
      correct_option_index: 2,
      explanation: "Delta compression sends only state differences relative to the last acknowledged snapshot, minimizing packet sizes.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In peer-to-peer and client-server connectivity, what role do 'STUN and TURN' protocols play in NAT Traversal?",
      options: [
        "STUN discovers public IP/port mappings across home routers; TURN acts as a fallback relay server when strict symmetric NAT firewalls prevent direct peer-to-peer UDP hole-punching",
        "STUN and TURN are graphics rendering APIs",
        "They turn off router electricity",
        "They are audio compression algorithms"
      ],
      correct_option_index: 0,
      explanation: "STUN assists in UDP hole-punching; TURN relays traffic when symmetric NAT routers block direct peer connections.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Unreal Engine multiplayer C++, what is the role of the 'OnRep_' notification callback (e.g. UPROPERTY(ReplicatedUsing=OnRep_Health) float Health)?",
      options: [
        "It crashes the server when health reaches zero",
        "It only runs on the dedicated server",
        "It is a client-side function executed automatically whenever the server replicates a new updated value for Health, allowing clients to trigger UI health bar animations or audio alerts",
        "It deletes the character mesh"
      ],
      correct_option_index: 2,
      explanation: "OnRep functions fire on receiving clients upon variable replication, driving visual UI, particle effects, and audio updates.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In competitive fighting games and RTS games, what is 'Deterministic Lockstep' netcode and what is its primary operational vulnerability?",
      options: [
        "A lock placed on computer cases",
        "Every client executes the exact same mathematical game simulation driven exclusively by synchronized player inputs; its vulnerability is that a single lagging player freezes the entire match for all participants",
        "A system where players cannot press buttons",
        "A system that requires 10 gigabytes of internet speed"
      ],
      correct_option_index: 1,
      explanation: "Lockstep requires perfectly deterministic simulation from synchronized inputs; any packet delay stalls all clients.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully rebalanced 15 expert quiz questions for Skill #127.");
}

run();
