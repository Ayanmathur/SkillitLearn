# SkillItLearn

A career → path → skill learning platform with quizzes and verifiable certificates.

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router, TypeScript) |
| **Styling** | Tailwind CSS + CSS variables for light/dark theming |
| **ORM** | Prisma (all DB access) |
| **Auth & Storage** | Supabase JS client (`@supabase/ssr`) |
| **Validation** | Zod (every API route) |
| **Database** | Supabase Postgres |
| **Hosting** | Vercel / Prisma Compute |

> **ORM strategy**: Prisma handles ALL database reads/writes. The Supabase JS client is used ONLY for Auth and Storage. This prevents two competing DB access layers.

---

## Standing Security Rules

These rules apply to **every feature** built in this project. They never expire.

### 1. Parameterized Queries Only
Never use raw SQL string concatenation. All DB access goes through Prisma, which uses parameterized queries by default.

### 2. Row Level Security (RLS)
Every table has RLS enabled with default-deny. Explicit allow policies are written per role. No table is ever left with RLS off "temporarily."

### 3. Input Validation
Every API route and server action validates input with **Zod** before touching the database. Malformed, oversized, or wrong-type payloads are rejected with a generic error message (detail goes to server-side logs only).

### 4. Server-Side Role Checks
Every mutation re-checks the user's role from the database session — never trusts a client-supplied role, user ID, or "isOwner" flag. The middleware provides a first line of defense; the route handler provides the authoritative check.

### 5. File Upload Validation
- MIME type validated by actual file header/magic bytes (not just extension or client-reported content-type)
- Size caps enforced
- Stored in **private** Supabase Storage buckets
- Accessed via **signed, expiring URLs** — never public bucket URLs
- Images re-encoded/stripped of EXIF server-side

### 6. Rate Limiting
Applied to:
- Auth endpoints (login, signup, password reset)
- Quiz submission
- Certificate verification
- Content-write endpoints (admin/instructor)

### 7. Audit Logging
An `audit_log` table records:
- Certificate issuance
- Admin content changes (create/update/delete)
- Role promotions

### 8. Secrets Management
- Service role key, DB connection strings, and HMAC secrets live **only** in server-side env vars
- Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are browser-accessible
- Before any prompt is marked done, grep the client bundle to confirm no secrets leaked

---

## Design System

### Colors
| Token | Value | Usage |
|---|---|---|
| `navy-header` | `#2f3759` | Header background |
| `navy-heading` | `#2f3757` | Headings |
| `navy-body` | `#2f3756` | Body text |
| `navy-button` | `#2f3754` | Button text on accent |
| `accent` | `#4ad3b1` | CTAs, active states |
| `accent-hover` | `#43b598` | CTA hover |
| `accent-light` | `#a4e9d7` | Light accent backgrounds |

### Typography
- **Font**: Montserrat (400/600/700/800, italic 400/600) via `next/font`
- **Headings**: Bold (700), tight letter-spacing (-0.01em)
- **Body**: Regular (400), navy-body color

### Components
- **Buttons**: `rounded-full` (pill), accent background, dark navy text, subtle shadow
- **Cards**: Soft shadow, `rounded-xl`, generous padding (p-6/p-8), no hard borders
- **Theme Toggle**: Sun/moon icon in header, respects `prefers-color-scheme`, persists to localStorage

### Dark Mode
- Token-driven from day one (CSS variables on `:root` / `[data-theme="dark"]`)
- Both palettes independently contrast-checked (WCAG AA 4.5:1 body text)
- Accent slightly desaturated in dark mode to avoid the "glowing teal on black" tell
- Visible toggle in the header

---

## Project Structure

```
src/
├── app/                  # App Router pages
│   ├── layout.tsx        # Root layout (Montserrat, theme init)
│   ├── page.tsx          # Home page
│   └── globals.css       # CSS variables, base styles, component classes
├── components/
│   └── ui/               # Design system components
│       ├── button.tsx     # Pill button (primary/secondary/ghost)
│       ├── card.tsx       # Soft-shadow card
│       ├── theme-toggle.tsx  # Light/dark toggle
│       └── theme-init-script.tsx  # Flash prevention
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   ├── rate-limit.ts     # Rate limiting utility
│   ├── supabase/
│   │   ├── client.ts     # Browser client (Auth only)
│   │   └── server.ts     # Server client (Auth + Storage)
│   └── validators/       # Zod schemas per domain
├── types/                # Shared TypeScript types
└── middleware.ts         # Auth session refresh + route guards
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Fill in Supabase credentials

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

---

## Environment Variables

| Variable | Scope | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + Server | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + Server | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Yes |
| `DATABASE_URL` | Server only | Yes |
| `DIRECT_URL` | Server only (migrations) | Yes |
