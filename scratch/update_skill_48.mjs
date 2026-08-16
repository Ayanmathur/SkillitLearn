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

const skillId = "7c6da546-18fa-4b99-8483-733cfc137301";

async function run() {
  console.log("Updating Skill #48: Linux for Security (9 steps across 3 tracks)...");

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
  await supabase.from("tracks").update({ title: "Track 1: Linux Permissions, File Hierarchy and Kernel Capabilities" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Linux Privilege Escalation and Exploitation Vectors" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Kernel Hardening, Network Filtering and Rootkit Detection" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / OSCP / Linux Security level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "POSIX File Permissions, Special Bits and Filesystem Hierarchy",
      order_index: 1,
      content: `### Linux Discretionary Access Control and Filesystem Architecture

Linux system security relies on POSIX discretionary access controls (DAC) and the Filesystem Hierarchy Standard (FHS):

1. Standard POSIX Permission Matrix:
   - Read (4 / \`r\`), Write (2 / \`w\`), Execute (1 / \`x\`) across User (owner), Group, and Other (\`chmod 750 script.sh\`).

2. Special Permission Bits:
   - SUID (Set User ID - \`chmod 4755\`, displayed as \`-rwsr-xr-x\`): Binary executes with the effective UID of the file owner (typically root e.g. \`/usr/bin/passwd\`).
   - SGID (Set Group ID - \`chmod 2755\`, displayed as \`-rwxr-sr-x\`): Binary executes with group GID; when set on a directory, newly created files automatically inherit the parent directory's group ownership.
   - Sticky Bit (\`chmod 1777\`, displayed as \`drwxrwxrwt\`): Applied to shared directories (\`/tmp\`, \`/var/tmp\`); restricts file deletion or renaming exclusively to the file owner or root.

3. Virtual Filesystem Security:
   - \`/proc\`: In-memory pseudo-filesystem exposing running kernel state, hardware devices, and per-process memory maps (\`/proc/[PID]/maps\`, \`/proc/[PID]/cmdline\`, \`/proc/sys/net/ipv4/ip_forward\`).`
    },
    {
      track_id: track1Id,
      title: "Linux Kernel Capabilities: Granular Root Deconstruction",
      order_index: 2,
      content: `### POSIX 1003.1e Capabilities and Privilege Decomposition

Traditional UNIX security treated root as an all-or-nothing security privilege. Linux kernel capabilities divide root authority into approximately 40 granular privileges:

1. Critical Linux Capabilities:
   - \`CAP_NET_BIND_SERVICE\`: Allows unprivileged processes to bind sockets to low privileged network ports (< 1024) without requiring root execution.
   - \`CAP_NET_RAW\`: Permits construction of raw network packets (used by \`ping\` and packet sniffers).
   - \`CAP_SYS_ADMIN\`: Highly powerful capability granting filesystem mounts, namespace manipulation, and device driver configurations.
   - \`CAP_SETUID\` & \`CAP_SETGID\`: Permits arbitrary manipulation of process user and group IDs.

2. Auditing and Setting Capabilities:
   - Inspecting capabilities: \`getcap -r / 2>/dev/null\`
   - Setting capabilities: \`setcap cap_net_raw+ep /usr/bin/ping\`
   - Security Risk: Writable binaries or script interpreters (e.g. Python) assigned \`cap_setuid+ep\` allow instant local privilege escalation to root.`
    },
    {
      track_id: track1Id,
      title: "Pluggable Authentication Modules (PAM) Architecture",
      order_index: 3,
      content: `### Linux Authentication Subsystem and PAM Configuration

Pluggable Authentication Modules (PAM) provide a dynamic, modular framework for authenticating users across all Linux services (\`/etc/pam.d/\`):

1. The Four PAM Module Interface Types:
   - \`auth\`: Verifies user credentials (passwords, OTP tokens, biometric keys).
   - \`account\`: Validates account status (password expiration, time-of-day access, account lockouts).
   - \`password\`: Handles credential updates and enforces password complexity policies.
   - \`session\`: Sets up and terminates the user environment (mounting home directories, logging resource limits).

2. PAM Control Flags:
   - \`required\`: Must succeed for authentication; evaluation continues through the remaining stack.
   - \`requisite\`: Must succeed; upon failure, authentication aborts immediately.
   - \`sufficient\`: If successful and no prior required module failed, authentication succeeds immediately.
   - \`optional\`: Failure or success is ignored unless it is the only module.

3. Brute Force Hardening:
   - Configuring \`pam_faillock.so\` to lock accounts automatically after consecutive failed authentication attempts.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "SUID Binaries, GTFOBins and Living-off-the-Land Exploits",
      order_index: 1,
      content: `### SUID Privilege Escalation and Binary Exploitation

1. Hunting SUID/SGID Binaries:
   - Locating all SUID binaries on a target host:
\`\`\`bash
find / -perm -u=s -type f 2>/dev/null
\`\`\`

2. GTFOBins Living-off-the-Land Exploitation:
   - Abusing legitimate native binaries possessing SUID root bits to break out into an interactive root shell:
     - \`find\` SUID escape: \`find . -exec /bin/sh -p \\;\`
     - \`vim\` / \`vi\` SUID escape: \`vim -c ':!/bin/sh -p'\`
     - \`base64\` file read: \`base64 /etc/shadow | base64 -d\`
     - \`cp\` / \`chmod\` abuse: Overwriting \`/etc/passwd\` with a forged root account or modifying file permissions.

3. Shared Library Hijacking (LD_PRELOAD and RPATH):
   - Injecting custom compiled shared libraries (\`.so\`) into binaries where insecure dynamic linker search paths (\`rpath\` / \`runpath\`) or sudo environment variables (\`env_keep += LD_PRELOAD\`) permit execution of arbitrary root code.`
    },
    {
      track_id: track2Id,
      title: "Sudo Misconfigurations, PATH Hijacking and Wildcards",
      order_index: 2,
      content: `### Sudo Rights Exploitation and Execution Vulnerabilities

1. Sudo Enumeration and Exploitation:
   - Enumerating permitted sudo rights: \`sudo -l\`
   - Bypassing restricted sudo binaries using built-in command escapes (e.g. \`sudo less /var/log/syslog\` followed by invoking \`!/bin/sh\`, or \`sudo awk 'BEGIN {system(\"/bin/sh\")}'\`).

2. PATH Environment Hijacking:
   - If an automated administrative script or root binary calls a program using a relative path (\`service apache2 restart\`) rather than an absolute path (\`/usr/sbin/service\`), an attacker creates a malicious executable named \`service\` in a writable directory (\`/tmp\`) and prepends it to the PATH variable: \`export PATH=/tmp:$PATH\`.

3. Cron Job Wildcard Exploitation:
   - If a root cron job executes \`tar -czf /backup/backup.tar.gz *\` in a world-writable directory, creating files named \`--checkpoint=1\` and \`--checkpoint-action=exec=sh exploit.sh\` triggers command execution flags in the tar utility.`
    },
    {
      track_id: track2Id,
      title: "Linux Mandatory Access Control: SELinux and AppArmor",
      order_index: 3,
      content: `### Kernel-Enforced Mandatory Access Control (MAC)

Mandatory Access Control confines processes even if an adversary gains root execution:

1. Security-Enhanced Linux (SELinux):
   - Developed by the NSA; implements Type Enforcement, Role-Based Access Control, and Multi-Level Security (MLS).
   - Security Context Anatomy: \`user:role:type:level\` (e.g. \`system_u:object_r:httpd_sys_content_t:s0\`).
   - Operating Modes: \`Enforcing\` (actively blocks and logs violations), \`Permissive\` (logs violations without blocking), \`Disabled\`.
   - Managing SELinux: \`ls -Z\`, \`ps -eZ\`, \`sestatus\`, \`restorecon -Rv /var/www/html\`, and \`audit2allow\` for analyzing \`/var/log/audit/audit.log\` denials.

2. AppArmor (Canonical / openSUSE):
   - Path-based MAC profiles residing in \`/etc/apparmor.d/\`.
   - Modes: \`enforce\` vs \`complain\`.
   - Commands: \`aa-status\`, \`aa-enforce /etc/apparmor.d/usr.bin.nginx\`, restricting daemons strictly to defined file paths and network sockets.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Kernel Hardening: Sysctl, ASLR and Lynis Security Audits",
      order_index: 1,
      content: `### Linux Kernel Hardening and Automated Security Auditing

1. Kernel Hardening via Sysctl (\`/etc/sysctl.d/99-security.conf\`):
   - Address Space Layout Randomization (ASLR): \`kernel.randomize_va_space = 2\` (randomizes stack, data segment, vDSO page, and memory mapping base).
   - Kernel Pointer Protection: \`kernel.kptr_restrict = 2\` (hides kernel memory addresses from \`/proc/kallsyms\`).
   - Restricting dmesg Kernel Logs: \`kernel.dmesg_restrict = 1\` (prevents unprivileged users from reading kernel logs to harvest memory leak offsets).
   - Symlink / Hardlink Protections: \`fs.protected_symlinks = 1\` and \`fs.protected_hardlinks = 1\` (blocks symlink race condition exploits in world-writable directories).

2. Automated Security Auditing with Lynis:
   - Executing \`lynis audit system\` to evaluate host configuration, kernel parameters, open ports, SSH ciphers, and file permissions, generating a standardized Hardening Index score.`
    },
    {
      track_id: track3Id,
      title: "Linux Packet Filtering: iptables, nftables and Firewalls",
      order_index: 2,
      content: `### In-Kernel Network Filtering with Netfilter and nftables

1. The Netfilter Framework and iptables Architecture:
   - Tables: \`filter\` (packet filtering), \`nat\` (network address translation), \`mangle\` (packet alteration).
   - Default Chains: \`INPUT\`, \`OUTPUT\`, \`FORWARD\`, \`PREROUTING\`, \`POSTROUTING\`.
   - Stateful Firewall Ruleset:
\`\`\`bash
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW -j ACCEPT
\`\`\`

2. Modern nftables:
   - Replaces legacy iptables/ip6tables/arptables with a unified bytecode virtual machine in the Linux kernel, offering faster execution and atomic ruleset reloading (\`nft list ruleset\`).`
    },
    {
      track_id: track3Id,
      title: "Rootkit Detection, Integrity Auditing and Memory Inspection",
      order_index: 3,
      content: `### Host Integrity Verification and Stealth Malware Detection

1. Rootkit Architecture:
   - User-Space Rootkits: Replacing system binaries (\`ls\`, \`ps\`, \`netstat\`) or hooking libc functions via \`/etc/ld.so.preload\`.
   - Kernel-Space Rootkits (LKM - Loadable Kernel Modules): Direct kernel memory manipulation, hooking the \`sys_call_table\` or unlinking kernel modules to hide network sockets, files, and processes.

2. Rootkit Scanning and Binary Integrity Auditing:
   - Scanning Tools: \`rkhunter --check\` and \`chkrootkit\` searching for known rootkit signatures, hidden files, and modified system calls.
   - Package Manager Integrity Auditing:
     - Debian/Ubuntu: \`debsums -c\` (verifies MD5/SHA256 hashes of installed binaries against original package repository signatures).
     - RHEL/Rocky: \`rpm -Va\` (flags modified binary sizes, MD5 digests, and file permissions).`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #48.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 0, 2, 1, 3, 0)
    {
      skill_id: skillId,
      question_text: "In Linux file permissions, what does setting the SUID (Set User ID) special permission bit on an executable binary (e.g. /usr/bin/passwd) accomplish?",
      options: [
        "The binary executes with the effective permissions of the file owner (typically root) rather than the user executing it",
        "The binary is deleted immediately",
        "The binary can only be run on Sundays",
        "The file is encrypted with a password"
      ],
      correct_option_index: 0,
      explanation: "SUID permits an unprivileged user to execute a binary with the file owner's (root's) permissions, such as allowing users to modify their own password file.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What special permission bit applied to a shared directory (such as '/tmp' with permissions 'drwxrwxrwt') prevents users from deleting or renaming files owned by other users?",
      options: [
        "SUID Bit",
        "SGID Bit",
        "Sticky Bit (chmod 1777)",
        "Execute Bit"
      ],
      correct_option_index: 2,
      explanation: "The sticky bit restricts file deletion and renaming in world-writable shared directories exclusively to the file owner or root.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "In Linux system administration and security auditing, what command is used to enumerate all allowed sudo privileges for the current user?",
      options: [
        "whoami",
        "sudo -l",
        "ls -la",
        "pwd"
      ],
      correct_option_index: 1,
      explanation: "sudo -l lists all allowed and forbidden commands for the invoking user as specified in /etc/sudoers.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "What Linux command-line command searches the entire root filesystem to find all files with the SUID bit enabled while redirecting errors to /dev/null?",
      options: [
        "grep suid /etc/passwd",
        "cat /etc/shadow",
        "chmod 777 /",
        "find / -perm -u=s -type f 2>/dev/null"
      ],
      correct_option_index: 3,
      explanation: "find / -perm -u=s -type f searches for regular files with the SUID permission bit set, discarding permission denied errors.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "What kernel security feature randomizes the memory address space locations of the process stack, heap, and libraries to prevent buffer overflow exploits?",
      options: [
        "Address Space Layout Randomization (ASLR - kernel.randomize_va_space)",
        "Static Memory Allocation",
        "Swap Space",
        "Virtual Memory Paging"
      ],
      correct_option_index: 0,
      explanation: "ASLR randomizes memory layout offsets, preventing attackers from predicting target shellcode and function addresses.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 3, 1, 0, 2, 3)
    {
      skill_id: skillId,
      question_text: "In Linux kernel capabilities (POSIX 1003.1e), what specific capability allows a process to bind network sockets to privileged ports (< 1024) without requiring full root execution?",
      options: [
        "CAP_SYS_BOOT",
        "CAP_AUDIT_WRITE",
        "CAP_FOWNER",
        "CAP_NET_BIND_SERVICE"
      ],
      correct_option_index: 3,
      explanation: "CAP_NET_BIND_SERVICE explicitly authorizes binding to privileged ports (< 1024) without granting full root administrative powers.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Linux privilege escalation, what is the 'GTFOBins' project used for?",
      options: [
        "Downloading Linux wallpapers",
        "A curated catalog of legitimate native UNIX binaries that can be abused to bypass security restrictions, escape restricted shells, or escalate privileges when granted SUID or sudo rights",
        "An antivirus software program",
        "A package manager for Ubuntu"
      ],
      correct_option_index: 1,
      explanation: "GTFOBins catalogs living-off-the-land techniques to abuse standard Unix binaries (find, vim, awk, less) for privilege escalation.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In Security-Enhanced Linux (SELinux), what are the three operational modes available for system enforcement?",
      options: [
        "Enforcing (actively blocks and logs), Permissive (logs without blocking), and Disabled",
        "Fast, Medium, and Slow",
        "Admin, User, and Guest",
        "Online, Offline, and Standby"
      ],
      correct_option_index: 0,
      explanation: "SELinux operates in Enforcing (mandatory access control active), Permissive (diagnostics/logging only), or Disabled.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "In Pluggable Authentication Modules (PAM), what control flag ensures that a module must succeed, but aborts authentication immediately without evaluating the rest of the stack if it fails?",
      options: [
        "optional",
        "sufficient",
        "requisite",
        "required"
      ],
      correct_option_index: 2,
      explanation: "The 'requisite' control flag terminates the authentication chain immediately upon failure, whereas 'required' continues evaluating remaining modules.",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "How does an attacker exploit 'PATH Hijacking' when a root script or cron job executes a system command using a relative path (e.g. 'service nginx restart')?",
      options: [
        "By deleting the hard drive",
        "By turning off the network router",
        "By changing the computer wallpaper",
        "The attacker places a malicious executable named 'service' in a writable directory (e.g. /tmp) and prepends it to the PATH variable (export PATH=/tmp:$PATH), causing root to execute the malicious binary first"
      ],
      correct_option_index: 3,
      explanation: "When binaries are called without absolute paths, the operating system searches directories in $PATH order, executing local malicious binaries first.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 1, 2, 0, 3, 1)
    {
      skill_id: skillId,
      question_text: "In Linux package integrity auditing on Debian/Ubuntu systems, what command verifies that installed system binaries on disk match the original cryptographic checksums from the package repository?",
      options: [
        "apt-get update",
        "debsums -c (or rpm -Va on RHEL/CentOS)",
        "cat /etc/os-release",
        "dpkg -l"
      ],
      correct_option_index: 1,
      explanation: "debsums -c verifies installed file checksums against package digests, flagging modified or trojaned system binaries.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Linux cron job exploitation, how does an attacker exploit a root cron task executing 'tar -czf /backup/archive.tar.gz *' inside a user-writable directory?",
      options: [
        "By deleting the tar program",
        "By turning off the power switch",
        "By creating files named '--checkpoint=1' and '--checkpoint-action=exec=sh root_shell.sh', causing the wildcard expansion to interpret filenames as tar command-line parameter flags",
        "By renaming the backup directory"
      ],
      correct_option_index: 2,
      explanation: "Wildcard expansion passes file names as arguments to tar, interpreting --checkpoint-action as command-line execution parameters under root.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Linux kernel sysctl hardening, what does setting 'kernel.dmesg_restrict = 1' and 'kernel.kptr_restrict = 2' accomplish?",
      options: [
        "It prevents unprivileged users from reading kernel dmesg ring buffers and hides kernel memory pointers in /proc/kallsyms, blocking kernel exploit offset calculations",
        "It deletes all log files every 10 minutes",
        "It doubles CPU clock speed",
        "It disables the bash terminal"
      ],
      correct_option_index: 0,
      explanation: "Restricting dmesg and kptr prevents unprivileged attackers from discovering kernel function addresses and memory offsets needed for kernel exploitation.",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "What architectural mechanism in the Linux Netfilter framework allows a stateful firewall rule to accept return traffic for already established outbound TCP connections?",
      options: [
        "iptables -F",
        "iptables -P INPUT ACCEPT",
        "iptables -t nat -A POSTROUTING",
        "iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT"
      ],
      correct_option_index: 3,
      explanation: "The conntrack module tracks connection state, allowing packets associated with existing bidirectional sessions (ESTABLISHED, RELATED) through the firewall.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In rootkit mechanics, how does a Kernel-Space Rootkit (Loadable Kernel Module - LKM) hide malicious processes and network sockets from system diagnostic utilities?",
      options: [
        "By changing file names to start with a dot (.)",
        "By directly hooking the kernel 'sys_call_table' (e.g. sys_getdents64, sys_read) or unlinking kernel structures, filtering out adversary processes and sockets before returning data to user space",
        "By running inside a web browser",
        "By modifying the BIOS clock"
      ],
      correct_option_index: 1,
      explanation: "Kernel rootkits hook system call tables in kernel space, intercepting filesystem and process enumeration calls to filter out attacker artifacts.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #48.");
  console.log("Skill #48 update completed successfully!");
}

run();
